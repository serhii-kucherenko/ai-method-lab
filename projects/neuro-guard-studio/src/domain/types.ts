export type PlanProfile = "balanced" | "aggressive";

export type ScoreMode = "neuro-agentic" | "reactive";

/**
 * Soft-simulation inputs for IIoT neuro-agentic defense plan quality.
 * Method-lab CPI quality only — not live ICS control or TimesFM SaaS.
 * Never brand as the paper’s Neuro-Agentic Control product.
 */
export type GuardInput = {
  /** Completeness of site sensor / time-series context (0–1). */
  sensorCoverage: number;
  /** Counterfactual physics injection fidelity (0–1). */
  physicsFidelity: number;
  /** How far the LLM defense planner looks before acting (0–1). */
  planHorizon: number;
  /** Observed threat / anomaly severity (0–1). */
  threatSeverity: number;
  /** Detector confidence in the anomaly (0–1). */
  anomalyConfidence: number;
  /** Latency headroom before actuators must move (0–1). */
  latencyBudget: number;
  /** Risk of a wrong actuator intervention (0–1). */
  actuatorRisk: number;
  /** Freshness of streaming context (0–1). */
  contextFreshness: number;
  /** Reactive threshold false-positive / thrash pressure (0–1). */
  thresholdNoise: number;
  /** Proposed containment / isolation depth (0–1). */
  isolationDepth: number;
  /** Downstream cascade risk if the wrong lever is pulled (0–1). */
  cascadeRisk: number;
  /** Active sensor streams feeding the planner (1–48). */
  sensorCount: number;
  profile: PlanProfile;
};

export type GuardQuality = {
  mode: ScoreMode;
  planSafety: number;
  cpiFit: number;
  interventionPrecision: number;
  cascadeAvoided: number;
  responseLatency: number;
  confidence: number;
  overall: number;
};

export type PlanReadiness = {
  sensorsReady: boolean;
  cpiReady: boolean;
  planReady: boolean;
  safetyReady: boolean;
  overallReady: boolean;
  safetyGap: number;
  cascadeGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: GuardQuality,
  input: GuardInput,
): PlanReadiness {
  const safetyTarget =
    56 + input.sensorCoverage * 20 + input.physicsFidelity * 12;
  const cascadeTarget = 54 + input.isolationDepth * 22 + (1 - input.cascadeRisk) * 10;
  const safetyGap = round2(safetyTarget - quality.planSafety);
  const cascadeGap = round2(cascadeTarget - quality.cascadeAvoided);
  const sensorsReady = quality.confidence >= 52 + input.sensorCoverage * 18;
  const cpiReady = quality.cpiFit >= 50 + input.physicsFidelity * 22;
  const planReady = quality.planSafety >= 54 + input.planHorizon * 16;
  const safetyReady = quality.planSafety >= safetyTarget - 8;
  return {
    sensorsReady,
    cpiReady,
    planReady,
    safetyReady,
    overallReady: sensorsReady && cpiReady && planReady && safetyReady,
    safetyGap,
    cascadeGap,
  };
}
