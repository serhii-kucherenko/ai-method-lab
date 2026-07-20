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

async function setup(baseUrl: string) {
  const auth = await api(baseUrl, "POST", "/auth/register", {
    body: { email: `wf-${Math.random()}@claimdesk.test`, password: "secret" },
  });
  const token = String(auth.body.token);
  const desk = await api(baseUrl, "POST", "/desks", {
    token,
    body: { name: "WF" },
  });
  const deskId = String((desk.body.desk as { id: string }).id);
  const policy = await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
    token,
    body: { number: "POL-1", holder: "Casey" },
  });
  const policyId = String((policy.body.policy as { id: string }).id);
  const claim = await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
    token,
    body: { title: "Fender bender" },
  });
  return {
    token,
    claim: claim.body.claim as {
      id: string;
      state: string;
      version: number;
    },
  };
}

test("cannot enter review without reserve", async () => {
  await withServer(async (baseUrl) => {
    const { token, claim } = await setup(baseUrl);
    const res = await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
      token,
      body: { to: "review", version: claim.version },
    });
    assert.equal(res.status, 400);
    assert.match(String(res.body.error), /reserve/i);
  });
});

test("filed → review → settled with evidence and payout ceiling", async () => {
  await withServer(async (baseUrl) => {
    const { token, claim: start } = await setup(baseUrl);
    await api(baseUrl, "POST", `/claims/${start.id}/reserve`, {
      token,
      body: { amount: 1000 },
    });
    let cur = start;
    const toReview = await api(
      baseUrl,
      "POST",
      `/claims/${cur.id}/transition`,
      { token, body: { to: "review", version: cur.version } },
    );
    assert.equal(toReview.status, 200);
    cur = toReview.body.claim as typeof cur;

    const noEvidence = await api(
      baseUrl,
      "POST",
      `/claims/${cur.id}/transition`,
      { token, body: { to: "settled", version: cur.version, payout: 500 } },
    );
    assert.equal(noEvidence.status, 400);

    await api(baseUrl, "POST", `/claims/${cur.id}/evidence`, {
      token,
      body: { label: "Police report", kind: "doc" },
    });

    const over = await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
      token,
      body: { to: "settled", version: cur.version, payout: 1500 },
    });
    assert.equal(over.status, 400);

    const ok = await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
      token,
      body: { to: "settled", version: cur.version, payout: 800 },
    });
    assert.equal(ok.status, 200);
    assert.equal((ok.body.claim as { state: string }).state, "settled");
    assert.equal((ok.body.claim as { payoutAmount: number }).payoutAmount, 800);

    const audit = await api(baseUrl, "GET", `/claims/${cur.id}/audit`, {
      token,
    });
    assert.ok((audit.body.audit as unknown[]).length >= 2);
  });
});

test("stale version returns 409", async () => {
  await withServer(async (baseUrl) => {
    const { token, claim } = await setup(baseUrl);
    await api(baseUrl, "POST", `/claims/${claim.id}/reserve`, {
      token,
      body: { amount: 10 },
    });
    const first = await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
      token,
      body: { to: "review", version: claim.version },
    });
    assert.equal(first.status, 200);
    const stale = await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
      token,
      body: { to: "review", version: claim.version },
    });
    assert.equal(stale.status, 409);
  });
});
