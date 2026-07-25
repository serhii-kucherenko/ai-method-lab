import type { CrateInput, CrateQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CrateInput;
  expectedStructuralSemantic: CrateQuality;
  expectedBaseline: CrateQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cv-001",
    "input": {
      "crateCoverage": 0.29,
      "structuralFidelity": 0.25,
      "semanticClarity": 0.28,
      "checkStability": 0.34,
      "metadataOnlyRate": 0.39,
      "metadataOptimism": 0.45,
      "payloadHardness": 0.59,
      "overclaimRisk": 0.5,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 22.56,
      "structuralScore": 30.25,
      "semanticScore": 23.49,
      "payloadIntegrity": 37.64,
      "metadataBaselineScore": 16.4,
      "confidence": 19.35,
      "structuralSemanticContribution": 27.98,
      "metadataContribution": 15.96,
      "overall": 29.82
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 5.76,
      "structuralScore": 17.09,
      "semanticScore": 13.13,
      "payloadIntegrity": 32.39,
      "metadataBaselineScore": 40.93,
      "confidence": 17.1,
      "structuralSemanticContribution": 21.86,
      "metadataContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "cv-002",
    "input": {
      "crateCoverage": 0.33,
      "structuralFidelity": 0.29,
      "semanticClarity": 0.32,
      "checkStability": 0.38,
      "metadataOnlyRate": 0.43,
      "metadataOptimism": 0.46,
      "payloadHardness": 0.6,
      "overclaimRisk": 0.51,
      "crateBias": "semantic_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 22.22,
      "structuralScore": 33.9,
      "semanticScore": 34.39,
      "payloadIntegrity": 31.9,
      "metadataBaselineScore": 18.89,
      "confidence": 23,
      "structuralSemanticContribution": 30.56,
      "metadataContribution": 18.61,
      "overall": 32.41
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 2.43,
      "structuralScore": 18.22,
      "semanticScore": 14.16,
      "payloadIntegrity": 34.08,
      "metadataBaselineScore": 31.53,
      "confidence": 18.65,
      "structuralSemanticContribution": 20.08,
      "metadataContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "cv-003",
    "input": {
      "crateCoverage": 0.37,
      "structuralFidelity": 0.27,
      "semanticClarity": 0.36,
      "checkStability": 0.42,
      "metadataOnlyRate": 0.46,
      "metadataOptimism": 0.42,
      "payloadHardness": 0.6,
      "overclaimRisk": 0.46,
      "crateBias": "metadata_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 12.18,
      "structuralScore": 23.71,
      "semanticScore": 20.95,
      "payloadIntegrity": 19.24,
      "metadataBaselineScore": 19.94,
      "confidence": 25.6,
      "structuralSemanticContribution": 18.96,
      "metadataContribution": 19.69,
      "overall": 20.09
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 12.17,
      "structuralScore": 17.1,
      "semanticScore": 13.13,
      "payloadIntegrity": 33.93,
      "metadataBaselineScore": 54.34,
      "confidence": 18.4,
      "structuralSemanticContribution": 26.13,
      "metadataContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "cv-004",
    "input": {
      "crateCoverage": 0.33,
      "structuralFidelity": 0.32,
      "semanticClarity": 0.39,
      "checkStability": 0.38,
      "metadataOnlyRate": 0.42,
      "metadataOptimism": 0.43,
      "payloadHardness": 0.53,
      "overclaimRisk": 0.46,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 28.09,
      "structuralScore": 36.03,
      "semanticScore": 33.07,
      "payloadIntegrity": 42.23,
      "metadataBaselineScore": 18.93,
      "confidence": 26.1,
      "structuralSemanticContribution": 34.5,
      "metadataContribution": 19.05,
      "overall": 35.72
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 8.7,
      "structuralScore": 17.81,
      "semanticScore": 13.75,
      "payloadIntegrity": 32.79,
      "metadataBaselineScore": 42.77,
      "confidence": 18.85,
      "structuralSemanticContribution": 23.16,
      "metadataContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "cv-005",
    "input": {
      "crateCoverage": 0.37,
      "structuralFidelity": 0.36,
      "semanticClarity": 0.35,
      "checkStability": 0.42,
      "metadataOnlyRate": 0.46,
      "metadataOptimism": 0.45,
      "payloadHardness": 0.53,
      "overclaimRisk": 0.47,
      "crateBias": "structure_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 26.86,
      "structuralScore": 39.64,
      "semanticScore": 21.39,
      "payloadIntegrity": 54.3,
      "metadataBaselineScore": 21.8,
      "confidence": 27.6,
      "structuralSemanticContribution": 34.43,
      "metadataContribution": 22.19,
      "overall": 36.23
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 0,
      "structuralScore": 19.51,
      "semanticScore": 15.76,
      "payloadIntegrity": 34.77,
      "metadataBaselineScore": 32.95,
      "confidence": 21.05,
      "structuralSemanticContribution": 20.6,
      "metadataContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "cv-006",
    "input": {
      "crateCoverage": 0.41,
      "structuralFidelity": 0.34,
      "semanticClarity": 0.39,
      "checkStability": 0.45,
      "metadataOnlyRate": 0.5,
      "metadataOptimism": 0.4,
      "payloadHardness": 0.54,
      "overclaimRisk": 0.42,
      "crateBias": "balanced",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 33.94,
      "structuralScore": 39.5,
      "semanticScore": 35.84,
      "payloadIntegrity": 47.85,
      "metadataBaselineScore": 23.08,
      "confidence": 30.35,
      "structuralSemanticContribution": 38.87,
      "metadataContribution": 23.38,
      "overall": 40.08
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 11.98,
      "structuralScore": 18.04,
      "semanticScore": 14.31,
      "payloadIntegrity": 34.78,
      "metadataBaselineScore": 46.72,
      "confidence": 20.5,
      "structuralSemanticContribution": 25.17,
      "metadataContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "cv-007",
    "input": {
      "crateCoverage": 0.45,
      "structuralFidelity": 0.38,
      "semanticClarity": 0.42,
      "checkStability": 0.49,
      "metadataOnlyRate": 0.53,
      "metadataOptimism": 0.42,
      "payloadHardness": 0.55,
      "overclaimRisk": 0.43,
      "crateBias": "semantic_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 31.59,
      "structuralScore": 43.11,
      "semanticScore": 48.37,
      "payloadIntegrity": 39.34,
      "metadataBaselineScore": 25.15,
      "confidence": 33.6,
      "structuralSemanticContribution": 40.76,
      "metadataContribution": 25.64,
      "overall": 42.04
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 8.27,
      "structuralScore": 19.34,
      "semanticScore": 15.59,
      "payloadIntegrity": 36.3,
      "metadataBaselineScore": 34.2,
      "confidence": 22.15,
      "structuralSemanticContribution": 22.74,
      "metadataContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "cv-008",
    "input": {
      "crateCoverage": 0.41,
      "structuralFidelity": 0.43,
      "semanticClarity": 0.46,
      "checkStability": 0.45,
      "metadataOnlyRate": 0.49,
      "metadataOptimism": 0.43,
      "payloadHardness": 0.47,
      "overclaimRisk": 0.44,
      "crateBias": "metadata_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 19.33,
      "structuralScore": 35.43,
      "semanticScore": 27.62,
      "payloadIntegrity": 24.76,
      "metadataBaselineScore": 24.32,
      "confidence": 34.35,
      "structuralSemanticContribution": 26.71,
      "metadataContribution": 25.23,
      "overall": 27.44
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 16.4,
      "structuralScore": 20.18,
      "semanticScore": 16.31,
      "payloadIntegrity": 35.17,
      "metadataBaselineScore": 58.5,
      "confidence": 22.7,
      "structuralSemanticContribution": 29.31,
      "metadataContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "cv-009",
    "input": {
      "crateCoverage": 0.46,
      "structuralFidelity": 0.41,
      "semanticClarity": 0.5,
      "checkStability": 0.49,
      "metadataOnlyRate": 0.53,
      "metadataOptimism": 0.39,
      "payloadHardness": 0.48,
      "overclaimRisk": 0.38,
      "crateBias": "balanced",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 40.05,
      "structuralScore": 45.49,
      "semanticScore": 45.68,
      "payloadIntegrity": 52.59,
      "metadataBaselineScore": 25.81,
      "confidence": 37.35,
      "structuralSemanticContribution": 45.69,
      "metadataContribution": 26.69,
      "overall": 46.27
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 14.91,
      "structuralScore": 19.07,
      "semanticScore": 15.29,
      "payloadIntegrity": 35.36,
      "metadataBaselineScore": 48.88,
      "confidence": 22.7,
      "structuralSemanticContribution": 26.7,
      "metadataContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "cv-010",
    "input": {
      "crateCoverage": 0.5,
      "structuralFidelity": 0.45,
      "semanticClarity": 0.46,
      "checkStability": 0.53,
      "metadataOnlyRate": 0.57,
      "metadataOptimism": 0.4,
      "payloadHardness": 0.49,
      "overclaimRisk": 0.39,
      "crateBias": "structure_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 36.62,
      "structuralScore": 49.14,
      "semanticScore": 30.65,
      "payloadIntegrity": 66.82,
      "metadataBaselineScore": 28.29,
      "confidence": 39,
      "structuralSemanticContribution": 44.6,
      "metadataContribution": 29.32,
      "overall": 45.85
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 3.59,
      "structuralScore": 20.18,
      "semanticScore": 16.7,
      "payloadIntegrity": 37.06,
      "metadataBaselineScore": 35.54,
      "confidence": 24.25,
      "structuralSemanticContribution": 22.61,
      "metadataContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "cv-011",
    "input": {
      "crateCoverage": 0.54,
      "structuralFidelity": 0.49,
      "semanticClarity": 0.49,
      "checkStability": 0.57,
      "metadataOnlyRate": 0.6,
      "metadataOptimism": 0.42,
      "payloadHardness": 0.49,
      "overclaimRisk": 0.4,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 47.21,
      "structuralScore": 52.75,
      "semanticScore": 47.19,
      "payloadIntegrity": 60.27,
      "metadataBaselineScore": 30.54,
      "confidence": 42.25,
      "structuralSemanticContribution": 51.41,
      "metadataContribution": 31.82,
      "overall": 51.88
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 17.1,
      "structuralScore": 21.62,
      "semanticScore": 18.14,
      "payloadIntegrity": 38.58,
      "metadataBaselineScore": 54.12,
      "confidence": 26.1,
      "structuralSemanticContribution": 29.91,
      "metadataContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "cv-012",
    "input": {
      "crateCoverage": 0.5,
      "structuralFidelity": 0.48,
      "semanticClarity": 0.53,
      "checkStability": 0.53,
      "metadataOnlyRate": 0.56,
      "metadataOptimism": 0.37,
      "payloadHardness": 0.42,
      "overclaimRisk": 0.35,
      "crateBias": "semantic_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 38.19,
      "structuralScore": 51.28,
      "semanticScore": 61.94,
      "payloadIntegrity": 43.82,
      "metadataBaselineScore": 28.34,
      "confidence": 42.1,
      "structuralSemanticContribution": 49.22,
      "metadataContribution": 29.7,
      "overall": 49.71
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 13.23,
      "structuralScore": 19.68,
      "semanticScore": 16.17,
      "payloadIntegrity": 35.76,
      "metadataBaselineScore": 34.93,
      "confidence": 24.35,
      "structuralSemanticContribution": 23.95,
      "metadataContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "cv-013",
    "input": {
      "crateCoverage": 0.54,
      "structuralFidelity": 0.52,
      "semanticClarity": 0.56,
      "checkStability": 0.57,
      "metadataOnlyRate": 0.6,
      "metadataOptimism": 0.39,
      "payloadHardness": 0.42,
      "overclaimRisk": 0.36,
      "crateBias": "metadata_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 29.13,
      "structuralScore": 44.88,
      "semanticScore": 36.59,
      "payloadIntegrity": 32.66,
      "metadataBaselineScore": 31.2,
      "confidence": 45.35,
      "structuralSemanticContribution": 35.78,
      "metadataContribution": 32.8,
      "overall": 36.24
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 22.62,
      "structuralScore": 21.35,
      "semanticScore": 17.8,
      "payloadIntegrity": 37.74,
      "metadataBaselineScore": 67.02,
      "confidence": 26.55,
      "structuralSemanticContribution": 33.31,
      "metadataContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "cv-014",
    "input": {
      "crateCoverage": 0.58,
      "structuralFidelity": 0.56,
      "semanticClarity": 0.6,
      "checkStability": 0.61,
      "metadataOnlyRate": 0.63,
      "metadataOptimism": 0.4,
      "payloadHardness": 0.43,
      "overclaimRisk": 0.36,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 52.62,
      "structuralScore": 58.53,
      "semanticScore": 56.66,
      "payloadIntegrity": 64.86,
      "metadataBaselineScore": 33.07,
      "confidence": 49,
      "structuralSemanticContribution": 57.86,
      "metadataContribution": 34.8,
      "overall": 57.71
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 20.03,
      "structuralScore": 22.2,
      "semanticScore": 18.59,
      "payloadIntegrity": 38.98,
      "metadataBaselineScore": 55.96,
      "confidence": 27.85,
      "structuralSemanticContribution": 31.15,
      "metadataContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "cv-015",
    "input": {
      "crateCoverage": 0.62,
      "structuralFidelity": 0.54,
      "semanticClarity": 0.56,
      "checkStability": 0.65,
      "metadataOnlyRate": 0.67,
      "metadataOptimism": 0.36,
      "payloadHardness": 0.44,
      "overclaimRisk": 0.31,
      "crateBias": "structure_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 45.9,
      "structuralScore": 58.35,
      "semanticScore": 39.3,
      "payloadIntegrity": 79.94,
      "metadataBaselineScore": 34.55,
      "confidence": 49.6,
      "structuralSemanticContribution": 54.53,
      "metadataContribution": 36.22,
      "overall": 55.23
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 9.43,
      "structuralScore": 21.14,
      "semanticScore": 17.93,
      "payloadIntegrity": 39.27,
      "metadataBaselineScore": 38.2,
      "confidence": 27.75,
      "structuralSemanticContribution": 25.19,
      "metadataContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "cv-016",
    "input": {
      "crateCoverage": 0.58,
      "structuralFidelity": 0.59,
      "semanticClarity": 0.6,
      "checkStability": 0.6,
      "metadataOnlyRate": 0.63,
      "metadataOptimism": 0.37,
      "payloadHardness": 0.36,
      "overclaimRisk": 0.32,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 54.46,
      "structuralScore": 60.67,
      "semanticScore": 57.87,
      "payloadIntegrity": 65.05,
      "metadataBaselineScore": 33.73,
      "confidence": 50.35,
      "structuralSemanticContribution": 59.24,
      "metadataContribution": 35.76,
      "overall": 59.01
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 22.05,
      "structuralScore": 21.91,
      "semanticScore": 18.56,
      "payloadIntegrity": 38.14,
      "metadataBaselineScore": 55.7,
      "confidence": 28.3,
      "structuralSemanticContribution": 31.27,
      "metadataContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "cv-017",
    "input": {
      "crateCoverage": 0.62,
      "structuralFidelity": 0.63,
      "semanticClarity": 0.63,
      "checkStability": 0.64,
      "metadataOnlyRate": 0.67,
      "metadataOptimism": 0.39,
      "payloadHardness": 0.37,
      "overclaimRisk": 0.33,
      "crateBias": "semantic_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 48.43,
      "structuralScore": 64.28,
      "semanticScore": 75.13,
      "payloadIntegrity": 52.76,
      "metadataBaselineScore": 36.41,
      "confidence": 53.6,
      "structuralSemanticContribution": 60.66,
      "metadataContribution": 38.61,
      "overall": 60.69
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 18.73,
      "structuralScore": 23.42,
      "semanticScore": 20,
      "payloadIntegrity": 40.11,
      "metadataBaselineScore": 39.86,
      "confidence": 30.3,
      "structuralSemanticContribution": 28.42,
      "metadataContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "cv-018",
    "input": {
      "crateCoverage": 0.66,
      "structuralFidelity": 0.61,
      "semanticClarity": 0.67,
      "checkStability": 0.68,
      "metadataOnlyRate": 0.7,
      "metadataOptimism": 0.34,
      "payloadHardness": 0.38,
      "overclaimRisk": 0.27,
      "crateBias": "metadata_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 38.33,
      "structuralScore": 54.13,
      "semanticScore": 45.52,
      "payloadIntegrity": 40.09,
      "metadataBaselineScore": 37.08,
      "confidence": 56.35,
      "structuralSemanticContribution": 44.52,
      "metadataContribution": 39.16,
      "overall": 44.56
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 28.36,
      "structuralScore": 21.66,
      "semanticScore": 18.31,
      "payloadIntegrity": 39.67,
      "metadataBaselineScore": 74.27,
      "confidence": 29.5,
      "structuralSemanticContribution": 36.45,
      "metadataContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "cv-019",
    "input": {
      "crateCoverage": 0.7,
      "structuralFidelity": 0.65,
      "semanticClarity": 0.7,
      "checkStability": 0.72,
      "metadataOnlyRate": 0.74,
      "metadataOptimism": 0.36,
      "payloadHardness": 0.38,
      "overclaimRisk": 0.28,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 63.81,
      "structuralScore": 67.74,
      "semanticScore": 68.17,
      "payloadIntegrity": 75.07,
      "metadataBaselineScore": 39.94,
      "confidence": 59.6,
      "structuralSemanticContribution": 68.45,
      "metadataContribution": 42.25,
      "overall": 67.73
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 26.25,
      "structuralScore": 23.32,
      "semanticScore": 19.92,
      "payloadIntegrity": 41.65,
      "metadataBaselineScore": 62.07,
      "confidence": 31.7,
      "structuralSemanticContribution": 34.64,
      "metadataContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "cv-020",
    "input": {
      "crateCoverage": 0.66,
      "structuralFidelity": 0.7,
      "semanticClarity": 0.66,
      "checkStability": 0.68,
      "metadataOnlyRate": 0.7,
      "metadataOptimism": 0.37,
      "payloadHardness": 0.31,
      "overclaimRisk": 0.29,
      "crateBias": "structure_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 52.86,
      "structuralScore": 70.06,
      "semanticScore": 45.74,
      "payloadIntegrity": 86.81,
      "metadataBaselineScore": 38.94,
      "confidence": 58.35,
      "structuralSemanticContribution": 62.46,
      "metadataContribution": 41.54,
      "overall": 62.69
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 13.66,
      "structuralScore": 23.93,
      "semanticScore": 20.75,
      "payloadIntegrity": 40.51,
      "metadataBaselineScore": 40.86,
      "confidence": 32.05,
      "structuralSemanticContribution": 27.94,
      "metadataContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "cv-021",
    "input": {
      "crateCoverage": 0.7,
      "structuralFidelity": 0.68,
      "semanticClarity": 0.7,
      "checkStability": 0.72,
      "metadataOnlyRate": 0.73,
      "metadataOptimism": 0.33,
      "payloadHardness": 0.31,
      "overclaimRisk": 0.24,
      "crateBias": "balanced",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 65.6,
      "structuralScore": 69.88,
      "semanticScore": 69.32,
      "payloadIntegrity": 75.82,
      "metadataBaselineScore": 39.99,
      "confidence": 60.95,
      "structuralSemanticContribution": 69.92,
      "metadataContribution": 42.54,
      "overall": 68.99
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 27.89,
      "structuralScore": 22.72,
      "semanticScore": 19.62,
      "payloadIntegrity": 40.35,
      "metadataBaselineScore": 61.19,
      "confidence": 31.8,
      "structuralSemanticContribution": 34.35,
      "metadataContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "cv-022",
    "input": {
      "crateCoverage": 0.74,
      "structuralFidelity": 0.72,
      "semanticClarity": 0.73,
      "checkStability": 0.76,
      "metadataOnlyRate": 0.77,
      "metadataOptimism": 0.34,
      "payloadHardness": 0.32,
      "overclaimRisk": 0.25,
      "crateBias": "semantic_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 57.62,
      "structuralScore": 73.52,
      "semanticScore": 88.86,
      "payloadIntegrity": 60.51,
      "metadataBaselineScore": 42.47,
      "confidence": 64.35,
      "structuralSemanticContribution": 70.82,
      "metadataContribution": 45.15,
      "overall": 70.2
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 24.57,
      "structuralScore": 23.79,
      "semanticScore": 20.63,
      "payloadIntegrity": 42.05,
      "metadataBaselineScore": 42.21,
      "confidence": 33.35,
      "structuralSemanticContribution": 30.65,
      "metadataContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "cv-023",
    "input": {
      "crateCoverage": 0.79,
      "structuralFidelity": 0.76,
      "semanticClarity": 0.77,
      "checkStability": 0.8,
      "metadataOnlyRate": 0.81,
      "metadataOptimism": 0.36,
      "payloadHardness": 0.33,
      "overclaimRisk": 0.25,
      "crateBias": "metadata_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 49.04,
      "structuralScore": 67.38,
      "semanticScore": 53.74,
      "payloadIntegrity": 49.49,
      "metadataBaselineScore": 45.16,
      "confidence": 68.25,
      "structuralSemanticContribution": 54.86,
      "metadataContribution": 48.03,
      "overall": 54.63
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 33.86,
      "structuralScore": 25.25,
      "semanticScore": 22.05,
      "payloadIntegrity": 43.92,
      "metadataBaselineScore": 84.72,
      "confidence": 35.45,
      "structuralSemanticContribution": 41.96,
      "metadataContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "cv-024",
    "input": {
      "crateCoverage": 0.75,
      "structuralFidelity": 0.75,
      "semanticClarity": 0.81,
      "checkStability": 0.76,
      "metadataOnlyRate": 0.77,
      "metadataOptimism": 0.31,
      "payloadHardness": 0.25,
      "overclaimRisk": 0.2,
      "crateBias": "balanced",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 71.55,
      "structuralScore": 75.91,
      "semanticScore": 78.99,
      "payloadIntegrity": 80.56,
      "metadataBaselineScore": 43.13,
      "confidence": 68.1,
      "structuralSemanticContribution": 76.66,
      "metadataContribution": 46.07,
      "overall": 75.15
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 31.21,
      "structuralScore": 23.36,
      "semanticScore": 20.13,
      "payloadIntegrity": 41.11,
      "metadataBaselineScore": 63.65,
      "confidence": 33.9,
      "structuralSemanticContribution": 35.89,
      "metadataContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "cv-025",
    "input": {
      "crateCoverage": 0.79,
      "structuralFidelity": 0.79,
      "semanticClarity": 0.77,
      "checkStability": 0.8,
      "metadataOnlyRate": 0.8,
      "metadataOptimism": 0.33,
      "payloadHardness": 0.26,
      "overclaimRisk": 0.21,
      "crateBias": "structure_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 62.51,
      "structuralScore": 79.52,
      "semanticScore": 54.86,
      "payloadIntegrity": 100,
      "metadataBaselineScore": 45.2,
      "confidence": 69.6,
      "structuralSemanticContribution": 72.7,
      "metadataContribution": 48.27,
      "overall": 72.3
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 19.5,
      "structuralScore": 24.6,
      "semanticScore": 21.69,
      "payloadIntegrity": 42.63,
      "metadataBaselineScore": 43.52,
      "confidence": 35.55,
      "structuralSemanticContribution": 30.39,
      "metadataContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "cv-026",
    "input": {
      "crateCoverage": 0.83,
      "structuralFidelity": 0.83,
      "semanticClarity": 0.8,
      "checkStability": 0.83,
      "metadataOnlyRate": 0.84,
      "metadataOptimism": 0.34,
      "payloadHardness": 0.27,
      "overclaimRisk": 0.22,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 78.52,
      "structuralScore": 83.17,
      "semanticScore": 80.3,
      "payloadIntegrity": 87.68,
      "metadataBaselineScore": 47.68,
      "confidence": 73,
      "structuralSemanticContribution": 82.15,
      "metadataContribution": 50.87,
      "overall": 80.52
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 33.17,
      "structuralScore": 25.67,
      "semanticScore": 22.7,
      "payloadIntegrity": 44.32,
      "metadataBaselineScore": 68.8,
      "confidence": 37.1,
      "structuralSemanticContribution": 38.93,
      "metadataContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "cv-027",
    "input": {
      "crateCoverage": 0.87,
      "structuralFidelity": 0.81,
      "semanticClarity": 0.84,
      "checkStability": 0.87,
      "metadataOnlyRate": 0.88,
      "metadataOptimism": 0.3,
      "payloadHardness": 0.27,
      "overclaimRisk": 0.17,
      "crateBias": "semantic_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 67.26,
      "structuralScore": 82.98,
      "semanticScore": 100,
      "payloadIntegrity": 68.1,
      "metadataBaselineScore": 49.35,
      "confidence": 75.6,
      "structuralSemanticContribution": 80.38,
      "metadataContribution": 52.5,
      "overall": 79.36
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 30.78,
      "structuralScore": 24.7,
      "semanticScore": 21.75,
      "payloadIntegrity": 44.62,
      "metadataBaselineScore": 45.22,
      "confidence": 37.2,
      "structuralSemanticContribution": 33.41,
      "metadataContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "cv-028",
    "input": {
      "crateCoverage": 0.83,
      "structuralFidelity": 0.86,
      "semanticClarity": 0.87,
      "checkStability": 0.83,
      "metadataOnlyRate": 0.84,
      "metadataOptimism": 0.31,
      "payloadHardness": 0.2,
      "overclaimRisk": 0.17,
      "crateBias": "metadata_first",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 54.87,
      "structuralScore": 75.3,
      "semanticScore": 60.62,
      "payloadIntegrity": 53.51,
      "metadataBaselineScore": 48.34,
      "confidence": 76.1,
      "structuralSemanticContribution": 61.08,
      "metadataContribution": 51.73,
      "overall": 60.4
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 38.81,
      "structuralScore": 25.25,
      "semanticScore": 22.17,
      "payloadIntegrity": 43.48,
      "metadataBaselineScore": 86.95,
      "confidence": 37.65,
      "structuralSemanticContribution": 43.33,
      "metadataContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "cv-029",
    "input": {
      "crateCoverage": 0.87,
      "structuralFidelity": 0.9,
      "semanticClarity": 0.91,
      "checkStability": 0.87,
      "metadataOnlyRate": 0.87,
      "metadataOptimism": 0.33,
      "payloadHardness": 0.2,
      "overclaimRisk": 0.18,
      "crateBias": "balanced",
      "profile": "arc_structural_semantic_validation"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 83.89,
      "structuralScore": 88.91,
      "semanticScore": 89.72,
      "payloadIntegrity": 92.27,
      "metadataBaselineScore": 50.59,
      "confidence": 79.6,
      "structuralSemanticContribution": 88.57,
      "metadataContribution": 54.16,
      "overall": 86.38
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 36.33,
      "structuralScore": 26.6,
      "semanticScore": 23.46,
      "payloadIntegrity": 45,
      "metadataBaselineScore": 71.06,
      "confidence": 39.5,
      "structuralSemanticContribution": 40.49,
      "metadataContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "cv-030",
    "input": {
      "crateCoverage": 0.91,
      "structuralFidelity": 0.88,
      "semanticClarity": 0.87,
      "checkStability": 0.91,
      "metadataOnlyRate": 0.91,
      "metadataOptimism": 0.28,
      "payloadHardness": 0.21,
      "overclaimRisk": 0.13,
      "crateBias": "structure_first",
      "profile": "metadata_only_baseline"
    },
    "expectedStructuralSemantic": {
      "mode": "arc_structural_semantic_validation",
      "crateCoverageScore": 71.59,
      "structuralScore": 88.77,
      "semanticScore": 63.26,
      "payloadIntegrity": 100,
      "metadataBaselineScore": 51.88,
      "confidence": 80.35,
      "structuralSemanticContribution": 79.63,
      "metadataContribution": 55.31,
      "overall": 79.25
    },
    "expectedBaseline": {
      "mode": "metadata_only_baseline",
      "crateCoverageScore": 25.72,
      "structuralScore": 25.06,
      "semanticScore": 22.34,
      "payloadIntegrity": 45.02,
      "metadataBaselineScore": 46.21,
      "confidence": 38.95,
      "structuralSemanticContribution": 32.87,
      "metadataContribution": 50.68,
      "overall": 44.3
    }
  }
];
