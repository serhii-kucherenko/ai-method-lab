import type { CitizenPrefInput, CitizenPrefQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CitizenPrefInput;
  expectedSafetyOversight: CitizenPrefQuality;
  expectedInnovationSelf: CitizenPrefQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cp-001",
    "input": {
      "safetyPreference": 0.29,
      "oversightSupport": 0.25,
      "coordinationPreference": 0.28,
      "packReadiness": 0.34,
      "innovationAdherence": 0.39,
      "surveyNoise": 0.59,
      "innovationTunnel": 0.45,
      "overclaimRisk": 0.5,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 22.56,
      "oversightScore": 30.25,
      "coordinationScore": 22.93,
      "readinessScore": 37.64,
      "innovationScore": 16.4,
      "confidence": 17.95,
      "safetyOversightContribution": 27.98,
      "innovationSelfContribution": 15.96,
      "overall": 29.82
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 5.76,
      "oversightScore": 17.41,
      "coordinationScore": 12.83,
      "readinessScore": 32.39,
      "innovationScore": 40.93,
      "confidence": 17.1,
      "safetyOversightContribution": 21.86,
      "innovationSelfContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "cp-002",
    "input": {
      "safetyPreference": 0.33,
      "oversightSupport": 0.29,
      "coordinationPreference": 0.32,
      "packReadiness": 0.38,
      "innovationAdherence": 0.43,
      "surveyNoise": 0.6,
      "innovationTunnel": 0.46,
      "overclaimRisk": 0.51,
      "prefBias": "oversight_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 28.57,
      "oversightScore": 33.9,
      "coordinationScore": 17.2,
      "readinessScore": 48.93,
      "innovationScore": 18.89,
      "confidence": 21.2,
      "safetyOversightContribution": 31.25,
      "innovationSelfContribution": 18.61,
      "overall": 32.97
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 2.43,
      "oversightScore": 18.54,
      "coordinationScore": 13.86,
      "readinessScore": 34.08,
      "innovationScore": 31.53,
      "confidence": 18.65,
      "safetyOversightContribution": 20.09,
      "innovationSelfContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "cp-003",
    "input": {
      "safetyPreference": 0.37,
      "oversightSupport": 0.27,
      "coordinationPreference": 0.36,
      "packReadiness": 0.42,
      "innovationAdherence": 0.46,
      "surveyNoise": 0.6,
      "innovationTunnel": 0.42,
      "overclaimRisk": 0.46,
      "prefBias": "innovation_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 6.77,
      "oversightScore": 23.71,
      "coordinationScore": 19.55,
      "readinessScore": 19.24,
      "innovationScore": 19.94,
      "confidence": 23.4,
      "safetyOversightContribution": 17.5,
      "innovationSelfContribution": 19.69,
      "overall": 18.89
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 12.17,
      "oversightScore": 17.9,
      "coordinationScore": 12.83,
      "readinessScore": 33.93,
      "innovationScore": 54.34,
      "confidence": 18.4,
      "safetyOversightContribution": 26.23,
      "innovationSelfContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "cp-004",
    "input": {
      "safetyPreference": 0.33,
      "oversightSupport": 0.32,
      "coordinationPreference": 0.39,
      "packReadiness": 0.38,
      "innovationAdherence": 0.42,
      "surveyNoise": 0.53,
      "innovationTunnel": 0.43,
      "overclaimRisk": 0.46,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 28.09,
      "oversightScore": 36.03,
      "coordinationScore": 32.93,
      "readinessScore": 42.23,
      "innovationScore": 18.93,
      "confidence": 22.55,
      "safetyOversightContribution": 34.62,
      "innovationSelfContribution": 19.05,
      "overall": 35.82
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 8.7,
      "oversightScore": 17.89,
      "coordinationScore": 13.8,
      "readinessScore": 32.79,
      "innovationScore": 42.77,
      "confidence": 18.85,
      "safetyOversightContribution": 23.19,
      "innovationSelfContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "cp-005",
    "input": {
      "safetyPreference": 0.37,
      "oversightSupport": 0.36,
      "coordinationPreference": 0.35,
      "packReadiness": 0.42,
      "innovationAdherence": 0.46,
      "surveyNoise": 0.53,
      "innovationTunnel": 0.45,
      "overclaimRisk": 0.47,
      "prefBias": "safety_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 34.83,
      "oversightScore": 39.64,
      "coordinationScore": 39.44,
      "readinessScore": 35.49,
      "innovationScore": 21.8,
      "confidence": 25.65,
      "safetyOversightContribution": 37.52,
      "innovationSelfContribution": 22.19,
      "overall": 38.76
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 0,
      "oversightScore": 19.59,
      "coordinationScore": 15.41,
      "readinessScore": 34.77,
      "innovationScore": 32.95,
      "confidence": 21.05,
      "safetyOversightContribution": 20.54,
      "innovationSelfContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "cp-006",
    "input": {
      "safetyPreference": 0.41,
      "oversightSupport": 0.34,
      "coordinationPreference": 0.39,
      "packReadiness": 0.45,
      "innovationAdherence": 0.5,
      "surveyNoise": 0.54,
      "innovationTunnel": 0.4,
      "overclaimRisk": 0.42,
      "prefBias": "balanced",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 33.94,
      "oversightScore": 39.5,
      "coordinationScore": 34.86,
      "readinessScore": 47.85,
      "innovationScore": 23.08,
      "confidence": 27.75,
      "safetyOversightContribution": 38.7,
      "innovationSelfContribution": 23.38,
      "overall": 39.94
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 11.98,
      "oversightScore": 18.6,
      "coordinationScore": 14.01,
      "readinessScore": 34.78,
      "innovationScore": 46.72,
      "confidence": 20.5,
      "safetyOversightContribution": 25.22,
      "innovationSelfContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "cp-007",
    "input": {
      "safetyPreference": 0.45,
      "oversightSupport": 0.38,
      "coordinationPreference": 0.42,
      "packReadiness": 0.49,
      "innovationAdherence": 0.53,
      "surveyNoise": 0.55,
      "innovationTunnel": 0.42,
      "overclaimRisk": 0.43,
      "prefBias": "oversight_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 41.2,
      "oversightScore": 43.11,
      "coordinationScore": 25.56,
      "readinessScore": 61.29,
      "innovationScore": 25.15,
      "confidence": 30.85,
      "safetyOversightContribution": 41.74,
      "innovationSelfContribution": 25.64,
      "overall": 42.84
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 8.27,
      "oversightScore": 19.9,
      "coordinationScore": 15.24,
      "readinessScore": 36.3,
      "innovationScore": 34.2,
      "confidence": 22.15,
      "safetyOversightContribution": 22.78,
      "innovationSelfContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "cp-008",
    "input": {
      "safetyPreference": 0.41,
      "oversightSupport": 0.43,
      "coordinationPreference": 0.46,
      "packReadiness": 0.45,
      "innovationAdherence": 0.49,
      "surveyNoise": 0.47,
      "innovationTunnel": 0.43,
      "overclaimRisk": 0.44,
      "prefBias": "innovation_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 11.91,
      "oversightScore": 35.43,
      "coordinationScore": 27.9,
      "readinessScore": 24.76,
      "innovationScore": 24.32,
      "confidence": 30,
      "safetyOversightContribution": 25.33,
      "innovationSelfContribution": 25.23,
      "overall": 26.31
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 16.4,
      "oversightScore": 20.02,
      "coordinationScore": 16.36,
      "readinessScore": 35.17,
      "innovationScore": 58.5,
      "confidence": 22.7,
      "safetyOversightContribution": 29.29,
      "innovationSelfContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "cp-009",
    "input": {
      "safetyPreference": 0.46,
      "oversightSupport": 0.41,
      "coordinationPreference": 0.5,
      "packReadiness": 0.49,
      "innovationAdherence": 0.53,
      "surveyNoise": 0.48,
      "innovationTunnel": 0.39,
      "overclaimRisk": 0.38,
      "prefBias": "balanced",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 40.05,
      "oversightScore": 45.49,
      "coordinationScore": 44.98,
      "readinessScore": 52.59,
      "innovationScore": 25.81,
      "confidence": 32.5,
      "safetyOversightContribution": 45.6,
      "innovationSelfContribution": 26.69,
      "overall": 46.2
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 14.91,
      "oversightScore": 19.47,
      "coordinationScore": 15.34,
      "readinessScore": 35.36,
      "innovationScore": 48.88,
      "confidence": 22.7,
      "safetyOversightContribution": 26.79,
      "innovationSelfContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "cp-010",
    "input": {
      "safetyPreference": 0.5,
      "oversightSupport": 0.45,
      "coordinationPreference": 0.46,
      "packReadiness": 0.53,
      "innovationAdherence": 0.57,
      "surveyNoise": 0.49,
      "innovationTunnel": 0.4,
      "overclaimRisk": 0.39,
      "prefBias": "safety_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 48,
      "oversightScore": 49.14,
      "coordinationScore": 53.86,
      "readinessScore": 43.07,
      "innovationScore": 28.29,
      "confidence": 35.75,
      "safetyOversightContribution": 48.85,
      "innovationSelfContribution": 29.32,
      "overall": 49.33
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 3.59,
      "oversightScore": 20.58,
      "coordinationScore": 16.35,
      "readinessScore": 37.06,
      "innovationScore": 35.54,
      "confidence": 24.25,
      "safetyOversightContribution": 22.62,
      "innovationSelfContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "cp-011",
    "input": {
      "safetyPreference": 0.54,
      "oversightSupport": 0.49,
      "coordinationPreference": 0.49,
      "packReadiness": 0.57,
      "innovationAdherence": 0.6,
      "surveyNoise": 0.49,
      "innovationTunnel": 0.42,
      "overclaimRisk": 0.4,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 47.21,
      "oversightScore": 52.75,
      "coordinationScore": 46.49,
      "readinessScore": 60.27,
      "innovationScore": 30.54,
      "confidence": 38.85,
      "safetyOversightContribution": 51.32,
      "innovationSelfContribution": 31.82,
      "overall": 51.81
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 17.1,
      "oversightScore": 22.02,
      "coordinationScore": 17.74,
      "readinessScore": 38.58,
      "innovationScore": 54.12,
      "confidence": 26.1,
      "safetyOversightContribution": 29.91,
      "innovationSelfContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "cp-012",
    "input": {
      "safetyPreference": 0.5,
      "oversightSupport": 0.48,
      "coordinationPreference": 0.53,
      "packReadiness": 0.53,
      "innovationAdherence": 0.56,
      "surveyNoise": 0.42,
      "innovationTunnel": 0.37,
      "overclaimRisk": 0.35,
      "prefBias": "oversight_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 50.05,
      "oversightScore": 51.28,
      "coordinationScore": 34.12,
      "readinessScore": 67.57,
      "innovationScore": 28.34,
      "confidence": 37.1,
      "safetyOversightContribution": 49.76,
      "innovationSelfContribution": 29.7,
      "overall": 50.15
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 13.23,
      "oversightScore": 19.84,
      "coordinationScore": 16.17,
      "readinessScore": 35.76,
      "innovationScore": 34.93,
      "confidence": 24.35,
      "safetyOversightContribution": 23.99,
      "innovationSelfContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "cp-013",
    "input": {
      "safetyPreference": 0.54,
      "oversightSupport": 0.52,
      "coordinationPreference": 0.56,
      "packReadiness": 0.57,
      "innovationAdherence": 0.6,
      "surveyNoise": 0.42,
      "innovationTunnel": 0.39,
      "overclaimRisk": 0.36,
      "prefBias": "innovation_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 19.05,
      "oversightScore": 44.88,
      "coordinationScore": 36.31,
      "readinessScore": 32.66,
      "innovationScore": 31.2,
      "confidence": 40.2,
      "safetyOversightContribution": 33.59,
      "innovationSelfContribution": 32.8,
      "overall": 34.45
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 22.62,
      "oversightScore": 21.51,
      "coordinationScore": 17.75,
      "readinessScore": 37.74,
      "innovationScore": 67.02,
      "confidence": 26.55,
      "safetyOversightContribution": 33.33,
      "innovationSelfContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "cp-014",
    "input": {
      "safetyPreference": 0.58,
      "oversightSupport": 0.56,
      "coordinationPreference": 0.6,
      "packReadiness": 0.61,
      "innovationAdherence": 0.63,
      "surveyNoise": 0.43,
      "innovationTunnel": 0.4,
      "overclaimRisk": 0.36,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 52.62,
      "oversightScore": 58.53,
      "coordinationScore": 56.38,
      "readinessScore": 64.86,
      "innovationScore": 33.07,
      "confidence": 43.45,
      "safetyOversightContribution": 57.9,
      "innovationSelfContribution": 34.8,
      "overall": 57.74
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 20.03,
      "oversightScore": 22.36,
      "coordinationScore": 18.54,
      "readinessScore": 38.98,
      "innovationScore": 55.96,
      "confidence": 27.85,
      "safetyOversightContribution": 31.17,
      "innovationSelfContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "cp-015",
    "input": {
      "safetyPreference": 0.62,
      "oversightSupport": 0.54,
      "coordinationPreference": 0.56,
      "packReadiness": 0.65,
      "innovationAdherence": 0.67,
      "surveyNoise": 0.44,
      "innovationTunnel": 0.36,
      "overclaimRisk": 0.31,
      "prefBias": "safety_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 60.5,
      "oversightScore": 58.35,
      "coordinationScore": 67.29,
      "readinessScore": 50.82,
      "innovationScore": 34.55,
      "confidence": 45.65,
      "safetyOversightContribution": 59.71,
      "innovationSelfContribution": 36.22,
      "overall": 59.48
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 9.43,
      "oversightScore": 21.78,
      "coordinationScore": 17.48,
      "readinessScore": 39.27,
      "innovationScore": 38.2,
      "confidence": 27.75,
      "safetyOversightContribution": 25.23,
      "innovationSelfContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "cp-016",
    "input": {
      "safetyPreference": 0.58,
      "oversightSupport": 0.59,
      "coordinationPreference": 0.6,
      "packReadiness": 0.6,
      "innovationAdherence": 0.63,
      "surveyNoise": 0.36,
      "innovationTunnel": 0.37,
      "overclaimRisk": 0.32,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 54.46,
      "oversightScore": 60.67,
      "coordinationScore": 58.01,
      "readinessScore": 65.05,
      "innovationScore": 33.73,
      "confidence": 44.55,
      "safetyOversightContribution": 59.4,
      "innovationSelfContribution": 35.76,
      "overall": 59.14
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 22.05,
      "oversightScore": 21.83,
      "coordinationScore": 18.56,
      "readinessScore": 38.14,
      "innovationScore": 55.7,
      "confidence": 28.3,
      "safetyOversightContribution": 31.26,
      "innovationSelfContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "cp-017",
    "input": {
      "safetyPreference": 0.62,
      "oversightSupport": 0.63,
      "coordinationPreference": 0.63,
      "packReadiness": 0.64,
      "innovationAdherence": 0.67,
      "surveyNoise": 0.37,
      "innovationTunnel": 0.39,
      "overclaimRisk": 0.33,
      "prefBias": "oversight_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 64.02,
      "oversightScore": 64.28,
      "coordinationScore": 42.54,
      "readinessScore": 81.43,
      "innovationScore": 36.41,
      "confidence": 47.65,
      "safetyOversightContribution": 61.9,
      "innovationSelfContribution": 38.61,
      "overall": 61.71
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 18.73,
      "oversightScore": 23.34,
      "coordinationScore": 19.95,
      "readinessScore": 40.11,
      "innovationScore": 39.86,
      "confidence": 30.3,
      "safetyOversightContribution": 28.4,
      "innovationSelfContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "cp-018",
    "input": {
      "safetyPreference": 0.66,
      "oversightSupport": 0.61,
      "coordinationPreference": 0.67,
      "packReadiness": 0.68,
      "innovationAdherence": 0.7,
      "surveyNoise": 0.38,
      "innovationTunnel": 0.34,
      "overclaimRisk": 0.27,
      "prefBias": "innovation_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 25.78,
      "oversightScore": 54.13,
      "coordinationScore": 44.82,
      "readinessScore": 40.09,
      "innovationScore": 37.08,
      "confidence": 50,
      "safetyOversightContribution": 41.63,
      "innovationSelfContribution": 39.16,
      "overall": 42.19
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 28.36,
      "oversightScore": 22.06,
      "coordinationScore": 18.26,
      "readinessScore": 39.67,
      "innovationScore": 74.27,
      "confidence": 29.5,
      "safetyOversightContribution": 36.52,
      "innovationSelfContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "cp-019",
    "input": {
      "safetyPreference": 0.7,
      "oversightSupport": 0.65,
      "coordinationPreference": 0.7,
      "packReadiness": 0.72,
      "innovationAdherence": 0.74,
      "surveyNoise": 0.38,
      "innovationTunnel": 0.36,
      "overclaimRisk": 0.28,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 63.81,
      "oversightScore": 67.74,
      "coordinationScore": 67.47,
      "readinessScore": 75.07,
      "innovationScore": 39.94,
      "confidence": 53.1,
      "safetyOversightContribution": 68.33,
      "innovationSelfContribution": 42.25,
      "overall": 67.64
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 26.25,
      "oversightScore": 23.72,
      "coordinationScore": 19.82,
      "readinessScore": 41.65,
      "innovationScore": 62.07,
      "confidence": 31.7,
      "safetyOversightContribution": 34.7,
      "innovationSelfContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "cp-020",
    "input": {
      "safetyPreference": 0.66,
      "oversightSupport": 0.7,
      "coordinationPreference": 0.66,
      "packReadiness": 0.68,
      "innovationAdherence": 0.7,
      "surveyNoise": 0.31,
      "innovationTunnel": 0.37,
      "overclaimRisk": 0.29,
      "prefBias": "safety_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 69.98,
      "oversightScore": 70.06,
      "coordinationScore": 80.6,
      "readinessScore": 56.34,
      "innovationScore": 38.94,
      "confidence": 52.25,
      "safetyOversightContribution": 69.97,
      "innovationSelfContribution": 41.54,
      "overall": 68.85
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 13.66,
      "oversightScore": 23.61,
      "coordinationScore": 20.65,
      "readinessScore": 40.51,
      "innovationScore": 40.86,
      "confidence": 32.05,
      "safetyOversightContribution": 27.86,
      "innovationSelfContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "cp-021",
    "input": {
      "safetyPreference": 0.7,
      "oversightSupport": 0.68,
      "coordinationPreference": 0.7,
      "packReadiness": 0.72,
      "innovationAdherence": 0.73,
      "surveyNoise": 0.31,
      "innovationTunnel": 0.33,
      "overclaimRisk": 0.24,
      "prefBias": "balanced",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 65.6,
      "oversightScore": 69.88,
      "coordinationScore": 69.04,
      "readinessScore": 75.82,
      "innovationScore": 39.99,
      "confidence": 54.45,
      "safetyOversightContribution": 69.92,
      "innovationSelfContribution": 42.54,
      "overall": 68.99
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 27.89,
      "oversightScore": 22.88,
      "coordinationScore": 19.52,
      "readinessScore": 40.35,
      "innovationScore": 61.19,
      "confidence": 31.8,
      "safetyOversightContribution": 34.37,
      "innovationSelfContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "cp-022",
    "input": {
      "safetyPreference": 0.74,
      "oversightSupport": 0.72,
      "coordinationPreference": 0.73,
      "packReadiness": 0.76,
      "innovationAdherence": 0.77,
      "surveyNoise": 0.32,
      "innovationTunnel": 0.34,
      "overclaimRisk": 0.25,
      "prefBias": "oversight_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 76.39,
      "oversightScore": 73.52,
      "coordinationScore": 50.64,
      "readinessScore": 94.56,
      "innovationScore": 42.47,
      "confidence": 57.7,
      "safetyOversightContribution": 72.43,
      "innovationSelfContribution": 45.15,
      "overall": 71.52
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 24.57,
      "oversightScore": 23.95,
      "coordinationScore": 20.48,
      "readinessScore": 42.05,
      "innovationScore": 42.21,
      "confidence": 33.35,
      "safetyOversightContribution": 30.65,
      "innovationSelfContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "cp-023",
    "input": {
      "safetyPreference": 0.79,
      "oversightSupport": 0.76,
      "coordinationPreference": 0.77,
      "packReadiness": 0.8,
      "innovationAdherence": 0.81,
      "surveyNoise": 0.33,
      "innovationTunnel": 0.36,
      "overclaimRisk": 0.25,
      "prefBias": "innovation_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 33.46,
      "oversightScore": 67.38,
      "coordinationScore": 53.32,
      "readinessScore": 49.49,
      "innovationScore": 45.16,
      "confidence": 61.1,
      "safetyOversightContribution": 51.37,
      "innovationSelfContribution": 48.03,
      "overall": 51.77
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 33.86,
      "oversightScore": 25.49,
      "coordinationScore": 21.9,
      "readinessScore": 43.92,
      "innovationScore": 84.72,
      "confidence": 35.45,
      "safetyOversightContribution": 41.98,
      "innovationSelfContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "cp-024",
    "input": {
      "safetyPreference": 0.75,
      "oversightSupport": 0.75,
      "coordinationPreference": 0.81,
      "packReadiness": 0.76,
      "innovationAdherence": 0.77,
      "surveyNoise": 0.25,
      "innovationTunnel": 0.31,
      "overclaimRisk": 0.2,
      "prefBias": "balanced",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 71.55,
      "oversightScore": 75.91,
      "coordinationScore": 78.99,
      "readinessScore": 80.56,
      "innovationScore": 43.13,
      "confidence": 59.35,
      "safetyOversightContribution": 76.75,
      "innovationSelfContribution": 46.07,
      "overall": 75.23
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 31.21,
      "oversightScore": 23.36,
      "coordinationScore": 20.38,
      "readinessScore": 41.11,
      "innovationScore": 63.65,
      "confidence": 33.9,
      "safetyOversightContribution": 35.94,
      "innovationSelfContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "cp-025",
    "input": {
      "safetyPreference": 0.79,
      "oversightSupport": 0.79,
      "coordinationPreference": 0.77,
      "packReadiness": 0.8,
      "innovationAdherence": 0.8,
      "surveyNoise": 0.26,
      "innovationTunnel": 0.33,
      "overclaimRisk": 0.21,
      "prefBias": "safety_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 83,
      "oversightScore": 79.52,
      "coordinationScore": 94.88,
      "readinessScore": 64.24,
      "innovationScore": 45.2,
      "confidence": 62.45,
      "safetyOversightContribution": 81.29,
      "innovationSelfContribution": 48.27,
      "overall": 79.35
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 19.5,
      "oversightScore": 24.6,
      "coordinationScore": 21.54,
      "readinessScore": 42.63,
      "innovationScore": 43.52,
      "confidence": 35.55,
      "safetyOversightContribution": 30.36,
      "innovationSelfContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "cp-026",
    "input": {
      "safetyPreference": 0.83,
      "oversightSupport": 0.83,
      "coordinationPreference": 0.8,
      "packReadiness": 0.83,
      "innovationAdherence": 0.84,
      "surveyNoise": 0.27,
      "innovationTunnel": 0.34,
      "overclaimRisk": 0.22,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 78.52,
      "oversightScore": 83.17,
      "coordinationScore": 80.3,
      "readinessScore": 87.68,
      "innovationScore": 47.68,
      "confidence": 65.45,
      "safetyOversightContribution": 82.24,
      "innovationSelfContribution": 50.87,
      "overall": 80.59
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 33.17,
      "oversightScore": 25.67,
      "coordinationScore": 22.55,
      "readinessScore": 44.32,
      "innovationScore": 68.8,
      "confidence": 37.1,
      "safetyOversightContribution": 38.9,
      "innovationSelfContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "cp-027",
    "input": {
      "safetyPreference": 0.87,
      "oversightSupport": 0.81,
      "coordinationPreference": 0.84,
      "packReadiness": 0.87,
      "innovationAdherence": 0.88,
      "surveyNoise": 0.27,
      "innovationTunnel": 0.3,
      "overclaimRisk": 0.17,
      "prefBias": "oversight_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 89.4,
      "oversightScore": 82.98,
      "coordinationScore": 59.19,
      "readinessScore": 100,
      "innovationScore": 49.35,
      "confidence": 67.65,
      "safetyOversightContribution": 81.6,
      "innovationSelfContribution": 52.5,
      "overall": 80.36
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 30.78,
      "oversightScore": 25.18,
      "coordinationScore": 21.6,
      "readinessScore": 44.62,
      "innovationScore": 45.22,
      "confidence": 37.2,
      "safetyOversightContribution": 33.48,
      "innovationSelfContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "cp-028",
    "input": {
      "safetyPreference": 0.83,
      "oversightSupport": 0.86,
      "coordinationPreference": 0.87,
      "packReadiness": 0.83,
      "innovationAdherence": 0.84,
      "surveyNoise": 0.2,
      "innovationTunnel": 0.31,
      "overclaimRisk": 0.17,
      "prefBias": "innovation_first",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 37.76,
      "oversightScore": 75.3,
      "coordinationScore": 61.04,
      "readinessScore": 53.51,
      "innovationScore": 48.34,
      "confidence": 66.8,
      "safetyOversightContribution": 57.5,
      "innovationSelfContribution": 51.73,
      "overall": 57.46
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 38.81,
      "oversightScore": 25.01,
      "coordinationScore": 22.37,
      "readinessScore": 43.48,
      "innovationScore": 86.95,
      "confidence": 37.65,
      "safetyOversightContribution": 43.32,
      "innovationSelfContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "cp-029",
    "input": {
      "safetyPreference": 0.87,
      "oversightSupport": 0.9,
      "coordinationPreference": 0.91,
      "packReadiness": 0.87,
      "innovationAdherence": 0.87,
      "surveyNoise": 0.2,
      "innovationTunnel": 0.33,
      "overclaimRisk": 0.18,
      "prefBias": "balanced",
      "profile": "safety_first_public_oversight"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 83.89,
      "oversightScore": 88.91,
      "coordinationScore": 90.14,
      "readinessScore": 92.27,
      "innovationScore": 50.59,
      "confidence": 69.9,
      "safetyOversightContribution": 88.79,
      "innovationSelfContribution": 54.16,
      "overall": 86.56
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 36.33,
      "oversightScore": 26.36,
      "coordinationScore": 23.66,
      "readinessScore": 45,
      "innovationScore": 71.06,
      "confidence": 39.5,
      "safetyOversightContribution": 40.48,
      "innovationSelfContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "cp-030",
    "input": {
      "safetyPreference": 0.91,
      "oversightSupport": 0.88,
      "coordinationPreference": 0.87,
      "packReadiness": 0.91,
      "innovationAdherence": 0.91,
      "surveyNoise": 0.21,
      "innovationTunnel": 0.28,
      "overclaimRisk": 0.13,
      "prefBias": "safety_first",
      "profile": "innovation_first_self_regulation"
    },
    "expectedSafetyOversight": {
      "mode": "safety_first_public_oversight",
      "safetyScore": 95.24,
      "oversightScore": 88.77,
      "coordinationScore": 100,
      "readinessScore": 71.68,
      "innovationScore": 51.88,
      "confidence": 72.25,
      "safetyOversightContribution": 89.71,
      "innovationSelfContribution": 55.31,
      "overall": 87.52
    },
    "expectedInnovationSelf": {
      "mode": "innovation_first_self_regulation",
      "safetyScore": 25.72,
      "oversightScore": 25.3,
      "coordinationScore": 22.14,
      "readinessScore": 45.02,
      "innovationScore": 46.21,
      "confidence": 38.95,
      "safetyOversightContribution": 32.88,
      "innovationSelfContribution": 50.68,
      "overall": 44.3
    }
  }
];
