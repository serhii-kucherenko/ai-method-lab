import type { AssayInput, AssayQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AssayInput;
  expectedAssayAware: AssayQuality;
  expectedNaiveProtocolRunner: AssayQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ag-001",
    "input": {
      "deckCoverage": 0.29,
      "assayFidelity": 0.25,
      "assayFit": 0.28,
      "protocolIntegrity": 0.34,
      "naivePassRate": 0.39,
      "skipOptimism": 0.45,
      "protocolHardness": 0.59,
      "leakageRisk": 0.5,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 22.56,
      "assayDiagnosis": 30.25,
      "protocolOptScore": 27.38,
      "deckIntegrity": 34.28,
      "runnerScore": 16.4,
      "confidence": 19.35,
      "assayContribution": 28.33,
      "runnerContribution": 15.96,
      "overall": 30.1
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 5.76,
      "assayDiagnosis": 17.09,
      "protocolOptScore": 13.13,
      "deckIntegrity": 32.39,
      "runnerScore": 40.93,
      "confidence": 17.1,
      "assayContribution": 21.86,
      "runnerContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "ag-002",
    "input": {
      "deckCoverage": 0.33,
      "assayFidelity": 0.29,
      "assayFit": 0.32,
      "protocolIntegrity": 0.38,
      "naivePassRate": 0.43,
      "skipOptimism": 0.46,
      "protocolHardness": 0.6,
      "leakageRisk": 0.51,
      "assayBias": "monitor_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 22.22,
      "assayDiagnosis": 33.9,
      "protocolOptScore": 39.65,
      "deckIntegrity": 30.06,
      "runnerScore": 18.89,
      "confidence": 23,
      "assayContribution": 31.63,
      "runnerContribution": 18.61,
      "overall": 33.29
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 2.43,
      "assayDiagnosis": 18.22,
      "protocolOptScore": 14.16,
      "deckIntegrity": 34.08,
      "runnerScore": 31.53,
      "confidence": 18.65,
      "assayContribution": 20.08,
      "runnerContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "ag-003",
    "input": {
      "deckCoverage": 0.37,
      "assayFidelity": 0.27,
      "assayFit": 0.36,
      "protocolIntegrity": 0.42,
      "naivePassRate": 0.46,
      "skipOptimism": 0.42,
      "protocolHardness": 0.6,
      "leakageRisk": 0.46,
      "assayBias": "runner_first",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 12.18,
      "assayDiagnosis": 23.71,
      "protocolOptScore": 23.1,
      "deckIntegrity": 17.39,
      "runnerScore": 19.94,
      "confidence": 25.6,
      "assayContribution": 19.15,
      "runnerContribution": 19.69,
      "overall": 20.25
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 12.17,
      "assayDiagnosis": 17.1,
      "protocolOptScore": 13.13,
      "deckIntegrity": 33.93,
      "runnerScore": 54.34,
      "confidence": 18.4,
      "assayContribution": 26.13,
      "runnerContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "ag-004",
    "input": {
      "deckCoverage": 0.33,
      "assayFidelity": 0.32,
      "assayFit": 0.39,
      "protocolIntegrity": 0.38,
      "naivePassRate": 0.42,
      "skipOptimism": 0.43,
      "protocolHardness": 0.53,
      "leakageRisk": 0.46,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 28.09,
      "assayDiagnosis": 36.03,
      "protocolOptScore": 32.42,
      "deckIntegrity": 42.79,
      "runnerScore": 18.93,
      "confidence": 26.1,
      "assayContribution": 34.44,
      "runnerContribution": 19.05,
      "overall": 35.67
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 8.7,
      "assayDiagnosis": 17.81,
      "protocolOptScore": 13.75,
      "deckIntegrity": 32.79,
      "runnerScore": 42.77,
      "confidence": 18.85,
      "assayContribution": 23.16,
      "runnerContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "ag-005",
    "input": {
      "deckCoverage": 0.37,
      "assayFidelity": 0.36,
      "assayFit": 0.35,
      "protocolIntegrity": 0.42,
      "naivePassRate": 0.46,
      "skipOptimism": 0.45,
      "protocolHardness": 0.53,
      "leakageRisk": 0.47,
      "assayBias": "assay_strict",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 26.86,
      "assayDiagnosis": 39.64,
      "protocolOptScore": 23.89,
      "deckIntegrity": 49.01,
      "runnerScore": 21.8,
      "confidence": 27.6,
      "assayContribution": 33.97,
      "runnerContribution": 22.19,
      "overall": 35.85
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 0,
      "assayDiagnosis": 19.51,
      "protocolOptScore": 15.76,
      "deckIntegrity": 34.77,
      "runnerScore": 32.95,
      "confidence": 21.05,
      "assayContribution": 20.6,
      "runnerContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "ag-006",
    "input": {
      "deckCoverage": 0.41,
      "assayFidelity": 0.34,
      "assayFit": 0.39,
      "protocolIntegrity": 0.45,
      "naivePassRate": 0.5,
      "skipOptimism": 0.4,
      "protocolHardness": 0.54,
      "leakageRisk": 0.42,
      "assayBias": "balanced",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 33.94,
      "assayDiagnosis": 39.5,
      "protocolOptScore": 39.74,
      "deckIntegrity": 44.49,
      "runnerScore": 23.08,
      "confidence": 30.35,
      "assayContribution": 39.22,
      "runnerContribution": 23.38,
      "overall": 40.37
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 11.98,
      "assayDiagnosis": 18.04,
      "protocolOptScore": 14.31,
      "deckIntegrity": 34.78,
      "runnerScore": 46.72,
      "confidence": 20.5,
      "assayContribution": 25.17,
      "runnerContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "ag-007",
    "input": {
      "deckCoverage": 0.45,
      "assayFidelity": 0.38,
      "assayFit": 0.42,
      "protocolIntegrity": 0.49,
      "naivePassRate": 0.53,
      "skipOptimism": 0.42,
      "protocolHardness": 0.55,
      "leakageRisk": 0.43,
      "assayBias": "monitor_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 31.59,
      "assayDiagnosis": 43.11,
      "protocolOptScore": 54.51,
      "deckIntegrity": 37.19,
      "runnerScore": 25.15,
      "confidence": 33.6,
      "assayContribution": 42,
      "runnerContribution": 25.64,
      "overall": 43.06
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 8.27,
      "assayDiagnosis": 19.34,
      "protocolOptScore": 15.59,
      "deckIntegrity": 36.3,
      "runnerScore": 34.2,
      "confidence": 22.15,
      "assayContribution": 22.74,
      "runnerContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "ag-008",
    "input": {
      "deckCoverage": 0.41,
      "assayFidelity": 0.43,
      "assayFit": 0.46,
      "protocolIntegrity": 0.45,
      "naivePassRate": 0.49,
      "skipOptimism": 0.43,
      "protocolHardness": 0.47,
      "leakageRisk": 0.44,
      "assayBias": "runner_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 19.33,
      "assayDiagnosis": 35.43,
      "protocolOptScore": 27.26,
      "deckIntegrity": 25.07,
      "runnerScore": 24.32,
      "confidence": 34.35,
      "assayContribution": 26.68,
      "runnerContribution": 25.23,
      "overall": 27.42
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 16.4,
      "assayDiagnosis": 20.18,
      "protocolOptScore": 16.31,
      "deckIntegrity": 35.17,
      "runnerScore": 58.5,
      "confidence": 22.7,
      "assayContribution": 29.31,
      "runnerContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "ag-009",
    "input": {
      "deckCoverage": 0.46,
      "assayFidelity": 0.41,
      "assayFit": 0.5,
      "protocolIntegrity": 0.49,
      "naivePassRate": 0.53,
      "skipOptimism": 0.39,
      "protocolHardness": 0.48,
      "leakageRisk": 0.38,
      "assayBias": "balanced",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 40.05,
      "assayDiagnosis": 45.49,
      "protocolOptScore": 45.04,
      "deckIntegrity": 53.15,
      "runnerScore": 25.81,
      "confidence": 37.35,
      "assayContribution": 45.63,
      "runnerContribution": 26.69,
      "overall": 46.22
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 14.91,
      "assayDiagnosis": 19.07,
      "protocolOptScore": 15.29,
      "deckIntegrity": 35.36,
      "runnerScore": 48.88,
      "confidence": 22.7,
      "assayContribution": 26.7,
      "runnerContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "ag-010",
    "input": {
      "deckCoverage": 0.5,
      "assayFidelity": 0.45,
      "assayFit": 0.46,
      "protocolIntegrity": 0.53,
      "naivePassRate": 0.57,
      "skipOptimism": 0.4,
      "protocolHardness": 0.49,
      "leakageRisk": 0.39,
      "assayBias": "assay_strict",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 36.62,
      "assayDiagnosis": 49.14,
      "protocolOptScore": 33.16,
      "deckIntegrity": 61.53,
      "runnerScore": 28.29,
      "confidence": 39,
      "assayContribution": 44.14,
      "runnerContribution": 29.32,
      "overall": 45.47
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 3.59,
      "assayDiagnosis": 20.18,
      "protocolOptScore": 16.7,
      "deckIntegrity": 37.06,
      "runnerScore": 35.54,
      "confidence": 24.25,
      "assayContribution": 22.61,
      "runnerContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "ag-011",
    "input": {
      "deckCoverage": 0.54,
      "assayFidelity": 0.49,
      "assayFit": 0.49,
      "protocolIntegrity": 0.57,
      "naivePassRate": 0.6,
      "skipOptimism": 0.42,
      "protocolHardness": 0.49,
      "leakageRisk": 0.4,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 47.21,
      "assayDiagnosis": 52.75,
      "protocolOptScore": 52.38,
      "deckIntegrity": 55.79,
      "runnerScore": 30.54,
      "confidence": 42.25,
      "assayContribution": 51.87,
      "runnerContribution": 31.82,
      "overall": 52.26
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 17.1,
      "assayDiagnosis": 21.62,
      "protocolOptScore": 18.14,
      "deckIntegrity": 38.58,
      "runnerScore": 54.12,
      "confidence": 26.1,
      "assayContribution": 29.91,
      "runnerContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "ag-012",
    "input": {
      "deckCoverage": 0.5,
      "assayFidelity": 0.48,
      "assayFit": 0.53,
      "protocolIntegrity": 0.53,
      "naivePassRate": 0.56,
      "skipOptimism": 0.37,
      "protocolHardness": 0.42,
      "leakageRisk": 0.35,
      "assayBias": "monitor_first",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 38.19,
      "assayDiagnosis": 51.28,
      "protocolOptScore": 61.94,
      "deckIntegrity": 43.82,
      "runnerScore": 28.34,
      "confidence": 42.1,
      "assayContribution": 49.22,
      "runnerContribution": 29.7,
      "overall": 49.71
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 13.23,
      "assayDiagnosis": 19.68,
      "protocolOptScore": 16.17,
      "deckIntegrity": 35.76,
      "runnerScore": 34.93,
      "confidence": 24.35,
      "assayContribution": 23.95,
      "runnerContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "ag-013",
    "input": {
      "deckCoverage": 0.54,
      "assayFidelity": 0.52,
      "assayFit": 0.56,
      "protocolIntegrity": 0.57,
      "naivePassRate": 0.6,
      "skipOptimism": 0.39,
      "protocolHardness": 0.42,
      "leakageRisk": 0.36,
      "assayBias": "runner_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 29.13,
      "assayDiagnosis": 44.88,
      "protocolOptScore": 36.95,
      "deckIntegrity": 32.35,
      "runnerScore": 31.2,
      "confidence": 45.35,
      "assayContribution": 35.81,
      "runnerContribution": 32.8,
      "overall": 36.27
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 22.62,
      "assayDiagnosis": 21.35,
      "protocolOptScore": 17.8,
      "deckIntegrity": 37.74,
      "runnerScore": 67.02,
      "confidence": 26.55,
      "assayContribution": 33.31,
      "runnerContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "ag-014",
    "input": {
      "deckCoverage": 0.58,
      "assayFidelity": 0.56,
      "assayFit": 0.6,
      "protocolIntegrity": 0.61,
      "naivePassRate": 0.63,
      "skipOptimism": 0.4,
      "protocolHardness": 0.43,
      "leakageRisk": 0.36,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 52.62,
      "assayDiagnosis": 58.53,
      "protocolOptScore": 57.31,
      "deckIntegrity": 64.3,
      "runnerScore": 33.07,
      "confidence": 49,
      "assayContribution": 57.92,
      "runnerContribution": 34.8,
      "overall": 57.76
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 20.03,
      "assayDiagnosis": 22.2,
      "protocolOptScore": 18.59,
      "deckIntegrity": 38.98,
      "runnerScore": 55.96,
      "confidence": 27.85,
      "assayContribution": 31.15,
      "runnerContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "ag-015",
    "input": {
      "deckCoverage": 0.62,
      "assayFidelity": 0.54,
      "assayFit": 0.56,
      "protocolIntegrity": 0.65,
      "naivePassRate": 0.67,
      "skipOptimism": 0.36,
      "protocolHardness": 0.44,
      "leakageRisk": 0.31,
      "assayBias": "assay_strict",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 45.9,
      "assayDiagnosis": 58.35,
      "protocolOptScore": 42.52,
      "deckIntegrity": 73.14,
      "runnerScore": 34.55,
      "confidence": 49.6,
      "assayContribution": 53.93,
      "runnerContribution": 36.22,
      "overall": 54.74
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 9.43,
      "assayDiagnosis": 21.14,
      "protocolOptScore": 17.93,
      "deckIntegrity": 39.27,
      "runnerScore": 38.2,
      "confidence": 27.75,
      "assayContribution": 25.19,
      "runnerContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "ag-016",
    "input": {
      "deckCoverage": 0.58,
      "assayFidelity": 0.59,
      "assayFit": 0.6,
      "protocolIntegrity": 0.6,
      "naivePassRate": 0.63,
      "skipOptimism": 0.37,
      "protocolHardness": 0.36,
      "leakageRisk": 0.32,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 54.46,
      "assayDiagnosis": 60.67,
      "protocolOptScore": 57.87,
      "deckIntegrity": 65.05,
      "runnerScore": 33.73,
      "confidence": 50.35,
      "assayContribution": 59.24,
      "runnerContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 22.05,
      "assayDiagnosis": 21.91,
      "protocolOptScore": 18.56,
      "deckIntegrity": 38.14,
      "runnerScore": 55.7,
      "confidence": 28.3,
      "assayContribution": 31.27,
      "runnerContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "ag-017",
    "input": {
      "deckCoverage": 0.62,
      "assayFidelity": 0.63,
      "assayFit": 0.63,
      "protocolIntegrity": 0.64,
      "naivePassRate": 0.67,
      "skipOptimism": 0.39,
      "protocolHardness": 0.37,
      "leakageRisk": 0.33,
      "assayBias": "monitor_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 48.43,
      "assayDiagnosis": 64.28,
      "protocolOptScore": 76.01,
      "deckIntegrity": 52.45,
      "runnerScore": 36.41,
      "confidence": 53.6,
      "assayContribution": 60.84,
      "runnerContribution": 38.61,
      "overall": 60.84
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 18.73,
      "assayDiagnosis": 23.42,
      "protocolOptScore": 20,
      "deckIntegrity": 40.11,
      "runnerScore": 39.86,
      "confidence": 30.3,
      "assayContribution": 28.42,
      "runnerContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "ag-018",
    "input": {
      "deckCoverage": 0.66,
      "assayFidelity": 0.61,
      "assayFit": 0.67,
      "protocolIntegrity": 0.68,
      "naivePassRate": 0.7,
      "skipOptimism": 0.34,
      "protocolHardness": 0.38,
      "leakageRisk": 0.27,
      "assayBias": "runner_first",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 38.33,
      "assayDiagnosis": 54.13,
      "protocolOptScore": 45.88,
      "deckIntegrity": 39.79,
      "runnerScore": 37.08,
      "confidence": 56.35,
      "assayContribution": 44.56,
      "runnerContribution": 39.16,
      "overall": 44.59
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 28.36,
      "assayDiagnosis": 21.66,
      "protocolOptScore": 18.31,
      "deckIntegrity": 39.67,
      "runnerScore": 74.27,
      "confidence": 29.5,
      "assayContribution": 36.45,
      "runnerContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "ag-019",
    "input": {
      "deckCoverage": 0.7,
      "assayFidelity": 0.65,
      "assayFit": 0.7,
      "protocolIntegrity": 0.72,
      "naivePassRate": 0.74,
      "skipOptimism": 0.36,
      "protocolHardness": 0.38,
      "leakageRisk": 0.28,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 63.81,
      "assayDiagnosis": 67.74,
      "protocolOptScore": 69.47,
      "deckIntegrity": 73.95,
      "runnerScore": 39.94,
      "confidence": 59.6,
      "assayContribution": 68.57,
      "runnerContribution": 42.25,
      "overall": 67.83
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 26.25,
      "assayDiagnosis": 23.32,
      "protocolOptScore": 19.92,
      "deckIntegrity": 41.65,
      "runnerScore": 62.07,
      "confidence": 31.7,
      "assayContribution": 34.64,
      "runnerContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ag-020",
    "input": {
      "deckCoverage": 0.66,
      "assayFidelity": 0.7,
      "assayFit": 0.66,
      "protocolIntegrity": 0.68,
      "naivePassRate": 0.7,
      "skipOptimism": 0.37,
      "protocolHardness": 0.31,
      "leakageRisk": 0.29,
      "assayBias": "assay_strict",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 52.86,
      "assayDiagnosis": 70.06,
      "protocolOptScore": 46.45,
      "deckIntegrity": 85.3,
      "runnerScore": 38.94,
      "confidence": 58.35,
      "assayContribution": 62.33,
      "runnerContribution": 41.54,
      "overall": 62.59
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 13.66,
      "assayDiagnosis": 23.93,
      "protocolOptScore": 20.75,
      "deckIntegrity": 40.51,
      "runnerScore": 40.86,
      "confidence": 32.05,
      "assayContribution": 27.94,
      "runnerContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ag-021",
    "input": {
      "deckCoverage": 0.7,
      "assayFidelity": 0.68,
      "assayFit": 0.7,
      "protocolIntegrity": 0.72,
      "naivePassRate": 0.73,
      "skipOptimism": 0.33,
      "protocolHardness": 0.31,
      "leakageRisk": 0.24,
      "assayBias": "balanced",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 65.6,
      "assayDiagnosis": 69.88,
      "protocolOptScore": 70.62,
      "deckIntegrity": 74.7,
      "runnerScore": 39.99,
      "confidence": 60.95,
      "assayContribution": 70.03,
      "runnerContribution": 42.54,
      "overall": 69.08
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 27.89,
      "assayDiagnosis": 22.72,
      "protocolOptScore": 19.62,
      "deckIntegrity": 40.35,
      "runnerScore": 61.19,
      "confidence": 31.8,
      "assayContribution": 34.35,
      "runnerContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ag-022",
    "input": {
      "deckCoverage": 0.74,
      "assayFidelity": 0.72,
      "assayFit": 0.73,
      "protocolIntegrity": 0.76,
      "naivePassRate": 0.77,
      "skipOptimism": 0.34,
      "protocolHardness": 0.32,
      "leakageRisk": 0.25,
      "assayBias": "monitor_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 57.62,
      "assayDiagnosis": 73.52,
      "protocolOptScore": 91.49,
      "deckIntegrity": 59.58,
      "runnerScore": 42.47,
      "confidence": 64.35,
      "assayContribution": 71.35,
      "runnerContribution": 45.15,
      "overall": 70.63
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 24.57,
      "assayDiagnosis": 23.79,
      "protocolOptScore": 20.63,
      "deckIntegrity": 42.05,
      "runnerScore": 42.21,
      "confidence": 33.35,
      "assayContribution": 30.65,
      "runnerContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "ag-023",
    "input": {
      "deckCoverage": 0.79,
      "assayFidelity": 0.76,
      "assayFit": 0.77,
      "protocolIntegrity": 0.8,
      "naivePassRate": 0.81,
      "skipOptimism": 0.36,
      "protocolHardness": 0.33,
      "leakageRisk": 0.25,
      "assayBias": "runner_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 49.04,
      "assayDiagnosis": 67.38,
      "protocolOptScore": 54.82,
      "deckIntegrity": 48.57,
      "runnerScore": 45.16,
      "confidence": 68.25,
      "assayContribution": 54.96,
      "runnerContribution": 48.03,
      "overall": 54.71
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 33.86,
      "assayDiagnosis": 25.25,
      "protocolOptScore": 22.05,
      "deckIntegrity": 43.92,
      "runnerScore": 84.72,
      "confidence": 35.45,
      "assayContribution": 41.96,
      "runnerContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "ag-024",
    "input": {
      "deckCoverage": 0.75,
      "assayFidelity": 0.75,
      "assayFit": 0.81,
      "protocolIntegrity": 0.76,
      "naivePassRate": 0.77,
      "skipOptimism": 0.31,
      "protocolHardness": 0.25,
      "leakageRisk": 0.2,
      "assayBias": "balanced",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 71.55,
      "assayDiagnosis": 75.91,
      "protocolOptScore": 75.74,
      "deckIntegrity": 83.36,
      "runnerScore": 43.13,
      "confidence": 68.1,
      "assayContribution": 76.37,
      "runnerContribution": 46.07,
      "overall": 74.92
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 31.21,
      "assayDiagnosis": 23.36,
      "protocolOptScore": 20.13,
      "deckIntegrity": 41.11,
      "runnerScore": 63.65,
      "confidence": 33.9,
      "assayContribution": 35.89,
      "runnerContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "ag-025",
    "input": {
      "deckCoverage": 0.79,
      "assayFidelity": 0.79,
      "assayFit": 0.77,
      "protocolIntegrity": 0.8,
      "naivePassRate": 0.8,
      "skipOptimism": 0.33,
      "protocolHardness": 0.26,
      "leakageRisk": 0.21,
      "assayBias": "assay_strict",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 62.51,
      "assayDiagnosis": 79.52,
      "protocolOptScore": 55.93,
      "deckIntegrity": 97.81,
      "runnerScore": 45.2,
      "confidence": 69.6,
      "assayContribution": 72.52,
      "runnerContribution": 48.27,
      "overall": 72.16
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 19.5,
      "assayDiagnosis": 24.6,
      "protocolOptScore": 21.69,
      "deckIntegrity": 42.63,
      "runnerScore": 43.52,
      "confidence": 35.55,
      "assayContribution": 30.39,
      "runnerContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "ag-026",
    "input": {
      "deckCoverage": 0.83,
      "assayFidelity": 0.83,
      "assayFit": 0.8,
      "protocolIntegrity": 0.83,
      "naivePassRate": 0.84,
      "skipOptimism": 0.34,
      "protocolHardness": 0.27,
      "leakageRisk": 0.22,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 78.52,
      "assayDiagnosis": 83.17,
      "protocolOptScore": 82.25,
      "deckIntegrity": 86,
      "runnerScore": 47.68,
      "confidence": 73,
      "assayContribution": 82.33,
      "runnerContribution": 50.87,
      "overall": 80.67
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 33.17,
      "assayDiagnosis": 25.67,
      "protocolOptScore": 22.7,
      "deckIntegrity": 44.32,
      "runnerScore": 68.8,
      "confidence": 37.1,
      "assayContribution": 38.93,
      "runnerContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "ag-027",
    "input": {
      "deckCoverage": 0.87,
      "assayFidelity": 0.81,
      "assayFit": 0.84,
      "protocolIntegrity": 0.87,
      "naivePassRate": 0.88,
      "skipOptimism": 0.3,
      "protocolHardness": 0.27,
      "leakageRisk": 0.17,
      "assayBias": "monitor_first",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 67.26,
      "assayDiagnosis": 82.98,
      "protocolOptScore": 100,
      "deckIntegrity": 67.17,
      "runnerScore": 49.35,
      "confidence": 75.6,
      "assayContribution": 80.18,
      "runnerContribution": 52.5,
      "overall": 79.2
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 30.78,
      "assayDiagnosis": 24.7,
      "protocolOptScore": 21.75,
      "deckIntegrity": 44.62,
      "runnerScore": 45.22,
      "confidence": 37.2,
      "assayContribution": 33.41,
      "runnerContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "ag-028",
    "input": {
      "deckCoverage": 0.83,
      "assayFidelity": 0.86,
      "assayFit": 0.87,
      "protocolIntegrity": 0.83,
      "naivePassRate": 0.84,
      "skipOptimism": 0.31,
      "protocolHardness": 0.2,
      "leakageRisk": 0.17,
      "assayBias": "runner_first",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 54.87,
      "assayDiagnosis": 75.3,
      "protocolOptScore": 59.19,
      "deckIntegrity": 54.75,
      "runnerScore": 48.34,
      "confidence": 76.1,
      "assayContribution": 60.96,
      "runnerContribution": 51.73,
      "overall": 60.3
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 38.81,
      "assayDiagnosis": 25.25,
      "protocolOptScore": 22.17,
      "deckIntegrity": 43.48,
      "runnerScore": 86.95,
      "confidence": 37.65,
      "assayContribution": 43.33,
      "runnerContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "ag-029",
    "input": {
      "deckCoverage": 0.87,
      "assayFidelity": 0.9,
      "assayFit": 0.91,
      "protocolIntegrity": 0.87,
      "naivePassRate": 0.87,
      "skipOptimism": 0.33,
      "protocolHardness": 0.2,
      "leakageRisk": 0.18,
      "assayBias": "balanced",
      "profile": "assay_aware"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 83.89,
      "assayDiagnosis": 88.91,
      "protocolOptScore": 87.12,
      "deckIntegrity": 94.51,
      "runnerScore": 50.59,
      "confidence": 79.6,
      "assayContribution": 88.34,
      "runnerContribution": 54.16,
      "overall": 86.19
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 36.33,
      "assayDiagnosis": 26.6,
      "protocolOptScore": 23.46,
      "deckIntegrity": 45,
      "runnerScore": 71.06,
      "confidence": 39.5,
      "assayContribution": 40.49,
      "runnerContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "ag-030",
    "input": {
      "deckCoverage": 0.91,
      "assayFidelity": 0.88,
      "assayFit": 0.87,
      "protocolIntegrity": 0.91,
      "naivePassRate": 0.91,
      "skipOptimism": 0.28,
      "protocolHardness": 0.21,
      "leakageRisk": 0.13,
      "assayBias": "assay_strict",
      "profile": "naive_protocol_runner"
    },
    "expectedAssayAware": {
      "mode": "assay_aware",
      "ruleCoverage": 71.59,
      "assayDiagnosis": 88.77,
      "protocolOptScore": 64.69,
      "deckIntegrity": 100,
      "runnerScore": 51.88,
      "confidence": 80.35,
      "assayContribution": 80.03,
      "runnerContribution": 55.31,
      "overall": 79.58
    },
    "expectedNaiveProtocolRunner": {
      "mode": "naive_protocol_runner",
      "ruleCoverage": 25.72,
      "assayDiagnosis": 25.06,
      "protocolOptScore": 22.34,
      "deckIntegrity": 45.02,
      "runnerScore": 46.21,
      "confidence": 38.95,
      "assayContribution": 32.87,
      "runnerContribution": 50.68,
      "overall": 44.3
    }
  }
];
