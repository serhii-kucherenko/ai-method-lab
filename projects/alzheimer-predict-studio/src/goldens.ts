import type { PredictInput, PredictQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PredictInput;
  expectedImputationFree: PredictQuality;
  expectedImputeThenPredict: PredictQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "aps-001",
    "input": {
      "ageNorm": 0.19,
      "cognitiveDecline": 0.21,
      "imagingSignal": 0.18,
      "biomarkerSignal": 0.19,
      "missingnessRate": 0.66,
      "missingnessMaskQuality": 0.19,
      "calibrationPrior": 0.16,
      "featureCompleteness": 0.19,
      "temporalSpan": 0.2,
      "comorbidityLoad": 0.64,
      "modality": "imaging",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 39.36,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 6.15,
      "discrimination": 33.49,
      "calibration": 0,
      "overall": 13.8
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 36.89,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 36.89,
      "calibration": 0,
      "overall": 21.4
    }
  },
  {
    "id": "aps-002",
    "input": {
      "ageNorm": 0.23,
      "cognitiveDecline": 0.24,
      "imagingSignal": 0.22,
      "biomarkerSignal": 0.23,
      "missingnessRate": 0.66,
      "missingnessMaskQuality": 0.23,
      "calibrationPrior": 0.2,
      "featureCompleteness": 0.23,
      "temporalSpan": 0.23,
      "comorbidityLoad": 0.64,
      "modality": "mixed",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 42.77,
      "uncertaintyQuality": 0.91,
      "missingnessHonesty": 9.1,
      "discrimination": 36.73,
      "calibration": 0,
      "overall": 15.8
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 38.88,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 38.91,
      "calibration": 0,
      "overall": 22.56
    }
  },
  {
    "id": "aps-003",
    "input": {
      "ageNorm": 0.28,
      "cognitiveDecline": 0.28,
      "imagingSignal": 0.21,
      "biomarkerSignal": 0.27,
      "missingnessRate": 0.6,
      "missingnessMaskQuality": 0.28,
      "calibrationPrior": 0.24,
      "featureCompleteness": 0.28,
      "temporalSpan": 0.27,
      "comorbidityLoad": 0.64,
      "modality": "biomarker",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 51.8,
      "uncertaintyQuality": 49.12,
      "missingnessHonesty": 51.3,
      "discrimination": 45.86,
      "calibration": 53.12,
      "overall": 50.36
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 39.61,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 39.04,
      "calibration": 0,
      "overall": 22.8
    }
  },
  {
    "id": "aps-004",
    "input": {
      "ageNorm": 0.24,
      "cognitiveDecline": 0.32,
      "imagingSignal": 0.25,
      "biomarkerSignal": 0.24,
      "missingnessRate": 0.6,
      "missingnessMaskQuality": 0.24,
      "calibrationPrior": 0.28,
      "featureCompleteness": 0.24,
      "temporalSpan": 0.31,
      "comorbidityLoad": 0.56,
      "modality": "cognitive",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 42.87,
      "uncertaintyQuality": 6.21,
      "missingnessHonesty": 11.31,
      "discrimination": 37.29,
      "calibration": 0,
      "overall": 17.66
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 39.92,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 39.03,
      "calibration": 0,
      "overall": 22.89
    }
  },
  {
    "id": "aps-005",
    "input": {
      "ageNorm": 0.29,
      "cognitiveDecline": 0.28,
      "imagingSignal": 0.29,
      "biomarkerSignal": 0.28,
      "missingnessRate": 0.6,
      "missingnessMaskQuality": 0.29,
      "calibrationPrior": 0.25,
      "featureCompleteness": 0.28,
      "temporalSpan": 0.35,
      "comorbidityLoad": 0.56,
      "modality": "tabular",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 44.32,
      "uncertaintyQuality": 7.52,
      "missingnessHonesty": 14.74,
      "discrimination": 39.27,
      "calibration": 0,
      "overall": 19.31
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 40.37,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 40.4,
      "calibration": 0,
      "overall": 23.42
    }
  },
  {
    "id": "aps-006",
    "input": {
      "ageNorm": 0.33,
      "cognitiveDecline": 0.32,
      "imagingSignal": 0.28,
      "biomarkerSignal": 0.32,
      "missingnessRate": 0.54,
      "missingnessMaskQuality": 0.33,
      "calibrationPrior": 0.29,
      "featureCompleteness": 0.32,
      "temporalSpan": 0.29,
      "comorbidityLoad": 0.57,
      "modality": "imaging",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 57.11,
      "uncertaintyQuality": 55.91,
      "missingnessHonesty": 57.35,
      "discrimination": 50.05,
      "calibration": 60.23,
      "overall": 56.37
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 40.8,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 40.22,
      "calibration": 0,
      "overall": 23.49
    }
  },
  {
    "id": "aps-007",
    "input": {
      "ageNorm": 0.37,
      "cognitiveDecline": 0.36,
      "imagingSignal": 0.32,
      "biomarkerSignal": 0.36,
      "missingnessRate": 0.54,
      "missingnessMaskQuality": 0.37,
      "calibrationPrior": 0.33,
      "featureCompleteness": 0.37,
      "temporalSpan": 0.33,
      "comorbidityLoad": 0.57,
      "modality": "mixed",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 51.8,
      "uncertaintyQuality": 16.59,
      "missingnessHonesty": 23.96,
      "discrimination": 45.99,
      "calibration": 6.24,
      "overall": 27.18
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 43.22,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 42.57,
      "calibration": 0,
      "overall": 24.87
    }
  },
  {
    "id": "aps-008",
    "input": {
      "ageNorm": 0.34,
      "cognitiveDecline": 0.39,
      "imagingSignal": 0.36,
      "biomarkerSignal": 0.32,
      "missingnessRate": 0.54,
      "missingnessMaskQuality": 0.34,
      "calibrationPrior": 0.37,
      "featureCompleteness": 0.33,
      "temporalSpan": 0.37,
      "comorbidityLoad": 0.49,
      "modality": "biomarker",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 51.51,
      "uncertaintyQuality": 16.31,
      "missingnessHonesty": 21.62,
      "discrimination": 45.16,
      "calibration": 6.87,
      "overall": 26.54
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 43.21,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 42.36,
      "calibration": 0,
      "overall": 24.81
    }
  },
  {
    "id": "aps-009",
    "input": {
      "ageNorm": 0.38,
      "cognitiveDecline": 0.43,
      "imagingSignal": 0.35,
      "biomarkerSignal": 0.37,
      "missingnessRate": 0.48,
      "missingnessMaskQuality": 0.38,
      "calibrationPrior": 0.41,
      "featureCompleteness": 0.37,
      "temporalSpan": 0.4,
      "comorbidityLoad": 0.49,
      "modality": "cognitive",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 60.7,
      "uncertaintyQuality": 60.17,
      "missingnessHonesty": 60.04,
      "discrimination": 53.99,
      "calibration": 64.04,
      "overall": 60.02
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 43.66,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 42.22,
      "calibration": 0,
      "overall": 24.89
    }
  },
  {
    "id": "aps-010",
    "input": {
      "ageNorm": 0.43,
      "cognitiveDecline": 0.39,
      "imagingSignal": 0.39,
      "biomarkerSignal": 0.41,
      "missingnessRate": 0.48,
      "missingnessMaskQuality": 0.43,
      "calibrationPrior": 0.37,
      "featureCompleteness": 0.41,
      "temporalSpan": 0.44,
      "comorbidityLoad": 0.49,
      "modality": "tabular",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 52.56,
      "uncertaintyQuality": 21.62,
      "missingnessHonesty": 28.74,
      "discrimination": 47.47,
      "calibration": 11.43,
      "overall": 30.85
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 44.09,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 43.55,
      "calibration": 0,
      "overall": 25.41
    }
  },
  {
    "id": "aps-011",
    "input": {
      "ageNorm": 0.47,
      "cognitiveDecline": 0.43,
      "imagingSignal": 0.43,
      "biomarkerSignal": 0.45,
      "missingnessRate": 0.48,
      "missingnessMaskQuality": 0.47,
      "calibrationPrior": 0.41,
      "featureCompleteness": 0.46,
      "temporalSpan": 0.48,
      "comorbidityLoad": 0.49,
      "modality": "imaging",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 57.56,
      "uncertaintyQuality": 25.95,
      "missingnessHonesty": 32.98,
      "discrimination": 52.47,
      "calibration": 15.56,
      "overall": 35.35
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 46.5,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 45.88,
      "calibration": 0,
      "overall": 26.78
    }
  },
  {
    "id": "aps-012",
    "input": {
      "ageNorm": 0.44,
      "cognitiveDecline": 0.47,
      "imagingSignal": 0.42,
      "biomarkerSignal": 0.41,
      "missingnessRate": 0.42,
      "missingnessMaskQuality": 0.44,
      "calibrationPrior": 0.45,
      "featureCompleteness": 0.42,
      "temporalSpan": 0.43,
      "comorbidityLoad": 0.41,
      "modality": "mixed",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 70.47,
      "uncertaintyQuality": 73.68,
      "missingnessHonesty": 71.43,
      "discrimination": 62.67,
      "calibration": 79.51,
      "overall": 72.01
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 44.89,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 43.48,
      "calibration": 0,
      "overall": 25.61
    }
  },
  {
    "id": "aps-013",
    "input": {
      "ageNorm": 0.48,
      "cognitiveDecline": 0.51,
      "imagingSignal": 0.46,
      "biomarkerSignal": 0.45,
      "missingnessRate": 0.42,
      "missingnessMaskQuality": 0.48,
      "calibrationPrior": 0.49,
      "featureCompleteness": 0.46,
      "temporalSpan": 0.46,
      "comorbidityLoad": 0.41,
      "modality": "biomarker",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 60.34,
      "uncertaintyQuality": 30.99,
      "missingnessHonesty": 36,
      "discrimination": 53.84,
      "calibration": 22.15,
      "overall": 39.26
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 46.99,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 45.48,
      "calibration": 0,
      "overall": 26.8
    }
  },
  {
    "id": "aps-014",
    "input": {
      "ageNorm": 0.52,
      "cognitiveDecline": 0.55,
      "imagingSignal": 0.5,
      "biomarkerSignal": 0.5,
      "missingnessRate": 0.42,
      "missingnessMaskQuality": 0.52,
      "calibrationPrior": 0.53,
      "featureCompleteness": 0.51,
      "temporalSpan": 0.5,
      "comorbidityLoad": 0.41,
      "modality": "cognitive",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 60.3,
      "uncertaintyQuality": 31.48,
      "missingnessHonesty": 36.31,
      "discrimination": 54.21,
      "calibration": 22.61,
      "overall": 39.59
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 49.44,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 0,
      "discrimination": 47.84,
      "calibration": 0,
      "overall": 28.2
    }
  },
  {
    "id": "aps-015",
    "input": {
      "ageNorm": 0.57,
      "cognitiveDecline": 0.51,
      "imagingSignal": 0.49,
      "biomarkerSignal": 0.54,
      "missingnessRate": 0.36,
      "missingnessMaskQuality": 0.57,
      "calibrationPrior": 0.5,
      "featureCompleteness": 0.55,
      "temporalSpan": 0.54,
      "comorbidityLoad": 0.41,
      "modality": "tabular",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 72.84,
      "uncertaintyQuality": 77.8,
      "missingnessHonesty": 78.52,
      "discrimination": 66.99,
      "calibration": 80.65,
      "overall": 75.91
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 48.03,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 1.85,
      "discrimination": 46.85,
      "calibration": 0,
      "overall": 27.69
    }
  },
  {
    "id": "aps-016",
    "input": {
      "ageNorm": 0.53,
      "cognitiveDecline": 0.55,
      "imagingSignal": 0.53,
      "biomarkerSignal": 0.5,
      "missingnessRate": 0.36,
      "missingnessMaskQuality": 0.53,
      "calibrationPrior": 0.54,
      "featureCompleteness": 0.51,
      "temporalSpan": 0.57,
      "comorbidityLoad": 0.34,
      "modality": "imaging",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 64.96,
      "uncertaintyQuality": 38.57,
      "missingnessHonesty": 43.07,
      "discrimination": 58.96,
      "calibration": 29.78,
      "overall": 45.81
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 48.22,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 1.38,
      "discrimination": 46.73,
      "calibration": 0,
      "overall": 27.66
    }
  },
  {
    "id": "aps-017",
    "input": {
      "ageNorm": 0.58,
      "cognitiveDecline": 0.58,
      "imagingSignal": 0.58,
      "biomarkerSignal": 0.54,
      "missingnessRate": 0.36,
      "missingnessMaskQuality": 0.58,
      "calibrationPrior": 0.58,
      "featureCompleteness": 0.55,
      "temporalSpan": 0.61,
      "comorbidityLoad": 0.34,
      "modality": "mixed",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 69.12,
      "uncertaintyQuality": 42.74,
      "missingnessHonesty": 47.14,
      "discrimination": 62.94,
      "calibration": 34,
      "overall": 49.94
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 50.09,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 2.14,
      "discrimination": 48.7,
      "calibration": 0,
      "overall": 28.85
    }
  },
  {
    "id": "aps-018",
    "input": {
      "ageNorm": 0.62,
      "cognitiveDecline": 0.62,
      "imagingSignal": 0.56,
      "biomarkerSignal": 0.59,
      "missingnessRate": 0.3,
      "missingnessMaskQuality": 0.62,
      "calibrationPrior": 0.62,
      "featureCompleteness": 0.6,
      "temporalSpan": 0.56,
      "comorbidityLoad": 0.34,
      "modality": "biomarker",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 82.21,
      "uncertaintyQuality": 89.54,
      "missingnessHonesty": 86.5,
      "discrimination": 74.69,
      "calibration": 94.83,
      "overall": 86.23
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 50.58,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 4.99,
      "discrimination": 48.58,
      "calibration": 0,
      "overall": 29.24
    }
  },
  {
    "id": "aps-019",
    "input": {
      "ageNorm": 0.66,
      "cognitiveDecline": 0.66,
      "imagingSignal": 0.6,
      "biomarkerSignal": 0.63,
      "missingnessRate": 0.3,
      "missingnessMaskQuality": 0.66,
      "calibrationPrior": 0.66,
      "featureCompleteness": 0.64,
      "temporalSpan": 0.59,
      "comorbidityLoad": 0.34,
      "modality": "cognitive",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 68.38,
      "uncertaintyQuality": 45.49,
      "missingnessHonesty": 50.1,
      "discrimination": 62.24,
      "calibration": 37.16,
      "overall": 51.64
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 52.64,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 5.65,
      "discrimination": 50.55,
      "calibration": 0,
      "overall": 30.47
    }
  },
  {
    "id": "aps-020",
    "input": {
      "ageNorm": 0.63,
      "cognitiveDecline": 0.62,
      "imagingSignal": 0.65,
      "biomarkerSignal": 0.59,
      "missingnessRate": 0.3,
      "missingnessMaskQuality": 0.63,
      "calibrationPrior": 0.62,
      "featureCompleteness": 0.6,
      "temporalSpan": 0.63,
      "comorbidityLoad": 0.26,
      "modality": "tabular",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 69.13,
      "uncertaintyQuality": 45.22,
      "missingnessHonesty": 49.96,
      "discrimination": 62.64,
      "calibration": 36.45,
      "overall": 51.6
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 51.26,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 5.28,
      "discrimination": 49.89,
      "calibration": 0,
      "overall": 29.85
    }
  },
  {
    "id": "aps-021",
    "input": {
      "ageNorm": 0.67,
      "cognitiveDecline": 0.66,
      "imagingSignal": 0.63,
      "biomarkerSignal": 0.63,
      "missingnessRate": 0.24,
      "missingnessMaskQuality": 0.67,
      "calibrationPrior": 0.66,
      "featureCompleteness": 0.65,
      "temporalSpan": 0.67,
      "comorbidityLoad": 0.26,
      "modality": "imaging",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 87.67,
      "uncertaintyQuality": 97.59,
      "missingnessHonesty": 93.71,
      "discrimination": 80.86,
      "calibration": 100,
      "overall": 92.76
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 51.65,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 8.27,
      "discrimination": 49.69,
      "calibration": 0,
      "overall": 30.2
    }
  },
  {
    "id": "aps-022",
    "input": {
      "ageNorm": 0.72,
      "cognitiveDecline": 0.7,
      "imagingSignal": 0.67,
      "biomarkerSignal": 0.67,
      "missingnessRate": 0.24,
      "missingnessMaskQuality": 0.72,
      "calibrationPrior": 0.7,
      "featureCompleteness": 0.69,
      "temporalSpan": 0.71,
      "comorbidityLoad": 0.26,
      "modality": "mixed",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 78,
      "uncertaintyQuality": 58.18,
      "missingnessHonesty": 62.04,
      "discrimination": 72.16,
      "calibration": 50.09,
      "overall": 63.22
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 53.61,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 9.01,
      "discrimination": 51.55,
      "calibration": 0.88,
      "overall": 31.55
    }
  },
  {
    "id": "aps-023",
    "input": {
      "ageNorm": 0.76,
      "cognitiveDecline": 0.74,
      "imagingSignal": 0.72,
      "biomarkerSignal": 0.72,
      "missingnessRate": 0.24,
      "missingnessMaskQuality": 0.76,
      "calibrationPrior": 0.74,
      "featureCompleteness": 0.73,
      "temporalSpan": 0.74,
      "comorbidityLoad": 0.26,
      "modality": "biomarker",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 79.03,
      "uncertaintyQuality": 58.57,
      "missingnessHonesty": 62.61,
      "discrimination": 72.97,
      "calibration": 50.3,
      "overall": 63.79
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 55.76,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 9.66,
      "discrimination": 53.67,
      "calibration": 2.17,
      "overall": 33.11
    }
  },
  {
    "id": "aps-024",
    "input": {
      "ageNorm": 0.73,
      "cognitiveDecline": 0.77,
      "imagingSignal": 0.7,
      "biomarkerSignal": 0.68,
      "missingnessRate": 0.18,
      "missingnessMaskQuality": 0.73,
      "calibrationPrior": 0.78,
      "featureCompleteness": 0.69,
      "temporalSpan": 0.69,
      "comorbidityLoad": 0.18,
      "modality": "cognitive",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 89.56,
      "uncertaintyQuality": 97.98,
      "missingnessHonesty": 94.11,
      "discrimination": 81.44,
      "calibration": 100,
      "overall": 93.37
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 53.67,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 11.32,
      "discrimination": 50.91,
      "calibration": 3.86,
      "overall": 32.2
    }
  },
  {
    "id": "aps-025",
    "input": {
      "ageNorm": 0.77,
      "cognitiveDecline": 0.74,
      "imagingSignal": 0.74,
      "biomarkerSignal": 0.72,
      "missingnessRate": 0.18,
      "missingnessMaskQuality": 0.77,
      "calibrationPrior": 0.75,
      "featureCompleteness": 0.74,
      "temporalSpan": 0.73,
      "comorbidityLoad": 0.18,
      "modality": "tabular",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 77.51,
      "uncertaintyQuality": 59.82,
      "missingnessHonesty": 64.16,
      "discrimination": 71.34,
      "calibration": 51.57,
      "overall": 64.15
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 54.64,
      "uncertaintyQuality": 0,
      "missingnessHonesty": 12.06,
      "discrimination": 52.62,
      "calibration": 4.26,
      "overall": 33.14
    }
  },
  {
    "id": "aps-026",
    "input": {
      "ageNorm": 0.81,
      "cognitiveDecline": 0.77,
      "imagingSignal": 0.79,
      "biomarkerSignal": 0.76,
      "missingnessRate": 0.18,
      "missingnessMaskQuality": 0.81,
      "calibrationPrior": 0.79,
      "featureCompleteness": 0.78,
      "temporalSpan": 0.76,
      "comorbidityLoad": 0.19,
      "modality": "imaging",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 83.37,
      "uncertaintyQuality": 65.82,
      "missingnessHonesty": 69.35,
      "discrimination": 76.78,
      "calibration": 58.03,
      "overall": 69.95
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 56.49,
      "uncertaintyQuality": 0.13,
      "missingnessHonesty": 12.7,
      "discrimination": 54.56,
      "calibration": 5.52,
      "overall": 34.57
    }
  },
  {
    "id": "aps-027",
    "input": {
      "ageNorm": 0.86,
      "cognitiveDecline": 0.81,
      "imagingSignal": 0.77,
      "biomarkerSignal": 0.8,
      "missingnessRate": 0.12,
      "missingnessMaskQuality": 0.86,
      "calibrationPrior": 0.83,
      "featureCompleteness": 0.82,
      "temporalSpan": 0.8,
      "comorbidityLoad": 0.19,
      "modality": "mixed",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 100,
      "uncertaintyQuality": 100,
      "missingnessHonesty": 100,
      "discrimination": 96.12,
      "calibration": 100,
      "overall": 99.38
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 56.23,
      "uncertaintyQuality": 3.03,
      "missingnessHonesty": 15.58,
      "discrimination": 53.72,
      "calibration": 8.54,
      "overall": 35.49
    }
  },
  {
    "id": "aps-028",
    "input": {
      "ageNorm": 0.82,
      "cognitiveDecline": 0.85,
      "imagingSignal": 0.81,
      "biomarkerSignal": 0.77,
      "missingnessRate": 0.12,
      "missingnessMaskQuality": 0.82,
      "calibrationPrior": 0.87,
      "featureCompleteness": 0.78,
      "temporalSpan": 0.84,
      "comorbidityLoad": 0.11,
      "modality": "biomarker",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 84.93,
      "uncertaintyQuality": 71.12,
      "missingnessHonesty": 72.68,
      "discrimination": 78.54,
      "calibration": 64.35,
      "overall": 73.78
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 55.99,
      "uncertaintyQuality": 3.31,
      "missingnessHonesty": 15.15,
      "discrimination": 53.21,
      "calibration": 8.4,
      "overall": 35.23
    }
  },
  {
    "id": "aps-029",
    "input": {
      "ageNorm": 0.87,
      "cognitiveDecline": 0.89,
      "imagingSignal": 0.86,
      "biomarkerSignal": 0.81,
      "missingnessRate": 0.12,
      "missingnessMaskQuality": 0.87,
      "calibrationPrior": 0.91,
      "featureCompleteness": 0.83,
      "temporalSpan": 0.88,
      "comorbidityLoad": 0.11,
      "modality": "cognitive",
      "plan": "impute_then_predict"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 82.39,
      "uncertaintyQuality": 69.39,
      "missingnessHonesty": 71.98,
      "discrimination": 76.7,
      "calibration": 61.91,
      "overall": 71.97
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 57.29,
      "uncertaintyQuality": 4.16,
      "missingnessHonesty": 15.95,
      "discrimination": 54.54,
      "calibration": 9.75,
      "overall": 36.45
    }
  },
  {
    "id": "aps-030",
    "input": {
      "ageNorm": 0.91,
      "cognitiveDecline": 0.85,
      "imagingSignal": 0.84,
      "biomarkerSignal": 0.85,
      "missingnessRate": 0.06,
      "missingnessMaskQuality": 0.91,
      "calibrationPrior": 0.87,
      "featureCompleteness": 0.87,
      "temporalSpan": 0.82,
      "comorbidityLoad": 0.11,
      "modality": "tabular",
      "plan": "imputation_free"
    },
    "expectedImputationFree": {
      "mode": "imputation_free",
      "riskScore": 99.55,
      "uncertaintyQuality": 100,
      "missingnessHonesty": 100,
      "discrimination": 92.76,
      "calibration": 100,
      "overall": 98.76
    },
    "expectedImputeThenPredict": {
      "mode": "impute_then_predict",
      "riskScore": 55.82,
      "uncertaintyQuality": 6.04,
      "missingnessHonesty": 18.54,
      "discrimination": 53.41,
      "calibration": 11.62,
      "overall": 36.56
    }
  }
];
