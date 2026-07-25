export type TargetProfile =
  | "localized_nanodomain_target"
  | "systemic_phosphorylation_baseline";

export type ScoreMode = TargetProfile;

export type TargetBias =
  | "nanodomain_first"
  | "balanced"
  | "systemic_first"
  | "diastolic_first";

export type NanodomainKind =
  | "camp_pka_local"
  | "troponin_i_focus"
  | "pde4d9_proximal"
  | "mixed_nanodomain"
  | "custom";

export type PeptideKind =
  | "pde_pry"
  | "troponin_anchor"
  | "localized_delivery"
  | "control_scrambled"
  | "custom";

export type AssayKind =
  | "diastolic_restore"
  | "systolic_preserve"
  | "phosphorylation_map"
  | "nanodomain_signal"
  | "custom";

/**
 * Soft-simulation inputs for localized nanodomain targeting vs systemic
 * phosphorylation. Method-lab scoring only — not wet-lab validated IND/NDA,
 * not live patient dosing, not clinical heart-failure diagnosis.
 */
export type NanodomainInput = {
  /** Soft-sim localization of cAMP/PKA nanodomain targeting (0–1). */
  nanodomainLocalization: number;
  /** Soft-sim peptide pry of PDE away from the nanodomain (0–1). */
  pdePryStrength: number;
  /** Soft-sim diastolic function gain (0–1). */
  diastolicGain: number;
  /** Soft-sim systolic performance preservation (0–1). */
  systolicPreserve: number;
  /** Soft-sim unwanted systemic spillover (0–1). */
  systemicSpillover: number;
  /** Soft-sim broad phosphorylation coverage (0–1). */
  phosphorylationCoverage: number;
  /** Soft-sim assay signal fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming IND/NDA / dosing / clinical diagnosis (0–1). */
  overclaimRisk: number;
  targetBias: TargetBias;
  profile: TargetProfile;
};

export type NanodomainQuality = {
  mode: ScoreMode;
  localizationScore: number;
  diastolicScore: number;
  systolicScore: number;
  spilloverPenalty: number;
  phosphorylationScore: number;
  confidence: number;
  nanodomainContribution: number;
  systemicContribution: number;
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
  bias: TargetBias,
  lane: Exclude<TargetBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function spilloverDrag(
  systemicSpillover: number,
  phosphorylationCoverage: number,
): number {
  return clamp(systemicSpillover * 0.6 + phosphorylationCoverage * 0.25, 0, 1.5);
}
