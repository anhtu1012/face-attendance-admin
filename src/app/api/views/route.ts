import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import redis from "@/lib/upstash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body || {};
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    // Use a namespaced key per job
    const key = `job:views:${jobId}`;

    // TTL for per-IP dedupe (seconds). 24 hours.
    const IP_TTL_SECONDS = 24 * 60 * 60;

    // Determine client IP from common headers. If not present, ip will be null.
    const xff =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const ip = xff ? xff.split(",")[0].trim() : null;

    // If redis client isn't configured, return a 501 with a message
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return NextResponse.json(
        { error: "Upstash not configured", views: null },
        { status: 501 }
      );
    }

    // Increment and return new value
    // If we have an IP, use a per-IP key with NX+EX to ensure one increment per IP within TTL.
    if (ip) {
      const ipKey = `job:views:${jobId}:ip:${ip}`;
      // Attempt to set the ipKey only if it does not exist.
      // If set returns a truthy value, it was created and we should increment the main counter.
      const setResult = await redis.set(ipKey, "1", {
        ex: IP_TTL_SECONDS,
        nx: true,
      });
      if (setResult) {
        const newCount = await redis.incr(key);
        return NextResponse.json({ jobId, views: Number(newCount) });
      }

      // IP already seen within TTL: return current count without incrementing.
      const current = await redis.get(key);
      return NextResponse.json({ jobId, views: Number(current ?? 0) });
    }

    // No IP available: try to dedupe using a cookie named job_viewed_{jobId}.
    // If cookie present, return current count; otherwise increment and set a Set-Cookie header.
    const cookieName = `job_viewed_${jobId}`;
    const hasCookie = req.cookies.get(cookieName)?.value;
    if (hasCookie) {
      const current = await redis.get(key);
      return NextResponse.json({ jobId, views: Number(current ?? 0) });
    }

    const newCount = await redis.incr(key);
    const res = NextResponse.json({ jobId, views: Number(newCount) });
    // Set a 24h cookie so subsequent requests from same browser won't increment.
    res.headers.set(
      "Set-Cookie",
      `${cookieName}=1; Path=/; Max-Age=${24 * 60 * 60}; HttpOnly`
    );
    return res;
  } catch (err) {
    console.error("Error in views API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
