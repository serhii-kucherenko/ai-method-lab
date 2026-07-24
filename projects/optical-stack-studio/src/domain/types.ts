export type BandKind =
  | "visible"
  | "nir"
  | "uv"
  | "broadband"
  | "narrowband";

export type PlanKind = "open_vocab" | "catalog_only";

export type ScoreMode = "open_vocab" | "catalog_only";

/**
 * Soft-simulation inputs for open-vocabulary multilayer coating inverse design.
 * Method-lab model only — not live fab or spectrometer hardware.
 */
export type OpticalInput = {
  /** Free-form brief clarity / goal specificity (0–1). */
  briefClarity: number;
  /** Discrete material sequence richness outside fixed catalogs (0–1). */
  materialDiversity: number;
  /** Continuous thickness plan fidelity (0–1). */
  thicknessContinuity: number;
  /** Layer ordering / stack coherence (0–1). */
  stackCoherence: number;
  /** Predicted spectrum fit to brief goal (0–1). */
  spectrumFit: number;
  /** Angle-of-incidence robustness (0–1). */
  angleTolerance: number;
  /** Absorption / scattering loss (0–1, higher = worse). */
  absorptionLoss: number;
  /** Fabrication feasibility of thicknesses (0–1). */
  fabricationFeasibility: number;
  /** Fixed-catalog material coverage (0–1). */
  catalogCoverage: number;
  /** Spec noise / measurement uncertainty (0–1, higher = worse). */
  noiseLevel: number;
  bandKind: BandKind;
  plan: PlanKind;
};

export type OpticalQuality = {
  mode: ScoreMode;
  briefFidelity: number;
  materialSequenceQuality: number;
  thicknessPlanQuality: number;
  spectrumMatch: number;
  planCoherence: number;
  overall: number;
};

export type StackReadiness = {
  briefReady: boolean;
  materialsReady: boolean;
  thicknessesReady: boolean;
  spectrumReady: boolean;
  overallReady: boolean;
  catalogOnlyPenalty: number;
  openVocabGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: OpticalQuality,
  input: OpticalInput,
): StackReadiness {
  const catalogOnlyPenalty = round2(
    input.plan === "catalog_only"
      ? (1 - input.briefClarity) * 28 + (1 - input.materialDiversity) * 18
      : (1 - input.briefClarity) * 6,
  );
  const openVocabGap = round2(Math.max(0, 70 - quality.briefFidelity));
  const briefReady =
    quality.briefFidelity >= 48 + input.briefClarity * 22;
  const materialsReady =
    quality.materialSequenceQuality >=
    50 + input.materialDiversity * 22;
  const thicknessesReady =
    quality.thicknessPlanQuality >=
    48 + input.thicknessContinuity * 20;
  const spectrumReady =
    quality.spectrumMatch >= 46 + input.spectrumFit * 18;
  return {
    briefReady,
    materialsReady,
    thicknessesReady,
    spectrumReady,
    overallReady:
      briefReady && materialsReady && thicknessesReady && spectrumReady,
    catalogOnlyPenalty,
    openVocabGap,
  };
}
