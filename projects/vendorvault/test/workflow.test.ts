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

async function setup(baseUrl: string, token: string) {
  const ws = await api(baseUrl, "POST", "/workspaces", {
    token,
    body: { name: "WF" },
  });
  const wsId = String((ws.body.workspace as { id: string }).id);
  const vendor = await api(baseUrl, "POST", `/workspaces/${wsId}/vendors`, {
    token,
    body: { name: "Acme" },
  });
  return {
    wsId,
    vendorId: String((vendor.body.vendor as { id: string }).id),
  };
}

test("remediate requires note; accept needs attestation + score for critical", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: `wf-${Math.random()}@vv.test`, password: "x" },
      });
      const token = String(auth.body.token);
      const { vendorId } = await setup(baseUrl, token);
      const finding = await api(baseUrl, "POST", `/vendors/${vendorId}/findings`, {
        token,
        body: { title: "Leak", severity: "critical" },
      });
      let cur = finding.body.finding as { id: string; version: number };
      assert.equal(
        (
          await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
            token,
            body: { to: "remediated", version: cur.version },
          })
        ).status,
        400,
      );
      const rem = await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
        token,
        body: {
          to: "remediated",
          version: cur.version,
          remediation_note: "Patched",
        },
      });
      assert.equal(rem.status, 200);
      cur = rem.body.finding as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
            token,
            body: { to: "accepted", version: cur.version },
          })
        ).status,
        400,
      );

      await api(baseUrl, "POST", `/vendors/${vendorId}/attest`, {
        token,
        body: { until: "2027-01-01" },
      });
      assert.equal(
        (
          await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
            token,
            body: { to: "accepted", version: cur.version },
          })
        ).status,
        400,
      );

      const q = await api(baseUrl, "POST", `/vendors/${vendorId}/questions`, {
        token,
        body: { prompt: "Security?" },
      });
      await api(baseUrl, "POST", `/questions/${(q.body.question as { id: string }).id}/score`, {
        token,
        body: { value: 4 },
      });
      const ok = await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
        token,
        body: { to: "accepted", version: cur.version },
      });
      assert.equal(ok.status, 200);
      assert.equal((ok.body.finding as { state: string }).state, "accepted");
    },
    { nowIso: "2026-07-20T12:00:00Z" },
  );
});

test("stale version 409", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `stale-${Math.random()}@vv.test`, password: "x" },
    });
    const token = String(auth.body.token);
    const { vendorId } = await setup(baseUrl, token);
    const finding = await api(baseUrl, "POST", `/vendors/${vendorId}/findings`, {
      token,
      body: { title: "X", severity: "low" },
    });
    const cur = finding.body.finding as { id: string; version: number };
    await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
      token,
      body: {
        to: "remediated",
        version: cur.version,
        remediation_note: "done",
      },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/findings/${cur.id}/transition`, {
          token,
          body: {
            to: "remediated",
            version: cur.version,
            remediation_note: "done",
          },
        })
      ).status,
      409,
    );
  });
});
