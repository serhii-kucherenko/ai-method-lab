import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { penalty } from "../src/domain/penalty.js";
import { penaltyB } from "../src/domain/penaltyB.js";
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

const goodCitation = {
  classification: "serious",
  gravity_tier: "moderate",
  gbp_amount: 5000,
  size_pct: 0.3,
  history_pct: 0.1,
  good_faith_pct: 0.15,
  quick_fix_pct: 0,
};

const PAGES: Array<{ path: string; marker: RegExp }> = [
  { path: "/money-honesty.html", marker: /Kill A/i },
  { path: "/citations.html", marker: /data-catalog="live"/ },
  { path: "/citation-detail.html", marker: /data-detail="live"/ },
  { path: "/batch.html", marker: /data-batch="live"/ },
  { path: "/audit.html", marker: /data-audit="live"/ },
  { path: "/goldens.html", marker: /data-goldens="live"/ },
  { path: "/settings.html", marker: /data-settings="live"/ },
];

// --- G / D goldens + dual-impl ---

test("sustain: goldens cards all pass vs live engine (≥26)", () => {
  const listed = listGoldenCards();
  assert.ok(listed.total >= 26);
  assert.equal(listed.all_pass, true);
  assert.ok(listed.cards.every((c) => c.pass));
});

test("sustain: dual-impl A and B agree on serious serial", () => {
  const a = penalty(goodCitation);
  const b = penaltyB(goodCitation);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.penalty, b.penalty);
    assert.equal(a.steps.length, 4);
    assert.equal(b.steps.length, 4);
  }
});

test("sustain: dual-impl reject statutory-max cheat", () => {
  const input = { ...goodCitation, use_statutory_max: true };
  assert.equal(penalty(input).status, "reject");
  assert.equal(penaltyB(input).status, "reject");
});

test("sustain: dual-impl reject additive cheat", () => {
  const input = { ...goodCitation, additive_cheat: true };
  assert.equal(penalty(input).status, "reject");
  assert.equal(penaltyB(input).status, "reject");
});

test("sustain: dual-impl reject size on willful", () => {
  const input = { ...goodCitation, classification: "willful", size_pct: 0.3 };
  const a = penalty(input);
  const b = penaltyB(input);
  assert.equal(a.status, "reject");
  assert.equal(b.status, "reject");
  if (a.status === "reject" && b.status === "reject") {
    assert.equal(a.reason, b.reason);
  }
});

// --- A API ---

test("sustain: GET goldens requires auth and org membership", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "sustain-admin@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Sustain" })).json
      .org as { id: string };

    const anon = await api(base, "GET", `/orgs/${org.id}/goldens`);
    assert.equal(anon.status, 401);

    const ok = await api(base, "GET", `/orgs/${org.id}/goldens`, token);
    assert.equal(ok.status, 200);
    assert.ok((ok.json.total as number) >= 26);
    assert.equal(ok.json.all_pass, true);

    const outsider = await api(base, "POST", "/auth/register", undefined, {
      email: "outsider@oshamult.test",
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

test("sustain: forecast returns steps[] with serial balances", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "steps@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Steps" })).json.org as {
      id: string;
    };
    const cite = (
      await api(base, "POST", `/orgs/${org.id}/citations`, token, goodCitation)
    ).json.citation as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/citations/${cite.id}/forecast`,
      token,
    );
    assert.equal(fc.status, 200);
    assert.equal(fc.json.status, "ok");
    const steps = fc.json.steps as Array<{
      factor: string;
      balance_before: number;
      balance_after: number;
    }>;
    assert.equal(steps.length, 4);
    assert.equal(steps[0]!.factor, "size");
    assert.ok(steps[0]!.balance_after < steps[0]!.balance_before);
    assert.equal(fc.json.algorithm_version, "oshamult-v0");
  });
});

test("sustain: unauthenticated catalog returns 401", async () => {
  await withServer(50, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "unauth@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "U" })).json.org as {
      id: string;
    };
    const res = await api(base, "GET", `/orgs/${org.id}/citations`);
    assert.equal(res.status, 401);
  });
});

test("sustain: health reports product", async () => {
  await withServer(50, async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.product, "oshamult");
  });
});

// --- P pages ---

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

test("sustain: goldens.html is live browser", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/goldens.html`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /data-goldens="live"/);
    assert.match(body, /Kill A/i);
    assert.match(body, /forecast\s*\/\s*method experiment/i);
  });
});

