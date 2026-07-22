/**
 * Impl B — independent rewrite (check-lesserof-dual.mjs refundLineB).
 * Must agree with recover.ts on every golden.
 */
import type { ClaimLineInput, RecoverInput, RecoverResult } from "./recover.js";

function refundLineB(input: ClaimLineInput): RecoverResult {
  if (input.basket_other_ineligible) {
    return { status: "reject", reason: "basket_other" };
  }
  const paid = Number(input.duties_paid);
  const sub = Number(input.substitute_basis);
  if (!(paid >= 0) || !(sub >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.relabel_from_substitution) {
    return { status: "reject", reason: "claim_type_relabel" };
  }
  if (
    input.apply_usmca_lesser_of === true &&
    typeof input.usmca_partner_duty !== "number"
  ) {
    return { status: "reject", reason: "usmca_partner_missing" };
  }
  const mode = input.claim_type;
  if (mode === "direct_id" && input.force_lesser_of === true) {
    return { status: "reject", reason: "lesser_of_on_direct_id" };
  }
  if (mode === "direct_id" && input.apply_usmca_lesser_of === true) {
    return { status: "reject", reason: "usmca_on_direct_id" };
  }
  if (mode === "substitution" && input.skip_lesser_of === true) {
    return { status: "reject", reason: "skip_lesser_of_on_substitution" };
  }
  let column: number;
  switch (mode) {
    case "direct_id":
      column = paid;
      break;
    case "substitution":
      column = paid < sub ? paid : sub;
      break;
    default:
      return { status: "reject", reason: "unknown_claim_type" };
  }
  let out = column * 0.99;
  if (input.apply_usmca_lesser_of === true) {
    const partnerCap = Number(input.usmca_partner_duty) * 0.99;
    if (out > partnerCap) out = partnerCap;
  }
  return {
    status: "ok",
    refund: out,
    base_used: column,
    algorithm_version: "lesserof-v0",
  };
}

export function recoverB(input: RecoverInput): RecoverResult {
  if (input.mode === "multi_line") {
    const lines = input.lines ?? [];
    const line_refunds: number[] = [];
    let total = 0;
    for (const line of lines) {
      const got = refundLineB(line);
      if (got.status !== "ok") return got;
      line_refunds.push(got.refund);
      total += got.refund;
    }
    return {
      status: "ok",
      refund: total,
      line_refunds,
      algorithm_version: "lesserof-v0",
    };
  }
  return refundLineB(input);
}
