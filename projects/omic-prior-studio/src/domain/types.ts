export type OmicPriorProfile =
  | "priors_informed_transformer"
  | "priors_free_omics_baseline";

export type ScoreMode = OmicPriorProfile;

export type PriorBias =
  | "priors_first"
  | "balanced"
  | "trait_first"
  | "baseline_first";

export type PriorKind =
  | "pathway_graph"
  | "eqtl_panel"
  | "disease_gwas"
  | "custom";

/**
 * Soft-simulation inputs for priors-informed transformers
 * vs priors-free omics baselines.
 * Method-lab scoring only — not clinical diagnostic use,
 * not live EHR write-back, not FDA clearance, not OmicFormer,
 * not the authors' system.
 */
export type OmicPriorInput = {
  /** Soft-sim statistical prior coverage across omic features (0–1). */
  priorCoverage: number;
  /** Soft-sim transformer fidelity under distribution shift (0–1). */
  transformerFidelity: number;
  /** Soft-sim trait / disease grounding quality (0–1). */
  traitGrounding: number;
  /** Soft-sim omic pack completeness (0–1). */
  packCompleteness: number;
  /** Priors-free baseline confidence — path B fuel (0–1). */
  baselineConfidence: number;
  /** Optimism that raw omics “just work” without priors (0–1). */
  baselineOptimism: number;
  /** Hardness of the trait / disease prediction case (0–1). */
  traitHardness: number;
  /** Risk of claiming diagnostic / EHR / FDA / OmicFormer (0–1). */
  overclaimRisk: number;
  priorBias: PriorBias;
  profile: OmicPriorProfile;
};

export type OmicPriorQuality = {
  mode: ScoreMode;
  priorScore: number;
  fidelityScore: number;
  traitScore: number;
  completenessScore: number;
  baselineScore: number;
  confidence: number;
  priorsContribution: number;
  baselineContribution: number;
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
  bias: PriorBias,
  lane: Exclude<PriorBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function traitLoad(
  traitHardness: number,
  traitGrounding: number,
): number {
  return clamp(traitHardness * (1.25 - traitGrounding * 0.5), 0, 1.5);
}
