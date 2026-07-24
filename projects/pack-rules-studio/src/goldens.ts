import type { PackInput, PackQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PackInput;
  expectedRulesPrefs: PackQuality;
  expectedPrefsOnly: PackQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "prs-001",
    "input": {
      "safetyRuleCoverage": 0.19,
      "luggageLimitHeadroom": 0.17,
      "dependencySatisfaction": 0.15,
      "preferenceFit": 0.18,
      "ruleStrictness": 0.17,
      "preferenceWeight": 0.1,
      "itemCount": 9,
      "liquidVolumeRisk": 0.6,
      "batteryPolicyCompliance": 0.19,
      "weatherAdaptability": 0.13,
      "tripDays": 3,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 13.06,
      "preferenceFit": 10.85,
      "luggageFeasibility": 31.58,
      "dependencyHealth": 14.21,
      "safetyMargin": 23.88,
      "auditTrail": 16.96,
      "overall": 18.34
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 5.68,
      "preferenceFit": 13.63,
      "luggageFeasibility": 13.98,
      "dependencyHealth": 7.19,
      "safetyMargin": 8.33,
      "auditTrail": 0,
      "overall": 9.47
    }
  },
  {
    "id": "prs-002",
    "input": {
      "safetyRuleCoverage": 0.22,
      "luggageLimitHeadroom": 0.21,
      "dependencySatisfaction": 0.19,
      "preferenceFit": 0.22,
      "ruleStrictness": 0.21,
      "preferenceWeight": 0.15,
      "itemCount": 10,
      "liquidVolumeRisk": 0.6,
      "batteryPolicyCompliance": 0.23,
      "weatherAdaptability": 0.17,
      "tripDays": 4,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 16.15,
      "preferenceFit": 14.72,
      "luggageFeasibility": 34.35,
      "dependencyHealth": 17.49,
      "safetyMargin": 26.38,
      "auditTrail": 20.14,
      "overall": 21.44
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 6.64,
      "preferenceFit": 17.85,
      "luggageFeasibility": 14.96,
      "dependencyHealth": 8.89,
      "safetyMargin": 8.97,
      "auditTrail": 0,
      "overall": 11.46
    }
  },
  {
    "id": "prs-003",
    "input": {
      "safetyRuleCoverage": 0.26,
      "luggageLimitHeadroom": 0.26,
      "dependencySatisfaction": 0.18,
      "preferenceFit": 0.25,
      "ruleStrictness": 0.25,
      "preferenceWeight": 0.19,
      "itemCount": 11,
      "liquidVolumeRisk": 0.54,
      "batteryPolicyCompliance": 0.27,
      "weatherAdaptability": 0.21,
      "tripDays": 5,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 21.12,
      "preferenceFit": 19.07,
      "luggageFeasibility": 38.53,
      "dependencyHealth": 19.01,
      "safetyMargin": 32.32,
      "auditTrail": 25.58,
      "overall": 25.93
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 7.58,
      "preferenceFit": 19.48,
      "luggageFeasibility": 15.82,
      "dependencyHealth": 8.86,
      "safetyMargin": 10.09,
      "auditTrail": 0.91,
      "overall": 12.53
    }
  },
  {
    "id": "prs-004",
    "input": {
      "safetyRuleCoverage": 0.3,
      "luggageLimitHeadroom": 0.22,
      "dependencySatisfaction": 0.22,
      "preferenceFit": 0.29,
      "ruleStrictness": 0.23,
      "preferenceWeight": 0.24,
      "itemCount": 12,
      "liquidVolumeRisk": 0.54,
      "batteryPolicyCompliance": 0.25,
      "weatherAdaptability": 0.25,
      "tripDays": 6,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 21.31,
      "preferenceFit": 21.65,
      "luggageFeasibility": 35.62,
      "dependencyHealth": 21.58,
      "safetyMargin": 30.74,
      "auditTrail": 24.64,
      "overall": 25.92
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 7.98,
      "preferenceFit": 25.7,
      "luggageFeasibility": 15.37,
      "dependencyHealth": 10.68,
      "safetyMargin": 10.29,
      "auditTrail": 2.68,
      "overall": 15.1
    }
  },
  {
    "id": "prs-005",
    "input": {
      "safetyRuleCoverage": 0.27,
      "luggageLimitHeadroom": 0.26,
      "dependencySatisfaction": 0.27,
      "preferenceFit": 0.33,
      "ruleStrictness": 0.27,
      "preferenceWeight": 0.18,
      "itemCount": 13,
      "liquidVolumeRisk": 0.54,
      "batteryPolicyCompliance": 0.29,
      "weatherAdaptability": 0.28,
      "tripDays": 7,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 22.01,
      "preferenceFit": 24.08,
      "luggageFeasibility": 38.57,
      "dependencyHealth": 24.21,
      "safetyMargin": 31.92,
      "auditTrail": 26.78,
      "overall": 27.8
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 7.97,
      "preferenceFit": 25.97,
      "luggageFeasibility": 15.43,
      "dependencyHealth": 12.58,
      "safetyMargin": 10.38,
      "auditTrail": 2.91,
      "overall": 15.47
    }
  },
  {
    "id": "prs-006",
    "input": {
      "safetyRuleCoverage": 0.31,
      "luggageLimitHeadroom": 0.31,
      "dependencySatisfaction": 0.25,
      "preferenceFit": 0.28,
      "ruleStrictness": 0.31,
      "preferenceWeight": 0.23,
      "itemCount": 14,
      "liquidVolumeRisk": 0.49,
      "batteryPolicyCompliance": 0.32,
      "weatherAdaptability": 0.32,
      "tripDays": 8,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 26.91,
      "preferenceFit": 25.14,
      "luggageFeasibility": 42.77,
      "dependencyHealth": 24.48,
      "safetyMargin": 37.49,
      "auditTrail": 30.94,
      "overall": 31.31
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 8.77,
      "preferenceFit": 25.86,
      "luggageFeasibility": 16.34,
      "dependencyHealth": 11.03,
      "safetyMargin": 11.19,
      "auditTrail": 3.06,
      "overall": 15.61
    }
  },
  {
    "id": "prs-007",
    "input": {
      "safetyRuleCoverage": 0.34,
      "luggageLimitHeadroom": 0.35,
      "dependencySatisfaction": 0.3,
      "preferenceFit": 0.32,
      "ruleStrictness": 0.35,
      "preferenceWeight": 0.28,
      "itemCount": 15,
      "liquidVolumeRisk": 0.49,
      "batteryPolicyCompliance": 0.36,
      "weatherAdaptability": 0.26,
      "tripDays": 9,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 28.63,
      "preferenceFit": 25.38,
      "luggageFeasibility": 43.68,
      "dependencyHealth": 27.14,
      "safetyMargin": 38.2,
      "auditTrail": 31.28,
      "overall": 32.42
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 9.56,
      "preferenceFit": 29.79,
      "luggageFeasibility": 17.2,
      "dependencyHealth": 12.83,
      "safetyMargin": 11.69,
      "auditTrail": 4.83,
      "overall": 17.67
    }
  },
  {
    "id": "prs-008",
    "input": {
      "safetyRuleCoverage": 0.38,
      "luggageLimitHeadroom": 0.31,
      "dependencySatisfaction": 0.34,
      "preferenceFit": 0.36,
      "ruleStrictness": 0.33,
      "preferenceWeight": 0.32,
      "itemCount": 16,
      "liquidVolumeRisk": 0.49,
      "batteryPolicyCompliance": 0.34,
      "weatherAdaptability": 0.29,
      "tripDays": 10,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 30.04,
      "preferenceFit": 28.67,
      "luggageFeasibility": 42.6,
      "dependencyHealth": 30.62,
      "safetyMargin": 38.16,
      "auditTrail": 33.34,
      "overall": 33.84
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 9.98,
      "preferenceFit": 33.44,
      "luggageFeasibility": 16.74,
      "dependencyHealth": 14.63,
      "safetyMargin": 11.92,
      "auditTrail": 6.46,
      "overall": 19.35
    }
  },
  {
    "id": "prs-009",
    "input": {
      "safetyRuleCoverage": 0.42,
      "luggageLimitHeadroom": 0.36,
      "dependencySatisfaction": 0.33,
      "preferenceFit": 0.4,
      "ruleStrictness": 0.37,
      "preferenceWeight": 0.37,
      "itemCount": 17,
      "liquidVolumeRisk": 0.43,
      "batteryPolicyCompliance": 0.38,
      "weatherAdaptability": 0.33,
      "tripDays": 11,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 35.66,
      "preferenceFit": 34.29,
      "luggageFeasibility": 47.19,
      "dependencyHealth": 32.92,
      "safetyMargin": 44.69,
      "auditTrail": 38.92,
      "overall": 39.01
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 10.68,
      "preferenceFit": 35.67,
      "luggageFeasibility": 17.55,
      "dependencyHealth": 14.63,
      "safetyMargin": 12.79,
      "auditTrail": 8.23,
      "overall": 20.66
    }
  },
  {
    "id": "prs-010",
    "input": {
      "safetyRuleCoverage": 0.39,
      "luggageLimitHeadroom": 0.4,
      "dependencySatisfaction": 0.37,
      "preferenceFit": 0.43,
      "ruleStrictness": 0.4,
      "preferenceWeight": 0.31,
      "itemCount": 18,
      "liquidVolumeRisk": 0.43,
      "batteryPolicyCompliance": 0.42,
      "weatherAdaptability": 0.37,
      "tripDays": 12,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 34.13,
      "preferenceFit": 34.7,
      "luggageFeasibility": 47.71,
      "dependencyHealth": 33.31,
      "safetyMargin": 43.62,
      "auditTrail": 37.54,
      "overall": 38.53
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 10.55,
      "preferenceFit": 37.91,
      "luggageFeasibility": 17.53,
      "dependencyHealth": 15.96,
      "safetyMargin": 12.82,
      "auditTrail": 8.28,
      "overall": 21.57
    }
  },
  {
    "id": "prs-011",
    "input": {
      "safetyRuleCoverage": 0.43,
      "luggageLimitHeadroom": 0.44,
      "dependencySatisfaction": 0.42,
      "preferenceFit": 0.47,
      "ruleStrictness": 0.44,
      "preferenceWeight": 0.36,
      "itemCount": 19,
      "liquidVolumeRisk": 0.43,
      "batteryPolicyCompliance": 0.46,
      "weatherAdaptability": 0.41,
      "tripDays": 13,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 37.74,
      "preferenceFit": 38.57,
      "luggageFeasibility": 50.66,
      "dependencyHealth": 37.34,
      "safetyMargin": 46.34,
      "auditTrail": 41.08,
      "overall": 41.95
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 11.37,
      "preferenceFit": 42.13,
      "luggageFeasibility": 18.31,
      "dependencyHealth": 17.62,
      "safetyMargin": 13.3,
      "auditTrail": 10.05,
      "overall": 23.7
    }
  },
  {
    "id": "prs-012",
    "input": {
      "safetyRuleCoverage": 0.47,
      "luggageLimitHeadroom": 0.41,
      "dependencySatisfaction": 0.4,
      "preferenceFit": 0.42,
      "ruleStrictness": 0.42,
      "preferenceWeight": 0.4,
      "itemCount": 20,
      "liquidVolumeRisk": 0.37,
      "batteryPolicyCompliance": 0.44,
      "weatherAdaptability": 0.45,
      "tripDays": 14,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 41.4,
      "preferenceFit": 39.96,
      "luggageFeasibility": 51.43,
      "dependencyHealth": 38.26,
      "safetyMargin": 50.38,
      "auditTrail": 43.92,
      "overall": 44.35
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 11.58,
      "preferenceFit": 41.68,
      "luggageFeasibility": 17.86,
      "dependencyHealth": 16.32,
      "safetyMargin": 13.82,
      "auditTrail": 10.06,
      "overall": 23.44
    }
  },
  {
    "id": "prs-013",
    "input": {
      "safetyRuleCoverage": 0.5,
      "luggageLimitHeadroom": 0.45,
      "dependencySatisfaction": 0.45,
      "preferenceFit": 0.46,
      "ruleStrictness": 0.46,
      "preferenceWeight": 0.45,
      "itemCount": 21,
      "liquidVolumeRisk": 0.37,
      "batteryPolicyCompliance": 0.47,
      "weatherAdaptability": 0.49,
      "tripDays": 15,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 42.4,
      "preferenceFit": 41.82,
      "luggageFeasibility": 51.93,
      "dependencyHealth": 40.27,
      "safetyMargin": 50.14,
      "auditTrail": 44.26,
      "overall": 45.26
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 12.17,
      "preferenceFit": 47.91,
      "luggageFeasibility": 18.63,
      "dependencyHealth": 17.94,
      "safetyMargin": 14.07,
      "auditTrail": 11.83,
      "overall": 26.18
    }
  },
  {
    "id": "prs-014",
    "input": {
      "safetyRuleCoverage": 0.54,
      "luggageLimitHeadroom": 0.49,
      "dependencySatisfaction": 0.49,
      "preferenceFit": 0.5,
      "ruleStrictness": 0.5,
      "preferenceWeight": 0.5,
      "itemCount": 22,
      "liquidVolumeRisk": 0.37,
      "batteryPolicyCompliance": 0.51,
      "weatherAdaptability": 0.42,
      "tripDays": 16,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 45.9,
      "preferenceFit": 43.16,
      "luggageFeasibility": 54.69,
      "dependencyHealth": 43.75,
      "safetyMargin": 52.86,
      "auditTrail": 47.64,
      "overall": 48.08
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 12.89,
      "preferenceFit": 49.6,
      "luggageFeasibility": 19.37,
      "dependencyHealth": 19.26,
      "safetyMargin": 14.48,
      "auditTrail": 13.6,
      "overall": 27.38
    }
  },
  {
    "id": "prs-015",
    "input": {
      "safetyRuleCoverage": 0.51,
      "luggageLimitHeadroom": 0.54,
      "dependencySatisfaction": 0.48,
      "preferenceFit": 0.54,
      "ruleStrictness": 0.54,
      "preferenceWeight": 0.44,
      "itemCount": 23,
      "liquidVolumeRisk": 0.31,
      "batteryPolicyCompliance": 0.55,
      "weatherAdaptability": 0.46,
      "tripDays": 17,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 49.21,
      "preferenceFit": 48.2,
      "luggageFeasibility": 59.89,
      "dependencyHealth": 45.23,
      "safetyMargin": 58.51,
      "auditTrail": 51.82,
      "overall": 52.3
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 12.47,
      "preferenceFit": 48.1,
      "luggageFeasibility": 19.07,
      "dependencyHealth": 19.13,
      "safetyMargin": 14.57,
      "auditTrail": 13.83,
      "overall": 26.81
    }
  },
  {
    "id": "prs-016",
    "input": {
      "safetyRuleCoverage": 0.55,
      "luggageLimitHeadroom": 0.5,
      "dependencySatisfaction": 0.52,
      "preferenceFit": 0.57,
      "ruleStrictness": 0.52,
      "preferenceWeight": 0.49,
      "itemCount": 24,
      "liquidVolumeRisk": 0.32,
      "batteryPolicyCompliance": 0.53,
      "weatherAdaptability": 0.5,
      "tripDays": 18,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 48.02,
      "preferenceFit": 48.99,
      "luggageFeasibility": 55.96,
      "dependencyHealth": 46.44,
      "safetyMargin": 55.4,
      "auditTrail": 50.74,
      "overall": 50.99
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 12.95,
      "preferenceFit": 54.07,
      "luggageFeasibility": 18.92,
      "dependencyHealth": 20.74,
      "safetyMargin": 14.82,
      "auditTrail": 15.42,
      "overall": 29.3
    }
  },
  {
    "id": "prs-017",
    "input": {
      "safetyRuleCoverage": 0.59,
      "luggageLimitHeadroom": 0.55,
      "dependencySatisfaction": 0.57,
      "preferenceFit": 0.61,
      "ruleStrictness": 0.56,
      "preferenceWeight": 0.53,
      "itemCount": 25,
      "liquidVolumeRisk": 0.32,
      "batteryPolicyCompliance": 0.57,
      "weatherAdaptability": 0.54,
      "tripDays": 19,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 51.63,
      "preferenceFit": 52.75,
      "luggageFeasibility": 59.39,
      "dependencyHealth": 50.47,
      "safetyMargin": 58.12,
      "auditTrail": 54.28,
      "overall": 54.47
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 13.57,
      "preferenceFit": 57.95,
      "luggageFeasibility": 19.68,
      "dependencyHealth": 22.17,
      "safetyMargin": 15.13,
      "auditTrail": 17.05,
      "overall": 31.21
    }
  },
  {
    "id": "prs-018",
    "input": {
      "safetyRuleCoverage": 0.63,
      "luggageLimitHeadroom": 0.59,
      "dependencySatisfaction": 0.55,
      "preferenceFit": 0.56,
      "ruleStrictness": 0.6,
      "preferenceWeight": 0.58,
      "itemCount": 26,
      "liquidVolumeRisk": 0.26,
      "batteryPolicyCompliance": 0.61,
      "weatherAdaptability": 0.57,
      "tripDays": 20,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 58.14,
      "preferenceFit": 54.94,
      "luggageFeasibility": 64.12,
      "dependencyHealth": 52.05,
      "safetyMargin": 65.65,
      "auditTrail": 58.44,
      "overall": 59.2
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 13.9,
      "preferenceFit": 57.61,
      "luggageFeasibility": 20.04,
      "dependencyHealth": 20.44,
      "safetyMargin": 15.6,
      "auditTrail": 17.2,
      "overall": 31.07
    }
  },
  {
    "id": "prs-019",
    "input": {
      "safetyRuleCoverage": 0.66,
      "luggageLimitHeadroom": 0.63,
      "dependencySatisfaction": 0.6,
      "preferenceFit": 0.6,
      "ruleStrictness": 0.64,
      "preferenceWeight": 0.63,
      "itemCount": 27,
      "liquidVolumeRisk": 0.26,
      "batteryPolicyCompliance": 0.64,
      "weatherAdaptability": 0.61,
      "tripDays": 21,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 58.38,
      "preferenceFit": 56.12,
      "luggageFeasibility": 64.02,
      "dependencyHealth": 53.4,
      "safetyMargin": 64.68,
      "auditTrail": 58.78,
      "overall": 59.48
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 14.28,
      "preferenceFit": 63.84,
      "luggageFeasibility": 20.66,
      "dependencyHealth": 21.82,
      "safetyMargin": 15.7,
      "auditTrail": 18.97,
      "overall": 33.72
    }
  },
  {
    "id": "prs-020",
    "input": {
      "safetyRuleCoverage": 0.63,
      "luggageLimitHeadroom": 0.6,
      "dependencySatisfaction": 0.64,
      "preferenceFit": 0.64,
      "ruleStrictness": 0.62,
      "preferenceWeight": 0.57,
      "itemCount": 28,
      "liquidVolumeRisk": 0.26,
      "batteryPolicyCompliance": 0.62,
      "weatherAdaptability": 0.65,
      "tripDays": 2,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 56.88,
      "preferenceFit": 52.54,
      "luggageFeasibility": 55.42,
      "dependencyHealth": 55.48,
      "safetyMargin": 63.1,
      "auditTrail": 49.44,
      "overall": 56.17
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 13.94,
      "preferenceFit": 55.7,
      "luggageFeasibility": 19.8,
      "dependencyHealth": 23.48,
      "safetyMargin": 15.55,
      "auditTrail": 12.2,
      "overall": 30.15
    }
  },
  {
    "id": "prs-021",
    "input": {
      "safetyRuleCoverage": 0.67,
      "luggageLimitHeadroom": 0.64,
      "dependencySatisfaction": 0.63,
      "preferenceFit": 0.68,
      "ruleStrictness": 0.66,
      "preferenceWeight": 0.62,
      "itemCount": 29,
      "liquidVolumeRisk": 0.2,
      "batteryPolicyCompliance": 0.66,
      "weatherAdaptability": 0.58,
      "tripDays": 3,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 63.75,
      "preferenceFit": 56.64,
      "luggageFeasibility": 60.15,
      "dependencyHealth": 59.02,
      "safetyMargin": 70.88,
      "auditTrail": 55.02,
      "overall": 61.79
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 14.18,
      "preferenceFit": 55.4,
      "luggageFeasibility": 20.11,
      "dependencyHealth": 23.26,
      "safetyMargin": 15.91,
      "auditTrail": 13.97,
      "overall": 30.37
    }
  },
  {
    "id": "prs-022",
    "input": {
      "safetyRuleCoverage": 0.71,
      "luggageLimitHeadroom": 0.68,
      "dependencySatisfaction": 0.67,
      "preferenceFit": 0.71,
      "ruleStrictness": 0.69,
      "preferenceWeight": 0.66,
      "itemCount": 30,
      "liquidVolumeRisk": 0.2,
      "batteryPolicyCompliance": 0.7,
      "weatherAdaptability": 0.62,
      "tripDays": 4,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 63.88,
      "preferenceFit": 57.14,
      "luggageFeasibility": 60.05,
      "dependencyHealth": 59.57,
      "safetyMargin": 70.1,
      "auditTrail": 55.04,
      "overall": 61.81
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 14.65,
      "preferenceFit": 61.02,
      "luggageFeasibility": 20.66,
      "dependencyHealth": 24.24,
      "safetyMargin": 16.17,
      "auditTrail": 15.42,
      "overall": 32.74
    }
  },
  {
    "id": "prs-023",
    "input": {
      "safetyRuleCoverage": 0.75,
      "luggageLimitHeadroom": 0.73,
      "dependencySatisfaction": 0.72,
      "preferenceFit": 0.75,
      "ruleStrictness": 0.73,
      "preferenceWeight": 0.71,
      "itemCount": 31,
      "liquidVolumeRisk": 0.2,
      "batteryPolicyCompliance": 0.74,
      "weatherAdaptability": 0.66,
      "tripDays": 5,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 67.49,
      "preferenceFit": 61.01,
      "luggageFeasibility": 63.48,
      "dependencyHealth": 63.6,
      "safetyMargin": 72.82,
      "auditTrail": 58.58,
      "overall": 65.31
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.03,
      "preferenceFit": 65.24,
      "luggageFeasibility": 21.31,
      "dependencyHealth": 25.43,
      "safetyMargin": 16.28,
      "auditTrail": 17.19,
      "overall": 34.69
    }
  },
  {
    "id": "prs-024",
    "input": {
      "safetyRuleCoverage": 0.79,
      "luggageLimitHeadroom": 0.69,
      "dependencySatisfaction": 0.7,
      "preferenceFit": 0.7,
      "ruleStrictness": 0.71,
      "preferenceWeight": 0.75,
      "itemCount": 32,
      "liquidVolumeRisk": 0.14,
      "batteryPolicyCompliance": 0.72,
      "weatherAdaptability": 0.7,
      "tripDays": 6,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 72.55,
      "preferenceFit": 63.47,
      "luggageFeasibility": 64.39,
      "dependencyHealth": 65.83,
      "safetyMargin": 78.18,
      "auditTrail": 61.42,
      "overall": 68.68
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.2,
      "preferenceFit": 64.8,
      "luggageFeasibility": 20.89,
      "dependencyHealth": 24.25,
      "safetyMargin": 16.7,
      "auditTrail": 17.2,
      "overall": 34.43
    }
  },
  {
    "id": "prs-025",
    "input": {
      "safetyRuleCoverage": 0.75,
      "luggageLimitHeadroom": 0.73,
      "dependencySatisfaction": 0.75,
      "preferenceFit": 0.74,
      "ruleStrictness": 0.75,
      "preferenceWeight": 0.7,
      "itemCount": 33,
      "liquidVolumeRisk": 0.14,
      "batteryPolicyCompliance": 0.76,
      "weatherAdaptability": 0.74,
      "tripDays": 7,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 69.32,
      "preferenceFit": 63.16,
      "luggageFeasibility": 64.27,
      "dependencyHealth": 65.13,
      "safetyMargin": 75.42,
      "auditTrail": 60.36,
      "overall": 67.14
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 14.79,
      "preferenceFit": 67.64,
      "luggageFeasibility": 20.62,
      "dependencyHealth": 25.44,
      "safetyMargin": 16.38,
      "auditTrail": 17.57,
      "overall": 35.44
    }
  },
  {
    "id": "prs-026",
    "input": {
      "safetyRuleCoverage": 0.79,
      "luggageLimitHeadroom": 0.78,
      "dependencySatisfaction": 0.79,
      "preferenceFit": 0.78,
      "ruleStrictness": 0.79,
      "preferenceWeight": 0.75,
      "itemCount": 34,
      "liquidVolumeRisk": 0.15,
      "batteryPolicyCompliance": 0.79,
      "weatherAdaptability": 0.78,
      "tripDays": 8,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 72.6,
      "preferenceFit": 67.03,
      "luggageFeasibility": 67.51,
      "dependencyHealth": 68.61,
      "safetyMargin": 77.52,
      "auditTrail": 63.74,
      "overall": 70.32
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.11,
      "preferenceFit": 71.86,
      "luggageFeasibility": 21.27,
      "dependencyHealth": 26.39,
      "safetyMargin": 16.34,
      "auditTrail": 19.34,
      "overall": 37.33
    }
  },
  {
    "id": "prs-027",
    "input": {
      "safetyRuleCoverage": 0.83,
      "luggageLimitHeadroom": 0.82,
      "dependencySatisfaction": 0.78,
      "preferenceFit": 0.82,
      "ruleStrictness": 0.83,
      "preferenceWeight": 0.79,
      "itemCount": 35,
      "liquidVolumeRisk": 0.09,
      "batteryPolicyCompliance": 0.83,
      "weatherAdaptability": 0.81,
      "tripDays": 9,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 80.21,
      "preferenceFit": 74.12,
      "luggageFeasibility": 72.84,
      "dependencyHealth": 72.81,
      "safetyMargin": 86.02,
      "auditTrail": 69.32,
      "overall": 76.97
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.07,
      "preferenceFit": 73.51,
      "luggageFeasibility": 21.3,
      "dependencyHealth": 26.06,
      "safetyMargin": 16.39,
      "auditTrail": 20.97,
      "overall": 38.05
    }
  },
  {
    "id": "prs-028",
    "input": {
      "safetyRuleCoverage": 0.87,
      "luggageLimitHeadroom": 0.78,
      "dependencySatisfaction": 0.82,
      "preferenceFit": 0.86,
      "ruleStrictness": 0.81,
      "preferenceWeight": 0.84,
      "itemCount": 36,
      "liquidVolumeRisk": 0.09,
      "batteryPolicyCompliance": 0.81,
      "weatherAdaptability": 0.75,
      "tripDays": 10,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 77.77,
      "preferenceFit": 71.89,
      "luggageFeasibility": 68.3,
      "dependencyHealth": 72.82,
      "safetyMargin": 81.88,
      "auditTrail": 68.38,
      "overall": 74.39
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.57,
      "preferenceFit": 77.44,
      "luggageFeasibility": 21.37,
      "dependencyHealth": 27.68,
      "safetyMargin": 16.78,
      "auditTrail": 22.74,
      "overall": 39.93
    }
  },
  {
    "id": "prs-029",
    "input": {
      "safetyRuleCoverage": 0.91,
      "luggageLimitHeadroom": 0.83,
      "dependencySatisfaction": 0.87,
      "preferenceFit": 0.89,
      "ruleStrictness": 0.85,
      "preferenceWeight": 0.88,
      "itemCount": 37,
      "liquidVolumeRisk": 0.09,
      "batteryPolicyCompliance": 0.85,
      "weatherAdaptability": 0.79,
      "tripDays": 11,
      "profile": "baseline"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 81.38,
      "preferenceFit": 75.19,
      "luggageFeasibility": 71.72,
      "dependencyHealth": 76.73,
      "safetyMargin": 84.6,
      "auditTrail": 71.78,
      "overall": 77.75
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 15.78,
      "preferenceFit": 81.07,
      "luggageFeasibility": 21.83,
      "dependencyHealth": 28.52,
      "safetyMargin": 16.75,
      "auditTrail": 24.19,
      "overall": 41.52
    }
  },
  {
    "id": "prs-030",
    "input": {
      "safetyRuleCoverage": 0.87,
      "luggageLimitHeadroom": 0.87,
      "dependencySatisfaction": 0.85,
      "preferenceFit": 0.84,
      "ruleStrictness": 0.89,
      "preferenceWeight": 0.83,
      "itemCount": 38,
      "liquidVolumeRisk": 0.03,
      "batteryPolicyCompliance": 0.89,
      "weatherAdaptability": 0.83,
      "tripDays": 12,
      "profile": "compliant"
    },
    "expectedRulesPrefs": {
      "mode": "rules_prefs",
      "ruleCompliance": 85.79,
      "preferenceFit": 77.53,
      "luggageFeasibility": 77.08,
      "dependencyHealth": 77.94,
      "safetyMargin": 91.6,
      "auditTrail": 74.34,
      "overall": 81.83
    },
    "expectedPrefsOnly": {
      "mode": "prefs_only",
      "ruleCompliance": 14.92,
      "preferenceFit": 77.57,
      "luggageFeasibility": 21.08,
      "dependencyHealth": 26.61,
      "safetyMargin": 16.29,
      "auditTrail": 22.94,
      "overall": 39.67
    }
  }
];
