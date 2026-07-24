import type { LocoInput, LocoQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LocoInput;
  expectedMultiSkill: LocoQuality;
  expectedSingleGait: LocoQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "qss-001",
    "input": {
      "terrainRoughness": 0.79,
      "perceptionQuality": 0.21,
      "skillCoverage": 0.19,
      "transitionSmoothness": 0.18,
      "gaitStability": 0.22,
      "energyEfficiency": 0.19,
      "slipRisk": 0.66,
      "slopeGrade": 0.66,
      "trajectoryDensity": 0.18,
      "skill": "pace",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 17.45,
      "transitionScore": 9.98,
      "perceptionScore": 16.31,
      "stabilityScore": 12.25,
      "energyScore": 13.05,
      "stallRisk": 28.26,
      "overall": 15.56
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 15.3,
      "transitionScore": 3.34,
      "perceptionScore": 6.24,
      "stabilityScore": 0.1,
      "energyScore": 7.21,
      "stallRisk": 9.76,
      "overall": 7.49
    }
  },
  {
    "id": "qss-002",
    "input": {
      "terrainRoughness": 0.79,
      "perceptionQuality": 0.24,
      "skillCoverage": 0.23,
      "transitionSmoothness": 0.22,
      "gaitStability": 0.26,
      "energyEfficiency": 0.23,
      "slipRisk": 0.66,
      "slopeGrade": 0.66,
      "trajectoryDensity": 0.22,
      "skill": "bound",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 20.97,
      "transitionScore": 13.99,
      "perceptionScore": 19.65,
      "stabilityScore": 16.12,
      "energyScore": 17.2,
      "stallRisk": 29.22,
      "overall": 18.98
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 16.09,
      "transitionScore": 4.57,
      "perceptionScore": 7.17,
      "stabilityScore": 1,
      "energyScore": 8.56,
      "stallRisk": 10.64,
      "overall": 8.46
    }
  },
  {
    "id": "qss-003",
    "input": {
      "terrainRoughness": 0.79,
      "perceptionQuality": 0.28,
      "skillCoverage": 0.28,
      "transitionSmoothness": 0.21,
      "gaitStability": 0.3,
      "energyEfficiency": 0.27,
      "slipRisk": 0.6,
      "slopeGrade": 0.66,
      "trajectoryDensity": 0.25,
      "skill": "crawl",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 28.54,
      "transitionScore": 29.35,
      "perceptionScore": 25.46,
      "stabilityScore": 22.32,
      "energyScore": 23.56,
      "stallRisk": 50.7,
      "overall": 29.29
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 16.87,
      "transitionScore": 1.04,
      "perceptionScore": 8.14,
      "stabilityScore": 2.42,
      "energyScore": 9.81,
      "stallRisk": 15.04,
      "overall": 10.1
    }
  },
  {
    "id": "qss-004",
    "input": {
      "terrainRoughness": 0.71,
      "perceptionQuality": 0.32,
      "skillCoverage": 0.24,
      "transitionSmoothness": 0.25,
      "gaitStability": 0.34,
      "energyEfficiency": 0.24,
      "slipRisk": 0.6,
      "slopeGrade": 0.58,
      "trajectoryDensity": 0.29,
      "skill": "climb",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 28.85,
      "transitionScore": 18.11,
      "perceptionScore": 27.29,
      "stabilityScore": 23.21,
      "energyScore": 19.38,
      "stallRisk": 35.42,
      "overall": 24.99
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 18.25,
      "transitionScore": 5.61,
      "perceptionScore": 9.14,
      "stabilityScore": 4.26,
      "energyScore": 9.16,
      "stallRisk": 16.4,
      "overall": 11.55
    }
  },
  {
    "id": "qss-005",
    "input": {
      "terrainRoughness": 0.7,
      "perceptionQuality": 0.28,
      "skillCoverage": 0.29,
      "transitionSmoothness": 0.3,
      "gaitStability": 0.3,
      "energyEfficiency": 0.28,
      "slipRisk": 0.6,
      "slopeGrade": 0.58,
      "trajectoryDensity": 0.33,
      "skill": "trot",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 26.7,
      "transitionScore": 20.16,
      "perceptionScore": 25.07,
      "stabilityScore": 21.23,
      "energyScore": 21.62,
      "stallRisk": 36.84,
      "overall": 24.73
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 17.52,
      "transitionScore": 6.61,
      "perceptionScore": 8.49,
      "stabilityScore": 3.07,
      "energyScore": 9.66,
      "stallRisk": 17.78,
      "overall": 11.72
    }
  },
  {
    "id": "qss-006",
    "input": {
      "terrainRoughness": 0.7,
      "perceptionQuality": 0.32,
      "skillCoverage": 0.33,
      "transitionSmoothness": 0.28,
      "gaitStability": 0.34,
      "energyEfficiency": 0.32,
      "slipRisk": 0.54,
      "slopeGrade": 0.59,
      "trajectoryDensity": 0.28,
      "skill": "pace",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 31.18,
      "transitionScore": 33.33,
      "perceptionScore": 27.77,
      "stabilityScore": 25.68,
      "energyScore": 26.57,
      "stallRisk": 57.84,
      "overall": 32.87
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 18.13,
      "transitionScore": 2.77,
      "perceptionScore": 8.73,
      "stabilityScore": 4.27,
      "energyScore": 10.83,
      "stallRisk": 21.96,
      "overall": 13.1
    }
  },
  {
    "id": "qss-007",
    "input": {
      "terrainRoughness": 0.7,
      "perceptionQuality": 0.36,
      "skillCoverage": 0.37,
      "transitionSmoothness": 0.33,
      "gaitStability": 0.38,
      "energyEfficiency": 0.36,
      "slipRisk": 0.54,
      "slopeGrade": 0.59,
      "trajectoryDensity": 0.31,
      "skill": "bound",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 31.22,
      "transitionScore": 25.38,
      "perceptionScore": 28.75,
      "stabilityScore": 26.87,
      "energyScore": 28.51,
      "stallRisk": 40.8,
      "overall": 29.67
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 18.82,
      "transitionScore": 8.01,
      "perceptionScore": 9.63,
      "stabilityScore": 5,
      "energyScore": 11.98,
      "stallRisk": 22.84,
      "overall": 14.4
    }
  },
  {
    "id": "qss-008",
    "input": {
      "terrainRoughness": 0.62,
      "perceptionQuality": 0.4,
      "skillCoverage": 0.34,
      "transitionSmoothness": 0.37,
      "gaitStability": 0.41,
      "energyEfficiency": 0.32,
      "slipRisk": 0.54,
      "slopeGrade": 0.51,
      "trajectoryDensity": 0.35,
      "skill": "crawl",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 35.66,
      "transitionScore": 27.8,
      "perceptionScore": 33.46,
      "stabilityScore": 30.64,
      "energyScore": 26.85,
      "stallRisk": 43.76,
      "overall": 32.69
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 19.9,
      "transitionScore": 8.45,
      "perceptionScore": 10.47,
      "stabilityScore": 6.45,
      "energyScore": 10.95,
      "stallRisk": 24.42,
      "overall": 15.31
    }
  },
  {
    "id": "qss-009",
    "input": {
      "terrainRoughness": 0.62,
      "perceptionQuality": 0.44,
      "skillCoverage": 0.38,
      "transitionSmoothness": 0.36,
      "gaitStability": 0.45,
      "energyEfficiency": 0.37,
      "slipRisk": 0.48,
      "slopeGrade": 0.51,
      "trajectoryDensity": 0.39,
      "skill": "climb",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 45.25,
      "transitionScore": 45.2,
      "perceptionScore": 41.62,
      "stabilityScore": 38.78,
      "energyScore": 34.97,
      "stallRisk": 65,
      "overall": 44.76
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 20.41,
      "transitionScore": 4.72,
      "perceptionScore": 11.33,
      "stabilityScore": 7.62,
      "energyScore": 12.22,
      "stallRisk": 28.6,
      "overall": 16.76
    }
  },
  {
    "id": "qss-010",
    "input": {
      "terrainRoughness": 0.62,
      "perceptionQuality": 0.4,
      "skillCoverage": 0.43,
      "transitionSmoothness": 0.4,
      "gaitStability": 0.41,
      "energyEfficiency": 0.41,
      "slipRisk": 0.48,
      "slopeGrade": 0.51,
      "trajectoryDensity": 0.43,
      "skill": "trot",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 36.76,
      "transitionScore": 30.69,
      "perceptionScore": 34.08,
      "stabilityScore": 31.11,
      "energyScore": 32.6,
      "stallRisk": 48.2,
      "overall": 34.97
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 19.66,
      "transitionScore": 9.42,
      "perceptionScore": 10.71,
      "stabilityScore": 6.52,
      "energyScore": 12.64,
      "stallRisk": 29.7,
      "overall": 17.23
    }
  },
  {
    "id": "qss-011",
    "input": {
      "terrainRoughness": 0.62,
      "perceptionQuality": 0.44,
      "skillCoverage": 0.47,
      "transitionSmoothness": 0.45,
      "gaitStability": 0.45,
      "energyEfficiency": 0.45,
      "slipRisk": 0.48,
      "slopeGrade": 0.51,
      "trajectoryDensity": 0.47,
      "skill": "pace",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 37.27,
      "transitionScore": 33.18,
      "perceptionScore": 35.37,
      "stabilityScore": 32.49,
      "energyScore": 34.56,
      "stallRisk": 49.16,
      "overall": 36.4
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 20.23,
      "transitionScore": 10.5,
      "perceptionScore": 11.57,
      "stabilityScore": 7.15,
      "energyScore": 13.65,
      "stallRisk": 30.58,
      "overall": 18.05
    }
  },
  {
    "id": "qss-012",
    "input": {
      "terrainRoughness": 0.53,
      "perceptionQuality": 0.48,
      "skillCoverage": 0.44,
      "transitionSmoothness": 0.43,
      "gaitStability": 0.49,
      "energyEfficiency": 0.41,
      "slipRisk": 0.42,
      "slopeGrade": 0.43,
      "trajectoryDensity": 0.41,
      "skill": "bound",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 49.04,
      "transitionScore": 50.32,
      "perceptionScore": 44.3,
      "stabilityScore": 43.1,
      "energyScore": 38.49,
      "stallRisk": 72.38,
      "overall": 49.15
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.11,
      "transitionScore": 5.97,
      "perceptionScore": 11.42,
      "stabilityScore": 9.11,
      "energyScore": 12.58,
      "stallRisk": 35.74,
      "overall": 19.47
    }
  },
  {
    "id": "qss-013",
    "input": {
      "terrainRoughness": 0.53,
      "perceptionQuality": 0.52,
      "skillCoverage": 0.48,
      "transitionSmoothness": 0.48,
      "gaitStability": 0.53,
      "energyEfficiency": 0.45,
      "slipRisk": 0.42,
      "slopeGrade": 0.43,
      "trajectoryDensity": 0.45,
      "skill": "crawl",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 46.31,
      "transitionScore": 39.41,
      "perceptionScore": 42.98,
      "stabilityScore": 41.68,
      "energyScore": 38.38,
      "stallRisk": 54.38,
      "overall": 43.54
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.59,
      "transitionScore": 10.98,
      "perceptionScore": 12.21,
      "stabilityScore": 9.65,
      "energyScore": 13.52,
      "stallRisk": 36.62,
      "overall": 20.63
    }
  },
  {
    "id": "qss-014",
    "input": {
      "terrainRoughness": 0.53,
      "perceptionQuality": 0.55,
      "skillCoverage": 0.52,
      "transitionSmoothness": 0.52,
      "gaitStability": 0.57,
      "energyEfficiency": 0.5,
      "slipRisk": 0.42,
      "slopeGrade": 0.43,
      "trajectoryDensity": 0.49,
      "skill": "climb",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 49.33,
      "transitionScore": 43.68,
      "perceptionScore": 46.22,
      "stabilityScore": 45.36,
      "energyScore": 43.09,
      "stallRisk": 54.38,
      "overall": 46.81
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.02,
      "transitionScore": 11.8,
      "perceptionScore": 12.81,
      "stabilityScore": 10.2,
      "energyScore": 14.65,
      "stallRisk": 37.5,
      "overall": 21.38
    }
  },
  {
    "id": "qss-015",
    "input": {
      "terrainRoughness": 0.53,
      "perceptionQuality": 0.52,
      "skillCoverage": 0.57,
      "transitionSmoothness": 0.51,
      "gaitStability": 0.53,
      "energyEfficiency": 0.54,
      "slipRisk": 0.36,
      "slopeGrade": 0.43,
      "trajectoryDensity": 0.53,
      "skill": "trot",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 53.49,
      "transitionScore": 58.1,
      "perceptionScore": 48.65,
      "stabilityScore": 47.52,
      "energyScore": 49.15,
      "stallRisk": 74.66,
      "overall": 54.79
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.15,
      "transitionScore": 7.67,
      "perceptionScore": 12.27,
      "stabilityScore": 9.52,
      "energyScore": 14.84,
      "stallRisk": 41.9,
      "overall": 21.98
    }
  },
  {
    "id": "qss-016",
    "input": {
      "terrainRoughness": 0.45,
      "perceptionQuality": 0.56,
      "skillCoverage": 0.53,
      "transitionSmoothness": 0.55,
      "gaitStability": 0.57,
      "energyEfficiency": 0.5,
      "slipRisk": 0.36,
      "slopeGrade": 0.36,
      "trajectoryDensity": 0.56,
      "skill": "pace",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 48.17,
      "transitionScore": 41.94,
      "perceptionScore": 45.16,
      "stabilityScore": 43.21,
      "energyScore": 39.75,
      "stallRisk": 58.42,
      "overall": 45.74
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.87,
      "transitionScore": 11.87,
      "perceptionScore": 12.78,
      "stabilityScore": 10.82,
      "energyScore": 13.89,
      "stallRisk": 43.26,
      "overall": 23.09
    }
  },
  {
    "id": "qss-017",
    "input": {
      "terrainRoughness": 0.45,
      "perceptionQuality": 0.6,
      "skillCoverage": 0.58,
      "transitionSmoothness": 0.6,
      "gaitStability": 0.6,
      "energyEfficiency": 0.54,
      "slipRisk": 0.36,
      "slopeGrade": 0.36,
      "trajectoryDensity": 0.6,
      "skill": "bound",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 53.79,
      "transitionScore": 48.5,
      "perceptionScore": 50.72,
      "stabilityScore": 48.64,
      "energyScore": 45.82,
      "stallRisk": 58.42,
      "overall": 50.91
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.14,
      "transitionScore": 12.71,
      "perceptionScore": 13.4,
      "stabilityScore": 11.04,
      "energyScore": 14.59,
      "stallRisk": 44.36,
      "overall": 23.76
    }
  },
  {
    "id": "qss-018",
    "input": {
      "terrainRoughness": 0.45,
      "perceptionQuality": 0.63,
      "skillCoverage": 0.62,
      "transitionSmoothness": 0.58,
      "gaitStability": 0.64,
      "energyEfficiency": 0.59,
      "slipRisk": 0.3,
      "slopeGrade": 0.36,
      "trajectoryDensity": 0.55,
      "skill": "crawl",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 63.86,
      "transitionScore": 68.09,
      "perceptionScore": 58.36,
      "stabilityScore": 58.86,
      "energyScore": 56.55,
      "stallRisk": 78.7,
      "overall": 64.01
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.33,
      "transitionScore": 8.64,
      "perceptionScore": 13.24,
      "stabilityScore": 11.86,
      "energyScore": 15.48,
      "stallRisk": 48.54,
      "overall": 24.89
    }
  },
  {
    "id": "qss-019",
    "input": {
      "terrainRoughness": 0.45,
      "perceptionQuality": 0.67,
      "skillCoverage": 0.66,
      "transitionSmoothness": 0.63,
      "gaitStability": 0.68,
      "energyEfficiency": 0.63,
      "slipRisk": 0.3,
      "slopeGrade": 0.36,
      "trajectoryDensity": 0.59,
      "skill": "climb",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 59.9,
      "transitionScore": 55.37,
      "perceptionScore": 55.76,
      "stabilityScore": 56.06,
      "energyScore": 54.79,
      "stallRisk": 60.7,
      "overall": 57.11
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.64,
      "transitionScore": 13.43,
      "perceptionScore": 13.84,
      "stabilityScore": 12.24,
      "energyScore": 16.19,
      "stallRisk": 49.42,
      "overall": 25.92
    }
  },
  {
    "id": "qss-020",
    "input": {
      "terrainRoughness": 0.36,
      "perceptionQuality": 0.64,
      "skillCoverage": 0.63,
      "transitionSmoothness": 0.67,
      "gaitStability": 0.64,
      "energyEfficiency": 0.59,
      "slipRisk": 0.3,
      "slopeGrade": 0.28,
      "trajectoryDensity": 0.62,
      "skill": "trot",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 57.62,
      "transitionScore": 53.3,
      "perceptionScore": 53.43,
      "stabilityScore": 52.92,
      "energyScore": 49.38,
      "stallRisk": 62.68,
      "overall": 54.87
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.09,
      "transitionScore": 13.2,
      "perceptionScore": 13.07,
      "stabilityScore": 12.04,
      "energyScore": 14.61,
      "stallRisk": 51.28,
      "overall": 26.02
    }
  },
  {
    "id": "qss-021",
    "input": {
      "terrainRoughness": 0.36,
      "perceptionQuality": 0.67,
      "skillCoverage": 0.67,
      "transitionSmoothness": 0.66,
      "gaitStability": 0.68,
      "energyEfficiency": 0.63,
      "slipRisk": 0.24,
      "slopeGrade": 0.28,
      "trajectoryDensity": 0.66,
      "skill": "pace",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 65.39,
      "transitionScore": 69.71,
      "perceptionScore": 60.22,
      "stabilityScore": 60.07,
      "energyScore": 56.67,
      "stallRisk": 82.96,
      "overall": 65.72
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.15,
      "transitionScore": 9.19,
      "perceptionScore": 13.39,
      "stabilityScore": 12.71,
      "energyScore": 15.17,
      "stallRisk": 55.46,
      "overall": 27.12
    }
  },
  {
    "id": "qss-022",
    "input": {
      "terrainRoughness": 0.36,
      "perceptionQuality": 0.71,
      "skillCoverage": 0.72,
      "transitionSmoothness": 0.7,
      "gaitStability": 0.72,
      "energyEfficiency": 0.67,
      "slipRisk": 0.24,
      "slopeGrade": 0.28,
      "trajectoryDensity": 0.7,
      "skill": "bound",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 63.94,
      "transitionScore": 59.36,
      "perceptionScore": 59.6,
      "stabilityScore": 59.22,
      "energyScore": 57.04,
      "stallRisk": 64.96,
      "overall": 60.78
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.38,
      "transitionScore": 13.76,
      "perceptionScore": 13.89,
      "stabilityScore": 12.99,
      "energyScore": 15.77,
      "stallRisk": 56.56,
      "overall": 28.14
    }
  },
  {
    "id": "qss-023",
    "input": {
      "terrainRoughness": 0.36,
      "perceptionQuality": 0.75,
      "skillCoverage": 0.76,
      "transitionSmoothness": 0.75,
      "gaitStability": 0.76,
      "energyEfficiency": 0.72,
      "slipRisk": 0.24,
      "slopeGrade": 0.28,
      "trajectoryDensity": 0.74,
      "skill": "crawl",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 67.58,
      "transitionScore": 64.5,
      "perceptionScore": 63.6,
      "stabilityScore": 63.45,
      "energyScore": 62.14,
      "stallRisk": 64.96,
      "overall": 64.64
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.56,
      "transitionScore": 14.39,
      "perceptionScore": 14.36,
      "stabilityScore": 13.26,
      "energyScore": 16.5,
      "stallRisk": 57.44,
      "overall": 28.7
    }
  },
  {
    "id": "qss-024",
    "input": {
      "terrainRoughness": 0.28,
      "perceptionQuality": 0.79,
      "skillCoverage": 0.73,
      "transitionSmoothness": 0.73,
      "gaitStability": 0.79,
      "energyEfficiency": 0.68,
      "slipRisk": 0.18,
      "slopeGrade": 0.2,
      "trajectoryDensity": 0.69,
      "skill": "climb",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 81.39,
      "transitionScore": 84.9,
      "perceptionScore": 75.14,
      "stabilityScore": 76.06,
      "energyScore": 68.3,
      "stallRisk": 87,
      "overall": 79.41
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 22.64,
      "transitionScore": 9.62,
      "perceptionScore": 13.99,
      "stabilityScore": 14.48,
      "energyScore": 15.3,
      "stallRisk": 62.32,
      "overall": 29.71
    }
  },
  {
    "id": "qss-025",
    "input": {
      "terrainRoughness": 0.28,
      "perceptionQuality": 0.75,
      "skillCoverage": 0.77,
      "transitionSmoothness": 0.78,
      "gaitStability": 0.76,
      "energyEfficiency": 0.72,
      "slipRisk": 0.18,
      "slopeGrade": 0.2,
      "trajectoryDensity": 0.72,
      "skill": "trot",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 67.45,
      "transitionScore": 64.47,
      "perceptionScore": 61.98,
      "stabilityScore": 63.57,
      "energyScore": 60.47,
      "stallRisk": 69,
      "overall": 64.65
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.87,
      "transitionScore": 13.99,
      "perceptionScore": 13.32,
      "stabilityScore": 13.64,
      "energyScore": 15.43,
      "stallRisk": 63.2,
      "overall": 30.07
    }
  },
  {
    "id": "qss-026",
    "input": {
      "terrainRoughness": 0.28,
      "perceptionQuality": 0.79,
      "skillCoverage": 0.81,
      "transitionSmoothness": 0.82,
      "gaitStability": 0.79,
      "energyEfficiency": 0.76,
      "slipRisk": 0.18,
      "slopeGrade": 0.21,
      "trajectoryDensity": 0.76,
      "skill": "pace",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 66.81,
      "transitionScore": 65.02,
      "perceptionScore": 62.19,
      "stabilityScore": 63.06,
      "energyScore": 61.23,
      "stallRisk": 69,
      "overall": 64.67
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.9,
      "transitionScore": 14.39,
      "perceptionScore": 13.74,
      "stabilityScore": 13.59,
      "energyScore": 15.88,
      "stallRisk": 64.08,
      "overall": 30.49
    }
  },
  {
    "id": "qss-027",
    "input": {
      "terrainRoughness": 0.27,
      "perceptionQuality": 0.83,
      "skillCoverage": 0.86,
      "transitionSmoothness": 0.81,
      "gaitStability": 0.83,
      "energyEfficiency": 0.8,
      "slipRisk": 0.12,
      "slopeGrade": 0.21,
      "trajectoryDensity": 0.8,
      "skill": "bound",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 83.79,
      "transitionScore": 90.68,
      "perceptionScore": 77.57,
      "stabilityScore": 78.5,
      "energyScore": 76.86,
      "stallRisk": 89.5,
      "overall": 83.32
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.71,
      "transitionScore": 10.15,
      "perceptionScore": 13.88,
      "stabilityScore": 13.86,
      "energyScore": 16.05,
      "stallRisk": 68.76,
      "overall": 31.52
    }
  },
  {
    "id": "qss-028",
    "input": {
      "terrainRoughness": 0.19,
      "perceptionQuality": 0.87,
      "skillCoverage": 0.82,
      "transitionSmoothness": 0.85,
      "gaitStability": 0.87,
      "energyEfficiency": 0.77,
      "slipRisk": 0.12,
      "slopeGrade": 0.13,
      "trajectoryDensity": 0.84,
      "skill": "crawl",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 79.39,
      "transitionScore": 73.85,
      "perceptionScore": 74.43,
      "stabilityScore": 74.49,
      "energyScore": 67.71,
      "stallRisk": 73.26,
      "overall": 74.46
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.84,
      "transitionScore": 13.97,
      "perceptionScore": 13.99,
      "stabilityScore": 14.86,
      "energyScore": 15.19,
      "stallRisk": 70.12,
      "overall": 32.41
    }
  },
  {
    "id": "qss-029",
    "input": {
      "terrainRoughness": 0.19,
      "perceptionQuality": 0.91,
      "skillCoverage": 0.87,
      "transitionSmoothness": 0.9,
      "gaitStability": 0.91,
      "energyEfficiency": 0.81,
      "slipRisk": 0.12,
      "slopeGrade": 0.13,
      "trajectoryDensity": 0.87,
      "skill": "climb",
      "plan": "single_gait"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 83.28,
      "transitionScore": 79.52,
      "perceptionScore": 78.49,
      "stabilityScore": 79.01,
      "energyScore": 72.81,
      "stallRisk": 73.26,
      "overall": 78.54
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 21.77,
      "transitionScore": 14.36,
      "perceptionScore": 14.16,
      "stabilityScore": 14.9,
      "energyScore": 15.49,
      "stallRisk": 71.22,
      "overall": 32.84
    }
  },
  {
    "id": "qss-030",
    "input": {
      "terrainRoughness": 0.19,
      "perceptionQuality": 0.87,
      "skillCoverage": 0.91,
      "transitionSmoothness": 0.88,
      "gaitStability": 0.87,
      "energyEfficiency": 0.85,
      "slipRisk": 0.06,
      "slopeGrade": 0.13,
      "trajectoryDensity": 0.82,
      "skill": "trot",
      "plan": "multi_skill"
    },
    "expectedMultiSkill": {
      "mode": "multi_skill",
      "traversalScore": 87.46,
      "transitionScore": 95.39,
      "perceptionScore": 80.04,
      "stabilityScore": 82.8,
      "energyScore": 80.37,
      "stallRisk": 93.54,
      "overall": 87.15
    },
    "expectedSingleGait": {
      "mode": "single_gait",
      "traversalScore": 20.8,
      "transitionScore": 9.87,
      "perceptionScore": 13.06,
      "stabilityScore": 14.18,
      "energyScore": 15.36,
      "stallRisk": 75.4,
      "overall": 33.21
    }
  }
];
