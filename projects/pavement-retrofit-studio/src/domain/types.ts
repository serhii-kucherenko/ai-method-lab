export type RetrofitProfile =
  | "photocatalytic_pavement_retrofit"
  | "conventional_preservation";

export type ScoreMode = RetrofitProfile;

export type TreatmentBias =
  | "photocatalytic_first"
  | "balanced"
  | "preservation_first"
  | "assay_first";

export type CorridorKind =
  | "urban_arterial"
  | "highway_segment"
  | "transit_corridor"
  | "industrial_access"
  | "custom";

export type TreatmentKind =
  | "tio2_overlay"
  | "tio2_sealcoat"
  | "hybrid_photocatalytic"
  | "preservation_only"
  | "custom";

export type AssayKind =
  | "nox_reduction"
  | "co2_proxy"
  | "particulate_proxy"
  | "durability_assay"
  | "custom";

/**
 * Soft-simulation inputs for photocatalytic pavement retrofit vs
 * conventional pavement preservation.
 * Method-lab scoring only — not live road construction control,
 * not certified emissions audits, not municipal procurement authority.
 */
export type RetrofitInput = {
  /** Soft-sim TiO2 loading / photocatalytic intensity (0–1). */
  tio2Loading: number;
  /** Soft-sim corridor traffic density (0–1; higher = more exposure). */
  trafficDensity: number;
  /** Soft-sim NOx baseline burden (0–1; higher = worse air). */
  noxBaseline: number;
  /** Soft-sim CO2 / GHG proxy baseline (0–1; higher = worse). */
  co2Baseline: number;
  /** Soft-sim conventional preservation quality (0–1; higher = better). */
  preservationQuality: number;
  /** Soft-sim corridor sunlight / exposure index (0–1). */
  corridorExposure: number;
  /** Soft-sim assay / evidence fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming live construction / certified audits (0–1). */
  overclaimRisk: number;
  treatmentBias: TreatmentBias;
  profile: RetrofitProfile;
};

export type RetrofitQuality = {
  mode: ScoreMode;
  emissionScore: number;
  durabilityScore: number;
  coverageScore: number;
  costEfficiency: number;
  preservationPenalty: number;
  confidence: number;
  retrofitContribution: number;
  preservationContribution: number;
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
  bias: TreatmentBias,
  lane: Exclude<TreatmentBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function emissionLoad(
  noxBaseline: number,
  co2Baseline: number,
  trafficDensity: number,
): number {
  return clamp(
    noxBaseline * 0.4 + co2Baseline * 0.35 + trafficDensity * 0.25 - 0.06,
    0,
    1.5,
  );
}
