import {
  type SynthesisInput,
  type SynthesisQuality,
  clamp,
  round2,
} from "./types";

function planSignal(input: SynthesisInput): number {
  return clamp(
    input.questionClarity * 32 +
      input.searchBreadth * 26 +
      input.inclusionStrictness * 18 +
      input.duplicateControl * 14 +
      Math.min(100, input.studyCount) * 0.1,
    0,
    100,
  );
}

function extractSignal(input: SynthesisInput): number {
  return clamp(
    input.extractionCompleteness * 38 +
      input.effectPrecision * 28 +
      input.biasAssessment * 20 +
      input.poolingQuality * 10,
    0,
    100,
  );
}

/**
 * Agentic synthesis plan (good path).
 * Full pipeline: question → search → screen → extract → pool + heterogeneity.
 */
export function scoreAgentic(input: SynthesisInput): SynthesisQuality {
  const rigorous = input.profile === "rigorous";
  const boost = rigorous ? 1.05 : 1.0;
  const plan = planSignal(input);
  const extract = extractSignal(input);

  const planQuality = round2(
    clamp(
      (plan * 0.55 +
        input.questionClarity * 22 +
        input.searchBreadth * 16) *
        boost -
        (1 - input.duplicateControl) * 6,
      0,
      100,
    ),
  );

  const screenCoverage = round2(
    clamp(
      (input.screenDiscipline * 42 +
        input.inclusionStrictness * 28 +
        input.duplicateControl * 18 +
        Math.min(100, input.studyCount) * 0.12) *
        boost,
      0,
      100,
    ),
  );

  const extractionFidelity = round2(
    clamp(
      (extract * 0.5 +
        input.extractionCompleteness * 28 +
        input.effectPrecision * 16) *
        boost -
        (1 - input.biasAssessment) * 5,
      0,
      100,
    ),
  );

  const heterogeneityScore = round2(
    clamp(
      (input.heterogeneityAware * 48 +
        input.poolingQuality * 26 +
        input.effectPrecision * 14 +
        Math.min(100, input.studyCount) * 0.1) *
        boost,
      0,
      100,
    ),
  );

  const pooledConfidence = round2(
    clamp(
      extractionFidelity * 0.28 +
        screenCoverage * 0.22 +
        heterogeneityScore * 0.24 +
        input.effectPrecision * 18 +
        input.poolingQuality * 12 -
        (rigorous ? 0 : 2),
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.screenDiscipline * 22 +
        input.biasAssessment * 20 +
        input.heterogeneityAware * 18 +
        input.duplicateControl * 14 +
        Math.min(100, input.studyCount) * 0.16 +
        (rigorous ? 6 : 3),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      planQuality * 0.18 +
        screenCoverage * 0.2 +
        extractionFidelity * 0.16 +
        pooledConfidence * 0.2 +
        heterogeneityScore * 0.16 +
        auditTrail * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "agentic",
    planQuality,
    screenCoverage,
    extractionFidelity,
    pooledConfidence,
    heterogeneityScore,
    auditTrail,
    overall,
  };
}

/**
 * Ad-hoc single-pass baseline — skips screen discipline and heterogeneity.
 * Faster path, weaker evidence trail and pooled confidence.
 */
export function scoreAdhoc(input: SynthesisInput): SynthesisQuality {
  const rigorous = input.profile === "rigorous";
  const skipPenalty = clamp(
    0.4 +
      (1 - input.screenDiscipline) * 0.25 +
      (1 - input.heterogeneityAware) * 0.25,
    0.35,
    0.95,
  );

  const planQuality = round2(
    clamp(
      38 +
        input.questionClarity * 22 +
        input.searchBreadth * 14 -
        skipPenalty * 8 +
        (rigorous ? 2 : 0),
      0,
      72,
    ),
  );

  const screenCoverage = round2(
    clamp(
      18 +
        input.screenDiscipline * 10 +
        input.inclusionStrictness * 8 -
        skipPenalty * 22 -
        (1 - input.duplicateControl) * 8,
      0,
      42,
    ),
  );

  const extractionFidelity = round2(
    clamp(
      44 +
        input.extractionCompleteness * 24 +
        input.effectPrecision * 12 -
        skipPenalty * 6 +
        (rigorous ? 3 : 0),
      0,
      78,
    ),
  );

  const heterogeneityScore = round2(
    clamp(
      8 +
        input.heterogeneityAware * 6 +
        input.poolingQuality * 8 -
        skipPenalty * 18,
      0,
      28,
    ),
  );

  const pooledConfidence = round2(
    clamp(
      32 +
        extractionFidelity * 0.28 +
        input.effectPrecision * 14 -
        skipPenalty * 14 -
        (100 - screenCoverage) * 0.08,
      0,
      68,
    ),
  );

  const auditTrail = round2(
    clamp(
      22 +
        input.biasAssessment * 10 +
        input.duplicateControl * 8 -
        skipPenalty * 12 +
        (rigorous ? 2 : 0),
      0,
      48,
    ),
  );

  const overall = round2(
    clamp(
      planQuality * 0.2 +
        screenCoverage * 0.14 +
        extractionFidelity * 0.2 +
        pooledConfidence * 0.22 +
        heterogeneityScore * 0.1 +
        auditTrail * 0.14,
      0,
      100,
    ),
  );

  return {
    mode: "adhoc",
    planQuality,
    screenCoverage,
    extractionFidelity,
    pooledConfidence,
    heterogeneityScore,
    auditTrail,
    overall,
  };
}
