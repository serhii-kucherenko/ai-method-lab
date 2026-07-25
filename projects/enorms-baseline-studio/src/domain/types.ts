export type EnormsProfile =
  | "patient_specific_enorms"
  | "population_norm_baseline";

export type ScoreMode = EnormsProfile;

export type EnormsBias =
  | "patient_first"
  | "balanced"
  | "coverage_first"
  | "population_first";

export type ChannelKind =
  | "bipolar"
  | "referential"
  | "laplacian"
  | "mixed"
  | "montage_custom";

/**
 * Soft-simulation inputs for patient-specific E-norms baselines vs
 * population-norm baselines for pediatric seizure detection.
 * Method-lab scoring only — not clinical diagnostic use, not live EEG
 * device control, not FDA cleared, not the authors' system.
 */
export type EnormsInput = {
  /** How well E-norms fit this patient's resting EEG (0–1). */
  patientNormFit: number;
  /** Channel montage coverage breadth (0–1). */
  channelCoverage: number;
  /** Stability of patient-specific norms across sessions (0–1). */
  enormsStability: number;
  /** Seizure-detection sensitivity proxy under the pack (0–1). */
  detectionSensitivity: number;
  /** Population-norm match pass-rate proxy — path B fuel (0–1). */
  populationMatchRate: number;
  /** Optimism that population norms “just work” (0–1). */
  populationOptimism: number;
  /** Seizure detection hardness / ambiguity (0–1). */
  seizureHardness: number;
  /** Risk of claiming clinical diagnostic / live EEG / FDA use (0–1). */
  overclaimRisk: number;
  enormsBias: EnormsBias;
  profile: EnormsProfile;
};

export type EnormsQuality = {
  mode: ScoreMode;
  patientFitScore: number;
  coverageScore: number;
  stabilityScore: number;
  detectionIntegrity: number;
  populationBaselineScore: number;
  confidence: number;
  patientContribution: number;
  populationContribution: number;
  overall: number;
};

export type PackReadiness = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackReadiness {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: EnormsBias,
  lane: Exclude<EnormsBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function seizureLoad(
  seizureHardness: number,
  patientNormFit: number,
): number {
  return clamp(seizureHardness * (1.25 - patientNormFit * 0.5), 0, 1.5);
}
