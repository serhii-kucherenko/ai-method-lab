/**
 * Generate dual-impl golden fixtures for Dialogue Design Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreProductiveOpenMindedDesign,
  scoreEngagementMaximizingBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "open_minded",
  "balanced",
  "topic_first",
  "engagement_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dd-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    openMindedness: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    badgeClarity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    topicBalance: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    engagementPull: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    feedNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    outrageTunnel: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    dialogueBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "engagement_maximizing_baseline"
        : "productive_open_minded_design",
  };
  const expectedProductiveOpen = scoreProductiveOpenMindedDesign({
    ...input,
    profile: "productive_open_minded_design",
  });
  const expectedEngagementMax = scoreEngagementMaximizingBaseline({
    ...input,
    profile: "engagement_maximizing_baseline",
  });
  const row = {
    id,
    input,
    expectedProductiveOpen,
    expectedEngagementMax,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("dd-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DialogueInput, DialogueQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DialogueInput;
  expectedProductiveOpen: DialogueQuality;
  expectedEngagementMax: DialogueQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (dd-001…dd-030)`);
