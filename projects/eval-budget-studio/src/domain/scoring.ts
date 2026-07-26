export type ScoreInput = {
  steps: { id: string; unitCost: number; quality: number; maxTier: boolean }[];
  budgetCap: number;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  forecastSpend: number;
  overrunRisk: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Budget-aware: pick steps under cap; flag overrun risk. */
export function scoreBudgetAware(input: ScoreInput): ScoreOutput {
  let spend = 0;
  let qualityAcc = 0;
  let used = 0;
  for (const step of input.steps) {
    if (spend + step.unitCost > input.budgetCap && used > 0) break;
    spend += step.unitCost;
    qualityAcc += step.quality;
    used += 1;
  }
  const avgQ = used ? qualityAcc / used : 0;
  const overrunRisk = clamp(((spend - input.budgetCap) / Math.max(1, input.budgetCap)) * 100 + 20);
  const under = spend <= input.budgetCap;
  return {
    score: clamp(avgQ * 0.7 + (under ? 25 : 5)),
    trust: clamp(under ? 80 + avgQ * 0.15 : 40 + avgQ * 0.2),
    escalated: !under,
    forecastSpend: Math.round(spend * 100) / 100,
    overrunRisk: under ? clamp(overrunRisk * 0.3) : clamp(Math.max(55, overrunRisk)),
    rationale: `Budget-aware used ${used}/${input.steps.length} steps spend=${spend} cap=${input.budgetCap}`,
  };
}

/** Always-max unconstrained spend. */
export function scoreAlwaysMax(input: ScoreInput): ScoreOutput {
  const spend = input.steps.reduce((s, x) => s + (x.maxTier ? x.unitCost : x.unitCost * 1.6), 0);
  const avgQ = input.steps.reduce((s, x) => s + x.quality, 0) / Math.max(1, input.steps.length);
  return {
    score: clamp(avgQ * 0.85 + 12),
    trust: 88,
    escalated: false,
    forecastSpend: Math.round(spend * 100) / 100,
    overrunRisk: clamp(((spend - input.budgetCap) / Math.max(1, input.budgetCap)) * 100 + 40),
    rationale: "Always-max path; ignore cap; higher spend",
  };
}
