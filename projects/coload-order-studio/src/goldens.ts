import type { ColoadInput, ColoadQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ColoadInput;
  expectedOrdered: ColoadQuality;
  expectedSimultaneous: ColoadQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "co-001",
    "input": {
      "orderFidelity": 0.29,
      "chemoEncapsulation": 0.34,
      "photoEncapsulation": 0.25,
      "poreFillUniformity": 0.34,
      "photothermalResponse": 0.3,
      "burstLeakRisk": 0.45,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 37.51,
      "chemoScore": 36.19,
      "photoScore": 37.04,
      "leakPenalty": 31.28,
      "synergyScore": 21.52,
      "confidence": 15.7,
      "orderedContribution": 42.65,
      "simultaneousContribution": 28.21,
      "overall": 44.05
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 11.52,
      "chemoScore": 35.68,
      "photoScore": 13.76,
      "leakPenalty": 17.92,
      "synergyScore": 28.1,
      "confidence": 15.03,
      "orderedContribution": 34.23,
      "simultaneousContribution": 26.73,
      "overall": 23.64
    }
  },
  {
    "id": "co-002",
    "input": {
      "orderFidelity": 0.33,
      "chemoEncapsulation": 0.38,
      "photoEncapsulation": 0.29,
      "poreFillUniformity": 0.38,
      "photothermalResponse": 0.34,
      "burstLeakRisk": 0.46,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "loadBias": "photo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 45.63,
      "chemoScore": 29.12,
      "photoScore": 52.46,
      "leakPenalty": 31.62,
      "synergyScore": 25.02,
      "confidence": 18.7,
      "orderedContribution": 46.74,
      "simultaneousContribution": 31.26,
      "overall": 47.95
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 7.91,
      "chemoScore": 28.73,
      "photoScore": 16.2,
      "leakPenalty": 18.99,
      "synergyScore": 22.4,
      "confidence": 17.48,
      "orderedContribution": 31.25,
      "simultaneousContribution": 22.13,
      "overall": 19.1
    }
  },
  {
    "id": "co-003",
    "input": {
      "orderFidelity": 0.37,
      "chemoEncapsulation": 0.42,
      "photoEncapsulation": 0.27,
      "poreFillUniformity": 0.41,
      "photothermalResponse": 0.32,
      "burstLeakRisk": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "loadBias": "simultaneous_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 16.77,
      "chemoScore": 23.48,
      "photoScore": 23.72,
      "leakPenalty": 28.43,
      "synergyScore": 24.89,
      "confidence": 22.65,
      "orderedContribution": 30.18,
      "simultaneousContribution": 21.82,
      "overall": 29.68
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 16.22,
      "chemoScore": 44.18,
      "photoScore": 15.68,
      "leakPenalty": 17.15,
      "synergyScore": 36.03,
      "confidence": 19.78,
      "orderedContribution": 38.99,
      "simultaneousContribution": 33.33,
      "overall": 29.6
    }
  },
  {
    "id": "co-004",
    "input": {
      "orderFidelity": 0.33,
      "chemoEncapsulation": 0.38,
      "photoEncapsulation": 0.31,
      "poreFillUniformity": 0.37,
      "photothermalResponse": 0.36,
      "burstLeakRisk": 0.43,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 41.32,
      "chemoScore": 39.66,
      "photoScore": 42.51,
      "leakPenalty": 30.05,
      "synergyScore": 26.78,
      "confidence": 19.45,
      "orderedContribution": 46.29,
      "simultaneousContribution": 31.78,
      "overall": 47.68
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 13.44,
      "chemoScore": 36.41,
      "photoScore": 18.12,
      "leakPenalty": 18.02,
      "synergyScore": 31.74,
      "confidence": 18.58,
      "orderedContribution": 36.34,
      "simultaneousContribution": 29.52,
      "overall": 26.28
    }
  },
  {
    "id": "co-005",
    "input": {
      "orderFidelity": 0.37,
      "chemoEncapsulation": 0.42,
      "photoEncapsulation": 0.35,
      "poreFillUniformity": 0.41,
      "photothermalResponse": 0.4,
      "burstLeakRisk": 0.45,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "loadBias": "chemo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 49.86,
      "chemoScore": 52.18,
      "photoScore": 26.72,
      "leakPenalty": 31,
      "synergyScore": 30.16,
      "confidence": 22.45,
      "orderedContribution": 48.4,
      "simultaneousContribution": 31.97,
      "overall": 49.44
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 1.83,
      "chemoScore": 28.65,
      "photoScore": 20.36,
      "leakPenalty": 19.52,
      "synergyScore": 24.58,
      "confidence": 21.03,
      "orderedContribution": 31.18,
      "simultaneousContribution": 23.87,
      "overall": 20.44
    }
  },
  {
    "id": "co-006",
    "input": {
      "orderFidelity": 0.41,
      "chemoEncapsulation": 0.45,
      "photoEncapsulation": 0.32,
      "poreFillUniformity": 0.45,
      "photothermalResponse": 0.37,
      "burstLeakRisk": 0.4,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "loadBias": "balanced",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 49.58,
      "chemoScore": 45.97,
      "photoScore": 44.29,
      "leakPenalty": 26.92,
      "synergyScore": 29.25,
      "confidence": 26.4,
      "orderedContribution": 51.53,
      "simultaneousContribution": 33.56,
      "overall": 52.3
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 14.21,
      "chemoScore": 37.86,
      "photoScore": 19.38,
      "leakPenalty": 16.93,
      "synergyScore": 32.88,
      "confidence": 22.68,
      "orderedContribution": 37.48,
      "simultaneousContribution": 30.55,
      "overall": 27.09
    }
  },
  {
    "id": "co-007",
    "input": {
      "orderFidelity": 0.45,
      "chemoEncapsulation": 0.49,
      "photoEncapsulation": 0.36,
      "poreFillUniformity": 0.48,
      "photothermalResponse": 0.41,
      "burstLeakRisk": 0.42,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "loadBias": "photo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 58.75,
      "chemoScore": 35.85,
      "photoScore": 61.71,
      "leakPenalty": 27.97,
      "synergyScore": 32.62,
      "confidence": 29.15,
      "orderedContribution": 55.44,
      "simultaneousContribution": 36.4,
      "overall": 56.01
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 10.6,
      "chemoScore": 28.66,
      "photoScore": 21.62,
      "leakPenalty": 18.49,
      "synergyScore": 25.48,
      "confidence": 25.13,
      "orderedContribution": 33.57,
      "simultaneousContribution": 24.41,
      "overall": 21.15
    }
  },
  {
    "id": "co-008",
    "input": {
      "orderFidelity": 0.41,
      "chemoEncapsulation": 0.45,
      "photoEncapsulation": 0.4,
      "poreFillUniformity": 0.44,
      "photothermalResponse": 0.45,
      "burstLeakRisk": 0.43,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "loadBias": "simultaneous_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 18.74,
      "chemoScore": 25.5,
      "photoScore": 29.37,
      "leakPenalty": 29.59,
      "synergyScore": 34.52,
      "confidence": 25.75,
      "orderedContribution": 32.48,
      "simultaneousContribution": 26.96,
      "overall": 32.49
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 19.2,
      "chemoScore": 44.72,
      "photoScore": 24.07,
      "leakPenalty": 19.36,
      "synergyScore": 45.71,
      "confidence": 23.78,
      "orderedContribution": 42.87,
      "simultaneousContribution": 40.04,
      "overall": 35.56
    }
  },
  {
    "id": "co-009",
    "input": {
      "orderFidelity": 0.46,
      "chemoEncapsulation": 0.49,
      "photoEncapsulation": 0.38,
      "poreFillUniformity": 0.48,
      "photothermalResponse": 0.43,
      "burstLeakRisk": 0.39,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "loadBias": "balanced",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 54.01,
      "chemoScore": 49.68,
      "photoScore": 49.54,
      "leakPenalty": 26.15,
      "synergyScore": 34.39,
      "confidence": 30.45,
      "orderedContribution": 55.3,
      "simultaneousContribution": 37.08,
      "overall": 56.02
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 15.95,
      "chemoScore": 38.41,
      "photoScore": 23.55,
      "leakPenalty": 17.41,
      "synergyScore": 36.42,
      "confidence": 26.23,
      "orderedContribution": 39.38,
      "simultaneousContribution": 33.19,
      "overall": 29.51
    }
  },
  {
    "id": "co-010",
    "input": {
      "orderFidelity": 0.5,
      "chemoEncapsulation": 0.53,
      "photoEncapsulation": 0.42,
      "poreFillUniformity": 0.52,
      "photothermalResponse": 0.47,
      "burstLeakRisk": 0.4,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "loadBias": "chemo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 63.98,
      "chemoScore": 64.57,
      "photoScore": 31,
      "leakPenalty": 26.49,
      "synergyScore": 37.89,
      "confidence": 33.45,
      "orderedContribution": 57.95,
      "simultaneousContribution": 37.13,
      "overall": 58.2
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 4.34,
      "chemoScore": 28.4,
      "photoScore": 25.99,
      "leakPenalty": 18.49,
      "synergyScore": 27.56,
      "confidence": 28.67,
      "orderedContribution": 33.56,
      "simultaneousContribution": 26.09,
      "overall": 22.39
    }
  },
  {
    "id": "co-011",
    "input": {
      "orderFidelity": 0.54,
      "chemoEncapsulation": 0.57,
      "photoEncapsulation": 0.46,
      "poreFillUniformity": 0.55,
      "photothermalResponse": 0.51,
      "burstLeakRisk": 0.42,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 61.48,
      "chemoScore": 56.61,
      "photoScore": 54.98,
      "leakPenalty": 27.54,
      "synergyScore": 41.26,
      "confidence": 36.2,
      "orderedContribution": 60.53,
      "simultaneousContribution": 42.15,
      "overall": 61.22
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 17.73,
      "chemoScore": 40.03,
      "photoScore": 28.23,
      "leakPenalty": 20.05,
      "synergyScore": 41.54,
      "confidence": 31.12,
      "orderedContribution": 41.5,
      "simultaneousContribution": 36.92,
      "overall": 32.29
    }
  },
  {
    "id": "co-012",
    "input": {
      "orderFidelity": 0.5,
      "chemoEncapsulation": 0.53,
      "photoEncapsulation": 0.44,
      "poreFillUniformity": 0.51,
      "photothermalResponse": 0.49,
      "burstLeakRisk": 0.37,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "loadBias": "photo_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 63.82,
      "chemoScore": 38.46,
      "photoScore": 72.33,
      "leakPenalty": 24.92,
      "synergyScore": 39.66,
      "confidence": 34,
      "orderedContribution": 60.79,
      "simultaneousContribution": 41.32,
      "overall": 61.29
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 13.25,
      "chemoScore": 28.33,
      "photoScore": 27.91,
      "leakPenalty": 17.52,
      "synergyScore": 28.15,
      "confidence": 29.63,
      "orderedContribution": 36.02,
      "simultaneousContribution": 26.73,
      "overall": 23.67
    }
  },
  {
    "id": "co-013",
    "input": {
      "orderFidelity": 0.54,
      "chemoEncapsulation": 0.57,
      "photoEncapsulation": 0.48,
      "poreFillUniformity": 0.55,
      "photothermalResponse": 0.53,
      "burstLeakRisk": 0.39,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "loadBias": "simultaneous_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 26.39,
      "chemoScore": 32.81,
      "photoScore": 33.95,
      "leakPenalty": 25.87,
      "synergyScore": 43.03,
      "confidence": 37,
      "orderedContribution": 38.6,
      "simultaneousContribution": 31.31,
      "overall": 38.29
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 22.14,
      "chemoScore": 49,
      "photoScore": 30.15,
      "leakPenalty": 19.02,
      "synergyScore": 52.64,
      "confidence": 32.07,
      "orderedContribution": 46.98,
      "simultaneousContribution": 45.6,
      "overall": 40.5
    }
  },
  {
    "id": "co-014",
    "input": {
      "orderFidelity": 0.58,
      "chemoEncapsulation": 0.61,
      "photoEncapsulation": 0.52,
      "poreFillUniformity": 0.58,
      "photothermalResponse": 0.57,
      "burstLeakRisk": 0.4,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 65.29,
      "chemoScore": 60.08,
      "photoScore": 60.45,
      "leakPenalty": 26.31,
      "synergyScore": 46.53,
      "confidence": 39.95,
      "orderedContribution": 64.18,
      "simultaneousContribution": 45.72,
      "overall": 64.86
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 19.65,
      "chemoScore": 40.76,
      "photoScore": 32.59,
      "leakPenalty": 20.16,
      "synergyScore": 45.18,
      "confidence": 34.67,
      "orderedContribution": 43.6,
      "simultaneousContribution": 39.71,
      "overall": 34.93
    }
  },
  {
    "id": "co-015",
    "input": {
      "orderFidelity": 0.62,
      "chemoEncapsulation": 0.65,
      "photoEncapsulation": 0.5,
      "poreFillUniformity": 0.62,
      "photothermalResponse": 0.55,
      "burstLeakRisk": 0.36,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "loadBias": "chemo_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 77.19,
      "chemoScore": 77.55,
      "photoScore": 35.58,
      "leakPenalty": 23.03,
      "synergyScore": 46.4,
      "confidence": 44.15,
      "orderedContribution": 67.26,
      "simultaneousContribution": 43.02,
      "overall": 66.9
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 7.46,
      "chemoScore": 28.52,
      "photoScore": 32.07,
      "leakPenalty": 18.26,
      "synergyScore": 31.14,
      "confidence": 36.97,
      "orderedContribution": 36.19,
      "simultaneousContribution": 28.77,
      "overall": 24.82
    }
  },
  {
    "id": "co-016",
    "input": {
      "orderFidelity": 0.58,
      "chemoEncapsulation": 0.6,
      "photoEncapsulation": 0.53,
      "poreFillUniformity": 0.58,
      "photothermalResponse": 0.58,
      "burstLeakRisk": 0.37,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 65.36,
      "chemoScore": 59.46,
      "photoScore": 62.22,
      "leakPenalty": 24.46,
      "synergyScore": 47.39,
      "confidence": 40.5,
      "orderedContribution": 64.79,
      "simultaneousContribution": 46.04,
      "overall": 65.41
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 20.13,
      "chemoScore": 40.31,
      "photoScore": 33.85,
      "leakPenalty": 18.86,
      "synergyScore": 45.52,
      "confidence": 34.98,
      "orderedContribution": 44.19,
      "simultaneousContribution": 40.03,
      "overall": 35.55
    }
  },
  {
    "id": "co-017",
    "input": {
      "orderFidelity": 0.62,
      "chemoEncapsulation": 0.64,
      "photoEncapsulation": 0.57,
      "poreFillUniformity": 0.62,
      "photothermalResponse": 0.62,
      "burstLeakRisk": 0.39,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "loadBias": "photo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 76.61,
      "chemoScore": 45.18,
      "photoScore": 85.65,
      "leakPenalty": 25.41,
      "synergyScore": 50.77,
      "confidence": 43.5,
      "orderedContribution": 69.62,
      "simultaneousContribution": 49.33,
      "overall": 69.97
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 16.52,
      "chemoScore": 28.05,
      "photoScore": 36.09,
      "leakPenalty": 20.36,
      "synergyScore": 33.01,
      "confidence": 37.42,
      "orderedContribution": 38.66,
      "simultaneousContribution": 30.32,
      "overall": 26.45
    }
  },
  {
    "id": "co-018",
    "input": {
      "orderFidelity": 0.66,
      "chemoEncapsulation": 0.68,
      "photoEncapsulation": 0.55,
      "poreFillUniformity": 0.65,
      "photothermalResponse": 0.6,
      "burstLeakRisk": 0.34,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "loadBias": "simultaneous_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 33.53,
      "chemoScore": 39.54,
      "photoScore": 38.3,
      "leakPenalty": 21.61,
      "synergyScore": 50.76,
      "confidence": 47.65,
      "orderedContribution": 44.43,
      "simultaneousContribution": 35.19,
      "overall": 43.77
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 24.95,
      "chemoScore": 52.93,
      "photoScore": 35.77,
      "leakPenalty": 18.09,
      "synergyScore": 58.74,
      "confidence": 39.87,
      "orderedContribution": 50.86,
      "simultaneousContribution": 50.57,
      "overall": 45.05
    }
  },
  {
    "id": "co-019",
    "input": {
      "orderFidelity": 0.7,
      "chemoEncapsulation": 0.72,
      "photoEncapsulation": 0.59,
      "poreFillUniformity": 0.69,
      "photothermalResponse": 0.64,
      "burstLeakRisk": 0.36,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 77.37,
      "chemoScore": 69.85,
      "photoScore": 67.47,
      "leakPenalty": 22.57,
      "synergyScore": 54.14,
      "confidence": 50.65,
      "orderedContribution": 72.9,
      "simultaneousContribution": 51.06,
      "overall": 72.97
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 22.34,
      "chemoScore": 42.94,
      "photoScore": 38.01,
      "leakPenalty": 19.6,
      "synergyScore": 49.96,
      "confidence": 42.33,
      "orderedContribution": 46.73,
      "simultaneousContribution": 43.48,
      "overall": 38.32
    }
  },
  {
    "id": "co-020",
    "input": {
      "orderFidelity": 0.66,
      "chemoEncapsulation": 0.68,
      "photoEncapsulation": 0.63,
      "poreFillUniformity": 0.65,
      "photothermalResponse": 0.68,
      "burstLeakRisk": 0.37,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "loadBias": "chemo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 80.84,
      "chemoScore": 81.05,
      "photoScore": 41.22,
      "leakPenalty": 24.18,
      "synergyScore": 56.03,
      "confidence": 47.25,
      "orderedContribution": 70.49,
      "simultaneousContribution": 48.53,
      "overall": 70.54
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 10.44,
      "chemoScore": 27.97,
      "photoScore": 40.46,
      "leakPenalty": 20.47,
      "synergyScore": 35.2,
      "confidence": 40.97,
      "orderedContribution": 38.72,
      "simultaneousContribution": 32.11,
      "overall": 27.86
    }
  },
  {
    "id": "co-021",
    "input": {
      "orderFidelity": 0.7,
      "chemoEncapsulation": 0.72,
      "photoEncapsulation": 0.61,
      "poreFillUniformity": 0.68,
      "photothermalResponse": 0.66,
      "burstLeakRisk": 0.33,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "loadBias": "balanced",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 77.25,
      "chemoScore": 69.85,
      "photoScore": 70.03,
      "leakPenalty": 21,
      "synergyScore": 55.9,
      "confidence": 51.2,
      "orderedContribution": 73.76,
      "simultaneousContribution": 52.08,
      "overall": 73.86
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 23.25,
      "chemoScore": 42.87,
      "photoScore": 39.93,
      "leakPenalty": 18.63,
      "synergyScore": 51.04,
      "confidence": 43.28,
      "orderedContribution": 47.69,
      "simultaneousContribution": 44.38,
      "overall": 39.47
    }
  },
  {
    "id": "co-022",
    "input": {
      "orderFidelity": 0.74,
      "chemoEncapsulation": 0.76,
      "photoEncapsulation": 0.65,
      "poreFillUniformity": 0.72,
      "photothermalResponse": 0.7,
      "burstLeakRisk": 0.34,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "loadBias": "photo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 89.82,
      "chemoScore": 52.25,
      "photoScore": 96.27,
      "leakPenalty": 21.33,
      "synergyScore": 59.4,
      "confidence": 54.2,
      "orderedContribution": 78.84,
      "simultaneousContribution": 55.2,
      "overall": 78.58
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 19.64,
      "chemoScore": 28.16,
      "photoScore": 42.38,
      "leakPenalty": 19.7,
      "synergyScore": 36.59,
      "confidence": 45.73,
      "orderedContribution": 41.41,
      "simultaneousContribution": 33.03,
      "overall": 28.93
    }
  },
  {
    "id": "co-023",
    "input": {
      "orderFidelity": 0.79,
      "chemoEncapsulation": 0.8,
      "photoEncapsulation": 0.69,
      "poreFillUniformity": 0.76,
      "photothermalResponse": 0.74,
      "burstLeakRisk": 0.36,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "loadBias": "simultaneous_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 40.68,
      "chemoScore": 46.85,
      "photoScore": 44.25,
      "leakPenalty": 22.14,
      "synergyScore": 62.78,
      "confidence": 57.7,
      "orderedContribution": 49.96,
      "simultaneousContribution": 41.75,
      "overall": 49.48
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 28.46,
      "chemoScore": 57,
      "photoScore": 44.62,
      "leakPenalty": 21.16,
      "synergyScore": 70.05,
      "confidence": 48.33,
      "orderedContribution": 55.79,
      "simultaneousContribution": 58.88,
      "overall": 51.96
    }
  },
  {
    "id": "co-024",
    "input": {
      "orderFidelity": 0.75,
      "chemoEncapsulation": 0.76,
      "photoEncapsulation": 0.67,
      "poreFillUniformity": 0.72,
      "photothermalResponse": 0.72,
      "burstLeakRisk": 0.31,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "loadBias": "balanced",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 81.95,
      "chemoScore": 73.57,
      "photoScore": 75.5,
      "leakPenalty": 19.52,
      "synergyScore": 61.17,
      "confidence": 55.5,
      "orderedContribution": 77.79,
      "simultaneousContribution": 55.6,
      "overall": 77.8
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 24.99,
      "chemoScore": 43.43,
      "photoScore": 44.3,
      "leakPenalty": 18.63,
      "synergyScore": 54.58,
      "confidence": 46.83,
      "orderedContribution": 49.73,
      "simultaneousContribution": 47.08,
      "overall": 41.96
    }
  },
  {
    "id": "co-025",
    "input": {
      "orderFidelity": 0.79,
      "chemoEncapsulation": 0.8,
      "photoEncapsulation": 0.71,
      "poreFillUniformity": 0.75,
      "photothermalResponse": 0.76,
      "burstLeakRisk": 0.33,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "loadBias": "chemo_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 94.74,
      "chemoScore": 94.28,
      "photoScore": 45.81,
      "leakPenalty": 20.57,
      "synergyScore": 64.54,
      "confidence": 58.25,
      "orderedContribution": 80.11,
      "simultaneousContribution": 54.38,
      "overall": 79.48
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 13.38,
      "chemoScore": 27.9,
      "photoScore": 46.54,
      "leakPenalty": 20.19,
      "synergyScore": 38.67,
      "confidence": 49.28,
      "orderedContribution": 41.26,
      "simultaneousContribution": 34.67,
      "overall": 30.12
    }
  },
  {
    "id": "co-026",
    "input": {
      "orderFidelity": 0.83,
      "chemoEncapsulation": 0.83,
      "photoEncapsulation": 0.74,
      "poreFillUniformity": 0.79,
      "photothermalResponse": 0.79,
      "burstLeakRisk": 0.34,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 89.33,
      "chemoScore": 79.88,
      "photoScore": 80.16,
      "leakPenalty": 20.72,
      "synergyScore": 67.14,
      "confidence": 61,
      "orderedContribution": 82.67,
      "simultaneousContribution": 59.98,
      "overall": 82.59
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 26.33,
      "chemoScore": 44.66,
      "photoScore": 48.32,
      "leakPenalty": 20.99,
      "synergyScore": 58.96,
      "confidence": 51.08,
      "orderedContribution": 51.46,
      "simultaneousContribution": 50.22,
      "overall": 44.19
    }
  },
  {
    "id": "co-027",
    "input": {
      "orderFidelity": 0.87,
      "chemoEncapsulation": 0.87,
      "photoEncapsulation": 0.72,
      "poreFillUniformity": 0.83,
      "photothermalResponse": 0.77,
      "burstLeakRisk": 0.3,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "loadBias": "photo_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 100,
      "chemoScore": 59.23,
      "photoScore": 100,
      "leakPenalty": 17.44,
      "synergyScore": 67.01,
      "confidence": 65.2,
      "orderedContribution": 85.45,
      "simultaneousContribution": 58.92,
      "overall": 84.67
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 22.14,
      "chemoScore": 27.92,
      "photoScore": 47.8,
      "leakPenalty": 19.1,
      "synergyScore": 39.57,
      "confidence": 53.38,
      "orderedContribution": 43.67,
      "simultaneousContribution": 35.21,
      "overall": 30.83
    }
  },
  {
    "id": "co-028",
    "input": {
      "orderFidelity": 0.83,
      "chemoEncapsulation": 0.83,
      "photoEncapsulation": 0.76,
      "poreFillUniformity": 0.79,
      "photothermalResponse": 0.81,
      "burstLeakRisk": 0.31,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "loadBias": "simultaneous_first",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 43.15,
      "chemoScore": 48.87,
      "photoScore": 48.53,
      "leakPenalty": 19.06,
      "synergyScore": 68.9,
      "confidence": 62,
      "orderedContribution": 52.85,
      "simultaneousContribution": 44.68,
      "overall": 52.38
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 30.86,
      "chemoScore": 57.76,
      "photoScore": 50.24,
      "leakPenalty": 19.97,
      "synergyScore": 75.35,
      "confidence": 52.18,
      "orderedContribution": 58.85,
      "simultaneousContribution": 62.84,
      "overall": 55.96
    }
  },
  {
    "id": "co-029",
    "input": {
      "orderFidelity": 0.87,
      "chemoEncapsulation": 0.87,
      "photoEncapsulation": 0.8,
      "poreFillUniformity": 0.82,
      "photothermalResponse": 0.85,
      "burstLeakRisk": 0.33,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "loadBias": "balanced",
      "profile": "ordered_coload_sequence"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 93.15,
      "chemoScore": 83.34,
      "photoScore": 85.41,
      "leakPenalty": 20.11,
      "synergyScore": 72.28,
      "confidence": 64.75,
      "orderedContribution": 86.16,
      "simultaneousContribution": 63.54,
      "overall": 86.09
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 28.25,
      "chemoScore": 45.39,
      "photoScore": 52.48,
      "leakPenalty": 21.53,
      "synergyScore": 62.6,
      "confidence": 54.62,
      "orderedContribution": 53.44,
      "simultaneousContribution": 52.96,
      "overall": 46.77
    }
  },
  {
    "id": "co-030",
    "input": {
      "orderFidelity": 0.91,
      "chemoEncapsulation": 0.91,
      "photoEncapsulation": 0.78,
      "poreFillUniformity": 0.86,
      "photothermalResponse": 0.83,
      "burstLeakRisk": 0.28,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "loadBias": "chemo_first",
      "profile": "simultaneous_load_baseline"
    },
    "expectedOrdered": {
      "mode": "ordered_coload_sequence",
      "orderScore": 100,
      "chemoScore": 100,
      "photoScore": 50.08,
      "leakPenalty": 16.21,
      "synergyScore": 72.27,
      "confidence": 68.95,
      "orderedContribution": 85.1,
      "simultaneousContribution": 57.97,
      "overall": 84.22
    },
    "expectedSimultaneous": {
      "mode": "simultaneous_load_baseline",
      "orderScore": 16.06,
      "chemoScore": 27.84,
      "photoScore": 52.16,
      "leakPenalty": 19.2,
      "synergyScore": 41.75,
      "confidence": 56.93,
      "orderedContribution": 43.72,
      "simultaneousContribution": 36.99,
      "overall": 32.23
    }
  }
];
