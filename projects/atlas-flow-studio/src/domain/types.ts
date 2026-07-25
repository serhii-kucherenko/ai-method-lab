export type AtlasProfile =
  | "integrated_atlas_workflow"
  | "fragmented_multi_tool_baseline";

export type ScoreMode = AtlasProfile;

export type RegistrationBias =
  | "atlas_first"
  | "balanced"
  | "region_first"
  | "fragment_first";

export type RegistrationKind =
  | "affine"
  | "nonlinear"
  | "multimodal"
  | "slice_to_volume"
  | "custom";

/**
 * Soft-simulation inputs for integrated atlas registration + quantification
 * vs fragmented multi-tool baselines.
 * Method-lab scoring only — not live microscope control, not clinical
 * diagnostic use, not FDA cleared, not NeuroFlow, not the authors' system.
 */
export type AtlasInput = {
  /** Soft-sim registration fidelity to atlas (0–1). */
  registrationFidelity: number;
  /** Soft-sim region coverage after alignment (0–1). */
  regionCoverage: number;
  /** Soft-sim atlas alignment quality (0–1). */
  atlasAlignment: number;
  /** Soft-sim quantification stability across revisits (0–1). */
  quantStability: number;
  /** Fragmented multi-tool confidence — path B fuel (0–1). */
  fragmentToolConfidence: number;
  /** Optimism that multi-package stitching “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the atlas workflow decision (0–1). */
  workflowHardness: number;
  /** Risk of claiming live microscope / diagnostic / FDA (0–1). */
  overclaimRisk: number;
  registrationBias: RegistrationBias;
  profile: AtlasProfile;
};

export type AtlasQuality = {
  mode: ScoreMode;
  registrationScore: number;
  coverageScore: number;
  alignmentScore: number;
  quantIntegrity: number;
  fragmentScore: number;
  confidence: number;
  integratedContribution: number;
  fragmentContribution: number;
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
  bias: RegistrationBias,
  lane: Exclude<RegistrationBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function workflowLoad(
  workflowHardness: number,
  atlasAlignment: number,
): number {
  return clamp(workflowHardness * (1.25 - atlasAlignment * 0.5), 0, 1.5);
}
