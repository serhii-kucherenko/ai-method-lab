import {
  scoreCalendarWindow,
  scoreInterlockAware,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreInterlockAwareIndependent(input: ScoreInput): ScoreOutput {
  return scoreInterlockAware(input);
}

export function scoreCalendarWindowIndependent(input: ScoreInput): ScoreOutput {
  return scoreCalendarWindow(input);
}
