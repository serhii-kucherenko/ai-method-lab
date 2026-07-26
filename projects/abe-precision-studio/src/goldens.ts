import type { AbePrecisionInput, AbePrecisionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AbePrecisionInput;
  expectedInsertion: AbePrecisionQuality;
  expectedBaseline: AbePrecisionQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ap-001",
    "input": {
      "windowNarrowing": 0.34,
      "baselineWindowBreadth": 0.5,
      "assayFidelity": 0.34,
      "insertionCompleteness": 0.34,
      "evidenceStrength": 0.34,
      "editorFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 40.3,
      "baselineScore": 33.95,
      "insertionCoverage": 38.53,
      "editorEfficiency": 43.72,
      "baselineOnlyPenalty": 32.93,
      "confidence": 14.82,
      "insertionContribution": 45.38,
      "baselineContribution": 35.98,
      "overall": 47.69
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.41,
      "baselineScore": 39.66,
      "insertionCoverage": 32.11,
      "editorEfficiency": 30.44,
      "baselineOnlyPenalty": 20.37,
      "confidence": 18.17,
      "insertionContribution": 41.85,
      "baselineContribution": 29.33,
      "overall": 27.38
    }
  },
  {
    "id": "ap-002",
    "input": {
      "windowNarrowing": 0.38,
      "baselineWindowBreadth": 0.51,
      "assayFidelity": 0.38,
      "insertionCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "editorFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 49.41,
      "baselineScore": 30.04,
      "insertionCoverage": 48.08,
      "editorEfficiency": 60.71,
      "baselineOnlyPenalty": 31.83,
      "confidence": 17.54,
      "insertionContribution": 54.9,
      "baselineContribution": 40.85,
      "overall": 56.37
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.46,
      "baselineScore": 48.65,
      "insertionCoverage": 32.36,
      "editorEfficiency": 38.64,
      "baselineOnlyPenalty": 18.8,
      "confidence": 20.2,
      "insertionContribution": 45.26,
      "baselineContribution": 33.28,
      "overall": 30.96
    }
  },
  {
    "id": "ap-003",
    "input": {
      "windowNarrowing": 0.42,
      "baselineWindowBreadth": 0.46,
      "assayFidelity": 0.42,
      "insertionCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "editorFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "baseline_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 19.24,
      "baselineScore": 37.37,
      "insertionCoverage": 29.25,
      "editorEfficiency": 29.71,
      "baselineOnlyPenalty": 54.68,
      "confidence": 21.46,
      "insertionContribution": 29.04,
      "baselineContribution": 28.7,
      "overall": 29.98
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.43,
      "baselineScore": 45.98,
      "insertionCoverage": 32.6,
      "editorEfficiency": 37.55,
      "baselineOnlyPenalty": 16.76,
      "confidence": 21.76,
      "insertionContribution": 45.16,
      "baselineContribution": 32.84,
      "overall": 30.69
    }
  },
  {
    "id": "ap-004",
    "input": {
      "windowNarrowing": 0.38,
      "baselineWindowBreadth": 0.46,
      "assayFidelity": 0.38,
      "insertionCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "editorFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 45.25,
      "baselineScore": 33.49,
      "insertionCoverage": 42.12,
      "editorEfficiency": 47.84,
      "baselineOnlyPenalty": 31.25,
      "confidence": 18.54,
      "insertionContribution": 49.17,
      "baselineContribution": 37.97,
      "overall": 51.15
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.97,
      "baselineScore": 38.2,
      "insertionCoverage": 32.36,
      "editorEfficiency": 30.33,
      "baselineOnlyPenalty": 18.41,
      "confidence": 19.81,
      "insertionContribution": 42.09,
      "baselineContribution": 29.29,
      "overall": 27.45
    }
  },
  {
    "id": "ap-005",
    "input": {
      "windowNarrowing": 0.42,
      "baselineWindowBreadth": 0.47,
      "assayFidelity": 0.42,
      "insertionCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "editorFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "insertion_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 54.9,
      "baselineScore": 29.13,
      "insertionCoverage": 37.25,
      "editorEfficiency": 29.47,
      "baselineOnlyPenalty": 30.15,
      "confidence": 21.26,
      "insertionContribution": 47.05,
      "baselineContribution": 35.8,
      "overall": 49.02
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.02,
      "baselineScore": 28.23,
      "insertionCoverage": 32.6,
      "editorEfficiency": 23.79,
      "baselineOnlyPenalty": 16.84,
      "confidence": 21.84,
      "insertionContribution": 36.36,
      "baselineContribution": 18.26,
      "overall": 17.32
    }
  },
  {
    "id": "ap-006",
    "input": {
      "windowNarrowing": 0.45,
      "baselineWindowBreadth": 0.42,
      "assayFidelity": 0.45,
      "insertionCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "editorFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 53.61,
      "baselineScore": 33.18,
      "insertionCoverage": 48.41,
      "editorEfficiency": 53.95,
      "baselineOnlyPenalty": 28.66,
      "confidence": 24.45,
      "insertionContribution": 55.42,
      "baselineContribution": 41.33,
      "overall": 56.88
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.75,
      "baselineScore": 36.7,
      "insertionCoverage": 32.79,
      "editorEfficiency": 31.07,
      "baselineOnlyPenalty": 15.22,
      "confidence": 22.92,
      "insertionContribution": 42.62,
      "baselineContribution": 29.11,
      "overall": 27.31
    }
  },
  {
    "id": "ap-007",
    "input": {
      "windowNarrowing": 0.49,
      "baselineWindowBreadth": 0.43,
      "assayFidelity": 0.49,
      "insertionCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "editorFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 64.21,
      "baselineScore": 28.03,
      "insertionCoverage": 59.69,
      "editorEfficiency": 74.31,
      "baselineOnlyPenalty": 27.56,
      "confidence": 27.17,
      "insertionContribution": 66.65,
      "baselineContribution": 46.96,
      "overall": 67.11
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.8,
      "baselineScore": 44.33,
      "insertionCoverage": 33.04,
      "editorEfficiency": 38.21,
      "baselineOnlyPenalty": 13.65,
      "confidence": 24.95,
      "insertionContribution": 45.55,
      "baselineContribution": 32.38,
      "overall": 30.25
    }
  },
  {
    "id": "ap-008",
    "input": {
      "windowNarrowing": 0.45,
      "baselineWindowBreadth": 0.44,
      "assayFidelity": 0.45,
      "insertionCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "editorFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "baseline_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 21.39,
      "baselineScore": 37.45,
      "insertionCoverage": 31.34,
      "editorEfficiency": 31.28,
      "baselineOnlyPenalty": 53.53,
      "confidence": 24.05,
      "insertionContribution": 30.87,
      "baselineContribution": 29.5,
      "overall": 31.62
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.44,
      "baselineScore": 44.9,
      "insertionCoverage": 32.79,
      "editorEfficiency": 37.52,
      "baselineOnlyPenalty": 15.37,
      "confidence": 23.07,
      "insertionContribution": 45.26,
      "baselineContribution": 32.61,
      "overall": 30.5
    }
  },
  {
    "id": "ap-009",
    "input": {
      "windowNarrowing": 0.49,
      "baselineWindowBreadth": 0.38,
      "assayFidelity": 0.49,
      "insertionCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "editorFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 58.55,
      "baselineScore": 32.72,
      "insertionCoverage": 52,
      "editorEfficiency": 58.08,
      "baselineOnlyPenalty": 26.98,
      "confidence": 28.17,
      "insertionContribution": 59.22,
      "baselineContribution": 43.32,
      "overall": 60.36
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 28.31,
      "baselineScore": 35.24,
      "insertionCoverage": 33.04,
      "editorEfficiency": 30.96,
      "baselineOnlyPenalty": 13.26,
      "confidence": 24.56,
      "insertionContribution": 42.86,
      "baselineContribution": 29.07,
      "overall": 27.37
    }
  },
  {
    "id": "ap-010",
    "input": {
      "windowNarrowing": 0.53,
      "baselineWindowBreadth": 0.39,
      "assayFidelity": 0.53,
      "insertionCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "editorFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "insertion_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 69.71,
      "baselineScore": 27.12,
      "insertionCoverage": 44.91,
      "editorEfficiency": 35.39,
      "baselineOnlyPenalty": 25.88,
      "confidence": 30.89,
      "insertionContribution": 56.01,
      "baselineContribution": 40.38,
      "overall": 57.2
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.36,
      "baselineScore": 27.02,
      "insertionCoverage": 33.29,
      "editorEfficiency": 25.78,
      "baselineOnlyPenalty": 11.69,
      "confidence": 26.59,
      "insertionContribution": 37.75,
      "baselineContribution": 18.93,
      "overall": 18.08
    }
  },
  {
    "id": "ap-011",
    "input": {
      "windowNarrowing": 0.57,
      "baselineWindowBreadth": 0.4,
      "assayFidelity": 0.57,
      "insertionCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "editorFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 67.48,
      "baselineScore": 33.45,
      "insertionCoverage": 59.19,
      "editorEfficiency": 62.63,
      "baselineOnlyPenalty": 24.79,
      "confidence": 33.61,
      "insertionContribution": 65.48,
      "baselineContribution": 46.91,
      "overall": 66.14
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.41,
      "baselineScore": 35.87,
      "insertionCoverage": 33.53,
      "editorEfficiency": 33.86,
      "baselineOnlyPenalty": 10.12,
      "confidence": 28.62,
      "insertionContribution": 43.71,
      "baselineContribution": 28.66,
      "overall": 26.72
    }
  },
  {
    "id": "ap-012",
    "input": {
      "windowNarrowing": 0.53,
      "baselineWindowBreadth": 0.35,
      "assayFidelity": 0.53,
      "insertionCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "editorFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 70.11,
      "baselineScore": 26.46,
      "insertionCoverage": 63.9,
      "editorEfficiency": 81.66,
      "baselineOnlyPenalty": 25.42,
      "confidence": 31.69,
      "insertionContribution": 71.72,
      "baselineContribution": 49.49,
      "overall": 71.72
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.97,
      "baselineScore": 40.08,
      "insertionCoverage": 33.29,
      "editorEfficiency": 35.79,
      "baselineOnlyPenalty": 11.37,
      "confidence": 26.27,
      "insertionContribution": 45.15,
      "baselineContribution": 31.78,
      "overall": 29.97
    }
  },
  {
    "id": "ap-013",
    "input": {
      "windowNarrowing": 0.57,
      "baselineWindowBreadth": 0.36,
      "assayFidelity": 0.57,
      "insertionCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "editorFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "baseline_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 30.02,
      "baselineScore": 37.78,
      "insertionCoverage": 39.69,
      "editorEfficiency": 37.56,
      "baselineOnlyPenalty": 48.96,
      "confidence": 34.41,
      "insertionContribution": 38.17,
      "baselineContribution": 32.72,
      "overall": 38.19
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.52,
      "baselineScore": 40.57,
      "insertionCoverage": 33.53,
      "editorEfficiency": 37.38,
      "baselineOnlyPenalty": 9.8,
      "confidence": 28.3,
      "insertionContribution": 45.64,
      "baselineContribution": 31.66,
      "overall": 29.73
    }
  },
  {
    "id": "ap-014",
    "input": {
      "windowNarrowing": 0.61,
      "baselineWindowBreadth": 0.36,
      "assayFidelity": 0.61,
      "insertionCompleteness": 0.61,
      "evidenceStrength": 0.61,
      "editorFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 72.42,
      "baselineScore": 32.99,
      "insertionCoverage": 62.78,
      "editorEfficiency": 66.75,
      "baselineOnlyPenalty": 23.11,
      "confidence": 37.33,
      "insertionContribution": 69.28,
      "baselineContribution": 48.89,
      "overall": 69.61
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.97,
      "baselineScore": 34.41,
      "insertionCoverage": 33.78,
      "editorEfficiency": 33.75,
      "baselineOnlyPenalty": 8.16,
      "confidence": 30.26,
      "insertionContribution": 43.95,
      "baselineContribution": 28.62,
      "overall": 26.78
    }
  },
  {
    "id": "ap-015",
    "input": {
      "windowNarrowing": 0.65,
      "baselineWindowBreadth": 0.31,
      "assayFidelity": 0.65,
      "insertionCompleteness": 0.65,
      "evidenceStrength": 0.65,
      "editorFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "insertion_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 85.78,
      "baselineScore": 25.05,
      "insertionCoverage": 53.27,
      "editorEfficiency": 41.67,
      "baselineOnlyPenalty": 21.31,
      "confidence": 41.25,
      "insertionContribution": 65.7,
      "baselineContribution": 45.36,
      "overall": 66.04
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.44,
      "baselineScore": 25.81,
      "insertionCoverage": 34.03,
      "editorEfficiency": 28.05,
      "baselineOnlyPenalty": 6.12,
      "confidence": 31.82,
      "insertionContribution": 39.24,
      "baselineContribution": 19.56,
      "overall": 18.78
    }
  },
  {
    "id": "ap-016",
    "input": {
      "windowNarrowing": 0.6,
      "baselineWindowBreadth": 0.32,
      "assayFidelity": 0.6,
      "insertionCompleteness": 0.6,
      "evidenceStrength": 0.6,
      "editorFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 71.67,
      "baselineScore": 32.28,
      "insertionCoverage": 61.88,
      "editorEfficiency": 67.58,
      "baselineOnlyPenalty": 22.94,
      "confidence": 37.4,
      "insertionContribution": 69,
      "baselineContribution": 48.59,
      "overall": 69.33
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.84,
      "baselineScore": 32.99,
      "insertionCoverage": 33.72,
      "editorEfficiency": 32.22,
      "baselineOnlyPenalty": 8.26,
      "confidence": 29.46,
      "insertionContribution": 43.7,
      "baselineContribution": 28.79,
      "overall": 27.15
    }
  },
  {
    "id": "ap-017",
    "input": {
      "windowNarrowing": 0.64,
      "baselineWindowBreadth": 0.33,
      "assayFidelity": 0.64,
      "insertionCompleteness": 0.64,
      "evidenceStrength": 0.64,
      "editorFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 84.31,
      "baselineScore": 25.45,
      "insertionCoverage": 75.51,
      "editorEfficiency": 92.42,
      "baselineOnlyPenalty": 21.85,
      "confidence": 40.12,
      "insertionContribution": 82.52,
      "baselineContribution": 55.25,
      "overall": 81.61
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.89,
      "baselineScore": 38.92,
      "insertionCoverage": 33.97,
      "editorEfficiency": 38.03,
      "baselineOnlyPenalty": 6.69,
      "confidence": 31.49,
      "insertionContribution": 46.02,
      "baselineContribution": 31.2,
      "overall": 29.28
    }
  },
  {
    "id": "ap-018",
    "input": {
      "windowNarrowing": 0.68,
      "baselineWindowBreadth": 0.27,
      "assayFidelity": 0.68,
      "insertionCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "editorFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "baseline_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 38.06,
      "baselineScore": 37.81,
      "insertionCoverage": 47.36,
      "editorEfficiency": 43.72,
      "baselineOnlyPenalty": 44.58,
      "confidence": 44.24,
      "insertionContribution": 45.03,
      "baselineContribution": 35.68,
      "overall": 44.35
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.26,
      "baselineScore": 35.72,
      "insertionCoverage": 34.22,
      "editorEfficiency": 36.5,
      "baselineOnlyPenalty": 4.57,
      "confidence": 32.97,
      "insertionContribution": 45.83,
      "baselineContribution": 30.7,
      "overall": 29.01
    }
  },
  {
    "id": "ap-019",
    "input": {
      "windowNarrowing": 0.72,
      "baselineWindowBreadth": 0.28,
      "assayFidelity": 0.72,
      "insertionCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "editorFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 85.73,
      "baselineScore": 32.22,
      "insertionCoverage": 72.66,
      "editorEfficiency": 76.99,
      "baselineOnlyPenalty": 18.84,
      "confidence": 46.96,
      "insertionContribution": 79.33,
      "baselineContribution": 54.24,
      "overall": 78.81
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.31,
      "baselineScore": 31.45,
      "insertionCoverage": 34.46,
      "editorEfficiency": 34.38,
      "baselineOnlyPenalty": 3,
      "confidence": 35,
      "insertionContribution": 44.72,
      "baselineContribution": 28.4,
      "overall": 26.71
    }
  },
  {
    "id": "ap-020",
    "input": {
      "windowNarrowing": 0.68,
      "baselineWindowBreadth": 0.29,
      "assayFidelity": 0.68,
      "insertionCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "editorFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "insertion_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 89.8,
      "baselineScore": 24.53,
      "insertionCoverage": 55.36,
      "editorEfficiency": 43.24,
      "baselineOnlyPenalty": 20.17,
      "confidence": 43.84,
      "insertionContribution": 68.12,
      "baselineContribution": 46.6,
      "overall": 68.25
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.45,
      "baselineScore": 25.5,
      "insertionCoverage": 34.22,
      "editorEfficiency": 28.62,
      "baselineOnlyPenalty": 4.73,
      "confidence": 33.13,
      "insertionContribution": 39.61,
      "baselineContribution": 19.71,
      "overall": 18.95
    }
  },
  {
    "id": "ap-021",
    "input": {
      "windowNarrowing": 0.72,
      "baselineWindowBreadth": 0.24,
      "assayFidelity": 0.72,
      "insertionCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "editorFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 86.11,
      "baselineScore": 31.56,
      "insertionCoverage": 72.66,
      "editorEfficiency": 78.48,
      "baselineOnlyPenalty": 18.37,
      "confidence": 47.76,
      "insertionContribution": 79.86,
      "baselineContribution": 54.4,
      "overall": 79.28
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.92,
      "baselineScore": 30.02,
      "insertionCoverage": 34.46,
      "editorEfficiency": 33.13,
      "baselineOnlyPenalty": 2.69,
      "confidence": 34.69,
      "insertionContribution": 44.57,
      "baselineContribution": 28.53,
      "overall": 27.02
    }
  },
  {
    "id": "ap-022",
    "input": {
      "windowNarrowing": 0.76,
      "baselineWindowBreadth": 0.25,
      "assayFidelity": 0.76,
      "insertionCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "editorFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 100,
      "baselineScore": 23.38,
      "insertionCoverage": 88.16,
      "editorEfficiency": 100,
      "baselineOnlyPenalty": 17.28,
      "confidence": 50.48,
      "insertionContribution": 93.57,
      "baselineContribution": 60.35,
      "overall": 91.59
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.97,
      "baselineScore": 34.59,
      "insertionCoverage": 34.71,
      "editorEfficiency": 37.89,
      "baselineOnlyPenalty": 1.12,
      "confidence": 36.72,
      "insertionContribution": 46.41,
      "baselineContribution": 30.25,
      "overall": 28.51
    }
  },
  {
    "id": "ap-023",
    "input": {
      "windowNarrowing": 0.8,
      "baselineWindowBreadth": 0.25,
      "assayFidelity": 0.8,
      "insertionCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "editorFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "baseline_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 46.2,
      "baselineScore": 39.13,
      "insertionCoverage": 55.71,
      "editorEfficiency": 48.57,
      "baselineOnlyPenalty": 40.71,
      "confidence": 53.4,
      "insertionContribution": 51.74,
      "baselineContribution": 38.85,
      "overall": 50.42
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 24.92,
      "baselineScore": 34.55,
      "insertionCoverage": 34.96,
      "editorEfficiency": 39.03,
      "baselineOnlyPenalty": 0,
      "confidence": 38.67,
      "insertionContribution": 46.69,
      "baselineContribution": 30.08,
      "overall": 28.23
    }
  },
  {
    "id": "ap-024",
    "input": {
      "windowNarrowing": 0.76,
      "baselineWindowBreadth": 0.2,
      "assayFidelity": 0.76,
      "insertionCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "editorFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 91.06,
      "baselineScore": 31.1,
      "insertionCoverage": 76.25,
      "editorEfficiency": 82.6,
      "baselineOnlyPenalty": 16.69,
      "confidence": 51.48,
      "insertionContribution": 83.66,
      "baselineContribution": 56.38,
      "overall": 82.75
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 28.48,
      "baselineScore": 28.56,
      "insertionCoverage": 34.71,
      "editorEfficiency": 33.02,
      "baselineOnlyPenalty": 0.73,
      "confidence": 36.33,
      "insertionContribution": 44.81,
      "baselineContribution": 28.49,
      "overall": 27.08
    }
  },
  {
    "id": "ap-025",
    "input": {
      "windowNarrowing": 0.8,
      "baselineWindowBreadth": 0.21,
      "assayFidelity": 0.8,
      "insertionCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "editorFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "insertion_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 100,
      "baselineScore": 22.47,
      "insertionCoverage": 63.71,
      "editorEfficiency": 49.53,
      "baselineOnlyPenalty": 15.6,
      "confidence": 54.2,
      "insertionContribution": 75.93,
      "baselineContribution": 49.53,
      "overall": 75.18
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.53,
      "baselineScore": 24.28,
      "insertionCoverage": 34.96,
      "editorEfficiency": 30.9,
      "baselineOnlyPenalty": 0,
      "confidence": 38.36,
      "insertionContribution": 40.93,
      "baselineContribution": 20.34,
      "overall": 19.61
    }
  },
  {
    "id": "ap-026",
    "input": {
      "windowNarrowing": 0.83,
      "baselineWindowBreadth": 0.22,
      "assayFidelity": 0.83,
      "insertionCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "editorFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 98.84,
      "baselineScore": 31.78,
      "insertionCoverage": 82.53,
      "editorEfficiency": 86.49,
      "baselineOnlyPenalty": 14.81,
      "confidence": 56.19,
      "insertionContribution": 89.1,
      "baselineContribution": 59.52,
      "overall": 87.78
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 25.84,
      "baselineScore": 29.2,
      "insertionCoverage": 35.15,
      "editorEfficiency": 35.64,
      "baselineOnlyPenalty": 0,
      "confidence": 39.9,
      "insertionContribution": 45.17,
      "baselineContribution": 28.12,
      "overall": 26.4
    }
  },
  {
    "id": "ap-027",
    "input": {
      "windowNarrowing": 0.87,
      "baselineWindowBreadth": 0.17,
      "assayFidelity": 0.87,
      "insertionCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "editorFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 100,
      "baselineScore": 21.37,
      "insertionCoverage": 99.77,
      "editorEfficiency": 100,
      "baselineOnlyPenalty": 13.01,
      "confidence": 60.11,
      "insertionContribution": 97.59,
      "baselineContribution": 58.56,
      "overall": 94.56
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.31,
      "baselineScore": 30.27,
      "insertionCoverage": 35.39,
      "editorEfficiency": 37.47,
      "baselineOnlyPenalty": 0,
      "confidence": 41.46,
      "insertionContribution": 45.89,
      "baselineContribution": 29.35,
      "overall": 27.62
    }
  },
  {
    "id": "ap-028",
    "input": {
      "windowNarrowing": 0.83,
      "baselineWindowBreadth": 0.17,
      "assayFidelity": 0.83,
      "insertionCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "editorFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "baseline_first",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 48.85,
      "baselineScore": 38.22,
      "insertionCoverage": 57.8,
      "editorEfficiency": 51.58,
      "baselineOnlyPenalty": 38.86,
      "confidence": 57.19,
      "insertionContribution": 54.17,
      "baselineContribution": 39.7,
      "overall": 52.57
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 27.35,
      "baselineScore": 30.31,
      "insertionCoverage": 35.15,
      "editorEfficiency": 36.33,
      "baselineOnlyPenalty": 0,
      "confidence": 39.51,
      "insertionContribution": 45.83,
      "baselineContribution": 29.52,
      "overall": 27.94
    }
  },
  {
    "id": "ap-029",
    "input": {
      "windowNarrowing": 0.87,
      "baselineWindowBreadth": 0.18,
      "assayFidelity": 0.87,
      "insertionCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "editorFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "domain_insertion_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 100,
      "baselineScore": 31.32,
      "insertionCoverage": 86.13,
      "editorEfficiency": 90.62,
      "baselineOnlyPenalty": 13.13,
      "confidence": 59.91,
      "insertionContribution": 91.69,
      "baselineContribution": 60.18,
      "overall": 90.02
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 26.4,
      "baselineScore": 27.74,
      "insertionCoverage": 35.39,
      "editorEfficiency": 35.53,
      "baselineOnlyPenalty": 0,
      "confidence": 41.54,
      "insertionContribution": 45.01,
      "baselineContribution": 28.08,
      "overall": 26.37
    }
  },
  {
    "id": "ap-030",
    "input": {
      "windowNarrowing": 0.91,
      "baselineWindowBreadth": 0.13,
      "assayFidelity": 0.91,
      "insertionCompleteness": 0.91,
      "evidenceStrength": 0.91,
      "editorFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "insertion_first",
      "profile": "baseline_abe"
    },
    "expectedInsertion": {
      "mode": "domain_insertion_abe",
      "insertionPrecisionScore": 100,
      "baselineScore": 20.46,
      "insertionCoverage": 71.37,
      "editorEfficiency": 55.45,
      "baselineOnlyPenalty": 11.33,
      "confidence": 63.83,
      "insertionContribution": 80.14,
      "baselineContribution": 48.92,
      "overall": 78.52
    },
    "expectedBaseline": {
      "mode": "baseline_abe",
      "insertionPrecisionScore": 14.87,
      "baselineScore": 23.07,
      "insertionCoverage": 35.64,
      "editorEfficiency": 32.89,
      "baselineOnlyPenalty": 0,
      "confidence": 43.1,
      "insertionContribution": 41.29,
      "baselineContribution": 21.01,
      "overall": 20.14
    }
  }
];
