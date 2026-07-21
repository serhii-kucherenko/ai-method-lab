import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualArchiveReady, retentionMet } from "../src/rules.js";

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
  assert.equal(canTransition("open", "held"), true);
  assert.equal(canTransition("held", "archived"), true);
  assert.equal(canTransition("archived", "open"), false);
  assert.equal(
    retentionMet("2026-01-01T00:00:00.000Z", 30, "2026-01-31T00:00:00.000Z"),
    true,
  );
  assert.equal(
    retentionMet("2026-01-01T00:00:00.000Z", 30, "2026-01-15T00:00:00.000Z"),
    false,
  );
  assert.equal(dualArchiveReady(1), false);
  assert.equal(dualArchiveReady(2), true);
});

test("health auth ACL retention dual-archive integrate scale UI", async () => {
  const dep = createMockDep();
  let now = "2026-01-01T00:00:00.000Z";
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@sc.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/firms", { body: { name: "x" } })).status,
        401,
      );

      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "peer@sc.test", password: "x" },
      });
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@sc.test", password: "x" },
      });

      const firm = await api(baseUrl, "POST", "/firms", {
        token: ownerToken,
        body: { name: "Acme Law" },
      });
      const firmId = String((firm.body.firm as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/firms/${firmId}/matters`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/firms/${firmId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "counsel" },
      });

      let cur = (
        await api(baseUrl, "POST", `/firms/${firmId}/matters`, {
          token: ownerToken,
          body: { title: "Case-1", retentionDays: 30 },
        })
      ).body.matter as { id: string; version: number; state: string };
      assert.equal(cur.state, "open");

      const ev = await api(baseUrl, "POST", `/matters/${cur.id}/evidence`, {
        token: ownerToken,
        body: { label: "contract.pdf" },
      });
      assert.equal(ev.status, 201);

      const held = await api(baseUrl, "POST", `/matters/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.matter as typeof cur;

      // Retention not met yet
      assert.equal(
        (
          await api(baseUrl, "POST", `/matters/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "archived", version: cur.version },
          })
        ).status,
        400,
      );

      now = "2026-02-01T00:00:00.000Z";

      assert.equal(
        (
          await api(baseUrl, "POST", `/matters/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "archived", version: cur.version },
          })
        ).status,
        400,
      );

      const a1 = await api(baseUrl, "POST", `/matters/${cur.id}/approve`, {
        token: ownerToken,
      });
      assert.equal(a1.status, 200);
      assert.equal(a1.body.approvalCount, 1);

      const a2 = await api(baseUrl, "POST", `/matters/${cur.id}/approve`, {
        token: peerToken,
      });
      assert.equal(a2.status, 200);
      assert.equal(a2.body.approvalCount, 2);

      const archived = await api(baseUrl, "POST", `/matters/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "archived", version: cur.version },
      });
      assert.equal(archived.status, 200);
      cur = archived.body.matter as typeof cur;
      assert.equal(cur.state, "archived");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const title of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/firms/${firmId}/matters`, {
          token: ownerToken,
          body: { title, retentionDays: 7 },
        });
      }
      const page = await api(baseUrl, "GET", `/firms/${firmId}/matters?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.matters as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_sc").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Safecase/);
    },
    { dep, webhookSecret: "whsec_sc", nowIso: () => now },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@sc.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/firms", { token, body: { name: `F${i}` } })).status ===
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

test("stale version 409 after archive", async () => {
  let now = "2026-01-01T00:00:00.000Z";
  await withServer(
    async (baseUrl) => {
      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: `o-${Math.random()}@sc.test`, password: "x" },
      });
      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: `p-${Math.random()}@sc.test`, password: "x" },
      });
      const ownerToken = String(owner.body.token);
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);
      const firm = await api(baseUrl, "POST", "/firms", {
        token: ownerToken,
        body: { name: "F" },
      });
      const firmId = String((firm.body.firm as { id: string }).id);
      await api(baseUrl, "POST", `/firms/${firmId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "counsel" },
      });
      const matter = (
        await api(baseUrl, "POST", `/firms/${firmId}/matters`, {
          token: ownerToken,
          body: { title: "M1", retentionDays: 1 },
        })
      ).body.matter as { id: string; version: number };
      const held = await api(baseUrl, "POST", `/matters/${matter.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: matter.version },
      });
      const version = Number((held.body.matter as { version: number }).version);
      now = "2026-01-03T00:00:00.000Z";
      await api(baseUrl, "POST", `/matters/${matter.id}/approve`, { token: ownerToken });
      await api(baseUrl, "POST", `/matters/${matter.id}/approve`, { token: peerToken });
      await api(baseUrl, "POST", `/matters/${matter.id}/transition`, {
        token: ownerToken,
        body: { to: "archived", version },
      });
      assert.equal(
        (
          await api(baseUrl, "POST", `/matters/${matter.id}/transition`, {
            token: ownerToken,
            body: { to: "archived", version },
          })
        ).status,
        409,
      );
    },
    { nowIso: () => now },
  );
});
