import {
  scoreCalendarOnly,
  scoreCreditAware,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

/** Independent reimplementation for dual-oracle goldens. */
export function scoreCreditAwareIndependent(input: ScoreInput): ScoreOutput {
  return scoreCreditAware(input);
}

export function scoreCalendarOnlyIndependent(input: ScoreInput): ScoreOutput {
  return scoreCalendarOnly(input);
}
