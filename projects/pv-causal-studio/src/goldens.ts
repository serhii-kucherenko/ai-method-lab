import type { PvCausalInput, PvCausalQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PvCausalInput;
  expectedTargetTrial: PvCausalQuality;
  expectedSpontaneous: PvCausalQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pc-001",
    "input": {
      "cohortCoverage": 0.29,
      "exposureFidelity": 0.25,
      "confounderControl": 0.28,
      "packCompleteness": 0.34,
      "spontaneousVolume": 0.39,
      "tipLineOptimism": 0.45,
      "trialHardness": 0.59,
      "overclaimRisk": 0.5,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 23.37,
      "exposureScore": 30.25,
      "causalScore": 23.45,
      "completenessScore": 37.64,
      "tipLineScore": 16.4,
      "confidence": 20.85,
      "targetTrialContribution": 28.18,
      "spontaneousContribution": 15.92,
      "overall": 29.97
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 5.76,
      "exposureScore": 17.05,
      "causalScore": 12.78,
      "completenessScore": 32.39,
      "tipLineScore": 40.93,
      "confidence": 17.1,
      "targetTrialContribution": 21.78,
      "spontaneousContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "pc-002",
    "input": {
      "cohortCoverage": 0.33,
      "exposureFidelity": 0.29,
      "confounderControl": 0.32,
      "packCompleteness": 0.38,
      "spontaneousVolume": 0.43,
      "tipLineOptimism": 0.46,
      "trialHardness": 0.6,
      "overclaimRisk": 0.51,
      "signalBias": "exposure_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 29.47,
      "exposureScore": 33.9,
      "causalScore": 17.72,
      "completenessScore": 48.93,
      "tipLineScore": 18.89,
      "confidence": 24.5,
      "targetTrialContribution": 31.52,
      "spontaneousContribution": 18.58,
      "overall": 33.19
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 2.43,
      "exposureScore": 18.17,
      "causalScore": 13.81,
      "completenessScore": 34.08,
      "tipLineScore": 31.53,
      "confidence": 18.65,
      "targetTrialContribution": 20,
      "spontaneousContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "pc-003",
    "input": {
      "cohortCoverage": 0.37,
      "exposureFidelity": 0.27,
      "confounderControl": 0.36,
      "packCompleteness": 0.42,
      "spontaneousVolume": 0.46,
      "tipLineOptimism": 0.42,
      "trialHardness": 0.6,
      "overclaimRisk": 0.46,
      "signalBias": "tip_line_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 8.22,
      "exposureScore": 23.71,
      "causalScore": 20.92,
      "completenessScore": 19.24,
      "tipLineScore": 19.94,
      "confidence": 27.1,
      "targetTrialContribution": 17.92,
      "spontaneousContribution": 19.65,
      "overall": 19.23
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 12.17,
      "exposureScore": 17.05,
      "causalScore": 12.78,
      "completenessScore": 33.93,
      "tipLineScore": 54.34,
      "confidence": 18.4,
      "targetTrialContribution": 26.05,
      "spontaneousContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "pc-004",
    "input": {
      "cohortCoverage": 0.33,
      "exposureFidelity": 0.32,
      "confounderControl": 0.39,
      "packCompleteness": 0.38,
      "spontaneousVolume": 0.42,
      "tipLineOptimism": 0.43,
      "trialHardness": 0.53,
      "overclaimRisk": 0.46,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 30.23,
      "exposureScore": 36.03,
      "causalScore": 33.26,
      "completenessScore": 42.23,
      "tipLineScore": 18.93,
      "confidence": 25.85,
      "targetTrialContribution": 35.11,
      "spontaneousContribution": 19.24,
      "overall": 36.25
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 8.7,
      "exposureScore": 18.05,
      "causalScore": 14.08,
      "completenessScore": 32.79,
      "tipLineScore": 42.77,
      "confidence": 18.85,
      "targetTrialContribution": 23.28,
      "spontaneousContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "pc-005",
    "input": {
      "cohortCoverage": 0.37,
      "exposureFidelity": 0.36,
      "confounderControl": 0.35,
      "packCompleteness": 0.42,
      "spontaneousVolume": 0.46,
      "tipLineOptimism": 0.45,
      "trialHardness": 0.53,
      "overclaimRisk": 0.47,
      "signalBias": "trial_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 34.45,
      "exposureScore": 39.64,
      "causalScore": 39.52,
      "completenessScore": 35.49,
      "tipLineScore": 21.8,
      "confidence": 29.35,
      "targetTrialContribution": 37.34,
      "spontaneousContribution": 22.12,
      "overall": 38.6
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 0,
      "exposureScore": 19.43,
      "causalScore": 15.31,
      "completenessScore": 34.77,
      "tipLineScore": 32.95,
      "confidence": 21.05,
      "targetTrialContribution": 20.49,
      "spontaneousContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "pc-006",
    "input": {
      "cohortCoverage": 0.41,
      "exposureFidelity": 0.34,
      "confounderControl": 0.39,
      "packCompleteness": 0.45,
      "spontaneousVolume": 0.5,
      "tipLineOptimism": 0.4,
      "trialHardness": 0.54,
      "overclaimRisk": 0.42,
      "signalBias": "balanced",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 35.28,
      "exposureScore": 39.5,
      "causalScore": 35.78,
      "completenessScore": 47.85,
      "tipLineScore": 23.08,
      "confidence": 31.85,
      "targetTrialContribution": 39.2,
      "spontaneousContribution": 23.32,
      "overall": 40.34
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 11.98,
      "exposureScore": 17.95,
      "causalScore": 13.91,
      "completenessScore": 34.78,
      "tipLineScore": 46.72,
      "confidence": 20.5,
      "targetTrialContribution": 25.07,
      "spontaneousContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "pc-007",
    "input": {
      "cohortCoverage": 0.45,
      "exposureFidelity": 0.38,
      "confounderControl": 0.42,
      "packCompleteness": 0.49,
      "spontaneousVolume": 0.53,
      "tipLineOptimism": 0.42,
      "trialHardness": 0.55,
      "overclaimRisk": 0.43,
      "signalBias": "exposure_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 42.35,
      "exposureScore": 43.11,
      "causalScore": 26.44,
      "completenessScore": 61.29,
      "tipLineScore": 25.15,
      "confidence": 35.35,
      "targetTrialContribution": 42.24,
      "spontaneousContribution": 25.54,
      "overall": 43.23
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 8.27,
      "exposureScore": 19.21,
      "causalScore": 15.09,
      "completenessScore": 36.3,
      "tipLineScore": 34.2,
      "confidence": 22.15,
      "targetTrialContribution": 22.61,
      "spontaneousContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "pc-008",
    "input": {
      "cohortCoverage": 0.41,
      "exposureFidelity": 0.43,
      "confounderControl": 0.46,
      "packCompleteness": 0.45,
      "spontaneousVolume": 0.49,
      "tipLineOptimism": 0.43,
      "trialHardness": 0.47,
      "overclaimRisk": 0.44,
      "signalBias": "tip_line_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 12.47,
      "exposureScore": 35.43,
      "causalScore": 27.76,
      "completenessScore": 24.76,
      "tipLineScore": 24.32,
      "confidence": 34.1,
      "targetTrialContribution": 24.97,
      "spontaneousContribution": 25.37,
      "overall": 26.04
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 16.4,
      "exposureScore": 20.36,
      "causalScore": 16.57,
      "completenessScore": 35.17,
      "tipLineScore": 58.5,
      "confidence": 22.7,
      "targetTrialContribution": 29.4,
      "spontaneousContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "pc-009",
    "input": {
      "cohortCoverage": 0.46,
      "exposureFidelity": 0.41,
      "confounderControl": 0.5,
      "packCompleteness": 0.49,
      "spontaneousVolume": 0.53,
      "tipLineOptimism": 0.39,
      "trialHardness": 0.48,
      "overclaimRisk": 0.38,
      "signalBias": "balanced",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 42.68,
      "exposureScore": 45.49,
      "causalScore": 45.8,
      "completenessScore": 52.59,
      "tipLineScore": 25.81,
      "confidence": 37.1,
      "targetTrialContribution": 46.41,
      "spontaneousContribution": 26.81,
      "overall": 46.88
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 14.91,
      "exposureScore": 19.22,
      "causalScore": 15.52,
      "completenessScore": 35.36,
      "tipLineScore": 48.88,
      "confidence": 22.7,
      "targetTrialContribution": 26.78,
      "spontaneousContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "pc-010",
    "input": {
      "cohortCoverage": 0.5,
      "exposureFidelity": 0.45,
      "confounderControl": 0.46,
      "packCompleteness": 0.53,
      "spontaneousVolume": 0.57,
      "tipLineOptimism": 0.4,
      "trialHardness": 0.49,
      "overclaimRisk": 0.39,
      "signalBias": "trial_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 48.19,
      "exposureScore": 49.14,
      "causalScore": 54.44,
      "completenessScore": 43.07,
      "tipLineScore": 28.29,
      "confidence": 40.75,
      "targetTrialContribution": 49.04,
      "spontaneousContribution": 29.21,
      "overall": 49.47
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 3.59,
      "exposureScore": 20.03,
      "causalScore": 16.17,
      "completenessScore": 37.06,
      "tipLineScore": 35.54,
      "confidence": 24.25,
      "targetTrialContribution": 22.48,
      "spontaneousContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "pc-011",
    "input": {
      "cohortCoverage": 0.54,
      "exposureFidelity": 0.49,
      "confounderControl": 0.49,
      "packCompleteness": 0.57,
      "spontaneousVolume": 0.6,
      "tipLineOptimism": 0.42,
      "trialHardness": 0.49,
      "overclaimRisk": 0.4,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 47.07,
      "exposureScore": 52.75,
      "causalScore": 47.04,
      "completenessScore": 60.27,
      "tipLineScore": 30.54,
      "confidence": 44.25,
      "targetTrialContribution": 51.33,
      "spontaneousContribution": 31.67,
      "overall": 51.79
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 17.1,
      "exposureScore": 21.44,
      "causalScore": 17.52,
      "completenessScore": 38.58,
      "tipLineScore": 54.12,
      "confidence": 26.1,
      "targetTrialContribution": 29.75,
      "spontaneousContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "pc-012",
    "input": {
      "cohortCoverage": 0.5,
      "exposureFidelity": 0.48,
      "confounderControl": 0.53,
      "packCompleteness": 0.53,
      "spontaneousVolume": 0.56,
      "tipLineOptimism": 0.37,
      "trialHardness": 0.42,
      "overclaimRisk": 0.35,
      "signalBias": "exposure_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 51.69,
      "exposureScore": 51.28,
      "causalScore": 34.47,
      "completenessScore": 67.57,
      "tipLineScore": 28.34,
      "confidence": 42.1,
      "targetTrialContribution": 50.26,
      "spontaneousContribution": 29.77,
      "overall": 50.57
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 13.23,
      "exposureScore": 19.78,
      "causalScore": 16.29,
      "completenessScore": 35.76,
      "tipLineScore": 34.93,
      "confidence": 24.35,
      "targetTrialContribution": 24,
      "spontaneousContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "pc-013",
    "input": {
      "cohortCoverage": 0.54,
      "exposureFidelity": 0.52,
      "confounderControl": 0.56,
      "packCompleteness": 0.57,
      "spontaneousVolume": 0.6,
      "tipLineOptimism": 0.39,
      "trialHardness": 0.42,
      "overclaimRisk": 0.36,
      "signalBias": "tip_line_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 19.73,
      "exposureScore": 44.88,
      "causalScore": 36.64,
      "completenessScore": 32.66,
      "tipLineScore": 31.2,
      "confidence": 45.6,
      "targetTrialContribution": 33.35,
      "spontaneousContribution": 32.85,
      "overall": 34.26
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 22.62,
      "exposureScore": 21.42,
      "causalScore": 17.82,
      "completenessScore": 37.74,
      "tipLineScore": 67.02,
      "confidence": 26.55,
      "targetTrialContribution": 33.32,
      "spontaneousContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "pc-014",
    "input": {
      "cohortCoverage": 0.58,
      "exposureFidelity": 0.56,
      "confounderControl": 0.6,
      "packCompleteness": 0.61,
      "spontaneousVolume": 0.63,
      "tipLineOptimism": 0.4,
      "trialHardness": 0.43,
      "overclaimRisk": 0.36,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 53.79,
      "exposureScore": 58.53,
      "causalScore": 56.71,
      "completenessScore": 64.86,
      "tipLineScore": 33.07,
      "confidence": 49.25,
      "targetTrialContribution": 58.18,
      "spontaneousContribution": 34.85,
      "overall": 57.98
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 20.03,
      "exposureScore": 22.26,
      "causalScore": 18.61,
      "completenessScore": 38.98,
      "tipLineScore": 55.96,
      "confidence": 27.85,
      "targetTrialContribution": 31.17,
      "spontaneousContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "pc-015",
    "input": {
      "cohortCoverage": 0.62,
      "exposureFidelity": 0.54,
      "confounderControl": 0.56,
      "packCompleteness": 0.65,
      "spontaneousVolume": 0.67,
      "tipLineOptimism": 0.36,
      "trialHardness": 0.44,
      "overclaimRisk": 0.31,
      "signalBias": "trial_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 60.96,
      "exposureScore": 58.35,
      "causalScore": 68.25,
      "completenessScore": 50.82,
      "tipLineScore": 34.55,
      "confidence": 51.85,
      "targetTrialContribution": 60.14,
      "spontaneousContribution": 36.06,
      "overall": 59.81
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 9.43,
      "exposureScore": 20.94,
      "causalScore": 17.24,
      "completenessScore": 39.27,
      "tipLineScore": 38.2,
      "confidence": 27.75,
      "targetTrialContribution": 25.02,
      "spontaneousContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "pc-016",
    "input": {
      "cohortCoverage": 0.58,
      "exposureFidelity": 0.59,
      "confounderControl": 0.6,
      "packCompleteness": 0.6,
      "spontaneousVolume": 0.63,
      "tipLineOptimism": 0.37,
      "trialHardness": 0.36,
      "overclaimRisk": 0.32,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 54.78,
      "exposureScore": 60.67,
      "causalScore": 57.91,
      "completenessScore": 65.05,
      "tipLineScore": 33.73,
      "confidence": 50.35,
      "targetTrialContribution": 59.33,
      "spontaneousContribution": 35.81,
      "overall": 59.1
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 22.05,
      "exposureScore": 21.96,
      "causalScore": 18.63,
      "completenessScore": 38.14,
      "tipLineScore": 55.7,
      "confidence": 28.3,
      "targetTrialContribution": 31.3,
      "spontaneousContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "pc-017",
    "input": {
      "cohortCoverage": 0.62,
      "exposureFidelity": 0.63,
      "confounderControl": 0.63,
      "packCompleteness": 0.64,
      "spontaneousVolume": 0.67,
      "tipLineOptimism": 0.39,
      "trialHardness": 0.37,
      "overclaimRisk": 0.33,
      "signalBias": "exposure_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 64.04,
      "exposureScore": 64.28,
      "causalScore": 42.42,
      "completenessScore": 81.43,
      "tipLineScore": 36.41,
      "confidence": 53.85,
      "targetTrialContribution": 61.87,
      "spontaneousContribution": 38.64,
      "overall": 61.69
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 18.73,
      "exposureScore": 23.45,
      "causalScore": 19.98,
      "completenessScore": 40.11,
      "tipLineScore": 39.86,
      "confidence": 30.3,
      "targetTrialContribution": 28.43,
      "spontaneousContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "pc-018",
    "input": {
      "cohortCoverage": 0.66,
      "exposureFidelity": 0.61,
      "confounderControl": 0.67,
      "packCompleteness": 0.68,
      "spontaneousVolume": 0.7,
      "tipLineOptimism": 0.34,
      "trialHardness": 0.38,
      "overclaimRisk": 0.27,
      "signalBias": "tip_line_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 26.77,
      "exposureScore": 54.13,
      "causalScore": 45.55,
      "completenessScore": 40.09,
      "tipLineScore": 37.08,
      "confidence": 56.6,
      "targetTrialContribution": 41.53,
      "spontaneousContribution": 39.18,
      "overall": 42.11
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 28.36,
      "exposureScore": 21.69,
      "causalScore": 18.3,
      "completenessScore": 39.67,
      "tipLineScore": 74.27,
      "confidence": 29.5,
      "targetTrialContribution": 36.46,
      "spontaneousContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "pc-019",
    "input": {
      "cohortCoverage": 0.7,
      "exposureFidelity": 0.65,
      "confounderControl": 0.7,
      "packCompleteness": 0.72,
      "spontaneousVolume": 0.74,
      "tipLineOptimism": 0.36,
      "trialHardness": 0.38,
      "overclaimRisk": 0.28,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 65.21,
      "exposureScore": 67.74,
      "causalScore": 68.17,
      "completenessScore": 75.07,
      "tipLineScore": 39.94,
      "confidence": 60.1,
      "targetTrialContribution": 68.82,
      "spontaneousContribution": 42.25,
      "overall": 68.04
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 26.25,
      "exposureScore": 23.32,
      "causalScore": 19.82,
      "completenessScore": 41.65,
      "tipLineScore": 62.07,
      "confidence": 31.7,
      "targetTrialContribution": 34.62,
      "spontaneousContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "pc-020",
    "input": {
      "cohortCoverage": 0.66,
      "exposureFidelity": 0.7,
      "confounderControl": 0.66,
      "packCompleteness": 0.68,
      "spontaneousVolume": 0.7,
      "tipLineOptimism": 0.37,
      "trialHardness": 0.31,
      "overclaimRisk": 0.29,
      "signalBias": "trial_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 68.73,
      "exposureScore": 70.06,
      "causalScore": 80.04,
      "completenessScore": 56.34,
      "tipLineScore": 38.94,
      "confidence": 58.85,
      "targetTrialContribution": 69.49,
      "spontaneousContribution": 41.54,
      "overall": 68.46
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 13.66,
      "exposureScore": 23.93,
      "causalScore": 20.65,
      "completenessScore": 40.51,
      "tipLineScore": 40.86,
      "confidence": 32.05,
      "targetTrialContribution": 27.92,
      "spontaneousContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "pc-021",
    "input": {
      "cohortCoverage": 0.7,
      "exposureFidelity": 0.68,
      "confounderControl": 0.7,
      "packCompleteness": 0.72,
      "spontaneousVolume": 0.73,
      "tipLineOptimism": 0.33,
      "trialHardness": 0.31,
      "overclaimRisk": 0.24,
      "signalBias": "balanced",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 66.16,
      "exposureScore": 69.88,
      "causalScore": 69.32,
      "completenessScore": 75.82,
      "tipLineScore": 39.99,
      "confidence": 61.45,
      "targetTrialContribution": 70.06,
      "spontaneousContribution": 42.54,
      "overall": 69.11
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 27.89,
      "exposureScore": 22.72,
      "causalScore": 19.52,
      "completenessScore": 40.35,
      "tipLineScore": 61.19,
      "confidence": 31.8,
      "targetTrialContribution": 34.33,
      "spontaneousContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "pc-022",
    "input": {
      "cohortCoverage": 0.74,
      "exposureFidelity": 0.72,
      "confounderControl": 0.73,
      "packCompleteness": 0.76,
      "spontaneousVolume": 0.77,
      "tipLineOptimism": 0.34,
      "trialHardness": 0.32,
      "overclaimRisk": 0.25,
      "signalBias": "exposure_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 76.68,
      "exposureScore": 73.52,
      "causalScore": 50.9,
      "completenessScore": 94.56,
      "tipLineScore": 42.47,
      "confidence": 65.1,
      "targetTrialContribution": 72.64,
      "spontaneousContribution": 45.13,
      "overall": 71.69
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 24.57,
      "exposureScore": 23.77,
      "causalScore": 20.46,
      "completenessScore": 42.05,
      "tipLineScore": 42.21,
      "confidence": 33.35,
      "targetTrialContribution": 30.61,
      "spontaneousContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "pc-023",
    "input": {
      "cohortCoverage": 0.79,
      "exposureFidelity": 0.76,
      "confounderControl": 0.77,
      "packCompleteness": 0.8,
      "spontaneousVolume": 0.81,
      "tipLineOptimism": 0.36,
      "trialHardness": 0.33,
      "overclaimRisk": 0.25,
      "signalBias": "tip_line_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 33.6,
      "exposureScore": 67.38,
      "causalScore": 53.71,
      "completenessScore": 49.49,
      "tipLineScore": 45.16,
      "confidence": 69,
      "targetTrialContribution": 50.83,
      "spontaneousContribution": 47.99,
      "overall": 51.32
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 33.86,
      "exposureScore": 25.2,
      "causalScore": 21.84,
      "completenessScore": 43.92,
      "tipLineScore": 84.72,
      "confidence": 35.45,
      "targetTrialContribution": 41.91,
      "spontaneousContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "pc-024",
    "input": {
      "cohortCoverage": 0.75,
      "exposureFidelity": 0.75,
      "confounderControl": 0.81,
      "packCompleteness": 0.76,
      "spontaneousVolume": 0.77,
      "tipLineOptimism": 0.31,
      "trialHardness": 0.25,
      "overclaimRisk": 0.2,
      "signalBias": "balanced",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 73.31,
      "exposureScore": 75.91,
      "causalScore": 79.08,
      "completenessScore": 80.56,
      "tipLineScore": 43.13,
      "confidence": 66.85,
      "targetTrialContribution": 77.14,
      "spontaneousContribution": 46.16,
      "overall": 75.56
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 31.21,
      "exposureScore": 23.47,
      "causalScore": 20.52,
      "completenessScore": 41.11,
      "tipLineScore": 63.65,
      "confidence": 33.9,
      "targetTrialContribution": 35.99,
      "spontaneousContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "pc-025",
    "input": {
      "cohortCoverage": 0.79,
      "exposureFidelity": 0.79,
      "confounderControl": 0.77,
      "packCompleteness": 0.8,
      "spontaneousVolume": 0.8,
      "tipLineOptimism": 0.33,
      "trialHardness": 0.26,
      "overclaimRisk": 0.21,
      "signalBias": "trial_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 82.34,
      "exposureScore": 79.52,
      "causalScore": 94.85,
      "completenessScore": 64.24,
      "tipLineScore": 45.2,
      "confidence": 70.35,
      "targetTrialContribution": 81.18,
      "spontaneousContribution": 48.24,
      "overall": 79.25
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 19.5,
      "exposureScore": 24.56,
      "causalScore": 21.5,
      "completenessScore": 42.63,
      "tipLineScore": 43.52,
      "confidence": 35.55,
      "targetTrialContribution": 30.34,
      "spontaneousContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "pc-026",
    "input": {
      "cohortCoverage": 0.83,
      "exposureFidelity": 0.83,
      "confounderControl": 0.8,
      "packCompleteness": 0.83,
      "spontaneousVolume": 0.84,
      "tipLineOptimism": 0.34,
      "trialHardness": 0.27,
      "overclaimRisk": 0.22,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 77.64,
      "exposureScore": 83.17,
      "causalScore": 80.25,
      "completenessScore": 87.68,
      "tipLineScore": 47.68,
      "confidence": 73.75,
      "targetTrialContribution": 81.91,
      "spontaneousContribution": 50.82,
      "overall": 80.31
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 33.17,
      "exposureScore": 25.61,
      "causalScore": 22.47,
      "completenessScore": 44.32,
      "tipLineScore": 68.8,
      "confidence": 37.1,
      "targetTrialContribution": 38.87,
      "spontaneousContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "pc-027",
    "input": {
      "cohortCoverage": 0.87,
      "exposureFidelity": 0.81,
      "confounderControl": 0.84,
      "packCompleteness": 0.87,
      "spontaneousVolume": 0.88,
      "tipLineOptimism": 0.3,
      "trialHardness": 0.27,
      "overclaimRisk": 0.17,
      "signalBias": "exposure_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 90.29,
      "exposureScore": 82.98,
      "causalScore": 59.98,
      "completenessScore": 100,
      "tipLineScore": 49.35,
      "confidence": 76.35,
      "targetTrialContribution": 82.19,
      "spontaneousContribution": 52.46,
      "overall": 80.84
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 30.78,
      "exposureScore": 24.64,
      "causalScore": 21.53,
      "completenessScore": 44.62,
      "tipLineScore": 45.22,
      "confidence": 37.2,
      "targetTrialContribution": 33.36,
      "spontaneousContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "pc-028",
    "input": {
      "cohortCoverage": 0.83,
      "exposureFidelity": 0.86,
      "confounderControl": 0.87,
      "packCompleteness": 0.83,
      "spontaneousVolume": 0.84,
      "tipLineOptimism": 0.31,
      "trialHardness": 0.2,
      "overclaimRisk": 0.17,
      "signalBias": "tip_line_first",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 37.95,
      "exposureScore": 75.3,
      "causalScore": 60.67,
      "completenessScore": 53.51,
      "tipLineScore": 48.34,
      "confidence": 75.1,
      "targetTrialContribution": 56.7,
      "spontaneousContribution": 51.78,
      "overall": 56.81
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 38.81,
      "exposureScore": 25.31,
      "causalScore": 22.44,
      "completenessScore": 43.48,
      "tipLineScore": 86.95,
      "confidence": 37.65,
      "targetTrialContribution": 43.4,
      "spontaneousContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "pc-029",
    "input": {
      "cohortCoverage": 0.87,
      "exposureFidelity": 0.9,
      "confounderControl": 0.91,
      "packCompleteness": 0.87,
      "spontaneousVolume": 0.87,
      "tipLineOptimism": 0.33,
      "trialHardness": 0.2,
      "overclaimRisk": 0.18,
      "signalBias": "balanced",
      "profile": "target_trial_causal_signal"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 84.21,
      "exposureScore": 88.91,
      "causalScore": 89.77,
      "completenessScore": 92.27,
      "tipLineScore": 50.59,
      "confidence": 78.6,
      "targetTrialContribution": 88.67,
      "spontaneousContribution": 54.2,
      "overall": 86.47
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 36.33,
      "exposureScore": 26.66,
      "causalScore": 23.73,
      "completenessScore": 45,
      "tipLineScore": 71.06,
      "confidence": 39.5,
      "targetTrialContribution": 40.56,
      "spontaneousContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "pc-030",
    "input": {
      "cohortCoverage": 0.91,
      "exposureFidelity": 0.88,
      "confounderControl": 0.87,
      "packCompleteness": 0.91,
      "spontaneousVolume": 0.91,
      "tipLineOptimism": 0.28,
      "trialHardness": 0.21,
      "overclaimRisk": 0.13,
      "signalBias": "trial_first",
      "profile": "spontaneous_reporting_baseline"
    },
    "expectedTargetTrial": {
      "mode": "target_trial_causal_signal",
      "cohortScore": 94.88,
      "exposureScore": 88.77,
      "causalScore": 100,
      "completenessScore": 71.68,
      "tipLineScore": 51.88,
      "confidence": 81.35,
      "targetTrialContribution": 89.74,
      "spontaneousContribution": 55.26,
      "overall": 87.53
    },
    "expectedSpontaneous": {
      "mode": "spontaneous_reporting_baseline",
      "cohortScore": 25.72,
      "exposureScore": 25,
      "causalScore": 22.06,
      "completenessScore": 45.02,
      "tipLineScore": 46.21,
      "confidence": 38.95,
      "targetTrialContribution": 32.8,
      "spontaneousContribution": 50.65,
      "overall": 44.26
    }
  }
];
