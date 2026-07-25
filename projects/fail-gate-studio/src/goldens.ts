import type { FailGateInput, FailGateQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FailGateInput;
  expectedFailGate: FailGateQuality;
  expectedCorrectnessOnly: FailGateQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "fgs-001",
    "input": {
      "severityFit": 0.29,
      "gateTypeFit": 0.25,
      "boundaryCoherence": 0.28,
      "evidenceStrength": 0.34,
      "taxonomyCoverage": 0.3,
      "answerMatch": 0.39,
      "fluencyScore": 0.45,
      "harmProximity": 0.59,
      "scopeDrift": 0.5,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 25.68,
      "gateTypeDiagnosis": 30.5,
      "boundaryReasonScore": 25.53,
      "taxonomyIntegrity": 35.4,
      "correctnessScore": 16.4,
      "confidence": 22.85,
      "failGateContribution": 28.93,
      "correctnessContribution": 16.6,
      "overall": 30.71
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 5.76,
      "gateTypeDiagnosis": 17.82,
      "boundaryReasonScore": 14.1,
      "taxonomyIntegrity": 32.29,
      "correctnessScore": 40.93,
      "confidence": 17.1,
      "failGateContribution": 22.18,
      "correctnessContribution": 39.03,
      "overall": 27.6
    }
  },
  {
    "id": "fgs-002",
    "input": {
      "severityFit": 0.33,
      "gateTypeFit": 0.29,
      "boundaryCoherence": 0.32,
      "evidenceStrength": 0.38,
      "taxonomyCoverage": 0.34,
      "answerMatch": 0.43,
      "fluencyScore": 0.46,
      "harmProximity": 0.6,
      "scopeDrift": 0.51,
      "gateBias": "boundary_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 24.75,
      "gateTypeDiagnosis": 34.15,
      "boundaryReasonScore": 36.42,
      "taxonomyIntegrity": 30.67,
      "correctnessScore": 18.89,
      "confidence": 26.5,
      "failGateContribution": 31.58,
      "correctnessContribution": 19.24,
      "overall": 33.36
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 2.43,
      "gateTypeDiagnosis": 18.92,
      "boundaryReasonScore": 15.1,
      "taxonomyIntegrity": 33.98,
      "correctnessScore": 31.53,
      "confidence": 18.65,
      "failGateContribution": 20.39,
      "correctnessContribution": 34.95,
      "overall": 23.89
    }
  },
  {
    "id": "fgs-003",
    "input": {
      "severityFit": 0.37,
      "gateTypeFit": 0.27,
      "boundaryCoherence": 0.36,
      "evidenceStrength": 0.42,
      "taxonomyCoverage": 0.32,
      "answerMatch": 0.46,
      "fluencyScore": 0.42,
      "harmProximity": 0.6,
      "scopeDrift": 0.46,
      "gateBias": "accuracy_first",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 16.07,
      "gateTypeDiagnosis": 22.46,
      "boundaryReasonScore": 22.95,
      "taxonomyIntegrity": 16.16,
      "correctnessScore": 19.94,
      "confidence": 29.1,
      "failGateContribution": 19.55,
      "correctnessContribution": 20.29,
      "overall": 20.68
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 12.17,
      "gateTypeDiagnosis": 18.25,
      "boundaryReasonScore": 14.03,
      "taxonomyIntegrity": 34.43,
      "correctnessScore": 54.34,
      "confidence": 18.4,
      "failGateContribution": 26.64,
      "correctnessContribution": 46.97,
      "overall": 34.94
    }
  },
  {
    "id": "fgs-004",
    "input": {
      "severityFit": 0.33,
      "gateTypeFit": 0.32,
      "boundaryCoherence": 0.39,
      "evidenceStrength": 0.38,
      "taxonomyCoverage": 0.36,
      "answerMatch": 0.42,
      "fluencyScore": 0.43,
      "harmProximity": 0.53,
      "scopeDrift": 0.46,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 30.28,
      "gateTypeDiagnosis": 36.78,
      "boundaryReasonScore": 35.03,
      "taxonomyIntegrity": 41.11,
      "correctnessScore": 18.93,
      "confidence": 29.3,
      "failGateContribution": 35.55,
      "correctnessContribution": 19.6,
      "overall": 36.68
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 8.7,
      "gateTypeDiagnosis": 18.26,
      "boundaryReasonScore": 14.58,
      "taxonomyIntegrity": 32.49,
      "correctnessScore": 42.77,
      "confidence": 18.85,
      "failGateContribution": 23.36,
      "correctnessContribution": 40.59,
      "overall": 29.8
    }
  },
  {
    "id": "fgs-005",
    "input": {
      "severityFit": 0.37,
      "gateTypeFit": 0.36,
      "boundaryCoherence": 0.35,
      "evidenceStrength": 0.42,
      "taxonomyCoverage": 0.4,
      "answerMatch": 0.46,
      "fluencyScore": 0.45,
      "harmProximity": 0.53,
      "scopeDrift": 0.47,
      "gateBias": "taxonomy_strict",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 28.64,
      "gateTypeDiagnosis": 40.39,
      "boundaryReasonScore": 23.32,
      "taxonomyIntegrity": 52.79,
      "correctnessScore": 21.8,
      "confidence": 30.8,
      "failGateContribution": 35.28,
      "correctnessContribution": 22.71,
      "overall": 37.02
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 0,
      "gateTypeDiagnosis": 19.93,
      "boundaryReasonScore": 16.55,
      "taxonomyIntegrity": 34.47,
      "correctnessScore": 32.95,
      "confidence": 21.05,
      "failGateContribution": 20.78,
      "correctnessContribution": 36.66,
      "overall": 26.11
    }
  },
  {
    "id": "fgs-006",
    "input": {
      "severityFit": 0.41,
      "gateTypeFit": 0.34,
      "boundaryCoherence": 0.39,
      "evidenceStrength": 0.45,
      "taxonomyCoverage": 0.38,
      "answerMatch": 0.5,
      "fluencyScore": 0.4,
      "harmProximity": 0.54,
      "scopeDrift": 0.42,
      "gateBias": "balanced",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 37.47,
      "gateTypeDiagnosis": 38.75,
      "boundaryReasonScore": 37.45,
      "taxonomyIntegrity": 43.93,
      "correctnessScore": 23.08,
      "confidence": 33.15,
      "failGateContribution": 39.19,
      "correctnessContribution": 23.87,
      "overall": 40.43
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 11.98,
      "gateTypeDiagnosis": 18.88,
      "boundaryReasonScore": 15.04,
      "taxonomyIntegrity": 35.08,
      "correctnessScore": 46.72,
      "confidence": 20.5,
      "failGateContribution": 25.54,
      "correctnessContribution": 43.51,
      "overall": 32.72
    }
  },
  {
    "id": "fgs-007",
    "input": {
      "severityFit": 0.45,
      "gateTypeFit": 0.38,
      "boundaryCoherence": 0.42,
      "evidenceStrength": 0.49,
      "taxonomyCoverage": 0.42,
      "answerMatch": 0.53,
      "fluencyScore": 0.42,
      "harmProximity": 0.55,
      "scopeDrift": 0.43,
      "gateBias": "boundary_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 34.46,
      "gateTypeDiagnosis": 42.36,
      "boundaryReasonScore": 49.96,
      "taxonomyIntegrity": 37.19,
      "correctnessScore": 25.15,
      "confidence": 36.4,
      "failGateContribution": 41.3,
      "correctnessContribution": 26.11,
      "overall": 42.57
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 8.27,
      "gateTypeDiagnosis": 20.16,
      "boundaryReasonScore": 16.29,
      "taxonomyIntegrity": 36.6,
      "correctnessScore": 34.2,
      "confidence": 22.15,
      "failGateContribution": 23.1,
      "correctnessContribution": 37.81,
      "overall": 27.59
    }
  },
  {
    "id": "fgs-008",
    "input": {
      "severityFit": 0.41,
      "gateTypeFit": 0.43,
      "boundaryCoherence": 0.46,
      "evidenceStrength": 0.45,
      "taxonomyCoverage": 0.46,
      "answerMatch": 0.49,
      "fluencyScore": 0.43,
      "harmProximity": 0.47,
      "scopeDrift": 0.44,
      "gateBias": "accuracy_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 20.11,
      "gateTypeDiagnosis": 36.68,
      "boundaryReasonScore": 29.16,
      "taxonomyIntegrity": 25.07,
      "correctnessScore": 24.32,
      "confidence": 36.85,
      "failGateContribution": 27.71,
      "correctnessContribution": 25.65,
      "overall": 28.34
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 16.4,
      "gateTypeDiagnosis": 20.31,
      "boundaryReasonScore": 16.94,
      "taxonomyIntegrity": 34.67,
      "correctnessScore": 58.5,
      "confidence": 22.7,
      "failGateContribution": 29.36,
      "correctnessContribution": 51.23,
      "overall": 40.02
    }
  },
  {
    "id": "fgs-009",
    "input": {
      "severityFit": 0.46,
      "gateTypeFit": 0.41,
      "boundaryCoherence": 0.5,
      "evidenceStrength": 0.49,
      "taxonomyCoverage": 0.45,
      "answerMatch": 0.53,
      "fluencyScore": 0.39,
      "harmProximity": 0.48,
      "scopeDrift": 0.38,
      "gateBias": "balanced",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 42.65,
      "gateTypeDiagnosis": 45.24,
      "boundaryReasonScore": 46.9,
      "taxonomyIntegrity": 50.35,
      "correctnessScore": 25.81,
      "confidence": 39.75,
      "failGateContribution": 46.16,
      "correctnessContribution": 27.07,
      "overall": 46.72
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 14.91,
      "gateTypeDiagnosis": 19.63,
      "boundaryReasonScore": 15.86,
      "taxonomyIntegrity": 35.46,
      "correctnessScore": 48.88,
      "confidence": 22.7,
      "failGateContribution": 26.95,
      "correctnessContribution": 45.52,
      "overall": 35.31
    }
  },
  {
    "id": "fgs-010",
    "input": {
      "severityFit": 0.5,
      "gateTypeFit": 0.45,
      "boundaryCoherence": 0.46,
      "evidenceStrength": 0.53,
      "taxonomyCoverage": 0.49,
      "answerMatch": 0.57,
      "fluencyScore": 0.4,
      "harmProximity": 0.49,
      "scopeDrift": 0.39,
      "gateBias": "taxonomy_strict",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 38.73,
      "gateTypeDiagnosis": 48.89,
      "boundaryReasonScore": 31.86,
      "taxonomyIntegrity": 63.79,
      "correctnessScore": 28.29,
      "confidence": 41.4,
      "failGateContribution": 44.76,
      "correctnessContribution": 29.69,
      "overall": 46.05
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 3.59,
      "gateTypeDiagnosis": 20.72,
      "boundaryReasonScore": 17.24,
      "taxonomyIntegrity": 37.16,
      "correctnessScore": 35.54,
      "confidence": 24.25,
      "failGateContribution": 22.85,
      "correctnessContribution": 39.27,
      "overall": 29.4
    }
  },
  {
    "id": "fgs-011",
    "input": {
      "severityFit": 0.54,
      "gateTypeFit": 0.49,
      "boundaryCoherence": 0.49,
      "evidenceStrength": 0.57,
      "taxonomyCoverage": 0.53,
      "answerMatch": 0.6,
      "fluencyScore": 0.42,
      "harmProximity": 0.49,
      "scopeDrift": 0.4,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 49.76,
      "gateTypeDiagnosis": 52.5,
      "boundaryReasonScore": 48.37,
      "taxonomyIntegrity": 58.03,
      "correctnessScore": 30.54,
      "confidence": 44.65,
      "failGateContribution": 51.85,
      "correctnessContribution": 32.16,
      "overall": 52.31
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 17.1,
      "gateTypeDiagnosis": 22.13,
      "boundaryReasonScore": 18.65,
      "taxonomyIntegrity": 38.68,
      "correctnessScore": 54.12,
      "confidence": 26.1,
      "failGateContribution": 30.14,
      "correctnessContribution": 50.75,
      "overall": 39.9
    }
  },
  {
    "id": "fgs-012",
    "input": {
      "severityFit": 0.5,
      "gateTypeFit": 0.48,
      "boundaryCoherence": 0.53,
      "evidenceStrength": 0.53,
      "taxonomyCoverage": 0.51,
      "answerMatch": 0.56,
      "fluencyScore": 0.37,
      "harmProximity": 0.42,
      "scopeDrift": 0.35,
      "gateBias": "boundary_first",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 39.57,
      "gateTypeDiagnosis": 51.53,
      "boundaryReasonScore": 63.09,
      "taxonomyIntegrity": 43.21,
      "correctnessScore": 28.34,
      "confidence": 44.2,
      "failGateContribution": 49.83,
      "correctnessContribution": 30.01,
      "overall": 50.26
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 13.23,
      "gateTypeDiagnosis": 19.99,
      "boundaryReasonScore": 16.64,
      "taxonomyIntegrity": 35.66,
      "correctnessScore": 34.93,
      "confidence": 24.35,
      "failGateContribution": 24.09,
      "correctnessContribution": 38.36,
      "overall": 29.76
    }
  },
  {
    "id": "fgs-013",
    "input": {
      "severityFit": 0.54,
      "gateTypeFit": 0.52,
      "boundaryCoherence": 0.56,
      "evidenceStrength": 0.57,
      "taxonomyCoverage": 0.55,
      "answerMatch": 0.6,
      "fluencyScore": 0.39,
      "harmProximity": 0.42,
      "scopeDrift": 0.36,
      "gateBias": "accuracy_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 30.5,
      "gateTypeDiagnosis": 45.13,
      "boundaryReasonScore": 37.72,
      "taxonomyIntegrity": 32.04,
      "correctnessScore": 31.2,
      "confidence": 47.45,
      "failGateContribution": 36.37,
      "correctnessContribution": 33.09,
      "overall": 36.78
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 22.62,
      "gateTypeDiagnosis": 21.64,
      "boundaryReasonScore": 18.24,
      "taxonomyIntegrity": 37.64,
      "correctnessScore": 67.02,
      "confidence": 26.55,
      "failGateContribution": 33.43,
      "correctnessContribution": 57.46,
      "overall": 46.65
    }
  },
  {
    "id": "fgs-014",
    "input": {
      "severityFit": 0.58,
      "gateTypeFit": 0.56,
      "boundaryCoherence": 0.6,
      "evidenceStrength": 0.61,
      "taxonomyCoverage": 0.59,
      "answerMatch": 0.63,
      "fluencyScore": 0.4,
      "harmProximity": 0.43,
      "scopeDrift": 0.36,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 54.28,
      "gateTypeDiagnosis": 58.78,
      "boundaryReasonScore": 57.78,
      "taxonomyIntegrity": 63.74,
      "correctnessScore": 33.07,
      "confidence": 51.1,
      "failGateContribution": 58.42,
      "correctnessContribution": 35.07,
      "overall": 58.22
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 20.03,
      "gateTypeDiagnosis": 22.47,
      "boundaryReasonScore": 19,
      "taxonomyIntegrity": 38.88,
      "correctnessScore": 55.96,
      "confidence": 27.85,
      "failGateContribution": 31.27,
      "correctnessContribution": 52.26,
      "overall": 42.04
    }
  },
  {
    "id": "fgs-015",
    "input": {
      "severityFit": 0.62,
      "gateTypeFit": 0.54,
      "boundaryCoherence": 0.56,
      "evidenceStrength": 0.65,
      "taxonomyCoverage": 0.57,
      "answerMatch": 0.67,
      "fluencyScore": 0.36,
      "harmProximity": 0.44,
      "scopeDrift": 0.31,
      "gateBias": "taxonomy_strict",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 48.61,
      "gateTypeDiagnosis": 57.1,
      "boundaryReasonScore": 40.41,
      "taxonomyIntegrity": 73.89,
      "correctnessScore": 34.55,
      "confidence": 51.7,
      "failGateContribution": 53.91,
      "correctnessContribution": 36.49,
      "overall": 54.77
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 9.43,
      "gateTypeDiagnosis": 21.87,
      "boundaryReasonScore": 18.33,
      "taxonomyIntegrity": 39.77,
      "correctnessScore": 38.2,
      "confidence": 27.75,
      "failGateContribution": 25.52,
      "correctnessContribution": 42.08,
      "overall": 33.06
    }
  },
  {
    "id": "fgs-016",
    "input": {
      "severityFit": 0.58,
      "gateTypeFit": 0.59,
      "boundaryCoherence": 0.6,
      "evidenceStrength": 0.6,
      "taxonomyCoverage": 0.61,
      "answerMatch": 0.63,
      "fluencyScore": 0.37,
      "harmProximity": 0.36,
      "scopeDrift": 0.32,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 54.94,
      "gateTypeDiagnosis": 61.42,
      "boundaryReasonScore": 58.64,
      "taxonomyIntegrity": 65.61,
      "correctnessScore": 33.73,
      "confidence": 51.75,
      "failGateContribution": 59.88,
      "correctnessContribution": 35.98,
      "overall": 59.58
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 22.05,
      "gateTypeDiagnosis": 21.94,
      "boundaryReasonScore": 18.89,
      "taxonomyIntegrity": 37.84,
      "correctnessScore": 55.7,
      "confidence": 28.3,
      "failGateContribution": 31.28,
      "correctnessContribution": 51.71,
      "overall": 42.42
    }
  },
  {
    "id": "fgs-017",
    "input": {
      "severityFit": 0.62,
      "gateTypeFit": 0.63,
      "boundaryCoherence": 0.63,
      "evidenceStrength": 0.64,
      "taxonomyCoverage": 0.65,
      "answerMatch": 0.67,
      "fluencyScore": 0.39,
      "harmProximity": 0.37,
      "scopeDrift": 0.33,
      "gateBias": "boundary_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 48.82,
      "gateTypeDiagnosis": 65.03,
      "boundaryReasonScore": 75.9,
      "taxonomyIntegrity": 53.07,
      "correctnessScore": 36.41,
      "confidence": 55,
      "failGateContribution": 61.23,
      "correctnessContribution": 38.82,
      "overall": 61.2
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 18.73,
      "gateTypeDiagnosis": 23.44,
      "boundaryReasonScore": 20.3,
      "taxonomyIntegrity": 39.81,
      "correctnessScore": 39.86,
      "confidence": 30.3,
      "failGateContribution": 28.43,
      "correctnessContribution": 44.38,
      "overall": 35.93
    }
  },
  {
    "id": "fgs-018",
    "input": {
      "severityFit": 0.66,
      "gateTypeFit": 0.61,
      "boundaryCoherence": 0.67,
      "evidenceStrength": 0.68,
      "taxonomyCoverage": 0.63,
      "answerMatch": 0.7,
      "fluencyScore": 0.34,
      "harmProximity": 0.38,
      "scopeDrift": 0.27,
      "gateBias": "accuracy_first",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 40.08,
      "gateTypeDiagnosis": 53.38,
      "boundaryReasonScore": 46.27,
      "taxonomyIntegrity": 38.55,
      "correctnessScore": 37.08,
      "confidence": 57.75,
      "failGateContribution": 44.67,
      "correctnessContribution": 39.35,
      "overall": 44.71
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 28.36,
      "gateTypeDiagnosis": 22.14,
      "boundaryReasonScore": 18.6,
      "taxonomyIntegrity": 39.97,
      "correctnessScore": 74.27,
      "confidence": 29.5,
      "failGateContribution": 36.67,
      "correctnessContribution": 62.38,
      "overall": 52.06
    }
  },
  {
    "id": "fgs-019",
    "input": {
      "severityFit": 0.7,
      "gateTypeFit": 0.65,
      "boundaryCoherence": 0.7,
      "evidenceStrength": 0.72,
      "taxonomyCoverage": 0.67,
      "answerMatch": 0.74,
      "fluencyScore": 0.36,
      "harmProximity": 0.38,
      "scopeDrift": 0.28,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 65.93,
      "gateTypeDiagnosis": 66.99,
      "boundaryReasonScore": 68.9,
      "taxonomyIntegrity": 72.27,
      "correctnessScore": 39.94,
      "confidence": 61,
      "failGateContribution": 68.41,
      "correctnessContribution": 42.43,
      "overall": 67.73
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 26.25,
      "gateTypeDiagnosis": 23.78,
      "boundaryReasonScore": 20.18,
      "taxonomyIntegrity": 41.95,
      "correctnessScore": 62.07,
      "confidence": 31.7,
      "failGateContribution": 34.85,
      "correctnessContribution": 57.12,
      "overall": 47.5
    }
  },
  {
    "id": "fgs-020",
    "input": {
      "severityFit": 0.66,
      "gateTypeFit": 0.7,
      "boundaryCoherence": 0.66,
      "evidenceStrength": 0.68,
      "taxonomyCoverage": 0.71,
      "answerMatch": 0.7,
      "fluencyScore": 0.37,
      "harmProximity": 0.31,
      "scopeDrift": 0.29,
      "gateBias": "taxonomy_strict",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 52.52,
      "gateTypeDiagnosis": 71.31,
      "boundaryReasonScore": 46.45,
      "taxonomyIntegrity": 89.08,
      "correctnessScore": 38.94,
      "confidence": 59.45,
      "failGateContribution": 63.37,
      "correctnessContribution": 41.69,
      "overall": 63.47
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 13.66,
      "gateTypeDiagnosis": 23.72,
      "boundaryReasonScore": 20.99,
      "taxonomyIntegrity": 40.01,
      "correctnessScore": 40.86,
      "confidence": 32.05,
      "failGateContribution": 27.85,
      "correctnessContribution": 45.4,
      "overall": 37.32
    }
  },
  {
    "id": "fgs-021",
    "input": {
      "severityFit": 0.7,
      "gateTypeFit": 0.68,
      "boundaryCoherence": 0.7,
      "evidenceStrength": 0.72,
      "taxonomyCoverage": 0.69,
      "answerMatch": 0.73,
      "fluencyScore": 0.33,
      "harmProximity": 0.31,
      "scopeDrift": 0.24,
      "gateBias": "balanced",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 66.85,
      "gateTypeDiagnosis": 69.63,
      "boundaryReasonScore": 70.03,
      "taxonomyIntegrity": 74.14,
      "correctnessScore": 39.99,
      "confidence": 62.05,
      "failGateContribution": 70.01,
      "correctnessContribution": 42.69,
      "overall": 69.09
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 27.89,
      "gateTypeDiagnosis": 22.98,
      "boundaryReasonScore": 19.83,
      "taxonomyIntegrity": 40.45,
      "correctnessScore": 61.19,
      "confidence": 31.8,
      "failGateContribution": 34.47,
      "correctnessContribution": 56.02,
      "overall": 47.36
    }
  },
  {
    "id": "fgs-022",
    "input": {
      "severityFit": 0.74,
      "gateTypeFit": 0.72,
      "boundaryCoherence": 0.73,
      "evidenceStrength": 0.76,
      "taxonomyCoverage": 0.73,
      "answerMatch": 0.77,
      "fluencyScore": 0.34,
      "harmProximity": 0.32,
      "scopeDrift": 0.25,
      "gateBias": "boundary_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 58.63,
      "gateTypeDiagnosis": 73.27,
      "boundaryReasonScore": 89.55,
      "taxonomyIntegrity": 59.58,
      "correctnessScore": 42.47,
      "confidence": 65.45,
      "failGateContribution": 71.01,
      "correctnessContribution": 45.28,
      "overall": 70.38
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 24.57,
      "gateTypeDiagnosis": 24.04,
      "boundaryReasonScore": 20.83,
      "taxonomyIntegrity": 42.15,
      "correctnessScore": 42.21,
      "confidence": 33.35,
      "failGateContribution": 30.76,
      "correctnessContribution": 46.65,
      "overall": 39.09
    }
  },
  {
    "id": "fgs-023",
    "input": {
      "severityFit": 0.79,
      "gateTypeFit": 0.76,
      "boundaryCoherence": 0.77,
      "evidenceStrength": 0.8,
      "taxonomyCoverage": 0.78,
      "answerMatch": 0.81,
      "fluencyScore": 0.36,
      "harmProximity": 0.33,
      "scopeDrift": 0.25,
      "gateBias": "accuracy_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 50.03,
      "gateTypeDiagnosis": 67.13,
      "boundaryReasonScore": 54.12,
      "taxonomyIntegrity": 48.87,
      "correctnessScore": 45.16,
      "confidence": 69.25,
      "failGateContribution": 55.02,
      "correctnessContribution": 48.13,
      "overall": 54.78
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 33.86,
      "gateTypeDiagnosis": 25.45,
      "boundaryReasonScore": 22.19,
      "taxonomyIntegrity": 44.02,
      "correctnessScore": 84.72,
      "confidence": 35.45,
      "failGateContribution": 42.05,
      "correctnessContribution": 71.4,
      "overall": 60.8
    }
  },
  {
    "id": "fgs-024",
    "input": {
      "severityFit": 0.75,
      "gateTypeFit": 0.75,
      "boundaryCoherence": 0.81,
      "evidenceStrength": 0.76,
      "taxonomyCoverage": 0.76,
      "answerMatch": 0.77,
      "fluencyScore": 0.31,
      "harmProximity": 0.25,
      "scopeDrift": 0.2,
      "gateBias": "balanced",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 71.91,
      "gateTypeDiagnosis": 76.16,
      "boundaryReasonScore": 79.36,
      "taxonomyIntegrity": 80.56,
      "correctnessScore": 43.13,
      "confidence": 68.8,
      "failGateContribution": 76.92,
      "correctnessContribution": 46.15,
      "overall": 75.38
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 31.21,
      "gateTypeDiagnosis": 23.39,
      "boundaryReasonScore": 20.27,
      "taxonomyIntegrity": 41.01,
      "correctnessScore": 63.65,
      "confidence": 33.9,
      "failGateContribution": 35.91,
      "correctnessContribution": 58.02,
      "overall": 49.96
    }
  },
  {
    "id": "fgs-025",
    "input": {
      "severityFit": 0.79,
      "gateTypeFit": 0.79,
      "boundaryCoherence": 0.77,
      "evidenceStrength": 0.8,
      "taxonomyCoverage": 0.8,
      "answerMatch": 0.8,
      "fluencyScore": 0.33,
      "harmProximity": 0.26,
      "scopeDrift": 0.21,
      "gateBias": "taxonomy_strict",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 62.8,
      "gateTypeDiagnosis": 79.77,
      "boundaryReasonScore": 55.22,
      "taxonomyIntegrity": 100,
      "correctnessScore": 45.2,
      "confidence": 70.3,
      "failGateContribution": 72.93,
      "correctnessContribution": 48.35,
      "overall": 72.51
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 19.5,
      "gateTypeDiagnosis": 24.62,
      "boundaryReasonScore": 21.81,
      "taxonomyIntegrity": 42.53,
      "correctnessScore": 43.52,
      "confidence": 35.55,
      "failGateContribution": 30.4,
      "correctnessContribution": 48.11,
      "overall": 40.87
    }
  },
  {
    "id": "fgs-026",
    "input": {
      "severityFit": 0.83,
      "gateTypeFit": 0.83,
      "boundaryCoherence": 0.8,
      "evidenceStrength": 0.83,
      "taxonomyCoverage": 0.84,
      "answerMatch": 0.84,
      "fluencyScore": 0.34,
      "harmProximity": 0.27,
      "scopeDrift": 0.22,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 78.57,
      "gateTypeDiagnosis": 83.42,
      "boundaryReasonScore": 80.36,
      "taxonomyIntegrity": 88.24,
      "correctnessScore": 47.68,
      "confidence": 73.3,
      "failGateContribution": 82.36,
      "correctnessContribution": 50.93,
      "overall": 80.7
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 33.17,
      "gateTypeDiagnosis": 25.66,
      "boundaryReasonScore": 22.78,
      "taxonomyIntegrity": 44.22,
      "correctnessScore": 68.8,
      "confidence": 37.1,
      "failGateContribution": 38.93,
      "correctnessContribution": 63.07,
      "overall": 54.28
    }
  },
  {
    "id": "fgs-027",
    "input": {
      "severityFit": 0.87,
      "gateTypeFit": 0.81,
      "boundaryCoherence": 0.84,
      "evidenceStrength": 0.87,
      "taxonomyCoverage": 0.82,
      "answerMatch": 0.88,
      "fluencyScore": 0.3,
      "harmProximity": 0.27,
      "scopeDrift": 0.17,
      "gateBias": "boundary_first",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 68.66,
      "gateTypeDiagnosis": 81.73,
      "boundaryReasonScore": 100,
      "taxonomyIntegrity": 66.56,
      "correctnessScore": 49.35,
      "confidence": 75.9,
      "failGateContribution": 80.11,
      "correctnessContribution": 52.55,
      "overall": 79.15
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 30.78,
      "gateTypeDiagnosis": 25.15,
      "boundaryReasonScore": 21.81,
      "taxonomyIntegrity": 45.12,
      "correctnessScore": 45.22,
      "confidence": 37.2,
      "failGateContribution": 33.62,
      "correctnessContribution": 49.74,
      "overall": 43.01
    }
  },
  {
    "id": "fgs-028",
    "input": {
      "severityFit": 0.83,
      "gateTypeFit": 0.86,
      "boundaryCoherence": 0.87,
      "evidenceStrength": 0.83,
      "taxonomyCoverage": 0.86,
      "answerMatch": 0.84,
      "fluencyScore": 0.31,
      "harmProximity": 0.2,
      "scopeDrift": 0.17,
      "gateBias": "accuracy_first",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 54.22,
      "gateTypeDiagnosis": 76.05,
      "boundaryReasonScore": 60.66,
      "taxonomyIntegrity": 54.44,
      "correctnessScore": 48.34,
      "confidence": 76.1,
      "failGateContribution": 61.31,
      "correctnessContribution": 51.77,
      "overall": 60.59
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 38.81,
      "gateTypeDiagnosis": 25.06,
      "boundaryReasonScore": 22.23,
      "taxonomyIntegrity": 43.18,
      "correctnessScore": 86.95,
      "confidence": 37.65,
      "failGateContribution": 43.25,
      "correctnessContribution": 72.61,
      "overall": 63.53
    }
  },
  {
    "id": "fgs-029",
    "input": {
      "severityFit": 0.87,
      "gateTypeFit": 0.9,
      "boundaryCoherence": 0.91,
      "evidenceStrength": 0.87,
      "taxonomyCoverage": 0.9,
      "answerMatch": 0.87,
      "fluencyScore": 0.33,
      "harmProximity": 0.2,
      "scopeDrift": 0.18,
      "gateBias": "balanced",
      "profile": "fail_gate"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 83.08,
      "gateTypeDiagnosis": 89.66,
      "boundaryReasonScore": 89.75,
      "taxonomyIntegrity": 93.95,
      "correctnessScore": 50.59,
      "confidence": 79.6,
      "failGateContribution": 88.92,
      "correctnessContribution": 54.19,
      "overall": 86.67
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 36.33,
      "gateTypeDiagnosis": 26.4,
      "boundaryReasonScore": 23.51,
      "taxonomyIntegrity": 44.7,
      "correctnessScore": 71.06,
      "confidence": 39.5,
      "failGateContribution": 40.4,
      "correctnessContribution": 65.1,
      "overall": 56.99
    }
  },
  {
    "id": "fgs-030",
    "input": {
      "severityFit": 0.91,
      "gateTypeFit": 0.88,
      "boundaryCoherence": 0.87,
      "evidenceStrength": 0.91,
      "taxonomyCoverage": 0.88,
      "answerMatch": 0.91,
      "fluencyScore": 0.28,
      "harmProximity": 0.21,
      "scopeDrift": 0.13,
      "gateBias": "taxonomy_strict",
      "profile": "correctness_only"
    },
    "expectedFailGate": {
      "mode": "fail_gate",
      "severityDiagnosis": 72.3,
      "gateTypeDiagnosis": 88.02,
      "boundaryReasonScore": 63.28,
      "taxonomyIntegrity": 100,
      "correctnessScore": 51.88,
      "confidence": 80.35,
      "failGateContribution": 79.64,
      "correctnessContribution": 55.34,
      "overall": 79.27
    },
    "expectedCorrectnessOnly": {
      "mode": "correctness_only",
      "severityDiagnosis": 25.72,
      "gateTypeDiagnosis": 25.33,
      "boundaryReasonScore": 22.37,
      "taxonomyIntegrity": 45.32,
      "correctnessScore": 46.21,
      "confidence": 38.95,
      "failGateContribution": 32.99,
      "correctnessContribution": 50.7,
      "overall": 44.34
    }
  }
];
