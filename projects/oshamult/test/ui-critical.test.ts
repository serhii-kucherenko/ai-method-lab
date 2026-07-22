import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("ui-critical: honesty Kill A + catalog + detail + goldens load", async () => {
  const { server } = createApp({ rateLimit: 100 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const honesty = await fetch(`${base}/money-honesty.html`);
  assert.equal(honesty.status, 200);
  const body = await honesty.text();
  assert.match(body, /Kill A/i);
  assert.match(body, /Safety consultants and settlement counsel still/i);
  assert.match(body, /forecast\s*\/\s*method experiment/i);
  assert.match(body, /serial\s*≠\s*additive|serial ≠ additive/i);
  assert.match(body, /v0 order debt|Size → History → Good Faith/i);
  assert.doesNotMatch(body, /replaces OSHA|OIS replacement that ships citations/i);

  const catalog = await fetch(`${base}/citations.html`);
  assert.equal(catalog.status, 200);
  const catalogBody = await catalog.text();
  assert.match(catalogBody, /Citations catalog/i);
  assert.match(catalogBody, /data-catalog="live"/);
  assert.match(catalogBody, /localStorage|oshamult_token/);
  assert.match(catalogBody, /\/orgs\/.*\/citations|\/citations/);
  assert.match(catalogBody, /authorization.*Bearer|Bearer /);

  const detail = await fetch(`${base}/citation-detail.html`);
  assert.equal(detail.status, 200);
  const detailBody = await detail.text();
  assert.match(detailBody, /Citation detail/i);
  assert.match(detailBody, /data-detail="live"/);
  assert.match(detailBody, /id="run-forecast"|Run forecast/i);
  assert.match(detailBody, /\/forecast/);
  assert.match(detailBody, /steps\[\]|serial ≠ additive/i);

  const goldens = await fetch(`${base}/goldens.html`);
  assert.equal(goldens.status, 200);
  const goldensBody = await goldens.text();
  assert.match(goldensBody, /Goldens browser/i);
  assert.match(goldensBody, /data-goldens="live"/);
  assert.match(goldensBody, /Kill A|method experiment/i);

  server.close();
});
