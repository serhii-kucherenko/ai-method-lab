import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

type Json = Record<string, unknown>;

async function req(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let body: Json = {};
  if (res.status !== 204) body = (await res.json()) as Json;
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
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@example.com", password: "secret" },
    });
    assert.equal(login.status, 200);
    const mine = await req(baseUrl, "POST", "/statuses", {
      token: String(login.body.token),
      body: { title: "All systems go", body: "green" },
    });
    assert.equal(mine.status, 201);
  });
});

test("unauthenticated status routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/statuses")).status, 401);
    assert.equal(
      (
        await req(baseUrl, "POST", "/statuses", {
          body: { title: "x" },
        })
      ).status,
      401,
    );
  });
});

test("user can CRUD own statuses", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@example.com", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/statuses", {
      token,
      body: { title: "Degraded", body: "api latency" },
    });
    assert.equal(created.status, 201);
    const item = created.body.status as { id: string; title: string };
    assert.equal(item.title, "Degraded");

    const listed = await req(baseUrl, "GET", "/statuses", { token });
    assert.equal((listed.body.statuses as unknown[]).length, 1);

    const updated = await req(baseUrl, "PATCH", `/statuses/${item.id}`, {
      token,
      body: { title: "Recovered" },
    });
    assert.equal((updated.body.status as { title: string }).title, "Recovered");

    assert.equal(
      (await req(baseUrl, "DELETE", `/statuses/${item.id}`, { token })).status,
      204,
    );
    assert.equal(
      (
        (await req(baseUrl, "GET", "/statuses", { token })).body
          .statuses as unknown[]
      ).length,
      0,
    );
  });
});

test("user B cannot access user A statuses", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@example.com", password: "secret" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@example.com", password: "secret" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const created = await req(baseUrl, "POST", "/statuses", {
      token: tokenA,
      body: { title: "private", body: "secret" },
    });
    const id = (created.body.status as { id: string }).id;
    assert.equal(
      (
        (await req(baseUrl, "GET", "/statuses", { token: tokenB })).body
          .statuses as unknown[]
      ).length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/statuses/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/statuses/${id}`, {
          token: tokenB,
          body: { title: "hijack" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/statuses/${id}`, { token: tokenB })).status,
      404,
    );
  });
});
