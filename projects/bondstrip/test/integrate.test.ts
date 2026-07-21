import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";

test("integrate: HMAC, idempotent webhook, confirm dep mapping", async () => {
  const { server } = createApp({ webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const payload = JSON.stringify({ eventId: "evt-bs-1" });
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
  const tr = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "ft@ex.com", password: "pw" }),
  });
  const trj = (await tr.json()) as { token: string; user: { id: string } };
  const desk = await fetch(`${base2}/desks`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${anj.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const deskj = (await desk.json()) as { desk: { id: string } };
  addMember(st2.db, deskj.desk.id, trj.user.id, "trader");
  const strip = await fetch(`${base2}/desks/${deskj.desk.id}/strips`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${anj.token}`,
    },
    body: JSON.stringify({
      day_count: "30/360",
      face: 1000,
      coupon_rate: 0.06,
      freq: 2,
      prev_coupon: "2026-01-15",
      next_coupon: "2026-07-15",
      settle: "2026-04-15",
    }),
  });
  const stripj = (await strip.json()) as { strip: { id: string } };
  const fail = await fetch(`${base2}/strips/${stripj.strip.id}/transition`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${trj.token}`,
    },
    body: JSON.stringify({ to: "confirmed", version: 1 }),
  });
  assert.equal(fail.status, 502);
  s2.close();
});
