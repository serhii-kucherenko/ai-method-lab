import {
  type TubuleMpsInput,
  type TubuleMpsQuality,
  biasWeight,
  mitoBurden,
  clamp,
  round2,
} from "./types";

/**
 * Voclosporin MPS scorer (path A):
 * rewards mitochondrial preservation under perfusion and penalizes
 * 2D masking that would hide cyclosporine harm — without claiming
 * wet-lab MPS validation, transplant dosing, IND/NDA readiness,
 * or live patient care.
 */
export function scoreVoclosporinMps(input: TubuleMpsInput): TubuleMpsQuality {
  const voc = input.profile === "voclosporin_mps";
  const boost = voc ? 1.12 : 0.96;
  const wM = biasWeight(input.scoringBias, "mps_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const wC = biasWeight(input.scoringBias, "cyclosporine_first");
  const avgBias = (wM + wA + (2 - wC)) / 3;
  const burden = mitoBurden(
    input.cyclosporineHarm,
    input.culture2dMasking,
    input.overclaimRisk,
  );

  const mitochondrialPreservationScore = round2(
    clamp(
      (input.mpsPreservation * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.regimenFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (voc ? 8 : 0) -
        input.overclaimRisk * (voc ? 6 : 14) -
        (input.scoringBias === "cyclosporine_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const cyclosporineBaselineScore = round2(
    clamp(
      input.cyclosporineHarm * 35 * (voc ? 0.7 : 1.1) +
        input.perfusionFidelity * 25 * wC +
        (1 - input.mpsPreservation) * 20 +
        (voc ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const mpsCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wA +
        input.mpsPreservation * 30 +
        input.regimenFollowThrough * 15 +
        (voc ? 8 : 0) -
        input.culture2dMasking * 18 -
        (input.scoringBias === "cyclosporine_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const regimenEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.regimenFollowThrough * 25 +
        input.perfusionFidelity * 20) *
        boost *
        wA +
        (voc ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const culture2dMaskPenalty = round2(
    clamp(
      (input.scoringBias === "cyclosporine_first" ? 40 : 18) * boost +
        input.culture2dMasking * 28 +
        burden * 12 -
        input.mpsPreservation * 12 +
        (1 - input.regimenFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.mpsPreservation * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.culture2dMasking * 12 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const voclosporinContribution = round2(
    clamp(
      mitochondrialPreservationScore * 0.32 +
        mpsCoverage * 0.28 +
        regimenEfficiency * 0.22 +
        (100 - culture2dMaskPenalty) * 0.18,
      0,
      100,
    ),
  );
  const cyclosporineContribution = round2(
    clamp(
      mitochondrialPreservationScore * 0.35 +
        cyclosporineBaselineScore * 0.35 +
        regimenEfficiency * 0.2 +
        culture2dMaskPenalty * 0.1 -
        input.mpsPreservation * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      voclosporinContribution * (voc ? 0.82 : 0.4) +
        cyclosporineContribution * (voc ? 0.18 : 0.6) +
        (voc ? 4 : 0) -
        (input.scoringBias === "cyclosporine_first" && voc ? 3 : 0) -
        input.culture2dMasking * (voc ? 4 : 10),
      0,
      100,
    ),
  );

  return {
    mode: "voclosporin_mps",
    mitochondrialPreservationScore,
    cyclosporineBaselineScore,
    mpsCoverage,
    regimenEfficiency,
    culture2dMaskPenalty,
    confidence,
    voclosporinContribution,
    cyclosporineContribution,
    overall,
  };
}

/**
 * Cyclosporine MPS scorer (path B):
 * rewards cyclosporine baseline familiarity and underweights
 * voclosporin MPS preservation — and can look competitive when
 * 2D masking hides mitochondrial harm that MPS would reveal.
 */
export function scoreCyclosporineMps(input: TubuleMpsInput): TubuleMpsQuality {
  const csa = input.profile === "cyclosporine_mps";
  const boost = csa ? 1.08 : 0.92;
  const wC = biasWeight(input.scoringBias, "cyclosporine_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const burden = mitoBurden(
    input.cyclosporineHarm,
    input.culture2dMasking,
    input.overclaimRisk,
  );

  const mitochondrialPreservationScore = round2(
    clamp(
      (1 - input.cyclosporineHarm) * 28 * boost +
        input.culture2dMasking * 22 * boost +
        (wC + wA) * 5 -
        input.mpsPreservation * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "mps_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const cyclosporineBaselineScore = round2(
    clamp(
      input.cyclosporineHarm * 20 * boost +
        input.culture2dMasking * 35 * boost * Math.max(wC, wA) +
        (1 - burden) * 15 +
        (csa ? 8 : 0) -
        input.mpsPreservation * 8,
      0,
      100,
    ),
  );
  const mpsCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        input.culture2dMasking * 25 -
        input.mpsPreservation * 12 +
        (csa ? 5 : 0),
      0,
      100,
    ),
  );
  const regimenEfficiency = round2(
    clamp(
      input.culture2dMasking * 35 * boost * Math.max(wC, wA) +
        input.assayReadout * 25 +
        (csa ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const culture2dMaskPenalty = round2(
    clamp(
      (1 - input.mpsPreservation) * 25 * boost +
        burden * 12 -
        input.culture2dMasking * (csa ? 4 : 10) -
        input.regimenFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.culture2dMasking + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const voclosporinContribution = round2(
    clamp(
      mitochondrialPreservationScore * 0.2 +
        cyclosporineBaselineScore * 0.2 +
        mpsCoverage * 0.2 +
        (100 - culture2dMaskPenalty) * 0.2 +
        regimenEfficiency * 0.2,
      0,
      100,
    ),
  );
  const cyclosporineContribution = round2(
    clamp(
      mitochondrialPreservationScore * 0.45 +
        cyclosporineBaselineScore * 0.35 +
        regimenEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cyclosporineContribution * (csa ? 0.78 : 0.5) +
        voclosporinContribution * (csa ? 0.22 : 0.5) -
        input.mpsPreservation * 5 -
        input.overclaimRisk * 6 +
        input.culture2dMasking * 8,
      0,
      100,
    ),
  );

  return {
    mode: "cyclosporine_mps",
    mitochondrialPreservationScore,
    cyclosporineBaselineScore,
    mpsCoverage,
    regimenEfficiency,
    culture2dMaskPenalty,
    confidence,
    voclosporinContribution,
    cyclosporineContribution,
    overall,
  };
}
