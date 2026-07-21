/**
 * Research checker — tariffstep block/ratchet fixtures.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

function calc(fix) {
  const blocks = fix.blocks ?? [];
  if (!blocks.length) return { reject: "empty_blocks" };
  if (!(fix.total_kwh >= 0) || !(fix.current_peak_kw >= 0) || !(fix.prior_peak_kw >= 0)) {
    return { reject: "negative_input" };
  }
  if (!(fix.ratchet_pct > 0 && fix.ratchet_pct <= 1)) return { reject: "ratchet_pct_invalid" };
  let prev = 0;
  for (const b of blocks) {
    if (typeof b.rate !== "number" || b.rate < 0) return { reject: "bad_rate" };
    if (b.up_to_kwh !== null) {
      if (b.up_to_kwh <= prev) return { reject: "blocks_unsorted" };
      prev = b.up_to_kwh;
    }
  }

  let remaining = fix.total_kwh;
  let energy = 0;
  prev = 0;
  for (const b of blocks) {
    if (remaining <= 0) break;
    const width = b.up_to_kwh === null ? remaining : b.up_to_kwh - prev;
    const take = Math.min(remaining, width);
    energy += take * b.rate;
    remaining -= take;
    if (b.up_to_kwh !== null) prev = b.up_to_kwh;
  }
  const billingDemand = Math.max(fix.current_peak_kw, fix.prior_peak_kw * fix.ratchet_pct);
  const demand = billingDemand * fix.demand_rate;
  return {
    energy_charge: round6(energy),
    billing_demand_kw: round6(billingDemand),
    demand_charge: round6(demand),
    total_charge: round6(energy + demand),
  };
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const files = readdirSync(dir).filter((f) => f.startsWith("tariffstep-") && f.endsWith(".json"));
let failed = 0;
for (const f of files) {
  const fix = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const got = calc(fix);
  let ok = true;
  if (fix.expect.reject) {
    ok = got.reject === fix.expect.reject;
  } else {
    ok =
      got.energy_charge === fix.expect.energy_charge &&
      got.billing_demand_kw === fix.expect.billing_demand_kw &&
      got.demand_charge === fix.expect.demand_charge &&
      got.total_charge === fix.expect.total_charge;
  }
  if (!ok) {
    console.error("FAIL", f, { got, expect: fix.expect });
    failed += 1;
  } else {
    console.log("ok", f);
  }
}
if (failed) process.exit(1);
console.log(`tariffstep fixtures: ${files.length} ok`);
