export type Incident = {
  id: string;
  downtimeMinutes: number;
  excluded: boolean;
  severity: number; // 0-1
};

export type ScoreInput = {
  monthlyFee: number;
  creditPerMinute: number;
  creditCapPct: number; // percent of monthly fee
  incidents: Incident[];
  compoundFactor: number; // extra multiplier when >1 incident
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  forecastCredit: number;
  breachRisk: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;
const money = (n: number) => Math.round(n * 100) / 100;

/** Credit-aware: dollar math with exclusions, caps, compounding. */
export function scoreCreditAware(input: ScoreInput): ScoreOutput {
  const billable = input.incidents.filter((i) => !i.excluded);
  const rawMinutes = billable.reduce((s, i) => s + i.downtimeMinutes * (0.7 + 0.3 * i.severity), 0);
  const compound = billable.length > 1 ? input.compoundFactor : 1;
  let credit = rawMinutes * input.creditPerMinute * compound;
  const cap = (input.monthlyFee * input.creditCapPct) / 100;
  const capped = credit > cap;
  credit = Math.min(credit, cap);
  const underCap = !capped;
  const quality = billable.length
    ? 100 - Math.min(70, (credit / Math.max(1, input.monthlyFee)) * 100)
    : 95;
  return {
    score: clamp(quality * 0.55 + (underCap ? 30 : 12) + Math.min(15, billable.length * 3)),
    trust: clamp(underCap ? 78 + billable.length * 2 : 52 + billable.length),
    escalated: credit > input.monthlyFee * 0.15,
    forecastCredit: money(credit),
    breachRisk: clamp((credit / Math.max(1, input.monthlyFee)) * 100 + (capped ? 18 : 4)),
    rationale: `Credit-aware ${billable.length} billable incidents minutes=${money(rawMinutes)} credit=$${money(credit)} cap=$${money(cap)}`,
  };
}

/** Calendar-only: any non-excluded incident = binary breach without dollar math. */
export function scoreCalendarOnly(input: ScoreInput): ScoreOutput {
  const any = input.incidents.some((i) => !i.excluded && i.downtimeMinutes > 0);
  const minutes = input.incidents.reduce((s, i) => s + i.downtimeMinutes, 0);
  const naive = any ? input.monthlyFee * 0.25 : 0;
  return {
    score: clamp(any ? 48 + Math.min(20, minutes / 10) : 90),
    trust: 62,
    escalated: any,
    forecastCredit: money(naive),
    breachRisk: clamp(any ? 70 + Math.min(25, minutes / 5) : 8),
    rationale: any
      ? "Calendar-only flags breach without tiered credit math"
      : "Calendar-only: no calendar breach detected",
  };
}
