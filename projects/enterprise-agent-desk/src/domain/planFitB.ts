/**
 * Dual-impl B: same tutor-fit contract via reduce/set overlap.
 * Must agree with planFit.ts on goldens.
 */

import type { PlanFitInput, PlanFitResult } from "./planFit.js";
import { parseTags, tagOverlap } from "./planFit.js";

function fitFromInput(input: PlanFitInput): {
  plan_steps: number;
  matched: string[];
} {
  if (input.agent_roles !== undefined || input.workflow_tags !== undefined) {
    const roleTags = parseTags(String(input.agent_roles ?? ""));
    const intentFeatures = parseTags(String(input.workflow_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { plan_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const bonus = roleTags.reduce((n) => n + 0, 0) + (roleTags.length > 0 ? 1 : 0);
    const plan_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { plan_steps, matched };
  }
  const raw = Number(input.plan_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { plan_steps: 1, matched: [] };
  return { plan_steps: Math.trunc(raw), matched: [] };
}

export function scorePlanFitB(input: PlanFitInput): PlanFitResult {
  if (input.single_cheat === true) {
    return { status: "reject", reason: "single_cheat" };
  }
  const { plan_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = plan_steps * 2 + 1;
  return {
    status: "ok",
    plan_steps,
    matched_roles: matched.length,
    naive: {
      label: "single_agent_baseline",
      plan_steps: 1,
      plan_score: naiveScore,
    },
    integrated: {
      label: "multi_agent_coordinator",
      plan_steps,
      plan_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
