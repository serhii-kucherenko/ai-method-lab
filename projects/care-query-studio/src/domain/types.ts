export type CareQueryProfile =
  | "multilingual_poc_llm_answers"
  | "local_clinician_baseline";

export type ScoreMode = CareQueryProfile;

export type QueryBias =
  | "llm_first"
  | "balanced"
  | "locale_first"
  | "clinician_first";

export type LocaleKind =
  | "yoruba"
  | "hausa"
  | "igbo"
  | "pidgin"
  | "english"
  | "custom";

/**
 * Soft-simulation inputs for multilingual point-of-care medical query LLMs
 * vs local clinician baselines.
 * Method-lab scoring only — not clinical diagnostic use, not live EHR
 * write-back, not FDA clearance, not NigBench, not the authors' system.
 */
export type CareQueryInput = {
  /** Soft-sim multilingual language coverage on POC queries (0–1). */
  languageCoverage: number;
  /** Soft-sim clinical fidelity of LLM answers (0–1). */
  clinicalFidelity: number;
  /** Soft-sim locale / dialect grounding quality (0–1). */
  localeGrounding: number;
  /** Soft-sim answer completeness for bedside questions (0–1). */
  answerCompleteness: number;
  /** Local clinician baseline confidence — path B fuel (0–1). */
  clinicianConfidence: number;
  /** Optimism that LLM packs “just work” without clinician baseline (0–1). */
  baselineOptimism: number;
  /** Hardness of the multilingual POC medical query (0–1). */
  queryHardness: number;
  /** Risk of claiming diagnostic / EHR / FDA / NigBench (0–1). */
  overclaimRisk: number;
  queryBias: QueryBias;
  profile: CareQueryProfile;
};

export type CareQueryQuality = {
  mode: ScoreMode;
  languageScore: number;
  fidelityScore: number;
  localeScore: number;
  completenessScore: number;
  clinicianScore: number;
  confidence: number;
  llmContribution: number;
  clinicianContribution: number;
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
  bias: QueryBias,
  lane: Exclude<QueryBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function queryLoad(
  queryHardness: number,
  localeGrounding: number,
): number {
  return clamp(queryHardness * (1.25 - localeGrounding * 0.5), 0, 1.5);
}
