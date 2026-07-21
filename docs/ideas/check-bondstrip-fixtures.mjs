/**
 * Research checker — bondstrip accrued + strip fixtures.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

function days30360(a, b) {
  let d1 = a.d;
  let d2 = b.d;
  if (d1 === 31) d1 = 30;
  if (d2 === 31 && d1 === 30) d2 = 30;
  return (b.y - a.y) * 360 + (b.m - a.m) * 30 + (d2 - d1);
}

function actualDays(a, b) {
  const t0 = Date.UTC(a.y, a.m - 1, a.d);
  const t1 = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((t1 - t0) / 86400000);
}

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

function periodDays30360(freq) {
  if (freq === 2) return 180;
  if (freq === 4) return 90;
  if (freq === 1) return 360;
  return null;
}

function accrued(fix) {
  if (![1, 2, 4].includes(fix.freq)) return { reject: "bad_freq" };
  if (fix.maturity && fix.settle > fix.maturity) {
    return { reject: "settle_after_maturity" };
  }
  const periodic = (fix.face * fix.coupon_rate) / fix.freq;
  if (fix.settle === fix.next_coupon) {
    return { accrued: 0, days_elapsed: 0, days_in_period: null, periodic_coupon: periodic };
  }
  const prev = parseYmd(fix.prev_coupon);
  const next = parseYmd(fix.next_coupon);
  const settle = parseYmd(fix.settle);
  let daysElapsed;
  let daysInPeriod;
  if (fix.day_count === "30/360") {
    daysElapsed = days30360(prev, settle);
    daysInPeriod = periodDays30360(fix.freq);
  } else if (fix.day_count === "ACT/ACT") {
    daysElapsed = actualDays(prev, settle);
    daysInPeriod = actualDays(prev, next);
  } else {
    return { reject: "unknown_day_count" };
  }
  const acc = round6(periodic * (daysElapsed / daysInPeriod));
  const out = {
    periodic_coupon: periodic,
    days_elapsed: daysElapsed,
    days_in_period: daysInPeriod,
    accrued: acc,
  };
  if (fix.coupon_dates) {
    out.cashflows = fix.coupon_dates.map((date) => ({
      date,
      amount: date === fix.maturity ? periodic + fix.face : periodic,
    }));
  }
  return out;
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const files = readdirSync(dir).filter((f) => f.startsWith("bondstrip-") && f.endsWith(".json"));
let failed = 0;
for (const f of files) {
  const fix = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const got = accrued(fix);
  let ok = true;
  if (fix.expect.reject) {
    ok = got.reject === fix.expect.reject;
  } else {
    if (fix.expect.periodic_coupon !== undefined) {
      ok = ok && got.periodic_coupon === fix.expect.periodic_coupon;
    }
    if (fix.expect.days_elapsed !== undefined) {
      ok = ok && got.days_elapsed === fix.expect.days_elapsed;
    }
    if (fix.expect.days_in_period !== undefined) {
      ok = ok && got.days_in_period === fix.expect.days_in_period;
    }
    if (fix.expect.accrued !== undefined) {
      ok = ok && Math.abs(got.accrued - fix.expect.accrued) < 1e-5;
    }
    if (fix.expect.cashflows) {
      ok = ok && JSON.stringify(got.cashflows) === JSON.stringify(fix.expect.cashflows);
    }
  }
  if (!ok) {
    console.error("FAIL", f, { got, expect: fix.expect });
    failed += 1;
  } else console.log("ok", f);
}
if (failed) process.exit(1);
console.log(`bondstrip fixtures: ${files.length} ok`);
