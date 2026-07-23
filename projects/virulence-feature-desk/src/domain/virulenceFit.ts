/**
 * Paper-inspired virulence-fit sketch: sequence-only vs structural+evolutionary.
 * Lab method experiment — not the authors' SEVA tool; not a clinical diagnostic.
 */

export type VirulenceFitInput = {
  fit_depth?: number;
  /** Comma / pipe / > separated structural feature tags. */
  structural_tags?: string;
  /** Comma / pipe / > separated evolutionary feature tags. */
  evolutionary_tags?: string;
  /** Cheat: claim integrated scoring while forcing sequence-only — must reject. */
  sequence_only_cheat?: boolean;
};

export type VirulenceFitOk = {
  status: "ok";
  fit_steps: number;
  matched_tags: number;
  naive: {
    label: "sequence_only";
    fit_steps: 1;
    virulence_risk_score: number;
  };
  integrated: {
    label: "structural_evolutionary";
    fit_steps: number;
    virulence_risk_score: number;
    matched: string[];
  };
  delta_risk: number;
};

export type VirulenceFitReject = {
  status: "reject";
  reason: string;
};

export type VirulenceFitResult = VirulenceFitOk | VirulenceFitReject;

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

export function tagOverlap(structural: string[], evolutionary: string[]): string[] {
  const evo = new Set(evolutionary);
  return structural.filter((t) => evo.has(t));
}

export function resolveFitSteps(input: VirulenceFitInput): {
  fit_steps: number;
  matched: string[];
} {
  const hasStructural =
    input.structural_tags !== undefined &&
    String(input.structural_tags).length >= 0;
  if (hasStructural || input.evolutionary_tags !== undefined) {
    const structural = parseTags(String(input.structural_tags ?? ""));
    const evolutionary = parseTags(String(input.evolutionary_tags ?? ""));
    if (structural.length === 0 && evolutionary.length === 0) {
      return { fit_steps: 1, matched: [] };
    }
    const matched = tagOverlap(structural, evolutionary);
    const fit_steps = Math.max(1, matched.length + (structural.length > 0 ? 1 : 0));
    return { fit_steps, matched };
  }
  const raw = Number(input.fit_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { fit_steps: 1, matched: [] };
  return { fit_steps: Math.floor(raw), matched: [] };
}

export function scoreVirulenceFit(input: VirulenceFitInput): VirulenceFitResult {
  if (input.sequence_only_cheat === true) {
    return { status: "reject", reason: "sequence_only_cheat" };
  }
  const { fit_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "sequence_only" as const,
    fit_steps: 1 as const,
    virulence_risk_score: 1,
  };
  const integrated = {
    label: "structural_evolutionary" as const,
    fit_steps,
    virulence_risk_score: fit_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    fit_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_risk: integrated.virulence_risk_score - naive.virulence_risk_score,
  };
}
