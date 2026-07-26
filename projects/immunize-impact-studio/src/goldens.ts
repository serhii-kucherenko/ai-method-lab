import type { ImpactInput, ImpactQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ImpactInput;
  expectedLinked: ImpactQuality;
  expectedCoverageOnly: ImpactQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ii-001",
    "input": {
      "dtp3Coverage": 0.29,
      "measlesCoverage": 0.34,
      "underFiveMortality": 0.55,
      "panelYears": 0.34,
      "equityGap": 0.5,
      "antigenBreadth": 0.34,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 35.49,
      "mortalityLinkScore": 47,
      "equityScore": 47.23,
      "panelScore": 26.44,
      "dashboardPenalty": 32.78,
      "confidence": 14.1,
      "mortalityContribution": 47.47,
      "coverageContribution": 31.7,
      "overall": 48.63
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 26.01,
      "mortalityLinkScore": 21.46,
      "equityScore": 20.69,
      "panelScore": 22.12,
      "dashboardPenalty": 20.78,
      "confidence": 13.12,
      "mortalityContribution": 33.9,
      "coverageContribution": 21.51,
      "overall": 18.54
    }
  },
  {
    "id": "ii-002",
    "input": {
      "dtp3Coverage": 0.33,
      "measlesCoverage": 0.38,
      "underFiveMortality": 0.56,
      "panelYears": 0.38,
      "equityGap": 0.51,
      "antigenBreadth": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "impactBias": "coverage_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 43.66,
      "mortalityLinkScore": 37.15,
      "equityScore": 63.95,
      "panelScore": 30.15,
      "dashboardPenalty": 32.65,
      "confidence": 16.9,
      "mortalityContribution": 50.3,
      "coverageContribution": 39.72,
      "overall": 52.4
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 28.98,
      "mortalityLinkScore": 28.04,
      "equityScore": 23.57,
      "panelScore": 28.84,
      "dashboardPenalty": 19.41,
      "confidence": 15.85,
      "mortalityContribution": 38,
      "coverageContribution": 26.08,
      "overall": 23
    }
  },
  {
    "id": "ii-003",
    "input": {
      "dtp3Coverage": 0.37,
      "measlesCoverage": 0.42,
      "underFiveMortality": 0.5,
      "panelYears": 0.41,
      "equityGap": 0.46,
      "antigenBreadth": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "impactBias": "dashboard_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 16.17,
      "mortalityLinkScore": 32.65,
      "equityScore": 31.18,
      "panelScore": 33.96,
      "dashboardPenalty": 54.94,
      "confidence": 20.9,
      "mortalityContribution": 29.95,
      "coverageContribution": 23.5,
      "overall": 29.79
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 32.22,
      "mortalityLinkScore": 31.44,
      "equityScore": 25.54,
      "panelScore": 30.43,
      "dashboardPenalty": 17.05,
      "confidence": 20.01,
      "mortalityContribution": 40.52,
      "coverageContribution": 29.36,
      "overall": 26.06
    }
  },
  {
    "id": "ii-004",
    "input": {
      "dtp3Coverage": 0.33,
      "measlesCoverage": 0.38,
      "underFiveMortality": 0.51,
      "panelYears": 0.37,
      "equityGap": 0.46,
      "antigenBreadth": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 40.25,
      "mortalityLinkScore": 50.89,
      "equityScore": 51.36,
      "panelScore": 30.15,
      "dashboardPenalty": 30.9,
      "confidence": 17.9,
      "mortalityContribution": 51.29,
      "coverageContribution": 35.09,
      "overall": 52.37
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 29.38,
      "mortalityLinkScore": 24.17,
      "equityScore": 22.82,
      "panelScore": 23.61,
      "dashboardPenalty": 18.66,
      "confidence": 17,
      "mortalityContribution": 36.26,
      "coverageContribution": 24.58,
      "overall": 21.45
    }
  },
  {
    "id": "ii-005",
    "input": {
      "dtp3Coverage": 0.37,
      "measlesCoverage": 0.42,
      "underFiveMortality": 0.51,
      "panelYears": 0.41,
      "equityGap": 0.47,
      "antigenBreadth": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "impactBias": "mortality_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 49,
      "mortalityLinkScore": 62.29,
      "equityScore": 30.79,
      "panelScore": 33.86,
      "dashboardPenalty": 30.65,
      "confidence": 20.7,
      "mortalityContribution": 52.91,
      "coverageContribution": 35.82,
      "overall": 53.83
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 20.24,
      "mortalityLinkScore": 20.15,
      "equityScore": 25.69,
      "panelScore": 19.93,
      "dashboardPenalty": 17.2,
      "confidence": 19.78,
      "mortalityContribution": 33.76,
      "coverageContribution": 17.79,
      "overall": 15.54
    }
  },
  {
    "id": "ii-006",
    "input": {
      "dtp3Coverage": 0.41,
      "measlesCoverage": 0.45,
      "underFiveMortality": 0.46,
      "panelYears": 0.45,
      "equityGap": 0.42,
      "antigenBreadth": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "impactBias": "balanced",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 48.81,
      "mortalityLinkScore": 57.29,
      "equityScore": 57.28,
      "panelScore": 37.93,
      "dashboardPenalty": 28.42,
      "confidence": 24.23,
      "mortalityContribution": 57.49,
      "coverageContribution": 41.43,
      "overall": 58.6
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 35.82,
      "mortalityLinkScore": 29.06,
      "equityScore": 26.99,
      "panelScore": 27.35,
      "dashboardPenalty": 15.26,
      "confidence": 23.37,
      "mortalityContribution": 40.79,
      "coverageContribution": 30.37,
      "overall": 26.9
    }
  },
  {
    "id": "ii-007",
    "input": {
      "dtp3Coverage": 0.45,
      "measlesCoverage": 0.49,
      "underFiveMortality": 0.47,
      "panelYears": 0.48,
      "equityGap": 0.43,
      "antigenBreadth": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "impactBias": "coverage_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 58.48,
      "mortalityLinkScore": 45.02,
      "equityScore": 76.98,
      "panelScore": 41.14,
      "dashboardPenalty": 28.29,
      "confidence": 27.03,
      "mortalityContribution": 60.62,
      "coverageContribution": 50.59,
      "overall": 62.81
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 38.8,
      "mortalityLinkScore": 37.22,
      "equityScore": 29.87,
      "panelScore": 34.89,
      "dashboardPenalty": 13.89,
      "confidence": 26.1,
      "mortalityContribution": 45.38,
      "coverageContribution": 35.5,
      "overall": 31.91
    }
  },
  {
    "id": "ii-008",
    "input": {
      "dtp3Coverage": 0.41,
      "measlesCoverage": 0.45,
      "underFiveMortality": 0.47,
      "panelYears": 0.44,
      "equityGap": 0.44,
      "antigenBreadth": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "impactBias": "dashboard_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 18.58,
      "mortalityLinkScore": 35.22,
      "equityScore": 32.69,
      "panelScore": 37.23,
      "dashboardPenalty": 53.64,
      "confidence": 23.83,
      "mortalityContribution": 32.01,
      "coverageContribution": 25.33,
      "overall": 31.81
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 35.24,
      "mortalityLinkScore": 34.34,
      "equityScore": 27.29,
      "panelScore": 32.14,
      "dashboardPenalty": 15.47,
      "confidence": 22.96,
      "mortalityContribution": 42.71,
      "coverageContribution": 32.25,
      "overall": 28.73
    }
  },
  {
    "id": "ii-009",
    "input": {
      "dtp3Coverage": 0.46,
      "measlesCoverage": 0.49,
      "underFiveMortality": 0.42,
      "panelYears": 0.48,
      "equityGap": 0.38,
      "antigenBreadth": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "impactBias": "balanced",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 54.13,
      "mortalityLinkScore": 61.48,
      "equityScore": 61.41,
      "panelScore": 41.84,
      "dashboardPenalty": 26.42,
      "confidence": 28.31,
      "mortalityContribution": 61.58,
      "coverageContribution": 45.1,
      "overall": 62.61
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 39.79,
      "mortalityLinkScore": 32.15,
      "equityScore": 29.12,
      "panelScore": 28.84,
      "dashboardPenalty": 13.09,
      "confidence": 27.47,
      "mortalityContribution": 43.36,
      "coverageContribution": 33.87,
      "overall": 30.2
    }
  },
  {
    "id": "ii-010",
    "input": {
      "dtp3Coverage": 0.5,
      "measlesCoverage": 0.53,
      "underFiveMortality": 0.43,
      "panelYears": 0.52,
      "equityGap": 0.39,
      "antigenBreadth": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "impactBias": "mortality_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 64.4,
      "mortalityLinkScore": 73.89,
      "equityScore": 36.6,
      "panelScore": 45.56,
      "dashboardPenalty": 26.29,
      "confidence": 31.11,
      "mortalityContribution": 63,
      "coverageContribution": 45.76,
      "overall": 63.9
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 30.77,
      "mortalityLinkScore": 25.86,
      "equityScore": 32,
      "panelScore": 23.68,
      "dashboardPenalty": 11.72,
      "confidence": 30.2,
      "mortalityContribution": 40.12,
      "coverageContribution": 26.24,
      "overall": 23.53
    }
  },
  {
    "id": "ii-011",
    "input": {
      "dtp3Coverage": 0.54,
      "measlesCoverage": 0.57,
      "underFiveMortality": 0.43,
      "panelYears": 0.55,
      "equityGap": 0.4,
      "antigenBreadth": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 62.43,
      "mortalityLinkScore": 64.37,
      "equityScore": 63.49,
      "panelScore": 48.77,
      "dashboardPenalty": 26.04,
      "confidence": 33.91,
      "mortalityContribution": 65.36,
      "coverageContribution": 51.03,
      "overall": 66.78
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 46.63,
      "mortalityLinkScore": 36.63,
      "equityScore": 34.87,
      "panelScore": 33.23,
      "dashboardPenalty": 10.26,
      "confidence": 32.98,
      "mortalityContribution": 48.22,
      "coverageContribution": 39.54,
      "overall": 35.63
    }
  },
  {
    "id": "ii-012",
    "input": {
      "dtp3Coverage": 0.5,
      "measlesCoverage": 0.53,
      "underFiveMortality": 0.38,
      "panelYears": 0.51,
      "equityGap": 0.35,
      "antigenBreadth": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "impactBias": "coverage_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 64.98,
      "mortalityLinkScore": 49.75,
      "equityScore": 85.79,
      "panelScore": 45.45,
      "dashboardPenalty": 24.77,
      "confidence": 31.91,
      "mortalityContribution": 66.53,
      "coverageContribution": 55.28,
      "overall": 68.51
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 42.57,
      "mortalityLinkScore": 41.44,
      "equityScore": 31.4,
      "panelScore": 36.12,
      "dashboardPenalty": 11.03,
      "confidence": 31.17,
      "mortalityContribution": 48.1,
      "coverageContribution": 39.39,
      "overall": 35.49
    }
  },
  {
    "id": "ii-013",
    "input": {
      "dtp3Coverage": 0.54,
      "measlesCoverage": 0.57,
      "underFiveMortality": 0.38,
      "panelYears": 0.55,
      "equityGap": 0.36,
      "antigenBreadth": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "impactBias": "dashboard_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 27.17,
      "mortalityLinkScore": 43.55,
      "equityScore": 38.63,
      "panelScore": 49.17,
      "dashboardPenalty": 49.16,
      "confidence": 34.71,
      "mortalityContribution": 39.19,
      "coverageContribution": 32.2,
      "overall": 38.93
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 45.93,
      "mortalityLinkScore": 44.24,
      "equityScore": 34.27,
      "panelScore": 38.87,
      "dashboardPenalty": 9.57,
      "confidence": 33.94,
      "mortalityContribution": 50.75,
      "coverageContribution": 42.46,
      "overall": 38.4
    }
  },
  {
    "id": "ii-014",
    "input": {
      "dtp3Coverage": 0.58,
      "measlesCoverage": 0.61,
      "underFiveMortality": 0.39,
      "panelYears": 0.58,
      "equityGap": 0.36,
      "antigenBreadth": 0.61,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 67.2,
      "mortalityLinkScore": 68.26,
      "equityScore": 67.62,
      "panelScore": 52.48,
      "dashboardPenalty": 24.16,
      "confidence": 37.71,
      "mortalityContribution": 69.19,
      "coverageContribution": 54.42,
      "overall": 70.53
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 50,
      "mortalityLinkScore": 39.34,
      "equityScore": 37,
      "panelScore": 34.72,
      "dashboardPenalty": 8.14,
      "confidence": 36.86,
      "mortalityContribution": 50.58,
      "coverageContribution": 42.61,
      "overall": 38.54
    }
  },
  {
    "id": "ii-015",
    "input": {
      "dtp3Coverage": 0.62,
      "measlesCoverage": 0.65,
      "underFiveMortality": 0.34,
      "panelYears": 0.62,
      "equityGap": 0.31,
      "antigenBreadth": 0.65,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "impactBias": "mortality_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 79.78,
      "mortalityLinkScore": 85.8,
      "equityScore": 42.42,
      "panelScore": 56.8,
      "dashboardPenalty": 21.93,
      "confidence": 41.71,
      "mortalityContribution": 73.18,
      "coverageContribution": 55.5,
      "overall": 74
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 40.86,
      "mortalityLinkScore": 31.61,
      "equityScore": 38.98,
      "panelScore": 27.38,
      "dashboardPenalty": 5.87,
      "confidence": 40.97,
      "mortalityContribution": 46.59,
      "coverageContribution": 34.48,
      "overall": 31.32
    }
  },
  {
    "id": "ii-016",
    "input": {
      "dtp3Coverage": 0.58,
      "measlesCoverage": 0.6,
      "underFiveMortality": 0.34,
      "panelYears": 0.58,
      "equityGap": 0.32,
      "antigenBreadth": 0.6,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 67.24,
      "mortalityLinkScore": 71.06,
      "equityScore": 69.95,
      "panelScore": 52.63,
      "dashboardPenalty": 22.64,
      "confidence": 38.04,
      "mortalityContribution": 70.88,
      "coverageContribution": 54.39,
      "overall": 71.91
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 49.53,
      "mortalityLinkScore": 39.6,
      "equityScore": 35.72,
      "panelScore": 33.87,
      "dashboardPenalty": 7.78,
      "confidence": 37.3,
      "mortalityContribution": 50.19,
      "coverageContribution": 42.52,
      "overall": 38.33
    }
  },
  {
    "id": "ii-017",
    "input": {
      "dtp3Coverage": 0.62,
      "measlesCoverage": 0.64,
      "underFiveMortality": 0.35,
      "panelYears": 0.62,
      "equityGap": 0.33,
      "antigenBreadth": 0.64,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "impactBias": "coverage_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 78.99,
      "mortalityLinkScore": 55.92,
      "equityScore": 94.11,
      "panelScore": 56.35,
      "dashboardPenalty": 22.51,
      "confidence": 40.84,
      "mortalityContribution": 74.66,
      "coverageContribution": 65.51,
      "overall": 77.01
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 52.51,
      "mortalityLinkScore": 50.02,
      "equityScore": 38.6,
      "panelScore": 43.32,
      "dashboardPenalty": 6.41,
      "confidence": 40.03,
      "mortalityContribution": 55.61,
      "coverageContribution": 48.6,
      "overall": 44.26
    }
  },
  {
    "id": "ii-018",
    "input": {
      "dtp3Coverage": 0.66,
      "measlesCoverage": 0.68,
      "underFiveMortality": 0.3,
      "panelYears": 0.65,
      "equityGap": 0.27,
      "antigenBreadth": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "impactBias": "dashboard_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 35.2,
      "mortalityLinkScore": 51.11,
      "equityScore": 44.71,
      "panelScore": 60.26,
      "dashboardPenalty": 44.69,
      "confidence": 45.04,
      "mortalityContribution": 46,
      "coverageContribution": 38.72,
      "overall": 45.69
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 55.96,
      "mortalityLinkScore": 53.4,
      "equityScore": 40.43,
      "panelScore": 45.03,
      "dashboardPenalty": 4.08,
      "confidence": 44.33,
      "mortalityContribution": 58.15,
      "coverageContribution": 52.01,
      "overall": 47.54
    }
  },
  {
    "id": "ii-019",
    "input": {
      "dtp3Coverage": 0.7,
      "measlesCoverage": 0.72,
      "underFiveMortality": 0.3,
      "panelYears": 0.69,
      "equityGap": 0.28,
      "antigenBreadth": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 80.52,
      "mortalityLinkScore": 78.55,
      "equityScore": 77.66,
      "panelScore": 63.98,
      "dashboardPenalty": 19.8,
      "confidence": 47.84,
      "mortalityContribution": 79.2,
      "coverageContribution": 64.14,
      "overall": 80.49
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 59.82,
      "mortalityLinkScore": 46.94,
      "equityScore": 43.3,
      "panelScore": 39.96,
      "dashboardPenalty": 2.62,
      "confidence": 47.1,
      "mortalityContribution": 57.48,
      "coverageContribution": 51.48,
      "overall": 46.92
    }
  },
  {
    "id": "ii-020",
    "input": {
      "dtp3Coverage": 0.66,
      "measlesCoverage": 0.68,
      "underFiveMortality": 0.31,
      "panelYears": 0.65,
      "equityGap": 0.29,
      "antigenBreadth": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "impactBias": "mortality_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 84.29,
      "mortalityLinkScore": 89.71,
      "equityScore": 43.93,
      "panelScore": 60.06,
      "dashboardPenalty": 20.63,
      "confidence": 44.64,
      "mortalityContribution": 76.26,
      "coverageContribution": 58.27,
      "overall": 77.02
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 43.88,
      "mortalityLinkScore": 33.3,
      "equityScore": 40.73,
      "panelScore": 28.3,
      "dashboardPenalty": 4.29,
      "confidence": 43.91,
      "mortalityContribution": 48.38,
      "coverageContribution": 36.91,
      "overall": 33.55
    }
  },
  {
    "id": "ii-021",
    "input": {
      "dtp3Coverage": 0.7,
      "measlesCoverage": 0.72,
      "underFiveMortality": 0.25,
      "panelYears": 0.68,
      "equityGap": 0.24,
      "antigenBreadth": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "impactBias": "balanced",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 81.07,
      "mortalityLinkScore": 81.2,
      "equityScore": 80,
      "panelScore": 63.87,
      "dashboardPenalty": 18.28,
      "confidence": 48.64,
      "mortalityContribution": 80.99,
      "coverageContribution": 64.28,
      "overall": 81.98
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 59.62,
      "mortalityLinkScore": 47.4,
      "equityScore": 42.7,
      "panelScore": 39.03,
      "dashboardPenalty": 1.93,
      "confidence": 48.07,
      "mortalityContribution": 57.36,
      "coverageContribution": 51.57,
      "overall": 46.9
    }
  },
  {
    "id": "ii-022",
    "input": {
      "dtp3Coverage": 0.74,
      "measlesCoverage": 0.76,
      "underFiveMortality": 0.26,
      "panelYears": 0.72,
      "equityGap": 0.25,
      "antigenBreadth": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "impactBias": "coverage_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 94.38,
      "mortalityLinkScore": 63.79,
      "equityScore": 100,
      "panelScore": 67.59,
      "dashboardPenalty": 18.15,
      "confidence": 51.44,
      "mortalityContribution": 83.57,
      "coverageContribution": 75.26,
      "overall": 86.07
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 62.6,
      "mortalityLinkScore": 59.4,
      "equityScore": 45.58,
      "panelScore": 49.61,
      "dashboardPenalty": 0.56,
      "confidence": 50.8,
      "mortalityContribution": 63.33,
      "coverageContribution": 58.27,
      "overall": 53.44
    }
  },
  {
    "id": "ii-023",
    "input": {
      "dtp3Coverage": 0.79,
      "measlesCoverage": 0.8,
      "underFiveMortality": 0.27,
      "panelYears": 0.76,
      "equityGap": 0.25,
      "antigenBreadth": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "impactBias": "dashboard_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 43.19,
      "mortalityLinkScore": 57.58,
      "equityScore": 48.32,
      "panelScore": 71.6,
      "dashboardPenalty": 42.31,
      "confidence": 54.72,
      "mortalityContribution": 51.53,
      "coverageContribution": 45.39,
      "overall": 51.42
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 66.77,
      "mortalityLinkScore": 62.69,
      "equityScore": 48.31,
      "panelScore": 52.48,
      "dashboardPenalty": 0,
      "confidence": 53.93,
      "mortalityContribution": 66.05,
      "coverageContribution": 61.92,
      "overall": 56.95
    }
  },
  {
    "id": "ii-024",
    "input": {
      "dtp3Coverage": 0.75,
      "measlesCoverage": 0.76,
      "underFiveMortality": 0.21,
      "panelYears": 0.72,
      "equityGap": 0.2,
      "antigenBreadth": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "impactBias": "balanced",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 86.39,
      "mortalityLinkScore": 85.54,
      "equityScore": 84.35,
      "panelScore": 68.29,
      "dashboardPenalty": 16.28,
      "confidence": 52.72,
      "mortalityContribution": 85.19,
      "coverageContribution": 68.13,
      "overall": 86.12
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 63.59,
      "mortalityLinkScore": 50.49,
      "equityScore": 44.83,
      "panelScore": 40.85,
      "dashboardPenalty": 0,
      "confidence": 52.17,
      "mortalityContribution": 59.95,
      "coverageContribution": 55.13,
      "overall": 50.25
    }
  },
  {
    "id": "ii-025",
    "input": {
      "dtp3Coverage": 0.79,
      "measlesCoverage": 0.8,
      "underFiveMortality": 0.22,
      "panelYears": 0.75,
      "equityGap": 0.21,
      "antigenBreadth": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "impactBias": "mortality_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 100,
      "mortalityLinkScore": 100,
      "equityScore": 49.75,
      "panelScore": 71.5,
      "dashboardPenalty": 16.15,
      "confidence": 55.52,
      "mortalityContribution": 86.04,
      "coverageContribution": 68.2,
      "overall": 86.83
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 54.57,
      "mortalityLinkScore": 39.26,
      "equityScore": 47.71,
      "panelScore": 32.01,
      "dashboardPenalty": 0,
      "confidence": 54.9,
      "mortalityContribution": 54.71,
      "coverageContribution": 45.53,
      "overall": 41.61
    }
  },
  {
    "id": "ii-026",
    "input": {
      "dtp3Coverage": 0.83,
      "measlesCoverage": 0.83,
      "underFiveMortality": 0.23,
      "panelYears": 0.79,
      "equityGap": 0.22,
      "antigenBreadth": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 94.15,
      "mortalityLinkScore": 87.87,
      "equityScore": 86.21,
      "panelScore": 74.97,
      "dashboardPenalty": 16.02,
      "confidence": 57.85,
      "mortalityContribution": 88.56,
      "coverageContribution": 73.79,
      "overall": 89.9
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 70.27,
      "mortalityLinkScore": 54.71,
      "equityScore": 49.91,
      "panelScore": 45.11,
      "dashboardPenalty": 0,
      "confidence": 57.11,
      "mortalityContribution": 64,
      "coverageContribution": 60.59,
      "overall": 55.4
    }
  },
  {
    "id": "ii-027",
    "input": {
      "dtp3Coverage": 0.87,
      "measlesCoverage": 0.87,
      "underFiveMortality": 0.17,
      "panelYears": 0.83,
      "equityGap": 0.17,
      "antigenBreadth": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "impactBias": "coverage_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 100,
      "mortalityLinkScore": 72.11,
      "equityScore": 100,
      "panelScore": 79.28,
      "dashboardPenalty": 13.67,
      "confidence": 61.85,
      "mortalityContribution": 88.61,
      "coverageContribution": 79.55,
      "overall": 90.98
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 73.01,
      "mortalityLinkScore": 69.1,
      "equityScore": 51.88,
      "panelScore": 56.09,
      "dashboardPenalty": 0,
      "confidence": 61.27,
      "mortalityContribution": 70.02,
      "coverageContribution": 68.23,
      "overall": 62.62
    }
  },
  {
    "id": "ii-028",
    "input": {
      "dtp3Coverage": 0.83,
      "measlesCoverage": 0.83,
      "underFiveMortality": 0.18,
      "panelYears": 0.79,
      "equityGap": 0.17,
      "antigenBreadth": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "impactBias": "dashboard_first",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 46.2,
      "mortalityLinkScore": 62.01,
      "equityScore": 52.16,
      "panelScore": 75.47,
      "dashboardPenalty": 38.91,
      "confidence": 58.85,
      "mortalityContribution": 55.25,
      "coverageContribution": 47.42,
      "overall": 54.84
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 69.67,
      "mortalityLinkScore": 66.19,
      "equityScore": 49.16,
      "panelScore": 53.46,
      "dashboardPenalty": 0,
      "confidence": 58.26,
      "mortalityContribution": 67.7,
      "coverageContribution": 65.1,
      "overall": 59.73
    }
  },
  {
    "id": "ii-029",
    "input": {
      "dtp3Coverage": 0.87,
      "measlesCoverage": 0.87,
      "underFiveMortality": 0.18,
      "panelYears": 0.82,
      "equityGap": 0.18,
      "antigenBreadth": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "impactBias": "balanced",
      "profile": "immunization_linked_mortality"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 98.95,
      "mortalityLinkScore": 92.32,
      "equityScore": 90.34,
      "panelScore": 78.68,
      "dashboardPenalty": 14.02,
      "confidence": 61.65,
      "mortalityContribution": 92.6,
      "coverageContribution": 77.11,
      "overall": 93.81
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 73.53,
      "mortalityLinkScore": 57.49,
      "equityScore": 52.03,
      "panelScore": 46.48,
      "dashboardPenalty": 0,
      "confidence": 61.04,
      "mortalityContribution": 65.91,
      "coverageContribution": 63.63,
      "overall": 58.13
    }
  },
  {
    "id": "ii-030",
    "input": {
      "dtp3Coverage": 0.91,
      "measlesCoverage": 0.91,
      "underFiveMortality": 0.13,
      "panelYears": 0.86,
      "equityGap": 0.13,
      "antigenBreadth": 0.91,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "impactBias": "mortality_first",
      "profile": "coverage_only_dashboard"
    },
    "expectedLinked": {
      "mode": "immunization_linked_mortality",
      "coverageScore": 100,
      "mortalityLinkScore": 100,
      "equityScore": 55.56,
      "panelScore": 82.99,
      "dashboardPenalty": 11.79,
      "confidence": 65.65,
      "mortalityContribution": 88.1,
      "coverageContribution": 71.08,
      "overall": 89.04
    },
    "expectedCoverageOnly": {
      "mode": "coverage_only_dashboard",
      "coverageScore": 64.38,
      "mortalityLinkScore": 44.82,
      "equityScore": 54.01,
      "panelScore": 35.64,
      "dashboardPenalty": 0,
      "confidence": 65.15,
      "mortalityContribution": 59.77,
      "coverageContribution": 53.56,
      "overall": 48.93
    }
  }
];
