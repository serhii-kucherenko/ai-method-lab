import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const routes = [
  "policies",
  "cascades",
  "handoffs",
  "costs",
  "escalations",
  "compare",
  "scoreboard",
  "pricing",
  "demo",
  "onboarding",
  "flows",
  "honesty",
  "settings",
];

describe("product IA", () =>
  it("has domain pages and avoids desk clone routes", () => {
    for (const route of routes) {
      assert.ok(existsSync(join("src/app", route, "page.tsx")), route);
    }
    const landing = readFileSync("src/app/page.tsx", "utf8");
    assert.ok(landing.includes("LandingPage"));
    assert.ok(!landing.includes("/jobs"));
  }),
);
