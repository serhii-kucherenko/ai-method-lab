import {
  type OmicPriorInput,
  type OmicPriorQuality,
  biasWeight,
  clamp,
  traitLoad,
  round2,
} from "./types";

/**
 * Priors-informed transformer scorer (good path A):
 * rewards prior coverage, transformer fidelity, trait grounding,
 * and pack completeness for soft-sim omic packs.
 */
export function scorePriorsInformedTransformer(
  input: OmicPriorInput,
): OmicPriorQuality {
  const only = input.profile === "priors_informed_transformer";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.priorBias, "priors_first");
  const wT = biasWeight(input.priorBias, "trait_first");
  const wB = biasWeight(input.priorBias, "baseline_first");
  const avgBias = (wP + wT + wB) / 3;
  const load = traitLoad(input.traitHardness, input.traitGrounding);

  const priorScore = round2(
    clamp(
      (input.priorCoverage * 55 +
        input.traitGrounding * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.priorBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.transformerFidelity * 60 * boost +
        input.priorCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.priorBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const traitScore = round2(
    clamp(
      input.traitGrounding * 58 * boost * wT +
        input.priorCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wP +
        input.transformerFidelity * 25 +
        input.priorCoverage * 15 +
        (only ? 8 : 0) -
        (input.priorBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.traitHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.priorCoverage * 40 +
        input.transformerFidelity * 30 +
        input.packCompleteness * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const priorsContribution = round2(
    clamp(
      priorScore * 0.26 +
        fidelityScore * 0.24 +
        traitScore * 0.28 +
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
      priorsContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.priorBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "priors_informed_transformer",
    priorScore,
    fidelityScore,
    traitScore,
    completenessScore,
    baselineScore,
    confidence,
    priorsContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Priors-free omics baseline (path B):
 * rewards baseline confidence + optimism,
 * weak on statistical-priors honesty.
 */
export function scorePriorsFreeOmicsBaseline(
  input: OmicPriorInput,
): OmicPriorQuality {
  const baseline = input.profile === "priors_free_omics_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.priorBias, "baseline_first");
  const load = traitLoad(input.traitHardness, input.traitGrounding);

  const priorScore = round2(
    clamp(
      input.baselineConfidence * 35 * boost +
        wB * 10 -
        input.traitHardness * 22 -
        input.overclaimRisk * 12 -
        (input.priorBias === "priors_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.baselineConfidence * 25 -
        load * 15 -
        input.priorCoverage * 8,
      0,
      100,
    ),
  );
  const traitScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.baselineConfidence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
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
        input.priorCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineConfidence * 58 * boost * wB +
        input.baselineOptimism * 32 -
        input.traitHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.baselineConfidence * 35 -
        input.traitHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const priorsContribution = round2(
    clamp(
      priorScore * 0.2 +
        fidelityScore * 0.2 +
        traitScore * 0.2 +
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
        priorsContribution * (baseline ? 0.22 : 0.5) -
        input.traitHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "priors_free_omics_baseline",
    priorScore,
    fidelityScore,
    traitScore,
    completenessScore,
    baselineScore,
    confidence,
    priorsContribution,
    baselineContribution,
    overall,
  };
}
