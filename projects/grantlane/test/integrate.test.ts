import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";

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

async function activateApp(
  baseUrl: string,
  adminToken: string,
  applicationId: string,
  version: number,
) {
  const rev1 = await register(baseUrl, `i-rev1-${Math.random()}@grantlane.test`);
  const rev2 = await register(baseUrl, `i-rev2-${Math.random()}@grantlane.test`);
  const detail = await api(baseUrl, "GET", `/applications/${applicationId}`, {
    token: adminToken,
  });
  const programId = String((detail.body.application as { programId: string }).programId);
  await api(baseUrl, "POST", `/programs/${programId}/members`, {
    token: adminToken,
    body: { userId: rev1.userId, role: "reviewer" },
  });
  await api(baseUrl, "POST", `/programs/${programId}/members`, {
    token: adminToken,
    body: { userId: rev2.userId, role: "reviewer" },
  });
  await api(baseUrl, "POST", `/applications/${applicationId}/sign-off`, {
    token: rev1.token,
  });
  await api(baseUrl, "POST", `/applications/${applicationId}/sign-off`, {
    token: rev2.token,
  });
  return api(baseUrl, "POST", `/applications/${applicationId}/activate`, {
    token: adminToken,
    body: { approvedAmount: 5000, version },
  });
}

test("inbound webhook requires valid HMAC", async () => {
  await withServer(
    async (baseUrl) => {
      const payload = JSON.stringify({ event: "ping" });
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-signature": "nope",
            },
            body: payload,
          })
        ).status,
        401,
      );
      const sig = createHmac("sha256", "whsec_grant")
        .update(payload)
        .digest("hex");
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-signature": sig,
            },
            body: payload,
          })
        ).status,
        200,
      );
    },
    { webhookSecret: "whsec_grant" },
  );
});

test("activate notifies dependency", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const admin = await register(baseUrl, "int@grantlane.test");
      const program = await api(baseUrl, "POST", "/programs", {
        token: admin.token,
        body: { name: "Notify" },
      });
      const programId = String((program.body.program as { id: string }).id);
      const app = await api(baseUrl, "POST", `/programs/${programId}/applications`, {
        token: admin.token,
        body: { orgName: "Arts Co", amountRequested: 8000 },
      });
      const application = app.body.application as { id: string; version: number };
      const activated = await activateApp(
        baseUrl,
        admin.token,
        application.id,
        application.version,
      );
      assert.equal(activated.status, 200);
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);
    },
    { dep },
  );
});

test("close notifies dependency", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const admin = await register(baseUrl, "close@grantlane.test");
      const program = await api(baseUrl, "POST", "/programs", {
        token: admin.token,
        body: { name: "Close" },
      });
      const programId = String((program.body.program as { id: string }).id);
      const app = await api(baseUrl, "POST", `/programs/${programId}/applications`, {
        token: admin.token,
        body: { orgName: "Close Co", amountRequested: 1000 },
      });
      const application = app.body.application as { id: string; version: number };
      const activated = await activateApp(
        baseUrl,
        admin.token,
        application.id,
        application.version,
      );
      const cur = activated.body.application as { id: string; version: number };
      const before = store.sideEffects;
      const closed = await api(baseUrl, "POST", `/applications/${cur.id}/close`, {
        token: admin.token,
        body: { version: cur.version },
      });
      assert.equal(closed.status, 200);
      assert.ok(store.sideEffects > before);
      assert.equal(dep.failures, 0);
    },
    { dep },
  );
});

test("clawback notifies dependency", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      const admin = await register(baseUrl, "claw@grantlane.test");
      const program = await api(baseUrl, "POST", "/programs", {
        token: admin.token,
        body: { name: "Claw" },
      });
      const programId = String((program.body.program as { id: string }).id);
      const app = await api(baseUrl, "POST", `/programs/${programId}/applications`, {
        token: admin.token,
        body: { orgName: "Claw Co", amountRequested: 2000 },
      });
      const application = app.body.application as { id: string; version: number };
      const activated = await activateApp(
        baseUrl,
        admin.token,
        application.id,
        application.version,
      );
      const cur = activated.body.application as { id: string; version: number };
      const m = await api(baseUrl, "POST", `/applications/${cur.id}/milestones`, {
        token: admin.token,
        body: { label: "Pay", amount: 500 },
      });
      const milestoneId = String((m.body.milestone as { id: string }).id);
      await api(baseUrl, "POST", `/milestones/${milestoneId}/pay`, {
        token: admin.token,
      });
      const before = store.sideEffects;
      const claw = await api(baseUrl, "POST", `/milestones/${milestoneId}/clawback`, {
        token: admin.token,
      });
      assert.equal(claw.status, 200);
      assert.ok(store.sideEffects > before);
      assert.equal(dep.failures, 0);
    },
    { dep },
  );
});
