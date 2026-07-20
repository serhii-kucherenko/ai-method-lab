export type BreachState = "open" | "remediating" | "waived" | "closed";

export const LEGAL: Record<BreachState, BreachState[]> = {
  open: ["remediating", "waived"],
  remediating: ["closed"],
  waived: ["closed"],
  closed: [],
};

export function canTransition(from: BreachState, to: BreachState): boolean {
  return LEGAL[from].includes(to);
}

/** SLO breach if observed latency exceeds contract SLO. */
export function isSloBreach(latencyMs: number | null, sloLatencyMs: number): boolean {
  if (latencyMs === null) return true;
  return latencyMs > sloLatencyMs;
}

/** Closing remediating requires a note; waived can close without. */
export function closeAllowed(
  state: BreachState,
  remediationNote: string | null,
): boolean {
  if (state === "waived") return true;
  if (state === "remediating") return Boolean(remediationNote?.trim());
  return false;
}
