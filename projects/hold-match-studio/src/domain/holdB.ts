import {
  type HoldInput,
  type HoldQuality,
  clamp,
  round2,
  tierWeight,
} from "./types";

function experienceBlock(
  inverseRisk: number,
  weight: number,
  fare: number,
  stress: number,
): number {
  return clamp(inverseRisk * 55 * weight + fare * 25 - stress * 18, 0, 100);
}

/**
 * Dual-impl B experience-aware (must match hold.ts).
 */
export function scoreExperienceAware(input: HoldInput): HoldQuality {
  const aware = input.profile === "experience_aware";
  const boost = aware ? 1.12 : 0.96;
  const wR = tierWeight(input.tierBias, "release_now");
  const wS = tierWeight(input.tierBias, "hold_short");
  const wL = tierWeight(input.tierBias, "hold_long");
  const wG = tierWeight(input.tierBias, "guardrail_block");
  const avgTier = (wR + wS + wL + wG) / 4;

  const passengerScore = round2(
    clamp(
      experienceBlock(
        1 - input.passengerWaitRisk,
        avgTier,
        input.fareStrength,
        input.supplyDemandStress,
      ) *
        boost +
        (1 - input.cancelBeforeAccept) * 12 +
        (aware ? 6 : 0) -
        input.holdIntensity * (aware ? 8 : 18),
      0,
      100,
    ),
  );
  const driverScore = round2(
    clamp(
      experienceBlock(
        1 - input.driverIdleCost,
        avgTier,
        input.fareStrength,
        input.supplyDemandStress,
      ) *
        boost +
        (1 - input.cancelAfterAccept) * 10 +
        (aware ? 5 : 0) -
        input.pickupEtaPressure * 14,
      0,
      100,
    ),
  );
  const completionScore = round2(
    clamp(
      ((1 - input.cancelBeforeAccept) * 35 +
        (1 - input.cancelAfterAccept) * 30 +
        input.fareStrength * 25 -
        input.supplyDemandStress * 14 -
        input.pickupEtaPressure * 12) *
        boost +
        (aware ? 10 : 0),
      0,
      100,
    ),
  );
  const cancelReductionScore = round2(
    clamp(
      experienceBlock(
        1 - (input.cancelBeforeAccept + input.cancelAfterAccept) / 2,
        avgTier,
        input.fareStrength,
        input.passengerWaitRisk,
      ) *
        boost +
        (aware ? 8 : 0) -
        input.driverIdleCost * 10,
      0,
      100,
    ),
  );
  const guardrailScore = round2(
    clamp(
      (1 - Math.abs(input.holdIntensity - (aware ? 0.45 : 0.15))) * 70 * boost +
        (input.tierBias === "guardrail_block" ? 8 : 0) +
        (aware ? 6 : 0) -
        input.supplyDemandStress * 12,
      0,
      100,
    ),
  );
  const funnelScore = round2(
    clamp(
      input.fareStrength * 40 +
        (1 - input.pickupEtaPressure) * 25 -
        input.passengerWaitRisk * 15,
      0,
      100,
    ),
  );

  const holdContribution = round2(
    (passengerScore + driverScore + cancelReductionScore) / 3,
  );
  const feasibleContribution = round2(
    aware
      ? input.fareStrength * 18 + (1 - input.pickupEtaPressure) * 12
      : input.fareStrength * 55,
  );

  const confidence = round2(
    clamp(
      (holdContribution * 0.35 +
        completionScore * 0.3 +
        guardrailScore * 0.25 +
        funnelScore * 0.1) *
        (aware ? 1 : 0.85) -
        input.supplyDemandStress * 10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      passengerScore * 0.2 +
        driverScore * 0.18 +
        completionScore * 0.24 +
        cancelReductionScore * 0.18 +
        guardrailScore * 0.12 +
        confidence * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "experience_aware",
    passengerScore,
    driverScore,
    completionScore,
    cancelReductionScore,
    guardrailScore,
    funnelScore,
    confidence,
    holdContribution,
    feasibleContribution,
    overall,
  };
}

/**
 * Dual-impl B first-feasible (must match hold.ts).
 */
export function scoreFirstFeasible(input: HoldInput): HoldQuality {
  const feasible =
    input.profile === "first_feasible" || input.profile === "experience_aware";
  const boost = feasible ? 1.05 : 0.9;

  const passengerScore = round2(
    clamp(
      (1 - input.passengerWaitRisk) * 18 + input.fareStrength * 12,
      0,
      100,
    ),
  );
  const driverScore = round2(
    clamp((1 - input.driverIdleCost) * 16 + input.fareStrength * 14, 0, 100),
  );
  const completionScore = round2(
    clamp(
      (1 - input.cancelBeforeAccept) * 20 + input.fareStrength * 18,
      0,
      100,
    ),
  );
  const cancelReductionScore = round2(
    clamp(
      (1 - input.cancelAfterAccept) * 15 + (1 - input.holdIntensity) * 20,
      0,
      100,
    ),
  );
  const guardrailScore = round2(
    clamp((1 - input.holdIntensity) * 75 * boost + 8, 0, 100),
  );
  const funnelScore = round2(
    clamp(
      (input.fareStrength * 55 +
        (1 - input.pickupEtaPressure) * 28 -
        input.supplyDemandStress * 10) *
        boost,
      0,
      100,
    ),
  );

  const holdContribution = round2((passengerScore + driverScore) / 2);
  const feasibleContribution = round2(input.fareStrength * 70);

  const confidence = round2(
    clamp(
      funnelScore * 0.5 +
        guardrailScore * 0.25 +
        feasibleContribution * 0.15 -
        input.holdIntensity * 12,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      funnelScore * 0.4 +
        guardrailScore * 0.25 +
        confidence * 0.2 +
        completionScore * 0.1 +
        passengerScore * 0.05,
      0,
      100,
    ),
  );

  return {
    mode: "first_feasible",
    passengerScore,
    driverScore,
    completionScore,
    cancelReductionScore,
    guardrailScore,
    funnelScore,
    confidence,
    holdContribution,
    feasibleContribution,
    overall,
  };
}
