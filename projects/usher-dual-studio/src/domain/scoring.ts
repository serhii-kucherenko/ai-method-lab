import {
  type UsherDualInput,
  type UsherDualQuality,
  biasWeight,
  pathwayBurden,
  clamp,
  round2,
} from "./types";

/**
 * MYO7A gene supplementation scorer (path A):
 * rewards dual-AAV rescue fit and penalizes allele gaps that would
 * hide incomplete supplementation — without claiming wet-lab
 * validation, IND/NDA readiness, patient dosing, or clinical advice.
 */
export function scoreMyo7aGeneSupplement(
  input: UsherDualInput,
): UsherDualQuality {
  const myo = input.profile === "myo7a_gene_supplement";
  const boost = myo ? 1.12 : 0.96;
  const wA = biasWeight(input.scoringBias, "myo7a_first");
  const wS = biasWeight(input.scoringBias, "assay_first");
  const wB = biasWeight(input.scoringBias, "myo7b_first");
  const avgBias = (wA + wS + (2 - wB)) / 3;
  const burden = pathwayBurden(
    input.myo7bActivation,
    input.alleleGap,
    input.overclaimRisk,
  );

  const myo7aRescueScore = round2(
    clamp(
      (input.myo7aRescue * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.pathwayFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (myo ? 8 : 0) -
        input.overclaimRisk * (myo ? 6 : 14) -
        (input.scoringBias === "myo7b_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const myo7bActivationScore = round2(
    clamp(
      input.myo7bActivation * 35 * (myo ? 0.7 : 1.1) +
        input.vectorDelivery * 25 * wB +
        (1 - input.myo7aRescue) * 20 +
        (myo ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const vectorCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wS +
        input.myo7aRescue * 30 +
        input.pathwayFollowThrough * 15 +
        (myo ? 8 : 0) -
        input.alleleGap * 18 -
        (input.scoringBias === "myo7b_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const pathwayEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.pathwayFollowThrough * 25 +
        input.vectorDelivery * 20) *
        boost *
        wS +
        (myo ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const alleleGapPenalty = round2(
    clamp(
      (input.scoringBias === "myo7b_first" ? 40 : 18) * boost +
        input.alleleGap * 28 +
        burden * 12 -
        input.myo7aRescue * 12 +
        (1 - input.pathwayFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.myo7aRescue * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.alleleGap * 12 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const myo7aContribution = round2(
    clamp(
      myo7aRescueScore * 0.32 +
        vectorCoverage * 0.28 +
        pathwayEfficiency * 0.22 +
        (100 - alleleGapPenalty) * 0.18,
      0,
      100,
    ),
  );
  const myo7bContribution = round2(
    clamp(
      myo7aRescueScore * 0.35 +
        myo7bActivationScore * 0.35 +
        pathwayEfficiency * 0.2 +
        alleleGapPenalty * 0.1 -
        input.myo7aRescue * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      myo7aContribution * (myo ? 0.82 : 0.4) +
        myo7bContribution * (myo ? 0.18 : 0.6) +
        (myo ? 4 : 0) -
        (input.scoringBias === "myo7b_first" && myo ? 3 : 0) -
        input.alleleGap * (myo ? 4 : 10),
      0,
      100,
    ),
  );

  return {
    mode: "myo7a_gene_supplement",
    myo7aRescueScore,
    myo7bActivationScore,
    vectorCoverage,
    pathwayEfficiency,
    alleleGapPenalty,
    confidence,
    myo7aContribution,
    myo7bContribution,
    overall,
  };
}

/**
 * Myo7b activation scorer (path B):
 * rewards Myo7b activation familiarity and underweights MYO7A
 * supplementation rescue — and can look competitive when allele
 * gaps hide incomplete coverage that gene supplementation would need.
 */
export function scoreMyo7bActivation(input: UsherDualInput): UsherDualQuality {
  const act = input.profile === "myo7b_activation";
  const boost = act ? 1.08 : 0.92;
  const wB = biasWeight(input.scoringBias, "myo7b_first");
  const wS = biasWeight(input.scoringBias, "assay_first");
  const burden = pathwayBurden(
    input.myo7bActivation,
    input.alleleGap,
    input.overclaimRisk,
  );

  const myo7aRescueScore = round2(
    clamp(
      (1 - input.myo7bActivation) * 28 * boost +
        input.alleleGap * 22 * boost +
        (wB + wS) * 5 -
        input.myo7aRescue * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "myo7a_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const myo7bActivationScore = round2(
    clamp(
      input.myo7bActivation * 20 * boost +
        input.alleleGap * 35 * boost * Math.max(wB, wS) +
        (1 - burden) * 15 +
        (act ? 8 : 0) -
        input.myo7aRescue * 8,
      0,
      100,
    ),
  );
  const vectorCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        input.alleleGap * 25 -
        input.myo7aRescue * 12 +
        (act ? 5 : 0),
      0,
      100,
    ),
  );
  const pathwayEfficiency = round2(
    clamp(
      input.alleleGap * 35 * boost * Math.max(wB, wS) +
        input.assayReadout * 25 +
        (act ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const alleleGapPenalty = round2(
    clamp(
      (1 - input.myo7aRescue) * 25 * boost +
        burden * 12 -
        input.alleleGap * (act ? 4 : 10) -
        input.pathwayFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.alleleGap + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const myo7aContribution = round2(
    clamp(
      myo7aRescueScore * 0.2 +
        myo7bActivationScore * 0.2 +
        vectorCoverage * 0.2 +
        (100 - alleleGapPenalty) * 0.2 +
        pathwayEfficiency * 0.2,
      0,
      100,
    ),
  );
  const myo7bContribution = round2(
    clamp(
      myo7aRescueScore * 0.45 +
        myo7bActivationScore * 0.35 +
        pathwayEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      myo7bContribution * (act ? 0.78 : 0.5) +
        myo7aContribution * (act ? 0.22 : 0.5) -
        input.myo7aRescue * 5 -
        input.overclaimRisk * 6 +
        input.alleleGap * 8,
      0,
      100,
    ),
  );

  return {
    mode: "myo7b_activation",
    myo7aRescueScore,
    myo7bActivationScore,
    vectorCoverage,
    pathwayEfficiency,
    alleleGapPenalty,
    confidence,
    myo7aContribution,
    myo7bContribution,
    overall,
  };
}
