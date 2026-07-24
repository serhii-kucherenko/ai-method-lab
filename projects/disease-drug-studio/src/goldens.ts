import type { GenerationInput, GenerationQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GenerationInput;
  expectedDiseaseAware: GenerationQuality;
  expectedDiseaseBlind: GenerationQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "meshDepth": 2,
      "targetLength": 138,
      "conditioningStrength": 0.1,
      "seedDiversity": 0.33,
      "batchSize": 60,
      "noveltyPrior": 0.38,
      "affinityPrior": 5.7,
      "approvedSimilarityPrior": 0.27,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 89.4,
      "noveltyScore": 36.45,
      "diversityScore": 27.1,
      "affinityScore": 48.08,
      "diseaseFitScore": 26.9,
      "approvedSimilarity": 24.4,
      "uniqueCandidates": 37,
      "overall": 45.91
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 82.75,
      "noveltyScore": 28.9,
      "diversityScore": 20.55,
      "affinityScore": 40.38,
      "diseaseFitScore": 14.05,
      "approvedSimilarity": 19.85,
      "uniqueCandidates": 25,
      "overall": 38.16
    }
  },
  {
    "id": "std-002",
    "input": {
      "meshDepth": 3,
      "targetLength": 156,
      "conditioningStrength": 0.2,
      "seedDiversity": 0.41,
      "batchSize": 80,
      "noveltyPrior": 0.46,
      "affinityPrior": 6.4,
      "approvedSimilarityPrior": 0.34,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93.4,
      "noveltyScore": 51.13,
      "diversityScore": 34.7,
      "affinityScore": 61.75,
      "diseaseFitScore": 41.8,
      "approvedSimilarity": 34.96,
      "uniqueCandidates": 57,
      "overall": 56.76
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83,
      "noveltyScore": 35.3,
      "diversityScore": 25.75,
      "affinityScore": 45.33,
      "diseaseFitScore": 15.1,
      "approvedSimilarity": 23.7,
      "uniqueCandidates": 35,
      "overall": 41.73
    }
  },
  {
    "id": "std-003",
    "input": {
      "meshDepth": 4,
      "targetLength": 174,
      "conditioningStrength": 0.3,
      "seedDiversity": 0.49,
      "batchSize": 100,
      "noveltyPrior": 0.54,
      "affinityPrior": 7.1,
      "approvedSimilarityPrior": 0.41,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 91.4,
      "noveltyScore": 54.85,
      "diversityScore": 42.3,
      "affinityScore": 62.67,
      "diseaseFitScore": 56.7,
      "approvedSimilarity": 42.2,
      "uniqueCandidates": 70,
      "overall": 61.25
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.25,
      "noveltyScore": 41.7,
      "diversityScore": 30.95,
      "affinityScore": 50.29,
      "diseaseFitScore": 16.15,
      "approvedSimilarity": 27.55,
      "uniqueCandidates": 45,
      "overall": 45.3
    }
  },
  {
    "id": "std-004",
    "input": {
      "meshDepth": 5,
      "targetLength": 192,
      "conditioningStrength": 0.4,
      "seedDiversity": 0.57,
      "batchSize": 120,
      "noveltyPrior": 0.62,
      "affinityPrior": 7.8,
      "approvedSimilarityPrior": 0.48,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 95.4,
      "noveltyScore": 71.74,
      "diversityScore": 49.9,
      "affinityScore": 77.5,
      "diseaseFitScore": 71.6,
      "approvedSimilarity": 53.66,
      "uniqueCandidates": 95,
      "overall": 72.81
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.5,
      "noveltyScore": 48.1,
      "diversityScore": 36.15,
      "affinityScore": 55.25,
      "diseaseFitScore": 17.2,
      "approvedSimilarity": 31.4,
      "uniqueCandidates": 56,
      "overall": 48.87
    }
  },
  {
    "id": "std-005",
    "input": {
      "meshDepth": 1,
      "targetLength": 210,
      "conditioningStrength": 0.5,
      "seedDiversity": 0.65,
      "batchSize": 140,
      "noveltyPrior": 0.7,
      "affinityPrior": 8.5,
      "approvedSimilarityPrior": 0.55,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93.4,
      "noveltyScore": 63.25,
      "diversityScore": 57.5,
      "affinityScore": 72.29,
      "diseaseFitScore": 46.5,
      "approvedSimilarity": 52.5,
      "uniqueCandidates": 108,
      "overall": 67.09
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.75,
      "noveltyScore": 54.5,
      "diversityScore": 41.35,
      "affinityScore": 60.21,
      "diseaseFitScore": 18.25,
      "approvedSimilarity": 35.25,
      "uniqueCandidates": 67,
      "overall": 52.44
    }
  },
  {
    "id": "std-006",
    "input": {
      "meshDepth": 2,
      "targetLength": 228,
      "conditioningStrength": 0.6,
      "seedDiversity": 0.73,
      "batchSize": 160,
      "noveltyPrior": 0.78,
      "affinityPrior": 9.2,
      "approvedSimilarityPrior": 0.62,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 97.4,
      "noveltyScore": 81.14,
      "diversityScore": 65.1,
      "affinityScore": 86.83,
      "diseaseFitScore": 61.4,
      "approvedSimilarity": 64.47,
      "uniqueCandidates": 140,
      "overall": 78.78
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84,
      "noveltyScore": 60.9,
      "diversityScore": 46.55,
      "affinityScore": 65.17,
      "diseaseFitScore": 19.3,
      "approvedSimilarity": 39.1,
      "uniqueCandidates": 79,
      "overall": 56.02
    }
  },
  {
    "id": "std-007",
    "input": {
      "meshDepth": 3,
      "targetLength": 246,
      "conditioningStrength": 0.7,
      "seedDiversity": 0.81,
      "batchSize": 180,
      "noveltyPrior": 0.3,
      "affinityPrior": 9.9,
      "approvedSimilarityPrior": 0.69,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 95.4,
      "noveltyScore": 50.85,
      "diversityScore": 72.7,
      "affinityScore": 88.63,
      "diseaseFitScore": 76.3,
      "approvedSimilarity": 70.3,
      "uniqueCandidates": 152,
      "overall": 78.25
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.25,
      "noveltyScore": 39.3,
      "diversityScore": 51.75,
      "affinityScore": 70.13,
      "diseaseFitScore": 20.35,
      "approvedSimilarity": 42.95,
      "uniqueCandidates": 92,
      "overall": 55.39
    }
  },
  {
    "id": "std-008",
    "input": {
      "meshDepth": 4,
      "targetLength": 264,
      "conditioningStrength": 0.8,
      "seedDiversity": 0.25,
      "batchSize": 200,
      "noveltyPrior": 0.38,
      "affinityPrior": 5,
      "approvedSimilarityPrior": 0.76,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 99.4,
      "noveltyScore": 42.17,
      "diversityScore": 35.5,
      "affinityScore": 57.67,
      "diseaseFitScore": 91.2,
      "approvedSimilarity": 83.16,
      "uniqueCandidates": 170,
      "overall": 67.94
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.5,
      "noveltyScore": 26.5,
      "diversityScore": 21.75,
      "affinityScore": 35.42,
      "diseaseFitScore": 21.4,
      "approvedSimilarity": 46.8,
      "uniqueCandidates": 80,
      "overall": 40.88
    }
  },
  {
    "id": "std-009",
    "input": {
      "meshDepth": 5,
      "targetLength": 282,
      "conditioningStrength": 0.9,
      "seedDiversity": 0.33,
      "batchSize": 220,
      "noveltyPrior": 0.46,
      "affinityPrior": 5.7,
      "approvedSimilarityPrior": 0.2,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 97.4,
      "noveltyScore": 46.85,
      "diversityScore": 43.1,
      "affinityScore": 60.63,
      "diseaseFitScore": 93.5,
      "approvedSimilarity": 44,
      "uniqueCandidates": 181,
      "overall": 66.56
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.75,
      "noveltyScore": 32.9,
      "diversityScore": 26.95,
      "affinityScore": 40.38,
      "diseaseFitScore": 13,
      "approvedSimilarity": 16,
      "uniqueCandidates": 92,
      "overall": 39.57
    }
  },
  {
    "id": "std-010",
    "input": {
      "meshDepth": 1,
      "targetLength": 300,
      "conditioningStrength": 0,
      "seedDiversity": 0.41,
      "batchSize": 240,
      "noveltyPrior": 0.54,
      "affinityPrior": 6.4,
      "approvedSimilarityPrior": 0.27,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93.4,
      "noveltyScore": 51.58,
      "diversityScore": 40.7,
      "affinityScore": 60,
      "diseaseFitScore": 13.4,
      "approvedSimilarity": 21.42,
      "uniqueCandidates": 159,
      "overall": 51.67
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 85,
      "noveltyScore": 39.3,
      "diversityScore": 32.15,
      "affinityScore": 45.33,
      "diseaseFitScore": 14.05,
      "approvedSimilarity": 19.85,
      "uniqueCandidates": 104,
      "overall": 43.14
    }
  },
  {
    "id": "std-011",
    "input": {
      "meshDepth": 2,
      "targetLength": 318,
      "conditioningStrength": 0.1,
      "seedDiversity": 0.49,
      "batchSize": 260,
      "noveltyPrior": 0.62,
      "affinityPrior": 7.1,
      "approvedSimilarityPrior": 0.34,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 91.4,
      "noveltyScore": 55.25,
      "diversityScore": 48.3,
      "affinityScore": 59.75,
      "diseaseFitScore": 28.3,
      "approvedSimilarity": 29.3,
      "uniqueCandidates": 169,
      "overall": 55.93
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 85.25,
      "noveltyScore": 45.7,
      "diversityScore": 37.35,
      "affinityScore": 50.29,
      "diseaseFitScore": 15.1,
      "approvedSimilarity": 23.7,
      "uniqueCandidates": 116,
      "overall": 46.72
    }
  },
  {
    "id": "std-012",
    "input": {
      "meshDepth": 3,
      "targetLength": 336,
      "conditioningStrength": 0.2,
      "seedDiversity": 0.57,
      "batchSize": 40,
      "noveltyPrior": 0.7,
      "affinityPrior": 7.8,
      "approvedSimilarityPrior": 0.41,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93,
      "noveltyScore": 72.18,
      "diversityScore": 43.9,
      "affinityScore": 73.42,
      "diseaseFitScore": 43.2,
      "approvedSimilarity": 40.11,
      "uniqueCandidates": 30,
      "overall": 64.86
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 82.5,
      "noveltyScore": 52.1,
      "diversityScore": 32.95,
      "affinityScore": 55.25,
      "diseaseFitScore": 16.15,
      "approvedSimilarity": 27.55,
      "uniqueCandidates": 19,
      "overall": 48.25
    }
  },
  {
    "id": "std-013",
    "input": {
      "meshDepth": 4,
      "targetLength": 354,
      "conditioningStrength": 0.3,
      "seedDiversity": 0.65,
      "batchSize": 60,
      "noveltyPrior": 0.78,
      "affinityPrior": 8.5,
      "approvedSimilarityPrior": 0.48,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 91,
      "noveltyScore": 73.65,
      "diversityScore": 51.5,
      "affinityScore": 74.33,
      "diseaseFitScore": 58.1,
      "approvedSimilarity": 47.1,
      "uniqueCandidates": 43,
      "overall": 68.98
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 82.75,
      "noveltyScore": 58.5,
      "diversityScore": 38.15,
      "affinityScore": 60.21,
      "diseaseFitScore": 17.2,
      "approvedSimilarity": 31.4,
      "uniqueCandidates": 29,
      "overall": 51.82
    }
  },
  {
    "id": "std-014",
    "input": {
      "meshDepth": 5,
      "targetLength": 372,
      "conditioningStrength": 0.4,
      "seedDiversity": 0.73,
      "batchSize": 80,
      "noveltyPrior": 0.3,
      "affinityPrior": 9.2,
      "approvedSimilarityPrior": 0.55,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 95,
      "noveltyScore": 58.3,
      "diversityScore": 59.1,
      "affinityScore": 89.17,
      "diseaseFitScore": 73,
      "approvedSimilarity": 58.8,
      "uniqueCandidates": 66,
      "overall": 75.73
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83,
      "noveltyScore": 36.9,
      "diversityScore": 43.35,
      "affinityScore": 65.17,
      "diseaseFitScore": 18.25,
      "approvedSimilarity": 35.25,
      "uniqueCandidates": 40,
      "overall": 51.19
    }
  },
  {
    "id": "std-015",
    "input": {
      "meshDepth": 1,
      "targetLength": 390,
      "conditioningStrength": 0.5,
      "seedDiversity": 0.81,
      "batchSize": 100,
      "noveltyPrior": 0.38,
      "affinityPrior": 9.9,
      "approvedSimilarityPrior": 0.62,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93,
      "noveltyScore": 51.25,
      "diversityScore": 66.7,
      "affinityScore": 83.96,
      "diseaseFitScore": 47.9,
      "approvedSimilarity": 57.4,
      "uniqueCandidates": 80,
      "overall": 70.21
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.25,
      "noveltyScore": 43.3,
      "diversityScore": 48.55,
      "affinityScore": 70.13,
      "diseaseFitScore": 19.3,
      "approvedSimilarity": 39.1,
      "uniqueCandidates": 51,
      "overall": 54.77
    }
  },
  {
    "id": "std-016",
    "input": {
      "meshDepth": 2,
      "targetLength": 408,
      "conditioningStrength": 0.6,
      "seedDiversity": 0.25,
      "batchSize": 120,
      "noveltyPrior": 0.46,
      "affinityPrior": 5,
      "approvedSimilarityPrior": 0.69,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 97,
      "noveltyScore": 42.62,
      "diversityScore": 29.5,
      "affinityScore": 51.83,
      "diseaseFitScore": 62.8,
      "approvedSimilarity": 69.61,
      "uniqueCandidates": 96,
      "overall": 59.56
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.5,
      "noveltyScore": 30.5,
      "diversityScore": 18.55,
      "affinityScore": 35.42,
      "diseaseFitScore": 20.35,
      "approvedSimilarity": 42.95,
      "uniqueCandidates": 48,
      "overall": 40.26
    }
  },
  {
    "id": "std-017",
    "input": {
      "meshDepth": 3,
      "targetLength": 426,
      "conditioningStrength": 0.7,
      "seedDiversity": 0.33,
      "batchSize": 140,
      "noveltyPrior": 0.54,
      "affinityPrior": 5.7,
      "approvedSimilarityPrior": 0.76,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 95,
      "noveltyScore": 47.25,
      "diversityScore": 37.1,
      "affinityScore": 53.63,
      "diseaseFitScore": 77.7,
      "approvedSimilarity": 75.2,
      "uniqueCandidates": 108,
      "overall": 64.24
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.75,
      "noveltyScore": 36.9,
      "diversityScore": 23.75,
      "affinityScore": 40.38,
      "diseaseFitScore": 21.4,
      "approvedSimilarity": 46.8,
      "uniqueCandidates": 58,
      "overall": 43.83
    }
  },
  {
    "id": "std-018",
    "input": {
      "meshDepth": 4,
      "targetLength": 444,
      "conditioningStrength": 0.8,
      "seedDiversity": 0.41,
      "batchSize": 160,
      "noveltyPrior": 0.62,
      "affinityPrior": 6.4,
      "approvedSimilarityPrior": 0.2,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 99,
      "noveltyScore": 63.22,
      "diversityScore": 44.7,
      "affinityScore": 69.33,
      "diseaseFitScore": 80,
      "approvedSimilarity": 42,
      "uniqueCandidates": 140,
      "overall": 69.52
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84,
      "noveltyScore": 43.3,
      "diversityScore": 28.95,
      "affinityScore": 45.33,
      "diseaseFitScore": 13,
      "approvedSimilarity": 16,
      "uniqueCandidates": 69,
      "overall": 42.52
    }
  },
  {
    "id": "std-019",
    "input": {
      "meshDepth": 5,
      "targetLength": 462,
      "conditioningStrength": 0.9,
      "seedDiversity": 0.49,
      "batchSize": 180,
      "noveltyPrior": 0.7,
      "affinityPrior": 7.1,
      "approvedSimilarityPrior": 0.27,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 97,
      "noveltyScore": 65.65,
      "diversityScore": 52.3,
      "affinityScore": 72.29,
      "diseaseFitScore": 94.9,
      "approvedSimilarity": 48.9,
      "uniqueCandidates": 153,
      "overall": 74.29
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.25,
      "noveltyScore": 49.7,
      "diversityScore": 34.15,
      "affinityScore": 50.29,
      "diseaseFitScore": 14.05,
      "approvedSimilarity": 19.85,
      "uniqueCandidates": 81,
      "overall": 46.09
    }
  },
  {
    "id": "std-020",
    "input": {
      "meshDepth": 1,
      "targetLength": 480,
      "conditioningStrength": 0,
      "seedDiversity": 0.57,
      "batchSize": 200,
      "noveltyPrior": 0.78,
      "affinityPrior": 7.8,
      "approvedSimilarityPrior": 0.34,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93,
      "noveltyScore": 72.63,
      "diversityScore": 49.9,
      "affinityScore": 71.67,
      "diseaseFitScore": 14.8,
      "approvedSimilarity": 26.57,
      "uniqueCandidates": 137,
      "overall": 59.77
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.5,
      "noveltyScore": 56.1,
      "diversityScore": 39.35,
      "affinityScore": 55.25,
      "diseaseFitScore": 15.1,
      "approvedSimilarity": 23.7,
      "uniqueCandidates": 93,
      "overall": 49.67
    }
  },
  {
    "id": "std-021",
    "input": {
      "meshDepth": 2,
      "targetLength": 498,
      "conditioningStrength": 0.1,
      "seedDiversity": 0.65,
      "batchSize": 220,
      "noveltyPrior": 0.3,
      "affinityPrior": 8.5,
      "approvedSimilarityPrior": 0.41,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 91,
      "noveltyScore": 43.25,
      "diversityScore": 57.5,
      "affinityScore": 71.42,
      "diseaseFitScore": 29.7,
      "approvedSimilarity": 34.2,
      "uniqueCandidates": 148,
      "overall": 59.04
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84.75,
      "noveltyScore": 34.5,
      "diversityScore": 44.55,
      "affinityScore": 60.21,
      "diseaseFitScore": 16.15,
      "approvedSimilarity": 27.55,
      "uniqueCandidates": 106,
      "overall": 49.04
    }
  },
  {
    "id": "std-022",
    "input": {
      "meshDepth": 3,
      "targetLength": 516,
      "conditioningStrength": 0.2,
      "seedDiversity": 0.73,
      "batchSize": 240,
      "noveltyPrior": 0.38,
      "affinityPrior": 9.2,
      "approvedSimilarityPrior": 0.48,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 95,
      "noveltyScore": 58.74,
      "diversityScore": 65.1,
      "affinityScore": 85.08,
      "diseaseFitScore": 44.6,
      "approvedSimilarity": 45.26,
      "uniqueCandidates": 184,
      "overall": 70.06
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 85,
      "noveltyScore": 40.9,
      "diversityScore": 49.75,
      "affinityScore": 65.17,
      "diseaseFitScore": 17.2,
      "approvedSimilarity": 31.4,
      "uniqueCandidates": 119,
      "overall": 52.61
    }
  },
  {
    "id": "std-023",
    "input": {
      "meshDepth": 4,
      "targetLength": 534,
      "conditioningStrength": 0.3,
      "seedDiversity": 0.81,
      "batchSize": 260,
      "noveltyPrior": 0.46,
      "affinityPrior": 9.9,
      "approvedSimilarityPrior": 0.55,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 93,
      "noveltyScore": 61.65,
      "diversityScore": 72.7,
      "affinityScore": 86,
      "diseaseFitScore": 59.5,
      "approvedSimilarity": 52,
      "uniqueCandidates": 194,
      "overall": 74.38
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 85.25,
      "noveltyScore": 47.3,
      "diversityScore": 54.95,
      "affinityScore": 70.13,
      "diseaseFitScore": 18.25,
      "approvedSimilarity": 35.25,
      "uniqueCandidates": 133,
      "overall": 56.18
    }
  },
  {
    "id": "std-024",
    "input": {
      "meshDepth": 5,
      "targetLength": 552,
      "conditioningStrength": 0.4,
      "seedDiversity": 0.25,
      "batchSize": 40,
      "noveltyPrior": 0.54,
      "affinityPrior": 5,
      "approvedSimilarityPrior": 0.62,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 94.6,
      "noveltyScore": 54.26,
      "diversityScore": 23.5,
      "affinityScore": 54.17,
      "diseaseFitScore": 74.4,
      "approvedSimilarity": 63.95,
      "uniqueCandidates": 30,
      "overall": 61.68
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 82.5,
      "noveltyScore": 34.5,
      "diversityScore": 15.35,
      "affinityScore": 35.42,
      "diseaseFitScore": 19.3,
      "approvedSimilarity": 39.1,
      "uniqueCandidates": 16,
      "overall": 39.64
    }
  },
  {
    "id": "std-025",
    "input": {
      "meshDepth": 1,
      "targetLength": 570,
      "conditioningStrength": 0.5,
      "seedDiversity": 0.33,
      "batchSize": 60,
      "noveltyPrior": 0.62,
      "affinityPrior": 5.7,
      "approvedSimilarityPrior": 0.69,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 92.6,
      "noveltyScore": 47.65,
      "diversityScore": 31.1,
      "affinityScore": 48.96,
      "diseaseFitScore": 49.3,
      "approvedSimilarity": 62.3,
      "uniqueCandidates": 43,
      "overall": 56.2
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 82.75,
      "noveltyScore": 40.9,
      "diversityScore": 20.55,
      "affinityScore": 40.38,
      "diseaseFitScore": 20.35,
      "approvedSimilarity": 42.95,
      "uniqueCandidates": 25,
      "overall": 43.21
    }
  },
  {
    "id": "std-026",
    "input": {
      "meshDepth": 2,
      "targetLength": 588,
      "conditioningStrength": 0.6,
      "seedDiversity": 0.41,
      "batchSize": 80,
      "noveltyPrior": 0.7,
      "affinityPrior": 6.4,
      "approvedSimilarityPrior": 0.76,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 96.6,
      "noveltyScore": 63.67,
      "diversityScore": 38.7,
      "affinityScore": 63.5,
      "diseaseFitScore": 64.2,
      "approvedSimilarity": 74.76,
      "uniqueCandidates": 66,
      "overall": 67.66
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83,
      "noveltyScore": 47.3,
      "diversityScore": 25.75,
      "affinityScore": 45.33,
      "diseaseFitScore": 21.4,
      "approvedSimilarity": 46.8,
      "uniqueCandidates": 35,
      "overall": 46.78
    }
  },
  {
    "id": "std-027",
    "input": {
      "meshDepth": 3,
      "targetLength": 606,
      "conditioningStrength": 0.7,
      "seedDiversity": 0.49,
      "batchSize": 100,
      "noveltyPrior": 0.78,
      "affinityPrior": 7.1,
      "approvedSimilarityPrior": 0.2,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 94.6,
      "noveltyScore": 66.05,
      "diversityScore": 46.3,
      "affinityScore": 65.29,
      "diseaseFitScore": 66.5,
      "approvedSimilarity": 36,
      "uniqueCandidates": 80,
      "overall": 65.67
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.25,
      "noveltyScore": 53.7,
      "diversityScore": 30.95,
      "affinityScore": 50.29,
      "diseaseFitScore": 13,
      "approvedSimilarity": 16,
      "uniqueCandidates": 45,
      "overall": 45.47
    }
  },
  {
    "id": "std-028",
    "input": {
      "meshDepth": 4,
      "targetLength": 624,
      "conditioningStrength": 0.8,
      "seedDiversity": 0.57,
      "batchSize": 120,
      "noveltyPrior": 0.3,
      "affinityPrior": 7.8,
      "approvedSimilarityPrior": 0.27,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 98.6,
      "noveltyScore": 49.78,
      "diversityScore": 53.9,
      "affinityScore": 81,
      "diseaseFitScore": 81.4,
      "approvedSimilarity": 47.15,
      "uniqueCandidates": 108,
      "overall": 72.45
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.5,
      "noveltyScore": 32.1,
      "diversityScore": 36.15,
      "affinityScore": 55.25,
      "diseaseFitScore": 14.05,
      "approvedSimilarity": 19.85,
      "uniqueCandidates": 56,
      "overall": 44.84
    }
  },
  {
    "id": "std-029",
    "input": {
      "meshDepth": 5,
      "targetLength": 642,
      "conditioningStrength": 0.9,
      "seedDiversity": 0.65,
      "batchSize": 140,
      "noveltyPrior": 0.38,
      "affinityPrior": 8.5,
      "approvedSimilarityPrior": 0.34,
      "profile": "sft"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 96.6,
      "noveltyScore": 53.65,
      "diversityScore": 61.5,
      "affinityScore": 83.96,
      "diseaseFitScore": 96.3,
      "approvedSimilarity": 53.8,
      "uniqueCandidates": 122,
      "overall": 77.41
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 83.75,
      "noveltyScore": 38.5,
      "diversityScore": 41.35,
      "affinityScore": 60.21,
      "diseaseFitScore": 15.1,
      "approvedSimilarity": 23.7,
      "uniqueCandidates": 67,
      "overall": 48.42
    }
  },
  {
    "id": "std-030",
    "input": {
      "meshDepth": 1,
      "targetLength": 660,
      "conditioningStrength": 0,
      "seedDiversity": 0.73,
      "batchSize": 160,
      "noveltyPrior": 0.46,
      "affinityPrior": 9.2,
      "approvedSimilarityPrior": 0.41,
      "profile": "grpo"
    },
    "expectedDiseaseAware": {
      "mode": "disease_aware",
      "validityScore": 92.6,
      "noveltyScore": 59.19,
      "diversityScore": 59.1,
      "affinityScore": 83.33,
      "diseaseFitScore": 16.2,
      "approvedSimilarity": 31.71,
      "uniqueCandidates": 114,
      "overall": 62.7
    },
    "expectedDiseaseBlind": {
      "mode": "disease_blind",
      "validityScore": 84,
      "noveltyScore": 44.9,
      "diversityScore": 46.55,
      "affinityScore": 65.17,
      "diseaseFitScore": 16.15,
      "approvedSimilarity": 27.55,
      "uniqueCandidates": 79,
      "overall": 51.99
    }
  }
] as Golden[];
