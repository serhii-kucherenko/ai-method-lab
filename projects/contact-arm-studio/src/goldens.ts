import type { ContactArmInput, ContactArmQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ContactArmInput;
  expectedContactCentric: ContactArmQuality;
  expectedVisionOnly: ContactArmQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cas-001",
    "input": {
      "contactCoverage": 0.29,
      "tactileSalience": 0.25,
      "planFit": 0.28,
      "sensingAgreement": 0.34,
      "visionOnlyAccuracy": 0.39,
      "visionOptimism": 0.45,
      "contactPressure": 0.59,
      "leakageRisk": 0.5,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 22.56,
      "tactileDiagnosis": 30.25,
      "planReasonScore": 27.38,
      "sensingIntegrity": 34.28,
      "visionOnlyScore": 16.4,
      "confidence": 19.35,
      "contactContribution": 28.33,
      "visionContribution": 15.96,
      "overall": 30.1
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 5.76,
      "tactileDiagnosis": 17.09,
      "planReasonScore": 13.13,
      "sensingIntegrity": 32.39,
      "visionOnlyScore": 40.93,
      "confidence": 17.1,
      "contactContribution": 21.86,
      "visionContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "cas-002",
    "input": {
      "contactCoverage": 0.33,
      "tactileSalience": 0.29,
      "planFit": 0.32,
      "sensingAgreement": 0.38,
      "visionOnlyAccuracy": 0.43,
      "visionOptimism": 0.46,
      "contactPressure": 0.6,
      "leakageRisk": 0.51,
      "contactBias": "tactile_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 22.22,
      "tactileDiagnosis": 33.9,
      "planReasonScore": 39.65,
      "sensingIntegrity": 30.06,
      "visionOnlyScore": 18.89,
      "confidence": 23,
      "contactContribution": 31.63,
      "visionContribution": 18.61,
      "overall": 33.29
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 2.43,
      "tactileDiagnosis": 18.22,
      "planReasonScore": 14.16,
      "sensingIntegrity": 34.08,
      "visionOnlyScore": 31.53,
      "confidence": 18.65,
      "contactContribution": 20.08,
      "visionContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "cas-003",
    "input": {
      "contactCoverage": 0.37,
      "tactileSalience": 0.27,
      "planFit": 0.36,
      "sensingAgreement": 0.42,
      "visionOnlyAccuracy": 0.46,
      "visionOptimism": 0.42,
      "contactPressure": 0.6,
      "leakageRisk": 0.46,
      "contactBias": "vision_first",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 12.18,
      "tactileDiagnosis": 23.71,
      "planReasonScore": 23.1,
      "sensingIntegrity": 17.39,
      "visionOnlyScore": 19.94,
      "confidence": 25.6,
      "contactContribution": 19.15,
      "visionContribution": 19.69,
      "overall": 20.25
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 12.17,
      "tactileDiagnosis": 17.1,
      "planReasonScore": 13.13,
      "sensingIntegrity": 33.93,
      "visionOnlyScore": 54.34,
      "confidence": 18.4,
      "contactContribution": 26.13,
      "visionContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "cas-004",
    "input": {
      "contactCoverage": 0.33,
      "tactileSalience": 0.32,
      "planFit": 0.39,
      "sensingAgreement": 0.38,
      "visionOnlyAccuracy": 0.42,
      "visionOptimism": 0.43,
      "contactPressure": 0.53,
      "leakageRisk": 0.46,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 28.09,
      "tactileDiagnosis": 36.03,
      "planReasonScore": 32.42,
      "sensingIntegrity": 42.79,
      "visionOnlyScore": 18.93,
      "confidence": 26.1,
      "contactContribution": 34.44,
      "visionContribution": 19.05,
      "overall": 35.67
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 8.7,
      "tactileDiagnosis": 17.81,
      "planReasonScore": 13.75,
      "sensingIntegrity": 32.79,
      "visionOnlyScore": 42.77,
      "confidence": 18.85,
      "contactContribution": 23.16,
      "visionContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "cas-005",
    "input": {
      "contactCoverage": 0.37,
      "tactileSalience": 0.36,
      "planFit": 0.35,
      "sensingAgreement": 0.42,
      "visionOnlyAccuracy": 0.46,
      "visionOptimism": 0.45,
      "contactPressure": 0.53,
      "leakageRisk": 0.47,
      "contactBias": "contact_strict",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 26.86,
      "tactileDiagnosis": 39.64,
      "planReasonScore": 23.89,
      "sensingIntegrity": 49.01,
      "visionOnlyScore": 21.8,
      "confidence": 27.6,
      "contactContribution": 33.97,
      "visionContribution": 22.19,
      "overall": 35.85
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 0,
      "tactileDiagnosis": 19.51,
      "planReasonScore": 15.76,
      "sensingIntegrity": 34.77,
      "visionOnlyScore": 32.95,
      "confidence": 21.05,
      "contactContribution": 20.6,
      "visionContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "cas-006",
    "input": {
      "contactCoverage": 0.41,
      "tactileSalience": 0.34,
      "planFit": 0.39,
      "sensingAgreement": 0.45,
      "visionOnlyAccuracy": 0.5,
      "visionOptimism": 0.4,
      "contactPressure": 0.54,
      "leakageRisk": 0.42,
      "contactBias": "balanced",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 33.94,
      "tactileDiagnosis": 39.5,
      "planReasonScore": 39.74,
      "sensingIntegrity": 44.49,
      "visionOnlyScore": 23.08,
      "confidence": 30.35,
      "contactContribution": 39.22,
      "visionContribution": 23.38,
      "overall": 40.37
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 11.98,
      "tactileDiagnosis": 18.04,
      "planReasonScore": 14.31,
      "sensingIntegrity": 34.78,
      "visionOnlyScore": 46.72,
      "confidence": 20.5,
      "contactContribution": 25.17,
      "visionContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "cas-007",
    "input": {
      "contactCoverage": 0.45,
      "tactileSalience": 0.38,
      "planFit": 0.42,
      "sensingAgreement": 0.49,
      "visionOnlyAccuracy": 0.53,
      "visionOptimism": 0.42,
      "contactPressure": 0.55,
      "leakageRisk": 0.43,
      "contactBias": "tactile_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 31.59,
      "tactileDiagnosis": 43.11,
      "planReasonScore": 54.51,
      "sensingIntegrity": 37.19,
      "visionOnlyScore": 25.15,
      "confidence": 33.6,
      "contactContribution": 42,
      "visionContribution": 25.64,
      "overall": 43.06
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 8.27,
      "tactileDiagnosis": 19.34,
      "planReasonScore": 15.59,
      "sensingIntegrity": 36.3,
      "visionOnlyScore": 34.2,
      "confidence": 22.15,
      "contactContribution": 22.74,
      "visionContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "cas-008",
    "input": {
      "contactCoverage": 0.41,
      "tactileSalience": 0.43,
      "planFit": 0.46,
      "sensingAgreement": 0.45,
      "visionOnlyAccuracy": 0.49,
      "visionOptimism": 0.43,
      "contactPressure": 0.47,
      "leakageRisk": 0.44,
      "contactBias": "vision_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 19.33,
      "tactileDiagnosis": 35.43,
      "planReasonScore": 27.26,
      "sensingIntegrity": 25.07,
      "visionOnlyScore": 24.32,
      "confidence": 34.35,
      "contactContribution": 26.68,
      "visionContribution": 25.23,
      "overall": 27.42
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 16.4,
      "tactileDiagnosis": 20.18,
      "planReasonScore": 16.31,
      "sensingIntegrity": 35.17,
      "visionOnlyScore": 58.5,
      "confidence": 22.7,
      "contactContribution": 29.31,
      "visionContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "cas-009",
    "input": {
      "contactCoverage": 0.46,
      "tactileSalience": 0.41,
      "planFit": 0.5,
      "sensingAgreement": 0.49,
      "visionOnlyAccuracy": 0.53,
      "visionOptimism": 0.39,
      "contactPressure": 0.48,
      "leakageRisk": 0.38,
      "contactBias": "balanced",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 40.05,
      "tactileDiagnosis": 45.49,
      "planReasonScore": 45.04,
      "sensingIntegrity": 53.15,
      "visionOnlyScore": 25.81,
      "confidence": 37.35,
      "contactContribution": 45.63,
      "visionContribution": 26.69,
      "overall": 46.22
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 14.91,
      "tactileDiagnosis": 19.07,
      "planReasonScore": 15.29,
      "sensingIntegrity": 35.36,
      "visionOnlyScore": 48.88,
      "confidence": 22.7,
      "contactContribution": 26.7,
      "visionContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "cas-010",
    "input": {
      "contactCoverage": 0.5,
      "tactileSalience": 0.45,
      "planFit": 0.46,
      "sensingAgreement": 0.53,
      "visionOnlyAccuracy": 0.57,
      "visionOptimism": 0.4,
      "contactPressure": 0.49,
      "leakageRisk": 0.39,
      "contactBias": "contact_strict",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 36.62,
      "tactileDiagnosis": 49.14,
      "planReasonScore": 33.16,
      "sensingIntegrity": 61.53,
      "visionOnlyScore": 28.29,
      "confidence": 39,
      "contactContribution": 44.14,
      "visionContribution": 29.32,
      "overall": 45.47
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 3.59,
      "tactileDiagnosis": 20.18,
      "planReasonScore": 16.7,
      "sensingIntegrity": 37.06,
      "visionOnlyScore": 35.54,
      "confidence": 24.25,
      "contactContribution": 22.61,
      "visionContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "cas-011",
    "input": {
      "contactCoverage": 0.54,
      "tactileSalience": 0.49,
      "planFit": 0.49,
      "sensingAgreement": 0.57,
      "visionOnlyAccuracy": 0.6,
      "visionOptimism": 0.42,
      "contactPressure": 0.49,
      "leakageRisk": 0.4,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 47.21,
      "tactileDiagnosis": 52.75,
      "planReasonScore": 52.38,
      "sensingIntegrity": 55.79,
      "visionOnlyScore": 30.54,
      "confidence": 42.25,
      "contactContribution": 51.87,
      "visionContribution": 31.82,
      "overall": 52.26
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 17.1,
      "tactileDiagnosis": 21.62,
      "planReasonScore": 18.14,
      "sensingIntegrity": 38.58,
      "visionOnlyScore": 54.12,
      "confidence": 26.1,
      "contactContribution": 29.91,
      "visionContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "cas-012",
    "input": {
      "contactCoverage": 0.5,
      "tactileSalience": 0.48,
      "planFit": 0.53,
      "sensingAgreement": 0.53,
      "visionOnlyAccuracy": 0.56,
      "visionOptimism": 0.37,
      "contactPressure": 0.42,
      "leakageRisk": 0.35,
      "contactBias": "tactile_first",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 38.19,
      "tactileDiagnosis": 51.28,
      "planReasonScore": 61.94,
      "sensingIntegrity": 43.82,
      "visionOnlyScore": 28.34,
      "confidence": 42.1,
      "contactContribution": 49.22,
      "visionContribution": 29.7,
      "overall": 49.71
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 13.23,
      "tactileDiagnosis": 19.68,
      "planReasonScore": 16.17,
      "sensingIntegrity": 35.76,
      "visionOnlyScore": 34.93,
      "confidence": 24.35,
      "contactContribution": 23.95,
      "visionContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "cas-013",
    "input": {
      "contactCoverage": 0.54,
      "tactileSalience": 0.52,
      "planFit": 0.56,
      "sensingAgreement": 0.57,
      "visionOnlyAccuracy": 0.6,
      "visionOptimism": 0.39,
      "contactPressure": 0.42,
      "leakageRisk": 0.36,
      "contactBias": "vision_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 29.13,
      "tactileDiagnosis": 44.88,
      "planReasonScore": 36.95,
      "sensingIntegrity": 32.35,
      "visionOnlyScore": 31.2,
      "confidence": 45.35,
      "contactContribution": 35.81,
      "visionContribution": 32.8,
      "overall": 36.27
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 22.62,
      "tactileDiagnosis": 21.35,
      "planReasonScore": 17.8,
      "sensingIntegrity": 37.74,
      "visionOnlyScore": 67.02,
      "confidence": 26.55,
      "contactContribution": 33.31,
      "visionContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "cas-014",
    "input": {
      "contactCoverage": 0.58,
      "tactileSalience": 0.56,
      "planFit": 0.6,
      "sensingAgreement": 0.61,
      "visionOnlyAccuracy": 0.63,
      "visionOptimism": 0.4,
      "contactPressure": 0.43,
      "leakageRisk": 0.36,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 52.62,
      "tactileDiagnosis": 58.53,
      "planReasonScore": 57.31,
      "sensingIntegrity": 64.3,
      "visionOnlyScore": 33.07,
      "confidence": 49,
      "contactContribution": 57.92,
      "visionContribution": 34.8,
      "overall": 57.76
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 20.03,
      "tactileDiagnosis": 22.2,
      "planReasonScore": 18.59,
      "sensingIntegrity": 38.98,
      "visionOnlyScore": 55.96,
      "confidence": 27.85,
      "contactContribution": 31.15,
      "visionContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "cas-015",
    "input": {
      "contactCoverage": 0.62,
      "tactileSalience": 0.54,
      "planFit": 0.56,
      "sensingAgreement": 0.65,
      "visionOnlyAccuracy": 0.67,
      "visionOptimism": 0.36,
      "contactPressure": 0.44,
      "leakageRisk": 0.31,
      "contactBias": "contact_strict",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 45.9,
      "tactileDiagnosis": 58.35,
      "planReasonScore": 42.52,
      "sensingIntegrity": 73.14,
      "visionOnlyScore": 34.55,
      "confidence": 49.6,
      "contactContribution": 53.93,
      "visionContribution": 36.22,
      "overall": 54.74
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 9.43,
      "tactileDiagnosis": 21.14,
      "planReasonScore": 17.93,
      "sensingIntegrity": 39.27,
      "visionOnlyScore": 38.2,
      "confidence": 27.75,
      "contactContribution": 25.19,
      "visionContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "cas-016",
    "input": {
      "contactCoverage": 0.58,
      "tactileSalience": 0.59,
      "planFit": 0.6,
      "sensingAgreement": 0.6,
      "visionOnlyAccuracy": 0.63,
      "visionOptimism": 0.37,
      "contactPressure": 0.36,
      "leakageRisk": 0.32,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 54.46,
      "tactileDiagnosis": 60.67,
      "planReasonScore": 57.87,
      "sensingIntegrity": 65.05,
      "visionOnlyScore": 33.73,
      "confidence": 50.35,
      "contactContribution": 59.24,
      "visionContribution": 35.76,
      "overall": 59.01
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 22.05,
      "tactileDiagnosis": 21.91,
      "planReasonScore": 18.56,
      "sensingIntegrity": 38.14,
      "visionOnlyScore": 55.7,
      "confidence": 28.3,
      "contactContribution": 31.27,
      "visionContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "cas-017",
    "input": {
      "contactCoverage": 0.62,
      "tactileSalience": 0.63,
      "planFit": 0.63,
      "sensingAgreement": 0.64,
      "visionOnlyAccuracy": 0.67,
      "visionOptimism": 0.39,
      "contactPressure": 0.37,
      "leakageRisk": 0.33,
      "contactBias": "tactile_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 48.43,
      "tactileDiagnosis": 64.28,
      "planReasonScore": 76.01,
      "sensingIntegrity": 52.45,
      "visionOnlyScore": 36.41,
      "confidence": 53.6,
      "contactContribution": 60.84,
      "visionContribution": 38.61,
      "overall": 60.84
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 18.73,
      "tactileDiagnosis": 23.42,
      "planReasonScore": 20,
      "sensingIntegrity": 40.11,
      "visionOnlyScore": 39.86,
      "confidence": 30.3,
      "contactContribution": 28.42,
      "visionContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "cas-018",
    "input": {
      "contactCoverage": 0.66,
      "tactileSalience": 0.61,
      "planFit": 0.67,
      "sensingAgreement": 0.68,
      "visionOnlyAccuracy": 0.7,
      "visionOptimism": 0.34,
      "contactPressure": 0.38,
      "leakageRisk": 0.27,
      "contactBias": "vision_first",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 38.33,
      "tactileDiagnosis": 54.13,
      "planReasonScore": 45.88,
      "sensingIntegrity": 39.79,
      "visionOnlyScore": 37.08,
      "confidence": 56.35,
      "contactContribution": 44.56,
      "visionContribution": 39.16,
      "overall": 44.59
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 28.36,
      "tactileDiagnosis": 21.66,
      "planReasonScore": 18.31,
      "sensingIntegrity": 39.67,
      "visionOnlyScore": 74.27,
      "confidence": 29.5,
      "contactContribution": 36.45,
      "visionContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "cas-019",
    "input": {
      "contactCoverage": 0.7,
      "tactileSalience": 0.65,
      "planFit": 0.7,
      "sensingAgreement": 0.72,
      "visionOnlyAccuracy": 0.74,
      "visionOptimism": 0.36,
      "contactPressure": 0.38,
      "leakageRisk": 0.28,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 63.81,
      "tactileDiagnosis": 67.74,
      "planReasonScore": 69.47,
      "sensingIntegrity": 73.95,
      "visionOnlyScore": 39.94,
      "confidence": 59.6,
      "contactContribution": 68.57,
      "visionContribution": 42.25,
      "overall": 67.83
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 26.25,
      "tactileDiagnosis": 23.32,
      "planReasonScore": 19.92,
      "sensingIntegrity": 41.65,
      "visionOnlyScore": 62.07,
      "confidence": 31.7,
      "contactContribution": 34.64,
      "visionContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "cas-020",
    "input": {
      "contactCoverage": 0.66,
      "tactileSalience": 0.7,
      "planFit": 0.66,
      "sensingAgreement": 0.68,
      "visionOnlyAccuracy": 0.7,
      "visionOptimism": 0.37,
      "contactPressure": 0.31,
      "leakageRisk": 0.29,
      "contactBias": "contact_strict",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 52.86,
      "tactileDiagnosis": 70.06,
      "planReasonScore": 46.45,
      "sensingIntegrity": 85.3,
      "visionOnlyScore": 38.94,
      "confidence": 58.35,
      "contactContribution": 62.33,
      "visionContribution": 41.54,
      "overall": 62.59
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 13.66,
      "tactileDiagnosis": 23.93,
      "planReasonScore": 20.75,
      "sensingIntegrity": 40.51,
      "visionOnlyScore": 40.86,
      "confidence": 32.05,
      "contactContribution": 27.94,
      "visionContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "cas-021",
    "input": {
      "contactCoverage": 0.7,
      "tactileSalience": 0.68,
      "planFit": 0.7,
      "sensingAgreement": 0.72,
      "visionOnlyAccuracy": 0.73,
      "visionOptimism": 0.33,
      "contactPressure": 0.31,
      "leakageRisk": 0.24,
      "contactBias": "balanced",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 65.6,
      "tactileDiagnosis": 69.88,
      "planReasonScore": 70.62,
      "sensingIntegrity": 74.7,
      "visionOnlyScore": 39.99,
      "confidence": 60.95,
      "contactContribution": 70.03,
      "visionContribution": 42.54,
      "overall": 69.08
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 27.89,
      "tactileDiagnosis": 22.72,
      "planReasonScore": 19.62,
      "sensingIntegrity": 40.35,
      "visionOnlyScore": 61.19,
      "confidence": 31.8,
      "contactContribution": 34.35,
      "visionContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "cas-022",
    "input": {
      "contactCoverage": 0.74,
      "tactileSalience": 0.72,
      "planFit": 0.73,
      "sensingAgreement": 0.76,
      "visionOnlyAccuracy": 0.77,
      "visionOptimism": 0.34,
      "contactPressure": 0.32,
      "leakageRisk": 0.25,
      "contactBias": "tactile_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 57.62,
      "tactileDiagnosis": 73.52,
      "planReasonScore": 91.49,
      "sensingIntegrity": 59.58,
      "visionOnlyScore": 42.47,
      "confidence": 64.35,
      "contactContribution": 71.35,
      "visionContribution": 45.15,
      "overall": 70.63
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 24.57,
      "tactileDiagnosis": 23.79,
      "planReasonScore": 20.63,
      "sensingIntegrity": 42.05,
      "visionOnlyScore": 42.21,
      "confidence": 33.35,
      "contactContribution": 30.65,
      "visionContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "cas-023",
    "input": {
      "contactCoverage": 0.79,
      "tactileSalience": 0.76,
      "planFit": 0.77,
      "sensingAgreement": 0.8,
      "visionOnlyAccuracy": 0.81,
      "visionOptimism": 0.36,
      "contactPressure": 0.33,
      "leakageRisk": 0.25,
      "contactBias": "vision_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 49.04,
      "tactileDiagnosis": 67.38,
      "planReasonScore": 54.82,
      "sensingIntegrity": 48.57,
      "visionOnlyScore": 45.16,
      "confidence": 68.25,
      "contactContribution": 54.96,
      "visionContribution": 48.03,
      "overall": 54.71
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 33.86,
      "tactileDiagnosis": 25.25,
      "planReasonScore": 22.05,
      "sensingIntegrity": 43.92,
      "visionOnlyScore": 84.72,
      "confidence": 35.45,
      "contactContribution": 41.96,
      "visionContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "cas-024",
    "input": {
      "contactCoverage": 0.75,
      "tactileSalience": 0.75,
      "planFit": 0.81,
      "sensingAgreement": 0.76,
      "visionOnlyAccuracy": 0.77,
      "visionOptimism": 0.31,
      "contactPressure": 0.25,
      "leakageRisk": 0.2,
      "contactBias": "balanced",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 71.55,
      "tactileDiagnosis": 75.91,
      "planReasonScore": 75.74,
      "sensingIntegrity": 83.36,
      "visionOnlyScore": 43.13,
      "confidence": 68.1,
      "contactContribution": 76.37,
      "visionContribution": 46.07,
      "overall": 74.92
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 31.21,
      "tactileDiagnosis": 23.36,
      "planReasonScore": 20.13,
      "sensingIntegrity": 41.11,
      "visionOnlyScore": 63.65,
      "confidence": 33.9,
      "contactContribution": 35.89,
      "visionContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "cas-025",
    "input": {
      "contactCoverage": 0.79,
      "tactileSalience": 0.79,
      "planFit": 0.77,
      "sensingAgreement": 0.8,
      "visionOnlyAccuracy": 0.8,
      "visionOptimism": 0.33,
      "contactPressure": 0.26,
      "leakageRisk": 0.21,
      "contactBias": "contact_strict",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 62.51,
      "tactileDiagnosis": 79.52,
      "planReasonScore": 55.93,
      "sensingIntegrity": 97.81,
      "visionOnlyScore": 45.2,
      "confidence": 69.6,
      "contactContribution": 72.52,
      "visionContribution": 48.27,
      "overall": 72.16
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 19.5,
      "tactileDiagnosis": 24.6,
      "planReasonScore": 21.69,
      "sensingIntegrity": 42.63,
      "visionOnlyScore": 43.52,
      "confidence": 35.55,
      "contactContribution": 30.39,
      "visionContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "cas-026",
    "input": {
      "contactCoverage": 0.83,
      "tactileSalience": 0.83,
      "planFit": 0.8,
      "sensingAgreement": 0.83,
      "visionOnlyAccuracy": 0.84,
      "visionOptimism": 0.34,
      "contactPressure": 0.27,
      "leakageRisk": 0.22,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 78.52,
      "tactileDiagnosis": 83.17,
      "planReasonScore": 82.25,
      "sensingIntegrity": 86,
      "visionOnlyScore": 47.68,
      "confidence": 73,
      "contactContribution": 82.33,
      "visionContribution": 50.87,
      "overall": 80.67
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 33.17,
      "tactileDiagnosis": 25.67,
      "planReasonScore": 22.7,
      "sensingIntegrity": 44.32,
      "visionOnlyScore": 68.8,
      "confidence": 37.1,
      "contactContribution": 38.93,
      "visionContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "cas-027",
    "input": {
      "contactCoverage": 0.87,
      "tactileSalience": 0.81,
      "planFit": 0.84,
      "sensingAgreement": 0.87,
      "visionOnlyAccuracy": 0.88,
      "visionOptimism": 0.3,
      "contactPressure": 0.27,
      "leakageRisk": 0.17,
      "contactBias": "tactile_first",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 67.26,
      "tactileDiagnosis": 82.98,
      "planReasonScore": 100,
      "sensingIntegrity": 67.17,
      "visionOnlyScore": 49.35,
      "confidence": 75.6,
      "contactContribution": 80.18,
      "visionContribution": 52.5,
      "overall": 79.2
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 30.78,
      "tactileDiagnosis": 24.7,
      "planReasonScore": 21.75,
      "sensingIntegrity": 44.62,
      "visionOnlyScore": 45.22,
      "confidence": 37.2,
      "contactContribution": 33.41,
      "visionContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "cas-028",
    "input": {
      "contactCoverage": 0.83,
      "tactileSalience": 0.86,
      "planFit": 0.87,
      "sensingAgreement": 0.83,
      "visionOnlyAccuracy": 0.84,
      "visionOptimism": 0.31,
      "contactPressure": 0.2,
      "leakageRisk": 0.17,
      "contactBias": "vision_first",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 54.87,
      "tactileDiagnosis": 75.3,
      "planReasonScore": 59.19,
      "sensingIntegrity": 54.75,
      "visionOnlyScore": 48.34,
      "confidence": 76.1,
      "contactContribution": 60.96,
      "visionContribution": 51.73,
      "overall": 60.3
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 38.81,
      "tactileDiagnosis": 25.25,
      "planReasonScore": 22.17,
      "sensingIntegrity": 43.48,
      "visionOnlyScore": 86.95,
      "confidence": 37.65,
      "contactContribution": 43.33,
      "visionContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "cas-029",
    "input": {
      "contactCoverage": 0.87,
      "tactileSalience": 0.9,
      "planFit": 0.91,
      "sensingAgreement": 0.87,
      "visionOnlyAccuracy": 0.87,
      "visionOptimism": 0.33,
      "contactPressure": 0.2,
      "leakageRisk": 0.18,
      "contactBias": "balanced",
      "profile": "contact_centric"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 83.89,
      "tactileDiagnosis": 88.91,
      "planReasonScore": 87.12,
      "sensingIntegrity": 94.51,
      "visionOnlyScore": 50.59,
      "confidence": 79.6,
      "contactContribution": 88.34,
      "visionContribution": 54.16,
      "overall": 86.19
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 36.33,
      "tactileDiagnosis": 26.6,
      "planReasonScore": 23.46,
      "sensingIntegrity": 45,
      "visionOnlyScore": 71.06,
      "confidence": 39.5,
      "contactContribution": 40.49,
      "visionContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "cas-030",
    "input": {
      "contactCoverage": 0.91,
      "tactileSalience": 0.88,
      "planFit": 0.87,
      "sensingAgreement": 0.91,
      "visionOnlyAccuracy": 0.91,
      "visionOptimism": 0.28,
      "contactPressure": 0.21,
      "leakageRisk": 0.13,
      "contactBias": "contact_strict",
      "profile": "vision_only"
    },
    "expectedContactCentric": {
      "mode": "contact_centric",
      "contactDiagnosis": 71.59,
      "tactileDiagnosis": 88.77,
      "planReasonScore": 64.69,
      "sensingIntegrity": 100,
      "visionOnlyScore": 51.88,
      "confidence": 80.35,
      "contactContribution": 80.03,
      "visionContribution": 55.31,
      "overall": 79.58
    },
    "expectedVisionOnly": {
      "mode": "vision_only",
      "contactDiagnosis": 25.72,
      "tactileDiagnosis": 25.06,
      "planReasonScore": 22.34,
      "sensingIntegrity": 45.02,
      "visionOnlyScore": 46.21,
      "confidence": 38.95,
      "contactContribution": 32.87,
      "visionContribution": 50.68,
      "overall": 44.3
    }
  }
];
