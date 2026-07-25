import {
  type MolInput,
  type MolQuality,
  biasWeight,
  designLoad,
  clamp,
  round2,
} from "./types";

/**
 * Sample-efficient generative optimization scorer (good path A):
 * rewards campaign coverage, target fidelity, and sample efficiency under design hardness.
 */
export function scoreSampleEfficient(input: MolInput): MolQuality {
  const efficient = input.profile === "sample_efficient";
  const boost = efficient ? 1.12 : 0.96;
  const wE = biasWeight(input.molBias, "efficiency_strict");
  const wFirst = biasWeight(input.molBias, "optimizer_first");
  const wB = biasWeight(input.molBias, "baseline_first");
  const avgBias = (wE + wFirst + wB) / 3;
  const load = designLoad(input.designHardness, input.campaignCoverage);

  const hitEnrichment = round2(
    clamp(
      (input.campaignCoverage * 55 +
        input.targetFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (efficient ? 8 : 0) -
        input.leakageRisk * (efficient ? 6 : 14) -
        (input.molBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const efficiencyDiagnosis = round2(
    clamp(
      input.targetFidelity * 60 * boost +
        input.campaignCoverage * 25 +
        (efficient ? 8 : 0) -
        input.blindOptimism * (efficient ? 4 : 16) -
        (input.molBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const targetOptScore = round2(
    clamp(
      input.sampleEfficiency * 58 * boost * wFirst +
        input.campaignCoverage * 28 +
        (efficient ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.targetFit * 50 * boost * wE +
        input.targetFidelity * 25 +
        input.campaignCoverage * 15 +
        (efficient ? 8 : 0) -
        (input.molBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.naiveYield * 55 * boost +
        input.blindOptimism * 20 -
        input.designHardness * 18 -
        (efficient ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.campaignCoverage * 40 +
        input.targetFidelity * 30 +
        input.targetFit * 25 -
        input.blindOptimism * 15,
      0,
      100,
    ),
  );
  const efficiencyContribution = round2(
    clamp(
      hitEnrichment * 0.26 +
        efficiencyDiagnosis * 0.24 +
        targetOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.naiveYield * 20 +
        input.blindOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      efficiencyContribution * (efficient ? 0.82 : 0.4) +
        baselineContribution * (efficient ? 0.18 : 0.6) +
        (efficient ? 4 : 0) -
        (input.molBias === "baseline_first" && efficient ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "sample_efficient",
    hitEnrichment,
    efficiencyDiagnosis,
    targetOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    efficiencyContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Naive generative baseline (path B):
 * rewards naive yield + blind optimism, weak on sample-efficiency honesty.
 */
export function scoreNaiveGenerativeBaseline(input: MolInput): MolQuality {
  const baseline = input.profile === "naive_generative_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.molBias, "baseline_first");
  const load = designLoad(input.designHardness, input.campaignCoverage);

  const hitEnrichment = round2(
    clamp(
      input.naiveYield * 35 * boost +
        wB * 10 -
        input.designHardness * 22 -
        input.leakageRisk * 12 -
        (input.molBias === "efficiency_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const efficiencyDiagnosis = round2(
    clamp(
      input.blindOptimism * 40 * boost +
        input.naiveYield * 25 -
        load * 15 -
        input.campaignCoverage * 8,
      0,
      100,
    ),
  );
  const targetOptScore = round2(
    clamp(
      input.blindOptimism * 38 * boost +
        input.naiveYield * 20 -
        input.targetFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.naiveYield * 42 * boost +
        input.blindOptimism * 28 -
        input.campaignCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.naiveYield * 58 * boost * wB +
        input.blindOptimism * 32 -
        input.designHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.blindOptimism * 45 +
        input.naiveYield * 35 -
        input.designHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const efficiencyContribution = round2(
    clamp(
      hitEnrichment * 0.2 +
        efficiencyDiagnosis * 0.2 +
        targetOptScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.blindOptimism * 30 +
        input.naiveYield * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        efficiencyContribution * (baseline ? 0.22 : 0.5) -
        input.designHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_generative_baseline",
    hitEnrichment,
    efficiencyDiagnosis,
    targetOptScore,
    packIntegrity,
    baselineScore,
    confidence,
    efficiencyContribution,
    baselineContribution,
    overall,
  };
}
