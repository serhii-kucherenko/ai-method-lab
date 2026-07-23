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
  if (input.majority_cheat === true) {
    return { status: "reject", reason: "majority_cheat" };
  }
  let fit_steps = 1;
  let matched_tags = 0;
  if (input.rare_class_tags !== undefined || input.sample_feature_tags !== undefined) {
    const rare = parseTags(input.rare_class_tags);
    const sample = parseTags(input.sample_feature_tags);
    if (rare.length === 0 && sample.length === 0) {
      fit_steps = 1;
      matched_tags = 0;
    } else {
      const set = new Set(sample);
      const matched = rare.filter((t) => set.has(t));
      matched_tags = matched.length;
      fit_steps = Math.max(1, matched.length + (rare.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.fit_depth ?? 1);
    fit_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const rhythm = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags,
    naive_fit: 1,
    rhythm_fit: rhythm,
    delta_score: rhythm - 1,
  };
}

const cases = [
  { id: "hrd-001", title: "default fit 1", input: { fit_depth: 1 } },
  { id: "hrd-002", title: "fit 2", input: { fit_depth: 2 } },
  { id: "hrd-003", title: "fit 3 long-tail path", input: { fit_depth: 3 } },
  { id: "hrd-004", title: "fit 4", input: { fit_depth: 4 } },
  { id: "hrd-005", title: "fit 5", input: { fit_depth: 5 } },
  { id: "hrd-006", title: "missing fit → 1", input: {} },
  { id: "hrd-007", title: "zero fit clamped", input: { fit_depth: 0 } },
  { id: "hrd-008", title: "negative fit clamped", input: { fit_depth: -3 } },
  { id: "hrd-009", title: "fractional fit floor", input: { fit_depth: 2.9 } },
  {
    id: "hrd-010",
    title: "full rare-class overlap",
    input: {
      rare_class_tags: "pvc,lbbb,rbbb",
      sample_feature_tags: "pvc,lbbb,rbbb",
    },
  },
  {
    id: "hrd-011",
    title: "partial overlap two",
    input: {
      rare_class_tags: "pvc|afib",
      sample_feature_tags: "pvc|sinus",
    },
  },
  {
    id: "hrd-012",
    title: "angle tag separators",
    input: {
      rare_class_tags: "pac>bigeminy>trigeminy",
      sample_feature_tags: "pac>noise",
    },
  },
  {
    id: "hrd-013",
    title: "spaces around commas",
    input: {
      rare_class_tags: " a , b , c ",
      sample_feature_tags: " b , d ",
    },
  },
  {
    id: "hrd-014",
    title: "empty rare tags",
    input: { rare_class_tags: "", sample_feature_tags: "" },
  },
  {
    id: "hrd-015",
    title: "whitespace tags",
    input: { rare_class_tags: "   ", sample_feature_tags: "   " },
  },
  {
    id: "hrd-016",
    title: "duplicate empties ignored",
    input: {
      rare_class_tags: "pvc,,lbbb",
      sample_feature_tags: "pvc,,lbbb",
    },
  },
  {
    id: "hrd-017",
    title: "four rare one match",
    input: {
      rare_class_tags: "a,b,c,d",
      sample_feature_tags: "c,x",
    },
  },
  {
    id: "hrd-018",
    title: "six rare no match",
    input: {
      rare_class_tags: "a,b,c,d,e,f",
      sample_feature_tags: "z,y",
    },
  },
  {
    id: "hrd-019",
    title: "single rare rhythm label",
    input: {
      rare_class_tags: "vtach",
      sample_feature_tags: "vtach",
    },
  },
  {
    id: "hrd-020",
    title: "trailing comma",
    input: {
      rare_class_tags: "pvc,lbbb,",
      sample_feature_tags: "pvc,",
    },
  },
  {
    id: "hrd-021",
    title: "leading pipe",
    input: {
      rare_class_tags: "|pvc",
      sample_feature_tags: "|pvc",
    },
  },
  {
    id: "hrd-022",
    title: "only separators",
    input: { rare_class_tags: ",,||>>", sample_feature_tags: ",,||>>" },
  },
  {
    id: "hrd-023",
    title: "fit 7",
    input: { fit_depth: 7 },
  },
  {
    id: "hrd-024",
    title: "majority cheat reject",
    input: { fit_depth: 3, majority_cheat: true },
  },
  {
    id: "hrd-025",
    title: "cheat with tags reject",
    input: {
      rare_class_tags: "pvc,lbbb",
      sample_feature_tags: "pvc,lbbb",
      majority_cheat: true,
    },
  },
  {
    id: "hrd-026",
    title: "mixed separators",
    input: {
      rare_class_tags: "pvc,lbbb|rbbb>pac",
      sample_feature_tags: "lbbb|pac",
    },
  },
  {
    id: "hrd-027",
    title: "long-tail arrhythmia sketch",
    input: {
      rare_class_tags: "vtach,fusion,aberrant,artifact",
      sample_feature_tags: "fusion,artifact",
    },
  },
  {
    id: "hrd-028",
    title: "spaced pipes",
    input: {
      rare_class_tags: " pvc | lbbb | rbbb ",
      sample_feature_tags: " lbbb | sinus ",
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
