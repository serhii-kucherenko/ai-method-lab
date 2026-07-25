import type { MembraneInput, MembraneQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MembraneInput;
  expectedChemgnn: MembraneQuality;
  expectedClassical: MembraneQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cm-001",
    "input": {
      "graphCoverage": 0.29,
      "poreGeometryFidelity": 0.25,
      "saltRejectionProxy": 0.28,
      "waterFluxProxy": 0.34,
      "classicalPhysicsBreadth": 0.39,
      "baselineOptimism": 0.45,
      "membraneHardness": 0.59,
      "overclaimRisk": 0.5,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 22.73,
      "poreScore": 30.25,
      "rejectionScore": 23.66,
      "fluxIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 20.85,
      "surrogateContribution": 28.08,
      "physicsContribution": 16.13,
      "overall": 29.93
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 5.76,
      "poreScore": 17.31,
      "rejectionScore": 13.1,
      "fluxIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "surrogateContribution": 21.9,
      "physicsContribution": 38.71,
      "overall": 27.29
    }
  },
  {
    "id": "cm-002",
    "input": {
      "graphCoverage": 0.33,
      "poreGeometryFidelity": 0.29,
      "saltRejectionProxy": 0.32,
      "waterFluxProxy": 0.38,
      "classicalPhysicsBreadth": 0.43,
      "baselineOptimism": 0.46,
      "membraneHardness": 0.6,
      "overclaimRisk": 0.51,
      "membraneBias": "flux_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 22.36,
      "poreScore": 33.9,
      "rejectionScore": 34.57,
      "fluxIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 24.5,
      "surrogateContribution": 30.65,
      "physicsContribution": 18.79,
      "overall": 32.52
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 2.43,
      "poreScore": 18.44,
      "rejectionScore": 14.13,
      "fluxIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "surrogateContribution": 20.12,
      "physicsContribution": 34.65,
      "overall": 23.59
    }
  },
  {
    "id": "cm-003",
    "input": {
      "graphCoverage": 0.37,
      "poreGeometryFidelity": 0.27,
      "saltRejectionProxy": 0.36,
      "waterFluxProxy": 0.42,
      "classicalPhysicsBreadth": 0.46,
      "baselineOptimism": 0.42,
      "membraneHardness": 0.6,
      "overclaimRisk": 0.46,
      "membraneBias": "physics_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 12.32,
      "poreScore": 23.71,
      "rejectionScore": 21.13,
      "fluxIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 27.1,
      "surrogateContribution": 19.04,
      "physicsContribution": 19.87,
      "overall": 20.19
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 12.17,
      "poreScore": 17.32,
      "rejectionScore": 13.1,
      "fluxIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "surrogateContribution": 26.17,
      "physicsContribution": 46.7,
      "overall": 34.62
    }
  },
  {
    "id": "cm-004",
    "input": {
      "graphCoverage": 0.33,
      "poreGeometryFidelity": 0.32,
      "saltRejectionProxy": 0.39,
      "waterFluxProxy": 0.38,
      "classicalPhysicsBreadth": 0.42,
      "baselineOptimism": 0.43,
      "membraneHardness": 0.53,
      "overclaimRisk": 0.46,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 28.24,
      "poreScore": 36.03,
      "rejectionScore": 33.23,
      "fluxIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 25.85,
      "surrogateContribution": 34.58,
      "physicsContribution": 19.21,
      "overall": 35.81
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 8.7,
      "poreScore": 18.01,
      "rejectionScore": 14.03,
      "fluxIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "surrogateContribution": 23.26,
      "physicsContribution": 40.33,
      "overall": 29.57
    }
  },
  {
    "id": "cm-005",
    "input": {
      "graphCoverage": 0.37,
      "poreGeometryFidelity": 0.36,
      "saltRejectionProxy": 0.35,
      "waterFluxProxy": 0.42,
      "classicalPhysicsBreadth": 0.46,
      "baselineOptimism": 0.45,
      "membraneHardness": 0.53,
      "overclaimRisk": 0.47,
      "membraneBias": "graph_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 26.98,
      "poreScore": 39.64,
      "rejectionScore": 21.55,
      "fluxIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 29.35,
      "surrogateContribution": 34.51,
      "physicsContribution": 22.35,
      "overall": 36.32
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 0,
      "poreScore": 19.71,
      "rejectionScore": 15.65,
      "fluxIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "surrogateContribution": 20.62,
      "physicsContribution": 36.41,
      "overall": 25.88
    }
  },
  {
    "id": "cm-006",
    "input": {
      "graphCoverage": 0.41,
      "poreGeometryFidelity": 0.34,
      "saltRejectionProxy": 0.39,
      "waterFluxProxy": 0.45,
      "classicalPhysicsBreadth": 0.5,
      "baselineOptimism": 0.4,
      "membraneHardness": 0.54,
      "overclaimRisk": 0.42,
      "membraneBias": "balanced",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 34.06,
      "poreScore": 39.5,
      "rejectionScore": 35.97,
      "fluxIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 31.85,
      "surrogateContribution": 38.93,
      "physicsContribution": 23.51,
      "overall": 40.15
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 11.98,
      "poreScore": 18.2,
      "rejectionScore": 14.2,
      "fluxIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "surrogateContribution": 25.18,
      "physicsContribution": 43.27,
      "overall": 32.45
    }
  },
  {
    "id": "cm-007",
    "input": {
      "graphCoverage": 0.45,
      "poreGeometryFidelity": 0.38,
      "saltRejectionProxy": 0.42,
      "waterFluxProxy": 0.49,
      "classicalPhysicsBreadth": 0.53,
      "baselineOptimism": 0.42,
      "membraneHardness": 0.55,
      "overclaimRisk": 0.43,
      "membraneBias": "flux_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 31.69,
      "poreScore": 43.11,
      "rejectionScore": 48.5,
      "fluxIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 35.35,
      "surrogateContribution": 40.82,
      "physicsContribution": 25.77,
      "overall": 42.11
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 8.27,
      "poreScore": 19.5,
      "rejectionScore": 15.44,
      "fluxIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "surrogateContribution": 22.74,
      "physicsContribution": 37.59,
      "overall": 27.34
    }
  },
  {
    "id": "cm-008",
    "input": {
      "graphCoverage": 0.41,
      "poreGeometryFidelity": 0.43,
      "saltRejectionProxy": 0.46,
      "waterFluxProxy": 0.45,
      "classicalPhysicsBreadth": 0.49,
      "baselineOptimism": 0.43,
      "membraneHardness": 0.47,
      "overclaimRisk": 0.44,
      "membraneBias": "physics_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 19.41,
      "poreScore": 35.43,
      "rejectionScore": 27.73,
      "fluxIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.1,
      "surrogateContribution": 26.76,
      "physicsContribution": 25.34,
      "overall": 27.5
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 16.4,
      "poreScore": 20.32,
      "rejectionScore": 16.53,
      "fluxIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "surrogateContribution": 29.38,
      "physicsContribution": 51.02,
      "overall": 39.86
    }
  },
  {
    "id": "cm-009",
    "input": {
      "graphCoverage": 0.46,
      "poreGeometryFidelity": 0.41,
      "saltRejectionProxy": 0.5,
      "waterFluxProxy": 0.49,
      "classicalPhysicsBreadth": 0.53,
      "baselineOptimism": 0.39,
      "membraneHardness": 0.48,
      "overclaimRisk": 0.38,
      "membraneBias": "balanced",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 40.13,
      "poreScore": 45.49,
      "rejectionScore": 45.77,
      "fluxIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.1,
      "surrogateContribution": 45.74,
      "physicsContribution": 26.78,
      "overall": 46.33
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 14.91,
      "poreScore": 19.18,
      "rejectionScore": 15.47,
      "fluxIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "surrogateContribution": 26.76,
      "physicsContribution": 45.32,
      "overall": 35.12
    }
  },
  {
    "id": "cm-010",
    "input": {
      "graphCoverage": 0.5,
      "poreGeometryFidelity": 0.45,
      "saltRejectionProxy": 0.46,
      "waterFluxProxy": 0.53,
      "classicalPhysicsBreadth": 0.57,
      "baselineOptimism": 0.4,
      "membraneHardness": 0.49,
      "overclaimRisk": 0.39,
      "membraneBias": "graph_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 36.69,
      "poreScore": 49.14,
      "rejectionScore": 30.74,
      "fluxIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 40.75,
      "surrogateContribution": 44.64,
      "physicsContribution": 29.41,
      "overall": 45.9
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 3.59,
      "poreScore": 20.29,
      "rejectionScore": 16.48,
      "fluxIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "surrogateContribution": 22.59,
      "physicsContribution": 39.09,
      "overall": 29.2
    }
  },
  {
    "id": "cm-011",
    "input": {
      "graphCoverage": 0.54,
      "poreGeometryFidelity": 0.49,
      "saltRejectionProxy": 0.49,
      "waterFluxProxy": 0.57,
      "classicalPhysicsBreadth": 0.6,
      "baselineOptimism": 0.42,
      "membraneHardness": 0.49,
      "overclaimRisk": 0.4,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 47.29,
      "poreScore": 52.75,
      "rejectionScore": 47.28,
      "fluxIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 44.25,
      "surrogateContribution": 51.45,
      "physicsContribution": 31.9,
      "overall": 51.93
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 17.1,
      "poreScore": 21.73,
      "rejectionScore": 17.88,
      "fluxIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "surrogateContribution": 29.88,
      "physicsContribution": 50.58,
      "overall": 39.71
    }
  },
  {
    "id": "cm-012",
    "input": {
      "graphCoverage": 0.5,
      "poreGeometryFidelity": 0.48,
      "saltRejectionProxy": 0.53,
      "waterFluxProxy": 0.53,
      "classicalPhysicsBreadth": 0.56,
      "baselineOptimism": 0.37,
      "membraneHardness": 0.42,
      "overclaimRisk": 0.35,
      "membraneBias": "flux_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 38.25,
      "poreScore": 51.28,
      "rejectionScore": 62.01,
      "fluxIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "surrogateContribution": 49.26,
      "physicsContribution": 29.77,
      "overall": 49.75
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 13.23,
      "poreScore": 19.78,
      "rejectionScore": 16.29,
      "fluxIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "surrogateContribution": 24,
      "physicsContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "cm-013",
    "input": {
      "graphCoverage": 0.54,
      "poreGeometryFidelity": 0.52,
      "saltRejectionProxy": 0.56,
      "waterFluxProxy": 0.57,
      "classicalPhysicsBreadth": 0.6,
      "baselineOptimism": 0.39,
      "membraneHardness": 0.42,
      "overclaimRisk": 0.36,
      "membraneBias": "physics_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 29.19,
      "poreScore": 44.88,
      "rejectionScore": 36.66,
      "fluxIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.6,
      "surrogateContribution": 35.81,
      "physicsContribution": 32.88,
      "overall": 36.28
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 22.62,
      "poreScore": 21.45,
      "rejectionScore": 17.86,
      "fluxIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "surrogateContribution": 33.34,
      "physicsContribution": 57.32,
      "overall": 46.52
    }
  },
  {
    "id": "cm-014",
    "input": {
      "graphCoverage": 0.58,
      "poreGeometryFidelity": 0.56,
      "saltRejectionProxy": 0.6,
      "waterFluxProxy": 0.61,
      "classicalPhysicsBreadth": 0.63,
      "baselineOptimism": 0.4,
      "membraneHardness": 0.43,
      "overclaimRisk": 0.36,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 52.7,
      "poreScore": 58.53,
      "rejectionScore": 56.74,
      "fluxIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49.25,
      "surrogateContribution": 57.91,
      "physicsContribution": 34.87,
      "overall": 57.76
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 20.03,
      "poreScore": 22.29,
      "rejectionScore": 18.65,
      "fluxIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "surrogateContribution": 31.18,
      "physicsContribution": 52.13,
      "overall": 41.92
    }
  },
  {
    "id": "cm-015",
    "input": {
      "graphCoverage": 0.62,
      "poreGeometryFidelity": 0.54,
      "saltRejectionProxy": 0.56,
      "waterFluxProxy": 0.65,
      "classicalPhysicsBreadth": 0.67,
      "baselineOptimism": 0.36,
      "membraneHardness": 0.44,
      "overclaimRisk": 0.31,
      "membraneBias": "graph_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 45.96,
      "poreScore": 58.35,
      "rejectionScore": 39.38,
      "fluxIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 51.85,
      "surrogateContribution": 54.57,
      "physicsContribution": 36.3,
      "overall": 55.28
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 9.43,
      "poreScore": 21.24,
      "rejectionScore": 17.6,
      "fluxIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "surrogateContribution": 25.15,
      "physicsContribution": 41.95,
      "overall": 32.87
    }
  },
  {
    "id": "cm-016",
    "input": {
      "graphCoverage": 0.58,
      "poreGeometryFidelity": 0.59,
      "saltRejectionProxy": 0.6,
      "waterFluxProxy": 0.6,
      "classicalPhysicsBreadth": 0.63,
      "baselineOptimism": 0.37,
      "membraneHardness": 0.36,
      "overclaimRisk": 0.32,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 54.5,
      "poreScore": 60.67,
      "rejectionScore": 57.91,
      "fluxIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "surrogateContribution": 59.26,
      "physicsContribution": 35.81,
      "overall": 59.04
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 22.05,
      "poreScore": 21.96,
      "rejectionScore": 18.63,
      "fluxIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "surrogateContribution": 31.3,
      "physicsContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "cm-017",
    "input": {
      "graphCoverage": 0.62,
      "poreGeometryFidelity": 0.63,
      "saltRejectionProxy": 0.63,
      "waterFluxProxy": 0.64,
      "classicalPhysicsBreadth": 0.67,
      "baselineOptimism": 0.39,
      "membraneHardness": 0.37,
      "overclaimRisk": 0.33,
      "membraneBias": "flux_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 48.47,
      "poreScore": 64.28,
      "rejectionScore": 75.18,
      "fluxIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.85,
      "surrogateContribution": 60.69,
      "physicsContribution": 38.66,
      "overall": 60.72
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 18.73,
      "poreScore": 23.48,
      "rejectionScore": 20.01,
      "fluxIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "surrogateContribution": 28.44,
      "physicsContribution": 44.27,
      "overall": 35.85
    }
  },
  {
    "id": "cm-018",
    "input": {
      "graphCoverage": 0.66,
      "poreGeometryFidelity": 0.61,
      "saltRejectionProxy": 0.67,
      "waterFluxProxy": 0.68,
      "classicalPhysicsBreadth": 0.7,
      "baselineOptimism": 0.34,
      "membraneHardness": 0.38,
      "overclaimRisk": 0.27,
      "membraneBias": "physics_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 38.37,
      "poreScore": 54.13,
      "rejectionScore": 45.57,
      "fluxIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.6,
      "surrogateContribution": 44.55,
      "physicsContribution": 39.21,
      "overall": 44.59
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 28.36,
      "poreScore": 21.72,
      "rejectionScore": 18.33,
      "fluxIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "surrogateContribution": 36.47,
      "physicsContribution": 62.28,
      "overall": 51.94
    }
  },
  {
    "id": "cm-019",
    "input": {
      "graphCoverage": 0.7,
      "poreGeometryFidelity": 0.65,
      "saltRejectionProxy": 0.7,
      "waterFluxProxy": 0.72,
      "classicalPhysicsBreadth": 0.74,
      "baselineOptimism": 0.36,
      "membraneHardness": 0.38,
      "overclaimRisk": 0.28,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 63.85,
      "poreScore": 67.74,
      "rejectionScore": 68.21,
      "fluxIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 60.1,
      "surrogateContribution": 68.47,
      "physicsContribution": 42.3,
      "overall": 67.76
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 26.25,
      "poreScore": 23.38,
      "rejectionScore": 19.89,
      "fluxIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "surrogateContribution": 34.65,
      "physicsContribution": 57.03,
      "overall": 47.39
    }
  },
  {
    "id": "cm-020",
    "input": {
      "graphCoverage": 0.66,
      "poreGeometryFidelity": 0.7,
      "saltRejectionProxy": 0.66,
      "waterFluxProxy": 0.68,
      "classicalPhysicsBreadth": 0.7,
      "baselineOptimism": 0.37,
      "membraneHardness": 0.31,
      "overclaimRisk": 0.29,
      "membraneBias": "graph_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 52.89,
      "poreScore": 70.06,
      "rejectionScore": 45.78,
      "fluxIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.85,
      "surrogateContribution": 62.48,
      "physicsContribution": 41.57,
      "overall": 62.72
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 13.66,
      "poreScore": 23.97,
      "rejectionScore": 20.71,
      "fluxIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "surrogateContribution": 27.94,
      "physicsContribution": 45.32,
      "overall": 37.28
    }
  },
  {
    "id": "cm-021",
    "input": {
      "graphCoverage": 0.7,
      "poreGeometryFidelity": 0.68,
      "saltRejectionProxy": 0.7,
      "waterFluxProxy": 0.72,
      "classicalPhysicsBreadth": 0.73,
      "baselineOptimism": 0.33,
      "membraneHardness": 0.31,
      "overclaimRisk": 0.24,
      "membraneBias": "balanced",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 65.63,
      "poreScore": 69.88,
      "rejectionScore": 69.36,
      "fluxIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 61.45,
      "surrogateContribution": 69.94,
      "physicsContribution": 42.58,
      "overall": 69.02
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 27.89,
      "poreScore": 22.77,
      "rejectionScore": 19.58,
      "fluxIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "surrogateContribution": 34.36,
      "physicsContribution": 55.95,
      "overall": 47.28
    }
  },
  {
    "id": "cm-022",
    "input": {
      "graphCoverage": 0.74,
      "poreGeometryFidelity": 0.72,
      "saltRejectionProxy": 0.73,
      "waterFluxProxy": 0.76,
      "classicalPhysicsBreadth": 0.77,
      "baselineOptimism": 0.34,
      "membraneHardness": 0.32,
      "overclaimRisk": 0.25,
      "membraneBias": "flux_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 57.64,
      "poreScore": 73.52,
      "rejectionScore": 88.9,
      "fluxIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 65.1,
      "surrogateContribution": 70.84,
      "physicsContribution": 45.19,
      "overall": 70.22
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 24.57,
      "poreScore": 23.84,
      "rejectionScore": 20.54,
      "fluxIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "surrogateContribution": 30.64,
      "physicsContribution": 46.59,
      "overall": 39.02
    }
  },
  {
    "id": "cm-023",
    "input": {
      "graphCoverage": 0.79,
      "poreGeometryFidelity": 0.76,
      "saltRejectionProxy": 0.77,
      "waterFluxProxy": 0.8,
      "classicalPhysicsBreadth": 0.81,
      "baselineOptimism": 0.36,
      "membraneHardness": 0.33,
      "overclaimRisk": 0.25,
      "membraneBias": "physics_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 49.06,
      "poreScore": 67.38,
      "rejectionScore": 53.76,
      "fluxIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 69,
      "surrogateContribution": 54.87,
      "physicsContribution": 48.05,
      "overall": 54.64
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 33.86,
      "poreScore": 25.27,
      "rejectionScore": 21.93,
      "fluxIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "surrogateContribution": 41.94,
      "physicsContribution": 71.35,
      "overall": 60.74
    }
  },
  {
    "id": "cm-024",
    "input": {
      "graphCoverage": 0.75,
      "poreGeometryFidelity": 0.75,
      "saltRejectionProxy": 0.81,
      "waterFluxProxy": 0.76,
      "classicalPhysicsBreadth": 0.77,
      "baselineOptimism": 0.31,
      "membraneHardness": 0.25,
      "overclaimRisk": 0.2,
      "membraneBias": "balanced",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 71.56,
      "poreScore": 75.91,
      "rejectionScore": 79.01,
      "fluxIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 66.85,
      "surrogateContribution": 76.67,
      "physicsContribution": 46.08,
      "overall": 75.16
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 31.21,
      "poreScore": 23.38,
      "rejectionScore": 20.41,
      "fluxIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "surrogateContribution": 35.95,
      "physicsContribution": 57.97,
      "overall": 49.93
    }
  },
  {
    "id": "cm-025",
    "input": {
      "graphCoverage": 0.79,
      "poreGeometryFidelity": 0.79,
      "saltRejectionProxy": 0.77,
      "waterFluxProxy": 0.8,
      "classicalPhysicsBreadth": 0.8,
      "baselineOptimism": 0.33,
      "membraneHardness": 0.26,
      "overclaimRisk": 0.21,
      "membraneBias": "graph_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 62.53,
      "poreScore": 79.52,
      "rejectionScore": 54.88,
      "fluxIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 70.35,
      "surrogateContribution": 72.71,
      "physicsContribution": 48.29,
      "overall": 72.31
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 19.5,
      "poreScore": 24.62,
      "rejectionScore": 21.57,
      "fluxIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "surrogateContribution": 30.37,
      "physicsContribution": 48.07,
      "overall": 40.84
    }
  },
  {
    "id": "cm-026",
    "input": {
      "graphCoverage": 0.83,
      "poreGeometryFidelity": 0.83,
      "saltRejectionProxy": 0.8,
      "waterFluxProxy": 0.83,
      "classicalPhysicsBreadth": 0.84,
      "baselineOptimism": 0.34,
      "membraneHardness": 0.27,
      "overclaimRisk": 0.22,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 78.52,
      "poreScore": 83.17,
      "rejectionScore": 80.3,
      "fluxIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73.75,
      "surrogateContribution": 82.15,
      "physicsContribution": 50.87,
      "overall": 80.52
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 33.17,
      "poreScore": 25.67,
      "rejectionScore": 22.55,
      "fluxIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "surrogateContribution": 38.9,
      "physicsContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "cm-027",
    "input": {
      "graphCoverage": 0.87,
      "poreGeometryFidelity": 0.81,
      "saltRejectionProxy": 0.84,
      "waterFluxProxy": 0.87,
      "classicalPhysicsBreadth": 0.88,
      "baselineOptimism": 0.3,
      "membraneHardness": 0.27,
      "overclaimRisk": 0.17,
      "membraneBias": "flux_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 67.26,
      "poreScore": 82.98,
      "rejectionScore": 100,
      "fluxIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 76.35,
      "surrogateContribution": 80.38,
      "physicsContribution": 52.5,
      "overall": 79.36
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 30.78,
      "poreScore": 24.7,
      "rejectionScore": 21.6,
      "fluxIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "surrogateContribution": 33.38,
      "physicsContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "cm-028",
    "input": {
      "graphCoverage": 0.83,
      "poreGeometryFidelity": 0.86,
      "saltRejectionProxy": 0.87,
      "waterFluxProxy": 0.83,
      "classicalPhysicsBreadth": 0.84,
      "baselineOptimism": 0.31,
      "membraneHardness": 0.2,
      "overclaimRisk": 0.17,
      "membraneBias": "physics_first",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 54.87,
      "poreScore": 75.3,
      "rejectionScore": 60.62,
      "fluxIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 75.1,
      "surrogateContribution": 61.08,
      "physicsContribution": 51.73,
      "overall": 60.4
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 38.81,
      "poreScore": 25.25,
      "rejectionScore": 22.37,
      "fluxIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "surrogateContribution": 43.37,
      "physicsContribution": 72.59,
      "overall": 63.54
    }
  },
  {
    "id": "cm-029",
    "input": {
      "graphCoverage": 0.87,
      "poreGeometryFidelity": 0.9,
      "saltRejectionProxy": 0.91,
      "waterFluxProxy": 0.87,
      "classicalPhysicsBreadth": 0.87,
      "baselineOptimism": 0.33,
      "membraneHardness": 0.2,
      "overclaimRisk": 0.18,
      "membraneBias": "balanced",
      "profile": "chemgnn_surrogate"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 83.89,
      "poreScore": 88.91,
      "rejectionScore": 89.72,
      "fluxIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 78.6,
      "surrogateContribution": 88.57,
      "physicsContribution": 54.16,
      "overall": 86.38
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 36.33,
      "poreScore": 26.6,
      "rejectionScore": 23.66,
      "fluxIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "surrogateContribution": 40.53,
      "physicsContribution": 65.08,
      "overall": 57
    }
  },
  {
    "id": "cm-030",
    "input": {
      "graphCoverage": 0.91,
      "poreGeometryFidelity": 0.88,
      "saltRejectionProxy": 0.87,
      "waterFluxProxy": 0.91,
      "classicalPhysicsBreadth": 0.91,
      "baselineOptimism": 0.28,
      "membraneHardness": 0.21,
      "overclaimRisk": 0.13,
      "membraneBias": "graph_first",
      "profile": "classical_physics_baseline"
    },
    "expectedChemgnn": {
      "mode": "chemgnn_surrogate",
      "graphScore": 71.59,
      "poreScore": 88.77,
      "rejectionScore": 63.26,
      "fluxIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 81.35,
      "surrogateContribution": 79.63,
      "physicsContribution": 55.31,
      "overall": 79.25
    },
    "expectedClassical": {
      "mode": "classical_physics_baseline",
      "graphScore": 25.72,
      "poreScore": 25.06,
      "rejectionScore": 22.14,
      "fluxIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "surrogateContribution": 32.83,
      "physicsContribution": 50.68,
      "overall": 44.29
    }
  }
];
