export type DialogueProfile =
  | "productive_open_minded_design"
  | "engagement_maximizing_baseline";

export type ScoreMode = DialogueProfile;

export type DialogueBias =
  | "open_minded"
  | "balanced"
  | "topic_first"
  | "engagement_first";

export type BadgeKind =
  | "open_minded"
  | "perspective_taking"
  | "civility"
  | "curiosity"
  | "custom";

export type FeedLane =
  | "chronological"
  | "topic_balanced"
  | "open_minded_rank"
  | "engagement_rank"
  | "hybrid"
  | "custom";

export type TopicMode =
  | "threaded"
  | "cross_cutting"
  | "deliberative"
  | "hot_take"
  | "custom";

/**
 * Soft-simulation inputs for productive open-minded dialogue feed packs
 * vs engagement-maximizing baselines.
 * Method-lab scoring only — not live social network deployment, not content
 * moderation authority, not attitude-change clearance, not authors’ platform brand.
 */
export type DialogueInput = {
  /** Soft-sim open-mindedness / constructive language strength (0–1). */
  openMindedness: number;
  /** Soft-sim open-minded badge clarity (0–1). */
  badgeClarity: number;
  /** Soft-sim topic-thread balance / cross-cutting exposure (0–1). */
  topicBalance: number;
  /** Soft-sim feed pack readiness for lock (0–1). */
  packReadiness: number;
  /** Engagement-maximizing pull — path B fuel (0–1). */
  engagementPull: number;
  /** Feed ranking / ranking noise hardness (0–1). */
  feedNoise: number;
  /** Outrage tunnel when teams chase engagement (0–1). */
  outrageTunnel: number;
  /** Risk of claiming live network / moderation / attitude change (0–1). */
  overclaimRisk: number;
  dialogueBias: DialogueBias;
  profile: DialogueProfile;
};

export type DialogueQuality = {
  mode: ScoreMode;
  dialogueScore: number;
  badgeScore: number;
  topicScore: number;
  readinessScore: number;
  engagementScore: number;
  confidence: number;
  productiveContribution: number;
  engagementContribution: number;
  overall: number;
};

export type PackLockState = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackLockState {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: DialogueBias,
  lane: Exclude<DialogueBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function feedLoad(feedNoise: number, openMindedness: number): number {
  return clamp(feedNoise * (1.25 - openMindedness * 0.5), 0, 1.5);
}
