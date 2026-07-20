import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

type Json = Record<string, unknown>;

async function req(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json } = {},
): Promise<{ status: number; body: Json }> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let body: Json = {};
  if (res.status !== 204) {
    body = (await res.json()) as Json;
  }
  return { status: res.status, body };
}

test("health is ok", async () => {
  await withServer(async (baseUrl) => {
    const health = await req(baseUrl, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.body.ok, true);
  });
});

test("register + login produce usable credentials", async () => {
  await withServer(async (baseUrl) => {
    const registered = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@example.com", password: "secret" },
    });
    assert.equal(registered.status, 201);
    assert.equal(typeof registered.body.token, "string");

    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@example.com", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(typeof login.body.token, "string");

    const mine = await req(baseUrl, "POST", "/entries", {
      token: String(login.body.token),
      body: { memo: "coffee", amount: -4.5 },
    });
    assert.equal(mine.status, 201);
  });
});

test("unauthenticated entry routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/entries")).status, 401);
    assert.equal(
      (
        await req(baseUrl, "POST", "/entries", {
          body: { memo: "x", amount: 1 },
        })
      ).status,
      401,
    );
  });
});

test("user can CRUD own entries", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@example.com", password: "secret" },
    });
    const token = String(auth.body.token);

    const created = await req(baseUrl, "POST", "/entries", {
      token,
      body: { memo: "paycheck", amount: 1000 },
    });
    assert.equal(created.status, 201);
    const item = created.body.entry as { id: string; memo: string; amount: number };
    assert.equal(item.memo, "paycheck");
    assert.equal(item.amount, 1000);

    const listed = await req(baseUrl, "GET", "/entries", { token });
    assert.equal(listed.status, 200);
    assert.equal((listed.body.entries as unknown[]).length, 1);

    const updated = await req(baseUrl, "PATCH", `/entries/${item.id}`, {
      token,
      body: { memo: "paycheck v2", amount: 1100 },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.entry as { memo: string; amount: number };
    assert.equal(after.memo, "paycheck v2");
    assert.equal(after.amount, 1100);

    const deleted = await req(baseUrl, "DELETE", `/entries/${item.id}`, { token });
    assert.equal(deleted.status, 204);
    const empty = await req(baseUrl, "GET", "/entries", { token });
    assert.equal((empty.body.entries as unknown[]).length, 0);
  });
});

test("user B cannot access user A entries", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@example.com", password: "secret" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@example.com", password: "secret" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);

    const created = await req(baseUrl, "POST", "/entries", {
      token: tokenA,
      body: { memo: "private", amount: -20 },
    });
    const entryId = (created.body.entry as { id: string }).id;

    assert.equal(
      ((await req(baseUrl, "GET", "/entries", { token: tokenB })).body.entries as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/entries/${entryId}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/entries/${entryId}`, {
          token: tokenB,
          body: { memo: "hijack" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/entries/${entryId}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/entries/${entryId}`, { token: tokenA })).status,
      200,
    );
  });
});
