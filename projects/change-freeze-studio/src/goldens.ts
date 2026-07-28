import { scoreAlwaysAllow, scoreFreezeAware, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    freezeActive: i % 3 !== 0,
    requests: Array.from({ length: 3 + (i % 3) }, (_, j) => ({
      id: `cr-${i}-${j}`,
      duringFreeze: (i + j) % 2 === 0,
      approvedException: (i + j) % 5 === 0,
      risk: 20 + ((i * 7 + j * 11) % 70),
    })),
  };
  return {
    id: `cfs-${String(i + 1).padStart(3, "0")}`,
    input,
    freezeAware: scoreFreezeAware(input),
    alwaysAllow: scoreAlwaysAllow(input),
  };
});
