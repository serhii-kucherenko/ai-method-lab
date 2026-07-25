import type { NicuEcgInput, NicuEcgQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: NicuEcgInput;
  expectedAlignmentFree: NicuEcgQuality;
  expectedAlignmentDependent: NicuEcgQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ne-001",
    "input": {
      "ppgCoverage": 0.29,
      "inpaintFidelity": 0.25,
      "ecgRecovery": 0.28,
      "packCompleteness": 0.34,
      "alignmentConfidence": 0.39,
      "alignmentOptimism": 0.45,
      "segmentHardness": 0.59,
      "overclaimRisk": 0.5,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 23.37,
      "fidelityScore": 30.25,
      "ecgScore": 23.45,
      "completenessScore": 37.64,
      "alignmentScore": 16.4,
      "confidence": 20.85,
      "alignmentFreeContribution": 28.18,
      "alignmentDependentContribution": 15.92,
      "overall": 29.97
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 5.76,
      "fidelityScore": 17.05,
      "ecgScore": 12.78,
      "completenessScore": 32.39,
      "alignmentScore": 40.93,
      "confidence": 17.1,
      "alignmentFreeContribution": 21.78,
      "alignmentDependentContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "ne-002",
    "input": {
      "ppgCoverage": 0.33,
      "inpaintFidelity": 0.29,
      "ecgRecovery": 0.32,
      "packCompleteness": 0.38,
      "alignmentConfidence": 0.43,
      "alignmentOptimism": 0.46,
      "segmentHardness": 0.6,
      "overclaimRisk": 0.51,
      "inpaintBias": "ecg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 22.88,
      "fidelityScore": 33.9,
      "ecgScore": 34.35,
      "completenessScore": 31.9,
      "alignmentScore": 18.89,
      "confidence": 24.5,
      "alignmentFreeContribution": 30.72,
      "alignmentDependentContribution": 18.58,
      "overall": 32.53
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 2.43,
      "fidelityScore": 18.17,
      "ecgScore": 13.81,
      "completenessScore": 34.08,
      "alignmentScore": 31.53,
      "confidence": 18.65,
      "alignmentFreeContribution": 20,
      "alignmentDependentContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "ne-003",
    "input": {
      "ppgCoverage": 0.37,
      "inpaintFidelity": 0.27,
      "ecgRecovery": 0.36,
      "packCompleteness": 0.42,
      "alignmentConfidence": 0.46,
      "alignmentOptimism": 0.42,
      "segmentHardness": 0.6,
      "overclaimRisk": 0.46,
      "inpaintBias": "alignment_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 14.21,
      "fidelityScore": 23.71,
      "ecgScore": 20.92,
      "completenessScore": 19.24,
      "alignmentScore": 19.94,
      "confidence": 27.1,
      "alignmentFreeContribution": 19.48,
      "alignmentDependentContribution": 19.65,
      "overall": 20.51
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 12.17,
      "fidelityScore": 17.05,
      "ecgScore": 12.78,
      "completenessScore": 33.93,
      "alignmentScore": 54.34,
      "confidence": 18.4,
      "alignmentFreeContribution": 26.05,
      "alignmentDependentContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "ne-004",
    "input": {
      "ppgCoverage": 0.33,
      "inpaintFidelity": 0.32,
      "ecgRecovery": 0.39,
      "packCompleteness": 0.38,
      "alignmentConfidence": 0.42,
      "alignmentOptimism": 0.43,
      "segmentHardness": 0.53,
      "overclaimRisk": 0.46,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 30.23,
      "fidelityScore": 36.03,
      "ecgScore": 33.26,
      "completenessScore": 42.23,
      "alignmentScore": 18.93,
      "confidence": 25.85,
      "alignmentFreeContribution": 35.11,
      "alignmentDependentContribution": 19.24,
      "overall": 36.25
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 8.7,
      "fidelityScore": 18.05,
      "ecgScore": 14.08,
      "completenessScore": 32.79,
      "alignmentScore": 42.77,
      "confidence": 18.85,
      "alignmentFreeContribution": 23.28,
      "alignmentDependentContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "ne-005",
    "input": {
      "ppgCoverage": 0.37,
      "inpaintFidelity": 0.36,
      "ecgRecovery": 0.35,
      "packCompleteness": 0.42,
      "alignmentConfidence": 0.46,
      "alignmentOptimism": 0.45,
      "segmentHardness": 0.53,
      "overclaimRisk": 0.47,
      "inpaintBias": "ppg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 26.59,
      "fidelityScore": 39.64,
      "ecgScore": 21.33,
      "completenessScore": 54.3,
      "alignmentScore": 21.8,
      "confidence": 29.35,
      "alignmentFreeContribution": 34.35,
      "alignmentDependentContribution": 22.12,
      "overall": 36.15
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 0,
      "fidelityScore": 19.43,
      "ecgScore": 15.31,
      "completenessScore": 34.77,
      "alignmentScore": 32.95,
      "confidence": 21.05,
      "alignmentFreeContribution": 20.49,
      "alignmentDependentContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "ne-006",
    "input": {
      "ppgCoverage": 0.41,
      "inpaintFidelity": 0.34,
      "ecgRecovery": 0.39,
      "packCompleteness": 0.45,
      "alignmentConfidence": 0.5,
      "alignmentOptimism": 0.4,
      "segmentHardness": 0.54,
      "overclaimRisk": 0.42,
      "inpaintBias": "balanced",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 35.28,
      "fidelityScore": 39.5,
      "ecgScore": 35.78,
      "completenessScore": 47.85,
      "alignmentScore": 23.08,
      "confidence": 31.85,
      "alignmentFreeContribution": 39.2,
      "alignmentDependentContribution": 23.32,
      "overall": 40.34
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 11.98,
      "fidelityScore": 17.95,
      "ecgScore": 13.91,
      "completenessScore": 34.78,
      "alignmentScore": 46.72,
      "confidence": 20.5,
      "alignmentFreeContribution": 25.07,
      "alignmentDependentContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "ne-007",
    "input": {
      "ppgCoverage": 0.45,
      "inpaintFidelity": 0.38,
      "ecgRecovery": 0.42,
      "packCompleteness": 0.49,
      "alignmentConfidence": 0.53,
      "alignmentOptimism": 0.42,
      "segmentHardness": 0.55,
      "overclaimRisk": 0.43,
      "inpaintBias": "ecg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 32.43,
      "fidelityScore": 43.11,
      "ecgScore": 48.27,
      "completenessScore": 39.34,
      "alignmentScore": 25.15,
      "confidence": 35.35,
      "alignmentFreeContribution": 40.95,
      "alignmentDependentContribution": 25.54,
      "overall": 42.18
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 8.27,
      "fidelityScore": 19.21,
      "ecgScore": 15.09,
      "completenessScore": 36.3,
      "alignmentScore": 34.2,
      "confidence": 22.15,
      "alignmentFreeContribution": 22.61,
      "alignmentDependentContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "ne-008",
    "input": {
      "ppgCoverage": 0.41,
      "inpaintFidelity": 0.43,
      "ecgRecovery": 0.46,
      "packCompleteness": 0.45,
      "alignmentConfidence": 0.49,
      "alignmentOptimism": 0.43,
      "segmentHardness": 0.47,
      "overclaimRisk": 0.44,
      "inpaintBias": "alignment_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 20.12,
      "fidelityScore": 35.43,
      "ecgScore": 27.76,
      "completenessScore": 24.76,
      "alignmentScore": 24.32,
      "confidence": 34.1,
      "alignmentFreeContribution": 26.95,
      "alignmentDependentContribution": 25.37,
      "overall": 27.67
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 16.4,
      "fidelityScore": 20.36,
      "ecgScore": 16.57,
      "completenessScore": 35.17,
      "alignmentScore": 58.5,
      "confidence": 22.7,
      "alignmentFreeContribution": 29.4,
      "alignmentDependentContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "ne-009",
    "input": {
      "ppgCoverage": 0.46,
      "inpaintFidelity": 0.41,
      "ecgRecovery": 0.5,
      "packCompleteness": 0.49,
      "alignmentConfidence": 0.53,
      "alignmentOptimism": 0.39,
      "segmentHardness": 0.48,
      "overclaimRisk": 0.38,
      "inpaintBias": "balanced",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 42.68,
      "fidelityScore": 45.49,
      "ecgScore": 45.8,
      "completenessScore": 52.59,
      "alignmentScore": 25.81,
      "confidence": 37.1,
      "alignmentFreeContribution": 46.41,
      "alignmentDependentContribution": 26.81,
      "overall": 46.88
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 14.91,
      "fidelityScore": 19.22,
      "ecgScore": 15.52,
      "completenessScore": 35.36,
      "alignmentScore": 48.88,
      "confidence": 22.7,
      "alignmentFreeContribution": 26.78,
      "alignmentDependentContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "ne-010",
    "input": {
      "ppgCoverage": 0.5,
      "inpaintFidelity": 0.45,
      "ecgRecovery": 0.46,
      "packCompleteness": 0.53,
      "alignmentConfidence": 0.57,
      "alignmentOptimism": 0.4,
      "segmentHardness": 0.49,
      "overclaimRisk": 0.39,
      "inpaintBias": "ppg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 36.76,
      "fidelityScore": 49.14,
      "ecgScore": 30.54,
      "completenessScore": 66.82,
      "alignmentScore": 28.29,
      "confidence": 40.75,
      "alignmentFreeContribution": 44.6,
      "alignmentDependentContribution": 29.21,
      "overall": 45.83
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 3.59,
      "fidelityScore": 20.03,
      "ecgScore": 16.17,
      "completenessScore": 37.06,
      "alignmentScore": 35.54,
      "confidence": 24.25,
      "alignmentFreeContribution": 22.48,
      "alignmentDependentContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "ne-011",
    "input": {
      "ppgCoverage": 0.54,
      "inpaintFidelity": 0.49,
      "ecgRecovery": 0.49,
      "packCompleteness": 0.57,
      "alignmentConfidence": 0.6,
      "alignmentOptimism": 0.42,
      "segmentHardness": 0.49,
      "overclaimRisk": 0.4,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 47.07,
      "fidelityScore": 52.75,
      "ecgScore": 47.04,
      "completenessScore": 60.27,
      "alignmentScore": 30.54,
      "confidence": 44.25,
      "alignmentFreeContribution": 51.33,
      "alignmentDependentContribution": 31.67,
      "overall": 51.79
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 17.1,
      "fidelityScore": 21.44,
      "ecgScore": 17.52,
      "completenessScore": 38.58,
      "alignmentScore": 54.12,
      "confidence": 26.1,
      "alignmentFreeContribution": 29.75,
      "alignmentDependentContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "ne-012",
    "input": {
      "ppgCoverage": 0.5,
      "inpaintFidelity": 0.48,
      "ecgRecovery": 0.53,
      "packCompleteness": 0.53,
      "alignmentConfidence": 0.56,
      "alignmentOptimism": 0.37,
      "segmentHardness": 0.42,
      "overclaimRisk": 0.35,
      "inpaintBias": "ecg_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 39.39,
      "fidelityScore": 51.28,
      "ecgScore": 62.01,
      "completenessScore": 43.82,
      "alignmentScore": 28.34,
      "confidence": 42.1,
      "alignmentFreeContribution": 49.55,
      "alignmentDependentContribution": 29.77,
      "overall": 49.99
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 13.23,
      "fidelityScore": 19.78,
      "ecgScore": 16.29,
      "completenessScore": 35.76,
      "alignmentScore": 34.93,
      "confidence": 24.35,
      "alignmentFreeContribution": 24,
      "alignmentDependentContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "ne-013",
    "input": {
      "ppgCoverage": 0.54,
      "inpaintFidelity": 0.52,
      "ecgRecovery": 0.56,
      "packCompleteness": 0.57,
      "alignmentConfidence": 0.6,
      "alignmentOptimism": 0.39,
      "segmentHardness": 0.42,
      "overclaimRisk": 0.36,
      "inpaintBias": "alignment_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 30.08,
      "fidelityScore": 44.88,
      "ecgScore": 36.64,
      "completenessScore": 32.66,
      "alignmentScore": 31.2,
      "confidence": 45.6,
      "alignmentFreeContribution": 36.04,
      "alignmentDependentContribution": 32.85,
      "overall": 36.47
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 22.62,
      "fidelityScore": 21.42,
      "ecgScore": 17.82,
      "completenessScore": 37.74,
      "alignmentScore": 67.02,
      "confidence": 26.55,
      "alignmentFreeContribution": 33.32,
      "alignmentDependentContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "ne-014",
    "input": {
      "ppgCoverage": 0.58,
      "inpaintFidelity": 0.56,
      "ecgRecovery": 0.6,
      "packCompleteness": 0.61,
      "alignmentConfidence": 0.63,
      "alignmentOptimism": 0.4,
      "segmentHardness": 0.43,
      "overclaimRisk": 0.36,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 53.79,
      "fidelityScore": 58.53,
      "ecgScore": 56.71,
      "completenessScore": 64.86,
      "alignmentScore": 33.07,
      "confidence": 49.25,
      "alignmentFreeContribution": 58.18,
      "alignmentDependentContribution": 34.85,
      "overall": 57.98
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 20.03,
      "fidelityScore": 22.26,
      "ecgScore": 18.61,
      "completenessScore": 38.98,
      "alignmentScore": 55.96,
      "confidence": 27.85,
      "alignmentFreeContribution": 31.17,
      "alignmentDependentContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "ne-015",
    "input": {
      "ppgCoverage": 0.62,
      "inpaintFidelity": 0.54,
      "ecgRecovery": 0.56,
      "packCompleteness": 0.65,
      "alignmentConfidence": 0.67,
      "alignmentOptimism": 0.36,
      "segmentHardness": 0.44,
      "overclaimRisk": 0.31,
      "inpaintBias": "ppg_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 46.23,
      "fidelityScore": 58.35,
      "ecgScore": 39.15,
      "completenessScore": 79.94,
      "alignmentScore": 34.55,
      "confidence": 51.85,
      "alignmentFreeContribution": 54.57,
      "alignmentDependentContribution": 36.06,
      "overall": 55.24
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 9.43,
      "fidelityScore": 20.94,
      "ecgScore": 17.24,
      "completenessScore": 39.27,
      "alignmentScore": 38.2,
      "confidence": 27.75,
      "alignmentFreeContribution": 25.02,
      "alignmentDependentContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "ne-016",
    "input": {
      "ppgCoverage": 0.58,
      "inpaintFidelity": 0.59,
      "ecgRecovery": 0.6,
      "packCompleteness": 0.6,
      "alignmentConfidence": 0.63,
      "alignmentOptimism": 0.37,
      "segmentHardness": 0.36,
      "overclaimRisk": 0.32,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 54.78,
      "fidelityScore": 60.67,
      "ecgScore": 57.91,
      "completenessScore": 65.05,
      "alignmentScore": 33.73,
      "confidence": 50.35,
      "alignmentFreeContribution": 59.33,
      "alignmentDependentContribution": 35.81,
      "overall": 59.1
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 22.05,
      "fidelityScore": 21.96,
      "ecgScore": 18.63,
      "completenessScore": 38.14,
      "alignmentScore": 55.7,
      "confidence": 28.3,
      "alignmentFreeContribution": 31.3,
      "alignmentDependentContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "ne-017",
    "input": {
      "ppgCoverage": 0.62,
      "inpaintFidelity": 0.63,
      "ecgRecovery": 0.63,
      "packCompleteness": 0.64,
      "alignmentConfidence": 0.67,
      "alignmentOptimism": 0.39,
      "segmentHardness": 0.37,
      "overclaimRisk": 0.33,
      "inpaintBias": "ecg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 48.45,
      "fidelityScore": 64.28,
      "ecgScore": 75.16,
      "completenessScore": 52.76,
      "alignmentScore": 36.41,
      "confidence": 53.85,
      "alignmentFreeContribution": 60.68,
      "alignmentDependentContribution": 38.64,
      "overall": 60.71
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 18.73,
      "fidelityScore": 23.45,
      "ecgScore": 19.98,
      "completenessScore": 40.11,
      "alignmentScore": 39.86,
      "confidence": 30.3,
      "alignmentFreeContribution": 28.43,
      "alignmentDependentContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "ne-018",
    "input": {
      "ppgCoverage": 0.66,
      "inpaintFidelity": 0.61,
      "ecgRecovery": 0.67,
      "packCompleteness": 0.68,
      "alignmentConfidence": 0.7,
      "alignmentOptimism": 0.34,
      "segmentHardness": 0.38,
      "overclaimRisk": 0.27,
      "inpaintBias": "alignment_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 39.72,
      "fidelityScore": 54.13,
      "ecgScore": 45.55,
      "completenessScore": 40.09,
      "alignmentScore": 37.08,
      "confidence": 56.6,
      "alignmentFreeContribution": 44.89,
      "alignmentDependentContribution": 39.18,
      "overall": 44.86
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 28.36,
      "fidelityScore": 21.69,
      "ecgScore": 18.3,
      "completenessScore": 39.67,
      "alignmentScore": 74.27,
      "confidence": 29.5,
      "alignmentFreeContribution": 36.46,
      "alignmentDependentContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "ne-019",
    "input": {
      "ppgCoverage": 0.7,
      "inpaintFidelity": 0.65,
      "ecgRecovery": 0.7,
      "packCompleteness": 0.72,
      "alignmentConfidence": 0.74,
      "alignmentOptimism": 0.36,
      "segmentHardness": 0.38,
      "overclaimRisk": 0.28,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 65.21,
      "fidelityScore": 67.74,
      "ecgScore": 68.17,
      "completenessScore": 75.07,
      "alignmentScore": 39.94,
      "confidence": 60.1,
      "alignmentFreeContribution": 68.82,
      "alignmentDependentContribution": 42.25,
      "overall": 68.04
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 26.25,
      "fidelityScore": 23.32,
      "ecgScore": 19.82,
      "completenessScore": 41.65,
      "alignmentScore": 62.07,
      "confidence": 31.7,
      "alignmentFreeContribution": 34.62,
      "alignmentDependentContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ne-020",
    "input": {
      "ppgCoverage": 0.66,
      "inpaintFidelity": 0.7,
      "ecgRecovery": 0.66,
      "packCompleteness": 0.68,
      "alignmentConfidence": 0.7,
      "alignmentOptimism": 0.37,
      "segmentHardness": 0.31,
      "overclaimRisk": 0.29,
      "inpaintBias": "ppg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 51.95,
      "fidelityScore": 70.06,
      "ecgScore": 45.74,
      "completenessScore": 86.81,
      "alignmentScore": 38.94,
      "confidence": 58.85,
      "alignmentFreeContribution": 62.23,
      "alignmentDependentContribution": 41.54,
      "overall": 62.51
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 13.66,
      "fidelityScore": 23.93,
      "ecgScore": 20.65,
      "completenessScore": 40.51,
      "alignmentScore": 40.86,
      "confidence": 32.05,
      "alignmentFreeContribution": 27.92,
      "alignmentDependentContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ne-021",
    "input": {
      "ppgCoverage": 0.7,
      "inpaintFidelity": 0.68,
      "ecgRecovery": 0.7,
      "packCompleteness": 0.72,
      "alignmentConfidence": 0.73,
      "alignmentOptimism": 0.33,
      "segmentHardness": 0.31,
      "overclaimRisk": 0.24,
      "inpaintBias": "balanced",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 66.16,
      "fidelityScore": 69.88,
      "ecgScore": 69.32,
      "completenessScore": 75.82,
      "alignmentScore": 39.99,
      "confidence": 61.45,
      "alignmentFreeContribution": 70.06,
      "alignmentDependentContribution": 42.54,
      "overall": 69.11
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 27.89,
      "fidelityScore": 22.72,
      "ecgScore": 19.52,
      "completenessScore": 40.35,
      "alignmentScore": 61.19,
      "confidence": 31.8,
      "alignmentFreeContribution": 34.33,
      "alignmentDependentContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ne-022",
    "input": {
      "ppgCoverage": 0.74,
      "inpaintFidelity": 0.72,
      "ecgRecovery": 0.73,
      "packCompleteness": 0.76,
      "alignmentConfidence": 0.77,
      "alignmentOptimism": 0.34,
      "segmentHardness": 0.32,
      "overclaimRisk": 0.25,
      "inpaintBias": "ecg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 57.83,
      "fidelityScore": 73.52,
      "ecgScore": 88.84,
      "completenessScore": 60.51,
      "alignmentScore": 42.47,
      "confidence": 65.1,
      "alignmentFreeContribution": 70.87,
      "alignmentDependentContribution": 45.13,
      "overall": 70.24
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 24.57,
      "fidelityScore": 23.77,
      "ecgScore": 20.46,
      "completenessScore": 42.05,
      "alignmentScore": 42.21,
      "confidence": 33.35,
      "alignmentFreeContribution": 30.61,
      "alignmentDependentContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "ne-023",
    "input": {
      "ppgCoverage": 0.79,
      "inpaintFidelity": 0.76,
      "ecgRecovery": 0.77,
      "packCompleteness": 0.8,
      "alignmentConfidence": 0.81,
      "alignmentOptimism": 0.36,
      "segmentHardness": 0.33,
      "overclaimRisk": 0.25,
      "inpaintBias": "alignment_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 49.24,
      "fidelityScore": 67.38,
      "ecgScore": 53.71,
      "completenessScore": 49.49,
      "alignmentScore": 45.16,
      "confidence": 69,
      "alignmentFreeContribution": 54.9,
      "alignmentDependentContribution": 47.99,
      "overall": 54.66
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 33.86,
      "fidelityScore": 25.2,
      "ecgScore": 21.84,
      "completenessScore": 43.92,
      "alignmentScore": 84.72,
      "confidence": 35.45,
      "alignmentFreeContribution": 41.91,
      "alignmentDependentContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "ne-024",
    "input": {
      "ppgCoverage": 0.75,
      "inpaintFidelity": 0.75,
      "ecgRecovery": 0.81,
      "packCompleteness": 0.76,
      "alignmentConfidence": 0.77,
      "alignmentOptimism": 0.31,
      "segmentHardness": 0.25,
      "overclaimRisk": 0.2,
      "inpaintBias": "balanced",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 73.31,
      "fidelityScore": 75.91,
      "ecgScore": 79.08,
      "completenessScore": 80.56,
      "alignmentScore": 43.13,
      "confidence": 66.85,
      "alignmentFreeContribution": 77.14,
      "alignmentDependentContribution": 46.16,
      "overall": 75.56
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 31.21,
      "fidelityScore": 23.47,
      "ecgScore": 20.52,
      "completenessScore": 41.11,
      "alignmentScore": 63.65,
      "confidence": 33.9,
      "alignmentFreeContribution": 35.99,
      "alignmentDependentContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "ne-025",
    "input": {
      "ppgCoverage": 0.79,
      "inpaintFidelity": 0.79,
      "ecgRecovery": 0.77,
      "packCompleteness": 0.8,
      "alignmentConfidence": 0.8,
      "alignmentOptimism": 0.33,
      "segmentHardness": 0.26,
      "overclaimRisk": 0.21,
      "inpaintBias": "ppg_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 62.03,
      "fidelityScore": 79.52,
      "ecgScore": 54.83,
      "completenessScore": 100,
      "alignmentScore": 45.2,
      "confidence": 70.35,
      "alignmentFreeContribution": 72.57,
      "alignmentDependentContribution": 48.24,
      "overall": 72.19
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 19.5,
      "fidelityScore": 24.56,
      "ecgScore": 21.5,
      "completenessScore": 42.63,
      "alignmentScore": 43.52,
      "confidence": 35.55,
      "alignmentFreeContribution": 30.34,
      "alignmentDependentContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "ne-026",
    "input": {
      "ppgCoverage": 0.83,
      "inpaintFidelity": 0.83,
      "ecgRecovery": 0.8,
      "packCompleteness": 0.83,
      "alignmentConfidence": 0.84,
      "alignmentOptimism": 0.34,
      "segmentHardness": 0.27,
      "overclaimRisk": 0.22,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 77.64,
      "fidelityScore": 83.17,
      "ecgScore": 80.25,
      "completenessScore": 87.68,
      "alignmentScore": 47.68,
      "confidence": 73.75,
      "alignmentFreeContribution": 81.91,
      "alignmentDependentContribution": 50.82,
      "overall": 80.31
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 33.17,
      "fidelityScore": 25.61,
      "ecgScore": 22.47,
      "completenessScore": 44.32,
      "alignmentScore": 68.8,
      "confidence": 37.1,
      "alignmentFreeContribution": 38.87,
      "alignmentDependentContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "ne-027",
    "input": {
      "ppgCoverage": 0.87,
      "inpaintFidelity": 0.81,
      "ecgRecovery": 0.84,
      "packCompleteness": 0.87,
      "alignmentConfidence": 0.88,
      "alignmentOptimism": 0.3,
      "segmentHardness": 0.27,
      "overclaimRisk": 0.17,
      "inpaintBias": "ecg_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 67.91,
      "fidelityScore": 82.98,
      "ecgScore": 100,
      "completenessScore": 68.1,
      "alignmentScore": 49.35,
      "confidence": 76.35,
      "alignmentFreeContribution": 80.55,
      "alignmentDependentContribution": 52.46,
      "overall": 79.49
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 30.78,
      "fidelityScore": 24.64,
      "ecgScore": 21.53,
      "completenessScore": 44.62,
      "alignmentScore": 45.22,
      "confidence": 37.2,
      "alignmentFreeContribution": 33.36,
      "alignmentDependentContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "ne-028",
    "input": {
      "ppgCoverage": 0.83,
      "inpaintFidelity": 0.86,
      "ecgRecovery": 0.87,
      "packCompleteness": 0.83,
      "alignmentConfidence": 0.84,
      "alignmentOptimism": 0.31,
      "segmentHardness": 0.2,
      "overclaimRisk": 0.17,
      "inpaintBias": "alignment_first",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 55.14,
      "fidelityScore": 75.3,
      "ecgScore": 60.67,
      "completenessScore": 53.51,
      "alignmentScore": 48.34,
      "confidence": 75.1,
      "alignmentFreeContribution": 61.17,
      "alignmentDependentContribution": 51.78,
      "overall": 60.48
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 38.81,
      "fidelityScore": 25.31,
      "ecgScore": 22.44,
      "completenessScore": 43.48,
      "alignmentScore": 86.95,
      "confidence": 37.65,
      "alignmentFreeContribution": 43.4,
      "alignmentDependentContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "ne-029",
    "input": {
      "ppgCoverage": 0.87,
      "inpaintFidelity": 0.9,
      "ecgRecovery": 0.91,
      "packCompleteness": 0.87,
      "alignmentConfidence": 0.87,
      "alignmentOptimism": 0.33,
      "segmentHardness": 0.2,
      "overclaimRisk": 0.18,
      "inpaintBias": "balanced",
      "profile": "alignment_free_ppg_ecg"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 84.21,
      "fidelityScore": 88.91,
      "ecgScore": 89.77,
      "completenessScore": 92.27,
      "alignmentScore": 50.59,
      "confidence": 78.6,
      "alignmentFreeContribution": 88.67,
      "alignmentDependentContribution": 54.2,
      "overall": 86.47
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 36.33,
      "fidelityScore": 26.66,
      "ecgScore": 23.73,
      "completenessScore": 45,
      "alignmentScore": 71.06,
      "confidence": 39.5,
      "alignmentFreeContribution": 40.56,
      "alignmentDependentContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "ne-030",
    "input": {
      "ppgCoverage": 0.91,
      "inpaintFidelity": 0.88,
      "ecgRecovery": 0.87,
      "packCompleteness": 0.91,
      "alignmentConfidence": 0.91,
      "alignmentOptimism": 0.28,
      "segmentHardness": 0.21,
      "overclaimRisk": 0.13,
      "inpaintBias": "ppg_first",
      "profile": "alignment_dependent_ppg_ecg_baseline"
    },
    "expectedAlignmentFree": {
      "mode": "alignment_free_ppg_ecg",
      "ppgScore": 71.33,
      "fidelityScore": 88.77,
      "ecgScore": 63.21,
      "completenessScore": 100,
      "alignmentScore": 51.88,
      "confidence": 81.35,
      "alignmentFreeContribution": 79.55,
      "alignmentDependentContribution": 55.26,
      "overall": 79.18
    },
    "expectedAlignmentDependent": {
      "mode": "alignment_dependent_ppg_ecg_baseline",
      "ppgScore": 25.72,
      "fidelityScore": 25,
      "ecgScore": 22.06,
      "completenessScore": 45.02,
      "alignmentScore": 46.21,
      "confidence": 38.95,
      "alignmentFreeContribution": 32.8,
      "alignmentDependentContribution": 50.65,
      "overall": 44.26
    }
  }
];
