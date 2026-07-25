import {
  type HorizonInput,
  type HorizonQuality,
  biasWeight,
  clamp,
  round2,
  surpriseLoad,
} from "./types";

/**
 * Hierarchical world model (good path A):
 * rewards coarse structure, detail fidelity, temporal consistency, scene coverage.
 */
export function scoreHierarchical(input: HorizonInput): HorizonQuality {
  const hier = input.profile === "hierarchical";
  const boost = hier ? 1.12 : 0.96;
  const wS = biasWeight(input.horizonBias, "structure_first");
  const wD = biasWeight(input.horizonBias, "detail_first");
  const wR = biasWeight(input.horizonBias, "rollout_first");
  const avgBias = (wS + wD + wR) / 3;
  const pressure = surpriseLoad(input.surprisePressure, input.evidenceStrength);

  const structureScore = round2(
    clamp(
      (input.structureFit * 55 +
        input.evidenceStrength * 25 -
        pressure * 10) *
        boost *
        avgBias +
        (hier ? 8 : 0) -
        input.horizonDrift * (hier ? 6 : 14) -
        (input.horizonBias === "rollout_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const detailScore = round2(
    clamp(
      input.detailFidelity * 60 * boost +
        input.sceneCoverage * 25 +
        (hier ? 8 : 0) -
        input.fluencyScore * (hier ? 4 : 16) -
        (input.horizonBias === "rollout_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const temporalScore = round2(
    clamp(
      input.temporalConsistency * 58 * boost * wD +
        input.evidenceStrength * 28 +
        (hier ? 10 : 0) -
        pressure * 12 -
        input.horizonDrift * 10,
      0,
      100,
    ),
  );
  const sceneIntegrity = round2(
    clamp(
      input.sceneCoverage * 50 * boost * wS +
        input.detailFidelity * 25 +
        input.structureFit * 15 +
        (hier ? 8 : 0) -
        (input.horizonBias === "rollout_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const flatRolloutScore = round2(
    clamp(
      input.rolloutSmoothness * 55 * boost +
        input.fluencyScore * 20 -
        input.surprisePressure * 18 -
        (hier ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.evidenceStrength * 40 +
        input.sceneCoverage * 30 +
        input.temporalConsistency * 25 -
        input.fluencyScore * 15,
      0,
      100,
    ),
  );
  const hierarchicalContribution = round2(
    clamp(
      structureScore * 0.26 +
        detailScore * 0.24 +
        temporalScore * 0.28 +
        sceneIntegrity * 0.22,
      0,
      100,
    ),
  );
  const flatContribution = round2(
    clamp(
      flatRolloutScore * 0.7 +
        input.rolloutSmoothness * 20 +
        input.fluencyScore * 10 -
        pressure * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      hierarchicalContribution * (hier ? 0.82 : 0.4) +
        flatContribution * (hier ? 0.18 : 0.6) +
        (hier ? 4 : 0) -
        (input.horizonBias === "rollout_first" && hier ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "hierarchical",
    structureScore,
    detailScore,
    temporalScore,
    sceneIntegrity,
    flatRolloutScore,
    confidence,
    hierarchicalContribution,
    flatContribution,
    overall,
  };
}

/**
 * Flat single-level / naive rollout baseline (path B):
 * rewards rollout smoothness + fluency, weak on structure and detail integrity.
 */
export function scoreFlat(input: HorizonInput): HorizonQuality {
  const naive = input.profile === "flat";
  const boost = naive ? 1.08 : 0.92;
  const wR = biasWeight(input.horizonBias, "rollout_first");
  const pressure = surpriseLoad(input.surprisePressure, input.evidenceStrength);

  const structureScore = round2(
    clamp(
      input.rolloutSmoothness * 35 * boost +
        wR * 10 -
        input.surprisePressure * 22 -
        input.horizonDrift * 12 -
        (input.horizonBias === "structure_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const detailScore = round2(
    clamp(
      input.fluencyScore * 40 * boost +
        input.rolloutSmoothness * 25 -
        pressure * 15 -
        input.sceneCoverage * 8,
      0,
      100,
    ),
  );
  const temporalScore = round2(
    clamp(
      input.fluencyScore * 38 * boost +
        input.rolloutSmoothness * 20 -
        input.temporalConsistency * (naive ? 5 : 0) -
        pressure * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const sceneIntegrity = round2(
    clamp(
      input.rolloutSmoothness * 42 * boost +
        input.fluencyScore * 28 -
        input.sceneCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const flatRolloutScore = round2(
    clamp(
      input.rolloutSmoothness * 58 * boost * wR +
        input.fluencyScore * 32 -
        input.surprisePressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.fluencyScore * 45 +
        input.rolloutSmoothness * 35 -
        input.surprisePressure * 20 -
        input.horizonDrift * 10,
      0,
      100,
    ),
  );
  const hierarchicalContribution = round2(
    clamp(
      structureScore * 0.2 +
        detailScore * 0.2 +
        temporalScore * 0.2 +
        sceneIntegrity * 0.2 +
        flatRolloutScore * 0.2,
      0,
      100,
    ),
  );
  const flatContribution = round2(
    clamp(
      flatRolloutScore * 0.55 +
        input.fluencyScore * 30 +
        input.rolloutSmoothness * 20 -
        pressure * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      flatContribution * (naive ? 0.78 : 0.5) +
        hierarchicalContribution * (naive ? 0.22 : 0.5) -
        input.surprisePressure * 8 -
        input.horizonDrift * 6,
      0,
      100,
    ),
  );

  return {
    mode: "flat",
    structureScore,
    detailScore,
    temporalScore,
    sceneIntegrity,
    flatRolloutScore,
    confidence,
    hierarchicalContribution,
    flatContribution,
    overall,
  };
}
