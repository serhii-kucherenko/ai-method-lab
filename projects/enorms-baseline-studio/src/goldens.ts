import type { EnormsInput, EnormsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EnormsInput;
  expectedPatient: EnormsQuality;
  expectedPopulation: EnormsQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "eb-001",
    "input": {
      "patientNormFit": 0.29,
      "channelCoverage": 0.25,
      "enormsStability": 0.28,
      "detectionSensitivity": 0.34,
      "populationMatchRate": 0.39,
      "populationOptimism": 0.45,
      "seizureHardness": 0.59,
      "overclaimRisk": 0.5,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 22.56,
      "coverageScore": 30.25,
      "stabilityScore": 23.49,
      "detectionIntegrity": 37.64,
      "populationBaselineScore": 16.4,
      "confidence": 19.35,
      "patientContribution": 27.98,
      "populationContribution": 15.96,
      "overall": 29.82
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 5.76,
      "coverageScore": 17.09,
      "stabilityScore": 13.13,
      "detectionIntegrity": 32.39,
      "populationBaselineScore": 40.93,
      "confidence": 17.1,
      "patientContribution": 21.86,
      "populationContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "eb-002",
    "input": {
      "patientNormFit": 0.33,
      "channelCoverage": 0.29,
      "enormsStability": 0.32,
      "detectionSensitivity": 0.38,
      "populationMatchRate": 0.43,
      "populationOptimism": 0.46,
      "seizureHardness": 0.6,
      "overclaimRisk": 0.51,
      "enormsBias": "coverage_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 22.22,
      "coverageScore": 33.9,
      "stabilityScore": 17.76,
      "detectionIntegrity": 48.93,
      "populationBaselineScore": 18.89,
      "confidence": 23,
      "patientContribution": 29.65,
      "populationContribution": 18.61,
      "overall": 31.66
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 2.43,
      "coverageScore": 18.22,
      "stabilityScore": 14.16,
      "detectionIntegrity": 34.08,
      "populationBaselineScore": 31.53,
      "confidence": 18.65,
      "patientContribution": 20.08,
      "populationContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "eb-003",
    "input": {
      "patientNormFit": 0.37,
      "channelCoverage": 0.27,
      "enormsStability": 0.36,
      "detectionSensitivity": 0.42,
      "populationMatchRate": 0.46,
      "populationOptimism": 0.42,
      "seizureHardness": 0.6,
      "overclaimRisk": 0.46,
      "enormsBias": "population_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 12.18,
      "coverageScore": 23.71,
      "stabilityScore": 20.95,
      "detectionIntegrity": 19.24,
      "populationBaselineScore": 19.94,
      "confidence": 25.6,
      "patientContribution": 18.96,
      "populationContribution": 19.69,
      "overall": 20.09
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 12.17,
      "coverageScore": 17.1,
      "stabilityScore": 13.13,
      "detectionIntegrity": 33.93,
      "populationBaselineScore": 54.34,
      "confidence": 18.4,
      "patientContribution": 26.13,
      "populationContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "eb-004",
    "input": {
      "patientNormFit": 0.33,
      "channelCoverage": 0.32,
      "enormsStability": 0.39,
      "detectionSensitivity": 0.38,
      "populationMatchRate": 0.42,
      "populationOptimism": 0.43,
      "seizureHardness": 0.53,
      "overclaimRisk": 0.46,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 28.09,
      "coverageScore": 36.03,
      "stabilityScore": 33.07,
      "detectionIntegrity": 42.23,
      "populationBaselineScore": 18.93,
      "confidence": 26.1,
      "patientContribution": 34.5,
      "populationContribution": 19.05,
      "overall": 35.72
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 8.7,
      "coverageScore": 17.81,
      "stabilityScore": 13.75,
      "detectionIntegrity": 32.79,
      "populationBaselineScore": 42.77,
      "confidence": 18.85,
      "patientContribution": 23.16,
      "populationContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "eb-005",
    "input": {
      "patientNormFit": 0.37,
      "channelCoverage": 0.36,
      "enormsStability": 0.35,
      "detectionSensitivity": 0.42,
      "populationMatchRate": 0.46,
      "populationOptimism": 0.45,
      "seizureHardness": 0.53,
      "overclaimRisk": 0.47,
      "enormsBias": "patient_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 26.86,
      "coverageScore": 39.64,
      "stabilityScore": 39.58,
      "detectionIntegrity": 35.49,
      "populationBaselineScore": 21.8,
      "confidence": 27.6,
      "patientContribution": 35.39,
      "populationContribution": 22.19,
      "overall": 37.01
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 0,
      "coverageScore": 19.51,
      "stabilityScore": 15.76,
      "detectionIntegrity": 34.77,
      "populationBaselineScore": 32.95,
      "confidence": 21.05,
      "patientContribution": 20.6,
      "populationContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "eb-006",
    "input": {
      "patientNormFit": 0.41,
      "channelCoverage": 0.34,
      "enormsStability": 0.39,
      "detectionSensitivity": 0.45,
      "populationMatchRate": 0.5,
      "populationOptimism": 0.4,
      "seizureHardness": 0.54,
      "overclaimRisk": 0.42,
      "enormsBias": "balanced",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 33.94,
      "coverageScore": 39.5,
      "stabilityScore": 35.84,
      "detectionIntegrity": 47.85,
      "populationBaselineScore": 23.08,
      "confidence": 30.35,
      "patientContribution": 38.87,
      "populationContribution": 23.38,
      "overall": 40.08
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 11.98,
      "coverageScore": 18.04,
      "stabilityScore": 14.31,
      "detectionIntegrity": 34.78,
      "populationBaselineScore": 46.72,
      "confidence": 20.5,
      "patientContribution": 25.17,
      "populationContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "eb-007",
    "input": {
      "patientNormFit": 0.45,
      "channelCoverage": 0.38,
      "enormsStability": 0.42,
      "detectionSensitivity": 0.49,
      "populationMatchRate": 0.53,
      "populationOptimism": 0.42,
      "seizureHardness": 0.55,
      "overclaimRisk": 0.43,
      "enormsBias": "coverage_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 31.59,
      "coverageScore": 43.11,
      "stabilityScore": 26.54,
      "detectionIntegrity": 61.29,
      "populationBaselineScore": 25.15,
      "confidence": 33.6,
      "patientContribution": 39.47,
      "populationContribution": 25.64,
      "overall": 40.98
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 8.27,
      "coverageScore": 19.34,
      "stabilityScore": 15.59,
      "detectionIntegrity": 36.3,
      "populationBaselineScore": 34.2,
      "confidence": 22.15,
      "patientContribution": 22.74,
      "populationContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "eb-008",
    "input": {
      "patientNormFit": 0.41,
      "channelCoverage": 0.43,
      "enormsStability": 0.46,
      "detectionSensitivity": 0.45,
      "populationMatchRate": 0.49,
      "populationOptimism": 0.43,
      "seizureHardness": 0.47,
      "overclaimRisk": 0.44,
      "enormsBias": "population_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 19.33,
      "coverageScore": 35.43,
      "stabilityScore": 27.62,
      "detectionIntegrity": 24.76,
      "populationBaselineScore": 24.32,
      "confidence": 34.35,
      "patientContribution": 26.71,
      "populationContribution": 25.23,
      "overall": 27.44
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 16.4,
      "coverageScore": 20.18,
      "stabilityScore": 16.31,
      "detectionIntegrity": 35.17,
      "populationBaselineScore": 58.5,
      "confidence": 22.7,
      "patientContribution": 29.31,
      "populationContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "eb-009",
    "input": {
      "patientNormFit": 0.46,
      "channelCoverage": 0.41,
      "enormsStability": 0.5,
      "detectionSensitivity": 0.49,
      "populationMatchRate": 0.53,
      "populationOptimism": 0.39,
      "seizureHardness": 0.48,
      "overclaimRisk": 0.38,
      "enormsBias": "balanced",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 40.05,
      "coverageScore": 45.49,
      "stabilityScore": 45.68,
      "detectionIntegrity": 52.59,
      "populationBaselineScore": 25.81,
      "confidence": 37.35,
      "patientContribution": 45.69,
      "populationContribution": 26.69,
      "overall": 46.27
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 14.91,
      "coverageScore": 19.07,
      "stabilityScore": 15.29,
      "detectionIntegrity": 35.36,
      "populationBaselineScore": 48.88,
      "confidence": 22.7,
      "patientContribution": 26.7,
      "populationContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "eb-010",
    "input": {
      "patientNormFit": 0.5,
      "channelCoverage": 0.45,
      "enormsStability": 0.46,
      "detectionSensitivity": 0.53,
      "populationMatchRate": 0.57,
      "populationOptimism": 0.4,
      "seizureHardness": 0.49,
      "overclaimRisk": 0.39,
      "enormsBias": "patient_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 36.62,
      "coverageScore": 49.14,
      "stabilityScore": 54.56,
      "detectionIntegrity": 43.07,
      "populationBaselineScore": 28.29,
      "confidence": 39,
      "patientContribution": 46.07,
      "populationContribution": 29.32,
      "overall": 47.06
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 3.59,
      "coverageScore": 20.18,
      "stabilityScore": 16.7,
      "detectionIntegrity": 37.06,
      "populationBaselineScore": 35.54,
      "confidence": 24.25,
      "patientContribution": 22.61,
      "populationContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "eb-011",
    "input": {
      "patientNormFit": 0.54,
      "channelCoverage": 0.49,
      "enormsStability": 0.49,
      "detectionSensitivity": 0.57,
      "populationMatchRate": 0.6,
      "populationOptimism": 0.42,
      "seizureHardness": 0.49,
      "overclaimRisk": 0.4,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 47.21,
      "coverageScore": 52.75,
      "stabilityScore": 47.19,
      "detectionIntegrity": 60.27,
      "populationBaselineScore": 30.54,
      "confidence": 42.25,
      "patientContribution": 51.41,
      "populationContribution": 31.82,
      "overall": 51.88
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 17.1,
      "coverageScore": 21.62,
      "stabilityScore": 18.14,
      "detectionIntegrity": 38.58,
      "populationBaselineScore": 54.12,
      "confidence": 26.1,
      "patientContribution": 29.91,
      "populationContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "eb-012",
    "input": {
      "patientNormFit": 0.5,
      "channelCoverage": 0.48,
      "enormsStability": 0.53,
      "detectionSensitivity": 0.53,
      "populationMatchRate": 0.56,
      "populationOptimism": 0.37,
      "seizureHardness": 0.42,
      "overclaimRisk": 0.35,
      "enormsBias": "coverage_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 38.19,
      "coverageScore": 51.28,
      "stabilityScore": 34.4,
      "detectionIntegrity": 67.57,
      "populationBaselineScore": 28.34,
      "confidence": 42.1,
      "patientContribution": 46.73,
      "populationContribution": 29.7,
      "overall": 47.66
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 13.23,
      "coverageScore": 19.68,
      "stabilityScore": 16.17,
      "detectionIntegrity": 35.76,
      "populationBaselineScore": 34.93,
      "confidence": 24.35,
      "patientContribution": 23.95,
      "populationContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "eb-013",
    "input": {
      "patientNormFit": 0.54,
      "channelCoverage": 0.52,
      "enormsStability": 0.56,
      "detectionSensitivity": 0.57,
      "populationMatchRate": 0.6,
      "populationOptimism": 0.39,
      "seizureHardness": 0.42,
      "overclaimRisk": 0.36,
      "enormsBias": "population_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 29.13,
      "coverageScore": 44.88,
      "stabilityScore": 36.59,
      "detectionIntegrity": 32.66,
      "populationBaselineScore": 31.2,
      "confidence": 45.35,
      "patientContribution": 35.78,
      "populationContribution": 32.8,
      "overall": 36.24
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 22.62,
      "coverageScore": 21.35,
      "stabilityScore": 17.8,
      "detectionIntegrity": 37.74,
      "populationBaselineScore": 67.02,
      "confidence": 26.55,
      "patientContribution": 33.31,
      "populationContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "eb-014",
    "input": {
      "patientNormFit": 0.58,
      "channelCoverage": 0.56,
      "enormsStability": 0.6,
      "detectionSensitivity": 0.61,
      "populationMatchRate": 0.63,
      "populationOptimism": 0.4,
      "seizureHardness": 0.43,
      "overclaimRisk": 0.36,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 52.62,
      "coverageScore": 58.53,
      "stabilityScore": 56.66,
      "detectionIntegrity": 64.86,
      "populationBaselineScore": 33.07,
      "confidence": 49,
      "patientContribution": 57.86,
      "populationContribution": 34.8,
      "overall": 57.71
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 20.03,
      "coverageScore": 22.2,
      "stabilityScore": 18.59,
      "detectionIntegrity": 38.98,
      "populationBaselineScore": 55.96,
      "confidence": 27.85,
      "patientContribution": 31.15,
      "populationContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "eb-015",
    "input": {
      "patientNormFit": 0.62,
      "channelCoverage": 0.54,
      "enormsStability": 0.56,
      "detectionSensitivity": 0.65,
      "populationMatchRate": 0.67,
      "populationOptimism": 0.36,
      "seizureHardness": 0.44,
      "overclaimRisk": 0.31,
      "enormsBias": "patient_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 45.9,
      "coverageScore": 58.35,
      "stabilityScore": 68.41,
      "detectionIntegrity": 50.82,
      "populationBaselineScore": 34.55,
      "confidence": 49.6,
      "patientContribution": 56.27,
      "populationContribution": 36.22,
      "overall": 56.66
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 9.43,
      "coverageScore": 21.14,
      "stabilityScore": 17.93,
      "detectionIntegrity": 39.27,
      "populationBaselineScore": 38.2,
      "confidence": 27.75,
      "patientContribution": 25.19,
      "populationContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "eb-016",
    "input": {
      "patientNormFit": 0.58,
      "channelCoverage": 0.59,
      "enormsStability": 0.6,
      "detectionSensitivity": 0.6,
      "populationMatchRate": 0.63,
      "populationOptimism": 0.37,
      "seizureHardness": 0.36,
      "overclaimRisk": 0.32,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 54.46,
      "coverageScore": 60.67,
      "stabilityScore": 57.87,
      "detectionIntegrity": 65.05,
      "populationBaselineScore": 33.73,
      "confidence": 50.35,
      "patientContribution": 59.24,
      "populationContribution": 35.76,
      "overall": 59.01
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 22.05,
      "coverageScore": 21.91,
      "stabilityScore": 18.56,
      "detectionIntegrity": 38.14,
      "populationBaselineScore": 55.7,
      "confidence": 28.3,
      "patientContribution": 31.27,
      "populationContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "eb-017",
    "input": {
      "patientNormFit": 0.62,
      "channelCoverage": 0.63,
      "enormsStability": 0.63,
      "detectionSensitivity": 0.64,
      "populationMatchRate": 0.67,
      "populationOptimism": 0.39,
      "seizureHardness": 0.37,
      "overclaimRisk": 0.33,
      "enormsBias": "coverage_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 48.43,
      "coverageScore": 64.28,
      "stabilityScore": 42.4,
      "detectionIntegrity": 81.43,
      "populationBaselineScore": 36.41,
      "confidence": 53.6,
      "patientContribution": 57.81,
      "populationContribution": 38.61,
      "overall": 58.35
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 18.73,
      "coverageScore": 23.42,
      "stabilityScore": 20,
      "detectionIntegrity": 40.11,
      "populationBaselineScore": 39.86,
      "confidence": 30.3,
      "patientContribution": 28.42,
      "populationContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "eb-018",
    "input": {
      "patientNormFit": 0.66,
      "channelCoverage": 0.61,
      "enormsStability": 0.67,
      "detectionSensitivity": 0.68,
      "populationMatchRate": 0.7,
      "populationOptimism": 0.34,
      "seizureHardness": 0.38,
      "overclaimRisk": 0.27,
      "enormsBias": "population_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 38.33,
      "coverageScore": 54.13,
      "stabilityScore": 45.52,
      "detectionIntegrity": 40.09,
      "populationBaselineScore": 37.08,
      "confidence": 56.35,
      "patientContribution": 44.52,
      "populationContribution": 39.16,
      "overall": 44.56
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 28.36,
      "coverageScore": 21.66,
      "stabilityScore": 18.31,
      "detectionIntegrity": 39.67,
      "populationBaselineScore": 74.27,
      "confidence": 29.5,
      "patientContribution": 36.45,
      "populationContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "eb-019",
    "input": {
      "patientNormFit": 0.7,
      "channelCoverage": 0.65,
      "enormsStability": 0.7,
      "detectionSensitivity": 0.72,
      "populationMatchRate": 0.74,
      "populationOptimism": 0.36,
      "seizureHardness": 0.38,
      "overclaimRisk": 0.28,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 63.81,
      "coverageScore": 67.74,
      "stabilityScore": 68.17,
      "detectionIntegrity": 75.07,
      "populationBaselineScore": 39.94,
      "confidence": 59.6,
      "patientContribution": 68.45,
      "populationContribution": 42.25,
      "overall": 67.73
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 26.25,
      "coverageScore": 23.32,
      "stabilityScore": 19.92,
      "detectionIntegrity": 41.65,
      "populationBaselineScore": 62.07,
      "confidence": 31.7,
      "patientContribution": 34.64,
      "populationContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "eb-020",
    "input": {
      "patientNormFit": 0.66,
      "channelCoverage": 0.7,
      "enormsStability": 0.66,
      "detectionSensitivity": 0.68,
      "populationMatchRate": 0.7,
      "populationOptimism": 0.37,
      "seizureHardness": 0.31,
      "overclaimRisk": 0.29,
      "enormsBias": "patient_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 52.86,
      "coverageScore": 70.06,
      "stabilityScore": 80.04,
      "detectionIntegrity": 56.34,
      "populationBaselineScore": 38.94,
      "confidence": 58.35,
      "patientContribution": 65.36,
      "populationContribution": 41.54,
      "overall": 65.07
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 13.66,
      "coverageScore": 23.93,
      "stabilityScore": 20.75,
      "detectionIntegrity": 40.51,
      "populationBaselineScore": 40.86,
      "confidence": 32.05,
      "patientContribution": 27.94,
      "populationContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "eb-021",
    "input": {
      "patientNormFit": 0.7,
      "channelCoverage": 0.68,
      "enormsStability": 0.7,
      "detectionSensitivity": 0.72,
      "populationMatchRate": 0.73,
      "populationOptimism": 0.33,
      "seizureHardness": 0.31,
      "overclaimRisk": 0.24,
      "enormsBias": "balanced",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 65.6,
      "coverageScore": 69.88,
      "stabilityScore": 69.32,
      "detectionIntegrity": 75.82,
      "populationBaselineScore": 39.99,
      "confidence": 60.95,
      "patientContribution": 69.92,
      "populationContribution": 42.54,
      "overall": 68.99
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 27.89,
      "coverageScore": 22.72,
      "stabilityScore": 19.62,
      "detectionIntegrity": 40.35,
      "populationBaselineScore": 61.19,
      "confidence": 31.8,
      "patientContribution": 34.35,
      "populationContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "eb-022",
    "input": {
      "patientNormFit": 0.74,
      "channelCoverage": 0.72,
      "enormsStability": 0.73,
      "detectionSensitivity": 0.76,
      "populationMatchRate": 0.77,
      "populationOptimism": 0.34,
      "seizureHardness": 0.32,
      "overclaimRisk": 0.25,
      "enormsBias": "coverage_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 57.62,
      "coverageScore": 73.52,
      "stabilityScore": 50.92,
      "detectionIntegrity": 94.56,
      "populationBaselineScore": 42.47,
      "confidence": 64.35,
      "patientContribution": 67.69,
      "populationContribution": 45.15,
      "overall": 67.63
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 24.57,
      "coverageScore": 23.79,
      "stabilityScore": 20.63,
      "detectionIntegrity": 42.05,
      "populationBaselineScore": 42.21,
      "confidence": 33.35,
      "patientContribution": 30.65,
      "populationContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "eb-023",
    "input": {
      "patientNormFit": 0.79,
      "channelCoverage": 0.76,
      "enormsStability": 0.77,
      "detectionSensitivity": 0.8,
      "populationMatchRate": 0.81,
      "populationOptimism": 0.36,
      "seizureHardness": 0.33,
      "overclaimRisk": 0.25,
      "enormsBias": "population_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 49.04,
      "coverageScore": 67.38,
      "stabilityScore": 53.74,
      "detectionIntegrity": 49.49,
      "populationBaselineScore": 45.16,
      "confidence": 68.25,
      "patientContribution": 54.86,
      "populationContribution": 48.03,
      "overall": 54.63
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 33.86,
      "coverageScore": 25.25,
      "stabilityScore": 22.05,
      "detectionIntegrity": 43.92,
      "populationBaselineScore": 84.72,
      "confidence": 35.45,
      "patientContribution": 41.96,
      "populationContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "eb-024",
    "input": {
      "patientNormFit": 0.75,
      "channelCoverage": 0.75,
      "enormsStability": 0.81,
      "detectionSensitivity": 0.76,
      "populationMatchRate": 0.77,
      "populationOptimism": 0.31,
      "seizureHardness": 0.25,
      "overclaimRisk": 0.2,
      "enormsBias": "balanced",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 71.55,
      "coverageScore": 75.91,
      "stabilityScore": 78.99,
      "detectionIntegrity": 80.56,
      "populationBaselineScore": 43.13,
      "confidence": 68.1,
      "patientContribution": 76.66,
      "populationContribution": 46.07,
      "overall": 75.15
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 31.21,
      "coverageScore": 23.36,
      "stabilityScore": 20.13,
      "detectionIntegrity": 41.11,
      "populationBaselineScore": 63.65,
      "confidence": 33.9,
      "patientContribution": 35.89,
      "populationContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "eb-025",
    "input": {
      "patientNormFit": 0.79,
      "channelCoverage": 0.79,
      "enormsStability": 0.77,
      "detectionSensitivity": 0.8,
      "populationMatchRate": 0.8,
      "populationOptimism": 0.33,
      "seizureHardness": 0.26,
      "overclaimRisk": 0.21,
      "enormsBias": "patient_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 62.51,
      "coverageScore": 79.52,
      "stabilityScore": 94.88,
      "detectionIntegrity": 64.24,
      "populationBaselineScore": 45.2,
      "confidence": 69.6,
      "patientContribution": 76.04,
      "populationContribution": 48.27,
      "overall": 75.04
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 19.5,
      "coverageScore": 24.6,
      "stabilityScore": 21.69,
      "detectionIntegrity": 42.63,
      "populationBaselineScore": 43.52,
      "confidence": 35.55,
      "patientContribution": 30.39,
      "populationContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "eb-026",
    "input": {
      "patientNormFit": 0.83,
      "channelCoverage": 0.83,
      "enormsStability": 0.8,
      "detectionSensitivity": 0.83,
      "populationMatchRate": 0.84,
      "populationOptimism": 0.34,
      "seizureHardness": 0.27,
      "overclaimRisk": 0.22,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 78.52,
      "coverageScore": 83.17,
      "stabilityScore": 80.3,
      "detectionIntegrity": 87.68,
      "populationBaselineScore": 47.68,
      "confidence": 73,
      "patientContribution": 82.15,
      "populationContribution": 50.87,
      "overall": 80.52
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 33.17,
      "coverageScore": 25.67,
      "stabilityScore": 22.7,
      "detectionIntegrity": 44.32,
      "populationBaselineScore": 68.8,
      "confidence": 37.1,
      "patientContribution": 38.93,
      "populationContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "eb-027",
    "input": {
      "patientNormFit": 0.87,
      "channelCoverage": 0.81,
      "enormsStability": 0.84,
      "detectionSensitivity": 0.87,
      "populationMatchRate": 0.88,
      "populationOptimism": 0.3,
      "seizureHardness": 0.27,
      "overclaimRisk": 0.17,
      "enormsBias": "coverage_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 67.26,
      "coverageScore": 82.98,
      "stabilityScore": 60.03,
      "detectionIntegrity": 100,
      "populationBaselineScore": 49.35,
      "confidence": 75.6,
      "patientContribution": 76.21,
      "populationContribution": 52.5,
      "overall": 75.94
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 30.78,
      "coverageScore": 24.7,
      "stabilityScore": 21.75,
      "detectionIntegrity": 44.62,
      "populationBaselineScore": 45.22,
      "confidence": 37.2,
      "patientContribution": 33.41,
      "populationContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "eb-028",
    "input": {
      "patientNormFit": 0.83,
      "channelCoverage": 0.86,
      "enormsStability": 0.87,
      "detectionSensitivity": 0.83,
      "populationMatchRate": 0.84,
      "populationOptimism": 0.31,
      "seizureHardness": 0.2,
      "overclaimRisk": 0.17,
      "enormsBias": "population_first",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 54.87,
      "coverageScore": 75.3,
      "stabilityScore": 60.62,
      "detectionIntegrity": 53.51,
      "populationBaselineScore": 48.34,
      "confidence": 76.1,
      "patientContribution": 61.08,
      "populationContribution": 51.73,
      "overall": 60.4
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 38.81,
      "coverageScore": 25.25,
      "stabilityScore": 22.17,
      "detectionIntegrity": 43.48,
      "populationBaselineScore": 86.95,
      "confidence": 37.65,
      "patientContribution": 43.33,
      "populationContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "eb-029",
    "input": {
      "patientNormFit": 0.87,
      "channelCoverage": 0.9,
      "enormsStability": 0.91,
      "detectionSensitivity": 0.87,
      "populationMatchRate": 0.87,
      "populationOptimism": 0.33,
      "seizureHardness": 0.2,
      "overclaimRisk": 0.18,
      "enormsBias": "balanced",
      "profile": "patient_specific_enorms"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 83.89,
      "coverageScore": 88.91,
      "stabilityScore": 89.72,
      "detectionIntegrity": 92.27,
      "populationBaselineScore": 50.59,
      "confidence": 79.6,
      "patientContribution": 88.57,
      "populationContribution": 54.16,
      "overall": 86.38
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 36.33,
      "coverageScore": 26.6,
      "stabilityScore": 23.46,
      "detectionIntegrity": 45,
      "populationBaselineScore": 71.06,
      "confidence": 39.5,
      "patientContribution": 40.49,
      "populationContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "eb-030",
    "input": {
      "patientNormFit": 0.91,
      "channelCoverage": 0.88,
      "enormsStability": 0.87,
      "detectionSensitivity": 0.91,
      "populationMatchRate": 0.91,
      "populationOptimism": 0.28,
      "seizureHardness": 0.21,
      "overclaimRisk": 0.13,
      "enormsBias": "patient_first",
      "profile": "population_norm_baseline"
    },
    "expectedPatient": {
      "mode": "patient_specific_enorms",
      "patientFitScore": 71.59,
      "coverageScore": 88.77,
      "stabilityScore": 100,
      "detectionIntegrity": 71.68,
      "populationBaselineScore": 51.88,
      "confidence": 80.35,
      "patientContribution": 83.69,
      "populationContribution": 55.31,
      "overall": 82.58
    },
    "expectedPopulation": {
      "mode": "population_norm_baseline",
      "patientFitScore": 25.72,
      "coverageScore": 25.06,
      "stabilityScore": 22.34,
      "detectionIntegrity": 45.02,
      "populationBaselineScore": 46.21,
      "confidence": 38.95,
      "patientContribution": 32.87,
      "populationContribution": 50.68,
      "overall": 44.3
    }
  }
];
