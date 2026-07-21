import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";

test("integrate: HMAC, idempotent webhook, release dep mapping", async () => {
  const dep = createMockDep();
  const { server, store } = createApp({ dep, webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const payload = JSON.stringify({ eventId: "evt-cl-1" });
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
  const secondBody = (await second.json()) as { duplicate: boolean; sideEffects: number };
  assert.equal(secondBody.duplicate, true);
  assert.equal(secondBody.sideEffects, 1);
  server.close();

  const failDep = createMockDep({ failTimes: 1 });
  const { server: s2, store: st2 } = createApp({ dep: failDep });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const addr2 = s2.address();
  assert.ok(addr2 && typeof addr2 === "object");
  const base2 = `http://127.0.0.1:${addr2.port}`;

  const sch = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fsch@ex.com", password: "pw" }),
  });
  const schj = (await sch.json()) as { token: string; user: { id: string } };
  const legal = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "flegal@ex.com", password: "pw" }),
  });
  const legalj = (await legal.json()) as { token: string; user: { id: string } };
  const car = await fetch(`${base2}/carriers`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${schj.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const carj = (await car.json()) as { carrier: { id: string } };
  addMember(st2.db, carj.carrier.id, legalj.user.id, "legal");
  const pairing = await fetch(`${base2}/carriers/${carj.carrier.id}/pairings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${schj.token}`,
    },
    body: JSON.stringify({
      report_local: "0800",
      segments: 2,
      acclimated: true,
      fdp_hours: 12,
      rest_hours: 11,
    }),
  });
  const pairingj = (await pairing.json()) as { pairing: { id: string } };
  const failRel = await fetch(`${base2}/pairings/${pairingj.pairing.id}/transition`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${legalj.token}`,
    },
    body: JSON.stringify({ to: "released", version: 1 }),
  });
  assert.equal(failRel.status, 502);
  s2.close();
});
