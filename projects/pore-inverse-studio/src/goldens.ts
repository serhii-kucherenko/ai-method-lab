import type { PoreInput, PoreQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PoreInput;
  expectedUnifiedInverse: PoreQuality;
  expectedNaiveGenerative: PoreQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pore-001",
    "input": {
      "inverseCoverage": 0.29,
      "poreFidelity": 0.25,
      "targetClarity": 0.28,
      "designerStability": 0.34,
      "generativePassRate": 0.39,
      "generativeOptimism": 0.45,
      "poreHardness": 0.59,
      "overclaimRisk": 0.5,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 22.56,
      "poreScore": 30.25,
      "targetScore": 23.49,
      "designerScore": 37.64,
      "generativeScore": 16.4,
      "confidence": 19.35,
      "unifiedInverseContribution": 27.98,
      "naiveGenerativeContribution": 15.96,
      "overall": 29.82
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 5.76,
      "poreScore": 17.09,
      "targetScore": 13.13,
      "designerScore": 32.39,
      "generativeScore": 40.93,
      "confidence": 17.1,
      "unifiedInverseContribution": 21.86,
      "naiveGenerativeContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "pore-002",
    "input": {
      "inverseCoverage": 0.33,
      "poreFidelity": 0.29,
      "targetClarity": 0.32,
      "designerStability": 0.38,
      "generativePassRate": 0.43,
      "generativeOptimism": 0.46,
      "poreHardness": 0.6,
      "overclaimRisk": 0.51,
      "poreBias": "target_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 22.22,
      "poreScore": 33.9,
      "targetScore": 34.39,
      "designerScore": 31.9,
      "generativeScore": 18.89,
      "confidence": 23,
      "unifiedInverseContribution": 30.56,
      "naiveGenerativeContribution": 18.61,
      "overall": 32.41
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 2.43,
      "poreScore": 18.22,
      "targetScore": 14.16,
      "designerScore": 34.08,
      "generativeScore": 31.53,
      "confidence": 18.65,
      "unifiedInverseContribution": 20.08,
      "naiveGenerativeContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "pore-003",
    "input": {
      "inverseCoverage": 0.37,
      "poreFidelity": 0.27,
      "targetClarity": 0.36,
      "designerStability": 0.42,
      "generativePassRate": 0.46,
      "generativeOptimism": 0.42,
      "poreHardness": 0.6,
      "overclaimRisk": 0.46,
      "poreBias": "generative_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 12.18,
      "poreScore": 23.71,
      "targetScore": 20.95,
      "designerScore": 19.24,
      "generativeScore": 19.94,
      "confidence": 25.6,
      "unifiedInverseContribution": 18.96,
      "naiveGenerativeContribution": 19.69,
      "overall": 20.09
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 12.17,
      "poreScore": 17.1,
      "targetScore": 13.13,
      "designerScore": 33.93,
      "generativeScore": 54.34,
      "confidence": 18.4,
      "unifiedInverseContribution": 26.13,
      "naiveGenerativeContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "pore-004",
    "input": {
      "inverseCoverage": 0.33,
      "poreFidelity": 0.32,
      "targetClarity": 0.39,
      "designerStability": 0.38,
      "generativePassRate": 0.42,
      "generativeOptimism": 0.43,
      "poreHardness": 0.53,
      "overclaimRisk": 0.46,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 28.09,
      "poreScore": 36.03,
      "targetScore": 33.07,
      "designerScore": 42.23,
      "generativeScore": 18.93,
      "confidence": 26.1,
      "unifiedInverseContribution": 34.5,
      "naiveGenerativeContribution": 19.05,
      "overall": 35.72
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 8.7,
      "poreScore": 17.81,
      "targetScore": 13.75,
      "designerScore": 32.79,
      "generativeScore": 42.77,
      "confidence": 18.85,
      "unifiedInverseContribution": 23.16,
      "naiveGenerativeContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "pore-005",
    "input": {
      "inverseCoverage": 0.37,
      "poreFidelity": 0.36,
      "targetClarity": 0.35,
      "designerStability": 0.42,
      "generativePassRate": 0.46,
      "generativeOptimism": 0.45,
      "poreHardness": 0.53,
      "overclaimRisk": 0.47,
      "poreBias": "pore_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 26.86,
      "poreScore": 39.64,
      "targetScore": 21.39,
      "designerScore": 54.3,
      "generativeScore": 21.8,
      "confidence": 27.6,
      "unifiedInverseContribution": 34.43,
      "naiveGenerativeContribution": 22.19,
      "overall": 36.23
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 0,
      "poreScore": 19.51,
      "targetScore": 15.76,
      "designerScore": 34.77,
      "generativeScore": 32.95,
      "confidence": 21.05,
      "unifiedInverseContribution": 20.6,
      "naiveGenerativeContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "pore-006",
    "input": {
      "inverseCoverage": 0.41,
      "poreFidelity": 0.34,
      "targetClarity": 0.39,
      "designerStability": 0.45,
      "generativePassRate": 0.5,
      "generativeOptimism": 0.4,
      "poreHardness": 0.54,
      "overclaimRisk": 0.42,
      "poreBias": "balanced",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 33.94,
      "poreScore": 39.5,
      "targetScore": 35.84,
      "designerScore": 47.85,
      "generativeScore": 23.08,
      "confidence": 30.35,
      "unifiedInverseContribution": 38.87,
      "naiveGenerativeContribution": 23.38,
      "overall": 40.08
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 11.98,
      "poreScore": 18.04,
      "targetScore": 14.31,
      "designerScore": 34.78,
      "generativeScore": 46.72,
      "confidence": 20.5,
      "unifiedInverseContribution": 25.17,
      "naiveGenerativeContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "pore-007",
    "input": {
      "inverseCoverage": 0.45,
      "poreFidelity": 0.38,
      "targetClarity": 0.42,
      "designerStability": 0.49,
      "generativePassRate": 0.53,
      "generativeOptimism": 0.42,
      "poreHardness": 0.55,
      "overclaimRisk": 0.43,
      "poreBias": "target_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 31.59,
      "poreScore": 43.11,
      "targetScore": 48.37,
      "designerScore": 39.34,
      "generativeScore": 25.15,
      "confidence": 33.6,
      "unifiedInverseContribution": 40.76,
      "naiveGenerativeContribution": 25.64,
      "overall": 42.04
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 8.27,
      "poreScore": 19.34,
      "targetScore": 15.59,
      "designerScore": 36.3,
      "generativeScore": 34.2,
      "confidence": 22.15,
      "unifiedInverseContribution": 22.74,
      "naiveGenerativeContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "pore-008",
    "input": {
      "inverseCoverage": 0.41,
      "poreFidelity": 0.43,
      "targetClarity": 0.46,
      "designerStability": 0.45,
      "generativePassRate": 0.49,
      "generativeOptimism": 0.43,
      "poreHardness": 0.47,
      "overclaimRisk": 0.44,
      "poreBias": "generative_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 19.33,
      "poreScore": 35.43,
      "targetScore": 27.62,
      "designerScore": 24.76,
      "generativeScore": 24.32,
      "confidence": 34.35,
      "unifiedInverseContribution": 26.71,
      "naiveGenerativeContribution": 25.23,
      "overall": 27.44
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 16.4,
      "poreScore": 20.18,
      "targetScore": 16.31,
      "designerScore": 35.17,
      "generativeScore": 58.5,
      "confidence": 22.7,
      "unifiedInverseContribution": 29.31,
      "naiveGenerativeContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "pore-009",
    "input": {
      "inverseCoverage": 0.46,
      "poreFidelity": 0.41,
      "targetClarity": 0.5,
      "designerStability": 0.49,
      "generativePassRate": 0.53,
      "generativeOptimism": 0.39,
      "poreHardness": 0.48,
      "overclaimRisk": 0.38,
      "poreBias": "balanced",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 40.05,
      "poreScore": 45.49,
      "targetScore": 45.68,
      "designerScore": 52.59,
      "generativeScore": 25.81,
      "confidence": 37.35,
      "unifiedInverseContribution": 45.69,
      "naiveGenerativeContribution": 26.69,
      "overall": 46.27
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 14.91,
      "poreScore": 19.07,
      "targetScore": 15.29,
      "designerScore": 35.36,
      "generativeScore": 48.88,
      "confidence": 22.7,
      "unifiedInverseContribution": 26.7,
      "naiveGenerativeContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "pore-010",
    "input": {
      "inverseCoverage": 0.5,
      "poreFidelity": 0.45,
      "targetClarity": 0.46,
      "designerStability": 0.53,
      "generativePassRate": 0.57,
      "generativeOptimism": 0.4,
      "poreHardness": 0.49,
      "overclaimRisk": 0.39,
      "poreBias": "pore_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 36.62,
      "poreScore": 49.14,
      "targetScore": 30.65,
      "designerScore": 66.82,
      "generativeScore": 28.29,
      "confidence": 39,
      "unifiedInverseContribution": 44.6,
      "naiveGenerativeContribution": 29.32,
      "overall": 45.85
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 3.59,
      "poreScore": 20.18,
      "targetScore": 16.7,
      "designerScore": 37.06,
      "generativeScore": 35.54,
      "confidence": 24.25,
      "unifiedInverseContribution": 22.61,
      "naiveGenerativeContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "pore-011",
    "input": {
      "inverseCoverage": 0.54,
      "poreFidelity": 0.49,
      "targetClarity": 0.49,
      "designerStability": 0.57,
      "generativePassRate": 0.6,
      "generativeOptimism": 0.42,
      "poreHardness": 0.49,
      "overclaimRisk": 0.4,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 47.21,
      "poreScore": 52.75,
      "targetScore": 47.19,
      "designerScore": 60.27,
      "generativeScore": 30.54,
      "confidence": 42.25,
      "unifiedInverseContribution": 51.41,
      "naiveGenerativeContribution": 31.82,
      "overall": 51.88
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 17.1,
      "poreScore": 21.62,
      "targetScore": 18.14,
      "designerScore": 38.58,
      "generativeScore": 54.12,
      "confidence": 26.1,
      "unifiedInverseContribution": 29.91,
      "naiveGenerativeContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "pore-012",
    "input": {
      "inverseCoverage": 0.5,
      "poreFidelity": 0.48,
      "targetClarity": 0.53,
      "designerStability": 0.53,
      "generativePassRate": 0.56,
      "generativeOptimism": 0.37,
      "poreHardness": 0.42,
      "overclaimRisk": 0.35,
      "poreBias": "target_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 38.19,
      "poreScore": 51.28,
      "targetScore": 61.94,
      "designerScore": 43.82,
      "generativeScore": 28.34,
      "confidence": 42.1,
      "unifiedInverseContribution": 49.22,
      "naiveGenerativeContribution": 29.7,
      "overall": 49.71
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 13.23,
      "poreScore": 19.68,
      "targetScore": 16.17,
      "designerScore": 35.76,
      "generativeScore": 34.93,
      "confidence": 24.35,
      "unifiedInverseContribution": 23.95,
      "naiveGenerativeContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "pore-013",
    "input": {
      "inverseCoverage": 0.54,
      "poreFidelity": 0.52,
      "targetClarity": 0.56,
      "designerStability": 0.57,
      "generativePassRate": 0.6,
      "generativeOptimism": 0.39,
      "poreHardness": 0.42,
      "overclaimRisk": 0.36,
      "poreBias": "generative_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 29.13,
      "poreScore": 44.88,
      "targetScore": 36.59,
      "designerScore": 32.66,
      "generativeScore": 31.2,
      "confidence": 45.35,
      "unifiedInverseContribution": 35.78,
      "naiveGenerativeContribution": 32.8,
      "overall": 36.24
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 22.62,
      "poreScore": 21.35,
      "targetScore": 17.8,
      "designerScore": 37.74,
      "generativeScore": 67.02,
      "confidence": 26.55,
      "unifiedInverseContribution": 33.31,
      "naiveGenerativeContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "pore-014",
    "input": {
      "inverseCoverage": 0.58,
      "poreFidelity": 0.56,
      "targetClarity": 0.6,
      "designerStability": 0.61,
      "generativePassRate": 0.63,
      "generativeOptimism": 0.4,
      "poreHardness": 0.43,
      "overclaimRisk": 0.36,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 52.62,
      "poreScore": 58.53,
      "targetScore": 56.66,
      "designerScore": 64.86,
      "generativeScore": 33.07,
      "confidence": 49,
      "unifiedInverseContribution": 57.86,
      "naiveGenerativeContribution": 34.8,
      "overall": 57.71
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 20.03,
      "poreScore": 22.2,
      "targetScore": 18.59,
      "designerScore": 38.98,
      "generativeScore": 55.96,
      "confidence": 27.85,
      "unifiedInverseContribution": 31.15,
      "naiveGenerativeContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "pore-015",
    "input": {
      "inverseCoverage": 0.62,
      "poreFidelity": 0.54,
      "targetClarity": 0.56,
      "designerStability": 0.65,
      "generativePassRate": 0.67,
      "generativeOptimism": 0.36,
      "poreHardness": 0.44,
      "overclaimRisk": 0.31,
      "poreBias": "pore_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 45.9,
      "poreScore": 58.35,
      "targetScore": 39.3,
      "designerScore": 79.94,
      "generativeScore": 34.55,
      "confidence": 49.6,
      "unifiedInverseContribution": 54.53,
      "naiveGenerativeContribution": 36.22,
      "overall": 55.23
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 9.43,
      "poreScore": 21.14,
      "targetScore": 17.93,
      "designerScore": 39.27,
      "generativeScore": 38.2,
      "confidence": 27.75,
      "unifiedInverseContribution": 25.19,
      "naiveGenerativeContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "pore-016",
    "input": {
      "inverseCoverage": 0.58,
      "poreFidelity": 0.59,
      "targetClarity": 0.6,
      "designerStability": 0.6,
      "generativePassRate": 0.63,
      "generativeOptimism": 0.37,
      "poreHardness": 0.36,
      "overclaimRisk": 0.32,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 54.46,
      "poreScore": 60.67,
      "targetScore": 57.87,
      "designerScore": 65.05,
      "generativeScore": 33.73,
      "confidence": 50.35,
      "unifiedInverseContribution": 59.24,
      "naiveGenerativeContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 22.05,
      "poreScore": 21.91,
      "targetScore": 18.56,
      "designerScore": 38.14,
      "generativeScore": 55.7,
      "confidence": 28.3,
      "unifiedInverseContribution": 31.27,
      "naiveGenerativeContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "pore-017",
    "input": {
      "inverseCoverage": 0.62,
      "poreFidelity": 0.63,
      "targetClarity": 0.63,
      "designerStability": 0.64,
      "generativePassRate": 0.67,
      "generativeOptimism": 0.39,
      "poreHardness": 0.37,
      "overclaimRisk": 0.33,
      "poreBias": "target_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 48.43,
      "poreScore": 64.28,
      "targetScore": 75.13,
      "designerScore": 52.76,
      "generativeScore": 36.41,
      "confidence": 53.6,
      "unifiedInverseContribution": 60.66,
      "naiveGenerativeContribution": 38.61,
      "overall": 60.69
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 18.73,
      "poreScore": 23.42,
      "targetScore": 20,
      "designerScore": 40.11,
      "generativeScore": 39.86,
      "confidence": 30.3,
      "unifiedInverseContribution": 28.42,
      "naiveGenerativeContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "pore-018",
    "input": {
      "inverseCoverage": 0.66,
      "poreFidelity": 0.61,
      "targetClarity": 0.67,
      "designerStability": 0.68,
      "generativePassRate": 0.7,
      "generativeOptimism": 0.34,
      "poreHardness": 0.38,
      "overclaimRisk": 0.27,
      "poreBias": "generative_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 38.33,
      "poreScore": 54.13,
      "targetScore": 45.52,
      "designerScore": 40.09,
      "generativeScore": 37.08,
      "confidence": 56.35,
      "unifiedInverseContribution": 44.52,
      "naiveGenerativeContribution": 39.16,
      "overall": 44.56
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 28.36,
      "poreScore": 21.66,
      "targetScore": 18.31,
      "designerScore": 39.67,
      "generativeScore": 74.27,
      "confidence": 29.5,
      "unifiedInverseContribution": 36.45,
      "naiveGenerativeContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "pore-019",
    "input": {
      "inverseCoverage": 0.7,
      "poreFidelity": 0.65,
      "targetClarity": 0.7,
      "designerStability": 0.72,
      "generativePassRate": 0.74,
      "generativeOptimism": 0.36,
      "poreHardness": 0.38,
      "overclaimRisk": 0.28,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 63.81,
      "poreScore": 67.74,
      "targetScore": 68.17,
      "designerScore": 75.07,
      "generativeScore": 39.94,
      "confidence": 59.6,
      "unifiedInverseContribution": 68.45,
      "naiveGenerativeContribution": 42.25,
      "overall": 67.73
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 26.25,
      "poreScore": 23.32,
      "targetScore": 19.92,
      "designerScore": 41.65,
      "generativeScore": 62.07,
      "confidence": 31.7,
      "unifiedInverseContribution": 34.64,
      "naiveGenerativeContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "pore-020",
    "input": {
      "inverseCoverage": 0.66,
      "poreFidelity": 0.7,
      "targetClarity": 0.66,
      "designerStability": 0.68,
      "generativePassRate": 0.7,
      "generativeOptimism": 0.37,
      "poreHardness": 0.31,
      "overclaimRisk": 0.29,
      "poreBias": "pore_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 52.86,
      "poreScore": 70.06,
      "targetScore": 45.74,
      "designerScore": 86.81,
      "generativeScore": 38.94,
      "confidence": 58.35,
      "unifiedInverseContribution": 62.46,
      "naiveGenerativeContribution": 41.54,
      "overall": 62.69
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 13.66,
      "poreScore": 23.93,
      "targetScore": 20.75,
      "designerScore": 40.51,
      "generativeScore": 40.86,
      "confidence": 32.05,
      "unifiedInverseContribution": 27.94,
      "naiveGenerativeContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "pore-021",
    "input": {
      "inverseCoverage": 0.7,
      "poreFidelity": 0.68,
      "targetClarity": 0.7,
      "designerStability": 0.72,
      "generativePassRate": 0.73,
      "generativeOptimism": 0.33,
      "poreHardness": 0.31,
      "overclaimRisk": 0.24,
      "poreBias": "balanced",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 65.6,
      "poreScore": 69.88,
      "targetScore": 69.32,
      "designerScore": 75.82,
      "generativeScore": 39.99,
      "confidence": 60.95,
      "unifiedInverseContribution": 69.92,
      "naiveGenerativeContribution": 42.54,
      "overall": 68.99
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 27.89,
      "poreScore": 22.72,
      "targetScore": 19.62,
      "designerScore": 40.35,
      "generativeScore": 61.19,
      "confidence": 31.8,
      "unifiedInverseContribution": 34.35,
      "naiveGenerativeContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "pore-022",
    "input": {
      "inverseCoverage": 0.74,
      "poreFidelity": 0.72,
      "targetClarity": 0.73,
      "designerStability": 0.76,
      "generativePassRate": 0.77,
      "generativeOptimism": 0.34,
      "poreHardness": 0.32,
      "overclaimRisk": 0.25,
      "poreBias": "target_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 57.62,
      "poreScore": 73.52,
      "targetScore": 88.86,
      "designerScore": 60.51,
      "generativeScore": 42.47,
      "confidence": 64.35,
      "unifiedInverseContribution": 70.82,
      "naiveGenerativeContribution": 45.15,
      "overall": 70.2
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 24.57,
      "poreScore": 23.79,
      "targetScore": 20.63,
      "designerScore": 42.05,
      "generativeScore": 42.21,
      "confidence": 33.35,
      "unifiedInverseContribution": 30.65,
      "naiveGenerativeContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "pore-023",
    "input": {
      "inverseCoverage": 0.79,
      "poreFidelity": 0.76,
      "targetClarity": 0.77,
      "designerStability": 0.8,
      "generativePassRate": 0.81,
      "generativeOptimism": 0.36,
      "poreHardness": 0.33,
      "overclaimRisk": 0.25,
      "poreBias": "generative_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 49.04,
      "poreScore": 67.38,
      "targetScore": 53.74,
      "designerScore": 49.49,
      "generativeScore": 45.16,
      "confidence": 68.25,
      "unifiedInverseContribution": 54.86,
      "naiveGenerativeContribution": 48.03,
      "overall": 54.63
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 33.86,
      "poreScore": 25.25,
      "targetScore": 22.05,
      "designerScore": 43.92,
      "generativeScore": 84.72,
      "confidence": 35.45,
      "unifiedInverseContribution": 41.96,
      "naiveGenerativeContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "pore-024",
    "input": {
      "inverseCoverage": 0.75,
      "poreFidelity": 0.75,
      "targetClarity": 0.81,
      "designerStability": 0.76,
      "generativePassRate": 0.77,
      "generativeOptimism": 0.31,
      "poreHardness": 0.25,
      "overclaimRisk": 0.2,
      "poreBias": "balanced",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 71.55,
      "poreScore": 75.91,
      "targetScore": 78.99,
      "designerScore": 80.56,
      "generativeScore": 43.13,
      "confidence": 68.1,
      "unifiedInverseContribution": 76.66,
      "naiveGenerativeContribution": 46.07,
      "overall": 75.15
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 31.21,
      "poreScore": 23.36,
      "targetScore": 20.13,
      "designerScore": 41.11,
      "generativeScore": 63.65,
      "confidence": 33.9,
      "unifiedInverseContribution": 35.89,
      "naiveGenerativeContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "pore-025",
    "input": {
      "inverseCoverage": 0.79,
      "poreFidelity": 0.79,
      "targetClarity": 0.77,
      "designerStability": 0.8,
      "generativePassRate": 0.8,
      "generativeOptimism": 0.33,
      "poreHardness": 0.26,
      "overclaimRisk": 0.21,
      "poreBias": "pore_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 62.51,
      "poreScore": 79.52,
      "targetScore": 54.86,
      "designerScore": 100,
      "generativeScore": 45.2,
      "confidence": 69.6,
      "unifiedInverseContribution": 72.7,
      "naiveGenerativeContribution": 48.27,
      "overall": 72.3
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 19.5,
      "poreScore": 24.6,
      "targetScore": 21.69,
      "designerScore": 42.63,
      "generativeScore": 43.52,
      "confidence": 35.55,
      "unifiedInverseContribution": 30.39,
      "naiveGenerativeContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "pore-026",
    "input": {
      "inverseCoverage": 0.83,
      "poreFidelity": 0.83,
      "targetClarity": 0.8,
      "designerStability": 0.83,
      "generativePassRate": 0.84,
      "generativeOptimism": 0.34,
      "poreHardness": 0.27,
      "overclaimRisk": 0.22,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 78.52,
      "poreScore": 83.17,
      "targetScore": 80.3,
      "designerScore": 87.68,
      "generativeScore": 47.68,
      "confidence": 73,
      "unifiedInverseContribution": 82.15,
      "naiveGenerativeContribution": 50.87,
      "overall": 80.52
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 33.17,
      "poreScore": 25.67,
      "targetScore": 22.7,
      "designerScore": 44.32,
      "generativeScore": 68.8,
      "confidence": 37.1,
      "unifiedInverseContribution": 38.93,
      "naiveGenerativeContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "pore-027",
    "input": {
      "inverseCoverage": 0.87,
      "poreFidelity": 0.81,
      "targetClarity": 0.84,
      "designerStability": 0.87,
      "generativePassRate": 0.88,
      "generativeOptimism": 0.3,
      "poreHardness": 0.27,
      "overclaimRisk": 0.17,
      "poreBias": "target_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 67.26,
      "poreScore": 82.98,
      "targetScore": 100,
      "designerScore": 68.1,
      "generativeScore": 49.35,
      "confidence": 75.6,
      "unifiedInverseContribution": 80.38,
      "naiveGenerativeContribution": 52.5,
      "overall": 79.36
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 30.78,
      "poreScore": 24.7,
      "targetScore": 21.75,
      "designerScore": 44.62,
      "generativeScore": 45.22,
      "confidence": 37.2,
      "unifiedInverseContribution": 33.41,
      "naiveGenerativeContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "pore-028",
    "input": {
      "inverseCoverage": 0.83,
      "poreFidelity": 0.86,
      "targetClarity": 0.87,
      "designerStability": 0.83,
      "generativePassRate": 0.84,
      "generativeOptimism": 0.31,
      "poreHardness": 0.2,
      "overclaimRisk": 0.17,
      "poreBias": "generative_first",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 54.87,
      "poreScore": 75.3,
      "targetScore": 60.62,
      "designerScore": 53.51,
      "generativeScore": 48.34,
      "confidence": 76.1,
      "unifiedInverseContribution": 61.08,
      "naiveGenerativeContribution": 51.73,
      "overall": 60.4
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 38.81,
      "poreScore": 25.25,
      "targetScore": 22.17,
      "designerScore": 43.48,
      "generativeScore": 86.95,
      "confidence": 37.65,
      "unifiedInverseContribution": 43.33,
      "naiveGenerativeContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "pore-029",
    "input": {
      "inverseCoverage": 0.87,
      "poreFidelity": 0.9,
      "targetClarity": 0.91,
      "designerStability": 0.87,
      "generativePassRate": 0.87,
      "generativeOptimism": 0.33,
      "poreHardness": 0.2,
      "overclaimRisk": 0.18,
      "poreBias": "balanced",
      "profile": "unified_inverse"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 83.89,
      "poreScore": 88.91,
      "targetScore": 89.72,
      "designerScore": 92.27,
      "generativeScore": 50.59,
      "confidence": 79.6,
      "unifiedInverseContribution": 88.57,
      "naiveGenerativeContribution": 54.16,
      "overall": 86.38
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 36.33,
      "poreScore": 26.6,
      "targetScore": 23.46,
      "designerScore": 45,
      "generativeScore": 71.06,
      "confidence": 39.5,
      "unifiedInverseContribution": 40.49,
      "naiveGenerativeContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "pore-030",
    "input": {
      "inverseCoverage": 0.91,
      "poreFidelity": 0.88,
      "targetClarity": 0.87,
      "designerStability": 0.91,
      "generativePassRate": 0.91,
      "generativeOptimism": 0.28,
      "poreHardness": 0.21,
      "overclaimRisk": 0.13,
      "poreBias": "pore_first",
      "profile": "naive_generative"
    },
    "expectedUnifiedInverse": {
      "mode": "unified_inverse",
      "inverseScore": 71.59,
      "poreScore": 88.77,
      "targetScore": 63.26,
      "designerScore": 100,
      "generativeScore": 51.88,
      "confidence": 80.35,
      "unifiedInverseContribution": 79.63,
      "naiveGenerativeContribution": 55.31,
      "overall": 79.25
    },
    "expectedNaiveGenerative": {
      "mode": "naive_generative",
      "inverseScore": 25.72,
      "poreScore": 25.06,
      "targetScore": 22.34,
      "designerScore": 45.02,
      "generativeScore": 46.21,
      "confidence": 38.95,
      "unifiedInverseContribution": 32.87,
      "naiveGenerativeContribution": 50.68,
      "overall": 44.3
    }
  }
];
