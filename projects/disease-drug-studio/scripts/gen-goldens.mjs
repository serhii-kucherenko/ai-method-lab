import { mkdirSync, writeFileSync } from "node:fs";
import {
  scoreDiseaseAware,
  scoreDiseaseBlind,
} from "../src/domain/diseaseAware.ts";
import {
  scoreDiseaseAware as scoreDiseaseAwareB,
  scoreDiseaseBlind as scoreDiseaseBlindB,
} from "../src/domain/diseaseAwareB.ts";

mkdirSync("test/fixtures", { recursive: true });
const seeds = [];

for (let i = 1; i <= 30; i++) {
  const meshDepth = 1 + (i % 5);
  const targetLength = 120 + i * 18;
  const conditioningStrength = Math.round(((i % 10) / 10) * 100) / 100;
  const seedDiversity = Math.round((0.25 + (i % 8) * 0.08) * 100) / 100;
  const batchSize = 40 + (i % 12) * 20;
  const noveltyPrior = Math.round((0.3 + (i % 7) * 0.08) * 100) / 100;
  const affinityPrior = Math.round((5 + (i % 8) * 0.7) * 100) / 100;
  const approvedSimilarityPrior =
    Math.round((0.2 + (i % 9) * 0.07) * 100) / 100;
  const profile = i % 2 === 0 ? "grpo" : "sft";
  const input = {
    meshDepth,
    targetLength,
    conditioningStrength,
    seedDiversity,
    batchSize,
    noveltyPrior,
    affinityPrior,
    approvedSimilarityPrior,
    profile,
  };
  const a = scoreDiseaseAware(input);
  const a2 = scoreDiseaseAwareB(input);
  const b = scoreDiseaseBlind(input);
  const b2 = scoreDiseaseBlindB(input);
  if (JSON.stringify(a) !== JSON.stringify(a2)) {
    throw new Error(`A mismatch ${i}: ${JSON.stringify(a)} vs ${JSON.stringify(a2)}`);
  }
  if (JSON.stringify(b) !== JSON.stringify(b2)) {
    throw new Error(`B mismatch ${i}`);
  }
  const id = `std-${String(i).padStart(3, "0")}`;
  const fixture = {
    id,
    input,
    expectedDiseaseAware: a,
    expectedDiseaseBlind: b,
  };
  writeFileSync(
    `test/fixtures/${id}.json`,
    JSON.stringify(fixture, null, 2) + "\n",
  );
  seeds.push(fixture);
}

const body = `import type { GenerationInput, GenerationQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GenerationInput;
  expectedDiseaseAware: GenerationQuality;
  expectedDiseaseBlind: GenerationQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(seeds, null, 2)} as Golden[];
`;

writeFileSync("src/goldens.ts", body);
console.log("wrote", seeds.length, "goldens");
