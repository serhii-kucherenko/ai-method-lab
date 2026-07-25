import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreIdealizedPatient as scoreIdealizedA,
  scoreStyleAware as scoreStyleA,
} from "../src/domain/scoreA.ts";
import {
  scoreIdealizedPatient as scoreIdealizedB,
  scoreStyleAware as scoreStyleB,
} from "../src/domain/scoreB.ts";
import { GOLDENS } from "../src/goldens.ts";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

describe("goldens", () => {
  it("has at least 30 embedded goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("has at least 30 fixture files", () => {
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 30);
  });

  for (const golden of GOLDENS) {
    it(`${golden.id}: A≡B≡expected`, () => {
      const styleA = scoreStyleA({ ...golden.input, profile: "style_aware" });
      const styleB = scoreStyleB({ ...golden.input, profile: "style_aware" });
      const idealA = scoreIdealizedA({
        ...golden.input,
        profile: "idealized_patient",
      });
      const idealB = scoreIdealizedB({
        ...golden.input,
        profile: "idealized_patient",
      });
      assert.deepEqual(styleA, styleB);
      assert.deepEqual(idealA, idealB);
      assert.deepEqual(styleA, golden.expectedStyleAware);
      assert.deepEqual(idealA, golden.expectedIdealizedPatient);
    });
  }
});
