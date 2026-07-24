/**
 * Dual-impl twin of score.ts — must stay bitwise-equal on goldens.
 */
import {
  type CardiacInput,
  type CardiacQuality,
  clamp,
  round2,
} from "./types";

function studyBoost(kind: CardiacInput["studyKind"]): number {
  switch (kind) {
    case "ccta":
      return 1.06;
    case "cac":
      return 1.02;
    case "morphology":
      return 1.04;
    case "functional":
      return 1.03;
    case "mixed":
      return 1.05;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function imagingSignal(input: CardiacInput): number {
  return clamp(
    50 +
      input.contrastQuality * 18 +
      input.sliceQuality * 14 +
      input.vesselClarity * 12 +
      input.chamberGeometry * 10 +
      input.calciumSignal * 8 -
      input.motionArtifact * 22,
    0,
    100,
  );
}

function coverageSignal(input: CardiacInput): number {
  return clamp(
    input.structureCoverage * 36 +
      input.expertAnnotationCoverage * 28 +
      input.foundationPrior * 18 +
      input.phenotypeRichness * 16 -
      input.motionArtifact * 12,
    0,
    100,
  );
}

export function scoreHitlFoundation(input: CardiacInput): CardiacQuality {
  const hitl = input.plan === "hitl_foundation";
  const boost = (hitl ? 1.12 : 0.94) * studyBoost(input.studyKind);
  const imaging = imagingSignal(input);
  const coverage = coverageSignal(input);

  const segmentationQuality = round2(
    clamp(
      (imaging * 0.48 +
        input.structureCoverage * 22 +
        input.foundationPrior * 14 +
        input.sliceQuality * 10) *
        boost,
      0,
      100,
    ),
  );

  const hitlIntegrity = round2(
    clamp(
      (input.expertAnnotationCoverage * 44 +
        coverage * 0.28 +
        (1 - input.motionArtifact) * 16 +
        (hitl ? 18 : 2)) *
        boost -
        (hitl ? 0 : (1 - input.expertAnnotationCoverage) * 28),
      0,
      100,
    ),
  );

  const phenotypeConfidence = round2(
    clamp(
      (input.phenotypeRichness * 30 +
        input.foundationPrior * 24 +
        hitlIntegrity * 0.28 +
        input.chamberGeometry * 12 +
        (hitl ? 14 : 2) -
        input.motionArtifact * (hitl ? 6 : 24)) *
        boost,
      0,
      100,
    ),
  );

  const structureCompleteness = round2(
    clamp(
      (input.structureCoverage * 38 +
        imaging * 0.28 +
        input.vesselClarity * 14 +
        input.calciumSignal * 10) *
        boost,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.foundationPrior * 28 +
        phenotypeConfidence * 0.3 +
        hitlIntegrity * 0.24 +
        (hitl ? 14 : 0) -
        input.motionArtifact * (hitl ? 8 : 28)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      segmentationQuality * 0.2 +
        hitlIntegrity * 0.24 +
        phenotypeConfidence * 0.22 +
        structureCompleteness * 0.16 +
        planCoherence * 0.18,
      0,
      100,
    ),
  );

  return {
    mode: "hitl_foundation",
    segmentationQuality,
    hitlIntegrity,
    phenotypeConfidence,
    structureCompleteness,
    planCoherence,
    overall,
  };
}

export function scoreAutoOnly(input: CardiacInput): CardiacQuality {
  const autoBias = clamp(
    0.46 +
      input.foundationPrior * 0.18 +
      (1 - input.expertAnnotationCoverage) * 0.2 +
      input.structureCoverage * 0.14,
    0.32,
    0.94,
  );
  const imaging = imagingSignal(input);
  const coverage = coverageSignal(input);
  const pretendedCoverage = clamp(
    input.structureCoverage + (1 - input.expertAnnotationCoverage) * 0.45,
    0,
    1,
  );

  const segmentationQuality = round2(
    clamp(
      (imaging * 0.44 + pretendedCoverage * 22 + input.sliceQuality * 12) *
        autoBias,
      0,
      100,
    ),
  );

  const hitlIntegrity = round2(
    clamp(
      (input.expertAnnotationCoverage * 10 +
        coverage * 0.1 +
        (1 - input.motionArtifact) * 6) *
        autoBias -
        (1 - input.expertAnnotationCoverage) * 36,
      0,
      100,
    ),
  );

  const phenotypeConfidence = round2(
    clamp(
      (input.phenotypeRichness * 14 + input.foundationPrior * 12) * autoBias -
        (1 - input.expertAnnotationCoverage) * 30 -
        8,
      0,
      100,
    ),
  );

  const structureCompleteness = round2(
    clamp(
      (imaging * 0.4 + pretendedCoverage * 26 + input.vesselClarity * 10) *
        autoBias,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.foundationPrior * 16 + structureCompleteness * 0.12) * autoBias -
        (1 - input.expertAnnotationCoverage) * 32 -
        input.motionArtifact * 16,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      segmentationQuality * 0.3 +
        hitlIntegrity * 0.1 +
        phenotypeConfidence * 0.12 +
        structureCompleteness * 0.28 +
        planCoherence * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "auto_only",
    segmentationQuality,
    hitlIntegrity,
    phenotypeConfidence,
    structureCompleteness,
    planCoherence,
    overall,
  };
}
