import type { SurveilGateInput, SurveilGateQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SurveilGateInput;
  expectedTrust: SurveilGateQuality;
  expectedExplain: SurveilGateQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "sg-001",
    "input": {
      "pillarCoverage": 0.29,
      "policyCompleteness": 0.25,
      "signalIntegrity": 0.28,
      "packReadiness": 0.34,
      "explainOnlyAdherence": 0.39,
      "hallucinationHardness": 0.59,
      "trustErosionRisk": 0.45,
      "overclaimRisk": 0.5,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 23.37,
      "policyScore": 30.25,
      "signalScore": 22.89,
      "readinessScore": 37.64,
      "explainOnlyScore": 16.4,
      "confidence": 17.95,
      "trustContribution": 28.16,
      "explainContribution": 15.92,
      "overall": 29.96
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 5.76,
      "policyScore": 17.37,
      "signalScore": 12.78,
      "readinessScore": 32.39,
      "explainOnlyScore": 40.93,
      "confidence": 17.1,
      "trustContribution": 21.85,
      "explainContribution": 38.57,
      "overall": 27.17
    }
  },
  {
    "id": "sg-002",
    "input": {
      "pillarCoverage": 0.33,
      "policyCompleteness": 0.29,
      "signalIntegrity": 0.32,
      "packReadiness": 0.38,
      "explainOnlyAdherence": 0.43,
      "hallucinationHardness": 0.6,
      "trustErosionRisk": 0.46,
      "overclaimRisk": 0.51,
      "governanceBias": "policy_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 29.47,
      "policyScore": 33.9,
      "signalScore": 17.16,
      "readinessScore": 48.93,
      "explainOnlyScore": 18.89,
      "confidence": 21.2,
      "trustContribution": 31.46,
      "explainContribution": 18.58,
      "overall": 33.14
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 2.43,
      "policyScore": 18.49,
      "signalScore": 13.81,
      "readinessScore": 34.08,
      "explainOnlyScore": 31.53,
      "confidence": 18.65,
      "trustContribution": 20.07,
      "explainContribution": 34.51,
      "overall": 23.47
    }
  },
  {
    "id": "sg-003",
    "input": {
      "pillarCoverage": 0.37,
      "policyCompleteness": 0.27,
      "signalIntegrity": 0.36,
      "packReadiness": 0.42,
      "explainOnlyAdherence": 0.46,
      "hallucinationHardness": 0.6,
      "trustErosionRisk": 0.42,
      "overclaimRisk": 0.46,
      "governanceBias": "explain_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 8.22,
      "policyScore": 23.71,
      "signalScore": 19.52,
      "readinessScore": 19.24,
      "explainOnlyScore": 19.94,
      "confidence": 23.4,
      "trustContribution": 17.84,
      "explainContribution": 19.65,
      "overall": 19.17
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 12.17,
      "policyScore": 17.85,
      "signalScore": 12.78,
      "readinessScore": 33.93,
      "explainOnlyScore": 54.34,
      "confidence": 18.4,
      "trustContribution": 26.21,
      "explainContribution": 46.55,
      "overall": 34.52
    }
  },
  {
    "id": "sg-004",
    "input": {
      "pillarCoverage": 0.33,
      "policyCompleteness": 0.32,
      "signalIntegrity": 0.39,
      "packReadiness": 0.38,
      "explainOnlyAdherence": 0.42,
      "hallucinationHardness": 0.53,
      "trustErosionRisk": 0.43,
      "overclaimRisk": 0.46,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 30.23,
      "policyScore": 36.03,
      "signalScore": 33.12,
      "readinessScore": 42.23,
      "explainOnlyScore": 18.93,
      "confidence": 22.55,
      "trustContribution": 35.19,
      "explainContribution": 19.24,
      "overall": 36.32
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 8.7,
      "policyScore": 18.13,
      "signalScore": 14.08,
      "readinessScore": 32.79,
      "explainOnlyScore": 42.77,
      "confidence": 18.85,
      "trustContribution": 23.29,
      "explainContribution": 40.35,
      "overall": 29.6
    }
  },
  {
    "id": "sg-005",
    "input": {
      "pillarCoverage": 0.37,
      "policyCompleteness": 0.36,
      "signalIntegrity": 0.35,
      "packReadiness": 0.42,
      "explainOnlyAdherence": 0.46,
      "hallucinationHardness": 0.53,
      "trustErosionRisk": 0.45,
      "overclaimRisk": 0.47,
      "governanceBias": "pillar_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 34.45,
      "policyScore": 39.64,
      "signalScore": 39.38,
      "readinessScore": 35.49,
      "explainOnlyScore": 21.8,
      "confidence": 25.65,
      "trustContribution": 37.41,
      "explainContribution": 22.12,
      "overall": 38.66
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 0,
      "policyScore": 19.51,
      "signalScore": 15.31,
      "readinessScore": 34.77,
      "explainOnlyScore": 32.95,
      "confidence": 21.05,
      "trustContribution": 20.51,
      "explainContribution": 36.26,
      "overall": 25.74
    }
  },
  {
    "id": "sg-006",
    "input": {
      "pillarCoverage": 0.41,
      "policyCompleteness": 0.34,
      "signalIntegrity": 0.39,
      "packReadiness": 0.45,
      "explainOnlyAdherence": 0.5,
      "hallucinationHardness": 0.54,
      "trustErosionRisk": 0.4,
      "overclaimRisk": 0.42,
      "governanceBias": "balanced",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 35.28,
      "policyScore": 39.5,
      "signalScore": 34.8,
      "readinessScore": 47.85,
      "explainOnlyScore": 23.08,
      "confidence": 27.75,
      "trustContribution": 39.01,
      "explainContribution": 23.32,
      "overall": 40.19
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 11.98,
      "policyScore": 18.51,
      "signalScore": 13.91,
      "readinessScore": 34.78,
      "explainOnlyScore": 46.72,
      "confidence": 20.5,
      "trustContribution": 25.18,
      "explainContribution": 43.14,
      "overall": 32.35
    }
  },
  {
    "id": "sg-007",
    "input": {
      "pillarCoverage": 0.45,
      "policyCompleteness": 0.38,
      "signalIntegrity": 0.42,
      "packReadiness": 0.49,
      "explainOnlyAdherence": 0.53,
      "hallucinationHardness": 0.55,
      "trustErosionRisk": 0.42,
      "overclaimRisk": 0.43,
      "governanceBias": "policy_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 42.35,
      "policyScore": 43.11,
      "signalScore": 25.46,
      "readinessScore": 61.29,
      "explainOnlyScore": 25.15,
      "confidence": 30.85,
      "trustContribution": 41.99,
      "explainContribution": 25.54,
      "overall": 43.03
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 8.27,
      "policyScore": 19.77,
      "signalScore": 15.09,
      "readinessScore": 36.3,
      "explainOnlyScore": 34.2,
      "confidence": 22.15,
      "trustContribution": 22.73,
      "explainContribution": 37.43,
      "overall": 27.22
    }
  },
  {
    "id": "sg-008",
    "input": {
      "pillarCoverage": 0.41,
      "policyCompleteness": 0.43,
      "signalIntegrity": 0.46,
      "packReadiness": 0.45,
      "explainOnlyAdherence": 0.49,
      "hallucinationHardness": 0.47,
      "trustErosionRisk": 0.43,
      "overclaimRisk": 0.44,
      "governanceBias": "explain_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 12.47,
      "policyScore": 35.43,
      "signalScore": 28.04,
      "readinessScore": 24.76,
      "explainOnlyScore": 24.32,
      "confidence": 30,
      "trustContribution": 25.5,
      "explainContribution": 25.37,
      "overall": 26.48
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 16.4,
      "policyScore": 20.2,
      "signalScore": 16.57,
      "readinessScore": 35.17,
      "explainOnlyScore": 58.5,
      "confidence": 22.7,
      "trustContribution": 29.37,
      "explainContribution": 51.04,
      "overall": 39.87
    }
  },
  {
    "id": "sg-009",
    "input": {
      "pillarCoverage": 0.46,
      "policyCompleteness": 0.41,
      "signalIntegrity": 0.5,
      "packReadiness": 0.49,
      "explainOnlyAdherence": 0.53,
      "hallucinationHardness": 0.48,
      "trustErosionRisk": 0.39,
      "overclaimRisk": 0.38,
      "governanceBias": "balanced",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 42.68,
      "policyScore": 45.49,
      "signalScore": 45.1,
      "readinessScore": 52.59,
      "explainOnlyScore": 25.81,
      "confidence": 32.5,
      "trustContribution": 46.27,
      "explainContribution": 26.81,
      "overall": 46.77
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 14.91,
      "policyScore": 19.62,
      "signalScore": 15.52,
      "readinessScore": 35.36,
      "explainOnlyScore": 48.88,
      "confidence": 22.7,
      "trustContribution": 26.86,
      "explainContribution": 45.34,
      "overall": 35.15
    }
  },
  {
    "id": "sg-010",
    "input": {
      "pillarCoverage": 0.5,
      "policyCompleteness": 0.45,
      "signalIntegrity": 0.46,
      "packReadiness": 0.53,
      "explainOnlyAdherence": 0.57,
      "hallucinationHardness": 0.49,
      "trustErosionRisk": 0.4,
      "overclaimRisk": 0.39,
      "governanceBias": "pillar_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 48.19,
      "policyScore": 49.14,
      "signalScore": 53.74,
      "readinessScore": 43.07,
      "explainOnlyScore": 28.29,
      "confidence": 35.75,
      "trustContribution": 48.86,
      "explainContribution": 29.21,
      "overall": 49.32
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 3.59,
      "policyScore": 20.43,
      "signalScore": 16.17,
      "readinessScore": 37.06,
      "explainOnlyScore": 35.54,
      "confidence": 24.25,
      "trustContribution": 22.56,
      "explainContribution": 38.95,
      "overall": 29.08
    }
  },
  {
    "id": "sg-011",
    "input": {
      "pillarCoverage": 0.54,
      "policyCompleteness": 0.49,
      "signalIntegrity": 0.49,
      "packReadiness": 0.57,
      "explainOnlyAdherence": 0.6,
      "hallucinationHardness": 0.49,
      "trustErosionRisk": 0.42,
      "overclaimRisk": 0.4,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 47.07,
      "policyScore": 52.75,
      "signalScore": 46.34,
      "readinessScore": 60.27,
      "explainOnlyScore": 30.54,
      "confidence": 38.85,
      "trustContribution": 51.25,
      "explainContribution": 31.67,
      "overall": 51.73
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 17.1,
      "policyScore": 21.84,
      "signalScore": 17.52,
      "readinessScore": 38.58,
      "explainOnlyScore": 54.12,
      "confidence": 26.1,
      "trustContribution": 29.83,
      "explainContribution": 50.43,
      "overall": 39.58
    }
  },
  {
    "id": "sg-012",
    "input": {
      "pillarCoverage": 0.5,
      "policyCompleteness": 0.48,
      "signalIntegrity": 0.53,
      "packReadiness": 0.53,
      "explainOnlyAdherence": 0.56,
      "hallucinationHardness": 0.42,
      "trustErosionRisk": 0.37,
      "overclaimRisk": 0.35,
      "governanceBias": "policy_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 51.69,
      "policyScore": 51.28,
      "signalScore": 34.19,
      "readinessScore": 67.57,
      "explainOnlyScore": 28.34,
      "confidence": 37.1,
      "trustContribution": 50.18,
      "explainContribution": 29.77,
      "overall": 50.51
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 13.23,
      "policyScore": 19.94,
      "signalScore": 16.29,
      "readinessScore": 35.76,
      "explainOnlyScore": 34.93,
      "confidence": 24.35,
      "trustContribution": 24.03,
      "explainContribution": 38.2,
      "overall": 29.62
    }
  },
  {
    "id": "sg-013",
    "input": {
      "pillarCoverage": 0.54,
      "policyCompleteness": 0.52,
      "signalIntegrity": 0.56,
      "packReadiness": 0.57,
      "explainOnlyAdherence": 0.6,
      "hallucinationHardness": 0.42,
      "trustErosionRisk": 0.39,
      "overclaimRisk": 0.36,
      "governanceBias": "explain_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 19.73,
      "policyScore": 44.88,
      "signalScore": 36.36,
      "readinessScore": 32.66,
      "explainOnlyScore": 31.2,
      "confidence": 40.2,
      "trustContribution": 33.77,
      "explainContribution": 32.85,
      "overall": 34.6
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 22.62,
      "policyScore": 21.58,
      "signalScore": 17.82,
      "readinessScore": 37.74,
      "explainOnlyScore": 67.02,
      "confidence": 26.55,
      "trustContribution": 33.36,
      "explainContribution": 57.3,
      "overall": 46.51
    }
  },
  {
    "id": "sg-014",
    "input": {
      "pillarCoverage": 0.58,
      "policyCompleteness": 0.56,
      "signalIntegrity": 0.6,
      "packReadiness": 0.61,
      "explainOnlyAdherence": 0.63,
      "hallucinationHardness": 0.43,
      "trustErosionRisk": 0.4,
      "overclaimRisk": 0.36,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 53.79,
      "policyScore": 58.53,
      "signalScore": 56.43,
      "readinessScore": 64.86,
      "explainOnlyScore": 33.07,
      "confidence": 43.45,
      "trustContribution": 58.2,
      "explainContribution": 34.85,
      "overall": 58
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 20.03,
      "policyScore": 22.42,
      "signalScore": 18.61,
      "readinessScore": 38.98,
      "explainOnlyScore": 55.96,
      "confidence": 27.85,
      "trustContribution": 31.2,
      "explainContribution": 52.11,
      "overall": 41.91
    }
  },
  {
    "id": "sg-015",
    "input": {
      "pillarCoverage": 0.62,
      "policyCompleteness": 0.54,
      "signalIntegrity": 0.56,
      "packReadiness": 0.65,
      "explainOnlyAdherence": 0.67,
      "hallucinationHardness": 0.44,
      "trustErosionRisk": 0.36,
      "overclaimRisk": 0.31,
      "governanceBias": "pillar_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 60.96,
      "policyScore": 58.35,
      "signalScore": 67.13,
      "readinessScore": 50.82,
      "explainOnlyScore": 34.55,
      "confidence": 45.65,
      "trustContribution": 59.78,
      "explainContribution": 36.06,
      "overall": 59.51
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 9.43,
      "policyScore": 21.58,
      "signalScore": 17.24,
      "readinessScore": 39.27,
      "explainOnlyScore": 38.2,
      "confidence": 27.75,
      "trustContribution": 25.14,
      "explainContribution": 41.8,
      "overall": 32.75
    }
  },
  {
    "id": "sg-016",
    "input": {
      "pillarCoverage": 0.58,
      "policyCompleteness": 0.59,
      "signalIntegrity": 0.6,
      "packReadiness": 0.6,
      "explainOnlyAdherence": 0.63,
      "hallucinationHardness": 0.36,
      "trustErosionRisk": 0.37,
      "overclaimRisk": 0.32,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 54.78,
      "policyScore": 60.67,
      "signalScore": 58.05,
      "readinessScore": 65.05,
      "explainOnlyScore": 33.73,
      "confidence": 44.55,
      "trustContribution": 59.49,
      "explainContribution": 35.81,
      "overall": 59.23
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 22.05,
      "policyScore": 21.88,
      "signalScore": 18.63,
      "readinessScore": 38.14,
      "explainOnlyScore": 55.7,
      "confidence": 28.3,
      "trustContribution": 31.28,
      "explainContribution": 51.6,
      "overall": 42.33
    }
  },
  {
    "id": "sg-017",
    "input": {
      "pillarCoverage": 0.62,
      "policyCompleteness": 0.63,
      "signalIntegrity": 0.63,
      "packReadiness": 0.64,
      "explainOnlyAdherence": 0.67,
      "hallucinationHardness": 0.37,
      "trustErosionRisk": 0.39,
      "overclaimRisk": 0.33,
      "governanceBias": "policy_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 64.04,
      "policyScore": 64.28,
      "signalScore": 42.56,
      "readinessScore": 81.43,
      "explainOnlyScore": 36.41,
      "confidence": 47.65,
      "trustContribution": 61.91,
      "explainContribution": 38.64,
      "overall": 61.72
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 18.73,
      "policyScore": 23.37,
      "signalScore": 19.98,
      "readinessScore": 40.11,
      "explainOnlyScore": 39.86,
      "confidence": 30.3,
      "trustContribution": 28.41,
      "explainContribution": 44.26,
      "overall": 35.83
    }
  },
  {
    "id": "sg-018",
    "input": {
      "pillarCoverage": 0.66,
      "policyCompleteness": 0.61,
      "signalIntegrity": 0.67,
      "packReadiness": 0.68,
      "explainOnlyAdherence": 0.7,
      "hallucinationHardness": 0.38,
      "trustErosionRisk": 0.34,
      "overclaimRisk": 0.27,
      "governanceBias": "explain_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 26.77,
      "policyScore": 54.13,
      "signalScore": 44.85,
      "readinessScore": 40.09,
      "explainOnlyScore": 37.08,
      "confidence": 50,
      "trustContribution": 41.88,
      "explainContribution": 39.18,
      "overall": 42.39
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 28.36,
      "policyScore": 22.09,
      "signalScore": 18.3,
      "readinessScore": 39.67,
      "explainOnlyScore": 74.27,
      "confidence": 29.5,
      "trustContribution": 36.54,
      "explainContribution": 62.27,
      "overall": 51.95
    }
  },
  {
    "id": "sg-019",
    "input": {
      "pillarCoverage": 0.7,
      "policyCompleteness": 0.65,
      "signalIntegrity": 0.7,
      "packReadiness": 0.72,
      "explainOnlyAdherence": 0.74,
      "hallucinationHardness": 0.38,
      "trustErosionRisk": 0.36,
      "overclaimRisk": 0.28,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 65.21,
      "policyScore": 67.74,
      "signalScore": 67.47,
      "readinessScore": 75.07,
      "explainOnlyScore": 39.94,
      "confidence": 53.1,
      "trustContribution": 68.67,
      "explainContribution": 42.25,
      "overall": 67.91
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 26.25,
      "policyScore": 23.72,
      "signalScore": 19.82,
      "readinessScore": 41.65,
      "explainOnlyScore": 62.07,
      "confidence": 31.7,
      "trustContribution": 34.7,
      "explainContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "sg-020",
    "input": {
      "pillarCoverage": 0.66,
      "policyCompleteness": 0.7,
      "signalIntegrity": 0.66,
      "packReadiness": 0.68,
      "explainOnlyAdherence": 0.7,
      "hallucinationHardness": 0.31,
      "trustErosionRisk": 0.37,
      "overclaimRisk": 0.29,
      "governanceBias": "pillar_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 68.73,
      "policyScore": 70.06,
      "signalScore": 80.6,
      "readinessScore": 56.34,
      "explainOnlyScore": 38.94,
      "confidence": 52.25,
      "trustContribution": 69.67,
      "explainContribution": 41.54,
      "overall": 68.61
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 13.66,
      "policyScore": 23.61,
      "signalScore": 20.65,
      "readinessScore": 40.51,
      "explainOnlyScore": 40.86,
      "confidence": 32.05,
      "trustContribution": 27.86,
      "explainContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "sg-021",
    "input": {
      "pillarCoverage": 0.7,
      "policyCompleteness": 0.68,
      "signalIntegrity": 0.7,
      "packReadiness": 0.72,
      "explainOnlyAdherence": 0.73,
      "hallucinationHardness": 0.31,
      "trustErosionRisk": 0.33,
      "overclaimRisk": 0.24,
      "governanceBias": "balanced",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 66.16,
      "policyScore": 69.88,
      "signalScore": 69.04,
      "readinessScore": 75.82,
      "explainOnlyScore": 39.99,
      "confidence": 54.45,
      "trustContribution": 70.06,
      "explainContribution": 42.54,
      "overall": 69.11
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 27.89,
      "policyScore": 22.88,
      "signalScore": 19.52,
      "readinessScore": 40.35,
      "explainOnlyScore": 61.19,
      "confidence": 31.8,
      "trustContribution": 34.37,
      "explainContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "sg-022",
    "input": {
      "pillarCoverage": 0.74,
      "policyCompleteness": 0.72,
      "signalIntegrity": 0.73,
      "packReadiness": 0.76,
      "explainOnlyAdherence": 0.77,
      "hallucinationHardness": 0.32,
      "trustErosionRisk": 0.34,
      "overclaimRisk": 0.25,
      "governanceBias": "policy_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 76.68,
      "policyScore": 73.52,
      "signalScore": 50.62,
      "readinessScore": 94.56,
      "explainOnlyScore": 42.47,
      "confidence": 57.7,
      "trustContribution": 72.5,
      "explainContribution": 45.13,
      "overall": 71.57
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 24.57,
      "policyScore": 23.93,
      "signalScore": 20.46,
      "readinessScore": 42.05,
      "explainOnlyScore": 42.21,
      "confidence": 33.35,
      "trustContribution": 30.64,
      "explainContribution": 46.55,
      "overall": 38.99
    }
  },
  {
    "id": "sg-023",
    "input": {
      "pillarCoverage": 0.79,
      "policyCompleteness": 0.76,
      "signalIntegrity": 0.77,
      "packReadiness": 0.8,
      "explainOnlyAdherence": 0.81,
      "hallucinationHardness": 0.33,
      "trustErosionRisk": 0.36,
      "overclaimRisk": 0.25,
      "governanceBias": "explain_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 33.6,
      "policyScore": 67.38,
      "signalScore": 53.29,
      "readinessScore": 49.49,
      "explainOnlyScore": 45.16,
      "confidence": 61.1,
      "trustContribution": 51.39,
      "explainContribution": 47.99,
      "overall": 51.78
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 33.86,
      "policyScore": 25.44,
      "signalScore": 21.84,
      "readinessScore": 43.92,
      "explainOnlyScore": 84.72,
      "confidence": 35.45,
      "trustContribution": 41.96,
      "explainContribution": 71.31,
      "overall": 60.71
    }
  },
  {
    "id": "sg-024",
    "input": {
      "pillarCoverage": 0.75,
      "policyCompleteness": 0.75,
      "signalIntegrity": 0.81,
      "packReadiness": 0.76,
      "explainOnlyAdherence": 0.77,
      "hallucinationHardness": 0.25,
      "trustErosionRisk": 0.31,
      "overclaimRisk": 0.2,
      "governanceBias": "balanced",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 73.31,
      "policyScore": 75.91,
      "signalScore": 79.08,
      "readinessScore": 80.56,
      "explainOnlyScore": 43.13,
      "confidence": 59.35,
      "trustContribution": 77.2,
      "explainContribution": 46.16,
      "overall": 75.61
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 31.21,
      "policyScore": 23.47,
      "signalScore": 20.52,
      "readinessScore": 41.11,
      "explainOnlyScore": 63.65,
      "confidence": 33.9,
      "trustContribution": 35.99,
      "explainContribution": 58.02,
      "overall": 49.97
    }
  },
  {
    "id": "sg-025",
    "input": {
      "pillarCoverage": 0.79,
      "policyCompleteness": 0.79,
      "signalIntegrity": 0.77,
      "packReadiness": 0.8,
      "explainOnlyAdherence": 0.8,
      "hallucinationHardness": 0.26,
      "trustErosionRisk": 0.33,
      "overclaimRisk": 0.21,
      "governanceBias": "pillar_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 82.34,
      "policyScore": 79.52,
      "signalScore": 94.85,
      "readinessScore": 64.24,
      "explainOnlyScore": 45.2,
      "confidence": 62.45,
      "trustContribution": 81.13,
      "explainContribution": 48.24,
      "overall": 79.21
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 19.5,
      "policyScore": 24.56,
      "signalScore": 21.5,
      "readinessScore": 42.63,
      "explainOnlyScore": 43.52,
      "confidence": 35.55,
      "trustContribution": 30.34,
      "explainContribution": 48.04,
      "overall": 40.81
    }
  },
  {
    "id": "sg-026",
    "input": {
      "pillarCoverage": 0.83,
      "policyCompleteness": 0.83,
      "signalIntegrity": 0.8,
      "packReadiness": 0.83,
      "explainOnlyAdherence": 0.84,
      "hallucinationHardness": 0.27,
      "trustErosionRisk": 0.34,
      "overclaimRisk": 0.22,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 77.64,
      "policyScore": 83.17,
      "signalScore": 80.25,
      "readinessScore": 87.68,
      "explainOnlyScore": 47.68,
      "confidence": 65.45,
      "trustContribution": 82.02,
      "explainContribution": 50.82,
      "overall": 80.4
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 33.17,
      "policyScore": 25.61,
      "signalScore": 22.47,
      "readinessScore": 44.32,
      "explainOnlyScore": 68.8,
      "confidence": 37.1,
      "trustContribution": 38.87,
      "explainContribution": 63,
      "overall": 54.21
    }
  },
  {
    "id": "sg-027",
    "input": {
      "pillarCoverage": 0.87,
      "policyCompleteness": 0.81,
      "signalIntegrity": 0.84,
      "packReadiness": 0.87,
      "explainOnlyAdherence": 0.88,
      "hallucinationHardness": 0.27,
      "trustErosionRisk": 0.3,
      "overclaimRisk": 0.17,
      "governanceBias": "policy_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 90.29,
      "policyScore": 82.98,
      "signalScore": 59.14,
      "readinessScore": 100,
      "explainOnlyScore": 49.35,
      "confidence": 67.65,
      "trustContribution": 81.8,
      "explainContribution": 52.46,
      "overall": 80.52
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 30.78,
      "policyScore": 25.12,
      "signalScore": 21.53,
      "readinessScore": 44.62,
      "explainOnlyScore": 45.22,
      "confidence": 37.2,
      "trustContribution": 33.45,
      "explainContribution": 49.68,
      "overall": 42.93
    }
  },
  {
    "id": "sg-028",
    "input": {
      "pillarCoverage": 0.83,
      "policyCompleteness": 0.86,
      "signalIntegrity": 0.87,
      "packReadiness": 0.83,
      "explainOnlyAdherence": 0.84,
      "hallucinationHardness": 0.2,
      "trustErosionRisk": 0.31,
      "overclaimRisk": 0.17,
      "governanceBias": "explain_first",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 37.95,
      "policyScore": 75.3,
      "signalScore": 61.09,
      "readinessScore": 53.51,
      "explainOnlyScore": 48.34,
      "confidence": 66.8,
      "trustContribution": 57.56,
      "explainContribution": 51.78,
      "overall": 57.52
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 38.81,
      "policyScore": 25.07,
      "signalScore": 22.44,
      "readinessScore": 43.48,
      "explainOnlyScore": 86.95,
      "confidence": 37.65,
      "trustContribution": 43.35,
      "explainContribution": 72.62,
      "overall": 63.56
    }
  },
  {
    "id": "sg-029",
    "input": {
      "pillarCoverage": 0.87,
      "policyCompleteness": 0.9,
      "signalIntegrity": 0.91,
      "packReadiness": 0.87,
      "explainOnlyAdherence": 0.87,
      "hallucinationHardness": 0.2,
      "trustErosionRisk": 0.33,
      "overclaimRisk": 0.18,
      "governanceBias": "balanced",
      "profile": "trust_gph_six_pillar"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 84.21,
      "policyScore": 88.91,
      "signalScore": 90.19,
      "readinessScore": 92.27,
      "explainOnlyScore": 50.59,
      "confidence": 69.9,
      "trustContribution": 88.88,
      "explainContribution": 54.2,
      "overall": 86.64
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 36.33,
      "policyScore": 26.42,
      "signalScore": 23.73,
      "readinessScore": 45,
      "explainOnlyScore": 71.06,
      "confidence": 39.5,
      "trustContribution": 40.51,
      "explainContribution": 65.11,
      "overall": 57.02
    }
  },
  {
    "id": "sg-030",
    "input": {
      "pillarCoverage": 0.91,
      "policyCompleteness": 0.88,
      "signalIntegrity": 0.87,
      "packReadiness": 0.91,
      "explainOnlyAdherence": 0.91,
      "hallucinationHardness": 0.21,
      "trustErosionRisk": 0.28,
      "overclaimRisk": 0.13,
      "governanceBias": "pillar_first",
      "profile": "explainability_only_baseline"
    },
    "expectedTrust": {
      "mode": "trust_gph_six_pillar",
      "pillarScore": 94.88,
      "policyScore": 88.77,
      "signalScore": 100,
      "readinessScore": 71.68,
      "explainOnlyScore": 51.88,
      "confidence": 72.25,
      "trustContribution": 89.62,
      "explainContribution": 55.26,
      "overall": 87.44
    },
    "expectedExplain": {
      "mode": "explainability_only_baseline",
      "pillarScore": 25.72,
      "policyScore": 25.24,
      "signalScore": 22.06,
      "readinessScore": 45.02,
      "explainOnlyScore": 46.21,
      "confidence": 38.95,
      "trustContribution": 32.85,
      "explainContribution": 50.65,
      "overall": 44.27
    }
  }
];
