import {
  type AminoarylInput,
  type AminoarylQuality,
  biasWeight,
  routeBurden,
  clamp,
  round2,
} from "./types";

/**
 * Photocatalytic 1,3-aminoarylation scorer (path A):
 * rewards light-driven aminoarylation fit and penalizes cyclopropane
 * strain that would hide incomplete photo coverage — without claiming
 * wet-lab validation, scale-up manufacturing control, or regulatory filing.
 */
export function scorePhotocatalyticAminoaryl(
  input: AminoarylInput,
): AminoarylQuality {
  const photo = input.profile === "photocatalytic_aminoaryl";
  const boost = photo ? 1.12 : 0.96;
  const wA = biasWeight(input.scoringBias, "photo_first");
  const wS = biasWeight(input.scoringBias, "assay_first");
  const wB = biasWeight(input.scoringBias, "copper_first");
  const avgBias = (wA + wS + (2 - wB)) / 3;
  const burden = routeBurden(
    input.copperYield,
    input.cyclopropaneStrain,
    input.overclaimRisk,
  );

  const photoYieldScore = round2(
    clamp(
      (input.photoYield * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.routeFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (photo ? 8 : 0) -
        input.overclaimRisk * (photo ? 6 : 14) -
        (input.scoringBias === "copper_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const copperYieldScore = round2(
    clamp(
      input.copperYield * 35 * (photo ? 0.7 : 1.1) +
        input.catalystFidelity * 25 * wB +
        (1 - input.photoYield) * 20 +
        (photo ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const catalystCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wS +
        input.photoYield * 30 +
        input.routeFollowThrough * 15 +
        (photo ? 8 : 0) -
        input.cyclopropaneStrain * 18 -
        (input.scoringBias === "copper_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const routeEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.routeFollowThrough * 25 +
        input.catalystFidelity * 20) *
        boost *
        wS +
        (photo ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const strainPenalty = round2(
    clamp(
      (input.scoringBias === "copper_first" ? 40 : 18) * boost +
        input.cyclopropaneStrain * 28 +
        burden * 12 -
        input.photoYield * 12 +
        (1 - input.routeFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.photoYield * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.cyclopropaneStrain * 12 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const photoContribution = round2(
    clamp(
      photoYieldScore * 0.32 +
        catalystCoverage * 0.28 +
        routeEfficiency * 0.22 +
        (100 - strainPenalty) * 0.18,
      0,
      100,
    ),
  );
  const copperContribution = round2(
    clamp(
      photoYieldScore * 0.35 +
        copperYieldScore * 0.35 +
        routeEfficiency * 0.2 +
        strainPenalty * 0.1 -
        input.photoYield * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      photoContribution * (photo ? 0.82 : 0.4) +
        copperContribution * (photo ? 0.18 : 0.6) +
        (photo ? 4 : 0) -
        (input.scoringBias === "copper_first" && photo ? 3 : 0) -
        input.cyclopropaneStrain * (photo ? 4 : 10),
      0,
      100,
    ),
  );

  return {
    mode: "photocatalytic_aminoaryl",
    photoYieldScore,
    copperYieldScore,
    catalystCoverage,
    routeEfficiency,
    strainPenalty,
    confidence,
    photoContribution,
    copperContribution,
    overall,
  };
}

/**
 * Copper-catalyzed aminoarylation scorer (path B):
 * rewards copper-catalyzed familiarity and underweights photocatalytic
 * yield — and can look competitive when cyclopropane strain hides
 * incomplete photo coverage that light-driven routes would need.
 */
export function scoreCopperCatalyzedAminoaryl(
  input: AminoarylInput,
): AminoarylQuality {
  const copper = input.profile === "copper_catalyzed_aminoaryl";
  const boost = copper ? 1.08 : 0.92;
  const wB = biasWeight(input.scoringBias, "copper_first");
  const wS = biasWeight(input.scoringBias, "assay_first");
  const burden = routeBurden(
    input.copperYield,
    input.cyclopropaneStrain,
    input.overclaimRisk,
  );

  const photoYieldScore = round2(
    clamp(
      (1 - input.copperYield) * 28 * boost +
        input.cyclopropaneStrain * 22 * boost +
        (wB + wS) * 5 -
        input.photoYield * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "photo_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const copperYieldScore = round2(
    clamp(
      input.copperYield * 20 * boost +
        input.cyclopropaneStrain * 35 * boost * Math.max(wB, wS) +
        (1 - burden) * 15 +
        (copper ? 8 : 0) -
        input.photoYield * 8,
      0,
      100,
    ),
  );
  const catalystCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        input.cyclopropaneStrain * 25 -
        input.photoYield * 12 +
        (copper ? 5 : 0),
      0,
      100,
    ),
  );
  const routeEfficiency = round2(
    clamp(
      input.cyclopropaneStrain * 35 * boost * Math.max(wB, wS) +
        input.assayReadout * 25 +
        (copper ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const strainPenalty = round2(
    clamp(
      (1 - input.photoYield) * 25 * boost +
        burden * 12 -
        input.cyclopropaneStrain * (copper ? 4 : 10) -
        input.routeFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.cyclopropaneStrain + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const photoContribution = round2(
    clamp(
      photoYieldScore * 0.2 +
        copperYieldScore * 0.2 +
        catalystCoverage * 0.2 +
        (100 - strainPenalty) * 0.2 +
        routeEfficiency * 0.2,
      0,
      100,
    ),
  );
  const copperContribution = round2(
    clamp(
      photoYieldScore * 0.45 +
        copperYieldScore * 0.35 +
        routeEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      copperContribution * (copper ? 0.78 : 0.5) +
        photoContribution * (copper ? 0.22 : 0.5) -
        input.photoYield * 5 -
        input.overclaimRisk * 6 +
        input.cyclopropaneStrain * 8,
      0,
      100,
    ),
  );

  return {
    mode: "copper_catalyzed_aminoaryl",
    photoYieldScore,
    copperYieldScore,
    catalystCoverage,
    routeEfficiency,
    strainPenalty,
    confidence,
    photoContribution,
    copperContribution,
    overall,
  };
}
