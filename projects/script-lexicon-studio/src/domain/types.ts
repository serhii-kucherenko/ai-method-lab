export type LexiconProfile =
  | "expanded_geez_lexicon"
  | "baseline_multilingual";

export type ScoreMode =
  | "expanded_geez_lexicon"
  | "baseline_multilingual";

export type LexiconBias =
  | "script_strict"
  | "balanced"
  | "lexicon_first"
  | "baseline_first";

export type OutcomeLabel =
  | "negative"
  | "indeterminate"
  | "positive"
  | "critical";

/**
 * Soft-simulation inputs for expanded Ge'ez-script lexicon vs baseline multilingual tokenizer.
 * Method-lab scoring only — not production MT certification.
 */
export type ScriptLexiconInput = {
  /** Fraction of Ge'ez-script subword space covered by the expansion (0–1). */
  lexiconCoverage: number;
  /** How faithful the expanded lexicon embeddings are (0–1). */
  expansionFidelity: number;
  /** How well the lexicon matches Amharic / Tigrinya script needs (0–1). */
  scriptFit: number;
  /** Agreement of expanded-lexicon outcomes with gold under expansion plan (0–1). */
  subwordAgreement: number;
  /** Baseline multilingual tokenizer accuracy proxy — baseline B fuel (0–1). */
  baselineAccuracy: number;
  /** Optimism that baseline XLM-style tokenizers recover missing script signal (0–1). Inflates B. */
  multilingualOptimism: number;
  /** Severity of hard morphology / script fragmentation (0–1, higher = harder for A). */
  morphologyHardness: number;
  /** Risk of leaking production MT quality claims into the score (0–1). */
  leakageRisk: number;
  lexiconBias: LexiconBias;
  profile: LexiconProfile;
};

export type ScriptLexiconQuality = {
  mode: ScoreMode;
  coverageDiagnosis: number;
  expansionDiagnosis: number;
  scriptReasonScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  lexiconContribution: number;
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
  bias: LexiconBias,
  lane: Exclude<LexiconBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function morphologyLoad(
  morphologyHardness: number,
  lexiconCoverage: number,
): number {
  return clamp(morphologyHardness * (1.25 - lexiconCoverage * 0.5), 0, 1.5);
}
