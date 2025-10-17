import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/upstash";
import { v4 as uuidv4 } from "uuid";

// Upstash Redis can handle payloads up to ~1MB per key safely.
// For files > 1MB, consider splitting or using object storage.
// We'll store base64 + metadata together as JSON.

// Max file size: 5MB (as per client validation)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

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
}

export async function POST(req: NextRequest) {
  try {
    // Check if Upstash is configured
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return NextResponse.json(
        { error: "Redis storage not configured" },
        { status: 501 }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();

    // Extract file
    const fileEntry = formData.get("fileCV");
    if (!fileEntry || !(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid fileCV" },
        { status: 400 }
      );
    }

    const file = fileEntry as File;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const validMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, DOCX allowed" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = buffer.toString("base64");

    // Extract form fields
    const getField = (name: string): string | undefined => {
      const value = formData.get(name);
      return value ? String(value) : undefined;
    };

    const getArrayField = (name: string): string[] => {
      const values = formData.getAll(name);
      return values.map((v) => String(v));
    };

    const fullName = getField("fullName");
    const email = getField("email");
    const phone = getField("phone");

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, phone" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const skillIds = getArrayField("skillIds");

    const deferredApp: DeferredApplication = {
      id,
      jobCode: getField("jobCode") || "",
      jobApplicationFormId: getField("jobApplicationFormId"),
      fullName,
      email,
      phone,
      birthday: getField("birthday"),
      gender: getField("gender"),
      address: getField("address"),
      experience: getField("experience"),
      skillIds: skillIds.length > 0 ? skillIds : undefined,
      fileBase64,
      fileName: file.name,
      fileMime: file.type,
      fileSize: file.size,
      status: "pending",
      createdAt: now,
      attempts: 0,
    };

    // Store in Redis
    // Key: deferred:app:{id}
    const appKey = `deferred:app:${id}`;
    await redis.set(appKey, JSON.stringify(deferredApp));

    // Add to processing queue
    await redis.lpush("deferred:queue", id);

    console.log(
      `[Deferred Apply] Saved application ${id} for ${email} (${file.name}, ${(
        file.size / 1024
      ).toFixed(1)}KB)`
    );

    return NextResponse.json(
      {
        success: true,
        id,
        message:
          "Hồ sơ của bạn đã được lưu. Chúng tôi sẽ xem xét và liên hệ với bạn sớm.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Deferred Apply] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to save application", details: message },
      { status: 500 }
    );
  }
}
