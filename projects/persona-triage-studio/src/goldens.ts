import type { PersonaTriageInput, PersonaTriageQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PersonaTriageInput;
  expectedStyleAware: PersonaTriageQuality;
  expectedIdealizedPatient: PersonaTriageQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "pts-001",
    "input": {
      "styleFit": 0.29,
      "personaCoherence": 0.25,
      "urgencyAlignment": 0.28,
      "diversityCoverage": 0.34,
      "articulationScore": 0.39,
      "cooperationScore": 0.45,
      "ambiguityPressure": 0.59,
      "affectPressure": 0.5,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 25.47,
      "personaDiagnosis": 31.5,
      "urgencyReasonScore": 23.9,
      "diversityIntegrity": 37.64,
      "idealizedScore": 16.4,
      "confidence": 21.3,
      "styleAwareContribution": 29.16,
      "idealizedContribution": 16.37,
      "overall": 30.86
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 5.76,
      "personaDiagnosis": 17.2,
      "urgencyReasonScore": 13.9,
      "diversityIntegrity": 31.89,
      "idealizedScore": 40.93,
      "confidence": 17.1,
      "styleAwareContribution": 21.94,
      "idealizedContribution": 38.87,
      "overall": 27.43
    }
  },
  {
    "id": "pts-002",
    "input": {
      "styleFit": 0.33,
      "personaCoherence": 0.29,
      "urgencyAlignment": 0.32,
      "diversityCoverage": 0.38,
      "articulationScore": 0.43,
      "cooperationScore": 0.46,
      "ambiguityPressure": 0.6,
      "affectPressure": 0.51,
      "styleBias": "urgency_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 24.58,
      "personaDiagnosis": 35.15,
      "urgencyReasonScore": 34.79,
      "diversityIntegrity": 31.9,
      "idealizedScore": 18.89,
      "confidence": 24.95,
      "styleAwareContribution": 31.59,
      "idealizedContribution": 19.01,
      "overall": 33.33
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 2.43,
      "personaDiagnosis": 18.32,
      "urgencyReasonScore": 14.92,
      "diversityIntegrity": 33.58,
      "idealizedScore": 31.53,
      "confidence": 18.65,
      "styleAwareContribution": 20.16,
      "idealizedContribution": 34.8,
      "overall": 23.72
    }
  },
  {
    "id": "pts-003",
    "input": {
      "styleFit": 0.37,
      "personaCoherence": 0.27,
      "urgencyAlignment": 0.36,
      "diversityCoverage": 0.42,
      "articulationScore": 0.46,
      "cooperationScore": 0.42,
      "ambiguityPressure": 0.6,
      "affectPressure": 0.46,
      "styleBias": "idealized_first",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 15.91,
      "personaDiagnosis": 24.96,
      "urgencyReasonScore": 21.34,
      "diversityIntegrity": 19.24,
      "idealizedScore": 19.94,
      "confidence": 27.85,
      "styleAwareContribution": 20.34,
      "idealizedContribution": 20.08,
      "overall": 21.29
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 12.17,
      "personaDiagnosis": 17.19,
      "urgencyReasonScore": 14.17,
      "diversityIntegrity": 33.43,
      "idealizedScore": 54.34,
      "confidence": 18.4,
      "styleAwareContribution": 26.26,
      "idealizedContribution": 46.83,
      "overall": 34.74
    }
  },
  {
    "id": "pts-004",
    "input": {
      "styleFit": 0.33,
      "personaCoherence": 0.32,
      "urgencyAlignment": 0.39,
      "diversityCoverage": 0.38,
      "articulationScore": 0.42,
      "cooperationScore": 0.43,
      "ambiguityPressure": 0.53,
      "affectPressure": 0.46,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 30.1,
      "personaDiagnosis": 37.28,
      "urgencyReasonScore": 33.43,
      "diversityIntegrity": 42.23,
      "idealizedScore": 18.93,
      "confidence": 26.15,
      "styleAwareContribution": 35.42,
      "idealizedContribution": 19.41,
      "overall": 36.54
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 8.7,
      "personaDiagnosis": 17.86,
      "urgencyReasonScore": 14.63,
      "diversityIntegrity": 32.29,
      "idealizedScore": 42.77,
      "confidence": 18.85,
      "styleAwareContribution": 23.25,
      "idealizedContribution": 40.46,
      "overall": 29.67
    }
  },
  {
    "id": "pts-005",
    "input": {
      "styleFit": 0.37,
      "personaCoherence": 0.36,
      "urgencyAlignment": 0.35,
      "diversityCoverage": 0.42,
      "articulationScore": 0.46,
      "cooperationScore": 0.45,
      "ambiguityPressure": 0.53,
      "affectPressure": 0.47,
      "styleBias": "style_strict",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 28.5,
      "personaDiagnosis": 40.89,
      "urgencyReasonScore": 21.73,
      "diversityIntegrity": 54.3,
      "idealizedScore": 21.8,
      "confidence": 29.65,
      "styleAwareContribution": 35.25,
      "idealizedContribution": 22.53,
      "overall": 36.96
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 0,
      "personaDiagnosis": 19.54,
      "urgencyReasonScore": 16.22,
      "diversityIntegrity": 34.27,
      "idealizedScore": 32.95,
      "confidence": 21.05,
      "styleAwareContribution": 20.6,
      "idealizedContribution": 36.54,
      "overall": 25.97
    }
  },
  {
    "id": "pts-006",
    "input": {
      "styleFit": 0.41,
      "personaCoherence": 0.34,
      "urgencyAlignment": 0.39,
      "diversityCoverage": 0.45,
      "articulationScore": 0.5,
      "cooperationScore": 0.4,
      "ambiguityPressure": 0.54,
      "affectPressure": 0.42,
      "styleBias": "balanced",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 37.3,
      "personaDiagnosis": 40.5,
      "urgencyReasonScore": 36.15,
      "diversityIntegrity": 47.85,
      "idealizedScore": 23.08,
      "confidence": 32.4,
      "styleAwareContribution": 40.07,
      "idealizedContribution": 23.69,
      "overall": 41.12
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 11.98,
      "personaDiagnosis": 18.1,
      "urgencyReasonScore": 15.02,
      "diversityIntegrity": 34.38,
      "idealizedScore": 46.72,
      "confidence": 20.5,
      "styleAwareContribution": 25.24,
      "idealizedContribution": 43.39,
      "overall": 32.56
    }
  },
  {
    "id": "pts-007",
    "input": {
      "styleFit": 0.45,
      "personaCoherence": 0.38,
      "urgencyAlignment": 0.42,
      "diversityCoverage": 0.49,
      "articulationScore": 0.53,
      "cooperationScore": 0.42,
      "ambiguityPressure": 0.55,
      "affectPressure": 0.43,
      "styleBias": "urgency_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 34.34,
      "personaDiagnosis": 44.11,
      "urgencyReasonScore": 48.67,
      "diversityIntegrity": 39.34,
      "idealizedScore": 25.15,
      "confidence": 35.9,
      "styleAwareContribution": 41.8,
      "idealizedContribution": 25.94,
      "overall": 42.95
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 8.27,
      "personaDiagnosis": 19.39,
      "urgencyReasonScore": 16.24,
      "diversityIntegrity": 35.9,
      "idealizedScore": 34.2,
      "confidence": 22.15,
      "styleAwareContribution": 22.8,
      "idealizedContribution": 37.7,
      "overall": 27.44
    }
  },
  {
    "id": "pts-008",
    "input": {
      "styleFit": 0.41,
      "personaCoherence": 0.43,
      "urgencyAlignment": 0.46,
      "diversityCoverage": 0.45,
      "articulationScore": 0.49,
      "cooperationScore": 0.43,
      "ambiguityPressure": 0.47,
      "affectPressure": 0.44,
      "styleBias": "idealized_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 19.99,
      "personaDiagnosis": 36.43,
      "urgencyReasonScore": 27.89,
      "diversityIntegrity": 24.76,
      "idealizedScore": 24.32,
      "confidence": 34.2,
      "styleAwareContribution": 27.2,
      "idealizedContribution": 25.5,
      "overall": 27.89
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 16.4,
      "personaDiagnosis": 20.19,
      "urgencyReasonScore": 16.86,
      "diversityIntegrity": 34.77,
      "idealizedScore": 58.5,
      "confidence": 22.7,
      "styleAwareContribution": 29.34,
      "idealizedContribution": 51.12,
      "overall": 39.93
    }
  },
  {
    "id": "pts-009",
    "input": {
      "styleFit": 0.46,
      "personaCoherence": 0.41,
      "urgencyAlignment": 0.5,
      "diversityCoverage": 0.49,
      "articulationScore": 0.53,
      "cooperationScore": 0.39,
      "ambiguityPressure": 0.48,
      "affectPressure": 0.38,
      "styleBias": "balanced",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 42.51,
      "personaDiagnosis": 46.24,
      "urgencyReasonScore": 45.92,
      "diversityIntegrity": 52.59,
      "idealizedScore": 25.81,
      "confidence": 37.5,
      "styleAwareContribution": 46.58,
      "idealizedContribution": 26.93,
      "overall": 47.04
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 14.91,
      "personaDiagnosis": 19.13,
      "urgencyReasonScore": 16.09,
      "diversityIntegrity": 35.06,
      "idealizedScore": 48.88,
      "confidence": 22.7,
      "styleAwareContribution": 26.81,
      "idealizedContribution": 45.42,
      "overall": 35.21
    }
  },
  {
    "id": "pts-010",
    "input": {
      "styleFit": 0.5,
      "personaCoherence": 0.45,
      "urgencyAlignment": 0.46,
      "diversityCoverage": 0.53,
      "articulationScore": 0.57,
      "cooperationScore": 0.4,
      "ambiguityPressure": 0.49,
      "affectPressure": 0.39,
      "styleBias": "style_strict",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 38.62,
      "personaDiagnosis": 49.89,
      "urgencyReasonScore": 30.88,
      "diversityIntegrity": 66.82,
      "idealizedScore": 28.29,
      "confidence": 41.15,
      "styleAwareContribution": 45.36,
      "idealizedContribution": 29.55,
      "overall": 46.51
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 3.59,
      "personaDiagnosis": 20.22,
      "urgencyReasonScore": 17.09,
      "diversityIntegrity": 36.76,
      "idealizedScore": 35.54,
      "confidence": 24.25,
      "styleAwareContribution": 22.64,
      "idealizedContribution": 39.18,
      "overall": 29.28
    }
  },
  {
    "id": "pts-011",
    "input": {
      "styleFit": 0.54,
      "personaCoherence": 0.49,
      "urgencyAlignment": 0.49,
      "diversityCoverage": 0.57,
      "articulationScore": 0.6,
      "cooperationScore": 0.42,
      "ambiguityPressure": 0.49,
      "affectPressure": 0.4,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 49.65,
      "personaDiagnosis": 53.5,
      "urgencyReasonScore": 47.4,
      "diversityIntegrity": 60.27,
      "idealizedScore": 30.54,
      "confidence": 44.65,
      "styleAwareContribution": 52.28,
      "idealizedContribution": 32.03,
      "overall": 52.64
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 17.1,
      "personaDiagnosis": 21.65,
      "urgencyReasonScore": 18.47,
      "diversityIntegrity": 38.28,
      "idealizedScore": 54.12,
      "confidence": 26.1,
      "styleAwareContribution": 29.92,
      "idealizedContribution": 50.67,
      "overall": 39.79
    }
  },
  {
    "id": "pts-012",
    "input": {
      "styleFit": 0.5,
      "personaCoherence": 0.48,
      "urgencyAlignment": 0.53,
      "diversityCoverage": 0.53,
      "articulationScore": 0.56,
      "cooperationScore": 0.37,
      "ambiguityPressure": 0.42,
      "affectPressure": 0.35,
      "styleBias": "urgency_first",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 39.48,
      "personaDiagnosis": 52.03,
      "urgencyReasonScore": 62.13,
      "diversityIntegrity": 43.82,
      "idealizedScore": 28.34,
      "confidence": 42.35,
      "styleAwareContribution": 49.79,
      "idealizedContribution": 29.89,
      "overall": 50.21
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 13.23,
      "personaDiagnosis": 19.69,
      "urgencyReasonScore": 16.72,
      "diversityIntegrity": 35.46,
      "idealizedScore": 34.93,
      "confidence": 24.35,
      "styleAwareContribution": 24.01,
      "idealizedContribution": 38.28,
      "overall": 29.68
    }
  },
  {
    "id": "pts-013",
    "input": {
      "styleFit": 0.54,
      "personaCoherence": 0.52,
      "urgencyAlignment": 0.56,
      "diversityCoverage": 0.57,
      "articulationScore": 0.6,
      "cooperationScore": 0.39,
      "ambiguityPressure": 0.42,
      "affectPressure": 0.36,
      "styleBias": "idealized_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 30.42,
      "personaDiagnosis": 45.63,
      "urgencyReasonScore": 36.77,
      "diversityIntegrity": 32.66,
      "idealizedScore": 31.2,
      "confidence": 45.85,
      "styleAwareContribution": 36.34,
      "idealizedContribution": 32.98,
      "overall": 36.74
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 22.62,
      "personaDiagnosis": 21.34,
      "urgencyReasonScore": 18.27,
      "diversityIntegrity": 37.44,
      "idealizedScore": 67.02,
      "confidence": 26.55,
      "styleAwareContribution": 33.34,
      "idealizedContribution": 57.39,
      "overall": 46.58
    }
  },
  {
    "id": "pts-014",
    "input": {
      "styleFit": 0.58,
      "personaCoherence": 0.56,
      "urgencyAlignment": 0.6,
      "diversityCoverage": 0.61,
      "articulationScore": 0.63,
      "cooperationScore": 0.4,
      "ambiguityPressure": 0.43,
      "affectPressure": 0.36,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 54.19,
      "personaDiagnosis": 59.28,
      "urgencyReasonScore": 56.84,
      "diversityIntegrity": 64.86,
      "idealizedScore": 33.07,
      "confidence": 49.5,
      "styleAwareContribution": 58.5,
      "idealizedContribution": 34.97,
      "overall": 58.26
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 20.03,
      "personaDiagnosis": 22.18,
      "urgencyReasonScore": 19.05,
      "diversityIntegrity": 38.68,
      "idealizedScore": 55.96,
      "confidence": 27.85,
      "styleAwareContribution": 31.18,
      "idealizedContribution": 52.19,
      "overall": 41.97
    }
  },
  {
    "id": "pts-015",
    "input": {
      "styleFit": 0.62,
      "personaCoherence": 0.54,
      "urgencyAlignment": 0.56,
      "diversityCoverage": 0.65,
      "articulationScore": 0.67,
      "cooperationScore": 0.36,
      "ambiguityPressure": 0.44,
      "affectPressure": 0.31,
      "styleBias": "style_strict",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 48.54,
      "personaDiagnosis": 59.1,
      "urgencyReasonScore": 39.48,
      "diversityIntegrity": 79.94,
      "idealizedScore": 34.55,
      "confidence": 52.4,
      "styleAwareContribution": 55.45,
      "idealizedContribution": 36.39,
      "overall": 56.02
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 9.43,
      "personaDiagnosis": 21.11,
      "urgencyReasonScore": 18.29,
      "diversityIntegrity": 38.97,
      "idealizedScore": 38.2,
      "confidence": 27.75,
      "styleAwareContribution": 25.2,
      "idealizedContribution": 42.02,
      "overall": 32.94
    }
  },
  {
    "id": "pts-016",
    "input": {
      "styleFit": 0.58,
      "personaCoherence": 0.59,
      "urgencyAlignment": 0.6,
      "diversityCoverage": 0.6,
      "articulationScore": 0.63,
      "cooperationScore": 0.37,
      "ambiguityPressure": 0.36,
      "affectPressure": 0.32,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 54.86,
      "personaDiagnosis": 61.17,
      "urgencyReasonScore": 58,
      "diversityIntegrity": 65.05,
      "idealizedScore": 33.73,
      "confidence": 50.4,
      "styleAwareContribution": 59.5,
      "idealizedContribution": 35.89,
      "overall": 59.25
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 22.05,
      "personaDiagnosis": 21.91,
      "urgencyReasonScore": 18.81,
      "diversityIntegrity": 37.94,
      "idealizedScore": 55.7,
      "confidence": 28.3,
      "styleAwareContribution": 31.28,
      "idealizedContribution": 51.66,
      "overall": 42.38
    }
  },
  {
    "id": "pts-017",
    "input": {
      "styleFit": 0.62,
      "personaCoherence": 0.63,
      "urgencyAlignment": 0.63,
      "diversityCoverage": 0.64,
      "articulationScore": 0.67,
      "cooperationScore": 0.39,
      "ambiguityPressure": 0.37,
      "affectPressure": 0.33,
      "styleBias": "urgency_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 48.76,
      "personaDiagnosis": 64.78,
      "urgencyReasonScore": 75.26,
      "diversityIntegrity": 52.76,
      "idealizedScore": 36.41,
      "confidence": 53.9,
      "styleAwareContribution": 60.9,
      "idealizedContribution": 38.74,
      "overall": 60.91
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 18.73,
      "personaDiagnosis": 23.42,
      "urgencyReasonScore": 20.18,
      "diversityIntegrity": 39.91,
      "idealizedScore": 39.86,
      "confidence": 30.3,
      "styleAwareContribution": 28.42,
      "idealizedContribution": 44.32,
      "overall": 35.88
    }
  },
  {
    "id": "pts-018",
    "input": {
      "styleFit": 0.66,
      "personaCoherence": 0.61,
      "urgencyAlignment": 0.67,
      "diversityCoverage": 0.68,
      "articulationScore": 0.7,
      "cooperationScore": 0.34,
      "ambiguityPressure": 0.38,
      "affectPressure": 0.27,
      "styleBias": "idealized_first",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 40.02,
      "personaDiagnosis": 54.63,
      "urgencyReasonScore": 45.64,
      "diversityIntegrity": 40.09,
      "idealizedScore": 37.08,
      "confidence": 56.95,
      "styleAwareContribution": 45.12,
      "idealizedContribution": 39.28,
      "overall": 45.07
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 28.36,
      "personaDiagnosis": 21.65,
      "urgencyReasonScore": 18.79,
      "diversityIntegrity": 39.47,
      "idealizedScore": 74.27,
      "confidence": 29.5,
      "styleAwareContribution": 36.51,
      "idealizedContribution": 62.33,
      "overall": 51.99
    }
  },
  {
    "id": "pts-019",
    "input": {
      "styleFit": 0.7,
      "personaCoherence": 0.65,
      "urgencyAlignment": 0.7,
      "diversityCoverage": 0.72,
      "articulationScore": 0.74,
      "cooperationScore": 0.36,
      "ambiguityPressure": 0.38,
      "affectPressure": 0.28,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 65.87,
      "personaDiagnosis": 68.24,
      "urgencyReasonScore": 68.28,
      "diversityIntegrity": 75.07,
      "idealizedScore": 39.94,
      "confidence": 60.45,
      "styleAwareContribution": 69.14,
      "idealizedContribution": 42.36,
      "overall": 68.32
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 26.25,
      "personaDiagnosis": 23.3,
      "urgencyReasonScore": 20.33,
      "diversityIntegrity": 41.45,
      "idealizedScore": 62.07,
      "confidence": 31.7,
      "styleAwareContribution": 34.68,
      "idealizedContribution": 57.08,
      "overall": 47.43
    }
  },
  {
    "id": "pts-020",
    "input": {
      "styleFit": 0.66,
      "personaCoherence": 0.7,
      "urgencyAlignment": 0.66,
      "diversityCoverage": 0.68,
      "articulationScore": 0.7,
      "cooperationScore": 0.37,
      "ambiguityPressure": 0.31,
      "affectPressure": 0.29,
      "styleBias": "style_strict",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 52.48,
      "personaDiagnosis": 70.56,
      "urgencyReasonScore": 45.83,
      "diversityIntegrity": 86.81,
      "idealizedScore": 38.94,
      "confidence": 58.75,
      "styleAwareContribution": 62.51,
      "idealizedContribution": 41.63,
      "overall": 62.75
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 13.66,
      "personaDiagnosis": 23.89,
      "urgencyReasonScore": 20.7,
      "diversityIntegrity": 40.31,
      "idealizedScore": 40.86,
      "confidence": 32.05,
      "styleAwareContribution": 27.88,
      "idealizedContribution": 45.36,
      "overall": 37.29
    }
  },
  {
    "id": "pts-021",
    "input": {
      "styleFit": 0.7,
      "personaCoherence": 0.68,
      "urgencyAlignment": 0.7,
      "diversityCoverage": 0.72,
      "articulationScore": 0.73,
      "cooperationScore": 0.33,
      "ambiguityPressure": 0.31,
      "affectPressure": 0.24,
      "styleBias": "balanced",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 66.8,
      "personaDiagnosis": 70.38,
      "urgencyReasonScore": 69.41,
      "diversityIntegrity": 75.82,
      "idealizedScore": 39.99,
      "confidence": 61.65,
      "styleAwareContribution": 70.37,
      "idealizedContribution": 42.63,
      "overall": 69.38
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 27.89,
      "personaDiagnosis": 22.67,
      "urgencyReasonScore": 19.86,
      "diversityIntegrity": 40.15,
      "idealizedScore": 61.19,
      "confidence": 31.8,
      "styleAwareContribution": 34.35,
      "idealizedContribution": 55.98,
      "overall": 47.3
    }
  },
  {
    "id": "pts-022",
    "input": {
      "styleFit": 0.74,
      "personaCoherence": 0.72,
      "urgencyAlignment": 0.73,
      "diversityCoverage": 0.76,
      "articulationScore": 0.77,
      "cooperationScore": 0.34,
      "ambiguityPressure": 0.32,
      "affectPressure": 0.25,
      "styleBias": "urgency_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 58.59,
      "personaDiagnosis": 74.02,
      "urgencyReasonScore": 88.94,
      "diversityIntegrity": 60.51,
      "idealizedScore": 42.47,
      "confidence": 65.3,
      "styleAwareContribution": 71.21,
      "idealizedContribution": 45.23,
      "overall": 70.53
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 24.57,
      "personaDiagnosis": 23.74,
      "urgencyReasonScore": 20.81,
      "diversityIntegrity": 41.85,
      "idealizedScore": 42.21,
      "confidence": 33.35,
      "styleAwareContribution": 30.64,
      "idealizedContribution": 46.62,
      "overall": 39.04
    }
  },
  {
    "id": "pts-023",
    "input": {
      "styleFit": 0.79,
      "personaCoherence": 0.76,
      "urgencyAlignment": 0.77,
      "diversityCoverage": 0.8,
      "articulationScore": 0.81,
      "cooperationScore": 0.36,
      "ambiguityPressure": 0.33,
      "affectPressure": 0.25,
      "styleBias": "idealized_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 50,
      "personaDiagnosis": 67.63,
      "urgencyReasonScore": 53.8,
      "diversityIntegrity": 49.49,
      "idealizedScore": 45.16,
      "confidence": 69.2,
      "styleAwareContribution": 55.18,
      "idealizedContribution": 48.09,
      "overall": 54.9
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 33.86,
      "personaDiagnosis": 25.24,
      "urgencyReasonScore": 22.18,
      "diversityIntegrity": 43.82,
      "idealizedScore": 84.72,
      "confidence": 35.45,
      "styleAwareContribution": 41.96,
      "idealizedContribution": 71.38,
      "overall": 60.77
    }
  },
  {
    "id": "pts-024",
    "input": {
      "styleFit": 0.75,
      "personaCoherence": 0.75,
      "urgencyAlignment": 0.81,
      "diversityCoverage": 0.76,
      "articulationScore": 0.77,
      "cooperationScore": 0.31,
      "ambiguityPressure": 0.25,
      "affectPressure": 0.2,
      "styleBias": "balanced",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 71.88,
      "personaDiagnosis": 76.16,
      "urgencyReasonScore": 79.04,
      "diversityIntegrity": 80.56,
      "idealizedScore": 43.13,
      "confidence": 66.9,
      "styleAwareContribution": 76.82,
      "idealizedContribution": 46.12,
      "overall": 75.29
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 31.21,
      "personaDiagnosis": 23.34,
      "urgencyReasonScore": 20.51,
      "diversityIntegrity": 41.01,
      "idealizedScore": 63.65,
      "confidence": 33.9,
      "styleAwareContribution": 35.94,
      "idealizedContribution": 57.99,
      "overall": 49.94
    }
  },
  {
    "id": "pts-025",
    "input": {
      "styleFit": 0.79,
      "personaCoherence": 0.79,
      "urgencyAlignment": 0.77,
      "diversityCoverage": 0.8,
      "articulationScore": 0.8,
      "cooperationScore": 0.33,
      "ambiguityPressure": 0.26,
      "affectPressure": 0.21,
      "styleBias": "style_strict",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 62.78,
      "personaDiagnosis": 79.77,
      "urgencyReasonScore": 54.91,
      "diversityIntegrity": 100,
      "idealizedScore": 45.2,
      "confidence": 70.4,
      "styleAwareContribution": 72.84,
      "idealizedContribution": 48.32,
      "overall": 72.43
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 19.5,
      "personaDiagnosis": 24.58,
      "urgencyReasonScore": 21.66,
      "diversityIntegrity": 42.53,
      "idealizedScore": 43.52,
      "confidence": 35.55,
      "styleAwareContribution": 30.36,
      "idealizedContribution": 48.09,
      "overall": 40.85
    }
  },
  {
    "id": "pts-026",
    "input": {
      "styleFit": 0.83,
      "personaCoherence": 0.83,
      "urgencyAlignment": 0.8,
      "diversityCoverage": 0.83,
      "articulationScore": 0.84,
      "cooperationScore": 0.34,
      "ambiguityPressure": 0.27,
      "affectPressure": 0.22,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 78.55,
      "personaDiagnosis": 83.17,
      "urgencyReasonScore": 80.33,
      "diversityIntegrity": 87.68,
      "idealizedScore": 47.68,
      "confidence": 73.75,
      "styleAwareContribution": 82.17,
      "idealizedContribution": 50.9,
      "overall": 80.54
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 33.17,
      "personaDiagnosis": 25.7,
      "urgencyReasonScore": 22.59,
      "diversityIntegrity": 44.32,
      "idealizedScore": 68.8,
      "confidence": 37.1,
      "styleAwareContribution": 38.92,
      "idealizedContribution": 63.05,
      "overall": 54.26
    }
  },
  {
    "id": "pts-027",
    "input": {
      "styleFit": 0.87,
      "personaCoherence": 0.81,
      "urgencyAlignment": 0.84,
      "diversityCoverage": 0.87,
      "articulationScore": 0.88,
      "cooperationScore": 0.3,
      "ambiguityPressure": 0.27,
      "affectPressure": 0.17,
      "styleBias": "urgency_first",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 68.64,
      "personaDiagnosis": 82.98,
      "urgencyReasonScore": 100,
      "diversityIntegrity": 68.1,
      "idealizedScore": 49.35,
      "confidence": 76.65,
      "styleAwareContribution": 80.74,
      "idealizedContribution": 52.53,
      "overall": 79.66
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 30.78,
      "personaDiagnosis": 24.73,
      "urgencyReasonScore": 21.93,
      "diversityIntegrity": 44.62,
      "idealizedScore": 45.22,
      "confidence": 37.2,
      "styleAwareContribution": 33.46,
      "idealizedContribution": 49.72,
      "overall": 42.96
    }
  },
  {
    "id": "pts-028",
    "input": {
      "styleFit": 0.83,
      "personaCoherence": 0.86,
      "urgencyAlignment": 0.87,
      "diversityCoverage": 0.83,
      "articulationScore": 0.84,
      "cooperationScore": 0.31,
      "ambiguityPressure": 0.2,
      "affectPressure": 0.17,
      "styleBias": "idealized_first",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 54.2,
      "personaDiagnosis": 75.3,
      "urgencyReasonScore": 60.64,
      "diversityIntegrity": 53.51,
      "idealizedScore": 48.34,
      "confidence": 74.95,
      "styleAwareContribution": 60.92,
      "idealizedContribution": 51.75,
      "overall": 60.27
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 38.81,
      "personaDiagnosis": 25.27,
      "urgencyReasonScore": 22.25,
      "diversityIntegrity": 43.48,
      "idealizedScore": 86.95,
      "confidence": 37.65,
      "styleAwareContribution": 43.35,
      "idealizedContribution": 72.6,
      "overall": 63.55
    }
  },
  {
    "id": "pts-029",
    "input": {
      "styleFit": 0.87,
      "personaCoherence": 0.9,
      "urgencyAlignment": 0.91,
      "diversityCoverage": 0.87,
      "articulationScore": 0.87,
      "cooperationScore": 0.33,
      "ambiguityPressure": 0.2,
      "affectPressure": 0.18,
      "styleBias": "balanced",
      "profile": "style_aware"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 83.06,
      "personaDiagnosis": 88.91,
      "urgencyReasonScore": 89.73,
      "diversityIntegrity": 92.27,
      "idealizedScore": 50.59,
      "confidence": 78.45,
      "styleAwareContribution": 88.36,
      "idealizedContribution": 54.17,
      "overall": 86.21
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 36.33,
      "personaDiagnosis": 26.62,
      "urgencyReasonScore": 23.53,
      "diversityIntegrity": 45,
      "idealizedScore": 71.06,
      "confidence": 39.5,
      "styleAwareContribution": 40.51,
      "idealizedContribution": 65.09,
      "overall": 57
    }
  },
  {
    "id": "pts-030",
    "input": {
      "styleFit": 0.91,
      "personaCoherence": 0.88,
      "urgencyAlignment": 0.87,
      "diversityCoverage": 0.91,
      "articulationScore": 0.91,
      "cooperationScore": 0.28,
      "ambiguityPressure": 0.21,
      "affectPressure": 0.13,
      "styleBias": "style_strict",
      "profile": "idealized_patient"
    },
    "expectedStyleAware": {
      "mode": "style_aware",
      "styleDiagnosis": 72.29,
      "personaDiagnosis": 88.77,
      "urgencyReasonScore": 63.27,
      "diversityIntegrity": 100,
      "idealizedScore": 51.88,
      "confidence": 81.5,
      "styleAwareContribution": 79.82,
      "idealizedContribution": 55.32,
      "overall": 79.41
    },
    "expectedIdealizedPatient": {
      "mode": "idealized_patient",
      "styleDiagnosis": 25.72,
      "personaDiagnosis": 25.08,
      "urgencyReasonScore": 22.3,
      "diversityIntegrity": 45.02,
      "idealizedScore": 46.21,
      "confidence": 38.95,
      "styleAwareContribution": 32.87,
      "idealizedContribution": 50.69,
      "overall": 44.31
    }
  }
];
