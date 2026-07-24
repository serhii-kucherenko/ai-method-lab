export type SynthesisProfile = "balanced" | "rigorous";

export type ScoreMode = "agentic" | "adhoc";

/**
 * Soft-simulation inputs for agentic meta-analysis plan quality.
 * Method-lab model only — not a live PubMed API or publication-ready stats package.
 * Never brand as AutoSynthesis.
 */
export type SynthesisInput = {
  /** How clear and PICO-complete the review question is (0–1). */
  questionClarity: number;
  /** Breadth / recall of the search strategy (0–1). */
  searchBreadth: number;
  /** Screen discipline — dual review, inclusion rules (0–1). */
  screenDiscipline: number;
  /** Completeness of effect extraction (0–1). */
  extractionCompleteness: number;
  /** Studies available after screening (1–100). */
  studyCount: number;
  /** Precision of reported effects / CIs (0–1). */
  effectPrecision: number;
  /** Whether heterogeneity is planned and checked (0–1). */
  heterogeneityAware: number;
  /** Quality of pooling method choice (0–1). */
  poolingQuality: number;
  /** Strictness of inclusion / exclusion criteria (0–1). */
  inclusionStrictness: number;
  /** Duplicate / overlapping study control (0–1). */
  duplicateControl: number;
  /** Risk-of-bias assessment depth (0–1). */
  biasAssessment: number;
  profile: SynthesisProfile;
};

export type SynthesisQuality = {
  mode: ScoreMode;
  planQuality: number;
  screenCoverage: number;
  extractionFidelity: number;
  pooledConfidence: number;
  heterogeneityScore: number;
  auditTrail: number;
  overall: number;
};

export type PipelineReadiness = {
  questionReady: boolean;
  searchReady: boolean;
  screenReady: boolean;
  extractReady: boolean;
  poolReady: boolean;
  overallReady: boolean;
  screenGap: number;
  heteroGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: SynthesisQuality,
  input: SynthesisInput,
): PipelineReadiness {
  const screenTarget =
    54 + input.screenDiscipline * 22 + input.inclusionStrictness * 12;
  const heteroTarget =
    50 + input.heterogeneityAware * 24 + input.poolingQuality * 12;
  const screenGap = round2(screenTarget - quality.screenCoverage);
  const heteroGap = round2(heteroTarget - quality.heterogeneityScore);
  const questionReady =
    quality.planQuality >= 48 + input.questionClarity * 20;
  const searchReady = quality.planQuality >= 44 + input.searchBreadth * 18;
  const screenReady = quality.screenCoverage >= screenTarget - 8;
  const extractReady =
    quality.extractionFidelity >= 46 + input.extractionCompleteness * 20;
  const poolReady = quality.pooledConfidence >= 48 + input.effectPrecision * 16;
  return {
    questionReady,
    searchReady,
    screenReady,
    extractReady,
    poolReady,
    overallReady:
      questionReady && searchReady && screenReady && extractReady && poolReady,
    screenGap,
    heteroGap,
  };
}
