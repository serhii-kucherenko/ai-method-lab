import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import {
  canTransition,
  dualCloseReady,
  fitsAuthorized,
  shareHeadroom,
} from "../src/rules.js";

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
  assert.equal(canTransition("proposed", "held"), true);
  assert.equal(canTransition("held", "closed"), true);
  assert.equal(canTransition("closed", "held"), false);
  assert.equal(shareHeadroom(1000, 200), 800);
  assert.equal(fitsAuthorized(700, 1000, 0), true);
  assert.equal(fitsAuthorized(1100, 1000, 0), false);
  assert.equal(dualCloseReady(1), false);
  assert.equal(dualCloseReady(2), true);
});

test("health auth ACL oversubscribe dual-close integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const c1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "c1@ct.test", password: "x" },
      });
      assert.equal(c1.status, 201);
      const t1 = String(c1.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/firms", { body: { name: "x" } })).status,
        401,
      );

      const c2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "c2@ct.test", password: "x" },
      });
      const t2 = String(c2.body.token);
      const c2Id = String((c2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@ct.test", password: "x" },
      });

      const firm = await api(baseUrl, "POST", "/firms", {
        token: t1,
        body: { name: "Series Co" },
      });
      const firmId = String((firm.body.firm as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/firms/${firmId}/rounds`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/firms/${firmId}/members`, {
        token: t1,
        body: { userId: c2Id, role: "counsel" },
      });

      const round = await api(baseUrl, "POST", `/firms/${firmId}/rounds`, {
        token: t1,
        body: { label: "Series A", authorized: 1000 },
      });
      const roundId = String((round.body.round as { id: string }).id);
      assert.equal((round.body.round as { headroom: number }).headroom, 1000);

      assert.equal(
        (
          await api(baseUrl, "POST", `/rounds/${roundId}/allocations`, {
            token: t1,
            body: { title: "too many", shares: 1200 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/rounds/${roundId}/allocations`, {
          token: t1,
          body: { title: "investor A", shares: 400 },
        })
      ).body.allocation as { id: string; version: number; state: string };

      const held = await api(baseUrl, "POST", `/allocations/${cur.id}/transition`, {
        token: t1,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.allocation as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/allocations/${cur.id}/transition`, {
            token: t1,
            body: { to: "closed", version: cur.version },
          })
        ).status,
        400,
      );

      const cl1 = await api(baseUrl, "POST", `/allocations/${cur.id}/close`, { token: t1 });
      assert.equal(cl1.status, 200);
      assert.equal(cl1.body.closeCount, 1);

      const cl2 = await api(baseUrl, "POST", `/allocations/${cur.id}/close`, { token: t2 });
      assert.equal(cl2.status, 200);
      assert.equal(cl2.body.closeCount, 2);

      const closed = await api(baseUrl, "POST", `/allocations/${cur.id}/transition`, {
        token: t1,
        body: { to: "closed", version: cur.version },
      });
      assert.equal(closed.status, 200);
      cur = closed.body.allocation as typeof cur;
      assert.equal(cur.state, "closed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/firms/${firmId}/rounds`, {
          token: t1,
          body: { label, authorized: 100 },
        });
      }
      const page = await api(baseUrl, "GET", `/firms/${firmId}/rounds?limit=2&offset=0`, {
        token: t1,
      });
      assert.equal((page.body.rounds as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_ct").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Captable/);
    },
    { dep, webhookSecret: "whsec_ct" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@ct.test", password: "x" },
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

test("stale version 409 after close", async () => {
  await withServer(async (baseUrl) => {
    const c1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `c1-${Math.random()}@ct.test`, password: "x" },
    });
    const c2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `c2-${Math.random()}@ct.test`, password: "x" },
    });
    const t1 = String(c1.body.token);
    const t2 = String(c2.body.token);
    const c2Id = String((c2.body.user as { id: string }).id);
    const firm = await api(baseUrl, "POST", "/firms", {
      token: t1,
      body: { name: "F" },
    });
    const firmId = String((firm.body.firm as { id: string }).id);
    await api(baseUrl, "POST", `/firms/${firmId}/members`, {
      token: t1,
      body: { userId: c2Id, role: "counsel" },
    });
    const round = await api(baseUrl, "POST", `/firms/${firmId}/rounds`, {
      token: t1,
      body: { label: "R1", authorized: 500 },
    });
    const roundId = String((round.body.round as { id: string }).id);
    const alloc = (
      await api(baseUrl, "POST", `/rounds/${roundId}/allocations`, {
        token: t1,
        body: { title: "t", shares: 100 },
      })
    ).body.allocation as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/allocations/${alloc.id}/transition`, {
      token: t1,
      body: { to: "held", version: alloc.version },
    });
    const version = Number((held.body.allocation as { version: number }).version);
    await api(baseUrl, "POST", `/allocations/${alloc.id}/close`, { token: t1 });
    await api(baseUrl, "POST", `/allocations/${alloc.id}/close`, { token: t2 });
    await api(baseUrl, "POST", `/allocations/${alloc.id}/transition`, {
      token: t1,
      body: { to: "closed", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/allocations/${alloc.id}/transition`, {
          token: t1,
          body: { to: "closed", version },
        })
      ).status,
      409,
    );
  });
});
