/**
 * Generate dual-impl golden fixtures for Disaster Liaison Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreGenericDisasterHq,
  scorePediatricPerinatalLiaison,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "pediatric_first",
  "balanced",
  "handoff_first",
  "hq_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dl-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    pediatricLoad: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    perinatalRisk: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    liaisonCoverage: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    handoffLatency: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    hqCoordination: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    surgePressure: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    liaisonBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "generic_disaster_hq" : "pediatric_perinatal_liaison",
  };
  const expectedPediatric = scorePediatricPerinatalLiaison({
    ...input,
    profile: "pediatric_perinatal_liaison",
  });
  const expectedGenericHq = scoreGenericDisasterHq({
    ...input,
    profile: "generic_disaster_hq",
  });
  const row = {
    id,
    input,
    expectedPediatric,
    expectedGenericHq,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("dl-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { LiaisonInput, LiaisonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LiaisonInput;
  expectedPediatric: LiaisonQuality;
  expectedGenericHq: LiaisonQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
