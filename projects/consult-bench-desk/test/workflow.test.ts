import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/httpApp.js";
import { canTransition, createStore } from "../src/store.js";

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
): Promise<{ status: number; json: Record<string, unknown>; text?: string }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv")) {
    return { status: res.status, json: {}, text: await res.text() };
  }
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

test("workflow: lifecycle edges unit", () => {
  assert.equal(canTransition("draft", "queued"), true);
  assert.equal(canTransition("queued", "running"), true);
  assert.equal(canTransition("running", "succeeded"), true);
  assert.equal(canTransition("running", "failed"), true);
  assert.equal(canTransition("draft", "running"), false);
  assert.equal(canTransition("succeeded", "queued"), false);
  assert.equal(canTransition("failed", "running"), false);
  createStore();
});

test("workflow: legal transitions, reject illegal, audit, batch, scenario, pages", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wf@ddd.test",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);
    const userId = String((reg.json.user as { id: string }).id);

    const org = await api(base, "POST", "/orgs", token, { name: "WF Lab" });
    assert.equal(org.status, 201);
    const orgId = String((org.json.org as { id: string }).id);

    const project = await api(base, "POST", `/orgs/${orgId}/projects`, token, {
      name: "toy-corpus",
      topic_label: "papers",
      min_n_budget: 100,
    });
    const projectId = String((project.json.project as { id: string }).id);

    const draftJob = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      token,
      {
        label: "module-a",
        query: "corpus=contaminated",
        min_n: 40,
      },
    );
    assert.equal(draftJob.status, 201);
    const jobId = String((draftJob.json.job as { id: string }).id);
    assert.equal((draftJob.json.job as { status: string }).status, "draft");

    const skip = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/transition`,
      token,
      { to: "running" },
    );
    assert.equal(skip.status, 409);
    assert.equal(skip.json.error, "illegal_transition");

    const toQueued = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/transition`,
      token,
      { to: "queued" },
    );
    assert.equal(toQueued.status, 200);
    assert.equal((toQueued.json.job as { status: string }).status, "queued");
    const vQueued = Number((toQueued.json.job as { version: number }).version);

    const toRunning = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}`,
      token,
      { status: "running", expected_version: vQueued },
    );
    assert.equal(toRunning.status, 200);
    assert.equal((toRunning.json.job as { status: string }).status, "running");
    const vRunning = Number((toRunning.json.job as { version: number }).version);

    const stale = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/transition`,
      token,
      { to: "succeeded", expected_version: vQueued },
    );
    assert.equal(stale.status, 409);
    assert.equal(stale.json.error, "version_conflict");

    const succeed = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/transition`,
      token,
      { to: "succeeded", expected_version: vRunning },
    );
    assert.equal(succeed.status, 200);
    assert.equal((succeed.json.job as { status: string }).status, "succeeded");

    const reopen = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/transition`,
      token,
      { to: "queued" },
    );
    assert.equal(reopen.status, 409);
    assert.equal(reopen.json.error, "illegal_transition");

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, token);
    assert.equal(audit.status, 200);
    assert.ok(Number(audit.json.total) >= 3);
    const entries = audit.json.entries as Array<{
      actor_user_id: string;
      from_status: string;
      to_status: string;
      job_id: string;
    }>;
    assert.ok(entries.some((e) => e.actor_user_id === userId && e.to_status === "queued"));
    assert.ok(entries.some((e) => e.job_id === jobId && e.from_status === "running"));

    const csv = await api(base, "GET", `/orgs/${orgId}/audit?format=csv`, token);
    assert.equal(csv.status, 200);
    assert.match(String(csv.text), /from_status,to_status/);
    assert.match(String(csv.text), /queued|running|succeeded/);

    const jobB = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      token,
      { label: "batch-ok", status: "queued" },
    );
    const jobC = await api(
      base,
      "POST",
      `/orgs/${orgId}/projects/${projectId}/jobs`,
      token,
      { label: "batch-bad", status: "draft" },
    );
    const idB = String((jobB.json.job as { id: string }).id);
    const idC = String((jobC.json.job as { id: string }).id);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/jobs/transition`, token, {
      transitions: [
        { project_id: projectId, job_id: idB, to: "running" },
        { project_id: projectId, job_id: idC, to: "succeeded" },
        { project_id: projectId, job_id: "missing", to: "queued" },
      ],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      job_id: string;
      status: string;
      reason?: string;
    }>;
    assert.equal(results.length, 3);
    const byId = Object.fromEntries(results.map((r) => [r.job_id, r]));
    assert.equal(byId[idB]!.status, "ok");
    assert.equal(byId[idC]!.status, "reject");
    assert.equal(byId[idC]!.reason, "illegal_transition");
    assert.equal(byId["missing"]!.status, "reject");
    assert.equal(byId["missing"]!.reason, "job_not_found");

    const stillDraft = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects/${projectId}/jobs/${idC}`,
      token,
    );
    assert.equal((stillDraft.json.job as { status: string }).status, "draft");

    const scenario = await api(
      base,
      "GET",
      `/orgs/${orgId}/projects/${projectId}/jobs/${jobId}/scenarios`,
      token,
    );
    assert.equal(scenario.status, 200);
    const naive = scenario.json.naive as { bench_score: number; action: string };
    const paper = scenario.json.integrated as {
      bench_score: number;
      action: string;
      path: string[];
    };
    assert.ok(typeof naive.bench_score === "number");
    assert.ok(typeof paper.bench_score === "number");
    assert.ok(naive.bench_score >= paper.bench_score);
    assert.deepEqual(paper.path, [
      "read_perception_floor",
      "weight_by_perception_floor",
      "score_multi_skill_plan",
    ]);
    assert.match(String(scenario.json.honesty), /not a replacement/i);

    const pages = [
      { path: "/", marker: /data-home="live"/ },
      { path: "/jobs.html", marker: /data-jobs="live"/ },
      { path: "/honesty.html", marker: /data-honesty="live"/ },
      { path: "/lifecycle.html", marker: /data-lifecycle="live"/ },
      { path: "/scenario.html", marker: /data-scenario="live"/ },
      { path: "/audit.html", marker: /data-audit="live"/ },
    ];
    for (const page of pages) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});
