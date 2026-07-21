export type ScriptState = "draft" | "dispensed" | "closed";

export const LEGAL: Record<ScriptState, ScriptState[]> = {
  draft: ["dispensed"],
  dispensed: ["closed"],
  closed: [],
};

export function canTransition(from: ScriptState, to: ScriptState): boolean {
  return LEGAL[from].includes(to);
}
