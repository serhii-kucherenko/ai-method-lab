import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

const sampleBlocks = [
  { up_to_kwh: 100, rate: 0.1 },
  { up_to_kwh: 200, rate: 0.15 },
  { up_to_kwh: null, rate: 0.2 },
];

test("smoke: bill walk, exceptions, post, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_ts" });
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

  const an = await api("POST", "/auth/register", undefined, {
    email: "an@ex.com",
    password: "pw",
  });
  const po = await api("POST", "/auth/register", undefined, {
    email: "po@ex.com",
    password: "pw",
  });
  const token = String(an.json.token);
  const account = (await api("POST", "/accounts", token, { name: "Utility" })).json.account as {
    id: string;
  };
  addMember(store.db, account.id, (po.json.user as { id: string }).id, "poster");

  const ok = await api("POST", `/accounts/${account.id}/bills`, token, {
    total_kwh: 180,
    current_peak_kw: 12,
    prior_peak_kw: 10,
    ratchet_pct: 0.8,
    demand_rate: 9,
    blocks: sampleBlocks,
  });
  assert.equal(ok.status, 201);
  assert.equal((ok.json.bill as { ok: boolean }).ok, true);
  assert.equal((ok.json.bill as { total_charge: number }).total_charge, 130);

  const bad = await api("POST", `/accounts/${account.id}/bills`, token, {
    total_kwh: 100,
    current_peak_kw: 5,
    prior_peak_kw: 5,
    ratchet_pct: 1.2,
    demand_rate: 9,
    blocks: sampleBlocks,
  });
  assert.equal((bad.json.bill as { ok: boolean }).ok, false);

  const page = await api("GET", `/accounts/${account.id}/exceptions`, token);
  assert.ok(Number(page.json.total) >= 1);

  const posted = await api(
    "POST",
    `/bills/${(ok.json.bill as { id: string }).id}/transition`,
    String(po.json.token),
    { to: "posted", version: 1 },
  );
  assert.equal(posted.status, 200);

  const block = await api(
    "POST",
    `/bills/${(bad.json.bill as { id: string }).id}/transition`,
    String(po.json.token),
    { to: "posted", version: 1 },
  );
  assert.equal(block.status, 400);

  const health = await api("GET", "/health");
  assert.equal(health.json.ok, true);

  const payload = JSON.stringify({ eventId: "evt-1" });
  const sig = createHmac("sha256", "whsec_ts").update(payload).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(wh.status, 200);
  const dup = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(((await dup.json()) as { duplicate: boolean }).duplicate, true);

  server.close();
});
