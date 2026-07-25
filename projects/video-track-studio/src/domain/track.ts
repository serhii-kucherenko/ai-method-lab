import {
  type TrackInput,
  type TrackQuality,
  biasWeight,
  clamp,
  round2,
} from "./types";

function laneBlock(
  value: number,
  weight: number,
  temporal: number,
  noise: number,
): number {
  return clamp(value * 55 * weight + temporal * 25 - noise * 18, 0, 100);
}

/**
 * Track-aware diagnosis quality (good path A):
 * rewards name sensitivity, identity bind, temporal coverage, outfit order.
 */
export function scoreTrackAware(input: TrackInput): TrackQuality {
  const aware = input.profile === "track_aware";
  const boost = aware ? 1.12 : 0.96;
  const wN = biasWeight(input.probeBias, "name_swap");
  const wG = biasWeight(input.probeBias, "gender_swap");
  const wO = biasWeight(input.probeBias, "open_ended");
  const wF = biasWeight(input.probeBias, "frame_boost");
  const avgBias = (wN + wG + wO + wF) / 4;

  const sensitivityScore = round2(
    clamp(
      laneBlock(
        input.nameSensitivity,
        avgBias,
        input.temporalCoverage,
        input.noiseLevel,
      ) *
        boost +
        input.nameSensitivity * 8 +
        (aware ? 6 : 0) -
        input.genderCueReliance * 22,
      0,
      100,
    ),
  );
  const identityScore = round2(
    clamp(
      laneBlock(
        input.identityBind,
        avgBias,
        input.temporalCoverage,
        input.noiseLevel,
      ) *
        boost +
        input.identityBind * 7 +
        (aware ? 5 : 0) -
        input.genderCueReliance * 18,
      0,
      100,
    ),
  );
  const temporalScore = round2(
    clamp(
      (input.temporalCoverage * 50 +
        input.nameSensitivity * 28 +
        input.identityBind * 18 -
        input.noiseLevel * 16 -
        input.genderCueReliance * 20) *
        boost +
        (aware ? 10 : 0),
      0,
      100,
    ),
  );
  const outfitScore = round2(
    clamp(
      laneBlock(
        input.outfitOrderFidelity,
        avgBias,
        input.temporalCoverage,
        input.noiseLevel,
      ) *
        boost +
        input.outfitOrderFidelity * 6 +
        (aware ? 4 : 0),
      0,
      100,
    ),
  );
  const specificityScore = round2(
    clamp(
      input.probeSpecificity * 70 * boost +
        input.identityBind * 20 -
        input.noiseLevel * 12 +
        (aware ? 5 : 0),
      0,
      100,
    ),
  );
  const fluencyScore = round2(
    clamp(
      input.fluencyPrior * 40 +
        input.probeSpecificity * 15 -
        input.genderCueReliance * 10,
      0,
      100,
    ),
  );

  const trackContribution = round2(
    (sensitivityScore + identityScore + outfitScore) / 3,
  );
  const fluencyContribution = round2(
    aware
      ? input.fluencyPrior * 20 + input.probeSpecificity * 10
      : input.fluencyPrior * 55,
  );

  const confidence = round2(
    clamp(
      (trackContribution * 0.35 +
        temporalScore * 0.35 +
        specificityScore * 0.2 +
        outfitScore * 0.1) *
        (aware ? 1 : 0.85) -
        input.genderCueReliance * 15,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      sensitivityScore * 0.22 +
        identityScore * 0.22 +
        temporalScore * 0.28 +
        outfitScore * 0.12 +
        specificityScore * 0.1 +
        confidence * 0.06,
      0,
      100,
    ),
  );

  return {
    mode: "track_aware",
    sensitivityScore,
    identityScore,
    temporalScore,
    outfitScore,
    specificityScore,
    fluencyScore,
    confidence,
    trackContribution,
    fluencyContribution,
    overall,
  };
}

/**
 * Fluency-only baseline B: rewards MCQ fluency prior,
 * barely uses name sensitivity / identity bind.
 */
export function scoreFluency(input: TrackInput): TrackQuality {
  const fluent = input.profile === "fluency" || input.profile === "track_aware";
  const boost = fluent ? 1.05 : 0.9;

  const sensitivityScore = round2(
    clamp(input.nameSensitivity * 12 + input.fluencyPrior * 8, 0, 100),
  );
  const identityScore = round2(
    clamp(input.identityBind * 10 + input.fluencyPrior * 15, 0, 100),
  );
  const temporalScore = round2(
    clamp(input.temporalCoverage * 8 + input.fluencyPrior * 12, 0, 100),
  );
  const outfitScore = round2(
    clamp(input.outfitOrderFidelity * 8 + input.fluencyPrior * 10, 0, 100),
  );
  const specificityScore = round2(
    clamp(
      input.probeSpecificity * 55 * boost + input.fluencyPrior * 25,
      0,
      100,
    ),
  );
  const fluencyScore = round2(
    clamp(
      (input.fluencyPrior * 62 +
        input.probeSpecificity * 22 -
        input.genderCueReliance * 8 -
        input.noiseLevel * 10) *
        boost,
      0,
      100,
    ),
  );

  const trackContribution = round2((sensitivityScore + identityScore) / 2);
  const fluencyContribution = round2(input.fluencyPrior * 70);

  const confidence = round2(
    clamp(
      fluencyScore * 0.55 +
        specificityScore * 0.3 +
        input.fluencyPrior * 15 -
        input.noiseLevel * 8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      fluencyScore * 0.45 +
        specificityScore * 0.25 +
        confidence * 0.2 +
        sensitivityScore * 0.05 +
        identityScore * 0.05,
      0,
      100,
    ),
  );

  return {
    mode: "fluency_only",
    sensitivityScore,
    identityScore,
    temporalScore,
    outfitScore,
    specificityScore,
    fluencyScore,
    confidence,
    trackContribution,
    fluencyContribution,
    overall,
  };
}
