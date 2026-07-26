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
  ["src/app/budgets", "src/app/budgets"],
  ["src/app/plans", "src/app/plans"],
  ["src/app/overruns", "src/app/overruns"],
  ["src/app/caps", "src/app/caps"],
  ["src/app/forecasts", "src/app/forecasts"],
];
for (const [a, b] of renames) {
  if (fs.existsSync(a) && !fs.existsSync(b)) fs.renameSync(a, b);
}

const pairs = [
  ["Eval Budget Studio", "Eval Budget Studio"],
  ["eval-budget-studio", "eval-budget-studio"],
  ["Forecast the bill before you burn it.", "Forecast the bill before you burn it."],
  ["FinOps workspace", "FinOps workspace"],
  ["Open budgets", "Open budgets"],
  ['href="/budgets"', 'href="/budgets"'],
  ["scoreBudgetAware", "scoreBudgetAware"],
  ["scoreAlwaysMax", "scoreAlwaysMax"],
  ["budgetAware", "budgetAware"],
  ["BudgetAware", "BudgetAware"],
  ["alwaysMax", "alwaysMax"],
  ["AlwaysMax", "AlwaysMax"],
  ["always-max", "always-max"],
  ["emerald-400", "emerald-400"],
  ["#34d399", "#34d399"],
];

const routePairs = [
  ["budgets", "budgets"],
  ["plans", "plans"],
  ["overruns", "overruns"],
  ["caps", "caps"],
  ["forecasts", "forecasts"],
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
  }
  if (t !== before) fs.writeFileSync(f, t);
}
console.log("rebranded");
