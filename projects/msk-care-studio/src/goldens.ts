import type { CareInput, CareQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareInput;
  expectedEvidenceGrounded: CareQuality;
  expectedUngroundedLlm: CareQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "mskcs-001",
    "input": {
      "streamCoverage": 0.16,
      "knowledgeGrounding": 0.15,
      "pathwayProgress": 0.14,
      "decisionTraceability": 0.16,
      "patientStability": 0.19,
      "rehabReadiness": 0.1,
      "evidenceFreshness": 0.19,
      "comorbidityLoad": 0.63,
      "episodeDays": 4,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 12,
      "knowledgeFit": 10.06,
      "pathwayCoherence": 13.79,
      "decisionQuality": 14.94,
      "rehabOutlook": 15.09,
      "auditTrail": 15.18,
      "overall": 13.37
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 3.87,
      "knowledgeFit": 3.46,
      "pathwayCoherence": 6.31,
      "decisionQuality": 12.32,
      "rehabOutlook": 7.43,
      "auditTrail": 0,
      "overall": 7.27
    }
  },
  {
    "id": "mskcs-002",
    "input": {
      "streamCoverage": 0.2,
      "knowledgeGrounding": 0.19,
      "pathwayProgress": 0.18,
      "decisionTraceability": 0.2,
      "patientStability": 0.23,
      "rehabReadiness": 0.14,
      "evidenceFreshness": 0.23,
      "comorbidityLoad": 0.63,
      "episodeDays": 5,
      "careStage": "rehab",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 16.69,
      "knowledgeFit": 14.66,
      "pathwayCoherence": 18.13,
      "decisionQuality": 19.74,
      "rehabOutlook": 19.4,
      "auditTrail": 18.16,
      "overall": 17.77
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 4.68,
      "knowledgeFit": 4.28,
      "pathwayCoherence": 8.04,
      "decisionQuality": 15.39,
      "rehabOutlook": 8.52,
      "auditTrail": 0,
      "overall": 8.95
    }
  },
  {
    "id": "mskcs-003",
    "input": {
      "streamCoverage": 0.24,
      "knowledgeGrounding": 0.24,
      "pathwayProgress": 0.17,
      "decisionTraceability": 0.23,
      "patientStability": 0.27,
      "rehabReadiness": 0.19,
      "evidenceFreshness": 0.27,
      "comorbidityLoad": 0.57,
      "episodeDays": 6,
      "careStage": "discharge",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 22.04,
      "knowledgeFit": 19.75,
      "pathwayCoherence": 20.49,
      "decisionQuality": 24.46,
      "rehabOutlook": 23.64,
      "auditTrail": 26.06,
      "overall": 22.49
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 5.37,
      "knowledgeFit": 5.06,
      "pathwayCoherence": 8.57,
      "decisionQuality": 16.11,
      "rehabOutlook": 10.08,
      "auditTrail": 0,
      "overall": 9.71
    }
  },
  {
    "id": "mskcs-004",
    "input": {
      "streamCoverage": 0.28,
      "knowledgeGrounding": 0.2,
      "pathwayProgress": 0.21,
      "decisionTraceability": 0.27,
      "patientStability": 0.24,
      "rehabReadiness": 0.23,
      "evidenceFreshness": 0.25,
      "comorbidityLoad": 0.57,
      "episodeDays": 7,
      "careStage": "admission",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 18.76,
      "knowledgeFit": 15.12,
      "pathwayCoherence": 18.55,
      "decisionQuality": 21.44,
      "rehabOutlook": 21.4,
      "auditTrail": 21.92,
      "overall": 19.34
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 5.74,
      "knowledgeFit": 4.74,
      "pathwayCoherence": 9.78,
      "decisionQuality": 19.49,
      "rehabOutlook": 10.46,
      "auditTrail": 0,
      "overall": 11.12
    }
  },
  {
    "id": "mskcs-005",
    "input": {
      "streamCoverage": 0.25,
      "knowledgeGrounding": 0.25,
      "pathwayProgress": 0.26,
      "decisionTraceability": 0.31,
      "patientStability": 0.28,
      "rehabReadiness": 0.18,
      "evidenceFreshness": 0.29,
      "comorbidityLoad": 0.57,
      "episodeDays": 8,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 21.23,
      "knowledgeFit": 19.93,
      "pathwayCoherence": 22.78,
      "decisionQuality": 25.7,
      "rehabOutlook": 23.36,
      "auditTrail": 23.8,
      "overall": 22.77
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 5.64,
      "knowledgeFit": 5.71,
      "pathwayCoherence": 10.55,
      "decisionQuality": 19.84,
      "rehabOutlook": 9.96,
      "auditTrail": 0,
      "overall": 11.36
    }
  },
  {
    "id": "mskcs-006",
    "input": {
      "streamCoverage": 0.29,
      "knowledgeGrounding": 0.29,
      "pathwayProgress": 0.24,
      "decisionTraceability": 0.26,
      "patientStability": 0.32,
      "rehabReadiness": 0.22,
      "evidenceFreshness": 0.32,
      "comorbidityLoad": 0.52,
      "episodeDays": 9,
      "careStage": "rehab",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 28.42,
      "knowledgeFit": 25.42,
      "pathwayCoherence": 27.1,
      "decisionQuality": 29.89,
      "rehabOutlook": 29.53,
      "auditTrail": 29.48,
      "overall": 28.22
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 6.21,
      "knowledgeFit": 5.78,
      "pathwayCoherence": 10.67,
      "decisionQuality": 20.01,
      "rehabOutlook": 11.18,
      "auditTrail": 0,
      "overall": 11.72
    }
  },
  {
    "id": "mskcs-007",
    "input": {
      "streamCoverage": 0.33,
      "knowledgeGrounding": 0.33,
      "pathwayProgress": 0.29,
      "decisionTraceability": 0.3,
      "patientStability": 0.36,
      "rehabReadiness": 0.26,
      "evidenceFreshness": 0.36,
      "comorbidityLoad": 0.52,
      "episodeDays": 10,
      "careStage": "discharge",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 28.55,
      "knowledgeFit": 25.86,
      "pathwayCoherence": 27.94,
      "decisionQuality": 30.35,
      "rehabOutlook": 29.79,
      "auditTrail": 27.46,
      "overall": 28.41
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 6.88,
      "knowledgeFit": 6.46,
      "pathwayCoherence": 12.4,
      "decisionQuality": 25.27,
      "rehabOutlook": 12.06,
      "auditTrail": 0,
      "overall": 14.08
    }
  },
  {
    "id": "mskcs-008",
    "input": {
      "streamCoverage": 0.37,
      "knowledgeGrounding": 0.3,
      "pathwayProgress": 0.33,
      "decisionTraceability": 0.34,
      "patientStability": 0.33,
      "rehabReadiness": 0.31,
      "evidenceFreshness": 0.34,
      "comorbidityLoad": 0.52,
      "episodeDays": 11,
      "careStage": "admission",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 26.51,
      "knowledgeFit": 22.67,
      "pathwayCoherence": 26.79,
      "decisionQuality": 28.62,
      "rehabOutlook": 28.91,
      "auditTrail": 28.48,
      "overall": 26.87
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 7.21,
      "knowledgeFit": 6.28,
      "pathwayCoherence": 13.63,
      "decisionQuality": 26.98,
      "rehabOutlook": 12.56,
      "auditTrail": 0,
      "overall": 14.96
    }
  },
  {
    "id": "mskcs-009",
    "input": {
      "streamCoverage": 0.41,
      "knowledgeGrounding": 0.34,
      "pathwayProgress": 0.32,
      "decisionTraceability": 0.38,
      "patientStability": 0.37,
      "rehabReadiness": 0.35,
      "evidenceFreshness": 0.38,
      "comorbidityLoad": 0.46,
      "episodeDays": 12,
      "careStage": "acute",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 36.07,
      "knowledgeFit": 31.22,
      "pathwayCoherence": 32.94,
      "decisionQuality": 37.63,
      "rehabOutlook": 36.95,
      "auditTrail": 36.46,
      "overall": 35.13
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 7.73,
      "knowledgeFit": 6.83,
      "pathwayCoherence": 13.82,
      "decisionQuality": 27.37,
      "rehabOutlook": 13.64,
      "auditTrail": 0,
      "overall": 15.43
    }
  },
  {
    "id": "mskcs-010",
    "input": {
      "streamCoverage": 0.37,
      "knowledgeGrounding": 0.39,
      "pathwayProgress": 0.36,
      "decisionTraceability": 0.41,
      "patientStability": 0.41,
      "rehabReadiness": 0.3,
      "evidenceFreshness": 0.42,
      "comorbidityLoad": 0.46,
      "episodeDays": 13,
      "careStage": "rehab",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 35.33,
      "knowledgeFit": 33.56,
      "pathwayCoherence": 34.58,
      "decisionQuality": 38.81,
      "rehabOutlook": 36.07,
      "auditTrail": 32.92,
      "overall": 35.45
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 7.52,
      "knowledgeFit": 7.65,
      "pathwayCoherence": 14.34,
      "decisionQuality": 29.54,
      "rehabOutlook": 13.18,
      "auditTrail": 0,
      "overall": 16.23
    }
  },
  {
    "id": "mskcs-011",
    "input": {
      "streamCoverage": 0.41,
      "knowledgeGrounding": 0.43,
      "pathwayProgress": 0.41,
      "decisionTraceability": 0.45,
      "patientStability": 0.45,
      "rehabReadiness": 0.34,
      "evidenceFreshness": 0.46,
      "comorbidityLoad": 0.46,
      "episodeDays": 14,
      "careStage": "discharge",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 37.5,
      "knowledgeFit": 35.8,
      "pathwayCoherence": 37.11,
      "decisionQuality": 41.1,
      "rehabOutlook": 38.22,
      "auditTrail": 35.9,
      "overall": 37.8
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 8.1,
      "knowledgeFit": 8.24,
      "pathwayCoherence": 15.89,
      "decisionQuality": 32.79,
      "rehabOutlook": 13.93,
      "auditTrail": 0,
      "overall": 17.83
    }
  },
  {
    "id": "mskcs-012",
    "input": {
      "streamCoverage": 0.45,
      "knowledgeGrounding": 0.4,
      "pathwayProgress": 0.39,
      "decisionTraceability": 0.4,
      "patientStability": 0.42,
      "rehabReadiness": 0.39,
      "evidenceFreshness": 0.44,
      "comorbidityLoad": 0.4,
      "episodeDays": 15,
      "careStage": "admission",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 37.63,
      "knowledgeFit": 32.92,
      "pathwayCoherence": 35.52,
      "decisionQuality": 38.29,
      "rehabOutlook": 38.79,
      "auditTrail": 39.76,
      "overall": 36.93
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 8.28,
      "knowledgeFit": 7.43,
      "pathwayCoherence": 15.61,
      "decisionQuality": 31.64,
      "rehabOutlook": 14.61,
      "auditTrail": 0,
      "overall": 17.46
    }
  },
  {
    "id": "mskcs-013",
    "input": {
      "streamCoverage": 0.49,
      "knowledgeGrounding": 0.44,
      "pathwayProgress": 0.44,
      "decisionTraceability": 0.44,
      "patientStability": 0.46,
      "rehabReadiness": 0.43,
      "evidenceFreshness": 0.47,
      "comorbidityLoad": 0.4,
      "episodeDays": 16,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 41.12,
      "knowledgeFit": 36.52,
      "pathwayCoherence": 39.45,
      "decisionQuality": 42.02,
      "rehabOutlook": 42.43,
      "auditTrail": 37.6,
      "overall": 40.03
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 8.74,
      "knowledgeFit": 7.98,
      "pathwayCoherence": 17.07,
      "decisionQuality": 36.9,
      "rehabOutlook": 15.27,
      "auditTrail": 0.54,
      "overall": 19.76
    }
  },
  {
    "id": "mskcs-014",
    "input": {
      "streamCoverage": 0.53,
      "knowledgeGrounding": 0.48,
      "pathwayProgress": 0.48,
      "decisionTraceability": 0.48,
      "patientStability": 0.5,
      "rehabReadiness": 0.47,
      "evidenceFreshness": 0.51,
      "comorbidityLoad": 0.4,
      "episodeDays": 17,
      "careStage": "rehab",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 47.48,
      "knowledgeFit": 42.63,
      "pathwayCoherence": 45.32,
      "decisionQuality": 48.45,
      "rehabOutlook": 48.39,
      "auditTrail": 40.58,
      "overall": 45.87
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 9.24,
      "knowledgeFit": 8.49,
      "pathwayCoherence": 18.26,
      "decisionQuality": 39.97,
      "rehabOutlook": 15.88,
      "auditTrail": 1.48,
      "overall": 21.32
    }
  },
  {
    "id": "mskcs-015",
    "input": {
      "streamCoverage": 0.5,
      "knowledgeGrounding": 0.53,
      "pathwayProgress": 0.47,
      "decisionTraceability": 0.52,
      "patientStability": 0.54,
      "rehabReadiness": 0.42,
      "evidenceFreshness": 0.55,
      "comorbidityLoad": 0.34,
      "episodeDays": 18,
      "careStage": "discharge",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 50.65,
      "knowledgeFit": 48.1,
      "pathwayCoherence": 47.39,
      "decisionQuality": 53.07,
      "rehabOutlook": 49.69,
      "auditTrail": 47.46,
      "overall": 49.62
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 8.97,
      "knowledgeFit": 9.11,
      "pathwayCoherence": 17.53,
      "decisionQuality": 37.46,
      "rehabOutlook": 15.55,
      "auditTrail": 1.52,
      "overall": 20.33
    }
  },
  {
    "id": "mskcs-016",
    "input": {
      "streamCoverage": 0.54,
      "knowledgeGrounding": 0.49,
      "pathwayProgress": 0.51,
      "decisionTraceability": 0.55,
      "patientStability": 0.51,
      "rehabReadiness": 0.46,
      "evidenceFreshness": 0.53,
      "comorbidityLoad": 0.35,
      "episodeDays": 19,
      "careStage": "admission",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 42.7,
      "knowledgeFit": 38.79,
      "pathwayCoherence": 40.95,
      "decisionQuality": 44.97,
      "rehabOutlook": 43.02,
      "auditTrail": 43.08,
      "overall": 42.22
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 9.3,
      "knowledgeFit": 8.82,
      "pathwayCoherence": 18.52,
      "decisionQuality": 40.8,
      "rehabOutlook": 15.85,
      "auditTrail": 2.34,
      "overall": 21.78
    }
  },
  {
    "id": "mskcs-017",
    "input": {
      "streamCoverage": 0.58,
      "knowledgeGrounding": 0.54,
      "pathwayProgress": 0.56,
      "decisionTraceability": 0.59,
      "patientStability": 0.55,
      "rehabReadiness": 0.51,
      "evidenceFreshness": 0.57,
      "comorbidityLoad": 0.35,
      "episodeDays": 20,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 50.26,
      "knowledgeFit": 46.37,
      "pathwayCoherence": 48.39,
      "decisionQuality": 52.78,
      "rehabOutlook": 50.59,
      "auditTrail": 46.22,
      "overall": 49.38
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 9.71,
      "knowledgeFit": 9.36,
      "pathwayCoherence": 19.85,
      "decisionQuality": 44.38,
      "rehabOutlook": 16.48,
      "auditTrail": 3.38,
      "overall": 23.54
    }
  },
  {
    "id": "mskcs-018",
    "input": {
      "streamCoverage": 0.62,
      "knowledgeGrounding": 0.58,
      "pathwayProgress": 0.54,
      "decisionTraceability": 0.54,
      "patientStability": 0.59,
      "rehabReadiness": 0.55,
      "evidenceFreshness": 0.61,
      "comorbidityLoad": 0.29,
      "episodeDays": 21,
      "careStage": "rehab",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 61.9,
      "knowledgeFit": 55.7,
      "pathwayCoherence": 56.52,
      "decisionQuality": 61.1,
      "rehabOutlook": 60.88,
      "auditTrail": 52.04,
      "overall": 58.51
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 9.94,
      "knowledgeFit": 9.16,
      "pathwayCoherence": 19.56,
      "decisionQuality": 44.59,
      "rehabOutlook": 17.04,
      "auditTrail": 3.24,
      "overall": 23.66
    }
  },
  {
    "id": "mskcs-019",
    "input": {
      "streamCoverage": 0.66,
      "knowledgeGrounding": 0.62,
      "pathwayProgress": 0.59,
      "decisionTraceability": 0.58,
      "patientStability": 0.63,
      "rehabReadiness": 0.59,
      "evidenceFreshness": 0.64,
      "comorbidityLoad": 0.29,
      "episodeDays": 22,
      "careStage": "discharge",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 58.23,
      "knowledgeFit": 52.83,
      "pathwayCoherence": 54.11,
      "decisionQuality": 57.98,
      "rehabOutlook": 57.68,
      "auditTrail": 49.88,
      "overall": 55.54
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.24,
      "knowledgeFit": 9.54,
      "pathwayCoherence": 20.71,
      "decisionQuality": 49.85,
      "rehabOutlook": 17.45,
      "auditTrail": 4.18,
      "overall": 25.88
    }
  },
  {
    "id": "mskcs-020",
    "input": {
      "streamCoverage": 0.62,
      "knowledgeGrounding": 0.59,
      "pathwayProgress": 0.63,
      "decisionTraceability": 0.62,
      "patientStability": 0.6,
      "rehabReadiness": 0.54,
      "evidenceFreshness": 0.62,
      "comorbidityLoad": 0.29,
      "episodeDays": 23,
      "careStage": "admission",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 50.12,
      "knowledgeFit": 46.26,
      "pathwayCoherence": 49.22,
      "decisionQuality": 51.95,
      "rehabOutlook": 50.63,
      "auditTrail": 49.46,
      "overall": 49.64
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 9.97,
      "knowledgeFit": 9.63,
      "pathwayCoherence": 21.05,
      "decisionQuality": 48.33,
      "rehabOutlook": 16.93,
      "auditTrail": 4.22,
      "overall": 25.31
    }
  },
  {
    "id": "mskcs-021",
    "input": {
      "streamCoverage": 0.66,
      "knowledgeGrounding": 0.63,
      "pathwayProgress": 0.62,
      "decisionTraceability": 0.66,
      "patientStability": 0.64,
      "rehabReadiness": 0.58,
      "evidenceFreshness": 0.66,
      "comorbidityLoad": 0.23,
      "episodeDays": 24,
      "careStage": "acute",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 63.6,
      "knowledgeFit": 58.71,
      "pathwayCoherence": 59.32,
      "decisionQuality": 65.06,
      "rehabOutlook": 62.5,
      "auditTrail": 57.44,
      "overall": 61.45
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.14,
      "knowledgeFit": 9.82,
      "pathwayCoherence": 20.86,
      "decisionQuality": 48.72,
      "rehabOutlook": 17.38,
      "auditTrail": 5.16,
      "overall": 25.65
    }
  },
  {
    "id": "mskcs-022",
    "input": {
      "streamCoverage": 0.7,
      "knowledgeGrounding": 0.68,
      "pathwayProgress": 0.66,
      "decisionTraceability": 0.69,
      "patientStability": 0.68,
      "rehabReadiness": 0.63,
      "evidenceFreshness": 0.7,
      "comorbidityLoad": 0.23,
      "episodeDays": 25,
      "careStage": "rehab",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 66.11,
      "knowledgeFit": 61.52,
      "pathwayCoherence": 61.78,
      "decisionQuality": 67.52,
      "rehabOutlook": 65.05,
      "auditTrail": 55.34,
      "overall": 63.54
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.41,
      "knowledgeFit": 10.16,
      "pathwayCoherence": 21.77,
      "decisionQuality": 54.12,
      "rehabOutlook": 17.77,
      "auditTrail": 6.08,
      "overall": 27.87
    }
  },
  {
    "id": "mskcs-023",
    "input": {
      "streamCoverage": 0.74,
      "knowledgeGrounding": 0.72,
      "pathwayProgress": 0.71,
      "decisionTraceability": 0.73,
      "patientStability": 0.72,
      "rehabReadiness": 0.67,
      "evidenceFreshness": 0.74,
      "comorbidityLoad": 0.23,
      "episodeDays": 26,
      "careStage": "discharge",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 67.18,
      "knowledgeFit": 62.77,
      "pathwayCoherence": 63.27,
      "decisionQuality": 68.73,
      "rehabOutlook": 66.11,
      "auditTrail": 58.32,
      "overall": 64.94
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.68,
      "knowledgeFit": 10.43,
      "pathwayCoherence": 22.74,
      "decisionQuality": 57.37,
      "rehabOutlook": 18.05,
      "auditTrail": 7.02,
      "overall": 29.35
    }
  },
  {
    "id": "mskcs-024",
    "input": {
      "streamCoverage": 0.78,
      "knowledgeGrounding": 0.69,
      "pathwayProgress": 0.69,
      "decisionTraceability": 0.68,
      "patientStability": 0.69,
      "rehabReadiness": 0.72,
      "evidenceFreshness": 0.72,
      "comorbidityLoad": 0.17,
      "episodeDays": 27,
      "careStage": "admission",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 66.62,
      "knowledgeFit": 59.26,
      "pathwayCoherence": 61.05,
      "decisionQuality": 65.24,
      "rehabOutlook": 66,
      "auditTrail": 62.18,
      "overall": 63.47
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.68,
      "knowledgeFit": 9.69,
      "pathwayCoherence": 22.26,
      "decisionQuality": 56.22,
      "rehabOutlook": 18.35,
      "auditTrail": 6.98,
      "overall": 28.85
    }
  },
  {
    "id": "mskcs-025",
    "input": {
      "streamCoverage": 0.75,
      "knowledgeGrounding": 0.73,
      "pathwayProgress": 0.74,
      "decisionTraceability": 0.72,
      "patientStability": 0.73,
      "rehabReadiness": 0.66,
      "evidenceFreshness": 0.76,
      "comorbidityLoad": 0.17,
      "episodeDays": 28,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 67.37,
      "knowledgeFit": 62.29,
      "pathwayCoherence": 63.83,
      "decisionQuality": 67.74,
      "rehabOutlook": 66.05,
      "auditTrail": 58.9,
      "overall": 64.83
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.58,
      "knowledgeFit": 10.21,
      "pathwayCoherence": 22.73,
      "decisionQuality": 58.25,
      "rehabOutlook": 17.84,
      "auditTrail": 6.92,
      "overall": 29.56
    }
  },
  {
    "id": "mskcs-026",
    "input": {
      "streamCoverage": 0.79,
      "knowledgeGrounding": 0.77,
      "pathwayProgress": 0.78,
      "decisionTraceability": 0.76,
      "patientStability": 0.77,
      "rehabReadiness": 0.7,
      "evidenceFreshness": 0.79,
      "comorbidityLoad": 0.18,
      "episodeDays": 29,
      "careStage": "rehab",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 74.87,
      "knowledgeFit": 69.69,
      "pathwayCoherence": 71.13,
      "decisionQuality": 75.56,
      "rehabOutlook": 73.3,
      "auditTrail": 61.74,
      "overall": 71.84
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.78,
      "knowledgeFit": 10.47,
      "pathwayCoherence": 23.51,
      "decisionQuality": 61.28,
      "rehabOutlook": 18.05,
      "auditTrail": 7.86,
      "overall": 30.91
    }
  },
  {
    "id": "mskcs-027",
    "input": {
      "streamCoverage": 0.83,
      "knowledgeGrounding": 0.82,
      "pathwayProgress": 0.77,
      "decisionTraceability": 0.8,
      "patientStability": 0.81,
      "rehabReadiness": 0.75,
      "evidenceFreshness": 0.83,
      "comorbidityLoad": 0.12,
      "episodeDays": 30,
      "careStage": "discharge",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 82.54,
      "knowledgeFit": 77.13,
      "pathwayCoherence": 75.65,
      "decisionQuality": 82.95,
      "rehabOutlook": 79.73,
      "auditTrail": 69.88,
      "overall": 78.69
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.69,
      "knowledgeFit": 10.48,
      "pathwayCoherence": 23.1,
      "decisionQuality": 62,
      "rehabOutlook": 18.14,
      "auditTrail": 8.9,
      "overall": 31.23
    }
  },
  {
    "id": "mskcs-028",
    "input": {
      "streamCoverage": 0.87,
      "knowledgeGrounding": 0.78,
      "pathwayProgress": 0.81,
      "decisionTraceability": 0.84,
      "patientStability": 0.78,
      "rehabReadiness": 0.79,
      "evidenceFreshness": 0.81,
      "comorbidityLoad": 0.12,
      "episodeDays": 31,
      "careStage": "admission",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 69.66,
      "knowledgeFit": 63.42,
      "pathwayCoherence": 64.55,
      "decisionQuality": 70.22,
      "rehabOutlook": 68.18,
      "auditTrail": 65.74,
      "overall": 67.1
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.92,
      "knowledgeFit": 10.3,
      "pathwayCoherence": 23.76,
      "decisionQuality": 65.38,
      "rehabOutlook": 18.4,
      "auditTrail": 9.84,
      "overall": 32.65
    }
  },
  {
    "id": "mskcs-029",
    "input": {
      "streamCoverage": 0.91,
      "knowledgeGrounding": 0.83,
      "pathwayProgress": 0.86,
      "decisionTraceability": 0.87,
      "patientStability": 0.82,
      "rehabReadiness": 0.84,
      "evidenceFreshness": 0.85,
      "comorbidityLoad": 0.12,
      "episodeDays": 32,
      "careStage": "acute",
      "planner": "ungrounded_llm"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 79.38,
      "knowledgeFit": 72.83,
      "pathwayCoherence": 74.05,
      "decisionQuality": 79.87,
      "rehabOutlook": 77.93,
      "auditTrail": 68.64,
      "overall": 76.03
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 11,
      "knowledgeFit": 10.45,
      "pathwayCoherence": 24.46,
      "decisionQuality": 68.96,
      "rehabOutlook": 18.49,
      "auditTrail": 10.76,
      "overall": 34.12
    }
  },
  {
    "id": "mskcs-030",
    "input": {
      "streamCoverage": 0.87,
      "knowledgeGrounding": 0.87,
      "pathwayProgress": 0.84,
      "decisionTraceability": 0.82,
      "patientStability": 0.86,
      "rehabReadiness": 0.78,
      "evidenceFreshness": 0.89,
      "comorbidityLoad": 0.06,
      "episodeDays": 33,
      "careStage": "rehab",
      "planner": "grounded"
    },
    "expectedEvidenceGrounded": {
      "mode": "evidence_grounded",
      "streamFit": 90.99,
      "knowledgeFit": 84.76,
      "pathwayCoherence": 84.47,
      "decisionQuality": 90.18,
      "rehabOutlook": 87.96,
      "auditTrail": 73.02,
      "overall": 86.25
    },
    "expectedUngroundedLlm": {
      "mode": "ungrounded_llm",
      "streamFit": 10.62,
      "knowledgeFit": 10.34,
      "pathwayCoherence": 23.63,
      "decisionQuality": 65.94,
      "rehabOutlook": 17.96,
      "auditTrail": 9.62,
      "overall": 32.68
    }
  }
];
