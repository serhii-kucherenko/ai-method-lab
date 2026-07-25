import {
  type KineticsInput,
  type KineticsQuality,
  biasWeight,
  stiffnessLoad,
  clamp,
  round2,
} from "./types";

/**
 * Entropy-constrained kinetics surrogate scorer (good path A):
 * rewards rate coverage, entropy fidelity, and mechanism fit under stiffness.
 */
export function scoreEntropyConstrained(
  input: KineticsInput,
): KineticsQuality {
  const constrained = input.profile === "entropy_constrained";
  const boost = constrained ? 1.12 : 0.96;
  const wE = biasWeight(input.kineticsBias, "entropy_strict");
  const wS = biasWeight(input.kineticsBias, "surrogate_first");
  const wF = biasWeight(input.kineticsBias, "full_rate_first");
  const avgBias = (wE + wS + wF) / 3;
  const load = stiffnessLoad(input.stiffnessHardness, input.rateCoverage);

  const rateDiagnosis = round2(
    clamp(
      (input.rateCoverage * 55 + input.entropyFidelity * 25 - load * 10) *
        boost *
        avgBias +
        (constrained ? 8 : 0) -
        input.leakageRisk * (constrained ? 6 : 14) -
        (input.kineticsBias === "full_rate_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const entropyDiagnosis = round2(
    clamp(
      input.entropyFidelity * 60 * boost +
        input.rateCoverage * 25 +
        (constrained ? 8 : 0) -
        input.unconstrainedOptimism * (constrained ? 4 : 16) -
        (input.kineticsBias === "full_rate_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const mechanismReasonScore = round2(
    clamp(
      input.rateAgreement * 58 * boost * wS +
        input.rateCoverage * 28 +
        (constrained ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.mechanismFit * 50 * boost * wE +
        input.entropyFidelity * 25 +
        input.rateCoverage * 15 +
        (constrained ? 8 : 0) -
        (input.kineticsBias === "full_rate_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.fullRateAccuracy * 55 * boost +
        input.unconstrainedOptimism * 20 -
        input.stiffnessHardness * 18 -
        (constrained ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.rateCoverage * 40 +
        input.entropyFidelity * 30 +
        input.mechanismFit * 25 -
        input.unconstrainedOptimism * 15,
      0,
      100,
    ),
  );
  const surrogateContribution = round2(
    clamp(
      rateDiagnosis * 0.26 +
        entropyDiagnosis * 0.24 +
        mechanismReasonScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.fullRateAccuracy * 20 +
        input.unconstrainedOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      surrogateContribution * (constrained ? 0.82 : 0.4) +
        baselineContribution * (constrained ? 0.18 : 0.6) +
        (constrained ? 4 : 0) -
        (input.kineticsBias === "full_rate_first" && constrained ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "entropy_constrained",
    rateDiagnosis,
    entropyDiagnosis,
    mechanismReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    surrogateContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Full-rate / unconstrained baseline (path B):
 * rewards full-rate accuracy + unconstrained optimism, weak on entropy honesty.
 */
export function scoreFullRateBaseline(input: KineticsInput): KineticsQuality {
  const baseline = input.profile === "full_rate_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wF = biasWeight(input.kineticsBias, "full_rate_first");
  const load = stiffnessLoad(input.stiffnessHardness, input.rateCoverage);

  const rateDiagnosis = round2(
    clamp(
      input.fullRateAccuracy * 35 * boost +
        wF * 10 -
        input.stiffnessHardness * 22 -
        input.leakageRisk * 12 -
        (input.kineticsBias === "entropy_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const entropyDiagnosis = round2(
    clamp(
      input.unconstrainedOptimism * 40 * boost +
        input.fullRateAccuracy * 25 -
        load * 15 -
        input.rateCoverage * 8,
      0,
      100,
    ),
  );
  const mechanismReasonScore = round2(
    clamp(
      input.unconstrainedOptimism * 38 * boost +
        input.fullRateAccuracy * 20 -
        input.mechanismFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.fullRateAccuracy * 42 * boost +
        input.unconstrainedOptimism * 28 -
        input.rateCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.fullRateAccuracy * 58 * boost * wF +
        input.unconstrainedOptimism * 32 -
        input.stiffnessHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.unconstrainedOptimism * 45 +
        input.fullRateAccuracy * 35 -
        input.stiffnessHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const surrogateContribution = round2(
    clamp(
      rateDiagnosis * 0.2 +
        entropyDiagnosis * 0.2 +
        mechanismReasonScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.unconstrainedOptimism * 30 +
        input.fullRateAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        surrogateContribution * (baseline ? 0.22 : 0.5) -
        input.stiffnessHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "full_rate_baseline",
    rateDiagnosis,
    entropyDiagnosis,
    mechanismReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    surrogateContribution,
    baselineContribution,
    overall,
  };
}
