export type PairingState = "draft" | "released" | "closed";

export const LEGAL: Record<PairingState, PairingState[]> = {
  draft: ["released"],
  released: ["closed"],
  closed: [],
};

export function canTransition(from: PairingState, to: PairingState): boolean {
  return LEGAL[from].includes(to);
}
