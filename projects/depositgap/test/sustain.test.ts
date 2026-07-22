import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { trueUp } from "../src/domain/forecast.js";
import { trueUpB } from "../src/domain/forecastB.js";
import { listGoldenCards } from "../src/goldens.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function withServer(
  rateLimit: number,
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const { server } = createApp({ rateLimit });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    server.close();
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

const fixtureA = {
  order_type: "AD",
  deposit_rate: 0.1,
  assessed_rate: 0.25,
  rate_class: "exporter_specific",
  entered_value: 1000000,
  order_published_on: "2023-01-01",
  liquidated_on: "2024-01-01",
  interest_annual_rate: 0.08,
  skip_interest: false,
};

const fixtureB = {
  ...fixtureA,
  deposit_rate: 0.25,
  assessed_rate: 0.1,
  por: "POR-REFUND",
};

// --- G / D themes ---

test("sustain: goldens cards all pass vs live engine (≥23)", () => {
  const listed = listGoldenCards();
  assert.ok(listed.total >= 23);
  assert.equal(listed.all_pass, true);
  assert.ok(listed.cards.every((c) => c.pass));
});

test("sustain: dual-impl listGoldenCards matches fixture count", () => {
  const listed = listGoldenCards();
  assert.ok(listed.total >= 23);
  assert.ok(listed.cards.some((c) => c.expect_status === "ok"));
  assert.ok(listed.cards.some((c) => c.expect_status === "reject"));
});

test("sustain: dual-impl A and B agree on toy underdeposit", () => {
  const a = trueUp(fixtureA);
  const b = trueUpB(fixtureA);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.duty_delta, b.duty_delta);
    assert.equal(a.interest, b.interest);
    assert.equal(a.true_up, b.true_up);
    assert.equal(a.duty_delta, 150000);
    assert.equal(a.true_up, 162000);
  }
});

test("sustain: dual-impl reject on skip-interest cheat", () => {
  const input = { ...fixtureA, skip_interest: true };
  assert.equal(trueUp(input).status, "reject");
  assert.equal(trueUpB(input).status, "reject");
});

// --- A API / contract ---

test("sustain: GET goldens requires auth and org membership", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "sustain-admin@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Sustain" })).json
      .org as { id: string };

    const anon = await api(base, "GET", `/orgs/${org.id}/goldens`);
    assert.equal(anon.status, 401);

    const ok = await api(base, "GET", `/orgs/${org.id}/goldens`, token);
    assert.equal(ok.status, 200);
    assert.ok((ok.json.total as number) >= 23);
    assert.equal(ok.json.all_pass, true);

    const outsider = await api(base, "POST", "/auth/register", undefined, {
      email: "outsider@depositgap.test",
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

test("sustain: forecast response separates duty_delta interest true_up", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "a-fields@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Fields" })).json
      .org as { id: string };
    const entry = (
      await api(base, "POST", `/orgs/${org.id}/entries`, token, fixtureA)
    ).json.entry as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/entries/${entry.id}/forecast`,
      token,
    );
    assert.equal(fc.status, 200);
    assert.equal(fc.json.status, "ok");
    assert.equal(fc.json.duty_delta, 150000);
    assert.equal(fc.json.interest, 12000);
    assert.equal(fc.json.true_up, 162000);
    assert.equal(fc.json.days, 365);
    assert.ok("algorithm_version" in fc.json);
  });
});

test("sustain: overdeposit forecast signs refund (negative duty_delta)", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "refund@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Refund" })).json
      .org as { id: string };
    const entry = (
      await api(base, "POST", `/orgs/${org.id}/entries`, token, fixtureB)
    ).json.entry as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/entries/${entry.id}/forecast`,
      token,
    );
    assert.equal(fc.status, 200);
    assert.ok((fc.json.duty_delta as number) < 0);
    assert.ok((fc.json.true_up as number) < 0);
  });
});

test("sustain: unauthenticated catalog returns 401", async () => {
  await withServer(50, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "unauth@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "U" })).json.org as {
      id: string;
    };
    const res = await api(base, "GET", `/orgs/${org.id}/entries`);
    assert.equal(res.status, 401);
  });
});

test("sustain: health reports product and migrations", async () => {
  await withServer(50, async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.product, "depositgap");
    assert.ok((health.json.migrations as number) >= 1);
  });
});

// --- P page critical paths ---

