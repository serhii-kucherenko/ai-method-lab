import {
  type PvCausalInput,
  type PvCausalQuality,
  biasWeight,
  clamp,
  round2,
  trialLoad,
} from "./types";

/**
 * Target-trial causal signal scorer (good path A):
 * rewards defined-population cohort coverage, exposure fidelity,
 * confounder control, and pack completeness without tip-line theater.
 */
export function scoreTargetTrialCausalSignal(
  input: PvCausalInput,
): PvCausalQuality {
  const only = input.profile === "target_trial_causal_signal";
  const boost = only ? 1.12 : 0.96;
  const wT = biasWeight(input.signalBias, "trial_first");
  const wE = biasWeight(input.signalBias, "exposure_first");
  const wL = biasWeight(input.signalBias, "tip_line_first");
  const avgBias = (wT + wE + (2 - wL)) / 3;
  const load = trialLoad(input.trialHardness, input.confounderControl);

  const cohortScore = round2(
    clamp(
      (input.cohortCoverage * 55 +
        input.confounderControl * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.signalBias === "tip_line_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const exposureScore = round2(
    clamp(
      input.exposureFidelity * 60 * boost +
        input.cohortCoverage * 25 +
        (only ? 8 : 0) -
        input.tipLineOptimism * (only ? 4 : 16) -
        (input.signalBias === "tip_line_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const causalScore = round2(
    clamp(
      input.confounderControl * 58 * boost * wT +
        input.cohortCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wE +
        input.exposureFidelity * 25 +
        input.cohortCoverage * 15 +
        (only ? 8 : 0) -
        (input.signalBias === "tip_line_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const tipLineScore = round2(
    clamp(
      input.spontaneousVolume * 55 * boost +
        input.tipLineOptimism * 20 -
        input.trialHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cohortCoverage * 40 +
        input.exposureFidelity * 30 +
        input.packCompleteness * 25 -
        input.tipLineOptimism * 15,
      0,
      100,
    ),
  );
  const targetTrialContribution = round2(
    clamp(
      cohortScore * 0.26 +
        exposureScore * 0.24 +
        causalScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const spontaneousContribution = round2(
    clamp(
      tipLineScore * 0.7 +
        input.spontaneousVolume * 20 +
        input.tipLineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      targetTrialContribution * (only ? 0.82 : 0.4) +
        spontaneousContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.signalBias === "tip_line_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "target_trial_causal_signal",
    cohortScore,
    exposureScore,
    causalScore,
    completenessScore,
    tipLineScore,
    confidence,
    targetTrialContribution,
    spontaneousContribution,
    overall,
  };
}

/**
 * Spontaneous-reporting baseline (path B):
 * rewards tip-line volume + optimism,
 * weak on defined-population target-trial honesty.
 */
export function scoreSpontaneousReportingBaseline(
  input: PvCausalInput,
): PvCausalQuality {
  const baseline = input.profile === "spontaneous_reporting_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wL = biasWeight(input.signalBias, "tip_line_first");
  const load = trialLoad(input.trialHardness, input.confounderControl);

  const cohortScore = round2(
    clamp(
      input.spontaneousVolume * 35 * boost +
        wL * 10 -
        input.trialHardness * 22 -
        input.overclaimRisk * 12 -
        (input.signalBias === "trial_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const exposureScore = round2(
    clamp(
      input.tipLineOptimism * 40 * boost +
        input.spontaneousVolume * 25 -
        load * 15 -
        input.cohortCoverage * 8,
      0,
      100,
    ),
  );
  const causalScore = round2(
    clamp(
      input.tipLineOptimism * 38 * boost +
        input.spontaneousVolume * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.spontaneousVolume * 42 * boost +
        input.tipLineOptimism * 28 -
        input.cohortCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const tipLineScore = round2(
    clamp(
      input.spontaneousVolume * 58 * boost * wL +
        input.tipLineOptimism * 32 -
        input.trialHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.tipLineOptimism * 45 +
        input.spontaneousVolume * 35 -
        input.trialHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const targetTrialContribution = round2(
    clamp(
      cohortScore * 0.2 +
        exposureScore * 0.2 +
        causalScore * 0.2 +
        completenessScore * 0.2 +
        tipLineScore * 0.2,
      0,
      100,
    ),
  );
  const spontaneousContribution = round2(
    clamp(
      tipLineScore * 0.55 +
        input.tipLineOptimism * 30 +
        input.spontaneousVolume * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      spontaneousContribution * (baseline ? 0.78 : 0.5) +
        targetTrialContribution * (baseline ? 0.22 : 0.5) -
        input.trialHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "spontaneous_reporting_baseline",
    cohortScore,
    exposureScore,
    causalScore,
    completenessScore,
    tipLineScore,
    confidence,
    targetTrialContribution,
    spontaneousContribution,
    overall,
  };
}
