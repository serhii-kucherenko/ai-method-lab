import {
  type TactileInput,
  type TactileQuality,
  clamp,
  round2,
} from "./types";

function planSignal(input: TactileInput): number {
  return clamp(
    input.chartClarity * 30 +
      input.layerDepth * 24 +
      input.grammarCoverage * 20 +
      input.multimodalSync * 16 +
      Math.min(40, input.conversationTurns) * 0.25,
    0,
    100,
  );
}

function verifySignal(input: TactileInput): number {
  return clamp(
    input.verifyDiscipline * 40 +
      input.selectConfirmRate * 28 +
      input.askFidelity * 20 +
      input.a11yReview * 12,
    0,
    100,
  );
}

/**
 * Conversational + tactile plan (good path).
 * Layers + grammar + select-confirm-ask-verify loop.
 */
export function scoreTactile(input: TactileInput): TactileQuality {
  const accessible = input.profile === "accessible";
  const boost = accessible ? 1.05 : 1.0;
  const plan = planSignal(input);
  const verify = verifySignal(input);

  const planQuality = round2(
    clamp(
      (plan * 0.55 +
        input.chartClarity * 22 +
        input.layerDepth * 16) *
        boost -
        (1 - input.multimodalSync) * 6,
      0,
      100,
    ),
  );

  const layerCoverage = round2(
    clamp(
      (input.layerDepth * 42 +
        input.tactileResolution * 28 +
        input.multimodalSync * 18 +
        Math.min(40, input.conversationTurns) * 0.2) *
        boost,
      0,
      100,
    ),
  );

  const grammarFidelity = round2(
    clamp(
      (input.grammarCoverage * 0.5 * 100 +
        input.feedbackSpeed * 28 +
        input.askFidelity * 16) *
        boost -
        (1 - input.a11yReview) * 5,
      0,
      100,
    ),
  );

  const verifyScore = round2(
    clamp(
      (verify * 0.55 +
        input.verifyDiscipline * 22 +
        input.selectConfirmRate * 16) *
        boost,
      0,
      100,
    ),
  );

  const conversationQuality = round2(
    clamp(
      grammarFidelity * 0.26 +
        verifyScore * 0.22 +
        layerCoverage * 0.2 +
        input.askFidelity * 18 +
        Math.min(40, input.conversationTurns) * 0.35 -
        (accessible ? 0 : 2),
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.verifyDiscipline * 22 +
        input.a11yReview * 20 +
        input.grammarCoverage * 18 +
        input.selectConfirmRate * 14 +
        Math.min(40, input.conversationTurns) * 0.4 +
        (accessible ? 6 : 3),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      planQuality * 0.18 +
        layerCoverage * 0.2 +
        grammarFidelity * 0.16 +
        verifyScore * 0.2 +
        conversationQuality * 0.16 +
        auditTrail * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "tactile",
    planQuality,
    layerCoverage,
    grammarFidelity,
    verifyScore,
    conversationQuality,
    auditTrail,
    overall,
  };
}

/**
 * Visual-only baseline — no tactile layers / weak verify discipline.
 */
export function scoreVisual(input: TactileInput): TactileQuality {
  const accessible = input.profile === "accessible";
  const skipPenalty = clamp(
    0.4 +
      (1 - input.layerDepth) * 0.25 +
      (1 - input.verifyDiscipline) * 0.25,
    0.35,
    0.95,
  );

  const planQuality = round2(
    clamp(
      38 +
        input.chartClarity * 22 +
        input.askFidelity * 14 -
        skipPenalty * 8 +
        (accessible ? 2 : 0),
      0,
      72,
    ),
  );

  const layerCoverage = round2(
    clamp(
      16 +
        input.layerDepth * 8 +
        input.tactileResolution * 6 -
        skipPenalty * 22 -
        (1 - input.multimodalSync) * 8,
      0,
      38,
    ),
  );

  const grammarFidelity = round2(
    clamp(
      42 +
        input.grammarCoverage * 20 +
        input.feedbackSpeed * 10 -
        skipPenalty * 6 +
        (accessible ? 3 : 0),
      0,
      74,
    ),
  );

  const verifyScore = round2(
    clamp(
      10 +
        input.verifyDiscipline * 8 +
        input.selectConfirmRate * 6 -
        skipPenalty * 18,
      0,
      30,
    ),
  );

  const conversationQuality = round2(
    clamp(
      34 +
        grammarFidelity * 0.26 +
        input.askFidelity * 14 -
        skipPenalty * 14 -
        (100 - layerCoverage) * 0.08,
      0,
      66,
    ),
  );

  const auditTrail = round2(
    clamp(
      20 +
        input.a11yReview * 10 +
        input.selectConfirmRate * 8 -
        skipPenalty * 12 +
        (accessible ? 2 : 0),
      0,
      46,
    ),
  );

  const overall = round2(
    clamp(
      planQuality * 0.22 +
        layerCoverage * 0.12 +
        grammarFidelity * 0.2 +
        verifyScore * 0.12 +
        conversationQuality * 0.2 +
        auditTrail * 0.14,
      0,
      100,
    ),
  );

  return {
    mode: "visual",
    planQuality,
    layerCoverage,
    grammarFidelity,
    verifyScore,
    conversationQuality,
    auditTrail,
    overall,
  };
}
