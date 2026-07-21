import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";

test("integrate: HMAC, idempotent webhook, post dep mapping", async () => {
  const { server } = createApp({ webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const payload = JSON.stringify({ eventId: "evt-sc-1" });
  assert.equal(
    (
      await fetch(`${base}/webhooks/inbound`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-signature": "bad" },
        body: payload,
      })
    ).status,
    401,
  );
  const sig = createHmac("sha256", "whsec_int").update(payload).digest("hex");
  const first = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(first.status, 200);
  const second = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(((await second.json()) as { duplicate: boolean }).duplicate, true);
  server.close();

  const failDep = createMockDep({ failTimes: 1 });
  const { server: s2, store: st2 } = createApp({ dep: failDep });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const addr2 = s2.address();
  assert.ok(addr2 && typeof addr2 === "object");
  const base2 = `http://127.0.0.1:${addr2.port}`;

  const an = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "f@ex.com", password: "pw" }),
  });
  const anj = (await an.json()) as { token: string; user: { id: string } };
  const st = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fs@ex.com", password: "pw" }),
  });
  const stj = (await st.json()) as { token: string; user: { id: string } };
  const acc = await fetch(`${base2}/accounts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${anj.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const accj = (await acc.json()) as { account: { id: string } };
  addMember(st2.db, accj.account.id, stj.user.id, "settler");
  const interval = await fetch(`${base2}/accounts/${accj.account.id}/intervals`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${anj.token}`,
    },
    body: JSON.stringify({
      interval_start: "2026-07-01T14:00:00-05:00",
      meter_kwh: 100,
      schedule_kwh: 98,
      delivery_factor: 0.98,
      imbalance_price: 0.05,
    }),
  });
  const intervalj = (await interval.json()) as { interval: { id: string } };
  const fail = await fetch(`${base2}/intervals/${intervalj.interval.id}/transition`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${stj.token}`,
    },
    body: JSON.stringify({ to: "posted", version: 1 }),
  });
  assert.equal(fail.status, 502);
  s2.close();
});
