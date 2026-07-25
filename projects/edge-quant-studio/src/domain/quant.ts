import {
  type QuantInput,
  type QuantQuality,
  budgetNorm,
  clamp,
  round2,
} from "./types";

function saliencyBlock(input: QuantInput): number {
  return clamp(
    input.saliencySkew * 48 +
      input.activationEnergy * 32 +
      input.paletteSpan * 20,
    0,
    100,
  );
}

function budgetBlock(input: QuantInput): number {
  const b = budgetNorm(input.avgBitBudget);
  return clamp(
    b * 42 + input.memoryHeadroom * 36 + input.paletteSpan * 22,
    0,
    100,
  );
}

function clusterBlock(input: QuantInput): number {
  return clamp(
    input.clusterRegularity * 55 +
      input.layoutMerge * 30 +
      input.targetAffinity * 15,
    0,
    100,
  );
}

function runtimeBlock(input: QuantInput): number {
  return clamp(
    input.layoutMerge * 40 +
      input.clusterRegularity * 35 +
      input.targetAffinity * 25,
    0,
    100,
  );
}

/**
 * Channel-aware plan quality (good path):
 * waterfill-style saliency match under fractional avg-bit budget + cluster/layout regularity.
 */
export function scoreChannelAware(input: QuantInput): QuantQuality {
  const channel = input.profile === "channel";
  const sal = saliencyBlock(input);
  const bud = budgetBlock(input);
  const clu = clusterBlock(input);
  const run = runtimeBlock(input);
  const boost = channel ? 1.1 : 1;

  const saliencyContribution = round2(sal * (channel ? 1.1 : 0.88));
  const budgetContribution = round2(bud * (channel ? 1.06 : 0.9));
  const layoutContribution = round2(clu * (channel ? 1.08 : 0.85));

  const budgetFit = round2(
    clamp(
      (bud * 0.55 + sal * 0.2 + clu * 0.25) * boost +
        budgetNorm(input.avgBitBudget) * 8 +
        input.memoryHeadroom * 4,
      0,
      100,
    ),
  );
  const saliencyMatch = round2(
    clamp(
      (sal * 0.58 + bud * 0.18 + run * 0.24) * boost +
        input.saliencySkew * 8 +
        input.activationEnergy * 4,
      0,
      100,
    ),
  );
  const clusterScore = round2(
    clamp(
      (clu * 0.6 + run * 0.25 + sal * 0.15) * boost +
        input.clusterRegularity * 6,
      0,
      100,
    ),
  );
  const runtimeScore = round2(
    clamp(
      (run * 0.55 + clu * 0.3 + input.targetAffinity * 15) * boost +
        input.layoutMerge * 5,
      0,
      100,
    ),
  );
  const memoryScore = round2(
    clamp(
      bud * 0.45 +
        input.memoryHeadroom * 40 +
        budgetNorm(input.avgBitBudget) * 15 +
        (channel ? 6 : 0),
      0,
      100,
    ),
  );

  const ranked = [budgetFit, saliencyMatch, clusterScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(ranked[0]! - ranked[1]! + (channel ? 10 : 3) + input.paletteSpan * 6, 0, 100),
  );
  const overall = round2(
    clamp(
      budgetFit * 0.24 +
        saliencyMatch * 0.28 +
        clusterScore * 0.18 +
        runtimeScore * 0.14 +
        memoryScore * 0.08 +
        confidence * 0.08,
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

/**
 * Naive uniform bit-width baseline:
 * ignores channel saliency; collapses to a single operating point.
 */
export function scoreUniform(input: QuantInput): QuantQuality {
  const bud = budgetBlock(input);
  const blindSal = clamp(
    input.activationEnergy * 40 +
      budgetNorm(input.avgBitBudget) * 35 +
      input.paletteSpan * 25,
    0,
    100,
  );
  const clu = clamp(input.clusterRegularity * 40 + input.targetAffinity * 20, 0, 70);
  const run = clamp(input.layoutMerge * 35 + input.targetAffinity * 25, 0, 65);

  const saliencyContribution = 0;
  const budgetContribution = round2(bud);
  const layoutContribution = round2(clu * 0.7);

  const budgetFit = round2(
    clamp(0.78 * bud + 8 * budgetNorm(input.avgBitBudget), 0, 88),
  );
  const saliencyMatch = round2(
    clamp(0.7 * blindSal + 6 * input.activationEnergy, 0, 78),
  );
  const clusterScore = round2(clamp(0.72 * clu + 4 * input.clusterRegularity, 0, 72));
  const runtimeScore = round2(clamp(0.68 * run + 5 * input.layoutMerge, 0, 68));
  const memoryScore = round2(
    clamp(
      0.5 * bud + input.memoryHeadroom * 28 + budgetNorm(input.avgBitBudget) * 12,
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
      budgetFit * 0.4 +
        saliencyMatch * 0.2 +
        clusterScore * 0.14 +
        runtimeScore * 0.12 +
        memoryScore * 0.08 +
        confidence * 0.06,
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
