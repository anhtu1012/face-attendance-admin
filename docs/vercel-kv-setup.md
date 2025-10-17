# Vercel KV Setup Guide for CV Analysis Caching

## Overview
This guide walks you through setting up Vercel KV (Redis-compatible key-value storage) to enable caching for CV analysis, significantly improving response times and reducing Gemini API costs.

## Benefits
- ⚡ **60-80% faster** responses for duplicate CV analyses
- 💰 **50-70% cost savings** on Gemini API calls
- 🚀 **Instant responses** (<100ms) for cached results vs 3-10s for fresh analysis
- 📊 **Better UX** with near-instant feedback for common scenarios

## Prerequisites
- Vercel account with a deployed project
- Node.js project with `@vercel/kv` installed (already done ✅)

## Setup Steps

### 1. Create Vercel KV Database

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **face-attendance-admin**
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Choose:
   - **Database Name**: `face-attendance-kv` (or any name)
   - **Region**: Same as your primary deployment region (e.g., `iad1` for US East)
   - **Plan**: Start with **Hobby (Free)** - includes:
     - 256 MB storage
     - 3,000 commands/day
     - Good for ~1,000-2,000 cached analyses
7. Click **Create**
8. **Connect to Project**: Select `face-attendance-admin`
9. Done! Environment variables are automatically added

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Create KV store
vercel storage create kv face-attendance-kv --region iad1

# Link to project
vercel link
vercel env pull .env.local
```

### 2. Verify Environment Variables

After creating the KV database, these variables should be automatically added to your project:

```bash
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

**Local Development:**
Pull environment variables to your local `.env.local`:
```bash
vercel env pull .env.local
```

Or manually add to `.env.local` (get values from Vercel Dashboard → Settings → Environment Variables):
```env
KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your_token_here
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token_here
```

### 3. Test Locally

Start your dev server:
```bash
npm run dev
```

Test the analyze endpoint:
```bash
# First call (MISS - will call Gemini API)
curl -X POST http://localhost:3000/api/analyze-cv \
  -H "Content-Type: application/json" \
  -d '{
    "jobDetail": {
      "id": "test-job-1",
      "jobTitle": "Senior Developer",
      "requireSkill": ["React", "TypeScript"]
    },
    "cvText": "Experienced developer with 5 years in React and TypeScript...",
    "language": "vi"
  }'

# Response (first time):
# {
#   "result": { ... full analysis ... },
#   "cached": false,
#   "duration": 4523,
#   "cacheKey": "a1b2c3d4..."
# }

# Second call with SAME data (HIT - instant response)
curl -X POST http://localhost:3000/api/analyze-cv \
  -H "Content-Type: application/json" \
  -d '{
    "jobDetail": {
      "id": "test-job-1",
      "jobTitle": "Senior Developer",
      "requireSkill": ["React", "TypeScript"]
    },
    "cvText": "Experienced developer with 5 years in React and TypeScript...",
    "language": "vi"
  }'

# Response (cached):
# {
#   "result": { ... full analysis ... },
#   "cached": true,
#   "cacheKey": "a1b2c3d4..."
# }
```

Check server logs for cache status:
```
[Cache MISS] Key: cv-analysis:a1b2c3d4...
[Analysis] Completed in 4523ms
[Cache] Stored result with TTL 604800s (7 days)

[Cache HIT] Key: cv-analysis:a1b2c3d4...
```

### 4. Manage Cache (Admin)

#### View Cache Stats
```bash
curl http://localhost:3000/api/analyze-cv/cache
```

Response:
```json
{
  "totalCachedAnalyses": 42,
  "cachePrefix": "cv-analysis:",
  "ttlDays": 7,
  "message": "Use DELETE method to clear cache"
}
```

#### Clear Specific Cache Entry
```bash
curl -X DELETE "http://localhost:3000/api/analyze-cv/cache?key=a1b2c3d4..."
```

#### Clear All Cache
```bash
curl -X DELETE http://localhost:3000/api/analyze-cv/cache
```

### 5. Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: add Vercel KV caching for CV analysis"
git push origin develop

