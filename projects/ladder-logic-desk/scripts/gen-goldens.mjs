/**
 * Generate ≥25 dual-impl bomb-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
 * Scoring must match src/domain/bombFit.ts (and bombFitB.ts).
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

const NAIVE_TRIGGERS = new Set(["comparison", "counter", "timer"]);
const FORMAL_ONLY = new Set(["adaptive", "opaque", "multi-scan"]);

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
  if (input.naive_cheat === true) {
    return { status: "reject", reason: "naive_cheat" };
  }
  let scan_steps = 1;
  let matched_triggers = 0;
  let naive_hits = 0;
  const hasTags =
    input.trigger_kinds !== undefined || input.payload_kinds !== undefined;
  if (hasTags) {
    const triggers = parseTags(input.trigger_kinds);
    const payloads = parseTags(input.payload_kinds);
    if (triggers.length === 0 && payloads.length === 0) {
      scan_steps = 1;
      matched_triggers = 0;
      naive_hits = 0;
    } else {
      const known = triggers.filter(
        (t) => NAIVE_TRIGGERS.has(t) || FORMAL_ONLY.has(t),
      );
      naive_hits = triggers.filter((t) => NAIVE_TRIGGERS.has(t)).length;
      matched_triggers = known.length;
      scan_steps = Math.max(1, known.length + (payloads.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.scan_depth ?? 1);
    scan_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const naive_fit = hasTags ? Math.max(1, naive_hits) : 1;
  const bomb_fit = scan_steps * 2 + 1;
  return {
    status: "ok",
    scan_steps,
    matched_triggers,
    naive_fit,
    bomb_fit,
    delta_score: bomb_fit - naive_fit,
  };
}

const cases = [
  { id: "std-001", title: "default depth 1", input: { scan_depth: 1 } },
  { id: "std-002", title: "depth 2", input: { scan_depth: 2 } },
  { id: "std-003", title: "depth 3 formal path", input: { scan_depth: 3 } },
  { id: "std-004", title: "depth 4", input: { scan_depth: 4 } },
  { id: "std-005", title: "depth 5", input: { scan_depth: 5 } },
  { id: "std-006", title: "missing depth → 1", input: {} },
  { id: "std-007", title: "zero depth clamped", input: { scan_depth: 0 } },
  { id: "std-008", title: "negative depth clamped", input: { scan_depth: -3 } },
  { id: "std-009", title: "fractional depth floor", input: { scan_depth: 2.9 } },
  {
    id: "std-010",
    title: "comparison + counter + timer with actuator",
    input: {
      trigger_kinds: "comparison,counter,timer",
      payload_kinds: "actuator",
    },
  },
  {
    id: "std-011",
    title: "adaptive alone (naive misses)",
    input: {
      trigger_kinds: "adaptive",
      payload_kinds: "denial",
    },
  },
  {
    id: "std-012",
    title: "opaque + multi-scan",
    input: {
      trigger_kinds: "opaque>multi-scan",
      payload_kinds: "sensor-forge",
    },
  },
  {
    id: "std-013",
    title: "spaces around commas",
    input: {
      trigger_kinds: " comparison , adaptive ",
      payload_kinds: " actuator ",
    },
  },
  {
    id: "std-014",
    title: "unknown trigger tags only",
    input: {
      trigger_kinds: "noise-a,noise-b",
      payload_kinds: "noise-c",
    },
  },
  {
    id: "std-015",
    title: "empty trigger tags",
    input: { trigger_kinds: "", payload_kinds: "" },
  },
  {
    id: "std-016",
    title: "triggers only no payload",
    input: { trigger_kinds: "comparison,counter", payload_kinds: "" },
  },
  {
    id: "std-017",
    title: "payload only no triggers",
    input: { trigger_kinds: "", payload_kinds: "actuator,denial" },
  },
  {
    id: "std-018",
    title: "duplicate tags collapsed",
    input: {
      trigger_kinds: "comparison,comparison,adaptive",
      payload_kinds: "actuator,denial",
    },
  },
  {
    id: "std-019",
    title: "case normalize",
    input: {
      trigger_kinds: "Comparison,Timer",
      payload_kinds: "Actuator",
    },
  },
  {
    id: "std-020",
    title: "naive cheat reject",
    input: { scan_depth: 3, naive_cheat: true },
  },
  {
    id: "std-021",
    title: "cheat with tags still reject",
    input: {
      trigger_kinds: "comparison",
      payload_kinds: "actuator",
      naive_cheat: true,
    },
  },
  {
    id: "std-022",
    title: "counter timer denial",
    input: {
      trigger_kinds: "counter,timer",
      payload_kinds: "denial",
    },
  },
  {
    id: "std-023",
    title: "all formal-only triggers",
    input: {
      trigger_kinds: "adaptive,opaque,multi-scan",
      payload_kinds: "sensor-forge",
    },
  },
  {
    id: "std-024",
    title: "mixed naive and adaptive",
    input: {
      trigger_kinds: "comparison,adaptive,opaque",
      payload_kinds: "actuator",
    },
  },
  {
    id: "std-025",
    title: "pipe separators four triggers",
    input: {
      trigger_kinds: "comparison|counter|timer|adaptive",
      payload_kinds: "actuator|denial",
    },
  },
  {
    id: "std-026",
    title: "depth 6",
    input: { scan_depth: 6 },
  },
  {
    id: "std-027",
    title: "depth 8",
    input: { scan_depth: 8 },
  },
  {
    id: "std-028",
    title: "timer with sensor forge",
    input: {
      trigger_kinds: "timer",
      payload_kinds: "sensor-forge",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
