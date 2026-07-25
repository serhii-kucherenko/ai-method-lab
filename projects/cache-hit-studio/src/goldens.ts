import type { CacheHitInput, CacheHitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CacheHitInput;
  expectedStructured: CacheHitQuality;
  expectedDocking: CacheHitQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ch-001",
    "input": {
      "pocketCoverage": 0.29,
      "hitFidelity": 0.25,
      "ligandGrounding": 0.28,
      "packCompleteness": 0.34,
      "dockingConfidence": 0.39,
      "dockingOptimism": 0.45,
      "pocketHardness": 0.59,
      "overclaimRisk": 0.5,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 23.37,
      "fidelityScore": 30.25,
      "ligandScore": 23.45,
      "completenessScore": 37.64,
      "dockingScore": 16.4,
      "confidence": 20.85,
      "structureContribution": 28.18,
      "dockingContribution": 15.92,
      "overall": 29.97
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 5.76,
      "fidelityScore": 17.05,
      "ligandScore": 12.78,
      "completenessScore": 32.39,
      "dockingScore": 40.93,
      "confidence": 17.1,
      "structureContribution": 21.78,
      "dockingContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "ch-002",
    "input": {
      "pocketCoverage": 0.33,
      "hitFidelity": 0.29,
      "ligandGrounding": 0.32,
      "packCompleteness": 0.38,
      "dockingConfidence": 0.43,
      "dockingOptimism": 0.46,
      "pocketHardness": 0.6,
      "overclaimRisk": 0.51,
      "hitBias": "pocket_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 22.88,
      "fidelityScore": 33.9,
      "ligandScore": 34.35,
      "completenessScore": 31.9,
      "dockingScore": 18.89,
      "confidence": 24.5,
      "structureContribution": 30.72,
      "dockingContribution": 18.58,
      "overall": 32.53
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 2.43,
      "fidelityScore": 18.17,
      "ligandScore": 13.81,
      "completenessScore": 34.08,
      "dockingScore": 31.53,
      "confidence": 18.65,
      "structureContribution": 20,
      "dockingContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "ch-003",
    "input": {
      "pocketCoverage": 0.37,
      "hitFidelity": 0.27,
      "ligandGrounding": 0.36,
      "packCompleteness": 0.42,
      "dockingConfidence": 0.46,
      "dockingOptimism": 0.42,
      "pocketHardness": 0.6,
      "overclaimRisk": 0.46,
      "hitBias": "docking_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 14.21,
      "fidelityScore": 23.71,
      "ligandScore": 20.92,
      "completenessScore": 19.24,
      "dockingScore": 19.94,
      "confidence": 27.1,
      "structureContribution": 19.48,
      "dockingContribution": 19.65,
      "overall": 20.51
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 12.17,
      "fidelityScore": 17.05,
      "ligandScore": 12.78,
      "completenessScore": 33.93,
      "dockingScore": 54.34,
      "confidence": 18.4,
      "structureContribution": 26.05,
      "dockingContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "ch-004",
    "input": {
      "pocketCoverage": 0.33,
      "hitFidelity": 0.32,
      "ligandGrounding": 0.39,
      "packCompleteness": 0.38,
      "dockingConfidence": 0.42,
      "dockingOptimism": 0.43,
      "pocketHardness": 0.53,
      "overclaimRisk": 0.46,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 30.23,
      "fidelityScore": 36.03,
      "ligandScore": 33.26,
      "completenessScore": 42.23,
      "dockingScore": 18.93,
      "confidence": 25.85,
      "structureContribution": 35.11,
      "dockingContribution": 19.24,
      "overall": 36.25
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 8.7,
      "fidelityScore": 18.05,
      "ligandScore": 14.08,
      "completenessScore": 32.79,
      "dockingScore": 42.77,
      "confidence": 18.85,
      "structureContribution": 23.28,
      "dockingContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "ch-005",
    "input": {
      "pocketCoverage": 0.37,
      "hitFidelity": 0.36,
      "ligandGrounding": 0.35,
      "packCompleteness": 0.42,
      "dockingConfidence": 0.46,
      "dockingOptimism": 0.45,
      "pocketHardness": 0.53,
      "overclaimRisk": 0.47,
      "hitBias": "structure_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 26.59,
      "fidelityScore": 39.64,
      "ligandScore": 21.33,
      "completenessScore": 54.3,
      "dockingScore": 21.8,
      "confidence": 29.35,
      "structureContribution": 34.35,
      "dockingContribution": 22.12,
      "overall": 36.15
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 0,
      "fidelityScore": 19.43,
      "ligandScore": 15.31,
      "completenessScore": 34.77,
      "dockingScore": 32.95,
      "confidence": 21.05,
      "structureContribution": 20.49,
      "dockingContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "ch-006",
    "input": {
      "pocketCoverage": 0.41,
      "hitFidelity": 0.34,
      "ligandGrounding": 0.39,
      "packCompleteness": 0.45,
      "dockingConfidence": 0.5,
      "dockingOptimism": 0.4,
      "pocketHardness": 0.54,
      "overclaimRisk": 0.42,
      "hitBias": "balanced",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 35.28,
      "fidelityScore": 39.5,
      "ligandScore": 35.78,
      "completenessScore": 47.85,
      "dockingScore": 23.08,
      "confidence": 31.85,
      "structureContribution": 39.2,
      "dockingContribution": 23.32,
      "overall": 40.34
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 11.98,
      "fidelityScore": 17.95,
      "ligandScore": 13.91,
      "completenessScore": 34.78,
      "dockingScore": 46.72,
      "confidence": 20.5,
      "structureContribution": 25.07,
      "dockingContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "ch-007",
    "input": {
      "pocketCoverage": 0.45,
      "hitFidelity": 0.38,
      "ligandGrounding": 0.42,
      "packCompleteness": 0.49,
      "dockingConfidence": 0.53,
      "dockingOptimism": 0.42,
      "pocketHardness": 0.55,
      "overclaimRisk": 0.43,
      "hitBias": "pocket_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 32.43,
      "fidelityScore": 43.11,
      "ligandScore": 48.27,
      "completenessScore": 39.34,
      "dockingScore": 25.15,
      "confidence": 35.35,
      "structureContribution": 40.95,
      "dockingContribution": 25.54,
      "overall": 42.18
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 8.27,
      "fidelityScore": 19.21,
      "ligandScore": 15.09,
      "completenessScore": 36.3,
      "dockingScore": 34.2,
      "confidence": 22.15,
      "structureContribution": 22.61,
      "dockingContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "ch-008",
    "input": {
      "pocketCoverage": 0.41,
      "hitFidelity": 0.43,
      "ligandGrounding": 0.46,
      "packCompleteness": 0.45,
      "dockingConfidence": 0.49,
      "dockingOptimism": 0.43,
      "pocketHardness": 0.47,
      "overclaimRisk": 0.44,
      "hitBias": "docking_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 20.12,
      "fidelityScore": 35.43,
      "ligandScore": 27.76,
      "completenessScore": 24.76,
      "dockingScore": 24.32,
      "confidence": 34.1,
      "structureContribution": 26.95,
      "dockingContribution": 25.37,
      "overall": 27.67
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 16.4,
      "fidelityScore": 20.36,
      "ligandScore": 16.57,
      "completenessScore": 35.17,
      "dockingScore": 58.5,
      "confidence": 22.7,
      "structureContribution": 29.4,
      "dockingContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "ch-009",
    "input": {
      "pocketCoverage": 0.46,
      "hitFidelity": 0.41,
      "ligandGrounding": 0.5,
      "packCompleteness": 0.49,
      "dockingConfidence": 0.53,
      "dockingOptimism": 0.39,
      "pocketHardness": 0.48,
      "overclaimRisk": 0.38,
      "hitBias": "balanced",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 42.68,
      "fidelityScore": 45.49,
      "ligandScore": 45.8,
      "completenessScore": 52.59,
      "dockingScore": 25.81,
      "confidence": 37.1,
      "structureContribution": 46.41,
      "dockingContribution": 26.81,
      "overall": 46.88
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 14.91,
      "fidelityScore": 19.22,
      "ligandScore": 15.52,
      "completenessScore": 35.36,
      "dockingScore": 48.88,
      "confidence": 22.7,
      "structureContribution": 26.78,
      "dockingContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "ch-010",
    "input": {
      "pocketCoverage": 0.5,
      "hitFidelity": 0.45,
      "ligandGrounding": 0.46,
      "packCompleteness": 0.53,
      "dockingConfidence": 0.57,
      "dockingOptimism": 0.4,
      "pocketHardness": 0.49,
      "overclaimRisk": 0.39,
      "hitBias": "structure_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 36.76,
      "fidelityScore": 49.14,
      "ligandScore": 30.54,
      "completenessScore": 66.82,
      "dockingScore": 28.29,
      "confidence": 40.75,
      "structureContribution": 44.6,
      "dockingContribution": 29.21,
      "overall": 45.83
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 3.59,
      "fidelityScore": 20.03,
      "ligandScore": 16.17,
      "completenessScore": 37.06,
      "dockingScore": 35.54,
      "confidence": 24.25,
      "structureContribution": 22.48,
      "dockingContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "ch-011",
    "input": {
      "pocketCoverage": 0.54,
      "hitFidelity": 0.49,
      "ligandGrounding": 0.49,
      "packCompleteness": 0.57,
      "dockingConfidence": 0.6,
      "dockingOptimism": 0.42,
      "pocketHardness": 0.49,
      "overclaimRisk": 0.4,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 47.07,
      "fidelityScore": 52.75,
      "ligandScore": 47.04,
      "completenessScore": 60.27,
      "dockingScore": 30.54,
      "confidence": 44.25,
      "structureContribution": 51.33,
      "dockingContribution": 31.67,
      "overall": 51.79
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 17.1,
      "fidelityScore": 21.44,
      "ligandScore": 17.52,
      "completenessScore": 38.58,
      "dockingScore": 54.12,
      "confidence": 26.1,
      "structureContribution": 29.75,
      "dockingContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "ch-012",
    "input": {
      "pocketCoverage": 0.5,
      "hitFidelity": 0.48,
      "ligandGrounding": 0.53,
      "packCompleteness": 0.53,
      "dockingConfidence": 0.56,
      "dockingOptimism": 0.37,
      "pocketHardness": 0.42,
      "overclaimRisk": 0.35,
      "hitBias": "pocket_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 39.39,
      "fidelityScore": 51.28,
      "ligandScore": 62.01,
      "completenessScore": 43.82,
      "dockingScore": 28.34,
      "confidence": 42.1,
      "structureContribution": 49.55,
      "dockingContribution": 29.77,
      "overall": 49.99
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 13.23,
      "fidelityScore": 19.78,
      "ligandScore": 16.29,
      "completenessScore": 35.76,
      "dockingScore": 34.93,
      "confidence": 24.35,
      "structureContribution": 24,
      "dockingContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "ch-013",
    "input": {
      "pocketCoverage": 0.54,
      "hitFidelity": 0.52,
      "ligandGrounding": 0.56,
      "packCompleteness": 0.57,
      "dockingConfidence": 0.6,
      "dockingOptimism": 0.39,
      "pocketHardness": 0.42,
      "overclaimRisk": 0.36,
      "hitBias": "docking_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 30.08,
      "fidelityScore": 44.88,
      "ligandScore": 36.64,
      "completenessScore": 32.66,
      "dockingScore": 31.2,
      "confidence": 45.6,
      "structureContribution": 36.04,
      "dockingContribution": 32.85,
      "overall": 36.47
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 22.62,
      "fidelityScore": 21.42,
      "ligandScore": 17.82,
      "completenessScore": 37.74,
      "dockingScore": 67.02,
      "confidence": 26.55,
      "structureContribution": 33.32,
      "dockingContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "ch-014",
    "input": {
      "pocketCoverage": 0.58,
      "hitFidelity": 0.56,
      "ligandGrounding": 0.6,
      "packCompleteness": 0.61,
      "dockingConfidence": 0.63,
      "dockingOptimism": 0.4,
      "pocketHardness": 0.43,
      "overclaimRisk": 0.36,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 53.79,
      "fidelityScore": 58.53,
      "ligandScore": 56.71,
      "completenessScore": 64.86,
      "dockingScore": 33.07,
      "confidence": 49.25,
      "structureContribution": 58.18,
      "dockingContribution": 34.85,
      "overall": 57.98
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 20.03,
      "fidelityScore": 22.26,
      "ligandScore": 18.61,
      "completenessScore": 38.98,
      "dockingScore": 55.96,
      "confidence": 27.85,
      "structureContribution": 31.17,
      "dockingContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "ch-015",
    "input": {
      "pocketCoverage": 0.62,
      "hitFidelity": 0.54,
      "ligandGrounding": 0.56,
      "packCompleteness": 0.65,
      "dockingConfidence": 0.67,
      "dockingOptimism": 0.36,
      "pocketHardness": 0.44,
      "overclaimRisk": 0.31,
      "hitBias": "structure_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 46.23,
      "fidelityScore": 58.35,
      "ligandScore": 39.15,
      "completenessScore": 79.94,
      "dockingScore": 34.55,
      "confidence": 51.85,
      "structureContribution": 54.57,
      "dockingContribution": 36.06,
      "overall": 55.24
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 9.43,
      "fidelityScore": 20.94,
      "ligandScore": 17.24,
      "completenessScore": 39.27,
      "dockingScore": 38.2,
      "confidence": 27.75,
      "structureContribution": 25.02,
      "dockingContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "ch-016",
    "input": {
      "pocketCoverage": 0.58,
      "hitFidelity": 0.59,
      "ligandGrounding": 0.6,
      "packCompleteness": 0.6,
      "dockingConfidence": 0.63,
      "dockingOptimism": 0.37,
      "pocketHardness": 0.36,
      "overclaimRisk": 0.32,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 54.78,
      "fidelityScore": 60.67,
      "ligandScore": 57.91,
      "completenessScore": 65.05,
      "dockingScore": 33.73,
      "confidence": 50.35,
      "structureContribution": 59.33,
      "dockingContribution": 35.81,
      "overall": 59.1
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 22.05,
      "fidelityScore": 21.96,
      "ligandScore": 18.63,
      "completenessScore": 38.14,
      "dockingScore": 55.7,
      "confidence": 28.3,
      "structureContribution": 31.3,
      "dockingContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "ch-017",
    "input": {
      "pocketCoverage": 0.62,
      "hitFidelity": 0.63,
      "ligandGrounding": 0.63,
      "packCompleteness": 0.64,
      "dockingConfidence": 0.67,
      "dockingOptimism": 0.39,
      "pocketHardness": 0.37,
      "overclaimRisk": 0.33,
      "hitBias": "pocket_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 48.45,
      "fidelityScore": 64.28,
      "ligandScore": 75.16,
      "completenessScore": 52.76,
      "dockingScore": 36.41,
      "confidence": 53.85,
      "structureContribution": 60.68,
      "dockingContribution": 38.64,
      "overall": 60.71
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 18.73,
      "fidelityScore": 23.45,
      "ligandScore": 19.98,
      "completenessScore": 40.11,
      "dockingScore": 39.86,
      "confidence": 30.3,
      "structureContribution": 28.43,
      "dockingContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "ch-018",
    "input": {
      "pocketCoverage": 0.66,
      "hitFidelity": 0.61,
      "ligandGrounding": 0.67,
      "packCompleteness": 0.68,
      "dockingConfidence": 0.7,
      "dockingOptimism": 0.34,
      "pocketHardness": 0.38,
      "overclaimRisk": 0.27,
      "hitBias": "docking_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 39.72,
      "fidelityScore": 54.13,
      "ligandScore": 45.55,
      "completenessScore": 40.09,
      "dockingScore": 37.08,
      "confidence": 56.6,
      "structureContribution": 44.89,
      "dockingContribution": 39.18,
      "overall": 44.86
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 28.36,
      "fidelityScore": 21.69,
      "ligandScore": 18.3,
      "completenessScore": 39.67,
      "dockingScore": 74.27,
      "confidence": 29.5,
      "structureContribution": 36.46,
      "dockingContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "ch-019",
    "input": {
      "pocketCoverage": 0.7,
      "hitFidelity": 0.65,
      "ligandGrounding": 0.7,
      "packCompleteness": 0.72,
      "dockingConfidence": 0.74,
      "dockingOptimism": 0.36,
      "pocketHardness": 0.38,
      "overclaimRisk": 0.28,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 65.21,
      "fidelityScore": 67.74,
      "ligandScore": 68.17,
      "completenessScore": 75.07,
      "dockingScore": 39.94,
      "confidence": 60.1,
      "structureContribution": 68.82,
      "dockingContribution": 42.25,
      "overall": 68.04
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 26.25,
      "fidelityScore": 23.32,
      "ligandScore": 19.82,
      "completenessScore": 41.65,
      "dockingScore": 62.07,
      "confidence": 31.7,
      "structureContribution": 34.62,
      "dockingContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ch-020",
    "input": {
      "pocketCoverage": 0.66,
      "hitFidelity": 0.7,
      "ligandGrounding": 0.66,
      "packCompleteness": 0.68,
      "dockingConfidence": 0.7,
      "dockingOptimism": 0.37,
      "pocketHardness": 0.31,
      "overclaimRisk": 0.29,
      "hitBias": "structure_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 51.95,
      "fidelityScore": 70.06,
      "ligandScore": 45.74,
      "completenessScore": 86.81,
      "dockingScore": 38.94,
      "confidence": 58.85,
      "structureContribution": 62.23,
      "dockingContribution": 41.54,
      "overall": 62.51
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 13.66,
      "fidelityScore": 23.93,
      "ligandScore": 20.65,
      "completenessScore": 40.51,
      "dockingScore": 40.86,
      "confidence": 32.05,
      "structureContribution": 27.92,
      "dockingContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ch-021",
    "input": {
      "pocketCoverage": 0.7,
      "hitFidelity": 0.68,
      "ligandGrounding": 0.7,
      "packCompleteness": 0.72,
      "dockingConfidence": 0.73,
      "dockingOptimism": 0.33,
      "pocketHardness": 0.31,
      "overclaimRisk": 0.24,
      "hitBias": "balanced",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 66.16,
      "fidelityScore": 69.88,
      "ligandScore": 69.32,
      "completenessScore": 75.82,
      "dockingScore": 39.99,
      "confidence": 61.45,
      "structureContribution": 70.06,
      "dockingContribution": 42.54,
      "overall": 69.11
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 27.89,
      "fidelityScore": 22.72,
      "ligandScore": 19.52,
      "completenessScore": 40.35,
      "dockingScore": 61.19,
      "confidence": 31.8,
      "structureContribution": 34.33,
      "dockingContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ch-022",
    "input": {
      "pocketCoverage": 0.74,
      "hitFidelity": 0.72,
      "ligandGrounding": 0.73,
      "packCompleteness": 0.76,
      "dockingConfidence": 0.77,
      "dockingOptimism": 0.34,
      "pocketHardness": 0.32,
      "overclaimRisk": 0.25,
      "hitBias": "pocket_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 57.83,
      "fidelityScore": 73.52,
      "ligandScore": 88.84,
      "completenessScore": 60.51,
      "dockingScore": 42.47,
      "confidence": 65.1,
      "structureContribution": 70.87,
      "dockingContribution": 45.13,
      "overall": 70.24
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 24.57,
      "fidelityScore": 23.77,
      "ligandScore": 20.46,
      "completenessScore": 42.05,
      "dockingScore": 42.21,
      "confidence": 33.35,
      "structureContribution": 30.61,
      "dockingContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "ch-023",
    "input": {
      "pocketCoverage": 0.79,
      "hitFidelity": 0.76,
      "ligandGrounding": 0.77,
      "packCompleteness": 0.8,
      "dockingConfidence": 0.81,
      "dockingOptimism": 0.36,
      "pocketHardness": 0.33,
      "overclaimRisk": 0.25,
      "hitBias": "docking_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 49.24,
      "fidelityScore": 67.38,
      "ligandScore": 53.71,
      "completenessScore": 49.49,
      "dockingScore": 45.16,
      "confidence": 69,
      "structureContribution": 54.9,
      "dockingContribution": 47.99,
      "overall": 54.66
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 33.86,
      "fidelityScore": 25.2,
      "ligandScore": 21.84,
      "completenessScore": 43.92,
      "dockingScore": 84.72,
      "confidence": 35.45,
      "structureContribution": 41.91,
      "dockingContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "ch-024",
    "input": {
      "pocketCoverage": 0.75,
      "hitFidelity": 0.75,
      "ligandGrounding": 0.81,
      "packCompleteness": 0.76,
      "dockingConfidence": 0.77,
      "dockingOptimism": 0.31,
      "pocketHardness": 0.25,
      "overclaimRisk": 0.2,
      "hitBias": "balanced",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 73.31,
      "fidelityScore": 75.91,
      "ligandScore": 79.08,
      "completenessScore": 80.56,
      "dockingScore": 43.13,
      "confidence": 66.85,
      "structureContribution": 77.14,
      "dockingContribution": 46.16,
      "overall": 75.56
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 31.21,
      "fidelityScore": 23.47,
      "ligandScore": 20.52,
      "completenessScore": 41.11,
      "dockingScore": 63.65,
      "confidence": 33.9,
      "structureContribution": 35.99,
      "dockingContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "ch-025",
    "input": {
      "pocketCoverage": 0.79,
      "hitFidelity": 0.79,
      "ligandGrounding": 0.77,
      "packCompleteness": 0.8,
      "dockingConfidence": 0.8,
      "dockingOptimism": 0.33,
      "pocketHardness": 0.26,
      "overclaimRisk": 0.21,
      "hitBias": "structure_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 62.03,
      "fidelityScore": 79.52,
      "ligandScore": 54.83,
      "completenessScore": 100,
      "dockingScore": 45.2,
      "confidence": 70.35,
      "structureContribution": 72.57,
      "dockingContribution": 48.24,
      "overall": 72.19
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 19.5,
      "fidelityScore": 24.56,
      "ligandScore": 21.5,
      "completenessScore": 42.63,
      "dockingScore": 43.52,
      "confidence": 35.55,
      "structureContribution": 30.34,
      "dockingContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "ch-026",
    "input": {
      "pocketCoverage": 0.83,
      "hitFidelity": 0.83,
      "ligandGrounding": 0.8,
      "packCompleteness": 0.83,
      "dockingConfidence": 0.84,
      "dockingOptimism": 0.34,
      "pocketHardness": 0.27,
      "overclaimRisk": 0.22,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 77.64,
      "fidelityScore": 83.17,
      "ligandScore": 80.25,
      "completenessScore": 87.68,
      "dockingScore": 47.68,
      "confidence": 73.75,
      "structureContribution": 81.91,
      "dockingContribution": 50.82,
      "overall": 80.31
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 33.17,
      "fidelityScore": 25.61,
      "ligandScore": 22.47,
      "completenessScore": 44.32,
      "dockingScore": 68.8,
      "confidence": 37.1,
      "structureContribution": 38.87,
      "dockingContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "ch-027",
    "input": {
      "pocketCoverage": 0.87,
      "hitFidelity": 0.81,
      "ligandGrounding": 0.84,
      "packCompleteness": 0.87,
      "dockingConfidence": 0.88,
      "dockingOptimism": 0.3,
      "pocketHardness": 0.27,
      "overclaimRisk": 0.17,
      "hitBias": "pocket_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 67.91,
      "fidelityScore": 82.98,
      "ligandScore": 100,
      "completenessScore": 68.1,
      "dockingScore": 49.35,
      "confidence": 76.35,
      "structureContribution": 80.55,
      "dockingContribution": 52.46,
      "overall": 79.49
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 30.78,
      "fidelityScore": 24.64,
      "ligandScore": 21.53,
      "completenessScore": 44.62,
      "dockingScore": 45.22,
      "confidence": 37.2,
      "structureContribution": 33.36,
      "dockingContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "ch-028",
    "input": {
      "pocketCoverage": 0.83,
      "hitFidelity": 0.86,
      "ligandGrounding": 0.87,
      "packCompleteness": 0.83,
      "dockingConfidence": 0.84,
      "dockingOptimism": 0.31,
      "pocketHardness": 0.2,
      "overclaimRisk": 0.17,
      "hitBias": "docking_first",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 55.14,
      "fidelityScore": 75.3,
      "ligandScore": 60.67,
      "completenessScore": 53.51,
      "dockingScore": 48.34,
      "confidence": 75.1,
      "structureContribution": 61.17,
      "dockingContribution": 51.78,
      "overall": 60.48
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 38.81,
      "fidelityScore": 25.31,
      "ligandScore": 22.44,
      "completenessScore": 43.48,
      "dockingScore": 86.95,
      "confidence": 37.65,
      "structureContribution": 43.4,
      "dockingContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "ch-029",
    "input": {
      "pocketCoverage": 0.87,
      "hitFidelity": 0.9,
      "ligandGrounding": 0.91,
      "packCompleteness": 0.87,
      "dockingConfidence": 0.87,
      "dockingOptimism": 0.33,
      "pocketHardness": 0.2,
      "overclaimRisk": 0.18,
      "hitBias": "balanced",
      "profile": "structured_hit_finding"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 84.21,
      "fidelityScore": 88.91,
      "ligandScore": 89.77,
      "completenessScore": 92.27,
      "dockingScore": 50.59,
      "confidence": 78.6,
      "structureContribution": 88.67,
      "dockingContribution": 54.2,
      "overall": 86.47
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 36.33,
      "fidelityScore": 26.66,
      "ligandScore": 23.73,
      "completenessScore": 45,
      "dockingScore": 71.06,
      "confidence": 39.5,
      "structureContribution": 40.56,
      "dockingContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "ch-030",
    "input": {
      "pocketCoverage": 0.91,
      "hitFidelity": 0.88,
      "ligandGrounding": 0.87,
      "packCompleteness": 0.91,
      "dockingConfidence": 0.91,
      "dockingOptimism": 0.28,
      "pocketHardness": 0.21,
      "overclaimRisk": 0.13,
      "hitBias": "structure_first",
      "profile": "naive_docking_baseline"
    },
    "expectedStructured": {
      "mode": "structured_hit_finding",
      "pocketScore": 71.33,
      "fidelityScore": 88.77,
      "ligandScore": 63.21,
      "completenessScore": 100,
      "dockingScore": 51.88,
      "confidence": 81.35,
      "structureContribution": 79.55,
      "dockingContribution": 55.26,
      "overall": 79.18
    },
    "expectedDocking": {
      "mode": "naive_docking_baseline",
      "pocketScore": 25.72,
      "fidelityScore": 25,
      "ligandScore": 22.06,
      "completenessScore": 45.02,
      "dockingScore": 46.21,
      "confidence": 38.95,
      "structureContribution": 32.8,
      "dockingContribution": 50.65,
      "overall": 44.26
    }
  }
];
