import type { DragWallInput, DragWallQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DragWallInput;
  expectedEsClosedLoop: DragWallQuality;
  expectedOpenLoopGradient: DragWallQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dws-001",
    "input": {
      "wallCoverage": 0.29,
      "sensorFidelity": 0.25,
      "channelFit": 0.28,
      "closedLoopAgreement": 0.34,
      "openLoopAccuracy": 0.39,
      "openLoopOptimism": 0.45,
      "dragPressure": 0.59,
      "leakageRisk": 0.5,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 22.56,
      "shearDiagnosis": 30.25,
      "actuatorReasonScore": 27.38,
      "sensorIntegrity": 34.28,
      "openLoopScore": 16.4,
      "confidence": 19.35,
      "closedLoopContribution": 28.33,
      "openLoopContribution": 15.96,
      "overall": 30.1
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 5.76,
      "shearDiagnosis": 17.09,
      "actuatorReasonScore": 13.13,
      "sensorIntegrity": 32.39,
      "openLoopScore": 40.93,
      "confidence": 17.1,
      "closedLoopContribution": 21.86,
      "openLoopContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "dws-002",
    "input": {
      "wallCoverage": 0.33,
      "sensorFidelity": 0.29,
      "channelFit": 0.32,
      "closedLoopAgreement": 0.38,
      "openLoopAccuracy": 0.43,
      "openLoopOptimism": 0.46,
      "dragPressure": 0.6,
      "leakageRisk": 0.51,
      "controlBias": "sensor_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 22.22,
      "shearDiagnosis": 33.9,
      "actuatorReasonScore": 39.65,
      "sensorIntegrity": 30.06,
      "openLoopScore": 18.89,
      "confidence": 23,
      "closedLoopContribution": 31.63,
      "openLoopContribution": 18.61,
      "overall": 33.29
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 2.43,
      "shearDiagnosis": 18.22,
      "actuatorReasonScore": 14.16,
      "sensorIntegrity": 34.08,
      "openLoopScore": 31.53,
      "confidence": 18.65,
      "closedLoopContribution": 20.08,
      "openLoopContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "dws-003",
    "input": {
      "wallCoverage": 0.37,
      "sensorFidelity": 0.27,
      "channelFit": 0.36,
      "closedLoopAgreement": 0.42,
      "openLoopAccuracy": 0.46,
      "openLoopOptimism": 0.42,
      "dragPressure": 0.6,
      "leakageRisk": 0.46,
      "controlBias": "open_loop_first",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 12.18,
      "shearDiagnosis": 23.71,
      "actuatorReasonScore": 23.1,
      "sensorIntegrity": 17.39,
      "openLoopScore": 19.94,
      "confidence": 25.6,
      "closedLoopContribution": 19.15,
      "openLoopContribution": 19.69,
      "overall": 20.25
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 12.17,
      "shearDiagnosis": 17.1,
      "actuatorReasonScore": 13.13,
      "sensorIntegrity": 33.93,
      "openLoopScore": 54.34,
      "confidence": 18.4,
      "closedLoopContribution": 26.13,
      "openLoopContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "dws-004",
    "input": {
      "wallCoverage": 0.33,
      "sensorFidelity": 0.32,
      "channelFit": 0.39,
      "closedLoopAgreement": 0.38,
      "openLoopAccuracy": 0.42,
      "openLoopOptimism": 0.43,
      "dragPressure": 0.53,
      "leakageRisk": 0.46,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 28.09,
      "shearDiagnosis": 36.03,
      "actuatorReasonScore": 32.42,
      "sensorIntegrity": 42.79,
      "openLoopScore": 18.93,
      "confidence": 26.1,
      "closedLoopContribution": 34.44,
      "openLoopContribution": 19.05,
      "overall": 35.67
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 8.7,
      "shearDiagnosis": 17.81,
      "actuatorReasonScore": 13.75,
      "sensorIntegrity": 32.79,
      "openLoopScore": 42.77,
      "confidence": 18.85,
      "closedLoopContribution": 23.16,
      "openLoopContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "dws-005",
    "input": {
      "wallCoverage": 0.37,
      "sensorFidelity": 0.36,
      "channelFit": 0.35,
      "closedLoopAgreement": 0.42,
      "openLoopAccuracy": 0.46,
      "openLoopOptimism": 0.45,
      "dragPressure": 0.53,
      "leakageRisk": 0.47,
      "controlBias": "es_strict",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 26.86,
      "shearDiagnosis": 39.64,
      "actuatorReasonScore": 23.89,
      "sensorIntegrity": 49.01,
      "openLoopScore": 21.8,
      "confidence": 27.6,
      "closedLoopContribution": 33.97,
      "openLoopContribution": 22.19,
      "overall": 35.85
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 0,
      "shearDiagnosis": 19.51,
      "actuatorReasonScore": 15.76,
      "sensorIntegrity": 34.77,
      "openLoopScore": 32.95,
      "confidence": 21.05,
      "closedLoopContribution": 20.6,
      "openLoopContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "dws-006",
    "input": {
      "wallCoverage": 0.41,
      "sensorFidelity": 0.34,
      "channelFit": 0.39,
      "closedLoopAgreement": 0.45,
      "openLoopAccuracy": 0.5,
      "openLoopOptimism": 0.4,
      "dragPressure": 0.54,
      "leakageRisk": 0.42,
      "controlBias": "balanced",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 33.94,
      "shearDiagnosis": 39.5,
      "actuatorReasonScore": 39.74,
      "sensorIntegrity": 44.49,
      "openLoopScore": 23.08,
      "confidence": 30.35,
      "closedLoopContribution": 39.22,
      "openLoopContribution": 23.38,
      "overall": 40.37
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 11.98,
      "shearDiagnosis": 18.04,
      "actuatorReasonScore": 14.31,
      "sensorIntegrity": 34.78,
      "openLoopScore": 46.72,
      "confidence": 20.5,
      "closedLoopContribution": 25.17,
      "openLoopContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "dws-007",
    "input": {
      "wallCoverage": 0.45,
      "sensorFidelity": 0.38,
      "channelFit": 0.42,
      "closedLoopAgreement": 0.49,
      "openLoopAccuracy": 0.53,
      "openLoopOptimism": 0.42,
      "dragPressure": 0.55,
      "leakageRisk": 0.43,
      "controlBias": "sensor_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 31.59,
      "shearDiagnosis": 43.11,
      "actuatorReasonScore": 54.51,
      "sensorIntegrity": 37.19,
      "openLoopScore": 25.15,
      "confidence": 33.6,
      "closedLoopContribution": 42,
      "openLoopContribution": 25.64,
      "overall": 43.06
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 8.27,
      "shearDiagnosis": 19.34,
      "actuatorReasonScore": 15.59,
      "sensorIntegrity": 36.3,
      "openLoopScore": 34.2,
      "confidence": 22.15,
      "closedLoopContribution": 22.74,
      "openLoopContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "dws-008",
    "input": {
      "wallCoverage": 0.41,
      "sensorFidelity": 0.43,
      "channelFit": 0.46,
      "closedLoopAgreement": 0.45,
      "openLoopAccuracy": 0.49,
      "openLoopOptimism": 0.43,
      "dragPressure": 0.47,
      "leakageRisk": 0.44,
      "controlBias": "open_loop_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 19.33,
      "shearDiagnosis": 35.43,
      "actuatorReasonScore": 27.26,
      "sensorIntegrity": 25.07,
      "openLoopScore": 24.32,
      "confidence": 34.35,
      "closedLoopContribution": 26.68,
      "openLoopContribution": 25.23,
      "overall": 27.42
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 16.4,
      "shearDiagnosis": 20.18,
      "actuatorReasonScore": 16.31,
      "sensorIntegrity": 35.17,
      "openLoopScore": 58.5,
      "confidence": 22.7,
      "closedLoopContribution": 29.31,
      "openLoopContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "dws-009",
    "input": {
      "wallCoverage": 0.46,
      "sensorFidelity": 0.41,
      "channelFit": 0.5,
      "closedLoopAgreement": 0.49,
      "openLoopAccuracy": 0.53,
      "openLoopOptimism": 0.39,
      "dragPressure": 0.48,
      "leakageRisk": 0.38,
      "controlBias": "balanced",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 40.05,
      "shearDiagnosis": 45.49,
      "actuatorReasonScore": 45.04,
      "sensorIntegrity": 53.15,
      "openLoopScore": 25.81,
      "confidence": 37.35,
      "closedLoopContribution": 45.63,
      "openLoopContribution": 26.69,
      "overall": 46.22
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 14.91,
      "shearDiagnosis": 19.07,
      "actuatorReasonScore": 15.29,
      "sensorIntegrity": 35.36,
      "openLoopScore": 48.88,
      "confidence": 22.7,
      "closedLoopContribution": 26.7,
      "openLoopContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "dws-010",
    "input": {
      "wallCoverage": 0.5,
      "sensorFidelity": 0.45,
      "channelFit": 0.46,
      "closedLoopAgreement": 0.53,
      "openLoopAccuracy": 0.57,
      "openLoopOptimism": 0.4,
      "dragPressure": 0.49,
      "leakageRisk": 0.39,
      "controlBias": "es_strict",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 36.62,
      "shearDiagnosis": 49.14,
      "actuatorReasonScore": 33.16,
      "sensorIntegrity": 61.53,
      "openLoopScore": 28.29,
      "confidence": 39,
      "closedLoopContribution": 44.14,
      "openLoopContribution": 29.32,
      "overall": 45.47
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 3.59,
      "shearDiagnosis": 20.18,
      "actuatorReasonScore": 16.7,
      "sensorIntegrity": 37.06,
      "openLoopScore": 35.54,
      "confidence": 24.25,
      "closedLoopContribution": 22.61,
      "openLoopContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "dws-011",
    "input": {
      "wallCoverage": 0.54,
      "sensorFidelity": 0.49,
      "channelFit": 0.49,
      "closedLoopAgreement": 0.57,
      "openLoopAccuracy": 0.6,
      "openLoopOptimism": 0.42,
      "dragPressure": 0.49,
      "leakageRisk": 0.4,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 47.21,
      "shearDiagnosis": 52.75,
      "actuatorReasonScore": 52.38,
      "sensorIntegrity": 55.79,
      "openLoopScore": 30.54,
      "confidence": 42.25,
      "closedLoopContribution": 51.87,
      "openLoopContribution": 31.82,
      "overall": 52.26
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 17.1,
      "shearDiagnosis": 21.62,
      "actuatorReasonScore": 18.14,
      "sensorIntegrity": 38.58,
      "openLoopScore": 54.12,
      "confidence": 26.1,
      "closedLoopContribution": 29.91,
      "openLoopContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "dws-012",
    "input": {
      "wallCoverage": 0.5,
      "sensorFidelity": 0.48,
      "channelFit": 0.53,
      "closedLoopAgreement": 0.53,
      "openLoopAccuracy": 0.56,
      "openLoopOptimism": 0.37,
      "dragPressure": 0.42,
      "leakageRisk": 0.35,
      "controlBias": "sensor_first",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 38.19,
      "shearDiagnosis": 51.28,
      "actuatorReasonScore": 61.94,
      "sensorIntegrity": 43.82,
      "openLoopScore": 28.34,
      "confidence": 42.1,
      "closedLoopContribution": 49.22,
      "openLoopContribution": 29.7,
      "overall": 49.71
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 13.23,
      "shearDiagnosis": 19.68,
      "actuatorReasonScore": 16.17,
      "sensorIntegrity": 35.76,
      "openLoopScore": 34.93,
      "confidence": 24.35,
      "closedLoopContribution": 23.95,
      "openLoopContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "dws-013",
    "input": {
      "wallCoverage": 0.54,
      "sensorFidelity": 0.52,
      "channelFit": 0.56,
      "closedLoopAgreement": 0.57,
      "openLoopAccuracy": 0.6,
      "openLoopOptimism": 0.39,
      "dragPressure": 0.42,
      "leakageRisk": 0.36,
      "controlBias": "open_loop_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 29.13,
      "shearDiagnosis": 44.88,
      "actuatorReasonScore": 36.95,
      "sensorIntegrity": 32.35,
      "openLoopScore": 31.2,
      "confidence": 45.35,
      "closedLoopContribution": 35.81,
      "openLoopContribution": 32.8,
      "overall": 36.27
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 22.62,
      "shearDiagnosis": 21.35,
      "actuatorReasonScore": 17.8,
      "sensorIntegrity": 37.74,
      "openLoopScore": 67.02,
      "confidence": 26.55,
      "closedLoopContribution": 33.31,
      "openLoopContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "dws-014",
    "input": {
      "wallCoverage": 0.58,
      "sensorFidelity": 0.56,
      "channelFit": 0.6,
      "closedLoopAgreement": 0.61,
      "openLoopAccuracy": 0.63,
      "openLoopOptimism": 0.4,
      "dragPressure": 0.43,
      "leakageRisk": 0.36,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 52.62,
      "shearDiagnosis": 58.53,
      "actuatorReasonScore": 57.31,
      "sensorIntegrity": 64.3,
      "openLoopScore": 33.07,
      "confidence": 49,
      "closedLoopContribution": 57.92,
      "openLoopContribution": 34.8,
      "overall": 57.76
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 20.03,
      "shearDiagnosis": 22.2,
      "actuatorReasonScore": 18.59,
      "sensorIntegrity": 38.98,
      "openLoopScore": 55.96,
      "confidence": 27.85,
      "closedLoopContribution": 31.15,
      "openLoopContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "dws-015",
    "input": {
      "wallCoverage": 0.62,
      "sensorFidelity": 0.54,
      "channelFit": 0.56,
      "closedLoopAgreement": 0.65,
      "openLoopAccuracy": 0.67,
      "openLoopOptimism": 0.36,
      "dragPressure": 0.44,
      "leakageRisk": 0.31,
      "controlBias": "es_strict",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 45.9,
      "shearDiagnosis": 58.35,
      "actuatorReasonScore": 42.52,
      "sensorIntegrity": 73.14,
      "openLoopScore": 34.55,
      "confidence": 49.6,
      "closedLoopContribution": 53.93,
      "openLoopContribution": 36.22,
      "overall": 54.74
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 9.43,
      "shearDiagnosis": 21.14,
      "actuatorReasonScore": 17.93,
      "sensorIntegrity": 39.27,
      "openLoopScore": 38.2,
      "confidence": 27.75,
      "closedLoopContribution": 25.19,
      "openLoopContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "dws-016",
    "input": {
      "wallCoverage": 0.58,
      "sensorFidelity": 0.59,
      "channelFit": 0.6,
      "closedLoopAgreement": 0.6,
      "openLoopAccuracy": 0.63,
      "openLoopOptimism": 0.37,
      "dragPressure": 0.36,
      "leakageRisk": 0.32,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 54.46,
      "shearDiagnosis": 60.67,
      "actuatorReasonScore": 57.87,
      "sensorIntegrity": 65.05,
      "openLoopScore": 33.73,
      "confidence": 50.35,
      "closedLoopContribution": 59.24,
      "openLoopContribution": 35.76,
      "overall": 59.01
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 22.05,
      "shearDiagnosis": 21.91,
      "actuatorReasonScore": 18.56,
      "sensorIntegrity": 38.14,
      "openLoopScore": 55.7,
      "confidence": 28.3,
      "closedLoopContribution": 31.27,
      "openLoopContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "dws-017",
    "input": {
      "wallCoverage": 0.62,
      "sensorFidelity": 0.63,
      "channelFit": 0.63,
      "closedLoopAgreement": 0.64,
      "openLoopAccuracy": 0.67,
      "openLoopOptimism": 0.39,
      "dragPressure": 0.37,
      "leakageRisk": 0.33,
      "controlBias": "sensor_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 48.43,
      "shearDiagnosis": 64.28,
      "actuatorReasonScore": 76.01,
      "sensorIntegrity": 52.45,
      "openLoopScore": 36.41,
      "confidence": 53.6,
      "closedLoopContribution": 60.84,
      "openLoopContribution": 38.61,
      "overall": 60.84
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 18.73,
      "shearDiagnosis": 23.42,
      "actuatorReasonScore": 20,
      "sensorIntegrity": 40.11,
      "openLoopScore": 39.86,
      "confidence": 30.3,
      "closedLoopContribution": 28.42,
      "openLoopContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "dws-018",
    "input": {
      "wallCoverage": 0.66,
      "sensorFidelity": 0.61,
      "channelFit": 0.67,
      "closedLoopAgreement": 0.68,
      "openLoopAccuracy": 0.7,
      "openLoopOptimism": 0.34,
      "dragPressure": 0.38,
      "leakageRisk": 0.27,
      "controlBias": "open_loop_first",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 38.33,
      "shearDiagnosis": 54.13,
      "actuatorReasonScore": 45.88,
      "sensorIntegrity": 39.79,
      "openLoopScore": 37.08,
      "confidence": 56.35,
      "closedLoopContribution": 44.56,
      "openLoopContribution": 39.16,
      "overall": 44.59
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 28.36,
      "shearDiagnosis": 21.66,
      "actuatorReasonScore": 18.31,
      "sensorIntegrity": 39.67,
      "openLoopScore": 74.27,
      "confidence": 29.5,
      "closedLoopContribution": 36.45,
      "openLoopContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "dws-019",
    "input": {
      "wallCoverage": 0.7,
      "sensorFidelity": 0.65,
      "channelFit": 0.7,
      "closedLoopAgreement": 0.72,
      "openLoopAccuracy": 0.74,
      "openLoopOptimism": 0.36,
      "dragPressure": 0.38,
      "leakageRisk": 0.28,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 63.81,
      "shearDiagnosis": 67.74,
      "actuatorReasonScore": 69.47,
      "sensorIntegrity": 73.95,
      "openLoopScore": 39.94,
      "confidence": 59.6,
      "closedLoopContribution": 68.57,
      "openLoopContribution": 42.25,
      "overall": 67.83
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 26.25,
      "shearDiagnosis": 23.32,
      "actuatorReasonScore": 19.92,
      "sensorIntegrity": 41.65,
      "openLoopScore": 62.07,
      "confidence": 31.7,
      "closedLoopContribution": 34.64,
      "openLoopContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "dws-020",
    "input": {
      "wallCoverage": 0.66,
      "sensorFidelity": 0.7,
      "channelFit": 0.66,
      "closedLoopAgreement": 0.68,
      "openLoopAccuracy": 0.7,
      "openLoopOptimism": 0.37,
      "dragPressure": 0.31,
      "leakageRisk": 0.29,
      "controlBias": "es_strict",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 52.86,
      "shearDiagnosis": 70.06,
      "actuatorReasonScore": 46.45,
      "sensorIntegrity": 85.3,
      "openLoopScore": 38.94,
      "confidence": 58.35,
      "closedLoopContribution": 62.33,
      "openLoopContribution": 41.54,
      "overall": 62.59
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 13.66,
      "shearDiagnosis": 23.93,
      "actuatorReasonScore": 20.75,
      "sensorIntegrity": 40.51,
      "openLoopScore": 40.86,
      "confidence": 32.05,
      "closedLoopContribution": 27.94,
      "openLoopContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "dws-021",
    "input": {
      "wallCoverage": 0.7,
      "sensorFidelity": 0.68,
      "channelFit": 0.7,
      "closedLoopAgreement": 0.72,
      "openLoopAccuracy": 0.73,
      "openLoopOptimism": 0.33,
      "dragPressure": 0.31,
      "leakageRisk": 0.24,
      "controlBias": "balanced",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 65.6,
      "shearDiagnosis": 69.88,
      "actuatorReasonScore": 70.62,
      "sensorIntegrity": 74.7,
      "openLoopScore": 39.99,
      "confidence": 60.95,
      "closedLoopContribution": 70.03,
      "openLoopContribution": 42.54,
      "overall": 69.08
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 27.89,
      "shearDiagnosis": 22.72,
      "actuatorReasonScore": 19.62,
      "sensorIntegrity": 40.35,
      "openLoopScore": 61.19,
      "confidence": 31.8,
      "closedLoopContribution": 34.35,
      "openLoopContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "dws-022",
    "input": {
      "wallCoverage": 0.74,
      "sensorFidelity": 0.72,
      "channelFit": 0.73,
      "closedLoopAgreement": 0.76,
      "openLoopAccuracy": 0.77,
      "openLoopOptimism": 0.34,
      "dragPressure": 0.32,
      "leakageRisk": 0.25,
      "controlBias": "sensor_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 57.62,
      "shearDiagnosis": 73.52,
      "actuatorReasonScore": 91.49,
      "sensorIntegrity": 59.58,
      "openLoopScore": 42.47,
      "confidence": 64.35,
      "closedLoopContribution": 71.35,
      "openLoopContribution": 45.15,
      "overall": 70.63
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 24.57,
      "shearDiagnosis": 23.79,
      "actuatorReasonScore": 20.63,
      "sensorIntegrity": 42.05,
      "openLoopScore": 42.21,
      "confidence": 33.35,
      "closedLoopContribution": 30.65,
      "openLoopContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "dws-023",
    "input": {
      "wallCoverage": 0.79,
      "sensorFidelity": 0.76,
      "channelFit": 0.77,
      "closedLoopAgreement": 0.8,
      "openLoopAccuracy": 0.81,
      "openLoopOptimism": 0.36,
      "dragPressure": 0.33,
      "leakageRisk": 0.25,
      "controlBias": "open_loop_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 49.04,
      "shearDiagnosis": 67.38,
      "actuatorReasonScore": 54.82,
      "sensorIntegrity": 48.57,
      "openLoopScore": 45.16,
      "confidence": 68.25,
      "closedLoopContribution": 54.96,
      "openLoopContribution": 48.03,
      "overall": 54.71
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 33.86,
      "shearDiagnosis": 25.25,
      "actuatorReasonScore": 22.05,
      "sensorIntegrity": 43.92,
      "openLoopScore": 84.72,
      "confidence": 35.45,
      "closedLoopContribution": 41.96,
      "openLoopContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "dws-024",
    "input": {
      "wallCoverage": 0.75,
      "sensorFidelity": 0.75,
      "channelFit": 0.81,
      "closedLoopAgreement": 0.76,
      "openLoopAccuracy": 0.77,
      "openLoopOptimism": 0.31,
      "dragPressure": 0.25,
      "leakageRisk": 0.2,
      "controlBias": "balanced",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 71.55,
      "shearDiagnosis": 75.91,
      "actuatorReasonScore": 75.74,
      "sensorIntegrity": 83.36,
      "openLoopScore": 43.13,
      "confidence": 68.1,
      "closedLoopContribution": 76.37,
      "openLoopContribution": 46.07,
      "overall": 74.92
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 31.21,
      "shearDiagnosis": 23.36,
      "actuatorReasonScore": 20.13,
      "sensorIntegrity": 41.11,
      "openLoopScore": 63.65,
      "confidence": 33.9,
      "closedLoopContribution": 35.89,
      "openLoopContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "dws-025",
    "input": {
      "wallCoverage": 0.79,
      "sensorFidelity": 0.79,
      "channelFit": 0.77,
      "closedLoopAgreement": 0.8,
      "openLoopAccuracy": 0.8,
      "openLoopOptimism": 0.33,
      "dragPressure": 0.26,
      "leakageRisk": 0.21,
      "controlBias": "es_strict",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 62.51,
      "shearDiagnosis": 79.52,
      "actuatorReasonScore": 55.93,
      "sensorIntegrity": 97.81,
      "openLoopScore": 45.2,
      "confidence": 69.6,
      "closedLoopContribution": 72.52,
      "openLoopContribution": 48.27,
      "overall": 72.16
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 19.5,
      "shearDiagnosis": 24.6,
      "actuatorReasonScore": 21.69,
      "sensorIntegrity": 42.63,
      "openLoopScore": 43.52,
      "confidence": 35.55,
      "closedLoopContribution": 30.39,
      "openLoopContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "dws-026",
    "input": {
      "wallCoverage": 0.83,
      "sensorFidelity": 0.83,
      "channelFit": 0.8,
      "closedLoopAgreement": 0.83,
      "openLoopAccuracy": 0.84,
      "openLoopOptimism": 0.34,
      "dragPressure": 0.27,
      "leakageRisk": 0.22,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 78.52,
      "shearDiagnosis": 83.17,
      "actuatorReasonScore": 82.25,
      "sensorIntegrity": 86,
      "openLoopScore": 47.68,
      "confidence": 73,
      "closedLoopContribution": 82.33,
      "openLoopContribution": 50.87,
      "overall": 80.67
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 33.17,
      "shearDiagnosis": 25.67,
      "actuatorReasonScore": 22.7,
      "sensorIntegrity": 44.32,
      "openLoopScore": 68.8,
      "confidence": 37.1,
      "closedLoopContribution": 38.93,
      "openLoopContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "dws-027",
    "input": {
      "wallCoverage": 0.87,
      "sensorFidelity": 0.81,
      "channelFit": 0.84,
      "closedLoopAgreement": 0.87,
      "openLoopAccuracy": 0.88,
      "openLoopOptimism": 0.3,
      "dragPressure": 0.27,
      "leakageRisk": 0.17,
      "controlBias": "sensor_first",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 67.26,
      "shearDiagnosis": 82.98,
      "actuatorReasonScore": 100,
      "sensorIntegrity": 67.17,
      "openLoopScore": 49.35,
      "confidence": 75.6,
      "closedLoopContribution": 80.18,
      "openLoopContribution": 52.5,
      "overall": 79.2
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 30.78,
      "shearDiagnosis": 24.7,
      "actuatorReasonScore": 21.75,
      "sensorIntegrity": 44.62,
      "openLoopScore": 45.22,
      "confidence": 37.2,
      "closedLoopContribution": 33.41,
      "openLoopContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "dws-028",
    "input": {
      "wallCoverage": 0.83,
      "sensorFidelity": 0.86,
      "channelFit": 0.87,
      "closedLoopAgreement": 0.83,
      "openLoopAccuracy": 0.84,
      "openLoopOptimism": 0.31,
      "dragPressure": 0.2,
      "leakageRisk": 0.17,
      "controlBias": "open_loop_first",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 54.87,
      "shearDiagnosis": 75.3,
      "actuatorReasonScore": 59.19,
      "sensorIntegrity": 54.75,
      "openLoopScore": 48.34,
      "confidence": 76.1,
      "closedLoopContribution": 60.96,
      "openLoopContribution": 51.73,
      "overall": 60.3
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 38.81,
      "shearDiagnosis": 25.25,
      "actuatorReasonScore": 22.17,
      "sensorIntegrity": 43.48,
      "openLoopScore": 86.95,
      "confidence": 37.65,
      "closedLoopContribution": 43.33,
      "openLoopContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "dws-029",
    "input": {
      "wallCoverage": 0.87,
      "sensorFidelity": 0.9,
      "channelFit": 0.91,
      "closedLoopAgreement": 0.87,
      "openLoopAccuracy": 0.87,
      "openLoopOptimism": 0.33,
      "dragPressure": 0.2,
      "leakageRisk": 0.18,
      "controlBias": "balanced",
      "profile": "es_closed_loop"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 83.89,
      "shearDiagnosis": 88.91,
      "actuatorReasonScore": 87.12,
      "sensorIntegrity": 94.51,
      "openLoopScore": 50.59,
      "confidence": 79.6,
      "closedLoopContribution": 88.34,
      "openLoopContribution": 54.16,
      "overall": 86.19
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 36.33,
      "shearDiagnosis": 26.6,
      "actuatorReasonScore": 23.46,
      "sensorIntegrity": 45,
      "openLoopScore": 71.06,
      "confidence": 39.5,
      "closedLoopContribution": 40.49,
      "openLoopContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "dws-030",
    "input": {
      "wallCoverage": 0.91,
      "sensorFidelity": 0.88,
      "channelFit": 0.87,
      "closedLoopAgreement": 0.91,
      "openLoopAccuracy": 0.91,
      "openLoopOptimism": 0.28,
      "dragPressure": 0.21,
      "leakageRisk": 0.13,
      "controlBias": "es_strict",
      "profile": "open_loop_gradient"
    },
    "expectedEsClosedLoop": {
      "mode": "es_closed_loop",
      "dragDiagnosis": 71.59,
      "shearDiagnosis": 88.77,
      "actuatorReasonScore": 64.69,
      "sensorIntegrity": 100,
      "openLoopScore": 51.88,
      "confidence": 80.35,
      "closedLoopContribution": 80.03,
      "openLoopContribution": 55.31,
      "overall": 79.58
    },
    "expectedOpenLoopGradient": {
      "mode": "open_loop_gradient",
      "dragDiagnosis": 25.72,
      "shearDiagnosis": 25.06,
      "actuatorReasonScore": 22.34,
      "sensorIntegrity": 45.02,
      "openLoopScore": 46.21,
      "confidence": 38.95,
      "closedLoopContribution": 32.87,
      "openLoopContribution": 50.68,
      "overall": 44.3
    }
  }
];
