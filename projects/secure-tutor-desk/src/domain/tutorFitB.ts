/**
 * Dual-impl B: same tutor-fit contract via reduce/set overlap.
 * Must agree with tutorFit.ts on goldens.
 */

import type { TutorFitInput, TutorFitResult } from "./tutorFit.js";
import { parseTags, tagOverlap } from "./tutorFit.js";

function fitFromInput(input: TutorFitInput): {
  orchestrate_steps: number;
  matched: string[];
} {
  if (input.role_tags !== undefined || input.intent_tags !== undefined) {
    const roleTags = parseTags(String(input.role_tags ?? ""));
    const intentFeatures = parseTags(String(input.intent_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { orchestrate_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const bonus = roleTags.reduce((n) => n + 0, 0) + (roleTags.length > 0 ? 1 : 0);
    const orchestrate_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { orchestrate_steps, matched };
  }
  const raw = Number(input.orchestrate_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { orchestrate_steps: 1, matched: [] };
  return { orchestrate_steps: Math.trunc(raw), matched: [] };
}

export function scoreTutorFitB(input: TutorFitInput): TutorFitResult {
  if (input.single_cheat === true) {
    return { status: "reject", reason: "single_cheat" };
  }
  const { orchestrate_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = orchestrate_steps * 2 + 1;
  return {
    status: "ok",
    orchestrate_steps,
    matched_tags: matched.length,
    naive: {
      label: "single_model_baseline",
      orchestrate_steps: 1,
      tutor_score: naiveScore,
    },
    integrated: {
      label: "multi_llm_orchestrated",
      orchestrate_steps,
      tutor_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
