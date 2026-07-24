import {
  type CompileInput,
  type CompileMode,
  type CompileQuality,
  type PassBreakdown,
  clamp,
  pickArtifactTier,
  round2,
} from "./types";

function fusionBlock(input: CompileInput): number {
  return clamp(
    input.operatorFusionPotential * 52 +
      input.graphComplexity * 22 +
      input.kernelCoverage * 26,
    0,
    100,
  );
}

function memoryBlock(input: CompileInput): number {
  return clamp(
    input.memoryLayoutFit * 48 +
      input.quantizationHeadroom * 30 +
      input.irDepth * 22,
    0,
    100,
  );
}

function targetBlock(input: CompileInput): number {
  return clamp(
    input.targetAffinity * 58 +
      input.kernelCoverage * 24 +
      input.memoryLayoutFit * 18,
    0,
    100,
  );
}

function passNorm(input: CompileInput): number {
  return clamp(input.passBudget / 12, 0, 1);
}

/**
 * Multi-pass MLIR-style plan quality (good path):
 * fuses operators across passes, respects target affinity, uses pass budget.
 */
export function scoreMultiPass(input: CompileInput): CompileQuality {
  const full = input.profile === "full";
  const fusion = fusionBlock(input);
  const memory = memoryBlock(input);
  const target = targetBlock(input);
  const p = passNorm(input);
  const boost = full ? 1.1 : 1;

  const fusionContribution = round2(fusion * (full ? 1.08 : 0.94));
  const memoryContribution = round2(memory * (full ? 1.06 : 0.92));
  const targetContribution = round2(target * (full ? 1.12 : 0.9));

  const fusionScore = round2(
    clamp(
      (fusion * 0.55 + memory * 0.2 + target * 0.25) * boost +
        p * 10 +
        input.operatorFusionPotential * 4,
      0,
      100,
    ),
  );
  const memoryScore = round2(
    clamp(
      (fusion * 0.2 + memory * 0.58 + target * 0.22) * boost +
        input.memoryLayoutFit * 6 +
        p * 4,
      0,
      100,
    ),
  );
  const targetFitScore = round2(
    clamp(
      (fusion * 0.18 + memory * 0.22 + target * 0.6) * boost +
        input.targetAffinity * 8 +
        p * 6,
      0,
      100,
    ),
  );
  const passEfficiency = round2(
    clamp(
      p * 55 +
        input.irDepth * 25 +
        input.kernelCoverage * 20 +
        (full ? 8 : 2),
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
    clamp(ranked[0]! - ranked[1]! + (full ? 9 : 4) + p * 5, 0, 100),
  );
  const overall = round2(
    clamp(
      fusionScore * 0.3 +
        memoryScore * 0.26 +
        targetFitScore * 0.28 +
        passEfficiency * 0.08 +
        confidence * 0.08,
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

/**
 * Naive single-pass / target-blind baseline:
 * ignores target affinity and collapses multi-pass budget.
 */
export function scoreSinglePass(input: CompileInput): CompileQuality {
  const fusion = fusionBlock(input);
  const memory = memoryBlock(input);
  // Target-blind: use graph complexity instead of target affinity
  const blindTarget = clamp(
    input.graphComplexity * 50 +
      input.kernelCoverage * 30 +
      input.irDepth * 20,
    0,
    100,
  );

  const fusionContribution = round2(fusion);
  const memoryContribution = round2(memory);
  const targetContribution = 0;

  const fusionScore = round2(
    clamp(0.82 * fusion + 6 * input.operatorFusionPotential, 0, 92),
  );
  const memoryScore = round2(
    clamp(0.78 * memory + 8 * input.quantizationHeadroom, 0, 88),
  );
  const targetFitScore = round2(
    clamp(0.7 * blindTarget + 10 * input.graphComplexity, 0, 80),
  );
  const passEfficiency = round2(
    clamp(22 + input.irDepth * 18 + input.kernelCoverage * 12, 0, 55),
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
      fusionScore * 0.42 +
        memoryScore * 0.28 +
        targetFitScore * 0.18 +
        confidence * 0.12,
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
  const fusion = fusionBlock(input);
  const memory = memoryBlock(input);
  const target = targetBlock(input);
  if (mode === "single_pass") {
    return {
      lower: round2(fusion * 0.55),
      fuse: 0,
      layout: round2(memory * 0.4),
      emit: round2(clamp(fusion * 0.25 + memory * 0.2, 0, 100)),
    };
  }
  const full = input.profile === "full";
  const p = passNorm(input);
  return {
    lower: round2(fusion * (full ? 1.05 : 0.92)),
    fuse: round2(fusion * 0.7 + p * 25),
    layout: round2(memory * (full ? 1.08 : 0.9) + p * 10),
    emit: round2(target * (full ? 1.1 : 0.88) + p * 8),
  };
}
