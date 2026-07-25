import type { QuantInput, QuantQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantInput;
  expectedChannelAware: QuantQuality;
  expectedUniform: QuantQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "eqs-001",
    "input": {
      "saliencySkew": 0.17,
      "activationEnergy": 0.19,
      "avgBitBudget": 2.4,
      "paletteSpan": 0.21,
      "clusterRegularity": 0.18,
      "layoutMerge": 0.19,
      "memoryHeadroom": 0.14,
      "targetAffinity": 0.2,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 16.53,
      "saliencyMatch": 21.02,
      "clusterScore": 21.6,
      "runtimeScore": 21.82,
      "memoryScore": 16.92,
      "confidence": 11.84,
      "saliencyContribution": 20.28,
      "budgetContribution": 11.51,
      "layoutContribution": 20.09,
      "overall": 19.1
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 8.7,
      "saliencyMatch": 10.84,
      "clusterScore": 8.78,
      "runtimeScore": 8.87,
      "memoryScore": 9.69,
      "confidence": 4.06,
      "saliencyContribution": 0,
      "budgetContribution": 10.86,
      "layoutContribution": 7.84,
      "overall": 8.96
    }
  },
  {
    "id": "eqs-002",
    "input": {
      "saliencySkew": 0.21,
      "activationEnergy": 0.22,
      "avgBitBudget": 2.73,
      "paletteSpan": 0.25,
      "clusterRegularity": 0.22,
      "layoutMerge": 0.23,
      "memoryHeadroom": 0.17,
      "targetAffinity": 0.24,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 20.53,
      "saliencyMatch": 25.45,
      "clusterScore": 26.18,
      "runtimeScore": 26.42,
      "memoryScore": 19.8,
      "confidence": 12.23,
      "saliencyContribution": 24.33,
      "budgetContribution": 14.64,
      "layoutContribution": 24.41,
      "overall": 23.03
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 11.19,
      "saliencyMatch": 13.13,
      "clusterScore": 10.67,
      "runtimeScore": 10.7,
      "memoryScore": 12.29,
      "confidence": 3.94,
      "saliencyContribution": 0,
      "budgetContribution": 13.81,
      "layoutContribution": 9.52,
      "overall": 11.1
    }
  },
  {
    "id": "eqs-003",
    "input": {
      "saliencySkew": 0.26,
      "activationEnergy": 0.26,
      "avgBitBudget": 2.61,
      "paletteSpan": 0.3,
      "clusterRegularity": 0.21,
      "layoutMerge": 0.28,
      "memoryHeadroom": 0.21,
      "targetAffinity": 0.23,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 23.19,
      "saliencyMatch": 29.8,
      "clusterScore": 27.81,
      "runtimeScore": 27.62,
      "memoryScore": 22.25,
      "confidence": 13.79,
      "saliencyContribution": 29.48,
      "budgetContribution": 16.95,
      "layoutContribution": 25.27,
      "overall": 25.67
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 12.82,
      "saliencyMatch": 15.16,
      "clusterScore": 10.2,
      "runtimeScore": 11.97,
      "memoryScore": 14.4,
      "confidence": 4.34,
      "saliencyContribution": 0,
      "budgetContribution": 15.99,
      "layoutContribution": 9.1,
      "overall": 12.44
    }
  },
  {
    "id": "eqs-004",
    "input": {
      "saliencySkew": 0.22,
      "activationEnergy": 0.3,
      "avgBitBudget": 2.94,
      "paletteSpan": 0.26,
      "clusterRegularity": 0.25,
      "layoutMerge": 0.24,
      "memoryHeadroom": 0.25,
      "targetAffinity": 0.27,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 24.6,
      "saliencyMatch": 29.24,
      "clusterScore": 29.09,
      "runtimeScore": 29.09,
      "memoryScore": 24.9,
      "confidence": 11.71,
      "saliencyContribution": 27.9,
      "budgetContribution": 18.59,
      "layoutContribution": 27,
      "overall": 26.33
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 14.22,
      "saliencyMatch": 16.4,
      "clusterScore": 12.09,
      "runtimeScore": 11.5,
      "memoryScore": 16.58,
      "confidence": 4.18,
      "saliencyContribution": 0,
      "budgetContribution": 17.54,
      "layoutContribution": 10.78,
      "overall": 13.62
    }
  },
  {
    "id": "eqs-005",
    "input": {
      "saliencySkew": 0.27,
      "activationEnergy": 0.26,
      "avgBitBudget": 3.27,
      "paletteSpan": 0.3,
      "clusterRegularity": 0.3,
      "layoutMerge": 0.28,
      "memoryHeadroom": 0.22,
      "targetAffinity": 0.31,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 26.82,
      "saliencyMatch": 32.01,
      "clusterScore": 33.9,
      "runtimeScore": 34.08,
      "memoryScore": 24.41,
      "confidence": 13.69,
      "saliencyContribution": 30.01,
      "budgetContribution": 19.43,
      "layoutContribution": 31.91,
      "overall": 29.32
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 15.02,
      "saliencyMatch": 16.31,
      "clusterScore": 14.3,
      "runtimeScore": 13.33,
      "memoryScore": 16.41,
      "confidence": 3.29,
      "saliencyContribution": 0,
      "budgetContribution": 18.33,
      "layoutContribution": 12.74,
      "overall": 14.38
    }
  },
  {
    "id": "eqs-006",
    "input": {
      "saliencySkew": 0.31,
      "activationEnergy": 0.3,
      "avgBitBudget": 3.15,
      "paletteSpan": 0.35,
      "clusterRegularity": 0.28,
      "layoutMerge": 0.32,
      "memoryHeadroom": 0.26,
      "targetAffinity": 0.3,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 29.14,
      "saliencyMatch": 35.77,
      "clusterScore": 34.62,
      "runtimeScore": 34.5,
      "memoryScore": 26.86,
      "confidence": 13.25,
      "saliencyContribution": 34.63,
      "budgetContribution": 21.74,
      "layoutContribution": 31.86,
      "overall": 31.28
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 16.65,
      "saliencyMatch": 18.34,
      "clusterScore": 13.5,
      "runtimeScore": 14.32,
      "memoryScore": 18.52,
      "confidence": 3.69,
      "saliencyContribution": 0,
      "budgetContribution": 20.51,
      "layoutContribution": 12.04,
      "overall": 15.64
    }
  },
  {
    "id": "eqs-007",
    "input": {
      "saliencySkew": 0.35,
      "activationEnergy": 0.34,
      "avgBitBudget": 3.48,
      "paletteSpan": 0.39,
      "clusterRegularity": 0.32,
      "layoutMerge": 0.37,
      "memoryHeadroom": 0.29,
      "targetAffinity": 0.34,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 33.3,
      "saliencyMatch": 40.55,
      "clusterScore": 39.57,
      "runtimeScore": 39.49,
      "memoryScore": 29.74,
      "confidence": 13.32,
      "saliencyContribution": 39.03,
      "budgetContribution": 24.87,
      "layoutContribution": 36.5,
      "overall": 35.44
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 19.14,
      "saliencyMatch": 20.98,
      "clusterScore": 15.39,
      "runtimeScore": 16.44,
      "memoryScore": 21.12,
      "confidence": 3.84,
      "saliencyContribution": 0,
      "budgetContribution": 23.46,
      "layoutContribution": 13.72,
      "overall": 17.9
    }
  },
  {
    "id": "eqs-008",
    "input": {
      "saliencySkew": 0.32,
      "activationEnergy": 0.38,
      "avgBitBudget": 3.81,
      "paletteSpan": 0.35,
      "clusterRegularity": 0.37,
      "layoutMerge": 0.33,
      "memoryHeadroom": 0.33,
      "targetAffinity": 0.38,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 34.97,
      "saliencyMatch": 40.47,
      "clusterScore": 41.45,
      "runtimeScore": 41.35,
      "memoryScore": 32.39,
      "confidence": 13.08,
      "saliencyContribution": 37.97,
      "budgetContribution": 26.51,
      "layoutContribution": 38.83,
      "overall": 36.61
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 20.54,
      "saliencyMatch": 22.21,
      "clusterScore": 17.61,
      "runtimeScore": 15.96,
      "memoryScore": 23.3,
      "confidence": 3.67,
      "saliencyContribution": 0,
      "budgetContribution": 25.01,
      "layoutContribution": 15.68,
      "overall": 19.12
    }
  },
  {
    "id": "eqs-009",
    "input": {
      "saliencySkew": 0.36,
      "activationEnergy": 0.42,
      "avgBitBudget": 3.68,
      "paletteSpan": 0.4,
      "clusterRegularity": 0.35,
      "layoutMerge": 0.37,
      "memoryHeadroom": 0.37,
      "targetAffinity": 0.37,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 37.26,
      "saliencyMatch": 44.22,
      "clusterScore": 42.17,
      "runtimeScore": 41.76,
      "memoryScore": 34.82,
      "confidence": 14.45,
      "saliencyContribution": 42.59,
      "budgetContribution": 28.79,
      "layoutContribution": 38.77,
      "overall": 38.7
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 22.14,
      "saliencyMatch": 24.22,
      "clusterScore": 16.81,
      "runtimeScore": 16.95,
      "memoryScore": 25.38,
      "confidence": 4.08,
      "saliencyContribution": 0,
      "budgetContribution": 27.16,
      "layoutContribution": 14.98,
      "overall": 20.36
    }
  },
  {
    "id": "eqs-010",
    "input": {
      "saliencySkew": 0.41,
      "activationEnergy": 0.38,
      "avgBitBudget": 4.01,
      "paletteSpan": 0.44,
      "clusterRegularity": 0.4,
      "layoutMerge": 0.41,
      "memoryHeadroom": 0.34,
      "targetAffinity": 0.41,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 39.48,
      "saliencyMatch": 46.99,
      "clusterScore": 46.98,
      "runtimeScore": 46.76,
      "memoryScore": 34.33,
      "confidence": 12.65,
      "saliencyContribution": 44.7,
      "budgetContribution": 29.63,
      "layoutContribution": 43.69,
      "overall": 41.39
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 22.95,
      "saliencyMatch": 24.14,
      "clusterScore": 19.02,
      "runtimeScore": 18.78,
      "memoryScore": 25.22,
      "confidence": 3.19,
      "saliencyContribution": 0,
      "budgetContribution": 27.95,
      "layoutContribution": 16.94,
      "overall": 21.13
    }
  },
  {
    "id": "eqs-011",
    "input": {
      "saliencySkew": 0.45,
      "activationEnergy": 0.42,
      "avgBitBudget": 4.34,
      "paletteSpan": 0.48,
      "clusterRegularity": 0.44,
      "layoutMerge": 0.46,
      "memoryHeadroom": 0.38,
      "targetAffinity": 0.45,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 43.9,
      "saliencyMatch": 51.84,
      "clusterScore": 51.93,
      "runtimeScore": 51.75,
      "memoryScore": 37.77,
      "confidence": 12.97,
      "saliencyContribution": 49.1,
      "budgetContribution": 33.14,
      "layoutContribution": 48.33,
      "overall": 45.7
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 25.72,
      "saliencyMatch": 26.78,
      "clusterScore": 20.91,
      "runtimeScore": 20.9,
      "memoryScore": 28.28,
      "confidence": 3.06,
      "saliencyContribution": 0,
      "budgetContribution": 31.26,
      "layoutContribution": 18.62,
      "overall": 23.53
    }
  },
  {
    "id": "eqs-012",
    "input": {
      "saliencySkew": 0.42,
      "activationEnergy": 0.46,
      "avgBitBudget": 4.22,
      "paletteSpan": 0.45,
      "clusterRegularity": 0.43,
      "layoutMerge": 0.42,
      "memoryHeadroom": 0.42,
      "targetAffinity": 0.44,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 43.55,
      "saliencyMatch": 50.78,
      "clusterScore": 49.88,
      "runtimeScore": 49.42,
      "memoryScore": 39.43,
      "confidence": 13.6,
      "saliencyContribution": 48.27,
      "budgetContribution": 33.58,
      "layoutContribution": 46.28,
      "overall": 44.81
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 25.98,
      "saliencyMatch": 27.4,
      "clusterScore": 20.44,
      "runtimeScore": 19.58,
      "memoryScore": 29.5,
      "confidence": 3.42,
      "saliencyContribution": 0,
      "budgetContribution": 31.68,
      "layoutContribution": 18.2,
      "overall": 23.65
    }
  },
  {
    "id": "eqs-013",
    "input": {
      "saliencySkew": 0.46,
      "activationEnergy": 0.5,
      "avgBitBudget": 4.55,
      "paletteSpan": 0.49,
      "clusterRegularity": 0.47,
      "layoutMerge": 0.46,
      "memoryHeadroom": 0.45,
      "targetAffinity": 0.48,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 47.63,
      "saliencyMatch": 55.45,
      "clusterScore": 54.52,
      "runtimeScore": 54.02,
      "memoryScore": 42.32,
      "confidence": 13.87,
      "saliencyContribution": 52.67,
      "budgetContribution": 36.71,
      "layoutContribution": 50.6,
      "overall": 48.83
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 28.47,
      "saliencyMatch": 30.04,
      "clusterScore": 22.33,
      "runtimeScore": 21.41,
      "memoryScore": 32.1,
      "confidence": 3.57,
      "saliencyContribution": 0,
      "budgetContribution": 34.63,
      "layoutContribution": 19.88,
      "overall": 25.87
    }
  },
  {
    "id": "eqs-014",
    "input": {
      "saliencySkew": 0.5,
      "activationEnergy": 0.53,
      "avgBitBudget": 4.88,
      "paletteSpan": 0.53,
      "clusterRegularity": 0.51,
      "layoutMerge": 0.51,
      "memoryHeadroom": 0.49,
      "targetAffinity": 0.52,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 51.97,
      "saliencyMatch": 60.06,
      "clusterScore": 59.42,
      "runtimeScore": 59.02,
      "memoryScore": 45.76,
      "confidence": 13.82,
      "saliencyContribution": 56.72,
      "budgetContribution": 40.22,
      "layoutContribution": 55.24,
      "overall": 53.01
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 31.24,
      "saliencyMatch": 32.34,
      "clusterScore": 24.22,
      "runtimeScore": 23.53,
      "memoryScore": 35.16,
      "confidence": 3.1,
      "saliencyContribution": 0,
      "budgetContribution": 37.94,
      "layoutContribution": 21.56,
      "overall": 28.18
    }
  },
  {
    "id": "eqs-015",
    "input": {
      "saliencySkew": 0.55,
      "activationEnergy": 0.5,
      "avgBitBudget": 4.76,
      "paletteSpan": 0.58,
      "clusterRegularity": 0.5,
      "layoutMerge": 0.55,
      "memoryHeadroom": 0.46,
      "targetAffinity": 0.51,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 52.25,
      "saliencyMatch": 62.09,
      "clusterScore": 60.37,
      "runtimeScore": 59.82,
      "memoryScore": 44.28,
      "confidence": 15.2,
      "saliencyContribution": 59.4,
      "budgetContribution": 39.86,
      "layoutContribution": 55.78,
      "overall": 53.93
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 30.91,
      "saliencyMatch": 31.98,
      "clusterScore": 23.74,
      "runtimeScore": 24.51,
      "memoryScore": 34.05,
      "confidence": 3.07,
      "saliencyContribution": 0,
      "budgetContribution": 37.6,
      "layoutContribution": 21.14,
      "overall": 27.93
    }
  },
  {
    "id": "eqs-016",
    "input": {
      "saliencySkew": 0.51,
      "activationEnergy": 0.54,
      "avgBitBudget": 5.09,
      "paletteSpan": 0.54,
      "clusterRegularity": 0.54,
      "layoutMerge": 0.51,
      "memoryHeadroom": 0.5,
      "targetAffinity": 0.55,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 53.66,
      "saliencyMatch": 61.53,
      "clusterScore": 61.65,
      "runtimeScore": 61.29,
      "memoryScore": 46.93,
      "confidence": 13.36,
      "saliencyContribution": 57.82,
      "budgetContribution": 41.5,
      "layoutContribution": 57.51,
      "overall": 54.61
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 32.3,
      "saliencyMatch": 33.22,
      "clusterScore": 25.63,
      "runtimeScore": 24.04,
      "memoryScore": 36.22,
      "confidence": 2.92,
      "saliencyContribution": 0,
      "budgetContribution": 39.15,
      "layoutContribution": 22.82,
      "overall": 29.11
    }
  },
  {
    "id": "eqs-017",
    "input": {
      "saliencySkew": 0.56,
      "activationEnergy": 0.58,
      "avgBitBudget": 5.42,
      "paletteSpan": 0.59,
      "clusterRegularity": 0.59,
      "layoutMerge": 0.55,
      "memoryHeadroom": 0.54,
      "targetAffinity": 0.6,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 58.46,
      "saliencyMatch": 66.99,
      "clusterScore": 67.09,
      "runtimeScore": 66.65,
      "memoryScore": 50.47,
      "confidence": 13.64,
      "saliencyContribution": 62.96,
      "budgetContribution": 45.24,
      "layoutContribution": 62.59,
      "overall": 59.32
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 35.24,
      "saliencyMatch": 36.03,
      "clusterScore": 27.99,
      "runtimeScore": 26.04,
      "memoryScore": 39.39,
      "confidence": 2.79,
      "saliencyContribution": 0,
      "budgetContribution": 42.68,
      "layoutContribution": 24.92,
      "overall": 31.66
    }
  },
  {
    "id": "eqs-018",
    "input": {
      "saliencySkew": 0.6,
      "activationEnergy": 0.61,
      "avgBitBudget": 5.3,
      "paletteSpan": 0.63,
      "clusterRegularity": 0.57,
      "layoutMerge": 0.6,
      "memoryHeadroom": 0.58,
      "targetAffinity": 0.58,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 60.58,
      "saliencyMatch": 70.38,
      "clusterScore": 67.86,
      "runtimeScore": 67.09,
      "memoryScore": 52.82,
      "confidence": 16.3,
      "saliencyContribution": 67.01,
      "budgetContribution": 47.32,
      "layoutContribution": 62.69,
      "overall": 61.38
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 36.7,
      "saliencyMatch": 37.54,
      "clusterScore": 27.05,
      "runtimeScore": 27.14,
      "memoryScore": 41.39,
      "confidence": 2.84,
      "saliencyContribution": 0,
      "budgetContribution": 44.64,
      "layoutContribution": 24.08,
      "overall": 32.71
    }
  },
  {
    "id": "eqs-019",
    "input": {
      "saliencySkew": 0.64,
      "activationEnergy": 0.65,
      "avgBitBudget": 5.63,
      "paletteSpan": 0.67,
      "clusterRegularity": 0.61,
      "layoutMerge": 0.64,
      "memoryHeadroom": 0.61,
      "targetAffinity": 0.62,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 64.65,
      "saliencyMatch": 75.05,
      "clusterScore": 72.5,
      "runtimeScore": 71.69,
      "memoryScore": 55.7,
      "confidence": 16.57,
      "saliencyContribution": 71.41,
      "budgetContribution": 50.45,
      "layoutContribution": 67.01,
      "overall": 65.4
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 39.19,
      "saliencyMatch": 40.18,
      "clusterScore": 28.94,
      "runtimeScore": 28.97,
      "memoryScore": 43.99,
      "confidence": 2.99,
      "saliencyContribution": 0,
      "budgetContribution": 47.59,
      "layoutContribution": 25.76,
      "overall": 34.94
    }
  },
  {
    "id": "eqs-020",
    "input": {
      "saliencySkew": 0.61,
      "activationEnergy": 0.62,
      "avgBitBudget": 5.96,
      "paletteSpan": 0.64,
      "clusterRegularity": 0.66,
      "layoutMerge": 0.6,
      "memoryHeadroom": 0.58,
      "targetAffinity": 0.67,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 64.24,
      "saliencyMatch": 73,
      "clusterScore": 74.21,
      "runtimeScore": 73.92,
      "memoryScore": 54.52,
      "confidence": 15.05,
      "saliencyContribution": 68.11,
      "budgetContribution": 49.65,
      "layoutContribution": 69.5,
      "overall": 65.13
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 38.8,
      "saliencyMatch": 39.21,
      "clusterScore": 31.3,
      "runtimeScore": 28.67,
      "memoryScore": 43.05,
      "confidence": 2.41,
      "saliencyContribution": 0,
      "budgetContribution": 46.84,
      "layoutContribution": 27.86,
      "overall": 34.77
    }
  },
  {
    "id": "eqs-021",
    "input": {
      "saliencySkew": 0.65,
      "activationEnergy": 0.65,
      "avgBitBudget": 5.84,
      "paletteSpan": 0.68,
      "clusterRegularity": 0.64,
      "layoutMerge": 0.65,
      "memoryHeadroom": 0.62,
      "targetAffinity": 0.65,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 66.35,
      "saliencyMatch": 76.38,
      "clusterScore": 74.98,
      "runtimeScore": 74.36,
      "memoryScore": 56.87,
      "confidence": 15.48,
      "saliencyContribution": 72.16,
      "budgetContribution": 51.73,
      "layoutContribution": 69.61,
      "overall": 67.01
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 40.26,
      "saliencyMatch": 40.72,
      "clusterScore": 30.35,
      "runtimeScore": 29.77,
      "memoryScore": 45.05,
      "confidence": 2.46,
      "saliencyContribution": 0,
      "budgetContribution": 48.8,
      "layoutContribution": 27.02,
      "overall": 35.82
    }
  },
  {
    "id": "eqs-022",
    "input": {
      "saliencySkew": 0.7,
      "activationEnergy": 0.69,
      "avgBitBudget": 6.17,
      "paletteSpan": 0.72,
      "clusterRegularity": 0.69,
      "layoutMerge": 0.69,
      "memoryHeadroom": 0.66,
      "targetAffinity": 0.69,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 70.94,
      "saliencyMatch": 81.6,
      "clusterScore": 80.22,
      "runtimeScore": 79.35,
      "memoryScore": 60.32,
      "confidence": 15.7,
      "saliencyContribution": 77.09,
      "budgetContribution": 55.24,
      "layoutContribution": 74.52,
      "overall": 71.5
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 43.03,
      "saliencyMatch": 43.36,
      "clusterScore": 32.57,
      "runtimeScore": 31.6,
      "memoryScore": 48.11,
      "confidence": 2.33,
      "saliencyContribution": 0,
      "budgetContribution": 52.11,
      "layoutContribution": 28.98,
      "overall": 38.22
    }
  },
  {
    "id": "eqs-023",
    "input": {
      "saliencySkew": 0.74,
      "activationEnergy": 0.73,
      "avgBitBudget": 6.49,
      "paletteSpan": 0.77,
      "clusterRegularity": 0.73,
      "layoutMerge": 0.73,
      "memoryHeadroom": 0.7,
      "targetAffinity": 0.74,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 75.47,
      "saliencyMatch": 86.58,
      "clusterScore": 85.06,
      "runtimeScore": 84.32,
      "memoryScore": 63.84,
      "confidence": 16.14,
      "saliencyContribution": 81.71,
      "budgetContribution": 58.95,
      "layoutContribution": 79,
      "overall": 75.87
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 45.94,
      "saliencyMatch": 46.15,
      "clusterScore": 34.6,
      "runtimeScore": 33.6,
      "memoryScore": 51.25,
      "confidence": 2.21,
      "saliencyContribution": 0,
      "budgetContribution": 55.61,
      "layoutContribution": 30.8,
      "overall": 40.71
    }
  },
  {
    "id": "eqs-024",
    "input": {
      "saliencySkew": 0.71,
      "activationEnergy": 0.77,
      "avgBitBudget": 6.37,
      "paletteSpan": 0.73,
      "clusterRegularity": 0.72,
      "layoutMerge": 0.69,
      "memoryHeadroom": 0.74,
      "targetAffinity": 0.72,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 74.91,
      "saliencyMatch": 85.28,
      "clusterScore": 82.81,
      "runtimeScore": 81.63,
      "memoryScore": 65.4,
      "confidence": 16.85,
      "saliencyContribution": 80.65,
      "budgetContribution": 59.16,
      "layoutContribution": 76.79,
      "overall": 74.77
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 46.03,
      "saliencyMatch": 46.6,
      "clusterScore": 33.98,
      "runtimeScore": 32.11,
      "memoryScore": 52.37,
      "confidence": 2.57,
      "saliencyContribution": 0,
      "budgetContribution": 55.81,
      "layoutContribution": 30.24,
      "overall": 40.69
    }
  },
  {
    "id": "eqs-025",
    "input": {
      "saliencySkew": 0.75,
      "activationEnergy": 0.73,
      "avgBitBudget": 6.7,
      "paletteSpan": 0.77,
      "clusterRegularity": 0.76,
      "layoutMerge": 0.74,
      "memoryHeadroom": 0.7,
      "targetAffinity": 0.76,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 76.69,
      "saliencyMatch": 87.61,
      "clusterScore": 87.34,
      "runtimeScore": 86.62,
      "memoryScore": 64.34,
      "confidence": 14.89,
      "saliencyContribution": 82.24,
      "budgetContribution": 59.61,
      "layoutContribution": 81.43,
      "overall": 77.12
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 46.55,
      "saliencyMatch": 46.52,
      "clusterScore": 35.87,
      "runtimeScore": 34.23,
      "memoryScore": 51.75,
      "confidence": 2.03,
      "saliencyContribution": 0,
      "budgetContribution": 56.24,
      "layoutContribution": 31.92,
      "overall": 41.32
    }
  },
  {
    "id": "eqs-026",
    "input": {
      "saliencySkew": 0.79,
      "activationEnergy": 0.77,
      "avgBitBudget": 7.03,
      "paletteSpan": 0.82,
      "clusterRegularity": 0.8,
      "layoutMerge": 0.78,
      "memoryHeadroom": 0.74,
      "targetAffinity": 0.81,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 81.24,
      "saliencyMatch": 92.59,
      "clusterScore": 92.18,
      "runtimeScore": 91.58,
      "memoryScore": 67.89,
      "confidence": 15.33,
      "saliencyContribution": 86.86,
      "budgetContribution": 63.36,
      "layoutContribution": 85.91,
      "overall": 81.49
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 49.49,
      "saliencyMatch": 49.33,
      "clusterScore": 37.9,
      "runtimeScore": 36.23,
      "memoryScore": 54.92,
      "confidence": 2.16,
      "saliencyContribution": 0,
      "budgetContribution": 59.77,
      "layoutContribution": 33.74,
      "overall": 43.84
    }
  },
  {
    "id": "eqs-027",
    "input": {
      "saliencySkew": 0.84,
      "activationEnergy": 0.81,
      "avgBitBudget": 6.91,
      "paletteSpan": 0.86,
      "clusterRegularity": 0.79,
      "layoutMerge": 0.82,
      "memoryHeadroom": 0.78,
      "targetAffinity": 0.79,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 83.6,
      "saliencyMatch": 96.59,
      "clusterScore": 93.3,
      "runtimeScore": 92.02,
      "memoryScore": 70.24,
      "confidence": 18.45,
      "saliencyContribution": 91.78,
      "budgetContribution": 65.43,
      "layoutContribution": 86.29,
      "overall": 83.88
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 50.96,
      "saliencyMatch": 51.18,
      "clusterScore": 37.29,
      "runtimeScore": 37.05,
      "memoryScore": 56.91,
      "confidence": 2.22,
      "saliencyContribution": 0,
      "budgetContribution": 61.73,
      "layoutContribution": 33.18,
      "overall": 44.97
    }
  },
  {
    "id": "eqs-028",
    "input": {
      "saliencySkew": 0.8,
      "activationEnergy": 0.85,
      "avgBitBudget": 7.24,
      "paletteSpan": 0.82,
      "clusterRegularity": 0.83,
      "layoutMerge": 0.78,
      "memoryHeadroom": 0.82,
      "targetAffinity": 0.83,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 85.01,
      "saliencyMatch": 96.03,
      "clusterScore": 94.58,
      "runtimeScore": 93.5,
      "memoryScore": 72.89,
      "confidence": 16.37,
      "saliencyContribution": 90.2,
      "budgetContribution": 67.08,
      "layoutContribution": 88.02,
      "overall": 84.55
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 52.35,
      "saliencyMatch": 52.42,
      "clusterScore": 39.18,
      "runtimeScore": 36.57,
      "memoryScore": 59.09,
      "confidence": 2.07,
      "saliencyContribution": 0,
      "budgetContribution": 63.28,
      "layoutContribution": 34.86,
      "overall": 46.15
    }
  },
  {
    "id": "eqs-029",
    "input": {
      "saliencySkew": 0.85,
      "activationEnergy": 0.89,
      "avgBitBudget": 7.57,
      "paletteSpan": 0.87,
      "clusterRegularity": 0.88,
      "layoutMerge": 0.83,
      "memoryHeadroom": 0.86,
      "targetAffinity": 0.88,
      "profile": "channel"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 89.9,
      "saliencyMatch": 100,
      "clusterScore": 100,
      "runtimeScore": 99.25,
      "memoryScore": 76.43,
      "confidence": 15.22,
      "saliencyContribution": 95.35,
      "budgetContribution": 70.82,
      "layoutContribution": 93.42,
      "overall": 88.8
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 55.29,
      "saliencyMatch": 55.23,
      "clusterScore": 41.54,
      "runtimeScore": 38.86,
      "memoryScore": 62.26,
      "confidence": 2.06,
      "saliencyContribution": 0,
      "budgetContribution": 66.81,
      "layoutContribution": 36.96,
      "overall": 48.75
    }
  },
  {
    "id": "eqs-030",
    "input": {
      "saliencySkew": 0.89,
      "activationEnergy": 0.85,
      "avgBitBudget": 7.45,
      "paletteSpan": 0.91,
      "clusterRegularity": 0.86,
      "layoutMerge": 0.87,
      "memoryHeadroom": 0.82,
      "targetAffinity": 0.86,
      "profile": "uniform"
    },
    "expectedChannelAware": {
      "mode": "channel_aware",
      "budgetFit": 89.38,
      "saliencyMatch": 100,
      "clusterScore": 100,
      "runtimeScore": 99.29,
      "memoryScore": 74.29,
      "confidence": 15.46,
      "saliencyContribution": 96.93,
      "budgetContribution": 69.84,
      "layoutContribution": 93.2,
      "overall": 88.53
    },
    "expectedUniform": {
      "mode": "uniform",
      "budgetFit": 54.51,
      "saliencyMatch": 54.36,
      "clusterScore": 40.59,
      "runtimeScore": 39.68,
      "memoryScore": 60.58,
      "confidence": 2.15,
      "saliencyContribution": 0,
      "budgetContribution": 65.89,
      "layoutContribution": 36.12,
      "overall": 48.1
    }
  }
];
