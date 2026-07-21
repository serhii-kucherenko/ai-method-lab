import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";
import { migrationCount } from "../src/db.js";

test("integrate: HMAC, idempotent webhook, publish dep mapping", async () => {
  const dep = createMockDep();
  const { server, store } = createApp({ dep, webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 3);

  async function api(
    method: string,
    path: string,
    token?: string,
    body?: unknown,
  ): Promise<{ status: number; json: Record<string, unknown> }> {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, unknown> };
  }

  const payload = JSON.stringify({ eventId: "evt-aw-1", kind: "partner.ack" });
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
  const firstBody = (await first.json()) as { duplicate: boolean; sideEffects: number };
  assert.equal(firstBody.duplicate, false);
  assert.equal(firstBody.sideEffects, 1);

  const second = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  const secondBody = (await second.json()) as { duplicate: boolean; sideEffects: number };
  assert.equal(second.status, 200);
  assert.equal(secondBody.duplicate, true);
  assert.equal(secondBody.sideEffects, 1);

  const cra = await api("POST", "/auth/register", undefined, {
    email: "int-cra@ex.com",
    password: "pw",
  });
  const sp = await api("POST", "/auth/register", undefined, {
    email: "int-sp@ex.com",
    password: "pw",
  });
  const study = (await api("POST", "/studies", String(cra.json.token), { name: "Int" })).json
    .study as { id: string };
  addMember(store.db, study.id, (sp.json.user as { id: string }).id, "sponsor");

  const pub = await api("POST", `/studies/${study.id}/versions`, String(sp.json.token), {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: { V1: { target_day: 7, before: 1, after: 1 } },
    },
  });
  assert.equal(pub.status, 201);
  server.close();

  const failDep = createMockDep({ failTimes: 1 });
  const { server: s2, store: st2 } = createApp({ dep: failDep });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const addr2 = s2.address();
  assert.ok(addr2 && typeof addr2 === "object");
  const base2 = `http://127.0.0.1:${addr2.port}`;

  const cra2 = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fail-cra@ex.com", password: "pw" }),
  });
  const cra2j = (await cra2.json()) as { token: string; user: { id: string } };
  const sp2 = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fail-sp@ex.com", password: "pw" }),
  });
  const sp2j = (await sp2.json()) as { token: string; user: { id: string } };
  const study2 = await fetch(`${base2}/studies`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${cra2j.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const study2j = (await study2.json()) as { study: { id: string } };
  addMember(st2.db, study2j.study.id, sp2j.user.id, "sponsor");

  const failPub = await fetch(`${base2}/studies/${study2j.study.id}/versions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${sp2j.token}`,
    },
    body: JSON.stringify({
      version: {
        id: "V1",
        effective_at: "2026-01-01",
        visits: { V1: { target_day: 7, before: 1, after: 1 } },
      },
    }),
  });
  assert.equal(failPub.status, 502);
  const failBody = (await failPub.json()) as { error: string };
  assert.equal(failBody.error, "dependency failed");
  s2.close();
});
