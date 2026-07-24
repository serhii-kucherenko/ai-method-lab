import type { WorldInput, WorldQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: WorldInput;
  expectedWorldModel: WorldQuality;
  expectedTrialError: WorldQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dws-001",
    "input": {
      "stateCoverage": 0.16,
      "costAwareness": 0.14,
      "planHorizon": 0.1,
      "simFidelity": 0.14,
      "dataQuality": 0.14,
      "featureRichness": 0.13,
      "agentSkill": 0.2,
      "explorationNoise": 0.7,
      "retryBudget": 0.74,
      "computeBudget": 0.21,
      "opComplexity": 0.14,
      "stepCount": 5,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 4.77,
      "costEfficiency": 0,
      "planQuality": 7.3,
      "simFit": 10.4,
      "wasteAvoided": 40.76,
      "confidence": 10.76,
      "overall": 9.76
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 52.7,
      "costEfficiency": 1.64,
      "planQuality": 22.36,
      "simFit": 29.56,
      "wasteAvoided": 8.61,
      "confidence": 37.04,
      "overall": 27.02
    }
  },
  {
    "id": "dws-002",
    "input": {
      "stateCoverage": 0.2,
      "costAwareness": 0.18,
      "planHorizon": 0.14,
      "simFidelity": 0.19,
      "dataQuality": 0.18,
      "featureRichness": 0.17,
      "agentSkill": 0.24,
      "explorationNoise": 0.69,
      "retryBudget": 0.74,
      "computeBudget": 0.24,
      "opComplexity": 0.18,
      "stepCount": 6,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 9.11,
      "costEfficiency": 2.78,
      "planQuality": 11.4,
      "simFit": 14.17,
      "wasteAvoided": 42.4,
      "confidence": 14.18,
      "overall": 13.24
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 51.98,
      "costEfficiency": 2.24,
      "planQuality": 22.86,
      "simFit": 29.6,
      "wasteAvoided": 9,
      "confidence": 36.38,
      "overall": 27.01
    }
  },
  {
    "id": "dws-003",
    "input": {
      "stateCoverage": 0.25,
      "costAwareness": 0.23,
      "planHorizon": 0.18,
      "simFidelity": 0.16,
      "dataQuality": 0.23,
      "featureRichness": 0.22,
      "agentSkill": 0.22,
      "explorationNoise": 0.69,
      "retryBudget": 0.74,
      "computeBudget": 0.28,
      "opComplexity": 0.23,
      "stepCount": 7,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 11.42,
      "costEfficiency": 6.47,
      "planQuality": 16.14,
      "simFit": 14.19,
      "wasteAvoided": 46.98,
      "confidence": 13.12,
      "overall": 15.97
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 52.2,
      "costEfficiency": 2.8,
      "planQuality": 23.41,
      "simFit": 28.54,
      "wasteAvoided": 11.25,
      "confidence": 37.74,
      "overall": 27.57
    }
  },
  {
    "id": "dws-004",
    "input": {
      "stateCoverage": 0.29,
      "costAwareness": 0.19,
      "planHorizon": 0.22,
      "simFidelity": 0.21,
      "dataQuality": 0.27,
      "featureRichness": 0.18,
      "agentSkill": 0.27,
      "explorationNoise": 0.68,
      "retryBudget": 0.66,
      "computeBudget": 0.32,
      "opComplexity": 0.19,
      "stepCount": 8,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 14.8,
      "costEfficiency": 5.29,
      "planQuality": 18.5,
      "simFit": 18.02,
      "wasteAvoided": 44.5,
      "confidence": 19.54,
      "overall": 17.77
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 50.44,
      "costEfficiency": 4.34,
      "planQuality": 24.24,
      "simFit": 29.7,
      "wasteAvoided": 10.12,
      "confidence": 34.44,
      "overall": 27.22
    }
  },
  {
    "id": "dws-005",
    "input": {
      "stateCoverage": 0.24,
      "costAwareness": 0.24,
      "planHorizon": 0.26,
      "simFidelity": 0.26,
      "dataQuality": 0.22,
      "featureRichness": 0.22,
      "agentSkill": 0.31,
      "explorationNoise": 0.67,
      "retryBudget": 0.66,
      "computeBudget": 0.28,
      "opComplexity": 0.24,
      "stepCount": 9,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 16.08,
      "costEfficiency": 7.5,
      "planQuality": 18.28,
      "simFit": 19.19,
      "wasteAvoided": 46.36,
      "confidence": 19.36,
      "overall": 18.92
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 49.08,
      "costEfficiency": 4.02,
      "planQuality": 23.89,
      "simFit": 29.6,
      "wasteAvoided": 10.59,
      "confidence": 34.5,
      "overall": 26.75
    }
  },
  {
    "id": "dws-006",
    "input": {
      "stateCoverage": 0.28,
      "costAwareness": 0.28,
      "planHorizon": 0.21,
      "simFidelity": 0.24,
      "dataQuality": 0.26,
      "featureRichness": 0.27,
      "agentSkill": 0.29,
      "explorationNoise": 0.66,
      "retryBudget": 0.67,
      "computeBudget": 0.32,
      "opComplexity": 0.28,
      "stepCount": 10,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 17.26,
      "costEfficiency": 11.2,
      "planQuality": 20.21,
      "simFit": 19.59,
      "wasteAvoided": 49.84,
      "confidence": 18.24,
      "overall": 20.77
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 50.61,
      "costEfficiency": 4.6,
      "planQuality": 24.5,
      "simFit": 28.8,
      "wasteAvoided": 12.84,
      "confidence": 36.46,
      "overall": 27.8
    }
  },
  {
    "id": "dws-007",
    "input": {
      "stateCoverage": 0.33,
      "costAwareness": 0.32,
      "planHorizon": 0.25,
      "simFidelity": 0.28,
      "dataQuality": 0.3,
      "featureRichness": 0.31,
      "agentSkill": 0.33,
      "explorationNoise": 0.55,
      "retryBudget": 0.67,
      "computeBudget": 0.35,
      "opComplexity": 0.32,
      "stepCount": 11,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 21.46,
      "costEfficiency": 15.71,
      "planQuality": 24.98,
      "simFit": 22.08,
      "wasteAvoided": 51.28,
      "confidence": 25.88,
      "overall": 24.85
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 46.93,
      "costEfficiency": 7.6,
      "planQuality": 25.08,
      "simFit": 28.64,
      "wasteAvoided": 13.43,
      "confidence": 32.72,
      "overall": 27.2
    }
  },
  {
    "id": "dws-008",
    "input": {
      "stateCoverage": 0.37,
      "costAwareness": 0.29,
      "planHorizon": 0.29,
      "simFidelity": 0.33,
      "dataQuality": 0.35,
      "featureRichness": 0.27,
      "agentSkill": 0.38,
      "explorationNoise": 0.54,
      "retryBudget": 0.59,
      "computeBudget": 0.39,
      "opComplexity": 0.29,
      "stepCount": 12,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 26.04,
      "costEfficiency": 16.28,
      "planQuality": 28.06,
      "simFit": 26.65,
      "wasteAvoided": 52.02,
      "confidence": 29.46,
      "overall": 27.73
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 46.93,
      "costEfficiency": 9.2,
      "planQuality": 25.77,
      "simFit": 29.74,
      "wasteAvoided": 14.38,
      "confidence": 31.42,
      "overall": 27.81
    }
  },
  {
    "id": "dws-009",
    "input": {
      "stateCoverage": 0.42,
      "costAwareness": 0.33,
      "planHorizon": 0.33,
      "simFidelity": 0.31,
      "dataQuality": 0.39,
      "featureRichness": 0.32,
      "agentSkill": 0.36,
      "explorationNoise": 0.54,
      "retryBudget": 0.59,
      "computeBudget": 0.43,
      "opComplexity": 0.33,
      "stepCount": 13,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 29.49,
      "costEfficiency": 20.53,
      "planQuality": 33.29,
      "simFit": 27.68,
      "wasteAvoided": 56.38,
      "confidence": 28.46,
      "overall": 31.09
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 47.39,
      "costEfficiency": 9.7,
      "planQuality": 26.46,
      "simFit": 28.86,
      "wasteAvoided": 16.55,
      "confidence": 32.78,
      "overall": 28.46
    }
  },
  {
    "id": "dws-010",
    "input": {
      "stateCoverage": 0.36,
      "costAwareness": 0.38,
      "planHorizon": 0.37,
      "simFidelity": 0.36,
      "dataQuality": 0.34,
      "featureRichness": 0.36,
      "agentSkill": 0.4,
      "explorationNoise": 0.53,
      "retryBudget": 0.59,
      "computeBudget": 0.39,
      "opComplexity": 0.38,
      "stepCount": 14,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 28.47,
      "costEfficiency": 20.51,
      "planQuality": 31.38,
      "simFit": 27.61,
      "wasteAvoided": 55.24,
      "confidence": 31.04,
      "overall": 30.54
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 43.98,
      "costEfficiency": 9.38,
      "planQuality": 26.03,
      "simFit": 28.84,
      "wasteAvoided": 15.02,
      "confidence": 30.92,
      "overall": 26.94
    }
  },
  {
    "id": "dws-011",
    "input": {
      "stateCoverage": 0.41,
      "costAwareness": 0.42,
      "planHorizon": 0.41,
      "simFidelity": 0.41,
      "dataQuality": 0.38,
      "featureRichness": 0.4,
      "agentSkill": 0.44,
      "explorationNoise": 0.52,
      "retryBudget": 0.59,
      "computeBudget": 0.43,
      "opComplexity": 0.42,
      "stepCount": 15,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 33.05,
      "costEfficiency": 23.88,
      "planQuality": 35.96,
      "simFit": 31.44,
      "wasteAvoided": 56.88,
      "confidence": 34.7,
      "overall": 34.32
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 43.3,
      "costEfficiency": 10.12,
      "planQuality": 26.62,
      "simFit": 28.8,
      "wasteAvoided": 15.41,
      "confidence": 30.18,
      "overall": 26.97
    }
  },
  {
    "id": "dws-012",
    "input": {
      "stateCoverage": 0.45,
      "costAwareness": 0.39,
      "planHorizon": 0.36,
      "simFidelity": 0.38,
      "dataQuality": 0.43,
      "featureRichness": 0.37,
      "agentSkill": 0.43,
      "explorationNoise": 0.51,
      "retryBudget": 0.51,
      "computeBudget": 0.47,
      "opComplexity": 0.39,
      "stepCount": 16,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 35.06,
      "costEfficiency": 25.56,
      "planQuality": 37.36,
      "simFit": 32.6,
      "wasteAvoided": 59.54,
      "confidence": 33.52,
      "overall": 35.85
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 45.42,
      "costEfficiency": 11.72,
      "planQuality": 27.4,
      "simFit": 28.94,
      "wasteAvoided": 18.36,
      "confidence": 31.42,
      "overall": 28.6
    }
  },
  {
    "id": "dws-013",
    "input": {
      "stateCoverage": 0.5,
      "costAwareness": 0.43,
      "planHorizon": 0.4,
      "simFidelity": 0.43,
      "dataQuality": 0.47,
      "featureRichness": 0.41,
      "agentSkill": 0.47,
      "explorationNoise": 0.51,
      "retryBudget": 0.51,
      "computeBudget": 0.5,
      "opComplexity": 0.43,
      "stepCount": 17,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 37.13,
      "costEfficiency": 25.98,
      "planQuality": 40.54,
      "simFit": 34.98,
      "wasteAvoided": 57.9,
      "confidence": 40.06,
      "overall": 37.72
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 42.84,
      "costEfficiency": 12.08,
      "planQuality": 27.99,
      "simFit": 28.9,
      "wasteAvoided": 16.53,
      "confidence": 28.78,
      "overall": 27.51
    }
  },
  {
    "id": "dws-014",
    "input": {
      "stateCoverage": 0.54,
      "costAwareness": 0.47,
      "planHorizon": 0.44,
      "simFidelity": 0.48,
      "dataQuality": 0.51,
      "featureRichness": 0.45,
      "agentSkill": 0.51,
      "explorationNoise": 0.39,
      "retryBudget": 0.51,
      "computeBudget": 0.54,
      "opComplexity": 0.47,
      "stepCount": 18,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 43.01,
      "costEfficiency": 32.66,
      "planQuality": 45.74,
      "simFit": 38.89,
      "wasteAvoided": 62.62,
      "confidence": 44.8,
      "overall": 43.14
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 41.02,
      "costEfficiency": 15.46,
      "planQuality": 28.5,
      "simFit": 28.94,
      "wasteAvoided": 19.34,
      "confidence": 27.02,
      "overall": 28.04
    }
  },
  {
    "id": "dws-015",
    "input": {
      "stateCoverage": 0.49,
      "costAwareness": 0.52,
      "planHorizon": 0.48,
      "simFidelity": 0.45,
      "dataQuality": 0.46,
      "featureRichness": 0.5,
      "agentSkill": 0.49,
      "explorationNoise": 0.39,
      "retryBudget": 0.51,
      "computeBudget": 0.5,
      "opComplexity": 0.52,
      "stepCount": 19,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 43.61,
      "costEfficiency": 36.57,
      "planQuality": 46.37,
      "simFit": 37.2,
      "wasteAvoided": 67.2,
      "confidence": 39.74,
      "overall": 44.18
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 40.8,
      "costEfficiency": 14.9,
      "planQuality": 28.25,
      "simFit": 27.88,
      "wasteAvoided": 21.59,
      "confidence": 29.18,
      "overall": 28.18
    }
  },
  {
    "id": "dws-016",
    "input": {
      "stateCoverage": 0.53,
      "costAwareness": 0.48,
      "planHorizon": 0.51,
      "simFidelity": 0.5,
      "dataQuality": 0.5,
      "featureRichness": 0.46,
      "agentSkill": 0.54,
      "explorationNoise": 0.38,
      "retryBudget": 0.44,
      "computeBudget": 0.54,
      "opComplexity": 0.48,
      "stepCount": 20,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 45.21,
      "costEfficiency": 33.57,
      "planQuality": 47.76,
      "simFit": 39.93,
      "wasteAvoided": 64.52,
      "confidence": 46.16,
      "overall": 44.76
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 39.29,
      "costEfficiency": 16.28,
      "planQuality": 29.08,
      "simFit": 29.04,
      "wasteAvoided": 20.32,
      "confidence": 26.02,
      "overall": 27.85
    }
  },
  {
    "id": "dws-017",
    "input": {
      "stateCoverage": 0.58,
      "costAwareness": 0.53,
      "planHorizon": 0.55,
      "simFidelity": 0.55,
      "dataQuality": 0.55,
      "featureRichness": 0.51,
      "agentSkill": 0.58,
      "explorationNoise": 0.37,
      "retryBudget": 0.44,
      "computeBudget": 0.58,
      "opComplexity": 0.53,
      "stepCount": 21,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 49.88,
      "costEfficiency": 37.36,
      "planQuality": 52.48,
      "simFit": 43.9,
      "wasteAvoided": 66.38,
      "confidence": 49.98,
      "overall": 48.74
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 38.37,
      "costEfficiency": 17.08,
      "planQuality": 29.62,
      "simFit": 28.94,
      "wasteAvoided": 20.79,
      "confidence": 25.28,
      "overall": 27.82
    }
  },
  {
    "id": "dws-018",
    "input": {
      "stateCoverage": 0.62,
      "costAwareness": 0.57,
      "planHorizon": 0.5,
      "simFidelity": 0.53,
      "dataQuality": 0.59,
      "featureRichness": 0.55,
      "agentSkill": 0.56,
      "explorationNoise": 0.36,
      "retryBudget": 0.44,
      "computeBudget": 0.62,
      "opComplexity": 0.57,
      "stepCount": 4,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 52.73,
      "costEfficiency": 45.65,
      "planQuality": 55.25,
      "simFit": 45.37,
      "wasteAvoided": 69.94,
      "confidence": 38.06,
      "overall": 51.49
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 39.77,
      "costEfficiency": 23.22,
      "planQuality": 23.83,
      "simFit": 28.14,
      "wasteAvoided": 25.88,
      "confidence": 27.16,
      "overall": 29.55
    }
  },
  {
    "id": "dws-019",
    "input": {
      "stateCoverage": 0.67,
      "costAwareness": 0.61,
      "planHorizon": 0.54,
      "simFidelity": 0.57,
      "dataQuality": 0.63,
      "featureRichness": 0.59,
      "agentSkill": 0.6,
      "explorationNoise": 0.36,
      "retryBudget": 0.44,
      "computeBudget": 0.65,
      "opComplexity": 0.61,
      "stepCount": 5,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 53.65,
      "costEfficiency": 44.91,
      "planQuality": 57.94,
      "simFit": 46.63,
      "wasteAvoided": 68.3,
      "confidence": 44.38,
      "overall": 52.53
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 37.19,
      "costEfficiency": 23.58,
      "planQuality": 24.42,
      "simFit": 27.98,
      "wasteAvoided": 24.05,
      "confidence": 24.52,
      "overall": 28.45
    }
  },
  {
    "id": "dws-020",
    "input": {
      "stateCoverage": 0.61,
      "costAwareness": 0.58,
      "planHorizon": 0.58,
      "simFidelity": 0.62,
      "dataQuality": 0.58,
      "featureRichness": 0.56,
      "agentSkill": 0.65,
      "explorationNoise": 0.35,
      "retryBudget": 0.36,
      "computeBudget": 0.62,
      "opComplexity": 0.58,
      "stepCount": 6,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 54.98,
      "costEfficiency": 44.04,
      "planQuality": 56.36,
      "simFit": 48.44,
      "wasteAvoided": 69.04,
      "confidence": 43.96,
      "overall": 52.71
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 36.74,
      "costEfficiency": 24.2,
      "planQuality": 24.41,
      "simFit": 29.08,
      "wasteAvoided": 25,
      "confidence": 24.02,
      "overall": 28.67
    }
  },
  {
    "id": "dws-021",
    "input": {
      "stateCoverage": 0.66,
      "costAwareness": 0.62,
      "planHorizon": 0.62,
      "simFidelity": 0.6,
      "dataQuality": 0.62,
      "featureRichness": 0.6,
      "agentSkill": 0.63,
      "explorationNoise": 0.24,
      "retryBudget": 0.36,
      "computeBudget": 0.65,
      "opComplexity": 0.62,
      "stepCount": 7,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 61.49,
      "costEfficiency": 53.29,
      "planQuality": 63.24,
      "simFit": 50.64,
      "wasteAvoided": 76.48,
      "confidence": 44.28,
      "overall": 58.9
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 36.1,
      "costEfficiency": 27.2,
      "planQuality": 25,
      "simFit": 28.2,
      "wasteAvoided": 29.59,
      "confidence": 24.28,
      "overall": 29.78
    }
  },
  {
    "id": "dws-022",
    "input": {
      "stateCoverage": 0.7,
      "costAwareness": 0.67,
      "planHorizon": 0.66,
      "simFidelity": 0.65,
      "dataQuality": 0.67,
      "featureRichness": 0.64,
      "agentSkill": 0.67,
      "explorationNoise": 0.23,
      "retryBudget": 0.36,
      "computeBudget": 0.69,
      "opComplexity": 0.67,
      "stepCount": 8,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 62.19,
      "costEfficiency": 53.05,
      "planQuality": 65.44,
      "simFit": 52.29,
      "wasteAvoided": 75.34,
      "confidence": 50.86,
      "overall": 60.05
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 33.14,
      "costEfficiency": 28,
      "planQuality": 25.36,
      "simFit": 28.18,
      "wasteAvoided": 28.06,
      "confidence": 21.62,
      "overall": 28.69
    }
  },
  {
    "id": "dws-023",
    "input": {
      "stateCoverage": 0.75,
      "costAwareness": 0.71,
      "planHorizon": 0.7,
      "simFidelity": 0.7,
      "dataQuality": 0.71,
      "featureRichness": 0.69,
      "agentSkill": 0.71,
      "explorationNoise": 0.22,
      "retryBudget": 0.36,
      "computeBudget": 0.73,
      "opComplexity": 0.71,
      "stepCount": 9,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 66.85,
      "costEfficiency": 56.44,
      "planQuality": 70.16,
      "simFit": 56.14,
      "wasteAvoided": 76.98,
      "confidence": 54.52,
      "overall": 63.89
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 32.46,
      "costEfficiency": 28.74,
      "planQuality": 26.05,
      "simFit": 28.14,
      "wasteAvoided": 28.45,
      "confidence": 20.88,
      "overall": 28.74
    }
  },
  {
    "id": "dws-024",
    "input": {
      "stateCoverage": 0.79,
      "costAwareness": 0.68,
      "planHorizon": 0.65,
      "simFidelity": 0.67,
      "dataQuality": 0.76,
      "featureRichness": 0.65,
      "agentSkill": 0.7,
      "explorationNoise": 0.21,
      "retryBudget": 0.28,
      "computeBudget": 0.77,
      "opComplexity": 0.68,
      "stepCount": 10,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 70.53,
      "costEfficiency": 60.01,
      "planQuality": 72.4,
      "simFit": 58.38,
      "wasteAvoided": 79.64,
      "confidence": 53.34,
      "overall": 66.57
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 34.58,
      "costEfficiency": 30.34,
      "planQuality": 26.74,
      "simFit": 28.28,
      "wasteAvoided": 31.4,
      "confidence": 22.12,
      "overall": 30.35
    }
  },
  {
    "id": "dws-025",
    "input": {
      "stateCoverage": 0.74,
      "costAwareness": 0.72,
      "planHorizon": 0.69,
      "simFidelity": 0.72,
      "dataQuality": 0.7,
      "featureRichness": 0.69,
      "agentSkill": 0.74,
      "explorationNoise": 0.21,
      "retryBudget": 0.28,
      "computeBudget": 0.73,
      "opComplexity": 0.72,
      "stepCount": 11,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 67.54,
      "costEfficiency": 57.08,
      "planQuality": 69.8,
      "simFit": 56.9,
      "wasteAvoided": 78,
      "confidence": 55.88,
      "overall": 64.48
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 31.56,
      "costEfficiency": 29.72,
      "planQuality": 26.53,
      "simFit": 28.24,
      "wasteAvoided": 29.57,
      "confidence": 20.28,
      "overall": 28.87
    }
  },
  {
    "id": "dws-026",
    "input": {
      "stateCoverage": 0.78,
      "costAwareness": 0.76,
      "planHorizon": 0.73,
      "simFidelity": 0.77,
      "dataQuality": 0.74,
      "featureRichness": 0.74,
      "agentSkill": 0.78,
      "explorationNoise": 0.2,
      "retryBudget": 0.29,
      "computeBudget": 0.77,
      "opComplexity": 0.76,
      "stepCount": 12,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 71.95,
      "costEfficiency": 60.42,
      "planQuality": 74.04,
      "simFit": 60.68,
      "wasteAvoided": 79.56,
      "confidence": 59.3,
      "overall": 68.11
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 30.97,
      "costEfficiency": 30.3,
      "planQuality": 27.14,
      "simFit": 28.28,
      "wasteAvoided": 29.82,
      "confidence": 19.7,
      "overall": 28.9
    }
  },
  {
    "id": "dws-027",
    "input": {
      "stateCoverage": 0.83,
      "costAwareness": 0.81,
      "planHorizon": 0.77,
      "simFidelity": 0.74,
      "dataQuality": 0.79,
      "featureRichness": 0.78,
      "agentSkill": 0.76,
      "explorationNoise": 0.19,
      "retryBudget": 0.29,
      "computeBudget": 0.8,
      "opComplexity": 0.81,
      "stepCount": 13,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 77.68,
      "costEfficiency": 67.91,
      "planQuality": 80.41,
      "simFit": 62.86,
      "wasteAvoided": 84.42,
      "confidence": 58.36,
      "overall": 73.21
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 31.09,
      "costEfficiency": 30.96,
      "planQuality": 27.58,
      "simFit": 27.22,
      "wasteAvoided": 32.29,
      "confidence": 20.96,
      "overall": 29.46
    }
  },
  {
    "id": "dws-028",
    "input": {
      "stateCoverage": 0.87,
      "costAwareness": 0.77,
      "planHorizon": 0.81,
      "simFidelity": 0.79,
      "dataQuality": 0.83,
      "featureRichness": 0.74,
      "agentSkill": 0.81,
      "explorationNoise": 0.08,
      "retryBudget": 0.21,
      "computeBudget": 0.84,
      "opComplexity": 0.77,
      "stepCount": 14,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 79.11,
      "costEfficiency": 66.14,
      "planQuality": 82.1,
      "simFit": 64.65,
      "wasteAvoided": 84.74,
      "confidence": 65.98,
      "overall": 74.4
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 28.33,
      "costEfficiency": 34.9,
      "planQuality": 28.41,
      "simFit": 28.38,
      "wasteAvoided": 33.36,
      "confidence": 16.66,
      "overall": 29.56
    }
  },
  {
    "id": "dws-029",
    "input": {
      "stateCoverage": 0.92,
      "costAwareness": 0.82,
      "planHorizon": 0.85,
      "simFidelity": 0.84,
      "dataQuality": 0.88,
      "featureRichness": 0.79,
      "agentSkill": 0.85,
      "explorationNoise": 0.07,
      "retryBudget": 0.21,
      "computeBudget": 0.88,
      "opComplexity": 0.82,
      "stepCount": 15,
      "profile": "balanced"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 83.78,
      "costEfficiency": 69.93,
      "planQuality": 86.82,
      "simFit": 68.62,
      "wasteAvoided": 86.6,
      "confidence": 69.8,
      "overall": 78.38
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 27.41,
      "costEfficiency": 35.7,
      "planQuality": 28.96,
      "simFit": 28.28,
      "wasteAvoided": 33.83,
      "confidence": 15.92,
      "overall": 29.53
    }
  },
  {
    "id": "dws-030",
    "input": {
      "stateCoverage": 0.86,
      "costAwareness": 0.86,
      "planHorizon": 0.8,
      "simFidelity": 0.82,
      "dataQuality": 0.82,
      "featureRichness": 0.83,
      "agentSkill": 0.83,
      "explorationNoise": 0.07,
      "retryBudget": 0.21,
      "computeBudget": 0.84,
      "opComplexity": 0.86,
      "stepCount": 16,
      "profile": "aggressive"
    },
    "expectedWorldModel": {
      "mode": "world-model",
      "outcomeAccuracy": 84.78,
      "costEfficiency": 75.43,
      "planQuality": 85.38,
      "simFit": 68.36,
      "wasteAvoided": 89.88,
      "confidence": 64.56,
      "overall": 79.53
    },
    "expectedTrialError": {
      "mode": "trial-error",
      "outcomeAccuracy": 28.46,
      "costEfficiency": 35.08,
      "planQuality": 28.67,
      "simFit": 27.48,
      "wasteAvoided": 36,
      "confidence": 18.7,
      "overall": 30.1
    }
  }
];
