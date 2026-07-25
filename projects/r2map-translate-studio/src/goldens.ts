import type { R2Input, R2Quality } from "./domain/types";

export type Golden = {
  id: string;
  input: R2Input;
  expectedGan: R2Quality;
  expectedConventional: R2Quality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "r2-001",
    "input": {
      "t1wFidelity": 0.29,
      "t2wFidelity": 0.25,
      "ganStability": 0.28,
      "mapCoherence": 0.34,
      "conventionalMatchRate": 0.39,
      "conventionalOptimism": 0.45,
      "translationHardness": 0.59,
      "overclaimRisk": 0.5,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 22.53,
      "t2wScore": 30.25,
      "ganScore": 23.45,
      "mapIntegrity": 37.64,
      "conventionalBaselineScore": 16.4,
      "confidence": 19.35,
      "ganContribution": 27.96,
      "conventionalContribution": 15.92,
      "overall": 29.79
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 5.76,
      "t2wScore": 17.05,
      "ganScore": 13.08,
      "mapIntegrity": 32.39,
      "conventionalBaselineScore": 40.93,
      "confidence": 17.1,
      "ganContribution": 21.84,
      "conventionalContribution": 38.57,
      "overall": 27.17
    }
  },
  {
    "id": "r2-002",
    "input": {
      "t1wFidelity": 0.33,
      "t2wFidelity": 0.29,
      "ganStability": 0.32,
      "mapCoherence": 0.38,
      "conventionalMatchRate": 0.43,
      "conventionalOptimism": 0.46,
      "translationHardness": 0.6,
      "overclaimRisk": 0.51,
      "translateBias": "map_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 22.19,
      "t2wScore": 33.9,
      "ganScore": 17.72,
      "mapIntegrity": 48.93,
      "conventionalBaselineScore": 18.89,
      "confidence": 23,
      "ganContribution": 29.63,
      "conventionalContribution": 18.58,
      "overall": 31.64
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 2.43,
      "t2wScore": 18.17,
      "ganScore": 14.11,
      "mapIntegrity": 34.08,
      "conventionalBaselineScore": 31.53,
      "confidence": 18.65,
      "ganContribution": 20.06,
      "conventionalContribution": 34.51,
      "overall": 23.47
    }
  },
  {
    "id": "r2-003",
    "input": {
      "t1wFidelity": 0.37,
      "t2wFidelity": 0.27,
      "ganStability": 0.36,
      "mapCoherence": 0.42,
      "conventionalMatchRate": 0.46,
      "conventionalOptimism": 0.42,
      "translationHardness": 0.6,
      "overclaimRisk": 0.46,
      "translateBias": "conventional_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 12.16,
      "t2wScore": 23.71,
      "ganScore": 20.92,
      "mapIntegrity": 19.24,
      "conventionalBaselineScore": 19.94,
      "confidence": 25.6,
      "ganContribution": 18.94,
      "conventionalContribution": 19.65,
      "overall": 20.07
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 12.17,
      "t2wScore": 17.05,
      "ganScore": 13.08,
      "mapIntegrity": 33.93,
      "conventionalBaselineScore": 54.34,
      "confidence": 18.4,
      "ganContribution": 26.11,
      "conventionalContribution": 46.55,
      "overall": 34.49
    }
  },
  {
    "id": "r2-004",
    "input": {
      "t1wFidelity": 0.33,
      "t2wFidelity": 0.32,
      "ganStability": 0.39,
      "mapCoherence": 0.38,
      "conventionalMatchRate": 0.42,
      "conventionalOptimism": 0.43,
      "translationHardness": 0.53,
      "overclaimRisk": 0.46,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 28.27,
      "t2wScore": 36.03,
      "ganScore": 33.26,
      "mapIntegrity": 42.23,
      "conventionalBaselineScore": 18.93,
      "confidence": 26.1,
      "ganContribution": 34.6,
      "conventionalContribution": 19.24,
      "overall": 35.84
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 8.7,
      "t2wScore": 18.05,
      "ganScore": 14.03,
      "mapIntegrity": 32.79,
      "conventionalBaselineScore": 42.77,
      "confidence": 18.85,
      "ganContribution": 23.27,
      "conventionalContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "r2-005",
    "input": {
      "t1wFidelity": 0.37,
      "t2wFidelity": 0.36,
      "ganStability": 0.35,
      "mapCoherence": 0.42,
      "conventionalMatchRate": 0.46,
      "conventionalOptimism": 0.45,
      "translationHardness": 0.53,
      "overclaimRisk": 0.47,
      "translateBias": "gan_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 26.81,
      "t2wScore": 39.64,
      "ganScore": 39.52,
      "mapIntegrity": 35.49,
      "conventionalBaselineScore": 21.8,
      "confidence": 27.6,
      "ganContribution": 35.36,
      "conventionalContribution": 22.12,
      "overall": 36.98
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 0,
      "t2wScore": 19.43,
      "ganScore": 15.66,
      "mapIntegrity": 34.77,
      "conventionalBaselineScore": 32.95,
      "confidence": 21.05,
      "ganContribution": 20.56,
      "conventionalContribution": 36.26,
      "overall": 25.75
    }
  },
  {
    "id": "r2-006",
    "input": {
      "t1wFidelity": 0.41,
      "t2wFidelity": 0.34,
      "ganStability": 0.39,
      "mapCoherence": 0.45,
      "conventionalMatchRate": 0.5,
      "conventionalOptimism": 0.4,
      "translationHardness": 0.54,
      "overclaimRisk": 0.42,
      "translateBias": "balanced",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 33.88,
      "t2wScore": 39.5,
      "ganScore": 35.78,
      "mapIntegrity": 47.85,
      "conventionalBaselineScore": 23.08,
      "confidence": 30.35,
      "ganContribution": 38.83,
      "conventionalContribution": 23.32,
      "overall": 40.04
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 11.98,
      "t2wScore": 17.95,
      "ganScore": 14.21,
      "mapIntegrity": 34.78,
      "conventionalBaselineScore": 46.72,
      "confidence": 20.5,
      "ganContribution": 25.13,
      "conventionalContribution": 43.14,
      "overall": 32.34
    }
  },
  {
    "id": "r2-007",
    "input": {
      "t1wFidelity": 0.45,
      "t2wFidelity": 0.38,
      "ganStability": 0.42,
      "mapCoherence": 0.49,
      "conventionalMatchRate": 0.53,
      "conventionalOptimism": 0.42,
      "translationHardness": 0.55,
      "overclaimRisk": 0.43,
      "translateBias": "map_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 31.52,
      "t2wScore": 43.11,
      "ganScore": 26.44,
      "mapIntegrity": 61.29,
      "conventionalBaselineScore": 25.15,
      "confidence": 33.6,
      "ganContribution": 39.43,
      "conventionalContribution": 25.54,
      "overall": 40.93
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 8.27,
      "t2wScore": 19.21,
      "ganScore": 15.44,
      "mapIntegrity": 36.3,
      "conventionalBaselineScore": 34.2,
      "confidence": 22.15,
      "ganContribution": 22.68,
      "conventionalContribution": 37.43,
      "overall": 27.21
    }
  },
  {
    "id": "r2-008",
    "input": {
      "t1wFidelity": 0.41,
      "t2wFidelity": 0.43,
      "ganStability": 0.46,
      "mapCoherence": 0.45,
      "conventionalMatchRate": 0.49,
      "conventionalOptimism": 0.43,
      "translationHardness": 0.47,
      "overclaimRisk": 0.44,
      "translateBias": "conventional_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 19.43,
      "t2wScore": 35.43,
      "ganScore": 27.76,
      "mapIntegrity": 24.76,
      "conventionalBaselineScore": 24.32,
      "confidence": 34.35,
      "ganContribution": 26.78,
      "conventionalContribution": 25.37,
      "overall": 27.53
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 16.4,
      "t2wScore": 20.36,
      "ganScore": 16.52,
      "mapIntegrity": 35.17,
      "conventionalBaselineScore": 58.5,
      "confidence": 22.7,
      "ganContribution": 29.39,
      "conventionalContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "r2-009",
    "input": {
      "t1wFidelity": 0.46,
      "t2wFidelity": 0.41,
      "ganStability": 0.5,
      "mapCoherence": 0.49,
      "conventionalMatchRate": 0.53,
      "conventionalOptimism": 0.39,
      "translationHardness": 0.48,
      "overclaimRisk": 0.38,
      "translateBias": "balanced",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 40.16,
      "t2wScore": 45.49,
      "ganScore": 45.8,
      "mapIntegrity": 52.59,
      "conventionalBaselineScore": 25.81,
      "confidence": 37.35,
      "ganContribution": 45.75,
      "conventionalContribution": 26.81,
      "overall": 46.34
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 14.91,
      "t2wScore": 19.22,
      "ganScore": 15.47,
      "mapIntegrity": 35.36,
      "conventionalBaselineScore": 48.88,
      "confidence": 22.7,
      "ganContribution": 26.77,
      "conventionalContribution": 45.34,
      "overall": 35.13
    }
  },
  {
    "id": "r2-010",
    "input": {
      "t1wFidelity": 0.5,
      "t2wFidelity": 0.45,
      "ganStability": 0.46,
      "mapCoherence": 0.53,
      "conventionalMatchRate": 0.57,
      "conventionalOptimism": 0.4,
      "translationHardness": 0.49,
      "overclaimRisk": 0.39,
      "translateBias": "gan_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 36.53,
      "t2wScore": 49.14,
      "ganScore": 54.44,
      "mapIntegrity": 43.07,
      "conventionalBaselineScore": 28.29,
      "confidence": 39,
      "ganContribution": 46.01,
      "conventionalContribution": 29.21,
      "overall": 46.99
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 3.59,
      "t2wScore": 20.03,
      "ganScore": 16.52,
      "mapIntegrity": 37.06,
      "conventionalBaselineScore": 35.54,
      "confidence": 24.25,
      "ganContribution": 22.55,
      "conventionalContribution": 38.95,
      "overall": 29.08
    }
  },
  {
    "id": "r2-011",
    "input": {
      "t1wFidelity": 0.54,
      "t2wFidelity": 0.49,
      "ganStability": 0.49,
      "mapCoherence": 0.57,
      "conventionalMatchRate": 0.6,
      "conventionalOptimism": 0.42,
      "translationHardness": 0.49,
      "overclaimRisk": 0.4,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 47.07,
      "t2wScore": 52.75,
      "ganScore": 47.04,
      "mapIntegrity": 60.27,
      "conventionalBaselineScore": 30.54,
      "confidence": 42.25,
      "ganContribution": 51.33,
      "conventionalContribution": 31.67,
      "overall": 51.79
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 17.1,
      "t2wScore": 21.44,
      "ganScore": 17.92,
      "mapIntegrity": 38.58,
      "conventionalBaselineScore": 54.12,
      "confidence": 26.1,
      "ganContribution": 29.83,
      "conventionalContribution": 50.43,
      "overall": 39.58
    }
  },
  {
    "id": "r2-012",
    "input": {
      "t1wFidelity": 0.5,
      "t2wFidelity": 0.48,
      "ganStability": 0.53,
      "mapCoherence": 0.53,
      "conventionalMatchRate": 0.56,
      "conventionalOptimism": 0.37,
      "translationHardness": 0.42,
      "overclaimRisk": 0.35,
      "translateBias": "map_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 38.25,
      "t2wScore": 51.28,
      "ganScore": 34.47,
      "mapIntegrity": 67.57,
      "conventionalBaselineScore": 28.34,
      "confidence": 42.1,
      "ganContribution": 46.77,
      "conventionalContribution": 29.77,
      "overall": 47.71
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 13.23,
      "t2wScore": 19.78,
      "ganScore": 16.29,
      "mapIntegrity": 35.76,
      "conventionalBaselineScore": 34.93,
      "confidence": 24.35,
      "ganContribution": 24,
      "conventionalContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "r2-013",
    "input": {
      "t1wFidelity": 0.54,
      "t2wFidelity": 0.52,
      "ganStability": 0.56,
      "mapCoherence": 0.57,
      "conventionalMatchRate": 0.6,
      "conventionalOptimism": 0.39,
      "translationHardness": 0.42,
      "overclaimRisk": 0.36,
      "translateBias": "conventional_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 29.17,
      "t2wScore": 44.88,
      "ganScore": 36.64,
      "mapIntegrity": 32.66,
      "conventionalBaselineScore": 31.2,
      "confidence": 45.35,
      "ganContribution": 35.8,
      "conventionalContribution": 32.85,
      "overall": 36.27
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 22.62,
      "t2wScore": 21.42,
      "ganScore": 17.87,
      "mapIntegrity": 37.74,
      "conventionalBaselineScore": 67.02,
      "confidence": 26.55,
      "ganContribution": 33.33,
      "conventionalContribution": 57.3,
      "overall": 46.51
    }
  },
  {
    "id": "r2-014",
    "input": {
      "t1wFidelity": 0.58,
      "t2wFidelity": 0.56,
      "ganStability": 0.6,
      "mapCoherence": 0.61,
      "conventionalMatchRate": 0.63,
      "conventionalOptimism": 0.4,
      "translationHardness": 0.43,
      "overclaimRisk": 0.36,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 52.67,
      "t2wScore": 58.53,
      "ganScore": 56.71,
      "mapIntegrity": 64.86,
      "conventionalBaselineScore": 33.07,
      "confidence": 49,
      "ganContribution": 57.89,
      "conventionalContribution": 34.85,
      "overall": 57.74
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 20.03,
      "t2wScore": 22.26,
      "ganScore": 18.66,
      "mapIntegrity": 38.98,
      "conventionalBaselineScore": 55.96,
      "confidence": 27.85,
      "ganContribution": 31.18,
      "conventionalContribution": 52.11,
      "overall": 41.91
    }
  },
  {
    "id": "r2-015",
    "input": {
      "t1wFidelity": 0.62,
      "t2wFidelity": 0.54,
      "ganStability": 0.56,
      "mapCoherence": 0.65,
      "conventionalMatchRate": 0.67,
      "conventionalOptimism": 0.36,
      "translationHardness": 0.44,
      "overclaimRisk": 0.31,
      "translateBias": "gan_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 45.77,
      "t2wScore": 58.35,
      "ganScore": 68.25,
      "mapIntegrity": 50.82,
      "conventionalBaselineScore": 34.55,
      "confidence": 49.6,
      "ganContribution": 56.19,
      "conventionalContribution": 36.06,
      "overall": 56.57
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 9.43,
      "t2wScore": 20.94,
      "ganScore": 17.69,
      "mapIntegrity": 39.27,
      "conventionalBaselineScore": 38.2,
      "confidence": 27.75,
      "ganContribution": 25.11,
      "conventionalContribution": 41.8,
      "overall": 32.75
    }
  },
  {
    "id": "r2-016",
    "input": {
      "t1wFidelity": 0.58,
      "t2wFidelity": 0.59,
      "ganStability": 0.6,
      "mapCoherence": 0.6,
      "conventionalMatchRate": 0.63,
      "conventionalOptimism": 0.37,
      "translationHardness": 0.36,
      "overclaimRisk": 0.32,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 54.5,
      "t2wScore": 60.67,
      "ganScore": 57.91,
      "mapIntegrity": 65.05,
      "conventionalBaselineScore": 33.73,
      "confidence": 50.35,
      "ganContribution": 59.26,
      "conventionalContribution": 35.81,
      "overall": 59.04
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 22.05,
      "t2wScore": 21.96,
      "ganScore": 18.63,
      "mapIntegrity": 38.14,
      "conventionalBaselineScore": 55.7,
      "confidence": 28.3,
      "ganContribution": 31.3,
      "conventionalContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "r2-017",
    "input": {
      "t1wFidelity": 0.62,
      "t2wFidelity": 0.63,
      "ganStability": 0.63,
      "mapCoherence": 0.64,
      "conventionalMatchRate": 0.67,
      "conventionalOptimism": 0.39,
      "translationHardness": 0.37,
      "overclaimRisk": 0.33,
      "translateBias": "map_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 48.45,
      "t2wScore": 64.28,
      "ganScore": 42.42,
      "mapIntegrity": 81.43,
      "conventionalBaselineScore": 36.41,
      "confidence": 53.6,
      "ganContribution": 57.82,
      "conventionalContribution": 38.64,
      "overall": 58.37
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 18.73,
      "t2wScore": 23.45,
      "ganScore": 20.03,
      "mapIntegrity": 40.11,
      "conventionalBaselineScore": 39.86,
      "confidence": 30.3,
      "ganContribution": 28.44,
      "conventionalContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "r2-018",
    "input": {
      "t1wFidelity": 0.66,
      "t2wFidelity": 0.61,
      "ganStability": 0.67,
      "mapCoherence": 0.68,
      "conventionalMatchRate": 0.7,
      "conventionalOptimism": 0.34,
      "translationHardness": 0.38,
      "overclaimRisk": 0.27,
      "translateBias": "conventional_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 38.35,
      "t2wScore": 54.13,
      "ganScore": 45.55,
      "mapIntegrity": 40.09,
      "conventionalBaselineScore": 37.08,
      "confidence": 56.35,
      "ganContribution": 44.54,
      "conventionalContribution": 39.18,
      "overall": 44.58
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 28.36,
      "t2wScore": 21.69,
      "ganScore": 18.35,
      "mapIntegrity": 39.67,
      "conventionalBaselineScore": 74.27,
      "confidence": 29.5,
      "ganContribution": 36.47,
      "conventionalContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "r2-019",
    "input": {
      "t1wFidelity": 0.7,
      "t2wFidelity": 0.65,
      "ganStability": 0.7,
      "mapCoherence": 0.72,
      "conventionalMatchRate": 0.74,
      "conventionalOptimism": 0.36,
      "translationHardness": 0.38,
      "overclaimRisk": 0.28,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 63.81,
      "t2wScore": 67.74,
      "ganScore": 68.17,
      "mapIntegrity": 75.07,
      "conventionalBaselineScore": 39.94,
      "confidence": 59.6,
      "ganContribution": 68.45,
      "conventionalContribution": 42.25,
      "overall": 67.73
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 26.25,
      "t2wScore": 23.32,
      "ganScore": 19.92,
      "mapIntegrity": 41.65,
      "conventionalBaselineScore": 62.07,
      "confidence": 31.7,
      "ganContribution": 34.64,
      "conventionalContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "r2-020",
    "input": {
      "t1wFidelity": 0.66,
      "t2wFidelity": 0.7,
      "ganStability": 0.66,
      "mapCoherence": 0.68,
      "conventionalMatchRate": 0.7,
      "conventionalOptimism": 0.37,
      "translationHardness": 0.31,
      "overclaimRisk": 0.29,
      "translateBias": "gan_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 52.86,
      "t2wScore": 70.06,
      "ganScore": 80.04,
      "mapIntegrity": 56.34,
      "conventionalBaselineScore": 38.94,
      "confidence": 58.35,
      "ganContribution": 65.36,
      "conventionalContribution": 41.54,
      "overall": 65.07
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 13.66,
      "t2wScore": 23.93,
      "ganScore": 20.75,
      "mapIntegrity": 40.51,
      "conventionalBaselineScore": 40.86,
      "confidence": 32.05,
      "ganContribution": 27.94,
      "conventionalContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "r2-021",
    "input": {
      "t1wFidelity": 0.7,
      "t2wFidelity": 0.68,
      "ganStability": 0.7,
      "mapCoherence": 0.72,
      "conventionalMatchRate": 0.73,
      "conventionalOptimism": 0.33,
      "translationHardness": 0.31,
      "overclaimRisk": 0.24,
      "translateBias": "balanced",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 65.6,
      "t2wScore": 69.88,
      "ganScore": 69.32,
      "mapIntegrity": 75.82,
      "conventionalBaselineScore": 39.99,
      "confidence": 60.95,
      "ganContribution": 69.92,
      "conventionalContribution": 42.54,
      "overall": 68.99
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 27.89,
      "t2wScore": 22.72,
      "ganScore": 19.62,
      "mapIntegrity": 40.35,
      "conventionalBaselineScore": 61.19,
      "confidence": 31.8,
      "ganContribution": 34.35,
      "conventionalContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "r2-022",
    "input": {
      "t1wFidelity": 0.74,
      "t2wFidelity": 0.72,
      "ganStability": 0.73,
      "mapCoherence": 0.76,
      "conventionalMatchRate": 0.77,
      "conventionalOptimism": 0.34,
      "translationHardness": 0.32,
      "overclaimRisk": 0.25,
      "translateBias": "map_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 57.6,
      "t2wScore": 73.52,
      "ganScore": 50.9,
      "mapIntegrity": 94.56,
      "conventionalBaselineScore": 42.47,
      "confidence": 64.35,
      "ganContribution": 67.68,
      "conventionalContribution": 45.13,
      "overall": 67.62
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 24.57,
      "t2wScore": 23.77,
      "ganScore": 20.61,
      "mapIntegrity": 42.05,
      "conventionalBaselineScore": 42.21,
      "confidence": 33.35,
      "ganContribution": 30.64,
      "conventionalContribution": 46.55,
      "overall": 38.99
    }
  },
  {
    "id": "r2-023",
    "input": {
      "t1wFidelity": 0.79,
      "t2wFidelity": 0.76,
      "ganStability": 0.77,
      "mapCoherence": 0.8,
      "conventionalMatchRate": 0.81,
      "conventionalOptimism": 0.36,
      "translationHardness": 0.33,
      "overclaimRisk": 0.25,
      "translateBias": "conventional_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 49.01,
      "t2wScore": 67.38,
      "ganScore": 53.71,
      "mapIntegrity": 49.49,
      "conventionalBaselineScore": 45.16,
      "confidence": 68.25,
      "ganContribution": 54.84,
      "conventionalContribution": 47.99,
      "overall": 54.61
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 33.86,
      "t2wScore": 25.2,
      "ganScore": 21.99,
      "mapIntegrity": 43.92,
      "conventionalBaselineScore": 84.72,
      "confidence": 35.45,
      "ganContribution": 41.94,
      "conventionalContribution": 71.31,
      "overall": 60.71
    }
  },
  {
    "id": "r2-024",
    "input": {
      "t1wFidelity": 0.75,
      "t2wFidelity": 0.75,
      "ganStability": 0.81,
      "mapCoherence": 0.76,
      "conventionalMatchRate": 0.77,
      "conventionalOptimism": 0.31,
      "translationHardness": 0.25,
      "overclaimRisk": 0.2,
      "translateBias": "balanced",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 71.63,
      "t2wScore": 75.91,
      "ganScore": 79.08,
      "mapIntegrity": 80.56,
      "conventionalBaselineScore": 43.13,
      "confidence": 68.1,
      "ganContribution": 76.71,
      "conventionalContribution": 46.16,
      "overall": 75.21
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 31.21,
      "t2wScore": 23.47,
      "ganScore": 20.27,
      "mapIntegrity": 41.11,
      "conventionalBaselineScore": 63.65,
      "confidence": 33.9,
      "ganContribution": 35.94,
      "conventionalContribution": 58.02,
      "overall": 49.96
    }
  },
  {
    "id": "r2-025",
    "input": {
      "t1wFidelity": 0.79,
      "t2wFidelity": 0.79,
      "ganStability": 0.77,
      "mapCoherence": 0.8,
      "conventionalMatchRate": 0.8,
      "conventionalOptimism": 0.33,
      "translationHardness": 0.26,
      "overclaimRisk": 0.21,
      "translateBias": "gan_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 62.49,
      "t2wScore": 79.52,
      "ganScore": 94.85,
      "mapIntegrity": 64.24,
      "conventionalBaselineScore": 45.2,
      "confidence": 69.6,
      "ganContribution": 76.02,
      "conventionalContribution": 48.24,
      "overall": 75.02
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 19.5,
      "t2wScore": 24.56,
      "ganScore": 21.65,
      "mapIntegrity": 42.63,
      "conventionalBaselineScore": 43.52,
      "confidence": 35.55,
      "ganContribution": 30.37,
      "conventionalContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "r2-026",
    "input": {
      "t1wFidelity": 0.83,
      "t2wFidelity": 0.83,
      "ganStability": 0.8,
      "mapCoherence": 0.83,
      "conventionalMatchRate": 0.84,
      "conventionalOptimism": 0.34,
      "translationHardness": 0.27,
      "overclaimRisk": 0.22,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 78.48,
      "t2wScore": 83.17,
      "ganScore": 80.25,
      "mapIntegrity": 87.68,
      "conventionalBaselineScore": 47.68,
      "confidence": 73,
      "ganContribution": 82.13,
      "conventionalContribution": 50.82,
      "overall": 80.49
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 33.17,
      "t2wScore": 25.61,
      "ganScore": 22.62,
      "mapIntegrity": 44.32,
      "conventionalBaselineScore": 68.8,
      "confidence": 37.1,
      "ganContribution": 38.9,
      "conventionalContribution": 63,
      "overall": 54.22
    }
  },
  {
    "id": "r2-027",
    "input": {
      "t1wFidelity": 0.87,
      "t2wFidelity": 0.81,
      "ganStability": 0.84,
      "mapCoherence": 0.87,
      "conventionalMatchRate": 0.88,
      "conventionalOptimism": 0.3,
      "translationHardness": 0.27,
      "overclaimRisk": 0.17,
      "translateBias": "map_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 67.22,
      "t2wScore": 82.98,
      "ganScore": 59.98,
      "mapIntegrity": 100,
      "conventionalBaselineScore": 49.35,
      "confidence": 75.6,
      "ganContribution": 76.19,
      "conventionalContribution": 52.46,
      "overall": 75.92
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 30.78,
      "t2wScore": 24.64,
      "ganScore": 21.68,
      "mapIntegrity": 44.62,
      "conventionalBaselineScore": 45.22,
      "confidence": 37.2,
      "ganContribution": 33.39,
      "conventionalContribution": 49.68,
      "overall": 42.92
    }
  },
  {
    "id": "r2-028",
    "input": {
      "t1wFidelity": 0.83,
      "t2wFidelity": 0.86,
      "ganStability": 0.87,
      "mapCoherence": 0.83,
      "conventionalMatchRate": 0.84,
      "conventionalOptimism": 0.31,
      "translationHardness": 0.2,
      "overclaimRisk": 0.17,
      "translateBias": "conventional_first",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 54.91,
      "t2wScore": 75.3,
      "ganScore": 60.67,
      "mapIntegrity": 53.51,
      "conventionalBaselineScore": 48.34,
      "confidence": 76.1,
      "ganContribution": 61.11,
      "conventionalContribution": 51.78,
      "overall": 60.43
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 38.81,
      "t2wScore": 25.31,
      "ganScore": 22.24,
      "mapIntegrity": 43.48,
      "conventionalBaselineScore": 86.95,
      "confidence": 37.65,
      "ganContribution": 43.36,
      "conventionalContribution": 72.62,
      "overall": 63.56
    }
  },
  {
    "id": "r2-029",
    "input": {
      "t1wFidelity": 0.87,
      "t2wFidelity": 0.9,
      "ganStability": 0.91,
      "mapCoherence": 0.87,
      "conventionalMatchRate": 0.87,
      "conventionalOptimism": 0.33,
      "translationHardness": 0.2,
      "overclaimRisk": 0.18,
      "translateBias": "balanced",
      "profile": "gan_r2map_translation"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 83.93,
      "t2wScore": 88.91,
      "ganScore": 89.77,
      "mapIntegrity": 92.27,
      "conventionalBaselineScore": 50.59,
      "confidence": 79.6,
      "ganContribution": 88.6,
      "conventionalContribution": 54.2,
      "overall": 86.41
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 36.33,
      "t2wScore": 26.66,
      "ganScore": 23.53,
      "mapIntegrity": 45,
      "conventionalBaselineScore": 71.06,
      "confidence": 39.5,
      "ganContribution": 40.52,
      "conventionalContribution": 65.11,
      "overall": 57.02
    }
  },
  {
    "id": "r2-030",
    "input": {
      "t1wFidelity": 0.91,
      "t2wFidelity": 0.88,
      "ganStability": 0.87,
      "mapCoherence": 0.91,
      "conventionalMatchRate": 0.91,
      "conventionalOptimism": 0.28,
      "translationHardness": 0.21,
      "overclaimRisk": 0.13,
      "translateBias": "gan_first",
      "profile": "conventional_r2_baseline"
    },
    "expectedGan": {
      "mode": "gan_r2map_translation",
      "t1wScore": 71.56,
      "t2wScore": 88.77,
      "ganScore": 100,
      "mapIntegrity": 71.68,
      "conventionalBaselineScore": 51.88,
      "confidence": 80.35,
      "ganContribution": 83.68,
      "conventionalContribution": 55.26,
      "overall": 82.56
    },
    "expectedConventional": {
      "mode": "conventional_r2_baseline",
      "t1wScore": 25.72,
      "t2wScore": 25,
      "ganScore": 22.26,
      "mapIntegrity": 45.02,
      "conventionalBaselineScore": 46.21,
      "confidence": 38.95,
      "ganContribution": 32.84,
      "conventionalContribution": 50.65,
      "overall": 44.27
    }
  }
];
