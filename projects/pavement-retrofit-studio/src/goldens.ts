import type { RetrofitInput, RetrofitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RetrofitInput;
  expectedPhotocatalytic: RetrofitQuality;
  expectedConventional: RetrofitQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pr-001",
    "input": {
      "tio2Loading": 0.34,
      "trafficDensity": 0.55,
      "noxBaseline": 0.49,
      "co2Baseline": 0.5,
      "preservationQuality": 0.34,
      "corridorExposure": 0.34,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 51.71,
      "durabilityScore": 32.63,
      "coverageScore": 40.18,
      "costEfficiency": 45.84,
      "preservationPenalty": 32.07,
      "confidence": 14.82,
      "retrofitContribution": 50.11,
      "preservationContribution": 39.85,
      "overall": 52.26
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 29.87,
      "durabilityScore": 32.83,
      "coverageScore": 24.11,
      "costEfficiency": 24.87,
      "preservationPenalty": 19.8,
      "confidence": 14.07,
      "retrofitContribution": 38.38,
      "preservationContribution": 27.22,
      "overall": 24.98
    }
  },
  {
    "id": "pr-002",
    "input": {
      "tio2Loading": 0.38,
      "trafficDensity": 0.56,
      "noxBaseline": 0.5,
      "co2Baseline": 0.51,
      "preservationQuality": 0.38,
      "corridorExposure": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "treatmentBias": "assay_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 58.29,
      "durabilityScore": 31.64,
      "coverageScore": 35.36,
      "costEfficiency": 62.53,
      "preservationPenalty": 31.29,
      "confidence": 17.54,
      "retrofitContribution": 54.68,
      "preservationContribution": 44.83,
      "overall": 56.91
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 30.08,
      "durabilityScore": 40.72,
      "coverageScore": 26.36,
      "costEfficiency": 32.31,
      "preservationPenalty": 18.44,
      "confidence": 16.8,
      "retrofitContribution": 42.21,
      "preservationContribution": 31.5,
      "overall": 28.9
    }
  },
  {
    "id": "pr-003",
    "input": {
      "tio2Loading": 0.42,
      "trafficDensity": 0.5,
      "noxBaseline": 0.51,
      "co2Baseline": 0.46,
      "preservationQuality": 0.42,
      "corridorExposure": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "treatmentBias": "preservation_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 22.84,
      "durabilityScore": 34.96,
      "coverageScore": 30.45,
      "costEfficiency": 30.01,
      "preservationPenalty": 54.46,
      "confidence": 21.46,
      "retrofitContribution": 30.63,
      "preservationContribution": 29.16,
      "overall": 31.37
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 31.39,
      "durabilityScore": 43.6,
      "coverageScore": 28.6,
      "costEfficiency": 35.63,
      "preservationPenalty": 16.62,
      "confidence": 20.74,
      "retrofitContribution": 44.52,
      "preservationContribution": 33.93,
      "overall": 31.4
    }
  },
  {
    "id": "pr-004",
    "input": {
      "tio2Loading": 0.38,
      "trafficDensity": 0.51,
      "noxBaseline": 0.43,
      "co2Baseline": 0.46,
      "preservationQuality": 0.38,
      "corridorExposure": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 57.49,
      "durabilityScore": 36.32,
      "coverageScore": 43.77,
      "costEfficiency": 50.33,
      "preservationPenalty": 30.25,
      "confidence": 18.54,
      "retrofitContribution": 54.28,
      "preservationContribution": 43.64,
      "overall": 56.36
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 33.2,
      "durabilityScore": 35.42,
      "coverageScore": 26.36,
      "costEfficiency": 27.86,
      "preservationPenalty": 17.75,
      "confidence": 18.02,
      "retrofitContribution": 41.02,
      "preservationContribution": 30.51,
      "overall": 28.16
    }
  },
  {
    "id": "pr-005",
    "input": {
      "tio2Loading": 0.42,
      "trafficDensity": 0.51,
      "noxBaseline": 0.44,
      "co2Baseline": 0.47,
      "preservationQuality": 0.42,
      "corridorExposure": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "treatmentBias": "photocatalytic_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 64.72,
      "durabilityScore": 43.28,
      "coverageScore": 53.35,
      "costEfficiency": 30.47,
      "preservationPenalty": 29.42,
      "confidence": 21.26,
      "retrofitContribution": 55.06,
      "preservationContribution": 44.32,
      "overall": 57.13
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 21.41,
      "durabilityScore": 27.71,
      "coverageScore": 28.6,
      "costEfficiency": 23.15,
      "preservationPenalty": 16.36,
      "confidence": 20.77,
      "retrofitContribution": 36.9,
      "preservationContribution": 21.51,
      "overall": 19.98
    }
  },
  {
    "id": "pr-006",
    "input": {
      "tio2Loading": 0.45,
      "trafficDensity": 0.46,
      "noxBaseline": 0.45,
      "co2Baseline": 0.42,
      "preservationQuality": 0.45,
      "corridorExposure": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "treatmentBias": "balanced",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 61.3,
      "durabilityScore": 42.53,
      "coverageScore": 49.76,
      "costEfficiency": 55.01,
      "preservationPenalty": 28.24,
      "confidence": 24.45,
      "retrofitContribution": 58.57,
      "preservationContribution": 47.47,
      "overall": 60.57
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 34.94,
      "durabilityScore": 38.63,
      "coverageScore": 30.29,
      "costEfficiency": 32.44,
      "preservationPenalty": 14.93,
      "confidence": 23.94,
      "retrofitContribution": 44.27,
      "preservationContribution": 33.44,
      "overall": 31.05
    }
  },
  {
    "id": "pr-007",
    "input": {
      "tio2Loading": 0.49,
      "trafficDensity": 0.47,
      "noxBaseline": 0.46,
      "co2Baseline": 0.43,
      "preservationQuality": 0.49,
      "corridorExposure": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "treatmentBias": "assay_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 68.94,
      "durabilityScore": 40.31,
      "coverageScore": 42.72,
      "costEfficiency": 74.67,
      "preservationPenalty": 27.46,
      "confidence": 27.17,
      "retrofitContribution": 63.51,
      "preservationContribution": 52.98,
      "overall": 65.61
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 35.15,
      "durabilityScore": 48.39,
      "coverageScore": 32.54,
      "costEfficiency": 41.33,
      "preservationPenalty": 13.57,
      "confidence": 26.67,
      "retrofitContribution": 48.77,
      "preservationContribution": 38.67,
      "overall": 35.86
    }
  },
  {
    "id": "pr-008",
    "input": {
      "tio2Loading": 0.45,
      "trafficDensity": 0.47,
      "noxBaseline": 0.39,
      "co2Baseline": 0.44,
      "preservationQuality": 0.45,
      "corridorExposure": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "treatmentBias": "preservation_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 27.01,
      "durabilityScore": 37.31,
      "coverageScore": 32.54,
      "costEfficiency": 32.54,
      "preservationPenalty": 52.62,
      "confidence": 24.05,
      "retrofitContribution": 33.44,
      "preservationContribution": 31.58,
      "overall": 34.11
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 36.06,
      "durabilityScore": 46.57,
      "coverageScore": 30.29,
      "costEfficiency": 38.54,
      "preservationPenalty": 14.76,
      "confidence": 23.76,
      "retrofitContribution": 47.34,
      "preservationContribution": 38.03,
      "overall": 35.19
    }
  },
  {
    "id": "pr-009",
    "input": {
      "tio2Loading": 0.49,
      "trafficDensity": 0.42,
      "noxBaseline": 0.39,
      "co2Baseline": 0.38,
      "preservationQuality": 0.49,
      "corridorExposure": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "treatmentBias": "balanced",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 67.07,
      "durabilityScore": 46.22,
      "coverageScore": 53.35,
      "costEfficiency": 59.49,
      "preservationPenalty": 26.41,
      "confidence": 28.17,
      "retrofitContribution": 62.73,
      "preservationContribution": 51.25,
      "overall": 64.66
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 38.27,
      "durabilityScore": 41.21,
      "coverageScore": 32.54,
      "costEfficiency": 35.43,
      "preservationPenalty": 12.88,
      "confidence": 27.89,
      "retrofitContribution": 46.91,
      "preservationContribution": 36.73,
      "overall": 34.24
    }
  },
  {
    "id": "pr-010",
    "input": {
      "tio2Loading": 0.53,
      "trafficDensity": 0.43,
      "noxBaseline": 0.4,
      "co2Baseline": 0.39,
      "preservationQuality": 0.53,
      "corridorExposure": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "treatmentBias": "photocatalytic_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 75.36,
      "durabilityScore": 54.14,
      "coverageScore": 64.5,
      "costEfficiency": 35.74,
      "preservationPenalty": 25.63,
      "confidence": 30.89,
      "retrofitContribution": 63.42,
      "preservationContribution": 51.86,
      "overall": 65.34
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 26.48,
      "durabilityScore": 31.05,
      "coverageScore": 34.79,
      "costEfficiency": 28.83,
      "preservationPenalty": 11.52,
      "confidence": 30.62,
      "retrofitContribution": 41.93,
      "preservationContribution": 26.49,
      "overall": 24.9
    }
  },
  {
    "id": "pr-011",
    "input": {
      "tio2Loading": 0.57,
      "trafficDensity": 0.43,
      "noxBaseline": 0.41,
      "co2Baseline": 0.4,
      "preservationQuality": 0.57,
      "corridorExposure": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 69.1,
      "durabilityScore": 52.79,
      "coverageScore": 59.19,
      "costEfficiency": 62.58,
      "preservationPenalty": 24.81,
      "confidence": 33.61,
      "retrofitContribution": 65.99,
      "preservationContribution": 54.24,
      "overall": 67.88
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 39.69,
      "durabilityScore": 44.11,
      "coverageScore": 37.03,
      "costEfficiency": 40.28,
      "preservationPenalty": 10.13,
      "confidence": 33.37,
      "retrofitContribution": 50.2,
      "preservationContribution": 39.25,
      "overall": 36.41
    }
  },
  {
    "id": "pr-012",
    "input": {
      "tio2Loading": 0.53,
      "trafficDensity": 0.38,
      "noxBaseline": 0.34,
      "co2Baseline": 0.35,
      "preservationQuality": 0.53,
      "corridorExposure": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "treatmentBias": "assay_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 79.79,
      "durabilityScore": 43.86,
      "coverageScore": 46.26,
      "costEfficiency": 83.99,
      "preservationPenalty": 24.72,
      "confidence": 31.69,
      "retrofitContribution": 70.51,
      "preservationContribution": 59.37,
      "overall": 72.5
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 40.69,
      "durabilityScore": 52.66,
      "coverageScore": 34.79,
      "costEfficiency": 45.36,
      "preservationPenalty": 10.91,
      "confidence": 31.62,
      "retrofitContribution": 52.52,
      "preservationContribution": 44.05,
      "overall": 41.16
    }
  },
  {
    "id": "pr-013",
    "input": {
      "tio2Loading": 0.57,
      "trafficDensity": 0.38,
      "noxBaseline": 0.35,
      "co2Baseline": 0.36,
      "preservationQuality": 0.57,
      "corridorExposure": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "treatmentBias": "preservation_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 33.07,
      "durabilityScore": 46.7,
      "coverageScore": 40.44,
      "costEfficiency": 38.14,
      "preservationPenalty": 48.54,
      "confidence": 34.41,
      "retrofitContribution": 39.56,
      "preservationContribution": 36.98,
      "overall": 40.1
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 41.4,
      "durabilityScore": 54.82,
      "coverageScore": 37.03,
      "costEfficiency": 48.33,
      "preservationPenalty": 9.52,
      "confidence": 34.37,
      "retrofitContribution": 54.41,
      "preservationContribution": 45.68,
      "overall": 42.59
    }
  },
  {
    "id": "pr-014",
    "input": {
      "tio2Loading": 0.61,
      "trafficDensity": 0.39,
      "noxBaseline": 0.35,
      "co2Baseline": 0.36,
      "preservationQuality": 0.61,
      "corridorExposure": 0.61,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 74.87,
      "durabilityScore": 56.48,
      "coverageScore": 62.78,
      "costEfficiency": 67.07,
      "preservationPenalty": 22.98,
      "confidence": 37.33,
      "retrofitContribution": 70.16,
      "preservationContribution": 58.02,
      "overall": 71.97
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 43.01,
      "durabilityScore": 46.7,
      "coverageScore": 39.28,
      "costEfficiency": 43.27,
      "preservationPenalty": 8.07,
      "confidence": 37.31,
      "retrofitContribution": 52.84,
      "preservationContribution": 42.53,
      "overall": 39.59
    }
  },
  {
    "id": "pr-015",
    "input": {
      "tio2Loading": 0.65,
      "trafficDensity": 0.34,
      "noxBaseline": 0.36,
      "co2Baseline": 0.31,
      "preservationQuality": 0.65,
      "corridorExposure": 0.65,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "treatmentBias": "photocatalytic_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 86.51,
      "durabilityScore": 65.94,
      "coverageScore": 76.71,
      "costEfficiency": 41.34,
      "preservationPenalty": 21.56,
      "confidence": 41.25,
      "retrofitContribution": 72.38,
      "preservationContribution": 59.88,
      "overall": 74.13
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 31.82,
      "durabilityScore": 34.62,
      "coverageScore": 41.53,
      "costEfficiency": 34.99,
      "preservationPenalty": 6.28,
      "confidence": 41.23,
      "retrofitContribution": 47.34,
      "preservationContribution": 31.77,
      "overall": 30.09
    }
  },
  {
    "id": "pr-016",
    "input": {
      "tio2Loading": 0.6,
      "trafficDensity": 0.34,
      "noxBaseline": 0.29,
      "co2Baseline": 0.32,
      "preservationQuality": 0.6,
      "corridorExposure": 0.6,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 78.42,
      "durabilityScore": 55.96,
      "coverageScore": 62.78,
      "costEfficiency": 69.15,
      "preservationPenalty": 22.31,
      "confidence": 37.4,
      "retrofitContribution": 71.87,
      "preservationContribution": 59.49,
      "overall": 73.64
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 44.95,
      "durabilityScore": 47.3,
      "coverageScore": 38.72,
      "costEfficiency": 43.15,
      "preservationPenalty": 7.84,
      "confidence": 37.58,
      "retrofitContribution": 53.26,
      "preservationContribution": 43.89,
      "overall": 41.03
    }
  },
  {
    "id": "pr-017",
    "input": {
      "tio2Loading": 0.64,
      "trafficDensity": 0.35,
      "noxBaseline": 0.3,
      "co2Baseline": 0.33,
      "preservationQuality": 0.64,
      "corridorExposure": 0.64,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "treatmentBias": "assay_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 87.98,
      "durabilityScore": 52.05,
      "coverageScore": 52.72,
      "costEfficiency": 93.48,
      "preservationPenalty": 21.53,
      "confidence": 40.12,
      "retrofitContribution": 77.61,
      "preservationContribution": 66.02,
      "overall": 79.52
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 45.16,
      "durabilityScore": 59.61,
      "coverageScore": 40.97,
      "costEfficiency": 54.03,
      "preservationPenalty": 6.48,
      "confidence": 40.31,
      "retrofitContribution": 58.66,
      "preservationContribution": 50.41,
      "overall": 47.05
    }
  },
  {
    "id": "pr-018",
    "input": {
      "tio2Loading": 0.68,
      "trafficDensity": 0.3,
      "noxBaseline": 0.3,
      "co2Baseline": 0.27,
      "preservationQuality": 0.68,
      "corridorExposure": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "treatmentBias": "preservation_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 39.33,
      "durabilityScore": 55.45,
      "coverageScore": 47.66,
      "costEfficiency": 43.67,
      "preservationPenalty": 44.61,
      "confidence": 44.24,
      "retrofitContribution": 45.51,
      "preservationContribution": 42.29,
      "overall": 45.93
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 46.87,
      "durabilityScore": 62.58,
      "coverageScore": 43.22,
      "costEfficiency": 57.41,
      "preservationPenalty": 4.59,
      "confidence": 44.43,
      "retrofitContribution": 61.1,
      "preservationContribution": 53.1,
      "overall": 49.84
    }
  },
  {
    "id": "pr-019",
    "input": {
      "tio2Loading": 0.72,
      "trafficDensity": 0.3,
      "noxBaseline": 0.31,
      "co2Baseline": 0.28,
      "preservationQuality": 0.72,
      "corridorExposure": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 84.46,
      "durabilityScore": 66.38,
      "coverageScore": 72.36,
      "costEfficiency": 76.23,
      "preservationPenalty": 19.15,
      "confidence": 46.96,
      "retrofitContribution": 78.61,
      "preservationContribution": 65.63,
      "overall": 80.27
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 48.08,
      "durabilityScore": 52.49,
      "coverageScore": 45.46,
      "costEfficiency": 50.85,
      "preservationPenalty": 3.2,
      "confidence": 47.18,
      "retrofitContribution": 58.74,
      "preservationContribution": 48.76,
      "overall": 45.68
    }
  },
  {
    "id": "pr-020",
    "input": {
      "tio2Loading": 0.68,
      "trafficDensity": 0.31,
      "noxBaseline": 0.24,
      "co2Baseline": 0.29,
      "preservationQuality": 0.68,
      "corridorExposure": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "treatmentBias": "photocatalytic_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 94.4,
      "durabilityScore": 68.89,
      "coverageScore": 79.88,
      "costEfficiency": 43.87,
      "preservationPenalty": 19.71,
      "confidence": 43.84,
      "retrofitContribution": 76.68,
      "preservationContribution": 63.82,
      "overall": 78.37
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 36.49,
      "durabilityScore": 36.44,
      "coverageScore": 43.22,
      "costEfficiency": 36.99,
      "preservationPenalty": 4.42,
      "confidence": 44.25,
      "retrofitContribution": 49.74,
      "preservationContribution": 35.28,
      "overall": 33.32
    }
  },
  {
    "id": "pr-021",
    "input": {
      "tio2Loading": 0.72,
      "trafficDensity": 0.25,
      "noxBaseline": 0.25,
      "co2Baseline": 0.24,
      "preservationQuality": 0.72,
      "corridorExposure": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "treatmentBias": "balanced",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 88.45,
      "durabilityScore": 66.7,
      "coverageScore": 73.11,
      "costEfficiency": 78.81,
      "preservationPenalty": 18.24,
      "confidence": 47.76,
      "retrofitContribution": 80.83,
      "preservationContribution": 67.57,
      "overall": 82.44
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 50.3,
      "durabilityScore": 53.5,
      "coverageScore": 45.46,
      "costEfficiency": 51.35,
      "preservationPenalty": 2.6,
      "confidence": 48.19,
      "retrofitContribution": 59.6,
      "preservationContribution": 50.51,
      "overall": 47.47
    }
  },
  {
    "id": "pr-022",
    "input": {
      "tio2Loading": 0.76,
      "trafficDensity": 0.26,
      "noxBaseline": 0.26,
      "co2Baseline": 0.25,
      "preservationQuality": 0.76,
      "corridorExposure": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "treatmentBias": "assay_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 99.13,
      "durabilityScore": 61.44,
      "coverageScore": 60.63,
      "costEfficiency": 100,
      "preservationPenalty": 17.46,
      "confidence": 50.48,
      "retrofitContribution": 85.56,
      "preservationContribution": 73.39,
      "overall": 87.37
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 50.51,
      "durabilityScore": 67.85,
      "coverageScore": 47.71,
      "costEfficiency": 63.82,
      "preservationPenalty": 1.24,
      "confidence": 50.92,
      "retrofitContribution": 65.73,
      "preservationContribution": 58.06,
      "overall": 54.45
    }
  },
  {
    "id": "pr-023",
    "input": {
      "tio2Loading": 0.8,
      "trafficDensity": 0.27,
      "noxBaseline": 0.26,
      "co2Baseline": 0.25,
      "preservationQuality": 0.8,
      "corridorExposure": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "treatmentBias": "preservation_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 43.93,
      "durabilityScore": 64.36,
      "coverageScore": 54.66,
      "costEfficiency": 47.91,
      "preservationPenalty": 41.18,
      "confidence": 53.4,
      "retrofitContribution": 50.49,
      "preservationContribution": 46.8,
      "overall": 50.83
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 51.62,
      "durabilityScore": 70.11,
      "coverageScore": 49.96,
      "costEfficiency": 66.83,
      "preservationPenalty": 0,
      "confidence": 53.86,
      "retrofitContribution": 67.7,
      "preservationContribution": 59.94,
      "overall": 56.15
    }
  },
  {
    "id": "pr-024",
    "input": {
      "tio2Loading": 0.76,
      "trafficDensity": 0.21,
      "noxBaseline": 0.19,
      "co2Baseline": 0.2,
      "preservationQuality": 0.76,
      "corridorExposure": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "treatmentBias": "balanced",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 94.22,
      "durabilityScore": 70.39,
      "coverageScore": 76.7,
      "costEfficiency": 83.3,
      "preservationPenalty": 16.41,
      "confidence": 51.48,
      "retrofitContribution": 85,
      "preservationContribution": 71.35,
      "overall": 86.54
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 53.62,
      "durabilityScore": 56.09,
      "coverageScore": 47.71,
      "costEfficiency": 54.34,
      "preservationPenalty": 0.54,
      "confidence": 52.13,
      "retrofitContribution": 62.24,
      "preservationContribution": 53.8,
      "overall": 50.66
    }
  },
  {
    "id": "pr-025",
    "input": {
      "tio2Loading": 0.8,
      "trafficDensity": 0.22,
      "noxBaseline": 0.2,
      "co2Baseline": 0.21,
      "preservationQuality": 0.8,
      "corridorExposure": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "treatmentBias": "photocatalytic_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 100,
      "durabilityScore": 80.68,
      "coverageScore": 92.08,
      "costEfficiency": 49.48,
      "preservationPenalty": 15.63,
      "confidence": 54.2,
      "retrofitContribution": 83.85,
      "preservationContribution": 69.9,
      "overall": 85.34
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 41.83,
      "durabilityScore": 40.01,
      "coverageScore": 49.96,
      "costEfficiency": 43.15,
      "preservationPenalty": 0,
      "confidence": 54.86,
      "retrofitContribution": 54.99,
      "preservationContribution": 40.57,
      "overall": 38.48
    }
  },
  {
    "id": "pr-026",
    "input": {
      "tio2Loading": 0.83,
      "trafficDensity": 0.23,
      "noxBaseline": 0.21,
      "co2Baseline": 0.22,
      "preservationQuality": 0.83,
      "corridorExposure": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 95.78,
      "durabilityScore": 76.13,
      "coverageScore": 81.63,
      "costEfficiency": 85.77,
      "preservationPenalty": 15.09,
      "confidence": 56.19,
      "retrofitContribution": 87.66,
      "preservationContribution": 73.85,
      "overall": 89.17
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 54.76,
      "durabilityScore": 58.53,
      "coverageScore": 51.65,
      "costEfficiency": 58.54,
      "preservationPenalty": 0,
      "confidence": 56.85,
      "retrofitContribution": 64.7,
      "preservationContribution": 55.88,
      "overall": 52.35
    }
  },
  {
    "id": "pr-027",
    "input": {
      "tio2Loading": 0.87,
      "trafficDensity": 0.17,
      "noxBaseline": 0.22,
      "co2Baseline": 0.17,
      "preservationQuality": 0.87,
      "corridorExposure": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "treatmentBias": "assay_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 100,
      "durabilityScore": 70.11,
      "coverageScore": 67.99,
      "costEfficiency": 100,
      "preservationPenalty": 13.62,
      "confidence": 60.11,
      "retrofitContribution": 88.59,
      "preservationContribution": 75.68,
      "overall": 90.27
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 55.57,
      "durabilityScore": 75.52,
      "coverageScore": 53.89,
      "costEfficiency": 72.85,
      "preservationPenalty": 0,
      "confidence": 60.79,
      "retrofitContribution": 71.57,
      "preservationContribution": 65.23,
      "overall": 61.25
    }
  },
  {
    "id": "pr-028",
    "input": {
      "tio2Loading": 0.83,
      "trafficDensity": 0.18,
      "noxBaseline": 0.14,
      "co2Baseline": 0.17,
      "preservationQuality": 0.83,
      "corridorExposure": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "treatmentBias": "preservation_first",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 49.56,
      "durabilityScore": 67.19,
      "coverageScore": 57.65,
      "costEfficiency": 51.81,
      "preservationPenalty": 38.69,
      "confidence": 57.19,
      "retrofitContribution": 54.44,
      "preservationContribution": 50.11,
      "overall": 54.66
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 56.88,
      "durabilityScore": 73.81,
      "coverageScore": 51.65,
      "costEfficiency": 70.1,
      "preservationPenalty": 0,
      "confidence": 58.07,
      "retrofitContribution": 70.49,
      "preservationContribution": 64.85,
      "overall": 60.92
    }
  },
  {
    "id": "pr-029",
    "input": {
      "tio2Loading": 0.87,
      "trafficDensity": 0.18,
      "noxBaseline": 0.15,
      "co2Baseline": 0.18,
      "preservationQuality": 0.87,
      "corridorExposure": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "treatmentBias": "balanced",
      "profile": "photocatalytic_pavement_retrofit"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 100,
      "durabilityScore": 79.81,
      "coverageScore": 85.38,
      "costEfficiency": 90.37,
      "preservationPenalty": 13.22,
      "confidence": 59.91,
      "retrofitContribution": 91.41,
      "preservationContribution": 77.11,
      "overall": 92.84
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 58.09,
      "durabilityScore": 61.16,
      "coverageScore": 53.89,
      "costEfficiency": 61.56,
      "preservationPenalty": 0,
      "confidence": 60.82,
      "retrofitContribution": 66.94,
      "preservationContribution": 59.21,
      "overall": 55.48
    }
  },
  {
    "id": "pr-030",
    "input": {
      "tio2Loading": 0.91,
      "trafficDensity": 0.13,
      "noxBaseline": 0.16,
      "co2Baseline": 0.13,
      "preservationQuality": 0.91,
      "corridorExposure": 0.91,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "treatmentBias": "photocatalytic_first",
      "profile": "conventional_preservation"
    },
    "expectedPhotocatalytic": {
      "mode": "photocatalytic_pavement_retrofit",
      "emissionScore": 100,
      "durabilityScore": 91.54,
      "coverageScore": 100,
      "costEfficiency": 54.8,
      "preservationPenalty": 11.8,
      "confidence": 63.83,
      "retrofitContribution": 87.93,
      "preservationContribution": 73.72,
      "overall": 89.37
    },
    "expectedConventional": {
      "mode": "conventional_preservation",
      "emissionScore": 46.9,
      "durabilityScore": 43.4,
      "coverageScore": 56.14,
      "costEfficiency": 48.85,
      "preservationPenalty": 0,
      "confidence": 64.73,
      "retrofitContribution": 59.06,
      "preservationContribution": 45.57,
      "overall": 43.21
    }
  }
];
