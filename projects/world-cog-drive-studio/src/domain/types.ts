export type DriveProfile = "world_cognitive" | "single_level";

export type ScoreMode = DriveProfile;

export type DriveBias =
  | "world_first"
  | "balanced"
  | "action_first"
  | "reactive_first";

export type Corridor =
  | "urban"
  | "highway"
  | "intersection"
  | "rural"
  | "weather"
  | "merge";

/**
 * Soft-simulation inputs for dual-level world-cognitive VLA vs single-level
 * VLA baselines. Method-lab scoring only — not certified AV, not live vehicle
 * control, not the authors' WCog-VLA system.
 */
export type DriveInput = {
  /** How well the world-level forecast matches the route corridor (0–1). */
  worldForecastFit: number;
  /** Dual-level cognitive reasoning depth / coherence (0–1). */
  cognitiveDepth: number;
  /** Action policy alignment with the world forecast (0–1). */
  actionAlignment: number;
  /** Trajectory integrity under forecast pressure (0–1). */
  trajectoryIntegrity: number;
  /** Single-level VLA pass-rate proxy — baseline B fuel (0–1). */
  singleLevelPassRate: number;
  /** Optimism that reactive single-level control “just works” (0–1). */
  reactiveOptimism: number;
  /** Route hardness / multi-agent load (0–1, higher = harder for A). */
  routeHardness: number;
  /** Risk of claiming certified AV / live vehicle control (0–1). */
  leakageRisk: number;
  driveBias: DriveBias;
  profile: DriveProfile;
};

export type DriveQuality = {
  mode: ScoreMode;
  worldScore: number;
  cognitiveScore: number;
  actionScore: number;
  trajectoryScore: number;
  singleLevelScore: number;
  confidence: number;
  worldCognitiveContribution: number;
  singleLevelContribution: number;
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
  bias: DriveBias,
  lane: Exclude<DriveBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function routeLoad(
  routeHardness: number,
  worldForecastFit: number,
): number {
  return clamp(routeHardness * (1.25 - worldForecastFit * 0.5), 0, 1.5);
}
