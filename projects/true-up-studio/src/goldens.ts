import { scoreSeatRenewal, scoreUsageTrueUp, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    seatCount: 20 + (i % 40),
    seatPrice: 15 + (i % 10),
    lines: Array.from({ length: 2 + (i % 3) }, (_, j) => ({
      id: `m-${i}-${j}`,
      committedUnits: 100 + ((i + j) % 50) * 10,
      usedUnits: 80 + ((i * 3 + j * 17) % 200),
      unitPrice: 0.5 + (j % 3) * 0.25,
      overageRate: 0.8 + (j % 4) * 0.2,
    })),
  };
  return {
    id: `tus-${String(i + 1).padStart(3, "0")}`,
    input,
    usageTrueUp: scoreUsageTrueUp(input),
    seatRenewal: scoreSeatRenewal(input),
  };
});
