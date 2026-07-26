export type PocusProfile =
  | "cardiac_pocus_copd"
  | "lung_ultrasound_baseline";

export type ScoreMode = PocusProfile;

export type ImagingBias =
  | "cardiac_first"
  | "balanced"
  | "lung_first"
  | "pattern_first";

export type ExamKind =
  | "parasternal_long"
  | "parasternal_short"
  | "apical_four"
  | "subcostal"
  | "mixed_cardiac"
  | "custom";

export type PatternKind =
  | "rv_strain_copd"
  | "ivc_collapse"
  | "lv_underfill"
  | "pulmonary_pressure_hint"
  | "composite_cardiac"
  | "custom";

export type AssayKind =
  | "copd_detection"
  | "pattern_association"
  | "lung_baseline_control"
  | "dual_gate_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for cardiac POCUS COPD patterns vs
 * lung-ultrasound baselines.
 * Method-lab scoring only — not live diagnostic clearance,
 * not clinical advice, not PACS write-back.
 */
export type PocusInput = {
  /** Soft-sim cardiac POCUS pattern signal strength (0–1). */
  cardiacPatternSignal: number;
  /** Soft-sim lung ultrasound baseline signal (0–1). */
  lungBaselineSignal: number;
  /** Soft-sim probe / acquisition quality (0–1). */
  probeQuality: number;
  /** Soft-sim view completeness across windows (0–1). */
  viewCompleteness: number;
  /** Soft-sim COPD association strength from cardiac patterns (0–1). */
  copdAssociation: number;
  /** Soft-sim exam follow-through / annotation completeness (0–1). */
  examFollowThrough: number;
  /** Soft-sim assay / detection readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming live diagnosis / clearance / PACS write-back (0–1). */
  overclaimRisk: number;
  imagingBias: ImagingBias;
  profile: PocusProfile;
};

export type PocusQuality = {
  mode: ScoreMode;
  cardiacDetectionScore: number;
  lungBaselineScore: number;
  patternCoverage: number;
  examEfficiency: number;
  lungOnlyPenalty: number;
  confidence: number;
  cardiacContribution: number;
  lungContribution: number;
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
  bias: ImagingBias,
  lane: Exclude<ImagingBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function imagingBurden(
  lungBaselineSignal: number,
  viewCompleteness: number,
  overclaimRisk: number,
): number {
  return clamp(
    (1 - viewCompleteness) * 0.35 +
      lungBaselineSignal * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
