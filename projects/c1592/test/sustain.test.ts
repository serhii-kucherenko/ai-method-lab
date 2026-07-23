import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";

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
): Promise<{ status: number; json: Record<string, unknown> }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

const PAGES = [
  { path: "/money-honesty.html", marker: /Kill A/i },
  { path: "/violations.html", marker: /data-catalog="live"/ },
  { path: "/violation-detail.html", marker: /data-detail="live"/ },
  { path: "/batch.html", marker: /data-batch="live"/ },
  { path: "/audit.html", marker: /data-audit="live"/ },
  { path: "/settings.html", marker: /data-settings="live"/ },
  { path: "/goldens.html", marker: /data-goldens="live"/ },
];

test("sustain: all product pages live (≥7)", async () => {
  await withServer(500, async (base) => {
    assert.ok(PAGES.length >= 7);
    for (const page of PAGES) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});

test("sustain: goldens API ≥25 all_pass; auditor can read", async () => {
  await withServer(500, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "s-admin@c1592.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "s-auditor@c1592.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const auditorToken = String(auditor.json.token);
    const auditorId = String((auditor.json.user as { id: string }).id);
    const org = await api(base, "POST", "/orgs", adminToken, { name: "Sustain Org" });
    const orgId = String((org.json.org as { id: string }).id);
    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });
    const goldens = await api(base, "GET", `/orgs/${orgId}/goldens`, auditorToken);
    assert.equal(goldens.status, 200);
    assert.ok(Number(goldens.json.total) >= 25);
    assert.equal(goldens.json.all_pass, true);
    const create = await api(base, "POST", `/orgs/${orgId}/violations`, auditorToken, {
      culpability: "negligence",
      duty_loss: 1,
      domestic_value: 1,
      dutiable_value: 1,
    });
    assert.equal(create.status, 403);
  });
});

test("sustain: offline try.html is standalone with Kill A", () => {
  const html = readFileSync(join(root, "try.html"), "utf8");
  assert.match(html, /Kill A|counsel|CBP/i);
  assert.match(html, /200000|200,000/);
  assert.match(html, /method experiment/i);
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /href="\/styles/);
});

test("sustain: PRODUCT Kill A + statutory-max honesty", () => {
  const md = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(md, /Kill A/);
  assert.match(md, /method experiment/i);
  assert.match(md, /1592|statutory maximum/i);
});

test("sustain: concurrent batches both 200", async () => {
  await withServer(500, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-batch@c1592.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "Batch Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const v = await api(base, "POST", `/orgs/${orgId}/violations`, token, {
        culpability: "negligence",
        duty_loss: 100000,
        domestic_value: 500000,
        dutiable_value: 100000,
      });
      ids.push(String((v.json.violation as { id: string }).id));
    }
    const [a, b] = await Promise.all([
      api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
        violation_ids: ids.slice(0, 2),
      }),
      api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
        violation_ids: ids.slice(2),
      }),
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
  });
});

test("sustain: webhook HMAC still required", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-wh@c1592.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WH Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const settings = await api(base, "GET", `/orgs/${orgId}/settings`, token);
    const secret = String(
      (settings.json.settings as { webhook_secret: string }).webhook_secret,
    );
    const payload = JSON.stringify({
      orgId,
      culpability: "fraud",
      duty_loss: 0,
      domestic_value: 80,
      dutiable_value: 0,
    });
    const bad = await fetch(`${base}/webhooks/violations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const ok = await fetch(`${base}/webhooks/violations`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-c1592-signature": sig,
        "idempotency-key": "sustain-wh-1",
      },
      body: payload,
    });
    assert.equal(ok.status, 201);
  });
});
