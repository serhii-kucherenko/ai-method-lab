export type ApplicationState = "submitted" | "active" | "closed";
export type MilestoneState = "planned" | "paid" | "waived" | "clawed_back";

export const LEGAL_APP_TRANSITIONS: Record<ApplicationState, ApplicationState[]> = {
  submitted: ["active"],
  active: ["closed"],
  closed: [],
};

export const LEGAL_MILESTONE_TRANSITIONS: Record<
  MilestoneState,
  MilestoneState[]
> = {
  planned: ["paid", "waived"],
  paid: ["clawed_back"],
  waived: [],
  clawed_back: [],
};

export function canTransitionApp(from: ApplicationState, to: ApplicationState): boolean {
  return LEGAL_APP_TRANSITIONS[from].includes(to);
}

export function canTransitionMilestone(
  from: MilestoneState,
  to: MilestoneState,
): boolean {
  return LEGAL_MILESTONE_TRANSITIONS[from].includes(to);
}

/** Dual sign-off: two distinct admin/reviewer members required. */
export function signOffReady(count: number): boolean {
  return count >= 2;
}

/** Sum of paid milestones cannot exceed approved amount. */
export function milestoneBudgetAllowed(
  paidTotal: number,
  milestoneAmount: number,
  approvedAmount: number | null,
): boolean {
  if (approvedAmount === null) return false;
  if (milestoneAmount < 0 || paidTotal < 0) return false;
  return paidTotal + milestoneAmount <= approvedAmount;
}

/** Close only when every milestone is paid or waived. */
export function closeReady(states: MilestoneState[]): boolean {
  if (states.length === 0) return true;
  return states.every((s) => s === "paid" || s === "waived");
}

export function canSignOff(role: string): boolean {
  return role === "admin" || role === "reviewer";
}
