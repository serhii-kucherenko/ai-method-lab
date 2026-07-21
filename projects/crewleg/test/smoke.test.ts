import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("smoke API: legality split, illegal list, release, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_cl" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

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

  const sch = await api("POST", "/auth/register", undefined, {
    email: "sch@ex.com",
    password: "pw",
  });
  const legal = await api("POST", "/auth/register", undefined, {
    email: "legal@ex.com",
    password: "pw",
  });
  const token = String(sch.json.token);
  const carrier = (await api("POST", "/carriers", token, { name: "Sky" })).json.carrier as {
    id: string;
  };
  addMember(store.db, carrier.id, (legal.json.user as { id: string }).id, "legal");

  const ok = await api("POST", `/carriers/${carrier.id}/pairings`, token, {
    report_local: "0800",
    segments: 2,
    acclimated: true,
    fdp_hours: 13.5,
    rest_hours: 11,
  });
  assert.equal(ok.status, 201);
  assert.equal((ok.json.pairing as { legal: boolean }).legal, true);

  const bad = await api("POST", `/carriers/${carrier.id}/pairings`, token, {
    report_local: "0800",
    segments: 2,
    acclimated: true,
    fdp_hours: 14.1,
    rest_hours: 11,
  });
  assert.equal((bad.json.pairing as { legal: boolean }).legal, false);

  const page = await api("GET", `/carriers/${carrier.id}/illegal`, token);
  assert.equal(page.json.total, 1);

  const released = await api(
    "POST",
    `/pairings/${(ok.json.pairing as { id: string }).id}/transition`,
    String(legal.json.token),
    { to: "released", version: 1 },
  );
  assert.equal(released.status, 200);

  const blockIllegal = await api(
    "POST",
    `/pairings/${(bad.json.pairing as { id: string }).id}/transition`,
    String(legal.json.token),
    { to: "released", version: 1 },
  );
  assert.equal(blockIllegal.status, 400);

  const health = await api("GET", "/health");
  assert.ok(Number(health.json.migrations) >= 1);

  const raw = Buffer.from(JSON.stringify({ eventId: "e1" }));
  const sig = createHmac("sha256", "whsec_cl").update(raw).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: raw,
  });
  assert.equal(wh.status, 200);
  assert.equal(store.sideEffects >= 2, true);

  server.close();
});
