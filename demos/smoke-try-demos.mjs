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
    mustInclude: ["research", "232", "generic"],
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

if (failed > 0) {
  console.log(`\nSMOKE FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log(`\nAll ${dirs.length} try-demo smoke check(s) green`);
