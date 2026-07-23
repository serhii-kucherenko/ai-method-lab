/**
 * Dual-impl B: same pathology-fit contract via reduce/set overlap.
 * Must agree with pathologyFit.ts on goldens.
 */

import type { PathologyFitInput, PathologyFitResult } from "./pathologyFit.js";
import { parseTags, tagOverlap } from "./pathologyFit.js";

function fitFromInput(input: PathologyFitInput): {
  fit_steps: number;
  matched: string[];
} {
  if (input.expert_tags !== undefined || input.sample_feature_tags !== undefined) {
    const expertTags = parseTags(String(input.expert_tags ?? ""));
    const sampleFeatures = parseTags(String(input.sample_feature_tags ?? ""));
    if (expertTags.length === 0 && sampleFeatures.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(expertTags, sampleFeatures);
    const bonus = expertTags.reduce((n) => n + 0, 0) + (expertTags.length > 0 ? 1 : 0);
    const fit_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.trunc(raw), matched: [] };
}

export function scorePathologyFitB(input: PathologyFitInput): PathologyFitResult {
  if (input.single_view_cheat === true) {
    return { status: "reject", reason: "single_view_cheat" };
  }
  const { fit_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive: {
      label: "single_view_baseline",
      fit_steps: 1,
      pathology_score: naiveScore,
    },
    integrated: {
      label: "multi_expert",
      fit_steps,
      pathology_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
