/**
 * Dual-implementation cross-check for lesserof (seed only).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

/** Impl A — step order from check-lesserof-fixtures.mjs */
function refundA(input) {
  if (input.basket_other_ineligible === true) {
    return { status: "reject", reason: "basket_other" };
  }
  if (!(input.duties_paid >= 0) || !(input.substitute_basis >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  let base;
  if (input.claim_type === "direct_id") base = input.duties_paid;
  else if (input.claim_type === "substitution") {
    base = Math.min(input.duties_paid, input.substitute_basis);
  } else return { status: "reject", reason: "unknown_claim_type" };

  let refund99 = 0.99 * base;
  if (input.apply_usmca_lesser_of === true) {
    const partner =
      typeof input.usmca_partner_duty === "number" ? input.usmca_partner_duty : 0;
    refund99 = Math.min(refund99, 0.99 * partner);
  }
  return { status: "ok", refund: refund99 };
}

/** Impl B — rewritten: eligibility first, then claim-mode branch, then stack USMCA. */
function refundB(input) {
  if (input.basket_other_ineligible) {
    return { status: "reject", reason: "basket_other" };
  }
  const paid = Number(input.duties_paid);
  const sub = Number(input.substitute_basis);
  if (!(paid >= 0) || !(sub >= 0)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const mode = input.claim_type;
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
  if (input.apply_usmca_lesser_of) {
    const partnerDuty = Number(input.usmca_partner_duty);
    const partnerCap = Number.isFinite(partnerDuty) ? partnerDuty * 0.99 : 0;
    if (out > partnerCap) out = partnerCap;
  }
  return { status: "ok", refund: out };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

function same(a, b) {
  if (a.status !== b.status) return false;
  if (a.status === "reject") return a.reason === b.reason;
  return nearlyEqual(a.refund, b.refund);
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
  const matchWant =
    a.status === want.status &&
    (want.status !== "ok" || nearlyEqual(a.refund, want.refund)) &&
    (!want.reason || a.reason === want.reason);
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
