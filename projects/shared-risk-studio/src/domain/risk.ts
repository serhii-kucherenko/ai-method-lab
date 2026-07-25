import {
  type RiskInput,
  type RiskQuality,
  biasWeight,
  clamp,
  diseaseLoad,
  round2,
} from "./types";

/**
 * Shared multi-disease representation scorer (good path A):
 * rewards cohort coverage, modality fidelity, query clarity, run stability.
 */
export function scoreSharedMultiDisease(input: RiskInput): RiskQuality {
  const only = input.profile === "shared_multi_disease";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.queryBias, "shared_first");
  const wM = biasWeight(input.queryBias, "modality_first");
  const wD = biasWeight(input.queryBias, "disease_first");
  const avgBias = (wS + wM + wD) / 3;
  const load = diseaseLoad(input.diseaseHardness, input.cohortCoverage);

  const sharedCoverage = round2(
    clamp(
      (input.cohortCoverage * 55 +
        input.modalityFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.queryBias === "disease_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const modalityScore = round2(
    clamp(
      input.modalityFidelity * 60 * boost +
        input.cohortCoverage * 25 +
        (only ? 8 : 0) -
        input.skipOptimism * (only ? 4 : 16) -
        (input.queryBias === "disease_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const queryOptScore = round2(
    clamp(
      input.queryClarity * 58 * boost * wM +
        input.cohortCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.runStability * 50 * boost * wS +
        input.modalityFidelity * 25 +
        input.cohortCoverage * 15 +
        (only ? 8 : 0) -
        (input.queryBias === "disease_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const diseaseBaselineScore = round2(
    clamp(
      input.diseaseBaselineRate * 55 * boost +
        input.skipOptimism * 20 -
        input.diseaseHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cohortCoverage * 40 +
        input.modalityFidelity * 30 +
        input.queryClarity * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const sharedContribution = round2(
    clamp(
      sharedCoverage * 0.26 +
        modalityScore * 0.24 +
        queryOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const diseaseContribution = round2(
    clamp(
      diseaseBaselineScore * 0.7 +
        input.diseaseBaselineRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      sharedContribution * (only ? 0.82 : 0.4) +
        diseaseContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.queryBias === "disease_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "shared_multi_disease",
    sharedCoverage,
    modalityScore,
    queryOptScore,
    packIntegrity,
    diseaseBaselineScore,
    confidence,
    sharedContribution,
    diseaseContribution,
    overall,
  };
}

/**
 * Disease-specific baseline (path B):
 * rewards disease-specific pass rate + skip optimism, weak on shared honesty.
 */
export function scoreDiseaseSpecific(input: RiskInput): RiskQuality {
  const disease = input.profile === "disease_specific_baseline";
  const boost = disease ? 1.08 : 0.92;
  const wD = biasWeight(input.queryBias, "disease_first");
  const load = diseaseLoad(input.diseaseHardness, input.cohortCoverage);

  const sharedCoverage = round2(
    clamp(
      input.diseaseBaselineRate * 35 * boost +
        wD * 10 -
        input.diseaseHardness * 22 -
        input.overclaimRisk * 12 -
        (input.queryBias === "shared_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const modalityScore = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.diseaseBaselineRate * 25 -
        load * 15 -
        input.cohortCoverage * 8,
      0,
      100,
    ),
  );
  const queryOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.diseaseBaselineRate * 20 -
        input.queryClarity * (disease ? 5 : 0) -
        load * 18 -
        (disease ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.diseaseBaselineRate * 42 * boost +
        input.skipOptimism * 28 -
        input.cohortCoverage * 10 +
        (disease ? 5 : 0),
      0,
      100,
    ),
  );
  const diseaseBaselineScore = round2(
    clamp(
      input.diseaseBaselineRate * 58 * boost * wD +
        input.skipOptimism * 32 -
        input.diseaseHardness * 10 +
        (disease ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.diseaseBaselineRate * 35 -
        input.diseaseHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const sharedContribution = round2(
    clamp(
      sharedCoverage * 0.2 +
        modalityScore * 0.2 +
        queryOptScore * 0.2 +
        packIntegrity * 0.2 +
        diseaseBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const diseaseContribution = round2(
    clamp(
      diseaseBaselineScore * 0.55 +
        input.skipOptimism * 30 +
        input.diseaseBaselineRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      diseaseContribution * (disease ? 0.78 : 0.5) +
        sharedContribution * (disease ? 0.22 : 0.5) -
        input.diseaseHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "disease_specific_baseline",
    sharedCoverage,
    modalityScore,
    queryOptScore,
    packIntegrity,
    diseaseBaselineScore,
    confidence,
    sharedContribution,
    diseaseContribution,
    overall,
  };
}
