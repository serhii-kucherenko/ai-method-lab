export type WorkOrderState = "open" | "parts" | "closed";

export const LEGAL: Record<WorkOrderState, WorkOrderState[]> = {
  open: ["parts"],
  parts: ["closed"],
  closed: [],
};

export function canTransition(from: WorkOrderState, to: WorkOrderState): boolean {
  return LEGAL[from].includes(to);
}

/** Overdue service if hours due exceeds asset interval. */
export function isOverdueService(hoursDue: number, serviceIntervalHours: number): boolean {
  return hoursDue > serviceIntervalHours;
}

/** Dual mechanic sign-off before close. */
export function dualSignOffReady(signOffCount: number): boolean {
  return signOffCount >= 2;
}

export function canSignOff(role: "owner" | "dispatcher" | "mechanic"): boolean {
  return role === "owner" || role === "mechanic";
}
