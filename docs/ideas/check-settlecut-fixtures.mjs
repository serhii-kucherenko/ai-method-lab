/**
 * Research checker — settlecut imbalance fixtures.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

function settle(fix) {
  if (fix.apply_loss_twice) return { reject: "double_loss" };
  if (fix.loss_after_price) return { reject: "loss_after_price" };

  const meterStart = fix.interval_start ?? fix.meter_interval_start;
  const schedStart = fix.interval_start ?? fix.schedule_interval_start;
  if (!meterStart || !schedStart) return { reject: "interval_required" };
  if (meterStart !== schedStart) return { reject: "interval_mismatch" };
  if (!(fix.delivery_factor > 0)) return { reject: "delivery_factor_invalid" };

  const adjusted = fix.meter_kwh * fix.delivery_factor;
  const imbalance = adjusted - fix.schedule_kwh;
  const charge = imbalance * fix.imbalance_price;
  return {
    adjusted_kwh: round6(adjusted),
    imbalance_kwh: round6(imbalance),
    charge: round6(charge),
  };
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const files = readdirSync(dir).filter((f) => f.startsWith("settlecut-") && f.endsWith(".json"));
let failed = 0;
for (const f of files) {
  const fix = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const got = settle(fix);
  let ok = true;
  if (fix.expect.reject) {
    ok = got.reject === fix.expect.reject;
  } else {
    ok =
      got.adjusted_kwh === fix.expect.adjusted_kwh &&
      got.imbalance_kwh === fix.expect.imbalance_kwh &&
      got.charge === fix.expect.charge;
  }
  if (!ok) {
    console.error("FAIL", f, { got, expect: fix.expect });
    failed += 1;
  } else console.log("ok", f);
}
if (failed) process.exit(1);
console.log(`settlecut fixtures: ${files.length} ok`);
