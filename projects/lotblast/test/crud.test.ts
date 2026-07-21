import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { migrationCount } from "../src/db.js";

test("crud: qa can read lots but cannot write CTE; migration 002 applied", async () => {
  const { server, store } = createApp();
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

  assert.ok(migrationCount(store.db) >= 2);

  const ops = await api("POST", "/auth/register", undefined, {
    email: "ops-crud@ex.com",
    password: "pw",
  });
  const qa = await api("POST", "/auth/register", undefined, {
    email: "qa-crud@ex.com",
    password: "pw",
  });
  const tokenOps = String(ops.json.token);
  const tokenQa = String(qa.json.token);
  const plant = (await api("POST", "/plants", tokenOps, { name: "CRUD Plant" })).json
    .plant as { id: string };
  addMember(store.db, plant.id, (qa.json.user as { id: string }).id, "qa");

  const loc = {
    business_name: "P",
    phone: "+1 555 0100",
    street_or_geo: "1 St",
    city: "X",
    region: "CA",
    postal_code: "90000",
    country: "",
  };
  const recvBody = {
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
  };

  const denied = await api("POST", `/plants/${plant.id}/receiving`, tokenQa, recvBody);
  assert.equal(denied.status, 403);

  const ok = await api("POST", `/plants/${plant.id}/receiving`, tokenOps, recvBody);
  assert.equal(ok.status, 201);

  const lots = await api("GET", `/plants/${plant.id}/lots`, tokenQa);
  assert.equal(lots.status, 200);
  assert.equal((lots.json.lots as unknown[]).length, 1);

  const recv = await api("GET", `/plants/${plant.id}/receiving`, tokenQa);
  assert.equal(recv.status, 200);
  assert.equal((recv.json.receiving as unknown[]).length, 1);

  server.close();
});
