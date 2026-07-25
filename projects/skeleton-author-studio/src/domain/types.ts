export type AuthorProfile =
  | "scaffolded_authoring"
  | "naive_linear";

export type ScoreMode = AuthorProfile;

export type AuthorBias =
  | "scaffold_strict"
  | "balanced"
  | "label_first"
  | "linear_first";

export type OutcomeLabel =
  | "hold_pack"
  | "review"
  | "lock_soft_sim"
  | "strong_lock";

/**
 * Soft-simulation inputs for scaffolded visual authoring of non-visual
 * data experiences vs naive linear baselines. Method-lab scoring only —
 * not WCAG certified, not live screen-reader OEM.
 */
export type AuthorInput = {
  /** How completely the navigation skeleton covers the experience (0–1). */
  skeletonCoverage: number;
  /** How faithfully scaffolding is encoded for dual-view authoring (0–1). */
  scaffoldFidelity: number;
  /** How well label templates match the skeleton structure (0–1). */
  labelFit: number;
  /** Integrity of the scaffolded navigation path (0–1). */
  navIntegrity: number;
  /** Naive linear dump pass rate proxy — baseline B fuel (0–1). */
  linearPassRate: number;
  /** Optimism that flattening structure still “reads” (0–1). */
  flattenOptimism: number;
  /** Experience hardness / multi-branch load (0–1, higher = harder for A). */
  experienceHardness: number;
  /** Risk of claiming WCAG certification / live screen-reader OEM (0–1). */
  leakageRisk: number;
  authorBias: AuthorBias;
  profile: AuthorProfile;
};

export type AuthorQuality = {
  mode: ScoreMode;
  structureCoverage: number;
  scaffoldDiagnosis: number;
  navigationOptScore: number;
  labelIntegrity: number;
  linearScore: number;
  confidence: number;
  scaffoldContribution: number;
  linearContribution: number;
  overall: number;
};

export type PackReadiness = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackReadiness {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: AuthorBias,
  lane: Exclude<AuthorBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function experienceLoad(
  experienceHardness: number,
  skeletonCoverage: number,
): number {
  return clamp(experienceHardness * (1.25 - skeletonCoverage * 0.5), 0, 1.5);
}
