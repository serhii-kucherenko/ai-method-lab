import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  canPublish,
  scoreVisit,
  type ProtocolVersion,
  type Subject,
  type VisitInput,
} from "../src/window.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = {
  fixture_id: string;
  important_codes?: string[];
  versions: ProtocolVersion[];
  subject?: Subject;
  cases?: Array<{
    visit: VisitInput;
    as_of_missed?: string;
    expect: { version_id: string; classification: string; important: boolean };
  }>;
  publish_attempts?: Array<{ version: ProtocolVersion; expect: string }>;
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("amendwin-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const important = doc.important_codes ?? [];
    for (const attempt of doc.publish_attempts ?? []) {
      if (attempt.expect === "reject_unordered_effective") {
        assert.equal(canPublish(doc.versions, attempt.version), false);
      }
    }
    for (const c of doc.cases ?? []) {
      assert.ok(doc.subject);
      const got = scoreVisit(doc.versions, doc.subject, c.visit, important, c.as_of_missed);
      assert.equal(got.version_id, c.expect.version_id);
      assert.equal(got.classification, c.expect.classification);
      assert.equal(got.important, c.expect.important);
    }
  });
}
