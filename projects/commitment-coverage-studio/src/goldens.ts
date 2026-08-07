import {
  scoreCommitMatched,
  scoreOnDemandBlind,
} from "./domain/scoring";
import type { ScoreInput, ScoreOutput } from "./domain/types";

export type Golden = {
  id: string;
  scenario: "under" | "over" | "full" | "multi-family" | "multi-window";
  input: ScoreInput;
  pathA: ScoreOutput;
  pathB: ScoreOutput;
  deltaUsd: number;
};

function buildInput(i: number): { scenario: Golden["scenario"]; input: ScoreInput } {
  const base = new Date(Date.UTC(2026, 0, 1));
  const month = i % 6;
  const start = new Date(base);
  start.setUTCMonth(start.getUTCMonth() + month);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  const scenarioIndex = i % 5;
  const scenario: Golden["scenario"] =
    scenarioIndex === 0
      ? "under"
      : scenarioIndex === 1
        ? "over"
        : scenarioIndex === 2
          ? "full"
          : scenarioIndex === 3
            ? "multi-family"
            : "multi-window";

  const rate = 200 + (i % 10) * 80;
  let eligible = rate;
  if (scenario === "under") eligible = rate * (1.5 + (i % 4) * 0.25);
  if (scenario === "over") eligible = rate * (0.25 + (i % 5) * 0.1);
  if (scenario === "full") eligible = rate;

  if (scenario === "multi-family") {
    const input: ScoreInput = {
      window: { start: startIso, end: endIso },
      commitments: [
        {
          id: `c-${i}-a`,
          rateUsd: rate,
          termMonths: 12,
          lockStart: startIso,
          lockEnd: new Date(Date.UTC(2027, 0, 1)).toISOString(),
          family: "compute",
        },
        {
          id: `c-${i}-b`,
          rateUsd: rate * 0.5,
          termMonths: 12,
          lockStart: startIso,
          lockEnd: new Date(Date.UTC(2027, 0, 1)).toISOString(),
          family: "storage",
        },
      ],
      usage: [
        {
          windowStart: startIso,
          windowEnd: endIso,
          eligibleSpendUsd: Math.round(rate * 0.4),
          family: "compute",
        },
        {
          windowStart: startIso,
          windowEnd: endIso,
          eligibleSpendUsd: Math.round(rate * 1.2),
          family: "storage",
        },
      ],
    };
    return { scenario, input };
  }

  if (scenario === "multi-window") {
    const mid = new Date(start);
    mid.setUTCDate(15);
    const midIso = mid.toISOString();
    const input: ScoreInput = {
      window: { start: startIso, end: endIso },
      commitments: [
        {
          id: `c-${i}`,
          rateUsd: rate,
          termMonths: 12,
          lockStart: startIso,
          lockEnd: new Date(Date.UTC(2027, 6, 1)).toISOString(),
        },
      ],
      usage: [
        {
          windowStart: startIso,
          windowEnd: midIso,
          eligibleSpendUsd: Math.round(eligible * 0.4),
        },
        {
          windowStart: midIso,
          windowEnd: endIso,
          eligibleSpendUsd: Math.round(eligible * 0.7),
        },
      ],
    };
    return { scenario, input };
  }

  const input: ScoreInput = {
    window: { start: startIso, end: endIso },
    commitments: [
      {
        id: `c-${i}`,
        rateUsd: rate,
        termMonths: 12 + (i % 3) * 12,
        lockStart: startIso,
        lockEnd: new Date(Date.UTC(2027, 0, 1)).toISOString(),
        family: i % 7 === 0 ? "compute" : undefined,
      },
    ],
    usage: [
      {
        windowStart: startIso,
        windowEnd: endIso,
        eligibleSpendUsd: Math.round(eligible),
        family: i % 7 === 0 ? "compute" : undefined,
      },
    ],
  };
  return { scenario, input };
}

export const GOLDENS: Golden[] = Array.from({ length: 30 }, (_, i) => {
  const { scenario, input } = buildInput(i);
  const pathA = scoreCommitMatched(input);
  const pathB = scoreOnDemandBlind(input);
  return {
    id: `ccs-${String(i + 1).padStart(3, "0")}`,
    scenario,
    input,
    pathA,
    pathB,
    deltaUsd: Math.round((pathA.gapUsd - pathB.gapUsd) * 100) / 100,
  };
});
