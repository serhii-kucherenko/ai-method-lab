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

test("program ACL: outsider forbidden; reviewer cannot create applications", async () => {
  await withServer(async (baseUrl) => {
    const admin = await register(baseUrl, "admin@crud.grantlane.test");
    const outsider = await register(baseUrl, "out@crud.grantlane.test");
    const reviewer = await register(baseUrl, "rev@crud.grantlane.test");
    const program = await api(baseUrl, "POST", "/programs", {
      token: admin.token,
      body: { name: "Youth fund" },
    });
    const programId = String((program.body.program as { id: string }).id);
    await api(baseUrl, "POST", `/programs/${programId}/members`, {
      token: admin.token,
      body: { userId: reviewer.userId, role: "reviewer" },
    });
    assert.equal(
      (
        await api(baseUrl, "GET", `/programs/${programId}/applications`, {
          token: outsider.token,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/programs/${programId}/applications`, {
          token: reviewer.token,
          body: { orgName: "Acme", amountRequested: 1000 },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/programs/${programId}/applications`, {
          token: admin.token,
          body: { orgName: "Acme", amountRequested: 1000 },
        })
      ).status,
      201,
    );
  });
});

test("officer cannot sign off for activation", async () => {
  await withServer(async (baseUrl) => {
    const admin = await register(baseUrl, "officer-sign@grantlane.test");
    const officer = await register(baseUrl, "off2@grantlane.test");
    const program = await api(baseUrl, "POST", "/programs", {
      token: admin.token,
      body: { name: "Ops" },
    });
    const programId = String((program.body.program as { id: string }).id);
    await api(baseUrl, "POST", `/programs/${programId}/members`, {
      token: admin.token,
      body: { userId: officer.userId, role: "officer" },
    });
    const app = await api(baseUrl, "POST", `/programs/${programId}/applications`, {
      token: admin.token,
      body: { orgName: "NPO", amountRequested: 5000 },
    });
    const applicationId = String((app.body.application as { id: string }).id);
    assert.equal(
      (
        await api(baseUrl, "POST", `/applications/${applicationId}/sign-off`, {
          token: officer.token,
        })
      ).status,
      403,
    );
  });
});
