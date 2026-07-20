import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";

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

test("health + auth + ACL", async () => {
  await withServer(async (baseUrl, store) => {
    assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
    assert.ok(migrationCount(store.db) >= 2);
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "a@ir.test", password: "x" },
    });
    assert.equal(auth.status, 201);
    assert.equal(
      (await api(baseUrl, "POST", "/rooms", { body: { name: "x" } })).status,
      401,
    );
    const out = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "out@ir.test", password: "x" },
    });
    const room = await api(baseUrl, "POST", "/rooms", {
      token: String(auth.body.token),
      body: { name: "War" },
    });
    const roomId = String((room.body.room as { id: string }).id);
    assert.equal(
      (
        await api(baseUrl, "GET", `/rooms/${roomId}/incidents`, {
          token: String(out.body.token),
        })
      ).status,
      403,
    );
  });
});

test("sev1 path: ack + action + postmortem", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `wf-${Math.random()}@ir.test`, password: "x" },
    });
    const token = String(auth.body.token);
    const room = await api(baseUrl, "POST", "/rooms", {
      token,
      body: { name: "R" },
    });
    const roomId = String((room.body.room as { id: string }).id);
    let cur = (
      await api(baseUrl, "POST", `/rooms/${roomId}/incidents`, {
        token,
        body: { title: "Outage", severity: 1 },
      })
    ).body.incident as { id: string; version: number };
    cur = (
      await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
        token,
        body: { to: "mitigating", version: cur.version },
      })
    ).body.incident as typeof cur;
    assert.equal(
      (
        await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
          token,
          body: { to: "resolved", version: cur.version },
        })
      ).status,
      400,
    );
    const action = await api(baseUrl, "POST", `/incidents/${cur.id}/actions`, {
      token,
      body: { title: "Fail over" },
    });
    await api(baseUrl, "POST", `/actions/${(action.body.action as { id: string }).id}/complete`, {
      token,
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
          token,
          body: { to: "resolved", version: cur.version },
        })
      ).status,
      400,
    );
    await api(baseUrl, "POST", `/incidents/${cur.id}/ack`, { token });
    const resolved = await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
      token,
      body: { to: "resolved", version: cur.version },
    });
    assert.equal(resolved.status, 200);
    cur = resolved.body.incident as typeof cur;
    assert.equal(
      (
        await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
          token,
          body: { to: "closed", version: cur.version },
        })
      ).status,
      400,
    );
    await api(baseUrl, "POST", `/incidents/${cur.id}/postmortem`, {
      token,
      body: { body: "Root cause: deploy" },
    });
    const closed = await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
      token,
      body: { to: "closed", version: cur.version },
    });
    assert.equal(closed.status, 200);
  });
});

test("HMAC + notify + pagination + 429 + UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
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
      const sig = createHmac("sha256", "whsec_ir").update(payload).digest("hex");
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

      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "int@ir.test", password: "x" },
      });
      const token = String(auth.body.token);
      const room = await api(baseUrl, "POST", "/rooms", {
        token,
        body: { name: "I" },
      });
      const roomId = String((room.body.room as { id: string }).id);
      for (const title of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/rooms/${roomId}/incidents`, {
          token,
          body: { title, severity: 3 },
        });
      }
      const page = await api(
        baseUrl,
        "GET",
        `/rooms/${roomId}/incidents?limit=2&offset=0`,
        { token },
      );
      assert.equal((page.body.incidents as unknown[]).length, 2);

      let cur = (
        await api(baseUrl, "POST", `/rooms/${roomId}/incidents`, {
          token,
          body: { title: "Notify", severity: 3 },
        })
      ).body.incident as { id: string; version: number };
      cur = (
        await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
          token,
          body: { to: "mitigating", version: cur.version },
        })
      ).body.incident as typeof cur;
      const act = await api(baseUrl, "POST", `/incidents/${cur.id}/actions`, {
        token,
        body: { title: "Fix" },
      });
      await api(baseUrl, "POST", `/actions/${(act.body.action as { id: string }).id}/complete`, {
        token,
      });
      const resolved = await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
        token,
        body: { to: "resolved", version: cur.version },
      });
      assert.equal(resolved.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      const html = await (await fetch(`${baseUrl}/`)).text();
      assert.match(html, /Incidentrail/);
    },
    { dep, webhookSecret: "whsec_ir" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@ir.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/rooms", { token, body: { name: `R${i}` } }))
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

test("stale version 409", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `st-${Math.random()}@ir.test`, password: "x" },
    });
    const token = String(auth.body.token);
    const room = await api(baseUrl, "POST", "/rooms", {
      token,
      body: { name: "S" },
    });
    const roomId = String((room.body.room as { id: string }).id);
    const cur = (
      await api(baseUrl, "POST", `/rooms/${roomId}/incidents`, {
        token,
        body: { title: "X", severity: 3 },
      })
    ).body.incident as { id: string; version: number };
    await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
      token,
      body: { to: "mitigating", version: cur.version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/incidents/${cur.id}/transition`, {
          token,
          body: { to: "mitigating", version: cur.version },
        })
      ).status,
      409,
    );
  });
});
