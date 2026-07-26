import {
  scoreHeadcountOnly,
  scoreUsageAware,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreUsageAwareIndependent(input: ScoreInput): ScoreOutput {
  return scoreUsageAware(input);
}

export function scoreHeadcountOnlyIndependent(input: ScoreInput): ScoreOutput {
  return scoreHeadcountOnly(input);
}
