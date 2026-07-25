import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreTypedTraceValidated,
  scoreUngatedAgent,
} from "../src/domain/chem.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreTypedTraceValidated({
        ...g.input,
        profile: "typed_trace_validated",
      });
      const b = scoreUngatedAgent({
        ...g.input,
        profile: "ungated_agent",
      });
      assert.deepEqual(a, g.expectedTypedTraceValidated);
      assert.deepEqual(b, g.expectedUngatedAgent);
    });
  }
});
