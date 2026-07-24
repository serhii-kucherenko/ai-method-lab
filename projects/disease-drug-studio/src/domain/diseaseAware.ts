import {
  type GenerationInput,
  type GenerationQuality,
  clamp,
  round2,
} from "./types";

/**
 * Disease-aware generation quality (good path):
 * conditions on MeSH depth + disease strength; GRPO profile boosts rewards.
 */
export function scoreDiseaseAware(input: GenerationInput): GenerationQuality {
  const cond = clamp(input.conditioningStrength, 0, 1);
  const mesh = clamp(input.meshDepth, 1, 5);
  const grpo = input.profile === "grpo";
  const grpoBoost = grpo ? 1.12 : 1;

  const validityScore = round2(
    clamp(
      88 +
        cond * 8 +
        (grpo ? 3 : 0) +
        Math.min(4, input.batchSize / 100),
      0,
      100,
    ),
  );

  const noveltyScore = round2(
    clamp(
      (input.noveltyPrior * 55 + input.seedDiversity * 35 + mesh * 2) *
        grpoBoost,
      0,
      100,
    ),
  );

  const diversityScore = round2(
    clamp(
      input.seedDiversity * 70 +
        Math.min(25, input.batchSize / 20) +
        cond * 10,
      0,
      100,
    ),
  );

  const affinityRaw =
    input.affinityPrior + cond * mesh * 0.35 + (grpo ? 0.8 : 0);
  const affinityScore = round2(clamp((affinityRaw / 12) * 100, 0, 100));

  const diseaseFitScore = round2(
    clamp(cond * 55 + mesh * 8 + input.approvedSimilarityPrior * 20, 0, 100),
  );

  const approvedSimilarity = round2(
    clamp(
      (input.approvedSimilarityPrior * 70 + cond * 25 + mesh * 1.5) *
        (grpo ? 1.05 : 1),
      0,
      100,
    ),
  );

  const uniqueCandidates = Math.round(
    clamp(
      input.batchSize *
        (0.55 + cond * 0.25 + input.seedDiversity * 0.15) *
        (grpo ? 1.08 : 1),
      1,
      input.batchSize,
    ),
  );

  const overall = round2(
    validityScore * 0.2 +
      noveltyScore * 0.15 +
      diversityScore * 0.15 +
      affinityScore * 0.25 +
      diseaseFitScore * 0.15 +
      approvedSimilarity * 0.1,
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

/** Disease-blind baseline: target-only generation, no disease conditioning. */
export function scoreDiseaseBlind(input: GenerationInput): GenerationQuality {
  const validityScore = round2(
    clamp(82 + Math.min(6, input.batchSize / 80), 0, 95),
  );

  const noveltyScore = round2(
    clamp(input.noveltyPrior * 50 + input.seedDiversity * 30, 0, 100),
  );

  const diversityScore = round2(
    clamp(
      input.seedDiversity * 55 + Math.min(20, input.batchSize / 25),
      0,
      100,
    ),
  );

  const affinityRaw = input.affinityPrior * 0.85;
  const affinityScore = round2(clamp((affinityRaw / 12) * 100, 0, 100));

  const diseaseFitScore = round2(
    clamp(input.approvedSimilarityPrior * 15 + 10, 0, 40),
  );

  const approvedSimilarity = round2(
    clamp(input.approvedSimilarityPrior * 55 + 5, 0, 100),
  );

  const uniqueCandidates = Math.round(
    clamp(
      input.batchSize * (0.35 + input.seedDiversity * 0.2),
      1,
      input.batchSize,
    ),
  );

  const overall = round2(
    validityScore * 0.2 +
      noveltyScore * 0.15 +
      diversityScore * 0.15 +
      affinityScore * 0.25 +
      diseaseFitScore * 0.15 +
      approvedSimilarity * 0.1,
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
