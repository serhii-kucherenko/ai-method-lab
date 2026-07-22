import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { excise, type ExciseInput } from "../src/domain/excise.js";
import { exciseB } from "../src/domain/exciseB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = {
  status: "ok";
  initial_tax: number;
  additional_tax: number;
  total: number;
};
type ExpectReject = { status: "reject"; reason?: string };
type FixtureDoc = {
  id: string;
  input: ExciseInput;
  expect: ExpectOk | ExpectReject;
};

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("ptax4975-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 35", () => {
  assert.ok(files.length >= 35, `expected ≥35 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = excise(doc.input);
    const b = exciseB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(
          nearlyEqual(a.initial_tax, want.initial_tax),
          `A initial ${a.initial_tax} vs ${want.initial_tax}`,
        );
        assert.ok(
          nearlyEqual(a.additional_tax, want.additional_tax),
          `A additional ${a.additional_tax} vs ${want.additional_tax}`,
        );
        assert.ok(nearlyEqual(a.total, want.total), `A total ${a.total} vs ${want.total}`);
        assert.ok(nearlyEqual(b.initial_tax, a.initial_tax), `dual initial drift`);
        assert.ok(nearlyEqual(b.additional_tax, a.additional_tax), `dual additional drift`);
        assert.ok(nearlyEqual(b.total, a.total), `dual total drift`);
      }
    } else if (want.reason) {
      assert.equal(a.status, "reject");
      if (a.status === "reject") assert.equal(a.reason, want.reason);
      assert.equal(b.status, "reject");
      if (b.status === "reject") assert.equal(b.reason, want.reason);
    }
  });
}
