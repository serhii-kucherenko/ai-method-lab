export type LotState = "open" | "held" | "cleared";

export const LEGAL: Record<LotState, LotState[]> = {
  open: ["held"],
  held: ["cleared"],
  cleared: [],
};

export function canTransition(from: LotState, to: LotState): boolean {
  return LEGAL[from].includes(to);
}

/** Hot when max inspection severity meets or exceeds threshold. */
export function isHot(maxSeverity: number, threshold: number): boolean {
  return maxSeverity >= threshold;
}

export function dualClearReady(clearCount: number, hot: boolean): boolean {
  if (!hot) return true;
  return clearCount >= 2;
}

export function canClear(role: "qa_lead" | "inspector" | "clerk"): boolean {
  return role === "qa_lead";
}
