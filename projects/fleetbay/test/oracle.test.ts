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
      body: { email: "a@fleetbay.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@fleetbay.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/vehicles", {
          token: String(login.body.token),
          body: { title: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated vehicle routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/vehicles")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/vehicles", { body: { title: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own vehicles", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@fleetbay.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/vehicles", {
      token,
      body: { title: "Boarddepot", body: "standup" },
    });
    assert.equal(created.status, 201);
    const vehicle = created.body.vehicle as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(vehicle.title, "Boarddepot");
    assert.equal(vehicle.status, "staged");
    assert.equal(
      ((await req(baseUrl, "GET", "/vehicles", { token })).body.vehicles as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/vehicles/${vehicle.id}`, {
      token,
      body: { title: "Boarddepot-2", body: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.vehicle as { title: string; body: string };
    assert.equal(after.title, "Boarddepot-2");
    assert.equal(after.body, "updated");
    assert.equal(
      (await req(baseUrl, "DELETE", `/vehicles/${vehicle.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A vehicles", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@fleetbay.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@fleetbay.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/vehicles", {
          token: tokenA,
          body: { title: "Private" },
        })
      ).body.vehicle as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/vehicles", { token: tokenB })).body.vehicles as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/vehicles/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/vehicles/${id}`, {
          token: tokenB,
          body: { status: "rented" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/vehicles/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/vehicles/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
