export type AsyncNeuroProfile =
  | "standardized_async_video_exam"
  | "ad_hoc_exam_baseline";

export type ScoreMode = AsyncNeuroProfile;

export type ExamBias =
  | "protocol_first"
  | "balanced"
  | "site_first"
  | "ad_hoc_first";

export type SiteKind =
  | "academic"
  | "community"
  | "memory_clinic"
  | "satellite"
  | "custom";

export type ProtocolKind =
  | "cranial_nerve"
  | "motor"
  | "gait"
  | "cognitive_screen"
  | "full_async"
  | "custom";

/**
 * Soft-simulation inputs for standardized async video neurological exams
 * vs ad-hoc exam baselines in multi-center AD/ADRD studies.
 * Method-lab scoring only — not clinical diagnostic, not live telehealth
 * write-back, not FDA clearance, not VANE brand.
 */
export type AsyncNeuroInput = {
  /** Soft-sim fidelity to the locked async exam protocol (0–1). */
  protocolFidelity: number;
  /** Soft-sim consistency across study sites (0–1). */
  siteConsistency: number;
  /** Soft-sim completeness of asynchronous video capture (0–1). */
  videoCompleteness: number;
  /** Soft-sim pack readiness for exam lock (0–1). */
  packReadiness: number;
  /** Ad-hoc exam adherence — path B fuel (0–1). */
  adHocAdherence: number;
  /** Capture noise / lighting / framing hardness (0–1). */
  captureNoise: number;
  /** Examiner drift when sites improvise the exam (0–1). */
  examinerDrift: number;
  /** Risk of claiming clinical diagnostic / telehealth / FDA / VANE (0–1). */
  overclaimRisk: number;
  examBias: ExamBias;
  profile: AsyncNeuroProfile;
};

export type AsyncNeuroQuality = {
  mode: ScoreMode;
  protocolScore: number;
  siteScore: number;
  videoScore: number;
  readinessScore: number;
  adHocScore: number;
  confidence: number;
  standardizedContribution: number;
  adHocContribution: number;
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
  bias: ExamBias,
  lane: Exclude<ExamBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function examLoad(captureNoise: number, videoCompleteness: number): number {
  return clamp(captureNoise * (1.25 - videoCompleteness * 0.5), 0, 1.5);
}
