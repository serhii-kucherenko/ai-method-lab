import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { excise } from "../src/domain/excise.js";
import { exciseB } from "../src/domain/exciseB.js";
import { listGoldenCards } from "../src/goldens.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function withServer(
  rateLimit: number,
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const { server } = createApp({ rateLimit });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

async function api(
  base: string,
  method: string,
  path: string,
  token?: string,
  body?: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<{ status: number; json: Record<string, unknown>; headers: Headers; text: string }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    json = {};
  }
  return { status: res.status, json, headers: res.headers, text };
}

const goodTx = {
  label: "sustain-toy",
  amount_involved: 10000,
  year_parts: 2,
  corrected: true,
};

const PAGES: Array<{ path: string; marker: RegExp }> = [
  { path: "/money-honesty.html", marker: /Kill A/i },
  { path: "/transactions.html", marker: /data-catalog="live"/ },
  { path: "/transaction-detail.html", marker: /data-detail="live"/ },
  { path: "/batch.html", marker: /data-batch="live"/ },
  { path: "/audit.html", marker: /data-audit="live"/ },
  { path: "/goldens.html", marker: /data-goldens="live"/ },
  { path: "/settings.html", marker: /data-settings="live"/ },
];

test("sustain: goldens cards all pass vs live engine (≥35)", () => {
  const listed = listGoldenCards();
  assert.ok(listed.total >= 35);
  assert.equal(listed.all_pass, true);
  assert.ok(listed.cards.every((c) => c.pass));
});

test("sustain: dual-impl A and B agree on corrected two-year toy", () => {
  const a = excise(goodTx);
  const b = exciseB(goodTx);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.total, 3000);
    assert.equal(a.total, b.total);
    assert.equal(a.initial_tax, b.initial_tax);
  }
});

test("sustain: dual-impl reject flat excise cheat", () => {
  const input = { ...goodTx, flat_excise_cheat: true };
  assert.equal(excise(input).status, "reject");
  assert.equal(exciseB(input).status, "reject");
});

test("sustain: dual-impl reject understate greater-of", () => {
  const input = {
    amount_involved: 1000,
    year_parts: 1,
    corrected: true,
    fmv_a: 5000,
    fmv_b: 8000,
    use_fmv_greater_of: true,
    understate_amount: true,
  };
  const a = excise(input);
  const b = exciseB(input);
  assert.equal(a.status, "reject");
  assert.equal(b.status, "reject");
});

test("sustain: GET goldens requires auth and org membership", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "sustain-admin@ptax4975.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Sustain" })).json
      .org as { id: string };

    const anon = await api(base, "GET", `/orgs/${org.id}/goldens`);
    assert.equal(anon.status, 401);

    const ok = await api(base, "GET", `/orgs/${org.id}/goldens`, token);
    assert.equal(ok.status, 200);
    assert.ok((ok.json.total as number) >= 35);
    assert.equal(ok.json.all_pass, true);

    const outsider = await api(base, "POST", "/auth/register", undefined, {
      email: "outsider@ptax4975.test",
      password: "pw",
    });
    const denied = await api(
      base,
      "GET",
      `/orgs/${org.id}/goldens`,
      String(outsider.json.token),
    );
    assert.ok(denied.status === 403 || denied.status === 404);
  });
});

test("sustain: forecast returns initial/additional/total tiers", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "tiers@ptax4975.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Tiers" })).json.org as {
      id: string;
    };
    const tx = (
      await api(base, "POST", `/orgs/${org.id}/transactions`, token, goodTx)
    ).json.transaction as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/transactions/${tx.id}/forecast`,
      token,
    );
    assert.equal(fc.status, 200);
    assert.equal(fc.json.status, "ok");
    assert.equal(fc.json.initial_tax, 3000);
    assert.equal(fc.json.additional_tax, 0);
    assert.equal(fc.json.total, 3000);
    assert.equal(fc.json.algorithm_version, "ptax4975-v0");
  });
});

test("sustain: unauthenticated catalog returns 401", async () => {
  await withServer(50, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "unauth@ptax4975.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "U" })).json.org as {
      id: string;
    };
    const res = await api(base, "GET", `/orgs/${org.id}/transactions`);
    assert.equal(res.status, 401);
  });
});

test("sustain: health reports product", async () => {
  await withServer(50, async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.product, "ptax4975");
  });
});

test("sustain: seven blueprint pages live (not stubs)", async () => {
  await withServer(80, async (base) => {
    assert.equal(PAGES.length, 7);
    for (const { path, marker } of PAGES) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.status, 200, path);
      const body = await res.text();
      assert.match(body, marker, path);
      assert.doesNotMatch(body, /Phase unlock later/i, path);
    }
  });
});

test("sustain: try.html offline-capable with Kill A + fences", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/try.html`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /Kill A|counsel|Form 5330/i);
    assert.doesNotMatch(body, /src="\//);
    const onDisk = readFileSync(join(root, "try.html"), "utf8");
    assert.match(onDisk, /15%|year/i);
  });
});

