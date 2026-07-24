import type { PlanInput, PlanQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PlanInput;
  expectedMulti: PlanQuality;
  expectedSingle: PlanQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "domainComplexity": 0.13,
      "constraintCount": 3,
      "roleCoverage": 0.19,
      "coordinationRounds": 2,
      "conflictResolutionDepth": 0.12,
      "capacityTightness": 0.15,
      "demandVolatility": 0.07,
      "crossDomainLinks": 1,
      "auditTrailStrictness": 0.12,
      "plannerSpecialization": 0.19,
      "allocatorSpecialization": 0.18,
      "reviewerSpecialization": 0.14,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 37.38,
      "constraintSatisfaction": 20.86,
      "conflictResolution": 20.05,
      "roleCoverageScore": 20.63,
      "coordinationLift": 32.87,
      "planStability": 24.69,
      "confidence": 22.52,
      "overall": 27.08
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 58.68,
      "constraintSatisfaction": 59.63,
      "conflictResolution": 48.06,
      "roleCoverageScore": 36.23,
      "coordinationLift": 9.97,
      "planStability": 59.87,
      "confidence": 56.22,
      "overall": 56.79
    }
  },
  {
    "id": "std-002",
    "input": {
      "domainComplexity": 0.18,
      "constraintCount": 5,
      "roleCoverage": 0.23,
      "coordinationRounds": 3,
      "conflictResolutionDepth": 0.17,
      "capacityTightness": 0.19,
      "demandVolatility": 0.11,
      "crossDomainLinks": 2,
      "auditTrailStrictness": 0.16,
      "plannerSpecialization": 0.23,
      "allocatorSpecialization": 0.23,
      "reviewerSpecialization": 0.18,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 41.3,
      "constraintSatisfaction": 23.36,
      "conflictResolution": 28.04,
      "roleCoverageScore": 28.14,
      "coordinationLift": 45.05,
      "planStability": 26.97,
      "confidence": 33.5,
      "overall": 32.6
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 52.01,
      "constraintSatisfaction": 54.67,
      "conflictResolution": 45.95,
      "roleCoverageScore": 36.77,
      "coordinationLift": 9.9,
      "planStability": 53.81,
      "confidence": 53.47,
      "overall": 51.65
    }
  },
  {
    "id": "std-003",
    "input": {
      "domainComplexity": 0.22,
      "constraintCount": 3,
      "roleCoverage": 0.28,
      "coordinationRounds": 4,
      "conflictResolutionDepth": 0.14,
      "capacityTightness": 0.24,
      "demandVolatility": 0.15,
      "crossDomainLinks": 3,
      "auditTrailStrictness": 0.21,
      "plannerSpecialization": 0.27,
      "allocatorSpecialization": 0.2,
      "reviewerSpecialization": 0.23,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 45.55,
      "constraintSatisfaction": 22.38,
      "conflictResolution": 32.77,
      "roleCoverageScore": 27.58,
      "coordinationLift": 54.3,
      "planStability": 27.35,
      "confidence": 36.53,
      "overall": 35.38
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 55.23,
      "constraintSatisfaction": 58.13,
      "conflictResolution": 43.82,
      "roleCoverageScore": 37.86,
      "coordinationLift": 10.38,
      "planStability": 55.6,
      "confidence": 55.54,
      "overall": 53.99
    }
  },
  {
    "id": "std-004",
    "input": {
      "domainComplexity": 0.27,
      "constraintCount": 5,
      "roleCoverage": 0.24,
      "coordinationRounds": 5,
      "conflictResolutionDepth": 0.19,
      "capacityTightness": 0.28,
      "demandVolatility": 0.19,
      "crossDomainLinks": 4,
      "auditTrailStrictness": 0.25,
      "plannerSpecialization": 0.24,
      "allocatorSpecialization": 0.25,
      "reviewerSpecialization": 0.27,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 47.06,
      "constraintSatisfaction": 24.83,
      "conflictResolution": 39.82,
      "roleCoverageScore": 29.48,
      "coordinationLift": 65.26,
      "planStability": 28.41,
      "confidence": 44.99,
      "overall": 39.15
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 47.72,
      "constraintSatisfaction": 53.18,
      "conflictResolution": 41.71,
      "roleCoverageScore": 36.26,
      "coordinationLift": 10.31,
      "planStability": 49.16,
      "confidence": 51.82,
      "overall": 48.36
    }
  },
  {
    "id": "std-005",
    "input": {
      "domainComplexity": 0.21,
      "constraintCount": 6,
      "roleCoverage": 0.29,
      "coordinationRounds": 6,
      "conflictResolutionDepth": 0.25,
      "capacityTightness": 0.32,
      "demandVolatility": 0.23,
      "crossDomainLinks": 5,
      "auditTrailStrictness": 0.2,
      "plannerSpecialization": 0.28,
      "allocatorSpecialization": 0.3,
      "reviewerSpecialization": 0.22,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 54.59,
      "constraintSatisfaction": 25.77,
      "conflictResolution": 48.91,
      "roleCoverageScore": 28.89,
      "coordinationLift": 78.08,
      "planStability": 31.86,
      "confidence": 45.2,
      "overall": 44.68
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 49.05,
      "constraintSatisfaction": 52.96,
      "conflictResolution": 40.32,
      "roleCoverageScore": 37.35,
      "coordinationLift": 10.79,
      "planStability": 48.82,
      "confidence": 53.91,
      "overall": 48.6
    }
  },
  {
    "id": "std-006",
    "input": {
      "domainComplexity": 0.26,
      "constraintCount": 5,
      "roleCoverage": 0.33,
      "coordinationRounds": 7,
      "conflictResolutionDepth": 0.21,
      "capacityTightness": 0.25,
      "demandVolatility": 0.27,
      "crossDomainLinks": 0,
      "auditTrailStrictness": 0.24,
      "plannerSpecialization": 0.32,
      "allocatorSpecialization": 0.27,
      "reviewerSpecialization": 0.26,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 58.07,
      "constraintSatisfaction": 25.67,
      "conflictResolution": 53.59,
      "roleCoverageScore": 36.42,
      "coordinationLift": 88.48,
      "planStability": 41.83,
      "confidence": 55.64,
      "overall": 49.33
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 51.36,
      "constraintSatisfaction": 53.5,
      "conflictResolution": 39.94,
      "roleCoverageScore": 39.29,
      "coordinationLift": 12.82,
      "planStability": 50.47,
      "confidence": 54.31,
      "overall": 49.96
    }
  },
  {
    "id": "std-007",
    "input": {
      "domainComplexity": 0.31,
      "constraintCount": 6,
      "roleCoverage": 0.37,
      "coordinationRounds": 8,
      "conflictResolutionDepth": 0.27,
      "capacityTightness": 0.29,
      "demandVolatility": 0.2,
      "crossDomainLinks": 1,
      "auditTrailStrictness": 0.28,
      "plannerSpecialization": 0.36,
      "allocatorSpecialization": 0.32,
      "reviewerSpecialization": 0.3,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 66.97,
      "constraintSatisfaction": 31.17,
      "conflictResolution": 63.11,
      "roleCoverageScore": 36.1,
      "coordinationLift": 100,
      "planStability": 49.08,
      "confidence": 58.62,
      "overall": 56.59
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 52.19,
      "constraintSatisfaction": 55,
      "conflictResolution": 38.31,
      "roleCoverageScore": 40.06,
      "coordinationLift": 13.1,
      "planStability": 51.98,
      "confidence": 56.09,
      "overall": 50.88
    }
  },
  {
    "id": "std-008",
    "input": {
      "domainComplexity": 0.35,
      "constraintCount": 8,
      "roleCoverage": 0.34,
      "coordinationRounds": 1,
      "conflictResolutionDepth": 0.32,
      "capacityTightness": 0.33,
      "demandVolatility": 0.24,
      "crossDomainLinks": 2,
      "auditTrailStrictness": 0.33,
      "plannerSpecialization": 0.33,
      "allocatorSpecialization": 0.37,
      "reviewerSpecialization": 0.35,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 42.42,
      "constraintSatisfaction": 33.75,
      "conflictResolution": 26.15,
      "roleCoverageScore": 38.71,
      "coordinationLift": 32.66,
      "planStability": 28.76,
      "confidence": 35.66,
      "overall": 35.03
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 44.78,
      "constraintSatisfaction": 50.19,
      "conflictResolution": 48.24,
      "roleCoverageScore": 38.66,
      "coordinationLift": 6.67,
      "planStability": 45.67,
      "confidence": 52.42,
      "overall": 46.56
    }
  },
  {
    "id": "std-009",
    "input": {
      "domainComplexity": 0.4,
      "constraintCount": 6,
      "roleCoverage": 0.38,
      "coordinationRounds": 2,
      "conflictResolutionDepth": 0.29,
      "capacityTightness": 0.38,
      "demandVolatility": 0.28,
      "crossDomainLinks": 3,
      "auditTrailStrictness": 0.37,
      "plannerSpecialization": 0.37,
      "allocatorSpecialization": 0.34,
      "reviewerSpecialization": 0.39,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 46.55,
      "constraintSatisfaction": 32.69,
      "conflictResolution": 30.94,
      "roleCoverageScore": 37.43,
      "coordinationLift": 41.72,
      "planStability": 29.08,
      "confidence": 38.1,
      "overall": 37.65
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 47.91,
      "constraintSatisfaction": 53.5,
      "conflictResolution": 46.07,
      "roleCoverageScore": 39.54,
      "coordinationLift": 7.1,
      "planStability": 47.34,
      "confidence": 54.43,
      "overall": 48.79
    }
  },
  {
    "id": "std-010",
    "input": {
      "domainComplexity": 0.34,
      "constraintCount": 8,
      "roleCoverage": 0.43,
      "coordinationRounds": 3,
      "conflictResolutionDepth": 0.34,
      "capacityTightness": 0.42,
      "demandVolatility": 0.32,
      "crossDomainLinks": 4,
      "auditTrailStrictness": 0.32,
      "plannerSpecialization": 0.41,
      "allocatorSpecialization": 0.39,
      "reviewerSpecialization": 0.34,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 48.55,
      "constraintSatisfaction": 31.42,
      "conflictResolution": 38.48,
      "roleCoverageScore": 44.78,
      "coordinationLift": 54.01,
      "planStability": 29.16,
      "confidence": 46.31,
      "overall": 41.48
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 42.22,
      "constraintSatisfaction": 48.21,
      "conflictResolution": 44.45,
      "roleCoverageScore": 40.54,
      "coordinationLift": 7.46,
      "planStability": 41.95,
      "confidence": 52.32,
      "overall": 44.09
    }
  },
  {
    "id": "std-011",
    "input": {
      "domainComplexity": 0.39,
      "constraintCount": 10,
      "roleCoverage": 0.47,
      "coordinationRounds": 4,
      "conflictResolutionDepth": 0.4,
      "capacityTightness": 0.46,
      "demandVolatility": 0.36,
      "crossDomainLinks": 5,
      "auditTrailStrictness": 0.36,
      "plannerSpecialization": 0.45,
      "allocatorSpecialization": 0.44,
      "reviewerSpecialization": 0.38,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 57.85,
      "constraintSatisfaction": 37,
      "conflictResolution": 47.87,
      "roleCoverageScore": 44.29,
      "coordinationLift": 66.58,
      "planStability": 35.02,
      "confidence": 49.29,
      "overall": 48.84
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 41.56,
      "constraintSatisfaction": 47.25,
      "conflictResolution": 42.42,
      "roleCoverageScore": 41.08,
      "coordinationLift": 7.39,
      "planStability": 40,
      "confidence": 53.58,
      "overall": 43.01
    }
  },
  {
    "id": "std-012",
    "input": {
      "domainComplexity": 0.43,
      "constraintCount": 8,
      "roleCoverage": 0.44,
      "coordinationRounds": 5,
      "conflictResolutionDepth": 0.36,
      "capacityTightness": 0.39,
      "demandVolatility": 0.4,
      "crossDomainLinks": 0,
      "auditTrailStrictness": 0.41,
      "plannerSpecialization": 0.42,
      "allocatorSpecialization": 0.41,
      "reviewerSpecialization": 0.43,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 59.19,
      "constraintSatisfaction": 36.06,
      "conflictResolution": 51.7,
      "roleCoverageScore": 46.98,
      "coordinationLift": 76.1,
      "planStability": 43.62,
      "confidence": 57.8,
      "overall": 51.76
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 44.13,
      "constraintSatisfaction": 49.02,
      "conflictResolution": 42.23,
      "roleCoverageScore": 41.18,
      "coordinationLift": 9.59,
      "planStability": 42.34,
      "confidence": 53.26,
      "overall": 44.87
    }
  },
  {
    "id": "std-013",
    "input": {
      "domainComplexity": 0.48,
      "constraintCount": 10,
      "roleCoverage": 0.48,
      "coordinationRounds": 6,
      "conflictResolutionDepth": 0.42,
      "capacityTightness": 0.43,
      "demandVolatility": 0.43,
      "crossDomainLinks": 1,
      "auditTrailStrictness": 0.45,
      "plannerSpecialization": 0.46,
      "allocatorSpecialization": 0.46,
      "reviewerSpecialization": 0.47,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 69.11,
      "constraintSatisfaction": 41.89,
      "conflictResolution": 61.15,
      "roleCoverageScore": 46.5,
      "coordinationLift": 88.69,
      "planStability": 49.97,
      "confidence": 60.78,
      "overall": 59.41
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 43.5,
      "constraintSatisfaction": 48.19,
      "conflictResolution": 40.22,
      "roleCoverageScore": 41.73,
      "coordinationLift": 9.54,
      "planStability": 40.61,
      "confidence": 54.55,
      "overall": 43.89
    }
  },
  {
    "id": "std-014",
    "input": {
      "domainComplexity": 0.53,
      "constraintCount": 11,
      "roleCoverage": 0.52,
      "coordinationRounds": 7,
      "conflictResolutionDepth": 0.47,
      "capacityTightness": 0.47,
      "demandVolatility": 0.37,
      "crossDomainLinks": 2,
      "auditTrailStrictness": 0.49,
      "plannerSpecialization": 0.5,
      "allocatorSpecialization": 0.51,
      "reviewerSpecialization": 0.51,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 70.55,
      "constraintSatisfaction": 43.68,
      "conflictResolution": 68.98,
      "roleCoverageScore": 54.17,
      "coordinationLift": 100,
      "planStability": 52.37,
      "confidence": 71.76,
      "overall": 63.96
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 38.29,
      "constraintSatisfaction": 45.56,
      "conflictResolution": 38.49,
      "roleCoverageScore": 42.49,
      "coordinationLift": 9.79,
      "planStability": 37.79,
      "confidence": 52.29,
      "overall": 40.64
    }
  },
  {
    "id": "std-015",
    "input": {
      "domainComplexity": 0.47,
      "constraintCount": 10,
      "roleCoverage": 0.57,
      "coordinationRounds": 8,
      "conflictResolutionDepth": 0.44,
      "capacityTightness": 0.52,
      "demandVolatility": 0.41,
      "crossDomainLinks": 3,
      "auditTrailStrictness": 0.44,
      "plannerSpecialization": 0.54,
      "allocatorSpecialization": 0.48,
      "reviewerSpecialization": 0.46,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 72.54,
      "constraintSatisfaction": 40.48,
      "conflictResolution": 73.7,
      "roleCoverageScore": 52.67,
      "coordinationLift": 100,
      "planStability": 51.07,
      "confidence": 71.42,
      "overall": 64.22
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 41.4,
      "constraintSatisfaction": 47.46,
      "conflictResolution": 36.66,
      "roleCoverageScore": 43.74,
      "coordinationLift": 10.52,
      "planStability": 39.19,
      "confidence": 54.74,
      "overall": 42.44
    }
  },
  {
    "id": "std-016",
    "input": {
      "domainComplexity": 0.52,
      "constraintCount": 11,
      "roleCoverage": 0.53,
      "coordinationRounds": 1,
      "conflictResolutionDepth": 0.49,
      "capacityTightness": 0.56,
      "demandVolatility": 0.45,
      "crossDomainLinks": 4,
      "auditTrailStrictness": 0.48,
      "plannerSpecialization": 0.51,
      "allocatorSpecialization": 0.53,
      "reviewerSpecialization": 0.5,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 49.28,
      "constraintSatisfaction": 41.35,
      "conflictResolution": 36.46,
      "roleCoverageScore": 54.63,
      "coordinationLift": 41.43,
      "planStability": 30.6,
      "confidence": 47.88,
      "overall": 43.53
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 34.9,
      "constraintSatisfaction": 43.58,
      "conflictResolution": 46.7,
      "roleCoverageScore": 42.23,
      "coordinationLift": 4.18,
      "planStability": 33.69,
      "confidence": 51.21,
      "overall": 38.88
    }
  },
  {
    "id": "std-017",
    "input": {
      "domainComplexity": 0.56,
      "constraintCount": 13,
      "roleCoverage": 0.58,
      "coordinationRounds": 2,
      "conflictResolutionDepth": 0.55,
      "capacityTightness": 0.61,
      "demandVolatility": 0.49,
      "crossDomainLinks": 5,
      "auditTrailStrictness": 0.53,
      "plannerSpecialization": 0.55,
      "allocatorSpecialization": 0.58,
      "reviewerSpecialization": 0.55,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 59.04,
      "constraintSatisfaction": 47.63,
      "conflictResolution": 46.16,
      "roleCoverageScore": 54.84,
      "coordinationLift": 54.17,
      "planStability": 36.97,
      "confidence": 51.45,
      "overall": 51.39
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 34.09,
      "constraintSatisfaction": 42.74,
      "conflictResolution": 44.68,
      "roleCoverageScore": 42.96,
      "coordinationLift": 4.13,
      "planStability": 31.72,
      "confidence": 52.49,
      "overall": 37.8
    }
  },
  {
    "id": "std-018",
    "input": {
      "domainComplexity": 0.61,
      "constraintCount": 11,
      "roleCoverage": 0.62,
      "coordinationRounds": 3,
      "conflictResolutionDepth": 0.51,
      "capacityTightness": 0.53,
      "demandVolatility": 0.53,
      "crossDomainLinks": 0,
      "auditTrailStrictness": 0.57,
      "plannerSpecialization": 0.59,
      "allocatorSpecialization": 0.55,
      "reviewerSpecialization": 0.59,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 61.73,
      "constraintSatisfaction": 45.99,
      "conflictResolution": 50.53,
      "roleCoverageScore": 62.45,
      "coordinationLift": 64.74,
      "planStability": 46,
      "confidence": 61.89,
      "overall": 55.35
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 37.64,
      "constraintSatisfaction": 44.39,
      "conflictResolution": 44.48,
      "roleCoverageScore": 45,
      "coordinationLift": 6.32,
      "planStability": 34.45,
      "confidence": 53.13,
      "overall": 40.15
    }
  },
  {
    "id": "std-019",
    "input": {
      "domainComplexity": 0.66,
      "constraintCount": 13,
      "roleCoverage": 0.66,
      "coordinationRounds": 4,
      "conflictResolutionDepth": 0.57,
      "capacityTightness": 0.57,
      "demandVolatility": 0.56,
      "crossDomainLinks": 1,
      "auditTrailStrictness": 0.61,
      "plannerSpecialization": 0.63,
      "allocatorSpecialization": 0.6,
      "reviewerSpecialization": 0.63,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 72.02,
      "constraintSatisfaction": 52.2,
      "conflictResolution": 60.22,
      "roleCoverageScore": 61.96,
      "coordinationLift": 77.34,
      "planStability": 52.69,
      "confidence": 64.87,
      "overall": 63.26
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 37.02,
      "constraintSatisfaction": 43.56,
      "conflictResolution": 42.47,
      "roleCoverageScore": 45.56,
      "coordinationLift": 6.27,
      "planStability": 32.73,
      "confidence": 54.42,
      "overall": 39.18
    }
  },
  {
    "id": "std-020",
    "input": {
      "domainComplexity": 0.6,
      "constraintCount": 14,
      "roleCoverage": 0.63,
      "coordinationRounds": 5,
      "conflictResolutionDepth": 0.62,
      "capacityTightness": 0.62,
      "demandVolatility": 0.6,
      "crossDomainLinks": 2,
      "auditTrailStrictness": 0.56,
      "plannerSpecialization": 0.6,
      "allocatorSpecialization": 0.65,
      "reviewerSpecialization": 0.58,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 69.95,
      "constraintSatisfaction": 49.14,
      "conflictResolution": 66.62,
      "roleCoverageScore": 63.75,
      "coordinationLift": 88.51,
      "planStability": 50.23,
      "confidence": 70.56,
      "overall": 64.33
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 31.27,
      "constraintSatisfaction": 39.3,
      "conflictResolution": 40.98,
      "roleCoverageScore": 44.49,
      "coordinationLift": 6.73,
      "planStability": 27.77,
      "confidence": 51.49,
      "overall": 34.74
    }
  },
  {
    "id": "std-021",
    "input": {
      "domainComplexity": 0.65,
      "constraintCount": 13,
      "roleCoverage": 0.67,
      "coordinationRounds": 6,
      "conflictResolutionDepth": 0.59,
      "capacityTightness": 0.66,
      "demandVolatility": 0.54,
      "crossDomainLinks": 3,
      "auditTrailStrictness": 0.6,
      "plannerSpecialization": 0.64,
      "allocatorSpecialization": 0.62,
      "reviewerSpecialization": 0.62,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 77.04,
      "constraintSatisfaction": 50.8,
      "conflictResolution": 71.88,
      "roleCoverageScore": 62.52,
      "coordinationLift": 97.67,
      "planStability": 54.21,
      "confidence": 72.99,
      "overall": 68.82
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 34.08,
      "constraintSatisfaction": 42.83,
      "conflictResolution": 38.91,
      "roleCoverageScore": 45.42,
      "coordinationLift": 7.25,
      "planStability": 30.93,
      "confidence": 53.63,
      "overall": 37.24
    }
  },
  {
    "id": "std-022",
    "input": {
      "domainComplexity": 0.69,
      "constraintCount": 15,
      "roleCoverage": 0.72,
      "coordinationRounds": 7,
      "conflictResolutionDepth": 0.64,
      "capacityTightness": 0.7,
      "demandVolatility": 0.58,
      "crossDomainLinks": 4,
      "auditTrailStrictness": 0.65,
      "plannerSpecialization": 0.68,
      "allocatorSpecialization": 0.67,
      "reviewerSpecialization": 0.67,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 75.47,
      "constraintSatisfaction": 52.59,
      "conflictResolution": 79.31,
      "roleCoverageScore": 70.74,
      "coordinationLift": 100,
      "planStability": 53.9,
      "confidence": 84.56,
      "overall": 71.24
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 27.5,
      "constraintSatisfaction": 38.02,
      "conflictResolution": 36.84,
      "roleCoverageScore": 46.17,
      "coordinationLift": 7.22,
      "planStability": 25,
      "confidence": 50.95,
      "overall": 32.21
    }
  },
  {
    "id": "std-023",
    "input": {
      "domainComplexity": 0.74,
      "constraintCount": 16,
      "roleCoverage": 0.76,
      "coordinationRounds": 8,
      "conflictResolutionDepth": 0.7,
      "capacityTightness": 0.75,
      "demandVolatility": 0.62,
      "crossDomainLinks": 5,
      "auditTrailStrictness": 0.69,
      "plannerSpecialization": 0.72,
      "allocatorSpecialization": 0.72,
      "reviewerSpecialization": 0.71,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 81.99,
      "constraintSatisfaction": 57.95,
      "conflictResolution": 89.22,
      "roleCoverageScore": 70.31,
      "coordinationLift": 100,
      "planStability": 58.7,
      "confidence": 87.54,
      "overall": 76.27
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 27.6,
      "constraintSatisfaction": 38.11,
      "conflictResolution": 34.93,
      "roleCoverageScore": 46.78,
      "coordinationLift": 7.26,
      "planStability": 23.84,
      "confidence": 52.36,
      "overall": 31.88
    }
  },
  {
    "id": "std-024",
    "input": {
      "domainComplexity": 0.78,
      "constraintCount": 15,
      "roleCoverage": 0.73,
      "coordinationRounds": 1,
      "conflictResolutionDepth": 0.66,
      "capacityTightness": 0.67,
      "demandVolatility": 0.66,
      "crossDomainLinks": 0,
      "auditTrailStrictness": 0.74,
      "plannerSpecialization": 0.69,
      "allocatorSpecialization": 0.69,
      "reviewerSpecialization": 0.76,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 63.17,
      "constraintSatisfaction": 57.24,
      "conflictResolution": 48.53,
      "roleCoverageScore": 72.94,
      "coordinationLift": 52.21,
      "planStability": 48.19,
      "confidence": 64.05,
      "overall": 58.06
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 29.4,
      "constraintSatisfaction": 38.83,
      "conflictResolution": 46.62,
      "roleCoverageScore": 46.81,
      "coordinationLift": 2.95,
      "planStability": 25.38,
      "confidence": 51.88,
      "overall": 34.19
    }
  },
  {
    "id": "std-025",
    "input": {
      "domainComplexity": 0.73,
      "constraintCount": 16,
      "roleCoverage": 0.77,
      "coordinationRounds": 2,
      "conflictResolutionDepth": 0.72,
      "capacityTightness": 0.71,
      "demandVolatility": 0.69,
      "crossDomainLinks": 1,
      "auditTrailStrictness": 0.68,
      "plannerSpecialization": 0.73,
      "allocatorSpecialization": 0.74,
      "reviewerSpecialization": 0.7,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 71.86,
      "constraintSatisfaction": 59.07,
      "conflictResolution": 58.2,
      "roleCoverageScore": 71.66,
      "coordinationLift": 64.86,
      "planStability": 52.71,
      "confidence": 63.67,
      "overall": 64.21
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 30.68,
      "constraintSatisfaction": 38.59,
      "conflictResolution": 45.21,
      "roleCoverageScore": 47.7,
      "coordinationLift": 3.42,
      "planStability": 25.14,
      "confidence": 53.94,
      "overall": 34.42
    }
  },
  {
    "id": "std-026",
    "input": {
      "domainComplexity": 0.78,
      "constraintCount": 18,
      "roleCoverage": 0.81,
      "coordinationRounds": 3,
      "conflictResolutionDepth": 0.77,
      "capacityTightness": 0.76,
      "demandVolatility": 0.73,
      "crossDomainLinks": 2,
      "auditTrailStrictness": 0.72,
      "plannerSpecialization": 0.77,
      "allocatorSpecialization": 0.79,
      "reviewerSpecialization": 0.74,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 72.81,
      "constraintSatisfaction": 59.93,
      "conflictResolution": 65.33,
      "roleCoverageScore": 79.15,
      "coordinationLift": 77.01,
      "planStability": 53.01,
      "confidence": 74.65,
      "overall": 68.2
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 23.78,
      "constraintSatisfaction": 33.6,
      "conflictResolution": 43.07,
      "roleCoverageScore": 48.23,
      "coordinationLift": 3.32,
      "planStability": 18.95,
      "confidence": 51.16,
      "overall": 29.16
    }
  },
  {
    "id": "std-027",
    "input": {
      "domainComplexity": 0.82,
      "constraintCount": 16,
      "roleCoverage": 0.86,
      "coordinationRounds": 4,
      "conflictResolutionDepth": 0.74,
      "capacityTightness": 0.8,
      "demandVolatility": 0.77,
      "crossDomainLinks": 3,
      "auditTrailStrictness": 0.77,
      "plannerSpecialization": 0.81,
      "allocatorSpecialization": 0.76,
      "reviewerSpecialization": 0.79,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 80.03,
      "constraintSatisfaction": 60.59,
      "conflictResolution": 70.92,
      "roleCoverageScore": 78.6,
      "coordinationLift": 86.3,
      "planStability": 55.37,
      "confidence": 77.68,
      "overall": 72.51
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 27.24,
      "constraintSatisfaction": 37.09,
      "conflictResolution": 40.98,
      "roleCoverageScore": 49.33,
      "coordinationLift": 3.82,
      "planStability": 20.87,
      "confidence": 53.27,
      "overall": 31.62
    }
  },
  {
    "id": "std-028",
    "input": {
      "domainComplexity": 0.87,
      "constraintCount": 18,
      "roleCoverage": 0.82,
      "coordinationRounds": 5,
      "conflictResolutionDepth": 0.79,
      "capacityTightness": 0.84,
      "demandVolatility": 0.71,
      "crossDomainLinks": 4,
      "auditTrailStrictness": 0.81,
      "plannerSpecialization": 0.78,
      "allocatorSpecialization": 0.81,
      "reviewerSpecialization": 0.83,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 79.1,
      "constraintSatisfaction": 62.53,
      "conflictResolution": 77.29,
      "roleCoverageScore": 80.59,
      "coordinationLift": 97.46,
      "planStability": 56.51,
      "confidence": 86.13,
      "overall": 75.41
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 20.18,
      "constraintSatisfaction": 33.39,
      "conflictResolution": 39.09,
      "roleCoverageScore": 47.86,
      "coordinationLift": 3.94,
      "planStability": 16.74,
      "confidence": 49.84,
      "overall": 27.01
    }
  },
  {
    "id": "std-029",
    "input": {
      "domainComplexity": 0.91,
      "constraintCount": 19,
      "roleCoverage": 0.87,
      "coordinationRounds": 6,
      "conflictResolutionDepth": 0.85,
      "capacityTightness": 0.89,
      "demandVolatility": 0.75,
      "crossDomainLinks": 5,
      "auditTrailStrictness": 0.86,
      "plannerSpecialization": 0.82,
      "allocatorSpecialization": 0.86,
      "reviewerSpecialization": 0.88,
      "profile": "aggressive"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 87.92,
      "constraintSatisfaction": 68.73,
      "conflictResolution": 87.54,
      "roleCoverageScore": 80.87,
      "coordinationLift": 100,
      "planStability": 62.61,
      "confidence": 89.7,
      "overall": 81.83
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 20.37,
      "constraintSatisfaction": 33.63,
      "conflictResolution": 37.23,
      "roleCoverageScore": 48.67,
      "coordinationLift": 4.02,
      "planStability": 15.71,
      "confidence": 51.31,
      "overall": 26.8
    }
  },
  {
    "id": "std-030",
    "input": {
      "domainComplexity": 0.86,
      "constraintCount": 18,
      "roleCoverage": 0.91,
      "coordinationRounds": 7,
      "conflictResolutionDepth": 0.81,
      "capacityTightness": 0.81,
      "demandVolatility": 0.78,
      "crossDomainLinks": 0,
      "auditTrailStrictness": 0.8,
      "plannerSpecialization": 0.86,
      "allocatorSpecialization": 0.84,
      "reviewerSpecialization": 0.82,
      "profile": "balanced"
    },
    "expectedMulti": {
      "mode": "multi",
      "allocationFit": 84.16,
      "constraintSatisfaction": 63.47,
      "conflictResolution": 91.15,
      "roleCoverageScore": 87.67,
      "coordinationLift": 100,
      "planStability": 67.75,
      "confidence": 96.85,
      "overall": 81.32
    },
    "expectedSingle": {
      "mode": "single",
      "allocationFit": 23.86,
      "constraintSatisfaction": 33.84,
      "conflictResolution": 37.34,
      "roleCoverageScore": 50.9,
      "coordinationLift": 6.48,
      "planStability": 18.28,
      "confidence": 52.36,
      "overall": 28.71
    }
  }
];
