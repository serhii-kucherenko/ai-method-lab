export type IntervalState = "draft" | "posted" | "closed";

export const LEGAL: Record<IntervalState, IntervalState[]> = {
  draft: ["posted"],
  posted: ["closed"],
  closed: [],
};

export function canTransition(from: IntervalState, to: IntervalState): boolean {
  return LEGAL[from].includes(to);
}
