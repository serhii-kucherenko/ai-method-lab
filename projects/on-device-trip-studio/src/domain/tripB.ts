import {
  type TripInput,
  type TripQuality,
  clamp,
  round2,
} from "./types";

function feasSignal(input: TripInput): number {
  return clamp(
    input.scheduleFeasibility * 32 +
      input.constraintStrictness * 22 +
      input.transferReliability * 20 +
      input.offlineMapCoverage * 16 +
      (1 - input.weatherRisk) * 10,
    0,
    100,
  );
}

function desireSignal(input: TripInput): number {
  return clamp(
    input.desireAlignment * 36 +
      input.desireWeight * 22 +
      input.mobilityAdaptability * 18 +
      Math.min(120, input.tripHours) * 0.15 +
      Math.min(30, input.stopCount) * 0.35,
    0,
    100,
  );
}

/**
 * Dual-impl twin of scorePlaFeasibility — must stay bitwise-equal on goldens.
 */
export function scorePlaFeasibility(input: TripInput): TripQuality {
  const onDevice = input.planner === "on_device";
  const boost = onDevice ? 1.05 : 1.0;
  const feas = feasSignal(input);
  const desire = desireSignal(input);

  const feasibility = round2(
    clamp(
      (feas * 0.55 +
        input.scheduleFeasibility * 24 +
        input.constraintStrictness * 14) *
        boost -
        input.weatherRisk * 8,
      0,
      100,
    ),
  );

  const desireFit = round2(
    clamp(
      (desire * 0.5 +
        input.desireAlignment * 28 +
        input.mobilityAdaptability * 14) *
        boost -
        (1 - input.constraintStrictness) * 4,
      0,
      100,
    ),
  );

  const resourceMargin = round2(
    clamp(
      (input.resourceHeadroom * 48 +
        (1 - Math.min(1, input.stopCount / 40)) * 22 +
        input.offlineMapCoverage * 18 +
        Math.min(120, input.tripHours) * 0.08) *
        boost,
      0,
      100,
    ),
  );

  const transferHealth = round2(
    clamp(
      (input.transferReliability * 0.55 * 100 +
        input.scheduleFeasibility * 20 +
        input.desireAlignment * 12) *
        boost,
      0,
      100,
    ),
  );

  const adaptGain = round2(
    clamp(
      (input.mobilityAdaptability * 34 +
        (1 - input.weatherRisk) * 28 +
        input.scheduleFeasibility * 22 +
        input.constraintStrictness * 12) *
        boost,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.constraintStrictness * 22 +
        input.scheduleFeasibility * 20 +
        input.transferReliability * 16 +
        input.desireAlignment * 14 +
        Math.min(120, input.tripHours) * 0.12 +
        (onDevice ? 6 : 3),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      feasibility * 0.22 +
        desireFit * 0.18 +
        resourceMargin * 0.16 +
        transferHealth * 0.14 +
        adaptGain * 0.2 +
        auditTrail * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "pla_feasibility",
    feasibility,
    desireFit,
    resourceMargin,
    transferHealth,
    adaptGain,
    auditTrail,
    overall,
  };
}

/**
 * Dual-impl twin of scoreDesireFirst — must stay bitwise-equal on goldens.
 */
export function scoreDesireFirst(input: TripInput): TripQuality {
  const onDevice = input.planner === "on_device";
  const skipPenalty = clamp(
    0.42 +
      (1 - input.constraintStrictness) * 0.22 +
      input.weatherRisk * 0.2 +
      (1 - input.resourceHeadroom) * 0.16,
    0.35,
    0.95,
  );
  const desire = desireSignal(input);

  const desireFit = round2(
    clamp(
      desire * 0.72 +
        input.desireWeight * 18 +
        input.mobilityAdaptability * 10 -
        (onDevice ? 2 : 0),
      0,
      100,
    ),
  );

  const feasibility = round2(
    clamp(
      (input.scheduleFeasibility * 18 +
        input.constraintStrictness * 10 +
        input.offlineMapCoverage * 8) *
        skipPenalty,
      0,
      100,
    ),
  );

  const resourceMargin = round2(
    clamp(
      (input.resourceHeadroom * 28 +
        (1 - Math.min(1, input.stopCount / 40)) * 12) *
        skipPenalty +
        input.desireWeight * 8,
      0,
      100,
    ),
  );

  const transferHealth = round2(
    clamp(
      input.transferReliability * 35 * skipPenalty +
        input.desireAlignment * 15,
      0,
      100,
    ),
  );

  const adaptGain = round2(
    clamp(
      (input.mobilityAdaptability * 16 +
        (1 - input.weatherRisk) * 12 +
        input.scheduleFeasibility * 10) *
        skipPenalty,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.desireAlignment * 18 +
        input.desireWeight * 14 +
        Math.min(120, input.tripHours) * 0.08 -
        8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      desireFit * 0.34 +
        feasibility * 0.12 +
        resourceMargin * 0.14 +
        transferHealth * 0.12 +
        adaptGain * 0.16 +
        auditTrail * 0.12,
      0,
      100,
    ),
  );

  return {
    mode: "desire_first",
    feasibility,
    desireFit,
    resourceMargin,
    transferHealth,
    adaptGain,
    auditTrail,
    overall,
  };
}
