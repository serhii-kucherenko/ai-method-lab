import fs from "fs";
import path from "path";

const root = process.cwd();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const renames = [
  ["src/app/policies", "src/app/policies"],
  ["src/app/cascades", "src/app/cascades"],
  ["src/app/handoffs", "src/app/handoffs"],
  ["src/app/costs", "src/app/costs"],
  ["src/app/escalations", "src/app/escalations"],
];
for (const [a, b] of renames) {
  if (fs.existsSync(a) && !fs.existsSync(b)) fs.renameSync(a, b);
}

const pairs = [
  ["Selective Trust Studio", "Selective Trust Studio"],
  ["selective-trust-studio", "selective-trust-studio"],
  ["Escalate when unsure.", "Escalate when unsure."],
  ["Cascade workspace", "Cascade workspace"],
  ["Open policies", "Open policies"],
  ['href="/policies"', 'href="/policies"'],
  ["scoreSelective", "scoreSelective"],
  ["scoreAlwaysStrong", "scoreAlwaysStrong"],
  ["#f59e0b", "#f59e0b"],
  ["amber-400", "amber-400"],
  ["Sora", "Sora"],
  ["Manrope", "Manrope"],
];

// route name replacements — careful order
const routePairs = [
  ["costs", "costs"],
  ["policies", "policies"],
  ["cascades", "cascades"],
  ["handoffs", "handoffs"],
  ["escalations", "escalations"],
];

for (const f of walk(root)) {
  if (!/\.(ts|tsx|json|md|html|css|mjs)$/.test(f)) continue;
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of pairs) t = t.split(a).join(b);
  for (const [a, b] of routePairs) {
    t = t.split(`/${a}`).join(`/${b}`);
    t = t.split(`"${a}"`).join(`"${b}"`);
    t = t.split(`'${a}'`).join(`'${b}'`);
    t = t.split(`\`${a}\``).join(`\`${b}\``);
  }
  // scoring labels
  t = t.split("Selective").join("Selective");
  t = t.split("selective").join("selective");
  t = t.split("alwaysStrong").join("alwaysStrong");
  t = t.split("AlwaysStrong").join("AlwaysStrong");
  if (t !== before) fs.writeFileSync(f, t);
}

console.log("ok");
