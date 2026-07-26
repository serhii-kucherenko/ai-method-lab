import { scoreAlwaysStrong, scoreSelective, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const uncertainty = 20 + ((i * 11) % 70);
  const input: ScoreInput = {
    uncertainty,
    steps: [
      {
        id: "cheap",
        cost: 1 + (i % 3),
        confidence: 40 + ((i * 13) % 55),
        strong: false,
      },
      {
        id: "mid",
        cost: 3 + (i % 2),
        confidence: 50 + ((i * 7) % 40),
        strong: false,
      },
      {
        id: "strong",
        cost: 8 + (i % 4),
        confidence: 85 + (i % 10),
        strong: true,
      },
    ],
  };
  return {
    id: `sts-${String(i + 1).padStart(3, "0")}`,
    input,
    selective: scoreSelective(input),
    alwaysStrong: scoreAlwaysStrong(input),
  };
});
