import {
  scoreExpiryAware,
  scorePermanentOpen,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreExpiryAwareIndependent(input: ScoreInput): ScoreOutput {
  return scoreExpiryAware(input);
}

export function scorePermanentOpenIndependent(input: ScoreInput): ScoreOutput {
  return scorePermanentOpen(input);
}
