import type { ClipInput, ClipQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ClipInput;
  expectedMultimodal: ClipQuality;
  expectedBaseline: ClipQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "fc-001",
    "input": {
      "clipCoverage": 0.29,
      "multimodalFidelity": 0.25,
      "sensorClarity": 0.28,
      "runStability": 0.34,
      "singleSensorRate": 0.39,
      "channelOptimism": 0.45,
      "stressHardness": 0.59,
      "overclaimRisk": 0.5,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 22.56,
      "multimodalScore": 30.25,
      "sensorOptScore": 23.49,
      "packIntegrity": 37.64,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "multimodalContribution": 27.98,
      "baselineContribution": 15.96,
      "overall": 29.82
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 5.76,
      "multimodalScore": 17.09,
      "sensorOptScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "multimodalContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "fc-002",
    "input": {
      "clipCoverage": 0.33,
      "multimodalFidelity": 0.29,
      "sensorClarity": 0.32,
      "runStability": 0.38,
      "singleSensorRate": 0.43,
      "channelOptimism": 0.46,
      "stressHardness": 0.6,
      "overclaimRisk": 0.51,
      "stressBias": "sensor_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 22.22,
      "multimodalScore": 33.9,
      "sensorOptScore": 34.39,
      "packIntegrity": 31.9,
      "baselineScore": 18.89,
      "confidence": 23,
      "multimodalContribution": 30.56,
      "baselineContribution": 18.61,
      "overall": 32.41
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 2.43,
      "multimodalScore": 18.22,
      "sensorOptScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "multimodalContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "fc-003",
    "input": {
      "clipCoverage": 0.37,
      "multimodalFidelity": 0.27,
      "sensorClarity": 0.36,
      "runStability": 0.42,
      "singleSensorRate": 0.46,
      "channelOptimism": 0.42,
      "stressHardness": 0.6,
      "overclaimRisk": 0.46,
      "stressBias": "baseline_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 12.18,
      "multimodalScore": 23.71,
      "sensorOptScore": 20.95,
      "packIntegrity": 19.24,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "multimodalContribution": 18.96,
      "baselineContribution": 19.69,
      "overall": 20.09
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 12.17,
      "multimodalScore": 17.1,
      "sensorOptScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "multimodalContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "fc-004",
    "input": {
      "clipCoverage": 0.33,
      "multimodalFidelity": 0.32,
      "sensorClarity": 0.39,
      "runStability": 0.38,
      "singleSensorRate": 0.42,
      "channelOptimism": 0.43,
      "stressHardness": 0.53,
      "overclaimRisk": 0.46,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 28.09,
      "multimodalScore": 36.03,
      "sensorOptScore": 33.07,
      "packIntegrity": 42.23,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "multimodalContribution": 34.5,
      "baselineContribution": 19.05,
      "overall": 35.72
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 8.7,
      "multimodalScore": 17.81,
      "sensorOptScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "multimodalContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "fc-005",
    "input": {
      "clipCoverage": 0.37,
      "multimodalFidelity": 0.36,
      "sensorClarity": 0.35,
      "runStability": 0.42,
      "singleSensorRate": 0.46,
      "channelOptimism": 0.45,
      "stressHardness": 0.53,
      "overclaimRisk": 0.47,
      "stressBias": "multimodal_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 26.86,
      "multimodalScore": 39.64,
      "sensorOptScore": 21.39,
      "packIntegrity": 54.3,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "multimodalContribution": 34.43,
      "baselineContribution": 22.19,
      "overall": 36.23
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 0,
      "multimodalScore": 19.51,
      "sensorOptScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "multimodalContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "fc-006",
    "input": {
      "clipCoverage": 0.41,
      "multimodalFidelity": 0.34,
      "sensorClarity": 0.39,
      "runStability": 0.45,
      "singleSensorRate": 0.5,
      "channelOptimism": 0.4,
      "stressHardness": 0.54,
      "overclaimRisk": 0.42,
      "stressBias": "balanced",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 33.94,
      "multimodalScore": 39.5,
      "sensorOptScore": 35.84,
      "packIntegrity": 47.85,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "multimodalContribution": 38.87,
      "baselineContribution": 23.38,
      "overall": 40.08
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 11.98,
      "multimodalScore": 18.04,
      "sensorOptScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "multimodalContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "fc-007",
    "input": {
      "clipCoverage": 0.45,
      "multimodalFidelity": 0.38,
      "sensorClarity": 0.42,
      "runStability": 0.49,
      "singleSensorRate": 0.53,
      "channelOptimism": 0.42,
      "stressHardness": 0.55,
      "overclaimRisk": 0.43,
      "stressBias": "sensor_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 31.59,
      "multimodalScore": 43.11,
      "sensorOptScore": 48.37,
      "packIntegrity": 39.34,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "multimodalContribution": 40.76,
      "baselineContribution": 25.64,
      "overall": 42.04
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 8.27,
      "multimodalScore": 19.34,
      "sensorOptScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "multimodalContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "fc-008",
    "input": {
      "clipCoverage": 0.41,
      "multimodalFidelity": 0.43,
      "sensorClarity": 0.46,
      "runStability": 0.45,
      "singleSensorRate": 0.49,
      "channelOptimism": 0.43,
      "stressHardness": 0.47,
      "overclaimRisk": 0.44,
      "stressBias": "baseline_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 19.33,
      "multimodalScore": 35.43,
      "sensorOptScore": 27.62,
      "packIntegrity": 24.76,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "multimodalContribution": 26.71,
      "baselineContribution": 25.23,
      "overall": 27.44
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 16.4,
      "multimodalScore": 20.18,
      "sensorOptScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "multimodalContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "fc-009",
    "input": {
      "clipCoverage": 0.46,
      "multimodalFidelity": 0.41,
      "sensorClarity": 0.5,
      "runStability": 0.49,
      "singleSensorRate": 0.53,
      "channelOptimism": 0.39,
      "stressHardness": 0.48,
      "overclaimRisk": 0.38,
      "stressBias": "balanced",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 40.05,
      "multimodalScore": 45.49,
      "sensorOptScore": 45.68,
      "packIntegrity": 52.59,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "multimodalContribution": 45.69,
      "baselineContribution": 26.69,
      "overall": 46.27
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 14.91,
      "multimodalScore": 19.07,
      "sensorOptScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "multimodalContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "fc-010",
    "input": {
      "clipCoverage": 0.5,
      "multimodalFidelity": 0.45,
      "sensorClarity": 0.46,
      "runStability": 0.53,
      "singleSensorRate": 0.57,
      "channelOptimism": 0.4,
      "stressHardness": 0.49,
      "overclaimRisk": 0.39,
      "stressBias": "multimodal_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 36.62,
      "multimodalScore": 49.14,
      "sensorOptScore": 30.65,
      "packIntegrity": 66.82,
      "baselineScore": 28.29,
      "confidence": 39,
      "multimodalContribution": 44.6,
      "baselineContribution": 29.32,
      "overall": 45.85
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 3.59,
      "multimodalScore": 20.18,
      "sensorOptScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "multimodalContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "fc-011",
    "input": {
      "clipCoverage": 0.54,
      "multimodalFidelity": 0.49,
      "sensorClarity": 0.49,
      "runStability": 0.57,
      "singleSensorRate": 0.6,
      "channelOptimism": 0.42,
      "stressHardness": 0.49,
      "overclaimRisk": 0.4,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 47.21,
      "multimodalScore": 52.75,
      "sensorOptScore": 47.19,
      "packIntegrity": 60.27,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "multimodalContribution": 51.41,
      "baselineContribution": 31.82,
      "overall": 51.88
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 17.1,
      "multimodalScore": 21.62,
      "sensorOptScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "multimodalContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "fc-012",
    "input": {
      "clipCoverage": 0.5,
      "multimodalFidelity": 0.48,
      "sensorClarity": 0.53,
      "runStability": 0.53,
      "singleSensorRate": 0.56,
      "channelOptimism": 0.37,
      "stressHardness": 0.42,
      "overclaimRisk": 0.35,
      "stressBias": "sensor_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 38.19,
      "multimodalScore": 51.28,
      "sensorOptScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "multimodalContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 13.23,
      "multimodalScore": 19.68,
      "sensorOptScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "multimodalContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "fc-013",
    "input": {
      "clipCoverage": 0.54,
      "multimodalFidelity": 0.52,
      "sensorClarity": 0.56,
      "runStability": 0.57,
      "singleSensorRate": 0.6,
      "channelOptimism": 0.39,
      "stressHardness": 0.42,
      "overclaimRisk": 0.36,
      "stressBias": "baseline_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 29.13,
      "multimodalScore": 44.88,
      "sensorOptScore": 36.59,
      "packIntegrity": 32.66,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "multimodalContribution": 35.78,
      "baselineContribution": 32.8,
      "overall": 36.24
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 22.62,
      "multimodalScore": 21.35,
      "sensorOptScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "multimodalContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "fc-014",
    "input": {
      "clipCoverage": 0.58,
      "multimodalFidelity": 0.56,
      "sensorClarity": 0.6,
      "runStability": 0.61,
      "singleSensorRate": 0.63,
      "channelOptimism": 0.4,
      "stressHardness": 0.43,
      "overclaimRisk": 0.36,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 52.62,
      "multimodalScore": 58.53,
      "sensorOptScore": 56.66,
      "packIntegrity": 64.86,
      "baselineScore": 33.07,
      "confidence": 49,
      "multimodalContribution": 57.86,
      "baselineContribution": 34.8,
      "overall": 57.71
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 20.03,
      "multimodalScore": 22.2,
      "sensorOptScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "multimodalContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "fc-015",
    "input": {
      "clipCoverage": 0.62,
      "multimodalFidelity": 0.54,
      "sensorClarity": 0.56,
      "runStability": 0.65,
      "singleSensorRate": 0.67,
      "channelOptimism": 0.36,
      "stressHardness": 0.44,
      "overclaimRisk": 0.31,
      "stressBias": "multimodal_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 45.9,
      "multimodalScore": 58.35,
      "sensorOptScore": 39.3,
      "packIntegrity": 79.94,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "multimodalContribution": 54.53,
      "baselineContribution": 36.22,
      "overall": 55.23
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 9.43,
      "multimodalScore": 21.14,
      "sensorOptScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "multimodalContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "fc-016",
    "input": {
      "clipCoverage": 0.58,
      "multimodalFidelity": 0.59,
      "sensorClarity": 0.6,
      "runStability": 0.6,
      "singleSensorRate": 0.63,
      "channelOptimism": 0.37,
      "stressHardness": 0.36,
      "overclaimRisk": 0.32,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 54.46,
      "multimodalScore": 60.67,
      "sensorOptScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "multimodalContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 22.05,
      "multimodalScore": 21.91,
      "sensorOptScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "multimodalContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "fc-017",
    "input": {
      "clipCoverage": 0.62,
      "multimodalFidelity": 0.63,
      "sensorClarity": 0.63,
      "runStability": 0.64,
      "singleSensorRate": 0.67,
      "channelOptimism": 0.39,
      "stressHardness": 0.37,
      "overclaimRisk": 0.33,
      "stressBias": "sensor_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 48.43,
      "multimodalScore": 64.28,
      "sensorOptScore": 75.13,
      "packIntegrity": 52.76,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "multimodalContribution": 60.66,
      "baselineContribution": 38.61,
      "overall": 60.69
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 18.73,
      "multimodalScore": 23.42,
      "sensorOptScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "multimodalContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "fc-018",
    "input": {
      "clipCoverage": 0.66,
      "multimodalFidelity": 0.61,
      "sensorClarity": 0.67,
      "runStability": 0.68,
      "singleSensorRate": 0.7,
      "channelOptimism": 0.34,
      "stressHardness": 0.38,
      "overclaimRisk": 0.27,
      "stressBias": "baseline_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 38.33,
      "multimodalScore": 54.13,
      "sensorOptScore": 45.52,
      "packIntegrity": 40.09,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "multimodalContribution": 44.52,
      "baselineContribution": 39.16,
      "overall": 44.56
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 28.36,
      "multimodalScore": 21.66,
      "sensorOptScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "multimodalContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "fc-019",
    "input": {
      "clipCoverage": 0.7,
      "multimodalFidelity": 0.65,
      "sensorClarity": 0.7,
      "runStability": 0.72,
      "singleSensorRate": 0.74,
      "channelOptimism": 0.36,
      "stressHardness": 0.38,
      "overclaimRisk": 0.28,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 63.81,
      "multimodalScore": 67.74,
      "sensorOptScore": 68.17,
      "packIntegrity": 75.07,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "multimodalContribution": 68.45,
      "baselineContribution": 42.25,
      "overall": 67.73
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 26.25,
      "multimodalScore": 23.32,
      "sensorOptScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "multimodalContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "fc-020",
    "input": {
      "clipCoverage": 0.66,
      "multimodalFidelity": 0.7,
      "sensorClarity": 0.66,
      "runStability": 0.68,
      "singleSensorRate": 0.7,
      "channelOptimism": 0.37,
      "stressHardness": 0.31,
      "overclaimRisk": 0.29,
      "stressBias": "multimodal_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 52.86,
      "multimodalScore": 70.06,
      "sensorOptScore": 45.74,
      "packIntegrity": 86.81,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "multimodalContribution": 62.46,
      "baselineContribution": 41.54,
      "overall": 62.69
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 13.66,
      "multimodalScore": 23.93,
      "sensorOptScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "multimodalContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "fc-021",
    "input": {
      "clipCoverage": 0.7,
      "multimodalFidelity": 0.68,
      "sensorClarity": 0.7,
      "runStability": 0.72,
      "singleSensorRate": 0.73,
      "channelOptimism": 0.33,
      "stressHardness": 0.31,
      "overclaimRisk": 0.24,
      "stressBias": "balanced",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 65.6,
      "multimodalScore": 69.88,
      "sensorOptScore": 69.32,
      "packIntegrity": 75.82,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "multimodalContribution": 69.92,
      "baselineContribution": 42.54,
      "overall": 68.99
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 27.89,
      "multimodalScore": 22.72,
      "sensorOptScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "multimodalContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "fc-022",
    "input": {
      "clipCoverage": 0.74,
      "multimodalFidelity": 0.72,
      "sensorClarity": 0.73,
      "runStability": 0.76,
      "singleSensorRate": 0.77,
      "channelOptimism": 0.34,
      "stressHardness": 0.32,
      "overclaimRisk": 0.25,
      "stressBias": "sensor_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 57.62,
      "multimodalScore": 73.52,
      "sensorOptScore": 88.86,
      "packIntegrity": 60.51,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "multimodalContribution": 70.82,
      "baselineContribution": 45.15,
      "overall": 70.2
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 24.57,
      "multimodalScore": 23.79,
      "sensorOptScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "multimodalContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "fc-023",
    "input": {
      "clipCoverage": 0.79,
      "multimodalFidelity": 0.76,
      "sensorClarity": 0.77,
      "runStability": 0.8,
      "singleSensorRate": 0.81,
      "channelOptimism": 0.36,
      "stressHardness": 0.33,
      "overclaimRisk": 0.25,
      "stressBias": "baseline_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 49.04,
      "multimodalScore": 67.38,
      "sensorOptScore": 53.74,
      "packIntegrity": 49.49,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "multimodalContribution": 54.86,
      "baselineContribution": 48.03,
      "overall": 54.63
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 33.86,
      "multimodalScore": 25.25,
      "sensorOptScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "multimodalContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "fc-024",
    "input": {
      "clipCoverage": 0.75,
      "multimodalFidelity": 0.75,
      "sensorClarity": 0.81,
      "runStability": 0.76,
      "singleSensorRate": 0.77,
      "channelOptimism": 0.31,
      "stressHardness": 0.25,
      "overclaimRisk": 0.2,
      "stressBias": "balanced",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 71.55,
      "multimodalScore": 75.91,
      "sensorOptScore": 78.99,
      "packIntegrity": 80.56,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "multimodalContribution": 76.66,
      "baselineContribution": 46.07,
      "overall": 75.15
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 31.21,
      "multimodalScore": 23.36,
      "sensorOptScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "multimodalContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "fc-025",
    "input": {
      "clipCoverage": 0.79,
      "multimodalFidelity": 0.79,
      "sensorClarity": 0.77,
      "runStability": 0.8,
      "singleSensorRate": 0.8,
      "channelOptimism": 0.33,
      "stressHardness": 0.26,
      "overclaimRisk": 0.21,
      "stressBias": "multimodal_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 62.51,
      "multimodalScore": 79.52,
      "sensorOptScore": 54.86,
      "packIntegrity": 100,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "multimodalContribution": 72.7,
      "baselineContribution": 48.27,
      "overall": 72.3
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 19.5,
      "multimodalScore": 24.6,
      "sensorOptScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "multimodalContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "fc-026",
    "input": {
      "clipCoverage": 0.83,
      "multimodalFidelity": 0.83,
      "sensorClarity": 0.8,
      "runStability": 0.83,
      "singleSensorRate": 0.84,
      "channelOptimism": 0.34,
      "stressHardness": 0.27,
      "overclaimRisk": 0.22,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 78.52,
      "multimodalScore": 83.17,
      "sensorOptScore": 80.3,
      "packIntegrity": 87.68,
      "baselineScore": 47.68,
      "confidence": 73,
      "multimodalContribution": 82.15,
      "baselineContribution": 50.87,
      "overall": 80.52
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 33.17,
      "multimodalScore": 25.67,
      "sensorOptScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "multimodalContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "fc-027",
    "input": {
      "clipCoverage": 0.87,
      "multimodalFidelity": 0.81,
      "sensorClarity": 0.84,
      "runStability": 0.87,
      "singleSensorRate": 0.88,
      "channelOptimism": 0.3,
      "stressHardness": 0.27,
      "overclaimRisk": 0.17,
      "stressBias": "sensor_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 67.26,
      "multimodalScore": 82.98,
      "sensorOptScore": 100,
      "packIntegrity": 68.1,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "multimodalContribution": 80.38,
      "baselineContribution": 52.5,
      "overall": 79.36
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 30.78,
      "multimodalScore": 24.7,
      "sensorOptScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "multimodalContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "fc-028",
    "input": {
      "clipCoverage": 0.83,
      "multimodalFidelity": 0.86,
      "sensorClarity": 0.87,
      "runStability": 0.83,
      "singleSensorRate": 0.84,
      "channelOptimism": 0.31,
      "stressHardness": 0.2,
      "overclaimRisk": 0.17,
      "stressBias": "baseline_first",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 54.87,
      "multimodalScore": 75.3,
      "sensorOptScore": 60.62,
      "packIntegrity": 53.51,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "multimodalContribution": 61.08,
      "baselineContribution": 51.73,
      "overall": 60.4
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 38.81,
      "multimodalScore": 25.25,
      "sensorOptScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "multimodalContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "fc-029",
    "input": {
      "clipCoverage": 0.87,
      "multimodalFidelity": 0.9,
      "sensorClarity": 0.91,
      "runStability": 0.87,
      "singleSensorRate": 0.87,
      "channelOptimism": 0.33,
      "stressHardness": 0.2,
      "overclaimRisk": 0.18,
      "stressBias": "balanced",
      "profile": "multimodal_wearable_stress"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 83.89,
      "multimodalScore": 88.91,
      "sensorOptScore": 89.72,
      "packIntegrity": 92.27,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "multimodalContribution": 88.57,
      "baselineContribution": 54.16,
      "overall": 86.38
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 36.33,
      "multimodalScore": 26.6,
      "sensorOptScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "multimodalContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "fc-030",
    "input": {
      "clipCoverage": 0.91,
      "multimodalFidelity": 0.88,
      "sensorClarity": 0.87,
      "runStability": 0.91,
      "singleSensorRate": 0.91,
      "channelOptimism": 0.28,
      "stressHardness": 0.21,
      "overclaimRisk": 0.13,
      "stressBias": "multimodal_first",
      "profile": "single_sensor_baseline"
    },
    "expectedMultimodal": {
      "mode": "multimodal_wearable_stress",
      "clipCoverageScore": 71.59,
      "multimodalScore": 88.77,
      "sensorOptScore": 63.26,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "multimodalContribution": 79.63,
      "baselineContribution": 55.31,
      "overall": 79.25
    },
    "expectedBaseline": {
      "mode": "single_sensor_baseline",
      "clipCoverageScore": 25.72,
      "multimodalScore": 25.06,
      "sensorOptScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "multimodalContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
