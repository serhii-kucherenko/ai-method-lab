/**
 * Generate ≥25 dual-impl plan-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
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
  if (input.single_cheat === true) {
    return { status: "reject", reason: "single_cheat" };
  }
  let plan_steps = 1;
  let matched_roles = 0;
  if (input.agent_roles !== undefined || input.workflow_tags !== undefined) {
    const roles = parseTags(input.agent_roles);
    const intents = parseTags(input.workflow_tags);
    if (roles.length === 0 && intents.length === 0) {
      plan_steps = 1;
      matched_roles = 0;
    } else {
      const set = new Set(intents);
      const matched = roles.filter((t) => set.has(t));
      matched_roles = matched.length;
      plan_steps = Math.max(1, matched.length + (roles.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.plan_depth ?? 1);
    plan_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const plan = plan_steps * 2 + 1;
  return {
    status: "ok",
    plan_steps,
    matched_roles,
    single_fit: 1,
    plan_fit: plan,
    delta_score: plan - 1,
  };
}

const cases = [
  { id: "std-001", title: "default depth 1", input: { plan_depth: 1 } },
  { id: "std-002", title: "depth 2", input: { plan_depth: 2 } },
  { id: "std-003", title: "depth 3 coordinator path", input: { plan_depth: 3 } },
  { id: "std-004", title: "depth 4", input: { plan_depth: 4 } },
  { id: "std-005", title: "depth 5", input: { plan_depth: 5 } },
  { id: "std-006", title: "missing depth → 1", input: {} },
  { id: "std-007", title: "zero depth clamped", input: { plan_depth: 0 } },
  { id: "std-008", title: "negative depth clamped", input: { plan_depth: -3 } },
  { id: "std-009", title: "fractional depth floor", input: { plan_depth: 2.9 } },
  {
    id: "std-010",
    title: "full role overlap",
    input: {
      agent_roles: "coordinator,sales,inventory",
      workflow_tags: "coordinator,sales,inventory",
    },
  },
  {
    id: "std-011",
    title: "partial overlap two",
    input: {
      agent_roles: "coordinator|sales",
      workflow_tags: "coordinator|purchasing",
    },
  },
  {
    id: "std-012",
    title: "angle tag separators",
    input: {
      agent_roles: "coordinator>sales>inventory",
      workflow_tags: "coordinator>noise",
    },
  },
  {
    id: "std-013",
    title: "spaces around commas",
    input: {
      agent_roles: " a , b , c ",
      workflow_tags: " b , d ",
    },
  },
  {
    id: "std-014",
    title: "no overlap roles",
    input: {
      agent_roles: "coordinator,sales",
      workflow_tags: "finance-only,rpa-rule",
    },
  },
  {
    id: "std-015",
    title: "empty role tags",
    input: { agent_roles: "", workflow_tags: "" },
  },
  {
    id: "std-016",
    title: "roles only no workflow",
    input: { agent_roles: "coordinator,sales", workflow_tags: "" },
  },
  {
    id: "std-017",
    title: "workflow only no roles",
    input: { agent_roles: "", workflow_tags: "coordinator,sales" },
  },
  {
    id: "std-018",
    title: "duplicate tags collapsed",
    input: {
      agent_roles: "coordinator,coordinator,sales",
      workflow_tags: "coordinator,inventory,sales",
    },
  },
  {
    id: "std-019",
    title: "case normalize",
    input: {
      agent_roles: "Coordinator,Sales",
      workflow_tags: "coordinator,sales",
    },
  },
  {
    id: "std-020",
    title: "single cheat reject",
    input: { plan_depth: 3, single_cheat: true },
  },
  {
    id: "std-021",
    title: "cheat with tags still reject",
    input: {
      agent_roles: "coordinator",
      workflow_tags: "coordinator",
      single_cheat: true,
    },
  },
  {
    id: "std-022",
    title: "purchasing lead-time tags",
    input: {
      agent_roles: "purchasing,lead-time,supplier-risk",
      workflow_tags: "purchasing,lead-time,stockout",
    },
  },
  {
    id: "std-023",
    title: "finance exposure tags",
    input: {
      agent_roles: "finance,cash-gate,approval-tier",
      workflow_tags: "finance,noise",
    },
  },
  {
    id: "std-024",
    title: "crisis sprint overlap",
    input: {
      agent_roles: "planner,executor,reflector",
      workflow_tags: "planner,executor,reflector",
    },
  },
  {
    id: "std-025",
    title: "mixed roles three match",
    input: {
      agent_roles: "coordinator|sales|inventory|purchasing",
      workflow_tags: "coordinator|sales|inventory|noise",
    },
  },
  {
    id: "std-026",
    title: "depth 6",
    input: { plan_depth: 6 },
  },
  {
    id: "std-027",
    title: "depth 8",
    input: { plan_depth: 8 },
  },
  {
    id: "std-028",
    title: "pipe separators only",
    input: {
      agent_roles: "coordinator|inventory|responder",
      workflow_tags: "coordinator|responder",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
