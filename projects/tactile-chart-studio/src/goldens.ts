import type { TactileInput, TactileQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TactileInput;
  expectedTactile: TactileQuality;
  expectedVisual: TactileQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "tcs-001",
    "input": {
      "chartClarity": 0.19,
      "layerDepth": 0.17,
      "grammarCoverage": 0.15,
      "verifyDiscipline": 0.18,
      "selectConfirmRate": 0.17,
      "askFidelity": 0.1,
      "tactileResolution": 0.2,
      "conversationTurns": 5,
      "multimodalSync": 0.17,
      "feedbackSpeed": 0.13,
      "a11yReview": 0.13,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 11.13,
      "layerCoverage": 16.8,
      "grammarFidelity": 8.39,
      "verifyScore": 15.22,
      "conversationQuality": 10.44,
      "auditTrail": 16.64,
      "overall": 13.08
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 37.08,
      "layerCoverage": 0,
      "grammarFidelity": 41.43,
      "verifyScore": 0,
      "conversationQuality": 26.8,
      "auditTrail": 12.91,
      "overall": 23.61
    }
  },
  {
    "id": "tcs-002",
    "input": {
      "chartClarity": 0.22,
      "layerDepth": 0.21,
      "grammarCoverage": 0.19,
      "verifyDiscipline": 0.22,
      "selectConfirmRate": 0.21,
      "askFidelity": 0.15,
      "tactileResolution": 0.24,
      "conversationTurns": 6,
      "multimodalSync": 0.21,
      "feedbackSpeed": 0.17,
      "a11yReview": 0.16,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 14.63,
      "layerCoverage": 20.52,
      "grammarFidelity": 12.46,
      "verifyScore": 18.98,
      "conversationQuality": 14.32,
      "auditTrail": 19.8,
      "overall": 16.8
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 38.6,
      "layerCoverage": 0,
      "grammarFidelity": 42.75,
      "verifyScore": 0,
      "conversationQuality": 28.12,
      "auditTrail": 13.77,
      "overall": 24.59
    }
  },
  {
    "id": "tcs-003",
    "input": {
      "chartClarity": 0.26,
      "layerDepth": 0.26,
      "grammarCoverage": 0.18,
      "verifyDiscipline": 0.25,
      "selectConfirmRate": 0.25,
      "askFidelity": 0.19,
      "tactileResolution": 0.23,
      "conversationTurns": 7,
      "multimodalSync": 0.25,
      "feedbackSpeed": 0.21,
      "a11yReview": 0.2,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 19.38,
      "layerCoverage": 24.42,
      "grammarFidelity": 14.82,
      "verifyScore": 23.37,
      "conversationQuality": 19.75,
      "auditTrail": 25.04,
      "overall": 21.08
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 42.2,
      "layerCoverage": 0,
      "grammarFidelity": 46.07,
      "verifyScore": 0,
      "conversationQuality": 29.82,
      "auditTrail": 16.73,
      "overall": 26.8
    }
  },
  {
    "id": "tcs-004",
    "input": {
      "chartClarity": 0.3,
      "layerDepth": 0.22,
      "grammarCoverage": 0.22,
      "verifyDiscipline": 0.29,
      "selectConfirmRate": 0.23,
      "askFidelity": 0.24,
      "tactileResolution": 0.27,
      "conversationTurns": 8,
      "multimodalSync": 0.23,
      "feedbackSpeed": 0.25,
      "a11yReview": 0.24,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 18.9,
      "layerCoverage": 22.54,
      "grammarFidelity": 18.04,
      "verifyScore": 24.21,
      "conversationQuality": 19.64,
      "auditTrail": 24.56,
      "overall": 21.24
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 41.78,
      "layerCoverage": 0,
      "grammarFidelity": 44.27,
      "verifyScore": 0,
      "conversationQuality": 30.06,
      "auditTrail": 14.97,
      "overall": 26.15
    }
  },
  {
    "id": "tcs-005",
    "input": {
      "chartClarity": 0.27,
      "layerDepth": 0.26,
      "grammarCoverage": 0.27,
      "verifyDiscipline": 0.33,
      "selectConfirmRate": 0.27,
      "askFidelity": 0.18,
      "tactileResolution": 0.31,
      "conversationTurns": 9,
      "multimodalSync": 0.27,
      "feedbackSpeed": 0.28,
      "a11yReview": 0.21,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 20.19,
      "layerCoverage": 26.26,
      "grammarFidelity": 20.27,
      "verifyScore": 26.36,
      "conversationQuality": 20.71,
      "auditTrail": 26.7,
      "overall": 23.39
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 40.44,
      "layerCoverage": 0,
      "grammarFidelity": 45.68,
      "verifyScore": 0.72,
      "conversationQuality": 29.86,
      "auditTrail": 15.23,
      "overall": 26.22
    }
  },
  {
    "id": "tcs-006",
    "input": {
      "chartClarity": 0.31,
      "layerDepth": 0.31,
      "grammarCoverage": 0.25,
      "verifyDiscipline": 0.28,
      "selectConfirmRate": 0.31,
      "askFidelity": 0.23,
      "tactileResolution": 0.3,
      "conversationTurns": 10,
      "multimodalSync": 0.31,
      "feedbackSpeed": 0.32,
      "a11yReview": 0.25,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 25.09,
      "layerCoverage": 30.45,
      "grammarFidelity": 22.65,
      "verifyScore": 27.55,
      "conversationQuality": 25.68,
      "auditTrail": 30,
      "overall": 26.85
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 44.02,
      "layerCoverage": 0,
      "grammarFidelity": 48.69,
      "verifyScore": 0.56,
      "conversationQuality": 31.34,
      "auditTrail": 17.95,
      "overall": 28.27
    }
  },
  {
    "id": "tcs-007",
    "input": {
      "chartClarity": 0.34,
      "layerDepth": 0.35,
      "grammarCoverage": 0.3,
      "verifyDiscipline": 0.32,
      "selectConfirmRate": 0.35,
      "askFidelity": 0.28,
      "tactileResolution": 0.34,
      "conversationTurns": 11,
      "multimodalSync": 0.35,
      "feedbackSpeed": 0.26,
      "a11yReview": 0.28,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 27.3,
      "layerCoverage": 32.72,
      "grammarFidelity": 23.16,
      "verifyScore": 30,
      "conversationQuality": 26.06,
      "auditTrail": 30.34,
      "overall": 28.37
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 43.54,
      "layerCoverage": 0,
      "grammarFidelity": 46.21,
      "verifyScore": 1.48,
      "conversationQuality": 31.68,
      "auditTrail": 16.81,
      "overall": 27.69
    }
  },
  {
    "id": "tcs-008",
    "input": {
      "chartClarity": 0.38,
      "layerDepth": 0.31,
      "grammarCoverage": 0.34,
      "verifyDiscipline": 0.36,
      "selectConfirmRate": 0.33,
      "askFidelity": 0.32,
      "tactileResolution": 0.38,
      "conversationTurns": 12,
      "multimodalSync": 0.33,
      "feedbackSpeed": 0.29,
      "a11yReview": 0.32,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 27.96,
      "layerCoverage": 32,
      "grammarFidelity": 26.84,
      "verifyScore": 31.83,
      "conversationQuality": 28.34,
      "auditTrail": 32.86,
      "overall": 29.91
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 44.98,
      "layerCoverage": 0,
      "grammarFidelity": 47.3,
      "verifyScore": 1.67,
      "conversationQuality": 32.52,
      "auditTrail": 17.05,
      "overall": 28.45
    }
  },
  {
    "id": "tcs-009",
    "input": {
      "chartClarity": 0.42,
      "layerDepth": 0.36,
      "grammarCoverage": 0.33,
      "verifyDiscipline": 0.4,
      "selectConfirmRate": 0.37,
      "askFidelity": 0.37,
      "tactileResolution": 0.37,
      "conversationTurns": 13,
      "multimodalSync": 0.37,
      "feedbackSpeed": 0.33,
      "a11yReview": 0.36,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 33.34,
      "layerCoverage": 36.48,
      "grammarFidelity": 30.04,
      "verifyScore": 37.45,
      "conversationQuality": 34.56,
      "auditTrail": 38.32,
      "overall": 34.96
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 48.74,
      "layerCoverage": 0.44,
      "grammarFidelity": 50.64,
      "verifyScore": 2.64,
      "conversationQuality": 34.44,
      "auditTrail": 20.04,
      "overall": 30.91
    }
  },
  {
    "id": "tcs-010",
    "input": {
      "chartClarity": 0.39,
      "layerDepth": 0.4,
      "grammarCoverage": 0.37,
      "verifyDiscipline": 0.43,
      "selectConfirmRate": 0.4,
      "askFidelity": 0.31,
      "tactileResolution": 0.41,
      "conversationTurns": 14,
      "multimodalSync": 0.4,
      "feedbackSpeed": 0.37,
      "a11yReview": 0.33,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 32.61,
      "layerCoverage": 38.28,
      "grammarFidelity": 30.47,
      "verifyScore": 37.07,
      "conversationQuality": 32.21,
      "auditTrail": 36.92,
      "overall": 34.66
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 45.38,
      "layerCoverage": 1.62,
      "grammarFidelity": 48.95,
      "verifyScore": 3.37,
      "conversationQuality": 33.5,
      "auditTrail": 18.19,
      "overall": 29.62
    }
  },
  {
    "id": "tcs-011",
    "input": {
      "chartClarity": 0.43,
      "layerDepth": 0.44,
      "grammarCoverage": 0.42,
      "verifyDiscipline": 0.47,
      "selectConfirmRate": 0.44,
      "askFidelity": 0.36,
      "tactileResolution": 0.45,
      "conversationTurns": 15,
      "multimodalSync": 0.44,
      "feedbackSpeed": 0.41,
      "a11yReview": 0.37,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 36.6,
      "layerCoverage": 42,
      "grammarFidelity": 35.09,
      "verifyScore": 40.9,
      "conversationQuality": 36.25,
      "auditTrail": 40.46,
      "overall": 38.63
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 47.12,
      "layerCoverage": 2.94,
      "grammarFidelity": 50.47,
      "verifyScore": 4.29,
      "conversationQuality": 34.98,
      "auditTrail": 19.15,
      "overall": 31.01
    }
  },
  {
    "id": "tcs-012",
    "input": {
      "chartClarity": 0.47,
      "layerDepth": 0.41,
      "grammarCoverage": 0.4,
      "verifyDiscipline": 0.42,
      "selectConfirmRate": 0.42,
      "askFidelity": 0.4,
      "tactileResolution": 0.44,
      "conversationTurns": 16,
      "multimodalSync": 0.42,
      "feedbackSpeed": 0.45,
      "a11yReview": 0.41,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 38.9,
      "layerCoverage": 42.32,
      "grammarFidelity": 38,
      "verifyScore": 40.71,
      "conversationQuality": 40.1,
      "auditTrail": 42.92,
      "overall": 40.4
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 50.4,
      "layerCoverage": 2.04,
      "grammarFidelity": 53.35,
      "verifyScore": 3.41,
      "conversationQuality": 35.94,
      "auditTrail": 21.15,
      "overall": 32.56
    }
  },
  {
    "id": "tcs-013",
    "input": {
      "chartClarity": 0.5,
      "layerDepth": 0.45,
      "grammarCoverage": 0.45,
      "verifyDiscipline": 0.46,
      "selectConfirmRate": 0.46,
      "askFidelity": 0.45,
      "tactileResolution": 0.48,
      "conversationTurns": 17,
      "multimodalSync": 0.46,
      "feedbackSpeed": 0.49,
      "a11yReview": 0.44,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 40.49,
      "layerCoverage": 44.02,
      "grammarFidelity": 40.62,
      "verifyScore": 42.54,
      "conversationQuality": 40.77,
      "auditTrail": 43.26,
      "overall": 41.95
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 49.92,
      "layerCoverage": 3.36,
      "grammarFidelity": 51.86,
      "verifyScore": 4.33,
      "conversationQuality": 36.64,
      "auditTrail": 20.01,
      "overall": 32.41
    }
  },
  {
    "id": "tcs-014",
    "input": {
      "chartClarity": 0.54,
      "layerDepth": 0.49,
      "grammarCoverage": 0.49,
      "verifyDiscipline": 0.5,
      "selectConfirmRate": 0.5,
      "askFidelity": 0.5,
      "tactileResolution": 0.52,
      "conversationTurns": 18,
      "multimodalSync": 0.5,
      "feedbackSpeed": 0.42,
      "a11yReview": 0.48,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 44.36,
      "layerCoverage": 47.74,
      "grammarFidelity": 41.66,
      "verifyScore": 46.37,
      "conversationQuality": 43.88,
      "auditTrail": 46.62,
      "overall": 45.16
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 51.66,
      "layerCoverage": 4.69,
      "grammarFidelity": 52.09,
      "verifyScore": 5.25,
      "conversationQuality": 37.78,
      "auditTrail": 20.97,
      "overall": 33.47
    }
  },
  {
    "id": "tcs-015",
    "input": {
      "chartClarity": 0.51,
      "layerDepth": 0.54,
      "grammarCoverage": 0.48,
      "verifyDiscipline": 0.54,
      "selectConfirmRate": 0.54,
      "askFidelity": 0.44,
      "tactileResolution": 0.51,
      "conversationTurns": 19,
      "multimodalSync": 0.54,
      "feedbackSpeed": 0.46,
      "a11yReview": 0.45,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 47.69,
      "layerCoverage": 53,
      "grammarFidelity": 43.37,
      "verifyScore": 50.95,
      "conversationQuality": 47.66,
      "auditTrail": 50.68,
      "overall": 49.01
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 52.34,
      "layerCoverage": 5.84,
      "grammarFidelity": 55.42,
      "verifyScore": 6.22,
      "conversationQuality": 38.22,
      "auditTrail": 23.26,
      "overall": 34.95
    }
  },
  {
    "id": "tcs-016",
    "input": {
      "chartClarity": 0.55,
      "layerDepth": 0.5,
      "grammarCoverage": 0.52,
      "verifyDiscipline": 0.57,
      "selectConfirmRate": 0.52,
      "askFidelity": 0.49,
      "tactileResolution": 0.55,
      "conversationTurns": 20,
      "multimodalSync": 0.52,
      "feedbackSpeed": 0.5,
      "a11yReview": 0.49,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 45.94,
      "layerCoverage": 49.76,
      "grammarFidelity": 45.29,
      "verifyScore": 50.03,
      "conversationQuality": 46.55,
      "auditTrail": 49.98,
      "overall": 47.92
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 51.9,
      "layerCoverage": 5.55,
      "grammarFidelity": 53.61,
      "verifyScore": 6.29,
      "conversationQuality": 38.39,
      "auditTrail": 21.47,
      "overall": 34.24
    }
  },
  {
    "id": "tcs-017",
    "input": {
      "chartClarity": 0.59,
      "layerDepth": 0.55,
      "grammarCoverage": 0.57,
      "verifyDiscipline": 0.61,
      "selectConfirmRate": 0.56,
      "askFidelity": 0.53,
      "tactileResolution": 0.6,
      "conversationTurns": 21,
      "multimodalSync": 0.56,
      "feedbackSpeed": 0.54,
      "a11yReview": 0.53,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 50.22,
      "layerCoverage": 54.18,
      "grammarFidelity": 49.75,
      "verifyScore": 53.75,
      "conversationQuality": 50.49,
      "auditTrail": 53.52,
      "overall": 52.02
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 53.52,
      "layerCoverage": 7.06,
      "grammarFidelity": 55.14,
      "verifyScore": 7.26,
      "conversationQuality": 39.78,
      "auditTrail": 22.46,
      "overall": 35.62
    }
  },
  {
    "id": "tcs-018",
    "input": {
      "chartClarity": 0.63,
      "layerDepth": 0.59,
      "grammarCoverage": 0.55,
      "verifyDiscipline": 0.56,
      "selectConfirmRate": 0.6,
      "askFidelity": 0.58,
      "tactileResolution": 0.58,
      "conversationTurns": 22,
      "multimodalSync": 0.6,
      "feedbackSpeed": 0.57,
      "a11yReview": 0.57,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 56.23,
      "layerCoverage": 59.03,
      "grammarFidelity": 53.23,
      "verifyScore": 56.3,
      "conversationQuality": 56.17,
      "auditTrail": 56.82,
      "overall": 56.37
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 57.08,
      "layerCoverage": 7.52,
      "grammarFidelity": 58.03,
      "verifyScore": 7.05,
      "conversationQuality": 41.23,
      "auditTrail": 25.15,
      "overall": 37.68
    }
  },
  {
    "id": "tcs-019",
    "input": {
      "chartClarity": 0.66,
      "layerDepth": 0.63,
      "grammarCoverage": 0.6,
      "verifyDiscipline": 0.6,
      "selectConfirmRate": 0.64,
      "askFidelity": 0.63,
      "tactileResolution": 0.62,
      "conversationTurns": 23,
      "multimodalSync": 0.64,
      "feedbackSpeed": 0.61,
      "a11yReview": 0.6,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 57.04,
      "layerCoverage": 59.94,
      "grammarFidelity": 55.16,
      "verifyScore": 57.39,
      "conversationQuality": 56.35,
      "auditTrail": 57.16,
      "overall": 57.29
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 56.6,
      "layerCoverage": 8.84,
      "grammarFidelity": 56.55,
      "verifyScore": 7.98,
      "conversationQuality": 41.94,
      "auditTrail": 24.01,
      "overall": 37.53
    }
  },
  {
    "id": "tcs-020",
    "input": {
      "chartClarity": 0.63,
      "layerDepth": 0.6,
      "grammarCoverage": 0.64,
      "verifyDiscipline": 0.64,
      "selectConfirmRate": 0.62,
      "askFidelity": 0.57,
      "tactileResolution": 0.67,
      "conversationTurns": 24,
      "multimodalSync": 0.62,
      "feedbackSpeed": 0.65,
      "a11yReview": 0.57,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 55.29,
      "layerCoverage": 59.92,
      "grammarFidelity": 57.17,
      "verifyScore": 57.66,
      "conversationQuality": 56.19,
      "auditTrail": 58.28,
      "overall": 57.43
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 55.12,
      "layerCoverage": 8.8,
      "grammarFidelity": 57.76,
      "verifyScore": 8.22,
      "conversationQuality": 41.44,
      "auditTrail": 23.58,
      "overall": 37.31
    }
  },
  {
    "id": "tcs-021",
    "input": {
      "chartClarity": 0.67,
      "layerDepth": 0.64,
      "grammarCoverage": 0.63,
      "verifyDiscipline": 0.68,
      "selectConfirmRate": 0.66,
      "askFidelity": 0.62,
      "tactileResolution": 0.65,
      "conversationTurns": 25,
      "multimodalSync": 0.66,
      "feedbackSpeed": 0.58,
      "a11yReview": 0.61,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 61.65,
      "layerCoverage": 65.06,
      "grammarFidelity": 58.59,
      "verifyScore": 64.56,
      "conversationQuality": 62.36,
      "auditTrail": 63.74,
      "overall": 62.75
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 58.86,
      "layerCoverage": 9.76,
      "grammarFidelity": 59.98,
      "verifyScore": 9.14,
      "conversationQuality": 43.08,
      "auditTrail": 26.54,
      "overall": 39.54
    }
  },
  {
    "id": "tcs-022",
    "input": {
      "chartClarity": 0.71,
      "layerDepth": 0.68,
      "grammarCoverage": 0.67,
      "verifyDiscipline": 0.71,
      "selectConfirmRate": 0.69,
      "askFidelity": 0.66,
      "tactileResolution": 0.69,
      "conversationTurns": 26,
      "multimodalSync": 0.69,
      "feedbackSpeed": 0.62,
      "a11yReview": 0.65,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 62.35,
      "layerCoverage": 65.5,
      "grammarFidelity": 59.67,
      "verifyScore": 64.46,
      "conversationQuality": 61.78,
      "auditTrail": 63.74,
      "overall": 63.02
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 58.44,
      "layerCoverage": 10.95,
      "grammarFidelity": 58.29,
      "verifyScore": 9.88,
      "conversationQuality": 43.54,
      "auditTrail": 25.39,
      "overall": 39.28
    }
  },
  {
    "id": "tcs-023",
    "input": {
      "chartClarity": 0.75,
      "layerDepth": 0.73,
      "grammarCoverage": 0.72,
      "verifyDiscipline": 0.75,
      "selectConfirmRate": 0.73,
      "askFidelity": 0.71,
      "tactileResolution": 0.74,
      "conversationTurns": 27,
      "multimodalSync": 0.73,
      "feedbackSpeed": 0.66,
      "a11yReview": 0.69,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 66.63,
      "layerCoverage": 69.92,
      "grammarFidelity": 64.29,
      "verifyScore": 68.29,
      "conversationQuality": 65.95,
      "auditTrail": 67.28,
      "overall": 67.2
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 60.2,
      "layerCoverage": 12.46,
      "grammarFidelity": 59.82,
      "verifyScore": 10.84,
      "conversationQuality": 45.07,
      "auditTrail": 26.38,
      "overall": 40.71
    }
  },
  {
    "id": "tcs-024",
    "input": {
      "chartClarity": 0.79,
      "layerDepth": 0.69,
      "grammarCoverage": 0.7,
      "verifyDiscipline": 0.7,
      "selectConfirmRate": 0.71,
      "askFidelity": 0.75,
      "tactileResolution": 0.72,
      "conversationTurns": 28,
      "multimodalSync": 0.71,
      "feedbackSpeed": 0.7,
      "a11yReview": 0.73,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 70.04,
      "layerCoverage": 70.9,
      "grammarFidelity": 68.58,
      "verifyScore": 69.47,
      "conversationQuality": 70.59,
      "auditTrail": 69.74,
      "overall": 69.92
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 63.46,
      "layerCoverage": 11.37,
      "grammarFidelity": 62.69,
      "verifyScore": 9.91,
      "conversationQuality": 45.97,
      "auditTrail": 28.35,
      "overall": 42.22
    }
  },
  {
    "id": "tcs-025",
    "input": {
      "chartClarity": 0.75,
      "layerDepth": 0.73,
      "grammarCoverage": 0.75,
      "verifyDiscipline": 0.74,
      "selectConfirmRate": 0.75,
      "askFidelity": 0.7,
      "tactileResolution": 0.76,
      "conversationTurns": 29,
      "multimodalSync": 0.75,
      "feedbackSpeed": 0.74,
      "a11yReview": 0.69,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 67.53,
      "layerCoverage": 71.24,
      "grammarFidelity": 67.87,
      "verifyScore": 68.36,
      "conversationQuality": 67.68,
      "auditTrail": 68.68,
      "overall": 68.63
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 60.04,
      "layerCoverage": 12.68,
      "grammarFidelity": 61.21,
      "verifyScore": 10.84,
      "conversationQuality": 45.27,
      "auditTrail": 26.51,
      "overall": 41.04
    }
  },
  {
    "id": "tcs-026",
    "input": {
      "chartClarity": 0.79,
      "layerDepth": 0.78,
      "grammarCoverage": 0.79,
      "verifyDiscipline": 0.78,
      "selectConfirmRate": 0.79,
      "askFidelity": 0.75,
      "tactileResolution": 0.81,
      "conversationTurns": 30,
      "multimodalSync": 0.79,
      "feedbackSpeed": 0.78,
      "a11yReview": 0.73,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 71.7,
      "layerCoverage": 75.66,
      "grammarFidelity": 71.99,
      "verifyScore": 72.19,
      "conversationQuality": 71.73,
      "auditTrail": 72.04,
      "overall": 72.68
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 61.8,
      "layerCoverage": 14.2,
      "grammarFidelity": 62.54,
      "verifyScore": 11.8,
      "conversationQuality": 46.76,
      "auditTrail": 27.5,
      "overall": 42.43
    }
  },
  {
    "id": "tcs-027",
    "input": {
      "chartClarity": 0.83,
      "layerDepth": 0.82,
      "grammarCoverage": 0.78,
      "verifyDiscipline": 0.82,
      "selectConfirmRate": 0.83,
      "askFidelity": 0.79,
      "tactileResolution": 0.79,
      "conversationTurns": 31,
      "multimodalSync": 0.83,
      "feedbackSpeed": 0.81,
      "a11yReview": 0.77,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 78.83,
      "layerCoverage": 81.59,
      "grammarFidelity": 76.89,
      "verifyScore": 79.71,
      "conversationQuality": 78.92,
      "auditTrail": 77.5,
      "overall": 79.13
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 65.4,
      "layerCoverage": 15.16,
      "grammarFidelity": 65.76,
      "verifyScore": 12.72,
      "conversationQuality": 48.51,
      "auditTrail": 30.46,
      "overall": 44.85
    }
  },
  {
    "id": "tcs-028",
    "input": {
      "chartClarity": 0.87,
      "layerDepth": 0.78,
      "grammarCoverage": 0.82,
      "verifyDiscipline": 0.86,
      "selectConfirmRate": 0.81,
      "askFidelity": 0.84,
      "tactileResolution": 0.83,
      "conversationTurns": 4,
      "multimodalSync": 0.81,
      "feedbackSpeed": 0.75,
      "a11yReview": 0.81,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 71.83,
      "layerCoverage": 71.38,
      "grammarFidelity": 74.49,
      "verifyScore": 77.86,
      "conversationQuality": 65.29,
      "auditTrail": 65.82,
      "overall": 71.72
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 64.98,
      "layerCoverage": 14.92,
      "grammarFidelity": 62.96,
      "verifyScore": 12.92,
      "conversationQuality": 48.46,
      "auditTrail": 28.7,
      "overall": 43.94
    }
  },
  {
    "id": "tcs-029",
    "input": {
      "chartClarity": 0.91,
      "layerDepth": 0.83,
      "grammarCoverage": 0.87,
      "verifyDiscipline": 0.89,
      "selectConfirmRate": 0.85,
      "askFidelity": 0.88,
      "tactileResolution": 0.88,
      "conversationTurns": 5,
      "multimodalSync": 0.85,
      "feedbackSpeed": 0.79,
      "a11yReview": 0.85,
      "profile": "baseline"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 76.11,
      "layerCoverage": 75.8,
      "grammarFidelity": 78.95,
      "verifyScore": 81.14,
      "conversationQuality": 69.13,
      "auditTrail": 69.14,
      "overall": 75.69
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 66.58,
      "layerCoverage": 16.38,
      "grammarFidelity": 64.48,
      "verifyScore": 13.76,
      "conversationQuality": 49.82,
      "auditTrail": 29.66,
      "overall": 45.28
    }
  },
  {
    "id": "tcs-030",
    "input": {
      "chartClarity": 0.87,
      "layerDepth": 0.87,
      "grammarCoverage": 0.85,
      "verifyDiscipline": 0.84,
      "selectConfirmRate": 0.89,
      "askFidelity": 0.83,
      "tactileResolution": 0.86,
      "conversationTurns": 6,
      "multimodalSync": 0.89,
      "feedbackSpeed": 0.83,
      "a11yReview": 0.81,
      "profile": "accessible"
    },
    "expectedTactile": {
      "mode": "tactile",
      "planQuality": 80.09,
      "layerCoverage": 81.73,
      "grammarFidelity": 82.02,
      "verifyScore": 83.35,
      "conversationQuality": 73.05,
      "auditTrail": 70.84,
      "overall": 79.33
    },
    "expectedVisual": {
      "mode": "visual",
      "planQuality": 66.98,
      "layerCoverage": 16.85,
      "grammarFidelity": 67.47,
      "verifyScore": 13.55,
      "conversationQuality": 49.9,
      "auditTrail": 31.55,
      "overall": 46.27
    }
  }
];
