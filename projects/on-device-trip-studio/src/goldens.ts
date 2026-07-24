import type { TripInput, TripQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TripInput;
  expectedPlaFeasibility: TripQuality;
  expectedDesireFirst: TripQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "odts-001",
    "input": {
      "scheduleFeasibility": 0.19,
      "resourceHeadroom": 0.17,
      "transferReliability": 0.15,
      "desireAlignment": 0.18,
      "constraintStrictness": 0.17,
      "desireWeight": 0.1,
      "stopCount": 5,
      "weatherRisk": 0.6,
      "offlineMapCoverage": 0.19,
      "mobilityAdaptability": 0.13,
      "tripHours": 9,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 13.06,
      "desireFit": 10.6,
      "resourceMargin": 31.55,
      "transferHealth": 14.21,
      "adaptGain": 21.84,
      "auditTrail": 16.54,
      "overall": 17.84
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 5.68,
      "desireFit": 13.27,
      "resourceMargin": 13.85,
      "transferHealth": 7.19,
      "adaptGain": 7.51,
      "auditTrail": 0,
      "overall": 9.2
    }
  },
  {
    "id": "odts-002",
    "input": {
      "scheduleFeasibility": 0.22,
      "resourceHeadroom": 0.21,
      "transferReliability": 0.19,
      "desireAlignment": 0.22,
      "constraintStrictness": 0.21,
      "desireWeight": 0.15,
      "stopCount": 6,
      "weatherRisk": 0.6,
      "offlineMapCoverage": 0.23,
      "mobilityAdaptability": 0.17,
      "tripHours": 10,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 16.15,
      "desireFit": 14.32,
      "resourceMargin": 33.72,
      "transferHealth": 17.49,
      "adaptGain": 24.34,
      "auditTrail": 19.34,
      "overall": 20.78
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 6.64,
      "desireFit": 17.27,
      "resourceMargin": 14.71,
      "transferHealth": 8.89,
      "adaptGain": 8.17,
      "auditTrail": 0,
      "overall": 11.1
    }
  },
  {
    "id": "odts-003",
    "input": {
      "scheduleFeasibility": 0.26,
      "resourceHeadroom": 0.26,
      "transferReliability": 0.18,
      "desireAlignment": 0.25,
      "constraintStrictness": 0.25,
      "desireWeight": 0.19,
      "stopCount": 7,
      "weatherRisk": 0.54,
      "offlineMapCoverage": 0.27,
      "mobilityAdaptability": 0.21,
      "tripHours": 11,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 21.12,
      "desireFit": 18.49,
      "resourceMargin": 38.19,
      "transferHealth": 19.01,
      "adaptGain": 30.18,
      "auditTrail": 24.4,
      "overall": 25.22
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 7.58,
      "desireFit": 18.68,
      "resourceMargin": 15.46,
      "transferHealth": 8.86,
      "adaptGain": 9.31,
      "auditTrail": 0.04,
      "overall": 11.98
    }
  },
  {
    "id": "odts-004",
    "input": {
      "scheduleFeasibility": 0.3,
      "resourceHeadroom": 0.22,
      "transferReliability": 0.22,
      "desireAlignment": 0.29,
      "constraintStrictness": 0.23,
      "desireWeight": 0.24,
      "stopCount": 8,
      "weatherRisk": 0.54,
      "offlineMapCoverage": 0.25,
      "mobilityAdaptability": 0.25,
      "tripHours": 12,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 21.31,
      "desireFit": 20.95,
      "resourceMargin": 33.62,
      "transferHealth": 21.58,
      "adaptGain": 30.74,
      "auditTrail": 23.08,
      "overall": 25.32
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 7.98,
      "desireFit": 24.69,
      "resourceMargin": 14.88,
      "transferHealth": 10.68,
      "adaptGain": 10.29,
      "auditTrail": 1.54,
      "overall": 14.55
    }
  },
  {
    "id": "odts-005",
    "input": {
      "scheduleFeasibility": 0.27,
      "resourceHeadroom": 0.26,
      "transferReliability": 0.27,
      "desireAlignment": 0.33,
      "constraintStrictness": 0.27,
      "desireWeight": 0.18,
      "stopCount": 9,
      "weatherRisk": 0.54,
      "offlineMapCoverage": 0.29,
      "mobilityAdaptability": 0.28,
      "tripHours": 13,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 22.01,
      "desireFit": 23.23,
      "resourceMargin": 35.79,
      "transferHealth": 24.21,
      "adaptGain": 31.58,
      "auditTrail": 24.84,
      "overall": 26.94
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 7.97,
      "desireFit": 24.75,
      "resourceMargin": 14.82,
      "transferHealth": 12.58,
      "adaptGain": 10.25,
      "auditTrail": 1.5,
      "overall": 14.78
    }
  },
  {
    "id": "odts-006",
    "input": {
      "scheduleFeasibility": 0.31,
      "resourceHeadroom": 0.31,
      "transferReliability": 0.25,
      "desireAlignment": 0.28,
      "constraintStrictness": 0.31,
      "desireWeight": 0.23,
      "stopCount": 10,
      "weatherRisk": 0.49,
      "offlineMapCoverage": 0.32,
      "mobilityAdaptability": 0.32,
      "tripHours": 14,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 26.91,
      "desireFit": 24.09,
      "resourceMargin": 40.17,
      "transferHealth": 24.48,
      "adaptGain": 37.49,
      "auditTrail": 28.62,
      "overall": 30.47
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 8.77,
      "desireFit": 24.42,
      "resourceMargin": 15.63,
      "transferHealth": 11.03,
      "adaptGain": 11.19,
      "auditTrail": 1.38,
      "overall": 14.82
    }
  },
  {
    "id": "odts-007",
    "input": {
      "scheduleFeasibility": 0.34,
      "resourceHeadroom": 0.35,
      "transferReliability": 0.3,
      "desireAlignment": 0.32,
      "constraintStrictness": 0.35,
      "desireWeight": 0.28,
      "stopCount": 11,
      "weatherRisk": 0.49,
      "offlineMapCoverage": 0.36,
      "mobilityAdaptability": 0.26,
      "tripHours": 15,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 28.63,
      "desireFit": 24.23,
      "resourceMargin": 40.43,
      "transferHealth": 27.14,
      "adaptGain": 34.8,
      "auditTrail": 28.58,
      "overall": 30.75
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 9.56,
      "desireFit": 28.13,
      "resourceMargin": 16.39,
      "transferHealth": 12.83,
      "adaptGain": 10.47,
      "auditTrail": 2.88,
      "overall": 16.57
    }
  },
  {
    "id": "odts-008",
    "input": {
      "scheduleFeasibility": 0.38,
      "resourceHeadroom": 0.31,
      "transferReliability": 0.34,
      "desireAlignment": 0.36,
      "constraintStrictness": 0.33,
      "desireWeight": 0.32,
      "stopCount": 12,
      "weatherRisk": 0.49,
      "offlineMapCoverage": 0.34,
      "mobilityAdaptability": 0.29,
      "tripHours": 16,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 30.04,
      "desireFit": 27.37,
      "resourceMargin": 37.68,
      "transferHealth": 30.62,
      "adaptGain": 36.46,
      "auditTrail": 30.26,
      "overall": 32.17
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 9.98,
      "desireFit": 31.57,
      "resourceMargin": 15.81,
      "transferHealth": 14.63,
      "adaptGain": 11.3,
      "auditTrail": 4.24,
      "overall": 18.22
    }
  },
  {
    "id": "odts-009",
    "input": {
      "scheduleFeasibility": 0.42,
      "resourceHeadroom": 0.36,
      "transferReliability": 0.33,
      "desireAlignment": 0.4,
      "constraintStrictness": 0.37,
      "desireWeight": 0.37,
      "stopCount": 13,
      "weatherRisk": 0.43,
      "offlineMapCoverage": 0.38,
      "mobilityAdaptability": 0.33,
      "tripHours": 17,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 35.66,
      "desireFit": 32.77,
      "resourceMargin": 42.35,
      "transferHealth": 32.92,
      "adaptGain": 42.9,
      "auditTrail": 35.46,
      "overall": 37.25
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 10.68,
      "desireFit": 33.58,
      "resourceMargin": 16.54,
      "transferHealth": 14.63,
      "adaptGain": 12.19,
      "auditTrail": 5.74,
      "overall": 19.41
    }
  },
  {
    "id": "odts-010",
    "input": {
      "scheduleFeasibility": 0.39,
      "resourceHeadroom": 0.4,
      "transferReliability": 0.37,
      "desireAlignment": 0.43,
      "constraintStrictness": 0.4,
      "desireWeight": 0.31,
      "stopCount": 14,
      "weatherRisk": 0.43,
      "offlineMapCoverage": 0.42,
      "mobilityAdaptability": 0.37,
      "tripHours": 18,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 34.13,
      "desireFit": 33.1,
      "resourceMargin": 42.5,
      "transferHealth": 33.31,
      "adaptGain": 41.92,
      "auditTrail": 33.7,
      "overall": 36.68
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 10.55,
      "desireFit": 35.6,
      "resourceMargin": 16.43,
      "transferHealth": 15.96,
      "adaptGain": 12.23,
      "auditTrail": 5.52,
      "overall": 20.2
    }
  },
  {
    "id": "odts-011",
    "input": {
      "scheduleFeasibility": 0.43,
      "resourceHeadroom": 0.44,
      "transferReliability": 0.42,
      "desireAlignment": 0.47,
      "constraintStrictness": 0.44,
      "desireWeight": 0.36,
      "stopCount": 15,
      "weatherRisk": 0.43,
      "offlineMapCoverage": 0.46,
      "mobilityAdaptability": 0.41,
      "tripHours": 19,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 37.74,
      "desireFit": 36.82,
      "resourceMargin": 44.67,
      "transferHealth": 37.34,
      "adaptGain": 44.64,
      "auditTrail": 36.86,
      "overall": 39.92
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 11.37,
      "desireFit": 39.61,
      "resourceMargin": 17.13,
      "transferHealth": 17.62,
      "adaptGain": 12.72,
      "auditTrail": 7.02,
      "overall": 22.22
    }
  },
  {
    "id": "odts-012",
    "input": {
      "scheduleFeasibility": 0.47,
      "resourceHeadroom": 0.41,
      "transferReliability": 0.4,
      "desireAlignment": 0.42,
      "constraintStrictness": 0.42,
      "desireWeight": 0.4,
      "stopCount": 16,
      "weatherRisk": 0.37,
      "offlineMapCoverage": 0.44,
      "mobilityAdaptability": 0.45,
      "tripHours": 20,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 41.4,
      "desireFit": 37.97,
      "resourceMargin": 44.52,
      "transferHealth": 38.26,
      "adaptGain": 50.74,
      "auditTrail": 39.32,
      "overall": 42.5
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 11.58,
      "desireFit": 38.95,
      "resourceMargin": 16.57,
      "transferHealth": 16.32,
      "adaptGain": 13.93,
      "auditTrail": 6.76,
      "overall": 21.95
    }
  },
  {
    "id": "odts-013",
    "input": {
      "scheduleFeasibility": 0.5,
      "resourceHeadroom": 0.45,
      "transferReliability": 0.45,
      "desireAlignment": 0.46,
      "constraintStrictness": 0.46,
      "desireWeight": 0.45,
      "stopCount": 17,
      "weatherRisk": 0.37,
      "offlineMapCoverage": 0.47,
      "mobilityAdaptability": 0.49,
      "tripHours": 21,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 42.4,
      "desireFit": 39.77,
      "resourceMargin": 44.39,
      "transferHealth": 40.27,
      "adaptGain": 50.82,
      "auditTrail": 39.28,
      "overall": 43.32
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 12.17,
      "desireFit": 44.95,
      "resourceMargin": 17.27,
      "transferHealth": 17.94,
      "adaptGain": 14.3,
      "auditTrail": 8.26,
      "overall": 24.59
    }
  },
  {
    "id": "odts-014",
    "input": {
      "scheduleFeasibility": 0.54,
      "resourceHeadroom": 0.49,
      "transferReliability": 0.49,
      "desireAlignment": 0.5,
      "constraintStrictness": 0.5,
      "desireWeight": 0.5,
      "stopCount": 18,
      "weatherRisk": 0.37,
      "offlineMapCoverage": 0.51,
      "mobilityAdaptability": 0.42,
      "tripHours": 22,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 45.9,
      "desireFit": 40.96,
      "resourceMargin": 46.56,
      "transferHealth": 43.75,
      "adaptGain": 49.8,
      "auditTrail": 42.28,
      "overall": 45.23
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 12.89,
      "desireFit": 46.44,
      "resourceMargin": 17.93,
      "transferHealth": 19.26,
      "adaptGain": 13.49,
      "auditTrail": 9.76,
      "overall": 25.49
    }
  },
  {
    "id": "odts-015",
    "input": {
      "scheduleFeasibility": 0.51,
      "resourceHeadroom": 0.54,
      "transferReliability": 0.48,
      "desireAlignment": 0.54,
      "constraintStrictness": 0.54,
      "desireWeight": 0.44,
      "stopCount": 19,
      "weatherRisk": 0.31,
      "offlineMapCoverage": 0.55,
      "mobilityAdaptability": 0.46,
      "tripHours": 23,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 49.21,
      "desireFit": 45.74,
      "resourceMargin": 51.67,
      "transferHealth": 45.23,
      "adaptGain": 55.29,
      "auditTrail": 46.08,
      "overall": 49.32
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 12.47,
      "desireFit": 44.72,
      "resourceMargin": 17.59,
      "transferHealth": 19.13,
      "adaptGain": 13.62,
      "auditTrail": 9.72,
      "overall": 24.81
    }
  },
  {
    "id": "odts-016",
    "input": {
      "scheduleFeasibility": 0.55,
      "resourceHeadroom": 0.5,
      "transferReliability": 0.52,
      "desireAlignment": 0.57,
      "constraintStrictness": 0.52,
      "desireWeight": 0.49,
      "stopCount": 20,
      "weatherRisk": 0.32,
      "offlineMapCoverage": 0.53,
      "mobilityAdaptability": 0.5,
      "tripHours": 24,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 48.02,
      "desireFit": 46.49,
      "resourceMargin": 46.46,
      "transferHealth": 46.44,
      "adaptGain": 54.38,
      "auditTrail": 44.62,
      "overall": 48.21
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 12.95,
      "desireFit": 50.47,
      "resourceMargin": 17.31,
      "transferHealth": 20.74,
      "adaptGain": 14.5,
      "auditTrail": 11.04,
      "overall": 27.27
    }
  },
  {
    "id": "odts-017",
    "input": {
      "scheduleFeasibility": 0.59,
      "resourceHeadroom": 0.55,
      "transferReliability": 0.57,
      "desireAlignment": 0.61,
      "constraintStrictness": 0.56,
      "desireWeight": 0.53,
      "stopCount": 21,
      "weatherRisk": 0.32,
      "offlineMapCoverage": 0.57,
      "mobilityAdaptability": 0.54,
      "tripHours": 25,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 51.63,
      "desireFit": 50.1,
      "resourceMargin": 49.11,
      "transferHealth": 50.47,
      "adaptGain": 57.1,
      "auditTrail": 47.78,
      "overall": 51.5
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 13.57,
      "desireFit": 54.14,
      "resourceMargin": 18.01,
      "transferHealth": 22.17,
      "adaptGain": 14.82,
      "auditTrail": 12.4,
      "overall": 29.08
    }
  },
  {
    "id": "odts-018",
    "input": {
      "scheduleFeasibility": 0.63,
      "resourceHeadroom": 0.59,
      "transferReliability": 0.55,
      "desireAlignment": 0.56,
      "constraintStrictness": 0.6,
      "desireWeight": 0.58,
      "stopCount": 22,
      "weatherRisk": 0.26,
      "offlineMapCoverage": 0.61,
      "mobilityAdaptability": 0.57,
      "tripHours": 26,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 58.14,
      "desireFit": 52,
      "resourceMargin": 53.84,
      "transferHealth": 52.05,
      "adaptGain": 64.22,
      "auditTrail": 51.56,
      "overall": 56.05
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 13.9,
      "desireFit": 53.58,
      "resourceMargin": 18.35,
      "transferHealth": 20.44,
      "adaptGain": 15.2,
      "auditTrail": 12.28,
      "overall": 28.81
    }
  },
  {
    "id": "odts-019",
    "input": {
      "scheduleFeasibility": 0.66,
      "resourceHeadroom": 0.63,
      "transferReliability": 0.6,
      "desireAlignment": 0.6,
      "constraintStrictness": 0.64,
      "desireWeight": 0.63,
      "stopCount": 23,
      "weatherRisk": 0.26,
      "offlineMapCoverage": 0.64,
      "mobilityAdaptability": 0.61,
      "tripHours": 27,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 58.38,
      "desireFit": 53.17,
      "resourceMargin": 53.27,
      "transferHealth": 53.4,
      "adaptGain": 63.66,
      "auditTrail": 51.52,
      "overall": 56.3
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 14.28,
      "desireFit": 59.59,
      "resourceMargin": 18.92,
      "transferHealth": 21.82,
      "adaptGain": 15.41,
      "auditTrail": 13.78,
      "overall": 31.36
    }
  },
  {
    "id": "odts-020",
    "input": {
      "scheduleFeasibility": 0.63,
      "resourceHeadroom": 0.6,
      "transferReliability": 0.64,
      "desireAlignment": 0.64,
      "constraintStrictness": 0.62,
      "desireWeight": 0.57,
      "stopCount": 24,
      "weatherRisk": 0.26,
      "offlineMapCoverage": 0.62,
      "mobilityAdaptability": 0.65,
      "tripHours": 28,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 56.88,
      "desireFit": 55.44,
      "resourceMargin": 51,
      "transferHealth": 55.48,
      "adaptGain": 64.12,
      "auditTrail": 51.8,
      "overall": 56.42
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 13.94,
      "desireFit": 59.87,
      "resourceMargin": 17.94,
      "transferHealth": 23.48,
      "adaptGain": 15.85,
      "auditTrail": 13.74,
      "overall": 31.54
    }
  },
  {
    "id": "odts-021",
    "input": {
      "scheduleFeasibility": 0.67,
      "resourceHeadroom": 0.64,
      "transferReliability": 0.63,
      "desireAlignment": 0.68,
      "constraintStrictness": 0.66,
      "desireWeight": 0.62,
      "stopCount": 25,
      "weatherRisk": 0.2,
      "offlineMapCoverage": 0.66,
      "mobilityAdaptability": 0.58,
      "tripHours": 29,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 63.75,
      "desireFit": 59.53,
      "resourceMargin": 55.83,
      "transferHealth": 59.02,
      "adaptGain": 68.02,
      "auditTrail": 57,
      "overall": 61.24
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 14.18,
      "desireFit": 59.36,
      "resourceMargin": 18.24,
      "transferHealth": 23.26,
      "adaptGain": 15.15,
      "auditTrail": 15.24,
      "overall": 31.48
    }
  },
  {
    "id": "odts-022",
    "input": {
      "scheduleFeasibility": 0.71,
      "resourceHeadroom": 0.68,
      "transferReliability": 0.67,
      "desireAlignment": 0.71,
      "constraintStrictness": 0.69,
      "desireWeight": 0.66,
      "stopCount": 26,
      "weatherRisk": 0.2,
      "offlineMapCoverage": 0.7,
      "mobilityAdaptability": 0.62,
      "tripHours": 30,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 63.88,
      "desireFit": 59.74,
      "resourceMargin": 55.34,
      "transferHealth": 59.57,
      "adaptGain": 67.38,
      "auditTrail": 56.64,
      "overall": 61.14
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 14.65,
      "desireFit": 64.76,
      "resourceMargin": 18.75,
      "transferHealth": 24.24,
      "adaptGain": 15.42,
      "auditTrail": 16.42,
      "overall": 33.75
    }
  },
  {
    "id": "odts-023",
    "input": {
      "scheduleFeasibility": 0.75,
      "resourceHeadroom": 0.73,
      "transferReliability": 0.72,
      "desireAlignment": 0.75,
      "constraintStrictness": 0.73,
      "desireWeight": 0.71,
      "stopCount": 27,
      "weatherRisk": 0.2,
      "offlineMapCoverage": 0.74,
      "mobilityAdaptability": 0.66,
      "tripHours": 31,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 67.49,
      "desireFit": 63.46,
      "resourceMargin": 57.99,
      "transferHealth": 63.6,
      "adaptGain": 70.1,
      "auditTrail": 59.8,
      "overall": 64.45
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.03,
      "desireFit": 68.77,
      "resourceMargin": 19.37,
      "transferHealth": 25.43,
      "adaptGain": 15.56,
      "auditTrail": 17.92,
      "overall": 35.59
    }
  },
  {
    "id": "odts-024",
    "input": {
      "scheduleFeasibility": 0.79,
      "resourceHeadroom": 0.69,
      "transferReliability": 0.7,
      "desireAlignment": 0.7,
      "constraintStrictness": 0.71,
      "desireWeight": 0.75,
      "stopCount": 28,
      "weatherRisk": 0.14,
      "offlineMapCoverage": 0.72,
      "mobilityAdaptability": 0.7,
      "tripHours": 32,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 72.55,
      "desireFit": 65.88,
      "resourceMargin": 58,
      "transferHealth": 65.83,
      "adaptGain": 77.47,
      "auditTrail": 62.26,
      "overall": 68.04
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.2,
      "desireFit": 68.11,
      "resourceMargin": 18.87,
      "transferHealth": 24.25,
      "adaptGain": 16.52,
      "auditTrail": 17.66,
      "overall": 35.3
    }
  },
  {
    "id": "odts-025",
    "input": {
      "scheduleFeasibility": 0.75,
      "resourceHeadroom": 0.73,
      "transferReliability": 0.75,
      "desireAlignment": 0.74,
      "constraintStrictness": 0.75,
      "desireWeight": 0.7,
      "stopCount": 29,
      "weatherRisk": 0.14,
      "offlineMapCoverage": 0.76,
      "mobilityAdaptability": 0.74,
      "tripHours": 33,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 69.32,
      "desireFit": 65.31,
      "resourceMargin": 57.41,
      "transferHealth": 65.13,
      "adaptGain": 74.74,
      "auditTrail": 60.82,
      "overall": 66.34
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 14.79,
      "desireFit": 70.73,
      "resourceMargin": 18.57,
      "transferHealth": 25.44,
      "adaptGain": 16.2,
      "auditTrail": 17.76,
      "overall": 36.2
    }
  },
  {
    "id": "odts-026",
    "input": {
      "scheduleFeasibility": 0.79,
      "resourceHeadroom": 0.78,
      "transferReliability": 0.79,
      "desireAlignment": 0.78,
      "constraintStrictness": 0.79,
      "desireWeight": 0.75,
      "stopCount": 30,
      "weatherRisk": 0.15,
      "offlineMapCoverage": 0.79,
      "mobilityAdaptability": 0.78,
      "tripHours": 34,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 72.6,
      "desireFit": 69.03,
      "resourceMargin": 59.88,
      "transferHealth": 68.61,
      "adaptGain": 77.18,
      "auditTrail": 63.82,
      "overall": 69.4
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.11,
      "desireFit": 74.74,
      "resourceMargin": 19.2,
      "transferHealth": 26.39,
      "adaptGain": 16.25,
      "auditTrail": 19.26,
      "overall": 37.99
    }
  },
  {
    "id": "odts-027",
    "input": {
      "scheduleFeasibility": 0.83,
      "resourceHeadroom": 0.82,
      "transferReliability": 0.78,
      "desireAlignment": 0.82,
      "constraintStrictness": 0.83,
      "desireWeight": 0.79,
      "stopCount": 31,
      "weatherRisk": 0.09,
      "offlineMapCoverage": 0.83,
      "mobilityAdaptability": 0.81,
      "tripHours": 35,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 80.21,
      "desireFit": 75.88,
      "resourceMargin": 65.15,
      "transferHealth": 72.81,
      "adaptGain": 85.3,
      "auditTrail": 69.02,
      "overall": 75.88
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.07,
      "desireFit": 75.93,
      "resourceMargin": 19.26,
      "transferHealth": 26.06,
      "adaptGain": 16.23,
      "auditTrail": 20.62,
      "overall": 38.52
    }
  },
  {
    "id": "odts-028",
    "input": {
      "scheduleFeasibility": 0.87,
      "resourceHeadroom": 0.78,
      "transferReliability": 0.82,
      "desireAlignment": 0.86,
      "constraintStrictness": 0.81,
      "desireWeight": 0.84,
      "stopCount": 32,
      "weatherRisk": 0.09,
      "offlineMapCoverage": 0.81,
      "mobilityAdaptability": 0.75,
      "tripHours": 36,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 77.77,
      "desireFit": 73.24,
      "resourceMargin": 59.3,
      "transferHealth": 72.82,
      "adaptGain": 79.84,
      "auditTrail": 67.7,
      "overall": 72.71
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.57,
      "desireFit": 79.38,
      "resourceMargin": 19.2,
      "transferHealth": 27.68,
      "adaptGain": 16.28,
      "auditTrail": 22.12,
      "overall": 40.13
    }
  },
  {
    "id": "odts-029",
    "input": {
      "scheduleFeasibility": 0.91,
      "resourceHeadroom": 0.83,
      "transferReliability": 0.87,
      "desireAlignment": 0.89,
      "constraintStrictness": 0.85,
      "desireWeight": 0.88,
      "stopCount": 33,
      "weatherRisk": 0.09,
      "offlineMapCoverage": 0.85,
      "mobilityAdaptability": 0.79,
      "tripHours": 37,
      "planner": "cloud_style"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 81.38,
      "desireFit": 76.22,
      "resourceMargin": 61.95,
      "transferHealth": 76.73,
      "adaptGain": 82.56,
      "auditTrail": 70.72,
      "overall": 75.86
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 15.78,
      "desireFit": 82.54,
      "resourceMargin": 19.66,
      "transferHealth": 28.52,
      "adaptGain": 16.27,
      "auditTrail": 23.3,
      "overall": 41.53
    }
  },
  {
    "id": "odts-030",
    "input": {
      "scheduleFeasibility": 0.87,
      "resourceHeadroom": 0.87,
      "transferReliability": 0.85,
      "desireAlignment": 0.84,
      "constraintStrictness": 0.89,
      "desireWeight": 0.83,
      "stopCount": 4,
      "weatherRisk": 0.03,
      "offlineMapCoverage": 0.89,
      "mobilityAdaptability": 0.83,
      "tripHours": 38,
      "planner": "on_device"
    },
    "expectedPlaFeasibility": {
      "mode": "pla_feasibility",
      "feasibility": 85.79,
      "desireFit": 73.49,
      "resourceMargin": 84.65,
      "transferHealth": 77.94,
      "adaptGain": 89.46,
      "auditTrail": 72.9,
      "overall": 81.74
    },
    "expectedDesireFirst": {
      "mode": "desire_first",
      "feasibility": 14.92,
      "desireFit": 72.03,
      "resourceMargin": 23.2,
      "transferHealth": 26.61,
      "adaptGain": 15.84,
      "auditTrail": 21.78,
      "overall": 37.87
    }
  }
];