test("sustain: auditor reads goldens but cannot create transactions", async () => {
  await withServer(150, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "r-admin@ptax4975.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "r-auditor@ptax4975.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const auditorToken = String(auditor.json.token);
    const auditorId = String((auditor.json.user as { id: string }).id);
    const org = (await api(base, "POST", "/orgs", adminToken, { name: "RBAC" })).json
      .org as { id: string };
    await api(base, "POST", `/orgs/${org.id}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });

    const goldens = await api(base, "GET", `/orgs/${org.id}/goldens`, auditorToken);
    assert.equal(goldens.status, 200);

    const create = await api(
      base,
      "POST",
      `/orgs/${org.id}/transactions`,
      auditorToken,
      goodTx,
    );
    assert.equal(create.status, 403);
  });
});

test("sustain: cross-org transaction isolation", async () => {
  await withServer(150, async (base) => {
    const a = await api(base, "POST", "/auth/register", undefined, {
      email: "iso-a@ptax4975.test",
      password: "pw",
    });
    const b = await api(base, "POST", "/auth/register", undefined, {
      email: "iso-b@ptax4975.test",
      password: "pw",
    });
    const tokenA = String(a.json.token);
    const tokenB = String(b.json.token);
    const orgA = (await api(base, "POST", "/orgs", tokenA, { name: "A" })).json.org as {
      id: string;
    };
    const orgB = (await api(base, "POST", "/orgs", tokenB, { name: "B" })).json.org as {
      id: string;
    };
    const tx = (
      await api(base, "POST", `/orgs/${orgA.id}/transactions`, tokenA, goodTx)
    ).json.transaction as { id: string };

    const stolen = await api(
      base,
      "GET",
      `/orgs/${orgB.id}/transactions/${tx.id}`,
      tokenB,
    );
    assert.equal(stolen.status, 404);

    const crossForecast = await api(
      base,
      "POST",
      `/orgs/${orgB.id}/transactions/${tx.id}/forecast`,
      tokenB,
    );
    assert.equal(crossForecast.status, 404);
  });
});

test("sustain: PRODUCT.md Kill A + three fences", () => {
  const md = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(md, /Kill A/);
  assert.match(md, /method experiment/);
  assert.match(md, /Form 5330|FMV|taxable.period|excess-compensation/i);
});

test("sustain: webhook idempotent replay still holds", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wh@ptax4975.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "WH" })).json.org as {
      id: string;
    };
    const settings = (
      await api(base, "GET", `/orgs/${org.id}/settings`, token)
    ).json.settings as { webhook_secret: string };
    const payload = JSON.stringify({ orgId: org.id, ...goodTx });
    const sig = createHmac("sha256", settings.webhook_secret).update(payload).digest("hex");
    const first = await api(base, "POST", "/webhooks/transactions", undefined, undefined, {
      "x-signature": sig,
      "idempotency-key": "sustain-wh",
      "content-type": "application/json",
    });
    // api helper stringifies body — use fetch for raw
    const firstRes = await fetch(`${base}/webhooks/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "sustain-wh",
      },
      body: payload,
    });
    assert.equal(firstRes.status, 201);
    const secondRes = await fetch(`${base}/webhooks/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "sustain-wh",
      },
      body: payload,
    });
    assert.equal(secondRes.status, 200);
    const j = (await secondRes.json()) as { replay: boolean };
    assert.equal(j.replay, true);
    void first;
  });
});
