export type AccessEquityProfile =
  | "equity_access_task_sharing"
  | "accuracy_only_classifier";

export type ScoreMode = AccessEquityProfile;

export type EquityBias =
  | "access_first"
  | "balanced"
  | "task_sharing_first"
  | "accuracy_first";

export type CohortKind =
  | "community"
  | "clinic"
  | "school"
  | "tele_screen"
  | "custom";

export type ScreenKind =
  | "caregiver_report"
  | "brief_observation"
  | "task_shared"
  | "digital_probe"
  | "custom";

export type PathwayStage =
  | "outreach"
  | "screen"
  | "triage"
  | "referral"
  | "follow_up";

/**
 * Soft-simulation inputs for equity-access autism screening pathways
 * vs accuracy-only classification baselines.
 * Method-lab scoring only — not clinical diagnostic, not live EHR write-back,
 * not FDA clearance, not an autism diagnosis product.
 */
export type AccessEquityInput = {
  /** Soft-sim access reach across underserved cohorts (0–1). */
  accessReach: number;
  /** Soft-sim equity gap closure across strata (0–1). */
  equityGapClosure: number;
  /** Soft-sim task-sharing fidelity with community roles (0–1). */
  taskSharingFidelity: number;
  /** Soft-sim pathway pack readiness for lock (0–1). */
  packReadiness: number;
  /** Accuracy-only classifier adherence — path B fuel (0–1). */
  accuracyAdherence: number;
  /** Screening noise / missingness hardness (0–1). */
  screenNoise: number;
  /** Accuracy tunnel vision when teams ignore access (0–1). */
  accuracyTunnel: number;
  /** Risk of claiming clinical diagnostic / EHR / FDA / diagnosis (0–1). */
  overclaimRisk: number;
  equityBias: EquityBias;
  profile: AccessEquityProfile;
};

export type AccessEquityQuality = {
  mode: ScoreMode;
  accessScore: number;
  equityScore: number;
  sharingScore: number;
  readinessScore: number;
  accuracyScore: number;
  confidence: number;
  equityAccessContribution: number;
  accuracyOnlyContribution: number;
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
  bias: EquityBias,
  lane: Exclude<EquityBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function accessLoad(screenNoise: number, accessReach: number): number {
  return clamp(screenNoise * (1.25 - accessReach * 0.5), 0, 1.5);
}
