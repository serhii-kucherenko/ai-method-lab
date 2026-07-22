/**
 * Impl B — greater-of first, then fold year-part tiers (slice loop).
 */
import type { ExciseInput, ExciseResult } from "./excise.js";

export function exciseB(input: ExciseInput): ExciseResult {
  if (input.flat_excise_cheat) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  if (input.skip_additional_tax === true && input.corrected !== true) {
    return { status: "reject", reason: "second_tier_skip_cheat" };
  }
  let amount: number;
  if (typeof input.fmv_a === "number" && typeof input.fmv_b === "number") {
    const greater = input.fmv_a > input.fmv_b ? input.fmv_a : input.fmv_b;
    if (
      input.understate_amount === true &&
      typeof input.amount_involved === "number" &&
      input.amount_involved < greater
    ) {
      return { status: "reject", reason: "greater_of_cheat" };
    }
    amount = input.use_fmv_greater_of ? greater : Number(input.amount_involved);
    if (!input.use_fmv_greater_of && !(amount > 0)) amount = greater;
  } else {
    amount = Number(input.amount_involved);
  }
  const years = Number(input.year_parts);
  if (!(amount > 0) || !(years > 0) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  let initial_tax = 0;
  let remaining = years;
  while (remaining > 0) {
    const slice = remaining >= 1 ? 1 : remaining;
    initial_tax += 0.15 * amount * slice;
    remaining -= slice;
  }
  const additional_tax = input.corrected === true ? 0 : amount;
  return {
    status: "ok",
    initial_tax,
    additional_tax,
    total: initial_tax + additional_tax,
    algorithm_version: "ptax4975-v0",
  };
}
