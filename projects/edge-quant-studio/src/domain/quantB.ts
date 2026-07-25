import {
  type QuantInput,
  type QuantQuality,
  budgetNorm,
  clamp,
  round2,
} from "./types";

/** Dual-impl B: independent rewrite that must match quant.ts on goldens. */

function saliencyRaw(input: QuantInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      48 * input.saliencySkew +
        32 * input.activationEnergy +
        20 * input.paletteSpan,
    ),
  );
}

function budgetRaw(input: QuantInput): number {
  const b = budgetNorm(input.avgBitBudget);
  return Math.max(
    0,
    Math.min(100, 42 * b + 36 * input.memoryHeadroom + 22 * input.paletteSpan),
  );
}

function clusterRaw(input: QuantInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      55 * input.clusterRegularity +
        30 * input.layoutMerge +
        15 * input.targetAffinity,
    ),
  );
}

function runtimeRaw(input: QuantInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      40 * input.layoutMerge +
        35 * input.clusterRegularity +
        25 * input.targetAffinity,
    ),
  );
}

export function scoreChannelAware(input: QuantInput): QuantQuality {
  const isChannel = input.profile === "channel";
  const sal = saliencyRaw(input);
  const bud = budgetRaw(input);
  const clu = clusterRaw(input);
  const run = runtimeRaw(input);
  const boost = isChannel ? 1.1 : 1;

  const saliencyContribution = round2(sal * (isChannel ? 1.1 : 0.88));
  const budgetContribution = round2(bud * (isChannel ? 1.06 : 0.9));
  const layoutContribution = round2(clu * (isChannel ? 1.08 : 0.85));

  const budgetFit = round2(
    clamp(
      boost * (0.55 * bud + 0.2 * sal + 0.25 * clu) +
        8 * budgetNorm(input.avgBitBudget) +
        4 * input.memoryHeadroom,
      0,
      100,
    ),
  );
  const saliencyMatch = round2(
    clamp(
      boost * (0.58 * sal + 0.18 * bud + 0.24 * run) +
        8 * input.saliencySkew +
        4 * input.activationEnergy,
      0,
      100,
    ),
  );
  const clusterScore = round2(
    clamp(
      boost * (0.6 * clu + 0.25 * run + 0.15 * sal) +
        6 * input.clusterRegularity,
      0,
      100,
    ),
  );
  const runtimeScore = round2(
    clamp(
      boost * (0.55 * run + 0.3 * clu + 15 * input.targetAffinity) +
        5 * input.layoutMerge,
      0,
      100,
    ),
  );
  const memoryScore = round2(
    clamp(
      0.45 * bud +
        40 * input.memoryHeadroom +
        15 * budgetNorm(input.avgBitBudget) +
        (isChannel ? 6 : 0),
      0,
      100,
    ),
  );

  const ranked = [budgetFit, saliencyMatch, clusterScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(
      ranked[0]! - ranked[1]! + (isChannel ? 10 : 3) + 6 * input.paletteSpan,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      0.24 * budgetFit +
        0.28 * saliencyMatch +
        0.18 * clusterScore +
        0.14 * runtimeScore +
        0.08 * memoryScore +
        0.08 * confidence,
      0,
      100,
    ),
  );

  return {
    mode: "channel_aware",
    budgetFit,
    saliencyMatch,
    clusterScore,
    runtimeScore,
    memoryScore,
    confidence,
    saliencyContribution,
    budgetContribution,
    layoutContribution,
    overall,
  };
}

export function scoreUniform(input: QuantInput): QuantQuality {
  const bud = budgetRaw(input);
  const blind = Math.max(
    0,
    Math.min(
      100,
      40 * input.activationEnergy +
        35 * budgetNorm(input.avgBitBudget) +
        25 * input.paletteSpan,
    ),
  );
  const clu = Math.max(
    0,
    Math.min(70, 40 * input.clusterRegularity + 20 * input.targetAffinity),
  );
  const run = Math.max(
    0,
    Math.min(65, 35 * input.layoutMerge + 25 * input.targetAffinity),
  );

  const saliencyContribution = 0;
  const budgetContribution = round2(bud);
  const layoutContribution = round2(clu * 0.7);

  const budgetFit = round2(
    clamp(0.78 * bud + 8 * budgetNorm(input.avgBitBudget), 0, 88),
  );
  const saliencyMatch = round2(
    clamp(0.7 * blind + 6 * input.activationEnergy, 0, 78),
  );
  const clusterScore = round2(
    clamp(0.72 * clu + 4 * input.clusterRegularity, 0, 72),
  );
  const runtimeScore = round2(clamp(0.68 * run + 5 * input.layoutMerge, 0, 68));
  const memoryScore = round2(
    clamp(
      0.5 * bud + 28 * input.memoryHeadroom + 12 * budgetNorm(input.avgBitBudget),
      0,
      80,
    ),
  );

  const ranked = [budgetFit, saliencyMatch, clusterScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 65));
  const overall = round2(
    clamp(
      0.4 * budgetFit +
        0.2 * saliencyMatch +
        0.14 * clusterScore +
        0.12 * runtimeScore +
        0.08 * memoryScore +
        0.06 * confidence,
      0,
      100,
    ),
  );

  return {
    mode: "uniform",
    budgetFit,
    saliencyMatch,
    clusterScore,
    runtimeScore,
    memoryScore,
    confidence,
    saliencyContribution,
    budgetContribution,
    layoutContribution,
    overall,
  };
}
