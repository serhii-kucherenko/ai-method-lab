import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
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
  { path: "/", marker: /data-home="live"/ },
  { path: "/jobs.html", marker: /data-jobs="live"/ },
  { path: "/lifecycle.html", marker: /data-lifecycle="live"/ },
  { path: "/scenario.html", marker: /data-scenario="live"/ },
  { path: "/batch.html", marker: /data-batch="live"/ },
  { path: "/audit.html", marker: /data-audit="live"/ },
  { path: "/goldens.html", marker: /data-goldens="live"/ },
  { path: "/honesty.html", marker: /data-honesty="live"/ },
  { path: "/settings.html", marker: /data-settings="live"/ },
];

test("sustain: all product pages live (≥9)", async () => {
  await withServer(500, async (base) => {
    assert.ok(PAGES.length >= 6);
    for (const page of PAGES) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      const body = await res.text();
      assert.match(body, page.marker, page.path);
      assert.match(body, /Drug Discovery Desk/, page.path);
      // Never brand the desk with the paper short name (code URL on honesty is ok).
      assert.doesNotMatch(body, /<h1>[^<]*DrugGen/i, page.path);
      assert.doesNotMatch(body, /<title>[^<]*DrugGen/i, page.path);
    }
  });
});

test("sustain: goldens API ≥25 all_pass; viewer can read", async () => {
  await withServer(500, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "s-admin@ddd.test",
      password: "pw",
    });
    const viewer = await api(base, "POST", "/auth/register", undefined, {
      email: "s-viewer@ddd.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const viewerToken = String(viewer.json.token);
    const viewerId = String((viewer.json.user as { id: string }).id);
    const org = await api(base, "POST", "/orgs", adminToken, { name: "Sustain Org" });
    const orgId = String((org.json.org as { id: string }).id);
    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: viewerId,
      role: "viewer",
    });
    const goldens = await api(base, "GET", `/orgs/${orgId}/goldens`, viewerToken);
    assert.equal(goldens.status, 200);
    assert.ok(Number(goldens.json.total) >= 25);
    assert.equal(goldens.json.all_pass, true);
    const pack = listGoldenCards();
    assert.ok(pack.total >= 25);
    assert.equal(pack.all_pass, true);
  });
});

test("sustain: offline try.html is standalone with honesty", () => {
  const html = readFileSync(join(root, "try.html"), "utf8");
  assert.match(html, /Honesty/i);
  assert.match(html, /Drug Discovery Desk/);
  assert.match(html, /2607\.08404/);
  assert.match(html, /oncology,kinase,solid-tumor/);
  assert.match(html, /not.*replacement for the authors/i);
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /href="\/styles/);
  assert.doesNotMatch(html, /fetch\(/);
});

test("sustain: PRODUCT honesty + feature bar ≥15", () => {
  const md = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(md, /not.*replacement for the authors/i);
  assert.match(md, /Live features \(18/);
  assert.match(md, /Pages \(9/);
  assert.match(md, /Maturity checklist/);
});

test("sustain: honesty links tutor guide", async () => {
  await withServer(100, async (base) => {
    const res = await fetch(`${base}/honesty.html`);
    const body = await res.text();
    assert.match(body, /tutor-guide-link/);
    assert.match(body, /07-drug-discovery-desk-lessons/);
  });
});

test("sustain: concurrent batches both 200", async () => {
  await withServer(500, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-batch@ddd.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "Batch Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const project = await api(base, "POST", `/orgs/${orgId}/projects`, token, {
      name: "batch-proj",
      indication_label: "lab",
    });
    const projectId = String((project.json.project as { id: string }).id);
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const job = await api(base, "POST", `/orgs/${orgId}/projects/${projectId}/jobs`, token, {
        label: `b-${i}`,
        status: "queued",
      });
      ids.push(String((job.json.job as { id: string }).id));
    }
    const [a, b] = await Promise.all([
      api(base, "POST", `/orgs/${orgId}/batch/jobs/transition`, token, {
        transitions: ids.slice(0, 2).map((id) => ({
          project_id: projectId,
          job_id: id,
          to: "running",
        })),
      }),
      api(base, "POST", `/orgs/${orgId}/batch/jobs/transition`, token, {
        transitions: ids.slice(2).map((id) => ({
          project_id: projectId,
          job_id: id,
          to: "running",
        })),
      }),
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
  });
});

test("sustain: webhook HMAC still required", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-wh@ddd.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WH Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const project = await api(base, "POST", `/orgs/${orgId}/projects`, token, {
      name: "wh-proj",
    });
    const projectId = String((project.json.project as { id: string }).id);
    const settings = await api(base, "GET", `/orgs/${orgId}/settings`, token);
    const secret = String(
      (settings.json.settings as { webhook_secret: string }).webhook_secret,
    );
    const payload = JSON.stringify({
      orgId,
      project_id: projectId,
      label: "wh-job",
      status: "queued",
    });
    const bad = await fetch(`${base}/webhooks/jobs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const ok = await fetch(`${base}/webhooks/jobs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ddd-signature": sig,
        "idempotency-key": "sustain-wh-1",
      },
      body: payload,
    });
    assert.equal(ok.status, 201);
  });
});
