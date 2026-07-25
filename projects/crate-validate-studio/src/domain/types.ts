export type CrateProfile =
  | "arc_structural_semantic_validation"
  | "metadata_only_baseline";

export type ScoreMode = CrateProfile;

export type CrateBias =
  | "structure_first"
  | "balanced"
  | "semantic_first"
  | "metadata_first";

export type RuleKind =
  | "structural"
  | "semantic"
  | "frictionless"
  | "hybrid"
  | "mixed";

/**
 * Soft-simulation inputs for ARC RO-Crate structural+semantic validation
 * vs metadata-only baselines. Method-lab scoring only — not institutional
 * repository write-back, not live ARC farm control, not the authors' system.
 */
export type CrateInput = {
  /** Crate-pack coverage of metadata + payload files (0–1). */
  crateCoverage: number;
  /** Structural RO-Crate / ARC shape fidelity (0–1). */
  structuralFidelity: number;
  /** Semantic annotation / ISA clarity (0–1). */
  semanticClarity: number;
  /** Frictionless-style check stability across packs (0–1). */
  checkStability: number;
  /** Metadata-only pass-rate proxy — path B fuel (0–1). */
  metadataOnlyRate: number;
  /** Optimism that metadata alone “just works” (0–1). */
  metadataOptimism: number;
  /** Broken / mismatched payload hardness (0–1, higher = harder for A). */
  payloadHardness: number;
  /** Risk of claiming institutional repo write-back / live ARC farm (0–1). */
  overclaimRisk: number;
  crateBias: CrateBias;
  profile: CrateProfile;
};

export type CrateQuality = {
  mode: ScoreMode;
  crateCoverageScore: number;
  structuralScore: number;
  semanticScore: number;
  payloadIntegrity: number;
  metadataBaselineScore: number;
  confidence: number;
  structuralSemanticContribution: number;
  metadataContribution: number;
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
  bias: CrateBias,
  lane: Exclude<CrateBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function payloadLoad(
  payloadHardness: number,
  crateCoverage: number,
): number {
  return clamp(payloadHardness * (1.25 - crateCoverage * 0.5), 0, 1.5);
}
