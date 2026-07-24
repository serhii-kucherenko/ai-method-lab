import type { ReasonInput, ReasonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReasonInput;
  expectedMultiAgent: ReasonQuality;
  expectedSingleAgent: ReasonQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "rfs-001",
    "input": {
      "ruleCoverage": 0.19,
      "debateDepth": 0.16,
      "consensusStrength": 0.22,
      "challengerPressure": 0.16,
      "bayesianUpdate": 0.19,
      "evidenceGrounding": 0.19,
      "fluencyBias": 0.63,
      "teamCoordination": 0.19,
      "priorConfidence": 0.18,
      "contradictionRate": 0.63,
      "domainKind": "chemistry",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 29.24,
      "debateIntegrity": 0,
      "gameScore": 2.8,
      "hallucinationResistance": 3.34,
      "planCoherence": 0,
      "overall": 7.13
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.29,
      "debateIntegrity": 17.96,
      "gameScore": 19.66,
      "hallucinationResistance": 11.93,
      "planCoherence": 8.87,
      "overall": 15.26
    }
  },
  {
    "id": "rfs-002",
    "input": {
      "ruleCoverage": 0.23,
      "debateDepth": 0.2,
      "consensusStrength": 0.26,
      "challengerPressure": 0.2,
      "bayesianUpdate": 0.23,
      "evidenceGrounding": 0.23,
      "fluencyBias": 0.63,
      "teamCoordination": 0.23,
      "priorConfidence": 0.22,
      "contradictionRate": 0.63,
      "domainKind": "biology",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 31.36,
      "debateIntegrity": 2.33,
      "gameScore": 5.74,
      "hallucinationResistance": 5.32,
      "planCoherence": 0,
      "overall": 9.11
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.68,
      "debateIntegrity": 17.85,
      "gameScore": 19.47,
      "hallucinationResistance": 11.7,
      "planCoherence": 6.88,
      "overall": 14.79
    }
  },
  {
    "id": "rfs-003",
    "input": {
      "ruleCoverage": 0.28,
      "debateDepth": 0.24,
      "consensusStrength": 0.24,
      "challengerPressure": 0.24,
      "bayesianUpdate": 0.28,
      "evidenceGrounding": 0.28,
      "fluencyBias": 0.57,
      "teamCoordination": 0.28,
      "priorConfidence": 0.21,
      "contradictionRate": 0.57,
      "domainKind": "math",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 56.41,
      "debateIntegrity": 36.75,
      "gameScore": 31.58,
      "hallucinationResistance": 48.93,
      "planCoherence": 36.68,
      "overall": 41.97
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 18.32,
      "debateIntegrity": 15.2,
      "gameScore": 16.44,
      "hallucinationResistance": 9.57,
      "planCoherence": 2.82,
      "overall": 12.08
    }
  },
  {
    "id": "rfs-004",
    "input": {
      "ruleCoverage": 0.24,
      "debateDepth": 0.28,
      "consensusStrength": 0.29,
      "challengerPressure": 0.28,
      "bayesianUpdate": 0.24,
      "evidenceGrounding": 0.24,
      "fluencyBias": 0.57,
      "teamCoordination": 0.24,
      "priorConfidence": 0.25,
      "contradictionRate": 0.57,
      "domainKind": "materials",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 32.74,
      "debateIntegrity": 8.02,
      "gameScore": 8.64,
      "hallucinationResistance": 9.39,
      "planCoherence": 0,
      "overall": 12.09
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.6,
      "debateIntegrity": 15.06,
      "gameScore": 18.05,
      "hallucinationResistance": 10.99,
      "planCoherence": 2.49,
      "overall": 12.86
    }
  },
  {
    "id": "rfs-005",
    "input": {
      "ruleCoverage": 0.29,
      "debateDepth": 0.25,
      "consensusStrength": 0.33,
      "challengerPressure": 0.25,
      "bayesianUpdate": 0.28,
      "evidenceGrounding": 0.28,
      "fluencyBias": 0.57,
      "teamCoordination": 0.28,
      "priorConfidence": 0.29,
      "contradictionRate": 0.57,
      "domainKind": "physics",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 36.22,
      "debateIntegrity": 7.09,
      "gameScore": 11.31,
      "hallucinationResistance": 11.33,
      "planCoherence": 0,
      "overall": 13.56
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 20.27,
      "debateIntegrity": 17.36,
      "gameScore": 18.32,
      "hallucinationResistance": 11.06,
      "planCoherence": 2.51,
      "overall": 13.5
    }
  },
  {
    "id": "rfs-006",
    "input": {
      "ruleCoverage": 0.33,
      "debateDepth": 0.29,
      "consensusStrength": 0.31,
      "challengerPressure": 0.29,
      "bayesianUpdate": 0.32,
      "evidenceGrounding": 0.33,
      "fluencyBias": 0.52,
      "teamCoordination": 0.33,
      "priorConfidence": 0.28,
      "contradictionRate": 0.52,
      "domainKind": "chemistry",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 59.89,
      "debateIntegrity": 41.29,
      "gameScore": 36.06,
      "hallucinationResistance": 53.45,
      "planCoherence": 41.39,
      "overall": 46.31
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.03,
      "debateIntegrity": 14.88,
      "gameScore": 15.7,
      "hallucinationResistance": 9.2,
      "planCoherence": 0,
      "overall": 11.3
    }
  },
  {
    "id": "rfs-007",
    "input": {
      "ruleCoverage": 0.37,
      "debateDepth": 0.32,
      "consensusStrength": 0.35,
      "challengerPressure": 0.33,
      "bayesianUpdate": 0.37,
      "evidenceGrounding": 0.37,
      "fluencyBias": 0.52,
      "teamCoordination": 0.37,
      "priorConfidence": 0.32,
      "contradictionRate": 0.52,
      "domainKind": "biology",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 40.61,
      "debateIntegrity": 12.42,
      "gameScore": 18.47,
      "hallucinationResistance": 17.61,
      "planCoherence": 1.97,
      "overall": 18.76
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.34,
      "debateIntegrity": 15.01,
      "gameScore": 15.37,
      "hallucinationResistance": 8.98,
      "planCoherence": 0,
      "overall": 11.25
    }
  },
  {
    "id": "rfs-008",
    "input": {
      "ruleCoverage": 0.34,
      "debateDepth": 0.36,
      "consensusStrength": 0.39,
      "challengerPressure": 0.37,
      "bayesianUpdate": 0.33,
      "evidenceGrounding": 0.33,
      "fluencyBias": 0.52,
      "teamCoordination": 0.33,
      "priorConfidence": 0.36,
      "contradictionRate": 0.52,
      "domainKind": "math",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 39.33,
      "debateIntegrity": 14.69,
      "gameScore": 16.78,
      "hallucinationResistance": 16.76,
      "planCoherence": 3.24,
      "overall": 18.66
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 20.35,
      "debateIntegrity": 14.8,
      "gameScore": 16.91,
      "hallucinationResistance": 10.21,
      "planCoherence": 0,
      "overall": 11.98
    }
  },
  {
    "id": "rfs-009",
    "input": {
      "ruleCoverage": 0.38,
      "debateDepth": 0.4,
      "consensusStrength": 0.38,
      "challengerPressure": 0.41,
      "bayesianUpdate": 0.37,
      "evidenceGrounding": 0.38,
      "fluencyBias": 0.46,
      "teamCoordination": 0.38,
      "priorConfidence": 0.35,
      "contradictionRate": 0.46,
      "domainKind": "materials",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 64.06,
      "debateIntegrity": 51.06,
      "gameScore": 42.01,
      "hallucinationResistance": 59.85,
      "planCoherence": 48.26,
      "overall": 52.98
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 18.99,
      "debateIntegrity": 12.21,
      "gameScore": 14.14,
      "hallucinationResistance": 8.31,
      "planCoherence": 0,
      "overall": 10.21
    }
  },
  {
    "id": "rfs-010",
    "input": {
      "ruleCoverage": 0.43,
      "debateDepth": 0.37,
      "consensusStrength": 0.42,
      "challengerPressure": 0.37,
      "bayesianUpdate": 0.41,
      "evidenceGrounding": 0.42,
      "fluencyBias": 0.46,
      "teamCoordination": 0.42,
      "priorConfidence": 0.39,
      "contradictionRate": 0.46,
      "domainKind": "physics",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 45.69,
      "debateIntegrity": 17.39,
      "gameScore": 24,
      "hallucinationResistance": 24.05,
      "planCoherence": 7.96,
      "overall": 24.33
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.64,
      "debateIntegrity": 14.44,
      "gameScore": 14.39,
      "hallucinationResistance": 8.37,
      "planCoherence": 0,
      "overall": 10.81
    }
  },
  {
    "id": "rfs-011",
    "input": {
      "ruleCoverage": 0.47,
      "debateDepth": 0.41,
      "consensusStrength": 0.46,
      "challengerPressure": 0.41,
      "bayesianUpdate": 0.46,
      "evidenceGrounding": 0.46,
      "fluencyBias": 0.46,
      "teamCoordination": 0.46,
      "priorConfidence": 0.43,
      "contradictionRate": 0.46,
      "domainKind": "chemistry",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 47.3,
      "debateIntegrity": 19.66,
      "gameScore": 26.9,
      "hallucinationResistance": 25.53,
      "planCoherence": 10.01,
      "overall": 26.41
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.8,
      "debateIntegrity": 14.19,
      "gameScore": 13.98,
      "hallucinationResistance": 8.09,
      "planCoherence": 0,
      "overall": 10.63
    }
  },
  {
    "id": "rfs-012",
    "input": {
      "ruleCoverage": 0.44,
      "debateDepth": 0.45,
      "consensusStrength": 0.44,
      "challengerPressure": 0.45,
      "bayesianUpdate": 0.42,
      "evidenceGrounding": 0.43,
      "fluencyBias": 0.4,
      "teamCoordination": 0.43,
      "priorConfidence": 0.42,
      "contradictionRate": 0.4,
      "domainKind": "biology",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 68.01,
      "debateIntegrity": 55.14,
      "gameScore": 46.78,
      "hallucinationResistance": 64.51,
      "planCoherence": 52.54,
      "overall": 57.33
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.17,
      "debateIntegrity": 11.6,
      "gameScore": 13.01,
      "hallucinationResistance": 7.71,
      "planCoherence": 0,
      "overall": 9.72
    }
  },
  {
    "id": "rfs-013",
    "input": {
      "ruleCoverage": 0.48,
      "debateDepth": 0.48,
      "consensusStrength": 0.48,
      "challengerPressure": 0.49,
      "bayesianUpdate": 0.46,
      "evidenceGrounding": 0.47,
      "fluencyBias": 0.4,
      "teamCoordination": 0.47,
      "priorConfidence": 0.46,
      "contradictionRate": 0.4,
      "domainKind": "math",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 48.79,
      "debateIntegrity": 25.1,
      "gameScore": 29.6,
      "hallucinationResistance": 29.81,
      "planCoherence": 14.09,
      "overall": 30.01
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.29,
      "debateIntegrity": 11.63,
      "gameScore": 12.76,
      "hallucinationResistance": 7.44,
      "planCoherence": 0,
      "overall": 9.62
    }
  },
  {
    "id": "rfs-014",
    "input": {
      "ruleCoverage": 0.52,
      "debateDepth": 0.52,
      "consensusStrength": 0.53,
      "challengerPressure": 0.53,
      "bayesianUpdate": 0.51,
      "evidenceGrounding": 0.51,
      "fluencyBias": 0.4,
      "teamCoordination": 0.51,
      "priorConfidence": 0.5,
      "contradictionRate": 0.4,
      "domainKind": "materials",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 50.79,
      "debateIntegrity": 27.51,
      "gameScore": 32.71,
      "hallucinationResistance": 31.55,
      "planCoherence": 16.51,
      "overall": 32.36
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.35,
      "debateIntegrity": 11.33,
      "gameScore": 12.31,
      "hallucinationResistance": 7.12,
      "planCoherence": 0,
      "overall": 9.39
    }
  },
  {
    "id": "rfs-015",
    "input": {
      "ruleCoverage": 0.57,
      "debateDepth": 0.49,
      "consensusStrength": 0.51,
      "challengerPressure": 0.5,
      "bayesianUpdate": 0.55,
      "evidenceGrounding": 0.56,
      "fluencyBias": 0.34,
      "teamCoordination": 0.56,
      "priorConfidence": 0.49,
      "contradictionRate": 0.34,
      "domainKind": "physics",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 80.12,
      "debateIntegrity": 61.99,
      "gameScore": 59.65,
      "hallucinationResistance": 77.09,
      "planCoherence": 62.12,
      "overall": 68.14
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 18.36,
      "debateIntegrity": 11.19,
      "gameScore": 10.16,
      "hallucinationResistance": 5.67,
      "planCoherence": 0,
      "overall": 8.4
    }
  },
  {
    "id": "rfs-016",
    "input": {
      "ruleCoverage": 0.53,
      "debateDepth": 0.53,
      "consensusStrength": 0.55,
      "challengerPressure": 0.54,
      "bayesianUpdate": 0.51,
      "evidenceGrounding": 0.52,
      "fluencyBias": 0.35,
      "teamCoordination": 0.52,
      "priorConfidence": 0.53,
      "contradictionRate": 0.35,
      "domainKind": "chemistry",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 51.74,
      "debateIntegrity": 29.26,
      "gameScore": 34.37,
      "hallucinationResistance": 34.45,
      "planCoherence": 19.16,
      "overall": 34.3
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.44,
      "debateIntegrity": 11.02,
      "gameScore": 11.75,
      "hallucinationResistance": 6.98,
      "planCoherence": 0,
      "overall": 9.19
    }
  },
  {
    "id": "rfs-017",
    "input": {
      "ruleCoverage": 0.58,
      "debateDepth": 0.57,
      "consensusStrength": 0.59,
      "challengerPressure": 0.58,
      "bayesianUpdate": 0.55,
      "evidenceGrounding": 0.57,
      "fluencyBias": 0.35,
      "teamCoordination": 0.57,
      "priorConfidence": 0.58,
      "contradictionRate": 0.35,
      "domainKind": "biology",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 54.21,
      "debateIntegrity": 31.63,
      "gameScore": 37.29,
      "hallucinationResistance": 36.52,
      "planCoherence": 21.19,
      "overall": 36.7
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.49,
      "debateIntegrity": 10.93,
      "gameScore": 11.55,
      "hallucinationResistance": 6.62,
      "planCoherence": 0,
      "overall": 9.04
    }
  },
  {
    "id": "rfs-018",
    "input": {
      "ruleCoverage": 0.62,
      "debateDepth": 0.61,
      "consensusStrength": 0.58,
      "challengerPressure": 0.62,
      "bayesianUpdate": 0.6,
      "evidenceGrounding": 0.61,
      "fluencyBias": 0.29,
      "teamCoordination": 0.61,
      "priorConfidence": 0.56,
      "contradictionRate": 0.29,
      "domainKind": "math",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 83.48,
      "debateIntegrity": 71.74,
      "gameScore": 65,
      "hallucinationResistance": 82.36,
      "planCoherence": 68.21,
      "overall": 74.16
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 17.63,
      "debateIntegrity": 8.14,
      "gameScore": 8.69,
      "hallucinationResistance": 4.81,
      "planCoherence": 0,
      "overall": 7.16
    }
  },
  {
    "id": "rfs-019",
    "input": {
      "ruleCoverage": 0.66,
      "debateDepth": 0.64,
      "consensusStrength": 0.62,
      "challengerPressure": 0.66,
      "bayesianUpdate": 0.64,
      "evidenceGrounding": 0.65,
      "fluencyBias": 0.29,
      "teamCoordination": 0.65,
      "priorConfidence": 0.6,
      "contradictionRate": 0.29,
      "domainKind": "materials",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 60.09,
      "debateIntegrity": 37.71,
      "gameScore": 45.22,
      "hallucinationResistance": 43.98,
      "planCoherence": 26.87,
      "overall": 43.36
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 17.59,
      "debateIntegrity": 8.07,
      "gameScore": 8.38,
      "hallucinationResistance": 4.5,
      "planCoherence": 0,
      "overall": 7
    }
  },
  {
    "id": "rfs-020",
    "input": {
      "ruleCoverage": 0.63,
      "debateDepth": 0.61,
      "consensusStrength": 0.66,
      "challengerPressure": 0.62,
      "bayesianUpdate": 0.6,
      "evidenceGrounding": 0.62,
      "fluencyBias": 0.29,
      "teamCoordination": 0.62,
      "priorConfidence": 0.65,
      "contradictionRate": 0.29,
      "domainKind": "physics",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 59.35,
      "debateIntegrity": 36.71,
      "gameScore": 43.69,
      "hallucinationResistance": 43.53,
      "planCoherence": 27.95,
      "overall": 42.74
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 19.45,
      "debateIntegrity": 10.37,
      "gameScore": 10.36,
      "hallucinationResistance": 6.11,
      "planCoherence": 0,
      "overall": 8.54
    }
  },
  {
    "id": "rfs-021",
    "input": {
      "ruleCoverage": 0.67,
      "debateDepth": 0.65,
      "consensusStrength": 0.64,
      "challengerPressure": 0.66,
      "bayesianUpdate": 0.65,
      "evidenceGrounding": 0.66,
      "fluencyBias": 0.23,
      "teamCoordination": 0.66,
      "priorConfidence": 0.63,
      "contradictionRate": 0.23,
      "domainKind": "chemistry",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 86.85,
      "debateIntegrity": 75.17,
      "gameScore": 69.57,
      "hallucinationResistance": 86.64,
      "planCoherence": 72.13,
      "overall": 78.08
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 17.51,
      "debateIntegrity": 7.59,
      "gameScore": 7.55,
      "hallucinationResistance": 4.34,
      "planCoherence": 0,
      "overall": 6.67
    }
  },
  {
    "id": "rfs-022",
    "input": {
      "ruleCoverage": 0.72,
      "debateDepth": 0.69,
      "consensusStrength": 0.68,
      "challengerPressure": 0.7,
      "bayesianUpdate": 0.69,
      "evidenceGrounding": 0.7,
      "fluencyBias": 0.23,
      "teamCoordination": 0.7,
      "priorConfidence": 0.67,
      "contradictionRate": 0.23,
      "domainKind": "biology",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 63.35,
      "debateIntegrity": 41.76,
      "gameScore": 49.94,
      "hallucinationResistance": 48.89,
      "planCoherence": 31.73,
      "overall": 47.7
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 17.16,
      "debateIntegrity": 7.17,
      "gameScore": 7.18,
      "hallucinationResistance": 3.85,
      "planCoherence": 0,
      "overall": 6.34
    }
  },
  {
    "id": "rfs-023",
    "input": {
      "ruleCoverage": 0.76,
      "debateDepth": 0.73,
      "consensusStrength": 0.73,
      "challengerPressure": 0.74,
      "bayesianUpdate": 0.73,
      "evidenceGrounding": 0.75,
      "fluencyBias": 0.23,
      "teamCoordination": 0.75,
      "priorConfidence": 0.72,
      "contradictionRate": 0.23,
      "domainKind": "math",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 67.21,
      "debateIntegrity": 45.33,
      "gameScore": 54.26,
      "hallucinationResistance": 52.69,
      "planCoherence": 35.44,
      "overall": 51.56
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 17.18,
      "debateIntegrity": 6.96,
      "gameScore": 6.9,
      "hallucinationResistance": 3.57,
      "planCoherence": 0,
      "overall": 6.17
    }
  },
  {
    "id": "rfs-024",
    "input": {
      "ruleCoverage": 0.73,
      "debateDepth": 0.77,
      "consensusStrength": 0.71,
      "challengerPressure": 0.78,
      "bayesianUpdate": 0.69,
      "evidenceGrounding": 0.71,
      "fluencyBias": 0.17,
      "teamCoordination": 0.71,
      "priorConfidence": 0.7,
      "contradictionRate": 0.17,
      "domainKind": "materials",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 91.41,
      "debateIntegrity": 85.45,
      "gameScore": 75.13,
      "hallucinationResistance": 93.2,
      "planCoherence": 79.03,
      "overall": 84.89
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 16.04,
      "debateIntegrity": 4.26,
      "gameScore": 5.95,
      "hallucinationResistance": 3.23,
      "planCoherence": 0,
      "overall": 5.18
    }
  },
  {
    "id": "rfs-025",
    "input": {
      "ruleCoverage": 0.77,
      "debateDepth": 0.73,
      "consensusStrength": 0.75,
      "challengerPressure": 0.75,
      "bayesianUpdate": 0.74,
      "evidenceGrounding": 0.75,
      "fluencyBias": 0.17,
      "teamCoordination": 0.75,
      "priorConfidence": 0.74,
      "contradictionRate": 0.17,
      "domainKind": "physics",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 68.75,
      "debateIntegrity": 47.24,
      "gameScore": 56.75,
      "hallucinationResistance": 56.37,
      "planCoherence": 38.98,
      "overall": 54.14
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 16.76,
      "debateIntegrity": 6.46,
      "gameScore": 5.95,
      "hallucinationResistance": 3.33,
      "planCoherence": 0,
      "overall": 5.75
    }
  },
  {
    "id": "rfs-026",
    "input": {
      "ruleCoverage": 0.81,
      "debateDepth": 0.77,
      "consensusStrength": 0.79,
      "challengerPressure": 0.79,
      "bayesianUpdate": 0.78,
      "evidenceGrounding": 0.8,
      "fluencyBias": 0.18,
      "teamCoordination": 0.8,
      "priorConfidence": 0.79,
      "contradictionRate": 0.18,
      "domainKind": "chemistry",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 69.99,
      "debateIntegrity": 48.82,
      "gameScore": 58.72,
      "hallucinationResistance": 56.98,
      "planCoherence": 39.83,
      "overall": 55.43
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 16.81,
      "debateIntegrity": 6.35,
      "gameScore": 5.84,
      "hallucinationResistance": 3.08,
      "planCoherence": 0,
      "overall": 5.65
    }
  },
  {
    "id": "rfs-027",
    "input": {
      "ruleCoverage": 0.86,
      "debateDepth": 0.81,
      "consensusStrength": 0.77,
      "challengerPressure": 0.83,
      "bayesianUpdate": 0.82,
      "evidenceGrounding": 0.84,
      "fluencyBias": 0.12,
      "teamCoordination": 0.84,
      "priorConfidence": 0.77,
      "contradictionRate": 0.12,
      "domainKind": "biology",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 100,
      "debateIntegrity": 89.62,
      "gameScore": 85.42,
      "hallucinationResistance": 100,
      "planCoherence": 84.34,
      "overall": 92
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 14.54,
      "debateIntegrity": 3.65,
      "gameScore": 3.32,
      "hallucinationResistance": 1.34,
      "planCoherence": 0,
      "overall": 3.82
    }
  },
  {
    "id": "rfs-028",
    "input": {
      "ruleCoverage": 0.82,
      "debateDepth": 0.85,
      "consensusStrength": 0.82,
      "challengerPressure": 0.87,
      "bayesianUpdate": 0.78,
      "evidenceGrounding": 0.8,
      "fluencyBias": 0.12,
      "teamCoordination": 0.8,
      "priorConfidence": 0.81,
      "contradictionRate": 0.12,
      "domainKind": "math",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 71.51,
      "debateIntegrity": 54.94,
      "gameScore": 61.52,
      "hallucinationResistance": 61.34,
      "planCoherence": 44.63,
      "overall": 59.33
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 15.25,
      "debateIntegrity": 3.13,
      "gameScore": 4.46,
      "hallucinationResistance": 2.35,
      "planCoherence": 0,
      "overall": 4.31
    }
  },
  {
    "id": "rfs-029",
    "input": {
      "ruleCoverage": 0.87,
      "debateDepth": 0.89,
      "consensusStrength": 0.86,
      "challengerPressure": 0.91,
      "bayesianUpdate": 0.83,
      "evidenceGrounding": 0.85,
      "fluencyBias": 0.12,
      "teamCoordination": 0.85,
      "priorConfidence": 0.86,
      "contradictionRate": 0.12,
      "domainKind": "materials",
      "plan": "single_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 73.86,
      "debateIntegrity": 57.1,
      "gameScore": 64.56,
      "hallucinationResistance": 63.13,
      "planCoherence": 46.42,
      "overall": 61.59
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 14.92,
      "debateIntegrity": 2.8,
      "gameScore": 3.97,
      "hallucinationResistance": 1.88,
      "planCoherence": 0,
      "overall": 3.97
    }
  },
  {
    "id": "rfs-030",
    "input": {
      "ruleCoverage": 0.91,
      "debateDepth": 0.85,
      "consensusStrength": 0.84,
      "challengerPressure": 0.87,
      "bayesianUpdate": 0.87,
      "evidenceGrounding": 0.89,
      "fluencyBias": 0.06,
      "teamCoordination": 0.89,
      "priorConfidence": 0.84,
      "contradictionRate": 0.06,
      "domainKind": "physics",
      "plan": "multi_agent"
    },
    "expectedMultiAgent": {
      "mode": "multi_agent",
      "ruleFidelity": 100,
      "debateIntegrity": 96.48,
      "gameScore": 93.24,
      "hallucinationResistance": 100,
      "planCoherence": 93.53,
      "overall": 96.7
    },
    "expectedSingleAgent": {
      "mode": "single_agent",
      "ruleFidelity": 13.9,
      "debateIntegrity": 2.86,
      "gameScore": 2.12,
      "hallucinationResistance": 0.84,
      "planCoherence": 0,
      "overall": 3.19
    }
  }
];
