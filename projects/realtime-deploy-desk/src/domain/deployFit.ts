/**
 * Paper-inspired deploy-fit sketch: manual-tuning baseline vs harness-guided scoring.
 * Lab method experiment — not the authors' harness; not a production serving stack.
 */

export type DeployFitInput = {
  harness_depth?: number;
  /** Comma / pipe / > separated harness pass tags (ir-lift, measure-gate, placement). */
  harness_tags?: string;
  /** Comma / pipe / > separated config / workload feature tags. */
  config_feature_tags?: string;
  /** Cheat: claim harness-guided while forcing manual-tuning — must reject. */
  manual_cheat?: boolean;
};

export type DeployFitOk = {
  status: "ok";
  harness_steps: number;
  matched_tags: number;
  naive: {
    label: "manual_tuning_baseline";
    harness_steps: 1;
    deploy_score: number;
  };
  integrated: {
    label: "harness_guided";
    harness_steps: number;
    deploy_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type DeployFitReject = {
  status: "reject";
  reason: string;
};

export type DeployFitResult = DeployFitOk | DeployFitReject;

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

export function resolveFitSteps(input: DeployFitInput): {
  harness_steps: number;
  matched: string[];
} {
  const hasExperts =
    input.harness_tags !== undefined &&
    String(input.harness_tags).length >= 0;
  if (hasExperts || input.config_feature_tags !== undefined) {
    const expertTags = parseTags(String(input.harness_tags ?? ""));
    const sampleFeatures = parseTags(String(input.config_feature_tags ?? ""));
    if (expertTags.length === 0 && sampleFeatures.length === 0) {
      return { harness_steps: 1, matched: [] };
    }
    const matched = tagOverlap(expertTags, sampleFeatures);
    const harness_steps = Math.max(1, matched.length + (expertTags.length > 0 ? 1 : 0));
    return { harness_steps, matched };
  }
  const raw = Number(input.harness_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { harness_steps: 1, matched: [] };
  return { harness_steps: Math.floor(raw), matched: [] };
}

export function scoreDeployFit(input: DeployFitInput): DeployFitResult {
  if (input.manual_cheat === true) {
    return { status: "reject", reason: "manual_cheat" };
  }
  const { harness_steps, matched } = resolveFitSteps(input);
  const naive = {
    label: "manual_tuning_baseline" as const,
    harness_steps: 1 as const,
    deploy_score: 1,
  };
  const integrated = {
    label: "harness_guided" as const,
    harness_steps,
    deploy_score: harness_steps * 2 + 1,
    matched,
  };
  return {
    status: "ok",
    harness_steps,
    matched_tags: matched.length,
    naive,
    integrated,
    delta_score: integrated.deploy_score - naive.deploy_score,
  };
}
