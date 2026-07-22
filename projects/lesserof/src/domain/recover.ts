/**
 * Impl A — mirrors docs/ideas/lesserof-algorithm.md (check-lesserof-fixtures.mjs).
 * Stacked TFTEA lesser-of + optional USMCA cap + direct-ID exemption + basket reject.
 */

export type ClaimLineInput = {
  claim_type?: string;
  duties_paid?: number;
  substitute_basis?: number;
  apply_usmca_lesser_of?: boolean;
  usmca_partner_duty?: number;
  basket_other_ineligible?: boolean;
  force_lesser_of?: boolean;
  skip_lesser_of?: boolean;
  relabel_from_substitution?: boolean;
};

export type RecoverInput = ClaimLineInput & {
  mode?: "multi_line";
  lines?: ClaimLineInput[];
};

export type RecoverOk = {
  status: "ok";
  refund: number;
  base_used?: number;
  line_refunds?: number[];
  algorithm_version: "lesserof-v0";
};

export type RecoverReject = {
  status: "reject";
  reason: string;
};

export type RecoverResult = RecoverOk | RecoverReject;

function refundLine(input: ClaimLineInput): RecoverResult {
  if (input.basket_other_ineligible === true) {
    return { status: "reject", reason: "basket_other" };
  }
  if (!(Number(input.duties_paid) >= 0) || !(Number(input.substitute_basis) >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }

  const claim = input.claim_type;
  if (claim === "direct_id" && input.force_lesser_of === true) {
    return { status: "reject", reason: "lesser_of_on_direct_id" };
  }
  if (claim === "direct_id" && input.apply_usmca_lesser_of === true) {
    return { status: "reject", reason: "usmca_on_direct_id" };
  }
  if (claim === "substitution" && input.skip_lesser_of === true) {
    return { status: "reject", reason: "skip_lesser_of_on_substitution" };
  }
  if (input.relabel_from_substitution === true) {
    return { status: "reject", reason: "claim_type_relabel" };
  }
  if (
    input.apply_usmca_lesser_of === true &&
    typeof input.usmca_partner_duty !== "number"
  ) {
    return { status: "reject", reason: "usmca_partner_missing" };
  }

  let base: number;
  if (claim === "direct_id") {
    base = Number(input.duties_paid);
  } else if (claim === "substitution") {
    base = Math.min(Number(input.duties_paid), Number(input.substitute_basis));
  } else {
    return { status: "reject", reason: "unknown_claim_type" };
  }

  let refund99 = 0.99 * base;

  if (input.usmca_partner_duty === 0 && input.apply_usmca_lesser_of === true) {
    refund99 = Math.min(refund99, 0);
  } else if (
    typeof input.usmca_partner_duty === "number" &&
    input.apply_usmca_lesser_of === true
  ) {
    refund99 = Math.min(refund99, 0.99 * input.usmca_partner_duty);
  }

  return {
    status: "ok",
    refund: refund99,
    base_used: base,
    algorithm_version: "lesserof-v0",
  };
}

export function recover(input: RecoverInput): RecoverResult {
  if (input.mode === "multi_line") {
    const lines = input.lines ?? [];
    const line_refunds: number[] = [];
    let total = 0;
    for (const line of lines) {
      const got = refundLine(line);
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
  return refundLine(input);
}
