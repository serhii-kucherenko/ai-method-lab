export type TravelerKind = "compliant" | "baseline";

export type ScoreMode = "rules_prefs" | "prefs_only";

/**
 * Soft-simulation inputs for constrained packing plan quality.
 * Method-lab model only — not a live airline baggage API.
 */
export type PackInput = {
  /** Coverage of hard safety rules (liquids, batteries, prohibited) (0–1). */
  safetyRuleCoverage: number;
  /** Headroom under luggage weight / piece limits (0–1). */
  luggageLimitHeadroom: number;
  /** Satisfaction of item dependency chains (0–1). */
  dependencySatisfaction: number;
  /** Soft preference fit after constraints (0–1). */
  preferenceFit: number;
  /** How strictly hard rules are enforced (0–1). */
  ruleStrictness: number;
  /** Weight given to soft prefs vs constraints (0–1). */
  preferenceWeight: number;
  /** Planned packing items (4–80). */
  itemCount: number;
  /** Risk from liquids / gels volume (0–1, higher = riskier). */
  liquidVolumeRisk: number;
  /** Battery / power-bank policy compliance (0–1). */
  batteryPolicyCompliance: number;
  /** Weather / climate adaptability of packed items (0–1). */
  weatherAdaptability: number;
  /** Trip length in days (1–30). */
  tripDays: number;
  profile: TravelerKind;
};

export type PackQuality = {
  mode: ScoreMode;
  ruleCompliance: number;
  preferenceFit: number;
  luggageFeasibility: number;
  dependencyHealth: number;
  safetyMargin: number;
  auditTrail: number;
  overall: number;
};

export type PackReadiness = {
  rulesReady: boolean;
  preferencesReady: boolean;
  checklistReady: boolean;
  luggageReady: boolean;
  safetyReady: boolean;
  overallReady: boolean;
  ruleGap: number;
  preferenceGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: PackQuality,
  input: PackInput,
): PackReadiness {
  const ruleTarget =
    52 + input.safetyRuleCoverage * 22 + input.ruleStrictness * 14;
  const prefTarget =
    48 + input.preferenceFit * 24 + input.preferenceWeight * 12;
  const ruleGap = round2(ruleTarget - quality.ruleCompliance);
  const preferenceGap = round2(prefTarget - quality.preferenceFit);
  const rulesReady = quality.ruleCompliance >= ruleTarget - 8;
  const preferencesReady = quality.preferenceFit >= prefTarget - 10;
  const checklistReady =
    quality.overall >= 46 + input.preferenceFit * 16;
  const luggageReady =
    quality.luggageFeasibility >=
    48 + input.luggageLimitHeadroom * 22;
  const safetyReady =
    quality.safetyMargin >= 50 + input.batteryPolicyCompliance * 18;
  return {
    rulesReady,
    preferencesReady,
    checklistReady,
    luggageReady,
    safetyReady,
    overallReady:
      rulesReady &&
      preferencesReady &&
      checklistReady &&
      luggageReady &&
      safetyReady,
    ruleGap,
    preferenceGap,
  };
}
