import {
  type ReactionInput,
  type ReactionQuality,
  biasWeight,
  clamp,
  conditionLoad,
  round2,
} from "./types";

/**
 * Chemist-in-the-loop VLM scorer (good path A):
 * rewards pack coverage, reagent fidelity, loop clarity, run stability.
 */
export function scoreChemistInLoop(input: ReactionInput): ReactionQuality {
  const only = input.profile === "chemist_in_loop_vlm";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.loopBias, "chemist_first");
  const wP = biasWeight(input.loopBias, "policy_first");
  const wO = biasWeight(input.loopBias, "open_loop_first");
  const avgBias = (wC + wP + wO) / 3;
  const load = conditionLoad(input.conditionHardness, input.packCoverage);

  const conditionCoverage = round2(
    clamp(
      (input.packCoverage * 55 +
        input.reagentFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.loopBias === "open_loop_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const chemistGateScore = round2(
    clamp(
      input.reagentFidelity * 60 * boost +
        input.packCoverage * 25 +
        (only ? 8 : 0) -
        input.skipOptimism * (only ? 4 : 16) -
        (input.loopBias === "open_loop_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const loopOptScore = round2(
    clamp(
      input.loopClarity * 58 * boost * wP +
        input.packCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.runStability * 50 * boost * wC +
        input.reagentFidelity * 25 +
        input.packCoverage * 15 +
        (only ? 8 : 0) -
        (input.loopBias === "open_loop_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const openLoopScore = round2(
    clamp(
      input.openLoopPassRate * 55 * boost +
        input.skipOptimism * 20 -
        input.conditionHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.packCoverage * 40 +
        input.reagentFidelity * 30 +
        input.loopClarity * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const loopContribution = round2(
    clamp(
      conditionCoverage * 0.26 +
        chemistGateScore * 0.24 +
        loopOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const openLoopContribution = round2(
    clamp(
      openLoopScore * 0.7 +
        input.openLoopPassRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      loopContribution * (only ? 0.82 : 0.4) +
        openLoopContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.loopBias === "open_loop_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "chemist_in_loop_vlm",
    conditionCoverage,
    chemistGateScore,
    loopOptScore,
    packIntegrity,
    openLoopScore,
    confidence,
    loopContribution,
    openLoopContribution,
    overall,
  };
}

/**
 * Open-loop VLM baseline (path B):
 * rewards open-loop pass rate + skip optimism, weak on chemist-gate honesty.
 */
export function scoreOpenLoop(input: ReactionInput): ReactionQuality {
  const open = input.profile === "open_loop_vlm";
  const boost = open ? 1.08 : 0.92;
  const wO = biasWeight(input.loopBias, "open_loop_first");
  const load = conditionLoad(input.conditionHardness, input.packCoverage);

  const conditionCoverage = round2(
    clamp(
      input.openLoopPassRate * 35 * boost +
        wO * 10 -
        input.conditionHardness * 22 -
        input.overclaimRisk * 12 -
        (input.loopBias === "chemist_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const chemistGateScore = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.openLoopPassRate * 25 -
        load * 15 -
        input.packCoverage * 8,
      0,
      100,
    ),
  );
  const loopOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.openLoopPassRate * 20 -
        input.loopClarity * (open ? 5 : 0) -
        load * 18 -
        (open ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.openLoopPassRate * 42 * boost +
        input.skipOptimism * 28 -
        input.packCoverage * 10 +
        (open ? 5 : 0),
      0,
      100,
    ),
  );
  const openLoopScore = round2(
    clamp(
      input.openLoopPassRate * 58 * boost * wO +
        input.skipOptimism * 32 -
        input.conditionHardness * 10 +
        (open ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.openLoopPassRate * 35 -
        input.conditionHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const loopContribution = round2(
    clamp(
      conditionCoverage * 0.2 +
        chemistGateScore * 0.2 +
        loopOptScore * 0.2 +
        packIntegrity * 0.2 +
        openLoopScore * 0.2,
      0,
      100,
    ),
  );
  const openLoopContribution = round2(
    clamp(
      openLoopScore * 0.55 +
        input.skipOptimism * 30 +
        input.openLoopPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      openLoopContribution * (open ? 0.78 : 0.5) +
        loopContribution * (open ? 0.22 : 0.5) -
        input.conditionHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "open_loop_vlm",
    conditionCoverage,
    chemistGateScore,
    loopOptScore,
    packIntegrity,
    openLoopScore,
    confidence,
    loopContribution,
    openLoopContribution,
    overall,
  };
}
