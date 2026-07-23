/**
 * Scrub leftover wrong-domain copy after Truth Game Desk rebrand.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEXT = new Set([".ts", ".tsx", ".md", ".html", ".mjs", ".css", ".json"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    if (name.startsWith("rebrand-") || name === "fix-leftovers.mjs") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.has(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const reps = [
  [
    "game-theoretic multi-agent truth planning plans",
    "game-theoretic multi-agent truth plans",
  ],
  [
    "Game-theoretic multi-agent truth planning plans",
    "Game-theoretic multi-agent truth plans",
  ],
  [
    "with text + image\n            evidence and a cross-modal rubric",
    "with structured challenge and payoff among agents",
  ],
  [
    "with text + image\n          evidence and a cross-modal rubric",
    "with structured challenge and payoff among agents",
  ],
  [
    "Game-theoretic truth planning stalls when text, images, and real cases\n          run apart. Single-agent plans skip structured challenge; flat majority vote without game structure skips\n          visual evidence; confidence-only filters ignore real consult\n          context.",
    "Hallucination risk climbs when agents answer alone, vote flat, or trust confidence alone. Single-agent plans skip structured challenge; flat majority vote skips payoff scoring; confidence-only filters ignore multi-agent game structure.",
  ],
  [
    "Single-agent plans skip structured challenge; flat majority vote skips payoff scoring;\n          confidence-only filters ignore multi-agent game structure.",
    "Single-agent plans skip structured challenge; flat majority vote skips payoff scoring; confidence-only filters ignore multi-agent game structure.",
  ],
  [
    "hallucination-elimination product\n          product",
    "hallucination-elimination product",
  ],
  [
    "Not a hallucination-elimination product\n          product",
    "Not a hallucination-elimination product",
  ],
  ["under a arena", "under an arena"],
  [
    "structured challenge among agents + real cases → cross-modal rubric",
    "structured challenge + payoff scoring → multi-agent truth",
  ],
  [
    "Consult-desk cool slate — not purple, not cream+terracotta, not broadsheet, not CXD teal twin",
    "Truth-desk ink slate — not purple, not cream+terracotta, not broadsheet, not consult-bench twin",
  ],
  ["single_agent_without_images", "single_agent_unchecked"],
  ["localize_without_payoff_scoring", "majority_vote_without_game"],
  [
    "calibrated_without_challenge_structure",
    "confidence_only_without_game",
  ],
  [
    "Arena / claim-set presets for missingness · calibration · cohort-shift leans.",
    "Arena / claim-set presets for challenge · payoff · multi-agent leans.",
  ],
  [
    "authors' framework / hallucination-elimination branding",
    "authors' framework branding",
  ],
  [
    "Never brand this desk as a hallucination-elimination product.",
    "Never brand this desk as the authors' framework or a hallucination cure.",
  ],
  [
    "text + image · real cases · cross-modal rubric",
    "challenge · payoff · multi-agent game",
  ],
  [
    "text + image + real cases + cross-modal rubric",
    "challenge + payoff + multi-agent game",
  ],
  [
    "chest-xray / radiology / Thailand leftovers",
    "consult-bench / MedRealMM leftovers",
  ],
];

let n = 0;
for (const f of walk(root)) {
  let t = readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of reps) t = t.split(a).join(b);
  if (t !== before) {
    writeFileSync(f, t, "utf8");
    n += 1;
  }
}
console.log(`fixed ${n} files`);
