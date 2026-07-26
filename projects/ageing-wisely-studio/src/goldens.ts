import type { CareInput, CareQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareInput;
  expectedTherapist: CareQuality;
  expectedWaitlist: CareQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "aw-001",
    "input": {
      "therapistSupportFidelity": 0.29,
      "moduleCompletion": 0.34,
      "engagementAdherence": 0.25,
      "symptomReliefSignal": 0.3,
      "coDesignFit": 0.34,
      "dropoutRisk": 0.45,
      "sessionSignal": 0.34,
      "overclaimRisk": 0.5,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 37.28,
      "completionScore": 36.19,
      "engagementScore": 37.94,
      "reliefScore": 21.52,
      "dropoutPenalty": 31.8,
      "confidence": 15.7,
      "therapistContribution": 42.7,
      "waitlistContribution": 28.51,
      "overall": 44.15
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 11.52,
      "completionScore": 35.23,
      "engagementScore": 13.76,
      "reliefScore": 28.1,
      "dropoutPenalty": 19,
      "confidence": 14.46,
      "therapistContribution": 33.92,
      "waitlistContribution": 26.28,
      "overall": 23.22
    }
  },
  {
    "id": "aw-002",
    "input": {
      "therapistSupportFidelity": 0.33,
      "moduleCompletion": 0.38,
      "engagementAdherence": 0.29,
      "symptomReliefSignal": 0.34,
      "coDesignFit": 0.38,
      "dropoutRisk": 0.46,
      "sessionSignal": 0.38,
      "overclaimRisk": 0.51,
      "careBias": "self_guided_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 36.97,
      "completionScore": 21.12,
      "engagementScore": 24.19,
      "reliefScore": 25.02,
      "dropoutPenalty": 32.02,
      "confidence": 18.7,
      "therapistContribution": 35.05,
      "waitlistContribution": 22.25,
      "overall": 36.75
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 11.91,
      "completionScore": 42.03,
      "engagementScore": 16.2,
      "reliefScore": 37.09,
      "dropoutPenalty": 19.99,
      "confidence": 16.87,
      "therapistContribution": 37.45,
      "waitlistContribution": 33.18,
      "overall": 29.08
    }
  },
  {
    "id": "aw-003",
    "input": {
      "therapistSupportFidelity": 0.37,
      "moduleCompletion": 0.42,
      "engagementAdherence": 0.27,
      "symptomReliefSignal": 0.32,
      "coDesignFit": 0.41,
      "dropoutRisk": 0.42,
      "sessionSignal": 0.42,
      "overclaimRisk": 0.46,
      "careBias": "waitlist_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 28.71,
      "completionScore": 31.48,
      "engagementScore": 24.83,
      "reliefScore": 24.89,
      "dropoutPenalty": 28.85,
      "confidence": 22.65,
      "therapistContribution": 36.19,
      "waitlistContribution": 24.16,
      "overall": 35.02
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 12.22,
      "completionScore": 43.66,
      "engagementScore": 15.68,
      "reliefScore": 36.03,
      "dropoutPenalty": 18.21,
      "confidence": 19.13,
      "therapistContribution": 37.88,
      "waitlistContribution": 32.82,
      "overall": 28.95
    }
  },
  {
    "id": "aw-004",
    "input": {
      "therapistSupportFidelity": 0.33,
      "moduleCompletion": 0.38,
      "engagementAdherence": 0.31,
      "symptomReliefSignal": 0.36,
      "coDesignFit": 0.37,
      "dropoutRisk": 0.43,
      "sessionSignal": 0.38,
      "overclaimRisk": 0.46,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 41.16,
      "completionScore": 39.66,
      "engagementScore": 42.74,
      "reliefScore": 26.78,
      "dropoutPenalty": 30.4,
      "confidence": 19.45,
      "therapistContribution": 46.24,
      "waitlistContribution": 31.89,
      "overall": 47.66
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 13.44,
      "completionScore": 35.93,
      "engagementScore": 18.12,
      "reliefScore": 31.74,
      "dropoutPenalty": 18.98,
      "confidence": 17.97,
      "therapistContribution": 36.05,
      "waitlistContribution": 29.04,
      "overall": 25.84
    }
  },
  {
    "id": "aw-005",
    "input": {
      "therapistSupportFidelity": 0.37,
      "moduleCompletion": 0.42,
      "engagementAdherence": 0.35,
      "symptomReliefSignal": 0.4,
      "coDesignFit": 0.41,
      "dropoutRisk": 0.45,
      "sessionSignal": 0.42,
      "overclaimRisk": 0.47,
      "careBias": "therapist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 61.72,
      "completionScore": 52.18,
      "engagementScore": 59.73,
      "reliefScore": 30.16,
      "dropoutPenalty": 31.24,
      "confidence": 22.45,
      "therapistContribution": 59.84,
      "waitlistContribution": 40.26,
      "overall": 60.32
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 1.83,
      "completionScore": 28.13,
      "engagementScore": 20.36,
      "reliefScore": 24.58,
      "dropoutPenalty": 20.4,
      "confidence": 20.38,
      "therapistContribution": 30.9,
      "waitlistContribution": 23.36,
      "overall": 19.98
    }
  },
  {
    "id": "aw-006",
    "input": {
      "therapistSupportFidelity": 0.41,
      "moduleCompletion": 0.45,
      "engagementAdherence": 0.32,
      "symptomReliefSignal": 0.37,
      "coDesignFit": 0.45,
      "dropoutRisk": 0.4,
      "sessionSignal": 0.45,
      "overclaimRisk": 0.42,
      "careBias": "balanced",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 49.42,
      "completionScore": 45.97,
      "engagementScore": 46.08,
      "reliefScore": 29.25,
      "dropoutPenalty": 27.28,
      "confidence": 26.4,
      "therapistContribution": 51.85,
      "waitlistContribution": 34.06,
      "overall": 52.65
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 14.21,
      "completionScore": 37.28,
      "engagementScore": 19.38,
      "reliefScore": 32.88,
      "dropoutPenalty": 18.02,
      "confidence": 21.95,
      "therapistContribution": 37.15,
      "waitlistContribution": 29.96,
      "overall": 26.56
    }
  },
  {
    "id": "aw-007",
    "input": {
      "therapistSupportFidelity": 0.45,
      "moduleCompletion": 0.49,
      "engagementAdherence": 0.36,
      "symptomReliefSignal": 0.41,
      "coDesignFit": 0.48,
      "dropoutRisk": 0.42,
      "sessionSignal": 0.49,
      "overclaimRisk": 0.43,
      "careBias": "self_guided_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 47.51,
      "completionScore": 27.85,
      "engagementScore": 28.71,
      "reliefScore": 32.62,
      "dropoutPenalty": 28.21,
      "confidence": 29.15,
      "therapistContribution": 41.86,
      "waitlistContribution": 26.19,
      "overall": 43.04
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 14.6,
      "completionScore": 45.83,
      "engagementScore": 21.62,
      "reliefScore": 43.19,
      "dropoutPenalty": 19.5,
      "confidence": 24.35,
      "therapistContribution": 41.15,
      "waitlistContribution": 37.98,
      "overall": 33.4
    }
  },
  {
    "id": "aw-008",
    "input": {
      "therapistSupportFidelity": 0.41,
      "moduleCompletion": 0.45,
      "engagementAdherence": 0.4,
      "symptomReliefSignal": 0.45,
      "coDesignFit": 0.44,
      "dropoutRisk": 0.43,
      "sessionSignal": 0.45,
      "overclaimRisk": 0.44,
      "careBias": "waitlist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 31.71,
      "completionScore": 33.5,
      "engagementScore": 29.24,
      "reliefScore": 34.52,
      "dropoutPenalty": 29.77,
      "confidence": 25.75,
      "therapistContribution": 38.55,
      "waitlistContribution": 28.95,
      "overall": 37.82
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 15.2,
      "completionScore": 44.13,
      "engagementScore": 24.07,
      "reliefScore": 45.71,
      "dropoutPenalty": 20.27,
      "confidence": 23.05,
      "therapistContribution": 41.77,
      "waitlistContribution": 39.45,
      "overall": 34.86
    }
  },
  {
    "id": "aw-009",
    "input": {
      "therapistSupportFidelity": 0.46,
      "moduleCompletion": 0.49,
      "engagementAdherence": 0.38,
      "symptomReliefSignal": 0.43,
      "coDesignFit": 0.48,
      "dropoutRisk": 0.39,
      "sessionSignal": 0.49,
      "overclaimRisk": 0.38,
      "careBias": "balanced",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 53.89,
      "completionScore": 49.68,
      "engagementScore": 50.66,
      "reliefScore": 34.39,
      "dropoutPenalty": 26.43,
      "confidence": 30.45,
      "therapistContribution": 55.48,
      "waitlistContribution": 37.41,
      "overall": 56.23
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 15.95,
      "completionScore": 37.75,
      "engagementScore": 23.55,
      "reliefScore": 36.42,
      "dropoutPenalty": 18.52,
      "confidence": 25.4,
      "therapistContribution": 39.03,
      "waitlistContribution": 32.53,
      "overall": 28.92
    }
  },
  {
    "id": "aw-010",
    "input": {
      "therapistSupportFidelity": 0.5,
      "moduleCompletion": 0.53,
      "engagementAdherence": 0.42,
      "symptomReliefSignal": 0.47,
      "coDesignFit": 0.52,
      "dropoutRisk": 0.4,
      "sessionSignal": 0.53,
      "overclaimRisk": 0.39,
      "careBias": "therapist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 79.54,
      "completionScore": 64.57,
      "engagementScore": 70.5,
      "reliefScore": 37.89,
      "dropoutPenalty": 26.65,
      "confidence": 33.45,
      "therapistContribution": 72.06,
      "waitlistContribution": 47.03,
      "overall": 71.55
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 4.34,
      "completionScore": 27.71,
      "engagementScore": 25.99,
      "reliefScore": 27.56,
      "dropoutPenalty": 19.51,
      "confidence": 27.81,
      "therapistContribution": 33.22,
      "waitlistContribution": 25.4,
      "overall": 21.78
    }
  },
  {
    "id": "aw-011",
    "input": {
      "therapistSupportFidelity": 0.54,
      "moduleCompletion": 0.57,
      "engagementAdherence": 0.46,
      "symptomReliefSignal": 0.51,
      "coDesignFit": 0.55,
      "dropoutRisk": 0.42,
      "sessionSignal": 0.57,
      "overclaimRisk": 0.4,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 61.46,
      "completionScore": 56.61,
      "engagementScore": 55.87,
      "reliefScore": 41.26,
      "dropoutPenalty": 27.58,
      "confidence": 36.2,
      "therapistContribution": 60.73,
      "waitlistContribution": 42.38,
      "overall": 61.43
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 17.73,
      "completionScore": 39.3,
      "engagementScore": 28.23,
      "reliefScore": 41.54,
      "dropoutPenalty": 20.99,
      "confidence": 30.22,
      "therapistContribution": 41.16,
      "waitlistContribution": 36.19,
      "overall": 31.64
    }
  },
  {
    "id": "aw-012",
    "input": {
      "therapistSupportFidelity": 0.5,
      "moduleCompletion": 0.53,
      "engagementAdherence": 0.44,
      "symptomReliefSignal": 0.49,
      "coDesignFit": 0.51,
      "dropoutRisk": 0.37,
      "sessionSignal": 0.53,
      "overclaimRisk": 0.35,
      "careBias": "self_guided_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 51.67,
      "completionScore": 30.46,
      "engagementScore": 32.8,
      "reliefScore": 39.66,
      "dropoutPenalty": 25.04,
      "confidence": 34,
      "therapistContribution": 45.39,
      "waitlistContribution": 29.45,
      "overall": 46.52
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 17.25,
      "completionScore": 46.87,
      "engagementScore": 27.91,
      "reliefScore": 49.32,
      "dropoutPenalty": 18.5,
      "confidence": 28.76,
      "therapistContribution": 44.57,
      "waitlistContribution": 42.49,
      "overall": 37.85
    }
  },
  {
    "id": "aw-013",
    "input": {
      "therapistSupportFidelity": 0.54,
      "moduleCompletion": 0.57,
      "engagementAdherence": 0.48,
      "symptomReliefSignal": 0.53,
      "coDesignFit": 0.55,
      "dropoutRisk": 0.39,
      "sessionSignal": 0.57,
      "overclaimRisk": 0.36,
      "careBias": "waitlist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 43.13,
      "completionScore": 40.81,
      "engagementScore": 34.2,
      "reliefScore": 43.03,
      "dropoutPenalty": 25.87,
      "confidence": 37,
      "therapistContribution": 45.92,
      "waitlistContribution": 33.37,
      "overall": 44.66
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 18.14,
      "completionScore": 48.28,
      "engagementScore": 30.15,
      "reliefScore": 52.64,
      "dropoutPenalty": 19.92,
      "confidence": 31.17,
      "therapistContribution": 45.86,
      "waitlistContribution": 44.87,
      "overall": 39.69
    }
  },
  {
    "id": "aw-014",
    "input": {
      "therapistSupportFidelity": 0.58,
      "moduleCompletion": 0.61,
      "engagementAdherence": 0.52,
      "symptomReliefSignal": 0.57,
      "coDesignFit": 0.58,
      "dropoutRisk": 0.4,
      "sessionSignal": 0.61,
      "overclaimRisk": 0.36,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 65.35,
      "completionScore": 60.08,
      "engagementScore": 60.67,
      "reliefScore": 46.53,
      "dropoutPenalty": 26.19,
      "confidence": 39.95,
      "therapistContribution": 64.27,
      "waitlistContribution": 45.76,
      "overall": 64.94
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 19.65,
      "completionScore": 40.01,
      "engagementScore": 32.59,
      "reliefScore": 45.18,
      "dropoutPenalty": 20.98,
      "confidence": 33.73,
      "therapistContribution": 43.29,
      "waitlistContribution": 38.95,
      "overall": 34.26
    }
  },
  {
    "id": "aw-015",
    "input": {
      "therapistSupportFidelity": 0.62,
      "moduleCompletion": 0.65,
      "engagementAdherence": 0.5,
      "symptomReliefSignal": 0.55,
      "coDesignFit": 0.62,
      "dropoutRisk": 0.36,
      "sessionSignal": 0.65,
      "overclaimRisk": 0.31,
      "careBias": "therapist_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 96.35,
      "completionScore": 77.55,
      "engagementScore": 81.42,
      "reliefScore": 46.4,
      "dropoutPenalty": 22.92,
      "confidence": 44.15,
      "therapistContribution": 84.03,
      "waitlistContribution": 54.46,
      "overall": 82.71
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 7.46,
      "completionScore": 27.73,
      "engagementScore": 32.07,
      "reliefScore": 31.14,
      "dropoutPenalty": 19.13,
      "confidence": 35.99,
      "therapistContribution": 35.85,
      "waitlistContribution": 27.98,
      "overall": 24.13
    }
  },
  {
    "id": "aw-016",
    "input": {
      "therapistSupportFidelity": 0.58,
      "moduleCompletion": 0.6,
      "engagementAdherence": 0.53,
      "symptomReliefSignal": 0.58,
      "coDesignFit": 0.58,
      "dropoutRisk": 0.37,
      "sessionSignal": 0.6,
      "overclaimRisk": 0.32,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 65.39,
      "completionScore": 59.46,
      "engagementScore": 62.22,
      "reliefScore": 47.39,
      "dropoutPenalty": 24.4,
      "confidence": 40.5,
      "therapistContribution": 64.81,
      "waitlistContribution": 46.03,
      "overall": 65.43
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 20.13,
      "completionScore": 39.52,
      "engagementScore": 33.85,
      "reliefScore": 45.52,
      "dropoutPenalty": 19.79,
      "confidence": 33.99,
      "therapistContribution": 43.85,
      "waitlistContribution": 39.24,
      "overall": 34.85
    }
  },
  {
    "id": "aw-017",
    "input": {
      "therapistSupportFidelity": 0.62,
      "moduleCompletion": 0.64,
      "engagementAdherence": 0.57,
      "symptomReliefSignal": 0.62,
      "coDesignFit": 0.62,
      "dropoutRisk": 0.39,
      "sessionSignal": 0.64,
      "overclaimRisk": 0.33,
      "careBias": "self_guided_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 61.93,
      "completionScore": 37.18,
      "engagementScore": 38.07,
      "reliefScore": 50.77,
      "dropoutPenalty": 25.24,
      "confidence": 43.5,
      "therapistContribution": 51.58,
      "waitlistContribution": 35.41,
      "overall": 52.67
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 20.52,
      "completionScore": 50.45,
      "engagementScore": 36.09,
      "reliefScore": 59.8,
      "dropoutPenalty": 21.22,
      "confidence": 36.39,
      "therapistContribution": 49.13,
      "waitlistContribution": 50.04,
      "overall": 44.14
    }
  },
  {
    "id": "aw-018",
    "input": {
      "therapistSupportFidelity": 0.66,
      "moduleCompletion": 0.68,
      "engagementAdherence": 0.55,
      "symptomReliefSignal": 0.6,
      "coDesignFit": 0.65,
      "dropoutRisk": 0.34,
      "sessionSignal": 0.68,
      "overclaimRisk": 0.27,
      "careBias": "waitlist_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 53.73,
      "completionScore": 47.54,
      "engagementScore": 38.92,
      "reliefScore": 50.76,
      "dropoutPenalty": 21.45,
      "confidence": 47.65,
      "therapistContribution": 52.91,
      "waitlistContribution": 37.32,
      "overall": 51.1
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 20.95,
      "completionScore": 52.08,
      "engagementScore": 35.77,
      "reliefScore": 58.74,
      "dropoutPenalty": 19,
      "confidence": 38.8,
      "therapistContribution": 49.71,
      "waitlistContribution": 49.72,
      "overall": 44.14
    }
  },
  {
    "id": "aw-019",
    "input": {
      "therapistSupportFidelity": 0.7,
      "moduleCompletion": 0.72,
      "engagementAdherence": 0.59,
      "symptomReliefSignal": 0.64,
      "coDesignFit": 0.69,
      "dropoutRisk": 0.36,
      "sessionSignal": 0.72,
      "overclaimRisk": 0.28,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 77.49,
      "completionScore": 69.85,
      "engagementScore": 68.59,
      "reliefScore": 54.14,
      "dropoutPenalty": 22.28,
      "confidence": 50.65,
      "therapistContribution": 73.26,
      "waitlistContribution": 51.3,
      "overall": 73.31
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 22.34,
      "completionScore": 42.06,
      "engagementScore": 38.01,
      "reliefScore": 49.96,
      "dropoutPenalty": 20.42,
      "confidence": 41.22,
      "therapistContribution": 46.39,
      "waitlistContribution": 42.59,
      "overall": 37.55
    }
  },
  {
    "id": "aw-020",
    "input": {
      "therapistSupportFidelity": 0.66,
      "moduleCompletion": 0.68,
      "engagementAdherence": 0.63,
      "symptomReliefSignal": 0.68,
      "coDesignFit": 0.65,
      "dropoutRisk": 0.37,
      "sessionSignal": 0.68,
      "overclaimRisk": 0.29,
      "careBias": "therapist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 100,
      "completionScore": 81.05,
      "engagementScore": 92.02,
      "reliefScore": 56.03,
      "dropoutPenalty": 23.84,
      "confidence": 47.25,
      "therapistContribution": 88.49,
      "waitlistContribution": 61.17,
      "overall": 87.57
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 10.44,
      "completionScore": 27.11,
      "engagementScore": 40.46,
      "reliefScore": 35.2,
      "dropoutPenalty": 21.2,
      "confidence": 39.9,
      "therapistContribution": 38.4,
      "waitlistContribution": 31.25,
      "overall": 27.12
    }
  },
  {
    "id": "aw-021",
    "input": {
      "therapistSupportFidelity": 0.7,
      "moduleCompletion": 0.72,
      "engagementAdherence": 0.61,
      "symptomReliefSignal": 0.66,
      "coDesignFit": 0.68,
      "dropoutRisk": 0.33,
      "sessionSignal": 0.72,
      "overclaimRisk": 0.24,
      "careBias": "balanced",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 77.39,
      "completionScore": 69.85,
      "engagementScore": 70.48,
      "reliefScore": 55.9,
      "dropoutPenalty": 20.67,
      "confidence": 51.2,
      "therapistContribution": 73.97,
      "waitlistContribution": 52.15,
      "overall": 74.04
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 23.25,
      "completionScore": 41.98,
      "engagementScore": 39.93,
      "reliefScore": 51.04,
      "dropoutPenalty": 19.41,
      "confidence": 42.17,
      "therapistContribution": 47.36,
      "waitlistContribution": 43.5,
      "overall": 38.71
    }
  },
  {
    "id": "aw-022",
    "input": {
      "therapistSupportFidelity": 0.74,
      "moduleCompletion": 0.76,
      "engagementAdherence": 0.65,
      "symptomReliefSignal": 0.7,
      "coDesignFit": 0.72,
      "dropoutRisk": 0.34,
      "sessionSignal": 0.76,
      "overclaimRisk": 0.25,
      "careBias": "self_guided_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 72.59,
      "completionScore": 44.25,
      "engagementScore": 43.02,
      "reliefScore": 59.4,
      "dropoutPenalty": 20.89,
      "confidence": 54.2,
      "therapistContribution": 58.73,
      "waitlistContribution": 39.82,
      "overall": 59.33
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 23.64,
      "completionScore": 54.82,
      "engagementScore": 42.38,
      "reliefScore": 66.83,
      "dropoutPenalty": 20.41,
      "confidence": 44.58,
      "therapistContribution": 53.45,
      "waitlistContribution": 55.64,
      "overall": 49.22
    }
  },
  {
    "id": "aw-023",
    "input": {
      "therapistSupportFidelity": 0.79,
      "moduleCompletion": 0.8,
      "engagementAdherence": 0.69,
      "symptomReliefSignal": 0.74,
      "coDesignFit": 0.76,
      "dropoutRisk": 0.36,
      "sessionSignal": 0.8,
      "overclaimRisk": 0.25,
      "careBias": "waitlist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 64.62,
      "completionScore": 54.85,
      "engagementScore": 44.5,
      "reliefScore": 62.78,
      "dropoutPenalty": 21.65,
      "confidence": 57.7,
      "therapistContribution": 59.53,
      "waitlistContribution": 43.74,
      "overall": 57.69
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 24.46,
      "completionScore": 56.01,
      "engagementScore": 44.62,
      "reliefScore": 70.05,
      "dropoutPenalty": 21.92,
      "confidence": 47.08,
      "therapistContribution": 54.64,
      "waitlistContribution": 57.88,
      "overall": 50.93
    }
  },
  {
    "id": "aw-024",
    "input": {
      "therapistSupportFidelity": 0.75,
      "moduleCompletion": 0.76,
      "engagementAdherence": 0.67,
      "symptomReliefSignal": 0.72,
      "coDesignFit": 0.72,
      "dropoutRisk": 0.31,
      "sessionSignal": 0.76,
      "overclaimRisk": 0.2,
      "careBias": "balanced",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 82.14,
      "completionScore": 73.57,
      "engagementScore": 75.5,
      "reliefScore": 61.17,
      "dropoutPenalty": 19.11,
      "confidence": 55.5,
      "therapistContribution": 77.92,
      "waitlistContribution": 55.54,
      "overall": 77.89
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 24.99,
      "completionScore": 42.46,
      "engagementScore": 44.3,
      "reliefScore": 54.58,
      "dropoutPenalty": 19.42,
      "confidence": 45.62,
      "therapistContribution": 49.38,
      "waitlistContribution": 46.11,
      "overall": 41.13
    }
  },
  {
    "id": "aw-025",
    "input": {
      "therapistSupportFidelity": 0.79,
      "moduleCompletion": 0.8,
      "engagementAdherence": 0.71,
      "symptomReliefSignal": 0.76,
      "coDesignFit": 0.75,
      "dropoutRisk": 0.33,
      "sessionSignal": 0.8,
      "overclaimRisk": 0.21,
      "careBias": "therapist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 100,
      "completionScore": 94.28,
      "engagementScore": 100,
      "reliefScore": 64.54,
      "dropoutPenalty": 20.04,
      "confidence": 58.25,
      "therapistContribution": 94.79,
      "waitlistContribution": 67.85,
      "overall": 93.94
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 13.38,
      "completionScore": 26.91,
      "engagementScore": 46.54,
      "reliefScore": 38.67,
      "dropoutPenalty": 20.91,
      "confidence": 48.03,
      "therapistContribution": 40.92,
      "waitlistContribution": 33.68,
      "overall": 29.27
    }
  },
  {
    "id": "aw-026",
    "input": {
      "therapistSupportFidelity": 0.83,
      "moduleCompletion": 0.83,
      "engagementAdherence": 0.74,
      "symptomReliefSignal": 0.79,
      "coDesignFit": 0.79,
      "dropoutRisk": 0.34,
      "sessionSignal": 0.83,
      "overclaimRisk": 0.22,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 89.57,
      "completionScore": 79.88,
      "engagementScore": 80.16,
      "reliefScore": 67.14,
      "dropoutPenalty": 20.19,
      "confidence": 61,
      "therapistContribution": 82.84,
      "waitlistContribution": 59.9,
      "overall": 82.71
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 26.33,
      "completionScore": 43.59,
      "engagementScore": 48.32,
      "reliefScore": 58.96,
      "dropoutPenalty": 21.79,
      "confidence": 49.75,
      "therapistContribution": 51.08,
      "waitlistContribution": 49.15,
      "overall": 43.27
    }
  },
  {
    "id": "aw-027",
    "input": {
      "therapistSupportFidelity": 0.87,
      "moduleCompletion": 0.87,
      "engagementAdherence": 0.72,
      "symptomReliefSignal": 0.77,
      "coDesignFit": 0.83,
      "dropoutRisk": 0.3,
      "sessionSignal": 0.87,
      "overclaimRisk": 0.17,
      "careBias": "self_guided_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 83.89,
      "completionScore": 51.23,
      "engagementScore": 47.67,
      "reliefScore": 67.01,
      "dropoutPenalty": 16.92,
      "confidence": 65.2,
      "therapistContribution": 65.91,
      "waitlistContribution": 43.76,
      "overall": 65.92
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 26.14,
      "completionScore": 58.4,
      "engagementScore": 47.8,
      "reliefScore": 72.83,
      "dropoutPenalty": 19.94,
      "confidence": 52.01,
      "therapistContribution": 57.05,
      "waitlistContribution": 60.3,
      "overall": 53.35
    }
  },
  {
    "id": "aw-028",
    "input": {
      "therapistSupportFidelity": 0.83,
      "moduleCompletion": 0.83,
      "engagementAdherence": 0.76,
      "symptomReliefSignal": 0.81,
      "coDesignFit": 0.79,
      "dropoutRisk": 0.31,
      "sessionSignal": 0.83,
      "overclaimRisk": 0.17,
      "careBias": "waitlist_first",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 68.15,
      "completionScore": 56.87,
      "engagementScore": 48.28,
      "reliefScore": 68.9,
      "dropoutPenalty": 18.47,
      "confidence": 62,
      "therapistContribution": 62.63,
      "waitlistContribution": 46.53,
      "overall": 60.73
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 26.86,
      "completionScore": 56.7,
      "engagementScore": 50.24,
      "reliefScore": 75.35,
      "dropoutPenalty": 20.71,
      "confidence": 50.85,
      "therapistContribution": 57.69,
      "waitlistContribution": 61.77,
      "overall": 54.87
    }
  },
  {
    "id": "aw-029",
    "input": {
      "therapistSupportFidelity": 0.87,
      "moduleCompletion": 0.87,
      "engagementAdherence": 0.8,
      "symptomReliefSignal": 0.85,
      "coDesignFit": 0.82,
      "dropoutRisk": 0.33,
      "sessionSignal": 0.87,
      "overclaimRisk": 0.18,
      "careBias": "balanced",
      "profile": "therapist_supported_icbt"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 93.46,
      "completionScore": 83.34,
      "engagementScore": 84.74,
      "reliefScore": 72.28,
      "dropoutPenalty": 19.41,
      "confidence": 64.75,
      "therapistContribution": 86.22,
      "waitlistContribution": 63.27,
      "overall": 86.09
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 28.25,
      "completionScore": 44.3,
      "engagementScore": 52.48,
      "reliefScore": 62.6,
      "dropoutPenalty": 22.2,
      "confidence": 53.26,
      "therapistContribution": 53.09,
      "waitlistContribution": 51.87,
      "overall": 45.84
    }
  },
  {
    "id": "aw-030",
    "input": {
      "therapistSupportFidelity": 0.91,
      "moduleCompletion": 0.91,
      "engagementAdherence": 0.78,
      "symptomReliefSignal": 0.83,
      "coDesignFit": 0.86,
      "dropoutRisk": 0.28,
      "sessionSignal": 0.91,
      "overclaimRisk": 0.13,
      "careBias": "therapist_first",
      "profile": "waitlist_self_guided_baseline"
    },
    "expectedTherapist": {
      "mode": "therapist_supported_icbt",
      "supportScore": 100,
      "completionScore": 100,
      "engagementScore": 100,
      "reliefScore": 72.27,
      "dropoutPenalty": 15.52,
      "confidence": 68.95,
      "therapistContribution": 97.21,
      "waitlistContribution": 70.34,
      "overall": 96.37
    },
    "expectedWaitlist": {
      "mode": "waitlist_self_guided_baseline",
      "supportScore": 16.06,
      "completionScore": 26.71,
      "engagementScore": 52.16,
      "reliefScore": 41.75,
      "dropoutPenalty": 19.92,
      "confidence": 55.52,
      "therapistContribution": 43.35,
      "waitlistContribution": 35.86,
      "overall": 31.27
    }
  }
];
