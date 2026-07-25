import {
  type QuantInput,
  type QuantQuality,
  biasWeight,
  clamp,
  abundanceLoad,
  round2,
} from "./types";

/**
 * Informed DIA quant scorer (good path A):
 * rewards target coverage, spectrum informedness, protein detectability,
 * and precision integrity for single-cell regulatory soft-sim.
 */
export function scoreInformedDiaQuant(input: QuantInput): QuantQuality {
  const only = input.profile === "informed_dia_quant";
  const boost = only ? 1.12 : 0.96;
  const wI = biasWeight(input.quantBias, "informed_first");
  const wT = biasWeight(input.quantBias, "target_first");
  const wB = biasWeight(input.quantBias, "baseline_first");
  const avgBias = (wI + wT + wB) / 3;
  const load = abundanceLoad(input.abundanceHardness, input.quantPrecision);

  const coverageScore = round2(
    clamp(
      (input.targetCoverage * 55 +
        input.spectrumInformedness * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.quantBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const spectrumScore = round2(
    clamp(
      input.spectrumInformedness * 60 * boost +
        input.targetCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.quantBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const detectabilityScore = round2(
    clamp(
      input.proteinDetectability * 58 * boost * wT +
        input.targetCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const precisionIntegrity = round2(
    clamp(
      input.quantPrecision * 50 * boost * wI +
        input.spectrumInformedness * 25 +
        input.targetCoverage * 15 +
        (only ? 8 : 0) -
        (input.quantBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.naiveWindowBreadth * 55 * boost +
        input.baselineOptimism * 20 -
        input.abundanceHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.targetCoverage * 40 +
        input.spectrumInformedness * 30 +
        input.quantPrecision * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const informedContribution = round2(
    clamp(
      coverageScore * 0.26 +
        spectrumScore * 0.24 +
        detectabilityScore * 0.28 +
        precisionIntegrity * 0.22,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.naiveWindowBreadth * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      informedContribution * (only ? 0.82 : 0.4) +
        naiveContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.quantBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "informed_dia_quant",
    coverageScore,
    spectrumScore,
    detectabilityScore,
    precisionIntegrity,
    baselineScore,
    confidence,
    informedContribution,
    naiveContribution,
    overall,
  };
}

/**
 * Naive DIA baseline (path B):
 * rewards wide naive windows + baseline optimism,
 * weak on informed regulatory-protein honesty.
 */
export function scoreNaiveDiaBaseline(input: QuantInput): QuantQuality {
  const baseline = input.profile === "naive_dia_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.quantBias, "baseline_first");
  const load = abundanceLoad(input.abundanceHardness, input.quantPrecision);

  const coverageScore = round2(
    clamp(
      input.naiveWindowBreadth * 35 * boost +
        wB * 10 -
        input.abundanceHardness * 22 -
        input.overclaimRisk * 12 -
        (input.quantBias === "informed_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const spectrumScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.naiveWindowBreadth * 25 -
        load * 15 -
        input.targetCoverage * 8,
      0,
      100,
    ),
  );
  const detectabilityScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.naiveWindowBreadth * 20 -
        input.quantPrecision * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const precisionIntegrity = round2(
    clamp(
      input.naiveWindowBreadth * 42 * boost +
        input.baselineOptimism * 28 -
        input.targetCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.naiveWindowBreadth * 58 * boost * wB +
        input.baselineOptimism * 32 -
        input.abundanceHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.naiveWindowBreadth * 35 -
        input.abundanceHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const informedContribution = round2(
    clamp(
      coverageScore * 0.2 +
        spectrumScore * 0.2 +
        detectabilityScore * 0.2 +
        precisionIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.naiveWindowBreadth * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      naiveContribution * (baseline ? 0.78 : 0.5) +
        informedContribution * (baseline ? 0.22 : 0.5) -
        input.abundanceHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_dia_baseline",
    coverageScore,
    spectrumScore,
    detectabilityScore,
    precisionIntegrity,
    baselineScore,
    confidence,
    informedContribution,
    naiveContribution,
    overall,
  };
}
