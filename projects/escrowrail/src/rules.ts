export type DisbursementState = "requested" | "held" | "released";

export const LEGAL: Record<DisbursementState, DisbursementState[]> = {
  requested: ["held"],
  held: ["released"],
  released: [],
};

export function canTransition(from: DisbursementState, to: DisbursementState): boolean {
  return LEGAL[from].includes(to);
}

/** Spendable above the floor after outstanding holds. */
export function availableAboveFloor(balance: number, floor: number, outstanding: number): number {
  return Math.max(0, balance - floor - outstanding);
}

export function fitsBalanceFloor(
  amount: number,
  balance: number,
  floor: number,
  outstanding: number,
): boolean {
  return amount > 0 && amount <= availableAboveFloor(balance, floor, outstanding);
}

export function dualReleaseReady(releaseCount: number): boolean {
  return releaseCount >= 2;
}

export function canRelease(role: "escrow_officer" | "clerk" | "viewer"): boolean {
  return role === "escrow_officer";
}
