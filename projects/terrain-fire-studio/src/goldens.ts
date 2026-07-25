import type { TerrainInput, TerrainQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TerrainInput;
  expectedPhysicsAware: TerrainQuality;
  expectedNaiveOverlay: TerrainQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tfs-001",
    "input": {
      "photoResolutionCm": 44.25,
      "cloudCover": 0.45,
      "overlapRatio": 0.39,
      "elevationChangeM": 17.6,
      "slopeSteepness": 0.55,
      "fuelDrift": 0.49,
      "controlPointDensity": 0.34,
      "elevationPriorStrength": 0.3,
      "seamBudgetM": 2,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 6.04,
      "slopeCoherence": 39.34,
      "seamContinuity": 14.12,
      "fuelLayerFidelity": 41.35,
      "photogrammetryScore": 41.41,
      "confidence": 31.79,
      "physicsContribution": 25,
      "overlayContribution": 12.11,
      "overall": 26.16
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 40.51,
      "photogrammetryScore": 41.9,
      "confidence": 11.93,
      "physicsContribution": 16.48,
      "overlayContribution": 25.49,
      "overall": 6.57
    }
  },
  {
    "id": "tfs-002",
    "input": {
      "photoResolutionCm": 44.72,
      "cloudCover": 0.46,
      "overlapRatio": 0.42,
      "elevationChangeM": 17.92,
      "slopeSteepness": 0.56,
      "fuelDrift": 0.5,
      "controlPointDensity": 0.37,
      "elevationPriorStrength": 0.34,
      "seamBudgetM": 2.61,
      "alignmentBias": "elevation_first",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 8.39,
      "slopeCoherence": 39.6,
      "seamContinuity": 14.66,
      "fuelLayerFidelity": 37.26,
      "photogrammetryScore": 34.71,
      "confidence": 33.56,
      "physicsContribution": 24.46,
      "overlayContribution": 7.21,
      "overall": 24.67
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 39.73,
      "photogrammetryScore": 42.27,
      "confidence": 12.1,
      "physicsContribution": 16.4,
      "overlayContribution": 25.34,
      "overall": 6.36
    }
  },
  {
    "id": "tfs-003",
    "input": {
      "photoResolutionCm": 45.18,
      "cloudCover": 0.41,
      "overlapRatio": 0.45,
      "elevationChangeM": 18.23,
      "slopeSteepness": 0.5,
      "fuelDrift": 0.51,
      "controlPointDensity": 0.4,
      "elevationPriorStrength": 0.32,
      "seamBudgetM": 2.01,
      "alignmentBias": "photo_drape",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 8.66,
      "slopeCoherence": 28.68,
      "seamContinuity": 0,
      "fuelLayerFidelity": 38.29,
      "photogrammetryScore": 36.7,
      "confidence": 36.53,
      "physicsContribution": 19.07,
      "overlayContribution": 9.76,
      "overall": 21.02
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 40.28,
      "photogrammetryScore": 44.14,
      "confidence": 14.82,
      "physicsContribution": 16.88,
      "overlayContribution": 26.34,
      "overall": 7.69
    }
  },
  {
    "id": "tfs-004",
    "input": {
      "photoResolutionCm": 39.65,
      "cloudCover": 0.41,
      "overlapRatio": 0.48,
      "elevationChangeM": 15.35,
      "slopeSteepness": 0.51,
      "fuelDrift": 0.43,
      "controlPointDensity": 0.44,
      "elevationPriorStrength": 0.36,
      "seamBudgetM": 2.62,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 13,
      "slopeCoherence": 44.02,
      "seamContinuity": 15.92,
      "fuelLayerFidelity": 47.41,
      "photogrammetryScore": 48.2,
      "confidence": 40.56,
      "physicsContribution": 30.13,
      "overlayContribution": 18.16,
      "overall": 31.5
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 45.67,
      "photogrammetryScore": 48.36,
      "confidence": 17.57,
      "physicsContribution": 18.81,
      "overlayContribution": 31.29,
      "overall": 11.72
    }
  },
  {
    "id": "tfs-005",
    "input": {
      "photoResolutionCm": 40.11,
      "cloudCover": 0.42,
      "overlapRatio": 0.43,
      "elevationChangeM": 15.67,
      "slopeSteepness": 0.51,
      "fuelDrift": 0.44,
      "controlPointDensity": 0.4,
      "elevationPriorStrength": 0.4,
      "seamBudgetM": 3.23,
      "alignmentBias": "tight_control",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 12.26,
      "slopeCoherence": 44.9,
      "seamContinuity": 15.2,
      "fuelLayerFidelity": 41.78,
      "photogrammetryScore": 38.69,
      "confidence": 37.14,
      "physicsContribution": 28.04,
      "overlayContribution": 11.52,
      "overall": 28.41
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 44.9,
      "photogrammetryScore": 46.33,
      "confidence": 15.89,
      "physicsContribution": 18.25,
      "overlayContribution": 29.94,
      "overall": 10.59
    }
  },
  {
    "id": "tfs-006",
    "input": {
      "photoResolutionCm": 40.58,
      "cloudCover": 0.37,
      "overlapRatio": 0.46,
      "elevationChangeM": 15.99,
      "slopeSteepness": 0.46,
      "fuelDrift": 0.45,
      "controlPointDensity": 0.43,
      "elevationPriorStrength": 0.38,
      "seamBudgetM": 2.63,
      "alignmentBias": "balanced",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 14.09,
      "slopeCoherence": 47.36,
      "seamContinuity": 15.74,
      "fuelLayerFidelity": 46.9,
      "photogrammetryScore": 48.13,
      "confidence": 40.11,
      "physicsContribution": 31.12,
      "overlayContribution": 19,
      "overall": 32.45
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 45.45,
      "photogrammetryScore": 48.2,
      "confidence": 18.46,
      "physicsContribution": 18.73,
      "overlayContribution": 30.94,
      "overall": 11.84
    }
  },
  {
    "id": "tfs-007",
    "input": {
      "photoResolutionCm": 41.04,
      "cloudCover": 0.38,
      "overlapRatio": 0.49,
      "elevationChangeM": 16.3,
      "slopeSteepness": 0.47,
      "fuelDrift": 0.46,
      "controlPointDensity": 0.46,
      "elevationPriorStrength": 0.42,
      "seamBudgetM": 3.24,
      "alignmentBias": "elevation_first",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 15.06,
      "slopeCoherence": 47.63,
      "seamContinuity": 16.28,
      "fuelLayerFidelity": 42.56,
      "photogrammetryScore": 40.98,
      "confidence": 41.88,
      "physicsContribution": 30.11,
      "overlayContribution": 13.78,
      "overall": 30.52
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 44.68,
      "photogrammetryScore": 48.58,
      "confidence": 18.63,
      "physicsContribution": 18.65,
      "overlayContribution": 30.8,
      "overall": 11.64
    }
  },
  {
    "id": "tfs-008",
    "input": {
      "photoResolutionCm": 35.51,
      "cloudCover": 0.39,
      "overlapRatio": 0.52,
      "elevationChangeM": 13.42,
      "slopeSteepness": 0.47,
      "fuelDrift": 0.39,
      "controlPointDensity": 0.5,
      "elevationPriorStrength": 0.46,
      "seamBudgetM": 3.85,
      "alignmentBias": "photo_drape",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 17.99,
      "slopeCoherence": 35.47,
      "seamContinuity": 1,
      "fuelLayerFidelity": 46.96,
      "photogrammetryScore": 44.63,
      "confidence": 45.71,
      "physicsContribution": 25.7,
      "overlayContribution": 16.89,
      "overall": 27.76
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 9.84,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 49.54,
      "photogrammetryScore": 52.54,
      "confidence": 21.28,
      "physicsContribution": 22.38,
      "overlayContribution": 35.46,
      "overall": 16.04
    }
  },
  {
    "id": "tfs-009",
    "input": {
      "photoResolutionCm": 35.97,
      "cloudCover": 0.33,
      "overlapRatio": 0.55,
      "elevationChangeM": 13.74,
      "slopeSteepness": 0.42,
      "fuelDrift": 0.39,
      "controlPointDensity": 0.53,
      "elevationPriorStrength": 0.45,
      "seamBudgetM": 3.26,
      "alignmentBias": "balanced",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 21.61,
      "slopeCoherence": 52.3,
      "seamContinuity": 17.54,
      "fuelLayerFidelity": 52.96,
      "photogrammetryScore": 54.93,
      "confidence": 48.89,
      "physicsContribution": 36.47,
      "overlayContribution": 25.05,
      "overall": 37.96
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 6.24,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 50.62,
      "photogrammetryScore": 54.67,
      "confidence": 24.1,
      "physicsContribution": 22.31,
      "overlayContribution": 36.75,
      "overall": 17.35
    }
  },
  {
    "id": "tfs-010",
    "input": {
      "photoResolutionCm": 36.44,
      "cloudCover": 0.34,
      "overlapRatio": 0.51,
      "elevationChangeM": 14.06,
      "slopeSteepness": 0.43,
      "fuelDrift": 0.4,
      "controlPointDensity": 0.49,
      "elevationPriorStrength": 0.49,
      "seamBudgetM": 3.86,
      "alignmentBias": "tight_control",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 19.32,
      "slopeCoherence": 52.56,
      "seamContinuity": 16.82,
      "fuelLayerFidelity": 47.22,
      "photogrammetryScore": 45.23,
      "confidence": 45.76,
      "physicsContribution": 33.76,
      "overlayContribution": 18.08,
      "overall": 34.31
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 49.84,
      "photogrammetryScore": 52.94,
      "confidence": 22.52,
      "physicsContribution": 20.56,
      "overlayContribution": 35.55,
      "overall": 15.91
    }
  },
  {
    "id": "tfs-011",
    "input": {
      "photoResolutionCm": 36.91,
      "cloudCover": 0.35,
      "overlapRatio": 0.54,
      "elevationChangeM": 14.37,
      "slopeSteepness": 0.43,
      "fuelDrift": 0.41,
      "controlPointDensity": 0.52,
      "elevationPriorStrength": 0.53,
      "seamBudgetM": 4.47,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 25.69,
      "slopeCoherence": 53.44,
      "seamContinuity": 17.36,
      "fuelLayerFidelity": 51.34,
      "photogrammetryScore": 53.45,
      "confidence": 47.53,
      "physicsContribution": 37.44,
      "overlayContribution": 23.63,
      "overall": 38.4
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 4.38,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 49.07,
      "photogrammetryScore": 53.3,
      "confidence": 22.84,
      "physicsContribution": 21.35,
      "overlayContribution": 35.39,
      "overall": 16.02
    }
  },
  {
    "id": "tfs-012",
    "input": {
      "photoResolutionCm": 31.37,
      "cloudCover": 0.3,
      "overlapRatio": 0.57,
      "elevationChangeM": 11.49,
      "slopeSteepness": 0.38,
      "fuelDrift": 0.34,
      "controlPointDensity": 0.56,
      "elevationPriorStrength": 0.51,
      "seamBudgetM": 3.88,
      "alignmentBias": "elevation_first",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 22.46,
      "slopeCoherence": 56.86,
      "seamContinuity": 18.08,
      "fuelLayerFidelity": 52.65,
      "photogrammetryScore": 50.87,
      "confidence": 52.56,
      "physicsContribution": 37.39,
      "overlayContribution": 23.54,
      "overall": 38.34
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 0.22,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 55.26,
      "photogrammetryScore": 58.78,
      "confidence": 27.74,
      "physicsContribution": 22.85,
      "overlayContribution": 41.22,
      "overall": 21.04
    }
  },
  {
    "id": "tfs-013",
    "input": {
      "photoResolutionCm": 31.84,
      "cloudCover": 0.31,
      "overlapRatio": 0.6,
      "elevationChangeM": 11.81,
      "slopeSteepness": 0.38,
      "fuelDrift": 0.35,
      "controlPointDensity": 0.59,
      "elevationPriorStrength": 0.55,
      "seamBudgetM": 4.48,
      "alignmentBias": "photo_drape",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 25.11,
      "slopeCoherence": 43.74,
      "seamContinuity": 2.62,
      "fuelLayerFidelity": 52.41,
      "photogrammetryScore": 51.17,
      "confidence": 54.33,
      "physicsContribution": 31.58,
      "overlayContribution": 23.65,
      "overall": 33.84
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 17.02,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 54.49,
      "photogrammetryScore": 59.15,
      "confidence": 28.06,
      "physicsContribution": 26.13,
      "overlayContribution": 41.07,
      "overall": 21.85
    }
  },
  {
    "id": "tfs-014",
    "input": {
      "photoResolutionCm": 32.3,
      "cloudCover": 0.31,
      "overlapRatio": 0.63,
      "elevationChangeM": 12.12,
      "slopeSteepness": 0.39,
      "fuelDrift": 0.35,
      "controlPointDensity": 0.63,
      "elevationPriorStrength": 0.59,
      "seamBudgetM": 5.09,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 32.99,
      "slopeCoherence": 58.13,
      "seamContinuity": 19.34,
      "fuelLayerFidelity": 57.4,
      "photogrammetryScore": 60.25,
      "confidence": 56.71,
      "physicsContribution": 42.71,
      "overlayContribution": 29.69,
      "overall": 43.85
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 11.76,
      "slopeCoherence": 0,
      "seamContinuity": 0,
      "fuelLayerFidelity": 54.24,
      "photogrammetryScore": 59.77,
      "confidence": 28.48,
      "physicsContribution": 25.15,
      "overlayContribution": 41.2,
      "overall": 21.59
    }
  },
  {
    "id": "tfs-015",
    "input": {
      "photoResolutionCm": 32.77,
      "cloudCover": 0.26,
      "overlapRatio": 0.59,
      "elevationChangeM": 12.44,
      "slopeSteepness": 0.34,
      "fuelDrift": 0.36,
      "controlPointDensity": 0.59,
      "elevationPriorStrength": 0.57,
      "seamBudgetM": 4.5,
      "alignmentBias": "tight_control",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 26.27,
      "slopeCoherence": 60.59,
      "seamContinuity": 18.62,
      "fuelLayerFidelity": 52.67,
      "photogrammetryScore": 51.78,
      "confidence": 54.77,
      "physicsContribution": 39.58,
      "overlayContribution": 24.85,
      "overall": 40.34
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 6.96,
      "slopeCoherence": 0.29,
      "seamContinuity": 0,
      "fuelLayerFidelity": 54.78,
      "photogrammetryScore": 59.54,
      "confidence": 29.29,
      "physicsContribution": 24.31,
      "overlayContribution": 41.14,
      "overall": 21.71
    }
  },
  {
    "id": "tfs-016",
    "input": {
      "photoResolutionCm": 27.23,
      "cloudCover": 0.27,
      "overlapRatio": 0.62,
      "elevationChangeM": 9.56,
      "slopeSteepness": 0.34,
      "fuelDrift": 0.29,
      "controlPointDensity": 0.62,
      "elevationPriorStrength": 0.61,
      "seamBudgetM": 5.1,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 35.76,
      "slopeCoherence": 62.43,
      "seamContinuity": 19.16,
      "fuelLayerFidelity": 62.1,
      "photogrammetryScore": 64.56,
      "confidence": 58.21,
      "physicsContribution": 45.65,
      "overlayContribution": 36.12,
      "overall": 47.55
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 20.2,
      "slopeCoherence": 4.48,
      "seamContinuity": 0.93,
      "fuelLayerFidelity": 59.66,
      "photogrammetryScore": 63.51,
      "confidence": 31.95,
      "physicsContribution": 29.76,
      "overlayContribution": 47.08,
      "overall": 28.26
    }
  },
  {
    "id": "tfs-017",
    "input": {
      "photoResolutionCm": 27.7,
      "cloudCover": 0.28,
      "overlapRatio": 0.65,
      "elevationChangeM": 9.88,
      "slopeSteepness": 0.35,
      "fuelDrift": 0.3,
      "controlPointDensity": 0.65,
      "elevationPriorStrength": 0.65,
      "seamBudgetM": 5.71,
      "alignmentBias": "elevation_first",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 34.47,
      "slopeCoherence": 62.69,
      "seamContinuity": 19.7,
      "fuelLayerFidelity": 56.83,
      "photogrammetryScore": 55.73,
      "confidence": 59.98,
      "physicsContribution": 43.68,
      "overlayContribution": 31.9,
      "overall": 45.09
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 5.72,
      "slopeCoherence": 6.49,
      "seamContinuity": 1.14,
      "fuelLayerFidelity": 58.88,
      "photogrammetryScore": 63.88,
      "confidence": 32.12,
      "physicsContribution": 27.22,
      "overlayContribution": 48.37,
      "overall": 29.27
    }
  },
  {
    "id": "tfs-018",
    "input": {
      "photoResolutionCm": 28.16,
      "cloudCover": 0.22,
      "overlapRatio": 0.68,
      "elevationChangeM": 10.19,
      "slopeSteepness": 0.3,
      "fuelDrift": 0.3,
      "controlPointDensity": 0.69,
      "elevationPriorStrength": 0.63,
      "seamBudgetM": 5.12,
      "alignmentBias": "photo_drape",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 32.1,
      "slopeCoherence": 51.27,
      "seamContinuity": 4.42,
      "fuelLayerFidelity": 58.42,
      "photogrammetryScore": 58,
      "confidence": 63.56,
      "physicsContribution": 37.4,
      "overlayContribution": 30.65,
      "overall": 39.92
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 23.94,
      "slopeCoherence": 3.6,
      "seamContinuity": 1.37,
      "fuelLayerFidelity": 59.95,
      "photogrammetryScore": 66,
      "confidence": 34.94,
      "physicsContribution": 30.97,
      "overlayContribution": 47.05,
      "overall": 28.21
    }
  },
  {
    "id": "tfs-019",
    "input": {
      "photoResolutionCm": 28.63,
      "cloudCover": 0.23,
      "overlapRatio": 0.71,
      "elevationChangeM": 10.51,
      "slopeSteepness": 0.3,
      "fuelDrift": 0.31,
      "controlPointDensity": 0.72,
      "elevationPriorStrength": 0.67,
      "seamBudgetM": 5.72,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 43.22,
      "slopeCoherence": 66.15,
      "seamContinuity": 20.96,
      "fuelLayerFidelity": 63.1,
      "photogrammetryScore": 67.25,
      "confidence": 65.33,
      "physicsContribution": 49.49,
      "overlayContribution": 39.2,
      "overall": 51.23
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 18.94,
      "slopeCoherence": 6.15,
      "seamContinuity": 1.59,
      "fuelLayerFidelity": 59.18,
      "photogrammetryScore": 66.37,
      "confidence": 35.26,
      "physicsContribution": 30.45,
      "overlayContribution": 48.42,
      "overall": 29.96
    }
  },
  {
    "id": "tfs-020",
    "input": {
      "photoResolutionCm": 23.09,
      "cloudCover": 0.24,
      "overlapRatio": 0.66,
      "elevationChangeM": 7.63,
      "slopeSteepness": 0.31,
      "fuelDrift": 0.24,
      "controlPointDensity": 0.68,
      "elevationPriorStrength": 0.71,
      "seamBudgetM": 6.33,
      "alignmentBias": "tight_control",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 44.04,
      "slopeCoherence": 67.37,
      "seamContinuity": 20.24,
      "fuelLayerFidelity": 61.35,
      "photogrammetryScore": 59.71,
      "confidence": 63.56,
      "physicsContribution": 48.71,
      "overlayContribution": 43.9,
      "overall": 51.65
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 21.1,
      "slopeCoherence": 19.08,
      "seamContinuity": 4.04,
      "fuelLayerFidelity": 64.05,
      "photogrammetryScore": 67.95,
      "confidence": 35.76,
      "physicsContribution": 35.24,
      "overlayContribution": 58.23,
      "overall": 42.08
    }
  },
  {
    "id": "tfs-021",
    "input": {
      "photoResolutionCm": 23.56,
      "cloudCover": 0.19,
      "overlapRatio": 0.7,
      "elevationChangeM": 7.94,
      "slopeSteepness": 0.25,
      "fuelDrift": 0.25,
      "controlPointDensity": 0.71,
      "elevationPriorStrength": 0.69,
      "seamBudgetM": 5.74,
      "alignmentBias": "balanced",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 50.4,
      "slopeCoherence": 70.45,
      "seamContinuity": 20.78,
      "fuelLayerFidelity": 67.8,
      "photogrammetryScore": 71.57,
      "confidence": 66.83,
      "physicsContribution": 53.67,
      "overlayContribution": 50.56,
      "overall": 56.99
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 27.4,
      "slopeCoherence": 17.94,
      "seamContinuity": 4.47,
      "fuelLayerFidelity": 64.6,
      "photogrammetryScore": 70.11,
      "confidence": 38.73,
      "physicsContribution": 36.9,
      "overlayContribution": 57.59,
      "overall": 41.5
    }
  },
  {
    "id": "tfs-022",
    "input": {
      "photoResolutionCm": 24.03,
      "cloudCover": 0.2,
      "overlapRatio": 0.73,
      "elevationChangeM": 8.26,
      "slopeSteepness": 0.26,
      "fuelDrift": 0.26,
      "controlPointDensity": 0.75,
      "elevationPriorStrength": 0.73,
      "seamBudgetM": 6.34,
      "alignmentBias": "elevation_first",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 46.11,
      "slopeCoherence": 70.71,
      "seamContinuity": 21.5,
      "fuelLayerFidelity": 62.28,
      "photogrammetryScore": 62.27,
      "confidence": 69,
      "physicsContribution": 50.8,
      "overlayContribution": 45.08,
      "overall": 53.54
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 12.92,
      "slopeCoherence": 18.8,
      "seamContinuity": 4.69,
      "fuelLayerFidelity": 63.82,
      "photogrammetryScore": 70.48,
      "confidence": 38.89,
      "physicsContribution": 34.14,
      "overlayContribution": 58.24,
      "overall": 41.59
    }
  },
  {
    "id": "tfs-023",
    "input": {
      "photoResolutionCm": 24.49,
      "cloudCover": 0.2,
      "overlapRatio": 0.76,
      "elevationChangeM": 8.58,
      "slopeSteepness": 0.27,
      "fuelDrift": 0.26,
      "controlPointDensity": 0.78,
      "elevationPriorStrength": 0.78,
      "seamBudgetM": 6.95,
      "alignmentBias": "photo_drape",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 49.9,
      "slopeCoherence": 57.35,
      "seamContinuity": 6.04,
      "fuelLayerFidelity": 62.6,
      "photogrammetryScore": 62.86,
      "confidence": 70.97,
      "physicsContribution": 45.37,
      "overlayContribution": 46.31,
      "overall": 49.58
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 29.44,
      "slopeCoherence": 19.55,
      "seamContinuity": 4.9,
      "fuelLayerFidelity": 63.58,
      "photogrammetryScore": 71.11,
      "confidence": 39.32,
      "physicsContribution": 37.72,
      "overlayContribution": 59.06,
      "overall": 43.52
    }
  },
  {
    "id": "tfs-024",
    "input": {
      "photoResolutionCm": 18.96,
      "cloudCover": 0.15,
      "overlapRatio": 0.79,
      "elevationChangeM": 5.7,
      "slopeSteepness": 0.21,
      "fuelDrift": 0.19,
      "controlPointDensity": 0.82,
      "elevationPriorStrength": 0.76,
      "seamBudgetM": 6.36,
      "alignmentBias": "balanced",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 64.81,
      "slopeCoherence": 75.38,
      "seamContinuity": 30.9,
      "fuelLayerFidelity": 73.86,
      "photogrammetryScore": 78.36,
      "confidence": 76.01,
      "physicsContribution": 62.78,
      "overlayContribution": 63.92,
      "overall": 67.03
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 34.76,
      "slopeCoherence": 29.84,
      "seamContinuity": 13.44,
      "fuelLayerFidelity": 69.76,
      "photogrammetryScore": 76.57,
      "confidence": 44.37,
      "physicsContribution": 44.87,
      "overlayContribution": 68.26,
      "overall": 54.65
    }
  },
  {
    "id": "tfs-025",
    "input": {
      "photoResolutionCm": 19.42,
      "cloudCover": 0.16,
      "overlapRatio": 0.74,
      "elevationChangeM": 6.01,
      "slopeSteepness": 0.22,
      "fuelDrift": 0.2,
      "controlPointDensity": 0.78,
      "elevationPriorStrength": 0.8,
      "seamBudgetM": 6.97,
      "alignmentBias": "tight_control",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 55.21,
      "slopeCoherence": 75.65,
      "seamContinuity": 32.84,
      "fuelLayerFidelity": 66.79,
      "photogrammetryScore": 66.26,
      "confidence": 72.58,
      "physicsContribution": 58.14,
      "overlayContribution": 55.81,
      "overall": 61.63
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 28.3,
      "slopeCoherence": 29.87,
      "seamContinuity": 13.54,
      "fuelLayerFidelity": 68.99,
      "photogrammetryScore": 74.55,
      "confidence": 42.54,
      "physicsContribution": 43.05,
      "overlayContribution": 67.26,
      "overall": 53.55
    }
  },
  {
    "id": "tfs-026",
    "input": {
      "photoResolutionCm": 19.89,
      "cloudCover": 0.17,
      "overlapRatio": 0.77,
      "elevationChangeM": 6.33,
      "slopeSteepness": 0.23,
      "fuelDrift": 0.21,
      "controlPointDensity": 0.81,
      "elevationPriorStrength": 0.84,
      "seamBudgetM": 7.57,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 69.64,
      "slopeCoherence": 75.91,
      "seamContinuity": 35.42,
      "fuelLayerFidelity": 72.08,
      "photogrammetryScore": 76.6,
      "confidence": 74.35,
      "physicsContribution": 64.79,
      "overlayContribution": 63.01,
      "overall": 68.4
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 32.62,
      "slopeCoherence": 29.76,
      "seamContinuity": 14.88,
      "fuelLayerFidelity": 68.22,
      "photogrammetryScore": 74.92,
      "confidence": 42.7,
      "physicsContribution": 44.08,
      "overlayContribution": 67.37,
      "overall": 53.99
    }
  },
  {
    "id": "tfs-027",
    "input": {
      "photoResolutionCm": 20.35,
      "cloudCover": 0.12,
      "overlapRatio": 0.8,
      "elevationChangeM": 6.65,
      "slopeSteepness": 0.17,
      "fuelDrift": 0.22,
      "controlPointDensity": 0.84,
      "elevationPriorStrength": 0.82,
      "seamBudgetM": 6.98,
      "alignmentBias": "elevation_first",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 57.07,
      "slopeCoherence": 78.99,
      "seamContinuity": 26.83,
      "fuelLayerFidelity": 67.58,
      "photogrammetryScore": 68.54,
      "confidence": 77.32,
      "physicsContribution": 58.53,
      "overlayContribution": 56.9,
      "overall": 62.17
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 20.1,
      "slopeCoherence": 29.73,
      "seamContinuity": 10.06,
      "fuelLayerFidelity": 68.77,
      "photogrammetryScore": 76.79,
      "confidence": 45.43,
      "physicsContribution": 41.09,
      "overlayContribution": 67.2,
      "overall": 52.81
    }
  },
  {
    "id": "tfs-028",
    "input": {
      "photoResolutionCm": 14.82,
      "cloudCover": 0.12,
      "overlapRatio": 0.83,
      "elevationChangeM": 3.77,
      "slopeSteepness": 0.18,
      "fuelDrift": 0.14,
      "controlPointDensity": 0.88,
      "elevationPriorStrength": 0.86,
      "seamBudgetM": 7.59,
      "alignmentBias": "photo_drape",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 64.95,
      "slopeCoherence": 66.33,
      "seamContinuity": 47.3,
      "fuelLayerFidelity": 72.54,
      "photogrammetryScore": 72.47,
      "confidence": 81.36,
      "physicsContribution": 63.36,
      "overlayContribution": 66.94,
      "overall": 68.15
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 45.26,
      "slopeCoherence": 39.58,
      "seamContinuity": 33.82,
      "fuelLayerFidelity": 74.16,
      "photogrammetryScore": 81.01,
      "confidence": 48.18,
      "physicsContribution": 54.77,
      "overlayContribution": 76.71,
      "overall": 66.15
    }
  },
  {
    "id": "tfs-029",
    "input": {
      "photoResolutionCm": 15.28,
      "cloudCover": 0.13,
      "overlapRatio": 0.86,
      "elevationChangeM": 4.08,
      "slopeSteepness": 0.18,
      "fuelDrift": 0.15,
      "controlPointDensity": 0.91,
      "elevationPriorStrength": 0.9,
      "seamBudgetM": 8.19,
      "alignmentBias": "balanced",
      "profile": "physics_aware"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 81.2,
      "slopeCoherence": 81.21,
      "seamContinuity": 63.72,
      "fuelLayerFidelity": 78.14,
      "photogrammetryScore": 83.41,
      "confidence": 83.13,
      "physicsContribution": 77.19,
      "overlayContribution": 74.34,
      "overall": 80.56
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 40.28,
      "slopeCoherence": 39.36,
      "seamContinuity": 33.98,
      "fuelLayerFidelity": 73.39,
      "photogrammetryScore": 81.38,
      "confidence": 48.5,
      "physicsContribution": 53.68,
      "overlayContribution": 76.55,
      "overall": 65.72
    }
  },
  {
    "id": "tfs-030",
    "input": {
      "photoResolutionCm": 15.75,
      "cloudCover": 0.08,
      "overlapRatio": 0.82,
      "elevationChangeM": 4.4,
      "slopeSteepness": 0.13,
      "fuelDrift": 0.16,
      "controlPointDensity": 0.87,
      "elevationPriorStrength": 0.88,
      "seamBudgetM": 7.6,
      "alignmentBias": "tight_control",
      "profile": "naive_overlay"
    },
    "expectedPhysicsAware": {
      "mode": "physics_aware",
      "elevationFidelity": 64.98,
      "slopeCoherence": 83.67,
      "seamContinuity": 56.67,
      "fuelLayerFidelity": 72.24,
      "photogrammetryScore": 72.8,
      "confidence": 81.2,
      "physicsContribution": 69.59,
      "overlayContribution": 66.82,
      "overall": 72.98
    },
    "expectedNaiveOverlay": {
      "mode": "naive_overlay",
      "elevationFidelity": 35.48,
      "slopeCoherence": 39.59,
      "seamContinuity": 29.31,
      "fuelLayerFidelity": 73.94,
      "photogrammetryScore": 81.15,
      "confidence": 49.31,
      "physicsContribution": 51.89,
      "overlayContribution": 75.69,
      "overall": 64.51
    }
  }
];
