import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("ui-critical: money-honesty page carries Kill A and deposit≠final", async () => {
  const { server } = createApp({ rateLimit: 100 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const res = await fetch(`${base}/money-honesty.html`);
  assert.equal(res.status, 200);
  const body = await res.text();

  assert.match(body, /Kill A/i);
  assert.match(body, /Brokers and CBP still own liquidation/i);
  assert.match(body, /forecast\s*\/\s*method experiment/i);
  assert.match(body, /deposit\s*≠\s*final|deposit is not the final/i);
  assert.match(body, /delinquency\s*≠\s*deposit gap|Delinquency ≠ deposit gap/i);
  assert.doesNotMatch(body, /replaces your broker|ACE replacement|prints the ACE bill/i);

  const catalog = await fetch(`${base}/entries.html`);
  assert.equal(catalog.status, 200);
  assert.match(await catalog.text(), /Entries catalog/i);

  const detail = await fetch(`${base}/entry-detail.html`);
  assert.equal(detail.status, 200);
  const detailBody = await detail.text();
  assert.match(detailBody, /Entry detail/i);
  assert.match(detailBody, /deposit\s*≠\s*final/i);

  server.close();
});
