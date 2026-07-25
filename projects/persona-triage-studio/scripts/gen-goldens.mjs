/**
 * Generate dual-impl golden fixtures for Persona Triage Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreIdealizedPatient,
  scoreStyleAware,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "style_strict",
  "balanced",
  "urgency_first",
  "idealized_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pts-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    styleFit: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    personaCoherence: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    urgencyAlignment: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    diversityCoverage: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    articulationScore: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    cooperationScore: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    ambiguityPressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    affectPressure: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    styleBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "idealized_patient" : "style_aware",
  };
  const expectedStyleAware = scoreStyleAware({
    ...input,
    profile: "style_aware",
  });
  const expectedIdealizedPatient = scoreIdealizedPatient({
    ...input,
    profile: "idealized_patient",
  });
  const row = {
    id,
    input,
    expectedStyleAware,
    expectedIdealizedPatient,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

// Remove old fgs fixtures
import { readdirSync, unlinkSync } from "node:fs";
for (const f of readdirSync(fixturesDir)) {
  if (f.startsWith("fgs-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PersonaTriageInput, PersonaTriageQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PersonaTriageInput;
  expectedStyleAware: PersonaTriageQuality;
  expectedIdealizedPatient: PersonaTriageQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
