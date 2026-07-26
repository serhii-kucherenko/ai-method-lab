import {
  type ImplementInput,
  type ImplementQuality,
  biasWeight,
  careBurden,
  clamp,
  round2,
} from "./types";

/**
 * CFIR co-design primary-care scorer (path A):
 * rewards co-design intensity, community engagement, and fidelity
 * when a CFIR pathway is configured — without claiming live clinical
 * triage, EMR write-back, or government program authority.
 */
export function scoreCfirCodesignPrimaryCare(
  input: ImplementInput,
): ImplementQuality {
  const cfir = input.profile === "cfir_codesign_primary_care";
  const boost = cfir ? 1.12 : 0.96;
  const wC = biasWeight(input.implementationBias, "codesign_first");
  const wF = biasWeight(input.implementationBias, "fidelity_first");
  const wS = biasWeight(input.implementationBias, "status_quo_first");
  const avgBias = (wC + wF + (2 - wS)) / 3;
  const burden = careBurden(
    input.caretakerDelay,
    input.referralFriction,
    input.pathwayClarity,
  );

  const careAccessScore = round2(
    clamp(
      ((1 - input.caretakerDelay) * 35 +
        (1 - input.referralFriction) * 25 +
        input.codesignIntensity * 30 +
        input.districtCoverage * 10 -
        burden * 5) *
        boost *
        avgBias +
        (cfir ? 8 : 0) -
        input.overclaimRisk * (cfir ? 6 : 14) -
        (input.implementationBias === "status_quo_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.fidelitySignal * 35 * boost +
        input.codesignIntensity * 25 * wC +
        input.communityEngagement * 20 +
        (cfir ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const pathwayCoverage = round2(
    clamp(
      input.districtCoverage * 40 * boost * wC +
        input.codesignIntensity * 30 +
        (1 - input.caretakerDelay) * 15 +
        (cfir ? 8 : 0) -
        (input.implementationBias === "status_quo_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const costEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.communityEngagement * 25 +
        input.codesignIntensity * 20) *
        boost *
        wF +
        (cfir ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const statusQuoPenalty = round2(
    clamp(
      (input.implementationBias === "status_quo_first" ? 40 : 18) * boost +
        burden * 18 -
        input.codesignIntensity * 12 +
        (1 - input.districtCoverage) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.codesignIntensity * 26 +
        input.districtCoverage * 22 +
        input.fidelitySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const codesignContribution = round2(
    clamp(
      careAccessScore * 0.32 +
        pathwayCoverage * 0.28 +
        costEfficiency * 0.22 +
        (100 - statusQuoPenalty) * 0.18,
      0,
      100,
    ),
  );
  const pathwayContribution = round2(
    clamp(
      careAccessScore * 0.35 +
        fidelityScore * 0.35 +
        costEfficiency * 0.2 +
        statusQuoPenalty * 0.1 -
        input.codesignIntensity * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      codesignContribution * (cfir ? 0.82 : 0.4) +
        pathwayContribution * (cfir ? 0.18 : 0.6) +
        (cfir ? 4 : 0) -
        (input.implementationBias === "status_quo_first" && cfir ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "cfir_codesign_primary_care",
    careAccessScore,
    fidelityScore,
    pathwayCoverage,
    costEfficiency,
    statusQuoPenalty,
    confidence,
    codesignContribution,
    pathwayContribution,
    overall,
  };
}

/**
 * Status-quo pathway baseline scorer (path B):
 * rewards familiar pathway clarity and underweights CFIR co-design gains.
 */
export function scoreStatusQuoPathway(
  input: ImplementInput,
): ImplementQuality {
  const sq = input.profile === "status_quo_pathway";
  const boost = sq ? 1.08 : 0.92;
  const wS = biasWeight(input.implementationBias, "status_quo_first");
  const wF = biasWeight(input.implementationBias, "fidelity_first");
  const burden = careBurden(
    input.caretakerDelay,
    input.referralFriction,
    input.pathwayClarity,
  );

  const careAccessScore = round2(
    clamp(
      (1 - input.caretakerDelay) * 28 * boost +
        input.pathwayClarity * 35 * boost +
        (wS + wF) * 5 -
        input.codesignIntensity * 10 -
        input.overclaimRisk * 10 -
        (input.implementationBias === "codesign_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.pathwayClarity * 45 * boost * Math.max(wS, wF) +
        (1 - burden) * 20 +
        (sq ? 8 : 0) -
        input.codesignIntensity * 8,
      0,
      100,
    ),
  );
  const pathwayCoverage = round2(
    clamp(
      input.pathwayClarity * 40 * boost +
        input.fidelitySignal * 25 -
        input.codesignIntensity * 12 +
        (sq ? 5 : 0),
      0,
      100,
    ),
  );
  const costEfficiency = round2(
    clamp(
      input.pathwayClarity * 35 * boost * Math.max(wS, wF) +
        input.fidelitySignal * 25 +
        (sq ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const statusQuoPenalty = round2(
    clamp(
      (1 - input.pathwayClarity) * 25 * boost +
        burden * 12 -
        input.codesignIntensity * (sq ? 4 : 10) -
        input.districtCoverage * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.pathwayClarity + input.fidelitySignal) * 28 +
        input.fidelitySignal * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const codesignContribution = round2(
    clamp(
      careAccessScore * 0.2 +
        fidelityScore * 0.2 +
        pathwayCoverage * 0.2 +
        (100 - statusQuoPenalty) * 0.2 +
        costEfficiency * 0.2,
      0,
      100,
    ),
  );
  const pathwayContribution = round2(
    clamp(
      careAccessScore * 0.45 +
        fidelityScore * 0.35 +
        costEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      pathwayContribution * (sq ? 0.78 : 0.5) +
        codesignContribution * (sq ? 0.22 : 0.5) -
        input.codesignIntensity * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "status_quo_pathway",
    careAccessScore,
    fidelityScore,
    pathwayCoverage,
    costEfficiency,
    statusQuoPenalty,
    confidence,
    codesignContribution,
    pathwayContribution,
    overall,
  };
}
