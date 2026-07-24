export type EmbedProfile = "full" | "fast";

export type EmbedMode = "multi_signal" | "vision_only";

export type TaskFit = "roi" | "multimodal" | "wsi";

/**
 * Inputs mirroring vision, vision-language, and slide-level signals
 * used in multi-signal pathology foundation eval (method-lab studio).
 */
export type EmbedInput = {
  /** Patch morphology strength from vision encoder (0–1). */
  patchMorphology: number;
  /** Local texture / stain entropy (0–1). */
  textureEntropy: number;
  /** Stain / scan quality proxy (0–1). */
  stainQuality: number;
  /** Vision–language alignment score (0–1). */
  languageAlign: number;
  /** Concept / caption match strength (0–1). */
  conceptMatch: number;
  /** Whole-slide contextual signal (0–1). */
  slideContext: number;
  /** Tissue heterogeneity across the slide (0–1). */
  tissueHeterogeneity: number;
  /** MIL / slide aggregator strength (0–100). */
  milAggregator: number;
  profile: EmbedProfile;
};

export type EmbedQuality = {
  mode: EmbedMode;
  visionScore: number;
  languageScore: number;
  slideScore: number;
  predictedTaskFit: TaskFit;
  confidence: number;
  visionContribution: number;
  languageContribution: number;
  slideContribution: number;
  overall: number;
};

export type SignalBreakdown = {
  morphology: number;
  language: number;
  slide: number;
  aggregator: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function pickTaskFit(
  vision: number,
  language: number,
  slide: number,
): TaskFit {
  if (slide >= vision && slide >= language) return "wsi";
  if (language >= vision && language >= slide) return "multimodal";
  return "roi";
}
