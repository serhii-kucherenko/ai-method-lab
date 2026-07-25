import type { AccessEquityInput, AccessEquityQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AccessEquityInput;
  expectedEquityAccess: AccessEquityQuality;
  expectedAccuracyOnly: AccessEquityQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ae-001",
    "input": {
      "accessReach": 0.29,
      "equityGapClosure": 0.25,
      "taskSharingFidelity": 0.28,
      "packReadiness": 0.34,
      "accuracyAdherence": 0.39,
      "screenNoise": 0.59,
      "accuracyTunnel": 0.45,
      "overclaimRisk": 0.5,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 22.56,
      "equityScore": 30.25,
      "sharingScore": 22.93,
      "readinessScore": 37.64,
      "accuracyScore": 16.4,
      "confidence": 17.95,
      "equityAccessContribution": 27.98,
      "accuracyOnlyContribution": 15.96,
      "overall": 29.82
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 5.76,
      "equityScore": 17.41,
      "sharingScore": 12.83,
      "readinessScore": 32.39,
      "accuracyScore": 40.93,
      "confidence": 17.1,
      "equityAccessContribution": 21.86,
      "accuracyOnlyContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "ae-002",
    "input": {
      "accessReach": 0.33,
      "equityGapClosure": 0.29,
      "taskSharingFidelity": 0.32,
      "packReadiness": 0.38,
      "accuracyAdherence": 0.43,
      "screenNoise": 0.6,
      "accuracyTunnel": 0.46,
      "overclaimRisk": 0.51,
      "equityBias": "task_sharing_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 28.57,
      "equityScore": 33.9,
      "sharingScore": 17.2,
      "readinessScore": 48.93,
      "accuracyScore": 18.89,
      "confidence": 21.2,
      "equityAccessContribution": 31.25,
      "accuracyOnlyContribution": 18.61,
      "overall": 32.97
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 2.43,
      "equityScore": 18.54,
      "sharingScore": 13.86,
      "readinessScore": 34.08,
      "accuracyScore": 31.53,
      "confidence": 18.65,
      "equityAccessContribution": 20.09,
      "accuracyOnlyContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "ae-003",
    "input": {
      "accessReach": 0.37,
      "equityGapClosure": 0.27,
      "taskSharingFidelity": 0.36,
      "packReadiness": 0.42,
      "accuracyAdherence": 0.46,
      "screenNoise": 0.6,
      "accuracyTunnel": 0.42,
      "overclaimRisk": 0.46,
      "equityBias": "accuracy_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 6.77,
      "equityScore": 23.71,
      "sharingScore": 19.55,
      "readinessScore": 19.24,
      "accuracyScore": 19.94,
      "confidence": 23.4,
      "equityAccessContribution": 17.5,
      "accuracyOnlyContribution": 19.69,
      "overall": 18.89
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 12.17,
      "equityScore": 17.9,
      "sharingScore": 12.83,
      "readinessScore": 33.93,
      "accuracyScore": 54.34,
      "confidence": 18.4,
      "equityAccessContribution": 26.23,
      "accuracyOnlyContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "ae-004",
    "input": {
      "accessReach": 0.33,
      "equityGapClosure": 0.32,
      "taskSharingFidelity": 0.39,
      "packReadiness": 0.38,
      "accuracyAdherence": 0.42,
      "screenNoise": 0.53,
      "accuracyTunnel": 0.43,
      "overclaimRisk": 0.46,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 28.09,
      "equityScore": 36.03,
      "sharingScore": 32.93,
      "readinessScore": 42.23,
      "accuracyScore": 18.93,
      "confidence": 22.55,
      "equityAccessContribution": 34.62,
      "accuracyOnlyContribution": 19.05,
      "overall": 35.82
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 8.7,
      "equityScore": 17.89,
      "sharingScore": 13.8,
      "readinessScore": 32.79,
      "accuracyScore": 42.77,
      "confidence": 18.85,
      "equityAccessContribution": 23.19,
      "accuracyOnlyContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "ae-005",
    "input": {
      "accessReach": 0.37,
      "equityGapClosure": 0.36,
      "taskSharingFidelity": 0.35,
      "packReadiness": 0.42,
      "accuracyAdherence": 0.46,
      "screenNoise": 0.53,
      "accuracyTunnel": 0.45,
      "overclaimRisk": 0.47,
      "equityBias": "access_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 34.83,
      "equityScore": 39.64,
      "sharingScore": 39.44,
      "readinessScore": 35.49,
      "accuracyScore": 21.8,
      "confidence": 25.65,
      "equityAccessContribution": 37.52,
      "accuracyOnlyContribution": 22.19,
      "overall": 38.76
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 0,
      "equityScore": 19.59,
      "sharingScore": 15.41,
      "readinessScore": 34.77,
      "accuracyScore": 32.95,
      "confidence": 21.05,
      "equityAccessContribution": 20.54,
      "accuracyOnlyContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "ae-006",
    "input": {
      "accessReach": 0.41,
      "equityGapClosure": 0.34,
      "taskSharingFidelity": 0.39,
      "packReadiness": 0.45,
      "accuracyAdherence": 0.5,
      "screenNoise": 0.54,
      "accuracyTunnel": 0.4,
      "overclaimRisk": 0.42,
      "equityBias": "balanced",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 33.94,
      "equityScore": 39.5,
      "sharingScore": 34.86,
      "readinessScore": 47.85,
      "accuracyScore": 23.08,
      "confidence": 27.75,
      "equityAccessContribution": 38.7,
      "accuracyOnlyContribution": 23.38,
      "overall": 39.94
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 11.98,
      "equityScore": 18.6,
      "sharingScore": 14.01,
      "readinessScore": 34.78,
      "accuracyScore": 46.72,
      "confidence": 20.5,
      "equityAccessContribution": 25.22,
      "accuracyOnlyContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "ae-007",
    "input": {
      "accessReach": 0.45,
      "equityGapClosure": 0.38,
      "taskSharingFidelity": 0.42,
      "packReadiness": 0.49,
      "accuracyAdherence": 0.53,
      "screenNoise": 0.55,
      "accuracyTunnel": 0.42,
      "overclaimRisk": 0.43,
      "equityBias": "task_sharing_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 41.2,
      "equityScore": 43.11,
      "sharingScore": 25.56,
      "readinessScore": 61.29,
      "accuracyScore": 25.15,
      "confidence": 30.85,
      "equityAccessContribution": 41.74,
      "accuracyOnlyContribution": 25.64,
      "overall": 42.84
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 8.27,
      "equityScore": 19.9,
      "sharingScore": 15.24,
      "readinessScore": 36.3,
      "accuracyScore": 34.2,
      "confidence": 22.15,
      "equityAccessContribution": 22.78,
      "accuracyOnlyContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "ae-008",
    "input": {
      "accessReach": 0.41,
      "equityGapClosure": 0.43,
      "taskSharingFidelity": 0.46,
      "packReadiness": 0.45,
      "accuracyAdherence": 0.49,
      "screenNoise": 0.47,
      "accuracyTunnel": 0.43,
      "overclaimRisk": 0.44,
      "equityBias": "accuracy_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 11.91,
      "equityScore": 35.43,
      "sharingScore": 27.9,
      "readinessScore": 24.76,
      "accuracyScore": 24.32,
      "confidence": 30,
      "equityAccessContribution": 25.33,
      "accuracyOnlyContribution": 25.23,
      "overall": 26.31
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 16.4,
      "equityScore": 20.02,
      "sharingScore": 16.36,
      "readinessScore": 35.17,
      "accuracyScore": 58.5,
      "confidence": 22.7,
      "equityAccessContribution": 29.29,
      "accuracyOnlyContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "ae-009",
    "input": {
      "accessReach": 0.46,
      "equityGapClosure": 0.41,
      "taskSharingFidelity": 0.5,
      "packReadiness": 0.49,
      "accuracyAdherence": 0.53,
      "screenNoise": 0.48,
      "accuracyTunnel": 0.39,
      "overclaimRisk": 0.38,
      "equityBias": "balanced",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 40.05,
      "equityScore": 45.49,
      "sharingScore": 44.98,
      "readinessScore": 52.59,
      "accuracyScore": 25.81,
      "confidence": 32.5,
      "equityAccessContribution": 45.6,
      "accuracyOnlyContribution": 26.69,
      "overall": 46.2
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 14.91,
      "equityScore": 19.47,
      "sharingScore": 15.34,
      "readinessScore": 35.36,
      "accuracyScore": 48.88,
      "confidence": 22.7,
      "equityAccessContribution": 26.79,
      "accuracyOnlyContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "ae-010",
    "input": {
      "accessReach": 0.5,
      "equityGapClosure": 0.45,
      "taskSharingFidelity": 0.46,
      "packReadiness": 0.53,
      "accuracyAdherence": 0.57,
      "screenNoise": 0.49,
      "accuracyTunnel": 0.4,
      "overclaimRisk": 0.39,
      "equityBias": "access_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 48,
      "equityScore": 49.14,
      "sharingScore": 53.86,
      "readinessScore": 43.07,
      "accuracyScore": 28.29,
      "confidence": 35.75,
      "equityAccessContribution": 48.85,
      "accuracyOnlyContribution": 29.32,
      "overall": 49.33
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 3.59,
      "equityScore": 20.58,
      "sharingScore": 16.35,
      "readinessScore": 37.06,
      "accuracyScore": 35.54,
      "confidence": 24.25,
      "equityAccessContribution": 22.62,
      "accuracyOnlyContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "ae-011",
    "input": {
      "accessReach": 0.54,
      "equityGapClosure": 0.49,
      "taskSharingFidelity": 0.49,
      "packReadiness": 0.57,
      "accuracyAdherence": 0.6,
      "screenNoise": 0.49,
      "accuracyTunnel": 0.42,
      "overclaimRisk": 0.4,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 47.21,
      "equityScore": 52.75,
      "sharingScore": 46.49,
      "readinessScore": 60.27,
      "accuracyScore": 30.54,
      "confidence": 38.85,
      "equityAccessContribution": 51.32,
      "accuracyOnlyContribution": 31.82,
      "overall": 51.81
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 17.1,
      "equityScore": 22.02,
      "sharingScore": 17.74,
      "readinessScore": 38.58,
      "accuracyScore": 54.12,
      "confidence": 26.1,
      "equityAccessContribution": 29.91,
      "accuracyOnlyContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "ae-012",
    "input": {
      "accessReach": 0.5,
      "equityGapClosure": 0.48,
      "taskSharingFidelity": 0.53,
      "packReadiness": 0.53,
      "accuracyAdherence": 0.56,
      "screenNoise": 0.42,
      "accuracyTunnel": 0.37,
      "overclaimRisk": 0.35,
      "equityBias": "task_sharing_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 50.05,
      "equityScore": 51.28,
      "sharingScore": 34.12,
      "readinessScore": 67.57,
      "accuracyScore": 28.34,
      "confidence": 37.1,
      "equityAccessContribution": 49.76,
      "accuracyOnlyContribution": 29.7,
      "overall": 50.15
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 13.23,
      "equityScore": 19.84,
      "sharingScore": 16.17,
      "readinessScore": 35.76,
      "accuracyScore": 34.93,
      "confidence": 24.35,
      "equityAccessContribution": 23.99,
      "accuracyOnlyContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "ae-013",
    "input": {
      "accessReach": 0.54,
      "equityGapClosure": 0.52,
      "taskSharingFidelity": 0.56,
      "packReadiness": 0.57,
      "accuracyAdherence": 0.6,
      "screenNoise": 0.42,
      "accuracyTunnel": 0.39,
      "overclaimRisk": 0.36,
      "equityBias": "accuracy_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 19.05,
      "equityScore": 44.88,
      "sharingScore": 36.31,
      "readinessScore": 32.66,
      "accuracyScore": 31.2,
      "confidence": 40.2,
      "equityAccessContribution": 33.59,
      "accuracyOnlyContribution": 32.8,
      "overall": 34.45
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 22.62,
      "equityScore": 21.51,
      "sharingScore": 17.75,
      "readinessScore": 37.74,
      "accuracyScore": 67.02,
      "confidence": 26.55,
      "equityAccessContribution": 33.33,
      "accuracyOnlyContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "ae-014",
    "input": {
      "accessReach": 0.58,
      "equityGapClosure": 0.56,
      "taskSharingFidelity": 0.6,
      "packReadiness": 0.61,
      "accuracyAdherence": 0.63,
      "screenNoise": 0.43,
      "accuracyTunnel": 0.4,
      "overclaimRisk": 0.36,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 52.62,
      "equityScore": 58.53,
      "sharingScore": 56.38,
      "readinessScore": 64.86,
      "accuracyScore": 33.07,
      "confidence": 43.45,
      "equityAccessContribution": 57.9,
      "accuracyOnlyContribution": 34.8,
      "overall": 57.74
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 20.03,
      "equityScore": 22.36,
      "sharingScore": 18.54,
      "readinessScore": 38.98,
      "accuracyScore": 55.96,
      "confidence": 27.85,
      "equityAccessContribution": 31.17,
      "accuracyOnlyContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "ae-015",
    "input": {
      "accessReach": 0.62,
      "equityGapClosure": 0.54,
      "taskSharingFidelity": 0.56,
      "packReadiness": 0.65,
      "accuracyAdherence": 0.67,
      "screenNoise": 0.44,
      "accuracyTunnel": 0.36,
      "overclaimRisk": 0.31,
      "equityBias": "access_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 60.5,
      "equityScore": 58.35,
      "sharingScore": 67.29,
      "readinessScore": 50.82,
      "accuracyScore": 34.55,
      "confidence": 45.65,
      "equityAccessContribution": 59.71,
      "accuracyOnlyContribution": 36.22,
      "overall": 59.48
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 9.43,
      "equityScore": 21.78,
      "sharingScore": 17.48,
      "readinessScore": 39.27,
      "accuracyScore": 38.2,
      "confidence": 27.75,
      "equityAccessContribution": 25.23,
      "accuracyOnlyContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "ae-016",
    "input": {
      "accessReach": 0.58,
      "equityGapClosure": 0.59,
      "taskSharingFidelity": 0.6,
      "packReadiness": 0.6,
      "accuracyAdherence": 0.63,
      "screenNoise": 0.36,
      "accuracyTunnel": 0.37,
      "overclaimRisk": 0.32,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 54.46,
      "equityScore": 60.67,
      "sharingScore": 58.01,
      "readinessScore": 65.05,
      "accuracyScore": 33.73,
      "confidence": 44.55,
      "equityAccessContribution": 59.4,
      "accuracyOnlyContribution": 35.76,
      "overall": 59.14
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 22.05,
      "equityScore": 21.83,
      "sharingScore": 18.56,
      "readinessScore": 38.14,
      "accuracyScore": 55.7,
      "confidence": 28.3,
      "equityAccessContribution": 31.26,
      "accuracyOnlyContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "ae-017",
    "input": {
      "accessReach": 0.62,
      "equityGapClosure": 0.63,
      "taskSharingFidelity": 0.63,
      "packReadiness": 0.64,
      "accuracyAdherence": 0.67,
      "screenNoise": 0.37,
      "accuracyTunnel": 0.39,
      "overclaimRisk": 0.33,
      "equityBias": "task_sharing_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 64.02,
      "equityScore": 64.28,
      "sharingScore": 42.54,
      "readinessScore": 81.43,
      "accuracyScore": 36.41,
      "confidence": 47.65,
      "equityAccessContribution": 61.9,
      "accuracyOnlyContribution": 38.61,
      "overall": 61.71
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 18.73,
      "equityScore": 23.34,
      "sharingScore": 19.95,
      "readinessScore": 40.11,
      "accuracyScore": 39.86,
      "confidence": 30.3,
      "equityAccessContribution": 28.4,
      "accuracyOnlyContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "ae-018",
    "input": {
      "accessReach": 0.66,
      "equityGapClosure": 0.61,
      "taskSharingFidelity": 0.67,
      "packReadiness": 0.68,
      "accuracyAdherence": 0.7,
      "screenNoise": 0.38,
      "accuracyTunnel": 0.34,
      "overclaimRisk": 0.27,
      "equityBias": "accuracy_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 25.78,
      "equityScore": 54.13,
      "sharingScore": 44.82,
      "readinessScore": 40.09,
      "accuracyScore": 37.08,
      "confidence": 50,
      "equityAccessContribution": 41.63,
      "accuracyOnlyContribution": 39.16,
      "overall": 42.19
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 28.36,
      "equityScore": 22.06,
      "sharingScore": 18.26,
      "readinessScore": 39.67,
      "accuracyScore": 74.27,
      "confidence": 29.5,
      "equityAccessContribution": 36.52,
      "accuracyOnlyContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "ae-019",
    "input": {
      "accessReach": 0.7,
      "equityGapClosure": 0.65,
      "taskSharingFidelity": 0.7,
      "packReadiness": 0.72,
      "accuracyAdherence": 0.74,
      "screenNoise": 0.38,
      "accuracyTunnel": 0.36,
      "overclaimRisk": 0.28,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 63.81,
      "equityScore": 67.74,
      "sharingScore": 67.47,
      "readinessScore": 75.07,
      "accuracyScore": 39.94,
      "confidence": 53.1,
      "equityAccessContribution": 68.33,
      "accuracyOnlyContribution": 42.25,
      "overall": 67.64
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 26.25,
      "equityScore": 23.72,
      "sharingScore": 19.82,
      "readinessScore": 41.65,
      "accuracyScore": 62.07,
      "confidence": 31.7,
      "equityAccessContribution": 34.7,
      "accuracyOnlyContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "ae-020",
    "input": {
      "accessReach": 0.66,
      "equityGapClosure": 0.7,
      "taskSharingFidelity": 0.66,
      "packReadiness": 0.68,
      "accuracyAdherence": 0.7,
      "screenNoise": 0.31,
      "accuracyTunnel": 0.37,
      "overclaimRisk": 0.29,
      "equityBias": "access_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 69.98,
      "equityScore": 70.06,
      "sharingScore": 80.6,
      "readinessScore": 56.34,
      "accuracyScore": 38.94,
      "confidence": 52.25,
      "equityAccessContribution": 69.97,
      "accuracyOnlyContribution": 41.54,
      "overall": 68.85
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 13.66,
      "equityScore": 23.61,
      "sharingScore": 20.65,
      "readinessScore": 40.51,
      "accuracyScore": 40.86,
      "confidence": 32.05,
      "equityAccessContribution": 27.86,
      "accuracyOnlyContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "ae-021",
    "input": {
      "accessReach": 0.7,
      "equityGapClosure": 0.68,
      "taskSharingFidelity": 0.7,
      "packReadiness": 0.72,
      "accuracyAdherence": 0.73,
      "screenNoise": 0.31,
      "accuracyTunnel": 0.33,
      "overclaimRisk": 0.24,
      "equityBias": "balanced",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 65.6,
      "equityScore": 69.88,
      "sharingScore": 69.04,
      "readinessScore": 75.82,
      "accuracyScore": 39.99,
      "confidence": 54.45,
      "equityAccessContribution": 69.92,
      "accuracyOnlyContribution": 42.54,
      "overall": 68.99
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 27.89,
      "equityScore": 22.88,
      "sharingScore": 19.52,
      "readinessScore": 40.35,
      "accuracyScore": 61.19,
      "confidence": 31.8,
      "equityAccessContribution": 34.37,
      "accuracyOnlyContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "ae-022",
    "input": {
      "accessReach": 0.74,
      "equityGapClosure": 0.72,
      "taskSharingFidelity": 0.73,
      "packReadiness": 0.76,
      "accuracyAdherence": 0.77,
      "screenNoise": 0.32,
      "accuracyTunnel": 0.34,
      "overclaimRisk": 0.25,
      "equityBias": "task_sharing_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 76.39,
      "equityScore": 73.52,
      "sharingScore": 50.64,
      "readinessScore": 94.56,
      "accuracyScore": 42.47,
      "confidence": 57.7,
      "equityAccessContribution": 72.43,
      "accuracyOnlyContribution": 45.15,
      "overall": 71.52
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 24.57,
      "equityScore": 23.95,
      "sharingScore": 20.48,
      "readinessScore": 42.05,
      "accuracyScore": 42.21,
      "confidence": 33.35,
      "equityAccessContribution": 30.65,
      "accuracyOnlyContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "ae-023",
    "input": {
      "accessReach": 0.79,
      "equityGapClosure": 0.76,
      "taskSharingFidelity": 0.77,
      "packReadiness": 0.8,
      "accuracyAdherence": 0.81,
      "screenNoise": 0.33,
      "accuracyTunnel": 0.36,
      "overclaimRisk": 0.25,
      "equityBias": "accuracy_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 33.46,
      "equityScore": 67.38,
      "sharingScore": 53.32,
      "readinessScore": 49.49,
      "accuracyScore": 45.16,
      "confidence": 61.1,
      "equityAccessContribution": 51.37,
      "accuracyOnlyContribution": 48.03,
      "overall": 51.77
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 33.86,
      "equityScore": 25.49,
      "sharingScore": 21.9,
      "readinessScore": 43.92,
      "accuracyScore": 84.72,
      "confidence": 35.45,
      "equityAccessContribution": 41.98,
      "accuracyOnlyContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "ae-024",
    "input": {
      "accessReach": 0.75,
      "equityGapClosure": 0.75,
      "taskSharingFidelity": 0.81,
      "packReadiness": 0.76,
      "accuracyAdherence": 0.77,
      "screenNoise": 0.25,
      "accuracyTunnel": 0.31,
      "overclaimRisk": 0.2,
      "equityBias": "balanced",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 71.55,
      "equityScore": 75.91,
      "sharingScore": 78.99,
      "readinessScore": 80.56,
      "accuracyScore": 43.13,
      "confidence": 59.35,
      "equityAccessContribution": 76.75,
      "accuracyOnlyContribution": 46.07,
      "overall": 75.23
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 31.21,
      "equityScore": 23.36,
      "sharingScore": 20.38,
      "readinessScore": 41.11,
      "accuracyScore": 63.65,
      "confidence": 33.9,
      "equityAccessContribution": 35.94,
      "accuracyOnlyContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "ae-025",
    "input": {
      "accessReach": 0.79,
      "equityGapClosure": 0.79,
      "taskSharingFidelity": 0.77,
      "packReadiness": 0.8,
      "accuracyAdherence": 0.8,
      "screenNoise": 0.26,
      "accuracyTunnel": 0.33,
      "overclaimRisk": 0.21,
      "equityBias": "access_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 83,
      "equityScore": 79.52,
      "sharingScore": 94.88,
      "readinessScore": 64.24,
      "accuracyScore": 45.2,
      "confidence": 62.45,
      "equityAccessContribution": 81.29,
      "accuracyOnlyContribution": 48.27,
      "overall": 79.35
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 19.5,
      "equityScore": 24.6,
      "sharingScore": 21.54,
      "readinessScore": 42.63,
      "accuracyScore": 43.52,
      "confidence": 35.55,
      "equityAccessContribution": 30.36,
      "accuracyOnlyContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "ae-026",
    "input": {
      "accessReach": 0.83,
      "equityGapClosure": 0.83,
      "taskSharingFidelity": 0.8,
      "packReadiness": 0.83,
      "accuracyAdherence": 0.84,
      "screenNoise": 0.27,
      "accuracyTunnel": 0.34,
      "overclaimRisk": 0.22,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 78.52,
      "equityScore": 83.17,
      "sharingScore": 80.3,
      "readinessScore": 87.68,
      "accuracyScore": 47.68,
      "confidence": 65.45,
      "equityAccessContribution": 82.24,
      "accuracyOnlyContribution": 50.87,
      "overall": 80.59
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 33.17,
      "equityScore": 25.67,
      "sharingScore": 22.55,
      "readinessScore": 44.32,
      "accuracyScore": 68.8,
      "confidence": 37.1,
      "equityAccessContribution": 38.9,
      "accuracyOnlyContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "ae-027",
    "input": {
      "accessReach": 0.87,
      "equityGapClosure": 0.81,
      "taskSharingFidelity": 0.84,
      "packReadiness": 0.87,
      "accuracyAdherence": 0.88,
      "screenNoise": 0.27,
      "accuracyTunnel": 0.3,
      "overclaimRisk": 0.17,
      "equityBias": "task_sharing_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 89.4,
      "equityScore": 82.98,
      "sharingScore": 59.19,
      "readinessScore": 100,
      "accuracyScore": 49.35,
      "confidence": 67.65,
      "equityAccessContribution": 81.6,
      "accuracyOnlyContribution": 52.5,
      "overall": 80.36
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 30.78,
      "equityScore": 25.18,
      "sharingScore": 21.6,
      "readinessScore": 44.62,
      "accuracyScore": 45.22,
      "confidence": 37.2,
      "equityAccessContribution": 33.48,
      "accuracyOnlyContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "ae-028",
    "input": {
      "accessReach": 0.83,
      "equityGapClosure": 0.86,
      "taskSharingFidelity": 0.87,
      "packReadiness": 0.83,
      "accuracyAdherence": 0.84,
      "screenNoise": 0.2,
      "accuracyTunnel": 0.31,
      "overclaimRisk": 0.17,
      "equityBias": "accuracy_first",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 37.76,
      "equityScore": 75.3,
      "sharingScore": 61.04,
      "readinessScore": 53.51,
      "accuracyScore": 48.34,
      "confidence": 66.8,
      "equityAccessContribution": 57.5,
      "accuracyOnlyContribution": 51.73,
      "overall": 57.46
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 38.81,
      "equityScore": 25.01,
      "sharingScore": 22.37,
      "readinessScore": 43.48,
      "accuracyScore": 86.95,
      "confidence": 37.65,
      "equityAccessContribution": 43.32,
      "accuracyOnlyContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "ae-029",
    "input": {
      "accessReach": 0.87,
      "equityGapClosure": 0.9,
      "taskSharingFidelity": 0.91,
      "packReadiness": 0.87,
      "accuracyAdherence": 0.87,
      "screenNoise": 0.2,
      "accuracyTunnel": 0.33,
      "overclaimRisk": 0.18,
      "equityBias": "balanced",
      "profile": "equity_access_task_sharing"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 83.89,
      "equityScore": 88.91,
      "sharingScore": 90.14,
      "readinessScore": 92.27,
      "accuracyScore": 50.59,
      "confidence": 69.9,
      "equityAccessContribution": 88.79,
      "accuracyOnlyContribution": 54.16,
      "overall": 86.56
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 36.33,
      "equityScore": 26.36,
      "sharingScore": 23.66,
      "readinessScore": 45,
      "accuracyScore": 71.06,
      "confidence": 39.5,
      "equityAccessContribution": 40.48,
      "accuracyOnlyContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "ae-030",
    "input": {
      "accessReach": 0.91,
      "equityGapClosure": 0.88,
      "taskSharingFidelity": 0.87,
      "packReadiness": 0.91,
      "accuracyAdherence": 0.91,
      "screenNoise": 0.21,
      "accuracyTunnel": 0.28,
      "overclaimRisk": 0.13,
      "equityBias": "access_first",
      "profile": "accuracy_only_classifier"
    },
    "expectedEquityAccess": {
      "mode": "equity_access_task_sharing",
      "accessScore": 95.24,
      "equityScore": 88.77,
      "sharingScore": 100,
      "readinessScore": 71.68,
      "accuracyScore": 51.88,
      "confidence": 72.25,
      "equityAccessContribution": 89.71,
      "accuracyOnlyContribution": 55.31,
      "overall": 87.52
    },
    "expectedAccuracyOnly": {
      "mode": "accuracy_only_classifier",
      "accessScore": 25.72,
      "equityScore": 25.3,
      "sharingScore": 22.14,
      "readinessScore": 45.02,
      "accuracyScore": 46.21,
      "confidence": 38.95,
      "equityAccessContribution": 32.88,
      "accuracyOnlyContribution": 50.68,
      "overall": 44.3
    }
  }
];
