/**
 * Generate ≥30 dual-impl goldens for Truth Game Desk.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

for (const f of readdirSync(dir)) {
  if (f.endsWith(".json")) unlinkSync(join(dir, f));
}

const cases = [
  { id: "std-001", title: "Default coverage floor 40", input: {} },
  {
    id: "std-002",
    title: "Reject impute / majority_vote cheat",
    input: { skip_verify_cheat: true },
  },
  { id: "std-003", title: "Arena-A claims", input: { corpus: "adni", min_n: 30 } },
  { id: "std-004", title: "Arena-B claims", input: { corpus: "aibl", min_n: 50 } },
  { id: "std-005", title: "Arena-C claims", input: { corpus: "nacc", min_n: 60 } },
  {
    id: "std-006",
    title: "Contaminated with high single-agent extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 2.5 },
  },
  {
    id: "std-007",
    title: "Sparse truth cells",
    input: { corpus: "sparse", min_n: 45 },
  },
  {
    id: "std-008",
    title: "Arena-D claims",
    input: { corpus: "oasis", min_n: 55 },
  },
  {
    id: "std-009",
    title: "Arena alpha multi-claim",
    input: { corpus: "clinic_a", min_n: 35 },
  },
  {
    id: "std-010",
    title: "Arena beta majority-lean",
    input: { corpus: "clinic_b", min_n: 40 },
  },
  {
    id: "std-011",
    title: "Homogeneous mid risk",
    input: { corpus: "homogeneous", min_n: 50 },
  },
  {
    id: "std-012",
    title: "Strict coverage floor min_n 100",
    input: { corpus: "default", min_n: 100 },
  },
  {
    id: "std-013",
    title: "Lenient coverage floor min_n 10",
    input: { corpus: "default", min_n: 10 },
  },
  {
    id: "std-014",
    title: "Low single-agent extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 0.5 },
  },
  {
    id: "std-015",
    title: "Max single-agent extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 3 },
  },
  {
    id: "std-016",
    title: "Custom arena alpha",
    input: { corpus: "alpha-trial", min_n: 40 },
  },
  {
    id: "std-017",
    title: "Custom arena beta",
    input: { corpus: "beta-trial", min_n: 55 },
  },
  {
    id: "std-018",
    title: "Custom arena gamma",
    input: { corpus: "gamma", min_n: 35, bias_scale: 1.8 },
  },
  {
    id: "std-019",
    title: "Mixed multi-center",
    input: { corpus: "mixed", min_n: 40 },
  },
  {
    id: "std-020",
    title: "Small with high extremity",
    input: { corpus: "small", min_n: 40, bias_scale: 2.2 },
  },
  {
    id: "std-021",
    title: "Large lenient risk",
    input: { corpus: "large", min_n: 20 },
  },
  {
    id: "std-022",
    title: "Highrisk mixed center",
    input: { corpus: "highrisk", min_n: 70 },
  },
  {
    id: "std-023",
    title: "Techlean / impute-lean",
    input: { corpus: "techlean", min_n: 40, bias_scale: 2 },
  },
  {
    id: "std-024",
    title: "Clinic A strict",
    input: { corpus: "clinic_a", min_n: 90 },
  },
  {
    id: "std-025",
    title: "Legacy tka mild extremity",
    input: { corpus: "infection", min_n: 30, bias_scale: 0.8 },
  },
  {
    id: "std-026",
    title: "Flat / confidence-only lean mild",
    input: { corpus: "flat", min_n: 30, bias_scale: 1 },
  },
  {
    id: "std-027",
    title: "Default mid risk 55",
    input: { corpus: "default", min_n: 55 },
  },
  {
    id: "std-028",
    title: "Default extremity 1.5",
    input: { corpus: "default", min_n: 40, bias_scale: 1.5 },
  },
  {
    id: "std-029",
    title: "Contaminated lenient",
    input: { corpus: "contaminated", min_n: 25 },
  },
  {
    id: "std-030",
    title: "Large high extremity strict",
    input: { corpus: "large", min_n: 90, bias_scale: 2.8 },
  },
];

const require = createRequire(import.meta.url);

async function main() {
  // Prefer tsx-loaded TS modules when available
  let scoreA;
  let scoreB;
  try {
    const a = await import("../src/domain/synthesis.ts");
    const b = await import("../src/domain/synthesisB.ts");
    scoreA = a.scoreSynthesis;
    scoreB = b.scoreSynthesisB;
  } catch {
    const a = require("../src/domain/synthesis.ts");
    const b = require("../src/domain/synthesisB.ts");
    scoreA = a.scoreSynthesis;
    scoreB = b.scoreSynthesisB;
  }

  for (const c of cases) {
    const ra = scoreA(c.input);
    const rb = scoreB(c.input);
    if (JSON.stringify(ra) !== JSON.stringify(rb)) {
      throw new Error(`dual-impl diverge on ${c.id}`);
    }
    const expect =
      ra.status === "reject"
        ? { status: "reject", reason: ra.reason }
        : {
            status: "ok",
            corpus: ra.corpus,
            naive_risk: ra.naive.truth_score,
            safer_risk: ra.screened.truth_score,
            delta_score: ra.delta_score,
            min_n: ra.min_n,
            k_eligible: ra.k_eligible,
            i2: ra.i2,
          };
    writeFileSync(
      join(dir, `${c.id}.json`),
      JSON.stringify({ id: c.id, title: c.title, input: c.input, expect }, null, 2) +
        "\n",
      "utf8",
    );
  }
  console.log(`wrote ${cases.length} goldens`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
