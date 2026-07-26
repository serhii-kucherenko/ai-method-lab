import type { AminoarylInput, AminoarylQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AminoarylInput;
  expectedPhoto: AminoarylQuality;
  expectedCopper: AminoarylQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "aa-001",
    "input": {
      "photoYield": 0.34,
      "copperYield": 0.5,
      "cyclopropaneStrain": 0.75,
      "catalystFidelity": 0.34,
      "evidenceStrength": 0.34,
      "routeFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 40.27,
      "copperYieldScore": 33.95,
      "catalystCoverage": 25.03,
      "routeEfficiency": 43.42,
      "strainPenalty": 51.03,
      "confidence": 5.82,
      "photoContribution": 38.26,
      "copperContribution": 37.72,
      "overall": 39.16
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 34.54,
      "copperYieldScore": 51.89,
      "catalystCoverage": 34.36,
      "routeEfficiency": 39.83,
      "strainPenalty": 18.81,
      "confidence": 25.12,
      "photoContribution": 48.36,
      "copperContribution": 38.66,
      "overall": 42.09
    }
  },
  {
    "id": "aa-002",
    "input": {
      "photoYield": 0.38,
      "copperYield": 0.51,
      "cyclopropaneStrain": 0.75,
      "catalystFidelity": 0.38,
      "evidenceStrength": 0.38,
      "routeFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 49.28,
      "copperYieldScore": 30.04,
      "catalystCoverage": 34.58,
      "routeEfficiency": 59.41,
      "strainPenalty": 50.16,
      "confidence": 8.54,
      "photoContribution": 47.49,
      "copperContribution": 42.38,
      "overall": 47.57
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 33.24,
      "copperYieldScore": 61.6,
      "catalystCoverage": 35.61,
      "routeEfficiency": 50.67,
      "strainPenalty": 17.58,
      "confidence": 26.75,
      "photoContribution": 52.71,
      "copperContribution": 43.59,
      "overall": 46.64
    }
  },
  {
    "id": "aa-003",
    "input": {
      "photoYield": 0.42,
      "copperYield": 0.46,
      "cyclopropaneStrain": 0.69,
      "catalystFidelity": 0.42,
      "evidenceStrength": 0.42,
      "routeFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "copper_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 19.19,
      "copperYieldScore": 37.37,
      "catalystCoverage": 16.83,
      "routeEfficiency": 29.33,
      "strainPenalty": 71.53,
      "confidence": 13.18,
      "photoContribution": 22.43,
      "copperContribution": 30.3,
      "overall": 22.09
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 33.42,
      "copperYieldScore": 57.92,
      "catalystCoverage": 35.35,
      "routeEfficiency": 49.14,
      "strainPenalty": 15.87,
      "confidence": 28.08,
      "photoContribution": 51.99,
      "copperContribution": 42.39,
      "overall": 45.16
    }
  },
  {
    "id": "aa-004",
    "input": {
      "photoYield": 0.38,
      "copperYield": 0.46,
      "cyclopropaneStrain": 0.69,
      "catalystFidelity": 0.38,
      "evidenceStrength": 0.38,
      "routeFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 45.24,
      "copperYieldScore": 33.49,
      "catalystCoverage": 29.7,
      "routeEfficiency": 47.78,
      "strainPenalty": 47.85,
      "confidence": 10.26,
      "photoContribution": 42.69,
      "copperContribution": 39.62,
      "overall": 43.38
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 34.32,
      "copperYieldScore": 49.12,
      "catalystCoverage": 34.11,
      "routeEfficiency": 39.01,
      "strainPenalty": 17.19,
      "confidence": 26.24,
      "photoContribution": 47.87,
      "copperContribution": 37.69,
      "overall": 40.79
    }
  },
  {
    "id": "aa-005",
    "input": {
      "photoYield": 0.42,
      "copperYield": 0.47,
      "cyclopropaneStrain": 0.69,
      "catalystFidelity": 0.42,
      "evidenceStrength": 0.42,
      "routeFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "photo_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 54.8,
      "copperYieldScore": 29.13,
      "catalystCoverage": 24.83,
      "routeEfficiency": 29.06,
      "strainPenalty": 46.98,
      "confidence": 12.98,
      "photoContribution": 40.43,
      "copperContribution": 37.37,
      "overall": 41.12
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 21.02,
      "copperYieldScore": 37.16,
      "catalystCoverage": 35.35,
      "routeEfficiency": 28.2,
      "strainPenalty": 15.96,
      "confidence": 27.87,
      "photoContribution": 41.15,
      "copperContribution": 25.32,
      "overall": 29.4
    }
  },
  {
    "id": "aa-006",
    "input": {
      "photoYield": 0.45,
      "copperYield": 0.42,
      "cyclopropaneStrain": 0.64,
      "catalystFidelity": 0.45,
      "evidenceStrength": 0.45,
      "routeFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 53.56,
      "copperYieldScore": 33.18,
      "catalystCoverage": 36.89,
      "routeEfficiency": 53.53,
      "strainPenalty": 44.26,
      "confidence": 16.77,
      "photoContribution": 49.28,
      "copperContribution": 42.79,
      "overall": 49.55
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 34.05,
      "copperYieldScore": 46.44,
      "catalystCoverage": 35.04,
      "routeEfficiency": 39.29,
      "strainPenalty": 14.57,
      "confidence": 29,
      "photoContribution": 48.05,
      "copperContribution": 36.94,
      "overall": 39.73
    }
  },
  {
    "id": "aa-007",
    "input": {
      "photoYield": 0.49,
      "copperYield": 0.43,
      "cyclopropaneStrain": 0.64,
      "catalystFidelity": 0.49,
      "evidenceStrength": 0.49,
      "routeFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 64.06,
      "copperYieldScore": 28.03,
      "catalystCoverage": 48.17,
      "routeEfficiency": 72.83,
      "strainPenalty": 43.39,
      "confidence": 19.49,
      "photoContribution": 60.2,
      "copperContribution": 48.2,
      "overall": 59.48
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.74,
      "copperYieldScore": 54.69,
      "catalystCoverage": 36.29,
      "routeEfficiency": 48.68,
      "strainPenalty": 13.34,
      "confidence": 30.63,
      "photoContribution": 51.81,
      "copperContribution": 41.08,
      "overall": 43.53
    }
  },
  {
    "id": "aa-008",
    "input": {
      "photoYield": 0.45,
      "copperYield": 0.44,
      "cyclopropaneStrain": 0.64,
      "catalystFidelity": 0.45,
      "evidenceStrength": 0.45,
      "routeFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "copper_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 21.36,
      "copperYieldScore": 37.45,
      "catalystCoverage": 19.82,
      "routeEfficiency": 31,
      "strainPenalty": 69.08,
      "confidence": 16.37,
      "photoContribution": 24.77,
      "copperContribution": 30.99,
      "overall": 24.33
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.74,
      "copperYieldScore": 55.11,
      "catalystCoverage": 35.04,
      "routeEfficiency": 47.61,
      "strainPenalty": 14.75,
      "confidence": 28.58,
      "photoContribution": 51.15,
      "copperContribution": 40.96,
      "overall": 43.43
    }
  },
  {
    "id": "aa-009",
    "input": {
      "photoYield": 0.49,
      "copperYield": 0.38,
      "cyclopropaneStrain": 0.58,
      "catalystFidelity": 0.49,
      "evidenceStrength": 0.49,
      "routeFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 58.53,
      "copperYieldScore": 32.72,
      "catalystCoverage": 41.56,
      "routeEfficiency": 57.88,
      "strainPenalty": 41.08,
      "confidence": 21.21,
      "photoContribution": 53.71,
      "copperContribution": 44.68,
      "overall": 53.76
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 33.83,
      "copperYieldScore": 43.66,
      "catalystCoverage": 34.79,
      "routeEfficiency": 38.47,
      "strainPenalty": 12.95,
      "confidence": 30.12,
      "photoContribution": 47.56,
      "copperContribution": 35.98,
      "overall": 38.44
    }
  },
  {
    "id": "aa-010",
    "input": {
      "photoYield": 0.53,
      "copperYield": 0.39,
      "cyclopropaneStrain": 0.58,
      "catalystFidelity": 0.53,
      "evidenceStrength": 0.53,
      "routeFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "photo_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 69.58,
      "copperYieldScore": 27.12,
      "catalystCoverage": 34.47,
      "routeEfficiency": 34.91,
      "strainPenalty": 40.21,
      "confidence": 23.93,
      "photoContribution": 50.36,
      "copperContribution": 41.67,
      "overall": 50.48
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 20.53,
      "copperYieldScore": 33.58,
      "catalystCoverage": 36.04,
      "routeEfficiency": 29.53,
      "strainPenalty": 11.72,
      "confidence": 31.75,
      "photoContribution": 41.59,
      "copperContribution": 24.63,
      "overall": 28.01
    }
  },
  {
    "id": "aa-011",
    "input": {
      "photoYield": 0.57,
      "copperYield": 0.4,
      "cyclopropaneStrain": 0.58,
      "catalystFidelity": 0.57,
      "evidenceStrength": 0.57,
      "routeFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 67.28,
      "copperYieldScore": 33.45,
      "catalystCoverage": 48.75,
      "routeEfficiency": 61.08,
      "strainPenalty": 39.34,
      "confidence": 26.65,
      "photoContribution": 59.54,
      "copperContribution": 47.99,
      "overall": 59.14
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.22,
      "copperYieldScore": 43.23,
      "catalystCoverage": 37.28,
      "routeEfficiency": 40.32,
      "strainPenalty": 10.49,
      "confidence": 33.38,
      "photoContribution": 48.51,
      "copperContribution": 35.38,
      "overall": 37.66
    }
  },
  {
    "id": "aa-012",
    "input": {
      "photoYield": 0.53,
      "copperYield": 0.35,
      "cyclopropaneStrain": 0.52,
      "catalystFidelity": 0.53,
      "evidenceStrength": 0.53,
      "routeFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 70.11,
      "copperYieldScore": 26.46,
      "catalystCoverage": 54.54,
      "routeEfficiency": 81.63,
      "strainPenalty": 37.99,
      "confidence": 25.45,
      "photoContribution": 66.83,
      "copperContribution": 50.74,
      "overall": 65.85
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.71,
      "copperYieldScore": 47.87,
      "catalystCoverage": 34.54,
      "routeEfficiency": 44.46,
      "strainPenalty": 11.42,
      "confidence": 31.03,
      "photoContribution": 49.63,
      "copperContribution": 38.37,
      "overall": 40.26
    }
  },
  {
    "id": "aa-013",
    "input": {
      "photoYield": 0.57,
      "copperYield": 0.36,
      "cyclopropaneStrain": 0.52,
      "catalystFidelity": 0.57,
      "evidenceStrength": 0.57,
      "routeFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "copper_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 29.97,
      "copperYieldScore": 37.78,
      "catalystCoverage": 30.33,
      "routeEfficiency": 37.18,
      "strainPenalty": 61.76,
      "confidence": 28.17,
      "photoContribution": 33.15,
      "copperContribution": 33.9,
      "overall": 32.21
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.91,
      "copperYieldScore": 47.65,
      "catalystCoverage": 35.78,
      "routeEfficiency": 45.39,
      "strainPenalty": 10.19,
      "confidence": 32.66,
      "photoContribution": 50.11,
      "copperContribution": 38.08,
      "overall": 39.88
    }
  },
  {
    "id": "aa-014",
    "input": {
      "photoYield": 0.61,
      "copperYield": 0.36,
      "cyclopropaneStrain": 0.52,
      "catalystFidelity": 0.61,
      "evidenceStrength": 0.61,
      "routeFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 72.26,
      "copperYieldScore": 32.99,
      "catalystCoverage": 53.42,
      "routeEfficiency": 65.43,
      "strainPenalty": 36.16,
      "confidence": 31.09,
      "photoContribution": 63.97,
      "copperContribution": 49.88,
      "overall": 63.35
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.01,
      "copperYieldScore": 40.45,
      "catalystCoverage": 37.03,
      "routeEfficiency": 39.51,
      "strainPenalty": 8.87,
      "confidence": 34.5,
      "photoContribution": 48.03,
      "copperContribution": 34.42,
      "overall": 36.36
    }
  },
  {
    "id": "aa-015",
    "input": {
      "photoYield": 0.65,
      "copperYield": 0.31,
      "cyclopropaneStrain": 0.46,
      "catalystFidelity": 0.65,
      "evidenceStrength": 0.65,
      "routeFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "photo_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 85.64,
      "copperYieldScore": 25.05,
      "catalystCoverage": 44.99,
      "routeEfficiency": 41.09,
      "strainPenalty": 32.89,
      "confidence": 35.73,
      "photoContribution": 61.12,
      "copperContribution": 46.35,
      "overall": 60.62
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 19.7,
      "copperYieldScore": 29.75,
      "catalystCoverage": 36.78,
      "routeEfficiency": 30.94,
      "strainPenalty": 7.16,
      "confidence": 35.83,
      "photoContribution": 42,
      "copperContribution": 23.74,
      "overall": 26.33
    }
  },
  {
    "id": "aa-016",
    "input": {
      "photoYield": 0.6,
      "copperYield": 0.32,
      "cyclopropaneStrain": 0.47,
      "catalystFidelity": 0.6,
      "evidenceStrength": 0.6,
      "routeFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 71.61,
      "copperYieldScore": 32.28,
      "catalystCoverage": 53.42,
      "routeEfficiency": 67.15,
      "strainPenalty": 34.49,
      "confidence": 31.76,
      "photoContribution": 64.44,
      "copperContribution": 49.64,
      "overall": 63.9
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 32.53,
      "copperYieldScore": 38.42,
      "catalystCoverage": 35.47,
      "routeEfficiency": 37.79,
      "strainPenalty": 8.89,
      "confidence": 33.58,
      "photoContribution": 47.06,
      "copperContribution": 33.86,
      "overall": 35.6
    }
  },
  {
    "id": "aa-017",
    "input": {
      "photoYield": 0.64,
      "copperYield": 0.33,
      "cyclopropaneStrain": 0.47,
      "catalystFidelity": 0.64,
      "evidenceStrength": 0.64,
      "routeFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 84.16,
      "copperYieldScore": 25.45,
      "catalystCoverage": 67.05,
      "routeEfficiency": 90.94,
      "strainPenalty": 33.62,
      "confidence": 34.48,
      "photoContribution": 77.66,
      "copperContribution": 56.07,
      "overall": 75.89
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.23,
      "copperYieldScore": 44.42,
      "catalystCoverage": 36.72,
      "routeEfficiency": 44.93,
      "strainPenalty": 7.66,
      "confidence": 35.21,
      "photoContribution": 49.93,
      "copperContribution": 36.76,
      "overall": 38.24
    }
  },
  {
    "id": "aa-018",
    "input": {
      "photoYield": 0.68,
      "copperYield": 0.27,
      "cyclopropaneStrain": 0.41,
      "catalystFidelity": 0.68,
      "evidenceStrength": 0.68,
      "routeFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "copper_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 38.01,
      "copperYieldScore": 37.81,
      "catalystCoverage": 39.98,
      "routeEfficiency": 43.29,
      "strainPenalty": 54.9,
      "confidence": 39.32,
      "photoContribution": 41,
      "copperContribution": 36.61,
      "overall": 39.57
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.82,
      "copperYieldScore": 40.64,
      "catalystCoverage": 36.47,
      "routeEfficiency": 43.47,
      "strainPenalty": 5.86,
      "confidence": 36.75,
      "photoContribution": 49.31,
      "copperContribution": 35.77,
      "overall": 37.01
    }
  },
  {
    "id": "aa-019",
    "input": {
      "photoYield": 0.72,
      "copperYield": 0.28,
      "cyclopropaneStrain": 0.41,
      "catalystFidelity": 0.72,
      "evidenceStrength": 0.72,
      "routeFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 85.55,
      "copperYieldScore": 32.22,
      "catalystCoverage": 65.28,
      "routeEfficiency": 75.54,
      "strainPenalty": 29.39,
      "confidence": 42.04,
      "photoContribution": 74.98,
      "copperContribution": 54.95,
      "overall": 73.73
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.51,
      "copperYieldScore": 35,
      "catalystCoverage": 37.71,
      "routeEfficiency": 38.97,
      "strainPenalty": 4.63,
      "confidence": 38.38,
      "photoContribution": 47.71,
      "copperContribution": 32.71,
      "overall": 34.01
    }
  },
  {
    "id": "aa-020",
    "input": {
      "photoYield": 0.68,
      "copperYield": 0.29,
      "cyclopropaneStrain": 0.41,
      "catalystFidelity": 0.68,
      "evidenceStrength": 0.68,
      "routeFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "photo_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 89.68,
      "copperYieldScore": 24.53,
      "catalystCoverage": 47.98,
      "routeEfficiency": 42.76,
      "strainPenalty": 30.44,
      "confidence": 38.92,
      "photoContribution": 64.06,
      "copperContribution": 47.49,
      "overall": 63.44
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 19.01,
      "copperYieldScore": 28.45,
      "catalystCoverage": 36.47,
      "routeEfficiency": 30.92,
      "strainPenalty": 6.04,
      "confidence": 36.33,
      "photoContribution": 41.76,
      "copperContribution": 23.14,
      "overall": 25.38
    }
  },
  {
    "id": "aa-021",
    "input": {
      "photoYield": 0.72,
      "copperYield": 0.24,
      "cyclopropaneStrain": 0.35,
      "catalystFidelity": 0.72,
      "evidenceStrength": 0.72,
      "routeFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 86.04,
      "copperYieldScore": 31.56,
      "catalystCoverage": 66.36,
      "routeEfficiency": 77.87,
      "strainPenalty": 27.17,
      "confidence": 43.56,
      "photoContribution": 76.35,
      "copperContribution": 55.13,
      "overall": 75.13
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.7,
      "copperYieldScore": 32.54,
      "catalystCoverage": 36.21,
      "routeEfficiency": 37.16,
      "strainPenalty": 4.33,
      "confidence": 37.66,
      "photoContribution": 46.66,
      "copperContribution": 31.84,
      "overall": 32.86
    }
  },
  {
    "id": "aa-022",
    "input": {
      "photoYield": 0.76,
      "copperYield": 0.25,
      "cyclopropaneStrain": 0.35,
      "catalystFidelity": 0.76,
      "evidenceStrength": 0.76,
      "routeFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 100,
      "copperYieldScore": 23.38,
      "catalystCoverage": 81.86,
      "routeEfficiency": 100,
      "strainPenalty": 26.3,
      "confidence": 46.28,
      "photoContribution": 90.19,
      "copperContribution": 61.25,
      "overall": 87.58
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 30.4,
      "copperYieldScore": 36.96,
      "catalystCoverage": 37.46,
      "routeEfficiency": 42.71,
      "strainPenalty": 3.1,
      "confidence": 39.29,
      "photoContribution": 48.89,
      "copperContribution": 33.87,
      "overall": 34.67
    }
  },
  {
    "id": "aa-023",
    "input": {
      "photoYield": 0.8,
      "copperYield": 0.25,
      "cyclopropaneStrain": 0.35,
      "catalystFidelity": 0.8,
      "evidenceStrength": 0.8,
      "routeFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "copper_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 46.06,
      "copperYieldScore": 39.13,
      "catalystCoverage": 49.41,
      "routeEfficiency": 47.52,
      "strainPenalty": 49.98,
      "confidence": 49.2,
      "photoContribution": 48.03,
      "copperContribution": 39.52,
      "overall": 46.1
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 30,
      "copperYieldScore": 36.64,
      "catalystCoverage": 38.71,
      "routeEfficiency": 43.71,
      "strainPenalty": 1.78,
      "confidence": 41.13,
      "photoContribution": 49.46,
      "copperContribution": 33.78,
      "overall": 34.53
    }
  },
  {
    "id": "aa-024",
    "input": {
      "photoYield": 0.76,
      "copperYield": 0.2,
      "cyclopropaneStrain": 0.29,
      "catalystFidelity": 0.76,
      "evidenceStrength": 0.76,
      "routeFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 91.01,
      "copperYieldScore": 31.1,
      "catalystCoverage": 71.03,
      "routeEfficiency": 82.22,
      "strainPenalty": 23.99,
      "confidence": 48,
      "photoContribution": 80.78,
      "copperContribution": 57.02,
      "overall": 79.34
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 31.48,
      "copperYieldScore": 29.76,
      "catalystCoverage": 35.96,
      "routeEfficiency": 36.34,
      "strainPenalty": 2.71,
      "confidence": 38.78,
      "photoContribution": 46.17,
      "copperContribution": 30.88,
      "overall": 31.56
    }
  },
  {
    "id": "aa-025",
    "input": {
      "photoYield": 0.8,
      "copperYield": 0.21,
      "cyclopropaneStrain": 0.29,
      "catalystFidelity": 0.8,
      "evidenceStrength": 0.8,
      "routeFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "photo_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 100,
      "copperYieldScore": 22.47,
      "catalystCoverage": 58.49,
      "routeEfficiency": 48.95,
      "strainPenalty": 23.12,
      "confidence": 50.72,
      "photoContribution": 72.98,
      "copperContribution": 50.17,
      "overall": 71.71
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 18.18,
      "copperYieldScore": 24.62,
      "catalystCoverage": 37.21,
      "routeEfficiency": 32.33,
      "strainPenalty": 1.48,
      "confidence": 40.41,
      "photoContribution": 42.17,
      "copperContribution": 22.24,
      "overall": 23.68
    }
  },
  {
    "id": "aa-026",
    "input": {
      "photoYield": 0.83,
      "copperYield": 0.22,
      "cyclopropaneStrain": 0.3,
      "catalystFidelity": 0.83,
      "evidenceStrength": 0.83,
      "routeFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 98.63,
      "copperYieldScore": 31.78,
      "catalystCoverage": 77.13,
      "routeEfficiency": 84.81,
      "strainPenalty": 22.8,
      "confidence": 52.59,
      "photoContribution": 85.71,
      "copperContribution": 59.91,
      "overall": 83.87
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 30.22,
      "copperYieldScore": 29.75,
      "catalystCoverage": 38.4,
      "routeEfficiency": 38.29,
      "strainPenalty": 0.57,
      "confidence": 41.84,
      "photoContribution": 47.22,
      "copperContribution": 30.59,
      "overall": 31.18
    }
  },
  {
    "id": "aa-027",
    "input": {
      "photoYield": 0.87,
      "copperYield": 0.17,
      "cyclopropaneStrain": 0.24,
      "catalystFidelity": 0.87,
      "evidenceStrength": 0.87,
      "routeFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 100,
      "copperYieldScore": 21.37,
      "catalystCoverage": 95.45,
      "routeEfficiency": 100,
      "strainPenalty": 19.53,
      "confidence": 57.23,
      "photoContribution": 95.21,
      "copperContribution": 59.21,
      "overall": 91.77
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 29.9,
      "copperYieldScore": 30.05,
      "catalystCoverage": 38.14,
      "routeEfficiency": 40.72,
      "strainPenalty": 0,
      "confidence": 43.17,
      "photoContribution": 47.76,
      "copperContribution": 31.35,
      "overall": 31.51
    }
  },
  {
    "id": "aa-028",
    "input": {
      "photoYield": 0.83,
      "copperYield": 0.17,
      "cyclopropaneStrain": 0.24,
      "catalystFidelity": 0.83,
      "evidenceStrength": 0.83,
      "routeFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "copper_first",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 48.79,
      "copperYieldScore": 38.22,
      "catalystCoverage": 53.48,
      "routeEfficiency": 51.15,
      "strainPenalty": 45.13,
      "confidence": 54.31,
      "photoContribution": 51.72,
      "copperContribution": 40.22,
      "overall": 49.69
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 30.3,
      "copperYieldScore": 30.37,
      "catalystCoverage": 36.9,
      "routeEfficiency": 39.72,
      "strainPenalty": 0.18,
      "confidence": 41.33,
      "photoContribution": 47.42,
      "copperContribution": 31.44,
      "overall": 31.71
    }
  },
  {
    "id": "aa-029",
    "input": {
      "photoYield": 0.87,
      "copperYield": 0.18,
      "cyclopropaneStrain": 0.24,
      "catalystFidelity": 0.87,
      "evidenceStrength": 0.87,
      "routeFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "photocatalytic_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 100,
      "copperYieldScore": 31.32,
      "catalystCoverage": 81.81,
      "routeEfficiency": 89.16,
      "strainPenalty": 19.62,
      "confidence": 57.03,
      "photoContribution": 88.99,
      "copperContribution": 60.54,
      "overall": 86.91
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 30,
      "copperYieldScore": 26.98,
      "catalystCoverage": 38.14,
      "routeEfficiency": 37.47,
      "strainPenalty": 0,
      "confidence": 42.96,
      "photoContribution": 46.52,
      "copperContribution": 29.63,
      "overall": 29.84
    }
  },
  {
    "id": "aa-030",
    "input": {
      "photoYield": 0.91,
      "copperYield": 0.13,
      "cyclopropaneStrain": 0.18,
      "catalystFidelity": 0.91,
      "evidenceStrength": 0.91,
      "routeFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "photo_first",
      "profile": "copper_catalyzed_aminoaryl"
    },
    "expectedPhoto": {
      "mode": "photocatalytic_aminoaryl",
      "photoYieldScore": 100,
      "copperYieldScore": 20.46,
      "catalystCoverage": 68.13,
      "routeEfficiency": 54.79,
      "strainPenalty": 16.35,
      "confidence": 61.67,
      "photoContribution": 78.19,
      "copperContribution": 49.29,
      "overall": 76.27
    },
    "expectedCopper": {
      "mode": "copper_catalyzed_aminoaryl",
      "photoYieldScore": 17.69,
      "copperYieldScore": 21.03,
      "catalystCoverage": 37.89,
      "routeEfficiency": 33.67,
      "strainPenalty": 0,
      "confidence": 44.29,
      "photoContribution": 42.06,
      "copperContribution": 21.56,
      "overall": 22.18
    }
  }
];
