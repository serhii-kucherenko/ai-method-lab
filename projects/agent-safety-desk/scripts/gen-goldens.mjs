/**
 * Generate ≥25 dual-impl safety-fit golden fixtures.
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
  if (input.checklist_cheat === true) {
    return { status: "reject", reason: "checklist_cheat" };
  }
  let monitor_steps = 1;
  let matched_tags = 0;
  if (input.invariant_tags !== undefined || input.regression_tags !== undefined) {
    const roles = parseTags(input.invariant_tags);
    const intents = parseTags(input.regression_tags);
    if (roles.length === 0 && intents.length === 0) {
      monitor_steps = 1;
      matched_tags = 0;
    } else {
      const set = new Set(intents);
      const matched = roles.filter((t) => set.has(t));
      matched_tags = matched.length;
      monitor_steps = Math.max(1, matched.length + (roles.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.monitor_depth ?? 1);
    monitor_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const safety = monitor_steps * 2 + 1;
  return {
    status: "ok",
    monitor_steps,
    matched_tags,
    checklist_fit: 1,
    safety_fit: safety,
    delta_score: safety - 1,
  };
}

const cases = [
  { id: "std-001", title: "default depth 1", input: { monitor_depth: 1 } },
  { id: "std-002", title: "depth 2", input: { monitor_depth: 2 } },
  { id: "std-003", title: "depth 3 invariant path", input: { monitor_depth: 3 } },
  { id: "std-004", title: "depth 4", input: { monitor_depth: 4 } },
  { id: "std-005", title: "depth 5", input: { monitor_depth: 5 } },
  { id: "std-006", title: "missing depth → 1", input: {} },
  { id: "std-007", title: "zero depth clamped", input: { monitor_depth: 0 } },
  { id: "std-008", title: "negative depth clamped", input: { monitor_depth: -3 } },
  { id: "std-009", title: "fractional depth floor", input: { monitor_depth: 2.9 } },
  {
    id: "std-010",
    title: "full role overlap",
    input: {
      invariant_tags: "invariant,edge,node-class",
      regression_tags: "invariant,edge,node-class",
    },
  },
  {
    id: "std-011",
    title: "partial overlap two",
    input: {
      invariant_tags: "invariant|edge",
      regression_tags: "invariant|tool-boundary",
    },
  },
  {
    id: "std-012",
    title: "angle tag separators",
    input: {
      invariant_tags: "invariant>edge>node-class",
      regression_tags: "invariant>noise",
    },
  },
  {
    id: "std-013",
    title: "spaces around commas",
    input: {
      invariant_tags: " a , b , c ",
      regression_tags: " b , d ",
    },
  },
  {
    id: "std-014",
    title: "no overlap roles",
    input: {
      invariant_tags: "invariant,edge",
      regression_tags: "focus-mode,calm-mode",
    },
  },
  {
    id: "std-015",
    title: "empty role tags",
    input: { invariant_tags: "", regression_tags: "" },
  },
  {
    id: "std-016",
    title: "roles only no intent",
    input: { invariant_tags: "invariant,edge", regression_tags: "" },
  },
  {
    id: "std-017",
    title: "intent only no roles",
    input: { invariant_tags: "", regression_tags: "invariant,edge" },
  },
  {
    id: "std-018",
    title: "duplicate tags collapsed",
    input: {
      invariant_tags: "invariant,invariant,edge",
      regression_tags: "invariant,edge,edge",
    },
  },
  {
    id: "std-019",
    title: "case normalize",
    input: {
      invariant_tags: "invariant,edge",
      regression_tags: "invariant,edge",
    },
  },
  {
    id: "std-020",
    title: "single cheat reject",
    input: { monitor_depth: 3, checklist_cheat: true },
  },
  {
    id: "std-021",
    title: "cheat with tags still reject",
    input: {
      invariant_tags: "invariant",
      regression_tags: "invariant",
      checklist_cheat: true,
    },
  },
  {
    id: "std-022",
    title: "OWASP inject path tags",
    input: {
      invariant_tags: "tool-boundary,cwe-22,path-traversal",
      regression_tags: "tool-boundary,cwe-22,focus-mode",
    },
  },
  {
    id: "std-023",
    title: "privilege focus tags",
    input: {
      invariant_tags: "focus-mode,dyslexia-font,progress-bar",
      regression_tags: "focus-mode,noise",
    },
  },
  {
    id: "std-024",
    title: "hint stage overlap",
    input: {
      invariant_tags: "conceptual,procedural,worked-example",
      regression_tags: "conceptual,procedural,worked-example",
    },
  },
  {
    id: "std-025",
    title: "mixed roles three match",
    input: {
      invariant_tags: "invariant|edge|node-class|tool-boundary",
      regression_tags: "invariant|edge|node-class|noise",
    },
  },
  {
    id: "std-026",
    title: "depth 6",
    input: { monitor_depth: 6 },
  },
  {
    id: "std-027",
    title: "depth 8",
    input: { monitor_depth: 8 },
  },
  {
    id: "std-028",
    title: "pipe separators only",
    input: {
      invariant_tags: "invariant|node-class|visual-guide",
      regression_tags: "invariant|visual-guide",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
