/**
 * Lightweight rate limiter.
 *
 * When Upstash Redis credentials are configured it uses a sliding-window counter
 * stored in Redis. When they are not, it falls back to an in-memory Map that is
 * good enough for a single-instance deploy behind Docker.
 *
 * Usage:
 *   const limiter = rateLimit({ prefix: "signup", limit: 5, windowSeconds: 60 });
 *   const { ok } = await limiter.check(ip);
 *   if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

interface RateLimitOptions {
  /** Key prefix, e.g. "signup" or "forgot-password". */
  prefix: string;
  /** Maximum requests allowed inside the window. */
  limit: number;
  /** Window size in seconds. */
  windowSeconds: number;
}

interface RateLimitResult {
  ok: boolean;
  remaining: number;
}

// ---------------------------------------------------------------------------
// In-memory fallback (single-process, resets on restart — fine for Docker)
// ---------------------------------------------------------------------------
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryCheck(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return { ok: entry.count <= limit, remaining };
}

// Prevent the in-memory store from growing without bound.
// Runs at most once per minute.
let lastPurge = Date.now();
function purgeExpired() {
  const now = Date.now();
  if (now - lastPurge < 60_000) return;
  lastPurge = now;
  for (const [key, entry] of memoryStore) {
    if (now >= entry.resetAt) memoryStore.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Upstash Redis (when configured)
// ---------------------------------------------------------------------------
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const upstashConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

async function upstashIncr(key: string, windowSeconds: number): Promise<number> {
  // INCR + EXPIRE via Upstash REST API pipeline
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSeconds.toString()],
    ]),
  });

  if (!res.ok) {
    console.error("Upstash rate-limit pipeline failed:", res.status);
    // Fail open: allow the request so a Redis outage doesn't block everyone.
    return 0;
  }

  const data = (await res.json()) as Array<{ result: number }>;
  return data[0]?.result ?? 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function rateLimit(options: RateLimitOptions) {
  const { prefix, limit, windowSeconds } = options;
  const windowMs = windowSeconds * 1000;

  return {
    async check(identifier: string): Promise<RateLimitResult> {
      const key = `rl:${prefix}:${identifier}`;

      if (upstashConfigured) {
        const count = await upstashIncr(key, windowSeconds);
        if (count === 0) return { ok: true, remaining: limit }; // fail-open
        const remaining = Math.max(0, limit - count);
        return { ok: count <= limit, remaining };
      }

      purgeExpired();
      return memoryCheck(key, limit, windowMs);
    },
  };
}
