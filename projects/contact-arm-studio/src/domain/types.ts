export type ContactProfile = "contact_centric" | "vision_only";

export type ScoreMode = "contact_centric" | "vision_only";

export type ContactBias =
  | "contact_strict"
  | "balanced"
  | "tactile_first"
  | "vision_first";

export type OutcomeLabel = "negative" | "indeterminate" | "positive" | "critical";

/**
 * Soft-simulation inputs for contact-centric tactile+vision vs vision-only baseline.
 * Method-lab scoring only — not live robot control or safety certification.
 */
export type ContactArmInput = {
  /** Fraction of planned contact surface that is sensed (0–1). */
  contactCoverage: number;
  /** Importance of tactile cues for the planned contact (0–1). */
  tactileSalience: number;
  /** How well the plan matches manipulator workspace (0–1). */
  planFit: number;
  /** Agreement of contact outcomes with gold under sensing cues (0–1). */
  sensingAgreement: number;
  /** Vision-only accuracy proxy — baseline B fuel (0–1). */
  visionOnlyAccuracy: number;
  /** Optimism that vision alone recovers missing tactile (0–1). Inflates B. */
  visionOptimism: number;
  /** Severity of contact uncertainty pressure (0–1, higher = harder for A). */
  contactPressure: number;
  /** Risk of leaking unavailable force/torque into the score (0–1). */
  leakageRisk: number;
  contactBias: ContactBias;
  profile: ContactProfile;
};

export type ContactArmQuality = {
  mode: ScoreMode;
  contactDiagnosis: number;
  tactileDiagnosis: number;
  planReasonScore: number;
  sensingIntegrity: number;
  visionOnlyScore: number;
  confidence: number;
  contactContribution: number;
  visionContribution: number;
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
  bias: ContactBias,
  lane: Exclude<ContactBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function contactLoad(
  contactPressure: number,
  contactCoverage: number,
): number {
  return clamp(contactPressure * (1.25 - contactCoverage * 0.5), 0, 1.5);
}
