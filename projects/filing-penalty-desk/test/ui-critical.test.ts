import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

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
      /Filing Penalty Desk/,
      /Open desk/,
      /Sources/,
      /Not paper-sourced/i,
      /returns\.html/,
    ],
  },
  { path: "/honesty.html", must: [/data-honesty="live"/, /Kill A/i, /Filing Penalty Desk/] },
  { path: "/returns.html", must: [/data-catalog="live"/, /Returns catalog/i] },
  { path: "/timeline-detail.html", must: [/data-detail="live"/, /Run forecast/i] },
  { path: "/scenario.html", must: [/data-scenario="live"/, /Naive|Correct/i] },
  { path: "/batch.html", must: [/data-batch="live"/, /Run batch/i] },
  { path: "/audit.html", must: [/data-audit="live"/, /Export CSV/i] },
  { path: "/settings.html", must: [/data-settings="live"/, /Rotate webhook/i] },
  { path: "/goldens.html", must: [/data-goldens="live"/, /Goldens browser/i] },
];

test("ui-critical: every live page marker + no statute brand", async () => {
  await withServer(async (base) => {
    assert.ok(CRITICAL.length >= 6);
    for (const page of CRITICAL) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      const body = await res.text();
      for (const re of page.must) {
        assert.match(body, re, `${page.path} missing ${re}`);
      }
      assert.doesNotMatch(body, /irc6651/i, page.path);
    }
  });
});
