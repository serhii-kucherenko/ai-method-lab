export type TrainingProfile = "sft" | "grpo";

export type GenerationMode = "disease_aware" | "disease_blind";

export type GenerationInput = {
  /** MeSH ontology DAG depth for the disease (1–5). */
  meshDepth: number;
  /** Target protein sequence length proxy (100–800). */
  targetLength: number;
  /** How strongly disease context conditions generation (0–1). */
  conditioningStrength: number;
  /** Chemical-space exploration prior (0–1). */
  seedDiversity: number;
  /** Requested candidate batch size. */
  batchSize: number;
  /** Novelty prior vs training set (0–1). */
  noveltyPrior: number;
  /** Predicted binding affinity prior on a pKd-like scale (4–12). */
  affinityPrior: number;
  /** Structural similarity prior to approved drugs (0–1). */
  approvedSimilarityPrior: number;
  profile: TrainingProfile;
};

export type GenerationQuality = {
  mode: GenerationMode;
  validityScore: number;
  noveltyScore: number;
  diversityScore: number;
  affinityScore: number;
  diseaseFitScore: number;
  approvedSimilarity: number;
  uniqueCandidates: number;
  overall: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
