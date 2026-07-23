/**
 * Paper-inspired pathology-fit sketch: single-view baseline vs multi-expert scoring.
 * Lab method experiment — not the authors' model; not a clinical diagnostic tool.
 */

export type PathologyFitInput = {
  fit_depth?: number;
  /** Comma / pipe / > separated expert module tags (vision, vision-language, slide). */
  expert_tags?: string;
  /** Comma / pipe / > separated sample tile / slide feature tags. */
  sample_feature_tags?: string;
  /** Cheat: claim multi-expert while forcing single-view — must reject. */
  single_view_cheat?: boolean;
};

export type PathologyFitOk = {
  status: "ok";
  fit_steps: number;
  matched_tags: number;
  naive: {
    label: "single_view_baseline";
    fit_steps: 1;
    pathology_score: number;
  };
  integrated: {
    label: "multi_expert";
    fit_steps: number;
    pathology_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type PathologyFitReject = {
  status: "reject";
  reason: string;
};

export type PathologyFitResult = PathologyFitOk | PathologyFitReject;

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

export function tagOverlap(expertTags: string[], sampleFeatures: string[]): string[] {
  const sample = new Set(sampleFeatures);
  return expertTags.filter((t) => sample.has(t));
}

export function resolveFitSteps(input: PathologyFitInput): {
  fit_steps: number;
  matched: string[];
} {
  const hasExperts =
    input.expert_tags !== undefined &&
    String(input.expert_tags).length >= 0;
  if (hasExperts || input.sample_feature_tags !== undefined) {
    const expertTags = parseTags(String(input.expert_tags ?? ""));
    const sampleFeatures = parseTags(String(input.sample_feature_tags ?? ""));
    if (expertTags.length === 0 && sampleFeatures.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(expertTags, sampleFeatures);
    const fit_steps = Math.max(1, matched.length + (expertTags.length > 0 ? 1 : 0));
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.floor(raw), matched: [] };
}

export function scorePathologyFit(input: PathologyFitInput): PathologyFitResult {
  if (input.single_view_cheat === true) {
    return { status: "reject", reason: "single_view_cheat" };
  }
  const { fit_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "single_view_baseline" as const,
    fit_steps: 1 as const,
    pathology_score: 1,
  };
  const integrated = {
    label: "multi_expert" as const,
    fit_steps,
    pathology_score: fit_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_score: integrated.pathology_score - naive.pathology_score,
  };
}
