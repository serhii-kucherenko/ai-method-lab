import type { ProbeInput, ProbeQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ProbeInput;
  expectedProbe: ProbeQuality;
  expectedOpaque: ProbeQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "vp-001",
    "input": {
      "panelCoverage": 0.29,
      "probeFidelity": 0.25,
      "mechanismClarity": 0.28,
      "runStability": 0.34,
      "opaqueBaselineRate": 0.39,
      "skipOptimism": 0.45,
      "mechanismHardness": 0.59,
      "overclaimRisk": 0.5,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 22.56,
      "probeScore": 30.25,
      "mechanismOptScore": 23.49,
      "packIntegrity": 37.64,
      "opaqueBaselineScore": 16.4,
      "confidence": 19.35,
      "probeContribution": 27.98,
      "opaqueContribution": 15.96,
      "overall": 29.82
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 5.76,
      "probeScore": 17.09,
      "mechanismOptScore": 13.13,
      "packIntegrity": 32.39,
      "opaqueBaselineScore": 40.93,
      "confidence": 17.1,
      "probeContribution": 21.86,
      "opaqueContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "vp-002",
    "input": {
      "panelCoverage": 0.33,
      "probeFidelity": 0.29,
      "mechanismClarity": 0.32,
      "runStability": 0.38,
      "opaqueBaselineRate": 0.43,
      "skipOptimism": 0.46,
      "mechanismHardness": 0.6,
      "overclaimRisk": 0.51,
      "probeBias": "mechanism_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 22.22,
      "probeScore": 33.9,
      "mechanismOptScore": 34.39,
      "packIntegrity": 31.9,
      "opaqueBaselineScore": 18.89,
      "confidence": 23,
      "probeContribution": 30.56,
      "opaqueContribution": 18.61,
      "overall": 32.41
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 2.43,
      "probeScore": 18.22,
      "mechanismOptScore": 14.16,
      "packIntegrity": 34.08,
      "opaqueBaselineScore": 31.53,
      "confidence": 18.65,
      "probeContribution": 20.08,
      "opaqueContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "vp-003",
    "input": {
      "panelCoverage": 0.37,
      "probeFidelity": 0.27,
      "mechanismClarity": 0.36,
      "runStability": 0.42,
      "opaqueBaselineRate": 0.46,
      "skipOptimism": 0.42,
      "mechanismHardness": 0.6,
      "overclaimRisk": 0.46,
      "probeBias": "opaque_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 12.18,
      "probeScore": 23.71,
      "mechanismOptScore": 20.95,
      "packIntegrity": 19.24,
      "opaqueBaselineScore": 19.94,
      "confidence": 25.6,
      "probeContribution": 18.96,
      "opaqueContribution": 19.69,
      "overall": 20.09
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 12.17,
      "probeScore": 17.1,
      "mechanismOptScore": 13.13,
      "packIntegrity": 33.93,
      "opaqueBaselineScore": 54.34,
      "confidence": 18.4,
      "probeContribution": 26.13,
      "opaqueContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "vp-004",
    "input": {
      "panelCoverage": 0.33,
      "probeFidelity": 0.32,
      "mechanismClarity": 0.39,
      "runStability": 0.38,
      "opaqueBaselineRate": 0.42,
      "skipOptimism": 0.43,
      "mechanismHardness": 0.53,
      "overclaimRisk": 0.46,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 28.09,
      "probeScore": 36.03,
      "mechanismOptScore": 33.07,
      "packIntegrity": 42.23,
      "opaqueBaselineScore": 18.93,
      "confidence": 26.1,
      "probeContribution": 34.5,
      "opaqueContribution": 19.05,
      "overall": 35.72
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 8.7,
      "probeScore": 17.81,
      "mechanismOptScore": 13.75,
      "packIntegrity": 32.79,
      "opaqueBaselineScore": 42.77,
      "confidence": 18.85,
      "probeContribution": 23.16,
      "opaqueContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "vp-005",
    "input": {
      "panelCoverage": 0.37,
      "probeFidelity": 0.36,
      "mechanismClarity": 0.35,
      "runStability": 0.42,
      "opaqueBaselineRate": 0.46,
      "skipOptimism": 0.45,
      "mechanismHardness": 0.53,
      "overclaimRisk": 0.47,
      "probeBias": "probe_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 26.86,
      "probeScore": 39.64,
      "mechanismOptScore": 21.39,
      "packIntegrity": 54.3,
      "opaqueBaselineScore": 21.8,
      "confidence": 27.6,
      "probeContribution": 34.43,
      "opaqueContribution": 22.19,
      "overall": 36.23
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 0,
      "probeScore": 19.51,
      "mechanismOptScore": 15.76,
      "packIntegrity": 34.77,
      "opaqueBaselineScore": 32.95,
      "confidence": 21.05,
      "probeContribution": 20.6,
      "opaqueContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "vp-006",
    "input": {
      "panelCoverage": 0.41,
      "probeFidelity": 0.34,
      "mechanismClarity": 0.39,
      "runStability": 0.45,
      "opaqueBaselineRate": 0.5,
      "skipOptimism": 0.4,
      "mechanismHardness": 0.54,
      "overclaimRisk": 0.42,
      "probeBias": "balanced",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 33.94,
      "probeScore": 39.5,
      "mechanismOptScore": 35.84,
      "packIntegrity": 47.85,
      "opaqueBaselineScore": 23.08,
      "confidence": 30.35,
      "probeContribution": 38.87,
      "opaqueContribution": 23.38,
      "overall": 40.08
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 11.98,
      "probeScore": 18.04,
      "mechanismOptScore": 14.31,
      "packIntegrity": 34.78,
      "opaqueBaselineScore": 46.72,
      "confidence": 20.5,
      "probeContribution": 25.17,
      "opaqueContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "vp-007",
    "input": {
      "panelCoverage": 0.45,
      "probeFidelity": 0.38,
      "mechanismClarity": 0.42,
      "runStability": 0.49,
      "opaqueBaselineRate": 0.53,
      "skipOptimism": 0.42,
      "mechanismHardness": 0.55,
      "overclaimRisk": 0.43,
      "probeBias": "mechanism_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 31.59,
      "probeScore": 43.11,
      "mechanismOptScore": 48.37,
      "packIntegrity": 39.34,
      "opaqueBaselineScore": 25.15,
      "confidence": 33.6,
      "probeContribution": 40.76,
      "opaqueContribution": 25.64,
      "overall": 42.04
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 8.27,
      "probeScore": 19.34,
      "mechanismOptScore": 15.59,
      "packIntegrity": 36.3,
      "opaqueBaselineScore": 34.2,
      "confidence": 22.15,
      "probeContribution": 22.74,
      "opaqueContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "vp-008",
    "input": {
      "panelCoverage": 0.41,
      "probeFidelity": 0.43,
      "mechanismClarity": 0.46,
      "runStability": 0.45,
      "opaqueBaselineRate": 0.49,
      "skipOptimism": 0.43,
      "mechanismHardness": 0.47,
      "overclaimRisk": 0.44,
      "probeBias": "opaque_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 19.33,
      "probeScore": 35.43,
      "mechanismOptScore": 27.62,
      "packIntegrity": 24.76,
      "opaqueBaselineScore": 24.32,
      "confidence": 34.35,
      "probeContribution": 26.71,
      "opaqueContribution": 25.23,
      "overall": 27.44
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 16.4,
      "probeScore": 20.18,
      "mechanismOptScore": 16.31,
      "packIntegrity": 35.17,
      "opaqueBaselineScore": 58.5,
      "confidence": 22.7,
      "probeContribution": 29.31,
      "opaqueContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "vp-009",
    "input": {
      "panelCoverage": 0.46,
      "probeFidelity": 0.41,
      "mechanismClarity": 0.5,
      "runStability": 0.49,
      "opaqueBaselineRate": 0.53,
      "skipOptimism": 0.39,
      "mechanismHardness": 0.48,
      "overclaimRisk": 0.38,
      "probeBias": "balanced",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 40.05,
      "probeScore": 45.49,
      "mechanismOptScore": 45.68,
      "packIntegrity": 52.59,
      "opaqueBaselineScore": 25.81,
      "confidence": 37.35,
      "probeContribution": 45.69,
      "opaqueContribution": 26.69,
      "overall": 46.27
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 14.91,
      "probeScore": 19.07,
      "mechanismOptScore": 15.29,
      "packIntegrity": 35.36,
      "opaqueBaselineScore": 48.88,
      "confidence": 22.7,
      "probeContribution": 26.7,
      "opaqueContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "vp-010",
    "input": {
      "panelCoverage": 0.5,
      "probeFidelity": 0.45,
      "mechanismClarity": 0.46,
      "runStability": 0.53,
      "opaqueBaselineRate": 0.57,
      "skipOptimism": 0.4,
      "mechanismHardness": 0.49,
      "overclaimRisk": 0.39,
      "probeBias": "probe_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 36.62,
      "probeScore": 49.14,
      "mechanismOptScore": 30.65,
      "packIntegrity": 66.82,
      "opaqueBaselineScore": 28.29,
      "confidence": 39,
      "probeContribution": 44.6,
      "opaqueContribution": 29.32,
      "overall": 45.85
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 3.59,
      "probeScore": 20.18,
      "mechanismOptScore": 16.7,
      "packIntegrity": 37.06,
      "opaqueBaselineScore": 35.54,
      "confidence": 24.25,
      "probeContribution": 22.61,
      "opaqueContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "vp-011",
    "input": {
      "panelCoverage": 0.54,
      "probeFidelity": 0.49,
      "mechanismClarity": 0.49,
      "runStability": 0.57,
      "opaqueBaselineRate": 0.6,
      "skipOptimism": 0.42,
      "mechanismHardness": 0.49,
      "overclaimRisk": 0.4,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 47.21,
      "probeScore": 52.75,
      "mechanismOptScore": 47.19,
      "packIntegrity": 60.27,
      "opaqueBaselineScore": 30.54,
      "confidence": 42.25,
      "probeContribution": 51.41,
      "opaqueContribution": 31.82,
      "overall": 51.88
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 17.1,
      "probeScore": 21.62,
      "mechanismOptScore": 18.14,
      "packIntegrity": 38.58,
      "opaqueBaselineScore": 54.12,
      "confidence": 26.1,
      "probeContribution": 29.91,
      "opaqueContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "vp-012",
    "input": {
      "panelCoverage": 0.5,
      "probeFidelity": 0.48,
      "mechanismClarity": 0.53,
      "runStability": 0.53,
      "opaqueBaselineRate": 0.56,
      "skipOptimism": 0.37,
      "mechanismHardness": 0.42,
      "overclaimRisk": 0.35,
      "probeBias": "mechanism_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 38.19,
      "probeScore": 51.28,
      "mechanismOptScore": 61.94,
      "packIntegrity": 43.82,
      "opaqueBaselineScore": 28.34,
      "confidence": 42.1,
      "probeContribution": 49.22,
      "opaqueContribution": 29.7,
      "overall": 49.71
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 13.23,
      "probeScore": 19.68,
      "mechanismOptScore": 16.17,
      "packIntegrity": 35.76,
      "opaqueBaselineScore": 34.93,
      "confidence": 24.35,
      "probeContribution": 23.95,
      "opaqueContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "vp-013",
    "input": {
      "panelCoverage": 0.54,
      "probeFidelity": 0.52,
      "mechanismClarity": 0.56,
      "runStability": 0.57,
      "opaqueBaselineRate": 0.6,
      "skipOptimism": 0.39,
      "mechanismHardness": 0.42,
      "overclaimRisk": 0.36,
      "probeBias": "opaque_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 29.13,
      "probeScore": 44.88,
      "mechanismOptScore": 36.59,
      "packIntegrity": 32.66,
      "opaqueBaselineScore": 31.2,
      "confidence": 45.35,
      "probeContribution": 35.78,
      "opaqueContribution": 32.8,
      "overall": 36.24
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 22.62,
      "probeScore": 21.35,
      "mechanismOptScore": 17.8,
      "packIntegrity": 37.74,
      "opaqueBaselineScore": 67.02,
      "confidence": 26.55,
      "probeContribution": 33.31,
      "opaqueContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "vp-014",
    "input": {
      "panelCoverage": 0.58,
      "probeFidelity": 0.56,
      "mechanismClarity": 0.6,
      "runStability": 0.61,
      "opaqueBaselineRate": 0.63,
      "skipOptimism": 0.4,
      "mechanismHardness": 0.43,
      "overclaimRisk": 0.36,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 52.62,
      "probeScore": 58.53,
      "mechanismOptScore": 56.66,
      "packIntegrity": 64.86,
      "opaqueBaselineScore": 33.07,
      "confidence": 49,
      "probeContribution": 57.86,
      "opaqueContribution": 34.8,
      "overall": 57.71
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 20.03,
      "probeScore": 22.2,
      "mechanismOptScore": 18.59,
      "packIntegrity": 38.98,
      "opaqueBaselineScore": 55.96,
      "confidence": 27.85,
      "probeContribution": 31.15,
      "opaqueContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "vp-015",
    "input": {
      "panelCoverage": 0.62,
      "probeFidelity": 0.54,
      "mechanismClarity": 0.56,
      "runStability": 0.65,
      "opaqueBaselineRate": 0.67,
      "skipOptimism": 0.36,
      "mechanismHardness": 0.44,
      "overclaimRisk": 0.31,
      "probeBias": "probe_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 45.9,
      "probeScore": 58.35,
      "mechanismOptScore": 39.3,
      "packIntegrity": 79.94,
      "opaqueBaselineScore": 34.55,
      "confidence": 49.6,
      "probeContribution": 54.53,
      "opaqueContribution": 36.22,
      "overall": 55.23
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 9.43,
      "probeScore": 21.14,
      "mechanismOptScore": 17.93,
      "packIntegrity": 39.27,
      "opaqueBaselineScore": 38.2,
      "confidence": 27.75,
      "probeContribution": 25.19,
      "opaqueContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "vp-016",
    "input": {
      "panelCoverage": 0.58,
      "probeFidelity": 0.59,
      "mechanismClarity": 0.6,
      "runStability": 0.6,
      "opaqueBaselineRate": 0.63,
      "skipOptimism": 0.37,
      "mechanismHardness": 0.36,
      "overclaimRisk": 0.32,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 54.46,
      "probeScore": 60.67,
      "mechanismOptScore": 57.87,
      "packIntegrity": 65.05,
      "opaqueBaselineScore": 33.73,
      "confidence": 50.35,
      "probeContribution": 59.24,
      "opaqueContribution": 35.76,
      "overall": 59.01
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 22.05,
      "probeScore": 21.91,
      "mechanismOptScore": 18.56,
      "packIntegrity": 38.14,
      "opaqueBaselineScore": 55.7,
      "confidence": 28.3,
      "probeContribution": 31.27,
      "opaqueContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "vp-017",
    "input": {
      "panelCoverage": 0.62,
      "probeFidelity": 0.63,
      "mechanismClarity": 0.63,
      "runStability": 0.64,
      "opaqueBaselineRate": 0.67,
      "skipOptimism": 0.39,
      "mechanismHardness": 0.37,
      "overclaimRisk": 0.33,
      "probeBias": "mechanism_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 48.43,
      "probeScore": 64.28,
      "mechanismOptScore": 75.13,
      "packIntegrity": 52.76,
      "opaqueBaselineScore": 36.41,
      "confidence": 53.6,
      "probeContribution": 60.66,
      "opaqueContribution": 38.61,
      "overall": 60.69
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 18.73,
      "probeScore": 23.42,
      "mechanismOptScore": 20,
      "packIntegrity": 40.11,
      "opaqueBaselineScore": 39.86,
      "confidence": 30.3,
      "probeContribution": 28.42,
      "opaqueContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "vp-018",
    "input": {
      "panelCoverage": 0.66,
      "probeFidelity": 0.61,
      "mechanismClarity": 0.67,
      "runStability": 0.68,
      "opaqueBaselineRate": 0.7,
      "skipOptimism": 0.34,
      "mechanismHardness": 0.38,
      "overclaimRisk": 0.27,
      "probeBias": "opaque_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 38.33,
      "probeScore": 54.13,
      "mechanismOptScore": 45.52,
      "packIntegrity": 40.09,
      "opaqueBaselineScore": 37.08,
      "confidence": 56.35,
      "probeContribution": 44.52,
      "opaqueContribution": 39.16,
      "overall": 44.56
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 28.36,
      "probeScore": 21.66,
      "mechanismOptScore": 18.31,
      "packIntegrity": 39.67,
      "opaqueBaselineScore": 74.27,
      "confidence": 29.5,
      "probeContribution": 36.45,
      "opaqueContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "vp-019",
    "input": {
      "panelCoverage": 0.7,
      "probeFidelity": 0.65,
      "mechanismClarity": 0.7,
      "runStability": 0.72,
      "opaqueBaselineRate": 0.74,
      "skipOptimism": 0.36,
      "mechanismHardness": 0.38,
      "overclaimRisk": 0.28,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 63.81,
      "probeScore": 67.74,
      "mechanismOptScore": 68.17,
      "packIntegrity": 75.07,
      "opaqueBaselineScore": 39.94,
      "confidence": 59.6,
      "probeContribution": 68.45,
      "opaqueContribution": 42.25,
      "overall": 67.73
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 26.25,
      "probeScore": 23.32,
      "mechanismOptScore": 19.92,
      "packIntegrity": 41.65,
      "opaqueBaselineScore": 62.07,
      "confidence": 31.7,
      "probeContribution": 34.64,
      "opaqueContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "vp-020",
    "input": {
      "panelCoverage": 0.66,
      "probeFidelity": 0.7,
      "mechanismClarity": 0.66,
      "runStability": 0.68,
      "opaqueBaselineRate": 0.7,
      "skipOptimism": 0.37,
      "mechanismHardness": 0.31,
      "overclaimRisk": 0.29,
      "probeBias": "probe_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 52.86,
      "probeScore": 70.06,
      "mechanismOptScore": 45.74,
      "packIntegrity": 86.81,
      "opaqueBaselineScore": 38.94,
      "confidence": 58.35,
      "probeContribution": 62.46,
      "opaqueContribution": 41.54,
      "overall": 62.69
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 13.66,
      "probeScore": 23.93,
      "mechanismOptScore": 20.75,
      "packIntegrity": 40.51,
      "opaqueBaselineScore": 40.86,
      "confidence": 32.05,
      "probeContribution": 27.94,
      "opaqueContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "vp-021",
    "input": {
      "panelCoverage": 0.7,
      "probeFidelity": 0.68,
      "mechanismClarity": 0.7,
      "runStability": 0.72,
      "opaqueBaselineRate": 0.73,
      "skipOptimism": 0.33,
      "mechanismHardness": 0.31,
      "overclaimRisk": 0.24,
      "probeBias": "balanced",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 65.6,
      "probeScore": 69.88,
      "mechanismOptScore": 69.32,
      "packIntegrity": 75.82,
      "opaqueBaselineScore": 39.99,
      "confidence": 60.95,
      "probeContribution": 69.92,
      "opaqueContribution": 42.54,
      "overall": 68.99
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 27.89,
      "probeScore": 22.72,
      "mechanismOptScore": 19.62,
      "packIntegrity": 40.35,
      "opaqueBaselineScore": 61.19,
      "confidence": 31.8,
      "probeContribution": 34.35,
      "opaqueContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "vp-022",
    "input": {
      "panelCoverage": 0.74,
      "probeFidelity": 0.72,
      "mechanismClarity": 0.73,
      "runStability": 0.76,
      "opaqueBaselineRate": 0.77,
      "skipOptimism": 0.34,
      "mechanismHardness": 0.32,
      "overclaimRisk": 0.25,
      "probeBias": "mechanism_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 57.62,
      "probeScore": 73.52,
      "mechanismOptScore": 88.86,
      "packIntegrity": 60.51,
      "opaqueBaselineScore": 42.47,
      "confidence": 64.35,
      "probeContribution": 70.82,
      "opaqueContribution": 45.15,
      "overall": 70.2
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 24.57,
      "probeScore": 23.79,
      "mechanismOptScore": 20.63,
      "packIntegrity": 42.05,
      "opaqueBaselineScore": 42.21,
      "confidence": 33.35,
      "probeContribution": 30.65,
      "opaqueContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "vp-023",
    "input": {
      "panelCoverage": 0.79,
      "probeFidelity": 0.76,
      "mechanismClarity": 0.77,
      "runStability": 0.8,
      "opaqueBaselineRate": 0.81,
      "skipOptimism": 0.36,
      "mechanismHardness": 0.33,
      "overclaimRisk": 0.25,
      "probeBias": "opaque_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 49.04,
      "probeScore": 67.38,
      "mechanismOptScore": 53.74,
      "packIntegrity": 49.49,
      "opaqueBaselineScore": 45.16,
      "confidence": 68.25,
      "probeContribution": 54.86,
      "opaqueContribution": 48.03,
      "overall": 54.63
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 33.86,
      "probeScore": 25.25,
      "mechanismOptScore": 22.05,
      "packIntegrity": 43.92,
      "opaqueBaselineScore": 84.72,
      "confidence": 35.45,
      "probeContribution": 41.96,
      "opaqueContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "vp-024",
    "input": {
      "panelCoverage": 0.75,
      "probeFidelity": 0.75,
      "mechanismClarity": 0.81,
      "runStability": 0.76,
      "opaqueBaselineRate": 0.77,
      "skipOptimism": 0.31,
      "mechanismHardness": 0.25,
      "overclaimRisk": 0.2,
      "probeBias": "balanced",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 71.55,
      "probeScore": 75.91,
      "mechanismOptScore": 78.99,
      "packIntegrity": 80.56,
      "opaqueBaselineScore": 43.13,
      "confidence": 68.1,
      "probeContribution": 76.66,
      "opaqueContribution": 46.07,
      "overall": 75.15
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 31.21,
      "probeScore": 23.36,
      "mechanismOptScore": 20.13,
      "packIntegrity": 41.11,
      "opaqueBaselineScore": 63.65,
      "confidence": 33.9,
      "probeContribution": 35.89,
      "opaqueContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "vp-025",
    "input": {
      "panelCoverage": 0.79,
      "probeFidelity": 0.79,
      "mechanismClarity": 0.77,
      "runStability": 0.8,
      "opaqueBaselineRate": 0.8,
      "skipOptimism": 0.33,
      "mechanismHardness": 0.26,
      "overclaimRisk": 0.21,
      "probeBias": "probe_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 62.51,
      "probeScore": 79.52,
      "mechanismOptScore": 54.86,
      "packIntegrity": 100,
      "opaqueBaselineScore": 45.2,
      "confidence": 69.6,
      "probeContribution": 72.7,
      "opaqueContribution": 48.27,
      "overall": 72.3
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 19.5,
      "probeScore": 24.6,
      "mechanismOptScore": 21.69,
      "packIntegrity": 42.63,
      "opaqueBaselineScore": 43.52,
      "confidence": 35.55,
      "probeContribution": 30.39,
      "opaqueContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "vp-026",
    "input": {
      "panelCoverage": 0.83,
      "probeFidelity": 0.83,
      "mechanismClarity": 0.8,
      "runStability": 0.83,
      "opaqueBaselineRate": 0.84,
      "skipOptimism": 0.34,
      "mechanismHardness": 0.27,
      "overclaimRisk": 0.22,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 78.52,
      "probeScore": 83.17,
      "mechanismOptScore": 80.3,
      "packIntegrity": 87.68,
      "opaqueBaselineScore": 47.68,
      "confidence": 73,
      "probeContribution": 82.15,
      "opaqueContribution": 50.87,
      "overall": 80.52
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 33.17,
      "probeScore": 25.67,
      "mechanismOptScore": 22.7,
      "packIntegrity": 44.32,
      "opaqueBaselineScore": 68.8,
      "confidence": 37.1,
      "probeContribution": 38.93,
      "opaqueContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "vp-027",
    "input": {
      "panelCoverage": 0.87,
      "probeFidelity": 0.81,
      "mechanismClarity": 0.84,
      "runStability": 0.87,
      "opaqueBaselineRate": 0.88,
      "skipOptimism": 0.3,
      "mechanismHardness": 0.27,
      "overclaimRisk": 0.17,
      "probeBias": "mechanism_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 67.26,
      "probeScore": 82.98,
      "mechanismOptScore": 100,
      "packIntegrity": 68.1,
      "opaqueBaselineScore": 49.35,
      "confidence": 75.6,
      "probeContribution": 80.38,
      "opaqueContribution": 52.5,
      "overall": 79.36
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 30.78,
      "probeScore": 24.7,
      "mechanismOptScore": 21.75,
      "packIntegrity": 44.62,
      "opaqueBaselineScore": 45.22,
      "confidence": 37.2,
      "probeContribution": 33.41,
      "opaqueContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "vp-028",
    "input": {
      "panelCoverage": 0.83,
      "probeFidelity": 0.86,
      "mechanismClarity": 0.87,
      "runStability": 0.83,
      "opaqueBaselineRate": 0.84,
      "skipOptimism": 0.31,
      "mechanismHardness": 0.2,
      "overclaimRisk": 0.17,
      "probeBias": "opaque_first",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 54.87,
      "probeScore": 75.3,
      "mechanismOptScore": 60.62,
      "packIntegrity": 53.51,
      "opaqueBaselineScore": 48.34,
      "confidence": 76.1,
      "probeContribution": 61.08,
      "opaqueContribution": 51.73,
      "overall": 60.4
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 38.81,
      "probeScore": 25.25,
      "mechanismOptScore": 22.17,
      "packIntegrity": 43.48,
      "opaqueBaselineScore": 86.95,
      "confidence": 37.65,
      "probeContribution": 43.33,
      "opaqueContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "vp-029",
    "input": {
      "panelCoverage": 0.87,
      "probeFidelity": 0.9,
      "mechanismClarity": 0.91,
      "runStability": 0.87,
      "opaqueBaselineRate": 0.87,
      "skipOptimism": 0.33,
      "mechanismHardness": 0.2,
      "overclaimRisk": 0.18,
      "probeBias": "balanced",
      "profile": "interpretable_fm_probe"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 83.89,
      "probeScore": 88.91,
      "mechanismOptScore": 89.72,
      "packIntegrity": 92.27,
      "opaqueBaselineScore": 50.59,
      "confidence": 79.6,
      "probeContribution": 88.57,
      "opaqueContribution": 54.16,
      "overall": 86.38
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 36.33,
      "probeScore": 26.6,
      "mechanismOptScore": 23.46,
      "packIntegrity": 45,
      "opaqueBaselineScore": 71.06,
      "confidence": 39.5,
      "probeContribution": 40.49,
      "opaqueContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "vp-030",
    "input": {
      "panelCoverage": 0.91,
      "probeFidelity": 0.88,
      "mechanismClarity": 0.87,
      "runStability": 0.91,
      "opaqueBaselineRate": 0.91,
      "skipOptimism": 0.28,
      "mechanismHardness": 0.21,
      "overclaimRisk": 0.13,
      "probeBias": "probe_first",
      "profile": "opaque_pathogenicity_baseline"
    },
    "expectedProbe": {
      "mode": "interpretable_fm_probe",
      "probeCoverage": 71.59,
      "probeScore": 88.77,
      "mechanismOptScore": 63.26,
      "packIntegrity": 100,
      "opaqueBaselineScore": 51.88,
      "confidence": 80.35,
      "probeContribution": 79.63,
      "opaqueContribution": 55.31,
      "overall": 79.25
    },
    "expectedOpaque": {
      "mode": "opaque_pathogenicity_baseline",
      "probeCoverage": 25.72,
      "probeScore": 25.06,
      "mechanismOptScore": 22.34,
      "packIntegrity": 45.02,
      "opaqueBaselineScore": 46.21,
      "confidence": 38.95,
      "probeContribution": 32.87,
      "opaqueContribution": 50.68,
      "overall": 44.3
    }
  }
];
