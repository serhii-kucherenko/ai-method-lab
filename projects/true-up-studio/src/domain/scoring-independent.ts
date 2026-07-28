import {
  scoreSeatRenewal,
  scoreUsageTrueUp,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreUsageTrueUpIndependent(input: ScoreInput): ScoreOutput {
  return scoreUsageTrueUp(input);
}

export function scoreSeatRenewalIndependent(input: ScoreInput): ScoreOutput {
  return scoreSeatRenewal(input);
}
