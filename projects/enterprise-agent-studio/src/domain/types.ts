export type PlanProfile = "balanced" | "aggressive";

export type ScoreMode = "multi" | "single";

/**
 * Soft-simulation inputs for enterprise resource planning.
 * Method-lab plan quality only — not a live ERP system.
 */
export type PlanInput = {
  /** Domain workflow complexity (0–1). */
  domainComplexity: number;
  /** Hard constraint count (1–20). */
  constraintCount: number;
  /** Fraction of specialized roles assigned (0–1). */
  roleCoverage: number;
  /** Multi-agent coordination / negotiation rounds (1–8). */
  coordinationRounds: number;
  /** Depth of conflict resolution between roles (0–1). */
  conflictResolutionDepth: number;
  /** How tight capacity is relative to demand (0–1). */
  capacityTightness: number;
  /** Demand volatility pressure (0–1). */
  demandVolatility: number;
  /** Cross-domain dependency links (0–5). */
  crossDomainLinks: number;
  /** Audit trail / review strictness (0–1). */
  auditTrailStrictness: number;
  /** Planner role specialization (0–1). */
  plannerSpecialization: number;
  /** Allocator role specialization (0–1). */
  allocatorSpecialization: number;
  /** Reviewer / auditor role specialization (0–1). */
  reviewerSpecialization: number;
  profile: PlanProfile;
};

export type PlanQuality = {
  mode: ScoreMode;
  allocationFit: number;
  constraintSatisfaction: number;
  conflictResolution: number;
  roleCoverageScore: number;
  coordinationLift: number;
  planStability: number;
  confidence: number;
  overall: number;
};

export type OrchestrationView = {
  rolesReady: boolean;
  constraintsReady: boolean;
  capacityReady: boolean;
  auditReady: boolean;
  overallReady: boolean;
  capacityGap: number;
  constraintGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function orchestrationFromQuality(
  quality: PlanQuality,
  input: PlanInput,
): OrchestrationView {
  const capacityTarget = 55 + input.capacityTightness * 22;
  const constraintTarget = 58 + (input.constraintCount / 20) * 20;
  const capacityGap = round2(capacityTarget - quality.allocationFit);
  const constraintGap = round2(
    constraintTarget - quality.constraintSatisfaction,
  );
  const rolesReady = quality.roleCoverageScore >= 60 + input.roleCoverage * 10;
  const constraintsReady = quality.constraintSatisfaction >= constraintTarget;
  const capacityReady = quality.allocationFit >= capacityTarget;
  const auditReady = quality.confidence >= 58 + input.auditTrailStrictness * 18;
  return {
    rolesReady,
    constraintsReady,
    capacityReady,
    auditReady,
    overallReady:
      rolesReady && constraintsReady && capacityReady && auditReady,
    capacityGap,
    constraintGap,
  };
}
