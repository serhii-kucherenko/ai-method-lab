/**
 * Paper-inspired world-model efficiency sketch: naive step-burn baseline vs
 * world-model guided routing (simulate expensive ops, execute lightweight).
 * Lab method experiment — not the authors' DSWorld system; never brand as DSWorld.
 */

export type WorldFitInput = {
  plan_steps?: number;
  /** Comma / pipe / > separated op kinds. */
  op_kinds?: string;
  /** Cheat: claim world-model savings while forcing full step burn — must reject. */
  step_burn_cheat?: boolean;
};

export type WorldFitOk = {
  status: "ok";
  plan_steps: number;
  routed_ops: number;
  naive: {
    label: "naive_step_burn_baseline";
    real_steps: number;
    cost_score: number;
  };
  world: {
    label: "world_model_guided";
    real_steps: number;
    simulated_ops: number;
    cost_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type WorldFitReject = {
  status: "reject";
  reason: string;
};

export type WorldFitResult = WorldFitOk | WorldFitReject;

/** Ops cheap enough to execute for real. */
const LIGHTWEIGHT = new Set(["preview", "inspect", "filter"]);

/** Ops expensive enough to prefer world-model simulation. */
const EXPENSIVE = new Set([
  "train",
  "evaluate",
  "search",
  "feature_eng",
  "hyper_tune",
]);

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

export function tagOverlap(left: string[], right: string[]): string[] {
  const sample = new Set(right);
  return left.filter((t) => sample.has(t));
}

export function resolvePlan(
  input: WorldFitInput,
): {
  plan_steps: number;
  matched: string[];
  light_hits: number;
  expensive_hits: number;
} {
  const hasTags = input.op_kinds !== undefined;
  if (hasTags) {
    const ops = parseTags(String(input.op_kinds ?? ""));
    if (ops.length === 0) {
      return { plan_steps: 1, matched: [], light_hits: 0, expensive_hits: 0 };
    }
    const known = ops.filter((t) => LIGHTWEIGHT.has(t) || EXPENSIVE.has(t));
    const light_hits = ops.filter((t) => LIGHTWEIGHT.has(t)).length;
    const expensive_hits = ops.filter((t) => EXPENSIVE.has(t)).length;
    const plan_steps = Math.max(1, known.length || ops.length);
    return {
      plan_steps,
      matched: known.length ? known : ops,
      light_hits,
      expensive_hits,
    };
  }
  const raw = Number(input.plan_steps ?? 1);
  if (!Number.isFinite(raw) || raw < 1) {
    return { plan_steps: 1, matched: [], light_hits: 0, expensive_hits: 0 };
  }
  return {
    plan_steps: Math.floor(raw),
    matched: [],
    light_hits: 0,
    expensive_hits: 0,
  };
}

export function scoreWorldFit(input: WorldFitInput): WorldFitResult {
  if (input.step_burn_cheat === true) {
    return { status: "reject", reason: "step_burn_cheat" };
  }
  const { plan_steps, matched, light_hits, expensive_hits } = resolvePlan(input);
  const hasTags = input.op_kinds !== undefined;

  // Naive: burn every planned step as real execution.
  const naiveReal = hasTags
    ? Math.max(1, light_hits + expensive_hits || matched.length || 1)
    : plan_steps;
  const naiveCost = naiveReal * 2 + 1;

  // World-model: execute lightweight; simulate expensive (cost 1 each predict).
  const worldReal = hasTags
    ? Math.max(1, light_hits || (expensive_hits > 0 ? 1 : plan_steps))
    : Math.max(1, Math.ceil(plan_steps / 3));
  const simulated = hasTags ? expensive_hits : Math.max(0, plan_steps - worldReal);
  const worldCost = worldReal + simulated;

  return {
    status: "ok",
    plan_steps,
    routed_ops: matched.length,
    naive: {
      label: "naive_step_burn_baseline",
      real_steps: naiveReal,
      cost_score: naiveCost,
    },
    world: {
      label: "world_model_guided",
      real_steps: worldReal,
      simulated_ops: simulated,
      cost_score: worldCost,
      matched,
    },
    // Positive delta means world-model is cheaper (naive cost − world cost).
    delta_score: naiveCost - worldCost,
  };
}
