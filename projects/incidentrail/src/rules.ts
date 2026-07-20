export type IncidentState = "open" | "mitigating" | "resolved" | "closed";

export const LEGAL: Record<IncidentState, IncidentState[]> = {
  open: ["mitigating"],
  mitigating: ["resolved"],
  resolved: ["closed"],
  closed: [],
};

export function canTransition(from: IncidentState, to: IncidentState): boolean {
  return LEGAL[from].includes(to);
}

/** Sev1 must be commander-acked before resolve. */
export function resolveAllowed(
  severity: number,
  commanderAcked: boolean,
  completedActions: number,
): boolean {
  if (completedActions < 1) return false;
  if (severity === 1 && !commanderAcked) return false;
  return true;
}

/** Sev1 needs postmortem before close. */
export function closeAllowed(severity: number, hasPostmortem: boolean): boolean {
  if (severity === 1) return hasPostmortem;
  return true;
}
