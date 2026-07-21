/**
 * Preflight: run all parallel-seed paper checkers (research only).
 * Use before day-boundary flip or activation. Exit 1 if any suite fails.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const suites = [
  ["htsroute", "check-htsroute-fixtures.mjs", "check-htsroute-dual.mjs"],
  ["depositgap", "check-depositgap-fixtures.mjs", "check-depositgap-dual.mjs"],
  ["lesserof", "check-lesserof-fixtures.mjs", "check-lesserof-dual.mjs"],
  ["oshamult", "check-oshamult-fixtures.mjs", "check-oshamult-dual.mjs"],
  ["ptax4975", "check-ptax4975-fixtures.mjs", "check-ptax4975-dual.mjs"],
];

let failed = 0;
for (const [name, single, dual] of suites) {
  for (const script of [single, dual]) {
    const path = join(__dirname, script);
    const r = spawnSync(process.execPath, [path], {
      encoding: "utf8",
      cwd: join(__dirname, "../.."),
    });
    const ok = r.status === 0;
    if (!ok) failed += 1;
    const tail = (r.stdout || r.stderr || "")
      .trim()
      .split(/\r?\n/)
      .slice(-1)[0];
    console.log(
      `${ok ? "PASS" : "FAIL"} ${name}/${script}: ${tail || `exit ${r.status}`}`,
    );
  }
}

if (failed > 0) {
  console.error(`\n${failed} seed checker(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${suites.length} seed suites dual-green`);
