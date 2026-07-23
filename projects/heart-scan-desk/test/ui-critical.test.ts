import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/httpApp.js";

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const { server } = createApp({ rateLimit: 200 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

const CRITICAL = [
  {
    path: "/",
    must: [
      /data-landing="live"/,
      /Heart Scan Desk/,
      /Open desk/,
      /Selling points/i,
      /How it works/i,
      /Sources/i,
      /none published|Authors/,
      /2607\.11287/,
    ],
  },
  { path: "/jobs.html", must: [/data-jobs="live"/, /scan jobs|jobs/i] },
  { path: "/lifecycle.html", must: [/data-lifecycle="live"/, /Lifecycle|draft|queued/i] },
  {
    path: "/scenario.html",
    must: [/data-scenario="live"/, /naive|unified-seg-pheno|Scenario|seg_only|single.center|pheno_pixels/i],
  },
  { path: "/batch.html", must: [/data-batch="live"/, /independently|siblings/i] },
  { path: "/audit.html", must: [/data-audit="live"/, /CSV|audit/i] },
  { path: "/goldens.html", must: [/data-goldens="live"/, /Goldens browser/i] },
  {
    path: "/honesty.html",
    must: [/data-honesty="live"/, /not a replacement for the authors|not a clinical diagnostic/i],
  },
  { path: "/settings.html", must: [/data-settings="live"/, /Rotate webhook|webhook/i] },
];

test("ui-critical: every live page marker + honesty fence + landing", async () => {
  await withServer(async (base) => {
    assert.ok(CRITICAL.length >= 6);
    for (const page of CRITICAL) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      const body = await res.text();
      for (const re of page.must) {
        assert.match(body, re, `${page.path} missing ${re}`);
      }
      assert.doesNotMatch(body, /<h1>[^<]*the authors' foundation model/i, page.path);
      assert.doesNotMatch(body, /<title>[^<]*\bFermi\b/i, page.path);
    }
  });
});
