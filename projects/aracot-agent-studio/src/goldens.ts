import type { AgentInput, AgentQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AgentInput;
  expectedDistilled: AgentQuality;
  expectedBaseline: AgentQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "aa-001",
    "input": {
      "cotStepQuality": 0.29,
      "arabicFluency": 0.25,
      "distillFidelity": 0.28,
      "agentGrounding": 0.34,
      "multilingualCoverage": 0.39,
      "baselineOptimism": 0.45,
      "reasoningHardness": 0.59,
      "overclaimRisk": 0.5,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 22.53,
      "arabicScore": 30.25,
      "distillScore": 23.45,
      "groundingIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "distilledContribution": 27.96,
      "baselineContribution": 15.92,
      "overall": 29.79
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 5.76,
      "arabicScore": 17.05,
      "distillScore": 13.08,
      "groundingIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "distilledContribution": 21.84,
      "baselineContribution": 38.57,
      "overall": 27.17
    }
  },
  {
    "id": "aa-002",
    "input": {
      "cotStepQuality": 0.33,
      "arabicFluency": 0.29,
      "distillFidelity": 0.32,
      "agentGrounding": 0.38,
      "multilingualCoverage": 0.43,
      "baselineOptimism": 0.46,
      "reasoningHardness": 0.6,
      "overclaimRisk": 0.51,
      "agentBias": "distill_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 22.19,
      "arabicScore": 33.9,
      "distillScore": 34.35,
      "groundingIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 23,
      "distilledContribution": 30.54,
      "baselineContribution": 18.58,
      "overall": 32.39
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 2.43,
      "arabicScore": 18.17,
      "distillScore": 14.11,
      "groundingIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "distilledContribution": 20.06,
      "baselineContribution": 34.51,
      "overall": 23.47
    }
  },
  {
    "id": "aa-003",
    "input": {
      "cotStepQuality": 0.37,
      "arabicFluency": 0.27,
      "distillFidelity": 0.36,
      "agentGrounding": 0.42,
      "multilingualCoverage": 0.46,
      "baselineOptimism": 0.42,
      "reasoningHardness": 0.6,
      "overclaimRisk": 0.46,
      "agentBias": "baseline_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 12.16,
      "arabicScore": 23.71,
      "distillScore": 20.92,
      "groundingIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "distilledContribution": 18.94,
      "baselineContribution": 19.65,
      "overall": 20.07
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 12.17,
      "arabicScore": 17.05,
      "distillScore": 13.08,
      "groundingIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "distilledContribution": 26.11,
      "baselineContribution": 46.55,
      "overall": 34.49
    }
  },
  {
    "id": "aa-004",
    "input": {
      "cotStepQuality": 0.33,
      "arabicFluency": 0.32,
      "distillFidelity": 0.39,
      "agentGrounding": 0.38,
      "multilingualCoverage": 0.42,
      "baselineOptimism": 0.43,
      "reasoningHardness": 0.53,
      "overclaimRisk": 0.46,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 28.27,
      "arabicScore": 36.03,
      "distillScore": 33.26,
      "groundingIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "distilledContribution": 34.6,
      "baselineContribution": 19.24,
      "overall": 35.84
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 8.7,
      "arabicScore": 18.05,
      "distillScore": 14.03,
      "groundingIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "distilledContribution": 23.27,
      "baselineContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "aa-005",
    "input": {
      "cotStepQuality": 0.37,
      "arabicFluency": 0.36,
      "distillFidelity": 0.35,
      "agentGrounding": 0.42,
      "multilingualCoverage": 0.46,
      "baselineOptimism": 0.45,
      "reasoningHardness": 0.53,
      "overclaimRisk": 0.47,
      "agentBias": "cot_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 26.81,
      "arabicScore": 39.64,
      "distillScore": 21.33,
      "groundingIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "distilledContribution": 34.4,
      "baselineContribution": 22.12,
      "overall": 36.19
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 0,
      "arabicScore": 19.43,
      "distillScore": 15.66,
      "groundingIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "distilledContribution": 20.56,
      "baselineContribution": 36.26,
      "overall": 25.75
    }
  },
  {
    "id": "aa-006",
    "input": {
      "cotStepQuality": 0.41,
      "arabicFluency": 0.34,
      "distillFidelity": 0.39,
      "agentGrounding": 0.45,
      "multilingualCoverage": 0.5,
      "baselineOptimism": 0.4,
      "reasoningHardness": 0.54,
      "overclaimRisk": 0.42,
      "agentBias": "balanced",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 33.88,
      "arabicScore": 39.5,
      "distillScore": 35.78,
      "groundingIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "distilledContribution": 38.83,
      "baselineContribution": 23.32,
      "overall": 40.04
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 11.98,
      "arabicScore": 17.95,
      "distillScore": 14.21,
      "groundingIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "distilledContribution": 25.13,
      "baselineContribution": 43.14,
      "overall": 32.34
    }
  },
  {
    "id": "aa-007",
    "input": {
      "cotStepQuality": 0.45,
      "arabicFluency": 0.38,
      "distillFidelity": 0.42,
      "agentGrounding": 0.49,
      "multilingualCoverage": 0.53,
      "baselineOptimism": 0.42,
      "reasoningHardness": 0.55,
      "overclaimRisk": 0.43,
      "agentBias": "distill_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 31.52,
      "arabicScore": 43.11,
      "distillScore": 48.27,
      "groundingIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "distilledContribution": 40.71,
      "baselineContribution": 25.54,
      "overall": 41.98
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 8.27,
      "arabicScore": 19.21,
      "distillScore": 15.44,
      "groundingIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "distilledContribution": 22.68,
      "baselineContribution": 37.43,
      "overall": 27.21
    }
  },
  {
    "id": "aa-008",
    "input": {
      "cotStepQuality": 0.41,
      "arabicFluency": 0.43,
      "distillFidelity": 0.46,
      "agentGrounding": 0.45,
      "multilingualCoverage": 0.49,
      "baselineOptimism": 0.43,
      "reasoningHardness": 0.47,
      "overclaimRisk": 0.44,
      "agentBias": "baseline_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 19.43,
      "arabicScore": 35.43,
      "distillScore": 27.76,
      "groundingIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "distilledContribution": 26.78,
      "baselineContribution": 25.37,
      "overall": 27.53
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 16.4,
      "arabicScore": 20.36,
      "distillScore": 16.52,
      "groundingIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "distilledContribution": 29.39,
      "baselineContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "aa-009",
    "input": {
      "cotStepQuality": 0.46,
      "arabicFluency": 0.41,
      "distillFidelity": 0.5,
      "agentGrounding": 0.49,
      "multilingualCoverage": 0.53,
      "baselineOptimism": 0.39,
      "reasoningHardness": 0.48,
      "overclaimRisk": 0.38,
      "agentBias": "balanced",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 40.16,
      "arabicScore": 45.49,
      "distillScore": 45.8,
      "groundingIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "distilledContribution": 45.75,
      "baselineContribution": 26.81,
      "overall": 46.34
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 14.91,
      "arabicScore": 19.22,
      "distillScore": 15.47,
      "groundingIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "distilledContribution": 26.77,
      "baselineContribution": 45.34,
      "overall": 35.13
    }
  },
  {
    "id": "aa-010",
    "input": {
      "cotStepQuality": 0.5,
      "arabicFluency": 0.45,
      "distillFidelity": 0.46,
      "agentGrounding": 0.53,
      "multilingualCoverage": 0.57,
      "baselineOptimism": 0.4,
      "reasoningHardness": 0.49,
      "overclaimRisk": 0.39,
      "agentBias": "cot_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 36.53,
      "arabicScore": 49.14,
      "distillScore": 30.54,
      "groundingIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 39,
      "distilledContribution": 44.54,
      "baselineContribution": 29.21,
      "overall": 45.78
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 3.59,
      "arabicScore": 20.03,
      "distillScore": 16.52,
      "groundingIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "distilledContribution": 22.55,
      "baselineContribution": 38.95,
      "overall": 29.08
    }
  },
  {
    "id": "aa-011",
    "input": {
      "cotStepQuality": 0.54,
      "arabicFluency": 0.49,
      "distillFidelity": 0.49,
      "agentGrounding": 0.57,
      "multilingualCoverage": 0.6,
      "baselineOptimism": 0.42,
      "reasoningHardness": 0.49,
      "overclaimRisk": 0.4,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 47.07,
      "arabicScore": 52.75,
      "distillScore": 47.04,
      "groundingIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "distilledContribution": 51.33,
      "baselineContribution": 31.67,
      "overall": 51.79
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 17.1,
      "arabicScore": 21.44,
      "distillScore": 17.92,
      "groundingIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "distilledContribution": 29.83,
      "baselineContribution": 50.43,
      "overall": 39.58
    }
  },
  {
    "id": "aa-012",
    "input": {
      "cotStepQuality": 0.5,
      "arabicFluency": 0.48,
      "distillFidelity": 0.53,
      "agentGrounding": 0.53,
      "multilingualCoverage": 0.56,
      "baselineOptimism": 0.37,
      "reasoningHardness": 0.42,
      "overclaimRisk": 0.35,
      "agentBias": "distill_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 38.25,
      "arabicScore": 51.28,
      "distillScore": 62.01,
      "groundingIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "distilledContribution": 49.26,
      "baselineContribution": 29.77,
      "overall": 49.75
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 13.23,
      "arabicScore": 19.78,
      "distillScore": 16.29,
      "groundingIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "distilledContribution": 24,
      "baselineContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "aa-013",
    "input": {
      "cotStepQuality": 0.54,
      "arabicFluency": 0.52,
      "distillFidelity": 0.56,
      "agentGrounding": 0.57,
      "multilingualCoverage": 0.6,
      "baselineOptimism": 0.39,
      "reasoningHardness": 0.42,
      "overclaimRisk": 0.36,
      "agentBias": "baseline_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 29.17,
      "arabicScore": 44.88,
      "distillScore": 36.64,
      "groundingIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "distilledContribution": 35.8,
      "baselineContribution": 32.85,
      "overall": 36.27
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 22.62,
      "arabicScore": 21.42,
      "distillScore": 17.87,
      "groundingIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "distilledContribution": 33.33,
      "baselineContribution": 57.3,
      "overall": 46.51
    }
  },
  {
    "id": "aa-014",
    "input": {
      "cotStepQuality": 0.58,
      "arabicFluency": 0.56,
      "distillFidelity": 0.6,
      "agentGrounding": 0.61,
      "multilingualCoverage": 0.63,
      "baselineOptimism": 0.4,
      "reasoningHardness": 0.43,
      "overclaimRisk": 0.36,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 52.67,
      "arabicScore": 58.53,
      "distillScore": 56.71,
      "groundingIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49,
      "distilledContribution": 57.89,
      "baselineContribution": 34.85,
      "overall": 57.74
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 20.03,
      "arabicScore": 22.26,
      "distillScore": 18.66,
      "groundingIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "distilledContribution": 31.18,
      "baselineContribution": 52.11,
      "overall": 41.91
    }
  },
  {
    "id": "aa-015",
    "input": {
      "cotStepQuality": 0.62,
      "arabicFluency": 0.54,
      "distillFidelity": 0.56,
      "agentGrounding": 0.65,
      "multilingualCoverage": 0.67,
      "baselineOptimism": 0.36,
      "reasoningHardness": 0.44,
      "overclaimRisk": 0.31,
      "agentBias": "cot_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 45.77,
      "arabicScore": 58.35,
      "distillScore": 39.15,
      "groundingIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "distilledContribution": 54.45,
      "baselineContribution": 36.06,
      "overall": 55.14
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 9.43,
      "arabicScore": 20.94,
      "distillScore": 17.69,
      "groundingIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "distilledContribution": 25.11,
      "baselineContribution": 41.8,
      "overall": 32.75
    }
  },
  {
    "id": "aa-016",
    "input": {
      "cotStepQuality": 0.58,
      "arabicFluency": 0.59,
      "distillFidelity": 0.6,
      "agentGrounding": 0.6,
      "multilingualCoverage": 0.63,
      "baselineOptimism": 0.37,
      "reasoningHardness": 0.36,
      "overclaimRisk": 0.32,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 54.5,
      "arabicScore": 60.67,
      "distillScore": 57.91,
      "groundingIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "distilledContribution": 59.26,
      "baselineContribution": 35.81,
      "overall": 59.04
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 22.05,
      "arabicScore": 21.96,
      "distillScore": 18.63,
      "groundingIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "distilledContribution": 31.3,
      "baselineContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "aa-017",
    "input": {
      "cotStepQuality": 0.62,
      "arabicFluency": 0.63,
      "distillFidelity": 0.63,
      "agentGrounding": 0.64,
      "multilingualCoverage": 0.67,
      "baselineOptimism": 0.39,
      "reasoningHardness": 0.37,
      "overclaimRisk": 0.33,
      "agentBias": "distill_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 48.45,
      "arabicScore": 64.28,
      "distillScore": 75.16,
      "groundingIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "distilledContribution": 60.68,
      "baselineContribution": 38.64,
      "overall": 60.71
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 18.73,
      "arabicScore": 23.45,
      "distillScore": 20.03,
      "groundingIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "distilledContribution": 28.44,
      "baselineContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "aa-018",
    "input": {
      "cotStepQuality": 0.66,
      "arabicFluency": 0.61,
      "distillFidelity": 0.67,
      "agentGrounding": 0.68,
      "multilingualCoverage": 0.7,
      "baselineOptimism": 0.34,
      "reasoningHardness": 0.38,
      "overclaimRisk": 0.27,
      "agentBias": "baseline_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 38.35,
      "arabicScore": 54.13,
      "distillScore": 45.55,
      "groundingIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "distilledContribution": 44.54,
      "baselineContribution": 39.18,
      "overall": 44.58
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 28.36,
      "arabicScore": 21.69,
      "distillScore": 18.35,
      "groundingIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "distilledContribution": 36.47,
      "baselineContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "aa-019",
    "input": {
      "cotStepQuality": 0.7,
      "arabicFluency": 0.65,
      "distillFidelity": 0.7,
      "agentGrounding": 0.72,
      "multilingualCoverage": 0.74,
      "baselineOptimism": 0.36,
      "reasoningHardness": 0.38,
      "overclaimRisk": 0.28,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 63.81,
      "arabicScore": 67.74,
      "distillScore": 68.17,
      "groundingIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "distilledContribution": 68.45,
      "baselineContribution": 42.25,
      "overall": 67.73
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 26.25,
      "arabicScore": 23.32,
      "distillScore": 19.92,
      "groundingIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "distilledContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "aa-020",
    "input": {
      "cotStepQuality": 0.66,
      "arabicFluency": 0.7,
      "distillFidelity": 0.66,
      "agentGrounding": 0.68,
      "multilingualCoverage": 0.7,
      "baselineOptimism": 0.37,
      "reasoningHardness": 0.31,
      "overclaimRisk": 0.29,
      "agentBias": "cot_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 52.86,
      "arabicScore": 70.06,
      "distillScore": 45.74,
      "groundingIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "distilledContribution": 62.46,
      "baselineContribution": 41.54,
      "overall": 62.69
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 13.66,
      "arabicScore": 23.93,
      "distillScore": 20.75,
      "groundingIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "distilledContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "aa-021",
    "input": {
      "cotStepQuality": 0.7,
      "arabicFluency": 0.68,
      "distillFidelity": 0.7,
      "agentGrounding": 0.72,
      "multilingualCoverage": 0.73,
      "baselineOptimism": 0.33,
      "reasoningHardness": 0.31,
      "overclaimRisk": 0.24,
      "agentBias": "balanced",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 65.6,
      "arabicScore": 69.88,
      "distillScore": 69.32,
      "groundingIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "distilledContribution": 69.92,
      "baselineContribution": 42.54,
      "overall": 68.99
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 27.89,
      "arabicScore": 22.72,
      "distillScore": 19.62,
      "groundingIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "distilledContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "aa-022",
    "input": {
      "cotStepQuality": 0.74,
      "arabicFluency": 0.72,
      "distillFidelity": 0.73,
      "agentGrounding": 0.76,
      "multilingualCoverage": 0.77,
      "baselineOptimism": 0.34,
      "reasoningHardness": 0.32,
      "overclaimRisk": 0.25,
      "agentBias": "distill_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 57.6,
      "arabicScore": 73.52,
      "distillScore": 88.84,
      "groundingIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "distilledContribution": 70.81,
      "baselineContribution": 45.13,
      "overall": 70.19
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 24.57,
      "arabicScore": 23.77,
      "distillScore": 20.61,
      "groundingIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "distilledContribution": 30.64,
      "baselineContribution": 46.55,
      "overall": 38.99
    }
  },
  {
    "id": "aa-023",
    "input": {
      "cotStepQuality": 0.79,
      "arabicFluency": 0.76,
      "distillFidelity": 0.77,
      "agentGrounding": 0.8,
      "multilingualCoverage": 0.81,
      "baselineOptimism": 0.36,
      "reasoningHardness": 0.33,
      "overclaimRisk": 0.25,
      "agentBias": "baseline_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 49.01,
      "arabicScore": 67.38,
      "distillScore": 53.71,
      "groundingIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "distilledContribution": 54.84,
      "baselineContribution": 47.99,
      "overall": 54.61
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 33.86,
      "arabicScore": 25.2,
      "distillScore": 21.99,
      "groundingIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "distilledContribution": 41.94,
      "baselineContribution": 71.31,
      "overall": 60.71
    }
  },
  {
    "id": "aa-024",
    "input": {
      "cotStepQuality": 0.75,
      "arabicFluency": 0.75,
      "distillFidelity": 0.81,
      "agentGrounding": 0.76,
      "multilingualCoverage": 0.77,
      "baselineOptimism": 0.31,
      "reasoningHardness": 0.25,
      "overclaimRisk": 0.2,
      "agentBias": "balanced",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 71.63,
      "arabicScore": 75.91,
      "distillScore": 79.08,
      "groundingIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "distilledContribution": 76.71,
      "baselineContribution": 46.16,
      "overall": 75.21
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 31.21,
      "arabicScore": 23.47,
      "distillScore": 20.27,
      "groundingIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "distilledContribution": 35.94,
      "baselineContribution": 58.02,
      "overall": 49.96
    }
  },
  {
    "id": "aa-025",
    "input": {
      "cotStepQuality": 0.79,
      "arabicFluency": 0.79,
      "distillFidelity": 0.77,
      "agentGrounding": 0.8,
      "multilingualCoverage": 0.8,
      "baselineOptimism": 0.33,
      "reasoningHardness": 0.26,
      "overclaimRisk": 0.21,
      "agentBias": "cot_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 62.49,
      "arabicScore": 79.52,
      "distillScore": 54.83,
      "groundingIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "distilledContribution": 72.68,
      "baselineContribution": 48.24,
      "overall": 72.28
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 19.5,
      "arabicScore": 24.56,
      "distillScore": 21.65,
      "groundingIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "distilledContribution": 30.37,
      "baselineContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "aa-026",
    "input": {
      "cotStepQuality": 0.83,
      "arabicFluency": 0.83,
      "distillFidelity": 0.8,
      "agentGrounding": 0.83,
      "multilingualCoverage": 0.84,
      "baselineOptimism": 0.34,
      "reasoningHardness": 0.27,
      "overclaimRisk": 0.22,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 78.48,
      "arabicScore": 83.17,
      "distillScore": 80.25,
      "groundingIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73,
      "distilledContribution": 82.13,
      "baselineContribution": 50.82,
      "overall": 80.49
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 33.17,
      "arabicScore": 25.61,
      "distillScore": 22.62,
      "groundingIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "distilledContribution": 38.9,
      "baselineContribution": 63,
      "overall": 54.22
    }
  },
  {
    "id": "aa-027",
    "input": {
      "cotStepQuality": 0.87,
      "arabicFluency": 0.81,
      "distillFidelity": 0.84,
      "agentGrounding": 0.87,
      "multilingualCoverage": 0.88,
      "baselineOptimism": 0.3,
      "reasoningHardness": 0.27,
      "overclaimRisk": 0.17,
      "agentBias": "distill_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 67.22,
      "arabicScore": 82.98,
      "distillScore": 100,
      "groundingIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "distilledContribution": 80.37,
      "baselineContribution": 52.46,
      "overall": 79.35
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 30.78,
      "arabicScore": 24.64,
      "distillScore": 21.68,
      "groundingIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "distilledContribution": 33.39,
      "baselineContribution": 49.68,
      "overall": 42.92
    }
  },
  {
    "id": "aa-028",
    "input": {
      "cotStepQuality": 0.83,
      "arabicFluency": 0.86,
      "distillFidelity": 0.87,
      "agentGrounding": 0.83,
      "multilingualCoverage": 0.84,
      "baselineOptimism": 0.31,
      "reasoningHardness": 0.2,
      "overclaimRisk": 0.17,
      "agentBias": "baseline_first",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 54.91,
      "arabicScore": 75.3,
      "distillScore": 60.67,
      "groundingIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "distilledContribution": 61.11,
      "baselineContribution": 51.78,
      "overall": 60.43
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 38.81,
      "arabicScore": 25.31,
      "distillScore": 22.24,
      "groundingIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "distilledContribution": 43.36,
      "baselineContribution": 72.62,
      "overall": 63.56
    }
  },
  {
    "id": "aa-029",
    "input": {
      "cotStepQuality": 0.87,
      "arabicFluency": 0.9,
      "distillFidelity": 0.91,
      "agentGrounding": 0.87,
      "multilingualCoverage": 0.87,
      "baselineOptimism": 0.33,
      "reasoningHardness": 0.2,
      "overclaimRisk": 0.18,
      "agentBias": "balanced",
      "profile": "arabic_cot_distilled_agent"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 83.93,
      "arabicScore": 88.91,
      "distillScore": 89.77,
      "groundingIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "distilledContribution": 88.6,
      "baselineContribution": 54.2,
      "overall": 86.41
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 36.33,
      "arabicScore": 26.66,
      "distillScore": 23.53,
      "groundingIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "distilledContribution": 40.52,
      "baselineContribution": 65.11,
      "overall": 57.02
    }
  },
  {
    "id": "aa-030",
    "input": {
      "cotStepQuality": 0.91,
      "arabicFluency": 0.88,
      "distillFidelity": 0.87,
      "agentGrounding": 0.91,
      "multilingualCoverage": 0.91,
      "baselineOptimism": 0.28,
      "reasoningHardness": 0.21,
      "overclaimRisk": 0.13,
      "agentBias": "cot_first",
      "profile": "nondistilled_multilingual_baseline"
    },
    "expectedDistilled": {
      "mode": "arabic_cot_distilled_agent",
      "cotScore": 71.56,
      "arabicScore": 88.77,
      "distillScore": 63.21,
      "groundingIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "distilledContribution": 79.61,
      "baselineContribution": 55.26,
      "overall": 79.23
    },
    "expectedBaseline": {
      "mode": "nondistilled_multilingual_baseline",
      "cotScore": 25.72,
      "arabicScore": 25,
      "distillScore": 22.26,
      "groundingIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "distilledContribution": 32.84,
      "baselineContribution": 50.65,
      "overall": 44.27
    }
  }
];
