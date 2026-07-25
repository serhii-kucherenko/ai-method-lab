import type { DriveInput, DriveQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DriveInput;
  expectedWorldCognitive: DriveQuality;
  expectedSingleLevel: DriveQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "wcd-001",
    "input": {
      "worldForecastFit": 0.29,
      "cognitiveDepth": 0.25,
      "actionAlignment": 0.28,
      "trajectoryIntegrity": 0.34,
      "singleLevelPassRate": 0.39,
      "reactiveOptimism": 0.45,
      "routeHardness": 0.59,
      "leakageRisk": 0.5,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 22.56,
      "cognitiveScore": 30.25,
      "actionScore": 23.49,
      "trajectoryScore": 37.64,
      "singleLevelScore": 16.4,
      "confidence": 19.35,
      "worldCognitiveContribution": 27.98,
      "singleLevelContribution": 15.96,
      "overall": 29.82
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 5.76,
      "cognitiveScore": 17.09,
      "actionScore": 13.13,
      "trajectoryScore": 32.39,
      "singleLevelScore": 40.93,
      "confidence": 17.1,
      "worldCognitiveContribution": 21.86,
      "singleLevelContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "wcd-002",
    "input": {
      "worldForecastFit": 0.33,
      "cognitiveDepth": 0.29,
      "actionAlignment": 0.32,
      "trajectoryIntegrity": 0.38,
      "singleLevelPassRate": 0.43,
      "reactiveOptimism": 0.46,
      "routeHardness": 0.6,
      "leakageRisk": 0.51,
      "driveBias": "action_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 22.22,
      "cognitiveScore": 33.9,
      "actionScore": 34.39,
      "trajectoryScore": 31.9,
      "singleLevelScore": 18.89,
      "confidence": 23,
      "worldCognitiveContribution": 30.56,
      "singleLevelContribution": 18.61,
      "overall": 32.41
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 2.43,
      "cognitiveScore": 18.22,
      "actionScore": 14.16,
      "trajectoryScore": 34.08,
      "singleLevelScore": 31.53,
      "confidence": 18.65,
      "worldCognitiveContribution": 20.08,
      "singleLevelContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "wcd-003",
    "input": {
      "worldForecastFit": 0.37,
      "cognitiveDepth": 0.27,
      "actionAlignment": 0.36,
      "trajectoryIntegrity": 0.42,
      "singleLevelPassRate": 0.46,
      "reactiveOptimism": 0.42,
      "routeHardness": 0.6,
      "leakageRisk": 0.46,
      "driveBias": "reactive_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 12.18,
      "cognitiveScore": 23.71,
      "actionScore": 20.95,
      "trajectoryScore": 19.24,
      "singleLevelScore": 19.94,
      "confidence": 25.6,
      "worldCognitiveContribution": 18.96,
      "singleLevelContribution": 19.69,
      "overall": 20.09
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 12.17,
      "cognitiveScore": 17.1,
      "actionScore": 13.13,
      "trajectoryScore": 33.93,
      "singleLevelScore": 54.34,
      "confidence": 18.4,
      "worldCognitiveContribution": 26.13,
      "singleLevelContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "wcd-004",
    "input": {
      "worldForecastFit": 0.33,
      "cognitiveDepth": 0.32,
      "actionAlignment": 0.39,
      "trajectoryIntegrity": 0.38,
      "singleLevelPassRate": 0.42,
      "reactiveOptimism": 0.43,
      "routeHardness": 0.53,
      "leakageRisk": 0.46,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 28.09,
      "cognitiveScore": 36.03,
      "actionScore": 33.07,
      "trajectoryScore": 42.23,
      "singleLevelScore": 18.93,
      "confidence": 26.1,
      "worldCognitiveContribution": 34.5,
      "singleLevelContribution": 19.05,
      "overall": 35.72
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 8.7,
      "cognitiveScore": 17.81,
      "actionScore": 13.75,
      "trajectoryScore": 32.79,
      "singleLevelScore": 42.77,
      "confidence": 18.85,
      "worldCognitiveContribution": 23.16,
      "singleLevelContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "wcd-005",
    "input": {
      "worldForecastFit": 0.37,
      "cognitiveDepth": 0.36,
      "actionAlignment": 0.35,
      "trajectoryIntegrity": 0.42,
      "singleLevelPassRate": 0.46,
      "reactiveOptimism": 0.45,
      "routeHardness": 0.53,
      "leakageRisk": 0.47,
      "driveBias": "world_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 26.86,
      "cognitiveScore": 39.64,
      "actionScore": 21.39,
      "trajectoryScore": 54.3,
      "singleLevelScore": 21.8,
      "confidence": 27.6,
      "worldCognitiveContribution": 34.43,
      "singleLevelContribution": 22.19,
      "overall": 36.23
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 0,
      "cognitiveScore": 19.51,
      "actionScore": 15.76,
      "trajectoryScore": 34.77,
      "singleLevelScore": 32.95,
      "confidence": 21.05,
      "worldCognitiveContribution": 20.6,
      "singleLevelContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "wcd-006",
    "input": {
      "worldForecastFit": 0.41,
      "cognitiveDepth": 0.34,
      "actionAlignment": 0.39,
      "trajectoryIntegrity": 0.45,
      "singleLevelPassRate": 0.5,
      "reactiveOptimism": 0.4,
      "routeHardness": 0.54,
      "leakageRisk": 0.42,
      "driveBias": "balanced",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 33.94,
      "cognitiveScore": 39.5,
      "actionScore": 35.84,
      "trajectoryScore": 47.85,
      "singleLevelScore": 23.08,
      "confidence": 30.35,
      "worldCognitiveContribution": 38.87,
      "singleLevelContribution": 23.38,
      "overall": 40.08
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 11.98,
      "cognitiveScore": 18.04,
      "actionScore": 14.31,
      "trajectoryScore": 34.78,
      "singleLevelScore": 46.72,
      "confidence": 20.5,
      "worldCognitiveContribution": 25.17,
      "singleLevelContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "wcd-007",
    "input": {
      "worldForecastFit": 0.45,
      "cognitiveDepth": 0.38,
      "actionAlignment": 0.42,
      "trajectoryIntegrity": 0.49,
      "singleLevelPassRate": 0.53,
      "reactiveOptimism": 0.42,
      "routeHardness": 0.55,
      "leakageRisk": 0.43,
      "driveBias": "action_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 31.59,
      "cognitiveScore": 43.11,
      "actionScore": 48.37,
      "trajectoryScore": 39.34,
      "singleLevelScore": 25.15,
      "confidence": 33.6,
      "worldCognitiveContribution": 40.76,
      "singleLevelContribution": 25.64,
      "overall": 42.04
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 8.27,
      "cognitiveScore": 19.34,
      "actionScore": 15.59,
      "trajectoryScore": 36.3,
      "singleLevelScore": 34.2,
      "confidence": 22.15,
      "worldCognitiveContribution": 22.74,
      "singleLevelContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "wcd-008",
    "input": {
      "worldForecastFit": 0.41,
      "cognitiveDepth": 0.43,
      "actionAlignment": 0.46,
      "trajectoryIntegrity": 0.45,
      "singleLevelPassRate": 0.49,
      "reactiveOptimism": 0.43,
      "routeHardness": 0.47,
      "leakageRisk": 0.44,
      "driveBias": "reactive_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 19.33,
      "cognitiveScore": 35.43,
      "actionScore": 27.62,
      "trajectoryScore": 24.76,
      "singleLevelScore": 24.32,
      "confidence": 34.35,
      "worldCognitiveContribution": 26.71,
      "singleLevelContribution": 25.23,
      "overall": 27.44
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 16.4,
      "cognitiveScore": 20.18,
      "actionScore": 16.31,
      "trajectoryScore": 35.17,
      "singleLevelScore": 58.5,
      "confidence": 22.7,
      "worldCognitiveContribution": 29.31,
      "singleLevelContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "wcd-009",
    "input": {
      "worldForecastFit": 0.46,
      "cognitiveDepth": 0.41,
      "actionAlignment": 0.5,
      "trajectoryIntegrity": 0.49,
      "singleLevelPassRate": 0.53,
      "reactiveOptimism": 0.39,
      "routeHardness": 0.48,
      "leakageRisk": 0.38,
      "driveBias": "balanced",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 40.05,
      "cognitiveScore": 45.49,
      "actionScore": 45.68,
      "trajectoryScore": 52.59,
      "singleLevelScore": 25.81,
      "confidence": 37.35,
      "worldCognitiveContribution": 45.69,
      "singleLevelContribution": 26.69,
      "overall": 46.27
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 14.91,
      "cognitiveScore": 19.07,
      "actionScore": 15.29,
      "trajectoryScore": 35.36,
      "singleLevelScore": 48.88,
      "confidence": 22.7,
      "worldCognitiveContribution": 26.7,
      "singleLevelContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "wcd-010",
    "input": {
      "worldForecastFit": 0.5,
      "cognitiveDepth": 0.45,
      "actionAlignment": 0.46,
      "trajectoryIntegrity": 0.53,
      "singleLevelPassRate": 0.57,
      "reactiveOptimism": 0.4,
      "routeHardness": 0.49,
      "leakageRisk": 0.39,
      "driveBias": "world_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 36.62,
      "cognitiveScore": 49.14,
      "actionScore": 30.65,
      "trajectoryScore": 66.82,
      "singleLevelScore": 28.29,
      "confidence": 39,
      "worldCognitiveContribution": 44.6,
      "singleLevelContribution": 29.32,
      "overall": 45.85
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 3.59,
      "cognitiveScore": 20.18,
      "actionScore": 16.7,
      "trajectoryScore": 37.06,
      "singleLevelScore": 35.54,
      "confidence": 24.25,
      "worldCognitiveContribution": 22.61,
      "singleLevelContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "wcd-011",
    "input": {
      "worldForecastFit": 0.54,
      "cognitiveDepth": 0.49,
      "actionAlignment": 0.49,
      "trajectoryIntegrity": 0.57,
      "singleLevelPassRate": 0.6,
      "reactiveOptimism": 0.42,
      "routeHardness": 0.49,
      "leakageRisk": 0.4,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 47.21,
      "cognitiveScore": 52.75,
      "actionScore": 47.19,
      "trajectoryScore": 60.27,
      "singleLevelScore": 30.54,
      "confidence": 42.25,
      "worldCognitiveContribution": 51.41,
      "singleLevelContribution": 31.82,
      "overall": 51.88
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 17.1,
      "cognitiveScore": 21.62,
      "actionScore": 18.14,
      "trajectoryScore": 38.58,
      "singleLevelScore": 54.12,
      "confidence": 26.1,
      "worldCognitiveContribution": 29.91,
      "singleLevelContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "wcd-012",
    "input": {
      "worldForecastFit": 0.5,
      "cognitiveDepth": 0.48,
      "actionAlignment": 0.53,
      "trajectoryIntegrity": 0.53,
      "singleLevelPassRate": 0.56,
      "reactiveOptimism": 0.37,
      "routeHardness": 0.42,
      "leakageRisk": 0.35,
      "driveBias": "action_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 38.19,
      "cognitiveScore": 51.28,
      "actionScore": 61.94,
      "trajectoryScore": 43.82,
      "singleLevelScore": 28.34,
      "confidence": 42.1,
      "worldCognitiveContribution": 49.22,
      "singleLevelContribution": 29.7,
      "overall": 49.71
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 13.23,
      "cognitiveScore": 19.68,
      "actionScore": 16.17,
      "trajectoryScore": 35.76,
      "singleLevelScore": 34.93,
      "confidence": 24.35,
      "worldCognitiveContribution": 23.95,
      "singleLevelContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "wcd-013",
    "input": {
      "worldForecastFit": 0.54,
      "cognitiveDepth": 0.52,
      "actionAlignment": 0.56,
      "trajectoryIntegrity": 0.57,
      "singleLevelPassRate": 0.6,
      "reactiveOptimism": 0.39,
      "routeHardness": 0.42,
      "leakageRisk": 0.36,
      "driveBias": "reactive_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 29.13,
      "cognitiveScore": 44.88,
      "actionScore": 36.59,
      "trajectoryScore": 32.66,
      "singleLevelScore": 31.2,
      "confidence": 45.35,
      "worldCognitiveContribution": 35.78,
      "singleLevelContribution": 32.8,
      "overall": 36.24
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 22.62,
      "cognitiveScore": 21.35,
      "actionScore": 17.8,
      "trajectoryScore": 37.74,
      "singleLevelScore": 67.02,
      "confidence": 26.55,
      "worldCognitiveContribution": 33.31,
      "singleLevelContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "wcd-014",
    "input": {
      "worldForecastFit": 0.58,
      "cognitiveDepth": 0.56,
      "actionAlignment": 0.6,
      "trajectoryIntegrity": 0.61,
      "singleLevelPassRate": 0.63,
      "reactiveOptimism": 0.4,
      "routeHardness": 0.43,
      "leakageRisk": 0.36,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 52.62,
      "cognitiveScore": 58.53,
      "actionScore": 56.66,
      "trajectoryScore": 64.86,
      "singleLevelScore": 33.07,
      "confidence": 49,
      "worldCognitiveContribution": 57.86,
      "singleLevelContribution": 34.8,
      "overall": 57.71
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 20.03,
      "cognitiveScore": 22.2,
      "actionScore": 18.59,
      "trajectoryScore": 38.98,
      "singleLevelScore": 55.96,
      "confidence": 27.85,
      "worldCognitiveContribution": 31.15,
      "singleLevelContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "wcd-015",
    "input": {
      "worldForecastFit": 0.62,
      "cognitiveDepth": 0.54,
      "actionAlignment": 0.56,
      "trajectoryIntegrity": 0.65,
      "singleLevelPassRate": 0.67,
      "reactiveOptimism": 0.36,
      "routeHardness": 0.44,
      "leakageRisk": 0.31,
      "driveBias": "world_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 45.9,
      "cognitiveScore": 58.35,
      "actionScore": 39.3,
      "trajectoryScore": 79.94,
      "singleLevelScore": 34.55,
      "confidence": 49.6,
      "worldCognitiveContribution": 54.53,
      "singleLevelContribution": 36.22,
      "overall": 55.23
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 9.43,
      "cognitiveScore": 21.14,
      "actionScore": 17.93,
      "trajectoryScore": 39.27,
      "singleLevelScore": 38.2,
      "confidence": 27.75,
      "worldCognitiveContribution": 25.19,
      "singleLevelContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "wcd-016",
    "input": {
      "worldForecastFit": 0.58,
      "cognitiveDepth": 0.59,
      "actionAlignment": 0.6,
      "trajectoryIntegrity": 0.6,
      "singleLevelPassRate": 0.63,
      "reactiveOptimism": 0.37,
      "routeHardness": 0.36,
      "leakageRisk": 0.32,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 54.46,
      "cognitiveScore": 60.67,
      "actionScore": 57.87,
      "trajectoryScore": 65.05,
      "singleLevelScore": 33.73,
      "confidence": 50.35,
      "worldCognitiveContribution": 59.24,
      "singleLevelContribution": 35.76,
      "overall": 59.01
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 22.05,
      "cognitiveScore": 21.91,
      "actionScore": 18.56,
      "trajectoryScore": 38.14,
      "singleLevelScore": 55.7,
      "confidence": 28.3,
      "worldCognitiveContribution": 31.27,
      "singleLevelContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "wcd-017",
    "input": {
      "worldForecastFit": 0.62,
      "cognitiveDepth": 0.63,
      "actionAlignment": 0.63,
      "trajectoryIntegrity": 0.64,
      "singleLevelPassRate": 0.67,
      "reactiveOptimism": 0.39,
      "routeHardness": 0.37,
      "leakageRisk": 0.33,
      "driveBias": "action_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 48.43,
      "cognitiveScore": 64.28,
      "actionScore": 75.13,
      "trajectoryScore": 52.76,
      "singleLevelScore": 36.41,
      "confidence": 53.6,
      "worldCognitiveContribution": 60.66,
      "singleLevelContribution": 38.61,
      "overall": 60.69
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 18.73,
      "cognitiveScore": 23.42,
      "actionScore": 20,
      "trajectoryScore": 40.11,
      "singleLevelScore": 39.86,
      "confidence": 30.3,
      "worldCognitiveContribution": 28.42,
      "singleLevelContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "wcd-018",
    "input": {
      "worldForecastFit": 0.66,
      "cognitiveDepth": 0.61,
      "actionAlignment": 0.67,
      "trajectoryIntegrity": 0.68,
      "singleLevelPassRate": 0.7,
      "reactiveOptimism": 0.34,
      "routeHardness": 0.38,
      "leakageRisk": 0.27,
      "driveBias": "reactive_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 38.33,
      "cognitiveScore": 54.13,
      "actionScore": 45.52,
      "trajectoryScore": 40.09,
      "singleLevelScore": 37.08,
      "confidence": 56.35,
      "worldCognitiveContribution": 44.52,
      "singleLevelContribution": 39.16,
      "overall": 44.56
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 28.36,
      "cognitiveScore": 21.66,
      "actionScore": 18.31,
      "trajectoryScore": 39.67,
      "singleLevelScore": 74.27,
      "confidence": 29.5,
      "worldCognitiveContribution": 36.45,
      "singleLevelContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "wcd-019",
    "input": {
      "worldForecastFit": 0.7,
      "cognitiveDepth": 0.65,
      "actionAlignment": 0.7,
      "trajectoryIntegrity": 0.72,
      "singleLevelPassRate": 0.74,
      "reactiveOptimism": 0.36,
      "routeHardness": 0.38,
      "leakageRisk": 0.28,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 63.81,
      "cognitiveScore": 67.74,
      "actionScore": 68.17,
      "trajectoryScore": 75.07,
      "singleLevelScore": 39.94,
      "confidence": 59.6,
      "worldCognitiveContribution": 68.45,
      "singleLevelContribution": 42.25,
      "overall": 67.73
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 26.25,
      "cognitiveScore": 23.32,
      "actionScore": 19.92,
      "trajectoryScore": 41.65,
      "singleLevelScore": 62.07,
      "confidence": 31.7,
      "worldCognitiveContribution": 34.64,
      "singleLevelContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "wcd-020",
    "input": {
      "worldForecastFit": 0.66,
      "cognitiveDepth": 0.7,
      "actionAlignment": 0.66,
      "trajectoryIntegrity": 0.68,
      "singleLevelPassRate": 0.7,
      "reactiveOptimism": 0.37,
      "routeHardness": 0.31,
      "leakageRisk": 0.29,
      "driveBias": "world_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 52.86,
      "cognitiveScore": 70.06,
      "actionScore": 45.74,
      "trajectoryScore": 86.81,
      "singleLevelScore": 38.94,
      "confidence": 58.35,
      "worldCognitiveContribution": 62.46,
      "singleLevelContribution": 41.54,
      "overall": 62.69
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 13.66,
      "cognitiveScore": 23.93,
      "actionScore": 20.75,
      "trajectoryScore": 40.51,
      "singleLevelScore": 40.86,
      "confidence": 32.05,
      "worldCognitiveContribution": 27.94,
      "singleLevelContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "wcd-021",
    "input": {
      "worldForecastFit": 0.7,
      "cognitiveDepth": 0.68,
      "actionAlignment": 0.7,
      "trajectoryIntegrity": 0.72,
      "singleLevelPassRate": 0.73,
      "reactiveOptimism": 0.33,
      "routeHardness": 0.31,
      "leakageRisk": 0.24,
      "driveBias": "balanced",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 65.6,
      "cognitiveScore": 69.88,
      "actionScore": 69.32,
      "trajectoryScore": 75.82,
      "singleLevelScore": 39.99,
      "confidence": 60.95,
      "worldCognitiveContribution": 69.92,
      "singleLevelContribution": 42.54,
      "overall": 68.99
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 27.89,
      "cognitiveScore": 22.72,
      "actionScore": 19.62,
      "trajectoryScore": 40.35,
      "singleLevelScore": 61.19,
      "confidence": 31.8,
      "worldCognitiveContribution": 34.35,
      "singleLevelContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "wcd-022",
    "input": {
      "worldForecastFit": 0.74,
      "cognitiveDepth": 0.72,
      "actionAlignment": 0.73,
      "trajectoryIntegrity": 0.76,
      "singleLevelPassRate": 0.77,
      "reactiveOptimism": 0.34,
      "routeHardness": 0.32,
      "leakageRisk": 0.25,
      "driveBias": "action_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 57.62,
      "cognitiveScore": 73.52,
      "actionScore": 88.86,
      "trajectoryScore": 60.51,
      "singleLevelScore": 42.47,
      "confidence": 64.35,
      "worldCognitiveContribution": 70.82,
      "singleLevelContribution": 45.15,
      "overall": 70.2
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 24.57,
      "cognitiveScore": 23.79,
      "actionScore": 20.63,
      "trajectoryScore": 42.05,
      "singleLevelScore": 42.21,
      "confidence": 33.35,
      "worldCognitiveContribution": 30.65,
      "singleLevelContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "wcd-023",
    "input": {
      "worldForecastFit": 0.79,
      "cognitiveDepth": 0.76,
      "actionAlignment": 0.77,
      "trajectoryIntegrity": 0.8,
      "singleLevelPassRate": 0.81,
      "reactiveOptimism": 0.36,
      "routeHardness": 0.33,
      "leakageRisk": 0.25,
      "driveBias": "reactive_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 49.04,
      "cognitiveScore": 67.38,
      "actionScore": 53.74,
      "trajectoryScore": 49.49,
      "singleLevelScore": 45.16,
      "confidence": 68.25,
      "worldCognitiveContribution": 54.86,
      "singleLevelContribution": 48.03,
      "overall": 54.63
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 33.86,
      "cognitiveScore": 25.25,
      "actionScore": 22.05,
      "trajectoryScore": 43.92,
      "singleLevelScore": 84.72,
      "confidence": 35.45,
      "worldCognitiveContribution": 41.96,
      "singleLevelContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "wcd-024",
    "input": {
      "worldForecastFit": 0.75,
      "cognitiveDepth": 0.75,
      "actionAlignment": 0.81,
      "trajectoryIntegrity": 0.76,
      "singleLevelPassRate": 0.77,
      "reactiveOptimism": 0.31,
      "routeHardness": 0.25,
      "leakageRisk": 0.2,
      "driveBias": "balanced",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 71.55,
      "cognitiveScore": 75.91,
      "actionScore": 78.99,
      "trajectoryScore": 80.56,
      "singleLevelScore": 43.13,
      "confidence": 68.1,
      "worldCognitiveContribution": 76.66,
      "singleLevelContribution": 46.07,
      "overall": 75.15
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 31.21,
      "cognitiveScore": 23.36,
      "actionScore": 20.13,
      "trajectoryScore": 41.11,
      "singleLevelScore": 63.65,
      "confidence": 33.9,
      "worldCognitiveContribution": 35.89,
      "singleLevelContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "wcd-025",
    "input": {
      "worldForecastFit": 0.79,
      "cognitiveDepth": 0.79,
      "actionAlignment": 0.77,
      "trajectoryIntegrity": 0.8,
      "singleLevelPassRate": 0.8,
      "reactiveOptimism": 0.33,
      "routeHardness": 0.26,
      "leakageRisk": 0.21,
      "driveBias": "world_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 62.51,
      "cognitiveScore": 79.52,
      "actionScore": 54.86,
      "trajectoryScore": 100,
      "singleLevelScore": 45.2,
      "confidence": 69.6,
      "worldCognitiveContribution": 72.7,
      "singleLevelContribution": 48.27,
      "overall": 72.3
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 19.5,
      "cognitiveScore": 24.6,
      "actionScore": 21.69,
      "trajectoryScore": 42.63,
      "singleLevelScore": 43.52,
      "confidence": 35.55,
      "worldCognitiveContribution": 30.39,
      "singleLevelContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "wcd-026",
    "input": {
      "worldForecastFit": 0.83,
      "cognitiveDepth": 0.83,
      "actionAlignment": 0.8,
      "trajectoryIntegrity": 0.83,
      "singleLevelPassRate": 0.84,
      "reactiveOptimism": 0.34,
      "routeHardness": 0.27,
      "leakageRisk": 0.22,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 78.52,
      "cognitiveScore": 83.17,
      "actionScore": 80.3,
      "trajectoryScore": 87.68,
      "singleLevelScore": 47.68,
      "confidence": 73,
      "worldCognitiveContribution": 82.15,
      "singleLevelContribution": 50.87,
      "overall": 80.52
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 33.17,
      "cognitiveScore": 25.67,
      "actionScore": 22.7,
      "trajectoryScore": 44.32,
      "singleLevelScore": 68.8,
      "confidence": 37.1,
      "worldCognitiveContribution": 38.93,
      "singleLevelContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "wcd-027",
    "input": {
      "worldForecastFit": 0.87,
      "cognitiveDepth": 0.81,
      "actionAlignment": 0.84,
      "trajectoryIntegrity": 0.87,
      "singleLevelPassRate": 0.88,
      "reactiveOptimism": 0.3,
      "routeHardness": 0.27,
      "leakageRisk": 0.17,
      "driveBias": "action_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 67.26,
      "cognitiveScore": 82.98,
      "actionScore": 100,
      "trajectoryScore": 68.1,
      "singleLevelScore": 49.35,
      "confidence": 75.6,
      "worldCognitiveContribution": 80.38,
      "singleLevelContribution": 52.5,
      "overall": 79.36
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 30.78,
      "cognitiveScore": 24.7,
      "actionScore": 21.75,
      "trajectoryScore": 44.62,
      "singleLevelScore": 45.22,
      "confidence": 37.2,
      "worldCognitiveContribution": 33.41,
      "singleLevelContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "wcd-028",
    "input": {
      "worldForecastFit": 0.83,
      "cognitiveDepth": 0.86,
      "actionAlignment": 0.87,
      "trajectoryIntegrity": 0.83,
      "singleLevelPassRate": 0.84,
      "reactiveOptimism": 0.31,
      "routeHardness": 0.2,
      "leakageRisk": 0.17,
      "driveBias": "reactive_first",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 54.87,
      "cognitiveScore": 75.3,
      "actionScore": 60.62,
      "trajectoryScore": 53.51,
      "singleLevelScore": 48.34,
      "confidence": 76.1,
      "worldCognitiveContribution": 61.08,
      "singleLevelContribution": 51.73,
      "overall": 60.4
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 38.81,
      "cognitiveScore": 25.25,
      "actionScore": 22.17,
      "trajectoryScore": 43.48,
      "singleLevelScore": 86.95,
      "confidence": 37.65,
      "worldCognitiveContribution": 43.33,
      "singleLevelContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "wcd-029",
    "input": {
      "worldForecastFit": 0.87,
      "cognitiveDepth": 0.9,
      "actionAlignment": 0.91,
      "trajectoryIntegrity": 0.87,
      "singleLevelPassRate": 0.87,
      "reactiveOptimism": 0.33,
      "routeHardness": 0.2,
      "leakageRisk": 0.18,
      "driveBias": "balanced",
      "profile": "world_cognitive"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 83.89,
      "cognitiveScore": 88.91,
      "actionScore": 89.72,
      "trajectoryScore": 92.27,
      "singleLevelScore": 50.59,
      "confidence": 79.6,
      "worldCognitiveContribution": 88.57,
      "singleLevelContribution": 54.16,
      "overall": 86.38
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 36.33,
      "cognitiveScore": 26.6,
      "actionScore": 23.46,
      "trajectoryScore": 45,
      "singleLevelScore": 71.06,
      "confidence": 39.5,
      "worldCognitiveContribution": 40.49,
      "singleLevelContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "wcd-030",
    "input": {
      "worldForecastFit": 0.91,
      "cognitiveDepth": 0.88,
      "actionAlignment": 0.87,
      "trajectoryIntegrity": 0.91,
      "singleLevelPassRate": 0.91,
      "reactiveOptimism": 0.28,
      "routeHardness": 0.21,
      "leakageRisk": 0.13,
      "driveBias": "world_first",
      "profile": "single_level"
    },
    "expectedWorldCognitive": {
      "mode": "world_cognitive",
      "worldScore": 71.59,
      "cognitiveScore": 88.77,
      "actionScore": 63.26,
      "trajectoryScore": 100,
      "singleLevelScore": 51.88,
      "confidence": 80.35,
      "worldCognitiveContribution": 79.63,
      "singleLevelContribution": 55.31,
      "overall": 79.25
    },
    "expectedSingleLevel": {
      "mode": "single_level",
      "worldScore": 25.72,
      "cognitiveScore": 25.06,
      "actionScore": 22.34,
      "trajectoryScore": 45.02,
      "singleLevelScore": 46.21,
      "confidence": 38.95,
      "worldCognitiveContribution": 32.87,
      "singleLevelContribution": 50.68,
      "overall": 44.3
    }
  }
];
