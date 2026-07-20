import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";

type Json = Record<string, unknown>;

async function api(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json; headers?: Record<string, string> } = {},
) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(opts.headers ?? {}),
  };
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
      const bad = await fetch(`${baseUrl}/webhooks/inbound`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-signature": "deadbeef",
        },
        body: payload,
      });
      assert.equal(bad.status, 401);

      const sig = createHmac("sha256", "whsec_integrate")
        .update(payload)
        .digest("hex");
      const good = await fetch(`${baseUrl}/webhooks/inbound`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-signature": sig,
          "idempotency-key": "k1",
        },
        body: payload,
      });
      assert.equal(good.status, 200);
    },
    { webhookSecret: "whsec_integrate" },
  );
});

test("decision transition notifies dependency and records side effect", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "int@screenlane.test", password: "secret" },
      });
      const token = String(auth.body.token);
      const board = await api(baseUrl, "POST", "/boards", {
        token,
        body: { name: "I" },
      });
      const boardId = String((board.body.board as { id: string }).id);
      const job = await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
        token,
        body: { title: "J" },
      });
      const jobId = String((job.body.job as { id: string }).id);
      await api(baseUrl, "POST", `/jobs/${jobId}/criteria`, {
        token,
        body: { label: "Skill", weight: 1 },
      });
      const cand = await api(baseUrl, "POST", `/boards/${boardId}/candidates`, {
        token,
        body: { name: "N", email: "n@ex.com" },
      });
      const app = await api(baseUrl, "POST", `/jobs/${jobId}/applications`, {
        token,
        body: {
          candidateId: String((cand.body.candidate as { id: string }).id),
        },
      });
      let cur = app.body.application as { id: string; version: number };
      cur = (
        await api(baseUrl, "POST", `/applications/${cur.id}/transition`, {
          token,
          body: { to: "screening", version: cur.version },
        })
      ).body.application as typeof cur;
      const decided = await api(
        baseUrl,
        "POST",
        `/applications/${cur.id}/transition`,
        {
          token,
          body: { to: "decided", version: cur.version, decision: "rejected" },
        },
      );
      assert.equal(decided.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);
    },
    { dep },
  );
});
