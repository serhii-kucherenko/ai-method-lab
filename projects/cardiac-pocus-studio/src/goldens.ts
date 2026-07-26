import type { PocusInput, PocusQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PocusInput;
  expectedCardiac: PocusQuality;
  expectedLung: PocusQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cp-001",
    "input": {
      "cardiacPatternSignal": 0.34,
      "lungBaselineSignal": 0.5,
      "probeQuality": 0.34,
      "viewCompleteness": 0.34,
      "copdAssociation": 0.34,
      "examFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 40.3,
      "lungBaselineScore": 33.95,
      "patternCoverage": 38.53,
      "examEfficiency": 43.72,
      "lungOnlyPenalty": 32.93,
      "confidence": 14.82,
      "cardiacContribution": 45.38,
      "lungContribution": 35.98,
      "overall": 47.69
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.41,
      "lungBaselineScore": 39.66,
      "patternCoverage": 32.11,
      "examEfficiency": 30.44,
      "lungOnlyPenalty": 20.37,
      "confidence": 18.17,
      "cardiacContribution": 41.85,
      "lungContribution": 29.33,
      "overall": 27.38
    }
  },
  {
    "id": "cp-002",
    "input": {
      "cardiacPatternSignal": 0.38,
      "lungBaselineSignal": 0.51,
      "probeQuality": 0.38,
      "viewCompleteness": 0.38,
      "copdAssociation": 0.38,
      "examFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "imagingBias": "pattern_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 49.41,
      "lungBaselineScore": 30.04,
      "patternCoverage": 48.08,
      "examEfficiency": 60.71,
      "lungOnlyPenalty": 31.83,
      "confidence": 17.54,
      "cardiacContribution": 54.9,
      "lungContribution": 40.85,
      "overall": 56.37
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.46,
      "lungBaselineScore": 48.65,
      "patternCoverage": 32.36,
      "examEfficiency": 38.64,
      "lungOnlyPenalty": 18.8,
      "confidence": 20.2,
      "cardiacContribution": 45.26,
      "lungContribution": 33.28,
      "overall": 30.96
    }
  },
  {
    "id": "cp-003",
    "input": {
      "cardiacPatternSignal": 0.42,
      "lungBaselineSignal": 0.46,
      "probeQuality": 0.42,
      "viewCompleteness": 0.42,
      "copdAssociation": 0.42,
      "examFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "imagingBias": "lung_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 19.24,
      "lungBaselineScore": 37.37,
      "patternCoverage": 29.25,
      "examEfficiency": 29.71,
      "lungOnlyPenalty": 54.68,
      "confidence": 21.46,
      "cardiacContribution": 29.04,
      "lungContribution": 28.7,
      "overall": 29.98
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.43,
      "lungBaselineScore": 45.98,
      "patternCoverage": 32.6,
      "examEfficiency": 37.55,
      "lungOnlyPenalty": 16.76,
      "confidence": 21.76,
      "cardiacContribution": 45.16,
      "lungContribution": 32.84,
      "overall": 30.69
    }
  },
  {
    "id": "cp-004",
    "input": {
      "cardiacPatternSignal": 0.38,
      "lungBaselineSignal": 0.46,
      "probeQuality": 0.38,
      "viewCompleteness": 0.38,
      "copdAssociation": 0.38,
      "examFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 45.25,
      "lungBaselineScore": 33.49,
      "patternCoverage": 42.12,
      "examEfficiency": 47.84,
      "lungOnlyPenalty": 31.25,
      "confidence": 18.54,
      "cardiacContribution": 49.17,
      "lungContribution": 37.97,
      "overall": 51.15
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.97,
      "lungBaselineScore": 38.2,
      "patternCoverage": 32.36,
      "examEfficiency": 30.33,
      "lungOnlyPenalty": 18.41,
      "confidence": 19.81,
      "cardiacContribution": 42.09,
      "lungContribution": 29.29,
      "overall": 27.45
    }
  },
  {
    "id": "cp-005",
    "input": {
      "cardiacPatternSignal": 0.42,
      "lungBaselineSignal": 0.47,
      "probeQuality": 0.42,
      "viewCompleteness": 0.42,
      "copdAssociation": 0.42,
      "examFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "imagingBias": "cardiac_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 54.9,
      "lungBaselineScore": 29.13,
      "patternCoverage": 37.25,
      "examEfficiency": 29.47,
      "lungOnlyPenalty": 30.15,
      "confidence": 21.26,
      "cardiacContribution": 47.05,
      "lungContribution": 35.8,
      "overall": 49.02
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.02,
      "lungBaselineScore": 28.23,
      "patternCoverage": 32.6,
      "examEfficiency": 23.79,
      "lungOnlyPenalty": 16.84,
      "confidence": 21.84,
      "cardiacContribution": 36.36,
      "lungContribution": 18.26,
      "overall": 17.32
    }
  },
  {
    "id": "cp-006",
    "input": {
      "cardiacPatternSignal": 0.45,
      "lungBaselineSignal": 0.42,
      "probeQuality": 0.45,
      "viewCompleteness": 0.45,
      "copdAssociation": 0.45,
      "examFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "imagingBias": "balanced",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 53.61,
      "lungBaselineScore": 33.18,
      "patternCoverage": 48.41,
      "examEfficiency": 53.95,
      "lungOnlyPenalty": 28.66,
      "confidence": 24.45,
      "cardiacContribution": 55.42,
      "lungContribution": 41.33,
      "overall": 56.88
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.75,
      "lungBaselineScore": 36.7,
      "patternCoverage": 32.79,
      "examEfficiency": 31.07,
      "lungOnlyPenalty": 15.22,
      "confidence": 22.92,
      "cardiacContribution": 42.62,
      "lungContribution": 29.11,
      "overall": 27.31
    }
  },
  {
    "id": "cp-007",
    "input": {
      "cardiacPatternSignal": 0.49,
      "lungBaselineSignal": 0.43,
      "probeQuality": 0.49,
      "viewCompleteness": 0.49,
      "copdAssociation": 0.49,
      "examFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "imagingBias": "pattern_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 64.21,
      "lungBaselineScore": 28.03,
      "patternCoverage": 59.69,
      "examEfficiency": 74.31,
      "lungOnlyPenalty": 27.56,
      "confidence": 27.17,
      "cardiacContribution": 66.65,
      "lungContribution": 46.96,
      "overall": 67.11
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.8,
      "lungBaselineScore": 44.33,
      "patternCoverage": 33.04,
      "examEfficiency": 38.21,
      "lungOnlyPenalty": 13.65,
      "confidence": 24.95,
      "cardiacContribution": 45.55,
      "lungContribution": 32.38,
      "overall": 30.25
    }
  },
  {
    "id": "cp-008",
    "input": {
      "cardiacPatternSignal": 0.45,
      "lungBaselineSignal": 0.44,
      "probeQuality": 0.45,
      "viewCompleteness": 0.45,
      "copdAssociation": 0.45,
      "examFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "imagingBias": "lung_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 21.39,
      "lungBaselineScore": 37.45,
      "patternCoverage": 31.34,
      "examEfficiency": 31.28,
      "lungOnlyPenalty": 53.53,
      "confidence": 24.05,
      "cardiacContribution": 30.87,
      "lungContribution": 29.5,
      "overall": 31.62
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.44,
      "lungBaselineScore": 44.9,
      "patternCoverage": 32.79,
      "examEfficiency": 37.52,
      "lungOnlyPenalty": 15.37,
      "confidence": 23.07,
      "cardiacContribution": 45.26,
      "lungContribution": 32.61,
      "overall": 30.5
    }
  },
  {
    "id": "cp-009",
    "input": {
      "cardiacPatternSignal": 0.49,
      "lungBaselineSignal": 0.38,
      "probeQuality": 0.49,
      "viewCompleteness": 0.49,
      "copdAssociation": 0.49,
      "examFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "imagingBias": "balanced",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 58.55,
      "lungBaselineScore": 32.72,
      "patternCoverage": 52,
      "examEfficiency": 58.08,
      "lungOnlyPenalty": 26.98,
      "confidence": 28.17,
      "cardiacContribution": 59.22,
      "lungContribution": 43.32,
      "overall": 60.36
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 28.31,
      "lungBaselineScore": 35.24,
      "patternCoverage": 33.04,
      "examEfficiency": 30.96,
      "lungOnlyPenalty": 13.26,
      "confidence": 24.56,
      "cardiacContribution": 42.86,
      "lungContribution": 29.07,
      "overall": 27.37
    }
  },
  {
    "id": "cp-010",
    "input": {
      "cardiacPatternSignal": 0.53,
      "lungBaselineSignal": 0.39,
      "probeQuality": 0.53,
      "viewCompleteness": 0.53,
      "copdAssociation": 0.53,
      "examFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "imagingBias": "cardiac_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 69.71,
      "lungBaselineScore": 27.12,
      "patternCoverage": 44.91,
      "examEfficiency": 35.39,
      "lungOnlyPenalty": 25.88,
      "confidence": 30.89,
      "cardiacContribution": 56.01,
      "lungContribution": 40.38,
      "overall": 57.2
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.36,
      "lungBaselineScore": 27.02,
      "patternCoverage": 33.29,
      "examEfficiency": 25.78,
      "lungOnlyPenalty": 11.69,
      "confidence": 26.59,
      "cardiacContribution": 37.75,
      "lungContribution": 18.93,
      "overall": 18.08
    }
  },
  {
    "id": "cp-011",
    "input": {
      "cardiacPatternSignal": 0.57,
      "lungBaselineSignal": 0.4,
      "probeQuality": 0.57,
      "viewCompleteness": 0.57,
      "copdAssociation": 0.57,
      "examFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 67.48,
      "lungBaselineScore": 33.45,
      "patternCoverage": 59.19,
      "examEfficiency": 62.63,
      "lungOnlyPenalty": 24.79,
      "confidence": 33.61,
      "cardiacContribution": 65.48,
      "lungContribution": 46.91,
      "overall": 66.14
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.41,
      "lungBaselineScore": 35.87,
      "patternCoverage": 33.53,
      "examEfficiency": 33.86,
      "lungOnlyPenalty": 10.12,
      "confidence": 28.62,
      "cardiacContribution": 43.71,
      "lungContribution": 28.66,
      "overall": 26.72
    }
  },
  {
    "id": "cp-012",
    "input": {
      "cardiacPatternSignal": 0.53,
      "lungBaselineSignal": 0.35,
      "probeQuality": 0.53,
      "viewCompleteness": 0.53,
      "copdAssociation": 0.53,
      "examFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "imagingBias": "pattern_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 70.11,
      "lungBaselineScore": 26.46,
      "patternCoverage": 63.9,
      "examEfficiency": 81.66,
      "lungOnlyPenalty": 25.42,
      "confidence": 31.69,
      "cardiacContribution": 71.72,
      "lungContribution": 49.49,
      "overall": 71.72
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.97,
      "lungBaselineScore": 40.08,
      "patternCoverage": 33.29,
      "examEfficiency": 35.79,
      "lungOnlyPenalty": 11.37,
      "confidence": 26.27,
      "cardiacContribution": 45.15,
      "lungContribution": 31.78,
      "overall": 29.97
    }
  },
  {
    "id": "cp-013",
    "input": {
      "cardiacPatternSignal": 0.57,
      "lungBaselineSignal": 0.36,
      "probeQuality": 0.57,
      "viewCompleteness": 0.57,
      "copdAssociation": 0.57,
      "examFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "imagingBias": "lung_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 30.02,
      "lungBaselineScore": 37.78,
      "patternCoverage": 39.69,
      "examEfficiency": 37.56,
      "lungOnlyPenalty": 48.96,
      "confidence": 34.41,
      "cardiacContribution": 38.17,
      "lungContribution": 32.72,
      "overall": 38.19
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.52,
      "lungBaselineScore": 40.57,
      "patternCoverage": 33.53,
      "examEfficiency": 37.38,
      "lungOnlyPenalty": 9.8,
      "confidence": 28.3,
      "cardiacContribution": 45.64,
      "lungContribution": 31.66,
      "overall": 29.73
    }
  },
  {
    "id": "cp-014",
    "input": {
      "cardiacPatternSignal": 0.61,
      "lungBaselineSignal": 0.36,
      "probeQuality": 0.61,
      "viewCompleteness": 0.61,
      "copdAssociation": 0.61,
      "examFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 72.42,
      "lungBaselineScore": 32.99,
      "patternCoverage": 62.78,
      "examEfficiency": 66.75,
      "lungOnlyPenalty": 23.11,
      "confidence": 37.33,
      "cardiacContribution": 69.28,
      "lungContribution": 48.89,
      "overall": 69.61
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.97,
      "lungBaselineScore": 34.41,
      "patternCoverage": 33.78,
      "examEfficiency": 33.75,
      "lungOnlyPenalty": 8.16,
      "confidence": 30.26,
      "cardiacContribution": 43.95,
      "lungContribution": 28.62,
      "overall": 26.78
    }
  },
  {
    "id": "cp-015",
    "input": {
      "cardiacPatternSignal": 0.65,
      "lungBaselineSignal": 0.31,
      "probeQuality": 0.65,
      "viewCompleteness": 0.65,
      "copdAssociation": 0.65,
      "examFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "imagingBias": "cardiac_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 85.78,
      "lungBaselineScore": 25.05,
      "patternCoverage": 53.27,
      "examEfficiency": 41.67,
      "lungOnlyPenalty": 21.31,
      "confidence": 41.25,
      "cardiacContribution": 65.7,
      "lungContribution": 45.36,
      "overall": 66.04
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.44,
      "lungBaselineScore": 25.81,
      "patternCoverage": 34.03,
      "examEfficiency": 28.05,
      "lungOnlyPenalty": 6.12,
      "confidence": 31.82,
      "cardiacContribution": 39.24,
      "lungContribution": 19.56,
      "overall": 18.78
    }
  },
  {
    "id": "cp-016",
    "input": {
      "cardiacPatternSignal": 0.6,
      "lungBaselineSignal": 0.32,
      "probeQuality": 0.6,
      "viewCompleteness": 0.6,
      "copdAssociation": 0.6,
      "examFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 71.67,
      "lungBaselineScore": 32.28,
      "patternCoverage": 61.88,
      "examEfficiency": 67.58,
      "lungOnlyPenalty": 22.94,
      "confidence": 37.4,
      "cardiacContribution": 69,
      "lungContribution": 48.59,
      "overall": 69.33
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.84,
      "lungBaselineScore": 32.99,
      "patternCoverage": 33.72,
      "examEfficiency": 32.22,
      "lungOnlyPenalty": 8.26,
      "confidence": 29.46,
      "cardiacContribution": 43.7,
      "lungContribution": 28.79,
      "overall": 27.15
    }
  },
  {
    "id": "cp-017",
    "input": {
      "cardiacPatternSignal": 0.64,
      "lungBaselineSignal": 0.33,
      "probeQuality": 0.64,
      "viewCompleteness": 0.64,
      "copdAssociation": 0.64,
      "examFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "imagingBias": "pattern_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 84.31,
      "lungBaselineScore": 25.45,
      "patternCoverage": 75.51,
      "examEfficiency": 92.42,
      "lungOnlyPenalty": 21.85,
      "confidence": 40.12,
      "cardiacContribution": 82.52,
      "lungContribution": 55.25,
      "overall": 81.61
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.89,
      "lungBaselineScore": 38.92,
      "patternCoverage": 33.97,
      "examEfficiency": 38.03,
      "lungOnlyPenalty": 6.69,
      "confidence": 31.49,
      "cardiacContribution": 46.02,
      "lungContribution": 31.2,
      "overall": 29.28
    }
  },
  {
    "id": "cp-018",
    "input": {
      "cardiacPatternSignal": 0.68,
      "lungBaselineSignal": 0.27,
      "probeQuality": 0.68,
      "viewCompleteness": 0.68,
      "copdAssociation": 0.68,
      "examFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "imagingBias": "lung_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 38.06,
      "lungBaselineScore": 37.81,
      "patternCoverage": 47.36,
      "examEfficiency": 43.72,
      "lungOnlyPenalty": 44.58,
      "confidence": 44.24,
      "cardiacContribution": 45.03,
      "lungContribution": 35.68,
      "overall": 44.35
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.26,
      "lungBaselineScore": 35.72,
      "patternCoverage": 34.22,
      "examEfficiency": 36.5,
      "lungOnlyPenalty": 4.57,
      "confidence": 32.97,
      "cardiacContribution": 45.83,
      "lungContribution": 30.7,
      "overall": 29.01
    }
  },
  {
    "id": "cp-019",
    "input": {
      "cardiacPatternSignal": 0.72,
      "lungBaselineSignal": 0.28,
      "probeQuality": 0.72,
      "viewCompleteness": 0.72,
      "copdAssociation": 0.72,
      "examFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 85.73,
      "lungBaselineScore": 32.22,
      "patternCoverage": 72.66,
      "examEfficiency": 76.99,
      "lungOnlyPenalty": 18.84,
      "confidence": 46.96,
      "cardiacContribution": 79.33,
      "lungContribution": 54.24,
      "overall": 78.81
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.31,
      "lungBaselineScore": 31.45,
      "patternCoverage": 34.46,
      "examEfficiency": 34.38,
      "lungOnlyPenalty": 3,
      "confidence": 35,
      "cardiacContribution": 44.72,
      "lungContribution": 28.4,
      "overall": 26.71
    }
  },
  {
    "id": "cp-020",
    "input": {
      "cardiacPatternSignal": 0.68,
      "lungBaselineSignal": 0.29,
      "probeQuality": 0.68,
      "viewCompleteness": 0.68,
      "copdAssociation": 0.68,
      "examFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "imagingBias": "cardiac_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 89.8,
      "lungBaselineScore": 24.53,
      "patternCoverage": 55.36,
      "examEfficiency": 43.24,
      "lungOnlyPenalty": 20.17,
      "confidence": 43.84,
      "cardiacContribution": 68.12,
      "lungContribution": 46.6,
      "overall": 68.25
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.45,
      "lungBaselineScore": 25.5,
      "patternCoverage": 34.22,
      "examEfficiency": 28.62,
      "lungOnlyPenalty": 4.73,
      "confidence": 33.13,
      "cardiacContribution": 39.61,
      "lungContribution": 19.71,
      "overall": 18.95
    }
  },
  {
    "id": "cp-021",
    "input": {
      "cardiacPatternSignal": 0.72,
      "lungBaselineSignal": 0.24,
      "probeQuality": 0.72,
      "viewCompleteness": 0.72,
      "copdAssociation": 0.72,
      "examFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "imagingBias": "balanced",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 86.11,
      "lungBaselineScore": 31.56,
      "patternCoverage": 72.66,
      "examEfficiency": 78.48,
      "lungOnlyPenalty": 18.37,
      "confidence": 47.76,
      "cardiacContribution": 79.86,
      "lungContribution": 54.4,
      "overall": 79.28
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.92,
      "lungBaselineScore": 30.02,
      "patternCoverage": 34.46,
      "examEfficiency": 33.13,
      "lungOnlyPenalty": 2.69,
      "confidence": 34.69,
      "cardiacContribution": 44.57,
      "lungContribution": 28.53,
      "overall": 27.02
    }
  },
  {
    "id": "cp-022",
    "input": {
      "cardiacPatternSignal": 0.76,
      "lungBaselineSignal": 0.25,
      "probeQuality": 0.76,
      "viewCompleteness": 0.76,
      "copdAssociation": 0.76,
      "examFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "imagingBias": "pattern_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 100,
      "lungBaselineScore": 23.38,
      "patternCoverage": 88.16,
      "examEfficiency": 100,
      "lungOnlyPenalty": 17.28,
      "confidence": 50.48,
      "cardiacContribution": 93.57,
      "lungContribution": 60.35,
      "overall": 91.59
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.97,
      "lungBaselineScore": 34.59,
      "patternCoverage": 34.71,
      "examEfficiency": 37.89,
      "lungOnlyPenalty": 1.12,
      "confidence": 36.72,
      "cardiacContribution": 46.41,
      "lungContribution": 30.25,
      "overall": 28.51
    }
  },
  {
    "id": "cp-023",
    "input": {
      "cardiacPatternSignal": 0.8,
      "lungBaselineSignal": 0.25,
      "probeQuality": 0.8,
      "viewCompleteness": 0.8,
      "copdAssociation": 0.8,
      "examFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "imagingBias": "lung_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 46.2,
      "lungBaselineScore": 39.13,
      "patternCoverage": 55.71,
      "examEfficiency": 48.57,
      "lungOnlyPenalty": 40.71,
      "confidence": 53.4,
      "cardiacContribution": 51.74,
      "lungContribution": 38.85,
      "overall": 50.42
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 24.92,
      "lungBaselineScore": 34.55,
      "patternCoverage": 34.96,
      "examEfficiency": 39.03,
      "lungOnlyPenalty": 0,
      "confidence": 38.67,
      "cardiacContribution": 46.69,
      "lungContribution": 30.08,
      "overall": 28.23
    }
  },
  {
    "id": "cp-024",
    "input": {
      "cardiacPatternSignal": 0.76,
      "lungBaselineSignal": 0.2,
      "probeQuality": 0.76,
      "viewCompleteness": 0.76,
      "copdAssociation": 0.76,
      "examFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "imagingBias": "balanced",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 91.06,
      "lungBaselineScore": 31.1,
      "patternCoverage": 76.25,
      "examEfficiency": 82.6,
      "lungOnlyPenalty": 16.69,
      "confidence": 51.48,
      "cardiacContribution": 83.66,
      "lungContribution": 56.38,
      "overall": 82.75
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 28.48,
      "lungBaselineScore": 28.56,
      "patternCoverage": 34.71,
      "examEfficiency": 33.02,
      "lungOnlyPenalty": 0.73,
      "confidence": 36.33,
      "cardiacContribution": 44.81,
      "lungContribution": 28.49,
      "overall": 27.08
    }
  },
  {
    "id": "cp-025",
    "input": {
      "cardiacPatternSignal": 0.8,
      "lungBaselineSignal": 0.21,
      "probeQuality": 0.8,
      "viewCompleteness": 0.8,
      "copdAssociation": 0.8,
      "examFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "imagingBias": "cardiac_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 100,
      "lungBaselineScore": 22.47,
      "patternCoverage": 63.71,
      "examEfficiency": 49.53,
      "lungOnlyPenalty": 15.6,
      "confidence": 54.2,
      "cardiacContribution": 75.93,
      "lungContribution": 49.53,
      "overall": 75.18
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.53,
      "lungBaselineScore": 24.28,
      "patternCoverage": 34.96,
      "examEfficiency": 30.9,
      "lungOnlyPenalty": 0,
      "confidence": 38.36,
      "cardiacContribution": 40.93,
      "lungContribution": 20.34,
      "overall": 19.61
    }
  },
  {
    "id": "cp-026",
    "input": {
      "cardiacPatternSignal": 0.83,
      "lungBaselineSignal": 0.22,
      "probeQuality": 0.83,
      "viewCompleteness": 0.83,
      "copdAssociation": 0.83,
      "examFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 98.84,
      "lungBaselineScore": 31.78,
      "patternCoverage": 82.53,
      "examEfficiency": 86.49,
      "lungOnlyPenalty": 14.81,
      "confidence": 56.19,
      "cardiacContribution": 89.1,
      "lungContribution": 59.52,
      "overall": 87.78
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 25.84,
      "lungBaselineScore": 29.2,
      "patternCoverage": 35.15,
      "examEfficiency": 35.64,
      "lungOnlyPenalty": 0,
      "confidence": 39.9,
      "cardiacContribution": 45.17,
      "lungContribution": 28.12,
      "overall": 26.4
    }
  },
  {
    "id": "cp-027",
    "input": {
      "cardiacPatternSignal": 0.87,
      "lungBaselineSignal": 0.17,
      "probeQuality": 0.87,
      "viewCompleteness": 0.87,
      "copdAssociation": 0.87,
      "examFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "imagingBias": "pattern_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 100,
      "lungBaselineScore": 21.37,
      "patternCoverage": 99.77,
      "examEfficiency": 100,
      "lungOnlyPenalty": 13.01,
      "confidence": 60.11,
      "cardiacContribution": 97.59,
      "lungContribution": 58.56,
      "overall": 94.56
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.31,
      "lungBaselineScore": 30.27,
      "patternCoverage": 35.39,
      "examEfficiency": 37.47,
      "lungOnlyPenalty": 0,
      "confidence": 41.46,
      "cardiacContribution": 45.89,
      "lungContribution": 29.35,
      "overall": 27.62
    }
  },
  {
    "id": "cp-028",
    "input": {
      "cardiacPatternSignal": 0.83,
      "lungBaselineSignal": 0.17,
      "probeQuality": 0.83,
      "viewCompleteness": 0.83,
      "copdAssociation": 0.83,
      "examFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "imagingBias": "lung_first",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 48.85,
      "lungBaselineScore": 38.22,
      "patternCoverage": 57.8,
      "examEfficiency": 51.58,
      "lungOnlyPenalty": 38.86,
      "confidence": 57.19,
      "cardiacContribution": 54.17,
      "lungContribution": 39.7,
      "overall": 52.57
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 27.35,
      "lungBaselineScore": 30.31,
      "patternCoverage": 35.15,
      "examEfficiency": 36.33,
      "lungOnlyPenalty": 0,
      "confidence": 39.51,
      "cardiacContribution": 45.83,
      "lungContribution": 29.52,
      "overall": 27.94
    }
  },
  {
    "id": "cp-029",
    "input": {
      "cardiacPatternSignal": 0.87,
      "lungBaselineSignal": 0.18,
      "probeQuality": 0.87,
      "viewCompleteness": 0.87,
      "copdAssociation": 0.87,
      "examFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "imagingBias": "balanced",
      "profile": "cardiac_pocus_copd"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 100,
      "lungBaselineScore": 31.32,
      "patternCoverage": 86.13,
      "examEfficiency": 90.62,
      "lungOnlyPenalty": 13.13,
      "confidence": 59.91,
      "cardiacContribution": 91.69,
      "lungContribution": 60.18,
      "overall": 90.02
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 26.4,
      "lungBaselineScore": 27.74,
      "patternCoverage": 35.39,
      "examEfficiency": 35.53,
      "lungOnlyPenalty": 0,
      "confidence": 41.54,
      "cardiacContribution": 45.01,
      "lungContribution": 28.08,
      "overall": 26.37
    }
  },
  {
    "id": "cp-030",
    "input": {
      "cardiacPatternSignal": 0.91,
      "lungBaselineSignal": 0.13,
      "probeQuality": 0.91,
      "viewCompleteness": 0.91,
      "copdAssociation": 0.91,
      "examFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "imagingBias": "cardiac_first",
      "profile": "lung_ultrasound_baseline"
    },
    "expectedCardiac": {
      "mode": "cardiac_pocus_copd",
      "cardiacDetectionScore": 100,
      "lungBaselineScore": 20.46,
      "patternCoverage": 71.37,
      "examEfficiency": 55.45,
      "lungOnlyPenalty": 11.33,
      "confidence": 63.83,
      "cardiacContribution": 80.14,
      "lungContribution": 48.92,
      "overall": 78.52
    },
    "expectedLung": {
      "mode": "lung_ultrasound_baseline",
      "cardiacDetectionScore": 14.87,
      "lungBaselineScore": 23.07,
      "patternCoverage": 35.64,
      "examEfficiency": 32.89,
      "lungOnlyPenalty": 0,
      "confidence": 43.1,
      "cardiacContribution": 41.29,
      "lungContribution": 21.01,
      "overall": 20.14
    }
  }
];
