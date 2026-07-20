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
      body: { email: "a@meetslot.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@meetslot.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/bookings", {
          token: String(login.body.token),
          body: { roomName: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated booking routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/bookings")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/bookings", { body: { roomName: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own bookings", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@meetslot.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/bookings", {
      token,
      body: { roomName: "Boardroom", note: "standup" },
    });
    assert.equal(created.status, 201);
    const booking = created.body.booking as {
      id: string;
      roomName: string;
      status: string;
    };
    assert.equal(booking.roomName, "Boardroom");
    assert.equal(booking.status, "held");
    assert.equal(
      ((await req(baseUrl, "GET", "/bookings", { token })).body.bookings as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/bookings/${booking.id}`, {
      token,
      body: { status: "confirmed", roomName: "Boardroom-2" },
    });
    assert.equal(updated.status, 200);
    assert.equal((updated.body.booking as { status: string }).status, "confirmed");
    assert.equal(
      (await req(baseUrl, "DELETE", `/bookings/${booking.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A bookings", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@meetslot.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@meetslot.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/bookings", {
          token: tokenA,
          body: { roomName: "Private" },
        })
      ).body.booking as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/bookings", { token: tokenB })).body.bookings as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/bookings/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/bookings/${id}`, {
          token: tokenB,
          body: { status: "confirmed" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/bookings/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/bookings/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
