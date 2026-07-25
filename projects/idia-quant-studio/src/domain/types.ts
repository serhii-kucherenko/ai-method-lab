export type QuantProfile = "informed_dia_quant" | "naive_dia_baseline";

export type ScoreMode = QuantProfile;

export type QuantBias =
  | "informed_first"
  | "balanced"
  | "target_first"
  | "baseline_first";

export type SpectrumKind =
  | "informed_dia"
  | "naive_dia"
  | "hybrid_window"
  | "regulatory_focus"
  | "custom";

/**
 * Soft-simulation inputs for informed DIA quantification vs
 * naive DIA baselines in single-cell proteomics.
 * Method-lab scoring only — not wet-lab validated proteomics,
 * not live instrument write-back, not the authors' system.
 */
export type QuantInput = {
  /** How well informed windows cover regulatory proteins (0–1). */
  targetCoverage: number;
  /** Quality of informed DIA spectrum windows (0–1). */
  spectrumInformedness: number;
  /** Single-cell abundance detectability (0–1). */
  proteinDetectability: number;
  /** Quantification precision under soft-sim (0–1). */
  quantPrecision: number;
  /** Naive DIA window breadth — path B fuel (0–1). */
  naiveWindowBreadth: number;
  /** Optimism that naive DIA “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of low-abundance regulatory proteins (0–1). */
  abundanceHardness: number;
  /** Risk of claiming wet-lab validated / instrument write-back (0–1). */
  overclaimRisk: number;
  quantBias: QuantBias;
  profile: QuantProfile;
};

export type QuantQuality = {
  mode: ScoreMode;
  coverageScore: number;
  spectrumScore: number;
  detectabilityScore: number;
  precisionIntegrity: number;
  baselineScore: number;
  confidence: number;
  informedContribution: number;
  naiveContribution: number;
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
  bias: QuantBias,
  lane: Exclude<QuantBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function abundanceLoad(
  abundanceHardness: number,
  quantPrecision: number,
): number {
  return clamp(abundanceHardness * (1.25 - quantPrecision * 0.5), 0, 1.5);
}
