import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { recover, type RecoverInput } from "../src/domain/recover.js";
import { recoverB } from "../src/domain/recoverB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = {
  status: "ok";
  refund: number;
  line_refunds?: number[];
};
type ExpectReject = { status: "reject"; reason?: string };
type FixtureDoc = {
  id: string;
  input: RecoverInput;
  expect: ExpectOk | ExpectReject;
};

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("lesserof-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 25", () => {
  assert.ok(files.length >= 25, `expected ≥25 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = recover(doc.input);
    const b = recoverB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(nearlyEqual(a.refund, want.refund), `A refund ${a.refund} vs ${want.refund}`);
        assert.ok(nearlyEqual(b.refund, a.refund), `dual refund drift`);
        if (want.line_refunds) {
          assert.ok(a.line_refunds);
          assert.equal(a.line_refunds!.length, want.line_refunds.length);
          assert.ok(
            a.line_refunds!.every((v, i) => nearlyEqual(v, want.line_refunds![i])),
            "line_refunds",
          );
        }
      }
    } else if (want.reason) {
      assert.equal(a.status, "reject");
      if (a.status === "reject") assert.equal(a.reason, want.reason);
      assert.equal(b.status, "reject");
      if (b.status === "reject") assert.equal(b.reason, want.reason);
    }
  });
}
