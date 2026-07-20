export type FindingState = "open" | "remediated" | "accepted";
export type Severity = "low" | "medium" | "high" | "critical";

export const LEGAL: Record<FindingState, FindingState[]> = {
  open: ["remediated"],
  remediated: ["accepted"],
  accepted: [],
};

export function canTransition(from: FindingState, to: FindingState): boolean {
  return LEGAL[from].includes(to);
}

export function questionnaireAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

export function canAcceptCritical(
  severity: Severity,
  average: number | null,
  threshold = 3.5,
): boolean {
  if (severity !== "critical") return true;
  if (average === null) return false;
  return average >= threshold;
}

export function attestationValid(
  attestUntil: string | null,
  nowIso: string,
): boolean {
  if (!attestUntil) return false;
  return attestUntil >= nowIso.slice(0, 10);
}
