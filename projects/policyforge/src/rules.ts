export type ViolationState = "open" | "waived" | "enforced";

export const LEGAL: Record<ViolationState, ViolationState[]> = {
  open: ["waived", "enforced"],
  waived: ["enforced"],
  enforced: [],
};

export function canTransition(from: ViolationState, to: ViolationState): boolean {
  return LEGAL[from].includes(to);
}

/** Violation only if observed severity exceeds rule threshold. */
export function isSeverityViolation(
  severity: number,
  severityThreshold: number,
): boolean {
  return severity > severityThreshold;
}

/** Dual waive: at least two distinct owner/auditor signatures. */
export function dualWaiveReady(approvalCount: number): boolean {
  return approvalCount >= 2;
}

export function canApproveWaive(role: "owner" | "author" | "auditor"): boolean {
  return role === "owner" || role === "auditor";
}
