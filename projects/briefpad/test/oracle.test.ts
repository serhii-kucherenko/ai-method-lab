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
      body: { email: "a@briefpad.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@briefpad.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(
      (
        await req(baseUrl, "POST", "/notes", {
          token: String(login.body.token),
          body: { title: "A" },
        })
      ).status,
      201,
    );
  });
});

test("unauthenticated note routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/notes")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/notes", { body: { title: "x" } })).status,
      401,
    );
  });
});

test("user can CRUD own notes", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@briefpad.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const created = await req(baseUrl, "POST", "/notes", {
      token,
      body: { title: "Boardpad", note: "standup" },
    });
    assert.equal(created.status, 201);
    const note = created.body.note as {
      id: string;
      title: string;
      status: string;
    };
    assert.equal(note.title, "Boardpad");
    assert.equal(note.status, "draft");
    assert.equal(
      ((await req(baseUrl, "GET", "/notes", { token })).body.notes as unknown[])
        .length,
      1,
    );
    const updated = await req(baseUrl, "PATCH", `/notes/${note.id}`, {
      token,
      body: { title: "Boardpad-2", note: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.note as { title: string; note: string };
    assert.equal(after.title, "Boardpad-2");
    assert.equal(after.note, "updated");
    assert.equal(
      (await req(baseUrl, "DELETE", `/notes/${note.id}`, { token })).status,
      204,
    );
  });
});

test("user B cannot access user A notes", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@briefpad.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@briefpad.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);
    const id = (
      (
        await req(baseUrl, "POST", "/notes", {
          token: tokenA,
          body: { title: "Private" },
        })
      ).body.note as { id: string }
    ).id;
    assert.equal(
      ((await req(baseUrl, "GET", "/notes", { token: tokenB })).body.notes as unknown[])
        .length,
      0,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/notes/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/notes/${id}`, {
          token: tokenB,
          body: { status: "published" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/notes/${id}`, { token: tokenB })).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "GET", `/notes/${id}`, { token: tokenA })).status,
      200,
    );
  });
});
