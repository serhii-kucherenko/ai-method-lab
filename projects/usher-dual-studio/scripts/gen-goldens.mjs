/**
 * Generate dual-impl golden fixtures for Usher Dual Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMyo7aGeneSupplement,
  scoreMyo7bActivation,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "myo7a_first",
  "balanced",
  "assay_first",
  "myo7b_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ud-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  // High allele gap early → clear disagreement; MYO7A rescue rises later
  const input = {
    myo7aRescue: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    myo7bActivation: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    alleleGap: round2(0.75 - t * 0.55 + ((i % 3) - 1) * 0.02),
    vectorDelivery: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    pathwayFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "myo7b_activation" : "myo7a_gene_supplement",
  };
  const expectedMyo7a = scoreMyo7aGeneSupplement({
    ...input,
    profile: "myo7a_gene_supplement",
  });
  const expectedMyo7b = scoreMyo7bActivation({
    ...input,
    profile: "myo7b_activation",
  });
  const row = {
    id,
    input,
    expectedMyo7a,
    expectedMyo7b,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ud-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { UsherDualInput, UsherDualQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: UsherDualInput;
  expectedMyo7a: UsherDualQuality;
  expectedMyo7b: UsherDualQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
