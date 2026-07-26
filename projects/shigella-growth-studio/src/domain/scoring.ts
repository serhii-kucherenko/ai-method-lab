import {
  type GrowthInput,
  type GrowthQuality,
  biasWeight,
  clamp,
  growthBurden,
  round2,
} from "./types";

/**
 * Antibiotic-treated Shigella pathway scorer (path A):
 * rewards antibiotic coverage, Shigella confirmation, and growth assay
 * signal when treated-Shigella pathway is configured — without claiming
 * live clinical prescribing, diagnostic clearance, or national guidelines.
 */
export function scoreAntibioticTreatedShigella(
  input: GrowthInput,
): GrowthQuality {
  const abx = input.profile === "antibiotic_treated_shigella";
  const boost = abx ? 1.12 : 0.96;
  const wA = biasWeight(input.treatmentBias, "antibiotic_first");
  const wG = biasWeight(input.treatmentBias, "growth_first");
  const wU = biasWeight(input.treatmentBias, "untreated_first");
  const avgBias = (wA + wG + (2 - wU)) / 3;
  const burden = growthBurden(
    input.episodeSeverity,
    input.untreatedDuration,
    input.growthVulnerability,
  );

  const growthProtectionScore = round2(
    clamp(
      (input.antibioticCoverage * 35 +
        input.shigellaConfirmation * 25 +
        input.growthAssaySignal * 30 +
        input.cohortFollowUp * 10 -
        burden * 5) *
        boost *
        avgBias +
        (abx ? 8 : 0) -
        input.overclaimRisk * (abx ? 6 : 14) -
        (input.treatmentBias === "untreated_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const episodeControlScore = round2(
    clamp(
      input.antibioticCoverage * 35 * boost +
        input.shigellaConfirmation * 25 * wA +
        (1 - input.episodeSeverity) * 20 +
        (abx ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const assayCoverage = round2(
    clamp(
      input.growthAssaySignal * 40 * boost * wG +
        input.antibioticCoverage * 30 +
        input.cohortFollowUp * 15 +
        (abx ? 8 : 0) -
        (input.treatmentBias === "untreated_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const cohortEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.cohortFollowUp * 25 +
        input.antibioticCoverage * 20) *
        boost *
        wG +
        (abx ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const untreatedPenalty = round2(
    clamp(
      (input.treatmentBias === "untreated_first" ? 40 : 18) * boost +
        burden * 18 -
        input.antibioticCoverage * 12 +
        (1 - input.cohortFollowUp) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.antibioticCoverage * 26 +
        input.shigellaConfirmation * 22 +
        input.growthAssaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const antibioticContribution = round2(
    clamp(
      growthProtectionScore * 0.32 +
        assayCoverage * 0.28 +
        cohortEfficiency * 0.22 +
        (100 - untreatedPenalty) * 0.18,
      0,
      100,
    ),
  );
  const untreatedContribution = round2(
    clamp(
      growthProtectionScore * 0.35 +
        episodeControlScore * 0.35 +
        cohortEfficiency * 0.2 +
        untreatedPenalty * 0.1 -
        input.antibioticCoverage * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      antibioticContribution * (abx ? 0.82 : 0.4) +
        untreatedContribution * (abx ? 0.18 : 0.6) +
        (abx ? 4 : 0) -
        (input.treatmentBias === "untreated_first" && abx ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "antibiotic_treated_shigella",
    growthProtectionScore,
    episodeControlScore,
    assayCoverage,
    cohortEfficiency,
    untreatedPenalty,
    confidence,
    antibioticContribution,
    untreatedContribution,
    overall,
  };
}

/**
 * Untreated diarrhea growth baseline scorer (path B):
 * rewards untreated-path familiarity and underweights antibiotic gains.
 */
export function scoreUntreatedDiarrheaGrowth(
  input: GrowthInput,
): GrowthQuality {
  const unt = input.profile === "untreated_diarrhea_growth";
  const boost = unt ? 1.08 : 0.92;
  const wU = biasWeight(input.treatmentBias, "untreated_first");
  const wG = biasWeight(input.treatmentBias, "growth_first");
  const burden = growthBurden(
    input.episodeSeverity,
    input.untreatedDuration,
    input.growthVulnerability,
  );

  const growthProtectionScore = round2(
    clamp(
      (1 - input.untreatedDuration) * 28 * boost +
        (1 - input.growthVulnerability) * 35 * boost +
        (wU + wG) * 5 -
        input.antibioticCoverage * 10 -
        input.overclaimRisk * 10 -
        (input.treatmentBias === "antibiotic_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const episodeControlScore = round2(
    clamp(
      (1 - input.episodeSeverity) * 45 * boost * Math.max(wU, wG) +
        (1 - burden) * 20 +
        (unt ? 8 : 0) -
        input.antibioticCoverage * 8,
      0,
      100,
    ),
  );
  const assayCoverage = round2(
    clamp(
      input.growthAssaySignal * 40 * boost +
        (1 - input.growthVulnerability) * 25 -
        input.antibioticCoverage * 12 +
        (unt ? 5 : 0),
      0,
      100,
    ),
  );
  const cohortEfficiency = round2(
    clamp(
      (1 - input.untreatedDuration) * 35 * boost * Math.max(wU, wG) +
        input.growthAssaySignal * 25 +
        (unt ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const untreatedPenalty = round2(
    clamp(
      input.untreatedDuration * 25 * boost +
        burden * 12 -
        input.antibioticCoverage * (unt ? 4 : 10) -
        input.cohortFollowUp * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      ((1 - input.untreatedDuration) + input.growthAssaySignal) * 28 +
        input.growthAssaySignal * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const antibioticContribution = round2(
    clamp(
      growthProtectionScore * 0.2 +
        episodeControlScore * 0.2 +
        assayCoverage * 0.2 +
        (100 - untreatedPenalty) * 0.2 +
        cohortEfficiency * 0.2,
      0,
      100,
    ),
  );
  const untreatedContribution = round2(
    clamp(
      growthProtectionScore * 0.45 +
        episodeControlScore * 0.35 +
        cohortEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      untreatedContribution * (unt ? 0.78 : 0.5) +
        antibioticContribution * (unt ? 0.22 : 0.5) -
        input.antibioticCoverage * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "untreated_diarrhea_growth",
    growthProtectionScore,
    episodeControlScore,
    assayCoverage,
    cohortEfficiency,
    untreatedPenalty,
    confidence,
    antibioticContribution,
    untreatedContribution,
    overall,
  };
}
