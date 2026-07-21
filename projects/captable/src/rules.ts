export type AllocationState = "proposed" | "held" | "closed";

export const LEGAL: Record<AllocationState, AllocationState[]> = {
  proposed: ["held"],
  held: ["closed"],
  closed: [],
};

export function canTransition(from: AllocationState, to: AllocationState): boolean {
  return LEGAL[from].includes(to);
}

/** Remaining shares under the round authorization. */
export function shareHeadroom(authorized: number, outstanding: number): number {
  return Math.max(0, authorized - outstanding);
}

export function fitsAuthorized(
  shares: number,
  authorized: number,
  outstanding: number,
): boolean {
  return shares > 0 && shares <= shareHeadroom(authorized, outstanding);
}

export function dualCloseReady(closeCount: number): boolean {
  return closeCount >= 2;
}

export function canClose(role: "counsel" | "clerk" | "viewer"): boolean {
  return role === "counsel";
}
