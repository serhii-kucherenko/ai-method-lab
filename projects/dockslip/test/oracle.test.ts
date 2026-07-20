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
      body: { email: "a@dockslip.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@dockslip.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/slips", {
          token: String(login.body.token),
          body: { title: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated slip routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/slips")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/slips", { body: { title: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own slips", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@dockslip.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/slips", {
      token,
      body: { title: "Boardharbor", body: "standup" },
    });
    assert.equal(created.status, 201);
    const slip = created.body.slip as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(slip.title, "Boardharbor");
    assert.equal(slip.status, "held");
    assert.equal(
      ((await req(baseUrl, "GET", "/slips", { token })).body.slips as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/slips/${slip.id}`, {
      token,
      body: { title: "Boardharbor-2", body: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.slip as { title: string; body: string };
    assert.equal(after.title, "Boardharbor-2");
    assert.equal(after.body, "updated");
    assert.equal(
      (await req(baseUrl, "DELETE", `/slips/${slip.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A slips", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@dockslip.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@dockslip.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/slips", {
          token: tokenA,
          body: { title: "Private" },
        })
      ).body.slip as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/slips", { token: tokenB })).body.slips as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/slips/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/slips/${id}`, {
          token: tokenB,
          body: { status: "docked" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/slips/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/slips/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
