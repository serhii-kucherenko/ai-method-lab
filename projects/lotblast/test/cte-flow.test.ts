import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import {
  addMember,
  createPlant,
  createStore,
  loadGraph,
  registerUser,
  writeReceiving,
  writeShipping,
  writeTransform,
} from "../src/store.js";
import { forwardBlast } from "../src/blast.js";

const plantLoc = {
  business_name: "Demo Plant",
  phone: "+1 555 0200",
  street_or_geo: "9 Pack Ave",
  city: "Oakland",
  region: "CA",
  postal_code: "94607",
  country: "",
};

const supplier = {
  business_name: "Supplier Co",
  phone: "+1 555 0100",
  street_or_geo: "1 Farm Rd",
  city: "Salinas",
  region: "CA",
  postal_code: "93901",
  country: "",
};

function partner(name: string) {
  return {
    business_name: name,
    phone: "+1 555 0300",
    street_or_geo: "2 Dist Way",
    city: "SF",
    region: "CA",
    postal_code: "94107",
    country: "",
  };
}

function recv(
  tlc: string,
  qty: number,
  kind: "ingredient" | "intermediate" | "finished",
  name: string,
  size: string,
) {
  return {
    tlc,
    qty,
    uom: kind === "finished" ? "cases" : "kg",
    kind,
    product: { product_name: name, packaging_size: size },
    previous_source: supplier,
    received_at: plantLoc,
    event_date: "2026-06-01",
    tlc_source: { kind: "reference", reference: `https://example.com/tlc/${tlc}` },
    reference_documents: [{ type: "BOL", number: `BOL-${tlc}` }],
  };
}

function xf(
  inputs: Array<{ tlc: string; qty: number }>,
  out: {
    tlc: string;
    qty: number;
    kind: "ingredient" | "intermediate" | "finished";
    name: string;
    size: string;
  },
) {
  return {
    inputs,
    output: {
      tlc: out.tlc,
      qty: out.qty,
      uom: out.kind === "finished" ? "cases" : "kg",
      kind: out.kind,
      product: { product_name: out.name, packaging_size: out.size },
    },
    transformed_at: plantLoc,
    tlc_source: { kind: "reference", reference: `https://example.com/tlc/${out.tlc}` },
    event_date: "2026-06-02",
    reference_documents: [{ type: "Work Order", number: `WO-${out.tlc}` }],
  };
}

function ship(id: string, tlc: string, qty: number, partnerName: string, name: string) {
  return {
    id,
    tlc,
    qty,
    uom: "cases",
    product: { product_name: name, packaging_size: "case" },
    subsequent_recipient: partner(partnerName),
    shipped_from: plantLoc,
    event_date: "2026-06-03",
    tlc_source: { kind: "reference", reference: `https://example.com/tlc/${tlc}` },
    reference_documents: [{ type: "BOL", number: `SHIP-${id}` }],
  };
}

function seedFixtureA(db: ReturnType<typeof createStore>["db"], plantId: string) {
  for (const r of [
    writeReceiving(
      db,
      plantId,
      recv("ING-A", 200, "ingredient", "Organic Spice Blend Base", "25kg bag"),
    ),
    writeReceiving(db, plantId, recv("ING-B", 100, "ingredient", "Control Flour", "25kg bag")),
  ]) {
    assert.equal(r.ok, true);
  }
  for (const t of [
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "ING-A", qty: 50 }], {
        tlc: "BAT-1",
        qty: 80,
        kind: "intermediate",
        name: "Batch Premix 1",
        size: "tote",
      }),
    ),
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "ING-A", qty: 50 }], {
        tlc: "BAT-2",
        qty: 80,
        kind: "intermediate",
        name: "Batch Premix 2",
        size: "tote",
      }),
    ),
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "ING-B", qty: 60 }], {
        tlc: "BAT-3",
        qty: 90,
        kind: "intermediate",
        name: "Batch Premix 3",
        size: "tote",
      }),
    ),
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "BAT-1", qty: 80 }], {
        tlc: "FG-1",
        qty: 70,
        kind: "finished",
        name: "Finished 1",
        size: "case",
      }),
    ),
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "BAT-2", qty: 80 }], {
        tlc: "FG-2",
        qty: 70,
        kind: "finished",
        name: "Finished 2",
        size: "case",
      }),
    ),
    writeTransform(
      db,
      plantId,
      xf([{ tlc: "BAT-3", qty: 90 }], {
        tlc: "FG-3",
        qty: 80,
        kind: "finished",
        name: "Finished 3",
        size: "case",
      }),
    ),
  ]) {
    assert.equal(t.ok, true, t.ok ? undefined : t.error);
  }
  for (const s of [
    writeShipping(db, plantId, ship("S-P1", "FG-1", 70, "P1", "Finished 1")),
    writeShipping(db, plantId, ship("S-P2", "FG-2", 70, "P2", "Finished 2")),
    writeShipping(db, plantId, ship("S-P3", "FG-3", 80, "P3", "Finished 3")),
  ]) {
    assert.equal(s.ok, true);
  }
}

