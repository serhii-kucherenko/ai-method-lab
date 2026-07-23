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
      /data-home="live"/,
      /data-landing="live"/,
      /Pathology Vision Desk/,
      /Open desk/,
      /Sources/,
      /https:\/\/arxiv\.org\/abs\/2607\.09526v1/,
      /https:\/\/github\.com\/WonderLandxD\/ALICE/,
    ],
  },
  { path: "/jobs.html", must: [/data-jobs="live"/, /vision jobs|jobs/i] },
  { path: "/lifecycle.html", must: [/data-lifecycle="live"/, /Lifecycle|draft|queued/i] },
  {
    path: "/scenario.html",
    must: [/data-scenario="live"/, /single-view|multi-expert|Scenario/i],
  },
  { path: "/batch.html", must: [/data-batch="live"/, /independently|siblings/i] },
  { path: "/audit.html", must: [/data-audit="live"/, /CSV|audit/i] },
  { path: "/goldens.html", must: [/data-goldens="live"/, /Goldens browser/i] },
  {
    path: "/honesty.html",
    must: [/data-honesty="live"/, /not a replacement for the authors/i],
  },
  { path: "/settings.html", must: [/data-settings="live"/, /Rotate webhook|webhook/i] },
];

test("ui-critical: every live page marker + honesty fence", async () => {
  await withServer(async (base) => {
    assert.ok(CRITICAL.length >= 6);
    for (const page of CRITICAL) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      const body = await res.text();
      for (const re of page.must) {
        assert.match(body, re, `${page.path} missing ${re}`);
      }
      assert.doesNotMatch(body, /<h1>[^<]*ALICE/i, page.path);
      assert.doesNotMatch(body, /<title>[^<]*ALICE/i, page.path);
    }
  });
});
