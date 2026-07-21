/**
 * Research checker — ndcswap TE fixtures.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function tePairOk(aRaw, bRaw) {
  const a = String(aRaw).toUpperCase();
  const b = String(bRaw).toUpperCase();
  if (!a.startsWith("A") || !b.startsWith("A")) {
    return { ok: false, reason: "te_not_substitutable" };
  }
  const abSuffix = (t) => {
    const m = t.match(/^AB(\d*)$/);
    return m ? m[1] : null;
  };
  const sa = abSuffix(a);
  const sb = abSuffix(b);
  if (sa !== null && sb !== null) {
    if (sa !== sb) return { ok: false, reason: "te_suffix_mismatch" };
    return { ok: true };
  }
  if (sa !== null || sb !== null) {
    return { ok: false, reason: "te_class_mismatch" };
  }
  if (a !== b) return { ok: false, reason: "te_class_mismatch" };
  return { ok: true };
}

function evaluate(fix) {
  if (!fix.same_ingredient_strength_form) {
    return { allow: false, reason: "ingredient_strength_form" };
  }
  if (fix.brand_medically_necessary) {
    return { allow: false, reason: "brand_medically_necessary" };
  }
  if (fix.daw === 1 || fix.daw === 2) {
    return { allow: false, reason: "daw_blocks" };
  }
  const te = tePairOk(fix.te_code_prescribed, fix.te_code_candidate);
  if (!te.ok) return { allow: false, reason: te.reason };
  return { allow: true };
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const files = readdirSync(dir).filter((f) => f.startsWith("ndcswap-") && f.endsWith(".json"));
let failed = 0;
for (const f of files) {
  const fix = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const got = evaluate(fix);
  const ok =
    got.allow === fix.expect.allow &&
    (fix.expect.reason === undefined || got.reason === fix.expect.reason);
  if (!ok) {
    console.error("FAIL", f, { got, expect: fix.expect });
    failed += 1;
  } else console.log("ok", f);
}
if (failed) process.exit(1);
console.log(`ndcswap fixtures: ${files.length} ok`);
