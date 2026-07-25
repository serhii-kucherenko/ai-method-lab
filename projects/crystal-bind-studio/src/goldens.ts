import type { BindInput, BindQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: BindInput;
  expectedMultimodal: BindQuality;
  expectedSingle: BindQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "cbs-001",
    "input": {
      "structureFidelity": 0.17,
      "diffractionMatch": 0.19,
      "dosAlignment": 0.17,
      "languageClarity": 0.18,
      "bindCoherence": 0.18,
      "crossModalAgreement": 0.15,
      "retrievalPrecision": 0.19,
      "noiseLevel": 0.35,
      "modalityBias": "diffraction",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 11.1,
      "diffractionScore": 20.11,
      "dosScore": 9.93,
      "languageScore": 9.16,
      "bindScore": 21.29,
      "retrievalScore": 20.7,
      "confidence": 14.03,
      "modalityContribution": 12.58,
      "crossModalContribution": 15.9,
      "overall": 16.29
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 0,
      "diffractionScore": 5.6,
      "dosScore": 0,
      "languageScore": 0,
      "bindScore": 5.8,
      "retrievalScore": 8.4,
      "confidence": 6.9,
      "modalityContribution": 13.3,
      "crossModalContribution": 0,
      "overall": 4.76
    }
  },
  {
    "id": "cbs-002",
    "input": {
      "structureFidelity": 0.21,
      "diffractionMatch": 0.22,
      "dosAlignment": 0.21,
      "languageClarity": 0.22,
      "bindCoherence": 0.22,
      "crossModalAgreement": 0.18,
      "retrievalPrecision": 0.23,
      "noiseLevel": 0.35,
      "modalityBias": "dos",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 13.9,
      "diffractionScore": 13.1,
      "dosScore": 23.04,
      "languageScore": 11.88,
      "bindScore": 25.37,
      "retrievalScore": 24.69,
      "confidence": 14.44,
      "modalityContribution": 15.48,
      "crossModalContribution": 19.2,
      "overall": 19.2
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 0,
      "diffractionScore": 0,
      "dosScore": 7.28,
      "languageScore": 0,
      "bindScore": 7.36,
      "retrievalScore": 10.24,
      "confidence": 6.46,
      "modalityContribution": 14.7,
      "crossModalContribution": 0,
      "overall": 5.57
    }
  },
  {
    "id": "cbs-003",
    "input": {
      "structureFidelity": 0.26,
      "diffractionMatch": 0.26,
      "dosAlignment": 0.2,
      "languageClarity": 0.27,
      "bindCoherence": 0.21,
      "crossModalAgreement": 0.22,
      "retrievalPrecision": 0.28,
      "noiseLevel": 0.32,
      "modalityBias": "language",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 16.32,
      "diffractionScore": 15.06,
      "dosScore": 12.6,
      "languageScore": 27.5,
      "bindScore": 28.01,
      "retrievalScore": 29.08,
      "confidence": 14.75,
      "modalityContribution": 17.87,
      "crossModalContribution": 21.7,
      "overall": 21.53
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 0,
      "diffractionScore": 0,
      "dosScore": 0.03,
      "languageScore": 11.42,
      "bindScore": 11.26,
      "retrievalScore": 14.64,
      "confidence": 6.26,
      "modalityContribution": 18.9,
      "crossModalContribution": 0,
      "overall": 7.9
    }
  },
  {
    "id": "cbs-004",
    "input": {
      "structureFidelity": 0.22,
      "diffractionMatch": 0.3,
      "dosAlignment": 0.24,
      "languageClarity": 0.23,
      "bindCoherence": 0.25,
      "crossModalAgreement": 0.26,
      "retrievalPrecision": 0.24,
      "noiseLevel": 0.32,
      "modalityBias": "balanced",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 21.86,
      "diffractionScore": 26.13,
      "dosScore": 22.01,
      "languageScore": 20.1,
      "bindScore": 31.06,
      "retrievalScore": 28.9,
      "confidence": 16.16,
      "modalityContribution": 22.53,
      "crossModalContribution": 25.7,
      "overall": 25.02
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 0.31,
      "diffractionScore": 13.96,
      "dosScore": 0.74,
      "languageScore": 0.53,
      "bindScore": 11.8,
      "retrievalScore": 15.2,
      "confidence": 7.8,
      "modalityContribution": 21,
      "crossModalContribution": 0,
      "overall": 9
    }
  },
  {
    "id": "cbs-005",
    "input": {
      "structureFidelity": 0.27,
      "diffractionMatch": 0.26,
      "dosAlignment": 0.29,
      "languageClarity": 0.27,
      "bindCoherence": 0.3,
      "crossModalAgreement": 0.22,
      "retrievalPrecision": 0.28,
      "noiseLevel": 0.32,
      "modalityBias": "structure",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 32.56,
      "diffractionScore": 17.58,
      "dosScore": 18.8,
      "languageScore": 16.72,
      "bindScore": 32.85,
      "retrievalScore": 30.89,
      "confidence": 16.36,
      "modalityContribution": 21.42,
      "crossModalContribution": 24.4,
      "overall": 25.37
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 11.86,
      "diffractionScore": 0,
      "dosScore": 0.03,
      "languageScore": 0,
      "bindScore": 11.26,
      "retrievalScore": 14.64,
      "confidence": 6.26,
      "modalityContribution": 18.9,
      "crossModalContribution": 0,
      "overall": 8.18
    }
  },
  {
    "id": "cbs-006",
    "input": {
      "structureFidelity": 0.31,
      "diffractionMatch": 0.3,
      "dosAlignment": 0.27,
      "languageClarity": 0.32,
      "bindCoherence": 0.28,
      "crossModalAgreement": 0.26,
      "retrievalPrecision": 0.32,
      "noiseLevel": 0.29,
      "modalityBias": "diffraction",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 20.98,
      "diffractionScore": 34.04,
      "dosScore": 18.03,
      "languageScore": 18.76,
      "bindScore": 34.77,
      "retrievalScore": 34.52,
      "confidence": 14.49,
      "modalityContribution": 22.95,
      "crossModalContribution": 26.6,
      "overall": 27.05
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 0.97,
      "diffractionScore": 14.62,
      "dosScore": 1.34,
      "languageScore": 1.13,
      "bindScore": 13.72,
      "retrievalScore": 17.38,
      "confidence": 5.62,
      "modalityContribution": 21,
      "crossModalContribution": 0,
      "overall": 10.02
    }
  },
  {
    "id": "cbs-007",
    "input": {
      "structureFidelity": 0.35,
      "diffractionMatch": 0.34,
      "dosAlignment": 0.31,
      "languageClarity": 0.36,
      "bindCoherence": 0.32,
      "crossModalAgreement": 0.3,
      "retrievalPrecision": 0.37,
      "noiseLevel": 0.29,
      "modalityBias": "dos",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 23.77,
      "diffractionScore": 22.01,
      "dosScore": 36.06,
      "languageScore": 21.47,
      "bindScore": 39.43,
      "retrievalScore": 39.38,
      "confidence": 14.61,
      "modalityContribution": 25.83,
      "crossModalContribution": 30.6,
      "overall": 30.11
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 1.21,
      "diffractionScore": 1.21,
      "dosScore": 15.28,
      "languageScore": 1.36,
      "bindScore": 15.04,
      "retrievalScore": 18.96,
      "confidence": 4.74,
      "modalityContribution": 21.7,
      "crossModalContribution": 0,
      "overall": 10.44
    }
  },
  {
    "id": "cbs-008",
    "input": {
      "structureFidelity": 0.32,
      "diffractionMatch": 0.38,
      "dosAlignment": 0.36,
      "languageClarity": 0.32,
      "bindCoherence": 0.37,
      "crossModalAgreement": 0.34,
      "retrievalPrecision": 0.33,
      "noiseLevel": 0.29,
      "modalityBias": "language",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 23.92,
      "diffractionScore": 25.05,
      "dosScore": 24.23,
      "languageScore": 37.04,
      "bindScore": 43.02,
      "retrievalScore": 39.4,
      "confidence": 18.58,
      "modalityContribution": 27.56,
      "crossModalContribution": 34.9,
      "overall": 31.88
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 1.46,
      "diffractionScore": 1.46,
      "dosScore": 1.82,
      "languageScore": 15.32,
      "bindScore": 14.74,
      "retrievalScore": 18.56,
      "confidence": 5.84,
      "modalityContribution": 22.4,
      "crossModalContribution": 0,
      "overall": 10.5
    }
  },
  {
    "id": "cbs-009",
    "input": {
      "structureFidelity": 0.36,
      "diffractionMatch": 0.42,
      "dosAlignment": 0.34,
      "languageClarity": 0.37,
      "bindCoherence": 0.35,
      "crossModalAgreement": 0.38,
      "retrievalPrecision": 0.37,
      "noiseLevel": 0.26,
      "modalityBias": "balanced",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 35.61,
      "diffractionScore": 38.37,
      "dosScore": 32.88,
      "languageScore": 33.57,
      "bindScore": 44.94,
      "retrievalScore": 43.03,
      "confidence": 16.71,
      "modalityContribution": 35.11,
      "crossModalContribution": 37.1,
      "overall": 36.96
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 4.57,
      "diffractionScore": 23.68,
      "dosScore": 4.8,
      "languageScore": 4.5,
      "bindScore": 20.14,
      "retrievalScore": 24.66,
      "confidence": 6.74,
      "modalityContribution": 29.4,
      "crossModalContribution": 0,
      "overall": 15.52
    }
  },
  {
    "id": "cbs-010",
    "input": {
      "structureFidelity": 0.41,
      "diffractionMatch": 0.38,
      "dosAlignment": 0.39,
      "languageClarity": 0.41,
      "bindCoherence": 0.4,
      "crossModalAgreement": 0.34,
      "retrievalPrecision": 0.41,
      "noiseLevel": 0.26,
      "modalityBias": "structure",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 49.33,
      "diffractionScore": 26.49,
      "dosScore": 26.9,
      "languageScore": 26.31,
      "bindScore": 46.74,
      "retrievalScore": 45.03,
      "confidence": 16.91,
      "modalityContribution": 32.26,
      "crossModalContribution": 35.8,
      "overall": 36.55
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 22.98,
      "diffractionScore": 4.32,
      "dosScore": 4.56,
      "languageScore": 4.27,
      "bindScore": 20.44,
      "retrievalScore": 25.06,
      "confidence": 5.64,
      "modalityContribution": 28.7,
      "crossModalContribution": 0,
      "overall": 15.42
    }
  },
  {
    "id": "cbs-011",
    "input": {
      "structureFidelity": 0.45,
      "diffractionMatch": 0.42,
      "dosAlignment": 0.43,
      "languageClarity": 0.45,
      "bindCoherence": 0.44,
      "crossModalAgreement": 0.38,
      "retrievalPrecision": 0.46,
      "noiseLevel": 0.26,
      "modalityBias": "diffraction",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 31.92,
      "diffractionScore": 49.95,
      "dosScore": 29.66,
      "languageScore": 29.02,
      "bindScore": 51.4,
      "retrievalScore": 49.89,
      "confidence": 17.03,
      "modalityContribution": 35.14,
      "crossModalContribution": 39.8,
      "overall": 39.91
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 4.57,
      "diffractionScore": 23.68,
      "dosScore": 4.8,
      "languageScore": 4.5,
      "bindScore": 21.76,
      "retrievalScore": 26.64,
      "confidence": 4.76,
      "modalityContribution": 29.4,
      "crossModalContribution": 0,
      "overall": 16.17
    }
  },
  {
    "id": "cbs-012",
    "input": {
      "structureFidelity": 0.42,
      "diffractionMatch": 0.46,
      "dosAlignment": 0.42,
      "languageClarity": 0.42,
      "bindCoherence": 0.43,
      "crossModalAgreement": 0.42,
      "retrievalPrecision": 0.42,
      "noiseLevel": 0.23,
      "modalityBias": "dos",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 30.99,
      "diffractionScore": 31.21,
      "dosScore": 50.27,
      "languageScore": 28.15,
      "bindScore": 52.43,
      "retrievalScore": 49.24,
      "confidence": 18.63,
      "modalityContribution": 35.16,
      "crossModalContribution": 42.3,
      "overall": 39.82
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 5.23,
      "diffractionScore": 5.23,
      "dosScore": 23.96,
      "languageScore": 5.1,
      "bindScore": 21.52,
      "retrievalScore": 26.18,
      "confidence": 5.22,
      "modalityContribution": 29.4,
      "crossModalContribution": 0,
      "overall": 15.89
    }
  },
  {
    "id": "cbs-013",
    "input": {
      "structureFidelity": 0.46,
      "diffractionMatch": 0.5,
      "dosAlignment": 0.46,
      "languageClarity": 0.46,
      "bindCoherence": 0.47,
      "crossModalAgreement": 0.46,
      "retrievalPrecision": 0.46,
      "noiseLevel": 0.23,
      "modalityBias": "language",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 33.79,
      "diffractionScore": 33.96,
      "dosScore": 32.33,
      "languageScore": 53.54,
      "bindScore": 56.91,
      "retrievalScore": 53.54,
      "confidence": 19.13,
      "modalityContribution": 38.41,
      "crossModalContribution": 46.3,
      "overall": 42.79
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 6.21,
      "diffractionScore": 6.21,
      "dosScore": 6.35,
      "languageScore": 25.76,
      "bindScore": 23.92,
      "retrievalScore": 28.98,
      "confidence": 5.22,
      "modalityContribution": 32.2,
      "crossModalContribution": 0,
      "overall": 17.64
    }
  },
  {
    "id": "cbs-014",
    "input": {
      "structureFidelity": 0.5,
      "diffractionMatch": 0.53,
      "dosAlignment": 0.5,
      "languageClarity": 0.5,
      "bindCoherence": 0.51,
      "crossModalAgreement": 0.49,
      "retrievalPrecision": 0.51,
      "noiseLevel": 0.23,
      "modalityBias": "balanced",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 50.44,
      "diffractionScore": 51,
      "dosScore": 48.94,
      "languageScore": 47.44,
      "bindScore": 61.16,
      "retrievalScore": 58.09,
      "confidence": 19.15,
      "modalityContribution": 49.46,
      "crossModalContribution": 49.6,
      "overall": 50.64
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 7.92,
      "diffractionScore": 32.04,
      "dosScore": 8.01,
      "languageScore": 7.64,
      "bindScore": 27.76,
      "retrievalScore": 33.44,
      "confidence": 5.66,
      "modalityContribution": 37.1,
      "crossModalContribution": 0,
      "overall": 21.29
    }
  },
  {
    "id": "cbs-015",
    "input": {
      "structureFidelity": 0.55,
      "diffractionMatch": 0.5,
      "dosAlignment": 0.49,
      "languageClarity": 0.55,
      "bindCoherence": 0.5,
      "crossModalAgreement": 0.46,
      "retrievalPrecision": 0.55,
      "noiseLevel": 0.2,
      "modalityBias": "structure",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 66.11,
      "diffractionScore": 35.41,
      "dosScore": 35,
      "languageScore": 35.9,
      "bindScore": 60.8,
      "retrievalScore": 59.72,
      "confidence": 17.08,
      "modalityContribution": 43.11,
      "crossModalContribution": 47.2,
      "overall": 47.84
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 34.1,
      "diffractionScore": 9.07,
      "dosScore": 9.09,
      "languageScore": 8.71,
      "bindScore": 29.8,
      "retrievalScore": 35.7,
      "confidence": 4.8,
      "modalityContribution": 38.5,
      "crossModalContribution": 0,
      "overall": 22.8
    }
  },
  {
    "id": "cbs-016",
    "input": {
      "structureFidelity": 0.51,
      "diffractionMatch": 0.54,
      "dosAlignment": 0.53,
      "languageClarity": 0.51,
      "bindCoherence": 0.54,
      "crossModalAgreement": 0.5,
      "retrievalPrecision": 0.51,
      "noiseLevel": 0.21,
      "modalityBias": "diffraction",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 38.25,
      "diffractionScore": 64.57,
      "dosScore": 37.55,
      "languageScore": 35.23,
      "bindScore": 63.63,
      "retrievalScore": 59.36,
      "confidence": 20.59,
      "modalityContribution": 43.9,
      "crossModalContribution": 51.2,
      "overall": 49.17
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 8.61,
      "diffractionScore": 33.18,
      "dosScore": 8.65,
      "languageScore": 8.27,
      "bindScore": 28.5,
      "retrievalScore": 34.2,
      "confidence": 5.6,
      "modalityContribution": 37.8,
      "crossModalContribution": 0,
      "overall": 21.97
    }
  },
  {
    "id": "cbs-017",
    "input": {
      "structureFidelity": 0.56,
      "diffractionMatch": 0.58,
      "dosAlignment": 0.58,
      "languageClarity": 0.56,
      "bindCoherence": 0.59,
      "crossModalAgreement": 0.54,
      "retrievalPrecision": 0.55,
      "noiseLevel": 0.21,
      "modalityBias": "dos",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 41.74,
      "diffractionScore": 41,
      "dosScore": 69.58,
      "languageScore": 38.62,
      "bindScore": 68.64,
      "retrievalScore": 63.87,
      "confidence": 21.49,
      "modalityContribution": 47.74,
      "crossModalContribution": 55.5,
      "overall": 52.54
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 9.59,
      "diffractionScore": 9.59,
      "dosScore": 35.24,
      "languageScore": 9.2,
      "bindScore": 30.9,
      "retrievalScore": 37,
      "confidence": 5.6,
      "modalityContribution": 40.6,
      "crossModalContribution": 0,
      "overall": 23.23
    }
  },
  {
    "id": "cbs-018",
    "input": {
      "structureFidelity": 0.6,
      "diffractionMatch": 0.61,
      "dosAlignment": 0.56,
      "languageClarity": 0.6,
      "bindCoherence": 0.57,
      "crossModalAgreement": 0.57,
      "retrievalPrecision": 0.6,
      "noiseLevel": 0.18,
      "modalityBias": "language",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 43.46,
      "diffractionScore": 42.27,
      "dosScore": 40.22,
      "languageScore": 69.83,
      "bindScore": 70.35,
      "retrievalScore": 67.74,
      "confidence": 19.17,
      "modalityContribution": 48.95,
      "crossModalContribution": 57,
      "overall": 53.4
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 10.74,
      "diffractionScore": 10.74,
      "dosScore": 10.68,
      "languageScore": 36,
      "bindScore": 33.12,
      "retrievalScore": 39.48,
      "confidence": 4.52,
      "modalityContribution": 42,
      "crossModalContribution": 0,
      "overall": 24.71
    }
  },
  {
    "id": "cbs-019",
    "input": {
      "structureFidelity": 0.64,
      "diffractionMatch": 0.65,
      "dosAlignment": 0.6,
      "languageClarity": 0.64,
      "bindCoherence": 0.61,
      "crossModalAgreement": 0.61,
      "retrievalPrecision": 0.64,
      "noiseLevel": 0.18,
      "modalityBias": "balanced",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 64,
      "diffractionScore": 63.04,
      "dosScore": 59.61,
      "languageScore": 60.72,
      "bindScore": 74.83,
      "retrievalScore": 72.04,
      "confidence": 19.67,
      "modalityContribution": 61.84,
      "crossModalContribution": 61,
      "overall": 62.41
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 11.97,
      "diffractionScore": 41.54,
      "dosScore": 11.87,
      "languageScore": 11.42,
      "bindScore": 35.94,
      "retrievalScore": 42.76,
      "confidence": 4.74,
      "modalityContribution": 45.5,
      "crossModalContribution": 0,
      "overall": 27.67
    }
  },
  {
    "id": "cbs-020",
    "input": {
      "structureFidelity": 0.61,
      "diffractionMatch": 0.62,
      "dosAlignment": 0.65,
      "languageClarity": 0.61,
      "bindCoherence": 0.66,
      "crossModalAgreement": 0.58,
      "retrievalPrecision": 0.6,
      "noiseLevel": 0.18,
      "modalityBias": "structure",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 76.46,
      "diffractionScore": 45.2,
      "dosScore": 46.42,
      "languageScore": 43.18,
      "bindScore": 75.59,
      "retrievalScore": 69.87,
      "confidence": 23,
      "modalityContribution": 52.82,
      "crossModalContribution": 60.4,
      "overall": 58.43
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 38.74,
      "diffractionScore": 10.99,
      "dosScore": 10.92,
      "languageScore": 10.49,
      "bindScore": 33.54,
      "retrievalScore": 39.96,
      "confidence": 4.74,
      "modalityContribution": 42.7,
      "crossModalContribution": 0,
      "overall": 25.81
    }
  },
  {
    "id": "cbs-021",
    "input": {
      "structureFidelity": 0.65,
      "diffractionMatch": 0.65,
      "dosAlignment": 0.63,
      "languageClarity": 0.65,
      "bindCoherence": 0.64,
      "crossModalAgreement": 0.61,
      "retrievalPrecision": 0.65,
      "noiseLevel": 0.15,
      "modalityBias": "diffraction",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 48.12,
      "diffractionScore": 78.5,
      "dosScore": 45.65,
      "languageScore": 44.82,
      "bindScore": 77.29,
      "retrievalScore": 73.74,
      "confidence": 20.67,
      "modalityContribution": 54.27,
      "crossModalContribution": 61.9,
      "overall": 60.03
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 12.63,
      "diffractionScore": 42.2,
      "dosScore": 12.47,
      "languageScore": 12.01,
      "bindScore": 36.6,
      "retrievalScore": 43.4,
      "confidence": 4.1,
      "modalityContribution": 45.5,
      "crossModalContribution": 0,
      "overall": 28.18
    }
  },
  {
    "id": "cbs-022",
    "input": {
      "structureFidelity": 0.7,
      "diffractionMatch": 0.69,
      "dosAlignment": 0.68,
      "languageClarity": 0.69,
      "bindCoherence": 0.69,
      "crossModalAgreement": 0.65,
      "retrievalPrecision": 0.69,
      "noiseLevel": 0.15,
      "modalityBias": "dos",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 51.61,
      "diffractionScore": 49.5,
      "dosScore": 82.6,
      "languageScore": 47.81,
      "bindScore": 82.31,
      "retrievalScore": 78.25,
      "confidence": 21.58,
      "modalityContribution": 57.88,
      "crossModalContribution": 66.2,
      "overall": 63.2
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 13.36,
      "diffractionScore": 13.36,
      "dosScore": 43.24,
      "languageScore": 12.71,
      "bindScore": 38.58,
      "retrievalScore": 45.72,
      "confidence": 3.88,
      "modalityContribution": 47.6,
      "crossModalContribution": 0,
      "overall": 28.94
    }
  },
  {
    "id": "cbs-023",
    "input": {
      "structureFidelity": 0.74,
      "diffractionMatch": 0.73,
      "dosAlignment": 0.72,
      "languageClarity": 0.74,
      "bindCoherence": 0.73,
      "crossModalAgreement": 0.69,
      "retrievalPrecision": 0.73,
      "noiseLevel": 0.15,
      "modalityBias": "language",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 54.41,
      "diffractionScore": 52.26,
      "dosScore": 51.85,
      "languageScore": 87.39,
      "bindScore": 86.79,
      "retrievalScore": 82.55,
      "confidence": 22.08,
      "modalityContribution": 61.48,
      "crossModalContribution": 70.2,
      "overall": 66.06
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 14.83,
      "diffractionScore": 14.83,
      "dosScore": 14.61,
      "languageScore": 45.84,
      "bindScore": 41.82,
      "retrievalScore": 49.48,
      "confidence": 4.32,
      "modalityContribution": 51.8,
      "crossModalContribution": 0,
      "overall": 31.42
    }
  },
  {
    "id": "cbs-024",
    "input": {
      "structureFidelity": 0.71,
      "diffractionMatch": 0.77,
      "dosAlignment": 0.71,
      "languageClarity": 0.7,
      "bindCoherence": 0.72,
      "crossModalAgreement": 0.73,
      "retrievalPrecision": 0.69,
      "noiseLevel": 0.12,
      "modalityBias": "balanced",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 73.16,
      "diffractionScore": 75.56,
      "dosScore": 71.45,
      "languageScore": 69.06,
      "bindScore": 87.82,
      "retrievalScore": 81.9,
      "confidence": 23.68,
      "modalityContribution": 72.31,
      "crossModalContribution": 72.7,
      "overall": 72.73
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 16.22,
      "diffractionScore": 51.26,
      "dosScore": 15.93,
      "languageScore": 15.39,
      "bindScore": 42.84,
      "retrievalScore": 50.46,
      "confidence": 5.44,
      "modalityContribution": 53.9,
      "crossModalContribution": 0,
      "overall": 33.61
    }
  },
  {
    "id": "cbs-025",
    "input": {
      "structureFidelity": 0.75,
      "diffractionMatch": 0.73,
      "dosAlignment": 0.75,
      "languageClarity": 0.74,
      "bindCoherence": 0.76,
      "crossModalAgreement": 0.69,
      "retrievalPrecision": 0.74,
      "noiseLevel": 0.12,
      "modalityBias": "structure",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 93.23,
      "diffractionScore": 53.7,
      "dosScore": 54.52,
      "languageScore": 52.37,
      "bindScore": 89.25,
      "retrievalScore": 84.25,
      "confidence": 23.08,
      "modalityContribution": 63.46,
      "crossModalContribution": 71.1,
      "overall": 69.46
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 49.86,
      "diffractionScore": 15.73,
      "dosScore": 15.45,
      "languageScore": 14.92,
      "bindScore": 42.9,
      "retrievalScore": 50.6,
      "confidence": 3.9,
      "modalityContribution": 52.5,
      "crossModalContribution": 0,
      "overall": 33.19
    }
  },
  {
    "id": "cbs-026",
    "input": {
      "structureFidelity": 0.79,
      "diffractionMatch": 0.77,
      "dosAlignment": 0.79,
      "languageClarity": 0.79,
      "bindCoherence": 0.8,
      "crossModalAgreement": 0.73,
      "retrievalPrecision": 0.78,
      "noiseLevel": 0.12,
      "modalityBias": "diffraction",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 59.07,
      "diffractionScore": 94.4,
      "dosScore": 57.28,
      "languageScore": 55.49,
      "bindScore": 93.73,
      "retrievalScore": 88.55,
      "confidence": 23.58,
      "modalityContribution": 66.56,
      "crossModalContribution": 75.1,
      "overall": 72.83
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 16.22,
      "diffractionScore": 51.26,
      "dosScore": 15.93,
      "languageScore": 15.39,
      "bindScore": 44.46,
      "retrievalScore": 52.44,
      "confidence": 3.46,
      "modalityContribution": 53.9,
      "crossModalContribution": 0,
      "overall": 34.26
    }
  },
  {
    "id": "cbs-027",
    "input": {
      "structureFidelity": 0.84,
      "diffractionMatch": 0.81,
      "dosAlignment": 0.78,
      "languageClarity": 0.83,
      "bindCoherence": 0.79,
      "crossModalAgreement": 0.77,
      "retrievalPrecision": 0.82,
      "noiseLevel": 0.09,
      "modalityBias": "dos",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 61.48,
      "diffractionScore": 58.42,
      "dosScore": 95.63,
      "languageScore": 57.41,
      "bindScore": 96.2,
      "retrievalScore": 92.38,
      "confidence": 22.14,
      "modalityContribution": 68.24,
      "crossModalContribution": 77.6,
      "overall": 74.01
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 17.13,
      "diffractionScore": 17.13,
      "dosScore": 51.24,
      "languageScore": 16.22,
      "bindScore": 46.08,
      "retrievalScore": 54.22,
      "confidence": 2.38,
      "modalityContribution": 54.6,
      "crossModalContribution": 0,
      "overall": 34.57
    }
  },
  {
    "id": "cbs-028",
    "input": {
      "structureFidelity": 0.8,
      "diffractionMatch": 0.85,
      "dosAlignment": 0.82,
      "languageClarity": 0.79,
      "bindCoherence": 0.83,
      "crossModalAgreement": 0.81,
      "retrievalPrecision": 0.78,
      "noiseLevel": 0.09,
      "modalityBias": "language",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 60.93,
      "diffractionScore": 61.17,
      "dosScore": 59.95,
      "languageScore": 95.86,
      "bindScore": 99.24,
      "retrievalScore": 92.2,
      "confidence": 25.68,
      "modalityContribution": 69.48,
      "crossModalContribution": 81.6,
      "overall": 74.87
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 17.37,
      "diffractionScore": 17.37,
      "dosScore": 17,
      "languageScore": 50.34,
      "bindScore": 45.78,
      "retrievalScore": 53.82,
      "confidence": 3.48,
      "modalityContribution": 55.3,
      "crossModalContribution": 0,
      "overall": 34.56
    }
  },
  {
    "id": "cbs-029",
    "input": {
      "structureFidelity": 0.85,
      "diffractionMatch": 0.89,
      "dosAlignment": 0.87,
      "languageClarity": 0.84,
      "bindCoherence": 0.88,
      "crossModalAgreement": 0.85,
      "retrievalPrecision": 0.83,
      "noiseLevel": 0.09,
      "modalityBias": "balanced",
      "profile": "multimodal"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 87.99,
      "diffractionScore": 88.88,
      "dosScore": 87.51,
      "languageScore": 83.61,
      "bindScore": 100,
      "retrievalScore": 97.26,
      "confidence": 21.78,
      "modalityContribution": 87,
      "crossModalContribution": 85.9,
      "overall": 85.31
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 19.83,
      "diffractionScore": 60.32,
      "dosScore": 19.38,
      "languageScore": 18.76,
      "bindScore": 50.88,
      "retrievalScore": 59.72,
      "confidence": 4.58,
      "modalityContribution": 62.3,
      "crossModalContribution": 0,
      "overall": 39.77
    }
  },
  {
    "id": "cbs-030",
    "input": {
      "structureFidelity": 0.89,
      "diffractionMatch": 0.85,
      "dosAlignment": 0.85,
      "languageClarity": 0.88,
      "bindCoherence": 0.86,
      "crossModalAgreement": 0.81,
      "retrievalPrecision": 0.87,
      "noiseLevel": 0.06,
      "modalityBias": "structure",
      "profile": "single"
    },
    "expectedMultimodal": {
      "mode": "multimodal_bind",
      "structureScore": 100,
      "diffractionScore": 62.62,
      "dosScore": 62.62,
      "languageScore": 61.96,
      "bindScore": 100,
      "retrievalScore": 98.38,
      "confidence": 20.5,
      "modalityContribution": 71.8,
      "crossModalContribution": 82.5,
      "overall": 78.24
    },
    "expectedSingle": {
      "mode": "single_modality",
      "structureScore": 60.98,
      "diffractionScore": 20.49,
      "dosScore": 19.98,
      "languageScore": 19.36,
      "bindScore": 52.08,
      "retrievalScore": 61.02,
      "confidence": 3.28,
      "modalityContribution": 62.3,
      "crossModalContribution": 0,
      "overall": 40.5
    }
  }
];
