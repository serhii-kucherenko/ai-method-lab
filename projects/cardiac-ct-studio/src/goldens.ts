import type { CardiacInput, CardiacQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CardiacInput;
  expectedHitlFoundation: CardiacQuality;
  expectedAutoOnly: CardiacQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ccs-001",
    "input": {
      "contrastQuality": 0.19,
      "motionArtifact": 0.63,
      "expertAnnotationCoverage": 0.16,
      "structureCoverage": 0.19,
      "foundationPrior": 0.22,
      "phenotypeRichness": 0.19,
      "sliceQuality": 0.16,
      "calciumSignal": 0.2,
      "chamberGeometry": 0.19,
      "vesselClarity": 0.18,
      "studyKind": "cac",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 30.34,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0.13,
      "structureCompleteness": 24,
      "planCoherence": 0,
      "overall": 9.94
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 24.5,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 24.68,
      "planCoherence": 0,
      "overall": 14.26
    }
  },
  {
    "id": "ccs-002",
    "input": {
      "contrastQuality": 0.23,
      "motionArtifact": 0.63,
      "expertAnnotationCoverage": 0.2,
      "structureCoverage": 0.23,
      "foundationPrior": 0.26,
      "phenotypeRichness": 0.23,
      "sliceQuality": 0.2,
      "calciumSignal": 0.23,
      "chamberGeometry": 0.23,
      "vesselClarity": 0.22,
      "studyKind": "morphology",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 33.86,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 2.72,
      "structureCompleteness": 27.45,
      "planCoherence": 0,
      "overall": 11.76
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 26.09,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 26.2,
      "planCoherence": 0,
      "overall": 15.16
    }
  },
  {
    "id": "ccs-003",
    "input": {
      "contrastQuality": 0.28,
      "motionArtifact": 0.57,
      "expertAnnotationCoverage": 0.24,
      "structureCoverage": 0.28,
      "foundationPrior": 0.24,
      "phenotypeRichness": 0.28,
      "sliceQuality": 0.24,
      "calciumSignal": 0.27,
      "chamberGeometry": 0.28,
      "vesselClarity": 0.21,
      "studyKind": "functional",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 43.29,
      "hitlIntegrity": 46.94,
      "phenotypeConfidence": 47.58,
      "structureCompleteness": 36.01,
      "planCoherence": 48.1,
      "overall": 44.81
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 27.8,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 27.5,
      "planCoherence": 0,
      "overall": 16.04
    }
  },
  {
    "id": "ccs-004",
    "input": {
      "contrastQuality": 0.24,
      "motionArtifact": 0.57,
      "expertAnnotationCoverage": 0.28,
      "structureCoverage": 0.24,
      "foundationPrior": 0.29,
      "phenotypeRichness": 0.24,
      "sliceQuality": 0.28,
      "calciumSignal": 0.31,
      "chamberGeometry": 0.24,
      "vesselClarity": 0.25,
      "studyKind": "mixed",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 37.37,
      "hitlIntegrity": 5.93,
      "phenotypeConfidence": 6.93,
      "structureCompleteness": 30.32,
      "planCoherence": 0,
      "overall": 15.27
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 27.14,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 26.62,
      "planCoherence": 0,
      "overall": 15.6
    }
  },
  {
    "id": "ccs-005",
    "input": {
      "contrastQuality": 0.29,
      "motionArtifact": 0.57,
      "expertAnnotationCoverage": 0.25,
      "structureCoverage": 0.28,
      "foundationPrior": 0.33,
      "phenotypeRichness": 0.28,
      "sliceQuality": 0.25,
      "calciumSignal": 0.35,
      "chamberGeometry": 0.28,
      "vesselClarity": 0.29,
      "studyKind": "ccta",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 39.66,
      "hitlIntegrity": 4.57,
      "phenotypeConfidence": 9.25,
      "structureCompleteness": 33.55,
      "planCoherence": 0,
      "overall": 16.43
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 28.98,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 29.09,
      "planCoherence": 0,
      "overall": 16.84
    }
  },
  {
    "id": "ccs-006",
    "input": {
      "contrastQuality": 0.33,
      "motionArtifact": 0.52,
      "expertAnnotationCoverage": 0.29,
      "structureCoverage": 0.32,
      "foundationPrior": 0.31,
      "phenotypeRichness": 0.33,
      "sliceQuality": 0.29,
      "calciumSignal": 0.29,
      "chamberGeometry": 0.32,
      "vesselClarity": 0.28,
      "studyKind": "cac",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 47.81,
      "hitlIntegrity": 51.67,
      "phenotypeConfidence": 53.15,
      "structureCompleteness": 40.06,
      "planCoherence": 53.54,
      "overall": 49.7
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 30.09,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 29.79,
      "planCoherence": 0,
      "overall": 17.37
    }
  },
  {
    "id": "ccs-007",
    "input": {
      "contrastQuality": 0.37,
      "motionArtifact": 0.52,
      "expertAnnotationCoverage": 0.33,
      "structureCoverage": 0.37,
      "foundationPrior": 0.35,
      "phenotypeRichness": 0.37,
      "sliceQuality": 0.32,
      "calciumSignal": 0.33,
      "chamberGeometry": 0.37,
      "vesselClarity": 0.32,
      "studyKind": "morphology",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 43.97,
      "hitlIntegrity": 12.71,
      "phenotypeConfidence": 16.64,
      "structureCompleteness": 37.74,
      "planCoherence": 3.21,
      "overall": 22.12
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 31.87,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 31.62,
      "planCoherence": 0,
      "overall": 18.41
    }
  },
  {
    "id": "ccs-008",
    "input": {
      "contrastQuality": 0.34,
      "motionArtifact": 0.52,
      "expertAnnotationCoverage": 0.37,
      "structureCoverage": 0.33,
      "foundationPrior": 0.39,
      "phenotypeRichness": 0.33,
      "sliceQuality": 0.36,
      "calciumSignal": 0.37,
      "chamberGeometry": 0.33,
      "vesselClarity": 0.36,
      "studyKind": "functional",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 43.82,
      "hitlIntegrity": 15.17,
      "phenotypeConfidence": 16.45,
      "structureCompleteness": 36.95,
      "planCoherence": 4.78,
      "overall": 22.8
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 31.15,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 30.67,
      "planCoherence": 0,
      "overall": 17.93
    }
  },
  {
    "id": "ccs-009",
    "input": {
      "contrastQuality": 0.38,
      "motionArtifact": 0.46,
      "expertAnnotationCoverage": 0.41,
      "structureCoverage": 0.37,
      "foundationPrior": 0.38,
      "phenotypeRichness": 0.38,
      "sliceQuality": 0.4,
      "calciumSignal": 0.4,
      "chamberGeometry": 0.37,
      "vesselClarity": 0.35,
      "studyKind": "mixed",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 56.33,
      "hitlIntegrity": 63.15,
      "phenotypeConfidence": 63.37,
      "structureCompleteness": 47.88,
      "planCoherence": 64.83,
      "overall": 59.69
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 32.6,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 31.69,
      "planCoherence": 0,
      "overall": 18.65
    }
  },
  {
    "id": "ccs-010",
    "input": {
      "contrastQuality": 0.43,
      "motionArtifact": 0.46,
      "expertAnnotationCoverage": 0.37,
      "structureCoverage": 0.41,
      "foundationPrior": 0.42,
      "phenotypeRichness": 0.42,
      "sliceQuality": 0.37,
      "calciumSignal": 0.44,
      "chamberGeometry": 0.41,
      "vesselClarity": 0.39,
      "studyKind": "ccta",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 49.67,
      "hitlIntegrity": 18.64,
      "phenotypeConfidence": 23.69,
      "structureCompleteness": 43.51,
      "planCoherence": 10.42,
      "overall": 28.46
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 34.76,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 34.49,
      "planCoherence": 0,
      "overall": 20.09
    }
  },
  {
    "id": "ccs-011",
    "input": {
      "contrastQuality": 0.47,
      "motionArtifact": 0.46,
      "expertAnnotationCoverage": 0.41,
      "structureCoverage": 0.46,
      "foundationPrior": 0.46,
      "phenotypeRichness": 0.46,
      "sliceQuality": 0.41,
      "calciumSignal": 0.48,
      "chamberGeometry": 0.46,
      "vesselClarity": 0.43,
      "studyKind": "cac",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 50.96,
      "hitlIntegrity": 21.22,
      "phenotypeConfidence": 26.14,
      "structureCompleteness": 45.3,
      "planCoherence": 12.4,
      "overall": 30.52
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 36.74,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 36.43,
      "planCoherence": 0,
      "overall": 21.22
    }
  },
  {
    "id": "ccs-012",
    "input": {
      "contrastQuality": 0.44,
      "motionArtifact": 0.4,
      "expertAnnotationCoverage": 0.45,
      "structureCoverage": 0.42,
      "foundationPrior": 0.44,
      "phenotypeRichness": 0.43,
      "sliceQuality": 0.45,
      "calciumSignal": 0.43,
      "chamberGeometry": 0.42,
      "vesselClarity": 0.42,
      "studyKind": "morphology",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 61.25,
      "hitlIntegrity": 67.51,
      "phenotypeConfidence": 68.73,
      "structureCompleteness": 52.66,
      "planCoherence": 69.82,
      "overall": 64.57
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 35.43,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 34.55,
      "planCoherence": 0,
      "overall": 20.3
    }
  },
  {
    "id": "ccs-013",
    "input": {
      "contrastQuality": 0.48,
      "motionArtifact": 0.4,
      "expertAnnotationCoverage": 0.49,
      "structureCoverage": 0.46,
      "foundationPrior": 0.48,
      "phenotypeRichness": 0.47,
      "sliceQuality": 0.48,
      "calciumSignal": 0.46,
      "chamberGeometry": 0.46,
      "vesselClarity": 0.46,
      "studyKind": "functional",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 53.65,
      "hitlIntegrity": 29.11,
      "phenotypeConfidence": 30.68,
      "structureCompleteness": 46.69,
      "planCoherence": 17.84,
      "overall": 35.15
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 36.99,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 36.12,
      "planCoherence": 0,
      "overall": 21.21
    }
  },
  {
    "id": "ccs-014",
    "input": {
      "contrastQuality": 0.52,
      "motionArtifact": 0.4,
      "expertAnnotationCoverage": 0.53,
      "structureCoverage": 0.51,
      "foundationPrior": 0.53,
      "phenotypeRichness": 0.51,
      "sliceQuality": 0.52,
      "calciumSignal": 0.5,
      "chamberGeometry": 0.51,
      "vesselClarity": 0.5,
      "studyKind": "mixed",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 58.09,
      "hitlIntegrity": 34.05,
      "phenotypeConfidence": 35.61,
      "structureCompleteness": 51.13,
      "planCoherence": 22.2,
      "overall": 39.8
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 39.07,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 38.16,
      "planCoherence": 0,
      "overall": 22.41
    }
  },
  {
    "id": "ccs-015",
    "input": {
      "contrastQuality": 0.57,
      "motionArtifact": 0.34,
      "expertAnnotationCoverage": 0.5,
      "structureCoverage": 0.55,
      "foundationPrior": 0.51,
      "phenotypeRichness": 0.56,
      "sliceQuality": 0.49,
      "calciumSignal": 0.54,
      "chamberGeometry": 0.55,
      "vesselClarity": 0.49,
      "studyKind": "ccta",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 71.59,
      "hitlIntegrity": 75.93,
      "phenotypeConfidence": 81.75,
      "structureCompleteness": 64.41,
      "planCoherence": 81.1,
      "overall": 75.43
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 40.87,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 40.22,
      "planCoherence": 0,
      "overall": 23.52
    }
  },
  {
    "id": "ccs-016",
    "input": {
      "contrastQuality": 0.53,
      "motionArtifact": 0.35,
      "expertAnnotationCoverage": 0.54,
      "structureCoverage": 0.51,
      "foundationPrior": 0.55,
      "phenotypeRichness": 0.52,
      "sliceQuality": 0.53,
      "calciumSignal": 0.57,
      "chamberGeometry": 0.51,
      "vesselClarity": 0.53,
      "studyKind": "cac",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 57.87,
      "hitlIntegrity": 34.54,
      "phenotypeConfidence": 36.62,
      "structureCompleteness": 51.37,
      "planCoherence": 23.85,
      "overall": 40.43
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 39.92,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 39.05,
      "planCoherence": 0,
      "overall": 22.91
    }
  },
  {
    "id": "ccs-017",
    "input": {
      "contrastQuality": 0.58,
      "motionArtifact": 0.35,
      "expertAnnotationCoverage": 0.58,
      "structureCoverage": 0.55,
      "foundationPrior": 0.59,
      "phenotypeRichness": 0.57,
      "sliceQuality": 0.57,
      "calciumSignal": 0.61,
      "chamberGeometry": 0.55,
      "vesselClarity": 0.58,
      "studyKind": "morphology",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 62.11,
      "hitlIntegrity": 39.43,
      "phenotypeConfidence": 41.55,
      "structureCompleteness": 55.7,
      "planCoherence": 28.01,
      "overall": 44.98
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 41.77,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 40.9,
      "planCoherence": 0,
      "overall": 23.98
    }
  },
  {
    "id": "ccs-018",
    "input": {
      "contrastQuality": 0.62,
      "motionArtifact": 0.29,
      "expertAnnotationCoverage": 0.62,
      "structureCoverage": 0.6,
      "foundationPrior": 0.58,
      "phenotypeRichness": 0.61,
      "sliceQuality": 0.61,
      "calciumSignal": 0.56,
      "chamberGeometry": 0.6,
      "vesselClarity": 0.56,
      "studyKind": "functional",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 76.22,
      "hitlIntegrity": 83.32,
      "phenotypeConfidence": 86.53,
      "structureCompleteness": 67.82,
      "planCoherence": 85.22,
      "overall": 80.47
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 43.25,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 41.91,
      "planCoherence": 0,
      "overall": 24.71
    }
  },
  {
    "id": "ccs-019",
    "input": {
      "contrastQuality": 0.66,
      "motionArtifact": 0.29,
      "expertAnnotationCoverage": 0.66,
      "structureCoverage": 0.64,
      "foundationPrior": 0.62,
      "phenotypeRichness": 0.65,
      "sliceQuality": 0.64,
      "calciumSignal": 0.59,
      "chamberGeometry": 0.64,
      "vesselClarity": 0.6,
      "studyKind": "mixed",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 68,
      "hitlIntegrity": 48.8,
      "phenotypeConfidence": 50.1,
      "structureCompleteness": 61,
      "planCoherence": 35.51,
      "overall": 52.49
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 44.88,
      "hitlIntegrity": 0.03,
      "phenotypeConfidence": 0,
      "structureCompleteness": 43.56,
      "planCoherence": 0,
      "overall": 25.66
    }
  },
  {
    "id": "ccs-020",
    "input": {
      "contrastQuality": 0.63,
      "motionArtifact": 0.29,
      "expertAnnotationCoverage": 0.62,
      "structureCoverage": 0.6,
      "foundationPrior": 0.66,
      "phenotypeRichness": 0.62,
      "sliceQuality": 0.61,
      "calciumSignal": 0.63,
      "chamberGeometry": 0.6,
      "vesselClarity": 0.65,
      "studyKind": "ccta",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 67.82,
      "hitlIntegrity": 45.83,
      "phenotypeConfidence": 49.33,
      "structureCompleteness": 61.03,
      "planCoherence": 36.03,
      "overall": 51.67
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 44.71,
      "hitlIntegrity": 0,
      "phenotypeConfidence": 0,
      "structureCompleteness": 43.95,
      "planCoherence": 0,
      "overall": 25.72
    }
  },
  {
    "id": "ccs-021",
    "input": {
      "contrastQuality": 0.67,
      "motionArtifact": 0.23,
      "expertAnnotationCoverage": 0.66,
      "structureCoverage": 0.65,
      "foundationPrior": 0.64,
      "phenotypeRichness": 0.66,
      "sliceQuality": 0.65,
      "calciumSignal": 0.67,
      "chamberGeometry": 0.65,
      "vesselClarity": 0.63,
      "studyKind": "cac",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 80.89,
      "hitlIntegrity": 87.39,
      "phenotypeConfidence": 91.45,
      "structureCompleteness": 73.3,
      "planCoherence": 89.67,
      "overall": 85.14
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 46.32,
      "hitlIntegrity": 0.49,
      "phenotypeConfidence": 0,
      "structureCompleteness": 45.07,
      "planCoherence": 0,
      "overall": 26.56
    }
  },
  {
    "id": "ccs-022",
    "input": {
      "contrastQuality": 0.72,
      "motionArtifact": 0.23,
      "expertAnnotationCoverage": 0.7,
      "structureCoverage": 0.69,
      "foundationPrior": 0.68,
      "phenotypeRichness": 0.7,
      "sliceQuality": 0.69,
      "calciumSignal": 0.71,
      "chamberGeometry": 0.69,
      "vesselClarity": 0.67,
      "studyKind": "morphology",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 72.27,
      "hitlIntegrity": 53.53,
      "phenotypeConfidence": 55.79,
      "structureCompleteness": 65.88,
      "planCoherence": 41.24,
      "overall": 57.54
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 48.2,
      "hitlIntegrity": 2.6,
      "phenotypeConfidence": 0,
      "structureCompleteness": 46.87,
      "planCoherence": 0,
      "overall": 27.84
    }
  },
  {
    "id": "ccs-023",
    "input": {
      "contrastQuality": 0.76,
      "motionArtifact": 0.23,
      "expertAnnotationCoverage": 0.74,
      "structureCoverage": 0.73,
      "foundationPrior": 0.73,
      "phenotypeRichness": 0.75,
      "sliceQuality": 0.73,
      "calciumSignal": 0.74,
      "chamberGeometry": 0.73,
      "vesselClarity": 0.72,
      "studyKind": "functional",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 74.66,
      "hitlIntegrity": 56.92,
      "phenotypeConfidence": 59.25,
      "structureCompleteness": 68.37,
      "planCoherence": 43.99,
      "overall": 60.49
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 50.18,
      "hitlIntegrity": 4.78,
      "phenotypeConfidence": 0,
      "structureCompleteness": 48.84,
      "planCoherence": 1.08,
      "overall": 29.42
    }
  },
  {
    "id": "ccs-024",
    "input": {
      "contrastQuality": 0.73,
      "motionArtifact": 0.17,
      "expertAnnotationCoverage": 0.78,
      "structureCoverage": 0.69,
      "foundationPrior": 0.71,
      "phenotypeRichness": 0.71,
      "sliceQuality": 0.77,
      "calciumSignal": 0.69,
      "chamberGeometry": 0.69,
      "vesselClarity": 0.7,
      "studyKind": "mixed",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 89.96,
      "hitlIntegrity": 99.79,
      "phenotypeConfidence": 100,
      "structureCompleteness": 80.44,
      "planCoherence": 100,
      "overall": 94.81
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 48.54,
      "hitlIntegrity": 6.4,
      "phenotypeConfidence": 0,
      "structureCompleteness": 46.55,
      "planCoherence": 2.58,
      "overall": 28.75
    }
  },
  {
    "id": "ccs-025",
    "input": {
      "contrastQuality": 0.77,
      "motionArtifact": 0.17,
      "expertAnnotationCoverage": 0.75,
      "structureCoverage": 0.74,
      "foundationPrior": 0.75,
      "phenotypeRichness": 0.75,
      "sliceQuality": 0.73,
      "calciumSignal": 0.73,
      "chamberGeometry": 0.74,
      "vesselClarity": 0.74,
      "studyKind": "ccta",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 78.18,
      "hitlIntegrity": 60.94,
      "phenotypeConfidence": 64.13,
      "structureCompleteness": 71.41,
      "planCoherence": 49.92,
      "overall": 64.78
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 51.05,
      "hitlIntegrity": 5.67,
      "phenotypeConfidence": 0,
      "structureCompleteness": 49.82,
      "planCoherence": 2.74,
      "overall": 30.38
    }
  },
  {
    "id": "ccs-026",
    "input": {
      "contrastQuality": 0.81,
      "motionArtifact": 0.18,
      "expertAnnotationCoverage": 0.79,
      "structureCoverage": 0.78,
      "foundationPrior": 0.79,
      "phenotypeRichness": 0.8,
      "sliceQuality": 0.77,
      "calciumSignal": 0.76,
      "chamberGeometry": 0.78,
      "vesselClarity": 0.79,
      "studyKind": "cac",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 78.05,
      "hitlIntegrity": 62.1,
      "phenotypeConfidence": 64.61,
      "structureCompleteness": 71.75,
      "planCoherence": 49.25,
      "overall": 65.07
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 52.87,
      "hitlIntegrity": 7.75,
      "phenotypeConfidence": 1.28,
      "structureCompleteness": 51.64,
      "planCoherence": 4.59,
      "overall": 32.17
    }
  },
  {
    "id": "ccs-027",
    "input": {
      "contrastQuality": 0.86,
      "motionArtifact": 0.12,
      "expertAnnotationCoverage": 0.83,
      "structureCoverage": 0.82,
      "foundationPrior": 0.77,
      "phenotypeRichness": 0.84,
      "sliceQuality": 0.81,
      "calciumSignal": 0.8,
      "chamberGeometry": 0.82,
      "vesselClarity": 0.77,
      "studyKind": "morphology",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 97.81,
      "hitlIntegrity": 100,
      "phenotypeConfidence": 100,
      "structureCompleteness": 90.14,
      "planCoherence": 100,
      "overall": 97.98
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 54.24,
      "hitlIntegrity": 9.91,
      "phenotypeConfidence": 2.6,
      "structureCompleteness": 52.48,
      "planCoherence": 6.55,
      "overall": 33.58
    }
  },
  {
    "id": "ccs-028",
    "input": {
      "contrastQuality": 0.82,
      "motionArtifact": 0.12,
      "expertAnnotationCoverage": 0.87,
      "structureCoverage": 0.78,
      "foundationPrior": 0.82,
      "phenotypeRichness": 0.8,
      "sliceQuality": 0.85,
      "calciumSignal": 0.84,
      "chamberGeometry": 0.78,
      "vesselClarity": 0.81,
      "studyKind": "functional",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 81.62,
      "hitlIntegrity": 70.29,
      "phenotypeConfidence": 69.56,
      "structureCompleteness": 74.45,
      "planCoherence": 55.51,
      "overall": 70.4
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 53.39,
      "hitlIntegrity": 11.54,
      "phenotypeConfidence": 3.73,
      "structureCompleteness": 51.41,
      "planCoherence": 8.25,
      "overall": 33.66
    }
  },
  {
    "id": "ccs-029",
    "input": {
      "contrastQuality": 0.87,
      "motionArtifact": 0.12,
      "expertAnnotationCoverage": 0.91,
      "structureCoverage": 0.83,
      "foundationPrior": 0.86,
      "phenotypeRichness": 0.85,
      "sliceQuality": 0.89,
      "calciumSignal": 0.88,
      "chamberGeometry": 0.83,
      "vesselClarity": 0.86,
      "studyKind": "mixed",
      "plan": "auto_only"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 86.07,
      "hitlIntegrity": 75.81,
      "phenotypeConfidence": 75.45,
      "structureCompleteness": 79.34,
      "planCoherence": 60.75,
      "overall": 75.64
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 55.3,
      "hitlIntegrity": 13.75,
      "phenotypeConfidence": 5.94,
      "structureCompleteness": 53.35,
      "planCoherence": 10.3,
      "overall": 35.68
    }
  },
  {
    "id": "ccs-030",
    "input": {
      "contrastQuality": 0.91,
      "motionArtifact": 0.06,
      "expertAnnotationCoverage": 0.87,
      "structureCoverage": 0.87,
      "foundationPrior": 0.84,
      "phenotypeRichness": 0.89,
      "sliceQuality": 0.85,
      "calciumSignal": 0.82,
      "chamberGeometry": 0.87,
      "vesselClarity": 0.84,
      "studyKind": "ccta",
      "plan": "hitl_foundation"
    },
    "expectedHitlFoundation": {
      "mode": "hitl_foundation",
      "segmentationQuality": 100,
      "hitlIntegrity": 100,
      "phenotypeConfidence": 100,
      "structureCompleteness": 96.19,
      "planCoherence": 100,
      "overall": 99.39
    },
    "expectedAutoOnly": {
      "mode": "auto_only",
      "segmentationQuality": 56.64,
      "hitlIntegrity": 12.6,
      "phenotypeConfidence": 5.21,
      "structureCompleteness": 55.06,
      "planCoherence": 10.1,
      "overall": 36.31
    }
  }
];
