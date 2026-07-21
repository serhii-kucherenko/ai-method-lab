export type FilingState = "open" | "held" | "filed";

export const LEGAL: Record<FilingState, FilingState[]> = {
  open: ["held"],
  held: ["filed"],
  filed: [],
};

export function canTransition(from: FilingState, to: FilingState): boolean {
  return LEGAL[from].includes(to);
}

/** Late after due_at plus lateDays grace. */
export function isLate(dueAtIso: string, lateDays: number, nowIso: string): boolean {
  const due = Date.parse(dueAtIso);
  const now = Date.parse(nowIso);
  if (Number.isNaN(due) || Number.isNaN(now)) return false;
  const graceMs = lateDays * 24 * 60 * 60 * 1000;
  return now > due + graceMs;
}

export function dualFileReady(approvalCount: number, late: boolean): boolean {
  if (!late) return true;
  return approvalCount >= 2;
}

export function canApprove(role: "tax_officer" | "clerk" | "viewer"): boolean {
  return role === "tax_officer";
}
