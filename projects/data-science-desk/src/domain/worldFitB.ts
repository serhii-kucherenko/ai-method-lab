/**
 * Dual-impl twin of worldFit.ts — must agree on all golden fixtures.
 */
import {
  resolvePlan,
  type WorldFitInput,
  type WorldFitResult,
} from "./worldFit.js";

export function scoreWorldFitB(input: WorldFitInput): WorldFitResult {
  if (input.step_burn_cheat === true) {
    return { status: "reject", reason: "step_burn_cheat" };
  }
  const { plan_steps, matched, light_hits, expensive_hits } = resolvePlan(input);
  const hasTags = input.op_kinds !== undefined;
  const naiveReal = hasTags
    ? Math.max(1, light_hits + expensive_hits || matched.length || 1)
    : plan_steps;
  const naiveCost = naiveReal * 2 + 1;
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
    delta_score: naiveCost - worldCost,
  };
}
