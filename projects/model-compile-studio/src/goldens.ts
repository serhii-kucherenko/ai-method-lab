import type { CompileInput, CompileQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CompileInput;
  expectedMultiPass: CompileQuality;
  expectedSinglePass: CompileQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "graphComplexity": 0.13,
      "operatorFusionPotential": 0.17,
      "memoryLayoutFit": 0.2,
      "quantizationHeadroom": 0.09,
      "targetAffinity": 0.07,
      "irDepth": 0.14,
      "kernelCoverage": 0.13,
      "passBudget": 3,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 17.25,
      "memoryScore": 16.51,
      "targetFitScore": 14.63,
      "passEfficiency": 21.85,
      "predictedArtifactTier": "mlir",
      "confidence": 5.99,
      "fusionContribution": 14.18,
      "memoryContribution": 14.15,
      "targetContribution": 9.7,
      "overall": 15.79
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 13.39,
      "memoryScore": 12.72,
      "targetFitScore": 10.54,
      "passEfficiency": 26.08,
      "predictedArtifactTier": "mlir",
      "confidence": 2.67,
      "fusionContribution": 15.08,
      "memoryContribution": 15.38,
      "targetContribution": 0,
      "overall": 11.4
    }
  },
  {
    "id": "std-002",
    "input": {
      "graphComplexity": 0.17,
      "operatorFusionPotential": 0.21,
      "memoryLayoutFit": 0.25,
      "quantizationHeadroom": 0.13,
      "targetAffinity": 0.12,
      "irDepth": 0.18,
      "kernelCoverage": 0.18,
      "passBudget": 4,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 24.58,
      "memoryScore": 23.58,
      "targetFitScore": 22.01,
      "passEfficiency": 34.43,
      "predictedArtifactTier": "mlir",
      "confidence": 11.67,
      "fusionContribution": 20.89,
      "memoryContribution": 21.05,
      "targetContribution": 17.67,
      "overall": 23.36
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 17.12,
      "memoryScore": 16.53,
      "targetFitScore": 13.95,
      "passEfficiency": 27.4,
      "predictedArtifactTier": "mlir",
      "confidence": 2.59,
      "fusionContribution": 19.34,
      "memoryContribution": 19.86,
      "targetContribution": 0,
      "overall": 14.64
    }
  },
  {
    "id": "std-003",
    "input": {
      "graphComplexity": 0.22,
      "operatorFusionPotential": 0.26,
      "memoryLayoutFit": 0.21,
      "quantizationHeadroom": 0.17,
      "targetAffinity": 0.16,
      "irDepth": 0.23,
      "kernelCoverage": 0.23,
      "passBudget": 3,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 25.62,
      "memoryScore": 22.95,
      "targetFitScore": 22.76,
      "passEfficiency": 26.1,
      "predictedArtifactTier": "mlir",
      "confidence": 7.92,
      "fusionContribution": 22.88,
      "memoryContribution": 18.62,
      "targetContribution": 16.72,
      "overall": 22.75
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 21.52,
      "memoryScore": 17.15,
      "targetFitScore": 17.95,
      "passEfficiency": 28.9,
      "predictedArtifactTier": "mlir",
      "confidence": 5.57,
      "fusionContribution": 24.34,
      "memoryContribution": 20.24,
      "targetContribution": 0,
      "overall": 17.74
    }
  },
  {
    "id": "std-004",
    "input": {
      "graphComplexity": 0.26,
      "operatorFusionPotential": 0.21,
      "memoryLayoutFit": 0.26,
      "quantizationHeadroom": 0.21,
      "targetAffinity": 0.21,
      "irDepth": 0.27,
      "kernelCoverage": 0.17,
      "passBudget": 4,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 28.11,
      "memoryScore": 28.37,
      "targetFitScore": 27.65,
      "passEfficiency": 36.48,
      "predictedArtifactTier": "mlir",
      "confidence": 10.93,
      "fusionContribution": 22.74,
      "memoryContribution": 26.2,
      "targetContribution": 23.45,
      "overall": 27.34
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 18.53,
      "memoryScore": 20.96,
      "targetFitScore": 19.05,
      "passEfficiency": 28.9,
      "predictedArtifactTier": "mlir",
      "confidence": 3.91,
      "fusionContribution": 21.06,
      "memoryContribution": 24.72,
      "targetContribution": 0,
      "overall": 17.55
    }
  },
  {
    "id": "std-005",
    "input": {
      "graphComplexity": 0.21,
      "operatorFusionPotential": 0.26,
      "memoryLayoutFit": 0.32,
      "quantizationHeadroom": 0.25,
      "targetAffinity": 0.25,
      "irDepth": 0.21,
      "kernelCoverage": 0.22,
      "passBudget": 5,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 30.21,
      "memoryScore": 29.92,
      "targetFitScore": 30.16,
      "passEfficiency": 34.57,
      "predictedArtifactTier": "mlir",
      "confidence": 6.13,
      "fusionContribution": 22.43,
      "memoryContribution": 25.28,
      "targetContribution": 22.99,
      "overall": 28.54
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 21.13,
      "memoryScore": 23.43,
      "targetFitScore": 17.01,
      "passEfficiency": 28.42,
      "predictedArtifactTier": "mlir",
      "confidence": 4.3,
      "fusionContribution": 23.86,
      "memoryContribution": 27.48,
      "targetContribution": 0,
      "overall": 19.01
    }
  },
  {
    "id": "std-006",
    "input": {
      "graphComplexity": 0.25,
      "operatorFusionPotential": 0.3,
      "memoryLayoutFit": 0.28,
      "quantizationHeadroom": 0.29,
      "targetAffinity": 0.18,
      "irDepth": 0.26,
      "kernelCoverage": 0.28,
      "passBudget": 4,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 33.94,
      "memoryScore": 32.4,
      "targetFitScore": 30.45,
      "passEfficiency": 38.43,
      "predictedArtifactTier": "mlir",
      "confidence": 12.21,
      "fusionContribution": 30.65,
      "memoryContribution": 29.53,
      "targetContribution": 24.86,
      "overall": 31.18
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 25.07,
      "memoryScore": 24.05,
      "targetFitScore": 20.77,
      "passEfficiency": 30.04,
      "predictedArtifactTier": "mlir",
      "confidence": 3.02,
      "fusionContribution": 28.38,
      "memoryContribution": 27.86,
      "targetContribution": 0,
      "overall": 21.36
    }
  },
  {
    "id": "std-007",
    "input": {
      "graphComplexity": 0.29,
      "operatorFusionPotential": 0.35,
      "memoryLayoutFit": 0.33,
      "quantizationHeadroom": 0.22,
      "targetAffinity": 0.23,
      "irDepth": 0.3,
      "kernelCoverage": 0.33,
      "passBudget": 5,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 36.41,
      "memoryScore": 33.11,
      "targetFitScore": 33.02,
      "passEfficiency": 39.02,
      "predictedArtifactTier": "mlir",
      "confidence": 9.38,
      "fusionContribution": 31.17,
      "memoryContribution": 26.72,
      "targetContribution": 24.48,
      "overall": 32.65
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 29.29,
      "memoryScore": 24.41,
      "targetFitScore": 24.18,
      "passEfficiency": 31.36,
      "predictedArtifactTier": "mlir",
      "confidence": 6.88,
      "fusionContribution": 33.16,
      "memoryContribution": 29.04,
      "targetContribution": 0,
      "overall": 24.31
    }
  },
  {
    "id": "std-008",
    "input": {
      "graphComplexity": 0.34,
      "operatorFusionPotential": 0.3,
      "memoryLayoutFit": 0.38,
      "quantizationHeadroom": 0.26,
      "targetAffinity": 0.27,
      "irDepth": 0.34,
      "kernelCoverage": 0.26,
      "passBudget": 6,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 39.53,
      "memoryScore": 39.19,
      "targetFitScore": 38.15,
      "passEfficiency": 49.2,
      "predictedArtifactTier": "mlir",
      "confidence": 11.84,
      "fusionContribution": 32.23,
      "memoryContribution": 35.53,
      "targetContribution": 32.19,
      "overall": 37.61
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 26.27,
      "memoryScore": 28.23,
      "targetFitScore": 25.52,
      "passEfficiency": 31.24,
      "predictedArtifactTier": "mlir",
      "confidence": 3.96,
      "fusionContribution": 29.84,
      "memoryContribution": 33.52,
      "targetContribution": 0,
      "overall": 24.01
    }
  },
  {
    "id": "std-009",
    "input": {
      "graphComplexity": 0.38,
      "operatorFusionPotential": 0.35,
      "memoryLayoutFit": 0.34,
      "quantizationHeadroom": 0.3,
      "targetAffinity": 0.32,
      "irDepth": 0.39,
      "kernelCoverage": 0.32,
      "passBudget": 4,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 38.79,
      "memoryScore": 37.13,
      "targetFitScore": 37.71,
      "passEfficiency": 36.48,
      "predictedArtifactTier": "mlir",
      "confidence": 6.75,
      "fusionContribution": 32.79,
      "memoryContribution": 31.19,
      "targetContribution": 29.12,
      "overall": 35.31
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 30.7,
      "memoryScore": 28.84,
      "targetFitScore": 29.28,
      "passEfficiency": 32.86,
      "predictedArtifactTier": "mlir",
      "confidence": 3.42,
      "fusionContribution": 34.88,
      "memoryContribution": 33.9,
      "targetContribution": 0,
      "overall": 26.65
    }
  },
  {
    "id": "std-010",
    "input": {
      "graphComplexity": 0.33,
      "operatorFusionPotential": 0.39,
      "memoryLayoutFit": 0.39,
      "quantizationHeadroom": 0.34,
      "targetAffinity": 0.36,
      "irDepth": 0.33,
      "kernelCoverage": 0.37,
      "passBudget": 6,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 47.12,
      "memoryScore": 44.5,
      "targetFitScore": 46.27,
      "passEfficiency": 51.15,
      "predictedArtifactTier": "mlir",
      "confidence": 12.35,
      "fusionContribution": 40.13,
      "memoryContribution": 38.35,
      "targetContribution": 41.19,
      "overall": 43.74
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 32.81,
      "memoryScore": 30.94,
      "targetFitScore": 27.24,
      "passEfficiency": 32.38,
      "predictedArtifactTier": "mlir",
      "confidence": 3.87,
      "fusionContribution": 37.16,
      "memoryContribution": 36.18,
      "targetContribution": 0,
      "overall": 27.81
    }
  },
  {
    "id": "std-011",
    "input": {
      "graphComplexity": 0.37,
      "operatorFusionPotential": 0.44,
      "memoryLayoutFit": 0.44,
      "quantizationHeadroom": 0.38,
      "targetAffinity": 0.41,
      "irDepth": 0.37,
      "kernelCoverage": 0.43,
      "passBudget": 7,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 49.44,
      "memoryScore": 46.24,
      "targetFitScore": 48.53,
      "passEfficiency": 51.93,
      "predictedArtifactTier": "mlir",
      "confidence": 7.83,
      "fusionContribution": 39.67,
      "memoryContribution": 37.41,
      "targetContribution": 37.82,
      "overall": 45.22
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 37.24,
      "memoryScore": 34.75,
      "targetFitScore": 30.86,
      "passEfficiency": 33.82,
      "predictedArtifactTier": "mlir",
      "confidence": 4.49,
      "fusionContribution": 42.2,
      "memoryContribution": 40.66,
      "targetContribution": 0,
      "overall": 31.46
    }
  },
  {
    "id": "std-012",
    "input": {
      "graphComplexity": 0.42,
      "operatorFusionPotential": 0.39,
      "memoryLayoutFit": 0.41,
      "quantizationHeadroom": 0.42,
      "targetAffinity": 0.33,
      "irDepth": 0.42,
      "kernelCoverage": 0.36,
      "passBudget": 5,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 48.05,
      "memoryScore": 47.68,
      "targetFitScore": 46.09,
      "passEfficiency": 48.62,
      "predictedArtifactTier": "mlir",
      "confidence": 11.45,
      "fusionContribution": 41.99,
      "memoryContribution": 44.01,
      "targetContribution": 39.38,
      "overall": 44.52
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 34.22,
      "memoryScore": 35.75,
      "targetFitScore": 32.34,
      "passEfficiency": 33.88,
      "predictedArtifactTier": "mlir",
      "confidence": 3.53,
      "fusionContribution": 38.88,
      "memoryContribution": 41.52,
      "targetContribution": 0,
      "overall": 30.63
    }
  },
  {
    "id": "std-013",
    "input": {
      "graphComplexity": 0.46,
      "operatorFusionPotential": 0.44,
      "memoryLayoutFit": 0.46,
      "quantizationHeadroom": 0.45,
      "targetAffinity": 0.38,
      "irDepth": 0.46,
      "kernelCoverage": 0.41,
      "passBudget": 7,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 50.79,
      "memoryScore": 49.17,
      "targetFitScore": 48.55,
      "passEfficiency": 53.78,
      "predictedArtifactTier": "mlir",
      "confidence": 8.54,
      "fusionContribution": 41.04,
      "memoryContribution": 42.04,
      "targetContribution": 36.14,
      "overall": 46.6
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 38.44,
      "memoryScore": 39.25,
      "targetFitScore": 35.75,
      "passEfficiency": 35.2,
      "predictedArtifactTier": "mlir",
      "confidence": 2.81,
      "fusionContribution": 43.66,
      "memoryContribution": 45.7,
      "targetContribution": 0,
      "overall": 33.91
    }
  },
  {
    "id": "std-014",
    "input": {
      "graphComplexity": 0.5,
      "operatorFusionPotential": 0.48,
      "memoryLayoutFit": 0.51,
      "quantizationHeadroom": 0.39,
      "targetAffinity": 0.43,
      "irDepth": 0.5,
      "kernelCoverage": 0.47,
      "passBudget": 8,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 60.6,
      "memoryScore": 57.41,
      "targetFitScore": 58.36,
      "passEfficiency": 66.57,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 14.57,
      "fusionContribution": 52.03,
      "memoryContribution": 50.01,
      "targetContribution": 50.85,
      "overall": 55.94
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 42.39,
      "memoryScore": 39.92,
      "targetFitScore": 39.37,
      "passEfficiency": 36.64,
      "predictedArtifactTier": "mlir",
      "confidence": 4.47,
      "fusionContribution": 48.18,
      "memoryContribution": 47.18,
      "targetContribution": 0,
      "overall": 36.6
    }
  },
  {
    "id": "std-015",
    "input": {
      "graphComplexity": 0.45,
      "operatorFusionPotential": 0.53,
      "memoryLayoutFit": 0.47,
      "quantizationHeadroom": 0.43,
      "targetAffinity": 0.47,
      "irDepth": 0.45,
      "kernelCoverage": 0.52,
      "passBudget": 6,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 56.28,
      "memoryScore": 51.93,
      "targetFitScore": 54.84,
      "passEfficiency": 51.15,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 7.94,
      "fusionContribution": 47.92,
      "memoryContribution": 41.73,
      "targetContribution": 43.38,
      "overall": 50.47
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 44.98,
      "memoryScore": 38.82,
      "targetFitScore": 37.47,
      "passEfficiency": 36.34,
      "predictedArtifactTier": "mlir",
      "confidence": 8.16,
      "fusionContribution": 50.98,
      "memoryContribution": 45.36,
      "targetContribution": 0,
      "overall": 37.49
    }
  },
  {
    "id": "std-016",
    "input": {
      "graphComplexity": 0.49,
      "operatorFusionPotential": 0.48,
      "memoryLayoutFit": 0.52,
      "quantizationHeadroom": 0.47,
      "targetAffinity": 0.52,
      "irDepth": 0.49,
      "kernelCoverage": 0.46,
      "passBudget": 8,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 62.31,
      "memoryScore": 60.31,
      "targetFitScore": 63.04,
      "passEfficiency": 66.12,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 13.06,
      "fusionContribution": 51.52,
      "memoryContribution": 52.83,
      "targetContribution": 56.63,
      "overall": 58.36
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 41.99,
      "memoryScore": 42.64,
      "targetFitScore": 38.57,
      "passEfficiency": 36.34,
      "predictedArtifactTier": "mlir",
      "confidence": 2.65,
      "fusionContribution": 47.7,
      "memoryContribution": 49.84,
      "targetContribution": 0,
      "overall": 36.84
    }
  },
  {
    "id": "std-017",
    "input": {
      "graphComplexity": 0.54,
      "operatorFusionPotential": 0.53,
      "memoryLayoutFit": 0.57,
      "quantizationHeadroom": 0.51,
      "targetAffinity": 0.56,
      "irDepth": 0.54,
      "kernelCoverage": 0.51,
      "passBudget": 9,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 63.26,
      "memoryScore": 60.69,
      "targetFitScore": 63.45,
      "passEfficiency": 66.95,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 7.94,
      "fusionContribution": 49.54,
      "memoryContribution": 50.18,
      "targetContribution": 49.48,
      "overall": 58.51
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 46.39,
      "memoryScore": 46.62,
      "targetFitScore": 42.57,
      "passEfficiency": 37.84,
      "predictedArtifactTier": "mlir",
      "confidence": 2.23,
      "fusionContribution": 52.7,
      "memoryContribution": 54.54,
      "targetContribution": 0,
      "overall": 40.47
    }
  },
  {
    "id": "std-018",
    "input": {
      "graphComplexity": 0.58,
      "operatorFusionPotential": 0.57,
      "memoryLayoutFit": 0.53,
      "quantizationHeadroom": 0.55,
      "targetAffinity": 0.49,
      "irDepth": 0.58,
      "kernelCoverage": 0.57,
      "passBudget": 7,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 68.97,
      "memoryScore": 65.5,
      "targetFitScore": 66.07,
      "passEfficiency": 65.98,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 14.82,
      "fusionContribution": 61.8,
      "memoryContribution": 57.98,
      "targetContribution": 57.84,
      "overall": 62.68
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 50.34,
      "memoryScore": 47.07,
      "targetFitScore": 46.19,
      "passEfficiency": 39.28,
      "predictedArtifactTier": "mlir",
      "confidence": 5.27,
      "fusionContribution": 57.22,
      "memoryContribution": 54.7,
      "targetContribution": 0,
      "overall": 43.27
    }
  },
  {
    "id": "std-019",
    "input": {
      "graphComplexity": 0.62,
      "operatorFusionPotential": 0.62,
      "memoryLayoutFit": 0.58,
      "quantizationHeadroom": 0.58,
      "targetAffinity": 0.54,
      "irDepth": 0.62,
      "kernelCoverage": 0.62,
      "passBudget": 9,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 70.02,
      "memoryScore": 65.49,
      "targetFitScore": 66.92,
      "passEfficiency": 71.15,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 10.85,
      "fusionContribution": 58.28,
      "memoryContribution": 54.17,
      "targetContribution": 50.98,
      "overall": 63.33
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 54.56,
      "memoryScore": 50.57,
      "targetFitScore": 49.6,
      "passEfficiency": 40.6,
      "predictedArtifactTier": "mlir",
      "confidence": 5.99,
      "fusionContribution": 62,
      "memoryContribution": 58.88,
      "targetContribution": 0,
      "overall": 46.72
    }
  },
  {
    "id": "std-020",
    "input": {
      "graphComplexity": 0.57,
      "operatorFusionPotential": 0.57,
      "memoryLayoutFit": 0.64,
      "quantizationHeadroom": 0.62,
      "targetAffinity": 0.58,
      "irDepth": 0.57,
      "kernelCoverage": 0.55,
      "passBudget": 10,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 74.44,
      "memoryScore": 73.19,
      "targetFitScore": 74.31,
      "passEfficiency": 79.08,
      "predictedArtifactTier": "binary",
      "confidence": 13.3,
      "fusionContribution": 61,
      "memoryContribution": 65.57,
      "targetContribution": 65.36,
      "overall": 69.56
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 49.73,
      "memoryScore": 53.21,
      "targetFitScore": 45.18,
      "passEfficiency": 38.86,
      "predictedArtifactTier": "mlir",
      "confidence": 5.48,
      "fusionContribution": 56.48,
      "memoryContribution": 61.86,
      "targetContribution": 0,
      "overall": 44.58
    }
  },
  {
    "id": "std-021",
    "input": {
      "graphComplexity": 0.61,
      "operatorFusionPotential": 0.62,
      "memoryLayoutFit": 0.6,
      "quantizationHeadroom": 0.56,
      "targetAffinity": 0.63,
      "irDepth": 0.61,
      "kernelCoverage": 0.61,
      "passBudget": 8,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 70.28,
      "memoryScore": 66.44,
      "targetFitScore": 70.29,
      "passEfficiency": 66.12,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 7.34,
      "fusionContribution": 57.83,
      "memoryContribution": 54.3,
      "targetContribution": 55.78,
      "overall": 63.92
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 54.17,
      "memoryScore": 50.52,
      "targetFitScore": 48.8,
      "passEfficiency": 40.3,
      "predictedArtifactTier": "mlir",
      "confidence": 5.65,
      "fusionContribution": 61.52,
      "memoryContribution": 59.02,
      "targetContribution": 0,
      "overall": 46.36
    }
  },
  {
    "id": "std-022",
    "input": {
      "graphComplexity": 0.66,
      "operatorFusionPotential": 0.66,
      "memoryLayoutFit": 0.65,
      "quantizationHeadroom": 0.6,
      "targetAffinity": 0.67,
      "irDepth": 0.65,
      "kernelCoverage": 0.66,
      "passBudget": 10,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 83.13,
      "memoryScore": 78.34,
      "targetFitScore": 82.62,
      "passEfficiency": 83.28,
      "predictedArtifactTier": "binary",
      "confidence": 13.68,
      "fusionContribution": 71.28,
      "memoryContribution": 67.31,
      "targetContribution": 74.37,
      "overall": 76.2
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 58.08,
      "memoryScore": 54.33,
      "targetFitScore": 52.66,
      "passEfficiency": 41.62,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 5.75,
      "fusionContribution": 66,
      "memoryContribution": 63.5,
      "targetContribution": 0,
      "overall": 49.77
    }
  },
  {
    "id": "std-023",
    "input": {
      "graphComplexity": 0.7,
      "operatorFusionPotential": 0.71,
      "memoryLayoutFit": 0.7,
      "quantizationHeadroom": 0.64,
      "targetAffinity": 0.72,
      "irDepth": 0.7,
      "kernelCoverage": 0.72,
      "passBudget": 11,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 82.63,
      "memoryScore": 77.39,
      "targetFitScore": 82.04,
      "passEfficiency": 84.32,
      "predictedArtifactTier": "binary",
      "confidence": 9.17,
      "fusionContribution": 66.78,
      "memoryContribution": 62.74,
      "targetContribution": 64.48,
      "overall": 75.36
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 62.51,
      "memoryScore": 58.32,
      "targetFitScore": 56.42,
      "passEfficiency": 43.24,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 6.19,
      "fusionContribution": 71.04,
      "memoryContribution": 68.2,
      "targetContribution": 0,
      "overall": 53.48
    }
  },
  {
    "id": "std-024",
    "input": {
      "graphComplexity": 0.75,
      "operatorFusionPotential": 0.66,
      "memoryLayoutFit": 0.66,
      "quantizationHeadroom": 0.68,
      "targetAffinity": 0.64,
      "irDepth": 0.74,
      "kernelCoverage": 0.65,
      "passBudget": 9,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 83.91,
      "memoryScore": 81.11,
      "targetFitScore": 82.21,
      "passEfficiency": 80.75,
      "predictedArtifactTier": "binary",
      "confidence": 14.45,
      "fusionContribution": 73.14,
      "memoryContribution": 72.46,
      "targetContribution": 72.35,
      "overall": 76.9
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 59.49,
      "memoryScore": 58.76,
      "targetFitScore": 57.76,
      "passEfficiency": 43.12,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 2.73,
      "fusionContribution": 67.72,
      "memoryContribution": 68.36,
      "targetContribution": 0,
      "overall": 52.16
    }
  },
  {
    "id": "std-025",
    "input": {
      "graphComplexity": 0.69,
      "operatorFusionPotential": 0.71,
      "memoryLayoutFit": 0.71,
      "quantizationHeadroom": 0.71,
      "targetAffinity": 0.69,
      "irDepth": 0.68,
      "kernelCoverage": 0.7,
      "passBudget": 10,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 81.31,
      "memoryScore": 77.76,
      "targetFitScore": 80.41,
      "passEfficiency": 78.83,
      "predictedArtifactTier": "binary",
      "confidence": 9.07,
      "fusionContribution": 66.08,
      "memoryContribution": 64.71,
      "targetContribution": 62.64,
      "overall": 74.16
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 61.91,
      "memoryScore": 60.55,
      "targetFitScore": 55.27,
      "passEfficiency": 42.64,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 3.36,
      "fusionContribution": 70.3,
      "memoryContribution": 70.34,
      "targetContribution": 0,
      "overall": 53.31
    }
  },
  {
    "id": "std-026",
    "input": {
      "graphComplexity": 0.73,
      "operatorFusionPotential": 0.75,
      "memoryLayoutFit": 0.76,
      "quantizationHeadroom": 0.75,
      "targetAffinity": 0.74,
      "irDepth": 0.73,
      "kernelCoverage": 0.76,
      "passBudget": 12,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 95.36,
      "memoryScore": 91.01,
      "targetFitScore": 94.29,
      "passEfficiency": 96.45,
      "predictedArtifactTier": "binary",
      "confidence": 15.07,
      "fusionContribution": 80.81,
      "memoryContribution": 79.54,
      "targetContribution": 83.82,
      "overall": 87.59
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 65.85,
      "memoryScore": 64.53,
      "targetFitScore": 59.03,
      "passEfficiency": 44.26,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 3.32,
      "fusionContribution": 74.82,
      "memoryContribution": 75.04,
      "targetContribution": 0,
      "overall": 56.75
    }
  },
  {
    "id": "std-027",
    "input": {
      "graphComplexity": 0.78,
      "operatorFusionPotential": 0.8,
      "memoryLayoutFit": 0.73,
      "quantizationHeadroom": 0.79,
      "targetAffinity": 0.78,
      "irDepth": 0.77,
      "kernelCoverage": 0.81,
      "passBudget": 10,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 90.03,
      "memoryScore": 84.69,
      "targetFitScore": 88.95,
      "passEfficiency": 83.28,
      "predictedArtifactTier": "binary",
      "confidence": 9.25,
      "fusionContribution": 75.03,
      "memoryContribution": 69.63,
      "targetContribution": 70.04,
      "overall": 81.34
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 70.25,
      "memoryScore": 65.35,
      "targetFitScore": 62.89,
      "passEfficiency": 45.58,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 6.9,
      "fusionContribution": 79.82,
      "memoryContribution": 75.68,
      "targetContribution": 0,
      "overall": 59.95
    }
  },
  {
    "id": "std-028",
    "input": {
      "graphComplexity": 0.82,
      "operatorFusionPotential": 0.75,
      "memoryLayoutFit": 0.78,
      "quantizationHeadroom": 0.73,
      "targetAffinity": 0.83,
      "irDepth": 0.81,
      "kernelCoverage": 0.75,
      "passBudget": 11,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 97.5,
      "memoryScore": 93.82,
      "targetFitScore": 98.89,
      "passEfficiency": 93.67,
      "predictedArtifactTier": "binary",
      "confidence": 14.97,
      "fusionContribution": 82.66,
      "memoryContribution": 81.79,
      "targetContribution": 89.8,
      "overall": 90.02
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 67.26,
      "memoryScore": 66.02,
      "targetFitScore": 63.99,
      "passEfficiency": 45.58,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 3.24,
      "fusionContribution": 76.54,
      "memoryContribution": 77.16,
      "targetContribution": 0,
      "overall": 58.64
    }
  },
  {
    "id": "std-029",
    "input": {
      "graphComplexity": 0.87,
      "operatorFusionPotential": 0.8,
      "memoryLayoutFit": 0.83,
      "quantizationHeadroom": 0.77,
      "targetAffinity": 0.87,
      "irDepth": 0.86,
      "kernelCoverage": 0.8,
      "passBudget": 12,
      "profile": "fast"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 95.57,
      "memoryScore": 91.38,
      "targetFitScore": 96.41,
      "passEfficiency": 94.5,
      "predictedArtifactTier": "binary",
      "confidence": 9.84,
      "fusionContribution": 76.65,
      "memoryContribution": 75.31,
      "targetContribution": 76.14,
      "overall": 87.77
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 71.66,
      "memoryScore": 70.01,
      "targetFitScore": 67.99,
      "passEfficiency": 47.08,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 3.65,
      "fusionContribution": 81.54,
      "memoryContribution": 81.86,
      "targetContribution": 0,
      "overall": 62.38
    }
  },
  {
    "id": "std-030",
    "input": {
      "graphComplexity": 0.81,
      "operatorFusionPotential": 0.84,
      "memoryLayoutFit": 0.79,
      "quantizationHeadroom": 0.81,
      "targetAffinity": 0.8,
      "irDepth": 0.8,
      "kernelCoverage": 0.86,
      "passBudget": 11,
      "profile": "full"
    },
    "expectedMultiPass": {
      "mode": "multi_pass",
      "fusionScore": 100,
      "memoryScore": 97.45,
      "targetFitScore": 100,
      "passEfficiency": 95.62,
      "predictedArtifactTier": "binary",
      "confidence": 13.58,
      "fusionContribution": 90.57,
      "memoryContribution": 84.61,
      "targetContribution": 91.01,
      "overall": 92.07
    },
    "expectedSinglePass": {
      "mode": "single_pass",
      "fusionScore": 73.81,
      "memoryScore": 68.74,
      "targetFitScore": 65.71,
      "passEfficiency": 46.72,
      "predictedArtifactTier": "optimized_ir",
      "confidence": 7.07,
      "fusionContribution": 83.86,
      "memoryContribution": 79.82,
      "targetContribution": 0,
      "overall": 62.92
    }
  }
];
