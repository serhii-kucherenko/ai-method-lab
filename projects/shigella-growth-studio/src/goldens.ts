import type { GrowthInput, GrowthQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GrowthInput;
  expectedAntibiotic: GrowthQuality;
  expectedUntreated: GrowthQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sg-001",
    "input": {
      "antibioticCoverage": 0.34,
      "shigellaConfirmation": 0.34,
      "episodeSeverity": 0.49,
      "untreatedDuration": 0.5,
      "growthVulnerability": 0.34,
      "cohortFollowUp": 0.34,
      "growthAssaySignal": 0.34,
      "overclaimRisk": 0.5,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 40.86,
      "episodeControlScore": 36.03,
      "assayCoverage": 38.53,
      "cohortEfficiency": 48.17,
      "untreatedPenalty": 31.14,
      "confidence": 14.82,
      "antibioticContribution": 46.86,
      "untreatedContribution": 37.62,
      "overall": 49.2
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 41.67,
      "episodeControlScore": 42.14,
      "assayCoverage": 32.11,
      "cohortEfficiency": 31.44,
      "untreatedPenalty": 14.86,
      "confidence": 18.97,
      "antibioticContribution": 46.5,
      "untreatedContribution": 37.41,
      "overall": 34.71
    }
  },
  {
    "id": "sg-002",
    "input": {
      "antibioticCoverage": 0.38,
      "shigellaConfirmation": 0.38,
      "episodeSeverity": 0.5,
      "untreatedDuration": 0.51,
      "growthVulnerability": 0.38,
      "cohortFollowUp": 0.38,
      "growthAssaySignal": 0.38,
      "overclaimRisk": 0.51,
      "treatmentBias": "growth_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 49.88,
      "episodeControlScore": 34.04,
      "assayCoverage": 48.08,
      "cohortEfficiency": 65.22,
      "untreatedPenalty": 30.49,
      "confidence": 17.54,
      "antibioticContribution": 56.28,
      "untreatedContribution": 43.18,
      "overall": 57.92
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 38.85,
      "episodeControlScore": 49.49,
      "assayCoverage": 32.36,
      "cohortEfficiency": 38.36,
      "untreatedPenalty": 14.94,
      "confidence": 20.24,
      "antibioticContribution": 48.82,
      "untreatedContribution": 39.99,
      "overall": 36.97
    }
  },
  {
    "id": "sg-003",
    "input": {
      "antibioticCoverage": 0.42,
      "shigellaConfirmation": 0.42,
      "episodeSeverity": 0.51,
      "untreatedDuration": 0.46,
      "growthVulnerability": 0.42,
      "cohortFollowUp": 0.42,
      "growthAssaySignal": 0.42,
      "overclaimRisk": 0.46,
      "treatmentBias": "untreated_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 19.35,
      "episodeControlScore": 36.36,
      "assayCoverage": 29.25,
      "cohortEfficiency": 30.56,
      "untreatedPenalty": 54.06,
      "confidence": 21.46,
      "antibioticContribution": 29.37,
      "untreatedContribution": 28.5,
      "overall": 30.21
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 38.95,
      "episodeControlScore": 48.64,
      "assayCoverage": 32.6,
      "cohortEfficiency": 41.98,
      "untreatedPenalty": 13.11,
      "confidence": 24.28,
      "antibioticContribution": 49.81,
      "untreatedContribution": 40.5,
      "overall": 37.69
    }
  },
  {
    "id": "sg-004",
    "input": {
      "antibioticCoverage": 0.38,
      "shigellaConfirmation": 0.38,
      "episodeSeverity": 0.43,
      "untreatedDuration": 0.46,
      "growthVulnerability": 0.38,
      "cohortFollowUp": 0.38,
      "growthAssaySignal": 0.38,
      "overclaimRisk": 0.46,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 45.73,
      "episodeControlScore": 40.12,
      "assayCoverage": 42.12,
      "cohortEfficiency": 51.72,
      "untreatedPenalty": 29.69,
      "confidence": 18.54,
      "antibioticContribution": 50.46,
      "untreatedContribution": 41.08,
      "overall": 52.77
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 41.37,
      "episodeControlScore": 45.27,
      "assayCoverage": 32.36,
      "cohortEfficiency": 34.22,
      "untreatedPenalty": 13.05,
      "confidence": 22.74,
      "antibioticContribution": 48.03,
      "untreatedContribution": 39.09,
      "overall": 36.4
    }
  },
  {
    "id": "sg-005",
    "input": {
      "antibioticCoverage": 0.42,
      "shigellaConfirmation": 0.42,
      "episodeSeverity": 0.44,
      "untreatedDuration": 0.47,
      "growthVulnerability": 0.42,
      "cohortFollowUp": 0.42,
      "growthAssaySignal": 0.42,
      "overclaimRisk": 0.47,
      "treatmentBias": "antibiotic_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 55.29,
      "episodeControlScore": 46.08,
      "assayCoverage": 37.25,
      "cohortEfficiency": 30.99,
      "untreatedPenalty": 29.05,
      "confidence": 21.26,
      "antibioticContribution": 47.71,
      "untreatedContribution": 42.06,
      "overall": 50.69
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 26.55,
      "episodeControlScore": 31.87,
      "assayCoverage": 32.6,
      "cohortEfficiency": 25.65,
      "untreatedPenalty": 13.13,
      "confidence": 24.01,
      "antibioticContribution": 40.71,
      "untreatedContribution": 25.91,
      "overall": 24.25
    }
  },
  {
    "id": "sg-006",
    "input": {
      "antibioticCoverage": 0.45,
      "shigellaConfirmation": 0.45,
      "episodeSeverity": 0.45,
      "untreatedDuration": 0.42,
      "growthVulnerability": 0.45,
      "cohortFollowUp": 0.45,
      "growthAssaySignal": 0.45,
      "overclaimRisk": 0.42,
      "treatmentBias": "balanced",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 53.76,
      "episodeControlScore": 44.53,
      "assayCoverage": 48.41,
      "cohortEfficiency": 55.19,
      "untreatedPenalty": 28.16,
      "confidence": 24.45,
      "antibioticContribution": 55.83,
      "untreatedContribution": 45.56,
      "overall": 57.98
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 39.63,
      "episodeControlScore": 43.57,
      "assayCoverage": 32.79,
      "cohortEfficiency": 37.39,
      "untreatedPenalty": 11.38,
      "confidence": 27.62,
      "antibioticContribution": 48.4,
      "untreatedContribution": 38.29,
      "overall": 35.74
    }
  },
  {
    "id": "sg-007",
    "input": {
      "antibioticCoverage": 0.49,
      "shigellaConfirmation": 0.49,
      "episodeSeverity": 0.46,
      "untreatedDuration": 0.43,
      "growthVulnerability": 0.49,
      "cohortFollowUp": 0.49,
      "growthAssaySignal": 0.49,
      "overclaimRisk": 0.43,
      "treatmentBias": "growth_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 64.23,
      "episodeControlScore": 41.31,
      "assayCoverage": 59.69,
      "cohortEfficiency": 74.46,
      "untreatedPenalty": 27.52,
      "confidence": 27.17,
      "antibioticContribution": 66.69,
      "untreatedContribution": 51.64,
      "overall": 67.98
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 36.81,
      "episodeControlScore": 51.6,
      "assayCoverage": 33.04,
      "cohortEfficiency": 45.38,
      "untreatedPenalty": 11.46,
      "confidence": 28.89,
      "antibioticContribution": 51.07,
      "untreatedContribution": 41.33,
      "overall": 38.44
    }
  },
  {
    "id": "sg-008",
    "input": {
      "antibioticCoverage": 0.45,
      "shigellaConfirmation": 0.45,
      "episodeSeverity": 0.39,
      "untreatedDuration": 0.44,
      "growthVulnerability": 0.45,
      "cohortFollowUp": 0.45,
      "growthAssaySignal": 0.45,
      "overclaimRisk": 0.44,
      "treatmentBias": "untreated_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 21.57,
      "episodeControlScore": 40.51,
      "assayCoverage": 31.34,
      "cohortEfficiency": 32.6,
      "untreatedPenalty": 52.57,
      "confidence": 24.05,
      "antibioticContribution": 31.39,
      "untreatedContribution": 30.8,
      "overall": 32.28
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 38.32,
      "episodeControlScore": 57.12,
      "assayCoverage": 32.79,
      "cohortEfficiency": 44.18,
      "untreatedPenalty": 11.76,
      "confidence": 26.86,
      "antibioticContribution": 52.13,
      "untreatedContribution": 43.88,
      "overall": 40.81
    }
  },
  {
    "id": "sg-009",
    "input": {
      "antibioticCoverage": 0.49,
      "shigellaConfirmation": 0.49,
      "episodeSeverity": 0.39,
      "untreatedDuration": 0.38,
      "growthVulnerability": 0.49,
      "cohortFollowUp": 0.49,
      "growthAssaySignal": 0.49,
      "overclaimRisk": 0.38,
      "treatmentBias": "balanced",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 58.63,
      "episodeControlScore": 48.62,
      "assayCoverage": 52,
      "cohortEfficiency": 58.73,
      "untreatedPenalty": 26.72,
      "confidence": 28.17,
      "antibioticContribution": 59.43,
      "untreatedContribution": 49.02,
      "overall": 61.56
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 39.33,
      "episodeControlScore": 46.71,
      "assayCoverage": 33.04,
      "cohortEfficiency": 40.18,
      "untreatedPenalty": 9.57,
      "confidence": 31.39,
      "antibioticContribution": 49.94,
      "untreatedContribution": 39.98,
      "overall": 37.44
    }
  },
  {
    "id": "sg-010",
    "input": {
      "antibioticCoverage": 0.53,
      "shigellaConfirmation": 0.53,
      "episodeSeverity": 0.4,
      "untreatedDuration": 0.39,
      "growthVulnerability": 0.53,
      "cohortFollowUp": 0.53,
      "growthAssaySignal": 0.53,
      "overclaimRisk": 0.39,
      "treatmentBias": "antibiotic_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 69.64,
      "episodeControlScore": 55.54,
      "assayCoverage": 44.91,
      "cohortEfficiency": 35.13,
      "untreatedPenalty": 26.07,
      "confidence": 30.89,
      "antibioticContribution": 55.9,
      "untreatedContribution": 50.27,
      "overall": 58.89
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 24.51,
      "episodeControlScore": 32.43,
      "assayCoverage": 33.29,
      "cohortEfficiency": 30.25,
      "untreatedPenalty": 9.65,
      "confidence": 32.66,
      "antibioticContribution": 42.17,
      "untreatedContribution": 26.22,
      "overall": 24.74
    }
  },
  {
    "id": "sg-011",
    "input": {
      "antibioticCoverage": 0.57,
      "shigellaConfirmation": 0.57,
      "episodeSeverity": 0.41,
      "untreatedDuration": 0.4,
      "growthVulnerability": 0.57,
      "cohortFollowUp": 0.57,
      "growthAssaySignal": 0.57,
      "overclaimRisk": 0.4,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 67.28,
      "episodeControlScore": 53.19,
      "assayCoverage": 59.19,
      "cohortEfficiency": 61.04,
      "untreatedPenalty": 25.43,
      "confidence": 33.61,
      "antibioticContribution": 64.95,
      "untreatedContribution": 53.5,
      "overall": 66.89
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 34.7,
      "episodeControlScore": 44.39,
      "assayCoverage": 33.53,
      "cohortEfficiency": 41.07,
      "untreatedPenalty": 9.73,
      "confidence": 33.93,
      "antibioticContribution": 48.79,
      "untreatedContribution": 37.05,
      "overall": 34.38
    }
  },
  {
    "id": "sg-012",
    "input": {
      "antibioticCoverage": 0.53,
      "shigellaConfirmation": 0.53,
      "episodeSeverity": 0.34,
      "untreatedDuration": 0.35,
      "growthVulnerability": 0.53,
      "cohortFollowUp": 0.53,
      "growthAssaySignal": 0.53,
      "overclaimRisk": 0.35,
      "treatmentBias": "growth_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 70.11,
      "episodeControlScore": 46.46,
      "assayCoverage": 63.9,
      "cohortEfficiency": 81.69,
      "untreatedPenalty": 25.41,
      "confidence": 31.69,
      "antibioticContribution": 71.73,
      "untreatedContribution": 56.5,
      "overall": 72.99
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 38.12,
      "episodeControlScore": 60.43,
      "assayCoverage": 33.29,
      "cohortEfficiency": 51.1,
      "untreatedPenalty": 8.13,
      "confidence": 34.68,
      "antibioticContribution": 54.96,
      "untreatedContribution": 46.54,
      "overall": 43.64
    }
  },
  {
    "id": "sg-013",
    "input": {
      "antibioticCoverage": 0.57,
      "shigellaConfirmation": 0.57,
      "episodeSeverity": 0.35,
      "untreatedDuration": 0.36,
      "growthVulnerability": 0.57,
      "cohortFollowUp": 0.57,
      "growthAssaySignal": 0.57,
      "overclaimRisk": 0.36,
      "treatmentBias": "untreated_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 29.94,
      "episodeControlScore": 48.3,
      "assayCoverage": 39.69,
      "cohortEfficiency": 36.96,
      "untreatedPenalty": 49.4,
      "confidence": 34.41,
      "antibioticContribution": 37.93,
      "untreatedContribution": 36.3,
      "overall": 38.64
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 35.81,
      "episodeControlScore": 59.11,
      "assayCoverage": 33.53,
      "cohortEfficiency": 51.42,
      "untreatedPenalty": 8.21,
      "confidence": 35.95,
      "antibioticContribution": 54.33,
      "untreatedContribution": 44.99,
      "overall": 42.03
    }
  },
  {
    "id": "sg-014",
    "input": {
      "antibioticCoverage": 0.61,
      "shigellaConfirmation": 0.61,
      "episodeSeverity": 0.35,
      "untreatedDuration": 0.36,
      "growthVulnerability": 0.61,
      "cohortFollowUp": 0.61,
      "growthAssaySignal": 0.61,
      "overclaimRisk": 0.36,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 72.15,
      "episodeControlScore": 57.28,
      "assayCoverage": 62.78,
      "cohortEfficiency": 64.58,
      "untreatedPenalty": 23.98,
      "confidence": 37.33,
      "antibioticContribution": 68.56,
      "untreatedContribution": 56.95,
      "overall": 70.47
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 34.4,
      "episodeControlScore": 47.53,
      "assayCoverage": 33.78,
      "cohortEfficiency": 43.85,
      "untreatedPenalty": 7.93,
      "confidence": 37.71,
      "antibioticContribution": 50.33,
      "untreatedContribution": 38.73,
      "overall": 36.07
    }
  },
  {
    "id": "sg-015",
    "input": {
      "antibioticCoverage": 0.65,
      "shigellaConfirmation": 0.65,
      "episodeSeverity": 0.36,
      "untreatedDuration": 0.31,
      "growthVulnerability": 0.65,
      "cohortFollowUp": 0.65,
      "growthAssaySignal": 0.65,
      "overclaimRisk": 0.31,
      "treatmentBias": "antibiotic_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 85.23,
      "episodeControlScore": 65.74,
      "assayCoverage": 53.27,
      "cohortEfficiency": 39.49,
      "untreatedPenalty": 22.91,
      "confidence": 41.25,
      "antibioticContribution": 64.75,
      "untreatedContribution": 59.13,
      "overall": 67.74
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 22,
      "episodeControlScore": 32.86,
      "assayCoverage": 34.03,
      "cohortEfficiency": 35.07,
      "untreatedPenalty": 6.1,
      "confidence": 41.75,
      "antibioticContribution": 43.57,
      "untreatedContribution": 26.3,
      "overall": 24.99
    }
  },
  {
    "id": "sg-016",
    "input": {
      "antibioticCoverage": 0.6,
      "shigellaConfirmation": 0.6,
      "episodeSeverity": 0.29,
      "untreatedDuration": 0.32,
      "growthVulnerability": 0.6,
      "cohortFollowUp": 0.6,
      "growthAssaySignal": 0.6,
      "overclaimRisk": 0.32,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 71.49,
      "episodeControlScore": 58.16,
      "assayCoverage": 61.88,
      "cohortEfficiency": 66.17,
      "untreatedPenalty": 23.51,
      "confidence": 37.4,
      "antibioticContribution": 68.53,
      "untreatedContribution": 57.36,
      "overall": 70.52
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 36.48,
      "episodeControlScore": 51.32,
      "assayCoverage": 33.72,
      "cohortEfficiency": 45.51,
      "untreatedPenalty": 6.47,
      "confidence": 39.28,
      "antibioticContribution": 52.11,
      "untreatedContribution": 41.56,
      "overall": 38.96
    }
  },
  {
    "id": "sg-017",
    "input": {
      "antibioticCoverage": 0.64,
      "shigellaConfirmation": 0.64,
      "episodeSeverity": 0.3,
      "untreatedDuration": 0.33,
      "growthVulnerability": 0.64,
      "cohortFollowUp": 0.64,
      "growthAssaySignal": 0.64,
      "overclaimRisk": 0.33,
      "treatmentBias": "growth_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 83.96,
      "episodeControlScore": 53.25,
      "assayCoverage": 75.51,
      "cohortEfficiency": 89,
      "untreatedPenalty": 22.87,
      "confidence": 40.12,
      "antibioticContribution": 81.47,
      "untreatedContribution": 64.27,
      "overall": 82.37
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 33.67,
      "episodeControlScore": 62.07,
      "assayCoverage": 33.97,
      "cohortEfficiency": 54.82,
      "untreatedPenalty": 6.55,
      "confidence": 40.55,
      "antibioticContribution": 55.6,
      "untreatedContribution": 45.82,
      "overall": 42.79
    }
  },
  {
    "id": "sg-018",
    "input": {
      "antibioticCoverage": 0.68,
      "shigellaConfirmation": 0.68,
      "episodeSeverity": 0.3,
      "untreatedDuration": 0.27,
      "growthVulnerability": 0.68,
      "cohortFollowUp": 0.68,
      "growthAssaySignal": 0.68,
      "overclaimRisk": 0.27,
      "treatmentBias": "untreated_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 37.75,
      "episodeControlScore": 55.85,
      "assayCoverage": 47.36,
      "cohortEfficiency": 41.37,
      "untreatedPenalty": 46.29,
      "confidence": 44.24,
      "antibioticContribution": 44.11,
      "untreatedContribution": 41.58,
      "overall": 44.65
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 34.17,
      "episodeControlScore": 62.03,
      "assayCoverage": 34.22,
      "cohortEfficiency": 59.02,
      "untreatedPenalty": 4.37,
      "confidence": 45.09,
      "antibioticContribution": 57.01,
      "untreatedContribution": 46.95,
      "overall": 44.14
    }
  },
  {
    "id": "sg-019",
    "input": {
      "antibioticCoverage": 0.72,
      "shigellaConfirmation": 0.72,
      "episodeSeverity": 0.31,
      "untreatedDuration": 0.28,
      "growthVulnerability": 0.72,
      "cohortFollowUp": 0.72,
      "growthAssaySignal": 0.72,
      "overclaimRisk": 0.28,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 85.05,
      "episodeControlScore": 65.78,
      "assayCoverage": 72.66,
      "cohortEfficiency": 71.59,
      "untreatedPenalty": 21.01,
      "confidence": 46.96,
      "antibioticContribution": 77.53,
      "untreatedContribution": 64.89,
      "overall": 79.25
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 32.36,
      "episodeControlScore": 48.96,
      "assayCoverage": 34.46,
      "cohortEfficiency": 49.81,
      "untreatedPenalty": 4.45,
      "confidence": 46.36,
      "antibioticContribution": 52.23,
      "untreatedContribution": 39.62,
      "overall": 37.11
    }
  },
  {
    "id": "sg-020",
    "input": {
      "antibioticCoverage": 0.68,
      "shigellaConfirmation": 0.68,
      "episodeSeverity": 0.24,
      "untreatedDuration": 0.29,
      "growthVulnerability": 0.68,
      "cohortFollowUp": 0.68,
      "growthAssaySignal": 0.68,
      "overclaimRisk": 0.29,
      "treatmentBias": "antibiotic_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 89.37,
      "episodeControlScore": 70.49,
      "assayCoverage": 55.36,
      "cohortEfficiency": 41.53,
      "untreatedPenalty": 21.42,
      "confidence": 43.84,
      "antibioticContribution": 67.38,
      "untreatedContribution": 62.32,
      "overall": 70.47
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 21.37,
      "episodeControlScore": 36.67,
      "assayCoverage": 34.22,
      "cohortEfficiency": 36.66,
      "untreatedPenalty": 4.75,
      "confidence": 44.33,
      "antibioticContribution": 44.83,
      "untreatedContribution": 27.92,
      "overall": 26.5
    }
  },
  {
    "id": "sg-021",
    "input": {
      "antibioticCoverage": 0.72,
      "shigellaConfirmation": 0.72,
      "episodeSeverity": 0.25,
      "untreatedDuration": 0.24,
      "growthVulnerability": 0.72,
      "cohortFollowUp": 0.72,
      "growthAssaySignal": 0.72,
      "overclaimRisk": 0.24,
      "treatmentBias": "balanced",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 85.5,
      "episodeControlScore": 67.3,
      "assayCoverage": 72.66,
      "cohortEfficiency": 73.57,
      "untreatedPenalty": 20.34,
      "confidence": 47.76,
      "antibioticContribution": 78.23,
      "untreatedContribution": 65.91,
      "overall": 80.01
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 33.97,
      "episodeControlScore": 52.62,
      "assayCoverage": 34.46,
      "cohortEfficiency": 51.69,
      "untreatedPenalty": 2.92,
      "confidence": 48.37,
      "antibioticContribution": 53.96,
      "untreatedContribution": 42.22,
      "overall": 39.76
    }
  },
  {
    "id": "sg-022",
    "input": {
      "antibioticCoverage": 0.76,
      "shigellaConfirmation": 0.76,
      "episodeSeverity": 0.26,
      "untreatedDuration": 0.25,
      "growthVulnerability": 0.76,
      "cohortFollowUp": 0.76,
      "growthAssaySignal": 0.76,
      "overclaimRisk": 0.25,
      "treatmentBias": "growth_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 99.54,
      "episodeControlScore": 61.04,
      "assayCoverage": 88.16,
      "cohortEfficiency": 98.78,
      "untreatedPenalty": 19.7,
      "confidence": 50.48,
      "antibioticContribution": 92.72,
      "untreatedContribution": 73.37,
      "overall": 93.24
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 31.15,
      "episodeControlScore": 64.05,
      "assayCoverage": 34.71,
      "cohortEfficiency": 62.06,
      "untreatedPenalty": 3,
      "confidence": 49.64,
      "antibioticContribution": 57.79,
      "untreatedContribution": 46.92,
      "overall": 44.01
    }
  },
  {
    "id": "sg-023",
    "input": {
      "antibioticCoverage": 0.8,
      "shigellaConfirmation": 0.8,
      "episodeSeverity": 0.26,
      "untreatedDuration": 0.25,
      "growthVulnerability": 0.8,
      "cohortFollowUp": 0.8,
      "growthAssaySignal": 0.8,
      "overclaimRisk": 0.25,
      "treatmentBias": "untreated_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 45.69,
      "episodeControlScore": 63.16,
      "assayCoverage": 55.71,
      "cohortEfficiency": 44.66,
      "untreatedPenalty": 43.56,
      "confidence": 53.4,
      "antibioticContribution": 50.2,
      "untreatedContribution": 46.59,
      "overall": 50.55
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 29.24,
      "episodeControlScore": 63.53,
      "assayCoverage": 34.96,
      "cohortEfficiency": 62.96,
      "untreatedPenalty": 2.72,
      "confidence": 51.4,
      "antibioticContribution": 57.59,
      "untreatedContribution": 46,
      "overall": 43.05
    }
  },
  {
    "id": "sg-024",
    "input": {
      "antibioticCoverage": 0.76,
      "shigellaConfirmation": 0.76,
      "episodeSeverity": 0.19,
      "untreatedDuration": 0.2,
      "growthVulnerability": 0.76,
      "cohortFollowUp": 0.76,
      "growthAssaySignal": 0.76,
      "overclaimRisk": 0.2,
      "treatmentBias": "balanced",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 90.37,
      "episodeControlScore": 71.39,
      "assayCoverage": 76.25,
      "cohortEfficiency": 77.12,
      "untreatedPenalty": 18.9,
      "confidence": 51.48,
      "antibioticContribution": 81.83,
      "untreatedContribution": 69.37,
      "overall": 83.59
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 33.66,
      "episodeControlScore": 55.76,
      "assayCoverage": 34.71,
      "cohortEfficiency": 54.48,
      "untreatedPenalty": 1.12,
      "confidence": 52.15,
      "antibioticContribution": 55.5,
      "untreatedContribution": 43.9,
      "overall": 41.45
    }
  },
  {
    "id": "sg-025",
    "input": {
      "antibioticCoverage": 0.8,
      "shigellaConfirmation": 0.8,
      "episodeSeverity": 0.2,
      "untreatedDuration": 0.21,
      "growthVulnerability": 0.8,
      "cohortFollowUp": 0.8,
      "growthAssaySignal": 0.8,
      "overclaimRisk": 0.21,
      "treatmentBias": "antibiotic_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 100,
      "episodeControlScore": 80.68,
      "assayCoverage": 63.71,
      "cohortEfficiency": 45.89,
      "untreatedPenalty": 18.25,
      "confidence": 54.2,
      "antibioticContribution": 74.65,
      "untreatedContribution": 69.44,
      "overall": 77.71
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 18.85,
      "episodeControlScore": 37.1,
      "assayCoverage": 34.96,
      "cohortEfficiency": 41.48,
      "untreatedPenalty": 1.2,
      "confidence": 53.42,
      "antibioticContribution": 46.24,
      "untreatedContribution": 28,
      "overall": 26.75
    }
  },
  {
    "id": "sg-026",
    "input": {
      "antibioticCoverage": 0.83,
      "shigellaConfirmation": 0.83,
      "episodeSeverity": 0.21,
      "untreatedDuration": 0.22,
      "growthVulnerability": 0.83,
      "cohortFollowUp": 0.83,
      "growthAssaySignal": 0.83,
      "overclaimRisk": 0.22,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 97.91,
      "episodeControlScore": 75.33,
      "assayCoverage": 82.53,
      "cohortEfficiency": 79.03,
      "untreatedPenalty": 17.8,
      "confidence": 56.19,
      "antibioticContribution": 86.62,
      "untreatedContribution": 73.24,
      "overall": 88.21
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 29.51,
      "episodeControlScore": 53.57,
      "assayCoverage": 35.15,
      "cohortEfficiency": 55.14,
      "untreatedPenalty": 1.35,
      "confidence": 54.25,
      "antibioticContribution": 54.4,
      "untreatedContribution": 41.2,
      "overall": 38.63
    }
  },
  {
    "id": "sg-027",
    "input": {
      "antibioticCoverage": 0.87,
      "shigellaConfirmation": 0.87,
      "episodeSeverity": 0.22,
      "untreatedDuration": 0.17,
      "growthVulnerability": 0.87,
      "cohortFollowUp": 0.87,
      "growthAssaySignal": 0.87,
      "overclaimRisk": 0.17,
      "treatmentBias": "growth_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 100,
      "episodeControlScore": 68.31,
      "assayCoverage": 99.77,
      "cohortEfficiency": 100,
      "untreatedPenalty": 16.73,
      "confidence": 60.11,
      "antibioticContribution": 96.92,
      "untreatedContribution": 75.36,
      "overall": 97.04
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 29.11,
      "episodeControlScore": 66.17,
      "assayCoverage": 35.39,
      "cohortEfficiency": 69.08,
      "untreatedPenalty": 0,
      "confidence": 58.29,
      "antibioticContribution": 59.95,
      "untreatedContribution": 48.26,
      "overall": 45.46
    }
  },
  {
    "id": "sg-028",
    "input": {
      "antibioticCoverage": 0.83,
      "shigellaConfirmation": 0.83,
      "episodeSeverity": 0.14,
      "untreatedDuration": 0.17,
      "growthVulnerability": 0.83,
      "cohortFollowUp": 0.83,
      "growthAssaySignal": 0.83,
      "overclaimRisk": 0.17,
      "treatmentBias": "untreated_first",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 48.34,
      "episodeControlScore": 67.79,
      "assayCoverage": 57.8,
      "cohortEfficiency": 47.77,
      "untreatedPenalty": 41.64,
      "confidence": 57.19,
      "antibioticContribution": 52.67,
      "untreatedContribution": 49.38,
      "overall": 53.08
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 31.03,
      "episodeControlScore": 72.49,
      "assayCoverage": 35.15,
      "cohortEfficiency": 68.46,
      "untreatedPenalty": 0,
      "confidence": 56.75,
      "antibioticContribution": 61.43,
      "untreatedContribution": 51.44,
      "overall": 48.47
    }
  },
  {
    "id": "sg-029",
    "input": {
      "antibioticCoverage": 0.87,
      "shigellaConfirmation": 0.87,
      "episodeSeverity": 0.15,
      "untreatedDuration": 0.18,
      "growthVulnerability": 0.87,
      "cohortFollowUp": 0.87,
      "growthAssaySignal": 0.87,
      "overclaimRisk": 0.18,
      "treatmentBias": "balanced",
      "profile": "antibiotic_treated_shigella"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 100,
      "episodeControlScore": 79.41,
      "assayCoverage": 86.13,
      "cohortEfficiency": 82.57,
      "untreatedPenalty": 16.36,
      "confidence": 59.91,
      "antibioticContribution": 89.34,
      "untreatedContribution": 75.72,
      "overall": 90.89
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 29.21,
      "episodeControlScore": 56.71,
      "assayCoverage": 35.39,
      "cohortEfficiency": 57.93,
      "untreatedPenalty": 0,
      "confidence": 58.02,
      "antibioticContribution": 55.85,
      "untreatedContribution": 42.89,
      "overall": 40.31
    }
  },
  {
    "id": "sg-030",
    "input": {
      "antibioticCoverage": 0.91,
      "shigellaConfirmation": 0.91,
      "episodeSeverity": 0.16,
      "untreatedDuration": 0.13,
      "growthVulnerability": 0.91,
      "cohortFollowUp": 0.91,
      "growthAssaySignal": 0.91,
      "overclaimRisk": 0.13,
      "treatmentBias": "antibiotic_first",
      "profile": "untreated_diarrhea_growth"
    },
    "expectedAntibiotic": {
      "mode": "antibiotic_treated_shigella",
      "growthProtectionScore": 100,
      "episodeControlScore": 90.14,
      "assayCoverage": 71.37,
      "cohortEfficiency": 50.04,
      "untreatedPenalty": 15.28,
      "confidence": 63.83,
      "antibioticContribution": 78.24,
      "untreatedContribution": 72.63,
      "overall": 81.23
    },
    "expectedUntreated": {
      "mode": "untreated_diarrhea_growth",
      "growthProtectionScore": 16.81,
      "episodeControlScore": 37.66,
      "assayCoverage": 35.64,
      "cohortEfficiency": 46.08,
      "untreatedPenalty": 0,
      "confidence": 62.07,
      "antibioticContribution": 47.24,
      "untreatedContribution": 28.31,
      "overall": 27.14
    }
  }
];
