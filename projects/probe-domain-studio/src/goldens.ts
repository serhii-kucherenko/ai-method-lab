import type { ProbeInput, ProbeQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ProbeInput;
  expectedCooperative: ProbeQuality;
  expectedMeltingBaseline: ProbeQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pd-001",
    "input": {
      "cooperativity": 0.29,
      "domainCoverage": 0.25,
      "bridgeCompleteness": 0.28,
      "specificityDelta": 0.34,
      "meltingSharpness": 0.39,
      "physioNoise": 0.59,
      "incompleteRisk": 0.45,
      "overclaimRisk": 0.5,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 23.4,
      "coverageScore": 30.25,
      "bridgeScore": 22.93,
      "specificityScore": 37.64,
      "meltingScore": 16.4,
      "confidence": 17.95,
      "cooperativeContribution": 28.18,
      "meltingContribution": 15.96,
      "overall": 29.98
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 5.76,
      "coverageScore": 17.41,
      "bridgeScore": 12.83,
      "specificityScore": 32.39,
      "meltingScore": 40.93,
      "confidence": 17.1,
      "cooperativeContribution": 21.86,
      "meltingContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "pd-002",
    "input": {
      "cooperativity": 0.33,
      "domainCoverage": 0.29,
      "bridgeCompleteness": 0.32,
      "specificityDelta": 0.38,
      "meltingSharpness": 0.43,
      "physioNoise": 0.6,
      "incompleteRisk": 0.46,
      "overclaimRisk": 0.51,
      "probeBias": "specificity_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 29.5,
      "coverageScore": 33.9,
      "bridgeScore": 17.2,
      "specificityScore": 48.93,
      "meltingScore": 18.89,
      "confidence": 21.2,
      "cooperativeContribution": 31.47,
      "meltingContribution": 18.61,
      "overall": 33.16
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 2.43,
      "coverageScore": 18.54,
      "bridgeScore": 13.86,
      "specificityScore": 34.08,
      "meltingScore": 31.53,
      "confidence": 18.65,
      "cooperativeContribution": 20.09,
      "meltingContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "pd-003",
    "input": {
      "cooperativity": 0.37,
      "domainCoverage": 0.27,
      "bridgeCompleteness": 0.36,
      "specificityDelta": 0.42,
      "meltingSharpness": 0.46,
      "physioNoise": 0.6,
      "incompleteRisk": 0.42,
      "overclaimRisk": 0.46,
      "probeBias": "melting_first",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 8.24,
      "coverageScore": 23.71,
      "bridgeScore": 19.55,
      "specificityScore": 19.24,
      "meltingScore": 19.94,
      "confidence": 23.4,
      "cooperativeContribution": 17.85,
      "meltingContribution": 19.69,
      "overall": 19.18
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 12.17,
      "coverageScore": 17.9,
      "bridgeScore": 12.83,
      "specificityScore": 33.93,
      "meltingScore": 54.34,
      "confidence": 18.4,
      "cooperativeContribution": 26.23,
      "meltingContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "pd-004",
    "input": {
      "cooperativity": 0.33,
      "domainCoverage": 0.32,
      "bridgeCompleteness": 0.39,
      "specificityDelta": 0.38,
      "meltingSharpness": 0.42,
      "physioNoise": 0.53,
      "incompleteRisk": 0.43,
      "overclaimRisk": 0.46,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 30.05,
      "coverageScore": 36.03,
      "bridgeScore": 32.93,
      "specificityScore": 42.23,
      "meltingScore": 18.93,
      "confidence": 22.55,
      "cooperativeContribution": 35.09,
      "meltingContribution": 19.05,
      "overall": 36.2
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 8.7,
      "coverageScore": 17.89,
      "bridgeScore": 13.8,
      "specificityScore": 32.79,
      "meltingScore": 42.77,
      "confidence": 18.85,
      "cooperativeContribution": 23.19,
      "meltingContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "pd-005",
    "input": {
      "cooperativity": 0.37,
      "domainCoverage": 0.36,
      "bridgeCompleteness": 0.35,
      "specificityDelta": 0.42,
      "meltingSharpness": 0.46,
      "physioNoise": 0.53,
      "incompleteRisk": 0.45,
      "overclaimRisk": 0.47,
      "probeBias": "cooperative",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 34.52,
      "coverageScore": 39.64,
      "bridgeScore": 39.44,
      "specificityScore": 35.49,
      "meltingScore": 21.8,
      "confidence": 25.65,
      "cooperativeContribution": 37.44,
      "meltingContribution": 22.19,
      "overall": 38.7
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 0,
      "coverageScore": 19.59,
      "bridgeScore": 15.41,
      "specificityScore": 34.77,
      "meltingScore": 32.95,
      "confidence": 21.05,
      "cooperativeContribution": 20.54,
      "meltingContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "pd-006",
    "input": {
      "cooperativity": 0.41,
      "domainCoverage": 0.34,
      "bridgeCompleteness": 0.39,
      "specificityDelta": 0.45,
      "meltingSharpness": 0.5,
      "physioNoise": 0.54,
      "incompleteRisk": 0.4,
      "overclaimRisk": 0.42,
      "probeBias": "balanced",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 35.34,
      "coverageScore": 39.5,
      "bridgeScore": 34.86,
      "specificityScore": 47.85,
      "meltingScore": 23.08,
      "confidence": 27.75,
      "cooperativeContribution": 39.04,
      "meltingContribution": 23.38,
      "overall": 40.22
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 11.98,
      "coverageScore": 18.6,
      "bridgeScore": 14.01,
      "specificityScore": 34.78,
      "meltingScore": 46.72,
      "confidence": 20.5,
      "cooperativeContribution": 25.22,
      "meltingContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "pd-007",
    "input": {
      "cooperativity": 0.45,
      "domainCoverage": 0.38,
      "bridgeCompleteness": 0.42,
      "specificityDelta": 0.49,
      "meltingSharpness": 0.53,
      "physioNoise": 0.55,
      "incompleteRisk": 0.42,
      "overclaimRisk": 0.43,
      "probeBias": "specificity_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 42.46,
      "coverageScore": 43.11,
      "bridgeScore": 25.56,
      "specificityScore": 61.29,
      "meltingScore": 25.15,
      "confidence": 30.85,
      "cooperativeContribution": 42.04,
      "meltingContribution": 25.64,
      "overall": 43.09
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 8.27,
      "coverageScore": 19.9,
      "bridgeScore": 15.24,
      "specificityScore": 36.3,
      "meltingScore": 34.2,
      "confidence": 22.15,
      "cooperativeContribution": 22.78,
      "meltingContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "pd-008",
    "input": {
      "cooperativity": 0.41,
      "domainCoverage": 0.43,
      "bridgeCompleteness": 0.46,
      "specificityDelta": 0.45,
      "meltingSharpness": 0.49,
      "physioNoise": 0.47,
      "incompleteRisk": 0.43,
      "overclaimRisk": 0.44,
      "probeBias": "melting_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 12.4,
      "coverageScore": 35.43,
      "bridgeScore": 27.9,
      "specificityScore": 24.76,
      "meltingScore": 24.32,
      "confidence": 30,
      "cooperativeContribution": 25.45,
      "meltingContribution": 25.23,
      "overall": 26.41
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 16.4,
      "coverageScore": 20.02,
      "bridgeScore": 16.36,
      "specificityScore": 35.17,
      "meltingScore": 58.5,
      "confidence": 22.7,
      "cooperativeContribution": 29.29,
      "meltingContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "pd-009",
    "input": {
      "cooperativity": 0.46,
      "domainCoverage": 0.41,
      "bridgeCompleteness": 0.5,
      "specificityDelta": 0.49,
      "meltingSharpness": 0.53,
      "physioNoise": 0.48,
      "incompleteRisk": 0.39,
      "overclaimRisk": 0.38,
      "probeBias": "balanced",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 42.57,
      "coverageScore": 45.49,
      "bridgeScore": 44.98,
      "specificityScore": 52.59,
      "meltingScore": 25.81,
      "confidence": 32.5,
      "cooperativeContribution": 46.21,
      "meltingContribution": 26.69,
      "overall": 46.7
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 14.91,
      "coverageScore": 19.47,
      "bridgeScore": 15.34,
      "specificityScore": 35.36,
      "meltingScore": 48.88,
      "confidence": 22.7,
      "cooperativeContribution": 26.79,
      "meltingContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "pd-010",
    "input": {
      "cooperativity": 0.5,
      "domainCoverage": 0.45,
      "bridgeCompleteness": 0.46,
      "specificityDelta": 0.53,
      "meltingSharpness": 0.57,
      "physioNoise": 0.49,
      "incompleteRisk": 0.4,
      "overclaimRisk": 0.39,
      "probeBias": "cooperative",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 48.31,
      "coverageScore": 49.14,
      "bridgeScore": 53.86,
      "specificityScore": 43.07,
      "meltingScore": 28.29,
      "confidence": 35.75,
      "cooperativeContribution": 48.93,
      "meltingContribution": 29.32,
      "overall": 49.4
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 3.59,
      "coverageScore": 20.58,
      "bridgeScore": 16.35,
      "specificityScore": 37.06,
      "meltingScore": 35.54,
      "confidence": 24.25,
      "cooperativeContribution": 22.62,
      "meltingContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "pd-011",
    "input": {
      "cooperativity": 0.54,
      "domainCoverage": 0.49,
      "bridgeCompleteness": 0.49,
      "specificityDelta": 0.57,
      "meltingSharpness": 0.6,
      "physioNoise": 0.49,
      "incompleteRisk": 0.42,
      "overclaimRisk": 0.4,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 47.21,
      "coverageScore": 52.75,
      "bridgeScore": 46.49,
      "specificityScore": 60.27,
      "meltingScore": 30.54,
      "confidence": 38.85,
      "cooperativeContribution": 51.32,
      "meltingContribution": 31.82,
      "overall": 51.81
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 17.1,
      "coverageScore": 22.02,
      "bridgeScore": 17.74,
      "specificityScore": 38.58,
      "meltingScore": 54.12,
      "confidence": 26.1,
      "cooperativeContribution": 29.91,
      "meltingContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "pd-012",
    "input": {
      "cooperativity": 0.5,
      "domainCoverage": 0.48,
      "bridgeCompleteness": 0.53,
      "specificityDelta": 0.53,
      "meltingSharpness": 0.56,
      "physioNoise": 0.42,
      "incompleteRisk": 0.37,
      "overclaimRisk": 0.35,
      "probeBias": "specificity_first",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 51.61,
      "coverageScore": 51.28,
      "bridgeScore": 34.12,
      "specificityScore": 67.57,
      "meltingScore": 28.34,
      "confidence": 37.1,
      "cooperativeContribution": 50.14,
      "meltingContribution": 29.7,
      "overall": 50.46
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 13.23,
      "coverageScore": 19.84,
      "bridgeScore": 16.17,
      "specificityScore": 35.76,
      "meltingScore": 34.93,
      "confidence": 24.35,
      "cooperativeContribution": 23.99,
      "meltingContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "pd-013",
    "input": {
      "cooperativity": 0.54,
      "domainCoverage": 0.52,
      "bridgeCompleteness": 0.56,
      "specificityDelta": 0.57,
      "meltingSharpness": 0.6,
      "physioNoise": 0.42,
      "incompleteRisk": 0.39,
      "overclaimRisk": 0.36,
      "probeBias": "melting_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 19.7,
      "coverageScore": 44.88,
      "bridgeScore": 36.31,
      "specificityScore": 32.66,
      "meltingScore": 31.2,
      "confidence": 40.2,
      "cooperativeContribution": 33.75,
      "meltingContribution": 32.8,
      "overall": 34.58
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 22.62,
      "coverageScore": 21.51,
      "bridgeScore": 17.75,
      "specificityScore": 37.74,
      "meltingScore": 67.02,
      "confidence": 26.55,
      "cooperativeContribution": 33.33,
      "meltingContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "pd-014",
    "input": {
      "cooperativity": 0.58,
      "domainCoverage": 0.56,
      "bridgeCompleteness": 0.6,
      "specificityDelta": 0.61,
      "meltingSharpness": 0.63,
      "physioNoise": 0.43,
      "incompleteRisk": 0.4,
      "overclaimRisk": 0.36,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 53.74,
      "coverageScore": 58.53,
      "bridgeScore": 56.38,
      "specificityScore": 64.86,
      "meltingScore": 33.07,
      "confidence": 43.45,
      "cooperativeContribution": 58.17,
      "meltingContribution": 34.8,
      "overall": 57.96
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 20.03,
      "coverageScore": 22.36,
      "bridgeScore": 18.54,
      "specificityScore": 38.98,
      "meltingScore": 55.96,
      "confidence": 27.85,
      "cooperativeContribution": 31.17,
      "meltingContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "pd-015",
    "input": {
      "cooperativity": 0.62,
      "domainCoverage": 0.54,
      "bridgeCompleteness": 0.56,
      "specificityDelta": 0.65,
      "meltingSharpness": 0.67,
      "physioNoise": 0.44,
      "incompleteRisk": 0.36,
      "overclaimRisk": 0.31,
      "probeBias": "cooperative",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 61.12,
      "coverageScore": 58.35,
      "bridgeScore": 67.29,
      "specificityScore": 50.82,
      "meltingScore": 34.55,
      "confidence": 45.65,
      "cooperativeContribution": 59.86,
      "meltingContribution": 36.22,
      "overall": 59.6
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 9.43,
      "coverageScore": 21.78,
      "bridgeScore": 17.48,
      "specificityScore": 39.27,
      "meltingScore": 38.2,
      "confidence": 27.75,
      "cooperativeContribution": 25.23,
      "meltingContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "pd-016",
    "input": {
      "cooperativity": 0.58,
      "domainCoverage": 0.59,
      "bridgeCompleteness": 0.6,
      "specificityDelta": 0.6,
      "meltingSharpness": 0.63,
      "physioNoise": 0.36,
      "incompleteRisk": 0.37,
      "overclaimRisk": 0.32,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 54.74,
      "coverageScore": 60.67,
      "bridgeScore": 58.01,
      "specificityScore": 65.05,
      "meltingScore": 33.73,
      "confidence": 44.55,
      "cooperativeContribution": 59.47,
      "meltingContribution": 35.76,
      "overall": 59.2
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 22.05,
      "coverageScore": 21.83,
      "bridgeScore": 18.56,
      "specificityScore": 38.14,
      "meltingScore": 55.7,
      "confidence": 28.3,
      "cooperativeContribution": 31.26,
      "meltingContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "pd-017",
    "input": {
      "cooperativity": 0.62,
      "domainCoverage": 0.63,
      "bridgeCompleteness": 0.63,
      "specificityDelta": 0.64,
      "meltingSharpness": 0.67,
      "physioNoise": 0.37,
      "incompleteRisk": 0.39,
      "overclaimRisk": 0.33,
      "probeBias": "specificity_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 64.02,
      "coverageScore": 64.28,
      "bridgeScore": 42.54,
      "specificityScore": 81.43,
      "meltingScore": 36.41,
      "confidence": 47.65,
      "cooperativeContribution": 61.9,
      "meltingContribution": 38.61,
      "overall": 61.71
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 18.73,
      "coverageScore": 23.34,
      "bridgeScore": 19.95,
      "specificityScore": 40.11,
      "meltingScore": 39.86,
      "confidence": 30.3,
      "cooperativeContribution": 28.4,
      "meltingContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "pd-018",
    "input": {
      "cooperativity": 0.66,
      "domainCoverage": 0.61,
      "bridgeCompleteness": 0.67,
      "specificityDelta": 0.68,
      "meltingSharpness": 0.7,
      "physioNoise": 0.38,
      "incompleteRisk": 0.34,
      "overclaimRisk": 0.27,
      "probeBias": "melting_first",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 26.76,
      "coverageScore": 54.13,
      "bridgeScore": 44.82,
      "specificityScore": 40.09,
      "meltingScore": 37.08,
      "confidence": 50,
      "cooperativeContribution": 41.87,
      "meltingContribution": 39.16,
      "overall": 42.38
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 28.36,
      "coverageScore": 22.06,
      "bridgeScore": 18.26,
      "specificityScore": 39.67,
      "meltingScore": 74.27,
      "confidence": 29.5,
      "cooperativeContribution": 36.52,
      "meltingContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "pd-019",
    "input": {
      "cooperativity": 0.7,
      "domainCoverage": 0.65,
      "bridgeCompleteness": 0.7,
      "specificityDelta": 0.72,
      "meltingSharpness": 0.74,
      "physioNoise": 0.38,
      "incompleteRisk": 0.36,
      "overclaimRisk": 0.28,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 65.21,
      "coverageScore": 67.74,
      "bridgeScore": 67.47,
      "specificityScore": 75.07,
      "meltingScore": 39.94,
      "confidence": 53.1,
      "cooperativeContribution": 68.67,
      "meltingContribution": 42.25,
      "overall": 67.91
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 26.25,
      "coverageScore": 23.72,
      "bridgeScore": 19.82,
      "specificityScore": 41.65,
      "meltingScore": 62.07,
      "confidence": 31.7,
      "cooperativeContribution": 34.7,
      "meltingContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "pd-020",
    "input": {
      "cooperativity": 0.66,
      "domainCoverage": 0.7,
      "bridgeCompleteness": 0.66,
      "specificityDelta": 0.68,
      "meltingSharpness": 0.7,
      "physioNoise": 0.31,
      "incompleteRisk": 0.37,
      "overclaimRisk": 0.29,
      "probeBias": "cooperative",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 68.73,
      "coverageScore": 70.06,
      "bridgeScore": 80.6,
      "specificityScore": 56.34,
      "meltingScore": 38.94,
      "confidence": 52.25,
      "cooperativeContribution": 69.67,
      "meltingContribution": 41.54,
      "overall": 68.61
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 13.66,
      "coverageScore": 23.61,
      "bridgeScore": 20.65,
      "specificityScore": 40.51,
      "meltingScore": 40.86,
      "confidence": 32.05,
      "cooperativeContribution": 27.86,
      "meltingContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "pd-021",
    "input": {
      "cooperativity": 0.7,
      "domainCoverage": 0.68,
      "bridgeCompleteness": 0.7,
      "specificityDelta": 0.72,
      "meltingSharpness": 0.73,
      "physioNoise": 0.31,
      "incompleteRisk": 0.33,
      "overclaimRisk": 0.24,
      "probeBias": "balanced",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 66.16,
      "coverageScore": 69.88,
      "bridgeScore": 69.04,
      "specificityScore": 75.82,
      "meltingScore": 39.99,
      "confidence": 54.45,
      "cooperativeContribution": 70.06,
      "meltingContribution": 42.54,
      "overall": 69.11
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 27.89,
      "coverageScore": 22.88,
      "bridgeScore": 19.52,
      "specificityScore": 40.35,
      "meltingScore": 61.19,
      "confidence": 31.8,
      "cooperativeContribution": 34.37,
      "meltingContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "pd-022",
    "input": {
      "cooperativity": 0.74,
      "domainCoverage": 0.72,
      "bridgeCompleteness": 0.73,
      "specificityDelta": 0.76,
      "meltingSharpness": 0.77,
      "physioNoise": 0.32,
      "incompleteRisk": 0.34,
      "overclaimRisk": 0.25,
      "probeBias": "specificity_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 76.7,
      "coverageScore": 73.52,
      "bridgeScore": 50.64,
      "specificityScore": 94.56,
      "meltingScore": 42.47,
      "confidence": 57.7,
      "cooperativeContribution": 72.51,
      "meltingContribution": 45.15,
      "overall": 71.59
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 24.57,
      "coverageScore": 23.95,
      "bridgeScore": 20.48,
      "specificityScore": 42.05,
      "meltingScore": 42.21,
      "confidence": 33.35,
      "cooperativeContribution": 30.65,
      "meltingContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "pd-023",
    "input": {
      "cooperativity": 0.79,
      "domainCoverage": 0.76,
      "bridgeCompleteness": 0.77,
      "specificityDelta": 0.8,
      "meltingSharpness": 0.81,
      "physioNoise": 0.33,
      "incompleteRisk": 0.36,
      "overclaimRisk": 0.25,
      "probeBias": "melting_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 33.62,
      "coverageScore": 67.38,
      "bridgeScore": 53.32,
      "specificityScore": 49.49,
      "meltingScore": 45.16,
      "confidence": 61.1,
      "cooperativeContribution": 51.41,
      "meltingContribution": 48.03,
      "overall": 51.8
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 33.86,
      "coverageScore": 25.49,
      "bridgeScore": 21.9,
      "specificityScore": 43.92,
      "meltingScore": 84.72,
      "confidence": 35.45,
      "cooperativeContribution": 41.98,
      "meltingContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "pd-024",
    "input": {
      "cooperativity": 0.75,
      "domainCoverage": 0.75,
      "bridgeCompleteness": 0.81,
      "specificityDelta": 0.76,
      "meltingSharpness": 0.77,
      "physioNoise": 0.25,
      "incompleteRisk": 0.31,
      "overclaimRisk": 0.2,
      "probeBias": "balanced",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 73.23,
      "coverageScore": 75.91,
      "bridgeScore": 78.99,
      "specificityScore": 80.56,
      "meltingScore": 43.13,
      "confidence": 59.35,
      "cooperativeContribution": 77.15,
      "meltingContribution": 46.07,
      "overall": 75.56
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 31.21,
      "coverageScore": 23.36,
      "bridgeScore": 20.38,
      "specificityScore": 41.11,
      "meltingScore": 63.65,
      "confidence": 33.9,
      "cooperativeContribution": 35.94,
      "meltingContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "pd-025",
    "input": {
      "cooperativity": 0.79,
      "domainCoverage": 0.79,
      "bridgeCompleteness": 0.77,
      "specificityDelta": 0.8,
      "meltingSharpness": 0.8,
      "physioNoise": 0.26,
      "incompleteRisk": 0.33,
      "overclaimRisk": 0.21,
      "probeBias": "cooperative",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 82.38,
      "coverageScore": 79.52,
      "bridgeScore": 94.88,
      "specificityScore": 64.24,
      "meltingScore": 45.2,
      "confidence": 62.45,
      "cooperativeContribution": 81.15,
      "meltingContribution": 48.27,
      "overall": 79.23
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 19.5,
      "coverageScore": 24.6,
      "bridgeScore": 21.54,
      "specificityScore": 42.63,
      "meltingScore": 43.52,
      "confidence": 35.55,
      "cooperativeContribution": 30.36,
      "meltingContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "pd-026",
    "input": {
      "cooperativity": 0.83,
      "domainCoverage": 0.83,
      "bridgeCompleteness": 0.8,
      "specificityDelta": 0.83,
      "meltingSharpness": 0.84,
      "physioNoise": 0.27,
      "incompleteRisk": 0.34,
      "overclaimRisk": 0.22,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 77.68,
      "coverageScore": 83.17,
      "bridgeScore": 80.3,
      "specificityScore": 87.68,
      "meltingScore": 47.68,
      "confidence": 65.45,
      "cooperativeContribution": 82.04,
      "meltingContribution": 50.87,
      "overall": 80.43
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 33.17,
      "coverageScore": 25.67,
      "bridgeScore": 22.55,
      "specificityScore": 44.32,
      "meltingScore": 68.8,
      "confidence": 37.1,
      "cooperativeContribution": 38.9,
      "meltingContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "pd-027",
    "input": {
      "cooperativity": 0.87,
      "domainCoverage": 0.81,
      "bridgeCompleteness": 0.84,
      "specificityDelta": 0.87,
      "meltingSharpness": 0.88,
      "physioNoise": 0.27,
      "incompleteRisk": 0.3,
      "overclaimRisk": 0.17,
      "probeBias": "specificity_first",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 90.34,
      "coverageScore": 82.98,
      "bridgeScore": 59.19,
      "specificityScore": 100,
      "meltingScore": 49.35,
      "confidence": 67.65,
      "cooperativeContribution": 81.83,
      "meltingContribution": 52.5,
      "overall": 80.55
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 30.78,
      "coverageScore": 25.18,
      "bridgeScore": 21.6,
      "specificityScore": 44.62,
      "meltingScore": 45.22,
      "confidence": 37.2,
      "cooperativeContribution": 33.48,
      "meltingContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "pd-028",
    "input": {
      "cooperativity": 0.83,
      "domainCoverage": 0.86,
      "bridgeCompleteness": 0.87,
      "specificityDelta": 0.83,
      "meltingSharpness": 0.84,
      "physioNoise": 0.2,
      "incompleteRisk": 0.31,
      "overclaimRisk": 0.17,
      "probeBias": "melting_first",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 37.92,
      "coverageScore": 75.3,
      "bridgeScore": 61.04,
      "specificityScore": 53.51,
      "meltingScore": 48.34,
      "confidence": 66.8,
      "cooperativeContribution": 57.54,
      "meltingContribution": 51.73,
      "overall": 57.49
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 38.81,
      "coverageScore": 25.01,
      "bridgeScore": 22.37,
      "specificityScore": 43.48,
      "meltingScore": 86.95,
      "confidence": 37.65,
      "cooperativeContribution": 43.32,
      "meltingContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "pd-029",
    "input": {
      "cooperativity": 0.87,
      "domainCoverage": 0.9,
      "bridgeCompleteness": 0.91,
      "specificityDelta": 0.87,
      "meltingSharpness": 0.87,
      "physioNoise": 0.2,
      "incompleteRisk": 0.33,
      "overclaimRisk": 0.18,
      "probeBias": "balanced",
      "profile": "cooperative_multi_domain_probe"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 84.17,
      "coverageScore": 88.91,
      "bridgeScore": 90.14,
      "specificityScore": 92.27,
      "meltingScore": 50.59,
      "confidence": 69.9,
      "cooperativeContribution": 88.86,
      "meltingContribution": 54.16,
      "overall": 86.61
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 36.33,
      "coverageScore": 26.36,
      "bridgeScore": 23.66,
      "specificityScore": 45,
      "meltingScore": 71.06,
      "confidence": 39.5,
      "cooperativeContribution": 40.48,
      "meltingContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "pd-030",
    "input": {
      "cooperativity": 0.91,
      "domainCoverage": 0.88,
      "bridgeCompleteness": 0.87,
      "specificityDelta": 0.91,
      "meltingSharpness": 0.91,
      "physioNoise": 0.21,
      "incompleteRisk": 0.28,
      "overclaimRisk": 0.13,
      "probeBias": "cooperative",
      "profile": "single_domain_melting_baseline"
    },
    "expectedCooperative": {
      "mode": "cooperative_multi_domain_probe",
      "cooperativityScore": 94.93,
      "coverageScore": 88.77,
      "bridgeScore": 100,
      "specificityScore": 71.68,
      "meltingScore": 51.88,
      "confidence": 72.25,
      "cooperativeContribution": 89.63,
      "meltingContribution": 55.31,
      "overall": 87.45
    },
    "expectedMeltingBaseline": {
      "mode": "single_domain_melting_baseline",
      "cooperativityScore": 25.72,
      "coverageScore": 25.3,
      "bridgeScore": 22.14,
      "specificityScore": 45.02,
      "meltingScore": 46.21,
      "confidence": 38.95,
      "cooperativeContribution": 32.88,
      "meltingContribution": 50.68,
      "overall": 44.3
    }
  }
];
