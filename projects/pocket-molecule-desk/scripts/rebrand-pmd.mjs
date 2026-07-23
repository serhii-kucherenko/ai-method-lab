/**
 * Bulk rebrand Joint Care Desk → Pocket Molecule Desk (copy + strings).
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  renameSync,
  existsSync,
} from "node:fs";
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
    if (
      name === "rebrand-pmd.mjs" ||
      name === "rebrand-jcd.mjs" ||
      name === "rebrand.mjs"
    )
      continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

const pairs = [
  ["joint-care-desk", "pocket-molecule-desk"],
  ["Joint Care Desk", "Pocket Molecule Desk"],
  ["https://arxiv.org/abs/2607.12527v2", "https://arxiv.org/abs/2607.12349v1"],
  ["2607.12527", "2607.12349"],
  ["OrthoPilot", "ConDitar"],
  ["CHEESE", "msPRL"],
  ["OrthoBench", "paOPT"],
  ["ORACLE", "CDH"],
  ["authors' OrthoPilot system", "authors' ConDitar pipeline"],
  ["OrthoPilot clinical agent", "ConDitar molecule generator"],
  ["docking engine systems", "commercial SBDD tools"],
  ["clinical AI vendors", "structure-based drug design vendors"],
  ["--jcd-", "--pmd-"],
  ["var(--jcd-", "var(--pmd-"],
  ["jcd-wash", "pmd-wash"],
  ["jcd-arrow", "pmd-arrow"],
  ["jcd-nav-active", "pmd-nav-active"],
  ["jcd-reveal", "pmd-reveal"],
  ["pathway jobs", "molecule jobs"],
  ["Pathway jobs", "Molecule jobs"],
  ["Pathway job", "Molecule job"],
  ["pathway job", "molecule job"],
  ["PathwayJob", "MoleculeJob"],
  ["pathwayJobs", "moleculeJobs"],
  ["dual-evidence plan", "pocket-property plan"],
  ["Dual-evidence plan", "Pocket-property plan"],
  ["dual-evidence", "pocket-property"],
  ["Dual-evidence", "Pocket-property"],
  ["dual_evidence", "pocket_property"],
  ["pathway scores", "molecule scores"],
  ["hospital · external · stage", "pocket · affinity · developability"],
  ["hospital · external · stage-aware", "pocket · affinity · developability"],
  ["stage transition", "property gate"],
  ["acquired evidence", "pocket fit cells"],
  ["Ground both worlds — stage the pathway", "Condition the pocket — steer developability"],
  ["Indication / pathway", "Pocket / target"],
  ["Evidence completeness floor", "Pocket fit floor"],
  ["Naive parametric extremity", "Unconditioned extremity"],
  ["Hospital-only / stage-blind cheat", "Affinity-only / property-blind cheat"],
  ["stage-blind", "property-blind"],
  ["ignore external knowledge", "ignore developability"],
  ["hospital-only plan", "affinity-only plan"],
  ["external-blind", "developability-blind"],
  ["external knowledge", "developability"],
  ["hospital evidence", "pocket conditioning"],
  ["stage-aware transitions", "property-aware steering"],
  ["care pathway profile", "pocket target profile"],
  ["indication / pathway", "pocket / target"],
  ["Project / indication / pathway profile catalog", "Project / pocket / target profile catalog"],
  ["Missing-evidence acquisition strip", "Pocket-fit cell strip"],
  ["missing-evidence acquisition strip", "pocket-fit cell strip"],
  ["pathway-strip", "pocket-strip"],
  ["PathwayStrip", "PocketStrip"],
  ["pathway strip", "pocket strip"],
  ["naive parametric", "unconditioned"],
  ["Naive parametric", "Unconditioned"],
  ["naive_parametric", "unconditioned"],
  ["hospital_only", "affinity_only"],
  ["hospital-only", "affinity-only"],
  ["Hospital-only", "Affinity-only"],
  ["external_only", "property_blind"],
  ["external-only", "property-blind"],
  ["External-only", "Property-blind"],
  ["parametric-memory-only", "ligand-only resemblance"],
  ["parametric memory", "ligand-only resemblance"],
  ["musculoskeletal pathway", "pocket molecule design"],
  ["Musculoskeletal pathway", "Pocket molecule design"],
  ["in-hospital evidence", "multi-scale pocket conditioning"],
  ["In-hospital evidence", "Multi-scale pocket conditioning"],
  ["stage-aware care", "ADMET/developability steering"],
  ["admission → peri-op → discharge → rehab", "pocket fit → affinity → developability"],
  ["admission through rehab", "pocket fit through developability"],
  ["clinic slate", "lab slate"],
  ["Clinic slate", "Lab slate"],
  ["clinical care", "wet-lab chemistry"],
  ["EHR access", "docking engine access"],
  ["evidence cells", "pocket cells"],
  ["Evidence cells", "Pocket cells"],
  ["evidence floor", "pocket fit floor"],
  ["Evidence floor", "Pocket fit floor"],
  ["evidence completeness", "pocket fit completeness"],
  ["hospital_evidence", "pocket_conditioning"],
  ["external_knowledge", "binding_affinity"],
  ["stage_awareness", "developability"],
  ["hospital_evidence_lean", "pocket_conditioning_lean"],
  ["external_knowledge_lean", "binding_affinity_lean"],
  ["stage_awareness_lean", "developability_lean"],
  ["hospital_only_cheat", "affinity_only_cheat"],
  ["external_only_cheat", "property_blind_cheat"],
  ["stage_blind_cheat", "property_blind_cheat"],
  ["parametric_cheat", "unconditioned_cheat"],
  ["CareAxes", "MoleculeAxes"],
  ["CareInput", "MoleculeInput"],
  ["CareResult", "MoleculeResult"],
  ["CareOk", "MoleculeOk"],
  ["CareReject", "MoleculeReject"],
  ["risk_perception", "risk_developability"],
];

const files = walk(root);
let changed = 0;
for (const file of files) {
  let text = readFileSync(file, "utf8");
  const orig = text;
  for (const [a, b] of pairs) {
    if (text.includes(a)) text = text.split(a).join(b);
  }
  if (text !== orig) {
    writeFileSync(file, text, "utf8");
    changed++;
  }
}

const stripOld = join(root, "src", "components", "pathway-strip.tsx");
const stripNew = join(root, "src", "components", "pocket-strip.tsx");
if (existsSync(stripOld)) renameSync(stripOld, stripNew);

// Drop leftover rebrand scripts from prior desk
for (const dead of ["rebrand-jcd.mjs", "rebrand.mjs", "fix-copy.mjs", "fix-leftovers.mjs", "fix-public.mjs", "fix-refs.mjs", "fix-tests.mjs", "patch-copy.mjs"]) {
  try {
    unlinkSync(join(root, "scripts", dead));
  } catch {
    /* ok */
  }
}

console.log(`rebrand-pmd: updated ${changed} files`);
