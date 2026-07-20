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
  return { status: res.status, body: (await res.json()) as Json };
}

async function register(baseUrl: string, email: string) {
  const res = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "x" },
  });
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

test("ACL: outsider forbidden; viewer cannot create vendors", async () => {
  await withServer(async (baseUrl) => {
    const owner = await register(baseUrl, "own@vv.test");
    const out = await register(baseUrl, "out@vv.test");
    const viewer = await register(baseUrl, "view@vv.test");
    const ws = await api(baseUrl, "POST", "/workspaces", {
      token: owner.token,
      body: { name: "W" },
    });
    const wsId = String((ws.body.workspace as { id: string }).id);
    await api(baseUrl, "POST", `/workspaces/${wsId}/members`, {
      token: owner.token,
      body: { userId: viewer.userId, role: "viewer" },
    });
    assert.equal(
      (
        await api(baseUrl, "GET", `/workspaces/${wsId}/vendors`, {
          token: out.token,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/workspaces/${wsId}/vendors`, {
          token: viewer.token,
          body: { name: "No" },
        })
      ).status,
      403,
    );
  });
});
