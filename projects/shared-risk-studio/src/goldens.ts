import type { RiskInput, RiskQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RiskInput;
  expectedShared: RiskQuality;
  expectedDisease: RiskQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sr-001",
    "input": {
      "cohortCoverage": 0.29,
      "modalityFidelity": 0.25,
      "queryClarity": 0.28,
      "runStability": 0.34,
      "diseaseBaselineRate": 0.39,
      "skipOptimism": 0.45,
      "diseaseHardness": 0.59,
      "overclaimRisk": 0.5,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 22.56,
      "modalityScore": 30.25,
      "queryOptScore": 23.49,
      "packIntegrity": 37.64,
      "diseaseBaselineScore": 16.4,
      "confidence": 19.35,
      "sharedContribution": 27.98,
      "diseaseContribution": 15.96,
      "overall": 29.82
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 5.76,
      "modalityScore": 17.09,
      "queryOptScore": 13.13,
      "packIntegrity": 32.39,
      "diseaseBaselineScore": 40.93,
      "confidence": 17.1,
      "sharedContribution": 21.86,
      "diseaseContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "sr-002",
    "input": {
      "cohortCoverage": 0.33,
      "modalityFidelity": 0.29,
      "queryClarity": 0.32,
      "runStability": 0.38,
      "diseaseBaselineRate": 0.43,
      "skipOptimism": 0.46,
      "diseaseHardness": 0.6,
      "overclaimRisk": 0.51,
      "queryBias": "modality_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 22.22,
      "modalityScore": 33.9,
      "queryOptScore": 34.39,
      "packIntegrity": 31.9,
      "diseaseBaselineScore": 18.89,
      "confidence": 23,
      "sharedContribution": 30.56,
      "diseaseContribution": 18.61,
      "overall": 32.41
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 2.43,
      "modalityScore": 18.22,
      "queryOptScore": 14.16,
      "packIntegrity": 34.08,
      "diseaseBaselineScore": 31.53,
      "confidence": 18.65,
      "sharedContribution": 20.08,
      "diseaseContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "sr-003",
    "input": {
      "cohortCoverage": 0.37,
      "modalityFidelity": 0.27,
      "queryClarity": 0.36,
      "runStability": 0.42,
      "diseaseBaselineRate": 0.46,
      "skipOptimism": 0.42,
      "diseaseHardness": 0.6,
      "overclaimRisk": 0.46,
      "queryBias": "disease_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 12.18,
      "modalityScore": 23.71,
      "queryOptScore": 20.95,
      "packIntegrity": 19.24,
      "diseaseBaselineScore": 19.94,
      "confidence": 25.6,
      "sharedContribution": 18.96,
      "diseaseContribution": 19.69,
      "overall": 20.09
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 12.17,
      "modalityScore": 17.1,
      "queryOptScore": 13.13,
      "packIntegrity": 33.93,
      "diseaseBaselineScore": 54.34,
      "confidence": 18.4,
      "sharedContribution": 26.13,
      "diseaseContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "sr-004",
    "input": {
      "cohortCoverage": 0.33,
      "modalityFidelity": 0.32,
      "queryClarity": 0.39,
      "runStability": 0.38,
      "diseaseBaselineRate": 0.42,
      "skipOptimism": 0.43,
      "diseaseHardness": 0.53,
      "overclaimRisk": 0.46,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 28.09,
      "modalityScore": 36.03,
      "queryOptScore": 33.07,
      "packIntegrity": 42.23,
      "diseaseBaselineScore": 18.93,
      "confidence": 26.1,
      "sharedContribution": 34.5,
      "diseaseContribution": 19.05,
      "overall": 35.72
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 8.7,
      "modalityScore": 17.81,
      "queryOptScore": 13.75,
      "packIntegrity": 32.79,
      "diseaseBaselineScore": 42.77,
      "confidence": 18.85,
      "sharedContribution": 23.16,
      "diseaseContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "sr-005",
    "input": {
      "cohortCoverage": 0.37,
      "modalityFidelity": 0.36,
      "queryClarity": 0.35,
      "runStability": 0.42,
      "diseaseBaselineRate": 0.46,
      "skipOptimism": 0.45,
      "diseaseHardness": 0.53,
      "overclaimRisk": 0.47,
      "queryBias": "shared_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 26.86,
      "modalityScore": 39.64,
      "queryOptScore": 21.39,
      "packIntegrity": 54.3,
      "diseaseBaselineScore": 21.8,
      "confidence": 27.6,
      "sharedContribution": 34.43,
      "diseaseContribution": 22.19,
      "overall": 36.23
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 0,
      "modalityScore": 19.51,
      "queryOptScore": 15.76,
      "packIntegrity": 34.77,
      "diseaseBaselineScore": 32.95,
      "confidence": 21.05,
      "sharedContribution": 20.6,
      "diseaseContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "sr-006",
    "input": {
      "cohortCoverage": 0.41,
      "modalityFidelity": 0.34,
      "queryClarity": 0.39,
      "runStability": 0.45,
      "diseaseBaselineRate": 0.5,
      "skipOptimism": 0.4,
      "diseaseHardness": 0.54,
      "overclaimRisk": 0.42,
      "queryBias": "balanced",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 33.94,
      "modalityScore": 39.5,
      "queryOptScore": 35.84,
      "packIntegrity": 47.85,
      "diseaseBaselineScore": 23.08,
      "confidence": 30.35,
      "sharedContribution": 38.87,
      "diseaseContribution": 23.38,
      "overall": 40.08
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 11.98,
      "modalityScore": 18.04,
      "queryOptScore": 14.31,
      "packIntegrity": 34.78,
      "diseaseBaselineScore": 46.72,
      "confidence": 20.5,
      "sharedContribution": 25.17,
      "diseaseContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "sr-007",
    "input": {
      "cohortCoverage": 0.45,
      "modalityFidelity": 0.38,
      "queryClarity": 0.42,
      "runStability": 0.49,
      "diseaseBaselineRate": 0.53,
      "skipOptimism": 0.42,
      "diseaseHardness": 0.55,
      "overclaimRisk": 0.43,
      "queryBias": "modality_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 31.59,
      "modalityScore": 43.11,
      "queryOptScore": 48.37,
      "packIntegrity": 39.34,
      "diseaseBaselineScore": 25.15,
      "confidence": 33.6,
      "sharedContribution": 40.76,
      "diseaseContribution": 25.64,
      "overall": 42.04
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 8.27,
      "modalityScore": 19.34,
      "queryOptScore": 15.59,
      "packIntegrity": 36.3,
      "diseaseBaselineScore": 34.2,
      "confidence": 22.15,
      "sharedContribution": 22.74,
      "diseaseContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "sr-008",
    "input": {
      "cohortCoverage": 0.41,
      "modalityFidelity": 0.43,
      "queryClarity": 0.46,
      "runStability": 0.45,
      "diseaseBaselineRate": 0.49,
      "skipOptimism": 0.43,
      "diseaseHardness": 0.47,
      "overclaimRisk": 0.44,
      "queryBias": "disease_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 19.33,
      "modalityScore": 35.43,
      "queryOptScore": 27.62,
      "packIntegrity": 24.76,
      "diseaseBaselineScore": 24.32,
      "confidence": 34.35,
      "sharedContribution": 26.71,
      "diseaseContribution": 25.23,
      "overall": 27.44
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 16.4,
      "modalityScore": 20.18,
      "queryOptScore": 16.31,
      "packIntegrity": 35.17,
      "diseaseBaselineScore": 58.5,
      "confidence": 22.7,
      "sharedContribution": 29.31,
      "diseaseContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "sr-009",
    "input": {
      "cohortCoverage": 0.46,
      "modalityFidelity": 0.41,
      "queryClarity": 0.5,
      "runStability": 0.49,
      "diseaseBaselineRate": 0.53,
      "skipOptimism": 0.39,
      "diseaseHardness": 0.48,
      "overclaimRisk": 0.38,
      "queryBias": "balanced",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 40.05,
      "modalityScore": 45.49,
      "queryOptScore": 45.68,
      "packIntegrity": 52.59,
      "diseaseBaselineScore": 25.81,
      "confidence": 37.35,
      "sharedContribution": 45.69,
      "diseaseContribution": 26.69,
      "overall": 46.27
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 14.91,
      "modalityScore": 19.07,
      "queryOptScore": 15.29,
      "packIntegrity": 35.36,
      "diseaseBaselineScore": 48.88,
      "confidence": 22.7,
      "sharedContribution": 26.7,
      "diseaseContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "sr-010",
    "input": {
      "cohortCoverage": 0.5,
      "modalityFidelity": 0.45,
      "queryClarity": 0.46,
      "runStability": 0.53,
      "diseaseBaselineRate": 0.57,
      "skipOptimism": 0.4,
      "diseaseHardness": 0.49,
      "overclaimRisk": 0.39,
      "queryBias": "shared_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 36.62,
      "modalityScore": 49.14,
      "queryOptScore": 30.65,
      "packIntegrity": 66.82,
      "diseaseBaselineScore": 28.29,
      "confidence": 39,
      "sharedContribution": 44.6,
      "diseaseContribution": 29.32,
      "overall": 45.85
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 3.59,
      "modalityScore": 20.18,
      "queryOptScore": 16.7,
      "packIntegrity": 37.06,
      "diseaseBaselineScore": 35.54,
      "confidence": 24.25,
      "sharedContribution": 22.61,
      "diseaseContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "sr-011",
    "input": {
      "cohortCoverage": 0.54,
      "modalityFidelity": 0.49,
      "queryClarity": 0.49,
      "runStability": 0.57,
      "diseaseBaselineRate": 0.6,
      "skipOptimism": 0.42,
      "diseaseHardness": 0.49,
      "overclaimRisk": 0.4,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 47.21,
      "modalityScore": 52.75,
      "queryOptScore": 47.19,
      "packIntegrity": 60.27,
      "diseaseBaselineScore": 30.54,
      "confidence": 42.25,
      "sharedContribution": 51.41,
      "diseaseContribution": 31.82,
      "overall": 51.88
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 17.1,
      "modalityScore": 21.62,
      "queryOptScore": 18.14,
      "packIntegrity": 38.58,
      "diseaseBaselineScore": 54.12,
      "confidence": 26.1,
      "sharedContribution": 29.91,
      "diseaseContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "sr-012",
    "input": {
      "cohortCoverage": 0.5,
      "modalityFidelity": 0.48,
      "queryClarity": 0.53,
      "runStability": 0.53,
      "diseaseBaselineRate": 0.56,
      "skipOptimism": 0.37,
      "diseaseHardness": 0.42,
      "overclaimRisk": 0.35,
      "queryBias": "modality_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 38.19,
      "modalityScore": 51.28,
      "queryOptScore": 61.94,
      "packIntegrity": 43.82,
      "diseaseBaselineScore": 28.34,
      "confidence": 42.1,
      "sharedContribution": 49.22,
      "diseaseContribution": 29.7,
      "overall": 49.71
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 13.23,
      "modalityScore": 19.68,
      "queryOptScore": 16.17,
      "packIntegrity": 35.76,
      "diseaseBaselineScore": 34.93,
      "confidence": 24.35,
      "sharedContribution": 23.95,
      "diseaseContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "sr-013",
    "input": {
      "cohortCoverage": 0.54,
      "modalityFidelity": 0.52,
      "queryClarity": 0.56,
      "runStability": 0.57,
      "diseaseBaselineRate": 0.6,
      "skipOptimism": 0.39,
      "diseaseHardness": 0.42,
      "overclaimRisk": 0.36,
      "queryBias": "disease_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 29.13,
      "modalityScore": 44.88,
      "queryOptScore": 36.59,
      "packIntegrity": 32.66,
      "diseaseBaselineScore": 31.2,
      "confidence": 45.35,
      "sharedContribution": 35.78,
      "diseaseContribution": 32.8,
      "overall": 36.24
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 22.62,
      "modalityScore": 21.35,
      "queryOptScore": 17.8,
      "packIntegrity": 37.74,
      "diseaseBaselineScore": 67.02,
      "confidence": 26.55,
      "sharedContribution": 33.31,
      "diseaseContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "sr-014",
    "input": {
      "cohortCoverage": 0.58,
      "modalityFidelity": 0.56,
      "queryClarity": 0.6,
      "runStability": 0.61,
      "diseaseBaselineRate": 0.63,
      "skipOptimism": 0.4,
      "diseaseHardness": 0.43,
      "overclaimRisk": 0.36,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 52.62,
      "modalityScore": 58.53,
      "queryOptScore": 56.66,
      "packIntegrity": 64.86,
      "diseaseBaselineScore": 33.07,
      "confidence": 49,
      "sharedContribution": 57.86,
      "diseaseContribution": 34.8,
      "overall": 57.71
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 20.03,
      "modalityScore": 22.2,
      "queryOptScore": 18.59,
      "packIntegrity": 38.98,
      "diseaseBaselineScore": 55.96,
      "confidence": 27.85,
      "sharedContribution": 31.15,
      "diseaseContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "sr-015",
    "input": {
      "cohortCoverage": 0.62,
      "modalityFidelity": 0.54,
      "queryClarity": 0.56,
      "runStability": 0.65,
      "diseaseBaselineRate": 0.67,
      "skipOptimism": 0.36,
      "diseaseHardness": 0.44,
      "overclaimRisk": 0.31,
      "queryBias": "shared_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 45.9,
      "modalityScore": 58.35,
      "queryOptScore": 39.3,
      "packIntegrity": 79.94,
      "diseaseBaselineScore": 34.55,
      "confidence": 49.6,
      "sharedContribution": 54.53,
      "diseaseContribution": 36.22,
      "overall": 55.23
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 9.43,
      "modalityScore": 21.14,
      "queryOptScore": 17.93,
      "packIntegrity": 39.27,
      "diseaseBaselineScore": 38.2,
      "confidence": 27.75,
      "sharedContribution": 25.19,
      "diseaseContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "sr-016",
    "input": {
      "cohortCoverage": 0.58,
      "modalityFidelity": 0.59,
      "queryClarity": 0.6,
      "runStability": 0.6,
      "diseaseBaselineRate": 0.63,
      "skipOptimism": 0.37,
      "diseaseHardness": 0.36,
      "overclaimRisk": 0.32,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 54.46,
      "modalityScore": 60.67,
      "queryOptScore": 57.87,
      "packIntegrity": 65.05,
      "diseaseBaselineScore": 33.73,
      "confidence": 50.35,
      "sharedContribution": 59.24,
      "diseaseContribution": 35.76,
      "overall": 59.01
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 22.05,
      "modalityScore": 21.91,
      "queryOptScore": 18.56,
      "packIntegrity": 38.14,
      "diseaseBaselineScore": 55.7,
      "confidence": 28.3,
      "sharedContribution": 31.27,
      "diseaseContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "sr-017",
    "input": {
      "cohortCoverage": 0.62,
      "modalityFidelity": 0.63,
      "queryClarity": 0.63,
      "runStability": 0.64,
      "diseaseBaselineRate": 0.67,
      "skipOptimism": 0.39,
      "diseaseHardness": 0.37,
      "overclaimRisk": 0.33,
      "queryBias": "modality_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 48.43,
      "modalityScore": 64.28,
      "queryOptScore": 75.13,
      "packIntegrity": 52.76,
      "diseaseBaselineScore": 36.41,
      "confidence": 53.6,
      "sharedContribution": 60.66,
      "diseaseContribution": 38.61,
      "overall": 60.69
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 18.73,
      "modalityScore": 23.42,
      "queryOptScore": 20,
      "packIntegrity": 40.11,
      "diseaseBaselineScore": 39.86,
      "confidence": 30.3,
      "sharedContribution": 28.42,
      "diseaseContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "sr-018",
    "input": {
      "cohortCoverage": 0.66,
      "modalityFidelity": 0.61,
      "queryClarity": 0.67,
      "runStability": 0.68,
      "diseaseBaselineRate": 0.7,
      "skipOptimism": 0.34,
      "diseaseHardness": 0.38,
      "overclaimRisk": 0.27,
      "queryBias": "disease_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 38.33,
      "modalityScore": 54.13,
      "queryOptScore": 45.52,
      "packIntegrity": 40.09,
      "diseaseBaselineScore": 37.08,
      "confidence": 56.35,
      "sharedContribution": 44.52,
      "diseaseContribution": 39.16,
      "overall": 44.56
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 28.36,
      "modalityScore": 21.66,
      "queryOptScore": 18.31,
      "packIntegrity": 39.67,
      "diseaseBaselineScore": 74.27,
      "confidence": 29.5,
      "sharedContribution": 36.45,
      "diseaseContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "sr-019",
    "input": {
      "cohortCoverage": 0.7,
      "modalityFidelity": 0.65,
      "queryClarity": 0.7,
      "runStability": 0.72,
      "diseaseBaselineRate": 0.74,
      "skipOptimism": 0.36,
      "diseaseHardness": 0.38,
      "overclaimRisk": 0.28,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 63.81,
      "modalityScore": 67.74,
      "queryOptScore": 68.17,
      "packIntegrity": 75.07,
      "diseaseBaselineScore": 39.94,
      "confidence": 59.6,
      "sharedContribution": 68.45,
      "diseaseContribution": 42.25,
      "overall": 67.73
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 26.25,
      "modalityScore": 23.32,
      "queryOptScore": 19.92,
      "packIntegrity": 41.65,
      "diseaseBaselineScore": 62.07,
      "confidence": 31.7,
      "sharedContribution": 34.64,
      "diseaseContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sr-020",
    "input": {
      "cohortCoverage": 0.66,
      "modalityFidelity": 0.7,
      "queryClarity": 0.66,
      "runStability": 0.68,
      "diseaseBaselineRate": 0.7,
      "skipOptimism": 0.37,
      "diseaseHardness": 0.31,
      "overclaimRisk": 0.29,
      "queryBias": "shared_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 52.86,
      "modalityScore": 70.06,
      "queryOptScore": 45.74,
      "packIntegrity": 86.81,
      "diseaseBaselineScore": 38.94,
      "confidence": 58.35,
      "sharedContribution": 62.46,
      "diseaseContribution": 41.54,
      "overall": 62.69
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 13.66,
      "modalityScore": 23.93,
      "queryOptScore": 20.75,
      "packIntegrity": 40.51,
      "diseaseBaselineScore": 40.86,
      "confidence": 32.05,
      "sharedContribution": 27.94,
      "diseaseContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sr-021",
    "input": {
      "cohortCoverage": 0.7,
      "modalityFidelity": 0.68,
      "queryClarity": 0.7,
      "runStability": 0.72,
      "diseaseBaselineRate": 0.73,
      "skipOptimism": 0.33,
      "diseaseHardness": 0.31,
      "overclaimRisk": 0.24,
      "queryBias": "balanced",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 65.6,
      "modalityScore": 69.88,
      "queryOptScore": 69.32,
      "packIntegrity": 75.82,
      "diseaseBaselineScore": 39.99,
      "confidence": 60.95,
      "sharedContribution": 69.92,
      "diseaseContribution": 42.54,
      "overall": 68.99
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 27.89,
      "modalityScore": 22.72,
      "queryOptScore": 19.62,
      "packIntegrity": 40.35,
      "diseaseBaselineScore": 61.19,
      "confidence": 31.8,
      "sharedContribution": 34.35,
      "diseaseContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sr-022",
    "input": {
      "cohortCoverage": 0.74,
      "modalityFidelity": 0.72,
      "queryClarity": 0.73,
      "runStability": 0.76,
      "diseaseBaselineRate": 0.77,
      "skipOptimism": 0.34,
      "diseaseHardness": 0.32,
      "overclaimRisk": 0.25,
      "queryBias": "modality_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 57.62,
      "modalityScore": 73.52,
      "queryOptScore": 88.86,
      "packIntegrity": 60.51,
      "diseaseBaselineScore": 42.47,
      "confidence": 64.35,
      "sharedContribution": 70.82,
      "diseaseContribution": 45.15,
      "overall": 70.2
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 24.57,
      "modalityScore": 23.79,
      "queryOptScore": 20.63,
      "packIntegrity": 42.05,
      "diseaseBaselineScore": 42.21,
      "confidence": 33.35,
      "sharedContribution": 30.65,
      "diseaseContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "sr-023",
    "input": {
      "cohortCoverage": 0.79,
      "modalityFidelity": 0.76,
      "queryClarity": 0.77,
      "runStability": 0.8,
      "diseaseBaselineRate": 0.81,
      "skipOptimism": 0.36,
      "diseaseHardness": 0.33,
      "overclaimRisk": 0.25,
      "queryBias": "disease_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 49.04,
      "modalityScore": 67.38,
      "queryOptScore": 53.74,
      "packIntegrity": 49.49,
      "diseaseBaselineScore": 45.16,
      "confidence": 68.25,
      "sharedContribution": 54.86,
      "diseaseContribution": 48.03,
      "overall": 54.63
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 33.86,
      "modalityScore": 25.25,
      "queryOptScore": 22.05,
      "packIntegrity": 43.92,
      "diseaseBaselineScore": 84.72,
      "confidence": 35.45,
      "sharedContribution": 41.96,
      "diseaseContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "sr-024",
    "input": {
      "cohortCoverage": 0.75,
      "modalityFidelity": 0.75,
      "queryClarity": 0.81,
      "runStability": 0.76,
      "diseaseBaselineRate": 0.77,
      "skipOptimism": 0.31,
      "diseaseHardness": 0.25,
      "overclaimRisk": 0.2,
      "queryBias": "balanced",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 71.55,
      "modalityScore": 75.91,
      "queryOptScore": 78.99,
      "packIntegrity": 80.56,
      "diseaseBaselineScore": 43.13,
      "confidence": 68.1,
      "sharedContribution": 76.66,
      "diseaseContribution": 46.07,
      "overall": 75.15
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 31.21,
      "modalityScore": 23.36,
      "queryOptScore": 20.13,
      "packIntegrity": 41.11,
      "diseaseBaselineScore": 63.65,
      "confidence": 33.9,
      "sharedContribution": 35.89,
      "diseaseContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "sr-025",
    "input": {
      "cohortCoverage": 0.79,
      "modalityFidelity": 0.79,
      "queryClarity": 0.77,
      "runStability": 0.8,
      "diseaseBaselineRate": 0.8,
      "skipOptimism": 0.33,
      "diseaseHardness": 0.26,
      "overclaimRisk": 0.21,
      "queryBias": "shared_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 62.51,
      "modalityScore": 79.52,
      "queryOptScore": 54.86,
      "packIntegrity": 100,
      "diseaseBaselineScore": 45.2,
      "confidence": 69.6,
      "sharedContribution": 72.7,
      "diseaseContribution": 48.27,
      "overall": 72.3
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 19.5,
      "modalityScore": 24.6,
      "queryOptScore": 21.69,
      "packIntegrity": 42.63,
      "diseaseBaselineScore": 43.52,
      "confidence": 35.55,
      "sharedContribution": 30.39,
      "diseaseContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "sr-026",
    "input": {
      "cohortCoverage": 0.83,
      "modalityFidelity": 0.83,
      "queryClarity": 0.8,
      "runStability": 0.83,
      "diseaseBaselineRate": 0.84,
      "skipOptimism": 0.34,
      "diseaseHardness": 0.27,
      "overclaimRisk": 0.22,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 78.52,
      "modalityScore": 83.17,
      "queryOptScore": 80.3,
      "packIntegrity": 87.68,
      "diseaseBaselineScore": 47.68,
      "confidence": 73,
      "sharedContribution": 82.15,
      "diseaseContribution": 50.87,
      "overall": 80.52
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 33.17,
      "modalityScore": 25.67,
      "queryOptScore": 22.7,
      "packIntegrity": 44.32,
      "diseaseBaselineScore": 68.8,
      "confidence": 37.1,
      "sharedContribution": 38.93,
      "diseaseContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "sr-027",
    "input": {
      "cohortCoverage": 0.87,
      "modalityFidelity": 0.81,
      "queryClarity": 0.84,
      "runStability": 0.87,
      "diseaseBaselineRate": 0.88,
      "skipOptimism": 0.3,
      "diseaseHardness": 0.27,
      "overclaimRisk": 0.17,
      "queryBias": "modality_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 67.26,
      "modalityScore": 82.98,
      "queryOptScore": 100,
      "packIntegrity": 68.1,
      "diseaseBaselineScore": 49.35,
      "confidence": 75.6,
      "sharedContribution": 80.38,
      "diseaseContribution": 52.5,
      "overall": 79.36
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 30.78,
      "modalityScore": 24.7,
      "queryOptScore": 21.75,
      "packIntegrity": 44.62,
      "diseaseBaselineScore": 45.22,
      "confidence": 37.2,
      "sharedContribution": 33.41,
      "diseaseContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "sr-028",
    "input": {
      "cohortCoverage": 0.83,
      "modalityFidelity": 0.86,
      "queryClarity": 0.87,
      "runStability": 0.83,
      "diseaseBaselineRate": 0.84,
      "skipOptimism": 0.31,
      "diseaseHardness": 0.2,
      "overclaimRisk": 0.17,
      "queryBias": "disease_first",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 54.87,
      "modalityScore": 75.3,
      "queryOptScore": 60.62,
      "packIntegrity": 53.51,
      "diseaseBaselineScore": 48.34,
      "confidence": 76.1,
      "sharedContribution": 61.08,
      "diseaseContribution": 51.73,
      "overall": 60.4
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 38.81,
      "modalityScore": 25.25,
      "queryOptScore": 22.17,
      "packIntegrity": 43.48,
      "diseaseBaselineScore": 86.95,
      "confidence": 37.65,
      "sharedContribution": 43.33,
      "diseaseContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "sr-029",
    "input": {
      "cohortCoverage": 0.87,
      "modalityFidelity": 0.9,
      "queryClarity": 0.91,
      "runStability": 0.87,
      "diseaseBaselineRate": 0.87,
      "skipOptimism": 0.33,
      "diseaseHardness": 0.2,
      "overclaimRisk": 0.18,
      "queryBias": "balanced",
      "profile": "shared_multi_disease"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 83.89,
      "modalityScore": 88.91,
      "queryOptScore": 89.72,
      "packIntegrity": 92.27,
      "diseaseBaselineScore": 50.59,
      "confidence": 79.6,
      "sharedContribution": 88.57,
      "diseaseContribution": 54.16,
      "overall": 86.38
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 36.33,
      "modalityScore": 26.6,
      "queryOptScore": 23.46,
      "packIntegrity": 45,
      "diseaseBaselineScore": 71.06,
      "confidence": 39.5,
      "sharedContribution": 40.49,
      "diseaseContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "sr-030",
    "input": {
      "cohortCoverage": 0.91,
      "modalityFidelity": 0.88,
      "queryClarity": 0.87,
      "runStability": 0.91,
      "diseaseBaselineRate": 0.91,
      "skipOptimism": 0.28,
      "diseaseHardness": 0.21,
      "overclaimRisk": 0.13,
      "queryBias": "shared_first",
      "profile": "disease_specific_baseline"
    },
    "expectedShared": {
      "mode": "shared_multi_disease",
      "sharedCoverage": 71.59,
      "modalityScore": 88.77,
      "queryOptScore": 63.26,
      "packIntegrity": 100,
      "diseaseBaselineScore": 51.88,
      "confidence": 80.35,
      "sharedContribution": 79.63,
      "diseaseContribution": 55.31,
      "overall": 79.25
    },
    "expectedDisease": {
      "mode": "disease_specific_baseline",
      "sharedCoverage": 25.72,
      "modalityScore": 25.06,
      "queryOptScore": 22.34,
      "packIntegrity": 45.02,
      "diseaseBaselineScore": 46.21,
      "confidence": 38.95,
      "sharedContribution": 32.87,
      "diseaseContribution": 50.68,
      "overall": 44.3
    }
  }
];
