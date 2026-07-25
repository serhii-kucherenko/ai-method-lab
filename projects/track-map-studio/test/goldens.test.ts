import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreOnlineDeformableSlam,
  scoreOfflineKinematicsPriorBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 tm-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("tm-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const onlineSlam = scoreOnlineDeformableSlam({
        ...g.input,
        profile: "online_deformable_slam",
      });
      const offlineKinematics = scoreOfflineKinematicsPriorBaseline({
        ...g.input,
        profile: "offline_kinematics_prior_baseline",
      });
      assert.deepEqual(onlineSlam, g.expectedOnlineSlam, g.id);
      assert.deepEqual(offlineKinematics, g.expectedOfflineKinematics, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});
