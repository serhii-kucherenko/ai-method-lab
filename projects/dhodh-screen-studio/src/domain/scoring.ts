import {
  type DhodhInput,
  type DhodhQuality,
  biasWeight,
  screenBurden,
  clamp,
  round2,
} from "./types";

/**
 * Structure-based PfDHODH virtual screening scorer (path A):
 * rewards docking + pharmacophore fit and parasite selectivity —
 * without claiming wet-lab validation, clinical antimalarial advice,
 * IND/NDA readiness, or live compound procurement.
 */
export function scoreStructureBasedDhodh(input: DhodhInput): DhodhQuality {
  const structure = input.profile === "structure_based_dhodh";
  const boost = structure ? 1.12 : 0.96;
  const wS = biasWeight(input.scoringBias, "structure_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const wL = biasWeight(input.scoringBias, "library_first");
  const avgBias = (wS + wA + (2 - wL)) / 3;
  const burden = screenBurden(
    input.libraryHitRate,
    input.pharmacophoreMatch,
    input.overclaimRisk,
  );

  const dockingScore = round2(
    clamp(
      (input.dockingFit * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.screenFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (structure ? 8 : 0) -
        input.overclaimRisk * (structure ? 6 : 14) -
        (input.scoringBias === "library_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const libraryScore = round2(
    clamp(
      input.libraryHitRate * 35 * (structure ? 0.7 : 1.1) +
        input.parasiteSelectivity * 25 * wL +
        (1 - input.dockingFit) * 20 +
        (structure ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const pharmacophoreCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wA +
        input.dockingFit * 30 +
        input.screenFollowThrough * 15 +
        (structure ? 8 : 0) -
        (1 - input.pharmacophoreMatch) * 18 -
        (input.scoringBias === "library_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const screenEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.screenFollowThrough * 25 +
        input.parasiteSelectivity * 20) *
        boost *
        wA +
        (structure ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const selectivityGap = round2(
    clamp(
      (input.scoringBias === "library_first" ? 40 : 18) * boost +
        (1 - input.parasiteSelectivity) * 28 +
        burden * 12 -
        input.dockingFit * 12 +
        (1 - input.screenFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.dockingFit * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        (1 - input.pharmacophoreMatch) * 12 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const structureContribution = round2(
    clamp(
      dockingScore * 0.32 +
        pharmacophoreCoverage * 0.28 +
        screenEfficiency * 0.22 +
        (100 - selectivityGap) * 0.18,
      0,
      100,
    ),
  );
  const libraryContribution = round2(
    clamp(
      dockingScore * 0.35 +
        libraryScore * 0.35 +
        screenEfficiency * 0.2 +
        selectivityGap * 0.1 -
        input.dockingFit * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structureContribution * (structure ? 0.82 : 0.4) +
        libraryContribution * (structure ? 0.18 : 0.6) +
        (structure ? 4 : 0) -
        (input.scoringBias === "library_first" && structure ? 3 : 0) -
        (1 - input.pharmacophoreMatch) * (structure ? 4 : 10),
      0,
      100,
    ),
  );

  return {
    mode: "structure_based_dhodh",
    dockingScore,
    libraryScore,
    pharmacophoreCoverage,
    screenEfficiency,
    selectivityGap,
    confidence,
    structureContribution,
    libraryContribution,
    overall,
  };
}

/**
 * Naive library baseline scorer (path B):
 * rewards undifferentiated library hit rate and underweights
 * docking / pharmacophore — and can look competitive when
 * non-selective lookalikes inflate library hits that structure-based
 * screens would filter out.
 */
export function scoreNaiveLibraryBaseline(input: DhodhInput): DhodhQuality {
  const naive = input.profile === "naive_library_baseline";
  const boost = naive ? 1.08 : 0.92;
  const wL = biasWeight(input.scoringBias, "library_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const burden = screenBurden(
    input.libraryHitRate,
    input.pharmacophoreMatch,
    input.overclaimRisk,
  );

  const dockingScore = round2(
    clamp(
      (1 - input.libraryHitRate) * 28 * boost +
        (1 - input.parasiteSelectivity) * 22 * boost +
        (wL + wA) * 5 -
        input.dockingFit * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "structure_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const libraryScore = round2(
    clamp(
      input.libraryHitRate * 20 * boost +
        (1 - input.parasiteSelectivity) * 35 * boost * Math.max(wL, wA) +
        (1 - burden) * 15 +
        (naive ? 8 : 0) -
        input.dockingFit * 8,
      0,
      100,
    ),
  );
  const pharmacophoreCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        (1 - input.parasiteSelectivity) * 25 -
        input.dockingFit * 12 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const screenEfficiency = round2(
    clamp(
      (1 - input.parasiteSelectivity) * 35 * boost * Math.max(wL, wA) +
        input.assayReadout * 25 +
        (naive ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const selectivityGap = round2(
    clamp(
      (1 - input.dockingFit) * 25 * boost +
        burden * 12 -
        (1 - input.parasiteSelectivity) * (naive ? 4 : 10) -
        input.screenFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (1 - input.parasiteSelectivity + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const structureContribution = round2(
    clamp(
      dockingScore * 0.2 +
        libraryScore * 0.2 +
        pharmacophoreCoverage * 0.2 +
        (100 - selectivityGap) * 0.2 +
        screenEfficiency * 0.2,
      0,
      100,
    ),
  );
  const libraryContribution = round2(
    clamp(
      dockingScore * 0.45 +
        libraryScore * 0.35 +
        screenEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      libraryContribution * (naive ? 0.78 : 0.5) +
        structureContribution * (naive ? 0.22 : 0.5) -
        input.dockingFit * 5 -
        input.overclaimRisk * 6 +
        (1 - input.parasiteSelectivity) * 8,
      0,
      100,
    ),
  );

  return {
    mode: "naive_library_baseline",
    dockingScore,
    libraryScore,
    pharmacophoreCoverage,
    screenEfficiency,
    selectivityGap,
    confidence,
    structureContribution,
    libraryContribution,
    overall,
  };
}
