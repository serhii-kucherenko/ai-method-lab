import {
  type CompileInput,
  type CompileMode,
  type CompileQuality,
  type PassBreakdown,
  clamp,
  pickArtifactTier,
  round2,
} from "./types";

/** Dual-impl B: independent rewrite that must match compile.ts on goldens. */

function fusionRaw(input: CompileInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      52 * input.operatorFusionPotential +
        22 * input.graphComplexity +
        26 * input.kernelCoverage,
    ),
  );
}

function memoryRaw(input: CompileInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      48 * input.memoryLayoutFit +
        30 * input.quantizationHeadroom +
        22 * input.irDepth,
    ),
  );
}

function targetRaw(input: CompileInput): number {
  return Math.max(
    0,
    Math.min(
      100,
      58 * input.targetAffinity +
        24 * input.kernelCoverage +
        18 * input.memoryLayoutFit,
    ),
  );
}

function budgetFrac(input: CompileInput): number {
  return Math.max(0, Math.min(1, input.passBudget / 12));
}

export function scoreMultiPass(input: CompileInput): CompileQuality {
  const isFull = input.profile === "full";
  const f = fusionRaw(input);
  const m = memoryRaw(input);
  const t = targetRaw(input);
  const p = budgetFrac(input);
  const boost = isFull ? 1.1 : 1;

  const fusionContribution = round2(f * (isFull ? 1.08 : 0.94));
  const memoryContribution = round2(m * (isFull ? 1.06 : 0.92));
  const targetContribution = round2(t * (isFull ? 1.12 : 0.9));

  const fusionScore = round2(
    clamp(
      boost * (0.55 * f + 0.2 * m + 0.25 * t) +
        10 * p +
        4 * input.operatorFusionPotential,
      0,
      100,
    ),
  );
  const memoryScore = round2(
    clamp(
      boost * (0.2 * f + 0.58 * m + 0.22 * t) +
        6 * input.memoryLayoutFit +
        4 * p,
      0,
      100,
    ),
  );
  const targetFitScore = round2(
    clamp(
      boost * (0.18 * f + 0.22 * m + 0.6 * t) +
        8 * input.targetAffinity +
        6 * p,
      0,
      100,
    ),
  );
  const passEfficiency = round2(
    clamp(
      55 * p +
        25 * input.irDepth +
        20 * input.kernelCoverage +
        (isFull ? 8 : 2),
      0,
      100,
    ),
  );

  const predictedArtifactTier = pickArtifactTier(
    fusionScore,
    memoryScore,
    targetFitScore,
  );
  const ranked = [fusionScore, memoryScore, targetFitScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(ranked[0]! - ranked[1]! + (isFull ? 9 : 4) + 5 * p, 0, 100),
  );
  const overall = round2(
    clamp(
      0.3 * fusionScore +
        0.26 * memoryScore +
        0.28 * targetFitScore +
        0.08 * passEfficiency +
        0.08 * confidence,
      0,
      100,
    ),
  );

  return {
    mode: "multi_pass",
    fusionScore,
    memoryScore,
    targetFitScore,
    passEfficiency,
    predictedArtifactTier,
    confidence,
    fusionContribution,
    memoryContribution,
    targetContribution,
    overall,
  };
}

export function scoreSinglePass(input: CompileInput): CompileQuality {
  const f = fusionRaw(input);
  const m = memoryRaw(input);
  const blind = Math.max(
    0,
    Math.min(
      100,
      50 * input.graphComplexity +
        30 * input.kernelCoverage +
        20 * input.irDepth,
    ),
  );

  const fusionContribution = round2(f);
  const memoryContribution = round2(m);
  const targetContribution = 0;

  const fusionScore = round2(
    clamp(0.82 * f + 6 * input.operatorFusionPotential, 0, 92),
  );
  const memoryScore = round2(
    clamp(0.78 * m + 8 * input.quantizationHeadroom, 0, 88),
  );
  const targetFitScore = round2(
    clamp(0.7 * blind + 10 * input.graphComplexity, 0, 80),
  );
  const passEfficiency = round2(
    clamp(22 + 18 * input.irDepth + 12 * input.kernelCoverage, 0, 55),
  );

  const predictedArtifactTier = pickArtifactTier(
    fusionScore,
    memoryScore,
    targetFitScore,
  );
  const ranked = [fusionScore, memoryScore, targetFitScore]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 70));
  const overall = round2(
    clamp(
      0.42 * fusionScore +
        0.28 * memoryScore +
        0.18 * targetFitScore +
        0.12 * confidence,
      0,
      100,
    ),
  );

  return {
    mode: "single_pass",
    fusionScore,
    memoryScore,
    targetFitScore,
    passEfficiency,
    predictedArtifactTier,
    confidence,
    fusionContribution,
    memoryContribution,
    targetContribution,
    overall,
  };
}

export function passBreakdown(
  input: CompileInput,
  mode: CompileMode,
): PassBreakdown {
  const f = fusionRaw(input);
  const m = memoryRaw(input);
  const t = targetRaw(input);
  if (mode === "single_pass") {
    return {
      lower: round2(f * 0.55),
      fuse: 0,
      layout: round2(m * 0.4),
      emit: round2(clamp(0.25 * f + 0.2 * m, 0, 100)),
    };
  }
  const isFull = input.profile === "full";
  const p = budgetFrac(input);
  return {
    lower: round2(f * (isFull ? 1.05 : 0.92)),
    fuse: round2(0.7 * f + 25 * p),
    layout: round2(m * (isFull ? 1.08 : 0.9) + 10 * p),
    emit: round2(t * (isFull ? 1.1 : 0.88) + 8 * p),
  };
}