test("sustain: goldens.html is live (not stub)", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/goldens.html`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /data-goldens="live"/);
    assert.match(body, /\/orgs\/.*\/goldens|\/goldens/);
    assert.match(body, /Kill A|delinquency/i);
    assert.match(body, /forecast\s*\/\s*method experiment/i);
    assert.doesNotMatch(body, /stub page|Phase unlock later/i);
  });
});

test("sustain: eight page critical paths respond 200 with live markers", async () => {
  await withServer(80, async (base) => {
    const checks: Array<{ path: string; marker: RegExp }> = [
      { path: "/money-honesty.html", marker: /Kill A/i },
      { path: "/entries.html", marker: /data-catalog="live"/ },
      { path: "/entry-detail.html", marker: /data-detail="live"/ },
      { path: "/batch.html", marker: /data-batch="live"/ },
      { path: "/cash-impact.html", marker: /data-cash="live"/ },
      { path: "/audit.html", marker: /data-audit="live"/ },
      { path: "/goldens.html", marker: /data-goldens="live"/ },
      { path: "/settings.html", marker: /data-settings="live"/ },
    ];
    for (const { path, marker } of checks) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.status, 200, path);
      const body = await res.text();
      assert.match(body, marker, path);
      assert.doesNotMatch(body, /Phase unlock later/i, path);
    }
  });
});

test("sustain: try.html is served by the app", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/try.html`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /Forecast true-up|true-up/i);
    assert.match(body, /depositgap/i);
    assert.match(body, /Kill A/i);
  });
});

// --- R RBAC ---

test("sustain: auditor can read goldens but cannot create entries", async () => {
  await withServer(150, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "r-admin@depositgap.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "r-auditor@depositgap.test",
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

    const create = await api(base, "POST", `/orgs/${org.id}/entries`, auditorToken, fixtureA);
    assert.equal(create.status, 403);
  });
});

test("sustain: auditor cannot run forecast", async () => {
  await withServer(150, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "r2-admin@depositgap.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "r2-auditor@depositgap.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const auditorToken = String(auditor.json.token);
    const auditorId = String((auditor.json.user as { id: string }).id);
    const org = (await api(base, "POST", "/orgs", adminToken, { name: "RBAC2" })).json
      .org as { id: string };
    await api(base, "POST", `/orgs/${org.id}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });
    const entry = (
      await api(base, "POST", `/orgs/${org.id}/entries`, adminToken, fixtureA)
    ).json.entry as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/entries/${entry.id}/forecast`,
      auditorToken,
    );
    assert.equal(fc.status, 403);
  });
});

test("sustain: analyst can forecast after membership", async () => {
  await withServer(150, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "r3-admin@depositgap.test",
      password: "pw",
    });
    const analyst = await api(base, "POST", "/auth/register", undefined, {
      email: "r3-analyst@depositgap.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const analystToken = String(analyst.json.token);
    const analystId = String((analyst.json.user as { id: string }).id);
    const org = (await api(base, "POST", "/orgs", adminToken, { name: "RBAC3" })).json
      .org as { id: string };
    await api(base, "POST", `/orgs/${org.id}/members`, adminToken, {
      userId: analystId,
      role: "analyst",
    });
    const entry = (
      await api(base, "POST", `/orgs/${org.id}/entries`, analystToken, fixtureA)
    ).json.entry as { id: string };
    const fc = await api(
      base,
      "POST",
      `/orgs/${org.id}/entries/${entry.id}/forecast`,
      analystToken,
    );
    assert.equal(fc.status, 200);
    assert.equal(fc.json.duty_delta, 150000);
  });
});

// --- W webhook ---

test("sustain: webhook rejects missing signature", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wh@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "WH" })).json.org as {
      id: string;
    };
    const settings = (
      await api(base, "GET", `/orgs/${org.id}/settings`, token)
    ).json.settings as { webhook_secret: string };
    assert.ok(settings.webhook_secret);

    const body = { orgId: org.id, entry: fixtureA };
    const bad = await api(base, "POST", "/webhooks/entries", undefined, body);
    assert.equal(bad.status, 401);
  });
});

test("sustain: webhook accepts HMAC and idempotent key", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wh2@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "WH2" })).json.org as {
      id: string;
    };
    const settings = (
      await api(base, "GET", `/orgs/${org.id}/settings`, token)
    ).json.settings as { webhook_secret: string };
    const payload = JSON.stringify({
      orgId: org.id,
      entry: { ...fixtureA, por: "POR-WH2" },
    });
    const sig = createHmac("sha256", settings.webhook_secret).update(payload).digest("hex");
    const res = await fetch(`${base}/webhooks/entries`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "sustain-key-1",
      },
      body: payload,
    });
    assert.equal(res.status, 201);
    const first = (await res.json()) as { entry: { id: string }; replay?: boolean };

    const replayRes = await fetch(`${base}/webhooks/entries`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "sustain-key-1",
      },
      body: payload,
    });
    assert.equal(replayRes.status, 200);
    const replay = (await replayRes.json()) as { entry: { id: string }; replay: boolean };
    assert.equal(replay.entry.id, first.entry.id);
    assert.equal(replay.replay, true);
  });
});

