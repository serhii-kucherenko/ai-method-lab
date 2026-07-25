import {
  type ForceInput,
  type ForceQuality,
  biasWeight,
  clamp,
  reactionLoad,
  round2,
} from "./types";

/**
 * Foundation-model atomistics scorer (good path A):
 * rewards pack coverage, FM fidelity, force clarity, run stability.
 */
export function scoreFoundationModelAtomistics(input: ForceInput): ForceQuality {
  const only = input.profile === "foundation_model_atomistics";
  const boost = only ? 1.12 : 0.96;
  const wM = biasWeight(input.forceBias, "fm_first");
  const wS = biasWeight(input.forceBias, "force_first");
  const wB = biasWeight(input.forceBias, "baseline_first");
  const avgBias = (wM + wS + wB) / 3;
  const load = reactionLoad(input.reactionHardness, input.packCoverage);

  const packCoverageScore = round2(
    clamp(
      (input.packCoverage * 55 +
        input.fmFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.forceBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fmScore = round2(
    clamp(
      input.fmFidelity * 60 * boost +
        input.packCoverage * 25 +
        (only ? 8 : 0) -
        input.ffOptimism * (only ? 4 : 16) -
        (input.forceBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const forceOptScore = round2(
    clamp(
      input.forceClarity * 58 * boost * wS +
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
      input.runStability * 50 * boost * wM +
        input.fmFidelity * 25 +
        input.packCoverage * 15 +
        (only ? 8 : 0) -
        (input.forceBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.classicalFfRate * 55 * boost +
        input.ffOptimism * 20 -
        input.reactionHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.packCoverage * 40 +
        input.fmFidelity * 30 +
        input.forceClarity * 25 -
        input.ffOptimism * 15,
      0,
      100,
    ),
  );
  const fmContribution = round2(
    clamp(
      packCoverageScore * 0.26 +
        fmScore * 0.24 +
        forceOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.classicalFfRate * 20 +
        input.ffOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      fmContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.forceBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "foundation_model_atomistics",
    packCoverageScore,
    fmScore,
    forceOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    fmContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Classical force-field baseline (path B):
 * rewards ungated classical FF rate + FF optimism, weak on FM honesty.
 */
export function scoreClassicalForceFieldBaseline(
  input: ForceInput,
): ForceQuality {
  const baseline = input.profile === "classical_force_field_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.forceBias, "baseline_first");
  const load = reactionLoad(input.reactionHardness, input.packCoverage);

  const packCoverageScore = round2(
    clamp(
      input.classicalFfRate * 35 * boost +
        wB * 10 -
        input.reactionHardness * 22 -
        input.overclaimRisk * 12 -
        (input.forceBias === "fm_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fmScore = round2(
    clamp(
      input.ffOptimism * 40 * boost +
        input.classicalFfRate * 25 -
        load * 15 -
        input.packCoverage * 8,
      0,
      100,
    ),
  );
  const forceOptScore = round2(
    clamp(
      input.ffOptimism * 38 * boost +
        input.classicalFfRate * 20 -
        input.forceClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.classicalFfRate * 42 * boost +
        input.ffOptimism * 28 -
        input.packCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.classicalFfRate * 58 * boost * wB +
        input.ffOptimism * 32 -
        input.reactionHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.ffOptimism * 45 +
        input.classicalFfRate * 35 -
        input.reactionHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const fmContribution = round2(
    clamp(
      packCoverageScore * 0.2 +
        fmScore * 0.2 +
        forceOptScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.ffOptimism * 30 +
        input.classicalFfRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        fmContribution * (baseline ? 0.22 : 0.5) -
        input.reactionHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "classical_force_field_baseline",
    packCoverageScore,
    fmScore,
    forceOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    fmContribution,
    baselineContribution,
    overall,
  };
}
