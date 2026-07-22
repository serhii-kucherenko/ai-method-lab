import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { trueUp, type ForecastInput } from "../src/domain/forecast.js";
import { trueUpB } from "../src/domain/forecastB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = {
  status: "ok";
  duty_delta: number;
  days: number;
  interest: number;
  true_up: number;
};
type ExpectReject = { status: "reject" };
type FixtureDoc = {
  id: string;
  input: ForecastInput;
  expect: ExpectOk | ExpectReject;
};

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("depositgap-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 23", () => {
  assert.ok(files.length >= 23, `expected ≥23 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = trueUp(doc.input);
    const b = trueUpB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(nearlyEqual(a.duty_delta, want.duty_delta), "duty_delta A");
        assert.equal(a.days, want.days);
        assert.ok(nearlyEqual(a.interest, want.interest), "interest A");
        assert.ok(nearlyEqual(a.true_up, want.true_up), "true_up A");
        assert.ok(nearlyEqual(a.duty_delta, b.duty_delta), "duty_delta dual");
        assert.equal(a.days, b.days);
        assert.ok(nearlyEqual(a.interest, b.interest), "interest dual");
        assert.ok(nearlyEqual(a.true_up, b.true_up), "true_up dual");
      }
    }
  });
}
