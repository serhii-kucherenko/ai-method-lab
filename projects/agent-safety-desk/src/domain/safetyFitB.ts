/**
 * Dual-impl B: same tutor-fit contract via reduce/set overlap.
 * Must agree with safetyFit.ts on goldens.
 */

import type { SafetyFitInput, SafetyFitResult } from "./safetyFit.js";
import { parseTags, tagOverlap } from "./safetyFit.js";

function fitFromInput(input: SafetyFitInput): {
  monitor_steps: number;
  matched: string[];
} {
  if (input.invariant_tags !== undefined || input.regression_tags !== undefined) {
    const roleTags = parseTags(String(input.invariant_tags ?? ""));
    const intentFeatures = parseTags(String(input.regression_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { monitor_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const bonus = roleTags.reduce((n) => n + 0, 0) + (roleTags.length > 0 ? 1 : 0);
    const monitor_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { monitor_steps, matched };
  }
  const raw = Number(input.monitor_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { monitor_steps: 1, matched: [] };
  return { monitor_steps: Math.trunc(raw), matched: [] };
}

export function scoreSafetyFitB(input: SafetyFitInput): SafetyFitResult {
  if (input.checklist_cheat === true) {
    return { status: "reject", reason: "checklist_cheat" };
  }
  const { monitor_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = monitor_steps * 2 + 1;
  return {
    status: "ok",
    monitor_steps,
    matched_tags: matched.length,
    naive: {
      label: "checklist_baseline",
      monitor_steps: 1,
      safety_score: naiveScore,
    },
    integrated: {
      label: "structural_monitor",
      monitor_steps,
      safety_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
