import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { evaluateSwap, type SwapInput } from "../src/te.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = SwapInput & {
  expect: { allow: boolean; reason?: string };
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("ndcswap-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const got = evaluateSwap(doc);
    assert.equal(got.allow, doc.expect.allow);
    if (doc.expect.reason !== undefined) assert.equal(got.reason, doc.expect.reason);
  });
}
