import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const { server } = createApp({ rateLimit: 500 });
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

test("crud: orgs, projects, compile jobs, viewer 403, html pages", async () => {
  await withServer(async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.display_name, "Model Compiler Desk");

    const claim = await api(base, "GET", "/claim");
    assert.equal(claim.status, 200);
    assert.match(String(claim.json.honesty), /not a replacement/i);

    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@mcd.crud.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const viewerReg = await api(base, "POST", "/auth/register", undefined, {
      email: "viewer@mcd.crud.test",
      password: "pw",
    });
    assert.equal(viewerReg.status, 201);
    const viewerToken = String(viewerReg.json.token);
    const viewerId = String((viewerReg.json.user as { id: string }).id);

    const noAuth = await api(base, "POST", "/orgs", undefined, { name: "x" });
    assert.equal(noAuth.status, 401);

    const orgRes = await api(base, "POST", "/orgs", adminToken, {
      name: "MLIR Lab",
    });
    assert.equal(orgRes.status, 201);
    const orgId = String((orgRes.json.org as { id: string }).id);

    const member = await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: viewerId,
      role: "viewer",
    });
    assert.equal(member.status, 201);

    const projectRes = await api(base, "POST", `/orgs/${orgId}/projects`, adminToken, {
      name: "llama-toy",
      model_name: "toy-7b",
      target_backend: "mlir-demo",
    });
    assert.equal(projectRes.status, 201);
    const projectId = String((projectRes.json.project as { id: string }).id);

    const viewerCreate = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects`,
      viewerToken,
      { name: "blocked" },
    );
    assert.equal(viewerCreate.status, 403);

    const listed = await api(base, "GET", `/orgs/${orgId}/projects`, adminToken);
    assert.equal(listed.status, 200);
    assert.equal((listed.json.projects as unknown[]).length, 1);

    const patchedProject = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/projects/${projectId}`,
      adminToken,
      { notes: "pass pipeline sketch" },
    );
    assert.equal(patchedProject.status, 200);
    assert.equal(
      (patchedProject.json.project as { notes: string }).notes,
      "pass pipeline sketch",
    );

    const jobRes = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      adminToken,
      {
        label: "lower-to-linalg",
        status: "queued",
        mlir_pass_hint: "lower-to-linalg",
      },
    );
    assert.equal(jobRes.status, 201);
    const jobId = String((jobRes.json.job as { id: string }).id);
    assert.equal((jobRes.json.job as { status: string }).status, "queued");

    const viewerJob = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      viewerToken,
      { label: "nope" },
    );
    assert.equal(viewerJob.status, 403);

    const jobsList = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      viewerToken,
    );
    assert.equal(jobsList.status, 200);
    assert.equal((jobsList.json.jobs as unknown[]).length, 1);

    const patchedJob = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}`,
      adminToken,
      { status: "running" },
    );
    assert.equal(patchedJob.status, 200);
    assert.equal((patchedJob.json.job as { status: string }).status, "running");

    const badStatus = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}`,
      adminToken,
      { status: "explode" },
    );
    assert.equal(badStatus.status, 400);

    const deletedJob = await api(
      base,
      "DELETE",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}`,
      adminToken,
    );
    assert.equal(deletedJob.status, 200);

    const home = await fetch(`${base}/`);
    assert.equal(home.status, 200);
    const homeBody = await home.text();
    assert.match(homeBody, /Model Compiler Desk/);
    assert.match(homeBody, /data-home="live"/);

    const jobsPage = await fetch(`${base}/jobs.html`);
    assert.equal(jobsPage.status, 200);
    const jobsBody = await jobsPage.text();
    assert.match(jobsBody, /Compile jobs/i);
    assert.match(jobsBody, /data-jobs="live"/);
    assert.match(jobsBody, /mcd_token|Bearer/);

    const honesty = await fetch(`${base}/honesty.html`);
    assert.equal(honesty.status, 200);
    const honestyBody = await honesty.text();
    assert.match(honestyBody, /Model Compiler Desk/);
    assert.match(honestyBody, /not a replacement/i);
    assert.match(honestyBody, /data-honesty="live"/);
    assert.match(honestyBody, /2607\.15865|tpu-mlir/);
  });
});
