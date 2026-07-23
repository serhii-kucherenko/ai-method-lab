import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/httpApp.js";
import { scoreDeployFit } from "../src/domain/deployFit.js";
import { scoreDeployFitB } from "../src/domain/deployFitB.js";
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
  assert.match(body, /2607\.18171/);
});

test("P-landing: marketing markers", async () => {
  const body = await page("/");
  assert.match(body, /data-landing="live"/);
  assert.match(body, /Open desk/);
  assert.match(body, /Sources/i);
  assert.match(body, /none published with this paper/i);
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

test("D-dual: A and B agree on full rare_class overlap", () => {
  const input = {
    harness_tags: "pocket,motif,fold-class",
    config_feature_tags: "pocket,motif,fold-class",
  };
  const a = scoreDeployFit(input);
  const b = scoreDeployFitB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.harness_steps, 4);
    assert.equal(a.delta_score, 8);
    assert.equal(a.delta_score, b.delta_score);
    assert.equal(a.integrated.deploy_score, 9);
  }
});

test("D-dual: A and B agree on majority cheat reject", () => {
  const input = { harness_depth: 3, manual_cheat: true };
  const a = scoreDeployFit(input);
  const b = scoreDeployFitB(input);
  assert.equal(a.status, "reject");
  assert.equal(b.status, "reject");
  if (a.status === "reject" && b.status === "reject") {
    assert.equal(a.reason, "manual_cheat");
    assert.equal(b.reason, "manual_cheat");
  }
});

test("M-forbidden: no authors-model replacement claim", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /not a replacement/i);
  assert.doesNotMatch(body, /replaces the authors|production drop-in/i);
});

test("M-naming: Realtime Deploy Desk brand; no short-name brand", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /Realtime Deploy Desk/);
  assert.doesNotMatch(body, /<h1>[^<]*FlashRT/i);
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
    assert.equal(json.product, "realtime-deploy-desk");
    assert.equal(json.display_name, "Realtime Deploy Desk");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("rdd-") && f.endsWith(".json"),
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
    .filter((f) => f.startsWith("rdd-") && f.endsWith(".json"))
    .sort();
  assert.ok(files.length >= 25);
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as { input: Parameters<typeof scoreDeployFit>[0] };
    const a = scoreDeployFit(doc.input);
    const b = scoreDeployFitB(doc.input);
    assert.deepEqual(a, b, file);
  }
});
