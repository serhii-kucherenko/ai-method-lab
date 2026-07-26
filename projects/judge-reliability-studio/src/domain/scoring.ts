export type ScoreInput = {
  items: { id: string; weight: number; responses: string[]; expected: string }[];
  formFit: number;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  ability: number;
  difficulty: number;
  discrimination: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

export function scoreIrt(input: ScoreInput): ScoreOutput {
  const total = input.items.reduce((sum, c) => sum + c.weight, 0) || 1;
  const responseCount = input.items.reduce((sum, c) => sum + c.responses.length, 0);
  const coverage =
    input.items.reduce((sum, c) => sum + (c.responses.length ? c.weight : 0), 0) / total;
  const fit = clamp(input.formFit);
  const ability = clamp(fit * 0.6 + coverage * 40);
  const difficulty = clamp(100 - coverage * 100);
  const discrimination = clamp((responseCount / input.items.length) * 25);
  const score = clamp(100 * (coverage * 0.72 + (fit / 100) * 0.28));
  const trust = clamp(100 * (coverage * 0.65 + (fit / 100) * 0.35));
  return {
    score,
    trust,
    escalated: trust < 70 || input.items.some((c) => !c.responses.length),
    ability,
    difficulty,
    discrimination,
    rationale: `${responseCount} item responses across ${input.items.length} scored items; ability ${ability}, discrimination ${discrimination}`,
  };
}

export function scoreAgreement(input: ScoreInput): ScoreOutput {
  const words = input.items
    .flatMap((c) => c.responses)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const score = clamp(74 + Math.min(18, words / 7) + input.formFit * 0.08);
  return {
    score,
    trust: 88,
    escalated: false,
    ability: 88,
    difficulty: 12,
    discrimination: 0,
    rationale: "Pairwise agreement baseline without IRT diagnostics",
  };
}
