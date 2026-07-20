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

async function register(baseUrl: string, email: string) {
  const res = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "secret" },
  });
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

async function setupProgram(baseUrl: string) {
  const admin = await register(baseUrl, `admin-${Math.random()}@grantlane.test`);
  const rev1 = await register(baseUrl, `rev1-${Math.random()}@grantlane.test`);
  const rev2 = await register(baseUrl, `rev2-${Math.random()}@grantlane.test`);
  const program = await api(baseUrl, "POST", "/programs", {
    token: admin.token,
    body: { name: "WF" },
  });
  const programId = String((program.body.program as { id: string }).id);
  for (const member of [
    { userId: rev1.userId, role: "reviewer" },
    { userId: rev2.userId, role: "reviewer" },
  ]) {
    await api(baseUrl, "POST", `/programs/${programId}/members`, {
      token: admin.token,
      body: member,
    });
  }
  const appRes = await api(baseUrl, "POST", `/programs/${programId}/applications`, {
    token: admin.token,
    body: { orgName: "River Arts", amountRequested: 10000 },
  });
  const application = appRes.body.application as {
    id: string;
    state: string;
    version: number;
  };
  return { admin, rev1, rev2, programId, application };
}

test("cannot activate without dual reviewer sign-off", async () => {
  await withServer(async (baseUrl) => {
    const { admin, rev1, application } = await setupProgram(baseUrl);
    const noSign = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/activate`,
      { token: admin.token, body: { approvedAmount: 8000, version: application.version } },
    );
    assert.equal(noSign.status, 400);
    assert.match(String(noSign.body.error), /sign-off/i);

    await api(baseUrl, "POST", `/applications/${application.id}/sign-off`, {
      token: rev1.token,
    });
    const oneSign = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/activate`,
      { token: admin.token, body: { approvedAmount: 8000, version: application.version } },
    );
    assert.equal(oneSign.status, 400);
  });
});

test("submitted → active → closed with milestones and budget ceiling", async () => {
  await withServer(async (baseUrl) => {
    const { admin, rev1, rev2, application: start } = await setupProgram(baseUrl);
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev1.token,
    });
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev2.token,
    });
    const activated = await api(
      baseUrl,
      "POST",
      `/applications/${start.id}/activate`,
      { token: admin.token, body: { approvedAmount: 5000, version: start.version } },
    );
    assert.equal(activated.status, 200);
    let cur = activated.body.application as {
      id: string;
      state: string;
      version: number;
      approvedAmount: number;
    };
    assert.equal(cur.state, "active");
    assert.equal(cur.approvedAmount, 5000);

    const m1 = await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
      token: admin.token,
      body: { label: "Phase 1", amount: 3000 },
    });
    const m2 = await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
      token: admin.token,
      body: { label: "Phase 2", amount: 3000 },
    });
    const milestone1Id = String((m1.body.milestone as { id: string }).id);
    const milestone2Id = String((m2.body.milestone as { id: string }).id);

    assert.equal(
      (
        await api(baseUrl, "POST", `/milestones/${milestone1Id}/pay`, {
          token: admin.token,
        })
      ).status,
      200,
    );
    const overBudget = await api(baseUrl, "POST", `/milestones/${milestone2Id}/pay`, {
      token: admin.token,
    });
    assert.equal(overBudget.status, 400);
    assert.match(String(overBudget.body.error), /budget/i);

    await api(baseUrl, "POST", `/milestones/${milestone2Id}/waive`, {
      token: admin.token,
    });

    const closed = await api(
      baseUrl,
      "POST",
      `/applications/${cur.id}/close`,
      { token: admin.token, body: { version: cur.version } },
    );
    assert.equal(closed.status, 200);
    cur = closed.body.application as typeof cur;
    assert.equal(cur.state, "closed");
  });
});

test("clawback reduces paid total on active application", async () => {
  await withServer(async (baseUrl) => {
    const { admin, rev1, rev2, application: start } = await setupProgram(baseUrl);
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev1.token,
    });
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev2.token,
    });
    const activated = await api(
      baseUrl,
      "POST",
      `/applications/${start.id}/activate`,
      { token: admin.token, body: { approvedAmount: 3000, version: start.version } },
    );
    const cur = activated.body.application as { id: string; version: number };
    const m = await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
      token: admin.token,
      body: { label: "Disbursement", amount: 1500 },
    });
    const milestoneId = String((m.body.milestone as { id: string }).id);
    await api(baseUrl, "POST", `/milestones/${milestoneId}/pay`, { token: admin.token });
    const claw = await api(baseUrl, "POST", `/milestones/${milestoneId}/clawback`, {
      token: admin.token,
    });
    assert.equal(claw.status, 200);
    assert.equal((claw.body.application as { paidTotal: number }).paidTotal, 0);
    assert.equal((claw.body.milestone as { state: string }).state, "clawed_back");

    const closedFail = await api(baseUrl, "POST", `/applications/${cur.id}/close`, {
      token: admin.token,
      body: { version: (activated.body.application as { version: number }).version },
    });
    assert.equal(closedFail.status, 400);
  });
});

test("stale version returns 409 on activate", async () => {
  await withServer(async (baseUrl) => {
    const { admin, rev1, rev2, application } = await setupProgram(baseUrl);
    await api(baseUrl, "POST", `/applications/${application.id}/sign-off`, {
      token: rev1.token,
    });
    await api(baseUrl, "POST", `/applications/${application.id}/sign-off`, {
      token: rev2.token,
    });
    const first = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/activate`,
      { token: admin.token, body: { approvedAmount: 1000, version: application.version } },
    );
    assert.equal(first.status, 200);
    const stale = await api(
      baseUrl,
      "POST",
      `/applications/${application.id}/activate`,
      { token: admin.token, body: { approvedAmount: 1000, version: application.version } },
    );
    assert.equal(stale.status, 409);
  });
});

test("cannot close with planned milestone remaining", async () => {
  await withServer(async (baseUrl) => {
    const { admin, rev1, rev2, application: start } = await setupProgram(baseUrl);
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev1.token,
    });
    await api(baseUrl, "POST", `/applications/${start.id}/sign-off`, {
      token: rev2.token,
    });
    const activated = await api(
      baseUrl,
      "POST",
      `/applications/${start.id}/activate`,
      { token: admin.token, body: { approvedAmount: 2000, version: start.version } },
    );
    const cur = activated.body.application as { id: string; version: number };
    await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
      token: admin.token,
      body: { label: "Pending", amount: 500 },
    });
    const closeFail = await api(baseUrl, "POST", `/applications/${cur.id}/close`, {
      token: admin.token,
      body: { version: cur.version },
    });
    assert.equal(closeFail.status, 400);
    assert.match(String(closeFail.body.error), /milestone/i);
  });
});
