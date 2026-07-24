import {
  type GraphInput,
  type GraphQuality,
  clamp,
  round2,
} from "./types";

/**
 * Multi-step GraphRAG quality (good path):
 * extract → consolidate (dedupe/summarize) → retrieval with hop trails.
 */
export function scoreMultiStep(input: GraphInput): GraphQuality {
  const profileBoost = input.profile === "heavy" ? 1.08 : 1;
  const extractScore = round2(
    clamp(
      ((input.rawMentions / Math.max(1, input.docs * 4)) * 70 +
        Math.min(30, input.docs * 0.8)) *
        profileBoost,
      0,
      100,
    ),
  );

  const duplicatesRemoved = Math.round(
    input.rawMentions * clamp(input.duplicateRate, 0, 1),
  );
  const consolidateScore = round2(
    clamp(
      40 +
        (input.uniqueEntities / Math.max(1, input.rawMentions)) * 35 +
        (1 - input.duplicateRate) * 20 +
        Math.min(15, input.strongEdges * 0.4),
      0,
      100,
    ),
  );

  const hopTrailLength = clamp(Math.round(input.hopDepthUseful), 1, 4);
  const retrievalScore = round2(
    clamp(
      input.queryCoverage * 75 +
        hopTrailLength * 5 +
        (input.strongEdges / Math.max(1, input.strongEdges + input.weakEdges)) *
          15,
      0,
      100,
    ),
  );

  const overall = round2(
    extractScore * 0.25 + consolidateScore * 0.4 + retrievalScore * 0.35,
  );

  return {
    mode: "multi_step",
    extractScore,
    consolidateScore,
    retrievalScore,
    overall,
    entitiesKept: input.uniqueEntities,
    edgesKept: input.strongEdges,
    duplicatesRemoved,
    noiseEdges: 0,
    hopTrailLength,
  };
}

/** Single-shot noisy graph build (naive baseline). */
export function scoreSingleShot(input: GraphInput): GraphQuality {
  const extractScore = round2(
    clamp(
      (input.rawMentions / Math.max(1, input.docs * 3)) * 85 +
        Math.min(20, input.docs * 0.5),
      0,
      100,
    ),
  );

  const consolidateScore = round2(
    clamp(
      25 +
        (1 - input.duplicateRate) * 10 +
        Math.min(20, (input.strongEdges + input.weakEdges) * 0.15),
      0,
      70,
    ),
  );

  const hopTrailLength = clamp(Math.round(input.hopDepthUseful * 0.6), 1, 3);
  const retrievalScore = round2(
    clamp(
      input.queryCoverage * 55 +
        hopTrailLength * 3 +
        Math.max(0, 20 - input.weakEdges * 0.5),
      0,
      100,
    ),
  );

  const overall = round2(
    extractScore * 0.45 + consolidateScore * 0.2 + retrievalScore * 0.35,
  );

  return {
    mode: "single_shot",
    extractScore,
    consolidateScore,
    retrievalScore,
    overall,
    entitiesKept: input.rawMentions,
    edgesKept: input.strongEdges + input.weakEdges,
    duplicatesRemoved: 0,
    noiseEdges: input.weakEdges,
    hopTrailLength,
  };
}
