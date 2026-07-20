import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualApproveReady, staysNonNegative } from "../src/rules.js";

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
  assert.equal(canTransition("drafted", "staged"), true);
  assert.equal(canTransition("staged", "applied"), true);
  assert.equal(canTransition("applied", "drafted"), false);
  assert.equal(staysNonNegative(10, -5), true);
  assert.equal(staysNonNegative(10, -11), false);
  assert.equal(dualApproveReady(1), false);
  assert.equal(dualApproveReady(2), true);
});

test("health auth ACL no-negative dual-approve integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@sr.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/stores", { body: { name: "x" } })).status,
        401,
      );

      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "peer@sr.test", password: "x" },
      });
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@sr.test", password: "x" },
      });

      const st = await api(baseUrl, "POST", "/stores", {
        token: ownerToken,
        body: { name: "Main" },
      });
      const storeId = String((st.body.store as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/stores/${storeId}/skus`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/stores/${storeId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "manager" },
      });

      const sku = await api(baseUrl, "POST", `/stores/${storeId}/skus`, {
        token: ownerToken,
        body: { code: "SKU-1", qty: 10 },
      });
      const skuId = String((sku.body.sku as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/skus/${skuId}/adjustments`, {
            token: ownerToken,
            body: { title: "overdraw", delta: -20 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/skus/${skuId}/adjustments`, {
          token: ownerToken,
          body: { title: "shrink", delta: -3 },
        })
      ).body.adjustment as { id: string; version: number; state: string };
      assert.equal(cur.state, "drafted");

      const staged = await api(baseUrl, "POST", `/adjustments/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "staged", version: cur.version },
      });
      assert.equal(staged.status, 200);
      cur = staged.body.adjustment as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/adjustments/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "applied", version: cur.version },
          })
        ).status,
        400,
      );

      const a1 = await api(baseUrl, "POST", `/adjustments/${cur.id}/approve`, {
        token: ownerToken,
      });
      assert.equal(a1.status, 200);
      assert.equal(a1.body.approvalCount, 1);

      const a2 = await api(baseUrl, "POST", `/adjustments/${cur.id}/approve`, {
        token: peerToken,
      });
      assert.equal(a2.status, 200);
      assert.equal(a2.body.approvalCount, 2);

      const applied = await api(baseUrl, "POST", `/adjustments/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "applied", version: cur.version },
      });
      assert.equal(applied.status, 200);
      cur = applied.body.adjustment as typeof cur;
      assert.equal(cur.state, "applied");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const code of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/stores/${storeId}/skus`, {
          token: ownerToken,
          body: { code, qty: 1 },
        });
      }
      const page = await api(baseUrl, "GET", `/stores/${storeId}/skus?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.skus as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_sr").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Stockrail/);
    },
    { dep, webhookSecret: "whsec_sr" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@sr.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/stores", { token, body: { name: `S${i}` } })).status ===
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

test("stale version 409 after apply", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@sr.test`, password: "x" },
    });
    const peer = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `p-${Math.random()}@sr.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const peerToken = String(peer.body.token);
    const peerId = String((peer.body.user as { id: string }).id);
    const st = await api(baseUrl, "POST", "/stores", {
      token: ownerToken,
      body: { name: "S" },
    });
    const storeId = String((st.body.store as { id: string }).id);
    await api(baseUrl, "POST", `/stores/${storeId}/members`, {
      token: ownerToken,
      body: { userId: peerId, role: "manager" },
    });
    const sku = await api(baseUrl, "POST", `/stores/${storeId}/skus`, {
      token: ownerToken,
      body: { code: "X", qty: 5 },
    });
    const skuId = String((sku.body.sku as { id: string }).id);
    const adj = (
      await api(baseUrl, "POST", `/skus/${skuId}/adjustments`, {
        token: ownerToken,
        body: { title: "t", delta: -1 },
      })
    ).body.adjustment as { id: string; version: number };
    const staged = await api(baseUrl, "POST", `/adjustments/${adj.id}/transition`, {
      token: ownerToken,
      body: { to: "staged", version: adj.version },
    });
    const version = Number((staged.body.adjustment as { version: number }).version);
    await api(baseUrl, "POST", `/adjustments/${adj.id}/approve`, { token: ownerToken });
    await api(baseUrl, "POST", `/adjustments/${adj.id}/approve`, { token: peerToken });
    await api(baseUrl, "POST", `/adjustments/${adj.id}/transition`, {
      token: ownerToken,
      body: { to: "applied", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/adjustments/${adj.id}/transition`, {
          token: ownerToken,
          body: { to: "applied", version },
        })
      ).status,
      409,
    );
  });
});
