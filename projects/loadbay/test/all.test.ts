import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualSealReady, fitsCapacity } from "../src/rules.js";

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
  assert.equal(canTransition("staged", "sealed"), true);
  assert.equal(canTransition("sealed", "departed"), true);
  assert.equal(canTransition("departed", "staged"), false);
  assert.equal(fitsCapacity(9000, 10000), true);
  assert.equal(fitsCapacity(11000, 10000), false);
  assert.equal(dualSealReady(1), false);
  assert.equal(dualSealReady(2), true);
});

test("health auth ACL capacity dual-seal integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@lb.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/bays", { body: { name: "x" } })).status,
        401,
      );

      const checker = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "chk@lb.test", password: "x" },
      });
      const checkerToken = String(checker.body.token);
      const checkerId = String((checker.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@lb.test", password: "x" },
      });

      const bay = await api(baseUrl, "POST", "/bays", {
        token: ownerToken,
        body: { name: "East Bay" },
      });
      const bayId = String((bay.body.bay as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/bays/${bayId}/docks`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/bays/${bayId}/members`, {
        token: ownerToken,
        body: { userId: checkerId, role: "checker" },
      });

      const dock = await api(baseUrl, "POST", `/bays/${bayId}/docks`, {
        token: ownerToken,
        body: { label: "Dock-A", maxWeightKg: 10000 },
      });
      const dockId = String((dock.body.dock as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/docks/${dockId}/loads`, {
            token: ownerToken,
            body: { title: "over", weightKg: 15000 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/docks/${dockId}/loads`, {
          token: ownerToken,
          body: { title: "pallet run", weightKg: 8000 },
        })
      ).body.load as { id: string; version: number; state: string };

      assert.equal(cur.state, "staged");

      const sealed = await api(baseUrl, "POST", `/loads/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "sealed", version: cur.version },
      });
      assert.equal(sealed.status, 200);
      cur = sealed.body.load as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/loads/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "departed", version: cur.version },
          })
        ).status,
        400,
      );

      const s1 = await api(baseUrl, "POST", `/loads/${cur.id}/seal`, {
        token: ownerToken,
      });
      assert.equal(s1.status, 200);
      assert.equal(s1.body.sealCount, 1);

      const s2 = await api(baseUrl, "POST", `/loads/${cur.id}/seal`, {
        token: checkerToken,
      });
      assert.equal(s2.status, 200);
      assert.equal(s2.body.sealCount, 2);

      const departed = await api(baseUrl, "POST", `/loads/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "departed", version: cur.version },
      });
      assert.equal(departed.status, 200);
      cur = departed.body.load as typeof cur;
      assert.equal(cur.state, "departed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/bays/${bayId}/docks`, {
          token: ownerToken,
          body: { label, maxWeightKg: 5000 },
        });
      }
      const page = await api(baseUrl, "GET", `/bays/${bayId}/docks?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.docks as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_lb").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Loadbay/);
    },
    { dep, webhookSecret: "whsec_lb" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@lb.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/bays", { token, body: { name: `B${i}` } })).status ===
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

test("stale version 409 after depart", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@lb.test`, password: "x" },
    });
    const checker = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `c-${Math.random()}@lb.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const checkerToken = String(checker.body.token);
    const checkerId = String((checker.body.user as { id: string }).id);
    const bay = await api(baseUrl, "POST", "/bays", {
      token: ownerToken,
      body: { name: "B" },
    });
    const bayId = String((bay.body.bay as { id: string }).id);
    await api(baseUrl, "POST", `/bays/${bayId}/members`, {
      token: ownerToken,
      body: { userId: checkerId, role: "checker" },
    });
    const dock = await api(baseUrl, "POST", `/bays/${bayId}/docks`, {
      token: ownerToken,
      body: { label: "D1", maxWeightKg: 1000 },
    });
    const dockId = String((dock.body.dock as { id: string }).id);
    const load = (
      await api(baseUrl, "POST", `/docks/${dockId}/loads`, {
        token: ownerToken,
        body: { title: "t", weightKg: 500 },
      })
    ).body.load as { id: string; version: number };
    const sealed = await api(baseUrl, "POST", `/loads/${load.id}/transition`, {
      token: ownerToken,
      body: { to: "sealed", version: load.version },
    });
    const version = Number((sealed.body.load as { version: number }).version);
    await api(baseUrl, "POST", `/loads/${load.id}/seal`, { token: ownerToken });
    await api(baseUrl, "POST", `/loads/${load.id}/seal`, { token: checkerToken });
    await api(baseUrl, "POST", `/loads/${load.id}/transition`, {
      token: ownerToken,
      body: { to: "departed", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/loads/${load.id}/transition`, {
          token: ownerToken,
          body: { to: "departed", version },
        })
      ).status,
      409,
    );
  });
});
