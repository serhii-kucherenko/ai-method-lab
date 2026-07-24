import {
  type PredictInput,
  type PredictQuality,
  type FeatureBreakdown,
  clamp,
  round2,
  pickClass,
} from "./types";

function sequenceBlock(input: PredictInput): number {
  const lengthFactor = clamp(input.seqLength / 800, 0.2, 1.4);
  return clamp(
    input.aaCompositionEntropy * 42 +
      input.hydrophobicFraction * 28 +
      input.signalPeptideScore * 18 +
      lengthFactor * 8,
    0,
    100,
  );
}

function evolutionaryBlock(input: PredictInput): number {
  const depth = clamp(input.msaDepth / 100, 0, 1);
  return clamp(
    input.pssmConservation * 48 + depth * 42 + input.aaCompositionEntropy * 8,
    0,
    100,
  );
}

function structuralBlock(input: PredictInput): number {
  return clamp(
    input.structureCoverage * 52 +
      input.contactMapDensity * 38 +
      input.signalPeptideScore * 8,
    0,
    100,
  );
}

/**
 * Feature-integrated virulence score (good path):
 * blends statistical sequence descriptors with PSSM, MSA depth,
 * and structure-derived contact density.
 */
export function scoreFeatureIntegrated(input: PredictInput): PredictQuality {
  const full = input.profile === "full";
  const seq = sequenceBlock(input);
  const evo = evolutionaryBlock(input);
  const str = structuralBlock(input);
  const fullBoost = full ? 1.08 : 1;

  const sequenceContribution = round2(seq);
  const evolutionaryContribution = round2(evo * (full ? 1.1 : 0.95));
  const structuralContribution = round2(str * (full ? 1.12 : 0.9));

  const vfScore = round2(
    clamp(
      (seq * 0.28 + evo * 0.34 + str * 0.38) * fullBoost +
        input.signalPeptideScore * 6,
      0,
      100,
    ),
  );
  const argScore = round2(
    clamp(
      (seq * 0.32 + evo * 0.4 + str * 0.22) * fullBoost +
        input.pssmConservation * 8,
      0,
      100,
    ),
  );
  const nsScore = round2(
    clamp(
      100 -
        Math.max(vfScore, argScore) * 0.72 +
        (1 - input.aaCompositionEntropy) * 12,
      0,
      100,
    ),
  );

  const predictedClass = pickClass(vfScore, argScore, nsScore);
  const top = Math.max(vfScore, argScore, nsScore);
  const second = [vfScore, argScore, nsScore].sort((a, b) => b - a)[1]!;
  const confidence = round2(clamp(top - second + (full ? 8 : 3), 0, 100));
  const overall = round2(
    clamp(
      vfScore * 0.4 +
        argScore * 0.25 +
        confidence * 0.15 +
        structuralContribution * 0.1 +
        evolutionaryContribution * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "feature_integrated",
    vfScore,
    argScore,
    nsScore,
    predictedClass,
    confidence,
    structuralContribution,
    evolutionaryContribution,
    sequenceContribution,
    overall,
  };
}

/** Sequence-only baseline: statistical descriptors only (no PSSM/MSA/structure). */
export function scoreSequenceOnly(input: PredictInput): PredictQuality {
  const seq = sequenceBlock(input);
  const sequenceContribution = round2(seq);
  const evolutionaryContribution = 0;
  const structuralContribution = 0;

  const vfScore = round2(
    clamp(seq * 0.78 + input.signalPeptideScore * 10, 0, 92),
  );
  const argScore = round2(
    clamp(seq * 0.72 + input.hydrophobicFraction * 12, 0, 90),
  );
  const nsScore = round2(
    clamp(
      100 - Math.max(vfScore, argScore) * 0.65 + (1 - input.aaCompositionEntropy) * 18,
      0,
      100,
    ),
  );

  const predictedClass = pickClass(vfScore, argScore, nsScore);
  const top = Math.max(vfScore, argScore, nsScore);
  const second = [vfScore, argScore, nsScore].sort((a, b) => b - a)[1]!;
  const confidence = round2(clamp(top - second + 2, 0, 85));
  const overall = round2(
    clamp(vfScore * 0.45 + argScore * 0.3 + confidence * 0.25, 0, 100),
  );

  return {
    mode: "sequence_only",
    vfScore,
    argScore,
    nsScore,
    predictedClass,
    confidence,
    structuralContribution,
    evolutionaryContribution,
    sequenceContribution,
    overall,
  };
}

export function featureBreakdown(
  input: PredictInput,
  mode: "feature_integrated" | "sequence_only",
): FeatureBreakdown {
  const statistical = round2(sequenceBlock(input));
  if (mode === "sequence_only") {
    return { statistical, pssm: 0, msa: 0, structure: 0 };
  }
  const full = input.profile === "full";
  return {
    statistical,
    pssm: round2(clamp(input.pssmConservation * 100 * (full ? 1.05 : 0.92), 0, 100)),
    msa: round2(clamp(input.msaDepth * (full ? 1.08 : 0.9), 0, 100)),
    structure: round2(structuralBlock(input) * (full ? 1.1 : 0.88)),
  };
}
