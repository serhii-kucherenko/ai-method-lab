import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreContactCentric as scoreContactA,
  scoreVisionOnlyBaseline as scoreVisionA,
} from "../src/domain/scoreA.ts";
import {
  scoreContactCentric as scoreContactB,
  scoreVisionOnlyBaseline as scoreVisionB,
} from "../src/domain/scoreB.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");

describe("dual goldens", () => {
  it("ships at least 30 golden fixtures", () => {
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 30);
    assert.ok(GOLDENS.length >= 30);
  });

  it("scoreA ≡ scoreB ≡ expected for every golden", () => {
    for (const g of GOLDENS) {
      const fixture = JSON.parse(
        readFileSync(join(fixturesDir, `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(fixture, g);

      const contactA = scoreContactA({
        ...g.input,
        profile: "contact_centric",
      });
      const contactB = scoreContactB({
        ...g.input,
        profile: "contact_centric",
      });
      assert.deepEqual(contactA, contactB, g.id);
      assert.deepEqual(contactA, g.expectedContactCentric, g.id);

      const visionA = scoreVisionA({ ...g.input, profile: "vision_only" });
      const visionB = scoreVisionB({ ...g.input, profile: "vision_only" });
      assert.deepEqual(visionA, visionB, g.id);
      assert.deepEqual(visionA, g.expectedVisionOnly, g.id);
    }
  });
});
