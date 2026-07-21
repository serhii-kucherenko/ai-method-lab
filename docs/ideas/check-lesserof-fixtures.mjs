/**
 * Paper oracle for lesserof (seed only — not a product).
 * Stacked TFTEA lesser-of + optional USMCA cap + direct-ID exemption + basket reject.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function refundLine(input) {
  if (input.basket_other_ineligible === true) {
    return { status: "reject", reason: "basket_other" };
  }
  if (!(input.duties_paid >= 0) || !(input.substitute_basis >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }

  const claim = input.claim_type;
  if (claim === "direct_id" && input.force_lesser_of === true) {
    return { status: "reject", reason: "lesser_of_on_direct_id" };
  }
  if (claim === "substitution" && input.skip_lesser_of === true) {
    return { status: "reject", reason: "skip_lesser_of_on_substitution" };
  }
  if (input.relabel_from_substitution === true) {
    return { status: "reject", reason: "claim_type_relabel" };
  }

  let base;
  if (claim === "direct_id") {
    base = input.duties_paid;
  } else if (claim === "substitution") {
    base = Math.min(input.duties_paid, input.substitute_basis);
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
  };
}

function refund(input) {
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
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("lesserof-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = refund(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok = nearlyEqual(got.refund, want.refund);
    if (ok && want.line_refunds) {
      ok =
        Array.isArray(got.line_refunds) &&
        got.line_refunds.length === want.line_refunds.length &&
        got.line_refunds.every((v, i) => nearlyEqual(v, want.line_refunds[i]));
    }
  }
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: got=${JSON.stringify(got)}`);
}

if (failed > 0) {
  console.error(`\n${failed} lesserof fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} lesserof fixture(s) green`);
