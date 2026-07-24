export type CompileProfile = "full" | "fast";

export type CompileMode = "multi_pass" | "single_pass";

export type ArtifactTier = "mlir" | "optimized_ir" | "binary";

/**
 * Soft-simulation inputs for an MLIR-style compile plan.
 * Not real chip timing — plan quality only.
 */
export type CompileInput = {
  /** Compute-graph complexity (0–1). */
  graphComplexity: number;
  /** How much operator fusion is available (0–1). */
  operatorFusionPotential: number;
  /** How well memory layouts fit the target (0–1). */
  memoryLayoutFit: number;
  /** Quantization / precision headroom (0–1). */
  quantizationHeadroom: number;
  /** Affinity of the model to the chosen accelerator profile (0–1). */
  targetAffinity: number;
  /** Intermediate-representation depth / richness (0–1). */
  irDepth: number;
  /** Fraction of kernels covered by the plan (0–1). */
  kernelCoverage: number;
  /** Planned multi-pass budget (1–12). */
  passBudget: number;
  profile: CompileProfile;
};

export type CompileQuality = {
  mode: CompileMode;
  fusionScore: number;
  memoryScore: number;
  targetFitScore: number;
  passEfficiency: number;
  predictedArtifactTier: ArtifactTier;
  confidence: number;
  fusionContribution: number;
  memoryContribution: number;
  targetContribution: number;
  overall: number;
};

export type PassBreakdown = {
  lower: number;
  fuse: number;
  layout: number;
  emit: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function pickArtifactTier(
  fusion: number,
  memory: number,
  target: number,
): ArtifactTier {
  const mean = (fusion + memory + target) / 3;
  if (mean >= 72 && target >= 68) return "binary";
  if (mean >= 52) return "optimized_ir";
  return "mlir";
}
