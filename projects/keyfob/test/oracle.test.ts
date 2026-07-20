import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";
import { migrationCount } from "../src/db.js";

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
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

test("health is ok and migration applied", async () => {
  await withServer(async (baseUrl, store) => {
    const health = await req(baseUrl, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.body.ok, true);
    assert.ok(migrationCount(store.db) >= 1);
  });
});

test("register + login produce usable credentials", async () => {
  await withServer(async (baseUrl) => {
    const registered = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@keyfob.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@keyfob.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/fobs", {
          token: String(login.body.token),
          body: { title: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated fob routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/fobs")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/fobs", { body: { title: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own fobs", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@keyfob.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/fobs", {
      token,
      body: { title: "Boardbuilding", body: "standup" },
    });
    assert.equal(created.status, 201);
    const fob = created.body.fob as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(fob.title, "Boardbuilding");
    assert.equal(fob.status, "issued");
    assert.equal(
      ((await req(baseUrl, "GET", "/fobs", { token })).body.fobs as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/fobs/${fob.id}`, {
      token,
      body: { title: "Boardbuilding-2", body: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.fob as { title: string; body: string };
    assert.equal(after.title, "Boardbuilding-2");
    assert.equal(after.body, "updated");
    assert.equal(
      (await req(baseUrl, "DELETE", `/fobs/${fob.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A fobs", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@keyfob.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@keyfob.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/fobs", {
          token: tokenA,
          body: { title: "Private" },
        })
      ).body.fob as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/fobs", { token: tokenB })).body.fobs as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/fobs/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/fobs/${id}`, {
          token: tokenB,
          body: { status: "active" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/fobs/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/fobs/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
