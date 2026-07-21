/**
 * Dual-implementation cross-check for lesserof (seed only).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function refundLineA(input) {
  if (input.basket_other_ineligible === true) {
    return { status: "reject", reason: "basket_other" };
  }
  if (!(input.duties_paid >= 0) || !(input.substitute_basis >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.claim_type === "direct_id" && input.force_lesser_of === true) {
    return { status: "reject", reason: "lesser_of_on_direct_id" };
  }
  if (input.claim_type === "substitution" && input.skip_lesser_of === true) {
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
  let base;
  if (input.claim_type === "direct_id") base = input.duties_paid;
  else if (input.claim_type === "substitution") {
    base = Math.min(input.duties_paid, input.substitute_basis);
  } else return { status: "reject", reason: "unknown_claim_type" };

  let refund99 = 0.99 * base;
  if (input.apply_usmca_lesser_of === true) {
    refund99 = Math.min(refund99, 0.99 * input.usmca_partner_duty);
  }
  return { status: "ok", refund: refund99 };
}

function refundLineB(input) {
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
  if (mode === "substitution" && input.skip_lesser_of === true) {
    return { status: "reject", reason: "skip_lesser_of_on_substitution" };
  }
  let column;
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
    const partnerCap = input.usmca_partner_duty * 0.99;
    if (out > partnerCap) out = partnerCap;
  }
  return { status: "ok", refund: out };
}

function wrap(refundLine) {
  return function refund(input) {
    if (input.mode === "multi_line") {
      const line_refunds = [];
      let total = 0;
      for (const line of input.lines) {
        const got = refundLine(line);
        if (got.status !== "ok") return got;
        line_refunds.push(got.refund);
        total += got.refund;
      }
      return { status: "ok", refund: total, line_refunds };
    }
    return refundLine(input);
  };
}

const refundA = wrap(refundLineA);
const refundB = wrap(refundLineB);

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

function same(a, b) {
  if (a.status !== b.status) return false;
  if (a.status === "reject") return a.reason === b.reason;
  if (!nearlyEqual(a.refund, b.refund)) return false;
  if (a.line_refunds || b.line_refunds) {
    if (!a.line_refunds || !b.line_refunds) return false;
    if (a.line_refunds.length !== b.line_refunds.length) return false;
    return a.line_refunds.every((v, i) => nearlyEqual(v, b.line_refunds[i]));
  }
  return true;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("lesserof-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const a = refundA(doc.input);
  const b = refundB(doc.input);
  const want = doc.expect;
  const agree = same(a, b);
  let matchWant =
    a.status === want.status &&
    (want.status !== "ok" || nearlyEqual(a.refund, want.refund)) &&
    (!want.reason || a.reason === want.reason);
  if (matchWant && want.line_refunds) {
    matchWant =
      Array.isArray(a.line_refunds) &&
      a.line_refunds.length === want.line_refunds.length &&
      a.line_refunds.every((v, i) => nearlyEqual(v, want.line_refunds[i]));
  }
  const ok = agree && matchWant;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${doc.id}: A=${JSON.stringify(a)} B=${JSON.stringify(b)}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} lesserof dual-impl failure(s)`);
  process.exit(1);
}
console.log(`\nDual-impl green: ${files.length} lesserof fixtures`);
