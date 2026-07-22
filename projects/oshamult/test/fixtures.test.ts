import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { penalty, type PenaltyInput } from "../src/domain/penalty.js";
import { penaltyB } from "../src/domain/penaltyB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = { status: "ok"; penalty: number };
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
  .filter((f) => f.startsWith("oshamult-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 26", () => {
  assert.ok(files.length >= 26, `expected ≥26 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = penalty(doc.input);
    const b = penaltyB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(nearlyEqual(a.penalty, want.penalty), `A penalty ${a.penalty} vs ${want.penalty}`);
        assert.ok(nearlyEqual(b.penalty, a.penalty), `dual penalty drift`);
        assert.ok(Array.isArray(a.steps) && a.steps.length === 4, "steps[] length");
        assert.equal(a.steps[0]!.factor, "size");
        assert.equal(a.steps[1]!.factor, "history");
        assert.equal(a.steps[2]!.factor, "good_faith");
        assert.equal(a.steps[3]!.factor, "quick_fix");
      }
    } else if (want.reason) {
      assert.equal(a.status, "reject");
      if (a.status === "reject") assert.equal(a.reason, want.reason);
      assert.equal(b.status, "reject");
      if (b.status === "reject") assert.equal(b.reason, want.reason);
    }
  });
}
