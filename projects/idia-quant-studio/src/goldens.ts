import type { QuantInput, QuantQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantInput;
  expectedInformed: QuantQuality;
  expectedNaive: QuantQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "iq-001",
    "input": {
      "targetCoverage": 0.29,
      "spectrumInformedness": 0.25,
      "proteinDetectability": 0.28,
      "quantPrecision": 0.34,
      "naiveWindowBreadth": 0.39,
      "baselineOptimism": 0.45,
      "abundanceHardness": 0.59,
      "overclaimRisk": 0.5,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 22.73,
      "spectrumScore": 30.25,
      "detectabilityScore": 23.66,
      "precisionIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "informedContribution": 28.08,
      "naiveContribution": 16.13,
      "overall": 29.93
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 5.76,
      "spectrumScore": 17.31,
      "detectabilityScore": 13.1,
      "precisionIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "informedContribution": 21.9,
      "naiveContribution": 38.71,
      "overall": 27.29
    }
  },
  {
    "id": "iq-002",
    "input": {
      "targetCoverage": 0.33,
      "spectrumInformedness": 0.29,
      "proteinDetectability": 0.32,
      "quantPrecision": 0.38,
      "naiveWindowBreadth": 0.43,
      "baselineOptimism": 0.46,
      "abundanceHardness": 0.6,
      "overclaimRisk": 0.51,
      "quantBias": "target_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 22.36,
      "spectrumScore": 33.9,
      "detectabilityScore": 34.57,
      "precisionIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "informedContribution": 30.65,
      "naiveContribution": 18.79,
      "overall": 32.52
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 2.43,
      "spectrumScore": 18.44,
      "detectabilityScore": 14.13,
      "precisionIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "informedContribution": 20.12,
      "naiveContribution": 34.65,
      "overall": 23.59
    }
  },
  {
    "id": "iq-003",
    "input": {
      "targetCoverage": 0.37,
      "spectrumInformedness": 0.27,
      "proteinDetectability": 0.36,
      "quantPrecision": 0.42,
      "naiveWindowBreadth": 0.46,
      "baselineOptimism": 0.42,
      "abundanceHardness": 0.6,
      "overclaimRisk": 0.46,
      "quantBias": "baseline_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 12.32,
      "spectrumScore": 23.71,
      "detectabilityScore": 21.13,
      "precisionIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "informedContribution": 19.04,
      "naiveContribution": 19.87,
      "overall": 20.19
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 12.17,
      "spectrumScore": 17.32,
      "detectabilityScore": 13.1,
      "precisionIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "informedContribution": 26.17,
      "naiveContribution": 46.7,
      "overall": 34.62
    }
  },
  {
    "id": "iq-004",
    "input": {
      "targetCoverage": 0.33,
      "spectrumInformedness": 0.32,
      "proteinDetectability": 0.39,
      "quantPrecision": 0.38,
      "naiveWindowBreadth": 0.42,
      "baselineOptimism": 0.43,
      "abundanceHardness": 0.53,
      "overclaimRisk": 0.46,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 28.24,
      "spectrumScore": 36.03,
      "detectabilityScore": 33.23,
      "precisionIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "informedContribution": 34.58,
      "naiveContribution": 19.21,
      "overall": 35.81
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 8.7,
      "spectrumScore": 18.01,
      "detectabilityScore": 14.03,
      "precisionIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "informedContribution": 23.26,
      "naiveContribution": 40.33,
      "overall": 29.57
    }
  },
  {
    "id": "iq-005",
    "input": {
      "targetCoverage": 0.37,
      "spectrumInformedness": 0.36,
      "proteinDetectability": 0.35,
      "quantPrecision": 0.42,
      "naiveWindowBreadth": 0.46,
      "baselineOptimism": 0.45,
      "abundanceHardness": 0.53,
      "overclaimRisk": 0.47,
      "quantBias": "informed_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 26.98,
      "spectrumScore": 39.64,
      "detectabilityScore": 21.55,
      "precisionIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "informedContribution": 34.51,
      "naiveContribution": 22.35,
      "overall": 36.32
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 0,
      "spectrumScore": 19.71,
      "detectabilityScore": 15.65,
      "precisionIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "informedContribution": 20.62,
      "naiveContribution": 36.41,
      "overall": 25.88
    }
  },
  {
    "id": "iq-006",
    "input": {
      "targetCoverage": 0.41,
      "spectrumInformedness": 0.34,
      "proteinDetectability": 0.39,
      "quantPrecision": 0.45,
      "naiveWindowBreadth": 0.5,
      "baselineOptimism": 0.4,
      "abundanceHardness": 0.54,
      "overclaimRisk": 0.42,
      "quantBias": "balanced",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 34.06,
      "spectrumScore": 39.5,
      "detectabilityScore": 35.97,
      "precisionIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "informedContribution": 38.93,
      "naiveContribution": 23.51,
      "overall": 40.15
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 11.98,
      "spectrumScore": 18.2,
      "detectabilityScore": 14.2,
      "precisionIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "informedContribution": 25.18,
      "naiveContribution": 43.27,
      "overall": 32.45
    }
  },
  {
    "id": "iq-007",
    "input": {
      "targetCoverage": 0.45,
      "spectrumInformedness": 0.38,
      "proteinDetectability": 0.42,
      "quantPrecision": 0.49,
      "naiveWindowBreadth": 0.53,
      "baselineOptimism": 0.42,
      "abundanceHardness": 0.55,
      "overclaimRisk": 0.43,
      "quantBias": "target_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 31.69,
      "spectrumScore": 43.11,
      "detectabilityScore": 48.5,
      "precisionIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "informedContribution": 40.82,
      "naiveContribution": 25.77,
      "overall": 42.11
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 8.27,
      "spectrumScore": 19.5,
      "detectabilityScore": 15.44,
      "precisionIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "informedContribution": 22.74,
      "naiveContribution": 37.59,
      "overall": 27.34
    }
  },
  {
    "id": "iq-008",
    "input": {
      "targetCoverage": 0.41,
      "spectrumInformedness": 0.43,
      "proteinDetectability": 0.46,
      "quantPrecision": 0.45,
      "naiveWindowBreadth": 0.49,
      "baselineOptimism": 0.43,
      "abundanceHardness": 0.47,
      "overclaimRisk": 0.44,
      "quantBias": "baseline_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 19.41,
      "spectrumScore": 35.43,
      "detectabilityScore": 27.73,
      "precisionIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "informedContribution": 26.76,
      "naiveContribution": 25.34,
      "overall": 27.5
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 16.4,
      "spectrumScore": 20.32,
      "detectabilityScore": 16.53,
      "precisionIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "informedContribution": 29.38,
      "naiveContribution": 51.02,
      "overall": 39.86
    }
  },
  {
    "id": "iq-009",
    "input": {
      "targetCoverage": 0.46,
      "spectrumInformedness": 0.41,
      "proteinDetectability": 0.5,
      "quantPrecision": 0.49,
      "naiveWindowBreadth": 0.53,
      "baselineOptimism": 0.39,
      "abundanceHardness": 0.48,
      "overclaimRisk": 0.38,
      "quantBias": "balanced",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 40.13,
      "spectrumScore": 45.49,
      "detectabilityScore": 45.77,
      "precisionIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "informedContribution": 45.74,
      "naiveContribution": 26.78,
      "overall": 46.33
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 14.91,
      "spectrumScore": 19.18,
      "detectabilityScore": 15.47,
      "precisionIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "informedContribution": 26.76,
      "naiveContribution": 45.32,
      "overall": 35.12
    }
  },
  {
    "id": "iq-010",
    "input": {
      "targetCoverage": 0.5,
      "spectrumInformedness": 0.45,
      "proteinDetectability": 0.46,
      "quantPrecision": 0.53,
      "naiveWindowBreadth": 0.57,
      "baselineOptimism": 0.4,
      "abundanceHardness": 0.49,
      "overclaimRisk": 0.39,
      "quantBias": "informed_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 36.69,
      "spectrumScore": 49.14,
      "detectabilityScore": 30.74,
      "precisionIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "informedContribution": 44.64,
      "naiveContribution": 29.41,
      "overall": 45.9
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 3.59,
      "spectrumScore": 20.29,
      "detectabilityScore": 16.48,
      "precisionIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "informedContribution": 22.59,
      "naiveContribution": 39.09,
      "overall": 29.2
    }
  },
  {
    "id": "iq-011",
    "input": {
      "targetCoverage": 0.54,
      "spectrumInformedness": 0.49,
      "proteinDetectability": 0.49,
      "quantPrecision": 0.57,
      "naiveWindowBreadth": 0.6,
      "baselineOptimism": 0.42,
      "abundanceHardness": 0.49,
      "overclaimRisk": 0.4,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 47.29,
      "spectrumScore": 52.75,
      "detectabilityScore": 47.28,
      "precisionIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "informedContribution": 51.45,
      "naiveContribution": 31.9,
      "overall": 51.93
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 17.1,
      "spectrumScore": 21.73,
      "detectabilityScore": 17.88,
      "precisionIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "informedContribution": 29.88,
      "naiveContribution": 50.58,
      "overall": 39.71
    }
  },
  {
    "id": "iq-012",
    "input": {
      "targetCoverage": 0.5,
      "spectrumInformedness": 0.48,
      "proteinDetectability": 0.53,
      "quantPrecision": 0.53,
      "naiveWindowBreadth": 0.56,
      "baselineOptimism": 0.37,
      "abundanceHardness": 0.42,
      "overclaimRisk": 0.35,
      "quantBias": "target_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 38.25,
      "spectrumScore": 51.28,
      "detectabilityScore": 62.01,
      "precisionIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "informedContribution": 49.26,
      "naiveContribution": 29.77,
      "overall": 49.75
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 13.23,
      "spectrumScore": 19.78,
      "detectabilityScore": 16.29,
      "precisionIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "informedContribution": 24,
      "naiveContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "iq-013",
    "input": {
      "targetCoverage": 0.54,
      "spectrumInformedness": 0.52,
      "proteinDetectability": 0.56,
      "quantPrecision": 0.57,
      "naiveWindowBreadth": 0.6,
      "baselineOptimism": 0.39,
      "abundanceHardness": 0.42,
      "overclaimRisk": 0.36,
      "quantBias": "baseline_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 29.19,
      "spectrumScore": 44.88,
      "detectabilityScore": 36.66,
      "precisionIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "informedContribution": 35.81,
      "naiveContribution": 32.88,
      "overall": 36.28
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 22.62,
      "spectrumScore": 21.45,
      "detectabilityScore": 17.86,
      "precisionIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "informedContribution": 33.34,
      "naiveContribution": 57.32,
      "overall": 46.52
    }
  },
  {
    "id": "iq-014",
    "input": {
      "targetCoverage": 0.58,
      "spectrumInformedness": 0.56,
      "proteinDetectability": 0.6,
      "quantPrecision": 0.61,
      "naiveWindowBreadth": 0.63,
      "baselineOptimism": 0.4,
      "abundanceHardness": 0.43,
      "overclaimRisk": 0.36,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 52.7,
      "spectrumScore": 58.53,
      "detectabilityScore": 56.74,
      "precisionIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "informedContribution": 57.91,
      "naiveContribution": 34.87,
      "overall": 57.76
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 20.03,
      "spectrumScore": 22.29,
      "detectabilityScore": 18.65,
      "precisionIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "informedContribution": 31.18,
      "naiveContribution": 52.13,
      "overall": 41.92
    }
  },
  {
    "id": "iq-015",
    "input": {
      "targetCoverage": 0.62,
      "spectrumInformedness": 0.54,
      "proteinDetectability": 0.56,
      "quantPrecision": 0.65,
      "naiveWindowBreadth": 0.67,
      "baselineOptimism": 0.36,
      "abundanceHardness": 0.44,
      "overclaimRisk": 0.31,
      "quantBias": "informed_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 45.96,
      "spectrumScore": 58.35,
      "detectabilityScore": 39.38,
      "precisionIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "informedContribution": 54.57,
      "naiveContribution": 36.3,
      "overall": 55.28
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 9.43,
      "spectrumScore": 21.24,
      "detectabilityScore": 17.6,
      "precisionIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "informedContribution": 25.15,
      "naiveContribution": 41.95,
      "overall": 32.87
    }
  },
  {
    "id": "iq-016",
    "input": {
      "targetCoverage": 0.58,
      "spectrumInformedness": 0.59,
      "proteinDetectability": 0.6,
      "quantPrecision": 0.6,
      "naiveWindowBreadth": 0.63,
      "baselineOptimism": 0.37,
      "abundanceHardness": 0.36,
      "overclaimRisk": 0.32,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 54.5,
      "spectrumScore": 60.67,
      "detectabilityScore": 57.91,
      "precisionIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "informedContribution": 59.26,
      "naiveContribution": 35.81,
      "overall": 59.04
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 22.05,
      "spectrumScore": 21.96,
      "detectabilityScore": 18.63,
      "precisionIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "informedContribution": 31.3,
      "naiveContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "iq-017",
    "input": {
      "targetCoverage": 0.62,
      "spectrumInformedness": 0.63,
      "proteinDetectability": 0.63,
      "quantPrecision": 0.64,
      "naiveWindowBreadth": 0.67,
      "baselineOptimism": 0.39,
      "abundanceHardness": 0.37,
      "overclaimRisk": 0.33,
      "quantBias": "target_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 48.47,
      "spectrumScore": 64.28,
      "detectabilityScore": 75.18,
      "precisionIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "informedContribution": 60.69,
      "naiveContribution": 38.66,
      "overall": 60.72
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 18.73,
      "spectrumScore": 23.48,
      "detectabilityScore": 20.01,
      "precisionIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "informedContribution": 28.44,
      "naiveContribution": 44.27,
      "overall": 35.85
    }
  },
  {
    "id": "iq-018",
    "input": {
      "targetCoverage": 0.66,
      "spectrumInformedness": 0.61,
      "proteinDetectability": 0.67,
      "quantPrecision": 0.68,
      "naiveWindowBreadth": 0.7,
      "baselineOptimism": 0.34,
      "abundanceHardness": 0.38,
      "overclaimRisk": 0.27,
      "quantBias": "baseline_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 38.37,
      "spectrumScore": 54.13,
      "detectabilityScore": 45.57,
      "precisionIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "informedContribution": 44.55,
      "naiveContribution": 39.21,
      "overall": 44.59
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 28.36,
      "spectrumScore": 21.72,
      "detectabilityScore": 18.33,
      "precisionIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "informedContribution": 36.47,
      "naiveContribution": 62.28,
      "overall": 51.94
    }
  },
  {
    "id": "iq-019",
    "input": {
      "targetCoverage": 0.7,
      "spectrumInformedness": 0.65,
      "proteinDetectability": 0.7,
      "quantPrecision": 0.72,
      "naiveWindowBreadth": 0.74,
      "baselineOptimism": 0.36,
      "abundanceHardness": 0.38,
      "overclaimRisk": 0.28,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 63.85,
      "spectrumScore": 67.74,
      "detectabilityScore": 68.21,
      "precisionIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "informedContribution": 68.47,
      "naiveContribution": 42.3,
      "overall": 67.76
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 26.25,
      "spectrumScore": 23.38,
      "detectabilityScore": 19.89,
      "precisionIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "informedContribution": 34.65,
      "naiveContribution": 57.03,
      "overall": 47.39
    }
  },
  {
    "id": "iq-020",
    "input": {
      "targetCoverage": 0.66,
      "spectrumInformedness": 0.7,
      "proteinDetectability": 0.66,
      "quantPrecision": 0.68,
      "naiveWindowBreadth": 0.7,
      "baselineOptimism": 0.37,
      "abundanceHardness": 0.31,
      "overclaimRisk": 0.29,
      "quantBias": "informed_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 52.89,
      "spectrumScore": 70.06,
      "detectabilityScore": 45.78,
      "precisionIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "informedContribution": 62.48,
      "naiveContribution": 41.57,
      "overall": 62.72
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 13.66,
      "spectrumScore": 23.97,
      "detectabilityScore": 20.71,
      "precisionIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "informedContribution": 27.94,
      "naiveContribution": 45.32,
      "overall": 37.28
    }
  },
  {
    "id": "iq-021",
    "input": {
      "targetCoverage": 0.7,
      "spectrumInformedness": 0.68,
      "proteinDetectability": 0.7,
      "quantPrecision": 0.72,
      "naiveWindowBreadth": 0.73,
      "baselineOptimism": 0.33,
      "abundanceHardness": 0.31,
      "overclaimRisk": 0.24,
      "quantBias": "balanced",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 65.63,
      "spectrumScore": 69.88,
      "detectabilityScore": 69.36,
      "precisionIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "informedContribution": 69.94,
      "naiveContribution": 42.58,
      "overall": 69.02
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 27.89,
      "spectrumScore": 22.77,
      "detectabilityScore": 19.58,
      "precisionIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "informedContribution": 34.36,
      "naiveContribution": 55.95,
      "overall": 47.28
    }
  },
  {
    "id": "iq-022",
    "input": {
      "targetCoverage": 0.74,
      "spectrumInformedness": 0.72,
      "proteinDetectability": 0.73,
      "quantPrecision": 0.76,
      "naiveWindowBreadth": 0.77,
      "baselineOptimism": 0.34,
      "abundanceHardness": 0.32,
      "overclaimRisk": 0.25,
      "quantBias": "target_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 57.64,
      "spectrumScore": 73.52,
      "detectabilityScore": 88.9,
      "precisionIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "informedContribution": 70.84,
      "naiveContribution": 45.19,
      "overall": 70.22
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 24.57,
      "spectrumScore": 23.84,
      "detectabilityScore": 20.54,
      "precisionIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "informedContribution": 30.64,
      "naiveContribution": 46.59,
      "overall": 39.02
    }
  },
  {
    "id": "iq-023",
    "input": {
      "targetCoverage": 0.79,
      "spectrumInformedness": 0.76,
      "proteinDetectability": 0.77,
      "quantPrecision": 0.8,
      "naiveWindowBreadth": 0.81,
      "baselineOptimism": 0.36,
      "abundanceHardness": 0.33,
      "overclaimRisk": 0.25,
      "quantBias": "baseline_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 49.06,
      "spectrumScore": 67.38,
      "detectabilityScore": 53.76,
      "precisionIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "informedContribution": 54.87,
      "naiveContribution": 48.05,
      "overall": 54.64
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 33.86,
      "spectrumScore": 25.27,
      "detectabilityScore": 21.93,
      "precisionIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "informedContribution": 41.94,
      "naiveContribution": 71.35,
      "overall": 60.74
    }
  },
  {
    "id": "iq-024",
    "input": {
      "targetCoverage": 0.75,
      "spectrumInformedness": 0.75,
      "proteinDetectability": 0.81,
      "quantPrecision": 0.76,
      "naiveWindowBreadth": 0.77,
      "baselineOptimism": 0.31,
      "abundanceHardness": 0.25,
      "overclaimRisk": 0.2,
      "quantBias": "balanced",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 71.56,
      "spectrumScore": 75.91,
      "detectabilityScore": 79.01,
      "precisionIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "informedContribution": 76.67,
      "naiveContribution": 46.08,
      "overall": 75.16
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 31.21,
      "spectrumScore": 23.38,
      "detectabilityScore": 20.41,
      "precisionIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "informedContribution": 35.95,
      "naiveContribution": 57.97,
      "overall": 49.93
    }
  },
  {
    "id": "iq-025",
    "input": {
      "targetCoverage": 0.79,
      "spectrumInformedness": 0.79,
      "proteinDetectability": 0.77,
      "quantPrecision": 0.8,
      "naiveWindowBreadth": 0.8,
      "baselineOptimism": 0.33,
      "abundanceHardness": 0.26,
      "overclaimRisk": 0.21,
      "quantBias": "informed_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 62.53,
      "spectrumScore": 79.52,
      "detectabilityScore": 54.88,
      "precisionIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "informedContribution": 72.71,
      "naiveContribution": 48.29,
      "overall": 72.31
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 19.5,
      "spectrumScore": 24.62,
      "detectabilityScore": 21.57,
      "precisionIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "informedContribution": 30.37,
      "naiveContribution": 48.07,
      "overall": 40.84
    }
  },
  {
    "id": "iq-026",
    "input": {
      "targetCoverage": 0.83,
      "spectrumInformedness": 0.83,
      "proteinDetectability": 0.8,
      "quantPrecision": 0.83,
      "naiveWindowBreadth": 0.84,
      "baselineOptimism": 0.34,
      "abundanceHardness": 0.27,
      "overclaimRisk": 0.22,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 78.52,
      "spectrumScore": 83.17,
      "detectabilityScore": 80.3,
      "precisionIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "informedContribution": 82.15,
      "naiveContribution": 50.87,
      "overall": 80.52
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 33.17,
      "spectrumScore": 25.67,
      "detectabilityScore": 22.55,
      "precisionIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "informedContribution": 38.9,
      "naiveContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "iq-027",
    "input": {
      "targetCoverage": 0.87,
      "spectrumInformedness": 0.81,
      "proteinDetectability": 0.84,
      "quantPrecision": 0.87,
      "naiveWindowBreadth": 0.88,
      "baselineOptimism": 0.3,
      "abundanceHardness": 0.27,
      "overclaimRisk": 0.17,
      "quantBias": "target_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 67.26,
      "spectrumScore": 82.98,
      "detectabilityScore": 100,
      "precisionIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "informedContribution": 80.38,
      "naiveContribution": 52.5,
      "overall": 79.36
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 30.78,
      "spectrumScore": 24.7,
      "detectabilityScore": 21.6,
      "precisionIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "informedContribution": 33.38,
      "naiveContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "iq-028",
    "input": {
      "targetCoverage": 0.83,
      "spectrumInformedness": 0.86,
      "proteinDetectability": 0.87,
      "quantPrecision": 0.83,
      "naiveWindowBreadth": 0.84,
      "baselineOptimism": 0.31,
      "abundanceHardness": 0.2,
      "overclaimRisk": 0.17,
      "quantBias": "baseline_first",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 54.87,
      "spectrumScore": 75.3,
      "detectabilityScore": 60.62,
      "precisionIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "informedContribution": 61.08,
      "naiveContribution": 51.73,
      "overall": 60.4
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 38.81,
      "spectrumScore": 25.25,
      "detectabilityScore": 22.37,
      "precisionIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "informedContribution": 43.37,
      "naiveContribution": 72.59,
      "overall": 63.54
    }
  },
  {
    "id": "iq-029",
    "input": {
      "targetCoverage": 0.87,
      "spectrumInformedness": 0.9,
      "proteinDetectability": 0.91,
      "quantPrecision": 0.87,
      "naiveWindowBreadth": 0.87,
      "baselineOptimism": 0.33,
      "abundanceHardness": 0.2,
      "overclaimRisk": 0.18,
      "quantBias": "balanced",
      "profile": "informed_dia_quant"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 83.89,
      "spectrumScore": 88.91,
      "detectabilityScore": 89.72,
      "precisionIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "informedContribution": 88.57,
      "naiveContribution": 54.16,
      "overall": 86.38
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 36.33,
      "spectrumScore": 26.6,
      "detectabilityScore": 23.66,
      "precisionIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "informedContribution": 40.53,
      "naiveContribution": 65.08,
      "overall": 57
    }
  },
  {
    "id": "iq-030",
    "input": {
      "targetCoverage": 0.91,
      "spectrumInformedness": 0.88,
      "proteinDetectability": 0.87,
      "quantPrecision": 0.91,
      "naiveWindowBreadth": 0.91,
      "baselineOptimism": 0.28,
      "abundanceHardness": 0.21,
      "overclaimRisk": 0.13,
      "quantBias": "informed_first",
      "profile": "naive_dia_baseline"
    },
    "expectedInformed": {
      "mode": "informed_dia_quant",
      "coverageScore": 71.59,
      "spectrumScore": 88.77,
      "detectabilityScore": 63.26,
      "precisionIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "informedContribution": 79.63,
      "naiveContribution": 55.31,
      "overall": 79.25
    },
    "expectedNaive": {
      "mode": "naive_dia_baseline",
      "coverageScore": 25.72,
      "spectrumScore": 25.06,
      "detectabilityScore": 22.14,
      "precisionIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "informedContribution": 32.83,
      "naiveContribution": 50.68,
      "overall": 44.29
    }
  }
];
