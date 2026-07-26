import type { UsherDualInput, UsherDualQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: UsherDualInput;
  expectedMyo7a: UsherDualQuality;
  expectedMyo7b: UsherDualQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ud-001",
    "input": {
      "myo7aRescue": 0.34,
      "myo7bActivation": 0.5,
      "alleleGap": 0.75,
      "vectorDelivery": 0.34,
      "evidenceStrength": 0.34,
      "pathwayFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 40.27,
      "myo7bActivationScore": 33.95,
      "vectorCoverage": 25.03,
      "pathwayEfficiency": 43.42,
      "alleleGapPenalty": 51.03,
      "confidence": 5.82,
      "myo7aContribution": 38.26,
      "myo7bContribution": 37.72,
      "overall": 39.16
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 34.54,
      "myo7bActivationScore": 51.89,
      "vectorCoverage": 34.36,
      "pathwayEfficiency": 39.83,
      "alleleGapPenalty": 18.81,
      "confidence": 25.12,
      "myo7aContribution": 48.36,
      "myo7bContribution": 38.66,
      "overall": 42.09
    }
  },
  {
    "id": "ud-002",
    "input": {
      "myo7aRescue": 0.38,
      "myo7bActivation": 0.51,
      "alleleGap": 0.75,
      "vectorDelivery": 0.38,
      "evidenceStrength": 0.38,
      "pathwayFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 49.28,
      "myo7bActivationScore": 30.04,
      "vectorCoverage": 34.58,
      "pathwayEfficiency": 59.41,
      "alleleGapPenalty": 50.16,
      "confidence": 8.54,
      "myo7aContribution": 47.49,
      "myo7bContribution": 42.38,
      "overall": 47.57
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 33.24,
      "myo7bActivationScore": 61.6,
      "vectorCoverage": 35.61,
      "pathwayEfficiency": 50.67,
      "alleleGapPenalty": 17.58,
      "confidence": 26.75,
      "myo7aContribution": 52.71,
      "myo7bContribution": 43.59,
      "overall": 46.64
    }
  },
  {
    "id": "ud-003",
    "input": {
      "myo7aRescue": 0.42,
      "myo7bActivation": 0.46,
      "alleleGap": 0.69,
      "vectorDelivery": 0.42,
      "evidenceStrength": 0.42,
      "pathwayFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "myo7b_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 19.19,
      "myo7bActivationScore": 37.37,
      "vectorCoverage": 16.83,
      "pathwayEfficiency": 29.33,
      "alleleGapPenalty": 71.53,
      "confidence": 13.18,
      "myo7aContribution": 22.43,
      "myo7bContribution": 30.3,
      "overall": 22.09
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 33.42,
      "myo7bActivationScore": 57.92,
      "vectorCoverage": 35.35,
      "pathwayEfficiency": 49.14,
      "alleleGapPenalty": 15.87,
      "confidence": 28.08,
      "myo7aContribution": 51.99,
      "myo7bContribution": 42.39,
      "overall": 45.16
    }
  },
  {
    "id": "ud-004",
    "input": {
      "myo7aRescue": 0.38,
      "myo7bActivation": 0.46,
      "alleleGap": 0.69,
      "vectorDelivery": 0.38,
      "evidenceStrength": 0.38,
      "pathwayFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 45.24,
      "myo7bActivationScore": 33.49,
      "vectorCoverage": 29.7,
      "pathwayEfficiency": 47.78,
      "alleleGapPenalty": 47.85,
      "confidence": 10.26,
      "myo7aContribution": 42.69,
      "myo7bContribution": 39.62,
      "overall": 43.38
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 34.32,
      "myo7bActivationScore": 49.12,
      "vectorCoverage": 34.11,
      "pathwayEfficiency": 39.01,
      "alleleGapPenalty": 17.19,
      "confidence": 26.24,
      "myo7aContribution": 47.87,
      "myo7bContribution": 37.69,
      "overall": 40.79
    }
  },
  {
    "id": "ud-005",
    "input": {
      "myo7aRescue": 0.42,
      "myo7bActivation": 0.47,
      "alleleGap": 0.69,
      "vectorDelivery": 0.42,
      "evidenceStrength": 0.42,
      "pathwayFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "myo7a_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 54.8,
      "myo7bActivationScore": 29.13,
      "vectorCoverage": 24.83,
      "pathwayEfficiency": 29.06,
      "alleleGapPenalty": 46.98,
      "confidence": 12.98,
      "myo7aContribution": 40.43,
      "myo7bContribution": 37.37,
      "overall": 41.12
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 21.02,
      "myo7bActivationScore": 37.16,
      "vectorCoverage": 35.35,
      "pathwayEfficiency": 28.2,
      "alleleGapPenalty": 15.96,
      "confidence": 27.87,
      "myo7aContribution": 41.15,
      "myo7bContribution": 25.32,
      "overall": 29.4
    }
  },
  {
    "id": "ud-006",
    "input": {
      "myo7aRescue": 0.45,
      "myo7bActivation": 0.42,
      "alleleGap": 0.64,
      "vectorDelivery": 0.45,
      "evidenceStrength": 0.45,
      "pathwayFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 53.56,
      "myo7bActivationScore": 33.18,
      "vectorCoverage": 36.89,
      "pathwayEfficiency": 53.53,
      "alleleGapPenalty": 44.26,
      "confidence": 16.77,
      "myo7aContribution": 49.28,
      "myo7bContribution": 42.79,
      "overall": 49.55
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 34.05,
      "myo7bActivationScore": 46.44,
      "vectorCoverage": 35.04,
      "pathwayEfficiency": 39.29,
      "alleleGapPenalty": 14.57,
      "confidence": 29,
      "myo7aContribution": 48.05,
      "myo7bContribution": 36.94,
      "overall": 39.73
    }
  },
  {
    "id": "ud-007",
    "input": {
      "myo7aRescue": 0.49,
      "myo7bActivation": 0.43,
      "alleleGap": 0.64,
      "vectorDelivery": 0.49,
      "evidenceStrength": 0.49,
      "pathwayFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 64.06,
      "myo7bActivationScore": 28.03,
      "vectorCoverage": 48.17,
      "pathwayEfficiency": 72.83,
      "alleleGapPenalty": 43.39,
      "confidence": 19.49,
      "myo7aContribution": 60.2,
      "myo7bContribution": 48.2,
      "overall": 59.48
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.74,
      "myo7bActivationScore": 54.69,
      "vectorCoverage": 36.29,
      "pathwayEfficiency": 48.68,
      "alleleGapPenalty": 13.34,
      "confidence": 30.63,
      "myo7aContribution": 51.81,
      "myo7bContribution": 41.08,
      "overall": 43.53
    }
  },
  {
    "id": "ud-008",
    "input": {
      "myo7aRescue": 0.45,
      "myo7bActivation": 0.44,
      "alleleGap": 0.64,
      "vectorDelivery": 0.45,
      "evidenceStrength": 0.45,
      "pathwayFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "myo7b_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 21.36,
      "myo7bActivationScore": 37.45,
      "vectorCoverage": 19.82,
      "pathwayEfficiency": 31,
      "alleleGapPenalty": 69.08,
      "confidence": 16.37,
      "myo7aContribution": 24.77,
      "myo7bContribution": 30.99,
      "overall": 24.33
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.74,
      "myo7bActivationScore": 55.11,
      "vectorCoverage": 35.04,
      "pathwayEfficiency": 47.61,
      "alleleGapPenalty": 14.75,
      "confidence": 28.58,
      "myo7aContribution": 51.15,
      "myo7bContribution": 40.96,
      "overall": 43.43
    }
  },
  {
    "id": "ud-009",
    "input": {
      "myo7aRescue": 0.49,
      "myo7bActivation": 0.38,
      "alleleGap": 0.58,
      "vectorDelivery": 0.49,
      "evidenceStrength": 0.49,
      "pathwayFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 58.53,
      "myo7bActivationScore": 32.72,
      "vectorCoverage": 41.56,
      "pathwayEfficiency": 57.88,
      "alleleGapPenalty": 41.08,
      "confidence": 21.21,
      "myo7aContribution": 53.71,
      "myo7bContribution": 44.68,
      "overall": 53.76
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 33.83,
      "myo7bActivationScore": 43.66,
      "vectorCoverage": 34.79,
      "pathwayEfficiency": 38.47,
      "alleleGapPenalty": 12.95,
      "confidence": 30.12,
      "myo7aContribution": 47.56,
      "myo7bContribution": 35.98,
      "overall": 38.44
    }
  },
  {
    "id": "ud-010",
    "input": {
      "myo7aRescue": 0.53,
      "myo7bActivation": 0.39,
      "alleleGap": 0.58,
      "vectorDelivery": 0.53,
      "evidenceStrength": 0.53,
      "pathwayFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "myo7a_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 69.58,
      "myo7bActivationScore": 27.12,
      "vectorCoverage": 34.47,
      "pathwayEfficiency": 34.91,
      "alleleGapPenalty": 40.21,
      "confidence": 23.93,
      "myo7aContribution": 50.36,
      "myo7bContribution": 41.67,
      "overall": 50.48
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 20.53,
      "myo7bActivationScore": 33.58,
      "vectorCoverage": 36.04,
      "pathwayEfficiency": 29.53,
      "alleleGapPenalty": 11.72,
      "confidence": 31.75,
      "myo7aContribution": 41.59,
      "myo7bContribution": 24.63,
      "overall": 28.01
    }
  },
  {
    "id": "ud-011",
    "input": {
      "myo7aRescue": 0.57,
      "myo7bActivation": 0.4,
      "alleleGap": 0.58,
      "vectorDelivery": 0.57,
      "evidenceStrength": 0.57,
      "pathwayFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 67.28,
      "myo7bActivationScore": 33.45,
      "vectorCoverage": 48.75,
      "pathwayEfficiency": 61.08,
      "alleleGapPenalty": 39.34,
      "confidence": 26.65,
      "myo7aContribution": 59.54,
      "myo7bContribution": 47.99,
      "overall": 59.14
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.22,
      "myo7bActivationScore": 43.23,
      "vectorCoverage": 37.28,
      "pathwayEfficiency": 40.32,
      "alleleGapPenalty": 10.49,
      "confidence": 33.38,
      "myo7aContribution": 48.51,
      "myo7bContribution": 35.38,
      "overall": 37.66
    }
  },
  {
    "id": "ud-012",
    "input": {
      "myo7aRescue": 0.53,
      "myo7bActivation": 0.35,
      "alleleGap": 0.52,
      "vectorDelivery": 0.53,
      "evidenceStrength": 0.53,
      "pathwayFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 70.11,
      "myo7bActivationScore": 26.46,
      "vectorCoverage": 54.54,
      "pathwayEfficiency": 81.63,
      "alleleGapPenalty": 37.99,
      "confidence": 25.45,
      "myo7aContribution": 66.83,
      "myo7bContribution": 50.74,
      "overall": 65.85
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.71,
      "myo7bActivationScore": 47.87,
      "vectorCoverage": 34.54,
      "pathwayEfficiency": 44.46,
      "alleleGapPenalty": 11.42,
      "confidence": 31.03,
      "myo7aContribution": 49.63,
      "myo7bContribution": 38.37,
      "overall": 40.26
    }
  },
  {
    "id": "ud-013",
    "input": {
      "myo7aRescue": 0.57,
      "myo7bActivation": 0.36,
      "alleleGap": 0.52,
      "vectorDelivery": 0.57,
      "evidenceStrength": 0.57,
      "pathwayFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "myo7b_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 29.97,
      "myo7bActivationScore": 37.78,
      "vectorCoverage": 30.33,
      "pathwayEfficiency": 37.18,
      "alleleGapPenalty": 61.76,
      "confidence": 28.17,
      "myo7aContribution": 33.15,
      "myo7bContribution": 33.9,
      "overall": 32.21
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.91,
      "myo7bActivationScore": 47.65,
      "vectorCoverage": 35.78,
      "pathwayEfficiency": 45.39,
      "alleleGapPenalty": 10.19,
      "confidence": 32.66,
      "myo7aContribution": 50.11,
      "myo7bContribution": 38.08,
      "overall": 39.88
    }
  },
  {
    "id": "ud-014",
    "input": {
      "myo7aRescue": 0.61,
      "myo7bActivation": 0.36,
      "alleleGap": 0.52,
      "vectorDelivery": 0.61,
      "evidenceStrength": 0.61,
      "pathwayFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 72.26,
      "myo7bActivationScore": 32.99,
      "vectorCoverage": 53.42,
      "pathwayEfficiency": 65.43,
      "alleleGapPenalty": 36.16,
      "confidence": 31.09,
      "myo7aContribution": 63.97,
      "myo7bContribution": 49.88,
      "overall": 63.35
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.01,
      "myo7bActivationScore": 40.45,
      "vectorCoverage": 37.03,
      "pathwayEfficiency": 39.51,
      "alleleGapPenalty": 8.87,
      "confidence": 34.5,
      "myo7aContribution": 48.03,
      "myo7bContribution": 34.42,
      "overall": 36.36
    }
  },
  {
    "id": "ud-015",
    "input": {
      "myo7aRescue": 0.65,
      "myo7bActivation": 0.31,
      "alleleGap": 0.46,
      "vectorDelivery": 0.65,
      "evidenceStrength": 0.65,
      "pathwayFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "myo7a_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 85.64,
      "myo7bActivationScore": 25.05,
      "vectorCoverage": 44.99,
      "pathwayEfficiency": 41.09,
      "alleleGapPenalty": 32.89,
      "confidence": 35.73,
      "myo7aContribution": 61.12,
      "myo7bContribution": 46.35,
      "overall": 60.62
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 19.7,
      "myo7bActivationScore": 29.75,
      "vectorCoverage": 36.78,
      "pathwayEfficiency": 30.94,
      "alleleGapPenalty": 7.16,
      "confidence": 35.83,
      "myo7aContribution": 42,
      "myo7bContribution": 23.74,
      "overall": 26.33
    }
  },
  {
    "id": "ud-016",
    "input": {
      "myo7aRescue": 0.6,
      "myo7bActivation": 0.32,
      "alleleGap": 0.47,
      "vectorDelivery": 0.6,
      "evidenceStrength": 0.6,
      "pathwayFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 71.61,
      "myo7bActivationScore": 32.28,
      "vectorCoverage": 53.42,
      "pathwayEfficiency": 67.15,
      "alleleGapPenalty": 34.49,
      "confidence": 31.76,
      "myo7aContribution": 64.44,
      "myo7bContribution": 49.64,
      "overall": 63.9
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 32.53,
      "myo7bActivationScore": 38.42,
      "vectorCoverage": 35.47,
      "pathwayEfficiency": 37.79,
      "alleleGapPenalty": 8.89,
      "confidence": 33.58,
      "myo7aContribution": 47.06,
      "myo7bContribution": 33.86,
      "overall": 35.6
    }
  },
  {
    "id": "ud-017",
    "input": {
      "myo7aRescue": 0.64,
      "myo7bActivation": 0.33,
      "alleleGap": 0.47,
      "vectorDelivery": 0.64,
      "evidenceStrength": 0.64,
      "pathwayFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 84.16,
      "myo7bActivationScore": 25.45,
      "vectorCoverage": 67.05,
      "pathwayEfficiency": 90.94,
      "alleleGapPenalty": 33.62,
      "confidence": 34.48,
      "myo7aContribution": 77.66,
      "myo7bContribution": 56.07,
      "overall": 75.89
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.23,
      "myo7bActivationScore": 44.42,
      "vectorCoverage": 36.72,
      "pathwayEfficiency": 44.93,
      "alleleGapPenalty": 7.66,
      "confidence": 35.21,
      "myo7aContribution": 49.93,
      "myo7bContribution": 36.76,
      "overall": 38.24
    }
  },
  {
    "id": "ud-018",
    "input": {
      "myo7aRescue": 0.68,
      "myo7bActivation": 0.27,
      "alleleGap": 0.41,
      "vectorDelivery": 0.68,
      "evidenceStrength": 0.68,
      "pathwayFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "myo7b_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 38.01,
      "myo7bActivationScore": 37.81,
      "vectorCoverage": 39.98,
      "pathwayEfficiency": 43.29,
      "alleleGapPenalty": 54.9,
      "confidence": 39.32,
      "myo7aContribution": 41,
      "myo7bContribution": 36.61,
      "overall": 39.57
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.82,
      "myo7bActivationScore": 40.64,
      "vectorCoverage": 36.47,
      "pathwayEfficiency": 43.47,
      "alleleGapPenalty": 5.86,
      "confidence": 36.75,
      "myo7aContribution": 49.31,
      "myo7bContribution": 35.77,
      "overall": 37.01
    }
  },
  {
    "id": "ud-019",
    "input": {
      "myo7aRescue": 0.72,
      "myo7bActivation": 0.28,
      "alleleGap": 0.41,
      "vectorDelivery": 0.72,
      "evidenceStrength": 0.72,
      "pathwayFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 85.55,
      "myo7bActivationScore": 32.22,
      "vectorCoverage": 65.28,
      "pathwayEfficiency": 75.54,
      "alleleGapPenalty": 29.39,
      "confidence": 42.04,
      "myo7aContribution": 74.98,
      "myo7bContribution": 54.95,
      "overall": 73.73
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.51,
      "myo7bActivationScore": 35,
      "vectorCoverage": 37.71,
      "pathwayEfficiency": 38.97,
      "alleleGapPenalty": 4.63,
      "confidence": 38.38,
      "myo7aContribution": 47.71,
      "myo7bContribution": 32.71,
      "overall": 34.01
    }
  },
  {
    "id": "ud-020",
    "input": {
      "myo7aRescue": 0.68,
      "myo7bActivation": 0.29,
      "alleleGap": 0.41,
      "vectorDelivery": 0.68,
      "evidenceStrength": 0.68,
      "pathwayFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "myo7a_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 89.68,
      "myo7bActivationScore": 24.53,
      "vectorCoverage": 47.98,
      "pathwayEfficiency": 42.76,
      "alleleGapPenalty": 30.44,
      "confidence": 38.92,
      "myo7aContribution": 64.06,
      "myo7bContribution": 47.49,
      "overall": 63.44
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 19.01,
      "myo7bActivationScore": 28.45,
      "vectorCoverage": 36.47,
      "pathwayEfficiency": 30.92,
      "alleleGapPenalty": 6.04,
      "confidence": 36.33,
      "myo7aContribution": 41.76,
      "myo7bContribution": 23.14,
      "overall": 25.38
    }
  },
  {
    "id": "ud-021",
    "input": {
      "myo7aRescue": 0.72,
      "myo7bActivation": 0.24,
      "alleleGap": 0.35,
      "vectorDelivery": 0.72,
      "evidenceStrength": 0.72,
      "pathwayFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 86.04,
      "myo7bActivationScore": 31.56,
      "vectorCoverage": 66.36,
      "pathwayEfficiency": 77.87,
      "alleleGapPenalty": 27.17,
      "confidence": 43.56,
      "myo7aContribution": 76.35,
      "myo7bContribution": 55.13,
      "overall": 75.13
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.7,
      "myo7bActivationScore": 32.54,
      "vectorCoverage": 36.21,
      "pathwayEfficiency": 37.16,
      "alleleGapPenalty": 4.33,
      "confidence": 37.66,
      "myo7aContribution": 46.66,
      "myo7bContribution": 31.84,
      "overall": 32.86
    }
  },
  {
    "id": "ud-022",
    "input": {
      "myo7aRescue": 0.76,
      "myo7bActivation": 0.25,
      "alleleGap": 0.35,
      "vectorDelivery": 0.76,
      "evidenceStrength": 0.76,
      "pathwayFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 100,
      "myo7bActivationScore": 23.38,
      "vectorCoverage": 81.86,
      "pathwayEfficiency": 100,
      "alleleGapPenalty": 26.3,
      "confidence": 46.28,
      "myo7aContribution": 90.19,
      "myo7bContribution": 61.25,
      "overall": 87.58
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 30.4,
      "myo7bActivationScore": 36.96,
      "vectorCoverage": 37.46,
      "pathwayEfficiency": 42.71,
      "alleleGapPenalty": 3.1,
      "confidence": 39.29,
      "myo7aContribution": 48.89,
      "myo7bContribution": 33.87,
      "overall": 34.67
    }
  },
  {
    "id": "ud-023",
    "input": {
      "myo7aRescue": 0.8,
      "myo7bActivation": 0.25,
      "alleleGap": 0.35,
      "vectorDelivery": 0.8,
      "evidenceStrength": 0.8,
      "pathwayFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "myo7b_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 46.06,
      "myo7bActivationScore": 39.13,
      "vectorCoverage": 49.41,
      "pathwayEfficiency": 47.52,
      "alleleGapPenalty": 49.98,
      "confidence": 49.2,
      "myo7aContribution": 48.03,
      "myo7bContribution": 39.52,
      "overall": 46.1
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 30,
      "myo7bActivationScore": 36.64,
      "vectorCoverage": 38.71,
      "pathwayEfficiency": 43.71,
      "alleleGapPenalty": 1.78,
      "confidence": 41.13,
      "myo7aContribution": 49.46,
      "myo7bContribution": 33.78,
      "overall": 34.53
    }
  },
  {
    "id": "ud-024",
    "input": {
      "myo7aRescue": 0.76,
      "myo7bActivation": 0.2,
      "alleleGap": 0.29,
      "vectorDelivery": 0.76,
      "evidenceStrength": 0.76,
      "pathwayFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 91.01,
      "myo7bActivationScore": 31.1,
      "vectorCoverage": 71.03,
      "pathwayEfficiency": 82.22,
      "alleleGapPenalty": 23.99,
      "confidence": 48,
      "myo7aContribution": 80.78,
      "myo7bContribution": 57.02,
      "overall": 79.34
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 31.48,
      "myo7bActivationScore": 29.76,
      "vectorCoverage": 35.96,
      "pathwayEfficiency": 36.34,
      "alleleGapPenalty": 2.71,
      "confidence": 38.78,
      "myo7aContribution": 46.17,
      "myo7bContribution": 30.88,
      "overall": 31.56
    }
  },
  {
    "id": "ud-025",
    "input": {
      "myo7aRescue": 0.8,
      "myo7bActivation": 0.21,
      "alleleGap": 0.29,
      "vectorDelivery": 0.8,
      "evidenceStrength": 0.8,
      "pathwayFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "myo7a_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 100,
      "myo7bActivationScore": 22.47,
      "vectorCoverage": 58.49,
      "pathwayEfficiency": 48.95,
      "alleleGapPenalty": 23.12,
      "confidence": 50.72,
      "myo7aContribution": 72.98,
      "myo7bContribution": 50.17,
      "overall": 71.71
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 18.18,
      "myo7bActivationScore": 24.62,
      "vectorCoverage": 37.21,
      "pathwayEfficiency": 32.33,
      "alleleGapPenalty": 1.48,
      "confidence": 40.41,
      "myo7aContribution": 42.17,
      "myo7bContribution": 22.24,
      "overall": 23.68
    }
  },
  {
    "id": "ud-026",
    "input": {
      "myo7aRescue": 0.83,
      "myo7bActivation": 0.22,
      "alleleGap": 0.3,
      "vectorDelivery": 0.83,
      "evidenceStrength": 0.83,
      "pathwayFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 98.63,
      "myo7bActivationScore": 31.78,
      "vectorCoverage": 77.13,
      "pathwayEfficiency": 84.81,
      "alleleGapPenalty": 22.8,
      "confidence": 52.59,
      "myo7aContribution": 85.71,
      "myo7bContribution": 59.91,
      "overall": 83.87
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 30.22,
      "myo7bActivationScore": 29.75,
      "vectorCoverage": 38.4,
      "pathwayEfficiency": 38.29,
      "alleleGapPenalty": 0.57,
      "confidence": 41.84,
      "myo7aContribution": 47.22,
      "myo7bContribution": 30.59,
      "overall": 31.18
    }
  },
  {
    "id": "ud-027",
    "input": {
      "myo7aRescue": 0.87,
      "myo7bActivation": 0.17,
      "alleleGap": 0.24,
      "vectorDelivery": 0.87,
      "evidenceStrength": 0.87,
      "pathwayFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 100,
      "myo7bActivationScore": 21.37,
      "vectorCoverage": 95.45,
      "pathwayEfficiency": 100,
      "alleleGapPenalty": 19.53,
      "confidence": 57.23,
      "myo7aContribution": 95.21,
      "myo7bContribution": 59.21,
      "overall": 91.77
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 29.9,
      "myo7bActivationScore": 30.05,
      "vectorCoverage": 38.14,
      "pathwayEfficiency": 40.72,
      "alleleGapPenalty": 0,
      "confidence": 43.17,
      "myo7aContribution": 47.76,
      "myo7bContribution": 31.35,
      "overall": 31.51
    }
  },
  {
    "id": "ud-028",
    "input": {
      "myo7aRescue": 0.83,
      "myo7bActivation": 0.17,
      "alleleGap": 0.24,
      "vectorDelivery": 0.83,
      "evidenceStrength": 0.83,
      "pathwayFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "myo7b_first",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 48.79,
      "myo7bActivationScore": 38.22,
      "vectorCoverage": 53.48,
      "pathwayEfficiency": 51.15,
      "alleleGapPenalty": 45.13,
      "confidence": 54.31,
      "myo7aContribution": 51.72,
      "myo7bContribution": 40.22,
      "overall": 49.69
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 30.3,
      "myo7bActivationScore": 30.37,
      "vectorCoverage": 36.9,
      "pathwayEfficiency": 39.72,
      "alleleGapPenalty": 0.18,
      "confidence": 41.33,
      "myo7aContribution": 47.42,
      "myo7bContribution": 31.44,
      "overall": 31.71
    }
  },
  {
    "id": "ud-029",
    "input": {
      "myo7aRescue": 0.87,
      "myo7bActivation": 0.18,
      "alleleGap": 0.24,
      "vectorDelivery": 0.87,
      "evidenceStrength": 0.87,
      "pathwayFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "myo7a_gene_supplement"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 100,
      "myo7bActivationScore": 31.32,
      "vectorCoverage": 81.81,
      "pathwayEfficiency": 89.16,
      "alleleGapPenalty": 19.62,
      "confidence": 57.03,
      "myo7aContribution": 88.99,
      "myo7bContribution": 60.54,
      "overall": 86.91
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 30,
      "myo7bActivationScore": 26.98,
      "vectorCoverage": 38.14,
      "pathwayEfficiency": 37.47,
      "alleleGapPenalty": 0,
      "confidence": 42.96,
      "myo7aContribution": 46.52,
      "myo7bContribution": 29.63,
      "overall": 29.84
    }
  },
  {
    "id": "ud-030",
    "input": {
      "myo7aRescue": 0.91,
      "myo7bActivation": 0.13,
      "alleleGap": 0.18,
      "vectorDelivery": 0.91,
      "evidenceStrength": 0.91,
      "pathwayFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "myo7a_first",
      "profile": "myo7b_activation"
    },
    "expectedMyo7a": {
      "mode": "myo7a_gene_supplement",
      "myo7aRescueScore": 100,
      "myo7bActivationScore": 20.46,
      "vectorCoverage": 68.13,
      "pathwayEfficiency": 54.79,
      "alleleGapPenalty": 16.35,
      "confidence": 61.67,
      "myo7aContribution": 78.19,
      "myo7bContribution": 49.29,
      "overall": 76.27
    },
    "expectedMyo7b": {
      "mode": "myo7b_activation",
      "myo7aRescueScore": 17.69,
      "myo7bActivationScore": 21.03,
      "vectorCoverage": 37.89,
      "pathwayEfficiency": 33.67,
      "alleleGapPenalty": 0,
      "confidence": 44.29,
      "myo7aContribution": 42.06,
      "myo7bContribution": 21.56,
      "overall": 22.18
    }
  }
];
