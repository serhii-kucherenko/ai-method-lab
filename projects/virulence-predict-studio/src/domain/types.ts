export type PredictProfile = "full" | "fast";

export type PredictMode = "feature_integrated" | "sequence_only";

export type PredictedClass = "VF" | "ARG" | "NS";

/**
 * Inputs mirroring structural + evolutionary + sequence descriptors
 * used in feature-integrated virulence / ARG prediction.
 */
export type PredictInput = {
  /** Protein sequence length (50–2000). */
  seqLength: number;
  /** Amino-acid composition entropy (0–1). */
  aaCompositionEntropy: number;
  /** Hydrophobic residue fraction (0–1). */
  hydrophobicFraction: number;
  /** PSSM conservation strength (0–1). */
  pssmConservation: number;
  /** MSA homolog depth (0–100). */
  msaDepth: number;
  /** Structure prediction coverage / confidence (0–1). */
  structureCoverage: number;
  /** Contact / distance-map density (0–1). */
  contactMapDensity: number;
  /** Signal-peptide likelihood (0–1). */
  signalPeptideScore: number;
  profile: PredictProfile;
};

export type PredictQuality = {
  mode: PredictMode;
  vfScore: number;
  argScore: number;
  nsScore: number;
  predictedClass: PredictedClass;
  confidence: number;
  structuralContribution: number;
  evolutionaryContribution: number;
  sequenceContribution: number;
  overall: number;
};

export type FeatureBreakdown = {
  statistical: number;
  pssm: number;
  msa: number;
  structure: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function pickClass(
  vf: number,
  arg: number,
  ns: number,
): PredictedClass {
  if (vf >= arg && vf >= ns) return "VF";
  if (arg >= vf && arg >= ns) return "ARG";
  return "NS";
}
