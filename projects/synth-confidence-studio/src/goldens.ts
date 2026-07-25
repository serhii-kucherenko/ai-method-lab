import type { SynthInput, SynthQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SynthInput;
  expectedGated: SynthQuality;
  expectedNaive: SynthQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sc-001",
    "input": {
      "packCoverage": 0.29,
      "confidenceFidelity": 0.25,
      "candidateClarity": 0.28,
      "runStability": 0.34,
      "naiveBaselineRate": 0.39,
      "skipOptimism": 0.45,
      "routeHardness": 0.59,
      "overclaimRisk": 0.5,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 22.56,
      "confidenceScore": 30.25,
      "candidateOptScore": 23.49,
      "packIntegrity": 37.64,
      "naiveBaselineScore": 16.4,
      "confidence": 19.35,
      "gatedContribution": 27.98,
      "naiveContribution": 15.96,
      "overall": 29.82
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 5.76,
      "confidenceScore": 17.09,
      "candidateOptScore": 13.13,
      "packIntegrity": 32.39,
      "naiveBaselineScore": 40.93,
      "confidence": 17.1,
      "gatedContribution": 21.86,
      "naiveContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "sc-002",
    "input": {
      "packCoverage": 0.33,
      "confidenceFidelity": 0.29,
      "candidateClarity": 0.32,
      "runStability": 0.38,
      "naiveBaselineRate": 0.43,
      "skipOptimism": 0.46,
      "routeHardness": 0.6,
      "overclaimRisk": 0.51,
      "routeBias": "route_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 22.22,
      "confidenceScore": 33.9,
      "candidateOptScore": 34.39,
      "packIntegrity": 31.9,
      "naiveBaselineScore": 18.89,
      "confidence": 23,
      "gatedContribution": 30.56,
      "naiveContribution": 18.61,
      "overall": 32.41
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 2.43,
      "confidenceScore": 18.22,
      "candidateOptScore": 14.16,
      "packIntegrity": 34.08,
      "naiveBaselineScore": 31.53,
      "confidence": 18.65,
      "gatedContribution": 20.08,
      "naiveContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "sc-003",
    "input": {
      "packCoverage": 0.37,
      "confidenceFidelity": 0.27,
      "candidateClarity": 0.36,
      "runStability": 0.42,
      "naiveBaselineRate": 0.46,
      "skipOptimism": 0.42,
      "routeHardness": 0.6,
      "overclaimRisk": 0.46,
      "routeBias": "naive_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 12.18,
      "confidenceScore": 23.71,
      "candidateOptScore": 20.95,
      "packIntegrity": 19.24,
      "naiveBaselineScore": 19.94,
      "confidence": 25.6,
      "gatedContribution": 18.96,
      "naiveContribution": 19.69,
      "overall": 20.09
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 12.17,
      "confidenceScore": 17.1,
      "candidateOptScore": 13.13,
      "packIntegrity": 33.93,
      "naiveBaselineScore": 54.34,
      "confidence": 18.4,
      "gatedContribution": 26.13,
      "naiveContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "sc-004",
    "input": {
      "packCoverage": 0.33,
      "confidenceFidelity": 0.32,
      "candidateClarity": 0.39,
      "runStability": 0.38,
      "naiveBaselineRate": 0.42,
      "skipOptimism": 0.43,
      "routeHardness": 0.53,
      "overclaimRisk": 0.46,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 28.09,
      "confidenceScore": 36.03,
      "candidateOptScore": 33.07,
      "packIntegrity": 42.23,
      "naiveBaselineScore": 18.93,
      "confidence": 26.1,
      "gatedContribution": 34.5,
      "naiveContribution": 19.05,
      "overall": 35.72
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 8.7,
      "confidenceScore": 17.81,
      "candidateOptScore": 13.75,
      "packIntegrity": 32.79,
      "naiveBaselineScore": 42.77,
      "confidence": 18.85,
      "gatedContribution": 23.16,
      "naiveContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "sc-005",
    "input": {
      "packCoverage": 0.37,
      "confidenceFidelity": 0.36,
      "candidateClarity": 0.35,
      "runStability": 0.42,
      "naiveBaselineRate": 0.46,
      "skipOptimism": 0.45,
      "routeHardness": 0.53,
      "overclaimRisk": 0.47,
      "routeBias": "confidence_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 26.86,
      "confidenceScore": 39.64,
      "candidateOptScore": 21.39,
      "packIntegrity": 54.3,
      "naiveBaselineScore": 21.8,
      "confidence": 27.6,
      "gatedContribution": 34.43,
      "naiveContribution": 22.19,
      "overall": 36.23
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 0,
      "confidenceScore": 19.51,
      "candidateOptScore": 15.76,
      "packIntegrity": 34.77,
      "naiveBaselineScore": 32.95,
      "confidence": 21.05,
      "gatedContribution": 20.6,
      "naiveContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "sc-006",
    "input": {
      "packCoverage": 0.41,
      "confidenceFidelity": 0.34,
      "candidateClarity": 0.39,
      "runStability": 0.45,
      "naiveBaselineRate": 0.5,
      "skipOptimism": 0.4,
      "routeHardness": 0.54,
      "overclaimRisk": 0.42,
      "routeBias": "balanced",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 33.94,
      "confidenceScore": 39.5,
      "candidateOptScore": 35.84,
      "packIntegrity": 47.85,
      "naiveBaselineScore": 23.08,
      "confidence": 30.35,
      "gatedContribution": 38.87,
      "naiveContribution": 23.38,
      "overall": 40.08
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 11.98,
      "confidenceScore": 18.04,
      "candidateOptScore": 14.31,
      "packIntegrity": 34.78,
      "naiveBaselineScore": 46.72,
      "confidence": 20.5,
      "gatedContribution": 25.17,
      "naiveContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "sc-007",
    "input": {
      "packCoverage": 0.45,
      "confidenceFidelity": 0.38,
      "candidateClarity": 0.42,
      "runStability": 0.49,
      "naiveBaselineRate": 0.53,
      "skipOptimism": 0.42,
      "routeHardness": 0.55,
      "overclaimRisk": 0.43,
      "routeBias": "route_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 31.59,
      "confidenceScore": 43.11,
      "candidateOptScore": 48.37,
      "packIntegrity": 39.34,
      "naiveBaselineScore": 25.15,
      "confidence": 33.6,
      "gatedContribution": 40.76,
      "naiveContribution": 25.64,
      "overall": 42.04
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 8.27,
      "confidenceScore": 19.34,
      "candidateOptScore": 15.59,
      "packIntegrity": 36.3,
      "naiveBaselineScore": 34.2,
      "confidence": 22.15,
      "gatedContribution": 22.74,
      "naiveContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "sc-008",
    "input": {
      "packCoverage": 0.41,
      "confidenceFidelity": 0.43,
      "candidateClarity": 0.46,
      "runStability": 0.45,
      "naiveBaselineRate": 0.49,
      "skipOptimism": 0.43,
      "routeHardness": 0.47,
      "overclaimRisk": 0.44,
      "routeBias": "naive_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 19.33,
      "confidenceScore": 35.43,
      "candidateOptScore": 27.62,
      "packIntegrity": 24.76,
      "naiveBaselineScore": 24.32,
      "confidence": 34.35,
      "gatedContribution": 26.71,
      "naiveContribution": 25.23,
      "overall": 27.44
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 16.4,
      "confidenceScore": 20.18,
      "candidateOptScore": 16.31,
      "packIntegrity": 35.17,
      "naiveBaselineScore": 58.5,
      "confidence": 22.7,
      "gatedContribution": 29.31,
      "naiveContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "sc-009",
    "input": {
      "packCoverage": 0.46,
      "confidenceFidelity": 0.41,
      "candidateClarity": 0.5,
      "runStability": 0.49,
      "naiveBaselineRate": 0.53,
      "skipOptimism": 0.39,
      "routeHardness": 0.48,
      "overclaimRisk": 0.38,
      "routeBias": "balanced",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 40.05,
      "confidenceScore": 45.49,
      "candidateOptScore": 45.68,
      "packIntegrity": 52.59,
      "naiveBaselineScore": 25.81,
      "confidence": 37.35,
      "gatedContribution": 45.69,
      "naiveContribution": 26.69,
      "overall": 46.27
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 14.91,
      "confidenceScore": 19.07,
      "candidateOptScore": 15.29,
      "packIntegrity": 35.36,
      "naiveBaselineScore": 48.88,
      "confidence": 22.7,
      "gatedContribution": 26.7,
      "naiveContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "sc-010",
    "input": {
      "packCoverage": 0.5,
      "confidenceFidelity": 0.45,
      "candidateClarity": 0.46,
      "runStability": 0.53,
      "naiveBaselineRate": 0.57,
      "skipOptimism": 0.4,
      "routeHardness": 0.49,
      "overclaimRisk": 0.39,
      "routeBias": "confidence_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 36.62,
      "confidenceScore": 49.14,
      "candidateOptScore": 30.65,
      "packIntegrity": 66.82,
      "naiveBaselineScore": 28.29,
      "confidence": 39,
      "gatedContribution": 44.6,
      "naiveContribution": 29.32,
      "overall": 45.85
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 3.59,
      "confidenceScore": 20.18,
      "candidateOptScore": 16.7,
      "packIntegrity": 37.06,
      "naiveBaselineScore": 35.54,
      "confidence": 24.25,
      "gatedContribution": 22.61,
      "naiveContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "sc-011",
    "input": {
      "packCoverage": 0.54,
      "confidenceFidelity": 0.49,
      "candidateClarity": 0.49,
      "runStability": 0.57,
      "naiveBaselineRate": 0.6,
      "skipOptimism": 0.42,
      "routeHardness": 0.49,
      "overclaimRisk": 0.4,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 47.21,
      "confidenceScore": 52.75,
      "candidateOptScore": 47.19,
      "packIntegrity": 60.27,
      "naiveBaselineScore": 30.54,
      "confidence": 42.25,
      "gatedContribution": 51.41,
      "naiveContribution": 31.82,
      "overall": 51.88
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 17.1,
      "confidenceScore": 21.62,
      "candidateOptScore": 18.14,
      "packIntegrity": 38.58,
      "naiveBaselineScore": 54.12,
      "confidence": 26.1,
      "gatedContribution": 29.91,
      "naiveContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "sc-012",
    "input": {
      "packCoverage": 0.5,
      "confidenceFidelity": 0.48,
      "candidateClarity": 0.53,
      "runStability": 0.53,
      "naiveBaselineRate": 0.56,
      "skipOptimism": 0.37,
      "routeHardness": 0.42,
      "overclaimRisk": 0.35,
      "routeBias": "route_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 38.19,
      "confidenceScore": 51.28,
      "candidateOptScore": 61.94,
      "packIntegrity": 43.82,
      "naiveBaselineScore": 28.34,
      "confidence": 42.1,
      "gatedContribution": 49.22,
      "naiveContribution": 29.7,
      "overall": 49.71
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 13.23,
      "confidenceScore": 19.68,
      "candidateOptScore": 16.17,
      "packIntegrity": 35.76,
      "naiveBaselineScore": 34.93,
      "confidence": 24.35,
      "gatedContribution": 23.95,
      "naiveContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "sc-013",
    "input": {
      "packCoverage": 0.54,
      "confidenceFidelity": 0.52,
      "candidateClarity": 0.56,
      "runStability": 0.57,
      "naiveBaselineRate": 0.6,
      "skipOptimism": 0.39,
      "routeHardness": 0.42,
      "overclaimRisk": 0.36,
      "routeBias": "naive_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 29.13,
      "confidenceScore": 44.88,
      "candidateOptScore": 36.59,
      "packIntegrity": 32.66,
      "naiveBaselineScore": 31.2,
      "confidence": 45.35,
      "gatedContribution": 35.78,
      "naiveContribution": 32.8,
      "overall": 36.24
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 22.62,
      "confidenceScore": 21.35,
      "candidateOptScore": 17.8,
      "packIntegrity": 37.74,
      "naiveBaselineScore": 67.02,
      "confidence": 26.55,
      "gatedContribution": 33.31,
      "naiveContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "sc-014",
    "input": {
      "packCoverage": 0.58,
      "confidenceFidelity": 0.56,
      "candidateClarity": 0.6,
      "runStability": 0.61,
      "naiveBaselineRate": 0.63,
      "skipOptimism": 0.4,
      "routeHardness": 0.43,
      "overclaimRisk": 0.36,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 52.62,
      "confidenceScore": 58.53,
      "candidateOptScore": 56.66,
      "packIntegrity": 64.86,
      "naiveBaselineScore": 33.07,
      "confidence": 49,
      "gatedContribution": 57.86,
      "naiveContribution": 34.8,
      "overall": 57.71
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 20.03,
      "confidenceScore": 22.2,
      "candidateOptScore": 18.59,
      "packIntegrity": 38.98,
      "naiveBaselineScore": 55.96,
      "confidence": 27.85,
      "gatedContribution": 31.15,
      "naiveContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "sc-015",
    "input": {
      "packCoverage": 0.62,
      "confidenceFidelity": 0.54,
      "candidateClarity": 0.56,
      "runStability": 0.65,
      "naiveBaselineRate": 0.67,
      "skipOptimism": 0.36,
      "routeHardness": 0.44,
      "overclaimRisk": 0.31,
      "routeBias": "confidence_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 45.9,
      "confidenceScore": 58.35,
      "candidateOptScore": 39.3,
      "packIntegrity": 79.94,
      "naiveBaselineScore": 34.55,
      "confidence": 49.6,
      "gatedContribution": 54.53,
      "naiveContribution": 36.22,
      "overall": 55.23
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 9.43,
      "confidenceScore": 21.14,
      "candidateOptScore": 17.93,
      "packIntegrity": 39.27,
      "naiveBaselineScore": 38.2,
      "confidence": 27.75,
      "gatedContribution": 25.19,
      "naiveContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "sc-016",
    "input": {
      "packCoverage": 0.58,
      "confidenceFidelity": 0.59,
      "candidateClarity": 0.6,
      "runStability": 0.6,
      "naiveBaselineRate": 0.63,
      "skipOptimism": 0.37,
      "routeHardness": 0.36,
      "overclaimRisk": 0.32,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 54.46,
      "confidenceScore": 60.67,
      "candidateOptScore": 57.87,
      "packIntegrity": 65.05,
      "naiveBaselineScore": 33.73,
      "confidence": 50.35,
      "gatedContribution": 59.24,
      "naiveContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 22.05,
      "confidenceScore": 21.91,
      "candidateOptScore": 18.56,
      "packIntegrity": 38.14,
      "naiveBaselineScore": 55.7,
      "confidence": 28.3,
      "gatedContribution": 31.27,
      "naiveContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "sc-017",
    "input": {
      "packCoverage": 0.62,
      "confidenceFidelity": 0.63,
      "candidateClarity": 0.63,
      "runStability": 0.64,
      "naiveBaselineRate": 0.67,
      "skipOptimism": 0.39,
      "routeHardness": 0.37,
      "overclaimRisk": 0.33,
      "routeBias": "route_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 48.43,
      "confidenceScore": 64.28,
      "candidateOptScore": 75.13,
      "packIntegrity": 52.76,
      "naiveBaselineScore": 36.41,
      "confidence": 53.6,
      "gatedContribution": 60.66,
      "naiveContribution": 38.61,
      "overall": 60.69
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 18.73,
      "confidenceScore": 23.42,
      "candidateOptScore": 20,
      "packIntegrity": 40.11,
      "naiveBaselineScore": 39.86,
      "confidence": 30.3,
      "gatedContribution": 28.42,
      "naiveContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "sc-018",
    "input": {
      "packCoverage": 0.66,
      "confidenceFidelity": 0.61,
      "candidateClarity": 0.67,
      "runStability": 0.68,
      "naiveBaselineRate": 0.7,
      "skipOptimism": 0.34,
      "routeHardness": 0.38,
      "overclaimRisk": 0.27,
      "routeBias": "naive_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 38.33,
      "confidenceScore": 54.13,
      "candidateOptScore": 45.52,
      "packIntegrity": 40.09,
      "naiveBaselineScore": 37.08,
      "confidence": 56.35,
      "gatedContribution": 44.52,
      "naiveContribution": 39.16,
      "overall": 44.56
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 28.36,
      "confidenceScore": 21.66,
      "candidateOptScore": 18.31,
      "packIntegrity": 39.67,
      "naiveBaselineScore": 74.27,
      "confidence": 29.5,
      "gatedContribution": 36.45,
      "naiveContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "sc-019",
    "input": {
      "packCoverage": 0.7,
      "confidenceFidelity": 0.65,
      "candidateClarity": 0.7,
      "runStability": 0.72,
      "naiveBaselineRate": 0.74,
      "skipOptimism": 0.36,
      "routeHardness": 0.38,
      "overclaimRisk": 0.28,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 63.81,
      "confidenceScore": 67.74,
      "candidateOptScore": 68.17,
      "packIntegrity": 75.07,
      "naiveBaselineScore": 39.94,
      "confidence": 59.6,
      "gatedContribution": 68.45,
      "naiveContribution": 42.25,
      "overall": 67.73
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 26.25,
      "confidenceScore": 23.32,
      "candidateOptScore": 19.92,
      "packIntegrity": 41.65,
      "naiveBaselineScore": 62.07,
      "confidence": 31.7,
      "gatedContribution": 34.64,
      "naiveContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sc-020",
    "input": {
      "packCoverage": 0.66,
      "confidenceFidelity": 0.7,
      "candidateClarity": 0.66,
      "runStability": 0.68,
      "naiveBaselineRate": 0.7,
      "skipOptimism": 0.37,
      "routeHardness": 0.31,
      "overclaimRisk": 0.29,
      "routeBias": "confidence_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 52.86,
      "confidenceScore": 70.06,
      "candidateOptScore": 45.74,
      "packIntegrity": 86.81,
      "naiveBaselineScore": 38.94,
      "confidence": 58.35,
      "gatedContribution": 62.46,
      "naiveContribution": 41.54,
      "overall": 62.69
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 13.66,
      "confidenceScore": 23.93,
      "candidateOptScore": 20.75,
      "packIntegrity": 40.51,
      "naiveBaselineScore": 40.86,
      "confidence": 32.05,
      "gatedContribution": 27.94,
      "naiveContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sc-021",
    "input": {
      "packCoverage": 0.7,
      "confidenceFidelity": 0.68,
      "candidateClarity": 0.7,
      "runStability": 0.72,
      "naiveBaselineRate": 0.73,
      "skipOptimism": 0.33,
      "routeHardness": 0.31,
      "overclaimRisk": 0.24,
      "routeBias": "balanced",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 65.6,
      "confidenceScore": 69.88,
      "candidateOptScore": 69.32,
      "packIntegrity": 75.82,
      "naiveBaselineScore": 39.99,
      "confidence": 60.95,
      "gatedContribution": 69.92,
      "naiveContribution": 42.54,
      "overall": 68.99
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 27.89,
      "confidenceScore": 22.72,
      "candidateOptScore": 19.62,
      "packIntegrity": 40.35,
      "naiveBaselineScore": 61.19,
      "confidence": 31.8,
      "gatedContribution": 34.35,
      "naiveContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sc-022",
    "input": {
      "packCoverage": 0.74,
      "confidenceFidelity": 0.72,
      "candidateClarity": 0.73,
      "runStability": 0.76,
      "naiveBaselineRate": 0.77,
      "skipOptimism": 0.34,
      "routeHardness": 0.32,
      "overclaimRisk": 0.25,
      "routeBias": "route_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 57.62,
      "confidenceScore": 73.52,
      "candidateOptScore": 88.86,
      "packIntegrity": 60.51,
      "naiveBaselineScore": 42.47,
      "confidence": 64.35,
      "gatedContribution": 70.82,
      "naiveContribution": 45.15,
      "overall": 70.2
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 24.57,
      "confidenceScore": 23.79,
      "candidateOptScore": 20.63,
      "packIntegrity": 42.05,
      "naiveBaselineScore": 42.21,
      "confidence": 33.35,
      "gatedContribution": 30.65,
      "naiveContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "sc-023",
    "input": {
      "packCoverage": 0.79,
      "confidenceFidelity": 0.76,
      "candidateClarity": 0.77,
      "runStability": 0.8,
      "naiveBaselineRate": 0.81,
      "skipOptimism": 0.36,
      "routeHardness": 0.33,
      "overclaimRisk": 0.25,
      "routeBias": "naive_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 49.04,
      "confidenceScore": 67.38,
      "candidateOptScore": 53.74,
      "packIntegrity": 49.49,
      "naiveBaselineScore": 45.16,
      "confidence": 68.25,
      "gatedContribution": 54.86,
      "naiveContribution": 48.03,
      "overall": 54.63
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 33.86,
      "confidenceScore": 25.25,
      "candidateOptScore": 22.05,
      "packIntegrity": 43.92,
      "naiveBaselineScore": 84.72,
      "confidence": 35.45,
      "gatedContribution": 41.96,
      "naiveContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "sc-024",
    "input": {
      "packCoverage": 0.75,
      "confidenceFidelity": 0.75,
      "candidateClarity": 0.81,
      "runStability": 0.76,
      "naiveBaselineRate": 0.77,
      "skipOptimism": 0.31,
      "routeHardness": 0.25,
      "overclaimRisk": 0.2,
      "routeBias": "balanced",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 71.55,
      "confidenceScore": 75.91,
      "candidateOptScore": 78.99,
      "packIntegrity": 80.56,
      "naiveBaselineScore": 43.13,
      "confidence": 68.1,
      "gatedContribution": 76.66,
      "naiveContribution": 46.07,
      "overall": 75.15
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 31.21,
      "confidenceScore": 23.36,
      "candidateOptScore": 20.13,
      "packIntegrity": 41.11,
      "naiveBaselineScore": 63.65,
      "confidence": 33.9,
      "gatedContribution": 35.89,
      "naiveContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "sc-025",
    "input": {
      "packCoverage": 0.79,
      "confidenceFidelity": 0.79,
      "candidateClarity": 0.77,
      "runStability": 0.8,
      "naiveBaselineRate": 0.8,
      "skipOptimism": 0.33,
      "routeHardness": 0.26,
      "overclaimRisk": 0.21,
      "routeBias": "confidence_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 62.51,
      "confidenceScore": 79.52,
      "candidateOptScore": 54.86,
      "packIntegrity": 100,
      "naiveBaselineScore": 45.2,
      "confidence": 69.6,
      "gatedContribution": 72.7,
      "naiveContribution": 48.27,
      "overall": 72.3
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 19.5,
      "confidenceScore": 24.6,
      "candidateOptScore": 21.69,
      "packIntegrity": 42.63,
      "naiveBaselineScore": 43.52,
      "confidence": 35.55,
      "gatedContribution": 30.39,
      "naiveContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "sc-026",
    "input": {
      "packCoverage": 0.83,
      "confidenceFidelity": 0.83,
      "candidateClarity": 0.8,
      "runStability": 0.83,
      "naiveBaselineRate": 0.84,
      "skipOptimism": 0.34,
      "routeHardness": 0.27,
      "overclaimRisk": 0.22,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 78.52,
      "confidenceScore": 83.17,
      "candidateOptScore": 80.3,
      "packIntegrity": 87.68,
      "naiveBaselineScore": 47.68,
      "confidence": 73,
      "gatedContribution": 82.15,
      "naiveContribution": 50.87,
      "overall": 80.52
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 33.17,
      "confidenceScore": 25.67,
      "candidateOptScore": 22.7,
      "packIntegrity": 44.32,
      "naiveBaselineScore": 68.8,
      "confidence": 37.1,
      "gatedContribution": 38.93,
      "naiveContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "sc-027",
    "input": {
      "packCoverage": 0.87,
      "confidenceFidelity": 0.81,
      "candidateClarity": 0.84,
      "runStability": 0.87,
      "naiveBaselineRate": 0.88,
      "skipOptimism": 0.3,
      "routeHardness": 0.27,
      "overclaimRisk": 0.17,
      "routeBias": "route_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 67.26,
      "confidenceScore": 82.98,
      "candidateOptScore": 100,
      "packIntegrity": 68.1,
      "naiveBaselineScore": 49.35,
      "confidence": 75.6,
      "gatedContribution": 80.38,
      "naiveContribution": 52.5,
      "overall": 79.36
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 30.78,
      "confidenceScore": 24.7,
      "candidateOptScore": 21.75,
      "packIntegrity": 44.62,
      "naiveBaselineScore": 45.22,
      "confidence": 37.2,
      "gatedContribution": 33.41,
      "naiveContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "sc-028",
    "input": {
      "packCoverage": 0.83,
      "confidenceFidelity": 0.86,
      "candidateClarity": 0.87,
      "runStability": 0.83,
      "naiveBaselineRate": 0.84,
      "skipOptimism": 0.31,
      "routeHardness": 0.2,
      "overclaimRisk": 0.17,
      "routeBias": "naive_first",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 54.87,
      "confidenceScore": 75.3,
      "candidateOptScore": 60.62,
      "packIntegrity": 53.51,
      "naiveBaselineScore": 48.34,
      "confidence": 76.1,
      "gatedContribution": 61.08,
      "naiveContribution": 51.73,
      "overall": 60.4
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 38.81,
      "confidenceScore": 25.25,
      "candidateOptScore": 22.17,
      "packIntegrity": 43.48,
      "naiveBaselineScore": 86.95,
      "confidence": 37.65,
      "gatedContribution": 43.33,
      "naiveContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "sc-029",
    "input": {
      "packCoverage": 0.87,
      "confidenceFidelity": 0.9,
      "candidateClarity": 0.91,
      "runStability": 0.87,
      "naiveBaselineRate": 0.87,
      "skipOptimism": 0.33,
      "routeHardness": 0.2,
      "overclaimRisk": 0.18,
      "routeBias": "balanced",
      "profile": "confidence_gated_ai_retrosynthesis"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 83.89,
      "confidenceScore": 88.91,
      "candidateOptScore": 89.72,
      "packIntegrity": 92.27,
      "naiveBaselineScore": 50.59,
      "confidence": 79.6,
      "gatedContribution": 88.57,
      "naiveContribution": 54.16,
      "overall": 86.38
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 36.33,
      "confidenceScore": 26.6,
      "candidateOptScore": 23.46,
      "packIntegrity": 45,
      "naiveBaselineScore": 71.06,
      "confidence": 39.5,
      "gatedContribution": 40.49,
      "naiveContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "sc-030",
    "input": {
      "packCoverage": 0.91,
      "confidenceFidelity": 0.88,
      "candidateClarity": 0.87,
      "runStability": 0.91,
      "naiveBaselineRate": 0.91,
      "skipOptimism": 0.28,
      "routeHardness": 0.21,
      "overclaimRisk": 0.13,
      "routeBias": "confidence_first",
      "profile": "naive_ai_route_baseline"
    },
    "expectedGated": {
      "mode": "confidence_gated_ai_retrosynthesis",
      "routeCoverage": 71.59,
      "confidenceScore": 88.77,
      "candidateOptScore": 63.26,
      "packIntegrity": 100,
      "naiveBaselineScore": 51.88,
      "confidence": 80.35,
      "gatedContribution": 79.63,
      "naiveContribution": 55.31,
      "overall": 79.25
    },
    "expectedNaive": {
      "mode": "naive_ai_route_baseline",
      "routeCoverage": 25.72,
      "confidenceScore": 25.06,
      "candidateOptScore": 22.34,
      "packIntegrity": 45.02,
      "naiveBaselineScore": 46.21,
      "confidence": 38.95,
      "gatedContribution": 32.87,
      "naiveContribution": 50.68,
      "overall": 44.3
    }
  }
];
