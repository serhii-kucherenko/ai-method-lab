import type { SafetyInput, SafetyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SafetyInput;
  expectedStructural: SafetyQuality;
  expectedThreshold: SafetyQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ass-001",
    "input": {
      "cfgDelta": 0.1,
      "dfgDelta": 0.13,
      "privilegeBroadening": 0.08,
      "loggingDegradation": 0.08,
      "denyGuardRemoval": 0.1,
      "newSensitiveSinks": 0.09,
      "taskJustification": 0.85,
      "monitorCoverage": 0.19,
      "suspicionThreshold": 4,
      "codeDiffNoise": 0.07,
      "hardeningRegression": 0.08,
      "checkKindCount": 3,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 14.44,
      "falsePositiveBudgetFit": 89.48,
      "syncBlockEffectiveness": 9.91,
      "asyncDetectionLift": 20.22,
      "postureRegressionScore": 0,
      "confidence": 24.87,
      "overall": 26.17
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 57.08,
      "falsePositiveBudgetFit": 55.47,
      "syncBlockEffectiveness": 45.89,
      "asyncDetectionLift": 47.06,
      "postureRegressionScore": 31.96,
      "confidence": 33.94,
      "overall": 50.27
    }
  },
  {
    "id": "ass-002",
    "input": {
      "cfgDelta": 0.15,
      "dfgDelta": 0.17,
      "privilegeBroadening": 0.12,
      "loggingDegradation": 0.13,
      "denyGuardRemoval": 0.14,
      "newSensitiveSinks": 0.13,
      "taskJustification": 0.85,
      "monitorCoverage": 0.23,
      "suspicionThreshold": 5,
      "codeDiffNoise": 0.11,
      "hardeningRegression": 0.12,
      "checkKindCount": 4,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 18.66,
      "falsePositiveBudgetFit": 86.72,
      "syncBlockEffectiveness": 16.08,
      "asyncDetectionLift": 17.93,
      "postureRegressionScore": 3.17,
      "confidence": 30.01,
      "overall": 28.52
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 54.93,
      "falsePositiveBudgetFit": 57.63,
      "syncBlockEffectiveness": 50.24,
      "asyncDetectionLift": 45.33,
      "postureRegressionScore": 33.03,
      "confidence": 34.05,
      "overall": 50.42
    }
  },
  {
    "id": "ass-003",
    "input": {
      "cfgDelta": 0.19,
      "dfgDelta": 0.22,
      "privilegeBroadening": 0.16,
      "loggingDegradation": 0.1,
      "denyGuardRemoval": 0.19,
      "newSensitiveSinks": 0.18,
      "taskJustification": 0.78,
      "monitorCoverage": 0.28,
      "suspicionThreshold": 6,
      "codeDiffNoise": 0.15,
      "hardeningRegression": 0.17,
      "checkKindCount": 5,
      "deployMode": "async",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 24.93,
      "falsePositiveBudgetFit": 85.78,
      "syncBlockEffectiveness": 18.5,
      "asyncDetectionLift": 28.64,
      "postureRegressionScore": 9.1,
      "confidence": 33.47,
      "overall": 33.34
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 54.78,
      "falsePositiveBudgetFit": 60.78,
      "syncBlockEffectiveness": 43.24,
      "asyncDetectionLift": 43.61,
      "postureRegressionScore": 34.88,
      "confidence": 36.13,
      "overall": 49.81
    }
  },
  {
    "id": "ass-004",
    "input": {
      "cfgDelta": 0.24,
      "dfgDelta": 0.18,
      "privilegeBroadening": 0.2,
      "loggingDegradation": 0.15,
      "denyGuardRemoval": 0.23,
      "newSensitiveSinks": 0.14,
      "taskJustification": 0.78,
      "monitorCoverage": 0.24,
      "suspicionThreshold": 7,
      "codeDiffNoise": 0.19,
      "hardeningRegression": 0.21,
      "checkKindCount": 6,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 23.17,
      "falsePositiveBudgetFit": 79.38,
      "syncBlockEffectiveness": 21.4,
      "asyncDetectionLift": 21.62,
      "postureRegressionScore": 10.75,
      "confidence": 37.38,
      "overall": 31.64
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 50.31,
      "falsePositiveBudgetFit": 62.03,
      "syncBlockEffectiveness": 47.01,
      "asyncDetectionLift": 41.66,
      "postureRegressionScore": 35.95,
      "confidence": 34.36,
      "overall": 48.75
    }
  },
  {
    "id": "ass-005",
    "input": {
      "cfgDelta": 0.18,
      "dfgDelta": 0.23,
      "privilegeBroadening": 0.24,
      "loggingDegradation": 0.2,
      "denyGuardRemoval": 0.18,
      "newSensitiveSinks": 0.19,
      "taskJustification": 0.77,
      "monitorCoverage": 0.29,
      "suspicionThreshold": 8,
      "codeDiffNoise": 0.23,
      "hardeningRegression": 0.15,
      "checkKindCount": 7,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 25.21,
      "falsePositiveBudgetFit": 76.52,
      "syncBlockEffectiveness": 18.87,
      "asyncDetectionLift": 29.64,
      "postureRegressionScore": 11.35,
      "confidence": 42,
      "overall": 33.06
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 48.83,
      "falsePositiveBudgetFit": 64.35,
      "syncBlockEffectiveness": 40.03,
      "asyncDetectionLift": 40.48,
      "postureRegressionScore": 36.93,
      "confidence": 34.69,
      "overall": 47.46
    }
  },
  {
    "id": "ass-006",
    "input": {
      "cfgDelta": 0.23,
      "dfgDelta": 0.27,
      "privilegeBroadening": 0.19,
      "loggingDegradation": 0.17,
      "denyGuardRemoval": 0.22,
      "newSensitiveSinks": 0.23,
      "taskJustification": 0.71,
      "monitorCoverage": 0.33,
      "suspicionThreshold": 9,
      "codeDiffNoise": 0.27,
      "hardeningRegression": 0.2,
      "checkKindCount": 8,
      "deployMode": "sync",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 30.49,
      "falsePositiveBudgetFit": 75.68,
      "syncBlockEffectiveness": 27.34,
      "asyncDetectionLift": 27.05,
      "postureRegressionScore": 14.9,
      "confidence": 45.14,
      "overall": 36.33
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 49.16,
      "falsePositiveBudgetFit": 67.65,
      "syncBlockEffectiveness": 45.6,
      "asyncDetectionLift": 39.14,
      "postureRegressionScore": 36.68,
      "confidence": 36.98,
      "overall": 49.01
    }
  },
  {
    "id": "ass-007",
    "input": {
      "cfgDelta": 0.27,
      "dfgDelta": 0.31,
      "privilegeBroadening": 0.23,
      "loggingDegradation": 0.22,
      "denyGuardRemoval": 0.26,
      "newSensitiveSinks": 0.28,
      "taskJustification": 0.71,
      "monitorCoverage": 0.37,
      "suspicionThreshold": 10,
      "codeDiffNoise": 0.2,
      "hardeningRegression": 0.24,
      "checkKindCount": 9,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 33.66,
      "falsePositiveBudgetFit": 72.34,
      "syncBlockEffectiveness": 25.37,
      "asyncDetectionLift": 36.31,
      "postureRegressionScore": 18.76,
      "confidence": 53.3,
      "overall": 38.88
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 42.99,
      "falsePositiveBudgetFit": 71.88,
      "syncBlockEffectiveness": 37.4,
      "asyncDetectionLift": 36.06,
      "postureRegressionScore": 37.83,
      "confidence": 33.97,
      "overall": 45.78
    }
  },
  {
    "id": "ass-008",
    "input": {
      "cfgDelta": 0.32,
      "dfgDelta": 0.28,
      "privilegeBroadening": 0.27,
      "loggingDegradation": 0.27,
      "denyGuardRemoval": 0.31,
      "newSensitiveSinks": 0.24,
      "taskJustification": 0.7,
      "monitorCoverage": 0.34,
      "suspicionThreshold": 3,
      "codeDiffNoise": 0.24,
      "hardeningRegression": 0.28,
      "checkKindCount": 10,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 34.01,
      "falsePositiveBudgetFit": 86.44,
      "syncBlockEffectiveness": 31.71,
      "asyncDetectionLift": 30.52,
      "postureRegressionScore": 21.48,
      "confidence": 55.62,
      "overall": 41.99
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 59.72,
      "falsePositiveBudgetFit": 46.11,
      "syncBlockEffectiveness": 48.53,
      "asyncDetectionLift": 48.52,
      "postureRegressionScore": 39.04,
      "confidence": 34.18,
      "overall": 50.42
    }
  },
  {
    "id": "ass-009",
    "input": {
      "cfgDelta": 0.36,
      "dfgDelta": 0.32,
      "privilegeBroadening": 0.31,
      "loggingDegradation": 0.24,
      "denyGuardRemoval": 0.35,
      "newSensitiveSinks": 0.29,
      "taskJustification": 0.64,
      "monitorCoverage": 0.38,
      "suspicionThreshold": 4,
      "codeDiffNoise": 0.28,
      "hardeningRegression": 0.33,
      "checkKindCount": 11,
      "deployMode": "async",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 40.65,
      "falsePositiveBudgetFit": 85.6,
      "syncBlockEffectiveness": 32.3,
      "asyncDetectionLift": 41.19,
      "postureRegressionScore": 27.44,
      "confidence": 58.67,
      "overall": 46.49
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 59.57,
      "falsePositiveBudgetFit": 49.28,
      "syncBlockEffectiveness": 41.59,
      "asyncDetectionLift": 46.79,
      "postureRegressionScore": 40.75,
      "confidence": 36.29,
      "overall": 49.81
    }
  },
  {
    "id": "ass-010",
    "input": {
      "cfgDelta": 0.31,
      "dfgDelta": 0.37,
      "privilegeBroadening": 0.35,
      "loggingDegradation": 0.29,
      "denyGuardRemoval": 0.3,
      "newSensitiveSinks": 0.33,
      "taskJustification": 0.63,
      "monitorCoverage": 0.43,
      "suspicionThreshold": 5,
      "codeDiffNoise": 0.32,
      "hardeningRegression": 0.27,
      "checkKindCount": 2,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 35.23,
      "falsePositiveBudgetFit": 79.74,
      "syncBlockEffectiveness": 31.29,
      "asyncDetectionLift": 33.57,
      "postureRegressionScore": 26.88,
      "confidence": 30.3,
      "overall": 40.12
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 56.13,
      "falsePositiveBudgetFit": 50.61,
      "syncBlockEffectiveness": 45.95,
      "asyncDetectionLift": 45.64,
      "postureRegressionScore": 41.65,
      "confidence": 34.63,
      "overall": 49.35
    }
  },
  {
    "id": "ass-011",
    "input": {
      "cfgDelta": 0.36,
      "dfgDelta": 0.41,
      "privilegeBroadening": 0.39,
      "loggingDegradation": 0.34,
      "denyGuardRemoval": 0.34,
      "newSensitiveSinks": 0.38,
      "taskJustification": 0.63,
      "monitorCoverage": 0.47,
      "suspicionThreshold": 6,
      "codeDiffNoise": 0.36,
      "hardeningRegression": 0.31,
      "checkKindCount": 3,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 39.53,
      "falsePositiveBudgetFit": 76.98,
      "syncBlockEffectiveness": 29.82,
      "asyncDetectionLift": 43.37,
      "postureRegressionScore": 31.59,
      "confidence": 35.44,
      "overall": 43.11
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 53.95,
      "falsePositiveBudgetFit": 52.77,
      "syncBlockEffectiveness": 38.26,
      "asyncDetectionLift": 43.88,
      "postureRegressionScore": 42.75,
      "confidence": 34.73,
      "overall": 47.57
    }
  },
  {
    "id": "ass-012",
    "input": {
      "cfgDelta": 0.4,
      "dfgDelta": 0.38,
      "privilegeBroadening": 0.34,
      "loggingDegradation": 0.31,
      "denyGuardRemoval": 0.39,
      "newSensitiveSinks": 0.34,
      "taskJustification": 0.56,
      "monitorCoverage": 0.44,
      "suspicionThreshold": 7,
      "codeDiffNoise": 0.4,
      "hardeningRegression": 0.36,
      "checkKindCount": 4,
      "deployMode": "sync",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 41.52,
      "falsePositiveBudgetFit": 75.4,
      "syncBlockEffectiveness": 38.43,
      "asyncDetectionLift": 37.57,
      "postureRegressionScore": 33.73,
      "confidence": 35.67,
      "overall": 44.46
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 53.95,
      "falsePositiveBudgetFit": 56.13,
      "syncBlockEffectiveness": 43.89,
      "asyncDetectionLift": 42.32,
      "postureRegressionScore": 42.69,
      "confidence": 37.1,
      "overall": 49
    }
  },
  {
    "id": "ass-013",
    "input": {
      "cfgDelta": 0.45,
      "dfgDelta": 0.42,
      "privilegeBroadening": 0.38,
      "loggingDegradation": 0.36,
      "denyGuardRemoval": 0.43,
      "newSensitiveSinks": 0.39,
      "taskJustification": 0.56,
      "monitorCoverage": 0.48,
      "suspicionThreshold": 8,
      "codeDiffNoise": 0.43,
      "hardeningRegression": 0.4,
      "checkKindCount": 5,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 43.31,
      "falsePositiveBudgetFit": 69.86,
      "syncBlockEffectiveness": 33.29,
      "asyncDetectionLift": 46.16,
      "postureRegressionScore": 37.2,
      "confidence": 42.91,
      "overall": 45.35
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 49.58,
      "falsePositiveBudgetFit": 57.56,
      "syncBlockEffectiveness": 35.52,
      "asyncDetectionLift": 40.44,
      "postureRegressionScore": 43.8,
      "confidence": 35.1,
      "overall": 46.07
    }
  },
  {
    "id": "ass-014",
    "input": {
      "cfgDelta": 0.49,
      "dfgDelta": 0.46,
      "privilegeBroadening": 0.42,
      "loggingDegradation": 0.41,
      "denyGuardRemoval": 0.47,
      "newSensitiveSinks": 0.43,
      "taskJustification": 0.56,
      "monitorCoverage": 0.52,
      "suspicionThreshold": 9,
      "codeDiffNoise": 0.37,
      "hardeningRegression": 0.44,
      "checkKindCount": 6,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 48.19,
      "falsePositiveBudgetFit": 69.3,
      "syncBlockEffectiveness": 44.7,
      "asyncDetectionLift": 44.19,
      "postureRegressionScore": 41.6,
      "confidence": 48.96,
      "overall": 49.61
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 45.64,
      "falsePositiveBudgetFit": 62.53,
      "syncBlockEffectiveness": 40.04,
      "asyncDetectionLift": 37.52,
      "postureRegressionScore": 44.9,
      "confidence": 34.22,
      "overall": 45.93
    }
  },
  {
    "id": "ass-015",
    "input": {
      "cfgDelta": 0.44,
      "dfgDelta": 0.51,
      "privilegeBroadening": 0.46,
      "loggingDegradation": 0.38,
      "denyGuardRemoval": 0.42,
      "newSensitiveSinks": 0.48,
      "taskJustification": 0.49,
      "monitorCoverage": 0.57,
      "suspicionThreshold": 10,
      "codeDiffNoise": 0.41,
      "hardeningRegression": 0.39,
      "checkKindCount": 7,
      "deployMode": "async",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 53.67,
      "falsePositiveBudgetFit": 68.36,
      "syncBlockEffectiveness": 41.41,
      "asyncDetectionLift": 53.6,
      "postureRegressionScore": 44.14,
      "confidence": 51.67,
      "overall": 52.39
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 46.19,
      "falsePositiveBudgetFit": 65.86,
      "syncBlockEffectiveness": 33.8,
      "asyncDetectionLift": 36.37,
      "postureRegressionScore": 46.41,
      "confidence": 36.56,
      "overall": 45.81
    }
  },
  {
    "id": "ass-016",
    "input": {
      "cfgDelta": 0.48,
      "dfgDelta": 0.47,
      "privilegeBroadening": 0.49,
      "loggingDegradation": 0.43,
      "denyGuardRemoval": 0.46,
      "newSensitiveSinks": 0.44,
      "taskJustification": 0.49,
      "monitorCoverage": 0.53,
      "suspicionThreshold": 3,
      "codeDiffNoise": 0.45,
      "hardeningRegression": 0.43,
      "checkKindCount": 8,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 49.88,
      "falsePositiveBudgetFit": 79.56,
      "syncBlockEffectiveness": 46.38,
      "asyncDetectionLift": 45.54,
      "postureRegressionScore": 44.49,
      "confidence": 55.5,
      "overall": 53.1
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 60.97,
      "falsePositiveBudgetFit": 39.13,
      "syncBlockEffectiveness": 44.34,
      "asyncDetectionLift": 48.86,
      "postureRegressionScore": 47.31,
      "confidence": 34.8,
      "overall": 49.37
    }
  },
  {
    "id": "ass-017",
    "input": {
      "cfgDelta": 0.53,
      "dfgDelta": 0.52,
      "privilegeBroadening": 0.53,
      "loggingDegradation": 0.48,
      "denyGuardRemoval": 0.51,
      "newSensitiveSinks": 0.49,
      "taskJustification": 0.48,
      "monitorCoverage": 0.58,
      "suspicionThreshold": 4,
      "codeDiffNoise": 0.49,
      "hardeningRegression": 0.48,
      "checkKindCount": 9,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 54.84,
      "falsePositiveBudgetFit": 76.7,
      "syncBlockEffectiveness": 42.86,
      "asyncDetectionLift": 55.92,
      "postureRegressionScore": 49.82,
      "confidence": 61.04,
      "overall": 55.99
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 58.76,
      "falsePositiveBudgetFit": 41.25,
      "syncBlockEffectiveness": 36.58,
      "asyncDetectionLift": 47.08,
      "postureRegressionScore": 48.58,
      "confidence": 34.86,
      "overall": 47.56
    }
  },
  {
    "id": "ass-018",
    "input": {
      "cfgDelta": 0.57,
      "dfgDelta": 0.56,
      "privilegeBroadening": 0.48,
      "loggingDegradation": 0.45,
      "denyGuardRemoval": 0.55,
      "newSensitiveSinks": 0.53,
      "taskJustification": 0.42,
      "monitorCoverage": 0.62,
      "suspicionThreshold": 5,
      "codeDiffNoise": 0.53,
      "hardeningRegression": 0.52,
      "checkKindCount": 10,
      "deployMode": "sync",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 61.9,
      "falsePositiveBudgetFit": 75.86,
      "syncBlockEffectiveness": 58.22,
      "asyncDetectionLift": 54.15,
      "postureRegressionScore": 54.2,
      "confidence": 64.09,
      "overall": 61.49
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 59.11,
      "falsePositiveBudgetFit": 44.55,
      "syncBlockEffectiveness": 42.17,
      "asyncDetectionLift": 45.76,
      "postureRegressionScore": 48.35,
      "confidence": 37.16,
      "overall": 49.12
    }
  },
  {
    "id": "ass-019",
    "input": {
      "cfgDelta": 0.62,
      "dfgDelta": 0.6,
      "privilegeBroadening": 0.52,
      "loggingDegradation": 0.5,
      "denyGuardRemoval": 0.59,
      "newSensitiveSinks": 0.58,
      "taskJustification": 0.42,
      "monitorCoverage": 0.66,
      "suspicionThreshold": 6,
      "codeDiffNoise": 0.56,
      "hardeningRegression": 0.56,
      "checkKindCount": 11,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 62.44,
      "falsePositiveBudgetFit": 70.32,
      "syncBlockEffectiveness": 48.64,
      "asyncDetectionLift": 62.15,
      "postureRegressionScore": 57.09,
      "confidence": 71.33,
      "overall": 60.9
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 54.75,
      "falsePositiveBudgetFit": 45.99,
      "syncBlockEffectiveness": 33.8,
      "asyncDetectionLift": 43.89,
      "postureRegressionScore": 49.45,
      "confidence": 35.16,
      "overall": 46.2
    }
  },
  {
    "id": "ass-020",
    "input": {
      "cfgDelta": 0.56,
      "dfgDelta": 0.57,
      "privilegeBroadening": 0.56,
      "loggingDegradation": 0.55,
      "denyGuardRemoval": 0.54,
      "newSensitiveSinks": 0.54,
      "taskJustification": 0.41,
      "monitorCoverage": 0.63,
      "suspicionThreshold": 7,
      "codeDiffNoise": 0.6,
      "hardeningRegression": 0.51,
      "checkKindCount": 2,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 54.94,
      "falsePositiveBudgetFit": 66.82,
      "syncBlockEffectiveness": 50.65,
      "asyncDetectionLift": 51.71,
      "postureRegressionScore": 55.35,
      "confidence": 37.65,
      "overall": 53.97
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 52.96,
      "falsePositiveBudgetFit": 48.4,
      "syncBlockEffectiveness": 38.95,
      "asyncDetectionLift": 42.49,
      "postureRegressionScore": 50.42,
      "confidence": 35.61,
      "overall": 46.73
    }
  },
  {
    "id": "ass-021",
    "input": {
      "cfgDelta": 0.61,
      "dfgDelta": 0.61,
      "privilegeBroadening": 0.6,
      "loggingDegradation": 0.52,
      "denyGuardRemoval": 0.58,
      "newSensitiveSinks": 0.59,
      "taskJustification": 0.35,
      "monitorCoverage": 0.67,
      "suspicionThreshold": 8,
      "codeDiffNoise": 0.54,
      "hardeningRegression": 0.55,
      "checkKindCount": 3,
      "deployMode": "async",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 63.95,
      "falsePositiveBudgetFit": 68.18,
      "syncBlockEffectiveness": 50.12,
      "asyncDetectionLift": 63.48,
      "postureRegressionScore": 62.26,
      "confidence": 41.79,
      "overall": 59.59
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 51.03,
      "falsePositiveBudgetFit": 54.38,
      "syncBlockEffectiveness": 32.2,
      "asyncDetectionLift": 39.59,
      "postureRegressionScore": 52.07,
      "confidence": 36.73,
      "overall": 45.83
    }
  },
  {
    "id": "ass-022",
    "input": {
      "cfgDelta": 0.66,
      "dfgDelta": 0.66,
      "privilegeBroadening": 0.64,
      "loggingDegradation": 0.57,
      "denyGuardRemoval": 0.63,
      "newSensitiveSinks": 0.63,
      "taskJustification": 0.34,
      "monitorCoverage": 0.72,
      "suspicionThreshold": 9,
      "codeDiffNoise": 0.58,
      "hardeningRegression": 0.59,
      "checkKindCount": 4,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 64.81,
      "falsePositiveBudgetFit": 62.32,
      "syncBlockEffectiveness": 59.93,
      "asyncDetectionLift": 59.8,
      "postureRegressionScore": 65.22,
      "confidence": 49.33,
      "overall": 61.23
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 46.89,
      "falsePositiveBudgetFit": 55.52,
      "syncBlockEffectiveness": 35.8,
      "asyncDetectionLift": 37.86,
      "postureRegressionScore": 53.27,
      "confidence": 34.81,
      "overall": 44.87
    }
  },
  {
    "id": "ass-023",
    "input": {
      "cfgDelta": 0.7,
      "dfgDelta": 0.7,
      "privilegeBroadening": 0.68,
      "loggingDegradation": 0.62,
      "denyGuardRemoval": 0.67,
      "newSensitiveSinks": 0.68,
      "taskJustification": 0.34,
      "monitorCoverage": 0.76,
      "suspicionThreshold": 10,
      "codeDiffNoise": 0.62,
      "hardeningRegression": 0.64,
      "checkKindCount": 5,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 69.02,
      "falsePositiveBudgetFit": 59.56,
      "syncBlockEffectiveness": 53.7,
      "asyncDetectionLift": 69.59,
      "postureRegressionScore": 69.93,
      "confidence": 54.39,
      "overall": 63.14
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 44.68,
      "falsePositiveBudgetFit": 57.67,
      "syncBlockEffectiveness": 28.09,
      "asyncDetectionLift": 36.08,
      "postureRegressionScore": 54.44,
      "confidence": 34.9,
      "overall": 43.07
    }
  },
  {
    "id": "ass-024",
    "input": {
      "cfgDelta": 0.75,
      "dfgDelta": 0.67,
      "privilegeBroadening": 0.63,
      "loggingDegradation": 0.59,
      "denyGuardRemoval": 0.72,
      "newSensitiveSinks": 0.64,
      "taskJustification": 0.27,
      "monitorCoverage": 0.73,
      "suspicionThreshold": 3,
      "codeDiffNoise": 0.66,
      "hardeningRegression": 0.68,
      "checkKindCount": 6,
      "deployMode": "sync",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 73.07,
      "falsePositiveBudgetFit": 75.58,
      "syncBlockEffectiveness": 69.47,
      "asyncDetectionLift": 64.74,
      "postureRegressionScore": 73.16,
      "confidence": 54.7,
      "overall": 69.72
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 63.91,
      "falsePositiveBudgetFit": 33.03,
      "syncBlockEffectiveness": 40.46,
      "asyncDetectionLift": 48.94,
      "postureRegressionScore": 54.31,
      "confidence": 37.29,
      "overall": 49.11
    }
  },
  {
    "id": "ass-025",
    "input": {
      "cfgDelta": 0.69,
      "dfgDelta": 0.71,
      "privilegeBroadening": 0.67,
      "loggingDegradation": 0.64,
      "denyGuardRemoval": 0.66,
      "newSensitiveSinks": 0.69,
      "taskJustification": 0.27,
      "monitorCoverage": 0.77,
      "suspicionThreshold": 4,
      "codeDiffNoise": 0.69,
      "hardeningRegression": 0.62,
      "checkKindCount": 7,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 70.02,
      "falsePositiveBudgetFit": 70.04,
      "syncBlockEffectiveness": 54.14,
      "asyncDetectionLift": 70.09,
      "postureRegressionScore": 70.94,
      "confidence": 61.02,
      "overall": 65.9
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 60.24,
      "falsePositiveBudgetFit": 34.66,
      "syncBlockEffectiveness": 32.85,
      "asyncDetectionLift": 47.64,
      "postureRegressionScore": 55.16,
      "confidence": 35.54,
      "overall": 46.69
    }
  },
  {
    "id": "ass-026",
    "input": {
      "cfgDelta": 0.74,
      "dfgDelta": 0.75,
      "privilegeBroadening": 0.71,
      "loggingDegradation": 0.69,
      "denyGuardRemoval": 0.7,
      "newSensitiveSinks": 0.73,
      "taskJustification": 0.27,
      "monitorCoverage": 0.81,
      "suspicionThreshold": 5,
      "codeDiffNoise": 0.73,
      "hardeningRegression": 0.67,
      "checkKindCount": 8,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 74.29,
      "falsePositiveBudgetFit": 67.28,
      "syncBlockEffectiveness": 69.22,
      "asyncDetectionLift": 67.86,
      "postureRegressionScore": 75.59,
      "confidence": 66.16,
      "overall": 70.35
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 58.07,
      "falsePositiveBudgetFit": 36.82,
      "syncBlockEffectiveness": 37.18,
      "asyncDetectionLift": 45.9,
      "postureRegressionScore": 56.25,
      "confidence": 35.65,
      "overall": 46.83
    }
  },
  {
    "id": "ass-027",
    "input": {
      "cfgDelta": 0.78,
      "dfgDelta": 0.8,
      "privilegeBroadening": 0.75,
      "loggingDegradation": 0.66,
      "denyGuardRemoval": 0.75,
      "newSensitiveSinks": 0.78,
      "taskJustification": 0.2,
      "monitorCoverage": 0.86,
      "suspicionThreshold": 6,
      "codeDiffNoise": 0.77,
      "hardeningRegression": 0.71,
      "checkKindCount": 9,
      "deployMode": "async",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 84.28,
      "falsePositiveBudgetFit": 66.34,
      "syncBlockEffectiveness": 66.58,
      "asyncDetectionLift": 80.32,
      "postureRegressionScore": 83.45,
      "confidence": 69.62,
      "overall": 75.56
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 57.95,
      "falsePositiveBudgetFit": 39.97,
      "syncBlockEffectiveness": 30.2,
      "asyncDetectionLift": 44.19,
      "postureRegressionScore": 58.07,
      "confidence": 37.74,
      "overall": 46.23
    }
  },
  {
    "id": "ass-028",
    "input": {
      "cfgDelta": 0.83,
      "dfgDelta": 0.76,
      "privilegeBroadening": 0.79,
      "loggingDegradation": 0.71,
      "denyGuardRemoval": 0.79,
      "newSensitiveSinks": 0.74,
      "taskJustification": 0.2,
      "monitorCoverage": 0.82,
      "suspicionThreshold": 7,
      "codeDiffNoise": 0.71,
      "hardeningRegression": 0.75,
      "checkKindCount": 10,
      "deployMode": "sync",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 79.55,
      "falsePositiveBudgetFit": 62.14,
      "syncBlockEffectiveness": 75.15,
      "asyncDetectionLift": 71.87,
      "postureRegressionScore": 83.05,
      "confidence": 74.53,
      "overall": 74.29
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 51.68,
      "falsePositiveBudgetFit": 44.02,
      "syncBlockEffectiveness": 34.15,
      "asyncDetectionLift": 41.04,
      "postureRegressionScore": 59.14,
      "confidence": 34.97,
      "overall": 44.87
    }
  },
  {
    "id": "ass-029",
    "input": {
      "cfgDelta": 0.87,
      "dfgDelta": 0.81,
      "privilegeBroadening": 0.83,
      "loggingDegradation": 0.76,
      "denyGuardRemoval": 0.84,
      "newSensitiveSinks": 0.79,
      "taskJustification": 0.19,
      "monitorCoverage": 0.87,
      "suspicionThreshold": 8,
      "codeDiffNoise": 0.75,
      "hardeningRegression": 0.8,
      "checkKindCount": 11,
      "deployMode": "async",
      "profile": "balanced"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 84.38,
      "falsePositiveBudgetFit": 59.28,
      "syncBlockEffectiveness": 66.79,
      "asyncDetectionLift": 82.19,
      "postureRegressionScore": 88.25,
      "confidence": 79.99,
      "overall": 76.06
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 49.47,
      "falsePositiveBudgetFit": 46.15,
      "syncBlockEffectiveness": 26.38,
      "asyncDetectionLift": 39.27,
      "postureRegressionScore": 60.45,
      "confidence": 35.03,
      "overall": 43.07
    }
  },
  {
    "id": "ass-030",
    "input": {
      "cfgDelta": 0.82,
      "dfgDelta": 0.85,
      "privilegeBroadening": 0.78,
      "loggingDegradation": 0.74,
      "denyGuardRemoval": 0.78,
      "newSensitiveSinks": 0.83,
      "taskJustification": 0.13,
      "monitorCoverage": 0.91,
      "suspicionThreshold": 9,
      "codeDiffNoise": 0.78,
      "hardeningRegression": 0.74,
      "checkKindCount": 2,
      "deployMode": "sync",
      "profile": "strict"
    },
    "expectedStructural": {
      "mode": "structural",
      "structuralCatchRate": 85.42,
      "falsePositiveBudgetFit": 58.66,
      "syncBlockEffectiveness": 79.94,
      "asyncDetectionLift": 76.64,
      "postureRegressionScore": 89.37,
      "confidence": 47.31,
      "overall": 75.62
    },
    "expectedThreshold": {
      "mode": "threshold",
      "structuralCatchRate": 50.31,
      "falsePositiveBudgetFit": 49.91,
      "syncBlockEffectiveness": 32.71,
      "asyncDetectionLift": 38.38,
      "postureRegressionScore": 59.91,
      "confidence": 37.47,
      "overall": 45.07
    }
  }
];
