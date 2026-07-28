import {
  scorePatternRedact,
  scoreRawExport,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scorePatternRedactIndependent(input: ScoreInput): ScoreOutput {
  return scorePatternRedact(input);
}

export function scoreRawExportIndependent(input: ScoreInput): ScoreOutput {
  return scoreRawExport(input);
}
