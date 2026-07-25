import type { DialogueInput, DialogueQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DialogueInput;
  expectedProductiveOpen: DialogueQuality;
  expectedEngagementMax: DialogueQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dd-001",
    "input": {
      "openMindedness": 0.29,
      "badgeClarity": 0.25,
      "topicBalance": 0.28,
      "packReadiness": 0.34,
      "engagementPull": 0.39,
      "feedNoise": 0.59,
      "outrageTunnel": 0.45,
      "overclaimRisk": 0.5,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 22.56,
      "badgeScore": 30.25,
      "topicScore": 22.93,
      "readinessScore": 37.64,
      "engagementScore": 16.4,
      "confidence": 17.95,
      "productiveContribution": 27.98,
      "engagementContribution": 15.96,
      "overall": 29.82
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 5.76,
      "badgeScore": 17.41,
      "topicScore": 12.83,
      "readinessScore": 32.39,
      "engagementScore": 40.93,
      "confidence": 17.1,
      "productiveContribution": 21.86,
      "engagementContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "dd-002",
    "input": {
      "openMindedness": 0.33,
      "badgeClarity": 0.29,
      "topicBalance": 0.32,
      "packReadiness": 0.38,
      "engagementPull": 0.43,
      "feedNoise": 0.6,
      "outrageTunnel": 0.46,
      "overclaimRisk": 0.51,
      "dialogueBias": "topic_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 28.57,
      "badgeScore": 33.9,
      "topicScore": 17.2,
      "readinessScore": 48.93,
      "engagementScore": 18.89,
      "confidence": 21.2,
      "productiveContribution": 31.25,
      "engagementContribution": 18.61,
      "overall": 32.97
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 2.43,
      "badgeScore": 18.54,
      "topicScore": 13.86,
      "readinessScore": 34.08,
      "engagementScore": 31.53,
      "confidence": 18.65,
      "productiveContribution": 20.09,
      "engagementContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "dd-003",
    "input": {
      "openMindedness": 0.37,
      "badgeClarity": 0.27,
      "topicBalance": 0.36,
      "packReadiness": 0.42,
      "engagementPull": 0.46,
      "feedNoise": 0.6,
      "outrageTunnel": 0.42,
      "overclaimRisk": 0.46,
      "dialogueBias": "engagement_first",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 6.77,
      "badgeScore": 23.71,
      "topicScore": 19.55,
      "readinessScore": 19.24,
      "engagementScore": 19.94,
      "confidence": 23.4,
      "productiveContribution": 17.5,
      "engagementContribution": 19.69,
      "overall": 18.89
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 12.17,
      "badgeScore": 17.9,
      "topicScore": 12.83,
      "readinessScore": 33.93,
      "engagementScore": 54.34,
      "confidence": 18.4,
      "productiveContribution": 26.23,
      "engagementContribution": 46.58,
      "overall": 34.54
    }
  },
  {
    "id": "dd-004",
    "input": {
      "openMindedness": 0.33,
      "badgeClarity": 0.32,
      "topicBalance": 0.39,
      "packReadiness": 0.38,
      "engagementPull": 0.42,
      "feedNoise": 0.53,
      "outrageTunnel": 0.43,
      "overclaimRisk": 0.46,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 28.09,
      "badgeScore": 36.03,
      "topicScore": 32.93,
      "readinessScore": 42.23,
      "engagementScore": 18.93,
      "confidence": 22.55,
      "productiveContribution": 34.62,
      "engagementContribution": 19.05,
      "overall": 35.82
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 8.7,
      "badgeScore": 17.89,
      "topicScore": 13.8,
      "readinessScore": 32.79,
      "engagementScore": 42.77,
      "confidence": 18.85,
      "productiveContribution": 23.19,
      "engagementContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "dd-005",
    "input": {
      "openMindedness": 0.37,
      "badgeClarity": 0.36,
      "topicBalance": 0.35,
      "packReadiness": 0.42,
      "engagementPull": 0.46,
      "feedNoise": 0.53,
      "outrageTunnel": 0.45,
      "overclaimRisk": 0.47,
      "dialogueBias": "open_minded",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 34.83,
      "badgeScore": 39.64,
      "topicScore": 39.44,
      "readinessScore": 35.49,
      "engagementScore": 21.8,
      "confidence": 25.65,
      "productiveContribution": 37.52,
      "engagementContribution": 22.19,
      "overall": 38.76
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 0,
      "badgeScore": 19.59,
      "topicScore": 15.41,
      "readinessScore": 34.77,
      "engagementScore": 32.95,
      "confidence": 21.05,
      "productiveContribution": 20.54,
      "engagementContribution": 36.31,
      "overall": 25.78
    }
  },
  {
    "id": "dd-006",
    "input": {
      "openMindedness": 0.41,
      "badgeClarity": 0.34,
      "topicBalance": 0.39,
      "packReadiness": 0.45,
      "engagementPull": 0.5,
      "feedNoise": 0.54,
      "outrageTunnel": 0.4,
      "overclaimRisk": 0.42,
      "dialogueBias": "balanced",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 33.94,
      "badgeScore": 39.5,
      "topicScore": 34.86,
      "readinessScore": 47.85,
      "engagementScore": 23.08,
      "confidence": 27.75,
      "productiveContribution": 38.7,
      "engagementContribution": 23.38,
      "overall": 39.94
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 11.98,
      "badgeScore": 18.6,
      "topicScore": 14.01,
      "readinessScore": 34.78,
      "engagementScore": 46.72,
      "confidence": 20.5,
      "productiveContribution": 25.22,
      "engagementContribution": 43.18,
      "overall": 32.39
    }
  },
  {
    "id": "dd-007",
    "input": {
      "openMindedness": 0.45,
      "badgeClarity": 0.38,
      "topicBalance": 0.42,
      "packReadiness": 0.49,
      "engagementPull": 0.53,
      "feedNoise": 0.55,
      "outrageTunnel": 0.42,
      "overclaimRisk": 0.43,
      "dialogueBias": "topic_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 41.2,
      "badgeScore": 43.11,
      "topicScore": 25.56,
      "readinessScore": 61.29,
      "engagementScore": 25.15,
      "confidence": 30.85,
      "productiveContribution": 41.74,
      "engagementContribution": 25.64,
      "overall": 42.84
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 8.27,
      "badgeScore": 19.9,
      "topicScore": 15.24,
      "readinessScore": 36.3,
      "engagementScore": 34.2,
      "confidence": 22.15,
      "productiveContribution": 22.78,
      "engagementContribution": 37.5,
      "overall": 27.28
    }
  },
  {
    "id": "dd-008",
    "input": {
      "openMindedness": 0.41,
      "badgeClarity": 0.43,
      "topicBalance": 0.46,
      "packReadiness": 0.45,
      "engagementPull": 0.49,
      "feedNoise": 0.47,
      "outrageTunnel": 0.43,
      "overclaimRisk": 0.44,
      "dialogueBias": "engagement_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 11.91,
      "badgeScore": 35.43,
      "topicScore": 27.9,
      "readinessScore": 24.76,
      "engagementScore": 24.32,
      "confidence": 30,
      "productiveContribution": 25.33,
      "engagementContribution": 25.23,
      "overall": 26.31
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 16.4,
      "badgeScore": 20.02,
      "topicScore": 16.36,
      "readinessScore": 35.17,
      "engagementScore": 58.5,
      "confidence": 22.7,
      "productiveContribution": 29.29,
      "engagementContribution": 50.95,
      "overall": 39.78
    }
  },
  {
    "id": "dd-009",
    "input": {
      "openMindedness": 0.46,
      "badgeClarity": 0.41,
      "topicBalance": 0.5,
      "packReadiness": 0.49,
      "engagementPull": 0.53,
      "feedNoise": 0.48,
      "outrageTunnel": 0.39,
      "overclaimRisk": 0.38,
      "dialogueBias": "balanced",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 40.05,
      "badgeScore": 45.49,
      "topicScore": 44.98,
      "readinessScore": 52.59,
      "engagementScore": 25.81,
      "confidence": 32.5,
      "productiveContribution": 45.6,
      "engagementContribution": 26.69,
      "overall": 46.2
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 14.91,
      "badgeScore": 19.47,
      "topicScore": 15.34,
      "readinessScore": 35.36,
      "engagementScore": 48.88,
      "confidence": 22.7,
      "productiveContribution": 26.79,
      "engagementContribution": 45.27,
      "overall": 35.08
    }
  },
  {
    "id": "dd-010",
    "input": {
      "openMindedness": 0.5,
      "badgeClarity": 0.45,
      "topicBalance": 0.46,
      "packReadiness": 0.53,
      "engagementPull": 0.57,
      "feedNoise": 0.49,
      "outrageTunnel": 0.4,
      "overclaimRisk": 0.39,
      "dialogueBias": "open_minded",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 48,
      "badgeScore": 49.14,
      "topicScore": 53.86,
      "readinessScore": 43.07,
      "engagementScore": 28.29,
      "confidence": 35.75,
      "productiveContribution": 48.85,
      "engagementContribution": 29.32,
      "overall": 49.33
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 3.59,
      "badgeScore": 20.58,
      "topicScore": 16.35,
      "readinessScore": 37.06,
      "engagementScore": 35.54,
      "confidence": 24.25,
      "productiveContribution": 22.62,
      "engagementContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "dd-011",
    "input": {
      "openMindedness": 0.54,
      "badgeClarity": 0.49,
      "topicBalance": 0.49,
      "packReadiness": 0.57,
      "engagementPull": 0.6,
      "feedNoise": 0.49,
      "outrageTunnel": 0.42,
      "overclaimRisk": 0.4,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 47.21,
      "badgeScore": 52.75,
      "topicScore": 46.49,
      "readinessScore": 60.27,
      "engagementScore": 30.54,
      "confidence": 38.85,
      "productiveContribution": 51.32,
      "engagementContribution": 31.82,
      "overall": 51.81
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 17.1,
      "badgeScore": 22.02,
      "topicScore": 17.74,
      "readinessScore": 38.58,
      "engagementScore": 54.12,
      "confidence": 26.1,
      "productiveContribution": 29.91,
      "engagementContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "dd-012",
    "input": {
      "openMindedness": 0.5,
      "badgeClarity": 0.48,
      "topicBalance": 0.53,
      "packReadiness": 0.53,
      "engagementPull": 0.56,
      "feedNoise": 0.42,
      "outrageTunnel": 0.37,
      "overclaimRisk": 0.35,
      "dialogueBias": "topic_first",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 50.05,
      "badgeScore": 51.28,
      "topicScore": 34.12,
      "readinessScore": 67.57,
      "engagementScore": 28.34,
      "confidence": 37.1,
      "productiveContribution": 49.76,
      "engagementContribution": 29.7,
      "overall": 50.15
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 13.23,
      "badgeScore": 19.84,
      "topicScore": 16.17,
      "readinessScore": 35.76,
      "engagementScore": 34.93,
      "confidence": 24.35,
      "productiveContribution": 23.99,
      "engagementContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "dd-013",
    "input": {
      "openMindedness": 0.54,
      "badgeClarity": 0.52,
      "topicBalance": 0.56,
      "packReadiness": 0.57,
      "engagementPull": 0.6,
      "feedNoise": 0.42,
      "outrageTunnel": 0.39,
      "overclaimRisk": 0.36,
      "dialogueBias": "engagement_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 19.05,
      "badgeScore": 44.88,
      "topicScore": 36.31,
      "readinessScore": 32.66,
      "engagementScore": 31.2,
      "confidence": 40.2,
      "productiveContribution": 33.59,
      "engagementContribution": 32.8,
      "overall": 34.45
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 22.62,
      "badgeScore": 21.51,
      "topicScore": 17.75,
      "readinessScore": 37.74,
      "engagementScore": 67.02,
      "confidence": 26.55,
      "productiveContribution": 33.33,
      "engagementContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "dd-014",
    "input": {
      "openMindedness": 0.58,
      "badgeClarity": 0.56,
      "topicBalance": 0.6,
      "packReadiness": 0.61,
      "engagementPull": 0.63,
      "feedNoise": 0.43,
      "outrageTunnel": 0.4,
      "overclaimRisk": 0.36,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 52.62,
      "badgeScore": 58.53,
      "topicScore": 56.38,
      "readinessScore": 64.86,
      "engagementScore": 33.07,
      "confidence": 43.45,
      "productiveContribution": 57.9,
      "engagementContribution": 34.8,
      "overall": 57.74
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 20.03,
      "badgeScore": 22.36,
      "topicScore": 18.54,
      "readinessScore": 38.98,
      "engagementScore": 55.96,
      "confidence": 27.85,
      "productiveContribution": 31.17,
      "engagementContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "dd-015",
    "input": {
      "openMindedness": 0.62,
      "badgeClarity": 0.54,
      "topicBalance": 0.56,
      "packReadiness": 0.65,
      "engagementPull": 0.67,
      "feedNoise": 0.44,
      "outrageTunnel": 0.36,
      "overclaimRisk": 0.31,
      "dialogueBias": "open_minded",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 60.5,
      "badgeScore": 58.35,
      "topicScore": 67.29,
      "readinessScore": 50.82,
      "engagementScore": 34.55,
      "confidence": 45.65,
      "productiveContribution": 59.71,
      "engagementContribution": 36.22,
      "overall": 59.48
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 9.43,
      "badgeScore": 21.78,
      "topicScore": 17.48,
      "readinessScore": 39.27,
      "engagementScore": 38.2,
      "confidence": 27.75,
      "productiveContribution": 25.23,
      "engagementContribution": 41.9,
      "overall": 32.85
    }
  },
  {
    "id": "dd-016",
    "input": {
      "openMindedness": 0.58,
      "badgeClarity": 0.59,
      "topicBalance": 0.6,
      "packReadiness": 0.6,
      "engagementPull": 0.63,
      "feedNoise": 0.36,
      "outrageTunnel": 0.37,
      "overclaimRisk": 0.32,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 54.46,
      "badgeScore": 60.67,
      "topicScore": 58.01,
      "readinessScore": 65.05,
      "engagementScore": 33.73,
      "confidence": 44.55,
      "productiveContribution": 59.4,
      "engagementContribution": 35.76,
      "overall": 59.14
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 22.05,
      "badgeScore": 21.83,
      "topicScore": 18.56,
      "readinessScore": 38.14,
      "engagementScore": 55.7,
      "confidence": 28.3,
      "productiveContribution": 31.26,
      "engagementContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "dd-017",
    "input": {
      "openMindedness": 0.62,
      "badgeClarity": 0.63,
      "topicBalance": 0.63,
      "packReadiness": 0.64,
      "engagementPull": 0.67,
      "feedNoise": 0.37,
      "outrageTunnel": 0.39,
      "overclaimRisk": 0.33,
      "dialogueBias": "topic_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 64.02,
      "badgeScore": 64.28,
      "topicScore": 42.54,
      "readinessScore": 81.43,
      "engagementScore": 36.41,
      "confidence": 47.65,
      "productiveContribution": 61.9,
      "engagementContribution": 38.61,
      "overall": 61.71
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 18.73,
      "badgeScore": 23.34,
      "topicScore": 19.95,
      "readinessScore": 40.11,
      "engagementScore": 39.86,
      "confidence": 30.3,
      "productiveContribution": 28.4,
      "engagementContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "dd-018",
    "input": {
      "openMindedness": 0.66,
      "badgeClarity": 0.61,
      "topicBalance": 0.67,
      "packReadiness": 0.68,
      "engagementPull": 0.7,
      "feedNoise": 0.38,
      "outrageTunnel": 0.34,
      "overclaimRisk": 0.27,
      "dialogueBias": "engagement_first",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 25.78,
      "badgeScore": 54.13,
      "topicScore": 44.82,
      "readinessScore": 40.09,
      "engagementScore": 37.08,
      "confidence": 50,
      "productiveContribution": 41.63,
      "engagementContribution": 39.16,
      "overall": 42.19
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 28.36,
      "badgeScore": 22.06,
      "topicScore": 18.26,
      "readinessScore": 39.67,
      "engagementScore": 74.27,
      "confidence": 29.5,
      "productiveContribution": 36.52,
      "engagementContribution": 62.25,
      "overall": 51.93
    }
  },
  {
    "id": "dd-019",
    "input": {
      "openMindedness": 0.7,
      "badgeClarity": 0.65,
      "topicBalance": 0.7,
      "packReadiness": 0.72,
      "engagementPull": 0.74,
      "feedNoise": 0.38,
      "outrageTunnel": 0.36,
      "overclaimRisk": 0.28,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 63.81,
      "badgeScore": 67.74,
      "topicScore": 67.47,
      "readinessScore": 75.07,
      "engagementScore": 39.94,
      "confidence": 53.1,
      "productiveContribution": 68.33,
      "engagementContribution": 42.25,
      "overall": 67.64
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 26.25,
      "badgeScore": 23.72,
      "topicScore": 19.82,
      "readinessScore": 41.65,
      "engagementScore": 62.07,
      "confidence": 31.7,
      "productiveContribution": 34.7,
      "engagementContribution": 57,
      "overall": 47.37
    }
  },
  {
    "id": "dd-020",
    "input": {
      "openMindedness": 0.66,
      "badgeClarity": 0.7,
      "topicBalance": 0.66,
      "packReadiness": 0.68,
      "engagementPull": 0.7,
      "feedNoise": 0.31,
      "outrageTunnel": 0.37,
      "overclaimRisk": 0.29,
      "dialogueBias": "open_minded",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 69.98,
      "badgeScore": 70.06,
      "topicScore": 80.6,
      "readinessScore": 56.34,
      "engagementScore": 38.94,
      "confidence": 52.25,
      "productiveContribution": 69.97,
      "engagementContribution": 41.54,
      "overall": 68.85
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 13.66,
      "badgeScore": 23.61,
      "topicScore": 20.65,
      "readinessScore": 40.51,
      "engagementScore": 40.86,
      "confidence": 32.05,
      "productiveContribution": 27.86,
      "engagementContribution": 45.29,
      "overall": 37.24
    }
  },
  {
    "id": "dd-021",
    "input": {
      "openMindedness": 0.7,
      "badgeClarity": 0.68,
      "topicBalance": 0.7,
      "packReadiness": 0.72,
      "engagementPull": 0.73,
      "feedNoise": 0.31,
      "outrageTunnel": 0.33,
      "overclaimRisk": 0.24,
      "dialogueBias": "balanced",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 65.6,
      "badgeScore": 69.88,
      "topicScore": 69.04,
      "readinessScore": 75.82,
      "engagementScore": 39.99,
      "confidence": 54.45,
      "productiveContribution": 69.92,
      "engagementContribution": 42.54,
      "overall": 68.99
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 27.89,
      "badgeScore": 22.88,
      "topicScore": 19.52,
      "readinessScore": 40.35,
      "engagementScore": 61.19,
      "confidence": 31.8,
      "productiveContribution": 34.37,
      "engagementContribution": 55.92,
      "overall": 47.26
    }
  },
  {
    "id": "dd-022",
    "input": {
      "openMindedness": 0.74,
      "badgeClarity": 0.72,
      "topicBalance": 0.73,
      "packReadiness": 0.76,
      "engagementPull": 0.77,
      "feedNoise": 0.32,
      "outrageTunnel": 0.34,
      "overclaimRisk": 0.25,
      "dialogueBias": "topic_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 76.39,
      "badgeScore": 73.52,
      "topicScore": 50.64,
      "readinessScore": 94.56,
      "engagementScore": 42.47,
      "confidence": 57.7,
      "productiveContribution": 72.43,
      "engagementContribution": 45.15,
      "overall": 71.52
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 24.57,
      "badgeScore": 23.95,
      "topicScore": 20.48,
      "readinessScore": 42.05,
      "engagementScore": 42.21,
      "confidence": 33.35,
      "productiveContribution": 30.65,
      "engagementContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "dd-023",
    "input": {
      "openMindedness": 0.79,
      "badgeClarity": 0.76,
      "topicBalance": 0.77,
      "packReadiness": 0.8,
      "engagementPull": 0.81,
      "feedNoise": 0.33,
      "outrageTunnel": 0.36,
      "overclaimRisk": 0.25,
      "dialogueBias": "engagement_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 33.46,
      "badgeScore": 67.38,
      "topicScore": 53.32,
      "readinessScore": 49.49,
      "engagementScore": 45.16,
      "confidence": 61.1,
      "productiveContribution": 51.37,
      "engagementContribution": 48.03,
      "overall": 51.77
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 33.86,
      "badgeScore": 25.49,
      "topicScore": 21.9,
      "readinessScore": 43.92,
      "engagementScore": 84.72,
      "confidence": 35.45,
      "productiveContribution": 41.98,
      "engagementContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "dd-024",
    "input": {
      "openMindedness": 0.75,
      "badgeClarity": 0.75,
      "topicBalance": 0.81,
      "packReadiness": 0.76,
      "engagementPull": 0.77,
      "feedNoise": 0.25,
      "outrageTunnel": 0.31,
      "overclaimRisk": 0.2,
      "dialogueBias": "balanced",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 71.55,
      "badgeScore": 75.91,
      "topicScore": 78.99,
      "readinessScore": 80.56,
      "engagementScore": 43.13,
      "confidence": 59.35,
      "productiveContribution": 76.75,
      "engagementContribution": 46.07,
      "overall": 75.23
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 31.21,
      "badgeScore": 23.36,
      "topicScore": 20.38,
      "readinessScore": 41.11,
      "engagementScore": 63.65,
      "confidence": 33.9,
      "productiveContribution": 35.94,
      "engagementContribution": 57.96,
      "overall": 49.92
    }
  },
  {
    "id": "dd-025",
    "input": {
      "openMindedness": 0.79,
      "badgeClarity": 0.79,
      "topicBalance": 0.77,
      "packReadiness": 0.8,
      "engagementPull": 0.8,
      "feedNoise": 0.26,
      "outrageTunnel": 0.33,
      "overclaimRisk": 0.21,
      "dialogueBias": "open_minded",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 83,
      "badgeScore": 79.52,
      "topicScore": 94.88,
      "readinessScore": 64.24,
      "engagementScore": 45.2,
      "confidence": 62.45,
      "productiveContribution": 81.29,
      "engagementContribution": 48.27,
      "overall": 79.35
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 19.5,
      "badgeScore": 24.6,
      "topicScore": 21.54,
      "readinessScore": 42.63,
      "engagementScore": 43.52,
      "confidence": 35.55,
      "productiveContribution": 30.36,
      "engagementContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "dd-026",
    "input": {
      "openMindedness": 0.83,
      "badgeClarity": 0.83,
      "topicBalance": 0.8,
      "packReadiness": 0.83,
      "engagementPull": 0.84,
      "feedNoise": 0.27,
      "outrageTunnel": 0.34,
      "overclaimRisk": 0.22,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 78.52,
      "badgeScore": 83.17,
      "topicScore": 80.3,
      "readinessScore": 87.68,
      "engagementScore": 47.68,
      "confidence": 65.45,
      "productiveContribution": 82.24,
      "engagementContribution": 50.87,
      "overall": 80.59
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 33.17,
      "badgeScore": 25.67,
      "topicScore": 22.55,
      "readinessScore": 44.32,
      "engagementScore": 68.8,
      "confidence": 37.1,
      "productiveContribution": 38.9,
      "engagementContribution": 63.04,
      "overall": 54.25
    }
  },
  {
    "id": "dd-027",
    "input": {
      "openMindedness": 0.87,
      "badgeClarity": 0.81,
      "topicBalance": 0.84,
      "packReadiness": 0.87,
      "engagementPull": 0.88,
      "feedNoise": 0.27,
      "outrageTunnel": 0.3,
      "overclaimRisk": 0.17,
      "dialogueBias": "topic_first",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 89.4,
      "badgeScore": 82.98,
      "topicScore": 59.19,
      "readinessScore": 100,
      "engagementScore": 49.35,
      "confidence": 67.65,
      "productiveContribution": 81.6,
      "engagementContribution": 52.5,
      "overall": 80.36
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 30.78,
      "badgeScore": 25.18,
      "topicScore": 21.6,
      "readinessScore": 44.62,
      "engagementScore": 45.22,
      "confidence": 37.2,
      "productiveContribution": 33.48,
      "engagementContribution": 49.71,
      "overall": 42.96
    }
  },
  {
    "id": "dd-028",
    "input": {
      "openMindedness": 0.83,
      "badgeClarity": 0.86,
      "topicBalance": 0.87,
      "packReadiness": 0.83,
      "engagementPull": 0.84,
      "feedNoise": 0.2,
      "outrageTunnel": 0.31,
      "overclaimRisk": 0.17,
      "dialogueBias": "engagement_first",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 37.76,
      "badgeScore": 75.3,
      "topicScore": 61.04,
      "readinessScore": 53.51,
      "engagementScore": 48.34,
      "confidence": 66.8,
      "productiveContribution": 57.5,
      "engagementContribution": 51.73,
      "overall": 57.46
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 38.81,
      "badgeScore": 25.01,
      "topicScore": 22.37,
      "readinessScore": 43.48,
      "engagementScore": 86.95,
      "confidence": 37.65,
      "productiveContribution": 43.32,
      "engagementContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "dd-029",
    "input": {
      "openMindedness": 0.87,
      "badgeClarity": 0.9,
      "topicBalance": 0.91,
      "packReadiness": 0.87,
      "engagementPull": 0.87,
      "feedNoise": 0.2,
      "outrageTunnel": 0.33,
      "overclaimRisk": 0.18,
      "dialogueBias": "balanced",
      "profile": "productive_open_minded_design"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 83.89,
      "badgeScore": 88.91,
      "topicScore": 90.14,
      "readinessScore": 92.27,
      "engagementScore": 50.59,
      "confidence": 69.9,
      "productiveContribution": 88.79,
      "engagementContribution": 54.16,
      "overall": 86.56
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 36.33,
      "badgeScore": 26.36,
      "topicScore": 23.66,
      "readinessScore": 45,
      "engagementScore": 71.06,
      "confidence": 39.5,
      "productiveContribution": 40.48,
      "engagementContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "dd-030",
    "input": {
      "openMindedness": 0.91,
      "badgeClarity": 0.88,
      "topicBalance": 0.87,
      "packReadiness": 0.91,
      "engagementPull": 0.91,
      "feedNoise": 0.21,
      "outrageTunnel": 0.28,
      "overclaimRisk": 0.13,
      "dialogueBias": "open_minded",
      "profile": "engagement_maximizing_baseline"
    },
    "expectedProductiveOpen": {
      "mode": "productive_open_minded_design",
      "dialogueScore": 95.24,
      "badgeScore": 88.77,
      "topicScore": 100,
      "readinessScore": 71.68,
      "engagementScore": 51.88,
      "confidence": 72.25,
      "productiveContribution": 89.71,
      "engagementContribution": 55.31,
      "overall": 87.52
    },
    "expectedEngagementMax": {
      "mode": "engagement_maximizing_baseline",
      "dialogueScore": 25.72,
      "badgeScore": 25.3,
      "topicScore": 22.14,
      "readinessScore": 45.02,
      "engagementScore": 46.21,
      "confidence": 38.95,
      "productiveContribution": 32.88,
      "engagementContribution": 50.68,
      "overall": 44.3
    }
  }
];
