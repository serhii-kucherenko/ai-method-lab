/**
 * Generate ≥25 dual-impl pathology-fit golden fixtures.
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
  if (input.single_view_cheat === true) {
    return { status: "reject", reason: "single_view_cheat" };
  }
  let fit_steps = 1;
  let matched_tags = 0;
  if (input.expert_tags !== undefined || input.sample_feature_tags !== undefined) {
    const experts = parseTags(input.expert_tags);
    const sample = parseTags(input.sample_feature_tags);
    if (experts.length === 0 && sample.length === 0) {
      fit_steps = 1;
      matched_tags = 0;
    } else {
      const set = new Set(sample);
      const matched = experts.filter((t) => set.has(t));
      matched_tags = matched.length;
      fit_steps = Math.max(1, matched.length + (experts.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.fit_depth ?? 1);
    fit_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const pathology = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags,
    naive_fit: 1,
    pathology_fit: pathology,
    delta_score: pathology - 1,
  };
}

const cases = [
  { id: "pvd-001", title: "default fit 1", input: { fit_depth: 1 } },
  { id: "pvd-002", title: "fit 2", input: { fit_depth: 2 } },
  { id: "pvd-003", title: "fit 3 multi-expert path", input: { fit_depth: 3 } },
  { id: "pvd-004", title: "fit 4", input: { fit_depth: 4 } },
  { id: "pvd-005", title: "fit 5", input: { fit_depth: 5 } },
  { id: "pvd-006", title: "missing fit → 1", input: {} },
  { id: "pvd-007", title: "zero fit clamped", input: { fit_depth: 0 } },
  { id: "pvd-008", title: "negative fit clamped", input: { fit_depth: -3 } },
  { id: "pvd-009", title: "fractional fit floor", input: { fit_depth: 2.9 } },
  {
    id: "pvd-010",
    title: "full expert overlap",
    input: {
      expert_tags: "vision,vision-language,slide",
      sample_feature_tags: "vision,vision-language,slide",
    },
  },
  {
    id: "pvd-011",
    title: "partial overlap two",
    input: {
      expert_tags: "vision|slide",
      sample_feature_tags: "vision|stain",
    },
  },
  {
    id: "pvd-012",
    title: "angle tag separators",
    input: {
      expert_tags: "morphology>semantics>wsi",
      sample_feature_tags: "morphology>noise",
    },
  },
  {
    id: "pvd-013",
    title: "spaces around commas",
    input: {
      expert_tags: " a , b , c ",
      sample_feature_tags: " b , d ",
    },
  },
  {
    id: "pvd-014",
    title: "no overlap experts",
    input: {
      expert_tags: "vision,slide",
      sample_feature_tags: "artifact,blur",
    },
  },
  {
    id: "pvd-015",
    title: "empty expert tags",
    input: { expert_tags: "", sample_feature_tags: "" },
  },
  {
    id: "pvd-016",
    title: "experts only no sample",
    input: { expert_tags: "vision,slide", sample_feature_tags: "" },
  },
  {
    id: "pvd-017",
    title: "sample only no experts",
    input: { expert_tags: "", sample_feature_tags: "vision,slide" },
  },
  {
    id: "pvd-018",
    title: "duplicate tags collapsed",
    input: {
      expert_tags: "vision,vision,slide",
      sample_feature_tags: "vision,slide,slide",
    },
  },
  {
    id: "pvd-019",
    title: "case normalize",
    input: {
      expert_tags: "Vision,SLIDE",
      sample_feature_tags: "vision,slide",
    },
  },
  {
    id: "pvd-020",
    title: "single-view cheat reject",
    input: { fit_depth: 3, single_view_cheat: true },
  },
  {
    id: "pvd-021",
    title: "cheat with tags still reject",
    input: {
      expert_tags: "vision",
      sample_feature_tags: "vision",
      single_view_cheat: true,
    },
  },
  {
    id: "pvd-022",
    title: "roi morphology tags",
    input: {
      expert_tags: "gland,nuclei,stroma",
      sample_feature_tags: "gland,stroma,fat",
    },
  },
  {
    id: "pvd-023",
    title: "vlm concept tags",
    input: {
      expert_tags: "cribriform,comedo,necrosis",
      sample_feature_tags: "cribriform,inflammation",
    },
  },
  {
    id: "pvd-024",
    title: "slide-level context",
    input: {
      expert_tags: "wsi,til,margin",
      sample_feature_tags: "wsi,til,margin",
    },
  },
  {
    id: "pvd-025",
    title: "mixed experts three match",
    input: {
      expert_tags: "vision|vision-language|slide|aux",
      sample_feature_tags: "vision|vision-language|slide|noise",
    },
  },
  {
    id: "pvd-026",
    title: "fit depth 6",
    input: { fit_depth: 6 },
  },
  {
    id: "pvd-027",
    title: "fit depth 8",
    input: { fit_depth: 8 },
  },
  {
    id: "pvd-028",
    title: "pipe separators only",
    input: {
      expert_tags: "tile|roi|patch",
      sample_feature_tags: "tile|patch",
    },
  },
];

for (const c of cases) {
  const expect = score(c.input);
  const doc = { id: c.id, title: c.title, input: c.input, expect };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
