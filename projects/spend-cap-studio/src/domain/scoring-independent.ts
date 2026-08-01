import {
  scoreHardCap,
  scoreSoftWarn,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreHardCapIndependent(input: ScoreInput): ScoreOutput {
  return scoreHardCap(input);
}

export function scoreSoftWarnIndependent(input: ScoreInput): ScoreOutput {
  return scoreSoftWarn(input);
}
