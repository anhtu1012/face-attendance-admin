/* eslint-disable @typescript-eslint/no-explicit-any */
import JobApplicationClient from "./JobApplicationClient";
import redis from "@/lib/upstash";

// Server component: increments view count during SSR (if Upstash configured)
// Accept an untyped props and await `params` to handle cases where Next types
// `params` as a Promise (generated PageProps may expect a Promise). This
// avoids a type mismatch with the generated .next type-checking.
export default async function JobApplicationPageServer({
  params,
}: {
  params?: Promise<{ jobId: string }> | undefined;
}) {
  // Next's PageProps may type `params` as a Promise; await it when present.
  const resolvedParams = params ? await params : undefined;
  const { jobId } = resolvedParams ?? {};

  let initialViews: number | undefined = undefined;
  let initialViewed = false;

  try {
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      const key = `job:views:${jobId}`;
      // Read-only: fetch current views but do NOT increment on SSR. The client will
      // call `/api/views` which handles IP-based dedupe and performs the increment.
      const current = await redis.get(key);
      initialViews = Number(current ?? 0);
      initialViewed = false; // let client decide whether to POST
    }
  } catch (err) {
    // server-side errors should not break page render
    console.error("Upstash increment error:", err);
  }

  return (
    <JobApplicationClient
      initialViews={initialViews}
      initialViewed={initialViewed}
    />
  );
}
