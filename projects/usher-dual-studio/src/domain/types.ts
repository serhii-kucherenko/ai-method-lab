export type PathwayProfile = "myo7a_gene_supplement" | "myo7b_activation";

export type ScoreMode = PathwayProfile;

export type ScoringBias =
  | "myo7a_first"
  | "balanced"
  | "myo7b_first"
  | "assay_first";

export type AlleleKind =
  | "myo7a_null"
  | "usher1b_panel"
  | "sensory_cohort"
  | "research_panel"
  | "composite_pack"
  | "custom";

export type VectorKind =
  | "myo7a_gene_supplement"
  | "myo7b_activation"
  | "dual_aav_soft_sim"
  | "mixed_vector"
  | "dual_pathway_soft_sim"
  | "custom";

export type AssayKind =
  | "rescue_readout"
  | "activation_readout"
  | "allele_gap"
  | "dual_pathway_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for MYO7A gene supplementation
 * vs Myo7b activation on recorded Usher 1B allele packs.
 * Method-lab scoring only — not wet-lab validation,
 * not IND/NDA readiness, not patient dosing,
 * not clinical gene-therapy advice.
 */
export type UsherDualInput = {
  /** Soft-sim MYO7A supplementation rescue fit (0–1). */
  myo7aRescue: number;
  /** Soft-sim Myo7b activation pathway strength (0–1). */
  myo7bActivation: number;
  /** Soft-sim allele-gap / incomplete coverage penalty driver (0–1). */
  alleleGap: number;
  /** Soft-sim vector delivery fidelity (0–1). */
  vectorDelivery: number;
  /** Soft-sim evidence strength for allele pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim pathway protocol follow-through (0–1). */
  pathwayFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming wet-lab / dosing / IND readiness (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: PathwayProfile;
};

export type UsherDualQuality = {
  mode: ScoreMode;
  myo7aRescueScore: number;
  myo7bActivationScore: number;
  vectorCoverage: number;
  pathwayEfficiency: number;
  alleleGapPenalty: number;
  confidence: number;
  myo7aContribution: number;
  myo7bContribution: number;
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
  bias: ScoringBias,
  lane: Exclude<ScoringBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function pathwayBurden(
  myo7bActivation: number,
  alleleGap: number,
  overclaimRisk: number,
): number {
  return clamp(
    myo7bActivation * 0.35 + alleleGap * 0.25 + overclaimRisk * 0.4 - 0.06,
    0,
    1.5,
  );
}
