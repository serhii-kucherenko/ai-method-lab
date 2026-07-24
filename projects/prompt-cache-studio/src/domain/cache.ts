import {
  type CacheInput,
  type CacheQuality,
  clamp,
  round2,
} from "./types";

function prefixSignal(input: CacheInput): number {
  return clamp(
    input.prefixShare * 36 +
      input.prefixStability * 28 +
      input.providerCacheSupport * 18 +
      input.cacheTtlFit * 14 +
      Math.min(100, input.promptCount) * 0.12,
    0,
    100,
  );
}

function compressSignal(input: CacheInput): number {
  return clamp(
    input.compressionTarget * 40 +
      input.suffixShare * 22 +
      (1 - input.queryVolatility) * 18 +
      input.rewriteAggression * 12,
    0,
    100,
  );
}

/**
 * Cache-aware compression plan (good path).
 * Preserves shared prefix for provider cache; compresses query/suffix only.
 * Two-tier cost: cached prefix tokens + compressed uncached suffix.
 */
export function scoreCacheAware(input: CacheInput): CacheQuality {
  const aggressive = input.profile === "aggressive";
  const boost = aggressive ? 1.04 : 1.0;
  const prefix = prefixSignal(input);
  const compress = compressSignal(input);

  const prefixPreserved = round2(
    clamp(
      (prefix * 0.52 +
        input.prefixStability * 28 +
        input.providerCacheSupport * 16) *
        boost -
        input.rewriteAggression * 8 -
        input.queryVolatility * 6,
      0,
      100,
    ),
  );

  const cacheHitRate = round2(
    clamp(
      (input.hitRatePrior * 34 +
        prefixPreserved * 0.38 +
        input.cacheTtlFit * 22 +
        input.prefixShare * 14) *
        boost -
        input.queryVolatility * 10,
      0,
      100,
    ),
  );

  const compressionYield = round2(
    clamp(
      (compress * 0.48 +
        input.compressionTarget * 26 +
        input.suffixShare * 18) *
        boost -
        input.prefixShare * 6,
      0,
      100,
    ),
  );

  const tokensSaved = round2(
    clamp(
      compressionYield * 0.55 +
        input.tokenVolume * 22 +
        input.suffixShare * 16 -
        (aggressive ? 2 : 0),
      0,
      100,
    ),
  );

  const tierSavings = round2(
    clamp(
      cacheHitRate * 0.42 +
        input.tierDiscount * 34 +
        prefixPreserved * 0.18 +
        input.tokenVolume * 10 -
        input.rewriteAggression * 8,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.prefixStability * 24 +
        input.providerCacheSupport * 22 +
        input.cacheTtlFit * 16 +
        Math.min(100, input.promptCount) * 0.2 +
        (aggressive ? 2 : 5) -
        input.queryVolatility * 10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      cacheHitRate * 0.24 +
        prefixPreserved * 0.22 +
        tierSavings * 0.2 +
        tokensSaved * 0.14 +
        compressionYield * 0.12 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "cache-aware",
    cacheHitRate,
    prefixPreserved,
    tokensSaved,
    tierSavings,
    compressionYield,
    confidence,
    overall,
  };
}

/**
 * Naive query-aware compression — rewrites the whole prompt including prefix,
 * busts the provider cache, and loses two-tier discount savings.
 */
export function scoreNaiveBust(input: CacheInput): CacheQuality {
  const aggressive = input.profile === "aggressive";
  // Baseline rewrites the prefix; cache collapses.
  const bustPenalty = clamp(
    0.35 + input.rewriteAggression * 0.4 + input.compressionTarget * 0.2,
    0.3,
    0.95,
  );

  const prefixPreserved = round2(
    clamp(
      22 +
        input.prefixStability * 10 -
        bustPenalty * 28 -
        input.rewriteAggression * 16 +
        (aggressive ? -4 : 0),
      0,
      48,
    ),
  );

  const cacheHitRate = round2(
    clamp(
      18 +
        input.hitRatePrior * 12 -
        bustPenalty * 30 -
        input.queryVolatility * 8 +
        input.cacheTtlFit * 6,
      0,
      42,
    ),
  );

  const compressionYield = round2(
    clamp(
      48 +
        input.compressionTarget * 28 +
        input.rewriteAggression * 16 -
        input.prefixStability * 8 +
        (aggressive ? 4 : 0),
      0,
      88,
    ),
  );

  const tokensSaved = round2(
    clamp(
      compressionYield * 0.42 +
        input.tokenVolume * 14 -
        cacheHitRate * 0.08,
      0,
      72,
    ),
  );

  const tierSavings = round2(
    clamp(
      12 +
        input.tierDiscount * 8 +
        cacheHitRate * 0.2 -
        bustPenalty * 18 -
        input.prefixShare * 10,
      0,
      38,
    ),
  );

  const confidence = round2(
    clamp(
      30 +
        input.compressionTarget * 14 +
        (aggressive ? 3 : 0) -
        input.prefixShare * 10 -
        input.providerCacheSupport * 8,
      0,
      52,
    ),
  );

  const overall = round2(
    clamp(
      cacheHitRate * 0.22 +
        prefixPreserved * 0.18 +
        tierSavings * 0.22 +
        tokensSaved * 0.16 +
        compressionYield * 0.14 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "naive-bust",
    cacheHitRate,
    prefixPreserved,
    tokensSaved,
    tierSavings,
    compressionYield,
    confidence,
    overall,
  };
}
