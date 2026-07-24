import {
  type PredictInput,
  type PredictQuality,
  type FeatureBreakdown,
  clamp,
  round2,
  pickClass,
} from "./types";

/** Dual-impl B: independent rewrite that must match virulence.ts on goldens. */

function seqScore(input: PredictInput): number {
  const lenScale = Math.max(0.2, Math.min(1.4, input.seqLength / 800));
  const raw =
    42 * input.aaCompositionEntropy +
    28 * input.hydrophobicFraction +
    18 * input.signalPeptideScore +
    8 * lenScale;
  return Math.max(0, Math.min(100, raw));
}

function evoScore(input: PredictInput): number {
  const depthNorm = Math.max(0, Math.min(1, input.msaDepth / 100));
  const raw =
    48 * input.pssmConservation +
    42 * depthNorm +
    8 * input.aaCompositionEntropy;
  return Math.max(0, Math.min(100, raw));
}

function strScore(input: PredictInput): number {
  const raw =
    52 * input.structureCoverage +
    38 * input.contactMapDensity +
    8 * input.signalPeptideScore;
  return Math.max(0, Math.min(100, raw));
}

export function scoreFeatureIntegrated(input: PredictInput): PredictQuality {
  const isFull = input.profile === "full";
  const s = seqScore(input);
  const e = evoScore(input);
  const t = strScore(input);
  const boost = isFull ? 1.08 : 1;

  const sequenceContribution = round2(s);
  const evolutionaryContribution = round2(e * (isFull ? 1.1 : 0.95));
  const structuralContribution = round2(t * (isFull ? 1.12 : 0.9));

  const vfScore = round2(
    clamp(
      boost * (0.28 * s + 0.34 * e + 0.38 * t) + 6 * input.signalPeptideScore,
      0,
      100,
    ),
  );
  const argScore = round2(
    clamp(
      boost * (0.32 * s + 0.4 * e + 0.22 * t) + 8 * input.pssmConservation,
      0,
      100,
    ),
  );
  const nsScore = round2(
    clamp(
      100 -
        0.72 * Math.max(vfScore, argScore) +
        12 * (1 - input.aaCompositionEntropy),
      0,
      100,
    ),
  );

  const predictedClass = pickClass(vfScore, argScore, nsScore);
  const ranked = [vfScore, argScore, nsScore].slice().sort((a, b) => b - a);
  const confidence = round2(
    clamp(ranked[0]! - ranked[1]! + (isFull ? 8 : 3), 0, 100),
  );
  const overall = round2(
    clamp(
      0.4 * vfScore +
        0.25 * argScore +
        0.15 * confidence +
        0.1 * structuralContribution +
        0.1 * evolutionaryContribution,
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

export function scoreSequenceOnly(input: PredictInput): PredictQuality {
  const s = seqScore(input);
  const sequenceContribution = round2(s);
  const evolutionaryContribution = 0;
  const structuralContribution = 0;

  const vfScore = round2(
    clamp(0.78 * s + 10 * input.signalPeptideScore, 0, 92),
  );
  const argScore = round2(
    clamp(0.72 * s + 12 * input.hydrophobicFraction, 0, 90),
  );
  const nsScore = round2(
    clamp(
      100 -
        0.65 * Math.max(vfScore, argScore) +
        18 * (1 - input.aaCompositionEntropy),
      0,
      100,
    ),
  );

  const predictedClass = pickClass(vfScore, argScore, nsScore);
  const ranked = [vfScore, argScore, nsScore].slice().sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 85));
  const overall = round2(
    clamp(0.45 * vfScore + 0.3 * argScore + 0.25 * confidence, 0, 100),
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
  const statistical = round2(seqScore(input));
  if (mode === "sequence_only") {
    return { statistical, pssm: 0, msa: 0, structure: 0 };
  }
  const isFull = input.profile === "full";
  return {
    statistical,
    pssm: round2(
      clamp(100 * input.pssmConservation * (isFull ? 1.05 : 0.92), 0, 100),
    ),
    msa: round2(clamp(input.msaDepth * (isFull ? 1.08 : 0.9), 0, 100)),
    structure: round2(strScore(input) * (isFull ? 1.1 : 0.88)),
  };
}
