import {
  type BloodLossInput,
  type BloodLossQuality,
  biasWeight,
  clamp,
  measurementBurden,
  round2,
} from "./types";

/**
 * Weighed-swab measured blood-loss scorer (path A):
 * rewards swab/pad mass fidelity, method completeness, and assay readout
 * when the weighed-swab profile is configured — without claiming
 * live clinical advice, EMR write-back, or device clearance.
 */
export function scoreWeighedSwabMeasured(
  input: BloodLossInput,
): BloodLossQuality {
  const measured = input.profile === "weighed_swab_measured";
  const boost = measured ? 1.12 : 0.96;
  const wS = biasWeight(input.scoringBias, "swab_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const wH = biasWeight(input.scoringBias, "hb_first");
  const avgBias = (wS + wA + (2 - wH)) / 3;
  const burden = measurementBurden(
    input.hbDeltaCoverage,
    input.methodCompleteness,
    input.overclaimRisk,
  );

  const measuredLossScore = round2(
    clamp(
      (input.swabMassFidelity * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.birthFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (measured ? 8 : 0) -
        input.overclaimRisk * (measured ? 6 : 14) -
        (input.scoringBias === "hb_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const calculatedLossScore = round2(
    clamp(
      input.hbDeltaCoverage * 35 * (measured ? 0.7 : 1.1) +
        input.assayFidelity * 25 * wH +
        (1 - input.swabMassFidelity) * 20 +
        (measured ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const methodCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wA +
        input.swabMassFidelity * 30 +
        input.birthFollowThrough * 15 +
        (measured ? 8 : 0) -
        (input.scoringBias === "hb_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const birthEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.birthFollowThrough * 25 +
        input.assayFidelity * 20) *
        boost *
        wA +
        (measured ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const calculatedOnlyPenalty = round2(
    clamp(
      (input.scoringBias === "hb_first" ? 40 : 18) * boost +
        burden * 18 -
        input.swabMassFidelity * 12 +
        (1 - input.birthFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.swabMassFidelity * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const measuredContribution = round2(
    clamp(
      measuredLossScore * 0.32 +
        methodCoverage * 0.28 +
        birthEfficiency * 0.22 +
        (100 - calculatedOnlyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const calculatedContribution = round2(
    clamp(
      measuredLossScore * 0.35 +
        calculatedLossScore * 0.35 +
        birthEfficiency * 0.2 +
        calculatedOnlyPenalty * 0.1 -
        input.swabMassFidelity * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      measuredContribution * (measured ? 0.82 : 0.4) +
        calculatedContribution * (measured ? 0.18 : 0.6) +
        (measured ? 4 : 0) -
        (input.scoringBias === "hb_first" && measured ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "weighed_swab_measured",
    measuredLossScore,
    calculatedLossScore,
    methodCoverage,
    birthEfficiency,
    calculatedOnlyPenalty,
    confidence,
    measuredContribution,
    calculatedContribution,
    overall,
  };
}

/**
 * Haemoglobin-calculated blood-loss scorer (path B):
 * rewards HB-delta familiarity and underweights weighed-swab gains.
 */
export function scoreHaemoglobinCalculated(
  input: BloodLossInput,
): BloodLossQuality {
  const calculated = input.profile === "haemoglobin_calculated";
  const boost = calculated ? 1.08 : 0.92;
  const wH = biasWeight(input.scoringBias, "hb_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const burden = measurementBurden(
    input.hbDeltaCoverage,
    input.methodCompleteness,
    input.overclaimRisk,
  );

  const measuredLossScore = round2(
    clamp(
      (1 - input.hbDeltaCoverage) * 28 * boost +
        (1 - input.swabMassFidelity) * 15 * boost +
        (wH + wA) * 5 -
        input.swabMassFidelity * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "swab_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const calculatedLossScore = round2(
    clamp(
      input.hbDeltaCoverage * 45 * boost * Math.max(wH, wA) +
        (1 - burden) * 20 +
        (calculated ? 8 : 0) -
        input.swabMassFidelity * 8,
      0,
      100,
    ),
  );
  const methodCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        (1 - input.swabMassFidelity) * 25 -
        input.swabMassFidelity * 12 +
        (calculated ? 5 : 0),
      0,
      100,
    ),
  );
  const birthEfficiency = round2(
    clamp(
      input.hbDeltaCoverage * 35 * boost * Math.max(wH, wA) +
        input.assayReadout * 25 +
        (calculated ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const calculatedOnlyPenalty = round2(
    clamp(
      (1 - input.methodCompleteness) * 25 * boost +
        burden * 12 -
        input.swabMassFidelity * (calculated ? 4 : 10) -
        input.birthFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.hbDeltaCoverage + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const measuredContribution = round2(
    clamp(
      measuredLossScore * 0.2 +
        calculatedLossScore * 0.2 +
        methodCoverage * 0.2 +
        (100 - calculatedOnlyPenalty) * 0.2 +
        birthEfficiency * 0.2,
      0,
      100,
    ),
  );
  const calculatedContribution = round2(
    clamp(
      measuredLossScore * 0.45 +
        calculatedLossScore * 0.35 +
        birthEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      calculatedContribution * (calculated ? 0.78 : 0.5) +
        measuredContribution * (calculated ? 0.22 : 0.5) -
        input.swabMassFidelity * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "haemoglobin_calculated",
    measuredLossScore,
    calculatedLossScore,
    methodCoverage,
    birthEfficiency,
    calculatedOnlyPenalty,
    confidence,
    measuredContribution,
    calculatedContribution,
    overall,
  };
}
