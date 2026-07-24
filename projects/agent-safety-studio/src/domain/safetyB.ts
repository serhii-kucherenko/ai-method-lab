import {
  type SafetyInput,
  type SafetyQuality,
  clamp,
  round2,
} from "./types";

function sabotagePressure(input: SafetyInput): number {
  return clamp(
    input.privilegeBroadening * 0.22 +
      input.denyGuardRemoval * 0.2 +
      input.newSensitiveSinks * 0.18 +
      input.loggingDegradation * 0.14 +
      input.hardeningRegression * 0.12 +
      (1 - input.taskJustification) * 0.14,
    0,
    1,
  );
}

function graphSignal(input: SafetyInput): number {
  return clamp(
    input.cfgDelta * 38 +
      input.dfgDelta * 34 +
      input.monitorCoverage * 22 +
      Math.min(12, input.checkKindCount) * 1.4,
    0,
    100,
  );
}

function deltaEvidence(input: SafetyInput): number {
  return clamp(
    input.privilegeBroadening * 28 +
      input.denyGuardRemoval * 26 +
      input.newSensitiveSinks * 24 +
      input.loggingDegradation * 14 +
      input.hardeningRegression * 16,
    0,
    100,
  );
}

export function scoreStructural(input: SafetyInput): SafetyQuality {
  const strict = input.profile === "strict";
  const boost = strict ? 1.06 : 1.0;
  const pressure = sabotagePressure(input);
  const graph = graphSignal(input);
  const evidence = deltaEvidence(input);
  const syncBoost = input.deployMode === "sync" ? 1.08 : 0.92;

  const structuralCatchRate = round2(
    clamp(
      (graph * 0.36 + evidence * 0.4 + input.monitorCoverage * 28) * boost -
        pressure * 10 -
        input.codeDiffNoise * 8 +
        (1 - input.taskJustification) * 6,
      0,
      100,
    ),
  );

  const falsePositiveBudgetFit = round2(
    clamp(
      72 +
        input.taskJustification * 18 -
        input.codeDiffNoise * 22 -
        (input.suspicionThreshold - 5) * 2.2 +
        input.monitorCoverage * 8 +
        (strict ? 3 : 0),
      0,
      100,
    ),
  );

  const syncBlockEffectiveness = round2(
    clamp(
      (evidence * 0.42 + graph * 0.28 + structuralCatchRate * 0.22) *
        syncBoost *
        boost -
        pressure * 6 -
        input.codeDiffNoise * 5,
      0,
      100,
    ),
  );

  const asyncDetectionLift = round2(
    clamp(
      structuralCatchRate * 0.48 +
        evidence * 0.28 +
        input.monitorCoverage * 18 +
        (input.deployMode === "async" ? 8 : 2) -
        pressure * 8,
      0,
      100,
    ),
  );

  const postureRegressionScore = round2(
    clamp(
      evidence * 0.55 * boost +
        pressure * 30 +
        input.cfgDelta * 12 +
        input.dfgDelta * 10 -
        input.taskJustification * 14,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.monitorCoverage * 28 +
        Math.min(12, input.checkKindCount) * 3.2 +
        graph * 0.22 +
        (strict ? 5 : 7) -
        input.codeDiffNoise * 10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      structuralCatchRate * 0.28 +
        falsePositiveBudgetFit * 0.16 +
        syncBlockEffectiveness * 0.22 +
        asyncDetectionLift * 0.18 +
        postureRegressionScore * 0.08 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "structural",
    structuralCatchRate,
    falsePositiveBudgetFit,
    syncBlockEffectiveness,
    asyncDetectionLift,
    postureRegressionScore,
    confidence,
    overall,
  };
}

export function scoreThreshold(input: SafetyInput): SafetyQuality {
  const strict = input.profile === "strict";
  const pressure = sabotagePressure(input);
  const thr = input.suspicionThreshold;

  const structuralCatchRate = round2(
    clamp(
      42 +
        input.codeDiffNoise * 18 +
        (10 - thr) * 2.4 -
        pressure * 22 +
        input.monitorCoverage * 8 +
        (strict ? 2 : 0),
      0,
      72,
    ),
  );

  const falsePositiveBudgetFit = round2(
    clamp(
      58 +
        (thr - 4) * 3.5 -
        input.codeDiffNoise * 28 -
        pressure * 6 +
        (strict ? 1 : 0),
      0,
      100,
    ),
  );

  const syncBlockEffectiveness = round2(
    clamp(
      28 +
        structuralCatchRate * 0.35 +
        (input.deployMode === "sync" ? 6 : 0) -
        pressure * 16 -
        input.codeDiffNoise * 8,
      0,
      58,
    ),
  );

  const asyncDetectionLift = round2(
    clamp(
      36 +
        input.codeDiffNoise * 12 +
        (10 - thr) * 1.8 -
        pressure * 18 +
        input.monitorCoverage * 6,
      0,
      64,
    ),
  );

  const postureRegressionScore = round2(
    clamp(
      38 +
        pressure * 22 +
        input.privilegeBroadening * 16 -
        input.taskJustification * 10 -
        input.cfgDelta * 4 -
        input.dfgDelta * 4,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      34 +
        input.codeDiffNoise * 10 +
        (strict ? 2 : 0) -
        pressure * 8,
      0,
      62,
    ),
  );

  const overall = round2(
    clamp(
      structuralCatchRate * 0.34 +
        falsePositiveBudgetFit * 0.2 +
        syncBlockEffectiveness * 0.16 +
        asyncDetectionLift * 0.18 +
        postureRegressionScore * 0.06 +
        confidence * 0.06,
      0,
      100,
    ),
  );

  return {
    mode: "threshold",
    structuralCatchRate,
    falsePositiveBudgetFit,
    syncBlockEffectiveness,
    asyncDetectionLift,
    postureRegressionScore,
    confidence,
    overall,
  };
}
