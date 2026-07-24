import type { InferInput, InferQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: InferInput;
  expectedStageValidated: InferQuality;
  expectedNaiveOffload: InferQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "lis-001",
    "input": {
      "vramGb": 4.16,
      "residentGb": 5.94,
      "stageAgreement": 0.21,
      "kernelEfficiency": 0.19,
      "hostSpill": 0.7,
      "prefillThroughput": 0.16,
      "decodeThroughput": 0.15,
      "visionPortFit": 0.19,
      "contextK": 1.2,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 0,
      "stagePass": 19.09,
      "kernelScore": 13.8,
      "throughputScore": 14.3,
      "visionScore": 18.26,
      "spillRisk": 1.19,
      "overall": 11.01
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 3.24,
      "stagePass": 6.21,
      "kernelScore": 5.44,
      "throughputScore": 8.5,
      "visionScore": 6,
      "spillRisk": 0,
      "overall": 4.32
    }
  },
  {
    "id": "lis-002",
    "input": {
      "vramGb": 4.32,
      "residentGb": 5.9,
      "stageAgreement": 0.24,
      "kernelEfficiency": 0.23,
      "hostSpill": 0.7,
      "prefillThroughput": 0.2,
      "decodeThroughput": 0.19,
      "visionPortFit": 0.22,
      "contextK": 1.83,
      "stage": "prefill",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 0,
      "stagePass": 22.92,
      "kernelScore": 17.62,
      "throughputScore": 17.85,
      "visionScore": 21.43,
      "spillRisk": 5.24,
      "overall": 13.89
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 3.14,
      "stagePass": 6.91,
      "kernelScore": 6.45,
      "throughputScore": 10.06,
      "visionScore": 6.7,
      "spillRisk": 0,
      "overall": 4.92
    }
  },
  {
    "id": "lis-003",
    "input": {
      "vramGb": 4.49,
      "residentGb": 5.87,
      "stageAgreement": 0.28,
      "kernelEfficiency": 0.28,
      "hostSpill": 0.64,
      "prefillThroughput": 0.24,
      "decodeThroughput": 0.24,
      "visionPortFit": 0.26,
      "contextK": 1.56,
      "stage": "decode",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 7.13,
      "stagePass": 37.33,
      "kernelScore": 23.72,
      "throughputScore": 24.4,
      "visionScore": 27.11,
      "spillRisk": 24.56,
      "overall": 23.48
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 4.23,
      "stagePass": 7.66,
      "kernelScore": 7.4,
      "throughputScore": 9.42,
      "visionScore": 7.46,
      "spillRisk": 0,
      "overall": 5.21
    }
  },
  {
    "id": "lis-004",
    "input": {
      "vramGb": 4.33,
      "residentGb": 5.83,
      "stageAgreement": 0.32,
      "kernelEfficiency": 0.24,
      "hostSpill": 0.64,
      "prefillThroughput": 0.27,
      "decodeThroughput": 0.2,
      "visionPortFit": 0.3,
      "contextK": 2.18,
      "stage": "vision_encode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 0,
      "stagePass": 26.33,
      "kernelScore": 17.98,
      "throughputScore": 19.6,
      "visionScore": 25.89,
      "spillRisk": 10.27,
      "overall": 16.14
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 3.6,
      "stagePass": 8.88,
      "kernelScore": 7.16,
      "throughputScore": 11.13,
      "visionScore": 8.68,
      "spillRisk": 0,
      "overall": 5.74
    }
  },
  {
    "id": "lis-005",
    "input": {
      "vramGb": 4.49,
      "residentGb": 5.49,
      "stageAgreement": 0.29,
      "kernelEfficiency": 0.28,
      "hostSpill": 0.63,
      "prefillThroughput": 0.31,
      "decodeThroughput": 0.24,
      "visionPortFit": 0.26,
      "contextK": 2.81,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 16.48,
      "stagePass": 25.88,
      "kernelScore": 21.71,
      "throughputScore": 22.63,
      "visionScore": 24.5,
      "spillRisk": 21.47,
      "overall": 21.9
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 7.01,
      "stagePass": 7.37,
      "kernelScore": 7.71,
      "throughputScore": 12.11,
      "visionScore": 7.09,
      "spillRisk": 0,
      "overall": 6.16
    }
  },
  {
    "id": "lis-006",
    "input": {
      "vramGb": 4.65,
      "residentGb": 5.46,
      "stageAgreement": 0.33,
      "kernelEfficiency": 0.33,
      "hostSpill": 0.57,
      "prefillThroughput": 0.26,
      "decodeThroughput": 0.29,
      "visionPortFit": 0.3,
      "contextK": 2.54,
      "stage": "prefill",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 32.07,
      "stagePass": 43.12,
      "kernelScore": 27.74,
      "throughputScore": 27.5,
      "visionScore": 32.65,
      "spillRisk": 40.6,
      "overall": 33.96
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 8.83,
      "stagePass": 7.93,
      "kernelScore": 7.48,
      "throughputScore": 9.56,
      "visionScore": 7.67,
      "spillRisk": 0,
      "overall": 5.95
    }
  },
  {
    "id": "lis-007",
    "input": {
      "vramGb": 4.82,
      "residentGb": 5.42,
      "stageAgreement": 0.36,
      "kernelEfficiency": 0.37,
      "hostSpill": 0.57,
      "prefillThroughput": 0.3,
      "decodeThroughput": 0.33,
      "visionPortFit": 0.34,
      "contextK": 3.17,
      "stage": "decode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 34.15,
      "stagePass": 33.07,
      "kernelScore": 27.17,
      "throughputScore": 27.38,
      "visionScore": 31.4,
      "spillRisk": 32.85,
      "overall": 31.19
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 9.92,
      "stagePass": 8.41,
      "kernelScore": 8.13,
      "throughputScore": 13.68,
      "visionScore": 8.25,
      "spillRisk": 0,
      "overall": 7.21
    }
  },
  {
    "id": "lis-008",
    "input": {
      "vramGb": 4.66,
      "residentGb": 5.38,
      "stageAgreement": 0.4,
      "kernelEfficiency": 0.33,
      "hostSpill": 0.57,
      "prefillThroughput": 0.34,
      "decodeThroughput": 0.29,
      "visionPortFit": 0.37,
      "contextK": 3.79,
      "stage": "vision_encode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 27.03,
      "stagePass": 32.85,
      "kernelScore": 23.58,
      "throughputScore": 24.75,
      "visionScore": 31.88,
      "spillRisk": 30.56,
      "overall": 28.38
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 9.21,
      "stagePass": 9.4,
      "kernelScore": 8.07,
      "throughputScore": 12.72,
      "visionScore": 9.14,
      "spillRisk": 0,
      "overall": 7.09
    }
  },
  {
    "id": "lis-009",
    "input": {
      "vramGb": 4.82,
      "residentGb": 5.35,
      "stageAgreement": 0.44,
      "kernelEfficiency": 0.38,
      "hostSpill": 0.51,
      "prefillThroughput": 0.38,
      "decodeThroughput": 0.34,
      "visionPortFit": 0.41,
      "contextK": 3.52,
      "stage": "token_merge",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 42.8,
      "stagePass": 50.27,
      "kernelScore": 32.19,
      "throughputScore": 33.27,
      "visionScore": 40.7,
      "spillRisk": 49.69,
      "overall": 41.6
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 10.64,
      "stagePass": 9.71,
      "kernelScore": 8.59,
      "throughputScore": 11.45,
      "visionScore": 9.47,
      "spillRisk": 0,
      "overall": 7.15
    }
  },
  {
    "id": "lis-010",
    "input": {
      "vramGb": 4.98,
      "residentGb": 5.01,
      "stageAgreement": 0.41,
      "kernelEfficiency": 0.42,
      "hostSpill": 0.51,
      "prefillThroughput": 0.42,
      "decodeThroughput": 0.38,
      "visionPortFit": 0.37,
      "contextK": 4.15,
      "stage": "prefill",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 57.78,
      "stagePass": 38.07,
      "kernelScore": 33.59,
      "throughputScore": 34.29,
      "visionScore": 36.01,
      "spillRisk": 48.33,
      "overall": 42.03
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 12.73,
      "stagePass": 8.2,
      "kernelScore": 8.7,
      "throughputScore": 14.88,
      "visionScore": 7.9,
      "spillRisk": 11.58,
      "overall": 11.34
    }
  },
  {
    "id": "lis-011",
    "input": {
      "vramGb": 5.15,
      "residentGb": 4.97,
      "stageAgreement": 0.45,
      "kernelEfficiency": 0.46,
      "hostSpill": 0.51,
      "prefillThroughput": 0.46,
      "decodeThroughput": 0.42,
      "visionPortFit": 0.41,
      "contextK": 4.78,
      "stage": "decode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 60.52,
      "stagePass": 40.47,
      "kernelScore": 35.51,
      "throughputScore": 36.33,
      "visionScore": 37.91,
      "spillRisk": 52.58,
      "overall": 44.52
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 13.78,
      "stagePass": 8.89,
      "kernelScore": 9.38,
      "throughputScore": 16.06,
      "visionScore": 8.6,
      "spillRisk": 16.27,
      "overall": 13.39
    }
  },
  {
    "id": "lis-012",
    "input": {
      "vramGb": 4.99,
      "residentGb": 4.94,
      "stageAgreement": 0.49,
      "kernelEfficiency": 0.43,
      "hostSpill": 0.44,
      "prefillThroughput": 0.41,
      "decodeThroughput": 0.39,
      "visionPortFit": 0.45,
      "contextK": 4.5,
      "stage": "vision_encode",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 63,
      "stagePass": 52.55,
      "kernelScore": 34,
      "throughputScore": 34.75,
      "visionScore": 43.41,
      "spillRisk": 65.92,
      "overall": 49.36
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 13.26,
      "stagePass": 9.3,
      "kernelScore": 8.24,
      "throughputScore": 11.21,
      "visionScore": 9.02,
      "spillRisk": 18.79,
      "overall": 12.96
    }
  },
  {
    "id": "lis-013",
    "input": {
      "vramGb": 5.15,
      "residentGb": 4.9,
      "stageAgreement": 0.52,
      "kernelEfficiency": 0.47,
      "hostSpill": 0.44,
      "prefillThroughput": 0.45,
      "decodeThroughput": 0.43,
      "visionPortFit": 0.49,
      "contextK": 5.13,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 63.1,
      "stagePass": 44.81,
      "kernelScore": 34.81,
      "throughputScore": 35.83,
      "visionScore": 43.59,
      "spillRisk": 57.97,
      "overall": 47.21
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 14.28,
      "stagePass": 9.88,
      "kernelScore": 8.96,
      "throughputScore": 15.43,
      "visionScore": 9.67,
      "spillRisk": 23.27,
      "overall": 15.6
    }
  },
  {
    "id": "lis-014",
    "input": {
      "vramGb": 5.32,
      "residentGb": 4.86,
      "stageAgreement": 0.56,
      "kernelEfficiency": 0.51,
      "hostSpill": 0.44,
      "prefillThroughput": 0.49,
      "decodeThroughput": 0.47,
      "visionPortFit": 0.53,
      "contextK": 5.76,
      "stage": "prefill",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 70.25,
      "stagePass": 50.64,
      "kernelScore": 39.84,
      "throughputScore": 40.42,
      "visionScore": 48.79,
      "spillRisk": 62.22,
      "overall": 52.72
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 15.3,
      "stagePass": 10.55,
      "kernelScore": 9.64,
      "throughputScore": 16.61,
      "visionScore": 10.35,
      "spillRisk": 27.96,
      "overall": 17.64
    }
  },
  {
    "id": "lis-015",
    "input": {
      "vramGb": 5.48,
      "residentGb": 4.53,
      "stageAgreement": 0.53,
      "kernelEfficiency": 0.56,
      "hostSpill": 0.38,
      "prefillThroughput": 0.53,
      "decodeThroughput": 0.52,
      "visionPortFit": 0.49,
      "contextK": 5.49,
      "stage": "decode",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 86.83,
      "stagePass": 61.45,
      "kernelScore": 47.76,
      "throughputScore": 47.84,
      "visionScore": 50.27,
      "spillRisk": 79.1,
      "overall": 63.22
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 18.26,
      "stagePass": 9.69,
      "kernelScore": 10.28,
      "throughputScore": 15.39,
      "visionScore": 9.42,
      "spillRisk": 44.88,
      "overall": 22.74
    }
  },
  {
    "id": "lis-016",
    "input": {
      "vramGb": 5.32,
      "residentGb": 4.49,
      "stageAgreement": 0.57,
      "kernelEfficiency": 0.52,
      "hostSpill": 0.38,
      "prefillThroughput": 0.56,
      "decodeThroughput": 0.48,
      "visionPortFit": 0.53,
      "contextK": 6.11,
      "stage": "vision_encode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 71.77,
      "stagePass": 46.91,
      "kernelScore": 38.02,
      "throughputScore": 39.89,
      "visionScore": 45.65,
      "spillRisk": 67.1,
      "overall": 52.08
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 17.44,
      "stagePass": 10.33,
      "kernelScore": 9.97,
      "throughputScore": 17.2,
      "visionScore": 10.07,
      "spillRisk": 42.64,
      "overall": 22.46
    }
  },
  {
    "id": "lis-017",
    "input": {
      "vramGb": 5.48,
      "residentGb": 4.46,
      "stageAgreement": 0.61,
      "kernelEfficiency": 0.57,
      "hostSpill": 0.38,
      "prefillThroughput": 0.6,
      "decodeThroughput": 0.53,
      "visionPortFit": 0.56,
      "contextK": 6.74,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 78.22,
      "stagePass": 52.24,
      "kernelScore": 43.32,
      "throughputScore": 44.76,
      "visionScore": 49.97,
      "spillRisk": 67.1,
      "overall": 56.8
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 18.26,
      "stagePass": 10.9,
      "kernelScore": 10.71,
      "throughputScore": 18.6,
      "visionScore": 10.57,
      "spillRisk": 46.84,
      "overall": 24.34
    }
  },
  {
    "id": "lis-018",
    "input": {
      "vramGb": 5.65,
      "residentGb": 4.42,
      "stageAgreement": 0.65,
      "kernelEfficiency": 0.61,
      "hostSpill": 0.32,
      "prefillThroughput": 0.55,
      "decodeThroughput": 0.57,
      "visionPortFit": 0.6,
      "contextK": 6.47,
      "stage": "prefill",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 97.7,
      "stagePass": 73.45,
      "kernelScore": 52.57,
      "throughputScore": 52.12,
      "visionScore": 62.15,
      "spillRisk": 82.4,
      "overall": 71.52
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 19.19,
      "stagePass": 11.15,
      "kernelScore": 10.32,
      "throughputScore": 15.65,
      "visionScore": 10.84,
      "spillRisk": 55.85,
      "overall": 26.54
    }
  },
  {
    "id": "lis-019",
    "input": {
      "vramGb": 5.81,
      "residentGb": 4.38,
      "stageAgreement": 0.68,
      "kernelEfficiency": 0.65,
      "hostSpill": 0.32,
      "prefillThroughput": 0.59,
      "decodeThroughput": 0.61,
      "visionPortFit": 0.64,
      "contextK": 7.1,
      "stage": "decode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 89.72,
      "stagePass": 59.78,
      "kernelScore": 48.66,
      "throughputScore": 49.37,
      "visionScore": 57.39,
      "spillRisk": 70.4,
      "overall": 63.86
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 20.04,
      "stagePass": 11.65,
      "kernelScore": 10.94,
      "throughputScore": 19.75,
      "visionScore": 11.4,
      "spillRisk": 60.33,
      "overall": 29.1
    }
  },
  {
    "id": "lis-020",
    "input": {
      "vramGb": 5.65,
      "residentGb": 4.05,
      "stageAgreement": 0.65,
      "kernelEfficiency": 0.62,
      "hostSpill": 0.31,
      "prefillThroughput": 0.63,
      "decodeThroughput": 0.58,
      "visionPortFit": 0.6,
      "contextK": 7.72,
      "stage": "vision_encode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 86.66,
      "stagePass": 53.6,
      "kernelScore": 44.2,
      "throughputScore": 45.54,
      "visionScore": 51.64,
      "spillRisk": 70.95,
      "overall": 59.89
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 21.06,
      "stagePass": 11.09,
      "kernelScore": 10.95,
      "throughputScore": 19.16,
      "visionScore": 10.78,
      "spillRisk": 61.68,
      "overall": 29.38
    }
  },
  {
    "id": "lis-021",
    "input": {
      "vramGb": 5.82,
      "residentGb": 4.01,
      "stageAgreement": 0.69,
      "kernelEfficiency": 0.66,
      "hostSpill": 0.25,
      "prefillThroughput": 0.67,
      "decodeThroughput": 0.62,
      "visionPortFit": 0.64,
      "contextK": 7.45,
      "stage": "token_merge",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 73.92,
      "kernelScore": 55.69,
      "throughputScore": 56.29,
      "visionScore": 63.41,
      "spillRisk": 86.25,
      "overall": 73.93
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 21.71,
      "stagePass": 11.28,
      "kernelScore": 11.14,
      "throughputScore": 17.19,
      "visionScore": 10.98,
      "spillRisk": 66,
      "overall": 30.4
    }
  },
  {
    "id": "lis-022",
    "input": {
      "vramGb": 5.98,
      "residentGb": 3.97,
      "stageAgreement": 0.73,
      "kernelEfficiency": 0.7,
      "hostSpill": 0.25,
      "prefillThroughput": 0.71,
      "decodeThroughput": 0.66,
      "visionPortFit": 0.68,
      "contextK": 8.08,
      "stage": "prefill",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 65.8,
      "kernelScore": 55.81,
      "throughputScore": 56.85,
      "visionScore": 63.37,
      "spillRisk": 74.25,
      "overall": 70.97
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 21.46,
      "stagePass": 11.81,
      "kernelScore": 11.68,
      "throughputScore": 21.2,
      "visionScore": 11.52,
      "spillRisk": 66,
      "overall": 31.43
    }
  },
  {
    "id": "lis-023",
    "input": {
      "vramGb": 6.14,
      "residentGb": 3.94,
      "stageAgreement": 0.77,
      "kernelEfficiency": 0.75,
      "hostSpill": 0.25,
      "prefillThroughput": 0.75,
      "decodeThroughput": 0.71,
      "visionPortFit": 0.72,
      "contextK": 8.71,
      "stage": "decode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 99.49,
      "stagePass": 67.58,
      "kernelScore": 57.62,
      "throughputScore": 58.85,
      "visionScore": 64.49,
      "spillRisk": 74.25,
      "overall": 71.98
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 21.22,
      "stagePass": 12.33,
      "kernelScore": 12.3,
      "throughputScore": 22.45,
      "visionScore": 12.05,
      "spillRisk": 66,
      "overall": 31.86
    }
  },
  {
    "id": "lis-024",
    "input": {
      "vramGb": 5.98,
      "residentGb": 3.9,
      "stageAgreement": 0.81,
      "kernelEfficiency": 0.71,
      "hostSpill": 0.19,
      "prefillThroughput": 0.7,
      "decodeThroughput": 0.67,
      "visionPortFit": 0.75,
      "contextK": 8.43,
      "stage": "vision_encode",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 80.29,
      "kernelScore": 56.43,
      "throughputScore": 57.48,
      "visionScore": 70.38,
      "spillRisk": 89.55,
      "overall": 76.88
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 20.56,
      "stagePass": 12.33,
      "kernelScore": 11.04,
      "throughputScore": 17.35,
      "visionScore": 12,
      "spillRisk": 70.32,
      "overall": 31.79
    }
  },
  {
    "id": "lis-025",
    "input": {
      "vramGb": 6.15,
      "residentGb": 3.56,
      "stageAgreement": 0.77,
      "kernelEfficiency": 0.75,
      "hostSpill": 0.19,
      "prefillThroughput": 0.74,
      "decodeThroughput": 0.71,
      "visionPortFit": 0.72,
      "contextK": 9.06,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 99.21,
      "stagePass": 66.25,
      "kernelScore": 55.82,
      "throughputScore": 56.88,
      "visionScore": 64.04,
      "spillRisk": 77.55,
      "overall": 71.38
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 20.81,
      "stagePass": 11.9,
      "kernelScore": 11.8,
      "throughputScore": 21.65,
      "visionScore": 11.63,
      "spillRisk": 70.32,
      "overall": 32.77
    }
  },
  {
    "id": "lis-026",
    "input": {
      "vramGb": 6.31,
      "residentGb": 3.53,
      "stageAgreement": 0.81,
      "kernelEfficiency": 0.8,
      "hostSpill": 0.19,
      "prefillThroughput": 0.78,
      "decodeThroughput": 0.76,
      "visionPortFit": 0.75,
      "contextK": 9.69,
      "stage": "prefill",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 73.11,
      "kernelScore": 62.69,
      "throughputScore": 62.96,
      "visionScore": 69.79,
      "spillRisk": 77.55,
      "overall": 75.8
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 20.56,
      "stagePass": 12.33,
      "kernelScore": 12.38,
      "throughputScore": 22.84,
      "visionScore": 12,
      "spillRisk": 70.32,
      "overall": 33.16
    }
  },
  {
    "id": "lis-027",
    "input": {
      "vramGb": 6.47,
      "residentGb": 3.49,
      "stageAgreement": 0.85,
      "kernelEfficiency": 0.84,
      "hostSpill": 0.12,
      "prefillThroughput": 0.82,
      "decodeThroughput": 0.8,
      "visionPortFit": 0.79,
      "contextK": 9.42,
      "stage": "decode",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 90.91,
      "kernelScore": 71.79,
      "throughputScore": 71.83,
      "visionScore": 79.08,
      "spillRisk": 93.4,
      "overall": 85.44
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 19.8,
      "stagePass": 12.25,
      "kernelScore": 12.29,
      "throughputScore": 20.48,
      "visionScore": 11.93,
      "spillRisk": 75.36,
      "overall": 34.02
    }
  },
  {
    "id": "lis-028",
    "input": {
      "vramGb": 6.31,
      "residentGb": 3.45,
      "stageAgreement": 0.89,
      "kernelEfficiency": 0.8,
      "hostSpill": 0.12,
      "prefillThroughput": 0.85,
      "decodeThroughput": 0.76,
      "visionPortFit": 0.83,
      "contextK": 10.04,
      "stage": "vision_encode",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 97.66,
      "stagePass": 72.06,
      "kernelScore": 58.1,
      "throughputScore": 60.74,
      "visionScore": 70.23,
      "spillRisk": 81.4,
      "overall": 74.51
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 19.55,
      "stagePass": 12.67,
      "kernelScore": 11.97,
      "throughputScore": 22.37,
      "visionScore": 12.36,
      "spillRisk": 75.36,
      "overall": 34.45
    }
  },
  {
    "id": "lis-029",
    "input": {
      "vramGb": 6.48,
      "residentGb": 3.42,
      "stageAgreement": 0.93,
      "kernelEfficiency": 0.85,
      "hostSpill": 0.12,
      "prefillThroughput": 0.89,
      "decodeThroughput": 0.81,
      "visionPortFit": 0.87,
      "contextK": 10.67,
      "stage": "token_merge",
      "plan": "naive_offload"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 78.65,
      "kernelScore": 64.87,
      "throughputScore": 66.37,
      "visionScore": 76.03,
      "spillRisk": 81.4,
      "overall": 79.14
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 19.29,
      "stagePass": 13.08,
      "kernelScore": 12.47,
      "throughputScore": 23.48,
      "visionScore": 12.78,
      "spillRisk": 75.36,
      "overall": 34.81
    }
  },
  {
    "id": "lis-030",
    "input": {
      "vramGb": 6.64,
      "residentGb": 3.08,
      "stageAgreement": 0.89,
      "kernelEfficiency": 0.89,
      "hostSpill": 0.06,
      "prefillThroughput": 0.84,
      "decodeThroughput": 0.85,
      "visionPortFit": 0.83,
      "contextK": 10.4,
      "stage": "prefill",
      "plan": "stage_validated"
    },
    "expectedStageValidated": {
      "mode": "stage_validated",
      "vramFit": 100,
      "stagePass": 97.74,
      "kernelScore": 77.72,
      "throughputScore": 76.1,
      "visionScore": 85.68,
      "spillRisk": 96.7,
      "overall": 89.76
    },
    "expectedNaiveOffload": {
      "mode": "naive_offload",
      "vramFit": 19.08,
      "stagePass": 12.18,
      "kernelScore": 12.18,
      "throughputScore": 20.63,
      "visionScore": 11.88,
      "spillRisk": 79.68,
      "overall": 35.22
    }
  }
];
