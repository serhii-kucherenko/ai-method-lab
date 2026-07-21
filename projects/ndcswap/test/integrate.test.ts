import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { createMockDep } from "../src/dep.js";

test("integrate: HMAC, idempotent webhook, dispense dep mapping", async () => {
  const { server } = createApp({ webhookSecret: "whsec_int" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const payload = JSON.stringify({ eventId: "evt-ns-1" });
  assert.equal(
    (
      await fetch(`${base}/webhooks/inbound`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-signature": "bad" },
        body: payload,
      })
    ).status,
    401,
  );
  const sig = createHmac("sha256", "whsec_int").update(payload).digest("hex");
  const first = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(first.status, 200);
  const second = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: payload,
  });
  assert.equal(((await second.json()) as { duplicate: boolean }).duplicate, true);
  server.close();

  const failDep = createMockDep({ failTimes: 1 });
  const { server: s2, store: st2 } = createApp({ dep: failDep });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const addr2 = s2.address();
  assert.ok(addr2 && typeof addr2 === "object");
  const base2 = `http://127.0.0.1:${addr2.port}`;

  const rph = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "f@ex.com", password: "pw" }),
  });
  const rphj = (await rph.json()) as { token: string; user: { id: string } };
  const mgr = await fetch(`${base2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "fm@ex.com", password: "pw" }),
  });
  const mgrj = (await mgr.json()) as { token: string; user: { id: string } };
  const ph = await fetch(`${base2}/pharmacies`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${rphj.token}`,
    },
    body: JSON.stringify({ name: "Fail" }),
  });
  const phj = (await ph.json()) as { pharmacy: { id: string } };
  addMember(st2.db, phj.pharmacy.id, mgrj.user.id, "rph_manager");
  const script = await fetch(`${base2}/pharmacies/${phj.pharmacy.id}/scripts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${rphj.token}`,
    },
    body: JSON.stringify({
      prescribed_ndc: "00093012301",
      candidate_ndc: "00173045601",
      te_code_prescribed: "AB",
      te_code_candidate: "AB",
      same_ingredient_strength_form: true,
      daw: 0,
      brand_medically_necessary: false,
    }),
  });
  const scriptj = (await script.json()) as { script: { id: string } };
  const fail = await fetch(`${base2}/scripts/${scriptj.script.id}/transition`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${mgrj.token}`,
    },
    body: JSON.stringify({ to: "dispensed", version: 1 }),
  });
  assert.equal(fail.status, 502);
  s2.close();
});
