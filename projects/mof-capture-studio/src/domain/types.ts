export type CaptureProfile =
  | "anionic_mof_capture"
  | "conventional_sorbent";

export type ScoreMode = CaptureProfile;

export type ScoringBias =
  | "mof_first"
  | "balanced"
  | "sorbent_first"
  | "assay_first";

export type WaterKind =
  | "industrial_effluent"
  | "mine_drainage"
  | "municipal_influent"
  | "groundwater_plume"
  | "composite_cohort"
  | "custom";

export type SorbentKind =
  | "anionic_mof_zr"
  | "activated_carbon"
  | "ion_exchange_resin"
  | "mixed_mof_carbon"
  | "dual_gate_soft_sim"
  | "custom";

export type AssayKind =
  | "lead_uptake"
  | "mercury_uptake"
  | "cadmium_uptake"
  | "dual_gate_soft_sim"
  | "custom";

/**
 * Soft-simulation inputs for anionic MOF heavy-metal capture
 * vs conventional sorbent baselines on recorded waters.
 * Method-lab scoring only — not live plant control,
 * not certified water audits, not municipal procurement.
 */
export type MofCaptureInput = {
  /** Soft-sim ion-exchange fidelity for anionic MOF pathway (0–1). */
  ionExchangeFidelity: number;
  /** Soft-sim conventional sorbent capacity coverage (0–1). */
  conventionalCapacity: number;
  /** Soft-sim sorbent completeness across capture steps (0–1). */
  sorbentCompleteness: number;
  /** Soft-sim assay fidelity / lab quality (0–1). */
  assayFidelity: number;
  /** Soft-sim evidence strength for water pack records (0–1). */
  evidenceStrength: number;
  /** Soft-sim water follow-through on capture protocol (0–1). */
  waterFollowThrough: number;
  /** Soft-sim assay run / readout strength (0–1). */
  assayReadout: number;
  /** Risk of claiming live plant control / certified audits (0–1). */
  overclaimRisk: number;
  scoringBias: ScoringBias;
  profile: CaptureProfile;
};

export type MofCaptureQuality = {
  mode: ScoreMode;
  mofCaptureScore: number;
  conventionalScore: number;
  sorbentCoverage: number;
  waterEfficiency: number;
  conventionalOnlyPenalty: number;
  confidence: number;
  mofContribution: number;
  conventionalContribution: number;
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

export function captureBurden(
  conventionalCapacity: number,
  sorbentCompleteness: number,
  overclaimRisk: number,
): number {
  return clamp(
    (1 - sorbentCompleteness) * 0.35 +
      conventionalCapacity * 0.25 +
      overclaimRisk * 0.4 -
      0.06,
    0,
    1.5,
  );
}
