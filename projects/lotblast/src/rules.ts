export type RecallState = "draft" | "locked" | "closed";

export const LEGAL: Record<RecallState, RecallState[]> = {
  draft: ["locked"],
  locked: ["closed"],
  closed: [],
};

export function canTransition(from: RecallState, to: RecallState): boolean {
  return LEGAL[from].includes(to);
}

export function isRecallState(v: string): v is RecallState {
  return v === "draft" || v === "locked" || v === "closed";
}
