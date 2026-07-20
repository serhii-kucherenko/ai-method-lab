import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

type Json = Record<string, unknown>;

async function api(
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

async function register(baseUrl: string, email: string) {
  const res = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "secret" },
  });
  assert.equal(res.status, 201);
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

test("desk ACL: outsider forbidden; claimant cannot create policies", async () => {
  await withServer(async (baseUrl) => {
    const supervisor = await register(baseUrl, "sup@crud.claimdesk.test");
    const outsider = await register(baseUrl, "out@crud.claimdesk.test");
    const claimant = await register(baseUrl, "cl@crud.claimdesk.test");
    const desk = await api(baseUrl, "POST", "/desks", {
      token: supervisor.token,
      body: { name: "Desk" },
    });
    const deskId = String((desk.body.desk as { id: string }).id);
    await api(baseUrl, "POST", `/desks/${deskId}/members`, {
      token: supervisor.token,
      body: { userId: claimant.userId, role: "claimant" },
    });
    assert.equal(
      (
        await api(baseUrl, "GET", `/desks/${deskId}/policies`, {
          token: outsider.token,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
          token: claimant.token,
          body: { number: "P-1", holder: "A" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
          token: supervisor.token,
          body: { number: "P-1", holder: "A" },
        })
      ).status,
      201,
    );
  });
});
