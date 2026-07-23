import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

function score(hint, opaqueCheat) {
  if (opaqueCheat) return { status: "reject", reason: "opaque_cheat" };
  const parts = String(hint ?? "")
    .split(/[,>|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const layers = Math.max(1, parts.length);
  return {
    status: "ok",
    pass_layers: layers,
    naive_modularity: 1,
    layered_modularity: layers * 2,
    delta_modularity: layers * 2 - 1,
  };
}

const cases = [
  { id: "mcd-001", title: "empty hint → one layer", hint: "" },
  { id: "mcd-002", title: "whitespace hint", hint: "   " },
  { id: "mcd-003", title: "single lower-to-linalg", hint: "lower-to-linalg" },
  { id: "mcd-004", title: "two comma passes", hint: "lower-to-linalg,vectorize" },
  {
    id: "mcd-005",
    title: "three comma passes",
    hint: "lower-to-linalg,vectorize,bufferize",
  },
  { id: "mcd-006", title: "pipe separator", hint: "lower-to-linalg|vectorize" },
  { id: "mcd-007", title: "angle separator", hint: "lower-to-linalg>vectorize>bufferize" },
  { id: "mcd-008", title: "mixed separators", hint: "a,b|c>d" },
  { id: "mcd-009", title: "spaces around commas", hint: " a , b , c " },
  { id: "mcd-010", title: "duplicate empty tokens ignored", hint: "a,,b" },
  { id: "mcd-011", title: "four passes", hint: "t,l,v,b" },
  { id: "mcd-012", title: "five passes", hint: "a,b,c,d,e" },
  { id: "mcd-013", title: "canonicalize alone", hint: "canonicalize" },
  { id: "mcd-014", title: "fuse then lower", hint: "fuse,lower-to-linalg" },
  { id: "mcd-015", title: "tile vectorize", hint: "tile|vectorize" },
  { id: "mcd-016", title: "long pipeline", hint: "p1,p2,p3,p4,p5,p6" },
  { id: "mcd-017", title: "trailing comma", hint: "lower-to-linalg," },
  { id: "mcd-018", title: "leading pipe", hint: "|vectorize" },
  { id: "mcd-019", title: "only separators", hint: ",,||>>" },
  { id: "mcd-020", title: "named llm passes", hint: "embed,attn,mlp,lm-head" },
  { id: "mcd-021", title: "tpu lower sketch", hint: "lower-to-linalg,tpu-map" },
  { id: "mcd-022", title: "quant then bufferize", hint: "quantize>bufferize" },
  { id: "mcd-023", title: "single letter", hint: "x" },
  { id: "mcd-024", title: "opaque cheat reject", hint: "a,b,c", opaque_cheat: true },
  { id: "mcd-025", title: "opaque cheat empty", hint: "", opaque_cheat: true },
  { id: "mcd-026", title: "seven passes", hint: "1,2,3,4,5,6,7" },
  { id: "mcd-027", title: "mlir dialect chain", hint: "tensor,linalg,vector,memref" },
  { id: "mcd-028", title: "spaced pipes", hint: " a | b | c " },
];

for (const c of cases) {
  const expect = score(c.hint, c.opaque_cheat === true);
  const doc = {
    id: c.id,
    title: c.title,
    input: {
      mlir_pass_hint: c.hint,
      ...(c.opaque_cheat ? { opaque_cheat: true } : {}),
    },
    expect,
  };
  writeFileSync(join(dir, `${c.id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
}

console.log(`wrote ${cases.length} fixtures to ${dir}`);
