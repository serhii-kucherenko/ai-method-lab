import type { OrganoidInput, OrganoidQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OrganoidInput;
  expectedHlo: OrganoidQuality;
  expectedHlc: OrganoidQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "lo-001",
    "input": {
      "multicellularComplexity": 0.29,
      "hepatocyteLikeFidelity": 0.34,
      "stellatePresence": 0.25,
      "cholangiocyteMix": 0.19,
      "lipidAccumulation": 0.45,
      "inflammationCue": 0.34,
      "differentiationDay": 0.34,
      "overclaimRisk": 0.5,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 28.07,
      "hepatocyteScore": 37.44,
      "lineageScore": 28.3,
      "masldScore": 38.46,
      "baselineScore": 30.79,
      "confidence": 15.7,
      "hloContribution": 32.31,
      "hlcContribution": 33.67,
      "overall": 36.55
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 12.35,
      "hepatocyteScore": 33.57,
      "lineageScore": 32.87,
      "masldScore": 21.51,
      "baselineScore": 34.33,
      "confidence": 14,
      "hloContribution": 26.93,
      "hlcContribution": 31.48,
      "overall": 25.98
    }
  },
  {
    "id": "lo-002",
    "input": {
      "multicellularComplexity": 0.33,
      "hepatocyteLikeFidelity": 0.38,
      "stellatePresence": 0.29,
      "cholangiocyteMix": 0.23,
      "lipidAccumulation": 0.47,
      "inflammationCue": 0.36,
      "differentiationDay": 0.38,
      "overclaimRisk": 0.51,
      "lineageBias": "lipid_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 35,
      "hepatocyteScore": 40.91,
      "lineageScore": 19.5,
      "masldScore": 47.82,
      "baselineScore": 32.03,
      "confidence": 18.7,
      "hloContribution": 34.8,
      "hlcContribution": 34.78,
      "overall": 38.8
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 8.52,
      "hepatocyteScore": 26.09,
      "lineageScore": 33.29,
      "masldScore": 22.93,
      "baselineScore": 26.24,
      "confidence": 16.65,
      "hloContribution": 23.41,
      "hlcContribution": 24.73,
      "overall": 19.64
    }
  },
  {
    "id": "lo-003",
    "input": {
      "multicellularComplexity": 0.37,
      "hepatocyteLikeFidelity": 0.42,
      "stellatePresence": 0.27,
      "cholangiocyteMix": 0.26,
      "lipidAccumulation": 0.42,
      "inflammationCue": 0.39,
      "differentiationDay": 0.42,
      "overclaimRisk": 0.46,
      "lineageBias": "hlc_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 10.49,
      "hepatocyteScore": 36.37,
      "lineageScore": 20.64,
      "masldScore": 21.43,
      "baselineScore": 33.27,
      "confidence": 22.9,
      "hloContribution": 20.62,
      "hlcContribution": 34.77,
      "overall": 24.17
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 19,
      "hepatocyteScore": 49.5,
      "lineageScore": 34.8,
      "masldScore": 21.82,
      "baselineScore": 50.44,
      "confidence": 20.54,
      "hloContribution": 35.11,
      "hlcContribution": 45.37,
      "overall": 38.73
    }
  },
  {
    "id": "lo-004",
    "input": {
      "multicellularComplexity": 0.33,
      "hepatocyteLikeFidelity": 0.38,
      "stellatePresence": 0.31,
      "cholangiocyteMix": 0.22,
      "lipidAccumulation": 0.44,
      "inflammationCue": 0.42,
      "differentiationDay": 0.38,
      "overclaimRisk": 0.46,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 32.35,
      "hepatocyteScore": 40.91,
      "lineageScore": 33.1,
      "masldScore": 40.5,
      "baselineScore": 32.03,
      "confidence": 19.7,
      "hloContribution": 36.06,
      "hlcContribution": 34.5,
      "overall": 39.78
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 13.26,
      "hepatocyteScore": 36.72,
      "lineageScore": 33.19,
      "masldScore": 21.6,
      "baselineScore": 37.12,
      "confidence": 17.29,
      "hloContribution": 28.38,
      "hlcContribution": 33.82,
      "overall": 28
    }
  },
  {
    "id": "lo-005",
    "input": {
      "multicellularComplexity": 0.37,
      "hepatocyteLikeFidelity": 0.42,
      "stellatePresence": 0.35,
      "cholangiocyteMix": 0.26,
      "lipidAccumulation": 0.46,
      "inflammationCue": 0.37,
      "differentiationDay": 0.42,
      "overclaimRisk": 0.47,
      "lineageBias": "hlo_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 40.07,
      "hepatocyteScore": 44.37,
      "lineageScore": 48.54,
      "masldScore": 31.79,
      "baselineScore": 33.27,
      "confidence": 22.7,
      "hloContribution": 41.23,
      "hlcContribution": 35.86,
      "overall": 44.26
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 1.44,
      "hepatocyteScore": 28.35,
      "lineageScore": 33.6,
      "masldScore": 23.33,
      "baselineScore": 27.87,
      "confidence": 20.26,
      "hloContribution": 22.92,
      "hlcContribution": 26.36,
      "overall": 20.68
    }
  },
  {
    "id": "lo-006",
    "input": {
      "multicellularComplexity": 0.41,
      "hepatocyteLikeFidelity": 0.45,
      "stellatePresence": 0.32,
      "cholangiocyteMix": 0.3,
      "lipidAccumulation": 0.41,
      "inflammationCue": 0.4,
      "differentiationDay": 0.45,
      "overclaimRisk": 0.42,
      "lineageBias": "balanced",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 39.31,
      "hepatocyteScore": 46.97,
      "lineageScore": 38.74,
      "masldScore": 40.51,
      "baselineScore": 33.95,
      "confidence": 26.4,
      "hloContribution": 40.82,
      "hlcContribution": 37.37,
      "overall": 44.2
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 16.21,
      "hepatocyteScore": 42.84,
      "lineageScore": 34.61,
      "masldScore": 21.97,
      "baselineScore": 42.96,
      "confidence": 23.4,
      "hloContribution": 31.72,
      "hlcContribution": 39.24,
      "overall": 33.15
    }
  },
  {
    "id": "lo-007",
    "input": {
      "multicellularComplexity": 0.45,
      "hepatocyteLikeFidelity": 0.49,
      "stellatePresence": 0.36,
      "cholangiocyteMix": 0.33,
      "lipidAccumulation": 0.43,
      "inflammationCue": 0.42,
      "differentiationDay": 0.49,
      "overclaimRisk": 0.43,
      "lineageBias": "lipid_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 47.31,
      "hepatocyteScore": 50.43,
      "lineageScore": 25.35,
      "masldScore": 49.25,
      "baselineScore": 35.19,
      "confidence": 29.4,
      "hloContribution": 42.19,
      "hlcContribution": 38.48,
      "overall": 45.52
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 12.38,
      "hepatocyteScore": 32.26,
      "lineageScore": 35.23,
      "masldScore": 23.39,
      "baselineScore": 31.66,
      "confidence": 26.05,
      "hloContribution": 26.98,
      "hlcContribution": 29.82,
      "overall": 24.46
    }
  },
  {
    "id": "lo-008",
    "input": {
      "multicellularComplexity": 0.41,
      "hepatocyteLikeFidelity": 0.45,
      "stellatePresence": 0.4,
      "cholangiocyteMix": 0.29,
      "lipidAccumulation": 0.45,
      "inflammationCue": 0.45,
      "differentiationDay": 0.45,
      "overclaimRisk": 0.44,
      "lineageBias": "hlc_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 13.81,
      "hepatocyteScore": 38.97,
      "lineageScore": 24.78,
      "masldScore": 24.04,
      "baselineScore": 33.95,
      "confidence": 26,
      "hloContribution": 23.87,
      "hlcContribution": 34.21,
      "overall": 26.73
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 18.03,
      "hepatocyteScore": 52.35,
      "lineageScore": 33.61,
      "masldScore": 23.17,
      "baselineScore": 52.37,
      "confidence": 22.65,
      "hloContribution": 35.91,
      "hlcContribution": 46.85,
      "overall": 39.4
    }
  },
  {
    "id": "lo-009",
    "input": {
      "multicellularComplexity": 0.46,
      "hepatocyteLikeFidelity": 0.49,
      "stellatePresence": 0.38,
      "cholangiocyteMix": 0.33,
      "lipidAccumulation": 0.4,
      "inflammationCue": 0.48,
      "differentiationDay": 0.49,
      "overclaimRisk": 0.38,
      "lineageBias": "balanced",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 44.21,
      "hepatocyteScore": 50.43,
      "lineageScore": 43.82,
      "masldScore": 42.76,
      "baselineScore": 34.94,
      "confidence": 30.7,
      "hloContribution": 44.87,
      "hlcContribution": 38.03,
      "overall": 47.64
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 17.12,
      "hepatocyteScore": 45.99,
      "lineageScore": 34.93,
      "masldScore": 22.01,
      "baselineScore": 45.75,
      "confidence": 26.69,
      "hloContribution": 33.16,
      "hlcContribution": 41.58,
      "overall": 35.17
    }
  },
  {
    "id": "lo-010",
    "input": {
      "multicellularComplexity": 0.5,
      "hepatocyteLikeFidelity": 0.53,
      "stellatePresence": 0.42,
      "cholangiocyteMix": 0.37,
      "lipidAccumulation": 0.42,
      "inflammationCue": 0.43,
      "differentiationDay": 0.53,
      "overclaimRisk": 0.39,
      "lineageBias": "hlo_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 53.25,
      "hepatocyteScore": 53.9,
      "lineageScore": 62.79,
      "masldScore": 34.85,
      "baselineScore": 36.18,
      "confidence": 33.7,
      "hloContribution": 51.62,
      "hlcContribution": 39.4,
      "overall": 53.42
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 5.29,
      "hepatocyteScore": 34.52,
      "lineageScore": 35.34,
      "masldScore": 23.74,
      "baselineScore": 33.29,
      "confidence": 29.65,
      "hloContribution": 26.44,
      "hlcContribution": 31.42,
      "overall": 25.46
    }
  },
  {
    "id": "lo-011",
    "input": {
      "multicellularComplexity": 0.54,
      "hepatocyteLikeFidelity": 0.57,
      "stellatePresence": 0.46,
      "cholangiocyteMix": 0.4,
      "lipidAccumulation": 0.44,
      "inflammationCue": 0.46,
      "differentiationDay": 0.57,
      "overclaimRisk": 0.4,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 51.86,
      "hepatocyteScore": 57.36,
      "lineageScore": 51.39,
      "masldScore": 45.52,
      "baselineScore": 37.42,
      "confidence": 36.7,
      "hloContribution": 51.2,
      "hlcContribution": 40.47,
      "overall": 53.27
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 18.47,
      "hepatocyteScore": 52.65,
      "lineageScore": 35.96,
      "masldScore": 25.12,
      "baselineScore": 51.74,
      "confidence": 32.26,
      "hloContribution": 36.79,
      "hlcContribution": 46.95,
      "overall": 39.55
    }
  },
  {
    "id": "lo-012",
    "input": {
      "multicellularComplexity": 0.5,
      "hepatocyteLikeFidelity": 0.53,
      "stellatePresence": 0.44,
      "cholangiocyteMix": 0.36,
      "lipidAccumulation": 0.39,
      "inflammationCue": 0.48,
      "differentiationDay": 0.53,
      "overclaimRisk": 0.35,
      "lineageBias": "lipid_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 53.75,
      "hepatocyteScore": 53.9,
      "lineageScore": 29.04,
      "masldScore": 49.28,
      "baselineScore": 36.18,
      "confidence": 34.5,
      "hloContribution": 45.79,
      "hlcContribution": 39.15,
      "overall": 48.59
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 13.41,
      "hepatocyteScore": 34.48,
      "lineageScore": 35.24,
      "masldScore": 22.45,
      "baselineScore": 33.09,
      "confidence": 30.2,
      "hloContribution": 27.73,
      "hlcContribution": 31.25,
      "overall": 25.74
    }
  },
  {
    "id": "lo-013",
    "input": {
      "multicellularComplexity": 0.54,
      "hepatocyteLikeFidelity": 0.57,
      "stellatePresence": 0.48,
      "cholangiocyteMix": 0.4,
      "lipidAccumulation": 0.41,
      "inflammationCue": 0.51,
      "differentiationDay": 0.57,
      "overclaimRisk": 0.36,
      "lineageBias": "hlc_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 21.06,
      "hepatocyteScore": 49.36,
      "lineageScore": 31.18,
      "masldScore": 27.1,
      "baselineScore": 37.42,
      "confidence": 37.5,
      "hloContribution": 30.44,
      "hlcContribution": 38.22,
      "overall": 32.84
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 22.09,
      "hepatocyteScore": 65.1,
      "lineageScore": 35.66,
      "masldScore": 23.83,
      "baselineScore": 64.46,
      "confidence": 32.8,
      "hloContribution": 42.23,
      "hlcContribution": 57.6,
      "overall": 49.18
    }
  },
  {
    "id": "lo-014",
    "input": {
      "multicellularComplexity": 0.58,
      "hepatocyteLikeFidelity": 0.61,
      "stellatePresence": 0.52,
      "cholangiocyteMix": 0.43,
      "lipidAccumulation": 0.43,
      "inflammationCue": 0.54,
      "differentiationDay": 0.61,
      "overclaimRisk": 0.36,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 56.14,
      "hepatocyteScore": 60.83,
      "lineageScore": 56.19,
      "masldScore": 47.57,
      "baselineScore": 38.66,
      "confidence": 40.7,
      "hloContribution": 54.94,
      "hlcContribution": 41.3,
      "overall": 56.48
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 19.38,
      "hepatocyteScore": 55.79,
      "lineageScore": 36.27,
      "masldScore": 25.2,
      "baselineScore": 54.53,
      "confidence": 35.56,
      "hloContribution": 38.23,
      "hlcContribution": 49.29,
      "overall": 41.58
    }
  },
  {
    "id": "lo-015",
    "input": {
      "multicellularComplexity": 0.62,
      "hepatocyteLikeFidelity": 0.65,
      "stellatePresence": 0.5,
      "cholangiocyteMix": 0.47,
      "lipidAccumulation": 0.38,
      "inflammationCue": 0.49,
      "differentiationDay": 0.65,
      "overclaimRisk": 0.31,
      "lineageBias": "hlo_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 65.81,
      "hepatocyteScore": 64.29,
      "lineageScore": 76.74,
      "masldScore": 37.72,
      "baselineScore": 39.9,
      "confidence": 44.9,
      "hloContribution": 61.86,
      "hlcContribution": 43.57,
      "overall": 62.57
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 9.35,
      "hepatocyteScore": 41.26,
      "lineageScore": 37.58,
      "masldScore": 24.45,
      "baselineScore": 39.17,
      "confidence": 39.81,
      "hloContribution": 30.36,
      "hlcContribution": 36.98,
      "overall": 30.66
    }
  },
  {
    "id": "lo-016",
    "input": {
      "multicellularComplexity": 0.58,
      "hepatocyteLikeFidelity": 0.6,
      "stellatePresence": 0.53,
      "cholangiocyteMix": 0.43,
      "lipidAccumulation": 0.4,
      "inflammationCue": 0.52,
      "differentiationDay": 0.6,
      "overclaimRisk": 0.32,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 56.84,
      "hepatocyteScore": 59.96,
      "lineageScore": 56.9,
      "masldScore": 45.98,
      "baselineScore": 38.1,
      "confidence": 41,
      "hloContribution": 54.81,
      "hlcContribution": 40.82,
      "overall": 56.29
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 19.3,
      "hepatocyteScore": 55.15,
      "lineageScore": 35.67,
      "masldScore": 23.98,
      "baselineScore": 53.58,
      "confidence": 35.66,
      "hloContribution": 37.54,
      "hlcContribution": 48.64,
      "overall": 41.1
    }
  },
  {
    "id": "lo-017",
    "input": {
      "multicellularComplexity": 0.62,
      "hepatocyteLikeFidelity": 0.64,
      "stellatePresence": 0.57,
      "cholangiocyteMix": 0.47,
      "lipidAccumulation": 0.41,
      "inflammationCue": 0.54,
      "differentiationDay": 0.64,
      "overclaimRisk": 0.33,
      "lineageBias": "lipid_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 67.06,
      "hepatocyteScore": 63.42,
      "lineageScore": 35.88,
      "masldScore": 54.01,
      "baselineScore": 39.34,
      "confidence": 44,
      "hloContribution": 54.54,
      "hlcContribution": 41.98,
      "overall": 56.28
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 15.47,
      "hepatocyteScore": 40.38,
      "lineageScore": 36.08,
      "masldScore": 25.04,
      "baselineScore": 37.91,
      "confidence": 38.36,
      "hloContribution": 30.98,
      "hlcContribution": 35.57,
      "overall": 29.16
    }
  },
  {
    "id": "lo-018",
    "input": {
      "multicellularComplexity": 0.66,
      "hepatocyteLikeFidelity": 0.68,
      "stellatePresence": 0.55,
      "cholangiocyteMix": 0.5,
      "lipidAccumulation": 0.37,
      "inflammationCue": 0.57,
      "differentiationDay": 0.68,
      "overclaimRisk": 0.27,
      "lineageBias": "hlc_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 27.78,
      "hepatocyteScore": 58.89,
      "lineageScore": 37.1,
      "masldScore": 29.97,
      "baselineScore": 40.58,
      "confidence": 48.4,
      "hloContribution": 36.52,
      "hlcContribution": 41.92,
      "overall": 38.49
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 26.06,
      "hepatocyteScore": 76.78,
      "lineageScore": 37.59,
      "masldScore": 24.28,
      "baselineScore": 75.59,
      "confidence": 42.35,
      "hloContribution": 48.06,
      "hlcContribution": 67.49,
      "overall": 58.3
    }
  },
  {
    "id": "lo-019",
    "input": {
      "multicellularComplexity": 0.7,
      "hepatocyteLikeFidelity": 0.72,
      "stellatePresence": 0.59,
      "cholangiocyteMix": 0.54,
      "lipidAccumulation": 0.39,
      "inflammationCue": 0.6,
      "differentiationDay": 0.72,
      "overclaimRisk": 0.28,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 67.39,
      "hepatocyteScore": 70.35,
      "lineageScore": 66.63,
      "masldScore": 49.63,
      "baselineScore": 41.82,
      "confidence": 51.4,
      "hloContribution": 63.45,
      "hlcContribution": 44.99,
      "overall": 64.13
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 23.24,
      "hepatocyteScore": 65.06,
      "lineageScore": 38.01,
      "masldScore": 25.66,
      "baselineScore": 63.16,
      "confidence": 44.96,
      "hloContribution": 43.03,
      "hlcContribution": 57.05,
      "overall": 48.75
    }
  },
  {
    "id": "lo-020",
    "input": {
      "multicellularComplexity": 0.66,
      "hepatocyteLikeFidelity": 0.68,
      "stellatePresence": 0.63,
      "cholangiocyteMix": 0.5,
      "lipidAccumulation": 0.4,
      "inflammationCue": 0.55,
      "differentiationDay": 0.68,
      "overclaimRisk": 0.29,
      "lineageBias": "hlo_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 72.12,
      "hepatocyteScore": 66.89,
      "lineageScore": 86.65,
      "masldScore": 40.13,
      "baselineScore": 40.58,
      "confidence": 48,
      "hloContribution": 67.57,
      "hlcContribution": 43.06,
      "overall": 67.16
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 8.38,
      "hepatocyteScore": 42.65,
      "lineageScore": 36.39,
      "masldScore": 25.44,
      "baselineScore": 39.54,
      "confidence": 41.97,
      "hloContribution": 30.48,
      "hlcContribution": 37.2,
      "overall": 30.2
    }
  },
  {
    "id": "lo-021",
    "input": {
      "multicellularComplexity": 0.7,
      "hepatocyteLikeFidelity": 0.72,
      "stellatePresence": 0.61,
      "cholangiocyteMix": 0.53,
      "lipidAccumulation": 0.36,
      "inflammationCue": 0.58,
      "differentiationDay": 0.72,
      "overclaimRisk": 0.24,
      "lineageBias": "balanced",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 68.14,
      "hepatocyteScore": 70.35,
      "lineageScore": 67.4,
      "masldScore": 48.04,
      "baselineScore": 41.82,
      "confidence": 52.2,
      "hloContribution": 63.51,
      "hlcContribution": 45,
      "overall": 64.18
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 23.36,
      "hepatocyteScore": 65.27,
      "lineageScore": 37.91,
      "masldScore": 24.68,
      "baselineScore": 62.96,
      "confidence": 45.81,
      "hloContribution": 42.84,
      "hlcContribution": 57.14,
      "overall": 48.89
    }
  },
  {
    "id": "lo-022",
    "input": {
      "multicellularComplexity": 0.74,
      "hepatocyteLikeFidelity": 0.76,
      "stellatePresence": 0.65,
      "cholangiocyteMix": 0.57,
      "lipidAccumulation": 0.38,
      "inflammationCue": 0.6,
      "differentiationDay": 0.76,
      "overclaimRisk": 0.25,
      "lineageBias": "lipid_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 79.56,
      "hepatocyteScore": 73.82,
      "lineageScore": 41.94,
      "masldScore": 55.99,
      "baselineScore": 43.06,
      "confidence": 55.2,
      "hloContribution": 62.34,
      "hlcContribution": 46.11,
      "overall": 63.42
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 19.53,
      "hepatocyteScore": 47.07,
      "lineageScore": 38.32,
      "masldScore": 26.11,
      "baselineScore": 43.79,
      "confidence": 48.46,
      "hloContribution": 34.96,
      "hlcContribution": 41.08,
      "overall": 34.33
    }
  },
  {
    "id": "lo-023",
    "input": {
      "multicellularComplexity": 0.79,
      "hepatocyteLikeFidelity": 0.8,
      "stellatePresence": 0.69,
      "cholangiocyteMix": 0.61,
      "lipidAccumulation": 0.39,
      "inflammationCue": 0.63,
      "differentiationDay": 0.8,
      "overclaimRisk": 0.25,
      "lineageBias": "hlc_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 35.28,
      "hepatocyteScore": 69.28,
      "lineageScore": 44.32,
      "masldScore": 34.18,
      "baselineScore": 44.05,
      "confidence": 58.7,
      "hloContribution": 43.67,
      "hlcContribution": 45.07,
      "overall": 44.92
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 28.32,
      "hepatocyteScore": 89.27,
      "lineageScore": 38.74,
      "masldScore": 27.08,
      "baselineScore": 87.08,
      "confidence": 51.27,
      "hloContribution": 54.1,
      "hlcContribution": 77.5,
      "overall": 66.71
    }
  },
  {
    "id": "lo-024",
    "input": {
      "multicellularComplexity": 0.75,
      "hepatocyteLikeFidelity": 0.76,
      "stellatePresence": 0.67,
      "cholangiocyteMix": 0.57,
      "lipidAccumulation": 0.35,
      "inflammationCue": 0.66,
      "differentiationDay": 0.76,
      "overclaimRisk": 0.2,
      "lineageBias": "balanced",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 73.2,
      "hepatocyteScore": 73.82,
      "lineageScore": 72.82,
      "masldScore": 50.29,
      "baselineScore": 42.81,
      "confidence": 56.5,
      "hloContribution": 67.71,
      "hlcContribution": 45.67,
      "overall": 67.74
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 24.27,
      "hepatocyteScore": 68.41,
      "lineageScore": 38.02,
      "masldScore": 24.72,
      "baselineScore": 65.75,
      "confidence": 49.11,
      "hloContribution": 44.23,
      "hlcContribution": 59.45,
      "overall": 50.88
    }
  },
  {
    "id": "lo-025",
    "input": {
      "multicellularComplexity": 0.79,
      "hepatocyteLikeFidelity": 0.8,
      "stellatePresence": 0.71,
      "cholangiocyteMix": 0.6,
      "lipidAccumulation": 0.37,
      "inflammationCue": 0.61,
      "differentiationDay": 0.8,
      "overclaimRisk": 0.21,
      "lineageBias": "hlo_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 85.31,
      "hepatocyteScore": 77.28,
      "lineageScore": 100,
      "masldScore": 43.39,
      "baselineScore": 44.05,
      "confidence": 59.5,
      "hloContribution": 77.92,
      "hlcContribution": 47.03,
      "overall": 76.36
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 12.44,
      "hepatocyteScore": 49.34,
      "lineageScore": 38.64,
      "masldScore": 26.45,
      "baselineScore": 45.41,
      "confidence": 52.07,
      "hloContribution": 34.46,
      "hlcContribution": 42.71,
      "overall": 35.38
    }
  },
  {
    "id": "lo-026",
    "input": {
      "multicellularComplexity": 0.83,
      "hepatocyteLikeFidelity": 0.83,
      "stellatePresence": 0.74,
      "cholangiocyteMix": 0.64,
      "lipidAccumulation": 0.38,
      "inflammationCue": 0.64,
      "differentiationDay": 0.83,
      "overclaimRisk": 0.22,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 80.68,
      "hepatocyteScore": 79.88,
      "lineageScore": 79.99,
      "masldScore": 52.65,
      "baselineScore": 44.73,
      "confidence": 62,
      "hloContribution": 73.62,
      "hlcContribution": 47.67,
      "overall": 72.95
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 25.41,
      "hepatocyteScore": 74.28,
      "lineageScore": 38.75,
      "masldScore": 27.23,
      "baselineScore": 70.98,
      "confidence": 53.98,
      "hloContribution": 47.33,
      "hlcContribution": 64.15,
      "overall": 54.69
    }
  },
  {
    "id": "lo-027",
    "input": {
      "multicellularComplexity": 0.87,
      "hepatocyteLikeFidelity": 0.87,
      "stellatePresence": 0.72,
      "cholangiocyteMix": 0.68,
      "lipidAccumulation": 0.34,
      "inflammationCue": 0.66,
      "differentiationDay": 0.87,
      "overclaimRisk": 0.17,
      "lineageBias": "lipid_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 92.75,
      "hepatocyteScore": 83.34,
      "lineageScore": 48.13,
      "masldScore": 57.62,
      "baselineScore": 45.97,
      "confidence": 66.2,
      "hloContribution": 70.13,
      "hlcContribution": 49.64,
      "overall": 70.44
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 23.39,
      "hepatocyteScore": 53.24,
      "lineageScore": 40.06,
      "masldScore": 26.51,
      "baselineScore": 49.21,
      "confidence": 57.86,
      "hloContribution": 38.48,
      "hlcContribution": 46.14,
      "overall": 39.11
    }
  },
  {
    "id": "lo-028",
    "input": {
      "multicellularComplexity": 0.83,
      "hepatocyteLikeFidelity": 0.83,
      "stellatePresence": 0.76,
      "cholangiocyteMix": 0.64,
      "lipidAccumulation": 0.36,
      "inflammationCue": 0.69,
      "differentiationDay": 0.83,
      "overclaimRisk": 0.17,
      "lineageBias": "hlc_first",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 38.35,
      "hepatocyteScore": 71.88,
      "lineageScore": 47.63,
      "masldScore": 35.64,
      "baselineScore": 44.73,
      "confidence": 63,
      "hloContribution": 46.33,
      "hlcContribution": 45.38,
      "overall": 47.16
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 29.15,
      "hepatocyteScore": 92.38,
      "lineageScore": 38.45,
      "masldScore": 26.29,
      "baselineScore": 89.61,
      "confidence": 54.62,
      "hloContribution": 55.18,
      "hlcContribution": 79.72,
      "overall": 68.74
    }
  },
  {
    "id": "lo-029",
    "input": {
      "multicellularComplexity": 0.87,
      "hepatocyteLikeFidelity": 0.87,
      "stellatePresence": 0.8,
      "cholangiocyteMix": 0.67,
      "lipidAccumulation": 0.37,
      "inflammationCue": 0.72,
      "differentiationDay": 0.87,
      "overclaimRisk": 0.18,
      "lineageBias": "balanced",
      "profile": "multicellular_hlo_model"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 84.96,
      "hepatocyteScore": 83.34,
      "lineageScore": 84.79,
      "masldScore": 54.7,
      "baselineScore": 45.97,
      "confidence": 66,
      "hloContribution": 77.36,
      "hlcContribution": 48.5,
      "overall": 76.17
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 26.33,
      "hepatocyteScore": 77.42,
      "lineageScore": 39.06,
      "masldScore": 27.31,
      "baselineScore": 73.78,
      "confidence": 57.28,
      "hloContribution": 48.78,
      "hlcContribution": 66.5,
      "overall": 56.72
    }
  },
  {
    "id": "lo-030",
    "input": {
      "multicellularComplexity": 0.91,
      "hepatocyteLikeFidelity": 0.91,
      "stellatePresence": 0.78,
      "cholangiocyteMix": 0.71,
      "lipidAccumulation": 0.33,
      "inflammationCue": 0.67,
      "differentiationDay": 0.91,
      "overclaimRisk": 0.13,
      "lineageBias": "hlo_first",
      "profile": "single_lineage_hlc_baseline"
    },
    "expectedHlo": {
      "mode": "multicellular_hlo_model",
      "multicellularScore": 97.81,
      "hepatocyteScore": 86.81,
      "lineageScore": 100,
      "masldScore": 46.25,
      "baselineScore": 47.21,
      "confidence": 70.2,
      "hloContribution": 84.07,
      "hlcContribution": 50.73,
      "overall": 82.07
    },
    "expectedHlc": {
      "mode": "single_lineage_hlc_baseline",
      "multicellularScore": 16.3,
      "hepatocyteScore": 55.51,
      "lineageScore": 40.38,
      "masldScore": 26.91,
      "baselineScore": 50.83,
      "confidence": 61.47,
      "hloContribution": 37.99,
      "hlcContribution": 47.77,
      "overall": 40.16
    }
  }
];
