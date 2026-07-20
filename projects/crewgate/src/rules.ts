export type ShiftState = "open" | "active" | "closed";

export const LEGAL: Record<ShiftState, ShiftState[]> = {
  open: ["active"],
  active: ["closed"],
  closed: [],
};

export function canTransition(from: ShiftState, to: ShiftState): boolean {
  return LEGAL[from].includes(to);
}

/** Overtime if hours exceed site limit. */
export function isOvertime(hours: number, overtimeLimitHours: number): boolean {
  return hours > overtimeLimitHours;
}

/** Closing overtime shifts needs dual distinct supervisor approvals. */
export function dualCloseReady(approvalCount: number, overtime: boolean): boolean {
  if (!overtime) return true;
  return approvalCount >= 2;
}

export function canApprove(role: "supervisor" | "lead" | "worker"): boolean {
  return role === "supervisor";
}
