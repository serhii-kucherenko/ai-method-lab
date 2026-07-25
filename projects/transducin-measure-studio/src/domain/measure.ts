import {
  type MeasureInput,
  type MeasureQuality,
  biasWeight,
  clamp,
  formatLoad,
  round2,
} from "./types";

/**
 * SNOMED-CT coded OCT recovery scorer (good path A):
 * rewards measure coverage, parse fidelity, SNOMED clarity, export stability.
 */
export function scoreSnomedCodedOctRecovery(
  input: MeasureInput,
): MeasureQuality {
  const only = input.profile === "snomed_coded_oct_recovery";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.measureBias, "snomed_first");
  const wE = biasWeight(input.measureBias, "export_first");
  const wP = biasWeight(input.measureBias, "private_tag_first");
  const avgBias = (wS + wE + wP) / 3;
  const load = formatLoad(input.formatHardness, input.measureCoverage);

  const measureCoverageScore = round2(
    clamp(
      (input.measureCoverage * 55 +
        input.parseFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.measureBias === "private_tag_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const parseScore = round2(
    clamp(
      input.parseFidelity * 60 * boost +
        input.measureCoverage * 25 +
        (only ? 8 : 0) -
        input.privateTagOptimism * (only ? 4 : 16) -
        (input.measureBias === "private_tag_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const snomedScore = round2(
    clamp(
      input.snomedClarity * 58 * boost * wS +
        input.measureCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const exportIntegrity = round2(
    clamp(
      input.exportStability * 50 * boost * wE +
        input.parseFidelity * 25 +
        input.measureCoverage * 15 +
        (only ? 8 : 0) -
        (input.measureBias === "private_tag_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const privateTagBaselineScore = round2(
    clamp(
      input.privateTagRate * 55 * boost +
        input.privateTagOptimism * 20 -
        input.formatHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.measureCoverage * 40 +
        input.parseFidelity * 30 +
        input.snomedClarity * 25 -
        input.privateTagOptimism * 15,
      0,
      100,
    ),
  );
  const snomedCodedContribution = round2(
    clamp(
      measureCoverageScore * 0.26 +
        parseScore * 0.24 +
        snomedScore * 0.28 +
        exportIntegrity * 0.22,
      0,
      100,
    ),
  );
  const privateTagContribution = round2(
    clamp(
      privateTagBaselineScore * 0.7 +
        input.privateTagRate * 20 +
        input.privateTagOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      snomedCodedContribution * (only ? 0.82 : 0.4) +
        privateTagContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.measureBias === "private_tag_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "snomed_coded_oct_recovery",
    measureCoverageScore,
    parseScore,
    snomedScore,
    exportIntegrity,
    privateTagBaselineScore,
    confidence,
    snomedCodedContribution,
    privateTagContribution,
    overall,
  };
}

/**
 * Raw private-tag dump baseline (path B):
 * rewards ungated private-tag pass-rate + optimism, weak on SNOMED honesty.
 */
export function scoreRawPrivateTagBaseline(
  input: MeasureInput,
): MeasureQuality {
  const baseline = input.profile === "raw_private_tag_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wP = biasWeight(input.measureBias, "private_tag_first");
  const load = formatLoad(input.formatHardness, input.measureCoverage);

  const measureCoverageScore = round2(
    clamp(
      input.privateTagRate * 35 * boost +
        wP * 10 -
        input.formatHardness * 22 -
        input.overclaimRisk * 12 -
        (input.measureBias === "snomed_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const parseScore = round2(
    clamp(
      input.privateTagOptimism * 40 * boost +
        input.privateTagRate * 25 -
        load * 15 -
        input.measureCoverage * 8,
      0,
      100,
    ),
  );
  const snomedScore = round2(
    clamp(
      input.privateTagOptimism * 38 * boost +
        input.privateTagRate * 20 -
        input.snomedClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const exportIntegrity = round2(
    clamp(
      input.privateTagRate * 42 * boost +
        input.privateTagOptimism * 28 -
        input.measureCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const privateTagBaselineScore = round2(
    clamp(
      input.privateTagRate * 58 * boost * wP +
        input.privateTagOptimism * 32 -
        input.formatHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.privateTagOptimism * 45 +
        input.privateTagRate * 35 -
        input.formatHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const snomedCodedContribution = round2(
    clamp(
      measureCoverageScore * 0.2 +
        parseScore * 0.2 +
        snomedScore * 0.2 +
        exportIntegrity * 0.2 +
        privateTagBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const privateTagContribution = round2(
    clamp(
      privateTagBaselineScore * 0.55 +
        input.privateTagOptimism * 30 +
        input.privateTagRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      privateTagContribution * (baseline ? 0.78 : 0.5) +
        snomedCodedContribution * (baseline ? 0.22 : 0.5) -
        input.formatHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "raw_private_tag_baseline",
    measureCoverageScore,
    parseScore,
    snomedScore,
    exportIntegrity,
    privateTagBaselineScore,
    confidence,
    snomedCodedContribution,
    privateTagContribution,
    overall,
  };
}
