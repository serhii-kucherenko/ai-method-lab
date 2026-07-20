/**
 * Pure scoring helpers — unit-testable "components" without a SPA framework.
 */

export type ScoreInput = {
  weight: number;
  value: number;
};

export function weightedAverage(scores: ScoreInput[]): number | null {
  if (scores.length === 0) return null;
  let weightSum = 0;
  let valueSum = 0;
  for (const s of scores) {
    if (s.weight <= 0) continue;
    weightSum += s.weight;
    valueSum += s.weight * s.value;
  }
  if (weightSum === 0) return null;
  return Math.round((valueSum / weightSum) * 100) / 100;
}

export function meetsHireThreshold(
  average: number | null,
  threshold = 3.5,
): boolean {
  if (average === null) return false;
  return average >= threshold;
}

export type WorkflowState = "applied" | "screening" | "decided";
export type Decision = "hired" | "rejected" | null;

export const LEGAL_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  applied: ["screening"],
  screening: ["decided"],
  decided: [],
};

export function canTransition(from: WorkflowState, to: WorkflowState): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}
