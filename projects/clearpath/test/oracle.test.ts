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

    const mine = await req(baseUrl, "POST", "/requests", {
      token: String(login.body.token),
      body: { title: "from login", body: "please review" },
    });
    assert.equal(mine.status, 201);
  });
});

test("unauthenticated request routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    const list = await req(baseUrl, "GET", "/requests");
    assert.equal(list.status, 401);

    const create = await req(baseUrl, "POST", "/requests", {
      body: { title: "nope" },
    });
    assert.equal(create.status, 401);
  });
});

test("user can CRUD own requests", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@example.com", password: "secret" },
    });
    const token = String(auth.body.token);

    const created = await req(baseUrl, "POST", "/requests", {
      token,
      body: { title: "expense", body: "team lunch" },
    });
    assert.equal(created.status, 201);
    const item = created.body.request as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(item.title, "expense");
    assert.equal(item.status, "draft");

    const listed = await req(baseUrl, "GET", "/requests", { token });
    assert.equal(listed.status, 200);
    assert.equal((listed.body.requests as unknown[]).length, 1);

    const updated = await req(baseUrl, "PATCH", `/requests/${item.id}`, {
      token,
      body: { title: "expense v2", body: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.request as { title: string; body: string };
    assert.equal(after.title, "expense v2");
    assert.equal(after.body, "updated");

    const deleted = await req(baseUrl, "DELETE", `/requests/${item.id}`, {
      token,
    });
    assert.equal(deleted.status, 204);
    const empty = await req(baseUrl, "GET", "/requests", { token });
    assert.equal((empty.body.requests as unknown[]).length, 0);
  });
});

test("user B cannot access user A requests", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@example.com", password: "secret" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@example.com", password: "secret" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);

    const created = await req(baseUrl, "POST", "/requests", {
      token: tokenA,
      body: { title: "private", body: "secret ask" },
    });
    const requestId = (created.body.request as { id: string }).id;

    assert.equal(
      (
        (await req(baseUrl, "GET", "/requests", { token: tokenB })).body
          .requests as unknown[]
      ).length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/requests/${requestId}`, { token: tokenB }))
        .status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/requests/${requestId}`, {
          token: tokenB,
          body: { title: "hijack" },
        })
      ).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "DELETE", `/requests/${requestId}`, {
          token: tokenB,
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/requests/${requestId}`, { token: tokenA }))
        .status,
      200,
    );
  });
});
