export type BookingState = "held" | "confirmed" | "cancelled";

export const LEGAL: Record<BookingState, BookingState[]> = {
  held: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  cancelled: [],
};

export function canTransition(from: BookingState, to: BookingState): boolean {
  return LEGAL[from].includes(to);
}

/** Half-open interval overlap: [start, end). */
export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Dual admin override required only when confirming into a conflict. */
export function dualOverrideReady(overrideCount: number, hasConflict: boolean): boolean {
  if (!hasConflict) return true;
  return overrideCount >= 2;
}

export function canOverride(role: "owner" | "admin" | "member"): boolean {
  return role === "owner" || role === "admin";
}
