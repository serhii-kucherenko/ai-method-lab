export type CvdProfile = "federated_cvd_risk" | "centralized_baseline";

export type ScoreMode = CvdProfile;

export type CvdBias =
  | "federation_strict"
  | "balanced"
  | "federated_first"
  | "central_first";

export type OutcomeLabel =
  | "low_risk"
  | "indeterminate"
  | "elevated"
  | "critical";

/**
 * Soft-simulation inputs for federated CVD risk vs centralized baselines.
 * Method-lab scoring only — not FDA-cleared software or live EHR write-back.
 */
export type CvdInput = {
  /** Fraction of federation sites actively contributing updates (0–1). */
  siteParticipation: number;
  /** How faithfully CVD features are captured across sites (0–1). */
  featureFidelity: number;
  /** How well features match the locked schema (0–1). */
  schemaFit: number;
  /** Agreement of federated model rounds across sites (0–1). */
  federationAgreement: number;
  /** Centralized pooled-data accuracy proxy — baseline B fuel (0–1). */
  centralizedAccuracy: number;
  /** Optimism that a centralized model recovers risk without federation (0–1). */
  centralOptimism: number;
  /** Cross-site heterogeneity / non-IID hardness (0–1, higher = harder for A). */
  heterogeneityHardness: number;
  /** Risk of leaking FDA / live-EHR claims into the score (0–1). */
  leakageRisk: number;
  cvdBias: CvdBias;
  profile: CvdProfile;
};

export type CvdQuality = {
  mode: ScoreMode;
  riskDiagnosis: number;
  federationDiagnosis: number;
  schemaReasonScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  federationContribution: number;
  baselineContribution: number;
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
  bias: CvdBias,
  lane: Exclude<CvdBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function heterogeneityLoad(
  heterogeneityHardness: number,
  siteParticipation: number,
): number {
  return clamp(
    heterogeneityHardness * (1.25 - siteParticipation * 0.5),
    0,
    1.5,
  );
}
