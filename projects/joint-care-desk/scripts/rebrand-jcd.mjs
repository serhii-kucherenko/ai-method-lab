/**
 * Bulk rebrand Wild Locomotion Desk → Joint Care Desk (copy + strings).
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
    if (
      name === "synthesis.ts" ||
      name === "synthesisB.ts" ||
      name === "claim.ts" ||
      name === "rebrand-jcd.mjs"
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
  ["wild-locomotion-desk", "joint-care-desk"],
  ["Wild Locomotion Desk", "Joint Care Desk"],
  ["https://arxiv.org/abs/2607.13579v1", "https://arxiv.org/abs/2607.12527v2"],
  ["2607.13579", "2607.12527"],
  ["APT-RL", "OrthoPilot"],
  ["authors' quadruped controller", "authors' OrthoPilot system"],
  ["quadruped controller", "OrthoPilot clinical agent"],
  ["robot hardware", "clinical EHR systems"],
  ["robot stacks", "clinical AI vendors"],
  ["--wld-", "--jcd-"],
  ["var(--wld-", "var(--jcd-"],
  ["wld-wash", "jcd-wash"],
  ["wld-arrow", "jcd-arrow"],
  ["wld-nav-active", "jcd-nav-active"],
  ["wld-reveal", "jcd-reveal"],
  ["locomotion jobs", "pathway jobs"],
  ["Locomotion jobs", "Pathway jobs"],
  ["Locomotion job", "Pathway job"],
  ["locomotion job", "pathway job"],
  ["multi-skill plan", "dual-evidence plan"],
  ["Multi-skill plan", "Dual-evidence plan"],
  ["multi-skill", "dual-evidence"],
  ["locomotion scores", "pathway scores"],
  ["skill · perception · transitions", "hospital · external · stage"],
  ["skill transition", "stage transition"],
  ["cleared obstacles", "acquired evidence"],
  ["Switch skills — clear mixed obstacles", "Ground both worlds — stage the pathway"],
  ["Terrain / route", "Indication / pathway"],
  ["Perception clarity floor", "Evidence completeness floor"],
  ["Naive flat extremity", "Naive parametric extremity"],
  ["Flat-only / skip-transitions cheat", "Hospital-only / stage-blind cheat"],
  ["flat-terrain", "stage-blind"],
  ["ignore perception", "ignore external knowledge"],
  ["stuck skill", "hospital-only plan"],
  ["perception-blind", "external-blind"],
  ["onboard perception", "external knowledge"],
  ["skill library", "hospital evidence"],
  ["autonomous transitions", "stage-aware transitions"],
  ["terrain profile", "care pathway profile"],
  ["terrain / route", "indication / pathway"],
  ["Project / terrain / route profile catalog", "Project / indication / pathway profile catalog"],
  ["Obstacle clearance strip", "Missing-evidence acquisition strip"],
  ["obstacle clearance", "missing-evidence acquisition"],
  ["Obstacle segments", "Evidence cells"],
  ["obstacle segments", "evidence cells"],
  ["blocked", "missing"],
  ["cleared", "acquired"],
  ["single-skill flat", "parametric-memory-only"],
  ["single-skill", "parametric-memory"],
  ["naive flat", "naive parametric"],
  ["Naive flat", "Naive parametric"],
  ["flat policy", "parametric policy"],
  ["no-transition", "stage-blind"],
  ["no autonomous transitions", "stage-blind plans"],
  ["mixed obstacles", "fragmented evidence"],
  ["stairs, hurdles, gaps, and stones", "admission through rehab"],
  ["stairs, gaps, and hurdles", "admission, peri-op, discharge, and rehab"],
  ["stairs, hurdles, gaps, stones", "tka, tha, acl, spine"],
  ["Trail pine", "Clinic slate"],
  ["trail pine", "clinic slate"],
  ["pine mist", "slate mist"],
  ["RouteField", "PathwayStrip"],
  ["route-field", "pathway-strip"],
  ["Route field", "Pathway strip"],
  ["scd-trace", "jcd-trace"],
  ["perceive", "hospital"],
  ["skill transition", "external knowledge"],
  // leftover locomotion phrases in tests/docs
  ["Wild locomotion", "Joint care"],
  ["wild locomotion", "joint care"],
  ["Locomotion Desk", "Joint Care Desk"],
  ["locomotion desk", "joint care desk"],
  ["perceptive locomotion", "dual-evidence pathway"],
  ["Multi-skill perceptive", "Dual-evidence musculoskeletal"],
  ["multi-skill perceptive", "dual-evidence musculoskeletal"],
];

let n = 0;
for (const file of walk(root)) {
  let text = readFileSync(file, "utf8");
  const orig = text;
  for (const [a, b] of pairs) {
    if (a === b) continue;
    if (a.startsWith("\\b")) {
      text = text.replace(new RegExp(a, "g"), b);
    } else {
      text = text.split(a).join(b);
    }
  }
  if (text !== orig) {
    writeFileSync(file, text);
    n += 1;
    console.log("patched", file.replace(root + "\\", "").replace(root + "/", ""));
  }
}
console.log(`Rebranded ${n} files`);
