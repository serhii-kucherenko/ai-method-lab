/**
 * Generate ≥25 dual-impl deploy-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

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
  if (input.manual_cheat === true) {
    return { status: "reject", reason: "manual_cheat" };
  }
  let harness_steps = 1;
  let matched_tags = 0;
  if (input.harness_tags !== undefined || input.config_feature_tags !== undefined) {
    const harness = parseTags(input.harness_tags);
    const config = parseTags(input.config_feature_tags);
    if (harness.length === 0 && config.length === 0) {
      harness_steps = 1;
      matched_tags = 0;
    } else {
      const set = new Set(config);
      const matched = harness.filter((t) => set.has(t));
      matched_tags = matched.length;
      harness_steps = Math.max(1, matched.length + (harness.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.harness_depth ?? 1);
    harness_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const deploy = harness_steps * 2 + 1;
  return {
    status: "ok",
    harness_steps,
    matched_tags,
    naive_fit: 1,
    deploy_fit: deploy,
    delta_score: deploy - 1,
  };
}

const cases = [
  { id: "rdd-001", title: "default depth 1", input: { harness_depth: 1 } },
  { id: "rdd-002", title: "depth 2", input: { harness_depth: 2 } },
  { id: "rdd-003", title: "depth 3 harness path", input: { harness_depth: 3 } },
  { id: "rdd-004", title: "depth 4", input: { harness_depth: 4 } },
  { id: "rdd-005", title: "depth 5", input: { harness_depth: 5 } },
  { id: "rdd-006", title: "missing depth → 1", input: {} },
  { id: "rdd-007", title: "zero depth clamped", input: { harness_depth: 0 } },
  { id: "rdd-008", title: "negative depth clamped", input: { harness_depth: -3 } },
  { id: "rdd-009", title: "fractional depth floor", input: { harness_depth: 2.9 } },
  {
    id: "rdd-010",
    title: "full harness overlap",
    input: {
      harness_tags: "ir-lift,static-analysis,measure-gate",
      config_feature_tags: "ir-lift,static-analysis,measure-gate",
    },
  },
  {
    id: "rdd-011",
    title: "partial overlap two",
    input: {
      harness_tags: "placement|streaming",
      config_feature_tags: "placement|latency",
    },
  },
  {
    id: "rdd-012",
    title: "angle tag separators",
    input: {
      harness_tags: "disaggregate>colocate>pipeline",
      config_feature_tags: "disaggregate>noise",
    },
  },
  {
    id: "rdd-013",
    title: "spaces around commas",
    input: {
      harness_tags: " a , b , c ",
      config_feature_tags: " b , d ",
    },
  },
  {
    id: "rdd-014",
    title: "no overlap harness",
    input: {
      harness_tags: "placement,streaming",
      config_feature_tags: "cache,batch",
    },
  },
  {
    id: "rdd-015",
    title: "empty harness tags",
    input: { harness_tags: "", config_feature_tags: "" },
  },
  {
    id: "rdd-016",
    title: "harness only no config",
    input: { harness_tags: "placement,streaming", config_feature_tags: "" },
  },
  {
    id: "rdd-017",
    title: "config only no harness",
    input: { harness_tags: "", config_feature_tags: "placement,streaming" },
  },
  {
    id: "rdd-018",
    title: "duplicate tags collapsed",
    input: {
      harness_tags: "placement,placement,streaming",
      config_feature_tags: "placement,streaming,streaming",
    },
  },
  {
    id: "rdd-019",
    title: "case normalize",
    input: {
      harness_tags: "Placement,STREAMING",
      config_feature_tags: "placement,streaming",
    },
  },
  {
    id: "rdd-020",
    title: "manual cheat reject",
    input: { harness_depth: 3, manual_cheat: true },
  },
  {
    id: "rdd-021",
    title: "cheat with tags still reject",
    input: {
      harness_tags: "placement",
      config_feature_tags: "placement",
      manual_cheat: true,
    },
  },
  {
    id: "rdd-022",
    title: "latency target tags",
    input: {
      harness_tags: "ttfo,critical-path,colocate",
      config_feature_tags: "ttfo,colocate,cache",
    },
  },
  {
    id: "rdd-023",
    title: "throughput target tags",
    input: {
      harness_tags: "pipeline,disaggregate,batch",
      config_feature_tags: "pipeline,noise",
    },
  },
  {
    id: "rdd-024",
    title: "gpu budget overlap",
    input: {
      harness_tags: "gpu-group,shard,overlap",
      config_feature_tags: "gpu-group,shard,overlap",
    },
  },
  {
    id: "rdd-025",
    title: "mixed harness three match",
    input: {
      harness_tags: "ir-lift|static-analysis|measure-gate|aux",
      config_feature_tags: "ir-lift|static-analysis|measure-gate|noise",
    },
  },
  {
    id: "rdd-026",
    title: "depth 6",
    input: { harness_depth: 6 },
  },
  {
    id: "rdd-027",
    title: "depth 8",
    input: { harness_depth: 8 },
  },
  {
    id: "rdd-028",
    title: "pipe separators only",
    input: {
      harness_tags: "stage|stream|buffer",
      config_feature_tags: "stage|buffer",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
