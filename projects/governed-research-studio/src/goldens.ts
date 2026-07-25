import type { ResearchInput, ResearchQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ResearchInput;
  expectedGoverned: ResearchQuality;
  expectedUngated: ResearchQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "grs-001",
    "input": {
      "gateCoverage": 0.29,
      "workflowIntegrity": 0.25,
      "evidenceProvenance": 0.28,
      "privacyControl": 0.34,
      "ungatedPassRate": 0.39,
      "agentOptimism": 0.45,
      "studyHardness": 0.59,
      "leakageRisk": 0.5,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 22.56,
      "workflowScore": 30.25,
      "evidenceScore": 23.49,
      "privacyScore": 37.64,
      "ungatedScore": 16.4,
      "confidence": 19.35,
      "governedContribution": 27.98,
      "ungatedContribution": 15.96,
      "overall": 29.82
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 5.76,
      "workflowScore": 17.09,
      "evidenceScore": 13.13,
      "privacyScore": 32.39,
      "ungatedScore": 40.93,
      "confidence": 17.1,
      "governedContribution": 21.86,
      "ungatedContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "grs-002",
    "input": {
      "gateCoverage": 0.33,
      "workflowIntegrity": 0.29,
      "evidenceProvenance": 0.32,
      "privacyControl": 0.38,
      "ungatedPassRate": 0.43,
      "agentOptimism": 0.46,
      "studyHardness": 0.6,
      "leakageRisk": 0.51,
      "researchBias": "workflow_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 22.22,
      "workflowScore": 33.9,
      "evidenceScore": 34.39,
      "privacyScore": 31.9,
      "ungatedScore": 18.89,
      "confidence": 23,
      "governedContribution": 30.56,
      "ungatedContribution": 18.61,
      "overall": 32.41
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 2.43,
      "workflowScore": 18.22,
      "evidenceScore": 14.16,
      "privacyScore": 34.08,
      "ungatedScore": 31.53,
      "confidence": 18.65,
      "governedContribution": 20.08,
      "ungatedContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "grs-003",
    "input": {
      "gateCoverage": 0.37,
      "workflowIntegrity": 0.27,
      "evidenceProvenance": 0.36,
      "privacyControl": 0.42,
      "ungatedPassRate": 0.46,
      "agentOptimism": 0.42,
      "studyHardness": 0.6,
      "leakageRisk": 0.46,
      "researchBias": "agent_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 12.18,
      "workflowScore": 23.71,
      "evidenceScore": 20.95,
      "privacyScore": 19.24,
      "ungatedScore": 19.94,
      "confidence": 25.6,
      "governedContribution": 18.96,
      "ungatedContribution": 19.69,
      "overall": 20.09
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 12.17,
      "workflowScore": 17.1,
      "evidenceScore": 13.13,
      "privacyScore": 33.93,
      "ungatedScore": 54.34,
      "confidence": 18.4,
      "governedContribution": 26.13,
      "ungatedContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "grs-004",
    "input": {
      "gateCoverage": 0.33,
      "workflowIntegrity": 0.32,
      "evidenceProvenance": 0.39,
      "privacyControl": 0.38,
      "ungatedPassRate": 0.42,
      "agentOptimism": 0.43,
      "studyHardness": 0.53,
      "leakageRisk": 0.46,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 28.09,
      "workflowScore": 36.03,
      "evidenceScore": 33.07,
      "privacyScore": 42.23,
      "ungatedScore": 18.93,
      "confidence": 26.1,
      "governedContribution": 34.5,
      "ungatedContribution": 19.05,
      "overall": 35.72
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 8.7,
      "workflowScore": 17.81,
      "evidenceScore": 13.75,
      "privacyScore": 32.79,
      "ungatedScore": 42.77,
      "confidence": 18.85,
      "governedContribution": 23.16,
      "ungatedContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "grs-005",
    "input": {
      "gateCoverage": 0.37,
      "workflowIntegrity": 0.36,
      "evidenceProvenance": 0.35,
      "privacyControl": 0.42,
      "ungatedPassRate": 0.46,
      "agentOptimism": 0.45,
      "studyHardness": 0.53,
      "leakageRisk": 0.47,
      "researchBias": "gate_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 26.86,
      "workflowScore": 39.64,
      "evidenceScore": 21.39,
      "privacyScore": 54.3,
      "ungatedScore": 21.8,
      "confidence": 27.6,
      "governedContribution": 34.43,
      "ungatedContribution": 22.19,
      "overall": 36.23
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 0,
      "workflowScore": 19.51,
      "evidenceScore": 15.76,
      "privacyScore": 34.77,
      "ungatedScore": 32.95,
      "confidence": 21.05,
      "governedContribution": 20.6,
      "ungatedContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "grs-006",
    "input": {
      "gateCoverage": 0.41,
      "workflowIntegrity": 0.34,
      "evidenceProvenance": 0.39,
      "privacyControl": 0.45,
      "ungatedPassRate": 0.5,
      "agentOptimism": 0.4,
      "studyHardness": 0.54,
      "leakageRisk": 0.42,
      "researchBias": "balanced",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 33.94,
      "workflowScore": 39.5,
      "evidenceScore": 35.84,
      "privacyScore": 47.85,
      "ungatedScore": 23.08,
      "confidence": 30.35,
      "governedContribution": 38.87,
      "ungatedContribution": 23.38,
      "overall": 40.08
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 11.98,
      "workflowScore": 18.04,
      "evidenceScore": 14.31,
      "privacyScore": 34.78,
      "ungatedScore": 46.72,
      "confidence": 20.5,
      "governedContribution": 25.17,
      "ungatedContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "grs-007",
    "input": {
      "gateCoverage": 0.45,
      "workflowIntegrity": 0.38,
      "evidenceProvenance": 0.42,
      "privacyControl": 0.49,
      "ungatedPassRate": 0.53,
      "agentOptimism": 0.42,
      "studyHardness": 0.55,
      "leakageRisk": 0.43,
      "researchBias": "workflow_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 31.59,
      "workflowScore": 43.11,
      "evidenceScore": 48.37,
      "privacyScore": 39.34,
      "ungatedScore": 25.15,
      "confidence": 33.6,
      "governedContribution": 40.76,
      "ungatedContribution": 25.64,
      "overall": 42.04
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 8.27,
      "workflowScore": 19.34,
      "evidenceScore": 15.59,
      "privacyScore": 36.3,
      "ungatedScore": 34.2,
      "confidence": 22.15,
      "governedContribution": 22.74,
      "ungatedContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "grs-008",
    "input": {
      "gateCoverage": 0.41,
      "workflowIntegrity": 0.43,
      "evidenceProvenance": 0.46,
      "privacyControl": 0.45,
      "ungatedPassRate": 0.49,
      "agentOptimism": 0.43,
      "studyHardness": 0.47,
      "leakageRisk": 0.44,
      "researchBias": "agent_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 19.33,
      "workflowScore": 35.43,
      "evidenceScore": 27.62,
      "privacyScore": 24.76,
      "ungatedScore": 24.32,
      "confidence": 34.35,
      "governedContribution": 26.71,
      "ungatedContribution": 25.23,
      "overall": 27.44
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 16.4,
      "workflowScore": 20.18,
      "evidenceScore": 16.31,
      "privacyScore": 35.17,
      "ungatedScore": 58.5,
      "confidence": 22.7,
      "governedContribution": 29.31,
      "ungatedContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "grs-009",
    "input": {
      "gateCoverage": 0.46,
      "workflowIntegrity": 0.41,
      "evidenceProvenance": 0.5,
      "privacyControl": 0.49,
      "ungatedPassRate": 0.53,
      "agentOptimism": 0.39,
      "studyHardness": 0.48,
      "leakageRisk": 0.38,
      "researchBias": "balanced",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 40.05,
      "workflowScore": 45.49,
      "evidenceScore": 45.68,
      "privacyScore": 52.59,
      "ungatedScore": 25.81,
      "confidence": 37.35,
      "governedContribution": 45.69,
      "ungatedContribution": 26.69,
      "overall": 46.27
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 14.91,
      "workflowScore": 19.07,
      "evidenceScore": 15.29,
      "privacyScore": 35.36,
      "ungatedScore": 48.88,
      "confidence": 22.7,
      "governedContribution": 26.7,
      "ungatedContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "grs-010",
    "input": {
      "gateCoverage": 0.5,
      "workflowIntegrity": 0.45,
      "evidenceProvenance": 0.46,
      "privacyControl": 0.53,
      "ungatedPassRate": 0.57,
      "agentOptimism": 0.4,
      "studyHardness": 0.49,
      "leakageRisk": 0.39,
      "researchBias": "gate_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 36.62,
      "workflowScore": 49.14,
      "evidenceScore": 30.65,
      "privacyScore": 66.82,
      "ungatedScore": 28.29,
      "confidence": 39,
      "governedContribution": 44.6,
      "ungatedContribution": 29.32,
      "overall": 45.85
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 3.59,
      "workflowScore": 20.18,
      "evidenceScore": 16.7,
      "privacyScore": 37.06,
      "ungatedScore": 35.54,
      "confidence": 24.25,
      "governedContribution": 22.61,
      "ungatedContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "grs-011",
    "input": {
      "gateCoverage": 0.54,
      "workflowIntegrity": 0.49,
      "evidenceProvenance": 0.49,
      "privacyControl": 0.57,
      "ungatedPassRate": 0.6,
      "agentOptimism": 0.42,
      "studyHardness": 0.49,
      "leakageRisk": 0.4,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 47.21,
      "workflowScore": 52.75,
      "evidenceScore": 47.19,
      "privacyScore": 60.27,
      "ungatedScore": 30.54,
      "confidence": 42.25,
      "governedContribution": 51.41,
      "ungatedContribution": 31.82,
      "overall": 51.88
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 17.1,
      "workflowScore": 21.62,
      "evidenceScore": 18.14,
      "privacyScore": 38.58,
      "ungatedScore": 54.12,
      "confidence": 26.1,
      "governedContribution": 29.91,
      "ungatedContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "grs-012",
    "input": {
      "gateCoverage": 0.5,
      "workflowIntegrity": 0.48,
      "evidenceProvenance": 0.53,
      "privacyControl": 0.53,
      "ungatedPassRate": 0.56,
      "agentOptimism": 0.37,
      "studyHardness": 0.42,
      "leakageRisk": 0.35,
      "researchBias": "workflow_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 38.19,
      "workflowScore": 51.28,
      "evidenceScore": 61.94,
      "privacyScore": 43.82,
      "ungatedScore": 28.34,
      "confidence": 42.1,
      "governedContribution": 49.22,
      "ungatedContribution": 29.7,
      "overall": 49.71
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 13.23,
      "workflowScore": 19.68,
      "evidenceScore": 16.17,
      "privacyScore": 35.76,
      "ungatedScore": 34.93,
      "confidence": 24.35,
      "governedContribution": 23.95,
      "ungatedContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "grs-013",
    "input": {
      "gateCoverage": 0.54,
      "workflowIntegrity": 0.52,
      "evidenceProvenance": 0.56,
      "privacyControl": 0.57,
      "ungatedPassRate": 0.6,
      "agentOptimism": 0.39,
      "studyHardness": 0.42,
      "leakageRisk": 0.36,
      "researchBias": "agent_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 29.13,
      "workflowScore": 44.88,
      "evidenceScore": 36.59,
      "privacyScore": 32.66,
      "ungatedScore": 31.2,
      "confidence": 45.35,
      "governedContribution": 35.78,
      "ungatedContribution": 32.8,
      "overall": 36.24
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 22.62,
      "workflowScore": 21.35,
      "evidenceScore": 17.8,
      "privacyScore": 37.74,
      "ungatedScore": 67.02,
      "confidence": 26.55,
      "governedContribution": 33.31,
      "ungatedContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "grs-014",
    "input": {
      "gateCoverage": 0.58,
      "workflowIntegrity": 0.56,
      "evidenceProvenance": 0.6,
      "privacyControl": 0.61,
      "ungatedPassRate": 0.63,
      "agentOptimism": 0.4,
      "studyHardness": 0.43,
      "leakageRisk": 0.36,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 52.62,
      "workflowScore": 58.53,
      "evidenceScore": 56.66,
      "privacyScore": 64.86,
      "ungatedScore": 33.07,
      "confidence": 49,
      "governedContribution": 57.86,
      "ungatedContribution": 34.8,
      "overall": 57.71
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 20.03,
      "workflowScore": 22.2,
      "evidenceScore": 18.59,
      "privacyScore": 38.98,
      "ungatedScore": 55.96,
      "confidence": 27.85,
      "governedContribution": 31.15,
      "ungatedContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "grs-015",
    "input": {
      "gateCoverage": 0.62,
      "workflowIntegrity": 0.54,
      "evidenceProvenance": 0.56,
      "privacyControl": 0.65,
      "ungatedPassRate": 0.67,
      "agentOptimism": 0.36,
      "studyHardness": 0.44,
      "leakageRisk": 0.31,
      "researchBias": "gate_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 45.9,
      "workflowScore": 58.35,
      "evidenceScore": 39.3,
      "privacyScore": 79.94,
      "ungatedScore": 34.55,
      "confidence": 49.6,
      "governedContribution": 54.53,
      "ungatedContribution": 36.22,
      "overall": 55.23
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 9.43,
      "workflowScore": 21.14,
      "evidenceScore": 17.93,
      "privacyScore": 39.27,
      "ungatedScore": 38.2,
      "confidence": 27.75,
      "governedContribution": 25.19,
      "ungatedContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "grs-016",
    "input": {
      "gateCoverage": 0.58,
      "workflowIntegrity": 0.59,
      "evidenceProvenance": 0.6,
      "privacyControl": 0.6,
      "ungatedPassRate": 0.63,
      "agentOptimism": 0.37,
      "studyHardness": 0.36,
      "leakageRisk": 0.32,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 54.46,
      "workflowScore": 60.67,
      "evidenceScore": 57.87,
      "privacyScore": 65.05,
      "ungatedScore": 33.73,
      "confidence": 50.35,
      "governedContribution": 59.24,
      "ungatedContribution": 35.76,
      "overall": 59.01
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 22.05,
      "workflowScore": 21.91,
      "evidenceScore": 18.56,
      "privacyScore": 38.14,
      "ungatedScore": 55.7,
      "confidence": 28.3,
      "governedContribution": 31.27,
      "ungatedContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "grs-017",
    "input": {
      "gateCoverage": 0.62,
      "workflowIntegrity": 0.63,
      "evidenceProvenance": 0.63,
      "privacyControl": 0.64,
      "ungatedPassRate": 0.67,
      "agentOptimism": 0.39,
      "studyHardness": 0.37,
      "leakageRisk": 0.33,
      "researchBias": "workflow_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 48.43,
      "workflowScore": 64.28,
      "evidenceScore": 75.13,
      "privacyScore": 52.76,
      "ungatedScore": 36.41,
      "confidence": 53.6,
      "governedContribution": 60.66,
      "ungatedContribution": 38.61,
      "overall": 60.69
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 18.73,
      "workflowScore": 23.42,
      "evidenceScore": 20,
      "privacyScore": 40.11,
      "ungatedScore": 39.86,
      "confidence": 30.3,
      "governedContribution": 28.42,
      "ungatedContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "grs-018",
    "input": {
      "gateCoverage": 0.66,
      "workflowIntegrity": 0.61,
      "evidenceProvenance": 0.67,
      "privacyControl": 0.68,
      "ungatedPassRate": 0.7,
      "agentOptimism": 0.34,
      "studyHardness": 0.38,
      "leakageRisk": 0.27,
      "researchBias": "agent_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 38.33,
      "workflowScore": 54.13,
      "evidenceScore": 45.52,
      "privacyScore": 40.09,
      "ungatedScore": 37.08,
      "confidence": 56.35,
      "governedContribution": 44.52,
      "ungatedContribution": 39.16,
      "overall": 44.56
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 28.36,
      "workflowScore": 21.66,
      "evidenceScore": 18.31,
      "privacyScore": 39.67,
      "ungatedScore": 74.27,
      "confidence": 29.5,
      "governedContribution": 36.45,
      "ungatedContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "grs-019",
    "input": {
      "gateCoverage": 0.7,
      "workflowIntegrity": 0.65,
      "evidenceProvenance": 0.7,
      "privacyControl": 0.72,
      "ungatedPassRate": 0.74,
      "agentOptimism": 0.36,
      "studyHardness": 0.38,
      "leakageRisk": 0.28,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 63.81,
      "workflowScore": 67.74,
      "evidenceScore": 68.17,
      "privacyScore": 75.07,
      "ungatedScore": 39.94,
      "confidence": 59.6,
      "governedContribution": 68.45,
      "ungatedContribution": 42.25,
      "overall": 67.73
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 26.25,
      "workflowScore": 23.32,
      "evidenceScore": 19.92,
      "privacyScore": 41.65,
      "ungatedScore": 62.07,
      "confidence": 31.7,
      "governedContribution": 34.64,
      "ungatedContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "grs-020",
    "input": {
      "gateCoverage": 0.66,
      "workflowIntegrity": 0.7,
      "evidenceProvenance": 0.66,
      "privacyControl": 0.68,
      "ungatedPassRate": 0.7,
      "agentOptimism": 0.37,
      "studyHardness": 0.31,
      "leakageRisk": 0.29,
      "researchBias": "gate_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 52.86,
      "workflowScore": 70.06,
      "evidenceScore": 45.74,
      "privacyScore": 86.81,
      "ungatedScore": 38.94,
      "confidence": 58.35,
      "governedContribution": 62.46,
      "ungatedContribution": 41.54,
      "overall": 62.69
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 13.66,
      "workflowScore": 23.93,
      "evidenceScore": 20.75,
      "privacyScore": 40.51,
      "ungatedScore": 40.86,
      "confidence": 32.05,
      "governedContribution": 27.94,
      "ungatedContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "grs-021",
    "input": {
      "gateCoverage": 0.7,
      "workflowIntegrity": 0.68,
      "evidenceProvenance": 0.7,
      "privacyControl": 0.72,
      "ungatedPassRate": 0.73,
      "agentOptimism": 0.33,
      "studyHardness": 0.31,
      "leakageRisk": 0.24,
      "researchBias": "balanced",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 65.6,
      "workflowScore": 69.88,
      "evidenceScore": 69.32,
      "privacyScore": 75.82,
      "ungatedScore": 39.99,
      "confidence": 60.95,
      "governedContribution": 69.92,
      "ungatedContribution": 42.54,
      "overall": 68.99
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 27.89,
      "workflowScore": 22.72,
      "evidenceScore": 19.62,
      "privacyScore": 40.35,
      "ungatedScore": 61.19,
      "confidence": 31.8,
      "governedContribution": 34.35,
      "ungatedContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "grs-022",
    "input": {
      "gateCoverage": 0.74,
      "workflowIntegrity": 0.72,
      "evidenceProvenance": 0.73,
      "privacyControl": 0.76,
      "ungatedPassRate": 0.77,
      "agentOptimism": 0.34,
      "studyHardness": 0.32,
      "leakageRisk": 0.25,
      "researchBias": "workflow_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 57.62,
      "workflowScore": 73.52,
      "evidenceScore": 88.86,
      "privacyScore": 60.51,
      "ungatedScore": 42.47,
      "confidence": 64.35,
      "governedContribution": 70.82,
      "ungatedContribution": 45.15,
      "overall": 70.2
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 24.57,
      "workflowScore": 23.79,
      "evidenceScore": 20.63,
      "privacyScore": 42.05,
      "ungatedScore": 42.21,
      "confidence": 33.35,
      "governedContribution": 30.65,
      "ungatedContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "grs-023",
    "input": {
      "gateCoverage": 0.79,
      "workflowIntegrity": 0.76,
      "evidenceProvenance": 0.77,
      "privacyControl": 0.8,
      "ungatedPassRate": 0.81,
      "agentOptimism": 0.36,
      "studyHardness": 0.33,
      "leakageRisk": 0.25,
      "researchBias": "agent_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 49.04,
      "workflowScore": 67.38,
      "evidenceScore": 53.74,
      "privacyScore": 49.49,
      "ungatedScore": 45.16,
      "confidence": 68.25,
      "governedContribution": 54.86,
      "ungatedContribution": 48.03,
      "overall": 54.63
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 33.86,
      "workflowScore": 25.25,
      "evidenceScore": 22.05,
      "privacyScore": 43.92,
      "ungatedScore": 84.72,
      "confidence": 35.45,
      "governedContribution": 41.96,
      "ungatedContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "grs-024",
    "input": {
      "gateCoverage": 0.75,
      "workflowIntegrity": 0.75,
      "evidenceProvenance": 0.81,
      "privacyControl": 0.76,
      "ungatedPassRate": 0.77,
      "agentOptimism": 0.31,
      "studyHardness": 0.25,
      "leakageRisk": 0.2,
      "researchBias": "balanced",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 71.55,
      "workflowScore": 75.91,
      "evidenceScore": 78.99,
      "privacyScore": 80.56,
      "ungatedScore": 43.13,
      "confidence": 68.1,
      "governedContribution": 76.66,
      "ungatedContribution": 46.07,
      "overall": 75.15
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 31.21,
      "workflowScore": 23.36,
      "evidenceScore": 20.13,
      "privacyScore": 41.11,
      "ungatedScore": 63.65,
      "confidence": 33.9,
      "governedContribution": 35.89,
      "ungatedContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "grs-025",
    "input": {
      "gateCoverage": 0.79,
      "workflowIntegrity": 0.79,
      "evidenceProvenance": 0.77,
      "privacyControl": 0.8,
      "ungatedPassRate": 0.8,
      "agentOptimism": 0.33,
      "studyHardness": 0.26,
      "leakageRisk": 0.21,
      "researchBias": "gate_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 62.51,
      "workflowScore": 79.52,
      "evidenceScore": 54.86,
      "privacyScore": 100,
      "ungatedScore": 45.2,
      "confidence": 69.6,
      "governedContribution": 72.7,
      "ungatedContribution": 48.27,
      "overall": 72.3
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 19.5,
      "workflowScore": 24.6,
      "evidenceScore": 21.69,
      "privacyScore": 42.63,
      "ungatedScore": 43.52,
      "confidence": 35.55,
      "governedContribution": 30.39,
      "ungatedContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "grs-026",
    "input": {
      "gateCoverage": 0.83,
      "workflowIntegrity": 0.83,
      "evidenceProvenance": 0.8,
      "privacyControl": 0.83,
      "ungatedPassRate": 0.84,
      "agentOptimism": 0.34,
      "studyHardness": 0.27,
      "leakageRisk": 0.22,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 78.52,
      "workflowScore": 83.17,
      "evidenceScore": 80.3,
      "privacyScore": 87.68,
      "ungatedScore": 47.68,
      "confidence": 73,
      "governedContribution": 82.15,
      "ungatedContribution": 50.87,
      "overall": 80.52
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 33.17,
      "workflowScore": 25.67,
      "evidenceScore": 22.7,
      "privacyScore": 44.32,
      "ungatedScore": 68.8,
      "confidence": 37.1,
      "governedContribution": 38.93,
      "ungatedContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "grs-027",
    "input": {
      "gateCoverage": 0.87,
      "workflowIntegrity": 0.81,
      "evidenceProvenance": 0.84,
      "privacyControl": 0.87,
      "ungatedPassRate": 0.88,
      "agentOptimism": 0.3,
      "studyHardness": 0.27,
      "leakageRisk": 0.17,
      "researchBias": "workflow_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 67.26,
      "workflowScore": 82.98,
      "evidenceScore": 100,
      "privacyScore": 68.1,
      "ungatedScore": 49.35,
      "confidence": 75.6,
      "governedContribution": 80.38,
      "ungatedContribution": 52.5,
      "overall": 79.36
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 30.78,
      "workflowScore": 24.7,
      "evidenceScore": 21.75,
      "privacyScore": 44.62,
      "ungatedScore": 45.22,
      "confidence": 37.2,
      "governedContribution": 33.41,
      "ungatedContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "grs-028",
    "input": {
      "gateCoverage": 0.83,
      "workflowIntegrity": 0.86,
      "evidenceProvenance": 0.87,
      "privacyControl": 0.83,
      "ungatedPassRate": 0.84,
      "agentOptimism": 0.31,
      "studyHardness": 0.2,
      "leakageRisk": 0.17,
      "researchBias": "agent_first",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 54.87,
      "workflowScore": 75.3,
      "evidenceScore": 60.62,
      "privacyScore": 53.51,
      "ungatedScore": 48.34,
      "confidence": 76.1,
      "governedContribution": 61.08,
      "ungatedContribution": 51.73,
      "overall": 60.4
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 38.81,
      "workflowScore": 25.25,
      "evidenceScore": 22.17,
      "privacyScore": 43.48,
      "ungatedScore": 86.95,
      "confidence": 37.65,
      "governedContribution": 43.33,
      "ungatedContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "grs-029",
    "input": {
      "gateCoverage": 0.87,
      "workflowIntegrity": 0.9,
      "evidenceProvenance": 0.91,
      "privacyControl": 0.87,
      "ungatedPassRate": 0.87,
      "agentOptimism": 0.33,
      "studyHardness": 0.2,
      "leakageRisk": 0.18,
      "researchBias": "balanced",
      "profile": "governed"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 83.89,
      "workflowScore": 88.91,
      "evidenceScore": 89.72,
      "privacyScore": 92.27,
      "ungatedScore": 50.59,
      "confidence": 79.6,
      "governedContribution": 88.57,
      "ungatedContribution": 54.16,
      "overall": 86.38
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 36.33,
      "workflowScore": 26.6,
      "evidenceScore": 23.46,
      "privacyScore": 45,
      "ungatedScore": 71.06,
      "confidence": 39.5,
      "governedContribution": 40.49,
      "ungatedContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "grs-030",
    "input": {
      "gateCoverage": 0.91,
      "workflowIntegrity": 0.88,
      "evidenceProvenance": 0.87,
      "privacyControl": 0.91,
      "ungatedPassRate": 0.91,
      "agentOptimism": 0.28,
      "studyHardness": 0.21,
      "leakageRisk": 0.13,
      "researchBias": "gate_first",
      "profile": "ungated"
    },
    "expectedGoverned": {
      "mode": "governed",
      "gateScore": 71.59,
      "workflowScore": 88.77,
      "evidenceScore": 63.26,
      "privacyScore": 100,
      "ungatedScore": 51.88,
      "confidence": 80.35,
      "governedContribution": 79.63,
      "ungatedContribution": 55.31,
      "overall": 79.25
    },
    "expectedUngated": {
      "mode": "ungated",
      "gateScore": 25.72,
      "workflowScore": 25.06,
      "evidenceScore": 22.34,
      "privacyScore": 45.02,
      "ungatedScore": 46.21,
      "confidence": 38.95,
      "governedContribution": 32.87,
      "ungatedContribution": 50.68,
      "overall": 44.3
    }
  }
];
