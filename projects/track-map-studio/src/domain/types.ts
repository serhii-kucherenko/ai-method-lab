export type TrackMapProfile =
  | "online_deformable_slam"
  | "offline_kinematics_prior_baseline";

export type ScoreMode = TrackMapProfile;

export type TrackBias =
  | "deform_first"
  | "balanced"
  | "pose_first"
  | "kinematics_first";

export type PoseKind =
  | "motion_aware"
  | "stereo_bundle"
  | "tool_tip"
  | "custom";

/**
 * Soft-simulation inputs for online deformable SLAM
 * vs offline kinematics-prior baselines.
 * Method-lab scoring only — not live robot control,
 * not clinical diagnostic use, not FDA clearance,
 * not Track2Map, not the authors' system.
 */
export type TrackMapInput = {
  /** Soft-sim deformable field coverage across the scene (0–1). */
  deformCoverage: number;
  /** Soft-sim online SLAM fidelity under tissue motion (0–1). */
  slamFidelity: number;
  /** Soft-sim pose / motion-aware grounding quality (0–1). */
  poseGrounding: number;
  /** Soft-sim track pack completeness (0–1). */
  packCompleteness: number;
  /** Offline kinematics-prior baseline confidence — path B fuel (0–1). */
  kinematicsConfidence: number;
  /** Optimism that kinematics priors “just work” offline (0–1). */
  kinematicsOptimism: number;
  /** Hardness of the deformable reconstruction case (0–1). */
  deformHardness: number;
  /** Risk of claiming live robot / diagnostic / FDA / Track2Map (0–1). */
  overclaimRisk: number;
  trackBias: TrackBias;
  profile: TrackMapProfile;
};

export type TrackMapQuality = {
  mode: ScoreMode;
  deformScore: number;
  fidelityScore: number;
  poseScore: number;
  completenessScore: number;
  kinematicsScore: number;
  confidence: number;
  slamContribution: number;
  kinematicsContribution: number;
  overall: number;
};

export type PackReadiness = "hold_track" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackReadiness {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_track";
}

export function biasWeight(
  bias: TrackBias,
  lane: Exclude<TrackBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function deformLoad(
  deformHardness: number,
  poseGrounding: number,
): number {
  return clamp(deformHardness * (1.25 - poseGrounding * 0.5), 0, 1.5);
}
