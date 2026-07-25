export type HorizonProfile = "hierarchical" | "flat";

export type ScoreMode = "hierarchical" | "flat";

export type HorizonBias =
  | "structure_first"
  | "balanced"
  | "detail_first"
  | "rollout_first";

export type Corridor =
  | "urban"
  | "highway"
  | "intersection"
  | "rural"
  | "parking"
  | "weather";

/**
 * Soft-simulation inputs for hierarchical world-model vs flat naive rollout.
 * Method-lab scoring only — not live vehicle deployment.
 */
export type HorizonInput = {
  /** Coarse scene structure fit (0–1). */
  structureFit: number;
  /** Detail-generator fidelity (0–1). */
  detailFidelity: number;
  /** Temporal consistency across horizon steps (0–1). */
  temporalConsistency: number;
  /** Evidence strength for structure call (0–1). */
  evidenceStrength: number;
  /** Coverage of coarse scene families (0–1). */
  sceneCoverage: number;
  /** Flat rollout smoothness proxy (0–1) — baseline B fuel. */
  rolloutSmoothness: number;
  /** Visual fluency theater (0–1) — inflates B, discounted by A. */
  fluencyScore: number;
  /** Occlusion / surprise pressure (0–1, higher = harder). */
  surprisePressure: number;
  /** Horizon drift pressure (0–1). */
  horizonDrift: number;
  horizonBias: HorizonBias;
  profile: HorizonProfile;
};

export type HorizonQuality = {
  mode: ScoreMode;
  structureScore: number;
  detailScore: number;
  temporalScore: number;
  sceneIntegrity: number;
  flatRolloutScore: number;
  confidence: number;
  hierarchicalContribution: number;
  flatContribution: number;
  overall: number;
};

export type HorizonReadiness = "hold_pack" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): HorizonReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: HorizonBias,
  lane: Exclude<HorizonBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function surpriseLoad(
  surprisePressure: number,
  evidenceStrength: number,
): number {
  return clamp(surprisePressure * (1.15 - evidenceStrength * 0.4), 0, 1.5);
}
