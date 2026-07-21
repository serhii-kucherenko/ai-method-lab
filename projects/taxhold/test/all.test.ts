import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualFileReady, isLate } from "../src/rules.js";

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
  assert.equal(canTransition("held", "filed"), true);
  assert.equal(canTransition("filed", "open"), false);
  assert.equal(isLate("2026-01-01T00:00:00.000Z", 0, "2026-01-02T00:00:00.000Z"), true);
  assert.equal(isLate("2026-01-01T00:00:00.000Z", 5, "2026-01-03T00:00:00.000Z"), false);
  assert.equal(dualFileReady(0, false), true);
  assert.equal(dualFileReady(1, true), false);
  assert.equal(dualFileReady(2, true), true);
});

test("health auth ACL late dual-file integrate scale UI", async () => {
  const dep = createMockDep();
  let now = "2026-02-01T00:00:00.000Z";
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@th.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/desks", { body: { name: "x" } })).status,
        401,
      );

      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "peer@th.test", password: "x" },
      });
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@th.test", password: "x" },
      });

      const desk = await api(baseUrl, "POST", "/desks", {
        token: ownerToken,
        body: { name: "Tax Desk" },
      });
      const deskId = String((desk.body.desk as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/desks/${deskId}/periods`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/desks/${deskId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "tax_officer" },
      });

      const period = await api(baseUrl, "POST", `/desks/${deskId}/periods`, {
        token: ownerToken,
        body: {
          label: "Q1",
          dueAt: "2026-01-15T00:00:00.000Z",
          lateDays: 0,
        },
      });
      const periodId = String((period.body.period as { id: string }).id);

      let cur = (
        await api(baseUrl, "POST", `/periods/${periodId}/filings`, {
          token: ownerToken,
          body: { title: "1040" },
        })
      ).body.filing as { id: string; version: number; state: string; late: boolean };
      assert.equal(cur.state, "open");
      assert.equal(cur.late, true);

      const held = await api(baseUrl, "POST", `/filings/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.filing as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/filings/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "filed", version: cur.version },
          })
        ).status,
        400,
      );

      const a1 = await api(baseUrl, "POST", `/filings/${cur.id}/approve`, {
        token: ownerToken,
      });
      assert.equal(a1.status, 200);
      assert.equal(a1.body.approvalCount, 1);

      const a2 = await api(baseUrl, "POST", `/filings/${cur.id}/approve`, {
        token: peerToken,
      });
      assert.equal(a2.status, 200);
      assert.equal(a2.body.approvalCount, 2);

      const filed = await api(baseUrl, "POST", `/filings/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "filed", version: cur.version },
      });
      assert.equal(filed.status, 200);
      cur = filed.body.filing as typeof cur;
      assert.equal(cur.state, "filed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      // On-time filing needs no dual
      now = "2026-01-01T00:00:00.000Z";
      const earlyPeriod = await api(baseUrl, "POST", `/desks/${deskId}/periods`, {
        token: ownerToken,
        body: {
          label: "Q0",
          dueAt: "2026-06-01T00:00:00.000Z",
          lateDays: 0,
        },
      });
      const earlyId = String((earlyPeriod.body.period as { id: string }).id);
      let early = (
        await api(baseUrl, "POST", `/periods/${earlyId}/filings`, {
          token: ownerToken,
          body: { title: "early" },
        })
      ).body.filing as { id: string; version: number; late: boolean };
      assert.equal(early.late, false);
      early = (
        await api(baseUrl, "POST", `/filings/${early.id}/transition`, {
          token: ownerToken,
          body: { to: "held", version: early.version },
        })
      ).body.filing as typeof early;
      assert.equal(
        (
          await api(baseUrl, "POST", `/filings/${early.id}/transition`, {
            token: ownerToken,
            body: { to: "filed", version: early.version },
          })
        ).status,
        200,
      );

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/desks/${deskId}/periods`, {
          token: ownerToken,
          body: { label, dueAt: "2026-12-01T00:00:00.000Z", lateDays: 0 },
        });
      }
      const page = await api(baseUrl, "GET", `/desks/${deskId}/periods?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.periods as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_th").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Taxhold/);
    },
    { dep, webhookSecret: "whsec_th", nowIso: () => now },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@th.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/desks", { token, body: { name: `D${i}` } })).status ===
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

test("stale version 409 after file", async () => {
  const now = "2026-03-01T00:00:00.000Z";
  await withServer(
    async (baseUrl) => {
      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: `o-${Math.random()}@th.test`, password: "x" },
      });
      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: `p-${Math.random()}@th.test`, password: "x" },
      });
      const ownerToken = String(owner.body.token);
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);
      const desk = await api(baseUrl, "POST", "/desks", {
        token: ownerToken,
        body: { name: "D" },
      });
      const deskId = String((desk.body.desk as { id: string }).id);
      await api(baseUrl, "POST", `/desks/${deskId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "tax_officer" },
      });
      const period = await api(baseUrl, "POST", `/desks/${deskId}/periods`, {
        token: ownerToken,
        body: { label: "P", dueAt: "2026-01-01T00:00:00.000Z", lateDays: 0 },
      });
      const periodId = String((period.body.period as { id: string }).id);
      const filing = (
        await api(baseUrl, "POST", `/periods/${periodId}/filings`, {
          token: ownerToken,
          body: { title: "f" },
        })
      ).body.filing as { id: string; version: number };
      const held = await api(baseUrl, "POST", `/filings/${filing.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: filing.version },
      });
      const version = Number((held.body.filing as { version: number }).version);
      await api(baseUrl, "POST", `/filings/${filing.id}/approve`, { token: ownerToken });
      await api(baseUrl, "POST", `/filings/${filing.id}/approve`, { token: peerToken });
      await api(baseUrl, "POST", `/filings/${filing.id}/transition`, {
        token: ownerToken,
        body: { to: "filed", version },
      });
      assert.equal(
        (
          await api(baseUrl, "POST", `/filings/${filing.id}/transition`, {
            token: ownerToken,
            body: { to: "filed", version },
          })
        ).status,
        409,
      );
    },
    { nowIso: () => now },
  );
});
