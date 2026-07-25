import {
  type AccelPdInput,
  type AccelPdQuality,
  biasWeight,
  clamp,
  signalLoad,
  round2,
} from "./types";

/**
 * Multi-channel PA transformer scorer (good path A):
 * rewards channel coverage, transformer fidelity, free-living activity
 * grounding, and representation completeness for soft-sim accel packs.
 */
export function scoreMultichannelPaTransformer(
  input: AccelPdInput,
): AccelPdQuality {
  const only = input.profile === "multichannel_pa_transformer";
  const boost = only ? 1.12 : 0.96;
  const wT = biasWeight(input.paBias, "transformer_first");
  const wCh = biasWeight(input.paBias, "channel_first");
  const wB = biasWeight(input.paBias, "baseline_first");
  const avgBias = (wT + wCh + wB) / 3;
  const load = signalLoad(input.signalHardness, input.activityGrounding);

  const channelScore = round2(
    clamp(
      (input.channelCoverage * 55 +
        input.activityGrounding * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.paBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.transformerFidelity * 60 * boost +
        input.channelCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.paBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const activityScore = round2(
    clamp(
      input.activityGrounding * 58 * boost * wCh +
        input.channelCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.representationCompleteness * 50 * boost * wT +
        input.transformerFidelity * 25 +
        input.channelCoverage * 15 +
        (only ? 8 : 0) -
        (input.paBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.signalHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.channelCoverage * 40 +
        input.transformerFidelity * 30 +
        input.representationCompleteness * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const transformerContribution = round2(
    clamp(
      channelScore * 0.26 +
        fidelityScore * 0.24 +
        activityScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.baselineConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      transformerContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.paBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multichannel_pa_transformer",
    channelScore,
    fidelityScore,
    activityScore,
    completenessScore,
    baselineScore,
    confidence,
    transformerContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Handcrafted PA-feature baseline (path B):
 * rewards handcrafted feature confidence + baseline optimism,
 * weak on multi-channel transformer honesty.
 */
export function scoreHandcraftedPaBaseline(
  input: AccelPdInput,
): AccelPdQuality {
  const baseline = input.profile === "handcrafted_pa_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.paBias, "baseline_first");
  const load = signalLoad(input.signalHardness, input.activityGrounding);

  const channelScore = round2(
    clamp(
      input.baselineConfidence * 35 * boost +
        wB * 10 -
        input.signalHardness * 22 -
        input.overclaimRisk * 12 -
        (input.paBias === "transformer_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.baselineConfidence * 25 -
        load * 15 -
        input.channelCoverage * 8,
      0,
      100,
    ),
  );
  const activityScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.baselineConfidence * 20 -
        input.representationCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.baselineConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.channelCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineConfidence * 58 * boost * wB +
        input.baselineOptimism * 32 -
        input.signalHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.baselineConfidence * 35 -
        input.signalHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const transformerContribution = round2(
    clamp(
      channelScore * 0.2 +
        fidelityScore * 0.2 +
        activityScore * 0.2 +
        completenessScore * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.baselineConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        transformerContribution * (baseline ? 0.22 : 0.5) -
        input.signalHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "handcrafted_pa_baseline",
    channelScore,
    fidelityScore,
    activityScore,
    completenessScore,
    baselineScore,
    confidence,
    transformerContribution,
    baselineContribution,
    overall,
  };
}
