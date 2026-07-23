/**
 * Paper-inspired plan-fit sketch: single-agent baseline vs multi-agent ERP coordination.
 * Lab method experiment — not the authors' Agentic ERP platform; not a commercial ERP automation product.
 */

export type PlanFitInput = {
  plan_depth?: number;
  /** Comma / pipe / > separated role-aligned agent tags (coordinator, sales, inventory, …). */
  agent_roles?: string;
  /** Comma / pipe / > separated workflow-function tags (purchasing, finance, …). */
  workflow_tags?: string;
  /** Cheat: claim multi-agent while forcing single-agent — must reject. */
  single_cheat?: boolean;
};

export type PlanFitOk = {
  status: "ok";
  plan_steps: number;
  matched_roles: number;
  naive: {
    label: "single_agent_baseline";
    plan_steps: 1;
    plan_score: number;
  };
  integrated: {
    label: "multi_agent_coordinator";
    plan_steps: number;
    plan_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type PlanFitReject = {
  status: "reject";
  reason: string;
};

export type PlanFitResult = PlanFitOk | PlanFitReject;

export function parseTags(hint: string): string[] {
  const parts = hint
    .split(/[,>|]/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

export function tagOverlap(roleTags: string[], intentFeatures: string[]): string[] {
  const sample = new Set(intentFeatures);
  return roleTags.filter((t) => sample.has(t));
}

export function resolveFitSteps(input: PlanFitInput): {
  plan_steps: number;
  matched: string[];
} {
  const hasRoles =
    input.agent_roles !== undefined && String(input.agent_roles).length >= 0;
  if (hasRoles || input.workflow_tags !== undefined) {
    const roleTags = parseTags(String(input.agent_roles ?? ""));
    const intentFeatures = parseTags(String(input.workflow_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { plan_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const plan_steps = Math.max(
      1,
      matched.length + (roleTags.length > 0 ? 1 : 0),
    );
    return { plan_steps, matched };
  }
  const raw = Number(input.plan_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { plan_steps: 1, matched: [] };
  return { plan_steps: Math.floor(raw), matched: [] };
}

export function scorePlanFit(input: PlanFitInput): PlanFitResult {
  if (input.single_cheat === true) {
    return { status: "reject", reason: "single_cheat" };
  }
  const { plan_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "single_agent_baseline" as const,
    plan_steps: 1 as const,
    plan_score: 1,
  };
  const integrated = {
    label: "multi_agent_coordinator" as const,
    plan_steps,
    plan_score: plan_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    plan_steps,
    matched_roles: matched.length,
    naive,
    integrated,
    delta_score: integrated.plan_score - naive.plan_score,
  };
}
