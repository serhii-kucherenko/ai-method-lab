import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreFluency, scoreTrackAware } from "../src/domain/track.ts";
import {
  scoreFluency as scoreFluencyB,
  scoreTrackAware as scoreTrackAwareB,
} from "../src/domain/trackB.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.endsWith(".json"),
    );
    assert.ok(files.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} track-aware and fluency agree across impls`, () => {
      const a1 = scoreTrackAware({ ...g.input, profile: "track_aware" });
      const a2 = scoreTrackAwareB({ ...g.input, profile: "track_aware" });
      const b1 = scoreFluency({ ...g.input, profile: "fluency" });
      const b2 = scoreFluencyB({ ...g.input, profile: "fluency" });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedTrackAware);
      assert.deepEqual(b1, g.expectedFluency);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedTrackAware);
      assert.deepEqual(b1, fixture.expectedFluency);
    });
  }
});
