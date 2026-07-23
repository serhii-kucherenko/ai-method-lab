/**
 * Paper-inspired tutor-fit sketch: single-model baseline vs multi-LLM orchestration.
 * Lab method experiment — not the authors' SYNAPSE platform; not a live course product.
 */

export type TutorFitInput = {
  orchestrate_depth?: number;
  /** Comma / pipe / > separated pedagogical role tags (socratic, practice, analogy, …). */
  role_tags?: string;
  /** Comma / pipe / > separated learner-intent / accessibility / OWASP feature tags. */
  intent_tags?: string;
  /** Cheat: claim multi-LLM while forcing single-model — must reject. */
  single_cheat?: boolean;
};

export type TutorFitOk = {
  status: "ok";
  orchestrate_steps: number;
  matched_tags: number;
  naive: {
    label: "single_model_baseline";
    orchestrate_steps: 1;
    tutor_score: number;
  };
  integrated: {
    label: "multi_llm_orchestrated";
    orchestrate_steps: number;
    tutor_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type TutorFitReject = {
  status: "reject";
  reason: string;
};

export type TutorFitResult = TutorFitOk | TutorFitReject;

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

export function resolveFitSteps(input: TutorFitInput): {
  orchestrate_steps: number;
  matched: string[];
} {
  const hasRoles =
    input.role_tags !== undefined && String(input.role_tags).length >= 0;
  if (hasRoles || input.intent_tags !== undefined) {
    const roleTags = parseTags(String(input.role_tags ?? ""));
    const intentFeatures = parseTags(String(input.intent_tags ?? ""));
    if (roleTags.length === 0 && intentFeatures.length === 0) {
      return { orchestrate_steps: 1, matched: [] };
    }
    const matched = tagOverlap(roleTags, intentFeatures);
    const orchestrate_steps = Math.max(
      1,
      matched.length + (roleTags.length > 0 ? 1 : 0),
    );
    return { orchestrate_steps, matched };
  }
  const raw = Number(input.orchestrate_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { orchestrate_steps: 1, matched: [] };
  return { orchestrate_steps: Math.floor(raw), matched: [] };
}

export function scoreTutorFit(input: TutorFitInput): TutorFitResult {
  if (input.single_cheat === true) {
    return { status: "reject", reason: "single_cheat" };
  }
  const { orchestrate_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "single_model_baseline" as const,
    orchestrate_steps: 1 as const,
    tutor_score: 1,
  };
  const integrated = {
    label: "multi_llm_orchestrated" as const,
    orchestrate_steps,
    tutor_score: orchestrate_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    orchestrate_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_score: integrated.tutor_score - naive.tutor_score,
  };
}
