/**
 * Second independent implementation of the dual score (verify path).
 * Must stay behaviorally identical to deploy.ts.
 */
import {
  type DeployInput,
  type DeployQuality,
  clamp,
  round2,
} from "./types";

function complexityPressure(input: DeployInput): number {
  return clamp(
    (input.pipelineStages / 12) * 0.35 +
      (input.modalityCount / 4) * 0.3 +
      input.stateScopeComplexity * 0.25 +
      (1 - input.placementFlexibility) * 0.1,
    0,
    1,
  );
}

function irBlock(input: DeployInput): number {
  return clamp(
    input.irValidationDepth * 46 +
      input.measurementGateStrictness * 28 +
      Math.min(8, input.candidatePassCount) * 3.2 +
      input.placementFlexibility * 12,
    0,
    100,
  );
}

function streamBlock(input: DeployInput): number {
  return clamp(
    input.streamingOverlap * 52 +
      input.gpuBudget * 5.5 +
      (1 - complexityPressure(input)) * 18 +
      input.placementFlexibility * 14,
    0,
    100,
  );
}

function measureBlock(input: DeployInput): number {
  return clamp(
    input.measurementGateStrictness * 48 +
      input.candidatePassCount * 4.5 +
      input.irValidationDepth * 22 +
      input.latencyWeight * 12,
    0,
    100,
  );
}

export function scoreHarnessed(input: DeployInput): DeployQuality {
  const full = input.profile === "full";
  const boost = full ? 1.1 : 0.95;
  const pressure = complexityPressure(input);
  const ir = irBlock(input);
  const stream = streamBlock(input);
  const measure = measureBlock(input);

  const criticalPathScore = round2(
    clamp(
      (ir * 0.34 + stream * 0.4 + measure * 0.26) * boost +
        input.streamingOverlap * 8 -
        pressure * 14,
      0,
      100,
    ),
  );

  const placementScore = round2(
    clamp(
      input.placementFlexibility * 48 +
        input.gpuBudget * 6 +
        ir * 0.22 +
        (full ? 6 : 1) -
        pressure * 10,
      0,
      100,
    ),
  );

  const ttfoScore = round2(
    clamp(
      criticalPathScore * 0.55 +
        placementScore * 0.2 +
        input.latencyWeight * 18 +
        stream * 0.12 * boost -
        pressure * 8,
      0,
      100,
    ),
  );

  const throughputScore = round2(
    clamp(
      stream * 0.5 * boost +
        input.throughputWeight * 22 +
        input.gpuBudget * 5 +
        placementScore * 0.18 -
        pressure * 6,
      0,
      100,
    ),
  );

  const correctnessConfidence = round2(
    clamp(
      ir * 0.48 +
        measure * 0.38 +
        input.irValidationDepth * 12 +
        (full ? 6 : 2) -
        pressure * 5,
      0,
      100,
    ),
  );

  const readinessScore = round2(
    clamp(
      ttfoScore * 0.35 +
        throughputScore * 0.3 +
        correctnessConfidence * 0.2 +
        placementScore * 0.15,
      0,
      100,
    ),
  );

  const harnessLift = round2(
    clamp(
      ir * 0.28 +
        measure * 0.32 +
        input.candidatePassCount * 3.5 +
        input.measurementGateStrictness * 18 -
        pressure * 8,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.irValidationDepth * 26 +
        input.measurementGateStrictness * 24 +
        input.candidatePassCount * 4 +
        input.placementFlexibility * 16 +
        (full ? 8 : 2),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      ttfoScore * 0.32 +
        throughputScore * 0.26 +
        readinessScore * 0.2 +
        harnessLift * 0.12 +
        correctnessConfidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "harnessed",
    ttfoScore,
    throughputScore,
    correctnessConfidence,
    readinessScore,
    harnessLift,
    criticalPathScore,
    placementScore,
    confidence,
    overall,
  };
}

export function scoreNaive(input: DeployInput): DeployQuality {
  const full = input.profile === "full";
  const pressure = complexityPressure(input);
  const gpuEase = input.gpuBudget * 7;

  const ttfoScore = round2(
    clamp(
      42 +
        gpuEase * 0.35 +
        input.latencyWeight * 14 +
        input.streamingOverlap * 10 -
        pressure * 32 -
        input.stateScopeComplexity * 12 +
        (full ? 2 : 0),
      0,
      100,
    ),
  );

  const throughputScore = round2(
    clamp(
      48 +
        gpuEase * 0.45 +
        input.throughputWeight * 16 -
        pressure * 22 -
        input.modalityCount * 3 +
        (full ? 2 : 0),
      0,
      100,
    ),
  );

  const correctnessConfidence = round2(
    clamp(
      50 +
        (1 - pressure) * 18 +
        input.placementFlexibility * 10 -
        input.stateScopeComplexity * 14 +
        (full ? 2 : 0),
      0,
      100,
    ),
  );

  const criticalPathScore = round2(
    clamp(ttfoScore * 0.7 + (1 - pressure) * 20, 0, 100),
  );

  const placementScore = round2(
    clamp(
      input.gpuBudget * 8 +
        input.placementFlexibility * 22 -
        pressure * 18 +
        30,
      0,
      100,
    ),
  );

  const readinessScore = round2(
    clamp(
      ttfoScore * 0.4 +
        throughputScore * 0.35 +
        correctnessConfidence * 0.25 -
        pressure * 6,
      0,
      100,
    ),
  );

  const harnessLift = round2(
    clamp(8 - pressure * 10 + input.candidatePassCount * 0.5, 0, 40),
  );

  const confidence = round2(
    clamp(
      38 +
        input.gpuBudget * 4 +
        (1 - pressure) * 20 +
        (full ? 3 : 0),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      ttfoScore * 0.36 +
        throughputScore * 0.3 +
        readinessScore * 0.2 +
        correctnessConfidence * 0.14,
      0,
      100,
    ),
  );

  return {
    mode: "naive",
    ttfoScore,
    throughputScore,
    correctnessConfidence,
    readinessScore,
    harnessLift,
    criticalPathScore,
    placementScore,
    confidence,
    overall,
  };
}
