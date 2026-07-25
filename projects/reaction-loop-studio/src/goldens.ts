import type { ReactionInput, ReactionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReactionInput;
  expectedChemistInLoop: ReactionQuality;
  expectedOpenLoop: ReactionQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "rl-001",
    "input": {
      "packCoverage": 0.29,
      "reagentFidelity": 0.25,
      "loopClarity": 0.28,
      "runStability": 0.34,
      "openLoopPassRate": 0.39,
      "skipOptimism": 0.45,
      "conditionHardness": 0.59,
      "overclaimRisk": 0.5,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 22.56,
      "chemistGateScore": 30.25,
      "loopOptScore": 23.49,
      "packIntegrity": 37.64,
      "openLoopScore": 16.4,
      "confidence": 19.35,
      "loopContribution": 27.98,
      "openLoopContribution": 15.96,
      "overall": 29.82
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 5.76,
      "chemistGateScore": 17.09,
      "loopOptScore": 13.13,
      "packIntegrity": 32.39,
      "openLoopScore": 40.93,
      "confidence": 17.1,
      "loopContribution": 21.86,
      "openLoopContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "rl-002",
    "input": {
      "packCoverage": 0.33,
      "reagentFidelity": 0.29,
      "loopClarity": 0.32,
      "runStability": 0.38,
      "openLoopPassRate": 0.43,
      "skipOptimism": 0.46,
      "conditionHardness": 0.6,
      "overclaimRisk": 0.51,
      "loopBias": "policy_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 22.22,
      "chemistGateScore": 33.9,
      "loopOptScore": 34.39,
      "packIntegrity": 31.9,
      "openLoopScore": 18.89,
      "confidence": 23,
      "loopContribution": 30.56,
      "openLoopContribution": 18.61,
      "overall": 32.41
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 2.43,
      "chemistGateScore": 18.22,
      "loopOptScore": 14.16,
      "packIntegrity": 34.08,
      "openLoopScore": 31.53,
      "confidence": 18.65,
      "loopContribution": 20.08,
      "openLoopContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "rl-003",
    "input": {
      "packCoverage": 0.37,
      "reagentFidelity": 0.27,
      "loopClarity": 0.36,
      "runStability": 0.42,
      "openLoopPassRate": 0.46,
      "skipOptimism": 0.42,
      "conditionHardness": 0.6,
      "overclaimRisk": 0.46,
      "loopBias": "open_loop_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 12.18,
      "chemistGateScore": 23.71,
      "loopOptScore": 20.95,
      "packIntegrity": 19.24,
      "openLoopScore": 19.94,
      "confidence": 25.6,
      "loopContribution": 18.96,
      "openLoopContribution": 19.69,
      "overall": 20.09
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 12.17,
      "chemistGateScore": 17.1,
      "loopOptScore": 13.13,
      "packIntegrity": 33.93,
      "openLoopScore": 54.34,
      "confidence": 18.4,
      "loopContribution": 26.13,
      "openLoopContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "rl-004",
    "input": {
      "packCoverage": 0.33,
      "reagentFidelity": 0.32,
      "loopClarity": 0.39,
      "runStability": 0.38,
      "openLoopPassRate": 0.42,
      "skipOptimism": 0.43,
      "conditionHardness": 0.53,
      "overclaimRisk": 0.46,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 28.09,
      "chemistGateScore": 36.03,
      "loopOptScore": 33.07,
      "packIntegrity": 42.23,
      "openLoopScore": 18.93,
      "confidence": 26.1,
      "loopContribution": 34.5,
      "openLoopContribution": 19.05,
      "overall": 35.72
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 8.7,
      "chemistGateScore": 17.81,
      "loopOptScore": 13.75,
      "packIntegrity": 32.79,
      "openLoopScore": 42.77,
      "confidence": 18.85,
      "loopContribution": 23.16,
      "openLoopContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "rl-005",
    "input": {
      "packCoverage": 0.37,
      "reagentFidelity": 0.36,
      "loopClarity": 0.35,
      "runStability": 0.42,
      "openLoopPassRate": 0.46,
      "skipOptimism": 0.45,
      "conditionHardness": 0.53,
      "overclaimRisk": 0.47,
      "loopBias": "chemist_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 26.86,
      "chemistGateScore": 39.64,
      "loopOptScore": 21.39,
      "packIntegrity": 54.3,
      "openLoopScore": 21.8,
      "confidence": 27.6,
      "loopContribution": 34.43,
      "openLoopContribution": 22.19,
      "overall": 36.23
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 0,
      "chemistGateScore": 19.51,
      "loopOptScore": 15.76,
      "packIntegrity": 34.77,
      "openLoopScore": 32.95,
      "confidence": 21.05,
      "loopContribution": 20.6,
      "openLoopContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "rl-006",
    "input": {
      "packCoverage": 0.41,
      "reagentFidelity": 0.34,
      "loopClarity": 0.39,
      "runStability": 0.45,
      "openLoopPassRate": 0.5,
      "skipOptimism": 0.4,
      "conditionHardness": 0.54,
      "overclaimRisk": 0.42,
      "loopBias": "balanced",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 33.94,
      "chemistGateScore": 39.5,
      "loopOptScore": 35.84,
      "packIntegrity": 47.85,
      "openLoopScore": 23.08,
      "confidence": 30.35,
      "loopContribution": 38.87,
      "openLoopContribution": 23.38,
      "overall": 40.08
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 11.98,
      "chemistGateScore": 18.04,
      "loopOptScore": 14.31,
      "packIntegrity": 34.78,
      "openLoopScore": 46.72,
      "confidence": 20.5,
      "loopContribution": 25.17,
      "openLoopContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "rl-007",
    "input": {
      "packCoverage": 0.45,
      "reagentFidelity": 0.38,
      "loopClarity": 0.42,
      "runStability": 0.49,
      "openLoopPassRate": 0.53,
      "skipOptimism": 0.42,
      "conditionHardness": 0.55,
      "overclaimRisk": 0.43,
      "loopBias": "policy_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 31.59,
      "chemistGateScore": 43.11,
      "loopOptScore": 48.37,
      "packIntegrity": 39.34,
      "openLoopScore": 25.15,
      "confidence": 33.6,
      "loopContribution": 40.76,
      "openLoopContribution": 25.64,
      "overall": 42.04
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 8.27,
      "chemistGateScore": 19.34,
      "loopOptScore": 15.59,
      "packIntegrity": 36.3,
      "openLoopScore": 34.2,
      "confidence": 22.15,
      "loopContribution": 22.74,
      "openLoopContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "rl-008",
    "input": {
      "packCoverage": 0.41,
      "reagentFidelity": 0.43,
      "loopClarity": 0.46,
      "runStability": 0.45,
      "openLoopPassRate": 0.49,
      "skipOptimism": 0.43,
      "conditionHardness": 0.47,
      "overclaimRisk": 0.44,
      "loopBias": "open_loop_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 19.33,
      "chemistGateScore": 35.43,
      "loopOptScore": 27.62,
      "packIntegrity": 24.76,
      "openLoopScore": 24.32,
      "confidence": 34.35,
      "loopContribution": 26.71,
      "openLoopContribution": 25.23,
      "overall": 27.44
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 16.4,
      "chemistGateScore": 20.18,
      "loopOptScore": 16.31,
      "packIntegrity": 35.17,
      "openLoopScore": 58.5,
      "confidence": 22.7,
      "loopContribution": 29.31,
      "openLoopContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "rl-009",
    "input": {
      "packCoverage": 0.46,
      "reagentFidelity": 0.41,
      "loopClarity": 0.5,
      "runStability": 0.49,
      "openLoopPassRate": 0.53,
      "skipOptimism": 0.39,
      "conditionHardness": 0.48,
      "overclaimRisk": 0.38,
      "loopBias": "balanced",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 40.05,
      "chemistGateScore": 45.49,
      "loopOptScore": 45.68,
      "packIntegrity": 52.59,
      "openLoopScore": 25.81,
      "confidence": 37.35,
      "loopContribution": 45.69,
      "openLoopContribution": 26.69,
      "overall": 46.27
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 14.91,
      "chemistGateScore": 19.07,
      "loopOptScore": 15.29,
      "packIntegrity": 35.36,
      "openLoopScore": 48.88,
      "confidence": 22.7,
      "loopContribution": 26.7,
      "openLoopContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "rl-010",
    "input": {
      "packCoverage": 0.5,
      "reagentFidelity": 0.45,
      "loopClarity": 0.46,
      "runStability": 0.53,
      "openLoopPassRate": 0.57,
      "skipOptimism": 0.4,
      "conditionHardness": 0.49,
      "overclaimRisk": 0.39,
      "loopBias": "chemist_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 36.62,
      "chemistGateScore": 49.14,
      "loopOptScore": 30.65,
      "packIntegrity": 66.82,
      "openLoopScore": 28.29,
      "confidence": 39,
      "loopContribution": 44.6,
      "openLoopContribution": 29.32,
      "overall": 45.85
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 3.59,
      "chemistGateScore": 20.18,
      "loopOptScore": 16.7,
      "packIntegrity": 37.06,
      "openLoopScore": 35.54,
      "confidence": 24.25,
      "loopContribution": 22.61,
      "openLoopContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "rl-011",
    "input": {
      "packCoverage": 0.54,
      "reagentFidelity": 0.49,
      "loopClarity": 0.49,
      "runStability": 0.57,
      "openLoopPassRate": 0.6,
      "skipOptimism": 0.42,
      "conditionHardness": 0.49,
      "overclaimRisk": 0.4,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 47.21,
      "chemistGateScore": 52.75,
      "loopOptScore": 47.19,
      "packIntegrity": 60.27,
      "openLoopScore": 30.54,
      "confidence": 42.25,
      "loopContribution": 51.41,
      "openLoopContribution": 31.82,
      "overall": 51.88
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 17.1,
      "chemistGateScore": 21.62,
      "loopOptScore": 18.14,
      "packIntegrity": 38.58,
      "openLoopScore": 54.12,
      "confidence": 26.1,
      "loopContribution": 29.91,
      "openLoopContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "rl-012",
    "input": {
      "packCoverage": 0.5,
      "reagentFidelity": 0.48,
      "loopClarity": 0.53,
      "runStability": 0.53,
      "openLoopPassRate": 0.56,
      "skipOptimism": 0.37,
      "conditionHardness": 0.42,
      "overclaimRisk": 0.35,
      "loopBias": "policy_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 38.19,
      "chemistGateScore": 51.28,
      "loopOptScore": 61.94,
      "packIntegrity": 43.82,
      "openLoopScore": 28.34,
      "confidence": 42.1,
      "loopContribution": 49.22,
      "openLoopContribution": 29.7,
      "overall": 49.71
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 13.23,
      "chemistGateScore": 19.68,
      "loopOptScore": 16.17,
      "packIntegrity": 35.76,
      "openLoopScore": 34.93,
      "confidence": 24.35,
      "loopContribution": 23.95,
      "openLoopContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "rl-013",
    "input": {
      "packCoverage": 0.54,
      "reagentFidelity": 0.52,
      "loopClarity": 0.56,
      "runStability": 0.57,
      "openLoopPassRate": 0.6,
      "skipOptimism": 0.39,
      "conditionHardness": 0.42,
      "overclaimRisk": 0.36,
      "loopBias": "open_loop_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 29.13,
      "chemistGateScore": 44.88,
      "loopOptScore": 36.59,
      "packIntegrity": 32.66,
      "openLoopScore": 31.2,
      "confidence": 45.35,
      "loopContribution": 35.78,
      "openLoopContribution": 32.8,
      "overall": 36.24
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 22.62,
      "chemistGateScore": 21.35,
      "loopOptScore": 17.8,
      "packIntegrity": 37.74,
      "openLoopScore": 67.02,
      "confidence": 26.55,
      "loopContribution": 33.31,
      "openLoopContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "rl-014",
    "input": {
      "packCoverage": 0.58,
      "reagentFidelity": 0.56,
      "loopClarity": 0.6,
      "runStability": 0.61,
      "openLoopPassRate": 0.63,
      "skipOptimism": 0.4,
      "conditionHardness": 0.43,
      "overclaimRisk": 0.36,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 52.62,
      "chemistGateScore": 58.53,
      "loopOptScore": 56.66,
      "packIntegrity": 64.86,
      "openLoopScore": 33.07,
      "confidence": 49,
      "loopContribution": 57.86,
      "openLoopContribution": 34.8,
      "overall": 57.71
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 20.03,
      "chemistGateScore": 22.2,
      "loopOptScore": 18.59,
      "packIntegrity": 38.98,
      "openLoopScore": 55.96,
      "confidence": 27.85,
      "loopContribution": 31.15,
      "openLoopContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "rl-015",
    "input": {
      "packCoverage": 0.62,
      "reagentFidelity": 0.54,
      "loopClarity": 0.56,
      "runStability": 0.65,
      "openLoopPassRate": 0.67,
      "skipOptimism": 0.36,
      "conditionHardness": 0.44,
      "overclaimRisk": 0.31,
      "loopBias": "chemist_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 45.9,
      "chemistGateScore": 58.35,
      "loopOptScore": 39.3,
      "packIntegrity": 79.94,
      "openLoopScore": 34.55,
      "confidence": 49.6,
      "loopContribution": 54.53,
      "openLoopContribution": 36.22,
      "overall": 55.23
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 9.43,
      "chemistGateScore": 21.14,
      "loopOptScore": 17.93,
      "packIntegrity": 39.27,
      "openLoopScore": 38.2,
      "confidence": 27.75,
      "loopContribution": 25.19,
      "openLoopContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "rl-016",
    "input": {
      "packCoverage": 0.58,
      "reagentFidelity": 0.59,
      "loopClarity": 0.6,
      "runStability": 0.6,
      "openLoopPassRate": 0.63,
      "skipOptimism": 0.37,
      "conditionHardness": 0.36,
      "overclaimRisk": 0.32,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 54.46,
      "chemistGateScore": 60.67,
      "loopOptScore": 57.87,
      "packIntegrity": 65.05,
      "openLoopScore": 33.73,
      "confidence": 50.35,
      "loopContribution": 59.24,
      "openLoopContribution": 35.76,
      "overall": 59.01
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 22.05,
      "chemistGateScore": 21.91,
      "loopOptScore": 18.56,
      "packIntegrity": 38.14,
      "openLoopScore": 55.7,
      "confidence": 28.3,
      "loopContribution": 31.27,
      "openLoopContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "rl-017",
    "input": {
      "packCoverage": 0.62,
      "reagentFidelity": 0.63,
      "loopClarity": 0.63,
      "runStability": 0.64,
      "openLoopPassRate": 0.67,
      "skipOptimism": 0.39,
      "conditionHardness": 0.37,
      "overclaimRisk": 0.33,
      "loopBias": "policy_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 48.43,
      "chemistGateScore": 64.28,
      "loopOptScore": 75.13,
      "packIntegrity": 52.76,
      "openLoopScore": 36.41,
      "confidence": 53.6,
      "loopContribution": 60.66,
      "openLoopContribution": 38.61,
      "overall": 60.69
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 18.73,
      "chemistGateScore": 23.42,
      "loopOptScore": 20,
      "packIntegrity": 40.11,
      "openLoopScore": 39.86,
      "confidence": 30.3,
      "loopContribution": 28.42,
      "openLoopContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "rl-018",
    "input": {
      "packCoverage": 0.66,
      "reagentFidelity": 0.61,
      "loopClarity": 0.67,
      "runStability": 0.68,
      "openLoopPassRate": 0.7,
      "skipOptimism": 0.34,
      "conditionHardness": 0.38,
      "overclaimRisk": 0.27,
      "loopBias": "open_loop_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 38.33,
      "chemistGateScore": 54.13,
      "loopOptScore": 45.52,
      "packIntegrity": 40.09,
      "openLoopScore": 37.08,
      "confidence": 56.35,
      "loopContribution": 44.52,
      "openLoopContribution": 39.16,
      "overall": 44.56
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 28.36,
      "chemistGateScore": 21.66,
      "loopOptScore": 18.31,
      "packIntegrity": 39.67,
      "openLoopScore": 74.27,
      "confidence": 29.5,
      "loopContribution": 36.45,
      "openLoopContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "rl-019",
    "input": {
      "packCoverage": 0.7,
      "reagentFidelity": 0.65,
      "loopClarity": 0.7,
      "runStability": 0.72,
      "openLoopPassRate": 0.74,
      "skipOptimism": 0.36,
      "conditionHardness": 0.38,
      "overclaimRisk": 0.28,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 63.81,
      "chemistGateScore": 67.74,
      "loopOptScore": 68.17,
      "packIntegrity": 75.07,
      "openLoopScore": 39.94,
      "confidence": 59.6,
      "loopContribution": 68.45,
      "openLoopContribution": 42.25,
      "overall": 67.73
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 26.25,
      "chemistGateScore": 23.32,
      "loopOptScore": 19.92,
      "packIntegrity": 41.65,
      "openLoopScore": 62.07,
      "confidence": 31.7,
      "loopContribution": 34.64,
      "openLoopContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "rl-020",
    "input": {
      "packCoverage": 0.66,
      "reagentFidelity": 0.7,
      "loopClarity": 0.66,
      "runStability": 0.68,
      "openLoopPassRate": 0.7,
      "skipOptimism": 0.37,
      "conditionHardness": 0.31,
      "overclaimRisk": 0.29,
      "loopBias": "chemist_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 52.86,
      "chemistGateScore": 70.06,
      "loopOptScore": 45.74,
      "packIntegrity": 86.81,
      "openLoopScore": 38.94,
      "confidence": 58.35,
      "loopContribution": 62.46,
      "openLoopContribution": 41.54,
      "overall": 62.69
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 13.66,
      "chemistGateScore": 23.93,
      "loopOptScore": 20.75,
      "packIntegrity": 40.51,
      "openLoopScore": 40.86,
      "confidence": 32.05,
      "loopContribution": 27.94,
      "openLoopContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "rl-021",
    "input": {
      "packCoverage": 0.7,
      "reagentFidelity": 0.68,
      "loopClarity": 0.7,
      "runStability": 0.72,
      "openLoopPassRate": 0.73,
      "skipOptimism": 0.33,
      "conditionHardness": 0.31,
      "overclaimRisk": 0.24,
      "loopBias": "balanced",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 65.6,
      "chemistGateScore": 69.88,
      "loopOptScore": 69.32,
      "packIntegrity": 75.82,
      "openLoopScore": 39.99,
      "confidence": 60.95,
      "loopContribution": 69.92,
      "openLoopContribution": 42.54,
      "overall": 68.99
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 27.89,
      "chemistGateScore": 22.72,
      "loopOptScore": 19.62,
      "packIntegrity": 40.35,
      "openLoopScore": 61.19,
      "confidence": 31.8,
      "loopContribution": 34.35,
      "openLoopContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "rl-022",
    "input": {
      "packCoverage": 0.74,
      "reagentFidelity": 0.72,
      "loopClarity": 0.73,
      "runStability": 0.76,
      "openLoopPassRate": 0.77,
      "skipOptimism": 0.34,
      "conditionHardness": 0.32,
      "overclaimRisk": 0.25,
      "loopBias": "policy_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 57.62,
      "chemistGateScore": 73.52,
      "loopOptScore": 88.86,
      "packIntegrity": 60.51,
      "openLoopScore": 42.47,
      "confidence": 64.35,
      "loopContribution": 70.82,
      "openLoopContribution": 45.15,
      "overall": 70.2
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 24.57,
      "chemistGateScore": 23.79,
      "loopOptScore": 20.63,
      "packIntegrity": 42.05,
      "openLoopScore": 42.21,
      "confidence": 33.35,
      "loopContribution": 30.65,
      "openLoopContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "rl-023",
    "input": {
      "packCoverage": 0.79,
      "reagentFidelity": 0.76,
      "loopClarity": 0.77,
      "runStability": 0.8,
      "openLoopPassRate": 0.81,
      "skipOptimism": 0.36,
      "conditionHardness": 0.33,
      "overclaimRisk": 0.25,
      "loopBias": "open_loop_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 49.04,
      "chemistGateScore": 67.38,
      "loopOptScore": 53.74,
      "packIntegrity": 49.49,
      "openLoopScore": 45.16,
      "confidence": 68.25,
      "loopContribution": 54.86,
      "openLoopContribution": 48.03,
      "overall": 54.63
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 33.86,
      "chemistGateScore": 25.25,
      "loopOptScore": 22.05,
      "packIntegrity": 43.92,
      "openLoopScore": 84.72,
      "confidence": 35.45,
      "loopContribution": 41.96,
      "openLoopContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "rl-024",
    "input": {
      "packCoverage": 0.75,
      "reagentFidelity": 0.75,
      "loopClarity": 0.81,
      "runStability": 0.76,
      "openLoopPassRate": 0.77,
      "skipOptimism": 0.31,
      "conditionHardness": 0.25,
      "overclaimRisk": 0.2,
      "loopBias": "balanced",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 71.55,
      "chemistGateScore": 75.91,
      "loopOptScore": 78.99,
      "packIntegrity": 80.56,
      "openLoopScore": 43.13,
      "confidence": 68.1,
      "loopContribution": 76.66,
      "openLoopContribution": 46.07,
      "overall": 75.15
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 31.21,
      "chemistGateScore": 23.36,
      "loopOptScore": 20.13,
      "packIntegrity": 41.11,
      "openLoopScore": 63.65,
      "confidence": 33.9,
      "loopContribution": 35.89,
      "openLoopContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "rl-025",
    "input": {
      "packCoverage": 0.79,
      "reagentFidelity": 0.79,
      "loopClarity": 0.77,
      "runStability": 0.8,
      "openLoopPassRate": 0.8,
      "skipOptimism": 0.33,
      "conditionHardness": 0.26,
      "overclaimRisk": 0.21,
      "loopBias": "chemist_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 62.51,
      "chemistGateScore": 79.52,
      "loopOptScore": 54.86,
      "packIntegrity": 100,
      "openLoopScore": 45.2,
      "confidence": 69.6,
      "loopContribution": 72.7,
      "openLoopContribution": 48.27,
      "overall": 72.3
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 19.5,
      "chemistGateScore": 24.6,
      "loopOptScore": 21.69,
      "packIntegrity": 42.63,
      "openLoopScore": 43.52,
      "confidence": 35.55,
      "loopContribution": 30.39,
      "openLoopContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "rl-026",
    "input": {
      "packCoverage": 0.83,
      "reagentFidelity": 0.83,
      "loopClarity": 0.8,
      "runStability": 0.83,
      "openLoopPassRate": 0.84,
      "skipOptimism": 0.34,
      "conditionHardness": 0.27,
      "overclaimRisk": 0.22,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 78.52,
      "chemistGateScore": 83.17,
      "loopOptScore": 80.3,
      "packIntegrity": 87.68,
      "openLoopScore": 47.68,
      "confidence": 73,
      "loopContribution": 82.15,
      "openLoopContribution": 50.87,
      "overall": 80.52
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 33.17,
      "chemistGateScore": 25.67,
      "loopOptScore": 22.7,
      "packIntegrity": 44.32,
      "openLoopScore": 68.8,
      "confidence": 37.1,
      "loopContribution": 38.93,
      "openLoopContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "rl-027",
    "input": {
      "packCoverage": 0.87,
      "reagentFidelity": 0.81,
      "loopClarity": 0.84,
      "runStability": 0.87,
      "openLoopPassRate": 0.88,
      "skipOptimism": 0.3,
      "conditionHardness": 0.27,
      "overclaimRisk": 0.17,
      "loopBias": "policy_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 67.26,
      "chemistGateScore": 82.98,
      "loopOptScore": 100,
      "packIntegrity": 68.1,
      "openLoopScore": 49.35,
      "confidence": 75.6,
      "loopContribution": 80.38,
      "openLoopContribution": 52.5,
      "overall": 79.36
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 30.78,
      "chemistGateScore": 24.7,
      "loopOptScore": 21.75,
      "packIntegrity": 44.62,
      "openLoopScore": 45.22,
      "confidence": 37.2,
      "loopContribution": 33.41,
      "openLoopContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "rl-028",
    "input": {
      "packCoverage": 0.83,
      "reagentFidelity": 0.86,
      "loopClarity": 0.87,
      "runStability": 0.83,
      "openLoopPassRate": 0.84,
      "skipOptimism": 0.31,
      "conditionHardness": 0.2,
      "overclaimRisk": 0.17,
      "loopBias": "open_loop_first",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 54.87,
      "chemistGateScore": 75.3,
      "loopOptScore": 60.62,
      "packIntegrity": 53.51,
      "openLoopScore": 48.34,
      "confidence": 76.1,
      "loopContribution": 61.08,
      "openLoopContribution": 51.73,
      "overall": 60.4
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 38.81,
      "chemistGateScore": 25.25,
      "loopOptScore": 22.17,
      "packIntegrity": 43.48,
      "openLoopScore": 86.95,
      "confidence": 37.65,
      "loopContribution": 43.33,
      "openLoopContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "rl-029",
    "input": {
      "packCoverage": 0.87,
      "reagentFidelity": 0.9,
      "loopClarity": 0.91,
      "runStability": 0.87,
      "openLoopPassRate": 0.87,
      "skipOptimism": 0.33,
      "conditionHardness": 0.2,
      "overclaimRisk": 0.18,
      "loopBias": "balanced",
      "profile": "chemist_in_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 83.89,
      "chemistGateScore": 88.91,
      "loopOptScore": 89.72,
      "packIntegrity": 92.27,
      "openLoopScore": 50.59,
      "confidence": 79.6,
      "loopContribution": 88.57,
      "openLoopContribution": 54.16,
      "overall": 86.38
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 36.33,
      "chemistGateScore": 26.6,
      "loopOptScore": 23.46,
      "packIntegrity": 45,
      "openLoopScore": 71.06,
      "confidence": 39.5,
      "loopContribution": 40.49,
      "openLoopContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "rl-030",
    "input": {
      "packCoverage": 0.91,
      "reagentFidelity": 0.88,
      "loopClarity": 0.87,
      "runStability": 0.91,
      "openLoopPassRate": 0.91,
      "skipOptimism": 0.28,
      "conditionHardness": 0.21,
      "overclaimRisk": 0.13,
      "loopBias": "chemist_first",
      "profile": "open_loop_vlm"
    },
    "expectedChemistInLoop": {
      "mode": "chemist_in_loop_vlm",
      "conditionCoverage": 71.59,
      "chemistGateScore": 88.77,
      "loopOptScore": 63.26,
      "packIntegrity": 100,
      "openLoopScore": 51.88,
      "confidence": 80.35,
      "loopContribution": 79.63,
      "openLoopContribution": 55.31,
      "overall": 79.25
    },
    "expectedOpenLoop": {
      "mode": "open_loop_vlm",
      "conditionCoverage": 25.72,
      "chemistGateScore": 25.06,
      "loopOptScore": 22.34,
      "packIntegrity": 45.02,
      "openLoopScore": 46.21,
      "confidence": 38.95,
      "loopContribution": 32.87,
      "openLoopContribution": 50.68,
      "overall": 44.3
    }
  }
];
