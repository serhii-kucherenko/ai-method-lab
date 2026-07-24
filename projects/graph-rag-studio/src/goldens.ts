import type { GraphInput, GraphQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GraphInput;
  expectedMultiStep: GraphQuality;
  expectedSingleShot: GraphQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "std-001",
    "input": {
      "docs": 8,
      "rawMentions": 27,
      "uniqueEntities": 25,
      "duplicateRate": 0.1,
      "weakEdges": 4,
      "strongEdges": 8,
      "hopDepthUseful": 2,
      "queryCoverage": 0.43,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 65.46,
      "consolidateScore": 93.61,
      "retrievalScore": 52.25,
      "overall": 72.1,
      "entitiesKept": 25,
      "edgesKept": 8,
      "duplicatesRemoved": 3,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 99.63,
      "consolidateScore": 35.8,
      "retrievalScore": 44.65,
      "overall": 67.62,
      "entitiesKept": 27,
      "edgesKept": 12,
      "duplicatesRemoved": 0,
      "noiseEdges": 4,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-002",
    "input": {
      "docs": 11,
      "rawMentions": 34,
      "uniqueEntities": 28,
      "duplicateRate": 0.2,
      "weakEdges": 6,
      "strongEdges": 11,
      "hopDepthUseful": 3,
      "queryCoverage": 0.51,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 67.92,
      "consolidateScore": 89.22,
      "retrievalScore": 62.96,
      "overall": 74.7,
      "entitiesKept": 28,
      "edgesKept": 11,
      "duplicatesRemoved": 7,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 93.08,
      "consolidateScore": 35.55,
      "retrievalScore": 51.05,
      "overall": 66.86,
      "entitiesKept": 34,
      "edgesKept": 17,
      "duplicatesRemoved": 0,
      "noiseEdges": 6,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-003",
    "input": {
      "docs": 14,
      "rawMentions": 41,
      "uniqueEntities": 31,
      "duplicateRate": 0.3,
      "weakEdges": 8,
      "strongEdges": 14,
      "hopDepthUseful": 4,
      "queryCoverage": 0.59,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 62.45,
      "consolidateScore": 86.06,
      "retrievalScore": 73.8,
      "overall": 75.87,
      "entitiesKept": 31,
      "edgesKept": 14,
      "duplicatesRemoved": 12,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 89.98,
      "consolidateScore": 35.3,
      "retrievalScore": 54.45,
      "overall": 66.61,
      "entitiesKept": 41,
      "edgesKept": 22,
      "duplicatesRemoved": 0,
      "noiseEdges": 8,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-004",
    "input": {
      "docs": 17,
      "rawMentions": 48,
      "uniqueEntities": 32,
      "duplicateRate": 0.4,
      "weakEdges": 10,
      "strongEdges": 17,
      "hopDepthUseful": 1,
      "queryCoverage": 0.67,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 68.05,
      "consolidateScore": 82.13,
      "retrievalScore": 64.69,
      "overall": 72.51,
      "entitiesKept": 32,
      "edgesKept": 17,
      "duplicatesRemoved": 19,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 88.5,
      "consolidateScore": 35.05,
      "retrievalScore": 54.85,
      "overall": 66.03,
      "entitiesKept": 48,
      "edgesKept": 27,
      "duplicatesRemoved": 0,
      "noiseEdges": 10,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-005",
    "input": {
      "docs": 20,
      "rawMentions": 55,
      "uniqueEntities": 32,
      "duplicateRate": 0.5,
      "weakEdges": 12,
      "strongEdges": 20,
      "hopDepthUseful": 2,
      "queryCoverage": 0.75,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 64.13,
      "consolidateScore": 78.36,
      "retrievalScore": 75.63,
      "overall": 73.85,
      "entitiesKept": 32,
      "edgesKept": 20,
      "duplicatesRemoved": 28,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 87.92,
      "consolidateScore": 34.8,
      "retrievalScore": 58.25,
      "overall": 66.91,
      "entitiesKept": 55,
      "edgesKept": 32,
      "duplicatesRemoved": 0,
      "noiseEdges": 12,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-006",
    "input": {
      "docs": 23,
      "rawMentions": 62,
      "uniqueEntities": 30,
      "duplicateRate": 0.6,
      "weakEdges": 14,
      "strongEdges": 23,
      "hopDepthUseful": 3,
      "queryCoverage": 0.83,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 70.82,
      "consolidateScore": 74.14,
      "retrievalScore": 86.57,
      "overall": 77.66,
      "entitiesKept": 30,
      "edgesKept": 23,
      "duplicatesRemoved": 37,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 87.88,
      "consolidateScore": 34.55,
      "retrievalScore": 64.65,
      "overall": 69.08,
      "entitiesKept": 62,
      "edgesKept": 37,
      "duplicatesRemoved": 0,
      "noiseEdges": 14,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-007",
    "input": {
      "docs": 26,
      "rawMentions": 69,
      "uniqueEntities": 28,
      "duplicateRate": 0.7,
      "weakEdges": 16,
      "strongEdges": 26,
      "hopDepthUseful": 4,
      "queryCoverage": 0.35,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 67.24,
      "consolidateScore": 70.6,
      "retrievalScore": 55.54,
      "overall": 64.49,
      "entitiesKept": 28,
      "edgesKept": 26,
      "duplicatesRemoved": 48,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 88.19,
      "consolidateScore": 34.3,
      "retrievalScore": 37.25,
      "overall": 59.58,
      "entitiesKept": 69,
      "edgesKept": 42,
      "duplicatesRemoved": 0,
      "noiseEdges": 16,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-008",
    "input": {
      "docs": 29,
      "rawMentions": 76,
      "uniqueEntities": 24,
      "duplicateRate": 0.8,
      "weakEdges": 2,
      "strongEdges": 29,
      "hopDepthUseful": 1,
      "queryCoverage": 0.43,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 74.59,
      "consolidateScore": 66.65,
      "retrievalScore": 51.28,
      "overall": 63.26,
      "entitiesKept": 24,
      "edgesKept": 29,
      "duplicatesRemoved": 61,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 88.75,
      "consolidateScore": 31.65,
      "retrievalScore": 45.65,
      "overall": 62.25,
      "entitiesKept": 76,
      "edgesKept": 31,
      "duplicatesRemoved": 0,
      "noiseEdges": 2,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-009",
    "input": {
      "docs": 32,
      "rawMentions": 83,
      "uniqueEntities": 83,
      "duplicateRate": 0,
      "weakEdges": 4,
      "strongEdges": 32,
      "hopDepthUseful": 2,
      "queryCoverage": 0.51,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 70.99,
      "consolidateScore": 100,
      "retrievalScore": 61.58,
      "overall": 79.3,
      "entitiesKept": 83,
      "edgesKept": 32,
      "duplicatesRemoved": 0,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 89.49,
      "consolidateScore": 40.4,
      "retrievalScore": 49.05,
      "overall": 65.52,
      "entitiesKept": 83,
      "edgesKept": 36,
      "duplicatesRemoved": 0,
      "noiseEdges": 4,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-010",
    "input": {
      "docs": 35,
      "rawMentions": 90,
      "uniqueEntities": 82,
      "duplicateRate": 0.1,
      "weakEdges": 6,
      "strongEdges": 5,
      "hopDepthUseful": 3,
      "queryCoverage": 0.59,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 78.84,
      "consolidateScore": 91.89,
      "retrievalScore": 66.07,
      "overall": 79.59,
      "entitiesKept": 82,
      "edgesKept": 5,
      "duplicatesRemoved": 9,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 90.36,
      "consolidateScore": 35.65,
      "retrievalScore": 55.45,
      "overall": 67.2,
      "entitiesKept": 90,
      "edgesKept": 11,
      "duplicatesRemoved": 0,
      "noiseEdges": 6,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-011",
    "input": {
      "docs": 38,
      "rawMentions": 97,
      "uniqueEntities": 81,
      "duplicateRate": 0.2,
      "weakEdges": 8,
      "strongEdges": 8,
      "hopDepthUseful": 4,
      "queryCoverage": 0.67,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 74.67,
      "consolidateScore": 88.43,
      "retrievalScore": 77.75,
      "overall": 81.25,
      "entitiesKept": 81,
      "edgesKept": 8,
      "duplicatesRemoved": 19,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 91.32,
      "consolidateScore": 35.4,
      "retrievalScore": 58.85,
      "overall": 68.77,
      "entitiesKept": 97,
      "edgesKept": 16,
      "duplicatesRemoved": 0,
      "noiseEdges": 8,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-012",
    "input": {
      "docs": 5,
      "rawMentions": 104,
      "uniqueEntities": 77,
      "duplicateRate": 0.3,
      "weakEdges": 10,
      "strongEdges": 11,
      "hopDepthUseful": 1,
      "queryCoverage": 0.75,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 84.31,
      "retrievalScore": 69.11,
      "overall": 82.91,
      "entitiesKept": 77,
      "edgesKept": 11,
      "duplicatesRemoved": 31,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 35.15,
      "retrievalScore": 59.25,
      "overall": 72.77,
      "entitiesKept": 104,
      "edgesKept": 21,
      "duplicatesRemoved": 0,
      "noiseEdges": 10,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-013",
    "input": {
      "docs": 8,
      "rawMentions": 111,
      "uniqueEntities": 73,
      "duplicateRate": 0.4,
      "weakEdges": 12,
      "strongEdges": 14,
      "hopDepthUseful": 2,
      "queryCoverage": 0.83,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 80.62,
      "retrievalScore": 80.33,
      "overall": 85.36,
      "entitiesKept": 73,
      "edgesKept": 14,
      "duplicatesRemoved": 44,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.9,
      "retrievalScore": 62.65,
      "overall": 73.91,
      "entitiesKept": 111,
      "edgesKept": 26,
      "duplicatesRemoved": 0,
      "noiseEdges": 12,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-014",
    "input": {
      "docs": 11,
      "rawMentions": 118,
      "uniqueEntities": 68,
      "duplicateRate": 0.5,
      "weakEdges": 14,
      "strongEdges": 17,
      "hopDepthUseful": 3,
      "queryCoverage": 0.35,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 76.97,
      "retrievalScore": 49.48,
      "overall": 73.11,
      "entitiesKept": 68,
      "edgesKept": 17,
      "duplicatesRemoved": 59,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.65,
      "retrievalScore": 38.25,
      "overall": 65.32,
      "entitiesKept": 118,
      "edgesKept": 31,
      "duplicatesRemoved": 0,
      "noiseEdges": 14,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-015",
    "input": {
      "docs": 14,
      "rawMentions": 125,
      "uniqueEntities": 61,
      "duplicateRate": 0.6,
      "weakEdges": 16,
      "strongEdges": 20,
      "hopDepthUseful": 4,
      "queryCoverage": 0.43,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 73.08,
      "retrievalScore": 60.58,
      "overall": 75.44,
      "entitiesKept": 61,
      "edgesKept": 20,
      "duplicatesRemoved": 75,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.4,
      "retrievalScore": 41.65,
      "overall": 66.46,
      "entitiesKept": 125,
      "edgesKept": 36,
      "duplicatesRemoved": 0,
      "noiseEdges": 16,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-016",
    "input": {
      "docs": 17,
      "rawMentions": 132,
      "uniqueEntities": 53,
      "duplicateRate": 0.7,
      "weakEdges": 2,
      "strongEdges": 23,
      "hopDepthUseful": 1,
      "queryCoverage": 0.51,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 69.25,
      "retrievalScore": 57.05,
      "overall": 72.67,
      "entitiesKept": 53,
      "edgesKept": 23,
      "duplicatesRemoved": 92,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 31.75,
      "retrievalScore": 50.05,
      "overall": 68.87,
      "entitiesKept": 132,
      "edgesKept": 25,
      "duplicatesRemoved": 0,
      "noiseEdges": 2,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-017",
    "input": {
      "docs": 20,
      "rawMentions": 139,
      "uniqueEntities": 44,
      "duplicateRate": 0.8,
      "weakEdges": 4,
      "strongEdges": 26,
      "hopDepthUseful": 2,
      "queryCoverage": 0.59,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 65.48,
      "retrievalScore": 67.25,
      "overall": 74.73,
      "entitiesKept": 44,
      "edgesKept": 26,
      "duplicatesRemoved": 111,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 31.5,
      "retrievalScore": 53.45,
      "overall": 70.01,
      "entitiesKept": 139,
      "edgesKept": 30,
      "duplicatesRemoved": 0,
      "noiseEdges": 4,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-018",
    "input": {
      "docs": 23,
      "rawMentions": 146,
      "uniqueEntities": 146,
      "duplicateRate": 0,
      "weakEdges": 6,
      "strongEdges": 29,
      "hopDepthUseful": 3,
      "queryCoverage": 0.67,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 100,
      "retrievalScore": 77.68,
      "overall": 92.19,
      "entitiesKept": 146,
      "edgesKept": 29,
      "duplicatesRemoved": 0,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 40.25,
      "retrievalScore": 59.85,
      "overall": 74,
      "entitiesKept": 146,
      "edgesKept": 35,
      "duplicatesRemoved": 0,
      "noiseEdges": 6,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-019",
    "input": {
      "docs": 26,
      "rawMentions": 153,
      "uniqueEntities": 140,
      "duplicateRate": 0.1,
      "weakEdges": 8,
      "strongEdges": 32,
      "hopDepthUseful": 4,
      "queryCoverage": 0.75,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 100,
      "retrievalScore": 88.25,
      "overall": 95.89,
      "entitiesKept": 140,
      "edgesKept": 32,
      "duplicatesRemoved": 15,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 40,
      "retrievalScore": 63.25,
      "overall": 75.14,
      "entitiesKept": 153,
      "edgesKept": 40,
      "duplicatesRemoved": 0,
      "noiseEdges": 8,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-020",
    "input": {
      "docs": 29,
      "rawMentions": 160,
      "uniqueEntities": 133,
      "duplicateRate": 0.2,
      "weakEdges": 10,
      "strongEdges": 5,
      "hopDepthUseful": 1,
      "queryCoverage": 0.83,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 87.09,
      "retrievalScore": 72.25,
      "overall": 85.12,
      "entitiesKept": 133,
      "edgesKept": 5,
      "duplicatesRemoved": 32,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 35.25,
      "retrievalScore": 63.65,
      "overall": 74.33,
      "entitiesKept": 160,
      "edgesKept": 15,
      "duplicatesRemoved": 0,
      "noiseEdges": 10,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-021",
    "input": {
      "docs": 32,
      "rawMentions": 167,
      "uniqueEntities": 124,
      "duplicateRate": 0.3,
      "weakEdges": 12,
      "strongEdges": 8,
      "hopDepthUseful": 2,
      "queryCoverage": 0.35,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 83.19,
      "retrievalScore": 42.25,
      "overall": 73.06,
      "entitiesKept": 124,
      "edgesKept": 8,
      "duplicatesRemoved": 50,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 35,
      "retrievalScore": 36.25,
      "overall": 64.69,
      "entitiesKept": 167,
      "edgesKept": 20,
      "duplicatesRemoved": 0,
      "noiseEdges": 12,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-022",
    "input": {
      "docs": 35,
      "rawMentions": 174,
      "uniqueEntities": 115,
      "duplicateRate": 0.4,
      "weakEdges": 14,
      "strongEdges": 11,
      "hopDepthUseful": 3,
      "queryCoverage": 0.43,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 79.53,
      "retrievalScore": 53.85,
      "overall": 75.66,
      "entitiesKept": 115,
      "edgesKept": 11,
      "duplicatesRemoved": 70,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.75,
      "retrievalScore": 42.65,
      "overall": 66.88,
      "entitiesKept": 174,
      "edgesKept": 25,
      "duplicatesRemoved": 0,
      "noiseEdges": 14,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-023",
    "input": {
      "docs": 38,
      "rawMentions": 181,
      "uniqueEntities": 104,
      "duplicateRate": 0.5,
      "weakEdges": 16,
      "strongEdges": 14,
      "hopDepthUseful": 4,
      "queryCoverage": 0.51,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 75.71,
      "retrievalScore": 65.25,
      "overall": 78.12,
      "entitiesKept": 104,
      "edgesKept": 14,
      "duplicatesRemoved": 91,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.5,
      "retrievalScore": 46.05,
      "overall": 68.02,
      "entitiesKept": 181,
      "edgesKept": 30,
      "duplicatesRemoved": 0,
      "noiseEdges": 16,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-024",
    "input": {
      "docs": 5,
      "rawMentions": 188,
      "uniqueEntities": 92,
      "duplicateRate": 0.6,
      "weakEdges": 2,
      "strongEdges": 17,
      "hopDepthUseful": 1,
      "queryCoverage": 0.59,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 71.93,
      "retrievalScore": 62.67,
      "overall": 75.71,
      "entitiesKept": 92,
      "edgesKept": 17,
      "duplicatesRemoved": 113,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 31.85,
      "retrievalScore": 54.45,
      "overall": 70.43,
      "entitiesKept": 188,
      "edgesKept": 19,
      "duplicatesRemoved": 0,
      "noiseEdges": 2,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-025",
    "input": {
      "docs": 8,
      "rawMentions": 195,
      "uniqueEntities": 79,
      "duplicateRate": 0.7,
      "weakEdges": 4,
      "strongEdges": 20,
      "hopDepthUseful": 2,
      "queryCoverage": 0.67,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 68.18,
      "retrievalScore": 72.75,
      "overall": 77.73,
      "entitiesKept": 79,
      "edgesKept": 20,
      "duplicatesRemoved": 137,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 31.6,
      "retrievalScore": 57.85,
      "overall": 71.57,
      "entitiesKept": 195,
      "edgesKept": 24,
      "duplicatesRemoved": 0,
      "noiseEdges": 4,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-026",
    "input": {
      "docs": 11,
      "rawMentions": 202,
      "uniqueEntities": 65,
      "duplicateRate": 0.8,
      "weakEdges": 6,
      "strongEdges": 23,
      "hopDepthUseful": 3,
      "queryCoverage": 0.75,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 64.46,
      "retrievalScore": 83.15,
      "overall": 79.89,
      "entitiesKept": 65,
      "edgesKept": 23,
      "duplicatesRemoved": 162,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 31.35,
      "retrievalScore": 64.25,
      "overall": 73.76,
      "entitiesKept": 202,
      "edgesKept": 29,
      "duplicatesRemoved": 0,
      "noiseEdges": 6,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-027",
    "input": {
      "docs": 14,
      "rawMentions": 209,
      "uniqueEntities": 209,
      "duplicateRate": 0,
      "weakEdges": 8,
      "strongEdges": 26,
      "hopDepthUseful": 4,
      "queryCoverage": 0.83,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 100,
      "retrievalScore": 93.72,
      "overall": 97.8,
      "entitiesKept": 209,
      "edgesKept": 26,
      "duplicatesRemoved": 0,
      "noiseEdges": 0,
      "hopTrailLength": 4
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 40.1,
      "retrievalScore": 67.65,
      "overall": 76.7,
      "entitiesKept": 209,
      "edgesKept": 34,
      "duplicatesRemoved": 0,
      "noiseEdges": 8,
      "hopTrailLength": 2
    }
  },
  {
    "id": "std-028",
    "input": {
      "docs": 17,
      "rawMentions": 216,
      "uniqueEntities": 198,
      "duplicateRate": 0.1,
      "weakEdges": 10,
      "strongEdges": 29,
      "hopDepthUseful": 1,
      "queryCoverage": 0.35,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 100,
      "retrievalScore": 42.4,
      "overall": 79.84,
      "entitiesKept": 198,
      "edgesKept": 29,
      "duplicatesRemoved": 22,
      "noiseEdges": 0,
      "hopTrailLength": 1
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 39.85,
      "retrievalScore": 37.25,
      "overall": 66.01,
      "entitiesKept": 216,
      "edgesKept": 39,
      "duplicatesRemoved": 0,
      "noiseEdges": 10,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-029",
    "input": {
      "docs": 20,
      "rawMentions": 223,
      "uniqueEntities": 185,
      "duplicateRate": 0.2,
      "weakEdges": 12,
      "strongEdges": 32,
      "hopDepthUseful": 2,
      "queryCoverage": 0.43,
      "profile": "compact"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 97.84,
      "retrievalScore": 53.16,
      "overall": 82.74,
      "entitiesKept": 185,
      "edgesKept": 32,
      "duplicatesRemoved": 45,
      "noiseEdges": 0,
      "hopTrailLength": 2
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 39.6,
      "retrievalScore": 40.65,
      "overall": 67.15,
      "entitiesKept": 223,
      "edgesKept": 44,
      "duplicatesRemoved": 0,
      "noiseEdges": 12,
      "hopTrailLength": 1
    }
  },
  {
    "id": "std-030",
    "input": {
      "docs": 23,
      "rawMentions": 230,
      "uniqueEntities": 171,
      "duplicateRate": 0.3,
      "weakEdges": 14,
      "strongEdges": 5,
      "hopDepthUseful": 3,
      "queryCoverage": 0.51,
      "profile": "heavy"
    },
    "expectedMultiStep": {
      "mode": "multi_step",
      "extractScore": 100,
      "consolidateScore": 82.02,
      "retrievalScore": 57.2,
      "overall": 77.83,
      "entitiesKept": 171,
      "edgesKept": 5,
      "duplicatesRemoved": 69,
      "noiseEdges": 0,
      "hopTrailLength": 3
    },
    "expectedSingleShot": {
      "mode": "single_shot",
      "extractScore": 100,
      "consolidateScore": 34.85,
      "retrievalScore": 47.05,
      "overall": 68.44,
      "entitiesKept": 230,
      "edgesKept": 19,
      "duplicatesRemoved": 0,
      "noiseEdges": 14,
      "hopTrailLength": 2
    }
  }
] as Golden[];
