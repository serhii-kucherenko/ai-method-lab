import type { CostInput, CostQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CostInput;
  expectedSovereignWee: CostQuality;
  expectedNaiveCloud: CostQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sc-001",
    "input": {
      "waterIntensity": 0.29,
      "energyIntensity": 0.25,
      "emissionsClarity": 0.28,
      "scenarioStability": 0.34,
      "cloudFootprintRate": 0.39,
      "cloudOptimism": 0.45,
      "infraHardness": 0.59,
      "overclaimRisk": 0.5,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 22.56,
      "energyScore": 30.25,
      "emissionsScore": 23.49,
      "scenarioIntegrity": 37.64,
      "cloudBaselineScore": 16.4,
      "confidence": 19.35,
      "sovereignContribution": 27.98,
      "cloudContribution": 15.96,
      "overall": 29.82
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 5.76,
      "energyScore": 17.09,
      "emissionsScore": 13.13,
      "scenarioIntegrity": 32.39,
      "cloudBaselineScore": 40.93,
      "confidence": 17.1,
      "sovereignContribution": 21.86,
      "cloudContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "sc-002",
    "input": {
      "waterIntensity": 0.33,
      "energyIntensity": 0.29,
      "emissionsClarity": 0.32,
      "scenarioStability": 0.38,
      "cloudFootprintRate": 0.43,
      "cloudOptimism": 0.46,
      "infraHardness": 0.6,
      "overclaimRisk": 0.51,
      "costBias": "energy_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 22.22,
      "energyScore": 33.9,
      "emissionsScore": 17.76,
      "scenarioIntegrity": 48.93,
      "cloudBaselineScore": 18.89,
      "confidence": 23,
      "sovereignContribution": 29.65,
      "cloudContribution": 18.61,
      "overall": 31.66
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 2.43,
      "energyScore": 18.22,
      "emissionsScore": 14.16,
      "scenarioIntegrity": 34.08,
      "cloudBaselineScore": 31.53,
      "confidence": 18.65,
      "sovereignContribution": 20.08,
      "cloudContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "sc-003",
    "input": {
      "waterIntensity": 0.37,
      "energyIntensity": 0.27,
      "emissionsClarity": 0.36,
      "scenarioStability": 0.42,
      "cloudFootprintRate": 0.46,
      "cloudOptimism": 0.42,
      "infraHardness": 0.6,
      "overclaimRisk": 0.46,
      "costBias": "cloud_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 12.18,
      "energyScore": 23.71,
      "emissionsScore": 20.95,
      "scenarioIntegrity": 19.24,
      "cloudBaselineScore": 19.94,
      "confidence": 25.6,
      "sovereignContribution": 18.96,
      "cloudContribution": 19.69,
      "overall": 20.09
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 12.17,
      "energyScore": 17.1,
      "emissionsScore": 13.13,
      "scenarioIntegrity": 33.93,
      "cloudBaselineScore": 54.34,
      "confidence": 18.4,
      "sovereignContribution": 26.13,
      "cloudContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "sc-004",
    "input": {
      "waterIntensity": 0.33,
      "energyIntensity": 0.32,
      "emissionsClarity": 0.39,
      "scenarioStability": 0.38,
      "cloudFootprintRate": 0.42,
      "cloudOptimism": 0.43,
      "infraHardness": 0.53,
      "overclaimRisk": 0.46,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 28.09,
      "energyScore": 36.03,
      "emissionsScore": 33.07,
      "scenarioIntegrity": 42.23,
      "cloudBaselineScore": 18.93,
      "confidence": 26.1,
      "sovereignContribution": 34.5,
      "cloudContribution": 19.05,
      "overall": 35.72
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 8.7,
      "energyScore": 17.81,
      "emissionsScore": 13.75,
      "scenarioIntegrity": 32.79,
      "cloudBaselineScore": 42.77,
      "confidence": 18.85,
      "sovereignContribution": 23.16,
      "cloudContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "sc-005",
    "input": {
      "waterIntensity": 0.37,
      "energyIntensity": 0.36,
      "emissionsClarity": 0.35,
      "scenarioStability": 0.42,
      "cloudFootprintRate": 0.46,
      "cloudOptimism": 0.45,
      "infraHardness": 0.53,
      "overclaimRisk": 0.47,
      "costBias": "water_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 26.86,
      "energyScore": 39.64,
      "emissionsScore": 39.58,
      "scenarioIntegrity": 35.49,
      "cloudBaselineScore": 21.8,
      "confidence": 27.6,
      "sovereignContribution": 35.39,
      "cloudContribution": 22.19,
      "overall": 37.01
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 0,
      "energyScore": 19.51,
      "emissionsScore": 15.76,
      "scenarioIntegrity": 34.77,
      "cloudBaselineScore": 32.95,
      "confidence": 21.05,
      "sovereignContribution": 20.6,
      "cloudContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "sc-006",
    "input": {
      "waterIntensity": 0.41,
      "energyIntensity": 0.34,
      "emissionsClarity": 0.39,
      "scenarioStability": 0.45,
      "cloudFootprintRate": 0.5,
      "cloudOptimism": 0.4,
      "infraHardness": 0.54,
      "overclaimRisk": 0.42,
      "costBias": "balanced",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 33.94,
      "energyScore": 39.5,
      "emissionsScore": 35.84,
      "scenarioIntegrity": 47.85,
      "cloudBaselineScore": 23.08,
      "confidence": 30.35,
      "sovereignContribution": 38.87,
      "cloudContribution": 23.38,
      "overall": 40.08
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 11.98,
      "energyScore": 18.04,
      "emissionsScore": 14.31,
      "scenarioIntegrity": 34.78,
      "cloudBaselineScore": 46.72,
      "confidence": 20.5,
      "sovereignContribution": 25.17,
      "cloudContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "sc-007",
    "input": {
      "waterIntensity": 0.45,
      "energyIntensity": 0.38,
      "emissionsClarity": 0.42,
      "scenarioStability": 0.49,
      "cloudFootprintRate": 0.53,
      "cloudOptimism": 0.42,
      "infraHardness": 0.55,
      "overclaimRisk": 0.43,
      "costBias": "energy_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 31.59,
      "energyScore": 43.11,
      "emissionsScore": 26.54,
      "scenarioIntegrity": 61.29,
      "cloudBaselineScore": 25.15,
      "confidence": 33.6,
      "sovereignContribution": 39.47,
      "cloudContribution": 25.64,
      "overall": 40.98
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 8.27,
      "energyScore": 19.34,
      "emissionsScore": 15.59,
      "scenarioIntegrity": 36.3,
      "cloudBaselineScore": 34.2,
      "confidence": 22.15,
      "sovereignContribution": 22.74,
      "cloudContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "sc-008",
    "input": {
      "waterIntensity": 0.41,
      "energyIntensity": 0.43,
      "emissionsClarity": 0.46,
      "scenarioStability": 0.45,
      "cloudFootprintRate": 0.49,
      "cloudOptimism": 0.43,
      "infraHardness": 0.47,
      "overclaimRisk": 0.44,
      "costBias": "cloud_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 19.33,
      "energyScore": 35.43,
      "emissionsScore": 27.62,
      "scenarioIntegrity": 24.76,
      "cloudBaselineScore": 24.32,
      "confidence": 34.35,
      "sovereignContribution": 26.71,
      "cloudContribution": 25.23,
      "overall": 27.44
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 16.4,
      "energyScore": 20.18,
      "emissionsScore": 16.31,
      "scenarioIntegrity": 35.17,
      "cloudBaselineScore": 58.5,
      "confidence": 22.7,
      "sovereignContribution": 29.31,
      "cloudContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "sc-009",
    "input": {
      "waterIntensity": 0.46,
      "energyIntensity": 0.41,
      "emissionsClarity": 0.5,
      "scenarioStability": 0.49,
      "cloudFootprintRate": 0.53,
      "cloudOptimism": 0.39,
      "infraHardness": 0.48,
      "overclaimRisk": 0.38,
      "costBias": "balanced",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 40.05,
      "energyScore": 45.49,
      "emissionsScore": 45.68,
      "scenarioIntegrity": 52.59,
      "cloudBaselineScore": 25.81,
      "confidence": 37.35,
      "sovereignContribution": 45.69,
      "cloudContribution": 26.69,
      "overall": 46.27
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 14.91,
      "energyScore": 19.07,
      "emissionsScore": 15.29,
      "scenarioIntegrity": 35.36,
      "cloudBaselineScore": 48.88,
      "confidence": 22.7,
      "sovereignContribution": 26.7,
      "cloudContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "sc-010",
    "input": {
      "waterIntensity": 0.5,
      "energyIntensity": 0.45,
      "emissionsClarity": 0.46,
      "scenarioStability": 0.53,
      "cloudFootprintRate": 0.57,
      "cloudOptimism": 0.4,
      "infraHardness": 0.49,
      "overclaimRisk": 0.39,
      "costBias": "water_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 36.62,
      "energyScore": 49.14,
      "emissionsScore": 54.56,
      "scenarioIntegrity": 43.07,
      "cloudBaselineScore": 28.29,
      "confidence": 39,
      "sovereignContribution": 46.07,
      "cloudContribution": 29.32,
      "overall": 47.06
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 3.59,
      "energyScore": 20.18,
      "emissionsScore": 16.7,
      "scenarioIntegrity": 37.06,
      "cloudBaselineScore": 35.54,
      "confidence": 24.25,
      "sovereignContribution": 22.61,
      "cloudContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "sc-011",
    "input": {
      "waterIntensity": 0.54,
      "energyIntensity": 0.49,
      "emissionsClarity": 0.49,
      "scenarioStability": 0.57,
      "cloudFootprintRate": 0.6,
      "cloudOptimism": 0.42,
      "infraHardness": 0.49,
      "overclaimRisk": 0.4,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 47.21,
      "energyScore": 52.75,
      "emissionsScore": 47.19,
      "scenarioIntegrity": 60.27,
      "cloudBaselineScore": 30.54,
      "confidence": 42.25,
      "sovereignContribution": 51.41,
      "cloudContribution": 31.82,
      "overall": 51.88
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 17.1,
      "energyScore": 21.62,
      "emissionsScore": 18.14,
      "scenarioIntegrity": 38.58,
      "cloudBaselineScore": 54.12,
      "confidence": 26.1,
      "sovereignContribution": 29.91,
      "cloudContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "sc-012",
    "input": {
      "waterIntensity": 0.5,
      "energyIntensity": 0.48,
      "emissionsClarity": 0.53,
      "scenarioStability": 0.53,
      "cloudFootprintRate": 0.56,
      "cloudOptimism": 0.37,
      "infraHardness": 0.42,
      "overclaimRisk": 0.35,
      "costBias": "energy_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 38.19,
      "energyScore": 51.28,
      "emissionsScore": 34.4,
      "scenarioIntegrity": 67.57,
      "cloudBaselineScore": 28.34,
      "confidence": 42.1,
      "sovereignContribution": 46.73,
      "cloudContribution": 29.7,
      "overall": 47.66
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 13.23,
      "energyScore": 19.68,
      "emissionsScore": 16.17,
      "scenarioIntegrity": 35.76,
      "cloudBaselineScore": 34.93,
      "confidence": 24.35,
      "sovereignContribution": 23.95,
      "cloudContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "sc-013",
    "input": {
      "waterIntensity": 0.54,
      "energyIntensity": 0.52,
      "emissionsClarity": 0.56,
      "scenarioStability": 0.57,
      "cloudFootprintRate": 0.6,
      "cloudOptimism": 0.39,
      "infraHardness": 0.42,
      "overclaimRisk": 0.36,
      "costBias": "cloud_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 29.13,
      "energyScore": 44.88,
      "emissionsScore": 36.59,
      "scenarioIntegrity": 32.66,
      "cloudBaselineScore": 31.2,
      "confidence": 45.35,
      "sovereignContribution": 35.78,
      "cloudContribution": 32.8,
      "overall": 36.24
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 22.62,
      "energyScore": 21.35,
      "emissionsScore": 17.8,
      "scenarioIntegrity": 37.74,
      "cloudBaselineScore": 67.02,
      "confidence": 26.55,
      "sovereignContribution": 33.31,
      "cloudContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "sc-014",
    "input": {
      "waterIntensity": 0.58,
      "energyIntensity": 0.56,
      "emissionsClarity": 0.6,
      "scenarioStability": 0.61,
      "cloudFootprintRate": 0.63,
      "cloudOptimism": 0.4,
      "infraHardness": 0.43,
      "overclaimRisk": 0.36,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 52.62,
      "energyScore": 58.53,
      "emissionsScore": 56.66,
      "scenarioIntegrity": 64.86,
      "cloudBaselineScore": 33.07,
      "confidence": 49,
      "sovereignContribution": 57.86,
      "cloudContribution": 34.8,
      "overall": 57.71
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 20.03,
      "energyScore": 22.2,
      "emissionsScore": 18.59,
      "scenarioIntegrity": 38.98,
      "cloudBaselineScore": 55.96,
      "confidence": 27.85,
      "sovereignContribution": 31.15,
      "cloudContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "sc-015",
    "input": {
      "waterIntensity": 0.62,
      "energyIntensity": 0.54,
      "emissionsClarity": 0.56,
      "scenarioStability": 0.65,
      "cloudFootprintRate": 0.67,
      "cloudOptimism": 0.36,
      "infraHardness": 0.44,
      "overclaimRisk": 0.31,
      "costBias": "water_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 45.9,
      "energyScore": 58.35,
      "emissionsScore": 68.41,
      "scenarioIntegrity": 50.82,
      "cloudBaselineScore": 34.55,
      "confidence": 49.6,
      "sovereignContribution": 56.27,
      "cloudContribution": 36.22,
      "overall": 56.66
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 9.43,
      "energyScore": 21.14,
      "emissionsScore": 17.93,
      "scenarioIntegrity": 39.27,
      "cloudBaselineScore": 38.2,
      "confidence": 27.75,
      "sovereignContribution": 25.19,
      "cloudContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "sc-016",
    "input": {
      "waterIntensity": 0.58,
      "energyIntensity": 0.59,
      "emissionsClarity": 0.6,
      "scenarioStability": 0.6,
      "cloudFootprintRate": 0.63,
      "cloudOptimism": 0.37,
      "infraHardness": 0.36,
      "overclaimRisk": 0.32,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 54.46,
      "energyScore": 60.67,
      "emissionsScore": 57.87,
      "scenarioIntegrity": 65.05,
      "cloudBaselineScore": 33.73,
      "confidence": 50.35,
      "sovereignContribution": 59.24,
      "cloudContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 22.05,
      "energyScore": 21.91,
      "emissionsScore": 18.56,
      "scenarioIntegrity": 38.14,
      "cloudBaselineScore": 55.7,
      "confidence": 28.3,
      "sovereignContribution": 31.27,
      "cloudContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "sc-017",
    "input": {
      "waterIntensity": 0.62,
      "energyIntensity": 0.63,
      "emissionsClarity": 0.63,
      "scenarioStability": 0.64,
      "cloudFootprintRate": 0.67,
      "cloudOptimism": 0.39,
      "infraHardness": 0.37,
      "overclaimRisk": 0.33,
      "costBias": "energy_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 48.43,
      "energyScore": 64.28,
      "emissionsScore": 42.4,
      "scenarioIntegrity": 81.43,
      "cloudBaselineScore": 36.41,
      "confidence": 53.6,
      "sovereignContribution": 57.81,
      "cloudContribution": 38.61,
      "overall": 58.35
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 18.73,
      "energyScore": 23.42,
      "emissionsScore": 20,
      "scenarioIntegrity": 40.11,
      "cloudBaselineScore": 39.86,
      "confidence": 30.3,
      "sovereignContribution": 28.42,
      "cloudContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "sc-018",
    "input": {
      "waterIntensity": 0.66,
      "energyIntensity": 0.61,
      "emissionsClarity": 0.67,
      "scenarioStability": 0.68,
      "cloudFootprintRate": 0.7,
      "cloudOptimism": 0.34,
      "infraHardness": 0.38,
      "overclaimRisk": 0.27,
      "costBias": "cloud_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 38.33,
      "energyScore": 54.13,
      "emissionsScore": 45.52,
      "scenarioIntegrity": 40.09,
      "cloudBaselineScore": 37.08,
      "confidence": 56.35,
      "sovereignContribution": 44.52,
      "cloudContribution": 39.16,
      "overall": 44.56
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 28.36,
      "energyScore": 21.66,
      "emissionsScore": 18.31,
      "scenarioIntegrity": 39.67,
      "cloudBaselineScore": 74.27,
      "confidence": 29.5,
      "sovereignContribution": 36.45,
      "cloudContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "sc-019",
    "input": {
      "waterIntensity": 0.7,
      "energyIntensity": 0.65,
      "emissionsClarity": 0.7,
      "scenarioStability": 0.72,
      "cloudFootprintRate": 0.74,
      "cloudOptimism": 0.36,
      "infraHardness": 0.38,
      "overclaimRisk": 0.28,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 63.81,
      "energyScore": 67.74,
      "emissionsScore": 68.17,
      "scenarioIntegrity": 75.07,
      "cloudBaselineScore": 39.94,
      "confidence": 59.6,
      "sovereignContribution": 68.45,
      "cloudContribution": 42.25,
      "overall": 67.73
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 26.25,
      "energyScore": 23.32,
      "emissionsScore": 19.92,
      "scenarioIntegrity": 41.65,
      "cloudBaselineScore": 62.07,
      "confidence": 31.7,
      "sovereignContribution": 34.64,
      "cloudContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sc-020",
    "input": {
      "waterIntensity": 0.66,
      "energyIntensity": 0.7,
      "emissionsClarity": 0.66,
      "scenarioStability": 0.68,
      "cloudFootprintRate": 0.7,
      "cloudOptimism": 0.37,
      "infraHardness": 0.31,
      "overclaimRisk": 0.29,
      "costBias": "water_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 52.86,
      "energyScore": 70.06,
      "emissionsScore": 80.04,
      "scenarioIntegrity": 56.34,
      "cloudBaselineScore": 38.94,
      "confidence": 58.35,
      "sovereignContribution": 65.36,
      "cloudContribution": 41.54,
      "overall": 65.07
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 13.66,
      "energyScore": 23.93,
      "emissionsScore": 20.75,
      "scenarioIntegrity": 40.51,
      "cloudBaselineScore": 40.86,
      "confidence": 32.05,
      "sovereignContribution": 27.94,
      "cloudContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sc-021",
    "input": {
      "waterIntensity": 0.7,
      "energyIntensity": 0.68,
      "emissionsClarity": 0.7,
      "scenarioStability": 0.72,
      "cloudFootprintRate": 0.73,
      "cloudOptimism": 0.33,
      "infraHardness": 0.31,
      "overclaimRisk": 0.24,
      "costBias": "balanced",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 65.6,
      "energyScore": 69.88,
      "emissionsScore": 69.32,
      "scenarioIntegrity": 75.82,
      "cloudBaselineScore": 39.99,
      "confidence": 60.95,
      "sovereignContribution": 69.92,
      "cloudContribution": 42.54,
      "overall": 68.99
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 27.89,
      "energyScore": 22.72,
      "emissionsScore": 19.62,
      "scenarioIntegrity": 40.35,
      "cloudBaselineScore": 61.19,
      "confidence": 31.8,
      "sovereignContribution": 34.35,
      "cloudContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sc-022",
    "input": {
      "waterIntensity": 0.74,
      "energyIntensity": 0.72,
      "emissionsClarity": 0.73,
      "scenarioStability": 0.76,
      "cloudFootprintRate": 0.77,
      "cloudOptimism": 0.34,
      "infraHardness": 0.32,
      "overclaimRisk": 0.25,
      "costBias": "energy_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 57.62,
      "energyScore": 73.52,
      "emissionsScore": 50.92,
      "scenarioIntegrity": 94.56,
      "cloudBaselineScore": 42.47,
      "confidence": 64.35,
      "sovereignContribution": 67.69,
      "cloudContribution": 45.15,
      "overall": 67.63
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 24.57,
      "energyScore": 23.79,
      "emissionsScore": 20.63,
      "scenarioIntegrity": 42.05,
      "cloudBaselineScore": 42.21,
      "confidence": 33.35,
      "sovereignContribution": 30.65,
      "cloudContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "sc-023",
    "input": {
      "waterIntensity": 0.79,
      "energyIntensity": 0.76,
      "emissionsClarity": 0.77,
      "scenarioStability": 0.8,
      "cloudFootprintRate": 0.81,
      "cloudOptimism": 0.36,
      "infraHardness": 0.33,
      "overclaimRisk": 0.25,
      "costBias": "cloud_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 49.04,
      "energyScore": 67.38,
      "emissionsScore": 53.74,
      "scenarioIntegrity": 49.49,
      "cloudBaselineScore": 45.16,
      "confidence": 68.25,
      "sovereignContribution": 54.86,
      "cloudContribution": 48.03,
      "overall": 54.63
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 33.86,
      "energyScore": 25.25,
      "emissionsScore": 22.05,
      "scenarioIntegrity": 43.92,
      "cloudBaselineScore": 84.72,
      "confidence": 35.45,
      "sovereignContribution": 41.96,
      "cloudContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "sc-024",
    "input": {
      "waterIntensity": 0.75,
      "energyIntensity": 0.75,
      "emissionsClarity": 0.81,
      "scenarioStability": 0.76,
      "cloudFootprintRate": 0.77,
      "cloudOptimism": 0.31,
      "infraHardness": 0.25,
      "overclaimRisk": 0.2,
      "costBias": "balanced",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 71.55,
      "energyScore": 75.91,
      "emissionsScore": 78.99,
      "scenarioIntegrity": 80.56,
      "cloudBaselineScore": 43.13,
      "confidence": 68.1,
      "sovereignContribution": 76.66,
      "cloudContribution": 46.07,
      "overall": 75.15
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 31.21,
      "energyScore": 23.36,
      "emissionsScore": 20.13,
      "scenarioIntegrity": 41.11,
      "cloudBaselineScore": 63.65,
      "confidence": 33.9,
      "sovereignContribution": 35.89,
      "cloudContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "sc-025",
    "input": {
      "waterIntensity": 0.79,
      "energyIntensity": 0.79,
      "emissionsClarity": 0.77,
      "scenarioStability": 0.8,
      "cloudFootprintRate": 0.8,
      "cloudOptimism": 0.33,
      "infraHardness": 0.26,
      "overclaimRisk": 0.21,
      "costBias": "water_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 62.51,
      "energyScore": 79.52,
      "emissionsScore": 94.88,
      "scenarioIntegrity": 64.24,
      "cloudBaselineScore": 45.2,
      "confidence": 69.6,
      "sovereignContribution": 76.04,
      "cloudContribution": 48.27,
      "overall": 75.04
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 19.5,
      "energyScore": 24.6,
      "emissionsScore": 21.69,
      "scenarioIntegrity": 42.63,
      "cloudBaselineScore": 43.52,
      "confidence": 35.55,
      "sovereignContribution": 30.39,
      "cloudContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "sc-026",
    "input": {
      "waterIntensity": 0.83,
      "energyIntensity": 0.83,
      "emissionsClarity": 0.8,
      "scenarioStability": 0.83,
      "cloudFootprintRate": 0.84,
      "cloudOptimism": 0.34,
      "infraHardness": 0.27,
      "overclaimRisk": 0.22,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 78.52,
      "energyScore": 83.17,
      "emissionsScore": 80.3,
      "scenarioIntegrity": 87.68,
      "cloudBaselineScore": 47.68,
      "confidence": 73,
      "sovereignContribution": 82.15,
      "cloudContribution": 50.87,
      "overall": 80.52
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 33.17,
      "energyScore": 25.67,
      "emissionsScore": 22.7,
      "scenarioIntegrity": 44.32,
      "cloudBaselineScore": 68.8,
      "confidence": 37.1,
      "sovereignContribution": 38.93,
      "cloudContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "sc-027",
    "input": {
      "waterIntensity": 0.87,
      "energyIntensity": 0.81,
      "emissionsClarity": 0.84,
      "scenarioStability": 0.87,
      "cloudFootprintRate": 0.88,
      "cloudOptimism": 0.3,
      "infraHardness": 0.27,
      "overclaimRisk": 0.17,
      "costBias": "energy_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 67.26,
      "energyScore": 82.98,
      "emissionsScore": 60.03,
      "scenarioIntegrity": 100,
      "cloudBaselineScore": 49.35,
      "confidence": 75.6,
      "sovereignContribution": 76.21,
      "cloudContribution": 52.5,
      "overall": 75.94
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 30.78,
      "energyScore": 24.7,
      "emissionsScore": 21.75,
      "scenarioIntegrity": 44.62,
      "cloudBaselineScore": 45.22,
      "confidence": 37.2,
      "sovereignContribution": 33.41,
      "cloudContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "sc-028",
    "input": {
      "waterIntensity": 0.83,
      "energyIntensity": 0.86,
      "emissionsClarity": 0.87,
      "scenarioStability": 0.83,
      "cloudFootprintRate": 0.84,
      "cloudOptimism": 0.31,
      "infraHardness": 0.2,
      "overclaimRisk": 0.17,
      "costBias": "cloud_first",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 54.87,
      "energyScore": 75.3,
      "emissionsScore": 60.62,
      "scenarioIntegrity": 53.51,
      "cloudBaselineScore": 48.34,
      "confidence": 76.1,
      "sovereignContribution": 61.08,
      "cloudContribution": 51.73,
      "overall": 60.4
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 38.81,
      "energyScore": 25.25,
      "emissionsScore": 22.17,
      "scenarioIntegrity": 43.48,
      "cloudBaselineScore": 86.95,
      "confidence": 37.65,
      "sovereignContribution": 43.33,
      "cloudContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "sc-029",
    "input": {
      "waterIntensity": 0.87,
      "energyIntensity": 0.9,
      "emissionsClarity": 0.91,
      "scenarioStability": 0.87,
      "cloudFootprintRate": 0.87,
      "cloudOptimism": 0.33,
      "infraHardness": 0.2,
      "overclaimRisk": 0.18,
      "costBias": "balanced",
      "profile": "sovereign_infra_wee_accounting"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 83.89,
      "energyScore": 88.91,
      "emissionsScore": 89.72,
      "scenarioIntegrity": 92.27,
      "cloudBaselineScore": 50.59,
      "confidence": 79.6,
      "sovereignContribution": 88.57,
      "cloudContribution": 54.16,
      "overall": 86.38
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 36.33,
      "energyScore": 26.6,
      "emissionsScore": 23.46,
      "scenarioIntegrity": 45,
      "cloudBaselineScore": 71.06,
      "confidence": 39.5,
      "sovereignContribution": 40.49,
      "cloudContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "sc-030",
    "input": {
      "waterIntensity": 0.91,
      "energyIntensity": 0.88,
      "emissionsClarity": 0.87,
      "scenarioStability": 0.91,
      "cloudFootprintRate": 0.91,
      "cloudOptimism": 0.28,
      "infraHardness": 0.21,
      "overclaimRisk": 0.13,
      "costBias": "water_first",
      "profile": "naive_cloud_footprint_baseline"
    },
    "expectedSovereignWee": {
      "mode": "sovereign_infra_wee_accounting",
      "waterScore": 71.59,
      "energyScore": 88.77,
      "emissionsScore": 100,
      "scenarioIntegrity": 71.68,
      "cloudBaselineScore": 51.88,
      "confidence": 80.35,
      "sovereignContribution": 83.69,
      "cloudContribution": 55.31,
      "overall": 82.58
    },
    "expectedNaiveCloud": {
      "mode": "naive_cloud_footprint_baseline",
      "waterScore": 25.72,
      "energyScore": 25.06,
      "emissionsScore": 22.34,
      "scenarioIntegrity": 45.02,
      "cloudBaselineScore": 46.21,
      "confidence": 38.95,
      "sovereignContribution": 32.87,
      "cloudContribution": 50.68,
      "overall": 44.3
    }
  }
];
