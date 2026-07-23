import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/httpApp.js";
import {
  createOrg,
  createProject,
  issueToken,
  registerUser,
  seedScaleJobs,
} from "../src/store.js";

const SCALE_JOBS = 250;

async function withServer(
  fn: (
    base: string,
    store: ReturnType<typeof createApp>["store"],
  ) => Promise<void>,
  opts: { rateLimit?: number } = {},
): Promise<void> {
  const { server, store } = createApp({ rateLimit: opts.rateLimit ?? 5000 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base, store);
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

test("scale: walk ≥250 jobs; limit cap; concurrent batch safety", async () => {
  await withServer(async (base, store) => {
    const user = registerUser(store, "scale@ddd.test", "pw");
    const token = issueToken(store, user.id);
    const org = createOrg(store, user.id, "Scale Org");
    const project = createProject(store, org.id, {
      name: "scale-project",
      plant_label: "lab-corpus",
      order_budget: 4,
    });
    const jobIds = seedScaleJobs(store, org.id, project.id, SCALE_JOBS);
    assert.equal(jobIds.length, SCALE_JOBS);

    const first = await api(
      base,
      "GET",
      `/orgs/${org.id}/projects/${project.id}/jobs`,
      token,
    );
    assert.equal(first.status, 200);
    assert.equal(first.json.total, SCALE_JOBS);
    assert.equal(first.json.limit, 20);
    assert.equal((first.json.jobs as unknown[]).length, 20);

    const capped = await api(
      base,
      "GET",
      `/orgs/${org.id}/projects/${project.id}/jobs?limit=999`,
      token,
    );
    assert.equal(capped.status, 200);
    assert.equal(capped.json.limit, 100);
    assert.equal((capped.json.jobs as unknown[]).length, 100);

    const seen = new Set<string>();
    let offset = 0;
    while (true) {
      const page = await api(
        base,
        "GET",
        `/orgs/${org.id}/projects/${project.id}/jobs?limit=40&offset=${offset}`,
        token,
      );
      assert.equal(page.status, 200);
      const jobs = page.json.jobs as Array<{ id: string }>;
      if (!jobs.length) break;
      for (const row of jobs) {
        assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
        seen.add(row.id);
      }
      offset += jobs.length;
      if (jobs.length < 40) break;
    }
    assert.equal(seen.size, SCALE_JOBS);

    const slice = jobIds.slice(0, 20);
    const concurrent = await Promise.all(
      [0, 1, 2, 3, 4].map((n) => {
        const chunk = slice.slice(n * 4, n * 4 + 4);
        return api(base, "POST", `/orgs/${org.id}/batch/jobs/transition`, token, {
          transitions: chunk.map((job_id) => ({
            project_id: project.id,
            job_id,
            to: "running",
          })),
        });
      }),
    );
    for (const res of concurrent) {
      assert.equal(res.status, 200);
      const results = res.json.results as Array<{ status: string; to?: string }>;
      assert.equal(results.length, 4);
      assert.ok(results.every((r) => r.status === "ok" && r.to === "running"));
    }

    const overlapId = jobIds[20]!;
    const overlap = await Promise.all([
      api(base, "POST", `/orgs/${org.id}/batch/jobs/transition`, token, {
        transitions: [
          {
            project_id: project.id,
            job_id: overlapId,
            to: "running",
            expected_version: 1,
          },
        ],
      }),
      api(base, "POST", `/orgs/${org.id}/batch/jobs/transition`, token, {
        transitions: [
          {
            project_id: project.id,
            job_id: overlapId,
            to: "running",
            expected_version: 1,
          },
        ],
      }),
    ]);
    for (const res of overlap) assert.equal(res.status, 200);
    const outcomes = overlap.flatMap(
      (r) => r.json.results as Array<{ status: string; reason?: string }>,
    );
    const oks = outcomes.filter((o) => o.status === "ok");
    const rejects = outcomes.filter((o) => o.status === "reject");
    assert.equal(oks.length, 1);
    assert.equal(rejects.length, 1);
    assert.ok(
      rejects[0]!.reason === "version_conflict" ||
        rejects[0]!.reason === "illegal_transition",
    );

    const dup = await api(base, "POST", `/orgs/${org.id}/batch/jobs/transition`, token, {
      transitions: [
        { project_id: project.id, job_id: jobIds[21]!, to: "running" },
        { project_id: project.id, job_id: jobIds[21]!, to: "cancelled" },
      ],
    });
    assert.equal(dup.status, 200);
    const dupResults = dup.json.results as Array<{ status: string; reason?: string }>;
    assert.equal(dupResults[0]!.status, "ok");
    assert.equal(dupResults[1]!.status, "reject");
    assert.equal(dupResults[1]!.reason, "duplicate_in_batch");

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
  });
});

test("scale: rate limit returns 429 with Retry-After", async () => {
  await withServer(
    async (base) => {
      const reg = await api(base, "POST", "/auth/register", undefined, {
        email: "rl-scale@ddd.test",
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
