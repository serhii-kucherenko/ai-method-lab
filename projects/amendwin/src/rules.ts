export type VisitLockState = "open" | "locked";

export const LEGAL: Record<VisitLockState, VisitLockState[]> = {
  open: ["locked"],
  locked: [],
};

export function canTransition(from: VisitLockState, to: VisitLockState): boolean {
  return LEGAL[from].includes(to);
}
