export type DeltProfile =
  | "iterative_delt_optimize"
  | "single_pass_library_screen";

export type ScoreMode = DeltProfile;

export type DeltBias =
  | "iterative"
  | "balanced"
  | "coverage_first"
  | "hit_first";

export type LibraryKind =
  | "macrocyclic"
  | "linear_peptide"
  | "dna_tagged_small"
  | "mixed_scaffold"
  | "custom";

export type CycleKind =
  | "construct_screen"
  | "enrich_diversify"
  | "hit_narrow"
  | "baseline_pass"
  | "custom";

export type HitFilterKind =
  | "enrichment"
  | "diversity"
  | "off_target"
  | "macrocycle_fit"
  | "custom";

/**
 * Soft-simulation inputs for iterative DELT construct-and-screen
 * vs single-pass library screens.
 * Method-lab scoring only — not wet-lab validated IND/NDA, not live
 * screening robotics, not clinical candidate nomination.
 */
export type DeltInput = {
  /** Soft-sim depth of construct–screen iterations (0–1). */
  cycleDepth: number;
  /** Soft-sim enrichment fold after selection (0–1). */
  enrichmentFold: number;
  /** Soft-sim library diversity retained across cycles (0–1). */
  diversityRetention: number;
  /** Soft-sim hit shortlist precision (0–1). */
  hitPrecision: number;
  /** Classic single-pass coverage — path B fuel (0–1). */
  libraryCoverage: number;
  /** Synthesis / encoding noise hardness (0–1). */
  synthesisNoise: number;
  /** Selection-bias / off-target pull (0–1). */
  selectionBias: number;
  /** Risk of claiming wet-lab IND/NDA / live robotics (0–1). */
  overclaimRisk: number;
  deltBias: DeltBias;
  profile: DeltProfile;
};

export type DeltQuality = {
  mode: ScoreMode;
  cycleScore: number;
  enrichmentScore: number;
  diversityScore: number;
  hitScore: number;
  coverageScore: number;
  confidence: number;
  iterativeContribution: number;
  singlePassContribution: number;
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
  bias: DeltBias,
  lane: Exclude<DeltBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function noiseLoad(synthesisNoise: number, cycleDepth: number): number {
  return clamp(synthesisNoise * (1.25 - cycleDepth * 0.5), 0, 1.5);
}
