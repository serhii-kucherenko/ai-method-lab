export type GrowthProfile =
  | "antibiotic_treated_shigella"
  | "untreated_diarrhea_growth";

export type ScoreMode = GrowthProfile;

export type TreatmentBias =
  | "antibiotic_first"
  | "balanced"
  | "growth_first"
  | "untreated_first";

export type CohortKind =
  | "infant_under_12m"
  | "toddler_12_24m"
  | "preschool_24_59m"
  | "mixed_under_5"
  | "custom";

export type EpisodeKind =
  | "culture_confirmed_shigella"
  | "pcr_confirmed_shigella"
  | "clinical_diarrhea"
  | "bloody_diarrhea"
  | "custom";

export type GrowthAssayKind =
  | "haz_delta"
  | "linear_growth_velocity"
  | "wasting_risk"
  | "catchup_potential"
  | "custom";

/**
 * Soft-simulation inputs for antibiotic-treated Shigella vs
 * untreated diarrhea linear-growth impact.
 * Method-lab scoring only — not live clinical prescribing,
 * not diagnostic clearance, not national treatment guideline authority.
 */
export type GrowthInput = {
  /** Soft-sim antibiotic coverage / timely treatment (0–1). */
  antibioticCoverage: number;
  /** Soft-sim Shigella confirmation signal (0–1). */
  shigellaConfirmation: number;
  /** Soft-sim diarrhea episode severity burden (0–1; higher = worse). */
  episodeSeverity: number;
  /** Soft-sim untreated diarrhea duration burden (0–1; higher = worse). */
  untreatedDuration: number;
  /** Soft-sim linear growth vulnerability (0–1; higher = worse). */
  growthVulnerability: number;
  /** Soft-sim cohort follow-up completeness (0–1). */
  cohortFollowUp: number;
  /** Soft-sim growth assay / HAZ signal strength (0–1). */
  growthAssaySignal: number;
  /** Risk of claiming live prescribing / guidelines / diagnosis (0–1). */
  overclaimRisk: number;
  treatmentBias: TreatmentBias;
  profile: GrowthProfile;
};

export type GrowthQuality = {
  mode: ScoreMode;
  growthProtectionScore: number;
  episodeControlScore: number;
  assayCoverage: number;
  cohortEfficiency: number;
  untreatedPenalty: number;
  confidence: number;
  antibioticContribution: number;
  untreatedContribution: number;
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
  bias: TreatmentBias,
  lane: Exclude<TreatmentBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function growthBurden(
  episodeSeverity: number,
  untreatedDuration: number,
  growthVulnerability: number,
): number {
  return clamp(
    episodeSeverity * 0.35 +
      untreatedDuration * 0.4 +
      growthVulnerability * 0.25 -
      0.06,
    0,
    1.5,
  );
}
