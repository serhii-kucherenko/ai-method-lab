import type { MhcDesignInput, MhcDesignQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MhcDesignInput;
  expectedHybrid: MhcDesignQuality;
  expectedClassical: MhcDesignQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "md-001",
    "input": {
      "peptideCoverage": 0.29,
      "alleleFidelity": 0.25,
      "hybridClarity": 0.28,
      "packCompleteness": 0.34,
      "classicalAdherence": 0.39,
      "generativeOptimism": 0.45,
      "designHardness": 0.59,
      "overclaimRisk": 0.5,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 23.37,
      "alleleScore": 30.25,
      "hybridScore": 23.45,
      "completenessScore": 37.64,
      "classicalScore": 16.4,
      "confidence": 20.85,
      "hybridContribution": 28.18,
      "classicalContribution": 15.92,
      "overall": 29.97
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 5.76,
      "alleleScore": 17.05,
      "hybridScore": 12.78,
      "completenessScore": 32.39,
      "classicalScore": 40.93,
      "confidence": 17.1,
      "hybridContribution": 21.78,
      "classicalContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "md-002",
    "input": {
      "peptideCoverage": 0.33,
      "alleleFidelity": 0.29,
      "hybridClarity": 0.32,
      "packCompleteness": 0.38,
      "classicalAdherence": 0.43,
      "generativeOptimism": 0.46,
      "designHardness": 0.6,
      "overclaimRisk": 0.51,
      "designBias": "allele_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 29.47,
      "alleleScore": 33.9,
      "hybridScore": 17.72,
      "completenessScore": 48.93,
      "classicalScore": 18.89,
      "confidence": 24.5,
      "hybridContribution": 31.52,
      "classicalContribution": 18.58,
      "overall": 33.19
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 2.43,
      "alleleScore": 18.17,
      "hybridScore": 13.81,
      "completenessScore": 34.08,
      "classicalScore": 31.53,
      "confidence": 18.65,
      "hybridContribution": 20,
      "classicalContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "md-003",
    "input": {
      "peptideCoverage": 0.37,
      "alleleFidelity": 0.27,
      "hybridClarity": 0.36,
      "packCompleteness": 0.42,
      "classicalAdherence": 0.46,
      "generativeOptimism": 0.42,
      "designHardness": 0.6,
      "overclaimRisk": 0.46,
      "designBias": "classical_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 8.22,
      "alleleScore": 23.71,
      "hybridScore": 20.92,
      "completenessScore": 19.24,
      "classicalScore": 19.94,
      "confidence": 27.1,
      "hybridContribution": 17.92,
      "classicalContribution": 19.65,
      "overall": 19.23
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 12.17,
      "alleleScore": 17.05,
      "hybridScore": 12.78,
      "completenessScore": 33.93,
      "classicalScore": 54.34,
      "confidence": 18.4,
      "hybridContribution": 26.05,
      "classicalContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "md-004",
    "input": {
      "peptideCoverage": 0.33,
      "alleleFidelity": 0.32,
      "hybridClarity": 0.39,
      "packCompleteness": 0.38,
      "classicalAdherence": 0.42,
      "generativeOptimism": 0.43,
      "designHardness": 0.53,
      "overclaimRisk": 0.46,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 30.23,
      "alleleScore": 36.03,
      "hybridScore": 33.26,
      "completenessScore": 42.23,
      "classicalScore": 18.93,
      "confidence": 25.85,
      "hybridContribution": 35.11,
      "classicalContribution": 19.24,
      "overall": 36.25
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 8.7,
      "alleleScore": 18.05,
      "hybridScore": 14.08,
      "completenessScore": 32.79,
      "classicalScore": 42.77,
      "confidence": 18.85,
      "hybridContribution": 23.28,
      "classicalContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "md-005",
    "input": {
      "peptideCoverage": 0.37,
      "alleleFidelity": 0.36,
      "hybridClarity": 0.35,
      "packCompleteness": 0.42,
      "classicalAdherence": 0.46,
      "generativeOptimism": 0.45,
      "designHardness": 0.53,
      "overclaimRisk": 0.47,
      "designBias": "hybrid_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 34.45,
      "alleleScore": 39.64,
      "hybridScore": 39.52,
      "completenessScore": 35.49,
      "classicalScore": 21.8,
      "confidence": 29.35,
      "hybridContribution": 37.34,
      "classicalContribution": 22.12,
      "overall": 38.6
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 0,
      "alleleScore": 19.43,
      "hybridScore": 15.31,
      "completenessScore": 34.77,
      "classicalScore": 32.95,
      "confidence": 21.05,
      "hybridContribution": 20.49,
      "classicalContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "md-006",
    "input": {
      "peptideCoverage": 0.41,
      "alleleFidelity": 0.34,
      "hybridClarity": 0.39,
      "packCompleteness": 0.45,
      "classicalAdherence": 0.5,
      "generativeOptimism": 0.4,
      "designHardness": 0.54,
      "overclaimRisk": 0.42,
      "designBias": "balanced",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 35.28,
      "alleleScore": 39.5,
      "hybridScore": 35.78,
      "completenessScore": 47.85,
      "classicalScore": 23.08,
      "confidence": 31.85,
      "hybridContribution": 39.2,
      "classicalContribution": 23.32,
      "overall": 40.34
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 11.98,
      "alleleScore": 17.95,
      "hybridScore": 13.91,
      "completenessScore": 34.78,
      "classicalScore": 46.72,
      "confidence": 20.5,
      "hybridContribution": 25.07,
      "classicalContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "md-007",
    "input": {
      "peptideCoverage": 0.45,
      "alleleFidelity": 0.38,
      "hybridClarity": 0.42,
      "packCompleteness": 0.49,
      "classicalAdherence": 0.53,
      "generativeOptimism": 0.42,
      "designHardness": 0.55,
      "overclaimRisk": 0.43,
      "designBias": "allele_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 42.35,
      "alleleScore": 43.11,
      "hybridScore": 26.44,
      "completenessScore": 61.29,
      "classicalScore": 25.15,
      "confidence": 35.35,
      "hybridContribution": 42.24,
      "classicalContribution": 25.54,
      "overall": 43.23
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 8.27,
      "alleleScore": 19.21,
      "hybridScore": 15.09,
      "completenessScore": 36.3,
      "classicalScore": 34.2,
      "confidence": 22.15,
      "hybridContribution": 22.61,
      "classicalContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "md-008",
    "input": {
      "peptideCoverage": 0.41,
      "alleleFidelity": 0.43,
      "hybridClarity": 0.46,
      "packCompleteness": 0.45,
      "classicalAdherence": 0.49,
      "generativeOptimism": 0.43,
      "designHardness": 0.47,
      "overclaimRisk": 0.44,
      "designBias": "classical_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 12.47,
      "alleleScore": 35.43,
      "hybridScore": 27.76,
      "completenessScore": 24.76,
      "classicalScore": 24.32,
      "confidence": 34.1,
      "hybridContribution": 24.97,
      "classicalContribution": 25.37,
      "overall": 26.04
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 16.4,
      "alleleScore": 20.36,
      "hybridScore": 16.57,
      "completenessScore": 35.17,
      "classicalScore": 58.5,
      "confidence": 22.7,
      "hybridContribution": 29.4,
      "classicalContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "md-009",
    "input": {
      "peptideCoverage": 0.46,
      "alleleFidelity": 0.41,
      "hybridClarity": 0.5,
      "packCompleteness": 0.49,
      "classicalAdherence": 0.53,
      "generativeOptimism": 0.39,
      "designHardness": 0.48,
      "overclaimRisk": 0.38,
      "designBias": "balanced",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 42.68,
      "alleleScore": 45.49,
      "hybridScore": 45.8,
      "completenessScore": 52.59,
      "classicalScore": 25.81,
      "confidence": 37.1,
      "hybridContribution": 46.41,
      "classicalContribution": 26.81,
      "overall": 46.88
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 14.91,
      "alleleScore": 19.22,
      "hybridScore": 15.52,
      "completenessScore": 35.36,
      "classicalScore": 48.88,
      "confidence": 22.7,
      "hybridContribution": 26.78,
      "classicalContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "md-010",
    "input": {
      "peptideCoverage": 0.5,
      "alleleFidelity": 0.45,
      "hybridClarity": 0.46,
      "packCompleteness": 0.53,
      "classicalAdherence": 0.57,
      "generativeOptimism": 0.4,
      "designHardness": 0.49,
      "overclaimRisk": 0.39,
      "designBias": "hybrid_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 48.19,
      "alleleScore": 49.14,
      "hybridScore": 54.44,
      "completenessScore": 43.07,
      "classicalScore": 28.29,
      "confidence": 40.75,
      "hybridContribution": 49.04,
      "classicalContribution": 29.21,
      "overall": 49.47
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 3.59,
      "alleleScore": 20.03,
      "hybridScore": 16.17,
      "completenessScore": 37.06,
      "classicalScore": 35.54,
      "confidence": 24.25,
      "hybridContribution": 22.48,
      "classicalContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "md-011",
    "input": {
      "peptideCoverage": 0.54,
      "alleleFidelity": 0.49,
      "hybridClarity": 0.49,
      "packCompleteness": 0.57,
      "classicalAdherence": 0.6,
      "generativeOptimism": 0.42,
      "designHardness": 0.49,
      "overclaimRisk": 0.4,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 47.07,
      "alleleScore": 52.75,
      "hybridScore": 47.04,
      "completenessScore": 60.27,
      "classicalScore": 30.54,
      "confidence": 44.25,
      "hybridContribution": 51.33,
      "classicalContribution": 31.67,
      "overall": 51.79
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 17.1,
      "alleleScore": 21.44,
      "hybridScore": 17.52,
      "completenessScore": 38.58,
      "classicalScore": 54.12,
      "confidence": 26.1,
      "hybridContribution": 29.75,
      "classicalContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "md-012",
    "input": {
      "peptideCoverage": 0.5,
      "alleleFidelity": 0.48,
      "hybridClarity": 0.53,
      "packCompleteness": 0.53,
      "classicalAdherence": 0.56,
      "generativeOptimism": 0.37,
      "designHardness": 0.42,
      "overclaimRisk": 0.35,
      "designBias": "allele_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 51.69,
      "alleleScore": 51.28,
      "hybridScore": 34.47,
      "completenessScore": 67.57,
      "classicalScore": 28.34,
      "confidence": 42.1,
      "hybridContribution": 50.26,
      "classicalContribution": 29.77,
      "overall": 50.57
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 13.23,
      "alleleScore": 19.78,
      "hybridScore": 16.29,
      "completenessScore": 35.76,
      "classicalScore": 34.93,
      "confidence": 24.35,
      "hybridContribution": 24,
      "classicalContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "md-013",
    "input": {
      "peptideCoverage": 0.54,
      "alleleFidelity": 0.52,
      "hybridClarity": 0.56,
      "packCompleteness": 0.57,
      "classicalAdherence": 0.6,
      "generativeOptimism": 0.39,
      "designHardness": 0.42,
      "overclaimRisk": 0.36,
      "designBias": "classical_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 19.73,
      "alleleScore": 44.88,
      "hybridScore": 36.64,
      "completenessScore": 32.66,
      "classicalScore": 31.2,
      "confidence": 45.6,
      "hybridContribution": 33.35,
      "classicalContribution": 32.85,
      "overall": 34.26
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 22.62,
      "alleleScore": 21.42,
      "hybridScore": 17.82,
      "completenessScore": 37.74,
      "classicalScore": 67.02,
      "confidence": 26.55,
      "hybridContribution": 33.32,
      "classicalContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "md-014",
    "input": {
      "peptideCoverage": 0.58,
      "alleleFidelity": 0.56,
      "hybridClarity": 0.6,
      "packCompleteness": 0.61,
      "classicalAdherence": 0.63,
      "generativeOptimism": 0.4,
      "designHardness": 0.43,
      "overclaimRisk": 0.36,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 53.79,
      "alleleScore": 58.53,
      "hybridScore": 56.71,
      "completenessScore": 64.86,
      "classicalScore": 33.07,
      "confidence": 49.25,
      "hybridContribution": 58.18,
      "classicalContribution": 34.85,
      "overall": 57.98
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 20.03,
      "alleleScore": 22.26,
      "hybridScore": 18.61,
      "completenessScore": 38.98,
      "classicalScore": 55.96,
      "confidence": 27.85,
      "hybridContribution": 31.17,
      "classicalContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "md-015",
    "input": {
      "peptideCoverage": 0.62,
      "alleleFidelity": 0.54,
      "hybridClarity": 0.56,
      "packCompleteness": 0.65,
      "classicalAdherence": 0.67,
      "generativeOptimism": 0.36,
      "designHardness": 0.44,
      "overclaimRisk": 0.31,
      "designBias": "hybrid_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 60.96,
      "alleleScore": 58.35,
      "hybridScore": 68.25,
      "completenessScore": 50.82,
      "classicalScore": 34.55,
      "confidence": 51.85,
      "hybridContribution": 60.14,
      "classicalContribution": 36.06,
      "overall": 59.81
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 9.43,
      "alleleScore": 20.94,
      "hybridScore": 17.24,
      "completenessScore": 39.27,
      "classicalScore": 38.2,
      "confidence": 27.75,
      "hybridContribution": 25.02,
      "classicalContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "md-016",
    "input": {
      "peptideCoverage": 0.58,
      "alleleFidelity": 0.59,
      "hybridClarity": 0.6,
      "packCompleteness": 0.6,
      "classicalAdherence": 0.63,
      "generativeOptimism": 0.37,
      "designHardness": 0.36,
      "overclaimRisk": 0.32,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 54.78,
      "alleleScore": 60.67,
      "hybridScore": 57.91,
      "completenessScore": 65.05,
      "classicalScore": 33.73,
      "confidence": 50.35,
      "hybridContribution": 59.33,
      "classicalContribution": 35.81,
      "overall": 59.1
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 22.05,
      "alleleScore": 21.96,
      "hybridScore": 18.63,
      "completenessScore": 38.14,
      "classicalScore": 55.7,
      "confidence": 28.3,
      "hybridContribution": 31.3,
      "classicalContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "md-017",
    "input": {
      "peptideCoverage": 0.62,
      "alleleFidelity": 0.63,
      "hybridClarity": 0.63,
      "packCompleteness": 0.64,
      "classicalAdherence": 0.67,
      "generativeOptimism": 0.39,
      "designHardness": 0.37,
      "overclaimRisk": 0.33,
      "designBias": "allele_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 64.04,
      "alleleScore": 64.28,
      "hybridScore": 42.42,
      "completenessScore": 81.43,
      "classicalScore": 36.41,
      "confidence": 53.85,
      "hybridContribution": 61.87,
      "classicalContribution": 38.64,
      "overall": 61.69
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 18.73,
      "alleleScore": 23.45,
      "hybridScore": 19.98,
      "completenessScore": 40.11,
      "classicalScore": 39.86,
      "confidence": 30.3,
      "hybridContribution": 28.43,
      "classicalContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "md-018",
    "input": {
      "peptideCoverage": 0.66,
      "alleleFidelity": 0.61,
      "hybridClarity": 0.67,
      "packCompleteness": 0.68,
      "classicalAdherence": 0.7,
      "generativeOptimism": 0.34,
      "designHardness": 0.38,
      "overclaimRisk": 0.27,
      "designBias": "classical_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 26.77,
      "alleleScore": 54.13,
      "hybridScore": 45.55,
      "completenessScore": 40.09,
      "classicalScore": 37.08,
      "confidence": 56.6,
      "hybridContribution": 41.53,
      "classicalContribution": 39.18,
      "overall": 42.11
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 28.36,
      "alleleScore": 21.69,
      "hybridScore": 18.3,
      "completenessScore": 39.67,
      "classicalScore": 74.27,
      "confidence": 29.5,
      "hybridContribution": 36.46,
      "classicalContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "md-019",
    "input": {
      "peptideCoverage": 0.7,
      "alleleFidelity": 0.65,
      "hybridClarity": 0.7,
      "packCompleteness": 0.72,
      "classicalAdherence": 0.74,
      "generativeOptimism": 0.36,
      "designHardness": 0.38,
      "overclaimRisk": 0.28,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 65.21,
      "alleleScore": 67.74,
      "hybridScore": 68.17,
      "completenessScore": 75.07,
      "classicalScore": 39.94,
      "confidence": 60.1,
      "hybridContribution": 68.82,
      "classicalContribution": 42.25,
      "overall": 68.04
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 26.25,
      "alleleScore": 23.32,
      "hybridScore": 19.82,
      "completenessScore": 41.65,
      "classicalScore": 62.07,
      "confidence": 31.7,
      "hybridContribution": 34.62,
      "classicalContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "md-020",
    "input": {
      "peptideCoverage": 0.66,
      "alleleFidelity": 0.7,
      "hybridClarity": 0.66,
      "packCompleteness": 0.68,
      "classicalAdherence": 0.7,
      "generativeOptimism": 0.37,
      "designHardness": 0.31,
      "overclaimRisk": 0.29,
      "designBias": "hybrid_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 68.73,
      "alleleScore": 70.06,
      "hybridScore": 80.04,
      "completenessScore": 56.34,
      "classicalScore": 38.94,
      "confidence": 58.85,
      "hybridContribution": 69.49,
      "classicalContribution": 41.54,
      "overall": 68.46
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 13.66,
      "alleleScore": 23.93,
      "hybridScore": 20.65,
      "completenessScore": 40.51,
      "classicalScore": 40.86,
      "confidence": 32.05,
      "hybridContribution": 27.92,
      "classicalContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "md-021",
    "input": {
      "peptideCoverage": 0.7,
      "alleleFidelity": 0.68,
      "hybridClarity": 0.7,
      "packCompleteness": 0.72,
      "classicalAdherence": 0.73,
      "generativeOptimism": 0.33,
      "designHardness": 0.31,
      "overclaimRisk": 0.24,
      "designBias": "balanced",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 66.16,
      "alleleScore": 69.88,
      "hybridScore": 69.32,
      "completenessScore": 75.82,
      "classicalScore": 39.99,
      "confidence": 61.45,
      "hybridContribution": 70.06,
      "classicalContribution": 42.54,
      "overall": 69.11
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 27.89,
      "alleleScore": 22.72,
      "hybridScore": 19.52,
      "completenessScore": 40.35,
      "classicalScore": 61.19,
      "confidence": 31.8,
      "hybridContribution": 34.33,
      "classicalContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "md-022",
    "input": {
      "peptideCoverage": 0.74,
      "alleleFidelity": 0.72,
      "hybridClarity": 0.73,
      "packCompleteness": 0.76,
      "classicalAdherence": 0.77,
      "generativeOptimism": 0.34,
      "designHardness": 0.32,
      "overclaimRisk": 0.25,
      "designBias": "allele_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 76.68,
      "alleleScore": 73.52,
      "hybridScore": 50.9,
      "completenessScore": 94.56,
      "classicalScore": 42.47,
      "confidence": 65.1,
      "hybridContribution": 72.64,
      "classicalContribution": 45.13,
      "overall": 71.69
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 24.57,
      "alleleScore": 23.77,
      "hybridScore": 20.46,
      "completenessScore": 42.05,
      "classicalScore": 42.21,
      "confidence": 33.35,
      "hybridContribution": 30.61,
      "classicalContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "md-023",
    "input": {
      "peptideCoverage": 0.79,
      "alleleFidelity": 0.76,
      "hybridClarity": 0.77,
      "packCompleteness": 0.8,
      "classicalAdherence": 0.81,
      "generativeOptimism": 0.36,
      "designHardness": 0.33,
      "overclaimRisk": 0.25,
      "designBias": "classical_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 33.6,
      "alleleScore": 67.38,
      "hybridScore": 53.71,
      "completenessScore": 49.49,
      "classicalScore": 45.16,
      "confidence": 69,
      "hybridContribution": 50.83,
      "classicalContribution": 47.99,
      "overall": 51.32
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 33.86,
      "alleleScore": 25.2,
      "hybridScore": 21.84,
      "completenessScore": 43.92,
      "classicalScore": 84.72,
      "confidence": 35.45,
      "hybridContribution": 41.91,
      "classicalContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "md-024",
    "input": {
      "peptideCoverage": 0.75,
      "alleleFidelity": 0.75,
      "hybridClarity": 0.81,
      "packCompleteness": 0.76,
      "classicalAdherence": 0.77,
      "generativeOptimism": 0.31,
      "designHardness": 0.25,
      "overclaimRisk": 0.2,
      "designBias": "balanced",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 73.31,
      "alleleScore": 75.91,
      "hybridScore": 79.08,
      "completenessScore": 80.56,
      "classicalScore": 43.13,
      "confidence": 66.85,
      "hybridContribution": 77.14,
      "classicalContribution": 46.16,
      "overall": 75.56
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 31.21,
      "alleleScore": 23.47,
      "hybridScore": 20.52,
      "completenessScore": 41.11,
      "classicalScore": 63.65,
      "confidence": 33.9,
      "hybridContribution": 35.99,
      "classicalContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "md-025",
    "input": {
      "peptideCoverage": 0.79,
      "alleleFidelity": 0.79,
      "hybridClarity": 0.77,
      "packCompleteness": 0.8,
      "classicalAdherence": 0.8,
      "generativeOptimism": 0.33,
      "designHardness": 0.26,
      "overclaimRisk": 0.21,
      "designBias": "hybrid_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 82.34,
      "alleleScore": 79.52,
      "hybridScore": 94.85,
      "completenessScore": 64.24,
      "classicalScore": 45.2,
      "confidence": 70.35,
      "hybridContribution": 81.18,
      "classicalContribution": 48.24,
      "overall": 79.25
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 19.5,
      "alleleScore": 24.56,
      "hybridScore": 21.5,
      "completenessScore": 42.63,
      "classicalScore": 43.52,
      "confidence": 35.55,
      "hybridContribution": 30.34,
      "classicalContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "md-026",
    "input": {
      "peptideCoverage": 0.83,
      "alleleFidelity": 0.83,
      "hybridClarity": 0.8,
      "packCompleteness": 0.83,
      "classicalAdherence": 0.84,
      "generativeOptimism": 0.34,
      "designHardness": 0.27,
      "overclaimRisk": 0.22,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 77.64,
      "alleleScore": 83.17,
      "hybridScore": 80.25,
      "completenessScore": 87.68,
      "classicalScore": 47.68,
      "confidence": 73.75,
      "hybridContribution": 81.91,
      "classicalContribution": 50.82,
      "overall": 80.31
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 33.17,
      "alleleScore": 25.61,
      "hybridScore": 22.47,
      "completenessScore": 44.32,
      "classicalScore": 68.8,
      "confidence": 37.1,
      "hybridContribution": 38.87,
      "classicalContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "md-027",
    "input": {
      "peptideCoverage": 0.87,
      "alleleFidelity": 0.81,
      "hybridClarity": 0.84,
      "packCompleteness": 0.87,
      "classicalAdherence": 0.88,
      "generativeOptimism": 0.3,
      "designHardness": 0.27,
      "overclaimRisk": 0.17,
      "designBias": "allele_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 90.29,
      "alleleScore": 82.98,
      "hybridScore": 59.98,
      "completenessScore": 100,
      "classicalScore": 49.35,
      "confidence": 76.35,
      "hybridContribution": 82.19,
      "classicalContribution": 52.46,
      "overall": 80.84
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 30.78,
      "alleleScore": 24.64,
      "hybridScore": 21.53,
      "completenessScore": 44.62,
      "classicalScore": 45.22,
      "confidence": 37.2,
      "hybridContribution": 33.36,
      "classicalContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "md-028",
    "input": {
      "peptideCoverage": 0.83,
      "alleleFidelity": 0.86,
      "hybridClarity": 0.87,
      "packCompleteness": 0.83,
      "classicalAdherence": 0.84,
      "generativeOptimism": 0.31,
      "designHardness": 0.2,
      "overclaimRisk": 0.17,
      "designBias": "classical_first",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 37.95,
      "alleleScore": 75.3,
      "hybridScore": 60.67,
      "completenessScore": 53.51,
      "classicalScore": 48.34,
      "confidence": 75.1,
      "hybridContribution": 56.7,
      "classicalContribution": 51.78,
      "overall": 56.81
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 38.81,
      "alleleScore": 25.31,
      "hybridScore": 22.44,
      "completenessScore": 43.48,
      "classicalScore": 86.95,
      "confidence": 37.65,
      "hybridContribution": 43.4,
      "classicalContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "md-029",
    "input": {
      "peptideCoverage": 0.87,
      "alleleFidelity": 0.9,
      "hybridClarity": 0.91,
      "packCompleteness": 0.87,
      "classicalAdherence": 0.87,
      "generativeOptimism": 0.33,
      "designHardness": 0.2,
      "overclaimRisk": 0.18,
      "designBias": "balanced",
      "profile": "hybrid_quantum_classical_de_novo"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 84.21,
      "alleleScore": 88.91,
      "hybridScore": 89.77,
      "completenessScore": 92.27,
      "classicalScore": 50.59,
      "confidence": 78.6,
      "hybridContribution": 88.67,
      "classicalContribution": 54.2,
      "overall": 86.47
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 36.33,
      "alleleScore": 26.66,
      "hybridScore": 23.73,
      "completenessScore": 45,
      "classicalScore": 71.06,
      "confidence": 39.5,
      "hybridContribution": 40.56,
      "classicalContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "md-030",
    "input": {
      "peptideCoverage": 0.91,
      "alleleFidelity": 0.88,
      "hybridClarity": 0.87,
      "packCompleteness": 0.91,
      "classicalAdherence": 0.91,
      "generativeOptimism": 0.28,
      "designHardness": 0.21,
      "overclaimRisk": 0.13,
      "designBias": "hybrid_first",
      "profile": "classical_generative_baseline"
    },
    "expectedHybrid": {
      "mode": "hybrid_quantum_classical_de_novo",
      "peptideScore": 94.88,
      "alleleScore": 88.77,
      "hybridScore": 100,
      "completenessScore": 71.68,
      "classicalScore": 51.88,
      "confidence": 81.35,
      "hybridContribution": 89.74,
      "classicalContribution": 55.26,
      "overall": 87.53
    },
    "expectedClassical": {
      "mode": "classical_generative_baseline",
      "peptideScore": 25.72,
      "alleleScore": 25,
      "hybridScore": 22.06,
      "completenessScore": 45.02,
      "classicalScore": 46.21,
      "confidence": 38.95,
      "hybridContribution": 32.8,
      "classicalContribution": 50.65,
      "overall": 44.26
    }
  }
];
