import { writeFileSync, mkdirSync } from "node:fs";
import { scoreMultiStep, scoreSingleShot } from "../src/domain/graphQuality.ts";
import {
  scoreMultiStep as scoreMultiStepB,
  scoreSingleShot as scoreSingleShotB,
} from "../src/domain/graphQualityB.ts";

mkdirSync("test/fixtures", { recursive: true });
const seeds = [];

for (let i = 1; i <= 30; i++) {
  const docs = 5 + (i % 12) * 3;
  const rawMentions = 20 + i * 7;
  const duplicateRate = Math.round(((i % 9) / 10) * 100) / 100;
  const uniqueEntities = Math.max(
    4,
    Math.round(rawMentions * (1 - duplicateRate * 0.85)),
  );
  const weakEdges = 2 + (i % 8) * 2;
  const strongEdges = 5 + (i % 10) * 3;
  const hopDepthUseful = 1 + (i % 4);
  const queryCoverage = Math.round((0.35 + (i % 7) * 0.08) * 100) / 100;
  const profile = i % 2 === 0 ? "heavy" : "compact";
  const input = {
    docs,
    rawMentions,
    uniqueEntities,
    duplicateRate,
    weakEdges,
    strongEdges,
    hopDepthUseful,
    queryCoverage,
    profile,
  };
  const a = scoreMultiStep(input);
  const a2 = scoreMultiStepB(input);
  const b = scoreSingleShot(input);
  const b2 = scoreSingleShotB(input);
  if (JSON.stringify(a) !== JSON.stringify(a2)) {
    throw new Error(`A mismatch ${i}`);
  }
  if (JSON.stringify(b) !== JSON.stringify(b2)) {
    throw new Error(`B mismatch ${i}`);
  }
  const id = `std-${String(i).padStart(3, "0")}`;
  const fixture = {
    id,
    input,
    expectedMultiStep: a,
    expectedSingleShot: b,
  };
  writeFileSync(
    `test/fixtures/${id}.json`,
    JSON.stringify(fixture, null, 2) + "\n",
  );
  seeds.push(fixture);
}

const body = `import type { GraphInput, GraphQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GraphInput;
  expectedMultiStep: GraphQuality;
  expectedSingleShot: GraphQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(seeds, null, 2)} as Golden[];
`;

writeFileSync("src/goldens.ts", body);
console.log("wrote", seeds.length, "goldens");
