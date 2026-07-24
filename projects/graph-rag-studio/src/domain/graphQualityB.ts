import {
  type GraphInput,
  type GraphQuality,
  clamp,
  round2,
} from "./types";

/**
 * Independent reimplementation of multi-step scoring (dual-impl A').
 * Must agree with graphQuality.scoreMultiStep on goldens.
 */
export function scoreMultiStep(input: GraphInput): GraphQuality {
  const heavy = input.profile === "heavy";
  const dens = input.rawMentions / Math.max(1, input.docs * 4);
  const extractScore = round2(
    clamp((dens * 70 + Math.min(30, input.docs * 0.8)) * (heavy ? 1.08 : 1), 0, 100),
  );

  const dup = clamp(input.duplicateRate, 0, 1);
  const duplicatesRemoved = Math.round(input.rawMentions * dup);
  const uniqRatio = input.uniqueEntities / Math.max(1, input.rawMentions);
  const consolidateScore = round2(
    clamp(40 + uniqRatio * 35 + (1 - dup) * 20 + Math.min(15, input.strongEdges * 0.4), 0, 100),
  );

  const hopTrailLength = Math.max(1, Math.min(4, Math.round(input.hopDepthUseful)));
  const edgeSignal =
    input.strongEdges / Math.max(1, input.strongEdges + input.weakEdges);
  const retrievalScore = round2(
    clamp(input.queryCoverage * 75 + hopTrailLength * 5 + edgeSignal * 15, 0, 100),
  );

  const overall = round2(
    0.25 * extractScore + 0.4 * consolidateScore + 0.35 * retrievalScore,
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

/** Independent reimplementation of single-shot baseline. */
export function scoreSingleShot(input: GraphInput): GraphQuality {
  const dens = input.rawMentions / Math.max(1, input.docs * 3);
  const extractScore = round2(
    clamp(dens * 85 + Math.min(20, input.docs * 0.5), 0, 100),
  );

  const consolidateScore = round2(
    clamp(
      25 +
        (1 - clamp(input.duplicateRate, 0, 1)) * 10 +
        Math.min(20, (input.strongEdges + input.weakEdges) * 0.15),
      0,
      70,
    ),
  );

  const hopTrailLength = Math.max(
    1,
    Math.min(3, Math.round(input.hopDepthUseful * 0.6)),
  );
  const retrievalScore = round2(
    clamp(
      input.queryCoverage * 55 + hopTrailLength * 3 + Math.max(0, 20 - input.weakEdges * 0.5),
      0,
      100,
    ),
  );

  const overall = round2(
    0.45 * extractScore + 0.2 * consolidateScore + 0.35 * retrievalScore,
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
