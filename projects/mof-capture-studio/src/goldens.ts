import type { MofCaptureInput, MofCaptureQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MofCaptureInput;
  expectedMof: MofCaptureQuality;
  expectedConventional: MofCaptureQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "mc-001",
    "input": {
      "ionExchangeFidelity": 0.34,
      "conventionalCapacity": 0.5,
      "assayFidelity": 0.34,
      "sorbentCompleteness": 0.34,
      "evidenceStrength": 0.34,
      "waterFollowThrough": 0.34,
      "assayReadout": 0.34,
      "overclaimRisk": 0.5,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 40.3,
      "conventionalScore": 33.95,
      "sorbentCoverage": 38.53,
      "waterEfficiency": 43.72,
      "conventionalOnlyPenalty": 32.93,
      "confidence": 14.82,
      "mofContribution": 45.38,
      "conventionalContribution": 35.98,
      "overall": 47.69
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.41,
      "conventionalScore": 39.66,
      "sorbentCoverage": 32.11,
      "waterEfficiency": 30.44,
      "conventionalOnlyPenalty": 20.37,
      "confidence": 18.17,
      "mofContribution": 41.85,
      "conventionalContribution": 29.33,
      "overall": 27.38
    }
  },
  {
    "id": "mc-002",
    "input": {
      "ionExchangeFidelity": 0.38,
      "conventionalCapacity": 0.51,
      "assayFidelity": 0.38,
      "sorbentCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "waterFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.51,
      "scoringBias": "assay_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 49.41,
      "conventionalScore": 30.04,
      "sorbentCoverage": 48.08,
      "waterEfficiency": 60.71,
      "conventionalOnlyPenalty": 31.83,
      "confidence": 17.54,
      "mofContribution": 54.9,
      "conventionalContribution": 40.85,
      "overall": 56.37
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.46,
      "conventionalScore": 48.65,
      "sorbentCoverage": 32.36,
      "waterEfficiency": 38.64,
      "conventionalOnlyPenalty": 18.8,
      "confidence": 20.2,
      "mofContribution": 45.26,
      "conventionalContribution": 33.28,
      "overall": 30.96
    }
  },
  {
    "id": "mc-003",
    "input": {
      "ionExchangeFidelity": 0.42,
      "conventionalCapacity": 0.46,
      "assayFidelity": 0.42,
      "sorbentCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "waterFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.46,
      "scoringBias": "sorbent_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 19.24,
      "conventionalScore": 37.37,
      "sorbentCoverage": 29.25,
      "waterEfficiency": 29.71,
      "conventionalOnlyPenalty": 54.68,
      "confidence": 21.46,
      "mofContribution": 29.04,
      "conventionalContribution": 28.7,
      "overall": 29.98
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.43,
      "conventionalScore": 45.98,
      "sorbentCoverage": 32.6,
      "waterEfficiency": 37.55,
      "conventionalOnlyPenalty": 16.76,
      "confidence": 21.76,
      "mofContribution": 45.16,
      "conventionalContribution": 32.84,
      "overall": 30.69
    }
  },
  {
    "id": "mc-004",
    "input": {
      "ionExchangeFidelity": 0.38,
      "conventionalCapacity": 0.46,
      "assayFidelity": 0.38,
      "sorbentCompleteness": 0.38,
      "evidenceStrength": 0.38,
      "waterFollowThrough": 0.38,
      "assayReadout": 0.38,
      "overclaimRisk": 0.46,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 45.25,
      "conventionalScore": 33.49,
      "sorbentCoverage": 42.12,
      "waterEfficiency": 47.84,
      "conventionalOnlyPenalty": 31.25,
      "confidence": 18.54,
      "mofContribution": 49.17,
      "conventionalContribution": 37.97,
      "overall": 51.15
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.97,
      "conventionalScore": 38.2,
      "sorbentCoverage": 32.36,
      "waterEfficiency": 30.33,
      "conventionalOnlyPenalty": 18.41,
      "confidence": 19.81,
      "mofContribution": 42.09,
      "conventionalContribution": 29.29,
      "overall": 27.45
    }
  },
  {
    "id": "mc-005",
    "input": {
      "ionExchangeFidelity": 0.42,
      "conventionalCapacity": 0.47,
      "assayFidelity": 0.42,
      "sorbentCompleteness": 0.42,
      "evidenceStrength": 0.42,
      "waterFollowThrough": 0.42,
      "assayReadout": 0.42,
      "overclaimRisk": 0.47,
      "scoringBias": "mof_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 54.9,
      "conventionalScore": 29.13,
      "sorbentCoverage": 37.25,
      "waterEfficiency": 29.47,
      "conventionalOnlyPenalty": 30.15,
      "confidence": 21.26,
      "mofContribution": 47.05,
      "conventionalContribution": 35.8,
      "overall": 49.02
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.02,
      "conventionalScore": 28.23,
      "sorbentCoverage": 32.6,
      "waterEfficiency": 23.79,
      "conventionalOnlyPenalty": 16.84,
      "confidence": 21.84,
      "mofContribution": 36.36,
      "conventionalContribution": 18.26,
      "overall": 17.32
    }
  },
  {
    "id": "mc-006",
    "input": {
      "ionExchangeFidelity": 0.45,
      "conventionalCapacity": 0.42,
      "assayFidelity": 0.45,
      "sorbentCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "waterFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.42,
      "scoringBias": "balanced",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 53.61,
      "conventionalScore": 33.18,
      "sorbentCoverage": 48.41,
      "waterEfficiency": 53.95,
      "conventionalOnlyPenalty": 28.66,
      "confidence": 24.45,
      "mofContribution": 55.42,
      "conventionalContribution": 41.33,
      "overall": 56.88
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.75,
      "conventionalScore": 36.7,
      "sorbentCoverage": 32.79,
      "waterEfficiency": 31.07,
      "conventionalOnlyPenalty": 15.22,
      "confidence": 22.92,
      "mofContribution": 42.62,
      "conventionalContribution": 29.11,
      "overall": 27.31
    }
  },
  {
    "id": "mc-007",
    "input": {
      "ionExchangeFidelity": 0.49,
      "conventionalCapacity": 0.43,
      "assayFidelity": 0.49,
      "sorbentCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "waterFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.43,
      "scoringBias": "assay_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 64.21,
      "conventionalScore": 28.03,
      "sorbentCoverage": 59.69,
      "waterEfficiency": 74.31,
      "conventionalOnlyPenalty": 27.56,
      "confidence": 27.17,
      "mofContribution": 66.65,
      "conventionalContribution": 46.96,
      "overall": 67.11
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.8,
      "conventionalScore": 44.33,
      "sorbentCoverage": 33.04,
      "waterEfficiency": 38.21,
      "conventionalOnlyPenalty": 13.65,
      "confidence": 24.95,
      "mofContribution": 45.55,
      "conventionalContribution": 32.38,
      "overall": 30.25
    }
  },
  {
    "id": "mc-008",
    "input": {
      "ionExchangeFidelity": 0.45,
      "conventionalCapacity": 0.44,
      "assayFidelity": 0.45,
      "sorbentCompleteness": 0.45,
      "evidenceStrength": 0.45,
      "waterFollowThrough": 0.45,
      "assayReadout": 0.45,
      "overclaimRisk": 0.44,
      "scoringBias": "sorbent_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 21.39,
      "conventionalScore": 37.45,
      "sorbentCoverage": 31.34,
      "waterEfficiency": 31.28,
      "conventionalOnlyPenalty": 53.53,
      "confidence": 24.05,
      "mofContribution": 30.87,
      "conventionalContribution": 29.5,
      "overall": 31.62
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.44,
      "conventionalScore": 44.9,
      "sorbentCoverage": 32.79,
      "waterEfficiency": 37.52,
      "conventionalOnlyPenalty": 15.37,
      "confidence": 23.07,
      "mofContribution": 45.26,
      "conventionalContribution": 32.61,
      "overall": 30.5
    }
  },
  {
    "id": "mc-009",
    "input": {
      "ionExchangeFidelity": 0.49,
      "conventionalCapacity": 0.38,
      "assayFidelity": 0.49,
      "sorbentCompleteness": 0.49,
      "evidenceStrength": 0.49,
      "waterFollowThrough": 0.49,
      "assayReadout": 0.49,
      "overclaimRisk": 0.38,
      "scoringBias": "balanced",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 58.55,
      "conventionalScore": 32.72,
      "sorbentCoverage": 52,
      "waterEfficiency": 58.08,
      "conventionalOnlyPenalty": 26.98,
      "confidence": 28.17,
      "mofContribution": 59.22,
      "conventionalContribution": 43.32,
      "overall": 60.36
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 28.31,
      "conventionalScore": 35.24,
      "sorbentCoverage": 33.04,
      "waterEfficiency": 30.96,
      "conventionalOnlyPenalty": 13.26,
      "confidence": 24.56,
      "mofContribution": 42.86,
      "conventionalContribution": 29.07,
      "overall": 27.37
    }
  },
  {
    "id": "mc-010",
    "input": {
      "ionExchangeFidelity": 0.53,
      "conventionalCapacity": 0.39,
      "assayFidelity": 0.53,
      "sorbentCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "waterFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.39,
      "scoringBias": "mof_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 69.71,
      "conventionalScore": 27.12,
      "sorbentCoverage": 44.91,
      "waterEfficiency": 35.39,
      "conventionalOnlyPenalty": 25.88,
      "confidence": 30.89,
      "mofContribution": 56.01,
      "conventionalContribution": 40.38,
      "overall": 57.2
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.36,
      "conventionalScore": 27.02,
      "sorbentCoverage": 33.29,
      "waterEfficiency": 25.78,
      "conventionalOnlyPenalty": 11.69,
      "confidence": 26.59,
      "mofContribution": 37.75,
      "conventionalContribution": 18.93,
      "overall": 18.08
    }
  },
  {
    "id": "mc-011",
    "input": {
      "ionExchangeFidelity": 0.57,
      "conventionalCapacity": 0.4,
      "assayFidelity": 0.57,
      "sorbentCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "waterFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.4,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 67.48,
      "conventionalScore": 33.45,
      "sorbentCoverage": 59.19,
      "waterEfficiency": 62.63,
      "conventionalOnlyPenalty": 24.79,
      "confidence": 33.61,
      "mofContribution": 65.48,
      "conventionalContribution": 46.91,
      "overall": 66.14
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.41,
      "conventionalScore": 35.87,
      "sorbentCoverage": 33.53,
      "waterEfficiency": 33.86,
      "conventionalOnlyPenalty": 10.12,
      "confidence": 28.62,
      "mofContribution": 43.71,
      "conventionalContribution": 28.66,
      "overall": 26.72
    }
  },
  {
    "id": "mc-012",
    "input": {
      "ionExchangeFidelity": 0.53,
      "conventionalCapacity": 0.35,
      "assayFidelity": 0.53,
      "sorbentCompleteness": 0.53,
      "evidenceStrength": 0.53,
      "waterFollowThrough": 0.53,
      "assayReadout": 0.53,
      "overclaimRisk": 0.35,
      "scoringBias": "assay_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 70.11,
      "conventionalScore": 26.46,
      "sorbentCoverage": 63.9,
      "waterEfficiency": 81.66,
      "conventionalOnlyPenalty": 25.42,
      "confidence": 31.69,
      "mofContribution": 71.72,
      "conventionalContribution": 49.49,
      "overall": 71.72
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.97,
      "conventionalScore": 40.08,
      "sorbentCoverage": 33.29,
      "waterEfficiency": 35.79,
      "conventionalOnlyPenalty": 11.37,
      "confidence": 26.27,
      "mofContribution": 45.15,
      "conventionalContribution": 31.78,
      "overall": 29.97
    }
  },
  {
    "id": "mc-013",
    "input": {
      "ionExchangeFidelity": 0.57,
      "conventionalCapacity": 0.36,
      "assayFidelity": 0.57,
      "sorbentCompleteness": 0.57,
      "evidenceStrength": 0.57,
      "waterFollowThrough": 0.57,
      "assayReadout": 0.57,
      "overclaimRisk": 0.36,
      "scoringBias": "sorbent_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 30.02,
      "conventionalScore": 37.78,
      "sorbentCoverage": 39.69,
      "waterEfficiency": 37.56,
      "conventionalOnlyPenalty": 48.96,
      "confidence": 34.41,
      "mofContribution": 38.17,
      "conventionalContribution": 32.72,
      "overall": 38.19
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.52,
      "conventionalScore": 40.57,
      "sorbentCoverage": 33.53,
      "waterEfficiency": 37.38,
      "conventionalOnlyPenalty": 9.8,
      "confidence": 28.3,
      "mofContribution": 45.64,
      "conventionalContribution": 31.66,
      "overall": 29.73
    }
  },
  {
    "id": "mc-014",
    "input": {
      "ionExchangeFidelity": 0.61,
      "conventionalCapacity": 0.36,
      "assayFidelity": 0.61,
      "sorbentCompleteness": 0.61,
      "evidenceStrength": 0.61,
      "waterFollowThrough": 0.61,
      "assayReadout": 0.61,
      "overclaimRisk": 0.36,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 72.42,
      "conventionalScore": 32.99,
      "sorbentCoverage": 62.78,
      "waterEfficiency": 66.75,
      "conventionalOnlyPenalty": 23.11,
      "confidence": 37.33,
      "mofContribution": 69.28,
      "conventionalContribution": 48.89,
      "overall": 69.61
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.97,
      "conventionalScore": 34.41,
      "sorbentCoverage": 33.78,
      "waterEfficiency": 33.75,
      "conventionalOnlyPenalty": 8.16,
      "confidence": 30.26,
      "mofContribution": 43.95,
      "conventionalContribution": 28.62,
      "overall": 26.78
    }
  },
  {
    "id": "mc-015",
    "input": {
      "ionExchangeFidelity": 0.65,
      "conventionalCapacity": 0.31,
      "assayFidelity": 0.65,
      "sorbentCompleteness": 0.65,
      "evidenceStrength": 0.65,
      "waterFollowThrough": 0.65,
      "assayReadout": 0.65,
      "overclaimRisk": 0.31,
      "scoringBias": "mof_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 85.78,
      "conventionalScore": 25.05,
      "sorbentCoverage": 53.27,
      "waterEfficiency": 41.67,
      "conventionalOnlyPenalty": 21.31,
      "confidence": 41.25,
      "mofContribution": 65.7,
      "conventionalContribution": 45.36,
      "overall": 66.04
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.44,
      "conventionalScore": 25.81,
      "sorbentCoverage": 34.03,
      "waterEfficiency": 28.05,
      "conventionalOnlyPenalty": 6.12,
      "confidence": 31.82,
      "mofContribution": 39.24,
      "conventionalContribution": 19.56,
      "overall": 18.78
    }
  },
  {
    "id": "mc-016",
    "input": {
      "ionExchangeFidelity": 0.6,
      "conventionalCapacity": 0.32,
      "assayFidelity": 0.6,
      "sorbentCompleteness": 0.6,
      "evidenceStrength": 0.6,
      "waterFollowThrough": 0.6,
      "assayReadout": 0.6,
      "overclaimRisk": 0.32,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 71.67,
      "conventionalScore": 32.28,
      "sorbentCoverage": 61.88,
      "waterEfficiency": 67.58,
      "conventionalOnlyPenalty": 22.94,
      "confidence": 37.4,
      "mofContribution": 69,
      "conventionalContribution": 48.59,
      "overall": 69.33
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.84,
      "conventionalScore": 32.99,
      "sorbentCoverage": 33.72,
      "waterEfficiency": 32.22,
      "conventionalOnlyPenalty": 8.26,
      "confidence": 29.46,
      "mofContribution": 43.7,
      "conventionalContribution": 28.79,
      "overall": 27.15
    }
  },
  {
    "id": "mc-017",
    "input": {
      "ionExchangeFidelity": 0.64,
      "conventionalCapacity": 0.33,
      "assayFidelity": 0.64,
      "sorbentCompleteness": 0.64,
      "evidenceStrength": 0.64,
      "waterFollowThrough": 0.64,
      "assayReadout": 0.64,
      "overclaimRisk": 0.33,
      "scoringBias": "assay_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 84.31,
      "conventionalScore": 25.45,
      "sorbentCoverage": 75.51,
      "waterEfficiency": 92.42,
      "conventionalOnlyPenalty": 21.85,
      "confidence": 40.12,
      "mofContribution": 82.52,
      "conventionalContribution": 55.25,
      "overall": 81.61
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.89,
      "conventionalScore": 38.92,
      "sorbentCoverage": 33.97,
      "waterEfficiency": 38.03,
      "conventionalOnlyPenalty": 6.69,
      "confidence": 31.49,
      "mofContribution": 46.02,
      "conventionalContribution": 31.2,
      "overall": 29.28
    }
  },
  {
    "id": "mc-018",
    "input": {
      "ionExchangeFidelity": 0.68,
      "conventionalCapacity": 0.27,
      "assayFidelity": 0.68,
      "sorbentCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "waterFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.27,
      "scoringBias": "sorbent_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 38.06,
      "conventionalScore": 37.81,
      "sorbentCoverage": 47.36,
      "waterEfficiency": 43.72,
      "conventionalOnlyPenalty": 44.58,
      "confidence": 44.24,
      "mofContribution": 45.03,
      "conventionalContribution": 35.68,
      "overall": 44.35
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.26,
      "conventionalScore": 35.72,
      "sorbentCoverage": 34.22,
      "waterEfficiency": 36.5,
      "conventionalOnlyPenalty": 4.57,
      "confidence": 32.97,
      "mofContribution": 45.83,
      "conventionalContribution": 30.7,
      "overall": 29.01
    }
  },
  {
    "id": "mc-019",
    "input": {
      "ionExchangeFidelity": 0.72,
      "conventionalCapacity": 0.28,
      "assayFidelity": 0.72,
      "sorbentCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "waterFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.28,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 85.73,
      "conventionalScore": 32.22,
      "sorbentCoverage": 72.66,
      "waterEfficiency": 76.99,
      "conventionalOnlyPenalty": 18.84,
      "confidence": 46.96,
      "mofContribution": 79.33,
      "conventionalContribution": 54.24,
      "overall": 78.81
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.31,
      "conventionalScore": 31.45,
      "sorbentCoverage": 34.46,
      "waterEfficiency": 34.38,
      "conventionalOnlyPenalty": 3,
      "confidence": 35,
      "mofContribution": 44.72,
      "conventionalContribution": 28.4,
      "overall": 26.71
    }
  },
  {
    "id": "mc-020",
    "input": {
      "ionExchangeFidelity": 0.68,
      "conventionalCapacity": 0.29,
      "assayFidelity": 0.68,
      "sorbentCompleteness": 0.68,
      "evidenceStrength": 0.68,
      "waterFollowThrough": 0.68,
      "assayReadout": 0.68,
      "overclaimRisk": 0.29,
      "scoringBias": "mof_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 89.8,
      "conventionalScore": 24.53,
      "sorbentCoverage": 55.36,
      "waterEfficiency": 43.24,
      "conventionalOnlyPenalty": 20.17,
      "confidence": 43.84,
      "mofContribution": 68.12,
      "conventionalContribution": 46.6,
      "overall": 68.25
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.45,
      "conventionalScore": 25.5,
      "sorbentCoverage": 34.22,
      "waterEfficiency": 28.62,
      "conventionalOnlyPenalty": 4.73,
      "confidence": 33.13,
      "mofContribution": 39.61,
      "conventionalContribution": 19.71,
      "overall": 18.95
    }
  },
  {
    "id": "mc-021",
    "input": {
      "ionExchangeFidelity": 0.72,
      "conventionalCapacity": 0.24,
      "assayFidelity": 0.72,
      "sorbentCompleteness": 0.72,
      "evidenceStrength": 0.72,
      "waterFollowThrough": 0.72,
      "assayReadout": 0.72,
      "overclaimRisk": 0.24,
      "scoringBias": "balanced",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 86.11,
      "conventionalScore": 31.56,
      "sorbentCoverage": 72.66,
      "waterEfficiency": 78.48,
      "conventionalOnlyPenalty": 18.37,
      "confidence": 47.76,
      "mofContribution": 79.86,
      "conventionalContribution": 54.4,
      "overall": 79.28
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.92,
      "conventionalScore": 30.02,
      "sorbentCoverage": 34.46,
      "waterEfficiency": 33.13,
      "conventionalOnlyPenalty": 2.69,
      "confidence": 34.69,
      "mofContribution": 44.57,
      "conventionalContribution": 28.53,
      "overall": 27.02
    }
  },
  {
    "id": "mc-022",
    "input": {
      "ionExchangeFidelity": 0.76,
      "conventionalCapacity": 0.25,
      "assayFidelity": 0.76,
      "sorbentCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "waterFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.25,
      "scoringBias": "assay_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 100,
      "conventionalScore": 23.38,
      "sorbentCoverage": 88.16,
      "waterEfficiency": 100,
      "conventionalOnlyPenalty": 17.28,
      "confidence": 50.48,
      "mofContribution": 93.57,
      "conventionalContribution": 60.35,
      "overall": 91.59
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.97,
      "conventionalScore": 34.59,
      "sorbentCoverage": 34.71,
      "waterEfficiency": 37.89,
      "conventionalOnlyPenalty": 1.12,
      "confidence": 36.72,
      "mofContribution": 46.41,
      "conventionalContribution": 30.25,
      "overall": 28.51
    }
  },
  {
    "id": "mc-023",
    "input": {
      "ionExchangeFidelity": 0.8,
      "conventionalCapacity": 0.25,
      "assayFidelity": 0.8,
      "sorbentCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "waterFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.25,
      "scoringBias": "sorbent_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 46.2,
      "conventionalScore": 39.13,
      "sorbentCoverage": 55.71,
      "waterEfficiency": 48.57,
      "conventionalOnlyPenalty": 40.71,
      "confidence": 53.4,
      "mofContribution": 51.74,
      "conventionalContribution": 38.85,
      "overall": 50.42
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 24.92,
      "conventionalScore": 34.55,
      "sorbentCoverage": 34.96,
      "waterEfficiency": 39.03,
      "conventionalOnlyPenalty": 0,
      "confidence": 38.67,
      "mofContribution": 46.69,
      "conventionalContribution": 30.08,
      "overall": 28.23
    }
  },
  {
    "id": "mc-024",
    "input": {
      "ionExchangeFidelity": 0.76,
      "conventionalCapacity": 0.2,
      "assayFidelity": 0.76,
      "sorbentCompleteness": 0.76,
      "evidenceStrength": 0.76,
      "waterFollowThrough": 0.76,
      "assayReadout": 0.76,
      "overclaimRisk": 0.2,
      "scoringBias": "balanced",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 91.06,
      "conventionalScore": 31.1,
      "sorbentCoverage": 76.25,
      "waterEfficiency": 82.6,
      "conventionalOnlyPenalty": 16.69,
      "confidence": 51.48,
      "mofContribution": 83.66,
      "conventionalContribution": 56.38,
      "overall": 82.75
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 28.48,
      "conventionalScore": 28.56,
      "sorbentCoverage": 34.71,
      "waterEfficiency": 33.02,
      "conventionalOnlyPenalty": 0.73,
      "confidence": 36.33,
      "mofContribution": 44.81,
      "conventionalContribution": 28.49,
      "overall": 27.08
    }
  },
  {
    "id": "mc-025",
    "input": {
      "ionExchangeFidelity": 0.8,
      "conventionalCapacity": 0.21,
      "assayFidelity": 0.8,
      "sorbentCompleteness": 0.8,
      "evidenceStrength": 0.8,
      "waterFollowThrough": 0.8,
      "assayReadout": 0.8,
      "overclaimRisk": 0.21,
      "scoringBias": "mof_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 100,
      "conventionalScore": 22.47,
      "sorbentCoverage": 63.71,
      "waterEfficiency": 49.53,
      "conventionalOnlyPenalty": 15.6,
      "confidence": 54.2,
      "mofContribution": 75.93,
      "conventionalContribution": 49.53,
      "overall": 75.18
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.53,
      "conventionalScore": 24.28,
      "sorbentCoverage": 34.96,
      "waterEfficiency": 30.9,
      "conventionalOnlyPenalty": 0,
      "confidence": 38.36,
      "mofContribution": 40.93,
      "conventionalContribution": 20.34,
      "overall": 19.61
    }
  },
  {
    "id": "mc-026",
    "input": {
      "ionExchangeFidelity": 0.83,
      "conventionalCapacity": 0.22,
      "assayFidelity": 0.83,
      "sorbentCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "waterFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.22,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 98.84,
      "conventionalScore": 31.78,
      "sorbentCoverage": 82.53,
      "waterEfficiency": 86.49,
      "conventionalOnlyPenalty": 14.81,
      "confidence": 56.19,
      "mofContribution": 89.1,
      "conventionalContribution": 59.52,
      "overall": 87.78
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 25.84,
      "conventionalScore": 29.2,
      "sorbentCoverage": 35.15,
      "waterEfficiency": 35.64,
      "conventionalOnlyPenalty": 0,
      "confidence": 39.9,
      "mofContribution": 45.17,
      "conventionalContribution": 28.12,
      "overall": 26.4
    }
  },
  {
    "id": "mc-027",
    "input": {
      "ionExchangeFidelity": 0.87,
      "conventionalCapacity": 0.17,
      "assayFidelity": 0.87,
      "sorbentCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "waterFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.17,
      "scoringBias": "assay_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 100,
      "conventionalScore": 21.37,
      "sorbentCoverage": 99.77,
      "waterEfficiency": 100,
      "conventionalOnlyPenalty": 13.01,
      "confidence": 60.11,
      "mofContribution": 97.59,
      "conventionalContribution": 58.56,
      "overall": 94.56
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.31,
      "conventionalScore": 30.27,
      "sorbentCoverage": 35.39,
      "waterEfficiency": 37.47,
      "conventionalOnlyPenalty": 0,
      "confidence": 41.46,
      "mofContribution": 45.89,
      "conventionalContribution": 29.35,
      "overall": 27.62
    }
  },
  {
    "id": "mc-028",
    "input": {
      "ionExchangeFidelity": 0.83,
      "conventionalCapacity": 0.17,
      "assayFidelity": 0.83,
      "sorbentCompleteness": 0.83,
      "evidenceStrength": 0.83,
      "waterFollowThrough": 0.83,
      "assayReadout": 0.83,
      "overclaimRisk": 0.17,
      "scoringBias": "sorbent_first",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 48.85,
      "conventionalScore": 38.22,
      "sorbentCoverage": 57.8,
      "waterEfficiency": 51.58,
      "conventionalOnlyPenalty": 38.86,
      "confidence": 57.19,
      "mofContribution": 54.17,
      "conventionalContribution": 39.7,
      "overall": 52.57
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 27.35,
      "conventionalScore": 30.31,
      "sorbentCoverage": 35.15,
      "waterEfficiency": 36.33,
      "conventionalOnlyPenalty": 0,
      "confidence": 39.51,
      "mofContribution": 45.83,
      "conventionalContribution": 29.52,
      "overall": 27.94
    }
  },
  {
    "id": "mc-029",
    "input": {
      "ionExchangeFidelity": 0.87,
      "conventionalCapacity": 0.18,
      "assayFidelity": 0.87,
      "sorbentCompleteness": 0.87,
      "evidenceStrength": 0.87,
      "waterFollowThrough": 0.87,
      "assayReadout": 0.87,
      "overclaimRisk": 0.18,
      "scoringBias": "balanced",
      "profile": "anionic_mof_capture"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 100,
      "conventionalScore": 31.32,
      "sorbentCoverage": 86.13,
      "waterEfficiency": 90.62,
      "conventionalOnlyPenalty": 13.13,
      "confidence": 59.91,
      "mofContribution": 91.69,
      "conventionalContribution": 60.18,
      "overall": 90.02
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 26.4,
      "conventionalScore": 27.74,
      "sorbentCoverage": 35.39,
      "waterEfficiency": 35.53,
      "conventionalOnlyPenalty": 0,
      "confidence": 41.54,
      "mofContribution": 45.01,
      "conventionalContribution": 28.08,
      "overall": 26.37
    }
  },
  {
    "id": "mc-030",
    "input": {
      "ionExchangeFidelity": 0.91,
      "conventionalCapacity": 0.13,
      "assayFidelity": 0.91,
      "sorbentCompleteness": 0.91,
      "evidenceStrength": 0.91,
      "waterFollowThrough": 0.91,
      "assayReadout": 0.91,
      "overclaimRisk": 0.13,
      "scoringBias": "mof_first",
      "profile": "conventional_sorbent"
    },
    "expectedMof": {
      "mode": "anionic_mof_capture",
      "mofCaptureScore": 100,
      "conventionalScore": 20.46,
      "sorbentCoverage": 71.37,
      "waterEfficiency": 55.45,
      "conventionalOnlyPenalty": 11.33,
      "confidence": 63.83,
      "mofContribution": 80.14,
      "conventionalContribution": 48.92,
      "overall": 78.52
    },
    "expectedConventional": {
      "mode": "conventional_sorbent",
      "mofCaptureScore": 14.87,
      "conventionalScore": 23.07,
      "sorbentCoverage": 35.64,
      "waterEfficiency": 32.89,
      "conventionalOnlyPenalty": 0,
      "confidence": 43.1,
      "mofContribution": 41.29,
      "conventionalContribution": 21.01,
      "overall": 20.14
    }
  }
];
