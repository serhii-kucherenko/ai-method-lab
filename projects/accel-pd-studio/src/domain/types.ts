export type AccelPdProfile =
  | "multichannel_pa_transformer"
  | "handcrafted_pa_baseline";

export type ScoreMode = AccelPdProfile;

export type PaBias =
  | "transformer_first"
  | "balanced"
  | "channel_first"
  | "baseline_first";

export type ChannelKind =
  | "wrist"
  | "hip"
  | "ankle"
  | "multi"
  | "custom";

/**
 * Soft-simulation inputs for multi-channel transformer PA representations
 * vs handcrafted PA-feature baselines.
 * Method-lab scoring only — not clinical diagnostic use, not live device
 * write-back, not FDA clearance, not PABformer, not the authors' system.
 */
export type AccelPdInput = {
  /** Soft-sim multi-channel wearable coverage (0–1). */
  channelCoverage: number;
  /** Soft-sim transformer PA representation fidelity (0–1). */
  transformerFidelity: number;
  /** Soft-sim free-living activity grounding quality (0–1). */
  activityGrounding: number;
  /** Soft-sim representation completeness for accel packs (0–1). */
  representationCompleteness: number;
  /** Handcrafted PA-feature baseline confidence — path B fuel (0–1). */
  baselineConfidence: number;
  /** Optimism that transformer packs “just work” without handcrafted baseline (0–1). */
  baselineOptimism: number;
  /** Hardness of the free-living accel signal (0–1). */
  signalHardness: number;
  /** Risk of claiming diagnostic / device write-back / FDA / PABformer (0–1). */
  overclaimRisk: number;
  paBias: PaBias;
  profile: AccelPdProfile;
};

export type AccelPdQuality = {
  mode: ScoreMode;
  channelScore: number;
  fidelityScore: number;
  activityScore: number;
  completenessScore: number;
  baselineScore: number;
  confidence: number;
  transformerContribution: number;
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
  bias: PaBias,
  lane: Exclude<PaBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function signalLoad(
  signalHardness: number,
  activityGrounding: number,
): number {
  return clamp(signalHardness * (1.25 - activityGrounding * 0.5), 0, 1.5);
}
