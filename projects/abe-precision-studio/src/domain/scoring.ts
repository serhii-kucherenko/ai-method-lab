import {
  type AbePrecisionInput,
  type AbePrecisionQuality,
  biasWeight,
  editBurden,
  clamp,
  round2,
} from "./types";

/**
 * Domain-insertion ABE scorer (path A):
 * rewards window narrowing, insertion completeness, and assay readout
 * when the domain-insertion profile is configured — without claiming
 * wet-lab validation, IND/NDA readiness, patient dosing, or clinical advice.
 */
export function scoreDomainInsertionAbe(
  input: AbePrecisionInput,
): AbePrecisionQuality {
  const insertion = input.profile === "domain_insertion_abe";
  const boost = insertion ? 1.12 : 0.96;
  const wI = biasWeight(input.scoringBias, "insertion_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const wB = biasWeight(input.scoringBias, "baseline_first");
  const avgBias = (wI + wA + (2 - wB)) / 3;
  const burden = editBurden(
    input.baselineWindowBreadth,
    input.insertionCompleteness,
    input.overclaimRisk,
  );

  const insertionPrecisionScore = round2(
    clamp(
      (input.windowNarrowing * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.editorFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (insertion ? 8 : 0) -
        input.overclaimRisk * (insertion ? 6 : 14) -
        (input.scoringBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineWindowBreadth * 35 * (insertion ? 0.7 : 1.1) +
        input.assayFidelity * 25 * wB +
        (1 - input.windowNarrowing) * 20 +
        (insertion ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const insertionCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wA +
        input.windowNarrowing * 30 +
        input.editorFollowThrough * 15 +
        (insertion ? 8 : 0) -
        (input.scoringBias === "baseline_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const editorEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.editorFollowThrough * 25 +
        input.assayFidelity * 20) *
        boost *
        wA +
        (insertion ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const baselineOnlyPenalty = round2(
    clamp(
      (input.scoringBias === "baseline_first" ? 40 : 18) * boost +
        burden * 18 -
        input.windowNarrowing * 12 +
        (1 - input.editorFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.windowNarrowing * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const insertionContribution = round2(
    clamp(
      insertionPrecisionScore * 0.32 +
        insertionCoverage * 0.28 +
        editorEfficiency * 0.22 +
        (100 - baselineOnlyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      insertionPrecisionScore * 0.35 +
        baselineScore * 0.35 +
        editorEfficiency * 0.2 +
        baselineOnlyPenalty * 0.1 -
        input.windowNarrowing * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      insertionContribution * (insertion ? 0.82 : 0.4) +
        baselineContribution * (insertion ? 0.18 : 0.6) +
        (insertion ? 4 : 0) -
        (input.scoringBias === "baseline_first" && insertion ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "domain_insertion_abe",
    insertionPrecisionScore,
    baselineScore,
    insertionCoverage,
    editorEfficiency,
    baselineOnlyPenalty,
    confidence,
    insertionContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Baseline ABE scorer (path B):
 * rewards baseline window familiarity and underweights domain-insertion gains.
 */
export function scoreBaselineAbe(
  input: AbePrecisionInput,
): AbePrecisionQuality {
  const baseline = input.profile === "baseline_abe";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.scoringBias, "baseline_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const burden = editBurden(
    input.baselineWindowBreadth,
    input.insertionCompleteness,
    input.overclaimRisk,
  );

  const insertionPrecisionScore = round2(
    clamp(
      (1 - input.baselineWindowBreadth) * 28 * boost +
        (1 - input.windowNarrowing) * 15 * boost +
        (wB + wA) * 5 -
        input.windowNarrowing * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "insertion_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineWindowBreadth * 45 * boost * Math.max(wB, wA) +
        (1 - burden) * 20 +
        (baseline ? 8 : 0) -
        input.windowNarrowing * 8,
      0,
      100,
    ),
  );
  const insertionCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        (1 - input.windowNarrowing) * 25 -
        input.windowNarrowing * 12 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const editorEfficiency = round2(
    clamp(
      input.baselineWindowBreadth * 35 * boost * Math.max(wB, wA) +
        input.assayReadout * 25 +
        (baseline ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const baselineOnlyPenalty = round2(
    clamp(
      (1 - input.insertionCompleteness) * 25 * boost +
        burden * 12 -
        input.windowNarrowing * (baseline ? 4 : 10) -
        input.editorFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.baselineWindowBreadth + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const insertionContribution = round2(
    clamp(
      insertionPrecisionScore * 0.2 +
        baselineScore * 0.2 +
        insertionCoverage * 0.2 +
        (100 - baselineOnlyPenalty) * 0.2 +
        editorEfficiency * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      insertionPrecisionScore * 0.45 +
        baselineScore * 0.35 +
        editorEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        insertionContribution * (baseline ? 0.22 : 0.5) -
        input.windowNarrowing * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "baseline_abe",
    insertionPrecisionScore,
    baselineScore,
    insertionCoverage,
    editorEfficiency,
    baselineOnlyPenalty,
    confidence,
    insertionContribution,
    baselineContribution,
    overall,
  };
}
