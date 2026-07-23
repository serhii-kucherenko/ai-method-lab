/**
 * Dual-impl B: same disease-fit contract via reduce/set overlap.
 * Must agree with diseaseFit.ts on goldens.
 */

import type { DiseaseFitInput, DiseaseFitResult } from "./diseaseFit.js";
import { parseTags, tagOverlap } from "./diseaseFit.js";

function fitFromInput(input: DiseaseFitInput): {
  fit_steps: number;
  matched: string[];
} {
  if (input.indication_tags !== undefined || input.candidate_tags !== undefined) {
    const indication = parseTags(String(input.indication_tags ?? ""));
    const candidate = parseTags(String(input.candidate_tags ?? ""));
    if (indication.length === 0 && candidate.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(indication, candidate);
    const bonus = indication.reduce((n) => n + 0, 0) + (indication.length > 0 ? 1 : 0);
    const fit_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.trunc(raw), matched: [] };
}

export function scoreDiseaseFitB(input: DiseaseFitInput): DiseaseFitResult {
  if (input.unconditioned_cheat === true) {
    return { status: "reject", reason: "unconditioned_cheat" };
  }
  const { fit_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const diseaseScore = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive: {
      label: "unconditioned_generation",
      fit_steps: 1,
      disease_fit_score: naiveScore,
    },
    disease_aware: {
      label: "disease_conditioned",
      fit_steps,
      disease_fit_score: diseaseScore,
      matched,
    },
    delta_fit: diseaseScore - naiveScore,
  };
}
