import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/upstash";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes max for Vercel Pro (adjust based on your plan)

interface DeferredApplication {
  id: string;
  jobCode: string;
  jobApplicationFormId?: string;
  fullName: string;
  email: string;
  phone: string;
  birthday?: string;
  gender?: string;
  address?: string;
  experience?: string;
  skillIds?: string[];
  fileBase64: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  status: "pending" | "processing" | "processed" | "failed";
  createdAt: string;
  attempts?: number;
  lastError?: string;
  result?: {
    analysisResult: unknown;
    matchScore?: number;
    processedAt: string;
  };
}

interface ProcessResult {
  id: string;
  status: "success" | "failed";
  error?: string;
}

// Security: verify cron secret token
function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is not set, only allow requests from Vercel Cron
  // Vercel Cron sends a special header
  if (!cronSecret) {
    const cronHeader = req.headers.get("x-vercel-cron");
    return cronHeader === "1";
  }

  // If CRON_SECRET is set, verify Bearer token
  return authHeader === `Bearer ${cronSecret}`;
}

async function processOne(id: string): Promise<ProcessResult> {
  try {
    const appKey = `deferred:app:${id}`;
    const raw = await redis.get(appKey);

    if (!raw) {
      console.warn(`[Process] No metadata found for ${id}`);
      return { id, status: "failed", error: "Metadata not found" };
    }

    const app: DeferredApplication = JSON.parse(raw as string);

    // Skip if already processed
    if (app.status === "processed") {
      console.log(`[Process] ${id} already processed, skipping`);
      return { id, status: "success" };
    }

    // Update status to processing
    app.status = "processing";
    app.attempts = (app.attempts || 0) + 1;
    await redis.set(appKey, JSON.stringify(app));

    console.log(
      `[Process] Processing ${id} (${app.email}, attempt ${app.attempts})`
    );

    // Fetch job detail (you'll need to implement this based on your backend)
    // For now, we'll create a minimal job detail object
    // In production, you should fetch this from your database or API
    const jobDetail = {
      id: app.jobApplicationFormId || app.jobCode,
      jobCode: app.jobCode,
      jobTitle: "Position", // You may need to fetch actual job details
      // Add other required fields from JobDetail DTO
    };

    // Call analyze-cv API (internal server-side call)
    const analyzePayload = {
      jobDetail,
      inlineData: {
        data: app.fileBase64,
        mimeType: app.fileMime,
      },
      language: "vi",
    };

    const analyzeUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/analyze-cv`;

    const analyzeResp = await fetch(analyzeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analyzePayload),
    });

    if (!analyzeResp.ok) {
      const errorText = await analyzeResp.text();
      throw new Error(
        `Analysis API failed: ${analyzeResp.status} ${errorText}`
      );
    }

    const analyzeJson = await analyzeResp.json();
    const analysisResult = analyzeJson.result;

    console.log(
      `[Process] Analysis completed for ${id}, match score: ${
        analysisResult?.matchScore ?? "N/A"
      }`
    );

    // Prepare FormData for final submission to backend
    // Convert base64 back to File/Blob
    const buffer = Buffer.from(app.fileBase64, "base64");
    const blob = new Blob([buffer], { type: app.fileMime });

    const formData = new FormData();
    formData.append("fileCV", blob, app.fileName);
    formData.append("fullName", app.fullName);
    formData.append("email", app.email);
    formData.append("phone", app.phone);
    if (app.birthday) formData.append("birthday", app.birthday);
    if (app.gender) formData.append("gender", app.gender);
    if (app.address) formData.append("address", app.address);
    if (app.experience) formData.append("experience", app.experience);
    if (app.jobApplicationFormId)
      formData.append("jobApplicationFormId", app.jobApplicationFormId);

    // Append skillIds if present
    if (app.skillIds && app.skillIds.length > 0) {
      app.skillIds.forEach((skillId) => formData.append("skillIds", skillId));
    }

    // Append analysis result
    const analysisPayload = {
      analysisResult,
      matchScore: analysisResult?.matchScore ?? null,
      recommendation: analysisResult?.recommendation ?? null,
    };
    formData.append("analysisResult", JSON.stringify(analysisPayload));

    // Submit to backend service
    // Note: ApplyServices.createRecruitmentMultipart expects a backend API
    // We need to call it server-side. Import and use directly:
    try {
      const ApplyServices = (await import("@/services/apply/apply.service"))
        .default;
      await ApplyServices.createRecruitmentMultipart(formData);
      console.log(
        `[Process] Successfully submitted application ${id} to backend`
      );
    } catch (submitError) {
      console.error(
        `[Process] Backend submission failed for ${id}:`,
        submitError
      );
      throw submitError;
    }

    // Update Redis with processed status and result
    app.status = "processed";
    app.result = {
      analysisResult,
      matchScore: analysisResult?.matchScore,
      processedAt: new Date().toISOString(),
    };
    delete app.lastError; // Clear any previous error
    await redis.set(appKey, JSON.stringify(app));

    console.log(`[Process] ✓ Successfully processed ${id}`);
    return { id, status: "success" };
  } catch (error) {
    console.error(`[Process] ✗ Error processing ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Update status to failed
    try {
      const appKey = `deferred:app:${id}`;
      const raw = await redis.get(appKey);
      if (raw) {
        const app: DeferredApplication = JSON.parse(raw as string);
        app.status = "failed";
        app.lastError = errorMessage;
        await redis.set(appKey, JSON.stringify(app));
      }
    } catch (updateError) {
      console.error(
        `[Process] Failed to update error status for ${id}:`,
        updateError
      );
    }

    return { id, status: "failed", error: errorMessage };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    if (!verifyAuth(req)) {
      console.warn("[Process] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Upstash is configured
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return NextResponse.json(
        { error: "Redis not configured" },
        { status: 501 }
      );
    }

    console.log("[Process] Starting deferred applications processing job");

    const results: ProcessResult[] = [];
    const startTime = Date.now();

    // Process queue items (limit to prevent timeout)
    const MAX_ITEMS_PER_RUN = 50;
    let processed = 0;

    while (processed < MAX_ITEMS_PER_RUN) {
      // Pop from queue (RPOP for FIFO behavior with LPUSH)
      const id = await redis.rpop("deferred:queue");

      if (!id) {
        console.log("[Process] Queue empty");
        break;
      }

      const result = await processOne(id as string);
      results.push(result);
      processed++;

      // Check if we're running out of time (leave 30s buffer for Vercel)
      const elapsed = Date.now() - startTime;
      if (elapsed > 240000) {
        // 4 minutes
        console.warn("[Process] Approaching timeout, stopping");
        break;
      }
    }

    const duration = Date.now() - startTime;
    const successCount = results.filter((r) => r.status === "success").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    console.log(
      `[Process] Completed: ${successCount} success, ${failedCount} failed in ${(
        duration / 1000
      ).toFixed(1)}s`
    );

    return NextResponse.json({
      success: true,
      processed: results.length,
      successCount,
      failedCount,
      duration,
      results: results.map((r) => ({ id: r.id, status: r.status })),
    });
  } catch (error) {
    console.error("[Process] Job error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Processing job failed", details: message },
      { status: 500 }
    );
  }
}

// GET method for manual trigger or status check
export async function GET(req: NextRequest) {
  try {
    // Verify authorization
    if (!verifyAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get queue length
    const queueLength = await redis.llen("deferred:queue");

    return NextResponse.json({
      queueLength,
      message: `${queueLength} applications pending in queue`,
    });
  } catch (error) {
    console.error("[Process] GET error:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}
