export type ChangeRequest = {
  id: string;
  duringFreeze: boolean;
  approvedException: boolean;
  risk: number; // 0-100
};

export type ScoreInput = {
  freezeActive: boolean;
  requests: ChangeRequest[];
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  violationCount: number;
  holdRate: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Freeze-aware: block unapproved changes during freeze windows. */
export function scoreFreezeAware(input: ScoreInput): ScoreOutput {
  let violations = 0;
  let held = 0;
  let totalInFreeze = 0;
  for (const r of input.requests) {
    const inFreeze = input.freezeActive || r.duringFreeze;
    if (!inFreeze) continue;
    totalInFreeze += 1;
    if (!r.approvedException) {
      held += 1;
      if (r.risk >= 40) violations += 1;
    }
  }
  const holdRate = totalInFreeze ? (held / totalInFreeze) * 100 : 100;
  return {
    score: clamp(holdRate * 0.7 + (violations === 0 ? 30 : 8)),
    trust: clamp(75 + holdRate * 0.2 - violations * 10),
    escalated: violations > 0,
    violationCount: violations,
    holdRate: Math.round(holdRate * 10) / 10,
    rationale: `Freeze-aware held=${held}/${totalInFreeze} violations=${violations}`,
  };
}

/** Always-allow: ignore freeze windows; approve all requests. */
export function scoreAlwaysAllow(input: ScoreInput): ScoreOutput {
  const risky = input.requests.filter((r) => r.duringFreeze || input.freezeActive).length;
  return {
    score: clamp(58 - risky),
    trust: 42,
    escalated: false,
    violationCount: 0,
    holdRate: 0,
    rationale: `Always-allow ignores freeze; ${risky} in-freeze changes proceed`,
  };
}
