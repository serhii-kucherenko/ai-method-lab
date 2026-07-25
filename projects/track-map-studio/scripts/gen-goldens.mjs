/**
 * Generate dual-impl golden fixtures for Track Map Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreOnlineDeformableSlam,
  scoreOfflineKinematicsPriorBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "deform_first",
  "balanced",
  "pose_first",
  "kinematics_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tm-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    deformCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    slamFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    poseGrounding: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    kinematicsConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    kinematicsOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    deformHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    trackBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "offline_kinematics_prior_baseline"
        : "online_deformable_slam",
  };
  const expectedOnlineSlam = scoreOnlineDeformableSlam({
    ...input,
    profile: "online_deformable_slam",
  });
  const expectedOfflineKinematics = scoreOfflineKinematicsPriorBaseline({
    ...input,
    profile: "offline_kinematics_prior_baseline",
  });
  const row = {
    id,
    input,
    expectedOnlineSlam,
    expectedOfflineKinematics,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("tm-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { TrackMapInput, TrackMapQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TrackMapInput;
  expectedOnlineSlam: TrackMapQuality;
  expectedOfflineKinematics: TrackMapQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (tm-001…tm-030)`);
