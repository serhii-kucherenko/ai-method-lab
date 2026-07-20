import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, closeAllowed, isSloBreach } from "../src/rules.js";

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
  assert.equal(canTransition("open", "remediating"), true);
  assert.equal(canTransition("open", "closed"), false);
  assert.equal(isSloBreach(600, 500), true);
  assert.equal(isSloBreach(400, 500), false);
  assert.equal(closeAllowed("waived", null), true);
  assert.equal(closeAllowed("remediating", null), false);
  assert.equal(closeAllowed("remediating", "fixed"), true);
});

test("health auth ACL + SLO path + integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "a@dc.test", password: "x" },
      });
      assert.equal(auth.status, 201);
      const token = String(auth.body.token);
      assert.equal(
        (await api(baseUrl, "POST", "/domains", { body: { name: "x" } })).status,
        401,
      );

      const out = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@dc.test", password: "x" },
      });
      const domain = await api(baseUrl, "POST", "/domains", {
        token,
        body: { name: "Orders" },
      });
      const domainId = String((domain.body.domain as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/domains/${domainId}/contracts`, {
            token: String(out.body.token),
          })
        ).status,
        403,
      );

      const contract = await api(baseUrl, "POST", `/domains/${domainId}/contracts`, {
        token,
        body: {
          name: "orders.v1",
          schemaJson: '{"type":"object"}',
          sloLatencyMs: 500,
        },
      });
      const contractId = String((contract.body.contract as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/contracts/${contractId}/breaches`, {
            token,
            body: { title: "ok", latencyMs: 100 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/contracts/${contractId}/breaches`, {
          token,
          body: { title: "Slow join", latencyMs: 900 },
        })
      ).body.breach as { id: string; version: number; state: string };
      assert.equal(cur.state, "open");

      assert.equal(
        (
          await api(baseUrl, "POST", `/breaches/${cur.id}/transition`, {
            token,
            body: { to: "remediating", version: cur.version },
          })
        ).status,
        400,
      );

      const rem = await api(baseUrl, "POST", `/breaches/${cur.id}/transition`, {
        token,
        body: {
          to: "remediating",
          version: cur.version,
          remediation_note: "Indexed FK",
        },
      });
      assert.equal(rem.status, 200);
      cur = rem.body.breach as typeof cur;

      const closed = await api(baseUrl, "POST", `/breaches/${cur.id}/transition`, {
        token,
        body: { to: "closed", version: cur.version },
      });
      assert.equal(closed.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const name of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/domains/${domainId}/contracts`, {
          token,
          body: { name, schemaJson: "{}" },
        });
      }
      const page = await api(
        baseUrl,
        "GET",
        `/domains/${domainId}/contracts?limit=2&offset=0`,
        { token },
      );
      assert.equal((page.body.contracts as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_dc").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Datacontract/);
    },
    { dep, webhookSecret: "whsec_dc" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@dc.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/domains", { token, body: { name: `D${i}` } }))
            .status === 429
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

test("waive path + stale 409", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `w-${Math.random()}@dc.test`, password: "x" },
    });
    const token = String(auth.body.token);
    const domain = await api(baseUrl, "POST", "/domains", {
      token,
      body: { name: "W" },
    });
    const domainId = String((domain.body.domain as { id: string }).id);
    const contract = await api(baseUrl, "POST", `/domains/${domainId}/contracts`, {
      token,
      body: { name: "c", schemaJson: "{}", sloLatencyMs: 100 },
    });
    const contractId = String((contract.body.contract as { id: string }).id);
    let cur = (
      await api(baseUrl, "POST", `/contracts/${contractId}/breaches`, {
        token,
        body: { title: "schema drift", latencyMs: null },
      })
    ).body.breach as { id: string; version: number };
    const waived = await api(baseUrl, "POST", `/breaches/${cur.id}/transition`, {
      token,
      body: { to: "waived", version: cur.version },
    });
    assert.equal(waived.status, 200);
    cur = waived.body.breach as typeof cur;
    const closed = await api(baseUrl, "POST", `/breaches/${cur.id}/transition`, {
      token,
      body: { to: "closed", version: cur.version },
    });
    assert.equal(closed.status, 200);

    const b2 = (
      await api(baseUrl, "POST", `/contracts/${contractId}/breaches`, {
        token,
        body: { title: "again", latencyMs: 200 },
      })
    ).body.breach as { id: string; version: number };
    await api(baseUrl, "POST", `/breaches/${b2.id}/transition`, {
      token,
      body: { to: "waived", version: b2.version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/breaches/${b2.id}/transition`, {
          token,
          body: { to: "waived", version: b2.version },
        })
      ).status,
      409,
    );
  });
});
