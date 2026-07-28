import { scorePatternRedact, scoreRawExport, type ScoreInput } from "./domain/scoring";

const KINDS = ["api_key", "password", "token", "pii"] as const;

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    exportRequested: i % 4 !== 0,
    findings: Array.from({ length: 3 + (i % 3) }, (_, j) => {
      const matched = (i + j) % 5 !== 0;
      return {
        id: `f-${i}-${j}`,
        kind: KINDS[(i + j) % KINDS.length],
        matched,
        redacted: matched && (i + j) % 3 !== 0,
      };
    }),
  };
  return {
    id: `srs-${String(i + 1).padStart(3, "0")}`,
    input,
    patternRedact: scorePatternRedact(input),
    rawExport: scoreRawExport(input),
  };
});
