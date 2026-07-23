/**
 * Two-tier cache-aware prompt compression cost model (paper-inspired).
 * Compares vanilla / cache-only / query-aware baselines against
 * query-agnostic compression with a tier-preserving ratio bound.
 * Lab method experiment — never brand CAPC, Sonnet, or PayPal as the product.
 */

export type CacheInput = {
  /** Original cached prefix size in tokens. */
  prefix_tokens?: number;
  /** Requested compression ratio (≥1). */
  ratio?: number;
  /** Session call count N. */
  queries?: number;
  /** Uncached / write token price (default 1). */
  c_write?: number;
  /** Cached read token price (default 0.1). */
  c_read?: number;
  /** Two-tier size threshold (default 3500). */
  tier_threshold?: number;
  /** Hit-rate plateau below the tier threshold (default 0.83). */
  rho_hot?: number;
  /** Claim ideal ρ=1.0 everywhere — must reject. */
  ideal_rho_cheat?: boolean;
};

export type StrategyLabel =
  | "vanilla_full_prompt"
  | "cache_only"
  | "query_aware_breaks_cache"
  | "cache_aware_tier_preserving";

export type StrategyCost = {
  label: StrategyLabel;
  prefix_sent: number;
  ratio_used: number;
  rho: number;
  tier: "hot" | "persistent";
  cost: number;
  risk_score: number;
  action: string;
  cache_stable: boolean;
};

export type CacheOk = {
  status: "ok";
  prefix_tokens: number;
  ratio: number;
  queries: number;
  tier_threshold: number;
  c_write: number;
  c_read: number;
  rho_hot: number;
  r_max: number;
  vanilla: StrategyCost;
  cache_only: StrategyCost;
  query_aware: StrategyCost;
  /** Alias used by desk harness / goldens (query-aware naive). */
  naive: StrategyCost;
  /** Cache-aware path (tier-preserving). */
  pla: StrategyCost;
  cache_aware: StrategyCost;
  /** Positive means cache-aware cheaper than query-aware naive. */
  delta_score: number;
  /** Positive means cache-aware cheaper than cheapest of three baselines. */
  vs_best_naive: number;
};

export type CacheReject = {
  status: "reject";
  reason: string;
};

export type CacheResult = CacheOk | CacheReject;

const DEFAULT_PREFIX = 12000;
const DEFAULT_RATIO = 3;
const DEFAULT_QUERIES = 10;
const DEFAULT_C_WRITE = 1;
const DEFAULT_C_READ = 0.1;
const DEFAULT_TIER = 3500;
const DEFAULT_RHO_HOT = 0.83;

const PREFIX_MIN = 500;
const PREFIX_MAX = 200000;
const RATIO_MIN = 1;
const RATIO_MAX = 20;
const QUERIES_MIN = 1;
const QUERIES_MAX = 100;

export function hitRate(
  prefixSent: number,
  tierThreshold: number,
  rhoHot: number,
): number {
  if (prefixSent >= tierThreshold) return 1;
  return rhoHot;
}

export function tierOf(
  prefixSent: number,
  tierThreshold: number,
): "hot" | "persistent" {
  return prefixSent >= tierThreshold ? "persistent" : "hot";
}

/** Tier-preserving max ratio: floor(P / threshold), at least 1. */
export function tierPreservingMaxRatio(
  prefixTokens: number,
  tierThreshold: number,
): number {
  const raw = Math.floor(prefixTokens / tierThreshold);
  return Math.max(1, raw);
}

export function compressedSize(prefixTokens: number, ratio: number): number {
  const r = Math.max(1, ratio);
  return Math.max(1, Math.ceil(prefixTokens / r));
}

/**
 * Session cost under two-tier hit rate:
 * N * [(1-ρ)·size·c_w + ρ·size·c_r]
 */
export function sessionCost(
  queries: number,
  prefixSent: number,
  rho: number,
  cWrite: number,
  cRead: number,
): number {
  const per =
    (1 - rho) * prefixSent * cWrite + rho * prefixSent * cRead;
  return Number((queries * per).toFixed(4));
}

function riskFromCost(cost: number): number {
  return Math.round(cost * 100) / 100;
}

function strategy(
  label: StrategyLabel,
  prefixSent: number,
  ratioUsed: number,
  queries: number,
  tierThreshold: number,
  rhoHot: number,
  cWrite: number,
  cRead: number,
  action: string,
  cacheStable: boolean,
): StrategyCost {
  const rho = hitRate(prefixSent, tierThreshold, rhoHot);
  const cost = sessionCost(queries, prefixSent, rho, cWrite, cRead);
  return {
    label,
    prefix_sent: prefixSent,
    ratio_used: ratioUsed,
    rho,
    tier: tierOf(prefixSent, tierThreshold),
    cost,
    risk_score: riskFromCost(cost),
    action,
    cache_stable: cacheStable,
  };
}

