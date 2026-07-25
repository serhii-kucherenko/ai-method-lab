export type SufficiencyProfile = "partial_observation" | "full_feature";

export type ScoreMode = "partial_observation" | "full_feature";

export type SufficiencyBias =
  | "mask_strict"
  | "balanced"
  | "coverage_first"
  | "full_first";

export type OutcomeLabel = "negative" | "indeterminate" | "positive" | "critical";

/**
 * Soft-simulation inputs for partial-observation sufficiency vs full-feature baseline.
 * Method-lab scoring only — not clinical advice or FDA-cleared decision support.
 */
export type FeatureSufficiencyInput = {
  /** Fraction of the feature pack that is observed under the mask (0–1). */
  maskCoverage: number;
  /** Importance / predictive weight of the present features (0–1). */
  featureSalience: number;
  /** How well the cohort case matches training distribution (0–1). */
  cohortFit: number;
  /** Label agreement with gold under the observation mask (0–1). */
  labelAgreement: number;
  /** Full-feature accuracy proxy — baseline B fuel (0–1). */
  fullFeatureAccuracy: number;
  /** Optimism that missing features can be imputed as observed (0–1). Inflates B. */
  imputationOptimism: number;
  /** Severity of missingness pressure (0–1, higher = harder for partial path). */
  missingnessPressure: number;
  /** Risk of leaking unavailable / future features into the score (0–1). */
  leakageRisk: number;
  sufficiencyBias: SufficiencyBias;
  profile: SufficiencyProfile;
};

export type FeatureSufficiencyQuality = {
  mode: ScoreMode;
  coverageDiagnosis: number;
  salienceDiagnosis: number;
  sufficiencyReasonScore: number;
  cohortIntegrity: number;
  fullFeatureScore: number;
  confidence: number;
  partialContribution: number;
  fullContribution: number;
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
  bias: SufficiencyBias,
  lane: Exclude<SufficiencyBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function missingnessLoad(
  missingnessPressure: number,
  maskCoverage: number,
): number {
  return clamp(missingnessPressure * (1.25 - maskCoverage * 0.5), 0, 1.5);
}
