/**
 * Paper oracle for lesserof (seed only — not a product).
 * Stacked TFTEA lesser-of + optional USMCA cap + direct-ID exemption + basket reject.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function refund(input) {
  if (input.basket_other_ineligible === true) {
    return { status: "reject", reason: "basket_other" };
  }
  if (!(input.duties_paid >= 0) || !(input.substitute_basis >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }

  const claim = input.claim_type;
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
    // Partner duty-free → recoverable customs duty capped at 0 under USMCA lesser-of
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
