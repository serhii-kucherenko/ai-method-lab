import type { FeatureSufficiencyInput, FeatureSufficiencyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FeatureSufficiencyInput;
  expectedPartialObservation: FeatureSufficiencyQuality;
  expectedFullFeature: FeatureSufficiencyQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "fss-001",
    "input": {
      "maskCoverage": 0.29,
      "featureSalience": 0.25,
      "cohortFit": 0.28,
      "labelAgreement": 0.34,
      "fullFeatureAccuracy": 0.39,
      "imputationOptimism": 0.45,
      "missingnessPressure": 0.59,
      "leakageRisk": 0.5,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 22.56,
      "salienceDiagnosis": 30.25,
      "sufficiencyReasonScore": 27.38,
      "cohortIntegrity": 34.28,
      "fullFeatureScore": 16.4,
      "confidence": 19.35,
      "partialContribution": 28.33,
      "fullContribution": 15.96,
      "overall": 30.1
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 5.76,
      "salienceDiagnosis": 17.09,
      "sufficiencyReasonScore": 13.13,
      "cohortIntegrity": 32.39,
      "fullFeatureScore": 40.93,
      "confidence": 17.1,
      "partialContribution": 21.86,
      "fullContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "fss-002",
    "input": {
      "maskCoverage": 0.33,
      "featureSalience": 0.29,
      "cohortFit": 0.32,
      "labelAgreement": 0.38,
      "fullFeatureAccuracy": 0.43,
      "imputationOptimism": 0.46,
      "missingnessPressure": 0.6,
      "leakageRisk": 0.51,
      "sufficiencyBias": "coverage_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 22.22,
      "salienceDiagnosis": 33.9,
      "sufficiencyReasonScore": 39.65,
      "cohortIntegrity": 30.06,
      "fullFeatureScore": 18.89,
      "confidence": 23,
      "partialContribution": 31.63,
      "fullContribution": 18.61,
      "overall": 33.29
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 2.43,
      "salienceDiagnosis": 18.22,
      "sufficiencyReasonScore": 14.16,
      "cohortIntegrity": 34.08,
      "fullFeatureScore": 31.53,
      "confidence": 18.65,
      "partialContribution": 20.08,
      "fullContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "fss-003",
    "input": {
      "maskCoverage": 0.37,
      "featureSalience": 0.27,
      "cohortFit": 0.36,
      "labelAgreement": 0.42,
      "fullFeatureAccuracy": 0.46,
      "imputationOptimism": 0.42,
      "missingnessPressure": 0.6,
      "leakageRisk": 0.46,
      "sufficiencyBias": "full_first",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 12.18,
      "salienceDiagnosis": 23.71,
      "sufficiencyReasonScore": 23.1,
      "cohortIntegrity": 17.39,
      "fullFeatureScore": 19.94,
      "confidence": 25.6,
      "partialContribution": 19.15,
      "fullContribution": 19.69,
      "overall": 20.25
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 12.17,
      "salienceDiagnosis": 17.1,
      "sufficiencyReasonScore": 13.13,
      "cohortIntegrity": 33.93,
      "fullFeatureScore": 54.34,
      "confidence": 18.4,
      "partialContribution": 26.13,
      "fullContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "fss-004",
    "input": {
      "maskCoverage": 0.33,
      "featureSalience": 0.32,
      "cohortFit": 0.39,
      "labelAgreement": 0.38,
      "fullFeatureAccuracy": 0.42,
      "imputationOptimism": 0.43,
      "missingnessPressure": 0.53,
      "leakageRisk": 0.46,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 28.09,
      "salienceDiagnosis": 36.03,
      "sufficiencyReasonScore": 32.42,
      "cohortIntegrity": 42.79,
      "fullFeatureScore": 18.93,
      "confidence": 26.1,
      "partialContribution": 34.44,
      "fullContribution": 19.05,
      "overall": 35.67
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 8.7,
      "salienceDiagnosis": 17.81,
      "sufficiencyReasonScore": 13.75,
      "cohortIntegrity": 32.79,
      "fullFeatureScore": 42.77,
      "confidence": 18.85,
      "partialContribution": 23.16,
      "fullContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "fss-005",
    "input": {
      "maskCoverage": 0.37,
      "featureSalience": 0.36,
      "cohortFit": 0.35,
      "labelAgreement": 0.42,
      "fullFeatureAccuracy": 0.46,
      "imputationOptimism": 0.45,
      "missingnessPressure": 0.53,
      "leakageRisk": 0.47,
      "sufficiencyBias": "mask_strict",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 26.86,
      "salienceDiagnosis": 39.64,
      "sufficiencyReasonScore": 23.89,
      "cohortIntegrity": 49.01,
      "fullFeatureScore": 21.8,
      "confidence": 27.6,
      "partialContribution": 33.97,
      "fullContribution": 22.19,
      "overall": 35.85
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 0,
      "salienceDiagnosis": 19.51,
      "sufficiencyReasonScore": 15.76,
      "cohortIntegrity": 34.77,
      "fullFeatureScore": 32.95,
      "confidence": 21.05,
      "partialContribution": 20.6,
      "fullContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "fss-006",
    "input": {
      "maskCoverage": 0.41,
      "featureSalience": 0.34,
      "cohortFit": 0.39,
      "labelAgreement": 0.45,
      "fullFeatureAccuracy": 0.5,
      "imputationOptimism": 0.4,
      "missingnessPressure": 0.54,
      "leakageRisk": 0.42,
      "sufficiencyBias": "balanced",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 33.94,
      "salienceDiagnosis": 39.5,
      "sufficiencyReasonScore": 39.74,
      "cohortIntegrity": 44.49,
      "fullFeatureScore": 23.08,
      "confidence": 30.35,
      "partialContribution": 39.22,
      "fullContribution": 23.38,
      "overall": 40.37
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 11.98,
      "salienceDiagnosis": 18.04,
      "sufficiencyReasonScore": 14.31,
      "cohortIntegrity": 34.78,
      "fullFeatureScore": 46.72,
      "confidence": 20.5,
      "partialContribution": 25.17,
      "fullContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "fss-007",
    "input": {
      "maskCoverage": 0.45,
      "featureSalience": 0.38,
      "cohortFit": 0.42,
      "labelAgreement": 0.49,
      "fullFeatureAccuracy": 0.53,
      "imputationOptimism": 0.42,
      "missingnessPressure": 0.55,
      "leakageRisk": 0.43,
      "sufficiencyBias": "coverage_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 31.59,
      "salienceDiagnosis": 43.11,
      "sufficiencyReasonScore": 54.51,
      "cohortIntegrity": 37.19,
      "fullFeatureScore": 25.15,
      "confidence": 33.6,
      "partialContribution": 42,
      "fullContribution": 25.64,
      "overall": 43.06
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 8.27,
      "salienceDiagnosis": 19.34,
      "sufficiencyReasonScore": 15.59,
      "cohortIntegrity": 36.3,
      "fullFeatureScore": 34.2,
      "confidence": 22.15,
      "partialContribution": 22.74,
      "fullContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "fss-008",
    "input": {
      "maskCoverage": 0.41,
      "featureSalience": 0.43,
      "cohortFit": 0.46,
      "labelAgreement": 0.45,
      "fullFeatureAccuracy": 0.49,
      "imputationOptimism": 0.43,
      "missingnessPressure": 0.47,
      "leakageRisk": 0.44,
      "sufficiencyBias": "full_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 19.33,
      "salienceDiagnosis": 35.43,
      "sufficiencyReasonScore": 27.26,
      "cohortIntegrity": 25.07,
      "fullFeatureScore": 24.32,
      "confidence": 34.35,
      "partialContribution": 26.68,
      "fullContribution": 25.23,
      "overall": 27.42
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 16.4,
      "salienceDiagnosis": 20.18,
      "sufficiencyReasonScore": 16.31,
      "cohortIntegrity": 35.17,
      "fullFeatureScore": 58.5,
      "confidence": 22.7,
      "partialContribution": 29.31,
      "fullContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "fss-009",
    "input": {
      "maskCoverage": 0.46,
      "featureSalience": 0.41,
      "cohortFit": 0.5,
      "labelAgreement": 0.49,
      "fullFeatureAccuracy": 0.53,
      "imputationOptimism": 0.39,
      "missingnessPressure": 0.48,
      "leakageRisk": 0.38,
      "sufficiencyBias": "balanced",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 40.05,
      "salienceDiagnosis": 45.49,
      "sufficiencyReasonScore": 45.04,
      "cohortIntegrity": 53.15,
      "fullFeatureScore": 25.81,
      "confidence": 37.35,
      "partialContribution": 45.63,
      "fullContribution": 26.69,
      "overall": 46.22
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 14.91,
      "salienceDiagnosis": 19.07,
      "sufficiencyReasonScore": 15.29,
      "cohortIntegrity": 35.36,
      "fullFeatureScore": 48.88,
      "confidence": 22.7,
      "partialContribution": 26.7,
      "fullContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "fss-010",
    "input": {
      "maskCoverage": 0.5,
      "featureSalience": 0.45,
      "cohortFit": 0.46,
      "labelAgreement": 0.53,
      "fullFeatureAccuracy": 0.57,
      "imputationOptimism": 0.4,
      "missingnessPressure": 0.49,
      "leakageRisk": 0.39,
      "sufficiencyBias": "mask_strict",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 36.62,
      "salienceDiagnosis": 49.14,
      "sufficiencyReasonScore": 33.16,
      "cohortIntegrity": 61.53,
      "fullFeatureScore": 28.29,
      "confidence": 39,
      "partialContribution": 44.14,
      "fullContribution": 29.32,
      "overall": 45.47
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 3.59,
      "salienceDiagnosis": 20.18,
      "sufficiencyReasonScore": 16.7,
      "cohortIntegrity": 37.06,
      "fullFeatureScore": 35.54,
      "confidence": 24.25,
      "partialContribution": 22.61,
      "fullContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "fss-011",
    "input": {
      "maskCoverage": 0.54,
      "featureSalience": 0.49,
      "cohortFit": 0.49,
      "labelAgreement": 0.57,
      "fullFeatureAccuracy": 0.6,
      "imputationOptimism": 0.42,
      "missingnessPressure": 0.49,
      "leakageRisk": 0.4,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 47.21,
      "salienceDiagnosis": 52.75,
      "sufficiencyReasonScore": 52.38,
      "cohortIntegrity": 55.79,
      "fullFeatureScore": 30.54,
      "confidence": 42.25,
      "partialContribution": 51.87,
      "fullContribution": 31.82,
      "overall": 52.26
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 17.1,
      "salienceDiagnosis": 21.62,
      "sufficiencyReasonScore": 18.14,
      "cohortIntegrity": 38.58,
      "fullFeatureScore": 54.12,
      "confidence": 26.1,
      "partialContribution": 29.91,
      "fullContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "fss-012",
    "input": {
      "maskCoverage": 0.5,
      "featureSalience": 0.48,
      "cohortFit": 0.53,
      "labelAgreement": 0.53,
      "fullFeatureAccuracy": 0.56,
      "imputationOptimism": 0.37,
      "missingnessPressure": 0.42,
      "leakageRisk": 0.35,
      "sufficiencyBias": "coverage_first",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 38.19,
      "salienceDiagnosis": 51.28,
      "sufficiencyReasonScore": 61.94,
      "cohortIntegrity": 43.82,
      "fullFeatureScore": 28.34,
      "confidence": 42.1,
      "partialContribution": 49.22,
      "fullContribution": 29.7,
      "overall": 49.71
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 13.23,
      "salienceDiagnosis": 19.68,
      "sufficiencyReasonScore": 16.17,
      "cohortIntegrity": 35.76,
      "fullFeatureScore": 34.93,
      "confidence": 24.35,
      "partialContribution": 23.95,
      "fullContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "fss-013",
    "input": {
      "maskCoverage": 0.54,
      "featureSalience": 0.52,
      "cohortFit": 0.56,
      "labelAgreement": 0.57,
      "fullFeatureAccuracy": 0.6,
      "imputationOptimism": 0.39,
      "missingnessPressure": 0.42,
      "leakageRisk": 0.36,
      "sufficiencyBias": "full_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 29.13,
      "salienceDiagnosis": 44.88,
      "sufficiencyReasonScore": 36.95,
      "cohortIntegrity": 32.35,
      "fullFeatureScore": 31.2,
      "confidence": 45.35,
      "partialContribution": 35.81,
      "fullContribution": 32.8,
      "overall": 36.27
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 22.62,
      "salienceDiagnosis": 21.35,
      "sufficiencyReasonScore": 17.8,
      "cohortIntegrity": 37.74,
      "fullFeatureScore": 67.02,
      "confidence": 26.55,
      "partialContribution": 33.31,
      "fullContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "fss-014",
    "input": {
      "maskCoverage": 0.58,
      "featureSalience": 0.56,
      "cohortFit": 0.6,
      "labelAgreement": 0.61,
      "fullFeatureAccuracy": 0.63,
      "imputationOptimism": 0.4,
      "missingnessPressure": 0.43,
      "leakageRisk": 0.36,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 52.62,
      "salienceDiagnosis": 58.53,
      "sufficiencyReasonScore": 57.31,
      "cohortIntegrity": 64.3,
      "fullFeatureScore": 33.07,
      "confidence": 49,
      "partialContribution": 57.92,
      "fullContribution": 34.8,
      "overall": 57.76
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 20.03,
      "salienceDiagnosis": 22.2,
      "sufficiencyReasonScore": 18.59,
      "cohortIntegrity": 38.98,
      "fullFeatureScore": 55.96,
      "confidence": 27.85,
      "partialContribution": 31.15,
      "fullContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "fss-015",
    "input": {
      "maskCoverage": 0.62,
      "featureSalience": 0.54,
      "cohortFit": 0.56,
      "labelAgreement": 0.65,
      "fullFeatureAccuracy": 0.67,
      "imputationOptimism": 0.36,
      "missingnessPressure": 0.44,
      "leakageRisk": 0.31,
      "sufficiencyBias": "mask_strict",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 45.9,
      "salienceDiagnosis": 58.35,
      "sufficiencyReasonScore": 42.52,
      "cohortIntegrity": 73.14,
      "fullFeatureScore": 34.55,
      "confidence": 49.6,
      "partialContribution": 53.93,
      "fullContribution": 36.22,
      "overall": 54.74
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 9.43,
      "salienceDiagnosis": 21.14,
      "sufficiencyReasonScore": 17.93,
      "cohortIntegrity": 39.27,
      "fullFeatureScore": 38.2,
      "confidence": 27.75,
      "partialContribution": 25.19,
      "fullContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "fss-016",
    "input": {
      "maskCoverage": 0.58,
      "featureSalience": 0.59,
      "cohortFit": 0.6,
      "labelAgreement": 0.6,
      "fullFeatureAccuracy": 0.63,
      "imputationOptimism": 0.37,
      "missingnessPressure": 0.36,
      "leakageRisk": 0.32,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 54.46,
      "salienceDiagnosis": 60.67,
      "sufficiencyReasonScore": 57.87,
      "cohortIntegrity": 65.05,
      "fullFeatureScore": 33.73,
      "confidence": 50.35,
      "partialContribution": 59.24,
      "fullContribution": 35.76,
      "overall": 59.01
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 22.05,
      "salienceDiagnosis": 21.91,
      "sufficiencyReasonScore": 18.56,
      "cohortIntegrity": 38.14,
      "fullFeatureScore": 55.7,
      "confidence": 28.3,
      "partialContribution": 31.27,
      "fullContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "fss-017",
    "input": {
      "maskCoverage": 0.62,
      "featureSalience": 0.63,
      "cohortFit": 0.63,
      "labelAgreement": 0.64,
      "fullFeatureAccuracy": 0.67,
      "imputationOptimism": 0.39,
      "missingnessPressure": 0.37,
      "leakageRisk": 0.33,
      "sufficiencyBias": "coverage_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 48.43,
      "salienceDiagnosis": 64.28,
      "sufficiencyReasonScore": 76.01,
      "cohortIntegrity": 52.45,
      "fullFeatureScore": 36.41,
      "confidence": 53.6,
      "partialContribution": 60.84,
      "fullContribution": 38.61,
      "overall": 60.84
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 18.73,
      "salienceDiagnosis": 23.42,
      "sufficiencyReasonScore": 20,
      "cohortIntegrity": 40.11,
      "fullFeatureScore": 39.86,
      "confidence": 30.3,
      "partialContribution": 28.42,
      "fullContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "fss-018",
    "input": {
      "maskCoverage": 0.66,
      "featureSalience": 0.61,
      "cohortFit": 0.67,
      "labelAgreement": 0.68,
      "fullFeatureAccuracy": 0.7,
      "imputationOptimism": 0.34,
      "missingnessPressure": 0.38,
      "leakageRisk": 0.27,
      "sufficiencyBias": "full_first",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 38.33,
      "salienceDiagnosis": 54.13,
      "sufficiencyReasonScore": 45.88,
      "cohortIntegrity": 39.79,
      "fullFeatureScore": 37.08,
      "confidence": 56.35,
      "partialContribution": 44.56,
      "fullContribution": 39.16,
      "overall": 44.59
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 28.36,
      "salienceDiagnosis": 21.66,
      "sufficiencyReasonScore": 18.31,
      "cohortIntegrity": 39.67,
      "fullFeatureScore": 74.27,
      "confidence": 29.5,
      "partialContribution": 36.45,
      "fullContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "fss-019",
    "input": {
      "maskCoverage": 0.7,
      "featureSalience": 0.65,
      "cohortFit": 0.7,
      "labelAgreement": 0.72,
      "fullFeatureAccuracy": 0.74,
      "imputationOptimism": 0.36,
      "missingnessPressure": 0.38,
      "leakageRisk": 0.28,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 63.81,
      "salienceDiagnosis": 67.74,
      "sufficiencyReasonScore": 69.47,
      "cohortIntegrity": 73.95,
      "fullFeatureScore": 39.94,
      "confidence": 59.6,
      "partialContribution": 68.57,
      "fullContribution": 42.25,
      "overall": 67.83
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 26.25,
      "salienceDiagnosis": 23.32,
      "sufficiencyReasonScore": 19.92,
      "cohortIntegrity": 41.65,
      "fullFeatureScore": 62.07,
      "confidence": 31.7,
      "partialContribution": 34.64,
      "fullContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "fss-020",
    "input": {
      "maskCoverage": 0.66,
      "featureSalience": 0.7,
      "cohortFit": 0.66,
      "labelAgreement": 0.68,
      "fullFeatureAccuracy": 0.7,
      "imputationOptimism": 0.37,
      "missingnessPressure": 0.31,
      "leakageRisk": 0.29,
      "sufficiencyBias": "mask_strict",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 52.86,
      "salienceDiagnosis": 70.06,
      "sufficiencyReasonScore": 46.45,
      "cohortIntegrity": 85.3,
      "fullFeatureScore": 38.94,
      "confidence": 58.35,
      "partialContribution": 62.33,
      "fullContribution": 41.54,
      "overall": 62.59
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 13.66,
      "salienceDiagnosis": 23.93,
      "sufficiencyReasonScore": 20.75,
      "cohortIntegrity": 40.51,
      "fullFeatureScore": 40.86,
      "confidence": 32.05,
      "partialContribution": 27.94,
      "fullContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "fss-021",
    "input": {
      "maskCoverage": 0.7,
      "featureSalience": 0.68,
      "cohortFit": 0.7,
      "labelAgreement": 0.72,
      "fullFeatureAccuracy": 0.73,
      "imputationOptimism": 0.33,
      "missingnessPressure": 0.31,
      "leakageRisk": 0.24,
      "sufficiencyBias": "balanced",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 65.6,
      "salienceDiagnosis": 69.88,
      "sufficiencyReasonScore": 70.62,
      "cohortIntegrity": 74.7,
      "fullFeatureScore": 39.99,
      "confidence": 60.95,
      "partialContribution": 70.03,
      "fullContribution": 42.54,
      "overall": 69.08
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 27.89,
      "salienceDiagnosis": 22.72,
      "sufficiencyReasonScore": 19.62,
      "cohortIntegrity": 40.35,
      "fullFeatureScore": 61.19,
      "confidence": 31.8,
      "partialContribution": 34.35,
      "fullContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "fss-022",
    "input": {
      "maskCoverage": 0.74,
      "featureSalience": 0.72,
      "cohortFit": 0.73,
      "labelAgreement": 0.76,
      "fullFeatureAccuracy": 0.77,
      "imputationOptimism": 0.34,
      "missingnessPressure": 0.32,
      "leakageRisk": 0.25,
      "sufficiencyBias": "coverage_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 57.62,
      "salienceDiagnosis": 73.52,
      "sufficiencyReasonScore": 91.49,
      "cohortIntegrity": 59.58,
      "fullFeatureScore": 42.47,
      "confidence": 64.35,
      "partialContribution": 71.35,
      "fullContribution": 45.15,
      "overall": 70.63
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 24.57,
      "salienceDiagnosis": 23.79,
      "sufficiencyReasonScore": 20.63,
      "cohortIntegrity": 42.05,
      "fullFeatureScore": 42.21,
      "confidence": 33.35,
      "partialContribution": 30.65,
      "fullContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "fss-023",
    "input": {
      "maskCoverage": 0.79,
      "featureSalience": 0.76,
      "cohortFit": 0.77,
      "labelAgreement": 0.8,
      "fullFeatureAccuracy": 0.81,
      "imputationOptimism": 0.36,
      "missingnessPressure": 0.33,
      "leakageRisk": 0.25,
      "sufficiencyBias": "full_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 49.04,
      "salienceDiagnosis": 67.38,
      "sufficiencyReasonScore": 54.82,
      "cohortIntegrity": 48.57,
      "fullFeatureScore": 45.16,
      "confidence": 68.25,
      "partialContribution": 54.96,
      "fullContribution": 48.03,
      "overall": 54.71
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 33.86,
      "salienceDiagnosis": 25.25,
      "sufficiencyReasonScore": 22.05,
      "cohortIntegrity": 43.92,
      "fullFeatureScore": 84.72,
      "confidence": 35.45,
      "partialContribution": 41.96,
      "fullContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "fss-024",
    "input": {
      "maskCoverage": 0.75,
      "featureSalience": 0.75,
      "cohortFit": 0.81,
      "labelAgreement": 0.76,
      "fullFeatureAccuracy": 0.77,
      "imputationOptimism": 0.31,
      "missingnessPressure": 0.25,
      "leakageRisk": 0.2,
      "sufficiencyBias": "balanced",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 71.55,
      "salienceDiagnosis": 75.91,
      "sufficiencyReasonScore": 75.74,
      "cohortIntegrity": 83.36,
      "fullFeatureScore": 43.13,
      "confidence": 68.1,
      "partialContribution": 76.37,
      "fullContribution": 46.07,
      "overall": 74.92
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 31.21,
      "salienceDiagnosis": 23.36,
      "sufficiencyReasonScore": 20.13,
      "cohortIntegrity": 41.11,
      "fullFeatureScore": 63.65,
      "confidence": 33.9,
      "partialContribution": 35.89,
      "fullContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "fss-025",
    "input": {
      "maskCoverage": 0.79,
      "featureSalience": 0.79,
      "cohortFit": 0.77,
      "labelAgreement": 0.8,
      "fullFeatureAccuracy": 0.8,
      "imputationOptimism": 0.33,
      "missingnessPressure": 0.26,
      "leakageRisk": 0.21,
      "sufficiencyBias": "mask_strict",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 62.51,
      "salienceDiagnosis": 79.52,
      "sufficiencyReasonScore": 55.93,
      "cohortIntegrity": 97.81,
      "fullFeatureScore": 45.2,
      "confidence": 69.6,
      "partialContribution": 72.52,
      "fullContribution": 48.27,
      "overall": 72.16
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 19.5,
      "salienceDiagnosis": 24.6,
      "sufficiencyReasonScore": 21.69,
      "cohortIntegrity": 42.63,
      "fullFeatureScore": 43.52,
      "confidence": 35.55,
      "partialContribution": 30.39,
      "fullContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "fss-026",
    "input": {
      "maskCoverage": 0.83,
      "featureSalience": 0.83,
      "cohortFit": 0.8,
      "labelAgreement": 0.83,
      "fullFeatureAccuracy": 0.84,
      "imputationOptimism": 0.34,
      "missingnessPressure": 0.27,
      "leakageRisk": 0.22,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 78.52,
      "salienceDiagnosis": 83.17,
      "sufficiencyReasonScore": 82.25,
      "cohortIntegrity": 86,
      "fullFeatureScore": 47.68,
      "confidence": 73,
      "partialContribution": 82.33,
      "fullContribution": 50.87,
      "overall": 80.67
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 33.17,
      "salienceDiagnosis": 25.67,
      "sufficiencyReasonScore": 22.7,
      "cohortIntegrity": 44.32,
      "fullFeatureScore": 68.8,
      "confidence": 37.1,
      "partialContribution": 38.93,
      "fullContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "fss-027",
    "input": {
      "maskCoverage": 0.87,
      "featureSalience": 0.81,
      "cohortFit": 0.84,
      "labelAgreement": 0.87,
      "fullFeatureAccuracy": 0.88,
      "imputationOptimism": 0.3,
      "missingnessPressure": 0.27,
      "leakageRisk": 0.17,
      "sufficiencyBias": "coverage_first",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 67.26,
      "salienceDiagnosis": 82.98,
      "sufficiencyReasonScore": 100,
      "cohortIntegrity": 67.17,
      "fullFeatureScore": 49.35,
      "confidence": 75.6,
      "partialContribution": 80.18,
      "fullContribution": 52.5,
      "overall": 79.2
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 30.78,
      "salienceDiagnosis": 24.7,
      "sufficiencyReasonScore": 21.75,
      "cohortIntegrity": 44.62,
      "fullFeatureScore": 45.22,
      "confidence": 37.2,
      "partialContribution": 33.41,
      "fullContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "fss-028",
    "input": {
      "maskCoverage": 0.83,
      "featureSalience": 0.86,
      "cohortFit": 0.87,
      "labelAgreement": 0.83,
      "fullFeatureAccuracy": 0.84,
      "imputationOptimism": 0.31,
      "missingnessPressure": 0.2,
      "leakageRisk": 0.17,
      "sufficiencyBias": "full_first",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 54.87,
      "salienceDiagnosis": 75.3,
      "sufficiencyReasonScore": 59.19,
      "cohortIntegrity": 54.75,
      "fullFeatureScore": 48.34,
      "confidence": 76.1,
      "partialContribution": 60.96,
      "fullContribution": 51.73,
      "overall": 60.3
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 38.81,
      "salienceDiagnosis": 25.25,
      "sufficiencyReasonScore": 22.17,
      "cohortIntegrity": 43.48,
      "fullFeatureScore": 86.95,
      "confidence": 37.65,
      "partialContribution": 43.33,
      "fullContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "fss-029",
    "input": {
      "maskCoverage": 0.87,
      "featureSalience": 0.9,
      "cohortFit": 0.91,
      "labelAgreement": 0.87,
      "fullFeatureAccuracy": 0.87,
      "imputationOptimism": 0.33,
      "missingnessPressure": 0.2,
      "leakageRisk": 0.18,
      "sufficiencyBias": "balanced",
      "profile": "partial_observation"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 83.89,
      "salienceDiagnosis": 88.91,
      "sufficiencyReasonScore": 87.12,
      "cohortIntegrity": 94.51,
      "fullFeatureScore": 50.59,
      "confidence": 79.6,
      "partialContribution": 88.34,
      "fullContribution": 54.16,
      "overall": 86.19
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 36.33,
      "salienceDiagnosis": 26.6,
      "sufficiencyReasonScore": 23.46,
      "cohortIntegrity": 45,
      "fullFeatureScore": 71.06,
      "confidence": 39.5,
      "partialContribution": 40.49,
      "fullContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "fss-030",
    "input": {
      "maskCoverage": 0.91,
      "featureSalience": 0.88,
      "cohortFit": 0.87,
      "labelAgreement": 0.91,
      "fullFeatureAccuracy": 0.91,
      "imputationOptimism": 0.28,
      "missingnessPressure": 0.21,
      "leakageRisk": 0.13,
      "sufficiencyBias": "mask_strict",
      "profile": "full_feature"
    },
    "expectedPartialObservation": {
      "mode": "partial_observation",
      "coverageDiagnosis": 71.59,
      "salienceDiagnosis": 88.77,
      "sufficiencyReasonScore": 64.69,
      "cohortIntegrity": 100,
      "fullFeatureScore": 51.88,
      "confidence": 80.35,
      "partialContribution": 80.03,
      "fullContribution": 55.31,
      "overall": 79.58
    },
    "expectedFullFeature": {
      "mode": "full_feature",
      "coverageDiagnosis": 25.72,
      "salienceDiagnosis": 25.06,
      "sufficiencyReasonScore": 22.34,
      "cohortIntegrity": 45.02,
      "fullFeatureScore": 46.21,
      "confidence": 38.95,
      "partialContribution": 32.87,
      "fullContribution": 50.68,
      "overall": 44.3
    }
  }
];
