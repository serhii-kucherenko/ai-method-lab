export type PvCausalProfile =
  | "target_trial_causal_signal"
  | "spontaneous_reporting_baseline";

export type ScoreMode = PvCausalProfile;

export type SignalBias =
  | "trial_first"
  | "balanced"
  | "exposure_first"
  | "tip_line_first";

export type CohortKind =
  | "medicare_initiators"
  | "defined_population"
  | "age_stratified"
  | "custom";

/**
 * Soft-simulation inputs for target-trial causal pharmacovigilance
 * signal detection vs spontaneous-reporting baselines.
 * Method-lab scoring only — not regulatory submission,
 * not live claims write-back, not FDA clearance,
 * not the authors' system.
 */
export type PvCausalInput = {
  /** Soft-sim defined-population cohort coverage (0–1). */
  cohortCoverage: number;
  /** Soft-sim exposure definition fidelity (0–1). */
  exposureFidelity: number;
  /** Soft-sim confounder control in the target-trial emulation (0–1). */
  confounderControl: number;
  /** Soft-sim pv pack completeness (0–1). */
  packCompleteness: number;
  /** Spontaneous-reporting volume strength — path B fuel (0–1). */
  spontaneousVolume: number;
  /** Optimism that tip-line reports alone are enough (0–1). */
  tipLineOptimism: number;
  /** Hardness of the adverse-event / initiation case (0–1). */
  trialHardness: number;
  /** Risk of claiming regulatory / claims write-back / FDA (0–1). */
  overclaimRisk: number;
  signalBias: SignalBias;
  profile: PvCausalProfile;
};

export type PvCausalQuality = {
  mode: ScoreMode;
  cohortScore: number;
  exposureScore: number;
  causalScore: number;
  completenessScore: number;
  tipLineScore: number;
  confidence: number;
  targetTrialContribution: number;
  spontaneousContribution: number;
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
  bias: SignalBias,
  lane: Exclude<SignalBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function trialLoad(
  trialHardness: number,
  confounderControl: number,
): number {
  return clamp(trialHardness * (1.25 - confounderControl * 0.5), 0, 1.5);
}
