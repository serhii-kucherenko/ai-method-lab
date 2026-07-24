import {
  type LadderInput,
  type LadderQuality,
  clamp,
  round2,
} from "./types";

function bombPressure(input: LadderInput): number {
  return clamp(
    input.hiddenTimerHint * 0.22 +
      input.interlockBypassRisk * 0.2 +
      input.actuatorReach * 0.16 +
      input.operatorOverrideGap * 0.14 +
      input.timerCounterComplexity * 0.14 +
      input.nestedFbDepth * 0.14,
    0,
    1,
  );
}

function fbSignal(input: LadderInput): number {
  return clamp(
    input.fbBodyRetention * 42 +
      input.symbolicPathCoverage * 28 +
      Math.min(24, input.fbInstanceCount) * 1.1 +
      input.scanCycleBoundTightness * 12,
    0,
    100,
  );
}

function triggerSignal(input: LadderInput): number {
  return clamp(
    input.triggerRecoverability * 48 +
      input.symbolicPathCoverage * 22 +
      input.scanCycleBoundTightness * 16 +
      (1 - input.ladderNoise) * 14,
    0,
    100,
  );
}

/**
 * FB-aware formal plan quality (good path).
 * Soft-simulates keeping function-block bodies in the model + trigger synth.
 * Not branded as ESBMC-LLB / ESBMC-PLC+.
 */
export function scoreFbAware(input: LadderInput): LadderQuality {
  const strict = input.profile === "strict";
  const boost = strict ? 1.07 : 1.0;
  const pressure = bombPressure(input);
  const fb = fbSignal(input);
  const trigger = triggerSignal(input);

  const bombCatchRate = round2(
    clamp(
      (fb * 0.38 + pressure * 42 + input.hiddenTimerHint * 18) * boost -
        input.ladderNoise * 12 +
        input.fbBodyRetention * 10,
      0,
      100,
    ),
  );

  const triggerRecovery = round2(
    clamp(
      (trigger * 0.55 + bombCatchRate * 0.22 + input.triggerRecoverability * 18) *
        boost -
        input.ladderNoise * 8,
      0,
      100,
    ),
  );

  const fbFidelity = round2(
    clamp(
      input.fbBodyRetention * 72 * boost +
        input.nestedFbDepth * 12 +
        Math.min(24, input.fbInstanceCount) * 0.9 -
        input.ladderNoise * 6,
      0,
      100,
    ),
  );

  const symbolicCoverage = round2(
    clamp(
      input.symbolicPathCoverage * 58 * boost +
        input.scanCycleBoundTightness * 22 +
        fbFidelity * 0.12 -
        input.ladderNoise * 10,
      0,
      100,
    ),
  );

  const falseAlarmFit = round2(
    clamp(
      70 +
        input.symbolicPathCoverage * 16 -
        input.ladderNoise * 24 -
        pressure * 8 +
        (strict ? 4 : 0),
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.fbBodyRetention * 26 +
        input.symbolicPathCoverage * 22 +
        Math.min(24, input.fbInstanceCount) * 1.4 +
        (strict ? 5 : 8) -
        input.ladderNoise * 10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      bombCatchRate * 0.28 +
        triggerRecovery * 0.22 +
        fbFidelity * 0.18 +
        symbolicCoverage * 0.14 +
        falseAlarmFit * 0.1 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "fb-aware",
    bombCatchRate,
    triggerRecovery,
    fbFidelity,
    symbolicCoverage,
    falseAlarmFit,
    confidence,
    overall,
  };
}

/**
 * Dropped-FB baseline — strips function-block bodies; misses bombs inside FBs.
 */
export function scoreDroppedFb(input: LadderInput): LadderQuality {
  const strict = input.profile === "strict";
  const pressure = bombPressure(input);
  // Baseline pretends FB bodies are gone regardless of retention claim.
  const droppedRetention = clamp(input.fbBodyRetention * 0.18, 0, 0.25);

  const bombCatchRate = round2(
    clamp(
      38 +
        pressure * 18 +
        input.hiddenTimerHint * 8 -
        input.nestedFbDepth * 28 -
        input.fbBodyRetention * 22 +
        droppedRetention * 20 +
        (strict ? 2 : 0) -
        input.ladderNoise * 6,
      0,
      62,
    ),
  );

  const triggerRecovery = round2(
    clamp(
      32 +
        input.triggerRecoverability * 18 -
        input.nestedFbDepth * 20 -
        input.fbBodyRetention * 14 +
        input.symbolicPathCoverage * 8,
      0,
      55,
    ),
  );

  const fbFidelity = round2(
    clamp(
      18 +
        droppedRetention * 40 -
        input.nestedFbDepth * 16 +
        Math.min(24, input.fbInstanceCount) * 0.4,
      0,
      42,
    ),
  );

  const symbolicCoverage = round2(
    clamp(
      36 +
        input.symbolicPathCoverage * 22 -
        input.nestedFbDepth * 18 -
        input.fbBodyRetention * 10 +
        input.scanCycleBoundTightness * 8,
      0,
      58,
    ),
  );

  const falseAlarmFit = round2(
    clamp(
      52 +
        (strict ? 2 : 0) -
        input.ladderNoise * 18 +
        input.symbolicPathCoverage * 8 -
        pressure * 4,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      28 +
        input.ladderNoise * 8 +
        (strict ? 2 : 0) -
        input.fbBodyRetention * 10 -
        input.nestedFbDepth * 8,
      0,
      48,
    ),
  );

  const overall = round2(
    clamp(
      bombCatchRate * 0.34 +
        triggerRecovery * 0.2 +
        fbFidelity * 0.12 +
        symbolicCoverage * 0.16 +
        falseAlarmFit * 0.1 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "dropped-fb",
    bombCatchRate,
    triggerRecovery,
    fbFidelity,
    symbolicCoverage,
    falseAlarmFit,
    confidence,
    overall,
  };
}
