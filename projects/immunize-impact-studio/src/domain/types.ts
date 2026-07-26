export type ImpactProfile =
  | "immunization_linked_mortality"
  | "coverage_only_dashboard";

export type ScoreMode = ImpactProfile;

export type ImpactBias =
  | "mortality_first"
  | "balanced"
  | "coverage_first"
  | "dashboard_first";

export type CountryKind =
  | "nigeria"
  | "kenya"
  | "ethiopia"
  | "ghana"
  | "tanzania"
  | "ssa_blend"
  | "custom";

export type AntigenKind =
  | "dtp3"
  | "measles"
  | "polio"
  | "pcv"
  | "rota"
  | "multi_antigen"
  | "custom";

export type PanelKind =
  | "under_five_mortality"
  | "neonatal_share"
  | "equity_gap"
  | "coverage_trend"
  | "survival_delta"
  | "custom";

/**
 * Soft-simulation inputs for immunization-linked under-five mortality
 * panels vs coverage-only dashboards (Sub-Saharan Africa ecological pattern).
 * Method-lab scoring only — not live immunization logistics, not clinical
 * prescribing, not national policy authority.
 */
export type ImpactInput = {
  /** Soft-sim DTP3 coverage (0–1). */
  dtp3Coverage: number;
  /** Soft-sim measles (MCV1) coverage (0–1). */
  measlesCoverage: number;
  /** Soft-sim under-five mortality index (0–1; higher = worse). */
  underFiveMortality: number;
  /** Soft-sim multi-year panel strength (0–1). */
  panelYears: number;
  /** Soft-sim coverage equity gap (0–1; higher = worse). */
  equityGap: number;
  /** Soft-sim antigen breadth across the schedule (0–1). */
  antigenBreadth: number;
  /** Soft-sim assay / evidence fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming live logistics / clinical / policy authority (0–1). */
  overclaimRisk: number;
  impactBias: ImpactBias;
  profile: ImpactProfile;
};

export type ImpactQuality = {
  mode: ScoreMode;
  coverageScore: number;
  mortalityLinkScore: number;
  equityScore: number;
  panelScore: number;
  dashboardPenalty: number;
  confidence: number;
  mortalityContribution: number;
  coverageContribution: number;
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
  bias: ImpactBias,
  lane: Exclude<ImpactBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function mortalityLoad(
  underFiveMortality: number,
  equityGap: number,
): number {
  return clamp(
    underFiveMortality * 0.6 + equityGap * 0.4 - 0.1,
    0,
    1.5,
  );
}
