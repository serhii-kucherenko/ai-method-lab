import type { ForceInput, ForceQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ForceInput;
  expectedFoundation: ForceQuality;
  expectedBaseline: ForceQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "af-001",
    "input": {
      "packCoverage": 0.29,
      "fmFidelity": 0.25,
      "forceClarity": 0.28,
      "runStability": 0.34,
      "classicalFfRate": 0.39,
      "ffOptimism": 0.45,
      "reactionHardness": 0.59,
      "overclaimRisk": 0.5,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 22.56,
      "fmScore": 30.25,
      "forceOptScore": 23.49,
      "packIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "fmContribution": 27.98,
      "baselineContribution": 15.96,
      "overall": 29.82
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 5.76,
      "fmScore": 17.09,
      "forceOptScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "fmContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "af-002",
    "input": {
      "packCoverage": 0.33,
      "fmFidelity": 0.29,
      "forceClarity": 0.32,
      "runStability": 0.38,
      "classicalFfRate": 0.43,
      "ffOptimism": 0.46,
      "reactionHardness": 0.6,
      "overclaimRisk": 0.51,
      "forceBias": "force_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 22.22,
      "fmScore": 33.9,
      "forceOptScore": 34.39,
      "packIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 23,
      "fmContribution": 30.56,
      "baselineContribution": 18.61,
      "overall": 32.41
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 2.43,
      "fmScore": 18.22,
      "forceOptScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "fmContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "af-003",
    "input": {
      "packCoverage": 0.37,
      "fmFidelity": 0.27,
      "forceClarity": 0.36,
      "runStability": 0.42,
      "classicalFfRate": 0.46,
      "ffOptimism": 0.42,
      "reactionHardness": 0.6,
      "overclaimRisk": 0.46,
      "forceBias": "baseline_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 12.18,
      "fmScore": 23.71,
      "forceOptScore": 20.95,
      "packIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "fmContribution": 18.96,
      "baselineContribution": 19.69,
      "overall": 20.09
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 12.17,
      "fmScore": 17.1,
      "forceOptScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "fmContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "af-004",
    "input": {
      "packCoverage": 0.33,
      "fmFidelity": 0.32,
      "forceClarity": 0.39,
      "runStability": 0.38,
      "classicalFfRate": 0.42,
      "ffOptimism": 0.43,
      "reactionHardness": 0.53,
      "overclaimRisk": 0.46,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 28.09,
      "fmScore": 36.03,
      "forceOptScore": 33.07,
      "packIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "fmContribution": 34.5,
      "baselineContribution": 19.05,
      "overall": 35.72
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 8.7,
      "fmScore": 17.81,
      "forceOptScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "fmContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "af-005",
    "input": {
      "packCoverage": 0.37,
      "fmFidelity": 0.36,
      "forceClarity": 0.35,
      "runStability": 0.42,
      "classicalFfRate": 0.46,
      "ffOptimism": 0.45,
      "reactionHardness": 0.53,
      "overclaimRisk": 0.47,
      "forceBias": "fm_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 26.86,
      "fmScore": 39.64,
      "forceOptScore": 21.39,
      "packIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "fmContribution": 34.43,
      "baselineContribution": 22.19,
      "overall": 36.23
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 0,
      "fmScore": 19.51,
      "forceOptScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "fmContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "af-006",
    "input": {
      "packCoverage": 0.41,
      "fmFidelity": 0.34,
      "forceClarity": 0.39,
      "runStability": 0.45,
      "classicalFfRate": 0.5,
      "ffOptimism": 0.4,
      "reactionHardness": 0.54,
      "overclaimRisk": 0.42,
      "forceBias": "balanced",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 33.94,
      "fmScore": 39.5,
      "forceOptScore": 35.84,
      "packIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "fmContribution": 38.87,
      "baselineContribution": 23.38,
      "overall": 40.08
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 11.98,
      "fmScore": 18.04,
      "forceOptScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "fmContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "af-007",
    "input": {
      "packCoverage": 0.45,
      "fmFidelity": 0.38,
      "forceClarity": 0.42,
      "runStability": 0.49,
      "classicalFfRate": 0.53,
      "ffOptimism": 0.42,
      "reactionHardness": 0.55,
      "overclaimRisk": 0.43,
      "forceBias": "force_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 31.59,
      "fmScore": 43.11,
      "forceOptScore": 48.37,
      "packIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "fmContribution": 40.76,
      "baselineContribution": 25.64,
      "overall": 42.04
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 8.27,
      "fmScore": 19.34,
      "forceOptScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "fmContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "af-008",
    "input": {
      "packCoverage": 0.41,
      "fmFidelity": 0.43,
      "forceClarity": 0.46,
      "runStability": 0.45,
      "classicalFfRate": 0.49,
      "ffOptimism": 0.43,
      "reactionHardness": 0.47,
      "overclaimRisk": 0.44,
      "forceBias": "baseline_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 19.33,
      "fmScore": 35.43,
      "forceOptScore": 27.62,
      "packIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "fmContribution": 26.71,
      "baselineContribution": 25.23,
      "overall": 27.44
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 16.4,
      "fmScore": 20.18,
      "forceOptScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "fmContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "af-009",
    "input": {
      "packCoverage": 0.46,
      "fmFidelity": 0.41,
      "forceClarity": 0.5,
      "runStability": 0.49,
      "classicalFfRate": 0.53,
      "ffOptimism": 0.39,
      "reactionHardness": 0.48,
      "overclaimRisk": 0.38,
      "forceBias": "balanced",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 40.05,
      "fmScore": 45.49,
      "forceOptScore": 45.68,
      "packIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "fmContribution": 45.69,
      "baselineContribution": 26.69,
      "overall": 46.27
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 14.91,
      "fmScore": 19.07,
      "forceOptScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "fmContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "af-010",
    "input": {
      "packCoverage": 0.5,
      "fmFidelity": 0.45,
      "forceClarity": 0.46,
      "runStability": 0.53,
      "classicalFfRate": 0.57,
      "ffOptimism": 0.4,
      "reactionHardness": 0.49,
      "overclaimRisk": 0.39,
      "forceBias": "fm_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 36.62,
      "fmScore": 49.14,
      "forceOptScore": 30.65,
      "packIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 39,
      "fmContribution": 44.6,
      "baselineContribution": 29.32,
      "overall": 45.85
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 3.59,
      "fmScore": 20.18,
      "forceOptScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "fmContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "af-011",
    "input": {
      "packCoverage": 0.54,
      "fmFidelity": 0.49,
      "forceClarity": 0.49,
      "runStability": 0.57,
      "classicalFfRate": 0.6,
      "ffOptimism": 0.42,
      "reactionHardness": 0.49,
      "overclaimRisk": 0.4,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 47.21,
      "fmScore": 52.75,
      "forceOptScore": 47.19,
      "packIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "fmContribution": 51.41,
      "baselineContribution": 31.82,
      "overall": 51.88
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 17.1,
      "fmScore": 21.62,
      "forceOptScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "fmContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "af-012",
    "input": {
      "packCoverage": 0.5,
      "fmFidelity": 0.48,
      "forceClarity": 0.53,
      "runStability": 0.53,
      "classicalFfRate": 0.56,
      "ffOptimism": 0.37,
      "reactionHardness": 0.42,
      "overclaimRisk": 0.35,
      "forceBias": "force_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 38.19,
      "fmScore": 51.28,
      "forceOptScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "fmContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 13.23,
      "fmScore": 19.68,
      "forceOptScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "fmContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "af-013",
    "input": {
      "packCoverage": 0.54,
      "fmFidelity": 0.52,
      "forceClarity": 0.56,
      "runStability": 0.57,
      "classicalFfRate": 0.6,
      "ffOptimism": 0.39,
      "reactionHardness": 0.42,
      "overclaimRisk": 0.36,
      "forceBias": "baseline_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 29.13,
      "fmScore": 44.88,
      "forceOptScore": 36.59,
      "packIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "fmContribution": 35.78,
      "baselineContribution": 32.8,
      "overall": 36.24
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 22.62,
      "fmScore": 21.35,
      "forceOptScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "fmContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "af-014",
    "input": {
      "packCoverage": 0.58,
      "fmFidelity": 0.56,
      "forceClarity": 0.6,
      "runStability": 0.61,
      "classicalFfRate": 0.63,
      "ffOptimism": 0.4,
      "reactionHardness": 0.43,
      "overclaimRisk": 0.36,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 52.62,
      "fmScore": 58.53,
      "forceOptScore": 56.66,
      "packIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49,
      "fmContribution": 57.86,
      "baselineContribution": 34.8,
      "overall": 57.71
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 20.03,
      "fmScore": 22.2,
      "forceOptScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "fmContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "af-015",
    "input": {
      "packCoverage": 0.62,
      "fmFidelity": 0.54,
      "forceClarity": 0.56,
      "runStability": 0.65,
      "classicalFfRate": 0.67,
      "ffOptimism": 0.36,
      "reactionHardness": 0.44,
      "overclaimRisk": 0.31,
      "forceBias": "fm_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 45.9,
      "fmScore": 58.35,
      "forceOptScore": 39.3,
      "packIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "fmContribution": 54.53,
      "baselineContribution": 36.22,
      "overall": 55.23
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 9.43,
      "fmScore": 21.14,
      "forceOptScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "fmContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "af-016",
    "input": {
      "packCoverage": 0.58,
      "fmFidelity": 0.59,
      "forceClarity": 0.6,
      "runStability": 0.6,
      "classicalFfRate": 0.63,
      "ffOptimism": 0.37,
      "reactionHardness": 0.36,
      "overclaimRisk": 0.32,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 54.46,
      "fmScore": 60.67,
      "forceOptScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "fmContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 22.05,
      "fmScore": 21.91,
      "forceOptScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "fmContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "af-017",
    "input": {
      "packCoverage": 0.62,
      "fmFidelity": 0.63,
      "forceClarity": 0.63,
      "runStability": 0.64,
      "classicalFfRate": 0.67,
      "ffOptimism": 0.39,
      "reactionHardness": 0.37,
      "overclaimRisk": 0.33,
      "forceBias": "force_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 48.43,
      "fmScore": 64.28,
      "forceOptScore": 75.13,
      "packIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "fmContribution": 60.66,
      "baselineContribution": 38.61,
      "overall": 60.69
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 18.73,
      "fmScore": 23.42,
      "forceOptScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "fmContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "af-018",
    "input": {
      "packCoverage": 0.66,
      "fmFidelity": 0.61,
      "forceClarity": 0.67,
      "runStability": 0.68,
      "classicalFfRate": 0.7,
      "ffOptimism": 0.34,
      "reactionHardness": 0.38,
      "overclaimRisk": 0.27,
      "forceBias": "baseline_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 38.33,
      "fmScore": 54.13,
      "forceOptScore": 45.52,
      "packIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "fmContribution": 44.52,
      "baselineContribution": 39.16,
      "overall": 44.56
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 28.36,
      "fmScore": 21.66,
      "forceOptScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "fmContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "af-019",
    "input": {
      "packCoverage": 0.7,
      "fmFidelity": 0.65,
      "forceClarity": 0.7,
      "runStability": 0.72,
      "classicalFfRate": 0.74,
      "ffOptimism": 0.36,
      "reactionHardness": 0.38,
      "overclaimRisk": 0.28,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 63.81,
      "fmScore": 67.74,
      "forceOptScore": 68.17,
      "packIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "fmContribution": 68.45,
      "baselineContribution": 42.25,
      "overall": 67.73
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 26.25,
      "fmScore": 23.32,
      "forceOptScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "fmContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "af-020",
    "input": {
      "packCoverage": 0.66,
      "fmFidelity": 0.7,
      "forceClarity": 0.66,
      "runStability": 0.68,
      "classicalFfRate": 0.7,
      "ffOptimism": 0.37,
      "reactionHardness": 0.31,
      "overclaimRisk": 0.29,
      "forceBias": "fm_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 52.86,
      "fmScore": 70.06,
      "forceOptScore": 45.74,
      "packIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "fmContribution": 62.46,
      "baselineContribution": 41.54,
      "overall": 62.69
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 13.66,
      "fmScore": 23.93,
      "forceOptScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "fmContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "af-021",
    "input": {
      "packCoverage": 0.7,
      "fmFidelity": 0.68,
      "forceClarity": 0.7,
      "runStability": 0.72,
      "classicalFfRate": 0.73,
      "ffOptimism": 0.33,
      "reactionHardness": 0.31,
      "overclaimRisk": 0.24,
      "forceBias": "balanced",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 65.6,
      "fmScore": 69.88,
      "forceOptScore": 69.32,
      "packIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "fmContribution": 69.92,
      "baselineContribution": 42.54,
      "overall": 68.99
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 27.89,
      "fmScore": 22.72,
      "forceOptScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "fmContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "af-022",
    "input": {
      "packCoverage": 0.74,
      "fmFidelity": 0.72,
      "forceClarity": 0.73,
      "runStability": 0.76,
      "classicalFfRate": 0.77,
      "ffOptimism": 0.34,
      "reactionHardness": 0.32,
      "overclaimRisk": 0.25,
      "forceBias": "force_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 57.62,
      "fmScore": 73.52,
      "forceOptScore": 88.86,
      "packIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "fmContribution": 70.82,
      "baselineContribution": 45.15,
      "overall": 70.2
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 24.57,
      "fmScore": 23.79,
      "forceOptScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "fmContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "af-023",
    "input": {
      "packCoverage": 0.79,
      "fmFidelity": 0.76,
      "forceClarity": 0.77,
      "runStability": 0.8,
      "classicalFfRate": 0.81,
      "ffOptimism": 0.36,
      "reactionHardness": 0.33,
      "overclaimRisk": 0.25,
      "forceBias": "baseline_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 49.04,
      "fmScore": 67.38,
      "forceOptScore": 53.74,
      "packIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "fmContribution": 54.86,
      "baselineContribution": 48.03,
      "overall": 54.63
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 33.86,
      "fmScore": 25.25,
      "forceOptScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "fmContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "af-024",
    "input": {
      "packCoverage": 0.75,
      "fmFidelity": 0.75,
      "forceClarity": 0.81,
      "runStability": 0.76,
      "classicalFfRate": 0.77,
      "ffOptimism": 0.31,
      "reactionHardness": 0.25,
      "overclaimRisk": 0.2,
      "forceBias": "balanced",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 71.55,
      "fmScore": 75.91,
      "forceOptScore": 78.99,
      "packIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "fmContribution": 76.66,
      "baselineContribution": 46.07,
      "overall": 75.15
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 31.21,
      "fmScore": 23.36,
      "forceOptScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "fmContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "af-025",
    "input": {
      "packCoverage": 0.79,
      "fmFidelity": 0.79,
      "forceClarity": 0.77,
      "runStability": 0.8,
      "classicalFfRate": 0.8,
      "ffOptimism": 0.33,
      "reactionHardness": 0.26,
      "overclaimRisk": 0.21,
      "forceBias": "fm_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 62.51,
      "fmScore": 79.52,
      "forceOptScore": 54.86,
      "packIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "fmContribution": 72.7,
      "baselineContribution": 48.27,
      "overall": 72.3
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 19.5,
      "fmScore": 24.6,
      "forceOptScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "fmContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "af-026",
    "input": {
      "packCoverage": 0.83,
      "fmFidelity": 0.83,
      "forceClarity": 0.8,
      "runStability": 0.83,
      "classicalFfRate": 0.84,
      "ffOptimism": 0.34,
      "reactionHardness": 0.27,
      "overclaimRisk": 0.22,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 78.52,
      "fmScore": 83.17,
      "forceOptScore": 80.3,
      "packIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73,
      "fmContribution": 82.15,
      "baselineContribution": 50.87,
      "overall": 80.52
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 33.17,
      "fmScore": 25.67,
      "forceOptScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "fmContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "af-027",
    "input": {
      "packCoverage": 0.87,
      "fmFidelity": 0.81,
      "forceClarity": 0.84,
      "runStability": 0.87,
      "classicalFfRate": 0.88,
      "ffOptimism": 0.3,
      "reactionHardness": 0.27,
      "overclaimRisk": 0.17,
      "forceBias": "force_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 67.26,
      "fmScore": 82.98,
      "forceOptScore": 100,
      "packIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "fmContribution": 80.38,
      "baselineContribution": 52.5,
      "overall": 79.36
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 30.78,
      "fmScore": 24.7,
      "forceOptScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "fmContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "af-028",
    "input": {
      "packCoverage": 0.83,
      "fmFidelity": 0.86,
      "forceClarity": 0.87,
      "runStability": 0.83,
      "classicalFfRate": 0.84,
      "ffOptimism": 0.31,
      "reactionHardness": 0.2,
      "overclaimRisk": 0.17,
      "forceBias": "baseline_first",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 54.87,
      "fmScore": 75.3,
      "forceOptScore": 60.62,
      "packIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "fmContribution": 61.08,
      "baselineContribution": 51.73,
      "overall": 60.4
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 38.81,
      "fmScore": 25.25,
      "forceOptScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "fmContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "af-029",
    "input": {
      "packCoverage": 0.87,
      "fmFidelity": 0.9,
      "forceClarity": 0.91,
      "runStability": 0.87,
      "classicalFfRate": 0.87,
      "ffOptimism": 0.33,
      "reactionHardness": 0.2,
      "overclaimRisk": 0.18,
      "forceBias": "balanced",
      "profile": "foundation_model_atomistics"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 83.89,
      "fmScore": 88.91,
      "forceOptScore": 89.72,
      "packIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "fmContribution": 88.57,
      "baselineContribution": 54.16,
      "overall": 86.38
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 36.33,
      "fmScore": 26.6,
      "forceOptScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "fmContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "af-030",
    "input": {
      "packCoverage": 0.91,
      "fmFidelity": 0.88,
      "forceClarity": 0.87,
      "runStability": 0.91,
      "classicalFfRate": 0.91,
      "ffOptimism": 0.28,
      "reactionHardness": 0.21,
      "overclaimRisk": 0.13,
      "forceBias": "fm_first",
      "profile": "classical_force_field_baseline"
    },
    "expectedFoundation": {
      "mode": "foundation_model_atomistics",
      "packCoverageScore": 71.59,
      "fmScore": 88.77,
      "forceOptScore": 63.26,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "fmContribution": 79.63,
      "baselineContribution": 55.31,
      "overall": 79.25
    },
    "expectedBaseline": {
      "mode": "classical_force_field_baseline",
      "packCoverageScore": 25.72,
      "fmScore": 25.06,
      "forceOptScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "fmContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
