import type { AtlasInput, AtlasQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AtlasInput;
  expectedIntegrated: AtlasQuality;
  expectedFragmented: AtlasQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "af-001",
    "input": {
      "registrationFidelity": 0.29,
      "regionCoverage": 0.25,
      "atlasAlignment": 0.28,
      "quantStability": 0.34,
      "fragmentToolConfidence": 0.39,
      "baselineOptimism": 0.45,
      "workflowHardness": 0.59,
      "overclaimRisk": 0.5,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 22.53,
      "coverageScore": 30.25,
      "alignmentScore": 23.45,
      "quantIntegrity": 37.64,
      "fragmentScore": 16.4,
      "confidence": 20.85,
      "integratedContribution": 27.96,
      "fragmentContribution": 15.92,
      "overall": 29.79
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 5.76,
      "coverageScore": 17.05,
      "alignmentScore": 12.78,
      "quantIntegrity": 32.39,
      "fragmentScore": 40.93,
      "confidence": 17.1,
      "integratedContribution": 21.78,
      "fragmentContribution": 38.57,
      "overall": 27.16
    }
  },
  {
    "id": "af-002",
    "input": {
      "registrationFidelity": 0.33,
      "regionCoverage": 0.29,
      "atlasAlignment": 0.32,
      "quantStability": 0.38,
      "fragmentToolConfidence": 0.43,
      "baselineOptimism": 0.46,
      "workflowHardness": 0.6,
      "overclaimRisk": 0.51,
      "registrationBias": "region_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 22.19,
      "coverageScore": 33.9,
      "alignmentScore": 34.35,
      "quantIntegrity": 31.9,
      "fragmentScore": 18.89,
      "confidence": 24.5,
      "integratedContribution": 30.54,
      "fragmentContribution": 18.58,
      "overall": 32.39
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 2.43,
      "coverageScore": 18.17,
      "alignmentScore": 13.81,
      "quantIntegrity": 34.08,
      "fragmentScore": 31.53,
      "confidence": 18.65,
      "integratedContribution": 20,
      "fragmentContribution": 34.51,
      "overall": 23.46
    }
  },
  {
    "id": "af-003",
    "input": {
      "registrationFidelity": 0.37,
      "regionCoverage": 0.27,
      "atlasAlignment": 0.36,
      "quantStability": 0.42,
      "fragmentToolConfidence": 0.46,
      "baselineOptimism": 0.42,
      "workflowHardness": 0.6,
      "overclaimRisk": 0.46,
      "registrationBias": "fragment_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 12.16,
      "coverageScore": 23.71,
      "alignmentScore": 20.92,
      "quantIntegrity": 19.24,
      "fragmentScore": 19.94,
      "confidence": 27.1,
      "integratedContribution": 18.94,
      "fragmentContribution": 19.65,
      "overall": 20.07
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 12.17,
      "coverageScore": 17.05,
      "alignmentScore": 12.78,
      "quantIntegrity": 33.93,
      "fragmentScore": 54.34,
      "confidence": 18.4,
      "integratedContribution": 26.05,
      "fragmentContribution": 46.55,
      "overall": 34.48
    }
  },
  {
    "id": "af-004",
    "input": {
      "registrationFidelity": 0.33,
      "regionCoverage": 0.32,
      "atlasAlignment": 0.39,
      "quantStability": 0.38,
      "fragmentToolConfidence": 0.42,
      "baselineOptimism": 0.43,
      "workflowHardness": 0.53,
      "overclaimRisk": 0.46,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 28.27,
      "coverageScore": 36.03,
      "alignmentScore": 33.26,
      "quantIntegrity": 42.23,
      "fragmentScore": 18.93,
      "confidence": 25.85,
      "integratedContribution": 34.6,
      "fragmentContribution": 19.24,
      "overall": 35.84
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 8.7,
      "coverageScore": 18.05,
      "alignmentScore": 14.08,
      "quantIntegrity": 32.79,
      "fragmentScore": 42.77,
      "confidence": 18.85,
      "integratedContribution": 23.28,
      "fragmentContribution": 40.35,
      "overall": 29.59
    }
  },
  {
    "id": "af-005",
    "input": {
      "registrationFidelity": 0.37,
      "regionCoverage": 0.36,
      "atlasAlignment": 0.35,
      "quantStability": 0.42,
      "fragmentToolConfidence": 0.46,
      "baselineOptimism": 0.45,
      "workflowHardness": 0.53,
      "overclaimRisk": 0.47,
      "registrationBias": "atlas_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 26.81,
      "coverageScore": 39.64,
      "alignmentScore": 21.33,
      "quantIntegrity": 54.3,
      "fragmentScore": 21.8,
      "confidence": 29.35,
      "integratedContribution": 34.4,
      "fragmentContribution": 22.12,
      "overall": 36.19
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 0,
      "coverageScore": 19.43,
      "alignmentScore": 15.31,
      "quantIntegrity": 34.77,
      "fragmentScore": 32.95,
      "confidence": 21.05,
      "integratedContribution": 20.49,
      "fragmentContribution": 36.26,
      "overall": 25.73
    }
  },
  {
    "id": "af-006",
    "input": {
      "registrationFidelity": 0.41,
      "regionCoverage": 0.34,
      "atlasAlignment": 0.39,
      "quantStability": 0.45,
      "fragmentToolConfidence": 0.5,
      "baselineOptimism": 0.4,
      "workflowHardness": 0.54,
      "overclaimRisk": 0.42,
      "registrationBias": "balanced",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 33.88,
      "coverageScore": 39.5,
      "alignmentScore": 35.78,
      "quantIntegrity": 47.85,
      "fragmentScore": 23.08,
      "confidence": 31.85,
      "integratedContribution": 38.83,
      "fragmentContribution": 23.32,
      "overall": 40.04
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 11.98,
      "coverageScore": 17.95,
      "alignmentScore": 13.91,
      "quantIntegrity": 34.78,
      "fragmentScore": 46.72,
      "confidence": 20.5,
      "integratedContribution": 25.07,
      "fragmentContribution": 43.14,
      "overall": 32.32
    }
  },
  {
    "id": "af-007",
    "input": {
      "registrationFidelity": 0.45,
      "regionCoverage": 0.38,
      "atlasAlignment": 0.42,
      "quantStability": 0.49,
      "fragmentToolConfidence": 0.53,
      "baselineOptimism": 0.42,
      "workflowHardness": 0.55,
      "overclaimRisk": 0.43,
      "registrationBias": "region_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 31.52,
      "coverageScore": 43.11,
      "alignmentScore": 48.27,
      "quantIntegrity": 39.34,
      "fragmentScore": 25.15,
      "confidence": 35.35,
      "integratedContribution": 40.71,
      "fragmentContribution": 25.54,
      "overall": 41.98
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 8.27,
      "coverageScore": 19.21,
      "alignmentScore": 15.09,
      "quantIntegrity": 36.3,
      "fragmentScore": 34.2,
      "confidence": 22.15,
      "integratedContribution": 22.61,
      "fragmentContribution": 37.43,
      "overall": 27.19
    }
  },
  {
    "id": "af-008",
    "input": {
      "registrationFidelity": 0.41,
      "regionCoverage": 0.43,
      "atlasAlignment": 0.46,
      "quantStability": 0.45,
      "fragmentToolConfidence": 0.49,
      "baselineOptimism": 0.43,
      "workflowHardness": 0.47,
      "overclaimRisk": 0.44,
      "registrationBias": "fragment_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 19.43,
      "coverageScore": 35.43,
      "alignmentScore": 27.76,
      "quantIntegrity": 24.76,
      "fragmentScore": 24.32,
      "confidence": 34.1,
      "integratedContribution": 26.78,
      "fragmentContribution": 25.37,
      "overall": 27.53
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 16.4,
      "coverageScore": 20.36,
      "alignmentScore": 16.57,
      "quantIntegrity": 35.17,
      "fragmentScore": 58.5,
      "confidence": 22.7,
      "integratedContribution": 29.4,
      "fragmentContribution": 51.04,
      "overall": 39.88
    }
  },
  {
    "id": "af-009",
    "input": {
      "registrationFidelity": 0.46,
      "regionCoverage": 0.41,
      "atlasAlignment": 0.5,
      "quantStability": 0.49,
      "fragmentToolConfidence": 0.53,
      "baselineOptimism": 0.39,
      "workflowHardness": 0.48,
      "overclaimRisk": 0.38,
      "registrationBias": "balanced",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 40.16,
      "coverageScore": 45.49,
      "alignmentScore": 45.8,
      "quantIntegrity": 52.59,
      "fragmentScore": 25.81,
      "confidence": 37.1,
      "integratedContribution": 45.75,
      "fragmentContribution": 26.81,
      "overall": 46.34
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 14.91,
      "coverageScore": 19.22,
      "alignmentScore": 15.52,
      "quantIntegrity": 35.36,
      "fragmentScore": 48.88,
      "confidence": 22.7,
      "integratedContribution": 26.78,
      "fragmentContribution": 45.34,
      "overall": 35.14
    }
  },
  {
    "id": "af-010",
    "input": {
      "registrationFidelity": 0.5,
      "regionCoverage": 0.45,
      "atlasAlignment": 0.46,
      "quantStability": 0.53,
      "fragmentToolConfidence": 0.57,
      "baselineOptimism": 0.4,
      "workflowHardness": 0.49,
      "overclaimRisk": 0.39,
      "registrationBias": "atlas_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 36.53,
      "coverageScore": 49.14,
      "alignmentScore": 30.54,
      "quantIntegrity": 66.82,
      "fragmentScore": 28.29,
      "confidence": 40.75,
      "integratedContribution": 44.54,
      "fragmentContribution": 29.21,
      "overall": 45.78
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 3.59,
      "coverageScore": 20.03,
      "alignmentScore": 16.17,
      "quantIntegrity": 37.06,
      "fragmentScore": 35.54,
      "confidence": 24.25,
      "integratedContribution": 22.48,
      "fragmentContribution": 38.95,
      "overall": 29.07
    }
  },
  {
    "id": "af-011",
    "input": {
      "registrationFidelity": 0.54,
      "regionCoverage": 0.49,
      "atlasAlignment": 0.49,
      "quantStability": 0.57,
      "fragmentToolConfidence": 0.6,
      "baselineOptimism": 0.42,
      "workflowHardness": 0.49,
      "overclaimRisk": 0.4,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 47.07,
      "coverageScore": 52.75,
      "alignmentScore": 47.04,
      "quantIntegrity": 60.27,
      "fragmentScore": 30.54,
      "confidence": 44.25,
      "integratedContribution": 51.33,
      "fragmentContribution": 31.67,
      "overall": 51.79
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 17.1,
      "coverageScore": 21.44,
      "alignmentScore": 17.52,
      "quantIntegrity": 38.58,
      "fragmentScore": 54.12,
      "confidence": 26.1,
      "integratedContribution": 29.75,
      "fragmentContribution": 50.43,
      "overall": 39.56
    }
  },
  {
    "id": "af-012",
    "input": {
      "registrationFidelity": 0.5,
      "regionCoverage": 0.48,
      "atlasAlignment": 0.53,
      "quantStability": 0.53,
      "fragmentToolConfidence": 0.56,
      "baselineOptimism": 0.37,
      "workflowHardness": 0.42,
      "overclaimRisk": 0.35,
      "registrationBias": "region_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 38.25,
      "coverageScore": 51.28,
      "alignmentScore": 62.01,
      "quantIntegrity": 43.82,
      "fragmentScore": 28.34,
      "confidence": 42.1,
      "integratedContribution": 49.26,
      "fragmentContribution": 29.77,
      "overall": 49.75
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 13.23,
      "coverageScore": 19.78,
      "alignmentScore": 16.29,
      "quantIntegrity": 35.76,
      "fragmentScore": 34.93,
      "confidence": 24.35,
      "integratedContribution": 24,
      "fragmentContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "af-013",
    "input": {
      "registrationFidelity": 0.54,
      "regionCoverage": 0.52,
      "atlasAlignment": 0.56,
      "quantStability": 0.57,
      "fragmentToolConfidence": 0.6,
      "baselineOptimism": 0.39,
      "workflowHardness": 0.42,
      "overclaimRisk": 0.36,
      "registrationBias": "fragment_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 29.17,
      "coverageScore": 44.88,
      "alignmentScore": 36.64,
      "quantIntegrity": 32.66,
      "fragmentScore": 31.2,
      "confidence": 45.6,
      "integratedContribution": 35.8,
      "fragmentContribution": 32.85,
      "overall": 36.27
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 22.62,
      "coverageScore": 21.42,
      "alignmentScore": 17.82,
      "quantIntegrity": 37.74,
      "fragmentScore": 67.02,
      "confidence": 26.55,
      "integratedContribution": 33.32,
      "fragmentContribution": 57.3,
      "overall": 46.5
    }
  },
  {
    "id": "af-014",
    "input": {
      "registrationFidelity": 0.58,
      "regionCoverage": 0.56,
      "atlasAlignment": 0.6,
      "quantStability": 0.61,
      "fragmentToolConfidence": 0.63,
      "baselineOptimism": 0.4,
      "workflowHardness": 0.43,
      "overclaimRisk": 0.36,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 52.67,
      "coverageScore": 58.53,
      "alignmentScore": 56.71,
      "quantIntegrity": 64.86,
      "fragmentScore": 33.07,
      "confidence": 49.25,
      "integratedContribution": 57.89,
      "fragmentContribution": 34.85,
      "overall": 57.74
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 20.03,
      "coverageScore": 22.26,
      "alignmentScore": 18.61,
      "quantIntegrity": 38.98,
      "fragmentScore": 55.96,
      "confidence": 27.85,
      "integratedContribution": 31.17,
      "fragmentContribution": 52.11,
      "overall": 41.9
    }
  },
  {
    "id": "af-015",
    "input": {
      "registrationFidelity": 0.62,
      "regionCoverage": 0.54,
      "atlasAlignment": 0.56,
      "quantStability": 0.65,
      "fragmentToolConfidence": 0.67,
      "baselineOptimism": 0.36,
      "workflowHardness": 0.44,
      "overclaimRisk": 0.31,
      "registrationBias": "atlas_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 45.77,
      "coverageScore": 58.35,
      "alignmentScore": 39.15,
      "quantIntegrity": 79.94,
      "fragmentScore": 34.55,
      "confidence": 51.85,
      "integratedContribution": 54.45,
      "fragmentContribution": 36.06,
      "overall": 55.14
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 9.43,
      "coverageScore": 20.94,
      "alignmentScore": 17.24,
      "quantIntegrity": 39.27,
      "fragmentScore": 38.2,
      "confidence": 27.75,
      "integratedContribution": 25.02,
      "fragmentContribution": 41.8,
      "overall": 32.73
    }
  },
  {
    "id": "af-016",
    "input": {
      "registrationFidelity": 0.58,
      "regionCoverage": 0.59,
      "atlasAlignment": 0.6,
      "quantStability": 0.6,
      "fragmentToolConfidence": 0.63,
      "baselineOptimism": 0.37,
      "workflowHardness": 0.36,
      "overclaimRisk": 0.32,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 54.5,
      "coverageScore": 60.67,
      "alignmentScore": 57.91,
      "quantIntegrity": 65.05,
      "fragmentScore": 33.73,
      "confidence": 50.35,
      "integratedContribution": 59.26,
      "fragmentContribution": 35.81,
      "overall": 59.04
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 22.05,
      "coverageScore": 21.96,
      "alignmentScore": 18.63,
      "quantIntegrity": 38.14,
      "fragmentScore": 55.7,
      "confidence": 28.3,
      "integratedContribution": 31.3,
      "fragmentContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "af-017",
    "input": {
      "registrationFidelity": 0.62,
      "regionCoverage": 0.63,
      "atlasAlignment": 0.63,
      "quantStability": 0.64,
      "fragmentToolConfidence": 0.67,
      "baselineOptimism": 0.39,
      "workflowHardness": 0.37,
      "overclaimRisk": 0.33,
      "registrationBias": "region_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 48.45,
      "coverageScore": 64.28,
      "alignmentScore": 75.16,
      "quantIntegrity": 52.76,
      "fragmentScore": 36.41,
      "confidence": 53.85,
      "integratedContribution": 60.68,
      "fragmentContribution": 38.64,
      "overall": 60.71
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 18.73,
      "coverageScore": 23.45,
      "alignmentScore": 19.98,
      "quantIntegrity": 40.11,
      "fragmentScore": 39.86,
      "confidence": 30.3,
      "integratedContribution": 28.43,
      "fragmentContribution": 44.26,
      "overall": 35.84
    }
  },
  {
    "id": "af-018",
    "input": {
      "registrationFidelity": 0.66,
      "regionCoverage": 0.61,
      "atlasAlignment": 0.67,
      "quantStability": 0.68,
      "fragmentToolConfidence": 0.7,
      "baselineOptimism": 0.34,
      "workflowHardness": 0.38,
      "overclaimRisk": 0.27,
      "registrationBias": "fragment_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 38.35,
      "coverageScore": 54.13,
      "alignmentScore": 45.55,
      "quantIntegrity": 40.09,
      "fragmentScore": 37.08,
      "confidence": 56.6,
      "integratedContribution": 44.54,
      "fragmentContribution": 39.18,
      "overall": 44.58
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 28.36,
      "coverageScore": 21.69,
      "alignmentScore": 18.3,
      "quantIntegrity": 39.67,
      "fragmentScore": 74.27,
      "confidence": 29.5,
      "integratedContribution": 36.46,
      "fragmentContribution": 62.27,
      "overall": 51.93
    }
  },
  {
    "id": "af-019",
    "input": {
      "registrationFidelity": 0.7,
      "regionCoverage": 0.65,
      "atlasAlignment": 0.7,
      "quantStability": 0.72,
      "fragmentToolConfidence": 0.74,
      "baselineOptimism": 0.36,
      "workflowHardness": 0.38,
      "overclaimRisk": 0.28,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 63.81,
      "coverageScore": 67.74,
      "alignmentScore": 68.17,
      "quantIntegrity": 75.07,
      "fragmentScore": 39.94,
      "confidence": 60.1,
      "integratedContribution": 68.45,
      "fragmentContribution": 42.25,
      "overall": 67.73
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 26.25,
      "coverageScore": 23.32,
      "alignmentScore": 19.82,
      "quantIntegrity": 41.65,
      "fragmentScore": 62.07,
      "confidence": 31.7,
      "integratedContribution": 34.62,
      "fragmentContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "af-020",
    "input": {
      "registrationFidelity": 0.66,
      "regionCoverage": 0.7,
      "atlasAlignment": 0.66,
      "quantStability": 0.68,
      "fragmentToolConfidence": 0.7,
      "baselineOptimism": 0.37,
      "workflowHardness": 0.31,
      "overclaimRisk": 0.29,
      "registrationBias": "atlas_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 52.86,
      "coverageScore": 70.06,
      "alignmentScore": 45.74,
      "quantIntegrity": 86.81,
      "fragmentScore": 38.94,
      "confidence": 58.85,
      "integratedContribution": 62.46,
      "fragmentContribution": 41.54,
      "overall": 62.69
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 13.66,
      "coverageScore": 23.93,
      "alignmentScore": 20.65,
      "quantIntegrity": 40.51,
      "fragmentScore": 40.86,
      "confidence": 32.05,
      "integratedContribution": 27.92,
      "fragmentContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "af-021",
    "input": {
      "registrationFidelity": 0.7,
      "regionCoverage": 0.68,
      "atlasAlignment": 0.7,
      "quantStability": 0.72,
      "fragmentToolConfidence": 0.73,
      "baselineOptimism": 0.33,
      "workflowHardness": 0.31,
      "overclaimRisk": 0.24,
      "registrationBias": "balanced",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 65.6,
      "coverageScore": 69.88,
      "alignmentScore": 69.32,
      "quantIntegrity": 75.82,
      "fragmentScore": 39.99,
      "confidence": 61.45,
      "integratedContribution": 69.92,
      "fragmentContribution": 42.54,
      "overall": 68.99
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 27.89,
      "coverageScore": 22.72,
      "alignmentScore": 19.52,
      "quantIntegrity": 40.35,
      "fragmentScore": 61.19,
      "confidence": 31.8,
      "integratedContribution": 34.33,
      "fragmentContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "af-022",
    "input": {
      "registrationFidelity": 0.74,
      "regionCoverage": 0.72,
      "atlasAlignment": 0.73,
      "quantStability": 0.76,
      "fragmentToolConfidence": 0.77,
      "baselineOptimism": 0.34,
      "workflowHardness": 0.32,
      "overclaimRisk": 0.25,
      "registrationBias": "region_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 57.6,
      "coverageScore": 73.52,
      "alignmentScore": 88.84,
      "quantIntegrity": 60.51,
      "fragmentScore": 42.47,
      "confidence": 65.1,
      "integratedContribution": 70.81,
      "fragmentContribution": 45.13,
      "overall": 70.19
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 24.57,
      "coverageScore": 23.77,
      "alignmentScore": 20.46,
      "quantIntegrity": 42.05,
      "fragmentScore": 42.21,
      "confidence": 33.35,
      "integratedContribution": 30.61,
      "fragmentContribution": 46.55,
      "overall": 38.98
    }
  },
  {
    "id": "af-023",
    "input": {
      "registrationFidelity": 0.79,
      "regionCoverage": 0.76,
      "atlasAlignment": 0.77,
      "quantStability": 0.8,
      "fragmentToolConfidence": 0.81,
      "baselineOptimism": 0.36,
      "workflowHardness": 0.33,
      "overclaimRisk": 0.25,
      "registrationBias": "fragment_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 49.01,
      "coverageScore": 67.38,
      "alignmentScore": 53.71,
      "quantIntegrity": 49.49,
      "fragmentScore": 45.16,
      "confidence": 69,
      "integratedContribution": 54.84,
      "fragmentContribution": 47.99,
      "overall": 54.61
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 33.86,
      "coverageScore": 25.2,
      "alignmentScore": 21.84,
      "quantIntegrity": 43.92,
      "fragmentScore": 84.72,
      "confidence": 35.45,
      "integratedContribution": 41.91,
      "fragmentContribution": 71.31,
      "overall": 60.7
    }
  },
  {
    "id": "af-024",
    "input": {
      "registrationFidelity": 0.75,
      "regionCoverage": 0.75,
      "atlasAlignment": 0.81,
      "quantStability": 0.76,
      "fragmentToolConfidence": 0.77,
      "baselineOptimism": 0.31,
      "workflowHardness": 0.25,
      "overclaimRisk": 0.2,
      "registrationBias": "balanced",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 71.63,
      "coverageScore": 75.91,
      "alignmentScore": 79.08,
      "quantIntegrity": 80.56,
      "fragmentScore": 43.13,
      "confidence": 66.85,
      "integratedContribution": 76.71,
      "fragmentContribution": 46.16,
      "overall": 75.21
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 31.21,
      "coverageScore": 23.47,
      "alignmentScore": 20.52,
      "quantIntegrity": 41.11,
      "fragmentScore": 63.65,
      "confidence": 33.9,
      "integratedContribution": 35.99,
      "fragmentContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "af-025",
    "input": {
      "registrationFidelity": 0.79,
      "regionCoverage": 0.79,
      "atlasAlignment": 0.77,
      "quantStability": 0.8,
      "fragmentToolConfidence": 0.8,
      "baselineOptimism": 0.33,
      "workflowHardness": 0.26,
      "overclaimRisk": 0.21,
      "registrationBias": "atlas_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 62.49,
      "coverageScore": 79.52,
      "alignmentScore": 54.83,
      "quantIntegrity": 100,
      "fragmentScore": 45.2,
      "confidence": 70.35,
      "integratedContribution": 72.68,
      "fragmentContribution": 48.24,
      "overall": 72.28
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 19.5,
      "coverageScore": 24.56,
      "alignmentScore": 21.5,
      "quantIntegrity": 42.63,
      "fragmentScore": 43.52,
      "confidence": 35.55,
      "integratedContribution": 30.34,
      "fragmentContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "af-026",
    "input": {
      "registrationFidelity": 0.83,
      "regionCoverage": 0.83,
      "atlasAlignment": 0.8,
      "quantStability": 0.83,
      "fragmentToolConfidence": 0.84,
      "baselineOptimism": 0.34,
      "workflowHardness": 0.27,
      "overclaimRisk": 0.22,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 78.48,
      "coverageScore": 83.17,
      "alignmentScore": 80.25,
      "quantIntegrity": 87.68,
      "fragmentScore": 47.68,
      "confidence": 73.75,
      "integratedContribution": 82.13,
      "fragmentContribution": 50.82,
      "overall": 80.49
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 33.17,
      "coverageScore": 25.61,
      "alignmentScore": 22.47,
      "quantIntegrity": 44.32,
      "fragmentScore": 68.8,
      "confidence": 37.1,
      "integratedContribution": 38.87,
      "fragmentContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "af-027",
    "input": {
      "registrationFidelity": 0.87,
      "regionCoverage": 0.81,
      "atlasAlignment": 0.84,
      "quantStability": 0.87,
      "fragmentToolConfidence": 0.88,
      "baselineOptimism": 0.3,
      "workflowHardness": 0.27,
      "overclaimRisk": 0.17,
      "registrationBias": "region_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 67.22,
      "coverageScore": 82.98,
      "alignmentScore": 100,
      "quantIntegrity": 68.1,
      "fragmentScore": 49.35,
      "confidence": 76.35,
      "integratedContribution": 80.37,
      "fragmentContribution": 52.46,
      "overall": 79.35
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 30.78,
      "coverageScore": 24.64,
      "alignmentScore": 21.53,
      "quantIntegrity": 44.62,
      "fragmentScore": 45.22,
      "confidence": 37.2,
      "integratedContribution": 33.36,
      "fragmentContribution": 49.68,
      "overall": 42.91
    }
  },
  {
    "id": "af-028",
    "input": {
      "registrationFidelity": 0.83,
      "regionCoverage": 0.86,
      "atlasAlignment": 0.87,
      "quantStability": 0.83,
      "fragmentToolConfidence": 0.84,
      "baselineOptimism": 0.31,
      "workflowHardness": 0.2,
      "overclaimRisk": 0.17,
      "registrationBias": "fragment_first",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 54.91,
      "coverageScore": 75.3,
      "alignmentScore": 60.67,
      "quantIntegrity": 53.51,
      "fragmentScore": 48.34,
      "confidence": 75.1,
      "integratedContribution": 61.11,
      "fragmentContribution": 51.78,
      "overall": 60.43
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 38.81,
      "coverageScore": 25.31,
      "alignmentScore": 22.44,
      "quantIntegrity": 43.48,
      "fragmentScore": 86.95,
      "confidence": 37.65,
      "integratedContribution": 43.4,
      "fragmentContribution": 72.62,
      "overall": 63.57
    }
  },
  {
    "id": "af-029",
    "input": {
      "registrationFidelity": 0.87,
      "regionCoverage": 0.9,
      "atlasAlignment": 0.91,
      "quantStability": 0.87,
      "fragmentToolConfidence": 0.87,
      "baselineOptimism": 0.33,
      "workflowHardness": 0.2,
      "overclaimRisk": 0.18,
      "registrationBias": "balanced",
      "profile": "integrated_atlas_workflow"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 83.93,
      "coverageScore": 88.91,
      "alignmentScore": 89.77,
      "quantIntegrity": 92.27,
      "fragmentScore": 50.59,
      "confidence": 78.6,
      "integratedContribution": 88.6,
      "fragmentContribution": 54.2,
      "overall": 86.41
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 36.33,
      "coverageScore": 26.66,
      "alignmentScore": 23.73,
      "quantIntegrity": 45,
      "fragmentScore": 71.06,
      "confidence": 39.5,
      "integratedContribution": 40.56,
      "fragmentContribution": 65.11,
      "overall": 57.03
    }
  },
  {
    "id": "af-030",
    "input": {
      "registrationFidelity": 0.91,
      "regionCoverage": 0.88,
      "atlasAlignment": 0.87,
      "quantStability": 0.91,
      "fragmentToolConfidence": 0.91,
      "baselineOptimism": 0.28,
      "workflowHardness": 0.21,
      "overclaimRisk": 0.13,
      "registrationBias": "atlas_first",
      "profile": "fragmented_multi_tool_baseline"
    },
    "expectedIntegrated": {
      "mode": "integrated_atlas_workflow",
      "registrationScore": 71.56,
      "coverageScore": 88.77,
      "alignmentScore": 63.21,
      "quantIntegrity": 100,
      "fragmentScore": 51.88,
      "confidence": 81.35,
      "integratedContribution": 79.61,
      "fragmentContribution": 55.26,
      "overall": 79.23
    },
    "expectedFragmented": {
      "mode": "fragmented_multi_tool_baseline",
      "registrationScore": 25.72,
      "coverageScore": 25,
      "alignmentScore": 22.06,
      "quantIntegrity": 45.02,
      "fragmentScore": 46.21,
      "confidence": 38.95,
      "integratedContribution": 32.8,
      "fragmentContribution": 50.65,
      "overall": 44.26
    }
  }
];
