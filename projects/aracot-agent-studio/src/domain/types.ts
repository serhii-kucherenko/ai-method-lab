export type AgentProfile =
  | "arabic_cot_distilled_agent"
  | "nondistilled_multilingual_baseline";

export type ScoreMode = AgentProfile;

export type AgentBias =
  | "cot_first"
  | "balanced"
  | "distill_first"
  | "baseline_first";

export type TraceKind =
  | "arabic_cot"
  | "multilingual_prompt"
  | "tool_use"
  | "mixed_cot"
  | "custom";

/**
 * Soft-simulation inputs for Arabic CoT distilled agents vs
 * non-distilled multilingual baselines.
 * Method-lab scoring only — not production Arabic LLM deployment,
 * not live customer chat write-back, not the authors' system.
 */
export type AgentInput = {
  /** Quality of Arabic chain-of-thought steps (0–1). */
  cotStepQuality: number;
  /** Arabic language fluency in agent responses (0–1). */
  arabicFluency: number;
  /** How faithfully distillation transfers CoT behavior (0–1). */
  distillFidelity: number;
  /** Agent grounding on tools / tasks (0–1). */
  agentGrounding: number;
  /** Non-distilled multilingual coverage — path B fuel (0–1). */
  multilingualCoverage: number;
  /** Optimism that non-distilled multilingual “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of Arabic step-by-step reasoning (0–1). */
  reasoningHardness: number;
  /** Risk of claiming production LLM / live chat write-back (0–1). */
  overclaimRisk: number;
  agentBias: AgentBias;
  profile: AgentProfile;
};

export type AgentQuality = {
  mode: ScoreMode;
  cotScore: number;
  arabicScore: number;
  distillScore: number;
  groundingIntegrity: number;
  baselineScore: number;
  confidence: number;
  distilledContribution: number;
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
  bias: AgentBias,
  lane: Exclude<AgentBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function reasoningLoad(
  reasoningHardness: number,
  distillFidelity: number,
): number {
  return clamp(reasoningHardness * (1.25 - distillFidelity * 0.5), 0, 1.5);
}
