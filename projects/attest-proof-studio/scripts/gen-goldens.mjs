/**
 * Generate dual-impl golden fixtures for Attest Proof Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreAttested, scoreFluent } from "../src/domain/attest.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = ["calc", "search", "code", "retrieval", "balanced"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `aps-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    toolCoverage: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    evidenceGrounding: round2(0.2 + t * 0.68 + ((i % 5) - 2) * 0.015),
    proofChainIntegrity: round2(0.17 + t * 0.7 + ((i % 3) - 1) * 0.02),
    attestationFreshness: round2(0.19 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    claimSpecificity: round2(0.18 + t * 0.7 + ((i % 3) - 1) * 0.02),
    fluentConfidence: round2(0.35 + t * 0.5 + ((i % 5) - 2) * 0.015),
    unsupportedClaims: round2(0.35 - t * 0.28 + ((i % 3) - 1) * 0.01),
    noiseLevel: round2(0.32 - t * 0.24 + ((i % 4) - 1.5) * 0.01),
    toolBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "fluent" : "attested",
  };
  const expectedAttested = scoreAttested({
    ...input,
    profile: "attested",
  });
  const expectedFluent = scoreFluent({ ...input, profile: "fluent" });
  const row = {
    id,
    input,
    expectedAttested,
    expectedFluent,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { AttestInput, AttestQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AttestInput;
  expectedAttested: AttestQuality;
  expectedFluent: AttestQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
