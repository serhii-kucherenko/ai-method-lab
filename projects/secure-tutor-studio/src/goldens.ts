import type { TutorInput, TutorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TutorInput;
  expectedOrchestrated: TutorQuality;
  expectedSingle: TutorQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "vulnComplexity": 0.12,
      "rubricItemCount": 3,
      "tutorCoverage": 0.19,
      "orchestrationRounds": 2,
      "pedagogyDepth": 0.12,
      "threatCoverage": 0.15,
      "safetyGateStrength": 0.12,
      "studentRiskLevel": 0.07,
      "exploitHintRisk": 0.07,
      "explainerSpecialization": 0.19,
      "safetySpecialization": 0.18,
      "rubricSpecialization": 0.14,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 30.46,
      "securityRubricPass": 23.34,
      "safetyGateScore": 36.95,
      "tutorCoverageScore": 21.16,
      "orchestrationLift": 31.71,
      "lessonStability": 28.59,
      "confidence": 22.5,
      "overall": 29.04
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.1,
      "securityRubricPass": 55.58,
      "safetyGateScore": 46.78,
      "tutorCoverageScore": 37.21,
      "orchestrationLift": 10.36,
      "lessonStability": 46.14,
      "confidence": 54.81,
      "overall": 48.32
    }
  },
  {
    "id": "std-002",
    "input": {
      "vulnComplexity": 0.17,
      "rubricItemCount": 5,
      "tutorCoverage": 0.23,
      "orchestrationRounds": 3,
      "pedagogyDepth": 0.17,
      "threatCoverage": 0.19,
      "safetyGateStrength": 0.16,
      "studentRiskLevel": 0.11,
      "exploitHintRisk": 0.11,
      "explainerSpecialization": 0.23,
      "safetySpecialization": 0.23,
      "rubricSpecialization": 0.18,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 36.14,
      "securityRubricPass": 28.45,
      "safetyGateScore": 37.65,
      "tutorCoverageScore": 27.91,
      "orchestrationLift": 43.96,
      "lessonStability": 31.71,
      "confidence": 32.23,
      "overall": 34.07
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.15,
      "securityRubricPass": 51.72,
      "safetyGateScore": 45.09,
      "tutorCoverageScore": 37.96,
      "orchestrationLift": 10.56,
      "lessonStability": 43.25,
      "confidence": 52.72,
      "overall": 45.85
    }
  },
  {
    "id": "std-003",
    "input": {
      "vulnComplexity": 0.21,
      "rubricItemCount": 3,
      "tutorCoverage": 0.28,
      "orchestrationRounds": 4,
      "pedagogyDepth": 0.14,
      "threatCoverage": 0.24,
      "safetyGateStrength": 0.21,
      "studentRiskLevel": 0.15,
      "exploitHintRisk": 0.16,
      "explainerSpecialization": 0.27,
      "safetySpecialization": 0.2,
      "rubricSpecialization": 0.23,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 40.24,
      "securityRubricPass": 28.56,
      "safetyGateScore": 39.55,
      "tutorCoverageScore": 28.33,
      "orchestrationLift": 53.26,
      "lessonStability": 32.9,
      "confidence": 35.98,
      "overall": 36.57
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 45.33,
      "securityRubricPass": 54.53,
      "safetyGateScore": 43.84,
      "tutorCoverageScore": 39.05,
      "orchestrationLift": 11.07,
      "lessonStability": 44.02,
      "confidence": 54.97,
      "overall": 47.06
    }
  },
  {
    "id": "std-004",
    "input": {
      "vulnComplexity": 0.26,
      "rubricItemCount": 5,
      "tutorCoverage": 0.24,
      "orchestrationRounds": 5,
      "pedagogyDepth": 0.19,
      "threatCoverage": 0.28,
      "safetyGateStrength": 0.25,
      "studentRiskLevel": 0.19,
      "exploitHintRisk": 0.12,
      "explainerSpecialization": 0.24,
      "safetySpecialization": 0.25,
      "rubricSpecialization": 0.27,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 44.14,
      "securityRubricPass": 34.54,
      "safetyGateScore": 42.73,
      "tutorCoverageScore": 29.71,
      "orchestrationLift": 64.6,
      "lessonStability": 37.16,
      "confidence": 43.44,
      "overall": 41.28
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 42.99,
      "securityRubricPass": 52.03,
      "safetyGateScore": 43.43,
      "tutorCoverageScore": 37.96,
      "orchestrationLift": 11.51,
      "lessonStability": 41.58,
      "confidence": 52.32,
      "overall": 45
    }
  },
  {
    "id": "std-005",
    "input": {
      "vulnComplexity": 0.2,
      "rubricItemCount": 6,
      "tutorCoverage": 0.29,
      "orchestrationRounds": 6,
      "pedagogyDepth": 0.25,
      "threatCoverage": 0.32,
      "safetyGateStrength": 0.2,
      "studentRiskLevel": 0.23,
      "exploitHintRisk": 0.17,
      "explainerSpecialization": 0.28,
      "safetySpecialization": 0.3,
      "rubricSpecialization": 0.22,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 54.09,
      "securityRubricPass": 35.79,
      "safetyGateScore": 40.87,
      "tutorCoverageScore": 30.23,
      "orchestrationLift": 77.38,
      "lessonStability": 39.81,
      "confidence": 44.61,
      "overall": 45.11
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.09,
      "securityRubricPass": 52.2,
      "safetyGateScore": 40.79,
      "tutorCoverageScore": 39.14,
      "orchestrationLift": 12.18,
      "lessonStability": 42.43,
      "confidence": 54.76,
      "overall": 45.91
    }
  },
  {
    "id": "std-006",
    "input": {
      "vulnComplexity": 0.25,
      "rubricItemCount": 5,
      "tutorCoverage": 0.33,
      "orchestrationRounds": 7,
      "pedagogyDepth": 0.21,
      "threatCoverage": 0.25,
      "safetyGateStrength": 0.24,
      "studentRiskLevel": 0.27,
      "exploitHintRisk": 0.21,
      "explainerSpecialization": 0.32,
      "safetySpecialization": 0.27,
      "rubricSpecialization": 0.26,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 52.73,
      "securityRubricPass": 32.26,
      "safetyGateScore": 39.14,
      "tutorCoverageScore": 35.82,
      "orchestrationLift": 85.82,
      "lessonStability": 36.76,
      "confidence": 53.81,
      "overall": 44.83
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 42.44,
      "securityRubricPass": 50.1,
      "safetyGateScore": 39.05,
      "tutorCoverageScore": 39.87,
      "orchestrationLift": 12.34,
      "lessonStability": 39.36,
      "confidence": 52.62,
      "overall": 43.34
    }
  },
  {
    "id": "std-007",
    "input": {
      "vulnComplexity": 0.3,
      "rubricItemCount": 6,
      "tutorCoverage": 0.37,
      "orchestrationRounds": 8,
      "pedagogyDepth": 0.27,
      "threatCoverage": 0.29,
      "safetyGateStrength": 0.28,
      "studentRiskLevel": 0.2,
      "exploitHintRisk": 0.26,
      "explainerSpecialization": 0.36,
      "safetySpecialization": 0.32,
      "rubricSpecialization": 0.3,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 64.63,
      "securityRubricPass": 37.59,
      "safetyGateScore": 41.88,
      "tutorCoverageScore": 36.74,
      "orchestrationLift": 98.85,
      "lessonStability": 44.15,
      "confidence": 57.54,
      "overall": 51.57
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.53,
      "securityRubricPass": 51.1,
      "safetyGateScore": 37.77,
      "tutorCoverageScore": 40.86,
      "orchestrationLift": 12.94,
      "lessonStability": 42.17,
      "confidence": 55,
      "overall": 45.37
    }
  },
  {
    "id": "std-008",
    "input": {
      "vulnComplexity": 0.34,
      "rubricItemCount": 8,
      "tutorCoverage": 0.34,
      "orchestrationRounds": 1,
      "pedagogyDepth": 0.32,
      "threatCoverage": 0.33,
      "safetyGateStrength": 0.33,
      "studentRiskLevel": 0.24,
      "exploitHintRisk": 0.22,
      "explainerSpecialization": 0.33,
      "safetySpecialization": 0.37,
      "rubricSpecialization": 0.35,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 39.59,
      "securityRubricPass": 43.96,
      "safetyGateScore": 45.46,
      "tutorCoverageScore": 38.83,
      "orchestrationLift": 31.59,
      "lessonStability": 37.67,
      "confidence": 33.54,
      "overall": 40.89
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.26,
      "securityRubricPass": 48.74,
      "safetyGateScore": 47.17,
      "tutorCoverageScore": 39.95,
      "orchestrationLift": 7.82,
      "lessonStability": 39.82,
      "confidence": 52.39,
      "overall": 44.78
    }
  },
  {
    "id": "std-009",
    "input": {
      "vulnComplexity": 0.39,
      "rubricItemCount": 6,
      "tutorCoverage": 0.38,
      "orchestrationRounds": 2,
      "pedagogyDepth": 0.29,
      "threatCoverage": 0.38,
      "safetyGateStrength": 0.37,
      "studentRiskLevel": 0.28,
      "exploitHintRisk": 0.27,
      "explainerSpecialization": 0.37,
      "safetySpecialization": 0.34,
      "rubricSpecialization": 0.39,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 43.72,
      "securityRubricPass": 43.8,
      "safetyGateScore": 47.11,
      "tutorCoverageScore": 38.55,
      "orchestrationLift": 40.71,
      "lessonStability": 38.7,
      "confidence": 36.75,
      "overall": 43.16
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 45.37,
      "securityRubricPass": 51.41,
      "safetyGateScore": 45.71,
      "tutorCoverageScore": 40.86,
      "orchestrationLift": 8.29,
      "lessonStability": 40.5,
      "confidence": 54.6,
      "overall": 45.86
    }
  },
  {
    "id": "std-010",
    "input": {
      "vulnComplexity": 0.34,
      "rubricItemCount": 8,
      "tutorCoverage": 0.43,
      "orchestrationRounds": 3,
      "pedagogyDepth": 0.34,
      "threatCoverage": 0.42,
      "safetyGateStrength": 0.32,
      "studentRiskLevel": 0.32,
      "exploitHintRisk": 0.31,
      "explainerSpecialization": 0.41,
      "safetySpecialization": 0.39,
      "rubricSpecialization": 0.34,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 48.49,
      "securityRubricPass": 44.83,
      "safetyGateScore": 43.09,
      "tutorCoverageScore": 45.03,
      "orchestrationLift": 53.04,
      "lessonStability": 38.76,
      "confidence": 43.92,
      "overall": 45.69
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.14,
      "securityRubricPass": 47.04,
      "safetyGateScore": 43.09,
      "tutorCoverageScore": 42,
      "orchestrationLift": 8.88,
      "lessonStability": 38.02,
      "confidence": 52.95,
      "overall": 43.45
    }
  },
  {
    "id": "std-011",
    "input": {
      "vulnComplexity": 0.38,
      "rubricItemCount": 10,
      "tutorCoverage": 0.47,
      "orchestrationRounds": 4,
      "pedagogyDepth": 0.4,
      "threatCoverage": 0.46,
      "safetyGateStrength": 0.36,
      "studentRiskLevel": 0.36,
      "exploitHintRisk": 0.36,
      "explainerSpecialization": 0.45,
      "safetySpecialization": 0.44,
      "rubricSpecialization": 0.38,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 58.8,
      "securityRubricPass": 51.58,
      "safetyGateScore": 45.74,
      "tutorCoverageScore": 45.79,
      "orchestrationLift": 65.66,
      "lessonStability": 44.65,
      "confidence": 47.64,
      "overall": 52.19
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.38,
      "securityRubricPass": 47.04,
      "safetyGateScore": 41.29,
      "tutorCoverageScore": 42.75,
      "orchestrationLift": 9.08,
      "lessonStability": 38.13,
      "confidence": 54.87,
      "overall": 43.98
    }
  },
  {
    "id": "std-012",
    "input": {
      "vulnComplexity": 0.43,
      "rubricItemCount": 8,
      "tutorCoverage": 0.44,
      "orchestrationRounds": 5,
      "pedagogyDepth": 0.36,
      "threatCoverage": 0.39,
      "safetyGateStrength": 0.41,
      "studentRiskLevel": 0.4,
      "exploitHintRisk": 0.32,
      "explainerSpecialization": 0.42,
      "safetySpecialization": 0.41,
      "rubricSpecialization": 0.43,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 56.12,
      "securityRubricPass": 47.73,
      "safetyGateScore": 46.92,
      "tutorCoverageScore": 46.72,
      "orchestrationLift": 73.41,
      "lessonStability": 42.68,
      "confidence": 55.13,
      "overall": 51.61
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 42.49,
      "securityRubricPass": 47.08,
      "safetyGateScore": 41.08,
      "tutorCoverageScore": 41.84,
      "orchestrationLift": 9.56,
      "lessonStability": 35.87,
      "confidence": 52.25,
      "overall": 42.21
    }
  },
  {
    "id": "std-013",
    "input": {
      "vulnComplexity": 0.47,
      "rubricItemCount": 10,
      "tutorCoverage": 0.48,
      "orchestrationRounds": 6,
      "pedagogyDepth": 0.42,
      "threatCoverage": 0.43,
      "safetyGateStrength": 0.45,
      "studentRiskLevel": 0.43,
      "exploitHintRisk": 0.37,
      "explainerSpecialization": 0.46,
      "safetySpecialization": 0.46,
      "rubricSpecialization": 0.47,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 67,
      "securityRubricPass": 54.57,
      "safetyGateScore": 49.7,
      "tutorCoverageScore": 47.49,
      "orchestrationLift": 86.07,
      "lessonStability": 48.97,
      "confidence": 58.85,
      "overall": 58.33
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.89,
      "securityRubricPass": 47.12,
      "safetyGateScore": 39.33,
      "tutorCoverageScore": 42.62,
      "orchestrationLift": 9.8,
      "lessonStability": 36.2,
      "confidence": 54.2,
      "overall": 42.86
    }
  },
  {
    "id": "std-014",
    "input": {
      "vulnComplexity": 0.52,
      "rubricItemCount": 11,
      "tutorCoverage": 0.52,
      "orchestrationRounds": 7,
      "pedagogyDepth": 0.47,
      "threatCoverage": 0.47,
      "safetyGateStrength": 0.49,
      "studentRiskLevel": 0.37,
      "exploitHintRisk": 0.41,
      "explainerSpecialization": 0.5,
      "safetySpecialization": 0.51,
      "rubricSpecialization": 0.51,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 72.01,
      "securityRubricPass": 58.02,
      "safetyGateScore": 50.14,
      "tutorCoverageScore": 54.41,
      "orchestrationLift": 98.72,
      "lessonStability": 52.43,
      "confidence": 68.58,
      "overall": 62.83
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.69,
      "securityRubricPass": 44.26,
      "safetyGateScore": 38.16,
      "tutorCoverageScore": 43.6,
      "orchestrationLift": 10.4,
      "lessonStability": 35.85,
      "confidence": 52.57,
      "overall": 41.82
    }
  },
  {
    "id": "std-015",
    "input": {
      "vulnComplexity": 0.47,
      "rubricItemCount": 10,
      "tutorCoverage": 0.57,
      "orchestrationRounds": 8,
      "pedagogyDepth": 0.44,
      "threatCoverage": 0.52,
      "safetyGateStrength": 0.44,
      "studentRiskLevel": 0.41,
      "exploitHintRisk": 0.46,
      "explainerSpecialization": 0.54,
      "safetySpecialization": 0.48,
      "rubricSpecialization": 0.46,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 74.86,
      "securityRubricPass": 55.73,
      "safetyGateScore": 47.56,
      "tutorCoverageScore": 53.83,
      "orchestrationLift": 100,
      "lessonStability": 51.03,
      "confidence": 69.23,
      "overall": 62.35
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.39,
      "securityRubricPass": 45.75,
      "safetyGateScore": 35.68,
      "tutorCoverageScore": 44.86,
      "orchestrationLift": 11.19,
      "lessonStability": 36.62,
      "confidence": 55.15,
      "overall": 42.67
    }
  },
  {
    "id": "std-016",
    "input": {
      "vulnComplexity": 0.51,
      "rubricItemCount": 11,
      "tutorCoverage": 0.53,
      "orchestrationRounds": 1,
      "pedagogyDepth": 0.49,
      "threatCoverage": 0.56,
      "safetyGateStrength": 0.48,
      "studentRiskLevel": 0.45,
      "exploitHintRisk": 0.42,
      "explainerSpecialization": 0.51,
      "safetySpecialization": 0.53,
      "rubricSpecialization": 0.5,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 51.74,
      "securityRubricPass": 59.88,
      "safetyGateScore": 50.39,
      "tutorCoverageScore": 55.26,
      "orchestrationLift": 40.53,
      "lessonStability": 44.34,
      "confidence": 44.69,
      "overall": 52.11
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.26,
      "securityRubricPass": 43.96,
      "safetyGateScore": 45.01,
      "tutorCoverageScore": 43.83,
      "orchestrationLift": 6.14,
      "lessonStability": 34.57,
      "confidence": 52.62,
      "overall": 42.32
    }
  },
  {
    "id": "std-017",
    "input": {
      "vulnComplexity": 0.56,
      "rubricItemCount": 13,
      "tutorCoverage": 0.58,
      "orchestrationRounds": 2,
      "pedagogyDepth": 0.55,
      "threatCoverage": 0.61,
      "safetyGateStrength": 0.53,
      "studentRiskLevel": 0.49,
      "exploitHintRisk": 0.47,
      "explainerSpecialization": 0.55,
      "safetySpecialization": 0.58,
      "rubricSpecialization": 0.55,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 62.52,
      "securityRubricPass": 67.54,
      "safetyGateScore": 53.93,
      "tutorCoverageScore": 56.7,
      "orchestrationLift": 53.27,
      "lessonStability": 50.97,
      "confidence": 48.96,
      "overall": 59.29
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.46,
      "securityRubricPass": 44.05,
      "safetyGateScore": 43.35,
      "tutorCoverageScore": 44.74,
      "orchestrationLift": 6.33,
      "lessonStability": 34.68,
      "confidence": 54.52,
      "overall": 42.89
    }
  },
  {
    "id": "std-018",
    "input": {
      "vulnComplexity": 0.61,
      "rubricItemCount": 11,
      "tutorCoverage": 0.62,
      "orchestrationRounds": 3,
      "pedagogyDepth": 0.51,
      "threatCoverage": 0.53,
      "safetyGateStrength": 0.57,
      "studentRiskLevel": 0.53,
      "exploitHintRisk": 0.51,
      "explainerSpecialization": 0.59,
      "safetySpecialization": 0.55,
      "rubricSpecialization": 0.59,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 60.57,
      "securityRubricPass": 61.79,
      "safetyGateScore": 51.61,
      "tutorCoverageScore": 62.3,
      "orchestrationLift": 61.76,
      "lessonStability": 46.81,
      "confidence": 58.16,
      "overall": 58.12
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 42.91,
      "securityRubricPass": 42.59,
      "safetyGateScore": 41.67,
      "tutorCoverageScore": 45.5,
      "orchestrationLift": 6.53,
      "lessonStability": 31.89,
      "confidence": 52.43,
      "overall": 40.6
    }
  },
  {
    "id": "std-019",
    "input": {
      "vulnComplexity": 0.65,
      "rubricItemCount": 13,
      "tutorCoverage": 0.66,
      "orchestrationRounds": 4,
      "pedagogyDepth": 0.57,
      "threatCoverage": 0.57,
      "safetyGateStrength": 0.61,
      "studentRiskLevel": 0.56,
      "exploitHintRisk": 0.56,
      "explainerSpecialization": 0.63,
      "safetySpecialization": 0.6,
      "rubricSpecialization": 0.63,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 71.81,
      "securityRubricPass": 68.82,
      "safetyGateScore": 54.62,
      "tutorCoverageScore": 63.07,
      "orchestrationLift": 74.41,
      "lessonStability": 53.38,
      "confidence": 61.89,
      "overall": 65.05
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 45.31,
      "securityRubricPass": 42.63,
      "safetyGateScore": 39.92,
      "tutorCoverageScore": 46.27,
      "orchestrationLift": 6.77,
      "lessonStability": 32.22,
      "confidence": 54.39,
      "overall": 41.24
    }
  },
  {
    "id": "std-020",
    "input": {
      "vulnComplexity": 0.6,
      "rubricItemCount": 14,
      "tutorCoverage": 0.63,
      "orchestrationRounds": 5,
      "pedagogyDepth": 0.62,
      "threatCoverage": 0.62,
      "safetyGateStrength": 0.56,
      "studentRiskLevel": 0.6,
      "exploitHintRisk": 0.52,
      "explainerSpecialization": 0.6,
      "safetySpecialization": 0.65,
      "rubricSpecialization": 0.58,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 73.87,
      "securityRubricPass": 69.24,
      "safetyGateScore": 52.96,
      "tutorCoverageScore": 64.23,
      "orchestrationLift": 85.94,
      "lessonStability": 53.72,
      "confidence": 66.79,
      "overall": 66.6
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 43.87,
      "securityRubricPass": 40.32,
      "safetyGateScore": 38.69,
      "tutorCoverageScore": 45.62,
      "orchestrationLift": 7.7,
      "lessonStability": 30.56,
      "confidence": 52.28,
      "overall": 39.59
    }
  },
  {
    "id": "std-021",
    "input": {
      "vulnComplexity": 0.64,
      "rubricItemCount": 13,
      "tutorCoverage": 0.67,
      "orchestrationRounds": 6,
      "pedagogyDepth": 0.59,
      "threatCoverage": 0.66,
      "safetyGateStrength": 0.6,
      "studentRiskLevel": 0.54,
      "exploitHintRisk": 0.57,
      "explainerSpecialization": 0.64,
      "safetySpecialization": 0.62,
      "rubricSpecialization": 0.62,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 81.2,
      "securityRubricPass": 70.99,
      "safetyGateScore": 55.14,
      "tutorCoverageScore": 64.07,
      "orchestrationLift": 95.35,
      "lessonStability": 57.93,
      "confidence": 70,
      "overall": 70.51
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.51,
      "securityRubricPass": 42.67,
      "safetyGateScore": 37.6,
      "tutorCoverageScore": 46.69,
      "orchestrationLift": 8.45,
      "lessonStability": 33.17,
      "confidence": 54.82,
      "overall": 41.53
    }
  },
  {
    "id": "std-022",
    "input": {
      "vulnComplexity": 0.69,
      "rubricItemCount": 15,
      "tutorCoverage": 0.72,
      "orchestrationRounds": 7,
      "pedagogyDepth": 0.64,
      "threatCoverage": 0.7,
      "safetyGateStrength": 0.65,
      "studentRiskLevel": 0.58,
      "exploitHintRisk": 0.61,
      "explainerSpecialization": 0.68,
      "safetySpecialization": 0.67,
      "rubricSpecialization": 0.67,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 81.99,
      "securityRubricPass": 75.94,
      "safetyGateScore": 55.54,
      "tutorCoverageScore": 71.5,
      "orchestrationLift": 100,
      "lessonStability": 59.06,
      "confidence": 80.27,
      "overall": 73.43
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.55,
      "securityRubricPass": 38.91,
      "safetyGateScore": 36.07,
      "tutorCoverageScore": 47.6,
      "orchestrationLift": 8.65,
      "lessonStability": 30.31,
      "confidence": 52.73,
      "overall": 39.12
    }
  },
  {
    "id": "std-023",
    "input": {
      "vulnComplexity": 0.74,
      "rubricItemCount": 16,
      "tutorCoverage": 0.76,
      "orchestrationRounds": 8,
      "pedagogyDepth": 0.7,
      "threatCoverage": 0.75,
      "safetyGateStrength": 0.69,
      "studentRiskLevel": 0.62,
      "exploitHintRisk": 0.66,
      "explainerSpecialization": 0.72,
      "safetySpecialization": 0.72,
      "rubricSpecialization": 0.71,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 89.64,
      "securityRubricPass": 81.79,
      "safetyGateScore": 58.86,
      "tutorCoverageScore": 72.28,
      "orchestrationLift": 100,
      "lessonStability": 63.85,
      "confidence": 83.99,
      "overall": 77.87
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.89,
      "securityRubricPass": 39.56,
      "safetyGateScore": 34.34,
      "tutorCoverageScore": 48.39,
      "orchestrationLift": 8.9,
      "lessonStability": 30.7,
      "confidence": 54.7,
      "overall": 39.93
    }
  },
  {
    "id": "std-024",
    "input": {
      "vulnComplexity": 0.78,
      "rubricItemCount": 15,
      "tutorCoverage": 0.73,
      "orchestrationRounds": 1,
      "pedagogyDepth": 0.66,
      "threatCoverage": 0.67,
      "safetyGateStrength": 0.74,
      "studentRiskLevel": 0.66,
      "exploitHintRisk": 0.62,
      "explainerSpecialization": 0.69,
      "safetySpecialization": 0.69,
      "rubricSpecialization": 0.76,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 63.92,
      "securityRubricPass": 78.83,
      "safetyGateScore": 59.36,
      "tutorCoverageScore": 73.19,
      "orchestrationLift": 49.32,
      "lessonStability": 53.2,
      "confidence": 59.48,
      "overall": 65.29
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 42.89,
      "securityRubricPass": 38.95,
      "safetyGateScore": 43.66,
      "tutorCoverageScore": 47.45,
      "orchestrationLift": 3.73,
      "lessonStability": 28.15,
      "confidence": 52.02,
      "overall": 39.22
    }
  },
  {
    "id": "std-025",
    "input": {
      "vulnComplexity": 0.73,
      "rubricItemCount": 16,
      "tutorCoverage": 0.77,
      "orchestrationRounds": 2,
      "pedagogyDepth": 0.72,
      "threatCoverage": 0.71,
      "safetyGateStrength": 0.68,
      "studentRiskLevel": 0.69,
      "exploitHintRisk": 0.67,
      "explainerSpecialization": 0.73,
      "safetySpecialization": 0.74,
      "rubricSpecialization": 0.7,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 75.16,
      "securityRubricPass": 80.2,
      "safetyGateScore": 57.75,
      "tutorCoverageScore": 73.02,
      "orchestrationLift": 61.95,
      "lessonStability": 56.57,
      "confidence": 60.1,
      "overall": 69.47
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 46.08,
      "securityRubricPass": 39.01,
      "safetyGateScore": 40.85,
      "tutorCoverageScore": 48.47,
      "orchestrationLift": 4.39,
      "lessonStability": 29.12,
      "confidence": 54.46,
      "overall": 40.12
    }
  },
  {
    "id": "std-026",
    "input": {
      "vulnComplexity": 0.78,
      "rubricItemCount": 18,
      "tutorCoverage": 0.81,
      "orchestrationRounds": 3,
      "pedagogyDepth": 0.77,
      "threatCoverage": 0.76,
      "safetyGateStrength": 0.72,
      "studentRiskLevel": 0.73,
      "exploitHintRisk": 0.71,
      "explainerSpecialization": 0.77,
      "safetySpecialization": 0.79,
      "rubricSpecialization": 0.74,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 78.22,
      "securityRubricPass": 84.84,
      "safetyGateScore": 57.59,
      "tutorCoverageScore": 79.78,
      "orchestrationLift": 74.22,
      "lessonStability": 58.29,
      "confidence": 69.83,
      "overall": 73.46
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.17,
      "securityRubricPass": 35.17,
      "safetyGateScore": 39.19,
      "tutorCoverageScore": 49.23,
      "orchestrationLift": 4.61,
      "lessonStability": 26.26,
      "confidence": 52.39,
      "overall": 37.67
    }
  },
  {
    "id": "std-027",
    "input": {
      "vulnComplexity": 0.82,
      "rubricItemCount": 16,
      "tutorCoverage": 0.86,
      "orchestrationRounds": 4,
      "pedagogyDepth": 0.74,
      "threatCoverage": 0.8,
      "safetyGateStrength": 0.77,
      "studentRiskLevel": 0.77,
      "exploitHintRisk": 0.76,
      "explainerSpecialization": 0.81,
      "safetySpecialization": 0.76,
      "rubricSpecialization": 0.79,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 84.94,
      "securityRubricPass": 85.42,
      "safetyGateScore": 60.35,
      "tutorCoverageScore": 80.19,
      "orchestrationLift": 83.5,
      "lessonStability": 60.88,
      "confidence": 73.58,
      "overall": 77.01
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 45.31,
      "securityRubricPass": 37.95,
      "safetyGateScore": 37.92,
      "tutorCoverageScore": 50.31,
      "orchestrationLift": 5.09,
      "lessonStability": 27,
      "confidence": 54.62,
      "overall": 38.85
    }
  },
  {
    "id": "std-028",
    "input": {
      "vulnComplexity": 0.87,
      "rubricItemCount": 18,
      "tutorCoverage": 0.82,
      "orchestrationRounds": 5,
      "pedagogyDepth": 0.79,
      "threatCoverage": 0.84,
      "safetyGateStrength": 0.81,
      "studentRiskLevel": 0.71,
      "exploitHintRisk": 0.72,
      "explainerSpecialization": 0.78,
      "safetySpecialization": 0.81,
      "rubricSpecialization": 0.83,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 87.46,
      "securityRubricPass": 90.95,
      "safetyGateScore": 62.81,
      "tutorCoverageScore": 81.72,
      "orchestrationLift": 95.18,
      "lessonStability": 65.46,
      "confidence": 81.04,
      "overall": 81.2
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.59,
      "securityRubricPass": 35.79,
      "safetyGateScore": 37.94,
      "tutorCoverageScore": 49.42,
      "orchestrationLift": 5.87,
      "lessonStability": 26.78,
      "confidence": 52.35,
      "overall": 37.92
    }
  },
  {
    "id": "std-029",
    "input": {
      "vulnComplexity": 0.91,
      "rubricItemCount": 19,
      "tutorCoverage": 0.87,
      "orchestrationRounds": 6,
      "pedagogyDepth": 0.85,
      "threatCoverage": 0.89,
      "safetyGateStrength": 0.86,
      "studentRiskLevel": 0.75,
      "exploitHintRisk": 0.77,
      "explainerSpecialization": 0.82,
      "safetySpecialization": 0.86,
      "rubricSpecialization": 0.88,
      "profile": "strict"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 98.28,
      "securityRubricPass": 97.52,
      "safetyGateScore": 66.96,
      "tutorCoverageScore": 83.2,
      "orchestrationLift": 100,
      "lessonStability": 71.94,
      "confidence": 85.31,
      "overall": 87.46
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 47,
      "securityRubricPass": 36.58,
      "safetyGateScore": 36.42,
      "tutorCoverageScore": 50.39,
      "orchestrationLift": 6.16,
      "lessonStability": 27.28,
      "confidence": 54.37,
      "overall": 38.86
    }
  },
  {
    "id": "std-030",
    "input": {
      "vulnComplexity": 0.86,
      "rubricItemCount": 18,
      "tutorCoverage": 0.91,
      "orchestrationRounds": 7,
      "pedagogyDepth": 0.81,
      "threatCoverage": 0.81,
      "safetyGateStrength": 0.8,
      "studentRiskLevel": 0.78,
      "exploitHintRisk": 0.81,
      "explainerSpecialization": 0.86,
      "safetySpecialization": 0.84,
      "rubricSpecialization": 0.82,
      "profile": "guided"
    },
    "expectedOrchestrated": {
      "mode": "orchestrated",
      "pedagogyFit": 91.12,
      "securityRubricPass": 88.81,
      "safetyGateScore": 59.4,
      "tutorCoverageScore": 87.98,
      "orchestrationLift": 100,
      "lessonStability": 63.4,
      "confidence": 91.48,
      "overall": 81.88
    },
    "expectedSingle": {
      "mode": "single",
      "pedagogyFit": 44.21,
      "securityRubricPass": 33.89,
      "safetyGateScore": 33.6,
      "tutorCoverageScore": 51.35,
      "orchestrationLift": 6.73,
      "lessonStability": 24.79,
      "confidence": 52.69,
      "overall": 36.38
    }
  }
];
