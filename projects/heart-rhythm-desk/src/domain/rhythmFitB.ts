/**
 * Dual-impl B: same rhythm-fit contract via reduce/set overlap.
 * Must agree with rhythmFit.ts on goldens.
 */

import type { RhythmFitInput, RhythmFitResult } from "./rhythmFit.js";
import { parseTags, tagOverlap } from "./rhythmFit.js";

function fitFromInput(input: RhythmFitInput): {
  fit_steps: number;
  matched: string[];
} {
  if (input.rare_class_tags !== undefined || input.sample_feature_tags !== undefined) {
    const rareClass = parseTags(String(input.rare_class_tags ?? ""));
    const sampleFeatures = parseTags(String(input.sample_feature_tags ?? ""));
    if (rareClass.length === 0 && sampleFeatures.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(rareClass, sampleFeatures);
    const bonus = rareClass.reduce((n) => n + 0, 0) + (rareClass.length > 0 ? 1 : 0);
    const fit_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.trunc(raw), matched: [] };
}

export function scoreRhythmFitB(input: RhythmFitInput): RhythmFitResult {
  if (input.majority_cheat === true) {
    return { status: "reject", reason: "majority_cheat" };
  }
  const { fit_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive: {
      label: "majority_baseline",
      fit_steps: 1,
      rhythm_score: naiveScore,
    },
    integrated: {
      label: "long_tail_aware",
      fit_steps,
      rhythm_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
