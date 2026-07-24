import {
  type EmbedInput,
  type EmbedMode,
  type EmbedQuality,
  type SignalBreakdown,
  clamp,
  round2,
  pickTaskFit,
} from "./types";

function visionBlock(input: EmbedInput): number {
  return clamp(
    input.patchMorphology * 48 +
      input.textureEntropy * 28 +
      input.stainQuality * 24,
    0,
    100,
  );
}

function languageBlock(input: EmbedInput): number {
  return clamp(
    input.languageAlign * 52 +
      input.conceptMatch * 38 +
      input.patchMorphology * 8,
    0,
    100,
  );
}

function slideBlock(input: EmbedInput): number {
  const mil = clamp(input.milAggregator / 100, 0, 1);
  return clamp(
    input.slideContext * 46 +
      input.tissueHeterogeneity * 28 +
      mil * 26,
    0,
    100,
  );
}

/**
 * Multi-signal embed score (good path):
 * blends vision morphology with vision–language alignment and slide-level context.
 */
export function scoreMultiSignal(input: EmbedInput): EmbedQuality {
  const full = input.profile === "full";
  const vision = visionBlock(input);
  const language = languageBlock(input);
  const slide = slideBlock(input);
  const boost = full ? 1.08 : 1;

  const visionContribution = round2(vision * (full ? 1.05 : 0.95));
  const languageContribution = round2(language * (full ? 1.12 : 0.9));
  const slideContribution = round2(slide * (full ? 1.1 : 0.88));

  const visionScore = round2(
    clamp(
      (vision * 0.55 + language * 0.2 + slide * 0.25) * boost +
        input.stainQuality * 4,
      0,
      100,
    ),
  );
  const languageScore = round2(
    clamp(
      (vision * 0.22 + language * 0.58 + slide * 0.2) * boost +
        input.conceptMatch * 6,
      0,
      100,
    ),
  );
  const slideScore = round2(
    clamp(
      (vision * 0.18 + language * 0.22 + slide * 0.6) * boost +
        clamp(input.milAggregator / 100, 0, 1) * 8,
      0,
      100,
    ),
  );

  const predictedTaskFit = pickTaskFit(visionScore, languageScore, slideScore);
  const ranked = [visionScore, languageScore, slideScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(ranked[0]! - ranked[1]! + (full ? 8 : 3), 0, 100),
  );
  const overall = round2(
    clamp(
      visionScore * 0.32 +
        languageScore * 0.34 +
        slideScore * 0.24 +
        confidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "multi_signal",
    visionScore,
    languageScore,
    slideScore,
    predictedTaskFit,
    confidence,
    visionContribution,
    languageContribution,
    slideContribution,
    overall,
  };
}

/** Vision-only baseline: morphology / texture / stain — no language or slide experts. */
export function scoreVisionOnly(input: EmbedInput): EmbedQuality {
  const vision = visionBlock(input);
  const visionContribution = round2(vision);
  const languageContribution = 0;
  const slideContribution = 0;

  const visionScore = round2(
    clamp(vision * 0.88 + input.stainQuality * 8, 0, 94),
  );
  const languageScore = round2(
    clamp(vision * 0.35 + input.textureEntropy * 18, 0, 72),
  );
  const slideScore = round2(
    clamp(vision * 0.42 + input.tissueHeterogeneity * 12, 0, 78),
  );

  const predictedTaskFit = pickTaskFit(visionScore, languageScore, slideScore);
  const ranked = [visionScore, languageScore, slideScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 85));
  const overall = round2(
    clamp(visionScore * 0.55 + languageScore * 0.2 + confidence * 0.25, 0, 100),
  );

  return {
    mode: "vision_only",
    visionScore,
    languageScore,
    slideScore,
    predictedTaskFit,
    confidence,
    visionContribution,
    languageContribution,
    slideContribution,
    overall,
  };
}

export function signalBreakdown(
  input: EmbedInput,
  mode: EmbedMode,
): SignalBreakdown {
  const morphology = round2(visionBlock(input));
  if (mode === "vision_only") {
    return { morphology, language: 0, slide: 0, aggregator: 0 };
  }
  const full = input.profile === "full";
  return {
    morphology,
    language: round2(languageBlock(input) * (full ? 1.08 : 0.92)),
    slide: round2(slideBlock(input) * (full ? 1.1 : 0.9)),
    aggregator: round2(
      clamp(input.milAggregator * (full ? 1.05 : 0.9), 0, 100),
    ),
  };
}
