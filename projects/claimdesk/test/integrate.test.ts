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
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

test("inbound webhook requires valid HMAC", async () => {
  await withServer(
    async (baseUrl) => {
      const payload = JSON.stringify({ event: "ping" });
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-signature": "nope",
            },
            body: payload,
          })
        ).status,
        401,
      );
      const sig = createHmac("sha256", "whsec_claim")
        .update(payload)
        .digest("hex");
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
    { webhookSecret: "whsec_claim" },
  );
});

test("settle notifies dependency", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "int@claimdesk.test", password: "secret" },
      });
      const token = String(auth.body.token);
      const desk = await api(baseUrl, "POST", "/desks", {
        token,
        body: { name: "I" },
      });
      const deskId = String((desk.body.desk as { id: string }).id);
      const policy = await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
        token,
        body: { number: "N", holder: "H" },
      });
      const policyId = String((policy.body.policy as { id: string }).id);
      let cur = (
        await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
          token,
          body: { title: "T" },
        })
      ).body.claim as { id: string; version: number };
      await api(baseUrl, "POST", `/claims/${cur.id}/reserve`, {
        token,
        body: { amount: 50 },
      });
      cur = (
        await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
          token,
          body: { to: "review", version: cur.version },
        })
      ).body.claim as typeof cur;
      await api(baseUrl, "POST", `/claims/${cur.id}/evidence`, {
        token,
        body: { label: "Photo" },
      });
      const settled = await api(
        baseUrl,
        "POST",
        `/claims/${cur.id}/transition`,
        { token, body: { to: "settled", version: cur.version, payout: 40 } },
      );
      assert.equal(settled.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);
    },
    { dep },
  );
});
