import type { CacheInput, CacheQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CacheInput;
  expectedCacheAware: CacheQuality;
  expectedNaiveBust: CacheQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pcs-001",
    "input": {
      "prefixShare": 0.21,
      "queryVolatility": 0.76,
      "compressionTarget": 0.18,
      "prefixStability": 0.18,
      "cacheTtlFit": 0.15,
      "hitRatePrior": 0.12,
      "tokenVolume": 0.2,
      "tierDiscount": 0.17,
      "rewriteAggression": 0.67,
      "suffixShare": 0.69,
      "providerCacheSupport": 0.24,
      "promptCount": 5,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 6.2,
      "prefixPreserved": 9.16,
      "tokensSaved": 33.33,
      "tierSavings": 6.67,
      "compressionYield": 32.52,
      "confidence": 10.4,
      "overall": 14.24
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 28.97,
      "tierSavings": 0,
      "compressionYield": 62.32,
      "confidence": 28.5,
      "overall": 15.64
    }
  },
  {
    "id": "pcs-002",
    "input": {
      "prefixShare": 0.24,
      "queryVolatility": 0.76,
      "compressionTarget": 0.22,
      "prefixStability": 0.22,
      "cacheTtlFit": 0.19,
      "hitRatePrior": 0.16,
      "tokenVolume": 0.24,
      "tierDiscount": 0.21,
      "rewriteAggression": 0.66,
      "suffixShare": 0.69,
      "providerCacheSupport": 0.27,
      "promptCount": 6,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 10.18,
      "prefixPreserved": 12.62,
      "tokensSaved": 35.07,
      "tierSavings": 10.81,
      "compressionYield": 34.09,
      "confidence": 12.86,
      "overall": 17.41
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 29.8,
      "tierSavings": 0,
      "compressionYield": 62.96,
      "confidence": 28.52,
      "overall": 15.86
    }
  },
  {
    "id": "pcs-003",
    "input": {
      "prefixShare": 0.28,
      "queryVolatility": 0.76,
      "compressionTarget": 0.21,
      "prefixStability": 0.26,
      "cacheTtlFit": 0.24,
      "hitRatePrior": 0.21,
      "tokenVolume": 0.22,
      "tierDiscount": 0.25,
      "rewriteAggression": 0.66,
      "suffixShare": 0.69,
      "providerCacheSupport": 0.31,
      "promptCount": 7,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 16.34,
      "prefixPreserved": 17.57,
      "tokensSaved": 33.02,
      "tierSavings": 15.45,
      "compressionYield": 34.8,
      "confidence": 12.7,
      "overall": 20.69
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 30.95,
      "tierSavings": 0,
      "compressionYield": 66.36,
      "confidence": 30.66,
      "overall": 16.7
    }
  },
  {
    "id": "pcs-004",
    "input": {
      "prefixShare": 0.32,
      "queryVolatility": 0.67,
      "compressionTarget": 0.25,
      "prefixStability": 0.29,
      "cacheTtlFit": 0.2,
      "hitRatePrior": 0.25,
      "tokenVolume": 0.27,
      "tierDiscount": 0.23,
      "rewriteAggression": 0.65,
      "suffixShare": 0.61,
      "providerCacheSupport": 0.35,
      "promptCount": 8,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 18.26,
      "prefixPreserved": 19.94,
      "tokensSaved": 34.07,
      "tierSavings": 16.58,
      "compressionYield": 33.4,
      "confidence": 17.76,
      "overall": 22.28
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 30.27,
      "tierSavings": 0,
      "compressionYield": 63.08,
      "confidence": 27.5,
      "overall": 15.87
    }
  },
  {
    "id": "pcs-005",
    "input": {
      "prefixShare": 0.28,
      "queryVolatility": 0.67,
      "compressionTarget": 0.3,
      "prefixStability": 0.33,
      "cacheTtlFit": 0.24,
      "hitRatePrior": 0.2,
      "tokenVolume": 0.31,
      "tierDiscount": 0.27,
      "rewriteAggression": 0.65,
      "suffixShare": 0.61,
      "providerCacheSupport": 0.31,
      "promptCount": 9,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 16.99,
      "prefixPreserved": 20.24,
      "tokensSaved": 36.33,
      "tierSavings": 17.86,
      "compressionYield": 35.9,
      "confidence": 18.68,
      "overall": 22.99
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 31.29,
      "tierSavings": 0,
      "compressionYield": 64.16,
      "confidence": 28.92,
      "overall": 16.3
    }
  },
  {
    "id": "pcs-006",
    "input": {
      "prefixShare": 0.32,
      "queryVolatility": 0.67,
      "compressionTarget": 0.28,
      "prefixStability": 0.28,
      "cacheTtlFit": 0.29,
      "hitRatePrior": 0.24,
      "tokenVolume": 0.29,
      "tierDiscount": 0.31,
      "rewriteAggression": 0.64,
      "suffixShare": 0.62,
      "providerCacheSupport": 0.35,
      "promptCount": 10,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 21.6,
      "prefixPreserved": 21.56,
      "tokensSaved": 34.35,
      "tierSavings": 21.27,
      "compressionYield": 36.46,
      "confidence": 16.36,
      "overall": 24.67
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 32.55,
      "tierSavings": 0,
      "compressionYield": 67.84,
      "confidence": 30.92,
      "overall": 17.18
    }
  },
  {
    "id": "pcs-007",
    "input": {
      "prefixShare": 0.36,
      "queryVolatility": 0.67,
      "compressionTarget": 0.32,
      "prefixStability": 0.32,
      "cacheTtlFit": 0.33,
      "hitRatePrior": 0.28,
      "tokenVolume": 0.33,
      "tierDiscount": 0.35,
      "rewriteAggression": 0.53,
      "suffixShare": 0.62,
      "providerCacheSupport": 0.38,
      "promptCount": 11,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 24.55,
      "prefixPreserved": 24.82,
      "tokensSaved": 36.94,
      "tierSavings": 25.74,
      "compressionYield": 35.92,
      "confidence": 21.82,
      "overall": 27.73
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 31.03,
      "tierSavings": 0,
      "compressionYield": 62.88,
      "confidence": 27.84,
      "overall": 16
    }
  },
  {
    "id": "pcs-008",
    "input": {
      "prefixShare": 0.4,
      "queryVolatility": 0.58,
      "compressionTarget": 0.37,
      "prefixStability": 0.36,
      "cacheTtlFit": 0.29,
      "hitRatePrior": 0.33,
      "tokenVolume": 0.38,
      "tierDiscount": 0.33,
      "rewriteAggression": 0.53,
      "suffixShare": 0.54,
      "providerCacheSupport": 0.42,
      "promptCount": 12,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 28.27,
      "prefixPreserved": 28.6,
      "tokensSaved": 37.04,
      "tierSavings": 27.8,
      "compressionYield": 36.43,
      "confidence": 24.12,
      "overall": 30.12
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0,
      "prefixPreserved": 0,
      "tokensSaved": 32.18,
      "tierSavings": 0,
      "compressionYield": 63.96,
      "confidence": 27.82,
      "overall": 16.33
    }
  },
  {
    "id": "pcs-009",
    "input": {
      "prefixShare": 0.44,
      "queryVolatility": 0.58,
      "compressionTarget": 0.35,
      "prefixStability": 0.4,
      "cacheTtlFit": 0.34,
      "hitRatePrior": 0.37,
      "tokenVolume": 0.36,
      "tierDiscount": 0.37,
      "rewriteAggression": 0.52,
      "suffixShare": 0.54,
      "providerCacheSupport": 0.46,
      "promptCount": 13,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 34.98,
      "prefixPreserved": 34.18,
      "tokensSaved": 34.77,
      "tierSavings": 32.86,
      "compressionYield": 36.74,
      "confidence": 23.96,
      "overall": 33.68
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 1,
      "prefixPreserved": 0,
      "tokensSaved": 33.07,
      "tierSavings": 0,
      "compressionYield": 66.92,
      "confidence": 29.82,
      "overall": 17.27
    }
  },
  {
    "id": "pcs-010",
    "input": {
      "prefixShare": 0.4,
      "queryVolatility": 0.58,
      "compressionTarget": 0.4,
      "prefixStability": 0.44,
      "cacheTtlFit": 0.38,
      "hitRatePrior": 0.32,
      "tokenVolume": 0.4,
      "tierDiscount": 0.4,
      "rewriteAggression": 0.51,
      "suffixShare": 0.54,
      "providerCacheSupport": 0.42,
      "promptCount": 14,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 31.56,
      "prefixPreserved": 32.95,
      "tokensSaved": 38.16,
      "tierSavings": 32.71,
      "compressionYield": 37.67,
      "confidence": 27.88,
      "overall": 33.46
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0.46,
      "prefixPreserved": 0.49,
      "tokensSaved": 32.38,
      "tierSavings": 0,
      "compressionYield": 63.84,
      "confidence": 28.24,
      "overall": 16.57
    }
  },
  {
    "id": "pcs-011",
    "input": {
      "prefixShare": 0.44,
      "queryVolatility": 0.58,
      "compressionTarget": 0.44,
      "prefixStability": 0.48,
      "cacheTtlFit": 0.42,
      "hitRatePrior": 0.36,
      "tokenVolume": 0.44,
      "tierDiscount": 0.44,
      "rewriteAggression": 0.51,
      "suffixShare": 0.54,
      "providerCacheSupport": 0.46,
      "promptCount": 15,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 35.81,
      "prefixPreserved": 36.76,
      "tokensSaved": 39.9,
      "tierSavings": 36.94,
      "compressionYield": 39.24,
      "confidence": 30.56,
      "overall": 36.81
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 0.94,
      "prefixPreserved": 0.66,
      "tokensSaved": 33.23,
      "tierSavings": 0,
      "compressionYield": 64.64,
      "confidence": 28.08,
      "overall": 16.94
    }
  },
  {
    "id": "pcs-012",
    "input": {
      "prefixShare": 0.48,
      "queryVolatility": 0.49,
      "compressionTarget": 0.43,
      "prefixStability": 0.43,
      "cacheTtlFit": 0.39,
      "hitRatePrior": 0.41,
      "tokenVolume": 0.43,
      "tierDiscount": 0.42,
      "rewriteAggression": 0.5,
      "suffixShare": 0.46,
      "providerCacheSupport": 0.5,
      "promptCount": 16,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 40.77,
      "prefixPreserved": 38.62,
      "tokensSaved": 36.03,
      "tierSavings": 38.65,
      "compressionYield": 38.57,
      "confidence": 27.86,
      "overall": 37.91
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 2.26,
      "prefixPreserved": 0,
      "tokensSaved": 34.65,
      "tierSavings": 0,
      "compressionYield": 68.6,
      "confidence": 30.22,
      "overall": 18.06
    }
  },
  {
    "id": "pcs-013",
    "input": {
      "prefixShare": 0.52,
      "queryVolatility": 0.49,
      "compressionTarget": 0.47,
      "prefixStability": 0.47,
      "cacheTtlFit": 0.43,
      "hitRatePrior": 0.45,
      "tokenVolume": 0.47,
      "tierDiscount": 0.46,
      "rewriteAggression": 0.5,
      "suffixShare": 0.46,
      "providerCacheSupport": 0.53,
      "promptCount": 17,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 42.5,
      "prefixPreserved": 40.43,
      "tokensSaved": 38.9,
      "tierSavings": 41.47,
      "compressionYield": 38.55,
      "confidence": 33.32,
      "overall": 40.13
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 2.74,
      "prefixPreserved": 0.67,
      "tokensSaved": 33.83,
      "tierSavings": 0,
      "compressionYield": 65.4,
      "confidence": 27.14,
      "overall": 17.46
    }
  },
  {
    "id": "pcs-014",
    "input": {
      "prefixShare": 0.55,
      "queryVolatility": 0.49,
      "compressionTarget": 0.51,
      "prefixStability": 0.51,
      "cacheTtlFit": 0.47,
      "hitRatePrior": 0.49,
      "tokenVolume": 0.51,
      "tierDiscount": 0.5,
      "rewriteAggression": 0.39,
      "suffixShare": 0.46,
      "providerCacheSupport": 0.57,
      "promptCount": 18,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 46.88,
      "prefixPreserved": 44.94,
      "tokensSaved": 40.33,
      "tierSavings": 46.76,
      "compressionYield": 39.54,
      "confidence": 36,
      "overall": 43.76
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 4.54,
      "prefixPreserved": 3.84,
      "tokensSaved": 33.84,
      "tierSavings": 0.46,
      "compressionYield": 64.44,
      "confidence": 27.08,
      "overall": 18.39
    }
  },
  {
    "id": "pcs-015",
    "input": {
      "prefixShare": 0.52,
      "queryVolatility": 0.49,
      "compressionTarget": 0.5,
      "prefixStability": 0.55,
      "cacheTtlFit": 0.52,
      "hitRatePrior": 0.44,
      "tokenVolume": 0.49,
      "tierDiscount": 0.54,
      "rewriteAggression": 0.38,
      "suffixShare": 0.46,
      "providerCacheSupport": 0.53,
      "promptCount": 19,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 48.95,
      "prefixPreserved": 47.64,
      "tokensSaved": 38.64,
      "tierSavings": 49.35,
      "compressionYield": 40.91,
      "confidence": 34.08,
      "overall": 45.14
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 4.42,
      "prefixPreserved": 0.56,
      "tokensSaved": 34.93,
      "tierSavings": 1.17,
      "compressionYield": 67.68,
      "confidence": 30.56,
      "overall": 18.84
    }
  },
  {
    "id": "pcs-016",
    "input": {
      "prefixShare": 0.56,
      "queryVolatility": 0.4,
      "compressionTarget": 0.54,
      "prefixStability": 0.58,
      "cacheTtlFit": 0.48,
      "hitRatePrior": 0.48,
      "tokenVolume": 0.54,
      "tierDiscount": 0.52,
      "rewriteAggression": 0.37,
      "suffixShare": 0.39,
      "providerCacheSupport": 0.57,
      "promptCount": 20,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 49.34,
      "prefixPreserved": 49.01,
      "tokensSaved": 39.85,
      "tierSavings": 49.66,
      "compressionYield": 39.5,
      "confidence": 39.14,
      "overall": 46.01
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 5.26,
      "prefixPreserved": 4.91,
      "tokensSaved": 34.19,
      "tierSavings": 0.7,
      "compressionYield": 64.4,
      "confidence": 27.4,
      "overall": 18.87
    }
  },
  {
    "id": "pcs-017",
    "input": {
      "prefixShare": 0.6,
      "queryVolatility": 0.4,
      "compressionTarget": 0.59,
      "prefixStability": 0.62,
      "cacheTtlFit": 0.53,
      "hitRatePrior": 0.53,
      "tokenVolume": 0.58,
      "tierDiscount": 0.56,
      "rewriteAggression": 0.37,
      "suffixShare": 0.39,
      "providerCacheSupport": 0.61,
      "promptCount": 21,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 54.18,
      "prefixPreserved": 52.9,
      "tokensSaved": 41.84,
      "tierSavings": 54.16,
      "compressionYield": 41.52,
      "confidence": 41.98,
      "overall": 49.67
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 5.86,
      "prefixPreserved": 5.03,
      "tokensSaved": 35.15,
      "tierSavings": 0.56,
      "compressionYield": 65.48,
      "confidence": 27.38,
      "overall": 19.3
    }
  },
  {
    "id": "pcs-018",
    "input": {
      "prefixShare": 0.63,
      "queryVolatility": 0.4,
      "compressionTarget": 0.57,
      "prefixStability": 0.57,
      "cacheTtlFit": 0.57,
      "hitRatePrior": 0.57,
      "tokenVolume": 0.56,
      "tierDiscount": 0.6,
      "rewriteAggression": 0.36,
      "suffixShare": 0.39,
      "providerCacheSupport": 0.65,
      "promptCount": 22,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 60.15,
      "prefixPreserved": 55.1,
      "tokensSaved": 39.74,
      "tierSavings": 58.3,
      "compressionYield": 42.15,
      "confidence": 39.5,
      "overall": 52
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 6.82,
      "prefixPreserved": 0.92,
      "tokensSaved": 36.34,
      "tierSavings": 0.92,
      "compressionYield": 69.16,
      "confidence": 29.48,
      "overall": 19.72
    }
  },
  {
    "id": "pcs-019",
    "input": {
      "prefixShare": 0.67,
      "queryVolatility": 0.4,
      "compressionTarget": 0.61,
      "prefixStability": 0.61,
      "cacheTtlFit": 0.61,
      "hitRatePrior": 0.61,
      "tokenVolume": 0.6,
      "tierDiscount": 0.64,
      "rewriteAggression": 0.36,
      "suffixShare": 0.39,
      "providerCacheSupport": 0.68,
      "promptCount": 23,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 60.95,
      "prefixPreserved": 56.34,
      "tokensSaved": 42.51,
      "tierSavings": 60.62,
      "compressionYield": 41.95,
      "confidence": 44.96,
      "overall": 53.73
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 7.3,
      "prefixPreserved": 5.09,
      "tokensSaved": 35.52,
      "tierSavings": 0.79,
      "compressionYield": 65.96,
      "confidence": 26.4,
      "overall": 19.73
    }
  },
  {
    "id": "pcs-020",
    "input": {
      "prefixShare": 0.64,
      "queryVolatility": 0.31,
      "compressionTarget": 0.66,
      "prefixStability": 0.65,
      "cacheTtlFit": 0.58,
      "hitRatePrior": 0.56,
      "tokenVolume": 0.65,
      "tierDiscount": 0.62,
      "rewriteAggression": 0.35,
      "suffixShare": 0.31,
      "providerCacheSupport": 0.65,
      "promptCount": 24,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 59.39,
      "prefixPreserved": 57.19,
      "tokensSaved": 42.81,
      "tierSavings": 60.02,
      "compressionYield": 42.82,
      "confidence": 45.88,
      "overall": 53.64
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 7.06,
      "prefixPreserved": 5.48,
      "tokensSaved": 36.62,
      "tierSavings": 0.78,
      "compressionYield": 66.88,
      "confidence": 27.64,
      "overall": 20.14
    }
  },
  {
    "id": "pcs-021",
    "input": {
      "prefixShare": 0.67,
      "queryVolatility": 0.31,
      "compressionTarget": 0.64,
      "prefixStability": 0.69,
      "cacheTtlFit": 0.62,
      "hitRatePrior": 0.6,
      "tokenVolume": 0.63,
      "tierDiscount": 0.66,
      "rewriteAggression": 0.24,
      "suffixShare": 0.31,
      "providerCacheSupport": 0.68,
      "promptCount": 25,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 67.37,
      "prefixPreserved": 64.06,
      "tokensSaved": 40.42,
      "tierSavings": 66.65,
      "compressionYield": 42.91,
      "confidence": 45.34,
      "overall": 58.03
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 9.22,
      "prefixPreserved": 4.99,
      "tokensSaved": 36.74,
      "tierSavings": 2.09,
      "compressionYield": 68.24,
      "confidence": 29.82,
      "overall": 21.2
    }
  },
  {
    "id": "pcs-022",
    "input": {
      "prefixShare": 0.71,
      "queryVolatility": 0.31,
      "compressionTarget": 0.69,
      "prefixStability": 0.73,
      "cacheTtlFit": 0.66,
      "hitRatePrior": 0.65,
      "tokenVolume": 0.67,
      "tierDiscount": 0.69,
      "rewriteAggression": 0.24,
      "suffixShare": 0.31,
      "providerCacheSupport": 0.72,
      "promptCount": 26,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 68.26,
      "prefixPreserved": 65.27,
      "tokensSaved": 43.42,
      "tierSavings": 68.66,
      "compressionYield": 43.13,
      "confidence": 51.02,
      "overall": 59.81
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 9.76,
      "prefixPreserved": 9.11,
      "tokensSaved": 36.03,
      "tierSavings": 1.86,
      "compressionYield": 65.32,
      "confidence": 26.8,
      "overall": 21.25
    }
  },
  {
    "id": "pcs-023",
    "input": {
      "prefixShare": 0.75,
      "queryVolatility": 0.31,
      "compressionTarget": 0.73,
      "prefixStability": 0.77,
      "cacheTtlFit": 0.71,
      "hitRatePrior": 0.69,
      "tokenVolume": 0.71,
      "tierDiscount": 0.73,
      "rewriteAggression": 0.23,
      "suffixShare": 0.31,
      "providerCacheSupport": 0.76,
      "promptCount": 27,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 72.79,
      "prefixPreserved": 69.24,
      "tokensSaved": 45.13,
      "tierSavings": 73.11,
      "compressionYield": 44.64,
      "confidence": 53.86,
      "overall": 63.31
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 10.42,
      "prefixPreserved": 9.56,
      "tokensSaved": 36.81,
      "tierSavings": 1.84,
      "compressionYield": 65.96,
      "confidence": 26.64,
      "overall": 21.67
    }
  },
  {
    "id": "pcs-024",
    "input": {
      "prefixShare": 0.79,
      "queryVolatility": 0.22,
      "compressionTarget": 0.72,
      "prefixStability": 0.72,
      "cacheTtlFit": 0.67,
      "hitRatePrior": 0.74,
      "tokenVolume": 0.7,
      "tierDiscount": 0.71,
      "rewriteAggression": 0.22,
      "suffixShare": 0.23,
      "providerCacheSupport": 0.8,
      "promptCount": 4,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 78.7,
      "prefixPreserved": 70.6,
      "tokensSaved": 41.42,
      "tierSavings": 75.14,
      "compressionYield": 44.26,
      "confidence": 46.2,
      "overall": 64.25
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 11.68,
      "prefixPreserved": 5.38,
      "tokensSaved": 38.23,
      "tierSavings": 1.64,
      "compressionYield": 69.92,
      "confidence": 28.78,
      "overall": 22.11
    }
  },
  {
    "id": "pcs-025",
    "input": {
      "prefixShare": 0.75,
      "queryVolatility": 0.22,
      "compressionTarget": 0.76,
      "prefixStability": 0.76,
      "cacheTtlFit": 0.71,
      "hitRatePrior": 0.68,
      "tokenVolume": 0.74,
      "tierDiscount": 0.75,
      "rewriteAggression": 0.22,
      "suffixShare": 0.23,
      "providerCacheSupport": 0.76,
      "promptCount": 5,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 72.9,
      "prefixPreserved": 68.06,
      "tokensSaved": 44.4,
      "tierSavings": 74.01,
      "compressionYield": 44.43,
      "confidence": 50.12,
      "overall": 62.83
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 10.96,
      "prefixPreserved": 9.56,
      "tokensSaved": 37.51,
      "tierSavings": 2.07,
      "compressionYield": 66.72,
      "confidence": 27.06,
      "overall": 22.09
    }
  },
  {
    "id": "pcs-026",
    "input": {
      "prefixShare": 0.79,
      "queryVolatility": 0.22,
      "compressionTarget": 0.8,
      "prefixStability": 0.8,
      "cacheTtlFit": 0.76,
      "hitRatePrior": 0.72,
      "tokenVolume": 0.78,
      "tierDiscount": 0.79,
      "rewriteAggression": 0.21,
      "suffixShare": 0.24,
      "providerCacheSupport": 0.8,
      "promptCount": 6,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 77.43,
      "prefixPreserved": 72.03,
      "tokensSaved": 46.42,
      "tierSavings": 78.47,
      "compressionYield": 46.22,
      "confidence": 52.96,
      "overall": 66.41
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 11.62,
      "prefixPreserved": 10.01,
      "tokensSaved": 38.28,
      "tierSavings": 2.05,
      "compressionYield": 67.36,
      "confidence": 26.9,
      "overall": 22.52
    }
  },
  {
    "id": "pcs-027",
    "input": {
      "prefixShare": 0.83,
      "queryVolatility": 0.22,
      "compressionTarget": 0.79,
      "prefixStability": 0.84,
      "cacheTtlFit": 0.8,
      "hitRatePrior": 0.77,
      "tokenVolume": 0.76,
      "tierDiscount": 0.83,
      "rewriteAggression": 0.21,
      "suffixShare": 0.24,
      "providerCacheSupport": 0.83,
      "promptCount": 7,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 86.53,
      "prefixPreserved": 78.74,
      "tokensSaved": 44.71,
      "tierSavings": 84.66,
      "compressionYield": 47.55,
      "confidence": 52.42,
      "overall": 71.18
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 12.52,
      "prefixPreserved": 6.46,
      "tokensSaved": 39.36,
      "tierSavings": 2.19,
      "compressionYield": 70.76,
      "confidence": 29.12,
      "overall": 22.93
    }
  },
  {
    "id": "pcs-028",
    "input": {
      "prefixShare": 0.87,
      "queryVolatility": 0.13,
      "compressionTarget": 0.83,
      "prefixStability": 0.87,
      "cacheTtlFit": 0.76,
      "hitRatePrior": 0.81,
      "tokenVolume": 0.81,
      "tierDiscount": 0.81,
      "rewriteAggression": 0.1,
      "suffixShare": 0.16,
      "providerCacheSupport": 0.87,
      "promptCount": 8,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 85.48,
      "prefixPreserved": 79.83,
      "tokensSaved": 45.11,
      "tierSavings": 85.11,
      "compressionYield": 44.96,
      "confidence": 57.48,
      "overall": 71.41
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 14.56,
      "prefixPreserved": 13.53,
      "tokensSaved": 37.84,
      "tierSavings": 2.68,
      "compressionYield": 65.88,
      "confidence": 25.96,
      "overall": 23.58
    }
  },
  {
    "id": "pcs-029",
    "input": {
      "prefixShare": 0.91,
      "queryVolatility": 0.13,
      "compressionTarget": 0.88,
      "prefixStability": 0.91,
      "cacheTtlFit": 0.81,
      "hitRatePrior": 0.86,
      "tokenVolume": 0.85,
      "tierDiscount": 0.85,
      "rewriteAggression": 0.09,
      "suffixShare": 0.16,
      "providerCacheSupport": 0.91,
      "promptCount": 9,
      "profile": "balanced"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 90.34,
      "prefixPreserved": 83.8,
      "tokensSaved": 47.07,
      "tierSavings": 89.71,
      "compressionYield": 46.92,
      "confidence": 60.32,
      "overall": 75.11
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 15.28,
      "prefixPreserved": 13.92,
      "tokensSaved": 38.73,
      "tierSavings": 2.64,
      "compressionYield": 66.8,
      "confidence": 25.94,
      "overall": 24.07
    }
  },
  {
    "id": "pcs-030",
    "input": {
      "prefixShare": 0.87,
      "queryVolatility": 0.13,
      "compressionTarget": 0.86,
      "prefixStability": 0.86,
      "cacheTtlFit": 0.85,
      "hitRatePrior": 0.8,
      "tokenVolume": 0.83,
      "tierDiscount": 0.89,
      "rewriteAggression": 0.09,
      "suffixShare": 0.16,
      "providerCacheSupport": 0.87,
      "promptCount": 10,
      "profile": "aggressive"
    },
    "expectedCacheAware": {
      "mode": "cache-aware",
      "cacheHitRate": 92.11,
      "prefixPreserved": 83.53,
      "tokensSaved": 45.4,
      "tierSavings": 91.56,
      "compressionYield": 48.32,
      "confidence": 56.08,
      "overall": 75.44
    },
    "expectedNaiveBust": {
      "mode": "naive-bust",
      "cacheHitRate": 14.92,
      "prefixPreserved": 9.54,
      "tokensSaved": 40.1,
      "tierSavings": 3.36,
      "compressionYield": 70.64,
      "confidence": 29.38,
      "overall": 24.39
    }
  }
];
