import type { NanodomainInput, NanodomainQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: NanodomainInput;
  expectedLocalized: NanodomainQuality;
  expectedSystemic: NanodomainQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "nt-001",
    "input": {
      "nanodomainLocalization": 0.29,
      "pdePryStrength": 0.34,
      "diastolicGain": 0.25,
      "systolicPreserve": 0.34,
      "systemicSpillover": 0.45,
      "phosphorylationCoverage": 0.39,
      "assaySignal": 0.34,
      "overclaimRisk": 0.5,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 33.98,
      "diastolicScore": 30.65,
      "systolicScore": 42.98,
      "spilloverPenalty": 34.85,
      "phosphorylationScore": 27.86,
      "confidence": 15.7,
      "nanodomainContribution": 40.82,
      "systemicContribution": 27.15,
      "overall": 42.36
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 13.52,
      "diastolicScore": 27.32,
      "systolicScore": 19.85,
      "spilloverPenalty": 27.49,
      "phosphorylationScore": 37.17,
      "confidence": 16.58,
      "nanodomainContribution": 34.07,
      "systemicContribution": 28.46,
      "overall": 24.95
    }
  },
  {
    "id": "nt-002",
    "input": {
      "nanodomainLocalization": 0.33,
      "pdePryStrength": 0.38,
      "diastolicGain": 0.29,
      "systolicPreserve": 0.38,
      "systemicSpillover": 0.46,
      "phosphorylationCoverage": 0.41,
      "assaySignal": 0.38,
      "overclaimRisk": 0.51,
      "targetBias": "diastolic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 41.92,
      "diastolicScore": 40.37,
      "systolicScore": 26.96,
      "spilloverPenalty": 35.37,
      "phosphorylationScore": 28.06,
      "confidence": 18.7,
      "nanodomainContribution": 41.98,
      "systemicContribution": 28.98,
      "overall": 43.64
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 8.94,
      "diastolicScore": 23.69,
      "systolicScore": 20.7,
      "spilloverPenalty": 28.25,
      "phosphorylationScore": 26.91,
      "confidence": 18.42,
      "nanodomainContribution": 30.4,
      "systemicContribution": 20.98,
      "overall": 18.01
    }
  },
  {
    "id": "nt-003",
    "input": {
      "nanodomainLocalization": 0.37,
      "pdePryStrength": 0.42,
      "diastolicGain": 0.27,
      "systolicPreserve": 0.41,
      "systemicSpillover": 0.42,
      "phosphorylationCoverage": 0.44,
      "assaySignal": 0.42,
      "overclaimRisk": 0.46,
      "targetBias": "systemic_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 15.15,
      "diastolicScore": 18.4,
      "systolicScore": 29.27,
      "spilloverPenalty": 32.74,
      "phosphorylationScore": 28.78,
      "confidence": 22.9,
      "nanodomainContribution": 28.83,
      "systemicContribution": 24.34,
      "overall": 29.02
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 17.95,
      "diastolicScore": 33.96,
      "systolicScore": 22.13,
      "spilloverPenalty": 27.32,
      "phosphorylationScore": 51.19,
      "confidence": 21.88,
      "nanodomainContribution": 39.58,
      "systemicContribution": 38.86,
      "overall": 34.04
    }
  },
  {
    "id": "nt-004",
    "input": {
      "nanodomainLocalization": 0.33,
      "pdePryStrength": 0.38,
      "diastolicGain": 0.31,
      "systolicPreserve": 0.37,
      "systemicSpillover": 0.43,
      "phosphorylationCoverage": 0.47,
      "assaySignal": 0.38,
      "overclaimRisk": 0.46,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 38.39,
      "diastolicScore": 35.35,
      "systolicScore": 46.32,
      "spilloverPenalty": 34.69,
      "phosphorylationScore": 31.09,
      "confidence": 19.7,
      "nanodomainContribution": 44.29,
      "systemicContribution": 29.84,
      "overall": 45.69
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 16.31,
      "diastolicScore": 32.22,
      "systolicScore": 20.88,
      "spilloverPenalty": 28.77,
      "phosphorylationScore": 42.76,
      "confidence": 21.9,
      "nanodomainContribution": 36.68,
      "systemicContribution": 33.38,
      "overall": 29.37
    }
  },
  {
    "id": "nt-005",
    "input": {
      "nanodomainLocalization": 0.37,
      "pdePryStrength": 0.42,
      "diastolicGain": 0.35,
      "systolicPreserve": 0.41,
      "systemicSpillover": 0.45,
      "phosphorylationCoverage": 0.42,
      "assaySignal": 0.42,
      "overclaimRisk": 0.47,
      "targetBias": "nanodomain_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 46.95,
      "diastolicScore": 29.11,
      "systolicScore": 64.57,
      "spilloverPenalty": 34.32,
      "phosphorylationScore": 27.77,
      "confidence": 22.7,
      "nanodomainContribution": 49.56,
      "systemicContribution": 26.06,
      "overall": 49.33
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 1.08,
      "diastolicScore": 25.49,
      "systolicScore": 21.53,
      "spilloverPenalty": 27.94,
      "phosphorylationScore": 27.67,
      "confidence": 20.7,
      "nanodomainContribution": 29.57,
      "systemicContribution": 20.78,
      "overall": 17.67
    }
  },
  {
    "id": "nt-006",
    "input": {
      "nanodomainLocalization": 0.41,
      "pdePryStrength": 0.45,
      "diastolicGain": 0.32,
      "systolicPreserve": 0.45,
      "systemicSpillover": 0.4,
      "phosphorylationCoverage": 0.45,
      "assaySignal": 0.45,
      "overclaimRisk": 0.42,
      "targetBias": "balanced",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 46.95,
      "diastolicScore": 37.96,
      "systolicScore": 53.36,
      "spilloverPenalty": 31.02,
      "phosphorylationScore": 28.48,
      "confidence": 26.4,
      "nanodomainContribution": 49.94,
      "systemicContribution": 27.48,
      "overall": 49.9
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 14.59,
      "diastolicScore": 32.3,
      "systolicScore": 23.72,
      "spilloverPenalty": 26.62,
      "phosphorylationScore": 42.06,
      "confidence": 23.93,
      "nanodomainContribution": 37.21,
      "systemicContribution": 32.9,
      "overall": 28.87
    }
  },
  {
    "id": "nt-007",
    "input": {
      "nanodomainLocalization": 0.45,
      "pdePryStrength": 0.49,
      "diastolicGain": 0.36,
      "systolicPreserve": 0.48,
      "systemicSpillover": 0.42,
      "phosphorylationCoverage": 0.47,
      "assaySignal": 0.49,
      "overclaimRisk": 0.43,
      "targetBias": "diastolic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 56.27,
      "diastolicScore": 49.19,
      "systolicScore": 32.53,
      "spilloverPenalty": 32.22,
      "phosphorylationScore": 28.69,
      "confidence": 29.4,
      "nanodomainContribution": 50.66,
      "systemicContribution": 29.72,
      "overall": 50.89
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 10.01,
      "diastolicScore": 27.19,
      "systolicScore": 23.95,
      "spilloverPenalty": 27.78,
      "phosphorylationScore": 30.05,
      "confidence": 25.7,
      "nanodomainContribution": 32.68,
      "systemicContribution": 23.97,
      "overall": 20.61
    }
  },
  {
    "id": "nt-008",
    "input": {
      "nanodomainLocalization": 0.41,
      "pdePryStrength": 0.45,
      "diastolicGain": 0.4,
      "systolicPreserve": 0.44,
      "systemicSpillover": 0.43,
      "phosphorylationCoverage": 0.5,
      "assaySignal": 0.45,
      "overclaimRisk": 0.44,
      "targetBias": "systemic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 17.35,
      "diastolicScore": 23.8,
      "systolicScore": 30.6,
      "spilloverPenalty": 34.17,
      "phosphorylationScore": 31,
      "confidence": 26,
      "nanodomainContribution": 31.06,
      "systemicContribution": 26.76,
      "overall": 31.29
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 19.74,
      "diastolicScore": 43.43,
      "systolicScore": 22.71,
      "spilloverPenalty": 29.23,
      "phosphorylationScore": 56.64,
      "confidence": 25.57,
      "nanodomainContribution": 42.66,
      "systemicContribution": 44.84,
      "overall": 39.26
    }
  },
  {
    "id": "nt-009",
    "input": {
      "nanodomainLocalization": 0.46,
      "pdePryStrength": 0.49,
      "diastolicGain": 0.38,
      "systolicPreserve": 0.48,
      "systemicSpillover": 0.39,
      "phosphorylationCoverage": 0.53,
      "assaySignal": 0.49,
      "overclaimRisk": 0.38,
      "targetBias": "balanced",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 51.9,
      "diastolicScore": 42.91,
      "systolicScore": 56.48,
      "spilloverPenalty": 31.39,
      "phosphorylationScore": 31.51,
      "confidence": 30.7,
      "nanodomainContribution": 53.49,
      "systemicContribution": 30.09,
      "overall": 53.28
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 17.19,
      "diastolicScore": 37.14,
      "systolicScore": 24.55,
      "spilloverPenalty": 28.25,
      "phosphorylationScore": 47.54,
      "confidence": 29.18,
      "nanodomainContribution": 39.63,
      "systemicContribution": 37.67,
      "overall": 33.06
    }
  },
  {
    "id": "nt-010",
    "input": {
      "nanodomainLocalization": 0.5,
      "pdePryStrength": 0.53,
      "diastolicGain": 0.42,
      "systolicPreserve": 0.52,
      "systemicSpillover": 0.4,
      "phosphorylationCoverage": 0.48,
      "assaySignal": 0.53,
      "overclaimRisk": 0.39,
      "targetBias": "nanodomain_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 62.07,
      "diastolicScore": 34.73,
      "systolicScore": 78.36,
      "spilloverPenalty": 30.34,
      "phosphorylationScore": 28.19,
      "confidence": 33.7,
      "nanodomainContribution": 59.69,
      "systemicContribution": 25.82,
      "overall": 57.59
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 1.96,
      "diastolicScore": 29.04,
      "systolicScore": 25.39,
      "spilloverPenalty": 27.02,
      "phosphorylationScore": 30.71,
      "confidence": 28.05,
      "nanodomainContribution": 32.02,
      "systemicContribution": 23.74,
      "overall": 20.22
    }
  },
  {
    "id": "nt-011",
    "input": {
      "nanodomainLocalization": 0.54,
      "pdePryStrength": 0.57,
      "diastolicGain": 0.46,
      "systolicPreserve": 0.55,
      "systemicSpillover": 0.42,
      "phosphorylationCoverage": 0.51,
      "assaySignal": 0.57,
      "overclaimRisk": 0.4,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 60.15,
      "diastolicScore": 49.84,
      "systolicScore": 61.36,
      "spilloverPenalty": 31.77,
      "phosphorylationScore": 28.9,
      "confidence": 36.7,
      "nanodomainContribution": 59.01,
      "systemicContribution": 29.2,
      "overall": 57.64
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 14.76,
      "diastolicScore": 40.11,
      "systolicScore": 25.62,
      "spilloverPenalty": 28.47,
      "phosphorylationScore": 47.05,
      "confidence": 30.25,
      "nanodomainContribution": 39.81,
      "systemicContribution": 37.85,
      "overall": 32.64
    }
  },
  {
    "id": "nt-012",
    "input": {
      "nanodomainLocalization": 0.5,
      "pdePryStrength": 0.53,
      "diastolicGain": 0.44,
      "systolicPreserve": 0.51,
      "systemicSpillover": 0.37,
      "phosphorylationCoverage": 0.53,
      "assaySignal": 0.53,
      "overclaimRisk": 0.35,
      "targetBias": "diastolic_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 62.37,
      "diastolicScore": 57.09,
      "systolicScore": 35.2,
      "spilloverPenalty": 29.44,
      "phosphorylationScore": 30.71,
      "confidence": 34.5,
      "nanodomainContribution": 55.85,
      "systemicContribution": 31.8,
      "overall": 55.52
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 12.33,
      "diastolicScore": 30.98,
      "systolicScore": 25.58,
      "spilloverPenalty": 27.26,
      "phosphorylationScore": 32.49,
      "confidence": 30.96,
      "nanodomainContribution": 34.82,
      "systemicContribution": 26.89,
      "overall": 23.53
    }
  },
  {
    "id": "nt-013",
    "input": {
      "nanodomainLocalization": 0.54,
      "pdePryStrength": 0.57,
      "diastolicGain": 0.48,
      "systolicPreserve": 0.55,
      "systemicSpillover": 0.39,
      "phosphorylationCoverage": 0.56,
      "assaySignal": 0.57,
      "overclaimRisk": 0.36,
      "targetBias": "systemic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 25.7,
      "diastolicScore": 29.76,
      "systolicScore": 36.6,
      "spilloverPenalty": 30.86,
      "phosphorylationScore": 31.42,
      "confidence": 37.5,
      "nanodomainContribution": 37.27,
      "systemicContribution": 26.68,
      "overall": 36.36
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 20.63,
      "diastolicScore": 50.08,
      "systolicScore": 26.22,
      "spilloverPenalty": 28.7,
      "phosphorylationScore": 62.99,
      "confidence": 33.16,
      "nanodomainContribution": 46.24,
      "systemicContribution": 50.52,
      "overall": 44.18
    }
  },
  {
    "id": "nt-014",
    "input": {
      "nanodomainLocalization": 0.58,
      "pdePryStrength": 0.61,
      "diastolicGain": 0.52,
      "systolicPreserve": 0.58,
      "systemicSpillover": 0.4,
      "phosphorylationCoverage": 0.59,
      "assaySignal": 0.61,
      "overclaimRisk": 0.36,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 64.56,
      "diastolicScore": 54.53,
      "systolicScore": 64.7,
      "spilloverPenalty": 31.62,
      "phosphorylationScore": 32.14,
      "confidence": 40.7,
      "nanodomainContribution": 62.47,
      "systemicContribution": 31.9,
      "overall": 60.97
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 17.54,
      "diastolicScore": 45.01,
      "systolicScore": 26.65,
      "spilloverPenalty": 29.76,
      "phosphorylationScore": 52.63,
      "confidence": 35.57,
      "nanodomainContribution": 42.41,
      "systemicContribution": 42.76,
      "overall": 37.04
    }
  },
  {
    "id": "nt-015",
    "input": {
      "nanodomainLocalization": 0.62,
      "pdePryStrength": 0.65,
      "diastolicGain": 0.5,
      "systolicPreserve": 0.62,
      "systemicSpillover": 0.36,
      "phosphorylationCoverage": 0.54,
      "assaySignal": 0.65,
      "overclaimRisk": 0.31,
      "targetBias": "nanodomain_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 76.92,
      "diastolicScore": 40.44,
      "systolicScore": 91.4,
      "spilloverPenalty": 27.19,
      "phosphorylationScore": 28.82,
      "confidence": 44.9,
      "nanodomainContribution": 69.44,
      "systemicContribution": 25.94,
      "overall": 65.61
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 3.03,
      "diastolicScore": 32.79,
      "systolicScore": 28.49,
      "spilloverPenalty": 26.55,
      "phosphorylationScore": 34.05,
      "confidence": 35.64,
      "nanodomainContribution": 34.36,
      "systemicContribution": 26.91,
      "overall": 22.97
    }
  },
  {
    "id": "nt-016",
    "input": {
      "nanodomainLocalization": 0.58,
      "pdePryStrength": 0.6,
      "diastolicGain": 0.53,
      "systolicPreserve": 0.58,
      "systemicSpillover": 0.37,
      "phosphorylationCoverage": 0.57,
      "assaySignal": 0.6,
      "overclaimRisk": 0.32,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 64.61,
      "diastolicScore": 55.15,
      "systolicScore": 65.47,
      "spilloverPenalty": 29.14,
      "phosphorylationScore": 31.13,
      "confidence": 41,
      "nanodomainContribution": 63.29,
      "systemicContribution": 31,
      "overall": 61.48
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 17.27,
      "diastolicScore": 45.08,
      "systolicScore": 27.4,
      "spilloverPenalty": 28,
      "phosphorylationScore": 51.14,
      "confidence": 35.21,
      "nanodomainContribution": 42.58,
      "systemicContribution": 42.05,
      "overall": 36.77
    }
  },
  {
    "id": "nt-017",
    "input": {
      "nanodomainLocalization": 0.62,
      "pdePryStrength": 0.64,
      "diastolicGain": 0.57,
      "systolicPreserve": 0.62,
      "systemicSpillover": 0.39,
      "phosphorylationCoverage": 0.59,
      "assaySignal": 0.64,
      "overclaimRisk": 0.33,
      "targetBias": "diastolic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 75.91,
      "diastolicScore": 70.9,
      "systolicScore": 39.86,
      "spilloverPenalty": 30.34,
      "phosphorylationScore": 31.34,
      "confidence": 44,
      "nanodomainContribution": 64.73,
      "systemicContribution": 34.14,
      "overall": 63.22
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 12.68,
      "diastolicScore": 35.69,
      "systolicScore": 28.04,
      "spilloverPenalty": 29.16,
      "phosphorylationScore": 35.63,
      "confidence": 36.99,
      "nanodomainContribution": 36.58,
      "systemicContribution": 29.92,
      "overall": 25.69
    }
  },
  {
    "id": "nt-018",
    "input": {
      "nanodomainLocalization": 0.66,
      "pdePryStrength": 0.68,
      "diastolicGain": 0.55,
      "systolicPreserve": 0.65,
      "systemicSpillover": 0.34,
      "phosphorylationCoverage": 0.62,
      "assaySignal": 0.68,
      "overclaimRisk": 0.27,
      "targetBias": "systemic_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 33.52,
      "diastolicScore": 35.13,
      "systolicScore": 42.37,
      "spilloverPenalty": 27.03,
      "phosphorylationScore": 32.05,
      "confidence": 48.4,
      "nanodomainContribution": 43.2,
      "systemicContribution": 26.63,
      "overall": 41.22
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 21.82,
      "diastolicScore": 56.17,
      "systolicScore": 29.68,
      "spilloverPenalty": 27.83,
      "phosphorylationScore": 69.24,
      "confidence": 40.66,
      "nanodomainContribution": 49.82,
      "systemicContribution": 56.05,
      "overall": 49.1
    }
  },
  {
    "id": "nt-019",
    "input": {
      "nanodomainLocalization": 0.7,
      "pdePryStrength": 0.72,
      "diastolicGain": 0.59,
      "systolicPreserve": 0.69,
      "systemicSpillover": 0.36,
      "phosphorylationCoverage": 0.65,
      "assaySignal": 0.72,
      "overclaimRisk": 0.28,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 77.46,
      "diastolicScore": 61.84,
      "systolicScore": 74.86,
      "spilloverPenalty": 28.46,
      "phosphorylationScore": 32.76,
      "confidence": 51.4,
      "nanodomainContribution": 71.4,
      "systemicContribution": 32.33,
      "overall": 68.37
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 18.61,
      "diastolicScore": 49.93,
      "systolicScore": 30.32,
      "spilloverPenalty": 29.28,
      "phosphorylationScore": 57.52,
      "confidence": 42.86,
      "nanodomainContribution": 45.42,
      "systemicContribution": 47.14,
      "overall": 40.88
    }
  },
  {
    "id": "nt-020",
    "input": {
      "nanodomainLocalization": 0.66,
      "pdePryStrength": 0.68,
      "diastolicGain": 0.63,
      "systolicPreserve": 0.65,
      "systemicSpillover": 0.37,
      "phosphorylationCoverage": 0.6,
      "assaySignal": 0.68,
      "overclaimRisk": 0.29,
      "targetBias": "nanodomain_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 81.02,
      "diastolicScore": 45.84,
      "systolicScore": 94.43,
      "spilloverPenalty": 28.61,
      "phosphorylationScore": 31.04,
      "confidence": 48,
      "nanodomainContribution": 72.65,
      "systemicContribution": 28.36,
      "overall": 68.68
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 4.82,
      "diastolicScore": 37.54,
      "systolicScore": 29.08,
      "spilloverPenalty": 28.45,
      "phosphorylationScore": 36.38,
      "confidence": 39.33,
      "nanodomainContribution": 35.87,
      "systemicContribution": 29.76,
      "overall": 25.4
    }
  },
  {
    "id": "nt-021",
    "input": {
      "nanodomainLocalization": 0.7,
      "pdePryStrength": 0.72,
      "diastolicGain": 0.61,
      "systolicPreserve": 0.68,
      "systemicSpillover": 0.33,
      "phosphorylationCoverage": 0.63,
      "assaySignal": 0.72,
      "overclaimRisk": 0.24,
      "targetBias": "balanced",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 77.95,
      "diastolicScore": 63.08,
      "systolicScore": 75.3,
      "spilloverPenalty": 25.98,
      "phosphorylationScore": 31.75,
      "confidence": 52.2,
      "nanodomainContribution": 72.44,
      "systemicContribution": 31.55,
      "overall": 69.08
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 18.33,
      "diastolicScore": 50.47,
      "systolicScore": 30.51,
      "spilloverPenalty": 27.52,
      "phosphorylationScore": 56.22,
      "confidence": 42.8,
      "nanodomainContribution": 45.6,
      "systemicContribution": 46.68,
      "overall": 40.8
    }
  },
  {
    "id": "nt-022",
    "input": {
      "nanodomainLocalization": 0.74,
      "pdePryStrength": 0.76,
      "diastolicGain": 0.65,
      "systolicPreserve": 0.72,
      "systemicSpillover": 0.34,
      "phosphorylationCoverage": 0.65,
      "assaySignal": 0.76,
      "overclaimRisk": 0.25,
      "targetBias": "diastolic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 90.84,
      "diastolicScore": 80.55,
      "systolicScore": 45.67,
      "spilloverPenalty": 26.51,
      "phosphorylationScore": 31.96,
      "confidence": 55.2,
      "nanodomainContribution": 73.99,
      "systemicContribution": 34.94,
      "overall": 70.96
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 13.75,
      "diastolicScore": 39.48,
      "systolicScore": 31.35,
      "spilloverPenalty": 28.29,
      "phosphorylationScore": 38.97,
      "confidence": 44.64,
      "nanodomainContribution": 39.05,
      "systemicContribution": 33.14,
      "overall": 28.5
    }
  },
  {
    "id": "nt-023",
    "input": {
      "nanodomainLocalization": 0.79,
      "pdePryStrength": 0.8,
      "diastolicGain": 0.69,
      "systolicPreserve": 0.76,
      "systemicSpillover": 0.36,
      "phosphorylationCoverage": 0.68,
      "assaySignal": 0.8,
      "overclaimRisk": 0.25,
      "targetBias": "systemic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 41.27,
      "diastolicScore": 43.13,
      "systolicScore": 47.15,
      "spilloverPenalty": 27.79,
      "phosphorylationScore": 32.47,
      "confidence": 58.7,
      "nanodomainContribution": 48.77,
      "systemicContribution": 27.58,
      "overall": 45.96
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 21.98,
      "diastolicScore": 66.2,
      "systolicScore": 31.99,
      "spilloverPenalty": 29.69,
      "phosphorylationScore": 75.59,
      "confidence": 46.99,
      "nanodomainContribution": 53.21,
      "systemicContribution": 62.42,
      "overall": 54.15
    }
  },
  {
    "id": "nt-024",
    "input": {
      "nanodomainLocalization": 0.75,
      "pdePryStrength": 0.76,
      "diastolicGain": 0.67,
      "systolicPreserve": 0.72,
      "systemicSpillover": 0.31,
      "phosphorylationCoverage": 0.71,
      "assaySignal": 0.76,
      "overclaimRisk": 0.2,
      "targetBias": "balanced",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 82.98,
      "diastolicScore": 68.02,
      "systolicScore": 79.2,
      "spilloverPenalty": 25.68,
      "phosphorylationScore": 34.78,
      "confidence": 56.5,
      "nanodomainContribution": 76.33,
      "systemicContribution": 34.06,
      "overall": 72.72
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 20.94,
      "diastolicScore": 55.36,
      "systolicScore": 31.95,
      "spilloverPenalty": 28.76,
      "phosphorylationScore": 61.71,
      "confidence": 48.12,
      "nanodomainContribution": 48.24,
      "systemicContribution": 51.51,
      "overall": 45.09
    }
  },
  {
    "id": "nt-025",
    "input": {
      "nanodomainLocalization": 0.79,
      "pdePryStrength": 0.8,
      "diastolicGain": 0.71,
      "systolicPreserve": 0.75,
      "systemicSpillover": 0.33,
      "phosphorylationCoverage": 0.66,
      "assaySignal": 0.8,
      "overclaimRisk": 0.21,
      "targetBias": "nanodomain_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 96.56,
      "diastolicScore": 51.8,
      "systolicScore": 100,
      "spilloverPenalty": 25.31,
      "phosphorylationScore": 31.46,
      "confidence": 59.5,
      "nanodomainContribution": 80.92,
      "systemicContribution": 28.29,
      "overall": 75.45
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 5.71,
      "diastolicScore": 41.29,
      "systolicScore": 32.18,
      "spilloverPenalty": 27.93,
      "phosphorylationScore": 39.62,
      "confidence": 46.92,
      "nanodomainContribution": 38.17,
      "systemicContribution": 32.86,
      "overall": 28.03
    }
  },
  {
    "id": "nt-026",
    "input": {
      "nanodomainLocalization": 0.83,
      "pdePryStrength": 0.83,
      "diastolicGain": 0.74,
      "systolicPreserve": 0.79,
      "systemicSpillover": 0.34,
      "phosphorylationCoverage": 0.69,
      "assaySignal": 0.83,
      "overclaimRisk": 0.22,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 90.78,
      "diastolicScore": 74.33,
      "systolicScore": 83.86,
      "spilloverPenalty": 26.06,
      "phosphorylationScore": 32.18,
      "confidence": 62,
      "nanodomainContribution": 81.48,
      "systemicContribution": 33.05,
      "overall": 76.76
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 18.5,
      "diastolicScore": 57.87,
      "systolicScore": 33.17,
      "spilloverPenalty": 28.98,
      "phosphorylationScore": 61.01,
      "confidence": 48.89,
      "nanodomainContribution": 48.31,
      "systemicContribution": 51.43,
      "overall": 44.44
    }
  },
  {
    "id": "nt-027",
    "input": {
      "nanodomainLocalization": 0.87,
      "pdePryStrength": 0.87,
      "diastolicGain": 0.72,
      "systolicPreserve": 0.83,
      "systemicSpillover": 0.3,
      "phosphorylationCoverage": 0.71,
      "assaySignal": 0.87,
      "overclaimRisk": 0.17,
      "targetBias": "diastolic_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 100,
      "diastolicScore": 89.63,
      "systolicScore": 51.55,
      "spilloverPenalty": 23.21,
      "phosphorylationScore": 32.38,
      "confidence": 66.2,
      "nanodomainContribution": 81.29,
      "systemicContribution": 35.49,
      "overall": 77.05
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 14.64,
      "diastolicScore": 42.98,
      "systolicScore": 35.01,
      "spilloverPenalty": 27.76,
      "phosphorylationScore": 42,
      "confidence": 51.93,
      "nanodomainContribution": 41.37,
      "systemicContribution": 36.04,
      "overall": 30.97
    }
  },
  {
    "id": "nt-028",
    "input": {
      "nanodomainLocalization": 0.83,
      "pdePryStrength": 0.83,
      "diastolicGain": 0.76,
      "systolicPreserve": 0.79,
      "systemicSpillover": 0.31,
      "phosphorylationCoverage": 0.74,
      "assaySignal": 0.83,
      "overclaimRisk": 0.17,
      "targetBias": "systemic_first",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 44.07,
      "diastolicScore": 46.5,
      "systolicScore": 49.7,
      "spilloverPenalty": 25.16,
      "phosphorylationScore": 34.7,
      "confidence": 63,
      "nanodomainContribution": 51.64,
      "systemicContribution": 28.99,
      "overall": 48.56
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 24.49,
      "diastolicScore": 72.29,
      "systolicScore": 33.77,
      "spilloverPenalty": 29.22,
      "phosphorylationScore": 81.04,
      "confidence": 51.94,
      "nanodomainContribution": 56.47,
      "systemicContribution": 67.71,
      "overall": 59.24
    }
  },
  {
    "id": "nt-029",
    "input": {
      "nanodomainLocalization": 0.87,
      "pdePryStrength": 0.87,
      "diastolicGain": 0.8,
      "systolicPreserve": 0.82,
      "systemicSpillover": 0.33,
      "phosphorylationCoverage": 0.77,
      "assaySignal": 0.87,
      "overclaimRisk": 0.18,
      "targetBias": "balanced",
      "profile": "localized_nanodomain_target"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 95.11,
      "diastolicScore": 79.03,
      "systolicScore": 86.98,
      "spilloverPenalty": 26.58,
      "phosphorylationScore": 35.41,
      "confidence": 66,
      "nanodomainContribution": 84.75,
      "systemicContribution": 35.85,
      "overall": 79.95
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 21.29,
      "diastolicScore": 62.72,
      "systolicScore": 34,
      "spilloverPenalty": 30.66,
      "phosphorylationScore": 66.6,
      "confidence": 54.15,
      "nanodomainContribution": 50.79,
      "systemicContribution": 56.3,
      "overall": 48.79
    }
  },
  {
    "id": "nt-030",
    "input": {
      "nanodomainLocalization": 0.91,
      "pdePryStrength": 0.91,
      "diastolicGain": 0.78,
      "systolicPreserve": 0.86,
      "systemicSpillover": 0.28,
      "phosphorylationCoverage": 0.72,
      "assaySignal": 0.91,
      "overclaimRisk": 0.13,
      "targetBias": "nanodomain_first",
      "profile": "systemic_phosphorylation_baseline"
    },
    "expectedLocalized": {
      "mode": "localized_nanodomain_target",
      "localizationScore": 100,
      "diastolicScore": 57.18,
      "systolicScore": 100,
      "spilloverPenalty": 21.48,
      "phosphorylationScore": 32.09,
      "confidence": 70.2,
      "nanodomainContribution": 84.14,
      "systemicContribution": 28.24,
      "overall": 78.08
    },
    "expectedSystemic": {
      "mode": "systemic_phosphorylation_baseline",
      "localizationScore": 6.78,
      "diastolicScore": 44.84,
      "systolicScore": 36.04,
      "spilloverPenalty": 27.06,
      "phosphorylationScore": 42.76,
      "confidence": 54.27,
      "nanodomainContribution": 40.67,
      "systemicContribution": 35.9,
      "overall": 30.71
    }
  }
];
