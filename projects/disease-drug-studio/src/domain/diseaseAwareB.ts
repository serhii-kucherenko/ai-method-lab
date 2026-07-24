import {
  type GenerationInput,
  type GenerationQuality,
  clamp,
  round2,
} from "./types";

/**
 * Independent reimplementation of disease-aware scoring (dual-impl A').
 * Must agree with diseaseAware.scoreDiseaseAware on goldens.
 */
export function scoreDiseaseAware(input: GenerationInput): GenerationQuality {
  const strength = Math.max(0, Math.min(1, input.conditioningStrength));
  const depth = Math.max(1, Math.min(5, input.meshDepth));
  const isGrpo = input.profile === "grpo";
  const boost = isGrpo ? 1.12 : 1;

  const validityScore = round2(
    clamp(
      88 + strength * 8 + (isGrpo ? 3 : 0) + Math.min(4, input.batchSize / 100),
      0,
      100,
    ),
  );

  const noveltyScore = round2(
    clamp(
      boost *
        (55 * input.noveltyPrior + 35 * input.seedDiversity + 2 * depth),
      0,
      100,
    ),
  );

  const diversityScore = round2(
    clamp(
      70 * input.seedDiversity +
        Math.min(25, input.batchSize / 20) +
        10 * strength,
      0,
      100,
    ),
  );

  const affinityScore = round2(
    clamp(
      ((input.affinityPrior + strength * depth * 0.35 + (isGrpo ? 0.8 : 0)) /
        12) *
        100,
      0,
      100,
    ),
  );

  const diseaseFitScore = round2(
    clamp(
      55 * strength + 8 * depth + 20 * input.approvedSimilarityPrior,
      0,
      100,
    ),
  );

  const approvedSimilarity = round2(
    clamp(
      (70 * input.approvedSimilarityPrior + 25 * strength + 1.5 * depth) *
        (isGrpo ? 1.05 : 1),
      0,
      100,
    ),
  );

  const ratio =
    (0.55 + 0.25 * strength + 0.15 * input.seedDiversity) * (isGrpo ? 1.08 : 1);
  const uniqueCandidates = Math.round(
    Math.max(1, Math.min(input.batchSize, input.batchSize * ratio)),
  );

  const overall = round2(
    0.2 * validityScore +
      0.15 * noveltyScore +
      0.15 * diversityScore +
      0.25 * affinityScore +
      0.15 * diseaseFitScore +
      0.1 * approvedSimilarity,
  );

  return {
    mode: "disease_aware",
    validityScore,
    noveltyScore,
    diversityScore,
    affinityScore,
    diseaseFitScore,
    approvedSimilarity,
    uniqueCandidates,
    overall,
  };
}

/** Independent reimplementation of disease-blind baseline. */
export function scoreDiseaseBlind(input: GenerationInput): GenerationQuality {
  const validityScore = round2(
    clamp(82 + Math.min(6, input.batchSize / 80), 0, 95),
  );

  const noveltyScore = round2(
    clamp(50 * input.noveltyPrior + 30 * input.seedDiversity, 0, 100),
  );

  const diversityScore = round2(
    clamp(
      55 * input.seedDiversity + Math.min(20, input.batchSize / 25),
      0,
      100,
    ),
  );

  const affinityScore = round2(
    clamp(((input.affinityPrior * 0.85) / 12) * 100, 0, 100),
  );

  const diseaseFitScore = round2(
    clamp(15 * input.approvedSimilarityPrior + 10, 0, 40),
  );

  const approvedSimilarity = round2(
    clamp(55 * input.approvedSimilarityPrior + 5, 0, 100),
  );

  const uniqueCandidates = Math.round(
    Math.max(
      1,
      Math.min(
        input.batchSize,
        input.batchSize * (0.35 + 0.2 * input.seedDiversity),
      ),
    ),
  );

  const overall = round2(
    0.2 * validityScore +
      0.15 * noveltyScore +
      0.15 * diversityScore +
      0.25 * affinityScore +
      0.15 * diseaseFitScore +
      0.1 * approvedSimilarity,
  );

  return {
    mode: "disease_blind",
    validityScore,
    noveltyScore,
    diversityScore,
    affinityScore,
    diseaseFitScore,
    approvedSimilarity,
    uniqueCandidates,
    overall,
  };
}
