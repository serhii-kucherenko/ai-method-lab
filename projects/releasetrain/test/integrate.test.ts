import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";

type Json = Record<string, unknown>;

type Release = { id: string; versionNum: number; state: string };

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
      const sig = createHmac("sha256", "whsec_rt")
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
    { webhookSecret: "whsec_rt" },
  );
});

test("prod and rollback notify dependency", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "int@releasetrain.test", password: "secret" },
      });
      const leadToken = String(auth.body.token);
      const leadId = String((auth.body.user as { id: string }).id);

      const ap1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "ap1@releasetrain.test", password: "secret" },
      });
      const ap2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "ap2@releasetrain.test", password: "secret" },
      });

      const train = await api(baseUrl, "POST", "/trains", {
        token: leadToken,
        body: { name: "Notify train" },
      });
      const trainId = String((train.body.train as { id: string }).id);
      for (const [userId, role] of [
        [String((ap1.body.user as { id: string }).id), "approver"],
        [String((ap2.body.user as { id: string }).id), "approver"],
      ] as const) {
        await api(baseUrl, "POST", `/trains/${trainId}/members`, {
          token: leadToken,
          body: { userId, role },
        });
      }

      const service = await api(baseUrl, "POST", `/trains/${trainId}/services`, {
        token: leadToken,
        body: { name: "payments" },
      });
      const serviceId = String((service.body.service as { id: string }).id);
      let cur = (
        await api(baseUrl, "POST", `/services/${serviceId}/releases`, {
          token: leadToken,
          body: { version: "2.0.0" },
        })
      ).body.release as Release;

      const item = await api(baseUrl, "POST", `/releases/${cur.id}/checklist`, {
        token: leadToken,
        body: { label: "Canary pass" },
      });
      const itemId = String((item.body.item as { id: string }).id);
      await api(baseUrl, "POST", `/releases/${cur.id}/checklist/${itemId}/check`, {
        token: leadToken,
      });

      cur = (
        await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
          token: leadToken,
          body: { to: "staging", versionNum: cur.versionNum },
        })
      ).body.release as Release;

      await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
        token: String(ap1.body.token),
      });
      await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
        token: String(ap2.body.token),
      });

      const prod = await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
        token: leadToken,
        body: { to: "prod", versionNum: cur.versionNum },
      });
      assert.equal(prod.status, 200);
      assert.equal((prod.body.release as Release).state, "prod");
      assert.ok(store.sideEffects >= 1);

      cur = prod.body.release as Release;
      const rolled = await api(baseUrl, "POST", `/releases/${cur.id}/rollback`, {
        token: leadToken,
        body: { versionNum: cur.versionNum },
      });
      assert.equal(rolled.status, 200);
      assert.ok(store.sideEffects >= 2);
      assert.equal(dep.failures, 0);
      void leadId;
    },
    { dep },
  );
});