test("sustain: try.html served offline-capable with Kill A", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/try.html`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /Kill A/i);
    assert.match(body, /consultants/i);
    assert.match(body, /additive/i);
    assert.doesNotMatch(body, /src="\//);
  });
});

// --- R RBAC ---

test("sustain: auditor reads goldens but cannot create citations", async () => {
  await withServer(150, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "r-admin@oshamult.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "r-auditor@oshamult.test",
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
      `/orgs/${org.id}/citations`,
      auditorToken,
      goodCitation,
    );
    assert.equal(create.status, 403);
  });
});

test("sustain: cross-org citation isolation", async () => {
  await withServer(150, async (base) => {
    const a = await api(base, "POST", "/auth/register", undefined, {
      email: "iso-a@oshamult.test",
      password: "pw",
    });
    const b = await api(base, "POST", "/auth/register", undefined, {
      email: "iso-b@oshamult.test",
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
    const cite = (
      await api(base, "POST", `/orgs/${orgA.id}/citations`, tokenA, goodCitation)
    ).json.citation as { id: string };
    const leak = await api(base, "GET", `/orgs/${orgB.id}/citations/${cite.id}`, tokenB);
    assert.equal(leak.status, 404);
    const cross = await api(base, "GET", `/orgs/${orgA.id}/citations/${cite.id}`, tokenB);
    assert.equal(cross.status, 403);
  });
});

// --- W webhook ---

test("sustain: webhook requires HMAC and idempotency key", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wh@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "WH" })).json.org as {
      id: string;
    };
    const settings = (
      await api(base, "GET", `/orgs/${org.id}/settings`, token)
    ).json.settings as { webhook_secret: string };
    const payload = JSON.stringify({ orgId: org.id, ...goodCitation });

    const noKey = await fetch(`${base}/webhooks/citations`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": createHmac("sha256", settings.webhook_secret)
          .update(payload)
          .digest("hex"),
      },
      body: payload,
    });
    assert.equal(noKey.status, 400);

    const sig = createHmac("sha256", settings.webhook_secret).update(payload).digest("hex");
    const ok = await fetch(`${base}/webhooks/citations`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "sustain-wh-1",
      },
      body: payload,
    });
    assert.equal(ok.status, 201);
  });
});

// --- C concurrency ---

test("sustain: concurrent batches both 200", async () => {
  await withServer(500, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-batch@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "Batch Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const cite = await api(base, "POST", `/orgs/${orgId}/citations`, token, goodCitation);
      ids.push(String((cite.json.citation as { id: string }).id));
    }
    const [a, b] = await Promise.all([
      api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
        citationIds: ids.slice(0, 2),
      }),
      api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
        citationIds: ids.slice(2),
      }),
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
  });
});

test("sustain: batch reject does not rewrite sibling ok", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "sib@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Sib" })).json.org as {
      id: string;
    };
    const good = (
      await api(base, "POST", `/orgs/${org.id}/citations`, token, goodCitation)
    ).json.citation as { id: string };
    const bad = (
      await api(base, "POST", `/orgs/${org.id}/citations`, token, {
        ...goodCitation,
        classification: "willful",
        size_pct: 0.3,
      })
    ).json.citation as { id: string };
    const batch = await api(base, "POST", `/orgs/${org.id}/batch/forecast`, token, {
      citationIds: [good.id, bad.id],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      citation_id: string;
      status: string;
      penalty?: number;
    }>;
    const g = results.find((r) => r.citation_id === good.id)!;
    const b = results.find((r) => r.citation_id === bad.id)!;
    assert.equal(g.status, "ok");
    assert.ok(Math.abs(Number(g.penalty) - 2677.5) <= 0.02);
    assert.equal(b.status, "reject");
  });
});

// --- M money honesty / Kill A copy ---

test("sustain: PRODUCT.md Kill A + no OIS replacement", () => {
  const md = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(md, /Kill A/);
  assert.match(md, /method experiment/i);
  assert.match(md, /consultants/i);
  assert.match(md, /Forbidden claims/i);
  assert.match(md, /not an OSHA filing system/i);
});

test("sustain: offline try.html Kill A standalone", () => {
  const html = readFileSync(join(root, "try.html"), "utf8");
  assert.match(html, /Kill A/i);
  assert.match(html, /consultants/i);
  assert.match(html, /settlement counsel/i);
  assert.match(html, /additive/i);
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /href="\/styles/);
});

test("sustain: honesty page Kill A + serial ≠ additive", () => {
  const html = readFileSync(join(root, "public/money-honesty.html"), "utf8");
  assert.match(html, /Kill A/i);
  assert.match(html, /serial\s*≠\s*additive|serial ≠ additive/i);
  assert.match(html, /forecast\s*\/\s*method experiment/i);
});
