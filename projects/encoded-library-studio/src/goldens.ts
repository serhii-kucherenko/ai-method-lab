import type { DeltInput, DeltQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DeltInput;
  expectedIterative: DeltQuality;
  expectedSinglePass: DeltQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "el-001",
    "input": {
      "cycleDepth": 0.29,
      "enrichmentFold": 0.25,
      "diversityRetention": 0.28,
      "hitPrecision": 0.34,
      "libraryCoverage": 0.39,
      "synthesisNoise": 0.59,
      "selectionBias": 0.45,
      "overclaimRisk": 0.5,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 22.56,
      "enrichmentScore": 30.25,
      "diversityScore": 22.93,
      "hitScore": 37.64,
      "coverageScore": 16.4,
      "confidence": 17.95,
      "iterativeContribution": 27.98,
      "singlePassContribution": 15.96,
      "overall": 29.82
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 5.76,
      "enrichmentScore": 17.41,
      "diversityScore": 12.83,
      "hitScore": 32.39,
      "coverageScore": 40.93,
      "confidence": 17.1,
      "iterativeContribution": 21.86,
      "singlePassContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "el-002",
    "input": {
      "cycleDepth": 0.33,
      "enrichmentFold": 0.29,
      "diversityRetention": 0.32,
      "hitPrecision": 0.38,
      "libraryCoverage": 0.43,
      "synthesisNoise": 0.6,
      "selectionBias": 0.46,
      "overclaimRisk": 0.51,
      "deltBias": "hit_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 28.57,
      "enrichmentScore": 33.9,
      "diversityScore": 17.2,
      "hitScore": 48.93,
      "coverageScore": 18.89,
      "confidence": 21.2,
      "iterativeContribution": 31.25,
      "singlePassContribution": 18.61,
      "overall": 32.97
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 2.43,
      "enrichmentScore": 18.54,
      "diversityScore": 13.86,
      "hitScore": 34.08,
      "coverageScore": 31.53,
      "confidence": 18.65,
      "iterativeContribution": 20.09,
      "singlePassContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "el-003",
    "input": {
      "cycleDepth": 0.37,
      "enrichmentFold": 0.27,
      "diversityRetention": 0.36,
      "hitPrecision": 0.42,
      "libraryCoverage": 0.46,
      "synthesisNoise": 0.6,
      "selectionBias": 0.42,
      "overclaimRisk": 0.46,
      "deltBias": "coverage_first",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 6.77,
      "enrichmentScore": 23.71,
      "diversityScore": 19.55,
      "hitScore": 19.24,
      "coverageScore": 19.94,
      "confidence": 23.4,
      "iterativeContribution": 17.5,
      "singlePassContribution": 19.69,
      "overall": 18.89
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 12.17,
      "enrichmentScore": 17.9,
      "diversityScore": 12.83,
      "hitScore": 33.93,
      "coverageScore": 54.34,
      "confidence": 18.4,
      "iterativeContribution": 26.23,
      "singlePassContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "el-004",
    "input": {
      "cycleDepth": 0.33,
      "enrichmentFold": 0.32,
      "diversityRetention": 0.39,
      "hitPrecision": 0.38,
      "libraryCoverage": 0.42,
      "synthesisNoise": 0.53,
      "selectionBias": 0.43,
      "overclaimRisk": 0.46,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 28.09,
      "enrichmentScore": 36.03,
      "diversityScore": 32.93,
      "hitScore": 42.23,
      "coverageScore": 18.93,
      "confidence": 22.55,
      "iterativeContribution": 34.62,
      "singlePassContribution": 19.05,
      "overall": 35.82
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 8.7,
      "enrichmentScore": 17.89,
      "diversityScore": 13.8,
      "hitScore": 32.79,
      "coverageScore": 42.77,
      "confidence": 18.85,
      "iterativeContribution": 23.19,
      "singlePassContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "el-005",
    "input": {
      "cycleDepth": 0.37,
      "enrichmentFold": 0.36,
      "diversityRetention": 0.35,
      "hitPrecision": 0.42,
      "libraryCoverage": 0.46,
      "synthesisNoise": 0.53,
      "selectionBias": 0.45,
      "overclaimRisk": 0.47,
      "deltBias": "iterative",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 34.83,
      "enrichmentScore": 39.64,
      "diversityScore": 39.44,
      "hitScore": 35.49,
      "coverageScore": 21.8,
      "confidence": 25.65,
      "iterativeContribution": 37.52,
      "singlePassContribution": 22.19,
      "overall": 38.76
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 0,
      "enrichmentScore": 19.59,
      "diversityScore": 15.41,
      "hitScore": 34.77,
      "coverageScore": 32.95,
      "confidence": 21.05,
      "iterativeContribution": 20.54,
      "singlePassContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "el-006",
    "input": {
      "cycleDepth": 0.41,
      "enrichmentFold": 0.34,
      "diversityRetention": 0.39,
      "hitPrecision": 0.45,
      "libraryCoverage": 0.5,
      "synthesisNoise": 0.54,
      "selectionBias": 0.4,
      "overclaimRisk": 0.42,
      "deltBias": "balanced",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 33.94,
      "enrichmentScore": 39.5,
      "diversityScore": 34.86,
      "hitScore": 47.85,
      "coverageScore": 23.08,
      "confidence": 27.75,
      "iterativeContribution": 38.7,
      "singlePassContribution": 23.38,
      "overall": 39.94
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 11.98,
      "enrichmentScore": 18.6,
      "diversityScore": 14.01,
      "hitScore": 34.78,
      "coverageScore": 46.72,
      "confidence": 20.5,
      "iterativeContribution": 25.22,
      "singlePassContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "el-007",
    "input": {
      "cycleDepth": 0.45,
      "enrichmentFold": 0.38,
      "diversityRetention": 0.42,
      "hitPrecision": 0.49,
      "libraryCoverage": 0.53,
      "synthesisNoise": 0.55,
      "selectionBias": 0.42,
      "overclaimRisk": 0.43,
      "deltBias": "hit_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 41.2,
      "enrichmentScore": 43.11,
      "diversityScore": 25.56,
      "hitScore": 61.29,
      "coverageScore": 25.15,
      "confidence": 30.85,
      "iterativeContribution": 41.74,
      "singlePassContribution": 25.64,
      "overall": 42.84
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 8.27,
      "enrichmentScore": 19.9,
      "diversityScore": 15.24,
      "hitScore": 36.3,
      "coverageScore": 34.2,
      "confidence": 22.15,
      "iterativeContribution": 22.78,
      "singlePassContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "el-008",
    "input": {
      "cycleDepth": 0.41,
      "enrichmentFold": 0.43,
      "diversityRetention": 0.46,
      "hitPrecision": 0.45,
      "libraryCoverage": 0.49,
      "synthesisNoise": 0.47,
      "selectionBias": 0.43,
      "overclaimRisk": 0.44,
      "deltBias": "coverage_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 11.91,
      "enrichmentScore": 35.43,
      "diversityScore": 27.9,
      "hitScore": 24.76,
      "coverageScore": 24.32,
      "confidence": 30,
      "iterativeContribution": 25.33,
      "singlePassContribution": 25.23,
      "overall": 26.31
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 16.4,
      "enrichmentScore": 20.02,
      "diversityScore": 16.36,
      "hitScore": 35.17,
      "coverageScore": 58.5,
      "confidence": 22.7,
      "iterativeContribution": 29.29,
      "singlePassContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "el-009",
    "input": {
      "cycleDepth": 0.46,
      "enrichmentFold": 0.41,
      "diversityRetention": 0.5,
      "hitPrecision": 0.49,
      "libraryCoverage": 0.53,
      "synthesisNoise": 0.48,
      "selectionBias": 0.39,
      "overclaimRisk": 0.38,
      "deltBias": "balanced",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 40.05,
      "enrichmentScore": 45.49,
      "diversityScore": 44.98,
      "hitScore": 52.59,
      "coverageScore": 25.81,
      "confidence": 32.5,
      "iterativeContribution": 45.6,
      "singlePassContribution": 26.69,
      "overall": 46.2
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 14.91,
      "enrichmentScore": 19.47,
      "diversityScore": 15.34,
      "hitScore": 35.36,
      "coverageScore": 48.88,
      "confidence": 22.7,
      "iterativeContribution": 26.79,
      "singlePassContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "el-010",
    "input": {
      "cycleDepth": 0.5,
      "enrichmentFold": 0.45,
      "diversityRetention": 0.46,
      "hitPrecision": 0.53,
      "libraryCoverage": 0.57,
      "synthesisNoise": 0.49,
      "selectionBias": 0.4,
      "overclaimRisk": 0.39,
      "deltBias": "iterative",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 48,
      "enrichmentScore": 49.14,
      "diversityScore": 53.86,
      "hitScore": 43.07,
      "coverageScore": 28.29,
      "confidence": 35.75,
      "iterativeContribution": 48.85,
      "singlePassContribution": 29.32,
      "overall": 49.33
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 3.59,
      "enrichmentScore": 20.58,
      "diversityScore": 16.35,
      "hitScore": 37.06,
      "coverageScore": 35.54,
      "confidence": 24.25,
      "iterativeContribution": 22.62,
      "singlePassContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "el-011",
    "input": {
      "cycleDepth": 0.54,
      "enrichmentFold": 0.49,
      "diversityRetention": 0.49,
      "hitPrecision": 0.57,
      "libraryCoverage": 0.6,
      "synthesisNoise": 0.49,
      "selectionBias": 0.42,
      "overclaimRisk": 0.4,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 47.21,
      "enrichmentScore": 52.75,
      "diversityScore": 46.49,
      "hitScore": 60.27,
      "coverageScore": 30.54,
      "confidence": 38.85,
      "iterativeContribution": 51.32,
      "singlePassContribution": 31.82,
      "overall": 51.81
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 17.1,
      "enrichmentScore": 22.02,
      "diversityScore": 17.74,
      "hitScore": 38.58,
      "coverageScore": 54.12,
      "confidence": 26.1,
      "iterativeContribution": 29.91,
      "singlePassContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "el-012",
    "input": {
      "cycleDepth": 0.5,
      "enrichmentFold": 0.48,
      "diversityRetention": 0.53,
      "hitPrecision": 0.53,
      "libraryCoverage": 0.56,
      "synthesisNoise": 0.42,
      "selectionBias": 0.37,
      "overclaimRisk": 0.35,
      "deltBias": "hit_first",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 50.05,
      "enrichmentScore": 51.28,
      "diversityScore": 34.12,
      "hitScore": 67.57,
      "coverageScore": 28.34,
      "confidence": 37.1,
      "iterativeContribution": 49.76,
      "singlePassContribution": 29.7,
      "overall": 50.15
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 13.23,
      "enrichmentScore": 19.84,
      "diversityScore": 16.17,
      "hitScore": 35.76,
      "coverageScore": 34.93,
      "confidence": 24.35,
      "iterativeContribution": 23.99,
      "singlePassContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "el-013",
    "input": {
      "cycleDepth": 0.54,
      "enrichmentFold": 0.52,
      "diversityRetention": 0.56,
      "hitPrecision": 0.57,
      "libraryCoverage": 0.6,
      "synthesisNoise": 0.42,
      "selectionBias": 0.39,
      "overclaimRisk": 0.36,
      "deltBias": "coverage_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 19.05,
      "enrichmentScore": 44.88,
      "diversityScore": 36.31,
      "hitScore": 32.66,
      "coverageScore": 31.2,
      "confidence": 40.2,
      "iterativeContribution": 33.59,
      "singlePassContribution": 32.8,
      "overall": 34.45
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 22.62,
      "enrichmentScore": 21.51,
      "diversityScore": 17.75,
      "hitScore": 37.74,
      "coverageScore": 67.02,
      "confidence": 26.55,
      "iterativeContribution": 33.33,
      "singlePassContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "el-014",
    "input": {
      "cycleDepth": 0.58,
      "enrichmentFold": 0.56,
      "diversityRetention": 0.6,
      "hitPrecision": 0.61,
      "libraryCoverage": 0.63,
      "synthesisNoise": 0.43,
      "selectionBias": 0.4,
      "overclaimRisk": 0.36,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 52.62,
      "enrichmentScore": 58.53,
      "diversityScore": 56.38,
      "hitScore": 64.86,
      "coverageScore": 33.07,
      "confidence": 43.45,
      "iterativeContribution": 57.9,
      "singlePassContribution": 34.8,
      "overall": 57.74
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 20.03,
      "enrichmentScore": 22.36,
      "diversityScore": 18.54,
      "hitScore": 38.98,
      "coverageScore": 55.96,
      "confidence": 27.85,
      "iterativeContribution": 31.17,
      "singlePassContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "el-015",
    "input": {
      "cycleDepth": 0.62,
      "enrichmentFold": 0.54,
      "diversityRetention": 0.56,
      "hitPrecision": 0.65,
      "libraryCoverage": 0.67,
      "synthesisNoise": 0.44,
      "selectionBias": 0.36,
      "overclaimRisk": 0.31,
      "deltBias": "iterative",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 60.5,
      "enrichmentScore": 58.35,
      "diversityScore": 67.29,
      "hitScore": 50.82,
      "coverageScore": 34.55,
      "confidence": 45.65,
      "iterativeContribution": 59.71,
      "singlePassContribution": 36.22,
      "overall": 59.48
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 9.43,
      "enrichmentScore": 21.78,
      "diversityScore": 17.48,
      "hitScore": 39.27,
      "coverageScore": 38.2,
      "confidence": 27.75,
      "iterativeContribution": 25.23,
      "singlePassContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "el-016",
    "input": {
      "cycleDepth": 0.58,
      "enrichmentFold": 0.59,
      "diversityRetention": 0.6,
      "hitPrecision": 0.6,
      "libraryCoverage": 0.63,
      "synthesisNoise": 0.36,
      "selectionBias": 0.37,
      "overclaimRisk": 0.32,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 54.46,
      "enrichmentScore": 60.67,
      "diversityScore": 58.01,
      "hitScore": 65.05,
      "coverageScore": 33.73,
      "confidence": 44.55,
      "iterativeContribution": 59.4,
      "singlePassContribution": 35.76,
      "overall": 59.14
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 22.05,
      "enrichmentScore": 21.83,
      "diversityScore": 18.56,
      "hitScore": 38.14,
      "coverageScore": 55.7,
      "confidence": 28.3,
      "iterativeContribution": 31.26,
      "singlePassContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "el-017",
    "input": {
      "cycleDepth": 0.62,
      "enrichmentFold": 0.63,
      "diversityRetention": 0.63,
      "hitPrecision": 0.64,
      "libraryCoverage": 0.67,
      "synthesisNoise": 0.37,
      "selectionBias": 0.39,
      "overclaimRisk": 0.33,
      "deltBias": "hit_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 64.02,
      "enrichmentScore": 64.28,
      "diversityScore": 42.54,
      "hitScore": 81.43,
      "coverageScore": 36.41,
      "confidence": 47.65,
      "iterativeContribution": 61.9,
      "singlePassContribution": 38.61,
      "overall": 61.71
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 18.73,
      "enrichmentScore": 23.34,
      "diversityScore": 19.95,
      "hitScore": 40.11,
      "coverageScore": 39.86,
      "confidence": 30.3,
      "iterativeContribution": 28.4,
      "singlePassContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "el-018",
    "input": {
      "cycleDepth": 0.66,
      "enrichmentFold": 0.61,
      "diversityRetention": 0.67,
      "hitPrecision": 0.68,
      "libraryCoverage": 0.7,
      "synthesisNoise": 0.38,
      "selectionBias": 0.34,
      "overclaimRisk": 0.27,
      "deltBias": "coverage_first",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 25.78,
      "enrichmentScore": 54.13,
      "diversityScore": 44.82,
      "hitScore": 40.09,
      "coverageScore": 37.08,
      "confidence": 50,
      "iterativeContribution": 41.63,
      "singlePassContribution": 39.16,
      "overall": 42.19
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 28.36,
      "enrichmentScore": 22.06,
      "diversityScore": 18.26,
      "hitScore": 39.67,
      "coverageScore": 74.27,
      "confidence": 29.5,
      "iterativeContribution": 36.52,
      "singlePassContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "el-019",
    "input": {
      "cycleDepth": 0.7,
      "enrichmentFold": 0.65,
      "diversityRetention": 0.7,
      "hitPrecision": 0.72,
      "libraryCoverage": 0.74,
      "synthesisNoise": 0.38,
      "selectionBias": 0.36,
      "overclaimRisk": 0.28,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 63.81,
      "enrichmentScore": 67.74,
      "diversityScore": 67.47,
      "hitScore": 75.07,
      "coverageScore": 39.94,
      "confidence": 53.1,
      "iterativeContribution": 68.33,
      "singlePassContribution": 42.25,
      "overall": 67.64
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 26.25,
      "enrichmentScore": 23.72,
      "diversityScore": 19.82,
      "hitScore": 41.65,
      "coverageScore": 62.07,
      "confidence": 31.7,
      "iterativeContribution": 34.7,
      "singlePassContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "el-020",
    "input": {
      "cycleDepth": 0.66,
      "enrichmentFold": 0.7,
      "diversityRetention": 0.66,
      "hitPrecision": 0.68,
      "libraryCoverage": 0.7,
      "synthesisNoise": 0.31,
      "selectionBias": 0.37,
      "overclaimRisk": 0.29,
      "deltBias": "iterative",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 69.98,
      "enrichmentScore": 70.06,
      "diversityScore": 80.6,
      "hitScore": 56.34,
      "coverageScore": 38.94,
      "confidence": 52.25,
      "iterativeContribution": 69.97,
      "singlePassContribution": 41.54,
      "overall": 68.85
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 13.66,
      "enrichmentScore": 23.61,
      "diversityScore": 20.65,
      "hitScore": 40.51,
      "coverageScore": 40.86,
      "confidence": 32.05,
      "iterativeContribution": 27.86,
      "singlePassContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "el-021",
    "input": {
      "cycleDepth": 0.7,
      "enrichmentFold": 0.68,
      "diversityRetention": 0.7,
      "hitPrecision": 0.72,
      "libraryCoverage": 0.73,
      "synthesisNoise": 0.31,
      "selectionBias": 0.33,
      "overclaimRisk": 0.24,
      "deltBias": "balanced",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 65.6,
      "enrichmentScore": 69.88,
      "diversityScore": 69.04,
      "hitScore": 75.82,
      "coverageScore": 39.99,
      "confidence": 54.45,
      "iterativeContribution": 69.92,
      "singlePassContribution": 42.54,
      "overall": 68.99
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 27.89,
      "enrichmentScore": 22.88,
      "diversityScore": 19.52,
      "hitScore": 40.35,
      "coverageScore": 61.19,
      "confidence": 31.8,
      "iterativeContribution": 34.37,
      "singlePassContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "el-022",
    "input": {
      "cycleDepth": 0.74,
      "enrichmentFold": 0.72,
      "diversityRetention": 0.73,
      "hitPrecision": 0.76,
      "libraryCoverage": 0.77,
      "synthesisNoise": 0.32,
      "selectionBias": 0.34,
      "overclaimRisk": 0.25,
      "deltBias": "hit_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 76.39,
      "enrichmentScore": 73.52,
      "diversityScore": 50.64,
      "hitScore": 94.56,
      "coverageScore": 42.47,
      "confidence": 57.7,
      "iterativeContribution": 72.43,
      "singlePassContribution": 45.15,
      "overall": 71.52
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 24.57,
      "enrichmentScore": 23.95,
      "diversityScore": 20.48,
      "hitScore": 42.05,
      "coverageScore": 42.21,
      "confidence": 33.35,
      "iterativeContribution": 30.65,
      "singlePassContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "el-023",
    "input": {
      "cycleDepth": 0.79,
      "enrichmentFold": 0.76,
      "diversityRetention": 0.77,
      "hitPrecision": 0.8,
      "libraryCoverage": 0.81,
      "synthesisNoise": 0.33,
      "selectionBias": 0.36,
      "overclaimRisk": 0.25,
      "deltBias": "coverage_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 33.46,
      "enrichmentScore": 67.38,
      "diversityScore": 53.32,
      "hitScore": 49.49,
      "coverageScore": 45.16,
      "confidence": 61.1,
      "iterativeContribution": 51.37,
      "singlePassContribution": 48.03,
      "overall": 51.77
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 33.86,
      "enrichmentScore": 25.49,
      "diversityScore": 21.9,
      "hitScore": 43.92,
      "coverageScore": 84.72,
      "confidence": 35.45,
      "iterativeContribution": 41.98,
      "singlePassContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "el-024",
    "input": {
      "cycleDepth": 0.75,
      "enrichmentFold": 0.75,
      "diversityRetention": 0.81,
      "hitPrecision": 0.76,
      "libraryCoverage": 0.77,
      "synthesisNoise": 0.25,
      "selectionBias": 0.31,
      "overclaimRisk": 0.2,
      "deltBias": "balanced",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 71.55,
      "enrichmentScore": 75.91,
      "diversityScore": 78.99,
      "hitScore": 80.56,
      "coverageScore": 43.13,
      "confidence": 59.35,
      "iterativeContribution": 76.75,
      "singlePassContribution": 46.07,
      "overall": 75.23
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 31.21,
      "enrichmentScore": 23.36,
      "diversityScore": 20.38,
      "hitScore": 41.11,
      "coverageScore": 63.65,
      "confidence": 33.9,
      "iterativeContribution": 35.94,
      "singlePassContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "el-025",
    "input": {
      "cycleDepth": 0.79,
      "enrichmentFold": 0.79,
      "diversityRetention": 0.77,
      "hitPrecision": 0.8,
      "libraryCoverage": 0.8,
      "synthesisNoise": 0.26,
      "selectionBias": 0.33,
      "overclaimRisk": 0.21,
      "deltBias": "iterative",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 83,
      "enrichmentScore": 79.52,
      "diversityScore": 94.88,
      "hitScore": 64.24,
      "coverageScore": 45.2,
      "confidence": 62.45,
      "iterativeContribution": 81.29,
      "singlePassContribution": 48.27,
      "overall": 79.35
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 19.5,
      "enrichmentScore": 24.6,
      "diversityScore": 21.54,
      "hitScore": 42.63,
      "coverageScore": 43.52,
      "confidence": 35.55,
      "iterativeContribution": 30.36,
      "singlePassContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "el-026",
    "input": {
      "cycleDepth": 0.83,
      "enrichmentFold": 0.83,
      "diversityRetention": 0.8,
      "hitPrecision": 0.83,
      "libraryCoverage": 0.84,
      "synthesisNoise": 0.27,
      "selectionBias": 0.34,
      "overclaimRisk": 0.22,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 78.52,
      "enrichmentScore": 83.17,
      "diversityScore": 80.3,
      "hitScore": 87.68,
      "coverageScore": 47.68,
      "confidence": 65.45,
      "iterativeContribution": 82.24,
      "singlePassContribution": 50.87,
      "overall": 80.59
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 33.17,
      "enrichmentScore": 25.67,
      "diversityScore": 22.55,
      "hitScore": 44.32,
      "coverageScore": 68.8,
      "confidence": 37.1,
      "iterativeContribution": 38.9,
      "singlePassContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "el-027",
    "input": {
      "cycleDepth": 0.87,
      "enrichmentFold": 0.81,
      "diversityRetention": 0.84,
      "hitPrecision": 0.87,
      "libraryCoverage": 0.88,
      "synthesisNoise": 0.27,
      "selectionBias": 0.3,
      "overclaimRisk": 0.17,
      "deltBias": "hit_first",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 89.4,
      "enrichmentScore": 82.98,
      "diversityScore": 59.19,
      "hitScore": 100,
      "coverageScore": 49.35,
      "confidence": 67.65,
      "iterativeContribution": 81.6,
      "singlePassContribution": 52.5,
      "overall": 80.36
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 30.78,
      "enrichmentScore": 25.18,
      "diversityScore": 21.6,
      "hitScore": 44.62,
      "coverageScore": 45.22,
      "confidence": 37.2,
      "iterativeContribution": 33.48,
      "singlePassContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "el-028",
    "input": {
      "cycleDepth": 0.83,
      "enrichmentFold": 0.86,
      "diversityRetention": 0.87,
      "hitPrecision": 0.83,
      "libraryCoverage": 0.84,
      "synthesisNoise": 0.2,
      "selectionBias": 0.31,
      "overclaimRisk": 0.17,
      "deltBias": "coverage_first",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 37.76,
      "enrichmentScore": 75.3,
      "diversityScore": 61.04,
      "hitScore": 53.51,
      "coverageScore": 48.34,
      "confidence": 66.8,
      "iterativeContribution": 57.5,
      "singlePassContribution": 51.73,
      "overall": 57.46
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 38.81,
      "enrichmentScore": 25.01,
      "diversityScore": 22.37,
      "hitScore": 43.48,
      "coverageScore": 86.95,
      "confidence": 37.65,
      "iterativeContribution": 43.32,
      "singlePassContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "el-029",
    "input": {
      "cycleDepth": 0.87,
      "enrichmentFold": 0.9,
      "diversityRetention": 0.91,
      "hitPrecision": 0.87,
      "libraryCoverage": 0.87,
      "synthesisNoise": 0.2,
      "selectionBias": 0.33,
      "overclaimRisk": 0.18,
      "deltBias": "balanced",
      "profile": "iterative_delt_optimize"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 83.89,
      "enrichmentScore": 88.91,
      "diversityScore": 90.14,
      "hitScore": 92.27,
      "coverageScore": 50.59,
      "confidence": 69.9,
      "iterativeContribution": 88.79,
      "singlePassContribution": 54.16,
      "overall": 86.56
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 36.33,
      "enrichmentScore": 26.36,
      "diversityScore": 23.66,
      "hitScore": 45,
      "coverageScore": 71.06,
      "confidence": 39.5,
      "iterativeContribution": 40.48,
      "singlePassContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "el-030",
    "input": {
      "cycleDepth": 0.91,
      "enrichmentFold": 0.88,
      "diversityRetention": 0.87,
      "hitPrecision": 0.91,
      "libraryCoverage": 0.91,
      "synthesisNoise": 0.21,
      "selectionBias": 0.28,
      "overclaimRisk": 0.13,
      "deltBias": "iterative",
      "profile": "single_pass_library_screen"
    },
    "expectedIterative": {
      "mode": "iterative_delt_optimize",
      "cycleScore": 95.24,
      "enrichmentScore": 88.77,
      "diversityScore": 100,
      "hitScore": 71.68,
      "coverageScore": 51.88,
      "confidence": 72.25,
      "iterativeContribution": 89.71,
      "singlePassContribution": 55.31,
      "overall": 87.52
    },
    "expectedSinglePass": {
      "mode": "single_pass_library_screen",
      "cycleScore": 25.72,
      "enrichmentScore": 25.3,
      "diversityScore": 22.14,
      "hitScore": 45.02,
      "coverageScore": 46.21,
      "confidence": 38.95,
      "iterativeContribution": 32.88,
      "singlePassContribution": 50.68,
      "overall": 44.3
    }
  }
];
