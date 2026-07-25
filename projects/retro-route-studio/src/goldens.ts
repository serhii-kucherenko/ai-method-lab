import type { RouteInput, RouteQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RouteInput;
  expectedStructured: RouteQuality;
  expectedNaive: RouteQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "rrs-001",
    "input": {
      "memoryCoverage": 0.29,
      "triedPathRecall": 0.25,
      "intermediateCoverage": 0.28,
      "branchAvoidance": 0.34,
      "routeCoherence": 0.3,
      "localGreedyFit": 0.39,
      "singleStepFluency": 0.45,
      "deadEndPressure": 0.59,
      "routeDrift": 0.5,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 23.16,
      "intermediateScore": 32.52,
      "branchScore": 26.91,
      "routeIntegrity": 36.15,
      "greedyLocalScore": 16.4,
      "confidence": 20.75,
      "structuredContribution": 29.31,
      "naiveContribution": 16.6,
      "overall": 31.02
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 5.76,
      "intermediateScore": 17.98,
      "branchScore": 13.8,
      "routeIntegrity": 32.29,
      "greedyLocalScore": 40.93,
      "confidence": 17.1,
      "structuredContribution": 22.15,
      "naiveContribution": 39.03,
      "overall": 27.6
    }
  },
  {
    "id": "rrs-002",
    "input": {
      "memoryCoverage": 0.33,
      "triedPathRecall": 0.29,
      "intermediateCoverage": 0.32,
      "branchAvoidance": 0.38,
      "routeCoherence": 0.34,
      "localGreedyFit": 0.43,
      "singleStepFluency": 0.46,
      "deadEndPressure": 0.6,
      "routeDrift": 0.51,
      "memoryBias": "intermediate_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 22.7,
      "intermediateScore": 36.16,
      "branchScore": 39.16,
      "routeIntegrity": 31.42,
      "greedyLocalScore": 18.89,
      "confidence": 24.4,
      "structuredContribution": 32.46,
      "naiveContribution": 19.24,
      "overall": 34.08
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 2.43,
      "intermediateScore": 19.08,
      "branchScore": 14.8,
      "routeIntegrity": 33.98,
      "greedyLocalScore": 31.53,
      "confidence": 18.65,
      "structuredContribution": 20.36,
      "naiveContribution": 34.95,
      "overall": 23.88
    }
  },
  {
    "id": "rrs-003",
    "input": {
      "memoryCoverage": 0.37,
      "triedPathRecall": 0.27,
      "intermediateCoverage": 0.36,
      "branchAvoidance": 0.42,
      "routeCoherence": 0.32,
      "localGreedyFit": 0.46,
      "singleStepFluency": 0.42,
      "deadEndPressure": 0.6,
      "routeDrift": 0.46,
      "memoryBias": "greedy_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 12.64,
      "intermediateScore": 28.51,
      "branchScore": 20.9,
      "routeIntegrity": 18.41,
      "greedyLocalScore": 19.94,
      "confidence": 24.6,
      "structuredContribution": 20.03,
      "naiveContribution": 20.29,
      "overall": 21.08
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 12.17,
      "intermediateScore": 17.93,
      "branchScore": 13.73,
      "routeIntegrity": 34.43,
      "greedyLocalScore": 54.34,
      "confidence": 18.4,
      "structuredContribution": 26.52,
      "naiveContribution": 46.97,
      "overall": 34.91
    }
  },
  {
    "id": "rrs-004",
    "input": {
      "memoryCoverage": 0.33,
      "triedPathRecall": 0.32,
      "intermediateCoverage": 0.39,
      "branchAvoidance": 0.38,
      "routeCoherence": 0.36,
      "localGreedyFit": 0.42,
      "singleStepFluency": 0.43,
      "deadEndPressure": 0.53,
      "routeDrift": 0.46,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 28.6,
      "intermediateScore": 41.49,
      "branchScore": 32.7,
      "routeIntegrity": 42.86,
      "greedyLocalScore": 18.93,
      "confidence": 26.65,
      "structuredContribution": 35.98,
      "naiveContribution": 19.6,
      "overall": 37.03
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 8.7,
      "intermediateScore": 18.02,
      "branchScore": 14.63,
      "routeIntegrity": 32.49,
      "greedyLocalScore": 42.77,
      "confidence": 18.85,
      "structuredContribution": 23.32,
      "naiveContribution": 40.59,
      "overall": 29.79
    }
  },
  {
    "id": "rrs-005",
    "input": {
      "memoryCoverage": 0.37,
      "triedPathRecall": 0.36,
      "intermediateCoverage": 0.35,
      "branchAvoidance": 0.42,
      "routeCoherence": 0.4,
      "localGreedyFit": 0.46,
      "singleStepFluency": 0.45,
      "deadEndPressure": 0.53,
      "routeDrift": 0.47,
      "memoryBias": "memory_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 27.26,
      "intermediateScore": 39.72,
      "branchScore": 24.14,
      "routeIntegrity": 52.54,
      "greedyLocalScore": 21.8,
      "confidence": 30.15,
      "structuredContribution": 34.94,
      "naiveContribution": 22.71,
      "overall": 36.74
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 0,
      "intermediateScore": 20.33,
      "branchScore": 16.2,
      "routeIntegrity": 34.47,
      "greedyLocalScore": 32.95,
      "confidence": 21.05,
      "structuredContribution": 20.79,
      "naiveContribution": 36.66,
      "overall": 26.11
    }
  },
  {
    "id": "rrs-006",
    "input": {
      "memoryCoverage": 0.41,
      "triedPathRecall": 0.34,
      "intermediateCoverage": 0.39,
      "branchAvoidance": 0.45,
      "routeCoherence": 0.38,
      "localGreedyFit": 0.5,
      "singleStepFluency": 0.4,
      "deadEndPressure": 0.54,
      "routeDrift": 0.42,
      "memoryBias": "balanced",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 34.39,
      "intermediateScore": 42.11,
      "branchScore": 38.27,
      "routeIntegrity": 45.18,
      "greedyLocalScore": 23.08,
      "confidence": 30.25,
      "structuredContribution": 39.7,
      "naiveContribution": 23.87,
      "overall": 40.85
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 11.98,
      "intermediateScore": 18.8,
      "branchScore": 14.74,
      "routeIntegrity": 35.08,
      "greedyLocalScore": 46.72,
      "confidence": 20.5,
      "structuredContribution": 25.46,
      "naiveContribution": 43.51,
      "overall": 32.7
    }
  },
  {
    "id": "rrs-007",
    "input": {
      "memoryCoverage": 0.45,
      "triedPathRecall": 0.38,
      "intermediateCoverage": 0.42,
      "branchAvoidance": 0.49,
      "routeCoherence": 0.42,
      "localGreedyFit": 0.53,
      "singleStepFluency": 0.42,
      "deadEndPressure": 0.55,
      "routeDrift": 0.43,
      "memoryBias": "intermediate_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 31.95,
      "intermediateScore": 45.04,
      "branchScore": 53.01,
      "routeIntegrity": 38.19,
      "greedyLocalScore": 25.15,
      "confidence": 33.75,
      "structuredContribution": 42.36,
      "naiveContribution": 26.11,
      "overall": 43.44
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 8.27,
      "intermediateScore": 20.16,
      "branchScore": 15.94,
      "routeIntegrity": 36.6,
      "greedyLocalScore": 34.2,
      "confidence": 22.15,
      "structuredContribution": 23.03,
      "naiveContribution": 37.81,
      "overall": 27.58
    }
  },
  {
    "id": "rrs-008",
    "input": {
      "memoryCoverage": 0.41,
      "triedPathRecall": 0.43,
      "intermediateCoverage": 0.46,
      "branchAvoidance": 0.45,
      "routeCoherence": 0.46,
      "localGreedyFit": 0.49,
      "singleStepFluency": 0.43,
      "deadEndPressure": 0.47,
      "routeDrift": 0.44,
      "memoryBias": "greedy_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 19.65,
      "intermediateScore": 38.69,
      "branchScore": 28.25,
      "routeIntegrity": 25.82,
      "greedyLocalScore": 24.32,
      "confidence": 35.8,
      "structuredContribution": 27.99,
      "naiveContribution": 25.65,
      "overall": 28.57
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 16.4,
      "intermediateScore": 20.31,
      "branchScore": 16.99,
      "routeIntegrity": 34.67,
      "greedyLocalScore": 58.5,
      "confidence": 22.7,
      "structuredContribution": 29.37,
      "naiveContribution": 51.23,
      "overall": 40.02
    }
  },
  {
    "id": "rrs-009",
    "input": {
      "memoryCoverage": 0.46,
      "triedPathRecall": 0.41,
      "intermediateCoverage": 0.5,
      "branchAvoidance": 0.49,
      "routeCoherence": 0.45,
      "localGreedyFit": 0.53,
      "singleStepFluency": 0.39,
      "deadEndPressure": 0.48,
      "routeDrift": 0.38,
      "memoryBias": "balanced",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 40.41,
      "intermediateScore": 51.29,
      "branchScore": 44.02,
      "routeIntegrity": 52.6,
      "greedyLocalScore": 25.81,
      "confidence": 36.3,
      "structuredContribution": 46.71,
      "naiveContribution": 27.07,
      "overall": 47.17
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 14.91,
      "intermediateScore": 19.23,
      "branchScore": 15.91,
      "routeIntegrity": 35.46,
      "greedyLocalScore": 48.88,
      "confidence": 22.7,
      "structuredContribution": 26.88,
      "naiveContribution": 45.52,
      "overall": 35.3
    }
  },
  {
    "id": "rrs-010",
    "input": {
      "memoryCoverage": 0.5,
      "triedPathRecall": 0.45,
      "intermediateCoverage": 0.46,
      "branchAvoidance": 0.53,
      "routeCoherence": 0.49,
      "localGreedyFit": 0.57,
      "singleStepFluency": 0.4,
      "deadEndPressure": 0.49,
      "routeDrift": 0.39,
      "memoryBias": "memory_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 36.9,
      "intermediateScore": 49.56,
      "branchScore": 32.12,
      "routeIntegrity": 64.04,
      "greedyLocalScore": 28.29,
      "confidence": 39.95,
      "structuredContribution": 44.57,
      "naiveContribution": 29.69,
      "overall": 45.89
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 3.59,
      "intermediateScore": 20.96,
      "branchScore": 16.89,
      "routeIntegrity": 37.16,
      "greedyLocalScore": 35.54,
      "confidence": 24.25,
      "structuredContribution": 22.83,
      "naiveContribution": 39.27,
      "overall": 29.39
    }
  },
  {
    "id": "rrs-011",
    "input": {
      "memoryCoverage": 0.54,
      "triedPathRecall": 0.49,
      "intermediateCoverage": 0.49,
      "branchAvoidance": 0.57,
      "routeCoherence": 0.53,
      "localGreedyFit": 0.6,
      "singleStepFluency": 0.42,
      "deadEndPressure": 0.49,
      "routeDrift": 0.4,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 47.52,
      "intermediateScore": 52.5,
      "branchScore": 51.33,
      "routeIntegrity": 58.03,
      "greedyLocalScore": 30.54,
      "confidence": 43.45,
      "structuredContribution": 52.09,
      "naiveContribution": 32.16,
      "overall": 52.5
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 17.1,
      "intermediateScore": 22.45,
      "branchScore": 18.25,
      "routeIntegrity": 38.68,
      "greedyLocalScore": 54.12,
      "confidence": 26.1,
      "structuredContribution": 30.12,
      "naiveContribution": 50.75,
      "overall": 39.89
    }
  },
  {
    "id": "rrs-012",
    "input": {
      "memoryCoverage": 0.5,
      "triedPathRecall": 0.48,
      "intermediateCoverage": 0.53,
      "branchAvoidance": 0.53,
      "routeCoherence": 0.51,
      "localGreedyFit": 0.56,
      "singleStepFluency": 0.37,
      "deadEndPressure": 0.42,
      "routeDrift": 0.35,
      "memoryBias": "intermediate_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 38.43,
      "intermediateScore": 54.89,
      "branchScore": 61.69,
      "routeIntegrity": 44.46,
      "greedyLocalScore": 28.34,
      "confidence": 42.2,
      "structuredContribution": 50.22,
      "naiveContribution": 30.01,
      "overall": 50.58
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 13.23,
      "intermediateScore": 19.83,
      "branchScore": 16.64,
      "routeIntegrity": 35.66,
      "greedyLocalScore": 34.93,
      "confidence": 24.35,
      "structuredContribution": 24.06,
      "naiveContribution": 38.36,
      "overall": 29.75
    }
  },
  {
    "id": "rrs-013",
    "input": {
      "memoryCoverage": 0.54,
      "triedPathRecall": 0.52,
      "intermediateCoverage": 0.56,
      "branchAvoidance": 0.57,
      "routeCoherence": 0.55,
      "localGreedyFit": 0.6,
      "singleStepFluency": 0.39,
      "deadEndPressure": 0.42,
      "routeDrift": 0.36,
      "memoryBias": "greedy_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 29.35,
      "intermediateScore": 47.82,
      "branchScore": 36.68,
      "routeIntegrity": 33.04,
      "greedyLocalScore": 31.2,
      "confidence": 45.7,
      "structuredContribution": 36.65,
      "naiveContribution": 33.09,
      "overall": 37.01
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 22.62,
      "intermediateScore": 21.56,
      "branchScore": 18.19,
      "routeIntegrity": 37.64,
      "greedyLocalScore": 67.02,
      "confidence": 26.55,
      "structuredContribution": 33.41,
      "naiveContribution": 57.46,
      "overall": 46.65
    }
  },
  {
    "id": "rrs-014",
    "input": {
      "memoryCoverage": 0.58,
      "triedPathRecall": 0.56,
      "intermediateCoverage": 0.6,
      "branchAvoidance": 0.61,
      "routeCoherence": 0.59,
      "localGreedyFit": 0.63,
      "singleStepFluency": 0.4,
      "deadEndPressure": 0.43,
      "routeDrift": 0.36,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 52.88,
      "intermediateScore": 61.47,
      "branchScore": 57.03,
      "routeIntegrity": 64.74,
      "greedyLocalScore": 33.07,
      "confidence": 49.35,
      "structuredContribution": 58.71,
      "naiveContribution": 35.07,
      "overall": 58.45
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 20.03,
      "intermediateScore": 22.39,
      "branchScore": 18.95,
      "routeIntegrity": 38.88,
      "greedyLocalScore": 55.96,
      "confidence": 27.85,
      "structuredContribution": 31.24,
      "naiveContribution": 52.26,
      "overall": 42.04
    }
  },
  {
    "id": "rrs-015",
    "input": {
      "memoryCoverage": 0.62,
      "triedPathRecall": 0.54,
      "intermediateCoverage": 0.56,
      "branchAvoidance": 0.65,
      "routeCoherence": 0.57,
      "localGreedyFit": 0.67,
      "singleStepFluency": 0.36,
      "deadEndPressure": 0.44,
      "routeDrift": 0.31,
      "memoryBias": "memory_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 46.1,
      "intermediateScore": 58.44,
      "branchScore": 40.54,
      "routeIntegrity": 74.39,
      "greedyLocalScore": 34.55,
      "confidence": 49.55,
      "structuredContribution": 53.73,
      "naiveContribution": 36.49,
      "overall": 54.63
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 9.43,
      "intermediateScore": 21.95,
      "branchScore": 17.88,
      "routeIntegrity": 39.77,
      "greedyLocalScore": 38.2,
      "confidence": 27.75,
      "structuredContribution": 25.45,
      "naiveContribution": 42.08,
      "overall": 33.04
    }
  },
  {
    "id": "rrs-016",
    "input": {
      "memoryCoverage": 0.58,
      "triedPathRecall": 0.59,
      "intermediateCoverage": 0.6,
      "branchAvoidance": 0.6,
      "routeCoherence": 0.61,
      "localGreedyFit": 0.63,
      "singleStepFluency": 0.37,
      "deadEndPressure": 0.36,
      "routeDrift": 0.32,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 54.66,
      "intermediateScore": 62.09,
      "branchScore": 58.36,
      "routeIntegrity": 65.86,
      "greedyLocalScore": 33.73,
      "confidence": 51.35,
      "structuredContribution": 59.94,
      "naiveContribution": 35.98,
      "overall": 59.63
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 22.05,
      "intermediateScore": 22.02,
      "branchScore": 18.89,
      "routeIntegrity": 37.84,
      "greedyLocalScore": 55.7,
      "confidence": 28.3,
      "structuredContribution": 31.3,
      "naiveContribution": 51.71,
      "overall": 42.42
    }
  },
  {
    "id": "rrs-017",
    "input": {
      "memoryCoverage": 0.62,
      "triedPathRecall": 0.63,
      "intermediateCoverage": 0.63,
      "branchAvoidance": 0.64,
      "routeCoherence": 0.65,
      "localGreedyFit": 0.67,
      "singleStepFluency": 0.39,
      "deadEndPressure": 0.37,
      "routeDrift": 0.33,
      "memoryBias": "intermediate_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 48.59,
      "intermediateScore": 65.03,
      "branchScore": 76.5,
      "routeIntegrity": 53.07,
      "greedyLocalScore": 36.41,
      "confidence": 54.85,
      "structuredContribution": 61.34,
      "naiveContribution": 38.82,
      "overall": 61.29
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 18.73,
      "intermediateScore": 23.6,
      "branchScore": 20.25,
      "routeIntegrity": 39.81,
      "greedyLocalScore": 39.86,
      "confidence": 30.3,
      "structuredContribution": 28.45,
      "naiveContribution": 44.38,
      "overall": 35.94
    }
  },
  {
    "id": "rrs-018",
    "input": {
      "memoryCoverage": 0.66,
      "triedPathRecall": 0.61,
      "intermediateCoverage": 0.67,
      "branchAvoidance": 0.68,
      "routeCoherence": 0.63,
      "localGreedyFit": 0.7,
      "singleStepFluency": 0.34,
      "deadEndPressure": 0.38,
      "routeDrift": 0.27,
      "memoryBias": "greedy_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 38.48,
      "intermediateScore": 57.41,
      "branchScore": 44.67,
      "routeIntegrity": 40.05,
      "greedyLocalScore": 37.08,
      "confidence": 55.2,
      "structuredContribution": 45.1,
      "naiveContribution": 39.35,
      "overall": 45.07
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 28.36,
      "intermediateScore": 21.82,
      "branchScore": 18.55,
      "routeIntegrity": 39.97,
      "greedyLocalScore": 74.27,
      "confidence": 29.5,
      "structuredContribution": 36.59,
      "naiveContribution": 62.38,
      "overall": 52.05
    }
  },
  {
    "id": "rrs-019",
    "input": {
      "memoryCoverage": 0.7,
      "triedPathRecall": 0.65,
      "intermediateCoverage": 0.7,
      "branchAvoidance": 0.72,
      "routeCoherence": 0.67,
      "localGreedyFit": 0.74,
      "singleStepFluency": 0.36,
      "deadEndPressure": 0.38,
      "routeDrift": 0.28,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 63.97,
      "intermediateScore": 70.35,
      "branchScore": 68.24,
      "routeIntegrity": 73.52,
      "greedyLocalScore": 39.94,
      "confidence": 58.7,
      "structuredContribution": 68.8,
      "naiveContribution": 42.43,
      "overall": 68.05
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 26.25,
      "intermediateScore": 23.54,
      "branchScore": 20.08,
      "routeIntegrity": 41.95,
      "greedyLocalScore": 62.07,
      "confidence": 31.7,
      "structuredContribution": 34.78,
      "naiveContribution": 57.12,
      "overall": 47.49
    }
  },
  {
    "id": "rrs-020",
    "input": {
      "memoryCoverage": 0.66,
      "triedPathRecall": 0.7,
      "intermediateCoverage": 0.66,
      "branchAvoidance": 0.68,
      "routeCoherence": 0.71,
      "localGreedyFit": 0.7,
      "singleStepFluency": 0.37,
      "deadEndPressure": 0.31,
      "routeDrift": 0.29,
      "memoryBias": "memory_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 52.98,
      "intermediateScore": 68.62,
      "branchScore": 47.73,
      "routeIntegrity": 88.08,
      "greedyLocalScore": 38.94,
      "confidence": 60.75,
      "structuredContribution": 62.99,
      "naiveContribution": 41.69,
      "overall": 63.16
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 13.66,
      "intermediateScore": 24.12,
      "branchScore": 20.89,
      "routeIntegrity": 40.01,
      "greedyLocalScore": 40.86,
      "confidence": 32.05,
      "structuredContribution": 27.91,
      "naiveContribution": 45.4,
      "overall": 37.33
    }
  },
  {
    "id": "rrs-021",
    "input": {
      "memoryCoverage": 0.7,
      "triedPathRecall": 0.68,
      "intermediateCoverage": 0.7,
      "branchAvoidance": 0.72,
      "routeCoherence": 0.69,
      "localGreedyFit": 0.73,
      "singleStepFluency": 0.33,
      "deadEndPressure": 0.31,
      "routeDrift": 0.24,
      "memoryBias": "balanced",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 65.73,
      "intermediateScore": 70.97,
      "branchScore": 70.2,
      "routeIntegrity": 74.64,
      "greedyLocalScore": 39.99,
      "confidence": 60.95,
      "structuredContribution": 70.2,
      "naiveContribution": 42.69,
      "overall": 69.25
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 27.89,
      "intermediateScore": 22.9,
      "branchScore": 19.73,
      "routeIntegrity": 40.45,
      "greedyLocalScore": 61.19,
      "confidence": 31.8,
      "structuredContribution": 34.43,
      "naiveContribution": 56.02,
      "overall": 47.35
    }
  },
  {
    "id": "rrs-022",
    "input": {
      "memoryCoverage": 0.74,
      "triedPathRecall": 0.72,
      "intermediateCoverage": 0.73,
      "branchAvoidance": 0.76,
      "routeCoherence": 0.73,
      "localGreedyFit": 0.77,
      "singleStepFluency": 0.34,
      "deadEndPressure": 0.32,
      "routeDrift": 0.25,
      "memoryBias": "intermediate_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 57.71,
      "intermediateScore": 73.95,
      "branchScore": 91.06,
      "routeIntegrity": 59.83,
      "greedyLocalScore": 42.47,
      "confidence": 64.6,
      "structuredContribution": 71.41,
      "naiveContribution": 45.28,
      "overall": 70.71
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 24.57,
      "intermediateScore": 24.04,
      "branchScore": 20.68,
      "routeIntegrity": 42.15,
      "greedyLocalScore": 42.21,
      "confidence": 33.35,
      "structuredContribution": 30.73,
      "naiveContribution": 46.65,
      "overall": 39.09
    }
  },
  {
    "id": "rrs-023",
    "input": {
      "memoryCoverage": 0.79,
      "triedPathRecall": 0.76,
      "intermediateCoverage": 0.77,
      "branchAvoidance": 0.8,
      "routeCoherence": 0.78,
      "localGreedyFit": 0.81,
      "singleStepFluency": 0.36,
      "deadEndPressure": 0.33,
      "routeDrift": 0.25,
      "memoryBias": "greedy_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 49.12,
      "intermediateScore": 67.8,
      "branchScore": 54.08,
      "routeIntegrity": 49.12,
      "greedyLocalScore": 45.16,
      "confidence": 68.4,
      "structuredContribution": 54.99,
      "naiveContribution": 48.13,
      "overall": 54.76
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 33.86,
      "intermediateScore": 25.53,
      "branchScore": 22.04,
      "routeIntegrity": 44.02,
      "greedyLocalScore": 84.72,
      "confidence": 35.45,
      "structuredContribution": 42.03,
      "naiveContribution": 71.4,
      "overall": 60.8
    }
  },
  {
    "id": "rrs-024",
    "input": {
      "memoryCoverage": 0.75,
      "triedPathRecall": 0.75,
      "intermediateCoverage": 0.81,
      "branchAvoidance": 0.76,
      "routeCoherence": 0.76,
      "localGreedyFit": 0.77,
      "singleStepFluency": 0.31,
      "deadEndPressure": 0.25,
      "routeDrift": 0.2,
      "memoryBias": "balanced",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 71.63,
      "intermediateScore": 80.19,
      "branchScore": 75.83,
      "routeIntegrity": 82.06,
      "greedyLocalScore": 43.13,
      "confidence": 67.15,
      "structuredContribution": 77.16,
      "naiveContribution": 46.15,
      "overall": 75.58
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 31.21,
      "intermediateScore": 22.99,
      "branchScore": 20.52,
      "routeIntegrity": 41.01,
      "greedyLocalScore": 63.65,
      "confidence": 33.9,
      "structuredContribution": 35.88,
      "naiveContribution": 58.02,
      "overall": 49.95
    }
  },
  {
    "id": "rrs-025",
    "input": {
      "memoryCoverage": 0.79,
      "triedPathRecall": 0.79,
      "intermediateCoverage": 0.77,
      "branchAvoidance": 0.8,
      "routeCoherence": 0.8,
      "localGreedyFit": 0.8,
      "singleStepFluency": 0.33,
      "deadEndPressure": 0.26,
      "routeDrift": 0.21,
      "memoryBias": "memory_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 62.57,
      "intermediateScore": 78.42,
      "branchScore": 56.01,
      "routeIntegrity": 99.58,
      "greedyLocalScore": 45.2,
      "confidence": 70.65,
      "structuredContribution": 72.68,
      "naiveContribution": 48.35,
      "overall": 72.3
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 19.5,
      "intermediateScore": 24.86,
      "branchScore": 21.66,
      "routeIntegrity": 42.53,
      "greedyLocalScore": 43.52,
      "confidence": 35.55,
      "structuredContribution": 30.41,
      "naiveContribution": 48.11,
      "overall": 40.88
    }
  },
  {
    "id": "rrs-026",
    "input": {
      "memoryCoverage": 0.83,
      "triedPathRecall": 0.83,
      "intermediateCoverage": 0.8,
      "branchAvoidance": 0.83,
      "routeCoherence": 0.84,
      "localGreedyFit": 0.84,
      "singleStepFluency": 0.34,
      "deadEndPressure": 0.27,
      "routeDrift": 0.22,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 78.57,
      "intermediateScore": 81.4,
      "branchScore": 82.31,
      "routeIntegrity": 87.49,
      "greedyLocalScore": 47.68,
      "confidence": 74.05,
      "structuredContribution": 82.26,
      "naiveContribution": 50.93,
      "overall": 80.62
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 33.17,
      "intermediateScore": 25.98,
      "branchScore": 22.63,
      "routeIntegrity": 44.22,
      "greedyLocalScore": 68.8,
      "confidence": 37.1,
      "structuredContribution": 38.96,
      "naiveContribution": 63.07,
      "overall": 54.29
    }
  },
  {
    "id": "rrs-027",
    "input": {
      "memoryCoverage": 0.87,
      "triedPathRecall": 0.81,
      "intermediateCoverage": 0.84,
      "branchAvoidance": 0.87,
      "routeCoherence": 0.82,
      "localGreedyFit": 0.88,
      "singleStepFluency": 0.3,
      "deadEndPressure": 0.27,
      "routeDrift": 0.17,
      "memoryBias": "intermediate_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 67.29,
      "intermediateScore": 83.75,
      "branchScore": 100,
      "routeIntegrity": 67.31,
      "greedyLocalScore": 49.35,
      "confidence": 74.25,
      "structuredContribution": 80.4,
      "naiveContribution": 52.55,
      "overall": 79.39
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 30.78,
      "intermediateScore": 24.99,
      "branchScore": 21.66,
      "routeIntegrity": 45.12,
      "greedyLocalScore": 45.22,
      "confidence": 37.2,
      "structuredContribution": 33.55,
      "naiveContribution": 49.74,
      "overall": 43
    }
  },
  {
    "id": "rrs-028",
    "input": {
      "memoryCoverage": 0.83,
      "triedPathRecall": 0.86,
      "intermediateCoverage": 0.87,
      "branchAvoidance": 0.83,
      "routeCoherence": 0.86,
      "localGreedyFit": 0.84,
      "singleStepFluency": 0.31,
      "deadEndPressure": 0.2,
      "routeDrift": 0.17,
      "memoryBias": "greedy_first",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 54.9,
      "intermediateScore": 76.72,
      "branchScore": 60.07,
      "routeIntegrity": 54.69,
      "greedyLocalScore": 48.34,
      "confidence": 76.3,
      "structuredContribution": 61.54,
      "naiveContribution": 51.77,
      "overall": 60.78
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 38.81,
      "intermediateScore": 24.98,
      "branchScore": 22.43,
      "routeIntegrity": 43.18,
      "greedyLocalScore": 86.95,
      "confidence": 37.65,
      "structuredContribution": 43.27,
      "naiveContribution": 72.61,
      "overall": 63.54
    }
  },
  {
    "id": "rrs-029",
    "input": {
      "memoryCoverage": 0.87,
      "triedPathRecall": 0.9,
      "intermediateCoverage": 0.91,
      "branchAvoidance": 0.87,
      "routeCoherence": 0.9,
      "localGreedyFit": 0.87,
      "singleStepFluency": 0.33,
      "deadEndPressure": 0.2,
      "routeDrift": 0.18,
      "memoryBias": "balanced",
      "profile": "structured_memory"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 83.92,
      "intermediateScore": 90.33,
      "branchScore": 87.99,
      "routeIntegrity": 94.2,
      "greedyLocalScore": 50.59,
      "confidence": 79.8,
      "structuredContribution": 88.86,
      "naiveContribution": 54.19,
      "overall": 86.62
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 36.33,
      "intermediateScore": 26.32,
      "branchScore": 23.71,
      "routeIntegrity": 44.7,
      "greedyLocalScore": 71.06,
      "confidence": 39.5,
      "structuredContribution": 40.42,
      "naiveContribution": 65.1,
      "overall": 56.99
    }
  },
  {
    "id": "rrs-030",
    "input": {
      "memoryCoverage": 0.91,
      "triedPathRecall": 0.88,
      "intermediateCoverage": 0.87,
      "branchAvoidance": 0.91,
      "routeCoherence": 0.88,
      "localGreedyFit": 0.91,
      "singleStepFluency": 0.28,
      "deadEndPressure": 0.21,
      "routeDrift": 0.13,
      "memoryBias": "memory_first",
      "profile": "naive_local"
    },
    "expectedStructured": {
      "mode": "structured_memory",
      "memoryScore": 71.61,
      "intermediateScore": 87.34,
      "branchScore": 63.87,
      "routeIntegrity": 100,
      "greedyLocalScore": 51.88,
      "confidence": 80.15,
      "structuredContribution": 79.46,
      "naiveContribution": 55.34,
      "overall": 79.12
    },
    "expectedNaive": {
      "mode": "naive_local",
      "memoryScore": 25.72,
      "intermediateScore": 25.41,
      "branchScore": 22.17,
      "routeIntegrity": 45.32,
      "greedyLocalScore": 46.21,
      "confidence": 38.95,
      "structuredContribution": 32.97,
      "naiveContribution": 50.7,
      "overall": 44.34
    }
  }
];
