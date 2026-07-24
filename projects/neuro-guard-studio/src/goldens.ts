import type { GuardInput, GuardQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GuardInput;
  expectedNeuroAgentic: GuardQuality;
  expectedReactive: GuardQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ngs-001",
    "input": {
      "sensorCoverage": 0.16,
      "physicsFidelity": 0.14,
      "planHorizon": 0.1,
      "threatSeverity": 0.14,
      "anomalyConfidence": 0.14,
      "latencyBudget": 0.13,
      "actuatorRisk": 0.7,
      "contextFreshness": 0.2,
      "thresholdNoise": 0.74,
      "isolationDepth": 0.21,
      "cascadeRisk": 0.84,
      "sensorCount": 4,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 0,
      "cpiFit": 0,
      "interventionPrecision": 6.96,
      "cascadeAvoided": 40.9,
      "responseLatency": 9.24,
      "confidence": 8.24,
      "overall": 9.38
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 30.18,
      "cpiFit": 0,
      "interventionPrecision": 21.08,
      "cascadeAvoided": 0,
      "responseLatency": 55.4,
      "confidence": 36.16,
      "overall": 23.2
    }
  },
  {
    "id": "ngs-002",
    "input": {
      "sensorCoverage": 0.2,
      "physicsFidelity": 0.18,
      "planHorizon": 0.14,
      "threatSeverity": 0.19,
      "anomalyConfidence": 0.18,
      "latencyBudget": 0.17,
      "actuatorRisk": 0.69,
      "contextFreshness": 0.24,
      "thresholdNoise": 0.74,
      "isolationDepth": 0.24,
      "cascadeRisk": 0.84,
      "sensorCount": 5,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 1.5,
      "cpiFit": 0,
      "interventionPrecision": 10.52,
      "cascadeAvoided": 42.22,
      "responseLatency": 11.72,
      "confidence": 11.22,
      "overall": 11.11
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 30.8,
      "cpiFit": 0.1,
      "interventionPrecision": 21.33,
      "cascadeAvoided": 0,
      "responseLatency": 55.4,
      "confidence": 36.1,
      "overall": 23.41
    }
  },
  {
    "id": "ngs-003",
    "input": {
      "sensorCoverage": 0.25,
      "physicsFidelity": 0.23,
      "planHorizon": 0.18,
      "threatSeverity": 0.16,
      "anomalyConfidence": 0.23,
      "latencyBudget": 0.22,
      "actuatorRisk": 0.69,
      "contextFreshness": 0.22,
      "thresholdNoise": 0.74,
      "isolationDepth": 0.28,
      "cascadeRisk": 0.83,
      "sensorCount": 6,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 6.96,
      "cpiFit": 1.73,
      "interventionPrecision": 15.47,
      "cascadeAvoided": 42.04,
      "responseLatency": 15.16,
      "confidence": 11.82,
      "overall": 14.16
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 32.72,
      "cpiFit": 0.72,
      "interventionPrecision": 21.68,
      "cascadeAvoided": 0,
      "responseLatency": 54.04,
      "confidence": 37.1,
      "overall": 23.99
    }
  },
  {
    "id": "ngs-004",
    "input": {
      "sensorCoverage": 0.29,
      "physicsFidelity": 0.19,
      "planHorizon": 0.22,
      "threatSeverity": 0.21,
      "anomalyConfidence": 0.27,
      "latencyBudget": 0.18,
      "actuatorRisk": 0.68,
      "contextFreshness": 0.27,
      "thresholdNoise": 0.66,
      "isolationDepth": 0.32,
      "cascadeRisk": 0.75,
      "sensorCount": 7,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 9.83,
      "cpiFit": 0.73,
      "interventionPrecision": 19.74,
      "cascadeAvoided": 45.98,
      "responseLatency": 13.66,
      "confidence": 16.84,
      "overall": 16.34
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 32.46,
      "cpiFit": 1.58,
      "interventionPrecision": 21.85,
      "cascadeAvoided": 0.62,
      "responseLatency": 53.88,
      "confidence": 34.56,
      "overall": 23.9
    }
  },
  {
    "id": "ngs-005",
    "input": {
      "sensorCoverage": 0.24,
      "physicsFidelity": 0.24,
      "planHorizon": 0.26,
      "threatSeverity": 0.26,
      "anomalyConfidence": 0.22,
      "latencyBudget": 0.22,
      "actuatorRisk": 0.67,
      "contextFreshness": 0.31,
      "thresholdNoise": 0.66,
      "isolationDepth": 0.28,
      "cascadeRisk": 0.74,
      "sensorCount": 8,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 10.68,
      "cpiFit": 3.06,
      "interventionPrecision": 16.12,
      "cascadeAvoided": 46.78,
      "responseLatency": 16.06,
      "confidence": 16.64,
      "overall": 16.77
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 31.5,
      "cpiFit": 2.14,
      "interventionPrecision": 22.24,
      "cascadeAvoided": 0.74,
      "responseLatency": 53.88,
      "confidence": 35.16,
      "overall": 23.84
    }
  },
  {
    "id": "ngs-006",
    "input": {
      "sensorCoverage": 0.28,
      "physicsFidelity": 0.28,
      "planHorizon": 0.21,
      "threatSeverity": 0.24,
      "anomalyConfidence": 0.26,
      "latencyBudget": 0.27,
      "actuatorRisk": 0.66,
      "contextFreshness": 0.29,
      "thresholdNoise": 0.67,
      "isolationDepth": 0.32,
      "cascadeRisk": 0.74,
      "sensorCount": 9,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 13.26,
      "cpiFit": 7.31,
      "interventionPrecision": 19.53,
      "cascadeAvoided": 46.24,
      "responseLatency": 19.18,
      "confidence": 16.5,
      "overall": 19.21
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 34.27,
      "cpiFit": 2.68,
      "interventionPrecision": 22.53,
      "cascadeAvoided": 2.04,
      "responseLatency": 53.86,
      "confidence": 36.52,
      "overall": 25.12
    }
  },
  {
    "id": "ngs-007",
    "input": {
      "sensorCoverage": 0.33,
      "physicsFidelity": 0.32,
      "planHorizon": 0.25,
      "threatSeverity": 0.28,
      "anomalyConfidence": 0.3,
      "latencyBudget": 0.31,
      "actuatorRisk": 0.55,
      "contextFreshness": 0.33,
      "thresholdNoise": 0.67,
      "isolationDepth": 0.35,
      "cascadeRisk": 0.74,
      "sensorCount": 10,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 16.37,
      "cpiFit": 11.83,
      "interventionPrecision": 22.92,
      "cascadeAvoided": 50.56,
      "responseLatency": 21.3,
      "confidence": 22.7,
      "overall": 23.02
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 32.81,
      "cpiFit": 4.64,
      "interventionPrecision": 22.84,
      "cascadeAvoided": 2.76,
      "responseLatency": 53.7,
      "confidence": 34.28,
      "overall": 24.9
    }
  },
  {
    "id": "ngs-008",
    "input": {
      "sensorCoverage": 0.37,
      "physicsFidelity": 0.29,
      "planHorizon": 0.29,
      "threatSeverity": 0.33,
      "anomalyConfidence": 0.35,
      "latencyBudget": 0.27,
      "actuatorRisk": 0.54,
      "contextFreshness": 0.38,
      "thresholdNoise": 0.59,
      "isolationDepth": 0.39,
      "cascadeRisk": 0.65,
      "sensorCount": 11,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 20.85,
      "cpiFit": 12.5,
      "interventionPrecision": 27.88,
      "cascadeAvoided": 52.96,
      "responseLatency": 20.52,
      "confidence": 25.12,
      "overall": 25.72
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 34.77,
      "cpiFit": 5.7,
      "interventionPrecision": 23.13,
      "cascadeAvoided": 5.76,
      "responseLatency": 53.54,
      "confidence": 33.68,
      "overall": 26.14
    }
  },
  {
    "id": "ngs-009",
    "input": {
      "sensorCoverage": 0.42,
      "physicsFidelity": 0.33,
      "planHorizon": 0.33,
      "threatSeverity": 0.31,
      "anomalyConfidence": 0.39,
      "latencyBudget": 0.32,
      "actuatorRisk": 0.54,
      "contextFreshness": 0.36,
      "thresholdNoise": 0.59,
      "isolationDepth": 0.43,
      "cascadeRisk": 0.65,
      "sensorCount": 12,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 26.45,
      "cpiFit": 17.32,
      "interventionPrecision": 33.02,
      "cascadeAvoided": 52.32,
      "responseLatency": 24.12,
      "confidence": 25.32,
      "overall": 29.44
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 36.59,
      "cpiFit": 6.12,
      "interventionPrecision": 23.36,
      "cascadeAvoided": 7,
      "responseLatency": 52.34,
      "confidence": 34.84,
      "overall": 26.93
    }
  },
  {
    "id": "ngs-010",
    "input": {
      "sensorCoverage": 0.36,
      "physicsFidelity": 0.38,
      "planHorizon": 0.37,
      "threatSeverity": 0.36,
      "anomalyConfidence": 0.34,
      "latencyBudget": 0.36,
      "actuatorRisk": 0.53,
      "contextFreshness": 0.4,
      "thresholdNoise": 0.59,
      "isolationDepth": 0.39,
      "cascadeRisk": 0.64,
      "sensorCount": 13,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 25.33,
      "cpiFit": 17.85,
      "interventionPrecision": 28.1,
      "cascadeAvoided": 55.12,
      "responseLatency": 25.52,
      "confidence": 27.9,
      "overall": 29.17
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 33.58,
      "cpiFit": 6.66,
      "interventionPrecision": 23.69,
      "cascadeAvoided": 6.12,
      "responseLatency": 52.34,
      "confidence": 33.52,
      "overall": 25.9
    }
  },
  {
    "id": "ngs-011",
    "input": {
      "sensorCoverage": 0.41,
      "physicsFidelity": 0.42,
      "planHorizon": 0.41,
      "threatSeverity": 0.41,
      "anomalyConfidence": 0.38,
      "latencyBudget": 0.4,
      "actuatorRisk": 0.52,
      "contextFreshness": 0.44,
      "thresholdNoise": 0.59,
      "isolationDepth": 0.43,
      "cascadeRisk": 0.64,
      "sensorCount": 14,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 29.71,
      "cpiFit": 21.18,
      "interventionPrecision": 32.36,
      "cascadeAvoided": 56.58,
      "responseLatency": 28.35,
      "confidence": 31.1,
      "overall": 32.58
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 34.24,
      "cpiFit": 7.22,
      "interventionPrecision": 23.92,
      "cascadeAvoided": 6.5,
      "responseLatency": 52.34,
      "confidence": 33.38,
      "overall": 26.25
    }
  },
  {
    "id": "ngs-012",
    "input": {
      "sensorCoverage": 0.45,
      "physicsFidelity": 0.39,
      "planHorizon": 0.36,
      "threatSeverity": 0.38,
      "anomalyConfidence": 0.43,
      "latencyBudget": 0.37,
      "actuatorRisk": 0.51,
      "contextFreshness": 0.43,
      "thresholdNoise": 0.51,
      "isolationDepth": 0.47,
      "cascadeRisk": 0.55,
      "sensorCount": 15,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 33.44,
      "cpiFit": 23.52,
      "interventionPrecision": 37.37,
      "cascadeAvoided": 56.98,
      "responseLatency": 28.32,
      "confidence": 30.52,
      "overall": 34.99
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 38.14,
      "cpiFit": 8.28,
      "interventionPrecision": 24.21,
      "cascadeAvoided": 10.5,
      "responseLatency": 51.9,
      "confidence": 33.98,
      "overall": 28.31
    }
  },
  {
    "id": "ngs-013",
    "input": {
      "sensorCoverage": 0.5,
      "physicsFidelity": 0.43,
      "planHorizon": 0.4,
      "threatSeverity": 0.43,
      "anomalyConfidence": 0.47,
      "latencyBudget": 0.41,
      "actuatorRisk": 0.51,
      "contextFreshness": 0.47,
      "thresholdNoise": 0.51,
      "isolationDepth": 0.5,
      "cascadeRisk": 0.55,
      "sensorCount": 16,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 35.84,
      "cpiFit": 24.44,
      "interventionPrecision": 40.4,
      "cascadeAvoided": 60.2,
      "responseLatency": 30.02,
      "confidence": 36.72,
      "overall": 37.54
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 36.8,
      "cpiFit": 8.7,
      "interventionPrecision": 24.52,
      "cascadeAvoided": 9.68,
      "responseLatency": 51.9,
      "confidence": 31.84,
      "overall": 27.66
    }
  },
  {
    "id": "ngs-014",
    "input": {
      "sensorCoverage": 0.54,
      "physicsFidelity": 0.47,
      "planHorizon": 0.44,
      "threatSeverity": 0.48,
      "anomalyConfidence": 0.51,
      "latencyBudget": 0.45,
      "actuatorRisk": 0.39,
      "contextFreshness": 0.51,
      "thresholdNoise": 0.51,
      "isolationDepth": 0.54,
      "cascadeRisk": 0.55,
      "sensorCount": 17,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 40,
      "cpiFit": 30.64,
      "interventionPrecision": 44.24,
      "cascadeAvoided": 62.76,
      "responseLatency": 32.82,
      "confidence": 39.7,
      "overall": 41.6
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 37.42,
      "cpiFit": 10.78,
      "interventionPrecision": 24.69,
      "cascadeAvoided": 11.6,
      "responseLatency": 51.9,
      "confidence": 31.78,
      "overall": 28.49
    }
  },
  {
    "id": "ngs-015",
    "input": {
      "sensorCoverage": 0.49,
      "physicsFidelity": 0.52,
      "planHorizon": 0.48,
      "threatSeverity": 0.45,
      "anomalyConfidence": 0.46,
      "latencyBudget": 0.5,
      "actuatorRisk": 0.39,
      "contextFreshness": 0.49,
      "thresholdNoise": 0.51,
      "isolationDepth": 0.5,
      "cascadeRisk": 0.54,
      "sensorCount": 18,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 42.72,
      "cpiFit": 35.26,
      "interventionPrecision": 41.65,
      "cascadeAvoided": 61.46,
      "responseLatency": 36.61,
      "confidence": 36.5,
      "overall": 42.78
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 37.5,
      "cpiFit": 11.2,
      "interventionPrecision": 25.08,
      "cascadeAvoided": 12.58,
      "responseLatency": 50.54,
      "confidence": 33.58,
      "overall": 28.81
    }
  },
  {
    "id": "ngs-016",
    "input": {
      "sensorCoverage": 0.53,
      "physicsFidelity": 0.48,
      "planHorizon": 0.51,
      "threatSeverity": 0.5,
      "anomalyConfidence": 0.5,
      "latencyBudget": 0.46,
      "actuatorRisk": 0.38,
      "contextFreshness": 0.54,
      "thresholdNoise": 0.44,
      "isolationDepth": 0.54,
      "cascadeRisk": 0.46,
      "sensorCount": 19,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 43.88,
      "cpiFit": 32.73,
      "interventionPrecision": 45.2,
      "cascadeAvoided": 65.4,
      "responseLatency": 34.23,
      "confidence": 41.4,
      "overall": 43.94
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 37.43,
      "cpiFit": 12.06,
      "interventionPrecision": 25.37,
      "cascadeAvoided": 14.28,
      "responseLatency": 50.6,
      "confidence": 31.16,
      "overall": 29.04
    }
  },
  {
    "id": "ngs-017",
    "input": {
      "sensorCoverage": 0.58,
      "physicsFidelity": 0.53,
      "planHorizon": 0.55,
      "threatSeverity": 0.55,
      "anomalyConfidence": 0.55,
      "latencyBudget": 0.51,
      "actuatorRisk": 0.37,
      "contextFreshness": 0.58,
      "thresholdNoise": 0.44,
      "isolationDepth": 0.58,
      "cascadeRisk": 0.45,
      "sensorCount": 20,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 48.81,
      "cpiFit": 36.7,
      "interventionPrecision": 49.62,
      "cascadeAvoided": 67.32,
      "responseLatency": 37.6,
      "confidence": 45,
      "overall": 47.83
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 38.31,
      "cpiFit": 12.82,
      "interventionPrecision": 25.72,
      "cascadeAvoided": 14.88,
      "responseLatency": 50.52,
      "confidence": 30.96,
      "overall": 29.53
    }
  },
  {
    "id": "ngs-018",
    "input": {
      "sensorCoverage": 0.62,
      "physicsFidelity": 0.57,
      "planHorizon": 0.5,
      "threatSeverity": 0.53,
      "anomalyConfidence": 0.59,
      "latencyBudget": 0.55,
      "actuatorRisk": 0.36,
      "contextFreshness": 0.56,
      "thresholdNoise": 0.44,
      "isolationDepth": 0.62,
      "cascadeRisk": 0.45,
      "sensorCount": 21,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 53,
      "cpiFit": 42.48,
      "interventionPrecision": 53.86,
      "cascadeAvoided": 66.78,
      "responseLatency": 41.1,
      "confidence": 44.98,
      "overall": 51.21
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 40.99,
      "cpiFit": 13.36,
      "interventionPrecision": 25.89,
      "cascadeAvoided": 16.26,
      "responseLatency": 50.48,
      "confidence": 32.2,
      "overall": 30.76
    }
  },
  {
    "id": "ngs-019",
    "input": {
      "sensorCoverage": 0.67,
      "physicsFidelity": 0.61,
      "planHorizon": 0.54,
      "threatSeverity": 0.57,
      "anomalyConfidence": 0.63,
      "latencyBudget": 0.59,
      "actuatorRisk": 0.36,
      "contextFreshness": 0.6,
      "thresholdNoise": 0.44,
      "isolationDepth": 0.65,
      "cascadeRisk": 0.45,
      "sensorCount": 22,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 54.62,
      "cpiFit": 42.52,
      "interventionPrecision": 56.54,
      "cascadeAvoided": 70,
      "responseLatency": 42.37,
      "confidence": 51.18,
      "overall": 53.26
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 39.53,
      "cpiFit": 13.78,
      "interventionPrecision": 26.2,
      "cascadeAvoided": 15.44,
      "responseLatency": 50.32,
      "confidence": 29.96,
      "overall": 30.04
    }
  },
  {
    "id": "ngs-020",
    "input": {
      "sensorCoverage": 0.61,
      "physicsFidelity": 0.58,
      "planHorizon": 0.58,
      "threatSeverity": 0.62,
      "anomalyConfidence": 0.58,
      "latencyBudget": 0.56,
      "actuatorRisk": 0.35,
      "contextFreshness": 0.65,
      "thresholdNoise": 0.36,
      "isolationDepth": 0.62,
      "cascadeRisk": 0.36,
      "sensorCount": 3,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 51.82,
      "cpiFit": 41.28,
      "interventionPrecision": 53.74,
      "cascadeAvoided": 71.42,
      "responseLatency": 41.2,
      "confidence": 39.8,
      "overall": 50.96
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 39.64,
      "cpiFit": 14.64,
      "interventionPrecision": 21.45,
      "cascadeAvoided": 18.02,
      "responseLatency": 50.08,
      "confidence": 30.16,
      "overall": 29.92
    }
  },
  {
    "id": "ngs-021",
    "input": {
      "sensorCoverage": 0.66,
      "physicsFidelity": 0.62,
      "planHorizon": 0.62,
      "threatSeverity": 0.6,
      "anomalyConfidence": 0.62,
      "latencyBudget": 0.6,
      "actuatorRisk": 0.24,
      "contextFreshness": 0.63,
      "thresholdNoise": 0.36,
      "isolationDepth": 0.65,
      "cascadeRisk": 0.36,
      "sensorCount": 4,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 58.59,
      "cpiFit": 50.24,
      "interventionPrecision": 59.11,
      "cascadeAvoided": 71.74,
      "responseLatency": 45.13,
      "confidence": 40,
      "overall": 56.12
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 41.46,
      "cpiFit": 16.6,
      "interventionPrecision": 21.76,
      "cascadeAvoided": 20.74,
      "responseLatency": 48.96,
      "confidence": 31.32,
      "overall": 31.22
    }
  },
  {
    "id": "ngs-022",
    "input": {
      "sensorCoverage": 0.7,
      "physicsFidelity": 0.67,
      "planHorizon": 0.66,
      "threatSeverity": 0.65,
      "anomalyConfidence": 0.67,
      "latencyBudget": 0.64,
      "actuatorRisk": 0.23,
      "contextFreshness": 0.67,
      "thresholdNoise": 0.36,
      "isolationDepth": 0.69,
      "cascadeRisk": 0.35,
      "sensorCount": 5,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 60.38,
      "cpiFit": 50.93,
      "interventionPrecision": 61.72,
      "cascadeAvoided": 75.66,
      "responseLatency": 46.21,
      "confidence": 46.38,
      "overall": 58.45
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 40.3,
      "cpiFit": 17.34,
      "interventionPrecision": 22.05,
      "cascadeAvoided": 20.34,
      "responseLatency": 48.96,
      "confidence": 29.2,
      "overall": 30.74
    }
  },
  {
    "id": "ngs-023",
    "input": {
      "sensorCoverage": 0.75,
      "physicsFidelity": 0.71,
      "planHorizon": 0.7,
      "threatSeverity": 0.7,
      "anomalyConfidence": 0.71,
      "latencyBudget": 0.69,
      "actuatorRisk": 0.22,
      "contextFreshness": 0.71,
      "thresholdNoise": 0.36,
      "isolationDepth": 0.73,
      "cascadeRisk": 0.35,
      "sensorCount": 6,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 64.76,
      "cpiFit": 54.34,
      "interventionPrecision": 65.98,
      "cascadeAvoided": 77.12,
      "responseLatency": 49.51,
      "confidence": 49.58,
      "overall": 61.93
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 40.96,
      "cpiFit": 17.9,
      "interventionPrecision": 22.28,
      "cascadeAvoided": 20.72,
      "responseLatency": 48.88,
      "confidence": 29.06,
      "overall": 31.07
    }
  },
  {
    "id": "ngs-024",
    "input": {
      "sensorCoverage": 0.79,
      "physicsFidelity": 0.68,
      "planHorizon": 0.65,
      "threatSeverity": 0.67,
      "anomalyConfidence": 0.76,
      "latencyBudget": 0.65,
      "actuatorRisk": 0.21,
      "contextFreshness": 0.7,
      "thresholdNoise": 0.28,
      "isolationDepth": 0.77,
      "cascadeRisk": 0.26,
      "sensorCount": 7,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 69.82,
      "cpiFit": 58.12,
      "interventionPrecision": 71.7,
      "cascadeAvoided": 77.52,
      "responseLatency": 49.84,
      "confidence": 49,
      "overall": 65.15
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 44.86,
      "cpiFit": 18.96,
      "interventionPrecision": 22.57,
      "cascadeAvoided": 24.72,
      "responseLatency": 48.52,
      "confidence": 29.66,
      "overall": 33.15
    }
  },
  {
    "id": "ngs-025",
    "input": {
      "sensorCoverage": 0.74,
      "physicsFidelity": 0.72,
      "planHorizon": 0.69,
      "threatSeverity": 0.72,
      "anomalyConfidence": 0.7,
      "latencyBudget": 0.69,
      "actuatorRisk": 0.21,
      "contextFreshness": 0.74,
      "thresholdNoise": 0.28,
      "isolationDepth": 0.73,
      "cascadeRisk": 0.26,
      "sensorCount": 8,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 66.81,
      "cpiFit": 56.06,
      "interventionPrecision": 66.26,
      "cascadeAvoided": 79.76,
      "responseLatency": 50.22,
      "confidence": 51.4,
      "overall": 63.53
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 41.68,
      "cpiFit": 19.18,
      "interventionPrecision": 22.84,
      "cascadeAvoided": 23.48,
      "responseLatency": 48.52,
      "confidence": 28.32,
      "overall": 31.95
    }
  },
  {
    "id": "ngs-026",
    "input": {
      "sensorCoverage": 0.78,
      "physicsFidelity": 0.76,
      "planHorizon": 0.73,
      "threatSeverity": 0.77,
      "anomalyConfidence": 0.74,
      "latencyBudget": 0.74,
      "actuatorRisk": 0.2,
      "contextFreshness": 0.78,
      "thresholdNoise": 0.29,
      "isolationDepth": 0.77,
      "cascadeRisk": 0.26,
      "sensorCount": 9,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 70.85,
      "cpiFit": 59.41,
      "interventionPrecision": 69.98,
      "cascadeAvoided": 81.22,
      "responseLatency": 53.48,
      "confidence": 54.26,
      "overall": 66.77
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 42.39,
      "cpiFit": 19.72,
      "interventionPrecision": 23.13,
      "cascadeAvoided": 23.78,
      "responseLatency": 48.54,
      "confidence": 28.38,
      "overall": 32.33
    }
  },
  {
    "id": "ngs-027",
    "input": {
      "sensorCoverage": 0.83,
      "physicsFidelity": 0.81,
      "planHorizon": 0.77,
      "threatSeverity": 0.74,
      "anomalyConfidence": 0.79,
      "latencyBudget": 0.78,
      "actuatorRisk": 0.19,
      "contextFreshness": 0.76,
      "thresholdNoise": 0.29,
      "isolationDepth": 0.8,
      "cascadeRisk": 0.25,
      "sensorCount": 10,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 78.98,
      "cpiFit": 67.15,
      "interventionPrecision": 75.86,
      "cascadeAvoided": 81,
      "responseLatency": 58.11,
      "confidence": 54.86,
      "overall": 72.12
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 44.31,
      "cpiFit": 20.48,
      "interventionPrecision": 23.56,
      "cascadeAvoided": 25.32,
      "responseLatency": 47.26,
      "confidence": 29.38,
      "overall": 33.25
    }
  },
  {
    "id": "ngs-028",
    "input": {
      "sensorCoverage": 0.87,
      "physicsFidelity": 0.77,
      "planHorizon": 0.81,
      "threatSeverity": 0.79,
      "anomalyConfidence": 0.83,
      "latencyBudget": 0.74,
      "actuatorRisk": 0.08,
      "contextFreshness": 0.81,
      "thresholdNoise": 0.21,
      "isolationDepth": 0.84,
      "cascadeRisk": 0.17,
      "sensorCount": 11,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 79.18,
      "cpiFit": 65.85,
      "interventionPrecision": 78.92,
      "cascadeAvoided": 85.94,
      "responseLatency": 54.94,
      "confidence": 59.88,
      "overall": 73.31
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 44.05,
      "cpiFit": 22.74,
      "interventionPrecision": 23.73,
      "cascadeAvoided": 28.5,
      "responseLatency": 47.1,
      "confidence": 26.84,
      "overall": 33.84
    }
  },
  {
    "id": "ngs-029",
    "input": {
      "sensorCoverage": 0.92,
      "physicsFidelity": 0.82,
      "planHorizon": 0.85,
      "threatSeverity": 0.84,
      "anomalyConfidence": 0.88,
      "latencyBudget": 0.79,
      "actuatorRisk": 0.07,
      "contextFreshness": 0.85,
      "thresholdNoise": 0.21,
      "isolationDepth": 0.88,
      "cascadeRisk": 0.16,
      "sensorCount": 12,
      "profile": "balanced"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 84.11,
      "cpiFit": 69.83,
      "interventionPrecision": 83.34,
      "cascadeAvoided": 87.86,
      "responseLatency": 58.31,
      "confidence": 63.48,
      "overall": 77.2
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 44.93,
      "cpiFit": 23.5,
      "interventionPrecision": 24.08,
      "cascadeAvoided": 29.1,
      "responseLatency": 47.02,
      "confidence": 26.64,
      "overall": 34.32
    }
  },
  {
    "id": "ngs-030",
    "input": {
      "sensorCoverage": 0.86,
      "physicsFidelity": 0.86,
      "planHorizon": 0.8,
      "threatSeverity": 0.82,
      "anomalyConfidence": 0.82,
      "latencyBudget": 0.83,
      "actuatorRisk": 0.07,
      "contextFreshness": 0.83,
      "thresholdNoise": 0.21,
      "isolationDepth": 0.84,
      "cascadeRisk": 0.16,
      "sensorCount": 13,
      "profile": "aggressive"
    },
    "expectedNeuroAgentic": {
      "mode": "neuro-agentic",
      "planSafety": 85.4,
      "cpiFit": 75.17,
      "interventionPrecision": 80.05,
      "cascadeAvoided": 86.1,
      "responseLatency": 62.14,
      "confidence": 59.66,
      "overall": 77.91
    },
    "expectedReactive": {
      "mode": "reactive",
      "planSafety": 45.76,
      "cpiFit": 23.7,
      "interventionPrecision": 24.29,
      "cascadeAvoided": 29.86,
      "responseLatency": 46.98,
      "confidence": 28.68,
      "overall": 34.96
    }
  }
];
