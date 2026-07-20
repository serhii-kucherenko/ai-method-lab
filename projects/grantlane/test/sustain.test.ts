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
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

test("UI shell is served", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Grantlane/);
    assert.match(html, /app\.js/);
  });
});

test("production path: program → application → sign-off → activate → pay → close", async () => {
  await withServer(async (baseUrl) => {
    const admin = await register(baseUrl, "path@grantlane.test");
    const rev1 = await register(baseUrl, "path-rev1@grantlane.test");
    const rev2 = await register(baseUrl, "path-rev2@grantlane.test");
    const program = await api(baseUrl, "POST", "/programs", {
      token: admin.token,
      body: { name: "Path program" },
    });
    const programId = String((program.body.program as { id: string }).id);
    for (const member of [
      { userId: rev1.userId, role: "reviewer" },
      { userId: rev2.userId, role: "reviewer" },
    ]) {
      await api(baseUrl, "POST", `/programs/${programId}/members`, {
        token: admin.token,
        body: member,
      });
    }
    let cur = (
      await api(baseUrl, "POST", `/programs/${programId}/applications`, {
        token: admin.token,
        body: { orgName: "Green Valley NPO", amountRequested: 12000 },
      })
    ).body.application as { id: string; state: string; version: number };
    assert.equal(cur.state, "submitted");
    await api(baseUrl, "POST", `/applications/${cur.id}/sign-off`, {
      token: rev1.token,
    });
    await api(baseUrl, "POST", `/applications/${cur.id}/sign-off`, {
      token: rev2.token,
    });
    cur = (
      await api(baseUrl, "POST", `/applications/${cur.id}/activate`, {
        token: admin.token,
        body: { approvedAmount: 10000, version: cur.version },
      })
    ).body.application as typeof cur;
    assert.equal(cur.state, "active");
    const m = await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
      token: admin.token,
      body: { label: "Q1 disbursement", amount: 4000 },
    });
    const milestoneId = String((m.body.milestone as { id: string }).id);
    await api(baseUrl, "POST", `/milestones/${milestoneId}/pay`, {
      token: admin.token,
    });
    const done = await api(baseUrl, "POST", `/applications/${cur.id}/close`, {
      token: admin.token,
      body: { version: cur.version },
    });
    assert.equal(done.status, 200);
    assert.equal((done.body.application as { state: string }).state, "closed");
  });
});
