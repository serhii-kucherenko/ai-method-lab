export type PairedMotionProfile =
  | "distributed_ego_exo_fusion"
  | "ego_only_baseline";

export type ScoreMode = PairedMotionProfile;

export type MotionBias =
  | "fusion_first"
  | "balanced"
  | "exo_first"
  | "ego_first";

export type WearerKind =
  | "hmd_wearer"
  | "body_proxy"
  | "mixed_rig"
  | "custom";

export type ObserverKind =
  | "exo_camera"
  | "room_rig"
  | "multi_view"
  | "custom";

/**
 * Soft-simulation inputs for distributed ego+exo HMD motion capture
 * vs ego-only baselines. Method-lab scoring only — not live HMD fleet
 * control, not production mocap suit replacement, not Meta/Aria
 * deployment, not the EgoExoMoCap brand.
 */
export type PairedMotionInput = {
  /** Soft-sim ego (HMD) coverage of body landmarks (0–1). */
  egoCoverage: number;
  /** Soft-sim exo observer coverage of body landmarks (0–1). */
  exoCoverage: number;
  /** Soft-sim distributed fusion clarity across views (0–1). */
  fusionClarity: number;
  /** Soft-sim capture pack completeness (0–1). */
  packCompleteness: number;
  /** Ego-only adherence strength — path B fuel (0–1). */
  egoOnlyAdherence: number;
  /** Occlusion / out-of-view hardness of the take (0–1). */
  occlusionHardness: number;
  /** World-space drift risk under sparse exo (0–1). */
  driftRisk: number;
  /** Risk of claiming live fleet / production suit / Meta deploy (0–1). */
  overclaimRisk: number;
  motionBias: MotionBias;
  profile: PairedMotionProfile;
};

export type PairedMotionQuality = {
  mode: ScoreMode;
  egoScore: number;
  exoScore: number;
  fusionScore: number;
  completenessScore: number;
  egoOnlyScore: number;
  confidence: number;
  fusionContribution: number;
  egoOnlyContribution: number;
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
  bias: MotionBias,
  lane: Exclude<MotionBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function captureLoad(
  occlusionHardness: number,
  fusionClarity: number,
): number {
  return clamp(occlusionHardness * (1.25 - fusionClarity * 0.5), 0, 1.5);
}
