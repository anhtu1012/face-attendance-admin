import { Redis } from "@upstash/redis";

// Upstash Redis client for server-side usage only.
// Make sure to set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env.
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Log a warning during development; the route will still handle missing config.
  // Avoid throwing so builds in environments without Redis configured don't fail unexpectedly.
  // You can remove this warning in production where env vars are provided.
  console.warn(
    "Upstash env vars are not set: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN"
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export default redis;
