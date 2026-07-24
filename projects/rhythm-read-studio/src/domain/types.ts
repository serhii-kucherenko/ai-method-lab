export type TrainProfile = "full" | "fast";

export type ScoreMode = "angular_scl" | "flat_ce";

/**
 * Soft-simulation inputs for a long-tailed ECG train/eval profile.
 * Not a clinical diagnostic score — method-lab plan quality only.
 */
export type RhythmInput = {
  /** Share of samples in head (common) rhythm classes (0–1). */
  headClassShare: number;
  /** Share of samples in rare / tail rhythm classes (0–1). */
  tailClassShare: number;
  /** Direction-dependent morphological variability (0–1). */
  morphologyAnisotropy: number;
  /** Full-covariance angular Gaussian contrastive strength (0–1). */
  angularCovariance: number;
  /** Adaptive logit prior correction strength (0–1). */
  adaptiveLogit: number;
  /** QRS-band (7–25 Hz) protection in tail-aware augmentation (0–1). */
  bandProtectQrs: number;
  /** Hypersphere embedding uniformity (0–1). */
  embeddingUniformity: number;
  /** How sparse rare positives are (0–1; higher = harder tail). */
  labelSparsity: number;
  /** Multi-label co-occurrence density (0–1). */
  multiLabelDensity: number;
  profile: TrainProfile;
};

export type RhythmQuality = {
  mode: ScoreMode;
  balancedAccuracy: number;
  rareSensitivity: number;
  headSpecificity: number;
  macroMap: number;
  tailLift: number;
  confidence: number;
  angularContribution: number;
  logitContribution: number;
  bandContribution: number;
  overall: number;
};

export type ClassBalanceView = {
  headWeight: number;
  tailWeight: number;
  imbalanceRatio: number;
  rareClassCountHint: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function classBalance(input: RhythmInput): ClassBalanceView {
  const head = clamp(input.headClassShare, 0.05, 0.95);
  const tail = clamp(input.tailClassShare, 0.02, 0.6);
  const imbalanceRatio = round2(head / Math.max(0.02, tail));
  const rareClassCountHint = Math.max(
    1,
    Math.round(2 + input.labelSparsity * 10 + (1 - tail) * 4),
  );
  return {
    headWeight: round2(head),
    tailWeight: round2(tail),
    imbalanceRatio,
    rareClassCountHint,
  };
}
