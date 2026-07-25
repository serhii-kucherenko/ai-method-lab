import type { ConsultInput, ConsultQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ConsultInput;
  expectedMultimodal: ConsultQuality;
  expectedTextOnly: ConsultQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cbs-001",
    "input": {
      "imageRelevance": 0.19,
      "visualGrounding": 0.16,
      "clinicalCoherence": 0.22,
      "turnClarity": 0.19,
      "safetyDiscipline": 0.19,
      "textFluency": 0.63,
      "departmentFit": 0.19,
      "historyCoverage": 0.18,
      "urgencyRecognition": 0.19,
      "hallucinationRisk": 0.63,
      "department": "radiology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 0,
      "clinicalPlan": 18.18,
      "safetyScore": 4.42,
      "departmentAlignment": 8.47,
      "responseClarity": 0,
      "overall": 6.41
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 27.65,
      "clinicalPlan": 24.37,
      "safetyScore": 12.65,
      "departmentAlignment": 17.8,
      "responseClarity": 13.13,
      "overall": 18.66
    }
  },
  {
    "id": "cbs-002",
    "input": {
      "imageRelevance": 0.23,
      "visualGrounding": 0.2,
      "clinicalCoherence": 0.26,
      "turnClarity": 0.23,
      "safetyDiscipline": 0.23,
      "textFluency": 0.63,
      "departmentFit": 0.23,
      "historyCoverage": 0.22,
      "urgencyRecognition": 0.22,
      "hallucinationRisk": 0.63,
      "department": "ophthalmology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 1.81,
      "clinicalPlan": 20.05,
      "safetyScore": 6.74,
      "departmentAlignment": 10.56,
      "responseClarity": 0,
      "overall": 8.09
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 25.91,
      "clinicalPlan": 24.48,
      "safetyScore": 12.28,
      "departmentAlignment": 17.29,
      "responseClarity": 12.14,
      "overall": 18.02
    }
  },
  {
    "id": "cbs-003",
    "input": {
      "imageRelevance": 0.28,
      "visualGrounding": 0.24,
      "clinicalCoherence": 0.24,
      "turnClarity": 0.28,
      "safetyDiscipline": 0.28,
      "textFluency": 0.57,
      "departmentFit": 0.28,
      "historyCoverage": 0.21,
      "urgencyRecognition": 0.26,
      "hallucinationRisk": 0.57,
      "department": "orthopedics",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 34.28,
      "clinicalPlan": 42.3,
      "safetyScore": 34.45,
      "departmentAlignment": 37.67,
      "responseClarity": 35.14,
      "overall": 36.83
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 20.96,
      "clinicalPlan": 21.75,
      "safetyScore": 10.77,
      "departmentAlignment": 15.2,
      "responseClarity": 9.18,
      "overall": 15.26
    }
  },
  {
    "id": "cbs-004",
    "input": {
      "imageRelevance": 0.24,
      "visualGrounding": 0.28,
      "clinicalCoherence": 0.29,
      "turnClarity": 0.24,
      "safetyDiscipline": 0.24,
      "textFluency": 0.57,
      "departmentFit": 0.24,
      "historyCoverage": 0.25,
      "urgencyRecognition": 0.3,
      "hallucinationRisk": 0.57,
      "department": "general",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 7.29,
      "clinicalPlan": 23.1,
      "safetyScore": 10.47,
      "departmentAlignment": 12.77,
      "responseClarity": 1.03,
      "overall": 11.39
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 22.01,
      "clinicalPlan": 23.32,
      "safetyScore": 10.48,
      "departmentAlignment": 15,
      "responseClarity": 8.73,
      "overall": 15.58
    }
  },
  {
    "id": "cbs-005",
    "input": {
      "imageRelevance": 0.29,
      "visualGrounding": 0.25,
      "clinicalCoherence": 0.33,
      "turnClarity": 0.28,
      "safetyDiscipline": 0.28,
      "textFluency": 0.57,
      "departmentFit": 0.28,
      "historyCoverage": 0.29,
      "urgencyRecognition": 0.26,
      "hallucinationRisk": 0.57,
      "department": "dermatology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 7.81,
      "clinicalPlan": 25.66,
      "safetyScore": 11.39,
      "departmentAlignment": 14.87,
      "responseClarity": 2.92,
      "overall": 12.94
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 20.83,
      "clinicalPlan": 23.25,
      "safetyScore": 10.61,
      "departmentAlignment": 14.94,
      "responseClarity": 8.83,
      "overall": 15.41
    }
  },
  {
    "id": "cbs-006",
    "input": {
      "imageRelevance": 0.33,
      "visualGrounding": 0.29,
      "clinicalCoherence": 0.31,
      "turnClarity": 0.32,
      "safetyDiscipline": 0.33,
      "textFluency": 0.52,
      "departmentFit": 0.33,
      "historyCoverage": 0.28,
      "urgencyRecognition": 0.3,
      "hallucinationRisk": 0.52,
      "department": "radiology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 40.84,
      "clinicalPlan": 49.07,
      "safetyScore": 40.17,
      "departmentAlignment": 42.78,
      "responseClarity": 41.09,
      "overall": 42.91
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 16.79,
      "clinicalPlan": 20.96,
      "safetyScore": 9.47,
      "departmentAlignment": 13.32,
      "responseClarity": 6.31,
      "overall": 13.17
    }
  },
  {
    "id": "cbs-007",
    "input": {
      "imageRelevance": 0.37,
      "visualGrounding": 0.32,
      "clinicalCoherence": 0.35,
      "turnClarity": 0.37,
      "safetyDiscipline": 0.37,
      "textFluency": 0.52,
      "departmentFit": 0.37,
      "historyCoverage": 0.32,
      "urgencyRecognition": 0.34,
      "hallucinationRisk": 0.52,
      "department": "ophthalmology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 15.24,
      "clinicalPlan": 28.34,
      "safetyScore": 18.25,
      "departmentAlignment": 20.21,
      "responseClarity": 8.6,
      "overall": 18.56
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 15.25,
      "clinicalPlan": 21.05,
      "safetyScore": 9.06,
      "departmentAlignment": 12.88,
      "responseClarity": 5.58,
      "overall": 12.61
    }
  },
  {
    "id": "cbs-008",
    "input": {
      "imageRelevance": 0.34,
      "visualGrounding": 0.36,
      "clinicalCoherence": 0.39,
      "turnClarity": 0.33,
      "safetyDiscipline": 0.33,
      "textFluency": 0.52,
      "departmentFit": 0.33,
      "historyCoverage": 0.36,
      "urgencyRecognition": 0.37,
      "hallucinationRisk": 0.52,
      "department": "orthopedics",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 15.79,
      "clinicalPlan": 30.26,
      "safetyScore": 17.37,
      "departmentAlignment": 18.99,
      "responseClarity": 7.75,
      "overall": 18.58
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 15.9,
      "clinicalPlan": 22.23,
      "safetyScore": 8.73,
      "departmentAlignment": 12.55,
      "responseClarity": 4.98,
      "overall": 12.71
    }
  },
  {
    "id": "cbs-009",
    "input": {
      "imageRelevance": 0.38,
      "visualGrounding": 0.4,
      "clinicalCoherence": 0.38,
      "turnClarity": 0.37,
      "safetyDiscipline": 0.38,
      "textFluency": 0.46,
      "departmentFit": 0.38,
      "historyCoverage": 0.35,
      "urgencyRecognition": 0.41,
      "hallucinationRisk": 0.46,
      "department": "general",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 48.14,
      "clinicalPlan": 53.16,
      "safetyScore": 45.33,
      "departmentAlignment": 45.76,
      "responseClarity": 44.27,
      "overall": 47.63
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 11.61,
      "clinicalPlan": 19.86,
      "safetyScore": 7.51,
      "departmentAlignment": 10.74,
      "responseClarity": 2.23,
      "overall": 10.3
    }
  },
  {
    "id": "cbs-010",
    "input": {
      "imageRelevance": 0.43,
      "visualGrounding": 0.37,
      "clinicalCoherence": 0.42,
      "turnClarity": 0.41,
      "safetyDiscipline": 0.42,
      "textFluency": 0.46,
      "departmentFit": 0.42,
      "historyCoverage": 0.39,
      "urgencyRecognition": 0.37,
      "hallucinationRisk": 0.46,
      "department": "dermatology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 21.45,
      "clinicalPlan": 33.98,
      "safetyScore": 22.81,
      "departmentAlignment": 24.63,
      "responseClarity": 13.46,
      "overall": 23.77
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 10.47,
      "clinicalPlan": 19.74,
      "safetyScore": 7.59,
      "departmentAlignment": 10.63,
      "responseClarity": 2.3,
      "overall": 10.11
    }
  },
  {
    "id": "cbs-011",
    "input": {
      "imageRelevance": 0.47,
      "visualGrounding": 0.41,
      "clinicalCoherence": 0.46,
      "turnClarity": 0.46,
      "safetyDiscipline": 0.46,
      "textFluency": 0.46,
      "departmentFit": 0.46,
      "historyCoverage": 0.43,
      "urgencyRecognition": 0.41,
      "hallucinationRisk": 0.46,
      "department": "radiology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 25.05,
      "clinicalPlan": 36.61,
      "safetyScore": 25.92,
      "departmentAlignment": 27.21,
      "responseClarity": 16.35,
      "overall": 26.76
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 8.83,
      "clinicalPlan": 19.74,
      "safetyScore": 7.15,
      "departmentAlignment": 10.1,
      "responseClarity": 1.37,
      "overall": 9.45
    }
  },
  {
    "id": "cbs-012",
    "input": {
      "imageRelevance": 0.44,
      "visualGrounding": 0.45,
      "clinicalCoherence": 0.44,
      "turnClarity": 0.42,
      "safetyDiscipline": 0.43,
      "textFluency": 0.4,
      "departmentFit": 0.43,
      "historyCoverage": 0.42,
      "urgencyRecognition": 0.45,
      "hallucinationRisk": 0.4,
      "department": "ophthalmology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 55.09,
      "clinicalPlan": 59.43,
      "safetyScore": 50.98,
      "departmentAlignment": 50.69,
      "responseClarity": 50.38,
      "overall": 53.68
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 6.96,
      "clinicalPlan": 18.43,
      "safetyScore": 6.07,
      "departmentAlignment": 8.57,
      "responseClarity": 0,
      "overall": 8.05
    }
  },
  {
    "id": "cbs-013",
    "input": {
      "imageRelevance": 0.48,
      "visualGrounding": 0.48,
      "clinicalCoherence": 0.48,
      "turnClarity": 0.46,
      "safetyDiscipline": 0.47,
      "textFluency": 0.4,
      "departmentFit": 0.47,
      "historyCoverage": 0.46,
      "urgencyRecognition": 0.49,
      "hallucinationRisk": 0.4,
      "department": "orthopedics",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 29.59,
      "clinicalPlan": 38.73,
      "safetyScore": 28.99,
      "departmentAlignment": 28.82,
      "responseClarity": 18.37,
      "overall": 29.55
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 5.47,
      "clinicalPlan": 18.44,
      "safetyScore": 5.66,
      "departmentAlignment": 8.12,
      "responseClarity": 0,
      "overall": 7.64
    }
  },
  {
    "id": "cbs-014",
    "input": {
      "imageRelevance": 0.52,
      "visualGrounding": 0.52,
      "clinicalCoherence": 0.53,
      "turnClarity": 0.51,
      "safetyDiscipline": 0.51,
      "textFluency": 0.4,
      "departmentFit": 0.51,
      "historyCoverage": 0.5,
      "urgencyRecognition": 0.53,
      "hallucinationRisk": 0.4,
      "department": "general",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 32.61,
      "clinicalPlan": 40.89,
      "safetyScore": 31.43,
      "departmentAlignment": 30.87,
      "responseClarity": 20.66,
      "overall": 31.97
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 3.87,
      "clinicalPlan": 18.54,
      "safetyScore": 5.23,
      "departmentAlignment": 7.6,
      "responseClarity": 0,
      "overall": 7.22
    }
  },
  {
    "id": "cbs-015",
    "input": {
      "imageRelevance": 0.57,
      "visualGrounding": 0.49,
      "clinicalCoherence": 0.51,
      "turnClarity": 0.55,
      "safetyDiscipline": 0.56,
      "textFluency": 0.34,
      "departmentFit": 0.56,
      "historyCoverage": 0.49,
      "urgencyRecognition": 0.49,
      "hallucinationRisk": 0.34,
      "department": "dermatology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 64.38,
      "clinicalPlan": 65.67,
      "safetyScore": 60.22,
      "departmentAlignment": 59.29,
      "responseClarity": 59.7,
      "overall": 62.17
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0.41,
      "clinicalPlan": 15.98,
      "safetyScore": 4.61,
      "departmentAlignment": 6.24,
      "responseClarity": 0,
      "overall": 5.72
    }
  },
  {
    "id": "cbs-016",
    "input": {
      "imageRelevance": 0.53,
      "visualGrounding": 0.53,
      "clinicalCoherence": 0.55,
      "turnClarity": 0.51,
      "safetyDiscipline": 0.52,
      "textFluency": 0.35,
      "departmentFit": 0.52,
      "historyCoverage": 0.53,
      "urgencyRecognition": 0.53,
      "hallucinationRisk": 0.35,
      "department": "radiology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 36.11,
      "clinicalPlan": 45.06,
      "safetyScore": 34.34,
      "departmentAlignment": 33.74,
      "responseClarity": 24.01,
      "overall": 35.36
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 1.69,
      "clinicalPlan": 17.49,
      "safetyScore": 4.55,
      "departmentAlignment": 6.38,
      "responseClarity": 0,
      "overall": 6.27
    }
  },
  {
    "id": "cbs-017",
    "input": {
      "imageRelevance": 0.58,
      "visualGrounding": 0.57,
      "clinicalCoherence": 0.59,
      "turnClarity": 0.55,
      "safetyDiscipline": 0.57,
      "textFluency": 0.35,
      "departmentFit": 0.57,
      "historyCoverage": 0.58,
      "urgencyRecognition": 0.56,
      "hallucinationRisk": 0.35,
      "department": "ophthalmology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 39.2,
      "clinicalPlan": 46.62,
      "safetyScore": 36.62,
      "departmentAlignment": 35.86,
      "responseClarity": 25.66,
      "overall": 37.55
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 17.24,
      "safetyScore": 4.15,
      "departmentAlignment": 5.79,
      "responseClarity": 0,
      "overall": 5.75
    }
  },
  {
    "id": "cbs-018",
    "input": {
      "imageRelevance": 0.62,
      "visualGrounding": 0.61,
      "clinicalCoherence": 0.58,
      "turnClarity": 0.6,
      "safetyDiscipline": 0.61,
      "textFluency": 0.29,
      "departmentFit": 0.61,
      "historyCoverage": 0.56,
      "urgencyRecognition": 0.6,
      "hallucinationRisk": 0.29,
      "department": "orthopedics",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 72.82,
      "clinicalPlan": 70.24,
      "safetyScore": 65.9,
      "departmentAlignment": 62.9,
      "responseClarity": 63.62,
      "overall": 67.61
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 14.93,
      "safetyScore": 3.03,
      "departmentAlignment": 4.02,
      "responseClarity": 0,
      "overall": 4.67
    }
  },
  {
    "id": "cbs-019",
    "input": {
      "imageRelevance": 0.66,
      "visualGrounding": 0.64,
      "clinicalCoherence": 0.62,
      "turnClarity": 0.64,
      "safetyDiscipline": 0.65,
      "textFluency": 0.29,
      "departmentFit": 0.65,
      "historyCoverage": 0.6,
      "urgencyRecognition": 0.64,
      "hallucinationRisk": 0.29,
      "department": "general",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 46.29,
      "clinicalPlan": 48.98,
      "safetyScore": 42.53,
      "departmentAlignment": 40.49,
      "responseClarity": 30.87,
      "overall": 42.62
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 14.85,
      "safetyScore": 2.62,
      "departmentAlignment": 3.55,
      "responseClarity": 0,
      "overall": 4.48
    }
  },
  {
    "id": "cbs-020",
    "input": {
      "imageRelevance": 0.63,
      "visualGrounding": 0.61,
      "clinicalCoherence": 0.66,
      "turnClarity": 0.6,
      "safetyDiscipline": 0.62,
      "textFluency": 0.29,
      "departmentFit": 0.62,
      "historyCoverage": 0.65,
      "urgencyRecognition": 0.6,
      "hallucinationRisk": 0.29,
      "department": "dermatology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 45.04,
      "clinicalPlan": 52.49,
      "safetyScore": 41.55,
      "departmentAlignment": 40.39,
      "responseClarity": 30.98,
      "overall": 42.89
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 16.01,
      "safetyScore": 2.99,
      "departmentAlignment": 3.95,
      "responseClarity": 0,
      "overall": 4.89
    }
  },
  {
    "id": "cbs-021",
    "input": {
      "imageRelevance": 0.67,
      "visualGrounding": 0.65,
      "clinicalCoherence": 0.64,
      "turnClarity": 0.65,
      "safetyDiscipline": 0.66,
      "textFluency": 0.23,
      "departmentFit": 0.66,
      "historyCoverage": 0.63,
      "urgencyRecognition": 0.64,
      "hallucinationRisk": 0.23,
      "department": "radiology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 80.3,
      "clinicalPlan": 77.6,
      "safetyScore": 72.74,
      "departmentAlignment": 68.75,
      "responseClarity": 71.18,
      "overall": 74.66
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 13.59,
      "safetyScore": 1.95,
      "departmentAlignment": 2.23,
      "responseClarity": 0,
      "overall": 3.82
    }
  },
  {
    "id": "cbs-022",
    "input": {
      "imageRelevance": 0.72,
      "visualGrounding": 0.69,
      "clinicalCoherence": 0.68,
      "turnClarity": 0.69,
      "safetyDiscipline": 0.7,
      "textFluency": 0.23,
      "departmentFit": 0.7,
      "historyCoverage": 0.67,
      "urgencyRecognition": 0.68,
      "hallucinationRisk": 0.23,
      "department": "ophthalmology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 53.43,
      "clinicalPlan": 54.98,
      "safetyScore": 48.04,
      "departmentAlignment": 45.51,
      "responseClarity": 36.75,
      "overall": 48.6
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 13.27,
      "safetyScore": 1.4,
      "departmentAlignment": 1.52,
      "responseClarity": 0,
      "overall": 3.5
    }
  },
  {
    "id": "cbs-023",
    "input": {
      "imageRelevance": 0.76,
      "visualGrounding": 0.73,
      "clinicalCoherence": 0.73,
      "turnClarity": 0.73,
      "safetyDiscipline": 0.75,
      "textFluency": 0.23,
      "departmentFit": 0.75,
      "historyCoverage": 0.72,
      "urgencyRecognition": 0.72,
      "hallucinationRisk": 0.23,
      "department": "orthopedics",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 56.46,
      "clinicalPlan": 57.21,
      "safetyScore": 50.7,
      "departmentAlignment": 47.86,
      "responseClarity": 38.6,
      "overall": 51.07
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 13.24,
      "safetyScore": 1.05,
      "departmentAlignment": 1.08,
      "responseClarity": 0,
      "overall": 3.34
    }
  },
  {
    "id": "cbs-024",
    "input": {
      "imageRelevance": 0.73,
      "visualGrounding": 0.77,
      "clinicalCoherence": 0.71,
      "turnClarity": 0.69,
      "safetyDiscipline": 0.71,
      "textFluency": 0.17,
      "departmentFit": 0.71,
      "historyCoverage": 0.7,
      "urgencyRecognition": 0.75,
      "hallucinationRisk": 0.17,
      "department": "general",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 87.48,
      "clinicalPlan": 80.62,
      "safetyScore": 76.67,
      "departmentAlignment": 71.05,
      "responseClarity": 72.6,
      "overall": 78.47
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 12.04,
      "safetyScore": 0.34,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.72
    }
  },
  {
    "id": "cbs-025",
    "input": {
      "imageRelevance": 0.77,
      "visualGrounding": 0.73,
      "clinicalCoherence": 0.75,
      "turnClarity": 0.74,
      "safetyDiscipline": 0.75,
      "textFluency": 0.17,
      "departmentFit": 0.75,
      "historyCoverage": 0.74,
      "urgencyRecognition": 0.72,
      "hallucinationRisk": 0.17,
      "department": "dermatology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 59.48,
      "clinicalPlan": 60.93,
      "safetyScore": 53.09,
      "departmentAlignment": 50.16,
      "responseClarity": 42.22,
      "overall": 54.08
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 11.99,
      "safetyScore": 0.39,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.72
    }
  },
  {
    "id": "cbs-026",
    "input": {
      "imageRelevance": 0.81,
      "visualGrounding": 0.77,
      "clinicalCoherence": 0.79,
      "turnClarity": 0.78,
      "safetyDiscipline": 0.8,
      "textFluency": 0.18,
      "departmentFit": 0.8,
      "historyCoverage": 0.79,
      "urgencyRecognition": 0.75,
      "hallucinationRisk": 0.18,
      "department": "radiology",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 63.42,
      "clinicalPlan": 63.69,
      "safetyScore": 56.49,
      "departmentAlignment": 53.24,
      "responseClarity": 44.93,
      "overall": 57.3
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 12.01,
      "safetyScore": 0.17,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.68
    }
  },
  {
    "id": "cbs-027",
    "input": {
      "imageRelevance": 0.86,
      "visualGrounding": 0.81,
      "clinicalCoherence": 0.77,
      "turnClarity": 0.82,
      "safetyDiscipline": 0.84,
      "textFluency": 0.12,
      "departmentFit": 0.84,
      "historyCoverage": 0.77,
      "urgencyRecognition": 0.79,
      "hallucinationRisk": 0.12,
      "department": "ophthalmology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 98.17,
      "clinicalPlan": 87.25,
      "safetyScore": 86.95,
      "departmentAlignment": 80.48,
      "responseClarity": 83.07,
      "overall": 87.92
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 9.5,
      "safetyScore": 0,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.09
    }
  },
  {
    "id": "cbs-028",
    "input": {
      "imageRelevance": 0.82,
      "visualGrounding": 0.85,
      "clinicalCoherence": 0.82,
      "turnClarity": 0.78,
      "safetyDiscipline": 0.8,
      "textFluency": 0.12,
      "departmentFit": 0.8,
      "historyCoverage": 0.81,
      "urgencyRecognition": 0.83,
      "hallucinationRisk": 0.12,
      "department": "orthopedics",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 67.48,
      "clinicalPlan": 65.18,
      "safetyScore": 58.28,
      "departmentAlignment": 53.9,
      "responseClarity": 45.94,
      "overall": 59.24
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 10.74,
      "safetyScore": 0,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.36
    }
  },
  {
    "id": "cbs-029",
    "input": {
      "imageRelevance": 0.87,
      "visualGrounding": 0.89,
      "clinicalCoherence": 0.86,
      "turnClarity": 0.83,
      "safetyDiscipline": 0.85,
      "textFluency": 0.12,
      "departmentFit": 0.85,
      "historyCoverage": 0.86,
      "urgencyRecognition": 0.87,
      "hallucinationRisk": 0.12,
      "department": "general",
      "plan": "text_only"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 70.7,
      "clinicalPlan": 66.96,
      "safetyScore": 60.83,
      "departmentAlignment": 56.17,
      "responseClarity": 47.93,
      "overall": 61.64
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 10.33,
      "safetyScore": 0,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 2.27
    }
  },
  {
    "id": "cbs-030",
    "input": {
      "imageRelevance": 0.91,
      "visualGrounding": 0.85,
      "clinicalCoherence": 0.84,
      "turnClarity": 0.87,
      "safetyDiscipline": 0.89,
      "textFluency": 0.06,
      "departmentFit": 0.89,
      "historyCoverage": 0.84,
      "urgencyRecognition": 0.83,
      "hallucinationRisk": 0.06,
      "department": "dermatology",
      "plan": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal",
      "visualFidelity": 100,
      "clinicalPlan": 93.76,
      "safetyScore": 91.87,
      "departmentAlignment": 85.36,
      "responseClarity": 88.13,
      "overall": 92.47
    },
    "expectedTextOnly": {
      "mode": "text_only",
      "visualFidelity": 0,
      "clinicalPlan": 8.17,
      "safetyScore": 0,
      "departmentAlignment": 0,
      "responseClarity": 0,
      "overall": 1.8
    }
  }
];
