export type LoadProfile =
  | "ordered_coload_sequence"
  | "simultaneous_load_baseline";

export type ScoreMode = LoadProfile;

export type LoadBias =
  | "chemo_first"
  | "balanced"
  | "photo_first"
  | "simultaneous_first";

export type CarrierKind =
  | "hollow_mesoporous_silica"
  | "hsn_shell"
  | "pore_tuned_hmsn"
  | "mixed_carrier"
  | "custom";

export type LoadOrderKind =
  | "dtx_then_icg"
  | "icg_then_dtx"
  | "simultaneous_dtx_icg"
  | "staged_pore_fill"
  | "custom";

export type AssayKind =
  | "encapsulation_efficiency"
  | "photothermal_response"
  | "burst_leak"
  | "pore_fill_map"
  | "custom";

/**
 * Soft-simulation inputs for ordered chemo-photothermal co-loading vs
 * simultaneous load. Method-lab scoring only — not wet-lab validated GMP
 * nanomedicine manufacture, not live patient dosing, not clinical oncology
 * clearance.
 */
export type ColoadInput = {
  /** Soft-sim fidelity of preserving intended load order (0–1). */
  orderFidelity: number;
  /** Soft-sim docetaxel (chemo) encapsulation efficiency (0–1). */
  chemoEncapsulation: number;
  /** Soft-sim indocyanine green (photothermal) encapsulation (0–1). */
  photoEncapsulation: number;
  /** Soft-sim uniformity of pore fill (0–1). */
  poreFillUniformity: number;
  /** Soft-sim photothermal response after co-load (0–1). */
  photothermalResponse: number;
  /** Soft-sim premature burst / leak risk (0–1). */
  burstLeakRisk: number;
  /** Soft-sim assay signal fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming GMP / dosing / clinical clearance (0–1). */
  overclaimRisk: number;
  loadBias: LoadBias;
  profile: LoadProfile;
};

export type ColoadQuality = {
  mode: ScoreMode;
  orderScore: number;
  chemoScore: number;
  photoScore: number;
  leakPenalty: number;
  synergyScore: number;
  confidence: number;
  orderedContribution: number;
  simultaneousContribution: number;
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
  bias: LoadBias,
  lane: Exclude<LoadBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function poreCompetition(
  chemoEncapsulation: number,
  photoEncapsulation: number,
): number {
  return clamp(
    chemoEncapsulation * 0.45 + photoEncapsulation * 0.45 - 0.2,
    0,
    1.5,
  );
}
