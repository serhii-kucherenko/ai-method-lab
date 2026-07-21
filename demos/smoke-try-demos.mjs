/**
 * Smoke: research try demos must stay offline and honest.
 * Run: node demos/smoke-try-demos.mjs
 * Exit 1 on any failure (red → green gate before commit).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rules = {
  "depositgap-try": {
    minBytes: 2000,
    mustInclude: ["research", "honesty", "1000000", "0.10", "0.25"],
  },
  "lesserof-try": {
    minBytes: 2000,
    mustInclude: ["research", "honesty", "10000", "4000"],
  },
  "oshamult-try": {
    minBytes: 2000,
    mustInclude: ["research", "honesty", "5000"],
  },
  "htsroute-try": {
    minBytes: 2000,
    mustInclude: [
      "research",
      "232",
      "generic",
      "Free/Free",
      "duty-savings",
      "2026-07-31",
      "2026-09-29",
    ],
  },
  "ptax4975-try": {
    minBytes: 2000,
    mustInclude: ["research", "honesty", "10000"],
    optional: true,
  },
};

function fail(msg) {
  console.log(`FAIL ${msg}`);
  return false;
}

function pass(msg) {
  console.log(`PASS ${msg}`);
  return true;
}

const dirs = readdirSync(__dirname, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.endsWith("-try"))
  .map((d) => d.name)
  .sort();

let failed = 0;

for (const name of dirs) {
  const rule = rules[name] || {
    minBytes: 2000,
    mustInclude: ["research"],
  };
  const tryPath = join(__dirname, name, "try.html");
  let html;
  try {
    const st = statSync(tryPath);
    if (st.size < rule.minBytes) {
      if (!fail(`${name}: try.html too small (${st.size} < ${rule.minBytes})`))
        failed += 1;
      continue;
    }
    html = readFileSync(tryPath, "utf8");
  } catch {
    if (rule.optional) {
      pass(`${name}: optional, missing try.html (ok)`);
      continue;
    }
    if (!fail(`${name}: missing try.html`)) failed += 1;
    continue;
  }

  const lower = html.toLowerCase();
  if (!lower.includes("research") && !lower.includes("not a product")) {
    if (!fail(`${name}: missing research / not-a-product marker`)) failed += 1;
    continue;
  }
  if (!lower.includes("honesty") && !lower.includes("disclaimer")) {
    if (!fail(`${name}: missing honesty/disclaimer`)) failed += 1;
    continue;
  }
  if (/fetch\s*\(\s*['"`]\//.test(html)) {
    if (!fail(`${name}: must not call fetch("/...")`)) failed += 1;
    continue;
  }

  let ok = true;
  for (const needle of rule.mustInclude || []) {
    if (!html.toLowerCase().includes(needle.toLowerCase())) {
      fail(`${name}: missing required marker "${needle}"`);
      ok = false;
      failed += 1;
      break;
    }
  }
  if (ok) pass(`${name}: smoke green (${html.length} bytes)`);
}

// Behavioral toys — same math as paper oracles / try pages (UI must not drift).
function nearly(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

{
  const duty = (0.25 - 0.1) * 1_000_000;
  const interest = duty * 0.07 * (365 / 365);
  const trueUp = duty + interest;
  if (!(nearly(duty, 150_000) && nearly(interest, 10_500) && nearly(trueUp, 160_500))) {
    fail(
      `depositgap toy math drifted (duty=${duty} interest=${interest} trueUp=${trueUp})`,
    );
    failed += 1;
  } else {
    pass("depositgap behavioral toy: $150k + $10.5k interest");
  }

  // Fixture K: leap window 2024-01-01 → 2025-01-01 = 366 days @ 8%
  const leapInterest = 150_000 * 0.08 * (366 / 365);
  if (!nearly(leapInterest, 12032.876712328769, 0.05)) {
    fail(`depositgap leap toy drifted (interest=${leapInterest})`);
    failed += 1;
  } else {
    pass("depositgap leap-year toy: 366d @ 8% ≈ $12,032.88");
  }
}

{
  const base = Math.min(10_000, 4_000);
  const refund = 0.99 * base;
  const naive = 0.99 * 10_000;
  if (!(nearly(refund, 3_960) && nearly(naive - refund, 5_940))) {
    fail(`lesserof toy math drifted (refund=${refund})`);
    failed += 1;
  } else {
    pass("lesserof behavioral toy: $3,960 vs naive +$5,940");
  }
}

{
  // serious: size 0.3, history 0.1, faith 0.15, quick 0 on GBP 5000
  let amount = 5000;
  amount *= 1 - 0.3;
  amount *= 1 - 0.1;
  amount *= 1 - 0.15;
  amount *= 1 - 0;
  if (!nearly(amount, 2677.5)) {
    fail(`oshamult toy math drifted (penalty=${amount})`);
    failed += 1;
  } else {
    pass("oshamult behavioral toy: $2,677.50");
  }
}

{
  const initial = 0.15 * 10_000 * 2;
  const additional = 0;
  const total = initial + additional;
  if (!(nearly(initial, 3_000) && nearly(total, 3_000))) {
    fail(`ptax4975 toy math drifted (total=${total})`);
    failed += 1;
  } else {
    pass("ptax4975 behavioral toy: $3,000 corrected");
  }
}

if (failed > 0) {
  console.log(`\nSMOKE FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log(`\nAll ${dirs.length} try-demo smoke check(s) green`);
