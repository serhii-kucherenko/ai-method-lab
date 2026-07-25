import type { AccelPdInput, AccelPdQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AccelPdInput;
  expectedTransformer: AccelPdQuality;
  expectedBaseline: AccelPdQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ap-001",
    "input": {
      "channelCoverage": 0.29,
      "transformerFidelity": 0.25,
      "activityGrounding": 0.28,
      "representationCompleteness": 0.34,
      "baselineConfidence": 0.39,
      "baselineOptimism": 0.45,
      "signalHardness": 0.59,
      "overclaimRisk": 0.5,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 23.37,
      "fidelityScore": 30.25,
      "activityScore": 23.45,
      "completenessScore": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "transformerContribution": 28.18,
      "baselineContribution": 15.92,
      "overall": 29.97
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 5.76,
      "fidelityScore": 17.05,
      "activityScore": 12.78,
      "completenessScore": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "transformerContribution": 21.78,
      "baselineContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "ap-002",
    "input": {
      "channelCoverage": 0.33,
      "transformerFidelity": 0.29,
      "activityGrounding": 0.32,
      "representationCompleteness": 0.38,
      "baselineConfidence": 0.43,
      "baselineOptimism": 0.46,
      "signalHardness": 0.6,
      "overclaimRisk": 0.51,
      "paBias": "channel_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 22.88,
      "fidelityScore": 33.9,
      "activityScore": 34.35,
      "completenessScore": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "transformerContribution": 30.72,
      "baselineContribution": 18.58,
      "overall": 32.53
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 2.43,
      "fidelityScore": 18.17,
      "activityScore": 13.81,
      "completenessScore": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "transformerContribution": 20,
      "baselineContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "ap-003",
    "input": {
      "channelCoverage": 0.37,
      "transformerFidelity": 0.27,
      "activityGrounding": 0.36,
      "representationCompleteness": 0.42,
      "baselineConfidence": 0.46,
      "baselineOptimism": 0.42,
      "signalHardness": 0.6,
      "overclaimRisk": 0.46,
      "paBias": "baseline_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 14.21,
      "fidelityScore": 23.71,
      "activityScore": 20.92,
      "completenessScore": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "transformerContribution": 19.48,
      "baselineContribution": 19.65,
      "overall": 20.51
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 12.17,
      "fidelityScore": 17.05,
      "activityScore": 12.78,
      "completenessScore": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "transformerContribution": 26.05,
      "baselineContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "ap-004",
    "input": {
      "channelCoverage": 0.33,
      "transformerFidelity": 0.32,
      "activityGrounding": 0.39,
      "representationCompleteness": 0.38,
      "baselineConfidence": 0.42,
      "baselineOptimism": 0.43,
      "signalHardness": 0.53,
      "overclaimRisk": 0.46,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 30.23,
      "fidelityScore": 36.03,
      "activityScore": 33.26,
      "completenessScore": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "transformerContribution": 35.11,
      "baselineContribution": 19.24,
      "overall": 36.25
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 8.7,
      "fidelityScore": 18.05,
      "activityScore": 14.08,
      "completenessScore": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "transformerContribution": 23.28,
      "baselineContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "ap-005",
    "input": {
      "channelCoverage": 0.37,
      "transformerFidelity": 0.36,
      "activityGrounding": 0.35,
      "representationCompleteness": 0.42,
      "baselineConfidence": 0.46,
      "baselineOptimism": 0.45,
      "signalHardness": 0.53,
      "overclaimRisk": 0.47,
      "paBias": "transformer_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 26.59,
      "fidelityScore": 39.64,
      "activityScore": 21.33,
      "completenessScore": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "transformerContribution": 34.35,
      "baselineContribution": 22.12,
      "overall": 36.15
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 0,
      "fidelityScore": 19.43,
      "activityScore": 15.31,
      "completenessScore": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "transformerContribution": 20.49,
      "baselineContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "ap-006",
    "input": {
      "channelCoverage": 0.41,
      "transformerFidelity": 0.34,
      "activityGrounding": 0.39,
      "representationCompleteness": 0.45,
      "baselineConfidence": 0.5,
      "baselineOptimism": 0.4,
      "signalHardness": 0.54,
      "overclaimRisk": 0.42,
      "paBias": "balanced",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 35.28,
      "fidelityScore": 39.5,
      "activityScore": 35.78,
      "completenessScore": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "transformerContribution": 39.2,
      "baselineContribution": 23.32,
      "overall": 40.34
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 11.98,
      "fidelityScore": 17.95,
      "activityScore": 13.91,
      "completenessScore": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "transformerContribution": 25.07,
      "baselineContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "ap-007",
    "input": {
      "channelCoverage": 0.45,
      "transformerFidelity": 0.38,
      "activityGrounding": 0.42,
      "representationCompleteness": 0.49,
      "baselineConfidence": 0.53,
      "baselineOptimism": 0.42,
      "signalHardness": 0.55,
      "overclaimRisk": 0.43,
      "paBias": "channel_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 32.43,
      "fidelityScore": 43.11,
      "activityScore": 48.27,
      "completenessScore": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "transformerContribution": 40.95,
      "baselineContribution": 25.54,
      "overall": 42.18
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 8.27,
      "fidelityScore": 19.21,
      "activityScore": 15.09,
      "completenessScore": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "transformerContribution": 22.61,
      "baselineContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "ap-008",
    "input": {
      "channelCoverage": 0.41,
      "transformerFidelity": 0.43,
      "activityGrounding": 0.46,
      "representationCompleteness": 0.45,
      "baselineConfidence": 0.49,
      "baselineOptimism": 0.43,
      "signalHardness": 0.47,
      "overclaimRisk": 0.44,
      "paBias": "baseline_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 20.12,
      "fidelityScore": 35.43,
      "activityScore": 27.76,
      "completenessScore": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "transformerContribution": 26.95,
      "baselineContribution": 25.37,
      "overall": 27.67
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 16.4,
      "fidelityScore": 20.36,
      "activityScore": 16.57,
      "completenessScore": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "transformerContribution": 29.4,
      "baselineContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "ap-009",
    "input": {
      "channelCoverage": 0.46,
      "transformerFidelity": 0.41,
      "activityGrounding": 0.5,
      "representationCompleteness": 0.49,
      "baselineConfidence": 0.53,
      "baselineOptimism": 0.39,
      "signalHardness": 0.48,
      "overclaimRisk": 0.38,
      "paBias": "balanced",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 42.68,
      "fidelityScore": 45.49,
      "activityScore": 45.8,
      "completenessScore": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "transformerContribution": 46.41,
      "baselineContribution": 26.81,
      "overall": 46.88
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 14.91,
      "fidelityScore": 19.22,
      "activityScore": 15.52,
      "completenessScore": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "transformerContribution": 26.78,
      "baselineContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "ap-010",
    "input": {
      "channelCoverage": 0.5,
      "transformerFidelity": 0.45,
      "activityGrounding": 0.46,
      "representationCompleteness": 0.53,
      "baselineConfidence": 0.57,
      "baselineOptimism": 0.4,
      "signalHardness": 0.49,
      "overclaimRisk": 0.39,
      "paBias": "transformer_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 36.76,
      "fidelityScore": 49.14,
      "activityScore": 30.54,
      "completenessScore": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "transformerContribution": 44.6,
      "baselineContribution": 29.21,
      "overall": 45.83
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 3.59,
      "fidelityScore": 20.03,
      "activityScore": 16.17,
      "completenessScore": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "transformerContribution": 22.48,
      "baselineContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "ap-011",
    "input": {
      "channelCoverage": 0.54,
      "transformerFidelity": 0.49,
      "activityGrounding": 0.49,
      "representationCompleteness": 0.57,
      "baselineConfidence": 0.6,
      "baselineOptimism": 0.42,
      "signalHardness": 0.49,
      "overclaimRisk": 0.4,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 47.07,
      "fidelityScore": 52.75,
      "activityScore": 47.04,
      "completenessScore": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "transformerContribution": 51.33,
      "baselineContribution": 31.67,
      "overall": 51.79
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 17.1,
      "fidelityScore": 21.44,
      "activityScore": 17.52,
      "completenessScore": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "transformerContribution": 29.75,
      "baselineContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "ap-012",
    "input": {
      "channelCoverage": 0.5,
      "transformerFidelity": 0.48,
      "activityGrounding": 0.53,
      "representationCompleteness": 0.53,
      "baselineConfidence": 0.56,
      "baselineOptimism": 0.37,
      "signalHardness": 0.42,
      "overclaimRisk": 0.35,
      "paBias": "channel_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 39.39,
      "fidelityScore": 51.28,
      "activityScore": 62.01,
      "completenessScore": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "transformerContribution": 49.55,
      "baselineContribution": 29.77,
      "overall": 49.99
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 13.23,
      "fidelityScore": 19.78,
      "activityScore": 16.29,
      "completenessScore": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "transformerContribution": 24,
      "baselineContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "ap-013",
    "input": {
      "channelCoverage": 0.54,
      "transformerFidelity": 0.52,
      "activityGrounding": 0.56,
      "representationCompleteness": 0.57,
      "baselineConfidence": 0.6,
      "baselineOptimism": 0.39,
      "signalHardness": 0.42,
      "overclaimRisk": 0.36,
      "paBias": "baseline_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 30.08,
      "fidelityScore": 44.88,
      "activityScore": 36.64,
      "completenessScore": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "transformerContribution": 36.04,
      "baselineContribution": 32.85,
      "overall": 36.47
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 22.62,
      "fidelityScore": 21.42,
      "activityScore": 17.82,
      "completenessScore": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "transformerContribution": 33.32,
      "baselineContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "ap-014",
    "input": {
      "channelCoverage": 0.58,
      "transformerFidelity": 0.56,
      "activityGrounding": 0.6,
      "representationCompleteness": 0.61,
      "baselineConfidence": 0.63,
      "baselineOptimism": 0.4,
      "signalHardness": 0.43,
      "overclaimRisk": 0.36,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 53.79,
      "fidelityScore": 58.53,
      "activityScore": 56.71,
      "completenessScore": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "transformerContribution": 58.18,
      "baselineContribution": 34.85,
      "overall": 57.98
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 20.03,
      "fidelityScore": 22.26,
      "activityScore": 18.61,
      "completenessScore": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "transformerContribution": 31.17,
      "baselineContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "ap-015",
    "input": {
      "channelCoverage": 0.62,
      "transformerFidelity": 0.54,
      "activityGrounding": 0.56,
      "representationCompleteness": 0.65,
      "baselineConfidence": 0.67,
      "baselineOptimism": 0.36,
      "signalHardness": 0.44,
      "overclaimRisk": 0.31,
      "paBias": "transformer_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 46.23,
      "fidelityScore": 58.35,
      "activityScore": 39.15,
      "completenessScore": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "transformerContribution": 54.57,
      "baselineContribution": 36.06,
      "overall": 55.24
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 9.43,
      "fidelityScore": 20.94,
      "activityScore": 17.24,
      "completenessScore": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "transformerContribution": 25.02,
      "baselineContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "ap-016",
    "input": {
      "channelCoverage": 0.58,
      "transformerFidelity": 0.59,
      "activityGrounding": 0.6,
      "representationCompleteness": 0.6,
      "baselineConfidence": 0.63,
      "baselineOptimism": 0.37,
      "signalHardness": 0.36,
      "overclaimRisk": 0.32,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 54.78,
      "fidelityScore": 60.67,
      "activityScore": 57.91,
      "completenessScore": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "transformerContribution": 59.33,
      "baselineContribution": 35.81,
      "overall": 59.1
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 22.05,
      "fidelityScore": 21.96,
      "activityScore": 18.63,
      "completenessScore": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "transformerContribution": 31.3,
      "baselineContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "ap-017",
    "input": {
      "channelCoverage": 0.62,
      "transformerFidelity": 0.63,
      "activityGrounding": 0.63,
      "representationCompleteness": 0.64,
      "baselineConfidence": 0.67,
      "baselineOptimism": 0.39,
      "signalHardness": 0.37,
      "overclaimRisk": 0.33,
      "paBias": "channel_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 48.45,
      "fidelityScore": 64.28,
      "activityScore": 75.16,
      "completenessScore": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "transformerContribution": 60.68,
      "baselineContribution": 38.64,
      "overall": 60.71
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 18.73,
      "fidelityScore": 23.45,
      "activityScore": 19.98,
      "completenessScore": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "transformerContribution": 28.43,
      "baselineContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "ap-018",
    "input": {
      "channelCoverage": 0.66,
      "transformerFidelity": 0.61,
      "activityGrounding": 0.67,
      "representationCompleteness": 0.68,
      "baselineConfidence": 0.7,
      "baselineOptimism": 0.34,
      "signalHardness": 0.38,
      "overclaimRisk": 0.27,
      "paBias": "baseline_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 39.72,
      "fidelityScore": 54.13,
      "activityScore": 45.55,
      "completenessScore": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "transformerContribution": 44.89,
      "baselineContribution": 39.18,
      "overall": 44.86
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 28.36,
      "fidelityScore": 21.69,
      "activityScore": 18.3,
      "completenessScore": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "transformerContribution": 36.46,
      "baselineContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "ap-019",
    "input": {
      "channelCoverage": 0.7,
      "transformerFidelity": 0.65,
      "activityGrounding": 0.7,
      "representationCompleteness": 0.72,
      "baselineConfidence": 0.74,
      "baselineOptimism": 0.36,
      "signalHardness": 0.38,
      "overclaimRisk": 0.28,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 65.21,
      "fidelityScore": 67.74,
      "activityScore": 68.17,
      "completenessScore": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "transformerContribution": 68.82,
      "baselineContribution": 42.25,
      "overall": 68.04
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 26.25,
      "fidelityScore": 23.32,
      "activityScore": 19.82,
      "completenessScore": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "transformerContribution": 34.62,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ap-020",
    "input": {
      "channelCoverage": 0.66,
      "transformerFidelity": 0.7,
      "activityGrounding": 0.66,
      "representationCompleteness": 0.68,
      "baselineConfidence": 0.7,
      "baselineOptimism": 0.37,
      "signalHardness": 0.31,
      "overclaimRisk": 0.29,
      "paBias": "transformer_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 51.95,
      "fidelityScore": 70.06,
      "activityScore": 45.74,
      "completenessScore": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "transformerContribution": 62.23,
      "baselineContribution": 41.54,
      "overall": 62.51
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 13.66,
      "fidelityScore": 23.93,
      "activityScore": 20.65,
      "completenessScore": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "transformerContribution": 27.92,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ap-021",
    "input": {
      "channelCoverage": 0.7,
      "transformerFidelity": 0.68,
      "activityGrounding": 0.7,
      "representationCompleteness": 0.72,
      "baselineConfidence": 0.73,
      "baselineOptimism": 0.33,
      "signalHardness": 0.31,
      "overclaimRisk": 0.24,
      "paBias": "balanced",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 66.16,
      "fidelityScore": 69.88,
      "activityScore": 69.32,
      "completenessScore": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "transformerContribution": 70.06,
      "baselineContribution": 42.54,
      "overall": 69.11
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 27.89,
      "fidelityScore": 22.72,
      "activityScore": 19.52,
      "completenessScore": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "transformerContribution": 34.33,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ap-022",
    "input": {
      "channelCoverage": 0.74,
      "transformerFidelity": 0.72,
      "activityGrounding": 0.73,
      "representationCompleteness": 0.76,
      "baselineConfidence": 0.77,
      "baselineOptimism": 0.34,
      "signalHardness": 0.32,
      "overclaimRisk": 0.25,
      "paBias": "channel_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 57.83,
      "fidelityScore": 73.52,
      "activityScore": 88.84,
      "completenessScore": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "transformerContribution": 70.87,
      "baselineContribution": 45.13,
      "overall": 70.24
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 24.57,
      "fidelityScore": 23.77,
      "activityScore": 20.46,
      "completenessScore": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "transformerContribution": 30.61,
      "baselineContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "ap-023",
    "input": {
      "channelCoverage": 0.79,
      "transformerFidelity": 0.76,
      "activityGrounding": 0.77,
      "representationCompleteness": 0.8,
      "baselineConfidence": 0.81,
      "baselineOptimism": 0.36,
      "signalHardness": 0.33,
      "overclaimRisk": 0.25,
      "paBias": "baseline_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 49.24,
      "fidelityScore": 67.38,
      "activityScore": 53.71,
      "completenessScore": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "transformerContribution": 54.9,
      "baselineContribution": 47.99,
      "overall": 54.66
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 33.86,
      "fidelityScore": 25.2,
      "activityScore": 21.84,
      "completenessScore": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "transformerContribution": 41.91,
      "baselineContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "ap-024",
    "input": {
      "channelCoverage": 0.75,
      "transformerFidelity": 0.75,
      "activityGrounding": 0.81,
      "representationCompleteness": 0.76,
      "baselineConfidence": 0.77,
      "baselineOptimism": 0.31,
      "signalHardness": 0.25,
      "overclaimRisk": 0.2,
      "paBias": "balanced",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 73.31,
      "fidelityScore": 75.91,
      "activityScore": 79.08,
      "completenessScore": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "transformerContribution": 77.14,
      "baselineContribution": 46.16,
      "overall": 75.56
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 31.21,
      "fidelityScore": 23.47,
      "activityScore": 20.52,
      "completenessScore": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "transformerContribution": 35.99,
      "baselineContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "ap-025",
    "input": {
      "channelCoverage": 0.79,
      "transformerFidelity": 0.79,
      "activityGrounding": 0.77,
      "representationCompleteness": 0.8,
      "baselineConfidence": 0.8,
      "baselineOptimism": 0.33,
      "signalHardness": 0.26,
      "overclaimRisk": 0.21,
      "paBias": "transformer_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 62.03,
      "fidelityScore": 79.52,
      "activityScore": 54.83,
      "completenessScore": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "transformerContribution": 72.57,
      "baselineContribution": 48.24,
      "overall": 72.19
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 19.5,
      "fidelityScore": 24.56,
      "activityScore": 21.5,
      "completenessScore": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "transformerContribution": 30.34,
      "baselineContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "ap-026",
    "input": {
      "channelCoverage": 0.83,
      "transformerFidelity": 0.83,
      "activityGrounding": 0.8,
      "representationCompleteness": 0.83,
      "baselineConfidence": 0.84,
      "baselineOptimism": 0.34,
      "signalHardness": 0.27,
      "overclaimRisk": 0.22,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 77.64,
      "fidelityScore": 83.17,
      "activityScore": 80.25,
      "completenessScore": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "transformerContribution": 81.91,
      "baselineContribution": 50.82,
      "overall": 80.31
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 33.17,
      "fidelityScore": 25.61,
      "activityScore": 22.47,
      "completenessScore": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "transformerContribution": 38.87,
      "baselineContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "ap-027",
    "input": {
      "channelCoverage": 0.87,
      "transformerFidelity": 0.81,
      "activityGrounding": 0.84,
      "representationCompleteness": 0.87,
      "baselineConfidence": 0.88,
      "baselineOptimism": 0.3,
      "signalHardness": 0.27,
      "overclaimRisk": 0.17,
      "paBias": "channel_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 67.91,
      "fidelityScore": 82.98,
      "activityScore": 100,
      "completenessScore": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "transformerContribution": 80.55,
      "baselineContribution": 52.46,
      "overall": 79.49
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 30.78,
      "fidelityScore": 24.64,
      "activityScore": 21.53,
      "completenessScore": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "transformerContribution": 33.36,
      "baselineContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "ap-028",
    "input": {
      "channelCoverage": 0.83,
      "transformerFidelity": 0.86,
      "activityGrounding": 0.87,
      "representationCompleteness": 0.83,
      "baselineConfidence": 0.84,
      "baselineOptimism": 0.31,
      "signalHardness": 0.2,
      "overclaimRisk": 0.17,
      "paBias": "baseline_first",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 55.14,
      "fidelityScore": 75.3,
      "activityScore": 60.67,
      "completenessScore": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "transformerContribution": 61.17,
      "baselineContribution": 51.78,
      "overall": 60.48
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 38.81,
      "fidelityScore": 25.31,
      "activityScore": 22.44,
      "completenessScore": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "transformerContribution": 43.4,
      "baselineContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "ap-029",
    "input": {
      "channelCoverage": 0.87,
      "transformerFidelity": 0.9,
      "activityGrounding": 0.91,
      "representationCompleteness": 0.87,
      "baselineConfidence": 0.87,
      "baselineOptimism": 0.33,
      "signalHardness": 0.2,
      "overclaimRisk": 0.18,
      "paBias": "balanced",
      "profile": "multichannel_pa_transformer"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 84.21,
      "fidelityScore": 88.91,
      "activityScore": 89.77,
      "completenessScore": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "transformerContribution": 88.67,
      "baselineContribution": 54.2,
      "overall": 86.47
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 36.33,
      "fidelityScore": 26.66,
      "activityScore": 23.73,
      "completenessScore": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "transformerContribution": 40.56,
      "baselineContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "ap-030",
    "input": {
      "channelCoverage": 0.91,
      "transformerFidelity": 0.88,
      "activityGrounding": 0.87,
      "representationCompleteness": 0.91,
      "baselineConfidence": 0.91,
      "baselineOptimism": 0.28,
      "signalHardness": 0.21,
      "overclaimRisk": 0.13,
      "paBias": "transformer_first",
      "profile": "handcrafted_pa_baseline"
    },
    "expectedTransformer": {
      "mode": "multichannel_pa_transformer",
      "channelScore": 71.33,
      "fidelityScore": 88.77,
      "activityScore": 63.21,
      "completenessScore": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "transformerContribution": 79.55,
      "baselineContribution": 55.26,
      "overall": 79.18
    },
    "expectedBaseline": {
      "mode": "handcrafted_pa_baseline",
      "channelScore": 25.72,
      "fidelityScore": 25,
      "activityScore": 22.06,
      "completenessScore": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "transformerContribution": 32.8,
      "baselineContribution": 50.65,
      "overall": 44.26
    }
  }
];
