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
): Promise<{ status: number; body: Json }> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const body = res.status === 204 ? {} : ((await res.json()) as Json);
  return { status: res.status, body };
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
      body: { email: "a@kitcheck.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    assert.equal(typeof registered.body.token, "string");

    const login = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "a@kitcheck.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    assert.equal(typeof login.body.token, "string");

    const mine = await req(baseUrl, "POST", "/loans", {
      token: String(login.body.token),
      body: { itemName: "from login" },
    });
    assert.equal(mine.status, 201);
  });
});

test("unauthenticated loan routes are rejected", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await req(baseUrl, "GET", "/loans")).status, 401);
    assert.equal(
      (await req(baseUrl, "POST", "/loans", { body: { itemName: "nope" } })).status,
      401,
    );
  });
});

test("user can CRUD own loans", async () => {
  await withServer(async (baseUrl) => {
    const auth = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "owner@kitcheck.test", password: "secret" },
    });
    const token = String(auth.body.token);

    const created = await req(baseUrl, "POST", "/loans", {
      token,
      body: { itemName: "DSLRkit", note: "weekend shoot" },
    });
    assert.equal(created.status, 201);
    const loan = created.body.loan as {
      id: string;
      itemName: string;
      status: string;
    };
    assert.equal(loan.itemName, "DSLRkit");
    assert.equal(loan.status, "requested");

    const listed = await req(baseUrl, "GET", "/loans", { token });
    assert.equal(listed.status, 200);
    assert.equal((listed.body.loans as unknown[]).length, 1);

    const updated = await req(baseUrl, "PATCH", `/loans/${loan.id}`, {
      token,
      body: { itemName: "DSLRkit-pro", note: "updated" },
    });
    assert.equal(updated.status, 200);
    const after = updated.body.loan as { itemName: string; note: string };
    assert.equal(after.itemName, "DSLRkit-pro");
    assert.equal(after.note, "updated");

    assert.equal((await req(baseUrl, "DELETE", `/loans/${loan.id}`, { token })).status, 204);
    assert.equal(
      ((await req(baseUrl, "GET", "/loans", { token })).body.loans as unknown[]).length,
      0,
    );
  });
});

test("user B cannot access user A loans", async () => {
  await withServer(async (baseUrl) => {
    const a = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "a@kitcheck.test", password: "a" },
    });
    const b = await req(baseUrl, "POST", "/auth/register", {
      body: { email: "b@kitcheck.test", password: "b" },
    });
    const tokenA = String(a.body.token);
    const tokenB = String(b.body.token);

    const created = await req(baseUrl, "POST", "/loans", {
      token: tokenA,
      body: { itemName: "private-kit" },
    });
    const loanId = (created.body.loan as { id: string }).id;

    assert.equal(
      ((await req(baseUrl, "GET", "/loans", { token: tokenB })).body.loans as unknown[])
        .length,
      0,
    );
    assert.equal((await req(baseUrl, "GET", `/loans/${loanId}`, { token: tokenB })).status, 404);
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/loans/${loanId}`, {
          token: tokenB,
          body: { status: "closed" },
        })
      ).status,
      404,
    );
    assert.equal(
      (await req(baseUrl, "DELETE", `/loans/${loanId}`, { token: tokenB })).status,
      404,
    );
    assert.equal((await req(baseUrl, "GET", `/loans/${loanId}`, { token: tokenA })).status, 200);
  });
});
