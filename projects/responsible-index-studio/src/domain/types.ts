export type IndexProfile =
  | "structured_country_index"
  | "naive_commitment_checklist";

export type ScoreMode = IndexProfile;

export type ScoringBias =
  | "dimension_first"
  | "balanced"
  | "checklist_first"
  | "indicator_first";

export type CountryKind =
  | "oecd_peer"
  | "emerging_market"
  | "regional_bloc"
  | "island_state"
  | "composite_cohort"
  | "custom";

export type DimensionKind =
  | "governance_oversight"
  | "rights_protections"
  | "capability_capacity"
  | "transparency_accountability"
  | "international_cooperation"
  | "custom";

export type IndicatorKind =
  | "commitment_evidence"
  | "dimension_coverage"
  | "checklist_control"
  | "dual_gate_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for structured country responsible-AI indexes
 * vs naive commitment checklists.
 * Method-lab scoring only — not live national policy authority,
 * not certified AI audits, not government command systems.
 */
export type IndexInput = {
  /** Soft-sim structured multi-dimension index depth (0–1). */
  structuredDepth: number;
  /** Soft-sim naive commitment checklist coverage (0–1). */
  checklistCoverage: number;
  /** Soft-sim dimension completeness across index axes (0–1). */
  dimensionCompleteness: number;
  /** Soft-sim indicator fidelity / evidence quality (0–1). */
  indicatorFidelity: number;
  /** Soft-sim evidence strength for published commitments (0–1). */
  evidenceStrength: number;
  /** Soft-sim country follow-through on stated commitments (0–1). */
  countryFollowThrough: number;
  /** Soft-sim indicator run / readout strength (0–1). */
  indicatorReadout: number;
  /** Risk of claiming live policy authority / certified audits (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: IndexProfile;
};

export type IndexQuality = {
  mode: ScoreMode;
  structuredIndexScore: number;
  checklistScore: number;
  dimensionCoverage: number;
  countryEfficiency: number;
  checklistOnlyPenalty: number;
  confidence: number;
  structuredContribution: number;
  checklistContribution: number;
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

export function governanceBurden(
  checklistCoverage: number,
  dimensionCompleteness: number,
  overclaimRisk: number,
): number {
  return clamp(
    (1 - dimensionCompleteness) * 0.35 +
      checklistCoverage * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
