/**
 * Bulk rebrand Wild Locomotion Desk → Wild Locomotion Desk.
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
  ["wild-locomotion-desk", "wild-locomotion-desk"],
  ["Wild Locomotion Desk", "Wild Locomotion Desk"],
  ["https://arxiv.org/abs/2607.13579v1", "https://arxiv.org/abs/2607.13579v1"],
  ["2607.13579", "2607.13579"],
  ["APT-RL", "APT-RL"],
  ["APT-RL", "APT-RL"],
  ["APT-RL brand", "APT-RL brand"],
  ["APT-RL", "APT-RL"],
  ["authors' quadruped controller", "authors' quadruped controller"],
  ["quadruped controller", "quadruped controller"],
  ["\\bFermi\\b", "APT-RL"],
  ["APT-RL", "APT-RL"],
  ["--wld-", "--wld-"],
  ["var(--wld-", "var(--wld-"],
  ["wld-wash", "wld-wash"],
  ["wld-arrow", "wld-arrow"],
  ["wld-nav-active", "wld-nav-active"],
  ["wld-reveal", "wld-reveal"],
  ["locomotion jobs", "locomotion jobs"],
  ["Locomotion jobs", "Locomotion jobs"],
  ["Locomotion job", "Locomotion job"],
  ["locomotion job", "locomotion job"],
  ["multi-skill plan", "multi-skill plan"],
  ["Multi-skill plan", "Multi-skill plan"],
  ["multi-skill", "multi-skill"],
  ["locomotion scores", "locomotion scores"],
  ["skill · perception · transitions", "skill · perception · transitions"],
  ["skill transition", "skill transition"],
  ["cleared obstacles", "cleared obstacles"],
  ["Switch skills — clear mixed obstacles", "Switch skills — clear mixed obstacles"],
  ["Terrain / route", "Terrain / route"],
  ["Perception clarity floor", "Perception clarity floor"],
  ["Naive flat extremity", "Naive flat extremity"],
  ["Flat-only / skip-transitions cheat", "Flat-only / skip-transitions cheat"],
  ["flat-terrain", "flat-terrain"],
  ["ignore perception", "ignore perception"],
  ["stuck skill", "stuck skill"],
  ["perception-blind", "perception-blind"],
  ["onboard perception", "onboard perception"],
  ["skill library", "skill library"],
  ["autonomous transitions", "autonomous transitions"],
  ["stairs", "stairs"],
  ["hurdles", "hurdles"],
  ["gaps", "gaps"],
  ["terrain profile", "terrain profile"],
  ["terrain / route", "terrain / route"],
  ["Project / port / terrain profile catalog", "Project / terrain / route profile catalog"],
  ["naive flat policy", "naive flat policy"],
  ["Naive flat policy", "Naive flat policy"],
  ["skill transitions", "skill transitions"],
  ["Skill transitions", "Skill transitions"],
  ["multi-skill + measurements", "multi-skill + perception"],
  ["Obstacle clearance strip", "Obstacle clearance strip"],
  ["Multi-skill perceptive", "Multi-skill perceptive"],
  ["multi-skill perceptive", "multi-skill perceptive"],
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
