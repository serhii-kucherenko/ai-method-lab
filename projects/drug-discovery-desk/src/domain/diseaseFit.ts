/**
 * Paper-inspired disease-fit sketch: unconditioned generation vs disease-conditioned.
 * Lab method experiment — not the authors' disease-aware language model.
 */

export type DiseaseFitInput = {
  fit_depth?: number;
  /** Comma / pipe / > separated indication tags for the disease context. */
  indication_tags?: string;
  /** Comma / pipe / > separated tags on the candidate molecule. */
  candidate_tags?: string;
  /** Cheat: claim disease-aware while forcing unconditioned scoring — must reject. */
  unconditioned_cheat?: boolean;
};

export type DiseaseFitOk = {
  status: "ok";
  fit_steps: number;
  matched_tags: number;
  naive: {
    label: "unconditioned_generation";
    fit_steps: 1;
    disease_fit_score: number;
  };
  disease_aware: {
    label: "disease_conditioned";
    fit_steps: number;
    disease_fit_score: number;
    matched: string[];
  };
  delta_fit: number;
};

export type DiseaseFitReject = {
  status: "reject";
  reason: string;
};

export type DiseaseFitResult = DiseaseFitOk | DiseaseFitReject;

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

export function tagOverlap(indication: string[], candidate: string[]): string[] {
  const cand = new Set(candidate);
  return indication.filter((t) => cand.has(t));
}

export function resolveFitSteps(input: DiseaseFitInput): {
  fit_steps: number;
  matched: string[];
} {
  const hasIndication =
    input.indication_tags !== undefined &&
    String(input.indication_tags).length >= 0;
  if (hasIndication || input.candidate_tags !== undefined) {
    const indication = parseTags(String(input.indication_tags ?? ""));
    const candidate = parseTags(String(input.candidate_tags ?? ""));
    if (indication.length === 0 && candidate.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(indication, candidate);
    const fit_steps = Math.max(1, matched.length + (indication.length > 0 ? 1 : 0));
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.floor(raw), matched: [] };
}

export function scoreDiseaseFit(input: DiseaseFitInput): DiseaseFitResult {
  if (input.unconditioned_cheat === true) {
    return { status: "reject", reason: "unconditioned_cheat" };
  }
  const { fit_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "unconditioned_generation" as const,
    fit_steps: 1 as const,
    disease_fit_score: 1,
  };
  const disease_aware = {
    label: "disease_conditioned" as const,
    fit_steps,
    disease_fit_score: fit_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive,
    disease_aware,
    delta_fit: disease_aware.disease_fit_score - naive.disease_fit_score,
  };
}
