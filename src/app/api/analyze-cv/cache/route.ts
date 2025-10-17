import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

/**
 * GET /api/analyze-cv/cache
 * Returns cache statistics (requires admin authentication in production)
 */
export async function GET() {
  try {
    // In production, add authentication check here
    // const session = await getSession();
    // if (!session?.user?.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get all cache keys (this is a sample - in production you may want to track stats separately)
    const keys = await kv.keys("cv-analysis:*");

    return NextResponse.json({
      totalCachedAnalyses: keys.length,
      cachePrefix: "cv-analysis:",
      ttlDays: 7,
      message: "Use DELETE method to clear cache",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Cache not available: " + message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analyze-cv/cache?key=<cacheKey>
 * Clears a specific cache entry or all cache if no key provided
 */
export async function DELETE(req: Request) {
  try {
    // In production, add authentication check here
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (key) {
      // Delete specific cache entry
      const fullKey = key.startsWith("cv-analysis:")
        ? key
        : `cv-analysis:${key}`;
      const deleted = await kv.del(fullKey);
      return NextResponse.json({
        success: true,
        deleted: deleted > 0,
        key: fullKey,
      });
    } else {
      // Clear all cv-analysis cache
      const keys = await kv.keys("cv-analysis:*");
      let deletedCount = 0;

      // Delete in batches
      for (const k of keys) {
        await kv.del(k);
        deletedCount++;
      }

      return NextResponse.json({
        success: true,
        deletedCount,
        message: `Cleared ${deletedCount} cached analyses`,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to clear cache: " + message },
      { status: 500 }
    );
  }
}
