import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualReleaseReady, fitsCeiling } from "../src/rules.js";

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

test("rules", () => {
  assert.equal(canTransition("requested", "held"), true);
  assert.equal(canTransition("held", "released"), true);
  assert.equal(canTransition("released", "requested"), false);
  assert.equal(fitsCeiling(4000, 10000, 0), true);
  assert.equal(fitsCeiling(9000, 10000, 2000), false);
  assert.equal(dualReleaseReady(1), false);
  assert.equal(dualReleaseReady(2), true);
});

test("health auth ACL ceiling dual-release integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@qg.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/orgs", { body: { name: "x" } })).status,
        401,
      );

      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "peer@qg.test", password: "x" },
      });
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@qg.test", password: "x" },
      });

      const org = await api(baseUrl, "POST", "/orgs", {
        token: ownerToken,
        body: { name: "Acme" },
      });
      const orgId = String((org.body.org as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/orgs/${orgId}/quotas`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/orgs/${orgId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "finance" },
      });

      const quota = await api(baseUrl, "POST", `/orgs/${orgId}/quotas`, {
        token: ownerToken,
        body: { label: "API", ceiling: 10000 },
      });
      const quotaId = String((quota.body.quota as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/quotas/${quotaId}/charges`, {
            token: ownerToken,
            body: { title: "over", amount: 12000 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/quotas/${quotaId}/charges`, {
          token: ownerToken,
          body: { title: "batch", amount: 5000 },
        })
      ).body.charge as { id: string; version: number; state: string };
      assert.equal(cur.state, "requested");

      const held = await api(baseUrl, "POST", `/charges/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.charge as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/charges/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "released", version: cur.version },
          })
        ).status,
        400,
      );

      const r1 = await api(baseUrl, "POST", `/charges/${cur.id}/release`, {
        token: ownerToken,
      });
      assert.equal(r1.status, 200);
      assert.equal(r1.body.releaseCount, 1);

      const r2 = await api(baseUrl, "POST", `/charges/${cur.id}/release`, {
        token: peerToken,
      });
      assert.equal(r2.status, 200);
      assert.equal(r2.body.releaseCount, 2);

      const released = await api(baseUrl, "POST", `/charges/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "released", version: cur.version },
      });
      assert.equal(released.status, 200);
      cur = released.body.charge as typeof cur;
      assert.equal(cur.state, "released");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/orgs/${orgId}/quotas`, {
          token: ownerToken,
          body: { label, ceiling: 5000 },
        });
      }
      const page = await api(baseUrl, "GET", `/orgs/${orgId}/quotas?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.quotas as unknown[]).length, 2);

      const payload = JSON.stringify({ e: 1 });
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: { "x-signature": "bad", "content-type": "application/json" },
            body: payload,
          })
        ).status,
        401,
      );
      const sig = createHmac("sha256", "whsec_qg").update(payload).digest("hex");
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: { "x-signature": sig, "content-type": "application/json" },
            body: payload,
          })
        ).status,
        200,
      );

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Quotaguard/);
    },
    { dep, webhookSecret: "whsec_qg" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@qg.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/orgs", { token, body: { name: `O${i}` } })).status ===
          429
        ) {
          hit = true;
          break;
        }
      }
      assert.equal(hit, true);
    },
    { rateLimit: 3 },
  );
});

test("stale version 409 after release", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@qg.test`, password: "x" },
    });
    const peer = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `p-${Math.random()}@qg.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const peerToken = String(peer.body.token);
    const peerId = String((peer.body.user as { id: string }).id);
    const org = await api(baseUrl, "POST", "/orgs", {
      token: ownerToken,
      body: { name: "O" },
    });
    const orgId = String((org.body.org as { id: string }).id);
    await api(baseUrl, "POST", `/orgs/${orgId}/members`, {
      token: ownerToken,
      body: { userId: peerId, role: "finance" },
    });
    const quota = await api(baseUrl, "POST", `/orgs/${orgId}/quotas`, {
      token: ownerToken,
      body: { label: "Q1", ceiling: 1000 },
    });
    const quotaId = String((quota.body.quota as { id: string }).id);
    const charge = (
      await api(baseUrl, "POST", `/quotas/${quotaId}/charges`, {
        token: ownerToken,
        body: { title: "t", amount: 200 },
      })
    ).body.charge as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/charges/${charge.id}/transition`, {
      token: ownerToken,
      body: { to: "held", version: charge.version },
    });
    const version = Number((held.body.charge as { version: number }).version);
    await api(baseUrl, "POST", `/charges/${charge.id}/release`, { token: ownerToken });
    await api(baseUrl, "POST", `/charges/${charge.id}/release`, { token: peerToken });
    await api(baseUrl, "POST", `/charges/${charge.id}/transition`, {
      token: ownerToken,
      body: { to: "released", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/charges/${charge.id}/transition`, {
          token: ownerToken,
          body: { to: "released", version },
        })
      ).status,
      409,
    );
  });
});
