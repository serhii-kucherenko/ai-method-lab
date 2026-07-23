/**
 * Bulk rebrand Tactile Data Desk → Tactile Data Desk in the copied tree.
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
    if (name === "node_modules" || name === ".next" || name === "fixtures") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

const pairs = [
  ["tactile-data-desk", "tactile-data-desk"],
  ["Tactile Data Desk", "Tactile Data Desk"],
  ["https://arxiv.org/abs/2607.14588v1", "https://arxiv.org/abs/2607.14588v1"],
  ["2607.14588", "2607.14588"],
  ["Feelogue", "Feelogue"],
  ["commercial tactile accessibility product", "commercial tactile accessibility product"],
  ["Touch-first chart sensemaking with agent for calculation, then verify on the tactile chart — versus speech-only answers that skip tactile grounding.", "Touch-first chart sensemaking with agent for calculation, then verify on the tactile chart — versus speech-only answers that skip tactile grounding."],
  ["Touch-first chart sensemaking", "Touch-first chart sensemaking"],
  ["grounded select-confirm-verify", "grounded select-confirm-verify"],
  ["Grounded select-confirm-verify", "Grounded select-confirm-verify"],
  ["speech-only answers that skip tactile grounding", "speech-only answers that skip tactile grounding"],
  ["speech-only answers that skip tactile grounding", "speech-only answers that skip tactile grounding"],
  ["speech-only answers without tactile grounding", "speech-only answers without tactile grounding"],
  ["tactile explore jobs", "tactile explore jobs"],
  ["Tactile explore jobs", "Tactile explore jobs"],
  ["Tactile explore job", "Tactile explore job"],
  ["tactile explore job", "tactile explore job"],
  ["grounding scores", "grounding scores"],
  ["select → confirm → ask → verify", "select → confirm → ask → verify"],
  ["chart verify", "chart verify"],
  ["tactile grounding and verify", "tactile grounding and verify"],
  ["grounded verify", "grounded verify"],
  ["confirmable selection", "confirmable selection"],
  ["Select, confirm, ask — then verify on the chart", "Select, confirm, ask — then verify on the chart"],
  ["Screen confirmable selection, standardize effects, then pool with grounded verify — method experiment, not a commercial tactile accessibility product", "Touch-first layers, confirm selection, ask the agent, verify on the chart — method experiment, not a commercial tactile accessibility product"],
  ["Averaging reported numbers without confirmable selection lets underpowered or\n          off-protocol studies drag the pooled answer. Teams need a desk that\n          screens, standardizes, and pools with heterogeneity visible — not a\n          single glowing mean.", "Speech-only chart answers invent numbers without a tactile select and confirm.\n          Teams need a desk that grounds on soft layers, reserves the agent for\n          calculation, then verifies on the chart — not a floating voice reply."],
  ["--tdd-", "--tdd-"],
  ["tdd-", "tdd-"],
  ["skip_verify_cheat", "skip_verify_cheat"],
  ["skip-verify cheat", "skip-verify cheat"],
  ["Dot Pad", "Dot Pad"],
  ["sales", "sales"],
  ["weather", "weather"],
  ["inventory", "inventory"],
  ["survey", "survey"],
  ["skip_tactile", "skip_tactile"],
  ["speech_invent_answer", "speech_invent_answer"],
  ["screen_confirmable selection", "select_layer"],
  ["confirm_selection", "confirm_selection"],
  ["ask_and_verify", "ask_and_verify"],
  ["authors' code: https://github.com/accessible-data-vis/feelogue", "authors' code: https://github.com/accessible-data-vis/feelogue"],
  ["Authors' code: https://github.com/accessible-data-vis/feelogue", "Authors' code: https://github.com/accessible-data-vis/feelogue"],
  ["https://github.com/accessible-data-vis/feelogue", "https://github.com/accessible-data-vis/feelogue"],
  ["chart topic", "chart topic"],
  ["Soft-layer chart", "Soft-layer chart"],
  ["soft-layer chart", "soft-layer chart"],
  ["tactile mist", "tactile mist"],
  ["slate paper", "slate paper"],
];

let changed = 0;
for (const file of walk(root)) {
  if (file.includes("package-lock")) continue;
  let s = readFileSync(file, "utf8");
  const orig = s;
  for (const [a, b] of pairs) {
    if (s.includes(a)) s = s.split(a).join(b);
  }
  if (s !== orig) {
    writeFileSync(file, s);
    changed += 1;
    console.log("patched", file.replace(root + "\\", "").replace(root + "/", ""));
  }
}
console.log(`Done. ${changed} files patched.`);
