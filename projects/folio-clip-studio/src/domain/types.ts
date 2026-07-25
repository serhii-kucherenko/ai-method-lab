export type ClipProfile =
  | "multimodal_wearable_stress"
  | "single_sensor_baseline";

export type ScoreMode = ClipProfile;

export type StressBias =
  | "multimodal_first"
  | "balanced"
  | "sensor_first"
  | "baseline_first";

export type SensorKind =
  | "leaf_clip"
  | "stem_band"
  | "canopy_probe"
  | "petiole_pad"
  | "mixed";

/**
 * Soft-simulation inputs for multimodal wearable plant-stress sensing vs
 * single-sensor baselines. Method-lab scoring only — not field-validated
 * farm deployments, not live greenhouse write-back, not the authors' system.
 */
export type ClipInput = {
  /** Clip pack coverage of leaf / canopy sites (0–1). */
  clipCoverage: number;
  /** Multimodal wearable fidelity across channels (0–1). */
  multimodalFidelity: number;
  /** Sensor configuration clarity (0–1). */
  sensorClarity: number;
  /** Stress-run stability across packs (0–1). */
  runStability: number;
  /** Single-sensor baseline pass-rate proxy — path B fuel (0–1). */
  singleSensorRate: number;
  /** Optimism that one ungated channel “just works” (0–1). */
  channelOptimism: number;
  /** Stress / drought hardness (0–1, higher = harder for A). */
  stressHardness: number;
  /** Risk of claiming field / live greenhouse clearance (0–1). */
  overclaimRisk: number;
  stressBias: StressBias;
  profile: ClipProfile;
};

export type ClipQuality = {
  mode: ScoreMode;
  clipCoverageScore: number;
  multimodalScore: number;
  sensorOptScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  multimodalContribution: number;
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
  bias: StressBias,
  lane: Exclude<StressBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function stressLoad(
  stressHardness: number,
  clipCoverage: number,
): number {
  return clamp(stressHardness * (1.25 - clipCoverage * 0.5), 0, 1.5);
}
