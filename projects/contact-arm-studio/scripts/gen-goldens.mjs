/**
 * Generate dual-impl golden fixtures for Contact Arm Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreContactCentric,
  scoreVisionOnlyBaseline,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "contact_strict",
  "balanced",
  "tactile_first",
  "vision_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cas-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    contactCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    tactileSalience: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    planFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    sensingAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    visionOnlyAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    visionOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    contactPressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    contactBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "vision_only" : "contact_centric",
  };
  const expectedContactCentric = scoreContactCentric({
    ...input,
    profile: "contact_centric",
  });
  const expectedVisionOnly = scoreVisionOnlyBaseline({
    ...input,
    profile: "vision_only",
  });
  const row = {
    id,
    input,
    expectedContactCentric,
    expectedVisionOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cas-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ContactArmInput, ContactArmQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ContactArmInput;
  expectedContactCentric: ContactArmQuality;
  expectedVisionOnly: ContactArmQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
