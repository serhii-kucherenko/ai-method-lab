export type MatterState = "open" | "held" | "archived";

export const LEGAL: Record<MatterState, MatterState[]> = {
  open: ["held"],
  held: ["archived"],
  archived: [],
};

export function canTransition(from: MatterState, to: MatterState): boolean {
  return LEGAL[from].includes(to);
}

/** Retention met when now is at/after openedAt + retentionDays. */
export function retentionMet(openedAtIso: string, retentionDays: number, nowIso: string): boolean {
  const opened = Date.parse(openedAtIso);
  const now = Date.parse(nowIso);
  if (Number.isNaN(opened) || Number.isNaN(now)) return false;
  const ms = retentionDays * 24 * 60 * 60 * 1000;
  return now >= opened + ms;
}

export function dualArchiveReady(approvalCount: number): boolean {
  return approvalCount >= 2;
}

export function canArchive(role: "counsel" | "paralegal" | "viewer"): boolean {
  return role === "counsel";
}
