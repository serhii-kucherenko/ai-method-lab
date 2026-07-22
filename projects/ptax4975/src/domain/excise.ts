/**
 * Impl A — 15% × year-parts + 100% if uncorrected (+ optional greater-of FMV).
 */
export type ExciseInput = {
  amount_involved?: number;
  year_parts?: number;
  corrected?: boolean;
  fmv_a?: number;
  fmv_b?: number;
  use_fmv_greater_of?: boolean;
  understate_amount?: boolean;
  flat_excise_cheat?: boolean;
  dual_approver_cheat?: boolean;
  skip_additional_tax?: boolean;
};

export type ExciseOk = {
  status: "ok";
  initial_tax: number;
  additional_tax: number;
  total: number;
  algorithm_version: "ptax4975-v0";
};

export type ExciseReject = {
  status: "reject";
  reason: string;
};

export type ExciseResult = ExciseOk | ExciseReject;

function resolveAmount(input: ExciseInput): { amount: number } | { error: string } {
  const hasFmv =
    typeof input.fmv_a === "number" && typeof input.fmv_b === "number";
  if (hasFmv) {
    const greater = Math.max(input.fmv_a!, input.fmv_b!);
    if (
      typeof input.amount_involved === "number" &&
      input.amount_involved + 1e-9 < greater &&
      input.understate_amount === true
    ) {
      return { error: "greater_of_cheat" };
    }
    if (typeof input.amount_involved === "number" && !input.use_fmv_greater_of) {
      return { amount: input.amount_involved };
    }
    return { amount: greater };
  }
  return { amount: Number(input.amount_involved) };
}

export function excise(input: ExciseInput): ExciseResult {
  if (input.flat_excise_cheat === true) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  if (input.skip_additional_tax === true && input.corrected !== true) {
    return { status: "reject", reason: "second_tier_skip_cheat" };
  }
  const resolved = resolveAmount(input);
  if ("error" in resolved) {
    return { status: "reject", reason: resolved.error };
  }
  const amount = resolved.amount;
  const years = Number(input.year_parts);
  if (!(amount > 0) || !(years > 0) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const initial_tax = 0.15 * amount * years;
  const additional_tax = input.corrected === true ? 0 : amount;
  return {
    status: "ok",
    initial_tax,
    additional_tax,
    total: initial_tax + additional_tax,
    algorithm_version: "ptax4975-v0",
  };
}
