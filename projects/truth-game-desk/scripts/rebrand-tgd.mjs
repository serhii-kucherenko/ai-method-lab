/**
 * Rebrand cloned consult-bench-desk → Truth Game Desk.
 * Domain: game-theoretic multi-agent truth plans vs naive baselines.
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  renameSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".md",
  ".html",
  ".css",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (
      name === "node_modules" ||
      name === ".next" ||
      name === "rebrand-tgd.mjs" ||
      name === "rebrand-cbd.mjs" ||
      name === "rebrand-cxd.mjs" ||
      name === "fix-leftovers.mjs"
    )
      continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const pairs = [
  ["Consult Bench Desk", "Truth Game Desk"],
  ["consult-bench-desk", "truth-game-desk"],
  ["consult-bench-scenario", "truth-game-scenario"],
  ["consult-bench dual-impl", "truth-game dual-impl"],
  ["consult-bench domain", "truth-game domain"],
  ["32-consult-bench-desk-lessons", "33-truth-game-desk-lessons"],
  ["multimodal_realworld", "game_theoretic"],
  ["multimodal-realworld", "game-theoretic"],
  ["multimodal real-world", "game-theoretic multi-agent"],
  ["Multimodal real-world", "Game-theoretic multi-agent"],
  [
    "Real-world multimodal consult evaluation",
    "Game-theoretic multi-agent truth planning",
  ],
  [
    "real-world multimodal consult evaluation",
    "game-theoretic multi-agent truth planning",
  ],
  [
    "Text + image — real cases — rubric across modalities",
    "Challenge — payoff — multi-agent truth plans",
  ],
  [
    "Text + image evidence with human-in-loop review and cross-modal rubric awareness",
    "Structured challenge and payoff among agents to dampen hallucination",
  ],
  [
    "text + image evidence, real consult cases, rubric across modalities",
    "structured challenge, payoff scoring, multi-agent game awareness",
  ],
  [
    "Text+image+rubric plan",
    "Challenge+payoff+agents plan",
  ],
  [
    "text+image+rubric plan",
    "challenge+payoff+agents plan",
  ],
  [
    "Text+image+rubric plan strip",
    "Challenge+payoff+agents plan strip",
  ],
  [
    "text + image evidence",
    "structured challenge among agents",
  ],
  [
    "Text + image evidence",
    "Structured challenge among agents",
  ],
  ["cross-modal rubric awareness", "multi-agent game awareness"],
  ["cross-modal-rubric-aware", "multi-agent-game-aware"],
  ["cross_modal", "multi_agent"],
  ["text-only scoring without images", "single-agent unchecked answers"],
  ["text-only scoring", "single-agent unchecked answers"],
  ["Text-only scoring", "Single-agent unchecked answers"],
  ["image-blind scoring", "flat majority vote without game structure"],
  ["Image-blind scoring", "Flat majority vote without game structure"],
  ["synthetic-chat-only benches", "confidence-only filters"],
  ["Synthetic-chat-only benches", "Confidence-only filters"],
  ["synthetic-chat baselines", "confidence-only baselines"],
  ["synthetic-chat", "confidence-only"],
  ["Synthetic-chat", "Confidence-only"],
  ["text_only", "single_agent"],
  ["image_blind", "majority_vote"],
  ["synthetic_chat", "confidence_only"],
  ["text-only", "single-agent"],
  ["Text-only", "Single-agent"],
  ["image-blind", "majority-vote"],
  ["Image-blind", "Majority-vote"],
  ["ConsultAxes", "TruthAxes"],
  ["ConsultInput", "TruthInput"],
  ["ConsultResult", "TruthResult"],
  ["ConsultOk", "TruthOk"],
  ["ConsultReject", "TruthReject"],
  ["ModalityStrip", "ChallengeStrip"],
  ["modality-strip", "challenge-strip"],
  ["scoreConsultB", "scoreTruthB"],
  ["scoreConsult", "scoreTruth"],
  ["ConsultJob", "TruthJob"],
  ["Consult jobs", "Truth jobs"],
  ["consult jobs", "truth jobs"],
  ["Consult job", "Truth job"],
  ["consult job", "truth job"],
  ["bench_score", "truth_score"],
  ["bench_activity", "truth_activity"],
  ["bench cells", "truth cells"],
  ["Bench cells", "Truth cells"],
  ["bench scores", "truth scores"],
  ["bench score", "truth score"],
  ["evaluation plan", "truth plan"],
  ["Evaluation plan", "Truth plan"],
  ["text_image", "challenge_structure"],
  ["real_cases", "payoff_scoring"],
  ["Cohort / modality profile", "Arena / claim-set profile"],
  ["cohort / modality profile", "arena / claim-set profile"],
  ["Cohort / modality", "Arena / claim-set"],
  ["cohort / modality", "arena / claim-set"],
  ["consult cohorts", "truth arenas"],
  ["consult cohort", "truth arena"],
  ["Cohort-A consult", "Arena-A claims"],
  ["Cohort-B consult", "Arena-B claims"],
  ["Cohort-C consult", "Arena-C claims"],
  ["Cohort-D consult", "Arena-D claims"],
  ["Custom cohort", "Custom arena"],
  ["Custom site", "Custom arena"],
  ["cohort profile", "arena profile"],
  ["Cohort profile", "Arena profile"],
  ["across cohorts", "across arenas"],
  ["under a cohort", "under an arena"],
  ["Project / cohort", "Project / arena"],
  ["project / cohort", "project / arena"],
  ["/ cohort /", "/ arena /"],
  ["cohort shift", "arena shift"],
  ["site-shift", "arena-shift"],
  ["site shift", "arena shift"],
  ["imaged vs image-blind", "challenged vs majority-vote"],
  ["Imaged vs image-blind", "Challenged vs majority-vote"],
  ["multimodal vs image-blind", "game-theoretic vs majority-vote"],
  ["Multimodal vs image-blind", "Game-theoretic vs majority-vote"],
  ["image-blind cells", "majority-vote cells"],
  ["Image-blind cells", "Majority-vote cells"],
  ["ungated cells", "majority-vote cells"],
  ["2607.09142v1", "2607.08403v1"],
  ["2607.09142", "2607.08403"],
  ["--cbd-", "--tgd-"],
  ["var(--cbd-", "var(--tgd-"],
  ["cbd-trace", "tgd-trace"],
  ["cbd-nav-active", "tgd-nav-active"],
  ["cbd-wash", "tgd-wash"],
  ["data-cbd", "data-tgd"],
  ["@keyframes cbd-trace", "@keyframes tgd-trace"],
  ["authors' MedRealMM benchmark", "authors' game-theory multi-agent framework"],
  [
    "authors&apos; MedRealMM benchmark",
    "authors&apos; game-theory multi-agent framework",
  ],
  ["MedRealMM", "authors' framework"],
  ["Never claim telemedicine product", "Never claim hallucination-elimination product"],
  ["or MedRealMM / telemedicine branding", "or G-Frame / authors' framework branding"],
  ["telemedicine consult service", "hallucination-elimination product"],
  ["telemedicine product", "hallucination-elimination product"],
  ["telemedicine vendors", "hallucination-elimination vendors"],
  ["telemedicine", "hallucination-elimination"],
  [
    "secure-tutor / joint-care / chest-xray / evidence-synthesis",
    "agent-safety / enterprise-agent / consult-bench / secure-tutor",
  ],
  [
    "secure-tutor, joint-care, chest-xray, or evidence-synthesis",
    "agent-safety, enterprise-agent, consult-bench, or secure-tutor",
  ],
  [
    "dual-approver / secure-tutor / joint-care / chest-xray / evidence-synthesis rebrand",
    "dual-approver / agent-safety / enterprise-agent / consult-bench / secure-tutor rebrand",
  ],
  ["Cool consult-desk slate-blue", "Cool truth-desk ink-slate"],
  ["consult-desk slate", "truth-desk ink-slate"],
  ["not a clinical\n          diagnostic", "not a production hallucination cure"],
  ["Clinic A multi-site", "Arena alpha multi-claim"],
  ["Clinic B impute-lean", "Arena beta majority-lean"],
  ["How extreme text-only answers lean", "How extreme single-agent answers lean"],
  ["How extreme single-agent answers lean", "How extreme single-agent answers lean"],
  ["text-only extremity", "single-agent extremity"],
  ["Text-only extremity", "Single-agent extremity"],
  ["text-only answers", "single-agent answers"],
  ["Skip images", "Skip structured challenge"],
  ["skip images", "skip structured challenge"],
  ["Skip visual evidence", "Skip payoff scoring"],
  ["skip visual evidence", "skip payoff scoring"],
  ["Ignore real consult context", "Ignore multi-agent game structure"],
  ["ignore real consult context", "ignore multi-agent game structure"],
  ["real consult cases", "payoff scoring"],
  ["Real consult cases", "Payoff scoring"],
  ["rubric across modalities", "multi-agent game awareness"],
  ["Score text and images", "Structure agent challenges"],
  ["real cases and rubrics", "payoffs and multi-agent plans"],
  ["acquired vs image-blind cells", "challenged vs majority-vote cells"],
  ["and rubrics across consult cohorts", "and payoffs across truth arenas"],
  ["human-in-loop review, cross-modal rubric awareness", "structured challenge, payoff scoring"],
  ["Multimodal consult evaluation", "Game-theoretic truth planning"],
  ["multimodal consult evaluation", "game-theoretic truth planning"],
  ["Consult case", "Truth claim set"],
  ["consult case", "truth claim set"],
];

const files = walk(root);
let changed = 0;
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  let text = readFileSync(file, "utf8");
  const before = text;
  for (const [a, b] of pairs) {
    if (text.includes(a)) text = text.split(a).join(b);
  }
  if (text !== before) {
    writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const oldStrip = join(root, "src", "components", "modality-strip.tsx");
const newStrip = join(root, "src", "components", "challenge-strip.tsx");
if (existsSync(oldStrip) && !existsSync(newStrip)) {
  renameSync(oldStrip, newStrip);
}

for (const name of [
  "rebrand-cbd.mjs",
  "rebrand-cxd.mjs",
  "rebrand-hsd.mjs",
  "rebrand-mrd.mjs",
  "fix-leftovers.mjs",
  "fix-paper-id.mjs",
]) {
  const p = join(root, "scripts", name);
  if (existsSync(p)) unlinkSync(p);
}

console.log(`rebranded ${changed} files`);
