import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreChannelAware, scoreUniform } from "../src/domain/quant.ts";
import {
  scoreChannelAware as scoreChannelAwareB,
  scoreUniform as scoreUniformB,
} from "../src/domain/quantB.ts";

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
    it(`${g.id} channel-aware and uniform agree across impls`, () => {
      const a1 = scoreChannelAware({ ...g.input, profile: "channel" });
      const a2 = scoreChannelAwareB({ ...g.input, profile: "channel" });
      const b1 = scoreUniform({ ...g.input, profile: "uniform" });
      const b2 = scoreUniformB({ ...g.input, profile: "uniform" });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedChannelAware);
      assert.deepEqual(b1, g.expectedUniform);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedChannelAware);
      assert.deepEqual(b1, fixture.expectedUniform);
    });
  }
});
