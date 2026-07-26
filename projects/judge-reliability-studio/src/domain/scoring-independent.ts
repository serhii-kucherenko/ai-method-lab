import type { ScoreInput, ScoreOutput } from "./scoring";

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

export function scoreIrtIndependent(input: ScoreInput): ScoreOutput {
  let weight = 0;
  let supported = 0;
  let responseCount = 0;
  for (const c of input.items) {
    weight += c.weight;
    if (c.responses.length) supported += c.weight;
    responseCount += c.responses.length;
  }
  const coverage = supported / (weight || 1);
  const fit = Math.max(0, Math.min(100, input.formFit));
  const ability = clamp(fit * 0.6 + coverage * 40);
  const difficulty = clamp(100 - coverage * 100);
  const discrimination = clamp((responseCount / input.items.length) * 25);
  const trust = clamp((coverage * 0.65 + (fit / 100) * 0.35) * 100);
  return {
    score: clamp((coverage * 0.72 + (fit / 100) * 0.28) * 100),
    trust,
    escalated: trust < 70 || input.items.some((c) => c.responses.length === 0),
    ability,
    difficulty,
    discrimination,
    rationale: `${responseCount} item responses across ${input.items.length} scored items; ability ${ability}, discrimination ${discrimination}`,
  };
}

export function scoreAgreementIndependent(input: ScoreInput): ScoreOutput {
  let words = 0;
  input.items.forEach((c) =>
    c.responses.forEach((e) => {
      words += e.trim().split(/\s+/).filter(Boolean).length;
    }),
  );
  return {
    score: clamp(74 + Math.min(18, words / 7) + input.formFit * 0.08),
    trust: 88,
    escalated: false,
    ability: 88,
    difficulty: 12,
    discrimination: 0,
    rationale: "Pairwise agreement baseline without IRT diagnostics",
  };
}
