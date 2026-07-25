import type { ColearnInput, ColearnQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ColearnInput;
  expectedHumanAi: ColearnQuality;
  expectedAiOnly: ColearnQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sc-001",
    "input": {
      "clinicianAgreement": 0.29,
      "activitySignal": 0.25,
      "ehrCompleteness": 0.28,
      "labelStability": 0.34,
      "aiOnlyConfidence": 0.39,
      "baselineOptimism": 0.45,
      "labelingHardness": 0.59,
      "overclaimRisk": 0.5,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 22.53,
      "activityScore": 30.25,
      "ehrScore": 23.45,
      "stabilityIntegrity": 37.64,
      "aiOnlyScore": 16.4,
      "confidence": 20.85,
      "humanAiContribution": 27.96,
      "aiOnlyContribution": 15.92,
      "overall": 29.79
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 5.76,
      "activityScore": 17.05,
      "ehrScore": 12.78,
      "stabilityIntegrity": 32.39,
      "aiOnlyScore": 40.93,
      "confidence": 17.1,
      "humanAiContribution": 21.78,
      "aiOnlyContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "sc-002",
    "input": {
      "clinicianAgreement": 0.33,
      "activitySignal": 0.29,
      "ehrCompleteness": 0.32,
      "labelStability": 0.38,
      "aiOnlyConfidence": 0.43,
      "baselineOptimism": 0.46,
      "labelingHardness": 0.6,
      "overclaimRisk": 0.51,
      "labelingBias": "activity_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 22.19,
      "activityScore": 33.9,
      "ehrScore": 34.35,
      "stabilityIntegrity": 31.9,
      "aiOnlyScore": 18.89,
      "confidence": 24.5,
      "humanAiContribution": 30.54,
      "aiOnlyContribution": 18.58,
      "overall": 32.39
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 2.43,
      "activityScore": 18.17,
      "ehrScore": 13.81,
      "stabilityIntegrity": 34.08,
      "aiOnlyScore": 31.53,
      "confidence": 18.65,
      "humanAiContribution": 20,
      "aiOnlyContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "sc-003",
    "input": {
      "clinicianAgreement": 0.37,
      "activitySignal": 0.27,
      "ehrCompleteness": 0.36,
      "labelStability": 0.42,
      "aiOnlyConfidence": 0.46,
      "baselineOptimism": 0.42,
      "labelingHardness": 0.6,
      "overclaimRisk": 0.46,
      "labelingBias": "ai_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 12.16,
      "activityScore": 23.71,
      "ehrScore": 20.92,
      "stabilityIntegrity": 19.24,
      "aiOnlyScore": 19.94,
      "confidence": 27.1,
      "humanAiContribution": 18.94,
      "aiOnlyContribution": 19.65,
      "overall": 20.07
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 12.17,
      "activityScore": 17.05,
      "ehrScore": 12.78,
      "stabilityIntegrity": 33.93,
      "aiOnlyScore": 54.34,
      "confidence": 18.4,
      "humanAiContribution": 26.05,
      "aiOnlyContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "sc-004",
    "input": {
      "clinicianAgreement": 0.33,
      "activitySignal": 0.32,
      "ehrCompleteness": 0.39,
      "labelStability": 0.38,
      "aiOnlyConfidence": 0.42,
      "baselineOptimism": 0.43,
      "labelingHardness": 0.53,
      "overclaimRisk": 0.46,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 28.27,
      "activityScore": 36.03,
      "ehrScore": 33.26,
      "stabilityIntegrity": 42.23,
      "aiOnlyScore": 18.93,
      "confidence": 25.85,
      "humanAiContribution": 34.6,
      "aiOnlyContribution": 19.24,
      "overall": 35.84
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 8.7,
      "activityScore": 18.05,
      "ehrScore": 14.08,
      "stabilityIntegrity": 32.79,
      "aiOnlyScore": 42.77,
      "confidence": 18.85,
      "humanAiContribution": 23.28,
      "aiOnlyContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "sc-005",
    "input": {
      "clinicianAgreement": 0.37,
      "activitySignal": 0.36,
      "ehrCompleteness": 0.35,
      "labelStability": 0.42,
      "aiOnlyConfidence": 0.46,
      "baselineOptimism": 0.45,
      "labelingHardness": 0.53,
      "overclaimRisk": 0.47,
      "labelingBias": "clinician_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 26.81,
      "activityScore": 39.64,
      "ehrScore": 21.33,
      "stabilityIntegrity": 54.3,
      "aiOnlyScore": 21.8,
      "confidence": 29.35,
      "humanAiContribution": 34.4,
      "aiOnlyContribution": 22.12,
      "overall": 36.19
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 0,
      "activityScore": 19.43,
      "ehrScore": 15.31,
      "stabilityIntegrity": 34.77,
      "aiOnlyScore": 32.95,
      "confidence": 21.05,
      "humanAiContribution": 20.49,
      "aiOnlyContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "sc-006",
    "input": {
      "clinicianAgreement": 0.41,
      "activitySignal": 0.34,
      "ehrCompleteness": 0.39,
      "labelStability": 0.45,
      "aiOnlyConfidence": 0.5,
      "baselineOptimism": 0.4,
      "labelingHardness": 0.54,
      "overclaimRisk": 0.42,
      "labelingBias": "balanced",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 33.88,
      "activityScore": 39.5,
      "ehrScore": 35.78,
      "stabilityIntegrity": 47.85,
      "aiOnlyScore": 23.08,
      "confidence": 31.85,
      "humanAiContribution": 38.83,
      "aiOnlyContribution": 23.32,
      "overall": 40.04
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 11.98,
      "activityScore": 17.95,
      "ehrScore": 13.91,
      "stabilityIntegrity": 34.78,
      "aiOnlyScore": 46.72,
      "confidence": 20.5,
      "humanAiContribution": 25.07,
      "aiOnlyContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "sc-007",
    "input": {
      "clinicianAgreement": 0.45,
      "activitySignal": 0.38,
      "ehrCompleteness": 0.42,
      "labelStability": 0.49,
      "aiOnlyConfidence": 0.53,
      "baselineOptimism": 0.42,
      "labelingHardness": 0.55,
      "overclaimRisk": 0.43,
      "labelingBias": "activity_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 31.52,
      "activityScore": 43.11,
      "ehrScore": 48.27,
      "stabilityIntegrity": 39.34,
      "aiOnlyScore": 25.15,
      "confidence": 35.35,
      "humanAiContribution": 40.71,
      "aiOnlyContribution": 25.54,
      "overall": 41.98
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 8.27,
      "activityScore": 19.21,
      "ehrScore": 15.09,
      "stabilityIntegrity": 36.3,
      "aiOnlyScore": 34.2,
      "confidence": 22.15,
      "humanAiContribution": 22.61,
      "aiOnlyContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "sc-008",
    "input": {
      "clinicianAgreement": 0.41,
      "activitySignal": 0.43,
      "ehrCompleteness": 0.46,
      "labelStability": 0.45,
      "aiOnlyConfidence": 0.49,
      "baselineOptimism": 0.43,
      "labelingHardness": 0.47,
      "overclaimRisk": 0.44,
      "labelingBias": "ai_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 19.43,
      "activityScore": 35.43,
      "ehrScore": 27.76,
      "stabilityIntegrity": 24.76,
      "aiOnlyScore": 24.32,
      "confidence": 34.1,
      "humanAiContribution": 26.78,
      "aiOnlyContribution": 25.37,
      "overall": 27.53
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 16.4,
      "activityScore": 20.36,
      "ehrScore": 16.57,
      "stabilityIntegrity": 35.17,
      "aiOnlyScore": 58.5,
      "confidence": 22.7,
      "humanAiContribution": 29.4,
      "aiOnlyContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "sc-009",
    "input": {
      "clinicianAgreement": 0.46,
      "activitySignal": 0.41,
      "ehrCompleteness": 0.5,
      "labelStability": 0.49,
      "aiOnlyConfidence": 0.53,
      "baselineOptimism": 0.39,
      "labelingHardness": 0.48,
      "overclaimRisk": 0.38,
      "labelingBias": "balanced",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 40.16,
      "activityScore": 45.49,
      "ehrScore": 45.8,
      "stabilityIntegrity": 52.59,
      "aiOnlyScore": 25.81,
      "confidence": 37.1,
      "humanAiContribution": 45.75,
      "aiOnlyContribution": 26.81,
      "overall": 46.34
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 14.91,
      "activityScore": 19.22,
      "ehrScore": 15.52,
      "stabilityIntegrity": 35.36,
      "aiOnlyScore": 48.88,
      "confidence": 22.7,
      "humanAiContribution": 26.78,
      "aiOnlyContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "sc-010",
    "input": {
      "clinicianAgreement": 0.5,
      "activitySignal": 0.45,
      "ehrCompleteness": 0.46,
      "labelStability": 0.53,
      "aiOnlyConfidence": 0.57,
      "baselineOptimism": 0.4,
      "labelingHardness": 0.49,
      "overclaimRisk": 0.39,
      "labelingBias": "clinician_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 36.53,
      "activityScore": 49.14,
      "ehrScore": 30.54,
      "stabilityIntegrity": 66.82,
      "aiOnlyScore": 28.29,
      "confidence": 40.75,
      "humanAiContribution": 44.54,
      "aiOnlyContribution": 29.21,
      "overall": 45.78
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 3.59,
      "activityScore": 20.03,
      "ehrScore": 16.17,
      "stabilityIntegrity": 37.06,
      "aiOnlyScore": 35.54,
      "confidence": 24.25,
      "humanAiContribution": 22.48,
      "aiOnlyContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "sc-011",
    "input": {
      "clinicianAgreement": 0.54,
      "activitySignal": 0.49,
      "ehrCompleteness": 0.49,
      "labelStability": 0.57,
      "aiOnlyConfidence": 0.6,
      "baselineOptimism": 0.42,
      "labelingHardness": 0.49,
      "overclaimRisk": 0.4,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 47.07,
      "activityScore": 52.75,
      "ehrScore": 47.04,
      "stabilityIntegrity": 60.27,
      "aiOnlyScore": 30.54,
      "confidence": 44.25,
      "humanAiContribution": 51.33,
      "aiOnlyContribution": 31.67,
      "overall": 51.79
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 17.1,
      "activityScore": 21.44,
      "ehrScore": 17.52,
      "stabilityIntegrity": 38.58,
      "aiOnlyScore": 54.12,
      "confidence": 26.1,
      "humanAiContribution": 29.75,
      "aiOnlyContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "sc-012",
    "input": {
      "clinicianAgreement": 0.5,
      "activitySignal": 0.48,
      "ehrCompleteness": 0.53,
      "labelStability": 0.53,
      "aiOnlyConfidence": 0.56,
      "baselineOptimism": 0.37,
      "labelingHardness": 0.42,
      "overclaimRisk": 0.35,
      "labelingBias": "activity_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 38.25,
      "activityScore": 51.28,
      "ehrScore": 62.01,
      "stabilityIntegrity": 43.82,
      "aiOnlyScore": 28.34,
      "confidence": 42.1,
      "humanAiContribution": 49.26,
      "aiOnlyContribution": 29.77,
      "overall": 49.75
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 13.23,
      "activityScore": 19.78,
      "ehrScore": 16.29,
      "stabilityIntegrity": 35.76,
      "aiOnlyScore": 34.93,
      "confidence": 24.35,
      "humanAiContribution": 24,
      "aiOnlyContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "sc-013",
    "input": {
      "clinicianAgreement": 0.54,
      "activitySignal": 0.52,
      "ehrCompleteness": 0.56,
      "labelStability": 0.57,
      "aiOnlyConfidence": 0.6,
      "baselineOptimism": 0.39,
      "labelingHardness": 0.42,
      "overclaimRisk": 0.36,
      "labelingBias": "ai_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 29.17,
      "activityScore": 44.88,
      "ehrScore": 36.64,
      "stabilityIntegrity": 32.66,
      "aiOnlyScore": 31.2,
      "confidence": 45.6,
      "humanAiContribution": 35.8,
      "aiOnlyContribution": 32.85,
      "overall": 36.27
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 22.62,
      "activityScore": 21.42,
      "ehrScore": 17.82,
      "stabilityIntegrity": 37.74,
      "aiOnlyScore": 67.02,
      "confidence": 26.55,
      "humanAiContribution": 33.32,
      "aiOnlyContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "sc-014",
    "input": {
      "clinicianAgreement": 0.58,
      "activitySignal": 0.56,
      "ehrCompleteness": 0.6,
      "labelStability": 0.61,
      "aiOnlyConfidence": 0.63,
      "baselineOptimism": 0.4,
      "labelingHardness": 0.43,
      "overclaimRisk": 0.36,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 52.67,
      "activityScore": 58.53,
      "ehrScore": 56.71,
      "stabilityIntegrity": 64.86,
      "aiOnlyScore": 33.07,
      "confidence": 49.25,
      "humanAiContribution": 57.89,
      "aiOnlyContribution": 34.85,
      "overall": 57.74
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 20.03,
      "activityScore": 22.26,
      "ehrScore": 18.61,
      "stabilityIntegrity": 38.98,
      "aiOnlyScore": 55.96,
      "confidence": 27.85,
      "humanAiContribution": 31.17,
      "aiOnlyContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "sc-015",
    "input": {
      "clinicianAgreement": 0.62,
      "activitySignal": 0.54,
      "ehrCompleteness": 0.56,
      "labelStability": 0.65,
      "aiOnlyConfidence": 0.67,
      "baselineOptimism": 0.36,
      "labelingHardness": 0.44,
      "overclaimRisk": 0.31,
      "labelingBias": "clinician_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 45.77,
      "activityScore": 58.35,
      "ehrScore": 39.15,
      "stabilityIntegrity": 79.94,
      "aiOnlyScore": 34.55,
      "confidence": 51.85,
      "humanAiContribution": 54.45,
      "aiOnlyContribution": 36.06,
      "overall": 55.14
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 9.43,
      "activityScore": 20.94,
      "ehrScore": 17.24,
      "stabilityIntegrity": 39.27,
      "aiOnlyScore": 38.2,
      "confidence": 27.75,
      "humanAiContribution": 25.02,
      "aiOnlyContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "sc-016",
    "input": {
      "clinicianAgreement": 0.58,
      "activitySignal": 0.59,
      "ehrCompleteness": 0.6,
      "labelStability": 0.6,
      "aiOnlyConfidence": 0.63,
      "baselineOptimism": 0.37,
      "labelingHardness": 0.36,
      "overclaimRisk": 0.32,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 54.5,
      "activityScore": 60.67,
      "ehrScore": 57.91,
      "stabilityIntegrity": 65.05,
      "aiOnlyScore": 33.73,
      "confidence": 50.35,
      "humanAiContribution": 59.26,
      "aiOnlyContribution": 35.81,
      "overall": 59.04
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 22.05,
      "activityScore": 21.96,
      "ehrScore": 18.63,
      "stabilityIntegrity": 38.14,
      "aiOnlyScore": 55.7,
      "confidence": 28.3,
      "humanAiContribution": 31.3,
      "aiOnlyContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "sc-017",
    "input": {
      "clinicianAgreement": 0.62,
      "activitySignal": 0.63,
      "ehrCompleteness": 0.63,
      "labelStability": 0.64,
      "aiOnlyConfidence": 0.67,
      "baselineOptimism": 0.39,
      "labelingHardness": 0.37,
      "overclaimRisk": 0.33,
      "labelingBias": "activity_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 48.45,
      "activityScore": 64.28,
      "ehrScore": 75.16,
      "stabilityIntegrity": 52.76,
      "aiOnlyScore": 36.41,
      "confidence": 53.85,
      "humanAiContribution": 60.68,
      "aiOnlyContribution": 38.64,
      "overall": 60.71
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 18.73,
      "activityScore": 23.45,
      "ehrScore": 19.98,
      "stabilityIntegrity": 40.11,
      "aiOnlyScore": 39.86,
      "confidence": 30.3,
      "humanAiContribution": 28.43,
      "aiOnlyContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "sc-018",
    "input": {
      "clinicianAgreement": 0.66,
      "activitySignal": 0.61,
      "ehrCompleteness": 0.67,
      "labelStability": 0.68,
      "aiOnlyConfidence": 0.7,
      "baselineOptimism": 0.34,
      "labelingHardness": 0.38,
      "overclaimRisk": 0.27,
      "labelingBias": "ai_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 38.35,
      "activityScore": 54.13,
      "ehrScore": 45.55,
      "stabilityIntegrity": 40.09,
      "aiOnlyScore": 37.08,
      "confidence": 56.6,
      "humanAiContribution": 44.54,
      "aiOnlyContribution": 39.18,
      "overall": 44.58
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 28.36,
      "activityScore": 21.69,
      "ehrScore": 18.3,
      "stabilityIntegrity": 39.67,
      "aiOnlyScore": 74.27,
      "confidence": 29.5,
      "humanAiContribution": 36.46,
      "aiOnlyContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "sc-019",
    "input": {
      "clinicianAgreement": 0.7,
      "activitySignal": 0.65,
      "ehrCompleteness": 0.7,
      "labelStability": 0.72,
      "aiOnlyConfidence": 0.74,
      "baselineOptimism": 0.36,
      "labelingHardness": 0.38,
      "overclaimRisk": 0.28,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 63.81,
      "activityScore": 67.74,
      "ehrScore": 68.17,
      "stabilityIntegrity": 75.07,
      "aiOnlyScore": 39.94,
      "confidence": 60.1,
      "humanAiContribution": 68.45,
      "aiOnlyContribution": 42.25,
      "overall": 67.73
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 26.25,
      "activityScore": 23.32,
      "ehrScore": 19.82,
      "stabilityIntegrity": 41.65,
      "aiOnlyScore": 62.07,
      "confidence": 31.7,
      "humanAiContribution": 34.62,
      "aiOnlyContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sc-020",
    "input": {
      "clinicianAgreement": 0.66,
      "activitySignal": 0.7,
      "ehrCompleteness": 0.66,
      "labelStability": 0.68,
      "aiOnlyConfidence": 0.7,
      "baselineOptimism": 0.37,
      "labelingHardness": 0.31,
      "overclaimRisk": 0.29,
      "labelingBias": "clinician_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 52.86,
      "activityScore": 70.06,
      "ehrScore": 45.74,
      "stabilityIntegrity": 86.81,
      "aiOnlyScore": 38.94,
      "confidence": 58.85,
      "humanAiContribution": 62.46,
      "aiOnlyContribution": 41.54,
      "overall": 62.69
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 13.66,
      "activityScore": 23.93,
      "ehrScore": 20.65,
      "stabilityIntegrity": 40.51,
      "aiOnlyScore": 40.86,
      "confidence": 32.05,
      "humanAiContribution": 27.92,
      "aiOnlyContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sc-021",
    "input": {
      "clinicianAgreement": 0.7,
      "activitySignal": 0.68,
      "ehrCompleteness": 0.7,
      "labelStability": 0.72,
      "aiOnlyConfidence": 0.73,
      "baselineOptimism": 0.33,
      "labelingHardness": 0.31,
      "overclaimRisk": 0.24,
      "labelingBias": "balanced",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 65.6,
      "activityScore": 69.88,
      "ehrScore": 69.32,
      "stabilityIntegrity": 75.82,
      "aiOnlyScore": 39.99,
      "confidence": 61.45,
      "humanAiContribution": 69.92,
      "aiOnlyContribution": 42.54,
      "overall": 68.99
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 27.89,
      "activityScore": 22.72,
      "ehrScore": 19.52,
      "stabilityIntegrity": 40.35,
      "aiOnlyScore": 61.19,
      "confidence": 31.8,
      "humanAiContribution": 34.33,
      "aiOnlyContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sc-022",
    "input": {
      "clinicianAgreement": 0.74,
      "activitySignal": 0.72,
      "ehrCompleteness": 0.73,
      "labelStability": 0.76,
      "aiOnlyConfidence": 0.77,
      "baselineOptimism": 0.34,
      "labelingHardness": 0.32,
      "overclaimRisk": 0.25,
      "labelingBias": "activity_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 57.6,
      "activityScore": 73.52,
      "ehrScore": 88.84,
      "stabilityIntegrity": 60.51,
      "aiOnlyScore": 42.47,
      "confidence": 65.1,
      "humanAiContribution": 70.81,
      "aiOnlyContribution": 45.13,
      "overall": 70.19
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 24.57,
      "activityScore": 23.77,
      "ehrScore": 20.46,
      "stabilityIntegrity": 42.05,
      "aiOnlyScore": 42.21,
      "confidence": 33.35,
      "humanAiContribution": 30.61,
      "aiOnlyContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "sc-023",
    "input": {
      "clinicianAgreement": 0.79,
      "activitySignal": 0.76,
      "ehrCompleteness": 0.77,
      "labelStability": 0.8,
      "aiOnlyConfidence": 0.81,
      "baselineOptimism": 0.36,
      "labelingHardness": 0.33,
      "overclaimRisk": 0.25,
      "labelingBias": "ai_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 49.01,
      "activityScore": 67.38,
      "ehrScore": 53.71,
      "stabilityIntegrity": 49.49,
      "aiOnlyScore": 45.16,
      "confidence": 69,
      "humanAiContribution": 54.84,
      "aiOnlyContribution": 47.99,
      "overall": 54.61
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 33.86,
      "activityScore": 25.2,
      "ehrScore": 21.84,
      "stabilityIntegrity": 43.92,
      "aiOnlyScore": 84.72,
      "confidence": 35.45,
      "humanAiContribution": 41.91,
      "aiOnlyContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "sc-024",
    "input": {
      "clinicianAgreement": 0.75,
      "activitySignal": 0.75,
      "ehrCompleteness": 0.81,
      "labelStability": 0.76,
      "aiOnlyConfidence": 0.77,
      "baselineOptimism": 0.31,
      "labelingHardness": 0.25,
      "overclaimRisk": 0.2,
      "labelingBias": "balanced",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 71.63,
      "activityScore": 75.91,
      "ehrScore": 79.08,
      "stabilityIntegrity": 80.56,
      "aiOnlyScore": 43.13,
      "confidence": 66.85,
      "humanAiContribution": 76.71,
      "aiOnlyContribution": 46.16,
      "overall": 75.21
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 31.21,
      "activityScore": 23.47,
      "ehrScore": 20.52,
      "stabilityIntegrity": 41.11,
      "aiOnlyScore": 63.65,
      "confidence": 33.9,
      "humanAiContribution": 35.99,
      "aiOnlyContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "sc-025",
    "input": {
      "clinicianAgreement": 0.79,
      "activitySignal": 0.79,
      "ehrCompleteness": 0.77,
      "labelStability": 0.8,
      "aiOnlyConfidence": 0.8,
      "baselineOptimism": 0.33,
      "labelingHardness": 0.26,
      "overclaimRisk": 0.21,
      "labelingBias": "clinician_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 62.49,
      "activityScore": 79.52,
      "ehrScore": 54.83,
      "stabilityIntegrity": 100,
      "aiOnlyScore": 45.2,
      "confidence": 70.35,
      "humanAiContribution": 72.68,
      "aiOnlyContribution": 48.24,
      "overall": 72.28
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 19.5,
      "activityScore": 24.56,
      "ehrScore": 21.5,
      "stabilityIntegrity": 42.63,
      "aiOnlyScore": 43.52,
      "confidence": 35.55,
      "humanAiContribution": 30.34,
      "aiOnlyContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "sc-026",
    "input": {
      "clinicianAgreement": 0.83,
      "activitySignal": 0.83,
      "ehrCompleteness": 0.8,
      "labelStability": 0.83,
      "aiOnlyConfidence": 0.84,
      "baselineOptimism": 0.34,
      "labelingHardness": 0.27,
      "overclaimRisk": 0.22,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 78.48,
      "activityScore": 83.17,
      "ehrScore": 80.25,
      "stabilityIntegrity": 87.68,
      "aiOnlyScore": 47.68,
      "confidence": 73.75,
      "humanAiContribution": 82.13,
      "aiOnlyContribution": 50.82,
      "overall": 80.49
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 33.17,
      "activityScore": 25.61,
      "ehrScore": 22.47,
      "stabilityIntegrity": 44.32,
      "aiOnlyScore": 68.8,
      "confidence": 37.1,
      "humanAiContribution": 38.87,
      "aiOnlyContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "sc-027",
    "input": {
      "clinicianAgreement": 0.87,
      "activitySignal": 0.81,
      "ehrCompleteness": 0.84,
      "labelStability": 0.87,
      "aiOnlyConfidence": 0.88,
      "baselineOptimism": 0.3,
      "labelingHardness": 0.27,
      "overclaimRisk": 0.17,
      "labelingBias": "activity_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 67.22,
      "activityScore": 82.98,
      "ehrScore": 100,
      "stabilityIntegrity": 68.1,
      "aiOnlyScore": 49.35,
      "confidence": 76.35,
      "humanAiContribution": 80.37,
      "aiOnlyContribution": 52.46,
      "overall": 79.35
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 30.78,
      "activityScore": 24.64,
      "ehrScore": 21.53,
      "stabilityIntegrity": 44.62,
      "aiOnlyScore": 45.22,
      "confidence": 37.2,
      "humanAiContribution": 33.36,
      "aiOnlyContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "sc-028",
    "input": {
      "clinicianAgreement": 0.83,
      "activitySignal": 0.86,
      "ehrCompleteness": 0.87,
      "labelStability": 0.83,
      "aiOnlyConfidence": 0.84,
      "baselineOptimism": 0.31,
      "labelingHardness": 0.2,
      "overclaimRisk": 0.17,
      "labelingBias": "ai_first",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 54.91,
      "activityScore": 75.3,
      "ehrScore": 60.67,
      "stabilityIntegrity": 53.51,
      "aiOnlyScore": 48.34,
      "confidence": 75.1,
      "humanAiContribution": 61.11,
      "aiOnlyContribution": 51.78,
      "overall": 60.43
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 38.81,
      "activityScore": 25.31,
      "ehrScore": 22.44,
      "stabilityIntegrity": 43.48,
      "aiOnlyScore": 86.95,
      "confidence": 37.65,
      "humanAiContribution": 43.4,
      "aiOnlyContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "sc-029",
    "input": {
      "clinicianAgreement": 0.87,
      "activitySignal": 0.9,
      "ehrCompleteness": 0.91,
      "labelStability": 0.87,
      "aiOnlyConfidence": 0.87,
      "baselineOptimism": 0.33,
      "labelingHardness": 0.2,
      "overclaimRisk": 0.18,
      "labelingBias": "balanced",
      "profile": "human_ai_colearning_labeling"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 83.93,
      "activityScore": 88.91,
      "ehrScore": 89.77,
      "stabilityIntegrity": 92.27,
      "aiOnlyScore": 50.59,
      "confidence": 78.6,
      "humanAiContribution": 88.6,
      "aiOnlyContribution": 54.2,
      "overall": 86.41
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 36.33,
      "activityScore": 26.66,
      "ehrScore": 23.73,
      "stabilityIntegrity": 45,
      "aiOnlyScore": 71.06,
      "confidence": 39.5,
      "humanAiContribution": 40.56,
      "aiOnlyContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "sc-030",
    "input": {
      "clinicianAgreement": 0.91,
      "activitySignal": 0.88,
      "ehrCompleteness": 0.87,
      "labelStability": 0.91,
      "aiOnlyConfidence": 0.91,
      "baselineOptimism": 0.28,
      "labelingHardness": 0.21,
      "overclaimRisk": 0.13,
      "labelingBias": "clinician_first",
      "profile": "ai_only_labeling_baseline"
    },
    "expectedHumanAi": {
      "mode": "human_ai_colearning_labeling",
      "agreementScore": 71.56,
      "activityScore": 88.77,
      "ehrScore": 63.21,
      "stabilityIntegrity": 100,
      "aiOnlyScore": 51.88,
      "confidence": 81.35,
      "humanAiContribution": 79.61,
      "aiOnlyContribution": 55.26,
      "overall": 79.23
    },
    "expectedAiOnly": {
      "mode": "ai_only_labeling_baseline",
      "agreementScore": 25.72,
      "activityScore": 25,
      "ehrScore": 22.06,
      "stabilityIntegrity": 45.02,
      "aiOnlyScore": 46.21,
      "confidence": 38.95,
      "humanAiContribution": 32.8,
      "aiOnlyContribution": 50.65,
      "overall": 44.26
    }
  }
];
