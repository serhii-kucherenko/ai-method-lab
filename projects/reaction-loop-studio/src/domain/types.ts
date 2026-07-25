export type ReactionProfile = "chemist_in_loop_vlm" | "open_loop_vlm";

export type ScoreMode = ReactionProfile;

export type LoopBias =
  | "chemist_first"
  | "balanced"
  | "policy_first"
  | "open_loop_first";

export type ReactionFamily =
  | "suzuki"
  | "amide"
  | "snar"
  | "hydrogenation"
  | "mixed";

/**
 * Soft-simulation inputs for chemist-in-the-loop VLM reaction-condition
 * optimization vs open-loop VLM baselines. Method-lab scoring only — not live
 * wet-lab control, not manufacturing cleared, not the authors' system.
 */
export type ReactionInput = {
  /** Campaign pack coverage (0–1). */
  packCoverage: number;
  /** Reagent-space fidelity (0–1). */
  reagentFidelity: number;
  /** Loop policy clarity (0–1). */
  loopClarity: number;
  /** Run stability across campaigns (0–1). */
  runStability: number;
  /** Open-loop VLM baseline pass-rate proxy — path B fuel (0–1). */
  openLoopPassRate: number;
  /** Optimism that open-loop “just works” (0–1). */
  skipOptimism: number;
  /** Condition-space hardness (0–1, higher = harder for A). */
  conditionHardness: number;
  /** Risk of claiming live wet-lab / manufacturing clearance (0–1). */
  overclaimRisk: number;
  loopBias: LoopBias;
  profile: ReactionProfile;
};

export type ReactionQuality = {
  mode: ScoreMode;
  conditionCoverage: number;
  chemistGateScore: number;
  loopOptScore: number;
  packIntegrity: number;
  openLoopScore: number;
  confidence: number;
  loopContribution: number;
  openLoopContribution: number;
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
  bias: LoopBias,
  lane: Exclude<LoopBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function conditionLoad(
  conditionHardness: number,
  packCoverage: number,
): number {
  return clamp(conditionHardness * (1.25 - packCoverage * 0.5), 0, 1.5);
}
