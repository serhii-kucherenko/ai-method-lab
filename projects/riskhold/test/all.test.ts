import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualClearReady, isBreached } from "../src/rules.js";

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
  assert.equal(canTransition("held", "cleared"), true);
  assert.equal(canTransition("cleared", "open"), false);
  assert.equal(isBreached(1200, 1000), true);
  assert.equal(isBreached(800, 1000), false);
  assert.equal(dualClearReady(0, false), true);
  assert.equal(dualClearReady(1, true), false);
  assert.equal(dualClearReady(2, true), true);
});

test("health auth ACL breach dual-clear integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const officer = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "ro1@rh.test", password: "x" },
      });
      assert.equal(officer.status, 201);
      const officerToken = String(officer.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/books", { body: { name: "x" } })).status,
        401,
      );

      const officer2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "ro2@rh.test", password: "x" },
      });
      const officer2Token = String(officer2.body.token);
      const officer2Id = String((officer2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@rh.test", password: "x" },
      });

      const book = await api(baseUrl, "POST", "/books", {
        token: officerToken,
        body: { name: "Desk Alpha" },
      });
      const bookId = String((book.body.book as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/books/${bookId}/positions`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/books/${bookId}/members`, {
        token: officerToken,
        body: { userId: officer2Id, role: "risk_officer" },
      });

      let safe = (
        await api(baseUrl, "POST", `/books/${bookId}/positions`, {
          token: officerToken,
          body: { label: "FX-1", exposure: 500, riskLimit: 1000 },
        })
      ).body.position as { id: string; version: number; breached: boolean };

      assert.equal(
        (
          await api(baseUrl, "POST", `/positions/${safe.id}/transition`, {
            token: officerToken,
            body: { to: "held", version: safe.version },
          })
        ).status,
        400,
      );

      let hot = (
        await api(baseUrl, "POST", `/books/${bookId}/positions`, {
          token: officerToken,
          body: { label: "FX-HOT", exposure: 1500, riskLimit: 1000 },
        })
      ).body.position as {
        id: string;
        version: number;
        state: string;
        breached: boolean;
      };
      assert.equal(hot.breached, true);

      const held = await api(baseUrl, "POST", `/positions/${hot.id}/transition`, {
        token: officerToken,
        body: { to: "held", version: hot.version },
      });
      assert.equal(held.status, 200);
      hot = held.body.position as typeof hot;

      assert.equal(
        (
          await api(baseUrl, "POST", `/positions/${hot.id}/transition`, {
            token: officerToken,
            body: { to: "cleared", version: hot.version },
          })
        ).status,
        400,
      );

      const c1 = await api(baseUrl, "POST", `/positions/${hot.id}/clear`, {
        token: officerToken,
      });
      assert.equal(c1.status, 200);
      assert.equal(c1.body.clearCount, 1);

      const c2 = await api(baseUrl, "POST", `/positions/${hot.id}/clear`, {
        token: officer2Token,
      });
      assert.equal(c2.status, 200);
      assert.equal(c2.body.clearCount, 2);

      const cleared = await api(baseUrl, "POST", `/positions/${hot.id}/transition`, {
        token: officerToken,
        body: { to: "cleared", version: hot.version },
      });
      assert.equal(cleared.status, 200);
      hot = cleared.body.position as typeof hot;
      assert.equal(hot.state, "cleared");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);
      void safe;

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/books/${bookId}/positions`, {
          token: officerToken,
          body: { label, exposure: 10, riskLimit: 100 },
        });
      }
      const page = await api(baseUrl, "GET", `/books/${bookId}/positions?limit=2&offset=0`, {
        token: officerToken,
      });
      assert.equal((page.body.positions as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_rh").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Riskhold/);
    },
    { dep, webhookSecret: "whsec_rh" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@rh.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/books", { token, body: { name: `B${i}` } })).status ===
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

test("stale version 409 after clear", async () => {
  await withServer(async (baseUrl) => {
    const o1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o1-${Math.random()}@rh.test`, password: "x" },
    });
    const o2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o2-${Math.random()}@rh.test`, password: "x" },
    });
    const t1 = String(o1.body.token);
    const t2 = String(o2.body.token);
    const o2Id = String((o2.body.user as { id: string }).id);
    const book = await api(baseUrl, "POST", "/books", {
      token: t1,
      body: { name: "B" },
    });
    const bookId = String((book.body.book as { id: string }).id);
    await api(baseUrl, "POST", `/books/${bookId}/members`, {
      token: t1,
      body: { userId: o2Id, role: "risk_officer" },
    });
    const pos = (
      await api(baseUrl, "POST", `/books/${bookId}/positions`, {
        token: t1,
        body: { label: "P", exposure: 200, riskLimit: 100 },
      })
    ).body.position as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/positions/${pos.id}/transition`, {
      token: t1,
      body: { to: "held", version: pos.version },
    });
    const version = Number((held.body.position as { version: number }).version);
    await api(baseUrl, "POST", `/positions/${pos.id}/clear`, { token: t1 });
    await api(baseUrl, "POST", `/positions/${pos.id}/clear`, { token: t2 });
    await api(baseUrl, "POST", `/positions/${pos.id}/transition`, {
      token: t1,
      body: { to: "cleared", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/positions/${pos.id}/transition`, {
          token: t1,
          body: { to: "cleared", version },
        })
      ).status,
      409,
    );
  });
});
