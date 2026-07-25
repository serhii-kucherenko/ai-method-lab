export type BindProfile = "multimodal" | "single";

export type ScoreMode = "multimodal_bind" | "single_modality";

export type ModalityBias =
  | "structure"
  | "diffraction"
  | "dos"
  | "language"
  | "balanced";

/**
 * Soft-simulation inputs for multimodal bind retrieve vs single-modality baseline.
 * Method-lab embeddings only — not MatBind weights or measured wet-lab spectra.
 */
export type BindInput = {
  /** Atomic / lattice layout fidelity (0–1). */
  structureFidelity: number;
  /** Diffraction fingerprint match proxy (0–1). */
  diffractionMatch: number;
  /** Electronic density-of-states alignment (0–1). */
  dosAlignment: number;
  /** Written-spec / language descriptor clarity (0–1). */
  languageClarity: number;
  /** How tightly modalities sit in the shared bind space (0–1). */
  bindCoherence: number;
  /** Agreement across modalities after projection (0–1). */
  crossModalAgreement: number;
  /** Soft-sim retrieval precision at top-k (0–1). */
  retrievalPrecision: number;
  /** Spec / embedding noise (0–1, higher = worse). */
  noiseLevel: number;
  modalityBias: ModalityBias;
  profile: BindProfile;
};

export type BindQuality = {
  mode: ScoreMode;
  structureScore: number;
  diffractionScore: number;
  dosScore: number;
  languageScore: number;
  bindScore: number;
  retrievalScore: number;
  confidence: number;
  modalityContribution: number;
  crossModalContribution: number;
  overall: number;
};

export type BindReadiness = "hold" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): BindReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold";
}

export function biasWeight(
  bias: ModalityBias,
  lane: Exclude<ModalityBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}
