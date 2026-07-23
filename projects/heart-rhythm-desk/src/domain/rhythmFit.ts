/**
 * Paper-inspired rhythm-fit sketch: majority baseline vs long-tail-aware scoring.
 * Lab method experiment — not the authors' model; not a clinical ECG reader.
 */

export type RhythmFitInput = {
  fit_depth?: number;
  /** Comma / pipe / > separated rare (long-tail) rhythm class tags. */
  rare_class_tags?: string;
  /** Comma / pipe / > separated sample feature tags. */
  sample_feature_tags?: string;
  /** Cheat: claim long-tail-aware while forcing majority baseline — must reject. */
  majority_cheat?: boolean;
};

export type RhythmFitOk = {
  status: "ok";
  fit_steps: number;
  matched_tags: number;
  naive: {
    label: "majority_baseline";
    fit_steps: 1;
    rhythm_score: number;
  };
  integrated: {
    label: "long_tail_aware";
    fit_steps: number;
    rhythm_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type RhythmFitReject = {
  status: "reject";
  reason: string;
};

export type RhythmFitResult = RhythmFitOk | RhythmFitReject;

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

export function tagOverlap(rareClass: string[], sampleFeatures: string[]): string[] {
  const sample = new Set(sampleFeatures);
  return rareClass.filter((t) => sample.has(t));
}

export function resolveFitSteps(input: RhythmFitInput): {
  fit_steps: number;
  matched: string[];
} {
  const hasRare =
    input.rare_class_tags !== undefined &&
    String(input.rare_class_tags).length >= 0;
  if (hasRare || input.sample_feature_tags !== undefined) {
    const rareClass = parseTags(String(input.rare_class_tags ?? ""));
    const sampleFeatures = parseTags(String(input.sample_feature_tags ?? ""));
    if (rareClass.length === 0 && sampleFeatures.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(rareClass, sampleFeatures);
    const fit_steps = Math.max(1, matched.length + (rareClass.length > 0 ? 1 : 0));
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.floor(raw), matched: [] };
}

export function scoreRhythmFit(input: RhythmFitInput): RhythmFitResult {
  if (input.majority_cheat === true) {
    return { status: "reject", reason: "majority_cheat" };
  }
  const { fit_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "majority_baseline" as const,
    fit_steps: 1 as const,
    rhythm_score: 1,
  };
  const integrated = {
    label: "long_tail_aware" as const,
    fit_steps,
    rhythm_score: fit_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_score: integrated.rhythm_score - naive.rhythm_score,
  };
}
