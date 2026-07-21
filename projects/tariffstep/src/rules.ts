export type BillState = "draft" | "posted" | "locked";

export const LEGAL: Record<BillState, BillState[]> = {
  draft: ["posted"],
  posted: ["locked"],
  locked: [],
};

export function canTransition(from: BillState, to: BillState): boolean {
  return LEGAL[from].includes(to);
}
