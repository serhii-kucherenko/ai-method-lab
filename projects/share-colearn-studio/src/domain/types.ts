export type ColearnProfile =
  | "human_ai_colearning_labeling"
  | "ai_only_labeling_baseline";

export type ScoreMode = ColearnProfile;

export type LabelingBias =
  | "clinician_first"
  | "balanced"
  | "activity_first"
  | "ai_first";

export type LabelKind =
  | "das28"
  | "cadai"
  | "rapidity"
  | "composite"
  | "custom";

/**
 * Soft-simulation inputs for human–AI co-learning disease activity
 * labeling vs AI-only labeling baselines.
 * Method-lab scoring only — not clinical diagnostic use,
 * not live EHR write-back, not FDA cleared, not the authors' system.
 */
export type ColearnInput = {
  /** Clinician–AI agreement on activity labels (0–1). */
  clinicianAgreement: number;
  /** Soft-sim disease activity signal strength (0–1). */
  activitySignal: number;
  /** Soft-sim EHR chart completeness proxy (0–1). */
  ehrCompleteness: number;
  /** Soft-sim label stability across revisits (0–1). */
  labelStability: number;
  /** AI-only confidence — path B fuel (0–1). */
  aiOnlyConfidence: number;
  /** Optimism that AI-only labeling “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the labeling decision (0–1). */
  labelingHardness: number;
  /** Risk of claiming diagnostic use / write-back / FDA (0–1). */
  overclaimRisk: number;
  labelingBias: LabelingBias;
  profile: ColearnProfile;
};

export type ColearnQuality = {
  mode: ScoreMode;
  agreementScore: number;
  activityScore: number;
  ehrScore: number;
  stabilityIntegrity: number;
  aiOnlyScore: number;
  confidence: number;
  humanAiContribution: number;
  aiOnlyContribution: number;
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
  bias: LabelingBias,
  lane: Exclude<LabelingBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function labelingLoad(
  labelingHardness: number,
  ehrCompleteness: number,
): number {
  return clamp(labelingHardness * (1.25 - ehrCompleteness * 0.5), 0, 1.5);
}
