import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreCentralizedBaseline as scoreBaselineA,
  scoreFederatedCvdRisk as scoreFedA,
} from "../src/domain/scoreA.ts";
import {
  scoreCentralizedBaseline as scoreBaselineB,
  scoreFederatedCvdRisk as scoreFedB,
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

      const qA = scoreFedA({
        ...g.input,
        profile: "federated_cvd_risk",
      });
      const qB = scoreFedB({
        ...g.input,
        profile: "federated_cvd_risk",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedFederatedCvdRisk, g.id);

      const cA = scoreBaselineA({
        ...g.input,
        profile: "centralized_baseline",
      });
      const cB = scoreBaselineB({
        ...g.input,
        profile: "centralized_baseline",
      });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedCentralizedBaseline, g.id);
    }
  });
});
