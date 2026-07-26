export type PathwayProfile =
  | "cfir_codesign_primary_care"
  | "status_quo_pathway";

export type ScoreMode = PathwayProfile;

export type ImplementationBias =
  | "codesign_first"
  | "balanced"
  | "fidelity_first"
  | "status_quo_first";

export type DistrictKind =
  | "rural_block"
  | "peri_urban"
  | "urban_phc_cluster"
  | "tribal_outreach"
  | "custom";

export type PathwayKind =
  | "cfir_codesign"
  | "imci_status_quo"
  | "hybrid_codesign"
  | "referral_only"
  | "custom";

export type FidelityKind =
  | "caregiver_delay"
  | "antibiotic_timing"
  | "referral_completion"
  | "chw_adherence"
  | "custom";

/**
 * Soft-simulation inputs for CFIR co-designed childhood pneumonia
 * primary care vs status-quo pathway baselines.
 * Method-lab scoring only — not live clinical triage,
 * not EMR write-back, not government program authority.
 */
export type ImplementInput = {
  /** Soft-sim CFIR co-design intensity (0–1). */
  codesignIntensity: number;
  /** Soft-sim community / caregiver engagement (0–1). */
  communityEngagement: number;
  /** Soft-sim caretaker care-seeking delay burden (0–1; higher = worse). */
  caretakerDelay: number;
  /** Soft-sim referral / transfer friction (0–1; higher = worse). */
  referralFriction: number;
  /** Soft-sim status-quo pathway clarity (0–1; higher = better). */
  pathwayClarity: number;
  /** Soft-sim district coverage / facility readiness (0–1). */
  districtCoverage: number;
  /** Soft-sim fidelity / evidence signal (0–1). */
  fidelitySignal: number;
  /** Risk of claiming live triage / EMR / government authority (0–1). */
  overclaimRisk: number;
  implementationBias: ImplementationBias;
  profile: PathwayProfile;
};

export type ImplementQuality = {
  mode: ScoreMode;
  careAccessScore: number;
  fidelityScore: number;
  pathwayCoverage: number;
  costEfficiency: number;
  statusQuoPenalty: number;
  confidence: number;
  codesignContribution: number;
  pathwayContribution: number;
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
  bias: ImplementationBias,
  lane: Exclude<ImplementationBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function careBurden(
  caretakerDelay: number,
  referralFriction: number,
  pathwayClarity: number,
): number {
  return clamp(
    caretakerDelay * 0.4 +
      referralFriction * 0.35 +
      (1 - pathwayClarity) * 0.25 -
      0.06,
    0,
    1.5,
  );
}
