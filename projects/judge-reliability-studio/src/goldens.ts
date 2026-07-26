import { scoreAgreement, scoreIrt, type ScoreInput } from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const missing = i % 4 === 0;
  const input: ScoreInput = {
    formFit: 52 + ((i * 7) % 45),
    items: [
      {
        id: "clarity",
        weight: 2,
        responses: missing ? [] : ["Judge names the policy and consequence"],
        expected: "specific policy",
      },
      {
        id: "grounding",
        weight: 3,
        responses: i % 3 ? ["Cites the evaluation record"] : [],
        expected: "source trace",
      },
      {
        id: "stability",
        weight: 1,
        responses: ["Declines unsupported promise"],
        expected: "stable boundary",
      },
    ],
  };
  return {
    id: `jrs-${String(i + 1).padStart(3, "0")}`,
    input,
    irt: scoreIrt(input),
    agreement: scoreAgreement(input),
  };
});
