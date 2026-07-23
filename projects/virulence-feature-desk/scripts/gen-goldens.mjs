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
  if (input.sequence_only_cheat === true) {
    return { status: "reject", reason: "sequence_only_cheat" };
  }
  let fit_steps = 1;
  let matched_tags = 0;
  if (input.structural_tags !== undefined || input.evolutionary_tags !== undefined) {
    const structural = parseTags(input.structural_tags);
    const evolutionary = parseTags(input.evolutionary_tags);
    if (structural.length === 0 && evolutionary.length === 0) {
      fit_steps = 1;
      matched_tags = 0;
    } else {
      const evo = new Set(evolutionary);
      const matched = structural.filter((t) => evo.has(t));
      matched_tags = matched.length;
      fit_steps = Math.max(1, matched.length + (structural.length > 0 ? 1 : 0));
    }
  } else {
    const raw = Number(input.fit_depth ?? 1);
    fit_steps = !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw);
  }
  const virulence = fit_steps * 2 + 1;
  return {
    status: "ok",
    fit_steps,
    matched_tags,
    naive_fit: 1,
    virulence_fit: virulence,
    delta_risk: virulence - 1,
  };
}

const cases = [
  { id: "vfd-001", title: "default fit 1", input: { fit_depth: 1 } },
  { id: "vfd-002", title: "fit 2", input: { fit_depth: 2 } },
  { id: "vfd-003", title: "fit 3 integrated path", input: { fit_depth: 3 } },
  { id: "vfd-004", title: "fit 4", input: { fit_depth: 4 } },
  { id: "vfd-005", title: "fit 5", input: { fit_depth: 5 } },
  { id: "vfd-006", title: "missing fit → 1", input: {} },
  { id: "vfd-007", title: "zero fit clamped", input: { fit_depth: 0 } },
  { id: "vfd-008", title: "negative fit clamped", input: { fit_depth: -3 } },
  { id: "vfd-009", title: "fractional fit floor", input: { fit_depth: 2.9 } },
  {
    id: "vfd-010",
    title: "full structural+evolutionary overlap",
    input: {
      structural_tags: "pocket,motif,fold-class",
      evolutionary_tags: "pocket,motif,fold-class",
    },
  },
  {
    id: "vfd-011",
    title: "partial overlap two",
    input: {
      structural_tags: "pocket|toxin",
      evolutionary_tags: "pocket|resistance",
    },
  },
  {
    id: "vfd-012",
    title: "angle tag separators",
    input: {
      structural_tags: "beta>sheet>catalytic",
      evolutionary_tags: "beta>conservation",
    },
  },
  {
    id: "vfd-013",
    title: "spaces around commas",
    input: {
      structural_tags: " a , b , c ",
      evolutionary_tags: " b , d ",
    },
  },
  {
    id: "vfd-014",
    title: "empty structural tags",
    input: { structural_tags: "", evolutionary_tags: "" },
  },
  {
    id: "vfd-015",
    title: "whitespace tags",
    input: { structural_tags: "   ", evolutionary_tags: "   " },
  },
  {
    id: "vfd-016",
    title: "duplicate empties ignored",
    input: {
      structural_tags: "pocket,,motif",
      evolutionary_tags: "pocket,,motif",
    },
  },
  {
    id: "vfd-017",
    title: "four structural one match",
    input: {
      structural_tags: "a,b,c,d",
      evolutionary_tags: "c,x",
    },
  },
  {
    id: "vfd-018",
    title: "six structural no match",
    input: {
      structural_tags: "a,b,c,d,e,f",
      evolutionary_tags: "z,y",
    },
  },
  {
    id: "vfd-019",
    title: "single virulence label",
    input: {
      structural_tags: "adhesin",
      evolutionary_tags: "adhesin",
    },
  },
  {
    id: "vfd-020",
    title: "trailing comma",
    input: {
      structural_tags: "pocket,motif,",
      evolutionary_tags: "pocket,",
    },
  },
  {
    id: "vfd-021",
    title: "leading pipe",
    input: {
      structural_tags: "|pocket",
      evolutionary_tags: "|pocket",
    },
  },
  {
    id: "vfd-022",
    title: "only separators",
    input: { structural_tags: ",,||>>", evolutionary_tags: ",,||>>" },
  },
  {
    id: "vfd-023",
    title: "fit 7",
    input: { fit_depth: 7 },
  },
  {
    id: "vfd-024",
    title: "sequence-only cheat reject",
    input: { fit_depth: 3, sequence_only_cheat: true },
  },
  {
    id: "vfd-025",
    title: "cheat with tags reject",
    input: {
      structural_tags: "pocket,motif",
      evolutionary_tags: "pocket,motif",
      sequence_only_cheat: true,
    },
  },
  {
    id: "vfd-026",
    title: "mixed separators",
    input: {
      structural_tags: "pocket,motif|beta>sheet",
      evolutionary_tags: "motif|sheet",
    },
  },
  {
    id: "vfd-027",
    title: "resistance sketch",
    input: {
      structural_tags: "beta-lactamase,active-site,fold,pocket",
      evolutionary_tags: "active-site,pocket",
    },
  },
  {
    id: "vfd-028",
    title: "spaced pipes",
    input: {
      structural_tags: " pocket | motif | fold-class ",
      evolutionary_tags: " motif | horizontal-transfer ",
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
