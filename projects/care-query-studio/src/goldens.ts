import type { CareQueryInput, CareQueryQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareQueryInput;
  expectedLlm: CareQueryQuality;
  expectedClinician: CareQueryQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cq-001",
    "input": {
      "languageCoverage": 0.29,
      "clinicalFidelity": 0.25,
      "localeGrounding": 0.28,
      "answerCompleteness": 0.34,
      "clinicianConfidence": 0.39,
      "baselineOptimism": 0.45,
      "queryHardness": 0.59,
      "overclaimRisk": 0.5,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 23.37,
      "fidelityScore": 30.25,
      "localeScore": 23.45,
      "completenessScore": 37.64,
      "clinicianScore": 16.4,
      "confidence": 20.85,
      "llmContribution": 28.18,
      "clinicianContribution": 15.92,
      "overall": 29.97
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 5.76,
      "fidelityScore": 17.05,
      "localeScore": 12.78,
      "completenessScore": 32.39,
      "clinicianScore": 40.93,
      "confidence": 17.1,
      "llmContribution": 21.78,
      "clinicianContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "cq-002",
    "input": {
      "languageCoverage": 0.33,
      "clinicalFidelity": 0.29,
      "localeGrounding": 0.32,
      "answerCompleteness": 0.38,
      "clinicianConfidence": 0.43,
      "baselineOptimism": 0.46,
      "queryHardness": 0.6,
      "overclaimRisk": 0.51,
      "queryBias": "locale_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 22.88,
      "fidelityScore": 33.9,
      "localeScore": 34.35,
      "completenessScore": 31.9,
      "clinicianScore": 18.89,
      "confidence": 24.5,
      "llmContribution": 30.72,
      "clinicianContribution": 18.58,
      "overall": 32.53
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 2.43,
      "fidelityScore": 18.17,
      "localeScore": 13.81,
      "completenessScore": 34.08,
      "clinicianScore": 31.53,
      "confidence": 18.65,
      "llmContribution": 20,
      "clinicianContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "cq-003",
    "input": {
      "languageCoverage": 0.37,
      "clinicalFidelity": 0.27,
      "localeGrounding": 0.36,
      "answerCompleteness": 0.42,
      "clinicianConfidence": 0.46,
      "baselineOptimism": 0.42,
      "queryHardness": 0.6,
      "overclaimRisk": 0.46,
      "queryBias": "clinician_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 14.21,
      "fidelityScore": 23.71,
      "localeScore": 20.92,
      "completenessScore": 19.24,
      "clinicianScore": 19.94,
      "confidence": 27.1,
      "llmContribution": 19.48,
      "clinicianContribution": 19.65,
      "overall": 20.51
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 12.17,
      "fidelityScore": 17.05,
      "localeScore": 12.78,
      "completenessScore": 33.93,
      "clinicianScore": 54.34,
      "confidence": 18.4,
      "llmContribution": 26.05,
      "clinicianContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "cq-004",
    "input": {
      "languageCoverage": 0.33,
      "clinicalFidelity": 0.32,
      "localeGrounding": 0.39,
      "answerCompleteness": 0.38,
      "clinicianConfidence": 0.42,
      "baselineOptimism": 0.43,
      "queryHardness": 0.53,
      "overclaimRisk": 0.46,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 30.23,
      "fidelityScore": 36.03,
      "localeScore": 33.26,
      "completenessScore": 42.23,
      "clinicianScore": 18.93,
      "confidence": 25.85,
      "llmContribution": 35.11,
      "clinicianContribution": 19.24,
      "overall": 36.25
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 8.7,
      "fidelityScore": 18.05,
      "localeScore": 14.08,
      "completenessScore": 32.79,
      "clinicianScore": 42.77,
      "confidence": 18.85,
      "llmContribution": 23.28,
      "clinicianContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "cq-005",
    "input": {
      "languageCoverage": 0.37,
      "clinicalFidelity": 0.36,
      "localeGrounding": 0.35,
      "answerCompleteness": 0.42,
      "clinicianConfidence": 0.46,
      "baselineOptimism": 0.45,
      "queryHardness": 0.53,
      "overclaimRisk": 0.47,
      "queryBias": "llm_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 26.59,
      "fidelityScore": 39.64,
      "localeScore": 21.33,
      "completenessScore": 54.3,
      "clinicianScore": 21.8,
      "confidence": 29.35,
      "llmContribution": 34.35,
      "clinicianContribution": 22.12,
      "overall": 36.15
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 0,
      "fidelityScore": 19.43,
      "localeScore": 15.31,
      "completenessScore": 34.77,
      "clinicianScore": 32.95,
      "confidence": 21.05,
      "llmContribution": 20.49,
      "clinicianContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "cq-006",
    "input": {
      "languageCoverage": 0.41,
      "clinicalFidelity": 0.34,
      "localeGrounding": 0.39,
      "answerCompleteness": 0.45,
      "clinicianConfidence": 0.5,
      "baselineOptimism": 0.4,
      "queryHardness": 0.54,
      "overclaimRisk": 0.42,
      "queryBias": "balanced",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 35.28,
      "fidelityScore": 39.5,
      "localeScore": 35.78,
      "completenessScore": 47.85,
      "clinicianScore": 23.08,
      "confidence": 31.85,
      "llmContribution": 39.2,
      "clinicianContribution": 23.32,
      "overall": 40.34
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 11.98,
      "fidelityScore": 17.95,
      "localeScore": 13.91,
      "completenessScore": 34.78,
      "clinicianScore": 46.72,
      "confidence": 20.5,
      "llmContribution": 25.07,
      "clinicianContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "cq-007",
    "input": {
      "languageCoverage": 0.45,
      "clinicalFidelity": 0.38,
      "localeGrounding": 0.42,
      "answerCompleteness": 0.49,
      "clinicianConfidence": 0.53,
      "baselineOptimism": 0.42,
      "queryHardness": 0.55,
      "overclaimRisk": 0.43,
      "queryBias": "locale_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 32.43,
      "fidelityScore": 43.11,
      "localeScore": 48.27,
      "completenessScore": 39.34,
      "clinicianScore": 25.15,
      "confidence": 35.35,
      "llmContribution": 40.95,
      "clinicianContribution": 25.54,
      "overall": 42.18
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 8.27,
      "fidelityScore": 19.21,
      "localeScore": 15.09,
      "completenessScore": 36.3,
      "clinicianScore": 34.2,
      "confidence": 22.15,
      "llmContribution": 22.61,
      "clinicianContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "cq-008",
    "input": {
      "languageCoverage": 0.41,
      "clinicalFidelity": 0.43,
      "localeGrounding": 0.46,
      "answerCompleteness": 0.45,
      "clinicianConfidence": 0.49,
      "baselineOptimism": 0.43,
      "queryHardness": 0.47,
      "overclaimRisk": 0.44,
      "queryBias": "clinician_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 20.12,
      "fidelityScore": 35.43,
      "localeScore": 27.76,
      "completenessScore": 24.76,
      "clinicianScore": 24.32,
      "confidence": 34.1,
      "llmContribution": 26.95,
      "clinicianContribution": 25.37,
      "overall": 27.67
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 16.4,
      "fidelityScore": 20.36,
      "localeScore": 16.57,
      "completenessScore": 35.17,
      "clinicianScore": 58.5,
      "confidence": 22.7,
      "llmContribution": 29.4,
      "clinicianContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "cq-009",
    "input": {
      "languageCoverage": 0.46,
      "clinicalFidelity": 0.41,
      "localeGrounding": 0.5,
      "answerCompleteness": 0.49,
      "clinicianConfidence": 0.53,
      "baselineOptimism": 0.39,
      "queryHardness": 0.48,
      "overclaimRisk": 0.38,
      "queryBias": "balanced",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 42.68,
      "fidelityScore": 45.49,
      "localeScore": 45.8,
      "completenessScore": 52.59,
      "clinicianScore": 25.81,
      "confidence": 37.1,
      "llmContribution": 46.41,
      "clinicianContribution": 26.81,
      "overall": 46.88
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 14.91,
      "fidelityScore": 19.22,
      "localeScore": 15.52,
      "completenessScore": 35.36,
      "clinicianScore": 48.88,
      "confidence": 22.7,
      "llmContribution": 26.78,
      "clinicianContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "cq-010",
    "input": {
      "languageCoverage": 0.5,
      "clinicalFidelity": 0.45,
      "localeGrounding": 0.46,
      "answerCompleteness": 0.53,
      "clinicianConfidence": 0.57,
      "baselineOptimism": 0.4,
      "queryHardness": 0.49,
      "overclaimRisk": 0.39,
      "queryBias": "llm_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 36.76,
      "fidelityScore": 49.14,
      "localeScore": 30.54,
      "completenessScore": 66.82,
      "clinicianScore": 28.29,
      "confidence": 40.75,
      "llmContribution": 44.6,
      "clinicianContribution": 29.21,
      "overall": 45.83
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 3.59,
      "fidelityScore": 20.03,
      "localeScore": 16.17,
      "completenessScore": 37.06,
      "clinicianScore": 35.54,
      "confidence": 24.25,
      "llmContribution": 22.48,
      "clinicianContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "cq-011",
    "input": {
      "languageCoverage": 0.54,
      "clinicalFidelity": 0.49,
      "localeGrounding": 0.49,
      "answerCompleteness": 0.57,
      "clinicianConfidence": 0.6,
      "baselineOptimism": 0.42,
      "queryHardness": 0.49,
      "overclaimRisk": 0.4,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 47.07,
      "fidelityScore": 52.75,
      "localeScore": 47.04,
      "completenessScore": 60.27,
      "clinicianScore": 30.54,
      "confidence": 44.25,
      "llmContribution": 51.33,
      "clinicianContribution": 31.67,
      "overall": 51.79
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 17.1,
      "fidelityScore": 21.44,
      "localeScore": 17.52,
      "completenessScore": 38.58,
      "clinicianScore": 54.12,
      "confidence": 26.1,
      "llmContribution": 29.75,
      "clinicianContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "cq-012",
    "input": {
      "languageCoverage": 0.5,
      "clinicalFidelity": 0.48,
      "localeGrounding": 0.53,
      "answerCompleteness": 0.53,
      "clinicianConfidence": 0.56,
      "baselineOptimism": 0.37,
      "queryHardness": 0.42,
      "overclaimRisk": 0.35,
      "queryBias": "locale_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 39.39,
      "fidelityScore": 51.28,
      "localeScore": 62.01,
      "completenessScore": 43.82,
      "clinicianScore": 28.34,
      "confidence": 42.1,
      "llmContribution": 49.55,
      "clinicianContribution": 29.77,
      "overall": 49.99
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 13.23,
      "fidelityScore": 19.78,
      "localeScore": 16.29,
      "completenessScore": 35.76,
      "clinicianScore": 34.93,
      "confidence": 24.35,
      "llmContribution": 24,
      "clinicianContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "cq-013",
    "input": {
      "languageCoverage": 0.54,
      "clinicalFidelity": 0.52,
      "localeGrounding": 0.56,
      "answerCompleteness": 0.57,
      "clinicianConfidence": 0.6,
      "baselineOptimism": 0.39,
      "queryHardness": 0.42,
      "overclaimRisk": 0.36,
      "queryBias": "clinician_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 30.08,
      "fidelityScore": 44.88,
      "localeScore": 36.64,
      "completenessScore": 32.66,
      "clinicianScore": 31.2,
      "confidence": 45.6,
      "llmContribution": 36.04,
      "clinicianContribution": 32.85,
      "overall": 36.47
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 22.62,
      "fidelityScore": 21.42,
      "localeScore": 17.82,
      "completenessScore": 37.74,
      "clinicianScore": 67.02,
      "confidence": 26.55,
      "llmContribution": 33.32,
      "clinicianContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "cq-014",
    "input": {
      "languageCoverage": 0.58,
      "clinicalFidelity": 0.56,
      "localeGrounding": 0.6,
      "answerCompleteness": 0.61,
      "clinicianConfidence": 0.63,
      "baselineOptimism": 0.4,
      "queryHardness": 0.43,
      "overclaimRisk": 0.36,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 53.79,
      "fidelityScore": 58.53,
      "localeScore": 56.71,
      "completenessScore": 64.86,
      "clinicianScore": 33.07,
      "confidence": 49.25,
      "llmContribution": 58.18,
      "clinicianContribution": 34.85,
      "overall": 57.98
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 20.03,
      "fidelityScore": 22.26,
      "localeScore": 18.61,
      "completenessScore": 38.98,
      "clinicianScore": 55.96,
      "confidence": 27.85,
      "llmContribution": 31.17,
      "clinicianContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "cq-015",
    "input": {
      "languageCoverage": 0.62,
      "clinicalFidelity": 0.54,
      "localeGrounding": 0.56,
      "answerCompleteness": 0.65,
      "clinicianConfidence": 0.67,
      "baselineOptimism": 0.36,
      "queryHardness": 0.44,
      "overclaimRisk": 0.31,
      "queryBias": "llm_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 46.23,
      "fidelityScore": 58.35,
      "localeScore": 39.15,
      "completenessScore": 79.94,
      "clinicianScore": 34.55,
      "confidence": 51.85,
      "llmContribution": 54.57,
      "clinicianContribution": 36.06,
      "overall": 55.24
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 9.43,
      "fidelityScore": 20.94,
      "localeScore": 17.24,
      "completenessScore": 39.27,
      "clinicianScore": 38.2,
      "confidence": 27.75,
      "llmContribution": 25.02,
      "clinicianContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "cq-016",
    "input": {
      "languageCoverage": 0.58,
      "clinicalFidelity": 0.59,
      "localeGrounding": 0.6,
      "answerCompleteness": 0.6,
      "clinicianConfidence": 0.63,
      "baselineOptimism": 0.37,
      "queryHardness": 0.36,
      "overclaimRisk": 0.32,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 54.78,
      "fidelityScore": 60.67,
      "localeScore": 57.91,
      "completenessScore": 65.05,
      "clinicianScore": 33.73,
      "confidence": 50.35,
      "llmContribution": 59.33,
      "clinicianContribution": 35.81,
      "overall": 59.1
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 22.05,
      "fidelityScore": 21.96,
      "localeScore": 18.63,
      "completenessScore": 38.14,
      "clinicianScore": 55.7,
      "confidence": 28.3,
      "llmContribution": 31.3,
      "clinicianContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "cq-017",
    "input": {
      "languageCoverage": 0.62,
      "clinicalFidelity": 0.63,
      "localeGrounding": 0.63,
      "answerCompleteness": 0.64,
      "clinicianConfidence": 0.67,
      "baselineOptimism": 0.39,
      "queryHardness": 0.37,
      "overclaimRisk": 0.33,
      "queryBias": "locale_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 48.45,
      "fidelityScore": 64.28,
      "localeScore": 75.16,
      "completenessScore": 52.76,
      "clinicianScore": 36.41,
      "confidence": 53.85,
      "llmContribution": 60.68,
      "clinicianContribution": 38.64,
      "overall": 60.71
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 18.73,
      "fidelityScore": 23.45,
      "localeScore": 19.98,
      "completenessScore": 40.11,
      "clinicianScore": 39.86,
      "confidence": 30.3,
      "llmContribution": 28.43,
      "clinicianContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "cq-018",
    "input": {
      "languageCoverage": 0.66,
      "clinicalFidelity": 0.61,
      "localeGrounding": 0.67,
      "answerCompleteness": 0.68,
      "clinicianConfidence": 0.7,
      "baselineOptimism": 0.34,
      "queryHardness": 0.38,
      "overclaimRisk": 0.27,
      "queryBias": "clinician_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 39.72,
      "fidelityScore": 54.13,
      "localeScore": 45.55,
      "completenessScore": 40.09,
      "clinicianScore": 37.08,
      "confidence": 56.6,
      "llmContribution": 44.89,
      "clinicianContribution": 39.18,
      "overall": 44.86
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 28.36,
      "fidelityScore": 21.69,
      "localeScore": 18.3,
      "completenessScore": 39.67,
      "clinicianScore": 74.27,
      "confidence": 29.5,
      "llmContribution": 36.46,
      "clinicianContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "cq-019",
    "input": {
      "languageCoverage": 0.7,
      "clinicalFidelity": 0.65,
      "localeGrounding": 0.7,
      "answerCompleteness": 0.72,
      "clinicianConfidence": 0.74,
      "baselineOptimism": 0.36,
      "queryHardness": 0.38,
      "overclaimRisk": 0.28,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 65.21,
      "fidelityScore": 67.74,
      "localeScore": 68.17,
      "completenessScore": 75.07,
      "clinicianScore": 39.94,
      "confidence": 60.1,
      "llmContribution": 68.82,
      "clinicianContribution": 42.25,
      "overall": 68.04
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 26.25,
      "fidelityScore": 23.32,
      "localeScore": 19.82,
      "completenessScore": 41.65,
      "clinicianScore": 62.07,
      "confidence": 31.7,
      "llmContribution": 34.62,
      "clinicianContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "cq-020",
    "input": {
      "languageCoverage": 0.66,
      "clinicalFidelity": 0.7,
      "localeGrounding": 0.66,
      "answerCompleteness": 0.68,
      "clinicianConfidence": 0.7,
      "baselineOptimism": 0.37,
      "queryHardness": 0.31,
      "overclaimRisk": 0.29,
      "queryBias": "llm_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 51.95,
      "fidelityScore": 70.06,
      "localeScore": 45.74,
      "completenessScore": 86.81,
      "clinicianScore": 38.94,
      "confidence": 58.85,
      "llmContribution": 62.23,
      "clinicianContribution": 41.54,
      "overall": 62.51
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 13.66,
      "fidelityScore": 23.93,
      "localeScore": 20.65,
      "completenessScore": 40.51,
      "clinicianScore": 40.86,
      "confidence": 32.05,
      "llmContribution": 27.92,
      "clinicianContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "cq-021",
    "input": {
      "languageCoverage": 0.7,
      "clinicalFidelity": 0.68,
      "localeGrounding": 0.7,
      "answerCompleteness": 0.72,
      "clinicianConfidence": 0.73,
      "baselineOptimism": 0.33,
      "queryHardness": 0.31,
      "overclaimRisk": 0.24,
      "queryBias": "balanced",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 66.16,
      "fidelityScore": 69.88,
      "localeScore": 69.32,
      "completenessScore": 75.82,
      "clinicianScore": 39.99,
      "confidence": 61.45,
      "llmContribution": 70.06,
      "clinicianContribution": 42.54,
      "overall": 69.11
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 27.89,
      "fidelityScore": 22.72,
      "localeScore": 19.52,
      "completenessScore": 40.35,
      "clinicianScore": 61.19,
      "confidence": 31.8,
      "llmContribution": 34.33,
      "clinicianContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "cq-022",
    "input": {
      "languageCoverage": 0.74,
      "clinicalFidelity": 0.72,
      "localeGrounding": 0.73,
      "answerCompleteness": 0.76,
      "clinicianConfidence": 0.77,
      "baselineOptimism": 0.34,
      "queryHardness": 0.32,
      "overclaimRisk": 0.25,
      "queryBias": "locale_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 57.83,
      "fidelityScore": 73.52,
      "localeScore": 88.84,
      "completenessScore": 60.51,
      "clinicianScore": 42.47,
      "confidence": 65.1,
      "llmContribution": 70.87,
      "clinicianContribution": 45.13,
      "overall": 70.24
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 24.57,
      "fidelityScore": 23.77,
      "localeScore": 20.46,
      "completenessScore": 42.05,
      "clinicianScore": 42.21,
      "confidence": 33.35,
      "llmContribution": 30.61,
      "clinicianContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "cq-023",
    "input": {
      "languageCoverage": 0.79,
      "clinicalFidelity": 0.76,
      "localeGrounding": 0.77,
      "answerCompleteness": 0.8,
      "clinicianConfidence": 0.81,
      "baselineOptimism": 0.36,
      "queryHardness": 0.33,
      "overclaimRisk": 0.25,
      "queryBias": "clinician_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 49.24,
      "fidelityScore": 67.38,
      "localeScore": 53.71,
      "completenessScore": 49.49,
      "clinicianScore": 45.16,
      "confidence": 69,
      "llmContribution": 54.9,
      "clinicianContribution": 47.99,
      "overall": 54.66
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 33.86,
      "fidelityScore": 25.2,
      "localeScore": 21.84,
      "completenessScore": 43.92,
      "clinicianScore": 84.72,
      "confidence": 35.45,
      "llmContribution": 41.91,
      "clinicianContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "cq-024",
    "input": {
      "languageCoverage": 0.75,
      "clinicalFidelity": 0.75,
      "localeGrounding": 0.81,
      "answerCompleteness": 0.76,
      "clinicianConfidence": 0.77,
      "baselineOptimism": 0.31,
      "queryHardness": 0.25,
      "overclaimRisk": 0.2,
      "queryBias": "balanced",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 73.31,
      "fidelityScore": 75.91,
      "localeScore": 79.08,
      "completenessScore": 80.56,
      "clinicianScore": 43.13,
      "confidence": 66.85,
      "llmContribution": 77.14,
      "clinicianContribution": 46.16,
      "overall": 75.56
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 31.21,
      "fidelityScore": 23.47,
      "localeScore": 20.52,
      "completenessScore": 41.11,
      "clinicianScore": 63.65,
      "confidence": 33.9,
      "llmContribution": 35.99,
      "clinicianContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "cq-025",
    "input": {
      "languageCoverage": 0.79,
      "clinicalFidelity": 0.79,
      "localeGrounding": 0.77,
      "answerCompleteness": 0.8,
      "clinicianConfidence": 0.8,
      "baselineOptimism": 0.33,
      "queryHardness": 0.26,
      "overclaimRisk": 0.21,
      "queryBias": "llm_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 62.03,
      "fidelityScore": 79.52,
      "localeScore": 54.83,
      "completenessScore": 100,
      "clinicianScore": 45.2,
      "confidence": 70.35,
      "llmContribution": 72.57,
      "clinicianContribution": 48.24,
      "overall": 72.19
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 19.5,
      "fidelityScore": 24.56,
      "localeScore": 21.5,
      "completenessScore": 42.63,
      "clinicianScore": 43.52,
      "confidence": 35.55,
      "llmContribution": 30.34,
      "clinicianContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "cq-026",
    "input": {
      "languageCoverage": 0.83,
      "clinicalFidelity": 0.83,
      "localeGrounding": 0.8,
      "answerCompleteness": 0.83,
      "clinicianConfidence": 0.84,
      "baselineOptimism": 0.34,
      "queryHardness": 0.27,
      "overclaimRisk": 0.22,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 77.64,
      "fidelityScore": 83.17,
      "localeScore": 80.25,
      "completenessScore": 87.68,
      "clinicianScore": 47.68,
      "confidence": 73.75,
      "llmContribution": 81.91,
      "clinicianContribution": 50.82,
      "overall": 80.31
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 33.17,
      "fidelityScore": 25.61,
      "localeScore": 22.47,
      "completenessScore": 44.32,
      "clinicianScore": 68.8,
      "confidence": 37.1,
      "llmContribution": 38.87,
      "clinicianContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "cq-027",
    "input": {
      "languageCoverage": 0.87,
      "clinicalFidelity": 0.81,
      "localeGrounding": 0.84,
      "answerCompleteness": 0.87,
      "clinicianConfidence": 0.88,
      "baselineOptimism": 0.3,
      "queryHardness": 0.27,
      "overclaimRisk": 0.17,
      "queryBias": "locale_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 67.91,
      "fidelityScore": 82.98,
      "localeScore": 100,
      "completenessScore": 68.1,
      "clinicianScore": 49.35,
      "confidence": 76.35,
      "llmContribution": 80.55,
      "clinicianContribution": 52.46,
      "overall": 79.49
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 30.78,
      "fidelityScore": 24.64,
      "localeScore": 21.53,
      "completenessScore": 44.62,
      "clinicianScore": 45.22,
      "confidence": 37.2,
      "llmContribution": 33.36,
      "clinicianContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "cq-028",
    "input": {
      "languageCoverage": 0.83,
      "clinicalFidelity": 0.86,
      "localeGrounding": 0.87,
      "answerCompleteness": 0.83,
      "clinicianConfidence": 0.84,
      "baselineOptimism": 0.31,
      "queryHardness": 0.2,
      "overclaimRisk": 0.17,
      "queryBias": "clinician_first",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 55.14,
      "fidelityScore": 75.3,
      "localeScore": 60.67,
      "completenessScore": 53.51,
      "clinicianScore": 48.34,
      "confidence": 75.1,
      "llmContribution": 61.17,
      "clinicianContribution": 51.78,
      "overall": 60.48
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 38.81,
      "fidelityScore": 25.31,
      "localeScore": 22.44,
      "completenessScore": 43.48,
      "clinicianScore": 86.95,
      "confidence": 37.65,
      "llmContribution": 43.4,
      "clinicianContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "cq-029",
    "input": {
      "languageCoverage": 0.87,
      "clinicalFidelity": 0.9,
      "localeGrounding": 0.91,
      "answerCompleteness": 0.87,
      "clinicianConfidence": 0.87,
      "baselineOptimism": 0.33,
      "queryHardness": 0.2,
      "overclaimRisk": 0.18,
      "queryBias": "balanced",
      "profile": "multilingual_poc_llm_answers"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 84.21,
      "fidelityScore": 88.91,
      "localeScore": 89.77,
      "completenessScore": 92.27,
      "clinicianScore": 50.59,
      "confidence": 78.6,
      "llmContribution": 88.67,
      "clinicianContribution": 54.2,
      "overall": 86.47
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 36.33,
      "fidelityScore": 26.66,
      "localeScore": 23.73,
      "completenessScore": 45,
      "clinicianScore": 71.06,
      "confidence": 39.5,
      "llmContribution": 40.56,
      "clinicianContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "cq-030",
    "input": {
      "languageCoverage": 0.91,
      "clinicalFidelity": 0.88,
      "localeGrounding": 0.87,
      "answerCompleteness": 0.91,
      "clinicianConfidence": 0.91,
      "baselineOptimism": 0.28,
      "queryHardness": 0.21,
      "overclaimRisk": 0.13,
      "queryBias": "llm_first",
      "profile": "local_clinician_baseline"
    },
    "expectedLlm": {
      "mode": "multilingual_poc_llm_answers",
      "languageScore": 71.33,
      "fidelityScore": 88.77,
      "localeScore": 63.21,
      "completenessScore": 100,
      "clinicianScore": 51.88,
      "confidence": 81.35,
      "llmContribution": 79.55,
      "clinicianContribution": 55.26,
      "overall": 79.18
    },
    "expectedClinician": {
      "mode": "local_clinician_baseline",
      "languageScore": 25.72,
      "fidelityScore": 25,
      "localeScore": 22.06,
      "completenessScore": 45.02,
      "clinicianScore": 46.21,
      "confidence": 38.95,
      "llmContribution": 32.8,
      "clinicianContribution": 50.65,
      "overall": 44.26
    }
  }
];
