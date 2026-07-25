import {
  type ExemplarInput,
  type ExemplarQuality,
  biasWeight,
  clamp,
  roiLoad,
  round2,
} from "./types";

/**
 * Optimized in-context exemplars scorer (good path A):
 * rewards localization precision, coverage breadth, exemplar diversity,
 * and prompt fit for ROI selection.
 */
export function scoreOptimizedIncontextExemplars(
  input: ExemplarInput,
): ExemplarQuality {
  const only = input.profile === "optimized_incontext_exemplars";
  const boost = only ? 1.12 : 0.96;
  const wL = biasWeight(input.exemplarBias, "localization_first");
  const wC = biasWeight(input.exemplarBias, "coverage_first");
  const wN = biasWeight(input.exemplarBias, "naive_first");
  const avgBias = (wL + wC + wN) / 3;
  const load = roiLoad(input.roiHardness, input.localizationPrecision);

  const localizationScore = round2(
    clamp(
      (input.localizationPrecision * 55 +
        input.coverageBreadth * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.exemplarBias === "naive_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.coverageBreadth * 60 * boost +
        input.localizationPrecision * 25 +
        (only ? 8 : 0) -
        input.naiveOptimism * (only ? 4 : 16) -
        (input.exemplarBias === "naive_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const diversityScore = round2(
    clamp(
      input.exemplarDiversity * 58 * boost * wL +
        input.localizationPrecision * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const promptIntegrity = round2(
    clamp(
      input.promptFit * 50 * boost * wC +
        input.coverageBreadth * 25 +
        input.localizationPrecision * 15 +
        (only ? 8 : 0) -
        (input.exemplarBias === "naive_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const naiveBaselineScore = round2(
    clamp(
      input.naiveDumpRate * 55 * boost +
        input.naiveOptimism * 20 -
        input.roiHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.localizationPrecision * 40 +
        input.coverageBreadth * 30 +
        input.exemplarDiversity * 25 -
        input.naiveOptimism * 15,
      0,
      100,
    ),
  );
  const optimizedContribution = round2(
    clamp(
      localizationScore * 0.26 +
        coverageScore * 0.24 +
        diversityScore * 0.28 +
        promptIntegrity * 0.22,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      naiveBaselineScore * 0.7 +
        input.naiveDumpRate * 20 +
        input.naiveOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      optimizedContribution * (only ? 0.82 : 0.4) +
        naiveContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.exemplarBias === "naive_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "optimized_incontext_exemplars",
    localizationScore,
    coverageScore,
    diversityScore,
    promptIntegrity,
    naiveBaselineScore,
    confidence,
    optimizedContribution,
    naiveContribution,
    overall,
  };
}

/**
 * Naive exemplar baseline (path B):
 * rewards unordered exemplar dump pass-rate + optimism,
 * weak on curated localization honesty.
 */
export function scoreNaiveExemplarBaseline(
  input: ExemplarInput,
): ExemplarQuality {
  const baseline = input.profile === "naive_exemplar_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wN = biasWeight(input.exemplarBias, "naive_first");
  const load = roiLoad(input.roiHardness, input.localizationPrecision);

  const localizationScore = round2(
    clamp(
      input.naiveDumpRate * 35 * boost +
        wN * 10 -
        input.roiHardness * 22 -
        input.overclaimRisk * 12 -
        (input.exemplarBias === "localization_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.naiveOptimism * 40 * boost +
        input.naiveDumpRate * 25 -
        load * 15 -
        input.localizationPrecision * 8,
      0,
      100,
    ),
  );
  const diversityScore = round2(
    clamp(
      input.naiveOptimism * 38 * boost +
        input.naiveDumpRate * 20 -
        input.exemplarDiversity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const promptIntegrity = round2(
    clamp(
      input.naiveDumpRate * 42 * boost +
        input.naiveOptimism * 28 -
        input.localizationPrecision * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const naiveBaselineScore = round2(
    clamp(
      input.naiveDumpRate * 58 * boost * wN +
        input.naiveOptimism * 32 -
        input.roiHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.naiveOptimism * 45 +
        input.naiveDumpRate * 35 -
        input.roiHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const optimizedContribution = round2(
    clamp(
      localizationScore * 0.2 +
        coverageScore * 0.2 +
        diversityScore * 0.2 +
        promptIntegrity * 0.2 +
        naiveBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      naiveBaselineScore * 0.55 +
        input.naiveOptimism * 30 +
        input.naiveDumpRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      naiveContribution * (baseline ? 0.78 : 0.5) +
        optimizedContribution * (baseline ? 0.22 : 0.5) -
        input.roiHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_exemplar_baseline",
    localizationScore,
    coverageScore,
    diversityScore,
    promptIntegrity,
    naiveBaselineScore,
    confidence,
    optimizedContribution,
    naiveContribution,
    overall,
  };
}
