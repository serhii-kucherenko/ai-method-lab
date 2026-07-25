import type { HorizonInput, HorizonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HorizonInput;
  expectedHierarchical: HorizonQuality;
  expectedFlat: HorizonQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dhs-001",
    "input": {
      "structureFit": 0.29,
      "detailFidelity": 0.25,
      "temporalConsistency": 0.28,
      "evidenceStrength": 0.34,
      "sceneCoverage": 0.3,
      "rolloutSmoothness": 0.39,
      "fluencyScore": 0.45,
      "surprisePressure": 0.59,
      "horizonDrift": 0.5,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 25.68,
      "detailScore": 30.5,
      "temporalScore": 25.53,
      "sceneIntegrity": 35.4,
      "flatRolloutScore": 16.4,
      "confidence": 22.85,
      "hierarchicalContribution": 28.93,
      "flatContribution": 16.6,
      "overall": 30.71
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 5.76,
      "detailScore": 17.82,
      "temporalScore": 14.1,
      "sceneIntegrity": 32.29,
      "flatRolloutScore": 40.93,
      "confidence": 17.1,
      "hierarchicalContribution": 22.18,
      "flatContribution": 39.03,
      "overall": 27.6
    }
  },
  {
    "id": "dhs-002",
    "input": {
      "structureFit": 0.33,
      "detailFidelity": 0.29,
      "temporalConsistency": 0.32,
      "evidenceStrength": 0.38,
      "sceneCoverage": 0.34,
      "rolloutSmoothness": 0.43,
      "fluencyScore": 0.46,
      "surprisePressure": 0.6,
      "horizonDrift": 0.51,
      "horizonBias": "detail_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 24.75,
      "detailScore": 34.15,
      "temporalScore": 36.42,
      "sceneIntegrity": 30.67,
      "flatRolloutScore": 18.89,
      "confidence": 26.5,
      "hierarchicalContribution": 31.58,
      "flatContribution": 19.24,
      "overall": 33.36
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 2.43,
      "detailScore": 18.92,
      "temporalScore": 15.1,
      "sceneIntegrity": 33.98,
      "flatRolloutScore": 31.53,
      "confidence": 18.65,
      "hierarchicalContribution": 20.39,
      "flatContribution": 34.95,
      "overall": 23.89
    }
  },
  {
    "id": "dhs-003",
    "input": {
      "structureFit": 0.37,
      "detailFidelity": 0.27,
      "temporalConsistency": 0.36,
      "evidenceStrength": 0.42,
      "sceneCoverage": 0.32,
      "rolloutSmoothness": 0.46,
      "fluencyScore": 0.42,
      "surprisePressure": 0.6,
      "horizonDrift": 0.46,
      "horizonBias": "rollout_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 16.07,
      "detailScore": 22.46,
      "temporalScore": 22.95,
      "sceneIntegrity": 16.16,
      "flatRolloutScore": 19.94,
      "confidence": 29.1,
      "hierarchicalContribution": 19.55,
      "flatContribution": 20.29,
      "overall": 20.68
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 12.17,
      "detailScore": 18.25,
      "temporalScore": 14.03,
      "sceneIntegrity": 34.43,
      "flatRolloutScore": 54.34,
      "confidence": 18.4,
      "hierarchicalContribution": 26.64,
      "flatContribution": 46.97,
      "overall": 34.94
    }
  },
  {
    "id": "dhs-004",
    "input": {
      "structureFit": 0.33,
      "detailFidelity": 0.32,
      "temporalConsistency": 0.39,
      "evidenceStrength": 0.38,
      "sceneCoverage": 0.36,
      "rolloutSmoothness": 0.42,
      "fluencyScore": 0.43,
      "surprisePressure": 0.53,
      "horizonDrift": 0.46,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 30.28,
      "detailScore": 36.78,
      "temporalScore": 35.03,
      "sceneIntegrity": 41.11,
      "flatRolloutScore": 18.93,
      "confidence": 29.3,
      "hierarchicalContribution": 35.55,
      "flatContribution": 19.6,
      "overall": 36.68
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 8.7,
      "detailScore": 18.26,
      "temporalScore": 14.58,
      "sceneIntegrity": 32.49,
      "flatRolloutScore": 42.77,
      "confidence": 18.85,
      "hierarchicalContribution": 23.36,
      "flatContribution": 40.59,
      "overall": 29.8
    }
  },
  {
    "id": "dhs-005",
    "input": {
      "structureFit": 0.37,
      "detailFidelity": 0.36,
      "temporalConsistency": 0.35,
      "evidenceStrength": 0.42,
      "sceneCoverage": 0.4,
      "rolloutSmoothness": 0.46,
      "fluencyScore": 0.45,
      "surprisePressure": 0.53,
      "horizonDrift": 0.47,
      "horizonBias": "structure_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 28.64,
      "detailScore": 40.39,
      "temporalScore": 23.32,
      "sceneIntegrity": 52.79,
      "flatRolloutScore": 21.8,
      "confidence": 30.8,
      "hierarchicalContribution": 35.28,
      "flatContribution": 22.71,
      "overall": 37.02
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 0,
      "detailScore": 19.93,
      "temporalScore": 16.55,
      "sceneIntegrity": 34.47,
      "flatRolloutScore": 32.95,
      "confidence": 21.05,
      "hierarchicalContribution": 20.78,
      "flatContribution": 36.66,
      "overall": 26.11
    }
  },
  {
    "id": "dhs-006",
    "input": {
      "structureFit": 0.41,
      "detailFidelity": 0.34,
      "temporalConsistency": 0.39,
      "evidenceStrength": 0.45,
      "sceneCoverage": 0.38,
      "rolloutSmoothness": 0.5,
      "fluencyScore": 0.4,
      "surprisePressure": 0.54,
      "horizonDrift": 0.42,
      "horizonBias": "balanced",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 37.47,
      "detailScore": 38.75,
      "temporalScore": 37.45,
      "sceneIntegrity": 43.93,
      "flatRolloutScore": 23.08,
      "confidence": 33.15,
      "hierarchicalContribution": 39.19,
      "flatContribution": 23.87,
      "overall": 40.43
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 11.98,
      "detailScore": 18.88,
      "temporalScore": 15.04,
      "sceneIntegrity": 35.08,
      "flatRolloutScore": 46.72,
      "confidence": 20.5,
      "hierarchicalContribution": 25.54,
      "flatContribution": 43.51,
      "overall": 32.72
    }
  },
  {
    "id": "dhs-007",
    "input": {
      "structureFit": 0.45,
      "detailFidelity": 0.38,
      "temporalConsistency": 0.42,
      "evidenceStrength": 0.49,
      "sceneCoverage": 0.42,
      "rolloutSmoothness": 0.53,
      "fluencyScore": 0.42,
      "surprisePressure": 0.55,
      "horizonDrift": 0.43,
      "horizonBias": "detail_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 34.46,
      "detailScore": 42.36,
      "temporalScore": 49.96,
      "sceneIntegrity": 37.19,
      "flatRolloutScore": 25.15,
      "confidence": 36.4,
      "hierarchicalContribution": 41.3,
      "flatContribution": 26.11,
      "overall": 42.57
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 8.27,
      "detailScore": 20.16,
      "temporalScore": 16.29,
      "sceneIntegrity": 36.6,
      "flatRolloutScore": 34.2,
      "confidence": 22.15,
      "hierarchicalContribution": 23.1,
      "flatContribution": 37.81,
      "overall": 27.59
    }
  },
  {
    "id": "dhs-008",
    "input": {
      "structureFit": 0.41,
      "detailFidelity": 0.43,
      "temporalConsistency": 0.46,
      "evidenceStrength": 0.45,
      "sceneCoverage": 0.46,
      "rolloutSmoothness": 0.49,
      "fluencyScore": 0.43,
      "surprisePressure": 0.47,
      "horizonDrift": 0.44,
      "horizonBias": "rollout_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 20.11,
      "detailScore": 36.68,
      "temporalScore": 29.16,
      "sceneIntegrity": 25.07,
      "flatRolloutScore": 24.32,
      "confidence": 36.85,
      "hierarchicalContribution": 27.71,
      "flatContribution": 25.65,
      "overall": 28.34
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 16.4,
      "detailScore": 20.31,
      "temporalScore": 16.94,
      "sceneIntegrity": 34.67,
      "flatRolloutScore": 58.5,
      "confidence": 22.7,
      "hierarchicalContribution": 29.36,
      "flatContribution": 51.23,
      "overall": 40.02
    }
  },
  {
    "id": "dhs-009",
    "input": {
      "structureFit": 0.46,
      "detailFidelity": 0.41,
      "temporalConsistency": 0.5,
      "evidenceStrength": 0.49,
      "sceneCoverage": 0.45,
      "rolloutSmoothness": 0.53,
      "fluencyScore": 0.39,
      "surprisePressure": 0.48,
      "horizonDrift": 0.38,
      "horizonBias": "balanced",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 42.65,
      "detailScore": 45.24,
      "temporalScore": 46.9,
      "sceneIntegrity": 50.35,
      "flatRolloutScore": 25.81,
      "confidence": 39.75,
      "hierarchicalContribution": 46.16,
      "flatContribution": 27.07,
      "overall": 46.72
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 14.91,
      "detailScore": 19.63,
      "temporalScore": 15.86,
      "sceneIntegrity": 35.46,
      "flatRolloutScore": 48.88,
      "confidence": 22.7,
      "hierarchicalContribution": 26.95,
      "flatContribution": 45.52,
      "overall": 35.31
    }
  },
  {
    "id": "dhs-010",
    "input": {
      "structureFit": 0.5,
      "detailFidelity": 0.45,
      "temporalConsistency": 0.46,
      "evidenceStrength": 0.53,
      "sceneCoverage": 0.49,
      "rolloutSmoothness": 0.57,
      "fluencyScore": 0.4,
      "surprisePressure": 0.49,
      "horizonDrift": 0.39,
      "horizonBias": "structure_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 38.73,
      "detailScore": 48.89,
      "temporalScore": 31.86,
      "sceneIntegrity": 63.79,
      "flatRolloutScore": 28.29,
      "confidence": 41.4,
      "hierarchicalContribution": 44.76,
      "flatContribution": 29.69,
      "overall": 46.05
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 3.59,
      "detailScore": 20.72,
      "temporalScore": 17.24,
      "sceneIntegrity": 37.16,
      "flatRolloutScore": 35.54,
      "confidence": 24.25,
      "hierarchicalContribution": 22.85,
      "flatContribution": 39.27,
      "overall": 29.4
    }
  },
  {
    "id": "dhs-011",
    "input": {
      "structureFit": 0.54,
      "detailFidelity": 0.49,
      "temporalConsistency": 0.49,
      "evidenceStrength": 0.57,
      "sceneCoverage": 0.53,
      "rolloutSmoothness": 0.6,
      "fluencyScore": 0.42,
      "surprisePressure": 0.49,
      "horizonDrift": 0.4,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 49.76,
      "detailScore": 52.5,
      "temporalScore": 48.37,
      "sceneIntegrity": 58.03,
      "flatRolloutScore": 30.54,
      "confidence": 44.65,
      "hierarchicalContribution": 51.85,
      "flatContribution": 32.16,
      "overall": 52.31
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 17.1,
      "detailScore": 22.13,
      "temporalScore": 18.65,
      "sceneIntegrity": 38.68,
      "flatRolloutScore": 54.12,
      "confidence": 26.1,
      "hierarchicalContribution": 30.14,
      "flatContribution": 50.75,
      "overall": 39.9
    }
  },
  {
    "id": "dhs-012",
    "input": {
      "structureFit": 0.5,
      "detailFidelity": 0.48,
      "temporalConsistency": 0.53,
      "evidenceStrength": 0.53,
      "sceneCoverage": 0.51,
      "rolloutSmoothness": 0.56,
      "fluencyScore": 0.37,
      "surprisePressure": 0.42,
      "horizonDrift": 0.35,
      "horizonBias": "detail_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 39.57,
      "detailScore": 51.53,
      "temporalScore": 63.09,
      "sceneIntegrity": 43.21,
      "flatRolloutScore": 28.34,
      "confidence": 44.2,
      "hierarchicalContribution": 49.83,
      "flatContribution": 30.01,
      "overall": 50.26
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 13.23,
      "detailScore": 19.99,
      "temporalScore": 16.64,
      "sceneIntegrity": 35.66,
      "flatRolloutScore": 34.93,
      "confidence": 24.35,
      "hierarchicalContribution": 24.09,
      "flatContribution": 38.36,
      "overall": 29.76
    }
  },
  {
    "id": "dhs-013",
    "input": {
      "structureFit": 0.54,
      "detailFidelity": 0.52,
      "temporalConsistency": 0.56,
      "evidenceStrength": 0.57,
      "sceneCoverage": 0.55,
      "rolloutSmoothness": 0.6,
      "fluencyScore": 0.39,
      "surprisePressure": 0.42,
      "horizonDrift": 0.36,
      "horizonBias": "rollout_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 30.5,
      "detailScore": 45.13,
      "temporalScore": 37.72,
      "sceneIntegrity": 32.04,
      "flatRolloutScore": 31.2,
      "confidence": 47.45,
      "hierarchicalContribution": 36.37,
      "flatContribution": 33.09,
      "overall": 36.78
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 22.62,
      "detailScore": 21.64,
      "temporalScore": 18.24,
      "sceneIntegrity": 37.64,
      "flatRolloutScore": 67.02,
      "confidence": 26.55,
      "hierarchicalContribution": 33.43,
      "flatContribution": 57.46,
      "overall": 46.65
    }
  },
  {
    "id": "dhs-014",
    "input": {
      "structureFit": 0.58,
      "detailFidelity": 0.56,
      "temporalConsistency": 0.6,
      "evidenceStrength": 0.61,
      "sceneCoverage": 0.59,
      "rolloutSmoothness": 0.63,
      "fluencyScore": 0.4,
      "surprisePressure": 0.43,
      "horizonDrift": 0.36,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 54.28,
      "detailScore": 58.78,
      "temporalScore": 57.78,
      "sceneIntegrity": 63.74,
      "flatRolloutScore": 33.07,
      "confidence": 51.1,
      "hierarchicalContribution": 58.42,
      "flatContribution": 35.07,
      "overall": 58.22
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 20.03,
      "detailScore": 22.47,
      "temporalScore": 19,
      "sceneIntegrity": 38.88,
      "flatRolloutScore": 55.96,
      "confidence": 27.85,
      "hierarchicalContribution": 31.27,
      "flatContribution": 52.26,
      "overall": 42.04
    }
  },
  {
    "id": "dhs-015",
    "input": {
      "structureFit": 0.62,
      "detailFidelity": 0.54,
      "temporalConsistency": 0.56,
      "evidenceStrength": 0.65,
      "sceneCoverage": 0.57,
      "rolloutSmoothness": 0.67,
      "fluencyScore": 0.36,
      "surprisePressure": 0.44,
      "horizonDrift": 0.31,
      "horizonBias": "structure_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 48.61,
      "detailScore": 57.1,
      "temporalScore": 40.41,
      "sceneIntegrity": 73.89,
      "flatRolloutScore": 34.55,
      "confidence": 51.7,
      "hierarchicalContribution": 53.91,
      "flatContribution": 36.49,
      "overall": 54.77
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 9.43,
      "detailScore": 21.87,
      "temporalScore": 18.33,
      "sceneIntegrity": 39.77,
      "flatRolloutScore": 38.2,
      "confidence": 27.75,
      "hierarchicalContribution": 25.52,
      "flatContribution": 42.08,
      "overall": 33.06
    }
  },
  {
    "id": "dhs-016",
    "input": {
      "structureFit": 0.58,
      "detailFidelity": 0.59,
      "temporalConsistency": 0.6,
      "evidenceStrength": 0.6,
      "sceneCoverage": 0.61,
      "rolloutSmoothness": 0.63,
      "fluencyScore": 0.37,
      "surprisePressure": 0.36,
      "horizonDrift": 0.32,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 54.94,
      "detailScore": 61.42,
      "temporalScore": 58.64,
      "sceneIntegrity": 65.61,
      "flatRolloutScore": 33.73,
      "confidence": 51.75,
      "hierarchicalContribution": 59.88,
      "flatContribution": 35.98,
      "overall": 59.58
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 22.05,
      "detailScore": 21.94,
      "temporalScore": 18.89,
      "sceneIntegrity": 37.84,
      "flatRolloutScore": 55.7,
      "confidence": 28.3,
      "hierarchicalContribution": 31.28,
      "flatContribution": 51.71,
      "overall": 42.42
    }
  },
  {
    "id": "dhs-017",
    "input": {
      "structureFit": 0.62,
      "detailFidelity": 0.63,
      "temporalConsistency": 0.63,
      "evidenceStrength": 0.64,
      "sceneCoverage": 0.65,
      "rolloutSmoothness": 0.67,
      "fluencyScore": 0.39,
      "surprisePressure": 0.37,
      "horizonDrift": 0.33,
      "horizonBias": "detail_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 48.82,
      "detailScore": 65.03,
      "temporalScore": 75.9,
      "sceneIntegrity": 53.07,
      "flatRolloutScore": 36.41,
      "confidence": 55,
      "hierarchicalContribution": 61.23,
      "flatContribution": 38.82,
      "overall": 61.2
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 18.73,
      "detailScore": 23.44,
      "temporalScore": 20.3,
      "sceneIntegrity": 39.81,
      "flatRolloutScore": 39.86,
      "confidence": 30.3,
      "hierarchicalContribution": 28.43,
      "flatContribution": 44.38,
      "overall": 35.93
    }
  },
  {
    "id": "dhs-018",
    "input": {
      "structureFit": 0.66,
      "detailFidelity": 0.61,
      "temporalConsistency": 0.67,
      "evidenceStrength": 0.68,
      "sceneCoverage": 0.63,
      "rolloutSmoothness": 0.7,
      "fluencyScore": 0.34,
      "surprisePressure": 0.38,
      "horizonDrift": 0.27,
      "horizonBias": "rollout_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 40.08,
      "detailScore": 53.38,
      "temporalScore": 46.27,
      "sceneIntegrity": 38.55,
      "flatRolloutScore": 37.08,
      "confidence": 57.75,
      "hierarchicalContribution": 44.67,
      "flatContribution": 39.35,
      "overall": 44.71
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 28.36,
      "detailScore": 22.14,
      "temporalScore": 18.6,
      "sceneIntegrity": 39.97,
      "flatRolloutScore": 74.27,
      "confidence": 29.5,
      "hierarchicalContribution": 36.67,
      "flatContribution": 62.38,
      "overall": 52.06
    }
  },
  {
    "id": "dhs-019",
    "input": {
      "structureFit": 0.7,
      "detailFidelity": 0.65,
      "temporalConsistency": 0.7,
      "evidenceStrength": 0.72,
      "sceneCoverage": 0.67,
      "rolloutSmoothness": 0.74,
      "fluencyScore": 0.36,
      "surprisePressure": 0.38,
      "horizonDrift": 0.28,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 65.93,
      "detailScore": 66.99,
      "temporalScore": 68.9,
      "sceneIntegrity": 72.27,
      "flatRolloutScore": 39.94,
      "confidence": 61,
      "hierarchicalContribution": 68.41,
      "flatContribution": 42.43,
      "overall": 67.73
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 26.25,
      "detailScore": 23.78,
      "temporalScore": 20.18,
      "sceneIntegrity": 41.95,
      "flatRolloutScore": 62.07,
      "confidence": 31.7,
      "hierarchicalContribution": 34.85,
      "flatContribution": 57.12,
      "overall": 47.5
    }
  },
  {
    "id": "dhs-020",
    "input": {
      "structureFit": 0.66,
      "detailFidelity": 0.7,
      "temporalConsistency": 0.66,
      "evidenceStrength": 0.68,
      "sceneCoverage": 0.71,
      "rolloutSmoothness": 0.7,
      "fluencyScore": 0.37,
      "surprisePressure": 0.31,
      "horizonDrift": 0.29,
      "horizonBias": "structure_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 52.52,
      "detailScore": 71.31,
      "temporalScore": 46.45,
      "sceneIntegrity": 89.08,
      "flatRolloutScore": 38.94,
      "confidence": 59.45,
      "hierarchicalContribution": 63.37,
      "flatContribution": 41.69,
      "overall": 63.47
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 13.66,
      "detailScore": 23.72,
      "temporalScore": 20.99,
      "sceneIntegrity": 40.01,
      "flatRolloutScore": 40.86,
      "confidence": 32.05,
      "hierarchicalContribution": 27.85,
      "flatContribution": 45.4,
      "overall": 37.32
    }
  },
  {
    "id": "dhs-021",
    "input": {
      "structureFit": 0.7,
      "detailFidelity": 0.68,
      "temporalConsistency": 0.7,
      "evidenceStrength": 0.72,
      "sceneCoverage": 0.69,
      "rolloutSmoothness": 0.73,
      "fluencyScore": 0.33,
      "surprisePressure": 0.31,
      "horizonDrift": 0.24,
      "horizonBias": "balanced",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 66.85,
      "detailScore": 69.63,
      "temporalScore": 70.03,
      "sceneIntegrity": 74.14,
      "flatRolloutScore": 39.99,
      "confidence": 62.05,
      "hierarchicalContribution": 70.01,
      "flatContribution": 42.69,
      "overall": 69.09
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 27.89,
      "detailScore": 22.98,
      "temporalScore": 19.83,
      "sceneIntegrity": 40.45,
      "flatRolloutScore": 61.19,
      "confidence": 31.8,
      "hierarchicalContribution": 34.47,
      "flatContribution": 56.02,
      "overall": 47.36
    }
  },
  {
    "id": "dhs-022",
    "input": {
      "structureFit": 0.74,
      "detailFidelity": 0.72,
      "temporalConsistency": 0.73,
      "evidenceStrength": 0.76,
      "sceneCoverage": 0.73,
      "rolloutSmoothness": 0.77,
      "fluencyScore": 0.34,
      "surprisePressure": 0.32,
      "horizonDrift": 0.25,
      "horizonBias": "detail_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 58.63,
      "detailScore": 73.27,
      "temporalScore": 89.55,
      "sceneIntegrity": 59.58,
      "flatRolloutScore": 42.47,
      "confidence": 65.45,
      "hierarchicalContribution": 71.01,
      "flatContribution": 45.28,
      "overall": 70.38
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 24.57,
      "detailScore": 24.04,
      "temporalScore": 20.83,
      "sceneIntegrity": 42.15,
      "flatRolloutScore": 42.21,
      "confidence": 33.35,
      "hierarchicalContribution": 30.76,
      "flatContribution": 46.65,
      "overall": 39.09
    }
  },
  {
    "id": "dhs-023",
    "input": {
      "structureFit": 0.79,
      "detailFidelity": 0.76,
      "temporalConsistency": 0.77,
      "evidenceStrength": 0.8,
      "sceneCoverage": 0.78,
      "rolloutSmoothness": 0.81,
      "fluencyScore": 0.36,
      "surprisePressure": 0.33,
      "horizonDrift": 0.25,
      "horizonBias": "rollout_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 50.03,
      "detailScore": 67.13,
      "temporalScore": 54.12,
      "sceneIntegrity": 48.87,
      "flatRolloutScore": 45.16,
      "confidence": 69.25,
      "hierarchicalContribution": 55.02,
      "flatContribution": 48.13,
      "overall": 54.78
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 33.86,
      "detailScore": 25.45,
      "temporalScore": 22.19,
      "sceneIntegrity": 44.02,
      "flatRolloutScore": 84.72,
      "confidence": 35.45,
      "hierarchicalContribution": 42.05,
      "flatContribution": 71.4,
      "overall": 60.8
    }
  },
  {
    "id": "dhs-024",
    "input": {
      "structureFit": 0.75,
      "detailFidelity": 0.75,
      "temporalConsistency": 0.81,
      "evidenceStrength": 0.76,
      "sceneCoverage": 0.76,
      "rolloutSmoothness": 0.77,
      "fluencyScore": 0.31,
      "surprisePressure": 0.25,
      "horizonDrift": 0.2,
      "horizonBias": "balanced",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 71.91,
      "detailScore": 76.16,
      "temporalScore": 79.36,
      "sceneIntegrity": 80.56,
      "flatRolloutScore": 43.13,
      "confidence": 68.8,
      "hierarchicalContribution": 76.92,
      "flatContribution": 46.15,
      "overall": 75.38
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 31.21,
      "detailScore": 23.39,
      "temporalScore": 20.27,
      "sceneIntegrity": 41.01,
      "flatRolloutScore": 63.65,
      "confidence": 33.9,
      "hierarchicalContribution": 35.91,
      "flatContribution": 58.02,
      "overall": 49.96
    }
  },
  {
    "id": "dhs-025",
    "input": {
      "structureFit": 0.79,
      "detailFidelity": 0.79,
      "temporalConsistency": 0.77,
      "evidenceStrength": 0.8,
      "sceneCoverage": 0.8,
      "rolloutSmoothness": 0.8,
      "fluencyScore": 0.33,
      "surprisePressure": 0.26,
      "horizonDrift": 0.21,
      "horizonBias": "structure_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 62.8,
      "detailScore": 79.77,
      "temporalScore": 55.22,
      "sceneIntegrity": 100,
      "flatRolloutScore": 45.2,
      "confidence": 70.3,
      "hierarchicalContribution": 72.93,
      "flatContribution": 48.35,
      "overall": 72.51
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 19.5,
      "detailScore": 24.62,
      "temporalScore": 21.81,
      "sceneIntegrity": 42.53,
      "flatRolloutScore": 43.52,
      "confidence": 35.55,
      "hierarchicalContribution": 30.4,
      "flatContribution": 48.11,
      "overall": 40.87
    }
  },
  {
    "id": "dhs-026",
    "input": {
      "structureFit": 0.83,
      "detailFidelity": 0.83,
      "temporalConsistency": 0.8,
      "evidenceStrength": 0.83,
      "sceneCoverage": 0.84,
      "rolloutSmoothness": 0.84,
      "fluencyScore": 0.34,
      "surprisePressure": 0.27,
      "horizonDrift": 0.22,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 78.57,
      "detailScore": 83.42,
      "temporalScore": 80.36,
      "sceneIntegrity": 88.24,
      "flatRolloutScore": 47.68,
      "confidence": 73.3,
      "hierarchicalContribution": 82.36,
      "flatContribution": 50.93,
      "overall": 80.7
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 33.17,
      "detailScore": 25.66,
      "temporalScore": 22.78,
      "sceneIntegrity": 44.22,
      "flatRolloutScore": 68.8,
      "confidence": 37.1,
      "hierarchicalContribution": 38.93,
      "flatContribution": 63.07,
      "overall": 54.28
    }
  },
  {
    "id": "dhs-027",
    "input": {
      "structureFit": 0.87,
      "detailFidelity": 0.81,
      "temporalConsistency": 0.84,
      "evidenceStrength": 0.87,
      "sceneCoverage": 0.82,
      "rolloutSmoothness": 0.88,
      "fluencyScore": 0.3,
      "surprisePressure": 0.27,
      "horizonDrift": 0.17,
      "horizonBias": "detail_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 68.66,
      "detailScore": 81.73,
      "temporalScore": 100,
      "sceneIntegrity": 66.56,
      "flatRolloutScore": 49.35,
      "confidence": 75.9,
      "hierarchicalContribution": 80.11,
      "flatContribution": 52.55,
      "overall": 79.15
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 30.78,
      "detailScore": 25.15,
      "temporalScore": 21.81,
      "sceneIntegrity": 45.12,
      "flatRolloutScore": 45.22,
      "confidence": 37.2,
      "hierarchicalContribution": 33.62,
      "flatContribution": 49.74,
      "overall": 43.01
    }
  },
  {
    "id": "dhs-028",
    "input": {
      "structureFit": 0.83,
      "detailFidelity": 0.86,
      "temporalConsistency": 0.87,
      "evidenceStrength": 0.83,
      "sceneCoverage": 0.86,
      "rolloutSmoothness": 0.84,
      "fluencyScore": 0.31,
      "surprisePressure": 0.2,
      "horizonDrift": 0.17,
      "horizonBias": "rollout_first",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 54.22,
      "detailScore": 76.05,
      "temporalScore": 60.66,
      "sceneIntegrity": 54.44,
      "flatRolloutScore": 48.34,
      "confidence": 76.1,
      "hierarchicalContribution": 61.31,
      "flatContribution": 51.77,
      "overall": 60.59
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 38.81,
      "detailScore": 25.06,
      "temporalScore": 22.23,
      "sceneIntegrity": 43.18,
      "flatRolloutScore": 86.95,
      "confidence": 37.65,
      "hierarchicalContribution": 43.25,
      "flatContribution": 72.61,
      "overall": 63.53
    }
  },
  {
    "id": "dhs-029",
    "input": {
      "structureFit": 0.87,
      "detailFidelity": 0.9,
      "temporalConsistency": 0.91,
      "evidenceStrength": 0.87,
      "sceneCoverage": 0.9,
      "rolloutSmoothness": 0.87,
      "fluencyScore": 0.33,
      "surprisePressure": 0.2,
      "horizonDrift": 0.18,
      "horizonBias": "balanced",
      "profile": "hierarchical"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 83.08,
      "detailScore": 89.66,
      "temporalScore": 89.75,
      "sceneIntegrity": 93.95,
      "flatRolloutScore": 50.59,
      "confidence": 79.6,
      "hierarchicalContribution": 88.92,
      "flatContribution": 54.19,
      "overall": 86.67
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 36.33,
      "detailScore": 26.4,
      "temporalScore": 23.51,
      "sceneIntegrity": 44.7,
      "flatRolloutScore": 71.06,
      "confidence": 39.5,
      "hierarchicalContribution": 40.4,
      "flatContribution": 65.1,
      "overall": 56.99
    }
  },
  {
    "id": "dhs-030",
    "input": {
      "structureFit": 0.91,
      "detailFidelity": 0.88,
      "temporalConsistency": 0.87,
      "evidenceStrength": 0.91,
      "sceneCoverage": 0.88,
      "rolloutSmoothness": 0.91,
      "fluencyScore": 0.28,
      "surprisePressure": 0.21,
      "horizonDrift": 0.13,
      "horizonBias": "structure_first",
      "profile": "flat"
    },
    "expectedHierarchical": {
      "mode": "hierarchical",
      "structureScore": 72.3,
      "detailScore": 88.02,
      "temporalScore": 63.28,
      "sceneIntegrity": 100,
      "flatRolloutScore": 51.88,
      "confidence": 80.35,
      "hierarchicalContribution": 79.64,
      "flatContribution": 55.34,
      "overall": 79.27
    },
    "expectedFlat": {
      "mode": "flat",
      "structureScore": 25.72,
      "detailScore": 25.33,
      "temporalScore": 22.37,
      "sceneIntegrity": 45.32,
      "flatRolloutScore": 46.21,
      "confidence": 38.95,
      "hierarchicalContribution": 32.99,
      "flatContribution": 50.7,
      "overall": 44.34
    }
  }
];
