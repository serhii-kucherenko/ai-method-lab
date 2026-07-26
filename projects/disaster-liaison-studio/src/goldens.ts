import type { LiaisonInput, LiaisonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LiaisonInput;
  expectedPediatric: LiaisonQuality;
  expectedGenericHq: LiaisonQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dl-001",
    "input": {
      "pediatricLoad": 0.55,
      "perinatalRisk": 0.49,
      "liaisonCoverage": 0.34,
      "handoffLatency": 0.55,
      "hqCoordination": 0.34,
      "surgePressure": 0.5,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 44.92,
      "coverageScore": 45.79,
      "handoffScore": 44.43,
      "surgeScore": 38.25,
      "hqPenalty": 33.01,
      "confidence": 17.92,
      "liaisonContribution": 49.06,
      "hqContribution": 38.36,
      "overall": 51.13
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 31.73,
      "coverageScore": 30.85,
      "handoffScore": 27.84,
      "surgeScore": 27.3,
      "hqPenalty": 19.93,
      "confidence": 16.61,
      "liaisonContribution": 39.56,
      "hqContribution": 28.02,
      "overall": 24.86
    }
  },
  {
    "id": "dl-002",
    "input": {
      "pediatricLoad": 0.56,
      "perinatalRisk": 0.5,
      "liaisonCoverage": 0.38,
      "handoffLatency": 0.56,
      "hqCoordination": 0.38,
      "surgePressure": 0.51,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "liaisonBias": "handoff_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 51.13,
      "coverageScore": 38.05,
      "handoffScore": 60.17,
      "surgeScore": 38.2,
      "hqPenalty": 32.88,
      "confidence": 19.62,
      "liaisonContribution": 51.81,
      "hqContribution": 44.36,
      "overall": 54.47
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 32.38,
      "coverageScore": 37.97,
      "handoffScore": 27.81,
      "surgeScore": 33.65,
      "hqPenalty": 18.86,
      "confidence": 18.24,
      "liaisonContribution": 42.59,
      "hqContribution": 31.37,
      "overall": 28.14
    }
  },
  {
    "id": "dl-003",
    "input": {
      "pediatricLoad": 0.5,
      "perinatalRisk": 0.51,
      "liaisonCoverage": 0.42,
      "handoffLatency": 0.5,
      "hqCoordination": 0.42,
      "surgePressure": 0.46,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "liaisonBias": "hq_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 18.38,
      "coverageScore": 33.54,
      "handoffScore": 30.07,
      "surgeScore": 43.52,
      "hqPenalty": 55.49,
      "confidence": 24.06,
      "liaisonContribution": 30.51,
      "hqContribution": 26.71,
      "overall": 30.83
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 33.3,
      "coverageScore": 41.88,
      "handoffScore": 30.8,
      "surgeScore": 36.12,
      "hqPenalty": 16.73,
      "confidence": 22.65,
      "liaisonContribution": 45.07,
      "hqContribution": 33.54,
      "overall": 30.32
    }
  },
  {
    "id": "dl-004",
    "input": {
      "pediatricLoad": 0.51,
      "perinatalRisk": 0.43,
      "liaisonCoverage": 0.38,
      "handoffLatency": 0.51,
      "hqCoordination": 0.38,
      "surgePressure": 0.46,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 50.52,
      "coverageScore": 49.63,
      "handoffScore": 48.78,
      "surgeScore": 42.47,
      "hqPenalty": 30.99,
      "confidence": 21.72,
      "liaisonContribution": 53.18,
      "hqContribution": 42.29,
      "overall": 55.22
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 35.43,
      "coverageScore": 34.05,
      "handoffScore": 29.97,
      "surgeScore": 29.12,
      "hqPenalty": 17.71,
      "confidence": 20.54,
      "liaisonContribution": 42.17,
      "hqContribution": 31.5,
      "overall": 28.15
    }
  },
  {
    "id": "dl-005",
    "input": {
      "pediatricLoad": 0.51,
      "perinatalRisk": 0.44,
      "liaisonCoverage": 0.42,
      "handoffLatency": 0.51,
      "hqCoordination": 0.42,
      "surgePressure": 0.47,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "liaisonBias": "pediatric_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 57.38,
      "coverageScore": 59.95,
      "handoffScore": 29.68,
      "surgeScore": 42.66,
      "hqPenalty": 30.64,
      "confidence": 23.64,
      "liaisonContribution": 54.26,
      "hqContribution": 41.57,
      "overall": 55.98
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 23.96,
      "coverageScore": 27.29,
      "handoffScore": 30.37,
      "surgeScore": 22.06,
      "hqPenalty": 16.52,
      "confidence": 22.42,
      "liaisonContribution": 37.43,
      "hqContribution": 22.05,
      "overall": 19.67
    }
  },
  {
    "id": "dl-006",
    "input": {
      "pediatricLoad": 0.46,
      "perinatalRisk": 0.45,
      "liaisonCoverage": 0.45,
      "handoffLatency": 0.46,
      "hqCoordination": 0.45,
      "surgePressure": 0.42,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "liaisonBias": "balanced",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 53.43,
      "coverageScore": 55.4,
      "handoffScore": 55.04,
      "surgeScore": 47.53,
      "hqPenalty": 28.95,
      "confidence": 27.33,
      "liaisonContribution": 57.59,
      "hqContribution": 45.51,
      "overall": 59.42
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 37.12,
      "coverageScore": 38.3,
      "handoffScore": 32.83,
      "surgeScore": 31.56,
      "hqPenalty": 14.83,
      "confidence": 26.06,
      "liaisonContribution": 45,
      "hqContribution": 34.12,
      "overall": 30.75
    }
  },
  {
    "id": "dl-007",
    "input": {
      "pediatricLoad": 0.47,
      "perinatalRisk": 0.46,
      "liaisonCoverage": 0.49,
      "handoffLatency": 0.47,
      "hqCoordination": 0.49,
      "surgePressure": 0.43,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "liaisonBias": "handoff_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 60.58,
      "coverageScore": 44.89,
      "handoffScore": 74.26,
      "surgeScore": 47.48,
      "hqPenalty": 28.82,
      "confidence": 29.03,
      "liaisonContribution": 60.48,
      "hqContribution": 52.63,
      "overall": 63.07
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 37.77,
      "coverageScore": 47.08,
      "handoffScore": 32.8,
      "surgeScore": 38.82,
      "hqPenalty": 13.76,
      "confidence": 27.69,
      "liaisonContribution": 48.54,
      "hqContribution": 38.06,
      "overall": 34.61
    }
  },
  {
    "id": "dl-008",
    "input": {
      "pediatricLoad": 0.47,
      "perinatalRisk": 0.39,
      "liaisonCoverage": 0.45,
      "handoffLatency": 0.47,
      "hqCoordination": 0.45,
      "surgePressure": 0.44,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "liaisonBias": "hq_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 23.14,
      "coverageScore": 35.51,
      "handoffScore": 31.89,
      "surgeScore": 46.07,
      "hqPenalty": 53.51,
      "confidence": 26.71,
      "liaisonContribution": 33.23,
      "hqContribution": 29.42,
      "overall": 33.54
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 38.81,
      "coverageScore": 44.71,
      "handoffScore": 32.4,
      "surgeScore": 37.38,
      "hqPenalty": 14.72,
      "confidence": 25.64,
      "liaisonContribution": 47.72,
      "hqContribution": 37.88,
      "overall": 34.22
    }
  },
  {
    "id": "dl-009",
    "input": {
      "pediatricLoad": 0.42,
      "perinatalRisk": 0.39,
      "liaisonCoverage": 0.49,
      "handoffLatency": 0.42,
      "hqCoordination": 0.49,
      "surgePressure": 0.38,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "liaisonBias": "balanced",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 59.03,
      "coverageScore": 59.24,
      "handoffScore": 59.39,
      "surgeScore": 51.75,
      "hqPenalty": 26.93,
      "confidence": 31.13,
      "liaisonContribution": 61.7,
      "hqContribution": 49.43,
      "overall": 63.49
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 40.82,
      "coverageScore": 41.49,
      "handoffScore": 34.96,
      "surgeScore": 33.38,
      "hqPenalty": 12.6,
      "confidence": 30,
      "liaisonContribution": 47.61,
      "hqContribution": 37.59,
      "overall": 34.03
    }
  },
  {
    "id": "dl-010",
    "input": {
      "pediatricLoad": 0.43,
      "perinatalRisk": 0.4,
      "liaisonCoverage": 0.53,
      "handoffLatency": 0.43,
      "hqCoordination": 0.53,
      "surgePressure": 0.39,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "liaisonBias": "pediatric_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 66.8,
      "coverageScore": 71.47,
      "handoffScore": 35.5,
      "surgeScore": 51.69,
      "hqPenalty": 26.8,
      "confidence": 32.83,
      "liaisonContribution": 62.56,
      "hqContribution": 48.2,
      "overall": 63.98
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 29.47,
      "coverageScore": 32.57,
      "handoffScore": 34.92,
      "surgeScore": 25.28,
      "hqPenalty": 11.53,
      "confidence": 31.63,
      "liaisonContribution": 42.14,
      "hqContribution": 27.44,
      "overall": 24.91
    }
  },
  {
    "id": "dl-011",
    "input": {
      "pediatricLoad": 0.43,
      "perinatalRisk": 0.41,
      "liaisonCoverage": 0.57,
      "handoffLatency": 0.43,
      "hqCoordination": 0.57,
      "surgePressure": 0.4,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 61.82,
      "coverageScore": 63.17,
      "handoffScore": 62.26,
      "surgeScore": 51.89,
      "hqPenalty": 26.45,
      "confidence": 34.75,
      "liaisonContribution": 64.46,
      "hqContribution": 51.33,
      "overall": 66.1
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 43.01,
      "coverageScore": 44.28,
      "handoffScore": 35.32,
      "surgeScore": 34.85,
      "hqPenalty": 10.35,
      "confidence": 33.51,
      "liaisonContribution": 49.42,
      "hqContribution": 39.69,
      "overall": 36.01
    }
  },
  {
    "id": "dl-012",
    "input": {
      "pediatricLoad": 0.38,
      "perinatalRisk": 0.34,
      "liaisonCoverage": 0.53,
      "handoffLatency": 0.38,
      "hqCoordination": 0.53,
      "surgePressure": 0.35,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "liaisonBias": "handoff_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 70.79,
      "coverageScore": 49.57,
      "handoffScore": 84.13,
      "surgeScore": 55.36,
      "hqPenalty": 25.04,
      "confidence": 34.73,
      "liaisonContribution": 67.69,
      "hqContribution": 60.07,
      "overall": 70.32
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 43.54,
      "coverageScore": 52.39,
      "handoffScore": 37.08,
      "surgeScore": 42.24,
      "hqPenalty": 10.47,
      "confidence": 33.73,
      "liaisonContribution": 52.96,
      "hqContribution": 43.83,
      "overall": 40.02
    }
  },
  {
    "id": "dl-013",
    "input": {
      "pediatricLoad": 0.38,
      "perinatalRisk": 0.35,
      "liaisonCoverage": 0.57,
      "handoffLatency": 0.38,
      "hqCoordination": 0.57,
      "surgePressure": 0.36,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "liaisonBias": "hq_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 28.6,
      "coverageScore": 42.66,
      "handoffScore": 38.26,
      "surgeScore": 55.56,
      "hqPenalty": 49.33,
      "confidence": 36.65,
      "liaisonContribution": 39.2,
      "hqContribution": 34.39,
      "overall": 39.33
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 44.58,
      "coverageScore": 54.41,
      "handoffScore": 37.48,
      "surgeScore": 42.8,
      "hqPenalty": 9.29,
      "confidence": 35.61,
      "liaisonContribution": 54,
      "hqContribution": 44.98,
      "overall": 41.08
    }
  },
  {
    "id": "dl-014",
    "input": {
      "pediatricLoad": 0.39,
      "perinatalRisk": 0.35,
      "liaisonCoverage": 0.61,
      "handoffLatency": 0.39,
      "hqCoordination": 0.61,
      "surgePressure": 0.36,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 67.42,
      "coverageScore": 67.01,
      "handoffScore": 66.61,
      "surgeScore": 56.11,
      "hqPenalty": 24.43,
      "confidence": 38.55,
      "liaisonContribution": 68.58,
      "hqContribution": 55.25,
      "overall": 70.18
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 46.71,
      "coverageScore": 47.48,
      "handoffScore": 37.45,
      "surgeScore": 36.67,
      "hqPenalty": 8.13,
      "confidence": 37.44,
      "liaisonContribution": 52.04,
      "hqContribution": 43.17,
      "overall": 39.3
    }
  },
  {
    "id": "dl-015",
    "input": {
      "pediatricLoad": 0.34,
      "perinatalRisk": 0.36,
      "liaisonCoverage": 0.65,
      "handoffLatency": 0.34,
      "hqCoordination": 0.65,
      "surgePressure": 0.31,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "liaisonBias": "pediatric_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 76.81,
      "coverageScore": 83.99,
      "handoffScore": 41.86,
      "surgeScore": 61.18,
      "hqPenalty": 22.62,
      "confidence": 42.77,
      "liaisonContribution": 71.52,
      "hqContribution": 55.21,
      "overall": 72.58
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 35.24,
      "coverageScore": 38.11,
      "handoffScore": 40.01,
      "surgeScore": 28.63,
      "hqPenalty": 6.11,
      "confidence": 41.61,
      "liaisonContribution": 47.18,
      "hqContribution": 33.09,
      "overall": 30.37
    }
  },
  {
    "id": "dl-016",
    "input": {
      "pediatricLoad": 0.34,
      "perinatalRisk": 0.29,
      "liaisonCoverage": 0.6,
      "handoffLatency": 0.34,
      "hqCoordination": 0.6,
      "surgePressure": 0.32,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 70.51,
      "coverageScore": 68.3,
      "handoffScore": 69.28,
      "surgeScore": 59.57,
      "hqPenalty": 22.79,
      "confidence": 39.92,
      "liaisonContribution": 70.74,
      "hqContribution": 57.48,
      "overall": 72.35
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 48.4,
      "coverageScore": 48.56,
      "handoffScore": 39.51,
      "surgeScore": 37.11,
      "hqPenalty": 7.39,
      "confidence": 39.03,
      "liaisonContribution": 53.24,
      "hqContribution": 44.76,
      "overall": 40.75
    }
  },
  {
    "id": "dl-017",
    "input": {
      "pediatricLoad": 0.35,
      "perinatalRisk": 0.3,
      "liaisonCoverage": 0.64,
      "handoffLatency": 0.35,
      "hqCoordination": 0.64,
      "surgePressure": 0.33,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "liaisonBias": "handoff_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 79.59,
      "coverageScore": 54.01,
      "handoffScore": 93.21,
      "surgeScore": 59.52,
      "hqPenalty": 22.66,
      "confidence": 41.62,
      "liaisonContribution": 74,
      "hqContribution": 66.4,
      "overall": 76.63
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 49.05,
      "coverageScore": 59.61,
      "handoffScore": 39.48,
      "surgeScore": 45.51,
      "hqPenalty": 6.32,
      "confidence": 40.66,
      "liaisonContribution": 57.47,
      "hqContribution": 49.5,
      "overall": 45.37
    }
  },
  {
    "id": "dl-018",
    "input": {
      "pediatricLoad": 0.3,
      "perinatalRisk": 0.3,
      "liaisonCoverage": 0.68,
      "handoffLatency": 0.3,
      "hqCoordination": 0.68,
      "surgePressure": 0.27,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "liaisonBias": "hq_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 34.12,
      "coverageScore": 49.39,
      "handoffScore": 44.16,
      "surgeScore": 65.19,
      "hqPenalty": 45.36,
      "confidence": 46.04,
      "liaisonContribution": 44.91,
      "hqContribution": 39.42,
      "overall": 44.92
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 50.56,
      "coverageScore": 63.8,
      "handoffScore": 42.04,
      "surgeScore": 48.53,
      "hqPenalty": 4.2,
      "confidence": 45.02,
      "liaisonContribution": 60.15,
      "hqContribution": 52.2,
      "overall": 48.13
    }
  },
  {
    "id": "dl-019",
    "input": {
      "pediatricLoad": 0.3,
      "perinatalRisk": 0.31,
      "liaisonCoverage": 0.72,
      "handoffLatency": 0.3,
      "hqCoordination": 0.72,
      "surgePressure": 0.28,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 75.92,
      "coverageScore": 76.62,
      "handoffScore": 77.22,
      "surgeScore": 65.39,
      "hqPenalty": 20.37,
      "confidence": 47.96,
      "liaisonContribution": 77.1,
      "hqContribution": 62.39,
      "overall": 78.45
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 52.1,
      "coverageScore": 54.93,
      "handoffScore": 42.44,
      "surgeScore": 40.93,
      "hqPenalty": 3.02,
      "confidence": 46.9,
      "liaisonContribution": 57.48,
      "hqContribution": 49.27,
      "overall": 45.2
    }
  },
  {
    "id": "dl-020",
    "input": {
      "pediatricLoad": 0.31,
      "perinatalRisk": 0.24,
      "liaisonCoverage": 0.68,
      "handoffLatency": 0.31,
      "hqCoordination": 0.68,
      "surgePressure": 0.29,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "liaisonBias": "pediatric_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 85.81,
      "coverageScore": 87.31,
      "handoffScore": 43.69,
      "surgeScore": 63.73,
      "hqPenalty": 20.64,
      "confidence": 45.42,
      "liaisonContribution": 75.86,
      "hqContribution": 59.83,
      "overall": 76.97
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 40.75,
      "coverageScore": 39.91,
      "handoffScore": 41.61,
      "surgeScore": 29.37,
      "hqPenalty": 4.09,
      "confidence": 44.59,
      "liaisonContribution": 49.51,
      "hqContribution": 37.07,
      "overall": 33.93
    }
  },
  {
    "id": "dl-021",
    "input": {
      "pediatricLoad": 0.25,
      "perinatalRisk": 0.25,
      "liaisonCoverage": 0.72,
      "handoffLatency": 0.25,
      "hqCoordination": 0.72,
      "surgePressure": 0.24,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "liaisonBias": "balanced",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 79.53,
      "coverageScore": 78.47,
      "handoffScore": 80.34,
      "surgeScore": 69.05,
      "hqPenalty": 18.61,
      "confidence": 49.86,
      "liaisonContribution": 79.7,
      "hqContribution": 64.98,
      "overall": 81.05
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 54.17,
      "coverageScore": 56.43,
      "handoffScore": 44.6,
      "surgeScore": 41.62,
      "hqPenalty": 1.97,
      "confidence": 49,
      "liaisonContribution": 58.97,
      "hqContribution": 51.22,
      "overall": 46.99
    }
  },
  {
    "id": "dl-022",
    "input": {
      "pediatricLoad": 0.26,
      "perinatalRisk": 0.26,
      "liaisonCoverage": 0.76,
      "handoffLatency": 0.26,
      "hqCoordination": 0.76,
      "surgePressure": 0.25,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "liaisonBias": "handoff_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 89.59,
      "coverageScore": 61.16,
      "handoffScore": 100,
      "surgeScore": 69,
      "hqPenalty": 18.48,
      "confidence": 51.56,
      "liaisonContribution": 81.33,
      "hqContribution": 73.49,
      "overall": 83.92
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 54.82,
      "coverageScore": 69.3,
      "handoffScore": 44.57,
      "surgeScore": 50.93,
      "hqPenalty": 0.9,
      "confidence": 50.63,
      "liaisonContribution": 63.74,
      "hqContribution": 56.6,
      "overall": 52.23
    }
  },
  {
    "id": "dl-023",
    "input": {
      "pediatricLoad": 0.27,
      "perinatalRisk": 0.26,
      "liaisonCoverage": 0.8,
      "handoffLatency": 0.27,
      "hqCoordination": 0.8,
      "surgePressure": 0.25,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "liaisonBias": "hq_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 39.07,
      "coverageScore": 54.14,
      "handoffScore": 48.2,
      "surgeScore": 69.55,
      "hqPenalty": 42.86,
      "confidence": 53.46,
      "liaisonContribution": 49.15,
      "hqContribution": 43.06,
      "overall": 49.05
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 56.45,
      "coverageScore": 71.6,
      "handoffScore": 44.54,
      "surgeScore": 52.05,
      "hqPenalty": 0,
      "confidence": 52.47,
      "liaisonContribution": 64.93,
      "hqContribution": 58.27,
      "overall": 53.86
    }
  },
  {
    "id": "dl-024",
    "input": {
      "pediatricLoad": 0.21,
      "perinatalRisk": 0.19,
      "liaisonCoverage": 0.76,
      "handoffLatency": 0.21,
      "hqCoordination": 0.76,
      "surgePressure": 0.2,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "liaisonBias": "balanced",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 85.12,
      "coverageScore": 82.31,
      "handoffScore": 84.69,
      "surgeScore": 73.27,
      "hqPenalty": 16.59,
      "confidence": 53.66,
      "liaisonContribution": 83.82,
      "hqContribution": 68.9,
      "overall": 85.13
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 57.87,
      "coverageScore": 59.63,
      "handoffScore": 46.73,
      "surgeScore": 43.44,
      "hqPenalty": 0,
      "confidence": 52.94,
      "liaisonContribution": 61.53,
      "hqContribution": 54.7,
      "overall": 50.26
    }
  },
  {
    "id": "dl-025",
    "input": {
      "pediatricLoad": 0.22,
      "perinatalRisk": 0.2,
      "liaisonCoverage": 0.8,
      "handoffLatency": 0.22,
      "hqCoordination": 0.8,
      "surgePressure": 0.21,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "liaisonBias": "pediatric_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 95.81,
      "coverageScore": 99.83,
      "handoffScore": 50.06,
      "surgeScore": 73.22,
      "hqPenalty": 16.46,
      "confidence": 55.36,
      "liaisonContribution": 84.82,
      "hqContribution": 66.84,
      "overall": 85.58
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 46.52,
      "coverageScore": 45.46,
      "handoffScore": 46.7,
      "surgeScore": 32.72,
      "hqPenalty": 0,
      "confidence": 54.57,
      "liaisonContribution": 54.28,
      "hqContribution": 42.72,
      "overall": 39.32
    }
  },
  {
    "id": "dl-026",
    "input": {
      "pediatricLoad": 0.23,
      "perinatalRisk": 0.21,
      "liaisonCoverage": 0.83,
      "handoffLatency": 0.23,
      "hqCoordination": 0.83,
      "surgePressure": 0.22,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 87.39,
      "coverageScore": 85.43,
      "handoffScore": 86.54,
      "surgeScore": 72.96,
      "hqPenalty": 16.45,
      "confidence": 56.53,
      "liaisonContribution": 85.88,
      "hqContribution": 70.36,
      "overall": 87.09
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 59.8,
      "coverageScore": 61.96,
      "handoffScore": 46.56,
      "surgeScore": 44.78,
      "hqPenalty": 0,
      "confidence": 55.68,
      "liaisonContribution": 62.62,
      "hqContribution": 56.5,
      "overall": 51.91
    }
  },
  {
    "id": "dl-027",
    "input": {
      "pediatricLoad": 0.17,
      "perinatalRisk": 0.22,
      "liaisonCoverage": 0.87,
      "handoffLatency": 0.17,
      "hqCoordination": 0.87,
      "surgePressure": 0.17,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "liaisonBias": "handoff_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 99.04,
      "coverageScore": 68,
      "handoffScore": 100,
      "surgeScore": 78.28,
      "hqPenalty": 14.42,
      "confidence": 60.97,
      "liaisonContribution": 86.9,
      "hqContribution": 78.94,
      "overall": 89.47
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 60.21,
      "coverageScore": 78.41,
      "handoffScore": 49.56,
      "surgeScore": 56.09,
      "hqPenalty": 0,
      "confidence": 60.09,
      "liaisonContribution": 68.85,
      "hqContribution": 63.29,
      "overall": 58.51
    }
  },
  {
    "id": "dl-028",
    "input": {
      "pediatricLoad": 0.18,
      "perinatalRisk": 0.14,
      "liaisonCoverage": 0.83,
      "handoffLatency": 0.18,
      "hqCoordination": 0.83,
      "surgePressure": 0.17,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "liaisonBias": "hq_first",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 44.34,
      "coverageScore": 58.51,
      "handoffScore": 52.35,
      "surgeScore": 77.23,
      "hqPenalty": 39.2,
      "confidence": 58.63,
      "liaisonContribution": 53.6,
      "hqContribution": 47.09,
      "overall": 53.43
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 61.84,
      "coverageScore": 76.33,
      "handoffScore": 48.72,
      "surgeScore": 55.21,
      "hqPenalty": 0,
      "confidence": 57.99,
      "liaisonContribution": 68.42,
      "hqContribution": 63.64,
      "overall": 58.75
    }
  },
  {
    "id": "dl-029",
    "input": {
      "pediatricLoad": 0.18,
      "perinatalRisk": 0.15,
      "liaisonCoverage": 0.87,
      "handoffLatency": 0.18,
      "hqCoordination": 0.87,
      "surgePressure": 0.18,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "liaisonBias": "balanced",
      "profile": "pediatric_perinatal_liaison"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 93.01,
      "coverageScore": 89.52,
      "handoffScore": 91.46,
      "surgeScore": 77.43,
      "hqPenalty": 14.21,
      "confidence": 60.55,
      "liaisonContribution": 90.25,
      "hqContribution": 74.37,
      "overall": 91.39
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 63.38,
      "coverageScore": 65.19,
      "handoffScore": 49.12,
      "surgeScore": 46.48,
      "hqPenalty": 0,
      "confidence": 59.86,
      "liaisonContribution": 64.83,
      "hqContribution": 59.92,
      "overall": 55
    }
  },
  {
    "id": "dl-030",
    "input": {
      "pediatricLoad": 0.13,
      "perinatalRisk": 0.16,
      "liaisonCoverage": 0.91,
      "handoffLatency": 0.13,
      "hqCoordination": 0.91,
      "surgePressure": 0.13,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "liaisonBias": "pediatric_first",
      "profile": "generic_disaster_hq"
    },
    "expectedPediatric": {
      "mode": "pediatric_perinatal_liaison",
      "specialtyScore": 100,
      "coverageScore": 100,
      "handoffScore": 56.18,
      "surgeScore": 82.5,
      "hqPenalty": 12.4,
      "confidence": 64.77,
      "liaisonContribution": 88.13,
      "hqContribution": 71.14,
      "overall": 89.07
    },
    "expectedGenericHq": {
      "mode": "generic_disaster_hq",
      "specialtyScore": 51.91,
      "coverageScore": 50.77,
      "handoffScore": 51.68,
      "surgeScore": 35.81,
      "hqPenalty": 0,
      "confidence": 64.03,
      "liaisonContribution": 58.03,
      "hqContribution": 48.04,
      "overall": 44.24
    }
  }
];
