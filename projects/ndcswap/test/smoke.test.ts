import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("smoke API: TE split, blocked list, dispense, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_ns" });
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

  const rph = await api("POST", "/auth/register", undefined, {
    email: "rph@ex.com",
    password: "pw",
  });
  const mgr = await api("POST", "/auth/register", undefined, {
    email: "mgr@ex.com",
    password: "pw",
  });
  const token = String(rph.json.token);
  const pharmacy = (await api("POST", "/pharmacies", token, { name: "Rx" })).json.pharmacy as {
    id: string;
  };
  addMember(store.db, pharmacy.id, (mgr.json.user as { id: string }).id, "rph_manager");

  const ok = await api("POST", `/pharmacies/${pharmacy.id}/scripts`, token, {
    prescribed_ndc: "00093012301",
    candidate_ndc: "00173045601",
    te_code_prescribed: "AB",
    te_code_candidate: "AB",
    same_ingredient_strength_form: true,
    daw: 0,
    brand_medically_necessary: false,
  });
  assert.equal(ok.status, 201);
  assert.equal((ok.json.script as { allow: boolean }).allow, true);

  const bad = await api("POST", `/pharmacies/${pharmacy.id}/scripts`, token, {
    prescribed_ndc: "00093012301",
    candidate_ndc: "00173045601",
    te_code_prescribed: "AB1",
    te_code_candidate: "AB2",
    same_ingredient_strength_form: true,
    daw: 0,
    brand_medically_necessary: false,
  });
  assert.equal((bad.json.script as { allow: boolean }).allow, false);

  const page = await api("GET", `/pharmacies/${pharmacy.id}/blocked`, token);
  assert.equal(page.json.total, 1);

  const dispensed = await api(
    "POST",
    `/scripts/${(ok.json.script as { id: string }).id}/transition`,
    String(mgr.json.token),
    { to: "dispensed", version: 1 },
  );
  assert.equal(dispensed.status, 200);

  const block = await api(
    "POST",
    `/scripts/${(bad.json.script as { id: string }).id}/transition`,
    String(mgr.json.token),
    { to: "dispensed", version: 1 },
  );
  assert.equal(block.status, 400);

  const health = await api("GET", "/health");
  assert.ok(Number(health.json.migrations) >= 1);

  const raw = Buffer.from(JSON.stringify({ eventId: "e1" }));
  const sig = createHmac("sha256", "whsec_ns").update(raw).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: raw,
  });
  assert.equal(wh.status, 200);
  assert.equal(store.sideEffects >= 2, true);
  server.close();
});
