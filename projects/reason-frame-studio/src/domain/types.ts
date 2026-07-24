export type DomainKind =
  | "physics"
  | "chemistry"
  | "biology"
  | "math"
  | "materials";

export type PlanKind = "multi_agent" | "single_agent";

export type ScoreMode = "multi_agent" | "single_agent";

/**
 * Soft-simulation inputs for game-theoretic multi-agent scientific checks.
 * Method-lab model only — not a live LLM gateway or production G-Frame.
 */
export type ReasonInput = {
  /** How completely the rule pack covers the claim domain (0–1). */
  ruleCoverage: number;
  /** Depth / quality of multi-agent debate rounds (0–1). */
  debateDepth: number;
  /** Post-game team consensus strength (0–1). */
  consensusStrength: number;
  /** Adversarial challenger pressure (0–1). */
  challengerPressure: number;
  /** Bayesian belief-update quality (0–1). */
  bayesianUpdate: number;
  /** Evidence / rule citation grounding (0–1). */
  evidenceGrounding: number;
  /** Reliance on fluent wording alone (0–1, higher = worse for multi-agent). */
  fluencyBias: number;
  /** Game-theoretic team coordination (0–1). */
  teamCoordination: number;
  /** Prior belief confidence before debate (0–1). */
  priorConfidence: number;
  /** Contradiction rate across agent turns (0–1, higher = worse). */
  contradictionRate: number;
  domainKind: DomainKind;
  plan: PlanKind;
};

export type ReasonQuality = {
  mode: ScoreMode;
  ruleFidelity: number;
  debateIntegrity: number;
  gameScore: number;
  hallucinationResistance: number;
  planCoherence: number;
  overall: number;
};

export type DebateReadiness = {
  rulesReady: boolean;
  debateReady: boolean;
  scoringReady: boolean;
  flagsReady: boolean;
  overallReady: boolean;
  singleAgentPenalty: number;
  multiAgentGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: ReasonQuality,
  input: ReasonInput,
): DebateReadiness {
  const singleAgentPenalty = round2(
    input.plan === "single_agent"
      ? (1 - input.ruleCoverage) * 26 + input.fluencyBias * 22
      : (1 - input.ruleCoverage) * 6,
  );
  const multiAgentGap = round2(Math.max(0, 68 - quality.hallucinationResistance));
  const rulesReady = quality.ruleFidelity >= 48 + input.ruleCoverage * 22;
  const debateReady =
    quality.debateIntegrity >= 50 + input.debateDepth * 20;
  const scoringReady =
    quality.gameScore >= 46 + input.bayesianUpdate * 20;
  const flagsReady =
    quality.hallucinationResistance >= 44 + (1 - input.fluencyBias) * 18;
  return {
    rulesReady,
    debateReady,
    scoringReady,
    flagsReady,
    overallReady: rulesReady && debateReady && scoringReady && flagsReady,
    singleAgentPenalty,
    multiAgentGap,
  };
}
