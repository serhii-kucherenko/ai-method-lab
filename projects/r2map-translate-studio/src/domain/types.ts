export type R2Profile =
  | "gan_r2map_translation"
  | "conventional_r2_baseline";

export type ScoreMode = R2Profile;

export type TranslateBias =
  | "gan_first"
  | "balanced"
  | "map_first"
  | "conventional_first";

export type InputKind =
  | "t1w"
  | "t2w"
  | "paired_t1w_t2w"
  | "multi_echo"
  | "custom";

/**
 * Soft-simulation inputs for GAN T1W/T2W→R2map translation vs
 * conventional R2 estimation baselines for Parkinson neuroimaging.
 * Method-lab scoring only — not clinical diagnostic use, not live PACS
 * write-back, not FDA cleared, not the authors' system.
 */
export type R2Input = {
  /** How faithful T1W contrast is for translation (0–1). */
  t1wFidelity: number;
  /** How faithful T2W contrast is for translation (0–1). */
  t2wFidelity: number;
  /** Stability of GAN image-to-image translation (0–1). */
  ganStability: number;
  /** Spatial / quantitative coherence of the R2map (0–1). */
  mapCoherence: number;
  /** Conventional R2 estimation match pass-rate — path B fuel (0–1). */
  conventionalMatchRate: number;
  /** Optimism that dedicated-sequence R2 “just works” (0–1). */
  conventionalOptimism: number;
  /** Translation hardness / anatomy ambiguity (0–1). */
  translationHardness: number;
  /** Risk of claiming clinical / live PACS / FDA use (0–1). */
  overclaimRisk: number;
  translateBias: TranslateBias;
  profile: R2Profile;
};

export type R2Quality = {
  mode: ScoreMode;
  t1wScore: number;
  t2wScore: number;
  ganScore: number;
  mapIntegrity: number;
  conventionalBaselineScore: number;
  confidence: number;
  ganContribution: number;
  conventionalContribution: number;
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
  bias: TranslateBias,
  lane: Exclude<TranslateBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function translationLoad(
  translationHardness: number,
  ganStability: number,
): number {
  return clamp(translationHardness * (1.25 - ganStability * 0.5), 0, 1.5);
}
