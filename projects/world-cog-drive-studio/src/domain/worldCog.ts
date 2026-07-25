import {
  type DriveInput,
  type DriveQuality,
  biasWeight,
  clamp,
  round2,
  routeLoad,
} from "./types";

/**
 * Dual-level world-cognitive VLA scorer (good path A):
 * rewards world forecast fit, cognitive depth, action alignment, trajectory.
 */
export function scoreWorldCognitive(input: DriveInput): DriveQuality {
  const cog = input.profile === "world_cognitive";
  const boost = cog ? 1.12 : 0.96;
  const wW = biasWeight(input.driveBias, "world_first");
  const wA = biasWeight(input.driveBias, "action_first");
  const wR = biasWeight(input.driveBias, "reactive_first");
  const avgBias = (wW + wA + wR) / 3;
  const load = routeLoad(input.routeHardness, input.worldForecastFit);

  const worldScore = round2(
    clamp(
      (input.worldForecastFit * 55 +
        input.cognitiveDepth * 25 -
        load * 10) *
        boost *
        avgBias +
        (cog ? 8 : 0) -
        input.leakageRisk * (cog ? 6 : 14) -
        (input.driveBias === "reactive_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const cognitiveScore = round2(
    clamp(
      input.cognitiveDepth * 60 * boost +
        input.worldForecastFit * 25 +
        (cog ? 8 : 0) -
        input.reactiveOptimism * (cog ? 4 : 16) -
        (input.driveBias === "reactive_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const actionScore = round2(
    clamp(
      input.actionAlignment * 58 * boost * wA +
        input.worldForecastFit * 28 +
        (cog ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const trajectoryScore = round2(
    clamp(
      input.trajectoryIntegrity * 50 * boost * wW +
        input.cognitiveDepth * 25 +
        input.worldForecastFit * 15 +
        (cog ? 8 : 0) -
        (input.driveBias === "reactive_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const singleLevelScore = round2(
    clamp(
      input.singleLevelPassRate * 55 * boost +
        input.reactiveOptimism * 20 -
        input.routeHardness * 18 -
        (cog ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.worldForecastFit * 40 +
        input.cognitiveDepth * 30 +
        input.actionAlignment * 25 -
        input.reactiveOptimism * 15,
      0,
      100,
    ),
  );
  const worldCognitiveContribution = round2(
    clamp(
      worldScore * 0.26 +
        cognitiveScore * 0.24 +
        actionScore * 0.28 +
        trajectoryScore * 0.22,
      0,
      100,
    ),
  );
  const singleLevelContribution = round2(
    clamp(
      singleLevelScore * 0.7 +
        input.singleLevelPassRate * 20 +
        input.reactiveOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      worldCognitiveContribution * (cog ? 0.82 : 0.4) +
        singleLevelContribution * (cog ? 0.18 : 0.6) +
        (cog ? 4 : 0) -
        (input.driveBias === "reactive_first" && cog ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "world_cognitive",
    worldScore,
    cognitiveScore,
    actionScore,
    trajectoryScore,
    singleLevelScore,
    confidence,
    worldCognitiveContribution,
    singleLevelContribution,
    overall,
  };
}

/**
 * Single-level VLA baseline (path B):
 * rewards single-level pass rate + reactive optimism, weak on world honesty.
 */
export function scoreSingleLevel(input: DriveInput): DriveQuality {
  const single = input.profile === "single_level";
  const boost = single ? 1.08 : 0.92;
  const wR = biasWeight(input.driveBias, "reactive_first");
  const load = routeLoad(input.routeHardness, input.worldForecastFit);

  const worldScore = round2(
    clamp(
      input.singleLevelPassRate * 35 * boost +
        wR * 10 -
        input.routeHardness * 22 -
        input.leakageRisk * 12 -
        (input.driveBias === "world_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const cognitiveScore = round2(
    clamp(
      input.reactiveOptimism * 40 * boost +
        input.singleLevelPassRate * 25 -
        load * 15 -
        input.worldForecastFit * 8,
      0,
      100,
    ),
  );
  const actionScore = round2(
    clamp(
      input.reactiveOptimism * 38 * boost +
        input.singleLevelPassRate * 20 -
        input.actionAlignment * (single ? 5 : 0) -
        load * 18 -
        (single ? 0 : 6),
      0,
      100,
    ),
  );
  const trajectoryScore = round2(
    clamp(
      input.singleLevelPassRate * 42 * boost +
        input.reactiveOptimism * 28 -
        input.worldForecastFit * 10 +
        (single ? 5 : 0),
      0,
      100,
    ),
  );
  const singleLevelScore = round2(
    clamp(
      input.singleLevelPassRate * 58 * boost * wR +
        input.reactiveOptimism * 32 -
        input.routeHardness * 10 +
        (single ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.reactiveOptimism * 45 +
        input.singleLevelPassRate * 35 -
        input.routeHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const worldCognitiveContribution = round2(
    clamp(
      worldScore * 0.2 +
        cognitiveScore * 0.2 +
        actionScore * 0.2 +
        trajectoryScore * 0.2 +
        singleLevelScore * 0.2,
      0,
      100,
    ),
  );
  const singleLevelContribution = round2(
    clamp(
      singleLevelScore * 0.55 +
        input.reactiveOptimism * 30 +
        input.singleLevelPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      singleLevelContribution * (single ? 0.78 : 0.5) +
        worldCognitiveContribution * (single ? 0.22 : 0.5) -
        input.routeHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_level",
    worldScore,
    cognitiveScore,
    actionScore,
    trajectoryScore,
    singleLevelScore,
    confidence,
    worldCognitiveContribution,
    singleLevelContribution,
    overall,
  };
}
