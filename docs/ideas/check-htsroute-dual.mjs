/**
 * Dual-implementation cross-check for htsroute.
 * Two independent routers must agree on every fixture.
 * Research oracle only — not a product.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

const DOSE_FORMS = new Set([
  "tablet",
  "capsule",
  "injectable_vial",
  "transdermal",
]);
const BULK_PURE = new Set(["bulk_drum", "powder_bulk"]);
const MIXED_BULK = new Set(["bulk_pellets", "other", "unknown"]);
const BULK_SHAPES = new Set(["bulk_drum", "powder_bulk", "bulk_pellets"]);

/** Implementation A — step table (canonical algorithm.md order). */
function routeA(sku) {
  if (sku.gri3_combination) return "reject";
  if (sku.note_1a_food_or_supplement) return "excluded_note_1a";
  const doseOrRetail = Boolean(sku.measured_dose || sku.retail_packing);
  if (DOSE_FORMS.has(sku.dosage_form_signal) && !doseOrRetail) return "reject";
  if (sku.therapeutic_or_prophylactic && doseOrRetail) {
    if (BULK_SHAPES.has(sku.dosage_form_signal)) return "reject";
    return "heading_3004_medicament";
  }
  if (
    sku.therapeutic_or_prophylactic &&
    sku.chemical_form === "mixture" &&
    !sku.measured_dose &&
    !sku.retail_packing &&
    MIXED_BULK.has(sku.dosage_form_signal)
  ) {
    return "heading_3003_bulk_medicament";
  }
  if (
    sku.chemical_form === "separately_defined" &&
    BULK_PURE.has(sku.dosage_form_signal)
  ) {
    return "chapter_29_chemical";
  }
  return "reject";
}

/** Implementation B — decision tree rewritten from invariants (not copy-paste of A). */
function routeB(sku) {
  if (sku.gri3_combination === true) return "reject";
  if (sku.note_1a_food_or_supplement === true) return "excluded_note_1a";

  const form = sku.dosage_form_signal;
  const therapeutic = sku.therapeutic_or_prophylactic === true;
  const measured = sku.measured_dose === true;
  const retail = sku.retail_packing === true;
  const chem = sku.chemical_form;

  // Inconsistent finished-form label without dose/retail evidence
  if (
    (form === "tablet" ||
      form === "capsule" ||
      form === "injectable_vial" ||
      form === "transdermal") &&
    !measured &&
    !retail
  ) {
    return "reject";
  }

  // Finished medicament path
  if (therapeutic && (measured || retail)) {
    if (form === "bulk_drum" || form === "powder_bulk" || form === "bulk_pellets") {
      return "reject";
    }
    return "heading_3004_medicament";
  }

  // Mixed bulk medicament (3003)
  if (
    therapeutic &&
    chem === "mixture" &&
    !measured &&
    !retail &&
    (form === "bulk_pellets" || form === "other" || form === "unknown")
  ) {
    return "heading_3003_bulk_medicament";
  }

  // Separately defined bulk chemical (29)
  if (
    chem === "separately_defined" &&
    (form === "bulk_drum" || form === "powder_bulk")
  ) {
    return "chapter_29_chemical";
  }

  return "reject";
}

function checkDoc(doc, prefix) {
  let failed = 0;
  if (Array.isArray(doc.batch)) {
    for (const item of doc.batch) {
      const a = routeA(item.sku);
      const b = routeB(item.sku);
      const want = item.expect.route;
      const ok = a === b && a === want;
      if (!ok) failed += 1;
      console.log(
        `${ok ? "PASS" : "FAIL"} ${prefix}/${item.label}: A=${a} B=${b} want=${want}`,
      );
    }
    return failed;
  }
  const a = routeA(doc.sku);
  const b = routeB(doc.sku);
  const want = doc.expect.route;
  const ok = a === b && a === want;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${prefix}: A=${a} B=${b} want=${want}`);
  return failed;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("htsroute-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  failed += checkDoc(doc, doc.id);
}

// Synthetic adversarial probes (not in JSON) — both routers must agree
const probes = [
  {
    id: "probe-gri3-wins-over-3004-facts",
    sku: {
      chemical_form: "mixture",
      therapeutic_or_prophylactic: true,
      measured_dose: true,
      retail_packing: true,
      dosage_form_signal: "tablet",
      note_1a_food_or_supplement: false,
      gri3_combination: true,
    },
    expect: "reject",
  },
  {
    id: "probe-note1a-wins-over-3004-facts",
    sku: {
      chemical_form: "mixture",
      therapeutic_or_prophylactic: true,
      measured_dose: true,
      retail_packing: true,
      dosage_form_signal: "capsule",
      note_1a_food_or_supplement: true,
      gri3_combination: false,
    },
    expect: "excluded_note_1a",
  },
  {
    id: "probe-name-only-ignored",
    sku: {
      molecule_name: "anything",
      chemical_form: "unknown",
      therapeutic_or_prophylactic: false,
      measured_dose: false,
      retail_packing: false,
      dosage_form_signal: "unknown",
      note_1a_food_or_supplement: false,
      gri3_combination: false,
    },
    expect: "reject",
  },
];

for (const p of probes) {
  const a = routeA(p.sku);
  const b = routeB(p.sku);
  const ok = a === b && a === p.expect;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${p.id}: A=${a} B=${b} want=${p.expect}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} cross-check failure(s)`);
  process.exit(1);
}
console.log(
  `\nDual-impl cross-check green: ${files.length} files + ${probes.length} probes`,
);
