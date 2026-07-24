import {
  type LocoInput,
  type LocoQuality,
  clamp,
  round2,
} from "./types";

function skillBoost(skill: LocoInput["skill"]): number {
  switch (skill) {
    case "trot":
      return 1.02;
    case "pace":
      return 0.98;
    case "bound":
      return 1.04;
    case "crawl":
      return 1.06;
    case "climb":
      return 1.08;
    default: {
      const _exhaustive: never = skill;
      return _exhaustive;
    }
  }
}

function terrainSignal(input: LocoInput): number {
  const roughnessPenalty = input.terrainRoughness * 28;
  const slopePenalty = input.slopeGrade * 18;
  return clamp(
    62 +
      input.perceptionQuality * 22 +
      input.skillCoverage * 18 -
      roughnessPenalty -
      slopePenalty,
    0,
    100,
  );
}

function transitionSignal(input: LocoInput): number {
  return clamp(
    input.transitionSmoothness * 44 +
      input.skillCoverage * 28 +
      input.gaitStability * 18 -
      input.slipRisk * 16,
    0,
    100,
  );
}

/**
 * Multi-skill perceptive plan quality (good path).
 * Smooth skill switches keep traversal alive when terrain changes.
 */
export function scoreMultiSkill(input: LocoInput): LocoQuality {
  const multi = input.plan === "multi_skill";
  const boost = (multi ? 1.08 : 0.96) * skillBoost(input.skill);
  const terrain = terrainSignal(input);
  const transit = transitionSignal(input);

  const traversalScore = round2(
    clamp(
      (terrain * 0.55 +
        input.perceptionQuality * 22 +
        input.trajectoryDensity * 14) *
        boost -
        input.slipRisk * 12,
      0,
      100,
    ),
  );

  const transitionScore = round2(
    clamp(
      (transit * 0.7 +
        input.transitionSmoothness * 22 +
        (multi ? 12 : 2)) *
        boost,
      0,
      100,
    ),
  );

  const perceptionScore = round2(
    clamp(
      (input.perceptionQuality * 46 +
        input.trajectoryDensity * 24 +
        (1 - input.terrainRoughness) * 16) *
        boost,
      0,
      100,
    ),
  );

  const stabilityScore = round2(
    clamp(
      (input.gaitStability * 42 +
        input.transitionSmoothness * 26 +
        (1 - input.slipRisk) * 18) *
        boost -
        input.slopeGrade * 10,
      0,
      100,
    ),
  );

  const energyScore = round2(
    clamp(
      (input.energyEfficiency * 48 +
        input.skillCoverage * 18 +
        transit * 0.2) *
        boost,
      0,
      100,
    ),
  );

  const stallRisk = round2(
    clamp(
      100 -
        (input.slipRisk * 38 +
          input.terrainRoughness * 22 +
          (multi ? 0 : 18) +
          Math.max(0, input.slopeGrade - input.skillCoverage) * 24),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      traversalScore * 0.22 +
        transitionScore * 0.22 +
        perceptionScore * 0.16 +
        stabilityScore * 0.16 +
        energyScore * 0.12 +
        stallRisk * 0.12,
      0,
      100,
    ),
  );

  return {
    mode: "multi_skill",
    traversalScore,
    transitionScore,
    perceptionScore,
    stabilityScore,
    energyScore,
    stallRisk,
    overall,
  };
}

/**
 * Single-gait baseline — stalls when terrain demands a skill switch.
 */
export function scoreSingleGait(input: LocoInput): LocoQuality {
  const stallPenalty = clamp(
    0.36 +
      input.terrainRoughness * 0.26 +
      input.slipRisk * 0.18 +
      (1 - input.skillCoverage) * 0.16 +
      (1 - input.transitionSmoothness) * 0.12,
    0.26,
    0.92,
  );
  const terrain = terrainSignal(input);
  const transit = transitionSignal(input);

  const traversalScore = round2(
    clamp((terrain * 0.38 + input.gaitStability * 14) * stallPenalty, 0, 100),
  );

  const transitionScore = round2(
    clamp(
      (transit * 0.28 + input.transitionSmoothness * 10) * stallPenalty -
        (input.plan === "single_gait" ? 0 : 4),
      0,
      100,
    ),
  );

  const perceptionScore = round2(
    clamp(
      (input.perceptionQuality * 24 + input.trajectoryDensity * 10) *
        stallPenalty,
      0,
      100,
    ),
  );

  const stabilityScore = round2(
    clamp(
      (input.gaitStability * 28 + (1 - input.slipRisk) * 12) * stallPenalty -
        input.slopeGrade * 14,
      0,
      100,
    ),
  );

  const energyScore = round2(
    clamp(
      (input.energyEfficiency * 30 + input.gaitStability * 10) * stallPenalty,
      0,
      100,
    ),
  );

  const stallRisk = round2(
    clamp(
      100 -
        (input.slipRisk * 55 +
          input.terrainRoughness * 28 +
          (1 - input.skillCoverage) * 22 +
          14),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      traversalScore * 0.16 +
        transitionScore * 0.1 +
        perceptionScore * 0.12 +
        stabilityScore * 0.18 +
        energyScore * 0.14 +
        stallRisk * 0.3,
      0,
      100,
    ),
  );

  return {
    mode: "single_gait",
    traversalScore,
    transitionScore,
    perceptionScore,
    stabilityScore,
    energyScore,
    stallRisk,
    overall,
  };
}
