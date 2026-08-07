import { NextResponse } from "next/server";

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Test helper — clears in-memory windows. */
export function resetRateLimitForTests(): void {
  buckets.clear();
}

function resolveMax(): number {
  const raw = process.env.CCS_RATE_LIMIT_MAX;
  if (raw != null && raw !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return Math.floor(n);
  }
  return 60;
}

function resolveWindowMs(): number {
  const raw = process.env.CCS_RATE_LIMIT_WINDOW_MS;
  if (raw != null && raw !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return Math.floor(n);
  }
  return 60_000;
}

/**
 * In-memory fixed window limiter (D-11, PLT-05).
 * Soft-sim only — not a distributed edge control plane.
 */
export function checkRateLimit(
  key: string,
  now = Date.now(),
): RateLimitResult {
  const limit = resolveMax();
  const windowMs = resolveWindowMs();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      retryAfterSec: Math.ceil(windowMs / 1000),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSec,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSec: Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    ),
    resetAt: existing.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }
  return headers;
}

export function rateLimitDeniedResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "rate_limited",
      message: `Rate limit exceeded — soft-sim desk. Retry after ${result.retryAfterSec}s.`,
      softSim: true,
    },
    { status: 429, headers: rateLimitHeaders(result) },
  );
}
