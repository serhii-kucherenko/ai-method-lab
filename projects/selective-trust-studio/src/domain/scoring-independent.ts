import type { ScoreInput, ScoreOutput } from "./scoring";

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Twin of scoreSelective — same numeric contract, alternate control flow. */
export function scoreSelectiveIndependent(input: ScoreInput): ScoreOutput {
  const uncertainty = clamp(input.uncertainty);
  const steps = [...input.steps];
  let cost = 0;
  let used = 0;
  let escalated = false;
  let i = 0;
  while (i < steps.length) {
    const step = steps[i]!;
    used += 1;
    cost += step.cost;
    const sureCheap = step.confidence >= 70 && uncertainty < 40 && !step.strong;
    const unsure = step.confidence < 70 || uncertainty >= 40;
    if (sureCheap) break;
    if (unsure) {
      escalated = true;
      if (step.strong) break;
    }
    i += 1;
  }
  return {
    score: clamp(100 - uncertainty * 0.45 + (escalated ? 8 : 0)),
    trust: clamp(100 - uncertainty * 0.55 + (escalated ? 12 : -10)),
    escalated,
    cascadeCost: Math.round(cost * 100) / 100,
    escalateRate: escalated
      ? clamp(35 + uncertainty * 0.4)
      : clamp(uncertainty * 0.2),
    rationale: `Selective cascade used ${used}/${input.steps.length} steps; cost ${cost}; escalate=${escalated}`,
  };
}

export function scoreAlwaysStrongIndependent(input: ScoreInput): ScoreOutput {
  let cost = 0;
  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i]!;
    cost += step.strong ? step.cost : step.cost * 1.8;
  }
  return {
    score: clamp(82 + Math.min(12, input.steps.length * 2) - input.uncertainty * 0.1),
    trust: 90,
    escalated: false,
    cascadeCost: Math.round(cost * 100) / 100,
    escalateRate: 0,
    rationale: "Always-strong path; never escalate; higher cost",
  };
}
