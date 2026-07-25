import {
  type ProbeInput,
  type ProbeQuality,
  biasWeight,
  clamp,
  noiseLoad,
  round2,
} from "./types";

/**
 * Cooperative multi-domain probe scorer (path A):
 * rewards cooperativity, domain coverage, bridge completeness, and specificity
 * without claiming wet-lab IVD clearance.
 */
export function scoreCooperativeMultiDomainProbe(
  input: ProbeInput,
): ProbeQuality {
  const only = input.profile === "cooperative_multi_domain_probe";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.probeBias, "cooperative");
  const wS = biasWeight(input.probeBias, "specificity_first");
  const wM = biasWeight(input.probeBias, "melting_first");
  const avgBias = (wC + wS + (2 - wM)) / 3;
  const load = noiseLoad(input.physioNoise, input.cooperativity);

  const cooperativityScore = round2(
    clamp(
      (input.cooperativity * 55 +
        input.bridgeCompleteness * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.probeBias === "melting_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.domainCoverage * 60 * boost +
        input.cooperativity * 25 +
        (only ? 8 : 0) -
        input.incompleteRisk * (only ? 4 : 16) -
        (input.probeBias === "melting_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const bridgeScore = round2(
    clamp(
      input.bridgeCompleteness * 58 * boost * wC +
        input.cooperativity * 14 +
        input.domainCoverage * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const specificityScore = round2(
    clamp(
      input.specificityDelta * 50 * boost * wS +
        input.domainCoverage * 25 +
        input.cooperativity * 15 +
        (only ? 8 : 0) -
        (input.probeBias === "melting_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const meltingScore = round2(
    clamp(
      input.meltingSharpness * 55 * boost +
        input.incompleteRisk * 20 -
        input.physioNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cooperativity * 30 +
        input.domainCoverage * 30 +
        input.specificityDelta * 25 -
        input.incompleteRisk * 15,
      0,
      100,
    ),
  );
  const cooperativeContribution = round2(
    clamp(
      cooperativityScore * 0.24 +
        coverageScore * 0.26 +
        bridgeScore * 0.28 +
        specificityScore * 0.22,
      0,
      100,
    ),
  );
  const meltingContribution = round2(
    clamp(
      meltingScore * 0.7 +
        input.meltingSharpness * 20 +
        input.incompleteRisk * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cooperativeContribution * (only ? 0.82 : 0.4) +
        meltingContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.probeBias === "melting_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "cooperative_multi_domain_probe",
    cooperativityScore,
    coverageScore,
    bridgeScore,
    specificityScore,
    meltingScore,
    confidence,
    cooperativeContribution,
    meltingContribution,
    overall,
  };
}

/**
 * Single-domain melting baseline (path B):
 * rewards classic melting sharpness and ignores cooperative bridge honesty.
 */
export function scoreSingleDomainMeltingBaseline(
  input: ProbeInput,
): ProbeQuality {
  const baseline = input.profile === "single_domain_melting_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wM = biasWeight(input.probeBias, "melting_first");
  const load = noiseLoad(input.physioNoise, input.cooperativity);

  const cooperativityScore = round2(
    clamp(
      input.meltingSharpness * 35 * boost +
        wM * 10 -
        input.physioNoise * 22 -
        input.overclaimRisk * 12 -
        (input.probeBias === "cooperative" ? 8 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.incompleteRisk * 40 * boost +
        input.meltingSharpness * 25 -
        load * 15 -
        input.domainCoverage * 8,
      0,
      100,
    ),
  );
  const bridgeScore = round2(
    clamp(
      input.incompleteRisk * 38 * boost +
        input.meltingSharpness * 20 -
        input.specificityDelta * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const specificityScore = round2(
    clamp(
      input.meltingSharpness * 42 * boost +
        input.incompleteRisk * 28 -
        input.cooperativity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const meltingScore = round2(
    clamp(
      input.meltingSharpness * 58 * boost * wM +
        input.incompleteRisk * 32 -
        input.physioNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.incompleteRisk * 45 +
        input.meltingSharpness * 35 -
        input.physioNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const cooperativeContribution = round2(
    clamp(
      cooperativityScore * 0.2 +
        coverageScore * 0.2 +
        bridgeScore * 0.2 +
        specificityScore * 0.2 +
        meltingScore * 0.2,
      0,
      100,
    ),
  );
  const meltingContribution = round2(
    clamp(
      meltingScore * 0.55 +
        input.incompleteRisk * 30 +
        input.meltingSharpness * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      meltingContribution * (baseline ? 0.78 : 0.5) +
        cooperativeContribution * (baseline ? 0.22 : 0.5) -
        input.physioNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_domain_melting_baseline",
    cooperativityScore,
    coverageScore,
    bridgeScore,
    specificityScore,
    meltingScore,
    confidence,
    cooperativeContribution,
    meltingContribution,
    overall,
  };
}
