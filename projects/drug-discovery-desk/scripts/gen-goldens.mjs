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
  if (input.unconditioned_cheat === true) {
    return { status: "reject", reason: "unconditioned_cheat" };
  }
  let fit_steps = 1;
  let matched_tags = 0;
  if (input.indication_tags !== undefined || input.candidate_tags !== undefined) {
    const indication = parseTags(input.indication_tags);
    const candidate = parseTags(input.candidate_tags);
    if (indication.length === 0 && candidate.length === 0) {
      fit_steps = 1;
      matched_tags = 0;
    } else {
      const cand = new Set(candidate);
      const matched = indication.filter((t) => cand.has(t));
      matched_tags = matched.length;
      fit_steps = Math.max(1, matched.length + (indication.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.fit_depth ?? 1);
    fit_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const disease = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags,
    naive_fit: 1,
    disease_fit: disease,
    delta_fit: disease - 1,
  };
}

const cases = [
  { id: "ddd-001", title: "default fit 1", input: { fit_depth: 1 } },
  { id: "ddd-002", title: "fit 2", input: { fit_depth: 2 } },
  { id: "ddd-003", title: "fit 3 disease path", input: { fit_depth: 3 } },
  { id: "ddd-004", title: "fit 4", input: { fit_depth: 4 } },
  { id: "ddd-005", title: "fit 5", input: { fit_depth: 5 } },
  { id: "ddd-006", title: "missing fit → 1", input: {} },
  { id: "ddd-007", title: "zero fit clamped", input: { fit_depth: 0 } },
  { id: "ddd-008", title: "negative fit clamped", input: { fit_depth: -3 } },
  { id: "ddd-009", title: "fractional fit floor", input: { fit_depth: 2.9 } },
  {
    id: "ddd-010",
    title: "full indication overlap",
    input: {
      indication_tags: "oncology,kinase,solid-tumor",
      candidate_tags: "oncology,kinase,solid-tumor",
    },
  },
  {
    id: "ddd-011",
    title: "partial overlap two",
    input: {
      indication_tags: "oncology|diabetes",
      candidate_tags: "oncology|cardiology",
    },
  },
  {
    id: "ddd-012",
    title: "angle tag separators",
    input: {
      indication_tags: "cns>depression>ssri",
      candidate_tags: "cns>anxiety",
    },
  },
  {
    id: "ddd-013",
    title: "spaces around commas",
    input: {
      indication_tags: " a , b , c ",
      candidate_tags: " b , d ",
    },
  },
  {
    id: "ddd-014",
    title: "empty indication tags",
    input: { indication_tags: "", candidate_tags: "" },
  },
  {
    id: "ddd-015",
    title: "whitespace tags",
    input: { indication_tags: "   ", candidate_tags: "   " },
  },
  {
    id: "ddd-016",
    title: "duplicate empties ignored",
    input: {
      indication_tags: "oncology,,kinase",
      candidate_tags: "oncology,,kinase",
    },
  },
  {
    id: "ddd-017",
    title: "four indications one match",
    input: {
      indication_tags: "a,b,c,d",
      candidate_tags: "c,x",
    },
  },
  {
    id: "ddd-018",
    title: "six indications no match",
    input: {
      indication_tags: "a,b,c,d,e,f",
      candidate_tags: "z,y",
    },
  },
  {
    id: "ddd-019",
    title: "single indication label",
    input: {
      indication_tags: "hypertension",
      candidate_tags: "hypertension",
    },
  },
  {
    id: "ddd-020",
    title: "trailing comma",
    input: {
      indication_tags: "oncology,kinase,",
      candidate_tags: "oncology,",
    },
  },
  {
    id: "ddd-021",
    title: "leading pipe",
    input: {
      indication_tags: "|oncology",
      candidate_tags: "|oncology",
    },
  },
  {
    id: "ddd-022",
    title: "only separators",
    input: { indication_tags: ",,||>>", candidate_tags: ",,||>>" },
  },
  {
    id: "ddd-023",
    title: "fit 7",
    input: { fit_depth: 7 },
  },
  {
    id: "ddd-024",
    title: "unconditioned cheat reject",
    input: { fit_depth: 3, unconditioned_cheat: true },
  },
  {
    id: "ddd-025",
    title: "cheat with tags reject",
    input: {
      indication_tags: "oncology,kinase",
      candidate_tags: "oncology,kinase",
      unconditioned_cheat: true,
    },
  },
  {
    id: "ddd-026",
    title: "mixed separators",
    input: {
      indication_tags: "oncology,kinase|cns>pain",
      candidate_tags: "kinase|pain",
    },
  },
  {
    id: "ddd-027",
    title: "disease scaffold sketch",
    input: {
      indication_tags: "alzheimer,amyloid,cns,neuro",
      candidate_tags: "amyloid,cns",
    },
  },
  {
    id: "ddd-028",
    title: "spaced pipes",
    input: {
      indication_tags: " oncology | kinase | solid-tumor ",
      candidate_tags: " kinase | immuno ",
    },
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
