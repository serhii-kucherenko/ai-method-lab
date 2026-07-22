/**
 * Impl B — independent rewrite (factor list reduce + switch gates).
 * Must agree with penalty.ts on every golden (status + penalty).
 */
import type { PenaltyInput, PenaltyResult, PenaltyStep } from "./penalty.js";

export function penaltyB(input: PenaltyInput): PenaltyResult {
  if (input.use_statutory_max) {
    return { status: "reject", reason: "statutory_max_cheat" };
  }
  if (input.additive_cheat) {
    return { status: "reject", reason: "additive_cheat" };
  }

  const gbp = +input.gbp_amount;
  const size = +input.size_pct;
  const history = +input.history_pct;
  const faith = +input.good_faith_pct;
  const quick = +input.quick_fix_pct;

  if (
    !(gbp > 0) ||
    [size, history, faith, quick].some((p) => !Number.isFinite(p) || p < 0 || p > 1)
  ) {
    return { status: "reject", reason: "bad_inputs" };
  }

  const cls = input.classification;
  switch (cls) {
    case "willful":
    case "repeat":
      if (size > 0) return { status: "reject", reason: "size_on_willful_or_repeat" };
      if (faith > 0) return { status: "reject", reason: "good_faith_ineligible" };
      if (quick > 0) return { status: "reject", reason: "quick_fix_ineligible" };
      break;
    case "fta":
      if (faith > 0) return { status: "reject", reason: "good_faith_ineligible" };
      if (quick > 0) return { status: "reject", reason: "quick_fix_ineligible" };
      break;
    case "serious":
      if (input.gravity_tier === "high" && quick > 0) {
        return { status: "reject", reason: "quick_fix_ineligible" };
      }
      break;
    default:
      break;
  }

  const ordered: Array<{ factor: PenaltyStep["factor"]; pct: number }> = [];
  if (cls !== "willful" && cls !== "repeat") {
    ordered.push({ factor: "size", pct: size });
  } else {
    ordered.push({ factor: "size", pct: 0 });
  }
  ordered.push(
    { factor: "history", pct: history },
    { factor: "good_faith", pct: faith },
    { factor: "quick_fix", pct: quick },
  );

  const steps: PenaltyStep[] = [];
  let balance = gbp;
  for (const { factor, pct } of ordered) {
    const balance_after = balance * (1 - pct);
    steps.push({ factor, pct, balance_before: balance, balance_after });
    balance = balance_after;
  }

  return {
    status: "ok",
    penalty: balance,
    algorithm_version: "oshamult-v0",
    steps,
  };
}
