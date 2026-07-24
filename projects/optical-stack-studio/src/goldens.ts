import type { OpticalInput, OpticalQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OpticalInput;
  expectedOpenVocab: OpticalQuality;
  expectedCatalogOnly: OpticalQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "oss-001",
    "input": {
      "briefClarity": 0.19,
      "materialDiversity": 0.16,
      "thicknessContinuity": 0.22,
      "stackCoherence": 0.16,
      "spectrumFit": 0.19,
      "angleTolerance": 0.19,
      "absorptionLoss": 0.63,
      "fabricationFeasibility": 0.19,
      "catalogCoverage": 0.18,
      "noiseLevel": 0.63,
      "bandKind": "nir",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 30.57,
      "materialSequenceQuality": 11.49,
      "thicknessPlanQuality": 5.77,
      "spectrumMatch": 4.72,
      "planCoherence": 0,
      "overall": 10.86
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 16.56,
      "materialSequenceQuality": 9.73,
      "thicknessPlanQuality": 0.44,
      "spectrumMatch": 0,
      "planCoherence": 0,
      "overall": 4.56
    }
  },
  {
    "id": "oss-002",
    "input": {
      "briefClarity": 0.23,
      "materialDiversity": 0.2,
      "thicknessContinuity": 0.26,
      "stackCoherence": 0.2,
      "spectrumFit": 0.23,
      "angleTolerance": 0.23,
      "absorptionLoss": 0.63,
      "fabricationFeasibility": 0.23,
      "catalogCoverage": 0.22,
      "noiseLevel": 0.63,
      "bandKind": "uv",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 32.32,
      "materialSequenceQuality": 13.06,
      "thicknessPlanQuality": 8.76,
      "spectrumMatch": 7.46,
      "planCoherence": 0,
      "overall": 12.76
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 17.03,
      "materialSequenceQuality": 10.28,
      "thicknessPlanQuality": 2.55,
      "spectrumMatch": 0,
      "planCoherence": 0,
      "overall": 5.26
    }
  },
  {
    "id": "oss-003",
    "input": {
      "briefClarity": 0.28,
      "materialDiversity": 0.24,
      "thicknessContinuity": 0.24,
      "stackCoherence": 0.24,
      "spectrumFit": 0.28,
      "angleTolerance": 0.28,
      "absorptionLoss": 0.57,
      "fabricationFeasibility": 0.28,
      "catalogCoverage": 0.21,
      "noiseLevel": 0.57,
      "bandKind": "broadband",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 57.88,
      "materialSequenceQuality": 49.34,
      "thicknessPlanQuality": 30.75,
      "spectrumMatch": 43.56,
      "planCoherence": 40.29,
      "overall": 44.35
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 15.81,
      "materialSequenceQuality": 9.09,
      "thicknessPlanQuality": 2.32,
      "spectrumMatch": 0,
      "planCoherence": 0,
      "overall": 4.77
    }
  },
  {
    "id": "oss-004",
    "input": {
      "briefClarity": 0.24,
      "materialDiversity": 0.28,
      "thicknessContinuity": 0.29,
      "stackCoherence": 0.28,
      "spectrumFit": 0.24,
      "angleTolerance": 0.24,
      "absorptionLoss": 0.57,
      "fabricationFeasibility": 0.24,
      "catalogCoverage": 0.25,
      "noiseLevel": 0.57,
      "bandKind": "narrowband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 34.03,
      "materialSequenceQuality": 16.42,
      "thicknessPlanQuality": 12.32,
      "spectrumMatch": 10.18,
      "planCoherence": 0,
      "overall": 15.16
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 17.98,
      "materialSequenceQuality": 9.65,
      "thicknessPlanQuality": 3.84,
      "spectrumMatch": 0,
      "planCoherence": 0,
      "overall": 5.56
    }
  },
  {
    "id": "oss-005",
    "input": {
      "briefClarity": 0.29,
      "materialDiversity": 0.25,
      "thicknessContinuity": 0.33,
      "stackCoherence": 0.25,
      "spectrumFit": 0.28,
      "angleTolerance": 0.28,
      "absorptionLoss": 0.57,
      "fabricationFeasibility": 0.28,
      "catalogCoverage": 0.29,
      "noiseLevel": 0.57,
      "bandKind": "visible",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 37.51,
      "materialSequenceQuality": 16.15,
      "thicknessPlanQuality": 15.42,
      "spectrumMatch": 13.75,
      "planCoherence": 0,
      "overall": 17.2
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 18.31,
      "materialSequenceQuality": 11.78,
      "thicknessPlanQuality": 6.05,
      "spectrumMatch": 0.36,
      "planCoherence": 0,
      "overall": 6.69
    }
  },
  {
    "id": "oss-006",
    "input": {
      "briefClarity": 0.33,
      "materialDiversity": 0.29,
      "thicknessContinuity": 0.31,
      "stackCoherence": 0.29,
      "spectrumFit": 0.32,
      "angleTolerance": 0.33,
      "absorptionLoss": 0.52,
      "fabricationFeasibility": 0.33,
      "catalogCoverage": 0.28,
      "noiseLevel": 0.52,
      "bandKind": "nir",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 61.16,
      "materialSequenceQuality": 51.57,
      "thicknessPlanQuality": 36.87,
      "spectrumMatch": 48.05,
      "planCoherence": 44.26,
      "overall": 48.38
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 17.22,
      "materialSequenceQuality": 10.55,
      "thicknessPlanQuality": 5.8,
      "spectrumMatch": 1.58,
      "planCoherence": 0,
      "overall": 6.47
    }
  },
  {
    "id": "oss-007",
    "input": {
      "briefClarity": 0.37,
      "materialDiversity": 0.32,
      "thicknessContinuity": 0.35,
      "stackCoherence": 0.33,
      "spectrumFit": 0.37,
      "angleTolerance": 0.37,
      "absorptionLoss": 0.52,
      "fabricationFeasibility": 0.37,
      "catalogCoverage": 0.32,
      "noiseLevel": 0.52,
      "bandKind": "uv",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 41.32,
      "materialSequenceQuality": 18.91,
      "thicknessPlanQuality": 19.8,
      "spectrumMatch": 20.27,
      "planCoherence": 4.69,
      "overall": 21.58
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 17.73,
      "materialSequenceQuality": 11.35,
      "thicknessPlanQuality": 7.91,
      "spectrumMatch": 2.96,
      "planCoherence": 0,
      "overall": 7.53
    }
  },
  {
    "id": "oss-008",
    "input": {
      "briefClarity": 0.34,
      "materialDiversity": 0.36,
      "thicknessContinuity": 0.39,
      "stackCoherence": 0.37,
      "spectrumFit": 0.33,
      "angleTolerance": 0.33,
      "absorptionLoss": 0.52,
      "fabricationFeasibility": 0.33,
      "catalogCoverage": 0.36,
      "noiseLevel": 0.52,
      "bandKind": "broadband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 40.86,
      "materialSequenceQuality": 20.75,
      "thicknessPlanQuality": 21.33,
      "spectrumMatch": 18.9,
      "planCoherence": 6.75,
      "overall": 22.29
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 19.71,
      "materialSequenceQuality": 11.92,
      "thicknessPlanQuality": 9.26,
      "spectrumMatch": 2.74,
      "planCoherence": 0,
      "overall": 8.21
    }
  },
  {
    "id": "oss-009",
    "input": {
      "briefClarity": 0.38,
      "materialDiversity": 0.4,
      "thicknessContinuity": 0.38,
      "stackCoherence": 0.41,
      "spectrumFit": 0.37,
      "angleTolerance": 0.38,
      "absorptionLoss": 0.46,
      "fabricationFeasibility": 0.38,
      "catalogCoverage": 0.35,
      "noiseLevel": 0.46,
      "bandKind": "narrowband",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 64.99,
      "materialSequenceQuality": 57.29,
      "thicknessPlanQuality": 43.56,
      "spectrumMatch": 53.14,
      "planCoherence": 51.69,
      "overall": 54.08
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 18.62,
      "materialSequenceQuality": 10.7,
      "thicknessPlanQuality": 9.17,
      "spectrumMatch": 4.05,
      "planCoherence": 0,
      "overall": 8.05
    }
  },
  {
    "id": "oss-010",
    "input": {
      "briefClarity": 0.43,
      "materialDiversity": 0.37,
      "thicknessContinuity": 0.42,
      "stackCoherence": 0.37,
      "spectrumFit": 0.41,
      "angleTolerance": 0.42,
      "absorptionLoss": 0.46,
      "fabricationFeasibility": 0.42,
      "catalogCoverage": 0.39,
      "noiseLevel": 0.46,
      "bandKind": "visible",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 46.68,
      "materialSequenceQuality": 22.15,
      "thicknessPlanQuality": 26.83,
      "spectrumMatch": 26.8,
      "planCoherence": 9.88,
      "overall": 27.05
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 18.97,
      "materialSequenceQuality": 12.81,
      "thicknessPlanQuality": 11.41,
      "spectrumMatch": 5.26,
      "planCoherence": 0,
      "overall": 9.37
    }
  },
  {
    "id": "oss-011",
    "input": {
      "briefClarity": 0.47,
      "materialDiversity": 0.41,
      "thicknessContinuity": 0.46,
      "stackCoherence": 0.41,
      "spectrumFit": 0.46,
      "angleTolerance": 0.46,
      "absorptionLoss": 0.46,
      "fabricationFeasibility": 0.46,
      "catalogCoverage": 0.43,
      "noiseLevel": 0.46,
      "bandKind": "nir",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 48.37,
      "materialSequenceQuality": 23.56,
      "thicknessPlanQuality": 29.48,
      "spectrumMatch": 29.47,
      "planCoherence": 11.74,
      "overall": 29.12
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 19.47,
      "materialSequenceQuality": 13.35,
      "thicknessPlanQuality": 13.5,
      "spectrumMatch": 6.63,
      "planCoherence": 0,
      "overall": 10.36
    }
  },
  {
    "id": "oss-012",
    "input": {
      "briefClarity": 0.44,
      "materialDiversity": 0.45,
      "thicknessContinuity": 0.44,
      "stackCoherence": 0.45,
      "spectrumFit": 0.42,
      "angleTolerance": 0.43,
      "absorptionLoss": 0.4,
      "fabricationFeasibility": 0.43,
      "catalogCoverage": 0.42,
      "noiseLevel": 0.4,
      "bandKind": "uv",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 68.86,
      "materialSequenceQuality": 59.26,
      "thicknessPlanQuality": 48.96,
      "spectrumMatch": 57.91,
      "planCoherence": 54.96,
      "overall": 57.96
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 19.89,
      "materialSequenceQuality": 12.13,
      "thicknessPlanQuality": 12.46,
      "spectrumMatch": 6.54,
      "planCoherence": 0,
      "overall": 9.88
    }
  },
  {
    "id": "oss-013",
    "input": {
      "briefClarity": 0.48,
      "materialDiversity": 0.48,
      "thicknessContinuity": 0.48,
      "stackCoherence": 0.49,
      "spectrumFit": 0.46,
      "angleTolerance": 0.47,
      "absorptionLoss": 0.4,
      "fabricationFeasibility": 0.47,
      "catalogCoverage": 0.46,
      "noiseLevel": 0.4,
      "bandKind": "broadband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 50.02,
      "materialSequenceQuality": 26.73,
      "thicknessPlanQuality": 32.86,
      "spectrumMatch": 32.06,
      "planCoherence": 17.18,
      "overall": 32.27
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 20.38,
      "materialSequenceQuality": 12.94,
      "thicknessPlanQuality": 14.58,
      "spectrumMatch": 7.74,
      "planCoherence": 0,
      "overall": 10.9
    }
  },
  {
    "id": "oss-014",
    "input": {
      "briefClarity": 0.52,
      "materialDiversity": 0.52,
      "thicknessContinuity": 0.53,
      "stackCoherence": 0.53,
      "spectrumFit": 0.51,
      "angleTolerance": 0.51,
      "absorptionLoss": 0.4,
      "fabricationFeasibility": 0.51,
      "catalogCoverage": 0.5,
      "noiseLevel": 0.4,
      "bandKind": "narrowband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 51.61,
      "materialSequenceQuality": 28.09,
      "thicknessPlanQuality": 35.8,
      "spectrumMatch": 34.62,
      "planCoherence": 18.93,
      "overall": 34.33
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 20.87,
      "materialSequenceQuality": 13.51,
      "thicknessPlanQuality": 16.88,
      "spectrumMatch": 9.1,
      "planCoherence": 0,
      "overall": 11.95
    }
  },
  {
    "id": "oss-015",
    "input": {
      "briefClarity": 0.57,
      "materialDiversity": 0.49,
      "thicknessContinuity": 0.51,
      "stackCoherence": 0.5,
      "spectrumFit": 0.55,
      "angleTolerance": 0.56,
      "absorptionLoss": 0.34,
      "fabricationFeasibility": 0.56,
      "catalogCoverage": 0.49,
      "noiseLevel": 0.34,
      "bandKind": "visible",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 81.1,
      "materialSequenceQuality": 64.54,
      "thicknessPlanQuality": 60.25,
      "spectrumMatch": 73.7,
      "planCoherence": 63.79,
      "overall": 68.62
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 19.62,
      "materialSequenceQuality": 13.81,
      "thicknessPlanQuality": 16.66,
      "spectrumMatch": 10.37,
      "planCoherence": 0,
      "overall": 12.06
    }
  },
  {
    "id": "oss-016",
    "input": {
      "briefClarity": 0.53,
      "materialDiversity": 0.53,
      "thicknessContinuity": 0.55,
      "stackCoherence": 0.54,
      "spectrumFit": 0.51,
      "angleTolerance": 0.52,
      "absorptionLoss": 0.35,
      "fabricationFeasibility": 0.52,
      "catalogCoverage": 0.53,
      "noiseLevel": 0.35,
      "bandKind": "nir",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 52.94,
      "materialSequenceQuality": 28.97,
      "thicknessPlanQuality": 38.52,
      "spectrumMatch": 36.87,
      "planCoherence": 21.46,
      "overall": 36.24
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 21.91,
      "materialSequenceQuality": 14.48,
      "thicknessPlanQuality": 18.16,
      "spectrumMatch": 10.26,
      "planCoherence": 0,
      "overall": 12.87
    }
  },
  {
    "id": "oss-017",
    "input": {
      "briefClarity": 0.58,
      "materialDiversity": 0.57,
      "thicknessContinuity": 0.59,
      "stackCoherence": 0.58,
      "spectrumFit": 0.55,
      "angleTolerance": 0.57,
      "absorptionLoss": 0.35,
      "fabricationFeasibility": 0.57,
      "catalogCoverage": 0.58,
      "noiseLevel": 0.35,
      "bandKind": "uv",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 54.63,
      "materialSequenceQuality": 30.23,
      "thicknessPlanQuality": 41.15,
      "spectrumMatch": 39.1,
      "planCoherence": 23.01,
      "overall": 38.13
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 22.5,
      "materialSequenceQuality": 15.39,
      "thicknessPlanQuality": 20.62,
      "spectrumMatch": 11.57,
      "planCoherence": 0,
      "overall": 14.03
    }
  },
  {
    "id": "oss-018",
    "input": {
      "briefClarity": 0.62,
      "materialDiversity": 0.61,
      "thicknessContinuity": 0.58,
      "stackCoherence": 0.62,
      "spectrumFit": 0.6,
      "angleTolerance": 0.61,
      "absorptionLoss": 0.29,
      "fabricationFeasibility": 0.61,
      "catalogCoverage": 0.56,
      "noiseLevel": 0.29,
      "bandKind": "broadband",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 84.79,
      "materialSequenceQuality": 70.73,
      "thicknessPlanQuality": 66.73,
      "spectrumMatch": 78.53,
      "planCoherence": 71.17,
      "overall": 74.29
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 20.92,
      "materialSequenceQuality": 13.65,
      "thicknessPlanQuality": 19.96,
      "spectrumMatch": 12.64,
      "planCoherence": 0,
      "overall": 13.5
    }
  },
  {
    "id": "oss-019",
    "input": {
      "briefClarity": 0.66,
      "materialDiversity": 0.64,
      "thicknessContinuity": 0.62,
      "stackCoherence": 0.66,
      "spectrumFit": 0.64,
      "angleTolerance": 0.65,
      "absorptionLoss": 0.29,
      "fabricationFeasibility": 0.65,
      "catalogCoverage": 0.6,
      "noiseLevel": 0.29,
      "bandKind": "narrowband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 60.52,
      "materialSequenceQuality": 33.99,
      "thicknessPlanQuality": 46.95,
      "spectrumMatch": 47.21,
      "planCoherence": 29.11,
      "overall": 44.01
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 21.4,
      "materialSequenceQuality": 14.45,
      "thicknessPlanQuality": 22.07,
      "spectrumMatch": 13.83,
      "planCoherence": 0,
      "overall": 14.51
    }
  },
  {
    "id": "oss-020",
    "input": {
      "briefClarity": 0.63,
      "materialDiversity": 0.61,
      "thicknessContinuity": 0.66,
      "stackCoherence": 0.62,
      "spectrumFit": 0.6,
      "angleTolerance": 0.62,
      "absorptionLoss": 0.29,
      "fabricationFeasibility": 0.62,
      "catalogCoverage": 0.65,
      "noiseLevel": 0.29,
      "bandKind": "visible",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 60.27,
      "materialSequenceQuality": 33.63,
      "thicknessPlanQuality": 49.01,
      "spectrumMatch": 46.9,
      "planCoherence": 29.14,
      "overall": 44.28
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 24.15,
      "materialSequenceQuality": 17.25,
      "thicknessPlanQuality": 24.3,
      "spectrumMatch": 14.32,
      "planCoherence": 0,
      "overall": 16.16
    }
  },
  {
    "id": "oss-021",
    "input": {
      "briefClarity": 0.67,
      "materialDiversity": 0.65,
      "thicknessContinuity": 0.64,
      "stackCoherence": 0.66,
      "spectrumFit": 0.65,
      "angleTolerance": 0.66,
      "absorptionLoss": 0.23,
      "fabricationFeasibility": 0.66,
      "catalogCoverage": 0.63,
      "noiseLevel": 0.23,
      "bandKind": "nir",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 88.07,
      "materialSequenceQuality": 72.14,
      "thicknessPlanQuality": 72.03,
      "spectrumMatch": 83.02,
      "planCoherence": 74.17,
      "overall": 77.8
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 22.52,
      "materialSequenceQuality": 15.42,
      "thicknessPlanQuality": 23.37,
      "spectrumMatch": 15.35,
      "planCoherence": 0,
      "overall": 15.53
    }
  },
  {
    "id": "oss-022",
    "input": {
      "briefClarity": 0.72,
      "materialDiversity": 0.69,
      "thicknessContinuity": 0.68,
      "stackCoherence": 0.7,
      "spectrumFit": 0.69,
      "angleTolerance": 0.7,
      "absorptionLoss": 0.23,
      "fabricationFeasibility": 0.7,
      "catalogCoverage": 0.67,
      "noiseLevel": 0.23,
      "bandKind": "uv",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 63.7,
      "materialSequenceQuality": 36.02,
      "thicknessPlanQuality": 52.07,
      "spectrumMatch": 51.95,
      "planCoherence": 32.98,
      "overall": 47.79
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 22.71,
      "materialSequenceQuality": 15.91,
      "thicknessPlanQuality": 25.39,
      "spectrumMatch": 16.36,
      "planCoherence": 0,
      "overall": 16.37
    }
  },
  {
    "id": "oss-023",
    "input": {
      "briefClarity": 0.76,
      "materialDiversity": 0.73,
      "thicknessContinuity": 0.73,
      "stackCoherence": 0.74,
      "spectrumFit": 0.73,
      "angleTolerance": 0.75,
      "absorptionLoss": 0.23,
      "fabricationFeasibility": 0.75,
      "catalogCoverage": 0.72,
      "noiseLevel": 0.23,
      "bandKind": "broadband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 67.99,
      "materialSequenceQuality": 39.01,
      "thicknessPlanQuality": 57.53,
      "spectrumMatch": 57.41,
      "planCoherence": 36.97,
      "overall": 52.23
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 23.56,
      "materialSequenceQuality": 16.89,
      "thicknessPlanQuality": 28.11,
      "spectrumMatch": 17.82,
      "planCoherence": 0,
      "overall": 17.68
    }
  },
  {
    "id": "oss-024",
    "input": {
      "briefClarity": 0.73,
      "materialDiversity": 0.77,
      "thicknessContinuity": 0.71,
      "stackCoherence": 0.78,
      "spectrumFit": 0.69,
      "angleTolerance": 0.71,
      "absorptionLoss": 0.17,
      "fabricationFeasibility": 0.71,
      "catalogCoverage": 0.7,
      "noiseLevel": 0.17,
      "bandKind": "narrowband",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 91.93,
      "materialSequenceQuality": 78.15,
      "thicknessPlanQuality": 78.38,
      "spectrumMatch": 87.31,
      "planCoherence": 81.3,
      "overall": 83.29
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 23.55,
      "materialSequenceQuality": 15.21,
      "thicknessPlanQuality": 26.6,
      "spectrumMatch": 17.4,
      "planCoherence": 0,
      "overall": 16.86
    }
  },
  {
    "id": "oss-025",
    "input": {
      "briefClarity": 0.77,
      "materialDiversity": 0.73,
      "thicknessContinuity": 0.75,
      "stackCoherence": 0.75,
      "spectrumFit": 0.74,
      "angleTolerance": 0.75,
      "absorptionLoss": 0.17,
      "fabricationFeasibility": 0.75,
      "catalogCoverage": 0.74,
      "noiseLevel": 0.17,
      "bandKind": "visible",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 69.7,
      "materialSequenceQuality": 39.71,
      "thicknessPlanQuality": 60.44,
      "spectrumMatch": 60.4,
      "planCoherence": 39.97,
      "overall": 54.45
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 24.35,
      "materialSequenceQuality": 17.78,
      "thicknessPlanQuality": 29.08,
      "spectrumMatch": 19.12,
      "planCoherence": 0,
      "overall": 18.51
    }
  },
  {
    "id": "oss-026",
    "input": {
      "briefClarity": 0.81,
      "materialDiversity": 0.77,
      "thicknessContinuity": 0.79,
      "stackCoherence": 0.79,
      "spectrumFit": 0.78,
      "angleTolerance": 0.8,
      "absorptionLoss": 0.18,
      "fabricationFeasibility": 0.8,
      "catalogCoverage": 0.79,
      "noiseLevel": 0.18,
      "bandKind": "nir",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 70.69,
      "materialSequenceQuality": 40.78,
      "thicknessPlanQuality": 62.51,
      "spectrumMatch": 61.83,
      "planCoherence": 40.81,
      "overall": 55.76
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 25.19,
      "materialSequenceQuality": 18.75,
      "thicknessPlanQuality": 31.61,
      "spectrumMatch": 20.46,
      "planCoherence": 0,
      "overall": 19.74
    }
  },
  {
    "id": "oss-027",
    "input": {
      "briefClarity": 0.86,
      "materialDiversity": 0.81,
      "thicknessContinuity": 0.77,
      "stackCoherence": 0.83,
      "spectrumFit": 0.82,
      "angleTolerance": 0.84,
      "absorptionLoss": 0.12,
      "fabricationFeasibility": 0.84,
      "catalogCoverage": 0.77,
      "noiseLevel": 0.12,
      "bandKind": "uv",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 100,
      "materialSequenceQuality": 80.13,
      "thicknessPlanQuality": 85.99,
      "spectrumMatch": 97.88,
      "planCoherence": 85.09,
      "overall": 89.74
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 23.15,
      "materialSequenceQuality": 16.77,
      "thicknessPlanQuality": 30.47,
      "spectrumMatch": 20.97,
      "planCoherence": 0,
      "overall": 18.86
    }
  },
  {
    "id": "oss-028",
    "input": {
      "briefClarity": 0.82,
      "materialDiversity": 0.85,
      "thicknessContinuity": 0.82,
      "stackCoherence": 0.87,
      "spectrumFit": 0.78,
      "angleTolerance": 0.8,
      "absorptionLoss": 0.12,
      "fabricationFeasibility": 0.8,
      "catalogCoverage": 0.81,
      "noiseLevel": 0.12,
      "bandKind": "broadband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 72.6,
      "materialSequenceQuality": 44.44,
      "thicknessPlanQuality": 66.37,
      "spectrumMatch": 64.68,
      "planCoherence": 46.74,
      "overall": 59.31
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 25.62,
      "materialSequenceQuality": 17.62,
      "thicknessPlanQuality": 32.37,
      "spectrumMatch": 21.18,
      "planCoherence": 0,
      "overall": 19.89
    }
  },
  {
    "id": "oss-029",
    "input": {
      "briefClarity": 0.87,
      "materialDiversity": 0.89,
      "thicknessContinuity": 0.86,
      "stackCoherence": 0.91,
      "spectrumFit": 0.83,
      "angleTolerance": 0.85,
      "absorptionLoss": 0.12,
      "fabricationFeasibility": 0.85,
      "catalogCoverage": 0.86,
      "noiseLevel": 0.12,
      "bandKind": "narrowband",
      "plan": "catalog_only"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 74.14,
      "materialSequenceQuality": 45.43,
      "thicknessPlanQuality": 68.51,
      "spectrumMatch": 66.66,
      "planCoherence": 47.68,
      "overall": 60.86
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 26.25,
      "materialSequenceQuality": 18.53,
      "thicknessPlanQuality": 34.83,
      "spectrumMatch": 22.7,
      "planCoherence": 0,
      "overall": 21.1
    }
  },
  {
    "id": "oss-030",
    "input": {
      "briefClarity": 0.91,
      "materialDiversity": 0.85,
      "thicknessContinuity": 0.84,
      "stackCoherence": 0.87,
      "spectrumFit": 0.87,
      "angleTolerance": 0.89,
      "absorptionLoss": 0.06,
      "fabricationFeasibility": 0.89,
      "catalogCoverage": 0.84,
      "noiseLevel": 0.06,
      "bandKind": "visible",
      "plan": "open_vocab"
    },
    "expectedOpenVocab": {
      "mode": "open_vocab",
      "briefFidelity": 100,
      "materialSequenceQuality": 85.47,
      "thicknessPlanQuality": 95.95,
      "spectrumMatch": 100,
      "planCoherence": 94.42,
      "overall": 95.02
    },
    "expectedCatalogOnly": {
      "mode": "catalog_only",
      "briefFidelity": 24.8,
      "materialSequenceQuality": 18.62,
      "thicknessPlanQuality": 34.17,
      "spectrumMatch": 23.75,
      "planCoherence": 0,
      "overall": 20.99
    }
  }
];
