import type { TubuleMpsInput, TubuleMpsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TubuleMpsInput;
  expectedVoclosporin: TubuleMpsQuality;
  expectedCyclosporine: TubuleMpsQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tm-001",
    "input": {
      "mpsPreservation": 0.34,
      "cyclosporineHarm": 0.5,
      "culture2dMasking": 0.75,
      "perfusionFidelity": 0.34,
      "evidenceStrength": 0.34,
      "regimenFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 40.27,
      "cyclosporineBaselineScore": 33.95,
      "mpsCoverage": 25.03,
      "regimenEfficiency": 43.42,
      "culture2dMaskPenalty": 51.03,
      "confidence": 5.82,
      "voclosporinContribution": 38.26,
      "cyclosporineContribution": 37.72,
      "overall": 39.16
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 34.54,
      "cyclosporineBaselineScore": 51.89,
      "mpsCoverage": 34.36,
      "regimenEfficiency": 39.83,
      "culture2dMaskPenalty": 18.81,
      "confidence": 25.12,
      "voclosporinContribution": 48.36,
      "cyclosporineContribution": 38.66,
      "overall": 42.09
    }
  },
  {
    "id": "tm-002",
    "input": {
      "mpsPreservation": 0.38,
      "cyclosporineHarm": 0.51,
      "culture2dMasking": 0.75,
      "perfusionFidelity": 0.38,
      "evidenceStrength": 0.38,
      "regimenFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 49.28,
      "cyclosporineBaselineScore": 30.04,
      "mpsCoverage": 34.58,
      "regimenEfficiency": 59.41,
      "culture2dMaskPenalty": 50.16,
      "confidence": 8.54,
      "voclosporinContribution": 47.49,
      "cyclosporineContribution": 42.38,
      "overall": 47.57
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 33.24,
      "cyclosporineBaselineScore": 61.6,
      "mpsCoverage": 35.61,
      "regimenEfficiency": 50.67,
      "culture2dMaskPenalty": 17.58,
      "confidence": 26.75,
      "voclosporinContribution": 52.71,
      "cyclosporineContribution": 43.59,
      "overall": 46.64
    }
  },
  {
    "id": "tm-003",
    "input": {
      "mpsPreservation": 0.42,
      "cyclosporineHarm": 0.46,
      "culture2dMasking": 0.69,
      "perfusionFidelity": 0.42,
      "evidenceStrength": 0.42,
      "regimenFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "cyclosporine_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 19.19,
      "cyclosporineBaselineScore": 37.37,
      "mpsCoverage": 16.83,
      "regimenEfficiency": 29.33,
      "culture2dMaskPenalty": 71.53,
      "confidence": 13.18,
      "voclosporinContribution": 22.43,
      "cyclosporineContribution": 30.3,
      "overall": 22.09
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 33.42,
      "cyclosporineBaselineScore": 57.92,
      "mpsCoverage": 35.35,
      "regimenEfficiency": 49.14,
      "culture2dMaskPenalty": 15.87,
      "confidence": 28.08,
      "voclosporinContribution": 51.99,
      "cyclosporineContribution": 42.39,
      "overall": 45.16
    }
  },
  {
    "id": "tm-004",
    "input": {
      "mpsPreservation": 0.38,
      "cyclosporineHarm": 0.46,
      "culture2dMasking": 0.69,
      "perfusionFidelity": 0.38,
      "evidenceStrength": 0.38,
      "regimenFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 45.24,
      "cyclosporineBaselineScore": 33.49,
      "mpsCoverage": 29.7,
      "regimenEfficiency": 47.78,
      "culture2dMaskPenalty": 47.85,
      "confidence": 10.26,
      "voclosporinContribution": 42.69,
      "cyclosporineContribution": 39.62,
      "overall": 43.38
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 34.32,
      "cyclosporineBaselineScore": 49.12,
      "mpsCoverage": 34.11,
      "regimenEfficiency": 39.01,
      "culture2dMaskPenalty": 17.19,
      "confidence": 26.24,
      "voclosporinContribution": 47.87,
      "cyclosporineContribution": 37.69,
      "overall": 40.79
    }
  },
  {
    "id": "tm-005",
    "input": {
      "mpsPreservation": 0.42,
      "cyclosporineHarm": 0.47,
      "culture2dMasking": 0.69,
      "perfusionFidelity": 0.42,
      "evidenceStrength": 0.42,
      "regimenFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "mps_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 54.8,
      "cyclosporineBaselineScore": 29.13,
      "mpsCoverage": 24.83,
      "regimenEfficiency": 29.06,
      "culture2dMaskPenalty": 46.98,
      "confidence": 12.98,
      "voclosporinContribution": 40.43,
      "cyclosporineContribution": 37.37,
      "overall": 41.12
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 21.02,
      "cyclosporineBaselineScore": 37.16,
      "mpsCoverage": 35.35,
      "regimenEfficiency": 28.2,
      "culture2dMaskPenalty": 15.96,
      "confidence": 27.87,
      "voclosporinContribution": 41.15,
      "cyclosporineContribution": 25.32,
      "overall": 29.4
    }
  },
  {
    "id": "tm-006",
    "input": {
      "mpsPreservation": 0.45,
      "cyclosporineHarm": 0.42,
      "culture2dMasking": 0.64,
      "perfusionFidelity": 0.45,
      "evidenceStrength": 0.45,
      "regimenFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 53.56,
      "cyclosporineBaselineScore": 33.18,
      "mpsCoverage": 36.89,
      "regimenEfficiency": 53.53,
      "culture2dMaskPenalty": 44.26,
      "confidence": 16.77,
      "voclosporinContribution": 49.28,
      "cyclosporineContribution": 42.79,
      "overall": 49.55
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 34.05,
      "cyclosporineBaselineScore": 46.44,
      "mpsCoverage": 35.04,
      "regimenEfficiency": 39.29,
      "culture2dMaskPenalty": 14.57,
      "confidence": 29,
      "voclosporinContribution": 48.05,
      "cyclosporineContribution": 36.94,
      "overall": 39.73
    }
  },
  {
    "id": "tm-007",
    "input": {
      "mpsPreservation": 0.49,
      "cyclosporineHarm": 0.43,
      "culture2dMasking": 0.64,
      "perfusionFidelity": 0.49,
      "evidenceStrength": 0.49,
      "regimenFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 64.06,
      "cyclosporineBaselineScore": 28.03,
      "mpsCoverage": 48.17,
      "regimenEfficiency": 72.83,
      "culture2dMaskPenalty": 43.39,
      "confidence": 19.49,
      "voclosporinContribution": 60.2,
      "cyclosporineContribution": 48.2,
      "overall": 59.48
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.74,
      "cyclosporineBaselineScore": 54.69,
      "mpsCoverage": 36.29,
      "regimenEfficiency": 48.68,
      "culture2dMaskPenalty": 13.34,
      "confidence": 30.63,
      "voclosporinContribution": 51.81,
      "cyclosporineContribution": 41.08,
      "overall": 43.53
    }
  },
  {
    "id": "tm-008",
    "input": {
      "mpsPreservation": 0.45,
      "cyclosporineHarm": 0.44,
      "culture2dMasking": 0.64,
      "perfusionFidelity": 0.45,
      "evidenceStrength": 0.45,
      "regimenFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "cyclosporine_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 21.36,
      "cyclosporineBaselineScore": 37.45,
      "mpsCoverage": 19.82,
      "regimenEfficiency": 31,
      "culture2dMaskPenalty": 69.08,
      "confidence": 16.37,
      "voclosporinContribution": 24.77,
      "cyclosporineContribution": 30.99,
      "overall": 24.33
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.74,
      "cyclosporineBaselineScore": 55.11,
      "mpsCoverage": 35.04,
      "regimenEfficiency": 47.61,
      "culture2dMaskPenalty": 14.75,
      "confidence": 28.58,
      "voclosporinContribution": 51.15,
      "cyclosporineContribution": 40.96,
      "overall": 43.43
    }
  },
  {
    "id": "tm-009",
    "input": {
      "mpsPreservation": 0.49,
      "cyclosporineHarm": 0.38,
      "culture2dMasking": 0.58,
      "perfusionFidelity": 0.49,
      "evidenceStrength": 0.49,
      "regimenFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 58.53,
      "cyclosporineBaselineScore": 32.72,
      "mpsCoverage": 41.56,
      "regimenEfficiency": 57.88,
      "culture2dMaskPenalty": 41.08,
      "confidence": 21.21,
      "voclosporinContribution": 53.71,
      "cyclosporineContribution": 44.68,
      "overall": 53.76
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 33.83,
      "cyclosporineBaselineScore": 43.66,
      "mpsCoverage": 34.79,
      "regimenEfficiency": 38.47,
      "culture2dMaskPenalty": 12.95,
      "confidence": 30.12,
      "voclosporinContribution": 47.56,
      "cyclosporineContribution": 35.98,
      "overall": 38.44
    }
  },
  {
    "id": "tm-010",
    "input": {
      "mpsPreservation": 0.53,
      "cyclosporineHarm": 0.39,
      "culture2dMasking": 0.58,
      "perfusionFidelity": 0.53,
      "evidenceStrength": 0.53,
      "regimenFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "mps_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 69.58,
      "cyclosporineBaselineScore": 27.12,
      "mpsCoverage": 34.47,
      "regimenEfficiency": 34.91,
      "culture2dMaskPenalty": 40.21,
      "confidence": 23.93,
      "voclosporinContribution": 50.36,
      "cyclosporineContribution": 41.67,
      "overall": 50.48
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 20.53,
      "cyclosporineBaselineScore": 33.58,
      "mpsCoverage": 36.04,
      "regimenEfficiency": 29.53,
      "culture2dMaskPenalty": 11.72,
      "confidence": 31.75,
      "voclosporinContribution": 41.59,
      "cyclosporineContribution": 24.63,
      "overall": 28.01
    }
  },
  {
    "id": "tm-011",
    "input": {
      "mpsPreservation": 0.57,
      "cyclosporineHarm": 0.4,
      "culture2dMasking": 0.58,
      "perfusionFidelity": 0.57,
      "evidenceStrength": 0.57,
      "regimenFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 67.28,
      "cyclosporineBaselineScore": 33.45,
      "mpsCoverage": 48.75,
      "regimenEfficiency": 61.08,
      "culture2dMaskPenalty": 39.34,
      "confidence": 26.65,
      "voclosporinContribution": 59.54,
      "cyclosporineContribution": 47.99,
      "overall": 59.14
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.22,
      "cyclosporineBaselineScore": 43.23,
      "mpsCoverage": 37.28,
      "regimenEfficiency": 40.32,
      "culture2dMaskPenalty": 10.49,
      "confidence": 33.38,
      "voclosporinContribution": 48.51,
      "cyclosporineContribution": 35.38,
      "overall": 37.66
    }
  },
  {
    "id": "tm-012",
    "input": {
      "mpsPreservation": 0.53,
      "cyclosporineHarm": 0.35,
      "culture2dMasking": 0.52,
      "perfusionFidelity": 0.53,
      "evidenceStrength": 0.53,
      "regimenFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 70.11,
      "cyclosporineBaselineScore": 26.46,
      "mpsCoverage": 54.54,
      "regimenEfficiency": 81.63,
      "culture2dMaskPenalty": 37.99,
      "confidence": 25.45,
      "voclosporinContribution": 66.83,
      "cyclosporineContribution": 50.74,
      "overall": 65.85
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.71,
      "cyclosporineBaselineScore": 47.87,
      "mpsCoverage": 34.54,
      "regimenEfficiency": 44.46,
      "culture2dMaskPenalty": 11.42,
      "confidence": 31.03,
      "voclosporinContribution": 49.63,
      "cyclosporineContribution": 38.37,
      "overall": 40.26
    }
  },
  {
    "id": "tm-013",
    "input": {
      "mpsPreservation": 0.57,
      "cyclosporineHarm": 0.36,
      "culture2dMasking": 0.52,
      "perfusionFidelity": 0.57,
      "evidenceStrength": 0.57,
      "regimenFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "cyclosporine_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 29.97,
      "cyclosporineBaselineScore": 37.78,
      "mpsCoverage": 30.33,
      "regimenEfficiency": 37.18,
      "culture2dMaskPenalty": 61.76,
      "confidence": 28.17,
      "voclosporinContribution": 33.15,
      "cyclosporineContribution": 33.9,
      "overall": 32.21
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.91,
      "cyclosporineBaselineScore": 47.65,
      "mpsCoverage": 35.78,
      "regimenEfficiency": 45.39,
      "culture2dMaskPenalty": 10.19,
      "confidence": 32.66,
      "voclosporinContribution": 50.11,
      "cyclosporineContribution": 38.08,
      "overall": 39.88
    }
  },
  {
    "id": "tm-014",
    "input": {
      "mpsPreservation": 0.61,
      "cyclosporineHarm": 0.36,
      "culture2dMasking": 0.52,
      "perfusionFidelity": 0.61,
      "evidenceStrength": 0.61,
      "regimenFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 72.26,
      "cyclosporineBaselineScore": 32.99,
      "mpsCoverage": 53.42,
      "regimenEfficiency": 65.43,
      "culture2dMaskPenalty": 36.16,
      "confidence": 31.09,
      "voclosporinContribution": 63.97,
      "cyclosporineContribution": 49.88,
      "overall": 63.35
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.01,
      "cyclosporineBaselineScore": 40.45,
      "mpsCoverage": 37.03,
      "regimenEfficiency": 39.51,
      "culture2dMaskPenalty": 8.87,
      "confidence": 34.5,
      "voclosporinContribution": 48.03,
      "cyclosporineContribution": 34.42,
      "overall": 36.36
    }
  },
  {
    "id": "tm-015",
    "input": {
      "mpsPreservation": 0.65,
      "cyclosporineHarm": 0.31,
      "culture2dMasking": 0.46,
      "perfusionFidelity": 0.65,
      "evidenceStrength": 0.65,
      "regimenFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "mps_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 85.64,
      "cyclosporineBaselineScore": 25.05,
      "mpsCoverage": 44.99,
      "regimenEfficiency": 41.09,
      "culture2dMaskPenalty": 32.89,
      "confidence": 35.73,
      "voclosporinContribution": 61.12,
      "cyclosporineContribution": 46.35,
      "overall": 60.62
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 19.7,
      "cyclosporineBaselineScore": 29.75,
      "mpsCoverage": 36.78,
      "regimenEfficiency": 30.94,
      "culture2dMaskPenalty": 7.16,
      "confidence": 35.83,
      "voclosporinContribution": 42,
      "cyclosporineContribution": 23.74,
      "overall": 26.33
    }
  },
  {
    "id": "tm-016",
    "input": {
      "mpsPreservation": 0.6,
      "cyclosporineHarm": 0.32,
      "culture2dMasking": 0.47,
      "perfusionFidelity": 0.6,
      "evidenceStrength": 0.6,
      "regimenFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 71.61,
      "cyclosporineBaselineScore": 32.28,
      "mpsCoverage": 53.42,
      "regimenEfficiency": 67.15,
      "culture2dMaskPenalty": 34.49,
      "confidence": 31.76,
      "voclosporinContribution": 64.44,
      "cyclosporineContribution": 49.64,
      "overall": 63.9
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 32.53,
      "cyclosporineBaselineScore": 38.42,
      "mpsCoverage": 35.47,
      "regimenEfficiency": 37.79,
      "culture2dMaskPenalty": 8.89,
      "confidence": 33.58,
      "voclosporinContribution": 47.06,
      "cyclosporineContribution": 33.86,
      "overall": 35.6
    }
  },
  {
    "id": "tm-017",
    "input": {
      "mpsPreservation": 0.64,
      "cyclosporineHarm": 0.33,
      "culture2dMasking": 0.47,
      "perfusionFidelity": 0.64,
      "evidenceStrength": 0.64,
      "regimenFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 84.16,
      "cyclosporineBaselineScore": 25.45,
      "mpsCoverage": 67.05,
      "regimenEfficiency": 90.94,
      "culture2dMaskPenalty": 33.62,
      "confidence": 34.48,
      "voclosporinContribution": 77.66,
      "cyclosporineContribution": 56.07,
      "overall": 75.89
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.23,
      "cyclosporineBaselineScore": 44.42,
      "mpsCoverage": 36.72,
      "regimenEfficiency": 44.93,
      "culture2dMaskPenalty": 7.66,
      "confidence": 35.21,
      "voclosporinContribution": 49.93,
      "cyclosporineContribution": 36.76,
      "overall": 38.24
    }
  },
  {
    "id": "tm-018",
    "input": {
      "mpsPreservation": 0.68,
      "cyclosporineHarm": 0.27,
      "culture2dMasking": 0.41,
      "perfusionFidelity": 0.68,
      "evidenceStrength": 0.68,
      "regimenFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "cyclosporine_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 38.01,
      "cyclosporineBaselineScore": 37.81,
      "mpsCoverage": 39.98,
      "regimenEfficiency": 43.29,
      "culture2dMaskPenalty": 54.9,
      "confidence": 39.32,
      "voclosporinContribution": 41,
      "cyclosporineContribution": 36.61,
      "overall": 39.57
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.82,
      "cyclosporineBaselineScore": 40.64,
      "mpsCoverage": 36.47,
      "regimenEfficiency": 43.47,
      "culture2dMaskPenalty": 5.86,
      "confidence": 36.75,
      "voclosporinContribution": 49.31,
      "cyclosporineContribution": 35.77,
      "overall": 37.01
    }
  },
  {
    "id": "tm-019",
    "input": {
      "mpsPreservation": 0.72,
      "cyclosporineHarm": 0.28,
      "culture2dMasking": 0.41,
      "perfusionFidelity": 0.72,
      "evidenceStrength": 0.72,
      "regimenFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 85.55,
      "cyclosporineBaselineScore": 32.22,
      "mpsCoverage": 65.28,
      "regimenEfficiency": 75.54,
      "culture2dMaskPenalty": 29.39,
      "confidence": 42.04,
      "voclosporinContribution": 74.98,
      "cyclosporineContribution": 54.95,
      "overall": 73.73
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.51,
      "cyclosporineBaselineScore": 35,
      "mpsCoverage": 37.71,
      "regimenEfficiency": 38.97,
      "culture2dMaskPenalty": 4.63,
      "confidence": 38.38,
      "voclosporinContribution": 47.71,
      "cyclosporineContribution": 32.71,
      "overall": 34.01
    }
  },
  {
    "id": "tm-020",
    "input": {
      "mpsPreservation": 0.68,
      "cyclosporineHarm": 0.29,
      "culture2dMasking": 0.41,
      "perfusionFidelity": 0.68,
      "evidenceStrength": 0.68,
      "regimenFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "mps_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 89.68,
      "cyclosporineBaselineScore": 24.53,
      "mpsCoverage": 47.98,
      "regimenEfficiency": 42.76,
      "culture2dMaskPenalty": 30.44,
      "confidence": 38.92,
      "voclosporinContribution": 64.06,
      "cyclosporineContribution": 47.49,
      "overall": 63.44
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 19.01,
      "cyclosporineBaselineScore": 28.45,
      "mpsCoverage": 36.47,
      "regimenEfficiency": 30.92,
      "culture2dMaskPenalty": 6.04,
      "confidence": 36.33,
      "voclosporinContribution": 41.76,
      "cyclosporineContribution": 23.14,
      "overall": 25.38
    }
  },
  {
    "id": "tm-021",
    "input": {
      "mpsPreservation": 0.72,
      "cyclosporineHarm": 0.24,
      "culture2dMasking": 0.35,
      "perfusionFidelity": 0.72,
      "evidenceStrength": 0.72,
      "regimenFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 86.04,
      "cyclosporineBaselineScore": 31.56,
      "mpsCoverage": 66.36,
      "regimenEfficiency": 77.87,
      "culture2dMaskPenalty": 27.17,
      "confidence": 43.56,
      "voclosporinContribution": 76.35,
      "cyclosporineContribution": 55.13,
      "overall": 75.13
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.7,
      "cyclosporineBaselineScore": 32.54,
      "mpsCoverage": 36.21,
      "regimenEfficiency": 37.16,
      "culture2dMaskPenalty": 4.33,
      "confidence": 37.66,
      "voclosporinContribution": 46.66,
      "cyclosporineContribution": 31.84,
      "overall": 32.86
    }
  },
  {
    "id": "tm-022",
    "input": {
      "mpsPreservation": 0.76,
      "cyclosporineHarm": 0.25,
      "culture2dMasking": 0.35,
      "perfusionFidelity": 0.76,
      "evidenceStrength": 0.76,
      "regimenFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 100,
      "cyclosporineBaselineScore": 23.38,
      "mpsCoverage": 81.86,
      "regimenEfficiency": 100,
      "culture2dMaskPenalty": 26.3,
      "confidence": 46.28,
      "voclosporinContribution": 90.19,
      "cyclosporineContribution": 61.25,
      "overall": 87.58
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 30.4,
      "cyclosporineBaselineScore": 36.96,
      "mpsCoverage": 37.46,
      "regimenEfficiency": 42.71,
      "culture2dMaskPenalty": 3.1,
      "confidence": 39.29,
      "voclosporinContribution": 48.89,
      "cyclosporineContribution": 33.87,
      "overall": 34.67
    }
  },
  {
    "id": "tm-023",
    "input": {
      "mpsPreservation": 0.8,
      "cyclosporineHarm": 0.25,
      "culture2dMasking": 0.35,
      "perfusionFidelity": 0.8,
      "evidenceStrength": 0.8,
      "regimenFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "cyclosporine_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 46.06,
      "cyclosporineBaselineScore": 39.13,
      "mpsCoverage": 49.41,
      "regimenEfficiency": 47.52,
      "culture2dMaskPenalty": 49.98,
      "confidence": 49.2,
      "voclosporinContribution": 48.03,
      "cyclosporineContribution": 39.52,
      "overall": 46.1
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 30,
      "cyclosporineBaselineScore": 36.64,
      "mpsCoverage": 38.71,
      "regimenEfficiency": 43.71,
      "culture2dMaskPenalty": 1.78,
      "confidence": 41.13,
      "voclosporinContribution": 49.46,
      "cyclosporineContribution": 33.78,
      "overall": 34.53
    }
  },
  {
    "id": "tm-024",
    "input": {
      "mpsPreservation": 0.76,
      "cyclosporineHarm": 0.2,
      "culture2dMasking": 0.29,
      "perfusionFidelity": 0.76,
      "evidenceStrength": 0.76,
      "regimenFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 91.01,
      "cyclosporineBaselineScore": 31.1,
      "mpsCoverage": 71.03,
      "regimenEfficiency": 82.22,
      "culture2dMaskPenalty": 23.99,
      "confidence": 48,
      "voclosporinContribution": 80.78,
      "cyclosporineContribution": 57.02,
      "overall": 79.34
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 31.48,
      "cyclosporineBaselineScore": 29.76,
      "mpsCoverage": 35.96,
      "regimenEfficiency": 36.34,
      "culture2dMaskPenalty": 2.71,
      "confidence": 38.78,
      "voclosporinContribution": 46.17,
      "cyclosporineContribution": 30.88,
      "overall": 31.56
    }
  },
  {
    "id": "tm-025",
    "input": {
      "mpsPreservation": 0.8,
      "cyclosporineHarm": 0.21,
      "culture2dMasking": 0.29,
      "perfusionFidelity": 0.8,
      "evidenceStrength": 0.8,
      "regimenFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "mps_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 100,
      "cyclosporineBaselineScore": 22.47,
      "mpsCoverage": 58.49,
      "regimenEfficiency": 48.95,
      "culture2dMaskPenalty": 23.12,
      "confidence": 50.72,
      "voclosporinContribution": 72.98,
      "cyclosporineContribution": 50.17,
      "overall": 71.71
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 18.18,
      "cyclosporineBaselineScore": 24.62,
      "mpsCoverage": 37.21,
      "regimenEfficiency": 32.33,
      "culture2dMaskPenalty": 1.48,
      "confidence": 40.41,
      "voclosporinContribution": 42.17,
      "cyclosporineContribution": 22.24,
      "overall": 23.68
    }
  },
  {
    "id": "tm-026",
    "input": {
      "mpsPreservation": 0.83,
      "cyclosporineHarm": 0.22,
      "culture2dMasking": 0.3,
      "perfusionFidelity": 0.83,
      "evidenceStrength": 0.83,
      "regimenFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 98.63,
      "cyclosporineBaselineScore": 31.78,
      "mpsCoverage": 77.13,
      "regimenEfficiency": 84.81,
      "culture2dMaskPenalty": 22.8,
      "confidence": 52.59,
      "voclosporinContribution": 85.71,
      "cyclosporineContribution": 59.91,
      "overall": 83.87
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 30.22,
      "cyclosporineBaselineScore": 29.75,
      "mpsCoverage": 38.4,
      "regimenEfficiency": 38.29,
      "culture2dMaskPenalty": 0.57,
      "confidence": 41.84,
      "voclosporinContribution": 47.22,
      "cyclosporineContribution": 30.59,
      "overall": 31.18
    }
  },
  {
    "id": "tm-027",
    "input": {
      "mpsPreservation": 0.87,
      "cyclosporineHarm": 0.17,
      "culture2dMasking": 0.24,
      "perfusionFidelity": 0.87,
      "evidenceStrength": 0.87,
      "regimenFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 100,
      "cyclosporineBaselineScore": 21.37,
      "mpsCoverage": 95.45,
      "regimenEfficiency": 100,
      "culture2dMaskPenalty": 19.53,
      "confidence": 57.23,
      "voclosporinContribution": 95.21,
      "cyclosporineContribution": 59.21,
      "overall": 91.77
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 29.9,
      "cyclosporineBaselineScore": 30.05,
      "mpsCoverage": 38.14,
      "regimenEfficiency": 40.72,
      "culture2dMaskPenalty": 0,
      "confidence": 43.17,
      "voclosporinContribution": 47.76,
      "cyclosporineContribution": 31.35,
      "overall": 31.51
    }
  },
  {
    "id": "tm-028",
    "input": {
      "mpsPreservation": 0.83,
      "cyclosporineHarm": 0.17,
      "culture2dMasking": 0.24,
      "perfusionFidelity": 0.83,
      "evidenceStrength": 0.83,
      "regimenFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "cyclosporine_first",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 48.79,
      "cyclosporineBaselineScore": 38.22,
      "mpsCoverage": 53.48,
      "regimenEfficiency": 51.15,
      "culture2dMaskPenalty": 45.13,
      "confidence": 54.31,
      "voclosporinContribution": 51.72,
      "cyclosporineContribution": 40.22,
      "overall": 49.69
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 30.3,
      "cyclosporineBaselineScore": 30.37,
      "mpsCoverage": 36.9,
      "regimenEfficiency": 39.72,
      "culture2dMaskPenalty": 0.18,
      "confidence": 41.33,
      "voclosporinContribution": 47.42,
      "cyclosporineContribution": 31.44,
      "overall": 31.71
    }
  },
  {
    "id": "tm-029",
    "input": {
      "mpsPreservation": 0.87,
      "cyclosporineHarm": 0.18,
      "culture2dMasking": 0.24,
      "perfusionFidelity": 0.87,
      "evidenceStrength": 0.87,
      "regimenFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "voclosporin_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 100,
      "cyclosporineBaselineScore": 31.32,
      "mpsCoverage": 81.81,
      "regimenEfficiency": 89.16,
      "culture2dMaskPenalty": 19.62,
      "confidence": 57.03,
      "voclosporinContribution": 88.99,
      "cyclosporineContribution": 60.54,
      "overall": 86.91
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 30,
      "cyclosporineBaselineScore": 26.98,
      "mpsCoverage": 38.14,
      "regimenEfficiency": 37.47,
      "culture2dMaskPenalty": 0,
      "confidence": 42.96,
      "voclosporinContribution": 46.52,
      "cyclosporineContribution": 29.63,
      "overall": 29.84
    }
  },
  {
    "id": "tm-030",
    "input": {
      "mpsPreservation": 0.91,
      "cyclosporineHarm": 0.13,
      "culture2dMasking": 0.18,
      "perfusionFidelity": 0.91,
      "evidenceStrength": 0.91,
      "regimenFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "mps_first",
      "profile": "cyclosporine_mps"
    },
    "expectedVoclosporin": {
      "mode": "voclosporin_mps",
      "mitochondrialPreservationScore": 100,
      "cyclosporineBaselineScore": 20.46,
      "mpsCoverage": 68.13,
      "regimenEfficiency": 54.79,
      "culture2dMaskPenalty": 16.35,
      "confidence": 61.67,
      "voclosporinContribution": 78.19,
      "cyclosporineContribution": 49.29,
      "overall": 76.27
    },
    "expectedCyclosporine": {
      "mode": "cyclosporine_mps",
      "mitochondrialPreservationScore": 17.69,
      "cyclosporineBaselineScore": 21.03,
      "mpsCoverage": 37.89,
      "regimenEfficiency": 33.67,
      "culture2dMaskPenalty": 0,
      "confidence": 44.29,
      "voclosporinContribution": 42.06,
      "cyclosporineContribution": 21.56,
      "overall": 22.18
    }
  }
];
