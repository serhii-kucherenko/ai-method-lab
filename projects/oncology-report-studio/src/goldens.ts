import type { ReportInput, ReportQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReportInput;
  expectedMultiLlmCollaborative: ReportQuality;
  expectedSingleLlmBaseline: ReportQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ors-001",
    "input": {
      "collaboratorCoverage": 0.29,
      "findingFidelity": 0.25,
      "schemaFit": 0.28,
      "consensusAgreement": 0.34,
      "singleModelAccuracy": 0.39,
      "soloOptimism": 0.45,
      "rareFindingHardness": 0.59,
      "leakageRisk": 0.5,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 22.56,
      "collaboratorDiagnosis": 30.25,
      "schemaReasonScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "collaboratorContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 5.76,
      "collaboratorDiagnosis": 17.09,
      "schemaReasonScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "collaboratorContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "ors-002",
    "input": {
      "collaboratorCoverage": 0.33,
      "findingFidelity": 0.29,
      "schemaFit": 0.32,
      "consensusAgreement": 0.38,
      "singleModelAccuracy": 0.43,
      "soloOptimism": 0.46,
      "rareFindingHardness": 0.6,
      "leakageRisk": 0.51,
      "reportBias": "multi_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 22.22,
      "collaboratorDiagnosis": 33.9,
      "schemaReasonScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "collaboratorContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 2.43,
      "collaboratorDiagnosis": 18.22,
      "schemaReasonScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "collaboratorContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "ors-003",
    "input": {
      "collaboratorCoverage": 0.37,
      "findingFidelity": 0.27,
      "schemaFit": 0.36,
      "consensusAgreement": 0.42,
      "singleModelAccuracy": 0.46,
      "soloOptimism": 0.42,
      "rareFindingHardness": 0.6,
      "leakageRisk": 0.46,
      "reportBias": "single_first",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 12.18,
      "collaboratorDiagnosis": 23.71,
      "schemaReasonScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "collaboratorContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 12.17,
      "collaboratorDiagnosis": 17.1,
      "schemaReasonScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "collaboratorContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "ors-004",
    "input": {
      "collaboratorCoverage": 0.33,
      "findingFidelity": 0.32,
      "schemaFit": 0.39,
      "consensusAgreement": 0.38,
      "singleModelAccuracy": 0.42,
      "soloOptimism": 0.43,
      "rareFindingHardness": 0.53,
      "leakageRisk": 0.46,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 28.09,
      "collaboratorDiagnosis": 36.03,
      "schemaReasonScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "collaboratorContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 8.7,
      "collaboratorDiagnosis": 17.81,
      "schemaReasonScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "collaboratorContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "ors-005",
    "input": {
      "collaboratorCoverage": 0.37,
      "findingFidelity": 0.36,
      "schemaFit": 0.35,
      "consensusAgreement": 0.42,
      "singleModelAccuracy": 0.46,
      "soloOptimism": 0.45,
      "rareFindingHardness": 0.53,
      "leakageRisk": 0.47,
      "reportBias": "collaborative_strict",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 26.86,
      "collaboratorDiagnosis": 39.64,
      "schemaReasonScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "collaboratorContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 0,
      "collaboratorDiagnosis": 19.51,
      "schemaReasonScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "collaboratorContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "ors-006",
    "input": {
      "collaboratorCoverage": 0.41,
      "findingFidelity": 0.34,
      "schemaFit": 0.39,
      "consensusAgreement": 0.45,
      "singleModelAccuracy": 0.5,
      "soloOptimism": 0.4,
      "rareFindingHardness": 0.54,
      "leakageRisk": 0.42,
      "reportBias": "balanced",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 33.94,
      "collaboratorDiagnosis": 39.5,
      "schemaReasonScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "collaboratorContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 11.98,
      "collaboratorDiagnosis": 18.04,
      "schemaReasonScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "collaboratorContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "ors-007",
    "input": {
      "collaboratorCoverage": 0.45,
      "findingFidelity": 0.38,
      "schemaFit": 0.42,
      "consensusAgreement": 0.49,
      "singleModelAccuracy": 0.53,
      "soloOptimism": 0.42,
      "rareFindingHardness": 0.55,
      "leakageRisk": 0.43,
      "reportBias": "multi_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 31.59,
      "collaboratorDiagnosis": 43.11,
      "schemaReasonScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "collaboratorContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 8.27,
      "collaboratorDiagnosis": 19.34,
      "schemaReasonScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "collaboratorContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "ors-008",
    "input": {
      "collaboratorCoverage": 0.41,
      "findingFidelity": 0.43,
      "schemaFit": 0.46,
      "consensusAgreement": 0.45,
      "singleModelAccuracy": 0.49,
      "soloOptimism": 0.43,
      "rareFindingHardness": 0.47,
      "leakageRisk": 0.44,
      "reportBias": "single_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 19.33,
      "collaboratorDiagnosis": 35.43,
      "schemaReasonScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "collaboratorContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 16.4,
      "collaboratorDiagnosis": 20.18,
      "schemaReasonScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "collaboratorContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "ors-009",
    "input": {
      "collaboratorCoverage": 0.46,
      "findingFidelity": 0.41,
      "schemaFit": 0.5,
      "consensusAgreement": 0.49,
      "singleModelAccuracy": 0.53,
      "soloOptimism": 0.39,
      "rareFindingHardness": 0.48,
      "leakageRisk": 0.38,
      "reportBias": "balanced",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 40.05,
      "collaboratorDiagnosis": 45.49,
      "schemaReasonScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "collaboratorContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 14.91,
      "collaboratorDiagnosis": 19.07,
      "schemaReasonScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "collaboratorContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "ors-010",
    "input": {
      "collaboratorCoverage": 0.5,
      "findingFidelity": 0.45,
      "schemaFit": 0.46,
      "consensusAgreement": 0.53,
      "singleModelAccuracy": 0.57,
      "soloOptimism": 0.4,
      "rareFindingHardness": 0.49,
      "leakageRisk": 0.39,
      "reportBias": "collaborative_strict",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 36.62,
      "collaboratorDiagnosis": 49.14,
      "schemaReasonScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "collaboratorContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 3.59,
      "collaboratorDiagnosis": 20.18,
      "schemaReasonScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "collaboratorContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "ors-011",
    "input": {
      "collaboratorCoverage": 0.54,
      "findingFidelity": 0.49,
      "schemaFit": 0.49,
      "consensusAgreement": 0.57,
      "singleModelAccuracy": 0.6,
      "soloOptimism": 0.42,
      "rareFindingHardness": 0.49,
      "leakageRisk": 0.4,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 47.21,
      "collaboratorDiagnosis": 52.75,
      "schemaReasonScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "collaboratorContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 17.1,
      "collaboratorDiagnosis": 21.62,
      "schemaReasonScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "collaboratorContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "ors-012",
    "input": {
      "collaboratorCoverage": 0.5,
      "findingFidelity": 0.48,
      "schemaFit": 0.53,
      "consensusAgreement": 0.53,
      "singleModelAccuracy": 0.56,
      "soloOptimism": 0.37,
      "rareFindingHardness": 0.42,
      "leakageRisk": 0.35,
      "reportBias": "multi_first",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 38.19,
      "collaboratorDiagnosis": 51.28,
      "schemaReasonScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "collaboratorContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 13.23,
      "collaboratorDiagnosis": 19.68,
      "schemaReasonScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "collaboratorContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "ors-013",
    "input": {
      "collaboratorCoverage": 0.54,
      "findingFidelity": 0.52,
      "schemaFit": 0.56,
      "consensusAgreement": 0.57,
      "singleModelAccuracy": 0.6,
      "soloOptimism": 0.39,
      "rareFindingHardness": 0.42,
      "leakageRisk": 0.36,
      "reportBias": "single_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 29.13,
      "collaboratorDiagnosis": 44.88,
      "schemaReasonScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "collaboratorContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 22.62,
      "collaboratorDiagnosis": 21.35,
      "schemaReasonScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "collaboratorContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "ors-014",
    "input": {
      "collaboratorCoverage": 0.58,
      "findingFidelity": 0.56,
      "schemaFit": 0.6,
      "consensusAgreement": 0.61,
      "singleModelAccuracy": 0.63,
      "soloOptimism": 0.4,
      "rareFindingHardness": 0.43,
      "leakageRisk": 0.36,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 52.62,
      "collaboratorDiagnosis": 58.53,
      "schemaReasonScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "collaboratorContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 20.03,
      "collaboratorDiagnosis": 22.2,
      "schemaReasonScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "collaboratorContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "ors-015",
    "input": {
      "collaboratorCoverage": 0.62,
      "findingFidelity": 0.54,
      "schemaFit": 0.56,
      "consensusAgreement": 0.65,
      "singleModelAccuracy": 0.67,
      "soloOptimism": 0.36,
      "rareFindingHardness": 0.44,
      "leakageRisk": 0.31,
      "reportBias": "collaborative_strict",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 45.9,
      "collaboratorDiagnosis": 58.35,
      "schemaReasonScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "collaboratorContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 9.43,
      "collaboratorDiagnosis": 21.14,
      "schemaReasonScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "collaboratorContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "ors-016",
    "input": {
      "collaboratorCoverage": 0.58,
      "findingFidelity": 0.59,
      "schemaFit": 0.6,
      "consensusAgreement": 0.6,
      "singleModelAccuracy": 0.63,
      "soloOptimism": 0.37,
      "rareFindingHardness": 0.36,
      "leakageRisk": 0.32,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 54.46,
      "collaboratorDiagnosis": 60.67,
      "schemaReasonScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "collaboratorContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 22.05,
      "collaboratorDiagnosis": 21.91,
      "schemaReasonScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "collaboratorContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "ors-017",
    "input": {
      "collaboratorCoverage": 0.62,
      "findingFidelity": 0.63,
      "schemaFit": 0.63,
      "consensusAgreement": 0.64,
      "singleModelAccuracy": 0.67,
      "soloOptimism": 0.39,
      "rareFindingHardness": 0.37,
      "leakageRisk": 0.33,
      "reportBias": "multi_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 48.43,
      "collaboratorDiagnosis": 64.28,
      "schemaReasonScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "collaboratorContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 18.73,
      "collaboratorDiagnosis": 23.42,
      "schemaReasonScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "collaboratorContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "ors-018",
    "input": {
      "collaboratorCoverage": 0.66,
      "findingFidelity": 0.61,
      "schemaFit": 0.67,
      "consensusAgreement": 0.68,
      "singleModelAccuracy": 0.7,
      "soloOptimism": 0.34,
      "rareFindingHardness": 0.38,
      "leakageRisk": 0.27,
      "reportBias": "single_first",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 38.33,
      "collaboratorDiagnosis": 54.13,
      "schemaReasonScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "collaboratorContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 28.36,
      "collaboratorDiagnosis": 21.66,
      "schemaReasonScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "collaboratorContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "ors-019",
    "input": {
      "collaboratorCoverage": 0.7,
      "findingFidelity": 0.65,
      "schemaFit": 0.7,
      "consensusAgreement": 0.72,
      "singleModelAccuracy": 0.74,
      "soloOptimism": 0.36,
      "rareFindingHardness": 0.38,
      "leakageRisk": 0.28,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 63.81,
      "collaboratorDiagnosis": 67.74,
      "schemaReasonScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "collaboratorContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 26.25,
      "collaboratorDiagnosis": 23.32,
      "schemaReasonScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "collaboratorContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ors-020",
    "input": {
      "collaboratorCoverage": 0.66,
      "findingFidelity": 0.7,
      "schemaFit": 0.66,
      "consensusAgreement": 0.68,
      "singleModelAccuracy": 0.7,
      "soloOptimism": 0.37,
      "rareFindingHardness": 0.31,
      "leakageRisk": 0.29,
      "reportBias": "collaborative_strict",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 52.86,
      "collaboratorDiagnosis": 70.06,
      "schemaReasonScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "collaboratorContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 13.66,
      "collaboratorDiagnosis": 23.93,
      "schemaReasonScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "collaboratorContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ors-021",
    "input": {
      "collaboratorCoverage": 0.7,
      "findingFidelity": 0.68,
      "schemaFit": 0.7,
      "consensusAgreement": 0.72,
      "singleModelAccuracy": 0.73,
      "soloOptimism": 0.33,
      "rareFindingHardness": 0.31,
      "leakageRisk": 0.24,
      "reportBias": "balanced",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 65.6,
      "collaboratorDiagnosis": 69.88,
      "schemaReasonScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "collaboratorContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 27.89,
      "collaboratorDiagnosis": 22.72,
      "schemaReasonScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "collaboratorContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ors-022",
    "input": {
      "collaboratorCoverage": 0.74,
      "findingFidelity": 0.72,
      "schemaFit": 0.73,
      "consensusAgreement": 0.76,
      "singleModelAccuracy": 0.77,
      "soloOptimism": 0.34,
      "rareFindingHardness": 0.32,
      "leakageRisk": 0.25,
      "reportBias": "multi_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 57.62,
      "collaboratorDiagnosis": 73.52,
      "schemaReasonScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "collaboratorContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 24.57,
      "collaboratorDiagnosis": 23.79,
      "schemaReasonScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "collaboratorContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "ors-023",
    "input": {
      "collaboratorCoverage": 0.79,
      "findingFidelity": 0.76,
      "schemaFit": 0.77,
      "consensusAgreement": 0.8,
      "singleModelAccuracy": 0.81,
      "soloOptimism": 0.36,
      "rareFindingHardness": 0.33,
      "leakageRisk": 0.25,
      "reportBias": "single_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 49.04,
      "collaboratorDiagnosis": 67.38,
      "schemaReasonScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "collaboratorContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 33.86,
      "collaboratorDiagnosis": 25.25,
      "schemaReasonScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "collaboratorContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "ors-024",
    "input": {
      "collaboratorCoverage": 0.75,
      "findingFidelity": 0.75,
      "schemaFit": 0.81,
      "consensusAgreement": 0.76,
      "singleModelAccuracy": 0.77,
      "soloOptimism": 0.31,
      "rareFindingHardness": 0.25,
      "leakageRisk": 0.2,
      "reportBias": "balanced",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 71.55,
      "collaboratorDiagnosis": 75.91,
      "schemaReasonScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "collaboratorContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 31.21,
      "collaboratorDiagnosis": 23.36,
      "schemaReasonScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "collaboratorContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "ors-025",
    "input": {
      "collaboratorCoverage": 0.79,
      "findingFidelity": 0.79,
      "schemaFit": 0.77,
      "consensusAgreement": 0.8,
      "singleModelAccuracy": 0.8,
      "soloOptimism": 0.33,
      "rareFindingHardness": 0.26,
      "leakageRisk": 0.21,
      "reportBias": "collaborative_strict",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 62.51,
      "collaboratorDiagnosis": 79.52,
      "schemaReasonScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "collaboratorContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 19.5,
      "collaboratorDiagnosis": 24.6,
      "schemaReasonScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "collaboratorContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "ors-026",
    "input": {
      "collaboratorCoverage": 0.83,
      "findingFidelity": 0.83,
      "schemaFit": 0.8,
      "consensusAgreement": 0.83,
      "singleModelAccuracy": 0.84,
      "soloOptimism": 0.34,
      "rareFindingHardness": 0.27,
      "leakageRisk": 0.22,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 78.52,
      "collaboratorDiagnosis": 83.17,
      "schemaReasonScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "collaboratorContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 33.17,
      "collaboratorDiagnosis": 25.67,
      "schemaReasonScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "collaboratorContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "ors-027",
    "input": {
      "collaboratorCoverage": 0.87,
      "findingFidelity": 0.81,
      "schemaFit": 0.84,
      "consensusAgreement": 0.87,
      "singleModelAccuracy": 0.88,
      "soloOptimism": 0.3,
      "rareFindingHardness": 0.27,
      "leakageRisk": 0.17,
      "reportBias": "multi_first",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 67.26,
      "collaboratorDiagnosis": 82.98,
      "schemaReasonScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "collaboratorContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 30.78,
      "collaboratorDiagnosis": 24.7,
      "schemaReasonScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "collaboratorContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "ors-028",
    "input": {
      "collaboratorCoverage": 0.83,
      "findingFidelity": 0.86,
      "schemaFit": 0.87,
      "consensusAgreement": 0.83,
      "singleModelAccuracy": 0.84,
      "soloOptimism": 0.31,
      "rareFindingHardness": 0.2,
      "leakageRisk": 0.17,
      "reportBias": "single_first",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 54.87,
      "collaboratorDiagnosis": 75.3,
      "schemaReasonScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "collaboratorContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 38.81,
      "collaboratorDiagnosis": 25.25,
      "schemaReasonScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "collaboratorContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "ors-029",
    "input": {
      "collaboratorCoverage": 0.87,
      "findingFidelity": 0.9,
      "schemaFit": 0.91,
      "consensusAgreement": 0.87,
      "singleModelAccuracy": 0.87,
      "soloOptimism": 0.33,
      "rareFindingHardness": 0.2,
      "leakageRisk": 0.18,
      "reportBias": "balanced",
      "profile": "multi_llm_collaborative"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 83.89,
      "collaboratorDiagnosis": 88.91,
      "schemaReasonScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "collaboratorContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 36.33,
      "collaboratorDiagnosis": 26.6,
      "schemaReasonScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "collaboratorContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "ors-030",
    "input": {
      "collaboratorCoverage": 0.91,
      "findingFidelity": 0.88,
      "schemaFit": 0.87,
      "consensusAgreement": 0.91,
      "singleModelAccuracy": 0.91,
      "soloOptimism": 0.28,
      "rareFindingHardness": 0.21,
      "leakageRisk": 0.13,
      "reportBias": "collaborative_strict",
      "profile": "single_llm_baseline"
    },
    "expectedMultiLlmCollaborative": {
      "mode": "multi_llm_collaborative",
      "findingDiagnosis": 71.59,
      "collaboratorDiagnosis": 88.77,
      "schemaReasonScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "collaboratorContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedSingleLlmBaseline": {
      "mode": "single_llm_baseline",
      "findingDiagnosis": 25.72,
      "collaboratorDiagnosis": 25.06,
      "schemaReasonScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "collaboratorContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
