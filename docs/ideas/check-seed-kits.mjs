/**
 * Paper-kit completeness for the five active research seeds.
 * Does not flip controller state. Exit 0 only when every required artifact exists
 * and research try-demo smoke stays green.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

const seeds = [
  {
    id: "htsroute",
    files: [
      "htsroute-G6-summary.md",
      "htsroute-ACCEPTANCE.md",
      "htsroute-VALUE-STAKES.md",
      "htsroute-PRODUCT-FRAMING.md",
      "htsroute-GATE-SCORECARD.md",
      "htsroute-COMPREHENSIVE-BLUEPRINT.md",
      "htsroute-PAGE-SPECS.md",
      "htsroute-SUSTAIN-TEST-MATRIX.md",
      "htsroute-API-CONTRACT.md",
      "htsroute-TOMORROW-RUN.md",
      "htsroute-FLIP-ABORT.md",
      "htsroute-DAY1-NONSMOKE.md",
      "htsroute-FLIP-MORNING.md",
      "htsroute-REPO-SCAFFOLD.md",
      "htsroute-G1-CF29-SEARCH.md",
      "htsroute-STACKED-TARIFF-FENCE.md",
      "htsroute-VALUE-GATE-DRYRUN.md",
      "htsroute-vs-depositgap-VALUE.md",
      "htsroute-PARK-RUN.md",
      "QUEUE-ISO-AUDIT.md",
      "check-htsroute-preflip.mjs",
    ],
  },
  {
    id: "depositgap",
    files: [
      "depositgap-G6-summary.md",
      "depositgap-ACCEPTANCE.md",
      "depositgap-VALUE-STAKES.md",
      "depositgap-PRODUCT-FRAMING.md",
      "depositgap-GATE-SCORECARD.md",
      "depositgap-COMPREHENSIVE-BLUEPRINT.md",
      "depositgap-PAGE-SPECS.md",
      "depositgap-SUSTAIN-TEST-MATRIX.md",
      "depositgap-API-CONTRACT.md",
      "depositgap-POST-HTSROUTE-RUN.md",
      "depositgap-DAY1-NONSMOKE.md",
      "depositgap-REPO-SCAFFOLD.md",
      "depositgap-G1-EVIDENCE.md",
      "depositgap-6621-FENCE.md",
    ],
  },
  {
    id: "lesserof",
    files: [
      "lesserof-G6-summary.md",
      "lesserof-ACCEPTANCE.md",
      "lesserof-VALUE-STAKES.md",
      "lesserof-PRODUCT-FRAMING.md",
      "lesserof-GATE-SCORECARD.md",
      "lesserof-COMPREHENSIVE-BLUEPRINT.md",
      "lesserof-PAGE-SPECS.md",
      "lesserof-SUSTAIN-TEST-MATRIX.md",
      "lesserof-API-CONTRACT.md",
      "lesserof-POST-DEPOSITGAP-RUN.md",
      "lesserof-DAY1-NONSMOKE.md",
      "lesserof-REPO-SCAFFOLD.md",
      "lesserof-G1-EVIDENCE.md",
      "lesserof-USMCA-WIPE-FENCE.md",
    ],
  },
  {
    id: "oshamult",
    files: [
      "oshamult-G6-summary.md",
      "oshamult-ACCEPTANCE.md",
      "oshamult-VALUE-STAKES.md",
      "oshamult-PRODUCT-FRAMING.md",
      "oshamult-GATE-SCORECARD.md",
      "oshamult-COMPREHENSIVE-BLUEPRINT.md",
      "oshamult-PAGE-SPECS.md",
      "oshamult-SUSTAIN-TEST-MATRIX.md",
      "oshamult-API-CONTRACT.md",
      "oshamult-POST-LESSEROF-RUN.md",
      "oshamult-SIZE-TABLE.md",
      "oshamult-DAY1-NONSMOKE.md",
      "oshamult-REPO-SCAFFOLD.md",
      "oshamult-G1-EVIDENCE.md",
      "oshamult-SERIAL-FENCE.md",
    ],
  },
  {
    id: "ptax4975",
    files: [
      "ptax4975-G6-summary.md",
      "ptax4975-ACCEPTANCE.md",
      "ptax4975-VALUE-STAKES.md",
      "ptax4975-PRODUCT-FRAMING.md",
      "ptax4975-GATE-SCORECARD.md",
      "ptax4975-COMPREHENSIVE-BLUEPRINT.md",
      "ptax4975-PAGE-SPECS.md",
      "ptax4975-SUSTAIN-TEST-MATRIX.md",
      "ptax4975-API-CONTRACT.md",
      "ptax4975-POST-OSHAMULT-RUN.md",
      "ptax4975-FMV-FENCE.md",
      "ptax4975-DAY1-NONSMOKE.md",
      "ptax4975-REPO-SCAFFOLD.md",
      "ptax4975-G1-EVIDENCE.md",
    ],
  },
];

let missing = 0;
for (const seed of seeds) {
  const absent = seed.files.filter((f) => !existsSync(join(__dirname, f)));
  if (absent.length === 0) {
    console.log(`PASS kit ${seed.id}: ${seed.files.length} artifacts present`);
  } else {
    missing += absent.length;
    console.error(`FAIL kit ${seed.id}: missing ${absent.join(", ")}`);
  }
}

if (missing > 0) {
  console.error(`\nKIT INCOMPLETE (${missing} file(s) missing)`);
  process.exit(1);
}

{
  const smokePath = join(root, "demos/smoke-try-demos.mjs");
  const r = spawnSync(process.execPath, [smokePath], {
    encoding: "utf8",
    cwd: root,
  });
  const tail = (r.stdout || r.stderr || "")
    .trim()
    .split(/\r?\n/)
    .slice(-1)[0];
  if (r.status !== 0) {
    console.error(`FAIL demos/smoke-try-demos.mjs: ${tail || `exit ${r.status}`}`);
    process.exit(1);
  }
  console.log(`PASS demos/smoke-try-demos.mjs: ${tail}`);
}

console.log("\nAll 5 seed paper kits complete");
