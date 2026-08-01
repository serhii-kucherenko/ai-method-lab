export type Charge = {
  id: string;
  amountUsd: number;
  wouldExceed: boolean;
  overrideApproved: boolean;
};

export type ScoreInput = {
  capUsd: number;
  spentUsd: number;
  charges: Charge[];
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  breachCount: number;
  blockRate: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Hard-cap: block charges that would exceed the spend cap unless override approved. */
export function scoreHardCap(input: ScoreInput): ScoreOutput {
  let breaches = 0;
  let blocked = 0;
  let risky = 0;
  for (const c of input.charges) {
    const over =
      c.wouldExceed || input.spentUsd + c.amountUsd > input.capUsd;
    if (!over) continue;
    risky += 1;
    if (!c.overrideApproved) {
      blocked += 1;
      if (c.amountUsd >= 50) breaches += 1;
    }
  }
  const blockRate = risky ? (blocked / risky) * 100 : 100;
  return {
    score: clamp(blockRate * 0.7 + (breaches === 0 ? 30 : 8)),
    trust: clamp(75 + blockRate * 0.2 - breaches * 10),
    escalated: breaches > 0,
    breachCount: breaches,
    blockRate: Math.round(blockRate * 10) / 10,
    rationale: `Hard-cap blocked=${blocked}/${risky} breaches=${breaches}`,
  };
}

/** Soft-warn: never block; only warn when spend exceeds the cap. */
export function scoreSoftWarn(input: ScoreInput): ScoreOutput {
  const over = input.charges.filter(
    (c) => c.wouldExceed || input.spentUsd + c.amountUsd > input.capUsd,
  ).length;
  return {
    score: clamp(58 - over * 4),
    trust: 42,
    escalated: false,
    breachCount: 0,
    blockRate: 0,
    rationale: `Soft-warn never blocks; ${over} over-cap charges proceed`,
  };
}
