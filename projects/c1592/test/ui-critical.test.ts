import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("ui-critical: honesty + catalog + detail carry live markers", async () => {
  const { server } = createApp({ rateLimit: 100 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    const html = await honesty.text();
    assert.match(html, /Kill A/i);
    assert.match(html, /method experiment/i);
    assert.match(html, /\$200,000/);
    assert.match(html, /\$150,000/);

    const catalog = await fetch(`${base}/violations.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);

    const detail = await fetch(`${base}/violation-detail.html`);
    assert.equal(detail.status, 200);
    assert.match(await detail.text(), /data-detail="live"/);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
