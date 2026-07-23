/**
 * Generate ≥25 dual-impl world-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
 * Scoring must match src/domain/worldFit.ts (and worldFitB.ts).
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

const LIGHTWEIGHT = new Set(["preview", "inspect", "filter"]);
const EXPENSIVE = new Set([
  "train",
  "evaluate",
  "search",
  "feature_eng",
  "hyper_tune",
]);

function parseTags(hint) {
  const parts = String(hint ?? "")
    .split(/[,>|]/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

function score(input) {
  if (input.step_burn_cheat === true) {
    return { status: "reject", reason: "step_burn_cheat" };
  }
  const hasTags = input.op_kinds !== undefined;
  let plan_steps = 1;
  let matched = [];
  let light_hits = 0;
  let expensive_hits = 0;
  if (hasTags) {
    const ops = parseTags(input.op_kinds);
    if (ops.length === 0) {
      plan_steps = 1;
    } else {
      matched = ops.filter((t) => LIGHTWEIGHT.has(t) || EXPENSIVE.has(t));
      light_hits = ops.filter((t) => LIGHTWEIGHT.has(t)).length;
      expensive_hits = ops.filter((t) => EXPENSIVE.has(t)).length;
      plan_steps = Math.max(1, matched.length || ops.length);
      if (!matched.length) matched = ops;
    }
  } else {
    const raw = Number(input.plan_steps ?? 1);
    plan_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const naiveReal = hasTags
    ? Math.max(1, light_hits + expensive_hits || matched.length || 1)
    : plan_steps;
  const naive_cost = naiveReal * 2 + 1;
  const worldReal = hasTags
    ? Math.max(1, light_hits || (expensive_hits > 0 ? 1 : plan_steps))
    : Math.max(1, Math.ceil(plan_steps / 3));
  const simulated = hasTags ? expensive_hits : Math.max(0, plan_steps - worldReal);
  const world_cost = worldReal + simulated;
  return {
    status: "ok",
    plan_steps,
    routed_ops: matched.length,
    naive_cost,
    world_cost,
    delta_score: naive_cost - world_cost,
  };
}

const cases = [
  { id: "std-001", title: "default plan 1", input: { plan_steps: 1 } },
  { id: "std-002", title: "plan 2", input: { plan_steps: 2 } },
  { id: "std-003", title: "plan 3 world path", input: { plan_steps: 3 } },
  { id: "std-004", title: "plan 4", input: { plan_steps: 4 } },
  { id: "std-005", title: "plan 5", input: { plan_steps: 5 } },
  { id: "std-006", title: "missing plan → 1", input: {} },
  { id: "std-007", title: "zero plan clamped", input: { plan_steps: 0 } },
  { id: "std-008", title: "negative plan clamped", input: { plan_steps: -3 } },
  { id: "std-009", title: "fractional plan floor", input: { plan_steps: 2.9 } },
  {
    id: "std-010",
    title: "preview + inspect + filter",
    input: { op_kinds: "preview,inspect,filter" },
  },
  {
    id: "std-011",
    title: "train alone (naive burns)",
    input: { op_kinds: "train" },
  },
  {
    id: "std-012",
    title: "evaluate + search",
    input: { op_kinds: "evaluate>search" },
  },
  {
    id: "std-013",
    title: "spaces around commas",
    input: { op_kinds: " preview , train " },
  },
  {
    id: "std-014",
    title: "unknown op tags only",
    input: { op_kinds: "noise-a,noise-b" },
  },
  {
    id: "std-015",
    title: "empty op tags",
    input: { op_kinds: "" },
  },
  {
    id: "std-016",
    title: "lightweight only",
    input: { op_kinds: "preview,inspect" },
  },
  {
    id: "std-017",
    title: "expensive only",
    input: { op_kinds: "train,evaluate" },
  },
  {
    id: "std-018",
    title: "duplicate tags collapsed",
    input: { op_kinds: "preview,preview,train" },
  },
  {
    id: "std-019",
    title: "case normalize",
    input: { op_kinds: "Preview,Train" },
  },
  {
    id: "std-020",
    title: "step burn cheat reject",
    input: { plan_steps: 3, step_burn_cheat: true },
  },
  {
    id: "std-021",
    title: "cheat with ops still reject",
    input: { op_kinds: "preview", step_burn_cheat: true },
  },
  {
    id: "std-022",
    title: "filter + hyper_tune",
    input: { op_kinds: "filter,hyper_tune" },
  },
  {
    id: "std-023",
    title: "all expensive ops",
    input: { op_kinds: "train,evaluate,search,feature_eng,hyper_tune" },
  },
  {
    id: "std-024",
    title: "mixed light and train",
    input: { op_kinds: "preview,train,evaluate" },
  },
  {
    id: "std-025",
    title: "pipe separators four ops",
    input: { op_kinds: "preview|inspect|train|search" },
  },
  {
    id: "std-026",
    title: "plan 6",
    input: { plan_steps: 6 },
  },
  {
    id: "std-027",
    title: "plan 8",
    input: { plan_steps: 8 },
  },
  {
    id: "std-028",
    title: "inspect with feature_eng",
    input: { op_kinds: "inspect,feature_eng" },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
