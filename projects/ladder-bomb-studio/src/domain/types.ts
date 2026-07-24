export type ScanProfile = "balanced" | "strict";

export type ScoreMode = "fb-aware" | "dropped-fb";

/**
 * Soft-simulation inputs for ladder logic bomb formal plan quality.
 * Method-lab plan quality only — not a live industrial PLC verifier.
 * Never brand as ESBMC-LLB / ESBMC-PLC+.
 */
export type LadderInput = {
  /** Fraction of function-block body retained in the formal model (0–1). */
  fbBodyRetention: number;
  /** Nested function-block depth pressure (0–1). */
  nestedFbDepth: number;
  /** Timer / counter complexity in the ladder (0–1). */
  timerCounterComplexity: number;
  /** Interlock / safety-gate bypass risk (0–1). */
  interlockBypassRisk: number;
  /** Reachability to actuators from suspect nets (0–1). */
  actuatorReach: number;
  /** Operator override / HMI gap (0–1). */
  operatorOverrideGap: number;
  /** Hidden timer / delayed-fire hint strength (0–1). */
  hiddenTimerHint: number;
  /** How tight the scan-cycle bound is for BMC (0–1 = tighter). */
  scanCycleBoundTightness: number;
  /** Symbolic path coverage of the plan (0–1). */
  symbolicPathCoverage: number;
  /** How recoverable a concrete trigger is (0–1). */
  triggerRecoverability: number;
  /** Ladder churn / noise that confuses shallow models (0–1). */
  ladderNoise: number;
  /** Number of FB instances in scope (1–24). */
  fbInstanceCount: number;
  profile: ScanProfile;
};

export type LadderQuality = {
  mode: ScoreMode;
  bombCatchRate: number;
  triggerRecovery: number;
  fbFidelity: number;
  symbolicCoverage: number;
  falseAlarmFit: number;
  confidence: number;
  overall: number;
};

export type ScanReadiness = {
  fbReady: boolean;
  triggerReady: boolean;
  coverageReady: boolean;
  catchReady: boolean;
  overallReady: boolean;
  catchGap: number;
  triggerGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: LadderQuality,
  input: LadderInput,
): ScanReadiness {
  const catchTarget = 60 + input.fbBodyRetention * 24;
  const triggerTarget = 55 + input.triggerRecoverability * 28;
  const catchGap = round2(catchTarget - quality.bombCatchRate);
  const triggerGap = round2(triggerTarget - quality.triggerRecovery);
  const fbReady = quality.fbFidelity >= 58 + input.fbBodyRetention * 20;
  const triggerReady =
    quality.triggerRecovery >= 52 + input.triggerRecoverability * 18;
  const coverageReady =
    quality.symbolicCoverage >= 50 + input.symbolicPathCoverage * 22;
  const catchReady = quality.bombCatchRate >= catchTarget - 8;
  return {
    fbReady,
    triggerReady,
    coverageReady,
    catchReady,
    overallReady: fbReady && triggerReady && coverageReady && catchReady,
    catchGap,
    triggerGap,
  };
}
