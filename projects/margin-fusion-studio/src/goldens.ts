import type { FusionInput, FusionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FusionInput;
  expectedMarkerFree: FusionQuality;
  expectedMarkerBased: FusionQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "mfs-001",
    "input": {
      "deformableQuality": 0.29,
      "surfaceFidelity": 0.25,
      "marginClarity": 0.28,
      "fusionStability": 0.34,
      "markerPassRate": 0.39,
      "markerOptimism": 0.45,
      "deformationHardness": 0.59,
      "overclaimRisk": 0.5,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 22.56,
      "surfaceScore": 30.25,
      "marginScore": 23.49,
      "stabilityScore": 37.64,
      "markerScore": 16.4,
      "confidence": 19.35,
      "markerFreeContribution": 27.98,
      "markerBasedContribution": 15.96,
      "overall": 29.82
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 5.76,
      "surfaceScore": 17.09,
      "marginScore": 13.13,
      "stabilityScore": 32.39,
      "markerScore": 40.93,
      "confidence": 17.1,
      "markerFreeContribution": 21.86,
      "markerBasedContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "mfs-002",
    "input": {
      "deformableQuality": 0.33,
      "surfaceFidelity": 0.29,
      "marginClarity": 0.32,
      "fusionStability": 0.38,
      "markerPassRate": 0.43,
      "markerOptimism": 0.46,
      "deformationHardness": 0.6,
      "overclaimRisk": 0.51,
      "fusionBias": "surface_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 22.22,
      "surfaceScore": 33.9,
      "marginScore": 34.39,
      "stabilityScore": 31.9,
      "markerScore": 18.89,
      "confidence": 23,
      "markerFreeContribution": 30.56,
      "markerBasedContribution": 18.61,
      "overall": 32.41
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 2.43,
      "surfaceScore": 18.22,
      "marginScore": 14.16,
      "stabilityScore": 34.08,
      "markerScore": 31.53,
      "confidence": 18.65,
      "markerFreeContribution": 20.08,
      "markerBasedContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "mfs-003",
    "input": {
      "deformableQuality": 0.37,
      "surfaceFidelity": 0.27,
      "marginClarity": 0.36,
      "fusionStability": 0.42,
      "markerPassRate": 0.46,
      "markerOptimism": 0.42,
      "deformationHardness": 0.6,
      "overclaimRisk": 0.46,
      "fusionBias": "marker_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 12.18,
      "surfaceScore": 23.71,
      "marginScore": 20.95,
      "stabilityScore": 19.24,
      "markerScore": 19.94,
      "confidence": 25.6,
      "markerFreeContribution": 18.96,
      "markerBasedContribution": 19.69,
      "overall": 20.09
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 12.17,
      "surfaceScore": 17.1,
      "marginScore": 13.13,
      "stabilityScore": 33.93,
      "markerScore": 54.34,
      "confidence": 18.4,
      "markerFreeContribution": 26.13,
      "markerBasedContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "mfs-004",
    "input": {
      "deformableQuality": 0.33,
      "surfaceFidelity": 0.32,
      "marginClarity": 0.39,
      "fusionStability": 0.38,
      "markerPassRate": 0.42,
      "markerOptimism": 0.43,
      "deformationHardness": 0.53,
      "overclaimRisk": 0.46,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 28.09,
      "surfaceScore": 36.03,
      "marginScore": 33.07,
      "stabilityScore": 42.23,
      "markerScore": 18.93,
      "confidence": 26.1,
      "markerFreeContribution": 34.5,
      "markerBasedContribution": 19.05,
      "overall": 35.72
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 8.7,
      "surfaceScore": 17.81,
      "marginScore": 13.75,
      "stabilityScore": 32.79,
      "markerScore": 42.77,
      "confidence": 18.85,
      "markerFreeContribution": 23.16,
      "markerBasedContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "mfs-005",
    "input": {
      "deformableQuality": 0.37,
      "surfaceFidelity": 0.36,
      "marginClarity": 0.35,
      "fusionStability": 0.42,
      "markerPassRate": 0.46,
      "markerOptimism": 0.45,
      "deformationHardness": 0.53,
      "overclaimRisk": 0.47,
      "fusionBias": "deformable_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 26.86,
      "surfaceScore": 39.64,
      "marginScore": 21.39,
      "stabilityScore": 54.3,
      "markerScore": 21.8,
      "confidence": 27.6,
      "markerFreeContribution": 34.43,
      "markerBasedContribution": 22.19,
      "overall": 36.23
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 0,
      "surfaceScore": 19.51,
      "marginScore": 15.76,
      "stabilityScore": 34.77,
      "markerScore": 32.95,
      "confidence": 21.05,
      "markerFreeContribution": 20.6,
      "markerBasedContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "mfs-006",
    "input": {
      "deformableQuality": 0.41,
      "surfaceFidelity": 0.34,
      "marginClarity": 0.39,
      "fusionStability": 0.45,
      "markerPassRate": 0.5,
      "markerOptimism": 0.4,
      "deformationHardness": 0.54,
      "overclaimRisk": 0.42,
      "fusionBias": "balanced",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 33.94,
      "surfaceScore": 39.5,
      "marginScore": 35.84,
      "stabilityScore": 47.85,
      "markerScore": 23.08,
      "confidence": 30.35,
      "markerFreeContribution": 38.87,
      "markerBasedContribution": 23.38,
      "overall": 40.08
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 11.98,
      "surfaceScore": 18.04,
      "marginScore": 14.31,
      "stabilityScore": 34.78,
      "markerScore": 46.72,
      "confidence": 20.5,
      "markerFreeContribution": 25.17,
      "markerBasedContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "mfs-007",
    "input": {
      "deformableQuality": 0.45,
      "surfaceFidelity": 0.38,
      "marginClarity": 0.42,
      "fusionStability": 0.49,
      "markerPassRate": 0.53,
      "markerOptimism": 0.42,
      "deformationHardness": 0.55,
      "overclaimRisk": 0.43,
      "fusionBias": "surface_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 31.59,
      "surfaceScore": 43.11,
      "marginScore": 48.37,
      "stabilityScore": 39.34,
      "markerScore": 25.15,
      "confidence": 33.6,
      "markerFreeContribution": 40.76,
      "markerBasedContribution": 25.64,
      "overall": 42.04
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 8.27,
      "surfaceScore": 19.34,
      "marginScore": 15.59,
      "stabilityScore": 36.3,
      "markerScore": 34.2,
      "confidence": 22.15,
      "markerFreeContribution": 22.74,
      "markerBasedContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "mfs-008",
    "input": {
      "deformableQuality": 0.41,
      "surfaceFidelity": 0.43,
      "marginClarity": 0.46,
      "fusionStability": 0.45,
      "markerPassRate": 0.49,
      "markerOptimism": 0.43,
      "deformationHardness": 0.47,
      "overclaimRisk": 0.44,
      "fusionBias": "marker_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 19.33,
      "surfaceScore": 35.43,
      "marginScore": 27.62,
      "stabilityScore": 24.76,
      "markerScore": 24.32,
      "confidence": 34.35,
      "markerFreeContribution": 26.71,
      "markerBasedContribution": 25.23,
      "overall": 27.44
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 16.4,
      "surfaceScore": 20.18,
      "marginScore": 16.31,
      "stabilityScore": 35.17,
      "markerScore": 58.5,
      "confidence": 22.7,
      "markerFreeContribution": 29.31,
      "markerBasedContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "mfs-009",
    "input": {
      "deformableQuality": 0.46,
      "surfaceFidelity": 0.41,
      "marginClarity": 0.5,
      "fusionStability": 0.49,
      "markerPassRate": 0.53,
      "markerOptimism": 0.39,
      "deformationHardness": 0.48,
      "overclaimRisk": 0.38,
      "fusionBias": "balanced",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 40.05,
      "surfaceScore": 45.49,
      "marginScore": 45.68,
      "stabilityScore": 52.59,
      "markerScore": 25.81,
      "confidence": 37.35,
      "markerFreeContribution": 45.69,
      "markerBasedContribution": 26.69,
      "overall": 46.27
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 14.91,
      "surfaceScore": 19.07,
      "marginScore": 15.29,
      "stabilityScore": 35.36,
      "markerScore": 48.88,
      "confidence": 22.7,
      "markerFreeContribution": 26.7,
      "markerBasedContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "mfs-010",
    "input": {
      "deformableQuality": 0.5,
      "surfaceFidelity": 0.45,
      "marginClarity": 0.46,
      "fusionStability": 0.53,
      "markerPassRate": 0.57,
      "markerOptimism": 0.4,
      "deformationHardness": 0.49,
      "overclaimRisk": 0.39,
      "fusionBias": "deformable_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 36.62,
      "surfaceScore": 49.14,
      "marginScore": 30.65,
      "stabilityScore": 66.82,
      "markerScore": 28.29,
      "confidence": 39,
      "markerFreeContribution": 44.6,
      "markerBasedContribution": 29.32,
      "overall": 45.85
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 3.59,
      "surfaceScore": 20.18,
      "marginScore": 16.7,
      "stabilityScore": 37.06,
      "markerScore": 35.54,
      "confidence": 24.25,
      "markerFreeContribution": 22.61,
      "markerBasedContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "mfs-011",
    "input": {
      "deformableQuality": 0.54,
      "surfaceFidelity": 0.49,
      "marginClarity": 0.49,
      "fusionStability": 0.57,
      "markerPassRate": 0.6,
      "markerOptimism": 0.42,
      "deformationHardness": 0.49,
      "overclaimRisk": 0.4,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 47.21,
      "surfaceScore": 52.75,
      "marginScore": 47.19,
      "stabilityScore": 60.27,
      "markerScore": 30.54,
      "confidence": 42.25,
      "markerFreeContribution": 51.41,
      "markerBasedContribution": 31.82,
      "overall": 51.88
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 17.1,
      "surfaceScore": 21.62,
      "marginScore": 18.14,
      "stabilityScore": 38.58,
      "markerScore": 54.12,
      "confidence": 26.1,
      "markerFreeContribution": 29.91,
      "markerBasedContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "mfs-012",
    "input": {
      "deformableQuality": 0.5,
      "surfaceFidelity": 0.48,
      "marginClarity": 0.53,
      "fusionStability": 0.53,
      "markerPassRate": 0.56,
      "markerOptimism": 0.37,
      "deformationHardness": 0.42,
      "overclaimRisk": 0.35,
      "fusionBias": "surface_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 38.19,
      "surfaceScore": 51.28,
      "marginScore": 61.94,
      "stabilityScore": 43.82,
      "markerScore": 28.34,
      "confidence": 42.1,
      "markerFreeContribution": 49.22,
      "markerBasedContribution": 29.7,
      "overall": 49.71
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 13.23,
      "surfaceScore": 19.68,
      "marginScore": 16.17,
      "stabilityScore": 35.76,
      "markerScore": 34.93,
      "confidence": 24.35,
      "markerFreeContribution": 23.95,
      "markerBasedContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "mfs-013",
    "input": {
      "deformableQuality": 0.54,
      "surfaceFidelity": 0.52,
      "marginClarity": 0.56,
      "fusionStability": 0.57,
      "markerPassRate": 0.6,
      "markerOptimism": 0.39,
      "deformationHardness": 0.42,
      "overclaimRisk": 0.36,
      "fusionBias": "marker_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 29.13,
      "surfaceScore": 44.88,
      "marginScore": 36.59,
      "stabilityScore": 32.66,
      "markerScore": 31.2,
      "confidence": 45.35,
      "markerFreeContribution": 35.78,
      "markerBasedContribution": 32.8,
      "overall": 36.24
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 22.62,
      "surfaceScore": 21.35,
      "marginScore": 17.8,
      "stabilityScore": 37.74,
      "markerScore": 67.02,
      "confidence": 26.55,
      "markerFreeContribution": 33.31,
      "markerBasedContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "mfs-014",
    "input": {
      "deformableQuality": 0.58,
      "surfaceFidelity": 0.56,
      "marginClarity": 0.6,
      "fusionStability": 0.61,
      "markerPassRate": 0.63,
      "markerOptimism": 0.4,
      "deformationHardness": 0.43,
      "overclaimRisk": 0.36,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 52.62,
      "surfaceScore": 58.53,
      "marginScore": 56.66,
      "stabilityScore": 64.86,
      "markerScore": 33.07,
      "confidence": 49,
      "markerFreeContribution": 57.86,
      "markerBasedContribution": 34.8,
      "overall": 57.71
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 20.03,
      "surfaceScore": 22.2,
      "marginScore": 18.59,
      "stabilityScore": 38.98,
      "markerScore": 55.96,
      "confidence": 27.85,
      "markerFreeContribution": 31.15,
      "markerBasedContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "mfs-015",
    "input": {
      "deformableQuality": 0.62,
      "surfaceFidelity": 0.54,
      "marginClarity": 0.56,
      "fusionStability": 0.65,
      "markerPassRate": 0.67,
      "markerOptimism": 0.36,
      "deformationHardness": 0.44,
      "overclaimRisk": 0.31,
      "fusionBias": "deformable_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 45.9,
      "surfaceScore": 58.35,
      "marginScore": 39.3,
      "stabilityScore": 79.94,
      "markerScore": 34.55,
      "confidence": 49.6,
      "markerFreeContribution": 54.53,
      "markerBasedContribution": 36.22,
      "overall": 55.23
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 9.43,
      "surfaceScore": 21.14,
      "marginScore": 17.93,
      "stabilityScore": 39.27,
      "markerScore": 38.2,
      "confidence": 27.75,
      "markerFreeContribution": 25.19,
      "markerBasedContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "mfs-016",
    "input": {
      "deformableQuality": 0.58,
      "surfaceFidelity": 0.59,
      "marginClarity": 0.6,
      "fusionStability": 0.6,
      "markerPassRate": 0.63,
      "markerOptimism": 0.37,
      "deformationHardness": 0.36,
      "overclaimRisk": 0.32,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 54.46,
      "surfaceScore": 60.67,
      "marginScore": 57.87,
      "stabilityScore": 65.05,
      "markerScore": 33.73,
      "confidence": 50.35,
      "markerFreeContribution": 59.24,
      "markerBasedContribution": 35.76,
      "overall": 59.01
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 22.05,
      "surfaceScore": 21.91,
      "marginScore": 18.56,
      "stabilityScore": 38.14,
      "markerScore": 55.7,
      "confidence": 28.3,
      "markerFreeContribution": 31.27,
      "markerBasedContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "mfs-017",
    "input": {
      "deformableQuality": 0.62,
      "surfaceFidelity": 0.63,
      "marginClarity": 0.63,
      "fusionStability": 0.64,
      "markerPassRate": 0.67,
      "markerOptimism": 0.39,
      "deformationHardness": 0.37,
      "overclaimRisk": 0.33,
      "fusionBias": "surface_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 48.43,
      "surfaceScore": 64.28,
      "marginScore": 75.13,
      "stabilityScore": 52.76,
      "markerScore": 36.41,
      "confidence": 53.6,
      "markerFreeContribution": 60.66,
      "markerBasedContribution": 38.61,
      "overall": 60.69
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 18.73,
      "surfaceScore": 23.42,
      "marginScore": 20,
      "stabilityScore": 40.11,
      "markerScore": 39.86,
      "confidence": 30.3,
      "markerFreeContribution": 28.42,
      "markerBasedContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "mfs-018",
    "input": {
      "deformableQuality": 0.66,
      "surfaceFidelity": 0.61,
      "marginClarity": 0.67,
      "fusionStability": 0.68,
      "markerPassRate": 0.7,
      "markerOptimism": 0.34,
      "deformationHardness": 0.38,
      "overclaimRisk": 0.27,
      "fusionBias": "marker_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 38.33,
      "surfaceScore": 54.13,
      "marginScore": 45.52,
      "stabilityScore": 40.09,
      "markerScore": 37.08,
      "confidence": 56.35,
      "markerFreeContribution": 44.52,
      "markerBasedContribution": 39.16,
      "overall": 44.56
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 28.36,
      "surfaceScore": 21.66,
      "marginScore": 18.31,
      "stabilityScore": 39.67,
      "markerScore": 74.27,
      "confidence": 29.5,
      "markerFreeContribution": 36.45,
      "markerBasedContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "mfs-019",
    "input": {
      "deformableQuality": 0.7,
      "surfaceFidelity": 0.65,
      "marginClarity": 0.7,
      "fusionStability": 0.72,
      "markerPassRate": 0.74,
      "markerOptimism": 0.36,
      "deformationHardness": 0.38,
      "overclaimRisk": 0.28,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 63.81,
      "surfaceScore": 67.74,
      "marginScore": 68.17,
      "stabilityScore": 75.07,
      "markerScore": 39.94,
      "confidence": 59.6,
      "markerFreeContribution": 68.45,
      "markerBasedContribution": 42.25,
      "overall": 67.73
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 26.25,
      "surfaceScore": 23.32,
      "marginScore": 19.92,
      "stabilityScore": 41.65,
      "markerScore": 62.07,
      "confidence": 31.7,
      "markerFreeContribution": 34.64,
      "markerBasedContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "mfs-020",
    "input": {
      "deformableQuality": 0.66,
      "surfaceFidelity": 0.7,
      "marginClarity": 0.66,
      "fusionStability": 0.68,
      "markerPassRate": 0.7,
      "markerOptimism": 0.37,
      "deformationHardness": 0.31,
      "overclaimRisk": 0.29,
      "fusionBias": "deformable_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 52.86,
      "surfaceScore": 70.06,
      "marginScore": 45.74,
      "stabilityScore": 86.81,
      "markerScore": 38.94,
      "confidence": 58.35,
      "markerFreeContribution": 62.46,
      "markerBasedContribution": 41.54,
      "overall": 62.69
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 13.66,
      "surfaceScore": 23.93,
      "marginScore": 20.75,
      "stabilityScore": 40.51,
      "markerScore": 40.86,
      "confidence": 32.05,
      "markerFreeContribution": 27.94,
      "markerBasedContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "mfs-021",
    "input": {
      "deformableQuality": 0.7,
      "surfaceFidelity": 0.68,
      "marginClarity": 0.7,
      "fusionStability": 0.72,
      "markerPassRate": 0.73,
      "markerOptimism": 0.33,
      "deformationHardness": 0.31,
      "overclaimRisk": 0.24,
      "fusionBias": "balanced",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 65.6,
      "surfaceScore": 69.88,
      "marginScore": 69.32,
      "stabilityScore": 75.82,
      "markerScore": 39.99,
      "confidence": 60.95,
      "markerFreeContribution": 69.92,
      "markerBasedContribution": 42.54,
      "overall": 68.99
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 27.89,
      "surfaceScore": 22.72,
      "marginScore": 19.62,
      "stabilityScore": 40.35,
      "markerScore": 61.19,
      "confidence": 31.8,
      "markerFreeContribution": 34.35,
      "markerBasedContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "mfs-022",
    "input": {
      "deformableQuality": 0.74,
      "surfaceFidelity": 0.72,
      "marginClarity": 0.73,
      "fusionStability": 0.76,
      "markerPassRate": 0.77,
      "markerOptimism": 0.34,
      "deformationHardness": 0.32,
      "overclaimRisk": 0.25,
      "fusionBias": "surface_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 57.62,
      "surfaceScore": 73.52,
      "marginScore": 88.86,
      "stabilityScore": 60.51,
      "markerScore": 42.47,
      "confidence": 64.35,
      "markerFreeContribution": 70.82,
      "markerBasedContribution": 45.15,
      "overall": 70.2
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 24.57,
      "surfaceScore": 23.79,
      "marginScore": 20.63,
      "stabilityScore": 42.05,
      "markerScore": 42.21,
      "confidence": 33.35,
      "markerFreeContribution": 30.65,
      "markerBasedContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "mfs-023",
    "input": {
      "deformableQuality": 0.79,
      "surfaceFidelity": 0.76,
      "marginClarity": 0.77,
      "fusionStability": 0.8,
      "markerPassRate": 0.81,
      "markerOptimism": 0.36,
      "deformationHardness": 0.33,
      "overclaimRisk": 0.25,
      "fusionBias": "marker_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 49.04,
      "surfaceScore": 67.38,
      "marginScore": 53.74,
      "stabilityScore": 49.49,
      "markerScore": 45.16,
      "confidence": 68.25,
      "markerFreeContribution": 54.86,
      "markerBasedContribution": 48.03,
      "overall": 54.63
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 33.86,
      "surfaceScore": 25.25,
      "marginScore": 22.05,
      "stabilityScore": 43.92,
      "markerScore": 84.72,
      "confidence": 35.45,
      "markerFreeContribution": 41.96,
      "markerBasedContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "mfs-024",
    "input": {
      "deformableQuality": 0.75,
      "surfaceFidelity": 0.75,
      "marginClarity": 0.81,
      "fusionStability": 0.76,
      "markerPassRate": 0.77,
      "markerOptimism": 0.31,
      "deformationHardness": 0.25,
      "overclaimRisk": 0.2,
      "fusionBias": "balanced",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 71.55,
      "surfaceScore": 75.91,
      "marginScore": 78.99,
      "stabilityScore": 80.56,
      "markerScore": 43.13,
      "confidence": 68.1,
      "markerFreeContribution": 76.66,
      "markerBasedContribution": 46.07,
      "overall": 75.15
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 31.21,
      "surfaceScore": 23.36,
      "marginScore": 20.13,
      "stabilityScore": 41.11,
      "markerScore": 63.65,
      "confidence": 33.9,
      "markerFreeContribution": 35.89,
      "markerBasedContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "mfs-025",
    "input": {
      "deformableQuality": 0.79,
      "surfaceFidelity": 0.79,
      "marginClarity": 0.77,
      "fusionStability": 0.8,
      "markerPassRate": 0.8,
      "markerOptimism": 0.33,
      "deformationHardness": 0.26,
      "overclaimRisk": 0.21,
      "fusionBias": "deformable_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 62.51,
      "surfaceScore": 79.52,
      "marginScore": 54.86,
      "stabilityScore": 100,
      "markerScore": 45.2,
      "confidence": 69.6,
      "markerFreeContribution": 72.7,
      "markerBasedContribution": 48.27,
      "overall": 72.3
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 19.5,
      "surfaceScore": 24.6,
      "marginScore": 21.69,
      "stabilityScore": 42.63,
      "markerScore": 43.52,
      "confidence": 35.55,
      "markerFreeContribution": 30.39,
      "markerBasedContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "mfs-026",
    "input": {
      "deformableQuality": 0.83,
      "surfaceFidelity": 0.83,
      "marginClarity": 0.8,
      "fusionStability": 0.83,
      "markerPassRate": 0.84,
      "markerOptimism": 0.34,
      "deformationHardness": 0.27,
      "overclaimRisk": 0.22,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 78.52,
      "surfaceScore": 83.17,
      "marginScore": 80.3,
      "stabilityScore": 87.68,
      "markerScore": 47.68,
      "confidence": 73,
      "markerFreeContribution": 82.15,
      "markerBasedContribution": 50.87,
      "overall": 80.52
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 33.17,
      "surfaceScore": 25.67,
      "marginScore": 22.7,
      "stabilityScore": 44.32,
      "markerScore": 68.8,
      "confidence": 37.1,
      "markerFreeContribution": 38.93,
      "markerBasedContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "mfs-027",
    "input": {
      "deformableQuality": 0.87,
      "surfaceFidelity": 0.81,
      "marginClarity": 0.84,
      "fusionStability": 0.87,
      "markerPassRate": 0.88,
      "markerOptimism": 0.3,
      "deformationHardness": 0.27,
      "overclaimRisk": 0.17,
      "fusionBias": "surface_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 67.26,
      "surfaceScore": 82.98,
      "marginScore": 100,
      "stabilityScore": 68.1,
      "markerScore": 49.35,
      "confidence": 75.6,
      "markerFreeContribution": 80.38,
      "markerBasedContribution": 52.5,
      "overall": 79.36
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 30.78,
      "surfaceScore": 24.7,
      "marginScore": 21.75,
      "stabilityScore": 44.62,
      "markerScore": 45.22,
      "confidence": 37.2,
      "markerFreeContribution": 33.41,
      "markerBasedContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "mfs-028",
    "input": {
      "deformableQuality": 0.83,
      "surfaceFidelity": 0.86,
      "marginClarity": 0.87,
      "fusionStability": 0.83,
      "markerPassRate": 0.84,
      "markerOptimism": 0.31,
      "deformationHardness": 0.2,
      "overclaimRisk": 0.17,
      "fusionBias": "marker_first",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 54.87,
      "surfaceScore": 75.3,
      "marginScore": 60.62,
      "stabilityScore": 53.51,
      "markerScore": 48.34,
      "confidence": 76.1,
      "markerFreeContribution": 61.08,
      "markerBasedContribution": 51.73,
      "overall": 60.4
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 38.81,
      "surfaceScore": 25.25,
      "marginScore": 22.17,
      "stabilityScore": 43.48,
      "markerScore": 86.95,
      "confidence": 37.65,
      "markerFreeContribution": 43.33,
      "markerBasedContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "mfs-029",
    "input": {
      "deformableQuality": 0.87,
      "surfaceFidelity": 0.9,
      "marginClarity": 0.91,
      "fusionStability": 0.87,
      "markerPassRate": 0.87,
      "markerOptimism": 0.33,
      "deformationHardness": 0.2,
      "overclaimRisk": 0.18,
      "fusionBias": "balanced",
      "profile": "marker_free"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 83.89,
      "surfaceScore": 88.91,
      "marginScore": 89.72,
      "stabilityScore": 92.27,
      "markerScore": 50.59,
      "confidence": 79.6,
      "markerFreeContribution": 88.57,
      "markerBasedContribution": 54.16,
      "overall": 86.38
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 36.33,
      "surfaceScore": 26.6,
      "marginScore": 23.46,
      "stabilityScore": 45,
      "markerScore": 71.06,
      "confidence": 39.5,
      "markerFreeContribution": 40.49,
      "markerBasedContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "mfs-030",
    "input": {
      "deformableQuality": 0.91,
      "surfaceFidelity": 0.88,
      "marginClarity": 0.87,
      "fusionStability": 0.91,
      "markerPassRate": 0.91,
      "markerOptimism": 0.28,
      "deformationHardness": 0.21,
      "overclaimRisk": 0.13,
      "fusionBias": "deformable_first",
      "profile": "marker_based"
    },
    "expectedMarkerFree": {
      "mode": "marker_free",
      "deformableScore": 71.59,
      "surfaceScore": 88.77,
      "marginScore": 63.26,
      "stabilityScore": 100,
      "markerScore": 51.88,
      "confidence": 80.35,
      "markerFreeContribution": 79.63,
      "markerBasedContribution": 55.31,
      "overall": 79.25
    },
    "expectedMarkerBased": {
      "mode": "marker_based",
      "deformableScore": 25.72,
      "surfaceScore": 25.06,
      "marginScore": 22.34,
      "stabilityScore": 45.02,
      "markerScore": 46.21,
      "confidence": 38.95,
      "markerFreeContribution": 32.87,
      "markerBasedContribution": 50.68,
      "overall": 44.3
    }
  }
];
