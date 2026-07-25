import {
  type AtlasInput,
  type AtlasQuality,
  biasWeight,
  clamp,
  round2,
  workflowLoad,
} from "./types";

/**
 * Integrated atlas registration + quantification scorer (good path A):
 * rewards registration fidelity, region coverage, atlas alignment,
 * and quantification stability for soft-sim.
 */
export function scoreIntegratedAtlasWorkflow(input: AtlasInput): AtlasQuality {
  const only = input.profile === "integrated_atlas_workflow";
  const boost = only ? 1.12 : 0.96;
  const wA = biasWeight(input.registrationBias, "atlas_first");
  const wR = biasWeight(input.registrationBias, "region_first");
  const wF = biasWeight(input.registrationBias, "fragment_first");
  const avgBias = (wA + wR + wF) / 3;
  const load = workflowLoad(input.workflowHardness, input.atlasAlignment);

  const registrationScore = round2(
    clamp(
      (input.registrationFidelity * 55 +
        input.regionCoverage * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.registrationBias === "fragment_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.regionCoverage * 60 * boost +
        input.registrationFidelity * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.registrationBias === "fragment_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const alignmentScore = round2(
    clamp(
      input.atlasAlignment * 58 * boost * wR +
        input.registrationFidelity * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const quantIntegrity = round2(
    clamp(
      input.quantStability * 50 * boost * wA +
        input.regionCoverage * 25 +
        input.registrationFidelity * 15 +
        (only ? 8 : 0) -
        (input.registrationBias === "fragment_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const fragmentScore = round2(
    clamp(
      input.fragmentToolConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.workflowHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.registrationFidelity * 40 +
        input.regionCoverage * 30 +
        input.quantStability * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const integratedContribution = round2(
    clamp(
      registrationScore * 0.26 +
        coverageScore * 0.24 +
        alignmentScore * 0.28 +
        quantIntegrity * 0.22,
      0,
      100,
    ),
  );
  const fragmentContribution = round2(
    clamp(
      fragmentScore * 0.7 +
        input.fragmentToolConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      integratedContribution * (only ? 0.82 : 0.4) +
        fragmentContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.registrationBias === "fragment_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "integrated_atlas_workflow",
    registrationScore,
    coverageScore,
    alignmentScore,
    quantIntegrity,
    fragmentScore,
    confidence,
    integratedContribution,
    fragmentContribution,
    overall,
  };
}

/**
 * Fragmented multi-tool baseline (path B):
 * rewards fragment-tool confidence + baseline optimism,
 * weak on integrated atlas workflow honesty.
 */
export function scoreFragmentedMultiToolBaseline(
  input: AtlasInput,
): AtlasQuality {
  const baseline = input.profile === "fragmented_multi_tool_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wF = biasWeight(input.registrationBias, "fragment_first");
  const load = workflowLoad(input.workflowHardness, input.atlasAlignment);

  const registrationScore = round2(
    clamp(
      input.fragmentToolConfidence * 35 * boost +
        wF * 10 -
        input.workflowHardness * 22 -
        input.overclaimRisk * 12 -
        (input.registrationBias === "atlas_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.fragmentToolConfidence * 25 -
        load * 15 -
        input.registrationFidelity * 8,
      0,
      100,
    ),
  );
  const alignmentScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.fragmentToolConfidence * 20 -
        input.quantStability * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const quantIntegrity = round2(
    clamp(
      input.fragmentToolConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.registrationFidelity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const fragmentScore = round2(
    clamp(
      input.fragmentToolConfidence * 58 * boost * wF +
        input.baselineOptimism * 32 -
        input.workflowHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.fragmentToolConfidence * 35 -
        input.workflowHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const integratedContribution = round2(
    clamp(
      registrationScore * 0.2 +
        coverageScore * 0.2 +
        alignmentScore * 0.2 +
        quantIntegrity * 0.2 +
        fragmentScore * 0.2,
      0,
      100,
    ),
  );
  const fragmentContribution = round2(
    clamp(
      fragmentScore * 0.55 +
        input.baselineOptimism * 30 +
        input.fragmentToolConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      fragmentContribution * (baseline ? 0.78 : 0.5) +
        integratedContribution * (baseline ? 0.22 : 0.5) -
        input.workflowHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "fragmented_multi_tool_baseline",
    registrationScore,
    coverageScore,
    alignmentScore,
    quantIntegrity,
    fragmentScore,
    confidence,
    integratedContribution,
    fragmentContribution,
    overall,
  };
}
