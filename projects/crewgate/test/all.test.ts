import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualCloseReady, isOvertime } from "../src/rules.js";

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
  assert.equal(canTransition("open", "active"), true);
  assert.equal(canTransition("active", "closed"), true);
  assert.equal(canTransition("closed", "open"), false);
  assert.equal(isOvertime(8, 8), false);
  assert.equal(isOvertime(8.1, 8), true);
  assert.equal(dualCloseReady(1, true), false);
  assert.equal(dualCloseReady(2, true), true);
  assert.equal(dualCloseReady(0, false), true);
});

test("health auth ACL overtime dual-close integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@cg.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/sites", { body: { name: "x" } })).status,
        401,
      );

      const peer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "peer@cg.test", password: "x" },
      });
      const peerToken = String(peer.body.token);
      const peerId = String((peer.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@cg.test", password: "x" },
      });

      const site = await api(baseUrl, "POST", "/sites", {
        token: ownerToken,
        body: { name: "North Yard", overtimeLimitHours: 8 },
      });
      const siteId = String((site.body.site as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/sites/${siteId}/crews`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/sites/${siteId}/members`, {
        token: ownerToken,
        body: { userId: peerId, role: "supervisor" },
      });

      const crew = await api(baseUrl, "POST", `/sites/${siteId}/crews`, {
        token: ownerToken,
        body: { name: "Crew Alpha" },
      });
      const crewId = String((crew.body.crew as { id: string }).id);

      let cur = (
        await api(baseUrl, "POST", `/crews/${crewId}/shifts`, {
          token: ownerToken,
          body: { title: "OT pour", hours: 10 },
        })
      ).body.shift as {
        id: string;
        version: number;
        state: string;
        overtime: boolean;
      };
      assert.equal(cur.state, "open");
      assert.equal(cur.overtime, true);

      const active = await api(baseUrl, "POST", `/shifts/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "active", version: cur.version },
      });
      assert.equal(active.status, 200);
      cur = active.body.shift as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/shifts/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "closed", version: cur.version },
          })
        ).status,
        400,
      );

      const a1 = await api(baseUrl, "POST", `/shifts/${cur.id}/approve`, {
        token: ownerToken,
      });
      assert.equal(a1.status, 200);
      assert.equal(a1.body.approvalCount, 1);

      assert.equal(
        (
          await api(baseUrl, "POST", `/shifts/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "closed", version: cur.version },
          })
        ).status,
        400,
      );

      const a2 = await api(baseUrl, "POST", `/shifts/${cur.id}/approve`, {
        token: peerToken,
      });
      assert.equal(a2.status, 200);
      assert.equal(a2.body.approvalCount, 2);

      const closed = await api(baseUrl, "POST", `/shifts/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "closed", version: cur.version },
      });
      assert.equal(closed.status, 200);
      cur = closed.body.shift as typeof cur;
      assert.equal(cur.state, "closed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      // Non-overtime closes without dual approval
      let normal = (
        await api(baseUrl, "POST", `/crews/${crewId}/shifts`, {
          token: ownerToken,
          body: { title: "day shift", hours: 7 },
        })
      ).body.shift as { id: string; version: number; overtime: boolean };
      assert.equal(normal.overtime, false);
      normal = (
        await api(baseUrl, "POST", `/shifts/${normal.id}/transition`, {
          token: ownerToken,
          body: { to: "active", version: normal.version },
        })
      ).body.shift as typeof normal;
      const closedNormal = await api(baseUrl, "POST", `/shifts/${normal.id}/transition`, {
        token: ownerToken,
        body: { to: "closed", version: normal.version },
      });
      assert.equal(closedNormal.status, 200);

      for (const name of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/sites/${siteId}/crews`, {
          token: ownerToken,
          body: { name },
        });
      }
      const page = await api(baseUrl, "GET", `/sites/${siteId}/crews?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.crews as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_cg").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Crewgate/);
    },
    { dep, webhookSecret: "whsec_cg" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@cg.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/sites", { token, body: { name: `S${i}` } })).status ===
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

test("stale version 409 after close", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@cg.test`, password: "x" },
    });
    const peer = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `p-${Math.random()}@cg.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const peerToken = String(peer.body.token);
    const peerId = String((peer.body.user as { id: string }).id);
    const site = await api(baseUrl, "POST", "/sites", {
      token: ownerToken,
      body: { name: "S", overtimeLimitHours: 8 },
    });
    const siteId = String((site.body.site as { id: string }).id);
    await api(baseUrl, "POST", `/sites/${siteId}/members`, {
      token: ownerToken,
      body: { userId: peerId, role: "supervisor" },
    });
    const crew = await api(baseUrl, "POST", `/sites/${siteId}/crews`, {
      token: ownerToken,
      body: { name: "C1" },
    });
    const crewId = String((crew.body.crew as { id: string }).id);
    const shift = (
      await api(baseUrl, "POST", `/crews/${crewId}/shifts`, {
        token: ownerToken,
        body: { title: "ot", hours: 12 },
      })
    ).body.shift as { id: string; version: number };
    const active = await api(baseUrl, "POST", `/shifts/${shift.id}/transition`, {
      token: ownerToken,
      body: { to: "active", version: shift.version },
    });
    const version = Number((active.body.shift as { version: number }).version);
    await api(baseUrl, "POST", `/shifts/${shift.id}/approve`, { token: ownerToken });
    await api(baseUrl, "POST", `/shifts/${shift.id}/approve`, { token: peerToken });
    await api(baseUrl, "POST", `/shifts/${shift.id}/transition`, {
      token: ownerToken,
      body: { to: "closed", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/shifts/${shift.id}/transition`, {
          token: ownerToken,
          body: { to: "closed", version },
        })
      ).status,
      409,
    );
  });
});
