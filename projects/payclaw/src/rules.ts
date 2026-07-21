export type ClawbackState = "requested" | "held" | "released";

export const LEGAL: Record<ClawbackState, ClawbackState[]> = {
  requested: ["held"],
  held: ["released"],
  released: [],
};

export function canTransition(from: ClawbackState, to: ClawbackState): boolean {
  return LEGAL[from].includes(to);
}

/** Overpay is paid above owed. */
export function overpayAmount(owed: number, paid: number): number {
  return Math.max(0, paid - owed);
}

export function fitsOverpay(
  amount: number,
  owed: number,
  paid: number,
  outstanding: number,
): boolean {
  const headroom = overpayAmount(owed, paid) - outstanding;
  return amount > 0 && amount <= headroom;
}

export function dualReleaseReady(releaseCount: number): boolean {
  return releaseCount >= 2;
}

export function canRelease(role: "hr_lead" | "payroll" | "viewer"): boolean {
  return role === "hr_lead";
}
