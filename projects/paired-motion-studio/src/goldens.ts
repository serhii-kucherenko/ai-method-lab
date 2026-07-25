import type { PairedMotionInput, PairedMotionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PairedMotionInput;
  expectedFusion: PairedMotionQuality;
  expectedEgoOnly: PairedMotionQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pm-001",
    "input": {
      "egoCoverage": 0.29,
      "exoCoverage": 0.25,
      "fusionClarity": 0.28,
      "packCompleteness": 0.34,
      "egoOnlyAdherence": 0.39,
      "occlusionHardness": 0.59,
      "driftRisk": 0.45,
      "overclaimRisk": 0.5,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 23.37,
      "exoScore": 30.25,
      "fusionScore": 22.89,
      "completenessScore": 37.64,
      "egoOnlyScore": 16.4,
      "confidence": 17.95,
      "fusionContribution": 28.16,
      "egoOnlyContribution": 15.92,
      "overall": 29.96
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 5.76,
      "exoScore": 17.37,
      "fusionScore": 12.78,
      "completenessScore": 32.39,
      "egoOnlyScore": 40.93,
      "confidence": 17.1,
      "fusionContribution": 21.85,
      "egoOnlyContribution": 38.57,
      "overall": 27.17
    }
  },
  {
    "id": "pm-002",
    "input": {
      "egoCoverage": 0.33,
      "exoCoverage": 0.29,
      "fusionClarity": 0.32,
      "packCompleteness": 0.38,
      "egoOnlyAdherence": 0.43,
      "occlusionHardness": 0.6,
      "driftRisk": 0.46,
      "overclaimRisk": 0.51,
      "motionBias": "exo_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 29.47,
      "exoScore": 33.9,
      "fusionScore": 17.16,
      "completenessScore": 48.93,
      "egoOnlyScore": 18.89,
      "confidence": 21.2,
      "fusionContribution": 31.46,
      "egoOnlyContribution": 18.58,
      "overall": 33.14
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 2.43,
      "exoScore": 18.49,
      "fusionScore": 13.81,
      "completenessScore": 34.08,
      "egoOnlyScore": 31.53,
      "confidence": 18.65,
      "fusionContribution": 20.07,
      "egoOnlyContribution": 34.51,
      "overall": 23.47
    }
  },
  {
    "id": "pm-003",
    "input": {
      "egoCoverage": 0.37,
      "exoCoverage": 0.27,
      "fusionClarity": 0.36,
      "packCompleteness": 0.42,
      "egoOnlyAdherence": 0.46,
      "occlusionHardness": 0.6,
      "driftRisk": 0.42,
      "overclaimRisk": 0.46,
      "motionBias": "ego_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 8.22,
      "exoScore": 23.71,
      "fusionScore": 19.52,
      "completenessScore": 19.24,
      "egoOnlyScore": 19.94,
      "confidence": 23.4,
      "fusionContribution": 17.84,
      "egoOnlyContribution": 19.65,
      "overall": 19.17
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 12.17,
      "exoScore": 17.85,
      "fusionScore": 12.78,
      "completenessScore": 33.93,
      "egoOnlyScore": 54.34,
      "confidence": 18.4,
      "fusionContribution": 26.21,
      "egoOnlyContribution": 46.55,
      "overall": 34.52
    }
  },
  {
    "id": "pm-004",
    "input": {
      "egoCoverage": 0.33,
      "exoCoverage": 0.32,
      "fusionClarity": 0.39,
      "packCompleteness": 0.38,
      "egoOnlyAdherence": 0.42,
      "occlusionHardness": 0.53,
      "driftRisk": 0.43,
      "overclaimRisk": 0.46,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 30.23,
      "exoScore": 36.03,
      "fusionScore": 33.12,
      "completenessScore": 42.23,
      "egoOnlyScore": 18.93,
      "confidence": 22.55,
      "fusionContribution": 35.19,
      "egoOnlyContribution": 19.24,
      "overall": 36.32
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 8.7,
      "exoScore": 18.13,
      "fusionScore": 14.08,
      "completenessScore": 32.79,
      "egoOnlyScore": 42.77,
      "confidence": 18.85,
      "fusionContribution": 23.29,
      "egoOnlyContribution": 40.35,
      "overall": 29.6
    }
  },
  {
    "id": "pm-005",
    "input": {
      "egoCoverage": 0.37,
      "exoCoverage": 0.36,
      "fusionClarity": 0.35,
      "packCompleteness": 0.42,
      "egoOnlyAdherence": 0.46,
      "occlusionHardness": 0.53,
      "driftRisk": 0.45,
      "overclaimRisk": 0.47,
      "motionBias": "fusion_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 34.45,
      "exoScore": 39.64,
      "fusionScore": 39.38,
      "completenessScore": 35.49,
      "egoOnlyScore": 21.8,
      "confidence": 25.65,
      "fusionContribution": 37.41,
      "egoOnlyContribution": 22.12,
      "overall": 38.66
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 0,
      "exoScore": 19.51,
      "fusionScore": 15.31,
      "completenessScore": 34.77,
      "egoOnlyScore": 32.95,
      "confidence": 21.05,
      "fusionContribution": 20.51,
      "egoOnlyContribution": 36.26,
      "overall": 25.74
    }
  },
  {
    "id": "pm-006",
    "input": {
      "egoCoverage": 0.41,
      "exoCoverage": 0.34,
      "fusionClarity": 0.39,
      "packCompleteness": 0.45,
      "egoOnlyAdherence": 0.5,
      "occlusionHardness": 0.54,
      "driftRisk": 0.4,
      "overclaimRisk": 0.42,
      "motionBias": "balanced",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 35.28,
      "exoScore": 39.5,
      "fusionScore": 34.8,
      "completenessScore": 47.85,
      "egoOnlyScore": 23.08,
      "confidence": 27.75,
      "fusionContribution": 39.01,
      "egoOnlyContribution": 23.32,
      "overall": 40.19
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 11.98,
      "exoScore": 18.51,
      "fusionScore": 13.91,
      "completenessScore": 34.78,
      "egoOnlyScore": 46.72,
      "confidence": 20.5,
      "fusionContribution": 25.18,
      "egoOnlyContribution": 43.14,
      "overall": 32.35
    }
  },
  {
    "id": "pm-007",
    "input": {
      "egoCoverage": 0.45,
      "exoCoverage": 0.38,
      "fusionClarity": 0.42,
      "packCompleteness": 0.49,
      "egoOnlyAdherence": 0.53,
      "occlusionHardness": 0.55,
      "driftRisk": 0.42,
      "overclaimRisk": 0.43,
      "motionBias": "exo_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 42.35,
      "exoScore": 43.11,
      "fusionScore": 25.46,
      "completenessScore": 61.29,
      "egoOnlyScore": 25.15,
      "confidence": 30.85,
      "fusionContribution": 41.99,
      "egoOnlyContribution": 25.54,
      "overall": 43.03
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 8.27,
      "exoScore": 19.77,
      "fusionScore": 15.09,
      "completenessScore": 36.3,
      "egoOnlyScore": 34.2,
      "confidence": 22.15,
      "fusionContribution": 22.73,
      "egoOnlyContribution": 37.43,
      "overall": 27.22
    }
  },
  {
    "id": "pm-008",
    "input": {
      "egoCoverage": 0.41,
      "exoCoverage": 0.43,
      "fusionClarity": 0.46,
      "packCompleteness": 0.45,
      "egoOnlyAdherence": 0.49,
      "occlusionHardness": 0.47,
      "driftRisk": 0.43,
      "overclaimRisk": 0.44,
      "motionBias": "ego_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 12.47,
      "exoScore": 35.43,
      "fusionScore": 28.04,
      "completenessScore": 24.76,
      "egoOnlyScore": 24.32,
      "confidence": 30,
      "fusionContribution": 25.5,
      "egoOnlyContribution": 25.37,
      "overall": 26.48
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 16.4,
      "exoScore": 20.2,
      "fusionScore": 16.57,
      "completenessScore": 35.17,
      "egoOnlyScore": 58.5,
      "confidence": 22.7,
      "fusionContribution": 29.37,
      "egoOnlyContribution": 51.04,
      "overall": 39.87
    }
  },
  {
    "id": "pm-009",
    "input": {
      "egoCoverage": 0.46,
      "exoCoverage": 0.41,
      "fusionClarity": 0.5,
      "packCompleteness": 0.49,
      "egoOnlyAdherence": 0.53,
      "occlusionHardness": 0.48,
      "driftRisk": 0.39,
      "overclaimRisk": 0.38,
      "motionBias": "balanced",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 42.68,
      "exoScore": 45.49,
      "fusionScore": 45.1,
      "completenessScore": 52.59,
      "egoOnlyScore": 25.81,
      "confidence": 32.5,
      "fusionContribution": 46.27,
      "egoOnlyContribution": 26.81,
      "overall": 46.77
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 14.91,
      "exoScore": 19.62,
      "fusionScore": 15.52,
      "completenessScore": 35.36,
      "egoOnlyScore": 48.88,
      "confidence": 22.7,
      "fusionContribution": 26.86,
      "egoOnlyContribution": 45.34,
      "overall": 35.15
    }
  },
  {
    "id": "pm-010",
    "input": {
      "egoCoverage": 0.5,
      "exoCoverage": 0.45,
      "fusionClarity": 0.46,
      "packCompleteness": 0.53,
      "egoOnlyAdherence": 0.57,
      "occlusionHardness": 0.49,
      "driftRisk": 0.4,
      "overclaimRisk": 0.39,
      "motionBias": "fusion_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 48.19,
      "exoScore": 49.14,
      "fusionScore": 53.74,
      "completenessScore": 43.07,
      "egoOnlyScore": 28.29,
      "confidence": 35.75,
      "fusionContribution": 48.86,
      "egoOnlyContribution": 29.21,
      "overall": 49.32
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 3.59,
      "exoScore": 20.43,
      "fusionScore": 16.17,
      "completenessScore": 37.06,
      "egoOnlyScore": 35.54,
      "confidence": 24.25,
      "fusionContribution": 22.56,
      "egoOnlyContribution": 38.95,
      "overall": 29.08
    }
  },
  {
    "id": "pm-011",
    "input": {
      "egoCoverage": 0.54,
      "exoCoverage": 0.49,
      "fusionClarity": 0.49,
      "packCompleteness": 0.57,
      "egoOnlyAdherence": 0.6,
      "occlusionHardness": 0.49,
      "driftRisk": 0.42,
      "overclaimRisk": 0.4,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 47.07,
      "exoScore": 52.75,
      "fusionScore": 46.34,
      "completenessScore": 60.27,
      "egoOnlyScore": 30.54,
      "confidence": 38.85,
      "fusionContribution": 51.25,
      "egoOnlyContribution": 31.67,
      "overall": 51.73
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 17.1,
      "exoScore": 21.84,
      "fusionScore": 17.52,
      "completenessScore": 38.58,
      "egoOnlyScore": 54.12,
      "confidence": 26.1,
      "fusionContribution": 29.83,
      "egoOnlyContribution": 50.43,
      "overall": 39.58
    }
  },
  {
    "id": "pm-012",
    "input": {
      "egoCoverage": 0.5,
      "exoCoverage": 0.48,
      "fusionClarity": 0.53,
      "packCompleteness": 0.53,
      "egoOnlyAdherence": 0.56,
      "occlusionHardness": 0.42,
      "driftRisk": 0.37,
      "overclaimRisk": 0.35,
      "motionBias": "exo_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 51.69,
      "exoScore": 51.28,
      "fusionScore": 34.19,
      "completenessScore": 67.57,
      "egoOnlyScore": 28.34,
      "confidence": 37.1,
      "fusionContribution": 50.18,
      "egoOnlyContribution": 29.77,
      "overall": 50.51
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 13.23,
      "exoScore": 19.94,
      "fusionScore": 16.29,
      "completenessScore": 35.76,
      "egoOnlyScore": 34.93,
      "confidence": 24.35,
      "fusionContribution": 24.03,
      "egoOnlyContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "pm-013",
    "input": {
      "egoCoverage": 0.54,
      "exoCoverage": 0.52,
      "fusionClarity": 0.56,
      "packCompleteness": 0.57,
      "egoOnlyAdherence": 0.6,
      "occlusionHardness": 0.42,
      "driftRisk": 0.39,
      "overclaimRisk": 0.36,
      "motionBias": "ego_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 19.73,
      "exoScore": 44.88,
      "fusionScore": 36.36,
      "completenessScore": 32.66,
      "egoOnlyScore": 31.2,
      "confidence": 40.2,
      "fusionContribution": 33.77,
      "egoOnlyContribution": 32.85,
      "overall": 34.6
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 22.62,
      "exoScore": 21.58,
      "fusionScore": 17.82,
      "completenessScore": 37.74,
      "egoOnlyScore": 67.02,
      "confidence": 26.55,
      "fusionContribution": 33.36,
      "egoOnlyContribution": 57.3,
      "overall": 46.51
    }
  },
  {
    "id": "pm-014",
    "input": {
      "egoCoverage": 0.58,
      "exoCoverage": 0.56,
      "fusionClarity": 0.6,
      "packCompleteness": 0.61,
      "egoOnlyAdherence": 0.63,
      "occlusionHardness": 0.43,
      "driftRisk": 0.4,
      "overclaimRisk": 0.36,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 53.79,
      "exoScore": 58.53,
      "fusionScore": 56.43,
      "completenessScore": 64.86,
      "egoOnlyScore": 33.07,
      "confidence": 43.45,
      "fusionContribution": 58.2,
      "egoOnlyContribution": 34.85,
      "overall": 58
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 20.03,
      "exoScore": 22.42,
      "fusionScore": 18.61,
      "completenessScore": 38.98,
      "egoOnlyScore": 55.96,
      "confidence": 27.85,
      "fusionContribution": 31.2,
      "egoOnlyContribution": 52.11,
      "overall": 41.91
    }
  },
  {
    "id": "pm-015",
    "input": {
      "egoCoverage": 0.62,
      "exoCoverage": 0.54,
      "fusionClarity": 0.56,
      "packCompleteness": 0.65,
      "egoOnlyAdherence": 0.67,
      "occlusionHardness": 0.44,
      "driftRisk": 0.36,
      "overclaimRisk": 0.31,
      "motionBias": "fusion_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 60.96,
      "exoScore": 58.35,
      "fusionScore": 67.13,
      "completenessScore": 50.82,
      "egoOnlyScore": 34.55,
      "confidence": 45.65,
      "fusionContribution": 59.78,
      "egoOnlyContribution": 36.06,
      "overall": 59.51
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 9.43,
      "exoScore": 21.58,
      "fusionScore": 17.24,
      "completenessScore": 39.27,
      "egoOnlyScore": 38.2,
      "confidence": 27.75,
      "fusionContribution": 25.14,
      "egoOnlyContribution": 41.8,
      "overall": 32.75
    }
  },
  {
    "id": "pm-016",
    "input": {
      "egoCoverage": 0.58,
      "exoCoverage": 0.59,
      "fusionClarity": 0.6,
      "packCompleteness": 0.6,
      "egoOnlyAdherence": 0.63,
      "occlusionHardness": 0.36,
      "driftRisk": 0.37,
      "overclaimRisk": 0.32,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 54.78,
      "exoScore": 60.67,
      "fusionScore": 58.05,
      "completenessScore": 65.05,
      "egoOnlyScore": 33.73,
      "confidence": 44.55,
      "fusionContribution": 59.49,
      "egoOnlyContribution": 35.81,
      "overall": 59.23
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 22.05,
      "exoScore": 21.88,
      "fusionScore": 18.63,
      "completenessScore": 38.14,
      "egoOnlyScore": 55.7,
      "confidence": 28.3,
      "fusionContribution": 31.28,
      "egoOnlyContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "pm-017",
    "input": {
      "egoCoverage": 0.62,
      "exoCoverage": 0.63,
      "fusionClarity": 0.63,
      "packCompleteness": 0.64,
      "egoOnlyAdherence": 0.67,
      "occlusionHardness": 0.37,
      "driftRisk": 0.39,
      "overclaimRisk": 0.33,
      "motionBias": "exo_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 64.04,
      "exoScore": 64.28,
      "fusionScore": 42.56,
      "completenessScore": 81.43,
      "egoOnlyScore": 36.41,
      "confidence": 47.65,
      "fusionContribution": 61.91,
      "egoOnlyContribution": 38.64,
      "overall": 61.72
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 18.73,
      "exoScore": 23.37,
      "fusionScore": 19.98,
      "completenessScore": 40.11,
      "egoOnlyScore": 39.86,
      "confidence": 30.3,
      "fusionContribution": 28.41,
      "egoOnlyContribution": 44.26,
      "overall": 35.83
    }
  },
  {
    "id": "pm-018",
    "input": {
      "egoCoverage": 0.66,
      "exoCoverage": 0.61,
      "fusionClarity": 0.67,
      "packCompleteness": 0.68,
      "egoOnlyAdherence": 0.7,
      "occlusionHardness": 0.38,
      "driftRisk": 0.34,
      "overclaimRisk": 0.27,
      "motionBias": "ego_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 26.77,
      "exoScore": 54.13,
      "fusionScore": 44.85,
      "completenessScore": 40.09,
      "egoOnlyScore": 37.08,
      "confidence": 50,
      "fusionContribution": 41.88,
      "egoOnlyContribution": 39.18,
      "overall": 42.39
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 28.36,
      "exoScore": 22.09,
      "fusionScore": 18.3,
      "completenessScore": 39.67,
      "egoOnlyScore": 74.27,
      "confidence": 29.5,
      "fusionContribution": 36.54,
      "egoOnlyContribution": 62.27,
      "overall": 51.95
    }
  },
  {
    "id": "pm-019",
    "input": {
      "egoCoverage": 0.7,
      "exoCoverage": 0.65,
      "fusionClarity": 0.7,
      "packCompleteness": 0.72,
      "egoOnlyAdherence": 0.74,
      "occlusionHardness": 0.38,
      "driftRisk": 0.36,
      "overclaimRisk": 0.28,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 65.21,
      "exoScore": 67.74,
      "fusionScore": 67.47,
      "completenessScore": 75.07,
      "egoOnlyScore": 39.94,
      "confidence": 53.1,
      "fusionContribution": 68.67,
      "egoOnlyContribution": 42.25,
      "overall": 67.91
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 26.25,
      "exoScore": 23.72,
      "fusionScore": 19.82,
      "completenessScore": 41.65,
      "egoOnlyScore": 62.07,
      "confidence": 31.7,
      "fusionContribution": 34.7,
      "egoOnlyContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "pm-020",
    "input": {
      "egoCoverage": 0.66,
      "exoCoverage": 0.7,
      "fusionClarity": 0.66,
      "packCompleteness": 0.68,
      "egoOnlyAdherence": 0.7,
      "occlusionHardness": 0.31,
      "driftRisk": 0.37,
      "overclaimRisk": 0.29,
      "motionBias": "fusion_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 68.73,
      "exoScore": 70.06,
      "fusionScore": 80.6,
      "completenessScore": 56.34,
      "egoOnlyScore": 38.94,
      "confidence": 52.25,
      "fusionContribution": 69.67,
      "egoOnlyContribution": 41.54,
      "overall": 68.61
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 13.66,
      "exoScore": 23.61,
      "fusionScore": 20.65,
      "completenessScore": 40.51,
      "egoOnlyScore": 40.86,
      "confidence": 32.05,
      "fusionContribution": 27.86,
      "egoOnlyContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "pm-021",
    "input": {
      "egoCoverage": 0.7,
      "exoCoverage": 0.68,
      "fusionClarity": 0.7,
      "packCompleteness": 0.72,
      "egoOnlyAdherence": 0.73,
      "occlusionHardness": 0.31,
      "driftRisk": 0.33,
      "overclaimRisk": 0.24,
      "motionBias": "balanced",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 66.16,
      "exoScore": 69.88,
      "fusionScore": 69.04,
      "completenessScore": 75.82,
      "egoOnlyScore": 39.99,
      "confidence": 54.45,
      "fusionContribution": 70.06,
      "egoOnlyContribution": 42.54,
      "overall": 69.11
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 27.89,
      "exoScore": 22.88,
      "fusionScore": 19.52,
      "completenessScore": 40.35,
      "egoOnlyScore": 61.19,
      "confidence": 31.8,
      "fusionContribution": 34.37,
      "egoOnlyContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "pm-022",
    "input": {
      "egoCoverage": 0.74,
      "exoCoverage": 0.72,
      "fusionClarity": 0.73,
      "packCompleteness": 0.76,
      "egoOnlyAdherence": 0.77,
      "occlusionHardness": 0.32,
      "driftRisk": 0.34,
      "overclaimRisk": 0.25,
      "motionBias": "exo_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 76.68,
      "exoScore": 73.52,
      "fusionScore": 50.62,
      "completenessScore": 94.56,
      "egoOnlyScore": 42.47,
      "confidence": 57.7,
      "fusionContribution": 72.5,
      "egoOnlyContribution": 45.13,
      "overall": 71.57
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 24.57,
      "exoScore": 23.93,
      "fusionScore": 20.46,
      "completenessScore": 42.05,
      "egoOnlyScore": 42.21,
      "confidence": 33.35,
      "fusionContribution": 30.64,
      "egoOnlyContribution": 46.55,
      "overall": 38.99
    }
  },
  {
    "id": "pm-023",
    "input": {
      "egoCoverage": 0.79,
      "exoCoverage": 0.76,
      "fusionClarity": 0.77,
      "packCompleteness": 0.8,
      "egoOnlyAdherence": 0.81,
      "occlusionHardness": 0.33,
      "driftRisk": 0.36,
      "overclaimRisk": 0.25,
      "motionBias": "ego_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 33.6,
      "exoScore": 67.38,
      "fusionScore": 53.29,
      "completenessScore": 49.49,
      "egoOnlyScore": 45.16,
      "confidence": 61.1,
      "fusionContribution": 51.39,
      "egoOnlyContribution": 47.99,
      "overall": 51.78
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 33.86,
      "exoScore": 25.44,
      "fusionScore": 21.84,
      "completenessScore": 43.92,
      "egoOnlyScore": 84.72,
      "confidence": 35.45,
      "fusionContribution": 41.96,
      "egoOnlyContribution": 71.31,
      "overall": 60.71
    }
  },
  {
    "id": "pm-024",
    "input": {
      "egoCoverage": 0.75,
      "exoCoverage": 0.75,
      "fusionClarity": 0.81,
      "packCompleteness": 0.76,
      "egoOnlyAdherence": 0.77,
      "occlusionHardness": 0.25,
      "driftRisk": 0.31,
      "overclaimRisk": 0.2,
      "motionBias": "balanced",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 73.31,
      "exoScore": 75.91,
      "fusionScore": 79.08,
      "completenessScore": 80.56,
      "egoOnlyScore": 43.13,
      "confidence": 59.35,
      "fusionContribution": 77.2,
      "egoOnlyContribution": 46.16,
      "overall": 75.61
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 31.21,
      "exoScore": 23.47,
      "fusionScore": 20.52,
      "completenessScore": 41.11,
      "egoOnlyScore": 63.65,
      "confidence": 33.9,
      "fusionContribution": 35.99,
      "egoOnlyContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "pm-025",
    "input": {
      "egoCoverage": 0.79,
      "exoCoverage": 0.79,
      "fusionClarity": 0.77,
      "packCompleteness": 0.8,
      "egoOnlyAdherence": 0.8,
      "occlusionHardness": 0.26,
      "driftRisk": 0.33,
      "overclaimRisk": 0.21,
      "motionBias": "fusion_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 82.34,
      "exoScore": 79.52,
      "fusionScore": 94.85,
      "completenessScore": 64.24,
      "egoOnlyScore": 45.2,
      "confidence": 62.45,
      "fusionContribution": 81.13,
      "egoOnlyContribution": 48.24,
      "overall": 79.21
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 19.5,
      "exoScore": 24.56,
      "fusionScore": 21.5,
      "completenessScore": 42.63,
      "egoOnlyScore": 43.52,
      "confidence": 35.55,
      "fusionContribution": 30.34,
      "egoOnlyContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "pm-026",
    "input": {
      "egoCoverage": 0.83,
      "exoCoverage": 0.83,
      "fusionClarity": 0.8,
      "packCompleteness": 0.83,
      "egoOnlyAdherence": 0.84,
      "occlusionHardness": 0.27,
      "driftRisk": 0.34,
      "overclaimRisk": 0.22,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 77.64,
      "exoScore": 83.17,
      "fusionScore": 80.25,
      "completenessScore": 87.68,
      "egoOnlyScore": 47.68,
      "confidence": 65.45,
      "fusionContribution": 82.02,
      "egoOnlyContribution": 50.82,
      "overall": 80.4
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 33.17,
      "exoScore": 25.61,
      "fusionScore": 22.47,
      "completenessScore": 44.32,
      "egoOnlyScore": 68.8,
      "confidence": 37.1,
      "fusionContribution": 38.87,
      "egoOnlyContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "pm-027",
    "input": {
      "egoCoverage": 0.87,
      "exoCoverage": 0.81,
      "fusionClarity": 0.84,
      "packCompleteness": 0.87,
      "egoOnlyAdherence": 0.88,
      "occlusionHardness": 0.27,
      "driftRisk": 0.3,
      "overclaimRisk": 0.17,
      "motionBias": "exo_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 90.29,
      "exoScore": 82.98,
      "fusionScore": 59.14,
      "completenessScore": 100,
      "egoOnlyScore": 49.35,
      "confidence": 67.65,
      "fusionContribution": 81.8,
      "egoOnlyContribution": 52.46,
      "overall": 80.52
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 30.78,
      "exoScore": 25.12,
      "fusionScore": 21.53,
      "completenessScore": 44.62,
      "egoOnlyScore": 45.22,
      "confidence": 37.2,
      "fusionContribution": 33.45,
      "egoOnlyContribution": 49.68,
      "overall": 42.93
    }
  },
  {
    "id": "pm-028",
    "input": {
      "egoCoverage": 0.83,
      "exoCoverage": 0.86,
      "fusionClarity": 0.87,
      "packCompleteness": 0.83,
      "egoOnlyAdherence": 0.84,
      "occlusionHardness": 0.2,
      "driftRisk": 0.31,
      "overclaimRisk": 0.17,
      "motionBias": "ego_first",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 37.95,
      "exoScore": 75.3,
      "fusionScore": 61.09,
      "completenessScore": 53.51,
      "egoOnlyScore": 48.34,
      "confidence": 66.8,
      "fusionContribution": 57.56,
      "egoOnlyContribution": 51.78,
      "overall": 57.52
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 38.81,
      "exoScore": 25.07,
      "fusionScore": 22.44,
      "completenessScore": 43.48,
      "egoOnlyScore": 86.95,
      "confidence": 37.65,
      "fusionContribution": 43.35,
      "egoOnlyContribution": 72.62,
      "overall": 63.56
    }
  },
  {
    "id": "pm-029",
    "input": {
      "egoCoverage": 0.87,
      "exoCoverage": 0.9,
      "fusionClarity": 0.91,
      "packCompleteness": 0.87,
      "egoOnlyAdherence": 0.87,
      "occlusionHardness": 0.2,
      "driftRisk": 0.33,
      "overclaimRisk": 0.18,
      "motionBias": "balanced",
      "profile": "distributed_ego_exo_fusion"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 84.21,
      "exoScore": 88.91,
      "fusionScore": 90.19,
      "completenessScore": 92.27,
      "egoOnlyScore": 50.59,
      "confidence": 69.9,
      "fusionContribution": 88.88,
      "egoOnlyContribution": 54.2,
      "overall": 86.64
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 36.33,
      "exoScore": 26.42,
      "fusionScore": 23.73,
      "completenessScore": 45,
      "egoOnlyScore": 71.06,
      "confidence": 39.5,
      "fusionContribution": 40.51,
      "egoOnlyContribution": 65.11,
      "overall": 57.02
    }
  },
  {
    "id": "pm-030",
    "input": {
      "egoCoverage": 0.91,
      "exoCoverage": 0.88,
      "fusionClarity": 0.87,
      "packCompleteness": 0.91,
      "egoOnlyAdherence": 0.91,
      "occlusionHardness": 0.21,
      "driftRisk": 0.28,
      "overclaimRisk": 0.13,
      "motionBias": "fusion_first",
      "profile": "ego_only_baseline"
    },
    "expectedFusion": {
      "mode": "distributed_ego_exo_fusion",
      "egoScore": 94.88,
      "exoScore": 88.77,
      "fusionScore": 100,
      "completenessScore": 71.68,
      "egoOnlyScore": 51.88,
      "confidence": 72.25,
      "fusionContribution": 89.62,
      "egoOnlyContribution": 55.26,
      "overall": 87.44
    },
    "expectedEgoOnly": {
      "mode": "ego_only_baseline",
      "egoScore": 25.72,
      "exoScore": 25.24,
      "fusionScore": 22.06,
      "completenessScore": 45.02,
      "egoOnlyScore": 46.21,
      "confidence": 38.95,
      "fusionContribution": 32.85,
      "egoOnlyContribution": 50.65,
      "overall": 44.27
    }
  }
];
