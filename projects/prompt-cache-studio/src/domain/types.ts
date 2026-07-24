export type CompressProfile = "balanced" | "aggressive";

export type ScoreMode = "cache-aware" | "naive-bust";

/**
 * Soft-simulation inputs for cache-aware prompt compression quality.
 * Method-lab cost model only — not live Anthropic / OpenAI cache APIs.
 * Never brand as the paper’s product name.
 */
export type CacheInput = {
  /** Fraction of the prompt that is a shared stable prefix (0–1). */
  prefixShare: number;
  /** How volatile the query / suffix is across calls (0–1). */
  queryVolatility: number;
  /** Desired compression intensity (0–1). */
  compressionTarget: number;
  /** Stability of the shared prefix across traffic (0–1). */
  prefixStability: number;
  /** Fit of cache TTL to reuse patterns (0–1). */
  cacheTtlFit: number;
  /** Prior expected cache hit rate (0–1). */
  hitRatePrior: number;
  /** Relative token volume / spend pressure (0–1). */
  tokenVolume: number;
  /** Depth of cached-token discount vs uncached (0–1). */
  tierDiscount: number;
  /** How aggressively text is rewritten (0–1). */
  rewriteAggression: number;
  /** Query / suffix share of the prompt (0–1). */
  suffixShare: number;
  /** Provider support for prompt caching (0–1). */
  providerCacheSupport: number;
  /** Distinct prompt assets in the library (1–100). */
  promptCount: number;
  profile: CompressProfile;
};

export type CacheQuality = {
  mode: ScoreMode;
  cacheHitRate: number;
  prefixPreserved: number;
  tokensSaved: number;
  tierSavings: number;
  compressionYield: number;
  confidence: number;
  overall: number;
};

export type CostReadiness = {
  prefixReady: boolean;
  policyReady: boolean;
  tierReady: boolean;
  hitReady: boolean;
  overallReady: boolean;
  hitGap: number;
  savingsGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: CacheQuality,
  input: CacheInput,
): CostReadiness {
  const hitTarget = 52 + input.prefixShare * 22 + input.prefixStability * 14;
  const savingsTarget =
    50 + input.tierDiscount * 20 + input.compressionTarget * 12;
  const hitGap = round2(hitTarget - quality.cacheHitRate);
  const savingsGap = round2(savingsTarget - quality.tierSavings);
  const prefixReady = quality.prefixPreserved >= 54 + input.prefixShare * 18;
  const policyReady =
    quality.compressionYield >= 48 + input.compressionTarget * 20;
  const tierReady = quality.tierSavings >= 50 + input.tierDiscount * 16;
  const hitReady = quality.cacheHitRate >= hitTarget - 8;
  return {
    prefixReady,
    policyReady,
    tierReady,
    hitReady,
    overallReady: prefixReady && policyReady && tierReady && hitReady,
    hitGap,
    savingsGap,
  };
}
