import type { ScriptLexiconInput, ScriptLexiconQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ScriptLexiconInput;
  expectedExpandedGeezLexicon: ScriptLexiconQuality;
  expectedBaselineMultilingual: ScriptLexiconQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sls-001",
    "input": {
      "lexiconCoverage": 0.29,
      "expansionFidelity": 0.25,
      "scriptFit": 0.28,
      "subwordAgreement": 0.34,
      "baselineAccuracy": 0.39,
      "multilingualOptimism": 0.45,
      "morphologyHardness": 0.59,
      "leakageRisk": 0.5,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 22.56,
      "expansionDiagnosis": 30.25,
      "scriptReasonScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "lexiconContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 5.76,
      "expansionDiagnosis": 17.09,
      "scriptReasonScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "lexiconContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "sls-002",
    "input": {
      "lexiconCoverage": 0.33,
      "expansionFidelity": 0.29,
      "scriptFit": 0.32,
      "subwordAgreement": 0.38,
      "baselineAccuracy": 0.43,
      "multilingualOptimism": 0.46,
      "morphologyHardness": 0.6,
      "leakageRisk": 0.51,
      "lexiconBias": "lexicon_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 22.22,
      "expansionDiagnosis": 33.9,
      "scriptReasonScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "lexiconContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 2.43,
      "expansionDiagnosis": 18.22,
      "scriptReasonScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "lexiconContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "sls-003",
    "input": {
      "lexiconCoverage": 0.37,
      "expansionFidelity": 0.27,
      "scriptFit": 0.36,
      "subwordAgreement": 0.42,
      "baselineAccuracy": 0.46,
      "multilingualOptimism": 0.42,
      "morphologyHardness": 0.6,
      "leakageRisk": 0.46,
      "lexiconBias": "baseline_first",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 12.18,
      "expansionDiagnosis": 23.71,
      "scriptReasonScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "lexiconContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 12.17,
      "expansionDiagnosis": 17.1,
      "scriptReasonScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "lexiconContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "sls-004",
    "input": {
      "lexiconCoverage": 0.33,
      "expansionFidelity": 0.32,
      "scriptFit": 0.39,
      "subwordAgreement": 0.38,
      "baselineAccuracy": 0.42,
      "multilingualOptimism": 0.43,
      "morphologyHardness": 0.53,
      "leakageRisk": 0.46,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 28.09,
      "expansionDiagnosis": 36.03,
      "scriptReasonScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "lexiconContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 8.7,
      "expansionDiagnosis": 17.81,
      "scriptReasonScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "lexiconContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "sls-005",
    "input": {
      "lexiconCoverage": 0.37,
      "expansionFidelity": 0.36,
      "scriptFit": 0.35,
      "subwordAgreement": 0.42,
      "baselineAccuracy": 0.46,
      "multilingualOptimism": 0.45,
      "morphologyHardness": 0.53,
      "leakageRisk": 0.47,
      "lexiconBias": "script_strict",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 26.86,
      "expansionDiagnosis": 39.64,
      "scriptReasonScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "lexiconContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 0,
      "expansionDiagnosis": 19.51,
      "scriptReasonScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "lexiconContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "sls-006",
    "input": {
      "lexiconCoverage": 0.41,
      "expansionFidelity": 0.34,
      "scriptFit": 0.39,
      "subwordAgreement": 0.45,
      "baselineAccuracy": 0.5,
      "multilingualOptimism": 0.4,
      "morphologyHardness": 0.54,
      "leakageRisk": 0.42,
      "lexiconBias": "balanced",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 33.94,
      "expansionDiagnosis": 39.5,
      "scriptReasonScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "lexiconContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 11.98,
      "expansionDiagnosis": 18.04,
      "scriptReasonScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "lexiconContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "sls-007",
    "input": {
      "lexiconCoverage": 0.45,
      "expansionFidelity": 0.38,
      "scriptFit": 0.42,
      "subwordAgreement": 0.49,
      "baselineAccuracy": 0.53,
      "multilingualOptimism": 0.42,
      "morphologyHardness": 0.55,
      "leakageRisk": 0.43,
      "lexiconBias": "lexicon_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 31.59,
      "expansionDiagnosis": 43.11,
      "scriptReasonScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "lexiconContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 8.27,
      "expansionDiagnosis": 19.34,
      "scriptReasonScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "lexiconContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "sls-008",
    "input": {
      "lexiconCoverage": 0.41,
      "expansionFidelity": 0.43,
      "scriptFit": 0.46,
      "subwordAgreement": 0.45,
      "baselineAccuracy": 0.49,
      "multilingualOptimism": 0.43,
      "morphologyHardness": 0.47,
      "leakageRisk": 0.44,
      "lexiconBias": "baseline_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 19.33,
      "expansionDiagnosis": 35.43,
      "scriptReasonScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "lexiconContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 16.4,
      "expansionDiagnosis": 20.18,
      "scriptReasonScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "lexiconContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "sls-009",
    "input": {
      "lexiconCoverage": 0.46,
      "expansionFidelity": 0.41,
      "scriptFit": 0.5,
      "subwordAgreement": 0.49,
      "baselineAccuracy": 0.53,
      "multilingualOptimism": 0.39,
      "morphologyHardness": 0.48,
      "leakageRisk": 0.38,
      "lexiconBias": "balanced",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 40.05,
      "expansionDiagnosis": 45.49,
      "scriptReasonScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "lexiconContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 14.91,
      "expansionDiagnosis": 19.07,
      "scriptReasonScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "lexiconContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "sls-010",
    "input": {
      "lexiconCoverage": 0.5,
      "expansionFidelity": 0.45,
      "scriptFit": 0.46,
      "subwordAgreement": 0.53,
      "baselineAccuracy": 0.57,
      "multilingualOptimism": 0.4,
      "morphologyHardness": 0.49,
      "leakageRisk": 0.39,
      "lexiconBias": "script_strict",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 36.62,
      "expansionDiagnosis": 49.14,
      "scriptReasonScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "lexiconContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 3.59,
      "expansionDiagnosis": 20.18,
      "scriptReasonScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "lexiconContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "sls-011",
    "input": {
      "lexiconCoverage": 0.54,
      "expansionFidelity": 0.49,
      "scriptFit": 0.49,
      "subwordAgreement": 0.57,
      "baselineAccuracy": 0.6,
      "multilingualOptimism": 0.42,
      "morphologyHardness": 0.49,
      "leakageRisk": 0.4,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 47.21,
      "expansionDiagnosis": 52.75,
      "scriptReasonScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "lexiconContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 17.1,
      "expansionDiagnosis": 21.62,
      "scriptReasonScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "lexiconContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "sls-012",
    "input": {
      "lexiconCoverage": 0.5,
      "expansionFidelity": 0.48,
      "scriptFit": 0.53,
      "subwordAgreement": 0.53,
      "baselineAccuracy": 0.56,
      "multilingualOptimism": 0.37,
      "morphologyHardness": 0.42,
      "leakageRisk": 0.35,
      "lexiconBias": "lexicon_first",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 38.19,
      "expansionDiagnosis": 51.28,
      "scriptReasonScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "lexiconContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 13.23,
      "expansionDiagnosis": 19.68,
      "scriptReasonScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "lexiconContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "sls-013",
    "input": {
      "lexiconCoverage": 0.54,
      "expansionFidelity": 0.52,
      "scriptFit": 0.56,
      "subwordAgreement": 0.57,
      "baselineAccuracy": 0.6,
      "multilingualOptimism": 0.39,
      "morphologyHardness": 0.42,
      "leakageRisk": 0.36,
      "lexiconBias": "baseline_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 29.13,
      "expansionDiagnosis": 44.88,
      "scriptReasonScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "lexiconContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 22.62,
      "expansionDiagnosis": 21.35,
      "scriptReasonScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "lexiconContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "sls-014",
    "input": {
      "lexiconCoverage": 0.58,
      "expansionFidelity": 0.56,
      "scriptFit": 0.6,
      "subwordAgreement": 0.61,
      "baselineAccuracy": 0.63,
      "multilingualOptimism": 0.4,
      "morphologyHardness": 0.43,
      "leakageRisk": 0.36,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 52.62,
      "expansionDiagnosis": 58.53,
      "scriptReasonScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "lexiconContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 20.03,
      "expansionDiagnosis": 22.2,
      "scriptReasonScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "lexiconContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "sls-015",
    "input": {
      "lexiconCoverage": 0.62,
      "expansionFidelity": 0.54,
      "scriptFit": 0.56,
      "subwordAgreement": 0.65,
      "baselineAccuracy": 0.67,
      "multilingualOptimism": 0.36,
      "morphologyHardness": 0.44,
      "leakageRisk": 0.31,
      "lexiconBias": "script_strict",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 45.9,
      "expansionDiagnosis": 58.35,
      "scriptReasonScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "lexiconContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 9.43,
      "expansionDiagnosis": 21.14,
      "scriptReasonScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "lexiconContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "sls-016",
    "input": {
      "lexiconCoverage": 0.58,
      "expansionFidelity": 0.59,
      "scriptFit": 0.6,
      "subwordAgreement": 0.6,
      "baselineAccuracy": 0.63,
      "multilingualOptimism": 0.37,
      "morphologyHardness": 0.36,
      "leakageRisk": 0.32,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 54.46,
      "expansionDiagnosis": 60.67,
      "scriptReasonScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "lexiconContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 22.05,
      "expansionDiagnosis": 21.91,
      "scriptReasonScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "lexiconContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "sls-017",
    "input": {
      "lexiconCoverage": 0.62,
      "expansionFidelity": 0.63,
      "scriptFit": 0.63,
      "subwordAgreement": 0.64,
      "baselineAccuracy": 0.67,
      "multilingualOptimism": 0.39,
      "morphologyHardness": 0.37,
      "leakageRisk": 0.33,
      "lexiconBias": "lexicon_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 48.43,
      "expansionDiagnosis": 64.28,
      "scriptReasonScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "lexiconContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 18.73,
      "expansionDiagnosis": 23.42,
      "scriptReasonScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "lexiconContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "sls-018",
    "input": {
      "lexiconCoverage": 0.66,
      "expansionFidelity": 0.61,
      "scriptFit": 0.67,
      "subwordAgreement": 0.68,
      "baselineAccuracy": 0.7,
      "multilingualOptimism": 0.34,
      "morphologyHardness": 0.38,
      "leakageRisk": 0.27,
      "lexiconBias": "baseline_first",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 38.33,
      "expansionDiagnosis": 54.13,
      "scriptReasonScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "lexiconContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 28.36,
      "expansionDiagnosis": 21.66,
      "scriptReasonScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "lexiconContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "sls-019",
    "input": {
      "lexiconCoverage": 0.7,
      "expansionFidelity": 0.65,
      "scriptFit": 0.7,
      "subwordAgreement": 0.72,
      "baselineAccuracy": 0.74,
      "multilingualOptimism": 0.36,
      "morphologyHardness": 0.38,
      "leakageRisk": 0.28,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 63.81,
      "expansionDiagnosis": 67.74,
      "scriptReasonScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "lexiconContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 26.25,
      "expansionDiagnosis": 23.32,
      "scriptReasonScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "lexiconContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "sls-020",
    "input": {
      "lexiconCoverage": 0.66,
      "expansionFidelity": 0.7,
      "scriptFit": 0.66,
      "subwordAgreement": 0.68,
      "baselineAccuracy": 0.7,
      "multilingualOptimism": 0.37,
      "morphologyHardness": 0.31,
      "leakageRisk": 0.29,
      "lexiconBias": "script_strict",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 52.86,
      "expansionDiagnosis": 70.06,
      "scriptReasonScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "lexiconContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 13.66,
      "expansionDiagnosis": 23.93,
      "scriptReasonScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "lexiconContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "sls-021",
    "input": {
      "lexiconCoverage": 0.7,
      "expansionFidelity": 0.68,
      "scriptFit": 0.7,
      "subwordAgreement": 0.72,
      "baselineAccuracy": 0.73,
      "multilingualOptimism": 0.33,
      "morphologyHardness": 0.31,
      "leakageRisk": 0.24,
      "lexiconBias": "balanced",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 65.6,
      "expansionDiagnosis": 69.88,
      "scriptReasonScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "lexiconContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 27.89,
      "expansionDiagnosis": 22.72,
      "scriptReasonScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "lexiconContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "sls-022",
    "input": {
      "lexiconCoverage": 0.74,
      "expansionFidelity": 0.72,
      "scriptFit": 0.73,
      "subwordAgreement": 0.76,
      "baselineAccuracy": 0.77,
      "multilingualOptimism": 0.34,
      "morphologyHardness": 0.32,
      "leakageRisk": 0.25,
      "lexiconBias": "lexicon_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 57.62,
      "expansionDiagnosis": 73.52,
      "scriptReasonScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "lexiconContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 24.57,
      "expansionDiagnosis": 23.79,
      "scriptReasonScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "lexiconContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "sls-023",
    "input": {
      "lexiconCoverage": 0.79,
      "expansionFidelity": 0.76,
      "scriptFit": 0.77,
      "subwordAgreement": 0.8,
      "baselineAccuracy": 0.81,
      "multilingualOptimism": 0.36,
      "morphologyHardness": 0.33,
      "leakageRisk": 0.25,
      "lexiconBias": "baseline_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 49.04,
      "expansionDiagnosis": 67.38,
      "scriptReasonScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "lexiconContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 33.86,
      "expansionDiagnosis": 25.25,
      "scriptReasonScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "lexiconContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "sls-024",
    "input": {
      "lexiconCoverage": 0.75,
      "expansionFidelity": 0.75,
      "scriptFit": 0.81,
      "subwordAgreement": 0.76,
      "baselineAccuracy": 0.77,
      "multilingualOptimism": 0.31,
      "morphologyHardness": 0.25,
      "leakageRisk": 0.2,
      "lexiconBias": "balanced",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 71.55,
      "expansionDiagnosis": 75.91,
      "scriptReasonScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "lexiconContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 31.21,
      "expansionDiagnosis": 23.36,
      "scriptReasonScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "lexiconContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "sls-025",
    "input": {
      "lexiconCoverage": 0.79,
      "expansionFidelity": 0.79,
      "scriptFit": 0.77,
      "subwordAgreement": 0.8,
      "baselineAccuracy": 0.8,
      "multilingualOptimism": 0.33,
      "morphologyHardness": 0.26,
      "leakageRisk": 0.21,
      "lexiconBias": "script_strict",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 62.51,
      "expansionDiagnosis": 79.52,
      "scriptReasonScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "lexiconContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 19.5,
      "expansionDiagnosis": 24.6,
      "scriptReasonScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "lexiconContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "sls-026",
    "input": {
      "lexiconCoverage": 0.83,
      "expansionFidelity": 0.83,
      "scriptFit": 0.8,
      "subwordAgreement": 0.83,
      "baselineAccuracy": 0.84,
      "multilingualOptimism": 0.34,
      "morphologyHardness": 0.27,
      "leakageRisk": 0.22,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 78.52,
      "expansionDiagnosis": 83.17,
      "scriptReasonScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "lexiconContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 33.17,
      "expansionDiagnosis": 25.67,
      "scriptReasonScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "lexiconContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "sls-027",
    "input": {
      "lexiconCoverage": 0.87,
      "expansionFidelity": 0.81,
      "scriptFit": 0.84,
      "subwordAgreement": 0.87,
      "baselineAccuracy": 0.88,
      "multilingualOptimism": 0.3,
      "morphologyHardness": 0.27,
      "leakageRisk": 0.17,
      "lexiconBias": "lexicon_first",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 67.26,
      "expansionDiagnosis": 82.98,
      "scriptReasonScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "lexiconContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 30.78,
      "expansionDiagnosis": 24.7,
      "scriptReasonScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "lexiconContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "sls-028",
    "input": {
      "lexiconCoverage": 0.83,
      "expansionFidelity": 0.86,
      "scriptFit": 0.87,
      "subwordAgreement": 0.83,
      "baselineAccuracy": 0.84,
      "multilingualOptimism": 0.31,
      "morphologyHardness": 0.2,
      "leakageRisk": 0.17,
      "lexiconBias": "baseline_first",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 54.87,
      "expansionDiagnosis": 75.3,
      "scriptReasonScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "lexiconContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 38.81,
      "expansionDiagnosis": 25.25,
      "scriptReasonScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "lexiconContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "sls-029",
    "input": {
      "lexiconCoverage": 0.87,
      "expansionFidelity": 0.9,
      "scriptFit": 0.91,
      "subwordAgreement": 0.87,
      "baselineAccuracy": 0.87,
      "multilingualOptimism": 0.33,
      "morphologyHardness": 0.2,
      "leakageRisk": 0.18,
      "lexiconBias": "balanced",
      "profile": "expanded_geez_lexicon"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 83.89,
      "expansionDiagnosis": 88.91,
      "scriptReasonScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "lexiconContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 36.33,
      "expansionDiagnosis": 26.6,
      "scriptReasonScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "lexiconContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "sls-030",
    "input": {
      "lexiconCoverage": 0.91,
      "expansionFidelity": 0.88,
      "scriptFit": 0.87,
      "subwordAgreement": 0.91,
      "baselineAccuracy": 0.91,
      "multilingualOptimism": 0.28,
      "morphologyHardness": 0.21,
      "leakageRisk": 0.13,
      "lexiconBias": "script_strict",
      "profile": "baseline_multilingual"
    },
    "expectedExpandedGeezLexicon": {
      "mode": "expanded_geez_lexicon",
      "coverageDiagnosis": 71.59,
      "expansionDiagnosis": 88.77,
      "scriptReasonScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "lexiconContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedBaselineMultilingual": {
      "mode": "baseline_multilingual",
      "coverageDiagnosis": 25.72,
      "expansionDiagnosis": 25.06,
      "scriptReasonScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "lexiconContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
