import {
  type DialogueInput,
  type DialogueQuality,
  biasWeight,
  clamp,
  feedLoad,
  round2,
} from "./types";

/**
 * Productive open-minded design scorer (path A):
 * rewards open-mindedness, badge clarity, topic balance, and pack readiness
 * without engagement theater.
 */
export function scoreProductiveOpenMindedDesign(
  input: DialogueInput,
): DialogueQuality {
  const only = input.profile === "productive_open_minded_design";
  const boost = only ? 1.12 : 0.96;
  const wO = biasWeight(input.dialogueBias, "open_minded");
  const wT = biasWeight(input.dialogueBias, "topic_first");
  const wE = biasWeight(input.dialogueBias, "engagement_first");
  const avgBias = (wO + wT + (2 - wE)) / 3;
  const load = feedLoad(input.feedNoise, input.openMindedness);

  const dialogueScore = round2(
    clamp(
      (input.openMindedness * 55 +
        input.badgeClarity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.dialogueBias === "engagement_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const badgeScore = round2(
    clamp(
      input.badgeClarity * 60 * boost +
        input.openMindedness * 25 +
        (only ? 8 : 0) -
        input.outrageTunnel * (only ? 4 : 16) -
        (input.dialogueBias === "engagement_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const topicScore = round2(
    clamp(
      input.topicBalance * 58 * boost * wO +
        input.openMindedness * 14 +
        input.badgeClarity * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wT +
        input.badgeClarity * 25 +
        input.openMindedness * 15 +
        (only ? 8 : 0) -
        (input.dialogueBias === "engagement_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const engagementScore = round2(
    clamp(
      input.engagementPull * 55 * boost +
        input.outrageTunnel * 20 -
        input.feedNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.openMindedness * 30 +
        input.badgeClarity * 30 +
        input.packReadiness * 25 -
        input.outrageTunnel * 15,
      0,
      100,
    ),
  );
  const productiveContribution = round2(
    clamp(
      dialogueScore * 0.24 +
        badgeScore * 0.26 +
        topicScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const engagementContribution = round2(
    clamp(
      engagementScore * 0.7 +
        input.engagementPull * 20 +
        input.outrageTunnel * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      productiveContribution * (only ? 0.82 : 0.4) +
        engagementContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.dialogueBias === "engagement_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "productive_open_minded_design",
    dialogueScore,
    badgeScore,
    topicScore,
    readinessScore,
    engagementScore,
    confidence,
    productiveContribution,
    engagementContribution,
    overall,
  };
}

/**
 * Engagement-maximizing baseline (path B):
 * rewards outrage / engagement pull and ignores productive-dialogue honesty.
 */
export function scoreEngagementMaximizingBaseline(
  input: DialogueInput,
): DialogueQuality {
  const baseline = input.profile === "engagement_maximizing_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wE = biasWeight(input.dialogueBias, "engagement_first");
  const load = feedLoad(input.feedNoise, input.openMindedness);

  const dialogueScore = round2(
    clamp(
      input.engagementPull * 35 * boost +
        wE * 10 -
        input.feedNoise * 22 -
        input.overclaimRisk * 12 -
        (input.dialogueBias === "open_minded" ? 8 : 0),
      0,
      100,
    ),
  );
  const badgeScore = round2(
    clamp(
      input.outrageTunnel * 40 * boost +
        input.engagementPull * 25 -
        load * 15 -
        input.badgeClarity * 8,
      0,
      100,
    ),
  );
  const topicScore = round2(
    clamp(
      input.outrageTunnel * 38 * boost +
        input.engagementPull * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.engagementPull * 42 * boost +
        input.outrageTunnel * 28 -
        input.openMindedness * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const engagementScore = round2(
    clamp(
      input.engagementPull * 58 * boost * wE +
        input.outrageTunnel * 32 -
        input.feedNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.outrageTunnel * 45 +
        input.engagementPull * 35 -
        input.feedNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const productiveContribution = round2(
    clamp(
      dialogueScore * 0.2 +
        badgeScore * 0.2 +
        topicScore * 0.2 +
        readinessScore * 0.2 +
        engagementScore * 0.2,
      0,
      100,
    ),
  );
  const engagementContribution = round2(
    clamp(
      engagementScore * 0.55 +
        input.outrageTunnel * 30 +
        input.engagementPull * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      engagementContribution * (baseline ? 0.78 : 0.5) +
        productiveContribution * (baseline ? 0.22 : 0.5) -
        input.feedNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "engagement_maximizing_baseline",
    dialogueScore,
    badgeScore,
    topicScore,
    readinessScore,
    engagementScore,
    confidence,
    productiveContribution,
    engagementContribution,
    overall,
  };
}
