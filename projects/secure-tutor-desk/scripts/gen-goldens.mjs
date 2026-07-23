/**
 * Generate ≥25 dual-impl tutor-fit golden fixtures.
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
  let orchestrate_steps = 1;
  let matched_tags = 0;
  if (input.role_tags !== undefined || input.intent_tags !== undefined) {
    const roles = parseTags(input.role_tags);
    const intents = parseTags(input.intent_tags);
    if (roles.length === 0 && intents.length === 0) {
      orchestrate_steps = 1;
      matched_tags = 0;
    } else {
      const set = new Set(intents);
      const matched = roles.filter((t) => set.has(t));
      matched_tags = matched.length;
      orchestrate_steps = Math.max(1, matched.length + (roles.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.orchestrate_depth ?? 1);
    orchestrate_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const tutor = orchestrate_steps * 2 + 1;
  return {
    status: "ok",
    orchestrate_steps,
    matched_tags,
    naive_fit: 1,
    tutor_fit: tutor,
    delta_score: tutor - 1,
  };
}

const cases = [
  { id: "std-001", title: "default depth 1", input: { orchestrate_depth: 1 } },
  { id: "std-002", title: "depth 2", input: { orchestrate_depth: 2 } },
  { id: "std-003", title: "depth 3 socratic path", input: { orchestrate_depth: 3 } },
  { id: "std-004", title: "depth 4", input: { orchestrate_depth: 4 } },
  { id: "std-005", title: "depth 5", input: { orchestrate_depth: 5 } },
  { id: "std-006", title: "missing depth → 1", input: {} },
  { id: "std-007", title: "zero depth clamped", input: { orchestrate_depth: 0 } },
  { id: "std-008", title: "negative depth clamped", input: { orchestrate_depth: -3 } },
  { id: "std-009", title: "fractional depth floor", input: { orchestrate_depth: 2.9 } },
  {
    id: "std-010",
    title: "full role overlap",
    input: {
      role_tags: "socratic,practice,analogy",
      intent_tags: "socratic,practice,analogy",
    },
  },
  {
    id: "std-011",
    title: "partial overlap two",
    input: {
      role_tags: "socratic|practice",
      intent_tags: "socratic|security-check",
    },
  },
  {
    id: "std-012",
    title: "angle tag separators",
    input: {
      role_tags: "socratic>practice>analogy",
      intent_tags: "socratic>noise",
    },
  },
  {
    id: "std-013",
    title: "spaces around commas",
    input: {
      role_tags: " a , b , c ",
      intent_tags: " b , d ",
    },
  },
  {
    id: "std-014",
    title: "no overlap roles",
    input: {
      role_tags: "socratic,practice",
      intent_tags: "focus-mode,calm-mode",
    },
  },
  {
    id: "std-015",
    title: "empty role tags",
    input: { role_tags: "", intent_tags: "" },
  },
  {
    id: "std-016",
    title: "roles only no intent",
    input: { role_tags: "socratic,practice", intent_tags: "" },
  },
  {
    id: "std-017",
    title: "intent only no roles",
    input: { role_tags: "", intent_tags: "socratic,practice" },
  },
  {
    id: "std-018",
    title: "duplicate tags collapsed",
    input: {
      role_tags: "socratic,socratic,practice",
      intent_tags: "socratic,practice,practice",
    },
  },
  {
    id: "std-019",
    title: "case normalize",
    input: {
      role_tags: "Socratic,PRACTICE",
      intent_tags: "socratic,practice",
    },
  },
  {
    id: "std-020",
    title: "single cheat reject",
    input: { orchestrate_depth: 3, single_cheat: true },
  },
  {
    id: "std-021",
    title: "cheat with tags still reject",
    input: {
      role_tags: "socratic",
      intent_tags: "socratic",
      single_cheat: true,
    },
  },
  {
    id: "std-022",
    title: "OWASP inject path tags",
    input: {
      role_tags: "security-check,cwe-22,path-traversal",
      intent_tags: "security-check,cwe-22,focus-mode",
    },
  },
  {
    id: "std-023",
    title: "accessibility focus tags",
    input: {
      role_tags: "focus-mode,dyslexia-font,progress-bar",
      intent_tags: "focus-mode,noise",
    },
  },
  {
    id: "std-024",
    title: "hint stage overlap",
    input: {
      role_tags: "conceptual,procedural,worked-example",
      intent_tags: "conceptual,procedural,worked-example",
    },
  },
  {
    id: "std-025",
    title: "mixed roles three match",
    input: {
      role_tags: "socratic|practice|analogy|security-check",
      intent_tags: "socratic|practice|analogy|noise",
    },
  },
  {
    id: "std-026",
    title: "depth 6",
    input: { orchestrate_depth: 6 },
  },
  {
    id: "std-027",
    title: "depth 8",
    input: { orchestrate_depth: 8 },
  },
  {
    id: "std-028",
    title: "pipe separators only",
    input: {
      role_tags: "socratic|analogy|visual-guide",
      intent_tags: "socratic|visual-guide",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
