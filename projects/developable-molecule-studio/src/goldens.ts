import type { MoleculeInput, MoleculeQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MoleculeInput;
  expectedPocketDevelopability: MoleculeQuality;
  expectedAffinityOnly: MoleculeQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "dms-001",
    "input": {
      "pocketFit": 0.19,
      "pocketVolumeMatch": 0.21,
      "hydrophobicityMatch": 0.18,
      "hbondPotential": 0.19,
      "qedScore": 0.16,
      "solubility": 0.19,
      "clearanceRisk": 0.66,
      "toxicityRisk": 0.64,
      "synthesizability": 0.2,
      "lipophilicity": 0.24,
      "family": "protease",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 40.4,
      "developabilityScore": 0.63,
      "affinityScore": 36.25,
      "propertyScore": 7.4,
      "clearanceAvoid": 37.46,
      "overall": 23.66
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 20.14,
      "developabilityScore": 0,
      "affinityScore": 28.03,
      "propertyScore": 0,
      "clearanceAvoid": 16.28,
      "overall": 18.83
    }
  },
  {
    "id": "dms-002",
    "input": {
      "pocketFit": 0.23,
      "pocketVolumeMatch": 0.24,
      "hydrophobicityMatch": 0.22,
      "hbondPotential": 0.23,
      "qedScore": 0.2,
      "solubility": 0.23,
      "clearanceRisk": 0.66,
      "toxicityRisk": 0.64,
      "synthesizability": 0.23,
      "lipophilicity": 0.28,
      "family": "gpcr",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 41.13,
      "developabilityScore": 1.52,
      "affinityScore": 37.09,
      "propertyScore": 9.98,
      "clearanceAvoid": 37.46,
      "overall": 24.64
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 21.54,
      "developabilityScore": 0,
      "affinityScore": 30.24,
      "propertyScore": 0,
      "clearanceAvoid": 16.92,
      "overall": 20.12
    }
  },
  {
    "id": "dms-003",
    "input": {
      "pocketFit": 0.28,
      "pocketVolumeMatch": 0.28,
      "hydrophobicityMatch": 0.21,
      "hbondPotential": 0.27,
      "qedScore": 0.24,
      "solubility": 0.28,
      "clearanceRisk": 0.6,
      "toxicityRisk": 0.64,
      "synthesizability": 0.27,
      "lipophilicity": 0.26,
      "family": "nuclear",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 52.27,
      "developabilityScore": 19.59,
      "affinityScore": 46.45,
      "propertyScore": 17.15,
      "clearanceAvoid": 56.88,
      "overall": 38.1
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 22.8,
      "developabilityScore": 0,
      "affinityScore": 32.28,
      "propertyScore": 0,
      "clearanceAvoid": 21.2,
      "overall": 22.26
    }
  },
  {
    "id": "dms-004",
    "input": {
      "pocketFit": 0.24,
      "pocketVolumeMatch": 0.32,
      "hydrophobicityMatch": 0.25,
      "hbondPotential": 0.24,
      "qedScore": 0.28,
      "solubility": 0.24,
      "clearanceRisk": 0.6,
      "toxicityRisk": 0.56,
      "synthesizability": 0.31,
      "lipophilicity": 0.3,
      "family": "ion_channel",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 45.98,
      "developabilityScore": 7.56,
      "affinityScore": 41.8,
      "propertyScore": 17.73,
      "clearanceAvoid": 42.04,
      "overall": 30.22
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 21.96,
      "developabilityScore": 0,
      "affinityScore": 30.85,
      "propertyScore": 0,
      "clearanceAvoid": 23.12,
      "overall": 22.04
    }
  },
  {
    "id": "dms-005",
    "input": {
      "pocketFit": 0.29,
      "pocketVolumeMatch": 0.28,
      "hydrophobicityMatch": 0.29,
      "hbondPotential": 0.28,
      "qedScore": 0.25,
      "solubility": 0.28,
      "clearanceRisk": 0.6,
      "toxicityRisk": 0.56,
      "synthesizability": 0.35,
      "lipophilicity": 0.34,
      "family": "kinase",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 47.39,
      "developabilityScore": 7.96,
      "affinityScore": 43.25,
      "propertyScore": 18.11,
      "clearanceAvoid": 42.04,
      "overall": 30.92
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 23.67,
      "developabilityScore": 0,
      "affinityScore": 33.55,
      "propertyScore": 0,
      "clearanceAvoid": 23.76,
      "overall": 23.58
    }
  },
  {
    "id": "dms-006",
    "input": {
      "pocketFit": 0.33,
      "pocketVolumeMatch": 0.32,
      "hydrophobicityMatch": 0.28,
      "hbondPotential": 0.32,
      "qedScore": 0.29,
      "solubility": 0.32,
      "clearanceRisk": 0.54,
      "toxicityRisk": 0.57,
      "synthesizability": 0.29,
      "lipophilicity": 0.32,
      "family": "protease",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 57.21,
      "developabilityScore": 26.72,
      "affinityScore": 51.49,
      "propertyScore": 23.1,
      "clearanceAvoid": 61.36,
      "overall": 43.67
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 24.69,
      "developabilityScore": 0,
      "affinityScore": 35.23,
      "propertyScore": 0,
      "clearanceAvoid": 27.56,
      "overall": 25.42
    }
  },
  {
    "id": "dms-007",
    "input": {
      "pocketFit": 0.37,
      "pocketVolumeMatch": 0.36,
      "hydrophobicityMatch": 0.32,
      "hbondPotential": 0.36,
      "qedScore": 0.33,
      "solubility": 0.37,
      "clearanceRisk": 0.54,
      "toxicityRisk": 0.57,
      "synthesizability": 0.33,
      "lipophilicity": 0.36,
      "family": "gpcr",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 49.36,
      "developabilityScore": 13.46,
      "affinityScore": 44.59,
      "propertyScore": 21.13,
      "clearanceAvoid": 45.36,
      "overall": 34.1
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 26.23,
      "developabilityScore": 0,
      "affinityScore": 37.67,
      "propertyScore": 0,
      "clearanceAvoid": 28.36,
      "overall": 26.87
    }
  },
  {
    "id": "dms-008",
    "input": {
      "pocketFit": 0.34,
      "pocketVolumeMatch": 0.39,
      "hydrophobicityMatch": 0.36,
      "hbondPotential": 0.32,
      "qedScore": 0.37,
      "solubility": 0.33,
      "clearanceRisk": 0.54,
      "toxicityRisk": 0.49,
      "synthesizability": 0.37,
      "lipophilicity": 0.4,
      "family": "nuclear",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 49.18,
      "developabilityScore": 16.05,
      "affinityScore": 45.44,
      "propertyScore": 24.65,
      "clearanceAvoid": 46.34,
      "overall": 35.65
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 25.55,
      "developabilityScore": 0,
      "affinityScore": 36.4,
      "propertyScore": 0,
      "clearanceAvoid": 30.28,
      "overall": 26.74
    }
  },
  {
    "id": "dms-009",
    "input": {
      "pocketFit": 0.38,
      "pocketVolumeMatch": 0.43,
      "hydrophobicityMatch": 0.35,
      "hbondPotential": 0.37,
      "qedScore": 0.41,
      "solubility": 0.37,
      "clearanceRisk": 0.48,
      "toxicityRisk": 0.49,
      "synthesizability": 0.4,
      "lipophilicity": 0.38,
      "family": "ion_channel",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 64.13,
      "developabilityScore": 39.92,
      "affinityScore": 58.33,
      "propertyScore": 35.47,
      "clearanceAvoid": 65.94,
      "overall": 52.59
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 26.59,
      "developabilityScore": 0,
      "affinityScore": 38.19,
      "propertyScore": 0,
      "clearanceAvoid": 34.4,
      "overall": 28.71
    }
  },
  {
    "id": "dms-010",
    "input": {
      "pocketFit": 0.43,
      "pocketVolumeMatch": 0.39,
      "hydrophobicityMatch": 0.39,
      "hbondPotential": 0.41,
      "qedScore": 0.37,
      "solubility": 0.41,
      "clearanceRisk": 0.48,
      "toxicityRisk": 0.49,
      "synthesizability": 0.44,
      "lipophilicity": 0.42,
      "family": "kinase",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 56.04,
      "developabilityScore": 21.21,
      "affinityScore": 51.15,
      "propertyScore": 29.1,
      "clearanceAvoid": 49.94,
      "overall": 40.83
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 28.51,
      "developabilityScore": 0,
      "affinityScore": 41.22,
      "propertyScore": 0,
      "clearanceAvoid": 35.04,
      "overall": 30.41
    }
  },
  {
    "id": "dms-011",
    "input": {
      "pocketFit": 0.47,
      "pocketVolumeMatch": 0.43,
      "hydrophobicityMatch": 0.43,
      "hbondPotential": 0.45,
      "qedScore": 0.41,
      "solubility": 0.46,
      "clearanceRisk": 0.48,
      "toxicityRisk": 0.49,
      "synthesizability": 0.48,
      "lipophilicity": 0.46,
      "family": "protease",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 57.45,
      "developabilityScore": 24.4,
      "affinityScore": 52.57,
      "propertyScore": 32.14,
      "clearanceAvoid": 50.12,
      "overall": 42.72
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 30.14,
      "developabilityScore": 0,
      "affinityScore": 43.8,
      "propertyScore": 0,
      "clearanceAvoid": 35.84,
      "overall": 31.93
    }
  },
  {
    "id": "dms-012",
    "input": {
      "pocketFit": 0.44,
      "pocketVolumeMatch": 0.47,
      "hydrophobicityMatch": 0.42,
      "hbondPotential": 0.41,
      "qedScore": 0.45,
      "solubility": 0.42,
      "clearanceRisk": 0.42,
      "toxicityRisk": 0.41,
      "synthesizability": 0.43,
      "lipophilicity": 0.44,
      "family": "gpcr",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 63.23,
      "developabilityScore": 43.05,
      "affinityScore": 58.18,
      "propertyScore": 37.66,
      "clearanceAvoid": 70.52,
      "overall": 54.43
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 28.88,
      "developabilityScore": 0,
      "affinityScore": 41.69,
      "propertyScore": 0,
      "clearanceAvoid": 41.24,
      "overall": 32.28
    }
  },
  {
    "id": "dms-013",
    "input": {
      "pocketFit": 0.48,
      "pocketVolumeMatch": 0.51,
      "hydrophobicityMatch": 0.46,
      "hbondPotential": 0.45,
      "qedScore": 0.49,
      "solubility": 0.46,
      "clearanceRisk": 0.42,
      "toxicityRisk": 0.41,
      "synthesizability": 0.46,
      "lipophilicity": 0.48,
      "family": "nuclear",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 57.57,
      "developabilityScore": 28.96,
      "affinityScore": 53.09,
      "propertyScore": 35.39,
      "clearanceAvoid": 54.52,
      "overall": 45.38
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 30.51,
      "developabilityScore": 0,
      "affinityScore": 44.26,
      "propertyScore": 0,
      "clearanceAvoid": 41.88,
      "overall": 33.75
    }
  },
  {
    "id": "dms-014",
    "input": {
      "pocketFit": 0.52,
      "pocketVolumeMatch": 0.55,
      "hydrophobicityMatch": 0.5,
      "hbondPotential": 0.5,
      "qedScore": 0.53,
      "solubility": 0.51,
      "clearanceRisk": 0.42,
      "toxicityRisk": 0.41,
      "synthesizability": 0.5,
      "lipophilicity": 0.52,
      "family": "ion_channel",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 63.77,
      "developabilityScore": 34.79,
      "affinityScore": 58.82,
      "propertyScore": 41.75,
      "clearanceAvoid": 54.7,
      "overall": 50.25
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 32.21,
      "developabilityScore": 0.63,
      "affinityScore": 47.01,
      "propertyScore": 0.2,
      "clearanceAvoid": 42.68,
      "overall": 35.42
    }
  },
  {
    "id": "dms-015",
    "input": {
      "pocketFit": 0.57,
      "pocketVolumeMatch": 0.51,
      "hydrophobicityMatch": 0.49,
      "hbondPotential": 0.54,
      "qedScore": 0.5,
      "solubility": 0.55,
      "clearanceRisk": 0.36,
      "toxicityRisk": 0.41,
      "synthesizability": 0.54,
      "lipophilicity": 0.5,
      "family": "kinase",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 75.79,
      "developabilityScore": 55.75,
      "affinityScore": 69.17,
      "propertyScore": 48.97,
      "clearanceAvoid": 73.4,
      "overall": 64.62
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 33.63,
      "developabilityScore": 0,
      "affinityScore": 49.35,
      "propertyScore": 0.21,
      "clearanceAvoid": 46.8,
      "overall": 37.62
    }
  },
  {
    "id": "dms-016",
    "input": {
      "pocketFit": 0.53,
      "pocketVolumeMatch": 0.55,
      "hydrophobicityMatch": 0.53,
      "hbondPotential": 0.5,
      "qedScore": 0.54,
      "solubility": 0.51,
      "clearanceRisk": 0.36,
      "toxicityRisk": 0.34,
      "synthesizability": 0.57,
      "lipophilicity": 0.54,
      "family": "protease",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 62.05,
      "developabilityScore": 36.64,
      "affinityScore": 57.67,
      "propertyScore": 42.76,
      "clearanceAvoid": 58.82,
      "overall": 51.13
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 32.59,
      "developabilityScore": 2.43,
      "affinityScore": 47.53,
      "propertyScore": 1.85,
      "clearanceAvoid": 48.4,
      "overall": 37.49
    }
  },
  {
    "id": "dms-017",
    "input": {
      "pocketFit": 0.58,
      "pocketVolumeMatch": 0.58,
      "hydrophobicityMatch": 0.58,
      "hbondPotential": 0.54,
      "qedScore": 0.58,
      "solubility": 0.55,
      "clearanceRisk": 0.36,
      "toxicityRisk": 0.34,
      "synthesizability": 0.61,
      "lipophilicity": 0.58,
      "family": "gpcr",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 62.31,
      "developabilityScore": 38.35,
      "affinityScore": 58.15,
      "propertyScore": 44.28,
      "clearanceAvoid": 58.82,
      "overall": 51.95
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 34.68,
      "developabilityScore": 3.45,
      "affinityScore": 50.79,
      "propertyScore": 2.78,
      "clearanceAvoid": 49.04,
      "overall": 39.49
    }
  },
  {
    "id": "dms-018",
    "input": {
      "pocketFit": 0.62,
      "pocketVolumeMatch": 0.62,
      "hydrophobicityMatch": 0.56,
      "hbondPotential": 0.59,
      "qedScore": 0.62,
      "solubility": 0.6,
      "clearanceRisk": 0.3,
      "toxicityRisk": 0.34,
      "synthesizability": 0.56,
      "lipophilicity": 0.56,
      "family": "nuclear",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 77.29,
      "developabilityScore": 63.46,
      "affinityScore": 71.06,
      "propertyScore": 55.52,
      "clearanceAvoid": 77.88,
      "overall": 69.17
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 35.7,
      "developabilityScore": 1.1,
      "affinityScore": 52.57,
      "propertyScore": 3.52,
      "clearanceAvoid": 53.32,
      "overall": 41.38
    }
  },
  {
    "id": "dms-019",
    "input": {
      "pocketFit": 0.66,
      "pocketVolumeMatch": 0.66,
      "hydrophobicityMatch": 0.6,
      "hbondPotential": 0.63,
      "qedScore": 0.66,
      "solubility": 0.64,
      "clearanceRisk": 0.3,
      "toxicityRisk": 0.34,
      "synthesizability": 0.59,
      "lipophilicity": 0.6,
      "family": "ion_channel",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 72.59,
      "developabilityScore": 48.68,
      "affinityScore": 66.87,
      "propertyScore": 53.33,
      "clearanceAvoid": 61.88,
      "overall": 60.33
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 37.47,
      "developabilityScore": 6.07,
      "affinityScore": 55.39,
      "propertyScore": 4.43,
      "clearanceAvoid": 53.96,
      "overall": 43.47
    }
  },
  {
    "id": "dms-020",
    "input": {
      "pocketFit": 0.63,
      "pocketVolumeMatch": 0.62,
      "hydrophobicityMatch": 0.65,
      "hbondPotential": 0.59,
      "qedScore": 0.62,
      "solubility": 0.6,
      "clearanceRisk": 0.3,
      "toxicityRisk": 0.26,
      "synthesizability": 0.63,
      "lipophilicity": 0.64,
      "family": "kinase",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 69.52,
      "developabilityScore": 46.76,
      "affinityScore": 65.29,
      "propertyScore": 52.1,
      "clearanceAvoid": 63.4,
      "overall": 59.02
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 36.92,
      "developabilityScore": 5.96,
      "affinityScore": 54.32,
      "propertyScore": 5.51,
      "clearanceAvoid": 55.88,
      "overall": 43.54
    }
  },
  {
    "id": "dms-021",
    "input": {
      "pocketFit": 0.67,
      "pocketVolumeMatch": 0.66,
      "hydrophobicityMatch": 0.63,
      "hbondPotential": 0.63,
      "qedScore": 0.66,
      "solubility": 0.65,
      "clearanceRisk": 0.24,
      "toxicityRisk": 0.26,
      "synthesizability": 0.67,
      "lipophilicity": 0.62,
      "family": "protease",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 82.55,
      "developabilityScore": 72.58,
      "affinityScore": 76.55,
      "propertyScore": 63.9,
      "clearanceAvoid": 82.64,
      "overall": 75.86
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 37.93,
      "developabilityScore": 3.9,
      "affinityScore": 56.02,
      "propertyScore": 6.27,
      "clearanceAvoid": 60.16,
      "overall": 45.42
    }
  },
  {
    "id": "dms-022",
    "input": {
      "pocketFit": 0.72,
      "pocketVolumeMatch": 0.7,
      "hydrophobicityMatch": 0.67,
      "hbondPotential": 0.67,
      "qedScore": 0.7,
      "solubility": 0.69,
      "clearanceRisk": 0.24,
      "toxicityRisk": 0.26,
      "synthesizability": 0.71,
      "lipophilicity": 0.66,
      "family": "gpcr",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 70.49,
      "developabilityScore": 51.4,
      "affinityScore": 65.46,
      "propertyScore": 55.21,
      "clearanceAvoid": 66.64,
      "overall": 61.58
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 40.1,
      "developabilityScore": 8.98,
      "affinityScore": 59.41,
      "propertyScore": 7.24,
      "clearanceAvoid": 60.8,
      "overall": 47.82
    }
  },
  {
    "id": "dms-023",
    "input": {
      "pocketFit": 0.76,
      "pocketVolumeMatch": 0.74,
      "hydrophobicityMatch": 0.72,
      "hbondPotential": 0.72,
      "qedScore": 0.74,
      "solubility": 0.73,
      "clearanceRisk": 0.24,
      "toxicityRisk": 0.26,
      "synthesizability": 0.74,
      "lipophilicity": 0.7,
      "family": "nuclear",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 74.57,
      "developabilityScore": 55.74,
      "affinityScore": 69.39,
      "propertyScore": 59.7,
      "clearanceAvoid": 66.64,
      "overall": 64.96
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 42.1,
      "developabilityScore": 10.04,
      "affinityScore": 62.64,
      "propertyScore": 8.23,
      "clearanceAvoid": 61.44,
      "overall": 49.8
    }
  },
  {
    "id": "dms-024",
    "input": {
      "pocketFit": 0.73,
      "pocketVolumeMatch": 0.77,
      "hydrophobicityMatch": 0.7,
      "hbondPotential": 0.68,
      "qedScore": 0.78,
      "solubility": 0.69,
      "clearanceRisk": 0.18,
      "toxicityRisk": 0.18,
      "synthesizability": 0.69,
      "lipophilicity": 0.68,
      "family": "ion_channel",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 90.87,
      "developabilityScore": 85.9,
      "affinityScore": 84.74,
      "propertyScore": 75.56,
      "clearanceAvoid": 87.4,
      "overall": 85.25
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 40.41,
      "developabilityScore": 7.28,
      "affinityScore": 59.84,
      "propertyScore": 9.84,
      "clearanceAvoid": 66.84,
      "overall": 49.74
    }
  },
  {
    "id": "dms-025",
    "input": {
      "pocketFit": 0.77,
      "pocketVolumeMatch": 0.74,
      "hydrophobicityMatch": 0.74,
      "hbondPotential": 0.72,
      "qedScore": 0.75,
      "solubility": 0.74,
      "clearanceRisk": 0.18,
      "toxicityRisk": 0.18,
      "synthesizability": 0.73,
      "lipophilicity": 0.72,
      "family": "kinase",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 78.19,
      "developabilityScore": 60.93,
      "affinityScore": 73.05,
      "propertyScore": 64.02,
      "clearanceAvoid": 71.4,
      "overall": 69.32
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 42.4,
      "developabilityScore": 11.69,
      "affinityScore": 63.04,
      "propertyScore": 10.15,
      "clearanceAvoid": 67.64,
      "overall": 51.95
    }
  },
  {
    "id": "dms-026",
    "input": {
      "pocketFit": 0.81,
      "pocketVolumeMatch": 0.77,
      "hydrophobicityMatch": 0.79,
      "hbondPotential": 0.76,
      "qedScore": 0.79,
      "solubility": 0.78,
      "clearanceRisk": 0.18,
      "toxicityRisk": 0.19,
      "synthesizability": 0.76,
      "lipophilicity": 0.76,
      "family": "protease",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 78.56,
      "developabilityScore": 62.91,
      "affinityScore": 73.67,
      "propertyScore": 65.95,
      "clearanceAvoid": 71.12,
      "overall": 70.26
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 44,
      "developabilityScore": 12.75,
      "affinityScore": 65.68,
      "propertyScore": 10.94,
      "clearanceAvoid": 67.96,
      "overall": 53.53
    }
  },
  {
    "id": "dms-027",
    "input": {
      "pocketFit": 0.86,
      "pocketVolumeMatch": 0.81,
      "hydrophobicityMatch": 0.77,
      "hbondPotential": 0.8,
      "qedScore": 0.83,
      "solubility": 0.82,
      "clearanceRisk": 0.12,
      "toxicityRisk": 0.19,
      "synthesizability": 0.8,
      "lipophilicity": 0.74,
      "family": "gpcr",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 90.03,
      "developabilityScore": 88.42,
      "affinityScore": 83.57,
      "propertyScore": 77.67,
      "clearanceAvoid": 89.64,
      "overall": 86.31
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 44.66,
      "developabilityScore": 10.74,
      "affinityScore": 67,
      "propertyScore": 11.71,
      "clearanceAvoid": 72.08,
      "overall": 55.16
    }
  },
  {
    "id": "dms-028",
    "input": {
      "pocketFit": 0.82,
      "pocketVolumeMatch": 0.85,
      "hydrophobicityMatch": 0.81,
      "hbondPotential": 0.77,
      "qedScore": 0.87,
      "solubility": 0.78,
      "clearanceRisk": 0.12,
      "toxicityRisk": 0.11,
      "synthesizability": 0.84,
      "lipophilicity": 0.78,
      "family": "nuclear",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 77.34,
      "developabilityScore": 67.87,
      "affinityScore": 72.72,
      "propertyScore": 70.31,
      "clearanceAvoid": 75.88,
      "overall": 72.77
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 43.58,
      "developabilityScore": 15.36,
      "affinityScore": 65.13,
      "propertyScore": 13.52,
      "clearanceAvoid": 74,
      "overall": 55.28
    }
  },
  {
    "id": "dms-029",
    "input": {
      "pocketFit": 0.87,
      "pocketVolumeMatch": 0.89,
      "hydrophobicityMatch": 0.86,
      "hbondPotential": 0.81,
      "qedScore": 0.91,
      "solubility": 0.83,
      "clearanceRisk": 0.12,
      "toxicityRisk": 0.11,
      "synthesizability": 0.88,
      "lipophilicity": 0.82,
      "family": "ion_channel",
      "plan": "affinity_only"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 83.56,
      "developabilityScore": 75.85,
      "affinityScore": 78.88,
      "propertyScore": 78.51,
      "clearanceAvoid": 75.88,
      "overall": 78.52
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 45.12,
      "developabilityScore": 16.64,
      "affinityScore": 67.76,
      "propertyScore": 14.68,
      "clearanceAvoid": 74.8,
      "overall": 57.02
    }
  },
  {
    "id": "dms-030",
    "input": {
      "pocketFit": 0.91,
      "pocketVolumeMatch": 0.85,
      "hydrophobicityMatch": 0.84,
      "hbondPotential": 0.85,
      "qedScore": 0.87,
      "solubility": 0.87,
      "clearanceRisk": 0.06,
      "toxicityRisk": 0.11,
      "synthesizability": 0.82,
      "lipophilicity": 0.8,
      "family": "kinase",
      "plan": "pocket_developability"
    },
    "expectedPocketDevelopability": {
      "mode": "pocket_developability",
      "pocketScore": 97.49,
      "developabilityScore": 100,
      "affinityScore": 91.11,
      "propertyScore": 88.04,
      "clearanceAvoid": 94.4,
      "overall": 94.75
    },
    "expectedAffinityOnly": {
      "mode": "affinity_only",
      "pocketScore": 46.04,
      "developabilityScore": 13.44,
      "affinityScore": 69.47,
      "propertyScore": 14.58,
      "clearanceAvoid": 78.92,
      "overall": 58.68
    }
  }
];
