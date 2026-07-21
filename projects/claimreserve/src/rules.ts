export type ClaimState = "filed" | "held" | "settled";

export const LEGAL: Record<ClaimState, ClaimState[]> = {
  filed: ["held"],
  held: ["settled"],
  settled: [],
};

export function canTransition(from: ClaimState, to: ClaimState): boolean {
  return LEGAL[from].includes(to);
}

/** Remaining reserve capacity under the policy ceiling. */
export function reserveHeadroom(ceiling: number, outstanding: number): number {
  return Math.max(0, ceiling - outstanding);
}

export function fitsReserveCeiling(
  amount: number,
  ceiling: number,
  outstanding: number,
): boolean {
  return amount > 0 && amount <= reserveHeadroom(ceiling, outstanding);
}

export function dualSettleReady(settleCount: number): boolean {
  return settleCount >= 2;
}

export function canSettle(role: "adjuster" | "clerk" | "viewer"): boolean {
  return role === "adjuster";
}
