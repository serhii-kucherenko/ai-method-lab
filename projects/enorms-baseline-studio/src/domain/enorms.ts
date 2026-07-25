import {
  type EnormsInput,
  type EnormsQuality,
  biasWeight,
  clamp,
  seizureLoad,
  round2,
} from "./types";

/**
 * Patient-specific E-norms scorer (good path A):
 * rewards patient norm fit, channel coverage, E-norms stability,
 * and detection sensitivity for pediatric seizure soft-sim.
 */
export function scorePatientSpecificEnorms(input: EnormsInput): EnormsQuality {
  const only = input.profile === "patient_specific_enorms";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.enormsBias, "patient_first");
  const wC = biasWeight(input.enormsBias, "coverage_first");
  const wPop = biasWeight(input.enormsBias, "population_first");
  const avgBias = (wP + wC + wPop) / 3;
  const load = seizureLoad(input.seizureHardness, input.patientNormFit);

  const patientFitScore = round2(
    clamp(
      (input.patientNormFit * 55 +
        input.channelCoverage * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.enormsBias === "population_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.channelCoverage * 60 * boost +
        input.patientNormFit * 25 +
        (only ? 8 : 0) -
        input.populationOptimism * (only ? 4 : 16) -
        (input.enormsBias === "population_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const stabilityScore = round2(
    clamp(
      input.enormsStability * 58 * boost * wP +
        input.patientNormFit * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const detectionIntegrity = round2(
    clamp(
      input.detectionSensitivity * 50 * boost * wC +
        input.channelCoverage * 25 +
        input.patientNormFit * 15 +
        (only ? 8 : 0) -
        (input.enormsBias === "population_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const populationBaselineScore = round2(
    clamp(
      input.populationMatchRate * 55 * boost +
        input.populationOptimism * 20 -
        input.seizureHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.patientNormFit * 40 +
        input.channelCoverage * 30 +
        input.enormsStability * 25 -
        input.populationOptimism * 15,
      0,
      100,
    ),
  );
  const patientContribution = round2(
    clamp(
      patientFitScore * 0.26 +
        coverageScore * 0.24 +
        stabilityScore * 0.28 +
        detectionIntegrity * 0.22,
      0,
      100,
    ),
  );
  const populationContribution = round2(
    clamp(
      populationBaselineScore * 0.7 +
        input.populationMatchRate * 20 +
        input.populationOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      patientContribution * (only ? 0.82 : 0.4) +
        populationContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.enormsBias === "population_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "patient_specific_enorms",
    patientFitScore,
    coverageScore,
    stabilityScore,
    detectionIntegrity,
    populationBaselineScore,
    confidence,
    patientContribution,
    populationContribution,
    overall,
  };
}

/**
 * Population-norm baseline (path B):
 * rewards population match rate + optimism,
 * weak on patient-specific E-norms honesty.
 */
export function scorePopulationNormBaseline(
  input: EnormsInput,
): EnormsQuality {
  const baseline = input.profile === "population_norm_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wPop = biasWeight(input.enormsBias, "population_first");
  const load = seizureLoad(input.seizureHardness, input.patientNormFit);

  const patientFitScore = round2(
    clamp(
      input.populationMatchRate * 35 * boost +
        wPop * 10 -
        input.seizureHardness * 22 -
        input.overclaimRisk * 12 -
        (input.enormsBias === "patient_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.populationOptimism * 40 * boost +
        input.populationMatchRate * 25 -
        load * 15 -
        input.patientNormFit * 8,
      0,
      100,
    ),
  );
  const stabilityScore = round2(
    clamp(
      input.populationOptimism * 38 * boost +
        input.populationMatchRate * 20 -
        input.enormsStability * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const detectionIntegrity = round2(
    clamp(
      input.populationMatchRate * 42 * boost +
        input.populationOptimism * 28 -
        input.patientNormFit * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const populationBaselineScore = round2(
    clamp(
      input.populationMatchRate * 58 * boost * wPop +
        input.populationOptimism * 32 -
        input.seizureHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.populationOptimism * 45 +
        input.populationMatchRate * 35 -
        input.seizureHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const patientContribution = round2(
    clamp(
      patientFitScore * 0.2 +
        coverageScore * 0.2 +
        stabilityScore * 0.2 +
        detectionIntegrity * 0.2 +
        populationBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const populationContribution = round2(
    clamp(
      populationBaselineScore * 0.55 +
        input.populationOptimism * 30 +
        input.populationMatchRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      populationContribution * (baseline ? 0.78 : 0.5) +
        patientContribution * (baseline ? 0.22 : 0.5) -
        input.seizureHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "population_norm_baseline",
    patientFitScore,
    coverageScore,
    stabilityScore,
    detectionIntegrity,
    populationBaselineScore,
    confidence,
    patientContribution,
    populationContribution,
    overall,
  };
}
