export type LabelProfile =
  | "fast_isotopic_exchange"
  | "multistep_prosthetic_baseline";

export type ScoreMode = LabelProfile;

export type LabelBias =
  | "exchange_first"
  | "balanced"
  | "prosthetic_first"
  | "speed_first";

export type PrecursorKind =
  | "iminosulfur_oxydifluoride"
  | "triflimidoyl_fluoride"
  | "aryl_fluoride"
  | "primary_amine_scaffold"
  | "custom";

export type ExchangeKind =
  | "isotopic_18f_swap"
  | "late_stage_exchange"
  | "automated_cassette"
  | "baseline_prosthetic"
  | "custom";

export type TracerKind =
  | "small_molecule_pet"
  | "peptide_pet"
  | "antibody_fragment"
  | "prosthetic_group"
  | "custom";

/**
 * Soft-simulation inputs for fast isotopic [18F]fluoride exchange
 * vs multistep prosthetic-group baselines.
 * Method-lab scoring only — not wet-lab validated radiopharmaceutical
 * GMP batch release, not live cyclotron control, not clinical PET dosing.
 */
export type FluorideInput = {
  /** Soft-sim isotopic exchange rate (0–1). */
  exchangeRate: number;
  /** Soft-sim precursor purity / readiness (0–1). */
  precursorPurity: number;
  /** Soft-sim leaving-group ease for 18F swap (0–1). */
  leavingGroupEase: number;
  /** Soft-sim primary-amine availability (0–1). */
  amineAvailability: number;
  /** Multistep prosthetic burden — path B fuel (0–1). */
  prostheticStepBurden: number;
  /** Solvent / activation harshness (0–1). */
  solventHarshness: number;
  /** Soft-sim activation barrier hardness (0–1). */
  activationBarrier: number;
  /** Risk of claiming GMP / cyclotron / clinical dosing (0–1). */
  overclaimRisk: number;
  labelBias: LabelBias;
  profile: LabelProfile;
};

export type FluorideQuality = {
  mode: ScoreMode;
  exchangeScore: number;
  purityScore: number;
  leavingScore: number;
  amineScore: number;
  prostheticScore: number;
  confidence: number;
  exchangeContribution: number;
  prostheticContribution: number;
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
  bias: LabelBias,
  lane: Exclude<LabelBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function harshnessLoad(
  solventHarshness: number,
  activationBarrier: number,
): number {
  return clamp(
    solventHarshness * 0.55 + activationBarrier * 0.55,
    0,
    1.5,
  );
}
