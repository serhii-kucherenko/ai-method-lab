import {
  type PocusInput,
  type PocusQuality,
  biasWeight,
  clamp,
  imagingBurden,
  round2,
} from "./types";

/**
 * Cardiac POCUS COPD pathway scorer (path A):
 * rewards cardiac pattern signal, COPD association, and assay readout
 * when the cardiac pathway is configured — without claiming live
 * diagnostic clearance, clinical advice, or PACS write-back.
 */
export function scoreCardiacPocusCopd(input: PocusInput): PocusQuality {
  const cardiac = input.profile === "cardiac_pocus_copd";
  const boost = cardiac ? 1.12 : 0.96;
  const wC = biasWeight(input.imagingBias, "cardiac_first");
  const wP = biasWeight(input.imagingBias, "pattern_first");
  const wL = biasWeight(input.imagingBias, "lung_first");
  const avgBias = (wC + wP + (2 - wL)) / 3;
  const burden = imagingBurden(
    input.lungBaselineSignal,
    input.viewCompleteness,
    input.overclaimRisk,
  );

  const cardiacDetectionScore = round2(
    clamp(
      (input.cardiacPatternSignal * 35 +
        input.copdAssociation * 25 +
        input.assayReadout * 30 +
        input.examFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (cardiac ? 8 : 0) -
        input.overclaimRisk * (cardiac ? 6 : 14) -
        (input.imagingBias === "lung_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const lungBaselineScore = round2(
    clamp(
      input.lungBaselineSignal * 35 * (cardiac ? 0.7 : 1.1) +
        input.probeQuality * 25 * wL +
        (1 - input.cardiacPatternSignal) * 20 +
        (cardiac ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const patternCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wP +
        input.cardiacPatternSignal * 30 +
        input.examFollowThrough * 15 +
        (cardiac ? 8 : 0) -
        (input.imagingBias === "lung_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const examEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.examFollowThrough * 25 +
        input.probeQuality * 20) *
        boost *
        wP +
        (cardiac ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const lungOnlyPenalty = round2(
    clamp(
      (input.imagingBias === "lung_first" ? 40 : 18) * boost +
        burden * 18 -
        input.cardiacPatternSignal * 12 +
        (1 - input.examFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cardiacPatternSignal * 26 +
        input.copdAssociation * 22 +
        input.assayReadout * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const cardiacContribution = round2(
    clamp(
      cardiacDetectionScore * 0.32 +
        patternCoverage * 0.28 +
        examEfficiency * 0.22 +
        (100 - lungOnlyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const lungContribution = round2(
    clamp(
      cardiacDetectionScore * 0.35 +
        lungBaselineScore * 0.35 +
        examEfficiency * 0.2 +
        lungOnlyPenalty * 0.1 -
        input.cardiacPatternSignal * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cardiacContribution * (cardiac ? 0.82 : 0.4) +
        lungContribution * (cardiac ? 0.18 : 0.6) +
        (cardiac ? 4 : 0) -
        (input.imagingBias === "lung_first" && cardiac ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "cardiac_pocus_copd",
    cardiacDetectionScore,
    lungBaselineScore,
    patternCoverage,
    examEfficiency,
    lungOnlyPenalty,
    confidence,
    cardiacContribution,
    lungContribution,
    overall,
  };
}

/**
 * Lung-ultrasound baseline scorer (path B):
 * rewards lung-path familiarity and underweights cardiac pattern gains.
 */
export function scoreLungUltrasoundBaseline(input: PocusInput): PocusQuality {
  const lung = input.profile === "lung_ultrasound_baseline";
  const boost = lung ? 1.08 : 0.92;
  const wL = biasWeight(input.imagingBias, "lung_first");
  const wP = biasWeight(input.imagingBias, "pattern_first");
  const burden = imagingBurden(
    input.lungBaselineSignal,
    input.viewCompleteness,
    input.overclaimRisk,
  );

  const cardiacDetectionScore = round2(
    clamp(
      (1 - input.lungBaselineSignal) * 28 * boost +
        (1 - input.cardiacPatternSignal) * 15 * boost +
        (wL + wP) * 5 -
        input.cardiacPatternSignal * 10 -
        input.overclaimRisk * 10 -
        (input.imagingBias === "cardiac_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const lungBaselineScore = round2(
    clamp(
      input.lungBaselineSignal * 45 * boost * Math.max(wL, wP) +
        (1 - burden) * 20 +
        (lung ? 8 : 0) -
        input.cardiacPatternSignal * 8,
      0,
      100,
    ),
  );
  const patternCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        (1 - input.cardiacPatternSignal) * 25 -
        input.cardiacPatternSignal * 12 +
        (lung ? 5 : 0),
      0,
      100,
    ),
  );
  const examEfficiency = round2(
    clamp(
      input.lungBaselineSignal * 35 * boost * Math.max(wL, wP) +
        input.assayReadout * 25 +
        (lung ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const lungOnlyPenalty = round2(
    clamp(
      (1 - input.viewCompleteness) * 25 * boost +
        burden * 12 -
        input.cardiacPatternSignal * (lung ? 4 : 10) -
        input.examFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.lungBaselineSignal + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const cardiacContribution = round2(
    clamp(
      cardiacDetectionScore * 0.2 +
        lungBaselineScore * 0.2 +
        patternCoverage * 0.2 +
        (100 - lungOnlyPenalty) * 0.2 +
        examEfficiency * 0.2,
      0,
      100,
    ),
  );
  const lungContribution = round2(
    clamp(
      cardiacDetectionScore * 0.45 +
        lungBaselineScore * 0.35 +
        examEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      lungContribution * (lung ? 0.78 : 0.5) +
        cardiacContribution * (lung ? 0.22 : 0.5) -
        input.cardiacPatternSignal * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "lung_ultrasound_baseline",
    cardiacDetectionScore,
    lungBaselineScore,
    patternCoverage,
    examEfficiency,
    lungOnlyPenalty,
    confidence,
    cardiacContribution,
    lungContribution,
    overall,
  };
}
