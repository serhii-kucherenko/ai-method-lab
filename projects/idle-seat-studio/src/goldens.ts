import { scoreHeadcountOnly, scoreUsageAware, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    idleThresholdDays: 14 + (i % 10),
    reclaimFriction: 0.1 + (i % 5) * 0.05,
    seats: Array.from({ length: 4 + (i % 4) }, (_, j) => ({
      id: `seat-${i}-${j}`,
      monthlyCost: 20 + ((i + j) % 8) * 5,
      activeDays: (i + j * 3) % 20,
      lastLoginDaysAgo: (i * 2 + j * 5) % 40,
    })),
  };
  return {
    id: `iss-${String(i + 1).padStart(3, "0")}`,
    input,
    usageAware: scoreUsageAware(input),
    headcountOnly: scoreHeadcountOnly(input),
  };
});
