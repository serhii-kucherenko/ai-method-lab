import type { HydrogelInput, HydrogelQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HydrogelInput;
  expectedRegulation: HydrogelQuality;
  expectedFixed: HydrogelQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ih-001",
    "input": {
      "chargeRegulation": 0.29,
      "fixedChargeDensity": 0.39,
      "ionMobility": 0.25,
      "bindingStrength": 0.59,
      "saltLoad": 0.45,
      "gelPermeability": 0.28,
      "swellingRatio": 0.34,
      "overclaimRisk": 0.5,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 24.12,
      "mobilityScore": 29.44,
      "bindingScore": 29.91,
      "saltScore": 28.31,
      "fixedScore": 21.8,
      "confidence": 14.35,
      "regulationContribution": 27.81,
      "fixedContribution": 21.4,
      "overall": 30.66
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 8.84,
      "mobilityScore": 21.9,
      "bindingScore": 21.33,
      "saltScore": 33.83,
      "fixedScore": 50.81,
      "confidence": 24.2,
      "regulationContribution": 27.34,
      "fixedContribution": 47.34,
      "overall": 36.34
    }
  },
  {
    "id": "ih-002",
    "input": {
      "chargeRegulation": 0.33,
      "fixedChargeDensity": 0.43,
      "ionMobility": 0.29,
      "bindingStrength": 0.6,
      "saltLoad": 0.46,
      "gelPermeability": 0.32,
      "swellingRatio": 0.38,
      "overclaimRisk": 0.51,
      "chargeBias": "mobility_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 30.17,
      "mobilityScore": 33.09,
      "bindingScore": 23.2,
      "saltScore": 37.59,
      "fixedScore": 23.75,
      "confidence": 17.6,
      "regulationContribution": 30.89,
      "fixedContribution": 23.55,
      "overall": 33.57
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 5.51,
      "mobilityScore": 23.41,
      "bindingScore": 22.16,
      "saltScore": 35.01,
      "fixedScore": 41.53,
      "confidence": 26.05,
      "regulationContribution": 25.52,
      "fixedContribution": 43.56,
      "overall": 32.85
    }
  },
  {
    "id": "ih-003",
    "input": {
      "chargeRegulation": 0.37,
      "fixedChargeDensity": 0.46,
      "ionMobility": 0.27,
      "bindingStrength": 0.6,
      "saltLoad": 0.42,
      "gelPermeability": 0.36,
      "swellingRatio": 0.42,
      "overclaimRisk": 0.46,
      "chargeBias": "fixed_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 7.67,
      "mobilityScore": 22.74,
      "bindingScore": 24.66,
      "saltScore": 18.32,
      "fixedScore": 24.08,
      "confidence": 19.2,
      "regulationContribution": 18.01,
      "fixedContribution": 24.24,
      "overall": 20.13
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 16.13,
      "mobilityScore": 25.2,
      "bindingScore": 22.96,
      "saltScore": 34.23,
      "fixedScore": 65.14,
      "confidence": 28.7,
      "regulationContribution": 32.73,
      "fixedContribution": 57.62,
      "overall": 46.02
    }
  },
  {
    "id": "ih-004",
    "input": {
      "chargeRegulation": 0.33,
      "fixedChargeDensity": 0.42,
      "ionMobility": 0.32,
      "bindingStrength": 0.53,
      "saltLoad": 0.43,
      "gelPermeability": 0.39,
      "swellingRatio": 0.38,
      "overclaimRisk": 0.46,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 29.21,
      "mobilityScore": 37.13,
      "bindingScore": 35.98,
      "saltScore": 36.02,
      "fixedScore": 22.53,
      "confidence": 21.3,
      "regulationContribution": 34.39,
      "fixedContribution": 22.77,
      "overall": 36.3
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 10.9,
      "mobilityScore": 21.71,
      "bindingScore": 19.95,
      "saltScore": 33.06,
      "fixedScore": 51.13,
      "confidence": 24.25,
      "regulationContribution": 27.35,
      "fixedContribution": 47.52,
      "overall": 36.88
    }
  },
  {
    "id": "ih-005",
    "input": {
      "chargeRegulation": 0.37,
      "fixedChargeDensity": 0.46,
      "ionMobility": 0.36,
      "bindingStrength": 0.53,
      "saltLoad": 0.45,
      "gelPermeability": 0.35,
      "swellingRatio": 0.42,
      "overclaimRisk": 0.47,
      "chargeBias": "regulation_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 35.81,
      "mobilityScore": 38.82,
      "bindingScore": 45.13,
      "saltScore": 27.5,
      "fixedScore": 24.68,
      "confidence": 22.7,
      "regulationContribution": 37,
      "fixedContribution": 25.14,
      "overall": 38.87
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 0,
      "mobilityScore": 22.95,
      "bindingScore": 20.35,
      "saltScore": 34.69,
      "fixedScore": 40.91,
      "confidence": 25.55,
      "regulationContribution": 23.78,
      "fixedContribution": 43.01,
      "overall": 32.36
    }
  },
  {
    "id": "ih-006",
    "input": {
      "chargeRegulation": 0.41,
      "fixedChargeDensity": 0.5,
      "ionMobility": 0.34,
      "bindingStrength": 0.54,
      "saltLoad": 0.4,
      "gelPermeability": 0.39,
      "swellingRatio": 0.45,
      "overclaimRisk": 0.42,
      "chargeBias": "balanced",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 35.07,
      "mobilityScore": 38.44,
      "bindingScore": 38.79,
      "saltScore": 39.91,
      "fixedScore": 25.42,
      "confidence": 24.15,
      "regulationContribution": 37.9,
      "fixedContribution": 26.24,
      "overall": 39.8
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 15.06,
      "mobilityScore": 25.44,
      "bindingScore": 21.78,
      "saltScore": 33.74,
      "fixedScore": 56,
      "confidence": 29.2,
      "regulationContribution": 30.4,
      "fixedContribution": 52.9,
      "overall": 42.23
    }
  },
  {
    "id": "ih-007",
    "input": {
      "chargeRegulation": 0.45,
      "fixedChargeDensity": 0.53,
      "ionMobility": 0.38,
      "bindingStrength": 0.55,
      "saltLoad": 0.42,
      "gelPermeability": 0.42,
      "swellingRatio": 0.49,
      "overclaimRisk": 0.43,
      "chargeBias": "mobility_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 42.27,
      "mobilityScore": 41.84,
      "bindingScore": 31.01,
      "saltScore": 50.27,
      "fixedScore": 26.95,
      "confidence": 27.15,
      "regulationContribution": 41.22,
      "fixedContribution": 27.92,
      "overall": 42.83
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 11.13,
      "mobilityScore": 26.43,
      "bindingScore": 22.31,
      "saltScore": 35.09,
      "fixedScore": 43.4,
      "confidence": 30.4,
      "regulationContribution": 27.67,
      "fixedContribution": 46.94,
      "overall": 36.76
    }
  },
  {
    "id": "ih-008",
    "input": {
      "chargeRegulation": 0.41,
      "fixedChargeDensity": 0.49,
      "ionMobility": 0.43,
      "bindingStrength": 0.47,
      "saltLoad": 0.43,
      "gelPermeability": 0.46,
      "swellingRatio": 0.45,
      "overclaimRisk": 0.44,
      "chargeBias": "fixed_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 12.19,
      "mobilityScore": 36.52,
      "bindingScore": 33.06,
      "saltScore": 22.46,
      "fixedScore": 25.4,
      "confidence": 29.65,
      "regulationContribution": 25.78,
      "fixedContribution": 26.5,
      "overall": 26.91
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 17.28,
      "mobilityScore": 22.76,
      "bindingScore": 18.97,
      "saltScore": 33.92,
      "fixedScore": 64.94,
      "confidence": 25.5,
      "regulationContribution": 31.57,
      "fixedContribution": 56.23,
      "overall": 44.72
    }
  },
  {
    "id": "ih-009",
    "input": {
      "chargeRegulation": 0.46,
      "fixedChargeDensity": 0.53,
      "ionMobility": 0.41,
      "bindingStrength": 0.48,
      "saltLoad": 0.39,
      "gelPermeability": 0.5,
      "swellingRatio": 0.49,
      "overclaimRisk": 0.38,
      "chargeBias": "balanced",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 40.71,
      "mobilityScore": 46.13,
      "bindingScore": 45.09,
      "saltScore": 47.63,
      "fixedScore": 26.17,
      "confidence": 31.4,
      "regulationContribution": 44.69,
      "fixedContribution": 27.65,
      "overall": 45.62
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 16.89,
      "mobilityScore": 25.16,
      "bindingScore": 20.25,
      "saltScore": 33.43,
      "fixedScore": 56.44,
      "confidence": 29.05,
      "regulationContribution": 30.43,
      "fixedContribution": 53.1,
      "overall": 42.71
    }
  },
  {
    "id": "ih-010",
    "input": {
      "chargeRegulation": 0.5,
      "fixedChargeDensity": 0.57,
      "ionMobility": 0.45,
      "bindingStrength": 0.49,
      "saltLoad": 0.4,
      "gelPermeability": 0.46,
      "swellingRatio": 0.53,
      "overclaimRisk": 0.39,
      "chargeBias": "regulation_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 48.61,
      "mobilityScore": 47.78,
      "bindingScore": 54.44,
      "saltScore": 36.8,
      "fixedScore": 28.11,
      "confidence": 32.65,
      "regulationContribution": 47.2,
      "fixedContribution": 29.79,
      "overall": 48.07
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 5.57,
      "mobilityScore": 26.67,
      "bindingScore": 21.08,
      "saltScore": 34.6,
      "fixedScore": 43.22,
      "confidence": 30.9,
      "regulationContribution": 26.23,
      "fixedContribution": 47.15,
      "overall": 37.01
    }
  },
  {
    "id": "ih-011",
    "input": {
      "chargeRegulation": 0.54,
      "fixedChargeDensity": 0.6,
      "ionMobility": 0.49,
      "bindingStrength": 0.49,
      "saltLoad": 0.42,
      "gelPermeability": 0.49,
      "swellingRatio": 0.57,
      "overclaimRisk": 0.4,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 47.53,
      "mobilityScore": 51.22,
      "bindingScore": 48.23,
      "saltScore": 50.19,
      "fixedScore": 29.64,
      "confidence": 35.8,
      "regulationContribution": 49.24,
      "fixedContribution": 31.53,
      "overall": 50.05
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 18.64,
      "mobilityScore": 27.48,
      "bindingScore": 21.28,
      "saltScore": 35.95,
      "fixedScore": 61.4,
      "confidence": 31.75,
      "regulationContribution": 32.95,
      "fixedContribution": 57.96,
      "overall": 46.7
    }
  },
  {
    "id": "ih-012",
    "input": {
      "chargeRegulation": 0.5,
      "fixedChargeDensity": 0.56,
      "ionMobility": 0.48,
      "bindingStrength": 0.42,
      "saltLoad": 0.37,
      "gelPermeability": 0.53,
      "swellingRatio": 0.53,
      "overclaimRisk": 0.35,
      "chargeBias": "mobility_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 50.39,
      "mobilityScore": 51.83,
      "bindingScore": 39.38,
      "saltScore": 60.65,
      "fixedScore": 26.9,
      "confidence": 36.35,
      "regulationContribution": 50.38,
      "fixedContribution": 29.02,
      "overall": 50.54
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 14.33,
      "mobilityScore": 24.96,
      "bindingScore": 18.87,
      "saltScore": 32.66,
      "fixedScore": 40.97,
      "confidence": 29,
      "regulationContribution": 26.36,
      "fixedContribution": 44.59,
      "overall": 35.52
    }
  },
  {
    "id": "ih-013",
    "input": {
      "chargeRegulation": 0.54,
      "fixedChargeDensity": 0.6,
      "ionMobility": 0.52,
      "bindingStrength": 0.42,
      "saltLoad": 0.39,
      "gelPermeability": 0.56,
      "swellingRatio": 0.57,
      "overclaimRisk": 0.36,
      "chargeBias": "fixed_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 19.1,
      "mobilityScore": 45.26,
      "bindingScore": 41.17,
      "saltScore": 31.55,
      "fixedScore": 29.04,
      "confidence": 39.5,
      "regulationContribution": 33.94,
      "fixedContribution": 31.39,
      "overall": 34.48
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 23.28,
      "mobilityScore": 26.21,
      "bindingScore": 19.27,
      "saltScore": 34.29,
      "fixedScore": 72.66,
      "confidence": 30.3,
      "regulationContribution": 35.14,
      "fixedContribution": 63.14,
      "overall": 51.7
    }
  },
  {
    "id": "ih-014",
    "input": {
      "chargeRegulation": 0.58,
      "fixedChargeDensity": 0.63,
      "ionMobility": 0.56,
      "bindingStrength": 0.43,
      "saltLoad": 0.4,
      "gelPermeability": 0.6,
      "swellingRatio": 0.61,
      "overclaimRisk": 0.36,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 52.62,
      "mobilityScore": 58.91,
      "bindingScore": 54.29,
      "saltScore": 57.89,
      "fixedScore": 30.37,
      "confidence": 42.75,
      "regulationContribution": 55.82,
      "fixedContribution": 32.9,
      "overall": 55.69
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 20.69,
      "mobilityScore": 27.28,
      "bindingScore": 19.9,
      "saltScore": 35.18,
      "fixedScore": 61.72,
      "confidence": 31.8,
      "regulationContribution": 32.95,
      "fixedContribution": 58.14,
      "overall": 47.24
    }
  },
  {
    "id": "ih-015",
    "input": {
      "chargeRegulation": 0.62,
      "fixedChargeDensity": 0.67,
      "ionMobility": 0.54,
      "bindingStrength": 0.44,
      "saltLoad": 0.36,
      "gelPermeability": 0.56,
      "swellingRatio": 0.65,
      "overclaimRisk": 0.31,
      "chargeBias": "regulation_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 60.72,
      "mobilityScore": 56.53,
      "bindingScore": 64.04,
      "saltScore": 45.69,
      "fixedScore": 31.31,
      "confidence": 42.2,
      "regulationContribution": 57.12,
      "fixedContribution": 34.17,
      "overall": 56.99
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 11.19,
      "mobilityScore": 29.68,
      "bindingScore": 21.23,
      "saltScore": 34.69,
      "fixedScore": 45.08,
      "confidence": 35.25,
      "regulationContribution": 28.37,
      "fixedContribution": 50.53,
      "overall": 40.91
    }
  },
  {
    "id": "ih-016",
    "input": {
      "chargeRegulation": 0.58,
      "fixedChargeDensity": 0.63,
      "ionMobility": 0.59,
      "bindingStrength": 0.36,
      "saltLoad": 0.37,
      "gelPermeability": 0.6,
      "swellingRatio": 0.6,
      "overclaimRisk": 0.32,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 54.23,
      "mobilityScore": 61.21,
      "bindingScore": 58.93,
      "saltScore": 58.18,
      "fixedScore": 29.77,
      "confidence": 44.7,
      "regulationContribution": 58.04,
      "fixedContribution": 32.75,
      "overall": 57.49
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 21.83,
      "mobilityScore": 26.01,
      "bindingScore": 17.9,
      "saltScore": 33.52,
      "fixedScore": 59.82,
      "confidence": 30.35,
      "regulationContribution": 31.82,
      "fixedContribution": 56.08,
      "overall": 45.86
    }
  },
  {
    "id": "ih-017",
    "input": {
      "chargeRegulation": 0.62,
      "fixedChargeDensity": 0.67,
      "ionMobility": 0.63,
      "bindingStrength": 0.37,
      "saltLoad": 0.39,
      "gelPermeability": 0.63,
      "swellingRatio": 0.64,
      "overclaimRisk": 0.33,
      "chargeBias": "mobility_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 63.6,
      "mobilityScore": 64.61,
      "bindingScore": 47.51,
      "saltScore": 72.25,
      "fixedScore": 31.91,
      "confidence": 47.7,
      "regulationContribution": 61.9,
      "fixedContribution": 35.07,
      "overall": 61.07
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 18.29,
      "mobilityScore": 27.44,
      "bindingScore": 18.63,
      "saltScore": 35.15,
      "fixedScore": 43.9,
      "confidence": 32,
      "regulationContribution": 28.68,
      "fixedContribution": 48.6,
      "overall": 39.12
    }
  },
  {
    "id": "ih-018",
    "input": {
      "chargeRegulation": 0.66,
      "fixedChargeDensity": 0.7,
      "ionMobility": 0.61,
      "bindingStrength": 0.38,
      "saltLoad": 0.34,
      "gelPermeability": 0.67,
      "swellingRatio": 0.68,
      "overclaimRisk": 0.27,
      "chargeBias": "fixed_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 25.72,
      "mobilityScore": 54.22,
      "bindingScore": 48.82,
      "saltScore": 40.65,
      "fixedScore": 32.04,
      "confidence": 49.15,
      "regulationContribution": 41.96,
      "fixedContribution": 35.53,
      "overall": 41.8
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 29.24,
      "mobilityScore": 29.49,
      "bindingScore": 19.85,
      "saltScore": 33.92,
      "fixedScore": 79.63,
      "confidence": 35.3,
      "regulationContribution": 38.43,
      "fixedContribution": 69.53,
      "overall": 58.35
    }
  },
  {
    "id": "ih-019",
    "input": {
      "chargeRegulation": 0.7,
      "fixedChargeDensity": 0.74,
      "ionMobility": 0.65,
      "bindingStrength": 0.38,
      "saltLoad": 0.36,
      "gelPermeability": 0.7,
      "swellingRatio": 0.72,
      "overclaimRisk": 0.28,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 63.51,
      "mobilityScore": 67.66,
      "bindingScore": 63.11,
      "saltScore": 68.8,
      "fixedScore": 34.18,
      "confidence": 52.3,
      "regulationContribution": 65.66,
      "fixedContribution": 37.9,
      "overall": 64.66
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 26.69,
      "mobilityScore": 30.73,
      "bindingScore": 20.25,
      "saltScore": 35.55,
      "fixedScore": 67.03,
      "confidence": 36.6,
      "regulationContribution": 36.05,
      "fixedContribution": 63.71,
      "overall": 53.06
    }
  },
  {
    "id": "ih-020",
    "input": {
      "chargeRegulation": 0.66,
      "fixedChargeDensity": 0.7,
      "ionMobility": 0.7,
      "bindingStrength": 0.31,
      "saltLoad": 0.37,
      "gelPermeability": 0.66,
      "swellingRatio": 0.68,
      "overclaimRisk": 0.29,
      "chargeBias": "regulation_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 69.26,
      "mobilityScore": 70.3,
      "bindingScore": 77.1,
      "saltScore": 49.84,
      "fixedScore": 32.64,
      "confidence": 52.65,
      "regulationContribution": 67.14,
      "fixedContribution": 36.43,
      "overall": 65.61
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 12.34,
      "mobilityScore": 27.24,
      "bindingScore": 17.25,
      "saltScore": 34.38,
      "fixedScore": 43.38,
      "confidence": 32.05,
      "regulationContribution": 26.92,
      "fixedContribution": 48.32,
      "overall": 38.91
    }
  },
  {
    "id": "ih-021",
    "input": {
      "chargeRegulation": 0.7,
      "fixedChargeDensity": 0.73,
      "ionMobility": 0.68,
      "bindingStrength": 0.31,
      "saltLoad": 0.33,
      "gelPermeability": 0.7,
      "swellingRatio": 0.72,
      "overclaimRisk": 0.24,
      "chargeBias": "balanced",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 65.12,
      "mobilityScore": 69.96,
      "bindingScore": 67.74,
      "saltScore": 69.34,
      "fixedScore": 32.97,
      "confidence": 54.25,
      "regulationContribution": 67.94,
      "fixedContribution": 37.13,
      "overall": 66.39
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 27.45,
      "mobilityScore": 29.03,
      "bindingScore": 18.04,
      "saltScore": 33.61,
      "fixedScore": 64.51,
      "confidence": 34.7,
      "regulationContribution": 34.53,
      "fixedContribution": 61.01,
      "overall": 51.1
    }
  },
  {
    "id": "ih-022",
    "input": {
      "chargeRegulation": 0.74,
      "fixedChargeDensity": 0.77,
      "ionMobility": 0.72,
      "bindingStrength": 0.32,
      "saltLoad": 0.34,
      "gelPermeability": 0.73,
      "swellingRatio": 0.76,
      "overclaimRisk": 0.25,
      "chargeBias": "mobility_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 75.77,
      "mobilityScore": 73.35,
      "bindingScore": 55.38,
      "saltScore": 85.35,
      "fixedScore": 34.91,
      "confidence": 57.25,
      "regulationContribution": 72.35,
      "fixedContribution": 39.26,
      "overall": 70.39
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 24.13,
      "mobilityScore": 30.54,
      "bindingScore": 18.87,
      "saltScore": 34.78,
      "fixedScore": 45.65,
      "confidence": 36.55,
      "regulationContribution": 30.79,
      "fixedContribution": 51.96,
      "overall": 43.08
    }
  },
  {
    "id": "ih-023",
    "input": {
      "chargeRegulation": 0.79,
      "fixedChargeDensity": 0.81,
      "ionMobility": 0.76,
      "bindingStrength": 0.33,
      "saltLoad": 0.36,
      "gelPermeability": 0.77,
      "swellingRatio": 0.8,
      "overclaimRisk": 0.25,
      "chargeBias": "fixed_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 33.04,
      "mobilityScore": 67,
      "bindingScore": 57.25,
      "saltScore": 48.66,
      "fixedScore": 36.88,
      "confidence": 60.8,
      "regulationContribution": 51.12,
      "fixedContribution": 41.46,
      "overall": 50.38
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 33.2,
      "mobilityScore": 31.96,
      "bindingScore": 19.56,
      "saltScore": 36.41,
      "fixedScore": 88.08,
      "confidence": 38.3,
      "regulationContribution": 41.84,
      "fixedContribution": 76.57,
      "overall": 64.55
    }
  },
  {
    "id": "ih-024",
    "input": {
      "chargeRegulation": 0.75,
      "fixedChargeDensity": 0.77,
      "ionMobility": 0.75,
      "bindingStrength": 0.25,
      "saltLoad": 0.31,
      "gelPermeability": 0.81,
      "swellingRatio": 0.76,
      "overclaimRisk": 0.2,
      "chargeBias": "balanced",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 70.83,
      "mobilityScore": 77.65,
      "bindingScore": 74.1,
      "saltScore": 77.24,
      "fixedScore": 34.13,
      "confidence": 61.5,
      "regulationContribution": 74.8,
      "fixedContribution": 39,
      "overall": 72.36
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 29.89,
      "mobilityScore": 29.27,
      "bindingScore": 16.82,
      "saltScore": 33.12,
      "fixedScore": 65.45,
      "confidence": 35.2,
      "regulationContribution": 34.91,
      "fixedContribution": 61.83,
      "overall": 52.23
    }
  },
  {
    "id": "ih-025",
    "input": {
      "chargeRegulation": 0.79,
      "fixedChargeDensity": 0.8,
      "ionMobility": 0.79,
      "bindingStrength": 0.26,
      "saltLoad": 0.33,
      "gelPermeability": 0.77,
      "swellingRatio": 0.8,
      "overclaimRisk": 0.21,
      "chargeBias": "regulation_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 82.05,
      "mobilityScore": 79.3,
      "bindingScore": 86.99,
      "saltScore": 59.2,
      "fixedScore": 35.66,
      "confidence": 62.75,
      "regulationContribution": 77.49,
      "fixedContribution": 40.68,
      "overall": 74.86
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 17.96,
      "mobilityScore": 30.26,
      "bindingScore": 17.35,
      "saltScore": 34.47,
      "fixedScore": 45.24,
      "confidence": 36.4,
      "regulationContribution": 29.06,
      "fixedContribution": 51.69,
      "overall": 42.81
    }
  },
  {
    "id": "ih-026",
    "input": {
      "chargeRegulation": 0.83,
      "fixedChargeDensity": 0.84,
      "ionMobility": 0.83,
      "bindingStrength": 0.27,
      "saltLoad": 0.34,
      "gelPermeability": 0.8,
      "swellingRatio": 0.83,
      "overclaimRisk": 0.22,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 77.59,
      "mobilityScore": 82.7,
      "bindingScore": 76.74,
      "saltScore": 79.55,
      "fixedScore": 37.6,
      "confidence": 65.75,
      "regulationContribution": 79.15,
      "fixedContribution": 42.82,
      "overall": 76.61
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 31.63,
      "mobilityScore": 31.77,
      "bindingScore": 18.18,
      "saltScore": 35.64,
      "fixedScore": 70.64,
      "confidence": 38.25,
      "regulationContribution": 37.57,
      "fixedContribution": 66.98,
      "overall": 56.47
    }
  },
  {
    "id": "ih-027",
    "input": {
      "chargeRegulation": 0.87,
      "fixedChargeDensity": 0.88,
      "ionMobility": 0.81,
      "bindingStrength": 0.27,
      "saltLoad": 0.3,
      "gelPermeability": 0.84,
      "swellingRatio": 0.87,
      "overclaimRisk": 0.17,
      "chargeBias": "mobility_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 88.57,
      "mobilityScore": 82.35,
      "bindingScore": 63.49,
      "saltScore": 98.9,
      "fixedScore": 38.55,
      "confidence": 67.35,
      "regulationContribution": 83.21,
      "fixedContribution": 44.15,
      "overall": 80.18
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 30.12,
      "mobilityScore": 33.99,
      "bindingScore": 19.17,
      "saltScore": 35.15,
      "fixedScore": 47.86,
      "confidence": 41.35,
      "regulationContribution": 33.26,
      "fixedContribution": 55.83,
      "overall": 47.44
    }
  },
  {
    "id": "ih-028",
    "input": {
      "chargeRegulation": 0.83,
      "fixedChargeDensity": 0.84,
      "ionMobility": 0.86,
      "bindingStrength": 0.2,
      "saltLoad": 0.31,
      "gelPermeability": 0.87,
      "swellingRatio": 0.83,
      "overclaimRisk": 0.17,
      "chargeBias": "fixed_first",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 37.15,
      "mobilityScore": 76.74,
      "bindingScore": 65.33,
      "saltScore": 53.89,
      "fixedScore": 37,
      "confidence": 69.45,
      "regulationContribution": 57.89,
      "fixedContribution": 42.67,
      "overall": 56.15
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 36.39,
      "mobilityScore": 30.5,
      "bindingScore": 16.17,
      "saltScore": 33.98,
      "fixedScore": 87.15,
      "confidence": 36.9,
      "regulationContribution": 40.84,
      "fixedContribution": 75.05,
      "overall": 64.02
    }
  },
  {
    "id": "ih-029",
    "input": {
      "chargeRegulation": 0.87,
      "fixedChargeDensity": 0.87,
      "ionMobility": 0.9,
      "bindingStrength": 0.2,
      "saltLoad": 0.33,
      "gelPermeability": 0.91,
      "swellingRatio": 0.87,
      "overclaimRisk": 0.18,
      "chargeBias": "balanced",
      "profile": "dynamic_charge_regulation"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 82.67,
      "mobilityScore": 90.43,
      "bindingScore": 83.24,
      "saltScore": 87.07,
      "fixedScore": 38.53,
      "confidence": 72.85,
      "regulationContribution": 85.79,
      "fixedContribution": 44.41,
      "overall": 82.34
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 33.47,
      "mobilityScore": 31.31,
      "bindingScore": 16.37,
      "saltScore": 35.33,
      "fixedScore": 70.86,
      "confidence": 37.75,
      "regulationContribution": 37.47,
      "fixedContribution": 66.9,
      "overall": 56.71
    }
  },
  {
    "id": "ih-030",
    "input": {
      "chargeRegulation": 0.91,
      "fixedChargeDensity": 0.91,
      "ionMobility": 0.88,
      "bindingStrength": 0.21,
      "saltLoad": 0.28,
      "gelPermeability": 0.87,
      "swellingRatio": 0.91,
      "overclaimRisk": 0.13,
      "chargeBias": "regulation_first",
      "profile": "fixed_charge_baseline"
    },
    "expectedRegulation": {
      "mode": "dynamic_charge_regulation",
      "regulationScore": 94.22,
      "mobilityScore": 88.05,
      "bindingScore": 96.66,
      "saltScore": 68.03,
      "fixedScore": 39.28,
      "confidence": 72.3,
      "regulationContribution": 87.44,
      "fixedContribution": 45.51,
      "overall": 83.89
    },
    "expectedFixed": {
      "mode": "fixed_charge_baseline",
      "regulationScore": 24.18,
      "mobilityScore": 33.79,
      "bindingScore": 17.8,
      "saltScore": 34.38,
      "fixedScore": 47.33,
      "confidence": 41.4,
      "regulationContribution": 31.5,
      "fixedContribution": 55.54,
      "overall": 47.23
    }
  }
];
