import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createDataset,
  createRobot,
  createSkill,
  createTerrain,
  createTransition,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports robot → terrain → skill → dataset → transition → compare", () => {
    resetStore();
    const robot = createRobot({
      name: "Test Field Quad",
      platform: "field_quad",
      massKg: 30,
      legLengthMm: 350,
    });
    createTerrain({
      robotId: robot.id,
      name: "Rocky cut",
      kind: "rocky_slope",
      roughness: 0.7,
      slopeGrade: 0.5,
    });
    createSkill({
      robotId: robot.id,
      name: "Crawl pack",
      kind: "crawl",
      coverage: 0.8,
      stability: 0.85,
    });
    createDataset({
      robotId: robot.id,
      name: "Trail RL",
      kind: "rl_rollout",
      density: 0.7,
      episodes: 500,
    });
    createTransition({
      robotId: robot.id,
      name: "Trot to crawl",
      fromSkill: "trot",
      toSkill: "crawl",
      status: "smooth",
      smoothness: 0.9,
    });
    const compare = createCompare({
      name: "Multi vs single",
      robotId: robot.id,
    });
    assert.ok(compare.multiSkill.overall >= 0);
    assert.ok(compare.singleGait.overall >= 0);
    inviteMember("peer@quad-skill.local", "engineer");
  });
});
