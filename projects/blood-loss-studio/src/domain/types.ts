export type LossProfile =
  | "weighed_swab_measured"
  | "haemoglobin_calculated";

export type ScoreMode = LossProfile;

export type ScoringBias =
  | "swab_first"
  | "balanced"
  | "hb_first"
  | "assay_first";

export type BirthKind =
  | "elective_caesarean"
  | "emergency_caesarean"
  | "repeat_caesarean"
  | "twin_caesarean"
  | "composite_cohort"
  | "custom";

export type MethodKind =
  | "weighed_swab_pad"
  | "suction_canister"
  | "mixed_weigh_suction"
  | "visual_estimate_control"
  | "dual_gate_soft_sim"
  | "custom";

export type AssayKind =
  | "haemoglobin_delta"
  | "estimated_blood_volume"
  | "nadler_formula"
  | "dual_gate_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for weighed-swab measured blood loss
 * vs haemoglobin-calculated baselines after caesarean birth.
 * Method-lab scoring only — not live clinical advice,
 * not EMR write-back, not device clearance.
 */
export type BloodLossInput = {
  /** Soft-sim weighed-swab / pad mass fidelity (0–1). */
  swabMassFidelity: number;
  /** Soft-sim haemoglobin-delta calc coverage (0–1). */
  hbDeltaCoverage: number;
  /** Soft-sim method completeness across weigh steps (0–1). */
  methodCompleteness: number;
  /** Soft-sim assay fidelity / lab quality (0–1). */
  assayFidelity: number;
  /** Soft-sim evidence strength for birth loss records (0–1). */
  evidenceStrength: number;
  /** Soft-sim birth follow-through on measurement protocol (0–1). */
  birthFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming live clinical advice / device clearance (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: LossProfile;
};

export type BloodLossQuality = {
  mode: ScoreMode;
  measuredLossScore: number;
  calculatedLossScore: number;
  methodCoverage: number;
  birthEfficiency: number;
  calculatedOnlyPenalty: number;
  confidence: number;
  measuredContribution: number;
  calculatedContribution: number;
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
  bias: ScoringBias,
  lane: Exclude<ScoringBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function measurementBurden(
  hbDeltaCoverage: number,
  methodCompleteness: number,
  overclaimRisk: number,
): number {
  return clamp(
    (1 - methodCompleteness) * 0.35 +
      hbDeltaCoverage * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
