/**
 * Generate ≥30 dual-impl goldens for Tactile Data Desk.
 * Fixtures must agree with src/domain/tactile.ts.
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
  { id: "std-001", title: "Default chart min_n 40", input: {} },
  {
    id: "std-002",
    title: "Reject skip-verify cheat",
    input: { skip_verify_cheat: true },
  },
  {
    id: "std-003",
    title: "Small chart",
    input: { corpus: "small", min_n: 30 },
  },
  {
    id: "std-004",
    title: "Large contaminated chart",
    input: { corpus: "large", min_n: 50 },
  },
  {
    id: "std-005",
    title: "Homogeneous no hard layers at min_n 20",
    input: { corpus: "homogeneous", min_n: 20 },
  },
  {
    id: "std-006",
    title: "Contaminated with high speech drift",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 2.5 },
  },
  {
    id: "std-007",
    title: "Sparse hard-to-confirm rows",
    input: { corpus: "sparse", min_n: 45 },
  },
  {
    id: "std-008",
    title: "Sales chart",
    input: { corpus: "sales", min_n: 60 },
  },
  {
    id: "std-009",
    title: "Weather chart",
    input: { corpus: "weather", min_n: 35 },
  },
  {
    id: "std-010",
    title: "Inventory chart",
    input: { corpus: "inventory", min_n: 40 },
  },
  {
    id: "std-011",
    title: "Survey chart",
    input: { corpus: "survey", min_n: 50 },
  },
  {
    id: "std-012",
    title: "Strict confirm floor min_n 100",
    input: { corpus: "default", min_n: 100 },
  },
  {
    id: "std-013",
    title: "Lenient confirm floor min_n 10",
    input: { corpus: "default", min_n: 10 },
  },
  {
    id: "std-014",
    title: "Low speech drift",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 0.5 },
  },
  {
    id: "std-015",
    title: "Max speech drift",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 3 },
  },
  {
    id: "std-016",
    title: "Custom chart name alpha",
    input: { corpus: "alpha-trial", min_n: 40 },
  },
  {
    id: "std-017",
    title: "Custom chart name beta",
    input: { corpus: "beta-trial", min_n: 55 },
  },
  {
    id: "std-018",
    title: "Custom chart gamma",
    input: { corpus: "gamma", min_n: 35, bias_scale: 1.8 },
  },
  {
    id: "std-019",
    title: "Homogeneous strict confirm",
    input: { corpus: "homogeneous", min_n: 80 },
  },
  {
    id: "std-020",
    title: "Small with high drift",
    input: { corpus: "small", min_n: 40, bias_scale: 2.2 },
  },
  {
    id: "std-021",
    title: "Large lenient confirm",
    input: { corpus: "large", min_n: 20 },
  },
  {
    id: "std-022",
    title: "Sparse lenient",
    input: { corpus: "sparse", min_n: 20 },
  },
  {
    id: "std-023",
    title: "Sales high drift",
    input: { corpus: "sales", min_n: 50, bias_scale: 2 },
  },
  {
    id: "std-024",
    title: "Weather strict",
    input: { corpus: "weather", min_n: 70 },
  },
  {
    id: "std-025",
    title: "Inventory mild drift",
    input: { corpus: "inventory", min_n: 30, bias_scale: 0.8 },
  },
  {
    id: "std-026",
    title: "Survey mild",
    input: { corpus: "survey", min_n: 30, bias_scale: 1 },
  },
  {
    id: "std-027",
    title: "Default mid confirm 55",
    input: { corpus: "default", min_n: 55 },
  },
  {
    id: "std-028",
    title: "Default drift 1.5",
    input: { corpus: "default", min_n: 40, bias_scale: 1.5 },
  },
  {
    id: "std-029",
    title: "Contaminated lenient",
    input: { corpus: "contaminated", min_n: 25 },
  },
  {
    id: "std-030",
    title: "Large high drift strict",
    input: { corpus: "large", min_n: 90, bias_scale: 2.8 },
  },
];

const require = createRequire(import.meta.url);

async function main() {
  const { scoreTactile } = await import("../src/domain/tactile.ts");
  for (const c of cases) {
    const live = scoreTactile(c.input);
    const expect =
      live.status === "reject"
        ? { status: "reject", reason: live.reason }
        : {
            status: "ok",
            corpus: live.corpus,
            naive_risk: live.naive.risk_score,
            safer_risk: live.pla.risk_score,
            delta_score: live.delta_score,
            min_n: live.min_n,
            k_eligible: live.k_eligible,
            i2: live.i2,
          };
    const doc = {
      id: c.id,
      title: c.title,
      input: c.input,
      expect,
    };
    writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
    console.log(c.id, live.status === "ok" ? live.delta_score : live.reason);
  }
  console.log(`Wrote ${cases.length} fixtures to ${dir}`);
  void require;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
