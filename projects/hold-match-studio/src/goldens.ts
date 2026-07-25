import type { HoldInput, HoldQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HoldInput;
  expectedExperienceAware: HoldQuality;
  expectedFirstFeasible: HoldQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "hms-001",
    "input": {
      "passengerWaitRisk": 0.54,
      "driverIdleCost": 0.51,
      "cancelBeforeAccept": 0.5,
      "cancelAfterAccept": 0.47,
      "supplyDemandStress": 0.45,
      "pickupEtaPressure": 0.49,
      "fareStrength": 0.27,
      "holdIntensity": 0.2,
      "tierBias": "hold_short",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 30.14,
      "driverScore": 24.57,
      "completionScore": 41.33,
      "cancelReductionScore": 23.37,
      "guardrailScore": 59.4,
      "funnelScore": 15.45,
      "confidence": 33.4,
      "holdContribution": 26.03,
      "feasibleContribution": 10.98,
      "overall": 34.38
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 11.52,
      "driverScore": 11.62,
      "completionScore": 14.86,
      "cancelReductionScore": 23.95,
      "guardrailScore": 71,
      "funnelScore": 25.86,
      "confidence": 31.12,
      "holdContribution": 11.57,
      "feasibleContribution": 18.9,
      "overall": 36.38
    }
  },
  {
    "id": "hms-002",
    "input": {
      "passengerWaitRisk": 0.55,
      "driverIdleCost": 0.51,
      "cancelBeforeAccept": 0.51,
      "cancelAfterAccept": 0.48,
      "supplyDemandStress": 0.45,
      "pickupEtaPressure": 0.49,
      "fareStrength": 0.31,
      "holdIntensity": 0.24,
      "tierBias": "hold_long",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 30.36,
      "driverScore": 25.59,
      "completionScore": 41.72,
      "cancelReductionScore": 23.82,
      "guardrailScore": 62.54,
      "funnelScore": 16.9,
      "confidence": 34.65,
      "holdContribution": 26.59,
      "feasibleContribution": 11.7,
      "overall": 35.26
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 11.82,
      "driverScore": 12.18,
      "completionScore": 15.38,
      "cancelReductionScore": 23,
      "guardrailScore": 67.85,
      "funnelScore": 28.17,
      "confidence": 31.42,
      "holdContribution": 12,
      "feasibleContribution": 21.7,
      "overall": 36.64
    }
  },
  {
    "id": "hms-003",
    "input": {
      "passengerWaitRisk": 0.55,
      "driverIdleCost": 0.51,
      "cancelBeforeAccept": 0.46,
      "cancelAfterAccept": 0.49,
      "supplyDemandStress": 0.41,
      "pickupEtaPressure": 0.49,
      "fareStrength": 0.35,
      "holdIntensity": 0.21,
      "tierBias": "guardrail_block",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 33.12,
      "driverScore": 27.41,
      "completionScore": 45.09,
      "cancelReductionScore": 25.87,
      "guardrailScore": 68.66,
      "funnelScore": 18.5,
      "confidence": 38.52,
      "holdContribution": 28.8,
      "feasibleContribution": 12.42,
      "overall": 38.36
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 12.3,
      "driverScore": 12.74,
      "completionScore": 17.1,
      "cancelReductionScore": 23.45,
      "guardrailScore": 70.21,
      "funnelScore": 30.9,
      "confidence": 34.16,
      "holdContribution": 12.52,
      "feasibleContribution": 24.5,
      "overall": 39.07
    }
  },
  {
    "id": "hms-004",
    "input": {
      "passengerWaitRisk": 0.48,
      "driverIdleCost": 0.51,
      "cancelBeforeAccept": 0.46,
      "cancelAfterAccept": 0.41,
      "supplyDemandStress": 0.42,
      "pickupEtaPressure": 0.49,
      "fareStrength": 0.31,
      "holdIntensity": 0.25,
      "tierBias": "balanced",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 42.72,
      "driverScore": 34.44,
      "completionScore": 46.5,
      "cancelReductionScore": 36.71,
      "guardrailScore": 63.68,
      "funnelScore": 17.95,
      "confidence": 40.75,
      "holdContribution": 37.96,
      "feasibleContribution": 11.7,
      "overall": 43.41
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 13.08,
      "driverScore": 12.18,
      "completionScore": 16.38,
      "cancelReductionScore": 23.85,
      "guardrailScore": 67.06,
      "funnelScore": 28.49,
      "confidence": 31.27,
      "holdContribution": 12.63,
      "feasibleContribution": 21.7,
      "overall": 36.71
    }
  },
  {
    "id": "hms-005",
    "input": {
      "passengerWaitRisk": 0.48,
      "driverIdleCost": 0.44,
      "cancelBeforeAccept": 0.47,
      "cancelAfterAccept": 0.42,
      "supplyDemandStress": 0.42,
      "pickupEtaPressure": 0.44,
      "fareStrength": 0.35,
      "holdIntensity": 0.28,
      "tierBias": "release_now",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 35.48,
      "driverScore": 31.84,
      "completionScore": 47.56,
      "cancelReductionScore": 29.36,
      "guardrailScore": 66.03,
      "funnelScore": 20.8,
      "confidence": 39.94,
      "holdContribution": 32.23,
      "feasibleContribution": 13.02,
      "overall": 40.65
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 13.56,
      "driverScore": 13.86,
      "completionScore": 16.9,
      "cancelReductionScore": 23.1,
      "guardrailScore": 64.7,
      "funnelScore": 32.27,
      "confidence": 32.63,
      "holdContribution": 13.71,
      "feasibleContribution": 24.5,
      "overall": 37.98
    }
  },
  {
    "id": "hms-006",
    "input": {
      "passengerWaitRisk": 0.49,
      "driverIdleCost": 0.44,
      "cancelBeforeAccept": 0.42,
      "cancelAfterAccept": 0.43,
      "supplyDemandStress": 0.38,
      "pickupEtaPressure": 0.43,
      "fareStrength": 0.39,
      "holdIntensity": 0.26,
      "tierBias": "hold_short",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 37.7,
      "driverScore": 33.81,
      "completionScore": 51.07,
      "cancelReductionScore": 31.21,
      "guardrailScore": 64.94,
      "funnelScore": 22.5,
      "confidence": 41.99,
      "holdContribution": 34.24,
      "feasibleContribution": 13.86,
      "overall": 42.65
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 13.86,
      "driverScore": 14.42,
      "completionScore": 18.62,
      "cancelReductionScore": 23.35,
      "guardrailScore": 66.28,
      "funnelScore": 35.29,
      "confidence": 35.19,
      "holdContribution": 14.14,
      "feasibleContribution": 27.3,
      "overall": 40.28
    }
  },
  {
    "id": "hms-007",
    "input": {
      "passengerWaitRisk": 0.5,
      "driverIdleCost": 0.44,
      "cancelBeforeAccept": 0.43,
      "cancelAfterAccept": 0.44,
      "supplyDemandStress": 0.39,
      "pickupEtaPressure": 0.43,
      "fareStrength": 0.43,
      "holdIntensity": 0.29,
      "tierBias": "hold_long",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 37.8,
      "driverScore": 34.63,
      "completionScore": 51.31,
      "cancelReductionScore": 31.66,
      "guardrailScore": 67.18,
      "funnelScore": 23.95,
      "confidence": 42.83,
      "holdContribution": 34.7,
      "feasibleContribution": 14.58,
      "overall": 43.29
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 14.16,
      "driverScore": 14.98,
      "completionScore": 19.14,
      "cancelReductionScore": 22.6,
      "guardrailScore": 63.91,
      "funnelScore": 37.5,
      "confidence": 35.76,
      "holdContribution": 14.57,
      "feasibleContribution": 30.1,
      "overall": 40.75
    }
  },
  {
    "id": "hms-008",
    "input": {
      "passengerWaitRisk": 0.42,
      "driverIdleCost": 0.44,
      "cancelBeforeAccept": 0.43,
      "cancelAfterAccept": 0.37,
      "supplyDemandStress": 0.39,
      "pickupEtaPressure": 0.43,
      "fareStrength": 0.39,
      "holdIntensity": 0.33,
      "tierBias": "guardrail_block",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 40.05,
      "driverScore": 34.21,
      "completionScore": 52.54,
      "cancelReductionScore": 33.77,
      "guardrailScore": 78.31,
      "funnelScore": 23.55,
      "confidence": 46.4,
      "holdContribution": 36.01,
      "feasibleContribution": 13.86,
      "overall": 45.97
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 15.12,
      "driverScore": 14.42,
      "completionScore": 18.42,
      "cancelReductionScore": 22.85,
      "guardrailScore": 60.76,
      "funnelScore": 35.19,
      "confidence": 32.92,
      "holdContribution": 14.77,
      "feasibleContribution": 27.3,
      "overall": 38.45
    }
  },
  {
    "id": "hms-009",
    "input": {
      "passengerWaitRisk": 0.43,
      "driverIdleCost": 0.45,
      "cancelBeforeAccept": 0.38,
      "cancelAfterAccept": 0.38,
      "supplyDemandStress": 0.35,
      "pickupEtaPressure": 0.43,
      "fareStrength": 0.44,
      "holdIntensity": 0.3,
      "tierBias": "balanced",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 51.42,
      "driverScore": 44.32,
      "completionScore": 56.19,
      "cancelReductionScore": 45.34,
      "guardrailScore": 68.44,
      "funnelScore": 25.4,
      "confidence": 49.47,
      "holdContribution": 47.03,
      "feasibleContribution": 14.76,
      "overall": 52.08
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 15.54,
      "driverScore": 14.96,
      "completionScore": 20.32,
      "cancelReductionScore": 23.3,
      "guardrailScore": 63.13,
      "funnelScore": 38.49,
      "confidence": 36.05,
      "holdContribution": 15.25,
      "feasibleContribution": 30.8,
      "overall": 41.2
    }
  },
  {
    "id": "hms-010",
    "input": {
      "passengerWaitRisk": 0.44,
      "driverIdleCost": 0.37,
      "cancelBeforeAccept": 0.39,
      "cancelAfterAccept": 0.38,
      "supplyDemandStress": 0.36,
      "pickupEtaPressure": 0.38,
      "fareStrength": 0.48,
      "holdIntensity": 0.34,
      "tierBias": "release_now",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 42.65,
      "driverScore": 41.17,
      "completionScore": 57.43,
      "cancelReductionScore": 37.28,
      "guardrailScore": 71.46,
      "funnelScore": 28.1,
      "confidence": 48.43,
      "holdContribution": 40.37,
      "feasibleContribution": 16.08,
      "overall": 48.88
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 15.84,
      "driverScore": 16.8,
      "completionScore": 20.84,
      "cancelReductionScore": 22.5,
      "guardrailScore": 59.97,
      "funnelScore": 42.17,
      "confidence": 37.04,
      "holdContribution": 16.32,
      "feasibleContribution": 33.6,
      "overall": 42.14
    }
  },
  {
    "id": "hms-011",
    "input": {
      "passengerWaitRisk": 0.44,
      "driverIdleCost": 0.37,
      "cancelBeforeAccept": 0.4,
      "cancelAfterAccept": 0.39,
      "supplyDemandStress": 0.36,
      "pickupEtaPressure": 0.38,
      "fareStrength": 0.52,
      "holdIntensity": 0.38,
      "tierBias": "hold_short",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 43.33,
      "driverScore": 42.19,
      "completionScore": 57.82,
      "cancelReductionScore": 37.94,
      "guardrailScore": 74.59,
      "funnelScore": 29.7,
      "confidence": 49.77,
      "holdContribution": 41.15,
      "feasibleContribution": 16.8,
      "overall": 49.9
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 16.32,
      "driverScore": 17.36,
      "completionScore": 21.36,
      "cancelReductionScore": 21.55,
      "guardrailScore": 56.83,
      "funnelScore": 44.48,
      "confidence": 37.35,
      "holdContribution": 16.84,
      "feasibleContribution": 36.4,
      "overall": 42.42
    }
  },
  {
    "id": "hms-012",
    "input": {
      "passengerWaitRisk": 0.37,
      "driverIdleCost": 0.38,
      "cancelBeforeAccept": 0.34,
      "cancelAfterAccept": 0.32,
      "supplyDemandStress": 0.32,
      "pickupEtaPressure": 0.38,
      "fareStrength": 0.48,
      "holdIntensity": 0.35,
      "tierBias": "hold_long",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 47.21,
      "driverScore": 42.11,
      "completionScore": 62.04,
      "cancelReductionScore": 41.13,
      "guardrailScore": 72.72,
      "funnelScore": 29.15,
      "confidence": 51.72,
      "holdContribution": 43.48,
      "feasibleContribution": 16.08,
      "overall": 52.18
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 17.1,
      "driverScore": 16.64,
      "completionScore": 21.84,
      "cancelReductionScore": 23.2,
      "guardrailScore": 59.19,
      "funnelScore": 42.59,
      "confidence": 36.93,
      "holdContribution": 16.87,
      "feasibleContribution": 33.6,
      "overall": 42.26
    }
  },
  {
    "id": "hms-013",
    "input": {
      "passengerWaitRisk": 0.37,
      "driverIdleCost": 0.38,
      "cancelBeforeAccept": 0.35,
      "cancelAfterAccept": 0.33,
      "supplyDemandStress": 0.33,
      "pickupEtaPressure": 0.38,
      "fareStrength": 0.52,
      "holdIntensity": 0.39,
      "tierBias": "guardrail_block",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 47.69,
      "driverScore": 42.93,
      "completionScore": 62.27,
      "cancelReductionScore": 41.79,
      "guardrailScore": 83.74,
      "funnelScore": 30.75,
      "confidence": 54.84,
      "holdContribution": 44.14,
      "feasibleContribution": 16.8,
      "overall": 54.17
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 17.58,
      "driverScore": 17.2,
      "completionScore": 22.36,
      "cancelReductionScore": 22.25,
      "guardrailScore": 56.04,
      "funnelScore": 44.79,
      "confidence": 37.19,
      "holdContribution": 17.39,
      "feasibleContribution": 36.4,
      "overall": 42.48
    }
  },
  {
    "id": "hms-014",
    "input": {
      "passengerWaitRisk": 0.38,
      "driverIdleCost": 0.38,
      "cancelBeforeAccept": 0.36,
      "cancelAfterAccept": 0.34,
      "supplyDemandStress": 0.33,
      "pickupEtaPressure": 0.38,
      "fareStrength": 0.56,
      "holdIntensity": 0.42,
      "tierBias": "balanced",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 57.54,
      "driverScore": 53.5,
      "completionScore": 62.66,
      "cancelReductionScore": 52.26,
      "guardrailScore": 78.09,
      "funnelScore": 32.2,
      "confidence": 57.29,
      "holdContribution": 54.43,
      "feasibleContribution": 17.52,
      "overall": 59.54
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 17.88,
      "driverScore": 17.76,
      "completionScore": 22.88,
      "cancelReductionScore": 21.5,
      "guardrailScore": 53.68,
      "funnelScore": 47.1,
      "confidence": 37.81,
      "holdContribution": 17.82,
      "feasibleContribution": 39.2,
      "overall": 43
    }
  },
  {
    "id": "hms-015",
    "input": {
      "passengerWaitRisk": 0.39,
      "driverIdleCost": 0.31,
      "cancelBeforeAccept": 0.31,
      "cancelAfterAccept": 0.35,
      "supplyDemandStress": 0.29,
      "pickupEtaPressure": 0.33,
      "fareStrength": 0.6,
      "holdIntensity": 0.4,
      "tierBias": "release_now",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 50.22,
      "driverScore": 49.71,
      "completionScore": 66.71,
      "cancelReductionScore": 44.79,
      "guardrailScore": 77,
      "funnelScore": 34.9,
      "confidence": 56.74,
      "holdContribution": 48.24,
      "feasibleContribution": 18.84,
      "overall": 56.84
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 18.18,
      "driverScore": 19.44,
      "completionScore": 24.6,
      "cancelReductionScore": 21.75,
      "guardrailScore": 55.25,
      "funnelScore": 51.3,
      "confidence": 40.96,
      "holdContribution": 18.81,
      "feasibleContribution": 42,
      "overall": 45.89
    }
  },
  {
    "id": "hms-016",
    "input": {
      "passengerWaitRisk": 0.31,
      "driverIdleCost": 0.31,
      "cancelBeforeAccept": 0.31,
      "cancelAfterAccept": 0.27,
      "supplyDemandStress": 0.29,
      "pickupEtaPressure": 0.32,
      "fareStrength": 0.56,
      "holdIntensity": 0.43,
      "tierBias": "hold_short",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 52.55,
      "driverScore": 49.53,
      "completionScore": 68.41,
      "cancelReductionScore": 47.13,
      "guardrailScore": 79.35,
      "funnelScore": 34.75,
      "confidence": 58.34,
      "holdContribution": 49.74,
      "feasibleContribution": 18.24,
      "overall": 58.52
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 19.14,
      "driverScore": 18.88,
      "completionScore": 23.88,
      "cancelReductionScore": 22.35,
      "guardrailScore": 52.89,
      "funnelScore": 49.29,
      "confidence": 38.59,
      "holdContribution": 19.01,
      "feasibleContribution": 39.2,
      "overall": 44
    }
  },
  {
    "id": "hms-017",
    "input": {
      "passengerWaitRisk": 0.32,
      "driverIdleCost": 0.31,
      "cancelBeforeAccept": 0.32,
      "cancelAfterAccept": 0.28,
      "supplyDemandStress": 0.3,
      "pickupEtaPressure": 0.32,
      "fareStrength": 0.6,
      "holdIntensity": 0.47,
      "tierBias": "hold_long",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 52.57,
      "driverScore": 50.35,
      "completionScore": 68.64,
      "cancelReductionScore": 47.59,
      "guardrailScore": 79.23,
      "funnelScore": 36.2,
      "confidence": 58.58,
      "holdContribution": 50.17,
      "feasibleContribution": 18.96,
      "overall": 58.81
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 19.44,
      "driverScore": 19.44,
      "completionScore": 24.4,
      "cancelReductionScore": 21.4,
      "guardrailScore": 49.74,
      "funnelScore": 51.49,
      "confidence": 38.84,
      "holdContribution": 19.44,
      "feasibleContribution": 42,
      "overall": 44.21
    }
  },
  {
    "id": "hms-018",
    "input": {
      "passengerWaitRisk": 0.33,
      "driverIdleCost": 0.31,
      "cancelBeforeAccept": 0.27,
      "cancelAfterAccept": 0.29,
      "supplyDemandStress": 0.26,
      "pickupEtaPressure": 0.32,
      "fareStrength": 0.64,
      "holdIntensity": 0.44,
      "tierBias": "guardrail_block",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 54.87,
      "driverScore": 52.18,
      "completionScore": 72.01,
      "cancelReductionScore": 49.43,
      "guardrailScore": 88.5,
      "funnelScore": 37.65,
      "confidence": 63.15,
      "holdContribution": 52.16,
      "feasibleContribution": 19.68,
      "overall": 62.22
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 19.74,
      "driverScore": 20,
      "completionScore": 26.12,
      "cancelReductionScore": 21.85,
      "guardrailScore": 52.1,
      "funnelScore": 54.22,
      "confidence": 41.58,
      "holdContribution": 19.87,
      "feasibleContribution": 44.8,
      "overall": 46.63
    }
  },
  {
    "id": "hms-019",
    "input": {
      "passengerWaitRisk": 0.33,
      "driverIdleCost": 0.31,
      "cancelBeforeAccept": 0.28,
      "cancelAfterAccept": 0.3,
      "supplyDemandStress": 0.26,
      "pickupEtaPressure": 0.32,
      "fareStrength": 0.68,
      "holdIntensity": 0.48,
      "tierBias": "balanced",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 65.87,
      "driverScore": 63.82,
      "completionScore": 72.41,
      "cancelReductionScore": 61.02,
      "guardrailScore": 78.93,
      "funnelScore": 39.25,
      "confidence": 65.03,
      "holdContribution": 63.57,
      "feasibleContribution": 20.4,
      "overall": 67.7
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 20.22,
      "driverScore": 20.56,
      "completionScore": 26.64,
      "cancelReductionScore": 20.9,
      "guardrailScore": 48.95,
      "funnelScore": 56.53,
      "confidence": 41.88,
      "holdContribution": 20.39,
      "feasibleContribution": 47.6,
      "overall": 46.9
    }
  },
  {
    "id": "hms-020",
    "input": {
      "passengerWaitRisk": 0.26,
      "driverIdleCost": 0.24,
      "cancelBeforeAccept": 0.28,
      "cancelAfterAccept": 0.23,
      "supplyDemandStress": 0.27,
      "pickupEtaPressure": 0.27,
      "fareStrength": 0.64,
      "holdIntensity": 0.51,
      "tierBias": "release_now",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 57.22,
      "driverScore": 56.51,
      "completionScore": 74.15,
      "cancelReductionScore": 52.7,
      "guardrailScore": 76.46,
      "funnelScore": 39.95,
      "confidence": 62.07,
      "holdContribution": 55.48,
      "feasibleContribution": 20.28,
      "overall": 63.04
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 21,
      "driverScore": 21.12,
      "completionScore": 25.92,
      "cancelReductionScore": 21.35,
      "guardrailScore": 46.59,
      "funnelScore": 55.59,
      "confidence": 40.04,
      "holdContribution": 21.06,
      "feasibleContribution": 44.8,
      "overall": 45.53
    }
  },
  {
    "id": "hms-021",
    "input": {
      "passengerWaitRisk": 0.26,
      "driverIdleCost": 0.24,
      "cancelBeforeAccept": 0.23,
      "cancelAfterAccept": 0.24,
      "supplyDemandStress": 0.23,
      "pickupEtaPressure": 0.27,
      "fareStrength": 0.68,
      "holdIntensity": 0.49,
      "tierBias": "hold_short",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 59.91,
      "driverScore": 58.34,
      "completionScore": 77.52,
      "cancelReductionScore": 54.74,
      "guardrailScore": 78.5,
      "funnelScore": 41.55,
      "confidence": 64.92,
      "holdContribution": 57.66,
      "feasibleContribution": 21,
      "overall": 65.55
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 21.48,
      "driverScore": 21.68,
      "completionScore": 27.64,
      "cancelReductionScore": 21.6,
      "guardrailScore": 48.16,
      "funnelScore": 58.32,
      "confidence": 42.46,
      "holdContribution": 21.58,
      "feasibleContribution": 47.6,
      "overall": 47.7
    }
  },
  {
    "id": "hms-022",
    "input": {
      "passengerWaitRisk": 0.27,
      "driverIdleCost": 0.24,
      "cancelBeforeAccept": 0.24,
      "cancelAfterAccept": 0.24,
      "supplyDemandStress": 0.23,
      "pickupEtaPressure": 0.27,
      "fareStrength": 0.72,
      "holdIntensity": 0.53,
      "tierBias": "hold_long",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 60.13,
      "driverScore": 59.46,
      "completionScore": 78.25,
      "cancelReductionScore": 55.43,
      "guardrailScore": 75.37,
      "funnelScore": 43,
      "confidence": 64.74,
      "holdContribution": 58.34,
      "feasibleContribution": 21.72,
      "overall": 65.71
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 21.78,
      "driverScore": 22.24,
      "completionScore": 28.16,
      "cancelReductionScore": 20.8,
      "guardrailScore": 45.01,
      "funnelScore": 60.63,
      "confidence": 42.77,
      "holdContribution": 22.01,
      "feasibleContribution": 50.4,
      "overall": 47.96
    }
  },
  {
    "id": "hms-023",
    "input": {
      "passengerWaitRisk": 0.28,
      "driverIdleCost": 0.25,
      "cancelBeforeAccept": 0.25,
      "cancelAfterAccept": 0.25,
      "supplyDemandStress": 0.24,
      "pickupEtaPressure": 0.27,
      "fareStrength": 0.77,
      "holdIntensity": 0.56,
      "tierBias": "guardrail_block",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 60.51,
      "driverScore": 60.09,
      "completionScore": 78.77,
      "cancelReductionScore": 56.07,
      "guardrailScore": 80.9,
      "funnelScore": 44.85,
      "confidence": 66.55,
      "holdContribution": 58.89,
      "feasibleContribution": 22.62,
      "overall": 66.95
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 22.2,
      "driverScore": 22.78,
      "completionScore": 28.86,
      "cancelReductionScore": 20.05,
      "guardrailScore": 42.65,
      "funnelScore": 63.41,
      "confidence": 43.73,
      "holdContribution": 22.49,
      "feasibleContribution": 53.9,
      "overall": 48.77
    }
  },
  {
    "id": "hms-024",
    "input": {
      "passengerWaitRisk": 0.2,
      "driverIdleCost": 0.25,
      "cancelBeforeAccept": 0.19,
      "cancelAfterAccept": 0.18,
      "supplyDemandStress": 0.2,
      "pickupEtaPressure": 0.27,
      "fareStrength": 0.73,
      "holdIntensity": 0.54,
      "tierBias": "balanced",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 77.09,
      "driverScore": 72.03,
      "completionScore": 82.98,
      "cancelReductionScore": 72.11,
      "guardrailScore": 74.94,
      "funnelScore": 44.45,
      "confidence": 71.88,
      "holdContribution": 73.74,
      "feasibleContribution": 21.9,
      "overall": 76.02
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 23.16,
      "driverScore": 22.22,
      "completionScore": 29.34,
      "cancelReductionScore": 21.5,
      "guardrailScore": 44.23,
      "funnelScore": 61.52,
      "confidence": 43,
      "holdContribution": 22.69,
      "feasibleContribution": 51.1,
      "overall": 48.36
    }
  },
  {
    "id": "hms-025",
    "input": {
      "passengerWaitRisk": 0.21,
      "driverIdleCost": 0.18,
      "cancelBeforeAccept": 0.2,
      "cancelAfterAccept": 0.19,
      "supplyDemandStress": 0.2,
      "pickupEtaPressure": 0.22,
      "fareStrength": 0.77,
      "holdIntensity": 0.57,
      "tierBias": "release_now",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 65.07,
      "driverScore": 65.43,
      "completionScore": 84.04,
      "cancelReductionScore": 60.72,
      "guardrailScore": 72.59,
      "funnelScore": 47.15,
      "confidence": 68.38,
      "holdContribution": 63.74,
      "feasibleContribution": 23.22,
      "overall": 70.07
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 23.46,
      "driverScore": 23.9,
      "completionScore": 29.86,
      "cancelReductionScore": 20.75,
      "guardrailScore": 41.86,
      "funnelScore": 65.3,
      "confidence": 44.36,
      "holdContribution": 23.68,
      "feasibleContribution": 53.9,
      "overall": 49.62
    }
  },
  {
    "id": "hms-026",
    "input": {
      "passengerWaitRisk": 0.22,
      "driverIdleCost": 0.18,
      "cancelBeforeAccept": 0.21,
      "cancelAfterAccept": 0.2,
      "supplyDemandStress": 0.21,
      "pickupEtaPressure": 0.21,
      "fareStrength": 0.81,
      "holdIntensity": 0.61,
      "tierBias": "hold_short",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 65.08,
      "driverScore": 66.39,
      "completionScore": 84.41,
      "cancelReductionScore": 61.17,
      "guardrailScore": 69.34,
      "funnelScore": 48.85,
      "confidence": 67.92,
      "holdContribution": 64.21,
      "feasibleContribution": 24.06,
      "overall": 69.99
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 23.76,
      "driverScore": 24.46,
      "completionScore": 30.38,
      "cancelReductionScore": 19.8,
      "guardrailScore": 38.71,
      "funnelScore": 67.8,
      "confidence": 44.76,
      "holdContribution": 24.11,
      "feasibleContribution": 56.7,
      "overall": 49.98
    }
  },
  {
    "id": "hms-027",
    "input": {
      "passengerWaitRisk": 0.22,
      "driverIdleCost": 0.18,
      "cancelBeforeAccept": 0.16,
      "cancelAfterAccept": 0.21,
      "supplyDemandStress": 0.17,
      "pickupEtaPressure": 0.21,
      "fareStrength": 0.85,
      "holdIntensity": 0.58,
      "tierBias": "hold_long",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 67.85,
      "driverScore": 68.22,
      "completionScore": 87.78,
      "cancelReductionScore": 63.22,
      "guardrailScore": 72.17,
      "funnelScore": 50.45,
      "confidence": 70.97,
      "holdContribution": 66.43,
      "feasibleContribution": 24.78,
      "overall": 72.63
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 24.24,
      "driverScore": 25.02,
      "completionScore": 32.1,
      "cancelReductionScore": 20.25,
      "guardrailScore": 41.08,
      "funnelScore": 70.53,
      "confidence": 47.5,
      "holdContribution": 24.63,
      "feasibleContribution": 59.5,
      "overall": 52.4
    }
  },
  {
    "id": "hms-028",
    "input": {
      "passengerWaitRisk": 0.15,
      "driverIdleCost": 0.18,
      "cancelBeforeAccept": 0.16,
      "cancelAfterAccept": 0.13,
      "supplyDemandStress": 0.17,
      "pickupEtaPressure": 0.21,
      "fareStrength": 0.81,
      "holdIntensity": 0.62,
      "tierBias": "guardrail_block",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 69.64,
      "driverScore": 67.9,
      "completionScore": 89.35,
      "cancelReductionScore": 65.36,
      "guardrailScore": 77.03,
      "funnelScore": 49.9,
      "confidence": 73.02,
      "holdContribution": 67.63,
      "feasibleContribution": 24.06,
      "overall": 74.44
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 25.02,
      "driverScore": 24.46,
      "completionScore": 31.38,
      "cancelReductionScore": 20.65,
      "guardrailScore": 37.92,
      "funnelScore": 68.22,
      "confidence": 44.66,
      "holdContribution": 24.74,
      "feasibleContribution": 56.7,
      "overall": 50.09
    }
  },
  {
    "id": "hms-029",
    "input": {
      "passengerWaitRisk": 0.15,
      "driverIdleCost": 0.18,
      "cancelBeforeAccept": 0.17,
      "cancelAfterAccept": 0.14,
      "supplyDemandStress": 0.18,
      "pickupEtaPressure": 0.21,
      "fareStrength": 0.85,
      "holdIntensity": 0.65,
      "tierBias": "balanced",
      "profile": "experience_aware"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 83.29,
      "driverScore": 81.34,
      "completionScore": 89.59,
      "cancelReductionScore": 79.03,
      "guardrailScore": 66.56,
      "funnelScore": 51.5,
      "confidence": 75.29,
      "holdContribution": 81.22,
      "feasibleContribution": 24.78,
      "overall": 81.04
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 25.5,
      "driverScore": 25.02,
      "completionScore": 31.9,
      "cancelReductionScore": 19.9,
      "guardrailScore": 35.56,
      "funnelScore": 70.42,
      "confidence": 45.22,
      "holdContribution": 25.26,
      "feasibleContribution": 59.5,
      "overall": 50.57
    }
  },
  {
    "id": "hms-030",
    "input": {
      "passengerWaitRisk": 0.16,
      "driverIdleCost": 0.11,
      "cancelBeforeAccept": 0.12,
      "cancelAfterAccept": 0.15,
      "supplyDemandStress": 0.14,
      "pickupEtaPressure": 0.16,
      "fareStrength": 0.89,
      "holdIntensity": 0.63,
      "tierBias": "release_now",
      "profile": "first_feasible"
    },
    "expectedExperienceAware": {
      "mode": "experience_aware",
      "passengerScore": 72.43,
      "driverScore": 74.48,
      "completionScore": 93.63,
      "cancelReductionScore": 68.56,
      "guardrailScore": 68.61,
      "funnelScore": 54.2,
      "confidence": 74.4,
      "holdContribution": 71.82,
      "feasibleContribution": 26.1,
      "overall": 76.89
    },
    "expectedFirstFeasible": {
      "mode": "first_feasible",
      "passengerScore": 25.8,
      "driverScore": 26.7,
      "completionScore": 33.62,
      "cancelReductionScore": 20.15,
      "guardrailScore": 37.14,
      "funnelScore": 74.62,
      "confidence": 48.38,
      "holdContribution": 26.25,
      "feasibleContribution": 62.3,
      "overall": 53.46
    }
  }
];
