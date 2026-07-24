export type TutorProfile = "guided" | "strict";

export type ScoreMode = "orchestrated" | "single";

/**
 * Soft-simulation inputs for secure software tutoring quality.
 * Method-lab plan quality only — not a live multi-LLM classroom.
 */
export type TutorInput = {
  /** Vulnerability topic complexity (0–1). */
  vulnComplexity: number;
  /** Security rubric item count (1–20). */
  rubricItemCount: number;
  /** Fraction of tutor roles assigned (0–1). */
  tutorCoverage: number;
  /** Multi-LLM orchestration / handoff rounds (1–8). */
  orchestrationRounds: number;
  /** Depth of pedagogy scaffolding (0–1). */
  pedagogyDepth: number;
  /** Coverage of threat categories in the lesson (0–1). */
  threatCoverage: number;
  /** Strength of safety gates against exploit leakage (0–1). */
  safetyGateStrength: number;
  /** Student risk / misuse pressure (0–1). */
  studentRiskLevel: number;
  /** Risk of leaking actionable exploit hints (0–1). */
  exploitHintRisk: number;
  /** Explainer tutor specialization (0–1). */
  explainerSpecialization: number;
  /** Safety-checker tutor specialization (0–1). */
  safetySpecialization: number;
  /** Rubric-grader tutor specialization (0–1). */
  rubricSpecialization: number;
  profile: TutorProfile;
};

export type TutorQuality = {
  mode: ScoreMode;
  pedagogyFit: number;
  securityRubricPass: number;
  safetyGateScore: number;
  tutorCoverageScore: number;
  orchestrationLift: number;
  lessonStability: number;
  confidence: number;
  overall: number;
};

export type RubricView = {
  tutorsReady: boolean;
  safetyReady: boolean;
  pedagogyReady: boolean;
  rubricReady: boolean;
  overallReady: boolean;
  safetyGap: number;
  pedagogyGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function rubricFromQuality(
  quality: TutorQuality,
  input: TutorInput,
): RubricView {
  const safetyTarget = 58 + input.safetyGateStrength * 22;
  const pedagogyTarget = 55 + input.pedagogyDepth * 20;
  const safetyGap = round2(safetyTarget - quality.safetyGateScore);
  const pedagogyGap = round2(pedagogyTarget - quality.pedagogyFit);
  const tutorsReady =
    quality.tutorCoverageScore >= 58 + input.tutorCoverage * 12;
  const safetyReady = quality.safetyGateScore >= safetyTarget;
  const pedagogyReady = quality.pedagogyFit >= pedagogyTarget;
  const rubricReady =
    quality.securityRubricPass >= 56 + (input.rubricItemCount / 20) * 18;
  return {
    tutorsReady,
    safetyReady,
    pedagogyReady,
    rubricReady,
    overallReady: tutorsReady && safetyReady && pedagogyReady && rubricReady,
    safetyGap,
    pedagogyGap,
  };
}
