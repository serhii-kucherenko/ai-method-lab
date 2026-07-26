export type RegimenProfile = "voclosporin_mps" | "cyclosporine_mps";

export type ScoreMode = RegimenProfile;

export type ScoringBias =
  | "mps_first"
  | "balanced"
  | "cyclosporine_first"
  | "assay_first";

export type TubuleKind =
  | "proximal_tubule"
  | "perfused_mps"
  | "transplant_cohort"
  | "research_panel"
  | "composite_pack"
  | "custom";

export type RegimenKind =
  | "voclosporin_mps"
  | "cyclosporine_a"
  | "calcineurin_soft_sim"
  | "mixed_regimen"
  | "dual_mps_soft_sim"
  | "custom";

export type AssayKind =
  | "mitochondrial_preservation"
  | "perfusion_readout"
  | "culture_2d_mask"
  | "dual_mps_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for voclosporin MPS mitochondrial preservation
 * vs cyclosporine A baselines on recorded proximal-tubule packs.
 * Method-lab scoring only — not wet-lab MPS validation,
 * not transplant dosing advice, not IND/NDA readiness,
 * not live patient care.
 */
export type TubuleMpsInput = {
  /** Soft-sim mitochondrial preservation under MPS perfusion (0–1). */
  mpsPreservation: number;
  /** Soft-sim cyclosporine A mitochondrial harm signal (0–1). */
  cyclosporineHarm: number;
  /** Soft-sim 2D culture masking of MPS differences (0–1). */
  culture2dMasking: number;
  /** Soft-sim perfusion / chip fidelity (0–1). */
  perfusionFidelity: number;
  /** Soft-sim evidence strength for tubule pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim regimen follow-through on protocol (0–1). */
  regimenFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming wet-lab / dosing / IND readiness (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: RegimenProfile;
};

export type TubuleMpsQuality = {
  mode: ScoreMode;
  mitochondrialPreservationScore: number;
  cyclosporineBaselineScore: number;
  mpsCoverage: number;
  regimenEfficiency: number;
  culture2dMaskPenalty: number;
  confidence: number;
  voclosporinContribution: number;
  cyclosporineContribution: number;
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

export function mitoBurden(
  cyclosporineHarm: number,
  culture2dMasking: number,
  overclaimRisk: number,
): number {
  return clamp(
    cyclosporineHarm * 0.35 +
      culture2dMasking * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
