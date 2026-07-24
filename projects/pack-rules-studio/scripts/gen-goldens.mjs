/**
 * Generate dual-impl golden fixtures for Pack Rules Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scorePrefsOnly, scoreRulesPrefs } from "../src/domain/pack.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `prs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    safetyRuleCoverage: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.015),
    luggageLimitHeadroom: round2(0.18 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    dependencySatisfaction: round2(0.15 + t * 0.72 + ((i % 3) - 1) * 0.02),
    preferenceFit: round2(0.2 + t * 0.68 + ((i % 6) - 2.5) * 0.015),
    ruleStrictness: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    preferenceWeight: round2(0.12 + t * 0.75 + ((i % 5) - 2) * 0.02),
    itemCount: Math.max(4, Math.min(80, 8 + (i % 40))),
    liquidVolumeRisk: round2(0.05 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    batteryPolicyCompliance: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.015),
    weatherAdaptability: round2(0.16 + t * 0.68 + ((i % 7) - 3) * 0.015),
    tripDays: Math.max(1, Math.min(30, 2 + (i % 20))),
    profile: i % 3 === 0 ? "compliant" : "baseline",
  };
  const expectedRulesPrefs = scoreRulesPrefs(input);
  const expectedPrefsOnly = scorePrefsOnly(input);
  const row = {
    id,
    input,
    expectedRulesPrefs,
    expectedPrefsOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { PackInput, PackQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PackInput;
  expectedRulesPrefs: PackQuality;
  expectedPrefsOnly: PackQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
