import type { SepsisTherapyInput, SepsisTherapyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SepsisTherapyInput;
  expectedCtHmm: SepsisTherapyQuality;
  expectedGuideline: SepsisTherapyQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "st-001",
    "input": {
      "onsetCoverage": 0.29,
      "regimenFidelity": 0.25,
      "hmmStateClarity": 0.28,
      "packCompleteness": 0.34,
      "guidelineAdherence": 0.39,
      "cultureLagOptimism": 0.45,
      "sepsisHardness": 0.59,
      "overclaimRisk": 0.5,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 23.37,
      "regimenScore": 30.25,
      "hmmScore": 23.45,
      "completenessScore": 37.64,
      "guidelineScore": 16.4,
      "confidence": 20.85,
      "ctHmmContribution": 28.18,
      "guidelineContribution": 15.92,
      "overall": 29.97
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 5.76,
      "regimenScore": 17.05,
      "hmmScore": 12.78,
      "completenessScore": 32.39,
      "guidelineScore": 40.93,
      "confidence": 17.1,
      "ctHmmContribution": 21.78,
      "guidelineContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "st-002",
    "input": {
      "onsetCoverage": 0.33,
      "regimenFidelity": 0.29,
      "hmmStateClarity": 0.32,
      "packCompleteness": 0.38,
      "guidelineAdherence": 0.43,
      "cultureLagOptimism": 0.46,
      "sepsisHardness": 0.6,
      "overclaimRisk": 0.51,
      "therapyBias": "regimen_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 29.47,
      "regimenScore": 33.9,
      "hmmScore": 17.72,
      "completenessScore": 48.93,
      "guidelineScore": 18.89,
      "confidence": 24.5,
      "ctHmmContribution": 31.52,
      "guidelineContribution": 18.58,
      "overall": 33.19
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 2.43,
      "regimenScore": 18.17,
      "hmmScore": 13.81,
      "completenessScore": 34.08,
      "guidelineScore": 31.53,
      "confidence": 18.65,
      "ctHmmContribution": 20,
      "guidelineContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "st-003",
    "input": {
      "onsetCoverage": 0.37,
      "regimenFidelity": 0.27,
      "hmmStateClarity": 0.36,
      "packCompleteness": 0.42,
      "guidelineAdherence": 0.46,
      "cultureLagOptimism": 0.42,
      "sepsisHardness": 0.6,
      "overclaimRisk": 0.46,
      "therapyBias": "guideline_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 8.22,
      "regimenScore": 23.71,
      "hmmScore": 20.92,
      "completenessScore": 19.24,
      "guidelineScore": 19.94,
      "confidence": 27.1,
      "ctHmmContribution": 17.92,
      "guidelineContribution": 19.65,
      "overall": 19.23
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 12.17,
      "regimenScore": 17.05,
      "hmmScore": 12.78,
      "completenessScore": 33.93,
      "guidelineScore": 54.34,
      "confidence": 18.4,
      "ctHmmContribution": 26.05,
      "guidelineContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "st-004",
    "input": {
      "onsetCoverage": 0.33,
      "regimenFidelity": 0.32,
      "hmmStateClarity": 0.39,
      "packCompleteness": 0.38,
      "guidelineAdherence": 0.42,
      "cultureLagOptimism": 0.43,
      "sepsisHardness": 0.53,
      "overclaimRisk": 0.46,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 30.23,
      "regimenScore": 36.03,
      "hmmScore": 33.26,
      "completenessScore": 42.23,
      "guidelineScore": 18.93,
      "confidence": 25.85,
      "ctHmmContribution": 35.11,
      "guidelineContribution": 19.24,
      "overall": 36.25
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 8.7,
      "regimenScore": 18.05,
      "hmmScore": 14.08,
      "completenessScore": 32.79,
      "guidelineScore": 42.77,
      "confidence": 18.85,
      "ctHmmContribution": 23.28,
      "guidelineContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "st-005",
    "input": {
      "onsetCoverage": 0.37,
      "regimenFidelity": 0.36,
      "hmmStateClarity": 0.35,
      "packCompleteness": 0.42,
      "guidelineAdherence": 0.46,
      "cultureLagOptimism": 0.45,
      "sepsisHardness": 0.53,
      "overclaimRisk": 0.47,
      "therapyBias": "hmm_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 34.45,
      "regimenScore": 39.64,
      "hmmScore": 39.52,
      "completenessScore": 35.49,
      "guidelineScore": 21.8,
      "confidence": 29.35,
      "ctHmmContribution": 37.34,
      "guidelineContribution": 22.12,
      "overall": 38.6
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 0,
      "regimenScore": 19.43,
      "hmmScore": 15.31,
      "completenessScore": 34.77,
      "guidelineScore": 32.95,
      "confidence": 21.05,
      "ctHmmContribution": 20.49,
      "guidelineContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "st-006",
    "input": {
      "onsetCoverage": 0.41,
      "regimenFidelity": 0.34,
      "hmmStateClarity": 0.39,
      "packCompleteness": 0.45,
      "guidelineAdherence": 0.5,
      "cultureLagOptimism": 0.4,
      "sepsisHardness": 0.54,
      "overclaimRisk": 0.42,
      "therapyBias": "balanced",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 35.28,
      "regimenScore": 39.5,
      "hmmScore": 35.78,
      "completenessScore": 47.85,
      "guidelineScore": 23.08,
      "confidence": 31.85,
      "ctHmmContribution": 39.2,
      "guidelineContribution": 23.32,
      "overall": 40.34
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 11.98,
      "regimenScore": 17.95,
      "hmmScore": 13.91,
      "completenessScore": 34.78,
      "guidelineScore": 46.72,
      "confidence": 20.5,
      "ctHmmContribution": 25.07,
      "guidelineContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "st-007",
    "input": {
      "onsetCoverage": 0.45,
      "regimenFidelity": 0.38,
      "hmmStateClarity": 0.42,
      "packCompleteness": 0.49,
      "guidelineAdherence": 0.53,
      "cultureLagOptimism": 0.42,
      "sepsisHardness": 0.55,
      "overclaimRisk": 0.43,
      "therapyBias": "regimen_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 42.35,
      "regimenScore": 43.11,
      "hmmScore": 26.44,
      "completenessScore": 61.29,
      "guidelineScore": 25.15,
      "confidence": 35.35,
      "ctHmmContribution": 42.24,
      "guidelineContribution": 25.54,
      "overall": 43.23
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 8.27,
      "regimenScore": 19.21,
      "hmmScore": 15.09,
      "completenessScore": 36.3,
      "guidelineScore": 34.2,
      "confidence": 22.15,
      "ctHmmContribution": 22.61,
      "guidelineContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "st-008",
    "input": {
      "onsetCoverage": 0.41,
      "regimenFidelity": 0.43,
      "hmmStateClarity": 0.46,
      "packCompleteness": 0.45,
      "guidelineAdherence": 0.49,
      "cultureLagOptimism": 0.43,
      "sepsisHardness": 0.47,
      "overclaimRisk": 0.44,
      "therapyBias": "guideline_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 12.47,
      "regimenScore": 35.43,
      "hmmScore": 27.76,
      "completenessScore": 24.76,
      "guidelineScore": 24.32,
      "confidence": 34.1,
      "ctHmmContribution": 24.97,
      "guidelineContribution": 25.37,
      "overall": 26.04
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 16.4,
      "regimenScore": 20.36,
      "hmmScore": 16.57,
      "completenessScore": 35.17,
      "guidelineScore": 58.5,
      "confidence": 22.7,
      "ctHmmContribution": 29.4,
      "guidelineContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "st-009",
    "input": {
      "onsetCoverage": 0.46,
      "regimenFidelity": 0.41,
      "hmmStateClarity": 0.5,
      "packCompleteness": 0.49,
      "guidelineAdherence": 0.53,
      "cultureLagOptimism": 0.39,
      "sepsisHardness": 0.48,
      "overclaimRisk": 0.38,
      "therapyBias": "balanced",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 42.68,
      "regimenScore": 45.49,
      "hmmScore": 45.8,
      "completenessScore": 52.59,
      "guidelineScore": 25.81,
      "confidence": 37.1,
      "ctHmmContribution": 46.41,
      "guidelineContribution": 26.81,
      "overall": 46.88
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 14.91,
      "regimenScore": 19.22,
      "hmmScore": 15.52,
      "completenessScore": 35.36,
      "guidelineScore": 48.88,
      "confidence": 22.7,
      "ctHmmContribution": 26.78,
      "guidelineContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "st-010",
    "input": {
      "onsetCoverage": 0.5,
      "regimenFidelity": 0.45,
      "hmmStateClarity": 0.46,
      "packCompleteness": 0.53,
      "guidelineAdherence": 0.57,
      "cultureLagOptimism": 0.4,
      "sepsisHardness": 0.49,
      "overclaimRisk": 0.39,
      "therapyBias": "hmm_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 48.19,
      "regimenScore": 49.14,
      "hmmScore": 54.44,
      "completenessScore": 43.07,
      "guidelineScore": 28.29,
      "confidence": 40.75,
      "ctHmmContribution": 49.04,
      "guidelineContribution": 29.21,
      "overall": 49.47
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 3.59,
      "regimenScore": 20.03,
      "hmmScore": 16.17,
      "completenessScore": 37.06,
      "guidelineScore": 35.54,
      "confidence": 24.25,
      "ctHmmContribution": 22.48,
      "guidelineContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "st-011",
    "input": {
      "onsetCoverage": 0.54,
      "regimenFidelity": 0.49,
      "hmmStateClarity": 0.49,
      "packCompleteness": 0.57,
      "guidelineAdherence": 0.6,
      "cultureLagOptimism": 0.42,
      "sepsisHardness": 0.49,
      "overclaimRisk": 0.4,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 47.07,
      "regimenScore": 52.75,
      "hmmScore": 47.04,
      "completenessScore": 60.27,
      "guidelineScore": 30.54,
      "confidence": 44.25,
      "ctHmmContribution": 51.33,
      "guidelineContribution": 31.67,
      "overall": 51.79
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 17.1,
      "regimenScore": 21.44,
      "hmmScore": 17.52,
      "completenessScore": 38.58,
      "guidelineScore": 54.12,
      "confidence": 26.1,
      "ctHmmContribution": 29.75,
      "guidelineContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "st-012",
    "input": {
      "onsetCoverage": 0.5,
      "regimenFidelity": 0.48,
      "hmmStateClarity": 0.53,
      "packCompleteness": 0.53,
      "guidelineAdherence": 0.56,
      "cultureLagOptimism": 0.37,
      "sepsisHardness": 0.42,
      "overclaimRisk": 0.35,
      "therapyBias": "regimen_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 51.69,
      "regimenScore": 51.28,
      "hmmScore": 34.47,
      "completenessScore": 67.57,
      "guidelineScore": 28.34,
      "confidence": 42.1,
      "ctHmmContribution": 50.26,
      "guidelineContribution": 29.77,
      "overall": 50.57
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 13.23,
      "regimenScore": 19.78,
      "hmmScore": 16.29,
      "completenessScore": 35.76,
      "guidelineScore": 34.93,
      "confidence": 24.35,
      "ctHmmContribution": 24,
      "guidelineContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "st-013",
    "input": {
      "onsetCoverage": 0.54,
      "regimenFidelity": 0.52,
      "hmmStateClarity": 0.56,
      "packCompleteness": 0.57,
      "guidelineAdherence": 0.6,
      "cultureLagOptimism": 0.39,
      "sepsisHardness": 0.42,
      "overclaimRisk": 0.36,
      "therapyBias": "guideline_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 19.73,
      "regimenScore": 44.88,
      "hmmScore": 36.64,
      "completenessScore": 32.66,
      "guidelineScore": 31.2,
      "confidence": 45.6,
      "ctHmmContribution": 33.35,
      "guidelineContribution": 32.85,
      "overall": 34.26
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 22.62,
      "regimenScore": 21.42,
      "hmmScore": 17.82,
      "completenessScore": 37.74,
      "guidelineScore": 67.02,
      "confidence": 26.55,
      "ctHmmContribution": 33.32,
      "guidelineContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "st-014",
    "input": {
      "onsetCoverage": 0.58,
      "regimenFidelity": 0.56,
      "hmmStateClarity": 0.6,
      "packCompleteness": 0.61,
      "guidelineAdherence": 0.63,
      "cultureLagOptimism": 0.4,
      "sepsisHardness": 0.43,
      "overclaimRisk": 0.36,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 53.79,
      "regimenScore": 58.53,
      "hmmScore": 56.71,
      "completenessScore": 64.86,
      "guidelineScore": 33.07,
      "confidence": 49.25,
      "ctHmmContribution": 58.18,
      "guidelineContribution": 34.85,
      "overall": 57.98
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 20.03,
      "regimenScore": 22.26,
      "hmmScore": 18.61,
      "completenessScore": 38.98,
      "guidelineScore": 55.96,
      "confidence": 27.85,
      "ctHmmContribution": 31.17,
      "guidelineContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "st-015",
    "input": {
      "onsetCoverage": 0.62,
      "regimenFidelity": 0.54,
      "hmmStateClarity": 0.56,
      "packCompleteness": 0.65,
      "guidelineAdherence": 0.67,
      "cultureLagOptimism": 0.36,
      "sepsisHardness": 0.44,
      "overclaimRisk": 0.31,
      "therapyBias": "hmm_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 60.96,
      "regimenScore": 58.35,
      "hmmScore": 68.25,
      "completenessScore": 50.82,
      "guidelineScore": 34.55,
      "confidence": 51.85,
      "ctHmmContribution": 60.14,
      "guidelineContribution": 36.06,
      "overall": 59.81
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 9.43,
      "regimenScore": 20.94,
      "hmmScore": 17.24,
      "completenessScore": 39.27,
      "guidelineScore": 38.2,
      "confidence": 27.75,
      "ctHmmContribution": 25.02,
      "guidelineContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "st-016",
    "input": {
      "onsetCoverage": 0.58,
      "regimenFidelity": 0.59,
      "hmmStateClarity": 0.6,
      "packCompleteness": 0.6,
      "guidelineAdherence": 0.63,
      "cultureLagOptimism": 0.37,
      "sepsisHardness": 0.36,
      "overclaimRisk": 0.32,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 54.78,
      "regimenScore": 60.67,
      "hmmScore": 57.91,
      "completenessScore": 65.05,
      "guidelineScore": 33.73,
      "confidence": 50.35,
      "ctHmmContribution": 59.33,
      "guidelineContribution": 35.81,
      "overall": 59.1
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 22.05,
      "regimenScore": 21.96,
      "hmmScore": 18.63,
      "completenessScore": 38.14,
      "guidelineScore": 55.7,
      "confidence": 28.3,
      "ctHmmContribution": 31.3,
      "guidelineContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "st-017",
    "input": {
      "onsetCoverage": 0.62,
      "regimenFidelity": 0.63,
      "hmmStateClarity": 0.63,
      "packCompleteness": 0.64,
      "guidelineAdherence": 0.67,
      "cultureLagOptimism": 0.39,
      "sepsisHardness": 0.37,
      "overclaimRisk": 0.33,
      "therapyBias": "regimen_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 64.04,
      "regimenScore": 64.28,
      "hmmScore": 42.42,
      "completenessScore": 81.43,
      "guidelineScore": 36.41,
      "confidence": 53.85,
      "ctHmmContribution": 61.87,
      "guidelineContribution": 38.64,
      "overall": 61.69
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 18.73,
      "regimenScore": 23.45,
      "hmmScore": 19.98,
      "completenessScore": 40.11,
      "guidelineScore": 39.86,
      "confidence": 30.3,
      "ctHmmContribution": 28.43,
      "guidelineContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "st-018",
    "input": {
      "onsetCoverage": 0.66,
      "regimenFidelity": 0.61,
      "hmmStateClarity": 0.67,
      "packCompleteness": 0.68,
      "guidelineAdherence": 0.7,
      "cultureLagOptimism": 0.34,
      "sepsisHardness": 0.38,
      "overclaimRisk": 0.27,
      "therapyBias": "guideline_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 26.77,
      "regimenScore": 54.13,
      "hmmScore": 45.55,
      "completenessScore": 40.09,
      "guidelineScore": 37.08,
      "confidence": 56.6,
      "ctHmmContribution": 41.53,
      "guidelineContribution": 39.18,
      "overall": 42.11
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 28.36,
      "regimenScore": 21.69,
      "hmmScore": 18.3,
      "completenessScore": 39.67,
      "guidelineScore": 74.27,
      "confidence": 29.5,
      "ctHmmContribution": 36.46,
      "guidelineContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "st-019",
    "input": {
      "onsetCoverage": 0.7,
      "regimenFidelity": 0.65,
      "hmmStateClarity": 0.7,
      "packCompleteness": 0.72,
      "guidelineAdherence": 0.74,
      "cultureLagOptimism": 0.36,
      "sepsisHardness": 0.38,
      "overclaimRisk": 0.28,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 65.21,
      "regimenScore": 67.74,
      "hmmScore": 68.17,
      "completenessScore": 75.07,
      "guidelineScore": 39.94,
      "confidence": 60.1,
      "ctHmmContribution": 68.82,
      "guidelineContribution": 42.25,
      "overall": 68.04
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 26.25,
      "regimenScore": 23.32,
      "hmmScore": 19.82,
      "completenessScore": 41.65,
      "guidelineScore": 62.07,
      "confidence": 31.7,
      "ctHmmContribution": 34.62,
      "guidelineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "st-020",
    "input": {
      "onsetCoverage": 0.66,
      "regimenFidelity": 0.7,
      "hmmStateClarity": 0.66,
      "packCompleteness": 0.68,
      "guidelineAdherence": 0.7,
      "cultureLagOptimism": 0.37,
      "sepsisHardness": 0.31,
      "overclaimRisk": 0.29,
      "therapyBias": "hmm_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 68.73,
      "regimenScore": 70.06,
      "hmmScore": 80.04,
      "completenessScore": 56.34,
      "guidelineScore": 38.94,
      "confidence": 58.85,
      "ctHmmContribution": 69.49,
      "guidelineContribution": 41.54,
      "overall": 68.46
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 13.66,
      "regimenScore": 23.93,
      "hmmScore": 20.65,
      "completenessScore": 40.51,
      "guidelineScore": 40.86,
      "confidence": 32.05,
      "ctHmmContribution": 27.92,
      "guidelineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "st-021",
    "input": {
      "onsetCoverage": 0.7,
      "regimenFidelity": 0.68,
      "hmmStateClarity": 0.7,
      "packCompleteness": 0.72,
      "guidelineAdherence": 0.73,
      "cultureLagOptimism": 0.33,
      "sepsisHardness": 0.31,
      "overclaimRisk": 0.24,
      "therapyBias": "balanced",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 66.16,
      "regimenScore": 69.88,
      "hmmScore": 69.32,
      "completenessScore": 75.82,
      "guidelineScore": 39.99,
      "confidence": 61.45,
      "ctHmmContribution": 70.06,
      "guidelineContribution": 42.54,
      "overall": 69.11
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 27.89,
      "regimenScore": 22.72,
      "hmmScore": 19.52,
      "completenessScore": 40.35,
      "guidelineScore": 61.19,
      "confidence": 31.8,
      "ctHmmContribution": 34.33,
      "guidelineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "st-022",
    "input": {
      "onsetCoverage": 0.74,
      "regimenFidelity": 0.72,
      "hmmStateClarity": 0.73,
      "packCompleteness": 0.76,
      "guidelineAdherence": 0.77,
      "cultureLagOptimism": 0.34,
      "sepsisHardness": 0.32,
      "overclaimRisk": 0.25,
      "therapyBias": "regimen_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 76.68,
      "regimenScore": 73.52,
      "hmmScore": 50.9,
      "completenessScore": 94.56,
      "guidelineScore": 42.47,
      "confidence": 65.1,
      "ctHmmContribution": 72.64,
      "guidelineContribution": 45.13,
      "overall": 71.69
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 24.57,
      "regimenScore": 23.77,
      "hmmScore": 20.46,
      "completenessScore": 42.05,
      "guidelineScore": 42.21,
      "confidence": 33.35,
      "ctHmmContribution": 30.61,
      "guidelineContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "st-023",
    "input": {
      "onsetCoverage": 0.79,
      "regimenFidelity": 0.76,
      "hmmStateClarity": 0.77,
      "packCompleteness": 0.8,
      "guidelineAdherence": 0.81,
      "cultureLagOptimism": 0.36,
      "sepsisHardness": 0.33,
      "overclaimRisk": 0.25,
      "therapyBias": "guideline_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 33.6,
      "regimenScore": 67.38,
      "hmmScore": 53.71,
      "completenessScore": 49.49,
      "guidelineScore": 45.16,
      "confidence": 69,
      "ctHmmContribution": 50.83,
      "guidelineContribution": 47.99,
      "overall": 51.32
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 33.86,
      "regimenScore": 25.2,
      "hmmScore": 21.84,
      "completenessScore": 43.92,
      "guidelineScore": 84.72,
      "confidence": 35.45,
      "ctHmmContribution": 41.91,
      "guidelineContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "st-024",
    "input": {
      "onsetCoverage": 0.75,
      "regimenFidelity": 0.75,
      "hmmStateClarity": 0.81,
      "packCompleteness": 0.76,
      "guidelineAdherence": 0.77,
      "cultureLagOptimism": 0.31,
      "sepsisHardness": 0.25,
      "overclaimRisk": 0.2,
      "therapyBias": "balanced",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 73.31,
      "regimenScore": 75.91,
      "hmmScore": 79.08,
      "completenessScore": 80.56,
      "guidelineScore": 43.13,
      "confidence": 66.85,
      "ctHmmContribution": 77.14,
      "guidelineContribution": 46.16,
      "overall": 75.56
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 31.21,
      "regimenScore": 23.47,
      "hmmScore": 20.52,
      "completenessScore": 41.11,
      "guidelineScore": 63.65,
      "confidence": 33.9,
      "ctHmmContribution": 35.99,
      "guidelineContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "st-025",
    "input": {
      "onsetCoverage": 0.79,
      "regimenFidelity": 0.79,
      "hmmStateClarity": 0.77,
      "packCompleteness": 0.8,
      "guidelineAdherence": 0.8,
      "cultureLagOptimism": 0.33,
      "sepsisHardness": 0.26,
      "overclaimRisk": 0.21,
      "therapyBias": "hmm_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 82.34,
      "regimenScore": 79.52,
      "hmmScore": 94.85,
      "completenessScore": 64.24,
      "guidelineScore": 45.2,
      "confidence": 70.35,
      "ctHmmContribution": 81.18,
      "guidelineContribution": 48.24,
      "overall": 79.25
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 19.5,
      "regimenScore": 24.56,
      "hmmScore": 21.5,
      "completenessScore": 42.63,
      "guidelineScore": 43.52,
      "confidence": 35.55,
      "ctHmmContribution": 30.34,
      "guidelineContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "st-026",
    "input": {
      "onsetCoverage": 0.83,
      "regimenFidelity": 0.83,
      "hmmStateClarity": 0.8,
      "packCompleteness": 0.83,
      "guidelineAdherence": 0.84,
      "cultureLagOptimism": 0.34,
      "sepsisHardness": 0.27,
      "overclaimRisk": 0.22,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 77.64,
      "regimenScore": 83.17,
      "hmmScore": 80.25,
      "completenessScore": 87.68,
      "guidelineScore": 47.68,
      "confidence": 73.75,
      "ctHmmContribution": 81.91,
      "guidelineContribution": 50.82,
      "overall": 80.31
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 33.17,
      "regimenScore": 25.61,
      "hmmScore": 22.47,
      "completenessScore": 44.32,
      "guidelineScore": 68.8,
      "confidence": 37.1,
      "ctHmmContribution": 38.87,
      "guidelineContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "st-027",
    "input": {
      "onsetCoverage": 0.87,
      "regimenFidelity": 0.81,
      "hmmStateClarity": 0.84,
      "packCompleteness": 0.87,
      "guidelineAdherence": 0.88,
      "cultureLagOptimism": 0.3,
      "sepsisHardness": 0.27,
      "overclaimRisk": 0.17,
      "therapyBias": "regimen_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 90.29,
      "regimenScore": 82.98,
      "hmmScore": 59.98,
      "completenessScore": 100,
      "guidelineScore": 49.35,
      "confidence": 76.35,
      "ctHmmContribution": 82.19,
      "guidelineContribution": 52.46,
      "overall": 80.84
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 30.78,
      "regimenScore": 24.64,
      "hmmScore": 21.53,
      "completenessScore": 44.62,
      "guidelineScore": 45.22,
      "confidence": 37.2,
      "ctHmmContribution": 33.36,
      "guidelineContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "st-028",
    "input": {
      "onsetCoverage": 0.83,
      "regimenFidelity": 0.86,
      "hmmStateClarity": 0.87,
      "packCompleteness": 0.83,
      "guidelineAdherence": 0.84,
      "cultureLagOptimism": 0.31,
      "sepsisHardness": 0.2,
      "overclaimRisk": 0.17,
      "therapyBias": "guideline_first",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 37.95,
      "regimenScore": 75.3,
      "hmmScore": 60.67,
      "completenessScore": 53.51,
      "guidelineScore": 48.34,
      "confidence": 75.1,
      "ctHmmContribution": 56.7,
      "guidelineContribution": 51.78,
      "overall": 56.81
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 38.81,
      "regimenScore": 25.31,
      "hmmScore": 22.44,
      "completenessScore": 43.48,
      "guidelineScore": 86.95,
      "confidence": 37.65,
      "ctHmmContribution": 43.4,
      "guidelineContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "st-029",
    "input": {
      "onsetCoverage": 0.87,
      "regimenFidelity": 0.9,
      "hmmStateClarity": 0.91,
      "packCompleteness": 0.87,
      "guidelineAdherence": 0.87,
      "cultureLagOptimism": 0.33,
      "sepsisHardness": 0.2,
      "overclaimRisk": 0.18,
      "therapyBias": "balanced",
      "profile": "ct_hmm_therapy_effectiveness"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 84.21,
      "regimenScore": 88.91,
      "hmmScore": 89.77,
      "completenessScore": 92.27,
      "guidelineScore": 50.59,
      "confidence": 78.6,
      "ctHmmContribution": 88.67,
      "guidelineContribution": 54.2,
      "overall": 86.47
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 36.33,
      "regimenScore": 26.66,
      "hmmScore": 23.73,
      "completenessScore": 45,
      "guidelineScore": 71.06,
      "confidence": 39.5,
      "ctHmmContribution": 40.56,
      "guidelineContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "st-030",
    "input": {
      "onsetCoverage": 0.91,
      "regimenFidelity": 0.88,
      "hmmStateClarity": 0.87,
      "packCompleteness": 0.91,
      "guidelineAdherence": 0.91,
      "cultureLagOptimism": 0.28,
      "sepsisHardness": 0.21,
      "overclaimRisk": 0.13,
      "therapyBias": "hmm_first",
      "profile": "static_guideline_baseline"
    },
    "expectedCtHmm": {
      "mode": "ct_hmm_therapy_effectiveness",
      "onsetScore": 94.88,
      "regimenScore": 88.77,
      "hmmScore": 100,
      "completenessScore": 71.68,
      "guidelineScore": 51.88,
      "confidence": 81.35,
      "ctHmmContribution": 89.74,
      "guidelineContribution": 55.26,
      "overall": 87.53
    },
    "expectedGuideline": {
      "mode": "static_guideline_baseline",
      "onsetScore": 25.72,
      "regimenScore": 25,
      "hmmScore": 22.06,
      "completenessScore": 45.02,
      "guidelineScore": 46.21,
      "confidence": 38.95,
      "ctHmmContribution": 32.8,
      "guidelineContribution": 50.65,
      "overall": 44.26
    }
  }
];
