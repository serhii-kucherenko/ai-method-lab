import { scoreAlwaysMax, scoreBudgetAware } from "./domain/scoring";

export const memory = {
  budgets: ["Q3 eval budget"],
  members: ["owner@studio.local"],
  audits: ["budget pack locked"],
};

export function listFeatures() {
  return [
    "budget packs",
    "plans",
    "search",
    "forecasts",
    "caps",
    "spend forecast panel",
    "overrun risk panel",
    "quality gate",
    "overruns",
    "compare",
    "scoreboard",
    "bearer auth",
    "members",
    "HMAC webhook",
    "audit",
    "export",
    "pagination",
    "rate limit",
    "pricing",
    "demo",
    "onboarding",
    "flows",
    "honesty",
    "goldens",
    "offline demo",
    "guide",
    "settings",
  ];
}

export function demoScore() {
  const input = {
    budgetCap: 12,
    steps: [
      { id: "cheap", unitCost: 2, quality: 70, maxTier: false },
      { id: "mid", unitCost: 5, quality: 82, maxTier: false },
      { id: "max", unitCost: 14, quality: 94, maxTier: true },
    ],
  };
  return { budgetAware: scoreBudgetAware(input), alwaysMax: scoreAlwaysMax(input) };
}
