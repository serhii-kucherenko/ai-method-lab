export type HccProfile = "clinical_reasoning" | "non_reasoning_baseline";

export type ScoreMode = HccProfile;

export type HccBias =
  | "reasoning_strict"
  | "balanced"
  | "reasoner_first"
  | "baseline_first";

export type OutcomeLabel =
  | "low_risk"
  | "indeterminate"
  | "elevated"
  | "critical";

/**
 * Soft-simulation inputs for clinical-reasoning HCC risk vs non-reasoning baselines.
 * Method-lab scoring only — not CDS, not live EHR write-back.
 */
export type HccInput = {
  /** How completely the pathway pack covers the clinical route (0–1). */
  pathwayCoverage: number;
  /** How faithfully clinical cues are captured for reasoning (0–1). */
  clinicalCueFidelity: number;
  /** How well cues match the locked risk schema (0–1). */
  schemaFit: number;
  /** Depth / coherence of the clinical reasoning chain (0–1). */
  reasoningDepth: number;
  /** Non-reasoning baseline accuracy proxy — baseline B fuel (0–1). */
  baselineAccuracy: number;
  /** Optimism that shortcuts recover risk without reasoning (0–1). */
  shortcutOptimism: number;
  /** Case hardness / atypical presentation load (0–1, higher = harder for A). */
  caseHardness: number;
  /** Risk of leaking CDS / live-EHR claims into the score (0–1). */
  leakageRisk: number;
  hccBias: HccBias;
  profile: HccProfile;
};

export type HccQuality = {
  mode: ScoreMode;
  riskStratification: number;
  reasoningDiagnosis: number;
  schemaReasonScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  reasoningContribution: number;
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
  bias: HccBias,
  lane: Exclude<HccBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function caseLoad(caseHardness: number, pathwayCoverage: number): number {
  return clamp(caseHardness * (1.25 - pathwayCoverage * 0.5), 0, 1.5);
}
