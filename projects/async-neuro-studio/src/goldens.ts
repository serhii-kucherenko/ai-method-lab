import type { AsyncNeuroInput, AsyncNeuroQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AsyncNeuroInput;
  expectedStandardized: AsyncNeuroQuality;
  expectedAdHoc: AsyncNeuroQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "an-001",
    "input": {
      "protocolFidelity": 0.29,
      "siteConsistency": 0.25,
      "videoCompleteness": 0.28,
      "packReadiness": 0.34,
      "adHocAdherence": 0.39,
      "captureNoise": 0.59,
      "examinerDrift": 0.45,
      "overclaimRisk": 0.5,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 23.37,
      "siteScore": 30.25,
      "videoScore": 22.89,
      "readinessScore": 37.64,
      "adHocScore": 16.4,
      "confidence": 17.95,
      "standardizedContribution": 28.16,
      "adHocContribution": 15.92,
      "overall": 29.96
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 5.76,
      "siteScore": 17.37,
      "videoScore": 12.78,
      "readinessScore": 32.39,
      "adHocScore": 40.93,
      "confidence": 17.1,
      "standardizedContribution": 21.85,
      "adHocContribution": 38.57,
      "overall": 27.17
    }
  },
  {
    "id": "an-002",
    "input": {
      "protocolFidelity": 0.33,
      "siteConsistency": 0.29,
      "videoCompleteness": 0.32,
      "packReadiness": 0.38,
      "adHocAdherence": 0.43,
      "captureNoise": 0.6,
      "examinerDrift": 0.46,
      "overclaimRisk": 0.51,
      "examBias": "site_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 29.47,
      "siteScore": 33.9,
      "videoScore": 17.16,
      "readinessScore": 48.93,
      "adHocScore": 18.89,
      "confidence": 21.2,
      "standardizedContribution": 31.46,
      "adHocContribution": 18.58,
      "overall": 33.14
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 2.43,
      "siteScore": 18.49,
      "videoScore": 13.81,
      "readinessScore": 34.08,
      "adHocScore": 31.53,
      "confidence": 18.65,
      "standardizedContribution": 20.07,
      "adHocContribution": 34.51,
      "overall": 23.47
    }
  },
  {
    "id": "an-003",
    "input": {
      "protocolFidelity": 0.37,
      "siteConsistency": 0.27,
      "videoCompleteness": 0.36,
      "packReadiness": 0.42,
      "adHocAdherence": 0.46,
      "captureNoise": 0.6,
      "examinerDrift": 0.42,
      "overclaimRisk": 0.46,
      "examBias": "ad_hoc_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 8.22,
      "siteScore": 23.71,
      "videoScore": 19.52,
      "readinessScore": 19.24,
      "adHocScore": 19.94,
      "confidence": 23.4,
      "standardizedContribution": 17.84,
      "adHocContribution": 19.65,
      "overall": 19.17
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 12.17,
      "siteScore": 17.85,
      "videoScore": 12.78,
      "readinessScore": 33.93,
      "adHocScore": 54.34,
      "confidence": 18.4,
      "standardizedContribution": 26.21,
      "adHocContribution": 46.55,
      "overall": 34.52
    }
  },
  {
    "id": "an-004",
    "input": {
      "protocolFidelity": 0.33,
      "siteConsistency": 0.32,
      "videoCompleteness": 0.39,
      "packReadiness": 0.38,
      "adHocAdherence": 0.42,
      "captureNoise": 0.53,
      "examinerDrift": 0.43,
      "overclaimRisk": 0.46,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 30.23,
      "siteScore": 36.03,
      "videoScore": 33.12,
      "readinessScore": 42.23,
      "adHocScore": 18.93,
      "confidence": 22.55,
      "standardizedContribution": 35.19,
      "adHocContribution": 19.24,
      "overall": 36.32
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 8.7,
      "siteScore": 18.13,
      "videoScore": 14.08,
      "readinessScore": 32.79,
      "adHocScore": 42.77,
      "confidence": 18.85,
      "standardizedContribution": 23.29,
      "adHocContribution": 40.35,
      "overall": 29.6
    }
  },
  {
    "id": "an-005",
    "input": {
      "protocolFidelity": 0.37,
      "siteConsistency": 0.36,
      "videoCompleteness": 0.35,
      "packReadiness": 0.42,
      "adHocAdherence": 0.46,
      "captureNoise": 0.53,
      "examinerDrift": 0.45,
      "overclaimRisk": 0.47,
      "examBias": "protocol_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 34.45,
      "siteScore": 39.64,
      "videoScore": 39.38,
      "readinessScore": 35.49,
      "adHocScore": 21.8,
      "confidence": 25.65,
      "standardizedContribution": 37.41,
      "adHocContribution": 22.12,
      "overall": 38.66
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 0,
      "siteScore": 19.51,
      "videoScore": 15.31,
      "readinessScore": 34.77,
      "adHocScore": 32.95,
      "confidence": 21.05,
      "standardizedContribution": 20.51,
      "adHocContribution": 36.26,
      "overall": 25.74
    }
  },
  {
    "id": "an-006",
    "input": {
      "protocolFidelity": 0.41,
      "siteConsistency": 0.34,
      "videoCompleteness": 0.39,
      "packReadiness": 0.45,
      "adHocAdherence": 0.5,
      "captureNoise": 0.54,
      "examinerDrift": 0.4,
      "overclaimRisk": 0.42,
      "examBias": "balanced",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 35.28,
      "siteScore": 39.5,
      "videoScore": 34.8,
      "readinessScore": 47.85,
      "adHocScore": 23.08,
      "confidence": 27.75,
      "standardizedContribution": 39.01,
      "adHocContribution": 23.32,
      "overall": 40.19
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 11.98,
      "siteScore": 18.51,
      "videoScore": 13.91,
      "readinessScore": 34.78,
      "adHocScore": 46.72,
      "confidence": 20.5,
      "standardizedContribution": 25.18,
      "adHocContribution": 43.14,
      "overall": 32.35
    }
  },
  {
    "id": "an-007",
    "input": {
      "protocolFidelity": 0.45,
      "siteConsistency": 0.38,
      "videoCompleteness": 0.42,
      "packReadiness": 0.49,
      "adHocAdherence": 0.53,
      "captureNoise": 0.55,
      "examinerDrift": 0.42,
      "overclaimRisk": 0.43,
      "examBias": "site_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 42.35,
      "siteScore": 43.11,
      "videoScore": 25.46,
      "readinessScore": 61.29,
      "adHocScore": 25.15,
      "confidence": 30.85,
      "standardizedContribution": 41.99,
      "adHocContribution": 25.54,
      "overall": 43.03
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 8.27,
      "siteScore": 19.77,
      "videoScore": 15.09,
      "readinessScore": 36.3,
      "adHocScore": 34.2,
      "confidence": 22.15,
      "standardizedContribution": 22.73,
      "adHocContribution": 37.43,
      "overall": 27.22
    }
  },
  {
    "id": "an-008",
    "input": {
      "protocolFidelity": 0.41,
      "siteConsistency": 0.43,
      "videoCompleteness": 0.46,
      "packReadiness": 0.45,
      "adHocAdherence": 0.49,
      "captureNoise": 0.47,
      "examinerDrift": 0.43,
      "overclaimRisk": 0.44,
      "examBias": "ad_hoc_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 12.47,
      "siteScore": 35.43,
      "videoScore": 28.04,
      "readinessScore": 24.76,
      "adHocScore": 24.32,
      "confidence": 30,
      "standardizedContribution": 25.5,
      "adHocContribution": 25.37,
      "overall": 26.48
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 16.4,
      "siteScore": 20.2,
      "videoScore": 16.57,
      "readinessScore": 35.17,
      "adHocScore": 58.5,
      "confidence": 22.7,
      "standardizedContribution": 29.37,
      "adHocContribution": 51.04,
      "overall": 39.87
    }
  },
  {
    "id": "an-009",
    "input": {
      "protocolFidelity": 0.46,
      "siteConsistency": 0.41,
      "videoCompleteness": 0.5,
      "packReadiness": 0.49,
      "adHocAdherence": 0.53,
      "captureNoise": 0.48,
      "examinerDrift": 0.39,
      "overclaimRisk": 0.38,
      "examBias": "balanced",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 42.68,
      "siteScore": 45.49,
      "videoScore": 45.1,
      "readinessScore": 52.59,
      "adHocScore": 25.81,
      "confidence": 32.5,
      "standardizedContribution": 46.27,
      "adHocContribution": 26.81,
      "overall": 46.77
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 14.91,
      "siteScore": 19.62,
      "videoScore": 15.52,
      "readinessScore": 35.36,
      "adHocScore": 48.88,
      "confidence": 22.7,
      "standardizedContribution": 26.86,
      "adHocContribution": 45.34,
      "overall": 35.15
    }
  },
  {
    "id": "an-010",
    "input": {
      "protocolFidelity": 0.5,
      "siteConsistency": 0.45,
      "videoCompleteness": 0.46,
      "packReadiness": 0.53,
      "adHocAdherence": 0.57,
      "captureNoise": 0.49,
      "examinerDrift": 0.4,
      "overclaimRisk": 0.39,
      "examBias": "protocol_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 48.19,
      "siteScore": 49.14,
      "videoScore": 53.74,
      "readinessScore": 43.07,
      "adHocScore": 28.29,
      "confidence": 35.75,
      "standardizedContribution": 48.86,
      "adHocContribution": 29.21,
      "overall": 49.32
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 3.59,
      "siteScore": 20.43,
      "videoScore": 16.17,
      "readinessScore": 37.06,
      "adHocScore": 35.54,
      "confidence": 24.25,
      "standardizedContribution": 22.56,
      "adHocContribution": 38.95,
      "overall": 29.08
    }
  },
  {
    "id": "an-011",
    "input": {
      "protocolFidelity": 0.54,
      "siteConsistency": 0.49,
      "videoCompleteness": 0.49,
      "packReadiness": 0.57,
      "adHocAdherence": 0.6,
      "captureNoise": 0.49,
      "examinerDrift": 0.42,
      "overclaimRisk": 0.4,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 47.07,
      "siteScore": 52.75,
      "videoScore": 46.34,
      "readinessScore": 60.27,
      "adHocScore": 30.54,
      "confidence": 38.85,
      "standardizedContribution": 51.25,
      "adHocContribution": 31.67,
      "overall": 51.73
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 17.1,
      "siteScore": 21.84,
      "videoScore": 17.52,
      "readinessScore": 38.58,
      "adHocScore": 54.12,
      "confidence": 26.1,
      "standardizedContribution": 29.83,
      "adHocContribution": 50.43,
      "overall": 39.58
    }
  },
  {
    "id": "an-012",
    "input": {
      "protocolFidelity": 0.5,
      "siteConsistency": 0.48,
      "videoCompleteness": 0.53,
      "packReadiness": 0.53,
      "adHocAdherence": 0.56,
      "captureNoise": 0.42,
      "examinerDrift": 0.37,
      "overclaimRisk": 0.35,
      "examBias": "site_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 51.69,
      "siteScore": 51.28,
      "videoScore": 34.19,
      "readinessScore": 67.57,
      "adHocScore": 28.34,
      "confidence": 37.1,
      "standardizedContribution": 50.18,
      "adHocContribution": 29.77,
      "overall": 50.51
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 13.23,
      "siteScore": 19.94,
      "videoScore": 16.29,
      "readinessScore": 35.76,
      "adHocScore": 34.93,
      "confidence": 24.35,
      "standardizedContribution": 24.03,
      "adHocContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "an-013",
    "input": {
      "protocolFidelity": 0.54,
      "siteConsistency": 0.52,
      "videoCompleteness": 0.56,
      "packReadiness": 0.57,
      "adHocAdherence": 0.6,
      "captureNoise": 0.42,
      "examinerDrift": 0.39,
      "overclaimRisk": 0.36,
      "examBias": "ad_hoc_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 19.73,
      "siteScore": 44.88,
      "videoScore": 36.36,
      "readinessScore": 32.66,
      "adHocScore": 31.2,
      "confidence": 40.2,
      "standardizedContribution": 33.77,
      "adHocContribution": 32.85,
      "overall": 34.6
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 22.62,
      "siteScore": 21.58,
      "videoScore": 17.82,
      "readinessScore": 37.74,
      "adHocScore": 67.02,
      "confidence": 26.55,
      "standardizedContribution": 33.36,
      "adHocContribution": 57.3,
      "overall": 46.51
    }
  },
  {
    "id": "an-014",
    "input": {
      "protocolFidelity": 0.58,
      "siteConsistency": 0.56,
      "videoCompleteness": 0.6,
      "packReadiness": 0.61,
      "adHocAdherence": 0.63,
      "captureNoise": 0.43,
      "examinerDrift": 0.4,
      "overclaimRisk": 0.36,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 53.79,
      "siteScore": 58.53,
      "videoScore": 56.43,
      "readinessScore": 64.86,
      "adHocScore": 33.07,
      "confidence": 43.45,
      "standardizedContribution": 58.2,
      "adHocContribution": 34.85,
      "overall": 58
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 20.03,
      "siteScore": 22.42,
      "videoScore": 18.61,
      "readinessScore": 38.98,
      "adHocScore": 55.96,
      "confidence": 27.85,
      "standardizedContribution": 31.2,
      "adHocContribution": 52.11,
      "overall": 41.91
    }
  },
  {
    "id": "an-015",
    "input": {
      "protocolFidelity": 0.62,
      "siteConsistency": 0.54,
      "videoCompleteness": 0.56,
      "packReadiness": 0.65,
      "adHocAdherence": 0.67,
      "captureNoise": 0.44,
      "examinerDrift": 0.36,
      "overclaimRisk": 0.31,
      "examBias": "protocol_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 60.96,
      "siteScore": 58.35,
      "videoScore": 67.13,
      "readinessScore": 50.82,
      "adHocScore": 34.55,
      "confidence": 45.65,
      "standardizedContribution": 59.78,
      "adHocContribution": 36.06,
      "overall": 59.51
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 9.43,
      "siteScore": 21.58,
      "videoScore": 17.24,
      "readinessScore": 39.27,
      "adHocScore": 38.2,
      "confidence": 27.75,
      "standardizedContribution": 25.14,
      "adHocContribution": 41.8,
      "overall": 32.75
    }
  },
  {
    "id": "an-016",
    "input": {
      "protocolFidelity": 0.58,
      "siteConsistency": 0.59,
      "videoCompleteness": 0.6,
      "packReadiness": 0.6,
      "adHocAdherence": 0.63,
      "captureNoise": 0.36,
      "examinerDrift": 0.37,
      "overclaimRisk": 0.32,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 54.78,
      "siteScore": 60.67,
      "videoScore": 58.05,
      "readinessScore": 65.05,
      "adHocScore": 33.73,
      "confidence": 44.55,
      "standardizedContribution": 59.49,
      "adHocContribution": 35.81,
      "overall": 59.23
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 22.05,
      "siteScore": 21.88,
      "videoScore": 18.63,
      "readinessScore": 38.14,
      "adHocScore": 55.7,
      "confidence": 28.3,
      "standardizedContribution": 31.28,
      "adHocContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "an-017",
    "input": {
      "protocolFidelity": 0.62,
      "siteConsistency": 0.63,
      "videoCompleteness": 0.63,
      "packReadiness": 0.64,
      "adHocAdherence": 0.67,
      "captureNoise": 0.37,
      "examinerDrift": 0.39,
      "overclaimRisk": 0.33,
      "examBias": "site_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 64.04,
      "siteScore": 64.28,
      "videoScore": 42.56,
      "readinessScore": 81.43,
      "adHocScore": 36.41,
      "confidence": 47.65,
      "standardizedContribution": 61.91,
      "adHocContribution": 38.64,
      "overall": 61.72
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 18.73,
      "siteScore": 23.37,
      "videoScore": 19.98,
      "readinessScore": 40.11,
      "adHocScore": 39.86,
      "confidence": 30.3,
      "standardizedContribution": 28.41,
      "adHocContribution": 44.26,
      "overall": 35.83
    }
  },
  {
    "id": "an-018",
    "input": {
      "protocolFidelity": 0.66,
      "siteConsistency": 0.61,
      "videoCompleteness": 0.67,
      "packReadiness": 0.68,
      "adHocAdherence": 0.7,
      "captureNoise": 0.38,
      "examinerDrift": 0.34,
      "overclaimRisk": 0.27,
      "examBias": "ad_hoc_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 26.77,
      "siteScore": 54.13,
      "videoScore": 44.85,
      "readinessScore": 40.09,
      "adHocScore": 37.08,
      "confidence": 50,
      "standardizedContribution": 41.88,
      "adHocContribution": 39.18,
      "overall": 42.39
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 28.36,
      "siteScore": 22.09,
      "videoScore": 18.3,
      "readinessScore": 39.67,
      "adHocScore": 74.27,
      "confidence": 29.5,
      "standardizedContribution": 36.54,
      "adHocContribution": 62.27,
      "overall": 51.95
    }
  },
  {
    "id": "an-019",
    "input": {
      "protocolFidelity": 0.7,
      "siteConsistency": 0.65,
      "videoCompleteness": 0.7,
      "packReadiness": 0.72,
      "adHocAdherence": 0.74,
      "captureNoise": 0.38,
      "examinerDrift": 0.36,
      "overclaimRisk": 0.28,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 65.21,
      "siteScore": 67.74,
      "videoScore": 67.47,
      "readinessScore": 75.07,
      "adHocScore": 39.94,
      "confidence": 53.1,
      "standardizedContribution": 68.67,
      "adHocContribution": 42.25,
      "overall": 67.91
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 26.25,
      "siteScore": 23.72,
      "videoScore": 19.82,
      "readinessScore": 41.65,
      "adHocScore": 62.07,
      "confidence": 31.7,
      "standardizedContribution": 34.7,
      "adHocContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "an-020",
    "input": {
      "protocolFidelity": 0.66,
      "siteConsistency": 0.7,
      "videoCompleteness": 0.66,
      "packReadiness": 0.68,
      "adHocAdherence": 0.7,
      "captureNoise": 0.31,
      "examinerDrift": 0.37,
      "overclaimRisk": 0.29,
      "examBias": "protocol_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 68.73,
      "siteScore": 70.06,
      "videoScore": 80.6,
      "readinessScore": 56.34,
      "adHocScore": 38.94,
      "confidence": 52.25,
      "standardizedContribution": 69.67,
      "adHocContribution": 41.54,
      "overall": 68.61
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 13.66,
      "siteScore": 23.61,
      "videoScore": 20.65,
      "readinessScore": 40.51,
      "adHocScore": 40.86,
      "confidence": 32.05,
      "standardizedContribution": 27.86,
      "adHocContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "an-021",
    "input": {
      "protocolFidelity": 0.7,
      "siteConsistency": 0.68,
      "videoCompleteness": 0.7,
      "packReadiness": 0.72,
      "adHocAdherence": 0.73,
      "captureNoise": 0.31,
      "examinerDrift": 0.33,
      "overclaimRisk": 0.24,
      "examBias": "balanced",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 66.16,
      "siteScore": 69.88,
      "videoScore": 69.04,
      "readinessScore": 75.82,
      "adHocScore": 39.99,
      "confidence": 54.45,
      "standardizedContribution": 70.06,
      "adHocContribution": 42.54,
      "overall": 69.11
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 27.89,
      "siteScore": 22.88,
      "videoScore": 19.52,
      "readinessScore": 40.35,
      "adHocScore": 61.19,
      "confidence": 31.8,
      "standardizedContribution": 34.37,
      "adHocContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "an-022",
    "input": {
      "protocolFidelity": 0.74,
      "siteConsistency": 0.72,
      "videoCompleteness": 0.73,
      "packReadiness": 0.76,
      "adHocAdherence": 0.77,
      "captureNoise": 0.32,
      "examinerDrift": 0.34,
      "overclaimRisk": 0.25,
      "examBias": "site_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 76.68,
      "siteScore": 73.52,
      "videoScore": 50.62,
      "readinessScore": 94.56,
      "adHocScore": 42.47,
      "confidence": 57.7,
      "standardizedContribution": 72.5,
      "adHocContribution": 45.13,
      "overall": 71.57
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 24.57,
      "siteScore": 23.93,
      "videoScore": 20.46,
      "readinessScore": 42.05,
      "adHocScore": 42.21,
      "confidence": 33.35,
      "standardizedContribution": 30.64,
      "adHocContribution": 46.55,
      "overall": 38.99
    }
  },
  {
    "id": "an-023",
    "input": {
      "protocolFidelity": 0.79,
      "siteConsistency": 0.76,
      "videoCompleteness": 0.77,
      "packReadiness": 0.8,
      "adHocAdherence": 0.81,
      "captureNoise": 0.33,
      "examinerDrift": 0.36,
      "overclaimRisk": 0.25,
      "examBias": "ad_hoc_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 33.6,
      "siteScore": 67.38,
      "videoScore": 53.29,
      "readinessScore": 49.49,
      "adHocScore": 45.16,
      "confidence": 61.1,
      "standardizedContribution": 51.39,
      "adHocContribution": 47.99,
      "overall": 51.78
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 33.86,
      "siteScore": 25.44,
      "videoScore": 21.84,
      "readinessScore": 43.92,
      "adHocScore": 84.72,
      "confidence": 35.45,
      "standardizedContribution": 41.96,
      "adHocContribution": 71.31,
      "overall": 60.71
    }
  },
  {
    "id": "an-024",
    "input": {
      "protocolFidelity": 0.75,
      "siteConsistency": 0.75,
      "videoCompleteness": 0.81,
      "packReadiness": 0.76,
      "adHocAdherence": 0.77,
      "captureNoise": 0.25,
      "examinerDrift": 0.31,
      "overclaimRisk": 0.2,
      "examBias": "balanced",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 73.31,
      "siteScore": 75.91,
      "videoScore": 79.08,
      "readinessScore": 80.56,
      "adHocScore": 43.13,
      "confidence": 59.35,
      "standardizedContribution": 77.2,
      "adHocContribution": 46.16,
      "overall": 75.61
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 31.21,
      "siteScore": 23.47,
      "videoScore": 20.52,
      "readinessScore": 41.11,
      "adHocScore": 63.65,
      "confidence": 33.9,
      "standardizedContribution": 35.99,
      "adHocContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "an-025",
    "input": {
      "protocolFidelity": 0.79,
      "siteConsistency": 0.79,
      "videoCompleteness": 0.77,
      "packReadiness": 0.8,
      "adHocAdherence": 0.8,
      "captureNoise": 0.26,
      "examinerDrift": 0.33,
      "overclaimRisk": 0.21,
      "examBias": "protocol_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 82.34,
      "siteScore": 79.52,
      "videoScore": 94.85,
      "readinessScore": 64.24,
      "adHocScore": 45.2,
      "confidence": 62.45,
      "standardizedContribution": 81.13,
      "adHocContribution": 48.24,
      "overall": 79.21
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 19.5,
      "siteScore": 24.56,
      "videoScore": 21.5,
      "readinessScore": 42.63,
      "adHocScore": 43.52,
      "confidence": 35.55,
      "standardizedContribution": 30.34,
      "adHocContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "an-026",
    "input": {
      "protocolFidelity": 0.83,
      "siteConsistency": 0.83,
      "videoCompleteness": 0.8,
      "packReadiness": 0.83,
      "adHocAdherence": 0.84,
      "captureNoise": 0.27,
      "examinerDrift": 0.34,
      "overclaimRisk": 0.22,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 77.64,
      "siteScore": 83.17,
      "videoScore": 80.25,
      "readinessScore": 87.68,
      "adHocScore": 47.68,
      "confidence": 65.45,
      "standardizedContribution": 82.02,
      "adHocContribution": 50.82,
      "overall": 80.4
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 33.17,
      "siteScore": 25.61,
      "videoScore": 22.47,
      "readinessScore": 44.32,
      "adHocScore": 68.8,
      "confidence": 37.1,
      "standardizedContribution": 38.87,
      "adHocContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "an-027",
    "input": {
      "protocolFidelity": 0.87,
      "siteConsistency": 0.81,
      "videoCompleteness": 0.84,
      "packReadiness": 0.87,
      "adHocAdherence": 0.88,
      "captureNoise": 0.27,
      "examinerDrift": 0.3,
      "overclaimRisk": 0.17,
      "examBias": "site_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 90.29,
      "siteScore": 82.98,
      "videoScore": 59.14,
      "readinessScore": 100,
      "adHocScore": 49.35,
      "confidence": 67.65,
      "standardizedContribution": 81.8,
      "adHocContribution": 52.46,
      "overall": 80.52
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 30.78,
      "siteScore": 25.12,
      "videoScore": 21.53,
      "readinessScore": 44.62,
      "adHocScore": 45.22,
      "confidence": 37.2,
      "standardizedContribution": 33.45,
      "adHocContribution": 49.68,
      "overall": 42.93
    }
  },
  {
    "id": "an-028",
    "input": {
      "protocolFidelity": 0.83,
      "siteConsistency": 0.86,
      "videoCompleteness": 0.87,
      "packReadiness": 0.83,
      "adHocAdherence": 0.84,
      "captureNoise": 0.2,
      "examinerDrift": 0.31,
      "overclaimRisk": 0.17,
      "examBias": "ad_hoc_first",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 37.95,
      "siteScore": 75.3,
      "videoScore": 61.09,
      "readinessScore": 53.51,
      "adHocScore": 48.34,
      "confidence": 66.8,
      "standardizedContribution": 57.56,
      "adHocContribution": 51.78,
      "overall": 57.52
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 38.81,
      "siteScore": 25.07,
      "videoScore": 22.44,
      "readinessScore": 43.48,
      "adHocScore": 86.95,
      "confidence": 37.65,
      "standardizedContribution": 43.35,
      "adHocContribution": 72.62,
      "overall": 63.56
    }
  },
  {
    "id": "an-029",
    "input": {
      "protocolFidelity": 0.87,
      "siteConsistency": 0.9,
      "videoCompleteness": 0.91,
      "packReadiness": 0.87,
      "adHocAdherence": 0.87,
      "captureNoise": 0.2,
      "examinerDrift": 0.33,
      "overclaimRisk": 0.18,
      "examBias": "balanced",
      "profile": "standardized_async_video_exam"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 84.21,
      "siteScore": 88.91,
      "videoScore": 90.19,
      "readinessScore": 92.27,
      "adHocScore": 50.59,
      "confidence": 69.9,
      "standardizedContribution": 88.88,
      "adHocContribution": 54.2,
      "overall": 86.64
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 36.33,
      "siteScore": 26.42,
      "videoScore": 23.73,
      "readinessScore": 45,
      "adHocScore": 71.06,
      "confidence": 39.5,
      "standardizedContribution": 40.51,
      "adHocContribution": 65.11,
      "overall": 57.02
    }
  },
  {
    "id": "an-030",
    "input": {
      "protocolFidelity": 0.91,
      "siteConsistency": 0.88,
      "videoCompleteness": 0.87,
      "packReadiness": 0.91,
      "adHocAdherence": 0.91,
      "captureNoise": 0.21,
      "examinerDrift": 0.28,
      "overclaimRisk": 0.13,
      "examBias": "protocol_first",
      "profile": "ad_hoc_exam_baseline"
    },
    "expectedStandardized": {
      "mode": "standardized_async_video_exam",
      "protocolScore": 94.88,
      "siteScore": 88.77,
      "videoScore": 100,
      "readinessScore": 71.68,
      "adHocScore": 51.88,
      "confidence": 72.25,
      "standardizedContribution": 89.62,
      "adHocContribution": 55.26,
      "overall": 87.44
    },
    "expectedAdHoc": {
      "mode": "ad_hoc_exam_baseline",
      "protocolScore": 25.72,
      "siteScore": 25.24,
      "videoScore": 22.06,
      "readinessScore": 45.02,
      "adHocScore": 46.21,
      "confidence": 38.95,
      "standardizedContribution": 32.85,
      "adHocContribution": 50.65,
      "overall": 44.27
    }
  }
];
