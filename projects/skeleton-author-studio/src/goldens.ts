import type { AuthorInput, AuthorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AuthorInput;
  expectedScaffoldedAuthoring: AuthorQuality;
  expectedNaiveLinear: AuthorQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sa-001",
    "input": {
      "skeletonCoverage": 0.29,
      "scaffoldFidelity": 0.25,
      "labelFit": 0.28,
      "navIntegrity": 0.34,
      "linearPassRate": 0.39,
      "flattenOptimism": 0.45,
      "experienceHardness": 0.59,
      "leakageRisk": 0.5,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 22.56,
      "scaffoldDiagnosis": 30.25,
      "navigationOptScore": 27.38,
      "labelIntegrity": 34.28,
      "linearScore": 16.4,
      "confidence": 19.35,
      "scaffoldContribution": 28.33,
      "linearContribution": 15.96,
      "overall": 30.1
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 5.76,
      "scaffoldDiagnosis": 17.09,
      "navigationOptScore": 13.13,
      "labelIntegrity": 32.39,
      "linearScore": 40.93,
      "confidence": 17.1,
      "scaffoldContribution": 21.86,
      "linearContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "sa-002",
    "input": {
      "skeletonCoverage": 0.33,
      "scaffoldFidelity": 0.29,
      "labelFit": 0.32,
      "navIntegrity": 0.38,
      "linearPassRate": 0.43,
      "flattenOptimism": 0.46,
      "experienceHardness": 0.6,
      "leakageRisk": 0.51,
      "authorBias": "label_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 22.22,
      "scaffoldDiagnosis": 33.9,
      "navigationOptScore": 39.65,
      "labelIntegrity": 30.06,
      "linearScore": 18.89,
      "confidence": 23,
      "scaffoldContribution": 31.63,
      "linearContribution": 18.61,
      "overall": 33.29
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 2.43,
      "scaffoldDiagnosis": 18.22,
      "navigationOptScore": 14.16,
      "labelIntegrity": 34.08,
      "linearScore": 31.53,
      "confidence": 18.65,
      "scaffoldContribution": 20.08,
      "linearContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "sa-003",
    "input": {
      "skeletonCoverage": 0.37,
      "scaffoldFidelity": 0.27,
      "labelFit": 0.36,
      "navIntegrity": 0.42,
      "linearPassRate": 0.46,
      "flattenOptimism": 0.42,
      "experienceHardness": 0.6,
      "leakageRisk": 0.46,
      "authorBias": "linear_first",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 12.18,
      "scaffoldDiagnosis": 23.71,
      "navigationOptScore": 23.1,
      "labelIntegrity": 17.39,
      "linearScore": 19.94,
      "confidence": 25.6,
      "scaffoldContribution": 19.15,
      "linearContribution": 19.69,
      "overall": 20.25
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 12.17,
      "scaffoldDiagnosis": 17.1,
      "navigationOptScore": 13.13,
      "labelIntegrity": 33.93,
      "linearScore": 54.34,
      "confidence": 18.4,
      "scaffoldContribution": 26.13,
      "linearContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "sa-004",
    "input": {
      "skeletonCoverage": 0.33,
      "scaffoldFidelity": 0.32,
      "labelFit": 0.39,
      "navIntegrity": 0.38,
      "linearPassRate": 0.42,
      "flattenOptimism": 0.43,
      "experienceHardness": 0.53,
      "leakageRisk": 0.46,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 28.09,
      "scaffoldDiagnosis": 36.03,
      "navigationOptScore": 32.42,
      "labelIntegrity": 42.79,
      "linearScore": 18.93,
      "confidence": 26.1,
      "scaffoldContribution": 34.44,
      "linearContribution": 19.05,
      "overall": 35.67
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 8.7,
      "scaffoldDiagnosis": 17.81,
      "navigationOptScore": 13.75,
      "labelIntegrity": 32.79,
      "linearScore": 42.77,
      "confidence": 18.85,
      "scaffoldContribution": 23.16,
      "linearContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "sa-005",
    "input": {
      "skeletonCoverage": 0.37,
      "scaffoldFidelity": 0.36,
      "labelFit": 0.35,
      "navIntegrity": 0.42,
      "linearPassRate": 0.46,
      "flattenOptimism": 0.45,
      "experienceHardness": 0.53,
      "leakageRisk": 0.47,
      "authorBias": "scaffold_strict",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 26.86,
      "scaffoldDiagnosis": 39.64,
      "navigationOptScore": 23.89,
      "labelIntegrity": 49.01,
      "linearScore": 21.8,
      "confidence": 27.6,
      "scaffoldContribution": 33.97,
      "linearContribution": 22.19,
      "overall": 35.85
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 0,
      "scaffoldDiagnosis": 19.51,
      "navigationOptScore": 15.76,
      "labelIntegrity": 34.77,
      "linearScore": 32.95,
      "confidence": 21.05,
      "scaffoldContribution": 20.6,
      "linearContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "sa-006",
    "input": {
      "skeletonCoverage": 0.41,
      "scaffoldFidelity": 0.34,
      "labelFit": 0.39,
      "navIntegrity": 0.45,
      "linearPassRate": 0.5,
      "flattenOptimism": 0.4,
      "experienceHardness": 0.54,
      "leakageRisk": 0.42,
      "authorBias": "balanced",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 33.94,
      "scaffoldDiagnosis": 39.5,
      "navigationOptScore": 39.74,
      "labelIntegrity": 44.49,
      "linearScore": 23.08,
      "confidence": 30.35,
      "scaffoldContribution": 39.22,
      "linearContribution": 23.38,
      "overall": 40.37
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 11.98,
      "scaffoldDiagnosis": 18.04,
      "navigationOptScore": 14.31,
      "labelIntegrity": 34.78,
      "linearScore": 46.72,
      "confidence": 20.5,
      "scaffoldContribution": 25.17,
      "linearContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "sa-007",
    "input": {
      "skeletonCoverage": 0.45,
      "scaffoldFidelity": 0.38,
      "labelFit": 0.42,
      "navIntegrity": 0.49,
      "linearPassRate": 0.53,
      "flattenOptimism": 0.42,
      "experienceHardness": 0.55,
      "leakageRisk": 0.43,
      "authorBias": "label_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 31.59,
      "scaffoldDiagnosis": 43.11,
      "navigationOptScore": 54.51,
      "labelIntegrity": 37.19,
      "linearScore": 25.15,
      "confidence": 33.6,
      "scaffoldContribution": 42,
      "linearContribution": 25.64,
      "overall": 43.06
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 8.27,
      "scaffoldDiagnosis": 19.34,
      "navigationOptScore": 15.59,
      "labelIntegrity": 36.3,
      "linearScore": 34.2,
      "confidence": 22.15,
      "scaffoldContribution": 22.74,
      "linearContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "sa-008",
    "input": {
      "skeletonCoverage": 0.41,
      "scaffoldFidelity": 0.43,
      "labelFit": 0.46,
      "navIntegrity": 0.45,
      "linearPassRate": 0.49,
      "flattenOptimism": 0.43,
      "experienceHardness": 0.47,
      "leakageRisk": 0.44,
      "authorBias": "linear_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 19.33,
      "scaffoldDiagnosis": 35.43,
      "navigationOptScore": 27.26,
      "labelIntegrity": 25.07,
      "linearScore": 24.32,
      "confidence": 34.35,
      "scaffoldContribution": 26.68,
      "linearContribution": 25.23,
      "overall": 27.42
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 16.4,
      "scaffoldDiagnosis": 20.18,
      "navigationOptScore": 16.31,
      "labelIntegrity": 35.17,
      "linearScore": 58.5,
      "confidence": 22.7,
      "scaffoldContribution": 29.31,
      "linearContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "sa-009",
    "input": {
      "skeletonCoverage": 0.46,
      "scaffoldFidelity": 0.41,
      "labelFit": 0.5,
      "navIntegrity": 0.49,
      "linearPassRate": 0.53,
      "flattenOptimism": 0.39,
      "experienceHardness": 0.48,
      "leakageRisk": 0.38,
      "authorBias": "balanced",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 40.05,
      "scaffoldDiagnosis": 45.49,
      "navigationOptScore": 45.04,
      "labelIntegrity": 53.15,
      "linearScore": 25.81,
      "confidence": 37.35,
      "scaffoldContribution": 45.63,
      "linearContribution": 26.69,
      "overall": 46.22
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 14.91,
      "scaffoldDiagnosis": 19.07,
      "navigationOptScore": 15.29,
      "labelIntegrity": 35.36,
      "linearScore": 48.88,
      "confidence": 22.7,
      "scaffoldContribution": 26.7,
      "linearContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "sa-010",
    "input": {
      "skeletonCoverage": 0.5,
      "scaffoldFidelity": 0.45,
      "labelFit": 0.46,
      "navIntegrity": 0.53,
      "linearPassRate": 0.57,
      "flattenOptimism": 0.4,
      "experienceHardness": 0.49,
      "leakageRisk": 0.39,
      "authorBias": "scaffold_strict",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 36.62,
      "scaffoldDiagnosis": 49.14,
      "navigationOptScore": 33.16,
      "labelIntegrity": 61.53,
      "linearScore": 28.29,
      "confidence": 39,
      "scaffoldContribution": 44.14,
      "linearContribution": 29.32,
      "overall": 45.47
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 3.59,
      "scaffoldDiagnosis": 20.18,
      "navigationOptScore": 16.7,
      "labelIntegrity": 37.06,
      "linearScore": 35.54,
      "confidence": 24.25,
      "scaffoldContribution": 22.61,
      "linearContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "sa-011",
    "input": {
      "skeletonCoverage": 0.54,
      "scaffoldFidelity": 0.49,
      "labelFit": 0.49,
      "navIntegrity": 0.57,
      "linearPassRate": 0.6,
      "flattenOptimism": 0.42,
      "experienceHardness": 0.49,
      "leakageRisk": 0.4,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 47.21,
      "scaffoldDiagnosis": 52.75,
      "navigationOptScore": 52.38,
      "labelIntegrity": 55.79,
      "linearScore": 30.54,
      "confidence": 42.25,
      "scaffoldContribution": 51.87,
      "linearContribution": 31.82,
      "overall": 52.26
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 17.1,
      "scaffoldDiagnosis": 21.62,
      "navigationOptScore": 18.14,
      "labelIntegrity": 38.58,
      "linearScore": 54.12,
      "confidence": 26.1,
      "scaffoldContribution": 29.91,
      "linearContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "sa-012",
    "input": {
      "skeletonCoverage": 0.5,
      "scaffoldFidelity": 0.48,
      "labelFit": 0.53,
      "navIntegrity": 0.53,
      "linearPassRate": 0.56,
      "flattenOptimism": 0.37,
      "experienceHardness": 0.42,
      "leakageRisk": 0.35,
      "authorBias": "label_first",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 38.19,
      "scaffoldDiagnosis": 51.28,
      "navigationOptScore": 61.94,
      "labelIntegrity": 43.82,
      "linearScore": 28.34,
      "confidence": 42.1,
      "scaffoldContribution": 49.22,
      "linearContribution": 29.7,
      "overall": 49.71
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 13.23,
      "scaffoldDiagnosis": 19.68,
      "navigationOptScore": 16.17,
      "labelIntegrity": 35.76,
      "linearScore": 34.93,
      "confidence": 24.35,
      "scaffoldContribution": 23.95,
      "linearContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "sa-013",
    "input": {
      "skeletonCoverage": 0.54,
      "scaffoldFidelity": 0.52,
      "labelFit": 0.56,
      "navIntegrity": 0.57,
      "linearPassRate": 0.6,
      "flattenOptimism": 0.39,
      "experienceHardness": 0.42,
      "leakageRisk": 0.36,
      "authorBias": "linear_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 29.13,
      "scaffoldDiagnosis": 44.88,
      "navigationOptScore": 36.95,
      "labelIntegrity": 32.35,
      "linearScore": 31.2,
      "confidence": 45.35,
      "scaffoldContribution": 35.81,
      "linearContribution": 32.8,
      "overall": 36.27
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 22.62,
      "scaffoldDiagnosis": 21.35,
      "navigationOptScore": 17.8,
      "labelIntegrity": 37.74,
      "linearScore": 67.02,
      "confidence": 26.55,
      "scaffoldContribution": 33.31,
      "linearContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "sa-014",
    "input": {
      "skeletonCoverage": 0.58,
      "scaffoldFidelity": 0.56,
      "labelFit": 0.6,
      "navIntegrity": 0.61,
      "linearPassRate": 0.63,
      "flattenOptimism": 0.4,
      "experienceHardness": 0.43,
      "leakageRisk": 0.36,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 52.62,
      "scaffoldDiagnosis": 58.53,
      "navigationOptScore": 57.31,
      "labelIntegrity": 64.3,
      "linearScore": 33.07,
      "confidence": 49,
      "scaffoldContribution": 57.92,
      "linearContribution": 34.8,
      "overall": 57.76
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 20.03,
      "scaffoldDiagnosis": 22.2,
      "navigationOptScore": 18.59,
      "labelIntegrity": 38.98,
      "linearScore": 55.96,
      "confidence": 27.85,
      "scaffoldContribution": 31.15,
      "linearContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "sa-015",
    "input": {
      "skeletonCoverage": 0.62,
      "scaffoldFidelity": 0.54,
      "labelFit": 0.56,
      "navIntegrity": 0.65,
      "linearPassRate": 0.67,
      "flattenOptimism": 0.36,
      "experienceHardness": 0.44,
      "leakageRisk": 0.31,
      "authorBias": "scaffold_strict",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 45.9,
      "scaffoldDiagnosis": 58.35,
      "navigationOptScore": 42.52,
      "labelIntegrity": 73.14,
      "linearScore": 34.55,
      "confidence": 49.6,
      "scaffoldContribution": 53.93,
      "linearContribution": 36.22,
      "overall": 54.74
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 9.43,
      "scaffoldDiagnosis": 21.14,
      "navigationOptScore": 17.93,
      "labelIntegrity": 39.27,
      "linearScore": 38.2,
      "confidence": 27.75,
      "scaffoldContribution": 25.19,
      "linearContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "sa-016",
    "input": {
      "skeletonCoverage": 0.58,
      "scaffoldFidelity": 0.59,
      "labelFit": 0.6,
      "navIntegrity": 0.6,
      "linearPassRate": 0.63,
      "flattenOptimism": 0.37,
      "experienceHardness": 0.36,
      "leakageRisk": 0.32,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 54.46,
      "scaffoldDiagnosis": 60.67,
      "navigationOptScore": 57.87,
      "labelIntegrity": 65.05,
      "linearScore": 33.73,
      "confidence": 50.35,
      "scaffoldContribution": 59.24,
      "linearContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 22.05,
      "scaffoldDiagnosis": 21.91,
      "navigationOptScore": 18.56,
      "labelIntegrity": 38.14,
      "linearScore": 55.7,
      "confidence": 28.3,
      "scaffoldContribution": 31.27,
      "linearContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "sa-017",
    "input": {
      "skeletonCoverage": 0.62,
      "scaffoldFidelity": 0.63,
      "labelFit": 0.63,
      "navIntegrity": 0.64,
      "linearPassRate": 0.67,
      "flattenOptimism": 0.39,
      "experienceHardness": 0.37,
      "leakageRisk": 0.33,
      "authorBias": "label_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 48.43,
      "scaffoldDiagnosis": 64.28,
      "navigationOptScore": 76.01,
      "labelIntegrity": 52.45,
      "linearScore": 36.41,
      "confidence": 53.6,
      "scaffoldContribution": 60.84,
      "linearContribution": 38.61,
      "overall": 60.84
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 18.73,
      "scaffoldDiagnosis": 23.42,
      "navigationOptScore": 20,
      "labelIntegrity": 40.11,
      "linearScore": 39.86,
      "confidence": 30.3,
      "scaffoldContribution": 28.42,
      "linearContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "sa-018",
    "input": {
      "skeletonCoverage": 0.66,
      "scaffoldFidelity": 0.61,
      "labelFit": 0.67,
      "navIntegrity": 0.68,
      "linearPassRate": 0.7,
      "flattenOptimism": 0.34,
      "experienceHardness": 0.38,
      "leakageRisk": 0.27,
      "authorBias": "linear_first",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 38.33,
      "scaffoldDiagnosis": 54.13,
      "navigationOptScore": 45.88,
      "labelIntegrity": 39.79,
      "linearScore": 37.08,
      "confidence": 56.35,
      "scaffoldContribution": 44.56,
      "linearContribution": 39.16,
      "overall": 44.59
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 28.36,
      "scaffoldDiagnosis": 21.66,
      "navigationOptScore": 18.31,
      "labelIntegrity": 39.67,
      "linearScore": 74.27,
      "confidence": 29.5,
      "scaffoldContribution": 36.45,
      "linearContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "sa-019",
    "input": {
      "skeletonCoverage": 0.7,
      "scaffoldFidelity": 0.65,
      "labelFit": 0.7,
      "navIntegrity": 0.72,
      "linearPassRate": 0.74,
      "flattenOptimism": 0.36,
      "experienceHardness": 0.38,
      "leakageRisk": 0.28,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 63.81,
      "scaffoldDiagnosis": 67.74,
      "navigationOptScore": 69.47,
      "labelIntegrity": 73.95,
      "linearScore": 39.94,
      "confidence": 59.6,
      "scaffoldContribution": 68.57,
      "linearContribution": 42.25,
      "overall": 67.83
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 26.25,
      "scaffoldDiagnosis": 23.32,
      "navigationOptScore": 19.92,
      "labelIntegrity": 41.65,
      "linearScore": 62.07,
      "confidence": 31.7,
      "scaffoldContribution": 34.64,
      "linearContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sa-020",
    "input": {
      "skeletonCoverage": 0.66,
      "scaffoldFidelity": 0.7,
      "labelFit": 0.66,
      "navIntegrity": 0.68,
      "linearPassRate": 0.7,
      "flattenOptimism": 0.37,
      "experienceHardness": 0.31,
      "leakageRisk": 0.29,
      "authorBias": "scaffold_strict",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 52.86,
      "scaffoldDiagnosis": 70.06,
      "navigationOptScore": 46.45,
      "labelIntegrity": 85.3,
      "linearScore": 38.94,
      "confidence": 58.35,
      "scaffoldContribution": 62.33,
      "linearContribution": 41.54,
      "overall": 62.59
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 13.66,
      "scaffoldDiagnosis": 23.93,
      "navigationOptScore": 20.75,
      "labelIntegrity": 40.51,
      "linearScore": 40.86,
      "confidence": 32.05,
      "scaffoldContribution": 27.94,
      "linearContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sa-021",
    "input": {
      "skeletonCoverage": 0.7,
      "scaffoldFidelity": 0.68,
      "labelFit": 0.7,
      "navIntegrity": 0.72,
      "linearPassRate": 0.73,
      "flattenOptimism": 0.33,
      "experienceHardness": 0.31,
      "leakageRisk": 0.24,
      "authorBias": "balanced",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 65.6,
      "scaffoldDiagnosis": 69.88,
      "navigationOptScore": 70.62,
      "labelIntegrity": 74.7,
      "linearScore": 39.99,
      "confidence": 60.95,
      "scaffoldContribution": 70.03,
      "linearContribution": 42.54,
      "overall": 69.08
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 27.89,
      "scaffoldDiagnosis": 22.72,
      "navigationOptScore": 19.62,
      "labelIntegrity": 40.35,
      "linearScore": 61.19,
      "confidence": 31.8,
      "scaffoldContribution": 34.35,
      "linearContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sa-022",
    "input": {
      "skeletonCoverage": 0.74,
      "scaffoldFidelity": 0.72,
      "labelFit": 0.73,
      "navIntegrity": 0.76,
      "linearPassRate": 0.77,
      "flattenOptimism": 0.34,
      "experienceHardness": 0.32,
      "leakageRisk": 0.25,
      "authorBias": "label_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 57.62,
      "scaffoldDiagnosis": 73.52,
      "navigationOptScore": 91.49,
      "labelIntegrity": 59.58,
      "linearScore": 42.47,
      "confidence": 64.35,
      "scaffoldContribution": 71.35,
      "linearContribution": 45.15,
      "overall": 70.63
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 24.57,
      "scaffoldDiagnosis": 23.79,
      "navigationOptScore": 20.63,
      "labelIntegrity": 42.05,
      "linearScore": 42.21,
      "confidence": 33.35,
      "scaffoldContribution": 30.65,
      "linearContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "sa-023",
    "input": {
      "skeletonCoverage": 0.79,
      "scaffoldFidelity": 0.76,
      "labelFit": 0.77,
      "navIntegrity": 0.8,
      "linearPassRate": 0.81,
      "flattenOptimism": 0.36,
      "experienceHardness": 0.33,
      "leakageRisk": 0.25,
      "authorBias": "linear_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 49.04,
      "scaffoldDiagnosis": 67.38,
      "navigationOptScore": 54.82,
      "labelIntegrity": 48.57,
      "linearScore": 45.16,
      "confidence": 68.25,
      "scaffoldContribution": 54.96,
      "linearContribution": 48.03,
      "overall": 54.71
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 33.86,
      "scaffoldDiagnosis": 25.25,
      "navigationOptScore": 22.05,
      "labelIntegrity": 43.92,
      "linearScore": 84.72,
      "confidence": 35.45,
      "scaffoldContribution": 41.96,
      "linearContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "sa-024",
    "input": {
      "skeletonCoverage": 0.75,
      "scaffoldFidelity": 0.75,
      "labelFit": 0.81,
      "navIntegrity": 0.76,
      "linearPassRate": 0.77,
      "flattenOptimism": 0.31,
      "experienceHardness": 0.25,
      "leakageRisk": 0.2,
      "authorBias": "balanced",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 71.55,
      "scaffoldDiagnosis": 75.91,
      "navigationOptScore": 75.74,
      "labelIntegrity": 83.36,
      "linearScore": 43.13,
      "confidence": 68.1,
      "scaffoldContribution": 76.37,
      "linearContribution": 46.07,
      "overall": 74.92
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 31.21,
      "scaffoldDiagnosis": 23.36,
      "navigationOptScore": 20.13,
      "labelIntegrity": 41.11,
      "linearScore": 63.65,
      "confidence": 33.9,
      "scaffoldContribution": 35.89,
      "linearContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "sa-025",
    "input": {
      "skeletonCoverage": 0.79,
      "scaffoldFidelity": 0.79,
      "labelFit": 0.77,
      "navIntegrity": 0.8,
      "linearPassRate": 0.8,
      "flattenOptimism": 0.33,
      "experienceHardness": 0.26,
      "leakageRisk": 0.21,
      "authorBias": "scaffold_strict",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 62.51,
      "scaffoldDiagnosis": 79.52,
      "navigationOptScore": 55.93,
      "labelIntegrity": 97.81,
      "linearScore": 45.2,
      "confidence": 69.6,
      "scaffoldContribution": 72.52,
      "linearContribution": 48.27,
      "overall": 72.16
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 19.5,
      "scaffoldDiagnosis": 24.6,
      "navigationOptScore": 21.69,
      "labelIntegrity": 42.63,
      "linearScore": 43.52,
      "confidence": 35.55,
      "scaffoldContribution": 30.39,
      "linearContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "sa-026",
    "input": {
      "skeletonCoverage": 0.83,
      "scaffoldFidelity": 0.83,
      "labelFit": 0.8,
      "navIntegrity": 0.83,
      "linearPassRate": 0.84,
      "flattenOptimism": 0.34,
      "experienceHardness": 0.27,
      "leakageRisk": 0.22,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 78.52,
      "scaffoldDiagnosis": 83.17,
      "navigationOptScore": 82.25,
      "labelIntegrity": 86,
      "linearScore": 47.68,
      "confidence": 73,
      "scaffoldContribution": 82.33,
      "linearContribution": 50.87,
      "overall": 80.67
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 33.17,
      "scaffoldDiagnosis": 25.67,
      "navigationOptScore": 22.7,
      "labelIntegrity": 44.32,
      "linearScore": 68.8,
      "confidence": 37.1,
      "scaffoldContribution": 38.93,
      "linearContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "sa-027",
    "input": {
      "skeletonCoverage": 0.87,
      "scaffoldFidelity": 0.81,
      "labelFit": 0.84,
      "navIntegrity": 0.87,
      "linearPassRate": 0.88,
      "flattenOptimism": 0.3,
      "experienceHardness": 0.27,
      "leakageRisk": 0.17,
      "authorBias": "label_first",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 67.26,
      "scaffoldDiagnosis": 82.98,
      "navigationOptScore": 100,
      "labelIntegrity": 67.17,
      "linearScore": 49.35,
      "confidence": 75.6,
      "scaffoldContribution": 80.18,
      "linearContribution": 52.5,
      "overall": 79.2
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 30.78,
      "scaffoldDiagnosis": 24.7,
      "navigationOptScore": 21.75,
      "labelIntegrity": 44.62,
      "linearScore": 45.22,
      "confidence": 37.2,
      "scaffoldContribution": 33.41,
      "linearContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "sa-028",
    "input": {
      "skeletonCoverage": 0.83,
      "scaffoldFidelity": 0.86,
      "labelFit": 0.87,
      "navIntegrity": 0.83,
      "linearPassRate": 0.84,
      "flattenOptimism": 0.31,
      "experienceHardness": 0.2,
      "leakageRisk": 0.17,
      "authorBias": "linear_first",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 54.87,
      "scaffoldDiagnosis": 75.3,
      "navigationOptScore": 59.19,
      "labelIntegrity": 54.75,
      "linearScore": 48.34,
      "confidence": 76.1,
      "scaffoldContribution": 60.96,
      "linearContribution": 51.73,
      "overall": 60.3
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 38.81,
      "scaffoldDiagnosis": 25.25,
      "navigationOptScore": 22.17,
      "labelIntegrity": 43.48,
      "linearScore": 86.95,
      "confidence": 37.65,
      "scaffoldContribution": 43.33,
      "linearContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "sa-029",
    "input": {
      "skeletonCoverage": 0.87,
      "scaffoldFidelity": 0.9,
      "labelFit": 0.91,
      "navIntegrity": 0.87,
      "linearPassRate": 0.87,
      "flattenOptimism": 0.33,
      "experienceHardness": 0.2,
      "leakageRisk": 0.18,
      "authorBias": "balanced",
      "profile": "scaffolded_authoring"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 83.89,
      "scaffoldDiagnosis": 88.91,
      "navigationOptScore": 87.12,
      "labelIntegrity": 94.51,
      "linearScore": 50.59,
      "confidence": 79.6,
      "scaffoldContribution": 88.34,
      "linearContribution": 54.16,
      "overall": 86.19
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 36.33,
      "scaffoldDiagnosis": 26.6,
      "navigationOptScore": 23.46,
      "labelIntegrity": 45,
      "linearScore": 71.06,
      "confidence": 39.5,
      "scaffoldContribution": 40.49,
      "linearContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "sa-030",
    "input": {
      "skeletonCoverage": 0.91,
      "scaffoldFidelity": 0.88,
      "labelFit": 0.87,
      "navIntegrity": 0.91,
      "linearPassRate": 0.91,
      "flattenOptimism": 0.28,
      "experienceHardness": 0.21,
      "leakageRisk": 0.13,
      "authorBias": "scaffold_strict",
      "profile": "naive_linear"
    },
    "expectedScaffoldedAuthoring": {
      "mode": "scaffolded_authoring",
      "structureCoverage": 71.59,
      "scaffoldDiagnosis": 88.77,
      "navigationOptScore": 64.69,
      "labelIntegrity": 100,
      "linearScore": 51.88,
      "confidence": 80.35,
      "scaffoldContribution": 80.03,
      "linearContribution": 55.31,
      "overall": 79.58
    },
    "expectedNaiveLinear": {
      "mode": "naive_linear",
      "structureCoverage": 25.72,
      "scaffoldDiagnosis": 25.06,
      "navigationOptScore": 22.34,
      "labelIntegrity": 45.02,
      "linearScore": 46.21,
      "confidence": 38.95,
      "scaffoldContribution": 32.87,
      "linearContribution": 50.68,
      "overall": 44.3
    }
  }
];
