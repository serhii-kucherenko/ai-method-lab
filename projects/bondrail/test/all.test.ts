import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualReleaseReady, fitsFloor } from "../src/rules.js";

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
  assert.equal(canTransition("released", "held"), false);
  assert.equal(fitsFloor(100, 1000, 200, 0), true);
  assert.equal(fitsFloor(900, 1000, 200, 0), false);
  assert.equal(dualReleaseReady(1), false);
  assert.equal(dualReleaseReady(2), true);
});

test("health auth ACL floor dual-release integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "t1@br.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/workspaces", { body: { name: "x" } })).status,
        401,
      );

      const t2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "t2@br.test", password: "x" },
      });
      const t2Token = String(t2.body.token);
      const t2Id = String((t2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@br.test", password: "x" },
      });

      const ws = await api(baseUrl, "POST", "/workspaces", {
        token: ownerToken,
        body: { name: "Treasury" },
      });
      const workspaceId = String((ws.body.workspace as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/workspaces/${workspaceId}/bonds`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/workspaces/${workspaceId}/members`, {
        token: ownerToken,
        body: { userId: t2Id, role: "treasurer" },
      });

      const bond = await api(baseUrl, "POST", `/workspaces/${workspaceId}/bonds`, {
        token: ownerToken,
        body: { label: "Facility-A", collateral: 1000, floor: 200 },
      });
      const bondId = String((bond.body.bond as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/bonds/${bondId}/draws`, {
            token: ownerToken,
            body: { title: "too big", amount: 900 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/bonds/${bondId}/draws`, {
          token: ownerToken,
          body: { title: "draw-1", amount: 300 },
        })
      ).body.draw as { id: string; version: number; state: string };

      assert.equal(cur.state, "requested");

      const held = await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.draw as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "released", version: cur.version },
          })
        ).status,
        400,
      );

      const r1 = await api(baseUrl, "POST", `/draws/${cur.id}/release`, {
        token: ownerToken,
      });
      assert.equal(r1.status, 200);
      assert.equal(r1.body.releaseCount, 1);

      const r2 = await api(baseUrl, "POST", `/draws/${cur.id}/release`, {
        token: t2Token,
      });
      assert.equal(r2.status, 200);
      assert.equal(r2.body.releaseCount, 2);

      const released = await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "released", version: cur.version },
      });
      assert.equal(released.status, 200);
      cur = released.body.draw as typeof cur;
      assert.equal(cur.state, "released");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/workspaces/${workspaceId}/bonds`, {
          token: ownerToken,
          body: { label, collateral: 500, floor: 50 },
        });
      }
      const page = await api(baseUrl, "GET", `/workspaces/${workspaceId}/bonds?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.bonds as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_br").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Bondrail/);
    },
    { dep, webhookSecret: "whsec_br" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@br.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (
            await api(baseUrl, "POST", "/workspaces", {
              token,
              body: { name: `W${i}` },
            })
          ).status === 429
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
    const t1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `t1-${Math.random()}@br.test`, password: "x" },
    });
    const t2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `t2-${Math.random()}@br.test`, password: "x" },
    });
    const t1Token = String(t1.body.token);
    const t2Token = String(t2.body.token);
    const t2Id = String((t2.body.user as { id: string }).id);
    const ws = await api(baseUrl, "POST", "/workspaces", {
      token: t1Token,
      body: { name: "W" },
    });
    const workspaceId = String((ws.body.workspace as { id: string }).id);
    await api(baseUrl, "POST", `/workspaces/${workspaceId}/members`, {
      token: t1Token,
      body: { userId: t2Id, role: "treasurer" },
    });
    const bond = await api(baseUrl, "POST", `/workspaces/${workspaceId}/bonds`, {
      token: t1Token,
      body: { label: "B1", collateral: 1000, floor: 100 },
    });
    const bondId = String((bond.body.bond as { id: string }).id);
    const draw = (
      await api(baseUrl, "POST", `/bonds/${bondId}/draws`, {
        token: t1Token,
        body: { title: "t", amount: 200 },
      })
    ).body.draw as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
      token: t1Token,
      body: { to: "held", version: draw.version },
    });
    const version = Number((held.body.draw as { version: number }).version);
    await api(baseUrl, "POST", `/draws/${draw.id}/release`, { token: t1Token });
    await api(baseUrl, "POST", `/draws/${draw.id}/release`, { token: t2Token });
    await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
      token: t1Token,
      body: { to: "released", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
          token: t1Token,
          body: { to: "released", version },
        })
      ).status,
      409,
    );
  });
});
