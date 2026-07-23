/**
 * Bulk rebrand Stage Validate Desk → Stage Validate Desk.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const exts = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".html",
  ".css",
  ".md",
  ".json",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "fixtures")
      continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

const pairs = [
  ["stage-validate-desk", "stage-validate-desk"],
  ["Stage Validate Desk", "Stage Validate Desk"],
  ["https://arxiv.org/abs/2607.14568v1", "https://arxiv.org/abs/2607.14568v1"],
  ["2607.14568", "2607.14568"],
  ["none published", "none published"],
  ["none published", "none published"],
  ["Authors' code:", "Authors' code:"],
  ["Authors&apos; code:", "Authors&apos; code:"],
  [
    "MiniCPM, Fermi, or Tesla C2075 as the product name",
    "MiniCPM, Fermi, or Tesla C2075 as the product name",
  ],
  [
    "Fermi CUDA engine or MiniCPM product",
    "Fermi CUDA engine or MiniCPM product",
  ],
  ["MiniCPM / Fermi brand", "MiniCPM / Fermi brand"],
  ["Tesla C2075", "Tesla C2075"],
  [
    "Stage-validated inference plans: gate each stage against a reference and measure long-context / bit-width choices — vs naive intuition that skips stage gates (short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling).",
    "Stage-validated inference plans: gate each stage against a reference and measure long-context / bit-width choices — vs naive intuition that skips stage gates (short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling).",
  ],
  ["Stage-validated plan scoring", "Stage-validated plan scoring"],
  ["stage-gated plan", "stage-gated plan"],
  ["Stage-gated plan", "Stage-gated plan"],
  [
    "naive short-bench plans that skip stage gates",
    "naive short-bench plans that skip stage gates",
  ],
  [
    "naive intuition without stage gates",
    "naive intuition without stage gates",
  ],
  ["stage-validate jobs", "stage-validate jobs"],
  ["Stage-validate jobs", "Stage-validate jobs"],
  ["Stage-validate job", "Stage-validate job"],
  ["stage-validate job", "stage-validate job"],
  ["stage gate scores", "stage gate scores"],
  ["stage-gate · long-context · bit-measure", "stage-gate · long-context · bit-measure"],
  ["stage-gate validation", "stage-gate validation"],
  ["conjoint stage-gate validation", "stage-gate validation"],
  ["stage-gated", "stage-gated"],
  ["passed stage gates", "passed stage gates"],
  [
    "Gate each stage — then measure before done",
    "Gate each stage — then measure before done",
  ],
  [
    "Stage-validated scoring across safety, public, and international axes — method experiment, not a Fermi CUDA engine or MiniCPM product",
    "Stage gates plus tiered long-context / bit-width / kernel measurements — method experiment, not a Fermi CUDA engine",
  ],
  ["--svd-", "--svd-"],
  ["svd-", "svd-"],
  ["Skip-gates cheat", "Skip-gates cheat"],
  ["skip-gates cheat", "skip-gates cheat"],
  ["Skip gates", "Skip gates"],
  ["port / workload profile", "port / workload profile"],
  ["Stage-validated", "Stage-validated"],
  ["stage-validated", "stage-validated"],
  ["instrument mist", "instrument mist"],
  ["instrument paper", "instrument paper"],
  ["23-stage-validate-desk-lessons", "24-stage-validate-desk-lessons"],
  ["Naive intuition", "Naive intuition"],
  ["naive intuition", "naive intuition"],
  ["short-bench only", "short-bench only"],
  ["assume 4-bit faster", "assume 4-bit faster"],
  ["assume hand GEMM ceiling", "assume hand GEMM ceiling"],
  ["naive_intuition", "naive_intuition"],
  ["assume_4bit_faster", "assume_4bit_faster"],
  ["assume_hand_gemm", "assume_hand_gemm"],
  ["Reference tolerance floor", "Reference tolerance floor"],
  ["reference tolerance floor", "reference tolerance floor"],
  ["Naive intuition extremity", "Naive extremity"],
  ["Workload / profile", "Workload / profile"],
  ["Multimodal Assistant on Constrained GPU: Stage-Validated Ports", "Multimodal Assistant on Constrained GPU: Stage-Validated Ports"],
  ["authors' Fermi CUDA engine", "authors' Fermi CUDA engine"],
  ["authors&apos; Fermi CUDA engine", "authors&apos; Fermi CUDA engine"],
  ["commercial inference stacks", "commercial inference stacks"],
  ["authors' code (none published)", "authors' code (none published)"],
  ["Sora", "Sora"],
  ["IBM Plex Sans", "IBM Plex Sans"],
  ["instrument mist", "instrument mist"],
  ["Instrument slate", "Instrument slate"],
  ["instrument slate", "instrument slate"],
  ["stage-gated proposal", "stage-gated plan"],
  ["Stage-gated plan", "Stage-gated plan"],
  ["measurement leans", "measurement leans"],
  ["skip_gates", "skip_gates"],
  ["read_stage_tolerances", "read_stage_tolerances"],
  ["weight_by_tolerance_floor", "weight_by_tolerance_floor"],
  ["score_stage_gated_plan", "score_stage_gated_plan"],
  ["naive_short_bench_baseline", "naive_short_bench_baseline"],
  ["short_bench_skip_gates_trust_intuition", "short_bench_skip_gates_trust_intuition"],
  ["assume_4bit_faster_governance", "assume_4bit_faster_skip_bit_measure"],
  ["assume_hand_gemm_scope", "assume_hand_gemm_ceiling_skip_long_ctx"],
  ["stage_gate_plus_tiered_measurements", "stage_gate_plus_tiered_measurements"],
];

const files = walk(root);
let changed = 0;
for (const file of files) {
  let text = readFileSync(file, "utf8");
  const orig = text;
  for (const [a, b] of pairs) {
    if (a !== b) text = text.split(a).join(b);
  }
  if (text !== orig) {
    writeFileSync(file, text);
    changed += 1;
  }
}
console.log(`rebranded ${changed} files`);
