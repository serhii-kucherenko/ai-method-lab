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
    body: (await res.json()) as Json,
  };
}

test("health ok", async () => {
  await withServer(async (baseUrl, store) => {
    const h = await req(baseUrl, "GET", "/health");
    assert.equal(h.status, 200);
    assert.ok(migrationCount(store.db) >= 2);
  });
});

test("auth works", async () => {
  await withServer(async (baseUrl) => {
    const r = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@vendorvault.test", password: "x" },
    });
    assert.equal(r.status, 201);
  });
});

test("unauth workspace rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal(
      (await req(baseUrl, "POST", "/workspaces", { body: { name: "x" } })).status,
      401,
    );
  });
});

test("owner creates workspace", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "o@vendorvault.test", password: "x" },
    });
    const ws = await req(baseUrl, "POST", "/workspaces", {
      token: String(auth.body.token),
      body: { name: "Risk" },
    });
    assert.equal(ws.status, 201);
  });
});
