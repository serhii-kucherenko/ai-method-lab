import type { FluInput, FluQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FluInput;
  expectedExpanded: FluQuality;
  expectedBaseline: FluQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ef-001",
    "input": {
      "coverage65Plus": 0.29,
      "eivUptakeShare": 0.34,
      "winterBurdenIndex": 0.55,
      "hospitalPressure": 0.5,
      "policyStickiness": 0.45,
      "nordicParity": 0.34,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 35.36,
      "eivScore": 36.19,
      "winterScore": 48.02,
      "hospitalScore": 32.4,
      "policyPenalty": 35.33,
      "confidence": 15.7,
      "expandedContribution": 43.91,
      "baselineContribution": 34.97,
      "overall": 46.3
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 11.49,
      "eivScore": 25.99,
      "winterScore": 22.97,
      "hospitalScore": 38.4,
      "policyPenalty": 30.21,
      "confidence": 12.49,
      "expandedContribution": 33.73,
      "baselineContribution": 29.77,
      "overall": 25.6
    }
  },
  {
    "id": "ef-002",
    "input": {
      "coverage65Plus": 0.33,
      "eivUptakeShare": 0.38,
      "winterBurdenIndex": 0.56,
      "hospitalPressure": 0.51,
      "policyStickiness": 0.46,
      "nordicParity": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "programBias": "coverage_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 43.52,
      "eivScore": 29.12,
      "winterScore": 63.49,
      "hospitalScore": 33.38,
      "policyPenalty": 35.1,
      "confidence": 18.7,
      "expandedContribution": 48.13,
      "baselineContribution": 37.06,
      "overall": 50.14
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 11.88,
      "eivScore": 33.15,
      "winterScore": 24.58,
      "hospitalScore": 47.52,
      "policyPenalty": 29.59,
      "confidence": 15.19,
      "expandedContribution": 37.51,
      "baselineContribution": 36.83,
      "overall": 31.64
    }
  },
  {
    "id": "ef-003",
    "input": {
      "coverage65Plus": 0.37,
      "eivUptakeShare": 0.42,
      "winterBurdenIndex": 0.5,
      "hospitalPressure": 0.46,
      "policyStickiness": 0.42,
      "nordicParity": 0.41,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "programBias": "baseline_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 15.93,
      "eivScore": 23.48,
      "winterScore": 31.42,
      "hospitalScore": 37.98,
      "policyPenalty": 30.9,
      "confidence": 22.9,
      "expandedContribution": 31.33,
      "baselineContribution": 28.29,
      "overall": 31.78
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 13.27,
      "eivScore": 35.32,
      "winterScore": 22.74,
      "hospitalScore": 51.57,
      "policyPenalty": 29.55,
      "confidence": 19.24,
      "expandedContribution": 38.67,
      "baselineContribution": 39.57,
      "overall": 34.09
    }
  },
  {
    "id": "ef-004",
    "input": {
      "coverage65Plus": 0.33,
      "eivUptakeShare": 0.38,
      "winterBurdenIndex": 0.51,
      "hospitalPressure": 0.46,
      "policyStickiness": 0.43,
      "nordicParity": 0.37,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 39.84,
      "eivScore": 39.66,
      "winterScore": 52.14,
      "hospitalScore": 36.26,
      "policyPenalty": 32.6,
      "confidence": 19.7,
      "expandedContribution": 47.7,
      "baselineContribution": 37.49,
      "overall": 49.86
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 12.76,
      "eivScore": 27.77,
      "winterScore": 22.35,
      "hospitalScore": 40.96,
      "policyPenalty": 29.69,
      "confidence": 16.22,
      "expandedContribution": 34.83,
      "baselineContribution": 31.74,
      "overall": 27.38
    }
  },
  {
    "id": "ef-005",
    "input": {
      "coverage65Plus": 0.37,
      "eivUptakeShare": 0.42,
      "winterBurdenIndex": 0.51,
      "hospitalPressure": 0.47,
      "policyStickiness": 0.45,
      "nordicParity": 0.41,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "programBias": "eiv_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 48.54,
      "eivScore": 52.18,
      "winterScore": 30.91,
      "hospitalScore": 37.11,
      "policyPenalty": 32.9,
      "confidence": 22.7,
      "expandedContribution": 48.67,
      "baselineContribution": 35.34,
      "overall": 50.27
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 1.15,
      "eivScore": 22.35,
      "winterScore": 24.17,
      "hospitalScore": 27.94,
      "policyPenalty": 28.5,
      "confidence": 18.99,
      "expandedContribution": 29.42,
      "baselineContribution": 23.56,
      "overall": 19.51
    }
  },
  {
    "id": "ef-006",
    "input": {
      "coverage65Plus": 0.41,
      "eivUptakeShare": 0.45,
      "winterBurdenIndex": 0.46,
      "hospitalPressure": 0.42,
      "policyStickiness": 0.4,
      "nordicParity": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "programBias": "balanced",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 48.73,
      "eivScore": 45.97,
      "winterScore": 57.95,
      "hospitalScore": 41.63,
      "policyPenalty": 28.22,
      "confidence": 26.4,
      "expandedContribution": 54.32,
      "baselineContribution": 41.18,
      "overall": 55.95
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 15.44,
      "eivScore": 31.22,
      "winterScore": 21.87,
      "hospitalScore": 43.82,
      "policyPenalty": 29.02,
      "confidence": 22.9,
      "expandedContribution": 36.67,
      "baselineContribution": 34.35,
      "overall": 29.64
    }
  },
  {
    "id": "ef-007",
    "input": {
      "coverage65Plus": 0.45,
      "eivUptakeShare": 0.49,
      "winterBurdenIndex": 0.47,
      "hospitalPressure": 0.43,
      "policyStickiness": 0.42,
      "nordicParity": 0.48,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "programBias": "coverage_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 58.08,
      "eivScore": 35.85,
      "winterScore": 76.38,
      "hospitalScore": 42.49,
      "policyPenalty": 28.7,
      "confidence": 29.4,
      "expandedContribution": 58.63,
      "baselineContribution": 43.31,
      "overall": 59.87
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 15.61,
      "eivScore": 40.46,
      "winterScore": 23.89,
      "hospitalScore": 54.45,
      "policyPenalty": 28.03,
      "confidence": 25.39,
      "expandedContribution": 41.28,
      "baselineContribution": 42.85,
      "overall": 36.98
    }
  },
  {
    "id": "ef-008",
    "input": {
      "coverage65Plus": 0.41,
      "eivUptakeShare": 0.45,
      "winterBurdenIndex": 0.47,
      "hospitalPressure": 0.44,
      "policyStickiness": 0.43,
      "nordicParity": 0.44,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "programBias": "baseline_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 18.37,
      "eivScore": 25.5,
      "winterScore": 33.12,
      "hospitalScore": 40.26,
      "policyPenalty": 30.39,
      "confidence": 26,
      "expandedContribution": 33.13,
      "baselineContribution": 29.7,
      "overall": 33.51
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 14.48,
      "eivScore": 38.15,
      "winterScore": 23.3,
      "hospitalScore": 53.32,
      "policyPenalty": 28.15,
      "confidence": 22.24,
      "expandedContribution": 40.22,
      "baselineContribution": 41.5,
      "overall": 35.88
    }
  },
  {
    "id": "ef-009",
    "input": {
      "coverage65Plus": 0.46,
      "eivUptakeShare": 0.49,
      "winterBurdenIndex": 0.42,
      "hospitalPressure": 0.38,
      "policyStickiness": 0.39,
      "nordicParity": 0.48,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "programBias": "balanced",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 53.83,
      "eivScore": 49.68,
      "winterScore": 62.08,
      "hospitalScore": 45.57,
      "policyPenalty": 26.1,
      "confidence": 30.7,
      "expandedContribution": 58.26,
      "baselineContribution": 43.88,
      "overall": 59.67
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 16.92,
      "eivScore": 33.63,
      "winterScore": 21.66,
      "hospitalScore": 46.38,
      "policyPenalty": 28.07,
      "confidence": 26.86,
      "expandedContribution": 38.1,
      "baselineContribution": 36.56,
      "overall": 31.68
    }
  },
  {
    "id": "ef-010",
    "input": {
      "coverage65Plus": 0.5,
      "eivUptakeShare": 0.53,
      "winterBurdenIndex": 0.43,
      "hospitalPressure": 0.39,
      "policyStickiness": 0.4,
      "nordicParity": 0.52,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "programBias": "eiv_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 64.06,
      "eivScore": 64.57,
      "winterScore": 36.36,
      "hospitalScore": 46.54,
      "policyPenalty": 25.87,
      "confidence": 33.7,
      "expandedContribution": 59.37,
      "baselineContribution": 41.16,
      "overall": 60.09
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 5.31,
      "eivScore": 25.34,
      "winterScore": 23.27,
      "hospitalScore": 31.42,
      "policyPenalty": 27.45,
      "confidence": 29.57,
      "expandedContribution": 31.58,
      "baselineContribution": 26.52,
      "overall": 22.11
    }
  },
  {
    "id": "ef-011",
    "input": {
      "coverage65Plus": 0.54,
      "eivUptakeShare": 0.57,
      "winterBurdenIndex": 0.43,
      "hospitalPressure": 0.4,
      "policyStickiness": 0.42,
      "nordicParity": 0.55,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 61.85,
      "eivScore": 56.61,
      "winterScore": 62.48,
      "hospitalScore": 47.4,
      "policyPenalty": 26.27,
      "confidence": 36.7,
      "expandedContribution": 62.67,
      "baselineContribution": 45.74,
      "overall": 63.62
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 18.48,
      "eivScore": 37.68,
      "winterScore": 25.09,
      "hospitalScore": 46.1,
      "policyPenalty": 26.32,
      "confidence": 32.11,
      "expandedContribution": 40.21,
      "baselineContribution": 38.01,
      "overall": 32.67
    }
  },
  {
    "id": "ef-012",
    "input": {
      "coverage65Plus": 0.5,
      "eivUptakeShare": 0.53,
      "winterBurdenIndex": 0.38,
      "hospitalPressure": 0.35,
      "policyStickiness": 0.37,
      "nordicParity": 0.51,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "programBias": "coverage_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 64.33,
      "eivScore": 38.46,
      "winterScore": 87.15,
      "hospitalScore": 48.92,
      "policyPenalty": 23.44,
      "confidence": 34.5,
      "expandedContribution": 64.76,
      "baselineContribution": 47.8,
      "overall": 65.71
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 17.58,
      "eivScore": 43.31,
      "winterScore": 21.03,
      "hospitalScore": 60.69,
      "policyPenalty": 27.67,
      "confidence": 30.4,
      "expandedContribution": 42.99,
      "baselineContribution": 46.93,
      "overall": 40.78
    }
  },
  {
    "id": "ef-013",
    "input": {
      "coverage65Plus": 0.54,
      "eivUptakeShare": 0.57,
      "winterBurdenIndex": 0.38,
      "hospitalPressure": 0.36,
      "policyStickiness": 0.39,
      "nordicParity": 0.55,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "programBias": "baseline_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 26.83,
      "eivScore": 32.81,
      "winterScore": 38.88,
      "hospitalScore": 49.78,
      "policyPenalty": 23.74,
      "confidence": 37.5,
      "expandedContribution": 40.29,
      "baselineContribution": 34.35,
      "overall": 40.22
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 18.46,
      "eivScore": 46.08,
      "winterScore": 22.86,
      "hospitalScore": 60.36,
      "policyPenalty": 26.48,
      "confidence": 33.17,
      "expandedContribution": 44.26,
      "baselineContribution": 47.78,
      "overall": 41.43
    }
  },
  {
    "id": "ef-014",
    "input": {
      "coverage65Plus": 0.58,
      "eivUptakeShare": 0.61,
      "winterBurdenIndex": 0.39,
      "hospitalPressure": 0.36,
      "policyStickiness": 0.4,
      "nordicParity": 0.58,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 66.33,
      "eivScore": 60.08,
      "winterScore": 66.61,
      "hospitalScore": 51.26,
      "policyPenalty": 23.54,
      "confidence": 40.7,
      "expandedContribution": 66.47,
      "baselineContribution": 48.26,
      "overall": 67.19
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 19.76,
      "eivScore": 39.46,
      "winterScore": 24.47,
      "hospitalScore": 48.66,
      "policyPenalty": 25.8,
      "confidence": 35.86,
      "expandedContribution": 41.31,
      "baselineContribution": 39.98,
      "overall": 34.45
    }
  },
  {
    "id": "ef-015",
    "input": {
      "coverage65Plus": 0.62,
      "eivUptakeShare": 0.65,
      "winterBurdenIndex": 0.34,
      "hospitalPressure": 0.31,
      "policyStickiness": 0.36,
      "nordicParity": 0.62,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "programBias": "eiv_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 78.82,
      "eivScore": 77.55,
      "winterScore": 41.99,
      "hospitalScore": 55.86,
      "policyPenalty": 19.32,
      "confidence": 44.9,
      "expandedContribution": 69.96,
      "baselineContribution": 47.13,
      "overall": 69.85
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 8.86,
      "eivScore": 28.3,
      "winterScore": 22.82,
      "hospitalScore": 34.99,
      "policyPenalty": 25.84,
      "confidence": 40.07,
      "expandedContribution": 33.83,
      "baselineContribution": 29.64,
      "overall": 24.8
    }
  },
  {
    "id": "ef-016",
    "input": {
      "coverage65Plus": 0.58,
      "eivUptakeShare": 0.6,
      "winterBurdenIndex": 0.34,
      "hospitalPressure": 0.32,
      "policyStickiness": 0.37,
      "nordicParity": 0.58,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 66.71,
      "eivScore": 59.46,
      "winterScore": 70.62,
      "hospitalScore": 53.43,
      "policyPenalty": 21.16,
      "confidence": 41,
      "expandedContribution": 67.8,
      "baselineContribution": 49.59,
      "overall": 68.52
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 20.42,
      "eivScore": 39.28,
      "winterScore": 21.98,
      "hospitalScore": 50.72,
      "policyPenalty": 26.01,
      "confidence": 36.61,
      "expandedContribution": 41.28,
      "baselineContribution": 40.85,
      "overall": 35.42
    }
  },
  {
    "id": "ef-017",
    "input": {
      "coverage65Plus": 0.62,
      "eivUptakeShare": 0.64,
      "winterBurdenIndex": 0.35,
      "hospitalPressure": 0.33,
      "policyStickiness": 0.39,
      "nordicParity": 0.62,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "programBias": "coverage_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 78.4,
      "eivScore": 45.18,
      "winterScore": 93.51,
      "hospitalScore": 54.29,
      "policyPenalty": 21.54,
      "confidence": 44,
      "expandedContribution": 72.74,
      "baselineContribution": 51.79,
      "overall": 72.97
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 20.8,
      "eivScore": 51.22,
      "winterScore": 24.01,
      "hospitalScore": 63.24,
      "policyPenalty": 24.96,
      "confidence": 39.32,
      "expandedContribution": 46.86,
      "baselineContribution": 51.06,
      "overall": 44.32
    }
  },
  {
    "id": "ef-018",
    "input": {
      "coverage65Plus": 0.66,
      "eivUptakeShare": 0.68,
      "winterBurdenIndex": 0.3,
      "hospitalPressure": 0.27,
      "policyStickiness": 0.34,
      "nordicParity": 0.65,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "programBias": "baseline_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 34.72,
      "eivScore": 39.54,
      "winterScore": 44.4,
      "hospitalScore": 59.51,
      "policyPenalty": 16.74,
      "confidence": 48.4,
      "expandedContribution": 47.13,
      "baselineContribution": 38.88,
      "overall": 46.65
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 22.32,
      "eivScore": 53.2,
      "winterScore": 21.95,
      "hospitalScore": 68.02,
      "policyPenalty": 25.37,
      "confidence": 43.51,
      "expandedContribution": 48.02,
      "baselineContribution": 54.1,
      "overall": 47.06
    }
  },
  {
    "id": "ef-019",
    "input": {
      "coverage65Plus": 0.7,
      "eivUptakeShare": 0.72,
      "winterBurdenIndex": 0.3,
      "hospitalPressure": 0.28,
      "policyStickiness": 0.36,
      "nordicParity": 0.69,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 79.71,
      "eivScore": 69.85,
      "winterScore": 76.54,
      "hospitalScore": 60.37,
      "policyPenalty": 17.04,
      "confidence": 51.4,
      "expandedContribution": 76.77,
      "baselineContribution": 54.52,
      "overall": 76.76
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 23.7,
      "eivScore": 44.86,
      "winterScore": 23.77,
      "hospitalScore": 54.08,
      "policyPenalty": 24.18,
      "confidence": 46.27,
      "expandedContribution": 44.45,
      "baselineContribution": 44.69,
      "overall": 38.64
    }
  },
  {
    "id": "ef-020",
    "input": {
      "coverage65Plus": 0.66,
      "eivUptakeShare": 0.68,
      "winterBurdenIndex": 0.31,
      "hospitalPressure": 0.29,
      "policyStickiness": 0.37,
      "nordicParity": 0.65,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "programBias": "eiv_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 83.38,
      "eivScore": 81.05,
      "winterScore": 43.69,
      "hospitalScore": 58.14,
      "policyPenalty": 18.81,
      "confidence": 48,
      "expandedContribution": 72.81,
      "baselineContribution": 48.92,
      "overall": 72.51
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 10.08,
      "eivScore": 29.68,
      "winterScore": 23.38,
      "hospitalScore": 35.89,
      "policyPenalty": 24.44,
      "confidence": 43.06,
      "expandedContribution": 34.92,
      "baselineContribution": 30.75,
      "overall": 25.85
    }
  },
  {
    "id": "ef-021",
    "input": {
      "coverage65Plus": 0.7,
      "eivUptakeShare": 0.72,
      "winterBurdenIndex": 0.25,
      "hospitalPressure": 0.24,
      "policyStickiness": 0.33,
      "nordicParity": 0.68,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "programBias": "balanced",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 79.97,
      "eivScore": 69.85,
      "winterScore": 80.34,
      "hospitalScore": 62.74,
      "policyPenalty": 14.61,
      "confidence": 52.2,
      "expandedContribution": 78.2,
      "baselineContribution": 55.94,
      "overall": 78.19
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 23.97,
      "eivScore": 44.69,
      "winterScore": 21.54,
      "hospitalScore": 56.24,
      "policyPenalty": 24.4,
      "confidence": 47.1,
      "expandedContribution": 44.41,
      "baselineContribution": 45.66,
      "overall": 39.62
    }
  },
  {
    "id": "ef-022",
    "input": {
      "coverage65Plus": 0.74,
      "eivUptakeShare": 0.76,
      "winterBurdenIndex": 0.26,
      "hospitalPressure": 0.25,
      "policyStickiness": 0.34,
      "nordicParity": 0.72,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "programBias": "coverage_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 93.15,
      "eivScore": 52.25,
      "winterScore": 100,
      "hospitalScore": 63.72,
      "policyPenalty": 14.38,
      "confidence": 55.2,
      "expandedContribution": 81.99,
      "baselineContribution": 56.44,
      "overall": 81.39
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 24.36,
      "eivScore": 58.35,
      "winterScore": 23.15,
      "hospitalScore": 70.28,
      "policyPenalty": 23.78,
      "confidence": 49.82,
      "expandedContribution": 50.47,
      "baselineContribution": 57.06,
      "overall": 49.55
    }
  },
  {
    "id": "ef-023",
    "input": {
      "coverage65Plus": 0.79,
      "eivUptakeShare": 0.8,
      "winterBurdenIndex": 0.27,
      "hospitalPressure": 0.25,
      "policyStickiness": 0.36,
      "nordicParity": 0.76,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "programBias": "baseline_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 42.59,
      "eivScore": 46.85,
      "winterScore": 47.09,
      "hospitalScore": 65.28,
      "policyPenalty": 14.69,
      "confidence": 58.7,
      "expandedContribution": 52.55,
      "baselineContribution": 42.14,
      "overall": 51.68
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 25.58,
      "eivScore": 61.73,
      "winterScore": 25.17,
      "hospitalScore": 70.68,
      "policyPenalty": 22.61,
      "confidence": 52.94,
      "expandedContribution": 52.11,
      "baselineContribution": 58.49,
      "overall": 50.79
    }
  },
  {
    "id": "ef-024",
    "input": {
      "coverage65Plus": 0.75,
      "eivUptakeShare": 0.76,
      "winterBurdenIndex": 0.21,
      "hospitalPressure": 0.2,
      "policyStickiness": 0.31,
      "nordicParity": 0.72,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "programBias": "balanced",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 85.35,
      "eivScore": 73.57,
      "winterScore": 84.69,
      "hospitalScore": 66.8,
      "policyPenalty": 11.78,
      "confidence": 56.5,
      "expandedContribution": 82.41,
      "baselineContribution": 58.63,
      "overall": 82.13
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 25.67,
      "eivScore": 46.92,
      "winterScore": 20.92,
      "hospitalScore": 58.8,
      "policyPenalty": 23.83,
      "confidence": 51.29,
      "expandedContribution": 45.7,
      "baselineContribution": 47.74,
      "overall": 41.53
    }
  },
  {
    "id": "ef-025",
    "input": {
      "coverage65Plus": 0.79,
      "eivUptakeShare": 0.8,
      "winterBurdenIndex": 0.22,
      "hospitalPressure": 0.21,
      "policyStickiness": 0.33,
      "nordicParity": 0.75,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "programBias": "eiv_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 98.82,
      "eivScore": 94.28,
      "winterScore": 49.32,
      "hospitalScore": 67.66,
      "policyPenalty": 12.26,
      "confidence": 59.5,
      "expandedContribution": 83.67,
      "baselineContribution": 55.02,
      "overall": 82.51
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 13.84,
      "eivScore": 32.88,
      "winterScore": 22.94,
      "hospitalScore": 39.46,
      "policyPenalty": 22.83,
      "confidence": 53.78,
      "expandedContribution": 37.26,
      "baselineContribution": 33.94,
      "overall": 28.61
    }
  },
  {
    "id": "ef-026",
    "input": {
      "coverage65Plus": 0.83,
      "eivUptakeShare": 0.83,
      "winterBurdenIndex": 0.23,
      "hospitalPressure": 0.22,
      "policyStickiness": 0.34,
      "nordicParity": 0.79,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 93.16,
      "eivScore": 79.88,
      "winterScore": 84.53,
      "hospitalScore": 68.43,
      "policyPenalty": 12.18,
      "confidence": 62,
      "expandedContribution": 86.41,
      "baselineContribution": 60.24,
      "overall": 85.7
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 27.41,
      "eivScore": 50.92,
      "winterScore": 24.3,
      "hospitalScore": 58.42,
      "policyPenalty": 22.26,
      "confidence": 56.19,
      "expandedContribution": 47.76,
      "baselineContribution": 49.09,
      "overall": 42.5
    }
  },
  {
    "id": "ef-027",
    "input": {
      "coverage65Plus": 0.87,
      "eivUptakeShare": 0.87,
      "winterBurdenIndex": 0.17,
      "hospitalPressure": 0.17,
      "policyStickiness": 0.3,
      "nordicParity": 0.83,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "programBias": "coverage_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 100,
      "eivScore": 59.23,
      "winterScore": 100,
      "hospitalScore": 73.03,
      "policyPenalty": 7.88,
      "confidence": 66.2,
      "expandedContribution": 87.17,
      "baselineContribution": 59.59,
      "overall": 86.21
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 28.52,
      "eivScore": 66.28,
      "winterScore": 22.46,
      "hospitalScore": 77.21,
      "policyPenalty": 22.16,
      "confidence": 60.45,
      "expandedContribution": 54.46,
      "baselineContribution": 63.23,
      "overall": 55.06
    }
  },
  {
    "id": "ef-028",
    "input": {
      "coverage65Plus": 0.83,
      "eivUptakeShare": 0.83,
      "winterBurdenIndex": 0.18,
      "hospitalPressure": 0.17,
      "policyStickiness": 0.31,
      "nordicParity": 0.79,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "programBias": "baseline_first",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 45.62,
      "eivScore": 48.87,
      "winterScore": 51.85,
      "hospitalScore": 71.31,
      "policyPenalty": 9.58,
      "confidence": 63,
      "expandedContribution": 56.09,
      "baselineContribution": 44.94,
      "overall": 55.08
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 27.51,
      "eivScore": 63.96,
      "winterScore": 22.07,
      "hospitalScore": 76.81,
      "policyPenalty": 22.31,
      "confidence": 57.44,
      "expandedContribution": 53.61,
      "baselineContribution": 62.32,
      "overall": 54.4
    }
  },
  {
    "id": "ef-029",
    "input": {
      "coverage65Plus": 0.87,
      "eivUptakeShare": 0.87,
      "winterBurdenIndex": 0.18,
      "hospitalPressure": 0.18,
      "policyStickiness": 0.33,
      "nordicParity": 0.82,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "programBias": "balanced",
      "profile": "expanded_eiv_program"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 97.68,
      "eivScore": 83.34,
      "winterScore": 89.22,
      "hospitalScore": 72.17,
      "policyPenalty": 9.98,
      "confidence": 66,
      "expandedContribution": 90.26,
      "baselineContribution": 62.94,
      "overall": 89.34
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 28.68,
      "eivScore": 52.92,
      "winterScore": 23.89,
      "hospitalScore": 60.98,
      "policyPenalty": 21.17,
      "confidence": 59.98,
      "expandedContribution": 49.06,
      "baselineContribution": 51.19,
      "overall": 44.42
    }
  },
  {
    "id": "ef-030",
    "input": {
      "coverage65Plus": 0.91,
      "eivUptakeShare": 0.91,
      "winterBurdenIndex": 0.13,
      "hospitalPressure": 0.13,
      "policyStickiness": 0.28,
      "nordicParity": 0.86,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "programBias": "eiv_first",
      "profile": "current_policy_baseline"
    },
    "expectedExpanded": {
      "mode": "expanded_eiv_program",
      "coverageScore": 100,
      "eivScore": 100,
      "winterScore": 55.07,
      "hospitalScore": 76.89,
      "policyPenalty": 5.15,
      "confidence": 70.2,
      "expandedContribution": 88.29,
      "baselineContribution": 59.17,
      "overall": 87.05
    },
    "expectedBaseline": {
      "mode": "current_policy_baseline",
      "coverageScore": 17.79,
      "eivScore": 35.66,
      "winterScore": 21.84,
      "hospitalScore": 42.94,
      "policyPenalty": 21.64,
      "confidence": 64.19,
      "expandedContribution": 39.32,
      "baselineContribution": 36.84,
      "overall": 31.15
    }
  }
];
