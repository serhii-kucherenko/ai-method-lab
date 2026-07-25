import {
  type ClipInput,
  type ClipQuality,
  biasWeight,
  clamp,
  stressLoad,
  round2,
} from "./types";

/**
 * Multimodal wearable plant-stress scorer (good path A):
 * rewards clip coverage, multimodal fidelity, sensor clarity, run stability.
 */
export function scoreMultimodalWearableStress(input: ClipInput): ClipQuality {
  const only = input.profile === "multimodal_wearable_stress";
  const boost = only ? 1.12 : 0.96;
  const wM = biasWeight(input.stressBias, "multimodal_first");
  const wS = biasWeight(input.stressBias, "sensor_first");
  const wB = biasWeight(input.stressBias, "baseline_first");
  const avgBias = (wM + wS + wB) / 3;
  const load = stressLoad(input.stressHardness, input.clipCoverage);

  const clipCoverageScore = round2(
    clamp(
      (input.clipCoverage * 55 +
        input.multimodalFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.stressBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const multimodalScore = round2(
    clamp(
      input.multimodalFidelity * 60 * boost +
        input.clipCoverage * 25 +
        (only ? 8 : 0) -
        input.channelOptimism * (only ? 4 : 16) -
        (input.stressBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const sensorOptScore = round2(
    clamp(
      input.sensorClarity * 58 * boost * wS +
        input.clipCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.runStability * 50 * boost * wM +
        input.multimodalFidelity * 25 +
        input.clipCoverage * 15 +
        (only ? 8 : 0) -
        (input.stressBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleSensorRate * 55 * boost +
        input.channelOptimism * 20 -
        input.stressHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.clipCoverage * 40 +
        input.multimodalFidelity * 30 +
        input.sensorClarity * 25 -
        input.channelOptimism * 15,
      0,
      100,
    ),
  );
  const multimodalContribution = round2(
    clamp(
      clipCoverageScore * 0.26 +
        multimodalScore * 0.24 +
        sensorOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.singleSensorRate * 20 +
        input.channelOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      multimodalContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.stressBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multimodal_wearable_stress",
    clipCoverageScore,
    multimodalScore,
    sensorOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    multimodalContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Single-sensor baseline (path B):
 * rewards ungated single-channel rate + channel optimism, weak on multimodal honesty.
 */
export function scoreSingleSensorBaseline(input: ClipInput): ClipQuality {
  const baseline = input.profile === "single_sensor_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.stressBias, "baseline_first");
  const load = stressLoad(input.stressHardness, input.clipCoverage);

  const clipCoverageScore = round2(
    clamp(
      input.singleSensorRate * 35 * boost +
        wB * 10 -
        input.stressHardness * 22 -
        input.overclaimRisk * 12 -
        (input.stressBias === "multimodal_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const multimodalScore = round2(
    clamp(
      input.channelOptimism * 40 * boost +
        input.singleSensorRate * 25 -
        load * 15 -
        input.clipCoverage * 8,
      0,
      100,
    ),
  );
  const sensorOptScore = round2(
    clamp(
      input.channelOptimism * 38 * boost +
        input.singleSensorRate * 20 -
        input.sensorClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.singleSensorRate * 42 * boost +
        input.channelOptimism * 28 -
        input.clipCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleSensorRate * 58 * boost * wB +
        input.channelOptimism * 32 -
        input.stressHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.channelOptimism * 45 +
        input.singleSensorRate * 35 -
        input.stressHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const multimodalContribution = round2(
    clamp(
      clipCoverageScore * 0.2 +
        multimodalScore * 0.2 +
        sensorOptScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.channelOptimism * 30 +
        input.singleSensorRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        multimodalContribution * (baseline ? 0.22 : 0.5) -
        input.stressHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_sensor_baseline",
    clipCoverageScore,
    multimodalScore,
    sensorOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    multimodalContribution,
    baselineContribution,
    overall,
  };
}