function resolveInputs(input: CacheInput): {
  prefix_tokens: number;
  ratio: number;
  queries: number;
  c_write: number;
  c_read: number;
  tier_threshold: number;
  rho_hot: number;
} {
  const rawP = Number(input.prefix_tokens ?? DEFAULT_PREFIX);
  const prefix_tokens = !Number.isFinite(rawP)
    ? DEFAULT_PREFIX
    : Math.max(PREFIX_MIN, Math.min(PREFIX_MAX, Math.floor(rawP)));

  const rawR = Number(input.ratio ?? DEFAULT_RATIO);
  const ratio = !Number.isFinite(rawR)
    ? DEFAULT_RATIO
    : Math.max(RATIO_MIN, Math.min(RATIO_MAX, Math.floor(rawR)));

  const rawN = Number(input.queries ?? DEFAULT_QUERIES);
  const queries = !Number.isFinite(rawN)
    ? DEFAULT_QUERIES
    : Math.max(QUERIES_MIN, Math.min(QUERIES_MAX, Math.floor(rawN)));

  const rawW = Number(input.c_write ?? DEFAULT_C_WRITE);
  const c_write = !Number.isFinite(rawW)
    ? DEFAULT_C_WRITE
    : Math.max(0.01, Math.min(100, Number(rawW.toFixed(4))));

  const rawC = Number(input.c_read ?? DEFAULT_C_READ);
  const c_read = !Number.isFinite(rawC)
    ? DEFAULT_C_READ
    : Math.max(0.001, Math.min(c_write, Number(rawC.toFixed(4))));

  const rawT = Number(input.tier_threshold ?? DEFAULT_TIER);
  const tier_threshold = !Number.isFinite(rawT)
    ? DEFAULT_TIER
    : Math.max(100, Math.min(50000, Math.floor(rawT)));

  const rawRho = Number(input.rho_hot ?? DEFAULT_RHO_HOT);
  const rho_hot = !Number.isFinite(rawRho)
    ? DEFAULT_RHO_HOT
    : Math.max(0.01, Math.min(0.99, Number(rawRho.toFixed(4))));

  return {
    prefix_tokens,
    ratio,
    queries,
    c_write,
    c_read,
    tier_threshold,
    rho_hot,
  };
}

export function scorePromptCache(input: CacheInput): CacheResult {
  if (input.ideal_rho_cheat === true) {
    return { status: "reject", reason: "ideal_rho_cheat" };
  }

  const {
    prefix_tokens,
    ratio,
    queries,
    c_write,
    c_read,
    tier_threshold,
    rho_hot,
  } = resolveInputs(input);

  const r_max = tierPreservingMaxRatio(prefix_tokens, tier_threshold);

  // Vanilla: full prompt every call — no cache benefit (ρ=0).
  const vanilla: StrategyCost = {
    label: "vanilla_full_prompt",
    prefix_sent: prefix_tokens,
    ratio_used: 1,
    rho: 0,
    tier: tierOf(prefix_tokens, tier_threshold),
    cost: Number((queries * prefix_tokens * c_write).toFixed(4)),
    risk_score: riskFromCost(queries * prefix_tokens * c_write),
    action: "send_full_every_call",
    cache_stable: false,
  };

  // Cache-only: cache full prefix, no compression.
  const cache_only = strategy(
    "cache_only",
    prefix_tokens,
    1,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    "cache_full_prefix",
    true,
  );

  // Query-aware: compress per query → every call is a miss (ρ=0 on compressed size).
  const qaSize = compressedSize(prefix_tokens, ratio);
  const query_aware: StrategyCost = {
    label: "query_aware_breaks_cache",
    prefix_sent: qaSize,
    ratio_used: ratio,
    rho: 0,
    tier: tierOf(qaSize, tier_threshold),
    cost: Number((queries * qaSize * c_write).toFixed(4)),
    risk_score: riskFromCost(queries * qaSize * c_write),
    action: "compress_per_query",
    cache_stable: false,
  };

  // Cache-aware: query-agnostic compression clamped by tier-preserving bound.
  const ratio_used = Math.min(ratio, r_max);
  const caSize = compressedSize(prefix_tokens, ratio_used);
  const cache_aware = strategy(
    "cache_aware_tier_preserving",
    caSize,
    ratio_used,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    ratio_used < ratio ? "clamp_ratio_preserve_tier" : "compress_once_and_cache",
    true,
  );

  const bestNaive = Math.min(
    vanilla.risk_score,
    cache_only.risk_score,
    query_aware.risk_score,
  );

  return {
    status: "ok",
    prefix_tokens,
    ratio,
    queries,
    tier_threshold,
    c_write,
    c_read,
    rho_hot,
    r_max,
    vanilla,
    cache_only,
    query_aware,
    naive: query_aware,
    pla: cache_aware,
    cache_aware,
    delta_score: Number(
      (query_aware.risk_score - cache_aware.risk_score).toFixed(4),
    ),
    vs_best_naive: Number((bestNaive - cache_aware.risk_score).toFixed(4)),
  };
}
