export type PositionState = "open" | "held" | "cleared";

export const LEGAL: Record<PositionState, PositionState[]> = {
  open: ["held"],
  held: ["cleared"],
  cleared: [],
};

export function canTransition(from: PositionState, to: PositionState): boolean {
  return LEGAL[from].includes(to);
}

/** Breached when exposure exceeds the position risk limit. */
export function isBreached(exposure: number, riskLimit: number): boolean {
  return exposure > riskLimit;
}

/** Dual risk-officer clear required while breached. */
export function dualClearReady(clearCount: number, breached: boolean): boolean {
  if (!breached) return true;
  return clearCount >= 2;
}

export function canClear(role: "risk_officer" | "trader" | "viewer"): boolean {
  return role === "risk_officer";
}
