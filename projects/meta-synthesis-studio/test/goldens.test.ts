import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAdhoc, scoreAgentic } from "../src/domain/synthesis.ts";
import {
  scoreAdhoc as scoreAdhocB,
  scoreAgentic as scoreAgenticB,
} from "../src/domain/synthesisB.ts";

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
    it(`${g.id} agentic and adhoc agree across impls`, () => {
      const a1 = scoreAgentic(g.input);
      const a2 = scoreAgenticB(g.input);
      const b1 = scoreAdhoc(g.input);
      const b2 = scoreAdhocB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedAgentic);
      assert.deepEqual(b1, g.expectedAdhoc);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedAgentic);
      assert.deepEqual(b1, fixture.expectedAdhoc);
    });
  }
});
