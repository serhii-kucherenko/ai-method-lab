import {
  type LatentPathInput,
  type LatentPathQuality,
  biasWeight,
  clamp,
  pathLoad,
  round2,
} from "./types";

/**
 * Multi-domain latent trajectory scorer (path A):
 * rewards joint class clarity, multi-domain coverage, trajectory separation,
 * and pack readiness without single-domain theater.
 */
export function scoreMultiDomainLatentTrajectory(
  input: LatentPathInput,
): LatentPathQuality {
  const only = input.profile === "multi_domain_latent_trajectory";
  const boost = only ? 1.12 : 0.96;
  const wJ = biasWeight(input.pathBias, "joint_first");
  const wP = biasWeight(input.pathBias, "predictor_first");
  const wS = biasWeight(input.pathBias, "single_domain_first");
  const avgBias = (wJ + wP + (2 - wS)) / 3;
  const load = pathLoad(input.predictorNoise, input.multiDomainCoverage);

  const coverageScore = round2(
    clamp(
      (input.multiDomainCoverage * 55 +
        input.trajectorySeparation * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.pathBias === "single_domain_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const classScore = round2(
    clamp(
      input.jointClassClarity * 60 * boost +
        input.multiDomainCoverage * 25 +
        (only ? 8 : 0) -
        input.domainIsolation * (only ? 4 : 16) -
        (input.pathBias === "single_domain_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const trajectoryScore = round2(
    clamp(
      input.trajectorySeparation * 58 * boost * wJ +
        input.multiDomainCoverage * 14 +
        input.jointClassClarity * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wP +
        input.jointClassClarity * 25 +
        input.multiDomainCoverage * 15 +
        (only ? 8 : 0) -
        (input.pathBias === "single_domain_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const singleDomainScore = round2(
    clamp(
      input.singleDomainAdherence * 55 * boost +
        input.domainIsolation * 20 -
        input.predictorNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.multiDomainCoverage * 30 +
        input.jointClassClarity * 30 +
        input.packReadiness * 25 -
        input.domainIsolation * 15,
      0,
      100,
    ),
  );
  const multiDomainContribution = round2(
    clamp(
      coverageScore * 0.24 +
        classScore * 0.26 +
        trajectoryScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const singleDomainContribution = round2(
    clamp(
      singleDomainScore * 0.7 +
        input.singleDomainAdherence * 20 +
        input.domainIsolation * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      multiDomainContribution * (only ? 0.82 : 0.4) +
        singleDomainContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.pathBias === "single_domain_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multi_domain_latent_trajectory",
    coverageScore,
    classScore,
    trajectoryScore,
    readinessScore,
    singleDomainScore,
    confidence,
    multiDomainContribution,
    singleDomainContribution,
    overall,
  };
}

/**
 * Single-domain baseline (path B):
 * rewards isolated symptom-family modeling and ignores joint latent honesty.
 */
export function scoreSingleDomainBaseline(
  input: LatentPathInput,
): LatentPathQuality {
  const baseline = input.profile === "single_domain_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.pathBias, "single_domain_first");
  const load = pathLoad(input.predictorNoise, input.multiDomainCoverage);

  const coverageScore = round2(
    clamp(
      input.singleDomainAdherence * 35 * boost +
        wS * 10 -
        input.predictorNoise * 22 -
        input.overclaimRisk * 12 -
        (input.pathBias === "joint_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const classScore = round2(
    clamp(
      input.domainIsolation * 40 * boost +
        input.singleDomainAdherence * 25 -
        load * 15 -
        input.jointClassClarity * 8,
      0,
      100,
    ),
  );
  const trajectoryScore = round2(
    clamp(
      input.domainIsolation * 38 * boost +
        input.singleDomainAdherence * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.singleDomainAdherence * 42 * boost +
        input.domainIsolation * 28 -
        input.multiDomainCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const singleDomainScore = round2(
    clamp(
      input.singleDomainAdherence * 58 * boost * wS +
        input.domainIsolation * 32 -
        input.predictorNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.domainIsolation * 45 +
        input.singleDomainAdherence * 35 -
        input.predictorNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const multiDomainContribution = round2(
    clamp(
      coverageScore * 0.2 +
        classScore * 0.2 +
        trajectoryScore * 0.2 +
        readinessScore * 0.2 +
        singleDomainScore * 0.2,
      0,
      100,
    ),
  );
  const singleDomainContribution = round2(
    clamp(
      singleDomainScore * 0.55 +
        input.domainIsolation * 30 +
        input.singleDomainAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      singleDomainContribution * (baseline ? 0.78 : 0.5) +
        multiDomainContribution * (baseline ? 0.22 : 0.5) -
        input.predictorNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_domain_baseline",
    coverageScore,
    classScore,
    trajectoryScore,
    readinessScore,
    singleDomainScore,
    confidence,
    multiDomainContribution,
    singleDomainContribution,
    overall,
  };
}
