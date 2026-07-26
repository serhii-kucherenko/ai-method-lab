export type ScreenProfile =
  | "structure_based_dhodh"
  | "naive_library_baseline";

export type ScoreMode = ScreenProfile;

export type ScoringBias =
  | "structure_first"
  | "balanced"
  | "library_first"
  | "assay_first";

export type ScreenKind =
  | "docking_pharmacophore"
  | "pf_dhodh_pocket"
  | "parasite_selective_panel"
  | "screen_cohort"
  | "composite_pack"
  | "custom";

export type HitKind =
  | "structure_based_dhodh"
  | "naive_library_baseline"
  | "dock_pharmacophore_soft_sim"
  | "mixed_hit"
  | "dual_screen_soft_sim"
  | "custom";

export type AssayKind =
  | "docking_readout"
  | "library_readout"
  | "selectivity_gap"
  | "dual_screen_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for structure-based PfDHODH virtual screening
 * vs naive library baselines on recorded screen packs.
 * Method-lab scoring only — not wet-lab validation,
 * not clinical antimalarial advice, not IND/NDA readiness,
 * not live compound procurement, not authors' brand.
 */
export type DhodhInput = {
  /** Soft-sim structure-based docking / pocket fit (0–1). */
  dockingFit: number;
  /** Soft-sim naive library baseline hit rate (0–1). */
  libraryHitRate: number;
  /** Soft-sim pharmacophore filter match (0–1). */
  pharmacophoreMatch: number;
  /** Soft-sim parasite-selective DHODH preference vs host-like (0–1). */
  parasiteSelectivity: number;
  /** Soft-sim evidence strength for screen pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim screen protocol follow-through (0–1). */
  screenFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming wet-lab / clinical / IND readiness (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: ScreenProfile;
};

export type DhodhQuality = {
  mode: ScoreMode;
  dockingScore: number;
  libraryScore: number;
  pharmacophoreCoverage: number;
  screenEfficiency: number;
  selectivityGap: number;
  confidence: number;
  structureContribution: number;
  libraryContribution: number;
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

export function screenBurden(
  libraryHitRate: number,
  pharmacophoreMatch: number,
  overclaimRisk: number,
): number {
  return clamp(
    libraryHitRate * 0.35 +
      (1 - pharmacophoreMatch) * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
