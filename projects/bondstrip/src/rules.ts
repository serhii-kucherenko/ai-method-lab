export type StripState = "draft" | "confirmed" | "locked";

export const LEGAL: Record<StripState, StripState[]> = {
  draft: ["confirmed"],
  confirmed: ["locked"],
  locked: [],
};

export function canTransition(from: StripState, to: StripState): boolean {
  return LEGAL[from].includes(to);
}
