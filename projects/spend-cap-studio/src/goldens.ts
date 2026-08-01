import { scoreHardCap, scoreSoftWarn, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const capUsd = 500 + (i % 5) * 250;
  const spentUsd = Math.round(capUsd * (0.55 + (i % 7) * 0.07));
  const input: ScoreInput = {
    capUsd,
    spentUsd,
    charges: Array.from({ length: 3 + (i % 3) }, (_, j) => {
      const amountUsd = 20 + ((i * 13 + j * 17) % 180);
      const wouldExceed = spentUsd + amountUsd > capUsd || (i + j) % 2 === 0;
      return {
        id: `ch-${i}-${j}`,
        amountUsd,
        wouldExceed,
        overrideApproved: (i + j) % 5 === 0,
      };
    }),
  };
  return {
    id: `scs-${String(i + 1).padStart(3, "0")}`,
    input,
    hardCap: scoreHardCap(input),
    softWarn: scoreSoftWarn(input),
  };
});
