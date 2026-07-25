export type MolProfile =
  | "sample_efficient"
  | "naive_generative_baseline";

export type ScoreMode = MolProfile;

export type MolBias =
  | "efficiency_strict"
  | "balanced"
  | "optimizer_first"
  | "baseline_first";

export type OutcomeLabel =
  | "hold_pack"
  | "review"
  | "lock_soft_sim"
  | "strong_lock";

/**
 * Soft-simulation inputs for sample-efficient generative optimization
 * vs naive generative baselines. Method-lab scoring only — not wet-lab
 * validated, not live ELN write-back.
 */
export type MolInput = {
  /** How completely the campaign pack covers the design scope (0–1). */
  campaignCoverage: number;
  /** How faithfully property targets are encoded for the optimizer (0–1). */
  targetFidelity: number;
  /** How well candidates match locked property targets (0–1). */
  targetFit: number;
  /** Sample-efficiency of the generative optimizer (0–1). */
  sampleEfficiency: number;
  /** Naive generative baseline yield proxy — baseline B fuel (0–1). */
  naiveYield: number;
  /** Optimism that blind sampling recovers hits without efficiency (0–1). */
  blindOptimism: number;
  /** Design hardness / multi-objective load (0–1, higher = harder for A). */
  designHardness: number;
  /** Risk of leaking wet-lab / live-ELN claims into the score (0–1). */
  leakageRisk: number;
  molBias: MolBias;
  profile: MolProfile;
};

export type MolQuality = {
  mode: ScoreMode;
  hitEnrichment: number;
  efficiencyDiagnosis: number;
  targetOptScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  efficiencyContribution: number;
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
  bias: MolBias,
  lane: Exclude<MolBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function designLoad(
  designHardness: number,
  campaignCoverage: number,
): number {
  return clamp(designHardness * (1.25 - campaignCoverage * 0.5), 0, 1.5);
}
