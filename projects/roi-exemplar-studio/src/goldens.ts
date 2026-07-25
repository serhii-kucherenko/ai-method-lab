import type { ExemplarInput, ExemplarQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ExemplarInput;
  expectedOptimized: ExemplarQuality;
  expectedNaive: ExemplarQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "re-001",
    "input": {
      "localizationPrecision": 0.29,
      "coverageBreadth": 0.25,
      "exemplarDiversity": 0.28,
      "promptFit": 0.34,
      "naiveDumpRate": 0.39,
      "naiveOptimism": 0.45,
      "roiHardness": 0.59,
      "overclaimRisk": 0.5,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 22.56,
      "coverageScore": 30.25,
      "diversityScore": 23.49,
      "promptIntegrity": 37.64,
      "naiveBaselineScore": 16.4,
      "confidence": 19.35,
      "optimizedContribution": 27.98,
      "naiveContribution": 15.96,
      "overall": 29.82
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 5.76,
      "coverageScore": 17.09,
      "diversityScore": 13.13,
      "promptIntegrity": 32.39,
      "naiveBaselineScore": 40.93,
      "confidence": 17.1,
      "optimizedContribution": 21.86,
      "naiveContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "re-002",
    "input": {
      "localizationPrecision": 0.33,
      "coverageBreadth": 0.29,
      "exemplarDiversity": 0.32,
      "promptFit": 0.38,
      "naiveDumpRate": 0.43,
      "naiveOptimism": 0.46,
      "roiHardness": 0.6,
      "overclaimRisk": 0.51,
      "exemplarBias": "coverage_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 22.22,
      "coverageScore": 33.9,
      "diversityScore": 17.76,
      "promptIntegrity": 48.93,
      "naiveBaselineScore": 18.89,
      "confidence": 23,
      "optimizedContribution": 29.65,
      "naiveContribution": 18.61,
      "overall": 31.66
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 2.43,
      "coverageScore": 18.22,
      "diversityScore": 14.16,
      "promptIntegrity": 34.08,
      "naiveBaselineScore": 31.53,
      "confidence": 18.65,
      "optimizedContribution": 20.08,
      "naiveContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "re-003",
    "input": {
      "localizationPrecision": 0.37,
      "coverageBreadth": 0.27,
      "exemplarDiversity": 0.36,
      "promptFit": 0.42,
      "naiveDumpRate": 0.46,
      "naiveOptimism": 0.42,
      "roiHardness": 0.6,
      "overclaimRisk": 0.46,
      "exemplarBias": "naive_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 12.18,
      "coverageScore": 23.71,
      "diversityScore": 20.95,
      "promptIntegrity": 19.24,
      "naiveBaselineScore": 19.94,
      "confidence": 25.6,
      "optimizedContribution": 18.96,
      "naiveContribution": 19.69,
      "overall": 20.09
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 12.17,
      "coverageScore": 17.1,
      "diversityScore": 13.13,
      "promptIntegrity": 33.93,
      "naiveBaselineScore": 54.34,
      "confidence": 18.4,
      "optimizedContribution": 26.13,
      "naiveContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "re-004",
    "input": {
      "localizationPrecision": 0.33,
      "coverageBreadth": 0.32,
      "exemplarDiversity": 0.39,
      "promptFit": 0.38,
      "naiveDumpRate": 0.42,
      "naiveOptimism": 0.43,
      "roiHardness": 0.53,
      "overclaimRisk": 0.46,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 28.09,
      "coverageScore": 36.03,
      "diversityScore": 33.07,
      "promptIntegrity": 42.23,
      "naiveBaselineScore": 18.93,
      "confidence": 26.1,
      "optimizedContribution": 34.5,
      "naiveContribution": 19.05,
      "overall": 35.72
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 8.7,
      "coverageScore": 17.81,
      "diversityScore": 13.75,
      "promptIntegrity": 32.79,
      "naiveBaselineScore": 42.77,
      "confidence": 18.85,
      "optimizedContribution": 23.16,
      "naiveContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "re-005",
    "input": {
      "localizationPrecision": 0.37,
      "coverageBreadth": 0.36,
      "exemplarDiversity": 0.35,
      "promptFit": 0.42,
      "naiveDumpRate": 0.46,
      "naiveOptimism": 0.45,
      "roiHardness": 0.53,
      "overclaimRisk": 0.47,
      "exemplarBias": "localization_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 26.86,
      "coverageScore": 39.64,
      "diversityScore": 39.58,
      "promptIntegrity": 35.49,
      "naiveBaselineScore": 21.8,
      "confidence": 27.6,
      "optimizedContribution": 35.39,
      "naiveContribution": 22.19,
      "overall": 37.01
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 0,
      "coverageScore": 19.51,
      "diversityScore": 15.76,
      "promptIntegrity": 34.77,
      "naiveBaselineScore": 32.95,
      "confidence": 21.05,
      "optimizedContribution": 20.6,
      "naiveContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "re-006",
    "input": {
      "localizationPrecision": 0.41,
      "coverageBreadth": 0.34,
      "exemplarDiversity": 0.39,
      "promptFit": 0.45,
      "naiveDumpRate": 0.5,
      "naiveOptimism": 0.4,
      "roiHardness": 0.54,
      "overclaimRisk": 0.42,
      "exemplarBias": "balanced",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 33.94,
      "coverageScore": 39.5,
      "diversityScore": 35.84,
      "promptIntegrity": 47.85,
      "naiveBaselineScore": 23.08,
      "confidence": 30.35,
      "optimizedContribution": 38.87,
      "naiveContribution": 23.38,
      "overall": 40.08
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 11.98,
      "coverageScore": 18.04,
      "diversityScore": 14.31,
      "promptIntegrity": 34.78,
      "naiveBaselineScore": 46.72,
      "confidence": 20.5,
      "optimizedContribution": 25.17,
      "naiveContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "re-007",
    "input": {
      "localizationPrecision": 0.45,
      "coverageBreadth": 0.38,
      "exemplarDiversity": 0.42,
      "promptFit": 0.49,
      "naiveDumpRate": 0.53,
      "naiveOptimism": 0.42,
      "roiHardness": 0.55,
      "overclaimRisk": 0.43,
      "exemplarBias": "coverage_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 31.59,
      "coverageScore": 43.11,
      "diversityScore": 26.54,
      "promptIntegrity": 61.29,
      "naiveBaselineScore": 25.15,
      "confidence": 33.6,
      "optimizedContribution": 39.47,
      "naiveContribution": 25.64,
      "overall": 40.98
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 8.27,
      "coverageScore": 19.34,
      "diversityScore": 15.59,
      "promptIntegrity": 36.3,
      "naiveBaselineScore": 34.2,
      "confidence": 22.15,
      "optimizedContribution": 22.74,
      "naiveContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "re-008",
    "input": {
      "localizationPrecision": 0.41,
      "coverageBreadth": 0.43,
      "exemplarDiversity": 0.46,
      "promptFit": 0.45,
      "naiveDumpRate": 0.49,
      "naiveOptimism": 0.43,
      "roiHardness": 0.47,
      "overclaimRisk": 0.44,
      "exemplarBias": "naive_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 19.33,
      "coverageScore": 35.43,
      "diversityScore": 27.62,
      "promptIntegrity": 24.76,
      "naiveBaselineScore": 24.32,
      "confidence": 34.35,
      "optimizedContribution": 26.71,
      "naiveContribution": 25.23,
      "overall": 27.44
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 16.4,
      "coverageScore": 20.18,
      "diversityScore": 16.31,
      "promptIntegrity": 35.17,
      "naiveBaselineScore": 58.5,
      "confidence": 22.7,
      "optimizedContribution": 29.31,
      "naiveContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "re-009",
    "input": {
      "localizationPrecision": 0.46,
      "coverageBreadth": 0.41,
      "exemplarDiversity": 0.5,
      "promptFit": 0.49,
      "naiveDumpRate": 0.53,
      "naiveOptimism": 0.39,
      "roiHardness": 0.48,
      "overclaimRisk": 0.38,
      "exemplarBias": "balanced",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 40.05,
      "coverageScore": 45.49,
      "diversityScore": 45.68,
      "promptIntegrity": 52.59,
      "naiveBaselineScore": 25.81,
      "confidence": 37.35,
      "optimizedContribution": 45.69,
      "naiveContribution": 26.69,
      "overall": 46.27
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 14.91,
      "coverageScore": 19.07,
      "diversityScore": 15.29,
      "promptIntegrity": 35.36,
      "naiveBaselineScore": 48.88,
      "confidence": 22.7,
      "optimizedContribution": 26.7,
      "naiveContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "re-010",
    "input": {
      "localizationPrecision": 0.5,
      "coverageBreadth": 0.45,
      "exemplarDiversity": 0.46,
      "promptFit": 0.53,
      "naiveDumpRate": 0.57,
      "naiveOptimism": 0.4,
      "roiHardness": 0.49,
      "overclaimRisk": 0.39,
      "exemplarBias": "localization_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 36.62,
      "coverageScore": 49.14,
      "diversityScore": 54.56,
      "promptIntegrity": 43.07,
      "naiveBaselineScore": 28.29,
      "confidence": 39,
      "optimizedContribution": 46.07,
      "naiveContribution": 29.32,
      "overall": 47.06
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 3.59,
      "coverageScore": 20.18,
      "diversityScore": 16.7,
      "promptIntegrity": 37.06,
      "naiveBaselineScore": 35.54,
      "confidence": 24.25,
      "optimizedContribution": 22.61,
      "naiveContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "re-011",
    "input": {
      "localizationPrecision": 0.54,
      "coverageBreadth": 0.49,
      "exemplarDiversity": 0.49,
      "promptFit": 0.57,
      "naiveDumpRate": 0.6,
      "naiveOptimism": 0.42,
      "roiHardness": 0.49,
      "overclaimRisk": 0.4,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 47.21,
      "coverageScore": 52.75,
      "diversityScore": 47.19,
      "promptIntegrity": 60.27,
      "naiveBaselineScore": 30.54,
      "confidence": 42.25,
      "optimizedContribution": 51.41,
      "naiveContribution": 31.82,
      "overall": 51.88
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 17.1,
      "coverageScore": 21.62,
      "diversityScore": 18.14,
      "promptIntegrity": 38.58,
      "naiveBaselineScore": 54.12,
      "confidence": 26.1,
      "optimizedContribution": 29.91,
      "naiveContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "re-012",
    "input": {
      "localizationPrecision": 0.5,
      "coverageBreadth": 0.48,
      "exemplarDiversity": 0.53,
      "promptFit": 0.53,
      "naiveDumpRate": 0.56,
      "naiveOptimism": 0.37,
      "roiHardness": 0.42,
      "overclaimRisk": 0.35,
      "exemplarBias": "coverage_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 38.19,
      "coverageScore": 51.28,
      "diversityScore": 34.4,
      "promptIntegrity": 67.57,
      "naiveBaselineScore": 28.34,
      "confidence": 42.1,
      "optimizedContribution": 46.73,
      "naiveContribution": 29.7,
      "overall": 47.66
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 13.23,
      "coverageScore": 19.68,
      "diversityScore": 16.17,
      "promptIntegrity": 35.76,
      "naiveBaselineScore": 34.93,
      "confidence": 24.35,
      "optimizedContribution": 23.95,
      "naiveContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "re-013",
    "input": {
      "localizationPrecision": 0.54,
      "coverageBreadth": 0.52,
      "exemplarDiversity": 0.56,
      "promptFit": 0.57,
      "naiveDumpRate": 0.6,
      "naiveOptimism": 0.39,
      "roiHardness": 0.42,
      "overclaimRisk": 0.36,
      "exemplarBias": "naive_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 29.13,
      "coverageScore": 44.88,
      "diversityScore": 36.59,
      "promptIntegrity": 32.66,
      "naiveBaselineScore": 31.2,
      "confidence": 45.35,
      "optimizedContribution": 35.78,
      "naiveContribution": 32.8,
      "overall": 36.24
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 22.62,
      "coverageScore": 21.35,
      "diversityScore": 17.8,
      "promptIntegrity": 37.74,
      "naiveBaselineScore": 67.02,
      "confidence": 26.55,
      "optimizedContribution": 33.31,
      "naiveContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "re-014",
    "input": {
      "localizationPrecision": 0.58,
      "coverageBreadth": 0.56,
      "exemplarDiversity": 0.6,
      "promptFit": 0.61,
      "naiveDumpRate": 0.63,
      "naiveOptimism": 0.4,
      "roiHardness": 0.43,
      "overclaimRisk": 0.36,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 52.62,
      "coverageScore": 58.53,
      "diversityScore": 56.66,
      "promptIntegrity": 64.86,
      "naiveBaselineScore": 33.07,
      "confidence": 49,
      "optimizedContribution": 57.86,
      "naiveContribution": 34.8,
      "overall": 57.71
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 20.03,
      "coverageScore": 22.2,
      "diversityScore": 18.59,
      "promptIntegrity": 38.98,
      "naiveBaselineScore": 55.96,
      "confidence": 27.85,
      "optimizedContribution": 31.15,
      "naiveContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "re-015",
    "input": {
      "localizationPrecision": 0.62,
      "coverageBreadth": 0.54,
      "exemplarDiversity": 0.56,
      "promptFit": 0.65,
      "naiveDumpRate": 0.67,
      "naiveOptimism": 0.36,
      "roiHardness": 0.44,
      "overclaimRisk": 0.31,
      "exemplarBias": "localization_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 45.9,
      "coverageScore": 58.35,
      "diversityScore": 68.41,
      "promptIntegrity": 50.82,
      "naiveBaselineScore": 34.55,
      "confidence": 49.6,
      "optimizedContribution": 56.27,
      "naiveContribution": 36.22,
      "overall": 56.66
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 9.43,
      "coverageScore": 21.14,
      "diversityScore": 17.93,
      "promptIntegrity": 39.27,
      "naiveBaselineScore": 38.2,
      "confidence": 27.75,
      "optimizedContribution": 25.19,
      "naiveContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "re-016",
    "input": {
      "localizationPrecision": 0.58,
      "coverageBreadth": 0.59,
      "exemplarDiversity": 0.6,
      "promptFit": 0.6,
      "naiveDumpRate": 0.63,
      "naiveOptimism": 0.37,
      "roiHardness": 0.36,
      "overclaimRisk": 0.32,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 54.46,
      "coverageScore": 60.67,
      "diversityScore": 57.87,
      "promptIntegrity": 65.05,
      "naiveBaselineScore": 33.73,
      "confidence": 50.35,
      "optimizedContribution": 59.24,
      "naiveContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 22.05,
      "coverageScore": 21.91,
      "diversityScore": 18.56,
      "promptIntegrity": 38.14,
      "naiveBaselineScore": 55.7,
      "confidence": 28.3,
      "optimizedContribution": 31.27,
      "naiveContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "re-017",
    "input": {
      "localizationPrecision": 0.62,
      "coverageBreadth": 0.63,
      "exemplarDiversity": 0.63,
      "promptFit": 0.64,
      "naiveDumpRate": 0.67,
      "naiveOptimism": 0.39,
      "roiHardness": 0.37,
      "overclaimRisk": 0.33,
      "exemplarBias": "coverage_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 48.43,
      "coverageScore": 64.28,
      "diversityScore": 42.4,
      "promptIntegrity": 81.43,
      "naiveBaselineScore": 36.41,
      "confidence": 53.6,
      "optimizedContribution": 57.81,
      "naiveContribution": 38.61,
      "overall": 58.35
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 18.73,
      "coverageScore": 23.42,
      "diversityScore": 20,
      "promptIntegrity": 40.11,
      "naiveBaselineScore": 39.86,
      "confidence": 30.3,
      "optimizedContribution": 28.42,
      "naiveContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "re-018",
    "input": {
      "localizationPrecision": 0.66,
      "coverageBreadth": 0.61,
      "exemplarDiversity": 0.67,
      "promptFit": 0.68,
      "naiveDumpRate": 0.7,
      "naiveOptimism": 0.34,
      "roiHardness": 0.38,
      "overclaimRisk": 0.27,
      "exemplarBias": "naive_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 38.33,
      "coverageScore": 54.13,
      "diversityScore": 45.52,
      "promptIntegrity": 40.09,
      "naiveBaselineScore": 37.08,
      "confidence": 56.35,
      "optimizedContribution": 44.52,
      "naiveContribution": 39.16,
      "overall": 44.56
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 28.36,
      "coverageScore": 21.66,
      "diversityScore": 18.31,
      "promptIntegrity": 39.67,
      "naiveBaselineScore": 74.27,
      "confidence": 29.5,
      "optimizedContribution": 36.45,
      "naiveContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "re-019",
    "input": {
      "localizationPrecision": 0.7,
      "coverageBreadth": 0.65,
      "exemplarDiversity": 0.7,
      "promptFit": 0.72,
      "naiveDumpRate": 0.74,
      "naiveOptimism": 0.36,
      "roiHardness": 0.38,
      "overclaimRisk": 0.28,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 63.81,
      "coverageScore": 67.74,
      "diversityScore": 68.17,
      "promptIntegrity": 75.07,
      "naiveBaselineScore": 39.94,
      "confidence": 59.6,
      "optimizedContribution": 68.45,
      "naiveContribution": 42.25,
      "overall": 67.73
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 26.25,
      "coverageScore": 23.32,
      "diversityScore": 19.92,
      "promptIntegrity": 41.65,
      "naiveBaselineScore": 62.07,
      "confidence": 31.7,
      "optimizedContribution": 34.64,
      "naiveContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "re-020",
    "input": {
      "localizationPrecision": 0.66,
      "coverageBreadth": 0.7,
      "exemplarDiversity": 0.66,
      "promptFit": 0.68,
      "naiveDumpRate": 0.7,
      "naiveOptimism": 0.37,
      "roiHardness": 0.31,
      "overclaimRisk": 0.29,
      "exemplarBias": "localization_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 52.86,
      "coverageScore": 70.06,
      "diversityScore": 80.04,
      "promptIntegrity": 56.34,
      "naiveBaselineScore": 38.94,
      "confidence": 58.35,
      "optimizedContribution": 65.36,
      "naiveContribution": 41.54,
      "overall": 65.07
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 13.66,
      "coverageScore": 23.93,
      "diversityScore": 20.75,
      "promptIntegrity": 40.51,
      "naiveBaselineScore": 40.86,
      "confidence": 32.05,
      "optimizedContribution": 27.94,
      "naiveContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "re-021",
    "input": {
      "localizationPrecision": 0.7,
      "coverageBreadth": 0.68,
      "exemplarDiversity": 0.7,
      "promptFit": 0.72,
      "naiveDumpRate": 0.73,
      "naiveOptimism": 0.33,
      "roiHardness": 0.31,
      "overclaimRisk": 0.24,
      "exemplarBias": "balanced",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 65.6,
      "coverageScore": 69.88,
      "diversityScore": 69.32,
      "promptIntegrity": 75.82,
      "naiveBaselineScore": 39.99,
      "confidence": 60.95,
      "optimizedContribution": 69.92,
      "naiveContribution": 42.54,
      "overall": 68.99
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 27.89,
      "coverageScore": 22.72,
      "diversityScore": 19.62,
      "promptIntegrity": 40.35,
      "naiveBaselineScore": 61.19,
      "confidence": 31.8,
      "optimizedContribution": 34.35,
      "naiveContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "re-022",
    "input": {
      "localizationPrecision": 0.74,
      "coverageBreadth": 0.72,
      "exemplarDiversity": 0.73,
      "promptFit": 0.76,
      "naiveDumpRate": 0.77,
      "naiveOptimism": 0.34,
      "roiHardness": 0.32,
      "overclaimRisk": 0.25,
      "exemplarBias": "coverage_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 57.62,
      "coverageScore": 73.52,
      "diversityScore": 50.92,
      "promptIntegrity": 94.56,
      "naiveBaselineScore": 42.47,
      "confidence": 64.35,
      "optimizedContribution": 67.69,
      "naiveContribution": 45.15,
      "overall": 67.63
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 24.57,
      "coverageScore": 23.79,
      "diversityScore": 20.63,
      "promptIntegrity": 42.05,
      "naiveBaselineScore": 42.21,
      "confidence": 33.35,
      "optimizedContribution": 30.65,
      "naiveContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "re-023",
    "input": {
      "localizationPrecision": 0.79,
      "coverageBreadth": 0.76,
      "exemplarDiversity": 0.77,
      "promptFit": 0.8,
      "naiveDumpRate": 0.81,
      "naiveOptimism": 0.36,
      "roiHardness": 0.33,
      "overclaimRisk": 0.25,
      "exemplarBias": "naive_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 49.04,
      "coverageScore": 67.38,
      "diversityScore": 53.74,
      "promptIntegrity": 49.49,
      "naiveBaselineScore": 45.16,
      "confidence": 68.25,
      "optimizedContribution": 54.86,
      "naiveContribution": 48.03,
      "overall": 54.63
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 33.86,
      "coverageScore": 25.25,
      "diversityScore": 22.05,
      "promptIntegrity": 43.92,
      "naiveBaselineScore": 84.72,
      "confidence": 35.45,
      "optimizedContribution": 41.96,
      "naiveContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "re-024",
    "input": {
      "localizationPrecision": 0.75,
      "coverageBreadth": 0.75,
      "exemplarDiversity": 0.81,
      "promptFit": 0.76,
      "naiveDumpRate": 0.77,
      "naiveOptimism": 0.31,
      "roiHardness": 0.25,
      "overclaimRisk": 0.2,
      "exemplarBias": "balanced",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 71.55,
      "coverageScore": 75.91,
      "diversityScore": 78.99,
      "promptIntegrity": 80.56,
      "naiveBaselineScore": 43.13,
      "confidence": 68.1,
      "optimizedContribution": 76.66,
      "naiveContribution": 46.07,
      "overall": 75.15
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 31.21,
      "coverageScore": 23.36,
      "diversityScore": 20.13,
      "promptIntegrity": 41.11,
      "naiveBaselineScore": 63.65,
      "confidence": 33.9,
      "optimizedContribution": 35.89,
      "naiveContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "re-025",
    "input": {
      "localizationPrecision": 0.79,
      "coverageBreadth": 0.79,
      "exemplarDiversity": 0.77,
      "promptFit": 0.8,
      "naiveDumpRate": 0.8,
      "naiveOptimism": 0.33,
      "roiHardness": 0.26,
      "overclaimRisk": 0.21,
      "exemplarBias": "localization_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 62.51,
      "coverageScore": 79.52,
      "diversityScore": 94.88,
      "promptIntegrity": 64.24,
      "naiveBaselineScore": 45.2,
      "confidence": 69.6,
      "optimizedContribution": 76.04,
      "naiveContribution": 48.27,
      "overall": 75.04
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 19.5,
      "coverageScore": 24.6,
      "diversityScore": 21.69,
      "promptIntegrity": 42.63,
      "naiveBaselineScore": 43.52,
      "confidence": 35.55,
      "optimizedContribution": 30.39,
      "naiveContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "re-026",
    "input": {
      "localizationPrecision": 0.83,
      "coverageBreadth": 0.83,
      "exemplarDiversity": 0.8,
      "promptFit": 0.83,
      "naiveDumpRate": 0.84,
      "naiveOptimism": 0.34,
      "roiHardness": 0.27,
      "overclaimRisk": 0.22,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 78.52,
      "coverageScore": 83.17,
      "diversityScore": 80.3,
      "promptIntegrity": 87.68,
      "naiveBaselineScore": 47.68,
      "confidence": 73,
      "optimizedContribution": 82.15,
      "naiveContribution": 50.87,
      "overall": 80.52
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 33.17,
      "coverageScore": 25.67,
      "diversityScore": 22.7,
      "promptIntegrity": 44.32,
      "naiveBaselineScore": 68.8,
      "confidence": 37.1,
      "optimizedContribution": 38.93,
      "naiveContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "re-027",
    "input": {
      "localizationPrecision": 0.87,
      "coverageBreadth": 0.81,
      "exemplarDiversity": 0.84,
      "promptFit": 0.87,
      "naiveDumpRate": 0.88,
      "naiveOptimism": 0.3,
      "roiHardness": 0.27,
      "overclaimRisk": 0.17,
      "exemplarBias": "coverage_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 67.26,
      "coverageScore": 82.98,
      "diversityScore": 60.03,
      "promptIntegrity": 100,
      "naiveBaselineScore": 49.35,
      "confidence": 75.6,
      "optimizedContribution": 76.21,
      "naiveContribution": 52.5,
      "overall": 75.94
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 30.78,
      "coverageScore": 24.7,
      "diversityScore": 21.75,
      "promptIntegrity": 44.62,
      "naiveBaselineScore": 45.22,
      "confidence": 37.2,
      "optimizedContribution": 33.41,
      "naiveContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "re-028",
    "input": {
      "localizationPrecision": 0.83,
      "coverageBreadth": 0.86,
      "exemplarDiversity": 0.87,
      "promptFit": 0.83,
      "naiveDumpRate": 0.84,
      "naiveOptimism": 0.31,
      "roiHardness": 0.2,
      "overclaimRisk": 0.17,
      "exemplarBias": "naive_first",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 54.87,
      "coverageScore": 75.3,
      "diversityScore": 60.62,
      "promptIntegrity": 53.51,
      "naiveBaselineScore": 48.34,
      "confidence": 76.1,
      "optimizedContribution": 61.08,
      "naiveContribution": 51.73,
      "overall": 60.4
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 38.81,
      "coverageScore": 25.25,
      "diversityScore": 22.17,
      "promptIntegrity": 43.48,
      "naiveBaselineScore": 86.95,
      "confidence": 37.65,
      "optimizedContribution": 43.33,
      "naiveContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "re-029",
    "input": {
      "localizationPrecision": 0.87,
      "coverageBreadth": 0.9,
      "exemplarDiversity": 0.91,
      "promptFit": 0.87,
      "naiveDumpRate": 0.87,
      "naiveOptimism": 0.33,
      "roiHardness": 0.2,
      "overclaimRisk": 0.18,
      "exemplarBias": "balanced",
      "profile": "optimized_incontext_exemplars"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 83.89,
      "coverageScore": 88.91,
      "diversityScore": 89.72,
      "promptIntegrity": 92.27,
      "naiveBaselineScore": 50.59,
      "confidence": 79.6,
      "optimizedContribution": 88.57,
      "naiveContribution": 54.16,
      "overall": 86.38
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 36.33,
      "coverageScore": 26.6,
      "diversityScore": 23.46,
      "promptIntegrity": 45,
      "naiveBaselineScore": 71.06,
      "confidence": 39.5,
      "optimizedContribution": 40.49,
      "naiveContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "re-030",
    "input": {
      "localizationPrecision": 0.91,
      "coverageBreadth": 0.88,
      "exemplarDiversity": 0.87,
      "promptFit": 0.91,
      "naiveDumpRate": 0.91,
      "naiveOptimism": 0.28,
      "roiHardness": 0.21,
      "overclaimRisk": 0.13,
      "exemplarBias": "localization_first",
      "profile": "naive_exemplar_baseline"
    },
    "expectedOptimized": {
      "mode": "optimized_incontext_exemplars",
      "localizationScore": 71.59,
      "coverageScore": 88.77,
      "diversityScore": 100,
      "promptIntegrity": 71.68,
      "naiveBaselineScore": 51.88,
      "confidence": 80.35,
      "optimizedContribution": 83.69,
      "naiveContribution": 55.31,
      "overall": 82.58
    },
    "expectedNaive": {
      "mode": "naive_exemplar_baseline",
      "localizationScore": 25.72,
      "coverageScore": 25.06,
      "diversityScore": 22.34,
      "promptIntegrity": 45.02,
      "naiveBaselineScore": 46.21,
      "confidence": 38.95,
      "optimizedContribution": 32.87,
      "naiveContribution": 50.68,
      "overall": 44.3
    }
  }
];
