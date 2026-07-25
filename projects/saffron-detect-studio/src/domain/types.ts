export type DetectProfile =
  | "cnn_adulteration_detection"
  | "visual_inspection_baseline";

export type ScoreMode = DetectProfile;

export type DetectBias =
  | "cnn_first"
  | "balanced"
  | "stigma_first"
  | "visual_first";

export type ImageKind =
  | "stigma_macro"
  | "stigma_micro"
  | "bulk_tray"
  | "mixed_batch"
  | "custom";

/**
 * Soft-simulation inputs for CNN stigma-image adulteration detection
 * vs visual inspection baselines.
 * Method-lab scoring only — not customs authority, not live supply-chain
 * write-back, not certified lab accreditation, not the authors' system.
 */
export type DetectInput = {
  /** Soft-sim CNN stigma feature clarity (0–1). */
  stigmaClarity: number;
  /** Soft-sim adulterant contrast in the image (0–1). */
  adulterantContrast: number;
  /** Soft-sim CNN model confidence on authenticity (0–1). */
  cnnConfidence: number;
  /** Soft-sim stigma texture integrity (0–1). */
  textureIntegrity: number;
  /** Visual-inspector confidence — path B fuel (0–1). */
  visualConfidence: number;
  /** Optimism that naked-eye inspection “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the adulteration decision (0–1). */
  detectHardness: number;
  /** Risk of claiming customs / lab / supply-chain authority (0–1). */
  overclaimRisk: number;
  detectBias: DetectBias;
  profile: DetectProfile;
};

export type DetectQuality = {
  mode: ScoreMode;
  stigmaScore: number;
  contrastScore: number;
  cnnScore: number;
  textureIntegrity: number;
  visualScore: number;
  confidence: number;
  cnnContribution: number;
  visualContribution: number;
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
  bias: DetectBias,
  lane: Exclude<DetectBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function detectLoad(
  detectHardness: number,
  cnnConfidence: number,
): number {
  return clamp(detectHardness * (1.25 - cnnConfidence * 0.5), 0, 1.5);
}
