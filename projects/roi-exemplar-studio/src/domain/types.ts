export type ExemplarProfile =
  | "optimized_incontext_exemplars"
  | "naive_exemplar_baseline";

export type ScoreMode = ExemplarProfile;

export type ExemplarBias =
  | "localization_first"
  | "balanced"
  | "coverage_first"
  | "naive_first";

export type RoiKind =
  | "focal"
  | "bounding"
  | "mask"
  | "multi_lesion"
  | "mixed";

/**
 * Soft-simulation inputs for optimized in-context exemplars for ROI
 * selection vs naive exemplar baselines.
 * Method-lab scoring only — not clinical diagnostic use, not live PACS
 * write-back, not the authors' system.
 */
export type ExemplarInput = {
  /** Localization precision of curated exemplars (0–1). */
  localizationPrecision: number;
  /** Coverage breadth across ROI morphologies (0–1). */
  coverageBreadth: number;
  /** Diversity of in-context exemplar set (0–1). */
  exemplarDiversity: number;
  /** Prompt / instruction fit for the VLM ROI task (0–1). */
  promptFit: number;
  /** Naive dump-all exemplar pass-rate proxy — path B fuel (0–1). */
  naiveDumpRate: number;
  /** Optimism that unordered exemplar dumps “just work” (0–1). */
  naiveOptimism: number;
  /** ROI selection hardness / ambiguity (0–1). */
  roiHardness: number;
  /** Risk of claiming clinical diagnostic / live PACS use (0–1). */
  overclaimRisk: number;
  exemplarBias: ExemplarBias;
  profile: ExemplarProfile;
};

export type ExemplarQuality = {
  mode: ScoreMode;
  localizationScore: number;
  coverageScore: number;
  diversityScore: number;
  promptIntegrity: number;
  naiveBaselineScore: number;
  confidence: number;
  optimizedContribution: number;
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
  bias: ExemplarBias,
  lane: Exclude<ExemplarBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function roiLoad(
  roiHardness: number,
  localizationPrecision: number,
): number {
  return clamp(roiHardness * (1.25 - localizationPrecision * 0.5), 0, 1.5);
}
