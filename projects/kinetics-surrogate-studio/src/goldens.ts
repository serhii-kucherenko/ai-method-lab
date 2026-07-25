import type { KineticsInput, KineticsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: KineticsInput;
  expectedEntropyConstrained: KineticsQuality;
  expectedFullRateBaseline: KineticsQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ks-001",
    "input": {
      "rateCoverage": 0.29,
      "entropyFidelity": 0.25,
      "mechanismFit": 0.28,
      "rateAgreement": 0.34,
      "fullRateAccuracy": 0.39,
      "unconstrainedOptimism": 0.45,
      "stiffnessHardness": 0.59,
      "leakageRisk": 0.5,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 22.56,
      "entropyDiagnosis": 30.25,
      "mechanismReasonScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "surrogateContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 5.76,
      "entropyDiagnosis": 17.09,
      "mechanismReasonScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "surrogateContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "ks-002",
    "input": {
      "rateCoverage": 0.33,
      "entropyFidelity": 0.29,
      "mechanismFit": 0.32,
      "rateAgreement": 0.38,
      "fullRateAccuracy": 0.43,
      "unconstrainedOptimism": 0.46,
      "stiffnessHardness": 0.6,
      "leakageRisk": 0.51,
      "kineticsBias": "surrogate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 22.22,
      "entropyDiagnosis": 33.9,
      "mechanismReasonScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "surrogateContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 2.43,
      "entropyDiagnosis": 18.22,
      "mechanismReasonScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "surrogateContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "ks-003",
    "input": {
      "rateCoverage": 0.37,
      "entropyFidelity": 0.27,
      "mechanismFit": 0.36,
      "rateAgreement": 0.42,
      "fullRateAccuracy": 0.46,
      "unconstrainedOptimism": 0.42,
      "stiffnessHardness": 0.6,
      "leakageRisk": 0.46,
      "kineticsBias": "full_rate_first",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 12.18,
      "entropyDiagnosis": 23.71,
      "mechanismReasonScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "surrogateContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 12.17,
      "entropyDiagnosis": 17.1,
      "mechanismReasonScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "surrogateContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "ks-004",
    "input": {
      "rateCoverage": 0.33,
      "entropyFidelity": 0.32,
      "mechanismFit": 0.39,
      "rateAgreement": 0.38,
      "fullRateAccuracy": 0.42,
      "unconstrainedOptimism": 0.43,
      "stiffnessHardness": 0.53,
      "leakageRisk": 0.46,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 28.09,
      "entropyDiagnosis": 36.03,
      "mechanismReasonScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "surrogateContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 8.7,
      "entropyDiagnosis": 17.81,
      "mechanismReasonScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "surrogateContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "ks-005",
    "input": {
      "rateCoverage": 0.37,
      "entropyFidelity": 0.36,
      "mechanismFit": 0.35,
      "rateAgreement": 0.42,
      "fullRateAccuracy": 0.46,
      "unconstrainedOptimism": 0.45,
      "stiffnessHardness": 0.53,
      "leakageRisk": 0.47,
      "kineticsBias": "entropy_strict",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 26.86,
      "entropyDiagnosis": 39.64,
      "mechanismReasonScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "surrogateContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 0,
      "entropyDiagnosis": 19.51,
      "mechanismReasonScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "surrogateContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "ks-006",
    "input": {
      "rateCoverage": 0.41,
      "entropyFidelity": 0.34,
      "mechanismFit": 0.39,
      "rateAgreement": 0.45,
      "fullRateAccuracy": 0.5,
      "unconstrainedOptimism": 0.4,
      "stiffnessHardness": 0.54,
      "leakageRisk": 0.42,
      "kineticsBias": "balanced",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 33.94,
      "entropyDiagnosis": 39.5,
      "mechanismReasonScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "surrogateContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 11.98,
      "entropyDiagnosis": 18.04,
      "mechanismReasonScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "surrogateContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "ks-007",
    "input": {
      "rateCoverage": 0.45,
      "entropyFidelity": 0.38,
      "mechanismFit": 0.42,
      "rateAgreement": 0.49,
      "fullRateAccuracy": 0.53,
      "unconstrainedOptimism": 0.42,
      "stiffnessHardness": 0.55,
      "leakageRisk": 0.43,
      "kineticsBias": "surrogate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 31.59,
      "entropyDiagnosis": 43.11,
      "mechanismReasonScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "surrogateContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 8.27,
      "entropyDiagnosis": 19.34,
      "mechanismReasonScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "surrogateContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "ks-008",
    "input": {
      "rateCoverage": 0.41,
      "entropyFidelity": 0.43,
      "mechanismFit": 0.46,
      "rateAgreement": 0.45,
      "fullRateAccuracy": 0.49,
      "unconstrainedOptimism": 0.43,
      "stiffnessHardness": 0.47,
      "leakageRisk": 0.44,
      "kineticsBias": "full_rate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 19.33,
      "entropyDiagnosis": 35.43,
      "mechanismReasonScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "surrogateContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 16.4,
      "entropyDiagnosis": 20.18,
      "mechanismReasonScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "surrogateContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "ks-009",
    "input": {
      "rateCoverage": 0.46,
      "entropyFidelity": 0.41,
      "mechanismFit": 0.5,
      "rateAgreement": 0.49,
      "fullRateAccuracy": 0.53,
      "unconstrainedOptimism": 0.39,
      "stiffnessHardness": 0.48,
      "leakageRisk": 0.38,
      "kineticsBias": "balanced",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 40.05,
      "entropyDiagnosis": 45.49,
      "mechanismReasonScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "surrogateContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 14.91,
      "entropyDiagnosis": 19.07,
      "mechanismReasonScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "surrogateContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "ks-010",
    "input": {
      "rateCoverage": 0.5,
      "entropyFidelity": 0.45,
      "mechanismFit": 0.46,
      "rateAgreement": 0.53,
      "fullRateAccuracy": 0.57,
      "unconstrainedOptimism": 0.4,
      "stiffnessHardness": 0.49,
      "leakageRisk": 0.39,
      "kineticsBias": "entropy_strict",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 36.62,
      "entropyDiagnosis": 49.14,
      "mechanismReasonScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "surrogateContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 3.59,
      "entropyDiagnosis": 20.18,
      "mechanismReasonScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "surrogateContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "ks-011",
    "input": {
      "rateCoverage": 0.54,
      "entropyFidelity": 0.49,
      "mechanismFit": 0.49,
      "rateAgreement": 0.57,
      "fullRateAccuracy": 0.6,
      "unconstrainedOptimism": 0.42,
      "stiffnessHardness": 0.49,
      "leakageRisk": 0.4,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 47.21,
      "entropyDiagnosis": 52.75,
      "mechanismReasonScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "surrogateContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 17.1,
      "entropyDiagnosis": 21.62,
      "mechanismReasonScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "surrogateContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "ks-012",
    "input": {
      "rateCoverage": 0.5,
      "entropyFidelity": 0.48,
      "mechanismFit": 0.53,
      "rateAgreement": 0.53,
      "fullRateAccuracy": 0.56,
      "unconstrainedOptimism": 0.37,
      "stiffnessHardness": 0.42,
      "leakageRisk": 0.35,
      "kineticsBias": "surrogate_first",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 38.19,
      "entropyDiagnosis": 51.28,
      "mechanismReasonScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "surrogateContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 13.23,
      "entropyDiagnosis": 19.68,
      "mechanismReasonScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "surrogateContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "ks-013",
    "input": {
      "rateCoverage": 0.54,
      "entropyFidelity": 0.52,
      "mechanismFit": 0.56,
      "rateAgreement": 0.57,
      "fullRateAccuracy": 0.6,
      "unconstrainedOptimism": 0.39,
      "stiffnessHardness": 0.42,
      "leakageRisk": 0.36,
      "kineticsBias": "full_rate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 29.13,
      "entropyDiagnosis": 44.88,
      "mechanismReasonScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "surrogateContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 22.62,
      "entropyDiagnosis": 21.35,
      "mechanismReasonScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "surrogateContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "ks-014",
    "input": {
      "rateCoverage": 0.58,
      "entropyFidelity": 0.56,
      "mechanismFit": 0.6,
      "rateAgreement": 0.61,
      "fullRateAccuracy": 0.63,
      "unconstrainedOptimism": 0.4,
      "stiffnessHardness": 0.43,
      "leakageRisk": 0.36,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 52.62,
      "entropyDiagnosis": 58.53,
      "mechanismReasonScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "surrogateContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 20.03,
      "entropyDiagnosis": 22.2,
      "mechanismReasonScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "surrogateContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "ks-015",
    "input": {
      "rateCoverage": 0.62,
      "entropyFidelity": 0.54,
      "mechanismFit": 0.56,
      "rateAgreement": 0.65,
      "fullRateAccuracy": 0.67,
      "unconstrainedOptimism": 0.36,
      "stiffnessHardness": 0.44,
      "leakageRisk": 0.31,
      "kineticsBias": "entropy_strict",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 45.9,
      "entropyDiagnosis": 58.35,
      "mechanismReasonScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "surrogateContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 9.43,
      "entropyDiagnosis": 21.14,
      "mechanismReasonScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "surrogateContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "ks-016",
    "input": {
      "rateCoverage": 0.58,
      "entropyFidelity": 0.59,
      "mechanismFit": 0.6,
      "rateAgreement": 0.6,
      "fullRateAccuracy": 0.63,
      "unconstrainedOptimism": 0.37,
      "stiffnessHardness": 0.36,
      "leakageRisk": 0.32,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 54.46,
      "entropyDiagnosis": 60.67,
      "mechanismReasonScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "surrogateContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 22.05,
      "entropyDiagnosis": 21.91,
      "mechanismReasonScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "surrogateContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "ks-017",
    "input": {
      "rateCoverage": 0.62,
      "entropyFidelity": 0.63,
      "mechanismFit": 0.63,
      "rateAgreement": 0.64,
      "fullRateAccuracy": 0.67,
      "unconstrainedOptimism": 0.39,
      "stiffnessHardness": 0.37,
      "leakageRisk": 0.33,
      "kineticsBias": "surrogate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 48.43,
      "entropyDiagnosis": 64.28,
      "mechanismReasonScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "surrogateContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 18.73,
      "entropyDiagnosis": 23.42,
      "mechanismReasonScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "surrogateContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "ks-018",
    "input": {
      "rateCoverage": 0.66,
      "entropyFidelity": 0.61,
      "mechanismFit": 0.67,
      "rateAgreement": 0.68,
      "fullRateAccuracy": 0.7,
      "unconstrainedOptimism": 0.34,
      "stiffnessHardness": 0.38,
      "leakageRisk": 0.27,
      "kineticsBias": "full_rate_first",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 38.33,
      "entropyDiagnosis": 54.13,
      "mechanismReasonScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "surrogateContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 28.36,
      "entropyDiagnosis": 21.66,
      "mechanismReasonScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "surrogateContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "ks-019",
    "input": {
      "rateCoverage": 0.7,
      "entropyFidelity": 0.65,
      "mechanismFit": 0.7,
      "rateAgreement": 0.72,
      "fullRateAccuracy": 0.74,
      "unconstrainedOptimism": 0.36,
      "stiffnessHardness": 0.38,
      "leakageRisk": 0.28,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 63.81,
      "entropyDiagnosis": 67.74,
      "mechanismReasonScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "surrogateContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 26.25,
      "entropyDiagnosis": 23.32,
      "mechanismReasonScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "surrogateContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ks-020",
    "input": {
      "rateCoverage": 0.66,
      "entropyFidelity": 0.7,
      "mechanismFit": 0.66,
      "rateAgreement": 0.68,
      "fullRateAccuracy": 0.7,
      "unconstrainedOptimism": 0.37,
      "stiffnessHardness": 0.31,
      "leakageRisk": 0.29,
      "kineticsBias": "entropy_strict",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 52.86,
      "entropyDiagnosis": 70.06,
      "mechanismReasonScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "surrogateContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 13.66,
      "entropyDiagnosis": 23.93,
      "mechanismReasonScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "surrogateContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ks-021",
    "input": {
      "rateCoverage": 0.7,
      "entropyFidelity": 0.68,
      "mechanismFit": 0.7,
      "rateAgreement": 0.72,
      "fullRateAccuracy": 0.73,
      "unconstrainedOptimism": 0.33,
      "stiffnessHardness": 0.31,
      "leakageRisk": 0.24,
      "kineticsBias": "balanced",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 65.6,
      "entropyDiagnosis": 69.88,
      "mechanismReasonScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "surrogateContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 27.89,
      "entropyDiagnosis": 22.72,
      "mechanismReasonScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "surrogateContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ks-022",
    "input": {
      "rateCoverage": 0.74,
      "entropyFidelity": 0.72,
      "mechanismFit": 0.73,
      "rateAgreement": 0.76,
      "fullRateAccuracy": 0.77,
      "unconstrainedOptimism": 0.34,
      "stiffnessHardness": 0.32,
      "leakageRisk": 0.25,
      "kineticsBias": "surrogate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 57.62,
      "entropyDiagnosis": 73.52,
      "mechanismReasonScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "surrogateContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 24.57,
      "entropyDiagnosis": 23.79,
      "mechanismReasonScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "surrogateContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "ks-023",
    "input": {
      "rateCoverage": 0.79,
      "entropyFidelity": 0.76,
      "mechanismFit": 0.77,
      "rateAgreement": 0.8,
      "fullRateAccuracy": 0.81,
      "unconstrainedOptimism": 0.36,
      "stiffnessHardness": 0.33,
      "leakageRisk": 0.25,
      "kineticsBias": "full_rate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 49.04,
      "entropyDiagnosis": 67.38,
      "mechanismReasonScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "surrogateContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 33.86,
      "entropyDiagnosis": 25.25,
      "mechanismReasonScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "surrogateContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "ks-024",
    "input": {
      "rateCoverage": 0.75,
      "entropyFidelity": 0.75,
      "mechanismFit": 0.81,
      "rateAgreement": 0.76,
      "fullRateAccuracy": 0.77,
      "unconstrainedOptimism": 0.31,
      "stiffnessHardness": 0.25,
      "leakageRisk": 0.2,
      "kineticsBias": "balanced",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 71.55,
      "entropyDiagnosis": 75.91,
      "mechanismReasonScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "surrogateContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 31.21,
      "entropyDiagnosis": 23.36,
      "mechanismReasonScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "surrogateContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "ks-025",
    "input": {
      "rateCoverage": 0.79,
      "entropyFidelity": 0.79,
      "mechanismFit": 0.77,
      "rateAgreement": 0.8,
      "fullRateAccuracy": 0.8,
      "unconstrainedOptimism": 0.33,
      "stiffnessHardness": 0.26,
      "leakageRisk": 0.21,
      "kineticsBias": "entropy_strict",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 62.51,
      "entropyDiagnosis": 79.52,
      "mechanismReasonScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "surrogateContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 19.5,
      "entropyDiagnosis": 24.6,
      "mechanismReasonScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "surrogateContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "ks-026",
    "input": {
      "rateCoverage": 0.83,
      "entropyFidelity": 0.83,
      "mechanismFit": 0.8,
      "rateAgreement": 0.83,
      "fullRateAccuracy": 0.84,
      "unconstrainedOptimism": 0.34,
      "stiffnessHardness": 0.27,
      "leakageRisk": 0.22,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 78.52,
      "entropyDiagnosis": 83.17,
      "mechanismReasonScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "surrogateContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 33.17,
      "entropyDiagnosis": 25.67,
      "mechanismReasonScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "surrogateContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "ks-027",
    "input": {
      "rateCoverage": 0.87,
      "entropyFidelity": 0.81,
      "mechanismFit": 0.84,
      "rateAgreement": 0.87,
      "fullRateAccuracy": 0.88,
      "unconstrainedOptimism": 0.3,
      "stiffnessHardness": 0.27,
      "leakageRisk": 0.17,
      "kineticsBias": "surrogate_first",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 67.26,
      "entropyDiagnosis": 82.98,
      "mechanismReasonScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "surrogateContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 30.78,
      "entropyDiagnosis": 24.7,
      "mechanismReasonScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "surrogateContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "ks-028",
    "input": {
      "rateCoverage": 0.83,
      "entropyFidelity": 0.86,
      "mechanismFit": 0.87,
      "rateAgreement": 0.83,
      "fullRateAccuracy": 0.84,
      "unconstrainedOptimism": 0.31,
      "stiffnessHardness": 0.2,
      "leakageRisk": 0.17,
      "kineticsBias": "full_rate_first",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 54.87,
      "entropyDiagnosis": 75.3,
      "mechanismReasonScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "surrogateContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 38.81,
      "entropyDiagnosis": 25.25,
      "mechanismReasonScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "surrogateContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "ks-029",
    "input": {
      "rateCoverage": 0.87,
      "entropyFidelity": 0.9,
      "mechanismFit": 0.91,
      "rateAgreement": 0.87,
      "fullRateAccuracy": 0.87,
      "unconstrainedOptimism": 0.33,
      "stiffnessHardness": 0.2,
      "leakageRisk": 0.18,
      "kineticsBias": "balanced",
      "profile": "entropy_constrained"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 83.89,
      "entropyDiagnosis": 88.91,
      "mechanismReasonScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "surrogateContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 36.33,
      "entropyDiagnosis": 26.6,
      "mechanismReasonScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "surrogateContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "ks-030",
    "input": {
      "rateCoverage": 0.91,
      "entropyFidelity": 0.88,
      "mechanismFit": 0.87,
      "rateAgreement": 0.91,
      "fullRateAccuracy": 0.91,
      "unconstrainedOptimism": 0.28,
      "stiffnessHardness": 0.21,
      "leakageRisk": 0.13,
      "kineticsBias": "entropy_strict",
      "profile": "full_rate_baseline"
    },
    "expectedEntropyConstrained": {
      "mode": "entropy_constrained",
      "rateDiagnosis": 71.59,
      "entropyDiagnosis": 88.77,
      "mechanismReasonScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "surrogateContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedFullRateBaseline": {
      "mode": "full_rate_baseline",
      "rateDiagnosis": 25.72,
      "entropyDiagnosis": 25.06,
      "mechanismReasonScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "surrogateContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
