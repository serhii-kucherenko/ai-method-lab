/**
 * Bulk rebrand AI Governance Desk → AI Governance Desk in the copied tree.
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
  ["ai-governance-desk", "ai-governance-desk"],
  ["AI Governance Desk", "AI Governance Desk"],
  ["https://arxiv.org/abs/2607.14585v1", "https://arxiv.org/abs/2607.14585v1"],
  ["2607.14585", "2607.14585"],
  ["a government AI regulator or EU AI Act product", "a government AI regulator or EU AI Act product"],
  ["a government AI regulator or EU AI Act product", "a government AI regulator or EU AI Act product"],
  ["government AI regulator", "government AI regulator"],
  ["EU AI Act", "EU AI Act"],
  ["statutory AI Act brand", "statutory AI Act brand"],
  [
    "government AI regulation product",
    "government AI regulation product",
  ],
  [
    "Conjoint-style AI governance preferences: safety over innovation, public over private, international over national — versus naive always-innovation / private / national baselines.",
    "Conjoint-style AI governance preferences: safety over innovation, public over private, international over national — versus naive always-innovation / private / national baselines.",
  ],
  [
    "Conjoint governance preference scoring",
    "Conjoint governance preference scoring",
  ],
  ["preference-aligned governance", "preference-aligned governance"],
  ["Preference-aligned governance", "Preference-aligned governance"],
  [
    "tech-first proposals that ignore public preference leans",
    "tech-first proposals that ignore public preference leans",
  ],
  [
    "tech-first proposals without preference alignment",
    "tech-first proposals without preference alignment",
  ],
  ["governance preference jobs", "governance preference jobs"],
  ["Governance preference jobs", "Governance preference jobs"],
  ["Governance preference job", "Governance preference job"],
  ["governance preference job", "governance preference job"],
  ["preference scores", "preference scores"],
  ["safety · public · international leans", "safety · public · international leans"],
  ["preference alignment", "preference alignment"],
  ["conjoint preference alignment", "conjoint preference alignment"],
  ["preference-aligned", "preference-aligned"],
  ["clear preference cells", "clear preference cells"],
  [
    "Score preferences — then compare governance proposals",
    "Score preferences — then compare governance proposals",
  ],
  [
    "Screen clear preference cells, standardize effects, then pool with preference-aligned — method experiment, not a government AI regulation product",
    "Conjoint preference scoring across safety, public, and international axes — method experiment, not a government AI regulation product",
  ],
  ["--agd-", "--agd-"],
  ["agd-", "agd-"],
  ["skip_verify_cheat", "skip_verify_cheat"],
  ["ignore-prefs cheat", "ignore-prefs cheat"],
  ["Ignore-prefs cheat", "Ignore-prefs cheat"],
  [
    "https://osf.io/5rz9p/",
    "https://osf.io/5rz9p/",
  ],
  ["Authors' code (none published; OSF pre-registration):", "Authors' code (none published; OSF pre-registration):"],
  ["Authors' code (none published; OSF pre-registration):", "Authors' code (none published; OSF pre-registration):"],
  ["Authors&apos; code (none published; OSF pre-registration):", "Authors&apos; code (none published; OSF pre-registration):"],
  ["governance domain", "governance domain"],
  ["Conjoint preference", "Conjoint preference"],
  ["conjoint preference", "conjoint preference"],
  ["civic mist", "civic mist"],
  ["civic paper", "civic paper"],
  ["22-ai-governance-desk-lessons", "23-ai-governance-desk-lessons"],
  ["Tech-first", "Tech-first"],
  ["tech-first", "tech-first"],
  ["tech-first extremity", "tech-first extremity"],
  ["Tech-first extremity", "Tech-first extremity"],
  ["Domain / profile", "Domain / profile"],
  ["Risk-perception floor", "Risk-perception floor"],
  ["Risk-perception floor", "Risk-perception floor"],
  ["Preference clarity cells", "Preference clarity cells"],
  ["preference clarity", "preference clarity"],
  ["Preference clarity strip", "Preference clarity strip"],
  ["clear cells", "clear cells"],
  ["excluded unclear", "excluded unclear"],
  ["read_preference_leans", "read_preference_leans"],
  ["weight_by_domain_risk", "weight_by_domain_risk"],
  ["score_aligned_proposal", "score_aligned_proposal"],
  ["ignore_prefs", "ignore_prefs"],
  ["tech_first_baseline", "tech_first_baseline"],
  ["docs/ideas/ai-governance-desk-DESIGN.md", "docs/ideas/ai-governance-desk-DESIGN.md"],
];

let changed = 0;
for (const file of walk(root)) {
  if (file.includes("package-lock")) continue;
  if (file.includes("domain\\synthesis") || file.includes("domain/synthesis"))
    continue;
  if (file.includes("domain\\governance") || file.includes("domain/governance"))
    continue;
  let s = readFileSync(file, "utf8");
  const orig = s;
  for (const [a, b] of pairs) {
    if (s.includes(a)) s = s.split(a).join(b);
  }
  if (s !== orig) {
    writeFileSync(file, s);
    changed += 1;
    console.log(
      "patched",
      file.replace(root + "\\", "").replace(root + "/", ""),
    );
  }
}
console.log(`Done. ${changed} files patched.`);
