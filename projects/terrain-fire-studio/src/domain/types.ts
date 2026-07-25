export type TerrainProfile = "physics_aware" | "naive_overlay";

export type ScoreMode = "physics_aware" | "naive_overlay";

export type AlignmentBias =
  | "tight_control"
  | "balanced"
  | "elevation_first"
  | "photo_drape";

/**
 * Soft-simulation inputs for physics-aware terrain refresh vs naive overlay.
 * Method-lab scoring only — not survey certification or live dispatch.
 */
export type TerrainInput = {
  /** Ground sample distance in cm (lower = sharper). */
  photoResolutionCm: number;
  /** Cloud / haze cover (0–1, higher = worse). */
  cloudCover: number;
  /** Stereo / strip overlap (0–1). */
  overlapRatio: number;
  /** Absolute elevation change since last pack (meters). */
  elevationChangeM: number;
  /** Slope steepness pressure (0–1). */
  slopeSteepness: number;
  /** Fuel / vegetation layer drift (0–1). */
  fuelDrift: number;
  /** Control-point density quality (0–1). */
  controlPointDensity: number;
  /** Elevation prior strength (0–1). */
  elevationPriorStrength: number;
  /** Allowed seam discontinuity budget (meters). */
  seamBudgetM: number;
  alignmentBias: AlignmentBias;
  profile: TerrainProfile;
};

export type TerrainQuality = {
  mode: ScoreMode;
  elevationFidelity: number;
  slopeCoherence: number;
  seamContinuity: number;
  fuelLayerFidelity: number;
  photogrammetryScore: number;
  confidence: number;
  physicsContribution: number;
  overlayContribution: number;
  overall: number;
};

export type TerrainReadiness = "hold_refresh" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): TerrainReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_refresh";
}

export function biasWeight(
  bias: AlignmentBias,
  lane: Exclude<AlignmentBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function seamPressure(elevationChangeM: number, seamBudgetM: number): number {
  if (seamBudgetM <= 0) return 1;
  return clamp(elevationChangeM / seamBudgetM, 0, 2);
}

export function resolutionQuality(photoResolutionCm: number): number {
  return clamp(1 - (photoResolutionCm - 10) / 90, 0, 1);
}
