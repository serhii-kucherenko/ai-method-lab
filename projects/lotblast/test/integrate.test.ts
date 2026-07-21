import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";
import { migrationCount } from "../src/db.js";

test("integrate: HMAC, idempotent webhook, partner notify dep mapping", async () => {
  const dep = createMockDep();
  const { server, store } = createApp({ dep, webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 4);

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

  const payload = JSON.stringify({ eventId: "evt-1", kind: "partner.ack" });
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

  const reg = await api("POST", "/auth/register", undefined, {
    email: "int@ex.com",
    password: "pw",
  });
  const token = String(reg.json.token);
  const userId = (reg.json.user as { id: string }).id;
  const plant = (await api("POST", "/plants", token, { name: "Int" })).json.plant as {
    id: string;
  };
  addMember(store.db, plant.id, userId, "recall_admin");

  const loc = {
    business_name: "P",
    phone: "+1 555 0100",
    street_or_geo: "1 St",
    city: "X",
    region: "CA",
    postal_code: "90000",
    country: "",
  };
  await api("POST", `/plants/${plant.id}/receiving`, token, {
    tlc: "ING-1",
    qty: 10,
    uom: "kg",
    kind: "ingredient",
    product: { product_name: "Base", packaging_size: "1" },
    previous_source: loc,
    received_at: loc,
    event_date: "2026-06-01",
    tlc_source: { kind: "reference", reference: "https://x/ING-1" },
    reference_documents: [{ type: "BOL", number: "1" }],
  });
  await api("POST", `/plants/${plant.id}/transformations`, token, {
    inputs: [{ tlc: "ING-1", qty: 5 }],
    output: {
      tlc: "FG-1",
      qty: 8,
      uom: "cases",
      kind: "finished",
      product: { product_name: "FG", packaging_size: "case" },
    },
    transformed_at: loc,
    tlc_source: { kind: "reference", reference: "https://x/FG-1" },
    event_date: "2026-06-02",
    reference_documents: [{ type: "WO", number: "1" }],
  });
  await api("POST", `/plants/${plant.id}/shipments`, token, {
    id: "S-1",
    tlc: "FG-1",
    qty: 8,
    uom: "cases",
    product: { product_name: "FG", packaging_size: "case" },
    subsequent_recipient: { ...loc, business_name: "Retail Co" },
    shipped_from: loc,
    event_date: "2026-06-03",
    tlc_source: { kind: "reference", reference: "https://x/FG-1" },
    reference_documents: [{ type: "BOL", number: "S1" }],
  });

  const opened = await api("POST", `/plants/${plant.id}/recalls`, token, {
    suspect_tlc: "ING-1",
  });
  const recall = opened.json.recall as { id: string; version: number };
  await api("POST", `/recalls/${recall.id}/transition`, token, {
    to: "locked",
    version: recall.version,
  });

  const notified = await api("POST", `/recalls/${recall.id}/notify-partners`, token);
  assert.equal(notified.status, 200);
  assert.deepEqual(notified.json.delivered, ["Retail Co"]);

  server.close();

  const failDep = createMockDep({ failPartnerTimes: 1 });
  const { server: s2, store: st2 } = createApp({ dep: failDep });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const addr2 = s2.address();
  assert.ok(addr2 && typeof addr2 === "object");
  const base2 = `http://127.0.0.1:${addr2.port}`;

  const reg2 = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fail@ex.com", password: "pw" }),
  });
  const reg2j = (await reg2.json()) as { token: string; user: { id: string } };
  const plant2 = await fetch(`${base2}/plants`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const plant2j = (await plant2.json()) as { plant: { id: string } };
  addMember(st2.db, plant2j.plant.id, reg2j.user.id, "recall_admin");

  await fetch(`${base2}/plants/${plant2j.plant.id}/receiving`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({
      tlc: "ING-1",
      qty: 10,
      uom: "kg",
      kind: "ingredient",
      product: { product_name: "Base", packaging_size: "1" },
      previous_source: loc,
      received_at: loc,
      event_date: "2026-06-01",
      tlc_source: { kind: "reference", reference: "https://x/ING-1" },
      reference_documents: [{ type: "BOL", number: "1" }],
    }),
  });
  await fetch(`${base2}/plants/${plant2j.plant.id}/transformations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({
      inputs: [{ tlc: "ING-1", qty: 5 }],
      output: {
        tlc: "FG-1",
        qty: 8,
        uom: "cases",
        kind: "finished",
        product: { product_name: "FG", packaging_size: "case" },
      },
      transformed_at: loc,
      tlc_source: { kind: "reference", reference: "https://x/FG-1" },
      event_date: "2026-06-02",
      reference_documents: [{ type: "WO", number: "1" }],
    }),
  });
  await fetch(`${base2}/plants/${plant2j.plant.id}/shipments`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({
      id: "S-1",
      tlc: "FG-1",
      qty: 8,
      uom: "cases",
      product: { product_name: "FG", packaging_size: "case" },
      subsequent_recipient: { ...loc, business_name: "Retail Co" },
      shipped_from: loc,
      event_date: "2026-06-03",
      tlc_source: { kind: "reference", reference: "https://x/FG-1" },
      reference_documents: [{ type: "BOL", number: "S1" }],
    }),
  });
  const opened2 = await fetch(`${base2}/plants/${plant2j.plant.id}/recalls`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({ suspect_tlc: "ING-1" }),
  });
  const opened2j = (await opened2.json()) as { recall: { id: string; version: number } };
  await fetch(`${base2}/recalls/${opened2j.recall.id}/transition`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
    body: JSON.stringify({ to: "locked", version: opened2j.recall.version }),
  });
  const failNotify = await fetch(`${base2}/recalls/${opened2j.recall.id}/notify-partners`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${reg2j.token}`,
    },
  });
  assert.equal(failNotify.status, 502);
  const failBody = (await failNotify.json()) as { error: string };
  assert.equal(failBody.error, "dependency failed");
  s2.close();
});
