import type { LatentPathInput, LatentPathQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LatentPathInput;
  expectedMultiDomain: LatentPathQuality;
  expectedSingleDomain: LatentPathQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "lp-001",
    "input": {
      "multiDomainCoverage": 0.29,
      "jointClassClarity": 0.25,
      "trajectorySeparation": 0.28,
      "packReadiness": 0.34,
      "singleDomainAdherence": 0.39,
      "predictorNoise": 0.59,
      "domainIsolation": 0.45,
      "overclaimRisk": 0.5,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 23.4,
      "classScore": 30.25,
      "trajectoryScore": 22.93,
      "readinessScore": 37.64,
      "singleDomainScore": 16.4,
      "confidence": 17.95,
      "multiDomainContribution": 28.18,
      "singleDomainContribution": 15.96,
      "overall": 29.98
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 5.76,
      "classScore": 17.41,
      "trajectoryScore": 12.83,
      "readinessScore": 32.39,
      "singleDomainScore": 40.93,
      "confidence": 17.1,
      "multiDomainContribution": 21.86,
      "singleDomainContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "lp-002",
    "input": {
      "multiDomainCoverage": 0.33,
      "jointClassClarity": 0.29,
      "trajectorySeparation": 0.32,
      "packReadiness": 0.38,
      "singleDomainAdherence": 0.43,
      "predictorNoise": 0.6,
      "domainIsolation": 0.46,
      "overclaimRisk": 0.51,
      "pathBias": "predictor_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 29.5,
      "classScore": 33.9,
      "trajectoryScore": 17.2,
      "readinessScore": 48.93,
      "singleDomainScore": 18.89,
      "confidence": 21.2,
      "multiDomainContribution": 31.47,
      "singleDomainContribution": 18.61,
      "overall": 33.16
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 2.43,
      "classScore": 18.54,
      "trajectoryScore": 13.86,
      "readinessScore": 34.08,
      "singleDomainScore": 31.53,
      "confidence": 18.65,
      "multiDomainContribution": 20.09,
      "singleDomainContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "lp-003",
    "input": {
      "multiDomainCoverage": 0.37,
      "jointClassClarity": 0.27,
      "trajectorySeparation": 0.36,
      "packReadiness": 0.42,
      "singleDomainAdherence": 0.46,
      "predictorNoise": 0.6,
      "domainIsolation": 0.42,
      "overclaimRisk": 0.46,
      "pathBias": "single_domain_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 8.24,
      "classScore": 23.71,
      "trajectoryScore": 19.55,
      "readinessScore": 19.24,
      "singleDomainScore": 19.94,
      "confidence": 23.4,
      "multiDomainContribution": 17.85,
      "singleDomainContribution": 19.69,
      "overall": 19.18
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 12.17,
      "classScore": 17.9,
      "trajectoryScore": 12.83,
      "readinessScore": 33.93,
      "singleDomainScore": 54.34,
      "confidence": 18.4,
      "multiDomainContribution": 26.23,
      "singleDomainContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "lp-004",
    "input": {
      "multiDomainCoverage": 0.33,
      "jointClassClarity": 0.32,
      "trajectorySeparation": 0.39,
      "packReadiness": 0.38,
      "singleDomainAdherence": 0.42,
      "predictorNoise": 0.53,
      "domainIsolation": 0.43,
      "overclaimRisk": 0.46,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 30.05,
      "classScore": 36.03,
      "trajectoryScore": 32.93,
      "readinessScore": 42.23,
      "singleDomainScore": 18.93,
      "confidence": 22.55,
      "multiDomainContribution": 35.09,
      "singleDomainContribution": 19.05,
      "overall": 36.2
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 8.7,
      "classScore": 17.89,
      "trajectoryScore": 13.8,
      "readinessScore": 32.79,
      "singleDomainScore": 42.77,
      "confidence": 18.85,
      "multiDomainContribution": 23.19,
      "singleDomainContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "lp-005",
    "input": {
      "multiDomainCoverage": 0.37,
      "jointClassClarity": 0.36,
      "trajectorySeparation": 0.35,
      "packReadiness": 0.42,
      "singleDomainAdherence": 0.46,
      "predictorNoise": 0.53,
      "domainIsolation": 0.45,
      "overclaimRisk": 0.47,
      "pathBias": "joint_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 34.52,
      "classScore": 39.64,
      "trajectoryScore": 39.44,
      "readinessScore": 35.49,
      "singleDomainScore": 21.8,
      "confidence": 25.65,
      "multiDomainContribution": 37.44,
      "singleDomainContribution": 22.19,
      "overall": 38.7
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 0,
      "classScore": 19.59,
      "trajectoryScore": 15.41,
      "readinessScore": 34.77,
      "singleDomainScore": 32.95,
      "confidence": 21.05,
      "multiDomainContribution": 20.54,
      "singleDomainContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "lp-006",
    "input": {
      "multiDomainCoverage": 0.41,
      "jointClassClarity": 0.34,
      "trajectorySeparation": 0.39,
      "packReadiness": 0.45,
      "singleDomainAdherence": 0.5,
      "predictorNoise": 0.54,
      "domainIsolation": 0.4,
      "overclaimRisk": 0.42,
      "pathBias": "balanced",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 35.34,
      "classScore": 39.5,
      "trajectoryScore": 34.86,
      "readinessScore": 47.85,
      "singleDomainScore": 23.08,
      "confidence": 27.75,
      "multiDomainContribution": 39.04,
      "singleDomainContribution": 23.38,
      "overall": 40.22
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 11.98,
      "classScore": 18.6,
      "trajectoryScore": 14.01,
      "readinessScore": 34.78,
      "singleDomainScore": 46.72,
      "confidence": 20.5,
      "multiDomainContribution": 25.22,
      "singleDomainContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "lp-007",
    "input": {
      "multiDomainCoverage": 0.45,
      "jointClassClarity": 0.38,
      "trajectorySeparation": 0.42,
      "packReadiness": 0.49,
      "singleDomainAdherence": 0.53,
      "predictorNoise": 0.55,
      "domainIsolation": 0.42,
      "overclaimRisk": 0.43,
      "pathBias": "predictor_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 42.46,
      "classScore": 43.11,
      "trajectoryScore": 25.56,
      "readinessScore": 61.29,
      "singleDomainScore": 25.15,
      "confidence": 30.85,
      "multiDomainContribution": 42.04,
      "singleDomainContribution": 25.64,
      "overall": 43.09
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 8.27,
      "classScore": 19.9,
      "trajectoryScore": 15.24,
      "readinessScore": 36.3,
      "singleDomainScore": 34.2,
      "confidence": 22.15,
      "multiDomainContribution": 22.78,
      "singleDomainContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "lp-008",
    "input": {
      "multiDomainCoverage": 0.41,
      "jointClassClarity": 0.43,
      "trajectorySeparation": 0.46,
      "packReadiness": 0.45,
      "singleDomainAdherence": 0.49,
      "predictorNoise": 0.47,
      "domainIsolation": 0.43,
      "overclaimRisk": 0.44,
      "pathBias": "single_domain_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 12.4,
      "classScore": 35.43,
      "trajectoryScore": 27.9,
      "readinessScore": 24.76,
      "singleDomainScore": 24.32,
      "confidence": 30,
      "multiDomainContribution": 25.45,
      "singleDomainContribution": 25.23,
      "overall": 26.41
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 16.4,
      "classScore": 20.02,
      "trajectoryScore": 16.36,
      "readinessScore": 35.17,
      "singleDomainScore": 58.5,
      "confidence": 22.7,
      "multiDomainContribution": 29.29,
      "singleDomainContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "lp-009",
    "input": {
      "multiDomainCoverage": 0.46,
      "jointClassClarity": 0.41,
      "trajectorySeparation": 0.5,
      "packReadiness": 0.49,
      "singleDomainAdherence": 0.53,
      "predictorNoise": 0.48,
      "domainIsolation": 0.39,
      "overclaimRisk": 0.38,
      "pathBias": "balanced",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 42.57,
      "classScore": 45.49,
      "trajectoryScore": 44.98,
      "readinessScore": 52.59,
      "singleDomainScore": 25.81,
      "confidence": 32.5,
      "multiDomainContribution": 46.21,
      "singleDomainContribution": 26.69,
      "overall": 46.7
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 14.91,
      "classScore": 19.47,
      "trajectoryScore": 15.34,
      "readinessScore": 35.36,
      "singleDomainScore": 48.88,
      "confidence": 22.7,
      "multiDomainContribution": 26.79,
      "singleDomainContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "lp-010",
    "input": {
      "multiDomainCoverage": 0.5,
      "jointClassClarity": 0.45,
      "trajectorySeparation": 0.46,
      "packReadiness": 0.53,
      "singleDomainAdherence": 0.57,
      "predictorNoise": 0.49,
      "domainIsolation": 0.4,
      "overclaimRisk": 0.39,
      "pathBias": "joint_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 48.31,
      "classScore": 49.14,
      "trajectoryScore": 53.86,
      "readinessScore": 43.07,
      "singleDomainScore": 28.29,
      "confidence": 35.75,
      "multiDomainContribution": 48.93,
      "singleDomainContribution": 29.32,
      "overall": 49.4
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 3.59,
      "classScore": 20.58,
      "trajectoryScore": 16.35,
      "readinessScore": 37.06,
      "singleDomainScore": 35.54,
      "confidence": 24.25,
      "multiDomainContribution": 22.62,
      "singleDomainContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "lp-011",
    "input": {
      "multiDomainCoverage": 0.54,
      "jointClassClarity": 0.49,
      "trajectorySeparation": 0.49,
      "packReadiness": 0.57,
      "singleDomainAdherence": 0.6,
      "predictorNoise": 0.49,
      "domainIsolation": 0.42,
      "overclaimRisk": 0.4,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 47.21,
      "classScore": 52.75,
      "trajectoryScore": 46.49,
      "readinessScore": 60.27,
      "singleDomainScore": 30.54,
      "confidence": 38.85,
      "multiDomainContribution": 51.32,
      "singleDomainContribution": 31.82,
      "overall": 51.81
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 17.1,
      "classScore": 22.02,
      "trajectoryScore": 17.74,
      "readinessScore": 38.58,
      "singleDomainScore": 54.12,
      "confidence": 26.1,
      "multiDomainContribution": 29.91,
      "singleDomainContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "lp-012",
    "input": {
      "multiDomainCoverage": 0.5,
      "jointClassClarity": 0.48,
      "trajectorySeparation": 0.53,
      "packReadiness": 0.53,
      "singleDomainAdherence": 0.56,
      "predictorNoise": 0.42,
      "domainIsolation": 0.37,
      "overclaimRisk": 0.35,
      "pathBias": "predictor_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 51.61,
      "classScore": 51.28,
      "trajectoryScore": 34.12,
      "readinessScore": 67.57,
      "singleDomainScore": 28.34,
      "confidence": 37.1,
      "multiDomainContribution": 50.14,
      "singleDomainContribution": 29.7,
      "overall": 50.46
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 13.23,
      "classScore": 19.84,
      "trajectoryScore": 16.17,
      "readinessScore": 35.76,
      "singleDomainScore": 34.93,
      "confidence": 24.35,
      "multiDomainContribution": 23.99,
      "singleDomainContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "lp-013",
    "input": {
      "multiDomainCoverage": 0.54,
      "jointClassClarity": 0.52,
      "trajectorySeparation": 0.56,
      "packReadiness": 0.57,
      "singleDomainAdherence": 0.6,
      "predictorNoise": 0.42,
      "domainIsolation": 0.39,
      "overclaimRisk": 0.36,
      "pathBias": "single_domain_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 19.7,
      "classScore": 44.88,
      "trajectoryScore": 36.31,
      "readinessScore": 32.66,
      "singleDomainScore": 31.2,
      "confidence": 40.2,
      "multiDomainContribution": 33.75,
      "singleDomainContribution": 32.8,
      "overall": 34.58
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 22.62,
      "classScore": 21.51,
      "trajectoryScore": 17.75,
      "readinessScore": 37.74,
      "singleDomainScore": 67.02,
      "confidence": 26.55,
      "multiDomainContribution": 33.33,
      "singleDomainContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "lp-014",
    "input": {
      "multiDomainCoverage": 0.58,
      "jointClassClarity": 0.56,
      "trajectorySeparation": 0.6,
      "packReadiness": 0.61,
      "singleDomainAdherence": 0.63,
      "predictorNoise": 0.43,
      "domainIsolation": 0.4,
      "overclaimRisk": 0.36,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 53.74,
      "classScore": 58.53,
      "trajectoryScore": 56.38,
      "readinessScore": 64.86,
      "singleDomainScore": 33.07,
      "confidence": 43.45,
      "multiDomainContribution": 58.17,
      "singleDomainContribution": 34.8,
      "overall": 57.96
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 20.03,
      "classScore": 22.36,
      "trajectoryScore": 18.54,
      "readinessScore": 38.98,
      "singleDomainScore": 55.96,
      "confidence": 27.85,
      "multiDomainContribution": 31.17,
      "singleDomainContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "lp-015",
    "input": {
      "multiDomainCoverage": 0.62,
      "jointClassClarity": 0.54,
      "trajectorySeparation": 0.56,
      "packReadiness": 0.65,
      "singleDomainAdherence": 0.67,
      "predictorNoise": 0.44,
      "domainIsolation": 0.36,
      "overclaimRisk": 0.31,
      "pathBias": "joint_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 61.12,
      "classScore": 58.35,
      "trajectoryScore": 67.29,
      "readinessScore": 50.82,
      "singleDomainScore": 34.55,
      "confidence": 45.65,
      "multiDomainContribution": 59.86,
      "singleDomainContribution": 36.22,
      "overall": 59.6
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 9.43,
      "classScore": 21.78,
      "trajectoryScore": 17.48,
      "readinessScore": 39.27,
      "singleDomainScore": 38.2,
      "confidence": 27.75,
      "multiDomainContribution": 25.23,
      "singleDomainContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "lp-016",
    "input": {
      "multiDomainCoverage": 0.58,
      "jointClassClarity": 0.59,
      "trajectorySeparation": 0.6,
      "packReadiness": 0.6,
      "singleDomainAdherence": 0.63,
      "predictorNoise": 0.36,
      "domainIsolation": 0.37,
      "overclaimRisk": 0.32,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 54.74,
      "classScore": 60.67,
      "trajectoryScore": 58.01,
      "readinessScore": 65.05,
      "singleDomainScore": 33.73,
      "confidence": 44.55,
      "multiDomainContribution": 59.47,
      "singleDomainContribution": 35.76,
      "overall": 59.2
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 22.05,
      "classScore": 21.83,
      "trajectoryScore": 18.56,
      "readinessScore": 38.14,
      "singleDomainScore": 55.7,
      "confidence": 28.3,
      "multiDomainContribution": 31.26,
      "singleDomainContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "lp-017",
    "input": {
      "multiDomainCoverage": 0.62,
      "jointClassClarity": 0.63,
      "trajectorySeparation": 0.63,
      "packReadiness": 0.64,
      "singleDomainAdherence": 0.67,
      "predictorNoise": 0.37,
      "domainIsolation": 0.39,
      "overclaimRisk": 0.33,
      "pathBias": "predictor_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 64.02,
      "classScore": 64.28,
      "trajectoryScore": 42.54,
      "readinessScore": 81.43,
      "singleDomainScore": 36.41,
      "confidence": 47.65,
      "multiDomainContribution": 61.9,
      "singleDomainContribution": 38.61,
      "overall": 61.71
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 18.73,
      "classScore": 23.34,
      "trajectoryScore": 19.95,
      "readinessScore": 40.11,
      "singleDomainScore": 39.86,
      "confidence": 30.3,
      "multiDomainContribution": 28.4,
      "singleDomainContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "lp-018",
    "input": {
      "multiDomainCoverage": 0.66,
      "jointClassClarity": 0.61,
      "trajectorySeparation": 0.67,
      "packReadiness": 0.68,
      "singleDomainAdherence": 0.7,
      "predictorNoise": 0.38,
      "domainIsolation": 0.34,
      "overclaimRisk": 0.27,
      "pathBias": "single_domain_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 26.76,
      "classScore": 54.13,
      "trajectoryScore": 44.82,
      "readinessScore": 40.09,
      "singleDomainScore": 37.08,
      "confidence": 50,
      "multiDomainContribution": 41.87,
      "singleDomainContribution": 39.16,
      "overall": 42.38
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 28.36,
      "classScore": 22.06,
      "trajectoryScore": 18.26,
      "readinessScore": 39.67,
      "singleDomainScore": 74.27,
      "confidence": 29.5,
      "multiDomainContribution": 36.52,
      "singleDomainContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "lp-019",
    "input": {
      "multiDomainCoverage": 0.7,
      "jointClassClarity": 0.65,
      "trajectorySeparation": 0.7,
      "packReadiness": 0.72,
      "singleDomainAdherence": 0.74,
      "predictorNoise": 0.38,
      "domainIsolation": 0.36,
      "overclaimRisk": 0.28,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 65.21,
      "classScore": 67.74,
      "trajectoryScore": 67.47,
      "readinessScore": 75.07,
      "singleDomainScore": 39.94,
      "confidence": 53.1,
      "multiDomainContribution": 68.67,
      "singleDomainContribution": 42.25,
      "overall": 67.91
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 26.25,
      "classScore": 23.72,
      "trajectoryScore": 19.82,
      "readinessScore": 41.65,
      "singleDomainScore": 62.07,
      "confidence": 31.7,
      "multiDomainContribution": 34.7,
      "singleDomainContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "lp-020",
    "input": {
      "multiDomainCoverage": 0.66,
      "jointClassClarity": 0.7,
      "trajectorySeparation": 0.66,
      "packReadiness": 0.68,
      "singleDomainAdherence": 0.7,
      "predictorNoise": 0.31,
      "domainIsolation": 0.37,
      "overclaimRisk": 0.29,
      "pathBias": "joint_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 68.73,
      "classScore": 70.06,
      "trajectoryScore": 80.6,
      "readinessScore": 56.34,
      "singleDomainScore": 38.94,
      "confidence": 52.25,
      "multiDomainContribution": 69.67,
      "singleDomainContribution": 41.54,
      "overall": 68.61
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 13.66,
      "classScore": 23.61,
      "trajectoryScore": 20.65,
      "readinessScore": 40.51,
      "singleDomainScore": 40.86,
      "confidence": 32.05,
      "multiDomainContribution": 27.86,
      "singleDomainContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "lp-021",
    "input": {
      "multiDomainCoverage": 0.7,
      "jointClassClarity": 0.68,
      "trajectorySeparation": 0.7,
      "packReadiness": 0.72,
      "singleDomainAdherence": 0.73,
      "predictorNoise": 0.31,
      "domainIsolation": 0.33,
      "overclaimRisk": 0.24,
      "pathBias": "balanced",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 66.16,
      "classScore": 69.88,
      "trajectoryScore": 69.04,
      "readinessScore": 75.82,
      "singleDomainScore": 39.99,
      "confidence": 54.45,
      "multiDomainContribution": 70.06,
      "singleDomainContribution": 42.54,
      "overall": 69.11
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 27.89,
      "classScore": 22.88,
      "trajectoryScore": 19.52,
      "readinessScore": 40.35,
      "singleDomainScore": 61.19,
      "confidence": 31.8,
      "multiDomainContribution": 34.37,
      "singleDomainContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "lp-022",
    "input": {
      "multiDomainCoverage": 0.74,
      "jointClassClarity": 0.72,
      "trajectorySeparation": 0.73,
      "packReadiness": 0.76,
      "singleDomainAdherence": 0.77,
      "predictorNoise": 0.32,
      "domainIsolation": 0.34,
      "overclaimRisk": 0.25,
      "pathBias": "predictor_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 76.7,
      "classScore": 73.52,
      "trajectoryScore": 50.64,
      "readinessScore": 94.56,
      "singleDomainScore": 42.47,
      "confidence": 57.7,
      "multiDomainContribution": 72.51,
      "singleDomainContribution": 45.15,
      "overall": 71.59
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 24.57,
      "classScore": 23.95,
      "trajectoryScore": 20.48,
      "readinessScore": 42.05,
      "singleDomainScore": 42.21,
      "confidence": 33.35,
      "multiDomainContribution": 30.65,
      "singleDomainContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "lp-023",
    "input": {
      "multiDomainCoverage": 0.79,
      "jointClassClarity": 0.76,
      "trajectorySeparation": 0.77,
      "packReadiness": 0.8,
      "singleDomainAdherence": 0.81,
      "predictorNoise": 0.33,
      "domainIsolation": 0.36,
      "overclaimRisk": 0.25,
      "pathBias": "single_domain_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 33.62,
      "classScore": 67.38,
      "trajectoryScore": 53.32,
      "readinessScore": 49.49,
      "singleDomainScore": 45.16,
      "confidence": 61.1,
      "multiDomainContribution": 51.41,
      "singleDomainContribution": 48.03,
      "overall": 51.8
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 33.86,
      "classScore": 25.49,
      "trajectoryScore": 21.9,
      "readinessScore": 43.92,
      "singleDomainScore": 84.72,
      "confidence": 35.45,
      "multiDomainContribution": 41.98,
      "singleDomainContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "lp-024",
    "input": {
      "multiDomainCoverage": 0.75,
      "jointClassClarity": 0.75,
      "trajectorySeparation": 0.81,
      "packReadiness": 0.76,
      "singleDomainAdherence": 0.77,
      "predictorNoise": 0.25,
      "domainIsolation": 0.31,
      "overclaimRisk": 0.2,
      "pathBias": "balanced",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 73.23,
      "classScore": 75.91,
      "trajectoryScore": 78.99,
      "readinessScore": 80.56,
      "singleDomainScore": 43.13,
      "confidence": 59.35,
      "multiDomainContribution": 77.15,
      "singleDomainContribution": 46.07,
      "overall": 75.56
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 31.21,
      "classScore": 23.36,
      "trajectoryScore": 20.38,
      "readinessScore": 41.11,
      "singleDomainScore": 63.65,
      "confidence": 33.9,
      "multiDomainContribution": 35.94,
      "singleDomainContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "lp-025",
    "input": {
      "multiDomainCoverage": 0.79,
      "jointClassClarity": 0.79,
      "trajectorySeparation": 0.77,
      "packReadiness": 0.8,
      "singleDomainAdherence": 0.8,
      "predictorNoise": 0.26,
      "domainIsolation": 0.33,
      "overclaimRisk": 0.21,
      "pathBias": "joint_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 82.38,
      "classScore": 79.52,
      "trajectoryScore": 94.88,
      "readinessScore": 64.24,
      "singleDomainScore": 45.2,
      "confidence": 62.45,
      "multiDomainContribution": 81.15,
      "singleDomainContribution": 48.27,
      "overall": 79.23
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 19.5,
      "classScore": 24.6,
      "trajectoryScore": 21.54,
      "readinessScore": 42.63,
      "singleDomainScore": 43.52,
      "confidence": 35.55,
      "multiDomainContribution": 30.36,
      "singleDomainContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "lp-026",
    "input": {
      "multiDomainCoverage": 0.83,
      "jointClassClarity": 0.83,
      "trajectorySeparation": 0.8,
      "packReadiness": 0.83,
      "singleDomainAdherence": 0.84,
      "predictorNoise": 0.27,
      "domainIsolation": 0.34,
      "overclaimRisk": 0.22,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 77.68,
      "classScore": 83.17,
      "trajectoryScore": 80.3,
      "readinessScore": 87.68,
      "singleDomainScore": 47.68,
      "confidence": 65.45,
      "multiDomainContribution": 82.04,
      "singleDomainContribution": 50.87,
      "overall": 80.43
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 33.17,
      "classScore": 25.67,
      "trajectoryScore": 22.55,
      "readinessScore": 44.32,
      "singleDomainScore": 68.8,
      "confidence": 37.1,
      "multiDomainContribution": 38.9,
      "singleDomainContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "lp-027",
    "input": {
      "multiDomainCoverage": 0.87,
      "jointClassClarity": 0.81,
      "trajectorySeparation": 0.84,
      "packReadiness": 0.87,
      "singleDomainAdherence": 0.88,
      "predictorNoise": 0.27,
      "domainIsolation": 0.3,
      "overclaimRisk": 0.17,
      "pathBias": "predictor_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 90.34,
      "classScore": 82.98,
      "trajectoryScore": 59.19,
      "readinessScore": 100,
      "singleDomainScore": 49.35,
      "confidence": 67.65,
      "multiDomainContribution": 81.83,
      "singleDomainContribution": 52.5,
      "overall": 80.55
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 30.78,
      "classScore": 25.18,
      "trajectoryScore": 21.6,
      "readinessScore": 44.62,
      "singleDomainScore": 45.22,
      "confidence": 37.2,
      "multiDomainContribution": 33.48,
      "singleDomainContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "lp-028",
    "input": {
      "multiDomainCoverage": 0.83,
      "jointClassClarity": 0.86,
      "trajectorySeparation": 0.87,
      "packReadiness": 0.83,
      "singleDomainAdherence": 0.84,
      "predictorNoise": 0.2,
      "domainIsolation": 0.31,
      "overclaimRisk": 0.17,
      "pathBias": "single_domain_first",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 37.92,
      "classScore": 75.3,
      "trajectoryScore": 61.04,
      "readinessScore": 53.51,
      "singleDomainScore": 48.34,
      "confidence": 66.8,
      "multiDomainContribution": 57.54,
      "singleDomainContribution": 51.73,
      "overall": 57.49
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 38.81,
      "classScore": 25.01,
      "trajectoryScore": 22.37,
      "readinessScore": 43.48,
      "singleDomainScore": 86.95,
      "confidence": 37.65,
      "multiDomainContribution": 43.32,
      "singleDomainContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "lp-029",
    "input": {
      "multiDomainCoverage": 0.87,
      "jointClassClarity": 0.9,
      "trajectorySeparation": 0.91,
      "packReadiness": 0.87,
      "singleDomainAdherence": 0.87,
      "predictorNoise": 0.2,
      "domainIsolation": 0.33,
      "overclaimRisk": 0.18,
      "pathBias": "balanced",
      "profile": "multi_domain_latent_trajectory"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 84.17,
      "classScore": 88.91,
      "trajectoryScore": 90.14,
      "readinessScore": 92.27,
      "singleDomainScore": 50.59,
      "confidence": 69.9,
      "multiDomainContribution": 88.86,
      "singleDomainContribution": 54.16,
      "overall": 86.61
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 36.33,
      "classScore": 26.36,
      "trajectoryScore": 23.66,
      "readinessScore": 45,
      "singleDomainScore": 71.06,
      "confidence": 39.5,
      "multiDomainContribution": 40.48,
      "singleDomainContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "lp-030",
    "input": {
      "multiDomainCoverage": 0.91,
      "jointClassClarity": 0.88,
      "trajectorySeparation": 0.87,
      "packReadiness": 0.91,
      "singleDomainAdherence": 0.91,
      "predictorNoise": 0.21,
      "domainIsolation": 0.28,
      "overclaimRisk": 0.13,
      "pathBias": "joint_first",
      "profile": "single_domain_baseline"
    },
    "expectedMultiDomain": {
      "mode": "multi_domain_latent_trajectory",
      "coverageScore": 94.93,
      "classScore": 88.77,
      "trajectoryScore": 100,
      "readinessScore": 71.68,
      "singleDomainScore": 51.88,
      "confidence": 72.25,
      "multiDomainContribution": 89.63,
      "singleDomainContribution": 55.31,
      "overall": 87.45
    },
    "expectedSingleDomain": {
      "mode": "single_domain_baseline",
      "coverageScore": 25.72,
      "classScore": 25.3,
      "trajectoryScore": 22.14,
      "readinessScore": 45.02,
      "singleDomainScore": 46.21,
      "confidence": 38.95,
      "multiDomainContribution": 32.88,
      "singleDomainContribution": 50.68,
      "overall": 44.3
    }
  }
];
