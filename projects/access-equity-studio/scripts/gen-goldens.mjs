/**
 * Generate dual-impl golden fixtures for Access Equity Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreEquityAccessTaskSharing,
  scoreAccuracyOnlyClassifier,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "access_first",
  "balanced",
  "task_sharing_first",
  "accuracy_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ae-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    accessReach: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    equityGapClosure: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    taskSharingFidelity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    accuracyAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    screenNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    accuracyTunnel: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    equityBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "accuracy_only_classifier"
        : "equity_access_task_sharing",
  };
  const expectedEquityAccess = scoreEquityAccessTaskSharing({
    ...input,
    profile: "equity_access_task_sharing",
  });
  const expectedAccuracyOnly = scoreAccuracyOnlyClassifier({
    ...input,
    profile: "accuracy_only_classifier",
  });
  const row = {
    id,
    input,
    expectedEquityAccess,
    expectedAccuracyOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ae-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AccessEquityInput, AccessEquityQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AccessEquityInput;
  expectedEquityAccess: AccessEquityQuality;
  expectedAccuracyOnly: AccessEquityQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (ae-001…ae-030)`);
