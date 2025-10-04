import JobApplicationClient from "./JobApplicationClient";
import redis from "@/lib/upstash";

type Props = { params: { jobId: string } };

// Server component: increments view count during SSR (if Upstash configured)
export default async function JobApplicationPageServer({ params }: Props) {
  const { jobId } = params;

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
