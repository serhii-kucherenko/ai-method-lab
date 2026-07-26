export type EditorProfile =
  | "domain_insertion_abe"
  | "baseline_abe";

export type ScoreMode = EditorProfile;

export type ScoringBias =
  | "insertion_first"
  | "balanced"
  | "baseline_first"
  | "assay_first";

export type EditorKind =
  | "abe8e_like"
  | "tadabe_like"
  | "therapeutic_candidate"
  | "research_panel"
  | "composite_cohort"
  | "custom";

export type InsertionKind =
  | "domain_insertion_abe"
  | "linker_insertion"
  | "baseline_window"
  | "mixed_insertion"
  | "dual_gate_soft_sim"
  | "custom";

export type AssayKind =
  | "window_precision"
  | "off_target_adenine"
  | "on_target_activity"
  | "dual_gate_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for domain-insertion ABE precision
 * vs baseline ABE windows on recorded editor packs.
 * Method-lab scoring only — not wet-lab validation,
 * not IND/NDA readiness, not patient dosing,
 * not clinical gene-therapy advice.
 */
export type AbePrecisionInput = {
  /** Soft-sim editing-window narrowing for domain-insertion path (0–1). */
  windowNarrowing: number;
  /** Soft-sim baseline ABE window breadth / off-target exposure (0–1). */
  baselineWindowBreadth: number;
  /** Soft-sim insertion completeness across editor steps (0–1). */
  insertionCompleteness: number;
  /** Soft-sim assay fidelity / panel quality (0–1). */
  assayFidelity: number;
  /** Soft-sim evidence strength for editor pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim editor follow-through on insertion protocol (0–1). */
  editorFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming wet-lab / IND / dosing readiness (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: EditorProfile;
};

export type AbePrecisionQuality = {
  mode: ScoreMode;
  insertionPrecisionScore: number;
  baselineScore: number;
  insertionCoverage: number;
  editorEfficiency: number;
  baselineOnlyPenalty: number;
  confidence: number;
  insertionContribution: number;
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
  bias: ScoringBias,
  lane: Exclude<ScoringBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function editBurden(
  baselineWindowBreadth: number,
  insertionCompleteness: number,
  overclaimRisk: number,
): number {
  return clamp(
    (1 - insertionCompleteness) * 0.35 +
      baselineWindowBreadth * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
