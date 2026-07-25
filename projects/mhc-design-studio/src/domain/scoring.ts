import {
  type MhcDesignInput,
  type MhcDesignQuality,
  biasWeight,
  clamp,
  designLoad,
  round2,
} from "./types";

/**
 * Hybrid quantum–classical de novo MHC peptide design scorer (path A):
 * rewards peptide coverage, allele fidelity, hybrid clarity,
 * and pack completeness without classical-generative theater.
 */
export function scoreHybridQuantumClassicalDeNovo(
  input: MhcDesignInput,
): MhcDesignQuality {
  const only = input.profile === "hybrid_quantum_classical_de_novo";
  const boost = only ? 1.12 : 0.96;
  const wH = biasWeight(input.designBias, "hybrid_first");
  const wA = biasWeight(input.designBias, "allele_first");
  const wC = biasWeight(input.designBias, "classical_first");
  const avgBias = (wH + wA + (2 - wC)) / 3;
  const load = designLoad(input.designHardness, input.hybridClarity);

  const peptideScore = round2(
    clamp(
      (input.peptideCoverage * 55 +
        input.hybridClarity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.designBias === "classical_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const alleleScore = round2(
    clamp(
      input.alleleFidelity * 60 * boost +
        input.peptideCoverage * 25 +
        (only ? 8 : 0) -
        input.generativeOptimism * (only ? 4 : 16) -
        (input.designBias === "classical_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const hybridScore = round2(
    clamp(
      input.hybridClarity * 58 * boost * wH +
        input.peptideCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wA +
        input.alleleFidelity * 25 +
        input.peptideCoverage * 15 +
        (only ? 8 : 0) -
        (input.designBias === "classical_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const classicalScore = round2(
    clamp(
      input.classicalAdherence * 55 * boost +
        input.generativeOptimism * 20 -
        input.designHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.peptideCoverage * 40 +
        input.alleleFidelity * 30 +
        input.packCompleteness * 25 -
        input.generativeOptimism * 15,
      0,
      100,
    ),
  );
  const hybridContribution = round2(
    clamp(
      peptideScore * 0.26 +
        alleleScore * 0.24 +
        hybridScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const classicalContribution = round2(
    clamp(
      classicalScore * 0.7 +
        input.classicalAdherence * 20 +
        input.generativeOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      hybridContribution * (only ? 0.82 : 0.4) +
        classicalContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.designBias === "classical_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "hybrid_quantum_classical_de_novo",
    peptideScore,
    alleleScore,
    hybridScore,
    completenessScore,
    classicalScore,
    confidence,
    hybridContribution,
    classicalContribution,
    overall,
  };
}

/**
 * Classical generative baseline (path B):
 * rewards classical adherence + generative optimism,
 * weak on hybrid quantum–classical prior honesty.
 */
export function scoreClassicalGenerativeBaseline(
  input: MhcDesignInput,
): MhcDesignQuality {
  const baseline = input.profile === "classical_generative_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.designBias, "classical_first");
  const load = designLoad(input.designHardness, input.hybridClarity);

  const peptideScore = round2(
    clamp(
      input.classicalAdherence * 35 * boost +
        wC * 10 -
        input.designHardness * 22 -
        input.overclaimRisk * 12 -
        (input.designBias === "hybrid_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const alleleScore = round2(
    clamp(
      input.generativeOptimism * 40 * boost +
        input.classicalAdherence * 25 -
        load * 15 -
        input.peptideCoverage * 8,
      0,
      100,
    ),
  );
  const hybridScore = round2(
    clamp(
      input.generativeOptimism * 38 * boost +
        input.classicalAdherence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.classicalAdherence * 42 * boost +
        input.generativeOptimism * 28 -
        input.peptideCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const classicalScore = round2(
    clamp(
      input.classicalAdherence * 58 * boost * wC +
        input.generativeOptimism * 32 -
        input.designHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.generativeOptimism * 45 +
        input.classicalAdherence * 35 -
        input.designHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const hybridContribution = round2(
    clamp(
      peptideScore * 0.2 +
        alleleScore * 0.2 +
        hybridScore * 0.2 +
        completenessScore * 0.2 +
        classicalScore * 0.2,
      0,
      100,
    ),
  );
  const classicalContribution = round2(
    clamp(
      classicalScore * 0.55 +
        input.generativeOptimism * 30 +
        input.classicalAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      classicalContribution * (baseline ? 0.78 : 0.5) +
        hybridContribution * (baseline ? 0.22 : 0.5) -
        input.designHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "classical_generative_baseline",
    peptideScore,
    alleleScore,
    hybridScore,
    completenessScore,
    classicalScore,
    confidence,
    hybridContribution,
    classicalContribution,
    overall,
  };
}
