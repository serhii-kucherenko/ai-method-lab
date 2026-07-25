import type { OmicPriorInput, OmicPriorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OmicPriorInput;
  expectedPriorsInformed: OmicPriorQuality;
  expectedPriorsFree: OmicPriorQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "op-001",
    "input": {
      "priorCoverage": 0.29,
      "transformerFidelity": 0.25,
      "traitGrounding": 0.28,
      "packCompleteness": 0.34,
      "baselineConfidence": 0.39,
      "baselineOptimism": 0.45,
      "traitHardness": 0.59,
      "overclaimRisk": 0.5,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 23.37,
      "fidelityScore": 30.25,
      "traitScore": 23.45,
      "completenessScore": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "priorsContribution": 28.18,
      "baselineContribution": 15.92,
      "overall": 29.97
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 5.76,
      "fidelityScore": 17.05,
      "traitScore": 12.78,
      "completenessScore": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "priorsContribution": 21.78,
      "baselineContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "op-002",
    "input": {
      "priorCoverage": 0.33,
      "transformerFidelity": 0.29,
      "traitGrounding": 0.32,
      "packCompleteness": 0.38,
      "baselineConfidence": 0.43,
      "baselineOptimism": 0.46,
      "traitHardness": 0.6,
      "overclaimRisk": 0.51,
      "priorBias": "trait_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 22.88,
      "fidelityScore": 33.9,
      "traitScore": 34.35,
      "completenessScore": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "priorsContribution": 30.72,
      "baselineContribution": 18.58,
      "overall": 32.53
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 2.43,
      "fidelityScore": 18.17,
      "traitScore": 13.81,
      "completenessScore": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "priorsContribution": 20,
      "baselineContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "op-003",
    "input": {
      "priorCoverage": 0.37,
      "transformerFidelity": 0.27,
      "traitGrounding": 0.36,
      "packCompleteness": 0.42,
      "baselineConfidence": 0.46,
      "baselineOptimism": 0.42,
      "traitHardness": 0.6,
      "overclaimRisk": 0.46,
      "priorBias": "baseline_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 14.21,
      "fidelityScore": 23.71,
      "traitScore": 20.92,
      "completenessScore": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "priorsContribution": 19.48,
      "baselineContribution": 19.65,
      "overall": 20.51
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 12.17,
      "fidelityScore": 17.05,
      "traitScore": 12.78,
      "completenessScore": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "priorsContribution": 26.05,
      "baselineContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "op-004",
    "input": {
      "priorCoverage": 0.33,
      "transformerFidelity": 0.32,
      "traitGrounding": 0.39,
      "packCompleteness": 0.38,
      "baselineConfidence": 0.42,
      "baselineOptimism": 0.43,
      "traitHardness": 0.53,
      "overclaimRisk": 0.46,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 30.23,
      "fidelityScore": 36.03,
      "traitScore": 33.26,
      "completenessScore": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "priorsContribution": 35.11,
      "baselineContribution": 19.24,
      "overall": 36.25
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 8.7,
      "fidelityScore": 18.05,
      "traitScore": 14.08,
      "completenessScore": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "priorsContribution": 23.28,
      "baselineContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "op-005",
    "input": {
      "priorCoverage": 0.37,
      "transformerFidelity": 0.36,
      "traitGrounding": 0.35,
      "packCompleteness": 0.42,
      "baselineConfidence": 0.46,
      "baselineOptimism": 0.45,
      "traitHardness": 0.53,
      "overclaimRisk": 0.47,
      "priorBias": "priors_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 26.59,
      "fidelityScore": 39.64,
      "traitScore": 21.33,
      "completenessScore": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "priorsContribution": 34.35,
      "baselineContribution": 22.12,
      "overall": 36.15
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 0,
      "fidelityScore": 19.43,
      "traitScore": 15.31,
      "completenessScore": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "priorsContribution": 20.49,
      "baselineContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "op-006",
    "input": {
      "priorCoverage": 0.41,
      "transformerFidelity": 0.34,
      "traitGrounding": 0.39,
      "packCompleteness": 0.45,
      "baselineConfidence": 0.5,
      "baselineOptimism": 0.4,
      "traitHardness": 0.54,
      "overclaimRisk": 0.42,
      "priorBias": "balanced",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 35.28,
      "fidelityScore": 39.5,
      "traitScore": 35.78,
      "completenessScore": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "priorsContribution": 39.2,
      "baselineContribution": 23.32,
      "overall": 40.34
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 11.98,
      "fidelityScore": 17.95,
      "traitScore": 13.91,
      "completenessScore": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "priorsContribution": 25.07,
      "baselineContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "op-007",
    "input": {
      "priorCoverage": 0.45,
      "transformerFidelity": 0.38,
      "traitGrounding": 0.42,
      "packCompleteness": 0.49,
      "baselineConfidence": 0.53,
      "baselineOptimism": 0.42,
      "traitHardness": 0.55,
      "overclaimRisk": 0.43,
      "priorBias": "trait_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 32.43,
      "fidelityScore": 43.11,
      "traitScore": 48.27,
      "completenessScore": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "priorsContribution": 40.95,
      "baselineContribution": 25.54,
      "overall": 42.18
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 8.27,
      "fidelityScore": 19.21,
      "traitScore": 15.09,
      "completenessScore": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "priorsContribution": 22.61,
      "baselineContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "op-008",
    "input": {
      "priorCoverage": 0.41,
      "transformerFidelity": 0.43,
      "traitGrounding": 0.46,
      "packCompleteness": 0.45,
      "baselineConfidence": 0.49,
      "baselineOptimism": 0.43,
      "traitHardness": 0.47,
      "overclaimRisk": 0.44,
      "priorBias": "baseline_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 20.12,
      "fidelityScore": 35.43,
      "traitScore": 27.76,
      "completenessScore": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "priorsContribution": 26.95,
      "baselineContribution": 25.37,
      "overall": 27.67
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 16.4,
      "fidelityScore": 20.36,
      "traitScore": 16.57,
      "completenessScore": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "priorsContribution": 29.4,
      "baselineContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "op-009",
    "input": {
      "priorCoverage": 0.46,
      "transformerFidelity": 0.41,
      "traitGrounding": 0.5,
      "packCompleteness": 0.49,
      "baselineConfidence": 0.53,
      "baselineOptimism": 0.39,
      "traitHardness": 0.48,
      "overclaimRisk": 0.38,
      "priorBias": "balanced",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 42.68,
      "fidelityScore": 45.49,
      "traitScore": 45.8,
      "completenessScore": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "priorsContribution": 46.41,
      "baselineContribution": 26.81,
      "overall": 46.88
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 14.91,
      "fidelityScore": 19.22,
      "traitScore": 15.52,
      "completenessScore": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "priorsContribution": 26.78,
      "baselineContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "op-010",
    "input": {
      "priorCoverage": 0.5,
      "transformerFidelity": 0.45,
      "traitGrounding": 0.46,
      "packCompleteness": 0.53,
      "baselineConfidence": 0.57,
      "baselineOptimism": 0.4,
      "traitHardness": 0.49,
      "overclaimRisk": 0.39,
      "priorBias": "priors_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 36.76,
      "fidelityScore": 49.14,
      "traitScore": 30.54,
      "completenessScore": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "priorsContribution": 44.6,
      "baselineContribution": 29.21,
      "overall": 45.83
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 3.59,
      "fidelityScore": 20.03,
      "traitScore": 16.17,
      "completenessScore": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "priorsContribution": 22.48,
      "baselineContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "op-011",
    "input": {
      "priorCoverage": 0.54,
      "transformerFidelity": 0.49,
      "traitGrounding": 0.49,
      "packCompleteness": 0.57,
      "baselineConfidence": 0.6,
      "baselineOptimism": 0.42,
      "traitHardness": 0.49,
      "overclaimRisk": 0.4,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 47.07,
      "fidelityScore": 52.75,
      "traitScore": 47.04,
      "completenessScore": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "priorsContribution": 51.33,
      "baselineContribution": 31.67,
      "overall": 51.79
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 17.1,
      "fidelityScore": 21.44,
      "traitScore": 17.52,
      "completenessScore": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "priorsContribution": 29.75,
      "baselineContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "op-012",
    "input": {
      "priorCoverage": 0.5,
      "transformerFidelity": 0.48,
      "traitGrounding": 0.53,
      "packCompleteness": 0.53,
      "baselineConfidence": 0.56,
      "baselineOptimism": 0.37,
      "traitHardness": 0.42,
      "overclaimRisk": 0.35,
      "priorBias": "trait_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 39.39,
      "fidelityScore": 51.28,
      "traitScore": 62.01,
      "completenessScore": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "priorsContribution": 49.55,
      "baselineContribution": 29.77,
      "overall": 49.99
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 13.23,
      "fidelityScore": 19.78,
      "traitScore": 16.29,
      "completenessScore": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "priorsContribution": 24,
      "baselineContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "op-013",
    "input": {
      "priorCoverage": 0.54,
      "transformerFidelity": 0.52,
      "traitGrounding": 0.56,
      "packCompleteness": 0.57,
      "baselineConfidence": 0.6,
      "baselineOptimism": 0.39,
      "traitHardness": 0.42,
      "overclaimRisk": 0.36,
      "priorBias": "baseline_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 30.08,
      "fidelityScore": 44.88,
      "traitScore": 36.64,
      "completenessScore": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "priorsContribution": 36.04,
      "baselineContribution": 32.85,
      "overall": 36.47
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 22.62,
      "fidelityScore": 21.42,
      "traitScore": 17.82,
      "completenessScore": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "priorsContribution": 33.32,
      "baselineContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "op-014",
    "input": {
      "priorCoverage": 0.58,
      "transformerFidelity": 0.56,
      "traitGrounding": 0.6,
      "packCompleteness": 0.61,
      "baselineConfidence": 0.63,
      "baselineOptimism": 0.4,
      "traitHardness": 0.43,
      "overclaimRisk": 0.36,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 53.79,
      "fidelityScore": 58.53,
      "traitScore": 56.71,
      "completenessScore": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "priorsContribution": 58.18,
      "baselineContribution": 34.85,
      "overall": 57.98
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 20.03,
      "fidelityScore": 22.26,
      "traitScore": 18.61,
      "completenessScore": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "priorsContribution": 31.17,
      "baselineContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "op-015",
    "input": {
      "priorCoverage": 0.62,
      "transformerFidelity": 0.54,
      "traitGrounding": 0.56,
      "packCompleteness": 0.65,
      "baselineConfidence": 0.67,
      "baselineOptimism": 0.36,
      "traitHardness": 0.44,
      "overclaimRisk": 0.31,
      "priorBias": "priors_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 46.23,
      "fidelityScore": 58.35,
      "traitScore": 39.15,
      "completenessScore": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "priorsContribution": 54.57,
      "baselineContribution": 36.06,
      "overall": 55.24
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 9.43,
      "fidelityScore": 20.94,
      "traitScore": 17.24,
      "completenessScore": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "priorsContribution": 25.02,
      "baselineContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "op-016",
    "input": {
      "priorCoverage": 0.58,
      "transformerFidelity": 0.59,
      "traitGrounding": 0.6,
      "packCompleteness": 0.6,
      "baselineConfidence": 0.63,
      "baselineOptimism": 0.37,
      "traitHardness": 0.36,
      "overclaimRisk": 0.32,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 54.78,
      "fidelityScore": 60.67,
      "traitScore": 57.91,
      "completenessScore": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "priorsContribution": 59.33,
      "baselineContribution": 35.81,
      "overall": 59.1
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 22.05,
      "fidelityScore": 21.96,
      "traitScore": 18.63,
      "completenessScore": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "priorsContribution": 31.3,
      "baselineContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "op-017",
    "input": {
      "priorCoverage": 0.62,
      "transformerFidelity": 0.63,
      "traitGrounding": 0.63,
      "packCompleteness": 0.64,
      "baselineConfidence": 0.67,
      "baselineOptimism": 0.39,
      "traitHardness": 0.37,
      "overclaimRisk": 0.33,
      "priorBias": "trait_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 48.45,
      "fidelityScore": 64.28,
      "traitScore": 75.16,
      "completenessScore": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "priorsContribution": 60.68,
      "baselineContribution": 38.64,
      "overall": 60.71
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 18.73,
      "fidelityScore": 23.45,
      "traitScore": 19.98,
      "completenessScore": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "priorsContribution": 28.43,
      "baselineContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "op-018",
    "input": {
      "priorCoverage": 0.66,
      "transformerFidelity": 0.61,
      "traitGrounding": 0.67,
      "packCompleteness": 0.68,
      "baselineConfidence": 0.7,
      "baselineOptimism": 0.34,
      "traitHardness": 0.38,
      "overclaimRisk": 0.27,
      "priorBias": "baseline_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 39.72,
      "fidelityScore": 54.13,
      "traitScore": 45.55,
      "completenessScore": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "priorsContribution": 44.89,
      "baselineContribution": 39.18,
      "overall": 44.86
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 28.36,
      "fidelityScore": 21.69,
      "traitScore": 18.3,
      "completenessScore": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "priorsContribution": 36.46,
      "baselineContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "op-019",
    "input": {
      "priorCoverage": 0.7,
      "transformerFidelity": 0.65,
      "traitGrounding": 0.7,
      "packCompleteness": 0.72,
      "baselineConfidence": 0.74,
      "baselineOptimism": 0.36,
      "traitHardness": 0.38,
      "overclaimRisk": 0.28,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 65.21,
      "fidelityScore": 67.74,
      "traitScore": 68.17,
      "completenessScore": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "priorsContribution": 68.82,
      "baselineContribution": 42.25,
      "overall": 68.04
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 26.25,
      "fidelityScore": 23.32,
      "traitScore": 19.82,
      "completenessScore": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "priorsContribution": 34.62,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "op-020",
    "input": {
      "priorCoverage": 0.66,
      "transformerFidelity": 0.7,
      "traitGrounding": 0.66,
      "packCompleteness": 0.68,
      "baselineConfidence": 0.7,
      "baselineOptimism": 0.37,
      "traitHardness": 0.31,
      "overclaimRisk": 0.29,
      "priorBias": "priors_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 51.95,
      "fidelityScore": 70.06,
      "traitScore": 45.74,
      "completenessScore": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "priorsContribution": 62.23,
      "baselineContribution": 41.54,
      "overall": 62.51
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 13.66,
      "fidelityScore": 23.93,
      "traitScore": 20.65,
      "completenessScore": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "priorsContribution": 27.92,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "op-021",
    "input": {
      "priorCoverage": 0.7,
      "transformerFidelity": 0.68,
      "traitGrounding": 0.7,
      "packCompleteness": 0.72,
      "baselineConfidence": 0.73,
      "baselineOptimism": 0.33,
      "traitHardness": 0.31,
      "overclaimRisk": 0.24,
      "priorBias": "balanced",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 66.16,
      "fidelityScore": 69.88,
      "traitScore": 69.32,
      "completenessScore": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "priorsContribution": 70.06,
      "baselineContribution": 42.54,
      "overall": 69.11
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 27.89,
      "fidelityScore": 22.72,
      "traitScore": 19.52,
      "completenessScore": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "priorsContribution": 34.33,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "op-022",
    "input": {
      "priorCoverage": 0.74,
      "transformerFidelity": 0.72,
      "traitGrounding": 0.73,
      "packCompleteness": 0.76,
      "baselineConfidence": 0.77,
      "baselineOptimism": 0.34,
      "traitHardness": 0.32,
      "overclaimRisk": 0.25,
      "priorBias": "trait_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 57.83,
      "fidelityScore": 73.52,
      "traitScore": 88.84,
      "completenessScore": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "priorsContribution": 70.87,
      "baselineContribution": 45.13,
      "overall": 70.24
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 24.57,
      "fidelityScore": 23.77,
      "traitScore": 20.46,
      "completenessScore": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "priorsContribution": 30.61,
      "baselineContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "op-023",
    "input": {
      "priorCoverage": 0.79,
      "transformerFidelity": 0.76,
      "traitGrounding": 0.77,
      "packCompleteness": 0.8,
      "baselineConfidence": 0.81,
      "baselineOptimism": 0.36,
      "traitHardness": 0.33,
      "overclaimRisk": 0.25,
      "priorBias": "baseline_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 49.24,
      "fidelityScore": 67.38,
      "traitScore": 53.71,
      "completenessScore": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "priorsContribution": 54.9,
      "baselineContribution": 47.99,
      "overall": 54.66
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 33.86,
      "fidelityScore": 25.2,
      "traitScore": 21.84,
      "completenessScore": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "priorsContribution": 41.91,
      "baselineContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "op-024",
    "input": {
      "priorCoverage": 0.75,
      "transformerFidelity": 0.75,
      "traitGrounding": 0.81,
      "packCompleteness": 0.76,
      "baselineConfidence": 0.77,
      "baselineOptimism": 0.31,
      "traitHardness": 0.25,
      "overclaimRisk": 0.2,
      "priorBias": "balanced",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 73.31,
      "fidelityScore": 75.91,
      "traitScore": 79.08,
      "completenessScore": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "priorsContribution": 77.14,
      "baselineContribution": 46.16,
      "overall": 75.56
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 31.21,
      "fidelityScore": 23.47,
      "traitScore": 20.52,
      "completenessScore": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "priorsContribution": 35.99,
      "baselineContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "op-025",
    "input": {
      "priorCoverage": 0.79,
      "transformerFidelity": 0.79,
      "traitGrounding": 0.77,
      "packCompleteness": 0.8,
      "baselineConfidence": 0.8,
      "baselineOptimism": 0.33,
      "traitHardness": 0.26,
      "overclaimRisk": 0.21,
      "priorBias": "priors_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 62.03,
      "fidelityScore": 79.52,
      "traitScore": 54.83,
      "completenessScore": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "priorsContribution": 72.57,
      "baselineContribution": 48.24,
      "overall": 72.19
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 19.5,
      "fidelityScore": 24.56,
      "traitScore": 21.5,
      "completenessScore": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "priorsContribution": 30.34,
      "baselineContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "op-026",
    "input": {
      "priorCoverage": 0.83,
      "transformerFidelity": 0.83,
      "traitGrounding": 0.8,
      "packCompleteness": 0.83,
      "baselineConfidence": 0.84,
      "baselineOptimism": 0.34,
      "traitHardness": 0.27,
      "overclaimRisk": 0.22,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 77.64,
      "fidelityScore": 83.17,
      "traitScore": 80.25,
      "completenessScore": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "priorsContribution": 81.91,
      "baselineContribution": 50.82,
      "overall": 80.31
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 33.17,
      "fidelityScore": 25.61,
      "traitScore": 22.47,
      "completenessScore": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "priorsContribution": 38.87,
      "baselineContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "op-027",
    "input": {
      "priorCoverage": 0.87,
      "transformerFidelity": 0.81,
      "traitGrounding": 0.84,
      "packCompleteness": 0.87,
      "baselineConfidence": 0.88,
      "baselineOptimism": 0.3,
      "traitHardness": 0.27,
      "overclaimRisk": 0.17,
      "priorBias": "trait_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 67.91,
      "fidelityScore": 82.98,
      "traitScore": 100,
      "completenessScore": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "priorsContribution": 80.55,
      "baselineContribution": 52.46,
      "overall": 79.49
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 30.78,
      "fidelityScore": 24.64,
      "traitScore": 21.53,
      "completenessScore": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "priorsContribution": 33.36,
      "baselineContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "op-028",
    "input": {
      "priorCoverage": 0.83,
      "transformerFidelity": 0.86,
      "traitGrounding": 0.87,
      "packCompleteness": 0.83,
      "baselineConfidence": 0.84,
      "baselineOptimism": 0.31,
      "traitHardness": 0.2,
      "overclaimRisk": 0.17,
      "priorBias": "baseline_first",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 55.14,
      "fidelityScore": 75.3,
      "traitScore": 60.67,
      "completenessScore": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "priorsContribution": 61.17,
      "baselineContribution": 51.78,
      "overall": 60.48
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 38.81,
      "fidelityScore": 25.31,
      "traitScore": 22.44,
      "completenessScore": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "priorsContribution": 43.4,
      "baselineContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "op-029",
    "input": {
      "priorCoverage": 0.87,
      "transformerFidelity": 0.9,
      "traitGrounding": 0.91,
      "packCompleteness": 0.87,
      "baselineConfidence": 0.87,
      "baselineOptimism": 0.33,
      "traitHardness": 0.2,
      "overclaimRisk": 0.18,
      "priorBias": "balanced",
      "profile": "priors_informed_transformer"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 84.21,
      "fidelityScore": 88.91,
      "traitScore": 89.77,
      "completenessScore": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "priorsContribution": 88.67,
      "baselineContribution": 54.2,
      "overall": 86.47
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 36.33,
      "fidelityScore": 26.66,
      "traitScore": 23.73,
      "completenessScore": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "priorsContribution": 40.56,
      "baselineContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "op-030",
    "input": {
      "priorCoverage": 0.91,
      "transformerFidelity": 0.88,
      "traitGrounding": 0.87,
      "packCompleteness": 0.91,
      "baselineConfidence": 0.91,
      "baselineOptimism": 0.28,
      "traitHardness": 0.21,
      "overclaimRisk": 0.13,
      "priorBias": "priors_first",
      "profile": "priors_free_omics_baseline"
    },
    "expectedPriorsInformed": {
      "mode": "priors_informed_transformer",
      "priorScore": 71.33,
      "fidelityScore": 88.77,
      "traitScore": 63.21,
      "completenessScore": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "priorsContribution": 79.55,
      "baselineContribution": 55.26,
      "overall": 79.18
    },
    "expectedPriorsFree": {
      "mode": "priors_free_omics_baseline",
      "priorScore": 25.72,
      "fidelityScore": 25,
      "traitScore": 22.06,
      "completenessScore": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "priorsContribution": 32.8,
      "baselineContribution": 50.65,
      "overall": 44.26
    }
  }
];
