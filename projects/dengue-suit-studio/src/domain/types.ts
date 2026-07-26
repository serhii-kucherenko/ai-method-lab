export type SuitProfile =
  | "cmip6_thermal_suitability"
  | "static_historical_baseline";

export type ScoreMode = SuitProfile;

export type ClimateBias =
  | "ssp585_first"
  | "balanced"
  | "historical_first"
  | "ssp126_first";

export type ScenarioKind =
  | "ssp126"
  | "ssp245"
  | "ssp370"
  | "ssp585"
  | "historical"
  | "custom";

export type SpeciesKind =
  | "aedes_aegypti"
  | "aedes_albopictus"
  | "mixed_vector"
  | "custom";

export type PopulationKind =
  | "urban_density"
  | "peri_urban"
  | "rural_dispersed"
  | "mixed_exposure"
  | "custom";

/**
 * Soft-simulation inputs for CMIP6 dengue thermal suitability vs static
 * historical baseline. Method-lab scoring only — not live outbreak prediction,
 * not clinical diagnosis, not operational mosquito control deployment.
 */
export type SuitInput = {
  /** Soft-sim thermal suitability index (0–1). */
  thermalSuitIndex: number;
  /** Soft-sim population-at-risk fraction (0–1). */
  populationAtRisk: number;
  /** Soft-sim climate-scenario shift signal (0–1). */
  climateShiftSignal: number;
  /** Soft-sim vector niche fidelity (0–1). */
  vectorNicheFidelity: number;
  /** Soft-sim grid / spatial coverage (0–1). */
  spatialCoverage: number;
  /** Soft-sim historical baseline stickiness (0–1). */
  historicalStickiness: number;
  /** Soft-sim assay signal fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming outbreak prediction / clinical / ops control (0–1). */
  overclaimRisk: number;
  climateBias: ClimateBias;
  profile: SuitProfile;
};

export type SuitQuality = {
  mode: ScoreMode;
  thermalScore: number;
  populationScore: number;
  shiftScore: number;
  nicheScore: number;
  historicalPenalty: number;
  confidence: number;
  cmip6Contribution: number;
  historicalContribution: number;
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
  bias: ClimateBias,
  lane: Exclude<ClimateBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function thermalLoad(
  thermalSuitIndex: number,
  climateShiftSignal: number,
): number {
  return clamp(
    thermalSuitIndex * 0.55 + climateShiftSignal * 0.45 - 0.15,
    0,
    1.5,
  );
}
