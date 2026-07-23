import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";

async function withServer(
  fn: (base: string) => Promise<void>,
  opts: { rateLimit?: number } = {},
): Promise<void> {
  const { server } = createApp({ rateLimit: opts.rateLimit ?? 500 });
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
): Promise<{ status: number; json: Record<string, unknown>; headers: Headers }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    status: res.status,
    json: (await res.json()) as Record<string, unknown>,
    headers: res.headers,
  };
}

test("integrate: webhook HMAC + idempotency, settings RBAC, pagination", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@int.mcd.test",
      password: "pw",
    });
    const adminToken = String(adminReg.json.token);
    const viewerReg = await api(base, "POST", "/auth/register", undefined, {
      email: "viewer@int.mcd.test",
      password: "pw",
    });
    const viewerToken = String(viewerReg.json.token);
    const viewerId = String((viewerReg.json.user as { id: string }).id);

    const orgRes = await api(base, "POST", "/orgs", adminToken, { name: "Int Org" });
    const orgId = String((orgRes.json.org as { id: string }).id);
    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: viewerId,
      role: "viewer",
    });

    const projectRes = await api(base, "POST", `/orgs/${orgId}/projects`, adminToken, {
      name: "webhook-target",
      model_name: "toy-7b",
      target_backend: "mlir-demo",
    });
    const projectId = String((projectRes.json.project as { id: string }).id);

    const settingsRes = await api(base, "GET", `/orgs/${orgId}/settings`, adminToken);
    assert.equal(settingsRes.status, 200);
    const secret = String(
      (settingsRes.json.settings as { webhook_secret: string }).webhook_secret,
    );
    assert.ok(secret.startsWith("whsec_"));

    const viewerSettings = await api(base, "GET", `/orgs/${orgId}/settings`, viewerToken);
    assert.equal(viewerSettings.status, 200);
    assert.equal(
      (viewerSettings.json.settings as { webhook_secret: null }).webhook_secret,
      null,
    );

    const viewerRotate = await api(base, "PATCH", `/orgs/${orgId}/settings`, viewerToken, {
      rotate_webhook_secret: true,
    });
    assert.equal(viewerRotate.status, 403);

    const payloadObj = {
      orgId,
      project_id: projectId,
      label: "webhook-compile",
      mlir_pass_hint: "lower-to-linalg",
      status: "queued",
    };
    const payload = JSON.stringify(payloadObj);
    const bad = await fetch(`${base}/webhooks/jobs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const first = await fetch(`${base}/webhooks/jobs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-mcd-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as {
      job: { id: string; label: string };
      replay: boolean;
    };
    assert.equal(firstJson.replay, false);
    assert.equal(firstJson.job.label, "webhook-compile");
    const jobId = firstJson.job.id;

    const replay = await fetch(`${base}/webhooks/jobs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-mcd-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(replay.status, 200);
    const replayJson = (await replay.json()) as {
      job: { id: string };
      replay: boolean;
    };
    assert.equal(replayJson.replay, true);
    assert.equal(replayJson.job.id, jobId);

    for (let i = 0; i < 3; i += 1) {
      await api(base, "POST", `/orgs/${orgId}/projects`, adminToken, {
        name: `page-${i}`,
        model_name: `model-${i}`,
      });
    }
    const page = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects?limit=2&offset=0`,
      adminToken,
    );
    assert.equal(page.status, 200);
    assert.equal((page.json.projects as unknown[]).length, 2);
    assert.ok(Number(page.json.total) >= 4);
    assert.equal(page.json.limit, 2);

    const search = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects?q=webhook-target`,
      adminToken,
    );
    assert.equal(search.status, 200);
    assert.ok((search.json.projects as unknown[]).length >= 1);

    const jobPage = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects/${projectId}/jobs?limit=10&q=webhook-compile`,
      adminToken,
    );
    assert.equal(jobPage.status, 200);
    assert.ok((jobPage.json.jobs as unknown[]).length >= 1);

    const settingsPage = await fetch(`${base}/settings.html`);
    assert.equal(settingsPage.status, 200);
    const settingsHtml = await settingsPage.text();
    assert.match(settingsHtml, /data-settings="live"/);
    assert.match(settingsHtml, /webhook|HMAC|Rotate/i);
    assert.doesNotMatch(settingsHtml, /authors' compiler is replaced/i);

    for (const path of [
      "/",
      "/jobs.html",
      "/lifecycle.html",
      "/scenario.html",
      "/audit.html",
      "/honesty.html",
      "/settings.html",
    ]) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.status, 200, path);
    }

    const honesty = await fetch(`${base}/honesty.html`);
    const honestyHtml = await honesty.text();
    assert.match(honestyHtml, /not a replacement/i);
  });
});

test("integrate: rate limit returns 429 with Retry-After", async () => {
  await withServer(
    async (base) => {
      const reg = await api(base, "POST", "/auth/register", undefined, {
        email: "rate@int.mcd.test",
        password: "pw",
      });
      const token = String(reg.json.token);
      let hit429 = false;
      for (let i = 0; i < 8; i += 1) {
        const res = await api(base, "POST", "/orgs", token, { name: `r${i}` });
        if (res.status === 429) {
          hit429 = true;
          assert.equal(res.json.error, "rate_limit_exceeded");
          assert.equal(res.headers.get("retry-after"), "1");
          break;
        }
      }
      assert.equal(hit429, true);
    },
    { rateLimit: 3 },
  );
});
