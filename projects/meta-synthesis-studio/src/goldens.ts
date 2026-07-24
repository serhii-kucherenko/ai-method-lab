import type { SynthesisInput, SynthesisQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SynthesisInput;
  expectedAgentic: SynthesisQuality;
  expectedAdhoc: SynthesisQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "mss-001",
    "input": {
      "questionClarity": 0.19,
      "searchBreadth": 0.17,
      "screenDiscipline": 0.15,
      "extractionCompleteness": 0.18,
      "studyCount": 5,
      "effectPrecision": 0.17,
      "heterogeneityAware": 0.1,
      "poolingQuality": 0.2,
      "inclusionStrictness": 0.17,
      "duplicateControl": 0.13,
      "biasAssessment": 0.13,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 10.41,
      "screenCoverage": 14,
      "extractionFidelity": 11.51,
      "pooledConfidence": 12.85,
      "heterogeneityScore": 12.88,
      "auditTrail": 13.32,
      "overall": 12.48
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 37.86,
      "screenCoverage": 0,
      "extractionFidelity": 45.34,
      "pooledConfidence": 27.35,
      "heterogeneityScore": 0,
      "auditTrail": 14.29,
      "overall": 24.66
    }
  },
  {
    "id": "mss-002",
    "input": {
      "questionClarity": 0.22,
      "searchBreadth": 0.21,
      "screenDiscipline": 0.19,
      "extractionCompleteness": 0.22,
      "studyCount": 6,
      "effectPrecision": 0.21,
      "heterogeneityAware": 0.15,
      "poolingQuality": 0.24,
      "inclusionStrictness": 0.21,
      "duplicateControl": 0.17,
      "biasAssessment": 0.16,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 13.81,
      "screenCoverage": 17.64,
      "extractionFidelity": 15.24,
      "pooledConfidence": 16.88,
      "heterogeneityScore": 16.98,
      "auditTrail": 16.42,
      "overall": 16.19
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 39.26,
      "screenCoverage": 0,
      "extractionFidelity": 46.91,
      "pooledConfidence": 28.66,
      "heterogeneityScore": 0,
      "auditTrail": 15.18,
      "overall": 25.66
    }
  },
  {
    "id": "mss-003",
    "input": {
      "questionClarity": 0.26,
      "searchBreadth": 0.26,
      "screenDiscipline": 0.18,
      "extractionCompleteness": 0.25,
      "studyCount": 7,
      "effectPrecision": 0.25,
      "heterogeneityAware": 0.19,
      "poolingQuality": 0.23,
      "inclusionStrictness": 0.25,
      "duplicateControl": 0.21,
      "biasAssessment": 0.2,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 19.04,
      "screenCoverage": 20.14,
      "extractionFidelity": 19.52,
      "pooledConfidence": 22.02,
      "heterogeneityScore": 20.27,
      "auditTrail": 21.44,
      "overall": 20.37
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 42.9,
      "screenCoverage": 0,
      "extractionFidelity": 51.16,
      "pooledConfidence": 30.52,
      "heterogeneityScore": 0,
      "auditTrail": 17.99,
      "overall": 28.05
    }
  },
  {
    "id": "mss-004",
    "input": {
      "questionClarity": 0.3,
      "searchBreadth": 0.22,
      "screenDiscipline": 0.22,
      "extractionCompleteness": 0.29,
      "studyCount": 8,
      "effectPrecision": 0.23,
      "heterogeneityAware": 0.24,
      "poolingQuality": 0.27,
      "inclusionStrictness": 0.23,
      "duplicateControl": 0.25,
      "biasAssessment": 0.24,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 18.69,
      "screenCoverage": 21.14,
      "extractionFidelity": 20.48,
      "pooledConfidence": 21.18,
      "heterogeneityScore": 22.56,
      "auditTrail": 21.74,
      "overall": 20.89
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 41.4,
      "screenCoverage": 0,
      "extractionFidelity": 49.01,
      "pooledConfidence": 29.95,
      "heterogeneityScore": 0,
      "auditTrail": 16.98,
      "overall": 27.05
    }
  },
  {
    "id": "mss-005",
    "input": {
      "questionClarity": 0.27,
      "searchBreadth": 0.26,
      "screenDiscipline": 0.27,
      "extractionCompleteness": 0.33,
      "studyCount": 9,
      "effectPrecision": 0.27,
      "heterogeneityAware": 0.18,
      "poolingQuality": 0.31,
      "inclusionStrictness": 0.27,
      "duplicateControl": 0.28,
      "biasAssessment": 0.21,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 19.57,
      "screenCoverage": 25.02,
      "extractionFidelity": 23.31,
      "pooledConfidence": 23.74,
      "heterogeneityScore": 21.38,
      "auditTrail": 21.74,
      "overall": 22.6
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 41.28,
      "screenCoverage": 0,
      "extractionFidelity": 50.44,
      "pooledConfidence": 30.88,
      "heterogeneityScore": 0,
      "auditTrail": 16.89,
      "overall": 27.5
    }
  },
  {
    "id": "mss-006",
    "input": {
      "questionClarity": 0.31,
      "searchBreadth": 0.31,
      "screenDiscipline": 0.25,
      "extractionCompleteness": 0.28,
      "studyCount": 10,
      "effectPrecision": 0.31,
      "heterogeneityAware": 0.23,
      "poolingQuality": 0.3,
      "inclusionStrictness": 0.31,
      "duplicateControl": 0.32,
      "biasAssessment": 0.25,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 25.06,
      "screenCoverage": 27.45,
      "extractionFidelity": 24.03,
      "pooledConfidence": 28.04,
      "heterogeneityScore": 25.39,
      "auditTrail": 26.72,
      "overall": 26.19
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 44.92,
      "screenCoverage": 0.38,
      "extractionFidelity": 52.76,
      "pooledConfidence": 32.22,
      "heterogeneityScore": 0,
      "auditTrail": 19.7,
      "overall": 29.44
    }
  },
  {
    "id": "mss-007",
    "input": {
      "questionClarity": 0.34,
      "searchBreadth": 0.35,
      "screenDiscipline": 0.3,
      "extractionCompleteness": 0.32,
      "studyCount": 11,
      "effectPrecision": 0.35,
      "heterogeneityAware": 0.28,
      "poolingQuality": 0.34,
      "inclusionStrictness": 0.35,
      "duplicateControl": 0.26,
      "biasAssessment": 0.28,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 25.7,
      "screenCoverage": 28.4,
      "extractionFidelity": 26.44,
      "pooledConfidence": 28.82,
      "heterogeneityScore": 28.28,
      "auditTrail": 25.64,
      "overall": 27.39
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 44.34,
      "screenCoverage": 1.27,
      "extractionFidelity": 51.35,
      "pooledConfidence": 32.81,
      "heterogeneityScore": 0,
      "auditTrail": 17.82,
      "overall": 29.03
    }
  },
  {
    "id": "mss-008",
    "input": {
      "questionClarity": 0.38,
      "searchBreadth": 0.31,
      "screenDiscipline": 0.34,
      "extractionCompleteness": 0.36,
      "studyCount": 12,
      "effectPrecision": 0.33,
      "heterogeneityAware": 0.32,
      "poolingQuality": 0.38,
      "inclusionStrictness": 0.33,
      "duplicateControl": 0.29,
      "biasAssessment": 0.32,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 26.34,
      "screenCoverage": 30.18,
      "extractionFidelity": 28.52,
      "pooledConfidence": 30.58,
      "heterogeneityScore": 31.06,
      "auditTrail": 28.62,
      "overall": 29.29
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 44.82,
      "screenCoverage": 2.19,
      "extractionFidelity": 52.19,
      "pooledConfidence": 33.12,
      "heterogeneityScore": 0,
      "auditTrail": 18.7,
      "overall": 29.61
    }
  },
  {
    "id": "mss-009",
    "input": {
      "questionClarity": 0.42,
      "searchBreadth": 0.36,
      "screenDiscipline": 0.33,
      "extractionCompleteness": 0.4,
      "studyCount": 13,
      "effectPrecision": 0.37,
      "heterogeneityAware": 0.37,
      "poolingQuality": 0.37,
      "inclusionStrictness": 0.37,
      "duplicateControl": 0.33,
      "biasAssessment": 0.36,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 32.16,
      "screenCoverage": 33.31,
      "extractionFidelity": 33.92,
      "pooledConfidence": 36.46,
      "heterogeneityScore": 35.55,
      "auditTrail": 33.82,
      "overall": 34.24
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 48.48,
      "screenCoverage": 2.95,
      "extractionFidelity": 56.69,
      "pooledConfidence": 35.14,
      "heterogeneityScore": 0.13,
      "auditTrail": 21.54,
      "overall": 32.21
    }
  },
  {
    "id": "mss-010",
    "input": {
      "questionClarity": 0.39,
      "searchBreadth": 0.4,
      "screenDiscipline": 0.37,
      "extractionCompleteness": 0.43,
      "studyCount": 14,
      "effectPrecision": 0.4,
      "heterogeneityAware": 0.31,
      "poolingQuality": 0.41,
      "inclusionStrictness": 0.4,
      "duplicateControl": 0.37,
      "biasAssessment": 0.33,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 31.36,
      "screenCoverage": 35.08,
      "extractionFidelity": 34.21,
      "pooledConfidence": 35.23,
      "heterogeneityScore": 32.54,
      "auditTrail": 30.74,
      "overall": 33.46
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 46.34,
      "screenCoverage": 3.8,
      "extractionFidelity": 54.74,
      "pooledConfidence": 35.01,
      "heterogeneityScore": 0,
      "auditTrail": 19.5,
      "overall": 31.18
    }
  },
  {
    "id": "mss-011",
    "input": {
      "questionClarity": 0.43,
      "searchBreadth": 0.44,
      "screenDiscipline": 0.42,
      "extractionCompleteness": 0.47,
      "studyCount": 15,
      "effectPrecision": 0.44,
      "heterogeneityAware": 0.36,
      "poolingQuality": 0.45,
      "inclusionStrictness": 0.44,
      "duplicateControl": 0.41,
      "biasAssessment": 0.37,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 35.16,
      "screenCoverage": 39.14,
      "extractionFidelity": 38.09,
      "pooledConfidence": 39.39,
      "heterogeneityScore": 36.64,
      "auditTrail": 34.26,
      "overall": 37.42
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 47.98,
      "screenCoverage": 5.49,
      "extractionFidelity": 56.33,
      "pooledConfidence": 36.5,
      "heterogeneityScore": 1.07,
      "auditTrail": 20.52,
      "overall": 32.64
    }
  },
  {
    "id": "mss-012",
    "input": {
      "questionClarity": 0.47,
      "searchBreadth": 0.41,
      "screenDiscipline": 0.4,
      "extractionCompleteness": 0.42,
      "studyCount": 16,
      "effectPrecision": 0.42,
      "heterogeneityAware": 0.4,
      "poolingQuality": 0.44,
      "inclusionStrictness": 0.42,
      "duplicateControl": 0.45,
      "biasAssessment": 0.41,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 38.21,
      "screenCoverage": 40.51,
      "extractionFidelity": 37.62,
      "pooledConfidence": 41.89,
      "heterogeneityScore": 40.03,
      "auditTrail": 39.06,
      "overall": 39.69
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 50.48,
      "screenCoverage": 5.56,
      "extractionFidelity": 57.92,
      "pooledConfidence": 36.74,
      "heterogeneityScore": 1.32,
      "auditTrail": 23.3,
      "overall": 33.94
    }
  },
  {
    "id": "mss-013",
    "input": {
      "questionClarity": 0.5,
      "searchBreadth": 0.45,
      "screenDiscipline": 0.45,
      "extractionCompleteness": 0.46,
      "studyCount": 17,
      "effectPrecision": 0.46,
      "heterogeneityAware": 0.45,
      "poolingQuality": 0.48,
      "inclusionStrictness": 0.46,
      "duplicateControl": 0.49,
      "biasAssessment": 0.44,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 39.64,
      "screenCoverage": 42.64,
      "extractionFidelity": 39.42,
      "pooledConfidence": 42.59,
      "heterogeneityScore": 42.22,
      "auditTrail": 39.38,
      "overall": 41.18
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 49.9,
      "screenCoverage": 7.25,
      "extractionFidelity": 56.51,
      "pooledConfidence": 37.39,
      "heterogeneityScore": 2.39,
      "auditTrail": 22.22,
      "overall": 33.87
    }
  },
  {
    "id": "mss-014",
    "input": {
      "questionClarity": 0.54,
      "searchBreadth": 0.49,
      "screenDiscipline": 0.49,
      "extractionCompleteness": 0.5,
      "studyCount": 18,
      "effectPrecision": 0.5,
      "heterogeneityAware": 0.5,
      "poolingQuality": 0.52,
      "inclusionStrictness": 0.5,
      "duplicateControl": 0.42,
      "biasAssessment": 0.48,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 41.93,
      "screenCoverage": 44.3,
      "extractionFidelity": 43.3,
      "pooledConfidence": 46.23,
      "heterogeneityScore": 46.32,
      "auditTrail": 41.14,
      "overall": 44.11
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 51.52,
      "screenCoverage": 7.9,
      "extractionFidelity": 58.09,
      "pooledConfidence": 38.76,
      "heterogeneityScore": 3.41,
      "auditTrail": 22.33,
      "overall": 35.02
    }
  },
  {
    "id": "mss-015",
    "input": {
      "questionClarity": 0.51,
      "searchBreadth": 0.54,
      "screenDiscipline": 0.48,
      "extractionCompleteness": 0.54,
      "studyCount": 19,
      "effectPrecision": 0.54,
      "heterogeneityAware": 0.44,
      "poolingQuality": 0.51,
      "inclusionStrictness": 0.54,
      "duplicateControl": 0.46,
      "biasAssessment": 0.45,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 45.58,
      "screenCoverage": 48.13,
      "extractionFidelity": 48.31,
      "pooledConfidence": 51,
      "heterogeneityScore": 46.03,
      "auditTrail": 42.96,
      "overall": 47.42
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 53.42,
      "screenCoverage": 8.06,
      "extractionFidelity": 62.42,
      "pooledConfidence": 40.3,
      "heterogeneityScore": 2.66,
      "auditTrail": 24.14,
      "overall": 36.81
    }
  },
  {
    "id": "mss-016",
    "input": {
      "questionClarity": 0.55,
      "searchBreadth": 0.5,
      "screenDiscipline": 0.52,
      "extractionCompleteness": 0.57,
      "studyCount": 20,
      "effectPrecision": 0.52,
      "heterogeneityAware": 0.49,
      "poolingQuality": 0.55,
      "inclusionStrictness": 0.52,
      "duplicateControl": 0.5,
      "biasAssessment": 0.49,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 44.03,
      "screenCoverage": 47.8,
      "extractionFidelity": 47.49,
      "pooledConfidence": 49.08,
      "heterogeneityScore": 47.1,
      "auditTrail": 43.26,
      "overall": 46.76
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 51.92,
      "screenCoverage": 9.12,
      "extractionFidelity": 60.04,
      "pooledConfidence": 39.76,
      "heterogeneityScore": 3.69,
      "auditTrail": 23.13,
      "overall": 36.02
    }
  },
  {
    "id": "mss-017",
    "input": {
      "questionClarity": 0.59,
      "searchBreadth": 0.55,
      "screenDiscipline": 0.57,
      "extractionCompleteness": 0.61,
      "studyCount": 21,
      "effectPrecision": 0.56,
      "heterogeneityAware": 0.53,
      "poolingQuality": 0.6,
      "inclusionStrictness": 0.56,
      "duplicateControl": 0.54,
      "biasAssessment": 0.53,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 48.13,
      "screenCoverage": 51.86,
      "extractionFidelity": 51.42,
      "pooledConfidence": 53.32,
      "heterogeneityScore": 50.98,
      "auditTrail": 46.6,
      "overall": 50.74
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 53.68,
      "screenCoverage": 10.75,
      "extractionFidelity": 61.61,
      "pooledConfidence": 41.2,
      "heterogeneityScore": 4.73,
      "auditTrail": 24.12,
      "overall": 37.48
    }
  },
  {
    "id": "mss-018",
    "input": {
      "questionClarity": 0.63,
      "searchBreadth": 0.59,
      "screenDiscipline": 0.55,
      "extractionCompleteness": 0.56,
      "studyCount": 22,
      "effectPrecision": 0.6,
      "heterogeneityAware": 0.58,
      "poolingQuality": 0.58,
      "inclusionStrictness": 0.6,
      "duplicateControl": 0.57,
      "biasAssessment": 0.57,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 54.5,
      "screenCoverage": 55.44,
      "extractionFidelity": 53.42,
      "pooledConfidence": 58.4,
      "heterogeneityScore": 56.2,
      "auditTrail": 51.44,
      "overall": 55.26
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 57.18,
      "screenCoverage": 11.28,
      "extractionFidelity": 63.94,
      "pooledConfidence": 42.56,
      "heterogeneityScore": 5.01,
      "auditTrail": 26.85,
      "overall": 39.43
    }
  },
  {
    "id": "mss-019",
    "input": {
      "questionClarity": 0.66,
      "searchBreadth": 0.63,
      "screenDiscipline": 0.6,
      "extractionCompleteness": 0.6,
      "studyCount": 23,
      "effectPrecision": 0.64,
      "heterogeneityAware": 0.63,
      "poolingQuality": 0.62,
      "inclusionStrictness": 0.64,
      "duplicateControl": 0.61,
      "biasAssessment": 0.6,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 55.18,
      "screenCoverage": 56.86,
      "extractionFidelity": 54.5,
      "pooledConfidence": 58.56,
      "heterogeneityScore": 57.62,
      "auditTrail": 51.76,
      "overall": 56.13
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 56.6,
      "screenCoverage": 12.97,
      "extractionFidelity": 62.53,
      "pooledConfidence": 43.21,
      "heterogeneityScore": 6.08,
      "auditTrail": 25.77,
      "overall": 39.36
    }
  },
  {
    "id": "mss-020",
    "input": {
      "questionClarity": 0.63,
      "searchBreadth": 0.6,
      "screenDiscipline": 0.64,
      "extractionCompleteness": 0.64,
      "studyCount": 24,
      "effectPrecision": 0.62,
      "heterogeneityAware": 0.57,
      "poolingQuality": 0.67,
      "inclusionStrictness": 0.62,
      "duplicateControl": 0.65,
      "biasAssessment": 0.57,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 53.49,
      "screenCoverage": 58.82,
      "extractionFidelity": 55.58,
      "pooledConfidence": 59.11,
      "heterogeneityScore": 55.86,
      "auditTrail": 51.68,
      "overall": 56.21
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 55.48,
      "screenCoverage": 13.41,
      "extractionFidelity": 63.22,
      "pooledConfidence": 43.09,
      "heterogeneityScore": 6.03,
      "auditTrail": 25.73,
      "overall": 39.3
    }
  },
  {
    "id": "mss-021",
    "input": {
      "questionClarity": 0.67,
      "searchBreadth": 0.64,
      "screenDiscipline": 0.63,
      "extractionCompleteness": 0.68,
      "studyCount": 25,
      "effectPrecision": 0.66,
      "heterogeneityAware": 0.62,
      "poolingQuality": 0.65,
      "inclusionStrictness": 0.66,
      "duplicateControl": 0.58,
      "biasAssessment": 0.61,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 58.69,
      "screenCoverage": 61.3,
      "extractionFidelity": 62.22,
      "pooledConfidence": 65.3,
      "heterogeneityScore": 61.32,
      "auditTrail": 55.34,
      "overall": 61.18
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 59,
      "screenCoverage": 13.3,
      "extractionFidelity": 67.71,
      "pooledConfidence": 45.04,
      "heterogeneityScore": 6.34,
      "auditTrail": 27.69,
      "overall": 41.62
    }
  },
  {
    "id": "mss-022",
    "input": {
      "questionClarity": 0.71,
      "searchBreadth": 0.68,
      "screenDiscipline": 0.67,
      "extractionCompleteness": 0.71,
      "studyCount": 26,
      "effectPrecision": 0.69,
      "heterogeneityAware": 0.66,
      "poolingQuality": 0.69,
      "inclusionStrictness": 0.69,
      "duplicateControl": 0.62,
      "biasAssessment": 0.65,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 59.48,
      "screenCoverage": 61.74,
      "extractionFidelity": 62.27,
      "pooledConfidence": 64.57,
      "heterogeneityScore": 61.88,
      "auditTrail": 55.46,
      "overall": 61.38
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 58.6,
      "screenCoverage": 14.7,
      "extractionFidelity": 65.91,
      "pooledConfidence": 45.35,
      "heterogeneityScore": 7.27,
      "auditTrail": 26.65,
      "overall": 41.4
    }
  },
  {
    "id": "mss-023",
    "input": {
      "questionClarity": 0.75,
      "searchBreadth": 0.73,
      "screenDiscipline": 0.72,
      "extractionCompleteness": 0.75,
      "studyCount": 27,
      "effectPrecision": 0.73,
      "heterogeneityAware": 0.71,
      "poolingQuality": 0.74,
      "inclusionStrictness": 0.73,
      "duplicateControl": 0.66,
      "biasAssessment": 0.69,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 63.57,
      "screenCoverage": 65.8,
      "extractionFidelity": 66.2,
      "pooledConfidence": 68.93,
      "heterogeneityScore": 66.24,
      "auditTrail": 58.98,
      "overall": 65.48
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 60.38,
      "screenCoverage": 16.39,
      "extractionFidelity": 67.51,
      "pooledConfidence": 46.84,
      "heterogeneityScore": 8.41,
      "auditTrail": 27.67,
      "overall": 42.89
    }
  },
  {
    "id": "mss-024",
    "input": {
      "questionClarity": 0.79,
      "searchBreadth": 0.69,
      "screenDiscipline": 0.7,
      "extractionCompleteness": 0.7,
      "studyCount": 28,
      "effectPrecision": 0.71,
      "heterogeneityAware": 0.75,
      "poolingQuality": 0.72,
      "inclusionStrictness": 0.71,
      "duplicateControl": 0.7,
      "biasAssessment": 0.73,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 67.66,
      "screenCoverage": 68.5,
      "extractionFidelity": 67.01,
      "pooledConfidence": 72.25,
      "heterogeneityScore": 70.83,
      "auditTrail": 63.78,
      "overall": 68.76
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 62.74,
      "screenCoverage": 16.45,
      "extractionFidelity": 69.1,
      "pooledConfidence": 47.08,
      "heterogeneityScore": 8.58,
      "auditTrail": 30.45,
      "overall": 44.15
    }
  },
  {
    "id": "mss-025",
    "input": {
      "questionClarity": 0.75,
      "searchBreadth": 0.73,
      "screenDiscipline": 0.75,
      "extractionCompleteness": 0.74,
      "studyCount": 29,
      "effectPrecision": 0.75,
      "heterogeneityAware": 0.7,
      "poolingQuality": 0.76,
      "inclusionStrictness": 0.75,
      "duplicateControl": 0.74,
      "biasAssessment": 0.69,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 64.98,
      "screenCoverage": 69.3,
      "extractionFidelity": 66.43,
      "pooledConfidence": 70.49,
      "heterogeneityScore": 66.76,
      "auditTrail": 60.9,
      "overall": 67.05
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 60.42,
      "screenCoverage": 17.6,
      "extractionFidelity": 67.54,
      "pooledConfidence": 47.29,
      "heterogeneityScore": 8.61,
      "auditTrail": 28.37,
      "overall": 43.29
    }
  },
  {
    "id": "mss-026",
    "input": {
      "questionClarity": 0.79,
      "searchBreadth": 0.78,
      "screenDiscipline": 0.79,
      "extractionCompleteness": 0.78,
      "studyCount": 30,
      "effectPrecision": 0.79,
      "heterogeneityAware": 0.75,
      "poolingQuality": 0.81,
      "inclusionStrictness": 0.79,
      "duplicateControl": 0.78,
      "biasAssessment": 0.73,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 69.08,
      "screenCoverage": 72.94,
      "extractionFidelity": 70.36,
      "pooledConfidence": 74.76,
      "heterogeneityScore": 71.12,
      "auditTrail": 64.2,
      "overall": 71.03
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 62.18,
      "screenCoverage": 19.13,
      "extractionFidelity": 69.11,
      "pooledConfidence": 48.73,
      "heterogeneityScore": 9.71,
      "auditTrail": 29.36,
      "overall": 44.74
    }
  },
  {
    "id": "mss-027",
    "input": {
      "questionClarity": 0.83,
      "searchBreadth": 0.82,
      "screenDiscipline": 0.78,
      "extractionCompleteness": 0.82,
      "studyCount": 31,
      "effectPrecision": 0.83,
      "heterogeneityAware": 0.79,
      "poolingQuality": 0.79,
      "inclusionStrictness": 0.83,
      "duplicateControl": 0.81,
      "biasAssessment": 0.77,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 76.43,
      "screenCoverage": 78.02,
      "extractionFidelity": 77.69,
      "pooledConfidence": 81.78,
      "heterogeneityScore": 76.84,
      "auditTrail": 69.08,
      "overall": 77.35
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 65.68,
      "screenCoverage": 19.76,
      "extractionFidelity": 73.6,
      "pooledConfidence": 50.7,
      "heterogeneityScore": 9.93,
      "auditTrail": 32.09,
      "overall": 47.26
    }
  },
  {
    "id": "mss-028",
    "input": {
      "questionClarity": 0.87,
      "searchBreadth": 0.78,
      "screenDiscipline": 0.82,
      "extractionCompleteness": 0.86,
      "studyCount": 4,
      "effectPrecision": 0.81,
      "heterogeneityAware": 0.84,
      "poolingQuality": 0.83,
      "inclusionStrictness": 0.81,
      "duplicateControl": 0.75,
      "biasAssessment": 0.81,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 70.6,
      "screenCoverage": 71.1,
      "extractionFidelity": 76.02,
      "pooledConfidence": 77.14,
      "heterogeneityScore": 73.64,
      "auditTrail": 63.5,
      "overall": 72.65
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 64.18,
      "screenCoverage": 20.01,
      "extractionFidelity": 71.45,
      "pooledConfidence": 50.16,
      "heterogeneityScore": 10.95,
      "auditTrail": 30.28,
      "overall": 46.3
    }
  },
  {
    "id": "mss-029",
    "input": {
      "questionClarity": 0.91,
      "searchBreadth": 0.83,
      "screenDiscipline": 0.87,
      "extractionCompleteness": 0.89,
      "studyCount": 5,
      "effectPrecision": 0.85,
      "heterogeneityAware": 0.88,
      "poolingQuality": 0.88,
      "inclusionStrictness": 0.85,
      "duplicateControl": 0.79,
      "biasAssessment": 0.85,
      "profile": "balanced"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 74.7,
      "screenCoverage": 75.16,
      "extractionFidelity": 79.48,
      "pooledConfidence": 81.25,
      "heterogeneityScore": 77.52,
      "auditTrail": 66.84,
      "overall": 76.53
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 65.94,
      "screenCoverage": 21.65,
      "extractionFidelity": 72.79,
      "pooledConfidence": 51.54,
      "heterogeneityScore": 12,
      "auditTrail": 31.27,
      "overall": 47.69
    }
  },
  {
    "id": "mss-030",
    "input": {
      "questionClarity": 0.87,
      "searchBreadth": 0.87,
      "screenDiscipline": 0.85,
      "extractionCompleteness": 0.84,
      "studyCount": 6,
      "effectPrecision": 0.89,
      "heterogeneityAware": 0.83,
      "poolingQuality": 0.86,
      "inclusionStrictness": 0.89,
      "duplicateControl": 0.83,
      "biasAssessment": 0.81,
      "profile": "rigorous"
    },
    "expectedAgentic": {
      "mode": "agentic",
      "planQuality": 79.14,
      "screenCoverage": 80.09,
      "extractionFidelity": 81.56,
      "pooledConfidence": 85.76,
      "heterogeneityScore": 79.02,
      "auditTrail": 68.42,
      "overall": 79.95
    },
    "expectedAdhoc": {
      "mode": "adhoc",
      "planQuality": 67.48,
      "screenCoverage": 21.7,
      "extractionFidelity": 74.96,
      "pooledConfidence": 52.46,
      "heterogeneityScore": 11.22,
      "auditTrail": 32.98,
      "overall": 48.81
    }
  }
];
