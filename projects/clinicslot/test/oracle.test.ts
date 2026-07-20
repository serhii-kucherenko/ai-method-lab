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
      body: { email: "a@clinicslot.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@clinicslot.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/appointments", {
          token: String(login.body.token),
          body: { title: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated appointment routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/appointments")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/appointments", { body: { title: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own appointments", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@clinicslot.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/appointments", {
      token,
      body: { title: "Boardclinic", body: "standup" },
    });
    assert.equal(created.status, 201);
    const appointment = created.body.appointment as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(appointment.title, "Boardclinic");
    assert.equal(appointment.status, "booked");
    assert.equal(
      ((await req(baseUrl, "GET", "/appointments", { token })).body.appointments as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/appointments/${appointment.id}`, {
      token,
      body: { title: "Boardclinic-2", body: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.appointment as { title: string; body: string };
    assert.equal(after.title, "Boardclinic-2");
    assert.equal(after.body, "updated");
    assert.equal(
      (await req(baseUrl, "DELETE", `/appointments/${appointment.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A appointments", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@clinicslot.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@clinicslot.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/appointments", {
          token: tokenA,
          body: { title: "Private" },
        })
      ).body.appointment as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/appointments", { token: tokenB })).body.appointments as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/appointments/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/appointments/${id}`, {
          token: tokenB,
          body: { status: "checked_in" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/appointments/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/appointments/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
