import type { MolInput, MolQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MolInput;
  expectedSampleEfficient: MolQuality;
  expectedNaiveGenerativeBaseline: MolQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "mol-001",
    "input": {
      "campaignCoverage": 0.29,
      "targetFidelity": 0.25,
      "targetFit": 0.28,
      "sampleEfficiency": 0.34,
      "naiveYield": 0.39,
      "blindOptimism": 0.45,
      "designHardness": 0.59,
      "leakageRisk": 0.5,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 22.56,
      "efficiencyDiagnosis": 30.25,
      "targetOptScore": 27.38,
      "packIntegrity": 34.28,
      "baselineScore": 16.4,
      "confidence": 19.35,
      "efficiencyContribution": 28.33,
      "baselineContribution": 15.96,
      "overall": 30.1
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 5.76,
      "efficiencyDiagnosis": 17.09,
      "targetOptScore": 13.13,
      "packIntegrity": 32.39,
      "baselineScore": 40.93,
      "confidence": 17.1,
      "efficiencyContribution": 21.86,
      "baselineContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "mol-002",
    "input": {
      "campaignCoverage": 0.33,
      "targetFidelity": 0.29,
      "targetFit": 0.32,
      "sampleEfficiency": 0.38,
      "naiveYield": 0.43,
      "blindOptimism": 0.46,
      "designHardness": 0.6,
      "leakageRisk": 0.51,
      "molBias": "optimizer_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 22.22,
      "efficiencyDiagnosis": 33.9,
      "targetOptScore": 39.65,
      "packIntegrity": 30.06,
      "baselineScore": 18.89,
      "confidence": 23,
      "efficiencyContribution": 31.63,
      "baselineContribution": 18.61,
      "overall": 33.29
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 2.43,
      "efficiencyDiagnosis": 18.22,
      "targetOptScore": 14.16,
      "packIntegrity": 34.08,
      "baselineScore": 31.53,
      "confidence": 18.65,
      "efficiencyContribution": 20.08,
      "baselineContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "mol-003",
    "input": {
      "campaignCoverage": 0.37,
      "targetFidelity": 0.27,
      "targetFit": 0.36,
      "sampleEfficiency": 0.42,
      "naiveYield": 0.46,
      "blindOptimism": 0.42,
      "designHardness": 0.6,
      "leakageRisk": 0.46,
      "molBias": "baseline_first",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 12.18,
      "efficiencyDiagnosis": 23.71,
      "targetOptScore": 23.1,
      "packIntegrity": 17.39,
      "baselineScore": 19.94,
      "confidence": 25.6,
      "efficiencyContribution": 19.15,
      "baselineContribution": 19.69,
      "overall": 20.25
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 12.17,
      "efficiencyDiagnosis": 17.1,
      "targetOptScore": 13.13,
      "packIntegrity": 33.93,
      "baselineScore": 54.34,
      "confidence": 18.4,
      "efficiencyContribution": 26.13,
      "baselineContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "mol-004",
    "input": {
      "campaignCoverage": 0.33,
      "targetFidelity": 0.32,
      "targetFit": 0.39,
      "sampleEfficiency": 0.38,
      "naiveYield": 0.42,
      "blindOptimism": 0.43,
      "designHardness": 0.53,
      "leakageRisk": 0.46,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 28.09,
      "efficiencyDiagnosis": 36.03,
      "targetOptScore": 32.42,
      "packIntegrity": 42.79,
      "baselineScore": 18.93,
      "confidence": 26.1,
      "efficiencyContribution": 34.44,
      "baselineContribution": 19.05,
      "overall": 35.67
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 8.7,
      "efficiencyDiagnosis": 17.81,
      "targetOptScore": 13.75,
      "packIntegrity": 32.79,
      "baselineScore": 42.77,
      "confidence": 18.85,
      "efficiencyContribution": 23.16,
      "baselineContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "mol-005",
    "input": {
      "campaignCoverage": 0.37,
      "targetFidelity": 0.36,
      "targetFit": 0.35,
      "sampleEfficiency": 0.42,
      "naiveYield": 0.46,
      "blindOptimism": 0.45,
      "designHardness": 0.53,
      "leakageRisk": 0.47,
      "molBias": "efficiency_strict",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 26.86,
      "efficiencyDiagnosis": 39.64,
      "targetOptScore": 23.89,
      "packIntegrity": 49.01,
      "baselineScore": 21.8,
      "confidence": 27.6,
      "efficiencyContribution": 33.97,
      "baselineContribution": 22.19,
      "overall": 35.85
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 0,
      "efficiencyDiagnosis": 19.51,
      "targetOptScore": 15.76,
      "packIntegrity": 34.77,
      "baselineScore": 32.95,
      "confidence": 21.05,
      "efficiencyContribution": 20.6,
      "baselineContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "mol-006",
    "input": {
      "campaignCoverage": 0.41,
      "targetFidelity": 0.34,
      "targetFit": 0.39,
      "sampleEfficiency": 0.45,
      "naiveYield": 0.5,
      "blindOptimism": 0.4,
      "designHardness": 0.54,
      "leakageRisk": 0.42,
      "molBias": "balanced",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 33.94,
      "efficiencyDiagnosis": 39.5,
      "targetOptScore": 39.74,
      "packIntegrity": 44.49,
      "baselineScore": 23.08,
      "confidence": 30.35,
      "efficiencyContribution": 39.22,
      "baselineContribution": 23.38,
      "overall": 40.37
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 11.98,
      "efficiencyDiagnosis": 18.04,
      "targetOptScore": 14.31,
      "packIntegrity": 34.78,
      "baselineScore": 46.72,
      "confidence": 20.5,
      "efficiencyContribution": 25.17,
      "baselineContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "mol-007",
    "input": {
      "campaignCoverage": 0.45,
      "targetFidelity": 0.38,
      "targetFit": 0.42,
      "sampleEfficiency": 0.49,
      "naiveYield": 0.53,
      "blindOptimism": 0.42,
      "designHardness": 0.55,
      "leakageRisk": 0.43,
      "molBias": "optimizer_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 31.59,
      "efficiencyDiagnosis": 43.11,
      "targetOptScore": 54.51,
      "packIntegrity": 37.19,
      "baselineScore": 25.15,
      "confidence": 33.6,
      "efficiencyContribution": 42,
      "baselineContribution": 25.64,
      "overall": 43.06
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 8.27,
      "efficiencyDiagnosis": 19.34,
      "targetOptScore": 15.59,
      "packIntegrity": 36.3,
      "baselineScore": 34.2,
      "confidence": 22.15,
      "efficiencyContribution": 22.74,
      "baselineContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "mol-008",
    "input": {
      "campaignCoverage": 0.41,
      "targetFidelity": 0.43,
      "targetFit": 0.46,
      "sampleEfficiency": 0.45,
      "naiveYield": 0.49,
      "blindOptimism": 0.43,
      "designHardness": 0.47,
      "leakageRisk": 0.44,
      "molBias": "baseline_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 19.33,
      "efficiencyDiagnosis": 35.43,
      "targetOptScore": 27.26,
      "packIntegrity": 25.07,
      "baselineScore": 24.32,
      "confidence": 34.35,
      "efficiencyContribution": 26.68,
      "baselineContribution": 25.23,
      "overall": 27.42
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 16.4,
      "efficiencyDiagnosis": 20.18,
      "targetOptScore": 16.31,
      "packIntegrity": 35.17,
      "baselineScore": 58.5,
      "confidence": 22.7,
      "efficiencyContribution": 29.31,
      "baselineContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "mol-009",
    "input": {
      "campaignCoverage": 0.46,
      "targetFidelity": 0.41,
      "targetFit": 0.5,
      "sampleEfficiency": 0.49,
      "naiveYield": 0.53,
      "blindOptimism": 0.39,
      "designHardness": 0.48,
      "leakageRisk": 0.38,
      "molBias": "balanced",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 40.05,
      "efficiencyDiagnosis": 45.49,
      "targetOptScore": 45.04,
      "packIntegrity": 53.15,
      "baselineScore": 25.81,
      "confidence": 37.35,
      "efficiencyContribution": 45.63,
      "baselineContribution": 26.69,
      "overall": 46.22
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 14.91,
      "efficiencyDiagnosis": 19.07,
      "targetOptScore": 15.29,
      "packIntegrity": 35.36,
      "baselineScore": 48.88,
      "confidence": 22.7,
      "efficiencyContribution": 26.7,
      "baselineContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "mol-010",
    "input": {
      "campaignCoverage": 0.5,
      "targetFidelity": 0.45,
      "targetFit": 0.46,
      "sampleEfficiency": 0.53,
      "naiveYield": 0.57,
      "blindOptimism": 0.4,
      "designHardness": 0.49,
      "leakageRisk": 0.39,
      "molBias": "efficiency_strict",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 36.62,
      "efficiencyDiagnosis": 49.14,
      "targetOptScore": 33.16,
      "packIntegrity": 61.53,
      "baselineScore": 28.29,
      "confidence": 39,
      "efficiencyContribution": 44.14,
      "baselineContribution": 29.32,
      "overall": 45.47
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 3.59,
      "efficiencyDiagnosis": 20.18,
      "targetOptScore": 16.7,
      "packIntegrity": 37.06,
      "baselineScore": 35.54,
      "confidence": 24.25,
      "efficiencyContribution": 22.61,
      "baselineContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "mol-011",
    "input": {
      "campaignCoverage": 0.54,
      "targetFidelity": 0.49,
      "targetFit": 0.49,
      "sampleEfficiency": 0.57,
      "naiveYield": 0.6,
      "blindOptimism": 0.42,
      "designHardness": 0.49,
      "leakageRisk": 0.4,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 47.21,
      "efficiencyDiagnosis": 52.75,
      "targetOptScore": 52.38,
      "packIntegrity": 55.79,
      "baselineScore": 30.54,
      "confidence": 42.25,
      "efficiencyContribution": 51.87,
      "baselineContribution": 31.82,
      "overall": 52.26
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 17.1,
      "efficiencyDiagnosis": 21.62,
      "targetOptScore": 18.14,
      "packIntegrity": 38.58,
      "baselineScore": 54.12,
      "confidence": 26.1,
      "efficiencyContribution": 29.91,
      "baselineContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "mol-012",
    "input": {
      "campaignCoverage": 0.5,
      "targetFidelity": 0.48,
      "targetFit": 0.53,
      "sampleEfficiency": 0.53,
      "naiveYield": 0.56,
      "blindOptimism": 0.37,
      "designHardness": 0.42,
      "leakageRisk": 0.35,
      "molBias": "optimizer_first",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 38.19,
      "efficiencyDiagnosis": 51.28,
      "targetOptScore": 61.94,
      "packIntegrity": 43.82,
      "baselineScore": 28.34,
      "confidence": 42.1,
      "efficiencyContribution": 49.22,
      "baselineContribution": 29.7,
      "overall": 49.71
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 13.23,
      "efficiencyDiagnosis": 19.68,
      "targetOptScore": 16.17,
      "packIntegrity": 35.76,
      "baselineScore": 34.93,
      "confidence": 24.35,
      "efficiencyContribution": 23.95,
      "baselineContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "mol-013",
    "input": {
      "campaignCoverage": 0.54,
      "targetFidelity": 0.52,
      "targetFit": 0.56,
      "sampleEfficiency": 0.57,
      "naiveYield": 0.6,
      "blindOptimism": 0.39,
      "designHardness": 0.42,
      "leakageRisk": 0.36,
      "molBias": "baseline_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 29.13,
      "efficiencyDiagnosis": 44.88,
      "targetOptScore": 36.95,
      "packIntegrity": 32.35,
      "baselineScore": 31.2,
      "confidence": 45.35,
      "efficiencyContribution": 35.81,
      "baselineContribution": 32.8,
      "overall": 36.27
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 22.62,
      "efficiencyDiagnosis": 21.35,
      "targetOptScore": 17.8,
      "packIntegrity": 37.74,
      "baselineScore": 67.02,
      "confidence": 26.55,
      "efficiencyContribution": 33.31,
      "baselineContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "mol-014",
    "input": {
      "campaignCoverage": 0.58,
      "targetFidelity": 0.56,
      "targetFit": 0.6,
      "sampleEfficiency": 0.61,
      "naiveYield": 0.63,
      "blindOptimism": 0.4,
      "designHardness": 0.43,
      "leakageRisk": 0.36,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 52.62,
      "efficiencyDiagnosis": 58.53,
      "targetOptScore": 57.31,
      "packIntegrity": 64.3,
      "baselineScore": 33.07,
      "confidence": 49,
      "efficiencyContribution": 57.92,
      "baselineContribution": 34.8,
      "overall": 57.76
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 20.03,
      "efficiencyDiagnosis": 22.2,
      "targetOptScore": 18.59,
      "packIntegrity": 38.98,
      "baselineScore": 55.96,
      "confidence": 27.85,
      "efficiencyContribution": 31.15,
      "baselineContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "mol-015",
    "input": {
      "campaignCoverage": 0.62,
      "targetFidelity": 0.54,
      "targetFit": 0.56,
      "sampleEfficiency": 0.65,
      "naiveYield": 0.67,
      "blindOptimism": 0.36,
      "designHardness": 0.44,
      "leakageRisk": 0.31,
      "molBias": "efficiency_strict",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 45.9,
      "efficiencyDiagnosis": 58.35,
      "targetOptScore": 42.52,
      "packIntegrity": 73.14,
      "baselineScore": 34.55,
      "confidence": 49.6,
      "efficiencyContribution": 53.93,
      "baselineContribution": 36.22,
      "overall": 54.74
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 9.43,
      "efficiencyDiagnosis": 21.14,
      "targetOptScore": 17.93,
      "packIntegrity": 39.27,
      "baselineScore": 38.2,
      "confidence": 27.75,
      "efficiencyContribution": 25.19,
      "baselineContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "mol-016",
    "input": {
      "campaignCoverage": 0.58,
      "targetFidelity": 0.59,
      "targetFit": 0.6,
      "sampleEfficiency": 0.6,
      "naiveYield": 0.63,
      "blindOptimism": 0.37,
      "designHardness": 0.36,
      "leakageRisk": 0.32,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 54.46,
      "efficiencyDiagnosis": 60.67,
      "targetOptScore": 57.87,
      "packIntegrity": 65.05,
      "baselineScore": 33.73,
      "confidence": 50.35,
      "efficiencyContribution": 59.24,
      "baselineContribution": 35.76,
      "overall": 59.01
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 22.05,
      "efficiencyDiagnosis": 21.91,
      "targetOptScore": 18.56,
      "packIntegrity": 38.14,
      "baselineScore": 55.7,
      "confidence": 28.3,
      "efficiencyContribution": 31.27,
      "baselineContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "mol-017",
    "input": {
      "campaignCoverage": 0.62,
      "targetFidelity": 0.63,
      "targetFit": 0.63,
      "sampleEfficiency": 0.64,
      "naiveYield": 0.67,
      "blindOptimism": 0.39,
      "designHardness": 0.37,
      "leakageRisk": 0.33,
      "molBias": "optimizer_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 48.43,
      "efficiencyDiagnosis": 64.28,
      "targetOptScore": 76.01,
      "packIntegrity": 52.45,
      "baselineScore": 36.41,
      "confidence": 53.6,
      "efficiencyContribution": 60.84,
      "baselineContribution": 38.61,
      "overall": 60.84
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 18.73,
      "efficiencyDiagnosis": 23.42,
      "targetOptScore": 20,
      "packIntegrity": 40.11,
      "baselineScore": 39.86,
      "confidence": 30.3,
      "efficiencyContribution": 28.42,
      "baselineContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "mol-018",
    "input": {
      "campaignCoverage": 0.66,
      "targetFidelity": 0.61,
      "targetFit": 0.67,
      "sampleEfficiency": 0.68,
      "naiveYield": 0.7,
      "blindOptimism": 0.34,
      "designHardness": 0.38,
      "leakageRisk": 0.27,
      "molBias": "baseline_first",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 38.33,
      "efficiencyDiagnosis": 54.13,
      "targetOptScore": 45.88,
      "packIntegrity": 39.79,
      "baselineScore": 37.08,
      "confidence": 56.35,
      "efficiencyContribution": 44.56,
      "baselineContribution": 39.16,
      "overall": 44.59
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 28.36,
      "efficiencyDiagnosis": 21.66,
      "targetOptScore": 18.31,
      "packIntegrity": 39.67,
      "baselineScore": 74.27,
      "confidence": 29.5,
      "efficiencyContribution": 36.45,
      "baselineContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "mol-019",
    "input": {
      "campaignCoverage": 0.7,
      "targetFidelity": 0.65,
      "targetFit": 0.7,
      "sampleEfficiency": 0.72,
      "naiveYield": 0.74,
      "blindOptimism": 0.36,
      "designHardness": 0.38,
      "leakageRisk": 0.28,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 63.81,
      "efficiencyDiagnosis": 67.74,
      "targetOptScore": 69.47,
      "packIntegrity": 73.95,
      "baselineScore": 39.94,
      "confidence": 59.6,
      "efficiencyContribution": 68.57,
      "baselineContribution": 42.25,
      "overall": 67.83
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 26.25,
      "efficiencyDiagnosis": 23.32,
      "targetOptScore": 19.92,
      "packIntegrity": 41.65,
      "baselineScore": 62.07,
      "confidence": 31.7,
      "efficiencyContribution": 34.64,
      "baselineContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "mol-020",
    "input": {
      "campaignCoverage": 0.66,
      "targetFidelity": 0.7,
      "targetFit": 0.66,
      "sampleEfficiency": 0.68,
      "naiveYield": 0.7,
      "blindOptimism": 0.37,
      "designHardness": 0.31,
      "leakageRisk": 0.29,
      "molBias": "efficiency_strict",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 52.86,
      "efficiencyDiagnosis": 70.06,
      "targetOptScore": 46.45,
      "packIntegrity": 85.3,
      "baselineScore": 38.94,
      "confidence": 58.35,
      "efficiencyContribution": 62.33,
      "baselineContribution": 41.54,
      "overall": 62.59
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 13.66,
      "efficiencyDiagnosis": 23.93,
      "targetOptScore": 20.75,
      "packIntegrity": 40.51,
      "baselineScore": 40.86,
      "confidence": 32.05,
      "efficiencyContribution": 27.94,
      "baselineContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "mol-021",
    "input": {
      "campaignCoverage": 0.7,
      "targetFidelity": 0.68,
      "targetFit": 0.7,
      "sampleEfficiency": 0.72,
      "naiveYield": 0.73,
      "blindOptimism": 0.33,
      "designHardness": 0.31,
      "leakageRisk": 0.24,
      "molBias": "balanced",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 65.6,
      "efficiencyDiagnosis": 69.88,
      "targetOptScore": 70.62,
      "packIntegrity": 74.7,
      "baselineScore": 39.99,
      "confidence": 60.95,
      "efficiencyContribution": 70.03,
      "baselineContribution": 42.54,
      "overall": 69.08
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 27.89,
      "efficiencyDiagnosis": 22.72,
      "targetOptScore": 19.62,
      "packIntegrity": 40.35,
      "baselineScore": 61.19,
      "confidence": 31.8,
      "efficiencyContribution": 34.35,
      "baselineContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "mol-022",
    "input": {
      "campaignCoverage": 0.74,
      "targetFidelity": 0.72,
      "targetFit": 0.73,
      "sampleEfficiency": 0.76,
      "naiveYield": 0.77,
      "blindOptimism": 0.34,
      "designHardness": 0.32,
      "leakageRisk": 0.25,
      "molBias": "optimizer_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 57.62,
      "efficiencyDiagnosis": 73.52,
      "targetOptScore": 91.49,
      "packIntegrity": 59.58,
      "baselineScore": 42.47,
      "confidence": 64.35,
      "efficiencyContribution": 71.35,
      "baselineContribution": 45.15,
      "overall": 70.63
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 24.57,
      "efficiencyDiagnosis": 23.79,
      "targetOptScore": 20.63,
      "packIntegrity": 42.05,
      "baselineScore": 42.21,
      "confidence": 33.35,
      "efficiencyContribution": 30.65,
      "baselineContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "mol-023",
    "input": {
      "campaignCoverage": 0.79,
      "targetFidelity": 0.76,
      "targetFit": 0.77,
      "sampleEfficiency": 0.8,
      "naiveYield": 0.81,
      "blindOptimism": 0.36,
      "designHardness": 0.33,
      "leakageRisk": 0.25,
      "molBias": "baseline_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 49.04,
      "efficiencyDiagnosis": 67.38,
      "targetOptScore": 54.82,
      "packIntegrity": 48.57,
      "baselineScore": 45.16,
      "confidence": 68.25,
      "efficiencyContribution": 54.96,
      "baselineContribution": 48.03,
      "overall": 54.71
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 33.86,
      "efficiencyDiagnosis": 25.25,
      "targetOptScore": 22.05,
      "packIntegrity": 43.92,
      "baselineScore": 84.72,
      "confidence": 35.45,
      "efficiencyContribution": 41.96,
      "baselineContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "mol-024",
    "input": {
      "campaignCoverage": 0.75,
      "targetFidelity": 0.75,
      "targetFit": 0.81,
      "sampleEfficiency": 0.76,
      "naiveYield": 0.77,
      "blindOptimism": 0.31,
      "designHardness": 0.25,
      "leakageRisk": 0.2,
      "molBias": "balanced",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 71.55,
      "efficiencyDiagnosis": 75.91,
      "targetOptScore": 75.74,
      "packIntegrity": 83.36,
      "baselineScore": 43.13,
      "confidence": 68.1,
      "efficiencyContribution": 76.37,
      "baselineContribution": 46.07,
      "overall": 74.92
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 31.21,
      "efficiencyDiagnosis": 23.36,
      "targetOptScore": 20.13,
      "packIntegrity": 41.11,
      "baselineScore": 63.65,
      "confidence": 33.9,
      "efficiencyContribution": 35.89,
      "baselineContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "mol-025",
    "input": {
      "campaignCoverage": 0.79,
      "targetFidelity": 0.79,
      "targetFit": 0.77,
      "sampleEfficiency": 0.8,
      "naiveYield": 0.8,
      "blindOptimism": 0.33,
      "designHardness": 0.26,
      "leakageRisk": 0.21,
      "molBias": "efficiency_strict",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 62.51,
      "efficiencyDiagnosis": 79.52,
      "targetOptScore": 55.93,
      "packIntegrity": 97.81,
      "baselineScore": 45.2,
      "confidence": 69.6,
      "efficiencyContribution": 72.52,
      "baselineContribution": 48.27,
      "overall": 72.16
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 19.5,
      "efficiencyDiagnosis": 24.6,
      "targetOptScore": 21.69,
      "packIntegrity": 42.63,
      "baselineScore": 43.52,
      "confidence": 35.55,
      "efficiencyContribution": 30.39,
      "baselineContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "mol-026",
    "input": {
      "campaignCoverage": 0.83,
      "targetFidelity": 0.83,
      "targetFit": 0.8,
      "sampleEfficiency": 0.83,
      "naiveYield": 0.84,
      "blindOptimism": 0.34,
      "designHardness": 0.27,
      "leakageRisk": 0.22,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 78.52,
      "efficiencyDiagnosis": 83.17,
      "targetOptScore": 82.25,
      "packIntegrity": 86,
      "baselineScore": 47.68,
      "confidence": 73,
      "efficiencyContribution": 82.33,
      "baselineContribution": 50.87,
      "overall": 80.67
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 33.17,
      "efficiencyDiagnosis": 25.67,
      "targetOptScore": 22.7,
      "packIntegrity": 44.32,
      "baselineScore": 68.8,
      "confidence": 37.1,
      "efficiencyContribution": 38.93,
      "baselineContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "mol-027",
    "input": {
      "campaignCoverage": 0.87,
      "targetFidelity": 0.81,
      "targetFit": 0.84,
      "sampleEfficiency": 0.87,
      "naiveYield": 0.88,
      "blindOptimism": 0.3,
      "designHardness": 0.27,
      "leakageRisk": 0.17,
      "molBias": "optimizer_first",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 67.26,
      "efficiencyDiagnosis": 82.98,
      "targetOptScore": 100,
      "packIntegrity": 67.17,
      "baselineScore": 49.35,
      "confidence": 75.6,
      "efficiencyContribution": 80.18,
      "baselineContribution": 52.5,
      "overall": 79.2
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 30.78,
      "efficiencyDiagnosis": 24.7,
      "targetOptScore": 21.75,
      "packIntegrity": 44.62,
      "baselineScore": 45.22,
      "confidence": 37.2,
      "efficiencyContribution": 33.41,
      "baselineContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "mol-028",
    "input": {
      "campaignCoverage": 0.83,
      "targetFidelity": 0.86,
      "targetFit": 0.87,
      "sampleEfficiency": 0.83,
      "naiveYield": 0.84,
      "blindOptimism": 0.31,
      "designHardness": 0.2,
      "leakageRisk": 0.17,
      "molBias": "baseline_first",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 54.87,
      "efficiencyDiagnosis": 75.3,
      "targetOptScore": 59.19,
      "packIntegrity": 54.75,
      "baselineScore": 48.34,
      "confidence": 76.1,
      "efficiencyContribution": 60.96,
      "baselineContribution": 51.73,
      "overall": 60.3
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 38.81,
      "efficiencyDiagnosis": 25.25,
      "targetOptScore": 22.17,
      "packIntegrity": 43.48,
      "baselineScore": 86.95,
      "confidence": 37.65,
      "efficiencyContribution": 43.33,
      "baselineContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "mol-029",
    "input": {
      "campaignCoverage": 0.87,
      "targetFidelity": 0.9,
      "targetFit": 0.91,
      "sampleEfficiency": 0.87,
      "naiveYield": 0.87,
      "blindOptimism": 0.33,
      "designHardness": 0.2,
      "leakageRisk": 0.18,
      "molBias": "balanced",
      "profile": "sample_efficient"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 83.89,
      "efficiencyDiagnosis": 88.91,
      "targetOptScore": 87.12,
      "packIntegrity": 94.51,
      "baselineScore": 50.59,
      "confidence": 79.6,
      "efficiencyContribution": 88.34,
      "baselineContribution": 54.16,
      "overall": 86.19
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 36.33,
      "efficiencyDiagnosis": 26.6,
      "targetOptScore": 23.46,
      "packIntegrity": 45,
      "baselineScore": 71.06,
      "confidence": 39.5,
      "efficiencyContribution": 40.49,
      "baselineContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "mol-030",
    "input": {
      "campaignCoverage": 0.91,
      "targetFidelity": 0.88,
      "targetFit": 0.87,
      "sampleEfficiency": 0.91,
      "naiveYield": 0.91,
      "blindOptimism": 0.28,
      "designHardness": 0.21,
      "leakageRisk": 0.13,
      "molBias": "efficiency_strict",
      "profile": "naive_generative_baseline"
    },
    "expectedSampleEfficient": {
      "mode": "sample_efficient",
      "hitEnrichment": 71.59,
      "efficiencyDiagnosis": 88.77,
      "targetOptScore": 64.69,
      "packIntegrity": 100,
      "baselineScore": 51.88,
      "confidence": 80.35,
      "efficiencyContribution": 80.03,
      "baselineContribution": 55.31,
      "overall": 79.58
    },
    "expectedNaiveGenerativeBaseline": {
      "mode": "naive_generative_baseline",
      "hitEnrichment": 25.72,
      "efficiencyDiagnosis": 25.06,
      "targetOptScore": 22.34,
      "packIntegrity": 45.02,
      "baselineScore": 46.21,
      "confidence": 38.95,
      "efficiencyContribution": 32.87,
      "baselineContribution": 50.68,
      "overall": 44.3
    }
  }
];
