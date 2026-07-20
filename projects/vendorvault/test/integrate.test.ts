import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";

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

test("HMAC inbound", async () => {
  await withServer(
    async (baseUrl) => {
      const payload = JSON.stringify({ event: "ping" });
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: { "content-type": "application/json", "x-signature": "x" },
            body: payload,
          })
        ).status,
        401,
      );
      const sig = createHmac("sha256", "whsec_vv").update(payload).digest("hex");
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-signature": sig,
            },
            body: payload,
          })
        ).status,
        200,
      );
    },
    { webhookSecret: "whsec_vv" },
  );
});

test("accept notifies dep", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "int@vv.test", password: "x" },
      });
      const token = String(auth.body.token);
      const ws = await api(baseUrl, "POST", "/workspaces", {
        token,
        body: { name: "I" },
      });
      const wsId = String((ws.body.workspace as { id: string }).id);
      const vendor = await api(baseUrl, "POST", `/workspaces/${wsId}/vendors`, {
        token,
        body: { name: "V" },
      });
      const vendorId = String((vendor.body.vendor as { id: string }).id);
      await api(baseUrl, "POST", `/vendors/${vendorId}/attest`, {
        token,
        body: { until: "2027-01-01" },
      });
      let cur = (
        await api(baseUrl, "POST", `/vendors/${vendorId}/findings`, {
          token,
          body: { title: "T", severity: "low" },
        })
      ).body.finding as { id: string; version: number };
      cur = (
        await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
          token,
          body: {
            to: "remediated",
            version: cur.version,
            remediation_note: "ok",
          },
        })
      ).body.finding as typeof cur;
      const done = await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
        token,
        body: { to: "accepted", version: cur.version },
      });
      assert.equal(done.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);
    },
    { dep, nowIso: "2026-07-20T12:00:00Z" },
  );
});
