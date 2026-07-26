import { scoreAlwaysMax, scoreBudgetAware, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const budgetCap = 8 + (i % 15);
  const input: ScoreInput = {
    budgetCap,
    steps: [
      {
        id: "cheap",
        unitCost: 1 + (i % 4),
        quality: 55 + ((i * 5) % 35),
        maxTier: false,
      },
      {
        id: "mid",
        unitCost: 3 + (i % 5),
        quality: 65 + ((i * 3) % 30),
        maxTier: false,
      },
      {
        id: "max",
        unitCost: 9 + (i % 8),
        quality: 85 + (i % 12),
        maxTier: true,
      },
    ],
  };
  return {
    id: `ebs-${String(i + 1).padStart(3, "0")}`,
    input,
    budgetAware: scoreBudgetAware(input),
    alwaysMax: scoreAlwaysMax(input),
  };
});
