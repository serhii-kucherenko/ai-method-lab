import {
  type DiscoverInput,
  type DiscoverQuality,
  biasWeight,
  clamp,
  chemistryLoad,
  round2,
} from "./types";

/**
 * Multimodal ChemICL scorer (good path A):
 * rewards multimodal coverage, modality fidelity, exemplar alignment,
 * and ICL precision for chemistry discovery soft-sim.
 */
export function scoreMultimodalChemicl(input: DiscoverInput): DiscoverQuality {
  const only = input.profile === "multimodal_chemicl";
  const boost = only ? 1.12 : 0.96;
  const wM = biasWeight(input.discoverBias, "multimodal_first");
  const wE = biasWeight(input.discoverBias, "exemplar_first");
  const wT = biasWeight(input.discoverBias, "text_first");
  const avgBias = (wM + wE + wT) / 3;
  const load = chemistryLoad(input.chemistryHardness, input.iclPrecision);

  const coverageScore = round2(
    clamp(
      (input.multimodalCoverage * 55 +
        input.modalityFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.discoverBias === "text_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const modalityScore = round2(
    clamp(
      input.modalityFidelity * 60 * boost +
        input.multimodalCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.discoverBias === "text_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const exemplarScore = round2(
    clamp(
      input.exemplarAlignment * 58 * boost * wE +
        input.multimodalCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const precisionIntegrity = round2(
    clamp(
      input.iclPrecision * 50 * boost * wM +
        input.modalityFidelity * 25 +
        input.multimodalCoverage * 15 +
        (only ? 8 : 0) -
        (input.discoverBias === "text_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.textOnlyBreadth * 55 * boost +
        input.baselineOptimism * 20 -
        input.chemistryHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.multimodalCoverage * 40 +
        input.modalityFidelity * 30 +
        input.iclPrecision * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const multimodalContribution = round2(
    clamp(
      coverageScore * 0.26 +
        modalityScore * 0.24 +
        exemplarScore * 0.28 +
        precisionIntegrity * 0.22,
      0,
      100,
    ),
  );
  const textContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.textOnlyBreadth * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      multimodalContribution * (only ? 0.82 : 0.4) +
        textContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.discoverBias === "text_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multimodal_chemicl",
    coverageScore,
    modalityScore,
    exemplarScore,
    precisionIntegrity,
    baselineScore,
    confidence,
    multimodalContribution,
    textContribution,
    overall,
  };
}

/**
 * Text-only ICL baseline (path B):
 * rewards wide text-only prompts + baseline optimism,
 * weak on multimodal chemistry honesty.
 */
export function scoreTextOnlyIclBaseline(
  input: DiscoverInput,
): DiscoverQuality {
  const baseline = input.profile === "text_only_icl_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wT = biasWeight(input.discoverBias, "text_first");
  const load = chemistryLoad(input.chemistryHardness, input.iclPrecision);

  const coverageScore = round2(
    clamp(
      input.textOnlyBreadth * 35 * boost +
        wT * 10 -
        input.chemistryHardness * 22 -
        input.overclaimRisk * 12 -
        (input.discoverBias === "multimodal_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const modalityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.textOnlyBreadth * 25 -
        load * 15 -
        input.multimodalCoverage * 8,
      0,
      100,
    ),
  );
  const exemplarScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.textOnlyBreadth * 20 -
        input.iclPrecision * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const precisionIntegrity = round2(
    clamp(
      input.textOnlyBreadth * 42 * boost +
        input.baselineOptimism * 28 -
        input.multimodalCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.textOnlyBreadth * 58 * boost * wT +
        input.baselineOptimism * 32 -
        input.chemistryHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.textOnlyBreadth * 35 -
        input.chemistryHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const multimodalContribution = round2(
    clamp(
      coverageScore * 0.2 +
        modalityScore * 0.2 +
        exemplarScore * 0.2 +
        precisionIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const textContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.textOnlyBreadth * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      textContribution * (baseline ? 0.78 : 0.5) +
        multimodalContribution * (baseline ? 0.22 : 0.5) -
        input.chemistryHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "text_only_icl_baseline",
    coverageScore,
    modalityScore,
    exemplarScore,
    precisionIntegrity,
    baselineScore,
    confidence,
    multimodalContribution,
    textContribution,
    overall,
  };
}
