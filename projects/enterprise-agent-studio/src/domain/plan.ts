import {
  type PlanInput,
  type PlanQuality,
  clamp,
  round2,
} from "./types";

function enterprisePressure(input: PlanInput): number {
  return clamp(
    input.domainComplexity * 0.32 +
      (input.constraintCount / 20) * 0.22 +
      input.capacityTightness * 0.2 +
      input.demandVolatility * 0.16 +
      (input.crossDomainLinks / 5) * 0.1,
    0,
    1,
  );
}

function roleBlock(input: PlanInput): number {
  return clamp(
    input.plannerSpecialization * 34 +
      input.allocatorSpecialization * 34 +
      input.reviewerSpecialization * 28 +
      input.roleCoverage * 18,
    0,
    100,
  );
}

function coordinationBlock(input: PlanInput): number {
  return clamp(
    input.coordinationRounds * 9.5 +
      input.conflictResolutionDepth * 42 +
      input.roleCoverage * 16 +
      (1 - enterprisePressure(input)) * 12,
    0,
    100,
  );
}

function constraintBlock(input: PlanInput): number {
  return clamp(
    input.auditTrailStrictness * 36 +
      (1 - input.capacityTightness) * 22 +
      Math.min(20, input.constraintCount) * 1.8 +
      input.conflictResolutionDepth * 24,
    0,
    100,
  );
}

/**
 * Multi-agent role-orchestrated plan (good path).
 * Soft-simulates planner → allocator → reviewer coordination.
 */
export function scoreMulti(input: PlanInput): PlanQuality {
  const aggressive = input.profile === "aggressive";
  const boost = aggressive ? 1.06 : 1.0;
  const pressure = enterprisePressure(input);
  const roles = roleBlock(input);
  const coord = coordinationBlock(input);
  const constraints = constraintBlock(input);

  const allocationFit = round2(
    clamp(
      (roles * 0.36 + coord * 0.34 + constraints * 0.3) * boost +
        (1 - input.capacityTightness) * 10 -
        pressure * 16,
      0,
      100,
    ),
  );

  const constraintSatisfaction = round2(
    clamp(
      constraints * 0.55 * boost +
        input.auditTrailStrictness * 22 +
        input.conflictResolutionDepth * 18 -
        pressure * 12 -
        input.demandVolatility * 8,
      0,
      100,
    ),
  );

  const conflictResolution = round2(
    clamp(
      input.conflictResolutionDepth * 48 +
        input.coordinationRounds * 5.5 +
        roles * 0.22 * boost -
        pressure * 10,
      0,
      100,
    ),
  );

  const roleCoverageScore = round2(
    clamp(
      input.roleCoverage * 52 +
        roles * 0.38 +
        (aggressive ? 4 : 8) -
        pressure * 6,
      0,
      100,
    ),
  );

  const coordinationLift = round2(
    clamp(
      coord * 0.42 +
        input.coordinationRounds * 6 +
        input.conflictResolutionDepth * 22 +
        roles * 0.18 -
        pressure * 8,
      0,
      100,
    ),
  );

  const planStability = round2(
    clamp(
      allocationFit * 0.4 +
        constraintSatisfaction * 0.35 +
        conflictResolution * 0.25 -
        input.demandVolatility * 14 -
        (input.crossDomainLinks / 5) * 8,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.auditTrailStrictness * 28 +
        input.roleCoverage * 22 +
        input.coordinationRounds * 4 +
        roles * 0.2 +
        (aggressive ? 3 : 7),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      allocationFit * 0.28 +
        constraintSatisfaction * 0.24 +
        conflictResolution * 0.16 +
        roleCoverageScore * 0.12 +
        coordinationLift * 0.12 +
        planStability * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "multi",
    allocationFit,
    constraintSatisfaction,
    conflictResolution,
    roleCoverageScore,
    coordinationLift,
    planStability,
    confidence,
    overall,
  };
}

/**
 * Single-agent unchecked baseline — no role orchestration, weak under pressure.
 */
export function scoreSingle(input: PlanInput): PlanQuality {
  const aggressive = input.profile === "aggressive";
  const pressure = enterprisePressure(input);

  const allocationFit = round2(
    clamp(
      44 +
        (1 - input.capacityTightness) * 18 +
        input.plannerSpecialization * 12 -
        pressure * 28 -
        (input.constraintCount / 20) * 14 +
        (aggressive ? 3 : 0),
      0,
      100,
    ),
  );

  const constraintSatisfaction = round2(
    clamp(
      46 +
        (1 - pressure) * 16 +
        input.auditTrailStrictness * 10 -
        (input.constraintCount / 20) * 18 -
        input.demandVolatility * 10 +
        (aggressive ? 2 : 0),
      0,
      100,
    ),
  );

  const conflictResolution = round2(
    clamp(
      38 +
        (1 - pressure) * 14 +
        input.conflictResolutionDepth * 8 -
        input.coordinationRounds * 1.5,
      0,
      100,
    ),
  );

  const roleCoverageScore = round2(
    clamp(
      32 +
        input.roleCoverage * 18 +
        input.plannerSpecialization * 10 -
        pressure * 8,
      0,
      70,
    ),
  );

  const coordinationLift = round2(
    clamp(10 - pressure * 12 + input.coordinationRounds * 0.8, 0, 35),
  );

  const planStability = round2(
    clamp(
      allocationFit * 0.45 +
        constraintSatisfaction * 0.35 +
        (1 - input.demandVolatility) * 15 -
        pressure * 10,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      36 +
        input.plannerSpecialization * 14 +
        (1 - pressure) * 18 +
        (aggressive ? 2 : 0),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      allocationFit * 0.34 +
        constraintSatisfaction * 0.3 +
        planStability * 0.2 +
        conflictResolution * 0.1 +
        roleCoverageScore * 0.06,
      0,
      100,
    ),
  );

  return {
    mode: "single",
    allocationFit,
    constraintSatisfaction,
    conflictResolution,
    roleCoverageScore,
    coordinationLift,
    planStability,
    confidence,
    overall,
  };
}
