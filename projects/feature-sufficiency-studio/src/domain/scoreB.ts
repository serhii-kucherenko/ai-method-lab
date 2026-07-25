import {
  type FeatureSufficiencyInput,
  type FeatureSufficiencyQuality,
  biasWeight,
  clamp,
  missingnessLoad,
  round2,
} from "./types";

/**
 * Partial-observation sufficiency (good path A):
 * rewards mask coverage, feature salience, and cohort fit under missingness.
 */
export function scorePartialObservation(
  input: FeatureSufficiencyInput,
): FeatureSufficiencyQuality {
  const partial = input.profile === "partial_observation";
  const boost = partial ? 1.12 : 0.96;
  const wM = biasWeight(input.sufficiencyBias, "mask_strict");
  const wC = biasWeight(input.sufficiencyBias, "coverage_first");
  const wF = biasWeight(input.sufficiencyBias, "full_first");
  const avgBias = (wM + wC + wF) / 3;
  const load = missingnessLoad(input.missingnessPressure, input.maskCoverage);

  const coverageDiagnosis = round2(
    clamp(
      (input.maskCoverage * 55 +
        input.featureSalience * 25 -
        load * 10) *
        boost *
        avgBias +
        (partial ? 8 : 0) -
        input.leakageRisk * (partial ? 6 : 14) -
        (input.sufficiencyBias === "full_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const salienceDiagnosis = round2(
    clamp(
      input.featureSalience * 60 * boost +
        input.maskCoverage * 25 +
        (partial ? 8 : 0) -
        input.imputationOptimism * (partial ? 4 : 16) -
        (input.sufficiencyBias === "full_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const sufficiencyReasonScore = round2(
    clamp(
      input.labelAgreement * 58 * boost * wC +
        input.maskCoverage * 28 +
        (partial ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const cohortIntegrity = round2(
    clamp(
      input.cohortFit * 50 * boost * wM +
        input.featureSalience * 25 +
        input.maskCoverage * 15 +
        (partial ? 8 : 0) -
        (input.sufficiencyBias === "full_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const fullFeatureScore = round2(
    clamp(
      input.fullFeatureAccuracy * 55 * boost +
        input.imputationOptimism * 20 -
        input.missingnessPressure * 18 -
        (partial ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.maskCoverage * 40 +
        input.featureSalience * 30 +
        input.cohortFit * 25 -
        input.imputationOptimism * 15,
      0,
      100,
    ),
  );
  const partialContribution = round2(
    clamp(
      coverageDiagnosis * 0.26 +
        salienceDiagnosis * 0.24 +
        sufficiencyReasonScore * 0.28 +
        cohortIntegrity * 0.22,
      0,
      100,
    ),
  );
  const fullContribution = round2(
    clamp(
      fullFeatureScore * 0.7 +
        input.fullFeatureAccuracy * 20 +
        input.imputationOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      partialContribution * (partial ? 0.82 : 0.4) +
        fullContribution * (partial ? 0.18 : 0.6) +
        (partial ? 4 : 0) -
        (input.sufficiencyBias === "full_first" && partial ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "partial_observation",
    coverageDiagnosis,
    salienceDiagnosis,
    sufficiencyReasonScore,
    cohortIntegrity,
    fullFeatureScore,
    confidence,
    partialContribution,
    fullContribution,
    overall,
  };
}

/**
 * Full-feature baseline (path B):
 * rewards complete-feature accuracy + imputation optimism, weak on mask honesty.
 */
export function scoreFullFeatureBaseline(
  input: FeatureSufficiencyInput,
): FeatureSufficiencyQuality {
  const naive = input.profile === "full_feature";
  const boost = naive ? 1.08 : 0.92;
  const wF = biasWeight(input.sufficiencyBias, "full_first");
  const load = missingnessLoad(input.missingnessPressure, input.maskCoverage);

  const coverageDiagnosis = round2(
    clamp(
      input.fullFeatureAccuracy * 35 * boost +
        wF * 10 -
        input.missingnessPressure * 22 -
        input.leakageRisk * 12 -
        (input.sufficiencyBias === "mask_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const salienceDiagnosis = round2(
    clamp(
      input.imputationOptimism * 40 * boost +
        input.fullFeatureAccuracy * 25 -
        load * 15 -
        input.maskCoverage * 8,
      0,
      100,
    ),
  );
  const sufficiencyReasonScore = round2(
    clamp(
      input.imputationOptimism * 38 * boost +
        input.fullFeatureAccuracy * 20 -
        input.cohortFit * (naive ? 5 : 0) -
        load * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const cohortIntegrity = round2(
    clamp(
      input.fullFeatureAccuracy * 42 * boost +
        input.imputationOptimism * 28 -
        input.maskCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const fullFeatureScore = round2(
    clamp(
      input.fullFeatureAccuracy * 58 * boost * wF +
        input.imputationOptimism * 32 -
        input.missingnessPressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.imputationOptimism * 45 +
        input.fullFeatureAccuracy * 35 -
        input.missingnessPressure * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const partialContribution = round2(
    clamp(
      coverageDiagnosis * 0.2 +
        salienceDiagnosis * 0.2 +
        sufficiencyReasonScore * 0.2 +
        cohortIntegrity * 0.2 +
        fullFeatureScore * 0.2,
      0,
      100,
    ),
  );
  const fullContribution = round2(
    clamp(
      fullFeatureScore * 0.55 +
        input.imputationOptimism * 30 +
        input.fullFeatureAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      fullContribution * (naive ? 0.78 : 0.5) +
        partialContribution * (naive ? 0.22 : 0.5) -
        input.missingnessPressure * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "full_feature",
    coverageDiagnosis,
    salienceDiagnosis,
    sufficiencyReasonScore,
    cohortIntegrity,
    fullFeatureScore,
    confidence,
    partialContribution,
    fullContribution,
    overall,
  };
}
