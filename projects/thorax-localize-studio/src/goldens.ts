import type { ThoraxInput, ThoraxQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ThoraxInput;
  expectedClassifyLocalize: ThoraxQuality;
  expectedClassifyOnly: ThoraxQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tls-001",
    "input": {
      "imageQuality": 0.19,
      "viewClarity": 0.16,
      "diseaseSignal": 0.22,
      "localizationCoverage": 0.16,
      "mapPeakStrength": 0.19,
      "mapCoherence": 0.19,
      "findingRichness": 0.19,
      "lesionBoundaryClarity": 0.18,
      "validationConfidence": 0.2,
      "noiseLevel": 0.63,
      "examKind": "lateral",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 29.79,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 24.42,
      "planCoherence": 0,
      "overall": 9.87
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 24.11,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 24.6,
      "planCoherence": 0,
      "overall": 14.12
    }
  },
  {
    "id": "tls-002",
    "input": {
      "imageQuality": 0.23,
      "viewClarity": 0.2,
      "diseaseSignal": 0.26,
      "localizationCoverage": 0.2,
      "mapPeakStrength": 0.23,
      "mapCoherence": 0.23,
      "findingRichness": 0.23,
      "lesionBoundaryClarity": 0.22,
      "validationConfidence": 0.23,
      "noiseLevel": 0.63,
      "examKind": "ap",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 32.3,
      "localizationIntegrity": 0,
      "mapConfidence": 1.86,
      "findingCompleteness": 27.05,
      "planCoherence": 0,
      "overall": 11.2
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 25.61,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 26.05,
      "planCoherence": 0,
      "overall": 14.98
    }
  },
  {
    "id": "tls-003",
    "input": {
      "imageQuality": 0.28,
      "viewClarity": 0.24,
      "diseaseSignal": 0.24,
      "localizationCoverage": 0.24,
      "mapPeakStrength": 0.28,
      "mapCoherence": 0.28,
      "findingRichness": 0.28,
      "lesionBoundaryClarity": 0.21,
      "validationConfidence": 0.27,
      "noiseLevel": 0.57,
      "examKind": "portable",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 38.9,
      "localizationIntegrity": 44.79,
      "mapConfidence": 44.74,
      "findingCompleteness": 33.94,
      "planCoherence": 45.5,
      "overall": 41.99
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 27.02,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 27,
      "planCoherence": 0,
      "overall": 15.67
    }
  },
  {
    "id": "tls-004",
    "input": {
      "imageQuality": 0.24,
      "viewClarity": 0.28,
      "diseaseSignal": 0.29,
      "localizationCoverage": 0.28,
      "mapPeakStrength": 0.24,
      "mapCoherence": 0.24,
      "findingRichness": 0.24,
      "lesionBoundaryClarity": 0.25,
      "validationConfidence": 0.31,
      "noiseLevel": 0.57,
      "examKind": "mixed",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 36.03,
      "localizationIntegrity": 5.53,
      "mapConfidence": 5.7,
      "findingCompleteness": 30.04,
      "planCoherence": 0,
      "overall": 14.59
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 26.54,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 26.35,
      "planCoherence": 0,
      "overall": 15.34
    }
  },
  {
    "id": "tls-005",
    "input": {
      "imageQuality": 0.29,
      "viewClarity": 0.25,
      "diseaseSignal": 0.33,
      "localizationCoverage": 0.25,
      "mapPeakStrength": 0.28,
      "mapCoherence": 0.28,
      "findingRichness": 0.28,
      "lesionBoundaryClarity": 0.29,
      "validationConfidence": 0.35,
      "noiseLevel": 0.57,
      "examKind": "pa",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 38.56,
      "localizationIntegrity": 4.25,
      "mapConfidence": 8.08,
      "findingCompleteness": 33.47,
      "planCoherence": 0,
      "overall": 15.86
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 28.26,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 28.73,
      "planCoherence": 0,
      "overall": 16.52
    }
  },
  {
    "id": "tls-006",
    "input": {
      "imageQuality": 0.33,
      "viewClarity": 0.29,
      "diseaseSignal": 0.31,
      "localizationCoverage": 0.29,
      "mapPeakStrength": 0.32,
      "mapCoherence": 0.33,
      "findingRichness": 0.33,
      "lesionBoundaryClarity": 0.28,
      "validationConfidence": 0.29,
      "noiseLevel": 0.52,
      "examKind": "lateral",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 46.45,
      "localizationIntegrity": 52.22,
      "mapConfidence": 53.51,
      "findingCompleteness": 40.59,
      "planCoherence": 54.99,
      "overall": 49.99
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 29.55,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 29.56,
      "planCoherence": 0,
      "overall": 17.14
    }
  },
  {
    "id": "tls-007",
    "input": {
      "imageQuality": 0.37,
      "viewClarity": 0.32,
      "diseaseSignal": 0.35,
      "localizationCoverage": 0.33,
      "mapPeakStrength": 0.37,
      "mapCoherence": 0.37,
      "findingRichness": 0.37,
      "lesionBoundaryClarity": 0.32,
      "validationConfidence": 0.33,
      "noiseLevel": 0.52,
      "examKind": "ap",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 41.25,
      "localizationIntegrity": 12.12,
      "mapConfidence": 16.04,
      "findingCompleteness": 36.66,
      "planCoherence": 3.38,
      "overall": 21.16
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 30.98,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 31.03,
      "planCoherence": 0,
      "overall": 17.98
    }
  },
  {
    "id": "tls-008",
    "input": {
      "imageQuality": 0.34,
      "viewClarity": 0.36,
      "diseaseSignal": 0.39,
      "localizationCoverage": 0.37,
      "mapPeakStrength": 0.33,
      "mapCoherence": 0.33,
      "findingRichness": 0.33,
      "lesionBoundaryClarity": 0.36,
      "validationConfidence": 0.37,
      "noiseLevel": 0.52,
      "examKind": "portable",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 40.75,
      "localizationIntegrity": 13.38,
      "mapConfidence": 14.19,
      "findingCompleteness": 34.93,
      "planCoherence": 1.98,
      "overall": 20.43
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 30.42,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 30.22,
      "planCoherence": 0,
      "overall": 17.59
    }
  },
  {
    "id": "tls-009",
    "input": {
      "imageQuality": 0.38,
      "viewClarity": 0.4,
      "diseaseSignal": 0.38,
      "localizationCoverage": 0.41,
      "mapPeakStrength": 0.37,
      "mapCoherence": 0.38,
      "findingRichness": 0.38,
      "lesionBoundaryClarity": 0.35,
      "validationConfidence": 0.4,
      "noiseLevel": 0.46,
      "examKind": "mixed",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 53.8,
      "localizationIntegrity": 62.65,
      "mapConfidence": 61.97,
      "findingCompleteness": 47.35,
      "planCoherence": 63.58,
      "overall": 58.45
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 31.86,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 31.28,
      "planCoherence": 0,
      "overall": 18.32
    }
  },
  {
    "id": "tls-010",
    "input": {
      "imageQuality": 0.43,
      "viewClarity": 0.37,
      "diseaseSignal": 0.42,
      "localizationCoverage": 0.37,
      "mapPeakStrength": 0.41,
      "mapCoherence": 0.42,
      "findingRichness": 0.42,
      "lesionBoundaryClarity": 0.39,
      "validationConfidence": 0.44,
      "noiseLevel": 0.46,
      "examKind": "pa",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 47.86,
      "localizationIntegrity": 18.55,
      "mapConfidence": 23.13,
      "findingCompleteness": 43.35,
      "planCoherence": 10.23,
      "overall": 27.89
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 33.9,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 33.98,
      "planCoherence": 0,
      "overall": 19.68
    }
  },
  {
    "id": "tls-011",
    "input": {
      "imageQuality": 0.47,
      "viewClarity": 0.41,
      "diseaseSignal": 0.46,
      "localizationCoverage": 0.41,
      "mapPeakStrength": 0.46,
      "mapCoherence": 0.46,
      "findingRichness": 0.46,
      "lesionBoundaryClarity": 0.43,
      "validationConfidence": 0.48,
      "noiseLevel": 0.46,
      "examKind": "lateral",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 49.33,
      "localizationIntegrity": 21.48,
      "mapConfidence": 26.12,
      "findingCompleteness": 45.11,
      "planCoherence": 12.58,
      "overall": 30.25
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 35.51,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 35.53,
      "planCoherence": 0,
      "overall": 20.6
    }
  },
  {
    "id": "tls-012",
    "input": {
      "imageQuality": 0.44,
      "viewClarity": 0.45,
      "diseaseSignal": 0.44,
      "localizationCoverage": 0.45,
      "mapPeakStrength": 0.42,
      "mapCoherence": 0.43,
      "findingRichness": 0.43,
      "lesionBoundaryClarity": 0.42,
      "validationConfidence": 0.43,
      "noiseLevel": 0.4,
      "examKind": "ap",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 58.17,
      "localizationIntegrity": 66.23,
      "mapConfidence": 66.38,
      "findingCompleteness": 51.36,
      "planCoherence": 67,
      "overall": 62.41
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 34.65,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 34.02,
      "planCoherence": 0,
      "overall": 19.92
    }
  },
  {
    "id": "tls-013",
    "input": {
      "imageQuality": 0.48,
      "viewClarity": 0.48,
      "diseaseSignal": 0.48,
      "localizationCoverage": 0.49,
      "mapPeakStrength": 0.46,
      "mapCoherence": 0.47,
      "findingRichness": 0.47,
      "lesionBoundaryClarity": 0.46,
      "validationConfidence": 0.46,
      "noiseLevel": 0.4,
      "examKind": "portable",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 49.44,
      "localizationIntegrity": 27.02,
      "mapConfidence": 28.16,
      "findingCompleteness": 44.13,
      "planCoherence": 15.56,
      "overall": 32.43
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 36.12,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 35.52,
      "planCoherence": 0,
      "overall": 20.78
    }
  },
  {
    "id": "tls-014",
    "input": {
      "imageQuality": 0.52,
      "viewClarity": 0.52,
      "diseaseSignal": 0.53,
      "localizationCoverage": 0.53,
      "mapPeakStrength": 0.51,
      "mapCoherence": 0.51,
      "findingRichness": 0.51,
      "lesionBoundaryClarity": 0.5,
      "validationConfidence": 0.5,
      "noiseLevel": 0.4,
      "examKind": "mixed",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 55.59,
      "localizationIntegrity": 33.54,
      "mapConfidence": 34.54,
      "findingCompleteness": 50.01,
      "planCoherence": 21.01,
      "overall": 38.55
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 37.87,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 37.28,
      "planCoherence": 0,
      "overall": 21.8
    }
  },
  {
    "id": "tls-015",
    "input": {
      "imageQuality": 0.57,
      "viewClarity": 0.49,
      "diseaseSignal": 0.51,
      "localizationCoverage": 0.5,
      "mapPeakStrength": 0.55,
      "mapCoherence": 0.56,
      "findingRichness": 0.56,
      "lesionBoundaryClarity": 0.49,
      "validationConfidence": 0.54,
      "noiseLevel": 0.34,
      "examKind": "pa",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 68.22,
      "localizationIntegrity": 76.1,
      "mapConfidence": 82.02,
      "findingCompleteness": 63.63,
      "planCoherence": 82.9,
      "overall": 75.06
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 39.59,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 39.25,
      "planCoherence": 0,
      "overall": 22.87
    }
  },
  {
    "id": "tls-016",
    "input": {
      "imageQuality": 0.53,
      "viewClarity": 0.53,
      "diseaseSignal": 0.55,
      "localizationCoverage": 0.54,
      "mapPeakStrength": 0.51,
      "mapCoherence": 0.52,
      "findingRichness": 0.52,
      "lesionBoundaryClarity": 0.53,
      "validationConfidence": 0.57,
      "noiseLevel": 0.35,
      "examKind": "lateral",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 56.64,
      "localizationIntegrity": 34.93,
      "mapConfidence": 36.33,
      "findingCompleteness": 51.39,
      "planCoherence": 23.28,
      "overall": 40.12
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 38.83,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 38.25,
      "planCoherence": 0,
      "overall": 22.36
    }
  },
  {
    "id": "tls-017",
    "input": {
      "imageQuality": 0.58,
      "viewClarity": 0.57,
      "diseaseSignal": 0.59,
      "localizationCoverage": 0.58,
      "mapPeakStrength": 0.55,
      "mapCoherence": 0.57,
      "findingRichness": 0.57,
      "lesionBoundaryClarity": 0.58,
      "validationConfidence": 0.61,
      "noiseLevel": 0.35,
      "examKind": "ap",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 59.15,
      "localizationIntegrity": 38.41,
      "mapConfidence": 39.79,
      "findingCompleteness": 54.29,
      "planCoherence": 26.19,
      "overall": 43.2
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 40.82,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 40.2,
      "planCoherence": 0,
      "overall": 23.5
    }
  },
  {
    "id": "tls-018",
    "input": {
      "imageQuality": 0.62,
      "viewClarity": 0.61,
      "diseaseSignal": 0.58,
      "localizationCoverage": 0.62,
      "mapPeakStrength": 0.6,
      "mapCoherence": 0.61,
      "findingRichness": 0.61,
      "lesionBoundaryClarity": 0.56,
      "validationConfidence": 0.56,
      "noiseLevel": 0.29,
      "examKind": "portable",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 69.64,
      "localizationIntegrity": 79.5,
      "mapConfidence": 81.09,
      "findingCompleteness": 63.81,
      "planCoherence": 79.21,
      "overall": 75.32
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 42,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 40.97,
      "planCoherence": 0,
      "overall": 24.07
    }
  },
  {
    "id": "tls-019",
    "input": {
      "imageQuality": 0.66,
      "viewClarity": 0.64,
      "diseaseSignal": 0.62,
      "localizationCoverage": 0.66,
      "mapPeakStrength": 0.64,
      "mapCoherence": 0.65,
      "findingRichness": 0.65,
      "lesionBoundaryClarity": 0.6,
      "validationConfidence": 0.59,
      "noiseLevel": 0.29,
      "examKind": "mixed",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 64.71,
      "localizationIntegrity": 48.44,
      "mapConfidence": 49.47,
      "findingCompleteness": 59.71,
      "planCoherence": 35.73,
      "overall": 51.44
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 43.55,
      "localizationIntegrity": 0.1,
      "mapConfidence": 0,
      "findingCompleteness": 42.54,
      "planCoherence": 0,
      "overall": 24.99
    }
  },
  {
    "id": "tls-020",
    "input": {
      "imageQuality": 0.63,
      "viewClarity": 0.61,
      "diseaseSignal": 0.66,
      "localizationCoverage": 0.62,
      "mapPeakStrength": 0.6,
      "mapCoherence": 0.62,
      "findingRichness": 0.62,
      "lesionBoundaryClarity": 0.65,
      "validationConfidence": 0.63,
      "noiseLevel": 0.29,
      "examKind": "pa",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 66.21,
      "localizationIntegrity": 45.68,
      "mapConfidence": 48.34,
      "findingCompleteness": 60.69,
      "planCoherence": 34.58,
      "overall": 50.77
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 43.75,
      "localizationIntegrity": 0,
      "mapConfidence": 0,
      "findingCompleteness": 43.25,
      "planCoherence": 0,
      "overall": 25.24
    }
  },
  {
    "id": "tls-021",
    "input": {
      "imageQuality": 0.67,
      "viewClarity": 0.65,
      "diseaseSignal": 0.64,
      "localizationCoverage": 0.66,
      "mapPeakStrength": 0.65,
      "mapCoherence": 0.66,
      "findingRichness": 0.66,
      "lesionBoundaryClarity": 0.63,
      "validationConfidence": 0.67,
      "noiseLevel": 0.23,
      "examKind": "lateral",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 78.36,
      "localizationIntegrity": 88.39,
      "mapConfidence": 92.6,
      "findingCompleteness": 72.86,
      "planCoherence": 91.87,
      "overall": 85.45
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 44.81,
      "localizationIntegrity": 0.55,
      "mapConfidence": 0,
      "findingCompleteness": 43.81,
      "planCoherence": 0,
      "overall": 25.76
    }
  },
  {
    "id": "tls-022",
    "input": {
      "imageQuality": 0.72,
      "viewClarity": 0.69,
      "diseaseSignal": 0.68,
      "localizationCoverage": 0.7,
      "mapPeakStrength": 0.69,
      "mapCoherence": 0.7,
      "findingRichness": 0.7,
      "lesionBoundaryClarity": 0.67,
      "validationConfidence": 0.71,
      "noiseLevel": 0.23,
      "examKind": "ap",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 68,
      "localizationIntegrity": 52.46,
      "mapConfidence": 54.37,
      "findingCompleteness": 63.56,
      "planCoherence": 40.33,
      "overall": 55.58
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 46.58,
      "localizationIntegrity": 2.66,
      "mapConfidence": 0,
      "findingCompleteness": 45.51,
      "planCoherence": 0,
      "overall": 26.98
    }
  },
  {
    "id": "tls-023",
    "input": {
      "imageQuality": 0.76,
      "viewClarity": 0.73,
      "diseaseSignal": 0.73,
      "localizationCoverage": 0.74,
      "mapPeakStrength": 0.73,
      "mapCoherence": 0.75,
      "findingRichness": 0.75,
      "lesionBoundaryClarity": 0.72,
      "validationConfidence": 0.74,
      "noiseLevel": 0.23,
      "examKind": "portable",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 68.46,
      "localizationIntegrity": 53.91,
      "mapConfidence": 55.38,
      "findingCompleteness": 64.35,
      "planCoherence": 40.64,
      "overall": 56.43
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 48.75,
      "localizationIntegrity": 4.86,
      "mapConfidence": 0,
      "findingCompleteness": 47.71,
      "planCoherence": 1.03,
      "overall": 28.68
    }
  },
  {
    "id": "tls-024",
    "input": {
      "imageQuality": 0.73,
      "viewClarity": 0.77,
      "diseaseSignal": 0.71,
      "localizationCoverage": 0.78,
      "mapPeakStrength": 0.69,
      "mapCoherence": 0.71,
      "findingRichness": 0.71,
      "lesionBoundaryClarity": 0.7,
      "validationConfidence": 0.69,
      "noiseLevel": 0.17,
      "examKind": "mixed",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 86.3,
      "localizationIntegrity": 99.08,
      "mapConfidence": 100,
      "findingCompleteness": 78.99,
      "planCoherence": 100,
      "overall": 93.68
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 47.34,
      "localizationIntegrity": 6.51,
      "mapConfidence": 0,
      "findingCompleteness": 45.63,
      "planCoherence": 2.55,
      "overall": 28.14
    }
  },
  {
    "id": "tls-025",
    "input": {
      "imageQuality": 0.77,
      "viewClarity": 0.73,
      "diseaseSignal": 0.75,
      "localizationCoverage": 0.75,
      "mapPeakStrength": 0.74,
      "mapCoherence": 0.75,
      "findingRichness": 0.75,
      "lesionBoundaryClarity": 0.74,
      "validationConfidence": 0.73,
      "noiseLevel": 0.17,
      "examKind": "pa",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 75.42,
      "localizationIntegrity": 60.96,
      "mapConfidence": 63.84,
      "findingCompleteness": 70.33,
      "planCoherence": 49.84,
      "overall": 63.98
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 49.42,
      "localizationIntegrity": 5.7,
      "mapConfidence": 0,
      "findingCompleteness": 48.46,
      "planCoherence": 2.64,
      "overall": 29.49
    }
  },
  {
    "id": "tls-026",
    "input": {
      "imageQuality": 0.81,
      "viewClarity": 0.77,
      "diseaseSignal": 0.79,
      "localizationCoverage": 0.79,
      "mapPeakStrength": 0.78,
      "mapCoherence": 0.8,
      "findingRichness": 0.8,
      "lesionBoundaryClarity": 0.79,
      "validationConfidence": 0.76,
      "noiseLevel": 0.18,
      "examKind": "lateral",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 76.2,
      "localizationIntegrity": 62.83,
      "mapConfidence": 65.21,
      "findingCompleteness": 71.57,
      "planCoherence": 50.35,
      "overall": 65.18
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 51.41,
      "localizationIntegrity": 7.83,
      "mapConfidence": 1.22,
      "findingCompleteness": 50.42,
      "planCoherence": 4.53,
      "overall": 31.38
    }
  },
  {
    "id": "tls-027",
    "input": {
      "imageQuality": 0.86,
      "viewClarity": 0.81,
      "diseaseSignal": 0.77,
      "localizationCoverage": 0.83,
      "mapPeakStrength": 0.82,
      "mapCoherence": 0.84,
      "findingRichness": 0.84,
      "lesionBoundaryClarity": 0.77,
      "validationConfidence": 0.8,
      "noiseLevel": 0.12,
      "examKind": "ap",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 91.68,
      "localizationIntegrity": 100,
      "mapConfidence": 100,
      "findingCompleteness": 87.07,
      "planCoherence": 100,
      "overall": 96.27
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 52.5,
      "localizationIntegrity": 10.07,
      "mapConfidence": 3.07,
      "findingCompleteness": 51,
      "planCoherence": 6.47,
      "overall": 32.7
    }
  },
  {
    "id": "tls-028",
    "input": {
      "imageQuality": 0.82,
      "viewClarity": 0.85,
      "diseaseSignal": 0.82,
      "localizationCoverage": 0.87,
      "mapPeakStrength": 0.78,
      "mapCoherence": 0.8,
      "findingRichness": 0.8,
      "lesionBoundaryClarity": 0.81,
      "validationConfidence": 0.84,
      "noiseLevel": 0.12,
      "examKind": "portable",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 75.24,
      "localizationIntegrity": 66.79,
      "mapConfidence": 64.61,
      "findingCompleteness": 70.03,
      "planCoherence": 50.16,
      "overall": 65.53
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 51.85,
      "localizationIntegrity": 11.63,
      "mapConfidence": 3.4,
      "findingCompleteness": 50.18,
      "planCoherence": 8.19,
      "overall": 32.81
    }
  },
  {
    "id": "tls-029",
    "input": {
      "imageQuality": 0.87,
      "viewClarity": 0.89,
      "diseaseSignal": 0.86,
      "localizationCoverage": 0.91,
      "mapPeakStrength": 0.83,
      "mapCoherence": 0.85,
      "findingRichness": 0.85,
      "lesionBoundaryClarity": 0.86,
      "validationConfidence": 0.88,
      "noiseLevel": 0.12,
      "examKind": "mixed",
      "plan": "classify_only"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 82.96,
      "localizationIntegrity": 75.19,
      "mapConfidence": 74.1,
      "findingCompleteness": 77.79,
      "planCoherence": 59.36,
      "overall": 74.07
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 53.98,
      "localizationIntegrity": 13.85,
      "mapConfidence": 5.7,
      "findingCompleteness": 52.26,
      "planCoherence": 10.26,
      "overall": 34.95
    }
  },
  {
    "id": "tls-030",
    "input": {
      "imageQuality": 0.91,
      "viewClarity": 0.85,
      "diseaseSignal": 0.84,
      "localizationCoverage": 0.87,
      "mapPeakStrength": 0.87,
      "mapCoherence": 0.89,
      "findingRichness": 0.89,
      "lesionBoundaryClarity": 0.84,
      "validationConfidence": 0.82,
      "noiseLevel": 0.06,
      "examKind": "pa",
      "plan": "classify_localize"
    },
    "expectedClassifyLocalize": {
      "mode": "classify_localize",
      "classificationQuality": 100,
      "localizationIntegrity": 100,
      "mapConfidence": 100,
      "findingCompleteness": 95.57,
      "planCoherence": 100,
      "overall": 99.29
    },
    "expectedClassifyOnly": {
      "mode": "classify_only",
      "classificationQuality": 55.66,
      "localizationIntegrity": 12.74,
      "mapConfidence": 5.51,
      "findingCompleteness": 54.27,
      "planCoherence": 10.08,
      "overall": 35.84
    }
  }
];
