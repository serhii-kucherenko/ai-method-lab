/**
 * Paper oracle for htsroute chapter/heading gate.
 * Implements docs/ideas/htsroute-algorithm.md — research only.
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

function routeSku(sku) {
  if (sku.gri3_combination) return "reject";
  if (sku.note_1a_food_or_supplement) return "excluded_note_1a";

  const doseOrRetail = sku.measured_dose || sku.retail_packing;
  if (DOSE_FORMS.has(sku.dosage_form_signal) && !doseOrRetail) {
    return "reject";
  }

  if (
    sku.therapeutic_or_prophylactic &&
    doseOrRetail &&
    DOSE_FORMS.has(sku.dosage_form_signal)
  ) {
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

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("htsroute-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = routeSku(doc.sku);
  const want = doc.expect.route;
  const ok = got === want;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: got=${got} want=${want}`);
}

if (failed > 0) {
  console.error(`\n${failed} fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} htsroute fixture(s) green`);