// --- C concurrency ---

test("sustain: batch two entries stay independent", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "batch@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Batch" })).json
      .org as { id: string };
    const good = (
      await api(base, "POST", `/orgs/${org.id}/entries`, token, fixtureA)
    ).json.entry as { id: string };
    const cheat = (
      await api(base, "POST", `/orgs/${org.id}/entries`, token, {
        ...fixtureA,
        skip_interest: true,
      })
    ).json.entry as { id: string };
    const batch = await api(base, "POST", `/orgs/${org.id}/batch/forecast`, token, {
      entryIds: [good.id, cheat.id],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      entry_id: string;
      status: string;
      duty_delta?: number;
    }>;
    assert.equal(results.length, 2);
    const goodLine = results.find((r) => r.entry_id === good.id);
    const cheatLine = results.find((r) => r.entry_id === cheat.id);
    assert.equal(goodLine?.status, "ok");
    assert.equal(goodLine?.duty_delta, 150000);
    assert.equal(cheatLine?.status, "reject");
  });
});

// --- M money honesty / Kill A / try ---

test("sustain: offline try.html exists and rejects skip-interest cheat", () => {
  const path = join(root, "try.html");
  assert.equal(existsSync(path), true);
  const body = readFileSync(path, "utf8");
  assert.match(body, /Kill A|Honesty|brokers/i);
  assert.match(body, /skip_interest|skip interest/i);
  assert.match(body, /Cannot skip interest|must reject/i);
  assert.match(body, /6621|stand-in/i);
  assert.match(body, /duty_delta|Duty delta/i);
  assert.match(body, /interest/i);
  assert.match(body, /true_up|True-up/i);
  assert.doesNotMatch(body, /replaces your broker|ACE replacement/i);
});

test("sustain: money honesty page keeps Kill A fence", async () => {
  await withServer(50, async (base) => {
    const res = await fetch(`${base}/money-honesty.html`);
    const body = await res.text();
    assert.match(body, /Kill A/i);
    assert.match(body, /Brokers and CBP still own liquidation/i);
    assert.match(body, /deposit\s*≠\s*final|deposit is not the final/i);
    assert.match(body, /delinquency\s*≠\s*deposit gap|Delinquency ≠ deposit gap/i);
    assert.doesNotMatch(body, /prints the ACE bill/i);
  });
});

test("sustain: PRODUCT.md keeps forecast-only Kill A language", () => {
  const body = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(body, /Kill A|brokers|CBP/i);
  assert.match(body, /forecast/i);
  assert.doesNotMatch(body, /replaces ACE|ACE replacement/i);
});

test("sustain: try defaults match $150k duty before interest toy", () => {
  const body = readFileSync(join(root, "try.html"), "utf8");
  assert.match(body, /value="1000000"/);
  assert.match(body, /value="0\.10"/);
  assert.match(body, /value="0\.25"/);
  const got = trueUp({
    deposit_rate: 0.1,
    assessed_rate: 0.25,
    entered_value: 1000000,
    order_published_on: "2023-01-01",
    liquidated_on: "2024-01-01",
    interest_annual_rate: 0.08,
  });
  assert.equal(got.status, "ok");
  if (got.status === "ok") {
    assert.equal(got.duty_delta, 150000);
  }
});

test("sustain: cash-impact surfaces signed refund after overdeposit forecast", async () => {
  await withServer(100, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "cash@depositgap.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api(base, "POST", "/orgs", token, { name: "Cash" })).json
      .org as { id: string };
    const entry = (
      await api(base, "POST", `/orgs/${org.id}/entries`, token, fixtureB)
    ).json.entry as { id: string };
    await api(base, "POST", `/orgs/${org.id}/entries/${entry.id}/forecast`, token);
    const cash = await api(base, "GET", `/orgs/${org.id}/cash-impact`, token);
    assert.equal(cash.status, 200);
    const totals = cash.json.totals as { duty_delta: number; true_up: number };
    assert.ok(totals.duty_delta < 0);
    assert.ok(totals.true_up < 0);
  });
});

test("sustain: matrix floor — suite count documented via goldens+pages", () => {
  const listed = listGoldenCards();
  assert.ok(listed.total >= 23, "G- floor");
  const pages = [
    "money-honesty.html",
    "entries.html",
    "entry-detail.html",
    "batch.html",
    "cash-impact.html",
    "audit.html",
    "goldens.html",
    "settings.html",
  ];
  for (const p of pages) {
    assert.equal(existsSync(join(root, "public", p)), true, p);
  }
  assert.equal(existsSync(join(root, "try.html")), true);
});
