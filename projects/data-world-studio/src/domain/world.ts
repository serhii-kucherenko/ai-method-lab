import {
  type WorldInput,
  type WorldQuality,
  clamp,
  round2,
} from "./types";

function structureSignal(input: WorldInput): number {
  return clamp(
    input.stateCoverage * 38 +
      input.dataQuality * 22 +
      input.featureRichness * 18 +
      input.planHorizon * 14 +
      input.agentSkill * 8,
    0,
    100,
  );
}

function costSignal(input: WorldInput): number {
  return clamp(
    input.costAwareness * 44 +
      input.computeBudget * 22 +
      (1 - input.explorationNoise) * 18 +
      input.simFidelity * 12,
    0,
    100,
  );
}

/**
 * World-model plan quality (good path).
 * Soft-simulates predict-before-execute with structured state + cost-aware decisions.
 * Not branded as DSWorld.
 */
export function scoreWorldModel(input: WorldInput): WorldQuality {
  const aggressive = input.profile === "aggressive";
  const boost = aggressive ? 1.06 : 1.0;
  const structure = structureSignal(input);
  const cost = costSignal(input);
  const stepPressure = clamp(input.stepCount / 40, 0, 1);

  const outcomeAccuracy = round2(
    clamp(
      (structure * 0.42 +
        input.simFidelity * 28 +
        input.agentSkill * 16 +
        input.planHorizon * 12) *
        boost -
        input.explorationNoise * 14 -
        input.opComplexity * 8 +
        input.stateCoverage * 8,
      0,
      100,
    ),
  );

  const costEfficiency = round2(
    clamp(
      (cost * 0.55 + outcomeAccuracy * 0.18 + input.costAwareness * 16) *
        boost -
        input.explorationNoise * 18 -
        stepPressure * 6,
      0,
      100,
    ),
  );

  const planQuality = round2(
    clamp(
      input.stateCoverage * 48 * boost +
        input.planHorizon * 28 +
        input.featureRichness * 14 +
        input.agentSkill * 10 -
        input.explorationNoise * 10,
      0,
      100,
    ),
  );

  const simFit = round2(
    clamp(
      input.simFidelity * 56 * boost +
        input.dataQuality * 22 +
        planQuality * 0.12 -
        input.opComplexity * 10,
      0,
      100,
    ),
  );

  const wasteAvoided = round2(
    clamp(
      62 +
        input.costAwareness * 22 +
        input.planHorizon * 12 -
        input.explorationNoise * 28 -
        input.retryBudget * 8 +
        (aggressive ? 3 : 0),
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.stateCoverage * 24 +
        input.simFidelity * 22 +
        input.dataQuality * 16 +
        Math.min(40, input.stepCount) * 0.6 +
        (aggressive ? 4 : 7) -
        input.explorationNoise * 12,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      outcomeAccuracy * 0.26 +
        costEfficiency * 0.22 +
        planQuality * 0.18 +
        simFit * 0.14 +
        wasteAvoided * 0.12 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "world-model",
    outcomeAccuracy,
    costEfficiency,
    planQuality,
    simFit,
    wasteAvoided,
    confidence,
    overall,
  };
}

/**
 * Trial-and-error baseline — execute first, learn late; burns retries and budget.
 */
export function scoreTrialError(input: WorldInput): WorldQuality {
  const aggressive = input.profile === "aggressive";
  const stepPressure = clamp(input.stepCount / 40, 0, 1);
  // Baseline under-uses structured state even when coverage is claimed high.
  const weakState = clamp(input.stateCoverage * 0.22, 0, 0.28);

  const outcomeAccuracy = round2(
    clamp(
      36 +
        input.agentSkill * 16 +
        input.retryBudget * 14 +
        input.explorationNoise * 10 -
        input.opComplexity * 18 -
        input.planHorizon * 12 +
        weakState * 20 +
        (aggressive ? 2 : 0) -
        input.costAwareness * 6,
      0,
      64,
    ),
  );

  const costEfficiency = round2(
    clamp(
      28 +
        input.computeBudget * 14 -
        input.explorationNoise * 24 -
        input.retryBudget * 16 -
        stepPressure * 12 +
        input.costAwareness * 6,
      0,
      52,
    ),
  );

  const planQuality = round2(
    clamp(
      20 +
        weakState * 36 +
        input.featureRichness * 10 -
        input.opComplexity * 14 +
        Math.min(40, input.stepCount) * 0.35,
      0,
      46,
    ),
  );

  const simFit = round2(
    clamp(
      30 +
        input.simFidelity * 12 -
        input.opComplexity * 14 -
        input.stateCoverage * 8 +
        input.dataQuality * 8,
      0,
      48,
    ),
  );

  const wasteAvoided = round2(
    clamp(
      34 +
        (aggressive ? 2 : 0) -
        input.explorationNoise * 22 -
        input.retryBudget * 14 +
        input.costAwareness * 8 -
        stepPressure * 6,
      0,
      55,
    ),
  );

  const confidence = round2(
    clamp(
      26 +
        input.explorationNoise * 10 +
        input.retryBudget * 8 +
        (aggressive ? 2 : 0) -
        input.stateCoverage * 8 -
        input.planHorizon * 6,
      0,
      46,
    ),
  );

  const overall = round2(
    clamp(
      outcomeAccuracy * 0.3 +
        costEfficiency * 0.22 +
        planQuality * 0.14 +
        simFit * 0.12 +
        wasteAvoided * 0.14 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "trial-error",
    outcomeAccuracy,
    costEfficiency,
    planQuality,
    simFit,
    wasteAvoided,
    confidence,
    overall,
  };
}
