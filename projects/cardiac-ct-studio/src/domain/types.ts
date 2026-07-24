export type StudyKind =
  | "ccta"
  | "cac"
  | "morphology"
  | "functional"
  | "mixed";

export type PlanKind = "hitl_foundation" | "auto_only";

export type ScoreMode = "hitl_foundation" | "auto_only";

/**
 * Soft-simulation inputs for cardiac CT segmentation + phenotyping plans.
 * Method-lab model only — not clinical certification or live PACS.
 */
export type CardiacInput = {
  /** Contrast timing / enhancement quality (0–1). */
  contrastQuality: number;
  /** Motion / misregistration artifact (0–1, higher = worse). */
  motionArtifact: number;
  /** Fraction of structures touched by expert HITL (0–1). */
  expertAnnotationCoverage: number;
  /** Multi-structure segmentation coverage (0–1). */
  structureCoverage: number;
  /** Foundation-model prior strength (0–1). */
  foundationPrior: number;
  /** Phenotype feature richness (0–1). */
  phenotypeRichness: number;
  /** Slice / reconstruction quality (0–1). */
  sliceQuality: number;
  /** Coronary calcium / plaque signal clarity (0–1). */
  calciumSignal: number;
  /** Chamber geometry signal (0–1). */
  chamberGeometry: number;
  /** Vessel lumen clarity (0–1). */
  vesselClarity: number;
  studyKind: StudyKind;
  plan: PlanKind;
};

export type CardiacQuality = {
  mode: ScoreMode;
  segmentationQuality: number;
  hitlIntegrity: number;
  phenotypeConfidence: number;
  structureCompleteness: number;
  planCoherence: number;
  overall: number;
};

export type PhenotypeReadiness = {
  hitlReady: boolean;
  segmentsReady: boolean;
  phenotypeReady: boolean;
  augmentSafe: boolean;
  overallReady: boolean;
  autoOnlyPenalty: number;
  expertGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: CardiacQuality,
  input: CardiacInput,
): PhenotypeReadiness {
  const autoOnlyPenalty = round2(
    input.plan === "auto_only"
      ? (1 - input.expertAnnotationCoverage) * 32 +
          input.motionArtifact * 14
      : (1 - input.expertAnnotationCoverage) * 8,
  );
  const expertGap = round2(
    Math.max(0, 72 - quality.hitlIntegrity),
  );
  const hitlReady =
    quality.hitlIntegrity >= 50 + input.expertAnnotationCoverage * 22;
  const segmentsReady =
    quality.structureCompleteness >=
    48 + input.structureCoverage * 22;
  const phenotypeReady =
    quality.phenotypeConfidence >= 50 + input.phenotypeRichness * 18;
  const augmentSafe =
    quality.planCoherence >= 48 + (1 - input.motionArtifact) * 16;
  return {
    hitlReady,
    segmentsReady,
    phenotypeReady,
    augmentSafe,
    overallReady:
      hitlReady && segmentsReady && phenotypeReady && augmentSafe,
    autoOnlyPenalty,
    expertGap,
  };
}
