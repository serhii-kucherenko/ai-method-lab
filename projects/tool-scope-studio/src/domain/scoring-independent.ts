import {
  scoreOpenTools,
  scoreScopeBound,
  type ScoreInput,
  type ScoreOutput,
} from "./scoring";

export function scoreScopeBoundIndependent(input: ScoreInput): ScoreOutput {
  return scoreScopeBound(input);
}

export function scoreOpenToolsIndependent(input: ScoreInput): ScoreOutput {
  return scoreOpenTools(input);
}
