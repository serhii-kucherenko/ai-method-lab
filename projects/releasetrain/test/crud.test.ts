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

test("train ACL: outsider forbidden; approver cannot create services", async () => {
  await withServer(async (baseUrl) => {
    const lead = await register(baseUrl, "lead@crud.releasetrain.test");
    const outsider = await register(baseUrl, "out@crud.releasetrain.test");
    const approver = await register(baseUrl, "ap@crud.releasetrain.test");
    const train = await api(baseUrl, "POST", "/trains", {
      token: lead.token,
      body: { name: "Train" },
    });
    const trainId = String((train.body.train as { id: string }).id);
    await api(baseUrl, "POST", `/trains/${trainId}/members`, {
      token: lead.token,
      body: { userId: approver.userId, role: "approver" },
    });
    assert.equal(
      (
        await api(baseUrl, "GET", `/trains/${trainId}/services`, {
          token: outsider.token,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/trains/${trainId}/services`, {
          token: approver.token,
          body: { name: "api-gateway" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/trains/${trainId}/services`, {
          token: lead.token,
          body: { name: "api-gateway" },
        })
      ).status,
      201,
    );
  });
});
