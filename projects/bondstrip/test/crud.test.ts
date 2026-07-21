import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { migrationCount } from "../src/db.js";

test("crud: list strips; analyst cannot confirm; migration 002", async () => {
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

  const an = await api("POST", "/auth/register", undefined, {
    email: "crud@ex.com",
    password: "pw",
  });
  const token = String(an.json.token);
  const desk = (await api("POST", "/desks", token, { name: "Crud" })).json.desk as {
    id: string;
  };
  await api("POST", `/desks/${desk.id}/strips`, token, {
    day_count: "30/360",
    face: 1000,
    coupon_rate: 0.06,
    freq: 2,
    prev_coupon: "2026-01-15",
    next_coupon: "2026-07-15",
    settle: "2026-04-15",
  });
  const list = await api("GET", `/desks/${desk.id}/strips`, token);
  assert.equal(list.json.total, 1);
  const id = (list.json.strips as Array<{ id: string }>)[0]!.id;
  const denied = await api("POST", `/strips/${id}/transition`, token, {
    to: "confirmed",
    version: 1,
  });
  assert.equal(denied.status, 403);
  server.close();
});
