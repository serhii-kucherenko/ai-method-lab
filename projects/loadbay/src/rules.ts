export type LoadState = "staged" | "sealed" | "departed";

export const LEGAL: Record<LoadState, LoadState[]> = {
  staged: ["sealed"],
  sealed: ["departed"],
  departed: [],
};

export function canTransition(from: LoadState, to: LoadState): boolean {
  return LEGAL[from].includes(to);
}

/** Load must fit dock capacity. */
export function fitsCapacity(weightKg: number, maxWeightKg: number): boolean {
  return weightKg <= maxWeightKg;
}

/** Dual checker seals before depart. */
export function dualSealReady(sealCount: number): boolean {
  return sealCount >= 2;
}

export function canSeal(role: "owner" | "dispatcher" | "checker"): boolean {
  return role === "owner" || role === "checker";
}