# Deploy (if auto-deploy is disabled)
vercel --prod
```

Environment variables are automatically available in production (no extra config needed).

### 6. Monitor Performance

#### In Vercel Dashboard:
1. Go to **Storage** → Your KV database
2. View **Metrics**:
   - Commands per day
   - Storage usage
   - Response times

#### In Application Logs:
- Search for `[Cache HIT]` and `[Cache MISS]` to track cache effectiveness
- Monitor `duration` in API responses to see performance improvements

#### Expected Metrics (after deployment):
- **Cache hit rate**: 60-80% (depends on how often same CVs are analyzed)
- **Average response time**:
  - Cached: <200ms
  - Uncached: 3-10s (Gemini API call)
- **Cost savings**: 50-70% reduction in Gemini API calls

## Cache Behavior

### Cache Key Generation
- Based on: Job ID + CV content hash (first 1000 chars)
- Same job + same CV = same cache key = instant response
- Different job OR different CV = new analysis

### Cache TTL (Time to Live)
- **Default**: 7 days (604,800 seconds)
- Why 7 days?
  - Job requirements rarely change within a week
  - Most recruitment cycles are <1 month
  - Balance between freshness and cost savings

### Cache Invalidation
- **Automatic**: Entries expire after TTL
- **Manual**: Use DELETE `/api/analyze-cv/cache` endpoint
- **Recommended**: Clear cache when job requirements change significantly

## Fallback Behavior

The caching implementation is **graceful** - if Vercel KV is not configured or unavailable:
- ✅ API still works normally
- ✅ Calls Gemini API directly
- ⚠️ No caching (slower responses, higher costs)
- 📝 Logs warning: `[Cache] Vercel KV not available or error`

## Cost Analysis

### Without Caching
- 1,000 CV analyses/month
- 100% Gemini API calls
- Cost: ~$0.50-1.00 (Gemini API)
- **Total**: ~$0.50-1.00/month

### With Caching (70% hit rate)
- 1,000 CV analyses/month
- 300 Gemini API calls (30% miss)
- 700 cache hits (70% hit)
- Cost: ~$0.15-0.30 (Gemini) + $0 (Vercel KV Free tier)
- **Total**: ~$0.15-0.30/month
- **Savings**: 60-70%

### Vercel KV Pricing
- **Hobby (Free)**: 256 MB, 3K commands/day - Good for small-medium traffic
- **Pro**: $10/month - 1 GB, 10K commands/day
- **Enterprise**: Custom pricing

## Troubleshooting

### Issue: Cache not working, always returns `cached: false`
**Solution:**
- Check environment variables: `echo $KV_REST_API_URL`
- Verify KV database is linked to project in Vercel Dashboard
- Pull latest env vars: `vercel env pull .env.local`
- Restart dev server

### Issue: Error "KV_REST_API_URL not found"
**Solution:**
- Ensure Vercel KV database is created and linked
- Pull environment variables locally
- In production, redeploy after linking KV

### Issue: High cache miss rate
**Possible causes:**
- Users uploading different CVs each time (expected)
- Cache TTL too short (increase if needed)
- Cache keys not matching due to CV content variations

**Solution:**
- Monitor logs to understand miss patterns
- Consider adjusting cache key generation if needed

### Issue: Want to cache for longer/shorter period
**Solution:**
Edit `CACHE_TTL_SECONDS` in `/api/analyze-cv/route.ts`:
```typescript
const CACHE_TTL_SECONDS = 14 * 24 * 60 * 60; // 14 days
```

## Security Considerations

1. **Cache Management Endpoint**: Currently open. In production, add authentication:
   ```typescript
   // In /api/analyze-cv/cache/route.ts
   const session = await getSession();
   if (!session?.user?.isAdmin) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

2. **Sensitive Data**: CV content is cached. Ensure compliance with data privacy regulations (GDPR, etc.)
   - Consider shorter TTL for sensitive roles
   - Add cache encryption if needed
   - Implement user-requested cache deletion

3. **Rate Limiting**: Cache doesn't prevent abuse. Add rate limiting separately.

## Next Steps

1. ✅ **Setup complete** - Caching is now active
2. 📊 **Monitor metrics** - Track cache hit rate and performance
3. 🎨 **Update UI** - Show cache status to users (optional)
4. 🔒 **Add auth** - Secure cache management endpoints
5. 📈 **Scale** - Upgrade Vercel KV plan if needed

## Support

- Vercel KV Docs: https://vercel.com/docs/storage/vercel-kv
- Upstash (underlying tech): https://upstash.com/docs/redis
- Issues: Check server logs and Vercel dashboard metrics
