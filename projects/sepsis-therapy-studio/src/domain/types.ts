export type SepsisTherapyProfile =
  | "ct_hmm_therapy_effectiveness"
  | "static_guideline_baseline";

export type ScoreMode = SepsisTherapyProfile;

export type TherapyBias =
  | "hmm_first"
  | "balanced"
  | "regimen_first"
  | "guideline_first";

export type RegimenKind =
  | "broad_spectrum_empiric"
  | "escalation_narrowing"
  | "source_directed"
  | "custom";

/**
 * Soft-simulation inputs for continuous-time HMM antibiotic therapy
 * effectiveness vs static guideline baselines.
 * Method-lab scoring only — not clinical diagnostic use,
 * not live EHR write-back, not FDA clearance,
 * not the authors' system.
 */
export type SepsisTherapyInput = {
  /** Soft-sim onset-window coverage before culture return (0–1). */
  onsetCoverage: number;
  /** Soft-sim antibiotic regimen encoding fidelity (0–1). */
  regimenFidelity: number;
  /** Soft-sim continuous-time HMM latent-state clarity (0–1). */
  hmmStateClarity: number;
  /** Soft-sim therapy pack completeness (0–1). */
  packCompleteness: number;
  /** Static guideline adherence strength — path B fuel (0–1). */
  guidelineAdherence: number;
  /** Optimism that waiting for culture is enough (0–1). */
  cultureLagOptimism: number;
  /** Hardness of the early-sepsis therapy case (0–1). */
  sepsisHardness: number;
  /** Risk of claiming diagnostic / EHR write-back / FDA (0–1). */
  overclaimRisk: number;
  therapyBias: TherapyBias;
  profile: SepsisTherapyProfile;
};

export type SepsisTherapyQuality = {
  mode: ScoreMode;
  onsetScore: number;
  regimenScore: number;
  hmmScore: number;
  completenessScore: number;
  guidelineScore: number;
  confidence: number;
  ctHmmContribution: number;
  guidelineContribution: number;
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
  bias: TherapyBias,
  lane: Exclude<TherapyBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function sepsisLoad(
  sepsisHardness: number,
  hmmStateClarity: number,
): number {
  return clamp(sepsisHardness * (1.25 - hmmStateClarity * 0.5), 0, 1.5);
}
