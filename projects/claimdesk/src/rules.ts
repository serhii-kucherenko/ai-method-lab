export type WorkflowState = "filed" | "review" | "settled";

export const LEGAL_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  filed: ["review"],
  review: ["settled"],
  settled: [],
};

export function canTransition(from: WorkflowState, to: WorkflowState): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

/** Domain rule: payout cannot exceed reserve. */
export function payoutAllowed(
  reserve: number | null,
  payout: number | null,
): boolean {
  if (reserve === null || payout === null) return false;
  if (reserve < 0 || payout < 0) return false;
  return payout <= reserve;
}

export function evidenceReady(count: number): boolean {
  return count >= 1;
}
