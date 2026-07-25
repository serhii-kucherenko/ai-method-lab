import type { DetectInput, DetectQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DetectInput;
  expectedCnn: DetectQuality;
  expectedVisual: DetectQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sd-001",
    "input": {
      "stigmaClarity": 0.29,
      "adulterantContrast": 0.25,
      "cnnConfidence": 0.28,
      "textureIntegrity": 0.34,
      "visualConfidence": 0.39,
      "baselineOptimism": 0.45,
      "detectHardness": 0.59,
      "overclaimRisk": 0.5,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 22.53,
      "contrastScore": 30.25,
      "cnnScore": 23.45,
      "textureIntegrity": 37.64,
      "visualScore": 16.4,
      "confidence": 20.85,
      "cnnContribution": 27.96,
      "visualContribution": 15.92,
      "overall": 29.79
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 5.76,
      "contrastScore": 17.05,
      "cnnScore": 12.78,
      "textureIntegrity": 32.39,
      "visualScore": 40.93,
      "confidence": 17.1,
      "cnnContribution": 21.78,
      "visualContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "sd-002",
    "input": {
      "stigmaClarity": 0.33,
      "adulterantContrast": 0.29,
      "cnnConfidence": 0.32,
      "textureIntegrity": 0.38,
      "visualConfidence": 0.43,
      "baselineOptimism": 0.46,
      "detectHardness": 0.6,
      "overclaimRisk": 0.51,
      "detectBias": "stigma_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 22.19,
      "contrastScore": 33.9,
      "cnnScore": 34.35,
      "textureIntegrity": 31.9,
      "visualScore": 18.89,
      "confidence": 24.5,
      "cnnContribution": 30.54,
      "visualContribution": 18.58,
      "overall": 32.39
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 2.43,
      "contrastScore": 18.17,
      "cnnScore": 13.81,
      "textureIntegrity": 34.08,
      "visualScore": 31.53,
      "confidence": 18.65,
      "cnnContribution": 20,
      "visualContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "sd-003",
    "input": {
      "stigmaClarity": 0.37,
      "adulterantContrast": 0.27,
      "cnnConfidence": 0.36,
      "textureIntegrity": 0.42,
      "visualConfidence": 0.46,
      "baselineOptimism": 0.42,
      "detectHardness": 0.6,
      "overclaimRisk": 0.46,
      "detectBias": "visual_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 12.16,
      "contrastScore": 23.71,
      "cnnScore": 20.92,
      "textureIntegrity": 19.24,
      "visualScore": 19.94,
      "confidence": 27.1,
      "cnnContribution": 18.94,
      "visualContribution": 19.65,
      "overall": 20.07
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 12.17,
      "contrastScore": 17.05,
      "cnnScore": 12.78,
      "textureIntegrity": 33.93,
      "visualScore": 54.34,
      "confidence": 18.4,
      "cnnContribution": 26.05,
      "visualContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "sd-004",
    "input": {
      "stigmaClarity": 0.33,
      "adulterantContrast": 0.32,
      "cnnConfidence": 0.39,
      "textureIntegrity": 0.38,
      "visualConfidence": 0.42,
      "baselineOptimism": 0.43,
      "detectHardness": 0.53,
      "overclaimRisk": 0.46,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 28.27,
      "contrastScore": 36.03,
      "cnnScore": 33.26,
      "textureIntegrity": 42.23,
      "visualScore": 18.93,
      "confidence": 25.85,
      "cnnContribution": 34.6,
      "visualContribution": 19.24,
      "overall": 35.84
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 8.7,
      "contrastScore": 18.05,
      "cnnScore": 14.08,
      "textureIntegrity": 32.79,
      "visualScore": 42.77,
      "confidence": 18.85,
      "cnnContribution": 23.28,
      "visualContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "sd-005",
    "input": {
      "stigmaClarity": 0.37,
      "adulterantContrast": 0.36,
      "cnnConfidence": 0.35,
      "textureIntegrity": 0.42,
      "visualConfidence": 0.46,
      "baselineOptimism": 0.45,
      "detectHardness": 0.53,
      "overclaimRisk": 0.47,
      "detectBias": "cnn_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 26.81,
      "contrastScore": 39.64,
      "cnnScore": 21.33,
      "textureIntegrity": 54.3,
      "visualScore": 21.8,
      "confidence": 29.35,
      "cnnContribution": 34.4,
      "visualContribution": 22.12,
      "overall": 36.19
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 0,
      "contrastScore": 19.43,
      "cnnScore": 15.31,
      "textureIntegrity": 34.77,
      "visualScore": 32.95,
      "confidence": 21.05,
      "cnnContribution": 20.49,
      "visualContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "sd-006",
    "input": {
      "stigmaClarity": 0.41,
      "adulterantContrast": 0.34,
      "cnnConfidence": 0.39,
      "textureIntegrity": 0.45,
      "visualConfidence": 0.5,
      "baselineOptimism": 0.4,
      "detectHardness": 0.54,
      "overclaimRisk": 0.42,
      "detectBias": "balanced",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 33.88,
      "contrastScore": 39.5,
      "cnnScore": 35.78,
      "textureIntegrity": 47.85,
      "visualScore": 23.08,
      "confidence": 31.85,
      "cnnContribution": 38.83,
      "visualContribution": 23.32,
      "overall": 40.04
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 11.98,
      "contrastScore": 17.95,
      "cnnScore": 13.91,
      "textureIntegrity": 34.78,
      "visualScore": 46.72,
      "confidence": 20.5,
      "cnnContribution": 25.07,
      "visualContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "sd-007",
    "input": {
      "stigmaClarity": 0.45,
      "adulterantContrast": 0.38,
      "cnnConfidence": 0.42,
      "textureIntegrity": 0.49,
      "visualConfidence": 0.53,
      "baselineOptimism": 0.42,
      "detectHardness": 0.55,
      "overclaimRisk": 0.43,
      "detectBias": "stigma_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 31.52,
      "contrastScore": 43.11,
      "cnnScore": 48.27,
      "textureIntegrity": 39.34,
      "visualScore": 25.15,
      "confidence": 35.35,
      "cnnContribution": 40.71,
      "visualContribution": 25.54,
      "overall": 41.98
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 8.27,
      "contrastScore": 19.21,
      "cnnScore": 15.09,
      "textureIntegrity": 36.3,
      "visualScore": 34.2,
      "confidence": 22.15,
      "cnnContribution": 22.61,
      "visualContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "sd-008",
    "input": {
      "stigmaClarity": 0.41,
      "adulterantContrast": 0.43,
      "cnnConfidence": 0.46,
      "textureIntegrity": 0.45,
      "visualConfidence": 0.49,
      "baselineOptimism": 0.43,
      "detectHardness": 0.47,
      "overclaimRisk": 0.44,
      "detectBias": "visual_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 19.43,
      "contrastScore": 35.43,
      "cnnScore": 27.76,
      "textureIntegrity": 24.76,
      "visualScore": 24.32,
      "confidence": 34.1,
      "cnnContribution": 26.78,
      "visualContribution": 25.37,
      "overall": 27.53
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 16.4,
      "contrastScore": 20.36,
      "cnnScore": 16.57,
      "textureIntegrity": 35.17,
      "visualScore": 58.5,
      "confidence": 22.7,
      "cnnContribution": 29.4,
      "visualContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "sd-009",
    "input": {
      "stigmaClarity": 0.46,
      "adulterantContrast": 0.41,
      "cnnConfidence": 0.5,
      "textureIntegrity": 0.49,
      "visualConfidence": 0.53,
      "baselineOptimism": 0.39,
      "detectHardness": 0.48,
      "overclaimRisk": 0.38,
      "detectBias": "balanced",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 40.16,
      "contrastScore": 45.49,
      "cnnScore": 45.8,
      "textureIntegrity": 52.59,
      "visualScore": 25.81,
      "confidence": 37.1,
      "cnnContribution": 45.75,
      "visualContribution": 26.81,
      "overall": 46.34
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 14.91,
      "contrastScore": 19.22,
      "cnnScore": 15.52,
      "textureIntegrity": 35.36,
      "visualScore": 48.88,
      "confidence": 22.7,
      "cnnContribution": 26.78,
      "visualContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "sd-010",
    "input": {
      "stigmaClarity": 0.5,
      "adulterantContrast": 0.45,
      "cnnConfidence": 0.46,
      "textureIntegrity": 0.53,
      "visualConfidence": 0.57,
      "baselineOptimism": 0.4,
      "detectHardness": 0.49,
      "overclaimRisk": 0.39,
      "detectBias": "cnn_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 36.53,
      "contrastScore": 49.14,
      "cnnScore": 30.54,
      "textureIntegrity": 66.82,
      "visualScore": 28.29,
      "confidence": 40.75,
      "cnnContribution": 44.54,
      "visualContribution": 29.21,
      "overall": 45.78
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 3.59,
      "contrastScore": 20.03,
      "cnnScore": 16.17,
      "textureIntegrity": 37.06,
      "visualScore": 35.54,
      "confidence": 24.25,
      "cnnContribution": 22.48,
      "visualContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "sd-011",
    "input": {
      "stigmaClarity": 0.54,
      "adulterantContrast": 0.49,
      "cnnConfidence": 0.49,
      "textureIntegrity": 0.57,
      "visualConfidence": 0.6,
      "baselineOptimism": 0.42,
      "detectHardness": 0.49,
      "overclaimRisk": 0.4,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 47.07,
      "contrastScore": 52.75,
      "cnnScore": 47.04,
      "textureIntegrity": 60.27,
      "visualScore": 30.54,
      "confidence": 44.25,
      "cnnContribution": 51.33,
      "visualContribution": 31.67,
      "overall": 51.79
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 17.1,
      "contrastScore": 21.44,
      "cnnScore": 17.52,
      "textureIntegrity": 38.58,
      "visualScore": 54.12,
      "confidence": 26.1,
      "cnnContribution": 29.75,
      "visualContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "sd-012",
    "input": {
      "stigmaClarity": 0.5,
      "adulterantContrast": 0.48,
      "cnnConfidence": 0.53,
      "textureIntegrity": 0.53,
      "visualConfidence": 0.56,
      "baselineOptimism": 0.37,
      "detectHardness": 0.42,
      "overclaimRisk": 0.35,
      "detectBias": "stigma_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 38.25,
      "contrastScore": 51.28,
      "cnnScore": 62.01,
      "textureIntegrity": 43.82,
      "visualScore": 28.34,
      "confidence": 42.1,
      "cnnContribution": 49.26,
      "visualContribution": 29.77,
      "overall": 49.75
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 13.23,
      "contrastScore": 19.78,
      "cnnScore": 16.29,
      "textureIntegrity": 35.76,
      "visualScore": 34.93,
      "confidence": 24.35,
      "cnnContribution": 24,
      "visualContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "sd-013",
    "input": {
      "stigmaClarity": 0.54,
      "adulterantContrast": 0.52,
      "cnnConfidence": 0.56,
      "textureIntegrity": 0.57,
      "visualConfidence": 0.6,
      "baselineOptimism": 0.39,
      "detectHardness": 0.42,
      "overclaimRisk": 0.36,
      "detectBias": "visual_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 29.17,
      "contrastScore": 44.88,
      "cnnScore": 36.64,
      "textureIntegrity": 32.66,
      "visualScore": 31.2,
      "confidence": 45.6,
      "cnnContribution": 35.8,
      "visualContribution": 32.85,
      "overall": 36.27
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 22.62,
      "contrastScore": 21.42,
      "cnnScore": 17.82,
      "textureIntegrity": 37.74,
      "visualScore": 67.02,
      "confidence": 26.55,
      "cnnContribution": 33.32,
      "visualContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "sd-014",
    "input": {
      "stigmaClarity": 0.58,
      "adulterantContrast": 0.56,
      "cnnConfidence": 0.6,
      "textureIntegrity": 0.61,
      "visualConfidence": 0.63,
      "baselineOptimism": 0.4,
      "detectHardness": 0.43,
      "overclaimRisk": 0.36,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 52.67,
      "contrastScore": 58.53,
      "cnnScore": 56.71,
      "textureIntegrity": 64.86,
      "visualScore": 33.07,
      "confidence": 49.25,
      "cnnContribution": 57.89,
      "visualContribution": 34.85,
      "overall": 57.74
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 20.03,
      "contrastScore": 22.26,
      "cnnScore": 18.61,
      "textureIntegrity": 38.98,
      "visualScore": 55.96,
      "confidence": 27.85,
      "cnnContribution": 31.17,
      "visualContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "sd-015",
    "input": {
      "stigmaClarity": 0.62,
      "adulterantContrast": 0.54,
      "cnnConfidence": 0.56,
      "textureIntegrity": 0.65,
      "visualConfidence": 0.67,
      "baselineOptimism": 0.36,
      "detectHardness": 0.44,
      "overclaimRisk": 0.31,
      "detectBias": "cnn_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 45.77,
      "contrastScore": 58.35,
      "cnnScore": 39.15,
      "textureIntegrity": 79.94,
      "visualScore": 34.55,
      "confidence": 51.85,
      "cnnContribution": 54.45,
      "visualContribution": 36.06,
      "overall": 55.14
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 9.43,
      "contrastScore": 20.94,
      "cnnScore": 17.24,
      "textureIntegrity": 39.27,
      "visualScore": 38.2,
      "confidence": 27.75,
      "cnnContribution": 25.02,
      "visualContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "sd-016",
    "input": {
      "stigmaClarity": 0.58,
      "adulterantContrast": 0.59,
      "cnnConfidence": 0.6,
      "textureIntegrity": 0.6,
      "visualConfidence": 0.63,
      "baselineOptimism": 0.37,
      "detectHardness": 0.36,
      "overclaimRisk": 0.32,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 54.5,
      "contrastScore": 60.67,
      "cnnScore": 57.91,
      "textureIntegrity": 65.05,
      "visualScore": 33.73,
      "confidence": 50.35,
      "cnnContribution": 59.26,
      "visualContribution": 35.81,
      "overall": 59.04
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 22.05,
      "contrastScore": 21.96,
      "cnnScore": 18.63,
      "textureIntegrity": 38.14,
      "visualScore": 55.7,
      "confidence": 28.3,
      "cnnContribution": 31.3,
      "visualContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "sd-017",
    "input": {
      "stigmaClarity": 0.62,
      "adulterantContrast": 0.63,
      "cnnConfidence": 0.63,
      "textureIntegrity": 0.64,
      "visualConfidence": 0.67,
      "baselineOptimism": 0.39,
      "detectHardness": 0.37,
      "overclaimRisk": 0.33,
      "detectBias": "stigma_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 48.45,
      "contrastScore": 64.28,
      "cnnScore": 75.16,
      "textureIntegrity": 52.76,
      "visualScore": 36.41,
      "confidence": 53.85,
      "cnnContribution": 60.68,
      "visualContribution": 38.64,
      "overall": 60.71
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 18.73,
      "contrastScore": 23.45,
      "cnnScore": 19.98,
      "textureIntegrity": 40.11,
      "visualScore": 39.86,
      "confidence": 30.3,
      "cnnContribution": 28.43,
      "visualContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "sd-018",
    "input": {
      "stigmaClarity": 0.66,
      "adulterantContrast": 0.61,
      "cnnConfidence": 0.67,
      "textureIntegrity": 0.68,
      "visualConfidence": 0.7,
      "baselineOptimism": 0.34,
      "detectHardness": 0.38,
      "overclaimRisk": 0.27,
      "detectBias": "visual_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 38.35,
      "contrastScore": 54.13,
      "cnnScore": 45.55,
      "textureIntegrity": 40.09,
      "visualScore": 37.08,
      "confidence": 56.6,
      "cnnContribution": 44.54,
      "visualContribution": 39.18,
      "overall": 44.58
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 28.36,
      "contrastScore": 21.69,
      "cnnScore": 18.3,
      "textureIntegrity": 39.67,
      "visualScore": 74.27,
      "confidence": 29.5,
      "cnnContribution": 36.46,
      "visualContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "sd-019",
    "input": {
      "stigmaClarity": 0.7,
      "adulterantContrast": 0.65,
      "cnnConfidence": 0.7,
      "textureIntegrity": 0.72,
      "visualConfidence": 0.74,
      "baselineOptimism": 0.36,
      "detectHardness": 0.38,
      "overclaimRisk": 0.28,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 63.81,
      "contrastScore": 67.74,
      "cnnScore": 68.17,
      "textureIntegrity": 75.07,
      "visualScore": 39.94,
      "confidence": 60.1,
      "cnnContribution": 68.45,
      "visualContribution": 42.25,
      "overall": 67.73
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 26.25,
      "contrastScore": 23.32,
      "cnnScore": 19.82,
      "textureIntegrity": 41.65,
      "visualScore": 62.07,
      "confidence": 31.7,
      "cnnContribution": 34.62,
      "visualContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sd-020",
    "input": {
      "stigmaClarity": 0.66,
      "adulterantContrast": 0.7,
      "cnnConfidence": 0.66,
      "textureIntegrity": 0.68,
      "visualConfidence": 0.7,
      "baselineOptimism": 0.37,
      "detectHardness": 0.31,
      "overclaimRisk": 0.29,
      "detectBias": "cnn_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 52.86,
      "contrastScore": 70.06,
      "cnnScore": 45.74,
      "textureIntegrity": 86.81,
      "visualScore": 38.94,
      "confidence": 58.85,
      "cnnContribution": 62.46,
      "visualContribution": 41.54,
      "overall": 62.69
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 13.66,
      "contrastScore": 23.93,
      "cnnScore": 20.65,
      "textureIntegrity": 40.51,
      "visualScore": 40.86,
      "confidence": 32.05,
      "cnnContribution": 27.92,
      "visualContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sd-021",
    "input": {
      "stigmaClarity": 0.7,
      "adulterantContrast": 0.68,
      "cnnConfidence": 0.7,
      "textureIntegrity": 0.72,
      "visualConfidence": 0.73,
      "baselineOptimism": 0.33,
      "detectHardness": 0.31,
      "overclaimRisk": 0.24,
      "detectBias": "balanced",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 65.6,
      "contrastScore": 69.88,
      "cnnScore": 69.32,
      "textureIntegrity": 75.82,
      "visualScore": 39.99,
      "confidence": 61.45,
      "cnnContribution": 69.92,
      "visualContribution": 42.54,
      "overall": 68.99
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 27.89,
      "contrastScore": 22.72,
      "cnnScore": 19.52,
      "textureIntegrity": 40.35,
      "visualScore": 61.19,
      "confidence": 31.8,
      "cnnContribution": 34.33,
      "visualContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sd-022",
    "input": {
      "stigmaClarity": 0.74,
      "adulterantContrast": 0.72,
      "cnnConfidence": 0.73,
      "textureIntegrity": 0.76,
      "visualConfidence": 0.77,
      "baselineOptimism": 0.34,
      "detectHardness": 0.32,
      "overclaimRisk": 0.25,
      "detectBias": "stigma_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 57.6,
      "contrastScore": 73.52,
      "cnnScore": 88.84,
      "textureIntegrity": 60.51,
      "visualScore": 42.47,
      "confidence": 65.1,
      "cnnContribution": 70.81,
      "visualContribution": 45.13,
      "overall": 70.19
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 24.57,
      "contrastScore": 23.77,
      "cnnScore": 20.46,
      "textureIntegrity": 42.05,
      "visualScore": 42.21,
      "confidence": 33.35,
      "cnnContribution": 30.61,
      "visualContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "sd-023",
    "input": {
      "stigmaClarity": 0.79,
      "adulterantContrast": 0.76,
      "cnnConfidence": 0.77,
      "textureIntegrity": 0.8,
      "visualConfidence": 0.81,
      "baselineOptimism": 0.36,
      "detectHardness": 0.33,
      "overclaimRisk": 0.25,
      "detectBias": "visual_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 49.01,
      "contrastScore": 67.38,
      "cnnScore": 53.71,
      "textureIntegrity": 49.49,
      "visualScore": 45.16,
      "confidence": 69,
      "cnnContribution": 54.84,
      "visualContribution": 47.99,
      "overall": 54.61
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 33.86,
      "contrastScore": 25.2,
      "cnnScore": 21.84,
      "textureIntegrity": 43.92,
      "visualScore": 84.72,
      "confidence": 35.45,
      "cnnContribution": 41.91,
      "visualContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "sd-024",
    "input": {
      "stigmaClarity": 0.75,
      "adulterantContrast": 0.75,
      "cnnConfidence": 0.81,
      "textureIntegrity": 0.76,
      "visualConfidence": 0.77,
      "baselineOptimism": 0.31,
      "detectHardness": 0.25,
      "overclaimRisk": 0.2,
      "detectBias": "balanced",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 71.63,
      "contrastScore": 75.91,
      "cnnScore": 79.08,
      "textureIntegrity": 80.56,
      "visualScore": 43.13,
      "confidence": 66.85,
      "cnnContribution": 76.71,
      "visualContribution": 46.16,
      "overall": 75.21
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 31.21,
      "contrastScore": 23.47,
      "cnnScore": 20.52,
      "textureIntegrity": 41.11,
      "visualScore": 63.65,
      "confidence": 33.9,
      "cnnContribution": 35.99,
      "visualContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "sd-025",
    "input": {
      "stigmaClarity": 0.79,
      "adulterantContrast": 0.79,
      "cnnConfidence": 0.77,
      "textureIntegrity": 0.8,
      "visualConfidence": 0.8,
      "baselineOptimism": 0.33,
      "detectHardness": 0.26,
      "overclaimRisk": 0.21,
      "detectBias": "cnn_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 62.49,
      "contrastScore": 79.52,
      "cnnScore": 54.83,
      "textureIntegrity": 100,
      "visualScore": 45.2,
      "confidence": 70.35,
      "cnnContribution": 72.68,
      "visualContribution": 48.24,
      "overall": 72.28
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 19.5,
      "contrastScore": 24.56,
      "cnnScore": 21.5,
      "textureIntegrity": 42.63,
      "visualScore": 43.52,
      "confidence": 35.55,
      "cnnContribution": 30.34,
      "visualContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "sd-026",
    "input": {
      "stigmaClarity": 0.83,
      "adulterantContrast": 0.83,
      "cnnConfidence": 0.8,
      "textureIntegrity": 0.83,
      "visualConfidence": 0.84,
      "baselineOptimism": 0.34,
      "detectHardness": 0.27,
      "overclaimRisk": 0.22,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 78.48,
      "contrastScore": 83.17,
      "cnnScore": 80.25,
      "textureIntegrity": 87.68,
      "visualScore": 47.68,
      "confidence": 73.75,
      "cnnContribution": 82.13,
      "visualContribution": 50.82,
      "overall": 80.49
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 33.17,
      "contrastScore": 25.61,
      "cnnScore": 22.47,
      "textureIntegrity": 44.32,
      "visualScore": 68.8,
      "confidence": 37.1,
      "cnnContribution": 38.87,
      "visualContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "sd-027",
    "input": {
      "stigmaClarity": 0.87,
      "adulterantContrast": 0.81,
      "cnnConfidence": 0.84,
      "textureIntegrity": 0.87,
      "visualConfidence": 0.88,
      "baselineOptimism": 0.3,
      "detectHardness": 0.27,
      "overclaimRisk": 0.17,
      "detectBias": "stigma_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 67.22,
      "contrastScore": 82.98,
      "cnnScore": 100,
      "textureIntegrity": 68.1,
      "visualScore": 49.35,
      "confidence": 76.35,
      "cnnContribution": 80.37,
      "visualContribution": 52.46,
      "overall": 79.35
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 30.78,
      "contrastScore": 24.64,
      "cnnScore": 21.53,
      "textureIntegrity": 44.62,
      "visualScore": 45.22,
      "confidence": 37.2,
      "cnnContribution": 33.36,
      "visualContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "sd-028",
    "input": {
      "stigmaClarity": 0.83,
      "adulterantContrast": 0.86,
      "cnnConfidence": 0.87,
      "textureIntegrity": 0.83,
      "visualConfidence": 0.84,
      "baselineOptimism": 0.31,
      "detectHardness": 0.2,
      "overclaimRisk": 0.17,
      "detectBias": "visual_first",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 54.91,
      "contrastScore": 75.3,
      "cnnScore": 60.67,
      "textureIntegrity": 53.51,
      "visualScore": 48.34,
      "confidence": 75.1,
      "cnnContribution": 61.11,
      "visualContribution": 51.78,
      "overall": 60.43
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 38.81,
      "contrastScore": 25.31,
      "cnnScore": 22.44,
      "textureIntegrity": 43.48,
      "visualScore": 86.95,
      "confidence": 37.65,
      "cnnContribution": 43.4,
      "visualContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "sd-029",
    "input": {
      "stigmaClarity": 0.87,
      "adulterantContrast": 0.9,
      "cnnConfidence": 0.91,
      "textureIntegrity": 0.87,
      "visualConfidence": 0.87,
      "baselineOptimism": 0.33,
      "detectHardness": 0.2,
      "overclaimRisk": 0.18,
      "detectBias": "balanced",
      "profile": "cnn_adulteration_detection"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 83.93,
      "contrastScore": 88.91,
      "cnnScore": 89.77,
      "textureIntegrity": 92.27,
      "visualScore": 50.59,
      "confidence": 78.6,
      "cnnContribution": 88.6,
      "visualContribution": 54.2,
      "overall": 86.41
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 36.33,
      "contrastScore": 26.66,
      "cnnScore": 23.73,
      "textureIntegrity": 45,
      "visualScore": 71.06,
      "confidence": 39.5,
      "cnnContribution": 40.56,
      "visualContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "sd-030",
    "input": {
      "stigmaClarity": 0.91,
      "adulterantContrast": 0.88,
      "cnnConfidence": 0.87,
      "textureIntegrity": 0.91,
      "visualConfidence": 0.91,
      "baselineOptimism": 0.28,
      "detectHardness": 0.21,
      "overclaimRisk": 0.13,
      "detectBias": "cnn_first",
      "profile": "visual_inspection_baseline"
    },
    "expectedCnn": {
      "mode": "cnn_adulteration_detection",
      "stigmaScore": 71.56,
      "contrastScore": 88.77,
      "cnnScore": 63.21,
      "textureIntegrity": 100,
      "visualScore": 51.88,
      "confidence": 81.35,
      "cnnContribution": 79.61,
      "visualContribution": 55.26,
      "overall": 79.23
    },
    "expectedVisual": {
      "mode": "visual_inspection_baseline",
      "stigmaScore": 25.72,
      "contrastScore": 25,
      "cnnScore": 22.06,
      "textureIntegrity": 45.02,
      "visualScore": 46.21,
      "confidence": 38.95,
      "cnnContribution": 32.8,
      "visualContribution": 50.65,
      "overall": 44.26
    }
  }
];
