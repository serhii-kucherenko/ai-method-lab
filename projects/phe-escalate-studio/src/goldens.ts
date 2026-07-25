import type { PheInput, PheQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PheInput;
  expectedAi: PheQuality;
  expectedTriage: PheQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pe-001",
    "input": {
      "signalClarity": 0.29,
      "caseVelocity": 0.25,
      "geoSpreadProxy": 0.28,
      "labConfirmProxy": 0.34,
      "manualTriageBreadth": 0.39,
      "baselineOptimism": 0.45,
      "escalationHardness": 0.59,
      "overclaimRisk": 0.5,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 22.53,
      "velocityScore": 30.25,
      "spreadScore": 23.45,
      "confirmIntegrity": 37.64,
      "triageScore": 16.4,
      "confidence": 20.85,
      "aiContribution": 27.96,
      "triageContribution": 15.92,
      "overall": 29.79
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 5.76,
      "velocityScore": 17.05,
      "spreadScore": 12.78,
      "confirmIntegrity": 32.39,
      "triageScore": 40.93,
      "confidence": 17.1,
      "aiContribution": 21.78,
      "triageContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "pe-002",
    "input": {
      "signalClarity": 0.33,
      "caseVelocity": 0.29,
      "geoSpreadProxy": 0.32,
      "labConfirmProxy": 0.38,
      "manualTriageBreadth": 0.43,
      "baselineOptimism": 0.46,
      "escalationHardness": 0.6,
      "overclaimRisk": 0.51,
      "escalationBias": "case_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 22.19,
      "velocityScore": 33.9,
      "spreadScore": 34.35,
      "confirmIntegrity": 31.9,
      "triageScore": 18.89,
      "confidence": 24.5,
      "aiContribution": 30.54,
      "triageContribution": 18.58,
      "overall": 32.39
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 2.43,
      "velocityScore": 18.17,
      "spreadScore": 13.81,
      "confirmIntegrity": 34.08,
      "triageScore": 31.53,
      "confidence": 18.65,
      "aiContribution": 20,
      "triageContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "pe-003",
    "input": {
      "signalClarity": 0.37,
      "caseVelocity": 0.27,
      "geoSpreadProxy": 0.36,
      "labConfirmProxy": 0.42,
      "manualTriageBreadth": 0.46,
      "baselineOptimism": 0.42,
      "escalationHardness": 0.6,
      "overclaimRisk": 0.46,
      "escalationBias": "triage_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 12.16,
      "velocityScore": 23.71,
      "spreadScore": 20.92,
      "confirmIntegrity": 19.24,
      "triageScore": 19.94,
      "confidence": 27.1,
      "aiContribution": 18.94,
      "triageContribution": 19.65,
      "overall": 20.07
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 12.17,
      "velocityScore": 17.05,
      "spreadScore": 12.78,
      "confirmIntegrity": 33.93,
      "triageScore": 54.34,
      "confidence": 18.4,
      "aiContribution": 26.05,
      "triageContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "pe-004",
    "input": {
      "signalClarity": 0.33,
      "caseVelocity": 0.32,
      "geoSpreadProxy": 0.39,
      "labConfirmProxy": 0.38,
      "manualTriageBreadth": 0.42,
      "baselineOptimism": 0.43,
      "escalationHardness": 0.53,
      "overclaimRisk": 0.46,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 28.27,
      "velocityScore": 36.03,
      "spreadScore": 33.26,
      "confirmIntegrity": 42.23,
      "triageScore": 18.93,
      "confidence": 25.85,
      "aiContribution": 34.6,
      "triageContribution": 19.24,
      "overall": 35.84
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 8.7,
      "velocityScore": 18.05,
      "spreadScore": 14.08,
      "confirmIntegrity": 32.79,
      "triageScore": 42.77,
      "confidence": 18.85,
      "aiContribution": 23.28,
      "triageContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "pe-005",
    "input": {
      "signalClarity": 0.37,
      "caseVelocity": 0.36,
      "geoSpreadProxy": 0.35,
      "labConfirmProxy": 0.42,
      "manualTriageBreadth": 0.46,
      "baselineOptimism": 0.45,
      "escalationHardness": 0.53,
      "overclaimRisk": 0.47,
      "escalationBias": "signal_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 26.81,
      "velocityScore": 39.64,
      "spreadScore": 21.33,
      "confirmIntegrity": 54.3,
      "triageScore": 21.8,
      "confidence": 29.35,
      "aiContribution": 34.4,
      "triageContribution": 22.12,
      "overall": 36.19
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 0,
      "velocityScore": 19.43,
      "spreadScore": 15.31,
      "confirmIntegrity": 34.77,
      "triageScore": 32.95,
      "confidence": 21.05,
      "aiContribution": 20.49,
      "triageContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "pe-006",
    "input": {
      "signalClarity": 0.41,
      "caseVelocity": 0.34,
      "geoSpreadProxy": 0.39,
      "labConfirmProxy": 0.45,
      "manualTriageBreadth": 0.5,
      "baselineOptimism": 0.4,
      "escalationHardness": 0.54,
      "overclaimRisk": 0.42,
      "escalationBias": "balanced",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 33.88,
      "velocityScore": 39.5,
      "spreadScore": 35.78,
      "confirmIntegrity": 47.85,
      "triageScore": 23.08,
      "confidence": 31.85,
      "aiContribution": 38.83,
      "triageContribution": 23.32,
      "overall": 40.04
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 11.98,
      "velocityScore": 17.95,
      "spreadScore": 13.91,
      "confirmIntegrity": 34.78,
      "triageScore": 46.72,
      "confidence": 20.5,
      "aiContribution": 25.07,
      "triageContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "pe-007",
    "input": {
      "signalClarity": 0.45,
      "caseVelocity": 0.38,
      "geoSpreadProxy": 0.42,
      "labConfirmProxy": 0.49,
      "manualTriageBreadth": 0.53,
      "baselineOptimism": 0.42,
      "escalationHardness": 0.55,
      "overclaimRisk": 0.43,
      "escalationBias": "case_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 31.52,
      "velocityScore": 43.11,
      "spreadScore": 48.27,
      "confirmIntegrity": 39.34,
      "triageScore": 25.15,
      "confidence": 35.35,
      "aiContribution": 40.71,
      "triageContribution": 25.54,
      "overall": 41.98
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 8.27,
      "velocityScore": 19.21,
      "spreadScore": 15.09,
      "confirmIntegrity": 36.3,
      "triageScore": 34.2,
      "confidence": 22.15,
      "aiContribution": 22.61,
      "triageContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "pe-008",
    "input": {
      "signalClarity": 0.41,
      "caseVelocity": 0.43,
      "geoSpreadProxy": 0.46,
      "labConfirmProxy": 0.45,
      "manualTriageBreadth": 0.49,
      "baselineOptimism": 0.43,
      "escalationHardness": 0.47,
      "overclaimRisk": 0.44,
      "escalationBias": "triage_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 19.43,
      "velocityScore": 35.43,
      "spreadScore": 27.76,
      "confirmIntegrity": 24.76,
      "triageScore": 24.32,
      "confidence": 34.1,
      "aiContribution": 26.78,
      "triageContribution": 25.37,
      "overall": 27.53
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 16.4,
      "velocityScore": 20.36,
      "spreadScore": 16.57,
      "confirmIntegrity": 35.17,
      "triageScore": 58.5,
      "confidence": 22.7,
      "aiContribution": 29.4,
      "triageContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "pe-009",
    "input": {
      "signalClarity": 0.46,
      "caseVelocity": 0.41,
      "geoSpreadProxy": 0.5,
      "labConfirmProxy": 0.49,
      "manualTriageBreadth": 0.53,
      "baselineOptimism": 0.39,
      "escalationHardness": 0.48,
      "overclaimRisk": 0.38,
      "escalationBias": "balanced",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 40.16,
      "velocityScore": 45.49,
      "spreadScore": 45.8,
      "confirmIntegrity": 52.59,
      "triageScore": 25.81,
      "confidence": 37.1,
      "aiContribution": 45.75,
      "triageContribution": 26.81,
      "overall": 46.34
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 14.91,
      "velocityScore": 19.22,
      "spreadScore": 15.52,
      "confirmIntegrity": 35.36,
      "triageScore": 48.88,
      "confidence": 22.7,
      "aiContribution": 26.78,
      "triageContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "pe-010",
    "input": {
      "signalClarity": 0.5,
      "caseVelocity": 0.45,
      "geoSpreadProxy": 0.46,
      "labConfirmProxy": 0.53,
      "manualTriageBreadth": 0.57,
      "baselineOptimism": 0.4,
      "escalationHardness": 0.49,
      "overclaimRisk": 0.39,
      "escalationBias": "signal_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 36.53,
      "velocityScore": 49.14,
      "spreadScore": 30.54,
      "confirmIntegrity": 66.82,
      "triageScore": 28.29,
      "confidence": 40.75,
      "aiContribution": 44.54,
      "triageContribution": 29.21,
      "overall": 45.78
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 3.59,
      "velocityScore": 20.03,
      "spreadScore": 16.17,
      "confirmIntegrity": 37.06,
      "triageScore": 35.54,
      "confidence": 24.25,
      "aiContribution": 22.48,
      "triageContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "pe-011",
    "input": {
      "signalClarity": 0.54,
      "caseVelocity": 0.49,
      "geoSpreadProxy": 0.49,
      "labConfirmProxy": 0.57,
      "manualTriageBreadth": 0.6,
      "baselineOptimism": 0.42,
      "escalationHardness": 0.49,
      "overclaimRisk": 0.4,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 47.07,
      "velocityScore": 52.75,
      "spreadScore": 47.04,
      "confirmIntegrity": 60.27,
      "triageScore": 30.54,
      "confidence": 44.25,
      "aiContribution": 51.33,
      "triageContribution": 31.67,
      "overall": 51.79
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 17.1,
      "velocityScore": 21.44,
      "spreadScore": 17.52,
      "confirmIntegrity": 38.58,
      "triageScore": 54.12,
      "confidence": 26.1,
      "aiContribution": 29.75,
      "triageContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "pe-012",
    "input": {
      "signalClarity": 0.5,
      "caseVelocity": 0.48,
      "geoSpreadProxy": 0.53,
      "labConfirmProxy": 0.53,
      "manualTriageBreadth": 0.56,
      "baselineOptimism": 0.37,
      "escalationHardness": 0.42,
      "overclaimRisk": 0.35,
      "escalationBias": "case_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 38.25,
      "velocityScore": 51.28,
      "spreadScore": 62.01,
      "confirmIntegrity": 43.82,
      "triageScore": 28.34,
      "confidence": 42.1,
      "aiContribution": 49.26,
      "triageContribution": 29.77,
      "overall": 49.75
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 13.23,
      "velocityScore": 19.78,
      "spreadScore": 16.29,
      "confirmIntegrity": 35.76,
      "triageScore": 34.93,
      "confidence": 24.35,
      "aiContribution": 24,
      "triageContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "pe-013",
    "input": {
      "signalClarity": 0.54,
      "caseVelocity": 0.52,
      "geoSpreadProxy": 0.56,
      "labConfirmProxy": 0.57,
      "manualTriageBreadth": 0.6,
      "baselineOptimism": 0.39,
      "escalationHardness": 0.42,
      "overclaimRisk": 0.36,
      "escalationBias": "triage_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 29.17,
      "velocityScore": 44.88,
      "spreadScore": 36.64,
      "confirmIntegrity": 32.66,
      "triageScore": 31.2,
      "confidence": 45.6,
      "aiContribution": 35.8,
      "triageContribution": 32.85,
      "overall": 36.27
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 22.62,
      "velocityScore": 21.42,
      "spreadScore": 17.82,
      "confirmIntegrity": 37.74,
      "triageScore": 67.02,
      "confidence": 26.55,
      "aiContribution": 33.32,
      "triageContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "pe-014",
    "input": {
      "signalClarity": 0.58,
      "caseVelocity": 0.56,
      "geoSpreadProxy": 0.6,
      "labConfirmProxy": 0.61,
      "manualTriageBreadth": 0.63,
      "baselineOptimism": 0.4,
      "escalationHardness": 0.43,
      "overclaimRisk": 0.36,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 52.67,
      "velocityScore": 58.53,
      "spreadScore": 56.71,
      "confirmIntegrity": 64.86,
      "triageScore": 33.07,
      "confidence": 49.25,
      "aiContribution": 57.89,
      "triageContribution": 34.85,
      "overall": 57.74
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 20.03,
      "velocityScore": 22.26,
      "spreadScore": 18.61,
      "confirmIntegrity": 38.98,
      "triageScore": 55.96,
      "confidence": 27.85,
      "aiContribution": 31.17,
      "triageContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "pe-015",
    "input": {
      "signalClarity": 0.62,
      "caseVelocity": 0.54,
      "geoSpreadProxy": 0.56,
      "labConfirmProxy": 0.65,
      "manualTriageBreadth": 0.67,
      "baselineOptimism": 0.36,
      "escalationHardness": 0.44,
      "overclaimRisk": 0.31,
      "escalationBias": "signal_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 45.77,
      "velocityScore": 58.35,
      "spreadScore": 39.15,
      "confirmIntegrity": 79.94,
      "triageScore": 34.55,
      "confidence": 51.85,
      "aiContribution": 54.45,
      "triageContribution": 36.06,
      "overall": 55.14
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 9.43,
      "velocityScore": 20.94,
      "spreadScore": 17.24,
      "confirmIntegrity": 39.27,
      "triageScore": 38.2,
      "confidence": 27.75,
      "aiContribution": 25.02,
      "triageContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "pe-016",
    "input": {
      "signalClarity": 0.58,
      "caseVelocity": 0.59,
      "geoSpreadProxy": 0.6,
      "labConfirmProxy": 0.6,
      "manualTriageBreadth": 0.63,
      "baselineOptimism": 0.37,
      "escalationHardness": 0.36,
      "overclaimRisk": 0.32,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 54.5,
      "velocityScore": 60.67,
      "spreadScore": 57.91,
      "confirmIntegrity": 65.05,
      "triageScore": 33.73,
      "confidence": 50.35,
      "aiContribution": 59.26,
      "triageContribution": 35.81,
      "overall": 59.04
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 22.05,
      "velocityScore": 21.96,
      "spreadScore": 18.63,
      "confirmIntegrity": 38.14,
      "triageScore": 55.7,
      "confidence": 28.3,
      "aiContribution": 31.3,
      "triageContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "pe-017",
    "input": {
      "signalClarity": 0.62,
      "caseVelocity": 0.63,
      "geoSpreadProxy": 0.63,
      "labConfirmProxy": 0.64,
      "manualTriageBreadth": 0.67,
      "baselineOptimism": 0.39,
      "escalationHardness": 0.37,
      "overclaimRisk": 0.33,
      "escalationBias": "case_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 48.45,
      "velocityScore": 64.28,
      "spreadScore": 75.16,
      "confirmIntegrity": 52.76,
      "triageScore": 36.41,
      "confidence": 53.85,
      "aiContribution": 60.68,
      "triageContribution": 38.64,
      "overall": 60.71
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 18.73,
      "velocityScore": 23.45,
      "spreadScore": 19.98,
      "confirmIntegrity": 40.11,
      "triageScore": 39.86,
      "confidence": 30.3,
      "aiContribution": 28.43,
      "triageContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "pe-018",
    "input": {
      "signalClarity": 0.66,
      "caseVelocity": 0.61,
      "geoSpreadProxy": 0.67,
      "labConfirmProxy": 0.68,
      "manualTriageBreadth": 0.7,
      "baselineOptimism": 0.34,
      "escalationHardness": 0.38,
      "overclaimRisk": 0.27,
      "escalationBias": "triage_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 38.35,
      "velocityScore": 54.13,
      "spreadScore": 45.55,
      "confirmIntegrity": 40.09,
      "triageScore": 37.08,
      "confidence": 56.6,
      "aiContribution": 44.54,
      "triageContribution": 39.18,
      "overall": 44.58
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 28.36,
      "velocityScore": 21.69,
      "spreadScore": 18.3,
      "confirmIntegrity": 39.67,
      "triageScore": 74.27,
      "confidence": 29.5,
      "aiContribution": 36.46,
      "triageContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "pe-019",
    "input": {
      "signalClarity": 0.7,
      "caseVelocity": 0.65,
      "geoSpreadProxy": 0.7,
      "labConfirmProxy": 0.72,
      "manualTriageBreadth": 0.74,
      "baselineOptimism": 0.36,
      "escalationHardness": 0.38,
      "overclaimRisk": 0.28,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 63.81,
      "velocityScore": 67.74,
      "spreadScore": 68.17,
      "confirmIntegrity": 75.07,
      "triageScore": 39.94,
      "confidence": 60.1,
      "aiContribution": 68.45,
      "triageContribution": 42.25,
      "overall": 67.73
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 26.25,
      "velocityScore": 23.32,
      "spreadScore": 19.82,
      "confirmIntegrity": 41.65,
      "triageScore": 62.07,
      "confidence": 31.7,
      "aiContribution": 34.62,
      "triageContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "pe-020",
    "input": {
      "signalClarity": 0.66,
      "caseVelocity": 0.7,
      "geoSpreadProxy": 0.66,
      "labConfirmProxy": 0.68,
      "manualTriageBreadth": 0.7,
      "baselineOptimism": 0.37,
      "escalationHardness": 0.31,
      "overclaimRisk": 0.29,
      "escalationBias": "signal_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 52.86,
      "velocityScore": 70.06,
      "spreadScore": 45.74,
      "confirmIntegrity": 86.81,
      "triageScore": 38.94,
      "confidence": 58.85,
      "aiContribution": 62.46,
      "triageContribution": 41.54,
      "overall": 62.69
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 13.66,
      "velocityScore": 23.93,
      "spreadScore": 20.65,
      "confirmIntegrity": 40.51,
      "triageScore": 40.86,
      "confidence": 32.05,
      "aiContribution": 27.92,
      "triageContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "pe-021",
    "input": {
      "signalClarity": 0.7,
      "caseVelocity": 0.68,
      "geoSpreadProxy": 0.7,
      "labConfirmProxy": 0.72,
      "manualTriageBreadth": 0.73,
      "baselineOptimism": 0.33,
      "escalationHardness": 0.31,
      "overclaimRisk": 0.24,
      "escalationBias": "balanced",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 65.6,
      "velocityScore": 69.88,
      "spreadScore": 69.32,
      "confirmIntegrity": 75.82,
      "triageScore": 39.99,
      "confidence": 61.45,
      "aiContribution": 69.92,
      "triageContribution": 42.54,
      "overall": 68.99
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 27.89,
      "velocityScore": 22.72,
      "spreadScore": 19.52,
      "confirmIntegrity": 40.35,
      "triageScore": 61.19,
      "confidence": 31.8,
      "aiContribution": 34.33,
      "triageContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "pe-022",
    "input": {
      "signalClarity": 0.74,
      "caseVelocity": 0.72,
      "geoSpreadProxy": 0.73,
      "labConfirmProxy": 0.76,
      "manualTriageBreadth": 0.77,
      "baselineOptimism": 0.34,
      "escalationHardness": 0.32,
      "overclaimRisk": 0.25,
      "escalationBias": "case_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 57.6,
      "velocityScore": 73.52,
      "spreadScore": 88.84,
      "confirmIntegrity": 60.51,
      "triageScore": 42.47,
      "confidence": 65.1,
      "aiContribution": 70.81,
      "triageContribution": 45.13,
      "overall": 70.19
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 24.57,
      "velocityScore": 23.77,
      "spreadScore": 20.46,
      "confirmIntegrity": 42.05,
      "triageScore": 42.21,
      "confidence": 33.35,
      "aiContribution": 30.61,
      "triageContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "pe-023",
    "input": {
      "signalClarity": 0.79,
      "caseVelocity": 0.76,
      "geoSpreadProxy": 0.77,
      "labConfirmProxy": 0.8,
      "manualTriageBreadth": 0.81,
      "baselineOptimism": 0.36,
      "escalationHardness": 0.33,
      "overclaimRisk": 0.25,
      "escalationBias": "triage_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 49.01,
      "velocityScore": 67.38,
      "spreadScore": 53.71,
      "confirmIntegrity": 49.49,
      "triageScore": 45.16,
      "confidence": 69,
      "aiContribution": 54.84,
      "triageContribution": 47.99,
      "overall": 54.61
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 33.86,
      "velocityScore": 25.2,
      "spreadScore": 21.84,
      "confirmIntegrity": 43.92,
      "triageScore": 84.72,
      "confidence": 35.45,
      "aiContribution": 41.91,
      "triageContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "pe-024",
    "input": {
      "signalClarity": 0.75,
      "caseVelocity": 0.75,
      "geoSpreadProxy": 0.81,
      "labConfirmProxy": 0.76,
      "manualTriageBreadth": 0.77,
      "baselineOptimism": 0.31,
      "escalationHardness": 0.25,
      "overclaimRisk": 0.2,
      "escalationBias": "balanced",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 71.63,
      "velocityScore": 75.91,
      "spreadScore": 79.08,
      "confirmIntegrity": 80.56,
      "triageScore": 43.13,
      "confidence": 66.85,
      "aiContribution": 76.71,
      "triageContribution": 46.16,
      "overall": 75.21
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 31.21,
      "velocityScore": 23.47,
      "spreadScore": 20.52,
      "confirmIntegrity": 41.11,
      "triageScore": 63.65,
      "confidence": 33.9,
      "aiContribution": 35.99,
      "triageContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "pe-025",
    "input": {
      "signalClarity": 0.79,
      "caseVelocity": 0.79,
      "geoSpreadProxy": 0.77,
      "labConfirmProxy": 0.8,
      "manualTriageBreadth": 0.8,
      "baselineOptimism": 0.33,
      "escalationHardness": 0.26,
      "overclaimRisk": 0.21,
      "escalationBias": "signal_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 62.49,
      "velocityScore": 79.52,
      "spreadScore": 54.83,
      "confirmIntegrity": 100,
      "triageScore": 45.2,
      "confidence": 70.35,
      "aiContribution": 72.68,
      "triageContribution": 48.24,
      "overall": 72.28
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 19.5,
      "velocityScore": 24.56,
      "spreadScore": 21.5,
      "confirmIntegrity": 42.63,
      "triageScore": 43.52,
      "confidence": 35.55,
      "aiContribution": 30.34,
      "triageContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "pe-026",
    "input": {
      "signalClarity": 0.83,
      "caseVelocity": 0.83,
      "geoSpreadProxy": 0.8,
      "labConfirmProxy": 0.83,
      "manualTriageBreadth": 0.84,
      "baselineOptimism": 0.34,
      "escalationHardness": 0.27,
      "overclaimRisk": 0.22,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 78.48,
      "velocityScore": 83.17,
      "spreadScore": 80.25,
      "confirmIntegrity": 87.68,
      "triageScore": 47.68,
      "confidence": 73.75,
      "aiContribution": 82.13,
      "triageContribution": 50.82,
      "overall": 80.49
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 33.17,
      "velocityScore": 25.61,
      "spreadScore": 22.47,
      "confirmIntegrity": 44.32,
      "triageScore": 68.8,
      "confidence": 37.1,
      "aiContribution": 38.87,
      "triageContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "pe-027",
    "input": {
      "signalClarity": 0.87,
      "caseVelocity": 0.81,
      "geoSpreadProxy": 0.84,
      "labConfirmProxy": 0.87,
      "manualTriageBreadth": 0.88,
      "baselineOptimism": 0.3,
      "escalationHardness": 0.27,
      "overclaimRisk": 0.17,
      "escalationBias": "case_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 67.22,
      "velocityScore": 82.98,
      "spreadScore": 100,
      "confirmIntegrity": 68.1,
      "triageScore": 49.35,
      "confidence": 76.35,
      "aiContribution": 80.37,
      "triageContribution": 52.46,
      "overall": 79.35
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 30.78,
      "velocityScore": 24.64,
      "spreadScore": 21.53,
      "confirmIntegrity": 44.62,
      "triageScore": 45.22,
      "confidence": 37.2,
      "aiContribution": 33.36,
      "triageContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "pe-028",
    "input": {
      "signalClarity": 0.83,
      "caseVelocity": 0.86,
      "geoSpreadProxy": 0.87,
      "labConfirmProxy": 0.83,
      "manualTriageBreadth": 0.84,
      "baselineOptimism": 0.31,
      "escalationHardness": 0.2,
      "overclaimRisk": 0.17,
      "escalationBias": "triage_first",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 54.91,
      "velocityScore": 75.3,
      "spreadScore": 60.67,
      "confirmIntegrity": 53.51,
      "triageScore": 48.34,
      "confidence": 75.1,
      "aiContribution": 61.11,
      "triageContribution": 51.78,
      "overall": 60.43
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 38.81,
      "velocityScore": 25.31,
      "spreadScore": 22.44,
      "confirmIntegrity": 43.48,
      "triageScore": 86.95,
      "confidence": 37.65,
      "aiContribution": 43.4,
      "triageContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "pe-029",
    "input": {
      "signalClarity": 0.87,
      "caseVelocity": 0.9,
      "geoSpreadProxy": 0.91,
      "labConfirmProxy": 0.87,
      "manualTriageBreadth": 0.87,
      "baselineOptimism": 0.33,
      "escalationHardness": 0.2,
      "overclaimRisk": 0.18,
      "escalationBias": "balanced",
      "profile": "ai_assisted_phe_escalation"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 83.93,
      "velocityScore": 88.91,
      "spreadScore": 89.77,
      "confirmIntegrity": 92.27,
      "triageScore": 50.59,
      "confidence": 78.6,
      "aiContribution": 88.6,
      "triageContribution": 54.2,
      "overall": 86.41
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 36.33,
      "velocityScore": 26.66,
      "spreadScore": 23.73,
      "confirmIntegrity": 45,
      "triageScore": 71.06,
      "confidence": 39.5,
      "aiContribution": 40.56,
      "triageContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "pe-030",
    "input": {
      "signalClarity": 0.91,
      "caseVelocity": 0.88,
      "geoSpreadProxy": 0.87,
      "labConfirmProxy": 0.91,
      "manualTriageBreadth": 0.91,
      "baselineOptimism": 0.28,
      "escalationHardness": 0.21,
      "overclaimRisk": 0.13,
      "escalationBias": "signal_first",
      "profile": "manual_triage_baseline"
    },
    "expectedAi": {
      "mode": "ai_assisted_phe_escalation",
      "signalScore": 71.56,
      "velocityScore": 88.77,
      "spreadScore": 63.21,
      "confirmIntegrity": 100,
      "triageScore": 51.88,
      "confidence": 81.35,
      "aiContribution": 79.61,
      "triageContribution": 55.26,
      "overall": 79.23
    },
    "expectedTriage": {
      "mode": "manual_triage_baseline",
      "signalScore": 25.72,
      "velocityScore": 25,
      "spreadScore": 22.06,
      "confirmIntegrity": 45.02,
      "triageScore": 46.21,
      "confidence": 38.95,
      "aiContribution": 32.8,
      "triageContribution": 50.65,
      "overall": 44.26
    }
  }
];
