/**
 * Bulk rebrand Joint Care Desk → Joint Care Desk.
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
    if (name === "synthesis.ts" || name === "synthesisB.ts" || name === "claim.ts")
      continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

const pairs = [
  ["joint-care-desk", "joint-care-desk"],
  ["Joint Care Desk", "Joint Care Desk"],
  ["https://arxiv.org/abs/2607.12527v2", "https://arxiv.org/abs/2607.12527v2"],
  ["2607.12527", "2607.12527"],
  ["OrthoPilot", "OrthoPilot"],
  ["OrthoPilot", "OrthoPilot"],
  ["OrthoPilot brand", "OrthoPilot brand"],
  ["OrthoPilot", "OrthoPilot"],
  ["authors' OrthoPilot system", "authors' OrthoPilot system"],
  ["OrthoPilot clinical agent", "OrthoPilot clinical agent"],
  ["\\bFermi\\b", "OrthoPilot"],
  ["OrthoPilot", "OrthoPilot"],
  ["--jcd-", "--jcd-"],
  ["var(--jcd-", "var(--jcd-"],
  ["jcd-wash", "jcd-wash"],
  ["jcd-arrow", "jcd-arrow"],
  ["jcd-nav-active", "jcd-nav-active"],
  ["jcd-reveal", "jcd-reveal"],
  ["pathway jobs", "pathway jobs"],
  ["Pathway jobs", "Pathway jobs"],
  ["Pathway job", "Pathway job"],
  ["pathway job", "pathway job"],
  ["dual-evidence plan", "dual-evidence plan"],
  ["Dual-evidence plan", "Dual-evidence plan"],
  ["dual-evidence", "dual-evidence"],
  ["pathway scores", "pathway scores"],
  ["hospital · external · stage", "hospital · external · stage"],
  ["stage transition", "stage transition"],
  ["acquired evidence", "acquired evidence"],
  ["Ground both worlds — stage the pathway", "Ground both worlds — stage the pathway"],
  ["Indication / pathway", "Indication / pathway"],
  ["Evidence completeness floor", "Evidence completeness floor"],
  ["Naive parametric extremity", "Naive parametric extremity"],
  ["Hospital-only / stage-blind cheat", "Hospital-only / stage-blind cheat"],
  ["stage-blind", "stage-blind"],
  ["ignore external knowledge", "ignore external knowledge"],
  ["hospital-only plan", "hospital-only plan"],
  ["external-blind", "external-blind"],
  ["external knowledge", "external knowledge"],
  ["hospital evidence", "hospital evidence"],
  ["stage-aware transitions", "stage-aware transitions"],
  ["stairs", "stairs"],
  ["hurdles", "hurdles"],
  ["gaps", "gaps"],
  ["care pathway profile", "care pathway profile"],
  ["indication / pathway", "indication / pathway"],
  ["Project / port / care pathway profile catalog", "Project / indication / pathway profile catalog"],
  ["naive parametric policy", "naive parametric policy"],
  ["Naive parametric policy", "Naive parametric policy"],
  ["stage transitions", "stage transitions"],
  ["Skill transitions", "Skill transitions"],
  ["dual-evidence + measurements", "dual-evidence + perception"],
  ["Missing-evidence acquisition strip", "Missing-evidence acquisition strip"],
  ["Dual-evidence musculoskeletal", "Dual-evidence musculoskeletal"],
  ["dual-evidence perceptive", "dual-evidence perceptive"],
];

const files = walk(root);
let n = 0;
for (const f of files) {
  let s = readFileSync(f, "utf8");
  const orig = s;
  for (const [a, b] of pairs) {
    if (a.startsWith("\\b")) {
      s = s.replace(new RegExp(a, "g"), b);
    } else if (s.includes(a)) {
      s = s.split(a).join(b);
    }
  }
  if (s !== orig) {
    writeFileSync(f, s);
    n += 1;
  }
}
console.log(`Rebranded ${n} files`);
