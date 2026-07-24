import type { LadderInput, LadderQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LadderInput;
  expectedFbAware: LadderQuality;
  expectedDroppedFb: LadderQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "lbs-001",
    "input": {
      "fbBodyRetention": 0.18,
      "nestedFbDepth": 0.11,
      "timerCounterComplexity": 0.08,
      "interlockBypassRisk": 0.08,
      "actuatorReach": 0.1,
      "operatorOverrideGap": 0.09,
      "hiddenTimerHint": 0.15,
      "scanCycleBoundTightness": 0.19,
      "symbolicPathCoverage": 0.16,
      "triggerRecoverability": 0.15,
      "ladderNoise": 0.7,
      "fbInstanceCount": 3,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 7.17,
      "triggerRecovery": 8.56,
      "fbFidelity": 12.78,
      "symbolicCoverage": 7.99,
      "falseAlarmFit": 54.93,
      "confidence": 13.4,
      "overall": 13.87
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 30.48,
      "triggerRecovery": 31.26,
      "fbFidelity": 18.74,
      "symbolicCoverage": 37.26,
      "falseAlarmFit": 40.26,
      "confidence": 30.92,
      "overall": 31.33
    }
  },
  {
    "id": "lbs-002",
    "input": {
      "fbBodyRetention": 0.22,
      "nestedFbDepth": 0.15,
      "timerCounterComplexity": 0.12,
      "interlockBypassRisk": 0.13,
      "actuatorReach": 0.14,
      "operatorOverrideGap": 0.13,
      "hiddenTimerHint": 0.19,
      "scanCycleBoundTightness": 0.23,
      "symbolicPathCoverage": 0.2,
      "triggerRecoverability": 0.19,
      "ladderNoise": 0.69,
      "fbInstanceCount": 4,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 11.84,
      "triggerRecovery": 12.35,
      "fbFidelity": 17.1,
      "symbolicCoverage": 11.81,
      "falseAlarmFit": 55.47,
      "confidence": 16.82,
      "overall": 17.66
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 29.76,
      "triggerRecovery": 30.94,
      "fbFidelity": 18.78,
      "symbolicCoverage": 37.34,
      "falseAlarmFit": 40.6,
      "confidence": 30.12,
      "overall": 31
    }
  },
  {
    "id": "lbs-003",
    "input": {
      "fbBodyRetention": 0.27,
      "nestedFbDepth": 0.2,
      "timerCounterComplexity": 0.16,
      "interlockBypassRisk": 0.1,
      "actuatorReach": 0.19,
      "operatorOverrideGap": 0.18,
      "hiddenTimerHint": 0.18,
      "scanCycleBoundTightness": 0.28,
      "symbolicPathCoverage": 0.24,
      "triggerRecoverability": 0.24,
      "ladderNoise": 0.69,
      "fbInstanceCount": 5,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 16.27,
      "triggerRecovery": 18.01,
      "fbFidelity": 23.56,
      "symbolicCoverage": 16.98,
      "falseAlarmFit": 59.96,
      "confidence": 17.4,
      "overall": 22.52
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 29.71,
      "triggerRecovery": 30.46,
      "fbFidelity": 18.74,
      "symbolicCoverage": 37.22,
      "falseAlarmFit": 42.84,
      "confidence": 31.22,
      "overall": 31.18
    }
  },
  {
    "id": "lbs-004",
    "input": {
      "fbBodyRetention": 0.31,
      "nestedFbDepth": 0.16,
      "timerCounterComplexity": 0.2,
      "interlockBypassRisk": 0.15,
      "actuatorReach": 0.23,
      "operatorOverrideGap": 0.14,
      "hiddenTimerHint": 0.22,
      "scanCycleBoundTightness": 0.24,
      "symbolicPathCoverage": 0.28,
      "triggerRecoverability": 0.2,
      "ladderNoise": 0.68,
      "fbInstanceCount": 6,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 18.21,
      "triggerRecovery": 15.41,
      "fbFidelity": 25.56,
      "symbolicCoverage": 17.79,
      "falseAlarmFit": 56.68,
      "confidence": 23.82,
      "overall": 23.15
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 28.83,
      "triggerRecovery": 30.3,
      "fbFidelity": 20.07,
      "symbolicCoverage": 38.1,
      "falseAlarmFit": 41.26,
      "confidence": 29.06,
      "overall": 30.82
    }
  },
  {
    "id": "lbs-005",
    "input": {
      "fbBodyRetention": 0.26,
      "nestedFbDepth": 0.21,
      "timerCounterComplexity": 0.24,
      "interlockBypassRisk": 0.2,
      "actuatorReach": 0.18,
      "operatorOverrideGap": 0.18,
      "hiddenTimerHint": 0.27,
      "scanCycleBoundTightness": 0.29,
      "symbolicPathCoverage": 0.25,
      "triggerRecoverability": 0.25,
      "ladderNoise": 0.67,
      "fbInstanceCount": 7,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 19.57,
      "triggerRecovery": 18.16,
      "fbFidelity": 23.52,
      "symbolicCoverage": 17,
      "falseAlarmFit": 56.19,
      "confidence": 23.36,
      "overall": 23.58
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 29.37,
      "triggerRecovery": 30.66,
      "fbFidelity": 19.31,
      "symbolicCoverage": 37.44,
      "falseAlarmFit": 41.07,
      "confidence": 29.08,
      "overall": 30.86
    }
  },
  {
    "id": "lbs-006",
    "input": {
      "fbBodyRetention": 0.3,
      "nestedFbDepth": 0.25,
      "timerCounterComplexity": 0.19,
      "interlockBypassRisk": 0.18,
      "actuatorReach": 0.22,
      "operatorOverrideGap": 0.23,
      "hiddenTimerHint": 0.25,
      "scanCycleBoundTightness": 0.33,
      "symbolicPathCoverage": 0.29,
      "triggerRecoverability": 0.29,
      "ladderNoise": 0.66,
      "fbInstanceCount": 8,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 23.39,
      "triggerRecovery": 23.67,
      "fbFidelity": 29.35,
      "symbolicCoverage": 22.18,
      "falseAlarmFit": 61.04,
      "confidence": 23.78,
      "overall": 28.15
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 29.48,
      "triggerRecovery": 30.34,
      "fbFidelity": 19.36,
      "symbolicCoverage": 37.52,
      "falseAlarmFit": 43.56,
      "confidence": 30.28,
      "overall": 31.2
    }
  },
  {
    "id": "lbs-007",
    "input": {
      "fbBodyRetention": 0.35,
      "nestedFbDepth": 0.29,
      "timerCounterComplexity": 0.23,
      "interlockBypassRisk": 0.22,
      "actuatorReach": 0.26,
      "operatorOverrideGap": 0.27,
      "hiddenTimerHint": 0.29,
      "scanCycleBoundTightness": 0.37,
      "symbolicPathCoverage": 0.33,
      "triggerRecoverability": 0.33,
      "ladderNoise": 0.55,
      "fbInstanceCount": 9,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 27.59,
      "triggerRecovery": 27.04,
      "fbFidelity": 33.48,
      "symbolicCoverage": 25.8,
      "falseAlarmFit": 60,
      "confidence": 31.46,
      "overall": 31.83
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 27.14,
      "triggerRecovery": 29.88,
      "fbFidelity": 19.48,
      "symbolicCoverage": 37.5,
      "falseAlarmFit": 43.7,
      "confidence": 26.58,
      "overall": 30.04
    }
  },
  {
    "id": "lbs-008",
    "input": {
      "fbBodyRetention": 0.39,
      "nestedFbDepth": 0.26,
      "timerCounterComplexity": 0.27,
      "interlockBypassRisk": 0.27,
      "actuatorReach": 0.31,
      "operatorOverrideGap": 0.23,
      "hiddenTimerHint": 0.34,
      "scanCycleBoundTightness": 0.34,
      "symbolicPathCoverage": 0.37,
      "triggerRecoverability": 0.3,
      "ladderNoise": 0.54,
      "fbInstanceCount": 10,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 31.39,
      "triggerRecovery": 26.92,
      "fbFidelity": 36.96,
      "symbolicCoverage": 27.98,
      "falseAlarmFit": 60.68,
      "confidence": 34.88,
      "overall": 34.14
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 28.15,
      "triggerRecovery": 29.7,
      "fbFidelity": 20.65,
      "symbolicCoverage": 38.28,
      "falseAlarmFit": 44.1,
      "confidence": 26.34,
      "overall": 30.63
    }
  },
  {
    "id": "lbs-009",
    "input": {
      "fbBodyRetention": 0.44,
      "nestedFbDepth": 0.3,
      "timerCounterComplexity": 0.31,
      "interlockBypassRisk": 0.25,
      "actuatorReach": 0.35,
      "operatorOverrideGap": 0.28,
      "hiddenTimerHint": 0.32,
      "scanCycleBoundTightness": 0.38,
      "symbolicPathCoverage": 0.41,
      "triggerRecoverability": 0.34,
      "ladderNoise": 0.54,
      "fbInstanceCount": 11,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 36.57,
      "triggerRecovery": 33.12,
      "fbFidelity": 44.16,
      "symbolicCoverage": 33.7,
      "falseAlarmFit": 65.19,
      "confidence": 35.46,
      "overall": 39.55
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 28.24,
      "triggerRecovery": 29.24,
      "fbFidelity": 20.77,
      "symbolicCoverage": 38.26,
      "falseAlarmFit": 46.36,
      "confidence": 27.52,
      "overall": 30.9
    }
  },
  {
    "id": "lbs-010",
    "input": {
      "fbBodyRetention": 0.38,
      "nestedFbDepth": 0.35,
      "timerCounterComplexity": 0.35,
      "interlockBypassRisk": 0.3,
      "actuatorReach": 0.3,
      "operatorOverrideGap": 0.32,
      "hiddenTimerHint": 0.37,
      "scanCycleBoundTightness": 0.43,
      "symbolicPathCoverage": 0.37,
      "triggerRecoverability": 0.39,
      "ladderNoise": 0.53,
      "fbInstanceCount": 12,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 35.03,
      "triggerRecovery": 32.66,
      "fbFidelity": 39.18,
      "symbolicCoverage": 30.32,
      "falseAlarmFit": 60.54,
      "confidence": 37.52,
      "overall": 37.35
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 26.97,
      "triggerRecovery": 29.66,
      "fbFidelity": 19.94,
      "symbolicCoverage": 37.48,
      "falseAlarmFit": 44.09,
      "confidence": 25.64,
      "overall": 29.95
    }
  },
  {
    "id": "lbs-011",
    "input": {
      "fbBodyRetention": 0.43,
      "nestedFbDepth": 0.39,
      "timerCounterComplexity": 0.39,
      "interlockBypassRisk": 0.35,
      "actuatorReach": 0.34,
      "operatorOverrideGap": 0.36,
      "hiddenTimerHint": 0.41,
      "scanCycleBoundTightness": 0.47,
      "symbolicPathCoverage": 0.41,
      "triggerRecoverability": 0.43,
      "ladderNoise": 0.52,
      "fbInstanceCount": 13,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 39.96,
      "triggerRecovery": 36.52,
      "fbFidelity": 44.22,
      "symbolicCoverage": 34.23,
      "falseAlarmFit": 61.09,
      "confidence": 41.2,
      "overall": 41.38
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 26.06,
      "triggerRecovery": 29.2,
      "fbFidelity": 20.06,
      "symbolicCoverage": 37.46,
      "falseAlarmFit": 44.42,
      "confidence": 24.74,
      "overall": 29.52
    }
  },
  {
    "id": "lbs-012",
    "input": {
      "fbBodyRetention": 0.47,
      "nestedFbDepth": 0.36,
      "timerCounterComplexity": 0.34,
      "interlockBypassRisk": 0.32,
      "actuatorReach": 0.39,
      "operatorOverrideGap": 0.33,
      "hiddenTimerHint": 0.4,
      "scanCycleBoundTightness": 0.44,
      "symbolicPathCoverage": 0.45,
      "triggerRecoverability": 0.4,
      "ladderNoise": 0.51,
      "fbInstanceCount": 2,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 38.59,
      "triggerRecovery": 38.01,
      "fbFidelity": 39.27,
      "symbolicCoverage": 37.22,
      "falseAlarmFit": 66.09,
      "confidence": 24.82,
      "overall": 40.04
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 27.87,
      "triggerRecovery": 29.02,
      "fbFidelity": 16.42,
      "symbolicCoverage": 38.24,
      "falseAlarmFit": 46.99,
      "confidence": 26.5,
      "overall": 30.19
    }
  },
  {
    "id": "lbs-013",
    "input": {
      "fbBodyRetention": 0.52,
      "nestedFbDepth": 0.4,
      "timerCounterComplexity": 0.38,
      "interlockBypassRisk": 0.37,
      "actuatorReach": 0.43,
      "operatorOverrideGap": 0.37,
      "hiddenTimerHint": 0.44,
      "scanCycleBoundTightness": 0.48,
      "symbolicPathCoverage": 0.49,
      "triggerRecoverability": 0.44,
      "ladderNoise": 0.51,
      "fbInstanceCount": 3,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 40.78,
      "triggerRecovery": 38.35,
      "fbFidelity": 41.88,
      "symbolicCoverage": 38.91,
      "falseAlarmFit": 62.4,
      "confidence": 31.4,
      "overall": 41.59
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.9,
      "triggerRecovery": 28.56,
      "fbFidelity": 16.54,
      "symbolicCoverage": 38.22,
      "falseAlarmFit": 45.14,
      "confidence": 23.68,
      "overall": 28.69
    }
  },
  {
    "id": "lbs-014",
    "input": {
      "fbBodyRetention": 0.56,
      "nestedFbDepth": 0.44,
      "timerCounterComplexity": 0.42,
      "interlockBypassRisk": 0.42,
      "actuatorReach": 0.47,
      "operatorOverrideGap": 0.41,
      "hiddenTimerHint": 0.48,
      "scanCycleBoundTightness": 0.52,
      "symbolicPathCoverage": 0.53,
      "triggerRecoverability": 0.48,
      "ladderNoise": 0.39,
      "fbInstanceCount": 4,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 46.77,
      "triggerRecovery": 44.17,
      "fbFidelity": 46.86,
      "symbolicCoverage": 43.9,
      "falseAlarmFit": 65.58,
      "confidence": 35.92,
      "overall": 46.83
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.84,
      "triggerRecovery": 28.24,
      "fbFidelity": 16.59,
      "symbolicCoverage": 38.3,
      "falseAlarmFit": 47.45,
      "confidence": 22,
      "overall": 28.72
    }
  },
  {
    "id": "lbs-015",
    "input": {
      "fbBodyRetention": 0.51,
      "nestedFbDepth": 0.49,
      "timerCounterComplexity": 0.46,
      "interlockBypassRisk": 0.39,
      "actuatorReach": 0.42,
      "operatorOverrideGap": 0.46,
      "hiddenTimerHint": 0.47,
      "scanCycleBoundTightness": 0.57,
      "symbolicPathCoverage": 0.5,
      "triggerRecoverability": 0.53,
      "ladderNoise": 0.39,
      "fbInstanceCount": 5,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 48.93,
      "triggerRecovery": 50.44,
      "fbFidelity": 47.33,
      "symbolicCoverage": 45.35,
      "falseAlarmFit": 69.07,
      "confidence": 32.36,
      "overall": 49.16
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 26.34,
      "triggerRecovery": 28.6,
      "fbFidelity": 15.83,
      "symbolicCoverage": 37.64,
      "falseAlarmFit": 49.2,
      "confidence": 24.1,
      "overall": 29.45
    }
  },
  {
    "id": "lbs-016",
    "input": {
      "fbBodyRetention": 0.55,
      "nestedFbDepth": 0.45,
      "timerCounterComplexity": 0.49,
      "interlockBypassRisk": 0.44,
      "actuatorReach": 0.46,
      "operatorOverrideGap": 0.42,
      "hiddenTimerHint": 0.51,
      "scanCycleBoundTightness": 0.53,
      "symbolicPathCoverage": 0.54,
      "triggerRecoverability": 0.49,
      "ladderNoise": 0.38,
      "fbInstanceCount": 6,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 49.06,
      "triggerRecovery": 45.48,
      "fbFidelity": 48.12,
      "symbolicCoverage": 44.95,
      "falseAlarmFit": 65.81,
      "confidence": 38.78,
      "overall": 48.38
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 25.44,
      "triggerRecovery": 28.44,
      "fbFidelity": 17.16,
      "symbolicCoverage": 38.52,
      "falseAlarmFit": 47.62,
      "confidence": 21.94,
      "overall": 29.08
    }
  },
  {
    "id": "lbs-017",
    "input": {
      "fbBodyRetention": 0.6,
      "nestedFbDepth": 0.5,
      "timerCounterComplexity": 0.53,
      "interlockBypassRisk": 0.49,
      "actuatorReach": 0.51,
      "operatorOverrideGap": 0.47,
      "hiddenTimerHint": 0.56,
      "scanCycleBoundTightness": 0.58,
      "symbolicPathCoverage": 0.58,
      "triggerRecoverability": 0.54,
      "ladderNoise": 0.37,
      "fbInstanceCount": 7,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 54.5,
      "triggerRecovery": 49.98,
      "fbFidelity": 53.28,
      "symbolicCoverage": 49.09,
      "falseAlarmFit": 66.3,
      "confidence": 42.46,
      "overall": 52.75
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.45,
      "triggerRecovery": 27.96,
      "fbFidelity": 17.12,
      "symbolicCoverage": 38.4,
      "falseAlarmFit": 47.93,
      "confidence": 20.96,
      "overall": 28.57
    }
  },
  {
    "id": "lbs-018",
    "input": {
      "fbBodyRetention": 0.64,
      "nestedFbDepth": 0.54,
      "timerCounterComplexity": 0.48,
      "interlockBypassRisk": 0.47,
      "actuatorReach": 0.55,
      "operatorOverrideGap": 0.51,
      "hiddenTimerHint": 0.54,
      "scanCycleBoundTightness": 0.62,
      "symbolicPathCoverage": 0.62,
      "triggerRecoverability": 0.58,
      "ladderNoise": 0.36,
      "fbInstanceCount": 8,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 60.22,
      "triggerRecovery": 57.99,
      "fbFidelity": 60.83,
      "symbolicCoverage": 55.82,
      "falseAlarmFit": 71.16,
      "confidence": 42.88,
      "overall": 58.93
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.53,
      "triggerRecovery": 27.64,
      "fbFidelity": 17.17,
      "symbolicCoverage": 38.48,
      "falseAlarmFit": 50.42,
      "confidence": 22.16,
      "overall": 28.9
    }
  },
  {
    "id": "lbs-019",
    "input": {
      "fbBodyRetention": 0.69,
      "nestedFbDepth": 0.58,
      "timerCounterComplexity": 0.52,
      "interlockBypassRisk": 0.51,
      "actuatorReach": 0.59,
      "operatorOverrideGap": 0.55,
      "hiddenTimerHint": 0.58,
      "scanCycleBoundTightness": 0.66,
      "symbolicPathCoverage": 0.66,
      "triggerRecoverability": 0.62,
      "ladderNoise": 0.36,
      "fbInstanceCount": 9,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 61.14,
      "triggerRecovery": 56.82,
      "fbFidelity": 62.58,
      "symbolicCoverage": 56.71,
      "falseAlarmFit": 67.48,
      "confidence": 49.46,
      "overall": 59.53
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 21.53,
      "triggerRecovery": 27.18,
      "fbFidelity": 17.29,
      "symbolicCoverage": 38.46,
      "falseAlarmFit": 48.58,
      "confidence": 19.34,
      "overall": 27.39
    }
  },
  {
    "id": "lbs-020",
    "input": {
      "fbBodyRetention": 0.63,
      "nestedFbDepth": 0.55,
      "timerCounterComplexity": 0.56,
      "interlockBypassRisk": 0.56,
      "actuatorReach": 0.54,
      "operatorOverrideGap": 0.52,
      "hiddenTimerHint": 0.63,
      "scanCycleBoundTightness": 0.63,
      "symbolicPathCoverage": 0.62,
      "triggerRecoverability": 0.59,
      "ladderNoise": 0.35,
      "fbInstanceCount": 10,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 60.88,
      "triggerRecovery": 54.84,
      "fbFidelity": 58.86,
      "symbolicCoverage": 53.38,
      "falseAlarmFit": 67,
      "confidence": 48.52,
      "overall": 57.76
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.12,
      "triggerRecovery": 27.76,
      "fbFidelity": 17.74,
      "symbolicCoverage": 38.48,
      "falseAlarmFit": 48.4,
      "confidence": 20.1,
      "overall": 28.49
    }
  },
  {
    "id": "lbs-021",
    "input": {
      "fbBodyRetention": 0.68,
      "nestedFbDepth": 0.59,
      "timerCounterComplexity": 0.6,
      "interlockBypassRisk": 0.54,
      "actuatorReach": 0.58,
      "operatorOverrideGap": 0.56,
      "hiddenTimerHint": 0.61,
      "scanCycleBoundTightness": 0.67,
      "symbolicPathCoverage": 0.66,
      "triggerRecoverability": 0.63,
      "ladderNoise": 0.24,
      "fbInstanceCount": 11,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 69.05,
      "triggerRecovery": 65.38,
      "fbFidelity": 67.93,
      "symbolicCoverage": 61.45,
      "falseAlarmFit": 74.16,
      "confidence": 50.2,
      "overall": 65.98
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 24.85,
      "triggerRecovery": 27.3,
      "fbFidelity": 17.86,
      "symbolicCoverage": 38.46,
      "falseAlarmFit": 52.64,
      "confidence": 20.4,
      "overall": 29.1
    }
  },
  {
    "id": "lbs-022",
    "input": {
      "fbBodyRetention": 0.72,
      "nestedFbDepth": 0.64,
      "timerCounterComplexity": 0.64,
      "interlockBypassRisk": 0.59,
      "actuatorReach": 0.63,
      "operatorOverrideGap": 0.6,
      "hiddenTimerHint": 0.66,
      "scanCycleBoundTightness": 0.72,
      "symbolicPathCoverage": 0.7,
      "triggerRecoverability": 0.68,
      "ladderNoise": 0.23,
      "fbInstanceCount": 12,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 69.9,
      "triggerRecovery": 64.47,
      "fbFidelity": 68.94,
      "symbolicCoverage": 62.41,
      "falseAlarmFit": 70.66,
      "confidence": 56.62,
      "overall": 66.5
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 22.02,
      "triggerRecovery": 26.96,
      "fbFidelity": 17.74,
      "symbolicCoverage": 38.44,
      "falseAlarmFit": 50.95,
      "confidence": 17.52,
      "overall": 27.65
    }
  },
  {
    "id": "lbs-023",
    "input": {
      "fbBodyRetention": 0.77,
      "nestedFbDepth": 0.68,
      "timerCounterComplexity": 0.68,
      "interlockBypassRisk": 0.64,
      "actuatorReach": 0.67,
      "operatorOverrideGap": 0.65,
      "hiddenTimerHint": 0.7,
      "scanCycleBoundTightness": 0.76,
      "symbolicPathCoverage": 0.74,
      "triggerRecoverability": 0.72,
      "ladderNoise": 0.22,
      "fbInstanceCount": 13,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 74.89,
      "triggerRecovery": 68.33,
      "fbFidelity": 73.98,
      "symbolicCoverage": 66.32,
      "falseAlarmFit": 71.2,
      "confidence": 60.3,
      "overall": 70.55
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 21.14,
      "triggerRecovery": 26.5,
      "fbFidelity": 17.86,
      "symbolicCoverage": 38.42,
      "falseAlarmFit": 51.28,
      "confidence": 16.62,
      "overall": 27.24
    }
  },
  {
    "id": "lbs-024",
    "input": {
      "fbBodyRetention": 0.81,
      "nestedFbDepth": 0.65,
      "timerCounterComplexity": 0.63,
      "interlockBypassRisk": 0.61,
      "actuatorReach": 0.72,
      "operatorOverrideGap": 0.61,
      "hiddenTimerHint": 0.69,
      "scanCycleBoundTightness": 0.73,
      "symbolicPathCoverage": 0.78,
      "triggerRecoverability": 0.69,
      "ladderNoise": 0.21,
      "fbInstanceCount": 2,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 75.41,
      "triggerRecovery": 72.33,
      "fbFidelity": 70.74,
      "symbolicCoverage": 70.86,
      "falseAlarmFit": 76.21,
      "confidence": 43.92,
      "overall": 70.82
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 22.92,
      "triggerRecovery": 26.32,
      "fbFidelity": 14.23,
      "symbolicCoverage": 39.2,
      "falseAlarmFit": 53.85,
      "confidence": 18.38,
      "overall": 27.89
    }
  },
  {
    "id": "lbs-025",
    "input": {
      "fbBodyRetention": 0.76,
      "nestedFbDepth": 0.69,
      "timerCounterComplexity": 0.67,
      "interlockBypassRisk": 0.66,
      "actuatorReach": 0.66,
      "operatorOverrideGap": 0.65,
      "hiddenTimerHint": 0.73,
      "scanCycleBoundTightness": 0.77,
      "symbolicPathCoverage": 0.75,
      "triggerRecoverability": 0.73,
      "ladderNoise": 0.21,
      "fbInstanceCount": 3,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 71.64,
      "triggerRecovery": 68.43,
      "fbFidelity": 64.44,
      "symbolicCoverage": 66.07,
      "falseAlarmFit": 71.52,
      "confidence": 46.36,
      "overall": 66.82
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 21.51,
      "triggerRecovery": 26.7,
      "fbFidelity": 13.63,
      "symbolicCoverage": 38.64,
      "falseAlarmFit": 51.5,
      "confidence": 16.56,
      "overall": 26.95
    }
  },
  {
    "id": "lbs-026",
    "input": {
      "fbBodyRetention": 0.8,
      "nestedFbDepth": 0.73,
      "timerCounterComplexity": 0.71,
      "interlockBypassRisk": 0.71,
      "actuatorReach": 0.7,
      "operatorOverrideGap": 0.7,
      "hiddenTimerHint": 0.77,
      "scanCycleBoundTightness": 0.81,
      "symbolicPathCoverage": 0.79,
      "triggerRecoverability": 0.77,
      "ladderNoise": 0.2,
      "fbInstanceCount": 4,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 76.37,
      "triggerRecovery": 72.24,
      "fbFidelity": 68.76,
      "symbolicCoverage": 69.89,
      "falseAlarmFit": 72.06,
      "confidence": 49.78,
      "overall": 70.63
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 20.81,
      "triggerRecovery": 26.38,
      "fbFidelity": 13.68,
      "symbolicCoverage": 38.72,
      "falseAlarmFit": 51.83,
      "confidence": 15.76,
      "overall": 26.63
    }
  },
  {
    "id": "lbs-027",
    "input": {
      "fbBodyRetention": 0.85,
      "nestedFbDepth": 0.78,
      "timerCounterComplexity": 0.75,
      "interlockBypassRisk": 0.68,
      "actuatorReach": 0.75,
      "operatorOverrideGap": 0.74,
      "hiddenTimerHint": 0.76,
      "scanCycleBoundTightness": 0.86,
      "symbolicPathCoverage": 0.83,
      "triggerRecoverability": 0.82,
      "ladderNoise": 0.19,
      "fbInstanceCount": 5,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 84.56,
      "triggerRecovery": 82.86,
      "fbFidelity": 78.2,
      "symbolicCoverage": 77.91,
      "falseAlarmFit": 76.79,
      "confidence": 50.46,
      "overall": 78.61
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 20.8,
      "triggerRecovery": 25.9,
      "fbFidelity": 13.64,
      "symbolicCoverage": 38.6,
      "falseAlarmFit": 54.26,
      "confidence": 16.78,
      "overall": 26.83
    }
  },
  {
    "id": "lbs-028",
    "input": {
      "fbBodyRetention": 0.89,
      "nestedFbDepth": 0.74,
      "timerCounterComplexity": 0.79,
      "interlockBypassRisk": 0.73,
      "actuatorReach": 0.79,
      "operatorOverrideGap": 0.7,
      "hiddenTimerHint": 0.8,
      "scanCycleBoundTightness": 0.82,
      "symbolicPathCoverage": 0.87,
      "triggerRecoverability": 0.78,
      "ladderNoise": 0.08,
      "fbInstanceCount": 6,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 83.99,
      "triggerRecovery": 77.3,
      "fbFidelity": 77.88,
      "symbolicCoverage": 77.05,
      "falseAlarmFit": 75.92,
      "confidence": 57.88,
      "overall": 77.55
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 20.51,
      "triggerRecovery": 25.74,
      "fbFidelity": 14.97,
      "symbolicCoverage": 39.48,
      "falseAlarmFit": 54.48,
      "confidence": 13.82,
      "overall": 26.79
    }
  },
  {
    "id": "lbs-029",
    "input": {
      "fbBodyRetention": 0.94,
      "nestedFbDepth": 0.79,
      "timerCounterComplexity": 0.83,
      "interlockBypassRisk": 0.78,
      "actuatorReach": 0.84,
      "operatorOverrideGap": 0.75,
      "hiddenTimerHint": 0.85,
      "scanCycleBoundTightness": 0.87,
      "symbolicPathCoverage": 0.91,
      "triggerRecoverability": 0.83,
      "ladderNoise": 0.07,
      "fbInstanceCount": 7,
      "profile": "balanced"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 89.42,
      "triggerRecovery": 81.79,
      "fbFidelity": 83.04,
      "symbolicCoverage": 81.18,
      "falseAlarmFit": 76.41,
      "confidence": 61.56,
      "overall": 81.91
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 19.53,
      "triggerRecovery": 25.26,
      "fbFidelity": 14.93,
      "symbolicCoverage": 39.36,
      "falseAlarmFit": 54.78,
      "confidence": 12.84,
      "overall": 26.29
    }
  },
  {
    "id": "lbs-030",
    "input": {
      "fbBodyRetention": 0.88,
      "nestedFbDepth": 0.83,
      "timerCounterComplexity": 0.78,
      "interlockBypassRisk": 0.75,
      "actuatorReach": 0.78,
      "operatorOverrideGap": 0.79,
      "hiddenTimerHint": 0.83,
      "scanCycleBoundTightness": 0.91,
      "symbolicPathCoverage": 0.87,
      "triggerRecoverability": 0.87,
      "ladderNoise": 0.07,
      "fbInstanceCount": 8,
      "profile": "strict"
    },
    "expectedFbAware": {
      "mode": "fb-aware",
      "bombCatchRate": 92.55,
      "triggerRecovery": 90.05,
      "fbFidelity": 84.54,
      "symbolicCoverage": 83.46,
      "falseAlarmFit": 79.89,
      "confidence": 57.52,
      "overall": 85.22
    },
    "expectedDroppedFb": {
      "mode": "dropped-fb",
      "bombCatchRate": 21.07,
      "triggerRecovery": 25.7,
      "fbFidelity": 14.26,
      "symbolicCoverage": 38.68,
      "falseAlarmFit": 56.53,
      "confidence": 15.12,
      "overall": 27.07
    }
  }
];
