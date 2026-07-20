import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

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
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

async function setupBoard(baseUrl: string) {
  const auth = await api(baseUrl, "POST", "/auth/register", {
    body: { email: `wf-${Date.now()}@screenlane.test`, password: "secret" },
  });
  const token = String(auth.body.token);
  const board = await api(baseUrl, "POST", "/boards", {
    token,
    body: { name: "WF" },
  });
  const boardId = String((board.body.board as { id: string }).id);
  const job = await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
    token,
    body: { title: "Engineer" },
  });
  const jobId = String((job.body.job as { id: string }).id);
  const cand = await api(baseUrl, "POST", `/boards/${boardId}/candidates`, {
    token,
    body: { name: "Casey", email: "casey@ex.com" },
  });
  const candidateId = String((cand.body.candidate as { id: string }).id);
  const app = await api(baseUrl, "POST", `/jobs/${jobId}/applications`, {
    token,
    body: { candidateId },
  });
  const application = app.body.application as {
    id: string;
    state: string;
    version: number;
  };
  return { token, jobId, application };
}

test("cannot enter screening without criteria", async () => {
  await withServer(async (baseUrl) => {
    const { token, application } = await setupBoard(baseUrl);
    const res = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/transition`,
      { token, body: { to: "screening", version: application.version } },
    );
    assert.equal(res.status, 400);
    assert.match(String(res.body.error), /criteria/i);
  });
});

test("applied → screening → decided with scores and audit", async () => {
  await withServer(async (baseUrl) => {
    const { token, jobId, application: start } = await setupBoard(baseUrl);
    const crit = await api(baseUrl, "POST", `/jobs/${jobId}/criteria`, {
      token,
      body: { label: "Systems", weight: 2 },
    });
    assert.equal(crit.status, 201);
    const criterionId = String((crit.body.criterion as { id: string }).id);

    let cur = start;
    const toScreen = await api(
      baseUrl,
      "POST",
      `/applications/${cur.id}/transition`,
      { token, body: { to: "screening", version: cur.version } },
    );
    assert.equal(toScreen.status, 200);
    cur = toScreen.body.application as typeof cur;

    const score = await api(baseUrl, "POST", `/applications/${cur.id}/scores`, {
      token,
      body: { criterionId, value: 4 },
    });
    assert.equal(score.status, 201);
    assert.equal(
      (score.body.application as { scoreAverage: number }).scoreAverage,
      4,
    );

    const illegal = await api(
      baseUrl,
      "POST",
      `/applications/${cur.id}/transition`,
      { token, body: { to: "applied", version: cur.version } },
    );
    assert.equal(illegal.status, 400);

    const decide = await api(
      baseUrl,
      "POST",
      `/applications/${cur.id}/transition`,
      {
        token,
        body: { to: "decided", version: cur.version, decision: "hired" },
      },
    );
    assert.equal(decide.status, 200);
    assert.equal(
      (decide.body.application as { state: string; decision: string }).state,
      "decided",
    );
    assert.equal(
      (decide.body.application as { decision: string }).decision,
      "hired",
    );

    const audit = await api(baseUrl, "GET", `/applications/${cur.id}/audit`, {
      token,
    });
    assert.equal(audit.status, 200);
    assert.ok((audit.body.audit as unknown[]).length >= 2);
  });
});

test("optimistic concurrency rejects stale version", async () => {
  await withServer(async (baseUrl) => {
    const { token, jobId, application } = await setupBoard(baseUrl);
    await api(baseUrl, "POST", `/jobs/${jobId}/criteria`, {
      token,
      body: { label: "Culture", weight: 1 },
    });
    const first = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/transition`,
      { token, body: { to: "screening", version: application.version } },
    );
    assert.equal(first.status, 200);
    const stale = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/transition`,
      { token, body: { to: "screening", version: application.version } },
    );
    assert.equal(stale.status, 409);
  });
});
