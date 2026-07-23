/**
 * Dual-impl B: same virulence-fit contract via reduce/set overlap.
 * Must agree with virulenceFit.ts on goldens.
 */

import type { VirulenceFitInput, VirulenceFitResult } from "./virulenceFit.js";
import { parseTags, tagOverlap } from "./virulenceFit.js";

function fitFromInput(input: VirulenceFitInput): {
  fit_steps: number;
  matched: string[];
} {
  if (input.structural_tags !== undefined || input.evolutionary_tags !== undefined) {
    const structural = parseTags(String(input.structural_tags ?? ""));
    const evolutionary = parseTags(String(input.evolutionary_tags ?? ""));
    if (structural.length === 0 && evolutionary.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(structural, evolutionary);
    const bonus = structural.reduce((n) => n + 0, 0) + (structural.length > 0 ? 1 : 0);
    const fit_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.trunc(raw), matched: [] };
}

export function scoreVirulenceFitB(input: VirulenceFitInput): VirulenceFitResult {
  if (input.sequence_only_cheat === true) {
    return { status: "reject", reason: "sequence_only_cheat" };
  }
  const { fit_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive: {
      label: "sequence_only",
      fit_steps: 1,
      virulence_risk_score: naiveScore,
    },
    integrated: {
      label: "structural_evolutionary",
      fit_steps,
      virulence_risk_score: integratedScore,
      matched,
    },
    delta_risk: integratedScore - naiveScore,
  };
}
