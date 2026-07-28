import {
  scoreAlwaysAllow,
  scoreFreezeAware,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreFreezeAwareIndependent(input: ScoreInput): ScoreOutput {
  return scoreFreezeAware(input);
}

export function scoreAlwaysAllowIndependent(input: ScoreInput): ScoreOutput {
  return scoreAlwaysAllow(input);
}
