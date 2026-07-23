import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { scoreVirulenceFit } from "../src/domain/virulenceFit.js";
import { scoreVirulenceFitB } from "../src/domain/virulenceFitB.js";
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
  assert.match(body, /10\.1186\/s40168-026-02467-w/);
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

test("D-dual: A and B agree on full structural overlap", () => {
  const input = {
    structural_tags: "pocket,motif,fold-class",
    evolutionary_tags: "pocket,motif,fold-class",
  };
  const a = scoreVirulenceFit(input);
  const b = scoreVirulenceFitB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.fit_steps, 4);
    assert.equal(a.delta_risk, 8);
    assert.equal(a.delta_risk, b.delta_risk);
    assert.equal(a.integrated.virulence_risk_score, 9);
  }
});

test("D-dual: A and B agree on sequence-only cheat reject", () => {
  const input = { fit_depth: 3, sequence_only_cheat: true };
  const a = scoreVirulenceFit(input);
  const b = scoreVirulenceFitB(input);
  assert.equal(a.status, "reject");
  assert.equal(b.status, "reject");
  if (a.status === "reject" && b.status === "reject") {
    assert.equal(a.reason, "sequence_only_cheat");
    assert.equal(b.reason, "sequence_only_cheat");
  }
});

test("M-forbidden: no authors-tool replacement claim", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /not a replacement/i);
  assert.doesNotMatch(body, /replaces the authors|production drop-in/i);
});

test("M-naming: Virulence Feature Desk brand; no short-name brand", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /Virulence Feature Desk/);
  assert.doesNotMatch(body, /<h1>[^<]*SEVA/i);
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
    assert.equal(json.product, "virulence-feature-desk");
    assert.equal(json.display_name, "Virulence Feature Desk");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("vfd-") && f.endsWith(".json"),
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
    .filter((f) => f.startsWith("vfd-") && f.endsWith(".json"))
    .sort();
  assert.ok(files.length >= 25);
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as { input: Parameters<typeof scoreVirulenceFit>[0] };
    const a = scoreVirulenceFit(doc.input);
    const b = scoreVirulenceFitB(doc.input);
    assert.deepEqual(a, b, file);
  }
});
