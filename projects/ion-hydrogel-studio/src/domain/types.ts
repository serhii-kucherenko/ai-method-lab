export type GelProfile =
  | "dynamic_charge_regulation"
  | "fixed_charge_baseline";

export type ScoreMode = GelProfile;

export type ChargeBias =
  | "regulation_first"
  | "balanced"
  | "fixed_first"
  | "mobility_first";

export type GelKind =
  | "weak_polyelectrolyte"
  | "strong_polyelectrolyte"
  | "ampholytic_network"
  | "semi_interpenetrating"
  | "custom";

export type ChargeKind =
  | "dynamic_regulation"
  | "ph_responsive"
  | "fixed_density"
  | "mixed_charge"
  | "custom";

export type SaltKind =
  | "monovalent_nacl"
  | "divalent_cacl2"
  | "mixed_electrolyte"
  | "low_ionic_strength"
  | "custom";

/**
 * Soft-simulation inputs for dynamic charge-regulating hydrogel ion transport
 * vs fixed-charge baselines.
 * Method-lab scoring only — not wet-lab validated membrane manufacturing,
 * not live plant ionics, not commercial battery cell qualification.
 */
export type HydrogelInput = {
  /** Soft-sim dynamic charge regulation strength (0–1). */
  chargeRegulation: number;
  /** Soft-sim fixed charge density baseline fuel (0–1). */
  fixedChargeDensity: number;
  /** Soft-sim free ion mobility (0–1). */
  ionMobility: number;
  /** Soft-sim ion–gel binding strength (0–1). */
  bindingStrength: number;
  /** Soft-sim salt / ionic strength load (0–1). */
  saltLoad: number;
  /** Soft-sim gel permeability / mesh openness (0–1). */
  gelPermeability: number;
  /** Soft-sim swelling ratio proxy (0–1). */
  swellingRatio: number;
  /** Risk of claiming membrane mfg / plant ionics / battery qual (0–1). */
  overclaimRisk: number;
  chargeBias: ChargeBias;
  profile: GelProfile;
};

export type HydrogelQuality = {
  mode: ScoreMode;
  regulationScore: number;
  mobilityScore: number;
  bindingScore: number;
  saltScore: number;
  fixedScore: number;
  confidence: number;
  regulationContribution: number;
  fixedContribution: number;
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
  bias: ChargeBias,
  lane: Exclude<ChargeBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function saltDrag(saltLoad: number, bindingStrength: number): number {
  return clamp(saltLoad * 0.55 + bindingStrength * 0.45, 0, 1.5);
}
