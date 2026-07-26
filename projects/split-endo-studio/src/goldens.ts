import type { EndoInput, EndoQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EndoInput;
  expectedOse: EndoQuality;
  expectedOpenLam: EndoQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "se-001",
    "input": {
      "bloodLoss": 0.55,
      "operativeTime": 0.49,
      "hospitalStay": 0.55,
      "complicationRate": 0.5,
      "decompressionQuality": 0.34,
      "recoverySignal": 0.34,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 42.36,
      "stayScore": 51.05,
      "safetyScore": 47.23,
      "recoveryScore": 29.64,
      "openPenalty": 32.16,
      "confidence": 21,
      "oseContribution": 50.8,
      "openContribution": 35.53,
      "overall": 52.05
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 29.46,
      "stayScore": 30.61,
      "safetyScore": 28.35,
      "recoveryScore": 22.12,
      "openPenalty": 19.37,
      "confidence": 18.84,
      "oseContribution": 38.23,
      "openContribution": 25.53,
      "overall": 22.62
    }
  },
  {
    "id": "se-002",
    "input": {
      "bloodLoss": 0.56,
      "operativeTime": 0.5,
      "hospitalStay": 0.56,
      "complicationRate": 0.51,
      "decompressionQuality": 0.38,
      "recoverySignal": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "approachBias": "stay_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 47.96,
      "stayScore": 59.46,
      "safetyScore": 28.38,
      "recoveryScore": 32.35,
      "openPenalty": 32.63,
      "confidence": 21.3,
      "oseContribution": 50.83,
      "openContribution": 35.09,
      "overall": 52
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 30.12,
      "stayScore": 37.74,
      "safetyScore": 29.07,
      "recoveryScore": 28.84,
      "openPenalty": 18.55,
      "confidence": 19.37,
      "oseContribution": 41.44,
      "openContribution": 28.96,
      "overall": 26.01
    }
  },
  {
    "id": "se-003",
    "input": {
      "bloodLoss": 0.5,
      "operativeTime": 0.51,
      "hospitalStay": 0.5,
      "complicationRate": 0.46,
      "decompressionQuality": 0.42,
      "recoverySignal": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "approachBias": "open_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 18.94,
      "stayScore": 33.95,
      "safetyScore": 31.3,
      "recoveryScore": 37.07,
      "openPenalty": 54.5,
      "confidence": 26.3,
      "oseContribution": 31.24,
      "openContribution": 25.5,
      "overall": 31.21
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 33.68,
      "stayScore": 41.89,
      "safetyScore": 31.33,
      "recoveryScore": 30.87,
      "openPenalty": 16.37,
      "confidence": 24.42,
      "oseContribution": 44.28,
      "openContribution": 32.71,
      "overall": 29.5
    }
  },
  {
    "id": "se-004",
    "input": {
      "bloodLoss": 0.51,
      "operativeTime": 0.43,
      "hospitalStay": 0.51,
      "complicationRate": 0.46,
      "decompressionQuality": 0.38,
      "recoverySignal": 0.38,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 46.9,
      "stayScore": 55.39,
      "safetyScore": 51.58,
      "recoveryScore": 33.85,
      "openPenalty": 30.28,
      "confidence": 24.8,
      "oseContribution": 54.75,
      "openContribution": 38.99,
      "overall": 55.91
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 32.41,
      "stayScore": 33.74,
      "safetyScore": 30.48,
      "recoveryScore": 23.93,
      "openPenalty": 17.13,
      "confidence": 22.72,
      "oseContribution": 40.69,
      "openContribution": 28.54,
      "overall": 25.51
    }
  },
  {
    "id": "se-005",
    "input": {
      "bloodLoss": 0.51,
      "operativeTime": 0.44,
      "hospitalStay": 0.51,
      "complicationRate": 0.47,
      "decompressionQuality": 0.42,
      "recoverySignal": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "approachBias": "blood_loss_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 53.68,
      "stayScore": 43.39,
      "safetyScore": 69.71,
      "recoveryScore": 36.77,
      "openPenalty": 30.33,
      "confidence": 25.6,
      "oseContribution": 56.79,
      "openContribution": 46.4,
      "overall": 58.92
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 21.32,
      "stayScore": 27.03,
      "safetyScore": 31.05,
      "recoveryScore": 20.1,
      "openPenalty": 16.15,
      "confidence": 23.75,
      "oseContribution": 36.67,
      "openContribution": 19.98,
      "overall": 17.89
    }
  },
  {
    "id": "se-006",
    "input": {
      "bloodLoss": 0.46,
      "operativeTime": 0.45,
      "hospitalStay": 0.46,
      "complicationRate": 0.42,
      "decompressionQuality": 0.45,
      "recoverySignal": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "approachBias": "balanced",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 53.39,
      "stayScore": 58.74,
      "safetyScore": 57.28,
      "recoveryScore": 40.53,
      "openPenalty": 27.98,
      "confidence": 29.85,
      "oseContribution": 59.31,
      "openContribution": 44.09,
      "overall": 60.57
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 36.74,
      "stayScore": 38.24,
      "safetyScore": 33.21,
      "recoveryScore": 27.35,
      "openPenalty": 14.4,
      "confidence": 28,
      "oseContribution": 44.23,
      "openContribution": 33.02,
      "overall": 29.73
    }
  },
  {
    "id": "se-007",
    "input": {
      "bloodLoss": 0.47,
      "operativeTime": 0.46,
      "hospitalStay": 0.47,
      "complicationRate": 0.43,
      "decompressionQuality": 0.49,
      "recoverySignal": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "approachBias": "stay_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 60.22,
      "stayScore": 68.92,
      "safetyScore": 34.19,
      "recoveryScore": 43.25,
      "openPenalty": 28.45,
      "confidence": 30.15,
      "oseContribution": 59.32,
      "openContribution": 43.35,
      "overall": 60.45
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 37.4,
      "stayScore": 47.03,
      "safetyScore": 33.92,
      "recoveryScore": 35.32,
      "openPenalty": 13.58,
      "confidence": 28.53,
      "oseContribution": 48.02,
      "openContribution": 37.11,
      "overall": 33.75
    }
  },
  {
    "id": "se-008",
    "input": {
      "bloodLoss": 0.47,
      "operativeTime": 0.39,
      "hospitalStay": 0.47,
      "complicationRate": 0.44,
      "decompressionQuality": 0.45,
      "recoverySignal": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "approachBias": "open_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 20.93,
      "stayScore": 38.32,
      "safetyScore": 32.82,
      "recoveryScore": 40.13,
      "openPenalty": 53.14,
      "confidence": 28.95,
      "oseContribution": 33.78,
      "openContribution": 27.09,
      "overall": 33.58
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 35.78,
      "stayScore": 44.42,
      "safetyScore": 32.49,
      "recoveryScore": 32.57,
      "openPenalty": 14.28,
      "confidence": 27.16,
      "oseContribution": 46.2,
      "openContribution": 35,
      "overall": 31.64
    }
  },
  {
    "id": "se-009",
    "input": {
      "bloodLoss": 0.42,
      "operativeTime": 0.39,
      "hospitalStay": 0.42,
      "complicationRate": 0.38,
      "decompressionQuality": 0.49,
      "recoverySignal": 0.49,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "approachBias": "balanced",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 57.93,
      "stayScore": 63.08,
      "safetyScore": 61.63,
      "recoveryScore": 44.75,
      "openPenalty": 26.1,
      "confidence": 33.65,
      "oseContribution": 63.27,
      "openContribution": 47.55,
      "overall": 64.44
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 39.69,
      "stayScore": 41.37,
      "safetyScore": 35.33,
      "recoveryScore": 29.17,
      "openPenalty": 12.16,
      "confidence": 31.88,
      "oseContribution": 46.68,
      "openContribution": 36.03,
      "overall": 32.61
    }
  },
  {
    "id": "se-010",
    "input": {
      "bloodLoss": 0.43,
      "operativeTime": 0.4,
      "hospitalStay": 0.43,
      "complicationRate": 0.39,
      "decompressionQuality": 0.53,
      "recoverySignal": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "approachBias": "blood_loss_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 65.27,
      "stayScore": 48.51,
      "safetyScore": 83.05,
      "recoveryScore": 47.46,
      "openPenalty": 26.57,
      "confidence": 33.95,
      "oseContribution": 65.29,
      "openContribution": 55.94,
      "overall": 67.61
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 28.34,
      "stayScore": 32.44,
      "safetyScore": 36.05,
      "recoveryScore": 23.85,
      "openPenalty": 11.34,
      "confidence": 32.41,
      "oseContribution": 41.87,
      "openContribution": 26.43,
      "overall": 24.07
    }
  },
  {
    "id": "se-011",
    "input": {
      "bloodLoss": 0.43,
      "operativeTime": 0.41,
      "hospitalStay": 0.43,
      "complicationRate": 0.4,
      "decompressionQuality": 0.57,
      "recoverySignal": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 60.75,
      "stayScore": 63.22,
      "safetyScore": 63.94,
      "recoveryScore": 50.38,
      "openPenalty": 26.62,
      "confidence": 34.75,
      "oseContribution": 64.52,
      "openContribution": 50.82,
      "overall": 66.05
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 42.25,
      "stayScore": 44.2,
      "safetyScore": 36.62,
      "recoveryScore": 33.88,
      "openPenalty": 10.36,
      "confidence": 33.44,
      "oseContribution": 49.32,
      "openContribution": 39.01,
      "overall": 35.46
    }
  },
  {
    "id": "se-012",
    "input": {
      "bloodLoss": 0.38,
      "operativeTime": 0.34,
      "hospitalStay": 0.38,
      "complicationRate": 0.35,
      "decompressionQuality": 0.53,
      "recoverySignal": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "approachBias": "stay_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 68.99,
      "stayScore": 79.32,
      "safetyScore": 38.28,
      "recoveryScore": 48.86,
      "openPenalty": 24.27,
      "confidence": 37.25,
      "oseContribution": 66.75,
      "openContribution": 48.38,
      "overall": 67.44
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 42.03,
      "stayScore": 52.23,
      "safetyScore": 37.03,
      "recoveryScore": 36.99,
      "openPenalty": 10.02,
      "confidence": 35.59,
      "oseContribution": 51.65,
      "openContribution": 41.82,
      "overall": 38.16
    }
  },
  {
    "id": "se-013",
    "input": {
      "bloodLoss": 0.38,
      "operativeTime": 0.35,
      "hospitalStay": 0.38,
      "complicationRate": 0.36,
      "decompressionQuality": 0.57,
      "recoverySignal": 0.57,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "approachBias": "open_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 27.83,
      "stayScore": 43.9,
      "safetyScore": 38.88,
      "recoveryScore": 51.78,
      "openPenalty": 48.96,
      "confidence": 38.05,
      "oseContribution": 39.58,
      "openContribution": 33.18,
      "overall": 39.43
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 43.44,
      "stayScore": 54.29,
      "safetyScore": 37.6,
      "recoveryScore": 39.74,
      "openPenalty": 9.04,
      "confidence": 36.62,
      "oseContribution": 53.21,
      "openContribution": 43.64,
      "overall": 39.87
    }
  },
  {
    "id": "se-014",
    "input": {
      "bloodLoss": 0.39,
      "operativeTime": 0.35,
      "hospitalStay": 0.39,
      "complicationRate": 0.36,
      "decompressionQuality": 0.61,
      "recoverySignal": 0.61,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 65.3,
      "stayScore": 67.56,
      "safetyScore": 68.29,
      "recoveryScore": 54.59,
      "openPenalty": 24.74,
      "confidence": 38.55,
      "oseContribution": 68.47,
      "openContribution": 54.28,
      "overall": 69.92
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 45.2,
      "stayScore": 47.33,
      "safetyScore": 38.75,
      "recoveryScore": 35.69,
      "openPenalty": 8.12,
      "confidence": 37.32,
      "oseContribution": 51.77,
      "openContribution": 42.02,
      "overall": 38.35
    }
  },
  {
    "id": "se-015",
    "input": {
      "bloodLoss": 0.34,
      "operativeTime": 0.36,
      "hospitalStay": 0.34,
      "complicationRate": 0.31,
      "decompressionQuality": 0.65,
      "recoverySignal": 0.65,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "approachBias": "blood_loss_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 78.03,
      "stayScore": 54.08,
      "safetyScore": 97,
      "recoveryScore": 59.11,
      "openPenalty": 22.39,
      "confidence": 43.05,
      "oseContribution": 74.46,
      "openContribution": 66.25,
      "overall": 76.98
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 36,
      "stayScore": 38.17,
      "safetyScore": 41.16,
      "recoveryScore": 27.91,
      "openPenalty": 6.1,
      "confidence": 41.87,
      "oseContribution": 47.43,
      "openContribution": 33.41,
      "overall": 30.67
    }
  },
  {
    "id": "se-016",
    "input": {
      "bloodLoss": 0.34,
      "operativeTime": 0.29,
      "hospitalStay": 0.34,
      "complicationRate": 0.32,
      "decompressionQuality": 0.6,
      "recoverySignal": 0.6,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 68.21,
      "stayScore": 71.71,
      "safetyScore": 70.4,
      "recoveryScore": 55.24,
      "openPenalty": 22.44,
      "confidence": 41.6,
      "oseContribution": 71.49,
      "openContribution": 55.55,
      "overall": 72.62
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 46.51,
      "stayScore": 48.37,
      "safetyScore": 39.48,
      "recoveryScore": 34.52,
      "openPenalty": 7.07,
      "confidence": 40.2,
      "oseContribution": 52.36,
      "openContribution": 43.05,
      "overall": 39.22
    }
  },
  {
    "id": "se-017",
    "input": {
      "bloodLoss": 0.35,
      "operativeTime": 0.3,
      "hospitalStay": 0.35,
      "complicationRate": 0.33,
      "decompressionQuality": 0.64,
      "recoverySignal": 0.64,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "approachBias": "stay_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 76.7,
      "stayScore": 84.24,
      "safetyScore": 41.77,
      "recoveryScore": 57.96,
      "openPenalty": 22.91,
      "confidence": 41.9,
      "oseContribution": 71.5,
      "openContribution": 54.45,
      "overall": 72.43
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 47.16,
      "stayScore": 59.42,
      "safetyScore": 40.19,
      "recoveryScore": 44.19,
      "openPenalty": 6.25,
      "confidence": 40.73,
      "oseContribution": 56.94,
      "openContribution": 48.04,
      "overall": 44.12
    }
  },
  {
    "id": "se-018",
    "input": {
      "bloodLoss": 0.3,
      "operativeTime": 0.3,
      "hospitalStay": 0.3,
      "complicationRate": 0.27,
      "decompressionQuality": 0.68,
      "recoverySignal": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "approachBias": "open_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 34.18,
      "stayScore": 49.26,
      "safetyScore": 45.08,
      "recoveryScore": 62.57,
      "openPenalty": 45.15,
      "confidence": 46.6,
      "oseContribution": 45.12,
      "openContribution": 38.95,
      "overall": 45.01
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 50.56,
      "stayScore": 63.78,
      "safetyScore": 43.04,
      "recoveryScore": 46.34,
      "openPenalty": 4.13,
      "confidence": 45.45,
      "oseContribution": 59.92,
      "openContribution": 51.75,
      "overall": 47.73
    }
  },
  {
    "id": "se-019",
    "input": {
      "bloodLoss": 0.3,
      "operativeTime": 0.31,
      "hospitalStay": 0.3,
      "complicationRate": 0.28,
      "decompressionQuality": 0.72,
      "recoverySignal": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 76.33,
      "stayScore": 75.25,
      "safetyScore": 78.34,
      "recoveryScore": 65.49,
      "openPenalty": 20.56,
      "confidence": 47.4,
      "oseContribution": 76.99,
      "openContribution": 62.85,
      "overall": 78.44
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 52.48,
      "stayScore": 54.95,
      "safetyScore": 43.6,
      "recoveryScore": 40.93,
      "openPenalty": 3.15,
      "confidence": 46.48,
      "oseContribution": 57.76,
      "openContribution": 49.5,
      "overall": 45.44
    }
  },
  {
    "id": "se-020",
    "input": {
      "bloodLoss": 0.31,
      "operativeTime": 0.24,
      "hospitalStay": 0.31,
      "complicationRate": 0.29,
      "decompressionQuality": 0.68,
      "recoverySignal": 0.68,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "approachBias": "blood_loss_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 81.74,
      "stayScore": 58.45,
      "safetyScore": 100,
      "recoveryScore": 62.17,
      "openPenalty": 21.03,
      "confidence": 45.7,
      "oseContribution": 77.81,
      "openContribution": 68.91,
      "overall": 80.21
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 38.11,
      "stayScore": 39.66,
      "safetyScore": 42.32,
      "recoveryScore": 28.84,
      "openPenalty": 4,
      "confidence": 44.61,
      "oseContribution": 48.99,
      "openContribution": 35.29,
      "overall": 32.42
    }
  },
  {
    "id": "se-021",
    "input": {
      "bloodLoss": 0.25,
      "operativeTime": 0.25,
      "hospitalStay": 0.25,
      "complicationRate": 0.24,
      "decompressionQuality": 0.72,
      "recoverySignal": 0.72,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "approachBias": "balanced",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 79.69,
      "stayScore": 79.55,
      "safetyScore": 80.9,
      "recoveryScore": 66.89,
      "openPenalty": 18.26,
      "confidence": 50.7,
      "oseContribution": 80.28,
      "openContribution": 64.59,
      "overall": 81.46
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 54.17,
      "stayScore": 56.43,
      "safetyScore": 44.58,
      "recoveryScore": 40.33,
      "openPenalty": 1.82,
      "confidence": 49.66,
      "oseContribution": 58.74,
      "openContribution": 50.96,
      "overall": 46.73
    }
  },
  {
    "id": "se-022",
    "input": {
      "bloodLoss": 0.26,
      "operativeTime": 0.26,
      "hospitalStay": 0.26,
      "complicationRate": 0.25,
      "decompressionQuality": 0.76,
      "recoverySignal": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "approachBias": "stay_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 89.46,
      "stayScore": 93.84,
      "safetyScore": 47.83,
      "recoveryScore": 69.6,
      "openPenalty": 18.73,
      "confidence": 51,
      "oseContribution": 80.23,
      "openContribution": 63.18,
      "overall": 81.16
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 54.82,
      "stayScore": 69.3,
      "safetyScore": 45.3,
      "recoveryScore": 51.36,
      "openPenalty": 1,
      "confidence": 50.19,
      "oseContribution": 63.96,
      "openContribution": 56.68,
      "overall": 52.34
    }
  },
  {
    "id": "se-023",
    "input": {
      "bloodLoss": 0.27,
      "operativeTime": 0.26,
      "hospitalStay": 0.27,
      "complicationRate": 0.25,
      "decompressionQuality": 0.8,
      "recoverySignal": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "approachBias": "open_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 38.53,
      "stayScore": 52.98,
      "safetyScore": 48.81,
      "recoveryScore": 72.42,
      "openPenalty": 43.79,
      "confidence": 51.5,
      "oseContribution": 48.6,
      "openContribution": 43.74,
      "overall": 48.73
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 56.07,
      "stayScore": 71.56,
      "safetyScore": 46.45,
      "recoveryScore": 54.23,
      "openPenalty": 0.08,
      "confidence": 50.89,
      "oseContribution": 65.65,
      "openContribution": 58.46,
      "overall": 54.16
    }
  },
  {
    "id": "se-024",
    "input": {
      "bloodLoss": 0.21,
      "operativeTime": 0.19,
      "hospitalStay": 0.21,
      "complicationRate": 0.2,
      "decompressionQuality": 0.76,
      "recoverySignal": 0.76,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "approachBias": "balanced",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 84.23,
      "stayScore": 83.89,
      "safetyScore": 85.25,
      "recoveryScore": 71.1,
      "openPenalty": 16.38,
      "confidence": 54.5,
      "oseContribution": 84.24,
      "openContribution": 68.05,
      "overall": 85.33
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 57.11,
      "stayScore": 59.56,
      "safetyScore": 46.71,
      "recoveryScore": 42.14,
      "openPenalty": 0,
      "confidence": 53.54,
      "oseContribution": 61.1,
      "openContribution": 53.96,
      "overall": 49.59
    }
  },
  {
    "id": "se-025",
    "input": {
      "bloodLoss": 0.22,
      "operativeTime": 0.2,
      "hospitalStay": 0.22,
      "complicationRate": 0.21,
      "decompressionQuality": 0.8,
      "recoverySignal": 0.8,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "approachBias": "blood_loss_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 94.51,
      "stayScore": 64.02,
      "safetyScore": 100,
      "recoveryScore": 73.82,
      "openPenalty": 16.85,
      "confidence": 54.8,
      "oseContribution": 83.92,
      "openContribution": 76.43,
      "overall": 86.57
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 45.76,
      "stayScore": 45.38,
      "safetyScore": 47.43,
      "recoveryScore": 32.9,
      "openPenalty": 0,
      "confidence": 54.07,
      "oseContribution": 54.29,
      "openContribution": 42.27,
      "overall": 38.97
    }
  },
  {
    "id": "se-026",
    "input": {
      "bloodLoss": 0.23,
      "operativeTime": 0.21,
      "hospitalStay": 0.23,
      "complicationRate": 0.22,
      "decompressionQuality": 0.83,
      "recoverySignal": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 85.99,
      "stayScore": 83.32,
      "safetyScore": 87.1,
      "recoveryScore": 75.78,
      "openPenalty": 17.32,
      "confidence": 54.85,
      "oseContribution": 84.78,
      "openContribution": 70.63,
      "overall": 86.23
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 59.04,
      "stayScore": 61.88,
      "safetyScore": 47.9,
      "recoveryScore": 46.4,
      "openPenalty": 0,
      "confidence": 54.3,
      "oseContribution": 63.04,
      "openContribution": 56.34,
      "overall": 51.87
    }
  },
  {
    "id": "se-027",
    "input": {
      "bloodLoss": 0.17,
      "operativeTime": 0.22,
      "hospitalStay": 0.17,
      "complicationRate": 0.17,
      "decompressionQuality": 0.87,
      "recoverySignal": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "approachBias": "stay_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 100,
      "stayScore": 100,
      "safetyScore": 53.64,
      "recoveryScore": 80.5,
      "openPenalty": 14.55,
      "confidence": 59.85,
      "oseContribution": 87.18,
      "openContribution": 70.67,
      "overall": 88.21
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 62.1,
      "stayScore": 78.59,
      "safetyScore": 50.16,
      "recoveryScore": 57.84,
      "openPenalty": 0,
      "confidence": 59.35,
      "oseContribution": 69.74,
      "openContribution": 64.83,
      "overall": 59.91
    }
  },
  {
    "id": "se-028",
    "input": {
      "bloodLoss": 0.18,
      "operativeTime": 0.14,
      "hospitalStay": 0.18,
      "complicationRate": 0.17,
      "decompressionQuality": 0.83,
      "recoverySignal": 0.83,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "approachBias": "open_first",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 43.08,
      "stayScore": 59.21,
      "safetyScore": 52.66,
      "recoveryScore": 77.28,
      "openPenalty": 39.61,
      "confidence": 58.35,
      "oseContribution": 53.47,
      "openContribution": 46.64,
      "overall": 53.24
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 60.33,
      "stayScore": 76.18,
      "safetyScore": 49.31,
      "recoveryScore": 55.21,
      "openPenalty": 0,
      "confidence": 57.65,
      "oseContribution": 68.21,
      "openContribution": 62.68,
      "overall": 57.96
    }
  },
  {
    "id": "se-029",
    "input": {
      "bloodLoss": 0.18,
      "operativeTime": 0.15,
      "hospitalStay": 0.18,
      "complicationRate": 0.18,
      "decompressionQuality": 0.87,
      "recoverySignal": 0.87,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "approachBias": "balanced",
      "profile": "one_hole_split_endoscopy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 91.14,
      "stayScore": 88.22,
      "safetyScore": 91.46,
      "recoveryScore": 80.2,
      "openPenalty": 15.02,
      "confidence": 59.15,
      "oseContribution": 89.17,
      "openContribution": 74.3,
      "overall": 90.49
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 62.24,
      "stayScore": 65.08,
      "safetyScore": 49.87,
      "recoveryScore": 48.1,
      "openPenalty": 0,
      "confidence": 58.68,
      "oseContribution": 65.06,
      "openContribution": 59.52,
      "overall": 54.74
    }
  },
  {
    "id": "se-030",
    "input": {
      "bloodLoss": 0.13,
      "operativeTime": 0.16,
      "hospitalStay": 0.13,
      "complicationRate": 0.13,
      "decompressionQuality": 0.91,
      "recoverySignal": 0.91,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "approachBias": "blood_loss_first",
      "profile": "open_laminectomy"
    },
    "expectedOse": {
      "mode": "one_hole_split_endoscopy",
      "bloodLossScore": 100,
      "stayScore": 69.45,
      "safetyScore": 100,
      "recoveryScore": 84.71,
      "openPenalty": 12.67,
      "confidence": 63.65,
      "oseContribution": 87.94,
      "openContribution": 80.48,
      "overall": 90.6
    },
    "expectedOpenLam": {
      "mode": "open_laminectomy",
      "bloodLossScore": 53.04,
      "stayScore": 50.87,
      "safetyScore": 52.28,
      "recoveryScore": 36.53,
      "openPenalty": 0,
      "confidence": 63.23,
      "oseContribution": 58.54,
      "openContribution": 48.9,
      "overall": 45.02
    }
  }
];
