import type { RhythmInput, RhythmQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RhythmInput;
  expectedAngularScl: RhythmQuality;
  expectedFlatCe: RhythmQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "headClassShare": 0.44,
      "tailClassShare": 0.34,
      "morphologyAnisotropy": 0.18,
      "angularCovariance": 0.12,
      "adaptiveLogit": 0.09,
      "bandProtectQrs": 0.19,
      "embeddingUniformity": 0.14,
      "labelSparsity": 0.2,
      "multiLabelDensity": 0.09,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 19.14,
      "rareSensitivity": 16.23,
      "headSpecificity": 80.68,
      "macroMap": 28.27,
      "tailLift": 0,
      "confidence": 14.22,
      "angularContribution": 14.02,
      "logitContribution": 22.16,
      "bandContribution": 19.73,
      "overall": 16.79
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 33.16,
      "rareSensitivity": 32.21,
      "headSpecificity": 84.24,
      "macroMap": 40.35,
      "tailLift": 0,
      "confidence": 36.7,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 1.52,
      "overall": 43.58
    }
  },
  {
    "id": "std-002",
    "input": {
      "headClassShare": 0.46,
      "tailClassShare": 0.34,
      "morphologyAnisotropy": 0.23,
      "angularCovariance": 0.16,
      "adaptiveLogit": 0.13,
      "bandProtectQrs": 0.24,
      "embeddingUniformity": 0.18,
      "labelSparsity": 0.25,
      "multiLabelDensity": 0.13,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 25.02,
      "rareSensitivity": 22.7,
      "headSpecificity": 85.2,
      "macroMap": 33.91,
      "tailLift": 0,
      "confidence": 24.12,
      "angularContribution": 21.69,
      "logitContribution": 28.77,
      "bandContribution": 27.79,
      "overall": 21.87
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 34.3,
      "rareSensitivity": 33.65,
      "headSpecificity": 86.36,
      "macroMap": 41.78,
      "tailLift": 0,
      "confidence": 40.1,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 1.92,
      "overall": 45.02
    }
  },
  {
    "id": "std-003",
    "input": {
      "headClassShare": 0.49,
      "tailClassShare": 0.34,
      "morphologyAnisotropy": 0.19,
      "angularCovariance": 0.21,
      "adaptiveLogit": 0.17,
      "bandProtectQrs": 0.28,
      "embeddingUniformity": 0.23,
      "labelSparsity": 0.21,
      "multiLabelDensity": 0.17,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 24.78,
      "rareSensitivity": 22.53,
      "headSpecificity": 81.98,
      "macroMap": 33.41,
      "tailLift": 0,
      "confidence": 22.26,
      "angularContribution": 18.77,
      "logitContribution": 27.58,
      "bandContribution": 24.48,
      "overall": 21.65
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 35.5,
      "rareSensitivity": 31.7,
      "headSpecificity": 85,
      "macroMap": 41.03,
      "tailLift": 0,
      "confidence": 39.85,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 2.24,
      "overall": 44.68
    }
  },
  {
    "id": "std-004",
    "input": {
      "headClassShare": 0.52,
      "tailClassShare": 0.3,
      "morphologyAnisotropy": 0.25,
      "angularCovariance": 0.25,
      "adaptiveLogit": 0.21,
      "bandProtectQrs": 0.23,
      "embeddingUniformity": 0.27,
      "labelSparsity": 0.27,
      "multiLabelDensity": 0.13,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 28.79,
      "rareSensitivity": 26.82,
      "headSpecificity": 86.68,
      "macroMap": 37.1,
      "tailLift": 0,
      "confidence": 29.96,
      "angularContribution": 27.9,
      "logitContribution": 32.79,
      "bandContribution": 26.54,
      "overall": 25.05
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 36.81,
      "rareSensitivity": 31.6,
      "headSpecificity": 87.24,
      "macroMap": 41.77,
      "tailLift": 0,
      "confidence": 43.45,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 1.84,
      "overall": 45.73
    }
  },
  {
    "id": "std-005",
    "input": {
      "headClassShare": 0.48,
      "tailClassShare": 0.3,
      "morphologyAnisotropy": 0.3,
      "angularCovariance": 0.3,
      "adaptiveLogit": 0.25,
      "bandProtectQrs": 0.28,
      "embeddingUniformity": 0.21,
      "labelSparsity": 0.32,
      "multiLabelDensity": 0.17,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 26.98,
      "rareSensitivity": 26.86,
      "headSpecificity": 81.32,
      "macroMap": 35.79,
      "tailLift": 0,
      "confidence": 26.34,
      "angularContribution": 26.11,
      "logitContribution": 29.14,
      "bandContribution": 25.38,
      "overall": 24.21
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 33.59,
      "rareSensitivity": 27.3,
      "headSpecificity": 84.4,
      "macroMap": 38.07,
      "tailLift": 0,
      "confidence": 36.95,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 2.24,
      "overall": 42.25
    }
  },
  {
    "id": "std-006",
    "input": {
      "headClassShare": 0.5,
      "tailClassShare": 0.3,
      "morphologyAnisotropy": 0.26,
      "angularCovariance": 0.22,
      "adaptiveLogit": 0.29,
      "bandProtectQrs": 0.33,
      "embeddingUniformity": 0.25,
      "labelSparsity": 0.28,
      "multiLabelDensity": 0.21,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 31.52,
      "rareSensitivity": 30.38,
      "headSpecificity": 85.84,
      "macroMap": 39.78,
      "tailLift": 0,
      "confidence": 32.88,
      "angularContribution": 26.91,
      "logitContribution": 39.29,
      "bandContribution": 32.88,
      "overall": 27.6
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 35.88,
      "rareSensitivity": 31.39,
      "headSpecificity": 86.88,
      "macroMap": 41.29,
      "tailLift": 0,
      "confidence": 42.15,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 2.64,
      "overall": 45.15
    }
  },
  {
    "id": "std-007",
    "input": {
      "headClassShare": 0.53,
      "tailClassShare": 0.3,
      "morphologyAnisotropy": 0.31,
      "angularCovariance": 0.26,
      "adaptiveLogit": 0.22,
      "bandProtectQrs": 0.38,
      "embeddingUniformity": 0.3,
      "labelSparsity": 0.33,
      "multiLabelDensity": 0.25,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 29.49,
      "rareSensitivity": 28.3,
      "headSpecificity": 83.06,
      "macroMap": 38,
      "tailLift": 0,
      "confidence": 28.32,
      "angularContribution": 26.79,
      "logitContribution": 29.41,
      "bandContribution": 30.64,
      "overall": 25.92
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 35.92,
      "rareSensitivity": 26.79,
      "headSpecificity": 85.16,
      "macroMap": 38.74,
      "tailLift": 0,
      "confidence": 40.1,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.04,
      "overall": 43.34
    }
  },
  {
    "id": "std-008",
    "input": {
      "headClassShare": 0.56,
      "tailClassShare": 0.26,
      "morphologyAnisotropy": 0.37,
      "angularCovariance": 0.31,
      "adaptiveLogit": 0.26,
      "bandProtectQrs": 0.33,
      "embeddingUniformity": 0.34,
      "labelSparsity": 0.39,
      "multiLabelDensity": 0.21,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 34.34,
      "rareSensitivity": 33.59,
      "headSpecificity": 87.76,
      "macroMap": 42.37,
      "tailLift": 0,
      "confidence": 36.3,
      "angularContribution": 37.86,
      "logitContribution": 34.99,
      "bandContribution": 33.96,
      "overall": 30.05
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 37.23,
      "rareSensitivity": 26.69,
      "headSpecificity": 87.4,
      "macroMap": 39.49,
      "tailLift": 0,
      "confidence": 43.7,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 2.64,
      "overall": 44.39
    }
  },
  {
    "id": "std-009",
    "input": {
      "headClassShare": 0.59,
      "tailClassShare": 0.26,
      "morphologyAnisotropy": 0.33,
      "angularCovariance": 0.35,
      "adaptiveLogit": 0.3,
      "bandProtectQrs": 0.38,
      "embeddingUniformity": 0.38,
      "labelSparsity": 0.35,
      "multiLabelDensity": 0.26,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 32.77,
      "rareSensitivity": 32.22,
      "headSpecificity": 84.46,
      "macroMap": 40.99,
      "tailLift": 0,
      "confidence": 34.2,
      "angularContribution": 31.81,
      "logitContribution": 32.99,
      "bandContribution": 30.11,
      "overall": 28.83
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 38.3,
      "rareSensitivity": 24.74,
      "headSpecificity": 86.04,
      "macroMap": 38.68,
      "tailLift": 0,
      "confidence": 43.3,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.04,
      "overall": 43.99
    }
  },
  {
    "id": "std-010",
    "input": {
      "headClassShare": 0.54,
      "tailClassShare": 0.26,
      "morphologyAnisotropy": 0.38,
      "angularCovariance": 0.4,
      "adaptiveLogit": 0.34,
      "bandProtectQrs": 0.42,
      "embeddingUniformity": 0.32,
      "labelSparsity": 0.4,
      "multiLabelDensity": 0.3,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 38.58,
      "rareSensitivity": 39.85,
      "headSpecificity": 86.92,
      "macroMap": 46.71,
      "tailLift": 0,
      "confidence": 42.36,
      "angularContribution": 41.36,
      "logitContribution": 41.77,
      "bandContribution": 39.69,
      "overall": 34.28
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 36.3,
      "rareSensitivity": 26.48,
      "headSpecificity": 87.04,
      "macroMap": 39,
      "tailLift": 0,
      "confidence": 42.4,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.36,
      "overall": 43.81
    }
  },
  {
    "id": "std-011",
    "input": {
      "headClassShare": 0.57,
      "tailClassShare": 0.26,
      "morphologyAnisotropy": 0.43,
      "angularCovariance": 0.44,
      "adaptiveLogit": 0.38,
      "bandProtectQrs": 0.47,
      "embeddingUniformity": 0.37,
      "labelSparsity": 0.45,
      "multiLabelDensity": 0.34,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 37.4,
      "rareSensitivity": 39,
      "headSpecificity": 83.7,
      "macroMap": 45.63,
      "tailLift": 0,
      "confidence": 40.44,
      "angularContribution": 38.88,
      "logitContribution": 36.63,
      "bandContribution": 36.29,
      "overall": 33.41
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 36.34,
      "rareSensitivity": 21.88,
      "headSpecificity": 85.32,
      "macroMap": 36.46,
      "tailLift": 0,
      "confidence": 40.35,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.76,
      "overall": 42
    }
  },
  {
    "id": "std-012",
    "input": {
      "headClassShare": 0.6,
      "tailClassShare": 0.22,
      "morphologyAnisotropy": 0.4,
      "angularCovariance": 0.37,
      "adaptiveLogit": 0.42,
      "bandProtectQrs": 0.42,
      "embeddingUniformity": 0.41,
      "labelSparsity": 0.42,
      "multiLabelDensity": 0.3,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 40.93,
      "rareSensitivity": 41.34,
      "headSpecificity": 88.4,
      "macroMap": 48.36,
      "tailLift": 0,
      "confidence": 45.06,
      "angularContribution": 43.08,
      "logitContribution": 45.79,
      "bandContribution": 39.05,
      "overall": 35.85
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 38.81,
      "rareSensitivity": 24.42,
      "headSpecificity": 87.92,
      "macroMap": 38.98,
      "tailLift": 0,
      "confidence": 45.75,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.36,
      "overall": 44.52
    }
  },
  {
    "id": "std-013",
    "input": {
      "headClassShare": 0.63,
      "tailClassShare": 0.22,
      "morphologyAnisotropy": 0.45,
      "angularCovariance": 0.41,
      "adaptiveLogit": 0.46,
      "bandProtectQrs": 0.47,
      "embeddingUniformity": 0.45,
      "labelSparsity": 0.47,
      "multiLabelDensity": 0.34,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 39.23,
      "rareSensitivity": 40.24,
      "headSpecificity": 85.1,
      "macroMap": 46.99,
      "tailLift": 0,
      "confidence": 42.96,
      "angularContribution": 40.15,
      "logitContribution": 39.98,
      "bandContribution": 35.76,
      "overall": 34.67
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 38.72,
      "rareSensitivity": 19.82,
      "headSpecificity": 86.2,
      "macroMap": 36.39,
      "tailLift": 0,
      "confidence": 43.55,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 3.76,
      "overall": 42.64
    }
  },
  {
    "id": "std-014",
    "input": {
      "headClassShare": 0.66,
      "tailClassShare": 0.22,
      "morphologyAnisotropy": 0.5,
      "angularCovariance": 0.45,
      "adaptiveLogit": 0.4,
      "bandProtectQrs": 0.52,
      "embeddingUniformity": 0.5,
      "labelSparsity": 0.52,
      "multiLabelDensity": 0.38,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 46.38,
      "rareSensitivity": 47.35,
      "headSpecificity": 90.28,
      "macroMap": 53.43,
      "tailLift": 1.27,
      "confidence": 50.64,
      "angularContribution": 53.13,
      "logitContribution": 44.54,
      "bandContribution": 47.11,
      "overall": 40.74
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 40.26,
      "rareSensitivity": 21.23,
      "headSpecificity": 88.48,
      "macroMap": 37.98,
      "tailLift": 0,
      "confidence": 47.5,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.16,
      "overall": 44.3
    }
  },
  {
    "id": "std-015",
    "input": {
      "headClassShare": 0.61,
      "tailClassShare": 0.22,
      "morphologyAnisotropy": 0.46,
      "angularCovariance": 0.5,
      "adaptiveLogit": 0.44,
      "bandProtectQrs": 0.57,
      "embeddingUniformity": 0.44,
      "labelSparsity": 0.48,
      "multiLabelDensity": 0.42,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 41.62,
      "rareSensitivity": 44.1,
      "headSpecificity": 84.74,
      "macroMap": 49.77,
      "tailLift": 0,
      "confidence": 47.02,
      "angularContribution": 43.24,
      "logitContribution": 40.72,
      "bandContribution": 41.03,
      "overall": 37.22
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 37.92,
      "rareSensitivity": 19.61,
      "headSpecificity": 85.84,
      "macroMap": 35.95,
      "tailLift": 0,
      "confidence": 42.4,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.56,
      "overall": 42.12
    }
  },
  {
    "id": "std-016",
    "input": {
      "headClassShare": 0.64,
      "tailClassShare": 0.18,
      "morphologyAnisotropy": 0.52,
      "angularCovariance": 0.54,
      "adaptiveLogit": 0.48,
      "bandProtectQrs": 0.51,
      "embeddingUniformity": 0.48,
      "labelSparsity": 0.54,
      "multiLabelDensity": 0.38,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 47.95,
      "rareSensitivity": 50.71,
      "headSpecificity": 89.44,
      "macroMap": 55.17,
      "tailLift": 4.29,
      "confidence": 54.5,
      "angularContribution": 57.16,
      "logitContribution": 48.56,
      "bandContribution": 45.86,
      "overall": 43.15
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 39.23,
      "rareSensitivity": 19.51,
      "headSpecificity": 88.08,
      "macroMap": 36.7,
      "tailLift": 0,
      "confidence": 46,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.08,
      "overall": 43.18
    }
  },
  {
    "id": "std-017",
    "input": {
      "headClassShare": 0.67,
      "tailClassShare": 0.18,
      "morphologyAnisotropy": 0.57,
      "angularCovariance": 0.59,
      "adaptiveLogit": 0.52,
      "bandProtectQrs": 0.56,
      "embeddingUniformity": 0.52,
      "labelSparsity": 0.59,
      "multiLabelDensity": 0.42,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 45.47,
      "rareSensitivity": 48.86,
      "headSpecificity": 86.14,
      "macroMap": 53.24,
      "tailLift": 2.76,
      "confidence": 52.68,
      "angularContribution": 52.24,
      "logitContribution": 42.28,
      "bandContribution": 41.41,
      "overall": 41.12
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 39.15,
      "rareSensitivity": 14.91,
      "headSpecificity": 86.36,
      "macroMap": 34.11,
      "tailLift": 0,
      "confidence": 43.8,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.48,
      "overall": 41.31
    }
  },
  {
    "id": "std-018",
    "input": {
      "headClassShare": 0.7,
      "tailClassShare": 0.18,
      "morphologyAnisotropy": 0.53,
      "angularCovariance": 0.51,
      "adaptiveLogit": 0.56,
      "bandProtectQrs": 0.61,
      "embeddingUniformity": 0.57,
      "labelSparsity": 0.55,
      "multiLabelDensity": 0.46,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 52.88,
      "rareSensitivity": 55.03,
      "headSpecificity": 90.92,
      "macroMap": 59.3,
      "tailLift": 8.85,
      "confidence": 59.4,
      "angularContribution": 58.34,
      "logitContribution": 55.06,
      "bandContribution": 52.19,
      "overall": 47.68
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 41.84,
      "rareSensitivity": 18.96,
      "headSpecificity": 89,
      "macroMap": 37.47,
      "tailLift": 0,
      "confidence": 49.55,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.88,
      "overall": 44.42
    }
  },
  {
    "id": "std-019",
    "input": {
      "headClassShare": 0.73,
      "tailClassShare": 0.18,
      "morphologyAnisotropy": 0.58,
      "angularCovariance": 0.55,
      "adaptiveLogit": 0.6,
      "bandProtectQrs": 0.66,
      "embeddingUniformity": 0.61,
      "labelSparsity": 0.6,
      "multiLabelDensity": 0.5,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 49.72,
      "rareSensitivity": 52.49,
      "headSpecificity": 87.62,
      "macroMap": 56.86,
      "tailLift": 6.53,
      "confidence": 57.3,
      "angularContribution": 52.92,
      "logitContribution": 47.7,
      "bandContribution": 46.68,
      "overall": 44.98
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 41.76,
      "rareSensitivity": 14.37,
      "headSpecificity": 87.28,
      "macroMap": 34.89,
      "tailLift": 0,
      "confidence": 47.35,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 5.28,
      "overall": 42.55
    }
  },
  {
    "id": "std-020",
    "input": {
      "headClassShare": 0.68,
      "tailClassShare": 0.14,
      "morphologyAnisotropy": 0.64,
      "angularCovariance": 0.6,
      "adaptiveLogit": 0.64,
      "bandProtectQrs": 0.61,
      "embeddingUniformity": 0.55,
      "labelSparsity": 0.66,
      "multiLabelDensity": 0.46,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 55.48,
      "rareSensitivity": 59.87,
      "headSpecificity": 90.08,
      "macroMap": 61.99,
      "tailLift": 12.54,
      "confidence": 63.48,
      "angularContribution": 67.12,
      "logitContribution": 56.94,
      "bandContribution": 53.28,
      "overall": 51.19
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 39.65,
      "rareSensitivity": 14.6,
      "headSpecificity": 88.24,
      "macroMap": 34.41,
      "tailLift": 0,
      "confidence": 46.25,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 4.88,
      "overall": 41.84
    }
  },
  {
    "id": "std-021",
    "input": {
      "headClassShare": 0.71,
      "tailClassShare": 0.14,
      "morphologyAnisotropy": 0.6,
      "angularCovariance": 0.64,
      "adaptiveLogit": 0.57,
      "bandProtectQrs": 0.66,
      "embeddingUniformity": 0.6,
      "labelSparsity": 0.62,
      "multiLabelDensity": 0.5,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 49.6,
      "rareSensitivity": 53.63,
      "headSpecificity": 87.3,
      "macroMap": 57.24,
      "tailLift": 7.41,
      "confidence": 58.92,
      "angularContribution": 56.45,
      "logitContribution": 45.9,
      "bandContribution": 46.15,
      "overall": 45.51
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 40.85,
      "rareSensitivity": 12.65,
      "headSpecificity": 86.88,
      "macroMap": 33.65,
      "tailLift": 0,
      "confidence": 46,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 5.28,
      "overall": 41.49
    }
  },
  {
    "id": "std-022",
    "input": {
      "headClassShare": 0.74,
      "tailClassShare": 0.14,
      "morphologyAnisotropy": 0.65,
      "angularCovariance": 0.69,
      "adaptiveLogit": 0.61,
      "bandProtectQrs": 0.7,
      "embeddingUniformity": 0.64,
      "labelSparsity": 0.67,
      "multiLabelDensity": 0.54,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 59.85,
      "rareSensitivity": 64.42,
      "headSpecificity": 92,
      "macroMap": 66.11,
      "tailLift": 18.45,
      "confidence": 68.88,
      "angularContribution": 72.8,
      "logitContribution": 57.26,
      "bandContribution": 59,
      "overall": 55.82
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 42.26,
      "rareSensitivity": 14.05,
      "headSpecificity": 89.16,
      "macroMap": 35.19,
      "tailLift": 0,
      "confidence": 49.8,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 5.6,
      "overall": 43.08
    }
  },
  {
    "id": "std-023",
    "input": {
      "headClassShare": 0.77,
      "tailClassShare": 0.14,
      "morphologyAnisotropy": 0.7,
      "angularCovariance": 0.73,
      "adaptiveLogit": 0.65,
      "bandProtectQrs": 0.75,
      "embeddingUniformity": 0.68,
      "labelSparsity": 0.72,
      "multiLabelDensity": 0.59,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 55.88,
      "rareSensitivity": 60.99,
      "headSpecificity": 88.7,
      "macroMap": 63.1,
      "tailLift": 15.24,
      "confidence": 66.78,
      "angularContribution": 65.01,
      "logitContribution": 49.77,
      "bandContribution": 52.32,
      "overall": 52.31
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 42.18,
      "rareSensitivity": 9.45,
      "headSpecificity": 87.44,
      "macroMap": 32.6,
      "tailLift": 0,
      "confidence": 47.6,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6,
      "overall": 41.21
    }
  },
  {
    "id": "std-024",
    "input": {
      "headClassShare": 0.8,
      "tailClassShare": 0.1,
      "morphologyAnisotropy": 0.67,
      "angularCovariance": 0.66,
      "adaptiveLogit": 0.69,
      "bandProtectQrs": 0.7,
      "embeddingUniformity": 0.72,
      "labelSparsity": 0.69,
      "multiLabelDensity": 0.55,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 62.08,
      "rareSensitivity": 65.91,
      "headSpecificity": 93.4,
      "macroMap": 67.76,
      "tailLift": 18.26,
      "confidence": 71.4,
      "angularContribution": 74.32,
      "logitContribution": 61.56,
      "bandContribution": 58.36,
      "overall": 57.32
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 44.64,
      "rareSensitivity": 11.99,
      "headSpecificity": 90.04,
      "macroMap": 35.13,
      "tailLift": 0,
      "confidence": 53,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 5.6,
      "overall": 43.73
    }
  },
  {
    "id": "std-025",
    "input": {
      "headClassShare": 0.75,
      "tailClassShare": 0.1,
      "morphologyAnisotropy": 0.72,
      "angularCovariance": 0.7,
      "adaptiveLogit": 0.73,
      "bandProtectQrs": 0.75,
      "embeddingUniformity": 0.67,
      "labelSparsity": 0.74,
      "multiLabelDensity": 0.59,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 56.14,
      "rareSensitivity": 61.72,
      "headSpecificity": 87.94,
      "macroMap": 63.35,
      "tailLift": 14.51,
      "confidence": 67.68,
      "angularContribution": 64.79,
      "logitContribution": 53.12,
      "bandContribution": 51.8,
      "overall": 52.56
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 41.26,
      "rareSensitivity": 7.73,
      "headSpecificity": 87.04,
      "macroMap": 31.36,
      "tailLift": 0,
      "confidence": 46.25,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6,
      "overall": 40.14
    }
  },
  {
    "id": "std-026",
    "input": {
      "headClassShare": 0.78,
      "tailClassShare": 0.1,
      "morphologyAnisotropy": 0.77,
      "angularCovariance": 0.74,
      "adaptiveLogit": 0.77,
      "bandProtectQrs": 0.8,
      "embeddingUniformity": 0.71,
      "labelSparsity": 0.79,
      "multiLabelDensity": 0.63,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 67.34,
      "rareSensitivity": 73.42,
      "headSpecificity": 92.64,
      "macroMap": 72.91,
      "tailLift": 26.43,
      "confidence": 77.58,
      "angularContribution": 82.39,
      "logitContribution": 65.92,
      "bandContribution": 66.42,
      "overall": 63.74
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 42.69,
      "rareSensitivity": 9.14,
      "headSpecificity": 89.32,
      "macroMap": 32.91,
      "tailLift": 0,
      "confidence": 50.05,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6.4,
      "overall": 41.75
    }
  },
  {
    "id": "std-027",
    "input": {
      "headClassShare": 0.81,
      "tailClassShare": 0.1,
      "morphologyAnisotropy": 0.73,
      "angularCovariance": 0.79,
      "adaptiveLogit": 0.81,
      "bandProtectQrs": 0.85,
      "embeddingUniformity": 0.75,
      "labelSparsity": 0.75,
      "multiLabelDensity": 0.67,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 61.69,
      "rareSensitivity": 68.09,
      "headSpecificity": 89.34,
      "macroMap": 68.51,
      "tailLift": 22.32,
      "confidence": 75.76,
      "angularContribution": 69.37,
      "logitContribution": 58.54,
      "bandContribution": 57.06,
      "overall": 58.67
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 43.76,
      "rareSensitivity": 7.19,
      "headSpecificity": 87.96,
      "macroMap": 32.1,
      "tailLift": 0,
      "confidence": 49.65,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6.8,
      "overall": 41.34
    }
  },
  {
    "id": "std-028",
    "input": {
      "headClassShare": 0.84,
      "tailClassShare": 0.06,
      "morphologyAnisotropy": 0.79,
      "angularCovariance": 0.83,
      "adaptiveLogit": 0.75,
      "bandProtectQrs": 0.8,
      "embeddingUniformity": 0.79,
      "labelSparsity": 0.81,
      "multiLabelDensity": 0.63,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 69.23,
      "rareSensitivity": 75.47,
      "headSpecificity": 94.44,
      "macroMap": 74.69,
      "tailLift": 28.01,
      "confidence": 81.06,
      "angularContribution": 88.4,
      "logitContribution": 64.32,
      "bandContribution": 65.78,
      "overall": 65.61
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 45.07,
      "rareSensitivity": 7.08,
      "headSpecificity": 90.2,
      "macroMap": 32.84,
      "tailLift": 0,
      "confidence": 53.25,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6.4,
      "overall": 42.39
    }
  },
  {
    "id": "std-029",
    "input": {
      "headClassShare": 0.87,
      "tailClassShare": 0.06,
      "morphologyAnisotropy": 0.84,
      "angularCovariance": 0.88,
      "adaptiveLogit": 0.79,
      "bandProtectQrs": 0.84,
      "embeddingUniformity": 0.84,
      "labelSparsity": 0.86,
      "multiLabelDensity": 0.67,
      "profile": "fast"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 64.13,
      "rareSensitivity": 70.92,
      "headSpecificity": 91.22,
      "macroMap": 70.82,
      "tailLift": 23.7,
      "confidence": 79.2,
      "angularContribution": 78.53,
      "logitContribution": 55.42,
      "bandContribution": 57.45,
      "overall": 61.04
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 45.11,
      "rareSensitivity": 2.49,
      "headSpecificity": 88.48,
      "macroMap": 30.31,
      "tailLift": 0,
      "confidence": 51.2,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 6.72,
      "overall": 40.58
    }
  },
  {
    "id": "std-030",
    "input": {
      "headClassShare": 0.82,
      "tailClassShare": 0.07,
      "morphologyAnisotropy": 0.8,
      "angularCovariance": 0.8,
      "adaptiveLogit": 0.83,
      "bandProtectQrs": 0.89,
      "embeddingUniformity": 0.78,
      "labelSparsity": 0.82,
      "multiLabelDensity": 0.71,
      "profile": "full"
    },
    "expectedAngularScl": {
      "mode": "angular_scl",
      "balancedAccuracy": 72.22,
      "rareSensitivity": 79.03,
      "headSpecificity": 93.68,
      "macroMap": 77.47,
      "tailLift": 32.2,
      "confidence": 83.94,
      "angularContribution": 87.6,
      "logitContribution": 70.83,
      "bandContribution": 71.76,
      "overall": 68.94
    },
    "expectedFlatCe": {
      "mode": "flat_ce",
      "balancedAccuracy": 44.26,
      "rareSensitivity": 7.18,
      "headSpecificity": 89.84,
      "macroMap": 32.56,
      "tailLift": 0,
      "confidence": 52.1,
      "angularContribution": 0,
      "logitContribution": 0,
      "bandContribution": 7.12,
      "overall": 41.97
    }
  }
];
