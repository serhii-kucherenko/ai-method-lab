export type Seat = {
  id: string;
  monthlyCost: number;
  activeDays: number; // in last 30
  lastLoginDaysAgo: number;
};

export type ScoreInput = {
  seats: Seat[];
  idleThresholdDays: number;
  reclaimFriction: number; // 0-1 cost of reclaim effort
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  wasteDollars: number;
  reclaimable: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;
const money = (n: number) => Math.round(n * 100) / 100;

/** Usage-aware: price idle seats and reclaimable waste. */
export function scoreUsageAware(input: ScoreInput): ScoreOutput {
  let waste = 0;
  let reclaimable = 0;
  for (const seat of input.seats) {
    const idle =
      seat.activeDays < 3 || seat.lastLoginDaysAgo >= input.idleThresholdDays;
    if (idle) {
      waste += seat.monthlyCost;
      reclaimable += seat.monthlyCost * (1 - input.reclaimFriction);
    }
  }
  const total = Math.max(1, input.seats.reduce((s, x) => s + x.monthlyCost, 0));
  const wastePct = (waste / total) * 100;
  return {
    score: clamp(100 - wastePct * 0.7 + (reclaimable / total) * 15),
    trust: clamp(80 - wastePct * 0.25),
    escalated: wastePct > 25,
    wasteDollars: money(waste),
    reclaimable: money(reclaimable),
    rationale: `Usage-aware idle waste=$${money(waste)} reclaimable=$${money(reclaimable)}`,
  };
}

/** Headcount-only: license every seat at full cost; ignore activity. */
export function scoreHeadcountOnly(input: ScoreInput): ScoreOutput {
  const total = input.seats.reduce((s, x) => s + x.monthlyCost, 0);
  return {
    score: 72,
    trust: 50,
    escalated: false,
    wasteDollars: 0,
    reclaimable: 0,
    rationale: `Headcount-only licenses all seats at $${money(total)}; activity ignored`,
  };
}
