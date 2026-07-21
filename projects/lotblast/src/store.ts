import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import {
  forwardBlast,
  wouldOverconsume,
  type Graph,
  type Lot,
  type LotKind,
  type Shipment,
  type Transform,
} from "./blast.js";
import {
  asLocation,
  asProduct,
  asRefDocs,
  asTlcSource,
  validateReceiving,
  validateShipping,
  validateTransform,
  type LocationDescription,
  type MockRecallExport,
  type ProductDescription,
  type RecallRecord,
  type ReceivingRow,
  type RefDoc,
  type ShippingRow,
  type TlcSource,
  type TransformationRow,
} from "./cte.js";
import { openDatabase, type PlantRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { canTransition, isRecallState, type RecallState } from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, password);
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db.prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as
    | { id: string; email: string; password: string }
    | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db.prepare("SELECT user_id FROM tokens WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export function createPlant(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO plants (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO plant_members (plant_id, user_id, role) VALUES (?, ?, 'ops')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, plantId: string, userId: string, role: PlantRole) {
  db.prepare(
    `INSERT INTO plant_members (plant_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(plant_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(plantId, userId, role);
}

export function getRole(db: DatabaseSync, plantId: string, userId: string): PlantRole | null {
  const row = db
    .prepare("SELECT role FROM plant_members WHERE plant_id = ? AND user_id = ?")
    .get(plantId, userId) as { role: PlantRole } | undefined;
  return row?.role ?? null;
}

export function getPlant(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM plants WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  plantId: string,
  userId: string,
  mode: "read" | "write" | "recall",
): PlantRole | null {
  const role = getRole(db, plantId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "ops" || role === "recall_admin")) return role;
  if (mode === "recall" && role === "recall_admin") return role;
  return null;
}

function parseJson<T>(s: string): T {
  return JSON.parse(s) as T;
}

export function loadGraph(db: DatabaseSync, plantId: string): Graph {
  const lots = (
    db
      .prepare("SELECT tlc, kind, qty, uom FROM lots WHERE plant_id = ?")
      .all(plantId) as Array<{ tlc: string; kind: LotKind; qty: number; uom: string }>
  ).map(
    (r): Lot => ({
      tlc: r.tlc,
      kind: r.kind,
      qty: r.qty,
      uom: r.uom,
    }),
  );

  const transforms: Transform[] = [];
  const tevents = db
    .prepare(
      `SELECT id, output_tlc, scrap_qty, scrap_uom FROM transform_events WHERE plant_id = ?`,
    )
    .all(plantId) as Array<{
    id: string;
    output_tlc: string;
    scrap_qty: number | null;
    scrap_uom: string | null;
  }>;
  for (const t of tevents) {
    const inputs = (
      db
        .prepare("SELECT from_tlc AS tlc, qty FROM transform_inputs WHERE transform_id = ?")
        .all(t.id) as Array<{ tlc: string; qty: number }>
    ).map((i) => ({ tlc: i.tlc, qty: i.qty }));
    const tr: Transform = { inputs, output: t.output_tlc };
    if (t.scrap_qty != null) tr.scrap_qty = t.scrap_qty;
    if (t.scrap_uom != null) tr.scrap_uom = t.scrap_uom;
    transforms.push(tr);
  }

  const shipments: Shipment[] = (
    db
      .prepare(
        `SELECT id, tlc, qty, subsequent_recipient_json FROM shipping_events WHERE plant_id = ?`,
      )
      .all(plantId) as Array<{
      id: string;
      tlc: string;
      qty: number;
      subsequent_recipient_json: string;
    }>
  ).map((s) => {
    const partner = parseJson<{ business_name: string }>(s.subsequent_recipient_json)
      .business_name;
    return { id: s.id, tlc: s.tlc, qty: s.qty, partner };
  });

  return { lots, transforms, shipments };
}

type WriteResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

export function writeReceiving(
  db: DatabaseSync,
  plantId: string,
  body: Record<string, unknown>,
): WriteResult<{ tlc: string }> {
  const v = validateReceiving(body);
  if (!v.ok) return { ok: false, status: 400, error: v.error };
  const tlc = String(body.tlc);
  const existing = db
    .prepare("SELECT tlc FROM lots WHERE plant_id = ? AND tlc = ?")
    .get(plantId, tlc);
  if (existing) return { ok: false, status: 409, error: "tlc already exists" };

  const product = asProduct(body.product as Record<string, unknown>);
  const qty = Number(body.qty);
  const uom = String(body.uom);
  const kind = String(body.kind) as LotKind;
  const id = randomUUID();

  db.prepare(
    `INSERT INTO lots (plant_id, tlc, kind, qty, uom, product_json) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(plantId, tlc, kind, qty, uom, JSON.stringify(product));

  db.prepare(
    `INSERT INTO receiving_events (
      id, plant_id, tlc, qty, uom, product_json, previous_source_json, received_at_json,
      event_date, tlc_source_json, reference_documents_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    plantId,
    tlc,
    qty,
    uom,
    JSON.stringify(product),
    JSON.stringify(asLocation(body.previous_source as Record<string, unknown>)),
    JSON.stringify(asLocation(body.received_at as Record<string, unknown>)),
    String(body.event_date),
    JSON.stringify(asTlcSource(body.tlc_source as Record<string, unknown>)),
    JSON.stringify(asRefDocs(body.reference_documents as unknown[])),
  );

  return { ok: true, value: { tlc } };
}

export function writeTransform(
  db: DatabaseSync,
  plantId: string,
  body: Record<string, unknown>,
): WriteResult<{ id: string; output_tlc: string }> {
  const v = validateTransform(body);
  if (!v.ok) return { ok: false, status: 400, error: v.error };

  const graph = loadGraph(db, plantId);
  const inputs = (body.inputs as Array<{ tlc: string; qty: number }>).map((i) => ({
    tlc: String(i.tlc),
    qty: Number(i.qty),
  }));
  if (wouldOverconsume(graph, inputs)) {
    return { ok: false, status: 409, error: "reject_overconsume" };
  }

  const output = body.output as Record<string, unknown>;
  const outTlc = String(output.tlc);
  if (
    db.prepare("SELECT tlc FROM lots WHERE plant_id = ? AND tlc = ?").get(plantId, outTlc)
  ) {
    return { ok: false, status: 409, error: "output tlc already exists" };
  }
  for (const inp of inputs) {
    if (!db.prepare("SELECT tlc FROM lots WHERE plant_id = ? AND tlc = ?").get(plantId, inp.tlc)) {
      return { ok: false, status: 400, error: `unknown input ${inp.tlc}` };
    }
  }

  const product = asProduct(output.product as Record<string, unknown>);
  const id = randomUUID();
  const outQty = Number(output.qty);
  const outUom = String(output.uom);
  const outKind = String(output.kind) as LotKind;

  db.prepare(
    `INSERT INTO transform_events (
      id, plant_id, output_tlc, output_qty, output_uom, output_kind, output_product_json,
      scrap_qty, scrap_uom, transformed_at_json, tlc_source_json, event_date, reference_documents_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    plantId,
    outTlc,
    outQty,
    outUom,
    outKind,
    JSON.stringify(product),
    body.scrap_qty != null ? Number(body.scrap_qty) : null,
    body.scrap_uom != null ? String(body.scrap_uom) : null,
    JSON.stringify(asLocation(body.transformed_at as Record<string, unknown>)),
    JSON.stringify(asTlcSource(body.tlc_source as Record<string, unknown>)),
    String(body.event_date),
    JSON.stringify(asRefDocs(body.reference_documents as unknown[])),
  );

  for (const inp of inputs) {
    db.prepare(
      "INSERT INTO transform_inputs (transform_id, from_tlc, qty) VALUES (?, ?, ?)",
    ).run(id, inp.tlc, inp.qty);
  }

  db.prepare(
    `INSERT INTO lots (plant_id, tlc, kind, qty, uom, product_json) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(plantId, outTlc, outKind, outQty, outUom, JSON.stringify(product));

  return { ok: true, value: { id, output_tlc: outTlc } };
}

export function writeShipping(
  db: DatabaseSync,
  plantId: string,
  body: Record<string, unknown>,
): WriteResult<{ id: string }> {
  const v = validateShipping(body);
  if (!v.ok) return { ok: false, status: 400, error: v.error };
  const tlc = String(body.tlc);
  if (!db.prepare("SELECT tlc FROM lots WHERE plant_id = ? AND tlc = ?").get(plantId, tlc)) {
    return { ok: false, status: 400, error: "unknown tlc" };
  }
  const id = String(body.id ?? randomUUID());
  const product = asProduct(body.product as Record<string, unknown>);
  db.prepare(
    `INSERT INTO shipping_events (
      id, plant_id, tlc, qty, uom, product_json, subsequent_recipient_json, shipped_from_json,
      event_date, tlc_source_json, reference_documents_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    plantId,
    tlc,
    Number(body.qty),
    String(body.uom),
    JSON.stringify(product),
    JSON.stringify(asLocation(body.subsequent_recipient as Record<string, unknown>)),
    JSON.stringify(asLocation(body.shipped_from as Record<string, unknown>)),
    String(body.event_date),
    JSON.stringify(asTlcSource(body.tlc_source as Record<string, unknown>)),
    JSON.stringify(asRefDocs(body.reference_documents as unknown[])),
  );
  return { ok: true, value: { id } };
}

function lotProduct(db: DatabaseSync, plantId: string, tlc: string): ProductDescription {
  const row = db
    .prepare("SELECT product_json FROM lots WHERE plant_id = ? AND tlc = ?")
    .get(plantId, tlc) as { product_json: string } | undefined;
  if (!row) return { product_name: tlc, packaging_size: "?" };
  return parseJson<ProductDescription>(row.product_json);
}

export function listLots(db: DatabaseSync, plantId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT tlc, kind, qty, uom, product_json AS productJson FROM lots
       WHERE plant_id = ? ORDER BY tlc LIMIT ? OFFSET ?`,
    )
    .all(plantId, limit, offset) as Array<{
    tlc: string;
    kind: string;
    qty: number;
    uom: string;
    productJson: string;
  }>;
}

export function countLots(db: DatabaseSync, plantId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM lots WHERE plant_id = ?")
    .get(plantId) as { n: number };
  return Number(row.n);
}

export function listReceiving(db: DatabaseSync, plantId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, tlc, qty, uom, event_date AS eventDate FROM receiving_events
       WHERE plant_id = ? ORDER BY tlc LIMIT ? OFFSET ?`,
    )
    .all(plantId, limit, offset) as Array<{
    id: string;
    tlc: string;
    qty: number;
    uom: string;
    eventDate: string;
  }>;
}

export function listTransforms(db: DatabaseSync, plantId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, output_tlc AS outputTlc, output_qty AS outputQty, event_date AS eventDate
       FROM transform_events WHERE plant_id = ? ORDER BY output_tlc LIMIT ? OFFSET ?`,
    )
    .all(plantId, limit, offset) as Array<{
    id: string;
    outputTlc: string;
    outputQty: number;
    eventDate: string;
  }>;
}

export function listShipments(db: DatabaseSync, plantId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, tlc, qty, event_date AS eventDate FROM shipping_events
       WHERE plant_id = ? ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(plantId, limit, offset) as Array<{
    id: string;
    tlc: string;
    qty: number;
    eventDate: string;
  }>;
}

export function buildExport(
  db: DatabaseSync,
  plantId: string,
  recallId: string,
  lockedAt: string,
  suspectTlc: string,
): MockRecallExport {
  const graph = loadGraph(db, plantId);
  const blast = forwardBlast(graph, suspectTlc);
  const visited = blast.visited;

  const receiving: ReceivingRow[] = (
    db
      .prepare(`SELECT * FROM receiving_events WHERE plant_id = ?`)
      .all(plantId) as Array<Record<string, unknown>>
  )
    .filter((r) => visited.has(String(r.tlc)))
    .map((r) => ({
      tlc: String(r.tlc),
      qty: Number(r.qty),
      uom: String(r.uom),
      product: parseJson<ProductDescription>(String(r.product_json)),
      previous_source: parseJson<LocationDescription>(String(r.previous_source_json)),
      received_at: parseJson<LocationDescription>(String(r.received_at_json)),
      event_date: String(r.event_date),
      tlc_source: parseJson<TlcSource>(String(r.tlc_source_json)),
      reference_documents: parseJson<RefDoc[]>(String(r.reference_documents_json)),
    }))
    .sort((a, b) => a.tlc.localeCompare(b.tlc));

  const transformation: TransformationRow[] = [];
  const tevents = db
    .prepare(`SELECT * FROM transform_events WHERE plant_id = ?`)
    .all(plantId) as Array<Record<string, unknown>>;
  for (const t of tevents) {
    const inputs = db
      .prepare("SELECT from_tlc, qty FROM transform_inputs WHERE transform_id = ?")
      .all(String(t.id)) as Array<{ from_tlc: string; qty: number }>;
    const mentionsBlast =
      visited.has(String(t.output_tlc)) || inputs.some((i) => visited.has(i.from_tlc));
    if (!mentionsBlast) continue;
    for (const inp of inputs) {
      if (!visited.has(inp.from_tlc) && !visited.has(String(t.output_tlc))) continue;
      const fromLot = db
        .prepare("SELECT uom FROM lots WHERE plant_id = ? AND tlc = ?")
        .get(plantId, inp.from_tlc) as { uom: string } | undefined;
      transformation.push({
        from_tlc: inp.from_tlc,
        from_product: lotProduct(db, plantId, inp.from_tlc),
        from_qty_used: inp.qty,
        from_uom: fromLot?.uom ?? "?",
        to_tlc: String(t.output_tlc),
        to_product: parseJson<ProductDescription>(String(t.output_product_json)),
        to_qty: Number(t.output_qty),
        to_uom: String(t.output_uom),
        transformed_at: parseJson<LocationDescription>(String(t.transformed_at_json)),
        tlc_source: parseJson<TlcSource>(String(t.tlc_source_json)),
        event_date: String(t.event_date),
        reference_documents: parseJson<RefDoc[]>(String(t.reference_documents_json)),
      });
    }
  }
  transformation.sort(
    (a, b) => a.to_tlc.localeCompare(b.to_tlc) || a.from_tlc.localeCompare(b.from_tlc),
  );

  const shipping: ShippingRow[] = (
    db
      .prepare(`SELECT * FROM shipping_events WHERE plant_id = ?`)
      .all(plantId) as Array<Record<string, unknown>>
  )
    .filter((s) => visited.has(String(s.tlc)))
    .map((s) => ({
      tlc: String(s.tlc),
      qty: Number(s.qty),
      uom: String(s.uom),
      product: parseJson<ProductDescription>(String(s.product_json)),
      subsequent_recipient: parseJson<LocationDescription>(
        String(s.subsequent_recipient_json),
      ),
      shipped_from: parseJson<LocationDescription>(String(s.shipped_from_json)),
      event_date: String(s.event_date),
      tlc_source: parseJson<TlcSource>(String(s.tlc_source_json)),
      reference_documents: parseJson<RefDoc[]>(String(s.reference_documents_json)),
    }))
    .sort((a, b) => a.tlc.localeCompare(b.tlc));

  return {
    recall_id: recallId,
    locked_at: lockedAt,
    suspect_tlc: suspectTlc,
    blast: {
      finished_tlcs: blast.finished_tlcs,
      shipment_ids: blast.shipment_ids,
      notify_partners: blast.notify_partners,
      units_in_channel: blast.units_in_channel,
    },
    sheets: { receiving, transformation, shipping },
  };
}

export function openRecall(
  db: DatabaseSync,
  plantId: string,
  suspectTlc: string,
): WriteResult<RecallRecord> {
  if (!db.prepare("SELECT tlc FROM lots WHERE plant_id = ? AND tlc = ?").get(plantId, suspectTlc)) {
    return { ok: false, status: 400, error: "unknown suspect_tlc" };
  }
  const id = randomUUID();
  const exp = buildExport(db, plantId, id, "", suspectTlc);
  db.prepare(
    `INSERT INTO recalls (id, plant_id, suspect_tlc, locked_at, export_json, state, version)
     VALUES (?, ?, ?, '', ?, 'draft', 1)`,
  ).run(id, plantId, suspectTlc, JSON.stringify(exp));
  return { ok: true, value: getRecall(db, id)! };
}

export function getRecall(db: DatabaseSync, id: string): RecallRecord | undefined {
  const row = db
    .prepare(
      `SELECT id, plant_id AS plantId, suspect_tlc AS suspectTlc, state, version,
              locked_at AS lockedAt, export_json AS exportJson
       FROM recalls WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        plantId: string;
        suspectTlc: string;
        state: string;
        version: number;
        lockedAt: string;
        exportJson: string;
      }
    | undefined;
  if (!row || !isRecallState(row.state)) return undefined;
  return {
    id: row.id,
    plantId: row.plantId,
    suspectTlc: row.suspectTlc,
    state: row.state,
    version: row.version,
    lockedAt: row.lockedAt,
    export: parseJson<MockRecallExport>(row.exportJson),
  };
}

function writeAudit(
  db: DatabaseSync,
  recallId: string,
  actorId: string,
  from: RecallState,
  to: RecallState,
): void {
  db.prepare(
    `INSERT INTO recall_audit (id, recall_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), recallId, actorId, from, to);
}

export function listRecallAudit(db: DatabaseSync, recallId: string) {
  return db
    .prepare(
      `SELECT id, actor_id AS actorId, from_state AS fromState, to_state AS toState, at
       FROM recall_audit WHERE recall_id = ? ORDER BY at`,
    )
    .all(recallId) as Array<{
    id: string;
    actorId: string;
    fromState: string;
    toState: string;
    at: string;
  }>;
}

export function transitionRecall(
  db: DatabaseSync,
  recallId: string,
  actorId: string,
  to: RecallState,
  expectedVersion: number,
): WriteResult<RecallRecord> {
  const cur = getRecall(db, recallId);
  if (!cur) return { ok: false, status: 404, error: "not found" };
  if (cur.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(cur.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }

  let lockedAt = cur.lockedAt;
  let exp = cur.export;
  if (to === "locked") {
    lockedAt = new Date().toISOString();
    exp = buildExport(db, cur.plantId, cur.id, lockedAt, cur.suspectTlc);
  }

  const updated = db
    .prepare(
      `UPDATE recalls SET state = ?, version = version + 1, locked_at = ?, export_json = ?
       WHERE id = ? AND version = ?`,
    )
    .run(to, lockedAt, JSON.stringify(exp), recallId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  writeAudit(db, recallId, actorId, cur.state, to);
  return { ok: true, value: getRecall(db, recallId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  recallId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    "INSERT INTO webhook_deliveries (id, event, recall_id, payload) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), event, recallId, JSON.stringify(payload));
}

export function listBlastMembers(
  db: DatabaseSync,
  plantId: string,
  suspectTlc: string,
  limit: number,
  offset: number,
): { members: string[]; total: number } {
  const graph = loadGraph(db, plantId);
  const blast = forwardBlast(graph, suspectTlc);
  const all = [...blast.visited].sort();
  return { members: all.slice(offset, offset + limit), total: all.length };
}
