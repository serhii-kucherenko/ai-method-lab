export type ExploreProfile = "accessible" | "baseline";

export type ScoreMode = "tactile" | "visual";

/**
 * Soft-simulation inputs for conversational + tactile chart exploration quality.
 * Method-lab model only — not a live refreshable tactile hardware driver.
 * Never brand as Graphy.
 */
export type TactileInput = {
  /** How clear the chart encoding and data story are (0–1). */
  chartClarity: number;
  /** Depth / count quality of tactile layers (0–1). */
  layerDepth: number;
  /** Coverage of feedback grammar tokens (0–1). */
  grammarCoverage: number;
  /** Select-confirm-ask-verify discipline (0–1). */
  verifyDiscipline: number;
  /** Rate of confirmed selections vs skipped confirms (0–1). */
  selectConfirmRate: number;
  /** Fidelity of conversational answers to chart facts (0–1). */
  askFidelity: number;
  /** Spatial / texture resolution of tactile mapping (0–1). */
  tactileResolution: number;
  /** Conversational turns completed in the session (1–40). */
  conversationTurns: number;
  /** Sync between spoken feedback and tactile cues (0–1). */
  multimodalSync: number;
  /** Latency comfort — lower latency → higher score contribution (0–1). */
  feedbackSpeed: number;
  /** Accessibility review thoroughness (0–1). */
  a11yReview: number;
  profile: ExploreProfile;
};

export type TactileQuality = {
  mode: ScoreMode;
  planQuality: number;
  layerCoverage: number;
  grammarFidelity: number;
  verifyScore: number;
  conversationQuality: number;
  auditTrail: number;
  overall: number;
};

export type ExploreReadiness = {
  chartReady: boolean;
  layersReady: boolean;
  grammarReady: boolean;
  sessionReady: boolean;
  verifyReady: boolean;
  overallReady: boolean;
  layerGap: number;
  verifyGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: TactileQuality,
  input: TactileInput,
): ExploreReadiness {
  const layerTarget =
    52 + input.layerDepth * 24 + input.tactileResolution * 12;
  const verifyTarget =
    50 + input.verifyDiscipline * 26 + input.selectConfirmRate * 12;
  const layerGap = round2(layerTarget - quality.layerCoverage);
  const verifyGap = round2(verifyTarget - quality.verifyScore);
  const chartReady = quality.planQuality >= 46 + input.chartClarity * 20;
  const layersReady = quality.layerCoverage >= layerTarget - 8;
  const grammarReady =
    quality.grammarFidelity >= 44 + input.grammarCoverage * 20;
  const sessionReady =
    quality.conversationQuality >= 46 + input.askFidelity * 16;
  const verifyReady = quality.verifyScore >= verifyTarget - 8;
  return {
    chartReady,
    layersReady,
    grammarReady,
    sessionReady,
    verifyReady,
    overallReady:
      chartReady && layersReady && grammarReady && sessionReady && verifyReady,
    layerGap,
    verifyGap,
  };
}
