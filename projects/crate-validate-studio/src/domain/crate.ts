import {
  type CrateInput,
  type CrateQuality,
  biasWeight,
  clamp,
  payloadLoad,
  round2,
} from "./types";

/**
 * Structural + semantic ARC RO-Crate scorer (good path A):
 * rewards crate coverage, structural fidelity, semantic clarity, check stability.
 */
export function scoreArcStructuralSemantic(input: CrateInput): CrateQuality {
  const only = input.profile === "arc_structural_semantic_validation";
  const boost = only ? 1.12 : 0.96;
  const wM = biasWeight(input.crateBias, "structure_first");
  const wS = biasWeight(input.crateBias, "semantic_first");
  const wB = biasWeight(input.crateBias, "metadata_first");
  const avgBias = (wM + wS + wB) / 3;
  const load = payloadLoad(input.payloadHardness, input.crateCoverage);

  const crateCoverageScore = round2(
    clamp(
      (input.crateCoverage * 55 +
        input.structuralFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.crateBias === "metadata_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const structuralScore = round2(
    clamp(
      input.structuralFidelity * 60 * boost +
        input.crateCoverage * 25 +
        (only ? 8 : 0) -
        input.metadataOptimism * (only ? 4 : 16) -
        (input.crateBias === "metadata_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const semanticScore = round2(
    clamp(
      input.semanticClarity * 58 * boost * wS +
        input.crateCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const payloadIntegrity = round2(
    clamp(
      input.checkStability * 50 * boost * wM +
        input.structuralFidelity * 25 +
        input.crateCoverage * 15 +
        (only ? 8 : 0) -
        (input.crateBias === "metadata_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const metadataBaselineScore = round2(
    clamp(
      input.metadataOnlyRate * 55 * boost +
        input.metadataOptimism * 20 -
        input.payloadHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.crateCoverage * 40 +
        input.structuralFidelity * 30 +
        input.semanticClarity * 25 -
        input.metadataOptimism * 15,
      0,
      100,
    ),
  );
  const structuralSemanticContribution = round2(
    clamp(
      crateCoverageScore * 0.26 +
        structuralScore * 0.24 +
        semanticScore * 0.28 +
        payloadIntegrity * 0.22,
      0,
      100,
    ),
  );
  const metadataContribution = round2(
    clamp(
      metadataBaselineScore * 0.7 +
        input.metadataOnlyRate * 20 +
        input.metadataOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structuralSemanticContribution * (only ? 0.82 : 0.4) +
        metadataContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.crateBias === "metadata_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "arc_structural_semantic_validation",
    crateCoverageScore,
    structuralScore,
    semanticScore,
    payloadIntegrity,
    metadataBaselineScore,
    confidence,
    structuralSemanticContribution,
    metadataContribution,
    overall,
  };
}

/**
 * Metadata-only baseline (path B):
 * rewards ungated metadata pass-rate + metadata optimism, weak on payload honesty.
 */
export function scoreMetadataOnlyBaseline(input: CrateInput): CrateQuality {
  const baseline = input.profile === "metadata_only_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.crateBias, "metadata_first");
  const load = payloadLoad(input.payloadHardness, input.crateCoverage);

  const crateCoverageScore = round2(
    clamp(
      input.metadataOnlyRate * 35 * boost +
        wB * 10 -
        input.payloadHardness * 22 -
        input.overclaimRisk * 12 -
        (input.crateBias === "structure_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const structuralScore = round2(
    clamp(
      input.metadataOptimism * 40 * boost +
        input.metadataOnlyRate * 25 -
        load * 15 -
        input.crateCoverage * 8,
      0,
      100,
    ),
  );
  const semanticScore = round2(
    clamp(
      input.metadataOptimism * 38 * boost +
        input.metadataOnlyRate * 20 -
        input.semanticClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const payloadIntegrity = round2(
    clamp(
      input.metadataOnlyRate * 42 * boost +
        input.metadataOptimism * 28 -
        input.crateCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const metadataBaselineScore = round2(
    clamp(
      input.metadataOnlyRate * 58 * boost * wB +
        input.metadataOptimism * 32 -
        input.payloadHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.metadataOptimism * 45 +
        input.metadataOnlyRate * 35 -
        input.payloadHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const structuralSemanticContribution = round2(
    clamp(
      crateCoverageScore * 0.2 +
        structuralScore * 0.2 +
        semanticScore * 0.2 +
        payloadIntegrity * 0.2 +
        metadataBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const metadataContribution = round2(
    clamp(
      metadataBaselineScore * 0.55 +
        input.metadataOptimism * 30 +
        input.metadataOnlyRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      metadataContribution * (baseline ? 0.78 : 0.5) +
        structuralSemanticContribution * (baseline ? 0.22 : 0.5) -
        input.payloadHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "metadata_only_baseline",
    crateCoverageScore,
    structuralScore,
    semanticScore,
    payloadIntegrity,
    metadataBaselineScore,
    confidence,
    structuralSemanticContribution,
    metadataContribution,
    overall,
  };
}
