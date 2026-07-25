import type { TrackMapInput, TrackMapQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TrackMapInput;
  expectedOnlineSlam: TrackMapQuality;
  expectedOfflineKinematics: TrackMapQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tm-001",
    "input": {
      "deformCoverage": 0.29,
      "slamFidelity": 0.25,
      "poseGrounding": 0.28,
      "packCompleteness": 0.34,
      "kinematicsConfidence": 0.39,
      "kinematicsOptimism": 0.45,
      "deformHardness": 0.59,
      "overclaimRisk": 0.5,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 23.37,
      "fidelityScore": 30.25,
      "poseScore": 23.45,
      "completenessScore": 37.64,
      "kinematicsScore": 16.4,
      "confidence": 20.85,
      "slamContribution": 28.18,
      "kinematicsContribution": 15.92,
      "overall": 29.97
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 5.76,
      "fidelityScore": 17.05,
      "poseScore": 12.78,
      "completenessScore": 32.39,
      "kinematicsScore": 40.93,
      "confidence": 17.1,
      "slamContribution": 21.78,
      "kinematicsContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "tm-002",
    "input": {
      "deformCoverage": 0.33,
      "slamFidelity": 0.29,
      "poseGrounding": 0.32,
      "packCompleteness": 0.38,
      "kinematicsConfidence": 0.43,
      "kinematicsOptimism": 0.46,
      "deformHardness": 0.6,
      "overclaimRisk": 0.51,
      "trackBias": "pose_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 22.88,
      "fidelityScore": 33.9,
      "poseScore": 34.35,
      "completenessScore": 31.9,
      "kinematicsScore": 18.89,
      "confidence": 24.5,
      "slamContribution": 30.72,
      "kinematicsContribution": 18.58,
      "overall": 32.53
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 2.43,
      "fidelityScore": 18.17,
      "poseScore": 13.81,
      "completenessScore": 34.08,
      "kinematicsScore": 31.53,
      "confidence": 18.65,
      "slamContribution": 20,
      "kinematicsContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "tm-003",
    "input": {
      "deformCoverage": 0.37,
      "slamFidelity": 0.27,
      "poseGrounding": 0.36,
      "packCompleteness": 0.42,
      "kinematicsConfidence": 0.46,
      "kinematicsOptimism": 0.42,
      "deformHardness": 0.6,
      "overclaimRisk": 0.46,
      "trackBias": "kinematics_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 14.21,
      "fidelityScore": 23.71,
      "poseScore": 20.92,
      "completenessScore": 19.24,
      "kinematicsScore": 19.94,
      "confidence": 27.1,
      "slamContribution": 19.48,
      "kinematicsContribution": 19.65,
      "overall": 20.51
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 12.17,
      "fidelityScore": 17.05,
      "poseScore": 12.78,
      "completenessScore": 33.93,
      "kinematicsScore": 54.34,
      "confidence": 18.4,
      "slamContribution": 26.05,
      "kinematicsContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "tm-004",
    "input": {
      "deformCoverage": 0.33,
      "slamFidelity": 0.32,
      "poseGrounding": 0.39,
      "packCompleteness": 0.38,
      "kinematicsConfidence": 0.42,
      "kinematicsOptimism": 0.43,
      "deformHardness": 0.53,
      "overclaimRisk": 0.46,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 30.23,
      "fidelityScore": 36.03,
      "poseScore": 33.26,
      "completenessScore": 42.23,
      "kinematicsScore": 18.93,
      "confidence": 25.85,
      "slamContribution": 35.11,
      "kinematicsContribution": 19.24,
      "overall": 36.25
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 8.7,
      "fidelityScore": 18.05,
      "poseScore": 14.08,
      "completenessScore": 32.79,
      "kinematicsScore": 42.77,
      "confidence": 18.85,
      "slamContribution": 23.28,
      "kinematicsContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "tm-005",
    "input": {
      "deformCoverage": 0.37,
      "slamFidelity": 0.36,
      "poseGrounding": 0.35,
      "packCompleteness": 0.42,
      "kinematicsConfidence": 0.46,
      "kinematicsOptimism": 0.45,
      "deformHardness": 0.53,
      "overclaimRisk": 0.47,
      "trackBias": "deform_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 26.59,
      "fidelityScore": 39.64,
      "poseScore": 21.33,
      "completenessScore": 54.3,
      "kinematicsScore": 21.8,
      "confidence": 29.35,
      "slamContribution": 34.35,
      "kinematicsContribution": 22.12,
      "overall": 36.15
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 0,
      "fidelityScore": 19.43,
      "poseScore": 15.31,
      "completenessScore": 34.77,
      "kinematicsScore": 32.95,
      "confidence": 21.05,
      "slamContribution": 20.49,
      "kinematicsContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "tm-006",
    "input": {
      "deformCoverage": 0.41,
      "slamFidelity": 0.34,
      "poseGrounding": 0.39,
      "packCompleteness": 0.45,
      "kinematicsConfidence": 0.5,
      "kinematicsOptimism": 0.4,
      "deformHardness": 0.54,
      "overclaimRisk": 0.42,
      "trackBias": "balanced",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 35.28,
      "fidelityScore": 39.5,
      "poseScore": 35.78,
      "completenessScore": 47.85,
      "kinematicsScore": 23.08,
      "confidence": 31.85,
      "slamContribution": 39.2,
      "kinematicsContribution": 23.32,
      "overall": 40.34
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 11.98,
      "fidelityScore": 17.95,
      "poseScore": 13.91,
      "completenessScore": 34.78,
      "kinematicsScore": 46.72,
      "confidence": 20.5,
      "slamContribution": 25.07,
      "kinematicsContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "tm-007",
    "input": {
      "deformCoverage": 0.45,
      "slamFidelity": 0.38,
      "poseGrounding": 0.42,
      "packCompleteness": 0.49,
      "kinematicsConfidence": 0.53,
      "kinematicsOptimism": 0.42,
      "deformHardness": 0.55,
      "overclaimRisk": 0.43,
      "trackBias": "pose_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 32.43,
      "fidelityScore": 43.11,
      "poseScore": 48.27,
      "completenessScore": 39.34,
      "kinematicsScore": 25.15,
      "confidence": 35.35,
      "slamContribution": 40.95,
      "kinematicsContribution": 25.54,
      "overall": 42.18
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 8.27,
      "fidelityScore": 19.21,
      "poseScore": 15.09,
      "completenessScore": 36.3,
      "kinematicsScore": 34.2,
      "confidence": 22.15,
      "slamContribution": 22.61,
      "kinematicsContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "tm-008",
    "input": {
      "deformCoverage": 0.41,
      "slamFidelity": 0.43,
      "poseGrounding": 0.46,
      "packCompleteness": 0.45,
      "kinematicsConfidence": 0.49,
      "kinematicsOptimism": 0.43,
      "deformHardness": 0.47,
      "overclaimRisk": 0.44,
      "trackBias": "kinematics_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 20.12,
      "fidelityScore": 35.43,
      "poseScore": 27.76,
      "completenessScore": 24.76,
      "kinematicsScore": 24.32,
      "confidence": 34.1,
      "slamContribution": 26.95,
      "kinematicsContribution": 25.37,
      "overall": 27.67
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 16.4,
      "fidelityScore": 20.36,
      "poseScore": 16.57,
      "completenessScore": 35.17,
      "kinematicsScore": 58.5,
      "confidence": 22.7,
      "slamContribution": 29.4,
      "kinematicsContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "tm-009",
    "input": {
      "deformCoverage": 0.46,
      "slamFidelity": 0.41,
      "poseGrounding": 0.5,
      "packCompleteness": 0.49,
      "kinematicsConfidence": 0.53,
      "kinematicsOptimism": 0.39,
      "deformHardness": 0.48,
      "overclaimRisk": 0.38,
      "trackBias": "balanced",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 42.68,
      "fidelityScore": 45.49,
      "poseScore": 45.8,
      "completenessScore": 52.59,
      "kinematicsScore": 25.81,
      "confidence": 37.1,
      "slamContribution": 46.41,
      "kinematicsContribution": 26.81,
      "overall": 46.88
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 14.91,
      "fidelityScore": 19.22,
      "poseScore": 15.52,
      "completenessScore": 35.36,
      "kinematicsScore": 48.88,
      "confidence": 22.7,
      "slamContribution": 26.78,
      "kinematicsContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "tm-010",
    "input": {
      "deformCoverage": 0.5,
      "slamFidelity": 0.45,
      "poseGrounding": 0.46,
      "packCompleteness": 0.53,
      "kinematicsConfidence": 0.57,
      "kinematicsOptimism": 0.4,
      "deformHardness": 0.49,
      "overclaimRisk": 0.39,
      "trackBias": "deform_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 36.76,
      "fidelityScore": 49.14,
      "poseScore": 30.54,
      "completenessScore": 66.82,
      "kinematicsScore": 28.29,
      "confidence": 40.75,
      "slamContribution": 44.6,
      "kinematicsContribution": 29.21,
      "overall": 45.83
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 3.59,
      "fidelityScore": 20.03,
      "poseScore": 16.17,
      "completenessScore": 37.06,
      "kinematicsScore": 35.54,
      "confidence": 24.25,
      "slamContribution": 22.48,
      "kinematicsContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "tm-011",
    "input": {
      "deformCoverage": 0.54,
      "slamFidelity": 0.49,
      "poseGrounding": 0.49,
      "packCompleteness": 0.57,
      "kinematicsConfidence": 0.6,
      "kinematicsOptimism": 0.42,
      "deformHardness": 0.49,
      "overclaimRisk": 0.4,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 47.07,
      "fidelityScore": 52.75,
      "poseScore": 47.04,
      "completenessScore": 60.27,
      "kinematicsScore": 30.54,
      "confidence": 44.25,
      "slamContribution": 51.33,
      "kinematicsContribution": 31.67,
      "overall": 51.79
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 17.1,
      "fidelityScore": 21.44,
      "poseScore": 17.52,
      "completenessScore": 38.58,
      "kinematicsScore": 54.12,
      "confidence": 26.1,
      "slamContribution": 29.75,
      "kinematicsContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "tm-012",
    "input": {
      "deformCoverage": 0.5,
      "slamFidelity": 0.48,
      "poseGrounding": 0.53,
      "packCompleteness": 0.53,
      "kinematicsConfidence": 0.56,
      "kinematicsOptimism": 0.37,
      "deformHardness": 0.42,
      "overclaimRisk": 0.35,
      "trackBias": "pose_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 39.39,
      "fidelityScore": 51.28,
      "poseScore": 62.01,
      "completenessScore": 43.82,
      "kinematicsScore": 28.34,
      "confidence": 42.1,
      "slamContribution": 49.55,
      "kinematicsContribution": 29.77,
      "overall": 49.99
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 13.23,
      "fidelityScore": 19.78,
      "poseScore": 16.29,
      "completenessScore": 35.76,
      "kinematicsScore": 34.93,
      "confidence": 24.35,
      "slamContribution": 24,
      "kinematicsContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "tm-013",
    "input": {
      "deformCoverage": 0.54,
      "slamFidelity": 0.52,
      "poseGrounding": 0.56,
      "packCompleteness": 0.57,
      "kinematicsConfidence": 0.6,
      "kinematicsOptimism": 0.39,
      "deformHardness": 0.42,
      "overclaimRisk": 0.36,
      "trackBias": "kinematics_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 30.08,
      "fidelityScore": 44.88,
      "poseScore": 36.64,
      "completenessScore": 32.66,
      "kinematicsScore": 31.2,
      "confidence": 45.6,
      "slamContribution": 36.04,
      "kinematicsContribution": 32.85,
      "overall": 36.47
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 22.62,
      "fidelityScore": 21.42,
      "poseScore": 17.82,
      "completenessScore": 37.74,
      "kinematicsScore": 67.02,
      "confidence": 26.55,
      "slamContribution": 33.32,
      "kinematicsContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "tm-014",
    "input": {
      "deformCoverage": 0.58,
      "slamFidelity": 0.56,
      "poseGrounding": 0.6,
      "packCompleteness": 0.61,
      "kinematicsConfidence": 0.63,
      "kinematicsOptimism": 0.4,
      "deformHardness": 0.43,
      "overclaimRisk": 0.36,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 53.79,
      "fidelityScore": 58.53,
      "poseScore": 56.71,
      "completenessScore": 64.86,
      "kinematicsScore": 33.07,
      "confidence": 49.25,
      "slamContribution": 58.18,
      "kinematicsContribution": 34.85,
      "overall": 57.98
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 20.03,
      "fidelityScore": 22.26,
      "poseScore": 18.61,
      "completenessScore": 38.98,
      "kinematicsScore": 55.96,
      "confidence": 27.85,
      "slamContribution": 31.17,
      "kinematicsContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "tm-015",
    "input": {
      "deformCoverage": 0.62,
      "slamFidelity": 0.54,
      "poseGrounding": 0.56,
      "packCompleteness": 0.65,
      "kinematicsConfidence": 0.67,
      "kinematicsOptimism": 0.36,
      "deformHardness": 0.44,
      "overclaimRisk": 0.31,
      "trackBias": "deform_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 46.23,
      "fidelityScore": 58.35,
      "poseScore": 39.15,
      "completenessScore": 79.94,
      "kinematicsScore": 34.55,
      "confidence": 51.85,
      "slamContribution": 54.57,
      "kinematicsContribution": 36.06,
      "overall": 55.24
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 9.43,
      "fidelityScore": 20.94,
      "poseScore": 17.24,
      "completenessScore": 39.27,
      "kinematicsScore": 38.2,
      "confidence": 27.75,
      "slamContribution": 25.02,
      "kinematicsContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "tm-016",
    "input": {
      "deformCoverage": 0.58,
      "slamFidelity": 0.59,
      "poseGrounding": 0.6,
      "packCompleteness": 0.6,
      "kinematicsConfidence": 0.63,
      "kinematicsOptimism": 0.37,
      "deformHardness": 0.36,
      "overclaimRisk": 0.32,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 54.78,
      "fidelityScore": 60.67,
      "poseScore": 57.91,
      "completenessScore": 65.05,
      "kinematicsScore": 33.73,
      "confidence": 50.35,
      "slamContribution": 59.33,
      "kinematicsContribution": 35.81,
      "overall": 59.1
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 22.05,
      "fidelityScore": 21.96,
      "poseScore": 18.63,
      "completenessScore": 38.14,
      "kinematicsScore": 55.7,
      "confidence": 28.3,
      "slamContribution": 31.3,
      "kinematicsContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "tm-017",
    "input": {
      "deformCoverage": 0.62,
      "slamFidelity": 0.63,
      "poseGrounding": 0.63,
      "packCompleteness": 0.64,
      "kinematicsConfidence": 0.67,
      "kinematicsOptimism": 0.39,
      "deformHardness": 0.37,
      "overclaimRisk": 0.33,
      "trackBias": "pose_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 48.45,
      "fidelityScore": 64.28,
      "poseScore": 75.16,
      "completenessScore": 52.76,
      "kinematicsScore": 36.41,
      "confidence": 53.85,
      "slamContribution": 60.68,
      "kinematicsContribution": 38.64,
      "overall": 60.71
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 18.73,
      "fidelityScore": 23.45,
      "poseScore": 19.98,
      "completenessScore": 40.11,
      "kinematicsScore": 39.86,
      "confidence": 30.3,
      "slamContribution": 28.43,
      "kinematicsContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "tm-018",
    "input": {
      "deformCoverage": 0.66,
      "slamFidelity": 0.61,
      "poseGrounding": 0.67,
      "packCompleteness": 0.68,
      "kinematicsConfidence": 0.7,
      "kinematicsOptimism": 0.34,
      "deformHardness": 0.38,
      "overclaimRisk": 0.27,
      "trackBias": "kinematics_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 39.72,
      "fidelityScore": 54.13,
      "poseScore": 45.55,
      "completenessScore": 40.09,
      "kinematicsScore": 37.08,
      "confidence": 56.6,
      "slamContribution": 44.89,
      "kinematicsContribution": 39.18,
      "overall": 44.86
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 28.36,
      "fidelityScore": 21.69,
      "poseScore": 18.3,
      "completenessScore": 39.67,
      "kinematicsScore": 74.27,
      "confidence": 29.5,
      "slamContribution": 36.46,
      "kinematicsContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "tm-019",
    "input": {
      "deformCoverage": 0.7,
      "slamFidelity": 0.65,
      "poseGrounding": 0.7,
      "packCompleteness": 0.72,
      "kinematicsConfidence": 0.74,
      "kinematicsOptimism": 0.36,
      "deformHardness": 0.38,
      "overclaimRisk": 0.28,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 65.21,
      "fidelityScore": 67.74,
      "poseScore": 68.17,
      "completenessScore": 75.07,
      "kinematicsScore": 39.94,
      "confidence": 60.1,
      "slamContribution": 68.82,
      "kinematicsContribution": 42.25,
      "overall": 68.04
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 26.25,
      "fidelityScore": 23.32,
      "poseScore": 19.82,
      "completenessScore": 41.65,
      "kinematicsScore": 62.07,
      "confidence": 31.7,
      "slamContribution": 34.62,
      "kinematicsContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "tm-020",
    "input": {
      "deformCoverage": 0.66,
      "slamFidelity": 0.7,
      "poseGrounding": 0.66,
      "packCompleteness": 0.68,
      "kinematicsConfidence": 0.7,
      "kinematicsOptimism": 0.37,
      "deformHardness": 0.31,
      "overclaimRisk": 0.29,
      "trackBias": "deform_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 51.95,
      "fidelityScore": 70.06,
      "poseScore": 45.74,
      "completenessScore": 86.81,
      "kinematicsScore": 38.94,
      "confidence": 58.85,
      "slamContribution": 62.23,
      "kinematicsContribution": 41.54,
      "overall": 62.51
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 13.66,
      "fidelityScore": 23.93,
      "poseScore": 20.65,
      "completenessScore": 40.51,
      "kinematicsScore": 40.86,
      "confidence": 32.05,
      "slamContribution": 27.92,
      "kinematicsContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "tm-021",
    "input": {
      "deformCoverage": 0.7,
      "slamFidelity": 0.68,
      "poseGrounding": 0.7,
      "packCompleteness": 0.72,
      "kinematicsConfidence": 0.73,
      "kinematicsOptimism": 0.33,
      "deformHardness": 0.31,
      "overclaimRisk": 0.24,
      "trackBias": "balanced",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 66.16,
      "fidelityScore": 69.88,
      "poseScore": 69.32,
      "completenessScore": 75.82,
      "kinematicsScore": 39.99,
      "confidence": 61.45,
      "slamContribution": 70.06,
      "kinematicsContribution": 42.54,
      "overall": 69.11
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 27.89,
      "fidelityScore": 22.72,
      "poseScore": 19.52,
      "completenessScore": 40.35,
      "kinematicsScore": 61.19,
      "confidence": 31.8,
      "slamContribution": 34.33,
      "kinematicsContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "tm-022",
    "input": {
      "deformCoverage": 0.74,
      "slamFidelity": 0.72,
      "poseGrounding": 0.73,
      "packCompleteness": 0.76,
      "kinematicsConfidence": 0.77,
      "kinematicsOptimism": 0.34,
      "deformHardness": 0.32,
      "overclaimRisk": 0.25,
      "trackBias": "pose_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 57.83,
      "fidelityScore": 73.52,
      "poseScore": 88.84,
      "completenessScore": 60.51,
      "kinematicsScore": 42.47,
      "confidence": 65.1,
      "slamContribution": 70.87,
      "kinematicsContribution": 45.13,
      "overall": 70.24
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 24.57,
      "fidelityScore": 23.77,
      "poseScore": 20.46,
      "completenessScore": 42.05,
      "kinematicsScore": 42.21,
      "confidence": 33.35,
      "slamContribution": 30.61,
      "kinematicsContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "tm-023",
    "input": {
      "deformCoverage": 0.79,
      "slamFidelity": 0.76,
      "poseGrounding": 0.77,
      "packCompleteness": 0.8,
      "kinematicsConfidence": 0.81,
      "kinematicsOptimism": 0.36,
      "deformHardness": 0.33,
      "overclaimRisk": 0.25,
      "trackBias": "kinematics_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 49.24,
      "fidelityScore": 67.38,
      "poseScore": 53.71,
      "completenessScore": 49.49,
      "kinematicsScore": 45.16,
      "confidence": 69,
      "slamContribution": 54.9,
      "kinematicsContribution": 47.99,
      "overall": 54.66
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 33.86,
      "fidelityScore": 25.2,
      "poseScore": 21.84,
      "completenessScore": 43.92,
      "kinematicsScore": 84.72,
      "confidence": 35.45,
      "slamContribution": 41.91,
      "kinematicsContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "tm-024",
    "input": {
      "deformCoverage": 0.75,
      "slamFidelity": 0.75,
      "poseGrounding": 0.81,
      "packCompleteness": 0.76,
      "kinematicsConfidence": 0.77,
      "kinematicsOptimism": 0.31,
      "deformHardness": 0.25,
      "overclaimRisk": 0.2,
      "trackBias": "balanced",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 73.31,
      "fidelityScore": 75.91,
      "poseScore": 79.08,
      "completenessScore": 80.56,
      "kinematicsScore": 43.13,
      "confidence": 66.85,
      "slamContribution": 77.14,
      "kinematicsContribution": 46.16,
      "overall": 75.56
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 31.21,
      "fidelityScore": 23.47,
      "poseScore": 20.52,
      "completenessScore": 41.11,
      "kinematicsScore": 63.65,
      "confidence": 33.9,
      "slamContribution": 35.99,
      "kinematicsContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "tm-025",
    "input": {
      "deformCoverage": 0.79,
      "slamFidelity": 0.79,
      "poseGrounding": 0.77,
      "packCompleteness": 0.8,
      "kinematicsConfidence": 0.8,
      "kinematicsOptimism": 0.33,
      "deformHardness": 0.26,
      "overclaimRisk": 0.21,
      "trackBias": "deform_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 62.03,
      "fidelityScore": 79.52,
      "poseScore": 54.83,
      "completenessScore": 100,
      "kinematicsScore": 45.2,
      "confidence": 70.35,
      "slamContribution": 72.57,
      "kinematicsContribution": 48.24,
      "overall": 72.19
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 19.5,
      "fidelityScore": 24.56,
      "poseScore": 21.5,
      "completenessScore": 42.63,
      "kinematicsScore": 43.52,
      "confidence": 35.55,
      "slamContribution": 30.34,
      "kinematicsContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "tm-026",
    "input": {
      "deformCoverage": 0.83,
      "slamFidelity": 0.83,
      "poseGrounding": 0.8,
      "packCompleteness": 0.83,
      "kinematicsConfidence": 0.84,
      "kinematicsOptimism": 0.34,
      "deformHardness": 0.27,
      "overclaimRisk": 0.22,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 77.64,
      "fidelityScore": 83.17,
      "poseScore": 80.25,
      "completenessScore": 87.68,
      "kinematicsScore": 47.68,
      "confidence": 73.75,
      "slamContribution": 81.91,
      "kinematicsContribution": 50.82,
      "overall": 80.31
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 33.17,
      "fidelityScore": 25.61,
      "poseScore": 22.47,
      "completenessScore": 44.32,
      "kinematicsScore": 68.8,
      "confidence": 37.1,
      "slamContribution": 38.87,
      "kinematicsContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "tm-027",
    "input": {
      "deformCoverage": 0.87,
      "slamFidelity": 0.81,
      "poseGrounding": 0.84,
      "packCompleteness": 0.87,
      "kinematicsConfidence": 0.88,
      "kinematicsOptimism": 0.3,
      "deformHardness": 0.27,
      "overclaimRisk": 0.17,
      "trackBias": "pose_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 67.91,
      "fidelityScore": 82.98,
      "poseScore": 100,
      "completenessScore": 68.1,
      "kinematicsScore": 49.35,
      "confidence": 76.35,
      "slamContribution": 80.55,
      "kinematicsContribution": 52.46,
      "overall": 79.49
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 30.78,
      "fidelityScore": 24.64,
      "poseScore": 21.53,
      "completenessScore": 44.62,
      "kinematicsScore": 45.22,
      "confidence": 37.2,
      "slamContribution": 33.36,
      "kinematicsContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "tm-028",
    "input": {
      "deformCoverage": 0.83,
      "slamFidelity": 0.86,
      "poseGrounding": 0.87,
      "packCompleteness": 0.83,
      "kinematicsConfidence": 0.84,
      "kinematicsOptimism": 0.31,
      "deformHardness": 0.2,
      "overclaimRisk": 0.17,
      "trackBias": "kinematics_first",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 55.14,
      "fidelityScore": 75.3,
      "poseScore": 60.67,
      "completenessScore": 53.51,
      "kinematicsScore": 48.34,
      "confidence": 75.1,
      "slamContribution": 61.17,
      "kinematicsContribution": 51.78,
      "overall": 60.48
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 38.81,
      "fidelityScore": 25.31,
      "poseScore": 22.44,
      "completenessScore": 43.48,
      "kinematicsScore": 86.95,
      "confidence": 37.65,
      "slamContribution": 43.4,
      "kinematicsContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "tm-029",
    "input": {
      "deformCoverage": 0.87,
      "slamFidelity": 0.9,
      "poseGrounding": 0.91,
      "packCompleteness": 0.87,
      "kinematicsConfidence": 0.87,
      "kinematicsOptimism": 0.33,
      "deformHardness": 0.2,
      "overclaimRisk": 0.18,
      "trackBias": "balanced",
      "profile": "online_deformable_slam"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 84.21,
      "fidelityScore": 88.91,
      "poseScore": 89.77,
      "completenessScore": 92.27,
      "kinematicsScore": 50.59,
      "confidence": 78.6,
      "slamContribution": 88.67,
      "kinematicsContribution": 54.2,
      "overall": 86.47
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 36.33,
      "fidelityScore": 26.66,
      "poseScore": 23.73,
      "completenessScore": 45,
      "kinematicsScore": 71.06,
      "confidence": 39.5,
      "slamContribution": 40.56,
      "kinematicsContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "tm-030",
    "input": {
      "deformCoverage": 0.91,
      "slamFidelity": 0.88,
      "poseGrounding": 0.87,
      "packCompleteness": 0.91,
      "kinematicsConfidence": 0.91,
      "kinematicsOptimism": 0.28,
      "deformHardness": 0.21,
      "overclaimRisk": 0.13,
      "trackBias": "deform_first",
      "profile": "offline_kinematics_prior_baseline"
    },
    "expectedOnlineSlam": {
      "mode": "online_deformable_slam",
      "deformScore": 71.33,
      "fidelityScore": 88.77,
      "poseScore": 63.21,
      "completenessScore": 100,
      "kinematicsScore": 51.88,
      "confidence": 81.35,
      "slamContribution": 79.55,
      "kinematicsContribution": 55.26,
      "overall": 79.18
    },
    "expectedOfflineKinematics": {
      "mode": "offline_kinematics_prior_baseline",
      "deformScore": 25.72,
      "fidelityScore": 25,
      "poseScore": 22.06,
      "completenessScore": 45.02,
      "kinematicsScore": 46.21,
      "confidence": 38.95,
      "slamContribution": 32.8,
      "kinematicsContribution": 50.65,
      "overall": 44.26
    }
  }
];
