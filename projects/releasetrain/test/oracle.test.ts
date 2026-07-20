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

test("health is ok and migrations applied", async () => {
  await withServer(async (baseUrl, store) => {
    const health = await req(baseUrl, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.body.ok, true);
    assert.ok(migrationCount(store.db) >= 2);
  });
});

test("register + login work", async () => {
  await withServer(async (baseUrl) => {
    const registered = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@releasetrain.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@releasetrain.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.ok(login.body.token);
  });
});

test("unauthenticated train create rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal(
      (await req(baseUrl, "POST", "/trains", { body: { name: "x" } })).status,
      401,
    );
  });
});

test("lead can create a train", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "own@releasetrain.test", password: "secret" },
    });
    const train = await req(baseUrl, "POST", "/trains", {
      token: String(auth.body.token),
      body: { name: "Platform train" },
    });
    assert.equal(train.status, 201);
  });
});
