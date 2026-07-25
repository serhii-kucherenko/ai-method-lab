import {
  type SynthInput,
  type SynthQuality,
  biasWeight,
  clamp,
  routeLoad,
  round2,
} from "./types";

/**
 * Confidence-gated AI retrosynthesis scorer (good path A):
 * rewards pack coverage, confidence fidelity, candidate clarity, run stability.
 */
export function scoreConfidenceGatedAiRetrosynthesis(
  input: SynthInput,
): SynthQuality {
  const only = input.profile === "confidence_gated_ai_retrosynthesis";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.routeBias, "confidence_first");
  const wR = biasWeight(input.routeBias, "route_first");
  const wN = biasWeight(input.routeBias, "naive_first");
  const avgBias = (wC + wR + wN) / 3;
  const load = routeLoad(input.routeHardness, input.packCoverage);

  const routeCoverage = round2(
    clamp(
      (input.packCoverage * 55 +
        input.confidenceFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.routeBias === "naive_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const confidenceScore = round2(
    clamp(
      input.confidenceFidelity * 60 * boost +
        input.packCoverage * 25 +
        (only ? 8 : 0) -
        input.skipOptimism * (only ? 4 : 16) -
        (input.routeBias === "naive_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const candidateOptScore = round2(
    clamp(
      input.candidateClarity * 58 * boost * wR +
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
      input.runStability * 50 * boost * wC +
        input.confidenceFidelity * 25 +
        input.packCoverage * 15 +
        (only ? 8 : 0) -
        (input.routeBias === "naive_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const naiveBaselineScore = round2(
    clamp(
      input.naiveBaselineRate * 55 * boost +
        input.skipOptimism * 20 -
        input.routeHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.packCoverage * 40 +
        input.confidenceFidelity * 30 +
        input.candidateClarity * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const gatedContribution = round2(
    clamp(
      routeCoverage * 0.26 +
        confidenceScore * 0.24 +
        candidateOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      naiveBaselineScore * 0.7 +
        input.naiveBaselineRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      gatedContribution * (only ? 0.82 : 0.4) +
        naiveContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.routeBias === "naive_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "confidence_gated_ai_retrosynthesis",
    routeCoverage,
    confidenceScore,
    candidateOptScore,
    packIntegrity,
    naiveBaselineScore,
    confidence,
    gatedContribution,
    naiveContribution,
    overall,
  };
}

/**
 * Naive AI route baseline (path B):
 * rewards flashy ungated route rate + skip optimism, weak on confidence honesty.
 */
export function scoreNaiveAiRouteBaseline(input: SynthInput): SynthQuality {
  const naive = input.profile === "naive_ai_route_baseline";
  const boost = naive ? 1.08 : 0.92;
  const wN = biasWeight(input.routeBias, "naive_first");
  const load = routeLoad(input.routeHardness, input.packCoverage);

  const routeCoverage = round2(
    clamp(
      input.naiveBaselineRate * 35 * boost +
        wN * 10 -
        input.routeHardness * 22 -
        input.overclaimRisk * 12 -
        (input.routeBias === "confidence_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const confidenceScore = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.naiveBaselineRate * 25 -
        load * 15 -
        input.packCoverage * 8,
      0,
      100,
    ),
  );
  const candidateOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.naiveBaselineRate * 20 -
        input.candidateClarity * (naive ? 5 : 0) -
        load * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.naiveBaselineRate * 42 * boost +
        input.skipOptimism * 28 -
        input.packCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const naiveBaselineScore = round2(
    clamp(
      input.naiveBaselineRate * 58 * boost * wN +
        input.skipOptimism * 32 -
        input.routeHardness * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.naiveBaselineRate * 35 -
        input.routeHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const gatedContribution = round2(
    clamp(
      routeCoverage * 0.2 +
        confidenceScore * 0.2 +
        candidateOptScore * 0.2 +
        packIntegrity * 0.2 +
        naiveBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      naiveBaselineScore * 0.55 +
        input.skipOptimism * 30 +
        input.naiveBaselineRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      naiveContribution * (naive ? 0.78 : 0.5) +
        gatedContribution * (naive ? 0.22 : 0.5) -
        input.routeHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_ai_route_baseline",
    routeCoverage,
    confidenceScore,
    candidateOptScore,
    packIntegrity,
    naiveBaselineScore,
    confidence,
    gatedContribution,
    naiveContribution,
    overall,
  };
}
