import type { CvdInput, CvdQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CvdInput;
  expectedFederatedCvdRisk: CvdQuality;
  expectedCentralizedBaseline: CvdQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "fcvd-001",
    "input": {
      "siteParticipation": 0.29,
      "featureFidelity": 0.25,
      "schemaFit": 0.28,
      "federationAgreement": 0.34,
      "centralizedAccuracy": 0.39,
      "centralOptimism": 0.45,
      "heterogeneityHardness": 0.59,
      "leakageRisk": 0.5,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 22.56,
      "federationDiagnosis": 30.25,
      "schemaReasonScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "federationContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 5.76,
      "federationDiagnosis": 17.09,
      "schemaReasonScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "federationContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "fcvd-002",
    "input": {
      "siteParticipation": 0.33,
      "featureFidelity": 0.29,
      "schemaFit": 0.32,
      "federationAgreement": 0.38,
      "centralizedAccuracy": 0.43,
      "centralOptimism": 0.46,
      "heterogeneityHardness": 0.6,
      "leakageRisk": 0.51,
      "cvdBias": "federated_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 22.22,
      "federationDiagnosis": 33.9,
      "schemaReasonScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "federationContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 2.43,
      "federationDiagnosis": 18.22,
      "schemaReasonScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "federationContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "fcvd-003",
    "input": {
      "siteParticipation": 0.37,
      "featureFidelity": 0.27,
      "schemaFit": 0.36,
      "federationAgreement": 0.42,
      "centralizedAccuracy": 0.46,
      "centralOptimism": 0.42,
      "heterogeneityHardness": 0.6,
      "leakageRisk": 0.46,
      "cvdBias": "central_first",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 12.18,
      "federationDiagnosis": 23.71,
      "schemaReasonScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "federationContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 12.17,
      "federationDiagnosis": 17.1,
      "schemaReasonScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "federationContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "fcvd-004",
    "input": {
      "siteParticipation": 0.33,
      "featureFidelity": 0.32,
      "schemaFit": 0.39,
      "federationAgreement": 0.38,
      "centralizedAccuracy": 0.42,
      "centralOptimism": 0.43,
      "heterogeneityHardness": 0.53,
      "leakageRisk": 0.46,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 28.09,
      "federationDiagnosis": 36.03,
      "schemaReasonScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "federationContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 8.7,
      "federationDiagnosis": 17.81,
      "schemaReasonScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "federationContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "fcvd-005",
    "input": {
      "siteParticipation": 0.37,
      "featureFidelity": 0.36,
      "schemaFit": 0.35,
      "federationAgreement": 0.42,
      "centralizedAccuracy": 0.46,
      "centralOptimism": 0.45,
      "heterogeneityHardness": 0.53,
      "leakageRisk": 0.47,
      "cvdBias": "federation_strict",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 26.86,
      "federationDiagnosis": 39.64,
      "schemaReasonScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "federationContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 0,
      "federationDiagnosis": 19.51,
      "schemaReasonScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "federationContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "fcvd-006",
    "input": {
      "siteParticipation": 0.41,
      "featureFidelity": 0.34,
      "schemaFit": 0.39,
      "federationAgreement": 0.45,
      "centralizedAccuracy": 0.5,
      "centralOptimism": 0.4,
      "heterogeneityHardness": 0.54,
      "leakageRisk": 0.42,
      "cvdBias": "balanced",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 33.94,
      "federationDiagnosis": 39.5,
      "schemaReasonScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "federationContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 11.98,
      "federationDiagnosis": 18.04,
      "schemaReasonScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "federationContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "fcvd-007",
    "input": {
      "siteParticipation": 0.45,
      "featureFidelity": 0.38,
      "schemaFit": 0.42,
      "federationAgreement": 0.49,
      "centralizedAccuracy": 0.53,
      "centralOptimism": 0.42,
      "heterogeneityHardness": 0.55,
      "leakageRisk": 0.43,
      "cvdBias": "federated_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 31.59,
      "federationDiagnosis": 43.11,
      "schemaReasonScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "federationContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 8.27,
      "federationDiagnosis": 19.34,
      "schemaReasonScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "federationContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "fcvd-008",
    "input": {
      "siteParticipation": 0.41,
      "featureFidelity": 0.43,
      "schemaFit": 0.46,
      "federationAgreement": 0.45,
      "centralizedAccuracy": 0.49,
      "centralOptimism": 0.43,
      "heterogeneityHardness": 0.47,
      "leakageRisk": 0.44,
      "cvdBias": "central_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 19.33,
      "federationDiagnosis": 35.43,
      "schemaReasonScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "federationContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 16.4,
      "federationDiagnosis": 20.18,
      "schemaReasonScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "federationContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "fcvd-009",
    "input": {
      "siteParticipation": 0.46,
      "featureFidelity": 0.41,
      "schemaFit": 0.5,
      "federationAgreement": 0.49,
      "centralizedAccuracy": 0.53,
      "centralOptimism": 0.39,
      "heterogeneityHardness": 0.48,
      "leakageRisk": 0.38,
      "cvdBias": "balanced",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 40.05,
      "federationDiagnosis": 45.49,
      "schemaReasonScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "federationContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 14.91,
      "federationDiagnosis": 19.07,
      "schemaReasonScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "federationContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "fcvd-010",
    "input": {
      "siteParticipation": 0.5,
      "featureFidelity": 0.45,
      "schemaFit": 0.46,
      "federationAgreement": 0.53,
      "centralizedAccuracy": 0.57,
      "centralOptimism": 0.4,
      "heterogeneityHardness": 0.49,
      "leakageRisk": 0.39,
      "cvdBias": "federation_strict",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 36.62,
      "federationDiagnosis": 49.14,
      "schemaReasonScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "federationContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 3.59,
      "federationDiagnosis": 20.18,
      "schemaReasonScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "federationContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "fcvd-011",
    "input": {
      "siteParticipation": 0.54,
      "featureFidelity": 0.49,
      "schemaFit": 0.49,
      "federationAgreement": 0.57,
      "centralizedAccuracy": 0.6,
      "centralOptimism": 0.42,
      "heterogeneityHardness": 0.49,
      "leakageRisk": 0.4,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 47.21,
      "federationDiagnosis": 52.75,
      "schemaReasonScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "federationContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 17.1,
      "federationDiagnosis": 21.62,
      "schemaReasonScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "federationContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "fcvd-012",
    "input": {
      "siteParticipation": 0.5,
      "featureFidelity": 0.48,
      "schemaFit": 0.53,
      "federationAgreement": 0.53,
      "centralizedAccuracy": 0.56,
      "centralOptimism": 0.37,
      "heterogeneityHardness": 0.42,
      "leakageRisk": 0.35,
      "cvdBias": "federated_first",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 38.19,
      "federationDiagnosis": 51.28,
      "schemaReasonScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "federationContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 13.23,
      "federationDiagnosis": 19.68,
      "schemaReasonScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "federationContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "fcvd-013",
    "input": {
      "siteParticipation": 0.54,
      "featureFidelity": 0.52,
      "schemaFit": 0.56,
      "federationAgreement": 0.57,
      "centralizedAccuracy": 0.6,
      "centralOptimism": 0.39,
      "heterogeneityHardness": 0.42,
      "leakageRisk": 0.36,
      "cvdBias": "central_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 29.13,
      "federationDiagnosis": 44.88,
      "schemaReasonScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "federationContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 22.62,
      "federationDiagnosis": 21.35,
      "schemaReasonScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "federationContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "fcvd-014",
    "input": {
      "siteParticipation": 0.58,
      "featureFidelity": 0.56,
      "schemaFit": 0.6,
      "federationAgreement": 0.61,
      "centralizedAccuracy": 0.63,
      "centralOptimism": 0.4,
      "heterogeneityHardness": 0.43,
      "leakageRisk": 0.36,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 52.62,
      "federationDiagnosis": 58.53,
      "schemaReasonScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "federationContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 20.03,
      "federationDiagnosis": 22.2,
      "schemaReasonScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "federationContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "fcvd-015",
    "input": {
      "siteParticipation": 0.62,
      "featureFidelity": 0.54,
      "schemaFit": 0.56,
      "federationAgreement": 0.65,
      "centralizedAccuracy": 0.67,
      "centralOptimism": 0.36,
      "heterogeneityHardness": 0.44,
      "leakageRisk": 0.31,
      "cvdBias": "federation_strict",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 45.9,
      "federationDiagnosis": 58.35,
      "schemaReasonScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "federationContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 9.43,
      "federationDiagnosis": 21.14,
      "schemaReasonScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "federationContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "fcvd-016",
    "input": {
      "siteParticipation": 0.58,
      "featureFidelity": 0.59,
      "schemaFit": 0.6,
      "federationAgreement": 0.6,
      "centralizedAccuracy": 0.63,
      "centralOptimism": 0.37,
      "heterogeneityHardness": 0.36,
      "leakageRisk": 0.32,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 54.46,
      "federationDiagnosis": 60.67,
      "schemaReasonScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "federationContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 22.05,
      "federationDiagnosis": 21.91,
      "schemaReasonScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "federationContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "fcvd-017",
    "input": {
      "siteParticipation": 0.62,
      "featureFidelity": 0.63,
      "schemaFit": 0.63,
      "federationAgreement": 0.64,
      "centralizedAccuracy": 0.67,
      "centralOptimism": 0.39,
      "heterogeneityHardness": 0.37,
      "leakageRisk": 0.33,
      "cvdBias": "federated_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 48.43,
      "federationDiagnosis": 64.28,
      "schemaReasonScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "federationContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 18.73,
      "federationDiagnosis": 23.42,
      "schemaReasonScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "federationContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "fcvd-018",
    "input": {
      "siteParticipation": 0.66,
      "featureFidelity": 0.61,
      "schemaFit": 0.67,
      "federationAgreement": 0.68,
      "centralizedAccuracy": 0.7,
      "centralOptimism": 0.34,
      "heterogeneityHardness": 0.38,
      "leakageRisk": 0.27,
      "cvdBias": "central_first",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 38.33,
      "federationDiagnosis": 54.13,
      "schemaReasonScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "federationContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 28.36,
      "federationDiagnosis": 21.66,
      "schemaReasonScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "federationContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "fcvd-019",
    "input": {
      "siteParticipation": 0.7,
      "featureFidelity": 0.65,
      "schemaFit": 0.7,
      "federationAgreement": 0.72,
      "centralizedAccuracy": 0.74,
      "centralOptimism": 0.36,
      "heterogeneityHardness": 0.38,
      "leakageRisk": 0.28,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 63.81,
      "federationDiagnosis": 67.74,
      "schemaReasonScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "federationContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 26.25,
      "federationDiagnosis": 23.32,
      "schemaReasonScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "federationContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "fcvd-020",
    "input": {
      "siteParticipation": 0.66,
      "featureFidelity": 0.7,
      "schemaFit": 0.66,
      "federationAgreement": 0.68,
      "centralizedAccuracy": 0.7,
      "centralOptimism": 0.37,
      "heterogeneityHardness": 0.31,
      "leakageRisk": 0.29,
      "cvdBias": "federation_strict",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 52.86,
      "federationDiagnosis": 70.06,
      "schemaReasonScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "federationContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 13.66,
      "federationDiagnosis": 23.93,
      "schemaReasonScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "federationContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "fcvd-021",
    "input": {
      "siteParticipation": 0.7,
      "featureFidelity": 0.68,
      "schemaFit": 0.7,
      "federationAgreement": 0.72,
      "centralizedAccuracy": 0.73,
      "centralOptimism": 0.33,
      "heterogeneityHardness": 0.31,
      "leakageRisk": 0.24,
      "cvdBias": "balanced",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 65.6,
      "federationDiagnosis": 69.88,
      "schemaReasonScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "federationContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 27.89,
      "federationDiagnosis": 22.72,
      "schemaReasonScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "federationContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "fcvd-022",
    "input": {
      "siteParticipation": 0.74,
      "featureFidelity": 0.72,
      "schemaFit": 0.73,
      "federationAgreement": 0.76,
      "centralizedAccuracy": 0.77,
      "centralOptimism": 0.34,
      "heterogeneityHardness": 0.32,
      "leakageRisk": 0.25,
      "cvdBias": "federated_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 57.62,
      "federationDiagnosis": 73.52,
      "schemaReasonScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "federationContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 24.57,
      "federationDiagnosis": 23.79,
      "schemaReasonScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "federationContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "fcvd-023",
    "input": {
      "siteParticipation": 0.79,
      "featureFidelity": 0.76,
      "schemaFit": 0.77,
      "federationAgreement": 0.8,
      "centralizedAccuracy": 0.81,
      "centralOptimism": 0.36,
      "heterogeneityHardness": 0.33,
      "leakageRisk": 0.25,
      "cvdBias": "central_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 49.04,
      "federationDiagnosis": 67.38,
      "schemaReasonScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "federationContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 33.86,
      "federationDiagnosis": 25.25,
      "schemaReasonScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "federationContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "fcvd-024",
    "input": {
      "siteParticipation": 0.75,
      "featureFidelity": 0.75,
      "schemaFit": 0.81,
      "federationAgreement": 0.76,
      "centralizedAccuracy": 0.77,
      "centralOptimism": 0.31,
      "heterogeneityHardness": 0.25,
      "leakageRisk": 0.2,
      "cvdBias": "balanced",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 71.55,
      "federationDiagnosis": 75.91,
      "schemaReasonScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "federationContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 31.21,
      "federationDiagnosis": 23.36,
      "schemaReasonScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "federationContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "fcvd-025",
    "input": {
      "siteParticipation": 0.79,
      "featureFidelity": 0.79,
      "schemaFit": 0.77,
      "federationAgreement": 0.8,
      "centralizedAccuracy": 0.8,
      "centralOptimism": 0.33,
      "heterogeneityHardness": 0.26,
      "leakageRisk": 0.21,
      "cvdBias": "federation_strict",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 62.51,
      "federationDiagnosis": 79.52,
      "schemaReasonScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "federationContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 19.5,
      "federationDiagnosis": 24.6,
      "schemaReasonScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "federationContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "fcvd-026",
    "input": {
      "siteParticipation": 0.83,
      "featureFidelity": 0.83,
      "schemaFit": 0.8,
      "federationAgreement": 0.83,
      "centralizedAccuracy": 0.84,
      "centralOptimism": 0.34,
      "heterogeneityHardness": 0.27,
      "leakageRisk": 0.22,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 78.52,
      "federationDiagnosis": 83.17,
      "schemaReasonScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "federationContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 33.17,
      "federationDiagnosis": 25.67,
      "schemaReasonScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "federationContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "fcvd-027",
    "input": {
      "siteParticipation": 0.87,
      "featureFidelity": 0.81,
      "schemaFit": 0.84,
      "federationAgreement": 0.87,
      "centralizedAccuracy": 0.88,
      "centralOptimism": 0.3,
      "heterogeneityHardness": 0.27,
      "leakageRisk": 0.17,
      "cvdBias": "federated_first",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 67.26,
      "federationDiagnosis": 82.98,
      "schemaReasonScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "federationContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 30.78,
      "federationDiagnosis": 24.7,
      "schemaReasonScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "federationContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "fcvd-028",
    "input": {
      "siteParticipation": 0.83,
      "featureFidelity": 0.86,
      "schemaFit": 0.87,
      "federationAgreement": 0.83,
      "centralizedAccuracy": 0.84,
      "centralOptimism": 0.31,
      "heterogeneityHardness": 0.2,
      "leakageRisk": 0.17,
      "cvdBias": "central_first",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 54.87,
      "federationDiagnosis": 75.3,
      "schemaReasonScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "federationContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 38.81,
      "federationDiagnosis": 25.25,
      "schemaReasonScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "federationContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "fcvd-029",
    "input": {
      "siteParticipation": 0.87,
      "featureFidelity": 0.9,
      "schemaFit": 0.91,
      "federationAgreement": 0.87,
      "centralizedAccuracy": 0.87,
      "centralOptimism": 0.33,
      "heterogeneityHardness": 0.2,
      "leakageRisk": 0.18,
      "cvdBias": "balanced",
      "profile": "federated_cvd_risk"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 83.89,
      "federationDiagnosis": 88.91,
      "schemaReasonScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "federationContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 36.33,
      "federationDiagnosis": 26.6,
      "schemaReasonScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "federationContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "fcvd-030",
    "input": {
      "siteParticipation": 0.91,
      "featureFidelity": 0.88,
      "schemaFit": 0.87,
      "federationAgreement": 0.91,
      "centralizedAccuracy": 0.91,
      "centralOptimism": 0.28,
      "heterogeneityHardness": 0.21,
      "leakageRisk": 0.13,
      "cvdBias": "federation_strict",
      "profile": "centralized_baseline"
    },
    "expectedFederatedCvdRisk": {
      "mode": "federated_cvd_risk",
      "riskDiagnosis": 71.59,
      "federationDiagnosis": 88.77,
      "schemaReasonScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "federationContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedCentralizedBaseline": {
      "mode": "centralized_baseline",
      "riskDiagnosis": 25.72,
      "federationDiagnosis": 25.06,
      "schemaReasonScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "federationContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
