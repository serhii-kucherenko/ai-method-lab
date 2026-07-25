import {
  type StreamInput,
  type StreamQuality,
  biasWeight,
  clamp,
  latencyPressure,
  round2,
} from "./types";

function clarityBlock(
  clarity: number,
  weight: number,
  coverage: number,
  noise: number,
): number {
  return clamp(clarity * 55 * weight + coverage * 25 - noise * 18, 0, 100);
}

/**
 * Dual-impl B real-time stream (must match stream.ts).
 */
export function scoreRealtimeStream(input: StreamInput): StreamQuality {
  const realtime = input.profile === "realtime_stream";
  const boost = realtime ? 1.12 : 0.96;
  const wE = biasWeight(input.segmentBias, "early_flush");
  const wW = biasWeight(input.segmentBias, "wait_boundary");
  const wB = biasWeight(input.segmentBias, "batch_only");
  const avgBias = (wE + wW + wB) / 3;
  const pressure = latencyPressure(input.latencyMs, input.budgetMs);

  const sentenceScore = round2(
    clamp(
      clarityBlock(
        input.glossClarity,
        avgBias,
        input.vocabularyCoverage,
        input.occlusionNoise,
      ) *
        boost +
        input.boundaryConfidence * 14 +
        (realtime ? 6 : 0) -
        input.signerPace * (realtime ? 8 : 14),
      0,
      100,
    ),
  );
  const latencyScore = round2(
    clamp(
      (1 - Math.min(1, pressure)) * 70 * boost +
        (realtime ? 10 : 0) -
        input.streamJitter * 18 -
        (input.segmentBias === "batch_only" ? 12 : 0),
      0,
      100,
    ),
  );
  const continuityScore = round2(
    clamp(
      (input.motionStability * 40 +
        (1 - input.streamJitter) * 30 +
        input.glossClarity * 20 -
        input.occlusionNoise * 14) *
        boost +
        (realtime ? 8 : 0),
      0,
      100,
    ),
  );
  const glossaryScore = round2(
    clamp(
      clarityBlock(
        input.vocabularyCoverage,
        avgBias,
        input.glossClarity,
        input.signerPace,
      ) *
        boost +
        (realtime ? 5 : 0) -
        input.occlusionNoise * 10,
      0,
      100,
    ),
  );
  const boundaryScore = round2(
    clamp(
      input.boundaryConfidence * 65 * boost +
        (input.segmentBias === "wait_boundary" ? 10 : 0) +
        (realtime ? 6 : 0) -
        pressure * 12,
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.glossClarity * 40 +
        input.vocabularyCoverage * 30 -
        input.occlusionNoise * 15,
      0,
      100,
    ),
  );

  const streamContribution = round2(
    (sentenceScore + latencyScore + continuityScore) / 3,
  );
  const batchContribution = round2(
    realtime
      ? input.glossClarity * 18 + input.vocabularyCoverage * 12
      : input.glossClarity * 55,
  );

  const confidence = round2(
    clamp(
      (streamContribution * 0.35 +
        boundaryScore * 0.3 +
        glossaryScore * 0.25 +
        fidelityScore * 0.1) *
        (realtime ? 1 : 0.85) -
        input.streamJitter * 10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      sentenceScore * 0.2 +
        latencyScore * 0.22 +
        continuityScore * 0.18 +
        glossaryScore * 0.14 +
        boundaryScore * 0.16 +
        confidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "realtime_stream",
    sentenceScore,
    latencyScore,
    continuityScore,
    glossaryScore,
    boundaryScore,
    fidelityScore,
    confidence,
    streamContribution,
    batchContribution,
    overall,
  };
}

/**
 * Dual-impl B offline-batch (must match stream.ts).
 */
export function scoreOfflineBatch(input: StreamInput): StreamQuality {
  const batch =
    input.profile === "offline_batch" || input.profile === "realtime_stream";
  const boost = batch ? 1.05 : 0.9;

  const sentenceScore = round2(
    clamp(
      input.glossClarity * 45 +
        input.boundaryConfidence * 25 +
        input.vocabularyCoverage * 18,
      0,
      100,
    ),
  );
  const latencyScore = round2(
    clamp((1 - input.streamJitter) * 20 + 35 * boost, 0, 100),
  );
  const continuityScore = round2(
    clamp(input.motionStability * 35 + input.glossClarity * 20, 0, 100),
  );
  const glossaryScore = round2(
    clamp(
      input.vocabularyCoverage * 55 * boost +
        input.glossClarity * 20 -
        input.occlusionNoise * 8,
      0,
      100,
    ),
  );
  const boundaryScore = round2(
    clamp(
      input.boundaryConfidence * 50 +
        (input.segmentBias === "batch_only" ? 15 : 0) +
        10,
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      (input.glossClarity * 50 +
        input.vocabularyCoverage * 35 -
        input.occlusionNoise * 12) *
        boost,
      0,
      100,
    ),
  );

  const streamContribution = round2((sentenceScore + continuityScore) / 2);
  const batchContribution = round2(fidelityScore * 0.85);

  const confidence = round2(
    clamp(
      fidelityScore * 0.5 +
        glossaryScore * 0.25 +
        batchContribution * 0.15 -
        input.signerPace * 8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      fidelityScore * 0.4 +
        glossaryScore * 0.22 +
        boundaryScore * 0.18 +
        confidence * 0.12 +
        sentenceScore * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "offline_batch",
    sentenceScore,
    latencyScore,
    continuityScore,
    glossaryScore,
    boundaryScore,
    fidelityScore,
    confidence,
    streamContribution,
    batchContribution,
    overall,
  };
}
