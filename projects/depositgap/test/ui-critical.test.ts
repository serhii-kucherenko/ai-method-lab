import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("ui-critical: honesty + catalog + detail + batch + cash + audit + settings stay green", async () => {
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
  const catalogBody = await catalog.text();
  assert.match(catalogBody, /Entries catalog/i);
  assert.match(catalogBody, /data-catalog="live"/);
  assert.match(catalogBody, /localStorage|depositgap_token/);
  assert.match(catalogBody, /\/orgs\/.*\/entries|\/entries/);
  assert.match(catalogBody, /authorization.*Bearer|Bearer /);

  const detail = await fetch(`${base}/entry-detail.html`);
  assert.equal(detail.status, 200);
  const detailBody = await detail.text();
  assert.match(detailBody, /Entry detail/i);
  assert.match(detailBody, /deposit\s*≠\s*final/i);
  assert.match(detailBody, /data-detail="live"/);
  assert.match(detailBody, /id="run-forecast"|Run forecast/i);
  assert.match(detailBody, /\/forecast/);
  assert.match(detailBody, /duty_delta|interest/i);

  const batch = await fetch(`${base}/batch.html`);
  assert.equal(batch.status, 200);
  const batchBody = await batch.text();
  assert.match(batchBody, /Batch forecast/i);
  assert.match(batchBody, /data-batch="live"/);
  assert.match(batchBody, /\/batch\/forecast/);
  assert.match(batchBody, /localStorage|depositgap_token/);
  assert.match(batchBody, /authorization.*Bearer|Bearer /);

  const cash = await fetch(`${base}/cash-impact.html`);
  assert.equal(cash.status, 200);
  const cashBody = await cash.text();
  assert.match(cashBody, /cash impact/i);
  assert.match(cashBody, /data-cash="live"/);
  assert.match(cashBody, /\/cash-impact/);
  assert.match(cashBody, /duty_delta|true_up|refund/i);
  assert.match(cashBody, /localStorage|depositgap_token/);

  const audit = await fetch(`${base}/audit.html`);
  assert.equal(audit.status, 200);
  const auditBody = await audit.text();
  assert.match(auditBody, /Audit log/i);
  assert.match(auditBody, /data-audit="live"/);
  assert.match(auditBody, /\/audit/);
  assert.match(auditBody, /format=csv|CSV/i);
  assert.match(auditBody, /localStorage|depositgap_token/);

  const settings = await fetch(`${base}/settings.html`);
  assert.equal(settings.status, 200);
  const settingsBody = await settings.text();
  assert.match(settingsBody, /Org settings/i);
  assert.match(settingsBody, /data-settings="live"/);
  assert.match(settingsBody, /\/settings/);
  assert.match(settingsBody, /webhook|HMAC|Rotate/i);
  assert.match(settingsBody, /localStorage|depositgap_token/);
  assert.match(settingsBody, /admin only|Admin-only|admin only/i);

  server.close();
});
