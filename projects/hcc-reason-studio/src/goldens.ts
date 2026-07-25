import type { HccInput, HccQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HccInput;
  expectedClinicalReasoning: HccQuality;
  expectedNonReasoningBaseline: HccQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "hcc-001",
    "input": {
      "pathwayCoverage": 0.29,
      "clinicalCueFidelity": 0.25,
      "schemaFit": 0.28,
      "reasoningDepth": 0.34,
      "baselineAccuracy": 0.39,
      "shortcutOptimism": 0.45,
      "caseHardness": 0.59,
      "leakageRisk": 0.5,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 22.56,
      "reasoningDiagnosis": 30.25,
      "schemaReasonScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "reasoningContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 5.76,
      "reasoningDiagnosis": 17.09,
      "schemaReasonScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "reasoningContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "hcc-002",
    "input": {
      "pathwayCoverage": 0.33,
      "clinicalCueFidelity": 0.29,
      "schemaFit": 0.32,
      "reasoningDepth": 0.38,
      "baselineAccuracy": 0.43,
      "shortcutOptimism": 0.46,
      "caseHardness": 0.6,
      "leakageRisk": 0.51,
      "hccBias": "reasoner_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 22.22,
      "reasoningDiagnosis": 33.9,
      "schemaReasonScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "reasoningContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 2.43,
      "reasoningDiagnosis": 18.22,
      "schemaReasonScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "reasoningContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "hcc-003",
    "input": {
      "pathwayCoverage": 0.37,
      "clinicalCueFidelity": 0.27,
      "schemaFit": 0.36,
      "reasoningDepth": 0.42,
      "baselineAccuracy": 0.46,
      "shortcutOptimism": 0.42,
      "caseHardness": 0.6,
      "leakageRisk": 0.46,
      "hccBias": "baseline_first",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 12.18,
      "reasoningDiagnosis": 23.71,
      "schemaReasonScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "reasoningContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 12.17,
      "reasoningDiagnosis": 17.1,
      "schemaReasonScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "reasoningContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "hcc-004",
    "input": {
      "pathwayCoverage": 0.33,
      "clinicalCueFidelity": 0.32,
      "schemaFit": 0.39,
      "reasoningDepth": 0.38,
      "baselineAccuracy": 0.42,
      "shortcutOptimism": 0.43,
      "caseHardness": 0.53,
      "leakageRisk": 0.46,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 28.09,
      "reasoningDiagnosis": 36.03,
      "schemaReasonScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "reasoningContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 8.7,
      "reasoningDiagnosis": 17.81,
      "schemaReasonScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "reasoningContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "hcc-005",
    "input": {
      "pathwayCoverage": 0.37,
      "clinicalCueFidelity": 0.36,
      "schemaFit": 0.35,
      "reasoningDepth": 0.42,
      "baselineAccuracy": 0.46,
      "shortcutOptimism": 0.45,
      "caseHardness": 0.53,
      "leakageRisk": 0.47,
      "hccBias": "reasoning_strict",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 26.86,
      "reasoningDiagnosis": 39.64,
      "schemaReasonScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "reasoningContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 0,
      "reasoningDiagnosis": 19.51,
      "schemaReasonScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "reasoningContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "hcc-006",
    "input": {
      "pathwayCoverage": 0.41,
      "clinicalCueFidelity": 0.34,
      "schemaFit": 0.39,
      "reasoningDepth": 0.45,
      "baselineAccuracy": 0.5,
      "shortcutOptimism": 0.4,
      "caseHardness": 0.54,
      "leakageRisk": 0.42,
      "hccBias": "balanced",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 33.94,
      "reasoningDiagnosis": 39.5,
      "schemaReasonScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "reasoningContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 11.98,
      "reasoningDiagnosis": 18.04,
      "schemaReasonScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "reasoningContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "hcc-007",
    "input": {
      "pathwayCoverage": 0.45,
      "clinicalCueFidelity": 0.38,
      "schemaFit": 0.42,
      "reasoningDepth": 0.49,
      "baselineAccuracy": 0.53,
      "shortcutOptimism": 0.42,
      "caseHardness": 0.55,
      "leakageRisk": 0.43,
      "hccBias": "reasoner_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 31.59,
      "reasoningDiagnosis": 43.11,
      "schemaReasonScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "reasoningContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 8.27,
      "reasoningDiagnosis": 19.34,
      "schemaReasonScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "reasoningContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "hcc-008",
    "input": {
      "pathwayCoverage": 0.41,
      "clinicalCueFidelity": 0.43,
      "schemaFit": 0.46,
      "reasoningDepth": 0.45,
      "baselineAccuracy": 0.49,
      "shortcutOptimism": 0.43,
      "caseHardness": 0.47,
      "leakageRisk": 0.44,
      "hccBias": "baseline_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 19.33,
      "reasoningDiagnosis": 35.43,
      "schemaReasonScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "reasoningContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 16.4,
      "reasoningDiagnosis": 20.18,
      "schemaReasonScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "reasoningContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "hcc-009",
    "input": {
      "pathwayCoverage": 0.46,
      "clinicalCueFidelity": 0.41,
      "schemaFit": 0.5,
      "reasoningDepth": 0.49,
      "baselineAccuracy": 0.53,
      "shortcutOptimism": 0.39,
      "caseHardness": 0.48,
      "leakageRisk": 0.38,
      "hccBias": "balanced",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 40.05,
      "reasoningDiagnosis": 45.49,
      "schemaReasonScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "reasoningContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 14.91,
      "reasoningDiagnosis": 19.07,
      "schemaReasonScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "reasoningContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "hcc-010",
    "input": {
      "pathwayCoverage": 0.5,
      "clinicalCueFidelity": 0.45,
      "schemaFit": 0.46,
      "reasoningDepth": 0.53,
      "baselineAccuracy": 0.57,
      "shortcutOptimism": 0.4,
      "caseHardness": 0.49,
      "leakageRisk": 0.39,
      "hccBias": "reasoning_strict",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 36.62,
      "reasoningDiagnosis": 49.14,
      "schemaReasonScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "reasoningContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 3.59,
      "reasoningDiagnosis": 20.18,
      "schemaReasonScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "reasoningContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "hcc-011",
    "input": {
      "pathwayCoverage": 0.54,
      "clinicalCueFidelity": 0.49,
      "schemaFit": 0.49,
      "reasoningDepth": 0.57,
      "baselineAccuracy": 0.6,
      "shortcutOptimism": 0.42,
      "caseHardness": 0.49,
      "leakageRisk": 0.4,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 47.21,
      "reasoningDiagnosis": 52.75,
      "schemaReasonScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "reasoningContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 17.1,
      "reasoningDiagnosis": 21.62,
      "schemaReasonScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "reasoningContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "hcc-012",
    "input": {
      "pathwayCoverage": 0.5,
      "clinicalCueFidelity": 0.48,
      "schemaFit": 0.53,
      "reasoningDepth": 0.53,
      "baselineAccuracy": 0.56,
      "shortcutOptimism": 0.37,
      "caseHardness": 0.42,
      "leakageRisk": 0.35,
      "hccBias": "reasoner_first",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 38.19,
      "reasoningDiagnosis": 51.28,
      "schemaReasonScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "reasoningContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 13.23,
      "reasoningDiagnosis": 19.68,
      "schemaReasonScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "reasoningContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "hcc-013",
    "input": {
      "pathwayCoverage": 0.54,
      "clinicalCueFidelity": 0.52,
      "schemaFit": 0.56,
      "reasoningDepth": 0.57,
      "baselineAccuracy": 0.6,
      "shortcutOptimism": 0.39,
      "caseHardness": 0.42,
      "leakageRisk": 0.36,
      "hccBias": "baseline_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 29.13,
      "reasoningDiagnosis": 44.88,
      "schemaReasonScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "reasoningContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 22.62,
      "reasoningDiagnosis": 21.35,
      "schemaReasonScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "reasoningContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "hcc-014",
    "input": {
      "pathwayCoverage": 0.58,
      "clinicalCueFidelity": 0.56,
      "schemaFit": 0.6,
      "reasoningDepth": 0.61,
      "baselineAccuracy": 0.63,
      "shortcutOptimism": 0.4,
      "caseHardness": 0.43,
      "leakageRisk": 0.36,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 52.62,
      "reasoningDiagnosis": 58.53,
      "schemaReasonScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "reasoningContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 20.03,
      "reasoningDiagnosis": 22.2,
      "schemaReasonScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "reasoningContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "hcc-015",
    "input": {
      "pathwayCoverage": 0.62,
      "clinicalCueFidelity": 0.54,
      "schemaFit": 0.56,
      "reasoningDepth": 0.65,
      "baselineAccuracy": 0.67,
      "shortcutOptimism": 0.36,
      "caseHardness": 0.44,
      "leakageRisk": 0.31,
      "hccBias": "reasoning_strict",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 45.9,
      "reasoningDiagnosis": 58.35,
      "schemaReasonScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "reasoningContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 9.43,
      "reasoningDiagnosis": 21.14,
      "schemaReasonScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "reasoningContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "hcc-016",
    "input": {
      "pathwayCoverage": 0.58,
      "clinicalCueFidelity": 0.59,
      "schemaFit": 0.6,
      "reasoningDepth": 0.6,
      "baselineAccuracy": 0.63,
      "shortcutOptimism": 0.37,
      "caseHardness": 0.36,
      "leakageRisk": 0.32,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 54.46,
      "reasoningDiagnosis": 60.67,
      "schemaReasonScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "reasoningContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 22.05,
      "reasoningDiagnosis": 21.91,
      "schemaReasonScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "reasoningContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "hcc-017",
    "input": {
      "pathwayCoverage": 0.62,
      "clinicalCueFidelity": 0.63,
      "schemaFit": 0.63,
      "reasoningDepth": 0.64,
      "baselineAccuracy": 0.67,
      "shortcutOptimism": 0.39,
      "caseHardness": 0.37,
      "leakageRisk": 0.33,
      "hccBias": "reasoner_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 48.43,
      "reasoningDiagnosis": 64.28,
      "schemaReasonScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "reasoningContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 18.73,
      "reasoningDiagnosis": 23.42,
      "schemaReasonScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "reasoningContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "hcc-018",
    "input": {
      "pathwayCoverage": 0.66,
      "clinicalCueFidelity": 0.61,
      "schemaFit": 0.67,
      "reasoningDepth": 0.68,
      "baselineAccuracy": 0.7,
      "shortcutOptimism": 0.34,
      "caseHardness": 0.38,
      "leakageRisk": 0.27,
      "hccBias": "baseline_first",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 38.33,
      "reasoningDiagnosis": 54.13,
      "schemaReasonScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "reasoningContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 28.36,
      "reasoningDiagnosis": 21.66,
      "schemaReasonScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "reasoningContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "hcc-019",
    "input": {
      "pathwayCoverage": 0.7,
      "clinicalCueFidelity": 0.65,
      "schemaFit": 0.7,
      "reasoningDepth": 0.72,
      "baselineAccuracy": 0.74,
      "shortcutOptimism": 0.36,
      "caseHardness": 0.38,
      "leakageRisk": 0.28,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 63.81,
      "reasoningDiagnosis": 67.74,
      "schemaReasonScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "reasoningContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 26.25,
      "reasoningDiagnosis": 23.32,
      "schemaReasonScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "reasoningContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "hcc-020",
    "input": {
      "pathwayCoverage": 0.66,
      "clinicalCueFidelity": 0.7,
      "schemaFit": 0.66,
      "reasoningDepth": 0.68,
      "baselineAccuracy": 0.7,
      "shortcutOptimism": 0.37,
      "caseHardness": 0.31,
      "leakageRisk": 0.29,
      "hccBias": "reasoning_strict",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 52.86,
      "reasoningDiagnosis": 70.06,
      "schemaReasonScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "reasoningContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 13.66,
      "reasoningDiagnosis": 23.93,
      "schemaReasonScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "reasoningContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "hcc-021",
    "input": {
      "pathwayCoverage": 0.7,
      "clinicalCueFidelity": 0.68,
      "schemaFit": 0.7,
      "reasoningDepth": 0.72,
      "baselineAccuracy": 0.73,
      "shortcutOptimism": 0.33,
      "caseHardness": 0.31,
      "leakageRisk": 0.24,
      "hccBias": "balanced",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 65.6,
      "reasoningDiagnosis": 69.88,
      "schemaReasonScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "reasoningContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 27.89,
      "reasoningDiagnosis": 22.72,
      "schemaReasonScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "reasoningContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "hcc-022",
    "input": {
      "pathwayCoverage": 0.74,
      "clinicalCueFidelity": 0.72,
      "schemaFit": 0.73,
      "reasoningDepth": 0.76,
      "baselineAccuracy": 0.77,
      "shortcutOptimism": 0.34,
      "caseHardness": 0.32,
      "leakageRisk": 0.25,
      "hccBias": "reasoner_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 57.62,
      "reasoningDiagnosis": 73.52,
      "schemaReasonScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "reasoningContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 24.57,
      "reasoningDiagnosis": 23.79,
      "schemaReasonScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "reasoningContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "hcc-023",
    "input": {
      "pathwayCoverage": 0.79,
      "clinicalCueFidelity": 0.76,
      "schemaFit": 0.77,
      "reasoningDepth": 0.8,
      "baselineAccuracy": 0.81,
      "shortcutOptimism": 0.36,
      "caseHardness": 0.33,
      "leakageRisk": 0.25,
      "hccBias": "baseline_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 49.04,
      "reasoningDiagnosis": 67.38,
      "schemaReasonScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "reasoningContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 33.86,
      "reasoningDiagnosis": 25.25,
      "schemaReasonScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "reasoningContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "hcc-024",
    "input": {
      "pathwayCoverage": 0.75,
      "clinicalCueFidelity": 0.75,
      "schemaFit": 0.81,
      "reasoningDepth": 0.76,
      "baselineAccuracy": 0.77,
      "shortcutOptimism": 0.31,
      "caseHardness": 0.25,
      "leakageRisk": 0.2,
      "hccBias": "balanced",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 71.55,
      "reasoningDiagnosis": 75.91,
      "schemaReasonScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "reasoningContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 31.21,
      "reasoningDiagnosis": 23.36,
      "schemaReasonScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "reasoningContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "hcc-025",
    "input": {
      "pathwayCoverage": 0.79,
      "clinicalCueFidelity": 0.79,
      "schemaFit": 0.77,
      "reasoningDepth": 0.8,
      "baselineAccuracy": 0.8,
      "shortcutOptimism": 0.33,
      "caseHardness": 0.26,
      "leakageRisk": 0.21,
      "hccBias": "reasoning_strict",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 62.51,
      "reasoningDiagnosis": 79.52,
      "schemaReasonScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "reasoningContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 19.5,
      "reasoningDiagnosis": 24.6,
      "schemaReasonScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "reasoningContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "hcc-026",
    "input": {
      "pathwayCoverage": 0.83,
      "clinicalCueFidelity": 0.83,
      "schemaFit": 0.8,
      "reasoningDepth": 0.83,
      "baselineAccuracy": 0.84,
      "shortcutOptimism": 0.34,
      "caseHardness": 0.27,
      "leakageRisk": 0.22,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 78.52,
      "reasoningDiagnosis": 83.17,
      "schemaReasonScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "reasoningContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 33.17,
      "reasoningDiagnosis": 25.67,
      "schemaReasonScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "reasoningContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "hcc-027",
    "input": {
      "pathwayCoverage": 0.87,
      "clinicalCueFidelity": 0.81,
      "schemaFit": 0.84,
      "reasoningDepth": 0.87,
      "baselineAccuracy": 0.88,
      "shortcutOptimism": 0.3,
      "caseHardness": 0.27,
      "leakageRisk": 0.17,
      "hccBias": "reasoner_first",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 67.26,
      "reasoningDiagnosis": 82.98,
      "schemaReasonScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "reasoningContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 30.78,
      "reasoningDiagnosis": 24.7,
      "schemaReasonScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "reasoningContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "hcc-028",
    "input": {
      "pathwayCoverage": 0.83,
      "clinicalCueFidelity": 0.86,
      "schemaFit": 0.87,
      "reasoningDepth": 0.83,
      "baselineAccuracy": 0.84,
      "shortcutOptimism": 0.31,
      "caseHardness": 0.2,
      "leakageRisk": 0.17,
      "hccBias": "baseline_first",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 54.87,
      "reasoningDiagnosis": 75.3,
      "schemaReasonScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "reasoningContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 38.81,
      "reasoningDiagnosis": 25.25,
      "schemaReasonScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "reasoningContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "hcc-029",
    "input": {
      "pathwayCoverage": 0.87,
      "clinicalCueFidelity": 0.9,
      "schemaFit": 0.91,
      "reasoningDepth": 0.87,
      "baselineAccuracy": 0.87,
      "shortcutOptimism": 0.33,
      "caseHardness": 0.2,
      "leakageRisk": 0.18,
      "hccBias": "balanced",
      "profile": "clinical_reasoning"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 83.89,
      "reasoningDiagnosis": 88.91,
      "schemaReasonScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "reasoningContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 36.33,
      "reasoningDiagnosis": 26.6,
      "schemaReasonScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "reasoningContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "hcc-030",
    "input": {
      "pathwayCoverage": 0.91,
      "clinicalCueFidelity": 0.88,
      "schemaFit": 0.87,
      "reasoningDepth": 0.91,
      "baselineAccuracy": 0.91,
      "shortcutOptimism": 0.28,
      "caseHardness": 0.21,
      "leakageRisk": 0.13,
      "hccBias": "reasoning_strict",
      "profile": "non_reasoning_baseline"
    },
    "expectedClinicalReasoning": {
      "mode": "clinical_reasoning",
      "riskStratification": 71.59,
      "reasoningDiagnosis": 88.77,
      "schemaReasonScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "reasoningContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedNonReasoningBaseline": {
      "mode": "non_reasoning_baseline",
      "riskStratification": 25.72,
      "reasoningDiagnosis": 25.06,
      "schemaReasonScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "reasoningContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
