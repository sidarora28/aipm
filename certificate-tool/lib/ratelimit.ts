/**
 * Best-effort per-IP rate limit.
 *
 * This is an in-process counter. On Vercel every lambda instance keeps its own
 * copy and cold starts reset it, so the real ceiling is roughly
 * RATE_LIMIT_MAX × (number of warm instances). It raises the cost of walking
 * the roster one email at a time; it does not make it impossible. Making this
 * exact needs shared state (Vercel KV / Upstash), which the brief rules out.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function config() {
  return {
    max: Number(process.env.RATE_LIMIT_MAX ?? 5),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 60) * 1000,
  };
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip')?.trim() || 'unknown';
}

export function rateLimit(ip: string): { ok: boolean; retryAfterSeconds: number } {
  const { max, windowMs } = config();
  const now = Date.now();

  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > 10_000) {
    for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  }

  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSeconds: 0 };
}
