export type WorkflowState = "planned" | "staging" | "prod" | "rolled_back";

export const LEGAL_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  planned: ["staging"],
  staging: ["prod"],
  prod: [],
  rolled_back: [],
};

export function canTransition(from: WorkflowState, to: WorkflowState): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

/** At least one checklist item must be checked before staging. */
export function checklistReady(checkedCount: number): boolean {
  return checkedCount >= 1;
}

/** Dual approval: at least two distinct lead/approver signatures. */
export function dualApprovalReady(approvalCount: number): boolean {
  return approvalCount >= 2;
}

export function canApprove(role: "lead" | "engineer" | "approver"): boolean {
  return role === "lead" || role === "approver";
}
