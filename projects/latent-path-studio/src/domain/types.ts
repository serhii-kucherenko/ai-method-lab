export type LatentPathProfile =
  | "multi_domain_latent_trajectory"
  | "single_domain_baseline";

export type ScoreMode = LatentPathProfile;

export type PathBias =
  | "joint_first"
  | "balanced"
  | "predictor_first"
  | "single_domain_first";

export type CohortKind =
  | "school"
  | "clinic"
  | "community"
  | "digital_screen"
  | "custom";

export type PredictorKind =
  | "internalizing"
  | "externalizing"
  | "psychotic_like"
  | "socio_demo"
  | "joint_set"
  | "custom";

/**
 * Soft-simulation inputs for multi-dimensional latent adolescent symptom
 * trajectories vs single-domain baselines.
 * Method-lab scoring only — not clinical diagnostic, not crisis intervention,
 * not live EHR write-back, not suicide-risk clearance.
 */
export type LatentPathInput = {
  /** Soft-sim coverage across symptom domains (0–1). */
  multiDomainCoverage: number;
  /** Soft-sim clarity of joint latent classes (0–1). */
  jointClassClarity: number;
  /** Soft-sim separation of trajectory paths over time (0–1). */
  trajectorySeparation: number;
  /** Soft-sim pack readiness for cohort lock (0–1). */
  packReadiness: number;
  /** Single-domain adherence — path B fuel (0–1). */
  singleDomainAdherence: number;
  /** Predictor noise / missingness hardness (0–1). */
  predictorNoise: number;
  /** Domain isolation when teams model one symptom family alone (0–1). */
  domainIsolation: number;
  /** Risk of claiming clinical diagnostic / crisis / EHR / suicide clearance (0–1). */
  overclaimRisk: number;
  pathBias: PathBias;
  profile: LatentPathProfile;
};

export type LatentPathQuality = {
  mode: ScoreMode;
  coverageScore: number;
  classScore: number;
  trajectoryScore: number;
  readinessScore: number;
  singleDomainScore: number;
  confidence: number;
  multiDomainContribution: number;
  singleDomainContribution: number;
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
  bias: PathBias,
  lane: Exclude<PathBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function pathLoad(
  predictorNoise: number,
  multiDomainCoverage: number,
): number {
  return clamp(predictorNoise * (1.25 - multiDomainCoverage * 0.5), 0, 1.5);
}
