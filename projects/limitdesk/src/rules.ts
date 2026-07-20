export type DrawState = "requested" | "held" | "released";

export const LEGAL: Record<DrawState, DrawState[]> = {
  requested: ["held"],
  held: ["released"],
  released: [],
};

export function canTransition(from: DrawState, to: DrawState): boolean {
  return LEGAL[from].includes(to);
}

export function availableUnderCeiling(ceiling: number, outstanding: number): number {
  return ceiling - outstanding;
}

export function fitsCeiling(amount: number, ceiling: number, outstanding: number): boolean {
  return amount > 0 && amount <= availableUnderCeiling(ceiling, outstanding);
}

export function dualReleaseReady(releaseCount: number): boolean {
  return releaseCount >= 2;
}

export function canRelease(role: "credit_officer" | "analyst" | "viewer"): boolean {
  return role === "credit_officer";
}
