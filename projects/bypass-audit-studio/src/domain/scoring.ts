export type Bypass = {
  id: string;
  hoursOpen: number;
  maxHours: number;
  restored: boolean;
  critical: boolean;
};

export type ScoreInput = {
  bypasses: Bypass[];
  graceHours: number;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  overdueCount: number;
  exposureHours: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Expiry-aware: hold overdue temporary bypasses and require restoral. */
export function scoreExpiryAware(input: ScoreInput): ScoreOutput {
  let overdue = 0;
  let exposure = 0;
  let criticalOverdue = 0;
  for (const b of input.bypasses) {
    if (b.restored) continue;
    const limit = b.maxHours + input.graceHours;
    if (b.hoursOpen > limit) {
      overdue += 1;
      exposure += b.hoursOpen - limit;
      if (b.critical) criticalOverdue += 1;
    }
  }
  return {
    score: clamp(92 - overdue * 12 - criticalOverdue * 10),
    trust: clamp(85 - overdue * 8 - criticalOverdue * 6),
    escalated: criticalOverdue > 0 || overdue > 1,
    overdueCount: overdue,
    exposureHours: Math.round(exposure * 10) / 10,
    rationale: `Expiry-aware overdue=${overdue} criticalOverdue=${criticalOverdue} exposure=${exposure}`,
  };
}

/** Permanent-open: treat bypasses as lasting until manually noticed; ignore maxHours. */
export function scorePermanentOpen(input: ScoreInput): ScoreOutput {
  const open = input.bypasses.filter((b) => !b.restored).length;
  const hours = input.bypasses.filter((b) => !b.restored).reduce((s, b) => s + b.hoursOpen, 0);
  return {
    score: clamp(70 - open * 2),
    trust: 45,
    escalated: false,
    overdueCount: 0,
    exposureHours: Math.round(hours * 10) / 10,
    rationale: `Permanent-open ignores expiry; ${open} bypasses still open for ${hours}h`,
  };
}
