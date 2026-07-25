/**
 * Generate dual-impl golden fixtures for Governed Research Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreGoverned, scoreUngated } from "../src/domain/governed.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "gate_first",
  "balanced",
  "workflow_first",
  "agent_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `grs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    gateCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    workflowIntegrity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    evidenceProvenance: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    privacyControl: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    ungatedPassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    agentOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    studyHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    researchBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "ungated" : "governed",
  };
  const expectedGoverned = scoreGoverned({
    ...input,
    profile: "governed",
  });
  const expectedUngated = scoreUngated({
    ...input,
    profile: "ungated",
  });
  const row = {
    id,
    input,
    expectedGoverned,
    expectedUngated,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("grs-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ResearchInput, ResearchQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ResearchInput;
  expectedGoverned: ResearchQuality;
  expectedUngated: ResearchQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
