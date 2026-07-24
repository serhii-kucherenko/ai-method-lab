export type ExamKind = "pa" | "lateral" | "ap" | "portable" | "mixed";

export type PlanKind = "classify_localize" | "classify_only";

export type ScoreMode = "classify_localize" | "classify_only";

/**
 * Soft-simulation inputs for CXR classify + lesion localize plans.
 * Method-lab model only — not clinical certification or live PACS.
 */
export type ThoraxInput = {
  /** Radiograph exposure / noise quality (0–1). */
  imageQuality: number;
  /** Projection / view clarity (0–1). */
  viewClarity: number;
  /** Multi-disease classification signal strength (0–1). */
  diseaseSignal: number;
  /** Fraction of findings with lesion localization (0–1). */
  localizationCoverage: number;
  /** PCAM-style activation map peak strength (0–1). */
  mapPeakStrength: number;
  /** Spatial coherence of lesion maps (0–1). */
  mapCoherence: number;
  /** Finding list richness / multi-label coverage (0–1). */
  findingRichness: number;
  /** Lesion boundary clarity (0–1). */
  lesionBoundaryClarity: number;
  /** Clinical validation confidence (0–1). */
  validationConfidence: number;
  /** Noise / artifact level (0–1, higher = worse). */
  noiseLevel: number;
  examKind: ExamKind;
  plan: PlanKind;
};

export type ThoraxQuality = {
  mode: ScoreMode;
  classificationQuality: number;
  localizationIntegrity: number;
  mapConfidence: number;
  findingCompleteness: number;
  planCoherence: number;
  overall: number;
};

export type LocalizeReadiness = {
  classifyReady: boolean;
  localizeReady: boolean;
  mapsReady: boolean;
  validationReady: boolean;
  overallReady: boolean;
  classifyOnlyPenalty: number;
  localizationGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: ThoraxQuality,
  input: ThoraxInput,
): LocalizeReadiness {
  const classifyOnlyPenalty = round2(
    input.plan === "classify_only"
      ? (1 - input.localizationCoverage) * 34 + input.noiseLevel * 12
      : (1 - input.localizationCoverage) * 8,
  );
  const localizationGap = round2(Math.max(0, 70 - quality.localizationIntegrity));
  const classifyReady =
    quality.classificationQuality >= 48 + input.diseaseSignal * 22;
  const localizeReady =
    quality.localizationIntegrity >= 50 + input.localizationCoverage * 22;
  const mapsReady =
    quality.mapConfidence >= 48 + input.mapPeakStrength * 20;
  const validationReady =
    quality.planCoherence >= 46 + input.validationConfidence * 18;
  return {
    classifyReady,
    localizeReady,
    mapsReady,
    validationReady,
    overallReady:
      classifyReady && localizeReady && mapsReady && validationReady,
    classifyOnlyPenalty,
    localizationGap,
  };
}
