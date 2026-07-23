import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

function countStages(hint) {
  const parts = String(hint ?? "")
    .split(/[,>|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts.length : 1;
}

function score(input) {
  if (input.single_hop_cheat === true) {
    return { status: "reject", reason: "single_hop_cheat" };
  }
  let hops = 1;
  if (input.stages_hint !== undefined) {
    hops = String(input.stages_hint).trim()
      ? countStages(input.stages_hint)
      : 1;
  } else {
    const raw = Number(input.hop_depth ?? 1);
    hops = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const paper = hops * 2 + 1;
  return {
    status: "ok",
    hop_steps: hops,
    naive_coverage: 1,
    paper_coverage: paper,
    delta_coverage: paper - 1,
  };
}

const cases = [
  { id: "grd-001", title: "default hop 1", input: { hop_depth: 1 } },
  { id: "grd-002", title: "hop 2", input: { hop_depth: 2 } },
  { id: "grd-003", title: "hop 3 extract path", input: { hop_depth: 3 } },
  { id: "grd-004", title: "hop 4", input: { hop_depth: 4 } },
  { id: "grd-005", title: "hop 5", input: { hop_depth: 5 } },
  { id: "grd-006", title: "missing hop → 1", input: {} },
  { id: "grd-007", title: "zero hop clamped", input: { hop_depth: 0 } },
  { id: "grd-008", title: "negative hop clamped", input: { hop_depth: -3 } },
  { id: "grd-009", title: "fractional hop floor", input: { hop_depth: 2.9 } },
  {
    id: "grd-010",
    title: "three named stages",
    input: { stages_hint: "extract,consolidate,retrieve" },
  },
  {
    id: "grd-011",
    title: "two pipe stages",
    input: { stages_hint: "extract|retrieve" },
  },
  {
    id: "grd-012",
    title: "angle stages",
    input: { stages_hint: "extract>consolidate>retrieve" },
  },
  {
    id: "grd-013",
    title: "spaces around commas",
    input: { stages_hint: " a , b , c " },
  },
  {
    id: "grd-014",
    title: "empty stages hint",
    input: { stages_hint: "" },
  },
  {
    id: "grd-015",
    title: "whitespace stages",
    input: { stages_hint: "   " },
  },
  {
    id: "grd-016",
    title: "duplicate empties ignored",
    input: { stages_hint: "extract,,retrieve" },
  },
  {
    id: "grd-017",
    title: "four stages",
    input: { stages_hint: "e,c,r,rerank" },
  },
  {
    id: "grd-018",
    title: "six stages",
    input: { stages_hint: "a,b,c,d,e,f" },
  },
  {
    id: "grd-019",
    title: "single stage label",
    input: { stages_hint: "retrieve" },
  },
  {
    id: "grd-020",
    title: "trailing comma",
    input: { stages_hint: "extract,consolidate," },
  },
  {
    id: "grd-021",
    title: "leading pipe",
    input: { stages_hint: "|retrieve" },
  },
  {
    id: "grd-022",
    title: "only separators",
    input: { stages_hint: ",,||>>" },
  },
  {
    id: "grd-023",
    title: "hop 7",
    input: { hop_depth: 7 },
  },
  {
    id: "grd-024",
    title: "single-hop cheat reject",
    input: { hop_depth: 3, single_hop_cheat: true },
  },
  {
    id: "grd-025",
    title: "cheat with stages reject",
    input: {
      stages_hint: "extract,consolidate,retrieve",
      single_hop_cheat: true,
    },
  },
  {
    id: "grd-026",
    title: "mixed separators",
    input: { stages_hint: "extract,consolidate|retrieve>rerank" },
  },
  {
    id: "grd-027",
    title: "graph hop sketch",
    input: { stages_hint: "entity,relation,path,answer" },
  },
  {
    id: "grd-028",
    title: "spaced pipes",
    input: { stages_hint: " extract | consolidate | retrieve " },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = {
    id: c.id,
    title: c.title,
    input: c.input,
    expect,
  };
  writeFileSync(join(dir, `${c.id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
}

console.log(`wrote ${cases.length} fixtures to ${dir}`);
