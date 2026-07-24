import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreEvidenceGrounded,
  scoreUngroundedLlm,
} from "../src/domain/care.ts";
import {
  scoreEvidenceGrounded as scoreEvidenceGroundedB,
  scoreUngroundedLlm as scoreUngroundedLlmB,
} from "../src/domain/careB.ts";

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
    it(`${g.id} grounded and ungrounded agree across impls`, () => {
      const a1 = scoreEvidenceGrounded(g.input);
      const a2 = scoreEvidenceGroundedB(g.input);
      const b1 = scoreUngroundedLlm(g.input);
      const b2 = scoreUngroundedLlmB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedEvidenceGrounded);
      assert.deepEqual(b1, g.expectedUngroundedLlm);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedEvidenceGrounded);
      assert.deepEqual(b1, fixture.expectedUngroundedLlm);
    });
  }
});
