/**
 * Generate dual-impl golden fixtures for Federated CVD Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreFederatedCvdRisk,
  scoreCentralizedBaseline,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "federation_strict",
  "balanced",
  "federated_first",
  "central_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `fcvd-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    siteParticipation: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    featureFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    schemaFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    federationAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    centralizedAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    centralOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    heterogeneityHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    cvdBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "centralized_baseline" : "federated_cvd_risk",
  };
  const expectedFederatedCvdRisk = scoreFederatedCvdRisk({
    ...input,
    profile: "federated_cvd_risk",
  });
  const expectedCentralizedBaseline = scoreCentralizedBaseline({
    ...input,
    profile: "centralized_baseline",
  });
  const row = {
    id,
    input,
    expectedFederatedCvdRisk,
    expectedCentralizedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("fcvd-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CvdInput, CvdQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CvdInput;
  expectedFederatedCvdRisk: CvdQuality;
  expectedCentralizedBaseline: CvdQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
