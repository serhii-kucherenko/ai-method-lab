import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveLinear as scoreLinearA,
  scoreScaffoldedAuthoring as scoreScaffoldA,
} from "../src/domain/scoreA.ts";
import {
  scoreNaiveLinear as scoreLinearB,
  scoreScaffoldedAuthoring as scoreScaffoldB,
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

      const qA = scoreScaffoldA({
        ...g.input,
        profile: "scaffolded_authoring",
      });
      const qB = scoreScaffoldB({
        ...g.input,
        profile: "scaffolded_authoring",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedScaffoldedAuthoring, g.id);

      const cA = scoreLinearA({
        ...g.input,
        profile: "naive_linear",
      });
      const cB = scoreLinearB({
        ...g.input,
        profile: "naive_linear",
      });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedNaiveLinear, g.id);
    }
  });
});
