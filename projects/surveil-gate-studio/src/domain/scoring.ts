import {
  type SurveilGateInput,
  type SurveilGateQuality,
  biasWeight,
  clamp,
  round2,
  surveillanceLoad,
} from "./types";

/**
 * Six-pillar trust governance scorer (path A / trust_gph_six_pillar):
 * rewards pillar coverage, policy completeness, signal integrity,
 * and pack readiness without explainability-only theater.
 */
export function scoreTrustGphSixPillar(
  input: SurveilGateInput,
): SurveilGateQuality {
  const only = input.profile === "trust_gph_six_pillar";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.governanceBias, "pillar_first");
  const wPol = biasWeight(input.governanceBias, "policy_first");
  const wE = biasWeight(input.governanceBias, "explain_first");
  const avgBias = (wP + wPol + (2 - wE)) / 3;
  const load = surveillanceLoad(
    input.hallucinationHardness,
    input.signalIntegrity,
  );

  const pillarScore = round2(
    clamp(
      (input.pillarCoverage * 55 +
        input.signalIntegrity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.governanceBias === "explain_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const policyScore = round2(
    clamp(
      input.policyCompleteness * 60 * boost +
        input.pillarCoverage * 25 +
        (only ? 8 : 0) -
        input.trustErosionRisk * (only ? 4 : 16) -
        (input.governanceBias === "explain_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const signalScore = round2(
    clamp(
      input.signalIntegrity * 58 * boost * wP +
        input.pillarCoverage * 14 +
        input.policyCompleteness * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wPol +
        input.policyCompleteness * 25 +
        input.pillarCoverage * 15 +
        (only ? 8 : 0) -
        (input.governanceBias === "explain_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const explainOnlyScore = round2(
    clamp(
      input.explainOnlyAdherence * 55 * boost +
        input.trustErosionRisk * 20 -
        input.hallucinationHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.pillarCoverage * 30 +
        input.policyCompleteness * 30 +
        input.packReadiness * 25 -
        input.trustErosionRisk * 15,
      0,
      100,
    ),
  );
  const trustContribution = round2(
    clamp(
      pillarScore * 0.24 +
        policyScore * 0.26 +
        signalScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const explainContribution = round2(
    clamp(
      explainOnlyScore * 0.7 +
        input.explainOnlyAdherence * 20 +
        input.trustErosionRisk * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      trustContribution * (only ? 0.82 : 0.4) +
        explainContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.governanceBias === "explain_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "trust_gph_six_pillar",
    pillarScore,
    policyScore,
    signalScore,
    readinessScore,
    explainOnlyScore,
    confidence,
    trustContribution,
    explainContribution,
    overall,
  };
}

/**
 * Explainability-only baseline (path B):
 * rewards explain-only adherence and ignores six-pillar honesty.
 */
export function scoreExplainabilityOnlyBaseline(
  input: SurveilGateInput,
): SurveilGateQuality {
  const baseline = input.profile === "explainability_only_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wE = biasWeight(input.governanceBias, "explain_first");
  const load = surveillanceLoad(
    input.hallucinationHardness,
    input.signalIntegrity,
  );

  const pillarScore = round2(
    clamp(
      input.explainOnlyAdherence * 35 * boost +
        wE * 10 -
        input.hallucinationHardness * 22 -
        input.overclaimRisk * 12 -
        (input.governanceBias === "pillar_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const policyScore = round2(
    clamp(
      input.trustErosionRisk * 40 * boost +
        input.explainOnlyAdherence * 25 -
        load * 15 -
        input.policyCompleteness * 8,
      0,
      100,
    ),
  );
  const signalScore = round2(
    clamp(
      input.trustErosionRisk * 38 * boost +
        input.explainOnlyAdherence * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.explainOnlyAdherence * 42 * boost +
        input.trustErosionRisk * 28 -
        input.pillarCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const explainOnlyScore = round2(
    clamp(
      input.explainOnlyAdherence * 58 * boost * wE +
        input.trustErosionRisk * 32 -
        input.hallucinationHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.trustErosionRisk * 45 +
        input.explainOnlyAdherence * 35 -
        input.hallucinationHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const trustContribution = round2(
    clamp(
      pillarScore * 0.2 +
        policyScore * 0.2 +
        signalScore * 0.2 +
        readinessScore * 0.2 +
        explainOnlyScore * 0.2,
      0,
      100,
    ),
  );
  const explainContribution = round2(
    clamp(
      explainOnlyScore * 0.55 +
        input.trustErosionRisk * 30 +
        input.explainOnlyAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      explainContribution * (baseline ? 0.78 : 0.5) +
        trustContribution * (baseline ? 0.22 : 0.5) -
        input.hallucinationHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "explainability_only_baseline",
    pillarScore,
    policyScore,
    signalScore,
    readinessScore,
    explainOnlyScore,
    confidence,
    trustContribution,
    explainContribution,
    overall,
  };
}
