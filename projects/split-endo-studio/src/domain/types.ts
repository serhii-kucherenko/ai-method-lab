export type ApproachProfile =
  | "one_hole_split_endoscopy"
  | "open_laminectomy";

export type ScoreMode = ApproachProfile;

export type ApproachBias =
  | "blood_loss_first"
  | "balanced"
  | "stay_first"
  | "open_first";

export type CaseKind =
  | "thoracic_olf_t9_10"
  | "thoracic_olf_t10_11"
  | "thoracic_olf_t11_12"
  | "single_level_blend"
  | "custom";

export type ApproachKind =
  | "one_hole_split"
  | "open_laminectomy"
  | "hybrid_compare"
  | "custom";

export type OutcomeKind =
  | "blood_loss"
  | "length_of_stay"
  | "complication_rate"
  | "operative_time"
  | "recovery_delta"
  | "custom";

/**
 * Soft-simulation inputs for one-hole split endoscopy vs open laminectomy
 * for single-level thoracic ossification of the ligamentum flavum (OLF).
 * Method-lab scoring only — not live OR control, not device clearance,
 * not clinical advice.
 */
export type EndoInput = {
  /** Soft-sim estimated blood loss index (0–1; higher = worse). */
  bloodLoss: number;
  /** Soft-sim operative time index (0–1; higher = longer). */
  operativeTime: number;
  /** Soft-sim length-of-stay index (0–1; higher = longer stay). */
  hospitalStay: number;
  /** Soft-sim complication risk (0–1; higher = worse). */
  complicationRate: number;
  /** Soft-sim decompression / canal relief quality (0–1). */
  decompressionQuality: number;
  /** Soft-sim early recovery signal (0–1). */
  recoverySignal: number;
  /** Soft-sim assay / evidence fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming live OR / device / clinical authority (0–1). */
  overclaimRisk: number;
  approachBias: ApproachBias;
  profile: ApproachProfile;
};

export type EndoQuality = {
  mode: ScoreMode;
  bloodLossScore: number;
  stayScore: number;
  safetyScore: number;
  recoveryScore: number;
  openPenalty: number;
  confidence: number;
  oseContribution: number;
  openContribution: number;
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
  bias: ApproachBias,
  lane: Exclude<ApproachBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function burdenLoad(
  bloodLoss: number,
  hospitalStay: number,
  complicationRate: number,
): number {
  return clamp(
    bloodLoss * 0.4 + hospitalStay * 0.35 + complicationRate * 0.25 - 0.08,
    0,
    1.5,
  );
}
