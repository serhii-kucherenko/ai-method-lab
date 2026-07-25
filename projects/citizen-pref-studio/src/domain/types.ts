export type CitizenPrefProfile =
  | "safety_first_public_oversight"
  | "innovation_first_self_regulation";

export type ScoreMode = CitizenPrefProfile;

export type PrefBias =
  | "safety_first"
  | "balanced"
  | "oversight_first"
  | "innovation_first";

export type OptionKind =
  | "safety_standard"
  | "public_oversight"
  | "international_coord"
  | "self_regulation"
  | "custom";

export type CountryRegion =
  | "north_america"
  | "europe"
  | "asia_pacific"
  | "latin_america"
  | "multi_country"
  | "custom";

export type SurveyMode =
  | "conjoint"
  | "ranking"
  | "likert_batch"
  | "hybrid"
  | "custom";

/**
 * Soft-simulation inputs for citizen preference / regulatory option packs
 * vs innovation-first self-regulation baselines.
 * Method-lab scoring only — not live regulatory authority, not government
 * deployment, not certified public-opinion polling, not authors’ survey brand.
 */
export type CitizenPrefInput = {
  /** Soft-sim citizen safety preference strength (0–1). */
  safetyPreference: number;
  /** Soft-sim public oversight support (0–1). */
  oversightSupport: number;
  /** Soft-sim international coordination preference (0–1). */
  coordinationPreference: number;
  /** Soft-sim policy pack readiness for lock (0–1). */
  packReadiness: number;
  /** Innovation-first self-regulation adherence — path B fuel (0–1). */
  innovationAdherence: number;
  /** Survey / conjoint noise hardness (0–1). */
  surveyNoise: number;
  /** Innovation tunnel vision when teams ignore public prefs (0–1). */
  innovationTunnel: number;
  /** Risk of claiming live authority / polling certification (0–1). */
  overclaimRisk: number;
  prefBias: PrefBias;
  profile: CitizenPrefProfile;
};

export type CitizenPrefQuality = {
  mode: ScoreMode;
  safetyScore: number;
  oversightScore: number;
  coordinationScore: number;
  readinessScore: number;
  innovationScore: number;
  confidence: number;
  safetyOversightContribution: number;
  innovationSelfContribution: number;
  overall: number;
};

export type PackLockState = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackLockState {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: PrefBias,
  lane: Exclude<PrefBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function surveyLoad(surveyNoise: number, safetyPreference: number): number {
  return clamp(surveyNoise * (1.25 - safetyPreference * 0.5), 0, 1.5);
}
