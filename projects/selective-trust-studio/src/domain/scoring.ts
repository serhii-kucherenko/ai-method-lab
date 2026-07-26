export type ScoreInput = {
  steps: { id: string; cost: number; confidence: number; strong: boolean }[];
  uncertainty: number;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  cascadeCost: number;
  escalateRate: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Selective trust: use cheap steps when confident; escalate when unsure. */
export function scoreSelective(input: ScoreInput): ScoreOutput {
  const uncertainty = clamp(input.uncertainty);
  let cost = 0;
  let used = 0;
  let escalated = false;
  for (const step of input.steps) {
    used += 1;
    cost += step.cost;
    if (step.confidence >= 70 && uncertainty < 40 && !step.strong) {
      break;
    }
    if (step.confidence < 70 || uncertainty >= 40) {
      escalated = true;
      if (step.strong) break;
    }
  }
  const quality = clamp(100 - uncertainty * 0.45 + (escalated ? 8 : 0));
  const trust = clamp(100 - uncertainty * 0.55 + (escalated ? 12 : -10));
  const escalateRate = escalated ? clamp(35 + uncertainty * 0.4) : clamp(uncertainty * 0.2);
  return {
    score: quality,
    trust,
    escalated,
    cascadeCost: Math.round(cost * 100) / 100,
    escalateRate,
    rationale: `Selective cascade used ${used}/${input.steps.length} steps; cost ${cost}; escalate=${escalated}`,
  };
}

/** Always-strong never-escalate baseline. */
export function scoreAlwaysStrong(input: ScoreInput): ScoreOutput {
  const cost = input.steps.reduce((s, x) => s + (x.strong ? x.cost : x.cost * 1.8), 0);
  const score = clamp(82 + Math.min(12, input.steps.length * 2) - input.uncertainty * 0.1);
  return {
    score,
    trust: 90,
    escalated: false,
    cascadeCost: Math.round(cost * 100) / 100,
    escalateRate: 0,
    rationale: "Always-strong path; never escalate; higher cost",
  };
}
