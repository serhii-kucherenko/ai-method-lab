import type { ChemInput, ChemQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ChemInput;
  expectedTypedTraceValidated: ChemQuality;
  expectedUngatedAgent: ChemQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "ct-001",
    "input": {
      "packCoverage": 0.29,
      "ruleFidelity": 0.25,
      "recoveryClarity": 0.28,
      "runStability": 0.34,
      "ungatedPassRate": 0.39,
      "skipOptimism": 0.45,
      "transitionHardness": 0.59,
      "overclaimRisk": 0.5,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 22.56,
      "traceDiagnosis": 30.25,
      "recoveryOptScore": 23.49,
      "packIntegrity": 37.64,
      "ungatedScore": 16.4,
      "confidence": 19.35,
      "validatedContribution": 27.98,
      "ungatedContribution": 15.96,
      "overall": 29.82
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 5.76,
      "traceDiagnosis": 17.09,
      "recoveryOptScore": 13.13,
      "packIntegrity": 32.39,
      "ungatedScore": 40.93,
      "confidence": 17.1,
      "validatedContribution": 21.86,
      "ungatedContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "ct-002",
    "input": {
      "packCoverage": 0.33,
      "ruleFidelity": 0.29,
      "recoveryClarity": 0.32,
      "runStability": 0.38,
      "ungatedPassRate": 0.43,
      "skipOptimism": 0.46,
      "transitionHardness": 0.6,
      "overclaimRisk": 0.51,
      "traceBias": "recovery_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 22.22,
      "traceDiagnosis": 33.9,
      "recoveryOptScore": 34.39,
      "packIntegrity": 31.9,
      "ungatedScore": 18.89,
      "confidence": 23,
      "validatedContribution": 30.56,
      "ungatedContribution": 18.61,
      "overall": 32.41
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 2.43,
      "traceDiagnosis": 18.22,
      "recoveryOptScore": 14.16,
      "packIntegrity": 34.08,
      "ungatedScore": 31.53,
      "confidence": 18.65,
      "validatedContribution": 20.08,
      "ungatedContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "ct-003",
    "input": {
      "packCoverage": 0.37,
      "ruleFidelity": 0.27,
      "recoveryClarity": 0.36,
      "runStability": 0.42,
      "ungatedPassRate": 0.46,
      "skipOptimism": 0.42,
      "transitionHardness": 0.6,
      "overclaimRisk": 0.46,
      "traceBias": "ungated_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 12.18,
      "traceDiagnosis": 23.71,
      "recoveryOptScore": 20.95,
      "packIntegrity": 19.24,
      "ungatedScore": 19.94,
      "confidence": 25.6,
      "validatedContribution": 18.96,
      "ungatedContribution": 19.69,
      "overall": 20.09
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 12.17,
      "traceDiagnosis": 17.1,
      "recoveryOptScore": 13.13,
      "packIntegrity": 33.93,
      "ungatedScore": 54.34,
      "confidence": 18.4,
      "validatedContribution": 26.13,
      "ungatedContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "ct-004",
    "input": {
      "packCoverage": 0.33,
      "ruleFidelity": 0.32,
      "recoveryClarity": 0.39,
      "runStability": 0.38,
      "ungatedPassRate": 0.42,
      "skipOptimism": 0.43,
      "transitionHardness": 0.53,
      "overclaimRisk": 0.46,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 28.09,
      "traceDiagnosis": 36.03,
      "recoveryOptScore": 33.07,
      "packIntegrity": 42.23,
      "ungatedScore": 18.93,
      "confidence": 26.1,
      "validatedContribution": 34.5,
      "ungatedContribution": 19.05,
      "overall": 35.72
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 8.7,
      "traceDiagnosis": 17.81,
      "recoveryOptScore": 13.75,
      "packIntegrity": 32.79,
      "ungatedScore": 42.77,
      "confidence": 18.85,
      "validatedContribution": 23.16,
      "ungatedContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "ct-005",
    "input": {
      "packCoverage": 0.37,
      "ruleFidelity": 0.36,
      "recoveryClarity": 0.35,
      "runStability": 0.42,
      "ungatedPassRate": 0.46,
      "skipOptimism": 0.45,
      "transitionHardness": 0.53,
      "overclaimRisk": 0.47,
      "traceBias": "trace_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 26.86,
      "traceDiagnosis": 39.64,
      "recoveryOptScore": 21.39,
      "packIntegrity": 54.3,
      "ungatedScore": 21.8,
      "confidence": 27.6,
      "validatedContribution": 34.43,
      "ungatedContribution": 22.19,
      "overall": 36.23
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 0,
      "traceDiagnosis": 19.51,
      "recoveryOptScore": 15.76,
      "packIntegrity": 34.77,
      "ungatedScore": 32.95,
      "confidence": 21.05,
      "validatedContribution": 20.6,
      "ungatedContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "ct-006",
    "input": {
      "packCoverage": 0.41,
      "ruleFidelity": 0.34,
      "recoveryClarity": 0.39,
      "runStability": 0.45,
      "ungatedPassRate": 0.5,
      "skipOptimism": 0.4,
      "transitionHardness": 0.54,
      "overclaimRisk": 0.42,
      "traceBias": "balanced",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 33.94,
      "traceDiagnosis": 39.5,
      "recoveryOptScore": 35.84,
      "packIntegrity": 47.85,
      "ungatedScore": 23.08,
      "confidence": 30.35,
      "validatedContribution": 38.87,
      "ungatedContribution": 23.38,
      "overall": 40.08
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 11.98,
      "traceDiagnosis": 18.04,
      "recoveryOptScore": 14.31,
      "packIntegrity": 34.78,
      "ungatedScore": 46.72,
      "confidence": 20.5,
      "validatedContribution": 25.17,
      "ungatedContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "ct-007",
    "input": {
      "packCoverage": 0.45,
      "ruleFidelity": 0.38,
      "recoveryClarity": 0.42,
      "runStability": 0.49,
      "ungatedPassRate": 0.53,
      "skipOptimism": 0.42,
      "transitionHardness": 0.55,
      "overclaimRisk": 0.43,
      "traceBias": "recovery_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 31.59,
      "traceDiagnosis": 43.11,
      "recoveryOptScore": 48.37,
      "packIntegrity": 39.34,
      "ungatedScore": 25.15,
      "confidence": 33.6,
      "validatedContribution": 40.76,
      "ungatedContribution": 25.64,
      "overall": 42.04
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 8.27,
      "traceDiagnosis": 19.34,
      "recoveryOptScore": 15.59,
      "packIntegrity": 36.3,
      "ungatedScore": 34.2,
      "confidence": 22.15,
      "validatedContribution": 22.74,
      "ungatedContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "ct-008",
    "input": {
      "packCoverage": 0.41,
      "ruleFidelity": 0.43,
      "recoveryClarity": 0.46,
      "runStability": 0.45,
      "ungatedPassRate": 0.49,
      "skipOptimism": 0.43,
      "transitionHardness": 0.47,
      "overclaimRisk": 0.44,
      "traceBias": "ungated_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 19.33,
      "traceDiagnosis": 35.43,
      "recoveryOptScore": 27.62,
      "packIntegrity": 24.76,
      "ungatedScore": 24.32,
      "confidence": 34.35,
      "validatedContribution": 26.71,
      "ungatedContribution": 25.23,
      "overall": 27.44
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 16.4,
      "traceDiagnosis": 20.18,
      "recoveryOptScore": 16.31,
      "packIntegrity": 35.17,
      "ungatedScore": 58.5,
      "confidence": 22.7,
      "validatedContribution": 29.31,
      "ungatedContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "ct-009",
    "input": {
      "packCoverage": 0.46,
      "ruleFidelity": 0.41,
      "recoveryClarity": 0.5,
      "runStability": 0.49,
      "ungatedPassRate": 0.53,
      "skipOptimism": 0.39,
      "transitionHardness": 0.48,
      "overclaimRisk": 0.38,
      "traceBias": "balanced",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 40.05,
      "traceDiagnosis": 45.49,
      "recoveryOptScore": 45.68,
      "packIntegrity": 52.59,
      "ungatedScore": 25.81,
      "confidence": 37.35,
      "validatedContribution": 45.69,
      "ungatedContribution": 26.69,
      "overall": 46.27
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 14.91,
      "traceDiagnosis": 19.07,
      "recoveryOptScore": 15.29,
      "packIntegrity": 35.36,
      "ungatedScore": 48.88,
      "confidence": 22.7,
      "validatedContribution": 26.7,
      "ungatedContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "ct-010",
    "input": {
      "packCoverage": 0.5,
      "ruleFidelity": 0.45,
      "recoveryClarity": 0.46,
      "runStability": 0.53,
      "ungatedPassRate": 0.57,
      "skipOptimism": 0.4,
      "transitionHardness": 0.49,
      "overclaimRisk": 0.39,
      "traceBias": "trace_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 36.62,
      "traceDiagnosis": 49.14,
      "recoveryOptScore": 30.65,
      "packIntegrity": 66.82,
      "ungatedScore": 28.29,
      "confidence": 39,
      "validatedContribution": 44.6,
      "ungatedContribution": 29.32,
      "overall": 45.85
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 3.59,
      "traceDiagnosis": 20.18,
      "recoveryOptScore": 16.7,
      "packIntegrity": 37.06,
      "ungatedScore": 35.54,
      "confidence": 24.25,
      "validatedContribution": 22.61,
      "ungatedContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "ct-011",
    "input": {
      "packCoverage": 0.54,
      "ruleFidelity": 0.49,
      "recoveryClarity": 0.49,
      "runStability": 0.57,
      "ungatedPassRate": 0.6,
      "skipOptimism": 0.42,
      "transitionHardness": 0.49,
      "overclaimRisk": 0.4,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 47.21,
      "traceDiagnosis": 52.75,
      "recoveryOptScore": 47.19,
      "packIntegrity": 60.27,
      "ungatedScore": 30.54,
      "confidence": 42.25,
      "validatedContribution": 51.41,
      "ungatedContribution": 31.82,
      "overall": 51.88
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 17.1,
      "traceDiagnosis": 21.62,
      "recoveryOptScore": 18.14,
      "packIntegrity": 38.58,
      "ungatedScore": 54.12,
      "confidence": 26.1,
      "validatedContribution": 29.91,
      "ungatedContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "ct-012",
    "input": {
      "packCoverage": 0.5,
      "ruleFidelity": 0.48,
      "recoveryClarity": 0.53,
      "runStability": 0.53,
      "ungatedPassRate": 0.56,
      "skipOptimism": 0.37,
      "transitionHardness": 0.42,
      "overclaimRisk": 0.35,
      "traceBias": "recovery_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 38.19,
      "traceDiagnosis": 51.28,
      "recoveryOptScore": 61.94,
      "packIntegrity": 43.82,
      "ungatedScore": 28.34,
      "confidence": 42.1,
      "validatedContribution": 49.22,
      "ungatedContribution": 29.7,
      "overall": 49.71
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 13.23,
      "traceDiagnosis": 19.68,
      "recoveryOptScore": 16.17,
      "packIntegrity": 35.76,
      "ungatedScore": 34.93,
      "confidence": 24.35,
      "validatedContribution": 23.95,
      "ungatedContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "ct-013",
    "input": {
      "packCoverage": 0.54,
      "ruleFidelity": 0.52,
      "recoveryClarity": 0.56,
      "runStability": 0.57,
      "ungatedPassRate": 0.6,
      "skipOptimism": 0.39,
      "transitionHardness": 0.42,
      "overclaimRisk": 0.36,
      "traceBias": "ungated_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 29.13,
      "traceDiagnosis": 44.88,
      "recoveryOptScore": 36.59,
      "packIntegrity": 32.66,
      "ungatedScore": 31.2,
      "confidence": 45.35,
      "validatedContribution": 35.78,
      "ungatedContribution": 32.8,
      "overall": 36.24
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 22.62,
      "traceDiagnosis": 21.35,
      "recoveryOptScore": 17.8,
      "packIntegrity": 37.74,
      "ungatedScore": 67.02,
      "confidence": 26.55,
      "validatedContribution": 33.31,
      "ungatedContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "ct-014",
    "input": {
      "packCoverage": 0.58,
      "ruleFidelity": 0.56,
      "recoveryClarity": 0.6,
      "runStability": 0.61,
      "ungatedPassRate": 0.63,
      "skipOptimism": 0.4,
      "transitionHardness": 0.43,
      "overclaimRisk": 0.36,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 52.62,
      "traceDiagnosis": 58.53,
      "recoveryOptScore": 56.66,
      "packIntegrity": 64.86,
      "ungatedScore": 33.07,
      "confidence": 49,
      "validatedContribution": 57.86,
      "ungatedContribution": 34.8,
      "overall": 57.71
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 20.03,
      "traceDiagnosis": 22.2,
      "recoveryOptScore": 18.59,
      "packIntegrity": 38.98,
      "ungatedScore": 55.96,
      "confidence": 27.85,
      "validatedContribution": 31.15,
      "ungatedContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "ct-015",
    "input": {
      "packCoverage": 0.62,
      "ruleFidelity": 0.54,
      "recoveryClarity": 0.56,
      "runStability": 0.65,
      "ungatedPassRate": 0.67,
      "skipOptimism": 0.36,
      "transitionHardness": 0.44,
      "overclaimRisk": 0.31,
      "traceBias": "trace_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 45.9,
      "traceDiagnosis": 58.35,
      "recoveryOptScore": 39.3,
      "packIntegrity": 79.94,
      "ungatedScore": 34.55,
      "confidence": 49.6,
      "validatedContribution": 54.53,
      "ungatedContribution": 36.22,
      "overall": 55.23
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 9.43,
      "traceDiagnosis": 21.14,
      "recoveryOptScore": 17.93,
      "packIntegrity": 39.27,
      "ungatedScore": 38.2,
      "confidence": 27.75,
      "validatedContribution": 25.19,
      "ungatedContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "ct-016",
    "input": {
      "packCoverage": 0.58,
      "ruleFidelity": 0.59,
      "recoveryClarity": 0.6,
      "runStability": 0.6,
      "ungatedPassRate": 0.63,
      "skipOptimism": 0.37,
      "transitionHardness": 0.36,
      "overclaimRisk": 0.32,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 54.46,
      "traceDiagnosis": 60.67,
      "recoveryOptScore": 57.87,
      "packIntegrity": 65.05,
      "ungatedScore": 33.73,
      "confidence": 50.35,
      "validatedContribution": 59.24,
      "ungatedContribution": 35.76,
      "overall": 59.01
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 22.05,
      "traceDiagnosis": 21.91,
      "recoveryOptScore": 18.56,
      "packIntegrity": 38.14,
      "ungatedScore": 55.7,
      "confidence": 28.3,
      "validatedContribution": 31.27,
      "ungatedContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "ct-017",
    "input": {
      "packCoverage": 0.62,
      "ruleFidelity": 0.63,
      "recoveryClarity": 0.63,
      "runStability": 0.64,
      "ungatedPassRate": 0.67,
      "skipOptimism": 0.39,
      "transitionHardness": 0.37,
      "overclaimRisk": 0.33,
      "traceBias": "recovery_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 48.43,
      "traceDiagnosis": 64.28,
      "recoveryOptScore": 75.13,
      "packIntegrity": 52.76,
      "ungatedScore": 36.41,
      "confidence": 53.6,
      "validatedContribution": 60.66,
      "ungatedContribution": 38.61,
      "overall": 60.69
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 18.73,
      "traceDiagnosis": 23.42,
      "recoveryOptScore": 20,
      "packIntegrity": 40.11,
      "ungatedScore": 39.86,
      "confidence": 30.3,
      "validatedContribution": 28.42,
      "ungatedContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "ct-018",
    "input": {
      "packCoverage": 0.66,
      "ruleFidelity": 0.61,
      "recoveryClarity": 0.67,
      "runStability": 0.68,
      "ungatedPassRate": 0.7,
      "skipOptimism": 0.34,
      "transitionHardness": 0.38,
      "overclaimRisk": 0.27,
      "traceBias": "ungated_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 38.33,
      "traceDiagnosis": 54.13,
      "recoveryOptScore": 45.52,
      "packIntegrity": 40.09,
      "ungatedScore": 37.08,
      "confidence": 56.35,
      "validatedContribution": 44.52,
      "ungatedContribution": 39.16,
      "overall": 44.56
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 28.36,
      "traceDiagnosis": 21.66,
      "recoveryOptScore": 18.31,
      "packIntegrity": 39.67,
      "ungatedScore": 74.27,
      "confidence": 29.5,
      "validatedContribution": 36.45,
      "ungatedContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "ct-019",
    "input": {
      "packCoverage": 0.7,
      "ruleFidelity": 0.65,
      "recoveryClarity": 0.7,
      "runStability": 0.72,
      "ungatedPassRate": 0.74,
      "skipOptimism": 0.36,
      "transitionHardness": 0.38,
      "overclaimRisk": 0.28,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 63.81,
      "traceDiagnosis": 67.74,
      "recoveryOptScore": 68.17,
      "packIntegrity": 75.07,
      "ungatedScore": 39.94,
      "confidence": 59.6,
      "validatedContribution": 68.45,
      "ungatedContribution": 42.25,
      "overall": 67.73
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 26.25,
      "traceDiagnosis": 23.32,
      "recoveryOptScore": 19.92,
      "packIntegrity": 41.65,
      "ungatedScore": 62.07,
      "confidence": 31.7,
      "validatedContribution": 34.64,
      "ungatedContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "ct-020",
    "input": {
      "packCoverage": 0.66,
      "ruleFidelity": 0.7,
      "recoveryClarity": 0.66,
      "runStability": 0.68,
      "ungatedPassRate": 0.7,
      "skipOptimism": 0.37,
      "transitionHardness": 0.31,
      "overclaimRisk": 0.29,
      "traceBias": "trace_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 52.86,
      "traceDiagnosis": 70.06,
      "recoveryOptScore": 45.74,
      "packIntegrity": 86.81,
      "ungatedScore": 38.94,
      "confidence": 58.35,
      "validatedContribution": 62.46,
      "ungatedContribution": 41.54,
      "overall": 62.69
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 13.66,
      "traceDiagnosis": 23.93,
      "recoveryOptScore": 20.75,
      "packIntegrity": 40.51,
      "ungatedScore": 40.86,
      "confidence": 32.05,
      "validatedContribution": 27.94,
      "ungatedContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "ct-021",
    "input": {
      "packCoverage": 0.7,
      "ruleFidelity": 0.68,
      "recoveryClarity": 0.7,
      "runStability": 0.72,
      "ungatedPassRate": 0.73,
      "skipOptimism": 0.33,
      "transitionHardness": 0.31,
      "overclaimRisk": 0.24,
      "traceBias": "balanced",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 65.6,
      "traceDiagnosis": 69.88,
      "recoveryOptScore": 69.32,
      "packIntegrity": 75.82,
      "ungatedScore": 39.99,
      "confidence": 60.95,
      "validatedContribution": 69.92,
      "ungatedContribution": 42.54,
      "overall": 68.99
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 27.89,
      "traceDiagnosis": 22.72,
      "recoveryOptScore": 19.62,
      "packIntegrity": 40.35,
      "ungatedScore": 61.19,
      "confidence": 31.8,
      "validatedContribution": 34.35,
      "ungatedContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "ct-022",
    "input": {
      "packCoverage": 0.74,
      "ruleFidelity": 0.72,
      "recoveryClarity": 0.73,
      "runStability": 0.76,
      "ungatedPassRate": 0.77,
      "skipOptimism": 0.34,
      "transitionHardness": 0.32,
      "overclaimRisk": 0.25,
      "traceBias": "recovery_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 57.62,
      "traceDiagnosis": 73.52,
      "recoveryOptScore": 88.86,
      "packIntegrity": 60.51,
      "ungatedScore": 42.47,
      "confidence": 64.35,
      "validatedContribution": 70.82,
      "ungatedContribution": 45.15,
      "overall": 70.2
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 24.57,
      "traceDiagnosis": 23.79,
      "recoveryOptScore": 20.63,
      "packIntegrity": 42.05,
      "ungatedScore": 42.21,
      "confidence": 33.35,
      "validatedContribution": 30.65,
      "ungatedContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "ct-023",
    "input": {
      "packCoverage": 0.79,
      "ruleFidelity": 0.76,
      "recoveryClarity": 0.77,
      "runStability": 0.8,
      "ungatedPassRate": 0.81,
      "skipOptimism": 0.36,
      "transitionHardness": 0.33,
      "overclaimRisk": 0.25,
      "traceBias": "ungated_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 49.04,
      "traceDiagnosis": 67.38,
      "recoveryOptScore": 53.74,
      "packIntegrity": 49.49,
      "ungatedScore": 45.16,
      "confidence": 68.25,
      "validatedContribution": 54.86,
      "ungatedContribution": 48.03,
      "overall": 54.63
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 33.86,
      "traceDiagnosis": 25.25,
      "recoveryOptScore": 22.05,
      "packIntegrity": 43.92,
      "ungatedScore": 84.72,
      "confidence": 35.45,
      "validatedContribution": 41.96,
      "ungatedContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "ct-024",
    "input": {
      "packCoverage": 0.75,
      "ruleFidelity": 0.75,
      "recoveryClarity": 0.81,
      "runStability": 0.76,
      "ungatedPassRate": 0.77,
      "skipOptimism": 0.31,
      "transitionHardness": 0.25,
      "overclaimRisk": 0.2,
      "traceBias": "balanced",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 71.55,
      "traceDiagnosis": 75.91,
      "recoveryOptScore": 78.99,
      "packIntegrity": 80.56,
      "ungatedScore": 43.13,
      "confidence": 68.1,
      "validatedContribution": 76.66,
      "ungatedContribution": 46.07,
      "overall": 75.15
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 31.21,
      "traceDiagnosis": 23.36,
      "recoveryOptScore": 20.13,
      "packIntegrity": 41.11,
      "ungatedScore": 63.65,
      "confidence": 33.9,
      "validatedContribution": 35.89,
      "ungatedContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "ct-025",
    "input": {
      "packCoverage": 0.79,
      "ruleFidelity": 0.79,
      "recoveryClarity": 0.77,
      "runStability": 0.8,
      "ungatedPassRate": 0.8,
      "skipOptimism": 0.33,
      "transitionHardness": 0.26,
      "overclaimRisk": 0.21,
      "traceBias": "trace_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 62.51,
      "traceDiagnosis": 79.52,
      "recoveryOptScore": 54.86,
      "packIntegrity": 100,
      "ungatedScore": 45.2,
      "confidence": 69.6,
      "validatedContribution": 72.7,
      "ungatedContribution": 48.27,
      "overall": 72.3
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 19.5,
      "traceDiagnosis": 24.6,
      "recoveryOptScore": 21.69,
      "packIntegrity": 42.63,
      "ungatedScore": 43.52,
      "confidence": 35.55,
      "validatedContribution": 30.39,
      "ungatedContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "ct-026",
    "input": {
      "packCoverage": 0.83,
      "ruleFidelity": 0.83,
      "recoveryClarity": 0.8,
      "runStability": 0.83,
      "ungatedPassRate": 0.84,
      "skipOptimism": 0.34,
      "transitionHardness": 0.27,
      "overclaimRisk": 0.22,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 78.52,
      "traceDiagnosis": 83.17,
      "recoveryOptScore": 80.3,
      "packIntegrity": 87.68,
      "ungatedScore": 47.68,
      "confidence": 73,
      "validatedContribution": 82.15,
      "ungatedContribution": 50.87,
      "overall": 80.52
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 33.17,
      "traceDiagnosis": 25.67,
      "recoveryOptScore": 22.7,
      "packIntegrity": 44.32,
      "ungatedScore": 68.8,
      "confidence": 37.1,
      "validatedContribution": 38.93,
      "ungatedContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "ct-027",
    "input": {
      "packCoverage": 0.87,
      "ruleFidelity": 0.81,
      "recoveryClarity": 0.84,
      "runStability": 0.87,
      "ungatedPassRate": 0.88,
      "skipOptimism": 0.3,
      "transitionHardness": 0.27,
      "overclaimRisk": 0.17,
      "traceBias": "recovery_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 67.26,
      "traceDiagnosis": 82.98,
      "recoveryOptScore": 100,
      "packIntegrity": 68.1,
      "ungatedScore": 49.35,
      "confidence": 75.6,
      "validatedContribution": 80.38,
      "ungatedContribution": 52.5,
      "overall": 79.36
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 30.78,
      "traceDiagnosis": 24.7,
      "recoveryOptScore": 21.75,
      "packIntegrity": 44.62,
      "ungatedScore": 45.22,
      "confidence": 37.2,
      "validatedContribution": 33.41,
      "ungatedContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "ct-028",
    "input": {
      "packCoverage": 0.83,
      "ruleFidelity": 0.86,
      "recoveryClarity": 0.87,
      "runStability": 0.83,
      "ungatedPassRate": 0.84,
      "skipOptimism": 0.31,
      "transitionHardness": 0.2,
      "overclaimRisk": 0.17,
      "traceBias": "ungated_first",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 54.87,
      "traceDiagnosis": 75.3,
      "recoveryOptScore": 60.62,
      "packIntegrity": 53.51,
      "ungatedScore": 48.34,
      "confidence": 76.1,
      "validatedContribution": 61.08,
      "ungatedContribution": 51.73,
      "overall": 60.4
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 38.81,
      "traceDiagnosis": 25.25,
      "recoveryOptScore": 22.17,
      "packIntegrity": 43.48,
      "ungatedScore": 86.95,
      "confidence": 37.65,
      "validatedContribution": 43.33,
      "ungatedContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "ct-029",
    "input": {
      "packCoverage": 0.87,
      "ruleFidelity": 0.9,
      "recoveryClarity": 0.91,
      "runStability": 0.87,
      "ungatedPassRate": 0.87,
      "skipOptimism": 0.33,
      "transitionHardness": 0.2,
      "overclaimRisk": 0.18,
      "traceBias": "balanced",
      "profile": "typed_trace_validated"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 83.89,
      "traceDiagnosis": 88.91,
      "recoveryOptScore": 89.72,
      "packIntegrity": 92.27,
      "ungatedScore": 50.59,
      "confidence": 79.6,
      "validatedContribution": 88.57,
      "ungatedContribution": 54.16,
      "overall": 86.38
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 36.33,
      "traceDiagnosis": 26.6,
      "recoveryOptScore": 23.46,
      "packIntegrity": 45,
      "ungatedScore": 71.06,
      "confidence": 39.5,
      "validatedContribution": 40.49,
      "ungatedContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "ct-030",
    "input": {
      "packCoverage": 0.91,
      "ruleFidelity": 0.88,
      "recoveryClarity": 0.87,
      "runStability": 0.91,
      "ungatedPassRate": 0.91,
      "skipOptimism": 0.28,
      "transitionHardness": 0.21,
      "overclaimRisk": 0.13,
      "traceBias": "trace_first",
      "profile": "ungated_agent"
    },
    "expectedTypedTraceValidated": {
      "mode": "typed_trace_validated",
      "ruleCoverage": 71.59,
      "traceDiagnosis": 88.77,
      "recoveryOptScore": 63.26,
      "packIntegrity": 100,
      "ungatedScore": 51.88,
      "confidence": 80.35,
      "validatedContribution": 79.63,
      "ungatedContribution": 55.31,
      "overall": 79.25
    },
    "expectedUngatedAgent": {
      "mode": "ungated_agent",
      "ruleCoverage": 25.72,
      "traceDiagnosis": 25.06,
      "recoveryOptScore": 22.34,
      "packIntegrity": 45.02,
      "ungatedScore": 46.21,
      "confidence": 38.95,
      "validatedContribution": 32.87,
      "ungatedContribution": 50.68,
      "overall": 44.3
    }
  }
];
