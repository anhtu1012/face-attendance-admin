import { NextResponse } from "next/server";
import { analyzeCv, InlineDataPart } from "@/services/gemini/geminiService";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { kv } from "@vercel/kv";
import crypto from "crypto";
import type { CvPromptSettings } from "@/types/CvPromptSettings";

// Cache configuration
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const CACHE_PREFIX = "cv-analysis:";

/**
 * Generate a cache key based on job ID and CV content hash
 * Uses SHA256 to create a deterministic key for the same job+CV combination
 */
function generateCacheKey(
  jobDetail: JobDetail,
  cvContent: string | { data: string; mimeType: string }
): string {
  const jobId = jobDetail.id || jobDetail.jobCode || "unknown";

  // For text CV, use first 1000 chars for hashing (balance between uniqueness and performance)
  // For inline data (image), use the base64 data
  const contentToHash =
    typeof cvContent === "string"
      ? cvContent.substring(0, 1000)
      : cvContent.data.substring(0, 1000);

  const hash = crypto
    .createHash("sha256")
    .update(`${jobId}:${contentToHash}`)
    .digest("hex");

  return `${CACHE_PREFIX}${hash}`;
}

// POST /api/analyze-cv
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;

    const parsed = body as {
      jobDetail?: unknown;
      cvText?: string;
      inlineData?: { data: string; mimeType: string };
      language?: "en" | "vi";
      useCustomSettings?: boolean;
      customSettings?: CvPromptSettings;
    };

    const {
      jobDetail,
      cvText,
      inlineData,
      language = "vi",
      useCustomSettings = true,
      customSettings: receivedSettings,
    } = parsed;

    if (!jobDetail) {
      return NextResponse.json({ error: "Missing jobDetail" }, { status: 400 });
    }

    if (!cvText && !inlineData) {
      return NextResponse.json(
        { error: "Missing cvText or inlineData" },
        { status: 400 }
      );
    }

    const cvContent: string | InlineDataPart = cvText
      ? cvText
      : { inlineData: inlineData as { data: string; mimeType: string } };

    const jobDetailTyped = jobDetail as JobDetail;

    // Use custom prompt settings from payload if provided
    let customSettings: CvPromptSettings | undefined = undefined;
    if (useCustomSettings && receivedSettings) {
      customSettings = receivedSettings;
      console.log(
        "[Analysis] Using custom prompt settings from client payload"
      );
      console.log(
        "[Analysis] Settings ID:",
        receivedSettings.id,
        "Name:",
        receivedSettings.name
      );
    } else if (useCustomSettings) {
      console.warn(
        "[Analysis] useCustomSettings=true but no settings provided in payload"
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(
      jobDetailTyped,
      cvText || (inlineData as { data: string; mimeType: string })
    );

    // Try to get cached result (with graceful fallback if KV is not configured)
    let cachedResult = null;
    let cacheError = false;
    try {
      cachedResult = await kv.get(cacheKey);
      if (cachedResult) {
        console.log(`[Cache HIT] Key: ${cacheKey.substring(0, 30)}...`);
        return NextResponse.json({
          result: cachedResult,
          cached: true,
          cacheKey: cacheKey.substring(0, 16), // Return partial key for debugging
        });
      }
      console.log(`[Cache MISS] Key: ${cacheKey.substring(0, 30)}...`);
    } catch (kvError) {
      // KV not configured or error - log and continue without caching
      console.warn(
        "[Cache] Vercel KV not available or error:",
        kvError instanceof Error ? kvError.message : String(kvError)
      );
      cacheError = true;
    }

    // Call Gemini API with optional custom settings
    const startTime = Date.now();
    const result = await analyzeCv(
      jobDetailTyped,
      cvContent,
      language,
      customSettings
    );
    const duration = Date.now() - startTime;

    console.log(
      `[Analysis] Completed in ${duration}ms ${
        customSettings ? "(with custom settings)" : "(default)"
      }`
    );

    // Store result in cache (if KV is available)
    if (!cacheError) {
      try {
        await kv.set(cacheKey, result, { ex: CACHE_TTL_SECONDS });
        console.log(
          `[Cache] Stored result with TTL ${CACHE_TTL_SECONDS}s (${Math.floor(
            CACHE_TTL_SECONDS / 86400
          )} days)`
        );
      } catch (kvError) {
        console.warn(
          "[Cache] Failed to store result:",
          kvError instanceof Error ? kvError.message : String(kvError)
        );
      }
    }

    return NextResponse.json({
      result,
      cached: false,
      duration,
      cacheKey: cacheKey.substring(0, 16),
    });
  } catch (err) {
    console.error("Error in /api/analyze-cv:", err);
    const message = err instanceof Error ? err.message : String(err);

    // Check for quota exhaustion
    if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
      return NextResponse.json(
        {
          error: "API quota exceeded",
          errorType: "QUOTA_EXCEEDED",
          message: "Hệ thống AI đã đạt giới hạn sử dụng. Vui lòng thử lại sau.",
        },
        { status: 429 }
      );
    }

    // Check for rate limiting
    if (
      message.includes("rate limit") ||
      message.includes("Too many requests")
    ) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          errorType: "RATE_LIMIT",
          message: "Hệ thống AI đang quá tải, vui lòng thử lại sau vài phút.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: message || "Unknown error" },
      { status: 500 }
    );
  }
}
