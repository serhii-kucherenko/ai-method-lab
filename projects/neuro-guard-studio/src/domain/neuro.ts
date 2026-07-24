import {
  type GuardInput,
  type GuardQuality,
  clamp,
  round2,
} from "./types";

function contextSignal(input: GuardInput): number {
  return clamp(
    input.sensorCoverage * 34 +
      input.contextFreshness * 22 +
      input.anomalyConfidence * 18 +
      input.planHorizon * 16 +
      Math.min(48, input.sensorCount) * 0.4,
    0,
    100,
  );
}

function physicsSignal(input: GuardInput): number {
  return clamp(
    input.physicsFidelity * 46 +
      input.isolationDepth * 20 +
      (1 - input.actuatorRisk) * 18 +
      input.latencyBudget * 12,
    0,
    100,
  );
}

/**
 * Neuro-agentic plan quality (good path).
 * Soft-simulates LLM planner + Counterfactual Physics Injection before act.
 * Not branded as the paper’s Neuro-Agentic Control product.
 */
export function scoreNeuroAgentic(input: GuardInput): GuardQuality {
  const aggressive = input.profile === "aggressive";
  const boost = aggressive ? 1.05 : 1.0;
  const context = contextSignal(input);
  const physics = physicsSignal(input);

  const planSafety = round2(
    clamp(
      (context * 0.4 +
        input.physicsFidelity * 26 +
        input.planHorizon * 18 +
        input.anomalyConfidence * 12) *
        boost -
        input.thresholdNoise * 12 -
        input.cascadeRisk * 10 +
        input.sensorCoverage * 8,
      0,
      100,
    ),
  );

  const cpiFit = round2(
    clamp(
      (physics * 0.58 + planSafety * 0.16 + input.physicsFidelity * 14) * boost -
        input.actuatorRisk * 16 -
        input.cascadeRisk * 8,
      0,
      100,
    ),
  );

  const interventionPrecision = round2(
    clamp(
      input.sensorCoverage * 42 * boost +
        input.isolationDepth * 28 +
        input.anomalyConfidence * 16 +
        input.planHorizon * 10 -
        input.thresholdNoise * 12,
      0,
      100,
    ),
  );

  const cascadeAvoided = round2(
    clamp(
      60 +
        input.physicsFidelity * 20 +
        input.isolationDepth * 14 -
        input.cascadeRisk * 26 -
        input.actuatorRisk * 10 +
        (aggressive ? 2 : 4),
      0,
      100,
    ),
  );

  const responseLatency = round2(
    clamp(
      input.latencyBudget * 48 * boost +
        input.contextFreshness * 22 +
        planSafety * 0.12 -
        input.threatSeverity * 10,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.sensorCoverage * 22 +
        input.physicsFidelity * 24 +
        input.anomalyConfidence * 16 +
        Math.min(48, input.sensorCount) * 0.5 +
        (aggressive ? 3 : 6) -
        input.thresholdNoise * 12,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      planSafety * 0.26 +
        cpiFit * 0.22 +
        interventionPrecision * 0.18 +
        cascadeAvoided * 0.16 +
        responseLatency * 0.1 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "neuro-agentic",
    planSafety,
    cpiFit,
    interventionPrecision,
    cascadeAvoided,
    responseLatency,
    confidence,
    overall,
  };
}

/**
 * Reactive threshold baseline — alert fires, act without counterfactual.
 */
export function scoreReactive(input: GuardInput): GuardQuality {
  const aggressive = input.profile === "aggressive";
  // Baseline under-uses sensor context and skips CPI entirely.
  const weakContext = clamp(input.sensorCoverage * 0.2, 0, 0.26);

  const planSafety = round2(
    clamp(
      34 +
        input.anomalyConfidence * 14 +
        input.threatSeverity * 12 +
        input.thresholdNoise * 10 -
        input.cascadeRisk * 16 -
        input.planHorizon * 10 +
        weakContext * 22 +
        (aggressive ? 2 : 0) -
        input.physicsFidelity * 8,
      0,
      62,
    ),
  );

  const cpiFit = round2(
    clamp(
      18 +
        input.physicsFidelity * 8 -
        input.actuatorRisk * 14 -
        input.cascadeRisk * 12 +
        weakContext * 10,
      0,
      42,
    ),
  );

  const interventionPrecision = round2(
    clamp(
      22 +
        weakContext * 30 +
        input.thresholdNoise * 12 -
        input.isolationDepth * 8 -
        input.cascadeRisk * 12 +
        Math.min(48, input.sensorCount) * 0.25,
      0,
      48,
    ),
  );

  const cascadeAvoided = round2(
    clamp(
      30 +
        (aggressive ? 1 : 0) -
        input.cascadeRisk * 22 -
        input.actuatorRisk * 14 +
        input.isolationDepth * 6 -
        input.thresholdNoise * 8,
      0,
      52,
    ),
  );

  const responseLatency = round2(
    clamp(
      48 +
        input.threatSeverity * 16 -
        input.latencyBudget * 8 +
        input.thresholdNoise * 10 -
        input.planHorizon * 12,
      0,
      70,
    ),
  );

  const confidence = round2(
    clamp(
      28 +
        input.thresholdNoise * 12 +
        input.threatSeverity * 10 +
        (aggressive ? 2 : 0) -
        input.sensorCoverage * 8 -
        input.physicsFidelity * 6,
      0,
      48,
    ),
  );

  const overall = round2(
    clamp(
      planSafety * 0.28 +
        cpiFit * 0.12 +
        interventionPrecision * 0.16 +
        cascadeAvoided * 0.2 +
        responseLatency * 0.14 +
        confidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "reactive",
    planSafety,
    cpiFit,
    interventionPrecision,
    cascadeAvoided,
    responseLatency,
    confidence,
    overall,
  };
}
