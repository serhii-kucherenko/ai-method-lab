import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("ui-critical: honesty page carries Kill A + stacked miss toys", async () => {
  const { server } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  const honesty = await fetch(`${base}/honesty.html`);
  assert.equal(honesty.status, 200);
  const html = await honesty.text();
  assert.match(html, /Existing specialists still file/i);
  assert.match(html, /method experiment/i);
  assert.match(html, /\$3,960/);
  assert.match(html, /\$9,900/);
  server.close();
});
