import type { ImplementInput, ImplementQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ImplementInput;
  expectedCfir: ImplementQuality;
  expectedStatusQuo: ImplementQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pi-001",
    "input": {
      "codesignIntensity": 0.34,
      "communityEngagement": 0.34,
      "caretakerDelay": 0.49,
      "referralFriction": 0.5,
      "pathwayClarity": 0.34,
      "districtCoverage": 0.34,
      "fidelitySignal": 0.34,
      "overclaimRisk": 0.5,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 51.56,
      "fidelityScore": 32.63,
      "pathwayCoverage": 41.08,
      "costEfficiency": 44.61,
      "statusQuoPenalty": 32.57,
      "confidence": 14.82,
      "codesignContribution": 49.95,
      "pathwayContribution": 39.61,
      "overall": 52.09
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 29.87,
      "fidelityScore": 32.28,
      "pathwayCoverage": 24.11,
      "costEfficiency": 24.59,
      "statusQuoPenalty": 20.13,
      "confidence": 13.85,
      "codesignContribution": 38.14,
      "pathwayContribution": 26.8,
      "overall": 24.59
    }
  },
  {
    "id": "pi-002",
    "input": {
      "codesignIntensity": 0.38,
      "communityEngagement": 0.38,
      "caretakerDelay": 0.5,
      "referralFriction": 0.51,
      "pathwayClarity": 0.38,
      "districtCoverage": 0.38,
      "fidelitySignal": 0.38,
      "overclaimRisk": 0.51,
      "implementationBias": "fidelity_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 58.2,
      "fidelityScore": 31.64,
      "pathwayCoverage": 36.26,
      "costEfficiency": 61.62,
      "statusQuoPenalty": 31.56,
      "confidence": 17.54,
      "codesignContribution": 54.65,
      "pathwayContribution": 44.64,
      "overall": 56.85
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 30.08,
      "fidelityScore": 40.42,
      "pathwayCoverage": 26.36,
      "costEfficiency": 32.16,
      "statusQuoPenalty": 18.62,
      "confidence": 16.68,
      "codesignContribution": 42.08,
      "pathwayContribution": 31.27,
      "overall": 28.69
    }
  },
  {
    "id": "pi-003",
    "input": {
      "codesignIntensity": 0.42,
      "communityEngagement": 0.42,
      "caretakerDelay": 0.51,
      "referralFriction": 0.46,
      "pathwayClarity": 0.42,
      "districtCoverage": 0.42,
      "fidelitySignal": 0.42,
      "overclaimRisk": 0.46,
      "implementationBias": "status_quo_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 22.77,
      "fidelityScore": 34.96,
      "pathwayCoverage": 30.3,
      "costEfficiency": 29.51,
      "statusQuoPenalty": 54.82,
      "confidence": 21.46,
      "codesignContribution": 30.4,
      "pathwayContribution": 29.07,
      "overall": 31.16
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 31.39,
      "fidelityScore": 43.2,
      "pathwayCoverage": 28.6,
      "costEfficiency": 35.43,
      "statusQuoPenalty": 16.86,
      "confidence": 20.58,
      "codesignContribution": 44.35,
      "pathwayContribution": 33.63,
      "overall": 31.13
    }
  },
  {
    "id": "pi-004",
    "input": {
      "codesignIntensity": 0.38,
      "communityEngagement": 0.38,
      "caretakerDelay": 0.43,
      "referralFriction": 0.46,
      "pathwayClarity": 0.38,
      "districtCoverage": 0.38,
      "fidelitySignal": 0.38,
      "overclaimRisk": 0.46,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 57.33,
      "fidelityScore": 36.32,
      "pathwayCoverage": 44.97,
      "costEfficiency": 49.1,
      "statusQuoPenalty": 30.74,
      "confidence": 18.54,
      "codesignContribution": 54.21,
      "pathwayContribution": 43.39,
      "overall": 56.26
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 33.2,
      "fidelityScore": 34.87,
      "pathwayCoverage": 26.36,
      "costEfficiency": 27.58,
      "statusQuoPenalty": 18.08,
      "confidence": 17.8,
      "codesignContribution": 40.79,
      "pathwayContribution": 30.09,
      "overall": 27.78
    }
  },
  {
    "id": "pi-005",
    "input": {
      "codesignIntensity": 0.42,
      "communityEngagement": 0.42,
      "caretakerDelay": 0.44,
      "referralFriction": 0.47,
      "pathwayClarity": 0.42,
      "districtCoverage": 0.42,
      "fidelitySignal": 0.42,
      "overclaimRisk": 0.47,
      "implementationBias": "codesign_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 64.61,
      "fidelityScore": 43.28,
      "pathwayCoverage": 54.4,
      "costEfficiency": 30.04,
      "statusQuoPenalty": 29.74,
      "confidence": 21.26,
      "codesignContribution": 55.16,
      "pathwayContribution": 44.22,
      "overall": 57.19
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 21.41,
      "fidelityScore": 27.36,
      "pathwayCoverage": 28.6,
      "costEfficiency": 22.98,
      "statusQuoPenalty": 16.57,
      "confidence": 20.63,
      "codesignContribution": 36.76,
      "pathwayContribution": 21.25,
      "overall": 19.74
    }
  },
  {
    "id": "pi-006",
    "input": {
      "codesignIntensity": 0.45,
      "communityEngagement": 0.45,
      "caretakerDelay": 0.45,
      "referralFriction": 0.42,
      "pathwayClarity": 0.45,
      "districtCoverage": 0.45,
      "fidelitySignal": 0.45,
      "overclaimRisk": 0.42,
      "implementationBias": "balanced",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 61.17,
      "fidelityScore": 42.53,
      "pathwayCoverage": 49.91,
      "costEfficiency": 54,
      "statusQuoPenalty": 28.64,
      "confidence": 24.45,
      "codesignContribution": 58.27,
      "pathwayContribution": 47.26,
      "overall": 60.29
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 34.94,
      "fidelityScore": 38.18,
      "pathwayCoverage": 30.29,
      "costEfficiency": 32.22,
      "statusQuoPenalty": 15.2,
      "confidence": 23.76,
      "codesignContribution": 44.09,
      "pathwayContribution": 33.1,
      "overall": 30.75
    }
  },
  {
    "id": "pi-007",
    "input": {
      "codesignIntensity": 0.49,
      "communityEngagement": 0.49,
      "caretakerDelay": 0.46,
      "referralFriction": 0.43,
      "pathwayClarity": 0.49,
      "districtCoverage": 0.49,
      "fidelitySignal": 0.49,
      "overclaimRisk": 0.43,
      "implementationBias": "fidelity_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 68.88,
      "fidelityScore": 40.31,
      "pathwayCoverage": 42.87,
      "costEfficiency": 74.07,
      "statusQuoPenalty": 27.64,
      "confidence": 27.17,
      "codesignContribution": 63.37,
      "pathwayContribution": 52.85,
      "overall": 65.48
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 35.15,
      "fidelityScore": 48.19,
      "pathwayCoverage": 32.54,
      "costEfficiency": 41.23,
      "statusQuoPenalty": 13.69,
      "confidence": 26.59,
      "codesignContribution": 48.68,
      "pathwayContribution": 38.52,
      "overall": 35.73
    }
  },
  {
    "id": "pi-008",
    "input": {
      "codesignIntensity": 0.45,
      "communityEngagement": 0.45,
      "caretakerDelay": 0.39,
      "referralFriction": 0.44,
      "pathwayClarity": 0.45,
      "districtCoverage": 0.45,
      "fidelitySignal": 0.45,
      "overclaimRisk": 0.44,
      "implementationBias": "status_quo_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 26.95,
      "fidelityScore": 37.31,
      "pathwayCoverage": 33.74,
      "costEfficiency": 32.05,
      "statusQuoPenalty": 52.98,
      "confidence": 24.05,
      "codesignContribution": 33.59,
      "pathwayContribution": 31.5,
      "overall": 34.21
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 36.06,
      "fidelityScore": 46.17,
      "pathwayCoverage": 30.29,
      "costEfficiency": 38.34,
      "statusQuoPenalty": 15,
      "confidence": 23.6,
      "codesignContribution": 47.17,
      "pathwayContribution": 37.73,
      "overall": 34.92
    }
  },
  {
    "id": "pi-009",
    "input": {
      "codesignIntensity": 0.49,
      "communityEngagement": 0.49,
      "caretakerDelay": 0.39,
      "referralFriction": 0.38,
      "pathwayClarity": 0.49,
      "districtCoverage": 0.49,
      "fidelitySignal": 0.49,
      "overclaimRisk": 0.38,
      "implementationBias": "balanced",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 66.95,
      "fidelityScore": 46.22,
      "pathwayCoverage": 53.8,
      "costEfficiency": 58.48,
      "statusQuoPenalty": 26.82,
      "confidence": 28.17,
      "codesignContribution": 62.53,
      "pathwayContribution": 51.05,
      "overall": 64.46
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 38.27,
      "fidelityScore": 40.76,
      "pathwayCoverage": 32.54,
      "costEfficiency": 35.21,
      "statusQuoPenalty": 13.15,
      "confidence": 27.71,
      "codesignContribution": 46.73,
      "pathwayContribution": 36.39,
      "overall": 33.93
    }
  },
  {
    "id": "pi-010",
    "input": {
      "codesignIntensity": 0.53,
      "communityEngagement": 0.53,
      "caretakerDelay": 0.4,
      "referralFriction": 0.39,
      "pathwayClarity": 0.53,
      "districtCoverage": 0.53,
      "fidelitySignal": 0.53,
      "overclaimRisk": 0.39,
      "implementationBias": "codesign_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 75.3,
      "fidelityScore": 54.14,
      "pathwayCoverage": 64.95,
      "costEfficiency": 35.49,
      "statusQuoPenalty": 25.81,
      "confidence": 30.89,
      "codesignContribution": 63.44,
      "pathwayContribution": 51.8,
      "overall": 65.34
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 26.48,
      "fidelityScore": 30.85,
      "pathwayCoverage": 34.79,
      "costEfficiency": 28.73,
      "statusQuoPenalty": 11.64,
      "confidence": 30.54,
      "codesignContribution": 41.84,
      "pathwayContribution": 26.34,
      "overall": 24.76
    }
  },
  {
    "id": "pi-011",
    "input": {
      "codesignIntensity": 0.57,
      "communityEngagement": 0.57,
      "caretakerDelay": 0.41,
      "referralFriction": 0.4,
      "pathwayClarity": 0.57,
      "districtCoverage": 0.57,
      "fidelitySignal": 0.57,
      "overclaimRisk": 0.4,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 69.1,
      "fidelityScore": 52.79,
      "pathwayCoverage": 59.49,
      "costEfficiency": 62.58,
      "statusQuoPenalty": 24.81,
      "confidence": 33.61,
      "codesignContribution": 66.07,
      "pathwayContribution": 54.24,
      "overall": 67.94
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 39.69,
      "fidelityScore": 44.11,
      "pathwayCoverage": 37.03,
      "costEfficiency": 40.28,
      "statusQuoPenalty": 10.13,
      "confidence": 33.37,
      "codesignContribution": 50.2,
      "pathwayContribution": 39.25,
      "overall": 36.41
    }
  },
  {
    "id": "pi-012",
    "input": {
      "codesignIntensity": 0.53,
      "communityEngagement": 0.53,
      "caretakerDelay": 0.34,
      "referralFriction": 0.35,
      "pathwayClarity": 0.53,
      "districtCoverage": 0.53,
      "fidelitySignal": 0.53,
      "overclaimRisk": 0.35,
      "implementationBias": "fidelity_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 79.65,
      "fidelityScore": 43.86,
      "pathwayCoverage": 46.86,
      "costEfficiency": 82.63,
      "statusQuoPenalty": 25.13,
      "confidence": 31.69,
      "codesignContribution": 70.26,
      "pathwayContribution": 59.09,
      "overall": 72.25
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 40.69,
      "fidelityScore": 52.21,
      "pathwayCoverage": 34.79,
      "costEfficiency": 45.14,
      "statusQuoPenalty": 11.18,
      "confidence": 31.44,
      "codesignContribution": 52.33,
      "pathwayContribution": 43.72,
      "overall": 40.86
    }
  },
  {
    "id": "pi-013",
    "input": {
      "codesignIntensity": 0.57,
      "communityEngagement": 0.57,
      "caretakerDelay": 0.35,
      "referralFriction": 0.36,
      "pathwayClarity": 0.57,
      "districtCoverage": 0.57,
      "fidelitySignal": 0.57,
      "overclaimRisk": 0.36,
      "implementationBias": "status_quo_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 33.03,
      "fidelityScore": 46.7,
      "pathwayCoverage": 40.89,
      "costEfficiency": 37.84,
      "statusQuoPenalty": 48.76,
      "confidence": 34.41,
      "codesignContribution": 39.57,
      "pathwayContribution": 36.93,
      "overall": 40.09
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 41.4,
      "fidelityScore": 54.57,
      "pathwayCoverage": 37.03,
      "costEfficiency": 48.2,
      "statusQuoPenalty": 9.67,
      "confidence": 34.27,
      "codesignContribution": 54.31,
      "pathwayContribution": 45.49,
      "overall": 42.42
    }
  },
  {
    "id": "pi-014",
    "input": {
      "codesignIntensity": 0.61,
      "communityEngagement": 0.61,
      "caretakerDelay": 0.35,
      "referralFriction": 0.36,
      "pathwayClarity": 0.61,
      "districtCoverage": 0.61,
      "fidelitySignal": 0.61,
      "overclaimRisk": 0.36,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 74.87,
      "fidelityScore": 56.48,
      "pathwayCoverage": 63.38,
      "costEfficiency": 67.07,
      "statusQuoPenalty": 22.98,
      "confidence": 37.33,
      "codesignContribution": 70.32,
      "pathwayContribution": 58.02,
      "overall": 72.11
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 43.01,
      "fidelityScore": 46.7,
      "pathwayCoverage": 39.28,
      "costEfficiency": 43.27,
      "statusQuoPenalty": 8.07,
      "confidence": 37.31,
      "codesignContribution": 52.84,
      "pathwayContribution": 42.53,
      "overall": 39.59
    }
  },
  {
    "id": "pi-015",
    "input": {
      "codesignIntensity": 0.65,
      "communityEngagement": 0.65,
      "caretakerDelay": 0.36,
      "referralFriction": 0.31,
      "pathwayClarity": 0.65,
      "districtCoverage": 0.65,
      "fidelitySignal": 0.65,
      "overclaimRisk": 0.31,
      "implementationBias": "codesign_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 86.5,
      "fidelityScore": 65.94,
      "pathwayCoverage": 76.41,
      "costEfficiency": 41.28,
      "statusQuoPenalty": 21.6,
      "confidence": 41.25,
      "codesignContribution": 72.27,
      "pathwayContribution": 59.87,
      "overall": 74.04
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 31.82,
      "fidelityScore": 34.57,
      "pathwayCoverage": 41.53,
      "costEfficiency": 34.96,
      "statusQuoPenalty": 6.31,
      "confidence": 41.21,
      "codesignContribution": 47.31,
      "pathwayContribution": 31.73,
      "overall": 30.05
    }
  },
  {
    "id": "pi-016",
    "input": {
      "codesignIntensity": 0.6,
      "communityEngagement": 0.6,
      "caretakerDelay": 0.29,
      "referralFriction": 0.32,
      "pathwayClarity": 0.6,
      "districtCoverage": 0.6,
      "fidelitySignal": 0.6,
      "overclaimRisk": 0.32,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 78.33,
      "fidelityScore": 55.96,
      "pathwayCoverage": 63.53,
      "costEfficiency": 68.47,
      "statusQuoPenalty": 22.58,
      "confidence": 37.4,
      "codesignContribution": 71.85,
      "pathwayContribution": 59.35,
      "overall": 73.6
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 44.95,
      "fidelityScore": 47,
      "pathwayCoverage": 38.72,
      "costEfficiency": 43,
      "statusQuoPenalty": 8.02,
      "confidence": 37.46,
      "codesignContribution": 53.13,
      "pathwayContribution": 43.67,
      "overall": 40.83
    }
  },
  {
    "id": "pi-017",
    "input": {
      "codesignIntensity": 0.64,
      "communityEngagement": 0.64,
      "caretakerDelay": 0.3,
      "referralFriction": 0.33,
      "pathwayClarity": 0.64,
      "districtCoverage": 0.64,
      "fidelitySignal": 0.64,
      "overclaimRisk": 0.33,
      "implementationBias": "fidelity_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 87.97,
      "fidelityScore": 52.05,
      "pathwayCoverage": 53.47,
      "costEfficiency": 93.33,
      "statusQuoPenalty": 21.58,
      "confidence": 40.12,
      "codesignContribution": 77.77,
      "pathwayContribution": 65.99,
      "overall": 79.65
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 45.16,
      "fidelityScore": 59.56,
      "pathwayCoverage": 40.97,
      "costEfficiency": 54,
      "statusQuoPenalty": 6.51,
      "confidence": 40.29,
      "codesignContribution": 58.64,
      "pathwayContribution": 50.38,
      "overall": 47.02
    }
  },
  {
    "id": "pi-018",
    "input": {
      "codesignIntensity": 0.68,
      "communityEngagement": 0.68,
      "caretakerDelay": 0.3,
      "referralFriction": 0.27,
      "pathwayClarity": 0.68,
      "districtCoverage": 0.68,
      "fidelitySignal": 0.68,
      "overclaimRisk": 0.27,
      "implementationBias": "status_quo_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 39.31,
      "fidelityScore": 55.45,
      "pathwayCoverage": 47.66,
      "costEfficiency": 43.55,
      "statusQuoPenalty": 44.7,
      "confidence": 44.24,
      "codesignContribution": 45.46,
      "pathwayContribution": 42.27,
      "overall": 45.89
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 46.87,
      "fidelityScore": 62.48,
      "pathwayCoverage": 43.22,
      "costEfficiency": 57.36,
      "statusQuoPenalty": 4.65,
      "confidence": 44.39,
      "codesignContribution": 61.06,
      "pathwayContribution": 53.02,
      "overall": 49.77
    }
  },
  {
    "id": "pi-019",
    "input": {
      "codesignIntensity": 0.72,
      "communityEngagement": 0.72,
      "caretakerDelay": 0.31,
      "referralFriction": 0.28,
      "pathwayClarity": 0.72,
      "districtCoverage": 0.72,
      "fidelitySignal": 0.72,
      "overclaimRisk": 0.28,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 84.48,
      "fidelityScore": 66.38,
      "pathwayCoverage": 72.21,
      "costEfficiency": 76.45,
      "statusQuoPenalty": 19.06,
      "confidence": 46.96,
      "codesignContribution": 78.64,
      "pathwayContribution": 65.68,
      "overall": 80.31
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 48.08,
      "fidelityScore": 52.59,
      "pathwayCoverage": 45.46,
      "costEfficiency": 50.9,
      "statusQuoPenalty": 3.14,
      "confidence": 47.22,
      "codesignContribution": 58.78,
      "pathwayContribution": 48.83,
      "overall": 45.74
    }
  },
  {
    "id": "pi-020",
    "input": {
      "codesignIntensity": 0.68,
      "communityEngagement": 0.68,
      "caretakerDelay": 0.24,
      "referralFriction": 0.29,
      "pathwayClarity": 0.68,
      "districtCoverage": 0.68,
      "fidelitySignal": 0.68,
      "overclaimRisk": 0.29,
      "implementationBias": "codesign_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 94.39,
      "fidelityScore": 68.89,
      "pathwayCoverage": 80.93,
      "costEfficiency": 43.81,
      "statusQuoPenalty": 19.76,
      "confidence": 43.84,
      "codesignContribution": 76.95,
      "pathwayContribution": 63.81,
      "overall": 78.58
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 36.49,
      "fidelityScore": 36.39,
      "pathwayCoverage": 43.22,
      "costEfficiency": 36.96,
      "statusQuoPenalty": 4.45,
      "confidence": 44.23,
      "codesignContribution": 49.72,
      "pathwayContribution": 35.24,
      "overall": 33.29
    }
  },
  {
    "id": "pi-021",
    "input": {
      "codesignIntensity": 0.72,
      "communityEngagement": 0.72,
      "caretakerDelay": 0.25,
      "referralFriction": 0.24,
      "pathwayClarity": 0.72,
      "districtCoverage": 0.72,
      "fidelitySignal": 0.72,
      "overclaimRisk": 0.24,
      "implementationBias": "balanced",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 88.41,
      "fidelityScore": 66.7,
      "pathwayCoverage": 73.11,
      "costEfficiency": 78.48,
      "statusQuoPenalty": 18.37,
      "confidence": 47.76,
      "codesignContribution": 80.72,
      "pathwayContribution": 67.5,
      "overall": 82.34
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 50.3,
      "fidelityScore": 53.35,
      "pathwayCoverage": 45.46,
      "costEfficiency": 51.28,
      "statusQuoPenalty": 2.69,
      "confidence": 48.13,
      "codesignContribution": 59.54,
      "pathwayContribution": 50.4,
      "overall": 47.37
    }
  },
  {
    "id": "pi-022",
    "input": {
      "codesignIntensity": 0.76,
      "communityEngagement": 0.76,
      "caretakerDelay": 0.26,
      "referralFriction": 0.25,
      "pathwayClarity": 0.76,
      "districtCoverage": 0.76,
      "fidelitySignal": 0.76,
      "overclaimRisk": 0.25,
      "implementationBias": "fidelity_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 99.17,
      "fidelityScore": 61.44,
      "pathwayCoverage": 60.63,
      "costEfficiency": 100,
      "statusQuoPenalty": 17.37,
      "confidence": 50.48,
      "codesignContribution": 85.58,
      "pathwayContribution": 73.39,
      "overall": 87.39
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 50.51,
      "fidelityScore": 67.95,
      "pathwayCoverage": 47.71,
      "costEfficiency": 63.87,
      "statusQuoPenalty": 1.18,
      "confidence": 50.96,
      "codesignContribution": 65.77,
      "pathwayContribution": 58.14,
      "overall": 54.52
    }
  },
  {
    "id": "pi-023",
    "input": {
      "codesignIntensity": 0.8,
      "communityEngagement": 0.8,
      "caretakerDelay": 0.26,
      "referralFriction": 0.25,
      "pathwayClarity": 0.8,
      "districtCoverage": 0.8,
      "fidelitySignal": 0.8,
      "overclaimRisk": 0.25,
      "implementationBias": "status_quo_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 43.99,
      "fidelityScore": 64.36,
      "pathwayCoverage": 54.81,
      "costEfficiency": 48.34,
      "statusQuoPenalty": 40.87,
      "confidence": 53.4,
      "codesignContribution": 50.7,
      "pathwayContribution": 46.88,
      "overall": 51.01
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 51.62,
      "fidelityScore": 70.46,
      "pathwayCoverage": 49.96,
      "costEfficiency": 67.01,
      "statusQuoPenalty": 0,
      "confidence": 54,
      "codesignContribution": 67.81,
      "pathwayContribution": 60.2,
      "overall": 56.37
    }
  },
  {
    "id": "pi-024",
    "input": {
      "codesignIntensity": 0.76,
      "communityEngagement": 0.76,
      "caretakerDelay": 0.19,
      "referralFriction": 0.2,
      "pathwayClarity": 0.76,
      "districtCoverage": 0.76,
      "fidelitySignal": 0.76,
      "overclaimRisk": 0.2,
      "implementationBias": "balanced",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 94.18,
      "fidelityScore": 70.39,
      "pathwayCoverage": 77,
      "costEfficiency": 82.96,
      "statusQuoPenalty": 16.55,
      "confidence": 51.48,
      "codesignContribution": 84.97,
      "pathwayContribution": 71.29,
      "overall": 86.51
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 53.62,
      "fidelityScore": 55.94,
      "pathwayCoverage": 47.71,
      "costEfficiency": 54.27,
      "statusQuoPenalty": 0.63,
      "confidence": 52.07,
      "codesignContribution": 62.18,
      "pathwayContribution": 53.69,
      "overall": 50.56
    }
  },
  {
    "id": "pi-025",
    "input": {
      "codesignIntensity": 0.8,
      "communityEngagement": 0.8,
      "caretakerDelay": 0.2,
      "referralFriction": 0.21,
      "pathwayClarity": 0.8,
      "districtCoverage": 0.8,
      "fidelitySignal": 0.8,
      "overclaimRisk": 0.21,
      "implementationBias": "codesign_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 100,
      "fidelityScore": 80.68,
      "pathwayCoverage": 92.38,
      "costEfficiency": 49.6,
      "statusQuoPenalty": 15.54,
      "confidence": 54.2,
      "codesignContribution": 83.98,
      "pathwayContribution": 69.91,
      "overall": 85.45
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 41.83,
      "fidelityScore": 40.11,
      "pathwayCoverage": 49.96,
      "costEfficiency": 43.2,
      "statusQuoPenalty": 0,
      "confidence": 54.9,
      "codesignContribution": 55.02,
      "pathwayContribution": 40.64,
      "overall": 38.54
    }
  },
  {
    "id": "pi-026",
    "input": {
      "codesignIntensity": 0.83,
      "communityEngagement": 0.83,
      "caretakerDelay": 0.21,
      "referralFriction": 0.22,
      "pathwayClarity": 0.83,
      "districtCoverage": 0.83,
      "fidelitySignal": 0.83,
      "overclaimRisk": 0.22,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 95.87,
      "fidelityScore": 76.13,
      "pathwayCoverage": 81.93,
      "costEfficiency": 86.44,
      "statusQuoPenalty": 14.82,
      "confidence": 56.19,
      "codesignContribution": 87.97,
      "pathwayContribution": 73.99,
      "overall": 89.45
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 54.76,
      "fidelityScore": 58.83,
      "pathwayCoverage": 51.65,
      "costEfficiency": 58.69,
      "statusQuoPenalty": 0,
      "confidence": 56.97,
      "codesignContribution": 64.79,
      "pathwayContribution": 56.11,
      "overall": 52.55
    }
  },
  {
    "id": "pi-027",
    "input": {
      "codesignIntensity": 0.87,
      "communityEngagement": 0.87,
      "caretakerDelay": 0.22,
      "referralFriction": 0.17,
      "pathwayClarity": 0.87,
      "districtCoverage": 0.87,
      "fidelitySignal": 0.87,
      "overclaimRisk": 0.17,
      "implementationBias": "fidelity_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 100,
      "fidelityScore": 70.11,
      "pathwayCoverage": 67.24,
      "costEfficiency": 100,
      "statusQuoPenalty": 13.44,
      "confidence": 60.11,
      "codesignContribution": 88.41,
      "pathwayContribution": 75.66,
      "overall": 90.11
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 55.57,
      "fidelityScore": 75.72,
      "pathwayCoverage": 53.89,
      "costEfficiency": 72.95,
      "statusQuoPenalty": 0,
      "confidence": 60.87,
      "codesignContribution": 71.63,
      "pathwayContribution": 65.38,
      "overall": 61.38
    }
  },
  {
    "id": "pi-028",
    "input": {
      "codesignIntensity": 0.83,
      "communityEngagement": 0.83,
      "caretakerDelay": 0.14,
      "referralFriction": 0.17,
      "pathwayClarity": 0.83,
      "districtCoverage": 0.83,
      "fidelitySignal": 0.83,
      "overclaimRisk": 0.17,
      "implementationBias": "status_quo_first",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 49.57,
      "fidelityScore": 67.19,
      "pathwayCoverage": 58.25,
      "costEfficiency": 51.87,
      "statusQuoPenalty": 38.64,
      "confidence": 57.19,
      "codesignContribution": 54.63,
      "pathwayContribution": 50.12,
      "overall": 54.82
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 56.88,
      "fidelityScore": 73.86,
      "pathwayCoverage": 51.65,
      "costEfficiency": 70.12,
      "statusQuoPenalty": 0,
      "confidence": 58.09,
      "codesignContribution": 70.5,
      "pathwayContribution": 64.88,
      "overall": 60.95
    }
  },
  {
    "id": "pi-029",
    "input": {
      "codesignIntensity": 0.87,
      "communityEngagement": 0.87,
      "caretakerDelay": 0.15,
      "referralFriction": 0.18,
      "pathwayClarity": 0.87,
      "districtCoverage": 0.87,
      "fidelitySignal": 0.87,
      "overclaimRisk": 0.18,
      "implementationBias": "balanced",
      "profile": "cfir_codesign_primary_care"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 100,
      "fidelityScore": 79.81,
      "pathwayCoverage": 85.83,
      "costEfficiency": 90.93,
      "statusQuoPenalty": 13,
      "confidence": 59.91,
      "codesignContribution": 91.7,
      "pathwayContribution": 77.2,
      "overall": 93.09
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 58.09,
      "fidelityScore": 61.41,
      "pathwayCoverage": 53.89,
      "costEfficiency": 61.68,
      "statusQuoPenalty": 0,
      "confidence": 60.92,
      "codesignContribution": 67.01,
      "pathwayContribution": 59.4,
      "overall": 55.64
    }
  },
  {
    "id": "pi-030",
    "input": {
      "codesignIntensity": 0.91,
      "communityEngagement": 0.91,
      "caretakerDelay": 0.16,
      "referralFriction": 0.13,
      "pathwayClarity": 0.91,
      "districtCoverage": 0.91,
      "fidelitySignal": 0.91,
      "overclaimRisk": 0.13,
      "implementationBias": "codesign_first",
      "profile": "status_quo_pathway"
    },
    "expectedCfir": {
      "mode": "cfir_codesign_primary_care",
      "careAccessScore": 100,
      "fidelityScore": 91.54,
      "pathwayCoverage": 100,
      "costEfficiency": 55.05,
      "statusQuoPenalty": 11.62,
      "confidence": 63.83,
      "codesignContribution": 88.02,
      "pathwayContribution": 73.75,
      "overall": 89.45
    },
    "expectedStatusQuo": {
      "mode": "status_quo_pathway",
      "careAccessScore": 46.9,
      "fidelityScore": 43.6,
      "pathwayCoverage": 56.14,
      "costEfficiency": 48.95,
      "statusQuoPenalty": 0,
      "confidence": 64.81,
      "codesignContribution": 59.12,
      "pathwayContribution": 45.72,
      "overall": 43.34
    }
  }
];
