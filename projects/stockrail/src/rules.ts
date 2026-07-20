export type AdjustState = "drafted" | "staged" | "applied";

export const LEGAL: Record<AdjustState, AdjustState[]> = {
  drafted: ["staged"],
  staged: ["applied"],
  applied: [],
};

export function canTransition(from: AdjustState, to: AdjustState): boolean {
  return LEGAL[from].includes(to);
}

/** Stock must stay non-negative after applying delta. */
export function staysNonNegative(qty: number, delta: number): boolean {
  return qty + delta >= 0;
}

export function dualApproveReady(approvalCount: number): boolean {
  return approvalCount >= 2;
}

export function canApprove(role: "manager" | "clerk" | "viewer"): boolean {
  return role === "manager";
}
