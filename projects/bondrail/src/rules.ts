export type DrawState = "requested" | "held" | "released";

export const LEGAL: Record<DrawState, DrawState[]> = {
  requested: ["held"],
  held: ["released"],
  released: [],
};

export function canTransition(from: DrawState, to: DrawState): boolean {
  return LEGAL[from].includes(to);
}

/** Available headroom above collateral floor after outstanding draws. */
export function availableCollateral(
  collateral: number,
  floor: number,
  outstanding: number,
): number {
  return collateral - floor - outstanding;
}

export function fitsFloor(
  amount: number,
  collateral: number,
  floor: number,
  outstanding: number,
): boolean {
  return amount > 0 && amount <= availableCollateral(collateral, floor, outstanding);
}

export function dualReleaseReady(releaseCount: number): boolean {
  return releaseCount >= 2;
}

export function canRelease(role: "treasurer" | "clerk" | "viewer"): boolean {
  return role === "treasurer";
}
