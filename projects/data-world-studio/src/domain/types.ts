export type PlanProfile = "balanced" | "aggressive";

export type ScoreMode = "world-model" | "trial-error";

/**
 * Soft-simulation inputs for DS-agent world-model plan quality.
 * Method-lab forecast quality only — not a production LLM simulator SaaS.
 * Never brand as DSWorld.
 */
export type WorldInput = {
  /** How completely structured workspace state is modeled (0–1). */
  stateCoverage: number;
  /** Weight of cost signals in plan decisions (0–1). */
  costAwareness: number;
  /** How far ahead the plan looks before acting (0–1). */
  planHorizon: number;
  /** Lightweight simulation fidelity (0–1). */
  simFidelity: number;
  /** Input table / feature data cleanliness (0–1). */
  dataQuality: number;
  /** Feature richness available to the agent (0–1). */
  featureRichness: number;
  /** Baseline agent skill / prior competence (0–1). */
  agentSkill: number;
  /** Random retry thrashing / exploration noise (0–1). */
  explorationNoise: number;
  /** Remaining retry budget fraction (0–1). */
  retryBudget: number;
  /** Compute / wallet budget headroom (0–1). */
  computeBudget: number;
  /** Operation complexity pressure (0–1). */
  opComplexity: number;
  /** Planned operation steps (1–40). */
  stepCount: number;
  profile: PlanProfile;
};

export type WorldQuality = {
  mode: ScoreMode;
  outcomeAccuracy: number;
  costEfficiency: number;
  planQuality: number;
  simFit: number;
  wasteAvoided: number;
  confidence: number;
  overall: number;
};

export type ForecastReadiness = {
  stateReady: boolean;
  costReady: boolean;
  simReady: boolean;
  accuracyReady: boolean;
  overallReady: boolean;
  accuracyGap: number;
  wasteGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: WorldQuality,
  input: WorldInput,
): ForecastReadiness {
  const accuracyTarget = 58 + input.stateCoverage * 22 + input.simFidelity * 10;
  const wasteTarget = 55 + input.costAwareness * 25;
  const accuracyGap = round2(accuracyTarget - quality.outcomeAccuracy);
  const wasteGap = round2(wasteTarget - quality.wasteAvoided);
  const stateReady = quality.planQuality >= 55 + input.stateCoverage * 18;
  const costReady = quality.costEfficiency >= 52 + input.costAwareness * 20;
  const simReady = quality.simFit >= 50 + input.simFidelity * 22;
  const accuracyReady = quality.outcomeAccuracy >= accuracyTarget - 8;
  return {
    stateReady,
    costReady,
    simReady,
    accuracyReady,
    overallReady: stateReady && costReady && simReady && accuracyReady,
    accuracyGap,
    wasteGap,
  };
}
