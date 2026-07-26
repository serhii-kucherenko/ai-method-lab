import type { BloodLossInput, BloodLossQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: BloodLossInput;
  expectedMeasured: BloodLossQuality;
  expectedCalculated: BloodLossQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "bl-001",
    "input": {
      "swabMassFidelity": 0.34,
      "hbDeltaCoverage": 0.5,
      "assayFidelity": 0.34,
      "methodCompleteness": 0.34,
      "evidenceStrength": 0.34,
      "birthFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 40.3,
      "calculatedLossScore": 33.95,
      "methodCoverage": 38.53,
      "birthEfficiency": 43.72,
      "calculatedOnlyPenalty": 32.93,
      "confidence": 14.82,
      "measuredContribution": 45.38,
      "calculatedContribution": 35.98,
      "overall": 47.69
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.41,
      "calculatedLossScore": 39.66,
      "methodCoverage": 32.11,
      "birthEfficiency": 30.44,
      "calculatedOnlyPenalty": 20.37,
      "confidence": 18.17,
      "measuredContribution": 41.85,
      "calculatedContribution": 29.33,
      "overall": 27.38
    }
  },
  {
    "id": "bl-002",
    "input": {
      "swabMassFidelity": 0.38,
      "hbDeltaCoverage": 0.51,
      "assayFidelity": 0.38,
      "methodCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "birthFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 49.41,
      "calculatedLossScore": 30.04,
      "methodCoverage": 48.08,
      "birthEfficiency": 60.71,
      "calculatedOnlyPenalty": 31.83,
      "confidence": 17.54,
      "measuredContribution": 54.9,
      "calculatedContribution": 40.85,
      "overall": 56.37
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.46,
      "calculatedLossScore": 48.65,
      "methodCoverage": 32.36,
      "birthEfficiency": 38.64,
      "calculatedOnlyPenalty": 18.8,
      "confidence": 20.2,
      "measuredContribution": 45.26,
      "calculatedContribution": 33.28,
      "overall": 30.96
    }
  },
  {
    "id": "bl-003",
    "input": {
      "swabMassFidelity": 0.42,
      "hbDeltaCoverage": 0.46,
      "assayFidelity": 0.42,
      "methodCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "birthFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "hb_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 19.24,
      "calculatedLossScore": 37.37,
      "methodCoverage": 29.25,
      "birthEfficiency": 29.71,
      "calculatedOnlyPenalty": 54.68,
      "confidence": 21.46,
      "measuredContribution": 29.04,
      "calculatedContribution": 28.7,
      "overall": 29.98
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.43,
      "calculatedLossScore": 45.98,
      "methodCoverage": 32.6,
      "birthEfficiency": 37.55,
      "calculatedOnlyPenalty": 16.76,
      "confidence": 21.76,
      "measuredContribution": 45.16,
      "calculatedContribution": 32.84,
      "overall": 30.69
    }
  },
  {
    "id": "bl-004",
    "input": {
      "swabMassFidelity": 0.38,
      "hbDeltaCoverage": 0.46,
      "assayFidelity": 0.38,
      "methodCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "birthFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 45.25,
      "calculatedLossScore": 33.49,
      "methodCoverage": 42.12,
      "birthEfficiency": 47.84,
      "calculatedOnlyPenalty": 31.25,
      "confidence": 18.54,
      "measuredContribution": 49.17,
      "calculatedContribution": 37.97,
      "overall": 51.15
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.97,
      "calculatedLossScore": 38.2,
      "methodCoverage": 32.36,
      "birthEfficiency": 30.33,
      "calculatedOnlyPenalty": 18.41,
      "confidence": 19.81,
      "measuredContribution": 42.09,
      "calculatedContribution": 29.29,
      "overall": 27.45
    }
  },
  {
    "id": "bl-005",
    "input": {
      "swabMassFidelity": 0.42,
      "hbDeltaCoverage": 0.47,
      "assayFidelity": 0.42,
      "methodCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "birthFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "swab_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 54.9,
      "calculatedLossScore": 29.13,
      "methodCoverage": 37.25,
      "birthEfficiency": 29.47,
      "calculatedOnlyPenalty": 30.15,
      "confidence": 21.26,
      "measuredContribution": 47.05,
      "calculatedContribution": 35.8,
      "overall": 49.02
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.02,
      "calculatedLossScore": 28.23,
      "methodCoverage": 32.6,
      "birthEfficiency": 23.79,
      "calculatedOnlyPenalty": 16.84,
      "confidence": 21.84,
      "measuredContribution": 36.36,
      "calculatedContribution": 18.26,
      "overall": 17.32
    }
  },
  {
    "id": "bl-006",
    "input": {
      "swabMassFidelity": 0.45,
      "hbDeltaCoverage": 0.42,
      "assayFidelity": 0.45,
      "methodCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "birthFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 53.61,
      "calculatedLossScore": 33.18,
      "methodCoverage": 48.41,
      "birthEfficiency": 53.95,
      "calculatedOnlyPenalty": 28.66,
      "confidence": 24.45,
      "measuredContribution": 55.42,
      "calculatedContribution": 41.33,
      "overall": 56.88
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.75,
      "calculatedLossScore": 36.7,
      "methodCoverage": 32.79,
      "birthEfficiency": 31.07,
      "calculatedOnlyPenalty": 15.22,
      "confidence": 22.92,
      "measuredContribution": 42.62,
      "calculatedContribution": 29.11,
      "overall": 27.31
    }
  },
  {
    "id": "bl-007",
    "input": {
      "swabMassFidelity": 0.49,
      "hbDeltaCoverage": 0.43,
      "assayFidelity": 0.49,
      "methodCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "birthFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 64.21,
      "calculatedLossScore": 28.03,
      "methodCoverage": 59.69,
      "birthEfficiency": 74.31,
      "calculatedOnlyPenalty": 27.56,
      "confidence": 27.17,
      "measuredContribution": 66.65,
      "calculatedContribution": 46.96,
      "overall": 67.11
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.8,
      "calculatedLossScore": 44.33,
      "methodCoverage": 33.04,
      "birthEfficiency": 38.21,
      "calculatedOnlyPenalty": 13.65,
      "confidence": 24.95,
      "measuredContribution": 45.55,
      "calculatedContribution": 32.38,
      "overall": 30.25
    }
  },
  {
    "id": "bl-008",
    "input": {
      "swabMassFidelity": 0.45,
      "hbDeltaCoverage": 0.44,
      "assayFidelity": 0.45,
      "methodCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "birthFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "hb_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 21.39,
      "calculatedLossScore": 37.45,
      "methodCoverage": 31.34,
      "birthEfficiency": 31.28,
      "calculatedOnlyPenalty": 53.53,
      "confidence": 24.05,
      "measuredContribution": 30.87,
      "calculatedContribution": 29.5,
      "overall": 31.62
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.44,
      "calculatedLossScore": 44.9,
      "methodCoverage": 32.79,
      "birthEfficiency": 37.52,
      "calculatedOnlyPenalty": 15.37,
      "confidence": 23.07,
      "measuredContribution": 45.26,
      "calculatedContribution": 32.61,
      "overall": 30.5
    }
  },
  {
    "id": "bl-009",
    "input": {
      "swabMassFidelity": 0.49,
      "hbDeltaCoverage": 0.38,
      "assayFidelity": 0.49,
      "methodCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "birthFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 58.55,
      "calculatedLossScore": 32.72,
      "methodCoverage": 52,
      "birthEfficiency": 58.08,
      "calculatedOnlyPenalty": 26.98,
      "confidence": 28.17,
      "measuredContribution": 59.22,
      "calculatedContribution": 43.32,
      "overall": 60.36
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 28.31,
      "calculatedLossScore": 35.24,
      "methodCoverage": 33.04,
      "birthEfficiency": 30.96,
      "calculatedOnlyPenalty": 13.26,
      "confidence": 24.56,
      "measuredContribution": 42.86,
      "calculatedContribution": 29.07,
      "overall": 27.37
    }
  },
  {
    "id": "bl-010",
    "input": {
      "swabMassFidelity": 0.53,
      "hbDeltaCoverage": 0.39,
      "assayFidelity": 0.53,
      "methodCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "birthFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "swab_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 69.71,
      "calculatedLossScore": 27.12,
      "methodCoverage": 44.91,
      "birthEfficiency": 35.39,
      "calculatedOnlyPenalty": 25.88,
      "confidence": 30.89,
      "measuredContribution": 56.01,
      "calculatedContribution": 40.38,
      "overall": 57.2
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.36,
      "calculatedLossScore": 27.02,
      "methodCoverage": 33.29,
      "birthEfficiency": 25.78,
      "calculatedOnlyPenalty": 11.69,
      "confidence": 26.59,
      "measuredContribution": 37.75,
      "calculatedContribution": 18.93,
      "overall": 18.08
    }
  },
  {
    "id": "bl-011",
    "input": {
      "swabMassFidelity": 0.57,
      "hbDeltaCoverage": 0.4,
      "assayFidelity": 0.57,
      "methodCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "birthFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 67.48,
      "calculatedLossScore": 33.45,
      "methodCoverage": 59.19,
      "birthEfficiency": 62.63,
      "calculatedOnlyPenalty": 24.79,
      "confidence": 33.61,
      "measuredContribution": 65.48,
      "calculatedContribution": 46.91,
      "overall": 66.14
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.41,
      "calculatedLossScore": 35.87,
      "methodCoverage": 33.53,
      "birthEfficiency": 33.86,
      "calculatedOnlyPenalty": 10.12,
      "confidence": 28.62,
      "measuredContribution": 43.71,
      "calculatedContribution": 28.66,
      "overall": 26.72
    }
  },
  {
    "id": "bl-012",
    "input": {
      "swabMassFidelity": 0.53,
      "hbDeltaCoverage": 0.35,
      "assayFidelity": 0.53,
      "methodCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "birthFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 70.11,
      "calculatedLossScore": 26.46,
      "methodCoverage": 63.9,
      "birthEfficiency": 81.66,
      "calculatedOnlyPenalty": 25.42,
      "confidence": 31.69,
      "measuredContribution": 71.72,
      "calculatedContribution": 49.49,
      "overall": 71.72
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.97,
      "calculatedLossScore": 40.08,
      "methodCoverage": 33.29,
      "birthEfficiency": 35.79,
      "calculatedOnlyPenalty": 11.37,
      "confidence": 26.27,
      "measuredContribution": 45.15,
      "calculatedContribution": 31.78,
      "overall": 29.97
    }
  },
  {
    "id": "bl-013",
    "input": {
      "swabMassFidelity": 0.57,
      "hbDeltaCoverage": 0.36,
      "assayFidelity": 0.57,
      "methodCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "birthFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "hb_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 30.02,
      "calculatedLossScore": 37.78,
      "methodCoverage": 39.69,
      "birthEfficiency": 37.56,
      "calculatedOnlyPenalty": 48.96,
      "confidence": 34.41,
      "measuredContribution": 38.17,
      "calculatedContribution": 32.72,
      "overall": 38.19
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.52,
      "calculatedLossScore": 40.57,
      "methodCoverage": 33.53,
      "birthEfficiency": 37.38,
      "calculatedOnlyPenalty": 9.8,
      "confidence": 28.3,
      "measuredContribution": 45.64,
      "calculatedContribution": 31.66,
      "overall": 29.73
    }
  },
  {
    "id": "bl-014",
    "input": {
      "swabMassFidelity": 0.61,
      "hbDeltaCoverage": 0.36,
      "assayFidelity": 0.61,
      "methodCompleteness": 0.61,
      "evidenceStrength": 0.61,
      "birthFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 72.42,
      "calculatedLossScore": 32.99,
      "methodCoverage": 62.78,
      "birthEfficiency": 66.75,
      "calculatedOnlyPenalty": 23.11,
      "confidence": 37.33,
      "measuredContribution": 69.28,
      "calculatedContribution": 48.89,
      "overall": 69.61
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.97,
      "calculatedLossScore": 34.41,
      "methodCoverage": 33.78,
      "birthEfficiency": 33.75,
      "calculatedOnlyPenalty": 8.16,
      "confidence": 30.26,
      "measuredContribution": 43.95,
      "calculatedContribution": 28.62,
      "overall": 26.78
    }
  },
  {
    "id": "bl-015",
    "input": {
      "swabMassFidelity": 0.65,
      "hbDeltaCoverage": 0.31,
      "assayFidelity": 0.65,
      "methodCompleteness": 0.65,
      "evidenceStrength": 0.65,
      "birthFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "swab_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 85.78,
      "calculatedLossScore": 25.05,
      "methodCoverage": 53.27,
      "birthEfficiency": 41.67,
      "calculatedOnlyPenalty": 21.31,
      "confidence": 41.25,
      "measuredContribution": 65.7,
      "calculatedContribution": 45.36,
      "overall": 66.04
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.44,
      "calculatedLossScore": 25.81,
      "methodCoverage": 34.03,
      "birthEfficiency": 28.05,
      "calculatedOnlyPenalty": 6.12,
      "confidence": 31.82,
      "measuredContribution": 39.24,
      "calculatedContribution": 19.56,
      "overall": 18.78
    }
  },
  {
    "id": "bl-016",
    "input": {
      "swabMassFidelity": 0.6,
      "hbDeltaCoverage": 0.32,
      "assayFidelity": 0.6,
      "methodCompleteness": 0.6,
      "evidenceStrength": 0.6,
      "birthFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 71.67,
      "calculatedLossScore": 32.28,
      "methodCoverage": 61.88,
      "birthEfficiency": 67.58,
      "calculatedOnlyPenalty": 22.94,
      "confidence": 37.4,
      "measuredContribution": 69,
      "calculatedContribution": 48.59,
      "overall": 69.33
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.84,
      "calculatedLossScore": 32.99,
      "methodCoverage": 33.72,
      "birthEfficiency": 32.22,
      "calculatedOnlyPenalty": 8.26,
      "confidence": 29.46,
      "measuredContribution": 43.7,
      "calculatedContribution": 28.79,
      "overall": 27.15
    }
  },
  {
    "id": "bl-017",
    "input": {
      "swabMassFidelity": 0.64,
      "hbDeltaCoverage": 0.33,
      "assayFidelity": 0.64,
      "methodCompleteness": 0.64,
      "evidenceStrength": 0.64,
      "birthFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 84.31,
      "calculatedLossScore": 25.45,
      "methodCoverage": 75.51,
      "birthEfficiency": 92.42,
      "calculatedOnlyPenalty": 21.85,
      "confidence": 40.12,
      "measuredContribution": 82.52,
      "calculatedContribution": 55.25,
      "overall": 81.61
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.89,
      "calculatedLossScore": 38.92,
      "methodCoverage": 33.97,
      "birthEfficiency": 38.03,
      "calculatedOnlyPenalty": 6.69,
      "confidence": 31.49,
      "measuredContribution": 46.02,
      "calculatedContribution": 31.2,
      "overall": 29.28
    }
  },
  {
    "id": "bl-018",
    "input": {
      "swabMassFidelity": 0.68,
      "hbDeltaCoverage": 0.27,
      "assayFidelity": 0.68,
      "methodCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "birthFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "hb_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 38.06,
      "calculatedLossScore": 37.81,
      "methodCoverage": 47.36,
      "birthEfficiency": 43.72,
      "calculatedOnlyPenalty": 44.58,
      "confidence": 44.24,
      "measuredContribution": 45.03,
      "calculatedContribution": 35.68,
      "overall": 44.35
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.26,
      "calculatedLossScore": 35.72,
      "methodCoverage": 34.22,
      "birthEfficiency": 36.5,
      "calculatedOnlyPenalty": 4.57,
      "confidence": 32.97,
      "measuredContribution": 45.83,
      "calculatedContribution": 30.7,
      "overall": 29.01
    }
  },
  {
    "id": "bl-019",
    "input": {
      "swabMassFidelity": 0.72,
      "hbDeltaCoverage": 0.28,
      "assayFidelity": 0.72,
      "methodCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "birthFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 85.73,
      "calculatedLossScore": 32.22,
      "methodCoverage": 72.66,
      "birthEfficiency": 76.99,
      "calculatedOnlyPenalty": 18.84,
      "confidence": 46.96,
      "measuredContribution": 79.33,
      "calculatedContribution": 54.24,
      "overall": 78.81
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.31,
      "calculatedLossScore": 31.45,
      "methodCoverage": 34.46,
      "birthEfficiency": 34.38,
      "calculatedOnlyPenalty": 3,
      "confidence": 35,
      "measuredContribution": 44.72,
      "calculatedContribution": 28.4,
      "overall": 26.71
    }
  },
  {
    "id": "bl-020",
    "input": {
      "swabMassFidelity": 0.68,
      "hbDeltaCoverage": 0.29,
      "assayFidelity": 0.68,
      "methodCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "birthFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "swab_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 89.8,
      "calculatedLossScore": 24.53,
      "methodCoverage": 55.36,
      "birthEfficiency": 43.24,
      "calculatedOnlyPenalty": 20.17,
      "confidence": 43.84,
      "measuredContribution": 68.12,
      "calculatedContribution": 46.6,
      "overall": 68.25
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.45,
      "calculatedLossScore": 25.5,
      "methodCoverage": 34.22,
      "birthEfficiency": 28.62,
      "calculatedOnlyPenalty": 4.73,
      "confidence": 33.13,
      "measuredContribution": 39.61,
      "calculatedContribution": 19.71,
      "overall": 18.95
    }
  },
  {
    "id": "bl-021",
    "input": {
      "swabMassFidelity": 0.72,
      "hbDeltaCoverage": 0.24,
      "assayFidelity": 0.72,
      "methodCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "birthFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 86.11,
      "calculatedLossScore": 31.56,
      "methodCoverage": 72.66,
      "birthEfficiency": 78.48,
      "calculatedOnlyPenalty": 18.37,
      "confidence": 47.76,
      "measuredContribution": 79.86,
      "calculatedContribution": 54.4,
      "overall": 79.28
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.92,
      "calculatedLossScore": 30.02,
      "methodCoverage": 34.46,
      "birthEfficiency": 33.13,
      "calculatedOnlyPenalty": 2.69,
      "confidence": 34.69,
      "measuredContribution": 44.57,
      "calculatedContribution": 28.53,
      "overall": 27.02
    }
  },
  {
    "id": "bl-022",
    "input": {
      "swabMassFidelity": 0.76,
      "hbDeltaCoverage": 0.25,
      "assayFidelity": 0.76,
      "methodCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "birthFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 100,
      "calculatedLossScore": 23.38,
      "methodCoverage": 88.16,
      "birthEfficiency": 100,
      "calculatedOnlyPenalty": 17.28,
      "confidence": 50.48,
      "measuredContribution": 93.57,
      "calculatedContribution": 60.35,
      "overall": 91.59
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.97,
      "calculatedLossScore": 34.59,
      "methodCoverage": 34.71,
      "birthEfficiency": 37.89,
      "calculatedOnlyPenalty": 1.12,
      "confidence": 36.72,
      "measuredContribution": 46.41,
      "calculatedContribution": 30.25,
      "overall": 28.51
    }
  },
  {
    "id": "bl-023",
    "input": {
      "swabMassFidelity": 0.8,
      "hbDeltaCoverage": 0.25,
      "assayFidelity": 0.8,
      "methodCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "birthFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "hb_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 46.2,
      "calculatedLossScore": 39.13,
      "methodCoverage": 55.71,
      "birthEfficiency": 48.57,
      "calculatedOnlyPenalty": 40.71,
      "confidence": 53.4,
      "measuredContribution": 51.74,
      "calculatedContribution": 38.85,
      "overall": 50.42
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 24.92,
      "calculatedLossScore": 34.55,
      "methodCoverage": 34.96,
      "birthEfficiency": 39.03,
      "calculatedOnlyPenalty": 0,
      "confidence": 38.67,
      "measuredContribution": 46.69,
      "calculatedContribution": 30.08,
      "overall": 28.23
    }
  },
  {
    "id": "bl-024",
    "input": {
      "swabMassFidelity": 0.76,
      "hbDeltaCoverage": 0.2,
      "assayFidelity": 0.76,
      "methodCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "birthFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 91.06,
      "calculatedLossScore": 31.1,
      "methodCoverage": 76.25,
      "birthEfficiency": 82.6,
      "calculatedOnlyPenalty": 16.69,
      "confidence": 51.48,
      "measuredContribution": 83.66,
      "calculatedContribution": 56.38,
      "overall": 82.75
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 28.48,
      "calculatedLossScore": 28.56,
      "methodCoverage": 34.71,
      "birthEfficiency": 33.02,
      "calculatedOnlyPenalty": 0.73,
      "confidence": 36.33,
      "measuredContribution": 44.81,
      "calculatedContribution": 28.49,
      "overall": 27.08
    }
  },
  {
    "id": "bl-025",
    "input": {
      "swabMassFidelity": 0.8,
      "hbDeltaCoverage": 0.21,
      "assayFidelity": 0.8,
      "methodCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "birthFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "swab_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 100,
      "calculatedLossScore": 22.47,
      "methodCoverage": 63.71,
      "birthEfficiency": 49.53,
      "calculatedOnlyPenalty": 15.6,
      "confidence": 54.2,
      "measuredContribution": 75.93,
      "calculatedContribution": 49.53,
      "overall": 75.18
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.53,
      "calculatedLossScore": 24.28,
      "methodCoverage": 34.96,
      "birthEfficiency": 30.9,
      "calculatedOnlyPenalty": 0,
      "confidence": 38.36,
      "measuredContribution": 40.93,
      "calculatedContribution": 20.34,
      "overall": 19.61
    }
  },
  {
    "id": "bl-026",
    "input": {
      "swabMassFidelity": 0.83,
      "hbDeltaCoverage": 0.22,
      "assayFidelity": 0.83,
      "methodCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "birthFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 98.84,
      "calculatedLossScore": 31.78,
      "methodCoverage": 82.53,
      "birthEfficiency": 86.49,
      "calculatedOnlyPenalty": 14.81,
      "confidence": 56.19,
      "measuredContribution": 89.1,
      "calculatedContribution": 59.52,
      "overall": 87.78
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 25.84,
      "calculatedLossScore": 29.2,
      "methodCoverage": 35.15,
      "birthEfficiency": 35.64,
      "calculatedOnlyPenalty": 0,
      "confidence": 39.9,
      "measuredContribution": 45.17,
      "calculatedContribution": 28.12,
      "overall": 26.4
    }
  },
  {
    "id": "bl-027",
    "input": {
      "swabMassFidelity": 0.87,
      "hbDeltaCoverage": 0.17,
      "assayFidelity": 0.87,
      "methodCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "birthFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 100,
      "calculatedLossScore": 21.37,
      "methodCoverage": 99.77,
      "birthEfficiency": 100,
      "calculatedOnlyPenalty": 13.01,
      "confidence": 60.11,
      "measuredContribution": 97.59,
      "calculatedContribution": 58.56,
      "overall": 94.56
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.31,
      "calculatedLossScore": 30.27,
      "methodCoverage": 35.39,
      "birthEfficiency": 37.47,
      "calculatedOnlyPenalty": 0,
      "confidence": 41.46,
      "measuredContribution": 45.89,
      "calculatedContribution": 29.35,
      "overall": 27.62
    }
  },
  {
    "id": "bl-028",
    "input": {
      "swabMassFidelity": 0.83,
      "hbDeltaCoverage": 0.17,
      "assayFidelity": 0.83,
      "methodCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "birthFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "hb_first",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 48.85,
      "calculatedLossScore": 38.22,
      "methodCoverage": 57.8,
      "birthEfficiency": 51.58,
      "calculatedOnlyPenalty": 38.86,
      "confidence": 57.19,
      "measuredContribution": 54.17,
      "calculatedContribution": 39.7,
      "overall": 52.57
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 27.35,
      "calculatedLossScore": 30.31,
      "methodCoverage": 35.15,
      "birthEfficiency": 36.33,
      "calculatedOnlyPenalty": 0,
      "confidence": 39.51,
      "measuredContribution": 45.83,
      "calculatedContribution": 29.52,
      "overall": 27.94
    }
  },
  {
    "id": "bl-029",
    "input": {
      "swabMassFidelity": 0.87,
      "hbDeltaCoverage": 0.18,
      "assayFidelity": 0.87,
      "methodCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "birthFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "weighed_swab_measured"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 100,
      "calculatedLossScore": 31.32,
      "methodCoverage": 86.13,
      "birthEfficiency": 90.62,
      "calculatedOnlyPenalty": 13.13,
      "confidence": 59.91,
      "measuredContribution": 91.69,
      "calculatedContribution": 60.18,
      "overall": 90.02
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 26.4,
      "calculatedLossScore": 27.74,
      "methodCoverage": 35.39,
      "birthEfficiency": 35.53,
      "calculatedOnlyPenalty": 0,
      "confidence": 41.54,
      "measuredContribution": 45.01,
      "calculatedContribution": 28.08,
      "overall": 26.37
    }
  },
  {
    "id": "bl-030",
    "input": {
      "swabMassFidelity": 0.91,
      "hbDeltaCoverage": 0.13,
      "assayFidelity": 0.91,
      "methodCompleteness": 0.91,
      "evidenceStrength": 0.91,
      "birthFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "swab_first",
      "profile": "haemoglobin_calculated"
    },
    "expectedMeasured": {
      "mode": "weighed_swab_measured",
      "measuredLossScore": 100,
      "calculatedLossScore": 20.46,
      "methodCoverage": 71.37,
      "birthEfficiency": 55.45,
      "calculatedOnlyPenalty": 11.33,
      "confidence": 63.83,
      "measuredContribution": 80.14,
      "calculatedContribution": 48.92,
      "overall": 78.52
    },
    "expectedCalculated": {
      "mode": "haemoglobin_calculated",
      "measuredLossScore": 14.87,
      "calculatedLossScore": 23.07,
      "methodCoverage": 35.64,
      "birthEfficiency": 32.89,
      "calculatedOnlyPenalty": 0,
      "confidence": 43.1,
      "measuredContribution": 41.29,
      "calculatedContribution": 21.01,
      "overall": 20.14
    }
  }
];
