/**
 * Paper-inspired safety-fit sketch: checklist baseline vs structural monitoring.
 * Lab method experiment — not the authors' IFG platform; not a commercial agent safety product.
 */

export type SafetyFitInput = {
  monitor_depth?: number;
  /** Comma / pipe / > separated invariant node tags (invariant, edge, node-class, …). */
  invariant_tags?: string;
  /** Comma / pipe / > separated regression-signal / privilege / OWASP feature tags. */
  regression_tags?: string;
  /** Cheat: claim structural while forcing checklist — must reject. */
  checklist_cheat?: boolean;
};

export type SafetyFitOk = {
  status: "ok";
  monitor_steps: number;
  matched_tags: number;
  naive: {
    label: "checklist_baseline";
    monitor_steps: 1;
    safety_score: number;
  };
  integrated: {
    label: "structural_monitor";
    monitor_steps: number;
    safety_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type SafetyFitReject = {
  status: "reject";
  reason: string;
};

export type SafetyFitResult = SafetyFitOk | SafetyFitReject;

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

export function resolveFitSteps(input: SafetyFitInput): {
  monitor_steps: number;
  matched: string[];
} {
  const hasRoles =
    input.invariant_tags !== undefined && String(input.invariant_tags).length >= 0;
  if (hasRoles || input.regression_tags !== undefined) {
    const roleTags = parseTags(String(input.invariant_tags ?? ""));
    const intentFeatures = parseTags(String(input.regression_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { monitor_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const monitor_steps = Math.max(
      1,
      matched.length + (roleTags.length > 0 ? 1 : 0),
    );
    return { monitor_steps, matched };
  }
  const raw = Number(input.monitor_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { monitor_steps: 1, matched: [] };
  return { monitor_steps: Math.floor(raw), matched: [] };
}

export function scoreSafetyFit(input: SafetyFitInput): SafetyFitResult {
  if (input.checklist_cheat === true) {
    return { status: "reject", reason: "checklist_cheat" };
  }
  const { monitor_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "checklist_baseline" as const,
    monitor_steps: 1 as const,
    safety_score: 1,
  };
  const integrated = {
    label: "structural_monitor" as const,
    monitor_steps,
    safety_score: monitor_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    monitor_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_score: integrated.safety_score - naive.safety_score,
  };
}
