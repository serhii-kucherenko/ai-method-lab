import { scoreExpiryAware, scorePermanentOpen, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    graceHours: 1 + (i % 4),
    bypasses: Array.from({ length: 3 + (i % 3) }, (_, j) => ({
      id: `bp-${i}-${j}`,
      hoursOpen: 2 + ((i + j * 4) % 48),
      maxHours: 4 + (j % 3) * 4,
      restored: (i + j) % 5 === 0,
      critical: j === 0 || i % 7 === 0,
    })),
  };
  return {
    id: `bas-${String(i + 1).padStart(3, "0")}`,
    input,
    expiryAware: scoreExpiryAware(input),
    permanentOpen: scorePermanentOpen(input),
  };
});
