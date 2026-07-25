export type ForceProfile =
  | "foundation_model_atomistics"
  | "classical_force_field_baseline";

export type ScoreMode = ForceProfile;

export type ForceBias =
  | "fm_first"
  | "balanced"
  | "force_first"
  | "baseline_first";

export type ForceKind =
  | "reactive_fm"
  | "classical_ff"
  | "hybrid"
  | "restraint"
  | "mixed";

/**
 * Soft-simulation inputs for foundation-model atomistics vs classical
 * force-field baselines. Method-lab scoring only — not DFT-validated
 * manufacturing sims, not live HPC write-back, not the authors' system.
 */
export type ForceInput = {
  /** Sim-pack coverage of reactive sites (0–1). */
  packCoverage: number;
  /** Foundation-model atomistic fidelity (0–1). */
  fmFidelity: number;
  /** Force-config clarity (0–1). */
  forceClarity: number;
  /** Trajectory-run stability across packs (0–1). */
  runStability: number;
  /** Classical force-field pass-rate proxy — path B fuel (0–1). */
  classicalFfRate: number;
  /** Optimism that classical FF “just works” (0–1). */
  ffOptimism: number;
  /** Reactive / bond-breaking hardness (0–1, higher = harder for A). */
  reactionHardness: number;
  /** Risk of claiming DFT / live HPC clearance (0–1). */
  overclaimRisk: number;
  forceBias: ForceBias;
  profile: ForceProfile;
};

export type ForceQuality = {
  mode: ScoreMode;
  packCoverageScore: number;
  fmScore: number;
  forceOptScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  fmContribution: number;
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
  bias: ForceBias,
  lane: Exclude<ForceBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function reactionLoad(
  reactionHardness: number,
  packCoverage: number,
): number {
  return clamp(reactionHardness * (1.25 - packCoverage * 0.5), 0, 1.5);
}
