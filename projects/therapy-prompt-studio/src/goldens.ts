import type { TherapyInput, TherapyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TherapyInput;
  expectedGates: TherapyQuality;
  expectedPrompt: TherapyQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tp-001",
    "input": {
      "gateCoverage": 0.29,
      "refusalStrength": 0.25,
      "crisisEscalation": 0.28,
      "boundaryClarity": 0.34,
      "promptOnlyConfidence": 0.39,
      "baselineOptimism": 0.45,
      "scenarioHardness": 0.59,
      "overclaimRisk": 0.5,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 22.43,
      "refusalScore": 30.25,
      "crisisScore": 23.34,
      "boundaryScore": 37.64,
      "promptOnlyScore": 16.4,
      "confidence": 20.85,
      "gatesContribution": 27.91,
      "promptContribution": 15.82,
      "overall": 29.73
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 5.76,
      "refusalScore": 16.91,
      "crisisScore": 12.62,
      "boundaryScore": 32.39,
      "promptOnlyScore": 40.93,
      "confidence": 17.1,
      "gatesContribution": 21.72,
      "promptContribution": 38.5,
      "overall": 27.09
    }
  },
  {
    "id": "tp-002",
    "input": {
      "gateCoverage": 0.33,
      "refusalStrength": 0.29,
      "crisisEscalation": 0.32,
      "boundaryClarity": 0.38,
      "promptOnlyConfidence": 0.43,
      "baselineOptimism": 0.46,
      "scenarioHardness": 0.6,
      "overclaimRisk": 0.51,
      "therapyBias": "refusal_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 22.11,
      "refusalScore": 33.9,
      "crisisScore": 34.25,
      "boundaryScore": 31.9,
      "promptOnlyScore": 18.89,
      "confidence": 24.5,
      "gatesContribution": 30.49,
      "promptContribution": 18.47,
      "overall": 32.33
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 2.43,
      "refusalScore": 18.04,
      "crisisScore": 13.64,
      "boundaryScore": 34.08,
      "promptOnlyScore": 31.53,
      "confidence": 18.65,
      "gatesContribution": 19.94,
      "promptContribution": 34.44,
      "overall": 23.39
    }
  },
  {
    "id": "tp-003",
    "input": {
      "gateCoverage": 0.37,
      "refusalStrength": 0.27,
      "crisisEscalation": 0.36,
      "boundaryClarity": 0.42,
      "promptOnlyConfidence": 0.46,
      "baselineOptimism": 0.42,
      "scenarioHardness": 0.6,
      "overclaimRisk": 0.46,
      "therapyBias": "prompt_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 11.91,
      "refusalScore": 23.71,
      "crisisScore": 20.59,
      "boundaryScore": 19.24,
      "promptOnlyScore": 19.94,
      "confidence": 27.1,
      "gatesContribution": 18.79,
      "promptContribution": 19.33,
      "overall": 19.89
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 12.17,
      "refusalScore": 16.65,
      "crisisScore": 12.29,
      "boundaryScore": 33.93,
      "promptOnlyScore": 54.34,
      "confidence": 18.4,
      "gatesContribution": 25.88,
      "promptContribution": 46.34,
      "overall": 34.28
    }
  },
  {
    "id": "tp-004",
    "input": {
      "gateCoverage": 0.33,
      "refusalStrength": 0.32,
      "crisisEscalation": 0.39,
      "boundaryClarity": 0.38,
      "promptOnlyConfidence": 0.42,
      "baselineOptimism": 0.43,
      "scenarioHardness": 0.53,
      "overclaimRisk": 0.46,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 28.06,
      "refusalScore": 36.03,
      "crisisScore": 33.04,
      "boundaryScore": 42.23,
      "promptOnlyScore": 18.93,
      "confidence": 25.85,
      "gatesContribution": 34.48,
      "promptContribution": 19.02,
      "overall": 35.7
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 8.7,
      "refusalScore": 17.77,
      "crisisScore": 13.75,
      "boundaryScore": 32.79,
      "promptOnlyScore": 42.77,
      "confidence": 18.85,
      "gatesContribution": 23.16,
      "promptContribution": 40.2,
      "overall": 29.45
    }
  },
  {
    "id": "tp-005",
    "input": {
      "gateCoverage": 0.37,
      "refusalStrength": 0.36,
      "crisisEscalation": 0.35,
      "boundaryClarity": 0.42,
      "promptOnlyConfidence": 0.46,
      "baselineOptimism": 0.45,
      "scenarioHardness": 0.53,
      "overclaimRisk": 0.47,
      "therapyBias": "gates_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 26.84,
      "refusalScore": 39.64,
      "crisisScore": 21.36,
      "boundaryScore": 54.3,
      "promptOnlyScore": 21.8,
      "confidence": 29.35,
      "gatesContribution": 34.42,
      "promptContribution": 22.15,
      "overall": 36.21
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 0,
      "refusalScore": 19.47,
      "crisisScore": 15.36,
      "boundaryScore": 34.77,
      "promptOnlyScore": 32.95,
      "confidence": 21.05,
      "gatesContribution": 20.51,
      "promptContribution": 36.29,
      "overall": 25.76
    }
  },
  {
    "id": "tp-006",
    "input": {
      "gateCoverage": 0.41,
      "refusalStrength": 0.34,
      "crisisEscalation": 0.39,
      "boundaryClarity": 0.45,
      "promptOnlyConfidence": 0.5,
      "baselineOptimism": 0.4,
      "scenarioHardness": 0.54,
      "overclaimRisk": 0.42,
      "therapyBias": "balanced",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 33.72,
      "refusalScore": 39.5,
      "crisisScore": 35.62,
      "boundaryScore": 47.85,
      "promptOnlyScore": 23.08,
      "confidence": 31.85,
      "gatesContribution": 38.75,
      "promptContribution": 23.16,
      "overall": 39.94
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 11.98,
      "refusalScore": 17.75,
      "crisisScore": 13.67,
      "boundaryScore": 34.78,
      "promptOnlyScore": 46.72,
      "confidence": 20.5,
      "gatesContribution": 24.98,
      "promptContribution": 43.03,
      "overall": 32.22
    }
  },
  {
    "id": "tp-007",
    "input": {
      "gateCoverage": 0.45,
      "refusalStrength": 0.38,
      "crisisEscalation": 0.42,
      "boundaryClarity": 0.49,
      "promptOnlyConfidence": 0.53,
      "baselineOptimism": 0.42,
      "scenarioHardness": 0.55,
      "overclaimRisk": 0.43,
      "therapyBias": "refusal_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 31.41,
      "refusalScore": 43.11,
      "crisisScore": 48.14,
      "boundaryScore": 39.34,
      "promptOnlyScore": 25.15,
      "confidence": 35.35,
      "gatesContribution": 40.65,
      "promptContribution": 25.41,
      "overall": 41.91
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 8.27,
      "refusalScore": 19.05,
      "crisisScore": 14.89,
      "boundaryScore": 36.3,
      "promptOnlyScore": 34.2,
      "confidence": 22.15,
      "gatesContribution": 22.54,
      "promptContribution": 37.35,
      "overall": 27.11
    }
  },
  {
    "id": "tp-008",
    "input": {
      "gateCoverage": 0.41,
      "refusalStrength": 0.43,
      "crisisEscalation": 0.46,
      "boundaryClarity": 0.45,
      "promptOnlyConfidence": 0.49,
      "baselineOptimism": 0.43,
      "scenarioHardness": 0.47,
      "overclaimRisk": 0.44,
      "therapyBias": "prompt_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 19.37,
      "refusalScore": 35.43,
      "crisisScore": 27.68,
      "boundaryScore": 24.76,
      "promptOnlyScore": 24.32,
      "confidence": 34.1,
      "gatesContribution": 26.74,
      "promptContribution": 25.29,
      "overall": 27.48
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 16.4,
      "refusalScore": 20.25,
      "crisisScore": 16.44,
      "boundaryScore": 35.17,
      "promptOnlyScore": 58.5,
      "confidence": 22.7,
      "gatesContribution": 29.35,
      "promptContribution": 50.98,
      "overall": 39.82
    }
  },
  {
    "id": "tp-009",
    "input": {
      "gateCoverage": 0.46,
      "refusalStrength": 0.41,
      "crisisEscalation": 0.5,
      "boundaryClarity": 0.49,
      "promptOnlyConfidence": 0.53,
      "baselineOptimism": 0.39,
      "scenarioHardness": 0.48,
      "overclaimRisk": 0.38,
      "therapyBias": "balanced",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 39.92,
      "refusalScore": 45.49,
      "crisisScore": 45.54,
      "boundaryScore": 52.59,
      "promptOnlyScore": 25.81,
      "confidence": 37.1,
      "gatesContribution": 45.62,
      "promptContribution": 26.55,
      "overall": 46.19
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 14.91,
      "refusalScore": 18.89,
      "crisisScore": 15.13,
      "boundaryScore": 35.36,
      "promptOnlyScore": 48.88,
      "confidence": 22.7,
      "gatesContribution": 26.63,
      "promptContribution": 45.17,
      "overall": 34.97
    }
  },
  {
    "id": "tp-010",
    "input": {
      "gateCoverage": 0.5,
      "refusalStrength": 0.45,
      "crisisEscalation": 0.46,
      "boundaryClarity": 0.53,
      "promptOnlyConfidence": 0.57,
      "baselineOptimism": 0.4,
      "scenarioHardness": 0.49,
      "overclaimRisk": 0.39,
      "therapyBias": "gates_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 36.51,
      "refusalScore": 49.14,
      "crisisScore": 30.51,
      "boundaryScore": 66.82,
      "promptOnlyScore": 28.29,
      "confidence": 40.75,
      "gatesContribution": 44.53,
      "promptContribution": 29.18,
      "overall": 45.77
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 3.59,
      "refusalScore": 20,
      "crisisScore": 16.13,
      "boundaryScore": 37.06,
      "promptOnlyScore": 35.54,
      "confidence": 24.25,
      "gatesContribution": 22.46,
      "promptContribution": 38.93,
      "overall": 29.05
    }
  },
  {
    "id": "tp-011",
    "input": {
      "gateCoverage": 0.54,
      "refusalStrength": 0.49,
      "crisisEscalation": 0.49,
      "boundaryClarity": 0.57,
      "promptOnlyConfidence": 0.6,
      "baselineOptimism": 0.42,
      "scenarioHardness": 0.49,
      "overclaimRisk": 0.4,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 47.07,
      "refusalScore": 52.75,
      "crisisScore": 47.04,
      "boundaryScore": 60.27,
      "promptOnlyScore": 30.54,
      "confidence": 44.25,
      "gatesContribution": 51.33,
      "promptContribution": 31.67,
      "overall": 51.79
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 17.1,
      "refusalScore": 21.44,
      "crisisScore": 17.52,
      "boundaryScore": 38.58,
      "promptOnlyScore": 54.12,
      "confidence": 26.1,
      "gatesContribution": 29.75,
      "promptContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "tp-012",
    "input": {
      "gateCoverage": 0.5,
      "refusalStrength": 0.48,
      "crisisEscalation": 0.53,
      "boundaryClarity": 0.53,
      "promptOnlyConfidence": 0.56,
      "baselineOptimism": 0.37,
      "scenarioHardness": 0.42,
      "overclaimRisk": 0.35,
      "therapyBias": "refusal_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 38.15,
      "refusalScore": 51.28,
      "crisisScore": 61.89,
      "boundaryScore": 43.82,
      "promptOnlyScore": 28.34,
      "confidence": 42.1,
      "gatesContribution": 49.2,
      "promptContribution": 29.65,
      "overall": 49.68
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 13.23,
      "refusalScore": 19.62,
      "crisisScore": 16.1,
      "boundaryScore": 35.76,
      "promptOnlyScore": 34.93,
      "confidence": 24.35,
      "gatesContribution": 23.93,
      "promptContribution": 38.12,
      "overall": 29.54
    }
  },
  {
    "id": "tp-013",
    "input": {
      "gateCoverage": 0.54,
      "refusalStrength": 0.52,
      "crisisEscalation": 0.56,
      "boundaryClarity": 0.57,
      "promptOnlyConfidence": 0.6,
      "baselineOptimism": 0.39,
      "scenarioHardness": 0.42,
      "overclaimRisk": 0.36,
      "therapyBias": "prompt_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 29.09,
      "refusalScore": 44.88,
      "crisisScore": 36.54,
      "boundaryScore": 32.66,
      "promptOnlyScore": 31.2,
      "confidence": 45.6,
      "gatesContribution": 35.75,
      "promptContribution": 32.75,
      "overall": 36.21
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 22.62,
      "refusalScore": 21.29,
      "crisisScore": 17.67,
      "boundaryScore": 37.74,
      "promptOnlyScore": 67.02,
      "confidence": 26.55,
      "gatesContribution": 33.27,
      "promptContribution": 57.23,
      "overall": 46.44
    }
  },
  {
    "id": "tp-014",
    "input": {
      "gateCoverage": 0.58,
      "refusalStrength": 0.56,
      "crisisEscalation": 0.6,
      "boundaryClarity": 0.61,
      "promptOnlyConfidence": 0.63,
      "baselineOptimism": 0.4,
      "scenarioHardness": 0.43,
      "overclaimRisk": 0.36,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 52.58,
      "refusalScore": 58.53,
      "crisisScore": 56.61,
      "boundaryScore": 64.86,
      "promptOnlyScore": 33.07,
      "confidence": 49.25,
      "gatesContribution": 57.84,
      "promptContribution": 34.74,
      "overall": 57.68
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 20.03,
      "refusalScore": 22.13,
      "crisisScore": 18.46,
      "boundaryScore": 38.98,
      "promptOnlyScore": 55.96,
      "confidence": 27.85,
      "gatesContribution": 31.11,
      "promptContribution": 52.04,
      "overall": 41.84
    }
  },
  {
    "id": "tp-015",
    "input": {
      "gateCoverage": 0.62,
      "refusalStrength": 0.54,
      "crisisEscalation": 0.56,
      "boundaryClarity": 0.65,
      "promptOnlyConfidence": 0.67,
      "baselineOptimism": 0.36,
      "scenarioHardness": 0.44,
      "overclaimRisk": 0.31,
      "therapyBias": "gates_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 45.73,
      "refusalScore": 58.35,
      "crisisScore": 39.09,
      "boundaryScore": 79.94,
      "promptOnlyScore": 34.55,
      "confidence": 51.85,
      "gatesContribution": 54.43,
      "promptContribution": 36.01,
      "overall": 55.11
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 9.43,
      "refusalScore": 20.87,
      "crisisScore": 17.16,
      "boundaryScore": 39.27,
      "promptOnlyScore": 38.2,
      "confidence": 27.75,
      "gatesContribution": 24.99,
      "promptContribution": 41.76,
      "overall": 32.69
    }
  },
  {
    "id": "tp-016",
    "input": {
      "gateCoverage": 0.58,
      "refusalStrength": 0.59,
      "crisisEscalation": 0.6,
      "boundaryClarity": 0.6,
      "promptOnlyConfidence": 0.63,
      "baselineOptimism": 0.37,
      "scenarioHardness": 0.36,
      "overclaimRisk": 0.32,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 54.48,
      "refusalScore": 60.67,
      "crisisScore": 57.89,
      "boundaryScore": 65.05,
      "promptOnlyScore": 33.73,
      "confidence": 50.35,
      "gatesContribution": 59.25,
      "promptContribution": 35.79,
      "overall": 59.03
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 22.05,
      "refusalScore": 21.94,
      "crisisScore": 18.6,
      "boundaryScore": 38.14,
      "promptOnlyScore": 55.7,
      "confidence": 28.3,
      "gatesContribution": 31.29,
      "promptContribution": 51.58,
      "overall": 42.32
    }
  },
  {
    "id": "tp-017",
    "input": {
      "gateCoverage": 0.62,
      "refusalStrength": 0.63,
      "crisisEscalation": 0.63,
      "boundaryClarity": 0.64,
      "promptOnlyConfidence": 0.67,
      "baselineOptimism": 0.39,
      "scenarioHardness": 0.37,
      "overclaimRisk": 0.33,
      "therapyBias": "refusal_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 48.45,
      "refusalScore": 64.28,
      "crisisScore": 75.16,
      "boundaryScore": 52.76,
      "promptOnlyScore": 36.41,
      "confidence": 53.85,
      "gatesContribution": 60.68,
      "promptContribution": 38.64,
      "overall": 60.71
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 18.73,
      "refusalScore": 23.45,
      "crisisScore": 19.98,
      "boundaryScore": 40.11,
      "promptOnlyScore": 39.86,
      "confidence": 30.3,
      "gatesContribution": 28.43,
      "promptContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "tp-018",
    "input": {
      "gateCoverage": 0.66,
      "refusalStrength": 0.61,
      "crisisEscalation": 0.67,
      "boundaryClarity": 0.68,
      "promptOnlyConfidence": 0.7,
      "baselineOptimism": 0.34,
      "scenarioHardness": 0.38,
      "overclaimRisk": 0.27,
      "therapyBias": "prompt_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 38.25,
      "refusalScore": 54.13,
      "crisisScore": 45.41,
      "boundaryScore": 40.09,
      "promptOnlyScore": 37.08,
      "confidence": 56.6,
      "gatesContribution": 44.47,
      "promptContribution": 39.05,
      "overall": 44.49
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 28.36,
      "refusalScore": 21.52,
      "crisisScore": 18.09,
      "boundaryScore": 39.67,
      "promptOnlyScore": 74.27,
      "confidence": 29.5,
      "gatesContribution": 36.38,
      "promptContribution": 62.18,
      "overall": 51.84
    }
  },
  {
    "id": "tp-019",
    "input": {
      "gateCoverage": 0.7,
      "refusalStrength": 0.65,
      "crisisEscalation": 0.7,
      "boundaryClarity": 0.72,
      "promptOnlyConfidence": 0.74,
      "baselineOptimism": 0.36,
      "scenarioHardness": 0.38,
      "overclaimRisk": 0.28,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 63.7,
      "refusalScore": 67.74,
      "crisisScore": 68.05,
      "boundaryScore": 75.07,
      "promptOnlyScore": 39.94,
      "confidence": 60.1,
      "gatesContribution": 68.39,
      "promptContribution": 42.14,
      "overall": 67.66
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 26.25,
      "refusalScore": 23.18,
      "crisisScore": 19.65,
      "boundaryScore": 41.65,
      "promptOnlyScore": 62.07,
      "confidence": 31.7,
      "gatesContribution": 34.56,
      "promptContribution": 56.93,
      "overall": 47.29
    }
  },
  {
    "id": "tp-020",
    "input": {
      "gateCoverage": 0.66,
      "refusalStrength": 0.7,
      "crisisEscalation": 0.66,
      "boundaryClarity": 0.68,
      "promptOnlyConfidence": 0.7,
      "baselineOptimism": 0.37,
      "scenarioHardness": 0.31,
      "overclaimRisk": 0.29,
      "therapyBias": "gates_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 52.92,
      "refusalScore": 70.06,
      "crisisScore": 45.81,
      "boundaryScore": 86.81,
      "promptOnlyScore": 38.94,
      "confidence": 58.85,
      "gatesContribution": 62.5,
      "promptContribution": 41.61,
      "overall": 62.74
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 13.66,
      "refusalScore": 24.02,
      "crisisScore": 20.76,
      "boundaryScore": 40.51,
      "promptOnlyScore": 40.86,
      "confidence": 32.05,
      "gatesContribution": 27.96,
      "promptContribution": 45.34,
      "overall": 37.3
    }
  },
  {
    "id": "tp-021",
    "input": {
      "gateCoverage": 0.7,
      "refusalStrength": 0.68,
      "crisisEscalation": 0.7,
      "boundaryClarity": 0.72,
      "promptOnlyConfidence": 0.73,
      "baselineOptimism": 0.33,
      "scenarioHardness": 0.31,
      "overclaimRisk": 0.24,
      "therapyBias": "balanced",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 65.56,
      "refusalScore": 69.88,
      "crisisScore": 69.29,
      "boundaryScore": 75.82,
      "promptOnlyScore": 39.99,
      "confidence": 61.45,
      "gatesContribution": 69.9,
      "promptContribution": 42.51,
      "overall": 68.97
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 27.89,
      "refusalScore": 22.67,
      "crisisScore": 19.47,
      "boundaryScore": 40.35,
      "promptOnlyScore": 61.19,
      "confidence": 31.8,
      "gatesContribution": 34.31,
      "promptContribution": 55.9,
      "overall": 47.23
    }
  },
  {
    "id": "tp-022",
    "input": {
      "gateCoverage": 0.74,
      "refusalStrength": 0.72,
      "crisisEscalation": 0.73,
      "boundaryClarity": 0.76,
      "promptOnlyConfidence": 0.77,
      "baselineOptimism": 0.34,
      "scenarioHardness": 0.32,
      "overclaimRisk": 0.25,
      "therapyBias": "refusal_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 57.59,
      "refusalScore": 73.52,
      "crisisScore": 88.82,
      "boundaryScore": 60.51,
      "promptOnlyScore": 42.47,
      "confidence": 65.1,
      "gatesContribution": 70.8,
      "promptContribution": 45.11,
      "overall": 70.18
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 24.57,
      "refusalScore": 23.75,
      "crisisScore": 20.43,
      "boundaryScore": 42.05,
      "promptOnlyScore": 42.21,
      "confidence": 33.35,
      "gatesContribution": 30.6,
      "promptContribution": 46.54,
      "overall": 38.97
    }
  },
  {
    "id": "tp-023",
    "input": {
      "gateCoverage": 0.79,
      "refusalStrength": 0.76,
      "crisisEscalation": 0.77,
      "boundaryClarity": 0.8,
      "promptOnlyConfidence": 0.81,
      "baselineOptimism": 0.36,
      "scenarioHardness": 0.33,
      "overclaimRisk": 0.25,
      "therapyBias": "prompt_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 48.99,
      "refusalScore": 67.38,
      "crisisScore": 53.69,
      "boundaryScore": 49.49,
      "promptOnlyScore": 45.16,
      "confidence": 69,
      "gatesContribution": 54.83,
      "promptContribution": 47.97,
      "overall": 54.6
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 33.86,
      "refusalScore": 25.18,
      "crisisScore": 21.81,
      "boundaryScore": 43.92,
      "promptOnlyScore": 84.72,
      "confidence": 35.45,
      "gatesContribution": 41.9,
      "promptContribution": 71.3,
      "overall": 60.69
    }
  },
  {
    "id": "tp-024",
    "input": {
      "gateCoverage": 0.75,
      "refusalStrength": 0.75,
      "crisisEscalation": 0.81,
      "boundaryClarity": 0.76,
      "promptOnlyConfidence": 0.77,
      "baselineOptimism": 0.31,
      "scenarioHardness": 0.25,
      "overclaimRisk": 0.2,
      "therapyBias": "balanced",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 71.55,
      "refusalScore": 75.91,
      "crisisScore": 78.99,
      "boundaryScore": 80.56,
      "promptOnlyScore": 43.13,
      "confidence": 66.85,
      "gatesContribution": 76.66,
      "promptContribution": 46.07,
      "overall": 75.15
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 31.21,
      "refusalScore": 23.36,
      "crisisScore": 20.38,
      "boundaryScore": 41.11,
      "promptOnlyScore": 63.65,
      "confidence": 33.9,
      "gatesContribution": 35.94,
      "promptContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "tp-025",
    "input": {
      "gateCoverage": 0.79,
      "refusalStrength": 0.79,
      "crisisEscalation": 0.77,
      "boundaryClarity": 0.8,
      "promptOnlyConfidence": 0.8,
      "baselineOptimism": 0.33,
      "scenarioHardness": 0.26,
      "overclaimRisk": 0.21,
      "therapyBias": "gates_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 62.51,
      "refusalScore": 79.52,
      "crisisScore": 54.86,
      "boundaryScore": 100,
      "promptOnlyScore": 45.2,
      "confidence": 70.35,
      "gatesContribution": 72.7,
      "promptContribution": 48.27,
      "overall": 72.3
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 19.5,
      "refusalScore": 24.6,
      "crisisScore": 21.54,
      "boundaryScore": 42.63,
      "promptOnlyScore": 43.52,
      "confidence": 35.55,
      "gatesContribution": 30.36,
      "promptContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "tp-026",
    "input": {
      "gateCoverage": 0.83,
      "refusalStrength": 0.83,
      "crisisEscalation": 0.8,
      "boundaryClarity": 0.83,
      "promptOnlyConfidence": 0.84,
      "baselineOptimism": 0.34,
      "scenarioHardness": 0.27,
      "overclaimRisk": 0.22,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 78.52,
      "refusalScore": 83.17,
      "crisisScore": 80.3,
      "boundaryScore": 87.68,
      "promptOnlyScore": 47.68,
      "confidence": 73.75,
      "gatesContribution": 82.15,
      "promptContribution": 50.87,
      "overall": 80.52
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 33.17,
      "refusalScore": 25.67,
      "crisisScore": 22.55,
      "boundaryScore": 44.32,
      "promptOnlyScore": 68.8,
      "confidence": 37.1,
      "gatesContribution": 38.9,
      "promptContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "tp-027",
    "input": {
      "gateCoverage": 0.87,
      "refusalStrength": 0.81,
      "crisisEscalation": 0.84,
      "boundaryClarity": 0.87,
      "promptOnlyConfidence": 0.88,
      "baselineOptimism": 0.3,
      "scenarioHardness": 0.27,
      "overclaimRisk": 0.17,
      "therapyBias": "refusal_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 67.18,
      "refusalScore": 82.98,
      "crisisScore": 100,
      "boundaryScore": 68.1,
      "promptOnlyScore": 49.35,
      "confidence": 76.35,
      "gatesContribution": 80.36,
      "promptContribution": 52.41,
      "overall": 79.33
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 30.78,
      "refusalScore": 24.58,
      "crisisScore": 21.46,
      "boundaryScore": 44.62,
      "promptOnlyScore": 45.22,
      "confidence": 37.2,
      "gatesContribution": 33.33,
      "promptContribution": 49.65,
      "overall": 42.88
    }
  },
  {
    "id": "tp-028",
    "input": {
      "gateCoverage": 0.83,
      "refusalStrength": 0.86,
      "crisisEscalation": 0.87,
      "boundaryClarity": 0.83,
      "promptOnlyConfidence": 0.84,
      "baselineOptimism": 0.31,
      "scenarioHardness": 0.2,
      "overclaimRisk": 0.17,
      "therapyBias": "prompt_first",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 54.9,
      "refusalScore": 75.3,
      "crisisScore": 60.66,
      "boundaryScore": 53.51,
      "promptOnlyScore": 48.34,
      "confidence": 75.1,
      "gatesContribution": 61.1,
      "promptContribution": 51.77,
      "overall": 60.42
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 38.81,
      "refusalScore": 25.29,
      "crisisScore": 22.42,
      "boundaryScore": 43.48,
      "promptOnlyScore": 86.95,
      "confidence": 37.65,
      "gatesContribution": 43.39,
      "promptContribution": 72.61,
      "overall": 63.56
    }
  },
  {
    "id": "tp-029",
    "input": {
      "gateCoverage": 0.87,
      "refusalStrength": 0.9,
      "crisisEscalation": 0.91,
      "boundaryClarity": 0.87,
      "promptOnlyConfidence": 0.87,
      "baselineOptimism": 0.33,
      "scenarioHardness": 0.2,
      "overclaimRisk": 0.18,
      "therapyBias": "balanced",
      "profile": "structured_therapy_safety_gates"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 83.92,
      "refusalScore": 88.91,
      "crisisScore": 89.75,
      "boundaryScore": 92.27,
      "promptOnlyScore": 50.59,
      "confidence": 78.6,
      "gatesContribution": 88.59,
      "promptContribution": 54.19,
      "overall": 86.4
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 36.33,
      "refusalScore": 26.65,
      "crisisScore": 23.71,
      "boundaryScore": 45,
      "promptOnlyScore": 71.06,
      "confidence": 39.5,
      "gatesContribution": 40.55,
      "promptContribution": 65.1,
      "overall": 57.02
    }
  },
  {
    "id": "tp-030",
    "input": {
      "gateCoverage": 0.91,
      "refusalStrength": 0.88,
      "crisisEscalation": 0.87,
      "boundaryClarity": 0.91,
      "promptOnlyConfidence": 0.91,
      "baselineOptimism": 0.28,
      "scenarioHardness": 0.21,
      "overclaimRisk": 0.13,
      "therapyBias": "gates_first",
      "profile": "prompt_only_safety_baseline"
    },
    "expectedGates": {
      "mode": "structured_therapy_safety_gates",
      "gateScore": 71.57,
      "refusalScore": 88.77,
      "crisisScore": 63.22,
      "boundaryScore": 100,
      "promptOnlyScore": 51.88,
      "confidence": 81.35,
      "gatesContribution": 79.61,
      "promptContribution": 55.27,
      "overall": 79.23
    },
    "expectedPrompt": {
      "mode": "prompt_only_safety_baseline",
      "gateScore": 25.72,
      "refusalScore": 25.01,
      "crisisScore": 22.08,
      "boundaryScore": 45.02,
      "promptOnlyScore": 46.21,
      "confidence": 38.95,
      "gatesContribution": 32.81,
      "promptContribution": 50.65,
      "overall": 44.27
    }
  }
];
