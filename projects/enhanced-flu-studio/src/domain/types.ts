export type ProgramProfile =
  | "expanded_eiv_program"
  | "current_policy_baseline";

export type ScoreMode = ProgramProfile;

export type ProgramBias =
  | "eiv_first"
  | "balanced"
  | "baseline_first"
  | "coverage_first";

export type CountryKind =
  | "sweden"
  | "norway"
  | "denmark"
  | "finland"
  | "iceland"
  | "nordic_blend"
  | "custom";

export type ProgramKind =
  | "expanded_eiv_65plus"
  | "standard_plus_eiv"
  | "high_dose_priority"
  | "adjuvanted_priority"
  | "mixed_enhanced"
  | "custom";

export type OutcomeKind =
  | "hospitalizations_averted"
  | "gp_visits_averted"
  | "deaths_averted"
  | "qaly_gain"
  | "winter_burden_delta"
  | "custom";

/**
 * Soft-simulation inputs for expanded enhanced influenza vaccine (EIV)
 * programs for adults ≥65 vs current national policy baselines.
 * Method-lab scoring only — not live immunization logistics, not clinical
 * prescribing, not national policy adoption.
 */
export type FluInput = {
  /** Soft-sim coverage among adults ≥65 (0–1). */
  coverage65Plus: number;
  /** Soft-sim share of enhanced vaccines in the program (0–1). */
  eivUptakeShare: number;
  /** Soft-sim residual winter burden index (0–1; lower is better for expanded). */
  winterBurdenIndex: number;
  /** Soft-sim hospital pressure signal (0–1). */
  hospitalPressure: number;
  /** Soft-sim current-policy stickiness (0–1). */
  policyStickiness: number;
  /** Soft-sim Nordic parity / cross-country alignment (0–1). */
  nordicParity: number;
  /** Soft-sim assay / evidence fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming live logistics / clinical / policy adoption (0–1). */
  overclaimRisk: number;
  programBias: ProgramBias;
  profile: ProgramProfile;
};

export type FluQuality = {
  mode: ScoreMode;
  coverageScore: number;
  eivScore: number;
  winterScore: number;
  hospitalScore: number;
  policyPenalty: number;
  confidence: number;
  expandedContribution: number;
  baselineContribution: number;
  overall: number;
};

export type PackLockState = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackLockState {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: ProgramBias,
  lane: Exclude<ProgramBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function winterLoad(
  winterBurdenIndex: number,
  hospitalPressure: number,
): number {
  return clamp(
    winterBurdenIndex * 0.55 + hospitalPressure * 0.45 - 0.12,
    0,
    1.5,
  );
}
