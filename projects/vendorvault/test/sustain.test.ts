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

test("UI shell", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Vendorvault/);
  });
});

test("production path", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "path@vv.test", password: "x" },
      });
      const token = String(auth.body.token);
      const ws = await api(baseUrl, "POST", "/workspaces", {
        token,
        body: { name: "Path" },
      });
      const wsId = String((ws.body.workspace as { id: string }).id);
      const vendor = await api(baseUrl, "POST", `/workspaces/${wsId}/vendors`, {
        token,
        body: { name: "VendorCo" },
      });
      const vendorId = String((vendor.body.vendor as { id: string }).id);
      await api(baseUrl, "POST", `/vendors/${vendorId}/attest`, {
        token,
        body: { until: "2027-06-01" },
      });
      let cur = (
        await api(baseUrl, "POST", `/vendors/${vendorId}/findings`, {
          token,
          body: { title: "Access review", severity: "medium" },
        })
      ).body.finding as { id: string; version: number };
      cur = (
        await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
          token,
          body: {
            to: "remediated",
            version: cur.version,
            remediation_note: "Fixed IAM",
          },
        })
      ).body.finding as typeof cur;
      const done = await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
        token,
        body: { to: "accepted", version: cur.version },
      });
      assert.equal(done.status, 200);
      assert.equal((done.body.finding as { state: string }).state, "accepted");
    },
    { nowIso: "2026-07-20T12:00:00Z" },
  );
});
