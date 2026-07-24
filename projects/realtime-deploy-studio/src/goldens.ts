import type { DeployInput, DeployQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DeployInput;
  expectedHarnessed: DeployQuality;
  expectedNaive: DeployQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "pipelineStages": 4,
      "gpuBudget": 2,
      "modalityCount": 2,
      "latencyWeight": 0.18,
      "throughputWeight": 0.79,
      "streamingOverlap": 0.12,
      "stateScopeComplexity": 0.15,
      "placementFlexibility": 0.12,
      "irValidationDepth": 0.09,
      "measurementGateStrictness": 0.12,
      "candidatePassCount": 2,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 16.19,
      "throughputScore": 42.49,
      "correctnessConfidence": 15.66,
      "readinessScore": 24.28,
      "harnessLift": 16.37,
      "criticalPathScore": 16.44,
      "placementScore": 18.21,
      "confidence": 17.14,
      "overall": 24.61
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 36.27,
      "throughputScore": 52.31,
      "correctnessConfidence": 60.04,
      "readinessScore": 45.47,
      "harnessLift": 5.08,
      "criticalPathScore": 37.55,
      "placementScore": 41.58,
      "confidence": 58.16,
      "overall": 46.25
    }
  },
  {
    "id": "std-002",
    "input": {
      "pipelineStages": 5,
      "gpuBudget": 1,
      "modalityCount": 3,
      "latencyWeight": 0.22,
      "throughputWeight": 0.79,
      "streamingOverlap": 0.17,
      "stateScopeComplexity": 0.19,
      "placementFlexibility": 0.16,
      "irValidationDepth": 0.14,
      "measurementGateStrictness": 0.16,
      "candidatePassCount": 3,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 19.14,
      "throughputScore": 36.94,
      "correctnessConfidence": 26.16,
      "readinessScore": 25.95,
      "harnessLift": 24.25,
      "criticalPathScore": 21.65,
      "placementScore": 19.59,
      "confidence": 30.04,
      "overall": 26.45
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 32.88,
      "throughputScore": 45.74,
      "correctnessConfidence": 59.9,
      "readinessScore": 41.12,
      "harnessLift": 4.48,
      "criticalPathScore": 32.97,
      "placementScore": 32.48,
      "confidence": 54.95,
      "overall": 42.17
    }
  },
  {
    "id": "std-003",
    "input": {
      "pipelineStages": 4,
      "gpuBudget": 2,
      "modalityCount": 4,
      "latencyWeight": 0.27,
      "throughputWeight": 0.79,
      "streamingOverlap": 0.14,
      "stateScopeComplexity": 0.24,
      "placementFlexibility": 0.2,
      "irValidationDepth": 0.19,
      "measurementGateStrictness": 0.21,
      "candidatePassCount": 4,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 20.96,
      "throughputScore": 42.09,
      "correctnessConfidence": 29.3,
      "readinessScore": 29.36,
      "harnessLift": 33.04,
      "criticalPathScore": 22.77,
      "placementScore": 23.59,
      "confidence": 31.18,
      "overall": 30.42
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 31.39,
      "throughputScore": 42.69,
      "correctnessConfidence": 56.62,
      "readinessScore": 38.31,
      "harnessLift": 4.43,
      "criticalPathScore": 30.84,
      "placementScore": 40.38,
      "confidence": 54.87,
      "overall": 39.7
    }
  },
  {
    "id": "std-004",
    "input": {
      "pipelineStages": 5,
      "gpuBudget": 2,
      "modalityCount": 1,
      "latencyWeight": 0.31,
      "throughputWeight": 0.7,
      "streamingOverlap": 0.19,
      "stateScopeComplexity": 0.28,
      "placementFlexibility": 0.24,
      "irValidationDepth": 0.14,
      "measurementGateStrictness": 0.25,
      "candidatePassCount": 5,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 33.72,
      "throughputScore": 48.73,
      "correctnessConfidence": 37.05,
      "readinessScore": 38.78,
      "harnessLift": 41.33,
      "criticalPathScore": 35.96,
      "placementScore": 32.96,
      "confidence": 41.48,
      "overall": 39.88
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 40.04,
      "throughputScore": 56.43,
      "correctnessConfidence": 61.88,
      "readinessScore": 49.04,
      "harnessLift": 6.83,
      "criticalPathScore": 40.69,
      "placementScore": 44.68,
      "confidence": 61.66,
      "overall": 49.81
    }
  },
  {
    "id": "std-005",
    "input": {
      "pipelineStages": 6,
      "gpuBudget": 3,
      "modalityCount": 2,
      "latencyWeight": 0.26,
      "throughputWeight": 0.7,
      "streamingOverlap": 0.25,
      "stateScopeComplexity": 0.32,
      "placementFlexibility": 0.28,
      "irValidationDepth": 0.19,
      "measurementGateStrictness": 0.2,
      "candidatePassCount": 6,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 31.8,
      "throughputScore": 54.33,
      "correctnessConfidence": 36.29,
      "readinessScore": 40.06,
      "harnessLift": 45.16,
      "criticalPathScore": 34.36,
      "placementScore": 35.79,
      "confidence": 40.22,
      "overall": 41.36
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 36.39,
      "throughputScore": 52.16,
      "correctnessConfidence": 57.73,
      "readinessScore": 44.38,
      "harnessLift": 6.23,
      "criticalPathScore": 35.93,
      "placementScore": 51.57,
      "confidence": 60.46,
      "overall": 45.71
    }
  },
  {
    "id": "std-006",
    "input": {
      "pipelineStages": 4,
      "gpuBudget": 2,
      "modalityCount": 3,
      "latencyWeight": 0.3,
      "throughputWeight": 0.7,
      "streamingOverlap": 0.21,
      "stateScopeComplexity": 0.25,
      "placementFlexibility": 0.32,
      "irValidationDepth": 0.24,
      "measurementGateStrictness": 0.24,
      "candidatePassCount": 7,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 37.22,
      "throughputScore": 49.21,
      "correctnessConfidence": 47.36,
      "readinessScore": 43.01,
      "harnessLift": 53.97,
      "criticalPathScore": 42.17,
      "placementScore": 38.32,
      "confidence": 53.12,
      "overall": 44.52
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 37.09,
      "throughputScore": 48.11,
      "correctnessConfidence": 61.2,
      "readinessScore": 44.14,
      "harnessLift": 6.78,
      "criticalPathScore": 36.52,
      "placementScore": 44.54,
      "confidence": 59.56,
      "overall": 45.18
    }
  },
  {
    "id": "std-007",
    "input": {
      "pipelineStages": 6,
      "gpuBudget": 3,
      "modalityCount": 4,
      "latencyWeight": 0.34,
      "throughputWeight": 0.7,
      "streamingOverlap": 0.27,
      "stateScopeComplexity": 0.29,
      "placementFlexibility": 0.25,
      "irValidationDepth": 0.29,
      "measurementGateStrictness": 0.28,
      "candidatePassCount": 8,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 34.85,
      "throughputScore": 52.49,
      "correctnessConfidence": 49.02,
      "readinessScore": 43.11,
      "harnessLift": 61.17,
      "criticalPathScore": 39.84,
      "placementScore": 35.73,
      "confidence": 52.26,
      "overall": 45.66
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 33.41,
      "throughputScore": 42.96,
      "correctnessConfidence": 55.24,
      "readinessScore": 38.48,
      "harnessLift": 5.78,
      "criticalPathScore": 30.94,
      "placementScore": 48.3,
      "confidence": 57.55,
      "overall": 40.35
    }
  },
  {
    "id": "std-008",
    "input": {
      "pipelineStages": 7,
      "gpuBudget": 2,
      "modalityCount": 1,
      "latencyWeight": 0.39,
      "throughputWeight": 0.61,
      "streamingOverlap": 0.32,
      "stateScopeComplexity": 0.33,
      "placementFlexibility": 0.29,
      "irValidationDepth": 0.24,
      "measurementGateStrictness": 0.33,
      "candidatePassCount": 1,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 34.32,
      "throughputScore": 49.91,
      "correctnessConfidence": 31.17,
      "readinessScore": 38.25,
      "harnessLift": 23.22,
      "criticalPathScore": 33.69,
      "placementScore": 33.52,
      "confidence": 30.8,
      "overall": 37.51
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 39.75,
      "throughputScore": 53.54,
      "correctnessConfidence": 60.49,
      "readinessScore": 47.17,
      "harnessLift": 4.17,
      "criticalPathScore": 39.17,
      "placementScore": 44.59,
      "confidence": 60.35,
      "overall": 48.27
    }
  },
  {
    "id": "std-009",
    "input": {
      "pipelineStages": 5,
      "gpuBudget": 4,
      "modalityCount": 2,
      "latencyWeight": 0.43,
      "throughputWeight": 0.61,
      "streamingOverlap": 0.29,
      "stateScopeComplexity": 0.38,
      "placementFlexibility": 0.33,
      "irValidationDepth": 0.29,
      "measurementGateStrictness": 0.37,
      "candidatePassCount": 2,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 38.46,
      "throughputScore": 62.99,
      "correctnessConfidence": 34.09,
      "readinessScore": 45.74,
      "harnessLift": 31.79,
      "criticalPathScore": 35.93,
      "placementScore": 43.75,
      "confidence": 31.7,
      "overall": 45.06
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 41.51,
      "throughputScore": 54.29,
      "correctnessConfidence": 57.74,
      "readinessScore": 47.29,
      "harnessLift": 4.42,
      "criticalPathScore": 39.9,
      "placementScore": 61.02,
      "confidence": 64.84,
      "overall": 48.77
    }
  },
  {
    "id": "std-010",
    "input": {
      "pipelineStages": 6,
      "gpuBudget": 3,
      "modalityCount": 3,
      "latencyWeight": 0.38,
      "throughputWeight": 0.61,
      "streamingOverlap": 0.34,
      "stateScopeComplexity": 0.42,
      "placementFlexibility": 0.37,
      "irValidationDepth": 0.35,
      "measurementGateStrictness": 0.32,
      "candidatePassCount": 3,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 40.49,
      "throughputScore": 58.98,
      "correctnessConfidence": 41.75,
      "readinessScore": 46.92,
      "harnessLift": 35.82,
      "criticalPathScore": 41.89,
      "placementScore": 44.68,
      "confidence": 42.7,
      "overall": 46.15
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 36.85,
      "throughputScore": 47.71,
      "correctnessConfidence": 57.6,
      "readinessScore": 42.43,
      "harnessLift": 3.82,
      "criticalPathScore": 34.43,
      "placementScore": 51.92,
      "confidence": 61.64,
      "overall": 44.13
    }
  },
  {
    "id": "std-011",
    "input": {
      "pipelineStages": 8,
      "gpuBudget": 4,
      "modalityCount": 4,
      "latencyWeight": 0.42,
      "throughputWeight": 0.61,
      "streamingOverlap": 0.4,
      "stateScopeComplexity": 0.46,
      "placementFlexibility": 0.41,
      "irValidationDepth": 0.4,
      "measurementGateStrictness": 0.36,
      "candidatePassCount": 4,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 40.03,
      "throughputScore": 63.33,
      "correctnessConfidence": 44.1,
      "readinessScore": 49,
      "harnessLift": 43.48,
      "criticalPathScore": 40.8,
      "placementScore": 47.77,
      "confidence": 43.6,
      "overall": 48.7
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 33.53,
      "throughputScore": 42.8,
      "correctnessConfidence": 52.93,
      "readinessScore": 37.38,
      "harnessLift": 2.93,
      "criticalPathScore": 29.32,
      "placementScore": 58.29,
      "confidence": 59.85,
      "overall": 39.8
    }
  },
  {
    "id": "std-012",
    "input": {
      "pipelineStages": 6,
      "gpuBudget": 3,
      "modalityCount": 1,
      "latencyWeight": 0.47,
      "throughputWeight": 0.52,
      "streamingOverlap": 0.36,
      "stateScopeComplexity": 0.39,
      "placementFlexibility": 0.45,
      "irValidationDepth": 0.35,
      "measurementGateStrictness": 0.41,
      "candidatePassCount": 5,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 52.55,
      "throughputScore": 62.2,
      "correctnessConfidence": 52.8,
      "readinessScore": 55.47,
      "harnessLift": 53.14,
      "criticalPathScore": 54.44,
      "placementScore": 52.35,
      "confidence": 54.14,
      "overall": 55.74
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 43.97,
      "throughputScore": 55.92,
      "correctnessConfidence": 61.79,
      "readinessScore": 50.19,
      "harnessLift": 6.48,
      "criticalPathScore": 42.73,
      "placementScore": 56.66,
      "confidence": 64.95,
      "overall": 51.29
    }
  },
  {
    "id": "std-013",
    "input": {
      "pipelineStages": 7,
      "gpuBudget": 4,
      "modalityCount": 2,
      "latencyWeight": 0.51,
      "throughputWeight": 0.52,
      "streamingOverlap": 0.42,
      "stateScopeComplexity": 0.43,
      "placementFlexibility": 0.48,
      "irValidationDepth": 0.4,
      "measurementGateStrictness": 0.45,
      "candidatePassCount": 6,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 51.73,
      "throughputScore": 66.47,
      "correctnessConfidence": 55.23,
      "readinessScore": 57.37,
      "harnessLift": 60.99,
      "criticalPathScore": 52.47,
      "placementScore": 55.21,
      "confidence": 54.88,
      "overall": 58.15
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 41.54,
      "throughputScore": 51.62,
      "correctnessConfidence": 57.53,
      "readinessScore": 45.98,
      "harnessLift": 5.86,
      "criticalPathScore": 38.8,
      "placementScore": 63.31,
      "confidence": 63.73,
      "overall": 47.69
    }
  },
  {
    "id": "std-014",
    "input": {
      "pipelineStages": 9,
      "gpuBudget": 4,
      "modalityCount": 3,
      "latencyWeight": 0.55,
      "throughputWeight": 0.52,
      "streamingOverlap": 0.47,
      "stateScopeComplexity": 0.47,
      "placementFlexibility": 0.42,
      "irValidationDepth": 0.45,
      "measurementGateStrictness": 0.49,
      "candidatePassCount": 7,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 58.8,
      "throughputScore": 69.86,
      "correctnessConfidence": 64.96,
      "readinessScore": 63.1,
      "harnessLift": 68.22,
      "criticalPathScore": 63.76,
      "placementScore": 57.14,
      "confidence": 66.18,
      "overall": 64.28
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 39.34,
      "throughputScore": 47.33,
      "correctnessConfidence": 55.69,
      "readinessScore": 42.25,
      "harnessLift": 4.87,
      "criticalPathScore": 34.28,
      "placementScore": 59.31,
      "confidence": 63.74,
      "overall": 44.61
    }
  },
  {
    "id": "std-015",
    "input": {
      "pipelineStages": 7,
      "gpuBudget": 5,
      "modalityCount": 4,
      "latencyWeight": 0.5,
      "throughputWeight": 0.52,
      "streamingOverlap": 0.44,
      "stateScopeComplexity": 0.52,
      "placementFlexibility": 0.46,
      "irValidationDepth": 0.5,
      "measurementGateStrictness": 0.44,
      "candidatePassCount": 8,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 54.34,
      "throughputScore": 72.91,
      "correctnessConfidence": 64.62,
      "readinessScore": 62.94,
      "harnessLift": 72.74,
      "criticalPathScore": 57.38,
      "placementScore": 60.82,
      "confidence": 64.92,
      "overall": 64.12
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 37.39,
      "throughputScore": 44.93,
      "correctnessConfidence": 52.93,
      "readinessScore": 39.79,
      "harnessLift": 5.12,
      "criticalPathScore": 32.41,
      "placementScore": 67.73,
      "confidence": 64.24,
      "overall": 42.31
    }
  },
  {
    "id": "std-016",
    "input": {
      "pipelineStages": 8,
      "gpuBudget": 4,
      "modalityCount": 1,
      "latencyWeight": 0.54,
      "throughputWeight": 0.43,
      "streamingOverlap": 0.49,
      "stateScopeComplexity": 0.56,
      "placementFlexibility": 0.5,
      "irValidationDepth": 0.45,
      "measurementGateStrictness": 0.48,
      "candidatePassCount": 1,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 55.34,
      "throughputScore": 71.94,
      "correctnessConfidence": 46.4,
      "readinessScore": 59.01,
      "harnessLift": 34.34,
      "criticalPathScore": 53.66,
      "placementScore": 58.55,
      "confidence": 43.22,
      "overall": 56.98
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 43.59,
      "throughputScore": 55.52,
      "correctnessConfidence": 58.19,
      "readinessScore": 48.43,
      "harnessLift": 3.52,
      "criticalPathScore": 40.55,
      "placementScore": 64.03,
      "confidence": 67.03,
      "overall": 50.18
    }
  },
  {
    "id": "std-017",
    "input": {
      "pipelineStages": 9,
      "gpuBudget": 5,
      "modalityCount": 2,
      "latencyWeight": 0.59,
      "throughputWeight": 0.43,
      "streamingOverlap": 0.55,
      "stateScopeComplexity": 0.61,
      "placementFlexibility": 0.54,
      "irValidationDepth": 0.5,
      "measurementGateStrictness": 0.53,
      "candidatePassCount": 2,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 54.81,
      "throughputScore": 75.51,
      "correctnessConfidence": 49.25,
      "readinessScore": 60.98,
      "harnessLift": 42.66,
      "criticalPathScore": 52.05,
      "placementScore": 61.97,
      "confidence": 44.36,
      "overall": 59.41
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 41.14,
      "throughputScore": 51.19,
      "correctnessConfidence": 53.86,
      "readinessScore": 44.17,
      "harnessLift": 2.89,
      "criticalPathScore": 36.58,
      "placementScore": 70.88,
      "confidence": 65.78,
      "overall": 46.54
    }
  },
  {
    "id": "std-018",
    "input": {
      "pipelineStages": 8,
      "gpuBudget": 5,
      "modalityCount": 3,
      "latencyWeight": 0.63,
      "throughputWeight": 0.43,
      "streamingOverlap": 0.51,
      "stateScopeComplexity": 0.53,
      "placementFlexibility": 0.58,
      "irValidationDepth": 0.55,
      "measurementGateStrictness": 0.57,
      "candidatePassCount": 3,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 64.82,
      "throughputScore": 81.12,
      "correctnessConfidence": 60.19,
      "readinessScore": 69.6,
      "harnessLift": 51.25,
      "criticalPathScore": 64.4,
      "placementScore": 70.23,
      "confidence": 57.26,
      "overall": 67.92
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 43.56,
      "throughputScore": 49.71,
      "correctnessConfidence": 56.99,
      "readinessScore": 45.27,
      "harnessLift": 3.17,
      "criticalPathScore": 37.84,
      "placementScore": 71.37,
      "confidence": 68.34,
      "overall": 47.63
    }
  },
  {
    "id": "std-019",
    "input": {
      "pipelineStages": 9,
      "gpuBudget": 6,
      "modalityCount": 4,
      "latencyWeight": 0.67,
      "throughputWeight": 0.43,
      "streamingOverlap": 0.57,
      "stateScopeComplexity": 0.57,
      "placementFlexibility": 0.61,
      "irValidationDepth": 0.6,
      "measurementGateStrictness": 0.61,
      "candidatePassCount": 4,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 62.81,
      "throughputScore": 84.15,
      "correctnessConfidence": 62.62,
      "readinessScore": 70.72,
      "harnessLift": 59.1,
      "criticalPathScore": 60.8,
      "placementScore": 73.1,
      "confidence": 58,
      "overall": 69.48
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 41.13,
      "throughputScore": 45.41,
      "correctnessConfidence": 52.73,
      "readinessScore": 41.06,
      "harnessLift": 2.56,
      "criticalPathScore": 33.91,
      "placementScore": 78.03,
      "confidence": 67.12,
      "overall": 44.02
    }
  },
  {
    "id": "std-020",
    "input": {
      "pipelineStages": 10,
      "gpuBudget": 5,
      "modalityCount": 1,
      "latencyWeight": 0.62,
      "throughputWeight": 0.34,
      "streamingOverlap": 0.62,
      "stateScopeComplexity": 0.62,
      "placementFlexibility": 0.65,
      "irValidationDepth": 0.55,
      "measurementGateStrictness": 0.56,
      "candidatePassCount": 5,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 73.22,
      "throughputScore": 85.05,
      "correctnessConfidence": 67.1,
      "readinessScore": 75.94,
      "harnessLift": 63.32,
      "criticalPathScore": 74.91,
      "placementScore": 75.88,
      "confidence": 66.14,
      "overall": 75.04
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 45.88,
      "throughputScore": 55.94,
      "correctnessConfidence": 57.8,
      "readinessScore": 49.04,
      "harnessLift": 4.93,
      "criticalPathScore": 40.98,
      "placementScore": 74.28,
      "confidence": 69.87,
      "overall": 51.2
    }
  },
  {
    "id": "std-021",
    "input": {
      "pipelineStages": 9,
      "gpuBudget": 6,
      "modalityCount": 2,
      "latencyWeight": 0.66,
      "throughputWeight": 0.34,
      "streamingOverlap": 0.59,
      "stateScopeComplexity": 0.66,
      "placementFlexibility": 0.59,
      "irValidationDepth": 0.6,
      "measurementGateStrictness": 0.6,
      "candidatePassCount": 6,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 68.16,
      "throughputScore": 84.64,
      "correctnessConfidence": 69.26,
      "readinessScore": 74.3,
      "harnessLift": 71.26,
      "criticalPathScore": 67.84,
      "placementScore": 74.68,
      "confidence": 65.44,
      "overall": 74.15
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 44.13,
      "throughputScore": 52.73,
      "correctnessConfidence": 53.53,
      "readinessScore": 45.78,
      "harnessLift": 4.81,
      "criticalPathScore": 38.52,
      "placementScore": 79.85,
      "confidence": 69.63,
      "overall": 48.36
    }
  },
  {
    "id": "std-022",
    "input": {
      "pipelineStages": 10,
      "gpuBudget": 5,
      "modalityCount": 3,
      "latencyWeight": 0.71,
      "throughputWeight": 0.34,
      "streamingOverlap": 0.64,
      "stateScopeComplexity": 0.7,
      "placementFlexibility": 0.63,
      "irValidationDepth": 0.66,
      "measurementGateStrictness": 0.65,
      "candidatePassCount": 7,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 76.9,
      "throughputScore": 82.8,
      "correctnessConfidence": 80.55,
      "readinessScore": 79.3,
      "harnessLift": 79.79,
      "criticalPathScore": 81.58,
      "placementScore": 76.23,
      "confidence": 78.84,
      "overall": 79.63
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 40.87,
      "throughputScore": 46.16,
      "correctnessConfidence": 53.38,
      "readinessScore": 41.48,
      "harnessLift": 4.21,
      "criticalPathScore": 34.04,
      "placementScore": 70.74,
      "confidence": 66.43,
      "overall": 44.33
    }
  },
  {
    "id": "std-023",
    "input": {
      "pipelineStages": 11,
      "gpuBudget": 7,
      "modalityCount": 4,
      "latencyWeight": 0.75,
      "throughputWeight": 0.34,
      "streamingOverlap": 0.7,
      "stateScopeComplexity": 0.75,
      "placementFlexibility": 0.67,
      "irValidationDepth": 0.71,
      "measurementGateStrictness": 0.69,
      "candidatePassCount": 8,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 76.58,
      "throughputScore": 94.23,
      "correctnessConfidence": 83.03,
      "readinessScore": 84.52,
      "harnessLift": 87.66,
      "criticalPathScore": 77.74,
      "placementScore": 85.58,
      "confidence": 79.74,
      "overall": 84.73
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 40.73,
      "throughputScore": 44.98,
      "correctnessConfidence": 49.06,
      "readinessScore": 39.25,
      "harnessLift": 3.59,
      "criticalPathScore": 31.68,
      "placementScore": 85.6,
      "confidence": 69.17,
      "overall": 42.88
    }
  },
  {
    "id": "std-024",
    "input": {
      "pipelineStages": 9,
      "gpuBudget": 6,
      "modalityCount": 1,
      "latencyWeight": 0.8,
      "throughputWeight": 0.25,
      "streamingOverlap": 0.66,
      "stateScopeComplexity": 0.67,
      "placementFlexibility": 0.71,
      "irValidationDepth": 0.66,
      "measurementGateStrictness": 0.74,
      "candidatePassCount": 1,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 80.87,
      "throughputScore": 94.62,
      "correctnessConfidence": 65.77,
      "readinessScore": 82.53,
      "harnessLift": 50.66,
      "criticalPathScore": 77.32,
      "placementScore": 84.56,
      "confidence": 58.28,
      "overall": 79.64
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 51.37,
      "throughputScore": 58.15,
      "correctnessConfidence": 58.11,
      "readinessScore": 52.22,
      "harnessLift": 3.16,
      "criticalPathScore": 45.28,
      "placementScore": 84.01,
      "confidence": 74.32,
      "overall": 54.52
    }
  },
  {
    "id": "std-025",
    "input": {
      "pipelineStages": 11,
      "gpuBudget": 7,
      "modalityCount": 2,
      "latencyWeight": 0.74,
      "throughputWeight": 0.25,
      "streamingOverlap": 0.72,
      "stateScopeComplexity": 0.71,
      "placementFlexibility": 0.74,
      "irValidationDepth": 0.71,
      "measurementGateStrictness": 0.68,
      "candidatePassCount": 2,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 73.85,
      "throughputScore": 95.8,
      "correctnessConfidence": 64.43,
      "readinessScore": 80.45,
      "harnessLift": 53.76,
      "criticalPathScore": 69.31,
      "placementScore": 86.51,
      "confidence": 56.62,
      "overall": 77.52
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 46.61,
      "throughputScore": 53.21,
      "correctnessConfidence": 53.32,
      "readinessScore": 46.55,
      "harnessLift": 2.26,
      "criticalPathScore": 39.14,
      "placementScore": 90.14,
      "confidence": 72.51,
      "overall": 49.52
    }
  },
  {
    "id": "std-026",
    "input": {
      "pipelineStages": 12,
      "gpuBudget": 6,
      "modalityCount": 3,
      "latencyWeight": 0.78,
      "throughputWeight": 0.25,
      "streamingOverlap": 0.77,
      "stateScopeComplexity": 0.76,
      "placementFlexibility": 0.78,
      "irValidationDepth": 0.76,
      "measurementGateStrictness": 0.72,
      "candidatePassCount": 3,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 82.38,
      "throughputScore": 94.88,
      "correctnessConfidence": 74.92,
      "readinessScore": 85.46,
      "harnessLift": 61.63,
      "criticalPathScore": 82.68,
      "placementScore": 87.87,
      "confidence": 69.52,
      "overall": 83.01
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 43.02,
      "throughputScore": 46.59,
      "correctnessConfidence": 52.99,
      "readinessScore": 42.04,
      "harnessLift": 1.63,
      "criticalPathScore": 34.37,
      "placementScore": 80.99,
      "confidence": 69.26,
      "overall": 45.29
    }
  },
  {
    "id": "std-027",
    "input": {
      "pipelineStages": 10,
      "gpuBudget": 7,
      "modalityCount": 4,
      "latencyWeight": 0.83,
      "throughputWeight": 0.25,
      "streamingOverlap": 0.74,
      "stateScopeComplexity": 0.8,
      "placementFlexibility": 0.82,
      "irValidationDepth": 0.81,
      "measurementGateStrictness": 0.77,
      "candidatePassCount": 4,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 79.31,
      "throughputScore": 95.88,
      "correctnessConfidence": 78.21,
      "readinessScore": 85.99,
      "harnessLift": 70.67,
      "criticalPathScore": 76.25,
      "placementScore": 92.18,
      "confidence": 70.66,
      "overall": 83.81
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 42.66,
      "throughputScore": 44.24,
      "correctnessConfidence": 50.43,
      "readinessScore": 40.3,
      "harnessLift": 1.9,
      "criticalPathScore": 33.67,
      "placementScore": 89.47,
      "confidence": 69.81,
      "overall": 43.75
    }
  },
  {
    "id": "std-028",
    "input": {
      "pipelineStages": 11,
      "gpuBudget": 7,
      "modalityCount": 1,
      "latencyWeight": 0.87,
      "throughputWeight": 0.16,
      "streamingOverlap": 0.79,
      "stateScopeComplexity": 0.84,
      "placementFlexibility": 0.76,
      "irValidationDepth": 0.76,
      "measurementGateStrictness": 0.81,
      "candidatePassCount": 5,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 95.71,
      "throughputScore": 100,
      "correctnessConfidence": 85.34,
      "readinessScore": 95.03,
      "harnessLift": 78.55,
      "criticalPathScore": 96.41,
      "placementScore": 96.39,
      "confidence": 79.36,
      "overall": 93.59
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 51,
      "throughputScore": 57.75,
      "correctnessConfidence": 54.5,
      "readinessScore": 50.46,
      "harnessLift": 4.2,
      "criticalPathScore": 43.1,
      "placementScore": 91.38,
      "confidence": 76.4,
      "overall": 53.41
    }
  },
  {
    "id": "std-029",
    "input": {
      "pipelineStages": 12,
      "gpuBudget": 8,
      "modalityCount": 2,
      "latencyWeight": 0.92,
      "throughputWeight": 0.16,
      "streamingOverlap": 0.85,
      "stateScopeComplexity": 0.89,
      "placementFlexibility": 0.8,
      "irValidationDepth": 0.81,
      "measurementGateStrictness": 0.86,
      "candidatePassCount": 6,
      "profile": "fast"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 90.11,
      "throughputScore": 100,
      "correctnessConfidence": 88.19,
      "readinessScore": 94.15,
      "harnessLift": 86.86,
      "criticalPathScore": 87.51,
      "placementScore": 99.81,
      "confidence": 80.5,
      "overall": 92.91
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 48.54,
      "throughputScore": 53.43,
      "correctnessConfidence": 50.18,
      "readinessScore": 46.21,
      "harnessLift": 3.57,
      "criticalPathScore": 39.13,
      "placementScore": 98.24,
      "confidence": 75.15,
      "overall": 49.77
    }
  },
  {
    "id": "std-030",
    "input": {
      "pipelineStages": 11,
      "gpuBudget": 7,
      "modalityCount": 3,
      "latencyWeight": 0.86,
      "throughputWeight": 0.16,
      "streamingOverlap": 0.81,
      "stateScopeComplexity": 0.81,
      "placementFlexibility": 0.84,
      "irValidationDepth": 0.86,
      "measurementGateStrictness": 0.8,
      "candidatePassCount": 7,
      "profile": "full"
    },
    "expectedHarnessed": {
      "mode": "harnessed",
      "ttfoScore": 97.12,
      "throughputScore": 100,
      "correctnessConfidence": 95.5,
      "readinessScore": 98.09,
      "harnessLift": 90.95,
      "criticalPathScore": 100,
      "placementScore": 100,
      "confidence": 91,
      "overall": 97.16
    },
    "expectedNaive": {
      "mode": "naive",
      "ttfoScore": 47.11,
      "throughputScore": 48.79,
      "correctnessConfidence": 53.3,
      "readinessScore": 44.66,
      "harnessLift": 3.86,
      "criticalPathScore": 37.69,
      "placementScore": 90.72,
      "confidence": 73.71,
      "overall": 47.99
    }
  }
];
