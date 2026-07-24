import {
  type EmbedInput,
  type EmbedMode,
  type EmbedQuality,
  type SignalBreakdown,
  clamp,
  round2,
  pickTaskFit,
} from "./types";

/** Dual-impl B: independent rewrite that must match pathology.ts on goldens. */

function visionScoreRaw(input: EmbedInput): number {
  const raw =
    48 * input.patchMorphology +
    28 * input.textureEntropy +
    24 * input.stainQuality;
  return Math.max(0, Math.min(100, raw));
}

function languageScoreRaw(input: EmbedInput): number {
  const raw =
    52 * input.languageAlign +
    38 * input.conceptMatch +
    8 * input.patchMorphology;
  return Math.max(0, Math.min(100, raw));
}

function slideScoreRaw(input: EmbedInput): number {
  const milNorm = Math.max(0, Math.min(1, input.milAggregator / 100));
  const raw =
    46 * input.slideContext + 28 * input.tissueHeterogeneity + 26 * milNorm;
  return Math.max(0, Math.min(100, raw));
}

export function scoreMultiSignal(input: EmbedInput): EmbedQuality {
  const isFull = input.profile === "full";
  const v = visionScoreRaw(input);
  const l = languageScoreRaw(input);
  const s = slideScoreRaw(input);
  const boost = isFull ? 1.08 : 1;

  const visionContribution = round2(v * (isFull ? 1.05 : 0.95));
  const languageContribution = round2(l * (isFull ? 1.12 : 0.9));
  const slideContribution = round2(s * (isFull ? 1.1 : 0.88));

  const visionScore = round2(
    clamp(
      boost * (0.55 * v + 0.2 * l + 0.25 * s) + 4 * input.stainQuality,
      0,
      100,
    ),
  );
  const languageScore = round2(
    clamp(
      boost * (0.22 * v + 0.58 * l + 0.2 * s) + 6 * input.conceptMatch,
      0,
      100,
    ),
  );
  const slideScore = round2(
    clamp(
      boost * (0.18 * v + 0.22 * l + 0.6 * s) +
        8 * Math.max(0, Math.min(1, input.milAggregator / 100)),
      0,
      100,
    ),
  );

  const predictedTaskFit = pickTaskFit(visionScore, languageScore, slideScore);
  const ranked = [visionScore, languageScore, slideScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(ranked[0]! - ranked[1]! + (isFull ? 8 : 3), 0, 100),
  );
  const overall = round2(
    clamp(
      0.32 * visionScore +
        0.34 * languageScore +
        0.24 * slideScore +
        0.1 * confidence,
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

export function scoreVisionOnly(input: EmbedInput): EmbedQuality {
  const v = visionScoreRaw(input);
  const visionContribution = round2(v);
  const languageContribution = 0;
  const slideContribution = 0;

  const visionScore = round2(clamp(0.88 * v + 8 * input.stainQuality, 0, 94));
  const languageScore = round2(
    clamp(0.35 * v + 18 * input.textureEntropy, 0, 72),
  );
  const slideScore = round2(
    clamp(0.42 * v + 12 * input.tissueHeterogeneity, 0, 78),
  );

  const predictedTaskFit = pickTaskFit(visionScore, languageScore, slideScore);
  const ranked = [visionScore, languageScore, slideScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 85));
  const overall = round2(
    clamp(0.55 * visionScore + 0.2 * languageScore + 0.25 * confidence, 0, 100),
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
  const morphology = round2(visionScoreRaw(input));
  if (mode === "vision_only") {
    return { morphology, language: 0, slide: 0, aggregator: 0 };
  }
  const isFull = input.profile === "full";
  return {
    morphology,
    language: round2(languageScoreRaw(input) * (isFull ? 1.08 : 0.92)),
    slide: round2(slideScoreRaw(input) * (isFull ? 1.1 : 0.9)),
    aggregator: round2(
      clamp(input.milAggregator * (isFull ? 1.05 : 0.9), 0, 100),
    ),
  };
}
