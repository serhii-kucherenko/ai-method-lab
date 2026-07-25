/**
 * Generate dual-impl golden fixtures for Async Neuro Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreStandardizedAsyncVideoExam,
  scoreAdHocExamBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "protocol_first",
  "balanced",
  "site_first",
  "ad_hoc_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `an-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    protocolFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    siteConsistency: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    videoCompleteness: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    adHocAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    captureNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    examinerDrift: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    examBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "ad_hoc_exam_baseline" : "standardized_async_video_exam",
  };
  const expectedStandardized = scoreStandardizedAsyncVideoExam({
    ...input,
    profile: "standardized_async_video_exam",
  });
  const expectedAdHoc = scoreAdHocExamBaseline({
    ...input,
    profile: "ad_hoc_exam_baseline",
  });
  const row = {
    id,
    input,
    expectedStandardized,
    expectedAdHoc,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("an-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AsyncNeuroInput, AsyncNeuroQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AsyncNeuroInput;
  expectedStandardized: AsyncNeuroQuality;
  expectedAdHoc: AsyncNeuroQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (an-001…an-030)`);
