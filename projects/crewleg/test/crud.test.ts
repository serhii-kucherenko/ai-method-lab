import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { migrationCount } from "../src/db.js";

test("crud: list pairings; scheduler cannot release; migration 002", async () => {
  const { server, store } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 2);

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
    email: "crud-sch@ex.com",
    password: "pw",
  });
  const legal = await api("POST", "/auth/register", undefined, {
    email: "crud-legal@ex.com",
    password: "pw",
  });
  const token = String(sch.json.token);
  const carrier = (await api("POST", "/carriers", token, { name: "Crud" })).json.carrier as {
    id: string;
  };
  addMember(store.db, carrier.id, (legal.json.user as { id: string }).id, "legal");

  await api("POST", `/carriers/${carrier.id}/pairings`, token, {
    report_local: "0800",
    segments: 2,
    acclimated: true,
    fdp_hours: 12,
    rest_hours: 11,
  });
  const list = await api("GET", `/carriers/${carrier.id}/pairings?limit=10`, token);
  assert.equal(list.status, 200);
  assert.equal(list.json.total, 1);

  const pairing = (list.json.pairings as Array<{ id: string }>)[0]!;
  const denied = await api("POST", `/pairings/${pairing.id}/transition`, token, {
    to: "released",
    version: 1,
  });
  assert.equal(denied.status, 403);
  server.close();
});
