import type { EmbedInput, EmbedQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EmbedInput;
  expectedMultiSignal: EmbedQuality;
  expectedVisionOnly: EmbedQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "patchMorphology": 0.16,
      "textureEntropy": 0.19,
      "stainQuality": 0.25,
      "languageAlign": 0.09,
      "conceptMatch": 0.07,
      "slideContext": 0.13,
      "tissueHeterogeneity": 0.16,
      "milAggregator": 10.5,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 16.47,
      "languageScore": 12.24,
      "slideScore": 14.07,
      "predictedTaskFit": "roi",
      "confidence": 5.4,
      "visionContribution": 18.05,
      "languageContribution": 7.76,
      "slideContribution": 11.61,
      "overall": 13.35
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 18.72,
      "languageScore": 10.07,
      "slideScore": 9.9,
      "predictedTaskFit": "roi",
      "confidence": 10.65,
      "visionContribution": 19,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 14.97
    }
  },
  {
    "id": "std-002",
    "input": {
      "patchMorphology": 0.2,
      "textureEntropy": 0.23,
      "stainQuality": 0.3,
      "languageAlign": 0.13,
      "conceptMatch": 0.11,
      "slideContext": 0.17,
      "tissueHeterogeneity": 0.22,
      "milAggregator": 15.76,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 22.59,
      "languageScore": 17.94,
      "slideScore": 20.47,
      "predictedTaskFit": "roi",
      "confidence": 10.12,
      "visionContribution": 24.4,
      "languageContribution": 14.04,
      "slideContribution": 19.89,
      "overall": 19.25
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 22.85,
      "languageScore": 12.27,
      "slideScore": 12.4,
      "predictedTaskFit": "roi",
      "confidence": 12.45,
      "visionContribution": 23.24,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 18.13
    }
  },
  {
    "id": "std-003",
    "input": {
      "patchMorphology": 0.25,
      "textureEntropy": 0.28,
      "stainQuality": 0.26,
      "languageAlign": 0.17,
      "conceptMatch": 0.16,
      "slideContext": 0.22,
      "tissueHeterogeneity": 0.27,
      "milAggregator": 21.02,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 24.55,
      "languageScore": 21.14,
      "slideScore": 23.99,
      "predictedTaskFit": "roi",
      "confidence": 3.56,
      "visionContribution": 24.78,
      "languageContribution": 15.23,
      "slideContribution": 20.37,
      "overall": 21.16
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 25.03,
      "languageScore": 14.17,
      "slideScore": 14.19,
      "predictedTaskFit": "roi",
      "confidence": 12.84,
      "visionContribution": 26.08,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 19.81
    }
  },
  {
    "id": "std-004",
    "input": {
      "patchMorphology": 0.29,
      "textureEntropy": 0.22,
      "stainQuality": 0.32,
      "languageAlign": 0.21,
      "conceptMatch": 0.2,
      "slideContext": 0.26,
      "tissueHeterogeneity": 0.2,
      "milAggregator": 26.28,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 28.86,
      "languageScore": 26.12,
      "slideScore": 28.26,
      "predictedTaskFit": "roi",
      "confidence": 8.6,
      "visionContribution": 29.15,
      "languageContribution": 23.34,
      "slideContribution": 26.83,
      "overall": 25.76
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 26.99,
      "languageScore": 13.68,
      "slideScore": 14.06,
      "predictedTaskFit": "roi",
      "confidence": 14.93,
      "visionContribution": 27.76,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 21.31
    }
  },
  {
    "id": "std-005",
    "input": {
      "patchMorphology": 0.24,
      "textureEntropy": 0.26,
      "stainQuality": 0.37,
      "languageAlign": 0.25,
      "conceptMatch": 0.25,
      "slideContext": 0.2,
      "tissueHeterogeneity": 0.25,
      "milAggregator": 31.53,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 27.69,
      "languageScore": 26.63,
      "slideScore": 27.52,
      "predictedTaskFit": "roi",
      "confidence": 3.17,
      "visionContribution": 26.3,
      "languageContribution": 21.98,
      "slideContribution": 21.47,
      "overall": 24.84
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 27.32,
      "languageScore": 14.37,
      "slideScore": 14.63,
      "predictedTaskFit": "roi",
      "confidence": 14.69,
      "visionContribution": 27.68,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 21.57
    }
  },
  {
    "id": "std-006",
    "input": {
      "patchMorphology": 0.28,
      "textureEntropy": 0.31,
      "stainQuality": 0.33,
      "languageAlign": 0.29,
      "conceptMatch": 0.17,
      "slideContext": 0.25,
      "tissueHeterogeneity": 0.3,
      "milAggregator": 21.79,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 31.2,
      "languageScore": 28.58,
      "slideScore": 29.8,
      "predictedTaskFit": "roi",
      "confidence": 9.4,
      "visionContribution": 31.54,
      "languageContribution": 26.63,
      "slideContribution": 28.12,
      "overall": 27.79
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 29.08,
      "languageScore": 16.09,
      "slideScore": 16.22,
      "predictedTaskFit": "roi",
      "confidence": 14.86,
      "visionContribution": 30.04,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 22.93
    }
  },
  {
    "id": "std-007",
    "input": {
      "patchMorphology": 0.32,
      "textureEntropy": 0.35,
      "stainQuality": 0.38,
      "languageAlign": 0.22,
      "conceptMatch": 0.21,
      "slideContext": 0.29,
      "tissueHeterogeneity": 0.35,
      "milAggregator": 27.05,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 32.31,
      "languageScore": 27.58,
      "slideScore": 31.27,
      "predictedTaskFit": "roi",
      "confidence": 4.04,
      "visionContribution": 32.57,
      "languageContribution": 19.78,
      "slideContribution": 26.55,
      "overall": 27.63
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 33.21,
      "languageScore": 18.3,
      "slideScore": 18.6,
      "predictedTaskFit": "roi",
      "confidence": 16.61,
      "visionContribution": 34.28,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 26.08
    }
  },
  {
    "id": "std-008",
    "input": {
      "patchMorphology": 0.37,
      "textureEntropy": 0.3,
      "stainQuality": 0.44,
      "languageAlign": 0.26,
      "conceptMatch": 0.26,
      "slideContext": 0.33,
      "tissueHeterogeneity": 0.28,
      "milAggregator": 32.31,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 37.75,
      "languageScore": 33.58,
      "slideScore": 36.35,
      "predictedTaskFit": "roi",
      "confidence": 9.4,
      "visionContribution": 38.56,
      "languageContribution": 29.52,
      "slideContribution": 34.56,
      "overall": 33.16
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 35.83,
      "languageScore": 18.25,
      "slideScore": 18.78,
      "predictedTaskFit": "roi",
      "confidence": 19.05,
      "visionContribution": 36.72,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 28.12
    }
  },
  {
    "id": "std-009",
    "input": {
      "patchMorphology": 0.41,
      "textureEntropy": 0.34,
      "stainQuality": 0.4,
      "languageAlign": 0.3,
      "conceptMatch": 0.3,
      "slideContext": 0.38,
      "tissueHeterogeneity": 0.33,
      "milAggregator": 37.57,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 38.12,
      "languageScore": 35.2,
      "slideScore": 38.54,
      "predictedTaskFit": "wsi",
      "confidence": 3.42,
      "visionContribution": 36.86,
      "languageContribution": 27.25,
      "slideContribution": 32.11,
      "overall": 33.76
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 37.34,
      "languageScore": 19.7,
      "slideScore": 20.26,
      "predictedTaskFit": "roi",
      "confidence": 19.08,
      "visionContribution": 38.8,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 29.25
    }
  },
  {
    "id": "std-010",
    "input": {
      "patchMorphology": 0.36,
      "textureEntropy": 0.38,
      "stainQuality": 0.45,
      "languageAlign": 0.34,
      "conceptMatch": 0.35,
      "slideContext": 0.32,
      "tissueHeterogeneity": 0.38,
      "milAggregator": 42.83,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 41.97,
      "languageScore": 40.39,
      "slideScore": 42.65,
      "predictedTaskFit": "wsi",
      "confidence": 8.68,
      "visionContribution": 40.66,
      "languageContribution": 37.92,
      "slideContribution": 40.15,
      "overall": 38.27
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 37.67,
      "languageScore": 20.39,
      "slideScore": 20.82,
      "predictedTaskFit": "roi",
      "confidence": 18.85,
      "visionContribution": 38.72,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 29.51
    }
  },
  {
    "id": "std-011",
    "input": {
      "patchMorphology": 0.4,
      "textureEntropy": 0.43,
      "stainQuality": 0.5,
      "languageAlign": 0.38,
      "conceptMatch": 0.39,
      "slideContext": 0.36,
      "tissueHeterogeneity": 0.43,
      "milAggregator": 48.09,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 43.61,
      "languageScore": 41.99,
      "slideScore": 44.6,
      "predictedTaskFit": "wsi",
      "confidence": 3.99,
      "visionContribution": 41.08,
      "languageContribution": 34,
      "slideContribution": 36.17,
      "overall": 39.33
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 42.05,
      "languageScore": 22.87,
      "slideScore": 23.32,
      "predictedTaskFit": "roi",
      "confidence": 20.73,
      "visionContribution": 43.24,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 32.88
    }
  },
  {
    "id": "std-012",
    "input": {
      "patchMorphology": 0.45,
      "textureEntropy": 0.37,
      "stainQuality": 0.47,
      "languageAlign": 0.42,
      "conceptMatch": 0.32,
      "slideContext": 0.41,
      "tissueHeterogeneity": 0.36,
      "milAggregator": 38.34,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 46.19,
      "languageScore": 44.15,
      "slideScore": 45.62,
      "predictedTaskFit": "roi",
      "confidence": 8.57,
      "visionContribution": 45.4,
      "languageContribution": 42.11,
      "slideContribution": 42.8,
      "overall": 41.6
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 41.81,
      "languageScore": 21.79,
      "slideScore": 22.48,
      "predictedTaskFit": "roi",
      "confidence": 21.33,
      "visionContribution": 43.24,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 32.69
    }
  },
  {
    "id": "std-013",
    "input": {
      "patchMorphology": 0.49,
      "textureEntropy": 0.42,
      "stainQuality": 0.52,
      "languageAlign": 0.46,
      "conceptMatch": 0.36,
      "slideContext": 0.45,
      "tissueHeterogeneity": 0.41,
      "milAggregator": 43.6,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 47.53,
      "languageScore": 45.45,
      "slideScore": 47.33,
      "predictedTaskFit": "roi",
      "confidence": 3.2,
      "visionContribution": 45.37,
      "languageContribution": 37.37,
      "slideContribution": 38.29,
      "overall": 42.34
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 46.19,
      "languageScore": 24.28,
      "slideScore": 24.98,
      "predictedTaskFit": "roi",
      "confidence": 23.21,
      "visionContribution": 47.76,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 36.06
    }
  },
  {
    "id": "std-014",
    "input": {
      "patchMorphology": 0.53,
      "textureEntropy": 0.46,
      "stainQuality": 0.57,
      "languageAlign": 0.4,
      "conceptMatch": 0.4,
      "slideContext": 0.49,
      "tissueHeterogeneity": 0.46,
      "milAggregator": 48.86,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 54.85,
      "languageScore": 50.36,
      "slideScore": 54.76,
      "predictedTaskFit": "roi",
      "confidence": 8.09,
      "visionContribution": 54.6,
      "languageContribution": 45.07,
      "slideContribution": 52.94,
      "overall": 48.63
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 50.32,
      "languageScore": 26.48,
      "slideScore": 27.36,
      "predictedTaskFit": "roi",
      "confidence": 24.96,
      "visionContribution": 52,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 39.21
    }
  },
  {
    "id": "std-015",
    "input": {
      "patchMorphology": 0.48,
      "textureEntropy": 0.5,
      "stainQuality": 0.53,
      "languageAlign": 0.44,
      "conceptMatch": 0.45,
      "slideContext": 0.44,
      "tissueHeterogeneity": 0.51,
      "milAggregator": 54.12,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 50.4,
      "languageScore": 48.78,
      "slideScore": 52.08,
      "predictedTaskFit": "wsi",
      "confidence": 4.68,
      "visionContribution": 47.27,
      "languageContribution": 39.44,
      "slideContribution": 42.76,
      "overall": 45.68
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 48.03,
      "languageScore": 26.42,
      "slideScore": 27.02,
      "predictedTaskFit": "roi",
      "confidence": 23.01,
      "visionContribution": 49.76,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 37.45
    }
  },
  {
    "id": "std-016",
    "input": {
      "patchMorphology": 0.52,
      "textureEntropy": 0.45,
      "stainQuality": 0.59,
      "languageAlign": 0.48,
      "conceptMatch": 0.49,
      "slideContext": 0.48,
      "tissueHeterogeneity": 0.45,
      "milAggregator": 59.38,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 56.93,
      "languageScore": 55.96,
      "slideScore": 58.62,
      "predictedTaskFit": "wsi",
      "confidence": 9.69,
      "visionContribution": 54.31,
      "languageContribution": 53.47,
      "slideContribution": 55.13,
      "overall": 52.28
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 50.23,
      "languageScore": 26.2,
      "slideScore": 27.12,
      "predictedTaskFit": "roi",
      "confidence": 25.11,
      "visionContribution": 51.72,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 39.14
    }
  },
  {
    "id": "std-017",
    "input": {
      "patchMorphology": 0.57,
      "textureEntropy": 0.49,
      "stainQuality": 0.64,
      "languageAlign": 0.52,
      "conceptMatch": 0.54,
      "slideContext": 0.53,
      "tissueHeterogeneity": 0.5,
      "milAggregator": 64.64,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 57.82,
      "languageScore": 56.92,
      "slideScore": 59.91,
      "predictedTaskFit": "wsi",
      "confidence": 5.09,
      "visionContribution": 53.62,
      "languageContribution": 46.91,
      "slideContribution": 48.56,
      "overall": 52.74
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 54.79,
      "languageScore": 28.57,
      "slideScore": 29.7,
      "predictedTaskFit": "roi",
      "confidence": 27.09,
      "visionContribution": 56.44,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 42.62
    }
  },
  {
    "id": "std-018",
    "input": {
      "patchMorphology": 0.61,
      "textureEntropy": 0.53,
      "stainQuality": 0.6,
      "languageAlign": 0.56,
      "conceptMatch": 0.46,
      "slideContext": 0.57,
      "tissueHeterogeneity": 0.55,
      "milAggregator": 54.9,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 63.37,
      "languageScore": 60.98,
      "slideScore": 64.22,
      "predictedTaskFit": "wsi",
      "confidence": 8.85,
      "visionContribution": 61.45,
      "languageContribution": 57.66,
      "slideContribution": 61.48,
      "overall": 57.31
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 56.3,
      "languageScore": 30.02,
      "slideScore": 31.18,
      "predictedTaskFit": "roi",
      "confidence": 27.12,
      "visionContribution": 58.52,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 43.75
    }
  },
  {
    "id": "std-019",
    "input": {
      "patchMorphology": 0.65,
      "textureEntropy": 0.58,
      "stainQuality": 0.65,
      "languageAlign": 0.6,
      "conceptMatch": 0.5,
      "slideContext": 0.61,
      "tissueHeterogeneity": 0.6,
      "milAggregator": 60.16,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 63.48,
      "languageScore": 61.1,
      "slideScore": 64.65,
      "predictedTaskFit": "wsi",
      "confidence": 4.17,
      "visionContribution": 59.89,
      "languageContribution": 49.86,
      "slideContribution": 53.24,
      "overall": 57.02
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 60.68,
      "languageScore": 32.5,
      "slideScore": 33.68,
      "predictedTaskFit": "roi",
      "confidence": 29,
      "visionContribution": 63.04,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 47.12
    }
  },
  {
    "id": "std-020",
    "input": {
      "patchMorphology": 0.6,
      "textureEntropy": 0.52,
      "stainQuality": 0.71,
      "languageAlign": 0.64,
      "conceptMatch": 0.55,
      "slideContext": 0.56,
      "tissueHeterogeneity": 0.53,
      "milAggregator": 65.41,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 67.01,
      "languageScore": 67.04,
      "slideScore": 68.32,
      "predictedTaskFit": "wsi",
      "confidence": 9.28,
      "visionContribution": 63.42,
      "languageContribution": 66.06,
      "slideContribution": 63.37,
      "overall": 61.56
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 58.83,
      "languageScore": 30.5,
      "slideScore": 31.73,
      "predictedTaskFit": "roi",
      "confidence": 29.1,
      "visionContribution": 60.4,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 45.73
    }
  },
  {
    "id": "std-021",
    "input": {
      "patchMorphology": 0.64,
      "textureEntropy": 0.57,
      "stainQuality": 0.67,
      "languageAlign": 0.57,
      "conceptMatch": 0.59,
      "slideContext": 0.6,
      "tissueHeterogeneity": 0.58,
      "milAggregator": 70.67,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 64.19,
      "languageScore": 62.95,
      "slideScore": 66.86,
      "predictedTaskFit": "wsi",
      "confidence": 5.67,
      "visionContribution": 59.62,
      "languageContribution": 51.46,
      "slideContribution": 54.75,
      "overall": 58.56
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 60.59,
      "languageScore": 32.23,
      "slideScore": 33.32,
      "predictedTaskFit": "roi",
      "confidence": 29.27,
      "visionContribution": 62.76,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 47.09
    }
  },
  {
    "id": "std-022",
    "input": {
      "patchMorphology": 0.69,
      "textureEntropy": 0.61,
      "stainQuality": 0.72,
      "languageAlign": 0.61,
      "conceptMatch": 0.64,
      "slideContext": 0.64,
      "tissueHeterogeneity": 0.63,
      "milAggregator": 75.93,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 74.3,
      "languageScore": 72.87,
      "slideScore": 77.12,
      "predictedTaskFit": "wsi",
      "confidence": 10.82,
      "visionContribution": 70.85,
      "languageContribution": 68.95,
      "slideContribution": 73.5,
      "overall": 68.14
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 65.14,
      "languageScore": 34.6,
      "slideScore": 35.9,
      "predictedTaskFit": "roi",
      "confidence": 31.24,
      "visionContribution": 67.48,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 50.56
    }
  },
  {
    "id": "std-023",
    "input": {
      "patchMorphology": 0.73,
      "textureEntropy": 0.65,
      "stainQuality": 0.77,
      "languageAlign": 0.65,
      "conceptMatch": 0.68,
      "slideContext": 0.69,
      "tissueHeterogeneity": 0.68,
      "milAggregator": 81.19,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 73.59,
      "languageScore": 72.21,
      "slideScore": 76.94,
      "predictedTaskFit": "wsi",
      "confidence": 6.35,
      "visionContribution": 68.13,
      "languageContribution": 58.93,
      "slideContribution": 63.26,
      "overall": 67.2
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 69.27,
      "languageScore": 36.8,
      "slideScore": 38.28,
      "predictedTaskFit": "roi",
      "confidence": 32.99,
      "visionContribution": 71.72,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 53.71
    }
  },
  {
    "id": "std-024",
    "input": {
      "patchMorphology": 0.78,
      "textureEntropy": 0.6,
      "stainQuality": 0.74,
      "languageAlign": 0.69,
      "conceptMatch": 0.61,
      "slideContext": 0.73,
      "tissueHeterogeneity": 0.61,
      "milAggregator": 71.45,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 78.53,
      "languageScore": 76.63,
      "slideScore": 80.09,
      "predictedTaskFit": "wsi",
      "confidence": 9.56,
      "visionContribution": 75.6,
      "languageContribution": 73.14,
      "slideContribution": 76.16,
      "overall": 71.36
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 69.28,
      "languageScore": 36,
      "slideScore": 37.56,
      "predictedTaskFit": "roi",
      "confidence": 33.72,
      "visionContribution": 72,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 53.73
    }
  },
  {
    "id": "std-025",
    "input": {
      "patchMorphology": 0.72,
      "textureEntropy": 0.64,
      "stainQuality": 0.79,
      "languageAlign": 0.73,
      "conceptMatch": 0.65,
      "slideContext": 0.67,
      "tissueHeterogeneity": 0.66,
      "milAggregator": 76.71,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 73.45,
      "languageScore": 73.15,
      "slideScore": 75.6,
      "predictedTaskFit": "wsi",
      "confidence": 5.15,
      "visionContribution": 67.87,
      "languageContribution": 61.58,
      "slideContribution": 60.94,
      "overall": 67.03
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 69.19,
      "languageScore": 36.52,
      "slideScore": 37.92,
      "predictedTaskFit": "roi",
      "confidence": 33.27,
      "visionContribution": 71.44,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 53.68
    }
  },
  {
    "id": "std-026",
    "input": {
      "patchMorphology": 0.76,
      "textureEntropy": 0.69,
      "stainQuality": 0.84,
      "languageAlign": 0.77,
      "conceptMatch": 0.69,
      "slideContext": 0.72,
      "tissueHeterogeneity": 0.71,
      "milAggregator": 81.97,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 84.17,
      "languageScore": 83.55,
      "slideScore": 86.67,
      "predictedTaskFit": "wsi",
      "confidence": 10.5,
      "visionContribution": 79.76,
      "languageContribution": 81.02,
      "slideContribution": 81.74,
      "overall": 77.19
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 73.56,
      "languageScore": 39.01,
      "slideScore": 40.42,
      "predictedTaskFit": "roi",
      "confidence": 35.14,
      "visionContribution": 75.96,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 57.05
    }
  },
  {
    "id": "std-027",
    "input": {
      "patchMorphology": 0.81,
      "textureEntropy": 0.73,
      "stainQuality": 0.8,
      "languageAlign": 0.81,
      "conceptMatch": 0.74,
      "slideContext": 0.76,
      "tissueHeterogeneity": 0.76,
      "milAggregator": 87.22,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 81.46,
      "languageScore": 82,
      "slideScore": 85.34,
      "predictedTaskFit": "wsi",
      "confidence": 6.34,
      "visionContribution": 74.59,
      "languageContribution": 69.05,
      "slideContribution": 69.45,
      "overall": 75.06
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 75.5,
      "languageScore": 40.62,
      "slideScore": 42.1,
      "predictedTaskFit": "roi",
      "confidence": 35.4,
      "visionContribution": 78.52,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 58.5
    }
  },
  {
    "id": "std-028",
    "input": {
      "patchMorphology": 0.85,
      "textureEntropy": 0.67,
      "stainQuality": 0.86,
      "languageAlign": 0.75,
      "conceptMatch": 0.78,
      "slideContext": 0.8,
      "tissueHeterogeneity": 0.69,
      "milAggregator": 92.48,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 89.02,
      "languageScore": 88.31,
      "slideScore": 92.86,
      "predictedTaskFit": "wsi",
      "confidence": 11.84,
      "visionContribution": 84.21,
      "languageContribution": 84.49,
      "slideContribution": 88.18,
      "overall": 81.98
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 77.46,
      "languageScore": 40.13,
      "slideScore": 41.96,
      "predictedTaskFit": "roi",
      "confidence": 37.5,
      "visionContribution": 80.2,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 60
    }
  },
  {
    "id": "std-029",
    "input": {
      "patchMorphology": 0.9,
      "textureEntropy": 0.72,
      "stainQuality": 0.91,
      "languageAlign": 0.79,
      "conceptMatch": 0.83,
      "slideContext": 0.85,
      "tissueHeterogeneity": 0.74,
      "milAggregator": 97.74,
      "profile": "fast"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 87.77,
      "languageScore": 87.07,
      "slideScore": 91.86,
      "predictedTaskFit": "wsi",
      "confidence": 7.09,
      "visionContribution": 80.94,
      "languageContribution": 71.84,
      "slideContribution": 75,
      "overall": 80.45
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 82.26,
      "languageScore": 42.78,
      "slideScore": 44.66,
      "predictedTaskFit": "roi",
      "confidence": 39.6,
      "visionContribution": 85.2,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 63.7
    }
  },
  {
    "id": "std-030",
    "input": {
      "patchMorphology": 0.84,
      "textureEntropy": 0.76,
      "stainQuality": 0.87,
      "languageAlign": 0.83,
      "conceptMatch": 0.75,
      "slideContext": 0.79,
      "tissueHeterogeneity": 0.8,
      "milAggregator": 88,
      "profile": "full"
    },
    "expectedMultiSignal": {
      "mode": "multi_signal",
      "visionScore": 91.44,
      "languageScore": 90.82,
      "slideScore": 94.59,
      "predictedTaskFit": "wsi",
      "confidence": 11.15,
      "visionContribution": 86.6,
      "languageContribution": 87.79,
      "slideContribution": 89.78,
      "overall": 83.96
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "visionScore": 79.54,
      "languageScore": 42.55,
      "slideScore": 44.24,
      "predictedTaskFit": "roi",
      "confidence": 37.3,
      "visionContribution": 82.48,
      "languageContribution": 0,
      "slideContribution": 0,
      "overall": 61.58
    }
  }
];
