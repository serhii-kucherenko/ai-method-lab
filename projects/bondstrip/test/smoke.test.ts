import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("smoke API: accrue, exceptions, confirm, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_bs" });
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
  const tr = await api("POST", "/auth/register", undefined, {
    email: "tr@ex.com",
    password: "pw",
  });
  const token = String(an.json.token);
  const desk = (await api("POST", "/desks", token, { name: "FI" })).json.desk as { id: string };
  addMember(store.db, desk.id, (tr.json.user as { id: string }).id, "trader");

  const ok = await api("POST", `/desks/${desk.id}/strips`, token, {
    day_count: "30/360",
    face: 1000,
    coupon_rate: 0.06,
    freq: 2,
    prev_coupon: "2026-01-15",
    next_coupon: "2026-07-15",
    settle: "2026-04-15",
  });
  assert.equal(ok.status, 201);
  assert.equal((ok.json.strip as { ok: boolean }).ok, true);
  assert.equal((ok.json.strip as { accrued: number }).accrued, 15);

  const bad = await api("POST", `/desks/${desk.id}/strips`, token, {
    day_count: "ACT/360",
    face: 1000,
    coupon_rate: 0.06,
    freq: 2,
    prev_coupon: "2026-01-15",
    next_coupon: "2026-07-15",
    settle: "2026-04-15",
  });
  assert.equal((bad.json.strip as { ok: boolean }).ok, false);

  const page = await api("GET", `/desks/${desk.id}/exceptions`, token);
  assert.ok(Number(page.json.total) >= 1);

  const confirmed = await api(
    "POST",
    `/strips/${(ok.json.strip as { id: string }).id}/transition`,
    String(tr.json.token),
    { to: "confirmed", version: 1 },
  );
  assert.equal(confirmed.status, 200);

  const block = await api(
    "POST",
    `/strips/${(bad.json.strip as { id: string }).id}/transition`,
    String(tr.json.token),
    { to: "confirmed", version: 1 },
  );
  assert.equal(block.status, 400);

  const health = await api("GET", "/health");
  assert.equal(health.json.ok, true);
  assert.ok(Number(health.json.migrations) >= 2);

  const payload = JSON.stringify({ eventId: "evt-1" });
  const sig = createHmac("sha256", "whsec_bs").update(payload).digest("hex");
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
  const dupJson = (await dup.json()) as { duplicate: boolean };
  assert.equal(dupJson.duplicate, true);

  server.close();
});
