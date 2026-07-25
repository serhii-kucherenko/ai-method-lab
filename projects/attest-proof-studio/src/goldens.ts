import type { AttestInput, AttestQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AttestInput;
  expectedAttested: AttestQuality;
  expectedFluent: AttestQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "aps-001",
    "input": {
      "toolCoverage": 0.17,
      "evidenceGrounding": 0.19,
      "proofChainIntegrity": 0.17,
      "attestationFreshness": 0.18,
      "claimSpecificity": 0.18,
      "fluentConfidence": 0.34,
      "unsupportedClaims": 0.35,
      "noiseLevel": 0.32,
      "toolBias": "search",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 5.82,
      "groundingScore": 7.12,
      "proofScore": 15.11,
      "freshnessScore": 11.7,
      "specificityScore": 19.07,
      "fluencyScore": 12.8,
      "confidence": 7.9,
      "toolContribution": 8.21,
      "proofContribution": 17,
      "overall": 10.86
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 4.76,
      "groundingScore": 7,
      "proofScore": 5.44,
      "freshnessScore": 4.84,
      "specificityScore": 18.9,
      "fluencyScore": 19.99,
      "confidence": 19.2,
      "toolContribution": 5.88,
      "proofContribution": 2.55,
      "overall": 18.15
    }
  },
  {
    "id": "aps-002",
    "input": {
      "toolCoverage": 0.21,
      "evidenceGrounding": 0.22,
      "proofChainIntegrity": 0.21,
      "attestationFreshness": 0.22,
      "claimSpecificity": 0.22,
      "fluentConfidence": 0.37,
      "unsupportedClaims": 0.35,
      "noiseLevel": 0.32,
      "toolBias": "code",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 9.11,
      "groundingScore": 9.83,
      "proofScore": 19.21,
      "freshnessScore": 14.91,
      "specificityScore": 22.81,
      "fluencyScore": 14.6,
      "confidence": 11.47,
      "toolContribution": 11.28,
      "proofContribution": 21,
      "overall": 14.3
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 5.48,
      "groundingScore": 7.75,
      "proofScore": 6.12,
      "freshnessScore": 5.46,
      "specificityScore": 21.96,
      "fluencyScore": 22.87,
      "confidence": 22.16,
      "toolContribution": 6.62,
      "proofContribution": 3.15,
      "overall": 20.88
    }
  },
  {
    "id": "aps-003",
    "input": {
      "toolCoverage": 0.26,
      "evidenceGrounding": 0.26,
      "proofChainIntegrity": 0.2,
      "attestationFreshness": 0.27,
      "claimSpecificity": 0.21,
      "fluentConfidence": 0.4,
      "unsupportedClaims": 0.32,
      "noiseLevel": 0.32,
      "toolBias": "retrieval",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 12.2,
      "groundingScore": 12.22,
      "proofScore": 21.69,
      "freshnessScore": 17.24,
      "specificityScore": 22.82,
      "fluencyScore": 15.95,
      "confidence": 13.94,
      "toolContribution": 13.89,
      "proofContribution": 21.8,
      "overall": 16.63
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 6.32,
      "groundingScore": 8.6,
      "proofScore": 6.4,
      "freshnessScore": 6.16,
      "specificityScore": 22.13,
      "fluencyScore": 24.84,
      "confidence": 23.74,
      "toolContribution": 7.46,
      "proofContribution": 3,
      "overall": 22.2
    }
  },
  {
    "id": "aps-004",
    "input": {
      "toolCoverage": 0.22,
      "evidenceGrounding": 0.3,
      "proofChainIntegrity": 0.24,
      "attestationFreshness": 0.23,
      "claimSpecificity": 0.25,
      "fluentConfidence": 0.43,
      "unsupportedClaims": 0.32,
      "noiseLevel": 0.28,
      "toolBias": "balanced",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 15.35,
      "groundingScore": 20.9,
      "proofScore": 24.2,
      "freshnessScore": 20.62,
      "specificityScore": 27.24,
      "fluencyScore": 17.75,
      "confidence": 17.82,
      "toolContribution": 18.96,
      "proofContribution": 23.4,
      "overall": 21.02
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 6.08,
      "groundingScore": 9.45,
      "proofScore": 7.08,
      "freshnessScore": 6.14,
      "specificityScore": 25.19,
      "fluencyScore": 28.14,
      "confidence": 27.24,
      "toolContribution": 7.77,
      "proofContribution": 3.6,
      "overall": 25.19
    }
  },
  {
    "id": "aps-005",
    "input": {
      "toolCoverage": 0.27,
      "evidenceGrounding": 0.26,
      "proofChainIntegrity": 0.29,
      "attestationFreshness": 0.27,
      "claimSpecificity": 0.3,
      "fluentConfidence": 0.39,
      "unsupportedClaims": 0.32,
      "noiseLevel": 0.28,
      "toolBias": "calc",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 16.07,
      "groundingScore": 15.55,
      "proofScore": 27.76,
      "freshnessScore": 20.57,
      "specificityScore": 30.36,
      "fluencyScore": 16.9,
      "confidence": 19.13,
      "toolContribution": 17.4,
      "proofContribution": 28.4,
      "overall": 21.38
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 6.36,
      "groundingScore": 8.45,
      "proofScore": 7,
      "freshnessScore": 6.06,
      "specificityScore": 27.08,
      "fluencyScore": 26.69,
      "confidence": 26.41,
      "toolContribution": 7.4,
      "proofContribution": 4.35,
      "overall": 24.8
    }
  },
  {
    "id": "aps-006",
    "input": {
      "toolCoverage": 0.31,
      "evidenceGrounding": 0.3,
      "proofChainIntegrity": 0.27,
      "attestationFreshness": 0.32,
      "claimSpecificity": 0.28,
      "fluentConfidence": 0.42,
      "unsupportedClaims": 0.29,
      "noiseLevel": 0.28,
      "toolBias": "search",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 18.34,
      "groundingScore": 17.66,
      "proofScore": 29.38,
      "freshnessScore": 22.62,
      "specificityScore": 29.59,
      "fluencyScore": 18.1,
      "confidence": 20.95,
      "toolContribution": 19.54,
      "proofContribution": 28.2,
      "overall": 23.08
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 7.08,
      "groundingScore": 9.3,
      "proofScore": 7.2,
      "freshnessScore": 6.76,
      "specificityScore": 26.67,
      "fluencyScore": 28.43,
      "confidence": 27.7,
      "toolContribution": 8.19,
      "proofContribution": 4.05,
      "overall": 25.82
    }
  },
  {
    "id": "aps-007",
    "input": {
      "toolCoverage": 0.35,
      "evidenceGrounding": 0.34,
      "proofChainIntegrity": 0.31,
      "attestationFreshness": 0.36,
      "claimSpecificity": 0.32,
      "fluentConfidence": 0.45,
      "unsupportedClaims": 0.29,
      "noiseLevel": 0.29,
      "toolBias": "code",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 21.42,
      "groundingScore": 20.7,
      "proofScore": 33.5,
      "freshnessScore": 25.63,
      "specificityScore": 33.41,
      "fluencyScore": 19.9,
      "confidence": 24.52,
      "toolContribution": 22.58,
      "proofContribution": 32.2,
      "overall": 26.53
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 7.8,
      "groundingScore": 10.15,
      "proofScore": 7.88,
      "freshnessScore": 7.38,
      "specificityScore": 29.73,
      "fluencyScore": 31.21,
      "confidence": 30.51,
      "toolContribution": 8.98,
      "proofContribution": 4.65,
      "overall": 28.48
    }
  },
  {
    "id": "aps-008",
    "input": {
      "toolCoverage": 0.32,
      "evidenceGrounding": 0.38,
      "proofChainIntegrity": 0.36,
      "attestationFreshness": 0.32,
      "claimSpecificity": 0.37,
      "fluentConfidence": 0.49,
      "unsupportedClaims": 0.29,
      "noiseLevel": 0.25,
      "toolBias": "retrieval",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 22,
      "groundingScore": 25.04,
      "proofScore": 36.88,
      "freshnessScore": 25.74,
      "specificityScore": 38.61,
      "fluencyScore": 22.25,
      "confidence": 27.35,
      "toolContribution": 24.26,
      "proofContribution": 34.8,
      "overall": 29.27
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 7.76,
      "groundingScore": 11.15,
      "proofScore": 8.76,
      "freshnessScore": 7.46,
      "specificityScore": 33.62,
      "fluencyScore": 35.39,
      "confidence": 34.9,
      "toolContribution": 9.46,
      "proofContribution": 5.4,
      "overall": 32.26
    }
  },
  {
    "id": "aps-009",
    "input": {
      "toolCoverage": 0.36,
      "evidenceGrounding": 0.42,
      "proofChainIntegrity": 0.34,
      "attestationFreshness": 0.37,
      "claimSpecificity": 0.35,
      "fluentConfidence": 0.52,
      "unsupportedClaims": 0.26,
      "noiseLevel": 0.25,
      "toolBias": "balanced",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 29.82,
      "groundingScore": 33.61,
      "proofScore": 38.49,
      "freshnessScore": 33.49,
      "specificityScore": 37.84,
      "fluencyScore": 23.45,
      "confidence": 31.8,
      "toolContribution": 32.31,
      "proofContribution": 34.6,
      "overall": 34.44
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 8.48,
      "groundingScore": 12,
      "proofScore": 8.96,
      "freshnessScore": 8.16,
      "specificityScore": 33.21,
      "fluencyScore": 37.13,
      "confidence": 36.18,
      "toolContribution": 10.24,
      "proofContribution": 5.1,
      "overall": 33.27
    }
  },
  {
    "id": "aps-010",
    "input": {
      "toolCoverage": 0.41,
      "evidenceGrounding": 0.38,
      "proofChainIntegrity": 0.39,
      "attestationFreshness": 0.41,
      "claimSpecificity": 0.4,
      "fluentConfidence": 0.48,
      "unsupportedClaims": 0.26,
      "noiseLevel": 0.25,
      "toolBias": "calc",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 28.38,
      "groundingScore": 26.42,
      "proofScore": 42.05,
      "freshnessScore": 31.28,
      "specificityScore": 40.96,
      "fluencyScore": 22.6,
      "confidence": 32.18,
      "toolContribution": 28.69,
      "proofContribution": 39.6,
      "overall": 33.61
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 8.76,
      "groundingScore": 11,
      "proofScore": 8.88,
      "freshnessScore": 8.08,
      "specificityScore": 35.1,
      "fluencyScore": 35.68,
      "confidence": 35.35,
      "toolContribution": 9.88,
      "proofContribution": 5.85,
      "overall": 32.89
    }
  },
  {
    "id": "aps-011",
    "input": {
      "toolCoverage": 0.45,
      "evidenceGrounding": 0.42,
      "proofChainIntegrity": 0.43,
      "attestationFreshness": 0.45,
      "claimSpecificity": 0.44,
      "fluentConfidence": 0.51,
      "unsupportedClaims": 0.26,
      "noiseLevel": 0.25,
      "toolBias": "search",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 31.67,
      "groundingScore": 29.66,
      "proofScore": 46.36,
      "freshnessScore": 34.49,
      "specificityScore": 44.9,
      "fluencyScore": 24.4,
      "confidence": 35.93,
      "toolContribution": 31.94,
      "proofContribution": 43.6,
      "overall": 37.26
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 9.48,
      "groundingScore": 11.85,
      "proofScore": 9.56,
      "freshnessScore": 8.7,
      "specificityScore": 38.16,
      "fluencyScore": 38.56,
      "confidence": 38.31,
      "toolContribution": 10.67,
      "proofContribution": 6.45,
      "overall": 35.62
    }
  },
  {
    "id": "aps-012",
    "input": {
      "toolCoverage": 0.42,
      "evidenceGrounding": 0.46,
      "proofChainIntegrity": 0.42,
      "attestationFreshness": 0.42,
      "claimSpecificity": 0.43,
      "fluentConfidence": 0.54,
      "unsupportedClaims": 0.23,
      "noiseLevel": 0.21,
      "toolBias": "code",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 31.23,
      "groundingScore": 32.86,
      "proofScore": 47.05,
      "freshnessScore": 33.45,
      "specificityScore": 45.39,
      "fluencyScore": 25.75,
      "confidence": 36.82,
      "toolContribution": 32.51,
      "proofContribution": 42,
      "overall": 38.04
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 9.36,
      "groundingScore": 12.7,
      "proofScore": 9.84,
      "freshnessScore": 8.76,
      "specificityScore": 38.33,
      "fluencyScore": 40.95,
      "confidence": 40.44,
      "toolContribution": 11.03,
      "proofContribution": 6.3,
      "overall": 37.2
    }
  },
  {
    "id": "aps-013",
    "input": {
      "toolCoverage": 0.46,
      "evidenceGrounding": 0.5,
      "proofChainIntegrity": 0.46,
      "attestationFreshness": 0.46,
      "claimSpecificity": 0.47,
      "fluentConfidence": 0.57,
      "unsupportedClaims": 0.23,
      "noiseLevel": 0.22,
      "toolBias": "retrieval",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 34.32,
      "groundingScore": 35.9,
      "proofScore": 51.17,
      "freshnessScore": 36.46,
      "specificityScore": 49.21,
      "fluencyScore": 27.55,
      "confidence": 40.39,
      "toolContribution": 35.56,
      "proofContribution": 46,
      "overall": 41.5
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 10.08,
      "groundingScore": 13.55,
      "proofScore": 10.52,
      "freshnessScore": 9.38,
      "specificityScore": 41.39,
      "fluencyScore": 43.72,
      "confidence": 43.25,
      "toolContribution": 11.82,
      "proofContribution": 6.9,
      "overall": 39.85
    }
  },
  {
    "id": "aps-014",
    "input": {
      "toolCoverage": 0.5,
      "evidenceGrounding": 0.53,
      "proofChainIntegrity": 0.5,
      "attestationFreshness": 0.5,
      "claimSpecificity": 0.51,
      "fluentConfidence": 0.6,
      "unsupportedClaims": 0.23,
      "noiseLevel": 0.22,
      "toolBias": "balanced",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 45.3,
      "groundingScore": 46.78,
      "proofScore": 55.27,
      "freshnessScore": 47.36,
      "specificityScore": 52.94,
      "fluencyScore": 29.35,
      "confidence": 47.49,
      "toolContribution": 46.48,
      "proofContribution": 50,
      "overall": 49.56
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 10.8,
      "groundingScore": 14.3,
      "proofScore": 11.2,
      "freshnessScore": 10,
      "specificityScore": 44.45,
      "fluencyScore": 46.6,
      "confidence": 46.21,
      "toolContribution": 12.55,
      "proofContribution": 7.5,
      "overall": 42.58
    }
  },
  {
    "id": "aps-015",
    "input": {
      "toolCoverage": 0.55,
      "evidenceGrounding": 0.5,
      "proofChainIntegrity": 0.49,
      "attestationFreshness": 0.55,
      "claimSpecificity": 0.5,
      "fluentConfidence": 0.56,
      "unsupportedClaims": 0.2,
      "noiseLevel": 0.22,
      "toolBias": "calc",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 40.69,
      "groundingScore": 37.28,
      "proofScore": 56.35,
      "freshnessScore": 41.99,
      "specificityScore": 51.56,
      "fluencyScore": 27.9,
      "confidence": 45.23,
      "toolContribution": 39.99,
      "proofContribution": 50.8,
      "overall": 45.84
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 11.08,
      "groundingScore": 13.4,
      "proofScore": 10.64,
      "freshnessScore": 10,
      "specificityScore": 42.88,
      "fluencyScore": 44.02,
      "confidence": 43.72,
      "toolContribution": 12.24,
      "proofContribution": 7.35,
      "overall": 40.5
    }
  },
  {
    "id": "aps-016",
    "input": {
      "toolCoverage": 0.51,
      "evidenceGrounding": 0.54,
      "proofChainIntegrity": 0.53,
      "attestationFreshness": 0.51,
      "claimSpecificity": 0.54,
      "fluentConfidence": 0.59,
      "unsupportedClaims": 0.21,
      "noiseLevel": 0.18,
      "toolBias": "search",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 40.23,
      "groundingScore": 41.16,
      "proofScore": 58.63,
      "freshnessScore": 41.83,
      "specificityScore": 55.98,
      "fluencyScore": 29.6,
      "confidence": 47.12,
      "toolContribution": 41.07,
      "proofContribution": 52.4,
      "overall": 47.77
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 10.84,
      "groundingScore": 14.25,
      "proofScore": 11.32,
      "freshnessScore": 9.98,
      "specificityScore": 45.94,
      "fluencyScore": 47.23,
      "confidence": 47.17,
      "toolContribution": 12.55,
      "proofContribution": 7.95,
      "overall": 43.43
    }
  },
  {
    "id": "aps-017",
    "input": {
      "toolCoverage": 0.56,
      "evidenceGrounding": 0.58,
      "proofChainIntegrity": 0.58,
      "attestationFreshness": 0.56,
      "claimSpecificity": 0.59,
      "fluentConfidence": 0.63,
      "unsupportedClaims": 0.21,
      "noiseLevel": 0.18,
      "toolBias": "code",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 44.34,
      "groundingScore": 44.69,
      "proofScore": 63.8,
      "freshnessScore": 45.84,
      "specificityScore": 60.7,
      "fluencyScore": 31.95,
      "confidence": 51.64,
      "toolContribution": 44.96,
      "proofContribution": 57.4,
      "overall": 52.12
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 11.76,
      "groundingScore": 15.25,
      "proofScore": 12.2,
      "freshnessScore": 10.78,
      "specificityScore": 49.82,
      "fluencyScore": 50.99,
      "confidence": 51,
      "toolContribution": 13.51,
      "proofContribution": 8.7,
      "overall": 46.95
    }
  },
  {
    "id": "aps-018",
    "input": {
      "toolCoverage": 0.6,
      "evidenceGrounding": 0.61,
      "proofChainIntegrity": 0.56,
      "attestationFreshness": 0.6,
      "claimSpecificity": 0.57,
      "fluentConfidence": 0.66,
      "unsupportedClaims": 0.18,
      "noiseLevel": 0.18,
      "toolBias": "retrieval",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 46.61,
      "groundingScore": 46.26,
      "proofScore": 65.22,
      "freshnessScore": 47.37,
      "specificityScore": 59.73,
      "fluencyScore": 33.15,
      "confidence": 53.17,
      "toolContribution": 46.75,
      "proofContribution": 57.2,
      "overall": 53.54
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 12.48,
      "groundingScore": 16,
      "proofScore": 12.4,
      "freshnessScore": 11.4,
      "specificityScore": 49.42,
      "fluencyScore": 52.73,
      "confidence": 52.29,
      "toolContribution": 14.24,
      "proofContribution": 8.4,
      "overall": 47.97
    }
  },
  {
    "id": "aps-019",
    "input": {
      "toolCoverage": 0.64,
      "evidenceGrounding": 0.65,
      "proofChainIntegrity": 0.6,
      "attestationFreshness": 0.64,
      "claimSpecificity": 0.61,
      "fluentConfidence": 0.69,
      "unsupportedClaims": 0.18,
      "noiseLevel": 0.19,
      "toolBias": "balanced",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 59.55,
      "groundingScore": 59.32,
      "proofScore": 69.34,
      "freshnessScore": 60.23,
      "specificityScore": 63.54,
      "fluencyScore": 34.95,
      "confidence": 61.19,
      "toolContribution": 59.7,
      "proofContribution": 61.2,
      "overall": 62.82
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 13.2,
      "groundingScore": 16.85,
      "proofScore": 13.08,
      "freshnessScore": 12.02,
      "specificityScore": 52.48,
      "fluencyScore": 55.5,
      "confidence": 55.1,
      "toolContribution": 15.03,
      "proofContribution": 9,
      "overall": 50.62
    }
  },
  {
    "id": "aps-020",
    "input": {
      "toolCoverage": 0.61,
      "evidenceGrounding": 0.62,
      "proofChainIntegrity": 0.65,
      "attestationFreshness": 0.61,
      "claimSpecificity": 0.66,
      "fluentConfidence": 0.65,
      "unsupportedClaims": 0.18,
      "noiseLevel": 0.15,
      "toolBias": "calc",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 50.28,
      "groundingScore": 49.92,
      "proofScore": 71.31,
      "freshnessScore": 51.02,
      "specificityScore": 67.34,
      "fluencyScore": 34.1,
      "confidence": 58.47,
      "toolContribution": 50.41,
      "proofContribution": 63.8,
      "overall": 58.38
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 12.52,
      "groundingScore": 15.95,
      "proofScore": 13,
      "freshnessScore": 11.38,
      "specificityScore": 54.37,
      "fluencyScore": 54.47,
      "confidence": 54.82,
      "toolContribution": 14.24,
      "proofContribution": 9.75,
      "overall": 50.49
    }
  },
  {
    "id": "aps-021",
    "input": {
      "toolCoverage": 0.65,
      "evidenceGrounding": 0.65,
      "proofChainIntegrity": 0.63,
      "attestationFreshness": 0.65,
      "claimSpecificity": 0.64,
      "fluentConfidence": 0.68,
      "unsupportedClaims": 0.15,
      "noiseLevel": 0.15,
      "toolBias": "search",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 52.55,
      "groundingScore": 51.5,
      "proofScore": 72.72,
      "freshnessScore": 52.55,
      "specificityScore": 66.38,
      "fluencyScore": 35.3,
      "confidence": 60,
      "toolContribution": 52.2,
      "proofContribution": 63.6,
      "overall": 59.8
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 13.24,
      "groundingScore": 16.7,
      "proofScore": 13.2,
      "freshnessScore": 12,
      "specificityScore": 53.96,
      "fluencyScore": 56.22,
      "confidence": 56.11,
      "toolContribution": 14.97,
      "proofContribution": 9.45,
      "overall": 51.51
    }
  },
  {
    "id": "aps-022",
    "input": {
      "toolCoverage": 0.7,
      "evidenceGrounding": 0.69,
      "proofChainIntegrity": 0.68,
      "attestationFreshness": 0.69,
      "claimSpecificity": 0.69,
      "fluentConfidence": 0.71,
      "unsupportedClaims": 0.15,
      "noiseLevel": 0.15,
      "toolBias": "code",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 56.66,
      "groundingScore": 55.02,
      "proofScore": 77.89,
      "freshnessScore": 56.03,
      "specificityScore": 71.1,
      "fluencyScore": 37.25,
      "confidence": 64.4,
      "toolContribution": 55.9,
      "proofContribution": 68.6,
      "overall": 64.08
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 14.08,
      "groundingScore": 17.55,
      "proofScore": 13.96,
      "freshnessScore": 12.62,
      "specificityScore": 57.6,
      "fluencyScore": 59.33,
      "confidence": 59.36,
      "toolContribution": 15.82,
      "proofContribution": 10.2,
      "overall": 54.55
    }
  },
  {
    "id": "aps-023",
    "input": {
      "toolCoverage": 0.74,
      "evidenceGrounding": 0.73,
      "proofChainIntegrity": 0.72,
      "attestationFreshness": 0.74,
      "claimSpecificity": 0.73,
      "fluentConfidence": 0.74,
      "unsupportedClaims": 0.15,
      "noiseLevel": 0.15,
      "toolBias": "retrieval",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 59.94,
      "groundingScore": 58.27,
      "proofScore": 82.2,
      "freshnessScore": 59.76,
      "specificityScore": 75.03,
      "fluencyScore": 39.05,
      "confidence": 68.26,
      "toolContribution": 59.32,
      "proofContribution": 72.6,
      "overall": 67.79
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 14.8,
      "groundingScore": 18.4,
      "proofScore": 14.64,
      "freshnessScore": 13.32,
      "specificityScore": 60.66,
      "fluencyScore": 62.2,
      "confidence": 62.31,
      "toolContribution": 16.6,
      "proofContribution": 10.8,
      "overall": 57.28
    }
  },
  {
    "id": "aps-024",
    "input": {
      "toolCoverage": 0.71,
      "evidenceGrounding": 0.77,
      "proofChainIntegrity": 0.71,
      "attestationFreshness": 0.7,
      "claimSpecificity": 0.72,
      "fluentConfidence": 0.78,
      "unsupportedClaims": 0.12,
      "noiseLevel": 0.11,
      "toolBias": "balanced",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 70.44,
      "groundingScore": 73.32,
      "proofScore": 82.89,
      "freshnessScore": 68.98,
      "specificityScore": 75.53,
      "fluencyScore": 40.8,
      "confidence": 74.03,
      "toolContribution": 70.91,
      "proofContribution": 71,
      "overall": 75.11
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 14.76,
      "groundingScore": 19.4,
      "proofScore": 15.04,
      "freshnessScore": 13.4,
      "specificityScore": 61.08,
      "fluencyScore": 65.25,
      "confidence": 65.03,
      "toolContribution": 17.08,
      "proofContribution": 10.65,
      "overall": 59.35
    }
  },
  {
    "id": "aps-025",
    "input": {
      "toolCoverage": 0.75,
      "evidenceGrounding": 0.73,
      "proofChainIntegrity": 0.75,
      "attestationFreshness": 0.74,
      "claimSpecificity": 0.76,
      "fluentConfidence": 0.73,
      "unsupportedClaims": 0.12,
      "noiseLevel": 0.12,
      "toolBias": "calc",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 62.59,
      "groundingScore": 60.26,
      "proofScore": 85.4,
      "freshnessScore": 61.21,
      "specificityScore": 77.74,
      "fluencyScore": 39.4,
      "confidence": 71.23,
      "toolContribution": 61.35,
      "proofContribution": 75,
      "overall": 70.33
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 14.84,
      "groundingScore": 18.25,
      "proofScore": 14.76,
      "freshnessScore": 13.22,
      "specificityScore": 62.14,
      "fluencyScore": 62.81,
      "confidence": 63.18,
      "toolContribution": 16.55,
      "proofContribution": 11.25,
      "overall": 58.09
    }
  },
  {
    "id": "aps-026",
    "input": {
      "toolCoverage": 0.79,
      "evidenceGrounding": 0.77,
      "proofChainIntegrity": 0.79,
      "attestationFreshness": 0.79,
      "claimSpecificity": 0.8,
      "fluentConfidence": 0.77,
      "unsupportedClaims": 0.12,
      "noiseLevel": 0.12,
      "toolBias": "search",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 65.88,
      "groundingScore": 63.5,
      "proofScore": 89.7,
      "freshnessScore": 64.94,
      "specificityScore": 81.68,
      "fluencyScore": 41.6,
      "confidence": 75.09,
      "toolContribution": 64.77,
      "proofContribution": 79,
      "overall": 74.05
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 15.64,
      "groundingScore": 19.25,
      "proofScore": 15.56,
      "freshnessScore": 14.02,
      "specificityScore": 65.45,
      "fluencyScore": 66.34,
      "confidence": 66.71,
      "toolContribution": 17.45,
      "proofContribution": 11.85,
      "overall": 61.3
    }
  },
  {
    "id": "aps-027",
    "input": {
      "toolCoverage": 0.84,
      "evidenceGrounding": 0.81,
      "proofChainIntegrity": 0.78,
      "attestationFreshness": 0.83,
      "claimSpecificity": 0.79,
      "fluentConfidence": 0.8,
      "unsupportedClaims": 0.09,
      "noiseLevel": 0.12,
      "toolBias": "code",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 68.97,
      "groundingScore": 65.89,
      "proofScore": 92.19,
      "freshnessScore": 66.75,
      "specificityScore": 81.7,
      "fluencyScore": 42.95,
      "confidence": 77.45,
      "toolContribution": 67.2,
      "proofContribution": 79.8,
      "overall": 76.31
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 16.48,
      "groundingScore": 20.1,
      "proofScore": 15.84,
      "freshnessScore": 14.64,
      "specificityScore": 65.62,
      "fluencyScore": 68.31,
      "confidence": 68.3,
      "toolContribution": 18.29,
      "proofContribution": 11.7,
      "overall": 62.63
    }
  },
  {
    "id": "aps-028",
    "input": {
      "toolCoverage": 0.8,
      "evidenceGrounding": 0.85,
      "proofChainIntegrity": 0.82,
      "attestationFreshness": 0.79,
      "claimSpecificity": 0.83,
      "fluentConfidence": 0.83,
      "unsupportedClaims": 0.09,
      "noiseLevel": 0.08,
      "toolBias": "retrieval",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 68.73,
      "groundingScore": 69.95,
      "proofScore": 94.69,
      "freshnessScore": 66.59,
      "specificityScore": 86.11,
      "fluencyScore": 44.75,
      "confidence": 79.62,
      "toolContribution": 68.42,
      "proofContribution": 81.4,
      "overall": 78.4
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 16.24,
      "groundingScore": 20.95,
      "proofScore": 16.52,
      "freshnessScore": 14.62,
      "specificityScore": 68.68,
      "fluencyScore": 71.61,
      "confidence": 71.8,
      "toolContribution": 18.6,
      "proofContribution": 12.3,
      "overall": 65.61
    }
  },
  {
    "id": "aps-029",
    "input": {
      "toolCoverage": 0.85,
      "evidenceGrounding": 0.89,
      "proofChainIntegrity": 0.87,
      "attestationFreshness": 0.84,
      "claimSpecificity": 0.88,
      "fluentConfidence": 0.86,
      "unsupportedClaims": 0.09,
      "noiseLevel": 0.08,
      "toolBias": "balanced",
      "profile": "attested"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 85.93,
      "groundingScore": 87.18,
      "proofScore": 99.87,
      "freshnessScore": 83.53,
      "specificityScore": 90.83,
      "fluencyScore": 46.7,
      "confidence": 90.07,
      "toolContribution": 85.55,
      "proofContribution": 86.4,
      "overall": 90.56
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 17.08,
      "groundingScore": 21.8,
      "proofScore": 17.28,
      "freshnessScore": 15.32,
      "specificityScore": 72.32,
      "fluencyScore": 74.72,
      "confidence": 75.05,
      "toolContribution": 19.44,
      "proofContribution": 13.05,
      "overall": 68.66
    }
  },
  {
    "id": "aps-030",
    "input": {
      "toolCoverage": 0.89,
      "evidenceGrounding": 0.85,
      "proofChainIntegrity": 0.85,
      "attestationFreshness": 0.88,
      "claimSpecificity": 0.86,
      "fluentConfidence": 0.82,
      "unsupportedClaims": 0.06,
      "noiseLevel": 0.09,
      "toolBias": "calc",
      "profile": "fluent"
    },
    "expectedAttested": {
      "mode": "tool_attested",
      "coverageScore": 74.9,
      "groundingScore": 71.13,
      "proofScore": 99.69,
      "freshnessScore": 71.92,
      "specificityScore": 88.34,
      "fluencyScore": 45.1,
      "confidence": 84.28,
      "toolContribution": 72.65,
      "proofContribution": 86.2,
      "overall": 82.56
    },
    "expectedFluent": {
      "mode": "fluent_only",
      "coverageScore": 17.24,
      "groundingScore": 20.8,
      "proofScore": 16.64,
      "freshnessScore": 15.24,
      "specificityScore": 70.16,
      "fluencyScore": 71.8,
      "confidence": 72.12,
      "toolContribution": 19.02,
      "proofContribution": 12.75,
      "overall": 66.18
    }
  }
];
