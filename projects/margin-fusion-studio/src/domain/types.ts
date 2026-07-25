export type FusionProfile = "marker_free" | "marker_based";

export type ScoreMode = FusionProfile;

export type FusionBias =
  | "deformable_first"
  | "balanced"
  | "surface_first"
  | "marker_first";

export type SpecimenDomain =
  | "breast"
  | "soft_tissue"
  | "head_neck"
  | "gi"
  | "gu"
  | "mixed";

/**
 * Soft-simulation inputs for marker-free deformable margin fusion vs
 * marker-based baselines. Method-lab scoring only — not surgical device
 * cleared, not live OR, not the authors' registration system.
 */
export type FusionInput = {
  /** Marker-free deformable registration quality (0–1). */
  deformableQuality: number;
  /** Surface / tissue correspondence fidelity (0–1). */
  surfaceFidelity: number;
  /** Positive-margin localization clarity under soft-sim AR (0–1). */
  marginClarity: number;
  /** Fusion stability across soft deformation (0–1). */
  fusionStability: number;
  /** Marker-based baseline pass-rate proxy — path B fuel (0–1). */
  markerPassRate: number;
  /** Optimism that fiducial markers “just work” (0–1). */
  markerOptimism: number;
  /** Tissue deformation hardness (0–1, higher = harder for A). */
  deformationHardness: number;
  /** Risk of claiming device clearance / live OR guidance (0–1). */
  overclaimRisk: number;
  fusionBias: FusionBias;
  profile: FusionProfile;
};

export type FusionQuality = {
  mode: ScoreMode;
  deformableScore: number;
  surfaceScore: number;
  marginScore: number;
  stabilityScore: number;
  markerScore: number;
  confidence: number;
  markerFreeContribution: number;
  markerBasedContribution: number;
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
  bias: FusionBias,
  lane: Exclude<FusionBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function deformationLoad(
  deformationHardness: number,
  deformableQuality: number,
): number {
  return clamp(deformationHardness * (1.25 - deformableQuality * 0.5), 0, 1.5);
}
