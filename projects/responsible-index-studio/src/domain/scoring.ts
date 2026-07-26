import {
  type IndexInput,
  type IndexQuality,
  biasWeight,
  clamp,
  governanceBurden,
  round2,
} from "./types";

/**
 * Structured country index scorer (path A):
 * rewards multi-dimension depth, evidence, and indicator readout
 * when the structured country profile is configured — without claiming
 * live national policy authority, certified AI audits, or government command.
 */
export function scoreStructuredCountryIndex(input: IndexInput): IndexQuality {
  const structured = input.profile === "structured_country_index";
  const boost = structured ? 1.12 : 0.96;
  const wD = biasWeight(input.scoringBias, "dimension_first");
  const wI = biasWeight(input.scoringBias, "indicator_first");
  const wC = biasWeight(input.scoringBias, "checklist_first");
  const avgBias = (wD + wI + (2 - wC)) / 3;
  const burden = governanceBurden(
    input.checklistCoverage,
    input.dimensionCompleteness,
    input.overclaimRisk,
  );

  const structuredIndexScore = round2(
    clamp(
      (input.structuredDepth * 35 +
        input.evidenceStrength * 25 +
        input.indicatorReadout * 30 +
        input.countryFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (structured ? 8 : 0) -
        input.overclaimRisk * (structured ? 6 : 14) -
        (input.scoringBias === "checklist_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const checklistScore = round2(
    clamp(
      input.checklistCoverage * 35 * (structured ? 0.7 : 1.1) +
        input.indicatorFidelity * 25 * wC +
        (1 - input.structuredDepth) * 20 +
        (structured ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const dimensionCoverage = round2(
    clamp(
      input.indicatorReadout * 40 * boost * wI +
        input.structuredDepth * 30 +
        input.countryFollowThrough * 15 +
        (structured ? 8 : 0) -
        (input.scoringBias === "checklist_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const countryEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.countryFollowThrough * 25 +
        input.indicatorFidelity * 20) *
        boost *
        wI +
        (structured ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const checklistOnlyPenalty = round2(
    clamp(
      (input.scoringBias === "checklist_first" ? 40 : 18) * boost +
        burden * 18 -
        input.structuredDepth * 12 +
        (1 - input.countryFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.structuredDepth * 26 +
        input.evidenceStrength * 22 +
        input.indicatorReadout * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const structuredContribution = round2(
    clamp(
      structuredIndexScore * 0.32 +
        dimensionCoverage * 0.28 +
        countryEfficiency * 0.22 +
        (100 - checklistOnlyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const checklistContribution = round2(
    clamp(
      structuredIndexScore * 0.35 +
        checklistScore * 0.35 +
        countryEfficiency * 0.2 +
        checklistOnlyPenalty * 0.1 -
        input.structuredDepth * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structuredContribution * (structured ? 0.82 : 0.4) +
        checklistContribution * (structured ? 0.18 : 0.6) +
        (structured ? 4 : 0) -
        (input.scoringBias === "checklist_first" && structured ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "structured_country_index",
    structuredIndexScore,
    checklistScore,
    dimensionCoverage,
    countryEfficiency,
    checklistOnlyPenalty,
    confidence,
    structuredContribution,
    checklistContribution,
    overall,
  };
}

/**
 * Naive commitment checklist scorer (path B):
 * rewards checklist familiarity and underweights structured dimension gains.
 */
export function scoreNaiveCommitmentChecklist(
  input: IndexInput,
): IndexQuality {
  const checklist = input.profile === "naive_commitment_checklist";
  const boost = checklist ? 1.08 : 0.92;
  const wC = biasWeight(input.scoringBias, "checklist_first");
  const wI = biasWeight(input.scoringBias, "indicator_first");
  const burden = governanceBurden(
    input.checklistCoverage,
    input.dimensionCompleteness,
    input.overclaimRisk,
  );

  const structuredIndexScore = round2(
    clamp(
      (1 - input.checklistCoverage) * 28 * boost +
        (1 - input.structuredDepth) * 15 * boost +
        (wC + wI) * 5 -
        input.structuredDepth * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "dimension_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const checklistScore = round2(
    clamp(
      input.checklistCoverage * 45 * boost * Math.max(wC, wI) +
        (1 - burden) * 20 +
        (checklist ? 8 : 0) -
        input.structuredDepth * 8,
      0,
      100,
    ),
  );
  const dimensionCoverage = round2(
    clamp(
      input.indicatorReadout * 40 * boost +
        (1 - input.structuredDepth) * 25 -
        input.structuredDepth * 12 +
        (checklist ? 5 : 0),
      0,
      100,
    ),
  );
  const countryEfficiency = round2(
    clamp(
      input.checklistCoverage * 35 * boost * Math.max(wC, wI) +
        input.indicatorReadout * 25 +
        (checklist ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const checklistOnlyPenalty = round2(
    clamp(
      (1 - input.dimensionCompleteness) * 25 * boost +
        burden * 12 -
        input.structuredDepth * (checklist ? 4 : 10) -
        input.countryFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.checklistCoverage + input.indicatorReadout) * 28 +
        input.indicatorReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const structuredContribution = round2(
    clamp(
      structuredIndexScore * 0.2 +
        checklistScore * 0.2 +
        dimensionCoverage * 0.2 +
        (100 - checklistOnlyPenalty) * 0.2 +
        countryEfficiency * 0.2,
      0,
      100,
    ),
  );
  const checklistContribution = round2(
    clamp(
      structuredIndexScore * 0.45 +
        checklistScore * 0.35 +
        countryEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      checklistContribution * (checklist ? 0.78 : 0.5) +
        structuredContribution * (checklist ? 0.22 : 0.5) -
        input.structuredDepth * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_commitment_checklist",
    structuredIndexScore,
    checklistScore,
    dimensionCoverage,
    countryEfficiency,
    checklistOnlyPenalty,
    confidence,
    structuredContribution,
    checklistContribution,
    overall,
  };
}
