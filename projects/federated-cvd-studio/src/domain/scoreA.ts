import {
  type CvdInput,
  type CvdQuality,
  biasWeight,
  heterogeneityLoad,
  clamp,
  round2,
} from "./types";

/**
 * Federated CVD risk scorer (good path A):
 * rewards site participation, feature fidelity, and schema fit under heterogeneity.
 */
export function scoreFederatedCvdRisk(input: CvdInput): CvdQuality {
  const federated = input.profile === "federated_cvd_risk";
  const boost = federated ? 1.12 : 0.96;
  const wF = biasWeight(input.cvdBias, "federation_strict");
  const wFed = biasWeight(input.cvdBias, "federated_first");
  const wC = biasWeight(input.cvdBias, "central_first");
  const avgBias = (wF + wFed + wC) / 3;
  const load = heterogeneityLoad(
    input.heterogeneityHardness,
    input.siteParticipation,
  );

  const riskDiagnosis = round2(
    clamp(
      (input.siteParticipation * 55 +
        input.featureFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (federated ? 8 : 0) -
        input.leakageRisk * (federated ? 6 : 14) -
        (input.cvdBias === "central_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const federationDiagnosis = round2(
    clamp(
      input.featureFidelity * 60 * boost +
        input.siteParticipation * 25 +
        (federated ? 8 : 0) -
        input.centralOptimism * (federated ? 4 : 16) -
        (input.cvdBias === "central_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.federationAgreement * 58 * boost * wFed +
        input.siteParticipation * 28 +
        (federated ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.schemaFit * 50 * boost * wF +
        input.featureFidelity * 25 +
        input.siteParticipation * 15 +
        (federated ? 8 : 0) -
        (input.cvdBias === "central_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.centralizedAccuracy * 55 * boost +
        input.centralOptimism * 20 -
        input.heterogeneityHardness * 18 -
        (federated ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.siteParticipation * 40 +
        input.featureFidelity * 30 +
        input.schemaFit * 25 -
        input.centralOptimism * 15,
      0,
      100,
    ),
  );
  const federationContribution = round2(
    clamp(
      riskDiagnosis * 0.26 +
        federationDiagnosis * 0.24 +
        schemaReasonScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.centralizedAccuracy * 20 +
        input.centralOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      federationContribution * (federated ? 0.82 : 0.4) +
        baselineContribution * (federated ? 0.18 : 0.6) +
        (federated ? 4 : 0) -
        (input.cvdBias === "central_first" && federated ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "federated_cvd_risk",
    riskDiagnosis,
    federationDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    federationContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Centralized pooled-data baseline (path B):
 * rewards centralized accuracy + central optimism, weak on federation honesty.
 */
export function scoreCentralizedBaseline(input: CvdInput): CvdQuality {
  const baseline = input.profile === "centralized_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.cvdBias, "central_first");
  const load = heterogeneityLoad(
    input.heterogeneityHardness,
    input.siteParticipation,
  );

  const riskDiagnosis = round2(
    clamp(
      input.centralizedAccuracy * 35 * boost +
        wC * 10 -
        input.heterogeneityHardness * 22 -
        input.leakageRisk * 12 -
        (input.cvdBias === "federation_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const federationDiagnosis = round2(
    clamp(
      input.centralOptimism * 40 * boost +
        input.centralizedAccuracy * 25 -
        load * 15 -
        input.siteParticipation * 8,
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.centralOptimism * 38 * boost +
        input.centralizedAccuracy * 20 -
        input.schemaFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.centralizedAccuracy * 42 * boost +
        input.centralOptimism * 28 -
        input.siteParticipation * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.centralizedAccuracy * 58 * boost * wC +
        input.centralOptimism * 32 -
        input.heterogeneityHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.centralOptimism * 45 +
        input.centralizedAccuracy * 35 -
        input.heterogeneityHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const federationContribution = round2(
    clamp(
      riskDiagnosis * 0.2 +
        federationDiagnosis * 0.2 +
        schemaReasonScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.centralOptimism * 30 +
        input.centralizedAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        federationContribution * (baseline ? 0.22 : 0.5) -
        input.heterogeneityHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "centralized_baseline",
    riskDiagnosis,
    federationDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    federationContribution,
    baselineContribution,
    overall,
  };
}
