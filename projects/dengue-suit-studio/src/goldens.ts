import type { SuitInput, SuitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SuitInput;
  expectedCmip6: SuitQuality;
  expectedHistorical: SuitQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ds-001",
    "input": {
      "thermalSuitIndex": 0.29,
      "populationAtRisk": 0.34,
      "climateShiftSignal": 0.25,
      "vectorNicheFidelity": 0.3,
      "spatialCoverage": 0.34,
      "historicalStickiness": 0.45,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 36.16,
      "populationScore": 37.44,
      "shiftScore": 37.94,
      "nicheScore": 22.32,
      "historicalPenalty": 32.2,
      "confidence": 14.7,
      "cmip6Contribution": 42.64,
      "historicalContribution": 29.17,
      "overall": 44.22
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 13.47,
      "populationScore": 35.95,
      "shiftScore": 26.97,
      "nicheScore": 28.1,
      "historicalPenalty": 23.56,
      "confidence": 16.44,
      "cmip6Contribution": 36.19,
      "historicalContribution": 29.1,
      "overall": 25.92
    }
  },
  {
    "id": "ds-002",
    "input": {
      "thermalSuitIndex": 0.33,
      "populationAtRisk": 0.38,
      "climateShiftSignal": 0.29,
      "vectorNicheFidelity": 0.34,
      "spatialCoverage": 0.38,
      "historicalStickiness": 0.46,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "climateBias": "ssp126_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 35.98,
      "populationScore": 22.37,
      "shiftScore": 24.19,
      "nicheScore": 25.82,
      "historicalPenalty": 32.42,
      "confidence": 17.7,
      "cmip6Contribution": 35.03,
      "historicalContribution": 22.9,
      "overall": 36.85
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 13.86,
      "populationScore": 42.75,
      "shiftScore": 27.58,
      "nicheScore": 37.09,
      "historicalPenalty": 23.69,
      "confidence": 18.85,
      "cmip6Contribution": 39.52,
      "historicalContribution": 35.63,
      "overall": 31.45
    }
  },
  {
    "id": "ds-003",
    "input": {
      "thermalSuitIndex": 0.37,
      "populationAtRisk": 0.42,
      "climateShiftSignal": 0.27,
      "vectorNicheFidelity": 0.32,
      "spatialCoverage": 0.41,
      "historicalStickiness": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "climateBias": "historical_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 26.48,
      "populationScore": 32.48,
      "shiftScore": 24.83,
      "nicheScore": 26.89,
      "historicalPenalty": 29.75,
      "confidence": 20.4,
      "cmip6Contribution": 35.64,
      "historicalContribution": 25.24,
      "overall": 34.77
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 15.25,
      "populationScore": 45.46,
      "shiftScore": 27.34,
      "nicheScore": 36.03,
      "historicalPenalty": 25.66,
      "confidence": 22.21,
      "cmip6Contribution": 39.68,
      "historicalContribution": 35.6,
      "overall": 31.52
    }
  },
  {
    "id": "ds-004",
    "input": {
      "thermalSuitIndex": 0.33,
      "populationAtRisk": 0.38,
      "climateShiftSignal": 0.31,
      "vectorNicheFidelity": 0.36,
      "spatialCoverage": 0.37,
      "historicalStickiness": 0.43,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 40.88,
      "populationScore": 40.66,
      "shiftScore": 42.74,
      "nicheScore": 27.18,
      "historicalPenalty": 30.5,
      "confidence": 19.2,
      "cmip6Contribution": 46.42,
      "historicalContribution": 32.3,
      "overall": 47.88
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 14.74,
      "populationScore": 36.29,
      "shiftScore": 25.95,
      "nicheScore": 31.74,
      "historicalPenalty": 25.09,
      "confidence": 19.29,
      "cmip6Contribution": 36.73,
      "historicalContribution": 30.69,
      "overall": 27.28
    }
  },
  {
    "id": "ds-005",
    "input": {
      "thermalSuitIndex": 0.37,
      "populationAtRisk": 0.42,
      "climateShiftSignal": 0.35,
      "vectorNicheFidelity": 0.4,
      "spatialCoverage": 0.41,
      "historicalStickiness": 0.45,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "climateBias": "ssp585_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 61.32,
      "populationScore": 53.18,
      "shiftScore": 59.73,
      "nicheScore": 30.56,
      "historicalPenalty": 31.34,
      "confidence": 22.2,
      "cmip6Contribution": 59.98,
      "historicalContribution": 40.66,
      "overall": 60.5
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 3.13,
      "populationScore": 28.49,
      "shiftScore": 26.97,
      "nicheScore": 24.58,
      "historicalPenalty": 24.78,
      "confidence": 21.7,
      "cmip6Contribution": 31.68,
      "historicalContribution": 24.77,
      "overall": 21.25
    }
  },
  {
    "id": "ds-006",
    "input": {
      "thermalSuitIndex": 0.41,
      "populationAtRisk": 0.45,
      "climateShiftSignal": 0.32,
      "vectorNicheFidelity": 0.37,
      "spatialCoverage": 0.45,
      "historicalStickiness": 0.4,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "climateBias": "balanced",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 47.18,
      "populationScore": 46.97,
      "shiftScore": 46.08,
      "nicheScore": 31.05,
      "historicalPenalty": 28.08,
      "confidence": 24.4,
      "cmip6Contribution": 51.31,
      "historicalContribution": 35.06,
      "overall": 52.39
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 17.02,
      "populationScore": 38.9,
      "shiftScore": 26.27,
      "nicheScore": 32.88,
      "historicalPenalty": 27.14,
      "confidence": 24.8,
      "cmip6Contribution": 37.59,
      "historicalContribution": 31.75,
      "overall": 28.05
    }
  },
  {
    "id": "ds-007",
    "input": {
      "thermalSuitIndex": 0.45,
      "populationAtRisk": 0.49,
      "climateShiftSignal": 0.36,
      "vectorNicheFidelity": 0.41,
      "spatialCoverage": 0.48,
      "historicalStickiness": 0.42,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "climateBias": "ssp126_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 45.78,
      "populationScore": 28.6,
      "shiftScore": 28.71,
      "nicheScore": 34.42,
      "historicalPenalty": 28.91,
      "confidence": 27.4,
      "cmip6Contribution": 41.43,
      "historicalContribution": 27.11,
      "overall": 42.85
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 17.19,
      "populationScore": 47.45,
      "shiftScore": 27.29,
      "nicheScore": 43.19,
      "historicalPenalty": 26.83,
      "confidence": 26.99,
      "cmip6Contribution": 41.66,
      "historicalContribution": 39.52,
      "overall": 34.71
    }
  },
  {
    "id": "ds-008",
    "input": {
      "thermalSuitIndex": 0.41,
      "populationAtRisk": 0.45,
      "climateShiftSignal": 0.4,
      "vectorNicheFidelity": 0.45,
      "spatialCoverage": 0.44,
      "historicalStickiness": 0.43,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "climateBias": "historical_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 31.96,
      "populationScore": 34.25,
      "shiftScore": 29.24,
      "nicheScore": 34.72,
      "historicalPenalty": 29.67,
      "confidence": 26,
      "cmip6Contribution": 38.85,
      "historicalContribution": 29.2,
      "overall": 38.11
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 16.06,
      "populationScore": 44.31,
      "shiftScore": 25.9,
      "nicheScore": 45.71,
      "historicalPenalty": 26.26,
      "confidence": 23.92,
      "cmip6Contribution": 41.14,
      "historicalContribution": 39.87,
      "overall": 35.05
    }
  },
  {
    "id": "ds-009",
    "input": {
      "thermalSuitIndex": 0.46,
      "populationAtRisk": 0.49,
      "climateShiftSignal": 0.38,
      "vectorNicheFidelity": 0.43,
      "spatialCoverage": 0.48,
      "historicalStickiness": 0.39,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "climateBias": "balanced",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 52.49,
      "populationScore": 50.18,
      "shiftScore": 50.66,
      "nicheScore": 35.99,
      "historicalPenalty": 26.93,
      "confidence": 29.2,
      "cmip6Contribution": 55.11,
      "historicalContribution": 38.17,
      "overall": 56.06
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 18.11,
      "populationScore": 39.19,
      "shiftScore": 25.66,
      "nicheScore": 36.42,
      "historicalPenalty": 28.32,
      "confidence": 27.6,
      "cmip6Contribution": 38.21,
      "historicalContribution": 33.32,
      "overall": 29.36
    }
  },
  {
    "id": "ds-010",
    "input": {
      "thermalSuitIndex": 0.5,
      "populationAtRisk": 0.53,
      "climateShiftSignal": 0.42,
      "vectorNicheFidelity": 0.47,
      "spatialCoverage": 0.52,
      "historicalStickiness": 0.4,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "climateBias": "ssp585_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 77.56,
      "populationScore": 65.07,
      "shiftScore": 70.5,
      "nicheScore": 39.49,
      "historicalPenalty": 27.15,
      "confidence": 32.2,
      "cmip6Contribution": 71.52,
      "historicalContribution": 47.79,
      "overall": 71.25
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 6.5,
      "populationScore": 29.15,
      "shiftScore": 26.27,
      "nicheScore": 27.56,
      "historicalPenalty": 28.45,
      "confidence": 30.01,
      "cmip6Contribution": 32.21,
      "historicalContribution": 25.82,
      "overall": 21.89
    }
  },
  {
    "id": "ds-011",
    "input": {
      "thermalSuitIndex": 0.54,
      "populationAtRisk": 0.57,
      "climateShiftSignal": 0.46,
      "vectorNicheFidelity": 0.51,
      "spatialCoverage": 0.55,
      "historicalStickiness": 0.42,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 60.34,
      "populationScore": 56.86,
      "shiftScore": 55.87,
      "nicheScore": 42.86,
      "historicalPenalty": 27.98,
      "confidence": 35.2,
      "cmip6Contribution": 60.4,
      "historicalContribution": 43.06,
      "overall": 61.28
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 19.67,
      "populationScore": 40.74,
      "shiftScore": 27.29,
      "nicheScore": 41.54,
      "historicalPenalty": 28.15,
      "confidence": 32.2,
      "cmip6Contribution": 40.22,
      "historicalContribution": 36.37,
      "overall": 31.58
    }
  },
  {
    "id": "ds-012",
    "input": {
      "thermalSuitIndex": 0.5,
      "populationAtRisk": 0.53,
      "climateShiftSignal": 0.44,
      "vectorNicheFidelity": 0.49,
      "spatialCoverage": 0.51,
      "historicalStickiness": 0.37,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "climateBias": "ssp126_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 51.17,
      "populationScore": 30.71,
      "shiftScore": 32.8,
      "nicheScore": 40.86,
      "historicalPenalty": 25.24,
      "confidence": 33.5,
      "cmip6Contribution": 45.28,
      "historicalContribution": 29.96,
      "overall": 46.52
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 18.76,
      "populationScore": 47.95,
      "shiftScore": 24.63,
      "nicheScore": 49.32,
      "historicalPenalty": 29.85,
      "confidence": 30.3,
      "cmip6Contribution": 42.16,
      "historicalContribution": 42.1,
      "overall": 37.01
    }
  },
  {
    "id": "ds-013",
    "input": {
      "thermalSuitIndex": 0.54,
      "populationAtRisk": 0.57,
      "climateShiftSignal": 0.48,
      "vectorNicheFidelity": 0.53,
      "spatialCoverage": 0.55,
      "historicalStickiness": 0.39,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "climateBias": "historical_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 42.64,
      "populationScore": 41.06,
      "shiftScore": 34.2,
      "nicheScore": 44.23,
      "historicalPenalty": 26.07,
      "confidence": 36.5,
      "cmip6Contribution": 45.8,
      "historicalContribution": 33.89,
      "overall": 44.66
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 19.65,
      "populationScore": 49.36,
      "shiftScore": 25.66,
      "nicheScore": 52.64,
      "historicalPenalty": 29.55,
      "confidence": 32.71,
      "cmip6Contribution": 43.55,
      "historicalContribution": 44.25,
      "overall": 38.7
    }
  },
  {
    "id": "ds-014",
    "input": {
      "thermalSuitIndex": 0.58,
      "populationAtRisk": 0.61,
      "climateShiftSignal": 0.52,
      "vectorNicheFidelity": 0.57,
      "spatialCoverage": 0.58,
      "historicalStickiness": 0.4,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 65.07,
      "populationScore": 60.08,
      "shiftScore": 60.67,
      "nicheScore": 47.73,
      "historicalPenalty": 26.29,
      "confidence": 39.7,
      "cmip6Contribution": 64.17,
      "historicalContribution": 46.2,
      "overall": 64.94
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 20.94,
      "populationScore": 41.09,
      "shiftScore": 26.27,
      "nicheScore": 45.18,
      "historicalPenalty": 29.68,
      "confidence": 35.05,
      "cmip6Contribution": 40.76,
      "historicalContribution": 37.96,
      "overall": 32.94
    }
  },
  {
    "id": "ds-015",
    "input": {
      "thermalSuitIndex": 0.62,
      "populationAtRisk": 0.65,
      "climateShiftSignal": 0.5,
      "vectorNicheFidelity": 0.55,
      "spatialCoverage": 0.62,
      "historicalStickiness": 0.36,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "climateBias": "ssp585_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 93.57,
      "populationScore": 77.55,
      "shiftScore": 81.42,
      "nicheScore": 48.8,
      "historicalPenalty": 23.62,
      "confidence": 42.4,
      "cmip6Contribution": 83.07,
      "historicalContribution": 55.41,
      "overall": 82.09
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 10.05,
      "populationScore": 29.89,
      "shiftScore": 26.02,
      "nicheScore": 31.14,
      "historicalPenalty": 31.65,
      "confidence": 38.63,
      "cmip6Contribution": 33.09,
      "historicalContribution": 27.31,
      "overall": 23
    }
  },
  {
    "id": "ds-016",
    "input": {
      "thermalSuitIndex": 0.58,
      "populationAtRisk": 0.6,
      "climateShiftSignal": 0.53,
      "vectorNicheFidelity": 0.58,
      "spatialCoverage": 0.58,
      "historicalStickiness": 0.37,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 65.39,
      "populationScore": 59.46,
      "shiftScore": 62.22,
      "nicheScore": 48.39,
      "historicalPenalty": 24.4,
      "confidence": 40.5,
      "cmip6Contribution": 64.81,
      "historicalContribution": 46.38,
      "overall": 65.49
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 21.21,
      "populationScore": 40.42,
      "shiftScore": 24.58,
      "nicheScore": 45.52,
      "historicalPenalty": 31.02,
      "confidence": 35.08,
      "cmip6Contribution": 40.14,
      "historicalContribution": 37.61,
      "overall": 32.77
    }
  },
  {
    "id": "ds-017",
    "input": {
      "thermalSuitIndex": 0.62,
      "populationAtRisk": 0.64,
      "climateShiftSignal": 0.57,
      "vectorNicheFidelity": 0.62,
      "spatialCoverage": 0.62,
      "historicalStickiness": 0.39,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "climateBias": "ssp126_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 61.93,
      "populationScore": 37.18,
      "shiftScore": 38.07,
      "nicheScore": 51.77,
      "historicalPenalty": 25.24,
      "confidence": 43.5,
      "cmip6Contribution": 51.58,
      "historicalContribution": 35.76,
      "overall": 52.73
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 21.6,
      "populationScore": 51.35,
      "shiftScore": 25.61,
      "nicheScore": 59.8,
      "historicalPenalty": 30.72,
      "confidence": 37.49,
      "cmip6Contribution": 45.53,
      "historicalContribution": 48.16,
      "overall": 41.88
    }
  },
  {
    "id": "ds-018",
    "input": {
      "thermalSuitIndex": 0.66,
      "populationAtRisk": 0.68,
      "climateShiftSignal": 0.55,
      "vectorNicheFidelity": 0.6,
      "spatialCoverage": 0.65,
      "historicalStickiness": 0.34,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "climateBias": "historical_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 52.49,
      "populationScore": 47.29,
      "shiftScore": 38.92,
      "nicheScore": 52.96,
      "historicalPenalty": 21.95,
      "confidence": 46.4,
      "cmip6Contribution": 52.38,
      "historicalContribution": 38.1,
      "overall": 50.81
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 23.11,
      "populationScore": 54.06,
      "shiftScore": 24.95,
      "nicheScore": 58.74,
      "historicalPenalty": 33.12,
      "confidence": 41.01,
      "cmip6Contribution": 45.55,
      "historicalContribution": 48.05,
      "overall": 41.92
    }
  },
  {
    "id": "ds-019",
    "input": {
      "thermalSuitIndex": 0.7,
      "populationAtRisk": 0.72,
      "climateShiftSignal": 0.59,
      "vectorNicheFidelity": 0.64,
      "spatialCoverage": 0.69,
      "historicalStickiness": 0.36,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 76.09,
      "populationScore": 69.6,
      "shiftScore": 68.59,
      "nicheScore": 56.34,
      "historicalPenalty": 22.78,
      "confidence": 49.4,
      "cmip6Contribution": 72.68,
      "historicalContribution": 52.08,
      "overall": 72.97
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 24.5,
      "populationScore": 44.04,
      "shiftScore": 25.97,
      "nicheScore": 49.96,
      "historicalPenalty": 32.82,
      "confidence": 43.41,
      "cmip6Contribution": 42.33,
      "historicalContribution": 40.68,
      "overall": 35.16
    }
  },
  {
    "id": "ds-020",
    "input": {
      "thermalSuitIndex": 0.66,
      "populationAtRisk": 0.68,
      "climateShiftSignal": 0.63,
      "vectorNicheFidelity": 0.68,
      "spatialCoverage": 0.65,
      "historicalStickiness": 0.37,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "climateBias": "ssp585_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 100,
      "populationScore": 80.8,
      "shiftScore": 92.02,
      "nicheScore": 56.63,
      "historicalPenalty": 23.54,
      "confidence": 48,
      "cmip6Contribution": 88.47,
      "historicalContribution": 61.28,
      "overall": 87.58
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 10.87,
      "populationScore": 27.65,
      "shiftScore": 24.58,
      "nicheScore": 35.2,
      "historicalPenalty": 32.25,
      "confidence": 40.35,
      "cmip6Contribution": 33.21,
      "historicalContribution": 28.21,
      "overall": 23.61
    }
  },
  {
    "id": "ds-021",
    "input": {
      "thermalSuitIndex": 0.7,
      "populationAtRisk": 0.72,
      "climateShiftSignal": 0.61,
      "vectorNicheFidelity": 0.66,
      "spatialCoverage": 0.68,
      "historicalStickiness": 0.33,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "climateBias": "balanced",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 76.83,
      "populationScore": 69.35,
      "shiftScore": 70.48,
      "nicheScore": 57.7,
      "historicalPenalty": 20.87,
      "confidence": 50.7,
      "cmip6Contribution": 73.63,
      "historicalContribution": 52.68,
      "overall": 73.86
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 24.76,
      "populationScore": 43.6,
      "shiftScore": 24.34,
      "nicheScore": 51.04,
      "historicalPenalty": 34.22,
      "confidence": 43.7,
      "cmip6Contribution": 41.9,
      "historicalContribution": 40.78,
      "overall": 35.39
    }
  },
  {
    "id": "ds-022",
    "input": {
      "thermalSuitIndex": 0.74,
      "populationAtRisk": 0.76,
      "climateShiftSignal": 0.65,
      "vectorNicheFidelity": 0.7,
      "spatialCoverage": 0.72,
      "historicalStickiness": 0.34,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "climateBias": "ssp126_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 72.1,
      "populationScore": 43.75,
      "shiftScore": 43.02,
      "nicheScore": 61.2,
      "historicalPenalty": 21.09,
      "confidence": 53.7,
      "cmip6Contribution": 58.41,
      "historicalContribution": 40.36,
      "overall": 59.16
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 25.15,
      "populationScore": 56.44,
      "shiftScore": 24.95,
      "nicheScore": 66.83,
      "historicalPenalty": 34.35,
      "confidence": 46.12,
      "cmip6Contribution": 47.8,
      "historicalContribution": 52.56,
      "overall": 45.57
    }
  },
  {
    "id": "ds-023",
    "input": {
      "thermalSuitIndex": 0.79,
      "populationAtRisk": 0.8,
      "climateShiftSignal": 0.69,
      "vectorNicheFidelity": 0.74,
      "spatialCoverage": 0.76,
      "historicalStickiness": 0.36,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "climateBias": "historical_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 64.13,
      "populationScore": 54.1,
      "shiftScore": 44.5,
      "nicheScore": 64.78,
      "historicalPenalty": 21.85,
      "confidence": 57.2,
      "cmip6Contribution": 59.13,
      "historicalContribution": 44.28,
      "overall": 57.46
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 25.98,
      "populationScore": 57.81,
      "shiftScore": 25.97,
      "nicheScore": 70.05,
      "historicalPenalty": 34.13,
      "confidence": 48.62,
      "cmip6Contribution": 49.14,
      "historicalContribution": 54.6,
      "overall": 47.16
    }
  },
  {
    "id": "ds-024",
    "input": {
      "thermalSuitIndex": 0.75,
      "populationAtRisk": 0.76,
      "climateShiftSignal": 0.67,
      "vectorNicheFidelity": 0.72,
      "spatialCoverage": 0.72,
      "historicalStickiness": 0.31,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "climateBias": "balanced",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 82.14,
      "populationScore": 72.82,
      "shiftScore": 75.5,
      "nicheScore": 62.77,
      "historicalPenalty": 19.11,
      "confidence": 55.5,
      "cmip6Contribution": 77.71,
      "historicalContribution": 55.92,
      "overall": 77.79
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 26.07,
      "populationScore": 43.9,
      "shiftScore": 23.32,
      "nicheScore": 54.58,
      "historicalPenalty": 35.84,
      "confidence": 46.72,
      "cmip6Contribution": 42.41,
      "historicalContribution": 42.27,
      "overall": 36.6
    }
  },
  {
    "id": "ds-025",
    "input": {
      "thermalSuitIndex": 0.79,
      "populationAtRisk": 0.8,
      "climateShiftSignal": 0.71,
      "vectorNicheFidelity": 0.76,
      "spatialCoverage": 0.75,
      "historicalStickiness": 0.33,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "climateBias": "ssp585_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 100,
      "populationScore": 93.28,
      "shiftScore": 100,
      "nicheScore": 66.14,
      "historicalPenalty": 19.94,
      "confidence": 58.5,
      "cmip6Contribution": 94.53,
      "historicalContribution": 68.14,
      "overall": 93.78
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 14.24,
      "populationScore": 28.35,
      "shiftScore": 24.34,
      "nicheScore": 38.67,
      "historicalPenalty": 35.53,
      "confidence": 48.91,
      "cmip6Contribution": 34.01,
      "historicalContribution": 29.6,
      "overall": 24.57
    }
  },
  {
    "id": "ds-026",
    "input": {
      "thermalSuitIndex": 0.83,
      "populationAtRisk": 0.83,
      "climateShiftSignal": 0.74,
      "vectorNicheFidelity": 0.79,
      "spatialCoverage": 0.79,
      "historicalStickiness": 0.34,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 89.57,
      "populationScore": 78.88,
      "shiftScore": 80.16,
      "nicheScore": 68.94,
      "historicalPenalty": 20.19,
      "confidence": 61,
      "cmip6Contribution": 82.56,
      "historicalContribution": 60.28,
      "overall": 82.55
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 27.41,
      "populationScore": 45.21,
      "shiftScore": 24.9,
      "nicheScore": 58.96,
      "historicalPenalty": 35.61,
      "confidence": 50.85,
      "cmip6Contribution": 44.17,
      "historicalContribution": 44.87,
      "overall": 38.42
    }
  },
  {
    "id": "ds-027",
    "input": {
      "thermalSuitIndex": 0.87,
      "populationAtRisk": 0.87,
      "climateShiftSignal": 0.72,
      "vectorNicheFidelity": 0.77,
      "spatialCoverage": 0.83,
      "historicalStickiness": 0.3,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "climateBias": "ssp126_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 82.4,
      "populationScore": 50.23,
      "shiftScore": 47.67,
      "nicheScore": 70.01,
      "historicalPenalty": 17.52,
      "confidence": 63.7,
      "cmip6Contribution": 65.07,
      "historicalContribution": 44.65,
      "overall": 65.39
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 28.52,
      "populationScore": 61.1,
      "shiftScore": 24.66,
      "nicheScore": 72.83,
      "historicalPenalty": 37.58,
      "confidence": 54.43,
      "cmip6Contribution": 49.91,
      "historicalContribution": 56.35,
      "overall": 48.69
    }
  },
  {
    "id": "ds-028",
    "input": {
      "thermalSuitIndex": 0.83,
      "populationAtRisk": 0.83,
      "climateShiftSignal": 0.76,
      "vectorNicheFidelity": 0.81,
      "spatialCoverage": 0.79,
      "historicalStickiness": 0.31,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "climateBias": "historical_first",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 68.64,
      "populationScore": 55.87,
      "shiftScore": 48.28,
      "nicheScore": 70.3,
      "historicalPenalty": 18.27,
      "confidence": 62.5,
      "cmip6Contribution": 62.53,
      "historicalContribution": 46.74,
      "overall": 60.69
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 27.51,
      "populationScore": 57.96,
      "shiftScore": 23.27,
      "nicheScore": 75.35,
      "historicalPenalty": 37.01,
      "confidence": 51.51,
      "cmip6Contribution": 49.42,
      "historicalContribution": 56.7,
      "overall": 49.1
    }
  },
  {
    "id": "ds-029",
    "input": {
      "thermalSuitIndex": 0.87,
      "populationAtRisk": 0.87,
      "climateShiftSignal": 0.8,
      "vectorNicheFidelity": 0.85,
      "spatialCoverage": 0.82,
      "historicalStickiness": 0.33,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "climateBias": "balanced",
      "profile": "cmip6_thermal_suitability"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 94.3,
      "populationScore": 82.09,
      "shiftScore": 84.74,
      "nicheScore": 73.68,
      "historicalPenalty": 19.11,
      "confidence": 65.5,
      "cmip6Contribution": 86.17,
      "historicalContribution": 63.4,
      "overall": 86.07
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 28.68,
      "populationScore": 45.56,
      "shiftScore": 24.29,
      "nicheScore": 62.6,
      "historicalPenalty": 36.71,
      "confidence": 53.7,
      "cmip6Contribution": 44.88,
      "historicalContribution": 46.55,
      "overall": 39.88
    }
  },
  {
    "id": "ds-030",
    "input": {
      "thermalSuitIndex": 0.91,
      "populationAtRisk": 0.91,
      "climateShiftSignal": 0.78,
      "vectorNicheFidelity": 0.83,
      "spatialCoverage": 0.86,
      "historicalStickiness": 0.28,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "climateBias": "ssp585_first",
      "profile": "static_historical_baseline"
    },
    "expectedCmip6": {
      "mode": "cmip6_thermal_suitability",
      "thermalScore": 100,
      "populationScore": 100,
      "shiftScore": 100,
      "nicheScore": 74.87,
      "historicalPenalty": 15.82,
      "confidence": 68.2,
      "cmip6Contribution": 97.15,
      "historicalContribution": 71.3,
      "overall": 96.5
    },
    "expectedHistorical": {
      "mode": "static_historical_baseline",
      "thermalScore": 17.79,
      "populationScore": 29.05,
      "shiftScore": 23.64,
      "nicheScore": 41.75,
      "historicalPenalty": 39.11,
      "confidence": 57.27,
      "cmip6Contribution": 34.62,
      "historicalContribution": 30.74,
      "overall": 25.35
    }
  }
];
