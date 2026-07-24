import type { PredictInput, PredictQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PredictInput;
  expectedFeatureIntegrated: PredictQuality;
  expectedSequenceOnly: PredictQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "seqLength": 97,
      "aaCompositionEntropy": 0.25,
      "hydrophobicFraction": 0.17,
      "pssmConservation": 0.13,
      "msaDepth": 7,
      "structureCoverage": 0.18,
      "contactMapDensity": 0.14,
      "signalPeptideScore": 0.05,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 14.8,
      "argScore": 14.51,
      "nsScore": 98.34,
      "predictedClass": "NS",
      "confidence": 86.54,
      "structuralContribution": 13.57,
      "evolutionaryContribution": 10.62,
      "sequenceContribution": 17.76,
      "overall": 24.95
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 14.35,
      "argScore": 14.83,
      "nsScore": 100,
      "predictedClass": "NS",
      "confidence": 85,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 17.76,
      "overall": 32.16
    }
  },
  {
    "id": "std-002",
    "input": {
      "seqLength": 139,
      "aaCompositionEntropy": 0.3,
      "hydrophobicFraction": 0.21,
      "pssmConservation": 0.16,
      "msaDepth": 11.76,
      "structureCoverage": 0.22,
      "contactMapDensity": 0.18,
      "signalPeptideScore": 0.12,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 20.86,
      "argScore": 20.03,
      "nsScore": 93.38,
      "predictedClass": "NS",
      "confidence": 80.52,
      "structuralContribution": 21.55,
      "evolutionaryContribution": 16.52,
      "sequenceContribution": 22.24,
      "overall": 29.24
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 18.55,
      "argScore": 18.53,
      "nsScore": 100,
      "predictedClass": "NS",
      "confidence": 83.45,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 22.24,
      "overall": 34.77
    }
  },
  {
    "id": "std-003",
    "input": {
      "seqLength": 181,
      "aaCompositionEntropy": 0.26,
      "hydrophobicFraction": 0.24,
      "pssmConservation": 0.2,
      "msaDepth": 16.52,
      "structureCoverage": 0.27,
      "contactMapDensity": 0.23,
      "signalPeptideScore": 0.06,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 21.28,
      "argScore": 20.73,
      "nsScore": 93.56,
      "predictedClass": "NS",
      "confidence": 75.28,
      "structuralContribution": 20.93,
      "evolutionaryContribution": 17.69,
      "sequenceContribution": 20.53,
      "overall": 28.85
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 16.61,
      "argScore": 17.66,
      "nsScore": 100,
      "predictedClass": "NS",
      "confidence": 84.34,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 20.53,
      "overall": 33.86
    }
  },
  {
    "id": "std-004",
    "input": {
      "seqLength": 222,
      "aaCompositionEntropy": 0.31,
      "hydrophobicFraction": 0.2,
      "pssmConservation": 0.23,
      "msaDepth": 21.28,
      "structureCoverage": 0.31,
      "contactMapDensity": 0.18,
      "signalPeptideScore": 0.13,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 25.89,
      "argScore": 25.26,
      "nsScore": 89.64,
      "predictedClass": "NS",
      "confidence": 71.75,
      "structuralContribution": 26.88,
      "evolutionaryContribution": 24.7,
      "sequenceContribution": 23.18,
      "overall": 32.59
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 19.38,
      "argScore": 19.09,
      "nsScore": 99.82,
      "predictedClass": "NS",
      "confidence": 82.44,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 23.18,
      "overall": 35.06
    }
  },
  {
    "id": "std-005",
    "input": {
      "seqLength": 179,
      "aaCompositionEntropy": 0.36,
      "hydrophobicFraction": 0.23,
      "pssmConservation": 0.27,
      "msaDepth": 26.03,
      "structureCoverage": 0.26,
      "contactMapDensity": 0.23,
      "signalPeptideScore": 0.19,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 26.77,
      "argScore": 26.67,
      "nsScore": 88.41,
      "predictedClass": "NS",
      "confidence": 64.64,
      "structuralContribution": 21.4,
      "evolutionaryContribution": 25.43,
      "sequenceContribution": 26.77,
      "overall": 31.75
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 22.78,
      "argScore": 22.03,
      "nsScore": 96.71,
      "predictedClass": "NS",
      "confidence": 75.93,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 26.77,
      "overall": 35.84
    }
  },
  {
    "id": "std-006",
    "input": {
      "seqLength": 221,
      "aaCompositionEntropy": 0.31,
      "hydrophobicFraction": 0.27,
      "pssmConservation": 0.3,
      "msaDepth": 18.79,
      "structureCoverage": 0.3,
      "contactMapDensity": 0.27,
      "signalPeptideScore": 0.14,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 28.66,
      "argScore": 28.26,
      "nsScore": 87.64,
      "predictedClass": "NS",
      "confidence": 66.98,
      "structuralContribution": 30.22,
      "evolutionaryContribution": 27.25,
      "sequenceContribution": 25.31,
      "overall": 34.32
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 21.14,
      "argScore": 21.46,
      "nsScore": 98.47,
      "predictedClass": "NS",
      "confidence": 79.01,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 25.31,
      "overall": 35.7
    }
  },
  {
    "id": "std-007",
    "input": {
      "seqLength": 263,
      "aaCompositionEntropy": 0.36,
      "hydrophobicFraction": 0.3,
      "pssmConservation": 0.26,
      "msaDepth": 23.55,
      "structureCoverage": 0.34,
      "contactMapDensity": 0.32,
      "signalPeptideScore": 0.21,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 30.2,
      "argScore": 28.69,
      "nsScore": 85.94,
      "predictedClass": "NS",
      "confidence": 58.74,
      "structuralContribution": 28.37,
      "evolutionaryContribution": 23.99,
      "sequenceContribution": 29.93,
      "overall": 33.3
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 25.45,
      "argScore": 25.15,
      "nsScore": 94.98,
      "predictedClass": "NS",
      "confidence": 71.53,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 29.93,
      "overall": 36.88
    }
  },
  {
    "id": "std-008",
    "input": {
      "seqLength": 305,
      "aaCompositionEntropy": 0.41,
      "hydrophobicFraction": 0.26,
      "pssmConservation": 0.3,
      "msaDepth": 28.31,
      "structureCoverage": 0.39,
      "contactMapDensity": 0.27,
      "signalPeptideScore": 0.27,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 35.7,
      "argScore": 34.14,
      "nsScore": 81.38,
      "predictedClass": "NS",
      "confidence": 53.68,
      "structuralContribution": 36.62,
      "evolutionaryContribution": 32.53,
      "sequenceContribution": 32.41,
      "overall": 37.78
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 27.98,
      "argScore": 26.46,
      "nsScore": 92.43,
      "predictedClass": "NS",
      "confidence": 66.45,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 32.41,
      "overall": 37.14
    }
  },
  {
    "id": "std-009",
    "input": {
      "seqLength": 347,
      "aaCompositionEntropy": 0.37,
      "hydrophobicFraction": 0.29,
      "pssmConservation": 0.33,
      "msaDepth": 33.07,
      "structureCoverage": 0.43,
      "contactMapDensity": 0.32,
      "signalPeptideScore": 0.22,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 34.93,
      "argScore": 33.65,
      "nsScore": 82.41,
      "predictedClass": "NS",
      "confidence": 50.48,
      "structuralContribution": 32.65,
      "evolutionaryContribution": 31.05,
      "sequenceContribution": 31.09,
      "overall": 36.33
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 26.45,
      "argScore": 25.86,
      "nsScore": 94.15,
      "predictedClass": "NS",
      "confidence": 69.7,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 31.09,
      "overall": 37.09
    }
  },
  {
    "id": "std-010",
    "input": {
      "seqLength": 303,
      "aaCompositionEntropy": 0.42,
      "hydrophobicFraction": 0.33,
      "pssmConservation": 0.37,
      "msaDepth": 37.83,
      "structureCoverage": 0.38,
      "contactMapDensity": 0.36,
      "signalPeptideScore": 0.28,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 40.48,
      "argScore": 39.5,
      "nsScore": 77.81,
      "predictedClass": "NS",
      "confidence": 45.33,
      "structuralContribution": 39.96,
      "evolutionaryContribution": 40.71,
      "sequenceContribution": 34.95,
      "overall": 40.93
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 30.06,
      "argScore": 29.12,
      "nsScore": 90.9,
      "predictedClass": "NS",
      "confidence": 62.84,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 34.95,
      "overall": 37.97
    }
  },
  {
    "id": "std-011",
    "input": {
      "seqLength": 345,
      "aaCompositionEntropy": 0.47,
      "hydrophobicFraction": 0.37,
      "pssmConservation": 0.4,
      "msaDepth": 42.59,
      "structureCoverage": 0.42,
      "contactMapDensity": 0.41,
      "signalPeptideScore": 0.35,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 42.43,
      "argScore": 41.14,
      "nsScore": 75.81,
      "predictedClass": "NS",
      "confidence": 36.38,
      "structuralContribution": 36.2,
      "evolutionaryContribution": 38.81,
      "sequenceContribution": 39.85,
      "overall": 40.21
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 34.58,
      "argScore": 33.13,
      "nsScore": 87.06,
      "predictedClass": "NS",
      "confidence": 54.48,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 39.85,
      "overall": 39.12
    }
  },
  {
    "id": "std-012",
    "input": {
      "seqLength": 387,
      "aaCompositionEntropy": 0.43,
      "hydrophobicFraction": 0.32,
      "pssmConservation": 0.44,
      "msaDepth": 35.34,
      "structureCoverage": 0.47,
      "contactMapDensity": 0.36,
      "signalPeptideScore": 0.29,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 43.72,
      "argScore": 42.63,
      "nsScore": 75.36,
      "predictedClass": "NS",
      "confidence": 39.64,
      "structuralContribution": 45.29,
      "evolutionaryContribution": 43.34,
      "sequenceContribution": 36.11,
      "overall": 42.95
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 31.07,
      "argScore": 29.84,
      "nsScore": 90.06,
      "predictedClass": "NS",
      "confidence": 60.99,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 36.11,
      "overall": 38.18
    }
  },
  {
    "id": "std-013",
    "input": {
      "seqLength": 429,
      "aaCompositionEntropy": 0.48,
      "hydrophobicFraction": 0.36,
      "pssmConservation": 0.47,
      "msaDepth": 40.1,
      "structureCoverage": 0.51,
      "contactMapDensity": 0.41,
      "signalPeptideScore": 0.36,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 45.44,
      "argScore": 44.08,
      "nsScore": 73.52,
      "predictedClass": "NS",
      "confidence": 31.08,
      "structuralContribution": 40.48,
      "evolutionaryContribution": 41.08,
      "sequenceContribution": 41.01,
      "overall": 42.01
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 35.59,
      "argScore": 33.85,
      "nsScore": 86.23,
      "predictedClass": "NS",
      "confidence": 52.64,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 41.01,
      "overall": 39.33
    }
  },
  {
    "id": "std-014",
    "input": {
      "seqLength": 471,
      "aaCompositionEntropy": 0.53,
      "hydrophobicFraction": 0.39,
      "pssmConservation": 0.43,
      "msaDepth": 44.86,
      "structureCoverage": 0.55,
      "contactMapDensity": 0.45,
      "signalPeptideScore": 0.43,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 52.6,
      "argScore": 49.77,
      "nsScore": 67.77,
      "predictedClass": "NS",
      "confidence": 23.17,
      "structuralContribution": 55.04,
      "evolutionaryContribution": 48.09,
      "sequenceContribution": 45.63,
      "overall": 47.27
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 39.89,
      "argScore": 37.53,
      "nsScore": 82.53,
      "predictedClass": "NS",
      "confidence": 44.64,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 45.63,
      "overall": 40.37
    }
  },
  {
    "id": "std-015",
    "input": {
      "seqLength": 428,
      "aaCompositionEntropy": 0.49,
      "hydrophobicFraction": 0.43,
      "pssmConservation": 0.47,
      "msaDepth": 49.62,
      "structureCoverage": 0.5,
      "contactMapDensity": 0.5,
      "signalPeptideScore": 0.37,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 48.73,
      "argScore": 47.18,
      "nsScore": 71.03,
      "predictedClass": "NS",
      "confidence": 25.3,
      "structuralContribution": 43.16,
      "evolutionaryContribution": 44.95,
      "sequenceContribution": 43.56,
      "overall": 43.89
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 37.68,
      "argScore": 36.52,
      "nsScore": 84.69,
      "predictedClass": "NS",
      "confidence": 49.01,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 43.56,
      "overall": 40.16
    }
  },
  {
    "id": "std-016",
    "input": {
      "seqLength": 469,
      "aaCompositionEntropy": 0.53,
      "hydrophobicFraction": 0.38,
      "pssmConservation": 0.5,
      "msaDepth": 54.38,
      "structureCoverage": 0.54,
      "contactMapDensity": 0.45,
      "signalPeptideScore": 0.44,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 55.15,
      "argScore": 53.37,
      "nsScore": 65.93,
      "predictedClass": "NS",
      "confidence": 18.78,
      "structuralContribution": 54.54,
      "evolutionaryContribution": 56.19,
      "sequenceContribution": 45.51,
      "overall": 49.29
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 39.9,
      "argScore": 37.33,
      "nsScore": 82.53,
      "predictedClass": "NS",
      "confidence": 44.63,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 45.51,
      "overall": 40.31
    }
  },
  {
    "id": "std-017",
    "input": {
      "seqLength": 511,
      "aaCompositionEntropy": 0.58,
      "hydrophobicFraction": 0.42,
      "pssmConservation": 0.54,
      "msaDepth": 59.14,
      "structureCoverage": 0.59,
      "contactMapDensity": 0.5,
      "signalPeptideScore": 0.5,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 56.3,
      "argScore": 54.36,
      "nsScore": 64.5,
      "predictedClass": "NS",
      "confidence": 11.2,
      "structuralContribution": 48.31,
      "evolutionaryContribution": 52.63,
      "sequenceContribution": 50.23,
      "overall": 47.88
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 44.18,
      "argScore": 41.21,
      "nsScore": 78.84,
      "predictedClass": "NS",
      "confidence": 36.66,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 50.23,
      "overall": 41.41
    }
  },
  {
    "id": "std-018",
    "input": {
      "seqLength": 553,
      "aaCompositionEntropy": 0.54,
      "hydrophobicFraction": 0.45,
      "pssmConservation": 0.57,
      "msaDepth": 51.9,
      "structureCoverage": 0.63,
      "contactMapDensity": 0.54,
      "signalPeptideScore": 0.45,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 60.47,
      "argScore": 58.08,
      "nsScore": 61.98,
      "predictedClass": "NS",
      "confidence": 9.51,
      "structuralContribution": 63.71,
      "evolutionaryContribution": 58.83,
      "sequenceContribution": 48.91,
      "overall": 52.39
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 42.65,
      "argScore": 40.62,
      "nsScore": 80.56,
      "predictedClass": "NS",
      "confidence": 39.91,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 48.91,
      "overall": 41.36
    }
  },
  {
    "id": "std-019",
    "input": {
      "seqLength": 595,
      "aaCompositionEntropy": 0.59,
      "hydrophobicFraction": 0.49,
      "pssmConservation": 0.6,
      "msaDepth": 56.66,
      "structureCoverage": 0.67,
      "contactMapDensity": 0.59,
      "signalPeptideScore": 0.52,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 61.01,
      "argScore": 58.46,
      "nsScore": 60.99,
      "predictedClass": "VF",
      "confidence": 3.02,
      "structuralContribution": 55.28,
      "evolutionaryContribution": 54.45,
      "sequenceContribution": 53.81,
      "overall": 50.45
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 47.17,
      "argScore": 44.62,
      "nsScore": 76.72,
      "predictedClass": "NS",
      "confidence": 31.55,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 53.81,
      "overall": 42.5
    }
  },
  {
    "id": "std-020",
    "input": {
      "seqLength": 552,
      "aaCompositionEntropy": 0.64,
      "hydrophobicFraction": 0.44,
      "pssmConservation": 0.64,
      "msaDepth": 61.41,
      "structureCoverage": 0.62,
      "contactMapDensity": 0.54,
      "signalPeptideScore": 0.58,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 66.35,
      "argScore": 64.45,
      "nsScore": 56.55,
      "predictedClass": "VF",
      "confidence": 9.9,
      "structuralContribution": 64.29,
      "evolutionaryContribution": 67.8,
      "sequenceContribution": 55.16,
      "overall": 57.35
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 48.82,
      "argScore": 45,
      "nsScore": 74.75,
      "predictedClass": "NS",
      "confidence": 27.93,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 55.16,
      "overall": 42.45
    }
  },
  {
    "id": "std-021",
    "input": {
      "seqLength": 594,
      "aaCompositionEntropy": 0.6,
      "hydrophobicFraction": 0.48,
      "pssmConservation": 0.6,
      "msaDepth": 66.17,
      "structureCoverage": 0.66,
      "contactMapDensity": 0.59,
      "signalPeptideScore": 0.53,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 62.38,
      "argScore": 60.09,
      "nsScore": 59.89,
      "predictedClass": "VF",
      "confidence": 5.29,
      "structuralContribution": 54.88,
      "evolutionaryContribution": 58.32,
      "sequenceContribution": 54.12,
      "overall": 52.09
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 47.51,
      "argScore": 44.73,
      "nsScore": 76.32,
      "predictedClass": "NS",
      "confidence": 30.81,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 54.12,
      "overall": 42.5
    }
  },
  {
    "id": "std-022",
    "input": {
      "seqLength": 635,
      "aaCompositionEntropy": 0.65,
      "hydrophobicFraction": 0.52,
      "pssmConservation": 0.64,
      "msaDepth": 70.93,
      "structureCoverage": 0.71,
      "contactMapDensity": 0.63,
      "signalPeptideScore": 0.59,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 72.37,
      "argScore": 69.42,
      "nsScore": 52.09,
      "predictedClass": "VF",
      "confidence": 10.95,
      "structuralContribution": 73.45,
      "evolutionaryContribution": 72.28,
      "sequenceContribution": 58.83,
      "overall": 62.52
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 51.79,
      "argScore": 48.6,
      "nsScore": 72.64,
      "predictedClass": "NS",
      "confidence": 22.85,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 58.83,
      "overall": 43.6
    }
  },
  {
    "id": "std-023",
    "input": {
      "seqLength": 677,
      "aaCompositionEntropy": 0.7,
      "hydrophobicFraction": 0.55,
      "pssmConservation": 0.67,
      "msaDepth": 75.69,
      "structureCoverage": 0.75,
      "contactMapDensity": 0.68,
      "signalPeptideScore": 0.66,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 72.02,
      "argScore": 68.91,
      "nsScore": 51.75,
      "predictedClass": "VF",
      "confidence": 6.11,
      "structuralContribution": 63.11,
      "evolutionaryContribution": 66.07,
      "sequenceContribution": 63.45,
      "overall": 59.87
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 56.09,
      "argScore": 52.28,
      "nsScore": 68.94,
      "predictedClass": "NS",
      "confidence": 14.85,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 63.45,
      "overall": 44.64
    }
  },
  {
    "id": "std-024",
    "input": {
      "seqLength": 719,
      "aaCompositionEntropy": 0.66,
      "hydrophobicFraction": 0.51,
      "pssmConservation": 0.71,
      "msaDepth": 68.45,
      "structureCoverage": 0.8,
      "contactMapDensity": 0.63,
      "signalPeptideScore": 0.6,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 75.62,
      "argScore": 72.55,
      "nsScore": 49.63,
      "predictedClass": "VF",
      "confidence": 11.07,
      "structuralContribution": 78.78,
      "evolutionaryContribution": 74.92,
      "sequenceContribution": 59.99,
      "overall": 65.42
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 52.79,
      "argScore": 49.31,
      "nsScore": 71.81,
      "predictedClass": "NS",
      "confidence": 21.02,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 59.99,
      "overall": 43.8
    }
  },
  {
    "id": "std-025",
    "input": {
      "seqLength": 676,
      "aaCompositionEntropy": 0.71,
      "hydrophobicFraction": 0.54,
      "pssmConservation": 0.74,
      "msaDepth": 73.21,
      "structureCoverage": 0.74,
      "contactMapDensity": 0.68,
      "signalPeptideScore": 0.67,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 72.81,
      "argScore": 70.43,
      "nsScore": 51.06,
      "predictedClass": "VF",
      "confidence": 5.38,
      "structuralContribution": 62.71,
      "evolutionaryContribution": 68.35,
      "sequenceContribution": 63.76,
      "overall": 60.64
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 56.43,
      "argScore": 52.39,
      "nsScore": 68.54,
      "predictedClass": "NS",
      "confidence": 14.11,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 63.76,
      "overall": 44.64
    }
  },
  {
    "id": "std-026",
    "input": {
      "seqLength": 718,
      "aaCompositionEntropy": 0.75,
      "hydrophobicFraction": 0.58,
      "pssmConservation": 0.77,
      "msaDepth": 77.97,
      "structureCoverage": 0.78,
      "contactMapDensity": 0.72,
      "signalPeptideScore": 0.74,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 83.18,
      "argScore": 79.99,
      "nsScore": 43.11,
      "predictedClass": "VF",
      "confidence": 11.19,
      "structuralContribution": 82.7,
      "evolutionaryContribution": 83.28,
      "sequenceContribution": 68.24,
      "overall": 71.55
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 60.63,
      "argScore": 56.09,
      "nsScore": 65.09,
      "predictedClass": "NS",
      "confidence": 6.46,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 68.24,
      "overall": 45.73
    }
  },
  {
    "id": "std-027",
    "input": {
      "seqLength": 760,
      "aaCompositionEntropy": 0.71,
      "hydrophobicFraction": 0.61,
      "pssmConservation": 0.81,
      "msaDepth": 82.72,
      "structureCoverage": 0.83,
      "contactMapDensity": 0.77,
      "signalPeptideScore": 0.68,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 79.32,
      "argScore": 76.69,
      "nsScore": 46.37,
      "predictedClass": "VF",
      "confidence": 5.63,
      "structuralContribution": 70.07,
      "evolutionaryContribution": 75.34,
      "sequenceContribution": 66.74,
      "overall": 66.29
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 58.86,
      "argScore": 55.37,
      "nsScore": 66.96,
      "predictedClass": "NS",
      "confidence": 10.1,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 66.74,
      "overall": 45.62
    }
  },
  {
    "id": "std-028",
    "input": {
      "seqLength": 801,
      "aaCompositionEntropy": 0.76,
      "hydrophobicFraction": 0.57,
      "pssmConservation": 0.77,
      "msaDepth": 87.48,
      "structureCoverage": 0.87,
      "contactMapDensity": 0.72,
      "signalPeptideScore": 0.75,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 87.04,
      "argScore": 83.28,
      "nsScore": 40.21,
      "predictedClass": "VF",
      "confidence": 11.76,
      "structuralContribution": 88.03,
      "evolutionaryContribution": 87.76,
      "sequenceContribution": 69.39,
      "overall": 74.98
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 61.62,
      "argScore": 56.8,
      "nsScore": 64.27,
      "predictedClass": "NS",
      "confidence": 4.65,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 69.39,
      "overall": 45.93
    }
  },
  {
    "id": "std-029",
    "input": {
      "seqLength": 843,
      "aaCompositionEntropy": 0.81,
      "hydrophobicFraction": 0.6,
      "pssmConservation": 0.81,
      "msaDepth": 92.24,
      "structureCoverage": 0.92,
      "contactMapDensity": 0.77,
      "signalPeptideScore": 0.81,
      "profile": "fast"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 85.89,
      "argScore": 82.13,
      "nsScore": 40.44,
      "predictedClass": "VF",
      "confidence": 6.76,
      "structuralContribution": 75.22,
      "evolutionaryContribution": 79.9,
      "sequenceContribution": 73.83,
      "overall": 71.41
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 65.69,
      "argScore": 60.36,
      "nsScore": 60.72,
      "predictedClass": "VF",
      "confidence": 6.97,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 73.83,
      "overall": 49.41
    }
  },
  {
    "id": "std-030",
    "input": {
      "seqLength": 800,
      "aaCompositionEntropy": 0.77,
      "hydrophobicFraction": 0.64,
      "pssmConservation": 0.84,
      "msaDepth": 85,
      "structureCoverage": 0.86,
      "contactMapDensity": 0.81,
      "signalPeptideScore": 0.76,
      "profile": "full"
    },
    "expectedFeatureIntegrated": {
      "mode": "feature_integrated",
      "vfScore": 89.97,
      "argScore": 86.47,
      "nsScore": 37.98,
      "predictedClass": "VF",
      "confidence": 11.5,
      "structuralContribution": 91.37,
      "evolutionaryContribution": 90.4,
      "sequenceContribution": 71.94,
      "overall": 77.51
    },
    "expectedSequenceOnly": {
      "mode": "sequence_only",
      "vfScore": 63.71,
      "argScore": 59.48,
      "nsScore": 62.73,
      "predictedClass": "VF",
      "confidence": 2.98,
      "structuralContribution": 0,
      "evolutionaryContribution": 0,
      "sequenceContribution": 71.94,
      "overall": 47.26
    }
  }
];
