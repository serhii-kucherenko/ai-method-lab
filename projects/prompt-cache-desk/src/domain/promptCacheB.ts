/**
 * Dual-impl twin of promptCache.ts — must agree on all golden fixtures.
 * Alternate formulation: apply ratio clamp first, then accumulate per-call
 * write/read costs in a loop instead of the closed-form session formula.
 */
import {
  compressedSize,
  hitRate,
  tierOf,
  tierPreservingMaxRatio,
  type CacheInput,
  type CacheResult,
  type StrategyCost,
  type StrategyLabel,
} from "./promptCache.js";

const DEFAULT_PREFIX = 12000;
const DEFAULT_RATIO = 3;
const DEFAULT_QUERIES = 10;
const DEFAULT_C_WRITE = 1;
const DEFAULT_C_READ = 0.1;
const DEFAULT_TIER = 3500;
const DEFAULT_RHO_HOT = 0.83;

function resolve(input: CacheInput): {
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
    : Math.max(500, Math.min(200000, Math.floor(rawP)));
  const rawR = Number(input.ratio ?? DEFAULT_RATIO);
  const ratio = !Number.isFinite(rawR)
    ? DEFAULT_RATIO
    : Math.max(1, Math.min(20, Math.floor(rawR)));
  const rawN = Number(input.queries ?? DEFAULT_QUERIES);
  const queries = !Number.isFinite(rawN)
    ? DEFAULT_QUERIES
    : Math.max(1, Math.min(100, Math.floor(rawN)));
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

/** Expected cost over N i.i.d. calls with hit probability rho. */
function loopCost(
  queries: number,
  size: number,
  rho: number,
  cWrite: number,
  cRead: number,
): number {
  let total = 0;
  for (let i = 0; i < queries; i++) {
    total += (1 - rho) * size * cWrite + rho * size * cRead;
  }
  return Number(total.toFixed(4));
}

function mk(
  label: StrategyLabel,
  size: number,
  ratioUsed: number,
  queries: number,
  tierThreshold: number,
  rhoHot: number,
  cWrite: number,
  cRead: number,
  action: string,
  cacheStable: boolean,
  forceRho?: number,
): StrategyCost {
  const rho =
    forceRho !== undefined
      ? forceRho
      : hitRate(size, tierThreshold, rhoHot);
  const cost = loopCost(queries, size, rho, cWrite, cRead);
  return {
    label,
    prefix_sent: size,
    ratio_used: ratioUsed,
    rho,
    tier: tierOf(size, tierThreshold),
    cost,
    risk_score: Math.round(cost * 100) / 100,
    action,
    cache_stable: cacheStable,
  };
}

export function scorePromptCacheB(input: CacheInput): CacheResult {
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
  } = resolve(input);

  const r_max = tierPreservingMaxRatio(prefix_tokens, tier_threshold);

  const vanilla = mk(
    "vanilla_full_prompt",
    prefix_tokens,
    1,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    "send_full_every_call",
    false,
    0,
  );

  const cache_only = mk(
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

  const qaSize = compressedSize(prefix_tokens, ratio);
  const query_aware = mk(
    "query_aware_breaks_cache",
    qaSize,
    ratio,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    "compress_per_query",
    false,
    0,
  );

  const ratio_used = Math.min(ratio, r_max);
  const caSize = compressedSize(prefix_tokens, ratio_used);
  const cache_aware = mk(
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
