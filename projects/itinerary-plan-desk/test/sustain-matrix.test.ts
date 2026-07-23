import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/httpApp.js";
import { scoreItinerary } from "../src/domain/itineraryPlan.js";
import { scoreItineraryB } from "../src/domain/itineraryPlanB.js";
import { listGoldenCards } from "../src/goldens.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

async function page(path: string): Promise<string> {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
    return await res.text();
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test("P-honesty: live honesty copy", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /not a replacement for the authors/i);
  assert.match(body, /2607\.15552/);
});

test("P-landing: marketing markers", async () => {
  const body = await page("/");
  assert.match(body, /data-landing="live"/);
  assert.match(body, /Open desk/);
  assert.match(body, /Sources/i);
  assert.match(body, /Official529Tech\/pla-itinerary/);
  assert.match(body, /Selling points/i);
});

test("P-jobs: live marker", async () => {
  assert.match(await page("/jobs.html"), /data-jobs="live"/);
});

test("P-lifecycle: live marker", async () => {
  assert.match(await page("/lifecycle.html"), /data-lifecycle="live"/);
});

test("P-scenario: live marker", async () => {
  assert.match(await page("/scenario.html"), /data-scenario="live"/);
});

test("P-batch: live marker", async () => {
  assert.match(await page("/batch.html"), /data-batch="live"/);
});

test("P-audit: live marker", async () => {
  assert.match(await page("/audit.html"), /data-audit="live"/);
});

test("P-settings: webhook rotate copy", async () => {
  assert.match(await page("/settings.html"), /Rotate|webhook/i);
});

test("P-goldens: live marker", async () => {
  assert.match(await page("/goldens.html"), /data-goldens="live"/);
});

test("D-dual: A and B agree when naive overruns windows", () => {
  const input = {
    day_budget: 5,
    day_start: 9,
    pois: "museum:12:17:2:9|cafe:8:20:1:7|park:9:18:2:5",
  };
  const a = scoreItinerary(input);
  const b = scoreItineraryB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.day_budget, 5);
    assert.ok(a.naive.risk_score >= a.pla.risk_score);
    assert.equal(a.pla.feasible, true);
    assert.equal(a.delta_score, b.delta_score);
    assert.equal(a.pla.risk_score, b.pla.risk_score);
  }
});

test("D-dual: A and B agree on preference cheat reject", () => {
  const input = { day_budget: 8, preference_cheat: true };
  const a = scoreItinerary(input);
  const b = scoreItineraryB(input);
  assert.equal(a.status, "reject");
  assert.equal(b.status, "reject");
  if (a.status === "reject" && b.status === "reject") {
    assert.equal(a.reason, "preference_cheat");
    assert.equal(b.reason, "preference_cheat");
  }
});

test("M-forbidden: no authors-model replacement claim", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /not a replacement/i);
  assert.doesNotMatch(body, /replaces the authors|production drop-in/i);
});

test("M-naming: Itinerary Plan Desk brand; no short-name brand", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /Itinerary Plan Desk/);
  assert.doesNotMatch(body, /<h1>[^<]*FlyEnJoy/i);
  assert.match(body, /never brand/i);
});

test("C-batch-page: independence copy", async () => {
  assert.match(await page("/batch.html"), /independently|siblings/i);
});

test("A-health: display name", async () => {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}/health`);
    const json = (await res.json()) as { product: string; display_name: string };
    assert.equal(res.status, 200);
    assert.equal(json.product, "itinerary-plan-desk");
    assert.equal(json.display_name, "Itinerary Plan Desk");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("std-") && f.endsWith(".json"),
  ).length;
  assert.ok(n >= 25);
});

test("G-pack: listGoldenCards all_pass", () => {
  const pack = listGoldenCards();
  assert.ok(pack.total >= 25);
  assert.equal(pack.all_pass, true);
});

test("D-dual: A and B agree on all golden fixtures", () => {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("std-") && f.endsWith(".json"))
    .sort();
  assert.ok(files.length >= 25);
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as { input: Parameters<typeof scoreItinerary>[0] };
    const a = scoreItinerary(doc.input);
    const b = scoreItineraryB(doc.input);
    assert.deepEqual(a, b, file);
  }
});
