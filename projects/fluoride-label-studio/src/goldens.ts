import type { FluorideInput, FluorideQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FluorideInput;
  expectedExchange: FluorideQuality;
  expectedProsthetic: FluorideQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "fl-001",
    "input": {
      "exchangeRate": 0.29,
      "precursorPurity": 0.25,
      "leavingGroupEase": 0.28,
      "amineAvailability": 0.34,
      "prostheticStepBurden": 0.39,
      "solventHarshness": 0.59,
      "activationBarrier": 0.45,
      "overclaimRisk": 0.5,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 24.3,
      "purityScore": 30.49,
      "leavingScore": 25.14,
      "amineScore": 38.04,
      "prostheticScore": 16.4,
      "confidence": 17.35,
      "exchangeContribution": 29.17,
      "prostheticContribution": 16.92,
      "overall": 30.97
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 5.76,
      "purityScore": 18.29,
      "leavingScore": 14.57,
      "amineScore": 32.39,
      "prostheticScore": 40.93,
      "confidence": 17.1,
      "exchangeContribution": 22.39,
      "prostheticContribution": 39.24,
      "overall": 27.81
    }
  },
  {
    "id": "fl-002",
    "input": {
      "exchangeRate": 0.33,
      "precursorPurity": 0.29,
      "leavingGroupEase": 0.32,
      "amineAvailability": 0.38,
      "prostheticStepBurden": 0.43,
      "solventHarshness": 0.6,
      "activationBarrier": 0.46,
      "overclaimRisk": 0.51,
      "labelBias": "speed_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 30.35,
      "purityScore": 34.02,
      "leavingScore": 19.28,
      "amineScore": 49.33,
      "prostheticScore": 18.89,
      "confidence": 20.15,
      "exchangeContribution": 32.38,
      "prostheticContribution": 19.43,
      "overall": 34.05
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 2.43,
      "purityScore": 19.24,
      "leavingScore": 15.38,
      "amineScore": 34.08,
      "prostheticScore": 31.53,
      "confidence": 18.65,
      "exchangeContribution": 20.53,
      "prostheticContribution": 35.08,
      "overall": 24.02
    }
  },
  {
    "id": "fl-003",
    "input": {
      "exchangeRate": 0.37,
      "precursorPurity": 0.27,
      "leavingGroupEase": 0.36,
      "amineAvailability": 0.42,
      "prostheticStepBurden": 0.46,
      "solventHarshness": 0.6,
      "activationBarrier": 0.42,
      "overclaimRisk": 0.46,
      "labelBias": "prosthetic_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 8.75,
      "purityScore": 23.55,
      "leavingScore": 22.59,
      "amineScore": 20.24,
      "prostheticScore": 19.94,
      "confidence": 21.3,
      "exchangeContribution": 19,
      "prostheticContribution": 20.63,
      "overall": 20.29
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 12.17,
      "purityScore": 18.27,
      "leavingScore": 14.54,
      "amineScore": 33.93,
      "prostheticScore": 54.34,
      "confidence": 18.4,
      "exchangeContribution": 26.65,
      "prostheticContribution": 47.2,
      "overall": 35.12
    }
  },
  {
    "id": "fl-004",
    "input": {
      "exchangeRate": 0.33,
      "precursorPurity": 0.32,
      "leavingGroupEase": 0.39,
      "amineAvailability": 0.38,
      "prostheticStepBurden": 0.42,
      "solventHarshness": 0.53,
      "activationBarrier": 0.43,
      "overclaimRisk": 0.46,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 30.57,
      "purityScore": 36.07,
      "leavingScore": 34.34,
      "amineScore": 42.33,
      "prostheticScore": 18.93,
      "confidence": 22.95,
      "exchangeContribution": 35.64,
      "prostheticContribution": 19.62,
      "overall": 36.76
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 8.7,
      "purityScore": 18.52,
      "leavingScore": 14.59,
      "amineScore": 32.79,
      "prostheticScore": 42.77,
      "confidence": 18.85,
      "exchangeContribution": 23.47,
      "prostheticContribution": 40.6,
      "overall": 29.83
    }
  },
  {
    "id": "fl-005",
    "input": {
      "exchangeRate": 0.37,
      "precursorPurity": 0.36,
      "leavingGroupEase": 0.35,
      "amineAvailability": 0.42,
      "prostheticStepBurden": 0.46,
      "solventHarshness": 0.53,
      "activationBarrier": 0.45,
      "overclaimRisk": 0.47,
      "labelBias": "exchange_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 34.83,
      "purityScore": 39.6,
      "leavingScore": 40.59,
      "amineScore": 35.59,
      "prostheticScore": 21.8,
      "confidence": 23.75,
      "exchangeContribution": 37.85,
      "prostheticContribution": 22.49,
      "overall": 39.09
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 0,
      "purityScore": 19.9,
      "leavingScore": 16.22,
      "amineScore": 34.77,
      "prostheticScore": 32.95,
      "confidence": 21.05,
      "exchangeContribution": 20.77,
      "prostheticContribution": 36.51,
      "overall": 25.99
    }
  },
  {
    "id": "fl-006",
    "input": {
      "exchangeRate": 0.41,
      "precursorPurity": 0.34,
      "leavingGroupEase": 0.39,
      "amineAvailability": 0.45,
      "prostheticStepBurden": 0.5,
      "solventHarshness": 0.54,
      "activationBarrier": 0.4,
      "overclaimRisk": 0.42,
      "labelBias": "balanced",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 35.87,
      "purityScore": 39.1,
      "leavingScore": 36.97,
      "amineScore": 48.55,
      "prostheticScore": 23.08,
      "confidence": 24.75,
      "exchangeContribution": 39.81,
      "prostheticContribution": 23.95,
      "overall": 40.96
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 11.98,
      "purityScore": 18.74,
      "leavingScore": 15.16,
      "amineScore": 34.78,
      "prostheticScore": 46.72,
      "confidence": 20.5,
      "exchangeContribution": 25.48,
      "prostheticContribution": 43.56,
      "overall": 32.74
    }
  },
  {
    "id": "fl-007",
    "input": {
      "exchangeRate": 0.45,
      "precursorPurity": 0.38,
      "leavingGroupEase": 0.42,
      "amineAvailability": 0.49,
      "prostheticStepBurden": 0.53,
      "solventHarshness": 0.55,
      "activationBarrier": 0.42,
      "overclaimRisk": 0.43,
      "labelBias": "speed_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 42.83,
      "purityScore": 42.67,
      "leavingScore": 27.46,
      "amineScore": 61.99,
      "prostheticScore": 25.15,
      "confidence": 27.45,
      "exchangeContribution": 42.7,
      "prostheticContribution": 26,
      "overall": 43.69
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 8.27,
      "purityScore": 19.79,
      "leavingScore": 16.13,
      "amineScore": 36.3,
      "prostheticScore": 34.2,
      "confidence": 22.15,
      "exchangeContribution": 22.94,
      "prostheticContribution": 37.74,
      "overall": 27.5
    }
  },
  {
    "id": "fl-008",
    "input": {
      "exchangeRate": 0.41,
      "precursorPurity": 0.43,
      "leavingGroupEase": 0.46,
      "amineAvailability": 0.45,
      "prostheticStepBurden": 0.49,
      "solventHarshness": 0.47,
      "activationBarrier": 0.43,
      "overclaimRisk": 0.44,
      "labelBias": "prosthetic_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 12.37,
      "purityScore": 35.19,
      "leavingScore": 28.13,
      "amineScore": 24.56,
      "prostheticScore": 24.32,
      "confidence": 29.35,
      "exchangeContribution": 25.4,
      "prostheticContribution": 25.18,
      "overall": 26.36
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 16.4,
      "purityScore": 20.12,
      "leavingScore": 16.24,
      "amineScore": 35.17,
      "prostheticScore": 58.5,
      "confidence": 22.7,
      "exchangeContribution": 29.29,
      "prostheticContribution": 50.92,
      "overall": 39.76
    }
  },
  {
    "id": "fl-009",
    "input": {
      "exchangeRate": 0.46,
      "precursorPurity": 0.41,
      "leavingGroupEase": 0.5,
      "amineAvailability": 0.49,
      "prostheticStepBurden": 0.53,
      "solventHarshness": 0.48,
      "activationBarrier": 0.39,
      "overclaimRisk": 0.38,
      "labelBias": "balanced",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 42.7,
      "purityScore": 44.93,
      "leavingScore": 46.24,
      "amineScore": 53.09,
      "prostheticScore": 25.81,
      "confidence": 30.65,
      "exchangeContribution": 46.56,
      "prostheticContribution": 26.83,
      "overall": 47.01
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 14.91,
      "purityScore": 19.24,
      "leavingScore": 15.49,
      "amineScore": 35.36,
      "prostheticScore": 48.88,
      "confidence": 22.7,
      "exchangeContribution": 26.78,
      "prostheticContribution": 45.36,
      "overall": 35.15
    }
  },
  {
    "id": "fl-010",
    "input": {
      "exchangeRate": 0.5,
      "precursorPurity": 0.45,
      "leavingGroupEase": 0.46,
      "amineAvailability": 0.53,
      "prostheticStepBurden": 0.57,
      "solventHarshness": 0.49,
      "activationBarrier": 0.4,
      "overclaimRisk": 0.39,
      "labelBias": "exchange_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 48.31,
      "purityScore": 48.46,
      "leavingScore": 54.99,
      "amineScore": 43.57,
      "prostheticScore": 28.29,
      "confidence": 31.45,
      "exchangeContribution": 49.18,
      "prostheticContribution": 29.33,
      "overall": 49.61
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 3.59,
      "purityScore": 20.19,
      "leavingScore": 16.71,
      "amineScore": 37.06,
      "prostheticScore": 35.54,
      "confidence": 24.25,
      "exchangeContribution": 22.62,
      "prostheticContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "fl-011",
    "input": {
      "exchangeRate": 0.54,
      "precursorPurity": 0.49,
      "leavingGroupEase": 0.49,
      "amineAvailability": 0.57,
      "prostheticStepBurden": 0.6,
      "solventHarshness": 0.49,
      "activationBarrier": 0.42,
      "overclaimRisk": 0.4,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 46.98,
      "purityScore": 52.03,
      "leavingScore": 47.36,
      "amineScore": 60.77,
      "prostheticScore": 30.54,
      "confidence": 34.15,
      "exchangeContribution": 51.43,
      "prostheticContribution": 31.57,
      "overall": 51.86
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 17.1,
      "purityScore": 21.32,
      "leavingScore": 17.78,
      "amineScore": 38.58,
      "prostheticScore": 54.12,
      "confidence": 26.1,
      "exchangeContribution": 29.78,
      "prostheticContribution": 50.36,
      "overall": 39.51
    }
  },
  {
    "id": "fl-012",
    "input": {
      "exchangeRate": 0.5,
      "precursorPurity": 0.48,
      "leavingGroupEase": 0.53,
      "amineAvailability": 0.53,
      "prostheticStepBurden": 0.56,
      "solventHarshness": 0.42,
      "activationBarrier": 0.37,
      "overclaimRisk": 0.35,
      "labelBias": "speed_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 51.43,
      "purityScore": 50.52,
      "leavingScore": 34.64,
      "amineScore": 67.77,
      "prostheticScore": 28.34,
      "confidence": 34.25,
      "exchangeContribution": 50.09,
      "prostheticContribution": 29.52,
      "overall": 50.39
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 13.23,
      "purityScore": 19.47,
      "leavingScore": 15.91,
      "amineScore": 35.76,
      "prostheticScore": 34.93,
      "confidence": 24.35,
      "exchangeContribution": 23.86,
      "prostheticContribution": 38.04,
      "overall": 29.46
    }
  },
  {
    "id": "fl-013",
    "input": {
      "exchangeRate": 0.54,
      "precursorPurity": 0.52,
      "leavingGroupEase": 0.56,
      "amineAvailability": 0.57,
      "prostheticStepBurden": 0.6,
      "solventHarshness": 0.42,
      "activationBarrier": 0.39,
      "overclaimRisk": 0.36,
      "labelBias": "prosthetic_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 19.48,
      "purityScore": 44.04,
      "leavingScore": 36.6,
      "amineScore": 32.86,
      "prostheticScore": 31.2,
      "confidence": 36.8,
      "exchangeContribution": 33.6,
      "prostheticContribution": 32.39,
      "overall": 34.38
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 22.62,
      "purityScore": 20.85,
      "leavingScore": 17.19,
      "amineScore": 37.74,
      "prostheticScore": 67.02,
      "confidence": 26.55,
      "exchangeContribution": 33.08,
      "prostheticContribution": 57,
      "overall": 46.22
    }
  },
  {
    "id": "fl-014",
    "input": {
      "exchangeRate": 0.58,
      "precursorPurity": 0.56,
      "leavingGroupEase": 0.6,
      "amineAvailability": 0.61,
      "prostheticStepBurden": 0.63,
      "solventHarshness": 0.43,
      "activationBarrier": 0.4,
      "overclaimRisk": 0.36,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 53.26,
      "purityScore": 57.61,
      "leavingScore": 56.56,
      "amineScore": 65.06,
      "prostheticScore": 33.07,
      "confidence": 39.75,
      "exchangeContribution": 57.91,
      "prostheticContribution": 34.27,
      "overall": 57.65
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 20.03,
      "purityScore": 21.54,
      "leavingScore": 17.8,
      "amineScore": 38.98,
      "prostheticScore": 55.96,
      "confidence": 27.85,
      "exchangeContribution": 30.86,
      "prostheticContribution": 51.73,
      "overall": 41.54
    }
  },
  {
    "id": "fl-015",
    "input": {
      "exchangeRate": 0.62,
      "precursorPurity": 0.54,
      "leavingGroupEase": 0.56,
      "amineAvailability": 0.65,
      "prostheticStepBurden": 0.67,
      "solventHarshness": 0.44,
      "activationBarrier": 0.36,
      "overclaimRisk": 0.31,
      "labelBias": "exchange_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 60.79,
      "purityScore": 57.11,
      "leavingScore": 68.51,
      "amineScore": 51.62,
      "prostheticScore": 34.55,
      "confidence": 38.75,
      "exchangeContribution": 59.98,
      "prostheticContribution": 35.9,
      "overall": 59.65
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 9.43,
      "purityScore": 20.74,
      "leavingScore": 17.45,
      "amineScore": 39.27,
      "prostheticScore": 38.2,
      "confidence": 27.75,
      "exchangeContribution": 25.02,
      "prostheticContribution": 41.69,
      "overall": 32.64
    }
  },
  {
    "id": "fl-016",
    "input": {
      "exchangeRate": 0.58,
      "precursorPurity": 0.59,
      "leavingGroupEase": 0.6,
      "amineAvailability": 0.6,
      "prostheticStepBurden": 0.63,
      "solventHarshness": 0.36,
      "activationBarrier": 0.37,
      "overclaimRisk": 0.32,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 54.11,
      "purityScore": 59.63,
      "leavingScore": 57.48,
      "amineScore": 64.95,
      "prostheticScore": 33.73,
      "confidence": 40.65,
      "exchangeContribution": 58.87,
      "prostheticContribution": 35.09,
      "overall": 58.59
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 22.05,
      "purityScore": 21.07,
      "leavingScore": 17.56,
      "amineScore": 38.14,
      "prostheticScore": 55.7,
      "confidence": 28.3,
      "exchangeContribution": 30.9,
      "prostheticContribution": 51.12,
      "overall": 41.87
    }
  },
  {
    "id": "fl-017",
    "input": {
      "exchangeRate": 0.62,
      "precursorPurity": 0.63,
      "leavingGroupEase": 0.63,
      "amineAvailability": 0.64,
      "prostheticStepBurden": 0.67,
      "solventHarshness": 0.37,
      "activationBarrier": 0.39,
      "overclaimRisk": 0.33,
      "labelBias": "speed_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 63.14,
      "purityScore": 63.16,
      "leavingScore": 41.83,
      "amineScore": 81.33,
      "prostheticScore": 36.41,
      "confidence": 43.2,
      "exchangeContribution": 61.18,
      "prostheticContribution": 37.77,
      "overall": 60.97
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 18.73,
      "purityScore": 22.37,
      "leavingScore": 18.73,
      "amineScore": 40.11,
      "prostheticScore": 39.86,
      "confidence": 30.3,
      "exchangeContribution": 27.96,
      "prostheticContribution": 43.68,
      "overall": 35.28
    }
  },
  {
    "id": "fl-018",
    "input": {
      "exchangeRate": 0.66,
      "precursorPurity": 0.61,
      "leavingGroupEase": 0.67,
      "amineAvailability": 0.68,
      "prostheticStepBurden": 0.7,
      "solventHarshness": 0.38,
      "activationBarrier": 0.34,
      "overclaimRisk": 0.27,
      "labelBias": "prosthetic_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 26.45,
      "purityScore": 52.69,
      "leavingScore": 45.25,
      "amineScore": 40.59,
      "prostheticScore": 37.08,
      "confidence": 44.35,
      "exchangeContribution": 41.65,
      "prostheticContribution": 38.6,
      "overall": 42.1
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 28.36,
      "purityScore": 20.97,
      "leavingScore": 17.48,
      "amineScore": 39.67,
      "prostheticScore": 74.27,
      "confidence": 29.5,
      "exchangeContribution": 36.15,
      "prostheticContribution": 61.88,
      "overall": 51.56
    }
  },
  {
    "id": "fl-019",
    "input": {
      "exchangeRate": 0.7,
      "precursorPurity": 0.65,
      "leavingGroupEase": 0.7,
      "amineAvailability": 0.72,
      "prostheticStepBurden": 0.74,
      "solventHarshness": 0.38,
      "activationBarrier": 0.36,
      "overclaimRisk": 0.28,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 64.48,
      "purityScore": 66.22,
      "leavingScore": 67.67,
      "amineScore": 75.57,
      "prostheticScore": 39.94,
      "confidence": 46.9,
      "exchangeContribution": 68.27,
      "prostheticContribution": 41.47,
      "overall": 67.45
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 26.25,
      "purityScore": 22.35,
      "leavingScore": 18.75,
      "amineScore": 41.65,
      "prostheticScore": 62.07,
      "confidence": 31.7,
      "exchangeContribution": 34.21,
      "prostheticContribution": 56.48,
      "overall": 46.86
    }
  },
  {
    "id": "fl-020",
    "input": {
      "exchangeRate": 0.66,
      "precursorPurity": 0.7,
      "leavingGroupEase": 0.66,
      "amineAvailability": 0.68,
      "prostheticStepBurden": 0.7,
      "solventHarshness": 0.31,
      "activationBarrier": 0.37,
      "overclaimRisk": 0.29,
      "labelBias": "exchange_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 67.62,
      "purityScore": 68.74,
      "leavingScore": 79.25,
      "amineScore": 55.94,
      "prostheticScore": 38.94,
      "confidence": 46.8,
      "exchangeContribution": 68.6,
      "prostheticContribution": 40.47,
      "overall": 67.54
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 13.66,
      "purityScore": 22.59,
      "leavingScore": 19.15,
      "amineScore": 40.51,
      "prostheticScore": 40.86,
      "confidence": 32.05,
      "exchangeContribution": 27.35,
      "prostheticContribution": 44.58,
      "overall": 36.57
    }
  },
  {
    "id": "fl-021",
    "input": {
      "exchangeRate": 0.7,
      "precursorPurity": 0.68,
      "leavingGroupEase": 0.7,
      "amineAvailability": 0.72,
      "prostheticStepBurden": 0.73,
      "solventHarshness": 0.31,
      "activationBarrier": 0.33,
      "overclaimRisk": 0.24,
      "labelBias": "balanced",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 65.34,
      "purityScore": 68.28,
      "leavingScore": 68.73,
      "amineScore": 76.02,
      "prostheticScore": 39.99,
      "confidence": 47.95,
      "exchangeContribution": 69.4,
      "prostheticContribution": 41.67,
      "overall": 68.41
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 27.89,
      "purityScore": 21.63,
      "leavingScore": 18.31,
      "amineScore": 40.35,
      "prostheticScore": 61.19,
      "confidence": 31.8,
      "exchangeContribution": 33.87,
      "prostheticContribution": 55.34,
      "overall": 46.7
    }
  },
  {
    "id": "fl-022",
    "input": {
      "exchangeRate": 0.74,
      "precursorPurity": 0.72,
      "leavingGroupEase": 0.73,
      "amineAvailability": 0.76,
      "prostheticStepBurden": 0.77,
      "solventHarshness": 0.32,
      "activationBarrier": 0.34,
      "overclaimRisk": 0.25,
      "labelBias": "speed_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 75.69,
      "purityScore": 71.8,
      "leavingScore": 50.23,
      "amineScore": 94.76,
      "prostheticScore": 42.47,
      "confidence": 50.5,
      "exchangeContribution": 71.75,
      "prostheticContribution": 44.17,
      "overall": 70.79
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 24.57,
      "purityScore": 22.57,
      "leavingScore": 19.17,
      "amineScore": 42.05,
      "prostheticScore": 42.21,
      "confidence": 33.35,
      "exchangeContribution": 30.11,
      "prostheticContribution": 45.91,
      "overall": 38.37
    }
  },
  {
    "id": "fl-023",
    "input": {
      "exchangeRate": 0.79,
      "precursorPurity": 0.76,
      "leavingGroupEase": 0.77,
      "amineAvailability": 0.8,
      "prostheticStepBurden": 0.81,
      "solventHarshness": 0.33,
      "activationBarrier": 0.36,
      "overclaimRisk": 0.25,
      "labelBias": "prosthetic_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 32.98,
      "purityScore": 65.58,
      "leavingScore": 52.72,
      "amineScore": 49.79,
      "prostheticScore": 45.16,
      "confidence": 53.6,
      "exchangeContribution": 50.68,
      "prostheticContribution": 46.86,
      "overall": 50.99
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 33.86,
      "purityScore": 23.79,
      "leavingScore": 20.29,
      "amineScore": 43.92,
      "prostheticScore": 84.72,
      "confidence": 35.45,
      "exchangeContribution": 41.32,
      "prostheticContribution": 70.56,
      "overall": 59.99
    }
  },
  {
    "id": "fl-024",
    "input": {
      "exchangeRate": 0.75,
      "precursorPurity": 0.75,
      "leavingGroupEase": 0.81,
      "amineAvailability": 0.76,
      "prostheticStepBurden": 0.77,
      "solventHarshness": 0.25,
      "activationBarrier": 0.31,
      "overclaimRisk": 0.2,
      "labelBias": "balanced",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 72.23,
      "purityScore": 74.07,
      "leavingScore": 78.06,
      "amineScore": 80.56,
      "prostheticScore": 43.13,
      "confidence": 53.7,
      "exchangeContribution": 76.17,
      "prostheticContribution": 45,
      "overall": 74.56
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 31.21,
      "purityScore": 22.02,
      "leavingScore": 18.53,
      "amineScore": 41.11,
      "prostheticScore": 63.65,
      "confidence": 33.9,
      "exchangeContribution": 35.3,
      "prostheticContribution": 57.24,
      "overall": 49.21
    }
  },
  {
    "id": "fl-025",
    "input": {
      "exchangeRate": 0.79,
      "precursorPurity": 0.79,
      "leavingGroupEase": 0.77,
      "amineAvailability": 0.8,
      "prostheticStepBurden": 0.8,
      "solventHarshness": 0.26,
      "activationBarrier": 0.33,
      "overclaimRisk": 0.21,
      "labelBias": "exchange_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 81.1,
      "purityScore": 77.64,
      "leavingScore": 93.79,
      "amineScore": 64.24,
      "prostheticScore": 45.2,
      "confidence": 54.65,
      "exchangeContribution": 80.04,
      "prostheticContribution": 47.05,
      "overall": 78.1
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 19.5,
      "purityScore": 23.07,
      "leavingScore": 19.85,
      "amineScore": 42.63,
      "prostheticScore": 43.52,
      "confidence": 35.55,
      "exchangeContribution": 29.71,
      "prostheticContribution": 47.24,
      "overall": 40.04
    }
  },
  {
    "id": "fl-026",
    "input": {
      "exchangeRate": 0.83,
      "precursorPurity": 0.83,
      "leavingGroupEase": 0.8,
      "amineAvailability": 0.83,
      "prostheticStepBurden": 0.84,
      "solventHarshness": 0.27,
      "activationBarrier": 0.34,
      "overclaimRisk": 0.22,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 76.45,
      "purityScore": 81.17,
      "leavingScore": 78.98,
      "amineScore": 87.68,
      "prostheticScore": 47.68,
      "confidence": 57.2,
      "exchangeContribution": 80.86,
      "prostheticContribution": 49.55,
      "overall": 79.22
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 33.17,
      "purityScore": 24.02,
      "leavingScore": 20.71,
      "amineScore": 44.32,
      "prostheticScore": 68.8,
      "confidence": 37.1,
      "exchangeContribution": 38.2,
      "prostheticContribution": 62.16,
      "overall": 53.41
    }
  },
  {
    "id": "fl-027",
    "input": {
      "exchangeRate": 0.87,
      "precursorPurity": 0.81,
      "leavingGroupEase": 0.84,
      "amineAvailability": 0.87,
      "prostheticStepBurden": 0.88,
      "solventHarshness": 0.27,
      "activationBarrier": 0.3,
      "overclaimRisk": 0.17,
      "labelBias": "speed_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 89.17,
      "purityScore": 80.66,
      "leavingScore": 58.91,
      "amineScore": 100,
      "prostheticScore": 49.35,
      "confidence": 58.2,
      "exchangeContribution": 80.87,
      "prostheticContribution": 51.38,
      "overall": 79.56
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 30.78,
      "purityScore": 23.3,
      "leavingScore": 20.07,
      "amineScore": 44.62,
      "prostheticScore": 45.22,
      "confidence": 37.2,
      "exchangeContribution": 32.8,
      "prostheticContribution": 48.96,
      "overall": 42.22
    }
  },
  {
    "id": "fl-028",
    "input": {
      "exchangeRate": 0.83,
      "precursorPurity": 0.86,
      "leavingGroupEase": 0.87,
      "amineAvailability": 0.83,
      "prostheticStepBurden": 0.84,
      "solventHarshness": 0.2,
      "activationBarrier": 0.31,
      "overclaimRisk": 0.17,
      "labelBias": "prosthetic_first",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 37.18,
      "purityScore": 73.18,
      "leavingScore": 59.26,
      "amineScore": 53.21,
      "prostheticScore": 48.34,
      "confidence": 59.85,
      "exchangeContribution": 56.25,
      "prostheticContribution": 50.37,
      "overall": 56.19
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 38.81,
      "purityScore": 23.54,
      "leavingScore": 20.12,
      "amineScore": 43.48,
      "prostheticScore": 86.95,
      "confidence": 37.65,
      "exchangeContribution": 42.58,
      "prostheticContribution": 71.68,
      "overall": 62.66
    }
  },
  {
    "id": "fl-029",
    "input": {
      "exchangeRate": 0.87,
      "precursorPurity": 0.9,
      "leavingGroupEase": 0.91,
      "amineAvailability": 0.87,
      "prostheticStepBurden": 0.87,
      "solventHarshness": 0.2,
      "activationBarrier": 0.33,
      "overclaimRisk": 0.18,
      "labelBias": "balanced",
      "profile": "fast_isotopic_exchange"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 82.73,
      "purityScore": 86.75,
      "leavingScore": 88.18,
      "amineScore": 91.97,
      "prostheticScore": 50.59,
      "confidence": 62.8,
      "exchangeContribution": 87.33,
      "prostheticContribution": 52.61,
      "overall": 85.08
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 36.33,
      "purityScore": 24.67,
      "leavingScore": 21.15,
      "amineScore": 45,
      "prostheticScore": 71.06,
      "confidence": 39.5,
      "exchangeContribution": 39.64,
      "prostheticContribution": 64.05,
      "overall": 56
    }
  },
  {
    "id": "fl-030",
    "input": {
      "exchangeRate": 0.91,
      "precursorPurity": 0.88,
      "leavingGroupEase": 0.87,
      "amineAvailability": 0.91,
      "prostheticStepBurden": 0.91,
      "solventHarshness": 0.21,
      "activationBarrier": 0.28,
      "overclaimRisk": 0.13,
      "labelBias": "exchange_first",
      "profile": "multistep_prosthetic_baseline"
    },
    "expectedExchange": {
      "mode": "fast_isotopic_exchange",
      "exchangeScore": 93.65,
      "purityScore": 86.25,
      "leavingScore": 100,
      "amineScore": 71.98,
      "prostheticScore": 51.88,
      "confidence": 61.8,
      "exchangeContribution": 88.74,
      "prostheticContribution": 54.08,
      "overall": 86.5
    },
    "expectedProsthetic": {
      "mode": "multistep_prosthetic_baseline",
      "exchangeScore": 25.72,
      "purityScore": 23.52,
      "leavingScore": 20.49,
      "amineScore": 45.02,
      "prostheticScore": 46.21,
      "confidence": 38.95,
      "exchangeContribution": 32.19,
      "prostheticContribution": 49.86,
      "overall": 43.51
    }
  }
];
