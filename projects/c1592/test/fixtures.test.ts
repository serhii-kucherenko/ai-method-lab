import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { penaltyMax, type PenaltyInput } from "../src/domain/penaltyMax.js";
import { penaltyMaxB } from "../src/domain/penaltyMaxB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = {
  status: "ok";
  penalty_max: number;
  branch: string;
};
type ExpectReject = { status: "reject"; reason?: string };
type FixtureDoc = {
  id: string;
  input: PenaltyInput;
  expect: ExpectOk | ExpectReject;
};

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("c1592-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 30", () => {
  assert.ok(files.length >= 30, `expected ≥30 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = penaltyMax(doc.input);
    const b = penaltyMaxB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(
          nearlyEqual(a.penalty_max, want.penalty_max),
          `A penalty_max ${a.penalty_max} vs ${want.penalty_max}`,
        );
        assert.equal(a.branch, want.branch);
        assert.ok(nearlyEqual(b.penalty_max, a.penalty_max), `dual penalty_max drift`);
        assert.equal(b.branch, a.branch, `dual branch drift`);
      }
    } else if (want.reason) {
      assert.equal(a.status, "reject");
      if (a.status === "reject") assert.equal(a.reason, want.reason);
      assert.equal(b.status, "reject");
      if (b.status === "reject") assert.equal(b.reason, want.reason);
    }
  });
}
