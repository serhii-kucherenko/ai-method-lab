import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreOfflineBatch,
  scoreRealtimeStream,
} from "../src/domain/stream.ts";
import {
  scoreOfflineBatch as scoreOfflineBatchB,
  scoreRealtimeStream as scoreRealtimeStreamB,
} from "../src/domain/streamB.ts";

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
    it(`${g.id} realtime and offline-batch agree across impls`, () => {
      const a1 = scoreRealtimeStream({
        ...g.input,
        profile: "realtime_stream",
      });
      const a2 = scoreRealtimeStreamB({
        ...g.input,
        profile: "realtime_stream",
      });
      const b1 = scoreOfflineBatch({
        ...g.input,
        profile: "offline_batch",
      });
      const b2 = scoreOfflineBatchB({
        ...g.input,
        profile: "offline_batch",
      });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedRealtime);
      assert.deepEqual(b1, g.expectedOfflineBatch);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedRealtime);
      assert.deepEqual(b1, fixture.expectedOfflineBatch);
    });
  }
});
