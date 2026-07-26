export type RouteProfile =
  | "photocatalytic_aminoaryl"
  | "copper_catalyzed_aminoaryl";

export type ScoreMode = RouteProfile;

export type ScoringBias =
  | "photo_first"
  | "balanced"
  | "copper_first"
  | "assay_first";

export type RouteKind =
  | "aryl_cyclopropane"
  | "diarylpropylamine"
  | "aminoaryl_panel"
  | "route_cohort"
  | "composite_pack"
  | "custom";

export type CatalystKind =
  | "photocatalytic_aminoaryl"
  | "copper_catalyzed_aminoaryl"
  | "photo_copper_soft_sim"
  | "mixed_catalyst"
  | "dual_route_soft_sim"
  | "custom";

export type AssayKind =
  | "photo_readout"
  | "copper_readout"
  | "cyclopropane_strain"
  | "dual_route_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for photocatalytic 1,3-aminoarylation
 * vs copper-catalyzed aminoarylation on recorded route packs.
 * Method-lab scoring only — not wet-lab validation,
 * not scale-up manufacturing control, not regulatory filing,
 * not authors' brand.
 */
export type AminoarylInput = {
  /** Soft-sim photocatalytic aminoarylation yield fit (0–1). */
  photoYield: number;
  /** Soft-sim copper-catalyzed aminoarylation yield (0–1). */
  copperYield: number;
  /** Soft-sim cyclopropane / substrate strain that copper paths may exploit (0–1). */
  cyclopropaneStrain: number;
  /** Soft-sim catalyst fidelity (0–1). */
  catalystFidelity: number;
  /** Soft-sim evidence strength for route pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim route protocol follow-through (0–1). */
  routeFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming wet-lab / manufacturing / regulatory readiness (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: RouteProfile;
};

export type AminoarylQuality = {
  mode: ScoreMode;
  photoYieldScore: number;
  copperYieldScore: number;
  catalystCoverage: number;
  routeEfficiency: number;
  strainPenalty: number;
  confidence: number;
  photoContribution: number;
  copperContribution: number;
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

export function routeBurden(
  copperYield: number,
  cyclopropaneStrain: number,
  overclaimRisk: number,
): number {
  return clamp(
    copperYield * 0.35 + cyclopropaneStrain * 0.25 + overclaimRisk * 0.4 - 0.06,
    0,
    1.5,
  );
}
