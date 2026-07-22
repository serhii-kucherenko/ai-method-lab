/**
 * Impl A — serial remaining-balance (Size → History → Good Faith → Quick Fix).
 * Mirrors docs/ideas/oshamult-algorithm.md / check-oshamult-fixtures.mjs.
 * Always returns steps[] on success (day-1 honesty).
 */

export type PenaltyInput = {
  classification?: string;
  gravity_tier?: string;
  gbp_amount: number;
  size_pct: number;
  history_pct: number;
  good_faith_pct: number;
  quick_fix_pct: number;
  use_statutory_max?: boolean;
  additive_cheat?: boolean;
};

export type PenaltyStep = {
  factor: "size" | "history" | "good_faith" | "quick_fix";
  pct: number;
  balance_before: number;
  balance_after: number;
};

export type PenaltyOk = {
  status: "ok";
  penalty: number;
  algorithm_version: "oshamult-v0";
  steps: PenaltyStep[];
};

export type PenaltyReject = {
  status: "reject";
  reason: string;
};

export type PenaltyResult = PenaltyOk | PenaltyReject;

function applyFactor(
  balance: number,
  factor: PenaltyStep["factor"],
  pct: number,
): PenaltyStep {
  const balance_after = balance * (1 - pct);
  return { factor, pct, balance_before: balance, balance_after };
}

export function penalty(input: PenaltyInput): PenaltyResult {
  const gbp = Number(input.gbp_amount);
  const size = Number(input.size_pct);
  const history = Number(input.history_pct);
  const faith = Number(input.good_faith_pct);
  const quick = Number(input.quick_fix_pct);

  if (
    !(gbp > 0) ||
    [size, history, faith, quick].some((p) => !Number.isFinite(p) || p < 0 || p > 1)
  ) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.use_statutory_max === true) {
    return { status: "reject", reason: "statutory_max_cheat" };
  }
  if (input.additive_cheat === true) {
    return { status: "reject", reason: "additive_cheat" };
  }

  const cls = input.classification;
  if ((cls === "willful" || cls === "repeat") && size > 0) {
    return { status: "reject", reason: "size_on_willful_or_repeat" };
  }
  if ((cls === "willful" || cls === "repeat" || cls === "fta") && faith > 0) {
    return { status: "reject", reason: "good_faith_ineligible" };
  }
  if (
    (cls === "willful" ||
      cls === "repeat" ||
      cls === "fta" ||
      (cls === "serious" && input.gravity_tier === "high")) &&
    quick > 0
  ) {
    return { status: "reject", reason: "quick_fix_ineligible" };
  }

  const steps: PenaltyStep[] = [];
  let amount = gbp;

  const sizePct = cls === "willful" || cls === "repeat" ? 0 : size;
  const sizeStep = applyFactor(amount, "size", sizePct);
  steps.push(sizeStep);
  amount = sizeStep.balance_after;

  const historyStep = applyFactor(amount, "history", history);
  steps.push(historyStep);
  amount = historyStep.balance_after;

  const faithStep = applyFactor(amount, "good_faith", faith);
  steps.push(faithStep);
  amount = faithStep.balance_after;

  const quickStep = applyFactor(amount, "quick_fix", quick);
  steps.push(quickStep);
  amount = quickStep.balance_after;

  return {
    status: "ok",
    penalty: amount,
    algorithm_version: "oshamult-v0",
    steps,
  };
}
