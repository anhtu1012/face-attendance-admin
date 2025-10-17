import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/upstash";

export const runtime = "nodejs";

interface DeferredApplication {
  id: string;
  jobCode: string;
  fullName: string;
  email: string;
  phone: string;
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

interface StatusResponse {
  id: string;
  status: string;
  message: string;
  createdAt: string;
  processedAt?: string;
  matchScore?: number;
  error?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
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

    const appKey = `deferred:app:${id}`;
    const raw = await redis.get(appKey);

    if (!raw) {
      return NextResponse.json(
        { error: "Application not found", id },
        { status: 404 }
      );
    }

    const app: DeferredApplication = JSON.parse(raw as string);

    // Prepare response with limited info for privacy
    const response: StatusResponse = {
      id: app.id,
      status: app.status,
      createdAt: app.createdAt,
      message: getStatusMessage(app.status),
    };

    // Add additional info based on status
    if (app.status === "processed" && app.result) {
      response.processedAt = app.result.processedAt;
      response.matchScore = app.result.matchScore;
    }

    if (app.status === "failed" && app.lastError) {
      response.error = app.lastError;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[Deferred Status] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to get status", details: message },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "Hồ sơ của bạn đang chờ xử lý. Chúng tôi sẽ xem xét sớm nhất có thể.";
    case "processing":
      return "Hồ sơ của bạn đang được xử lý. Vui lòng chờ trong giây lát.";
    case "processed":
      return "Hồ sơ của bạn đã được xử lý. Chúng tôi sẽ liên hệ với bạn sớm.";
    case "failed":
      return "Có lỗi xảy ra khi xử lý hồ sơ của bạn. Vui lòng liên hệ với chúng tôi để được hỗ trợ.";
    default:
      return "Trạng thái không xác định.";
  }
}
