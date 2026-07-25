export type ReportProfile =
  | "multi_llm_collaborative"
  | "single_llm_baseline";

export type ScoreMode = ReportProfile;

export type ReportBias =
  | "collaborative_strict"
  | "balanced"
  | "multi_first"
  | "single_first";

export type OutcomeLabel =
  | "negative"
  | "indeterminate"
  | "positive"
  | "critical";

/**
 * Soft-simulation inputs for multi-LLM collaborative MRI report drafts vs single-LLM baselines.
 * Method-lab scoring only — not clinical decision support or live PACS.
 */
export type ReportInput = {
  /** Fraction of rare oncology findings covered by the collaborator panel (0–1). */
  collaboratorCoverage: number;
  /** How faithfully rare findings are captured in the draft (0–1). */
  findingFidelity: number;
  /** How well the draft matches the locked report schema (0–1). */
  schemaFit: number;
  /** Agreement across multi-LLM collaborators (0–1). */
  consensusAgreement: number;
  /** Single-LLM / solo baseline accuracy proxy — baseline B fuel (0–1). */
  singleModelAccuracy: number;
  /** Optimism that a single LLM recovers findings without collaboration (0–1). Inflates B. */
  soloOptimism: number;
  /** Severity of rare / subtle oncology findings (0–1, higher = harder for A). */
  rareFindingHardness: number;
  /** Risk of leaking CDS / live-PACS claims into the score (0–1). */
  leakageRisk: number;
  reportBias: ReportBias;
  profile: ReportProfile;
};

export type ReportQuality = {
  mode: ScoreMode;
  findingDiagnosis: number;
  collaboratorDiagnosis: number;
  schemaReasonScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  collaboratorContribution: number;
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
  bias: ReportBias,
  lane: Exclude<ReportBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function rareFindingLoad(
  rareFindingHardness: number,
  collaboratorCoverage: number,
): number {
  return clamp(rareFindingHardness * (1.25 - collaboratorCoverage * 0.5), 0, 1.5);
}
