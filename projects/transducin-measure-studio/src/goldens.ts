import type { MeasureInput, MeasureQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MeasureInput;
  expectedSnomedCoded: MeasureQuality;
  expectedPrivateTagBaseline: MeasureQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tm-001",
    "input": {
      "measureCoverage": 0.29,
      "parseFidelity": 0.25,
      "snomedClarity": 0.28,
      "exportStability": 0.34,
      "privateTagRate": 0.39,
      "privateTagOptimism": 0.45,
      "formatHardness": 0.59,
      "overclaimRisk": 0.5,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 22.56,
      "parseScore": 30.25,
      "snomedScore": 23.49,
      "exportIntegrity": 37.64,
      "privateTagBaselineScore": 16.4,
      "confidence": 19.35,
      "snomedCodedContribution": 27.98,
      "privateTagContribution": 15.96,
      "overall": 29.82
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 5.76,
      "parseScore": 17.09,
      "snomedScore": 13.13,
      "exportIntegrity": 32.39,
      "privateTagBaselineScore": 40.93,
      "confidence": 17.1,
      "snomedCodedContribution": 21.86,
      "privateTagContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "tm-002",
    "input": {
      "measureCoverage": 0.33,
      "parseFidelity": 0.29,
      "snomedClarity": 0.32,
      "exportStability": 0.38,
      "privateTagRate": 0.43,
      "privateTagOptimism": 0.46,
      "formatHardness": 0.6,
      "overclaimRisk": 0.51,
      "measureBias": "export_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 22.22,
      "parseScore": 33.9,
      "snomedScore": 17.76,
      "exportIntegrity": 48.93,
      "privateTagBaselineScore": 18.89,
      "confidence": 23,
      "snomedCodedContribution": 29.65,
      "privateTagContribution": 18.61,
      "overall": 31.66
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 2.43,
      "parseScore": 18.22,
      "snomedScore": 14.16,
      "exportIntegrity": 34.08,
      "privateTagBaselineScore": 31.53,
      "confidence": 18.65,
      "snomedCodedContribution": 20.08,
      "privateTagContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "tm-003",
    "input": {
      "measureCoverage": 0.37,
      "parseFidelity": 0.27,
      "snomedClarity": 0.36,
      "exportStability": 0.42,
      "privateTagRate": 0.46,
      "privateTagOptimism": 0.42,
      "formatHardness": 0.6,
      "overclaimRisk": 0.46,
      "measureBias": "private_tag_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 12.18,
      "parseScore": 23.71,
      "snomedScore": 20.95,
      "exportIntegrity": 19.24,
      "privateTagBaselineScore": 19.94,
      "confidence": 25.6,
      "snomedCodedContribution": 18.96,
      "privateTagContribution": 19.69,
      "overall": 20.09
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 12.17,
      "parseScore": 17.1,
      "snomedScore": 13.13,
      "exportIntegrity": 33.93,
      "privateTagBaselineScore": 54.34,
      "confidence": 18.4,
      "snomedCodedContribution": 26.13,
      "privateTagContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "tm-004",
    "input": {
      "measureCoverage": 0.33,
      "parseFidelity": 0.32,
      "snomedClarity": 0.39,
      "exportStability": 0.38,
      "privateTagRate": 0.42,
      "privateTagOptimism": 0.43,
      "formatHardness": 0.53,
      "overclaimRisk": 0.46,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 28.09,
      "parseScore": 36.03,
      "snomedScore": 33.07,
      "exportIntegrity": 42.23,
      "privateTagBaselineScore": 18.93,
      "confidence": 26.1,
      "snomedCodedContribution": 34.5,
      "privateTagContribution": 19.05,
      "overall": 35.72
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 8.7,
      "parseScore": 17.81,
      "snomedScore": 13.75,
      "exportIntegrity": 32.79,
      "privateTagBaselineScore": 42.77,
      "confidence": 18.85,
      "snomedCodedContribution": 23.16,
      "privateTagContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "tm-005",
    "input": {
      "measureCoverage": 0.37,
      "parseFidelity": 0.36,
      "snomedClarity": 0.35,
      "exportStability": 0.42,
      "privateTagRate": 0.46,
      "privateTagOptimism": 0.45,
      "formatHardness": 0.53,
      "overclaimRisk": 0.47,
      "measureBias": "snomed_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 26.86,
      "parseScore": 39.64,
      "snomedScore": 39.58,
      "exportIntegrity": 35.49,
      "privateTagBaselineScore": 21.8,
      "confidence": 27.6,
      "snomedCodedContribution": 35.39,
      "privateTagContribution": 22.19,
      "overall": 37.01
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 0,
      "parseScore": 19.51,
      "snomedScore": 15.76,
      "exportIntegrity": 34.77,
      "privateTagBaselineScore": 32.95,
      "confidence": 21.05,
      "snomedCodedContribution": 20.6,
      "privateTagContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "tm-006",
    "input": {
      "measureCoverage": 0.41,
      "parseFidelity": 0.34,
      "snomedClarity": 0.39,
      "exportStability": 0.45,
      "privateTagRate": 0.5,
      "privateTagOptimism": 0.4,
      "formatHardness": 0.54,
      "overclaimRisk": 0.42,
      "measureBias": "balanced",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 33.94,
      "parseScore": 39.5,
      "snomedScore": 35.84,
      "exportIntegrity": 47.85,
      "privateTagBaselineScore": 23.08,
      "confidence": 30.35,
      "snomedCodedContribution": 38.87,
      "privateTagContribution": 23.38,
      "overall": 40.08
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 11.98,
      "parseScore": 18.04,
      "snomedScore": 14.31,
      "exportIntegrity": 34.78,
      "privateTagBaselineScore": 46.72,
      "confidence": 20.5,
      "snomedCodedContribution": 25.17,
      "privateTagContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "tm-007",
    "input": {
      "measureCoverage": 0.45,
      "parseFidelity": 0.38,
      "snomedClarity": 0.42,
      "exportStability": 0.49,
      "privateTagRate": 0.53,
      "privateTagOptimism": 0.42,
      "formatHardness": 0.55,
      "overclaimRisk": 0.43,
      "measureBias": "export_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 31.59,
      "parseScore": 43.11,
      "snomedScore": 26.54,
      "exportIntegrity": 61.29,
      "privateTagBaselineScore": 25.15,
      "confidence": 33.6,
      "snomedCodedContribution": 39.47,
      "privateTagContribution": 25.64,
      "overall": 40.98
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 8.27,
      "parseScore": 19.34,
      "snomedScore": 15.59,
      "exportIntegrity": 36.3,
      "privateTagBaselineScore": 34.2,
      "confidence": 22.15,
      "snomedCodedContribution": 22.74,
      "privateTagContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "tm-008",
    "input": {
      "measureCoverage": 0.41,
      "parseFidelity": 0.43,
      "snomedClarity": 0.46,
      "exportStability": 0.45,
      "privateTagRate": 0.49,
      "privateTagOptimism": 0.43,
      "formatHardness": 0.47,
      "overclaimRisk": 0.44,
      "measureBias": "private_tag_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 19.33,
      "parseScore": 35.43,
      "snomedScore": 27.62,
      "exportIntegrity": 24.76,
      "privateTagBaselineScore": 24.32,
      "confidence": 34.35,
      "snomedCodedContribution": 26.71,
      "privateTagContribution": 25.23,
      "overall": 27.44
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 16.4,
      "parseScore": 20.18,
      "snomedScore": 16.31,
      "exportIntegrity": 35.17,
      "privateTagBaselineScore": 58.5,
      "confidence": 22.7,
      "snomedCodedContribution": 29.31,
      "privateTagContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "tm-009",
    "input": {
      "measureCoverage": 0.46,
      "parseFidelity": 0.41,
      "snomedClarity": 0.5,
      "exportStability": 0.49,
      "privateTagRate": 0.53,
      "privateTagOptimism": 0.39,
      "formatHardness": 0.48,
      "overclaimRisk": 0.38,
      "measureBias": "balanced",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 40.05,
      "parseScore": 45.49,
      "snomedScore": 45.68,
      "exportIntegrity": 52.59,
      "privateTagBaselineScore": 25.81,
      "confidence": 37.35,
      "snomedCodedContribution": 45.69,
      "privateTagContribution": 26.69,
      "overall": 46.27
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 14.91,
      "parseScore": 19.07,
      "snomedScore": 15.29,
      "exportIntegrity": 35.36,
      "privateTagBaselineScore": 48.88,
      "confidence": 22.7,
      "snomedCodedContribution": 26.7,
      "privateTagContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "tm-010",
    "input": {
      "measureCoverage": 0.5,
      "parseFidelity": 0.45,
      "snomedClarity": 0.46,
      "exportStability": 0.53,
      "privateTagRate": 0.57,
      "privateTagOptimism": 0.4,
      "formatHardness": 0.49,
      "overclaimRisk": 0.39,
      "measureBias": "snomed_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 36.62,
      "parseScore": 49.14,
      "snomedScore": 54.56,
      "exportIntegrity": 43.07,
      "privateTagBaselineScore": 28.29,
      "confidence": 39,
      "snomedCodedContribution": 46.07,
      "privateTagContribution": 29.32,
      "overall": 47.06
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 3.59,
      "parseScore": 20.18,
      "snomedScore": 16.7,
      "exportIntegrity": 37.06,
      "privateTagBaselineScore": 35.54,
      "confidence": 24.25,
      "snomedCodedContribution": 22.61,
      "privateTagContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "tm-011",
    "input": {
      "measureCoverage": 0.54,
      "parseFidelity": 0.49,
      "snomedClarity": 0.49,
      "exportStability": 0.57,
      "privateTagRate": 0.6,
      "privateTagOptimism": 0.42,
      "formatHardness": 0.49,
      "overclaimRisk": 0.4,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 47.21,
      "parseScore": 52.75,
      "snomedScore": 47.19,
      "exportIntegrity": 60.27,
      "privateTagBaselineScore": 30.54,
      "confidence": 42.25,
      "snomedCodedContribution": 51.41,
      "privateTagContribution": 31.82,
      "overall": 51.88
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 17.1,
      "parseScore": 21.62,
      "snomedScore": 18.14,
      "exportIntegrity": 38.58,
      "privateTagBaselineScore": 54.12,
      "confidence": 26.1,
      "snomedCodedContribution": 29.91,
      "privateTagContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "tm-012",
    "input": {
      "measureCoverage": 0.5,
      "parseFidelity": 0.48,
      "snomedClarity": 0.53,
      "exportStability": 0.53,
      "privateTagRate": 0.56,
      "privateTagOptimism": 0.37,
      "formatHardness": 0.42,
      "overclaimRisk": 0.35,
      "measureBias": "export_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 38.19,
      "parseScore": 51.28,
      "snomedScore": 34.4,
      "exportIntegrity": 67.57,
      "privateTagBaselineScore": 28.34,
      "confidence": 42.1,
      "snomedCodedContribution": 46.73,
      "privateTagContribution": 29.7,
      "overall": 47.66
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 13.23,
      "parseScore": 19.68,
      "snomedScore": 16.17,
      "exportIntegrity": 35.76,
      "privateTagBaselineScore": 34.93,
      "confidence": 24.35,
      "snomedCodedContribution": 23.95,
      "privateTagContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "tm-013",
    "input": {
      "measureCoverage": 0.54,
      "parseFidelity": 0.52,
      "snomedClarity": 0.56,
      "exportStability": 0.57,
      "privateTagRate": 0.6,
      "privateTagOptimism": 0.39,
      "formatHardness": 0.42,
      "overclaimRisk": 0.36,
      "measureBias": "private_tag_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 29.13,
      "parseScore": 44.88,
      "snomedScore": 36.59,
      "exportIntegrity": 32.66,
      "privateTagBaselineScore": 31.2,
      "confidence": 45.35,
      "snomedCodedContribution": 35.78,
      "privateTagContribution": 32.8,
      "overall": 36.24
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 22.62,
      "parseScore": 21.35,
      "snomedScore": 17.8,
      "exportIntegrity": 37.74,
      "privateTagBaselineScore": 67.02,
      "confidence": 26.55,
      "snomedCodedContribution": 33.31,
      "privateTagContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "tm-014",
    "input": {
      "measureCoverage": 0.58,
      "parseFidelity": 0.56,
      "snomedClarity": 0.6,
      "exportStability": 0.61,
      "privateTagRate": 0.63,
      "privateTagOptimism": 0.4,
      "formatHardness": 0.43,
      "overclaimRisk": 0.36,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 52.62,
      "parseScore": 58.53,
      "snomedScore": 56.66,
      "exportIntegrity": 64.86,
      "privateTagBaselineScore": 33.07,
      "confidence": 49,
      "snomedCodedContribution": 57.86,
      "privateTagContribution": 34.8,
      "overall": 57.71
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 20.03,
      "parseScore": 22.2,
      "snomedScore": 18.59,
      "exportIntegrity": 38.98,
      "privateTagBaselineScore": 55.96,
      "confidence": 27.85,
      "snomedCodedContribution": 31.15,
      "privateTagContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "tm-015",
    "input": {
      "measureCoverage": 0.62,
      "parseFidelity": 0.54,
      "snomedClarity": 0.56,
      "exportStability": 0.65,
      "privateTagRate": 0.67,
      "privateTagOptimism": 0.36,
      "formatHardness": 0.44,
      "overclaimRisk": 0.31,
      "measureBias": "snomed_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 45.9,
      "parseScore": 58.35,
      "snomedScore": 68.41,
      "exportIntegrity": 50.82,
      "privateTagBaselineScore": 34.55,
      "confidence": 49.6,
      "snomedCodedContribution": 56.27,
      "privateTagContribution": 36.22,
      "overall": 56.66
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 9.43,
      "parseScore": 21.14,
      "snomedScore": 17.93,
      "exportIntegrity": 39.27,
      "privateTagBaselineScore": 38.2,
      "confidence": 27.75,
      "snomedCodedContribution": 25.19,
      "privateTagContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "tm-016",
    "input": {
      "measureCoverage": 0.58,
      "parseFidelity": 0.59,
      "snomedClarity": 0.6,
      "exportStability": 0.6,
      "privateTagRate": 0.63,
      "privateTagOptimism": 0.37,
      "formatHardness": 0.36,
      "overclaimRisk": 0.32,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 54.46,
      "parseScore": 60.67,
      "snomedScore": 57.87,
      "exportIntegrity": 65.05,
      "privateTagBaselineScore": 33.73,
      "confidence": 50.35,
      "snomedCodedContribution": 59.24,
      "privateTagContribution": 35.76,
      "overall": 59.01
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 22.05,
      "parseScore": 21.91,
      "snomedScore": 18.56,
      "exportIntegrity": 38.14,
      "privateTagBaselineScore": 55.7,
      "confidence": 28.3,
      "snomedCodedContribution": 31.27,
      "privateTagContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "tm-017",
    "input": {
      "measureCoverage": 0.62,
      "parseFidelity": 0.63,
      "snomedClarity": 0.63,
      "exportStability": 0.64,
      "privateTagRate": 0.67,
      "privateTagOptimism": 0.39,
      "formatHardness": 0.37,
      "overclaimRisk": 0.33,
      "measureBias": "export_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 48.43,
      "parseScore": 64.28,
      "snomedScore": 42.4,
      "exportIntegrity": 81.43,
      "privateTagBaselineScore": 36.41,
      "confidence": 53.6,
      "snomedCodedContribution": 57.81,
      "privateTagContribution": 38.61,
      "overall": 58.35
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 18.73,
      "parseScore": 23.42,
      "snomedScore": 20,
      "exportIntegrity": 40.11,
      "privateTagBaselineScore": 39.86,
      "confidence": 30.3,
      "snomedCodedContribution": 28.42,
      "privateTagContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "tm-018",
    "input": {
      "measureCoverage": 0.66,
      "parseFidelity": 0.61,
      "snomedClarity": 0.67,
      "exportStability": 0.68,
      "privateTagRate": 0.7,
      "privateTagOptimism": 0.34,
      "formatHardness": 0.38,
      "overclaimRisk": 0.27,
      "measureBias": "private_tag_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 38.33,
      "parseScore": 54.13,
      "snomedScore": 45.52,
      "exportIntegrity": 40.09,
      "privateTagBaselineScore": 37.08,
      "confidence": 56.35,
      "snomedCodedContribution": 44.52,
      "privateTagContribution": 39.16,
      "overall": 44.56
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 28.36,
      "parseScore": 21.66,
      "snomedScore": 18.31,
      "exportIntegrity": 39.67,
      "privateTagBaselineScore": 74.27,
      "confidence": 29.5,
      "snomedCodedContribution": 36.45,
      "privateTagContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "tm-019",
    "input": {
      "measureCoverage": 0.7,
      "parseFidelity": 0.65,
      "snomedClarity": 0.7,
      "exportStability": 0.72,
      "privateTagRate": 0.74,
      "privateTagOptimism": 0.36,
      "formatHardness": 0.38,
      "overclaimRisk": 0.28,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 63.81,
      "parseScore": 67.74,
      "snomedScore": 68.17,
      "exportIntegrity": 75.07,
      "privateTagBaselineScore": 39.94,
      "confidence": 59.6,
      "snomedCodedContribution": 68.45,
      "privateTagContribution": 42.25,
      "overall": 67.73
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 26.25,
      "parseScore": 23.32,
      "snomedScore": 19.92,
      "exportIntegrity": 41.65,
      "privateTagBaselineScore": 62.07,
      "confidence": 31.7,
      "snomedCodedContribution": 34.64,
      "privateTagContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "tm-020",
    "input": {
      "measureCoverage": 0.66,
      "parseFidelity": 0.7,
      "snomedClarity": 0.66,
      "exportStability": 0.68,
      "privateTagRate": 0.7,
      "privateTagOptimism": 0.37,
      "formatHardness": 0.31,
      "overclaimRisk": 0.29,
      "measureBias": "snomed_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 52.86,
      "parseScore": 70.06,
      "snomedScore": 80.04,
      "exportIntegrity": 56.34,
      "privateTagBaselineScore": 38.94,
      "confidence": 58.35,
      "snomedCodedContribution": 65.36,
      "privateTagContribution": 41.54,
      "overall": 65.07
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 13.66,
      "parseScore": 23.93,
      "snomedScore": 20.75,
      "exportIntegrity": 40.51,
      "privateTagBaselineScore": 40.86,
      "confidence": 32.05,
      "snomedCodedContribution": 27.94,
      "privateTagContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "tm-021",
    "input": {
      "measureCoverage": 0.7,
      "parseFidelity": 0.68,
      "snomedClarity": 0.7,
      "exportStability": 0.72,
      "privateTagRate": 0.73,
      "privateTagOptimism": 0.33,
      "formatHardness": 0.31,
      "overclaimRisk": 0.24,
      "measureBias": "balanced",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 65.6,
      "parseScore": 69.88,
      "snomedScore": 69.32,
      "exportIntegrity": 75.82,
      "privateTagBaselineScore": 39.99,
      "confidence": 60.95,
      "snomedCodedContribution": 69.92,
      "privateTagContribution": 42.54,
      "overall": 68.99
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 27.89,
      "parseScore": 22.72,
      "snomedScore": 19.62,
      "exportIntegrity": 40.35,
      "privateTagBaselineScore": 61.19,
      "confidence": 31.8,
      "snomedCodedContribution": 34.35,
      "privateTagContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "tm-022",
    "input": {
      "measureCoverage": 0.74,
      "parseFidelity": 0.72,
      "snomedClarity": 0.73,
      "exportStability": 0.76,
      "privateTagRate": 0.77,
      "privateTagOptimism": 0.34,
      "formatHardness": 0.32,
      "overclaimRisk": 0.25,
      "measureBias": "export_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 57.62,
      "parseScore": 73.52,
      "snomedScore": 50.92,
      "exportIntegrity": 94.56,
      "privateTagBaselineScore": 42.47,
      "confidence": 64.35,
      "snomedCodedContribution": 67.69,
      "privateTagContribution": 45.15,
      "overall": 67.63
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 24.57,
      "parseScore": 23.79,
      "snomedScore": 20.63,
      "exportIntegrity": 42.05,
      "privateTagBaselineScore": 42.21,
      "confidence": 33.35,
      "snomedCodedContribution": 30.65,
      "privateTagContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "tm-023",
    "input": {
      "measureCoverage": 0.79,
      "parseFidelity": 0.76,
      "snomedClarity": 0.77,
      "exportStability": 0.8,
      "privateTagRate": 0.81,
      "privateTagOptimism": 0.36,
      "formatHardness": 0.33,
      "overclaimRisk": 0.25,
      "measureBias": "private_tag_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 49.04,
      "parseScore": 67.38,
      "snomedScore": 53.74,
      "exportIntegrity": 49.49,
      "privateTagBaselineScore": 45.16,
      "confidence": 68.25,
      "snomedCodedContribution": 54.86,
      "privateTagContribution": 48.03,
      "overall": 54.63
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 33.86,
      "parseScore": 25.25,
      "snomedScore": 22.05,
      "exportIntegrity": 43.92,
      "privateTagBaselineScore": 84.72,
      "confidence": 35.45,
      "snomedCodedContribution": 41.96,
      "privateTagContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "tm-024",
    "input": {
      "measureCoverage": 0.75,
      "parseFidelity": 0.75,
      "snomedClarity": 0.81,
      "exportStability": 0.76,
      "privateTagRate": 0.77,
      "privateTagOptimism": 0.31,
      "formatHardness": 0.25,
      "overclaimRisk": 0.2,
      "measureBias": "balanced",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 71.55,
      "parseScore": 75.91,
      "snomedScore": 78.99,
      "exportIntegrity": 80.56,
      "privateTagBaselineScore": 43.13,
      "confidence": 68.1,
      "snomedCodedContribution": 76.66,
      "privateTagContribution": 46.07,
      "overall": 75.15
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 31.21,
      "parseScore": 23.36,
      "snomedScore": 20.13,
      "exportIntegrity": 41.11,
      "privateTagBaselineScore": 63.65,
      "confidence": 33.9,
      "snomedCodedContribution": 35.89,
      "privateTagContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "tm-025",
    "input": {
      "measureCoverage": 0.79,
      "parseFidelity": 0.79,
      "snomedClarity": 0.77,
      "exportStability": 0.8,
      "privateTagRate": 0.8,
      "privateTagOptimism": 0.33,
      "formatHardness": 0.26,
      "overclaimRisk": 0.21,
      "measureBias": "snomed_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 62.51,
      "parseScore": 79.52,
      "snomedScore": 94.88,
      "exportIntegrity": 64.24,
      "privateTagBaselineScore": 45.2,
      "confidence": 69.6,
      "snomedCodedContribution": 76.04,
      "privateTagContribution": 48.27,
      "overall": 75.04
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 19.5,
      "parseScore": 24.6,
      "snomedScore": 21.69,
      "exportIntegrity": 42.63,
      "privateTagBaselineScore": 43.52,
      "confidence": 35.55,
      "snomedCodedContribution": 30.39,
      "privateTagContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "tm-026",
    "input": {
      "measureCoverage": 0.83,
      "parseFidelity": 0.83,
      "snomedClarity": 0.8,
      "exportStability": 0.83,
      "privateTagRate": 0.84,
      "privateTagOptimism": 0.34,
      "formatHardness": 0.27,
      "overclaimRisk": 0.22,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 78.52,
      "parseScore": 83.17,
      "snomedScore": 80.3,
      "exportIntegrity": 87.68,
      "privateTagBaselineScore": 47.68,
      "confidence": 73,
      "snomedCodedContribution": 82.15,
      "privateTagContribution": 50.87,
      "overall": 80.52
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 33.17,
      "parseScore": 25.67,
      "snomedScore": 22.7,
      "exportIntegrity": 44.32,
      "privateTagBaselineScore": 68.8,
      "confidence": 37.1,
      "snomedCodedContribution": 38.93,
      "privateTagContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "tm-027",
    "input": {
      "measureCoverage": 0.87,
      "parseFidelity": 0.81,
      "snomedClarity": 0.84,
      "exportStability": 0.87,
      "privateTagRate": 0.88,
      "privateTagOptimism": 0.3,
      "formatHardness": 0.27,
      "overclaimRisk": 0.17,
      "measureBias": "export_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 67.26,
      "parseScore": 82.98,
      "snomedScore": 60.03,
      "exportIntegrity": 100,
      "privateTagBaselineScore": 49.35,
      "confidence": 75.6,
      "snomedCodedContribution": 76.21,
      "privateTagContribution": 52.5,
      "overall": 75.94
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 30.78,
      "parseScore": 24.7,
      "snomedScore": 21.75,
      "exportIntegrity": 44.62,
      "privateTagBaselineScore": 45.22,
      "confidence": 37.2,
      "snomedCodedContribution": 33.41,
      "privateTagContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "tm-028",
    "input": {
      "measureCoverage": 0.83,
      "parseFidelity": 0.86,
      "snomedClarity": 0.87,
      "exportStability": 0.83,
      "privateTagRate": 0.84,
      "privateTagOptimism": 0.31,
      "formatHardness": 0.2,
      "overclaimRisk": 0.17,
      "measureBias": "private_tag_first",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 54.87,
      "parseScore": 75.3,
      "snomedScore": 60.62,
      "exportIntegrity": 53.51,
      "privateTagBaselineScore": 48.34,
      "confidence": 76.1,
      "snomedCodedContribution": 61.08,
      "privateTagContribution": 51.73,
      "overall": 60.4
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 38.81,
      "parseScore": 25.25,
      "snomedScore": 22.17,
      "exportIntegrity": 43.48,
      "privateTagBaselineScore": 86.95,
      "confidence": 37.65,
      "snomedCodedContribution": 43.33,
      "privateTagContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "tm-029",
    "input": {
      "measureCoverage": 0.87,
      "parseFidelity": 0.9,
      "snomedClarity": 0.91,
      "exportStability": 0.87,
      "privateTagRate": 0.87,
      "privateTagOptimism": 0.33,
      "formatHardness": 0.2,
      "overclaimRisk": 0.18,
      "measureBias": "balanced",
      "profile": "snomed_coded_oct_recovery"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 83.89,
      "parseScore": 88.91,
      "snomedScore": 89.72,
      "exportIntegrity": 92.27,
      "privateTagBaselineScore": 50.59,
      "confidence": 79.6,
      "snomedCodedContribution": 88.57,
      "privateTagContribution": 54.16,
      "overall": 86.38
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 36.33,
      "parseScore": 26.6,
      "snomedScore": 23.46,
      "exportIntegrity": 45,
      "privateTagBaselineScore": 71.06,
      "confidence": 39.5,
      "snomedCodedContribution": 40.49,
      "privateTagContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "tm-030",
    "input": {
      "measureCoverage": 0.91,
      "parseFidelity": 0.88,
      "snomedClarity": 0.87,
      "exportStability": 0.91,
      "privateTagRate": 0.91,
      "privateTagOptimism": 0.28,
      "formatHardness": 0.21,
      "overclaimRisk": 0.13,
      "measureBias": "snomed_first",
      "profile": "raw_private_tag_baseline"
    },
    "expectedSnomedCoded": {
      "mode": "snomed_coded_oct_recovery",
      "measureCoverageScore": 71.59,
      "parseScore": 88.77,
      "snomedScore": 100,
      "exportIntegrity": 71.68,
      "privateTagBaselineScore": 51.88,
      "confidence": 80.35,
      "snomedCodedContribution": 83.69,
      "privateTagContribution": 55.31,
      "overall": 82.58
    },
    "expectedPrivateTagBaseline": {
      "mode": "raw_private_tag_baseline",
      "measureCoverageScore": 25.72,
      "parseScore": 25.06,
      "snomedScore": 22.34,
      "exportIntegrity": 45.02,
      "privateTagBaselineScore": 46.21,
      "confidence": 38.95,
      "snomedCodedContribution": 32.87,
      "privateTagContribution": 50.68,
      "overall": 44.3
    }
  }
];
