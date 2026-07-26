import type { DhodhInput, DhodhQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DhodhInput;
  expectedStructure: DhodhQuality;
  expectedLibrary: DhodhQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ds-001",
    "input": {
      "dockingFit": 0.34,
      "libraryHitRate": 0.5,
      "pharmacophoreMatch": 0.75,
      "parasiteSelectivity": 0.34,
      "evidenceStrength": 0.34,
      "screenFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 40.97,
      "libraryScore": 33.95,
      "pharmacophoreCoverage": 34.03,
      "screenEfficiency": 49.02,
      "selectivityGap": 47.01,
      "confidence": 11.82,
      "structureContribution": 42.96,
      "libraryContribution": 38.69,
      "overall": 45.19
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 32.4,
      "libraryScore": 50.37,
      "pharmacophoreCoverage": 32.11,
      "screenEfficiency": 37.67,
      "selectivityGap": 17.67,
      "confidence": 23.6,
      "structureContribution": 46.98,
      "libraryContribution": 37.48,
      "overall": 40.15
    }
  },
  {
    "id": "ds-002",
    "input": {
      "dockingFit": 0.38,
      "libraryHitRate": 0.51,
      "pharmacophoreMatch": 0.75,
      "parasiteSelectivity": 0.38,
      "evidenceStrength": 0.38,
      "screenFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 50.06,
      "libraryScore": 30.04,
      "pharmacophoreCoverage": 43.58,
      "screenEfficiency": 66.97,
      "selectivityGap": 45.02,
      "confidence": 14.54,
      "structureContribution": 52.85,
      "libraryContribution": 43.65,
      "overall": 54.19
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.15,
      "libraryScore": 56.84,
      "pharmacophoreCoverage": 32.36,
      "screenEfficiency": 45.29,
      "selectivityGap": 16.6,
      "confidence": 24.11,
      "structureContribution": 49.61,
      "libraryContribution": 40.21,
      "overall": 42.28
    }
  },
  {
    "id": "ds-003",
    "input": {
      "dockingFit": 0.42,
      "libraryHitRate": 0.46,
      "pharmacophoreMatch": 0.69,
      "parasiteSelectivity": 0.42,
      "evidenceStrength": 0.42,
      "screenFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "library_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 19.5,
      "libraryScore": 37.37,
      "pharmacophoreCoverage": 23.67,
      "screenEfficiency": 31.67,
      "selectivityGap": 67.31,
      "confidence": 17.74,
      "structureContribution": 25.72,
      "libraryContribution": 30.45,
      "overall": 26.33
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.81,
      "libraryScore": 53.74,
      "pharmacophoreCoverage": 32.6,
      "screenEfficiency": 44.47,
      "selectivityGap": 15.17,
      "confidence": 25.76,
      "structureContribution": 49.29,
      "libraryContribution": 39.39,
      "overall": 41.35
    }
  },
  {
    "id": "ds-004",
    "input": {
      "dockingFit": 0.38,
      "libraryHitRate": 0.46,
      "pharmacophoreMatch": 0.69,
      "parasiteSelectivity": 0.38,
      "evidenceStrength": 0.38,
      "screenFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 45.77,
      "libraryScore": 33.49,
      "pharmacophoreCoverage": 36.54,
      "screenEfficiency": 52.03,
      "selectivityGap": 44.75,
      "confidence": 14.82,
      "structureContribution": 46.27,
      "libraryContribution": 40.34,
      "overall": 47.96
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 32.66,
      "libraryScore": 47.89,
      "pharmacophoreCoverage": 32.36,
      "screenEfficiency": 37.31,
      "selectivityGap": 16.33,
      "confidence": 25.04,
      "structureContribution": 46.78,
      "libraryContribution": 36.75,
      "overall": 39.26
    }
  },
  {
    "id": "ds-005",
    "input": {
      "dockingFit": 0.42,
      "libraryHitRate": 0.47,
      "pharmacophoreMatch": 0.69,
      "parasiteSelectivity": 0.42,
      "evidenceStrength": 0.42,
      "screenFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "structure_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 55.39,
      "libraryScore": 29.13,
      "pharmacophoreCoverage": 31.67,
      "screenEfficiency": 31.41,
      "selectivityGap": 42.76,
      "confidence": 17.54,
      "structureContribution": 43.81,
      "libraryContribution": 37.62,
      "overall": 45.46
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 18.41,
      "libraryScore": 36.3,
      "pharmacophoreCoverage": 32.6,
      "screenEfficiency": 26.86,
      "selectivityGap": 15.26,
      "confidence": 25.55,
      "structureContribution": 39.78,
      "libraryContribution": 24.14,
      "overall": 27.3
    }
  },
  {
    "id": "ds-006",
    "input": {
      "dockingFit": 0.45,
      "libraryHitRate": 0.42,
      "pharmacophoreMatch": 0.64,
      "parasiteSelectivity": 0.45,
      "evidenceStrength": 0.45,
      "screenFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 53.95,
      "libraryScore": 33.18,
      "pharmacophoreCoverage": 41.93,
      "screenEfficiency": 56.66,
      "selectivityGap": 40.9,
      "confidence": 20.13,
      "structureContribution": 52.11,
      "libraryContribution": 43.22,
      "overall": 53.07
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 31.91,
      "libraryScore": 44.09,
      "pharmacophoreCoverage": 32.79,
      "screenEfficiency": 36.59,
      "selectivityGap": 14.09,
      "confidence": 27.04,
      "structureContribution": 46.26,
      "libraryContribution": 35.04,
      "overall": 37.14
    }
  },
  {
    "id": "ds-007",
    "input": {
      "dockingFit": 0.49,
      "libraryHitRate": 0.43,
      "pharmacophoreMatch": 0.64,
      "parasiteSelectivity": 0.49,
      "evidenceStrength": 0.49,
      "screenFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 64.5,
      "libraryScore": 28.03,
      "pharmacophoreCoverage": 53.21,
      "screenEfficiency": 77.06,
      "selectivityGap": 38.91,
      "confidence": 22.85,
      "structureContribution": 63.49,
      "libraryContribution": 48.75,
      "overall": 63.4
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 29.65,
      "libraryScore": 49.11,
      "pharmacophoreCoverage": 33.04,
      "screenEfficiency": 42.75,
      "selectivityGap": 13.02,
      "confidence": 27.55,
      "structureContribution": 48.31,
      "libraryContribution": 36.97,
      "overall": 38.51
    }
  },
  {
    "id": "ds-008",
    "input": {
      "dockingFit": 0.45,
      "libraryHitRate": 0.44,
      "pharmacophoreMatch": 0.64,
      "parasiteSelectivity": 0.45,
      "evidenceStrength": 0.45,
      "screenFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "library_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 21.58,
      "libraryScore": 37.45,
      "pharmacophoreCoverage": 24.86,
      "screenEfficiency": 32.72,
      "selectivityGap": 65.72,
      "confidence": 19.73,
      "structureContribution": 27.24,
      "libraryContribution": 31.08,
      "overall": 27.49
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.6,
      "libraryScore": 51.57,
      "pharmacophoreCoverage": 32.79,
      "screenEfficiency": 43.72,
      "selectivityGap": 14.27,
      "confidence": 26.62,
      "structureContribution": 48.88,
      "libraryContribution": 38.4,
      "overall": 40.22
    }
  },
  {
    "id": "ds-009",
    "input": {
      "dockingFit": 0.49,
      "libraryHitRate": 0.38,
      "pharmacophoreMatch": 0.58,
      "parasiteSelectivity": 0.49,
      "evidenceStrength": 0.49,
      "screenFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 58.75,
      "libraryScore": 32.72,
      "pharmacophoreCoverage": 44.44,
      "screenEfficiency": 59.67,
      "selectivityGap": 38.64,
      "confidence": 23.13,
      "structureContribution": 55.42,
      "libraryContribution": 44.87,
      "overall": 55.84
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 32.17,
      "libraryScore": 41.62,
      "pharmacophoreCoverage": 33.04,
      "screenEfficiency": 36.23,
      "selectivityGap": 12.75,
      "confidence": 28.48,
      "structureContribution": 46.06,
      "libraryContribution": 34.31,
      "overall": 36.24
    }
  },
  {
    "id": "ds-010",
    "input": {
      "dockingFit": 0.53,
      "libraryHitRate": 0.39,
      "pharmacophoreMatch": 0.58,
      "parasiteSelectivity": 0.53,
      "evidenceStrength": 0.53,
      "screenFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "structure_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 69.83,
      "libraryScore": 27.12,
      "pharmacophoreCoverage": 37.35,
      "screenEfficiency": 35.9,
      "selectivityGap": 36.65,
      "confidence": 25.85,
      "structureContribution": 52.1,
      "libraryContribution": 41.6,
      "overall": 52.53
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 17.91,
      "libraryScore": 31.89,
      "pharmacophoreCoverage": 33.29,
      "screenEfficiency": 27.65,
      "selectivityGap": 11.68,
      "confidence": 28.99,
      "structureContribution": 39.81,
      "libraryContribution": 22.73,
      "overall": 25.26
    }
  },
  {
    "id": "ds-011",
    "input": {
      "dockingFit": 0.57,
      "libraryHitRate": 0.4,
      "pharmacophoreMatch": 0.58,
      "parasiteSelectivity": 0.57,
      "evidenceStrength": 0.57,
      "screenFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 67.51,
      "libraryScore": 33.45,
      "pharmacophoreCoverage": 51.63,
      "screenEfficiency": 62.87,
      "selectivityGap": 34.66,
      "confidence": 28.57,
      "structureContribution": 61.65,
      "libraryContribution": 47.96,
      "overall": 61.51
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 28.66,
      "libraryScore": 38.16,
      "pharmacophoreCoverage": 33.53,
      "screenEfficiency": 35.05,
      "selectivityGap": 10.61,
      "confidence": 29.5,
      "structureContribution": 44.96,
      "libraryContribution": 31.19,
      "overall": 32.41
    }
  },
  {
    "id": "ds-012",
    "input": {
      "dockingFit": 0.53,
      "libraryHitRate": 0.35,
      "pharmacophoreMatch": 0.52,
      "parasiteSelectivity": 0.53,
      "evidenceStrength": 0.53,
      "screenFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 70.17,
      "libraryScore": 26.46,
      "pharmacophoreCoverage": 55.26,
      "screenEfficiency": 82.24,
      "selectivityGap": 36.47,
      "confidence": 25.93,
      "structureContribution": 67.46,
      "libraryContribution": 50.74,
      "overall": 66.53
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 31.52,
      "libraryScore": 45.47,
      "pharmacophoreCoverage": 33.29,
      "screenEfficiency": 42.01,
      "selectivityGap": 11.5,
      "confidence": 29.71,
      "structureContribution": 48.16,
      "libraryContribution": 36.57,
      "overall": 38.13
    }
  },
  {
    "id": "ds-013",
    "input": {
      "dockingFit": 0.57,
      "libraryHitRate": 0.36,
      "pharmacophoreMatch": 0.52,
      "parasiteSelectivity": 0.57,
      "evidenceStrength": 0.57,
      "screenFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "library_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 30,
      "libraryScore": 37.78,
      "pharmacophoreCoverage": 31.05,
      "screenEfficiency": 37.43,
      "selectivityGap": 59.12,
      "confidence": 28.65,
      "structureContribution": 33.89,
      "libraryContribution": 33.7,
      "overall": 32.94
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 29.77,
      "libraryScore": 43.21,
      "pharmacophoreCoverage": 33.53,
      "screenEfficiency": 40.89,
      "selectivityGap": 10.43,
      "confidence": 30.22,
      "structureContribution": 47.39,
      "libraryContribution": 34.72,
      "overall": 35.94
    }
  },
  {
    "id": "ds-014",
    "input": {
      "dockingFit": 0.61,
      "libraryHitRate": 0.36,
      "pharmacophoreMatch": 0.52,
      "parasiteSelectivity": 0.61,
      "evidenceStrength": 0.61,
      "screenFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 72.31,
      "libraryScore": 32.99,
      "pharmacophoreCoverage": 54.14,
      "screenEfficiency": 65.88,
      "selectivityGap": 32.4,
      "confidence": 31.57,
      "structureContribution": 64.96,
      "libraryContribution": 49.61,
      "overall": 64.28
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 28.92,
      "libraryScore": 35.69,
      "pharmacophoreCoverage": 33.78,
      "screenEfficiency": 34.69,
      "selectivityGap": 9.27,
      "confidence": 30.94,
      "structureContribution": 44.76,
      "libraryContribution": 30.46,
      "overall": 31.52
    }
  },
  {
    "id": "ds-015",
    "input": {
      "dockingFit": 0.65,
      "libraryHitRate": 0.31,
      "pharmacophoreMatch": 0.46,
      "parasiteSelectivity": 0.65,
      "evidenceStrength": 0.65,
      "screenFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "structure_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 85.51,
      "libraryScore": 25.05,
      "pharmacophoreCoverage": 43.55,
      "screenEfficiency": 40.6,
      "selectivityGap": 30.05,
      "confidence": 34.77,
      "structureContribution": 61.08,
      "libraryContribution": 45.92,
      "overall": 60.19
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 17.08,
      "libraryScore": 27.16,
      "pharmacophoreCoverage": 34.03,
      "screenEfficiency": 28.45,
      "selectivityGap": 7.84,
      "confidence": 32.59,
      "structureContribution": 39.78,
      "libraryContribution": 21.04,
      "overall": 22.85
    }
  },
  {
    "id": "ds-016",
    "input": {
      "dockingFit": 0.6,
      "libraryHitRate": 0.32,
      "pharmacophoreMatch": 0.47,
      "parasiteSelectivity": 0.6,
      "evidenceStrength": 0.6,
      "screenFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 71.53,
      "libraryScore": 32.28,
      "pharmacophoreCoverage": 52.34,
      "screenEfficiency": 66.48,
      "selectivityGap": 32.71,
      "confidence": 31.04,
      "structureContribution": 64.28,
      "libraryContribution": 49.3,
      "overall": 63.46
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.87,
      "libraryScore": 35.54,
      "pharmacophoreCoverage": 33.72,
      "screenEfficiency": 35,
      "selectivityGap": 9.35,
      "confidence": 31.5,
      "structureContribution": 45.16,
      "libraryContribution": 31.46,
      "overall": 32.75
    }
  },
  {
    "id": "ds-017",
    "input": {
      "dockingFit": 0.64,
      "libraryHitRate": 0.33,
      "pharmacophoreMatch": 0.47,
      "parasiteSelectivity": 0.64,
      "evidenceStrength": 0.64,
      "screenFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 84.06,
      "libraryScore": 25.45,
      "pharmacophoreCoverage": 65.97,
      "screenEfficiency": 90.03,
      "selectivityGap": 30.72,
      "confidence": 33.76,
      "structureContribution": 77.65,
      "libraryContribution": 55.57,
      "overall": 75.56
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 28.61,
      "libraryScore": 38.58,
      "pharmacophoreCoverage": 33.97,
      "screenEfficiency": 39.17,
      "selectivityGap": 8.28,
      "confidence": 32.01,
      "structureContribution": 46.41,
      "libraryContribution": 32.29,
      "overall": 33.1
    }
  },
  {
    "id": "ds-018",
    "input": {
      "dockingFit": 0.68,
      "libraryHitRate": 0.27,
      "pharmacophoreMatch": 0.41,
      "parasiteSelectivity": 0.68,
      "evidenceStrength": 0.68,
      "screenFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "library_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 37.86,
      "libraryScore": 37.81,
      "pharmacophoreCoverage": 36.74,
      "screenEfficiency": 42.18,
      "selectivityGap": 52.92,
      "confidence": 37.16,
      "structureContribution": 40.16,
      "libraryContribution": 36.13,
      "overall": 38.07
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 29.68,
      "libraryScore": 35.37,
      "pharmacophoreCoverage": 34.22,
      "screenEfficiency": 38.43,
      "selectivityGap": 6.76,
      "confidence": 33.87,
      "structureContribution": 46.19,
      "libraryContribution": 31.68,
      "overall": 32.41
    }
  },
  {
    "id": "ds-019",
    "input": {
      "dockingFit": 0.72,
      "libraryHitRate": 0.28,
      "pharmacophoreMatch": 0.41,
      "parasiteSelectivity": 0.72,
      "evidenceStrength": 0.72,
      "screenFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 85.29,
      "libraryScore": 32.22,
      "pharmacophoreCoverage": 62.04,
      "screenEfficiency": 73.52,
      "selectivityGap": 26.29,
      "confidence": 39.88,
      "structureContribution": 74.11,
      "libraryContribution": 54.14,
      "overall": 72.16
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 28.43,
      "libraryScore": 29.41,
      "pharmacophoreCoverage": 34.46,
      "screenEfficiency": 33.61,
      "selectivityGap": 5.69,
      "confidence": 34.38,
      "structureContribution": 44.04,
      "libraryContribution": 28.02,
      "overall": 28.5
    }
  },
  {
    "id": "ds-020",
    "input": {
      "dockingFit": 0.68,
      "libraryHitRate": 0.29,
      "pharmacophoreMatch": 0.41,
      "parasiteSelectivity": 0.68,
      "evidenceStrength": 0.68,
      "screenFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "structure_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 89.4,
      "libraryScore": 24.53,
      "pharmacophoreCoverage": 44.74,
      "screenEfficiency": 41.65,
      "selectivityGap": 28.46,
      "confidence": 36.76,
      "structureContribution": 63.18,
      "libraryContribution": 46.97,
      "overall": 61.9
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 16.87,
      "libraryScore": 25.9,
      "pharmacophoreCoverage": 34.22,
      "screenEfficiency": 28.6,
      "selectivityGap": 6.94,
      "confidence": 33.45,
      "structureContribution": 39.73,
      "libraryContribution": 20.55,
      "overall": 22.19
    }
  },
  {
    "id": "ds-021",
    "input": {
      "dockingFit": 0.72,
      "libraryHitRate": 0.24,
      "pharmacophoreMatch": 0.35,
      "parasiteSelectivity": 0.72,
      "evidenceStrength": 0.72,
      "screenFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 85.62,
      "libraryScore": 31.56,
      "pharmacophoreCoverage": 60.96,
      "screenEfficiency": 74.51,
      "selectivityGap": 26.11,
      "confidence": 39.96,
      "structureContribution": 74.16,
      "libraryContribution": 54.21,
      "overall": 71.97
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.04,
      "libraryScore": 28.77,
      "pharmacophoreCoverage": 34.46,
      "screenEfficiency": 33.76,
      "selectivityGap": 5.51,
      "confidence": 35.1,
      "structureContribution": 44.3,
      "libraryContribution": 28.64,
      "overall": 29.29
    }
  },
  {
    "id": "ds-022",
    "input": {
      "dockingFit": 0.76,
      "libraryHitRate": 0.25,
      "pharmacophoreMatch": 0.35,
      "parasiteSelectivity": 0.76,
      "evidenceStrength": 0.76,
      "screenFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 99.74,
      "libraryScore": 23.38,
      "pharmacophoreCoverage": 76.46,
      "screenEfficiency": 100,
      "selectivityGap": 24.12,
      "confidence": 42.68,
      "structureContribution": 88.98,
      "libraryContribution": 60.94,
      "overall": 85.33
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 27.78,
      "libraryScore": 30.22,
      "pharmacophoreCoverage": 34.71,
      "screenEfficiency": 36.35,
      "selectivityGap": 4.44,
      "confidence": 35.61,
      "structureContribution": 44.92,
      "libraryContribution": 28.61,
      "overall": 28.82
    }
  },
  {
    "id": "ds-023",
    "input": {
      "dockingFit": 0.8,
      "libraryHitRate": 0.25,
      "pharmacophoreMatch": 0.35,
      "parasiteSelectivity": 0.8,
      "evidenceStrength": 0.8,
      "screenFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "library_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 45.82,
      "libraryScore": 39.13,
      "pharmacophoreCoverage": 44.01,
      "screenEfficiency": 45.67,
      "selectivityGap": 46.68,
      "confidence": 45.6,
      "structureContribution": 46.63,
      "libraryContribution": 38.73,
      "overall": 43.61
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 26.43,
      "libraryScore": 27.86,
      "pharmacophoreCoverage": 34.96,
      "screenEfficiency": 35.31,
      "selectivityGap": 3.28,
      "confidence": 36.33,
      "structureContribution": 44.26,
      "libraryContribution": 26.97,
      "overall": 26.87
    }
  },
  {
    "id": "ds-024",
    "input": {
      "dockingFit": 0.76,
      "libraryHitRate": 0.2,
      "pharmacophoreMatch": 0.29,
      "parasiteSelectivity": 0.76,
      "evidenceStrength": 0.76,
      "screenFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 90.42,
      "libraryScore": 31.1,
      "pharmacophoreCoverage": 63.47,
      "screenEfficiency": 77.52,
      "selectivityGap": 23.85,
      "confidence": 42.96,
      "structureContribution": 77.47,
      "libraryContribution": 55.86,
      "overall": 74.74
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 30.29,
      "libraryScore": 26.3,
      "pharmacophoreCoverage": 34.71,
      "screenEfficiency": 33.4,
      "selectivityGap": 4.17,
      "confidence": 36.54,
      "structureContribution": 44.11,
      "libraryContribution": 27.91,
      "overall": 28.39
    }
  },
  {
    "id": "ds-025",
    "input": {
      "dockingFit": 0.8,
      "libraryHitRate": 0.21,
      "pharmacophoreMatch": 0.29,
      "parasiteSelectivity": 0.8,
      "evidenceStrength": 0.8,
      "screenFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "structure_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 100,
      "libraryScore": 22.47,
      "pharmacophoreCoverage": 50.93,
      "screenEfficiency": 46.36,
      "selectivityGap": 21.86,
      "confidence": 45.68,
      "structureContribution": 70.52,
      "libraryContribution": 49.52,
      "overall": 67.9
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 16.04,
      "libraryScore": 21.17,
      "pharmacophoreCoverage": 34.96,
      "screenEfficiency": 29.41,
      "selectivityGap": 3.1,
      "confidence": 37.05,
      "structureContribution": 39.7,
      "libraryContribution": 18.86,
      "overall": 19.78
    }
  },
  {
    "id": "ds-026",
    "input": {
      "dockingFit": 0.83,
      "libraryHitRate": 0.22,
      "pharmacophoreMatch": 0.3,
      "parasiteSelectivity": 0.83,
      "evidenceStrength": 0.83,
      "screenFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 98.07,
      "libraryScore": 31.78,
      "pharmacophoreCoverage": 69.93,
      "screenEfficiency": 80.33,
      "selectivityGap": 20.36,
      "confidence": 47.79,
      "structureContribution": 82.97,
      "libraryContribution": 58.57,
      "overall": 79.78
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 27.13,
      "libraryScore": 23.34,
      "pharmacophoreCoverage": 35.15,
      "screenEfficiency": 32.38,
      "selectivityGap": 2.29,
      "confidence": 37.4,
      "structureContribution": 43.14,
      "libraryContribution": 25.17,
      "overall": 25.01
    }
  },
  {
    "id": "ds-027",
    "input": {
      "dockingFit": 0.87,
      "libraryHitRate": 0.17,
      "pharmacophoreMatch": 0.24,
      "parasiteSelectivity": 0.87,
      "evidenceStrength": 0.87,
      "screenFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 100,
      "libraryScore": 21.37,
      "pharmacophoreCoverage": 86.09,
      "screenEfficiency": 100,
      "selectivityGap": 18.01,
      "confidence": 50.99,
      "structureContribution": 92.86,
      "libraryContribution": 59.06,
      "overall": 87.74
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 27.29,
      "libraryScore": 22.48,
      "pharmacophoreCoverage": 35.39,
      "screenEfficiency": 33.81,
      "selectivityGap": 0.86,
      "confidence": 39.05,
      "structureContribution": 43.62,
      "libraryContribution": 25.37,
      "overall": 25.06
    }
  },
  {
    "id": "ds-028",
    "input": {
      "dockingFit": 0.83,
      "libraryHitRate": 0.17,
      "pharmacophoreMatch": 0.24,
      "parasiteSelectivity": 0.83,
      "evidenceStrength": 0.83,
      "screenFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "library_first",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 48.37,
      "libraryScore": 38.22,
      "pharmacophoreCoverage": 44.12,
      "screenEfficiency": 47.94,
      "selectivityGap": 44.73,
      "confidence": 48.07,
      "structureContribution": 48.33,
      "libraryContribution": 39.39,
      "overall": 44.68
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 28.64,
      "libraryScore": 24.84,
      "pharmacophoreCoverage": 35.15,
      "screenEfficiency": 34.85,
      "selectivityGap": 2.02,
      "confidence": 38.33,
      "structureContribution": 44.29,
      "libraryContribution": 27.01,
      "overall": 27
    }
  },
  {
    "id": "ds-029",
    "input": {
      "dockingFit": 0.87,
      "libraryHitRate": 0.18,
      "pharmacophoreMatch": 0.24,
      "parasiteSelectivity": 0.87,
      "evidenceStrength": 0.87,
      "screenFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "structure_based_dhodh"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 100,
      "libraryScore": 31.32,
      "pharmacophoreCoverage": 72.45,
      "screenEfficiency": 83.34,
      "selectivityGap": 18.1,
      "confidence": 50.79,
      "structureContribution": 85.36,
      "libraryContribution": 59.22,
      "overall": 81.61
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 27.39,
      "libraryScore": 20.87,
      "pharmacophoreCoverage": 35.39,
      "screenEfficiency": 32.01,
      "selectivityGap": 0.95,
      "confidence": 38.84,
      "structureContribution": 42.94,
      "libraryContribution": 24.44,
      "overall": 24.12
    }
  },
  {
    "id": "ds-030",
    "input": {
      "dockingFit": 0.91,
      "libraryHitRate": 0.13,
      "pharmacophoreMatch": 0.18,
      "parasiteSelectivity": 0.91,
      "evidenceStrength": 0.91,
      "screenFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "structure_first",
      "profile": "naive_library_baseline"
    },
    "expectedStructure": {
      "mode": "structure_based_dhodh",
      "dockingScore": 100,
      "libraryScore": 20.46,
      "pharmacophoreCoverage": 56.61,
      "screenEfficiency": 50.85,
      "selectivityGap": 15.75,
      "confidence": 53.99,
      "structureContribution": 74.2,
      "libraryContribution": 48.45,
      "overall": 70.29
    },
    "expectedLibrary": {
      "mode": "naive_library_baseline",
      "dockingScore": 15.55,
      "libraryScore": 16.76,
      "pharmacophoreCoverage": 35.64,
      "screenEfficiency": 30.2,
      "selectivityGap": 0,
      "confidence": 40.49,
      "structureContribution": 39.63,
      "libraryContribution": 17.45,
      "overall": 17.72
    }
  }
];
