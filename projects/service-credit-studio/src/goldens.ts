import { scoreCalendarOnly, scoreCreditAware, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const monthlyFee = 2000 + (i % 10) * 500;
  const input: ScoreInput = {
    monthlyFee,
    creditPerMinute: 1.5 + (i % 5) * 0.5,
    creditCapPct: 20 + (i % 6) * 5,
    compoundFactor: 1.1 + (i % 4) * 0.05,
    incidents: [
      {
        id: `inc-a-${i}`,
        downtimeMinutes: 5 + (i % 40),
        excluded: i % 7 === 0,
        severity: 0.4 + (i % 6) * 0.1,
      },
      {
        id: `inc-b-${i}`,
        downtimeMinutes: i % 3 === 0 ? 0 : 8 + (i % 25),
        excluded: i % 11 === 0,
        severity: 0.5 + (i % 5) * 0.1,
      },
      {
        id: `inc-c-${i}`,
        downtimeMinutes: i % 4 === 0 ? 12 + (i % 18) : 0,
        excluded: false,
        severity: 0.6,
      },
    ],
  };
  return {
    id: `scs-${String(i + 1).padStart(3, "0")}`,
    input,
    creditAware: scoreCreditAware(input),
    calendarOnly: scoreCalendarOnly(input),
  };
});
