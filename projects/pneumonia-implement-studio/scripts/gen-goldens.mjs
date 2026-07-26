/**
 * Generate dual-impl golden fixtures for Pneumonia Implement Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCfirCodesignPrimaryCare,
  scoreStatusQuoPathway,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "codesign_first",
  "balanced",
  "fidelity_first",
  "status_quo_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pi-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    codesignIntensity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    communityEngagement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    caretakerDelay: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    referralFriction: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    pathwayClarity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    districtCoverage: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    fidelitySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    implementationBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "status_quo_pathway" : "cfir_codesign_primary_care",
  };
  const expectedCfir = scoreCfirCodesignPrimaryCare({
    ...input,
    profile: "cfir_codesign_primary_care",
  });
  const expectedStatusQuo = scoreStatusQuoPathway({
    ...input,
    profile: "status_quo_pathway",
  });
  const row = {
    id,
    input,
    expectedCfir,
    expectedStatusQuo,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pi-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ImplementInput, ImplementQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ImplementInput;
  expectedCfir: ImplementQuality;
  expectedStatusQuo: ImplementQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
