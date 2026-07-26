export type CareProfile =
  | "therapist_supported_icbt"
  | "waitlist_self_guided_baseline";

export type ScoreMode = CareProfile;

export type CareBias =
  | "therapist_first"
  | "balanced"
  | "self_guided_first"
  | "waitlist_first";

export type CohortKind =
  | "community_older_adults"
  | "primary_care_referral"
  | "memory_clinic_adjacent"
  | "mixed_anxiety_depression"
  | "custom";

export type ModuleKind =
  | "psychoeducation"
  | "behavioral_activation"
  | "cognitive_restructuring"
  | "relapse_prevention"
  | "custom";

export type SessionKind =
  | "guided_checkin"
  | "module_walkthrough"
  | "homework_review"
  | "booster"
  | "custom";

/**
 * Soft-simulation inputs for therapist-supported iCBT vs waitlist /
 * self-guided baseline. Method-lab scoring only — not clinical diagnosis,
 * not live therapist replacement, not regulated digital therapeutic clearance.
 */
export type CareInput = {
  /** Soft-sim fidelity of therapist support touchpoints (0–1). */
  therapistSupportFidelity: number;
  /** Soft-sim module path completion (0–1). */
  moduleCompletion: number;
  /** Soft-sim engagement / adherence (0–1). */
  engagementAdherence: number;
  /** Soft-sim symptom-relief signal (0–1). */
  symptomReliefSignal: number;
  /** Soft-sim co-design fit with older adults (0–1). */
  coDesignFit: number;
  /** Soft-sim dropout risk (0–1). */
  dropoutRisk: number;
  /** Soft-sim session signal fidelity (0–1). */
  sessionSignal: number;
  /** Risk of claiming diagnosis / therapist replacement / clearance (0–1). */
  overclaimRisk: number;
  careBias: CareBias;
  profile: CareProfile;
};

export type CareQuality = {
  mode: ScoreMode;
  supportScore: number;
  completionScore: number;
  engagementScore: number;
  reliefScore: number;
  dropoutPenalty: number;
  confidence: number;
  therapistContribution: number;
  waitlistContribution: number;
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
  bias: CareBias,
  lane: Exclude<CareBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function supportLoad(
  therapistSupportFidelity: number,
  engagementAdherence: number,
): number {
  return clamp(
    therapistSupportFidelity * 0.55 + engagementAdherence * 0.45 - 0.15,
    0,
    1.5,
  );
}
