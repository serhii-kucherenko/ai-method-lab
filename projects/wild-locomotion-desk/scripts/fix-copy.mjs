import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const exts = new Set([".ts", ".tsx", ".html", ".md", ".mjs", ".css"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

function fix(s) {
  return s
    .split("2607\\.14568").join("2607\\.13579")
    .split("2607.13579").join("2607.13579")
    .split("authors'").join("authors'")
    .split("authors&apos;").join("authors&apos;")
    .split("25-wild-locomotion-desk-lessons").join("25-wild-locomotion-desk-lessons")
    .split("score_multi_skill_plan").join("score_multi_skill_plan")
    .split("read_perception_floor").join("read_perception_floor")
    .split("weight_by_perception_floor").join("weight_by_perception_floor")
    .split("stuck-skill").join("stuck-skill")
    .split("stuck skill").join("stuck skill")
    .split("commercial robot stacks").join("commercial robot stacks");
}

let n = 0;
for (const f of walk(root)) {
  const orig = readFileSync(f, "utf8");
  const next = fix(orig);
  if (next !== orig) {
    writeFileSync(f, next);
    n += 1;
    console.log(f);
  }
}
console.log(`fixed ${n}`);
