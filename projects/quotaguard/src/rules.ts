export type ChargeState = "requested" | "held" | "released";

export const LEGAL: Record<ChargeState, ChargeState[]> = {
  requested: ["held"],
  held: ["released"],
  released: [],
};

export function canTransition(from: ChargeState, to: ChargeState): boolean {
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

export function canRelease(role: "finance" | "analyst" | "viewer"): boolean {
  return role === "finance";
}
