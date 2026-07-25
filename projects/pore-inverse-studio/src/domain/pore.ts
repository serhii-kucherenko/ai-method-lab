import {
  type PoreInput,
  type PoreQuality,
  biasWeight,
  clamp,
  poreLoad,
  round2,
} from "./types";

/**
 * Unified inverse design scorer (good path A):
 * rewards inverse coverage, pore fidelity, target clarity, designer stability.
 */
export function scoreUnifiedInverse(input: PoreInput): PoreQuality {
  const only = input.profile === "unified_inverse";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.poreBias, "pore_first");
  const wT = biasWeight(input.poreBias, "target_first");
  const wG = biasWeight(input.poreBias, "generative_first");
  const avgBias = (wP + wT + wG) / 3;
  const load = poreLoad(input.poreHardness, input.inverseCoverage);

  const inverseScore = round2(
    clamp(
      (input.inverseCoverage * 55 +
        input.poreFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.poreBias === "generative_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const poreScore = round2(
    clamp(
      input.poreFidelity * 60 * boost +
        input.inverseCoverage * 25 +
        (only ? 8 : 0) -
        input.generativeOptimism * (only ? 4 : 16) -
        (input.poreBias === "generative_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const targetScore = round2(
    clamp(
      input.targetClarity * 58 * boost * wT +
        input.inverseCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const designerScore = round2(
    clamp(
      input.designerStability * 50 * boost * wP +
        input.poreFidelity * 25 +
        input.inverseCoverage * 15 +
        (only ? 8 : 0) -
        (input.poreBias === "generative_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const generativeScore = round2(
    clamp(
      input.generativePassRate * 55 * boost +
        input.generativeOptimism * 20 -
        input.poreHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.inverseCoverage * 40 +
        input.poreFidelity * 30 +
        input.targetClarity * 25 -
        input.generativeOptimism * 15,
      0,
      100,
    ),
  );
  const unifiedInverseContribution = round2(
    clamp(
      inverseScore * 0.26 +
        poreScore * 0.24 +
        targetScore * 0.28 +
        designerScore * 0.22,
      0,
      100,
    ),
  );
  const naiveGenerativeContribution = round2(
    clamp(
      generativeScore * 0.7 +
        input.generativePassRate * 20 +
        input.generativeOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      unifiedInverseContribution * (only ? 0.82 : 0.4) +
        naiveGenerativeContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.poreBias === "generative_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "unified_inverse",
    inverseScore,
    poreScore,
    targetScore,
    designerScore,
    generativeScore,
    confidence,
    unifiedInverseContribution,
    naiveGenerativeContribution,
    overall,
  };
}

/**
 * Naive generative baseline (path B):
 * rewards generative pass rate + optimism, weak on unified inverse honesty.
 */
export function scoreNaiveGenerative(input: PoreInput): PoreQuality {
  const gen = input.profile === "naive_generative";
  const boost = gen ? 1.08 : 0.92;
  const wG = biasWeight(input.poreBias, "generative_first");
  const load = poreLoad(input.poreHardness, input.inverseCoverage);

  const inverseScore = round2(
    clamp(
      input.generativePassRate * 35 * boost +
        wG * 10 -
        input.poreHardness * 22 -
        input.overclaimRisk * 12 -
        (input.poreBias === "pore_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const poreScore = round2(
    clamp(
      input.generativeOptimism * 40 * boost +
        input.generativePassRate * 25 -
        load * 15 -
        input.inverseCoverage * 8,
      0,
      100,
    ),
  );
  const targetScore = round2(
    clamp(
      input.generativeOptimism * 38 * boost +
        input.generativePassRate * 20 -
        input.targetClarity * (gen ? 5 : 0) -
        load * 18 -
        (gen ? 0 : 6),
      0,
      100,
    ),
  );
  const designerScore = round2(
    clamp(
      input.generativePassRate * 42 * boost +
        input.generativeOptimism * 28 -
        input.inverseCoverage * 10 +
        (gen ? 5 : 0),
      0,
      100,
    ),
  );
  const generativeScore = round2(
    clamp(
      input.generativePassRate * 58 * boost * wG +
        input.generativeOptimism * 32 -
        input.poreHardness * 10 +
        (gen ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.generativeOptimism * 45 +
        input.generativePassRate * 35 -
        input.poreHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const unifiedInverseContribution = round2(
    clamp(
      inverseScore * 0.2 +
        poreScore * 0.2 +
        targetScore * 0.2 +
        designerScore * 0.2 +
        generativeScore * 0.2,
      0,
      100,
    ),
  );
  const naiveGenerativeContribution = round2(
    clamp(
      generativeScore * 0.55 +
        input.generativeOptimism * 30 +
        input.generativePassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      naiveGenerativeContribution * (gen ? 0.78 : 0.5) +
        unifiedInverseContribution * (gen ? 0.22 : 0.5) -
        input.poreHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_generative",
    inverseScore,
    poreScore,
    targetScore,
    designerScore,
    generativeScore,
    confidence,
    unifiedInverseContribution,
    naiveGenerativeContribution,
    overall,
  };
}
