export type TherapyProfile =
  | "structured_therapy_safety_gates"
  | "prompt_only_safety_baseline";

export type ScoreMode = TherapyProfile;

export type TherapyBias =
  | "gates_first"
  | "balanced"
  | "refusal_first"
  | "prompt_first";

export type ScenarioKind =
  | "suicidality"
  | "self_harm"
  | "psychosis"
  | "boundary_push"
  | "custom";

/**
 * Soft-simulation inputs for structured therapy-safety gates
 * vs prompt-only safety baselines on high-risk psychiatric scenarios.
 * Method-lab scoring only — not clinical therapy, not a crisis hotline,
 * not live patient chat write-back, not FDA clearance, not the authors' system.
 */
export type TherapyInput = {
  /** Soft-sim structured gate coverage of risk patterns (0–1). */
  gateCoverage: number;
  /** Soft-sim refusal / redirect strength (0–1). */
  refusalStrength: number;
  /** Soft-sim crisis-escalation routing quality (0–1). */
  crisisEscalation: number;
  /** Soft-sim therapeutic boundary clarity (0–1). */
  boundaryClarity: number;
  /** Prompt-only confidence — path B fuel (0–1). */
  promptOnlyConfidence: number;
  /** Optimism that prompt engineering alone “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the high-risk psychiatric scenario (0–1). */
  scenarioHardness: number;
  /** Risk of claiming clinical therapy / crisis line / FDA (0–1). */
  overclaimRisk: number;
  therapyBias: TherapyBias;
  profile: TherapyProfile;
};

export type TherapyQuality = {
  mode: ScoreMode;
  gateScore: number;
  refusalScore: number;
  crisisScore: number;
  boundaryScore: number;
  promptOnlyScore: number;
  confidence: number;
  gatesContribution: number;
  promptContribution: number;
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

export function scenarioLoad(
  scenarioHardness: number,
  refusalStrength: number,
): number {
  return clamp(scenarioHardness * (1.25 - refusalStrength * 0.5), 0, 1.5);
}
