/**
 * Generate ≥30 dual-impl goldens for Joint Care Desk.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

for (const f of readdirSync(dir)) {
  if (f.endsWith(".json")) unlinkSync(join(dir, f));
}

const cases = [
  { id: "std-001", title: "Default pathway risk 40", input: {} },
  {
    id: "std-002",
    title: "Reject hospital-only / stage-blind cheat",
    input: { skip_verify_cheat: true },
  },
  { id: "std-003", title: "TKA pathway", input: { corpus: "tka", min_n: 30 } },
  { id: "std-004", title: "THA pathway", input: { corpus: "tha", min_n: 50 } },
  { id: "std-005", title: "ACL pathway", input: { corpus: "acl", min_n: 60 } },
  {
    id: "std-006",
    title: "Contaminated with high naive parametric extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 2.5 },
  },
  {
    id: "std-007",
    title: "Sparse evidence cells",
    input: { corpus: "sparse", min_n: 45 },
  },
  {
    id: "std-008",
    title: "Rotator pathway",
    input: { corpus: "rotator", min_n: 55 },
  },
  {
    id: "std-009",
    title: "Arthritis pathway",
    input: { corpus: "arthritis", min_n: 35 },
  },
  {
    id: "std-010",
    title: "Sports pathway",
    input: { corpus: "sports", min_n: 40 },
  },
  {
    id: "std-011",
    title: "Revision pathway",
    input: { corpus: "revision", min_n: 50 },
  },
  {
    id: "std-012",
    title: "Strict evidence floor min_n 100",
    input: { corpus: "default", min_n: 100 },
  },
  {
    id: "std-013",
    title: "Lenient evidence floor min_n 10",
    input: { corpus: "default", min_n: 10 },
  },
  {
    id: "std-014",
    title: "Low naive parametric extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 0.5 },
  },
  {
    id: "std-015",
    title: "Max naive parametric extremity",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 3 },
  },
  {
    id: "std-016",
    title: "Custom pathway alpha",
    input: { corpus: "alpha-trial", min_n: 40 },
  },
  {
    id: "std-017",
    title: "Custom pathway beta",
    input: { corpus: "beta-trial", min_n: 55 },
  },
  {
    id: "std-018",
    title: "Custom pathway gamma",
    input: { corpus: "gamma", min_n: 35, bias_scale: 1.8 },
  },
  {
    id: "std-019",
    title: "Homogeneous mid risk",
    input: { corpus: "homogeneous", min_n: 40 },
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
    title: "Highrisk mixed pathway",
    input: { corpus: "highrisk", min_n: 70 },
  },
  {
    id: "std-023",
    title: "Techlean / parametric-lean",
    input: { corpus: "techlean", min_n: 40, bias_scale: 2 },
  },
  {
    id: "std-024",
    title: "Spine pathway strict",
    input: { corpus: "spine", min_n: 90 },
  },
  {
    id: "std-025",
    title: "Infection mild extremity",
    input: { corpus: "infection", min_n: 30, bias_scale: 0.8 },
  },
  {
    id: "std-026",
    title: "Fracture / stage-blind lean mild",
    input: { corpus: "fracture", min_n: 30, bias_scale: 1 },
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

async function main() {
  const { scoreGovernance } = await import("../src/domain/governance.ts");
  for (const c of cases) {
    const live = scoreGovernance(c.input);
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
