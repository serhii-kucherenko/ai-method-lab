import type { TrackInput, TrackQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TrackInput;
  expectedTrackAware: TrackQuality;
  expectedFluency: TrackQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "vts-001",
    "input": {
      "nameSensitivity": 0.17,
      "identityBind": 0.19,
      "temporalCoverage": 0.17,
      "outfitOrderFidelity": 0.18,
      "probeSpecificity": 0.18,
      "fluencyPrior": 0.34,
      "genderCueReliance": 0.35,
      "noiseLevel": 0.32,
      "probeBias": "gender_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 5.82,
      "identityScore": 7.12,
      "temporalScore": 15.11,
      "outfitScore": 11.7,
      "specificityScore": 19.07,
      "fluencyScore": 12.8,
      "confidence": 7.9,
      "trackContribution": 8.21,
      "fluencyContribution": 8.6,
      "overall": 10.86
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 4.76,
      "identityScore": 7,
      "temporalScore": 5.44,
      "outfitScore": 4.84,
      "specificityScore": 18.9,
      "fluencyScore": 19.99,
      "confidence": 19.2,
      "trackContribution": 5.88,
      "fluencyContribution": 23.8,
      "overall": 18.15
    }
  },
  {
    "id": "vts-002",
    "input": {
      "nameSensitivity": 0.21,
      "identityBind": 0.22,
      "temporalCoverage": 0.21,
      "outfitOrderFidelity": 0.22,
      "probeSpecificity": 0.22,
      "fluencyPrior": 0.37,
      "genderCueReliance": 0.35,
      "noiseLevel": 0.32,
      "probeBias": "open_ended",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 9.11,
      "identityScore": 9.83,
      "temporalScore": 19.21,
      "outfitScore": 14.91,
      "specificityScore": 22.81,
      "fluencyScore": 14.6,
      "confidence": 11.47,
      "trackContribution": 11.28,
      "fluencyContribution": 9.6,
      "overall": 14.3
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 5.48,
      "identityScore": 7.75,
      "temporalScore": 6.12,
      "outfitScore": 5.46,
      "specificityScore": 21.96,
      "fluencyScore": 22.87,
      "confidence": 22.16,
      "trackContribution": 6.62,
      "fluencyContribution": 25.9,
      "overall": 20.88
    }
  },
  {
    "id": "vts-003",
    "input": {
      "nameSensitivity": 0.26,
      "identityBind": 0.26,
      "temporalCoverage": 0.2,
      "outfitOrderFidelity": 0.27,
      "probeSpecificity": 0.21,
      "fluencyPrior": 0.4,
      "genderCueReliance": 0.32,
      "noiseLevel": 0.32,
      "probeBias": "frame_boost",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 12.2,
      "identityScore": 12.22,
      "temporalScore": 21.69,
      "outfitScore": 17.24,
      "specificityScore": 22.82,
      "fluencyScore": 15.95,
      "confidence": 13.94,
      "trackContribution": 13.89,
      "fluencyContribution": 10.1,
      "overall": 16.63
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 6.32,
      "identityScore": 8.6,
      "temporalScore": 6.4,
      "outfitScore": 6.16,
      "specificityScore": 22.13,
      "fluencyScore": 24.84,
      "confidence": 23.74,
      "trackContribution": 7.46,
      "fluencyContribution": 28,
      "overall": 22.2
    }
  },
  {
    "id": "vts-004",
    "input": {
      "nameSensitivity": 0.22,
      "identityBind": 0.3,
      "temporalCoverage": 0.24,
      "outfitOrderFidelity": 0.23,
      "probeSpecificity": 0.25,
      "fluencyPrior": 0.43,
      "genderCueReliance": 0.32,
      "noiseLevel": 0.28,
      "probeBias": "balanced",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 15.35,
      "identityScore": 20.9,
      "temporalScore": 24.2,
      "outfitScore": 20.62,
      "specificityScore": 27.24,
      "fluencyScore": 17.75,
      "confidence": 17.82,
      "trackContribution": 18.96,
      "fluencyContribution": 11.1,
      "overall": 21.02
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 6.08,
      "identityScore": 9.45,
      "temporalScore": 7.08,
      "outfitScore": 6.14,
      "specificityScore": 25.19,
      "fluencyScore": 28.14,
      "confidence": 27.24,
      "trackContribution": 7.77,
      "fluencyContribution": 30.1,
      "overall": 25.19
    }
  },
  {
    "id": "vts-005",
    "input": {
      "nameSensitivity": 0.27,
      "identityBind": 0.26,
      "temporalCoverage": 0.29,
      "outfitOrderFidelity": 0.27,
      "probeSpecificity": 0.3,
      "fluencyPrior": 0.39,
      "genderCueReliance": 0.32,
      "noiseLevel": 0.28,
      "probeBias": "name_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 16.07,
      "identityScore": 15.55,
      "temporalScore": 27.76,
      "outfitScore": 20.57,
      "specificityScore": 30.36,
      "fluencyScore": 16.9,
      "confidence": 19.13,
      "trackContribution": 17.4,
      "fluencyContribution": 10.8,
      "overall": 21.38
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 6.36,
      "identityScore": 8.45,
      "temporalScore": 7,
      "outfitScore": 6.06,
      "specificityScore": 27.08,
      "fluencyScore": 26.69,
      "confidence": 26.41,
      "trackContribution": 7.4,
      "fluencyContribution": 27.3,
      "overall": 24.8
    }
  },
  {
    "id": "vts-006",
    "input": {
      "nameSensitivity": 0.31,
      "identityBind": 0.3,
      "temporalCoverage": 0.27,
      "outfitOrderFidelity": 0.32,
      "probeSpecificity": 0.28,
      "fluencyPrior": 0.42,
      "genderCueReliance": 0.29,
      "noiseLevel": 0.28,
      "probeBias": "gender_swap",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 18.34,
      "identityScore": 17.66,
      "temporalScore": 29.38,
      "outfitScore": 22.62,
      "specificityScore": 29.59,
      "fluencyScore": 18.1,
      "confidence": 20.95,
      "trackContribution": 19.54,
      "fluencyContribution": 11.2,
      "overall": 23.08
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 7.08,
      "identityScore": 9.3,
      "temporalScore": 7.2,
      "outfitScore": 6.76,
      "specificityScore": 26.67,
      "fluencyScore": 28.43,
      "confidence": 27.7,
      "trackContribution": 8.19,
      "fluencyContribution": 29.4,
      "overall": 25.82
    }
  },
  {
    "id": "vts-007",
    "input": {
      "nameSensitivity": 0.35,
      "identityBind": 0.34,
      "temporalCoverage": 0.31,
      "outfitOrderFidelity": 0.36,
      "probeSpecificity": 0.32,
      "fluencyPrior": 0.45,
      "genderCueReliance": 0.29,
      "noiseLevel": 0.29,
      "probeBias": "open_ended",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 21.42,
      "identityScore": 20.7,
      "temporalScore": 33.5,
      "outfitScore": 25.63,
      "specificityScore": 33.41,
      "fluencyScore": 19.9,
      "confidence": 24.52,
      "trackContribution": 22.58,
      "fluencyContribution": 12.2,
      "overall": 26.53
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 7.8,
      "identityScore": 10.15,
      "temporalScore": 7.88,
      "outfitScore": 7.38,
      "specificityScore": 29.73,
      "fluencyScore": 31.21,
      "confidence": 30.51,
      "trackContribution": 8.98,
      "fluencyContribution": 31.5,
      "overall": 28.48
    }
  },
  {
    "id": "vts-008",
    "input": {
      "nameSensitivity": 0.32,
      "identityBind": 0.38,
      "temporalCoverage": 0.36,
      "outfitOrderFidelity": 0.32,
      "probeSpecificity": 0.37,
      "fluencyPrior": 0.49,
      "genderCueReliance": 0.29,
      "noiseLevel": 0.25,
      "probeBias": "frame_boost",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 22,
      "identityScore": 25.04,
      "temporalScore": 36.88,
      "outfitScore": 25.74,
      "specificityScore": 38.61,
      "fluencyScore": 22.25,
      "confidence": 27.35,
      "trackContribution": 24.26,
      "fluencyContribution": 13.5,
      "overall": 29.27
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 7.76,
      "identityScore": 11.15,
      "temporalScore": 8.76,
      "outfitScore": 7.46,
      "specificityScore": 33.62,
      "fluencyScore": 35.39,
      "confidence": 34.9,
      "trackContribution": 9.46,
      "fluencyContribution": 34.3,
      "overall": 32.26
    }
  },
  {
    "id": "vts-009",
    "input": {
      "nameSensitivity": 0.36,
      "identityBind": 0.42,
      "temporalCoverage": 0.34,
      "outfitOrderFidelity": 0.37,
      "probeSpecificity": 0.35,
      "fluencyPrior": 0.52,
      "genderCueReliance": 0.26,
      "noiseLevel": 0.25,
      "probeBias": "balanced",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 29.82,
      "identityScore": 33.61,
      "temporalScore": 38.49,
      "outfitScore": 33.49,
      "specificityScore": 37.84,
      "fluencyScore": 23.45,
      "confidence": 31.8,
      "trackContribution": 32.31,
      "fluencyContribution": 13.9,
      "overall": 34.44
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 8.48,
      "identityScore": 12,
      "temporalScore": 8.96,
      "outfitScore": 8.16,
      "specificityScore": 33.21,
      "fluencyScore": 37.13,
      "confidence": 36.18,
      "trackContribution": 10.24,
      "fluencyContribution": 36.4,
      "overall": 33.27
    }
  },
  {
    "id": "vts-010",
    "input": {
      "nameSensitivity": 0.41,
      "identityBind": 0.38,
      "temporalCoverage": 0.39,
      "outfitOrderFidelity": 0.41,
      "probeSpecificity": 0.4,
      "fluencyPrior": 0.48,
      "genderCueReliance": 0.26,
      "noiseLevel": 0.25,
      "probeBias": "name_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 28.38,
      "identityScore": 26.42,
      "temporalScore": 42.05,
      "outfitScore": 31.28,
      "specificityScore": 40.96,
      "fluencyScore": 22.6,
      "confidence": 32.18,
      "trackContribution": 28.69,
      "fluencyContribution": 13.6,
      "overall": 33.61
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 8.76,
      "identityScore": 11,
      "temporalScore": 8.88,
      "outfitScore": 8.08,
      "specificityScore": 35.1,
      "fluencyScore": 35.68,
      "confidence": 35.35,
      "trackContribution": 9.88,
      "fluencyContribution": 33.6,
      "overall": 32.89
    }
  },
  {
    "id": "vts-011",
    "input": {
      "nameSensitivity": 0.45,
      "identityBind": 0.42,
      "temporalCoverage": 0.43,
      "outfitOrderFidelity": 0.45,
      "probeSpecificity": 0.44,
      "fluencyPrior": 0.51,
      "genderCueReliance": 0.26,
      "noiseLevel": 0.25,
      "probeBias": "gender_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 31.67,
      "identityScore": 29.66,
      "temporalScore": 46.36,
      "outfitScore": 34.49,
      "specificityScore": 44.9,
      "fluencyScore": 24.4,
      "confidence": 35.93,
      "trackContribution": 31.94,
      "fluencyContribution": 14.6,
      "overall": 37.26
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 9.48,
      "identityScore": 11.85,
      "temporalScore": 9.56,
      "outfitScore": 8.7,
      "specificityScore": 38.16,
      "fluencyScore": 38.56,
      "confidence": 38.31,
      "trackContribution": 10.67,
      "fluencyContribution": 35.7,
      "overall": 35.62
    }
  },
  {
    "id": "vts-012",
    "input": {
      "nameSensitivity": 0.42,
      "identityBind": 0.46,
      "temporalCoverage": 0.42,
      "outfitOrderFidelity": 0.42,
      "probeSpecificity": 0.43,
      "fluencyPrior": 0.54,
      "genderCueReliance": 0.23,
      "noiseLevel": 0.21,
      "probeBias": "open_ended",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 31.23,
      "identityScore": 32.86,
      "temporalScore": 47.05,
      "outfitScore": 33.45,
      "specificityScore": 45.39,
      "fluencyScore": 25.75,
      "confidence": 36.82,
      "trackContribution": 32.51,
      "fluencyContribution": 15.1,
      "overall": 38.04
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 9.36,
      "identityScore": 12.7,
      "temporalScore": 9.84,
      "outfitScore": 8.76,
      "specificityScore": 38.33,
      "fluencyScore": 40.95,
      "confidence": 40.44,
      "trackContribution": 11.03,
      "fluencyContribution": 37.8,
      "overall": 37.2
    }
  },
  {
    "id": "vts-013",
    "input": {
      "nameSensitivity": 0.46,
      "identityBind": 0.5,
      "temporalCoverage": 0.46,
      "outfitOrderFidelity": 0.46,
      "probeSpecificity": 0.47,
      "fluencyPrior": 0.57,
      "genderCueReliance": 0.23,
      "noiseLevel": 0.22,
      "probeBias": "frame_boost",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 34.32,
      "identityScore": 35.9,
      "temporalScore": 51.17,
      "outfitScore": 36.46,
      "specificityScore": 49.21,
      "fluencyScore": 27.55,
      "confidence": 40.39,
      "trackContribution": 35.56,
      "fluencyContribution": 16.1,
      "overall": 41.5
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 10.08,
      "identityScore": 13.55,
      "temporalScore": 10.52,
      "outfitScore": 9.38,
      "specificityScore": 41.39,
      "fluencyScore": 43.72,
      "confidence": 43.25,
      "trackContribution": 11.82,
      "fluencyContribution": 39.9,
      "overall": 39.85
    }
  },
  {
    "id": "vts-014",
    "input": {
      "nameSensitivity": 0.5,
      "identityBind": 0.53,
      "temporalCoverage": 0.5,
      "outfitOrderFidelity": 0.5,
      "probeSpecificity": 0.51,
      "fluencyPrior": 0.6,
      "genderCueReliance": 0.23,
      "noiseLevel": 0.22,
      "probeBias": "balanced",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 45.3,
      "identityScore": 46.78,
      "temporalScore": 55.27,
      "outfitScore": 47.36,
      "specificityScore": 52.94,
      "fluencyScore": 29.35,
      "confidence": 47.49,
      "trackContribution": 46.48,
      "fluencyContribution": 17.1,
      "overall": 49.56
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 10.8,
      "identityScore": 14.3,
      "temporalScore": 11.2,
      "outfitScore": 10,
      "specificityScore": 44.45,
      "fluencyScore": 46.6,
      "confidence": 46.21,
      "trackContribution": 12.55,
      "fluencyContribution": 42,
      "overall": 42.58
    }
  },
  {
    "id": "vts-015",
    "input": {
      "nameSensitivity": 0.55,
      "identityBind": 0.5,
      "temporalCoverage": 0.49,
      "outfitOrderFidelity": 0.55,
      "probeSpecificity": 0.5,
      "fluencyPrior": 0.56,
      "genderCueReliance": 0.2,
      "noiseLevel": 0.22,
      "probeBias": "name_swap",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 40.69,
      "identityScore": 37.28,
      "temporalScore": 56.35,
      "outfitScore": 41.99,
      "specificityScore": 51.56,
      "fluencyScore": 27.9,
      "confidence": 45.23,
      "trackContribution": 39.99,
      "fluencyContribution": 16.2,
      "overall": 45.84
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 11.08,
      "identityScore": 13.4,
      "temporalScore": 10.64,
      "outfitScore": 10,
      "specificityScore": 42.88,
      "fluencyScore": 44.02,
      "confidence": 43.72,
      "trackContribution": 12.24,
      "fluencyContribution": 39.2,
      "overall": 40.5
    }
  },
  {
    "id": "vts-016",
    "input": {
      "nameSensitivity": 0.51,
      "identityBind": 0.54,
      "temporalCoverage": 0.53,
      "outfitOrderFidelity": 0.51,
      "probeSpecificity": 0.54,
      "fluencyPrior": 0.59,
      "genderCueReliance": 0.21,
      "noiseLevel": 0.18,
      "probeBias": "gender_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 40.23,
      "identityScore": 41.16,
      "temporalScore": 58.63,
      "outfitScore": 41.83,
      "specificityScore": 55.98,
      "fluencyScore": 29.6,
      "confidence": 47.12,
      "trackContribution": 41.07,
      "fluencyContribution": 17.2,
      "overall": 47.77
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 10.84,
      "identityScore": 14.25,
      "temporalScore": 11.32,
      "outfitScore": 9.98,
      "specificityScore": 45.94,
      "fluencyScore": 47.23,
      "confidence": 47.17,
      "trackContribution": 12.55,
      "fluencyContribution": 41.3,
      "overall": 43.43
    }
  },
  {
    "id": "vts-017",
    "input": {
      "nameSensitivity": 0.56,
      "identityBind": 0.58,
      "temporalCoverage": 0.58,
      "outfitOrderFidelity": 0.56,
      "probeSpecificity": 0.59,
      "fluencyPrior": 0.63,
      "genderCueReliance": 0.21,
      "noiseLevel": 0.18,
      "probeBias": "open_ended",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 44.34,
      "identityScore": 44.69,
      "temporalScore": 63.8,
      "outfitScore": 45.84,
      "specificityScore": 60.7,
      "fluencyScore": 31.95,
      "confidence": 51.64,
      "trackContribution": 44.96,
      "fluencyContribution": 18.5,
      "overall": 52.12
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 11.76,
      "identityScore": 15.25,
      "temporalScore": 12.2,
      "outfitScore": 10.78,
      "specificityScore": 49.82,
      "fluencyScore": 50.99,
      "confidence": 51,
      "trackContribution": 13.51,
      "fluencyContribution": 44.1,
      "overall": 46.95
    }
  },
  {
    "id": "vts-018",
    "input": {
      "nameSensitivity": 0.6,
      "identityBind": 0.61,
      "temporalCoverage": 0.56,
      "outfitOrderFidelity": 0.6,
      "probeSpecificity": 0.57,
      "fluencyPrior": 0.66,
      "genderCueReliance": 0.18,
      "noiseLevel": 0.18,
      "probeBias": "frame_boost",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 46.61,
      "identityScore": 46.26,
      "temporalScore": 65.22,
      "outfitScore": 47.37,
      "specificityScore": 59.73,
      "fluencyScore": 33.15,
      "confidence": 53.17,
      "trackContribution": 46.75,
      "fluencyContribution": 18.9,
      "overall": 53.54
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 12.48,
      "identityScore": 16,
      "temporalScore": 12.4,
      "outfitScore": 11.4,
      "specificityScore": 49.42,
      "fluencyScore": 52.73,
      "confidence": 52.29,
      "trackContribution": 14.24,
      "fluencyContribution": 46.2,
      "overall": 47.97
    }
  },
  {
    "id": "vts-019",
    "input": {
      "nameSensitivity": 0.64,
      "identityBind": 0.65,
      "temporalCoverage": 0.6,
      "outfitOrderFidelity": 0.64,
      "probeSpecificity": 0.61,
      "fluencyPrior": 0.69,
      "genderCueReliance": 0.18,
      "noiseLevel": 0.19,
      "probeBias": "balanced",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 59.55,
      "identityScore": 59.32,
      "temporalScore": 69.34,
      "outfitScore": 60.23,
      "specificityScore": 63.54,
      "fluencyScore": 34.95,
      "confidence": 61.19,
      "trackContribution": 59.7,
      "fluencyContribution": 19.9,
      "overall": 62.82
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 13.2,
      "identityScore": 16.85,
      "temporalScore": 13.08,
      "outfitScore": 12.02,
      "specificityScore": 52.48,
      "fluencyScore": 55.5,
      "confidence": 55.1,
      "trackContribution": 15.03,
      "fluencyContribution": 48.3,
      "overall": 50.62
    }
  },
  {
    "id": "vts-020",
    "input": {
      "nameSensitivity": 0.61,
      "identityBind": 0.62,
      "temporalCoverage": 0.65,
      "outfitOrderFidelity": 0.61,
      "probeSpecificity": 0.66,
      "fluencyPrior": 0.65,
      "genderCueReliance": 0.18,
      "noiseLevel": 0.15,
      "probeBias": "name_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 50.28,
      "identityScore": 49.92,
      "temporalScore": 71.31,
      "outfitScore": 51.02,
      "specificityScore": 67.34,
      "fluencyScore": 34.1,
      "confidence": 58.47,
      "trackContribution": 50.41,
      "fluencyContribution": 19.6,
      "overall": 58.38
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 12.52,
      "identityScore": 15.95,
      "temporalScore": 13,
      "outfitScore": 11.38,
      "specificityScore": 54.37,
      "fluencyScore": 54.47,
      "confidence": 54.82,
      "trackContribution": 14.24,
      "fluencyContribution": 45.5,
      "overall": 50.49
    }
  },
  {
    "id": "vts-021",
    "input": {
      "nameSensitivity": 0.65,
      "identityBind": 0.65,
      "temporalCoverage": 0.63,
      "outfitOrderFidelity": 0.65,
      "probeSpecificity": 0.64,
      "fluencyPrior": 0.68,
      "genderCueReliance": 0.15,
      "noiseLevel": 0.15,
      "probeBias": "gender_swap",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 52.55,
      "identityScore": 51.5,
      "temporalScore": 72.72,
      "outfitScore": 52.55,
      "specificityScore": 66.38,
      "fluencyScore": 35.3,
      "confidence": 60,
      "trackContribution": 52.2,
      "fluencyContribution": 20,
      "overall": 59.8
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 13.24,
      "identityScore": 16.7,
      "temporalScore": 13.2,
      "outfitScore": 12,
      "specificityScore": 53.96,
      "fluencyScore": 56.22,
      "confidence": 56.11,
      "trackContribution": 14.97,
      "fluencyContribution": 47.6,
      "overall": 51.51
    }
  },
  {
    "id": "vts-022",
    "input": {
      "nameSensitivity": 0.7,
      "identityBind": 0.69,
      "temporalCoverage": 0.68,
      "outfitOrderFidelity": 0.69,
      "probeSpecificity": 0.69,
      "fluencyPrior": 0.71,
      "genderCueReliance": 0.15,
      "noiseLevel": 0.15,
      "probeBias": "open_ended",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 56.66,
      "identityScore": 55.02,
      "temporalScore": 77.89,
      "outfitScore": 56.03,
      "specificityScore": 71.1,
      "fluencyScore": 37.25,
      "confidence": 64.4,
      "trackContribution": 55.9,
      "fluencyContribution": 21.1,
      "overall": 64.08
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 14.08,
      "identityScore": 17.55,
      "temporalScore": 13.96,
      "outfitScore": 12.62,
      "specificityScore": 57.6,
      "fluencyScore": 59.33,
      "confidence": 59.36,
      "trackContribution": 15.82,
      "fluencyContribution": 49.7,
      "overall": 54.55
    }
  },
  {
    "id": "vts-023",
    "input": {
      "nameSensitivity": 0.74,
      "identityBind": 0.73,
      "temporalCoverage": 0.72,
      "outfitOrderFidelity": 0.74,
      "probeSpecificity": 0.73,
      "fluencyPrior": 0.74,
      "genderCueReliance": 0.15,
      "noiseLevel": 0.15,
      "probeBias": "frame_boost",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 59.94,
      "identityScore": 58.27,
      "temporalScore": 82.2,
      "outfitScore": 59.76,
      "specificityScore": 75.03,
      "fluencyScore": 39.05,
      "confidence": 68.26,
      "trackContribution": 59.32,
      "fluencyContribution": 22.1,
      "overall": 67.79
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 14.8,
      "identityScore": 18.4,
      "temporalScore": 14.64,
      "outfitScore": 13.32,
      "specificityScore": 60.66,
      "fluencyScore": 62.2,
      "confidence": 62.31,
      "trackContribution": 16.6,
      "fluencyContribution": 51.8,
      "overall": 57.28
    }
  },
  {
    "id": "vts-024",
    "input": {
      "nameSensitivity": 0.71,
      "identityBind": 0.77,
      "temporalCoverage": 0.71,
      "outfitOrderFidelity": 0.7,
      "probeSpecificity": 0.72,
      "fluencyPrior": 0.78,
      "genderCueReliance": 0.12,
      "noiseLevel": 0.11,
      "probeBias": "balanced",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 70.44,
      "identityScore": 73.32,
      "temporalScore": 82.89,
      "outfitScore": 68.98,
      "specificityScore": 75.53,
      "fluencyScore": 40.8,
      "confidence": 74.03,
      "trackContribution": 70.91,
      "fluencyContribution": 22.8,
      "overall": 75.11
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 14.76,
      "identityScore": 19.4,
      "temporalScore": 15.04,
      "outfitScore": 13.4,
      "specificityScore": 61.08,
      "fluencyScore": 65.25,
      "confidence": 65.03,
      "trackContribution": 17.08,
      "fluencyContribution": 54.6,
      "overall": 59.35
    }
  },
  {
    "id": "vts-025",
    "input": {
      "nameSensitivity": 0.75,
      "identityBind": 0.73,
      "temporalCoverage": 0.75,
      "outfitOrderFidelity": 0.74,
      "probeSpecificity": 0.76,
      "fluencyPrior": 0.73,
      "genderCueReliance": 0.12,
      "noiseLevel": 0.12,
      "probeBias": "name_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 62.59,
      "identityScore": 60.26,
      "temporalScore": 85.4,
      "outfitScore": 61.21,
      "specificityScore": 77.74,
      "fluencyScore": 39.4,
      "confidence": 71.23,
      "trackContribution": 61.35,
      "fluencyContribution": 22.2,
      "overall": 70.33
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 14.84,
      "identityScore": 18.25,
      "temporalScore": 14.76,
      "outfitScore": 13.22,
      "specificityScore": 62.14,
      "fluencyScore": 62.81,
      "confidence": 63.18,
      "trackContribution": 16.55,
      "fluencyContribution": 51.1,
      "overall": 58.09
    }
  },
  {
    "id": "vts-026",
    "input": {
      "nameSensitivity": 0.79,
      "identityBind": 0.77,
      "temporalCoverage": 0.79,
      "outfitOrderFidelity": 0.79,
      "probeSpecificity": 0.8,
      "fluencyPrior": 0.77,
      "genderCueReliance": 0.12,
      "noiseLevel": 0.12,
      "probeBias": "gender_swap",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 65.88,
      "identityScore": 63.5,
      "temporalScore": 89.7,
      "outfitScore": 64.94,
      "specificityScore": 81.68,
      "fluencyScore": 41.6,
      "confidence": 75.09,
      "trackContribution": 64.77,
      "fluencyContribution": 23.4,
      "overall": 74.05
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 15.64,
      "identityScore": 19.25,
      "temporalScore": 15.56,
      "outfitScore": 14.02,
      "specificityScore": 65.45,
      "fluencyScore": 66.34,
      "confidence": 66.71,
      "trackContribution": 17.45,
      "fluencyContribution": 53.9,
      "overall": 61.3
    }
  },
  {
    "id": "vts-027",
    "input": {
      "nameSensitivity": 0.84,
      "identityBind": 0.81,
      "temporalCoverage": 0.78,
      "outfitOrderFidelity": 0.83,
      "probeSpecificity": 0.79,
      "fluencyPrior": 0.8,
      "genderCueReliance": 0.09,
      "noiseLevel": 0.12,
      "probeBias": "open_ended",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 68.97,
      "identityScore": 65.89,
      "temporalScore": 92.19,
      "outfitScore": 66.75,
      "specificityScore": 81.7,
      "fluencyScore": 42.95,
      "confidence": 77.45,
      "trackContribution": 67.2,
      "fluencyContribution": 23.9,
      "overall": 76.31
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 16.48,
      "identityScore": 20.1,
      "temporalScore": 15.84,
      "outfitScore": 14.64,
      "specificityScore": 65.62,
      "fluencyScore": 68.31,
      "confidence": 68.3,
      "trackContribution": 18.29,
      "fluencyContribution": 56,
      "overall": 62.63
    }
  },
  {
    "id": "vts-028",
    "input": {
      "nameSensitivity": 0.8,
      "identityBind": 0.85,
      "temporalCoverage": 0.82,
      "outfitOrderFidelity": 0.79,
      "probeSpecificity": 0.83,
      "fluencyPrior": 0.83,
      "genderCueReliance": 0.09,
      "noiseLevel": 0.08,
      "probeBias": "frame_boost",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 68.73,
      "identityScore": 69.95,
      "temporalScore": 94.69,
      "outfitScore": 66.59,
      "specificityScore": 86.11,
      "fluencyScore": 44.75,
      "confidence": 79.62,
      "trackContribution": 68.42,
      "fluencyContribution": 24.9,
      "overall": 78.4
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 16.24,
      "identityScore": 20.95,
      "temporalScore": 16.52,
      "outfitScore": 14.62,
      "specificityScore": 68.68,
      "fluencyScore": 71.61,
      "confidence": 71.8,
      "trackContribution": 18.6,
      "fluencyContribution": 58.1,
      "overall": 65.61
    }
  },
  {
    "id": "vts-029",
    "input": {
      "nameSensitivity": 0.85,
      "identityBind": 0.89,
      "temporalCoverage": 0.87,
      "outfitOrderFidelity": 0.84,
      "probeSpecificity": 0.88,
      "fluencyPrior": 0.86,
      "genderCueReliance": 0.09,
      "noiseLevel": 0.08,
      "probeBias": "balanced",
      "profile": "track_aware"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 85.93,
      "identityScore": 87.18,
      "temporalScore": 99.87,
      "outfitScore": 83.53,
      "specificityScore": 90.83,
      "fluencyScore": 46.7,
      "confidence": 90.07,
      "trackContribution": 85.55,
      "fluencyContribution": 26,
      "overall": 90.56
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 17.08,
      "identityScore": 21.8,
      "temporalScore": 17.28,
      "outfitScore": 15.32,
      "specificityScore": 72.32,
      "fluencyScore": 74.72,
      "confidence": 75.05,
      "trackContribution": 19.44,
      "fluencyContribution": 60.2,
      "overall": 68.66
    }
  },
  {
    "id": "vts-030",
    "input": {
      "nameSensitivity": 0.89,
      "identityBind": 0.85,
      "temporalCoverage": 0.85,
      "outfitOrderFidelity": 0.88,
      "probeSpecificity": 0.86,
      "fluencyPrior": 0.82,
      "genderCueReliance": 0.06,
      "noiseLevel": 0.09,
      "probeBias": "name_swap",
      "profile": "fluency"
    },
    "expectedTrackAware": {
      "mode": "track_aware",
      "sensitivityScore": 74.9,
      "identityScore": 71.13,
      "temporalScore": 99.69,
      "outfitScore": 71.92,
      "specificityScore": 88.34,
      "fluencyScore": 45.1,
      "confidence": 84.28,
      "trackContribution": 72.65,
      "fluencyContribution": 25,
      "overall": 82.56
    },
    "expectedFluency": {
      "mode": "fluency_only",
      "sensitivityScore": 17.24,
      "identityScore": 20.8,
      "temporalScore": 16.64,
      "outfitScore": 15.24,
      "specificityScore": 70.16,
      "fluencyScore": 71.8,
      "confidence": 72.12,
      "trackContribution": 19.02,
      "fluencyContribution": 57.4,
      "overall": 66.18
    }
  }
];
