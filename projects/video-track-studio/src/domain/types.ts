export type TrackProfile = "track_aware" | "fluency";

export type ScoreMode = "track_aware" | "fluency_only";

export type ProbeBias =
  | "name_swap"
  | "gender_swap"
  | "open_ended"
  | "frame_boost"
  | "balanced";

/**
 * Soft-simulation inputs for track-aware diagnosis vs fluency baseline.
 * Method-lab scoring only — not a claim that production Video-LLMs "watch."
 */
export type TrackInput = {
  /** How sensitive answers are to named-character swaps (0–1, higher = tracks). */
  nameSensitivity: number;
  /** How well outfit/identity binds to the named person (0–1). */
  identityBind: number;
  /** Temporal coverage across the long episode (0–1). */
  temporalCoverage: number;
  /** Outfit-change order fidelity for the named cast (0–1). */
  outfitOrderFidelity: number;
  /** How specific the probe question is (0–1). */
  probeSpecificity: number;
  /** Fluency prior from multiple-choice options (0–1). */
  fluencyPrior: number;
  /** Gender-cue reliance without identity (0–1, higher = worse for track). */
  genderCueReliance: number;
  /** Spec / frame noise (0–1, higher = worse). */
  noiseLevel: number;
  probeBias: ProbeBias;
  profile: TrackProfile;
};

export type TrackQuality = {
  mode: ScoreMode;
  sensitivityScore: number;
  identityScore: number;
  temporalScore: number;
  outfitScore: number;
  specificityScore: number;
  fluencyScore: number;
  confidence: number;
  trackContribution: number;
  fluencyContribution: number;
  overall: number;
};

export type TrackReadiness = "hold" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): TrackReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold";
}

export function biasWeight(
  bias: ProbeBias,
  lane: Exclude<ProbeBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}
