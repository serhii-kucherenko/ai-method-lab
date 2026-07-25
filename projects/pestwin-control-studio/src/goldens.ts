import type { PestInput, PestQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PestInput;
  expectedMultiagent: PestQuality;
  expectedSpecies: PestQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pc-001",
    "input": {
      "agentCoverage": 0.29,
      "moduleCoordination": 0.25,
      "suppressionProxy": 0.28,
      "vectorPressureProxy": 0.34,
      "singleSpeciesBreadth": 0.39,
      "baselineOptimism": 0.45,
      "controlHardness": 0.59,
      "overclaimRisk": 0.5,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 22.73,
      "coordinationScore": 30.25,
      "suppressionScore": 23.66,
      "coverageIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "multiagentContribution": 28.08,
      "speciesContribution": 16.13,
      "overall": 29.93
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 5.76,
      "coordinationScore": 17.31,
      "suppressionScore": 13.1,
      "coverageIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "multiagentContribution": 21.9,
      "speciesContribution": 38.71,
      "overall": 27.29
    }
  },
  {
    "id": "pc-002",
    "input": {
      "agentCoverage": 0.33,
      "moduleCoordination": 0.29,
      "suppressionProxy": 0.32,
      "vectorPressureProxy": 0.38,
      "singleSpeciesBreadth": 0.43,
      "baselineOptimism": 0.46,
      "controlHardness": 0.6,
      "overclaimRisk": 0.51,
      "controlBias": "coverage_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 22.36,
      "coordinationScore": 33.9,
      "suppressionScore": 34.57,
      "coverageIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "multiagentContribution": 30.65,
      "speciesContribution": 18.79,
      "overall": 32.52
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 2.43,
      "coordinationScore": 18.44,
      "suppressionScore": 14.13,
      "coverageIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "multiagentContribution": 20.12,
      "speciesContribution": 34.65,
      "overall": 23.59
    }
  },
  {
    "id": "pc-003",
    "input": {
      "agentCoverage": 0.37,
      "moduleCoordination": 0.27,
      "suppressionProxy": 0.36,
      "vectorPressureProxy": 0.42,
      "singleSpeciesBreadth": 0.46,
      "baselineOptimism": 0.42,
      "controlHardness": 0.6,
      "overclaimRisk": 0.46,
      "controlBias": "species_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 12.32,
      "coordinationScore": 23.71,
      "suppressionScore": 21.13,
      "coverageIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "multiagentContribution": 19.04,
      "speciesContribution": 19.87,
      "overall": 20.19
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 12.17,
      "coordinationScore": 17.32,
      "suppressionScore": 13.1,
      "coverageIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "multiagentContribution": 26.17,
      "speciesContribution": 46.7,
      "overall": 34.62
    }
  },
  {
    "id": "pc-004",
    "input": {
      "agentCoverage": 0.33,
      "moduleCoordination": 0.32,
      "suppressionProxy": 0.39,
      "vectorPressureProxy": 0.38,
      "singleSpeciesBreadth": 0.42,
      "baselineOptimism": 0.43,
      "controlHardness": 0.53,
      "overclaimRisk": 0.46,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 28.24,
      "coordinationScore": 36.03,
      "suppressionScore": 33.23,
      "coverageIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "multiagentContribution": 34.58,
      "speciesContribution": 19.21,
      "overall": 35.81
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 8.7,
      "coordinationScore": 18.01,
      "suppressionScore": 14.03,
      "coverageIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "multiagentContribution": 23.26,
      "speciesContribution": 40.33,
      "overall": 29.57
    }
  },
  {
    "id": "pc-005",
    "input": {
      "agentCoverage": 0.37,
      "moduleCoordination": 0.36,
      "suppressionProxy": 0.35,
      "vectorPressureProxy": 0.42,
      "singleSpeciesBreadth": 0.46,
      "baselineOptimism": 0.45,
      "controlHardness": 0.53,
      "overclaimRisk": 0.47,
      "controlBias": "agent_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 26.98,
      "coordinationScore": 39.64,
      "suppressionScore": 21.55,
      "coverageIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "multiagentContribution": 34.51,
      "speciesContribution": 22.35,
      "overall": 36.32
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 0,
      "coordinationScore": 19.71,
      "suppressionScore": 15.65,
      "coverageIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "multiagentContribution": 20.62,
      "speciesContribution": 36.41,
      "overall": 25.88
    }
  },
  {
    "id": "pc-006",
    "input": {
      "agentCoverage": 0.41,
      "moduleCoordination": 0.34,
      "suppressionProxy": 0.39,
      "vectorPressureProxy": 0.45,
      "singleSpeciesBreadth": 0.5,
      "baselineOptimism": 0.4,
      "controlHardness": 0.54,
      "overclaimRisk": 0.42,
      "controlBias": "balanced",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 34.06,
      "coordinationScore": 39.5,
      "suppressionScore": 35.97,
      "coverageIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "multiagentContribution": 38.93,
      "speciesContribution": 23.51,
      "overall": 40.15
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 11.98,
      "coordinationScore": 18.2,
      "suppressionScore": 14.2,
      "coverageIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "multiagentContribution": 25.18,
      "speciesContribution": 43.27,
      "overall": 32.45
    }
  },
  {
    "id": "pc-007",
    "input": {
      "agentCoverage": 0.45,
      "moduleCoordination": 0.38,
      "suppressionProxy": 0.42,
      "vectorPressureProxy": 0.49,
      "singleSpeciesBreadth": 0.53,
      "baselineOptimism": 0.42,
      "controlHardness": 0.55,
      "overclaimRisk": 0.43,
      "controlBias": "coverage_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 31.69,
      "coordinationScore": 43.11,
      "suppressionScore": 48.5,
      "coverageIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "multiagentContribution": 40.82,
      "speciesContribution": 25.77,
      "overall": 42.11
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 8.27,
      "coordinationScore": 19.5,
      "suppressionScore": 15.44,
      "coverageIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "multiagentContribution": 22.74,
      "speciesContribution": 37.59,
      "overall": 27.34
    }
  },
  {
    "id": "pc-008",
    "input": {
      "agentCoverage": 0.41,
      "moduleCoordination": 0.43,
      "suppressionProxy": 0.46,
      "vectorPressureProxy": 0.45,
      "singleSpeciesBreadth": 0.49,
      "baselineOptimism": 0.43,
      "controlHardness": 0.47,
      "overclaimRisk": 0.44,
      "controlBias": "species_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 19.41,
      "coordinationScore": 35.43,
      "suppressionScore": 27.73,
      "coverageIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "multiagentContribution": 26.76,
      "speciesContribution": 25.34,
      "overall": 27.5
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 16.4,
      "coordinationScore": 20.32,
      "suppressionScore": 16.53,
      "coverageIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "multiagentContribution": 29.38,
      "speciesContribution": 51.02,
      "overall": 39.86
    }
  },
  {
    "id": "pc-009",
    "input": {
      "agentCoverage": 0.46,
      "moduleCoordination": 0.41,
      "suppressionProxy": 0.5,
      "vectorPressureProxy": 0.49,
      "singleSpeciesBreadth": 0.53,
      "baselineOptimism": 0.39,
      "controlHardness": 0.48,
      "overclaimRisk": 0.38,
      "controlBias": "balanced",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 40.13,
      "coordinationScore": 45.49,
      "suppressionScore": 45.77,
      "coverageIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "multiagentContribution": 45.74,
      "speciesContribution": 26.78,
      "overall": 46.33
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 14.91,
      "coordinationScore": 19.18,
      "suppressionScore": 15.47,
      "coverageIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "multiagentContribution": 26.76,
      "speciesContribution": 45.32,
      "overall": 35.12
    }
  },
  {
    "id": "pc-010",
    "input": {
      "agentCoverage": 0.5,
      "moduleCoordination": 0.45,
      "suppressionProxy": 0.46,
      "vectorPressureProxy": 0.53,
      "singleSpeciesBreadth": 0.57,
      "baselineOptimism": 0.4,
      "controlHardness": 0.49,
      "overclaimRisk": 0.39,
      "controlBias": "agent_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 36.69,
      "coordinationScore": 49.14,
      "suppressionScore": 30.74,
      "coverageIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "multiagentContribution": 44.64,
      "speciesContribution": 29.41,
      "overall": 45.9
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 3.59,
      "coordinationScore": 20.29,
      "suppressionScore": 16.48,
      "coverageIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "multiagentContribution": 22.59,
      "speciesContribution": 39.09,
      "overall": 29.2
    }
  },
  {
    "id": "pc-011",
    "input": {
      "agentCoverage": 0.54,
      "moduleCoordination": 0.49,
      "suppressionProxy": 0.49,
      "vectorPressureProxy": 0.57,
      "singleSpeciesBreadth": 0.6,
      "baselineOptimism": 0.42,
      "controlHardness": 0.49,
      "overclaimRisk": 0.4,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 47.29,
      "coordinationScore": 52.75,
      "suppressionScore": 47.28,
      "coverageIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "multiagentContribution": 51.45,
      "speciesContribution": 31.9,
      "overall": 51.93
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 17.1,
      "coordinationScore": 21.73,
      "suppressionScore": 17.88,
      "coverageIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "multiagentContribution": 29.88,
      "speciesContribution": 50.58,
      "overall": 39.71
    }
  },
  {
    "id": "pc-012",
    "input": {
      "agentCoverage": 0.5,
      "moduleCoordination": 0.48,
      "suppressionProxy": 0.53,
      "vectorPressureProxy": 0.53,
      "singleSpeciesBreadth": 0.56,
      "baselineOptimism": 0.37,
      "controlHardness": 0.42,
      "overclaimRisk": 0.35,
      "controlBias": "coverage_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 38.25,
      "coordinationScore": 51.28,
      "suppressionScore": 62.01,
      "coverageIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "multiagentContribution": 49.26,
      "speciesContribution": 29.77,
      "overall": 49.75
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 13.23,
      "coordinationScore": 19.78,
      "suppressionScore": 16.29,
      "coverageIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "multiagentContribution": 24,
      "speciesContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "pc-013",
    "input": {
      "agentCoverage": 0.54,
      "moduleCoordination": 0.52,
      "suppressionProxy": 0.56,
      "vectorPressureProxy": 0.57,
      "singleSpeciesBreadth": 0.6,
      "baselineOptimism": 0.39,
      "controlHardness": 0.42,
      "overclaimRisk": 0.36,
      "controlBias": "species_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 29.19,
      "coordinationScore": 44.88,
      "suppressionScore": 36.66,
      "coverageIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "multiagentContribution": 35.81,
      "speciesContribution": 32.88,
      "overall": 36.28
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 22.62,
      "coordinationScore": 21.45,
      "suppressionScore": 17.86,
      "coverageIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "multiagentContribution": 33.34,
      "speciesContribution": 57.32,
      "overall": 46.52
    }
  },
  {
    "id": "pc-014",
    "input": {
      "agentCoverage": 0.58,
      "moduleCoordination": 0.56,
      "suppressionProxy": 0.6,
      "vectorPressureProxy": 0.61,
      "singleSpeciesBreadth": 0.63,
      "baselineOptimism": 0.4,
      "controlHardness": 0.43,
      "overclaimRisk": 0.36,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 52.7,
      "coordinationScore": 58.53,
      "suppressionScore": 56.74,
      "coverageIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "multiagentContribution": 57.91,
      "speciesContribution": 34.87,
      "overall": 57.76
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 20.03,
      "coordinationScore": 22.29,
      "suppressionScore": 18.65,
      "coverageIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "multiagentContribution": 31.18,
      "speciesContribution": 52.13,
      "overall": 41.92
    }
  },
  {
    "id": "pc-015",
    "input": {
      "agentCoverage": 0.62,
      "moduleCoordination": 0.54,
      "suppressionProxy": 0.56,
      "vectorPressureProxy": 0.65,
      "singleSpeciesBreadth": 0.67,
      "baselineOptimism": 0.36,
      "controlHardness": 0.44,
      "overclaimRisk": 0.31,
      "controlBias": "agent_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 45.96,
      "coordinationScore": 58.35,
      "suppressionScore": 39.38,
      "coverageIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "multiagentContribution": 54.57,
      "speciesContribution": 36.3,
      "overall": 55.28
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 9.43,
      "coordinationScore": 21.24,
      "suppressionScore": 17.6,
      "coverageIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "multiagentContribution": 25.15,
      "speciesContribution": 41.95,
      "overall": 32.87
    }
  },
  {
    "id": "pc-016",
    "input": {
      "agentCoverage": 0.58,
      "moduleCoordination": 0.59,
      "suppressionProxy": 0.6,
      "vectorPressureProxy": 0.6,
      "singleSpeciesBreadth": 0.63,
      "baselineOptimism": 0.37,
      "controlHardness": 0.36,
      "overclaimRisk": 0.32,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 54.5,
      "coordinationScore": 60.67,
      "suppressionScore": 57.91,
      "coverageIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "multiagentContribution": 59.26,
      "speciesContribution": 35.81,
      "overall": 59.04
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 22.05,
      "coordinationScore": 21.96,
      "suppressionScore": 18.63,
      "coverageIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "multiagentContribution": 31.3,
      "speciesContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "pc-017",
    "input": {
      "agentCoverage": 0.62,
      "moduleCoordination": 0.63,
      "suppressionProxy": 0.63,
      "vectorPressureProxy": 0.64,
      "singleSpeciesBreadth": 0.67,
      "baselineOptimism": 0.39,
      "controlHardness": 0.37,
      "overclaimRisk": 0.33,
      "controlBias": "coverage_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 48.47,
      "coordinationScore": 64.28,
      "suppressionScore": 75.18,
      "coverageIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "multiagentContribution": 60.69,
      "speciesContribution": 38.66,
      "overall": 60.72
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 18.73,
      "coordinationScore": 23.48,
      "suppressionScore": 20.01,
      "coverageIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "multiagentContribution": 28.44,
      "speciesContribution": 44.27,
      "overall": 35.85
    }
  },
  {
    "id": "pc-018",
    "input": {
      "agentCoverage": 0.66,
      "moduleCoordination": 0.61,
      "suppressionProxy": 0.67,
      "vectorPressureProxy": 0.68,
      "singleSpeciesBreadth": 0.7,
      "baselineOptimism": 0.34,
      "controlHardness": 0.38,
      "overclaimRisk": 0.27,
      "controlBias": "species_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 38.37,
      "coordinationScore": 54.13,
      "suppressionScore": 45.57,
      "coverageIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "multiagentContribution": 44.55,
      "speciesContribution": 39.21,
      "overall": 44.59
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 28.36,
      "coordinationScore": 21.72,
      "suppressionScore": 18.33,
      "coverageIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "multiagentContribution": 36.47,
      "speciesContribution": 62.28,
      "overall": 51.94
    }
  },
  {
    "id": "pc-019",
    "input": {
      "agentCoverage": 0.7,
      "moduleCoordination": 0.65,
      "suppressionProxy": 0.7,
      "vectorPressureProxy": 0.72,
      "singleSpeciesBreadth": 0.74,
      "baselineOptimism": 0.36,
      "controlHardness": 0.38,
      "overclaimRisk": 0.28,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 63.85,
      "coordinationScore": 67.74,
      "suppressionScore": 68.21,
      "coverageIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "multiagentContribution": 68.47,
      "speciesContribution": 42.3,
      "overall": 67.76
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 26.25,
      "coordinationScore": 23.38,
      "suppressionScore": 19.89,
      "coverageIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "multiagentContribution": 34.65,
      "speciesContribution": 57.03,
      "overall": 47.39
    }
  },
  {
    "id": "pc-020",
    "input": {
      "agentCoverage": 0.66,
      "moduleCoordination": 0.7,
      "suppressionProxy": 0.66,
      "vectorPressureProxy": 0.68,
      "singleSpeciesBreadth": 0.7,
      "baselineOptimism": 0.37,
      "controlHardness": 0.31,
      "overclaimRisk": 0.29,
      "controlBias": "agent_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 52.89,
      "coordinationScore": 70.06,
      "suppressionScore": 45.78,
      "coverageIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "multiagentContribution": 62.48,
      "speciesContribution": 41.57,
      "overall": 62.72
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 13.66,
      "coordinationScore": 23.97,
      "suppressionScore": 20.71,
      "coverageIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "multiagentContribution": 27.94,
      "speciesContribution": 45.32,
      "overall": 37.28
    }
  },
  {
    "id": "pc-021",
    "input": {
      "agentCoverage": 0.7,
      "moduleCoordination": 0.68,
      "suppressionProxy": 0.7,
      "vectorPressureProxy": 0.72,
      "singleSpeciesBreadth": 0.73,
      "baselineOptimism": 0.33,
      "controlHardness": 0.31,
      "overclaimRisk": 0.24,
      "controlBias": "balanced",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 65.63,
      "coordinationScore": 69.88,
      "suppressionScore": 69.36,
      "coverageIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "multiagentContribution": 69.94,
      "speciesContribution": 42.58,
      "overall": 69.02
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 27.89,
      "coordinationScore": 22.77,
      "suppressionScore": 19.58,
      "coverageIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "multiagentContribution": 34.36,
      "speciesContribution": 55.95,
      "overall": 47.28
    }
  },
  {
    "id": "pc-022",
    "input": {
      "agentCoverage": 0.74,
      "moduleCoordination": 0.72,
      "suppressionProxy": 0.73,
      "vectorPressureProxy": 0.76,
      "singleSpeciesBreadth": 0.77,
      "baselineOptimism": 0.34,
      "controlHardness": 0.32,
      "overclaimRisk": 0.25,
      "controlBias": "coverage_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 57.64,
      "coordinationScore": 73.52,
      "suppressionScore": 88.9,
      "coverageIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "multiagentContribution": 70.84,
      "speciesContribution": 45.19,
      "overall": 70.22
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 24.57,
      "coordinationScore": 23.84,
      "suppressionScore": 20.54,
      "coverageIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "multiagentContribution": 30.64,
      "speciesContribution": 46.59,
      "overall": 39.02
    }
  },
  {
    "id": "pc-023",
    "input": {
      "agentCoverage": 0.79,
      "moduleCoordination": 0.76,
      "suppressionProxy": 0.77,
      "vectorPressureProxy": 0.8,
      "singleSpeciesBreadth": 0.81,
      "baselineOptimism": 0.36,
      "controlHardness": 0.33,
      "overclaimRisk": 0.25,
      "controlBias": "species_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 49.06,
      "coordinationScore": 67.38,
      "suppressionScore": 53.76,
      "coverageIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "multiagentContribution": 54.87,
      "speciesContribution": 48.05,
      "overall": 54.64
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 33.86,
      "coordinationScore": 25.27,
      "suppressionScore": 21.93,
      "coverageIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "multiagentContribution": 41.94,
      "speciesContribution": 71.35,
      "overall": 60.74
    }
  },
  {
    "id": "pc-024",
    "input": {
      "agentCoverage": 0.75,
      "moduleCoordination": 0.75,
      "suppressionProxy": 0.81,
      "vectorPressureProxy": 0.76,
      "singleSpeciesBreadth": 0.77,
      "baselineOptimism": 0.31,
      "controlHardness": 0.25,
      "overclaimRisk": 0.2,
      "controlBias": "balanced",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 71.56,
      "coordinationScore": 75.91,
      "suppressionScore": 79.01,
      "coverageIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "multiagentContribution": 76.67,
      "speciesContribution": 46.08,
      "overall": 75.16
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 31.21,
      "coordinationScore": 23.38,
      "suppressionScore": 20.41,
      "coverageIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "multiagentContribution": 35.95,
      "speciesContribution": 57.97,
      "overall": 49.93
    }
  },
  {
    "id": "pc-025",
    "input": {
      "agentCoverage": 0.79,
      "moduleCoordination": 0.79,
      "suppressionProxy": 0.77,
      "vectorPressureProxy": 0.8,
      "singleSpeciesBreadth": 0.8,
      "baselineOptimism": 0.33,
      "controlHardness": 0.26,
      "overclaimRisk": 0.21,
      "controlBias": "agent_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 62.53,
      "coordinationScore": 79.52,
      "suppressionScore": 54.88,
      "coverageIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "multiagentContribution": 72.71,
      "speciesContribution": 48.29,
      "overall": 72.31
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 19.5,
      "coordinationScore": 24.62,
      "suppressionScore": 21.57,
      "coverageIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "multiagentContribution": 30.37,
      "speciesContribution": 48.07,
      "overall": 40.84
    }
  },
  {
    "id": "pc-026",
    "input": {
      "agentCoverage": 0.83,
      "moduleCoordination": 0.83,
      "suppressionProxy": 0.8,
      "vectorPressureProxy": 0.83,
      "singleSpeciesBreadth": 0.84,
      "baselineOptimism": 0.34,
      "controlHardness": 0.27,
      "overclaimRisk": 0.22,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 78.52,
      "coordinationScore": 83.17,
      "suppressionScore": 80.3,
      "coverageIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "multiagentContribution": 82.15,
      "speciesContribution": 50.87,
      "overall": 80.52
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 33.17,
      "coordinationScore": 25.67,
      "suppressionScore": 22.55,
      "coverageIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "multiagentContribution": 38.9,
      "speciesContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "pc-027",
    "input": {
      "agentCoverage": 0.87,
      "moduleCoordination": 0.81,
      "suppressionProxy": 0.84,
      "vectorPressureProxy": 0.87,
      "singleSpeciesBreadth": 0.88,
      "baselineOptimism": 0.3,
      "controlHardness": 0.27,
      "overclaimRisk": 0.17,
      "controlBias": "coverage_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 67.26,
      "coordinationScore": 82.98,
      "suppressionScore": 100,
      "coverageIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "multiagentContribution": 80.38,
      "speciesContribution": 52.5,
      "overall": 79.36
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 30.78,
      "coordinationScore": 24.7,
      "suppressionScore": 21.6,
      "coverageIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "multiagentContribution": 33.38,
      "speciesContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "pc-028",
    "input": {
      "agentCoverage": 0.83,
      "moduleCoordination": 0.86,
      "suppressionProxy": 0.87,
      "vectorPressureProxy": 0.83,
      "singleSpeciesBreadth": 0.84,
      "baselineOptimism": 0.31,
      "controlHardness": 0.2,
      "overclaimRisk": 0.17,
      "controlBias": "species_first",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 54.87,
      "coordinationScore": 75.3,
      "suppressionScore": 60.62,
      "coverageIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "multiagentContribution": 61.08,
      "speciesContribution": 51.73,
      "overall": 60.4
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 38.81,
      "coordinationScore": 25.25,
      "suppressionScore": 22.37,
      "coverageIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "multiagentContribution": 43.37,
      "speciesContribution": 72.59,
      "overall": 63.54
    }
  },
  {
    "id": "pc-029",
    "input": {
      "agentCoverage": 0.87,
      "moduleCoordination": 0.9,
      "suppressionProxy": 0.91,
      "vectorPressureProxy": 0.87,
      "singleSpeciesBreadth": 0.87,
      "baselineOptimism": 0.33,
      "controlHardness": 0.2,
      "overclaimRisk": 0.18,
      "controlBias": "balanced",
      "profile": "modular_multiagent_pest_control"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 83.89,
      "coordinationScore": 88.91,
      "suppressionScore": 89.72,
      "coverageIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "multiagentContribution": 88.57,
      "speciesContribution": 54.16,
      "overall": 86.38
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 36.33,
      "coordinationScore": 26.6,
      "suppressionScore": 23.66,
      "coverageIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "multiagentContribution": 40.53,
      "speciesContribution": 65.08,
      "overall": 57
    }
  },
  {
    "id": "pc-030",
    "input": {
      "agentCoverage": 0.91,
      "moduleCoordination": 0.88,
      "suppressionProxy": 0.87,
      "vectorPressureProxy": 0.91,
      "singleSpeciesBreadth": 0.91,
      "baselineOptimism": 0.28,
      "controlHardness": 0.21,
      "overclaimRisk": 0.13,
      "controlBias": "agent_first",
      "profile": "single_species_baseline"
    },
    "expectedMultiagent": {
      "mode": "modular_multiagent_pest_control",
      "agentScore": 71.59,
      "coordinationScore": 88.77,
      "suppressionScore": 63.26,
      "coverageIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "multiagentContribution": 79.63,
      "speciesContribution": 55.31,
      "overall": 79.25
    },
    "expectedSpecies": {
      "mode": "single_species_baseline",
      "agentScore": 25.72,
      "coordinationScore": 25.06,
      "suppressionScore": 22.14,
      "coverageIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "multiagentContribution": 32.83,
      "speciesContribution": 50.68,
      "overall": 44.29
    }
  }
];