test("fixture A via CTE store matches golden blast", () => {
  const store = createStore();
  const u = registerUser(store.db, "ops@ex.com", "x");
  const plant = createPlant(store.db, u.id, "Demo");
  seedFixtureA(store.db, plant.id);
  const blast = forwardBlast(loadGraph(store.db, plant.id), "ING-A");
  assert.deepEqual(blast.finished_tlcs, ["FG-1", "FG-2"]);
  assert.deepEqual(blast.shipment_ids, ["S-P1", "S-P2"]);
  assert.deepEqual(blast.notify_partners, ["P1", "P2"]);
});

test("HTTP: plant isolation, recall export, webhook, pagination, overconsume", async () => {
  const { server, store } = createApp({ rateLimit: 500 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  async function api(
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

  const regA = await api("POST", "/auth/register", undefined, {
    email: "a@ex.com",
    password: "pw",
  });
  assert.equal(regA.status, 201);
  const tokenA = String(regA.json.token);

  const regB = await api("POST", "/auth/register", undefined, {
    email: "b@ex.com",
    password: "pw",
  });
  const tokenB = String(regB.json.token);

  const plantRes = await api("POST", "/plants", tokenA, { name: "Plant A" });
  assert.equal(plantRes.status, 201);
  const plantId = String((plantRes.json.plant as { id: string }).id);

  const deny = await api(
    "POST",
    `/plants/${plantId}/receiving`,
    tokenB,
    recv("X", 1, "ingredient", "x", "1"),
  );
  assert.equal(deny.status, 403);

  seedFixtureA(store.db, plantId);

  const over = await api(
    "POST",
    `/plants/${plantId}/transformations`,
    tokenA,
    xf([{ tlc: "ING-A", qty: 9999 }], {
      tlc: "BAT-X",
      qty: 1,
      kind: "intermediate",
      name: "x",
      size: "1",
    }),
  );
  assert.equal(over.status, 409);
  assert.equal(over.json.error, "reject_overconsume");

  const blastPage = await api(
    "GET",
    `/plants/${plantId}/blast?suspect=ING-A&limit=3&offset=0`,
    tokenA,
  );
  assert.equal(blastPage.status, 200);
  assert.equal((blastPage.json.members as string[]).length, 3);
  assert.ok(Number(blastPage.json.total) > 3);

  const blocked = await api("POST", `/plants/${plantId}/recalls`, tokenA, {
    suspect_tlc: "ING-A",
  });
  assert.equal(blocked.status, 403);

  const userB = regB.json.user as { id: string };
  addMember(store.db, plantId, userB.id, "recall_admin");

  const recall = await api("POST", `/plants/${plantId}/recalls`, tokenB, {
    suspect_tlc: "ING-A",
  });
  assert.equal(recall.status, 201);
  const exp = recall.json.export as {
    blast: { finished_tlcs: string[]; notify_partners: string[] };
    sheets: { receiving: unknown[]; transformation: unknown[]; shipping: unknown[] };
  };
  assert.deepEqual(exp.blast.finished_tlcs, ["FG-1", "FG-2"]);
  assert.deepEqual(exp.blast.notify_partners, ["P1", "P2"]);
  assert.ok(exp.sheets.receiving.length >= 1);
  assert.ok(exp.sheets.transformation.length >= 2);
  assert.ok(exp.sheets.shipping.length >= 2);
  assert.equal(store.sideEffects, 1);

  const health = await api("GET", "/health");
  assert.equal(health.status, 200);
  assert.ok(Number(health.json.migrations) >= 1);

  const raw = Buffer.from(JSON.stringify({ ping: true }));
  const sig = createHmac("sha256", store.webhookSecret).update(raw).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: raw,
  });
  assert.equal(wh.status, 200);

  server.close();
});
