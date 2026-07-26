import type { IndexInput, IndexQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: IndexInput;
  expectedStructured: IndexQuality;
  expectedChecklist: IndexQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ri-001",
    "input": {
      "structuredDepth": 0.34,
      "checklistCoverage": 0.5,
      "indicatorFidelity": 0.34,
      "dimensionCompleteness": 0.34,
      "evidenceStrength": 0.34,
      "countryFollowThrough": 0.34,
      "indicatorReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 40.3,
      "checklistScore": 33.95,
      "dimensionCoverage": 38.53,
      "countryEfficiency": 43.72,
      "checklistOnlyPenalty": 32.93,
      "confidence": 14.82,
      "structuredContribution": 45.38,
      "checklistContribution": 35.98,
      "overall": 47.69
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.41,
      "checklistScore": 39.66,
      "dimensionCoverage": 32.11,
      "countryEfficiency": 30.44,
      "checklistOnlyPenalty": 20.37,
      "confidence": 18.17,
      "structuredContribution": 41.85,
      "checklistContribution": 29.33,
      "overall": 27.38
    }
  },
  {
    "id": "ri-002",
    "input": {
      "structuredDepth": 0.38,
      "checklistCoverage": 0.51,
      "indicatorFidelity": 0.38,
      "dimensionCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "countryFollowThrough": 0.38,
      "indicatorReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "indicator_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 49.41,
      "checklistScore": 30.04,
      "dimensionCoverage": 48.08,
      "countryEfficiency": 60.71,
      "checklistOnlyPenalty": 31.83,
      "confidence": 17.54,
      "structuredContribution": 54.9,
      "checklistContribution": 40.85,
      "overall": 56.37
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.46,
      "checklistScore": 48.65,
      "dimensionCoverage": 32.36,
      "countryEfficiency": 38.64,
      "checklistOnlyPenalty": 18.8,
      "confidence": 20.2,
      "structuredContribution": 45.26,
      "checklistContribution": 33.28,
      "overall": 30.96
    }
  },
  {
    "id": "ri-003",
    "input": {
      "structuredDepth": 0.42,
      "checklistCoverage": 0.46,
      "indicatorFidelity": 0.42,
      "dimensionCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "countryFollowThrough": 0.42,
      "indicatorReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "checklist_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 19.24,
      "checklistScore": 37.37,
      "dimensionCoverage": 29.25,
      "countryEfficiency": 29.71,
      "checklistOnlyPenalty": 54.68,
      "confidence": 21.46,
      "structuredContribution": 29.04,
      "checklistContribution": 28.7,
      "overall": 29.98
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.43,
      "checklistScore": 45.98,
      "dimensionCoverage": 32.6,
      "countryEfficiency": 37.55,
      "checklistOnlyPenalty": 16.76,
      "confidence": 21.76,
      "structuredContribution": 45.16,
      "checklistContribution": 32.84,
      "overall": 30.69
    }
  },
  {
    "id": "ri-004",
    "input": {
      "structuredDepth": 0.38,
      "checklistCoverage": 0.46,
      "indicatorFidelity": 0.38,
      "dimensionCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "countryFollowThrough": 0.38,
      "indicatorReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 45.25,
      "checklistScore": 33.49,
      "dimensionCoverage": 42.12,
      "countryEfficiency": 47.84,
      "checklistOnlyPenalty": 31.25,
      "confidence": 18.54,
      "structuredContribution": 49.17,
      "checklistContribution": 37.97,
      "overall": 51.15
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.97,
      "checklistScore": 38.2,
      "dimensionCoverage": 32.36,
      "countryEfficiency": 30.33,
      "checklistOnlyPenalty": 18.41,
      "confidence": 19.81,
      "structuredContribution": 42.09,
      "checklistContribution": 29.29,
      "overall": 27.45
    }
  },
  {
    "id": "ri-005",
    "input": {
      "structuredDepth": 0.42,
      "checklistCoverage": 0.47,
      "indicatorFidelity": 0.42,
      "dimensionCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "countryFollowThrough": 0.42,
      "indicatorReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "dimension_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 54.9,
      "checklistScore": 29.13,
      "dimensionCoverage": 37.25,
      "countryEfficiency": 29.47,
      "checklistOnlyPenalty": 30.15,
      "confidence": 21.26,
      "structuredContribution": 47.05,
      "checklistContribution": 35.8,
      "overall": 49.02
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.02,
      "checklistScore": 28.23,
      "dimensionCoverage": 32.6,
      "countryEfficiency": 23.79,
      "checklistOnlyPenalty": 16.84,
      "confidence": 21.84,
      "structuredContribution": 36.36,
      "checklistContribution": 18.26,
      "overall": 17.32
    }
  },
  {
    "id": "ri-006",
    "input": {
      "structuredDepth": 0.45,
      "checklistCoverage": 0.42,
      "indicatorFidelity": 0.45,
      "dimensionCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "countryFollowThrough": 0.45,
      "indicatorReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 53.61,
      "checklistScore": 33.18,
      "dimensionCoverage": 48.41,
      "countryEfficiency": 53.95,
      "checklistOnlyPenalty": 28.66,
      "confidence": 24.45,
      "structuredContribution": 55.42,
      "checklistContribution": 41.33,
      "overall": 56.88
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.75,
      "checklistScore": 36.7,
      "dimensionCoverage": 32.79,
      "countryEfficiency": 31.07,
      "checklistOnlyPenalty": 15.22,
      "confidence": 22.92,
      "structuredContribution": 42.62,
      "checklistContribution": 29.11,
      "overall": 27.31
    }
  },
  {
    "id": "ri-007",
    "input": {
      "structuredDepth": 0.49,
      "checklistCoverage": 0.43,
      "indicatorFidelity": 0.49,
      "dimensionCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "countryFollowThrough": 0.49,
      "indicatorReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "indicator_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 64.21,
      "checklistScore": 28.03,
      "dimensionCoverage": 59.69,
      "countryEfficiency": 74.31,
      "checklistOnlyPenalty": 27.56,
      "confidence": 27.17,
      "structuredContribution": 66.65,
      "checklistContribution": 46.96,
      "overall": 67.11
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.8,
      "checklistScore": 44.33,
      "dimensionCoverage": 33.04,
      "countryEfficiency": 38.21,
      "checklistOnlyPenalty": 13.65,
      "confidence": 24.95,
      "structuredContribution": 45.55,
      "checklistContribution": 32.38,
      "overall": 30.25
    }
  },
  {
    "id": "ri-008",
    "input": {
      "structuredDepth": 0.45,
      "checklistCoverage": 0.44,
      "indicatorFidelity": 0.45,
      "dimensionCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "countryFollowThrough": 0.45,
      "indicatorReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "checklist_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 21.39,
      "checklistScore": 37.45,
      "dimensionCoverage": 31.34,
      "countryEfficiency": 31.28,
      "checklistOnlyPenalty": 53.53,
      "confidence": 24.05,
      "structuredContribution": 30.87,
      "checklistContribution": 29.5,
      "overall": 31.62
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.44,
      "checklistScore": 44.9,
      "dimensionCoverage": 32.79,
      "countryEfficiency": 37.52,
      "checklistOnlyPenalty": 15.37,
      "confidence": 23.07,
      "structuredContribution": 45.26,
      "checklistContribution": 32.61,
      "overall": 30.5
    }
  },
  {
    "id": "ri-009",
    "input": {
      "structuredDepth": 0.49,
      "checklistCoverage": 0.38,
      "indicatorFidelity": 0.49,
      "dimensionCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "countryFollowThrough": 0.49,
      "indicatorReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 58.55,
      "checklistScore": 32.72,
      "dimensionCoverage": 52,
      "countryEfficiency": 58.08,
      "checklistOnlyPenalty": 26.98,
      "confidence": 28.17,
      "structuredContribution": 59.22,
      "checklistContribution": 43.32,
      "overall": 60.36
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 28.31,
      "checklistScore": 35.24,
      "dimensionCoverage": 33.04,
      "countryEfficiency": 30.96,
      "checklistOnlyPenalty": 13.26,
      "confidence": 24.56,
      "structuredContribution": 42.86,
      "checklistContribution": 29.07,
      "overall": 27.37
    }
  },
  {
    "id": "ri-010",
    "input": {
      "structuredDepth": 0.53,
      "checklistCoverage": 0.39,
      "indicatorFidelity": 0.53,
      "dimensionCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "countryFollowThrough": 0.53,
      "indicatorReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "dimension_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 69.71,
      "checklistScore": 27.12,
      "dimensionCoverage": 44.91,
      "countryEfficiency": 35.39,
      "checklistOnlyPenalty": 25.88,
      "confidence": 30.89,
      "structuredContribution": 56.01,
      "checklistContribution": 40.38,
      "overall": 57.2
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.36,
      "checklistScore": 27.02,
      "dimensionCoverage": 33.29,
      "countryEfficiency": 25.78,
      "checklistOnlyPenalty": 11.69,
      "confidence": 26.59,
      "structuredContribution": 37.75,
      "checklistContribution": 18.93,
      "overall": 18.08
    }
  },
  {
    "id": "ri-011",
    "input": {
      "structuredDepth": 0.57,
      "checklistCoverage": 0.4,
      "indicatorFidelity": 0.57,
      "dimensionCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "countryFollowThrough": 0.57,
      "indicatorReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 67.48,
      "checklistScore": 33.45,
      "dimensionCoverage": 59.19,
      "countryEfficiency": 62.63,
      "checklistOnlyPenalty": 24.79,
      "confidence": 33.61,
      "structuredContribution": 65.48,
      "checklistContribution": 46.91,
      "overall": 66.14
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.41,
      "checklistScore": 35.87,
      "dimensionCoverage": 33.53,
      "countryEfficiency": 33.86,
      "checklistOnlyPenalty": 10.12,
      "confidence": 28.62,
      "structuredContribution": 43.71,
      "checklistContribution": 28.66,
      "overall": 26.72
    }
  },
  {
    "id": "ri-012",
    "input": {
      "structuredDepth": 0.53,
      "checklistCoverage": 0.35,
      "indicatorFidelity": 0.53,
      "dimensionCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "countryFollowThrough": 0.53,
      "indicatorReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "indicator_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 70.11,
      "checklistScore": 26.46,
      "dimensionCoverage": 63.9,
      "countryEfficiency": 81.66,
      "checklistOnlyPenalty": 25.42,
      "confidence": 31.69,
      "structuredContribution": 71.72,
      "checklistContribution": 49.49,
      "overall": 71.72
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.97,
      "checklistScore": 40.08,
      "dimensionCoverage": 33.29,
      "countryEfficiency": 35.79,
      "checklistOnlyPenalty": 11.37,
      "confidence": 26.27,
      "structuredContribution": 45.15,
      "checklistContribution": 31.78,
      "overall": 29.97
    }
  },
  {
    "id": "ri-013",
    "input": {
      "structuredDepth": 0.57,
      "checklistCoverage": 0.36,
      "indicatorFidelity": 0.57,
      "dimensionCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "countryFollowThrough": 0.57,
      "indicatorReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "checklist_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 30.02,
      "checklistScore": 37.78,
      "dimensionCoverage": 39.69,
      "countryEfficiency": 37.56,
      "checklistOnlyPenalty": 48.96,
      "confidence": 34.41,
      "structuredContribution": 38.17,
      "checklistContribution": 32.72,
      "overall": 38.19
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.52,
      "checklistScore": 40.57,
      "dimensionCoverage": 33.53,
      "countryEfficiency": 37.38,
      "checklistOnlyPenalty": 9.8,
      "confidence": 28.3,
      "structuredContribution": 45.64,
      "checklistContribution": 31.66,
      "overall": 29.73
    }
  },
  {
    "id": "ri-014",
    "input": {
      "structuredDepth": 0.61,
      "checklistCoverage": 0.36,
      "indicatorFidelity": 0.61,
      "dimensionCompleteness": 0.61,
      "evidenceStrength": 0.61,
      "countryFollowThrough": 0.61,
      "indicatorReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 72.42,
      "checklistScore": 32.99,
      "dimensionCoverage": 62.78,
      "countryEfficiency": 66.75,
      "checklistOnlyPenalty": 23.11,
      "confidence": 37.33,
      "structuredContribution": 69.28,
      "checklistContribution": 48.89,
      "overall": 69.61
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.97,
      "checklistScore": 34.41,
      "dimensionCoverage": 33.78,
      "countryEfficiency": 33.75,
      "checklistOnlyPenalty": 8.16,
      "confidence": 30.26,
      "structuredContribution": 43.95,
      "checklistContribution": 28.62,
      "overall": 26.78
    }
  },
  {
    "id": "ri-015",
    "input": {
      "structuredDepth": 0.65,
      "checklistCoverage": 0.31,
      "indicatorFidelity": 0.65,
      "dimensionCompleteness": 0.65,
      "evidenceStrength": 0.65,
      "countryFollowThrough": 0.65,
      "indicatorReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "dimension_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 85.78,
      "checklistScore": 25.05,
      "dimensionCoverage": 53.27,
      "countryEfficiency": 41.67,
      "checklistOnlyPenalty": 21.31,
      "confidence": 41.25,
      "structuredContribution": 65.7,
      "checklistContribution": 45.36,
      "overall": 66.04
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.44,
      "checklistScore": 25.81,
      "dimensionCoverage": 34.03,
      "countryEfficiency": 28.05,
      "checklistOnlyPenalty": 6.12,
      "confidence": 31.82,
      "structuredContribution": 39.24,
      "checklistContribution": 19.56,
      "overall": 18.78
    }
  },
  {
    "id": "ri-016",
    "input": {
      "structuredDepth": 0.6,
      "checklistCoverage": 0.32,
      "indicatorFidelity": 0.6,
      "dimensionCompleteness": 0.6,
      "evidenceStrength": 0.6,
      "countryFollowThrough": 0.6,
      "indicatorReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 71.67,
      "checklistScore": 32.28,
      "dimensionCoverage": 61.88,
      "countryEfficiency": 67.58,
      "checklistOnlyPenalty": 22.94,
      "confidence": 37.4,
      "structuredContribution": 69,
      "checklistContribution": 48.59,
      "overall": 69.33
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.84,
      "checklistScore": 32.99,
      "dimensionCoverage": 33.72,
      "countryEfficiency": 32.22,
      "checklistOnlyPenalty": 8.26,
      "confidence": 29.46,
      "structuredContribution": 43.7,
      "checklistContribution": 28.79,
      "overall": 27.15
    }
  },
  {
    "id": "ri-017",
    "input": {
      "structuredDepth": 0.64,
      "checklistCoverage": 0.33,
      "indicatorFidelity": 0.64,
      "dimensionCompleteness": 0.64,
      "evidenceStrength": 0.64,
      "countryFollowThrough": 0.64,
      "indicatorReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "indicator_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 84.31,
      "checklistScore": 25.45,
      "dimensionCoverage": 75.51,
      "countryEfficiency": 92.42,
      "checklistOnlyPenalty": 21.85,
      "confidence": 40.12,
      "structuredContribution": 82.52,
      "checklistContribution": 55.25,
      "overall": 81.61
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.89,
      "checklistScore": 38.92,
      "dimensionCoverage": 33.97,
      "countryEfficiency": 38.03,
      "checklistOnlyPenalty": 6.69,
      "confidence": 31.49,
      "structuredContribution": 46.02,
      "checklistContribution": 31.2,
      "overall": 29.28
    }
  },
  {
    "id": "ri-018",
    "input": {
      "structuredDepth": 0.68,
      "checklistCoverage": 0.27,
      "indicatorFidelity": 0.68,
      "dimensionCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "countryFollowThrough": 0.68,
      "indicatorReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "checklist_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 38.06,
      "checklistScore": 37.81,
      "dimensionCoverage": 47.36,
      "countryEfficiency": 43.72,
      "checklistOnlyPenalty": 44.58,
      "confidence": 44.24,
      "structuredContribution": 45.03,
      "checklistContribution": 35.68,
      "overall": 44.35
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.26,
      "checklistScore": 35.72,
      "dimensionCoverage": 34.22,
      "countryEfficiency": 36.5,
      "checklistOnlyPenalty": 4.57,
      "confidence": 32.97,
      "structuredContribution": 45.83,
      "checklistContribution": 30.7,
      "overall": 29.01
    }
  },
  {
    "id": "ri-019",
    "input": {
      "structuredDepth": 0.72,
      "checklistCoverage": 0.28,
      "indicatorFidelity": 0.72,
      "dimensionCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "countryFollowThrough": 0.72,
      "indicatorReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 85.73,
      "checklistScore": 32.22,
      "dimensionCoverage": 72.66,
      "countryEfficiency": 76.99,
      "checklistOnlyPenalty": 18.84,
      "confidence": 46.96,
      "structuredContribution": 79.33,
      "checklistContribution": 54.24,
      "overall": 78.81
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.31,
      "checklistScore": 31.45,
      "dimensionCoverage": 34.46,
      "countryEfficiency": 34.38,
      "checklistOnlyPenalty": 3,
      "confidence": 35,
      "structuredContribution": 44.72,
      "checklistContribution": 28.4,
      "overall": 26.71
    }
  },
  {
    "id": "ri-020",
    "input": {
      "structuredDepth": 0.68,
      "checklistCoverage": 0.29,
      "indicatorFidelity": 0.68,
      "dimensionCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "countryFollowThrough": 0.68,
      "indicatorReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "dimension_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 89.8,
      "checklistScore": 24.53,
      "dimensionCoverage": 55.36,
      "countryEfficiency": 43.24,
      "checklistOnlyPenalty": 20.17,
      "confidence": 43.84,
      "structuredContribution": 68.12,
      "checklistContribution": 46.6,
      "overall": 68.25
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.45,
      "checklistScore": 25.5,
      "dimensionCoverage": 34.22,
      "countryEfficiency": 28.62,
      "checklistOnlyPenalty": 4.73,
      "confidence": 33.13,
      "structuredContribution": 39.61,
      "checklistContribution": 19.71,
      "overall": 18.95
    }
  },
  {
    "id": "ri-021",
    "input": {
      "structuredDepth": 0.72,
      "checklistCoverage": 0.24,
      "indicatorFidelity": 0.72,
      "dimensionCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "countryFollowThrough": 0.72,
      "indicatorReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 86.11,
      "checklistScore": 31.56,
      "dimensionCoverage": 72.66,
      "countryEfficiency": 78.48,
      "checklistOnlyPenalty": 18.37,
      "confidence": 47.76,
      "structuredContribution": 79.86,
      "checklistContribution": 54.4,
      "overall": 79.28
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.92,
      "checklistScore": 30.02,
      "dimensionCoverage": 34.46,
      "countryEfficiency": 33.13,
      "checklistOnlyPenalty": 2.69,
      "confidence": 34.69,
      "structuredContribution": 44.57,
      "checklistContribution": 28.53,
      "overall": 27.02
    }
  },
  {
    "id": "ri-022",
    "input": {
      "structuredDepth": 0.76,
      "checklistCoverage": 0.25,
      "indicatorFidelity": 0.76,
      "dimensionCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "countryFollowThrough": 0.76,
      "indicatorReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "indicator_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 100,
      "checklistScore": 23.38,
      "dimensionCoverage": 88.16,
      "countryEfficiency": 100,
      "checklistOnlyPenalty": 17.28,
      "confidence": 50.48,
      "structuredContribution": 93.57,
      "checklistContribution": 60.35,
      "overall": 91.59
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.97,
      "checklistScore": 34.59,
      "dimensionCoverage": 34.71,
      "countryEfficiency": 37.89,
      "checklistOnlyPenalty": 1.12,
      "confidence": 36.72,
      "structuredContribution": 46.41,
      "checklistContribution": 30.25,
      "overall": 28.51
    }
  },
  {
    "id": "ri-023",
    "input": {
      "structuredDepth": 0.8,
      "checklistCoverage": 0.25,
      "indicatorFidelity": 0.8,
      "dimensionCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "countryFollowThrough": 0.8,
      "indicatorReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "checklist_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 46.2,
      "checklistScore": 39.13,
      "dimensionCoverage": 55.71,
      "countryEfficiency": 48.57,
      "checklistOnlyPenalty": 40.71,
      "confidence": 53.4,
      "structuredContribution": 51.74,
      "checklistContribution": 38.85,
      "overall": 50.42
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 24.92,
      "checklistScore": 34.55,
      "dimensionCoverage": 34.96,
      "countryEfficiency": 39.03,
      "checklistOnlyPenalty": 0,
      "confidence": 38.67,
      "structuredContribution": 46.69,
      "checklistContribution": 30.08,
      "overall": 28.23
    }
  },
  {
    "id": "ri-024",
    "input": {
      "structuredDepth": 0.76,
      "checklistCoverage": 0.2,
      "indicatorFidelity": 0.76,
      "dimensionCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "countryFollowThrough": 0.76,
      "indicatorReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 91.06,
      "checklistScore": 31.1,
      "dimensionCoverage": 76.25,
      "countryEfficiency": 82.6,
      "checklistOnlyPenalty": 16.69,
      "confidence": 51.48,
      "structuredContribution": 83.66,
      "checklistContribution": 56.38,
      "overall": 82.75
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 28.48,
      "checklistScore": 28.56,
      "dimensionCoverage": 34.71,
      "countryEfficiency": 33.02,
      "checklistOnlyPenalty": 0.73,
      "confidence": 36.33,
      "structuredContribution": 44.81,
      "checklistContribution": 28.49,
      "overall": 27.08
    }
  },
  {
    "id": "ri-025",
    "input": {
      "structuredDepth": 0.8,
      "checklistCoverage": 0.21,
      "indicatorFidelity": 0.8,
      "dimensionCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "countryFollowThrough": 0.8,
      "indicatorReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "dimension_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 100,
      "checklistScore": 22.47,
      "dimensionCoverage": 63.71,
      "countryEfficiency": 49.53,
      "checklistOnlyPenalty": 15.6,
      "confidence": 54.2,
      "structuredContribution": 75.93,
      "checklistContribution": 49.53,
      "overall": 75.18
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.53,
      "checklistScore": 24.28,
      "dimensionCoverage": 34.96,
      "countryEfficiency": 30.9,
      "checklistOnlyPenalty": 0,
      "confidence": 38.36,
      "structuredContribution": 40.93,
      "checklistContribution": 20.34,
      "overall": 19.61
    }
  },
  {
    "id": "ri-026",
    "input": {
      "structuredDepth": 0.83,
      "checklistCoverage": 0.22,
      "indicatorFidelity": 0.83,
      "dimensionCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "countryFollowThrough": 0.83,
      "indicatorReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 98.84,
      "checklistScore": 31.78,
      "dimensionCoverage": 82.53,
      "countryEfficiency": 86.49,
      "checklistOnlyPenalty": 14.81,
      "confidence": 56.19,
      "structuredContribution": 89.1,
      "checklistContribution": 59.52,
      "overall": 87.78
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 25.84,
      "checklistScore": 29.2,
      "dimensionCoverage": 35.15,
      "countryEfficiency": 35.64,
      "checklistOnlyPenalty": 0,
      "confidence": 39.9,
      "structuredContribution": 45.17,
      "checklistContribution": 28.12,
      "overall": 26.4
    }
  },
  {
    "id": "ri-027",
    "input": {
      "structuredDepth": 0.87,
      "checklistCoverage": 0.17,
      "indicatorFidelity": 0.87,
      "dimensionCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "countryFollowThrough": 0.87,
      "indicatorReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "indicator_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 100,
      "checklistScore": 21.37,
      "dimensionCoverage": 99.77,
      "countryEfficiency": 100,
      "checklistOnlyPenalty": 13.01,
      "confidence": 60.11,
      "structuredContribution": 97.59,
      "checklistContribution": 58.56,
      "overall": 94.56
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.31,
      "checklistScore": 30.27,
      "dimensionCoverage": 35.39,
      "countryEfficiency": 37.47,
      "checklistOnlyPenalty": 0,
      "confidence": 41.46,
      "structuredContribution": 45.89,
      "checklistContribution": 29.35,
      "overall": 27.62
    }
  },
  {
    "id": "ri-028",
    "input": {
      "structuredDepth": 0.83,
      "checklistCoverage": 0.17,
      "indicatorFidelity": 0.83,
      "dimensionCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "countryFollowThrough": 0.83,
      "indicatorReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "checklist_first",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 48.85,
      "checklistScore": 38.22,
      "dimensionCoverage": 57.8,
      "countryEfficiency": 51.58,
      "checklistOnlyPenalty": 38.86,
      "confidence": 57.19,
      "structuredContribution": 54.17,
      "checklistContribution": 39.7,
      "overall": 52.57
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 27.35,
      "checklistScore": 30.31,
      "dimensionCoverage": 35.15,
      "countryEfficiency": 36.33,
      "checklistOnlyPenalty": 0,
      "confidence": 39.51,
      "structuredContribution": 45.83,
      "checklistContribution": 29.52,
      "overall": 27.94
    }
  },
  {
    "id": "ri-029",
    "input": {
      "structuredDepth": 0.87,
      "checklistCoverage": 0.18,
      "indicatorFidelity": 0.87,
      "dimensionCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "countryFollowThrough": 0.87,
      "indicatorReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "structured_country_index"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 100,
      "checklistScore": 31.32,
      "dimensionCoverage": 86.13,
      "countryEfficiency": 90.62,
      "checklistOnlyPenalty": 13.13,
      "confidence": 59.91,
      "structuredContribution": 91.69,
      "checklistContribution": 60.18,
      "overall": 90.02
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 26.4,
      "checklistScore": 27.74,
      "dimensionCoverage": 35.39,
      "countryEfficiency": 35.53,
      "checklistOnlyPenalty": 0,
      "confidence": 41.54,
      "structuredContribution": 45.01,
      "checklistContribution": 28.08,
      "overall": 26.37
    }
  },
  {
    "id": "ri-030",
    "input": {
      "structuredDepth": 0.91,
      "checklistCoverage": 0.13,
      "indicatorFidelity": 0.91,
      "dimensionCompleteness": 0.91,
      "evidenceStrength": 0.91,
      "countryFollowThrough": 0.91,
      "indicatorReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "dimension_first",
      "profile": "naive_commitment_checklist"
    },
    "expectedStructured": {
      "mode": "structured_country_index",
      "structuredIndexScore": 100,
      "checklistScore": 20.46,
      "dimensionCoverage": 71.37,
      "countryEfficiency": 55.45,
      "checklistOnlyPenalty": 11.33,
      "confidence": 63.83,
      "structuredContribution": 80.14,
      "checklistContribution": 48.92,
      "overall": 78.52
    },
    "expectedChecklist": {
      "mode": "naive_commitment_checklist",
      "structuredIndexScore": 14.87,
      "checklistScore": 23.07,
      "dimensionCoverage": 35.64,
      "countryEfficiency": 32.89,
      "checklistOnlyPenalty": 0,
      "confidence": 43.1,
      "structuredContribution": 41.29,
      "checklistContribution": 21.01,
      "overall": 20.14
    }
  }
];
