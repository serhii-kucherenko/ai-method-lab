import type { PbpkInput, PbpkQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PbpkInput;
  expectedStructureOnly: PbpkQuality;
  expectedMeasuredLab: PbpkQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pbpk-001",
    "input": {
      "structureCoverage": 0.29,
      "topologyFidelity": 0.25,
      "admeClarity": 0.28,
      "compileStability": 0.34,
      "labPassRate": 0.39,
      "labOptimism": 0.45,
      "topologyHardness": 0.59,
      "overclaimRisk": 0.5,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 22.56,
      "topologyScore": 30.25,
      "admeScore": 23.49,
      "compileScore": 37.64,
      "labScore": 16.4,
      "confidence": 19.35,
      "structureOnlyContribution": 27.98,
      "measuredLabContribution": 15.96,
      "overall": 29.82
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 5.76,
      "topologyScore": 17.09,
      "admeScore": 13.13,
      "compileScore": 32.39,
      "labScore": 40.93,
      "confidence": 17.1,
      "structureOnlyContribution": 21.86,
      "measuredLabContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "pbpk-002",
    "input": {
      "structureCoverage": 0.33,
      "topologyFidelity": 0.29,
      "admeClarity": 0.32,
      "compileStability": 0.38,
      "labPassRate": 0.43,
      "labOptimism": 0.46,
      "topologyHardness": 0.6,
      "overclaimRisk": 0.51,
      "pbpkBias": "adme_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 22.22,
      "topologyScore": 33.9,
      "admeScore": 34.39,
      "compileScore": 31.9,
      "labScore": 18.89,
      "confidence": 23,
      "structureOnlyContribution": 30.56,
      "measuredLabContribution": 18.61,
      "overall": 32.41
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 2.43,
      "topologyScore": 18.22,
      "admeScore": 14.16,
      "compileScore": 34.08,
      "labScore": 31.53,
      "confidence": 18.65,
      "structureOnlyContribution": 20.08,
      "measuredLabContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "pbpk-003",
    "input": {
      "structureCoverage": 0.37,
      "topologyFidelity": 0.27,
      "admeClarity": 0.36,
      "compileStability": 0.42,
      "labPassRate": 0.46,
      "labOptimism": 0.42,
      "topologyHardness": 0.6,
      "overclaimRisk": 0.46,
      "pbpkBias": "lab_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 12.18,
      "topologyScore": 23.71,
      "admeScore": 20.95,
      "compileScore": 19.24,
      "labScore": 19.94,
      "confidence": 25.6,
      "structureOnlyContribution": 18.96,
      "measuredLabContribution": 19.69,
      "overall": 20.09
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 12.17,
      "topologyScore": 17.1,
      "admeScore": 13.13,
      "compileScore": 33.93,
      "labScore": 54.34,
      "confidence": 18.4,
      "structureOnlyContribution": 26.13,
      "measuredLabContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "pbpk-004",
    "input": {
      "structureCoverage": 0.33,
      "topologyFidelity": 0.32,
      "admeClarity": 0.39,
      "compileStability": 0.38,
      "labPassRate": 0.42,
      "labOptimism": 0.43,
      "topologyHardness": 0.53,
      "overclaimRisk": 0.46,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 28.09,
      "topologyScore": 36.03,
      "admeScore": 33.07,
      "compileScore": 42.23,
      "labScore": 18.93,
      "confidence": 26.1,
      "structureOnlyContribution": 34.5,
      "measuredLabContribution": 19.05,
      "overall": 35.72
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 8.7,
      "topologyScore": 17.81,
      "admeScore": 13.75,
      "compileScore": 32.79,
      "labScore": 42.77,
      "confidence": 18.85,
      "structureOnlyContribution": 23.16,
      "measuredLabContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "pbpk-005",
    "input": {
      "structureCoverage": 0.37,
      "topologyFidelity": 0.36,
      "admeClarity": 0.35,
      "compileStability": 0.42,
      "labPassRate": 0.46,
      "labOptimism": 0.45,
      "topologyHardness": 0.53,
      "overclaimRisk": 0.47,
      "pbpkBias": "topology_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 26.86,
      "topologyScore": 39.64,
      "admeScore": 21.39,
      "compileScore": 54.3,
      "labScore": 21.8,
      "confidence": 27.6,
      "structureOnlyContribution": 34.43,
      "measuredLabContribution": 22.19,
      "overall": 36.23
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 0,
      "topologyScore": 19.51,
      "admeScore": 15.76,
      "compileScore": 34.77,
      "labScore": 32.95,
      "confidence": 21.05,
      "structureOnlyContribution": 20.6,
      "measuredLabContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "pbpk-006",
    "input": {
      "structureCoverage": 0.41,
      "topologyFidelity": 0.34,
      "admeClarity": 0.39,
      "compileStability": 0.45,
      "labPassRate": 0.5,
      "labOptimism": 0.4,
      "topologyHardness": 0.54,
      "overclaimRisk": 0.42,
      "pbpkBias": "balanced",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 33.94,
      "topologyScore": 39.5,
      "admeScore": 35.84,
      "compileScore": 47.85,
      "labScore": 23.08,
      "confidence": 30.35,
      "structureOnlyContribution": 38.87,
      "measuredLabContribution": 23.38,
      "overall": 40.08
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 11.98,
      "topologyScore": 18.04,
      "admeScore": 14.31,
      "compileScore": 34.78,
      "labScore": 46.72,
      "confidence": 20.5,
      "structureOnlyContribution": 25.17,
      "measuredLabContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "pbpk-007",
    "input": {
      "structureCoverage": 0.45,
      "topologyFidelity": 0.38,
      "admeClarity": 0.42,
      "compileStability": 0.49,
      "labPassRate": 0.53,
      "labOptimism": 0.42,
      "topologyHardness": 0.55,
      "overclaimRisk": 0.43,
      "pbpkBias": "adme_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 31.59,
      "topologyScore": 43.11,
      "admeScore": 48.37,
      "compileScore": 39.34,
      "labScore": 25.15,
      "confidence": 33.6,
      "structureOnlyContribution": 40.76,
      "measuredLabContribution": 25.64,
      "overall": 42.04
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 8.27,
      "topologyScore": 19.34,
      "admeScore": 15.59,
      "compileScore": 36.3,
      "labScore": 34.2,
      "confidence": 22.15,
      "structureOnlyContribution": 22.74,
      "measuredLabContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "pbpk-008",
    "input": {
      "structureCoverage": 0.41,
      "topologyFidelity": 0.43,
      "admeClarity": 0.46,
      "compileStability": 0.45,
      "labPassRate": 0.49,
      "labOptimism": 0.43,
      "topologyHardness": 0.47,
      "overclaimRisk": 0.44,
      "pbpkBias": "lab_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 19.33,
      "topologyScore": 35.43,
      "admeScore": 27.62,
      "compileScore": 24.76,
      "labScore": 24.32,
      "confidence": 34.35,
      "structureOnlyContribution": 26.71,
      "measuredLabContribution": 25.23,
      "overall": 27.44
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 16.4,
      "topologyScore": 20.18,
      "admeScore": 16.31,
      "compileScore": 35.17,
      "labScore": 58.5,
      "confidence": 22.7,
      "structureOnlyContribution": 29.31,
      "measuredLabContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "pbpk-009",
    "input": {
      "structureCoverage": 0.46,
      "topologyFidelity": 0.41,
      "admeClarity": 0.5,
      "compileStability": 0.49,
      "labPassRate": 0.53,
      "labOptimism": 0.39,
      "topologyHardness": 0.48,
      "overclaimRisk": 0.38,
      "pbpkBias": "balanced",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 40.05,
      "topologyScore": 45.49,
      "admeScore": 45.68,
      "compileScore": 52.59,
      "labScore": 25.81,
      "confidence": 37.35,
      "structureOnlyContribution": 45.69,
      "measuredLabContribution": 26.69,
      "overall": 46.27
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 14.91,
      "topologyScore": 19.07,
      "admeScore": 15.29,
      "compileScore": 35.36,
      "labScore": 48.88,
      "confidence": 22.7,
      "structureOnlyContribution": 26.7,
      "measuredLabContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "pbpk-010",
    "input": {
      "structureCoverage": 0.5,
      "topologyFidelity": 0.45,
      "admeClarity": 0.46,
      "compileStability": 0.53,
      "labPassRate": 0.57,
      "labOptimism": 0.4,
      "topologyHardness": 0.49,
      "overclaimRisk": 0.39,
      "pbpkBias": "topology_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 36.62,
      "topologyScore": 49.14,
      "admeScore": 30.65,
      "compileScore": 66.82,
      "labScore": 28.29,
      "confidence": 39,
      "structureOnlyContribution": 44.6,
      "measuredLabContribution": 29.32,
      "overall": 45.85
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 3.59,
      "topologyScore": 20.18,
      "admeScore": 16.7,
      "compileScore": 37.06,
      "labScore": 35.54,
      "confidence": 24.25,
      "structureOnlyContribution": 22.61,
      "measuredLabContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "pbpk-011",
    "input": {
      "structureCoverage": 0.54,
      "topologyFidelity": 0.49,
      "admeClarity": 0.49,
      "compileStability": 0.57,
      "labPassRate": 0.6,
      "labOptimism": 0.42,
      "topologyHardness": 0.49,
      "overclaimRisk": 0.4,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 47.21,
      "topologyScore": 52.75,
      "admeScore": 47.19,
      "compileScore": 60.27,
      "labScore": 30.54,
      "confidence": 42.25,
      "structureOnlyContribution": 51.41,
      "measuredLabContribution": 31.82,
      "overall": 51.88
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 17.1,
      "topologyScore": 21.62,
      "admeScore": 18.14,
      "compileScore": 38.58,
      "labScore": 54.12,
      "confidence": 26.1,
      "structureOnlyContribution": 29.91,
      "measuredLabContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "pbpk-012",
    "input": {
      "structureCoverage": 0.5,
      "topologyFidelity": 0.48,
      "admeClarity": 0.53,
      "compileStability": 0.53,
      "labPassRate": 0.56,
      "labOptimism": 0.37,
      "topologyHardness": 0.42,
      "overclaimRisk": 0.35,
      "pbpkBias": "adme_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 38.19,
      "topologyScore": 51.28,
      "admeScore": 61.94,
      "compileScore": 43.82,
      "labScore": 28.34,
      "confidence": 42.1,
      "structureOnlyContribution": 49.22,
      "measuredLabContribution": 29.7,
      "overall": 49.71
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 13.23,
      "topologyScore": 19.68,
      "admeScore": 16.17,
      "compileScore": 35.76,
      "labScore": 34.93,
      "confidence": 24.35,
      "structureOnlyContribution": 23.95,
      "measuredLabContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "pbpk-013",
    "input": {
      "structureCoverage": 0.54,
      "topologyFidelity": 0.52,
      "admeClarity": 0.56,
      "compileStability": 0.57,
      "labPassRate": 0.6,
      "labOptimism": 0.39,
      "topologyHardness": 0.42,
      "overclaimRisk": 0.36,
      "pbpkBias": "lab_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 29.13,
      "topologyScore": 44.88,
      "admeScore": 36.59,
      "compileScore": 32.66,
      "labScore": 31.2,
      "confidence": 45.35,
      "structureOnlyContribution": 35.78,
      "measuredLabContribution": 32.8,
      "overall": 36.24
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 22.62,
      "topologyScore": 21.35,
      "admeScore": 17.8,
      "compileScore": 37.74,
      "labScore": 67.02,
      "confidence": 26.55,
      "structureOnlyContribution": 33.31,
      "measuredLabContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "pbpk-014",
    "input": {
      "structureCoverage": 0.58,
      "topologyFidelity": 0.56,
      "admeClarity": 0.6,
      "compileStability": 0.61,
      "labPassRate": 0.63,
      "labOptimism": 0.4,
      "topologyHardness": 0.43,
      "overclaimRisk": 0.36,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 52.62,
      "topologyScore": 58.53,
      "admeScore": 56.66,
      "compileScore": 64.86,
      "labScore": 33.07,
      "confidence": 49,
      "structureOnlyContribution": 57.86,
      "measuredLabContribution": 34.8,
      "overall": 57.71
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 20.03,
      "topologyScore": 22.2,
      "admeScore": 18.59,
      "compileScore": 38.98,
      "labScore": 55.96,
      "confidence": 27.85,
      "structureOnlyContribution": 31.15,
      "measuredLabContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "pbpk-015",
    "input": {
      "structureCoverage": 0.62,
      "topologyFidelity": 0.54,
      "admeClarity": 0.56,
      "compileStability": 0.65,
      "labPassRate": 0.67,
      "labOptimism": 0.36,
      "topologyHardness": 0.44,
      "overclaimRisk": 0.31,
      "pbpkBias": "topology_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 45.9,
      "topologyScore": 58.35,
      "admeScore": 39.3,
      "compileScore": 79.94,
      "labScore": 34.55,
      "confidence": 49.6,
      "structureOnlyContribution": 54.53,
      "measuredLabContribution": 36.22,
      "overall": 55.23
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 9.43,
      "topologyScore": 21.14,
      "admeScore": 17.93,
      "compileScore": 39.27,
      "labScore": 38.2,
      "confidence": 27.75,
      "structureOnlyContribution": 25.19,
      "measuredLabContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "pbpk-016",
    "input": {
      "structureCoverage": 0.58,
      "topologyFidelity": 0.59,
      "admeClarity": 0.6,
      "compileStability": 0.6,
      "labPassRate": 0.63,
      "labOptimism": 0.37,
      "topologyHardness": 0.36,
      "overclaimRisk": 0.32,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 54.46,
      "topologyScore": 60.67,
      "admeScore": 57.87,
      "compileScore": 65.05,
      "labScore": 33.73,
      "confidence": 50.35,
      "structureOnlyContribution": 59.24,
      "measuredLabContribution": 35.76,
      "overall": 59.01
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 22.05,
      "topologyScore": 21.91,
      "admeScore": 18.56,
      "compileScore": 38.14,
      "labScore": 55.7,
      "confidence": 28.3,
      "structureOnlyContribution": 31.27,
      "measuredLabContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "pbpk-017",
    "input": {
      "structureCoverage": 0.62,
      "topologyFidelity": 0.63,
      "admeClarity": 0.63,
      "compileStability": 0.64,
      "labPassRate": 0.67,
      "labOptimism": 0.39,
      "topologyHardness": 0.37,
      "overclaimRisk": 0.33,
      "pbpkBias": "adme_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 48.43,
      "topologyScore": 64.28,
      "admeScore": 75.13,
      "compileScore": 52.76,
      "labScore": 36.41,
      "confidence": 53.6,
      "structureOnlyContribution": 60.66,
      "measuredLabContribution": 38.61,
      "overall": 60.69
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 18.73,
      "topologyScore": 23.42,
      "admeScore": 20,
      "compileScore": 40.11,
      "labScore": 39.86,
      "confidence": 30.3,
      "structureOnlyContribution": 28.42,
      "measuredLabContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "pbpk-018",
    "input": {
      "structureCoverage": 0.66,
      "topologyFidelity": 0.61,
      "admeClarity": 0.67,
      "compileStability": 0.68,
      "labPassRate": 0.7,
      "labOptimism": 0.34,
      "topologyHardness": 0.38,
      "overclaimRisk": 0.27,
      "pbpkBias": "lab_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 38.33,
      "topologyScore": 54.13,
      "admeScore": 45.52,
      "compileScore": 40.09,
      "labScore": 37.08,
      "confidence": 56.35,
      "structureOnlyContribution": 44.52,
      "measuredLabContribution": 39.16,
      "overall": 44.56
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 28.36,
      "topologyScore": 21.66,
      "admeScore": 18.31,
      "compileScore": 39.67,
      "labScore": 74.27,
      "confidence": 29.5,
      "structureOnlyContribution": 36.45,
      "measuredLabContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "pbpk-019",
    "input": {
      "structureCoverage": 0.7,
      "topologyFidelity": 0.65,
      "admeClarity": 0.7,
      "compileStability": 0.72,
      "labPassRate": 0.74,
      "labOptimism": 0.36,
      "topologyHardness": 0.38,
      "overclaimRisk": 0.28,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 63.81,
      "topologyScore": 67.74,
      "admeScore": 68.17,
      "compileScore": 75.07,
      "labScore": 39.94,
      "confidence": 59.6,
      "structureOnlyContribution": 68.45,
      "measuredLabContribution": 42.25,
      "overall": 67.73
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 26.25,
      "topologyScore": 23.32,
      "admeScore": 19.92,
      "compileScore": 41.65,
      "labScore": 62.07,
      "confidence": 31.7,
      "structureOnlyContribution": 34.64,
      "measuredLabContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "pbpk-020",
    "input": {
      "structureCoverage": 0.66,
      "topologyFidelity": 0.7,
      "admeClarity": 0.66,
      "compileStability": 0.68,
      "labPassRate": 0.7,
      "labOptimism": 0.37,
      "topologyHardness": 0.31,
      "overclaimRisk": 0.29,
      "pbpkBias": "topology_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 52.86,
      "topologyScore": 70.06,
      "admeScore": 45.74,
      "compileScore": 86.81,
      "labScore": 38.94,
      "confidence": 58.35,
      "structureOnlyContribution": 62.46,
      "measuredLabContribution": 41.54,
      "overall": 62.69
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 13.66,
      "topologyScore": 23.93,
      "admeScore": 20.75,
      "compileScore": 40.51,
      "labScore": 40.86,
      "confidence": 32.05,
      "structureOnlyContribution": 27.94,
      "measuredLabContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "pbpk-021",
    "input": {
      "structureCoverage": 0.7,
      "topologyFidelity": 0.68,
      "admeClarity": 0.7,
      "compileStability": 0.72,
      "labPassRate": 0.73,
      "labOptimism": 0.33,
      "topologyHardness": 0.31,
      "overclaimRisk": 0.24,
      "pbpkBias": "balanced",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 65.6,
      "topologyScore": 69.88,
      "admeScore": 69.32,
      "compileScore": 75.82,
      "labScore": 39.99,
      "confidence": 60.95,
      "structureOnlyContribution": 69.92,
      "measuredLabContribution": 42.54,
      "overall": 68.99
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 27.89,
      "topologyScore": 22.72,
      "admeScore": 19.62,
      "compileScore": 40.35,
      "labScore": 61.19,
      "confidence": 31.8,
      "structureOnlyContribution": 34.35,
      "measuredLabContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "pbpk-022",
    "input": {
      "structureCoverage": 0.74,
      "topologyFidelity": 0.72,
      "admeClarity": 0.73,
      "compileStability": 0.76,
      "labPassRate": 0.77,
      "labOptimism": 0.34,
      "topologyHardness": 0.32,
      "overclaimRisk": 0.25,
      "pbpkBias": "adme_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 57.62,
      "topologyScore": 73.52,
      "admeScore": 88.86,
      "compileScore": 60.51,
      "labScore": 42.47,
      "confidence": 64.35,
      "structureOnlyContribution": 70.82,
      "measuredLabContribution": 45.15,
      "overall": 70.2
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 24.57,
      "topologyScore": 23.79,
      "admeScore": 20.63,
      "compileScore": 42.05,
      "labScore": 42.21,
      "confidence": 33.35,
      "structureOnlyContribution": 30.65,
      "measuredLabContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "pbpk-023",
    "input": {
      "structureCoverage": 0.79,
      "topologyFidelity": 0.76,
      "admeClarity": 0.77,
      "compileStability": 0.8,
      "labPassRate": 0.81,
      "labOptimism": 0.36,
      "topologyHardness": 0.33,
      "overclaimRisk": 0.25,
      "pbpkBias": "lab_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 49.04,
      "topologyScore": 67.38,
      "admeScore": 53.74,
      "compileScore": 49.49,
      "labScore": 45.16,
      "confidence": 68.25,
      "structureOnlyContribution": 54.86,
      "measuredLabContribution": 48.03,
      "overall": 54.63
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 33.86,
      "topologyScore": 25.25,
      "admeScore": 22.05,
      "compileScore": 43.92,
      "labScore": 84.72,
      "confidence": 35.45,
      "structureOnlyContribution": 41.96,
      "measuredLabContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "pbpk-024",
    "input": {
      "structureCoverage": 0.75,
      "topologyFidelity": 0.75,
      "admeClarity": 0.81,
      "compileStability": 0.76,
      "labPassRate": 0.77,
      "labOptimism": 0.31,
      "topologyHardness": 0.25,
      "overclaimRisk": 0.2,
      "pbpkBias": "balanced",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 71.55,
      "topologyScore": 75.91,
      "admeScore": 78.99,
      "compileScore": 80.56,
      "labScore": 43.13,
      "confidence": 68.1,
      "structureOnlyContribution": 76.66,
      "measuredLabContribution": 46.07,
      "overall": 75.15
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 31.21,
      "topologyScore": 23.36,
      "admeScore": 20.13,
      "compileScore": 41.11,
      "labScore": 63.65,
      "confidence": 33.9,
      "structureOnlyContribution": 35.89,
      "measuredLabContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "pbpk-025",
    "input": {
      "structureCoverage": 0.79,
      "topologyFidelity": 0.79,
      "admeClarity": 0.77,
      "compileStability": 0.8,
      "labPassRate": 0.8,
      "labOptimism": 0.33,
      "topologyHardness": 0.26,
      "overclaimRisk": 0.21,
      "pbpkBias": "topology_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 62.51,
      "topologyScore": 79.52,
      "admeScore": 54.86,
      "compileScore": 100,
      "labScore": 45.2,
      "confidence": 69.6,
      "structureOnlyContribution": 72.7,
      "measuredLabContribution": 48.27,
      "overall": 72.3
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 19.5,
      "topologyScore": 24.6,
      "admeScore": 21.69,
      "compileScore": 42.63,
      "labScore": 43.52,
      "confidence": 35.55,
      "structureOnlyContribution": 30.39,
      "measuredLabContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "pbpk-026",
    "input": {
      "structureCoverage": 0.83,
      "topologyFidelity": 0.83,
      "admeClarity": 0.8,
      "compileStability": 0.83,
      "labPassRate": 0.84,
      "labOptimism": 0.34,
      "topologyHardness": 0.27,
      "overclaimRisk": 0.22,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 78.52,
      "topologyScore": 83.17,
      "admeScore": 80.3,
      "compileScore": 87.68,
      "labScore": 47.68,
      "confidence": 73,
      "structureOnlyContribution": 82.15,
      "measuredLabContribution": 50.87,
      "overall": 80.52
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 33.17,
      "topologyScore": 25.67,
      "admeScore": 22.7,
      "compileScore": 44.32,
      "labScore": 68.8,
      "confidence": 37.1,
      "structureOnlyContribution": 38.93,
      "measuredLabContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "pbpk-027",
    "input": {
      "structureCoverage": 0.87,
      "topologyFidelity": 0.81,
      "admeClarity": 0.84,
      "compileStability": 0.87,
      "labPassRate": 0.88,
      "labOptimism": 0.3,
      "topologyHardness": 0.27,
      "overclaimRisk": 0.17,
      "pbpkBias": "adme_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 67.26,
      "topologyScore": 82.98,
      "admeScore": 100,
      "compileScore": 68.1,
      "labScore": 49.35,
      "confidence": 75.6,
      "structureOnlyContribution": 80.38,
      "measuredLabContribution": 52.5,
      "overall": 79.36
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 30.78,
      "topologyScore": 24.7,
      "admeScore": 21.75,
      "compileScore": 44.62,
      "labScore": 45.22,
      "confidence": 37.2,
      "structureOnlyContribution": 33.41,
      "measuredLabContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "pbpk-028",
    "input": {
      "structureCoverage": 0.83,
      "topologyFidelity": 0.86,
      "admeClarity": 0.87,
      "compileStability": 0.83,
      "labPassRate": 0.84,
      "labOptimism": 0.31,
      "topologyHardness": 0.2,
      "overclaimRisk": 0.17,
      "pbpkBias": "lab_first",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 54.87,
      "topologyScore": 75.3,
      "admeScore": 60.62,
      "compileScore": 53.51,
      "labScore": 48.34,
      "confidence": 76.1,
      "structureOnlyContribution": 61.08,
      "measuredLabContribution": 51.73,
      "overall": 60.4
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 38.81,
      "topologyScore": 25.25,
      "admeScore": 22.17,
      "compileScore": 43.48,
      "labScore": 86.95,
      "confidence": 37.65,
      "structureOnlyContribution": 43.33,
      "measuredLabContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "pbpk-029",
    "input": {
      "structureCoverage": 0.87,
      "topologyFidelity": 0.9,
      "admeClarity": 0.91,
      "compileStability": 0.87,
      "labPassRate": 0.87,
      "labOptimism": 0.33,
      "topologyHardness": 0.2,
      "overclaimRisk": 0.18,
      "pbpkBias": "balanced",
      "profile": "structure_only"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 83.89,
      "topologyScore": 88.91,
      "admeScore": 89.72,
      "compileScore": 92.27,
      "labScore": 50.59,
      "confidence": 79.6,
      "structureOnlyContribution": 88.57,
      "measuredLabContribution": 54.16,
      "overall": 86.38
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 36.33,
      "topologyScore": 26.6,
      "admeScore": 23.46,
      "compileScore": 45,
      "labScore": 71.06,
      "confidence": 39.5,
      "structureOnlyContribution": 40.49,
      "measuredLabContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "pbpk-030",
    "input": {
      "structureCoverage": 0.91,
      "topologyFidelity": 0.88,
      "admeClarity": 0.87,
      "compileStability": 0.91,
      "labPassRate": 0.91,
      "labOptimism": 0.28,
      "topologyHardness": 0.21,
      "overclaimRisk": 0.13,
      "pbpkBias": "topology_first",
      "profile": "measured_lab"
    },
    "expectedStructureOnly": {
      "mode": "structure_only",
      "structureScore": 71.59,
      "topologyScore": 88.77,
      "admeScore": 63.26,
      "compileScore": 100,
      "labScore": 51.88,
      "confidence": 80.35,
      "structureOnlyContribution": 79.63,
      "measuredLabContribution": 55.31,
      "overall": 79.25
    },
    "expectedMeasuredLab": {
      "mode": "measured_lab",
      "structureScore": 25.72,
      "topologyScore": 25.06,
      "admeScore": 22.34,
      "compileScore": 45.02,
      "labScore": 46.21,
      "confidence": 38.95,
      "structureOnlyContribution": 32.87,
      "measuredLabContribution": 50.68,
      "overall": 44.3
    }
  }
];
