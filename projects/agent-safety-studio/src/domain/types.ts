export type MonitorProfile = "balanced" | "strict";

export type ScoreMode = "structural" | "threshold";

export type DeployMode = "sync" | "async";

/**
 * Soft-simulation inputs for structural agent-deployment safety plan quality.
 * Method-lab plan quality only — not a live IFG / ControlArena pipeline.
 * Never brand as IFG.
 */
export type SafetyInput = {
  /** Control-flow graph delta magnitude (0–1). */
  cfgDelta: number;
  /** Data-flow graph delta magnitude (0–1). */
  dfgDelta: number;
  /** Privilege / scope broadening signal (0–1). */
  privilegeBroadening: number;
  /** Logging / audit degradation (0–1). */
  loggingDegradation: number;
  /** Deny-guard / MFA / network-deny removals (0–1). */
  denyGuardRemoval: number;
  /** New sensitive sinks / admin paths (0–1). */
  newSensitiveSinks: number;
  /** How well the change is justified by the main task (0–1). */
  taskJustification: number;
  /** Fraction of structural checks enabled (0–1). */
  monitorCoverage: number;
  /** Suspicion threshold used by the monitor (1–10). */
  suspicionThreshold: number;
  /** Raw code-diff noise / churn (0–1). */
  codeDiffNoise: number;
  /** Runtime hardening regression (0–1). */
  hardeningRegression: number;
  /** Number of structural check kinds enabled (1–12). */
  checkKindCount: number;
  deployMode: DeployMode;
  profile: MonitorProfile;
};

export type SafetyQuality = {
  mode: ScoreMode;
  structuralCatchRate: number;
  falsePositiveBudgetFit: number;
  syncBlockEffectiveness: number;
  asyncDetectionLift: number;
  postureRegressionScore: number;
  confidence: number;
  overall: number;
};

export type MonitorReadiness = {
  coverageReady: boolean;
  syncReady: boolean;
  asyncReady: boolean;
  postureReady: boolean;
  overallReady: boolean;
  catchGap: number;
  postureGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: SafetyQuality,
  input: SafetyInput,
): MonitorReadiness {
  const catchTarget = 62 + input.monitorCoverage * 22;
  const postureTarget = 58 + input.cfgDelta * 10 + input.dfgDelta * 10;
  const catchGap = round2(catchTarget - quality.structuralCatchRate);
  const postureGap = round2(postureTarget - quality.postureRegressionScore);
  const coverageReady =
    quality.structuralCatchRate >= 55 + input.monitorCoverage * 18;
  const syncReady =
    quality.syncBlockEffectiveness >=
    (input.deployMode === "sync" ? 68 : 48);
  const asyncReady = quality.asyncDetectionLift >= 52 + input.monitorCoverage * 12;
  const postureReady = quality.postureRegressionScore >= postureTarget;
  return {
    coverageReady,
    syncReady,
    asyncReady,
    postureReady,
    overallReady: coverageReady && syncReady && asyncReady && postureReady,
    catchGap,
    postureGap,
  };
}
