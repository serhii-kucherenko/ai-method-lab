import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import {
  canTransition,
  dualWaiveReady,
  isSeverityViolation,
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
  assert.equal(canTransition("open", "waived"), true);
  assert.equal(canTransition("open", "enforced"), true);
  assert.equal(canTransition("waived", "open"), false);
  assert.equal(isSeverityViolation(5, 3), true);
  assert.equal(isSeverityViolation(2, 3), false);
  assert.equal(dualWaiveReady(1), false);
  assert.equal(dualWaiveReady(2), true);
});

test("health auth ACL severity dual-waive integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@pf.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);
      const ownerId = String((owner.body.user as { id: string }).id);

      assert.equal(
        (await api(baseUrl, "POST", "/packs", { body: { name: "x" } })).status,
        401,
      );

      const auditor = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "aud@pf.test", password: "x" },
      });
      const auditorToken = String(auditor.body.token);
      const auditorId = String((auditor.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@pf.test", password: "x" },
      });

      const pack = await api(baseUrl, "POST", "/packs", {
        token: ownerToken,
        body: { name: "Security" },
      });
      const packId = String((pack.body.pack as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/packs/${packId}/rules`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/packs/${packId}/members`, {
        token: ownerToken,
        body: { userId: auditorId, role: "auditor" },
      });

      const rule = await api(baseUrl, "POST", `/packs/${packId}/rules`, {
        token: ownerToken,
        body: {
          name: "no-public-s3",
          expression: "resource.public == false",
          severityThreshold: 3,
        },
      });
      const ruleId = String((rule.body.rule as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/rules/${ruleId}/violations`, {
            token: ownerToken,
            body: { title: "mild", severity: 2 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/rules/${ruleId}/violations`, {
          token: ownerToken,
          body: { title: "bucket open", severity: 5 },
        })
      ).body.violation as { id: string; version: number; state: string };

      assert.equal(
        (
          await api(baseUrl, "POST", `/violations/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "waived", version: cur.version },
          })
        ).status,
        400,
      );

      const a1 = await api(baseUrl, "POST", `/violations/${cur.id}/approve-waive`, {
        token: ownerToken,
      });
      assert.equal(a1.status, 200);
      assert.equal(a1.body.approvalCount, 1);

      const a2 = await api(baseUrl, "POST", `/violations/${cur.id}/approve-waive`, {
        token: auditorToken,
      });
      assert.equal(a2.status, 200);
      assert.equal(a2.body.approvalCount, 2);

      const waived = await api(baseUrl, "POST", `/violations/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "waived", version: cur.version },
      });
      assert.equal(waived.status, 200);
      cur = waived.body.violation as typeof cur;
      assert.equal(cur.state, "waived");
      assert.ok(store.sideEffects >= 1);

      const enforced = await api(baseUrl, "POST", `/violations/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "enforced", version: cur.version },
      });
      assert.equal(enforced.status, 200);
      assert.equal(dep.failures, 0);

      // direct enforce path
      const v2 = (
        await api(baseUrl, "POST", `/rules/${ruleId}/violations`, {
          token: ownerToken,
          body: { title: "force", severity: 9 },
        })
      ).body.violation as { id: string; version: number };
      assert.equal(
        (
          await api(baseUrl, "POST", `/violations/${v2.id}/transition`, {
            token: ownerToken,
            body: { to: "enforced", version: v2.version },
          })
        ).status,
        200,
      );

      for (const name of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/packs/${packId}/rules`, {
          token: ownerToken,
          body: { name, expression: "x" },
        });
      }
      const page = await api(baseUrl, "GET", `/packs/${packId}/rules?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.rules as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_pf").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Policyforge/);
      void ownerId;
    },
    { dep, webhookSecret: "whsec_pf" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@pf.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/packs", { token, body: { name: `P${i}` } })).status ===
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

test("stale version 409 after waive", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@pf.test`, password: "x" },
    });
    const auditor = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `a-${Math.random()}@pf.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const auditorToken = String(auditor.body.token);
    const auditorId = String((auditor.body.user as { id: string }).id);
    const pack = await api(baseUrl, "POST", "/packs", {
      token: ownerToken,
      body: { name: "P" },
    });
    const packId = String((pack.body.pack as { id: string }).id);
    await api(baseUrl, "POST", `/packs/${packId}/members`, {
      token: ownerToken,
      body: { userId: auditorId, role: "auditor" },
    });
    const rule = await api(baseUrl, "POST", `/packs/${packId}/rules`, {
      token: ownerToken,
      body: { name: "r", expression: "x", severityThreshold: 1 },
    });
    const ruleId = String((rule.body.rule as { id: string }).id);
    const v = (
      await api(baseUrl, "POST", `/rules/${ruleId}/violations`, {
        token: ownerToken,
        body: { title: "t", severity: 5 },
      })
    ).body.violation as { id: string; version: number };
    await api(baseUrl, "POST", `/violations/${v.id}/approve-waive`, {
      token: ownerToken,
    });
    await api(baseUrl, "POST", `/violations/${v.id}/approve-waive`, {
      token: auditorToken,
    });
    await api(baseUrl, "POST", `/violations/${v.id}/transition`, {
      token: ownerToken,
      body: { to: "waived", version: v.version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/violations/${v.id}/transition`, {
          token: ownerToken,
          body: { to: "waived", version: v.version },
        })
      ).status,
      409,
    );
  });
});
