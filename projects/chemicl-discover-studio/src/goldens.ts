import type { DiscoverInput, DiscoverQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DiscoverInput;
  expectedMultimodal: DiscoverQuality;
  expectedTextOnly: DiscoverQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cd-001",
    "input": {
      "multimodalCoverage": 0.29,
      "modalityFidelity": 0.25,
      "exemplarAlignment": 0.28,
      "iclPrecision": 0.34,
      "textOnlyBreadth": 0.39,
      "baselineOptimism": 0.45,
      "chemistryHardness": 0.59,
      "overclaimRisk": 0.5,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 22.73,
      "modalityScore": 30.25,
      "exemplarScore": 23.66,
      "precisionIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "multimodalContribution": 28.08,
      "textContribution": 16.13,
      "overall": 29.93
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 5.76,
      "modalityScore": 17.31,
      "exemplarScore": 13.1,
      "precisionIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "multimodalContribution": 21.9,
      "textContribution": 38.71,
      "overall": 27.29
    }
  },
  {
    "id": "cd-002",
    "input": {
      "multimodalCoverage": 0.33,
      "modalityFidelity": 0.29,
      "exemplarAlignment": 0.32,
      "iclPrecision": 0.38,
      "textOnlyBreadth": 0.43,
      "baselineOptimism": 0.46,
      "chemistryHardness": 0.6,
      "overclaimRisk": 0.51,
      "discoverBias": "exemplar_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 22.36,
      "modalityScore": 33.9,
      "exemplarScore": 34.57,
      "precisionIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "multimodalContribution": 30.65,
      "textContribution": 18.79,
      "overall": 32.52
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 2.43,
      "modalityScore": 18.44,
      "exemplarScore": 14.13,
      "precisionIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "multimodalContribution": 20.12,
      "textContribution": 34.65,
      "overall": 23.59
    }
  },
  {
    "id": "cd-003",
    "input": {
      "multimodalCoverage": 0.37,
      "modalityFidelity": 0.27,
      "exemplarAlignment": 0.36,
      "iclPrecision": 0.42,
      "textOnlyBreadth": 0.46,
      "baselineOptimism": 0.42,
      "chemistryHardness": 0.6,
      "overclaimRisk": 0.46,
      "discoverBias": "text_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 12.32,
      "modalityScore": 23.71,
      "exemplarScore": 21.13,
      "precisionIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "multimodalContribution": 19.04,
      "textContribution": 19.87,
      "overall": 20.19
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 12.17,
      "modalityScore": 17.32,
      "exemplarScore": 13.1,
      "precisionIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "multimodalContribution": 26.17,
      "textContribution": 46.7,
      "overall": 34.62
    }
  },
  {
    "id": "cd-004",
    "input": {
      "multimodalCoverage": 0.33,
      "modalityFidelity": 0.32,
      "exemplarAlignment": 0.39,
      "iclPrecision": 0.38,
      "textOnlyBreadth": 0.42,
      "baselineOptimism": 0.43,
      "chemistryHardness": 0.53,
      "overclaimRisk": 0.46,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 28.24,
      "modalityScore": 36.03,
      "exemplarScore": 33.23,
      "precisionIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "multimodalContribution": 34.58,
      "textContribution": 19.21,
      "overall": 35.81
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 8.7,
      "modalityScore": 18.01,
      "exemplarScore": 14.03,
      "precisionIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "multimodalContribution": 23.26,
      "textContribution": 40.33,
      "overall": 29.57
    }
  },
  {
    "id": "cd-005",
    "input": {
      "multimodalCoverage": 0.37,
      "modalityFidelity": 0.36,
      "exemplarAlignment": 0.35,
      "iclPrecision": 0.42,
      "textOnlyBreadth": 0.46,
      "baselineOptimism": 0.45,
      "chemistryHardness": 0.53,
      "overclaimRisk": 0.47,
      "discoverBias": "multimodal_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 26.98,
      "modalityScore": 39.64,
      "exemplarScore": 21.55,
      "precisionIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "multimodalContribution": 34.51,
      "textContribution": 22.35,
      "overall": 36.32
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 0,
      "modalityScore": 19.71,
      "exemplarScore": 15.65,
      "precisionIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "multimodalContribution": 20.62,
      "textContribution": 36.41,
      "overall": 25.88
    }
  },
  {
    "id": "cd-006",
    "input": {
      "multimodalCoverage": 0.41,
      "modalityFidelity": 0.34,
      "exemplarAlignment": 0.39,
      "iclPrecision": 0.45,
      "textOnlyBreadth": 0.5,
      "baselineOptimism": 0.4,
      "chemistryHardness": 0.54,
      "overclaimRisk": 0.42,
      "discoverBias": "balanced",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 34.06,
      "modalityScore": 39.5,
      "exemplarScore": 35.97,
      "precisionIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "multimodalContribution": 38.93,
      "textContribution": 23.51,
      "overall": 40.15
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 11.98,
      "modalityScore": 18.2,
      "exemplarScore": 14.2,
      "precisionIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "multimodalContribution": 25.18,
      "textContribution": 43.27,
      "overall": 32.45
    }
  },
  {
    "id": "cd-007",
    "input": {
      "multimodalCoverage": 0.45,
      "modalityFidelity": 0.38,
      "exemplarAlignment": 0.42,
      "iclPrecision": 0.49,
      "textOnlyBreadth": 0.53,
      "baselineOptimism": 0.42,
      "chemistryHardness": 0.55,
      "overclaimRisk": 0.43,
      "discoverBias": "exemplar_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 31.69,
      "modalityScore": 43.11,
      "exemplarScore": 48.5,
      "precisionIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "multimodalContribution": 40.82,
      "textContribution": 25.77,
      "overall": 42.11
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 8.27,
      "modalityScore": 19.5,
      "exemplarScore": 15.44,
      "precisionIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "multimodalContribution": 22.74,
      "textContribution": 37.59,
      "overall": 27.34
    }
  },
  {
    "id": "cd-008",
    "input": {
      "multimodalCoverage": 0.41,
      "modalityFidelity": 0.43,
      "exemplarAlignment": 0.46,
      "iclPrecision": 0.45,
      "textOnlyBreadth": 0.49,
      "baselineOptimism": 0.43,
      "chemistryHardness": 0.47,
      "overclaimRisk": 0.44,
      "discoverBias": "text_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 19.41,
      "modalityScore": 35.43,
      "exemplarScore": 27.73,
      "precisionIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "multimodalContribution": 26.76,
      "textContribution": 25.34,
      "overall": 27.5
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 16.4,
      "modalityScore": 20.32,
      "exemplarScore": 16.53,
      "precisionIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "multimodalContribution": 29.38,
      "textContribution": 51.02,
      "overall": 39.86
    }
  },
  {
    "id": "cd-009",
    "input": {
      "multimodalCoverage": 0.46,
      "modalityFidelity": 0.41,
      "exemplarAlignment": 0.5,
      "iclPrecision": 0.49,
      "textOnlyBreadth": 0.53,
      "baselineOptimism": 0.39,
      "chemistryHardness": 0.48,
      "overclaimRisk": 0.38,
      "discoverBias": "balanced",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 40.13,
      "modalityScore": 45.49,
      "exemplarScore": 45.77,
      "precisionIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "multimodalContribution": 45.74,
      "textContribution": 26.78,
      "overall": 46.33
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 14.91,
      "modalityScore": 19.18,
      "exemplarScore": 15.47,
      "precisionIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "multimodalContribution": 26.76,
      "textContribution": 45.32,
      "overall": 35.12
    }
  },
  {
    "id": "cd-010",
    "input": {
      "multimodalCoverage": 0.5,
      "modalityFidelity": 0.45,
      "exemplarAlignment": 0.46,
      "iclPrecision": 0.53,
      "textOnlyBreadth": 0.57,
      "baselineOptimism": 0.4,
      "chemistryHardness": 0.49,
      "overclaimRisk": 0.39,
      "discoverBias": "multimodal_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 36.69,
      "modalityScore": 49.14,
      "exemplarScore": 30.74,
      "precisionIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "multimodalContribution": 44.64,
      "textContribution": 29.41,
      "overall": 45.9
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 3.59,
      "modalityScore": 20.29,
      "exemplarScore": 16.48,
      "precisionIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "multimodalContribution": 22.59,
      "textContribution": 39.09,
      "overall": 29.2
    }
  },
  {
    "id": "cd-011",
    "input": {
      "multimodalCoverage": 0.54,
      "modalityFidelity": 0.49,
      "exemplarAlignment": 0.49,
      "iclPrecision": 0.57,
      "textOnlyBreadth": 0.6,
      "baselineOptimism": 0.42,
      "chemistryHardness": 0.49,
      "overclaimRisk": 0.4,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 47.29,
      "modalityScore": 52.75,
      "exemplarScore": 47.28,
      "precisionIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "multimodalContribution": 51.45,
      "textContribution": 31.9,
      "overall": 51.93
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 17.1,
      "modalityScore": 21.73,
      "exemplarScore": 17.88,
      "precisionIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "multimodalContribution": 29.88,
      "textContribution": 50.58,
      "overall": 39.71
    }
  },
  {
    "id": "cd-012",
    "input": {
      "multimodalCoverage": 0.5,
      "modalityFidelity": 0.48,
      "exemplarAlignment": 0.53,
      "iclPrecision": 0.53,
      "textOnlyBreadth": 0.56,
      "baselineOptimism": 0.37,
      "chemistryHardness": 0.42,
      "overclaimRisk": 0.35,
      "discoverBias": "exemplar_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 38.25,
      "modalityScore": 51.28,
      "exemplarScore": 62.01,
      "precisionIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "multimodalContribution": 49.26,
      "textContribution": 29.77,
      "overall": 49.75
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 13.23,
      "modalityScore": 19.78,
      "exemplarScore": 16.29,
      "precisionIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "multimodalContribution": 24,
      "textContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "cd-013",
    "input": {
      "multimodalCoverage": 0.54,
      "modalityFidelity": 0.52,
      "exemplarAlignment": 0.56,
      "iclPrecision": 0.57,
      "textOnlyBreadth": 0.6,
      "baselineOptimism": 0.39,
      "chemistryHardness": 0.42,
      "overclaimRisk": 0.36,
      "discoverBias": "text_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 29.19,
      "modalityScore": 44.88,
      "exemplarScore": 36.66,
      "precisionIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "multimodalContribution": 35.81,
      "textContribution": 32.88,
      "overall": 36.28
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 22.62,
      "modalityScore": 21.45,
      "exemplarScore": 17.86,
      "precisionIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "multimodalContribution": 33.34,
      "textContribution": 57.32,
      "overall": 46.52
    }
  },
  {
    "id": "cd-014",
    "input": {
      "multimodalCoverage": 0.58,
      "modalityFidelity": 0.56,
      "exemplarAlignment": 0.6,
      "iclPrecision": 0.61,
      "textOnlyBreadth": 0.63,
      "baselineOptimism": 0.4,
      "chemistryHardness": 0.43,
      "overclaimRisk": 0.36,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 52.7,
      "modalityScore": 58.53,
      "exemplarScore": 56.74,
      "precisionIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "multimodalContribution": 57.91,
      "textContribution": 34.87,
      "overall": 57.76
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 20.03,
      "modalityScore": 22.29,
      "exemplarScore": 18.65,
      "precisionIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "multimodalContribution": 31.18,
      "textContribution": 52.13,
      "overall": 41.92
    }
  },
  {
    "id": "cd-015",
    "input": {
      "multimodalCoverage": 0.62,
      "modalityFidelity": 0.54,
      "exemplarAlignment": 0.56,
      "iclPrecision": 0.65,
      "textOnlyBreadth": 0.67,
      "baselineOptimism": 0.36,
      "chemistryHardness": 0.44,
      "overclaimRisk": 0.31,
      "discoverBias": "multimodal_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 45.96,
      "modalityScore": 58.35,
      "exemplarScore": 39.38,
      "precisionIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "multimodalContribution": 54.57,
      "textContribution": 36.3,
      "overall": 55.28
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 9.43,
      "modalityScore": 21.24,
      "exemplarScore": 17.6,
      "precisionIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "multimodalContribution": 25.15,
      "textContribution": 41.95,
      "overall": 32.87
    }
  },
  {
    "id": "cd-016",
    "input": {
      "multimodalCoverage": 0.58,
      "modalityFidelity": 0.59,
      "exemplarAlignment": 0.6,
      "iclPrecision": 0.6,
      "textOnlyBreadth": 0.63,
      "baselineOptimism": 0.37,
      "chemistryHardness": 0.36,
      "overclaimRisk": 0.32,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 54.5,
      "modalityScore": 60.67,
      "exemplarScore": 57.91,
      "precisionIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "multimodalContribution": 59.26,
      "textContribution": 35.81,
      "overall": 59.04
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 22.05,
      "modalityScore": 21.96,
      "exemplarScore": 18.63,
      "precisionIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "multimodalContribution": 31.3,
      "textContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "cd-017",
    "input": {
      "multimodalCoverage": 0.62,
      "modalityFidelity": 0.63,
      "exemplarAlignment": 0.63,
      "iclPrecision": 0.64,
      "textOnlyBreadth": 0.67,
      "baselineOptimism": 0.39,
      "chemistryHardness": 0.37,
      "overclaimRisk": 0.33,
      "discoverBias": "exemplar_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 48.47,
      "modalityScore": 64.28,
      "exemplarScore": 75.18,
      "precisionIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "multimodalContribution": 60.69,
      "textContribution": 38.66,
      "overall": 60.72
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 18.73,
      "modalityScore": 23.48,
      "exemplarScore": 20.01,
      "precisionIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "multimodalContribution": 28.44,
      "textContribution": 44.27,
      "overall": 35.85
    }
  },
  {
    "id": "cd-018",
    "input": {
      "multimodalCoverage": 0.66,
      "modalityFidelity": 0.61,
      "exemplarAlignment": 0.67,
      "iclPrecision": 0.68,
      "textOnlyBreadth": 0.7,
      "baselineOptimism": 0.34,
      "chemistryHardness": 0.38,
      "overclaimRisk": 0.27,
      "discoverBias": "text_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 38.37,
      "modalityScore": 54.13,
      "exemplarScore": 45.57,
      "precisionIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "multimodalContribution": 44.55,
      "textContribution": 39.21,
      "overall": 44.59
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 28.36,
      "modalityScore": 21.72,
      "exemplarScore": 18.33,
      "precisionIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "multimodalContribution": 36.47,
      "textContribution": 62.28,
      "overall": 51.94
    }
  },
  {
    "id": "cd-019",
    "input": {
      "multimodalCoverage": 0.7,
      "modalityFidelity": 0.65,
      "exemplarAlignment": 0.7,
      "iclPrecision": 0.72,
      "textOnlyBreadth": 0.74,
      "baselineOptimism": 0.36,
      "chemistryHardness": 0.38,
      "overclaimRisk": 0.28,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 63.85,
      "modalityScore": 67.74,
      "exemplarScore": 68.21,
      "precisionIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "multimodalContribution": 68.47,
      "textContribution": 42.3,
      "overall": 67.76
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 26.25,
      "modalityScore": 23.38,
      "exemplarScore": 19.89,
      "precisionIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "multimodalContribution": 34.65,
      "textContribution": 57.03,
      "overall": 47.39
    }
  },
  {
    "id": "cd-020",
    "input": {
      "multimodalCoverage": 0.66,
      "modalityFidelity": 0.7,
      "exemplarAlignment": 0.66,
      "iclPrecision": 0.68,
      "textOnlyBreadth": 0.7,
      "baselineOptimism": 0.37,
      "chemistryHardness": 0.31,
      "overclaimRisk": 0.29,
      "discoverBias": "multimodal_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 52.89,
      "modalityScore": 70.06,
      "exemplarScore": 45.78,
      "precisionIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "multimodalContribution": 62.48,
      "textContribution": 41.57,
      "overall": 62.72
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 13.66,
      "modalityScore": 23.97,
      "exemplarScore": 20.71,
      "precisionIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "multimodalContribution": 27.94,
      "textContribution": 45.32,
      "overall": 37.28
    }
  },
  {
    "id": "cd-021",
    "input": {
      "multimodalCoverage": 0.7,
      "modalityFidelity": 0.68,
      "exemplarAlignment": 0.7,
      "iclPrecision": 0.72,
      "textOnlyBreadth": 0.73,
      "baselineOptimism": 0.33,
      "chemistryHardness": 0.31,
      "overclaimRisk": 0.24,
      "discoverBias": "balanced",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 65.63,
      "modalityScore": 69.88,
      "exemplarScore": 69.36,
      "precisionIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "multimodalContribution": 69.94,
      "textContribution": 42.58,
      "overall": 69.02
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 27.89,
      "modalityScore": 22.77,
      "exemplarScore": 19.58,
      "precisionIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "multimodalContribution": 34.36,
      "textContribution": 55.95,
      "overall": 47.28
    }
  },
  {
    "id": "cd-022",
    "input": {
      "multimodalCoverage": 0.74,
      "modalityFidelity": 0.72,
      "exemplarAlignment": 0.73,
      "iclPrecision": 0.76,
      "textOnlyBreadth": 0.77,
      "baselineOptimism": 0.34,
      "chemistryHardness": 0.32,
      "overclaimRisk": 0.25,
      "discoverBias": "exemplar_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 57.64,
      "modalityScore": 73.52,
      "exemplarScore": 88.9,
      "precisionIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "multimodalContribution": 70.84,
      "textContribution": 45.19,
      "overall": 70.22
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 24.57,
      "modalityScore": 23.84,
      "exemplarScore": 20.54,
      "precisionIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "multimodalContribution": 30.64,
      "textContribution": 46.59,
      "overall": 39.02
    }
  },
  {
    "id": "cd-023",
    "input": {
      "multimodalCoverage": 0.79,
      "modalityFidelity": 0.76,
      "exemplarAlignment": 0.77,
      "iclPrecision": 0.8,
      "textOnlyBreadth": 0.81,
      "baselineOptimism": 0.36,
      "chemistryHardness": 0.33,
      "overclaimRisk": 0.25,
      "discoverBias": "text_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 49.06,
      "modalityScore": 67.38,
      "exemplarScore": 53.76,
      "precisionIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "multimodalContribution": 54.87,
      "textContribution": 48.05,
      "overall": 54.64
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 33.86,
      "modalityScore": 25.27,
      "exemplarScore": 21.93,
      "precisionIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "multimodalContribution": 41.94,
      "textContribution": 71.35,
      "overall": 60.74
    }
  },
  {
    "id": "cd-024",
    "input": {
      "multimodalCoverage": 0.75,
      "modalityFidelity": 0.75,
      "exemplarAlignment": 0.81,
      "iclPrecision": 0.76,
      "textOnlyBreadth": 0.77,
      "baselineOptimism": 0.31,
      "chemistryHardness": 0.25,
      "overclaimRisk": 0.2,
      "discoverBias": "balanced",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 71.56,
      "modalityScore": 75.91,
      "exemplarScore": 79.01,
      "precisionIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "multimodalContribution": 76.67,
      "textContribution": 46.08,
      "overall": 75.16
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 31.21,
      "modalityScore": 23.38,
      "exemplarScore": 20.41,
      "precisionIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "multimodalContribution": 35.95,
      "textContribution": 57.97,
      "overall": 49.93
    }
  },
  {
    "id": "cd-025",
    "input": {
      "multimodalCoverage": 0.79,
      "modalityFidelity": 0.79,
      "exemplarAlignment": 0.77,
      "iclPrecision": 0.8,
      "textOnlyBreadth": 0.8,
      "baselineOptimism": 0.33,
      "chemistryHardness": 0.26,
      "overclaimRisk": 0.21,
      "discoverBias": "multimodal_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 62.53,
      "modalityScore": 79.52,
      "exemplarScore": 54.88,
      "precisionIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "multimodalContribution": 72.71,
      "textContribution": 48.29,
      "overall": 72.31
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 19.5,
      "modalityScore": 24.62,
      "exemplarScore": 21.57,
      "precisionIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "multimodalContribution": 30.37,
      "textContribution": 48.07,
      "overall": 40.84
    }
  },
  {
    "id": "cd-026",
    "input": {
      "multimodalCoverage": 0.83,
      "modalityFidelity": 0.83,
      "exemplarAlignment": 0.8,
      "iclPrecision": 0.83,
      "textOnlyBreadth": 0.84,
      "baselineOptimism": 0.34,
      "chemistryHardness": 0.27,
      "overclaimRisk": 0.22,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 78.52,
      "modalityScore": 83.17,
      "exemplarScore": 80.3,
      "precisionIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "multimodalContribution": 82.15,
      "textContribution": 50.87,
      "overall": 80.52
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 33.17,
      "modalityScore": 25.67,
      "exemplarScore": 22.55,
      "precisionIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "multimodalContribution": 38.9,
      "textContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "cd-027",
    "input": {
      "multimodalCoverage": 0.87,
      "modalityFidelity": 0.81,
      "exemplarAlignment": 0.84,
      "iclPrecision": 0.87,
      "textOnlyBreadth": 0.88,
      "baselineOptimism": 0.3,
      "chemistryHardness": 0.27,
      "overclaimRisk": 0.17,
      "discoverBias": "exemplar_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 67.26,
      "modalityScore": 82.98,
      "exemplarScore": 100,
      "precisionIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "multimodalContribution": 80.38,
      "textContribution": 52.5,
      "overall": 79.36
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 30.78,
      "modalityScore": 24.7,
      "exemplarScore": 21.6,
      "precisionIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "multimodalContribution": 33.38,
      "textContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "cd-028",
    "input": {
      "multimodalCoverage": 0.83,
      "modalityFidelity": 0.86,
      "exemplarAlignment": 0.87,
      "iclPrecision": 0.83,
      "textOnlyBreadth": 0.84,
      "baselineOptimism": 0.31,
      "chemistryHardness": 0.2,
      "overclaimRisk": 0.17,
      "discoverBias": "text_first",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 54.87,
      "modalityScore": 75.3,
      "exemplarScore": 60.62,
      "precisionIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "multimodalContribution": 61.08,
      "textContribution": 51.73,
      "overall": 60.4
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 38.81,
      "modalityScore": 25.25,
      "exemplarScore": 22.37,
      "precisionIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "multimodalContribution": 43.37,
      "textContribution": 72.59,
      "overall": 63.54
    }
  },
  {
    "id": "cd-029",
    "input": {
      "multimodalCoverage": 0.87,
      "modalityFidelity": 0.9,
      "exemplarAlignment": 0.91,
      "iclPrecision": 0.87,
      "textOnlyBreadth": 0.87,
      "baselineOptimism": 0.33,
      "chemistryHardness": 0.2,
      "overclaimRisk": 0.18,
      "discoverBias": "balanced",
      "profile": "multimodal_chemicl"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 83.89,
      "modalityScore": 88.91,
      "exemplarScore": 89.72,
      "precisionIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "multimodalContribution": 88.57,
      "textContribution": 54.16,
      "overall": 86.38
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 36.33,
      "modalityScore": 26.6,
      "exemplarScore": 23.66,
      "precisionIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "multimodalContribution": 40.53,
      "textContribution": 65.08,
      "overall": 57
    }
  },
  {
    "id": "cd-030",
    "input": {
      "multimodalCoverage": 0.91,
      "modalityFidelity": 0.88,
      "exemplarAlignment": 0.87,
      "iclPrecision": 0.91,
      "textOnlyBreadth": 0.91,
      "baselineOptimism": 0.28,
      "chemistryHardness": 0.21,
      "overclaimRisk": 0.13,
      "discoverBias": "multimodal_first",
      "profile": "text_only_icl_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_chemicl",
      "coverageScore": 71.59,
      "modalityScore": 88.77,
      "exemplarScore": 63.26,
      "precisionIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "multimodalContribution": 79.63,
      "textContribution": 55.31,
      "overall": 79.25
    },
    "expectedTextOnly": {
      "mode": "text_only_icl_baseline",
      "coverageScore": 25.72,
      "modalityScore": 25.06,
      "exemplarScore": 22.14,
      "precisionIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "multimodalContribution": 32.83,
      "textContribution": 50.68,
      "overall": 44.29
    }
  }
];
